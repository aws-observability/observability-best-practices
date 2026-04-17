import { SignatureV4 } from '@smithy/signature-v4';
import { Sha256 } from '@aws-crypto/sha256-js';
import { defaultProvider } from '@aws-sdk/credential-provider-node';
import {
  CloudWatchLogsClient,
  FilterLogEventsCommand,
  StartQueryCommand,
  GetQueryResultsCommand,
} from '@aws-sdk/client-cloudwatch-logs';
import type { REDMetrics, Trace, TraceSpan } from '$lib/types';
import https from 'https';

const region = process.env.AWS_REGION || 'eu-west-1';
const CW_LOG_GROUP = process.env.CW_LOG_GROUP || '/otel/demo';
const PROMQL_HOSTNAME = `monitoring.${region}.amazonaws.com`;

const cwLogsClient = new CloudWatchLogsClient({ region });

// ---------------------------------------------------------------------------
// PromQL helpers — queries go to the CloudWatch OTLP PromQL endpoint
// ---------------------------------------------------------------------------

interface PromMatrixResult {
  metric: Record<string, string>;
  values: [number, string][];
}

async function promQueryRange(
  promql: string,
  startSec: number,
  endSec: number,
  stepSec: number,
): Promise<PromMatrixResult[]> {
  const signer = new SignatureV4({
    service: 'monitoring',
    region,
    credentials: defaultProvider(),
    sha256: Sha256,
  });

  const signed = await signer.sign({
    method: 'GET',
    hostname: PROMQL_HOSTNAME,
    path: '/api/v1/query_range',
    protocol: 'https:',
    query: {
      query: promql,
      start: String(startSec),
      end: String(endSec),
      step: String(stepSec),
    },
    headers: { host: PROMQL_HOSTNAME },
  });

  const qs = new URLSearchParams(signed.query as Record<string, string>).toString();
  const fullPath = `${signed.path}?${qs}`;

  return new Promise((resolve, reject) => {
    const req = https.request(
      { hostname: PROMQL_HOSTNAME, path: fullPath, method: 'GET', headers: signed.headers as Record<string, string> },
      (res) => {
        let body = '';
        res.on('data', (d: Buffer) => (body += d));
        res.on('end', () => {
          if (res.statusCode !== 200) {
            console.error(`[cloudwatch] PromQL HTTP ${res.statusCode} for query: ${promql}`);
            console.error(`[cloudwatch] Response: ${body.substring(0, 500)}`);
            reject(new Error(`PromQL query failed (${res.statusCode}): ${body.substring(0, 200)}`));
            return;
          }
          try {
            const parsed = JSON.parse(body);
            const results = parsed.data?.result ?? [];
            if (results.length === 0) {
              console.warn(`[cloudwatch] PromQL returned empty result for: ${promql}`);
            }
            resolve(results);
          } catch {
            reject(new Error(`Invalid PromQL response: ${body.substring(0, 200)}`));
          }
        });
      },
    );
    req.on('error', reject);
    req.end();
  });
}

// ---------------------------------------------------------------------------
// RED metrics via PromQL on spanmetrics histogram
// ---------------------------------------------------------------------------

// The spanmetrics connector emits metrics with a "traces.span.metrics." prefix
// when routed through the OTel Collector to CloudWatch:
//   "traces.span.metrics.calls"    — Sum (monotonic counter) of span count
//   "traces.span.metrics.duration" — Histogram of span duration
//
// CloudWatch PromQL (Prometheus 3.0) label conventions for OTLP metrics:
//   Resource attributes  → @resource.<attr>   e.g. @resource.service.name
//   Datapoint attributes → bare or @datapoint. e.g. status.code
//   AWS metadata         → @aws.<field>
//
// All names are overridable via env vars to match your collector config.
const SVC_LABEL       = process.env.PROMQL_SVC_LABEL       || '@resource.service.name';
const CALLS_METRIC    = process.env.PROMQL_CALLS_METRIC    || 'traces.span.metrics.calls';
const DURATION_METRIC = process.env.PROMQL_DURATION_METRIC || 'traces.span.metrics.duration';

// Build a PromQL selector with UTF-8 quoted metric name and optional labels.
function sel(metric: string, extraLabels = ''): string {
  const labels = extraLabels ? `, ${extraLabels}` : '';
  return `{"${metric}"${labels}}`;
}

export async function getREDMetrics(
  services: string[],
  startTime: Date,
  endTime: Date,
  periodSeconds = 60,
): Promise<REDMetrics[]> {
  const startSec = Math.floor(startTime.getTime() / 1000);
  const endSec = Math.floor(endTime.getTime() / 1000);

  // "calls" is a monotonic Sum (counter), so we aggregate with plain sum.
  // "duration" is a Histogram, so histogram_quantile works for p99.
  const rateQuery    = `sum by ("${SVC_LABEL}") (${sel(CALLS_METRIC)})`;
  const errorQuery   = `sum by ("${SVC_LABEL}") (${sel(CALLS_METRIC, '"status.code"="STATUS_CODE_ERROR"')})`;
  const durationQuery = `histogram_quantile(0.99, sum by (le, "${SVC_LABEL}") (${sel(DURATION_METRIC)}))`;

  const [rateResults, errorResults, durationResults] = await Promise.all([
    promQueryRange(rateQuery, startSec, endSec, periodSeconds),
    promQueryRange(errorQuery, startSec, endSec, periodSeconds),
    promQueryRange(durationQuery, startSec, endSec, periodSeconds),
  ]);

  const svcFilter = services.length > 0 ? new Set(services) : null;

  // Index error & duration results by service for fast lookup
  const errorBySvc = new Map(errorResults.map(r => [r.metric[SVC_LABEL], r.values]));
  const durationBySvc = new Map(durationResults.map(r => [r.metric[SVC_LABEL], r.values]));

  const results: REDMetrics[] = [];

  for (const series of rateResults) {
    const svc = series.metric[SVC_LABEL];
    if (!svc || (svcFilter && !svcFilter.has(svc))) continue;
    const lower = svc.toLowerCase();
    if (lower.includes('loadgenerator') || lower.includes('load-generator') || lower.includes('flagd')) continue;

    const errValues = errorBySvc.get(svc) ?? [];
    const durValues = durationBySvc.get(svc) ?? [];

    // Build a timestamp→value map for errors and duration
    const errMap = new Map(errValues.map(([t, v]) => [t, parseFloat(v)]));
    const durMap = new Map(durValues.map(([t, v]) => [t, parseFloat(v)]));

    for (const [ts, val] of series.values) {
      results.push({
        timestamp: new Date(ts * 1000).toISOString(),
        service: svc,
        rate: parseFloat(val),
        errors: errMap.get(ts) ?? 0,
        duration: durMap.get(ts) ?? 0,
      });
    }
  }

  results.sort((a, b) => a.timestamp.localeCompare(b.timestamp));

  console.log(`[cloudwatch] PromQL returned ${results.length} RED data points for ${new Set(results.map(r => r.service)).size} services`);
  return results;
}

export async function getAllServicesREDMetrics(
  startTime: Date,
  endTime: Date,
): Promise<REDMetrics[]> {
  // Pass empty array = no filter, return all services
  return getREDMetrics([], startTime, endTime);
}

// ---------------------------------------------------------------------------
// Logs (unchanged — still uses CloudWatch Logs API)
// ---------------------------------------------------------------------------

export interface LogEntry {
  timestamp: number;
  message: string;
  severity: string;
  resourceAttributes: Record<string, string>;
}

export async function getServiceLogs(
  service: string,
  startTime: Date,
  endTime: Date,
  limit = 100,
): Promise<LogEntry[]> {
  console.log(`[cloudwatch] getServiceLogs: logGroup=${CW_LOG_GROUP} service=${service}`);
  try {
    const results: LogEntry[] = [];
    let nextToken: string | undefined;
    let totalScanned = 0;
    const MAX_SCAN = 5000;

    while (results.length < limit && totalScanned < MAX_SCAN) {
      const resp = await cwLogsClient.send(
        new FilterLogEventsCommand({
          logGroupName: CW_LOG_GROUP,
          startTime: startTime.getTime(),
          endTime: endTime.getTime(),
          limit: 500,
          nextToken,
        }),
      );
      const events = resp.events || [];
      totalScanned += events.length;

      for (const e of events) {
        if (!e.message) continue;
        try {
          const parsed = JSON.parse(e.message);
          const attrs: Record<string, string> = parsed?.resource?.attributes ?? {};
          const svcName = attrs['service.name'] ?? '';
          if (svcName !== service && !svcName.startsWith(service + '-') && !service.startsWith(svcName + '-')) continue;

          let body = parsed.body ?? e.message;
          if (typeof body !== 'string') body = JSON.stringify(body);
          const ts = parsed.timeUnixNano
            ? Math.floor(Number(parsed.timeUnixNano) / 1_000_000)
            : (e.timestamp || 0);
          const severity = parsed.severityText || '';

          // Convert all attribute values to strings
          const resourceAttributes: Record<string, string> = {};
          for (const [k, v] of Object.entries(attrs)) {
            resourceAttributes[k] = String(v);
          }

          results.push({ timestamp: ts, message: body, severity, resourceAttributes });
          if (results.length >= limit) break;
        } catch {
          continue;
        }
      }

      if (!resp.nextToken || events.length === 0) break;
      nextToken = resp.nextToken;
    }

    console.log(`[cloudwatch] getServiceLogs: scanned ${totalScanned} events, found ${results.length} for ${service}`);
    return results;
  } catch (err) {
    console.error(`[cloudwatch] getServiceLogs error:`, err);
    return [];
  }
}


// ---------------------------------------------------------------------------
// Traces via CloudWatch Transaction Search (aws/spans log group)
// ---------------------------------------------------------------------------
// When Transaction Search is enabled, OTLP spans are stored as structured
// logs in the `aws/spans` log group. We query them using CloudWatch Logs
// Insights, which supports filtering by span attributes like service name.

const SPANS_LOG_GROUP = process.env.CW_SPANS_LOG_GROUP || 'aws/spans';

async function runLogsInsightsQuery(
  query: string,
  startTime: Date,
  endTime: Date,
): Promise<Array<Record<string, string>>> {
  const startResp = await cwLogsClient.send(new StartQueryCommand({
    logGroupNames: [SPANS_LOG_GROUP],
    startTime: Math.floor(startTime.getTime() / 1000),
    endTime: Math.floor(endTime.getTime() / 1000),
    queryString: query,
    limit: 200,
  }));

  const queryId = startResp.queryId;
  if (!queryId) throw new Error('StartQuery returned no queryId');

  // Poll for results
  for (let attempt = 0; attempt < 30; attempt++) {
    await new Promise(r => setTimeout(r, 500));
    const resultsResp = await cwLogsClient.send(new GetQueryResultsCommand({ queryId }));
    const status = resultsResp.status;

    if (status === 'Complete' || status === 'Failed' || status === 'Cancelled') {
      if (status !== 'Complete') {
        console.error(`[traces] Logs Insights query ${status}`);
        return [];
      }
      // Convert results to simple key-value records
      return (resultsResp.results ?? []).map(row => {
        const record: Record<string, string> = {};
        for (const field of row) {
          if (field.field && field.value !== undefined) {
            record[field.field] = field.value;
          }
        }
        return record;
      });
    }
  }

  console.warn('[traces] Logs Insights query timed out');
  return [];
}

export async function getServiceTraces(
  service: string,
  startTime: Date,
  endTime: Date,
  limit = 20,
): Promise<Trace[]> {
  console.log(`[traces] getServiceTraces: service=${service} range=${startTime.toISOString()}..${endTime.toISOString()}`);
  try {
    // Step 1: Find distinct trace IDs for this service
    const traceIdQuery = `
      fields @timestamp, traceId
      | filter attributes.aws.local.service = '${service}'
      | stats count(*) as spanCount by traceId
      | sort spanCount desc
      | limit ${limit}
    `;

    const traceIdResults = await runLogsInsightsQuery(traceIdQuery, startTime, endTime);
    console.log(`[traces] Found ${traceIdResults.length} trace IDs for ${service}`);

    if (traceIdResults.length === 0) return [];

    const traceIds = traceIdResults.map(r => r.traceId).filter(Boolean);
    if (traceIds.length === 0) return [];

    // Step 2: Fetch all spans for those trace IDs
    const traceIdFilter = traceIds.map(id => `traceId = '${id}'`).join(' or ');
    const spansQuery = `
      fields @timestamp, traceId, spanId, parentSpanId, name, 
             attributes.aws.local.service as service,
             attributes.http.method as httpMethod,
             attributes.http.url as httpUrl,
             attributes.http.status_code as httpStatusCode,
             statusCode, durationNano, @message
      | filter ${traceIdFilter}
      | sort @timestamp asc
      | limit 1000
    `;

    const spanResults = await runLogsInsightsQuery(spansQuery, startTime, endTime);
    console.log(`[traces] Fetched ${spanResults.length} spans across ${traceIds.length} traces`);

    // Step 3: Group spans by traceId and build Trace objects
    const spansByTrace = new Map<string, TraceSpan[]>();

    for (const row of spanResults) {
      const traceId = row.traceId;
      if (!traceId) continue;

      const durationNano = parseInt(row.durationNano || '0');
      const durationMs = durationNano / 1_000_000;

      // Parse @timestamp (ISO string) to epoch ms
      const tsStr = row['@timestamp'];
      const startMs = tsStr ? new Date(tsStr).getTime() : 0;

      const attrs: Record<string, string> = {};
      if (row.httpMethod) attrs['http.method'] = row.httpMethod;
      if (row.httpUrl) attrs['http.url'] = row.httpUrl;
      if (row.httpStatusCode) attrs['http.status_code'] = row.httpStatusCode;

      // Parse extra attributes from @message if available
      try {
        const msg = JSON.parse(row['@message'] || '{}');
        if (msg.attributes) {
          for (const [k, v] of Object.entries(msg.attributes)) {
            if (typeof v === 'string' || typeof v === 'number') {
              attrs[k] = String(v);
            } else if (v && typeof v === 'object') {
              attrs[k] = JSON.stringify(v);
            }
          }
        }
      } catch {
        // @message may not be JSON
      }

      const statusRaw = (row.statusCode || '').toUpperCase();
      const statusCode: TraceSpan['statusCode'] =
        statusRaw.includes('ERROR') || statusRaw === '2' ? 'ERROR'
        : statusRaw.includes('OK') || statusRaw === '1' ? 'OK'
        : 'UNSET';

      const span: TraceSpan = {
        spanId: row.spanId || '',
        traceId,
        parentSpanId: row.parentSpanId || null,
        name: row.name || 'unknown',
        serviceName: row.service || 'unknown',
        startTime: startMs,
        duration: durationMs,
        statusCode,
        attributes: attrs,
      };

      if (!spansByTrace.has(traceId)) spansByTrace.set(traceId, []);
      spansByTrace.get(traceId)!.push(span);
    }

    // Build Trace objects
    const traces: Trace[] = [];
    for (const [traceId, spans] of spansByTrace) {
      if (spans.length === 0) continue;

      spans.sort((a, b) => a.startTime - b.startTime);
      const minStart = Math.min(...spans.map(s => s.startTime));
      const maxEnd = Math.max(...spans.map(s => s.startTime + s.duration));
      const services = [...new Set(spans.map(s => s.serviceName))];

      traces.push({
        traceId,
        spans,
        startTime: minStart,
        duration: maxEnd - minStart,
        services,
      });
    }

    traces.sort((a, b) => b.startTime - a.startTime);
    console.log(`[traces] Returning ${traces.length} traces (${traces.reduce((n, t) => n + t.spans.length, 0)} spans)`);
    return traces;
  } catch (err) {
    console.error(`[traces] getServiceTraces error:`, err);
    return [];
  }
}

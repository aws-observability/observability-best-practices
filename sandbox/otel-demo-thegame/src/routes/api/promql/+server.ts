import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { SignatureV4 } from '@smithy/signature-v4';
import { Sha256 } from '@aws-crypto/sha256-js';
import { defaultProvider } from '@aws-sdk/credential-provider-node';
import https from 'https';

const region = process.env.AWS_REGION || 'eu-west-1';
const PROMQL_HOSTNAME = `monitoring.${region}.amazonaws.com`;

export const POST: RequestHandler = async ({ request }) => {
  const body = await request.json();
  const { query } = body;

  if (!query || typeof query !== 'string' || !query.trim()) {
    return json({ error: 'Query is required' }, { status: 400 });
  }

  const trimmed = query.trim();

  // Basic PromQL syntax validation
  const validationError = validatePromQL(trimmed);
  if (validationError) {
    return json({ error: validationError }, { status: 400 });
  }

  const endSec = Math.floor(Date.now() / 1000);
  const rangeMin = Math.max(60, Math.min(10080, body.rangeMinutes ?? 180));
  const startSec = endSec - rangeMin * 60;
  // Target ~100 data points to keep responses fast
  const stepSec = Math.max(60, Math.ceil((rangeMin * 60) / 100));

  console.log(`[promql] range=${rangeMin}m step=${stepSec}s (~${Math.ceil((rangeMin * 60) / stepSec)} points)`);

  try {
    const signer = new SignatureV4({
      service: 'monitoring',
      region,
      credentials: defaultProvider(),
      sha256: Sha256,
    });

    const formBody = new URLSearchParams({
      query: trimmed,
      start: String(startSec),
      end: String(endSec),
      step: String(stepSec),
    }).toString();

    const signed = await signer.sign({
      method: 'POST',
      hostname: PROMQL_HOSTNAME,
      path: '/api/v1/query_range',
      protocol: 'https:',
      headers: {
        host: PROMQL_HOSTNAME,
        'content-type': 'application/x-www-form-urlencoded',
        'content-length': String(Buffer.byteLength(formBody)),
      },
      body: formBody,
    });

    const result = await new Promise<{ status: number; body: string }>((resolve, reject) => {
      let settled = false;
      const timer = setTimeout(() => {
        if (!settled) { settled = true; req.destroy(); reject(new Error('Query timed out after 25s — try a shorter range or a simpler query.')); }
      }, 25_000);

      const req = https.request(
        {
          hostname: PROMQL_HOSTNAME,
          path: '/api/v1/query_range',
          method: 'POST',
          headers: signed.headers as Record<string, string>,
        },
        (res) => {
          let data = '';
          res.on('data', (d: Buffer) => (data += d));
          res.on('end', () => {
            if (!settled) { settled = true; clearTimeout(timer); resolve({ status: res.statusCode || 500, body: data }); }
          });
        },
      );
      req.on('error', (err) => {
        if (!settled) { settled = true; clearTimeout(timer); reject(err); }
      });
      req.write(formBody);
      req.end();
    });

    if (result.status !== 200) {
      const parsed = tryParseJSON(result.body);
      const msg = parsed?.error || parsed?.message || result.body.substring(0, 300);
      return json({ error: `CloudWatch returned ${result.status}: ${msg}` }, { status: 502 });
    }

    const parsed = JSON.parse(result.body);

    // Detect histogram results and normalize them for the frontend
    const resultType = parsed.data?.resultType;
    const results = parsed.data?.result ?? [];
    const isHistogram = results.length > 0 && (
      Array.isArray(results[0].histograms) || results[0].histogram != null
    );

    if (isHistogram) {
      // Convert native histogram data into a structured format the frontend can render
      const normalized = results.map((series: any) => {
        const histEntries: any[] = series.histograms ?? (series.histogram ? [series.histogram] : []);
        return {
          metric: series.metric,
          histograms: histEntries,
        };
      });
      return json({
        data: { resultType: 'histogram', result: normalized },
        startSec,
        endSec,
        stepSec,
      });
    }

    return json({
      data: parsed.data,
      startSec,
      endSec,
      stepSec,
    });
  } catch (err: any) {
    console.error('[promql] Query failed:', err.message);
    return json({ error: err.message }, { status: 500 });
  }
};

function tryParseJSON(s: string): any {
  try { return JSON.parse(s); } catch { return null; }
}

function validatePromQL(query: string): string | null {
  // Reject empty
  if (!query) return 'Query cannot be empty.';

  // Check balanced parentheses
  let depth = 0;
  for (const ch of query) {
    if (ch === '(') depth++;
    else if (ch === ')') depth--;
    if (depth < 0) return 'Unbalanced parentheses: unexpected ")".';
  }
  if (depth !== 0) return `Unbalanced parentheses: ${depth} unclosed "(".`;

  // Check balanced braces
  depth = 0;
  for (const ch of query) {
    if (ch === '{') depth++;
    else if (ch === '}') depth--;
    if (depth < 0) return 'Unbalanced braces: unexpected "}".';
  }
  if (depth !== 0) return `Unbalanced braces: ${depth} unclosed "{".`;

  // Check balanced brackets
  depth = 0;
  for (const ch of query) {
    if (ch === '[') depth++;
    else if (ch === ']') depth--;
    if (depth < 0) return 'Unbalanced brackets: unexpected "]".';
  }
  if (depth !== 0) return `Unbalanced brackets: ${depth} unclosed "[".`;

  // Check for obviously incomplete expressions
  if (/[+\-*/=!<>~,]\s*$/.test(query)) {
    return 'Query appears incomplete — ends with an operator.';
  }

  return null;
}

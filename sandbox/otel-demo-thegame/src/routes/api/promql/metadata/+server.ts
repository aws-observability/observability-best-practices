import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { SignatureV4 } from '@smithy/signature-v4';
import { Sha256 } from '@aws-crypto/sha256-js';
import { defaultProvider } from '@aws-sdk/credential-provider-node';
import https from 'https';

const region = process.env.AWS_REGION || 'eu-west-1';
const PROMQL_HOSTNAME = `monitoring.${region}.amazonaws.com`;

async function signedGet(path: string, query: Record<string, string> = {}): Promise<any> {
  const signer = new SignatureV4({
    service: 'monitoring',
    region,
    credentials: defaultProvider(),
    sha256: Sha256,
  });

  const signed = await signer.sign({
    method: 'GET',
    hostname: PROMQL_HOSTNAME,
    path,
    protocol: 'https:',
    query,
    headers: { host: PROMQL_HOSTNAME },
  });

  const qs = new URLSearchParams(signed.query as Record<string, string>).toString();
  const fullPath = qs ? `${signed.path}?${qs}` : signed.path;

  return new Promise((resolve, reject) => {
    const req = https.request(
      { hostname: PROMQL_HOSTNAME, path: fullPath, method: 'GET', headers: signed.headers as Record<string, string> },
      (res) => {
        let body = '';
        res.on('data', (d: Buffer) => (body += d));
        res.on('end', () => {
          if (res.statusCode !== 200) {
            reject(new Error(`HTTP ${res.statusCode}: ${body.substring(0, 300)}`));
            return;
          }
          try { resolve(JSON.parse(body)); }
          catch { reject(new Error(`Invalid JSON: ${body.substring(0, 200)}`)); }
        });
      },
    );
    req.on('error', reject);
    req.end();
  });
}

// Cache to avoid hammering the API on every keystroke
let cache: { metrics: string[]; labels: string[]; ts: number } | null = null;
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

export const GET: RequestHandler = async () => {
  if (cache && Date.now() - cache.ts < CACHE_TTL) {
    return json({ metrics: cache.metrics, labels: cache.labels });
  }

  try {
    const [metricsResp, labelsResp] = await Promise.all([
      signedGet('/api/v1/label/__name__/values'),
      signedGet('/api/v1/labels'),
    ]);

    const metrics: string[] = (metricsResp.data ?? []).sort();
    const labels: string[] = (labelsResp.data ?? []).filter((l: string) => l !== '__name__').sort();

    cache = { metrics, labels, ts: Date.now() };
    return json({ metrics, labels });
  } catch (err: any) {
    console.error('[promql/metadata]', err.message);
    // Return empty rather than failing — autocomplete is best-effort
    return json({ metrics: [], labels: [], error: err.message });
  }
};

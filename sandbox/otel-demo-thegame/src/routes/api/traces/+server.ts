import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getServiceTraces } from '$lib/server/cloudwatch';

export const GET: RequestHandler = async ({ url }) => {
  const service = url.searchParams.get('service');
  if (!service) return json({ error: 'service param required' }, { status: 400 });

  const minutes = parseInt(url.searchParams.get('minutes') || '60');
  const endTime = new Date();
  const startTime = new Date(endTime.getTime() - minutes * 60 * 1000);

  try {
    const traces = await getServiceTraces(service, startTime, endTime);
    return json({ traces });
  } catch (err: any) {
    console.error(`[api/traces] Error fetching traces for ${service}:`, err);
    const message = err?.name === 'AccessDeniedException'
      ? `Access denied — ensure the IAM role has xray:GetTraceSummaries and xray:BatchGetTraces permissions`
      : err.message;
    return json({ error: message, traces: [] }, { status: 500 });
  }
};

import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getAllServicesREDMetrics, getREDMetrics } from '$lib/server/cloudwatch';

export const GET: RequestHandler = async ({ url }) => {
  const service = url.searchParams.get('service');
  const minutes = parseInt(url.searchParams.get('minutes') || '15');
  const endTime = new Date();
  const startTime = new Date(endTime.getTime() - minutes * 60 * 1000);

  try {
    const metrics = service
      ? await getREDMetrics([service], startTime, endTime)
      : await getAllServicesREDMetrics(startTime, endTime);

    console.log(`[metrics] Fetched ${metrics.length} data points for ${service || 'all services'} (${minutes}m window)`);

    return json({ metrics, startTime: startTime.toISOString(), endTime: endTime.toISOString() });
  } catch (err: any) {
    console.error(`[metrics] CloudWatch query failed:`, err.message);
    return json({ error: err.message, metrics: [] }, { status: 500 });
  }
};

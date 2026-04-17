import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getServiceLogs } from '$lib/server/cloudwatch';

export const GET: RequestHandler = async ({ url }) => {
  const service = url.searchParams.get('service');
  if (!service) return json({ error: 'service param required' }, { status: 400 });

  const minutes = parseInt(url.searchParams.get('minutes') || '60');
  const endTime = new Date();
  const startTime = new Date(endTime.getTime() - minutes * 60 * 1000);

  try {
    const logs = await getServiceLogs(service, startTime, endTime);
    return json({ logs });
  } catch (err: any) {
    return json({ error: err.message, logs: [] }, { status: 500 });
  }
};

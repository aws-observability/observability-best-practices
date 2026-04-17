import { json } from '@sveltejs/kit';
import { OTEL_SERVICES } from '$lib/types';
import { getDeploymentStatus } from '$lib/server/k8s';
import { resolveDeployment } from '$lib/server/discovery';

export async function GET() {
  const statuses = await Promise.all(
    OTEL_SERVICES.map(async (svc) => {
      try {
        const deploymentName = await resolveDeployment(svc.name);
        const status = await getDeploymentStatus(svc.namespace, deploymentName);
        return { ...svc, deployment: deploymentName, ...status };
      } catch {
        return { ...svc, replicas: 0, readyReplicas: 0, availableReplicas: 0 };
      }
    })
  );
  return json({ services: statuses });
}

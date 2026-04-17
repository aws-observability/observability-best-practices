import { appsApi } from './k8s';
import { OTEL_SERVICES } from '$lib/types';

const NAMESPACE = 'otel-demo';

// Maps service name (e.g. "checkout") → actual K8s deployment name (e.g. "otel-demo-checkout")
let deploymentMap: Map<string, string> | null = null;

/**
 * Discovers actual deployment names in the otel-demo namespace and maps them
 * to our service definitions. The Helm chart naming varies by version, so we
 * match by checking if the deployment name contains the service's search hint.
 *
 * Results are cached after the first successful call.
 */
export async function discoverDeployments(): Promise<Map<string, string>> {
  if (deploymentMap) return deploymentMap;

  const resp = await appsApi().listNamespacedDeployment({ namespace: NAMESPACE });
  const allDeployments = resp.items.map(d => d.metadata!.name!);

  deploymentMap = new Map();

  for (const svc of OTEL_SERVICES) {
    // Find the deployment whose name contains the service's search hint.
    // E.g. hint "checkout" matches "otel-demo-checkoutservice" or "otel-demo-checkout"
    const match = allDeployments.find(d => {
      const lower = d.toLowerCase();
      const hint = svc.deployment.toLowerCase();
      return lower.includes(hint);
    });
    if (match) {
      deploymentMap.set(svc.name, match);
    }
  }

  return deploymentMap;
}

/**
 * Resolves a service name to its actual K8s deployment name.
 * Throws if the service is not found.
 */
export async function resolveDeployment(serviceName: string): Promise<string> {
  const map = await discoverDeployments();
  const dep = map.get(serviceName);
  if (!dep) {
    // Invalidate cache and retry once
    deploymentMap = null;
    const retryMap = await discoverDeployments();
    const retryDep = retryMap.get(serviceName);
    if (!retryDep) {
      throw new Error(`No deployment found for service '${serviceName}'. Available: ${[...retryMap.entries()].map(([k,v]) => `${k}=${v}`).join(', ')}`);
    }
    return retryDep;
  }
  return dep;
}

/** Invalidate the cached deployment map (e.g. after a cleanup/restart). */
export function invalidateDiscoveryCache() {
  deploymentMap = null;
}

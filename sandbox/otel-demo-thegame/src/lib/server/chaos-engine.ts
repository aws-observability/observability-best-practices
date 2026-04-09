import { SCENARIOS } from '$lib/scenarios';
import { OTEL_SERVICES } from '$lib/types';
import type { ChaosScenario } from '$lib/types';
import { deletePod, listPods, scaleDeployment, patchDeploymentResources, setEnvVar } from './k8s';
import { resolveDeployment, invalidateDiscoveryCache } from './discovery';
import { enableFlag, restoreFlags } from './flagd';

const NAMESPACE = 'otel-demo';

// Track original state for cleanup. Key = actual deployment name.
const originalState: Map<string, Record<string, unknown>> = new Map();

/** Resolve a service name (e.g. "checkout") to its real K8s deployment name. */
async function dep(serviceName: string): Promise<string> {
  return resolveDeployment(serviceName);
}

export function pickRandomScenario(): ChaosScenario {
  return SCENARIOS[Math.floor(Math.random() * SCENARIOS.length)];
}

export async function triggerScenario(scenario: ChaosScenario): Promise<{ success: boolean; message: string }> {
  try {
    switch (scenario.id) {
      // Pod kills
      case 'kill-checkout':
        return await killServicePod(await dep('checkout'));
      case 'kill-payment':
        return await killServicePod(await dep('payment'));
      case 'kill-cart':
        return await killServicePod(await dep('cart'));
      case 'kill-product-catalog':
        return await killServicePod(await dep('product-catalog'));
      case 'kill-currency':
        return await killServicePod(await dep('currency'));
      case 'kill-fraud-detection':
        return await killServicePod(await dep('fraud-detection'));

      // Load spikes
      case 'load-frontend':
        return await spikeLoadGenerator(500);
      case 'load-checkout-spike':
        return await spikeLoadGenerator(300);
      case 'load-currency-saturation':
        return await spikeLoadGenerator(400);
      case 'load-recommendation-spike':
        return await spikeLoadGenerator(350);

      // Resource pressure
      case 'cpu-pressure-recommendation':
        return await constrainCpu(await dep('recommendation'), '10m');
      case 'memory-pressure-cart':
        return await constrainMemory(await dep('cart'), '32Mi');
      case 'memory-pressure-ad':
        return await constrainMemory(await dep('ad'), '64Mi');
      case 'cpu-pressure-frontend':
        return await constrainCpu(await dep('frontend'), '10m');

      // Network faults
      case 'network-partition-shipping':
        return await injectNetworkDelay(await dep('shipping'), '10000ms');
      case 'network-drop-email':
        return await injectPacketLoss(await dep('email'), 50);
      case 'network-latency-product-catalog':
        return await injectNetworkDelay(await dep('product-catalog'), '3000ms');

      // Config faults
      case 'config-fault-frontend-env':
        return await corruptEnvVar(await dep('frontend'), 'CHECKOUT_SERVICE_ADDR', 'invalid-host:9999');
      case 'config-fault-quote-crash':
        return await corruptEnvVar(await dep('quote'), 'QUOTE_SERVICE_PORT', 'not-a-port');

      // Feature flags (via flagd)
      case 'flag-ad-service-failure':
        return await enableFlag('adFailure');
      case 'flag-ad-service-high-cpu':
        return await enableFlag('adHighCpu');
      case 'flag-ad-service-manual-gc':
        return await enableFlag('adManualGc');
      case 'flag-cart-service-failure':
        return await enableFlag('cartFailure');
      case 'flag-payment-service-failure':
        return await enableFlag('paymentFailure');
      case 'flag-payment-service-unreachable':
        return await enableFlag('paymentUnreachable');
      case 'flag-product-catalog-failure':
        return await enableFlag('productCatalogFailure');
      case 'flag-recommendation-cache-failure':
        return await enableFlag('recommendationCacheFailure');
      case 'flag-kafka-queue-problems':
        return await enableFlag('kafkaQueueProblems');
      case 'flag-image-slow-load':
        return await enableFlag('imageSlowLoad');

      default:
        return { success: false, message: `Unknown scenario: ${scenario.id}` };
    }
  } catch (err: any) {
    return { success: false, message: `Trigger failed: ${err.message}` };
  }
}

async function killServicePod(deploymentName: string): Promise<{ success: boolean; message: string }> {
  // Find pods belonging to this deployment
  const pods = await listPods(NAMESPACE);
  const depPods = pods.filter(p =>
    p.metadata?.labels?.['app.kubernetes.io/component']?.includes(deploymentName.replace(/^otel-demo-/, '')) ||
    p.metadata?.name?.includes(deploymentName.replace(/^otel-demo-/, ''))
  );

  if (depPods.length > 0) {
    await deletePod(NAMESPACE, depPods[0].metadata!.name!);
  }
  // Scale to 0 to prevent restart
  await scaleDeployment(NAMESPACE, deploymentName, 0);
  originalState.set(deploymentName, { action: 'scale', replicas: 1 });
  return { success: true, message: `Killed ${deploymentName} and scaled to 0` };
}

async function spikeLoadGenerator(users: number): Promise<{ success: boolean; message: string }> {
  // Load generator is not in OTEL_SERVICES (excluded from chaos), so resolve directly
  const deploymentName = await resolveLoadGenerator();
  await setEnvVar(NAMESPACE, deploymentName, 'LOCUST_USERS', String(users));
  await setEnvVar(NAMESPACE, deploymentName, 'LOCUST_SPAWN_RATE', String(Math.floor(users / 5)));
  originalState.set(deploymentName, { action: 'env', vars: { LOCUST_USERS: '10', LOCUST_SPAWN_RATE: '1' } });
  return { success: true, message: `Load generator spiked to ${users} users` };
}

/** Find the load-generator deployment by scanning the namespace directly. */
async function resolveLoadGenerator(): Promise<string> {
  const { appsApi: getAppsApi } = await import('./k8s');
  const resp = await getAppsApi().listNamespacedDeployment({ namespace: NAMESPACE });
  const match = resp.items.find(d => d.metadata?.name?.toLowerCase().includes('loadgenerator') || d.metadata?.name?.toLowerCase().includes('load-generator'));
  if (!match?.metadata?.name) throw new Error('Load generator deployment not found');
  return match.metadata.name;
}

async function constrainCpu(deploymentName: string, limit: string): Promise<{ success: boolean; message: string }> {
  await patchDeploymentResources(NAMESPACE, deploymentName, 0, { limits: { cpu: limit } });
  originalState.set(deploymentName, { action: 'resources', type: 'cpu' });
  return { success: true, message: `CPU constrained to ${limit} on ${deploymentName}` };
}

async function constrainMemory(deploymentName: string, limit: string): Promise<{ success: boolean; message: string }> {
  await patchDeploymentResources(NAMESPACE, deploymentName, 0, { limits: { memory: limit } });
  originalState.set(deploymentName, { action: 'resources', type: 'memory' });
  return { success: true, message: `Memory constrained to ${limit} on ${deploymentName}` };
}

async function injectNetworkDelay(deploymentName: string, delay: string): Promise<{ success: boolean; message: string }> {
  // Instead of using `tc` (which requires iproute2 in the container), we inject
  // an HTTP_PROXY pointing at a non-routable address. This causes upstream calls
  // to hang until they time out, simulating severe network delay. Cleanup restores
  // the deployment via scale-down/up cycle.
  await setEnvVar(NAMESPACE, deploymentName, 'HTTP_PROXY', 'http://192.0.2.1:1');
  await setEnvVar(NAMESPACE, deploymentName, 'HTTPS_PROXY', 'http://192.0.2.1:1');
  originalState.set(deploymentName, { action: 'network', vars: { HTTP_PROXY: '', HTTPS_PROXY: '' } });
  return { success: true, message: `Injected network delay on ${deploymentName} via proxy to non-routable address (simulates ${delay} delay)` };
}

async function injectPacketLoss(deploymentName: string, percent: number): Promise<{ success: boolean; message: string }> {
  // Instead of using `tc` (which requires iproute2 in the container), we point
  // the service at a non-routable proxy. For packet-loss simulation this causes
  // intermittent failures on all outbound connections. Cleanup restores the
  // deployment via scale-down/up cycle.
  await setEnvVar(NAMESPACE, deploymentName, 'HTTP_PROXY', 'http://192.0.2.1:1');
  await setEnvVar(NAMESPACE, deploymentName, 'HTTPS_PROXY', 'http://192.0.2.1:1');
  originalState.set(deploymentName, { action: 'network', vars: { HTTP_PROXY: '', HTTPS_PROXY: '' } });
  return { success: true, message: `Injected packet loss on ${deploymentName} via proxy to non-routable address (simulates ${percent}% loss)` };
}

async function corruptEnvVar(deploymentName: string, envName: string, badValue: string): Promise<{ success: boolean; message: string }> {
  await setEnvVar(NAMESPACE, deploymentName, envName, badValue);
  originalState.set(deploymentName, { action: 'env', vars: { [envName]: '' } });
  return { success: true, message: `Set ${envName}=${badValue} on ${deploymentName}` };
}

export async function cleanupScenario(scenario: ChaosScenario): Promise<{ success: boolean; message: string }> {
  const messages: string[] = [];

  // Feature-flag scenarios: restore flagd config instead of touching deployments
  if (scenario.category === 'feature-flag') {
    const result = await restoreFlags();
    return result;
  }

  // Load-spike scenarios: restore the load generator first
  if (scenario.category === 'load-spike') {
    try {
      const lgDep = await resolveLoadGenerator();
      const lgState = originalState.get(lgDep);
      if (lgState) {
        await scaleDeployment(NAMESPACE, lgDep, 0);
        await new Promise(r => setTimeout(r, 2000));
        await scaleDeployment(NAMESPACE, lgDep, 1);
        originalState.delete(lgDep);
        messages.push(`Restarted ${lgDep}`);
      }
    } catch (err: any) {
      messages.push(`Load generator cleanup: ${err.message}`);
    }
  }

  for (const svcName of scenario.targetServices) {
    let deploymentName: string;
    try {
      deploymentName = await dep(svcName);
    } catch {
      messages.push(`Could not resolve deployment for ${svcName}, skipping`);
      continue;
    }

    const state = originalState.get(deploymentName);
    if (!state) {
      await scaleDeployment(NAMESPACE, deploymentName, 1);
      messages.push(`Restored ${deploymentName}`);
      continue;
    }
    switch (state.action) {
      case 'scale':
        await scaleDeployment(NAMESPACE, deploymentName, (state as any).replicas || 1);
        messages.push(`Scaled ${deploymentName} back to ${(state as any).replicas || 1}`);
        break;
      case 'env':
      case 'resources':
      case 'network':
        await scaleDeployment(NAMESPACE, deploymentName, 0);
        await new Promise(r => setTimeout(r, 2000));
        await scaleDeployment(NAMESPACE, deploymentName, 1);
        messages.push(`Restarted ${deploymentName}`);
        break;
    }
    originalState.delete(deploymentName);
  }
  invalidateDiscoveryCache();
  return { success: true, message: messages.join('; ') };
}

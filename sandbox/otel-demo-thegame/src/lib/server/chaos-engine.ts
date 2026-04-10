import { SCENARIOS } from '$lib/scenarios';
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

/**
 * Resolve infrastructure components (collector, kafka, valkey) that aren't
 * in OTEL_SERVICES. Searches both Deployments and StatefulSets.
 */
async function resolveInfra(hint: string): Promise<string> {
  const { appsApi: getAppsApi } = await import('./k8s');
  const api = getAppsApi();

  // Check Deployments first
  const deps = await api.listNamespacedDeployment({ namespace: NAMESPACE });
  const depMatch = deps.items.find(d =>
    d.metadata?.name?.toLowerCase().includes(hint.toLowerCase())
  );
  if (depMatch?.metadata?.name) return depMatch.metadata.name;

  // Check StatefulSets (Kafka, Valkey)
  const stsList = await api.listNamespacedStatefulSet({ namespace: NAMESPACE });
  const stsMatch = stsList.items.find(s =>
    s.metadata?.name?.toLowerCase().includes(hint.toLowerCase())
  );
  if (stsMatch?.metadata?.name) return stsMatch.metadata.name;

  throw new Error(`Infrastructure component "${hint}" not found in namespace ${NAMESPACE}`);
}

/** Find the load-generator deployment by scanning the namespace directly. */
async function resolveLoadGenerator(): Promise<string> {
  const { appsApi: getAppsApi } = await import('./k8s');
  const resp = await getAppsApi().listNamespacedDeployment({ namespace: NAMESPACE });
  const match = resp.items.find(d =>
    d.metadata?.name?.toLowerCase().includes('loadgenerator') ||
    d.metadata?.name?.toLowerCase().includes('load-generator')
  );
  if (!match?.metadata?.name) throw new Error('Load generator deployment not found');
  return match.metadata.name;
}

export function pickRandomScenario(): ChaosScenario {
  return SCENARIOS[Math.floor(Math.random() * SCENARIOS.length)];
}

// ─── Compound & Staggered Trigger Helpers ──────────────────────────

/**
 * Fire multiple faults simultaneously. Returns combined result.
 */
async function triggerCompound(
  faults: Array<() => Promise<{ success: boolean; message: string }>>
): Promise<{ success: boolean; message: string }> {
  const results = await Promise.allSettled(faults.map(f => f()));
  const msgs = results.map((r, i) =>
    r.status === 'fulfilled' ? r.value.message : `Fault ${i} failed: ${(r as PromiseRejectedResult).reason}`
  );
  return {
    success: results.every(r => r.status === 'fulfilled' && r.value.success),
    message: msgs.join('; ')
  };
}

/**
 * Fire faults with delays between them. The first fault fires immediately
 * (delayMs=0), subsequent faults fire after their specified delay.
 */
async function triggerStaggered(
  faults: Array<{ fn: () => Promise<{ success: boolean; message: string }>; delayMs: number }>
): Promise<{ success: boolean; message: string }> {
  const msgs: string[] = [];
  for (const { fn, delayMs } of faults) {
    if (delayMs > 0) await new Promise(r => setTimeout(r, delayMs));
    const result = await fn();
    msgs.push(result.message);
  }
  return { success: true, message: msgs.join('; ') };
}

// ─── Fault Injection Primitives ────────────────────────────────────

async function killServicePod(deploymentName: string): Promise<{ success: boolean; message: string }> {
  const pods = await listPods(NAMESPACE);
  const depPods = pods.filter(p =>
    p.metadata?.labels?.['app.kubernetes.io/component']?.includes(deploymentName.replace(/^otel-demo-/, '')) ||
    p.metadata?.name?.includes(deploymentName.replace(/^otel-demo-/, ''))
  );
  if (depPods.length > 0) {
    await deletePod(NAMESPACE, depPods[0].metadata!.name!);
  }
  await scaleDeployment(NAMESPACE, deploymentName, 0);
  originalState.set(deploymentName, { action: 'scale', replicas: 1 });
  return { success: true, message: `Killed ${deploymentName} and scaled to 0` };
}

async function spikeLoadGenerator(users: number): Promise<{ success: boolean; message: string }> {
  const deploymentName = await resolveLoadGenerator();
  await setEnvVar(NAMESPACE, deploymentName, 'LOCUST_USERS', String(users));
  await setEnvVar(NAMESPACE, deploymentName, 'LOCUST_SPAWN_RATE', String(Math.floor(users / 5)));
  originalState.set(deploymentName, { action: 'env', vars: { LOCUST_USERS: '10', LOCUST_SPAWN_RATE: '1' } });
  return { success: true, message: `Load generator spiked to ${users} users` };
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

async function injectNetworkPartition(deploymentName: string): Promise<{ success: boolean; message: string }> {
  await setEnvVar(NAMESPACE, deploymentName, 'HTTP_PROXY', 'http://192.0.2.1:1');
  await setEnvVar(NAMESPACE, deploymentName, 'HTTPS_PROXY', 'http://192.0.2.1:1');
  originalState.set(deploymentName, { action: 'network', vars: { HTTP_PROXY: '', HTTPS_PROXY: '' } });
  return { success: true, message: `Network partition injected on ${deploymentName} via proxy to non-routable address` };
}

async function corruptEnvVar(deploymentName: string, envName: string, badValue: string): Promise<{ success: boolean; message: string }> {
  await setEnvVar(NAMESPACE, deploymentName, envName, badValue);
  originalState.set(deploymentName, { action: 'env', vars: { [envName]: '' } });
  return { success: true, message: `Set ${envName}=${badValue} on ${deploymentName}` };
}

/**
 * Inflate resource requests (not limits) to create scheduling pressure.
 * The pod itself runs fine, but other pods can't schedule.
 */
async function inflateRequests(
  deploymentName: string, cpu: string, memory: string
): Promise<{ success: boolean; message: string }> {
  await patchDeploymentResources(NAMESPACE, deploymentName, 0, {
    requests: { cpu, memory }
  });
  originalState.set(deploymentName, { action: 'requests', type: 'requests' });
  return { success: true, message: `Inflated requests on ${deploymentName} to cpu=${cpu}, memory=${memory}` };
}

// ─── Scenario Trigger Dispatch ─────────────────────────────────────

export async function triggerScenario(scenario: ChaosScenario): Promise<{ success: boolean; message: string }> {
  try {
    switch (scenario.id) {
      // ── Pod kills ──────────────────────────────────────────────
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

      // ── Load spikes ────────────────────────────────────────────
      case 'load-frontend':
        return await spikeLoadGenerator(500);
      case 'load-checkout-spike':
        return await spikeLoadGenerator(300);
      case 'load-currency-saturation':
        return await spikeLoadGenerator(400);
      case 'load-recommendation-spike':
        return await spikeLoadGenerator(350);

      // ── Resource pressure ──────────────────────────────────────
      case 'cpu-pressure-recommendation':
        return await constrainCpu(await dep('recommendation'), '10m');
      case 'memory-pressure-cart':
        return await constrainMemory(await dep('cart'), '32Mi');
      case 'memory-pressure-ad':
        return await constrainMemory(await dep('ad'), '64Mi');
      case 'cpu-pressure-frontend':
        return await constrainCpu(await dep('frontend'), '10m');

      // ── Network faults (renamed: these are partitions, not delay/loss) ──
      case 'network-partition-shipping':
        return await injectNetworkPartition(await dep('shipping'));
      case 'network-drop-email':
        return await injectNetworkPartition(await dep('email'));
      case 'network-latency-product-catalog':
        return await injectNetworkPartition(await dep('product-catalog'));

      // ── Config faults ──────────────────────────────────────────
      case 'config-fault-frontend-env':
        return await corruptEnvVar(await dep('frontend'), 'CHECKOUT_SERVICE_ADDR', 'invalid-host:9999');
      case 'config-fault-quote-crash':
        return await corruptEnvVar(await dep('quote'), 'QUOTE_SERVICE_PORT', 'not-a-port');

      // ── Feature flags (via flagd) ──────────────────────────────
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

      // ══════════════════════════════════════════════════════════
      // NEW SCENARIOS
      // ══════════════════════════════════════════════════════════

      // ── Multi-Fault: Payment Flag + Cart OOM ───────────────────
      case 'multi-payment-flag-cart-oom':
        return await triggerCompound([
          () => enableFlag('paymentFailure'),
          async () => constrainMemory(await dep('cart'), '32Mi'),
        ]);

      // ── Multi-Fault: Three-Layer Degradation ───────────────────
      case 'multi-three-layer-degradation':
        return await triggerCompound([
          async () => constrainCpu(await dep('frontend'), '10m'),
          async () => injectNetworkPartition(await dep('product-catalog')),
          () => enableFlag('adFailure'),
        ]);

      // ── Multi-Fault: Red Herring ───────────────────────────────
      case 'multi-red-herring':
        return await triggerCompound([
          () => enableFlag('adHighCpu'),
          async () => corruptEnvVar(await dep('checkout'), 'PAYMENT_SERVICE_ADDR', 'invalid-host:9999'),
        ]);

      // ── Cascading: Currency Kill + Load Spike ──────────────────
      case 'cascade-currency-kill-load':
        return await triggerCompound([
          async () => killServicePod(await dep('currency')),
          () => spikeLoadGenerator(400),
        ]);

      // ── Cascading: Memory Leak + Tight Limit ──────────────────
      case 'cascade-memory-leak-oom':
        return await triggerCompound([
          () => enableFlag('recommendationCacheFailure'),
          async () => constrainMemory(await dep('recommendation'), '128Mi'),
        ]);

      // ── Data-Layer: Valkey Memory Pressure ─────────────────────
      case 'data-valkey-memory-pressure': {
        const valkey = await resolveInfra('valkey');
        return await constrainMemory(valkey, '8Mi');
      }

      // ── Data-Layer: Kafka Broker Kill ──────────────────────────
      case 'data-kafka-broker-kill': {
        const kafka = await resolveInfra('kafka');
        return await killServicePod(kafka);
      }

      // ── O11y: Collector CPU Starvation ─────────────────────────
      case 'o11y-collector-cpu-starvation': {
        const otelcol = await resolveInfra('otelcol');
        return await constrainCpu(otelcol, '10m');
      }

      // ── O11y: Collector OOM + Load Spike ───────────────────────
      case 'o11y-collector-oom-load': {
        const otelcol = await resolveInfra('otelcol');
        return await triggerCompound([
          () => constrainMemory(otelcol, '64Mi'),
          () => spikeLoadGenerator(300),
        ]);
      }

      // ── O11y: OTEL_EXPORTER Misconfigured ─────────────────────
      case 'o11y-exporter-misconfigured':
        return await corruptEnvVar(
          await dep('checkout'),
          'OTEL_EXPORTER_OTLP_ENDPOINT',
          'http://192.0.2.1:4317'
        );

      // ── Config: Service Address Swap ───────────────────────────
      case 'dependency-service-address-swap':
        return await corruptEnvVar(
          await dep('checkout'),
          'PRODUCT_CATALOG_SERVICE_ADDR',
          'otel-demo-currencyservice:8080'
        );

      // ── Race: Staggered Kill ───────────────────────────────────
      case 'race-staggered-kill':
        return await triggerStaggered([
          { fn: async () => killServicePod(await dep('payment')), delayMs: 0 },
          { fn: async () => killServicePod(await dep('cart')), delayMs: 30000 },
        ]);

      // ── Race: Slow Burn CPU ────────────────────────────────────
      case 'race-slow-burn-cpu': {
        const frontend = await dep('frontend');
        return await triggerStaggered([
          { fn: () => constrainCpu(frontend, '200m'), delayMs: 0 },
          { fn: () => constrainCpu(frontend, '50m'), delayMs: 20000 },
          { fn: () => constrainCpu(frontend, '10m'), delayMs: 20000 },
        ]);
      }

      // ── Capacity: Thundering Herd ──────────────────────────────
      case 'capacity-thundering-herd':
        return await triggerCompound([
          async () => killServicePod(await dep('checkout')),
          async () => killServicePod(await dep('payment')),
          async () => killServicePod(await dep('shipping')),
          () => spikeLoadGenerator(500),
        ]);

      // ── Capacity: Scheduling Deadlock ──────────────────────────
      case 'capacity-scheduling-deadlock':
        return await inflateRequests(await dep('ad'), '4', '256Mi');

      default:
        return { success: false, message: `Unknown scenario: ${scenario.id}` };
    }
  } catch (err: any) {
    return { success: false, message: `Trigger failed: ${err.message}` };
  }
}

// ─── Cleanup ───────────────────────────────────────────────────────

/**
 * Comprehensive cleanup that handles multi-fault scenarios correctly.
 * Iterates ALL tracked state rather than relying on scenario.targetServices,
 * ensuring compound scenarios are fully cleaned up.
 */
export async function cleanupScenario(scenario: ChaosScenario): Promise<{ success: boolean; message: string }> {
  const messages: string[] = [];

  // Always try flag restore first (instant, harmless if no flags changed)
  try {
    const flagResult = await restoreFlags();
    if (flagResult.message !== 'No flag changes to restore') {
      messages.push(flagResult.message);
    }
  } catch (err: any) {
    messages.push(`Flag restore failed: ${err.message}`);
  }

  // Always try load generator restore
  try {
    const lg = await resolveLoadGenerator();
    if (originalState.has(lg)) {
      await scaleDeployment(NAMESPACE, lg, 0);
      await new Promise(r => setTimeout(r, 2000));
      await scaleDeployment(NAMESPACE, lg, 1);
      originalState.delete(lg);
      messages.push(`Restarted ${lg}`);
    }
  } catch {
    // Load generator may not exist or not be tracked — that's fine
  }

  // Restore ALL tracked deployments (handles multi-fault cleanly)
  for (const [depName, state] of originalState.entries()) {
    try {
      switch (state.action) {
        case 'scale':
          await scaleDeployment(NAMESPACE, depName, (state as any).replicas || 1);
          messages.push(`Scaled ${depName} back to ${(state as any).replicas || 1}`);
          break;
        default:
          // env, resources, network, requests — all need a restart cycle
          await scaleDeployment(NAMESPACE, depName, 0);
          await new Promise(r => setTimeout(r, 2000));
          await scaleDeployment(NAMESPACE, depName, 1);
          messages.push(`Restarted ${depName}`);
          break;
      }
    } catch (err: any) {
      messages.push(`Failed to restore ${depName}: ${err.message}`);
    }
  }

  originalState.clear();
  invalidateDiscoveryCache();
  return { success: true, message: messages.join('; ') || 'Nothing to clean up' };
}

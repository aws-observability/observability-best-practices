import { coreApi } from './k8s';

const NAMESPACE = 'otel-demo';
const CONFIGMAP_NAME = 'flagd-config';
const CONFIGMAP_KEY = 'demo.flagd.json';

// Cache the original config for cleanup
let originalConfig: string | null = null;

interface FlagdConfig {
  flags: Record<string, FlagDefinition>;
  $evaluators?: Record<string, unknown>;
}

interface FlagDefinition {
  state: string;
  variants: Record<string, unknown>;
  defaultVariant: string;
  targeting?: Record<string, unknown>;
}

async function readFlagdConfig(): Promise<{ raw: string; parsed: FlagdConfig }> {
  const cm = await coreApi().readNamespacedConfigMap({
    namespace: NAMESPACE,
    name: CONFIGMAP_NAME,
  });
  const raw = cm.data?.[CONFIGMAP_KEY] ?? '{"flags":{}}';
  return { raw, parsed: JSON.parse(raw) };
}

async function writeFlagdConfig(config: FlagdConfig): Promise<void> {
  const cm = await coreApi().readNamespacedConfigMap({
    namespace: NAMESPACE,
    name: CONFIGMAP_NAME,
  });
  cm.data = cm.data ?? {};
  cm.data[CONFIGMAP_KEY] = JSON.stringify(config, null, 2);
  await coreApi().replaceNamespacedConfigMap({
    namespace: NAMESPACE,
    name: CONFIGMAP_NAME,
    body: cm,
  });
}

/**
 * Enable a feature flag by setting its defaultVariant to the "on" variant.
 * Saves the original config on first call for later restoration.
 */
export async function enableFlag(flagName: string): Promise<{ success: boolean; message: string }> {
  const { raw, parsed } = await readFlagdConfig();

  if (!originalConfig) {
    originalConfig = raw;
  }

  const flag = parsed.flags[flagName];
  if (!flag) {
    return { success: false, message: `Flag "${flagName}" not found in flagd config` };
  }

  // Find the best "on" variant
  const variantKeys = Object.keys(flag.variants);
  const onVariant = variantKeys.includes('on') ? 'on'
    : variantKeys.includes('100%') ? '100%'
    : variantKeys.includes('10sec') ? '10sec'
    : variantKeys.includes('1000x') ? '1000x'
    : variantKeys.find(k => k !== 'off') ?? 'on';
  flag.defaultVariant = onVariant;
  flag.state = 'ENABLED';

  await writeFlagdConfig(parsed);
  console.log(`[Flagd] Enabled flag "${flagName}" with variant "${onVariant}"`);
  return { success: true, message: `Enabled feature flag "${flagName}"` };
}

/**
 * Restore all flags to their original configuration.
 */
export async function restoreFlags(): Promise<{ success: boolean; message: string }> {
  if (!originalConfig) {
    return { success: true, message: 'No flag changes to restore' };
  }

  const config = JSON.parse(originalConfig) as FlagdConfig;
  await writeFlagdConfig(config);
  originalConfig = null;
  console.log('[Flagd] Restored all flags to original config');
  return { success: true, message: 'Restored all feature flags to original state' };
}

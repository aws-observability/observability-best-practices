import * as k8s from '@kubernetes/client-node';
import { PassThrough } from 'stream';

const CONFLICT_RETRIES = 5;
const CONFLICT_BASE_DELAY_MS = 200;

/** Retry a read-modify-write operation when the API server returns 409 Conflict. */
async function retryOnConflict<T>(fn: () => Promise<T>): Promise<T> {
  for (let attempt = 0; attempt < CONFLICT_RETRIES; attempt++) {
    try {
      return await fn();
    } catch (err: any) {
      const code = err?.code ?? err?.statusCode ?? err?.response?.statusCode ?? err?.body?.code;
      if (code === 409 && attempt < CONFLICT_RETRIES - 1) {
        const jitter = Math.random() * CONFLICT_BASE_DELAY_MS;
        await new Promise(r => setTimeout(r, CONFLICT_BASE_DELAY_MS * (attempt + 1) + jitter));
        continue;
      }
      throw err;
    }
  }
  throw new Error('retryOnConflict: exhausted retries');
}

let _coreApi: k8s.CoreV1Api | null = null;
let _appsApi: k8s.AppsV1Api | null = null;

function getKubeConfig(): k8s.KubeConfig {
  const kc = new k8s.KubeConfig();
  kc.loadFromDefault();
  return kc;
}

export function coreApi(): k8s.CoreV1Api {
  if (!_coreApi) {
    const kc = getKubeConfig();
    _coreApi = kc.makeApiClient(k8s.CoreV1Api);
  }
  return _coreApi;
}

export function appsApi(): k8s.AppsV1Api {
  if (!_appsApi) {
    const kc = getKubeConfig();
    _appsApi = kc.makeApiClient(k8s.AppsV1Api);
  }
  return _appsApi;
}

export async function listPods(namespace: string, labelSelector?: string) {
  const resp = await coreApi().listNamespacedPod({ namespace, labelSelector });
  return resp.items;
}

export async function deletePod(namespace: string, name: string) {
  await coreApi().deleteNamespacedPod({ namespace, name });
}

export async function scaleDeployment(namespace: string, name: string, replicas: number) {
  await retryOnConflict(async () => {
    const dep = await appsApi().readNamespacedDeployment({ namespace, name });
    dep.spec!.replicas = replicas;
    await appsApi().replaceNamespacedDeployment({ namespace, name, body: dep });
  });
}

export async function patchDeploymentResources(
  namespace: string,
  name: string,
  containerIndex: number,
  resources: { limits?: Record<string, string>; requests?: Record<string, string> }
) {
  await retryOnConflict(async () => {
    const dep = await appsApi().readNamespacedDeployment({ namespace, name });
    const containers = dep.spec?.template?.spec?.containers;
    if (!containers?.[containerIndex]) throw new Error(`Container at index ${containerIndex} not found`);

    containers[containerIndex].resources = resources;
    await appsApi().replaceNamespacedDeployment({ namespace, name, body: dep });
  });
}

export async function setEnvVar(namespace: string, deploymentName: string, envName: string, envValue: string) {
  await retryOnConflict(async () => {
    const dep = await appsApi().readNamespacedDeployment({ namespace, name: deploymentName });
    const containers = dep.spec?.template?.spec?.containers;
    if (!containers?.length) throw new Error('No containers found');

    const env = containers[0].env || [];
    const existing = env.find(e => e.name === envName);
    if (existing) {
      existing.value = envValue;
    } else {
      env.push({ name: envName, value: envValue });
    }
    containers[0].env = env;

    await appsApi().replaceNamespacedDeployment({ namespace, name: deploymentName, body: dep });
  });
}

export async function execInPod(namespace: string, podName: string, command: string[]): Promise<string> {
  const kc = getKubeConfig();
  const exec = new k8s.Exec(kc);
  return new Promise((resolve, reject) => {
    const stdout = new PassThrough();
    const stderr = new PassThrough();
    let output = '';

    stdout.on('data', (chunk: Buffer) => { output += chunk.toString(); });
    stderr.on('data', (chunk: Buffer) => { output += chunk.toString(); });

    exec.exec(
      namespace, podName, '', command,
      stdout,
      stderr,
      null,
      false,
      (status) => {
        if (status.status === 'Success') resolve(output);
        else reject(new Error(`Exec failed: ${status.message}`));
      }
    );
  });
}

export async function getDeploymentStatus(namespace: string, name: string) {
  try {
    const dep = await appsApi().readNamespacedDeployment({ namespace, name });
    return {
      name,
      replicas: dep.status?.replicas ?? 0,
      readyReplicas: dep.status?.readyReplicas ?? 0,
      availableReplicas: dep.status?.availableReplicas ?? 0,
    };
  } catch {
    return { name, replicas: 0, readyReplicas: 0, availableReplicas: 0 };
  }
}

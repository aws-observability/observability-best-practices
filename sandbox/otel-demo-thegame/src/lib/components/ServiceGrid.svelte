<script lang="ts">
  import { onMount } from 'svelte';

  interface ServiceStatus {
    name: string;
    language: string;
    deployment: string;
    replicas: number;
    readyReplicas: number;
    availableReplicas: number;
  }

  let services = $state<ServiceStatus[]>([]);
  let pollInterval: ReturnType<typeof setInterval> | null = null;

  async function fetchServices() {
    try {
      const resp = await fetch('/api/services');
      const data = await resp.json();
      services = data.services || [];
    } catch {
      // ignore
    }
  }

  onMount(() => {
    fetchServices();
    pollInterval = setInterval(fetchServices, 15000);
    return () => {
      if (pollInterval) clearInterval(pollInterval);
    };
  });
</script>

<div class="service-grid-panel">
  <h3>Service Health</h3>
  <div class="grid">
    {#each services as svc}
      <div class="service-card" class:healthy={svc.readyReplicas > 0} class:down={svc.readyReplicas === 0}>
        <div class="status-dot"></div>
        <div class="info">
          <span class="svc-name">{svc.name}</span>
          <span class="svc-lang">{svc.language}</span>
        </div>
        <span class="replicas">{svc.readyReplicas}/{svc.replicas}</span>
      </div>
    {/each}
  </div>
</div>

<style>
  .service-grid-panel {
    background: #161b22;
    border-radius: 12px;
    border: 1px solid #30363d;
    padding: 1.5rem;
  }
  h3 {
    font-size: 1rem;
    margin-bottom: 1rem;
  }
  .grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
    gap: 0.6rem;
  }
  .service-card {
    display: flex;
    align-items: center;
    gap: 0.6rem;
    padding: 0.6rem 0.8rem;
    background: #0d1117;
    border-radius: 6px;
    border: 1px solid #21262d;
  }
  .status-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    flex-shrink: 0;
  }
  .healthy .status-dot { background: #3fb950; }
  .down .status-dot { background: #f85149; animation: pulse 1s infinite; }
  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.3; }
  }
  .info {
    flex: 1;
    display: flex;
    flex-direction: column;
    min-width: 0;
  }
  .svc-name {
    font-size: 0.8rem;
    font-weight: 600;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .svc-lang {
    font-size: 0.65rem;
    color: #8b949e;
  }
  .replicas {
    font-size: 0.75rem;
    color: #8b949e;
    font-family: monospace;
  }
</style>

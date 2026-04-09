<script lang="ts">
  import type { REDMetrics } from '$lib/types';
  import { onMount, tick } from 'svelte';
  import Chart from 'chart.js/auto';

  let { metrics, loading = false }: { metrics: REDMetrics[]; loading?: boolean } = $props();

  let selectedService = $state<string | null>(null);
  let charts: Chart[] = [];
  let containerEl = $state<HTMLDivElement>(null!);

  const PALETTE = [
    '#58a6ff', '#3fb950', '#d29922', '#f85149', '#a78bfa',
    '#f0883e', '#56d4dd', '#db61a2', '#7ee787', '#79c0ff',
  ];

  function allServices(): string[] {
    return [...new Set(metrics.map(m => m.service))].sort();
  }

  function colorFor(svc: string): string {
    return PALETTE[allServices().indexOf(svc) % PALETTE.length];
  }

  function visibleServices(): string[] {
    const all = allServices();
    return selectedService ? all.filter(s => s === selectedService) : all;
  }

  function buildData(svc: string, key: 'rate' | 'errors' | 'duration') {
    const svcMetrics = metrics.filter(m => m.service === svc);
    const timestamps = [...new Set(svcMetrics.map(m => m.timestamp))].sort();
    const color = colorFor(svc);
    return {
      labels: timestamps.map(t => new Date(t).toLocaleTimeString()),
      datasets: [{
        label: svc,
        data: timestamps.map(t => {
          const p = svcMetrics.find(m => m.timestamp === t);
          return p ? (p[key] as number) : 0;
        }),
        borderColor: color,
        backgroundColor: color + '20',
        borderWidth: 2,
        tension: 0.3,
        fill: true,
        pointRadius: 1,
      }],
    };
  }

  function chartOpts(title: string, yLabel: string): any {
    return {
      responsive: true,
      maintainAspectRatio: false,
      animation: false,
      plugins: {
        legend: { display: false },
        title: { display: true, text: title, color: '#8b949e', font: { size: 10 }, padding: { bottom: 4 } },
      },
      scales: {
        x: { ticks: { color: '#6e7681', maxTicksLimit: 6, font: { size: 8 } }, grid: { color: '#21262d' } },
        y: { ticks: { color: '#6e7681', font: { size: 8 } }, grid: { color: '#21262d' },
             title: { display: true, text: yLabel, color: '#6e7681', font: { size: 8 } } },
      },
    };
  }

  function destroyCharts() {
    charts.forEach(c => c.destroy());
    charts = [];
  }

  async function renderCharts() {
    destroyCharts();
    await tick();
    if (!containerEl) return;

    const canvases = containerEl.querySelectorAll<HTMLCanvasElement>('canvas[data-svc]');
    for (const canvas of canvases) {
      const svc = canvas.dataset.svc!;
      const key = canvas.dataset.metric as 'rate' | 'errors' | 'duration';
      const titles: Record<string, [string, string]> = {
        rate: ['Rate (req/min)', 'req/min'],
        errors: ['Errors', 'count'],
        duration: ['Duration p99', 'ms'],
      };
      const [title, yLabel] = titles[key];
      charts.push(new Chart(canvas, {
        type: 'line',
        data: buildData(svc, key),
        options: chartOpts(title, yLabel),
      }));
    }
  }

  $effect(() => {
    if (metrics.length > 0) {
      const _ = selectedService;
      renderCharts();
    }
  });

  onMount(() => () => destroyCharts());
</script>

<div class="dashboard" bind:this={containerEl}>
  <div class="dashboard-header">
    <h2>Request-Error-Duration (RED) Metrics</h2>
    {#if allServices().length > 0}
      <div class="filter-bar">
        <button class="filter-btn" class:active={selectedService === null}
          onclick={() => { selectedService = null; }}>All</button>
        {#each allServices() as svc}
          <button class="filter-btn" class:active={selectedService === svc}
            onclick={() => { selectedService = selectedService === svc ? null : svc; }}
            style="--svc-color: {colorFor(svc)}">
            <span class="color-dot"></span>{svc}
          </button>
        {/each}
      </div>
    {/if}
  </div>

  {#if metrics.length === 0}
    <div class="empty">
      {#if loading}
        <div class="spinner"></div>
        <p>Querying CloudWatch PromQL...</p>
      {:else}
        <p>Waiting for metrics from CloudWatch...</p>
        <p class="hint">Metrics are polled every 10 seconds. Make sure your OTel demo is sending data.</p>
      {/if}
    </div>
  {:else}
    <div class="charts-wrapper">
      {#if loading}
        <div class="loading-overlay">
          <div class="spinner"></div>
        </div>
      {/if}
      <div class="services-charts">
      {#each visibleServices() as svc (svc)}
        <div class="service-row">
          <div class="service-label" style="border-left-color: {colorFor(svc)}">{svc}</div>
          <div class="metric-charts">
            <div class="mini-chart"><canvas data-svc={svc} data-metric="rate"></canvas></div>
            <div class="mini-chart"><canvas data-svc={svc} data-metric="errors"></canvas></div>
            <div class="mini-chart"><canvas data-svc={svc} data-metric="duration"></canvas></div>
          </div>
        </div>
      {/each}
    </div>
    </div>
  {/if}
</div>

<style>
  .dashboard {
    background: #161b22;
    border-radius: 12px;
    border: 1px solid #30363d;
    padding: 1.5rem;
    overflow: hidden;
  }
  .dashboard-header {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 1rem;
    margin-bottom: 1rem;
  }
  h2 {
    font-size: 1.1rem;
    color: #e1e4e8;
    margin: 0;
  }
  .filter-bar {
    display: flex;
    flex-wrap: wrap;
    gap: 0.35rem;
  }
  .filter-btn {
    display: flex;
    align-items: center;
    gap: 0.3rem;
    background: #21262d;
    border: 1px solid #30363d;
    color: #8b949e;
    padding: 0.2rem 0.6rem;
    border-radius: 12px;
    font-size: 0.7rem;
    cursor: pointer;
    transition: all 0.15s;
  }
  .filter-btn:hover { border-color: #58a6ff; color: #c9d1d9; }
  .filter-btn.active { background: #30363d; color: #e1e4e8; border-color: #58a6ff; }
  .color-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: var(--svc-color);
  }
  .services-charts {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }
  .service-row {
    background: #0d1117;
    border-radius: 8px;
    padding: 0.75rem;
    min-width: 0;
  }
  .service-label {
    font-size: 0.8rem;
    font-weight: 600;
    color: #e1e4e8;
    margin-bottom: 0.5rem;
    padding-left: 0.5rem;
    border-left: 3px solid;
  }
  .metric-charts {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 0.5rem;
  }
  .mini-chart {
    height: 120px;
    position: relative;
    min-width: 0;
  }
  .empty {
    text-align: center;
    padding: 2rem;
    color: #8b949e;
  }
  .hint {
    font-size: 0.8rem;
    margin-top: 0.5rem;
    color: #6e7681;
  }
  .charts-wrapper {
    position: relative;
  }
  .loading-overlay {
    position: absolute;
    inset: 0;
    background: #161b22cc;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 5;
    border-radius: 8px;
  }
  .spinner {
    width: 24px;
    height: 24px;
    border: 3px solid #30363d;
    border-top-color: #58a6ff;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
    margin: 0 auto 0.5rem;
  }
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
  @media (max-width: 700px) {
    .metric-charts {
      grid-template-columns: 1fr;
    }
  }
</style>

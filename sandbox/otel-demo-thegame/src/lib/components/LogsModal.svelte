<script lang="ts">
  import { onMount } from 'svelte';
  import FullscreenModal from './FullscreenModal.svelte';
  import { Chart, BarController, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';

  Chart.register(BarController, BarElement, CategoryScale, LinearScale, Tooltip, Legend);

  interface LogEntry {
    timestamp: number;
    message: string;
    severity: string;
    resourceAttributes: Record<string, string>;
  }

  let { open = $bindable(false), service }: {
    open: boolean;
    service: string;
  } = $props();

  let allLogs = $state<LogEntry[]>([]);
  let loading = $state(false);
  let error = $state('');

  // Time range state
  const timeRanges = [
    { label: '6h', minutes: 360 },
    { label: '1d', minutes: 1440 },
    { label: '1w', minutes: 10080 },
  ] as const;
  let minutes = $state(360);

  // Filter state
  let availableKeys = $state<string[]>([]);
  let filters = $state<Array<{ key: string; value: string }>>([]);
  let textSearch = $state('');

  // Chart
  let chartCanvas = $state<HTMLCanvasElement>(null!);
  let chartInstance: Chart | null = null;

  // Chart time-focus: when user clicks a bar, filter table to that bucket
  let focusRange = $state<{ start: number; end: number } | null>(null);
  let bucketBounds: Array<{ start: number; end: number }> = [];

  // Expandable rows
  let expandedIndex = $state<number | null>(null);

  function toggleRow(idx: number) {
    expandedIndex = expandedIndex === idx ? null : idx;
  }

  function clearFocus() {
    focusRange = null;
    expandedIndex = null;
  }

  // Derived: unique values per attribute key
  let valueOptions = $derived.by(() => {
    const map = new Map<string, Set<string>>();
    for (const log of allLogs) {
      for (const [k, v] of Object.entries(log.resourceAttributes)) {
        if (!map.has(k)) map.set(k, new Set());
        map.get(k)!.add(v);
      }
    }
    return map;
  });

  let filteredLogs = $derived.by(() => {
    let result = allLogs;
    for (const f of filters) {
      if (!f.key || !f.value) continue;
      result = result.filter(l => l.resourceAttributes[f.key] === f.value);
    }
    if (textSearch.trim()) {
      const q = textSearch.trim().toLowerCase();
      result = result.filter(l => l.message.toLowerCase().includes(q));
    }
    if (focusRange) {
      result = result.filter(l => l.timestamp >= focusRange!.start && l.timestamp < focusRange!.end);
    }
    return result;
  });

  // Track the last-opened service to detect fresh opens vs. time range changes
  let lastOpenedService = '';

  $effect(() => {
    if (open && service) {
      const isFreshOpen = lastOpenedService !== service;
      if (isFreshOpen) {
        lastOpenedService = service;
        filters = [];
        textSearch = '';
        minutes = 360;
      }
      // Read minutes to subscribe — re-runs on toggle change too
      const _m = minutes;
      fetchLogs();
    }
  });

  async function fetchLogs() {
    loading = true;
    error = '';
    allLogs = [];
    expandedIndex = null;
    focusRange = null;
    try {
      const resp = await fetch(`/api/logs?service=${encodeURIComponent(service)}&minutes=${minutes}`);
      const data = await resp.json();
      if (data.error) error = data.error;
      allLogs = data.logs ?? [];
      // Extract available attribute keys
      const keys = new Set<string>();
      for (const log of allLogs) {
        for (const k of Object.keys(log.resourceAttributes)) keys.add(k);
      }
      availableKeys = [...keys].sort();
    } catch (e: any) {
      error = e.message;
    } finally {
      loading = false;
    }
  }

  function addFilter() {
    filters = [...filters, { key: '', value: '' }];
  }

  function removeFilter(idx: number) {
    filters = filters.filter((_, i) => i !== idx);
  }

  function formatTimestamp(ts: number): string {
    return new Date(ts).toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
  }

  function severityClass(sev: string): string {
    const s = sev.toUpperCase();
    if (s === 'ERROR' || s === 'FATAL') return 'sev-error';
    if (s === 'WARN' || s === 'WARNING') return 'sev-warn';
    if (s === 'INFO') return 'sev-info';
    return 'sev-default';
  }

  function normalizeSeverity(sev: string): string {
    const s = sev.toUpperCase();
    if (s === 'ERROR' || s === 'FATAL') return 'ERROR';
    if (s === 'WARN' || s === 'WARNING') return 'WARN';
    if (s === 'INFO') return 'INFO';
    return 'OTHER';
  }

  const sevColors: Record<string, string> = {
    ERROR: '#f85149',
    WARN:  '#d29922',
    INFO:  '#58a6ff',
    OTHER: '#6e7681',
  };

  // Logs filtered by text/attributes but NOT by time focus — used for the chart
  let chartLogs = $derived.by(() => {
    let result = allLogs;
    for (const f of filters) {
      if (!f.key || !f.value) continue;
      result = result.filter(l => l.resourceAttributes[f.key] === f.value);
    }
    if (textSearch.trim()) {
      const q = textSearch.trim().toLowerCase();
      result = result.filter(l => l.message.toLowerCase().includes(q));
    }
    return result;
  });

  function buildChart(logs: LogEntry[]) {
    if (!chartCanvas) return;

    chartInstance?.destroy();
    chartInstance = null;
    bucketBounds = [];

    if (logs.length === 0) return;

    // Determine bucket count and size
    const timestamps = logs.map(l => l.timestamp);
    const minTs = Math.min(...timestamps);
    const maxTs = Math.max(...timestamps);
    const range = maxTs - minTs || 1;
    const bucketCount = Math.min(40, Math.max(10, logs.length));
    const bucketSize = range / bucketCount;

    // Store bucket boundaries for click handling
    for (let i = 0; i < bucketCount; i++) {
      bucketBounds.push({
        start: minTs + i * bucketSize,
        end: minTs + (i + 1) * bucketSize,
      });
    }

    // Build buckets per severity
    const sevKeys = ['ERROR', 'WARN', 'INFO', 'OTHER'];
    const buckets: Record<string, number[]> = {};
    const labels: string[] = [];
    for (const sk of sevKeys) {
      buckets[sk] = new Array(bucketCount).fill(0);
    }
    for (let i = 0; i < bucketCount; i++) {
      const t = new Date(minTs + (i + 0.5) * bucketSize);
      labels.push(t.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }));
    }
    for (const log of logs) {
      const idx = Math.min(Math.floor((log.timestamp - minTs) / bucketSize), bucketCount - 1);
      const sev = normalizeSeverity(log.severity);
      buckets[sev][idx]++;
    }

    // Determine which bucket index is focused (if any)
    const focusedIdx = focusRange
      ? bucketBounds.findIndex(b => b.start === focusRange!.start && b.end === focusRange!.end)
      : -1;

    chartInstance = new Chart(chartCanvas, {
      type: 'bar',
      data: {
        labels,
        datasets: sevKeys.filter(sk => buckets[sk].some(v => v > 0)).map(sk => ({
          label: sk,
          data: buckets[sk],
          backgroundColor: buckets[sk].map((_, i) =>
            focusedIdx >= 0 && i !== focusedIdx
              ? sevColors[sk] + '30'
              : sevColors[sk] + '99'
          ),
          borderColor: buckets[sk].map((_, i) =>
            focusedIdx >= 0 && i !== focusedIdx
              ? sevColors[sk] + '50'
              : sevColors[sk]
          ),
          borderWidth: 1,
          borderRadius: 2,
        })),
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        onClick: (_event, elements) => {
          if (elements.length === 0) return;
          const idx = elements[0].index;
          const bounds = bucketBounds[idx];
          if (!bounds) return;
          // Toggle: clicking the same bar again clears focus
          if (focusRange && focusRange.start === bounds.start && focusRange.end === bounds.end) {
            focusRange = null;
          } else {
            focusRange = { start: bounds.start, end: bounds.end };
          }
          expandedIndex = null;
        },
        plugins: {
          legend: {
            position: 'top',
            align: 'end',
            labels: { color: '#8b949e', boxWidth: 12, padding: 12, font: { size: 11 } },
          },
          tooltip: {
            mode: 'index',
            intersect: false,
          },
        },
        scales: {
          x: {
            stacked: true,
            ticks: { color: '#6e7681', font: { size: 10 }, maxRotation: 0, autoSkipPadding: 8 },
            grid: { color: '#21262d' },
          },
          y: {
            stacked: true,
            beginAtZero: true,
            ticks: { color: '#6e7681', font: { size: 10 }, precision: 0 },
            grid: { color: '#21262d' },
            title: { display: true, text: 'Log count', color: '#6e7681', font: { size: 11 } },
          },
        },
      },
    });
  }

  // Rebuild chart whenever chart-level logs or focus changes
  $effect(() => {
    const logs = chartLogs;
    const _focus = focusRange;
    if (chartCanvas) {
      buildChart(logs);
    }
  });
</script>

<FullscreenModal bind:open title="Logs: {service}" wide>
  <div class="logs-toolbar">
    <div class="search-row">
      <input
        type="text"
        class="search-input"
        placeholder="Search log messages…"
        bind:value={textSearch}
      />
      <div class="time-range-toggle" role="group" aria-label="Time range">
        {#each timeRanges as range}
          <button
            class="range-btn"
            class:active={minutes === range.minutes}
            onclick={() => { minutes = range.minutes; }}
          >{range.label}</button>
        {/each}
      </div>
      <button class="filter-btn" onclick={addFilter}>+ Filter</button>
      <span class="log-count">{filteredLogs.length} / {allLogs.length} logs</span>
    </div>
    {#each filters as filter, idx}
      <div class="filter-row">
        <select class="filter-select" bind:value={filter.key} onchange={() => filter.value = ''}>
          <option value="">— attribute —</option>
          {#each availableKeys as key}
            <option value={key}>{key}</option>
          {/each}
        </select>
        <span class="filter-eq">=</span>
        <select class="filter-select value-select" bind:value={filter.value} disabled={!filter.key}>
          <option value="">— value —</option>
          {#if filter.key && valueOptions.has(filter.key)}
            {#each [...valueOptions.get(filter.key)!].sort() as val}
              <option value={val}>{val}</option>
            {/each}
          {/if}
        </select>
        <button class="remove-btn" onclick={() => removeFilter(idx)} aria-label="Remove filter">✕</button>
      </div>
    {/each}
  </div>

  <div class="logs-container">
    {#if loading}
      <div class="logs-status">Loading logs…</div>
    {:else if error}
      <div class="logs-status logs-error">{error}</div>
    {:else if allLogs.length === 0}
      <div class="logs-status">No logs found for the selected time range.</div>
    {:else if filteredLogs.length === 0}
      <div class="logs-status">No logs match the current filters.</div>
    {:else}
      <div class="chart-panel">
        <div class="chart-header">
          <span class="chart-title">
            {#if focusRange}
              Showing {new Date(focusRange.start).toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' })} – {new Date(focusRange.end).toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' })}
            {:else}
              Log volume over time
            {/if}
          </span>
          {#if focusRange}
            <button class="reset-focus-btn" onclick={clearFocus}>Reset</button>
          {/if}
        </div>
        <div class="chart-body">
          <canvas bind:this={chartCanvas}></canvas>
        </div>
      </div>
      <div class="logs-list">
        {#each filteredLogs as log, idx}
          <!-- svelte-ignore a11y_no_static_element_interactions -->
          <div
            class="log-line"
            class:expanded={expandedIndex === idx}
            onclick={() => toggleRow(idx)}
          >
            <span class="log-expand">{expandedIndex === idx ? '▾' : '▸'}</span>
            <span class="log-ts">{formatTimestamp(log.timestamp)}</span>
            {#if log.severity}
              <span class="log-sev {severityClass(log.severity)}">{log.severity}</span>
            {/if}
            <span class="log-msg">{log.message}</span>
          </div>
          {#if expandedIndex === idx}
            <div class="log-attrs">
              {#each Object.entries(log.resourceAttributes).sort(([a], [b]) => a.localeCompare(b)) as [key, value]}
                <div class="attr-row">
                  <span class="attr-key">{key}</span>
                  <span class="attr-val">{value}</span>
                </div>
              {/each}
              {#if Object.keys(log.resourceAttributes).length === 0}
                <div class="attr-empty">No attributes</div>
              {/if}
            </div>
          {/if}
        {/each}
      </div>
    {/if}
  </div>
</FullscreenModal>

<style>
  .logs-toolbar {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    margin-bottom: 0.75rem;
    padding-bottom: 0.75rem;
    border-bottom: 1px solid #21262d;
  }
  .search-row {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  .search-input {
    flex: 1;
    background: #0d1117;
    border: 1px solid #30363d;
    border-radius: 6px;
    padding: 0.4rem 0.75rem;
    color: #e1e4e8;
    font-size: 0.85rem;
    font-family: inherit;
  }
  .search-input:focus {
    outline: none;
    border-color: #58a6ff;
  }
  .filter-btn {
    background: #21262d;
    border: 1px solid #30363d;
    border-radius: 6px;
    color: #58a6ff;
    padding: 0.4rem 0.75rem;
    font-size: 0.8rem;
    cursor: pointer;
    white-space: nowrap;
  }
  .filter-btn:hover {
    background: #30363d;
    border-color: #58a6ff;
  }
  .time-range-toggle {
    display: flex;
    border: 1px solid #30363d;
    border-radius: 6px;
    overflow: hidden;
    flex-shrink: 0;
  }
  .range-btn {
    background: #21262d;
    border: none;
    border-right: 1px solid #30363d;
    color: #8b949e;
    padding: 0.4rem 0.65rem;
    font-size: 0.8rem;
    cursor: pointer;
    transition: all 0.15s;
    font-family: inherit;
  }
  .range-btn:last-child {
    border-right: none;
  }
  .range-btn:hover {
    color: #e1e4e8;
    background: #30363d;
  }
  .range-btn.active {
    background: #58a6ff;
    color: #0d1117;
    font-weight: 600;
  }
  .log-count {
    color: #6e7681;
    font-size: 0.8rem;
    white-space: nowrap;
  }
  .filter-row {
    display: flex;
    align-items: center;
    gap: 0.4rem;
  }
  .filter-select {
    background: #0d1117;
    border: 1px solid #30363d;
    border-radius: 6px;
    padding: 0.35rem 0.5rem;
    color: #e1e4e8;
    font-size: 0.8rem;
    font-family: inherit;
  }
  .filter-select:focus {
    outline: none;
    border-color: #58a6ff;
  }
  .value-select {
    flex: 1;
    min-width: 0;
  }
  .filter-eq {
    color: #6e7681;
    font-size: 0.85rem;
  }
  .remove-btn {
    background: none;
    border: none;
    color: #6e7681;
    cursor: pointer;
    font-size: 0.85rem;
    padding: 0.2rem 0.4rem;
    border-radius: 4px;
  }
  .remove-btn:hover {
    color: #f85149;
    background: #f8514920;
  }
  .logs-container {
    min-height: 200px;
    max-height: 65vh;
    overflow-y: auto;
  }
  .chart-panel {
    margin-bottom: 0.75rem;
    padding: 0.75rem;
    background: #0d1117;
    border: 1px solid #21262d;
    border-radius: 8px;
  }
  .chart-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 0.4rem;
  }
  .chart-title {
    color: #8b949e;
    font-size: 0.75rem;
  }
  .reset-focus-btn {
    background: #21262d;
    border: 1px solid #30363d;
    border-radius: 4px;
    color: #58a6ff;
    padding: 0.2rem 0.5rem;
    font-size: 0.7rem;
    cursor: pointer;
    font-family: inherit;
  }
  .reset-focus-btn:hover {
    background: #30363d;
    border-color: #58a6ff;
  }
  .chart-body {
    height: 150px;
  }
  .logs-status {
    color: #8b949e;
    text-align: center;
    padding: 2rem;
    font-size: 0.9rem;
  }
  .logs-error {
    color: #f85149;
  }
  .logs-list {
    font-family: 'SF Mono', 'Fira Code', 'Cascadia Code', monospace;
    font-size: 0.8rem;
    line-height: 1.6;
  }
  .log-line {
    display: flex;
    gap: 0.75rem;
    padding: 0.2rem 0.5rem;
    border-bottom: 1px solid #21262d;
    cursor: pointer;
  }
  .log-line:hover {
    background: #21262d;
  }
  .log-line.expanded {
    background: #1c2128;
    border-bottom-color: transparent;
  }
  .log-expand {
    color: #6e7681;
    flex-shrink: 0;
    width: 1em;
    font-size: 0.7rem;
    line-height: 1.6;
  }
  .log-ts {
    color: #6e7681;
    white-space: nowrap;
    flex-shrink: 0;
  }
  .log-sev {
    white-space: nowrap;
    flex-shrink: 0;
    font-size: 0.75rem;
    padding: 0 0.3rem;
    border-radius: 3px;
  }
  .sev-error { color: #f85149; background: #f8514920; }
  .sev-warn { color: #d29922; background: #d2992220; }
  .sev-info { color: #58a6ff; background: #58a6ff20; }
  .sev-default { color: #8b949e; }
  .log-msg {
    color: #c9d1d9;
    white-space: pre-wrap;
    word-break: break-all;
  }
  .log-attrs {
    background: #1c2128;
    border-bottom: 1px solid #21262d;
    padding: 0.4rem 0.5rem 0.4rem 2.5rem;
  }
  .attr-row {
    display: flex;
    gap: 0.75rem;
    padding: 0.15rem 0;
    font-size: 0.75rem;
  }
  .attr-key {
    color: #d2a8ff;
    flex-shrink: 0;
    min-width: 14rem;
  }
  .attr-val {
    color: #8b949e;
    word-break: break-all;
  }
  .attr-empty {
    color: #484f58;
    font-size: 0.75rem;
    font-style: italic;
  }
</style>

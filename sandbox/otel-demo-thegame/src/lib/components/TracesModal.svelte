<script lang="ts">
  import FullscreenModal from './FullscreenModal.svelte';
  import type { Trace, TraceSpan } from '$lib/types';

  let { open = $bindable(false), service, onviewlogs }: {
    open: boolean;
    service: string;
    onviewlogs?: (service: string) => void;
  } = $props();

  let traces = $state<Trace[]>([]);
  let loading = $state(false);
  let error = $state('');

  const timeRanges = [
    { label: '1h', minutes: 60 },
    { label: '6h', minutes: 360 },
    { label: '1d', minutes: 1440 },
  ] as const;
  let minutes = $state(60);

  let selectedTrace = $state<Trace | null>(null);
  let expandedSpanId = $state<string | null>(null);

  // Keyboard: ArrowUp goes back to trace list
  function onKeydown(e: KeyboardEvent) {
    if (!open) return;
    if (e.key === 'ArrowUp' && selectedTrace) {
      backToList();
      e.preventDefault();
    }
  }

  let lastOpenedService = '';

  $effect(() => {
    if (open && service) {
      const isFreshOpen = lastOpenedService !== service;
      if (isFreshOpen) {
        lastOpenedService = service;
        selectedTrace = null;
        minutes = 60;
      }
      const _m = minutes;
      fetchTraces();
    }
  });

  async function fetchTraces() {
    loading = true;
    error = '';
    traces = [];
    selectedTrace = null;
    expandedSpanId = null;
    try {
      const resp = await fetch(`/api/traces?service=${encodeURIComponent(service)}&minutes=${minutes}`);
      const data = await resp.json();
      if (data.error) error = data.error;
      traces = data.traces ?? [];
    } catch (e: any) {
      error = e.message;
    } finally {
      loading = false;
    }
  }

  function selectTrace(trace: Trace) {
    selectedTrace = trace;
    expandedSpanId = null;
  }

  function backToList() {
    selectedTrace = null;
    expandedSpanId = null;
  }

  function toggleSpan(spanId: string) {
    expandedSpanId = expandedSpanId === spanId ? null : spanId;
  }

  function formatDuration(ms: number): string {
    if (ms < 1) return `${(ms * 1000).toFixed(0)}µs`;
    if (ms < 1000) return `${ms.toFixed(1)}ms`;
    return `${(ms / 1000).toFixed(2)}s`;
  }

  function formatTime(ts: number): string {
    return new Date(ts).toLocaleTimeString('en-US', {
      hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit', fractionalSecondDigits: 3,
    } as any);
  }

  function statusClass(code: string): string {
    if (code === 'ERROR') return 'status-error';
    if (code === 'OK') return 'status-ok';
    return 'status-unset';
  }

  // Build a tree structure for waterfall rendering
  interface SpanNode {
    span: TraceSpan;
    children: SpanNode[];
    depth: number;
  }

  function buildSpanTree(spans: TraceSpan[]): SpanNode[] {
    const byId = new Map(spans.map(s => [s.spanId, s]));
    const childrenMap = new Map<string | null, TraceSpan[]>();
    for (const s of spans) {
      const pid = s.parentSpanId;
      if (!childrenMap.has(pid)) childrenMap.set(pid, []);
      childrenMap.get(pid)!.push(s);
    }

    function build(parentId: string | null, depth: number): SpanNode[] {
      const kids = childrenMap.get(parentId) ?? [];
      kids.sort((a, b) => a.startTime - b.startTime);
      return kids.map(s => ({
        span: s,
        children: build(s.spanId, depth + 1),
        depth,
      }));
    }

    // Find roots: spans whose parentSpanId is null or not in the set
    const roots = spans.filter(s => !s.parentSpanId || !byId.has(s.parentSpanId));
    roots.sort((a, b) => a.startTime - b.startTime);

    // If tree building from null parent works, use it; otherwise flatten roots
    const tree = build(null, 0);
    if (tree.length > 0) return tree;

    // Fallback: treat all parentless spans as roots
    return roots.map(s => ({
      span: s,
      children: build(s.spanId, 1),
      depth: 0,
    }));
  }

  function flattenTree(nodes: SpanNode[]): SpanNode[] {
    const result: SpanNode[] = [];
    function walk(list: SpanNode[]) {
      for (const n of list) {
        result.push(n);
        walk(n.children);
      }
    }
    walk(nodes);
    return result;
  }

  let flatSpans = $derived.by(() => {
    if (!selectedTrace) return [];
    return flattenTree(buildSpanTree(selectedTrace.spans));
  });

  // Waterfall bar positioning
  function barStyle(span: TraceSpan, traceStart: number, traceDuration: number): string {
    if (traceDuration <= 0) return 'left: 0%; width: 100%;';
    const left = ((span.startTime - traceStart) / traceDuration) * 100;
    const width = Math.max((span.duration / traceDuration) * 100, 0.5);
    return `left: ${left}%; width: ${width}%;`;
  }

  function spanColor(span: TraceSpan): string {
    if (span.statusCode === 'ERROR') return '#f85149';
    // Color by service name hash for visual distinction
    const hash = span.serviceName.split('').reduce((h, c) => ((h << 5) - h + c.charCodeAt(0)) | 0, 0);
    const hue = ((hash % 360) + 360) % 360;
    return `hsl(${hue}, 55%, 55%)`;
  }

  // OTel semantic convention registry URL mapping
  // Attributes follow the pattern namespace.name (e.g. http.method, rpc.service)
  // The registry is at /docs/specs/semconv/attributes-registry/{namespace}/
  const SEMCONV_BASE = 'https://opentelemetry.io/docs/specs/semconv/attributes-registry';

  // Map attribute namespace prefixes to their registry path segment
  // Some namespaces use different URL slugs than their attribute prefix
  const NAMESPACE_SLUGS: Record<string, string> = {
    'net': 'network',
    'enduser': 'enduser',
    'faas': 'faas',
    'k8s': 'k8s',
    'os': 'os',
    'otel': 'otel',
    'db': 'db',
    'gen_ai': 'gen-ai',
    'feature_flag': 'feature-flag',
    'user_agent': 'user-agent',
  };

  function semconvUrl(key: string): string | null {
    // Skip non-OTel attributes (aws.*, span.*, internal keys)
    if (key.startsWith('aws.') || key.startsWith('span.')) return null;
    const dot = key.indexOf('.');
    if (dot <= 0) return null;
    const ns = key.substring(0, dot);
    const slug = NAMESPACE_SLUGS[ns] ?? ns;
    return `${SEMCONV_BASE}/${slug}/`;
  }
</script>

<svelte:window onkeydown={onKeydown} />

<FullscreenModal bind:open title="Traces: {service}" wide>
  <div class="traces-toolbar">
    <div class="toolbar-row">
      {#if selectedTrace}
        <button class="back-btn" onclick={backToList}>← Back to traces <kbd>↑</kbd></button>
        <span class="trace-id-label">Trace {selectedTrace.traceId.slice(0, 16)}…</span>
      {/if}
      <div class="time-range-toggle" role="group" aria-label="Time range">
        {#each timeRanges as range}
          <button
            class="range-btn"
            class:active={minutes === range.minutes}
            onclick={() => { minutes = range.minutes; }}
          >{range.label}</button>
        {/each}
      </div>
      <span class="trace-count">{traces.length} traces</span>
    </div>
  </div>

  <div class="traces-container">
    {#if loading}
      <div class="traces-status">Loading traces…</div>
    {:else if error}
      <div class="traces-status traces-error">{error}</div>
    {:else if traces.length === 0}
      <div class="traces-empty">
        <div class="traces-status">No traces found for <strong>{service}</strong> in the selected time range.</div>
        <div class="traces-hint">
          Traces are queried from the <code>aws/spans</code> log group via CloudWatch Logs Insights.
          Try expanding the time range, or verify that the service is generating traffic.
        </div>
      </div>
    {:else if !selectedTrace}
      <!-- Trace list view -->
      <div class="trace-list">
        <div class="trace-list-header">
          <span class="th-time">Start Time</span>
          <span class="th-id">Trace ID</span>
          <span class="th-services">Services</span>
          <span class="th-spans">Spans</span>
          <span class="th-duration">Duration</span>
        </div>
        {#each traces as trace}
          <!-- svelte-ignore a11y_no_static_element_interactions -->
          <div class="trace-row" onclick={() => selectTrace(trace)}>
            <span class="td-time">{formatTime(trace.startTime)}</span>
            <span class="td-id">{trace.traceId.slice(0, 16)}…</span>
            <span class="td-services">
              {#each trace.services.slice(0, 4) as svc}
                <span class="svc-tag">{svc}</span>
              {/each}
              {#if trace.services.length > 4}
                <span class="svc-more" title="{trace.services.slice(4).join(', ')}">+{trace.services.length - 4}</span>
              {/if}
            </span>
            <span class="td-spans">{trace.spans.length}</span>
            <span class="td-duration">{formatDuration(trace.duration)}</span>
          </div>
        {/each}
      </div>
    {:else}
      <!-- Waterfall view -->
      <div class="waterfall">
        <div class="waterfall-header">
          <span class="wf-label-col">Span</span>
          <div class="wf-bar-col">
            <span class="wf-tick" style="left: 0%">0ms</span>
            <span class="wf-tick" style="left: 25%">{formatDuration(selectedTrace.duration * 0.25)}</span>
            <span class="wf-tick" style="left: 50%">{formatDuration(selectedTrace.duration * 0.5)}</span>
            <span class="wf-tick" style="left: 75%">{formatDuration(selectedTrace.duration * 0.75)}</span>
            <span class="wf-tick" style="left: 100%">{formatDuration(selectedTrace.duration)}</span>
          </div>
        </div>
        {#each flatSpans as node}
          <!-- svelte-ignore a11y_no_static_element_interactions -->
          <div class="wf-row" class:wf-error={node.span.statusCode === 'ERROR'} onclick={() => toggleSpan(node.span.spanId)}>
            <div class="wf-label-col">
              <span class="wf-indent" style="width: {node.depth * 16}px"></span>
              <span class="wf-expand">{expandedSpanId === node.span.spanId ? '▾' : '▸'}</span>
              <span class="wf-svc {statusClass(node.span.statusCode)}">{node.span.serviceName}</span>
              <span class="wf-name">{node.span.name}</span>
            </div>
            <div class="wf-bar-col">
              <div class="wf-bar-track">
                <div
                  class="wf-bar"
                  style="{barStyle(node.span, selectedTrace.startTime, selectedTrace.duration)} background: {spanColor(node.span)};"
                >
                  <span class="wf-bar-label">{formatDuration(node.span.duration)}</span>
                </div>
              </div>
            </div>
          </div>
          {#if expandedSpanId === node.span.spanId}
            <div class="wf-attrs">
              <div class="attr-section">
                {#if onviewlogs}
                  <div class="span-actions">
                    <button class="span-logs-btn" onclick={(e) => { e.stopPropagation(); if (onviewlogs) onviewlogs(node.span.serviceName); }}>Logs …</button>
                  </div>
                {/if}
                <div class="attr-row">
                  <span class="attr-key">span.id</span>
                  <span class="attr-val">{node.span.spanId}</span>
                </div>
                <div class="attr-row">
                  <span class="attr-key">parent.id</span>
                  <span class="attr-val">{node.span.parentSpanId ?? '—'}</span>
                </div>
                <div class="attr-row">
                  <span class="attr-key">status</span>
                  <span class="attr-val {statusClass(node.span.statusCode)}">{node.span.statusCode}</span>
                </div>
                <div class="attr-row">
                  <span class="attr-key">start</span>
                  <span class="attr-val">{formatTime(node.span.startTime)}</span>
                </div>
                <div class="attr-row">
                  <span class="attr-key">duration</span>
                  <span class="attr-val">{formatDuration(node.span.duration)}</span>
                </div>
                {#each Object.entries(node.span.attributes).sort(([a], [b]) => a.localeCompare(b)) as [key, value]}
                  <div class="attr-row">
                    {#if semconvUrl(key)}
                      <a class="attr-key attr-link" href={semconvUrl(key)} target="_blank" rel="noopener" onclick={(e) => e.stopPropagation()} title="View in OTel Semantic Conventions">{key}<span class="link-icon">🔗</span></a>
                    {:else}
                      <span class="attr-key">{key}</span>
                    {/if}
                    <span class="attr-val">{value}</span>
                  </div>
                {/each}
              </div>
            </div>
          {/if}
        {/each}
      </div>
    {/if}
  </div>
</FullscreenModal>

<style>
  .traces-toolbar {
    margin-bottom: 0.75rem;
    padding-bottom: 0.75rem;
    border-bottom: 1px solid #21262d;
  }
  .toolbar-row {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }
  .back-btn {
    background: #21262d;
    border: 1px solid #30363d;
    border-radius: 6px;
    color: #58a6ff;
    padding: 0.4rem 0.75rem;
    font-size: 0.8rem;
    cursor: pointer;
    font-family: inherit;
  }
  .back-btn:hover { background: #30363d; border-color: #58a6ff; }
  .back-btn kbd {
    background: #30363d;
    border: 1px solid #484f58;
    border-radius: 3px;
    padding: 0 0.3rem;
    font-family: inherit;
    font-size: 0.7rem;
    color: #8b949e;
    margin-left: 0.3rem;
  }
  .trace-id-label {
    color: #8b949e;
    font-size: 0.8rem;
    font-family: 'SF Mono', 'Fira Code', monospace;
  }
  .time-range-toggle {
    display: flex;
    border: 1px solid #30363d;
    border-radius: 6px;
    overflow: hidden;
    flex-shrink: 0;
    margin-left: auto;
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
  .range-btn:last-child { border-right: none; }
  .range-btn:hover { color: #e1e4e8; background: #30363d; }
  .range-btn.active { background: #58a6ff; color: #0d1117; font-weight: 600; }
  .trace-count {
    color: #6e7681;
    font-size: 0.8rem;
    white-space: nowrap;
  }
  .traces-container {
    min-height: 150px;
    height: 500px;
    max-height: 75vh;
    overflow-y: auto;
    resize: vertical;
    border: 1px solid #21262d;
    border-radius: 6px;
    padding-bottom: 2px;
  }
  .traces-status {
    color: #8b949e;
    text-align: center;
    padding: 2rem;
    font-size: 0.9rem;
  }
  .traces-error { color: #f85149; }
  .traces-empty {
    text-align: center;
    padding: 2rem 1rem;
  }
  .traces-empty .traces-status {
    padding-bottom: 0.75rem;
  }
  .traces-hint {
    color: #6e7681;
    font-size: 0.8rem;
    max-width: 500px;
    margin: 0 auto;
    line-height: 1.5;
  }
  .traces-hint a {
    color: #58a6ff;
    text-decoration: none;
  }
  .traces-hint a:hover {
    text-decoration: underline;
  }

  /* Trace list */
  .trace-list-header {
    display: grid;
    grid-template-columns: 7rem 10rem 1fr 4rem 5rem;
    gap: 0.5rem;
    padding: 0.5rem 0.75rem;
    border-bottom: 1px solid #30363d;
    color: #6e7681;
    font-size: 0.75rem;
    text-transform: uppercase;
    letter-spacing: 0.04em;
  }
  .trace-row {
    display: grid;
    grid-template-columns: 7rem 10rem 1fr 4rem 5rem;
    gap: 0.5rem;
    padding: 0.5rem 0.75rem;
    border-bottom: 1px solid #21262d;
    cursor: pointer;
    font-size: 0.8rem;
    align-items: center;
  }
  .trace-row:hover { background: #21262d; }
  .td-time { color: #6e7681; font-family: 'SF Mono', 'Fira Code', monospace; font-size: 0.75rem; }
  .td-id { color: #58a6ff; font-family: 'SF Mono', 'Fira Code', monospace; font-size: 0.75rem; }
  .td-services { display: flex; flex-wrap: wrap; gap: 0.25rem; }
  .svc-tag {
    background: #21262d;
    border: 1px solid #30363d;
    border-radius: 3px;
    padding: 0.1rem 0.35rem;
    font-size: 0.7rem;
    color: #c9d1d9;
  }
  .svc-more { color: #6e7681; font-size: 0.7rem; }
  .td-spans { color: #8b949e; text-align: center; }
  .td-duration { color: #e1e4e8; font-family: 'SF Mono', 'Fira Code', monospace; font-size: 0.75rem; text-align: right; }

  /* Waterfall */
  .waterfall { font-size: 0.8rem; }
  .waterfall-header {
    display: grid;
    grid-template-columns: 280px 1fr;
    gap: 0.5rem;
    padding: 0.4rem 0.5rem;
    border-bottom: 1px solid #30363d;
    color: #6e7681;
    font-size: 0.7rem;
  }
  .wf-bar-col {
    position: relative;
    min-height: 1.2rem;
  }
  .wf-tick {
    position: absolute;
    top: 0;
    transform: translateX(-50%);
    color: #484f58;
    font-size: 0.65rem;
    font-family: 'SF Mono', 'Fira Code', monospace;
    white-space: nowrap;
  }
  .wf-row {
    display: grid;
    grid-template-columns: 280px 1fr;
    gap: 0.5rem;
    padding: 0.25rem 0.5rem;
    border-bottom: 1px solid #161b22;
    cursor: pointer;
    align-items: center;
  }
  .wf-row:hover { background: #1c2128; }
  .wf-row.wf-error { background: #f8514910; }
  .wf-label-col {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    min-width: 0;
    overflow: hidden;
  }
  .wf-indent { flex-shrink: 0; }
  .wf-expand { color: #6e7681; font-size: 0.65rem; flex-shrink: 0; width: 1em; }
  .wf-svc {
    flex-shrink: 0;
    font-size: 0.7rem;
    padding: 0.05rem 0.3rem;
    border-radius: 3px;
    background: #21262d;
    color: #c9d1d9;
    max-width: 8rem;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .wf-name {
    color: #8b949e;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size: 0.75rem;
  }
  .wf-bar-track {
    position: relative;
    height: 18px;
    background: #0d1117;
    border-radius: 3px;
  }
  .wf-bar {
    position: absolute;
    top: 2px;
    height: 14px;
    border-radius: 2px;
    min-width: 2px;
    display: flex;
    align-items: center;
    padding: 0 4px;
    overflow: hidden;
  }
  .wf-bar-label {
    color: #fff;
    font-size: 0.6rem;
    font-family: 'SF Mono', 'Fira Code', monospace;
    white-space: nowrap;
    text-shadow: 0 1px 2px rgba(0,0,0,0.6);
  }

  /* Span detail */
  .wf-attrs {
    background: #1c2128;
    border-bottom: 1px solid #21262d;
    padding: 0.5rem 0.75rem 0.5rem 2rem;
  }
  .attr-section { display: flex; flex-direction: column; gap: 0.15rem; }
  .span-actions {
    margin-bottom: 0.5rem;
    padding-bottom: 0.5rem;
    border-bottom: 1px solid #21262d;
  }
  .span-logs-btn {
    background: #21262d;
    border: 1px solid #30363d;
    border-radius: 6px;
    color: #58a6ff;
    padding: 0.3rem 0.75rem;
    font-size: 0.75rem;
    cursor: pointer;
    font-family: inherit;
    transition: all 0.15s;
  }
  .span-logs-btn:hover {
    background: #30363d;
    border-color: #58a6ff;
  }
  .attr-row {
    display: flex;
    gap: 0.75rem;
    font-size: 0.75rem;
    padding: 0.1rem 0;
  }
  .attr-key {
    color: #d2a8ff;
    flex-shrink: 0;
    min-width: 12rem;
    font-family: 'SF Mono', 'Fira Code', monospace;
  }
  .attr-link {
    text-decoration: none;
    cursor: pointer;
  }
  .attr-link:hover {
    text-decoration: underline;
    color: #e0c3ff;
  }
  .link-icon {
    font-size: 0.6rem;
    margin-left: 0.3rem;
    opacity: 0.5;
    text-decoration: none;
    display: inline-block;
  }
  .attr-link:hover .link-icon {
    opacity: 1;
  }
  .attr-val {
    color: #8b949e;
    word-break: break-all;
    font-family: 'SF Mono', 'Fira Code', monospace;
  }
  .status-ok { color: #3fb950; }
  .status-error { color: #f85149; }
  .status-unset { color: #8b949e; }
</style>

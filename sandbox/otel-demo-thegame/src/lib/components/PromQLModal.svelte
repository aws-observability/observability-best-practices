<script lang="ts">
  let { open = $bindable(false) }: { open: boolean } = $props();

  let query = $state('');
  let loading = $state(false);
  let error = $state('');
  let resultData = $state<any>(null);
  let activeTab = $state<'graph' | 'table' | 'heatmap'>('graph');
  let canvas = $state<HTMLCanvasElement | null>(null);
  let heatmapCanvas = $state<HTMLCanvasElement | null>(null);
  let inputEl = $state<HTMLTextAreaElement | null>(null);
  let modalEl = $state<HTMLDivElement | null>(null);
  let isHistogramData = $state(false);

  // Resize / drag state
  let modalW = $state(0);
  let modalH = $state(0);
  let modalX = $state(0);
  let modalY = $state(0);
  let positioned = $state(false);
  let dragging = $state<'move' | 'n' | 's' | 'e' | 'w' | 'ne' | 'nw' | 'se' | 'sw' | null>(null);
  let dragStartX = 0;
  let dragStartY = 0;
  let dragStartW = 0;
  let dragStartH = 0;
  let dragStartMX = 0;
  let dragStartMY = 0;

  const MIN_W = 480;
  const MIN_H = 320;

  // Initialize position/size centered on first open
  $effect(() => {
    if (open && !positioned) {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      modalW = Math.min(Math.round(vw * 0.92), 1100);
      modalH = Math.min(Math.round(vh * 0.9), 800);
      modalX = Math.round((vw - modalW) / 2);
      modalY = Math.round((vh - modalH) / 2);
      positioned = true;
    }
  });

  function onResizePointerDown(edge: typeof dragging, e: PointerEvent) {
    if (!edge) return;
    e.preventDefault();
    e.stopPropagation();
    dragging = edge;
    dragStartX = e.clientX;
    dragStartY = e.clientY;
    dragStartW = modalW;
    dragStartH = modalH;
    dragStartMX = modalX;
    dragStartMY = modalY;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  }

  function onResizePointerMove(e: PointerEvent) {
    if (!dragging) return;
    const dx = e.clientX - dragStartX;
    const dy = e.clientY - dragStartY;

    let newW = dragStartW;
    let newH = dragStartH;
    let newX = dragStartMX;
    let newY = dragStartMY;

    if (dragging === 'move') {
      newX = dragStartMX + dx;
      newY = dragStartMY + dy;
    } else {
      if (dragging.includes('e')) newW = Math.max(MIN_W, dragStartW + dx);
      if (dragging.includes('w')) { newW = Math.max(MIN_W, dragStartW - dx); newX = dragStartMX + (dragStartW - newW); }
      if (dragging.includes('s')) newH = Math.max(MIN_H, dragStartH + dy);
      if (dragging.includes('n')) { newH = Math.max(MIN_H, dragStartH - dy); newY = dragStartMY + (dragStartH - newH); }
    }

    modalW = newW;
    modalH = newH;
    modalX = newX;
    modalY = newY;
  }

  function onResizePointerUp() {
    dragging = null;
  }

  function onHeaderPointerDown(e: PointerEvent) {
    // Only drag from the header background, not buttons
    if ((e.target as HTMLElement).closest('button')) return;
    e.preventDefault();
    dragging = 'move';
    dragStartX = e.clientX;
    dragStartY = e.clientY;
    dragStartMX = modalX;
    dragStartMY = modalY;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  }

  // Autocomplete state
  let metricNames = $state<string[]>([]);
  let labelNames = $state<string[]>([]);
  let suggestions = $state<Array<{ text: string; kind: 'metric' | 'label' | 'function' }>>([]);
  let selectedIdx = $state(-1);
  let showSuggestions = $state(false);
  let acWordStart = $state(0);
  let metadataLoaded = $state(false);
  let applyingAc = false;
  let highlightedSeries = $state<number | null>(null);

  const RANGE_OPTIONS = [
    { label: '1h', minutes: 60 },
    { label: '3h', minutes: 180 },
    { label: '6h', minutes: 360 },
    { label: '12h', minutes: 720 },
    { label: '1d', minutes: 1440 },
    { label: '3d', minutes: 4320 },
  ];
  let rangeMinutes = $state(180);

  const PROMQL_FUNCTIONS = [
    'abs', 'absent', 'absent_over_time', 'avg', 'avg_over_time', 'ceil',
    'changes', 'clamp', 'clamp_max', 'clamp_min', 'count', 'count_over_time',
    'day_of_month', 'day_of_week', 'day_of_year', 'days_in_month', 'delta',
    'deriv', 'exp', 'floor', 'group', 'histogram_quantile', 'holt_winters',
    'hour', 'idelta', 'increase', 'irate', 'label_join', 'label_replace',
    'last_over_time', 'ln', 'log2', 'log10', 'max', 'max_over_time',
    'min', 'min_over_time', 'minute', 'month', 'predict_linear',
    'quantile', 'quantile_over_time', 'rate', 'resets', 'round',
    'scalar', 'sgn', 'sort', 'sort_desc', 'sqrt', 'stddev',
    'stddev_over_time', 'stdvar', 'stdvar_over_time', 'sum',
    'sum_over_time', 'time', 'timestamp', 'topk', 'bottomk',
    'vector', 'year',
  ];

  // Focus input when modal opens
  $effect(() => {
    if (open) {
      requestAnimationFrame(() => inputEl?.focus());
    }
  });

  // Fetch metadata when modal opens
  $effect(() => {
    if (open && !metadataLoaded) {
      fetchMetadata();
    }
  });

  async function fetchMetadata() {
    try {
      const resp = await fetch('/api/promql/metadata');
      const data = await resp.json();
      metricNames = data.metrics ?? [];
      labelNames = data.labels ?? [];
      metadataLoaded = true;
    } catch {
      // Best-effort — autocomplete just won't have live data
    }
  }

  function onBackdrop(e: MouseEvent) {
    if ((e.target as HTMLElement).classList.contains('modal-backdrop')) close();
  }

  function close() {
    open = false;
    error = '';
    resultData = null;
    isHistogramData = false;
    closeSuggestions();
    positioned = false;
  }

  function closeSuggestions() {
    showSuggestions = false;
    suggestions = [];
    selectedIdx = -1;
  }

  function onInputKeydown(e: KeyboardEvent) {
    if (showSuggestions && suggestions.length > 0) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        selectedIdx = (selectedIdx + 1) % suggestions.length;
        return;
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        selectedIdx = selectedIdx <= 0 ? suggestions.length - 1 : selectedIdx - 1;
        return;
      }
      if (e.key === 'Tab' || e.key === 'Enter') {
        if (selectedIdx >= 0 && selectedIdx < suggestions.length) {
          e.preventDefault();
          applySuggestion(suggestions[selectedIdx]);
          return;
        }
      }
      if (e.key === 'Escape') {
        e.preventDefault();
        closeSuggestions();
        return;
      }
    }
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      runQuery();
    }
  }

  function onInput() {
    if (applyingAc) return;
    updateSuggestions();
  }

  function updateSuggestions() {
    if (!inputEl) { closeSuggestions(); return; }
    const pos = inputEl.selectionStart ?? query.length;
    const before = query.substring(0, pos);

    // Extract the current word being typed (letters, digits, dots, underscores, @)
    const wordMatch = before.match(/([a-zA-Z_@.][a-zA-Z0-9_.@]*)$/);
    if (!wordMatch || wordMatch[1].length < 1) {
      closeSuggestions();
      return;
    }

    const word = wordMatch[1];
    acWordStart = pos - word.length;
    const lower = word.toLowerCase();

    // Determine context: inside {} = label context, otherwise metric/function
    const openBraces = (before.match(/{/g) || []).length;
    const closeBraces = (before.match(/}/g) || []).length;
    const insideBraces = openBraces > closeBraces;

    let matches: Array<{ text: string; kind: 'metric' | 'label' | 'function' }> = [];

    if (insideBraces) {
      // Suggest label names
      matches = labelNames
        .filter(l => l.toLowerCase().includes(lower))
        .slice(0, 15)
        .map(l => ({ text: l, kind: 'label' as const }));
    } else {
      // Suggest functions
      const fnMatches = PROMQL_FUNCTIONS
        .filter(f => f.includes(lower))
        .map(f => ({ text: f, kind: 'function' as const }));
      // Suggest metric names
      const metricMatches = metricNames
        .filter(m => m.toLowerCase().includes(lower))
        .map(m => ({ text: m, kind: 'metric' as const }));
      matches = [...fnMatches, ...metricMatches].slice(0, 15);
    }

    // Don't show if the only match is exactly what's typed
    if (matches.length === 1 && matches[0].text === word) {
      closeSuggestions();
      return;
    }

    suggestions = matches;
    selectedIdx = matches.length > 0 ? 0 : -1;
    showSuggestions = matches.length > 0;
  }

  // Check if a name needs UTF-8 quoting for PromQL v3 (contains dots, @, etc.)
  function needsUtf8Quoting(name: string): boolean {
    return /[^a-zA-Z0-9_:]/.test(name);
  }

  function applySuggestion(s: { text: string; kind: string }) {
    if (!inputEl) return;
    const pos = inputEl.selectionStart ?? query.length;
    const before = query.substring(0, acWordStart);
    const after = query.substring(pos);
    let insert = s.text;

    if (s.kind === 'metric' && needsUtf8Quoting(insert)) {
      // Wrap in {"..."} selector — but check if we're already inside braces
      const openBraces = (before.match(/{/g) || []).length;
      const closeBraces = (before.match(/}/g) || []).length;
      const insideBraces = openBraces > closeBraces;
      if (insideBraces) {
        // Already inside {}, just quote the name
        insert = `"${insert}"`;
      } else {
        insert = `{"${insert}"}`;
      }
    } else if (s.kind === 'label' && needsUtf8Quoting(insert)) {
      // Labels with special chars get quoted
      insert = `"${insert}"`;
    } else if (s.kind === 'function' && !after.startsWith('(')) {
      insert += '(';
    }

    applyingAc = true;
    query = before + insert + after;
    closeSuggestions();
    const newPos = acWordStart + insert.length;
    requestAnimationFrame(() => {
      inputEl?.setSelectionRange(newPos, newPos);
      inputEl?.focus();
      applyingAc = false;
    });
  }

  async function runQuery() {
    closeSuggestions();
    const trimmed = query.trim();
    if (!trimmed) { error = 'Please enter a PromQL query.'; return; }

    error = '';
    loading = true;
    resultData = null;

    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 30_000);
      const resp = await fetch('/api/promql', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: trimmed, rangeMinutes }),
        signal: controller.signal,
      });
      clearTimeout(timeout);
      const data = await resp.json();
      if (!resp.ok) {
        error = data.error || `Request failed (${resp.status})`;
        return;
      }
      if (!data.data?.result?.length) {
        error = 'Query returned no results.';
        return;
      }
      resultData = data;
      isHistogramData = data.data?.resultType === 'histogram';
      activeTab = isHistogramData ? 'heatmap' : 'graph';
      highlightedSeries = null;
    } catch (e: any) {
      error = e.name === 'AbortError' ? 'Query timed out — try a shorter range or simpler query.' : (e.message || 'Network error');
    } finally {
      loading = false;
    }
  }

  // Draw chart whenever canvas, data, tab, highlight, range, or modal size changes
  let chartRafId = 0;
  $effect(() => {
    const _hl = highlightedSeries;
    const _rm = rangeMinutes;
    const _mw = modalW;
    const _mh = modalH;
    console.log('[chart-debug] $effect fired', { activeTab, hasCanvas: !!canvas, hasData: !!resultData, modalW: _mw, modalH: _mh });
    if (activeTab === 'graph' && canvas && resultData) {
      const cvs = canvas;
      const data = resultData;
      cancelAnimationFrame(chartRafId);
      // Defer to next frame so the browser has laid out the canvas container
      chartRafId = requestAnimationFrame(() => {
        console.log('[chart-debug] rAF callback executing');
        drawChart(cvs, data);
      });
    }
  });

  // Draw heatmap for histogram data
  let heatmapRafId = 0;
  $effect(() => {
    const _mw = modalW;
    const _mh = modalH;
    if (activeTab === 'heatmap' && heatmapCanvas && resultData && isHistogramData) {
      const cvs = heatmapCanvas;
      const data = resultData;
      cancelAnimationFrame(heatmapRafId);
      heatmapRafId = requestAnimationFrame(() => drawHeatmap(cvs, data));
    }
  });

  function drawHeatmap(cvs: HTMLCanvasElement, data: any) {
    const ctx = cvs.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = cvs.getBoundingClientRect();
    cvs.width = rect.width * dpr;
    cvs.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
    const W = rect.width;
    const H = rect.height;
    if (W === 0 || H === 0) return;

    ctx.clearRect(0, 0, W, H);

    const results = data.data.result ?? [];
    if (!results.length) return;

    // Collect all buckets across all series and timestamps
    // Each histogram entry: [timestamp, { count, sum, buckets }]
    // buckets: [[boundary_type, lower_bound, upper_bound, count], ...]
    type BucketCell = { t: number; lower: number; upper: number; count: number };
    const cells: BucketCell[] = [];
    const allBounds = new Set<number>();
    let minT = Infinity, maxT = -Infinity;

    for (const series of results) {
      const histEntries = series.histograms ?? [];
      for (const entry of histEntries) {
        // entry can be [timestamp, histogramObj] or just histogramObj
        let ts: number;
        let hist: any;
        if (Array.isArray(entry) && entry.length === 2) {
          ts = typeof entry[0] === 'number' ? entry[0] : parseFloat(entry[0]);
          hist = entry[1];
        } else {
          continue;
        }

        if (!isFinite(ts)) continue;
        if (ts < minT) minT = ts;
        if (ts > maxT) maxT = ts;

        const buckets = hist?.buckets ?? [];
        for (const bucket of buckets) {
          // bucket: [boundary_type, lower_str, upper_str, count_str]
          const lower = parseFloat(bucket[1]);
          const upper = parseFloat(bucket[2]);
          const count = parseFloat(bucket[3]);
          if (!isFinite(count) || count === 0) continue;
          if (!isFinite(lower) || !isFinite(upper)) continue;
          allBounds.add(lower);
          allBounds.add(upper);
          cells.push({ t: ts, lower, upper, count });
        }
      }
    }

    if (cells.length === 0) {
      ctx.fillStyle = '#8b949e';
      ctx.font = '13px -apple-system, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('No histogram bucket data to display.', W / 2, H / 2);
      return;
    }

    // Sort bounds for y-axis
    const sortedBounds = [...allBounds].sort((a, b) => a - b);
    const minB = sortedBounds[0];
    const maxB = sortedBounds[sortedBounds.length - 1];

    // Find max count for color scaling
    let maxCount = 0;
    for (const c of cells) {
      if (c.count > maxCount) maxCount = c.count;
    }

    const pad = { top: 20, right: 80, bottom: 40, left: 70 };
    const cw = W - pad.left - pad.right;
    const ch = H - pad.top - pad.bottom;

    // Use log scale for y-axis if range is large
    const bRange = maxB - minB;
    const useLogY = maxB > 0 && minB >= 0 && maxB / Math.max(minB, 0.001) > 100;
    const logMinB = useLogY ? Math.log10(Math.max(minB, maxB * 1e-6)) : 0;
    const logMaxB = useLogY ? Math.log10(maxB) : 0;

    const xScale = (t: number) => pad.left + ((t - minT) / (maxT - minT || 1)) * cw;
    const yScale = (v: number) => {
      if (useLogY) {
        const logV = Math.log10(Math.max(v, Math.pow(10, logMinB)));
        return pad.top + ch - ((logV - logMinB) / (logMaxB - logMinB || 1)) * ch;
      }
      return pad.top + ch - ((v - minB) / (bRange || 1)) * ch;
    };

    // Determine time step from data
    const timestamps = [...new Set(cells.map(c => c.t))].sort((a, b) => a - b);
    const timeStep = timestamps.length > 1 ? timestamps[1] - timestamps[0] : (maxT - minT) / 10;
    const cellW = Math.max(1, (timeStep / (maxT - minT || 1)) * cw);

    // Draw grid
    ctx.strokeStyle = '#21262d';
    ctx.lineWidth = 1;

    // Y-axis grid + labels
    const yTicks = 6;
    ctx.textAlign = 'right';
    ctx.font = '11px -apple-system, sans-serif';
    for (let i = 0; i <= yTicks; i++) {
      let val: number;
      if (useLogY) {
        val = Math.pow(10, logMinB + ((logMaxB - logMinB) / yTicks) * i);
      } else {
        val = minB + (bRange / yTicks) * i;
      }
      const y = yScale(val);
      ctx.beginPath(); ctx.moveTo(pad.left, y); ctx.lineTo(W - pad.right, y); ctx.stroke();
      ctx.fillStyle = '#8b949e';
      ctx.fillText(formatValue(val), pad.left - 8, y + 4);
    }

    // X-axis time labels
    const rangeSec = maxT - minT;
    const xTicks = 6;
    ctx.textAlign = 'center';
    for (let i = 0; i <= xTicks; i++) {
      const t = minT + (rangeSec / xTicks) * i;
      const x = xScale(t);
      ctx.beginPath(); ctx.moveTo(x, pad.top); ctx.lineTo(x, pad.top + ch); ctx.stroke();
      ctx.fillStyle = '#8b949e';
      ctx.fillText(formatTimeLabel(t, rangeSec), x, H - pad.bottom + 20);
    }

    // Draw heatmap cells
    for (const cell of cells) {
      const x = xScale(cell.t);
      const y1 = yScale(cell.upper);
      const y2 = yScale(cell.lower);
      const cellH = Math.max(1, y2 - y1);

      // Color: intensity based on count (log scale for better distribution)
      const intensity = maxCount > 0 ? Math.log10(cell.count + 1) / Math.log10(maxCount + 1) : 0;
      const color = heatmapColor(intensity);
      ctx.fillStyle = color;
      ctx.fillRect(x - cellW / 2, y1, cellW, cellH);
    }

    // Draw color legend
    const legendX = W - pad.right + 15;
    const legendW = 12;
    const legendH = ch;
    const legendY = pad.top;
    const steps = 50;
    for (let i = 0; i < steps; i++) {
      const intensity = 1 - i / steps;
      ctx.fillStyle = heatmapColor(intensity);
      ctx.fillRect(legendX, legendY + (legendH / steps) * i, legendW, legendH / steps + 1);
    }
    ctx.strokeStyle = '#30363d';
    ctx.strokeRect(legendX, legendY, legendW, legendH);

    // Legend labels
    ctx.fillStyle = '#8b949e';
    ctx.font = '10px -apple-system, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(formatValue(maxCount), legendX + legendW + 4, legendY + 10);
    ctx.fillText('0', legendX + legendW + 4, legendY + legendH);
  }

  function heatmapColor(intensity: number): string {
    // Dark blue → cyan → yellow → red
    const t = Math.max(0, Math.min(1, intensity));
    if (t === 0) return '#0d1117';
    let r: number, g: number, b: number;
    if (t < 0.33) {
      const p = t / 0.33;
      r = 13; g = Math.round(17 + p * 130); b = Math.round(34 + p * 190);
    } else if (t < 0.66) {
      const p = (t - 0.33) / 0.33;
      r = Math.round(p * 220); g = Math.round(147 + p * 73); b = Math.round(224 - p * 180);
    } else {
      const p = (t - 0.66) / 0.34;
      r = Math.round(220 + p * 28); g = Math.round(220 - p * 140); b = Math.round(44 - p * 44);
    }
    return `rgb(${r},${g},${b})`;
  }

  function drawChart(cvs: HTMLCanvasElement, data: any) {
    const ctx = cvs.getContext('2d');
    if (!ctx) { console.log('[chart-debug] no 2d context'); return; }

    const dpr = window.devicePixelRatio || 1;
    const rect = cvs.getBoundingClientRect();
    console.log('[chart-debug] canvas rect', { width: rect.width, height: rect.height, top: rect.top, left: rect.left, dpr });

    const parentRect = cvs.parentElement?.getBoundingClientRect();
    console.log('[chart-debug] parent rect', parentRect ? { width: parentRect.width, height: parentRect.height } : 'no parent');

    cvs.width = rect.width * dpr;
    cvs.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
    const W = rect.width;
    const H = rect.height;

    console.log('[chart-debug] drawing dimensions', { W, H, bufferW: cvs.width, bufferH: cvs.height });

    if (W === 0 || H === 0) {
      console.warn('[chart-debug] ZERO canvas dimensions — chart will be invisible');
      return;
    }

    ctx.clearRect(0, 0, W, H);

    const results: Array<{ metric: Record<string, string>; values: [number, string][] }> = data.data.result;
    if (!results.length) { console.log('[chart-debug] no result series'); return; }

    console.log('[chart-debug] series count:', results.length);
    // Log first series sample
    const firstSeries = results[0];
    console.log('[chart-debug] first series keys:', Object.keys(firstSeries));
    console.log('[chart-debug] first series metric:', firstSeries.metric);
    console.log('[chart-debug] resultType:', data.data.resultType);

    // Normalize: Prometheus returns "values" for matrix (range) and "value" for vector (instant)
    function getSeriesValues(s: any): [number, string][] {
      if (Array.isArray(s.values)) return s.values;
      if (Array.isArray(s.value)) return [s.value];
      // CloudWatch may nest under "datapoints" or other keys — try to find an array
      for (const key of Object.keys(s)) {
        if (key !== 'metric' && Array.isArray(s[key])) {
          console.log('[chart-debug] using fallback key for values:', key);
          return s[key];
        }
      }
      return [];
    }

    // Compute global min/max
    let minT = Infinity, maxT = -Infinity, minV = Infinity, maxV = -Infinity;
    let finiteCount = 0;
    let nanCount = 0;
    for (const series of results) {
      for (const [t, v] of getSeriesValues(series)) {
        const val = parseFloat(v);
        if (!isFinite(val)) { nanCount++; continue; }
        finiteCount++;
        if (t < minT) minT = t;
        if (t > maxT) maxT = t;
        if (val < minV) minV = val;
        if (val > maxV) maxV = val;
      }
    }

    console.log('[chart-debug] value stats', { finiteCount, nanCount, minT, maxT, minV, maxV });

    // All values were NaN / Inf — nothing plottable
    if (!isFinite(minV) || !isFinite(maxV) || !isFinite(minT) || !isFinite(maxT)) {
      console.warn('[chart-debug] no finite values — showing fallback message');
      ctx.fillStyle = '#8b949e';
      ctx.font = '13px -apple-system, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('No numeric data to plot — all values are NaN or Inf.', W / 2, H / 2 - 8);
      ctx.font = '11px -apple-system, sans-serif';
      ctx.fillStyle = '#6e7681';
      ctx.fillText('For histograms, try wrapping with histogram_quantile().', W / 2, H / 2 + 14);
      return;
    }

    if (minV === maxV) { minV -= 1; maxV += 1; }

    const pad = { top: 20, right: 20, bottom: 40, left: 70 };
    const cw = W - pad.left - pad.right;
    const ch = H - pad.top - pad.bottom;

    const xScale = (t: number) => pad.left + ((t - minT) / (maxT - minT || 1)) * cw;
    const yScale = (v: number) => pad.top + ch - ((v - minV) / (maxV - minV || 1)) * ch;

    // Grid lines
    ctx.strokeStyle = '#21262d';
    ctx.lineWidth = 1;
    const yTicks = 5;
    for (let i = 0; i <= yTicks; i++) {
      const y = pad.top + (ch / yTicks) * i;
      ctx.beginPath(); ctx.moveTo(pad.left, y); ctx.lineTo(W - pad.right, y); ctx.stroke();
      const val = maxV - ((maxV - minV) / yTicks) * i;
      ctx.fillStyle = '#8b949e';
      ctx.font = '11px -apple-system, sans-serif';
      ctx.textAlign = 'right';
      ctx.fillText(formatValue(val), pad.left - 8, y + 4);
    }

    // X-axis time labels
    const rangeSec = maxT - minT;
    const xTicks = 6;
    ctx.textAlign = 'center';
    for (let i = 0; i <= xTicks; i++) {
      const t = minT + (rangeSec / xTicks) * i;
      const x = xScale(t);
      ctx.beginPath(); ctx.moveTo(x, pad.top); ctx.lineTo(x, pad.top + ch); ctx.stroke();
      ctx.fillStyle = '#8b949e';
      ctx.fillText(formatTimeLabel(t, rangeSec), x, H - pad.bottom + 20);
    }

    // Series — draw dimmed ones first, then highlighted on top
    const drawOrder = [];
    for (let si = 0; si < results.length; si++) drawOrder.push(si);
    if (highlightedSeries !== null) {
      // Move highlighted to end so it draws on top
      const hlIdx = drawOrder.indexOf(highlightedSeries);
      if (hlIdx >= 0) { drawOrder.splice(hlIdx, 1); drawOrder.push(highlightedSeries); }
    }

    for (const si of drawOrder) {
      const series = results[si];
      const color = SERIES_COLORS[si % SERIES_COLORS.length];
      const dimmed = highlightedSeries !== null && si !== highlightedSeries;
      ctx.globalAlpha = dimmed ? 0.1 : 1;
      ctx.strokeStyle = color;
      ctx.lineWidth = dimmed ? 1 : 1.5;
      ctx.beginPath();
      let started = false;
      for (const [t, v] of getSeriesValues(series)) {
        const val = parseFloat(v);
        if (!isFinite(val)) { started = false; continue; }
        const x = xScale(t);
        const y = yScale(val);
        if (!started) { ctx.moveTo(x, y); started = true; }
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
  }

  const SERIES_COLORS = ['#58a6ff', '#3fb950', '#d29922', '#f85149', '#a78bfa', '#f0883e', '#56d4dd', '#db61a2'];

  function getLegendItems(data: any): Array<{ label: string; color: string; index: number }> {
    const results = data?.data?.result ?? [];
    return results.map((r: any, i: number) => ({
      label: seriesLabel(r.metric),
      color: SERIES_COLORS[i % SERIES_COLORS.length],
      index: i,
    }));
  }

  function toggleHighlight(idx: number) {
    highlightedSeries = highlightedSeries === idx ? null : idx;
  }

  function formatValue(v: number): string {
    if (Math.abs(v) >= 1e9) return (v / 1e9).toFixed(1) + 'G';
    if (Math.abs(v) >= 1e6) return (v / 1e6).toFixed(1) + 'M';
    if (Math.abs(v) >= 1e3) return (v / 1e3).toFixed(1) + 'K';
    return v.toFixed(2);
  }

  function formatTimeLabel(epoch: number, rangeSec: number): string {
    const d = new Date(epoch * 1000);
    if (rangeSec <= 6 * 3600) {
      // ≤6h: just time
      return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    if (rangeSec <= 2 * 86400) {
      // ≤2d: date + time
      return d.toLocaleDateString([], { month: 'short', day: 'numeric' }) + ' ' +
        d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    // >2d: date only
    return d.toLocaleDateString([], { month: 'short', day: 'numeric' });
  }

  function seriesLabel(metric: Record<string, string>): string {
    const entries = Object.entries(metric).filter(([k]) => k !== '__name__');
    if (!entries.length) return '{}';
    return entries.map(([k, v]) => `${k}="${v}"`).join(', ');
  }

  function getSeriesValuesExternal(s: any): [number, string][] {
    if (Array.isArray(s.values)) return s.values;
    if (Array.isArray(s.value)) return [s.value];
    for (const key of Object.keys(s)) {
      if (key !== 'metric' && Array.isArray(s[key])) return s[key];
    }
    return [];
  }

  function getTableRows(data: any): Array<{ metric: string; timestamps: [number, string][] }> {
    const results = data?.data?.result ?? [];
    const isHist = data?.data?.resultType === 'histogram';
    return results.map((r: any) => {
      if (isHist) {
        // Flatten histogram entries into timestamp + summary rows
        const entries: [number, string][] = [];
        const histEntries = r.histograms ?? [];
        for (const entry of histEntries) {
          if (Array.isArray(entry) && entry.length === 2) {
            const ts = typeof entry[0] === 'number' ? entry[0] : parseFloat(entry[0]);
            const hist = entry[1];
            const count = hist?.count ?? '?';
            const sum = hist?.sum ?? '?';
            const bucketCount = hist?.buckets?.length ?? 0;
            entries.push([ts, `count=${count}, sum=${sum}, buckets=${bucketCount}`]);
          }
        }
        return { metric: seriesLabel(r.metric), timestamps: entries };
      }
      return {
        metric: seriesLabel(r.metric),
        timestamps: getSeriesValuesExternal(r),
      };
    });
  }

  const EXAMPLE_QUERIES = [
    { label: 'Memory usage by service (MB)', query: 'avg({"container.memory.usage"}/1024/1024) by("@resource.k8s.deployment.name")' },
    { label: 'Request duration p75 by status code', query: 'histogram_quantile(0.75, sum(rate({"http.client.request.duration"}[5m])) by("http.response.status_code"))' },
    { label: 'RED errors by service', query: 'sum({"traces.span.metrics.calls", "status.code"="STATUS_CODE_ERROR"}) by("@resource.service.name")' },
    { label: 'Ad requests by response type', query: 'sum({"app.ads.ad_requests"}) by("app.ads.ad_response_type")' },
    { label: 'Request duration heatmap', query: '{"http.client.request.duration"}' },
  ];

  function useExample(ex: { label: string; query: string }) {
    query = ex.query;
    closeSuggestions();
    inputEl?.focus();
  }
</script>

{#if open}
  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <div class="modal-backdrop" onclick={onBackdrop}>
    <div
      class="modal"
      bind:this={modalEl}
      role="dialog"
      aria-modal="true"
      aria-label="PromQL Explorer"
      style="width:{modalW}px;height:{modalH}px;left:{modalX}px;top:{modalY}px"
    >
      <!-- Resize edge handles -->
      <div class="resize-handle resize-n" onpointerdown={(e) => onResizePointerDown('n', e)} onpointermove={onResizePointerMove} onpointerup={onResizePointerUp}></div>
      <div class="resize-handle resize-s" onpointerdown={(e) => onResizePointerDown('s', e)} onpointermove={onResizePointerMove} onpointerup={onResizePointerUp}></div>
      <div class="resize-handle resize-e" onpointerdown={(e) => onResizePointerDown('e', e)} onpointermove={onResizePointerMove} onpointerup={onResizePointerUp}></div>
      <div class="resize-handle resize-w" onpointerdown={(e) => onResizePointerDown('w', e)} onpointermove={onResizePointerMove} onpointerup={onResizePointerUp}></div>
      <div class="resize-handle resize-ne" onpointerdown={(e) => onResizePointerDown('ne', e)} onpointermove={onResizePointerMove} onpointerup={onResizePointerUp}></div>
      <div class="resize-handle resize-nw" onpointerdown={(e) => onResizePointerDown('nw', e)} onpointermove={onResizePointerMove} onpointerup={onResizePointerUp}></div>
      <div class="resize-handle resize-se" onpointerdown={(e) => onResizePointerDown('se', e)} onpointermove={onResizePointerMove} onpointerup={onResizePointerUp}></div>
      <div class="resize-handle resize-sw" onpointerdown={(e) => onResizePointerDown('sw', e)} onpointermove={onResizePointerMove} onpointerup={onResizePointerUp}></div>

      <div class="modal-header" onpointerdown={onHeaderPointerDown} onpointermove={onResizePointerMove} onpointerup={onResizePointerUp}>
        <h2>PromQL Explorer</h2>
        <button class="close-btn" onclick={close} aria-label="Close">✕</button>
      </div>
      <div class="modal-body">
        <div class="info-box" role="note">
          <span class="info-icon">ℹ</span>
          <span>Have you enabled OTel Enrichment for vended metrics? <a href="https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-OTelEnrichment.html" target="_blank" rel="noopener noreferrer">Learn more →</a></span>
        </div>
        <div class="query-bar">
          <div class="input-wrapper">
            <textarea
              bind:value={query}
              bind:this={inputEl}
              onkeydown={onInputKeydown}
              oninput={onInput}
              onblur={() => setTimeout(closeSuggestions, 150)}
              placeholder='e.g. sum(rate({"traces.span.metrics.calls"}[5m])) by ("@resource.service.name")  ⏎ Enter to run'
              class="query-input"
              disabled={loading}
              autocomplete="off"
              spellcheck="false"
              autofocus
              rows="3"
              role="combobox"
              aria-expanded={showSuggestions}
              aria-autocomplete="list"
              aria-controls="promql-suggestions"
            ></textarea>
            {#if query}
              <button class="clear-btn" onclick={() => { query = ''; inputEl?.focus(); }} aria-label="Clear query">✕</button>
            {/if}
            {#if showSuggestions && suggestions.length > 0}
              <ul class="suggestions" id="promql-suggestions" role="listbox">
                {#each suggestions as s, i}
                  <li
                    class="suggestion-item"
                    class:selected={i === selectedIdx}
                    role="option"
                    aria-selected={i === selectedIdx}
                    onmousedown={(e) => { e.preventDefault(); applySuggestion(s); }}
                    onmouseenter={() => selectedIdx = i}
                  >
                    <span class="suggestion-kind" class:kind-fn={s.kind === 'function'} class:kind-metric={s.kind === 'metric'} class:kind-label={s.kind === 'label'}>
                      {s.kind === 'function' ? 'fn' : s.kind === 'metric' ? 'metric' : 'label'}
                    </span>
                    <span class="suggestion-text">{s.text}</span>
                  </li>
                {/each}
              </ul>
            {/if}
          </div>
          <div class="range-picker" role="radiogroup" aria-label="Time range">
            {#each RANGE_OPTIONS as opt}
              <button
                class="range-btn"
                class:active={rangeMinutes === opt.minutes}
                onclick={() => { rangeMinutes = opt.minutes; if (query.trim()) runQuery(); }}
                aria-pressed={rangeMinutes === opt.minutes}
              >{opt.label}</button>
            {/each}
          </div>
          <button class="run-btn" onclick={runQuery} disabled={loading || !query.trim()}>
            {loading ? '...' : '▶'} Run
          </button>
        </div>

        <div class="examples">
          <span class="examples-label">Examples:</span>
          {#each EXAMPLE_QUERIES as ex}
            <button class="example-btn" onclick={() => useExample(ex)} title={ex.query}>{ex.label}</button>
          {/each}
        </div>

        {#if error}
          <div class="error-box" role="alert">
            <span class="error-icon">!</span>
            <span>{error}</span>
          </div>
        {/if}

        {#if resultData}
          <div class="tabs">
            {#if isHistogramData}
              <button class="tab" class:active={activeTab === 'heatmap'} onclick={() => activeTab = 'heatmap'}>Heatmap</button>
            {:else}
              <button class="tab" class:active={activeTab === 'graph'} onclick={() => activeTab = 'graph'}>Graph</button>
            {/if}
            <button class="tab" class:active={activeTab === 'table'} onclick={() => activeTab = 'table'}>Table</button>
            <span class="result-count">{resultData.data.result.length} series</span>
          </div>

          {#if activeTab === 'heatmap'}
            <div class="chart-container">
              <canvas bind:this={heatmapCanvas} class="chart-canvas"></canvas>
            </div>
            <div class="legend">
              {#each getLegendItems(resultData) as item}
                <button
                  class="legend-item"
                  class:dimmed={highlightedSeries !== null && highlightedSeries !== item.index}
                  class:active={highlightedSeries === item.index}
                  onclick={() => toggleHighlight(item.index)}
                  title="Click to isolate this series"
                >
                  <span class="legend-swatch" style="background:{item.color}"></span>
                  <span class="legend-label">{item.label}</span>
                </button>
              {/each}
            </div>
          {:else if activeTab === 'graph'}
            <div class="chart-container">
              <canvas bind:this={canvas} class="chart-canvas"></canvas>
            </div>
            <div class="legend">
              {#each getLegendItems(resultData) as item}
                <button
                  class="legend-item"
                  class:dimmed={highlightedSeries !== null && highlightedSeries !== item.index}
                  class:active={highlightedSeries === item.index}
                  onclick={() => toggleHighlight(item.index)}
                  title="Click to isolate this series"
                >
                  <span class="legend-swatch" style="background:{item.color}"></span>
                  <span class="legend-label">{item.label}</span>
                </button>
              {/each}
            </div>
          {:else}
            <div class="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Series</th>
                    <th>Timestamp</th>
                    <th>Value</th>
                  </tr>
                </thead>
                <tbody>
                  {#each getTableRows(resultData) as row}
                    {#each row.timestamps as [ts, val], i}
                      <tr>
                        {#if i === 0}
                          <td class="metric-cell" rowspan={row.timestamps.length}>{row.metric}</td>
                        {/if}
                        <td class="ts-cell">{new Date(ts * 1000).toLocaleString()}</td>
                        <td class="val-cell">{isFinite(parseFloat(val)) ? parseFloat(val).toFixed(4) : val}</td>
                      </tr>
                    {/each}
                  {/each}
                </tbody>
              </table>
            </div>
          {/if}
        {/if}
      </div>
    </div>
  </div>
{/if}

<style>
  .modal-backdrop {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.7);
    z-index: 100;
    backdrop-filter: blur(4px);
  }
  .modal {
    position: fixed;
    background: #161b22;
    border: 1px solid #30363d;
    border-radius: 12px;
    display: flex;
    flex-direction: column;
    box-shadow: 0 16px 48px rgba(0, 0, 0, 0.4);
    z-index: 101;
    overflow: hidden;
  }
  .modal-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1.25rem 1.5rem;
    border-bottom: 1px solid #21262d;
    cursor: grab;
    user-select: none;
  }
  .modal-header:active { cursor: grabbing; }
  h2 { font-size: 1.1rem; color: #e1e4e8; margin: 0; }
  .close-btn {
    background: none;
    border: none;
    color: #8b949e;
    font-size: 1.1rem;
    cursor: pointer;
    padding: 0.2rem 0.4rem;
    border-radius: 4px;
  }
  .close-btn:hover { color: #e1e4e8; background: #21262d; }
  .modal-body {
    padding: 1.5rem;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    flex: 1;
    min-height: 0;
  }
  /* Resize handles */
  .resize-handle { position: absolute; z-index: 10; }
  .resize-n { top: -4px; left: 12px; right: 12px; height: 8px; cursor: n-resize; }
  .resize-s { bottom: -4px; left: 12px; right: 12px; height: 8px; cursor: s-resize; }
  .resize-e { right: -4px; top: 12px; bottom: 12px; width: 8px; cursor: e-resize; }
  .resize-w { left: -4px; top: 12px; bottom: 12px; width: 8px; cursor: w-resize; }
  .resize-ne { top: -4px; right: -4px; width: 14px; height: 14px; cursor: ne-resize; }
  .resize-nw { top: -4px; left: -4px; width: 14px; height: 14px; cursor: nw-resize; }
  .resize-se { bottom: -4px; right: -4px; width: 14px; height: 14px; cursor: se-resize; }
  .resize-sw { bottom: -4px; left: -4px; width: 14px; height: 14px; cursor: sw-resize; }
  .info-box {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    background: #1f6feb15;
    border: 1px solid #1f6feb44;
    border-radius: 6px;
    padding: 0.6rem 1rem;
    color: #58a6ff;
    font-size: 0.85rem;
    align-self: flex-end;
    width: fit-content;
  }
  .info-box a {
    color: #79c0ff;
    text-decoration: underline;
  }
  .info-box a:hover { color: #e1e4e8; }
  .info-icon { flex-shrink: 0; }
  .query-bar {
    display: flex;
    gap: 0.5rem;
    align-items: flex-start;
  }
  .input-wrapper {
    flex: 1;
    position: relative;
  }
  .query-input {
    width: 100%;
    background: #0d1117;
    border: 1px solid #30363d;
    border-radius: 6px;
    padding: 0.6rem 1.8rem 0.6rem 0.8rem;
    color: #e1e4e8;
    font-family: 'SF Mono', 'Fira Code', monospace;
    font-size: 0.85rem;
    resize: vertical;
    min-height: 2.4rem;
    max-height: 200px;
    line-height: 1.4;
    overflow-y: auto;
  }
  .query-input::placeholder { color: #484f58; }
  .query-input:focus { outline: none; border-color: #58a6ff; }
  .query-input:disabled { opacity: 0.6; }
  .clear-btn {
    position: absolute;
    right: 6px;
    top: 50%;
    transform: translateY(-50%);
    background: none;
    border: none;
    color: #484f58;
    font-size: 0.8rem;
    cursor: pointer;
    padding: 0.2rem 0.35rem;
    border-radius: 3px;
    line-height: 1;
  }
  .clear-btn:hover { color: #e1e4e8; background: #21262d; }
  .run-btn {
    background: #238636;
    color: white;
    border: none;
    border-radius: 6px;
    padding: 0.6rem 1.2rem;
    font-size: 0.85rem;
    cursor: pointer;
    white-space: nowrap;
  }
  .run-btn:hover:not(:disabled) { background: #2ea043; }
  .run-btn:disabled { opacity: 0.5; cursor: not-allowed; }
  .range-picker {
    display: flex;
    border: 1px solid #30363d;
    border-radius: 6px;
    overflow: hidden;
    flex-shrink: 0;
  }
  .range-btn {
    background: #0d1117;
    border: none;
    border-right: 1px solid #30363d;
    color: #8b949e;
    font-size: 0.72rem;
    padding: 0.4rem 0.5rem;
    cursor: pointer;
    white-space: nowrap;
    transition: background 0.1s, color 0.1s;
  }
  .range-btn:last-child { border-right: none; }
  .range-btn:hover { color: #e1e4e8; background: #21262d; }
  .range-btn.active { color: #58a6ff; background: #1f6feb22; }
  .examples {
    display: flex;
    align-items: center;
    gap: 0.4rem;
    flex-wrap: wrap;
  }
  .examples-label {
    color: #6e7681;
    font-size: 0.75rem;
    flex-shrink: 0;
  }
  .example-btn {
    background: #21262d;
    border: 1px solid #30363d;
    border-radius: 4px;
    color: #8b949e;
    font-size: 0.72rem;
    padding: 0.2rem 0.5rem;
    cursor: pointer;
    white-space: nowrap;
  }
  .example-btn:hover { color: #58a6ff; border-color: #58a6ff; }
  .error-box {
    display: flex;
    align-items: flex-start;
    gap: 0.5rem;
    background: #f8514915;
    border: 1px solid #f8514944;
    border-radius: 6px;
    padding: 0.7rem 1rem;
    color: #f85149;
    font-size: 0.85rem;
    word-break: break-word;
  }
  .error-icon { flex-shrink: 0; }
  .tabs {
    display: flex;
    align-items: center;
    gap: 0;
    border-bottom: 1px solid #21262d;
  }
  .tab {
    background: none;
    border: none;
    border-bottom: 2px solid transparent;
    color: #8b949e;
    padding: 0.6rem 1rem;
    font-size: 0.85rem;
    cursor: pointer;
  }
  .tab:hover { color: #e1e4e8; }
  .tab.active { color: #58a6ff; border-bottom-color: #58a6ff; }
  .result-count {
    margin-left: auto;
    color: #6e7681;
    font-size: 0.75rem;
  }
  .chart-container {
    width: 100%;
    flex: 1 1 0;
    min-height: 200px;
    position: relative;
  }
  .chart-canvas {
    width: 100%;
    height: 100%;
    display: block;
    position: absolute;
    inset: 0;
  }
  .table-container {
    max-height: 400px;
    overflow: auto;
    border: 1px solid #21262d;
    border-radius: 6px;
  }
  table {
    width: 100%;
    border-collapse: collapse;
    font-size: 0.8rem;
  }
  th {
    position: sticky;
    top: 0;
    background: #21262d;
    color: #8b949e;
    text-align: left;
    padding: 0.5rem 0.75rem;
    font-weight: 600;
    font-size: 0.75rem;
    text-transform: uppercase;
    letter-spacing: 0.04em;
  }
  td {
    padding: 0.35rem 0.75rem;
    border-top: 1px solid #161b22;
    color: #c9d1d9;
  }
  .metric-cell {
    font-family: 'SF Mono', 'Fira Code', monospace;
    font-size: 0.75rem;
    color: #58a6ff;
    vertical-align: top;
    max-width: 300px;
    word-break: break-all;
  }
  .ts-cell { font-variant-numeric: tabular-nums; color: #8b949e; }
  .val-cell { font-family: 'SF Mono', monospace; text-align: right; }
  tbody tr:hover td { background: #21262d33; }
  .legend {
    display: flex;
    flex-wrap: wrap;
    gap: 0.4rem 1rem;
    padding: 0.5rem 0;
    max-height: 80px;
    overflow-y: auto;
  }
  .legend-item {
    display: flex;
    align-items: center;
    gap: 0.35rem;
    min-width: 0;
    cursor: pointer;
    background: none;
    border: 1px solid transparent;
    border-radius: 4px;
    padding: 0.15rem 0.4rem;
    transition: opacity 0.15s, border-color 0.15s;
  }
  .legend-item:hover { border-color: #30363d; }
  .legend-item.active { border-color: #58a6ff; }
  .legend-item.dimmed { opacity: 0.3; }
  .legend-swatch {
    width: 10px;
    height: 10px;
    border-radius: 2px;
    flex-shrink: 0;
  }
  .legend-label {
    font-size: 0.7rem;
    color: #8b949e;
    font-family: 'SF Mono', 'Fira Code', monospace;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 360px;
  }
  .suggestions {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    margin: 2px 0 0;
    padding: 4px 0;
    background: #1c2128;
    border: 1px solid #30363d;
    border-radius: 6px;
    list-style: none;
    max-height: 240px;
    overflow-y: auto;
    z-index: 200;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
  }
  .suggestion-item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.35rem 0.75rem;
    cursor: pointer;
    font-size: 0.82rem;
  }
  .suggestion-item.selected {
    background: #30363d;
  }
  .suggestion-kind {
    font-size: 0.65rem;
    font-weight: 600;
    text-transform: uppercase;
    padding: 0.1rem 0.35rem;
    border-radius: 3px;
    flex-shrink: 0;
    letter-spacing: 0.03em;
  }
  .kind-fn { background: #8b5cf633; color: #a78bfa; }
  .kind-metric { background: #1f6feb33; color: #58a6ff; }
  .kind-label { background: #23863633; color: #3fb950; }
  .suggestion-text {
    color: #e1e4e8;
    font-family: 'SF Mono', 'Fira Code', monospace;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
</style>

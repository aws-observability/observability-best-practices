<script lang="ts">
  import { onMount } from 'svelte';
  import * as d3 from 'd3';

  interface Node {
    id: string;
    label: string;
    lang: string;
    x: number;
    y: number;
  }

  interface Edge {
    from: string;
    to: string;
  }

  let { highlightServices = [], onviewlogs, onviewtraces }: {
    highlightServices?: string[];
    onviewlogs?: (service: string) => void;
    onviewtraces?: (service: string) => void;
  } = $props();

  let container: HTMLDivElement;

  const BASE_W = 800;
  const BASE_H = 540;
  const NODE_W = 96;
  const NODE_BASE_H = 28;
  const NODE_LINK_H = 48;
  const NODE_RX = 6;
  const COL_W = NODE_W / 3;  // 3 columns: docs, traces, logs

  const nodes: Node[] = [
    { id: 'frontend',          label: 'Frontend',          x: 400, y: 40,  lang: 'TS' },
    { id: 'frontend-proxy',    label: 'Frontend Proxy',    x: 400, y: 120, lang: 'Envoy' },
    { id: 'ad',                label: 'Ad',                x: 100, y: 200, lang: 'Java' },
    { id: 'cart',              label: 'Cart',              x: 250, y: 200, lang: '.NET' },
    { id: 'checkout',          label: 'Checkout',          x: 400, y: 200, lang: 'Go' },
    { id: 'currency',          label: 'Currency',          x: 550, y: 200, lang: 'C++' },
    { id: 'recommendation',    label: 'Recommend.',        x: 700, y: 200, lang: 'Python' },
    { id: 'product-catalog',   label: 'Product Cat.',      x: 550, y: 310, lang: 'Go' },
    { id: 'product-reviews',   label: 'Reviews',           x: 700, y: 310, lang: 'Python' },
    { id: 'shipping',          label: 'Shipping',          x: 250, y: 310, lang: 'Rust' },
    { id: 'quote',             label: 'Quote',             x: 100, y: 310, lang: 'PHP' },
    { id: 'payment',           label: 'Payment',           x: 400, y: 310, lang: 'JS' },
    { id: 'email',             label: 'Email',             x: 400, y: 400, lang: 'Ruby' },
    { id: 'kafka',             label: 'Kafka',             x: 150, y: 400, lang: 'Java' },
    { id: 'accounting',        label: 'Accounting',        x: 100, y: 490, lang: '.NET' },
    { id: 'fraud-detection',   label: 'Fraud Det.',        x: 250, y: 490, lang: 'Kotlin' },
    { id: 'valkey-cart',       label: 'Valkey',            x: 250, y: 120, lang: 'Cache' },
    { id: 'load-generator',    label: 'Load Gen.',         x: 650, y: 40,  lang: 'Python' },
  ];

  const edges: Edge[] = [
    { from: 'load-generator',  to: 'frontend-proxy' },
    { from: 'frontend-proxy',  to: 'frontend' },
    { from: 'frontend',        to: 'ad' },
    { from: 'frontend',        to: 'cart' },
    { from: 'frontend',        to: 'checkout' },
    { from: 'frontend',        to: 'currency' },
    { from: 'frontend',        to: 'recommendation' },
    { from: 'frontend',        to: 'product-catalog' },
    { from: 'frontend',        to: 'shipping' },
    { from: 'cart',             to: 'valkey-cart' },
    { from: 'checkout',         to: 'cart' },
    { from: 'checkout',         to: 'currency' },
    { from: 'checkout',         to: 'payment' },
    { from: 'checkout',         to: 'shipping' },
    { from: 'checkout',         to: 'email' },
    { from: 'checkout',         to: 'product-catalog' },
    { from: 'checkout',         to: 'kafka' },
    { from: 'recommendation',   to: 'product-catalog' },
    { from: 'shipping',         to: 'quote' },
    { from: 'kafka',            to: 'accounting' },
    { from: 'kafka',            to: 'fraud-detection' },
    { from: 'product-reviews',  to: 'product-catalog' },
  ];

  const nodeMap = new Map(nodes.map(n => [n.id, n]));

  const docsBase = 'https://opentelemetry.io/docs/demo/services/';
  const docsSlug: Record<string, string> = {
    'frontend': 'frontend', 'ad': 'ad', 'cart': 'cart', 'checkout': 'checkout',
    'currency': 'currency', 'recommendation': 'recommendation',
    'product-catalog': 'product-catalog', 'product-reviews': 'product-reviews',
    'shipping': 'shipping', 'quote': 'quote', 'payment': 'payment',
    'email': 'email', 'accounting': 'accounting', 'fraud-detection': 'fraud-detection',
    'load-generator': 'load-generator',
  };

  function docsUrl(id: string): string | null {
    const slug = docsSlug[id];
    return slug ? `${docsBase}${slug}/` : null;
  }

  function isHighlighted(id: string): boolean {
    return highlightServices.length === 0 || highlightServices.includes(id);
  }

  onMount(() => {
    const svg = d3.select(container)
      .append('svg')
      .attr('viewBox', `0 0 ${BASE_W} ${BASE_H}`)
      .attr('class', 'map-svg')
      .style('width', '100%')
      .style('height', 'auto')
      .style('display', 'block')
      .style('user-select', 'none')
      .style('touch-action', 'none');

    const g = svg.append('g');

    // --- Zoom & pan via d3.zoom ---
    const zoomBehavior = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.5, 4])
      .on('zoom', (event) => {
        g.attr('transform', event.transform);
      });

    svg.call(zoomBehavior);
    svg.on('dblclick.zoom', null); // disable double-click zoom

    // --- Arrow markers ---
    const defs = svg.append('defs');

    defs.append('marker')
      .attr('id', 'arrow')
      .attr('viewBox', '0 0 10 6')
      .attr('refX', 10).attr('refY', 3)
      .attr('markerWidth', 8).attr('markerHeight', 6)
      .attr('orient', 'auto-start-reverse')
      .append('path').attr('d', 'M 0 0 L 10 3 L 0 6 z').attr('fill', '#30363d');

    defs.append('marker')
      .attr('id', 'arrow-hl')
      .attr('viewBox', '0 0 10 6')
      .attr('refX', 10).attr('refY', 3)
      .attr('markerWidth', 8).attr('markerHeight', 6)
      .attr('orient', 'auto-start-reverse')
      .append('path').attr('d', 'M 0 0 L 10 3 L 0 6 z').attr('fill', '#f85149');

    // --- Edges ---
    g.selectAll('.edge')
      .data(edges)
      .join('line')
      .attr('class', d => {
        const hl = highlightServices.length > 0 &&
          (highlightServices.includes(d.from) || highlightServices.includes(d.to));
        return hl ? 'edge edge-hl' : 'edge';
      })
      .attr('x1', d => nodeMap.get(d.from)!.x)
      .attr('y1', d => nodeMap.get(d.from)!.y + 20)
      .attr('x2', d => nodeMap.get(d.to)!.x)
      .attr('y2', d => nodeMap.get(d.to)!.y - 16)
      .attr('marker-end', d => {
        const hl = highlightServices.length > 0 &&
          (highlightServices.includes(d.from) || highlightServices.includes(d.to));
        return hl ? 'url(#arrow-hl)' : 'url(#arrow)';
      });

    // --- Nodes ---
    const nodeGroups = g.selectAll<SVGGElement, Node>('.node')
      .data(nodes)
      .join('g')
      .attr('class', d => {
        const hl = isHighlighted(d.id);
        let cls = 'node';
        if (!hl) cls += ' node-dim';
        if (hl && highlightServices.length > 0) cls += ' node-hl';
        return cls;
      });

    // Background rect
    nodeGroups.append('rect')
      .attr('x', d => d.x - NODE_W / 2)
      .attr('y', d => d.y - 14)
      .attr('width', NODE_W)
      .attr('height', d => docsUrl(d.id) ? NODE_LINK_H : NODE_BASE_H)
      .attr('rx', NODE_RX);

    // Label
    nodeGroups.append('text')
      .attr('x', d => d.x)
      .attr('y', d => d.y + 1)
      .attr('class', 'node-label')
      .text(d => d.label);

    // Language sub-label
    nodeGroups.append('text')
      .attr('x', d => d.x)
      .attr('y', d => d.y + 12)
      .attr('class', 'node-lang')
      .text(d => d.lang);

    // --- Link buttons (docs + traces + logs) via foreignObject ---
    const linkNodes = nodeGroups.filter(d => !!docsUrl(d.id));

    // Horizontal divider
    linkNodes.append('line')
      .attr('x1', d => d.x - 44)
      .attr('y1', d => d.y + 16)
      .attr('x2', d => d.x + 44)
      .attr('y2', d => d.y + 16)
      .attr('class', 'src-divider');

    // Vertical dividers (two, splitting into thirds)
    linkNodes.append('line')
      .attr('x1', d => d.x - NODE_W / 2 + COL_W)
      .attr('y1', d => d.y + 16)
      .attr('x2', d => d.x - NODE_W / 2 + COL_W)
      .attr('y2', d => d.y + 34)
      .attr('class', 'src-divider');

    linkNodes.append('line')
      .attr('x1', d => d.x - NODE_W / 2 + COL_W * 2)
      .attr('y1', d => d.y + 16)
      .attr('x2', d => d.x - NODE_W / 2 + COL_W * 2)
      .attr('y2', d => d.y + 34)
      .attr('class', 'src-divider');

    // "docs" link (left third)
    linkNodes.append('foreignObject')
      .attr('x', d => d.x - NODE_W / 2)
      .attr('y', d => d.y + 16)
      .attr('width', COL_W)
      .attr('height', 18)
      .append('xhtml:a')
      .attr('href', d => docsUrl(d.id))
      .attr('target', '_blank')
      .attr('rel', 'noopener')
      .attr('class', 'src-html-link link-left')
      .text('docs');

    // "traces" button (middle third)
    linkNodes.each(function(d) {
      const fo = d3.select(this).append('foreignObject')
        .attr('x', d.x - NODE_W / 2 + COL_W)
        .attr('y', d.y + 16)
        .attr('width', COL_W)
        .attr('height', 18);

      const btn = document.createElement('button');
      btn.className = 'logs-html-btn link-mid';
      btn.textContent = 'traces';
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        onviewtraces?.(d.id);
      });
      fo.node()!.appendChild(btn);
    });

    // "logs" button (right third)
    linkNodes.each(function(d) {
      const fo = d3.select(this).append('foreignObject')
        .attr('x', d.x - NODE_W / 2 + COL_W * 2)
        .attr('y', d.y + 16)
        .attr('width', COL_W)
        .attr('height', 18);

      const btn = document.createElement('button');
      btn.className = 'logs-html-btn link-right';
      btn.textContent = 'logs';
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        onviewlogs?.(d.id);
      });
      fo.node()!.appendChild(btn);
    });

    // --- Zoom control buttons ---
    const panel = container.closest('.service-map-panel')!;
    const resetBtn = panel.querySelector('.reset') as HTMLButtonElement;
    const zoomInBtn = panel.querySelector('.zoom-in') as HTMLButtonElement;
    const zoomOutBtn = panel.querySelector('.zoom-out') as HTMLButtonElement;

    zoomInBtn?.addEventListener('click', () => {
      svg.transition().duration(300).call(zoomBehavior.scaleBy, 1.3);
    });
    zoomOutBtn?.addEventListener('click', () => {
      svg.transition().duration(300).call(zoomBehavior.scaleBy, 0.7);
    });
    resetBtn?.addEventListener('click', () => {
      svg.transition().duration(300).call(zoomBehavior.transform, d3.zoomIdentity);
    });
  });
</script>

<div class="service-map-panel">
  <div class="map-header">
    <h3>OpenTelemetry Demo</h3>
    <div class="zoom-controls">
      <button class="zoom-btn zoom-in" aria-label="Zoom in">+</button>
      <button class="zoom-btn zoom-out" aria-label="Zoom out">−</button>
      <button class="zoom-btn reset" aria-label="Reset zoom">⟲</button>
    </div>
  </div>
  <div class="map-viewport" bind:this={container}></div>
</div>

<style>
  .service-map-panel {
    background: #161b22;
    border-radius: 12px;
    border: 1px solid #30363d;
    padding: 1.5rem;
  }
  .map-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 0.75rem;
  }
  h3 {
    font-size: 1rem;
    color: #e1e4e8;
    margin: 0;
  }
  .zoom-controls {
    display: flex;
    gap: 0.25rem;
  }
  .zoom-btn {
    width: 26px;
    height: 26px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #21262d;
    border: 1px solid #30363d;
    border-radius: 4px;
    color: #8b949e;
    font-size: 0.85rem;
    cursor: pointer;
    transition: all 0.15s;
    padding: 0;
    line-height: 1;
  }
  .zoom-btn:hover {
    border-color: #58a6ff;
    color: #e1e4e8;
  }
  .zoom-btn.reset {
    font-size: 0.9rem;
  }
  .map-viewport {
    overflow: hidden;
    border-radius: 8px;
  }
  .map-viewport :global(.map-svg) {
    cursor: grab;
  }
  .map-viewport :global(.map-svg:active) {
    cursor: grabbing;
  }
  .map-viewport :global(.edge) {
    stroke: #30363d;
    stroke-width: 1.2;
  }
  .map-viewport :global(.edge-hl) {
    stroke: #f85149;
    stroke-width: 2;
    opacity: 0.8;
  }
  .map-viewport :global(.node rect) {
    fill: #21262d;
    stroke: #30363d;
    stroke-width: 1;
  }
  .map-viewport :global(.node-hl rect) {
    fill: #f8514922;
    stroke: #f85149;
    stroke-width: 1.5;
  }
  .map-viewport :global(.node-dim) {
    opacity: 0.35;
  }
  .map-viewport :global(.node-label) {
    fill: #e1e4e8;
    font-size: 9px;
    text-anchor: middle;
    dominant-baseline: middle;
  }
  .map-viewport :global(.node-lang) {
    fill: #6e7681;
    font-size: 7px;
    text-anchor: middle;
  }
  .map-viewport :global(.src-divider) {
    stroke: #30363d;
    stroke-width: 0.5;
  }
  .map-viewport :global(.src-html-link) {
    display: block;
    width: 100%;
    height: 100%;
    text-align: center;
    font-size: 9px;
    line-height: 18px;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    color: #58a6ff;
    text-decoration: none;
    background: #58a6ff10;
    cursor: pointer;
  }
  .map-viewport :global(.src-html-link.link-left) {
    border-radius: 0 0 0 6px;
  }
  .map-viewport :global(.src-html-link.link-mid) {
    border-radius: 0;
  }
  .map-viewport :global(.src-html-link:hover) {
    background: #58a6ff30;
    color: #79c0ff;
  }
  .map-viewport :global(.logs-html-btn) {
    display: block;
    width: 100%;
    height: 100%;
    text-align: center;
    font-size: 9px;
    line-height: 18px;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    color: #58a6ff;
    background: #58a6ff10;
    border: none;
    cursor: pointer;
    padding: 0;
    margin: 0;
  }
  .map-viewport :global(.logs-html-btn.link-mid) {
    border-radius: 0;
  }
  .map-viewport :global(.logs-html-btn.link-right) {
    border-radius: 0 0 6px 0;
  }
  .map-viewport :global(.logs-html-btn:hover) {
    background: #58a6ff30;
    color: #79c0ff;
  }
</style>

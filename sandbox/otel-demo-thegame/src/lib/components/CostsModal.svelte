<script lang="ts">
  let { open = $bindable(false) }: { open: boolean } = $props();

  interface CostService { service: string; cost: number }
  interface CostSubCategory { name: string; total: number; services: CostService[] }
  interface CostCategory { name: string; total: number; services: CostService[]; subCategories?: CostSubCategory[] }
  interface CostBreakdown {
    startDate: string; endDate: string; currency: string;
    categories: CostCategory[]; grandTotal: number;
    splitCostAllocation?: boolean;
    llmTokens?: { input: number; output: number; total: number };
  }

  let data = $state<CostBreakdown | null>(null);
  let loading = $state(false);
  let error = $state('');
  let days = $state(1);
  let activeTab = $state(0);

  const CATEGORY_ICONS: Record<string, string> = {
    'Infrastructure': '',
    'Observability': '',
    'LLM': '',
  };

  const CATEGORY_COLORS: Record<string, string> = {
    'Infrastructure': '#58a6ff',
    'Observability': '#d29922',
    'LLM': '#a371f7',
  };

  const SUB_ICONS: Record<string, string> = {
    'Compute':          '',
    'EKS Control Plane':'',
    'EKS Auto Mode':    '',
    'Storage':          '',
    'Networking':       '',
    'Logs Ingest':      '',
    'Logs Query':       '',
    'Metrics Ingest':   '',
    'Metrics Query':    '',
    'Traces Ingest':    '',
    'Traces Query':     '',
    'By Namespace':     '',
    'By Deployment':    '',
    'Other':            '',
  };

  function fmt(n: number): string {
    return n.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 });
  }

  function pct(part: number, total: number): string {
    if (total === 0) return '0';
    return (part / total * 100).toFixed(1);
  }

  async function fetchCosts() {
    loading = true;
    error = '';
    try {
      const resp = await fetch(`/api/costs?days=${days}`);
      const json = await resp.json();
      if (json.error) { error = json.error; data = null; }
      else { data = json; activeTab = 0; }
    } catch (e: any) {
      error = e.message;
    } finally {
      loading = false;
    }
  }

  function onBackdrop(e: MouseEvent) {
    if ((e.target as HTMLElement).classList.contains('modal-backdrop')) open = false;
  }

  $effect(() => {
    if (open && !data && !loading) fetchCosts();
  });

  $effect(() => {
    const _ = days;
    if (open) fetchCosts();
  });
</script>

{#if open}
  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <div class="modal-backdrop" onclick={onBackdrop}>
    <div class="modal" role="dialog" aria-modal="true" aria-label="Cost breakdown">
      <div class="modal-header">
        <h2>Cost Breakdown</h2>
        <div class="header-controls">
          <select bind:value={days} aria-label="Time period">
            <option value={1}>Last 1 day</option>
            <option value={3}>Last 3 days</option>
            <option value={7}>Last 7 days</option>
            <option value={14}>Last 14 days</option>
            <option value={30}>Last 30 days</option>
            <option value={90}>Last 90 days</option>
          </select>
          <button class="close-btn" onclick={() => open = false} aria-label="Close">✕</button>
        </div>
      </div>

      <div class="modal-body">
        {#if loading}
          <div class="loading">Loading cost data...</div>
        {:else if error}
          <div class="error-msg">{error}</div>
        {:else if data}
          <div class="summary">
            <div class="period">
              {data.startDate} → {data.endDate}
              {#if data.splitCostAllocation}
                <span class="tag-badge" title="Costs scoped to project via CUR split cost allocation tags">Tag-filtered</span>
              {/if}
            </div>
            <div class="grand-total">{fmt(data.grandTotal)}</div>
          </div>

          <div class="bar-chart">
            {#each data.categories as cat}
              <div
                class="bar-segment"
                style="flex: {cat.total}; background: {CATEGORY_COLORS[cat.name] ?? '#8b949e'}"
                title="{cat.name}: {fmt(cat.total)}"
              ></div>
            {/each}
          </div>

          <div class="tabs" role="tablist">
            {#each data.categories as cat, i}
              <button
                class="tab"
                class:active={activeTab === i}
                style="--tab-color: {CATEGORY_COLORS[cat.name] ?? '#8b949e'}"
                role="tab"
                aria-selected={activeTab === i}
                onclick={() => activeTab = i}
              >
                <span class="tab-icon">{CATEGORY_ICONS[cat.name] ?? ''}</span>
                <span class="tab-label">{cat.name}</span>
                <span class="tab-cost">{fmt(cat.total)}</span>
              </button>
            {/each}
          </div>

          <div class="tab-panels">
          {#each data.categories as cat, i}
              <div class="tab-panel" class:active={activeTab === i} role="tabpanel" aria-hidden={activeTab !== i}>
                <div class="tab-panel-header">
                  <span class="cat-pct" style="color: {CATEGORY_COLORS[cat.name]}">{pct(cat.total, data.grandTotal)}% of total</span>
                </div>

                {#if cat.name === 'LLM' && data.llmTokens}
                  <div class="token-summary">
                    <span class="token-label">Total tokens</span>
                    <span class="token-value">{data.llmTokens.total.toLocaleString()}</span>
                    <span class="token-detail">({data.llmTokens.input.toLocaleString()} in / {data.llmTokens.output.toLocaleString()} out)</span>
                  </div>
                {/if}

                {#if cat.services.length > 0}
                  <div class="svc-list">
                    {#each cat.services as svc}
                      <div class="svc-row">
                        <span class="svc-name">{svc.service}</span>
                        <span class="svc-cost">{fmt(svc.cost)}</span>
                      </div>
                    {/each}
                  </div>
                {/if}

                {#if cat.subCategories && cat.subCategories.length > 0}
                  <div class="sub-categories">
                    {#each cat.subCategories as sub}
                      <div class="sub-category">
                        <div class="sub-header">
                          <span class="sub-icon">{SUB_ICONS[sub.name] ?? ''}</span>
                          <span class="sub-name">{sub.name}</span>
                          <span class="sub-total">{fmt(sub.total)}</span>
                        </div>
                        {#if sub.services.length > 0}
                          <div class="svc-list nested">
                            {#each sub.services as svc}
                              <div class="svc-row">
                                <span class="svc-name">{svc.service}</span>
                                <span class="svc-cost">{fmt(svc.cost)}</span>
                              </div>
                            {/each}
                          </div>
                        {:else}
                          <div class="svc-list empty">No charges</div>
                        {/if}
                      </div>
                    {/each}
                  </div>
                {/if}

                {#if cat.services.length === 0 && (!cat.subCategories || cat.subCategories.length === 0)}
                  <div class="svc-list empty">No charges</div>
                {/if}
              </div>
          {/each}
          </div>
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
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 100;
    backdrop-filter: blur(4px);
  }
  .modal {
    background: #161b22;
    border: 1px solid #30363d;
    border-radius: 12px;
    width: 90%;
    max-width: 700px;
    max-height: 85vh;
    display: flex;
    flex-direction: column;
    box-shadow: 0 16px 48px rgba(0, 0, 0, 0.4);
  }
  .modal-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1.25rem 1.5rem;
    border-bottom: 1px solid #21262d;
  }
  h2 { font-size: 1.1rem; color: #e1e4e8; margin: 0; }
  .header-controls {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }
  select {
    background: #21262d;
    border: 1px solid #30363d;
    color: #c9d1d9;
    padding: 0.3rem 0.5rem;
    border-radius: 6px;
    font-size: 0.75rem;
    cursor: pointer;
  }
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
  }
  .loading, .error-msg {
    text-align: center;
    padding: 2rem;
    color: #8b949e;
  }
  .error-msg { color: #f85149; }
  .summary {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    margin-bottom: 1rem;
  }
  .period { color: #8b949e; font-size: 0.8rem; display: flex; align-items: center; gap: 0.5rem; }
  .tag-badge {
    font-size: 0.65rem;
    background: #1f3a1f;
    color: #3fb950;
    padding: 0.15rem 0.4rem;
    border-radius: 4px;
    border: 1px solid #238636;
  }
  .grand-total { font-size: 1.6rem; font-weight: 700; color: #e1e4e8; }
  .bar-chart {
    display: flex;
    height: 8px;
    border-radius: 4px;
    overflow: hidden;
    margin-bottom: 1.25rem;
    gap: 2px;
  }
  .bar-segment {
    border-radius: 2px;
    min-width: 4px;
    transition: flex 0.3s;
  }

  /* ── Tabs ──────────────────────────────────────────────────────── */
  .tabs {
    display: flex;
    gap: 0.25rem;
    margin-bottom: 1rem;
    border-bottom: 1px solid #21262d;
  }
  .tab {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.4rem;
    padding: 0.6rem 0.5rem;
    background: none;
    border: none;
    border-bottom: 2px solid transparent;
    color: #8b949e;
    font-size: 0.8rem;
    cursor: pointer;
    transition: color 0.15s, border-color 0.15s;
  }
  .tab:hover { color: #c9d1d9; }
  .tab.active {
    color: #e1e4e8;
    border-bottom-color: var(--tab-color);
  }
  .tab-icon { font-size: 0.9rem; }
  .tab-label { font-weight: 600; }
  .tab-cost { font-family: monospace; font-size: 0.75rem; color: #6e7681; }
  .tab.active .tab-cost { color: var(--tab-color); }

  /* ── Tab panel ─────────────────────────────────────────────────── */
  .tab-panels {
    display: grid;
  }
  .tab-panel {
    grid-area: 1 / 1;
    background: #0d1117;
    border-radius: 8px;
    padding: 1rem;
    visibility: hidden;
  }
  .tab-panel.active {
    visibility: visible;
  }
  .tab-panel-header {
    margin-bottom: 0.75rem;
  }
  .cat-pct { font-size: 0.8rem; font-weight: 600; }

  .svc-list {
    display: flex;
    flex-direction: column;
    gap: 0.3rem;
  }
  .svc-list.empty { color: #6e7681; font-size: 0.8rem; padding: 0.25rem 0; }
  .svc-list.nested { margin-left: 1.25rem; }
  .svc-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.2rem 0;
    border-bottom: 1px solid #161b22;
  }
  .svc-row:last-child { border-bottom: none; }
  .svc-name { font-size: 0.75rem; color: #8b949e; }
  .svc-cost { font-size: 0.75rem; color: #c9d1d9; font-family: monospace; }
  .sub-categories {
    display: flex;
    flex-direction: column;
    gap: 0.6rem;
  }
  .sub-category {
    background: #161b22;
    border-radius: 6px;
    padding: 0.6rem 0.75rem;
  }
  .sub-header {
    display: flex;
    align-items: center;
    gap: 0.4rem;
    margin-bottom: 0.4rem;
  }
  .sub-icon { font-size: 0.85rem; }
  .sub-name { font-size: 0.8rem; font-weight: 500; color: #c9d1d9; flex: 1; }
  .sub-total { font-size: 0.8rem; font-weight: 600; color: #d29922; font-family: monospace; }
  .token-summary {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 0.75rem;
    padding: 0.4rem 0.6rem;
    background: #1c1230;
    border: 1px solid #30274a;
    border-radius: 6px;
    font-size: 0.8rem;
  }
  .token-label { color: #8b949e; }
  .token-value { color: #a371f7; font-weight: 600; font-family: monospace; }
  .token-detail { color: #6e7681; font-size: 0.7rem; }
</style>

<script lang="ts">
  import { gameStats } from '$lib/game-store.svelte';
  import CostsModal from '$lib/components/CostsModal.svelte';
  import AboutModal from '$lib/components/AboutModal.svelte';
  import PromQLModal from '$lib/components/PromQLModal.svelte';
  import FullscreenModal from '$lib/components/FullscreenModal.svelte';
  import RedDashboard from '$lib/components/RedDashboard.svelte';
  import ServiceMap from '$lib/components/ServiceMap.svelte';
  import TimeRangePicker from '$lib/components/TimeRangePicker.svelte';
  import LogsModal from '$lib/components/LogsModal.svelte';
  import TracesModal from '$lib/components/TracesModal.svelte';
  import KubectlModal from '$lib/components/KubectlModal.svelte';
  let { children } = $props();

  let costsOpen = $state(false);
  let metricsOpen = $state(false);
  let mapOpen = $state(false);
  let helpOpen = $state(false);
  let aboutOpen = $state(false);
  let promqlOpen = $state(false);
  let logsOpen = $state(false);
  let logsService = $state('');
  let tracesOpen = $state(false);
  let kubectlOpen = $state(false);
  let tracesService = $state('');

  function isInputFocused(): boolean {
    const el = document.activeElement;
    if (!el) return false;
    const tag = el.tagName;
    return tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || (el as HTMLElement).isContentEditable;
  }

  function closeAll() { costsOpen = false; metricsOpen = false; mapOpen = false; helpOpen = false; aboutOpen = false; promqlOpen = false; kubectlOpen = false; }

  const timeSteps = [60, 360, 1440, 4320, 10080];

  function onKeydown(e: KeyboardEvent) {
    if (e.key === 'Escape') {
      // Close the topmost modal only: logs/traces sit on top of everything else
      if (tracesOpen) { tracesOpen = false; return; }
      if (logsOpen) { logsOpen = false; return; }
      if (kubectlOpen) { kubectlOpen = false; return; }
      closeAll();
      return;
    }
    if (isInputFocused()) return;
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
      const cur = timeSteps.indexOf(gameStats.queryMinutes);
      const idx = cur >= 0 ? cur : 0;
      const next = e.key === 'ArrowRight' ? Math.min(idx + 1, timeSteps.length - 1) : Math.max(idx - 1, 0);
      gameStats.queryMinutes = timeSteps[next];
      return;
    }
    if (e.key === 'c') { closeAll(); costsOpen = true; }
    else if (e.key === 'r') { closeAll(); metricsOpen = true; }
    else if (e.key === 'm') { closeAll(); mapOpen = true; }
    else if (e.key === 'h' || e.key === '?') { closeAll(); helpOpen = true; }
    else if (e.key === 'a') { closeAll(); aboutOpen = true; }
    else if (e.key === 'p') { e.preventDefault(); closeAll(); promqlOpen = true; }
    else if (e.key === 'k') { closeAll(); kubectlOpen = true; }
  }
</script>

<svelte:window onkeydown={onKeydown} />

<svelte:head>
  <title>OpenTelemetry Demo: The Game</title>
  <meta name="description" content="Gamified OpenTelemetry observability training" />
</svelte:head>

<div class="app">
  <header>
    <nav>
      <div class="brand">
        <h1>OpenTelemetry Demo: The Game</h1>
        <span class="subtitle">Learn observability by breaking things</span>
      </div>
      <div class="stats">
        <div class="stat">
          <span class="stat-label">Round</span>
          <span class="stat-value">{gameStats.round}</span>
        </div>
        <div class="stat">
          <span class="stat-label">Score</span>
          <span class="stat-value score">{gameStats.score}</span>
        </div>
        <div class="stat">
          <span class="stat-label">Phase</span>
          <span class="stat-value phase phase-{gameStats.phase}">{gameStats.phase}</span>
        </div>
        {#if gameStats.history.length > 0}
          <div class="history-dots">
            {#each gameStats.history.slice(-5) as round}
              <span
                class="dot"
                class:correct={round.correct}
                class:wrong={!round.correct}
                title="{round.scenario.name}: {round.correct ? 'Correct' : 'Partial'}"
              ></span>
            {/each}
          </div>
        {/if}
        <button class="nav-btn costs" onclick={() => costsOpen = true} aria-label="View costs" title="Costs (C)">Costs …</button>
        {#if gameStats.phase !== 'idle'}
          <button class="nav-btn exit" onclick={() => gameStats.exitRequested = true} aria-label="Exit game" title="Exit game">Exit</button>
        {/if}
        <button class="nav-btn costs" onclick={() => aboutOpen = true} aria-label="About" title="About (A)">About</button>
        <button class="nav-btn costs" onclick={() => helpOpen = true} aria-label="Help" title="Help (H)">?</button>
      </div>
    </nav>
  </header>
  <main>
    {@render children()}
  </main>
  <CostsModal bind:open={costsOpen} />

  <FullscreenModal bind:open={metricsOpen} title="Request-Error-Duration (RED) Metrics" wide>
    <TimeRangePicker bind:minutes={gameStats.queryMinutes} />
    <RedDashboard metrics={gameStats.metrics} loading={gameStats.metricsLoading} />
  </FullscreenModal>

  <FullscreenModal bind:open={mapOpen} title="Service Map" wide>
    <ServiceMap
      highlightServices={gameStats.highlightServices}
      onviewlogs={(svc) => { logsService = svc; logsOpen = true; }}
      onviewtraces={(svc) => { tracesService = svc; tracesOpen = true; }}
    />
  </FullscreenModal>

  <FullscreenModal bind:open={helpOpen} title="Keyboard Shortcuts" narrow>
    <dl class="help-list">
      <div class="help-row"><dt><kbd>A</kbd></dt><dd><span class="hl">A</span>bout</dd></div>
      <div class="help-row"><dt><kbd>C</kbd></dt><dd><span class="hl">C</span>ost Breakdown</dd></div>
      <div class="help-row"><dt><kbd>H</kbd> / <kbd>?</kbd></dt><dd>Show this <span class="hl">h</span>elp</dd></div>
      <div class="help-row"><dt><kbd>K</kbd></dt><dd><span class="hl">K</span>ubectl command runner</dd></div>
      <div class="help-row"><dt><kbd>M</kbd></dt><dd>Service <span class="hl">m</span>ap</dd></div>
      <div class="help-row"><dt><kbd>P</kbd></dt><dd><span class="hl">P</span>romQL Explorer</dd></div>
      <div class="help-row"><dt><kbd>R</kbd></dt><dd><span class="hl">R</span>equest-Error-Duration (RED) metrics</dd></div>
      <div class="help-row"><dt><kbd>S</kbd></dt><dd><span class="hl">S</span>ervices overview</dd></div>
      <div class="help-row"><dt><kbd>T</kbd></dt><dd><span class="hl">T</span>elemetry pipeline</dd></div>
      <div class="help-row"><dt><kbd>←</kbd> / <kbd>→</kbd></dt><dd>Decrease / increase metrics time range</dd></div>
      <div class="help-row"><dt><kbd>Esc</kbd></dt><dd>Close dialog</dd></div>
    </dl>
  </FullscreenModal>
  <AboutModal bind:open={aboutOpen} />
  <PromQLModal bind:open={promqlOpen} />
  <TracesModal bind:open={tracesOpen} service={tracesService} onviewlogs={(svc) => { logsService = svc; logsOpen = true; }} />
  <LogsModal bind:open={logsOpen} service={logsService} />
  <KubectlModal bind:open={kubectlOpen} />
  <footer class="status-bar">
    <span>Press <kbd>h</kbd> to show keyboard navigation</span>
    {#if gameStats.llmTokensIn > 0 || gameStats.llmTokensOut > 0}
      <span class="sep">·</span>
      <span class="token-stats" title="Cumulative LLM token usage this session">{gameStats.llmTokensIn.toLocaleString()} in / {gameStats.llmTokensOut.toLocaleString()} out tokens</span>
    {/if}
  </footer>
</div>

<style>
  :global(*) {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  :global(body) {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    background: #0f1117;
    color: #e1e4e8;
    min-height: 100vh;
  }
  :global(h1), :global(h2), :global(h3) {
    font-variant: small-caps;
    text-transform: capitalize;
    letter-spacing: 0.12em;
    font-weight: 300;
  }
  .app {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
  }
  header {
    background: #161b22;
    border-bottom: 1px solid #30363d;
    padding: 0.75rem 2rem;
    position: sticky;
    top: 0;
    z-index: 50;
  }
  nav {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    max-width: 1400px;
    margin: 0 auto;
  }
  .brand {
    display: flex;
    align-items: baseline;
    gap: 0.75rem;
  }
  h1 {
    font-size: 1.3rem;
    color: #58a6ff;
    white-space: nowrap;
  }
  .subtitle {
    color: #8b949e;
    font-size: 0.85rem;
    white-space: nowrap;
  }
  .stats {
    display: flex;
    align-items: center;
    gap: 1.5rem;
  }
  .stat {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.1rem;
  }
  .stat-label {
    font-size: 0.6rem;
    text-transform: uppercase;
    color: #6e7681;
    letter-spacing: 0.06em;
  }
  .stat-value {
    font-size: 1rem;
    font-weight: 700;
    color: #e1e4e8;
  }
  .stat-value.score { color: #3fb950; }
  .stat-value.phase {
    text-transform: capitalize;
    font-size: 0.8rem;
    padding: 0.15rem 0.5rem;
    border-radius: 4px;
  }
  .phase-idle { color: #8b949e; }
  .phase-triggering { color: #d29922; background: #d2992220; }
  .phase-observing { color: #58a6ff; background: #1f6feb33; }
  .phase-hypothesis { color: #d29922; background: #d2992233; }
  .phase-reveal { color: #a78bfa; background: #8b5cf633; }
  .phase-remediate { color: #3fb950; background: #23863633; }
  .phase-complete { color: #3fb950; background: #23863633; }
  .history-dots {
    display: flex;
    gap: 0.3rem;
    align-items: center;
  }
  .nav-btn {
    background: #21262d;
    border: 1px solid #30363d;
    border-radius: 6px;
    padding: 0.3rem 0.5rem;
    font-size: 0.9rem;
    cursor: pointer;
    transition: all 0.15s;
    line-height: 1;
  }
  .nav-btn:hover { border-color: #58a6ff; background: #30363d; }
  .nav-btn.costs { background: #c9d1d9; color: #0d1117; border-color: #c9d1d9; }
  .nav-btn.costs:hover { background: #e1e4e8; border-color: #e1e4e8; }
  .nav-btn.exit { background: #f8514933; color: #f85149; border-color: #f8514966; }
  .nav-btn.exit:hover { background: #f8514955; border-color: #f85149; }
  .dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
  }
  .correct { background: #3fb950; }
  .wrong { background: #d29922; }
  main {
    flex: 1;
    max-width: 1400px;
    margin: 0 auto;
    padding: 2rem;
    width: 100%;
  }
  @media (max-width: 800px) {
    .subtitle { display: none; }
    .stats { gap: 1rem; }
  }
  .status-bar {
    position: sticky;
    bottom: 0;
    background: #21262d;
    border-top: 1px solid #30363d;
    padding: 0.9rem 2rem;
    text-align: center;
    color: #c9d1d9;
    font-size: 1rem;
    z-index: 50;
  }
  .status-bar kbd {
    background: #30363d;
    border: 1px solid #484f58;
    border-radius: 3px;
    padding: 0.1rem 0.4rem;
    font-family: inherit;
    font-size: 0.8rem;
    color: #e1e4e8;
  }
  .status-bar .sep {
    color: #484f58;
    margin: 0 0.25rem;
  }
  .status-bar a {
    color: #58a6ff;
    text-decoration: none;
  }
  .status-bar a:hover {
    text-decoration: underline;
  }
  .token-stats {
    color: #8b949e;
    font-variant-numeric: tabular-nums;
  }
  .help-list {
    display: flex;
    flex-direction: column;
    gap: 0;
    margin: 0;
  }
  .help-row {
    display: flex;
    align-items: center;
    padding: 0.75rem 0;
    border-bottom: 1px solid #21262d;
  }
  .help-row:last-child { border-bottom: none; }
  .help-row dt {
    min-width: 6rem;
    flex-shrink: 0;
  }
  .help-row dd {
    flex: 1;
    color: rgba(201, 209, 217, 0.8);
    font-size: 0.9rem;
    margin: 0;
  }
  .hl {
    font-weight: 700;
    color: #f0f6fc;
  }
  .help-row kbd {
    display: inline-block;
    background: #30363d;
    border: 1px solid #484f58;
    border-radius: 4px;
    padding: 0.2rem 0.55rem;
    font-family: inherit;
    font-size: 0.8rem;
    color: #e1e4e8;
    min-width: 1.6rem;
    text-align: center;
  }
</style>

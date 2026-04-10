<script lang="ts">
  import type { GameState, REDMetrics } from '$lib/types';
  import { MAX_ROUNDS } from '$lib/types';
  import RedDashboard from '$lib/components/RedDashboard.svelte';
  import HypothesisForm from '$lib/components/HypothesisForm.svelte';
  import RevealPanel from '$lib/components/RevealPanel.svelte';
  import RemediatePanel from '$lib/components/RemediatePanel.svelte';
  import ServiceGrid from '$lib/components/ServiceGrid.svelte';
  import ServiceMap from '$lib/components/ServiceMap.svelte';
  import TimeRangePicker from '$lib/components/TimeRangePicker.svelte';
  import LogsModal from '$lib/components/LogsModal.svelte';
  import TracesModal from '$lib/components/TracesModal.svelte';
  import { gameStats } from '$lib/game-store.svelte';

  let gameState = $state<GameState>({
    phase: 'idle',
    activeScenario: null,
    triggeredAt: null,
    hypothesis: '',
    score: 0,
    round: 0,
    history: [],
  });

  // Sync page-level game state into the shared store for the header
  $effect(() => {
    gameStats.round = gameState.round;
    gameStats.score = gameState.score;
    gameStats.phase = gameState.phase;
    gameStats.history = gameState.history;
    gameStats.metrics = metrics;
    gameStats.highlightServices = gameState.activeScenario?.targetServices ?? [];
  });

  let metrics = $state<REDMetrics[]>([]);
  let hint = $state('');
  let expectedSymptoms = $state<string[]>([]);
  let loading = $state(false);
  let error = $state('');
  let llmScore = $state<number | null>(null);
  let llmExplanation = $state<string | null>(null);
  let metricsInterval: ReturnType<typeof setInterval> | null = null;

  let logsOpen = $state(false);
  let logsService = $state('');
  let tracesOpen = $state(false);
  let tracesService = $state('');

  function onPageKeydown(e: KeyboardEvent) {
    if (e.key === 'Escape' && tracesOpen) {
      tracesOpen = false;
      e.preventDefault();
      return;
    }
    if (e.key === 'Escape' && logsOpen) {
      logsOpen = false;
      e.preventDefault();
    }
  }
  async function fetchState() {
    const resp = await fetch('/api/game/state');
    gameState = await resp.json();
  }

  async function fetchMetrics() {
    gameStats.metricsLoading = true;
    try {
      const resp = await fetch(`/api/metrics?minutes=${gameStats.queryMinutes}`);
      const data = await resp.json();
      metrics = data.metrics || [];
    } catch {
      // Metrics may not be available yet
    } finally {
      gameStats.metricsLoading = false;
    }
  }

  async function triggerChaos() {
    loading = true;
    error = '';
    try {
      const resp = await fetch('/api/game/trigger', { method: 'POST' });
      const data = await resp.json();
      if (!data.success) {
        error = data.message;
      }
      await fetchState();
      startMetricsPolling();
    } catch (e: any) {
      error = e.message;
    } finally {
      loading = false;
    }
  }

  async function requestHint() {
    const resp = await fetch('/api/game/hint');
    const data = await resp.json();
    hint = data.hint || '';
    expectedSymptoms = data.expectedSymptoms || [];
    await fetchState();
  }

  async function submitHypothesis(text: string) {
    const resp = await fetch('/api/game/hypothesis', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ hypothesis: text }),
    });
    const data = await resp.json();
    llmScore = data.llmScore ?? null;
    llmExplanation = data.llmExplanation ?? null;
    if (data.tokenUsage) {
      gameStats.llmTokensIn = data.tokenUsage.inputTokens;
      gameStats.llmTokensOut = data.tokenUsage.outputTokens;
    }
    await fetchState();
  }

  async function remediate(action: string) {
    loading = true;
    try {
      await fetch('/api/game/remediate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action }),
      });
      await fetchState();
      stopMetricsPolling();
    } finally {
      loading = false;
    }
  }

  async function resetGame() {
    await fetch('/api/game/reset', { method: 'POST' });
    hint = '';
    expectedSymptoms = [];
    metrics = [];
    error = '';
    llmScore = null;
    llmExplanation = null;
    gameStats.llmTokensIn = 0;
    gameStats.llmTokensOut = 0;
    stopMetricsPolling();
    await fetchState();
  }

  function startMetricsPolling() {
    if (metricsInterval) return;
    fetchMetrics();
    metricsInterval = setInterval(fetchMetrics, 10000);
  }

  function stopMetricsPolling() {
    if (metricsInterval) {
      clearInterval(metricsInterval);
      metricsInterval = null;
    }
  }

  $effect(() => {
    fetchState();
    startMetricsPolling();
    return () => stopMetricsPolling();
  });

  // Re-fetch immediately when the user changes the time range
  $effect(() => {
    const _ = gameStats.queryMinutes;
    if (metricsInterval) fetchMetrics();
  });

  // Handle exit request from the header button
  $effect(() => {
    if (gameStats.exitRequested) {
      gameStats.exitRequested = false;
      exitGame();
    }
  });

  async function exitGame() {
    loading = true;
    try {
      // Auto-remediate if there's an active scenario
      if (gameState.activeScenario) {
        await fetch('/api/game/remediate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'auto-remediate' }),
        });
      }
      // Reset the game
      await fetch('/api/game/reset', { method: 'POST' });
      hint = '';
      expectedSymptoms = [];
      metrics = [];
      error = '';
      llmScore = null;
      llmExplanation = null;
      gameStats.llmTokensIn = 0;
      gameStats.llmTokensOut = 0;
      stopMetricsPolling();
      await fetchState();
    } finally {
      loading = false;
    }
  }
</script>

<svelte:window onkeydown={onPageKeydown} />

<div class="game-container">
  {#if gameState.phase !== 'idle'}
    <div class="phase-indicator">
      <span class="phase-badge phase-{gameState.phase}">{gameState.phase.toUpperCase()}</span>
      <span class="phase-desc">
        {#if gameState.phase === 'observing'}Something broke. Observe the metrics and form a hypothesis.
        {:else if gameState.phase === 'hypothesis'}Use the hint and metrics to guess what went wrong.
        {:else if gameState.phase === 'reveal'}Compare your hypothesis with the actual cause.
        {:else if gameState.phase === 'remediate'}Follow the steps to fix the issue.
        {:else if gameState.phase === 'complete'}Round complete.
        {/if}
      </span>
    </div>
  {/if}

  <ServiceGrid />

  {#if gameState.phase === 'idle' || gameState.phase === 'complete'}
    <div class="start-section">
      {#if gameState.phase === 'complete'}
        <div class="round-complete">
          {#if gameState.round >= MAX_ROUNDS}
            <h2>Game Over</h2>
            <p>Final score: {gameState.score} across {MAX_ROUNDS} rounds</p>
          {:else}
            <h2>Round Complete</h2>
            <p>Score this round: {gameState.history[gameState.history.length - 1]?.score ?? 0}</p>
          {/if}
        </div>
      {/if}
      {#if gameState.round >= MAX_ROUNDS}
        <button class="btn-primary" onclick={resetGame}>Play Again</button>
      {:else}
        <button class="btn-primary" onclick={triggerChaos} disabled={loading}>
          {#if loading}
            Injecting chaos...
          {:else}
            {gameState.phase === 'complete' ? 'Next Round' : 'Play!'}
          {/if}
        </button>
      {/if}
      {#if gameState.round > 0}
        <button class="btn-secondary" onclick={resetGame}>Reset Game</button>
      {/if}
      {#if error}
        <p class="error">{error}</p>
      {/if}
    </div>
  {/if}

  {#if gameState.phase === 'observing' || gameState.phase === 'hypothesis' || gameState.phase === 'reveal' || gameState.phase === 'remediate'}
    <TimeRangePicker bind:minutes={gameStats.queryMinutes} />

    <div class="observability-row">
      <div class="obs-main">
        <RedDashboard {metrics} loading={gameStats.metricsLoading} />
      </div>
      <div class="obs-side">
        <ServiceMap
          highlightServices={gameState.activeScenario?.targetServices ?? []}
          onviewlogs={(svc) => { logsService = svc; logsOpen = true; }}
          onviewtraces={(svc) => { tracesService = svc; tracesOpen = true; }}
        />
        {#if hint}
          <div class="hint-section">
            <h3>Hint</h3>
            <p class="hint-text">{hint}</p>
            {#if expectedSymptoms.length > 0}
              <div class="symptoms">
                <h4>Expected Symptoms:</h4>
                <ul>
                  {#each expectedSymptoms as symptom}
                    <li>{symptom}</li>
                  {/each}
                </ul>
              </div>
            {/if}
          </div>
        {/if}
      </div>
    </div>

    {#if gameState.phase === 'observing'}
      <div class="action-bar">
        <button class="btn-primary" onclick={requestHint}>
          Get Hint & Form Hypothesis
        </button>
      </div>
    {/if}

    {#if gameState.phase === 'hypothesis'}
      <HypothesisForm onsubmit={submitHypothesis} />
    {/if}

    {#if gameState.phase === 'reveal' && gameState.activeScenario}
      <RevealPanel
        scenario={gameState.activeScenario}
        hypothesis={gameState.hypothesis}
        {llmScore}
        {llmExplanation}
        onremediate={() => {
          gameState.phase = 'remediate';
        }}
      />
    {/if}

    {#if gameState.phase === 'remediate' && gameState.activeScenario}
      <RemediatePanel
        scenario={gameState.activeScenario}
        {loading}
        onAutoRemediate={() => remediate('auto-remediate')}
        onManualComplete={() => remediate('manual-complete')}
      />
    {/if}
  {/if}

  <TracesModal bind:open={tracesOpen} service={tracesService} onviewlogs={(svc) => { logsService = svc; logsOpen = true; }} />
  <LogsModal bind:open={logsOpen} service={logsService} />
</div>

<style>
  .game-container {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }
  .start-section {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    padding: 3rem;
    background: #161b22;
    border-radius: 12px;
    border: 1px solid #30363d;
  }
  .round-complete {
    text-align: center;
    margin-bottom: 1rem;
  }
  .round-complete h2 {
    color: #3fb950;
    margin-bottom: 0.5rem;
  }
  .btn-primary {
    background: #238636;
    color: white;
    border: none;
    padding: 0.8rem 2rem;
    border-radius: 8px;
    font-size: 1.1rem;
    cursor: pointer;
    transition: background 0.2s;
  }
  .btn-primary:hover:not(:disabled) {
    background: #2ea043;
  }
  .btn-primary:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
  .btn-secondary {
    background: transparent;
    color: #8b949e;
    border: 1px solid #30363d;
    padding: 0.6rem 1.5rem;
    border-radius: 8px;
    cursor: pointer;
  }
  .btn-secondary:hover {
    border-color: #58a6ff;
    color: #58a6ff;
  }
  .error {
    color: #f85149;
    font-size: 0.9rem;
  }
  .phase-indicator {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1rem 1.5rem;
    background: #161b22;
    border-radius: 8px;
    border: 1px solid #30363d;
  }
  .phase-badge {
    padding: 0.3rem 0.8rem;
    border-radius: 4px;
    font-size: 0.75rem;
    font-weight: 700;
    letter-spacing: 0.05em;
  }
  .phase-observing { background: #1f6feb33; color: #58a6ff; }
  .phase-hypothesis { background: #d2992233; color: #d29922; }
  .phase-reveal { background: #8b5cf633; color: #a78bfa; }
  .phase-remediate { background: #23863633; color: #3fb950; }
  .phase-desc {
    color: #8b949e;
    font-size: 0.9rem;
  }
  .action-bar {
    display: flex;
    justify-content: center;
    padding: 1rem;
  }
  .observability-row {
    display: grid;
    grid-template-columns: 3fr 2fr;
    gap: 1.5rem;
    align-items: start;
  }
  .obs-main {
    min-width: 0;
    overflow: hidden;
  }
  .obs-side {
    min-width: 0;
    position: sticky;
    top: 1rem;
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }
  .hint-section {
    background: #161b22;
    border-radius: 12px;
    border: 1px solid #30363d;
    padding: 1.5rem;
  }
  .hint-section h3 {
    font-size: 1rem;
    margin-bottom: 0.8rem;
  }
  .hint-text {
    color: #d29922;
    font-size: 1rem;
    line-height: 1.5;
    padding: 1rem;
    background: #d2992210;
    border-radius: 8px;
    border-left: 3px solid #d29922;
  }
  .symptoms {
    margin-top: 1rem;
  }
  .symptoms h4 {
    font-size: 0.85rem;
    color: #8b949e;
    margin-bottom: 0.5rem;
  }
  .symptoms ul {
    list-style: none;
    padding: 0;
  }
  .symptoms li {
    padding: 0.3rem 0;
    color: #8b949e;
    font-size: 0.85rem;
  }
  .symptoms li::before {
    content: '⚠️ ';
  }
  @media (max-width: 1100px) {
    .observability-row {
      grid-template-columns: 1fr;
    }
  }
</style>

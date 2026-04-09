<script lang="ts">
  import type { GamePhase, GameRound } from '$lib/types';

  let { score, round, phase, history }: {
    score: number;
    round: number;
    phase: GamePhase;
    history: GameRound[];
  } = $props();
</script>

<div class="scoreboard">
  <div class="stat">
    <span class="label">Round</span>
    <span class="value">{round}</span>
  </div>
  <div class="stat">
    <span class="label">Score</span>
    <span class="value score">{score}</span>
  </div>
  <div class="stat">
    <span class="label">Phase</span>
    <span class="value phase">{phase}</span>
  </div>
  {#if history.length > 0}
    <div class="history-mini">
      {#each history.slice(-5) as round}
        <span class="dot" class:correct={round.correct} class:wrong={!round.correct}
          title="{round.scenario.name}: {round.correct ? 'Correct' : 'Partial'}">
        </span>
      {/each}
    </div>
  {/if}
</div>

<style>
  .scoreboard {
    display: flex;
    align-items: center;
    gap: 2rem;
    padding: 1rem 1.5rem;
    background: #161b22;
    border-radius: 8px;
    border: 1px solid #30363d;
  }
  .stat {
    display: flex;
    flex-direction: column;
    gap: 0.2rem;
  }
  .label {
    font-size: 0.7rem;
    text-transform: uppercase;
    color: #8b949e;
    letter-spacing: 0.05em;
  }
  .value {
    font-size: 1.2rem;
    font-weight: 600;
  }
  .score { color: #3fb950; }
  .phase { color: #58a6ff; text-transform: capitalize; }
  .history-mini {
    display: flex;
    gap: 0.4rem;
    margin-left: auto;
  }
  .dot {
    width: 12px;
    height: 12px;
    border-radius: 50%;
  }
  .correct { background: #3fb950; }
  .wrong { background: #d29922; }
</style>

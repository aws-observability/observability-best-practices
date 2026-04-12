<script lang="ts">
  import type { GameRound } from '$lib/types';

  let { history, totalScore, onplayagain }: {
    history: GameRound[];
    totalScore: number;
    onplayagain: () => void;
  } = $props();

  function duration(round: GameRound): string {
    const ms = new Date(round.timestamp).getTime() - new Date(round.roundStartedAt).getTime();
    const s = Math.floor(ms / 1000);
    const m = Math.floor(s / 60);
    return m > 0 ? `${m}m ${s % 60}s` : `${s}s`;
  }
</script>

<div class="report-overlay" role="dialog" aria-modal="true">
  <div class="report-modal">
    <h2>📊 Game Report</h2>
    <p class="total">Final Score: {totalScore} / {history.length * 100}</p>

    <div class="rounds">
      {#each history as round, i}
        <div class="round-card">
          <div class="round-header">
            <span class="round-num">Round {i + 1}</span>
            <span class="round-score" class:score-low={round.score < 30} class:score-mid={round.score >= 30 && round.score < 70} class:score-high={round.score >= 70}>{round.score}/100</span>
            <span class="round-time">⏱ {duration(round)}</span>
          </div>
          <div class="round-body">
            <div class="comparison">
              <div class="col">
                <span class="label">Your Hypothesis</span>
                <p>{round.hypothesis || '(none)'}</p>
              </div>
              <div class="col actual">
                <span class="label">Actual Root Cause</span>
                <p>{round.scenario.description}</p>
              </div>
            </div>
            <div class="meta">
              <span class="badge cat">{round.scenario.category}</span>
              <span class="badge diff-{round.scenario.difficulty}">{round.scenario.difficulty}</span>
              {#each round.scenario.targetServices as svc}
                <span class="badge svc">{svc}</span>
              {/each}
            </div>
          </div>
        </div>
      {/each}
    </div>

    <button class="btn-primary" onclick={onplayagain}>Play Again</button>
  </div>
</div>

<style>
  .report-overlay {
    position: fixed;
    inset: 0;
    z-index: 1000;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(0, 0, 0, 0.8);
    backdrop-filter: blur(4px);
    animation: fadeIn 0.25s ease-out;
  }
  .report-modal {
    background: #161b22;
    border: 1px solid #30363d;
    border-radius: 16px;
    padding: 2rem;
    max-width: 720px;
    width: 90vw;
    max-height: 85vh;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    animation: popIn 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
    box-shadow: 0 24px 48px rgba(0, 0, 0, 0.4);
  }
  h2 { color: #e1e4e8; text-align: center; margin: 0; }
  .total { text-align: center; font-size: 1.2rem; color: #3fb950; margin: 0; }
  .rounds { display: flex; flex-direction: column; gap: 0.75rem; }
  .round-card {
    background: #0d1117;
    border: 1px solid #30363d;
    border-radius: 10px;
    overflow: hidden;
  }
  .round-header {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 0.6rem 1rem;
    background: #21262d;
  }
  .round-num { font-weight: 700; color: #e1e4e8; }
  .round-score { font-weight: 700; }
  .score-low { color: #f85149; }
  .score-mid { color: #d29922; }
  .score-high { color: #3fb950; }
  .round-time { margin-left: auto; color: #8b949e; font-size: 0.85rem; }
  .round-body { padding: 0.8rem 1rem; }
  .comparison {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0.75rem;
    margin-bottom: 0.6rem;
  }
  .col p { color: #c9d1d9; font-size: 0.85rem; line-height: 1.5; margin: 0.3rem 0 0; }
  .col.actual { border-left: 2px solid #f85149; padding-left: 0.75rem; }
  .label { font-size: 0.7rem; font-weight: 600; color: #8b949e; text-transform: uppercase; letter-spacing: 0.04em; }
  .meta { display: flex; flex-wrap: wrap; gap: 0.35rem; }
  .badge {
    padding: 0.15rem 0.5rem;
    border-radius: 4px;
    font-size: 0.7rem;
    font-weight: 600;
  }
  .cat { background: #f8514920; color: #f85149; }
  .svc { background: #1f6feb20; color: #58a6ff; }
  .diff-easy { background: #3fb95020; color: #3fb950; }
  .diff-medium { background: #d2992220; color: #d29922; }
  .diff-hard { background: #f8514920; color: #f85149; }
  .diff-expert { background: #bc8cff20; color: #bc8cff; }
  .btn-primary {
    align-self: center;
    background: #238636;
    color: white;
    border: none;
    padding: 0.8rem 2rem;
    border-radius: 8px;
    font-size: 1.1rem;
    cursor: pointer;
    transition: background 0.2s;
  }
  .btn-primary:hover { background: #2ea043; }
  @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
  @keyframes popIn { from { opacity: 0; transform: scale(0.85) translateY(12px); } to { opacity: 1; transform: scale(1) translateY(0); } }
  @media (max-width: 600px) {
    .comparison { grid-template-columns: 1fr; }
  }
</style>

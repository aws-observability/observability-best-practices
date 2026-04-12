<script lang="ts">
  import type { GameRound } from '$lib/types';
  import { jsPDF } from 'jspdf';

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

  function totalTime(): string {
    if (!history.length) return '0:00';
    const ms = history.reduce((sum, r) => sum + new Date(r.timestamp).getTime() - new Date(r.roundStartedAt).getTime(), 0);
    const s = Math.floor(ms / 1000);
    const m = Math.floor(s / 60);
    return `${m}:${String(s % 60).padStart(2, '0')}`;
  }

  const GAME_URL = 'https://github.com/aws-observability/observability-best-practices/tree/main/sandbox/otel-demo-thegame';

  function downloadPdf() {
    const doc = new jsPDF();
    const pw = doc.internal.pageSize.getWidth();
    const ph = doc.internal.pageSize.getHeight();
    const margin = 15;
    const contentW = pw - margin * 2;
    const today = new Date().toISOString().slice(0, 10);
    let y = 15;

    // Title + date
    doc.setFontSize(16);
    doc.text('"OpenTelemetry Demo: The Game" Result', pw / 2, y, { align: 'center' });
    y += 6;
    doc.setFontSize(8);
    doc.setTextColor(120);
    doc.text(today, pw / 2, y, { align: 'center' });
    y += 8;

    // Summary
    const pct = Math.round(totalScore / (history.length * 100) * 100);
    doc.setFontSize(10);
    doc.setTextColor(0);
    doc.text(`Final Score: ${pct}% (${totalScore} out of ${history.length * 100} points)   |   Total Time: ${totalTime()} min`, pw / 2, y, { align: 'center' });
    y += 8;

    // Rounds
    const halfW = (contentW - 4) / 2;
    for (let i = 0; i < history.length; i++) {
      const r = history[i];

      // Header bar
      doc.setFillColor(235, 235, 235);
      doc.rect(margin, y - 4, contentW, 6, 'F');
      doc.setFontSize(9);
      doc.setTextColor(0);
      doc.text(`Round ${i + 1}`, margin + 2, y);
      doc.text(`${r.score}/100`, pw / 2, y, { align: 'center' });
      doc.text(duration(r), margin + contentW - 2, y, { align: 'right' });
      y += 7;

      // Two-column: hypothesis | root cause
      doc.setFontSize(6);
      doc.setTextColor(120);
      doc.text('YOUR HYPOTHESIS', margin, y);
      doc.text('ACTUAL ROOT CAUSE', margin + halfW + 4, y);
      y += 3;

      doc.setFontSize(8);
      doc.setTextColor(0);
      const hypLines = doc.splitTextToSize(r.hypothesis || '(none)', halfW);
      const descLines = doc.splitTextToSize(r.scenario.description, halfW);
      const maxLines = Math.max(hypLines.length, descLines.length);
      doc.text(hypLines, margin, y);
      doc.text(descLines, margin + halfW + 4, y);
      y += maxLines * 3.5 + 2;

      // Meta line
      doc.setFontSize(6);
      doc.setTextColor(100);
      doc.text([r.scenario.category, r.scenario.difficulty, ...r.scenario.targetServices].join(' · '), margin, y);
      y += 6;
    }

    // Footer URL
    doc.setFontSize(7);
    doc.setTextColor(100);
    doc.textWithLink(GAME_URL, pw / 2, ph - 8, { align: 'center', url: GAME_URL });

    doc.save(`${today}_ODTG_result.pdf`);
  }
</script>

<div class="report-overlay" role="dialog" aria-modal="true">
  <div class="report-modal">
    <h2>Game Report</h2>
    <div class="summary">
      <p class="total">Final Score: <span class="value">{Math.round(totalScore / (history.length * 100) * 100)}% ({totalScore} out of {history.length * 100} points)</span></p>
      <p class="total">Total Time: <span class="value">{totalTime()} min</span></p>
    </div>

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

    <div class="actions">
      <button class="btn-secondary" onclick={downloadPdf}>Download PDF</button>
      <button class="btn-primary" onclick={onplayagain}>Play Again</button>
    </div>
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
    position: relative;
    background: #161b22;
    overflow: hidden;
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
  .report-modal::before {
    content: '';
    position: absolute;
    inset: 0;
    background: url('/about-bg.png') center / cover no-repeat;
    opacity: 0.15;
    z-index: 0;
    pointer-events: none;
  }
  .report-modal > :global(*) { position: relative; z-index: 1; }
  h2 { color: #8b949e; text-align: center; margin: 0; text-shadow: 0 1px 4px rgba(0, 0, 0, 0.7); }
  .total { text-align: center; font-size: 1.2rem; color: #6e7681; margin: 0; text-shadow: 0 1px 4px rgba(0, 0, 0, 0.7); }
  .total .value { color: #e1e4e8; font-weight: 700; }
  .summary { background: rgba(13, 17, 23, 0.85); border-radius: 8px; padding: 0.75rem 1rem; }
  .rounds { display: flex; flex-direction: column; gap: 0.75rem; }
  .round-card {
    background: rgba(13, 17, 23, 0.95);
    border: 1px solid #30363d;
    border-radius: 10px;
    overflow: hidden;
  }
  .round-header {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 0.6rem 1rem;
    background: rgba(33, 38, 45, 0.95);
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
  .actions { display: flex; justify-content: center; gap: 1rem; }
  .btn-secondary {
    background: transparent;
    color: #8b949e;
    border: 1px solid #30363d;
    padding: 0.8rem 2rem;
    border-radius: 8px;
    font-size: 1.1rem;
    cursor: pointer;
  }
  .btn-secondary:hover { border-color: #58a6ff; color: #58a6ff; }
  @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
  @keyframes popIn { from { opacity: 0; transform: scale(0.85) translateY(12px); } to { opacity: 1; transform: scale(1) translateY(0); } }
  @media (max-width: 600px) {
    .comparison { grid-template-columns: 1fr; }
  }
</style>

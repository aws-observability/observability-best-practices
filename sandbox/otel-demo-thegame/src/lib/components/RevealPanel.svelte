<script lang="ts">
  import type { ChaosScenario } from '$lib/types';

  let { scenario, hypothesis, llmScore, llmExplanation, onremediate }: {
    scenario: ChaosScenario;
    hypothesis: string;
    llmScore: number | null;
    llmExplanation: string | null;
    onremediate: () => void;
  } = $props();
</script>

<div class="reveal-panel">
  <div class="column hypothesis-col">
    <h3>Your Hypothesis</h3>
    <div class="content-box">
      <p>{hypothesis}</p>
    </div>
  </div>

  <div class="vs">VS</div>

  <div class="column actual-col">
    <h3>Actual Cause</h3>
    <div class="content-box actual">
      <h4>{scenario.name}</h4>
      <span class="category-badge">{scenario.category}</span>
      <p>{scenario.description}</p>
      {#if llmExplanation}
        <div class="llm-explanation">
          <span class="llm-tag">AI Analysis</span>
          <p>{llmExplanation}</p>
        </div>
      {:else}
        <p class="hint-detail">{scenario.hint}</p>
        {#if scenario.expectedSymptoms.length > 0}
          <div class="symptoms">
            <span class="label">Observable symptoms:</span>
            <ul>
              {#each scenario.expectedSymptoms as symptom}
                <li>{symptom}</li>
              {/each}
            </ul>
          </div>
        {/if}
      {/if}
      <div class="targets">
        <span class="label">Affected services:</span>
        {#each scenario.targetServices as svc}
          <span class="service-tag">{svc}</span>
        {/each}
      </div>
    </div>
  </div>
</div>

{#if llmScore !== null}
  <div class="score-bar">
    <span class="score-label">LLM Judge Score</span>
    <div class="score-track">
      <div
        class="score-fill"
        class:score-low={llmScore < 30}
        class:score-mid={llmScore >= 30 && llmScore < 70}
        class:score-high={llmScore >= 70}
        style="width: {llmScore}%"
      ></div>
    </div>
    <span class="score-value">{llmScore}/100</span>
  </div>
{/if}

<div class="action-bar">
  <button class="btn-remediate" onclick={onremediate}>
    Proceed to Remediation
  </button>
</div>

<style>
  .reveal-panel {
    display: grid;
    grid-template-columns: 1fr auto 1fr;
    gap: 1rem;
    align-items: stretch;
  }
  .column {
    background: #161b22;
    border-radius: 12px;
    border: 1px solid #30363d;
    padding: 1.5rem;
  }
  .vs {
    display: flex;
    align-items: center;
    font-size: 1.5rem;
    font-weight: 700;
    color: #8b949e;
  }
  h3 {
    font-size: 1rem;
    margin-bottom: 1rem;
  }
  .content-box {
    padding: 1rem;
    background: #0d1117;
    border-radius: 8px;
    line-height: 1.6;
  }
  .content-box.actual {
    border-left: 3px solid #f85149;
  }
  h4 {
    color: #f85149;
    margin-bottom: 0.5rem;
  }
  .category-badge {
    display: inline-block;
    padding: 0.2rem 0.6rem;
    background: #f8514920;
    color: #f85149;
    border-radius: 4px;
    font-size: 0.75rem;
    font-weight: 600;
    margin-bottom: 0.5rem;
  }
  .hint-detail {
    color: #d29922;
    font-size: 0.85rem;
    line-height: 1.5;
    padding: 0.6rem 0.8rem;
    background: #d2992210;
    border-radius: 6px;
    border-left: 2px solid #d29922;
    margin-top: 0.5rem;
  }
  .llm-explanation {
    margin-top: 0.6rem;
    padding: 0.8rem;
    background: #1f6feb10;
    border-radius: 6px;
    border-left: 2px solid #58a6ff;
  }
  .llm-explanation p {
    color: #c9d1d9;
    font-size: 0.85rem;
    line-height: 1.6;
    margin: 0;
  }
  .llm-tag {
    display: inline-block;
    font-size: 0.65rem;
    font-weight: 600;
    color: #58a6ff;
    background: #1f6feb20;
    padding: 0.1rem 0.4rem;
    border-radius: 3px;
    margin-bottom: 0.4rem;
  }
  .symptoms {
    margin-top: 0.8rem;
  }
  .symptoms ul {
    list-style: none;
    padding: 0;
    margin: 0.3rem 0 0;
  }
  .symptoms li {
    padding: 0.2rem 0;
    color: #8b949e;
    font-size: 0.8rem;
  }
  .symptoms li::before {
    content: '• ';
  }
  .targets {
    margin-top: 0.8rem;
    display: flex;
    flex-wrap: wrap;
    gap: 0.4rem;
    align-items: center;
  }
  .label {
    font-size: 0.8rem;
    color: #8b949e;
  }
  .service-tag {
    padding: 0.15rem 0.5rem;
    background: #1f6feb20;
    color: #58a6ff;
    border-radius: 4px;
    font-size: 0.75rem;
  }
  .action-bar {
    display: flex;
    justify-content: center;
    padding: 1rem;
  }
  .btn-remediate {
    background: #238636;
    color: white;
    border: none;
    padding: 0.8rem 2rem;
    border-radius: 8px;
    font-size: 1rem;
    cursor: pointer;
  }
  .btn-remediate:hover {
    background: #2ea043;
  }
  .score-bar {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1rem 1.5rem;
    background: #161b22;
    border-radius: 8px;
    border: 1px solid #30363d;
  }
  .score-label {
    font-size: 0.9rem;
    color: #e1e4e8;
    white-space: nowrap;
  }
  .score-track {
    flex: 1;
    height: 12px;
    background: #21262d;
    border-radius: 6px;
    overflow: hidden;
  }
  .score-fill {
    height: 100%;
    border-radius: 6px;
    transition: width 0.6s ease;
  }
  .score-low { background: #f85149; }
  .score-mid { background: #d29922; }
  .score-high { background: #3fb950; }
  .score-value {
    font-size: 1.1rem;
    font-weight: 700;
    color: #e1e4e8;
    min-width: 4rem;
    text-align: right;
  }
  @media (max-width: 768px) {
    .reveal-panel {
      grid-template-columns: 1fr;
    }
    .vs {
      justify-content: center;
    }
  }
</style>

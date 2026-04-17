<script lang="ts">
  import type { ChaosScenario, RemediationStep } from '$lib/types';

  let { scenario, loading, onAutoRemediate, onManualComplete }: {
    scenario: ChaosScenario;
    loading: boolean;
    onAutoRemediate: () => void;
    onManualComplete: () => void;
  } = $props();

  let completedSteps = $state<Set<number>>(new Set());

  function toggleStep(idx: number) {
    const next = new Set(completedSteps);
    if (next.has(idx)) next.delete(idx);
    else next.add(idx);
    completedSteps = next;
  }

  function stepText(step: RemediationStep): string {
    return typeof step === 'string' ? step : step.instruction;
  }

  function stepCondition(step: RemediationStep): string | undefined {
    return typeof step === 'string' ? undefined : step.condition;
  }

  function stepAlternatives(step: RemediationStep): string[] | undefined {
    return typeof step === 'string' ? undefined : step.alternatives;
  }
</script>

<div class="remediate-panel">
  <h3>Remediation Steps</h3>
  <p class="desc">Follow these steps to fix <strong>{scenario.name}</strong>. You can run them manually in your terminal or let the game auto-remediate.</p>

  <div class="steps">
    {#each scenario.remediationSteps as step, i}
      <div class="step" class:completed={completedSteps.has(i)}>
        <button class="step-check" onclick={() => toggleStep(i)} aria-label="Mark step {i + 1} as complete">
          {#if completedSteps.has(i)}✅{:else}⬜{/if}
        </button>
        <div class="step-content">
          <span class="step-num">Step {i + 1}</span>
          {#if stepCondition(step)}
            <span class="step-condition">⚡ {stepCondition(step)}</span>
          {/if}
          <code>{stepText(step)}</code>
          {#if stepAlternatives(step)}
            <div class="step-alternatives">
              <span class="alt-label">Alternatives:</span>
              {#each stepAlternatives(step)! as alt}
                <code class="alt">{alt}</code>
              {/each}
            </div>
          {/if}
        </div>
      </div>
    {/each}
  </div>

  <div class="actions">
    <button class="btn-auto" onclick={onAutoRemediate} disabled={loading}>
      {#if loading}Remediating...{:else}Auto-Remediate{/if}
    </button>
    <button class="btn-manual" onclick={onManualComplete} disabled={loading}>
      ✅ I Fixed It Manually
    </button>
  </div>
</div>

<style>
  .remediate-panel {
    background: #161b22;
    border-radius: 12px;
    border: 1px solid #30363d;
    padding: 1.5rem;
  }
  h3 {
    margin-bottom: 0.5rem;
  }
  .desc {
    color: #8b949e;
    font-size: 0.85rem;
    margin-bottom: 1.5rem;
  }
  .steps {
    display: flex;
    flex-direction: column;
    gap: 0.8rem;
    margin-bottom: 1.5rem;
  }
  .step {
    display: flex;
    gap: 0.8rem;
    align-items: flex-start;
    padding: 0.8rem;
    background: #0d1117;
    border-radius: 8px;
    border: 1px solid #21262d;
    transition: opacity 0.2s;
  }
  .step.completed {
    opacity: 0.5;
  }
  .step-check {
    background: none;
    border: none;
    cursor: pointer;
    font-size: 1.2rem;
    padding: 0;
    line-height: 1;
  }
  .step-content {
    flex: 1;
  }
  .step-num {
    display: block;
    font-size: 0.7rem;
    color: #8b949e;
    text-transform: uppercase;
    margin-bottom: 0.3rem;
  }
  code {
    display: block;
    font-family: 'SF Mono', 'Fira Code', monospace;
    font-size: 0.85rem;
    color: #79c0ff;
    word-break: break-all;
  }
  .step-condition {
    display: block;
    font-size: 0.75rem;
    color: #d29922;
    margin-bottom: 0.3rem;
    font-style: italic;
  }
  .step-alternatives {
    margin-top: 0.4rem;
    padding-top: 0.4rem;
    border-top: 1px solid #21262d;
  }
  .alt-label {
    display: block;
    font-size: 0.7rem;
    color: #8b949e;
    margin-bottom: 0.2rem;
  }
  code.alt {
    font-size: 0.8rem;
    color: #7ee787;
    margin-bottom: 0.2rem;
  }
  .actions {
    display: flex;
    gap: 1rem;
    justify-content: center;
  }
  .btn-auto {
    background: #238636;
    color: white;
    border: none;
    padding: 0.7rem 1.5rem;
    border-radius: 8px;
    cursor: pointer;
    font-size: 0.9rem;
  }
  .btn-auto:hover:not(:disabled) { background: #2ea043; }
  .btn-auto:disabled { opacity: 0.6; cursor: not-allowed; }
  .btn-manual {
    background: #1f6feb;
    color: white;
    border: none;
    padding: 0.7rem 1.5rem;
    border-radius: 8px;
    cursor: pointer;
    font-size: 0.9rem;
  }
  .btn-manual:hover:not(:disabled) { background: #388bfd; }
  .btn-manual:disabled { opacity: 0.6; cursor: not-allowed; }
</style>

<script lang="ts">
  import { OTEL_SERVICES, type ChaosCategory } from '$lib/types';

  let { onsubmit }: { onsubmit: (text: string) => void } = $props();

  type Mode = 'structured' | 'freetext';
  let mode = $state<Mode>('structured');

  // Free-text state
  let freetext = $state('');

  // Structured state
  let selectedServices = $state<Set<string>>(new Set());
  let faultType = $state<ChaosCategory | ''>('');
  let rootCause = $state('');

  const FAULT_LABELS: Record<ChaosCategory, string> = {
    'pod-kill': 'Pod kill / crash',
    'load-spike': 'Load spike',
    'resource-pressure': 'Resource pressure (CPU/memory)',
    'network-fault': 'Network fault',
    'config-fault': 'Configuration error',
    'feature-flag': 'Feature flag',
    'multi-fault': 'Multiple faults',
    'cascading': 'Cascading failure',
    'data-layer': 'Data layer issue',
    'observability-gap': 'Observability gap',
    'race-condition': 'Race condition / timing',
    'capacity': 'Capacity / scaling',
  };

  function toggleService(name: string) {
    const next = new Set(selectedServices);
    if (next.has(name)) next.delete(name); else next.add(name);
    selectedServices = next;
  }

  function buildStructuredText(): string {
    const parts: string[] = [];
    if (selectedServices.size > 0)
      parts.push(`Affected services: ${[...selectedServices].join(', ')}`);
    if (faultType)
      parts.push(`Fault type: ${FAULT_LABELS[faultType]}`);
    if (rootCause.trim())
      parts.push(`Root cause: ${rootCause.trim()}`);
    return parts.join('. ') + (parts.length ? '.' : '');
  }

  let canSubmit = $derived(
    mode === 'freetext'
      ? freetext.trim().length > 0
      : selectedServices.size > 0 || faultType !== '' || rootCause.trim().length > 0
  );

  function submit() {
    const text = mode === 'freetext' ? freetext.trim() : buildStructuredText();
    if (text) onsubmit(text);
  }
</script>

<div class="hypothesis-panel">
  <div class="form-section">
    <div class="header-row">
      <h3>Your Hypothesis</h3>
      <div class="mode-toggle" role="radiogroup" aria-label="Input mode">
        <button class="toggle-btn" class:active={mode === 'structured'} onclick={() => mode = 'structured'}>Guided</button>
        <button class="toggle-btn" class:active={mode === 'freetext'} onclick={() => mode = 'freetext'}>Free-text</button>
      </div>
    </div>

    {#if mode === 'structured'}
      <p class="instruction">Pick the affected services, fault type, and describe the root cause.</p>

      <fieldset class="field">
        <legend>Which service(s)?</legend>
        <div class="service-chips">
          {#each OTEL_SERVICES as svc}
            <button
              class="chip"
              class:selected={selectedServices.has(svc.name)}
              onclick={() => toggleService(svc.name)}
              aria-pressed={selectedServices.has(svc.name)}
            >{svc.name}</button>
          {/each}
        </div>
      </fieldset>

      <fieldset class="field">
        <legend>What type of fault?</legend>
        <select bind:value={faultType}>
          <option value="">— not sure —</option>
          {#each Object.entries(FAULT_LABELS) as [value, label]}
            <option {value}>{label}</option>
          {/each}
        </select>
      </fieldset>

      <fieldset class="field">
        <legend>Root cause</legend>
        <textarea
          bind:value={rootCause}
          placeholder="e.g., Memory limit too low causing OOMKill restarts..."
          rows="2"
        ></textarea>
      </fieldset>
    {:else}
      <p class="instruction">Based on the metrics and hint, what do you think went wrong?</p>
      <textarea
        bind:value={freetext}
        placeholder="e.g., The checkout service pod was killed, causing order failures..."
        rows="4"
      ></textarea>
    {/if}

    <button class="btn-submit" onclick={submit} disabled={!canSubmit}>
      Submit Hypothesis
    </button>
  </div>
</div>

<style>
  .form-section {
    background: #161b22;
    border-radius: 12px;
    border: 1px solid #30363d;
    padding: 1.5rem;
  }
  .header-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 0.8rem;
  }
  h3 { font-size: 1rem; margin: 0; }
  .instruction { color: #8b949e; font-size: 0.85rem; margin-bottom: 0.8rem; }

  /* Mode toggle */
  .mode-toggle { display: flex; gap: 0; border: 1px solid #30363d; border-radius: 6px; overflow: hidden; }
  .toggle-btn {
    background: transparent; color: #8b949e; border: none;
    padding: 0.3rem 0.7rem; font-size: 0.75rem; cursor: pointer;
    transition: all 0.15s;
  }
  .toggle-btn.active { background: #1f6feb; color: white; }
  .toggle-btn:not(.active):hover { background: #21262d; }

  /* Structured fields */
  fieldset.field {
    border: none; padding: 0; margin: 0 0 1rem;
  }
  legend {
    font-size: 0.8rem; color: #8b949e; font-weight: 600;
    text-transform: uppercase; letter-spacing: 0.04em;
    margin-bottom: 0.4rem;
  }
  .service-chips { display: flex; flex-wrap: wrap; gap: 0.35rem; }
  .chip {
    padding: 0.25rem 0.6rem; border-radius: 4px; font-size: 0.8rem;
    border: 1px solid #30363d; background: #0d1117; color: #8b949e;
    cursor: pointer; transition: all 0.15s;
  }
  .chip:hover { border-color: #58a6ff; color: #c9d1d9; }
  .chip.selected { background: #1f6feb20; border-color: #58a6ff; color: #58a6ff; }
  select {
    width: 100%; background: #0d1117; border: 1px solid #30363d;
    border-radius: 8px; color: #e1e4e8; padding: 0.5rem 0.8rem;
    font-family: inherit; font-size: 0.85rem;
  }
  select:focus { outline: none; border-color: #58a6ff; }

  /* Shared */
  textarea {
    width: 100%; background: #0d1117; border: 1px solid #30363d;
    border-radius: 8px; color: #e1e4e8; padding: 0.8rem;
    font-family: inherit; font-size: 0.9rem; resize: vertical;
  }
  textarea:focus { outline: none; border-color: #58a6ff; }
  .btn-submit {
    margin-top: 1rem; background: #1f6feb; color: white; border: none;
    padding: 0.7rem 1.5rem; border-radius: 8px; cursor: pointer; font-size: 0.9rem;
  }
  .btn-submit:hover:not(:disabled) { background: #388bfd; }
  .btn-submit:disabled { opacity: 0.5; cursor: not-allowed; }
</style>

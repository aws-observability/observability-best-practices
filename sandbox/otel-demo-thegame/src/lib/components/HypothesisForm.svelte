<script lang="ts">
  let { hint, expectedSymptoms, onsubmit }: {
    hint: string;
    expectedSymptoms: string[];
    onsubmit: (text: string) => void;
  } = $props();

  let hypothesis = $state('');
</script>

<div class="hypothesis-panel">
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

  <div class="form-section">
    <h3>Your Hypothesis</h3>
    <p class="instruction">Based on the metrics and hint, what do you think went wrong?</p>
    <textarea
      bind:value={hypothesis}
      placeholder="e.g., The checkout service pod was killed, causing order failures..."
      rows="4"
    ></textarea>
    <button
      class="btn-submit"
      onclick={() => onsubmit(hypothesis)}
      disabled={!hypothesis.trim()}
    >
      Submit Hypothesis
    </button>
  </div>
</div>

<style>
  .hypothesis-panel {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1.5rem;
  }
  .hint-section, .form-section {
    background: #161b22;
    border-radius: 12px;
    border: 1px solid #30363d;
    padding: 1.5rem;
  }
  h3 {
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
  .instruction {
    color: #8b949e;
    font-size: 0.85rem;
    margin-bottom: 0.8rem;
  }
  textarea {
    width: 100%;
    background: #0d1117;
    border: 1px solid #30363d;
    border-radius: 8px;
    color: #e1e4e8;
    padding: 0.8rem;
    font-family: inherit;
    font-size: 0.9rem;
    resize: vertical;
  }
  textarea:focus {
    outline: none;
    border-color: #58a6ff;
  }
  .btn-submit {
    margin-top: 1rem;
    background: #1f6feb;
    color: white;
    border: none;
    padding: 0.7rem 1.5rem;
    border-radius: 8px;
    cursor: pointer;
    font-size: 0.9rem;
  }
  .btn-submit:hover:not(:disabled) {
    background: #388bfd;
  }
  .btn-submit:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  @media (max-width: 768px) {
    .hypothesis-panel {
      grid-template-columns: 1fr;
    }
  }
</style>

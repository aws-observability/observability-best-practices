<script lang="ts">
  let { onsubmit }: {
    onsubmit: (text: string) => void;
  } = $props();

  let hypothesis = $state('');
</script>

<div class="hypothesis-panel">
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
  .form-section {
    background: #161b22;
    border-radius: 12px;
    border: 1px solid #30363d;
    padding: 1.5rem;
  }
  h3 {
    font-size: 1rem;
    margin-bottom: 0.8rem;
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
</style>

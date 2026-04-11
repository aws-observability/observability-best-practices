<script lang="ts">
  import type { Snippet } from 'svelte';

  let { open = $bindable(false), title, wide = false, narrow = false, children }: {
    open: boolean;
    title: string;
    wide?: boolean;
    narrow?: boolean;
    children: Snippet;
  } = $props();

  function onBackdrop(e: MouseEvent) {
    if ((e.target as HTMLElement).classList.contains('modal-backdrop')) open = false;
  }
</script>

{#if open}
  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <div class="modal-backdrop" onclick={onBackdrop}>
    <div class="modal" class:modal-wide={wide} class:modal-narrow={narrow} role="dialog" aria-modal="true" aria-label={title}>
      <div class="modal-header">
        <h2>{title}</h2>
        <button class="close-btn" onclick={() => open = false} aria-label="Close">✕</button>
      </div>
      <div class="modal-body">
        {@render children()}
      </div>
    </div>
  </div>
{/if}

<style>
  .modal-backdrop {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.7);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 100;
    backdrop-filter: blur(4px);
  }
  .modal {
    background: #161b22;
    border: 1px solid #30363d;
    border-radius: 12px;
    width: 90%;
    max-width: 700px;
    max-height: 85vh;
    display: flex;
    flex-direction: column;
    box-shadow: 0 16px 48px rgba(0, 0, 0, 0.4);
  }
  .modal-wide {
    max-width: 90vw;
    max-height: 90vh;
  }
  .modal-narrow {
    max-width: 420px;
  }
  .modal-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1.25rem 1.5rem;
    border-bottom: 1px solid #21262d;
  }
  h2 { font-size: 1.1rem; color: #e1e4e8; margin: 0; }
  .close-btn {
    background: none;
    border: none;
    color: #8b949e;
    font-size: 1.1rem;
    cursor: pointer;
    padding: 0.2rem 0.4rem;
    border-radius: 4px;
  }
  .close-btn:hover { color: #e1e4e8; background: #21262d; }
  .modal-body {
    padding: 1.5rem;
    overflow-y: auto;
  }
</style>

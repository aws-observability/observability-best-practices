<script lang="ts">
  let { open = $bindable(false) }: { open: boolean } = $props();

  function onBackdrop(e: MouseEvent) {
    if ((e.target as HTMLElement).classList.contains('modal-backdrop')) open = false;
  }
</script>

{#if open}
  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <div class="modal-backdrop" onclick={onBackdrop}>
    <div class="modal" role="dialog" aria-modal="true" aria-label="About">
      <div class="modal-header">
        <h2>About</h2>
        <button class="close-btn" onclick={() => open = false} aria-label="Close">✕</button>
      </div>
      <div class="modal-body">
        <p class="description">
          <strong>OpenTelemetry Demo: The Game</strong> gamifies the OpenTelemetry Demo,
          teaching you observability by breaking microservices and diagnosing failures.
          It runs on Amazon EKS with the OpenTelemetry Demo application deployed and is
          powered by Amazon CloudWatch via native OTLP ingest for metrics, traces, and logs.
        </p>

        <div class="links">
          <h3>Resources</h3>
          <ul>
            <li><a href="https://opentelemetry.io/docs/demo/" target="_blank" rel="noopener">OpenTelemetry Demo</a></li>
            <li><a href="https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-OTLPEndpoint.html" target="_blank" rel="noopener">CloudWatch OTLP endpoints</a></li>
            <li><a href="https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-PromQL-Querying.html" target="_blank" rel="noopener">PromQL in CloudWatch</a></li>
          </ul>
        </div>
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
    position: relative;
    width: 90%;
    max-width: 520px;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 16px 48px rgba(0, 0, 0, 0.4);
    border: 1px solid #30363d;
    background: #161b22;
  }
  .modal::before {
    content: '';
    position: absolute;
    inset: 0;
    background: url('/about-bg.png') center / cover no-repeat;
    opacity: 0.15;
    z-index: 0;
  }
  .modal-header {
    position: relative;
    z-index: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1.25rem 1.5rem;
    border-bottom: 1px solid rgba(48, 54, 61, 0.6);
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
  .close-btn:hover { color: #e1e4e8; background: rgba(33, 38, 45, 0.8); }
  .modal-body {
    position: relative;
    z-index: 1;
    padding: 1.5rem;
  }
  .description {
    font-size: 0.9rem;
    line-height: 1.6;
    color: #c9d1d9;
    margin: 0 0 1.25rem;
    text-shadow: 0 1px 4px rgba(0, 0, 0, 0.7);
    background: rgba(13, 17, 23, 0.75);
    padding: 0.75rem 1rem;
    border-radius: 8px;
    text-align: justify;
  }
  .description strong {
    color: #e1e4e8;
  }
  .description a {
    color: #79c0ff;
    text-decoration: none;
  }
  .description a:hover { text-decoration: underline; }
  .links {
    border-top: 1px solid rgba(48, 54, 61, 0.6);
    padding-top: 1rem;
  }
  h3 {
    font-size: 0.8rem;
    color: #8b949e;
    margin: 0 0 0.6rem;
    text-shadow: 0 1px 4px rgba(0, 0, 0, 0.7);
  }
  ul {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
  }
  li a {
    color: #79c0ff;
    text-decoration: none;
    font-size: 0.85rem;
    text-shadow: 0 1px 4px rgba(0, 0, 0, 0.7);
  }
  li a:hover { text-decoration: underline; }
</style>

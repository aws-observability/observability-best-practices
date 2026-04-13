<script lang="ts">
  import { onMount } from 'svelte';

  interface ServiceStatus {
    name: string;
    language: string;
    deployment: string;
    replicas: number;
    readyReplicas: number;
    availableReplicas: number;
  }

  const serviceDescriptions: Record<string, string> = {
    'accounting': 'Processes incoming orders and counts the sum of all orders.',
    'ad': 'Provides text ads based on given context words.',
    'cart': 'Stores the items in the user\'s shopping cart in Valkey and retrieves it.',
    'checkout': 'Retrieves user cart, prepares order and orchestrates the payment, shipping and the email notification.',
    'currency': 'Converts one money amount to another currency. Uses real values fetched from European Central Bank. It\'s the highest QPS service.',
    'email': 'Sends users an order confirmation email.',
    'flagd': 'Allows toggling and editing of feature flags.',
    'flagd-ui': 'Allows toggling and editing of feature flags.',
    'fraud-detection': 'Analyzes incoming orders and detects fraud attempts.',
    'frontend': 'Exposes an HTTP server to serve the website. Generates session IDs for all users automatically.',
    'frontend-proxy': 'Envoy-based proxy that sits in front of the frontend.',
    'image-provider': 'Serves product images.',
    'kafka': 'Message broker used for async communication between services.',
    'load-generator': 'Continuously sends requests imitating realistic user shopping flows to the frontend.',
    'payment': 'Charges the given credit card info with the given amount and returns a transaction ID.',
    'product-catalog': 'Provides the list of products from a JSON file and ability to search products and get individual products.',
    'product-reviews': 'Returns product reviews and answers questions about a specific product based on the product description and reviews.',
    'quote': 'Calculates the shipping costs, based on the number of items to be shipped.',
    'recommendation': 'Recommends other products based on what\'s given in the cart.',
    'shipping': 'Gives shipping cost estimates based on the shopping cart. Ships items to the given address.',
    'valkey-cart': 'In-memory data store used by the cart service.',
  };

  function getDescription(name: string): string {
    const key = name.toLowerCase().replace(/service$/, '').replace(/ /g, '-').trim();
    return serviceDescriptions[key] || '';
  }

  const docsBase = 'https://opentelemetry.io/docs/demo/services/';
  const docsSlugs = new Set([
    'accounting','ad','cart','checkout','currency','email','flagd-ui',
    'fraud-detection','frontend','frontend-proxy','image-provider',
    'kafka','load-generator','payment','product-catalog','product-reviews',
    'quote','recommendation','shipping',
  ]);

  const langColors: Record<string, string> = {
    'go': '#00ADD8', 'rust': '#DEA584', 'java': '#B07219', 'kotlin': '#B07219',
    'c++': '#A0724A', 'python': '#3572A5', 'ruby': '#E44D2A', 'php': '#777BB4',
    'javascript': '#F7DF1E', '.net': '#9B6BFF', 'typescript': '#F7DF1E',
    'elixir': '#6E4A7E', 'envoy': '#AC6199', 'locust': '#3572A5',
  };

  function langColor(lang: string): string {
    return langColors[lang.toLowerCase()] || '#8b949e';
  }

  function docsUrl(name: string): string | null {
    const key = name.toLowerCase().replace(/service$/, '').replace(/ /g, '-').trim();
    return docsSlugs.has(key) ? `${docsBase}${key}/` : null;
  }

  const coreRepo = 'https://github.com/open-telemetry/opentelemetry-collector/tree/main';
  const contribRepo = 'https://github.com/open-telemetry/opentelemetry-collector-contrib/tree/main';

  const componentGitHubUrls: Record<string, string> = {
    'otlp':               `${coreRepo}/receiver/otlpreceiver`,
    'batch':              `${coreRepo}/processor/batchprocessor`,
    'resource':           `${contribRepo}/processor/resourceprocessor`,
    'transform/metrics':  `${contribRepo}/processor/transformprocessor`,
    'otlphttp/cw_metrics':`${coreRepo}/exporter/otlphttpexporter`,
    'otlphttp/cw_traces': `${coreRepo}/exporter/otlphttpexporter`,
    'otlphttp/cw_logs':   `${coreRepo}/exporter/otlphttpexporter`,
    'spanmetrics':        `${contribRepo}/connector/spanmetricsconnector`,
    'health_check':       `${contribRepo}/extension/healthcheckextension`,
    'sigv4auth/metrics':  `${contribRepo}/extension/sigv4authextension`,
    'sigv4auth/traces':   `${contribRepo}/extension/sigv4authextension`,
    'sigv4auth/logs':     `${contribRepo}/extension/sigv4authextension`,
  };

  let activeTab = $state<'services' | 'telemetry'>('services');
  let expanded = $state<Record<string, boolean>>({});

  function toggle(name: string) {
    expanded[name] = !expanded[name];
  }

  function isInputFocused(): boolean {
    const el = document.activeElement;
    if (!el) return false;
    const tag = el.tagName;
    return tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || (el as HTMLElement).isContentEditable;
  }

  function onKeydown(e: KeyboardEvent) {
    if (isInputFocused()) return;
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    if (e.key === 't') {
      activeTab = 'telemetry';
    } else if (e.key === 's') {
      activeTab = 'services';
    }
  }

  let services = $state<ServiceStatus[]>([]);
  let pollInterval: ReturnType<typeof setInterval> | null = null;

  async function fetchServices() {
    try {
      const resp = await fetch('/api/services');
      const data = await resp.json();
      services = data.services || [];
    } catch {
      // ignore
    }
  }

  onMount(() => {
    fetchServices();
    pollInterval = setInterval(fetchServices, 15000);
    return () => {
      if (pollInterval) clearInterval(pollInterval);
    };
  });
</script>

<svelte:window onkeydown={onKeydown} />

<div class="service-grid-panel">
  <div class="panel-header">
    <h3>OpenTelemetry Demo overview</h3>
    <div class="tabs">
      <button class="tab" class:active={activeTab === 'services'} onclick={() => activeTab = 'services'}>Services</button>
      <button class="tab" class:active={activeTab === 'telemetry'} onclick={() => activeTab = 'telemetry'}>Telemetry</button>
    </div>
  </div>

  {#if activeTab === 'services'}
    <div class="grid">
      {#each services as svc}
        {@const desc = getDescription(svc.name)}
        {@const docs = docsUrl(svc.name)}
        <div
          class="service-card"
          class:healthy={svc.readyReplicas > 0}
          class:down={svc.readyReplicas === 0}
        >
          <div class="card-header">
            <div class="status-dot"></div>
            <div class="info">
              <span class="svc-name">{svc.name}</span>
              <span class="svc-lang" style="color: {langColor(svc.language)}">{svc.language}</span>
            </div>
            <span class="replicas">{svc.readyReplicas}/{svc.replicas}</span>
            {#if desc}
              <button class="expand-btn" onclick={() => toggle(svc.name)}>{expanded[svc.name] ? '−' : '+'}</button>
            {/if}
          </div>
          {#if expanded[svc.name] && desc}
            <div class="description">
              {desc}
              {#if docs}<a href={docs} target="_blank" rel="noopener" class="docs-link">🔗 View docs</a>{/if}
            </div>
          {/if}
        </div>
      {/each}
    </div>
  {:else}
    <div class="telemetry-tab">
      <div class="pipelines">
        <h4>Collector Pipelines</h4>
        <div class="pipeline">
          <span class="pipeline-label">metrics</span>
          <div class="pipeline-flow">
            <div class="stage receivers">
              <span class="stage-title">Receivers</span>
              <a class="chip" href={componentGitHubUrls['otlp']} target="_blank" rel="noopener">otlp <span class="chip-link">🔗</span></a>
              <a class="chip" href={componentGitHubUrls['spanmetrics']} target="_blank" rel="noopener">spanmetrics <span class="chip-link">🔗</span></a>
            </div>
            <span class="arrow">→</span>
            <div class="stage processors">
              <span class="stage-title">Processors</span>
              <a class="chip" href={componentGitHubUrls['transform/metrics']} target="_blank" rel="noopener">transform/metrics <span class="chip-link">🔗</span></a>
              <a class="chip" href={componentGitHubUrls['batch']} target="_blank" rel="noopener">batch <span class="chip-link">🔗</span></a>
            </div>
            <span class="arrow">→</span>
            <div class="stage exporters">
              <span class="stage-title">Exporters</span>
              <a class="chip" href={componentGitHubUrls['otlphttp/cw_metrics']} target="_blank" rel="noopener">otlphttp/cw_metrics <span class="chip-link">🔗</span></a>
            </div>
          </div>
        </div>
        <div class="pipeline">
          <span class="pipeline-label">traces</span>
          <div class="pipeline-flow">
            <div class="stage receivers">
              <span class="stage-title">Receivers</span>
              <a class="chip" href={componentGitHubUrls['otlp']} target="_blank" rel="noopener">otlp <span class="chip-link">🔗</span></a>
            </div>
            <span class="arrow">→</span>
            <div class="stage processors">
              <span class="stage-title">Processors</span>
              <a class="chip" href={componentGitHubUrls['batch']} target="_blank" rel="noopener">batch <span class="chip-link">🔗</span></a>
              <a class="chip" href={componentGitHubUrls['resource']} target="_blank" rel="noopener">resource <span class="chip-link">🔗</span></a>
            </div>
            <span class="arrow">→</span>
            <div class="stage exporters">
              <span class="stage-title">Exporters</span>
              <a class="chip" href={componentGitHubUrls['otlphttp/cw_traces']} target="_blank" rel="noopener">otlphttp/cw_traces <span class="chip-link">🔗</span></a>
              <a class="chip" href={componentGitHubUrls['spanmetrics']} target="_blank" rel="noopener">spanmetrics <span class="chip-link">🔗</span></a>
            </div>
          </div>
        </div>
        <div class="pipeline">
          <span class="pipeline-label">logs</span>
          <div class="pipeline-flow">
            <div class="stage receivers">
              <span class="stage-title">Receivers</span>
              <a class="chip" href={componentGitHubUrls['otlp']} target="_blank" rel="noopener">otlp <span class="chip-link">🔗</span></a>
            </div>
            <span class="arrow">→</span>
            <div class="stage processors">
              <span class="stage-title">Processors</span>
              <a class="chip" href={componentGitHubUrls['batch']} target="_blank" rel="noopener">batch <span class="chip-link">🔗</span></a>
              <a class="chip" href={componentGitHubUrls['resource']} target="_blank" rel="noopener">resource <span class="chip-link">🔗</span></a>
            </div>
            <span class="arrow">→</span>
            <div class="stage exporters">
              <span class="stage-title">Exporters</span>
              <a class="chip" href={componentGitHubUrls['otlphttp/cw_logs']} target="_blank" rel="noopener">otlphttp/cw_logs <span class="chip-link">🔗</span></a>
            </div>
          </div>
        </div>
      </div>

      <div class="extensions-row">
        <span class="ext-label">Extensions:</span>
        <a class="chip ext" href={componentGitHubUrls['health_check']} target="_blank" rel="noopener">health_check <span class="chip-link">🔗</span></a>
        <a class="chip ext" href={componentGitHubUrls['sigv4auth/metrics']} target="_blank" rel="noopener">sigv4auth/metrics <span class="chip-link">🔗</span></a>
        <a class="chip ext" href={componentGitHubUrls['sigv4auth/traces']} target="_blank" rel="noopener">sigv4auth/traces <span class="chip-link">🔗</span></a>
        <a class="chip ext" href={componentGitHubUrls['sigv4auth/logs']} target="_blank" rel="noopener">sigv4auth/logs <span class="chip-link">🔗</span></a>
      </div>

      <a
        class="otelbin-link"
        href="https://www.otelbin.io/?#config=*____extensions%3A*N______health*_check%3A*N________endpoint%3A_0.0.0.0%3A13133*N______sigv4auth%2Fmetrics%3A*N________region%3A_%22REGION*_PLACEHOLDER%22*N________service%3A_%22monitoring%22*N______sigv4auth%2Ftraces%3A*N________region%3A_%22REGION*_PLACEHOLDER%22*N________service%3A_%22xray%22*N______sigv4auth%2Flogs%3A*N________region%3A_%22REGION*_PLACEHOLDER%22*N________service%3A_%22logs%22*N*N____receivers%3A*N______otlp%3A*N________protocols%3A*N__________grpc%3A*N____________endpoint%3A_0.0.0.0%3A4317*N__________http%3A*N____________endpoint%3A_0.0.0.0%3A4318*N*N____processors%3A*N______batch%3A*N________timeout%3A_10s*N________send*_batch*_size%3A_500*N______resource%3A*N________attributes%3A*N__________-_key%3A_cloud.provider*N____________value%3A_aws*N____________action%3A_upsert*N______transform%2Fmetrics%3A*N________error*_mode%3A_ignore*N________metric*_statements%3A*N__________-_context%3A_datapoint*N____________statements%3A*N______________-_delete*_key*Cattributes%2C_%22net.sock.peer.addr%22*D*N______________-_delete*_key*Cattributes%2C_%22net.sock.peer.port%22*D*N______________-_delete*_key*Cattributes%2C_%22http.status*_code%22*D_where_IsMatch*Cattributes%5B%22http.status*_code%22%5D%2C_%22%5E%5B0-9%5D*P*S%22*D_*E*E_false*N*N____exporters%3A*N______*H_CloudWatch_OTLP_endpoint_for_metrics*N______otlphttp%2Fcw*_metrics%3A*N________endpoint%3A_%22https%3A%2F%2Fmonitoring.REGION*_PLACEHOLDER.amazonaws.com%22*N________auth%3A*N__________authenticator%3A_sigv4auth%2Fmetrics*N*N______*H_CloudWatch_OTLP_endpoint_for_traces_*CX-Ray*D*N______otlphttp%2Fcw*_traces%3A*N________endpoint%3A_%22https%3A%2F%2Fxray.REGION*_PLACEHOLDER.amazonaws.com%22*N________auth%3A*N__________authenticator%3A_sigv4auth%2Ftraces*N*N______*H_CloudWatch_Logs_via_OTLP_endpoint*N______otlphttp%2Fcw*_logs%3A*N________endpoint%3A_%22https%3A%2F%2Flogs.REGION*_PLACEHOLDER.amazonaws.com%22*N________auth%3A*N__________authenticator%3A_sigv4auth%2Flogs*N________headers%3A*N__________x-aws-log-group%3A_%22%2Fotel%2Fdemo%22*N__________x-aws-log-stream%3A_%22otel-demo-services%22*N*N____connectors%3A*N______spanmetrics%3A_%7B%7D*N*N____service%3A*N______extensions%3A_%5Bhealth*_check%2C_sigv4auth%2Fmetrics%2C_sigv4auth%2Ftraces%2C_sigv4auth%2Flogs%5D*N______pipelines%3A*N________metrics%3A*N__________receivers%3A_%5Botlp%2C_spanmetrics%5D*N__________processors%3A_%5Btransform%2Fmetrics%2C_batch%5D*N__________exporters%3A_%5Botlphttp%2Fcw*_metrics%5D*N________traces%3A*N__________receivers%3A_%5Botlp%5D*N__________processors%3A_%5Bbatch%2C_resource%5D*N__________exporters%3A_%5Botlphttp%2Fcw*_traces%2C_spanmetrics%5D*N________logs%3A*N__________receivers%3A_%5Botlp%5D*N__________processors%3A_%5Bbatch%2C_resource%5D*N__________exporters%3A_%5Botlphttp%2Fcw*_logs%5D%7E"
        target="_blank"
        rel="noopener"
      >
        Open interactive config in OTelBin ↗
      </a>
    </div>
  {/if}
</div>

<style>
  .service-grid-panel {
    background: #161b22;
    border-radius: 12px;
    border: 1px solid #30363d;
    padding: 1.5rem;
  }
  .panel-header {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-bottom: 1rem;
    flex-wrap: wrap;
  }
  h3 {
    font-size: 1rem;
    margin: 0;
    background: rgba(88, 166, 255, 0.1);
    padding: 0.4rem 0.8rem;
    border-radius: 6px;
    display: inline-block;
  }
  .tabs {
    display: flex;
    gap: 0.25rem;
    background: #0d1117;
    border-radius: 6px;
    padding: 0.2rem;
    border: 1px solid #21262d;
  }
  .tab {
    background: transparent;
    border: none;
    color: #8b949e;
    font-size: 0.8rem;
    font-weight: 500;
    padding: 0.3rem 0.75rem;
    border-radius: 4px;
    cursor: pointer;
    transition: background 0.15s, color 0.15s;
  }
  .tab:hover { color: #e6edf3; }
  .tab.active {
    background: #30363d;
    color: #f0f6fc;
  }
  .telemetry-tab {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
  .pipelines h4 {
    font-size: 0.85rem;
    font-weight: 400;
    color: #8b949e;
    margin: 0 0 0.6rem 0;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    text-align: center;
  }
  .pipeline {
    background: #0d1117;
    border: 1px solid #21262d;
    border-radius: 6px;
    padding: 0.6rem 0.8rem;
    margin-bottom: 0.5rem;
  }
  .pipeline-label {
    font-size: 0.85rem;
    font-weight: 600;
    color: #f0f6fc;
    display: block;
    margin-bottom: 0.4rem;
  }
  .pipeline-flow {
    display: flex;
    align-items: flex-start;
    gap: 0.5rem;
    flex-wrap: wrap;
  }
  .stage {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    min-width: 0;
  }
  .stage-title {
    font-size: 0.65rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: #8b949e;
  }
  .arrow {
    color: #484f58;
    font-size: 1.2rem;
    padding-top: 0.8rem;
    flex-shrink: 0;
  }
  .chip {
    font-size: 0.8rem;
    font-family: monospace;
    padding: 0.35rem 0.7rem;
    border-radius: 8px;
    white-space: nowrap;
    text-decoration: none;
    display: inline-flex;
    align-items: center;
    gap: 0.3rem;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3), 0 0.5px 1px rgba(0, 0, 0, 0.2);
    transition: box-shadow 0.15s, opacity 0.15s;
  }
  a.chip:hover {
    opacity: 0.85;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.4), 0 1px 2px rgba(0, 0, 0, 0.25);
  }
  .chip-link {
    font-size: 0.65rem;
  }
  .receivers .chip { background: rgba(56, 139, 253, 0.15); color: #58a6ff; }
  .processors .chip { background: rgba(210, 153, 34, 0.15); color: #d29922; }
  .exporters .chip { background: rgba(63, 185, 80, 0.15); color: #3fb950; }
  .extensions-row {
    display: flex;
    align-items: center;
    gap: 0.4rem;
    flex-wrap: wrap;
  }
  .ext-label {
    font-size: 0.75rem;
    color: #8b949e;
  }
  .chip.ext {
    background: rgba(139, 148, 158, 0.15);
    color: #8b949e;
  }
  .otelbin-link {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    font-size: 0.8rem;
    color: #58a6ff;
    text-decoration: none;
    background: rgba(88, 166, 255, 0.08);
    padding: 0.5rem 0.8rem;
    border-radius: 6px;
    border: 1px solid rgba(88, 166, 255, 0.2);
    align-self: flex-start;
    transition: background 0.15s;
  }
  .otelbin-link:hover {
    background: rgba(88, 166, 255, 0.15);
    text-decoration: none;
  }
  .grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(230px, 1fr));
    gap: 0.6rem;
  }
  .service-card {
    background: #0d1117;
    border-radius: 6px;
    border: 1px solid #21262d;
    padding: 0.6rem 0.8rem;
  }
  .card-header {
    display: flex;
    align-items: center;
    gap: 0.6rem;
  }
  .expand-btn {
    background: #30363d;
    border: 1px solid #484f58;
    border-radius: 4px;
    color: #f0f6fc;
    cursor: pointer;
    font-size: 1rem;
    font-weight: 300;
    line-height: 1;
    padding: 0.1rem 0.4rem;
    flex-shrink: 0;
  }
  .expand-btn:hover { background: #30363d; border-color: #8b949e; }
  .description {
    margin-top: 0.5rem;
    padding: 0.5rem;
    font-size: 0.8rem;
    color: #e6edf3;
    line-height: 1.4;
    background: #21262d;
    border-radius: 4px;
  }
  .status-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    flex-shrink: 0;
  }
  .healthy .status-dot { background: #3fb950; }
  .down .status-dot { background: #f85149; animation: pulse 1s infinite; }
  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.3; }
  }
  .info {
    flex: 1;
    display: flex;
    flex-direction: column;
    min-width: 0;
  }
  .svc-name {
    font-size: 0.95rem;
    font-weight: 600;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .docs-link {
    display: inline-block;
    margin-top: 0.3rem;
    font-size: 0.75rem;
    color: #58a6ff;
    text-decoration: none;
  }
  .docs-link:hover { text-decoration: underline; }
  .svc-lang {
    font-size: 0.75rem;
    font-weight: 600;
  }
  .replicas {
    font-size: 0.75rem;
    color: #8b949e;
    font-family: monospace;
  }
</style>

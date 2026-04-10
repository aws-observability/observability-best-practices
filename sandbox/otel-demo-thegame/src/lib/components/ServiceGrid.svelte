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
    'go': '#00ADD8', 'rust': '#DEA584', 'java': '#B07219', 'kotlin': '#A97BFF',
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

  let expanded = $state<Record<string, boolean>>({});

  function toggle(name: string) {
    expanded[name] = !expanded[name];
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

<div class="service-grid-panel">
  <h3>OpenTelemetry Demo overview</h3>
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
</div>

<style>
  .service-grid-panel {
    background: #161b22;
    border-radius: 12px;
    border: 1px solid #30363d;
    padding: 1.5rem;
  }
  h3 {
    font-size: 1rem;
    margin-bottom: 1rem;
    background: rgba(88, 166, 255, 0.1);
    padding: 0.4rem 0.8rem;
    border-radius: 6px;
    display: inline-block;
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

import type { ChaosScenario } from './types';

export const SCENARIOS: ChaosScenario[] = [
  // ── Pod kills (easy) ─────────────────────────────────────────────
  {
    id: 'kill-checkout',
    name: 'Checkout Service Down',
    category: 'pod-kill',
    difficulty: 'easy',
    description: 'Kill the checkout service pod, breaking the order flow.',
    targetServices: ['checkout'],
    hint: 'Users cannot complete purchases. Orders fail with 5xx errors and the frontend error rate is climbing.',
    expectedSymptoms: ['checkout 5xx errors spike', 'frontend error rate increases', 'order completion rate drops to zero'],
    remediationSteps: [
      'Identify the missing pod: kubectl get pods -n otel-demo | grep checkout',
      'Check events: kubectl describe deployment otel-demo-checkoutservice -n otel-demo',
      'Scale back up: kubectl scale deployment otel-demo-checkoutservice -n otel-demo --replicas=1',
      'Verify recovery by checking RED metrics return to baseline'
    ]
  },
  {
    id: 'kill-payment',
    name: 'Payment Service Crash',
    category: 'pod-kill',
    difficulty: 'easy',
    description: 'Kill the payment service pod, causing all charges to fail.',
    targetServices: ['payment'],
    hint: 'Transactions fail at the final step. Checkout traces show errors when attempting to charge.',
    expectedSymptoms: ['payment service unreachable', 'checkout errors on payment step', 'order completion fails'],
    remediationSteps: [
      'Check pod status: kubectl get pods -n otel-demo -l app=otel-demo-paymentservice',
      'Restart: kubectl rollout restart deployment otel-demo-paymentservice -n otel-demo',
      'Watch rollout: kubectl rollout status deployment otel-demo-paymentservice -n otel-demo',
      'Confirm payment flow works by checking trace completion'
    ]
  },
  {
    id: 'kill-cart',
    name: 'Cart Service Outage',
    category: 'pod-kill',
    difficulty: 'easy',
    description: 'Kill the cart service pod, users lose their shopping carts.',
    targetServices: ['cart'],
    hint: 'Shopping carts are empty and add-to-cart operations return 503 errors.',
    expectedSymptoms: ['cart API returns 503', 'frontend shows empty carts', 'add-to-cart operations fail'],
    remediationSteps: [
      'Locate issue: kubectl get pods -n otel-demo | grep cart',
      'Check Valkey connectivity: kubectl logs -n otel-demo -l app=otel-demo-cartservice --previous',
      'Restore: kubectl scale deployment otel-demo-cartservice -n otel-demo --replicas=1',
      'Verify cart operations resume in traces'
    ]
  },
  {
    id: 'kill-product-catalog',
    name: 'Product Catalog Gone',
    category: 'pod-kill',
    difficulty: 'easy',
    description: 'Kill the product catalog service, no products can be listed.',
    targetServices: ['product-catalog'],
    hint: 'The storefront shows no products. Product listing requests return errors and recommendations are broken.',
    expectedSymptoms: ['product listing returns errors', 'frontend shows no products', 'recommendation service fails'],
    remediationSteps: [
      'Check: kubectl get pods -n otel-demo -l app=otel-demo-productcatalogservice',
      'Inspect: kubectl describe pod -n otel-demo -l app=otel-demo-productcatalogservice',
      'Restore: kubectl rollout restart deployment otel-demo-productcatalogservice -n otel-demo',
      'Verify product listings return in frontend traces'
    ]
  },
  {
    id: 'kill-currency',
    name: 'Currency Service Failure',
    category: 'pod-kill',
    difficulty: 'medium',
    description: 'Kill the highest-QPS service: currency conversion.',
    targetServices: ['currency'],
    hint: 'Prices display incorrectly or fail to load. Multiple services report upstream errors and both checkout and frontend are degraded.',
    expectedSymptoms: ['currency conversion errors cascade', 'multiple services report upstream failures', 'checkout and frontend degrade'],
    remediationSteps: [
      'Identify: kubectl get pods -n otel-demo | grep currency',
      'This is the highest QPS service — recovery is urgent',
      'Restore: kubectl scale deployment otel-demo-currencyservice -n otel-demo --replicas=1',
      'Monitor cascade recovery across dependent services'
    ]
  },
  {
    id: 'kill-fraud-detection',
    name: 'Fraud Detection Offline',
    category: 'pod-kill',
    difficulty: 'easy',
    description: 'Kill the fraud detection service, orders proceed without fraud checks.',
    targetServices: ['fraud-detection'],
    hint: 'Fraud analysis is not happening. Orders are processing without fraud checks and accounting logs show unchecked orders.',
    expectedSymptoms: ['fraud-detection pod missing', 'orders process without fraud check', 'accounting logs show unchecked orders'],
    remediationSteps: [
      'Check: kubectl get pods -n otel-demo | grep fraud',
      'Restore: kubectl scale deployment otel-demo-frauddetectionservice -n otel-demo --replicas=1',
      'Verify fraud detection appears in order processing traces',
      'Check accounting service logs for resumed fraud checks'
    ]
  },

  // ── Load spikes (easy) ───────────────────────────────────────────
  {
    id: 'load-frontend',
    name: 'Frontend Traffic Flood',
    category: 'load-spike',
    difficulty: 'easy',
    description: 'Massively increase Locust user count to overwhelm the frontend.',
    targetServices: ['frontend'],
    hint: 'Everything is slow. Latency is up across all services and error rates are climbing gradually.',
    expectedSymptoms: ['frontend latency spikes', 'all downstream services see increased duration', 'error rate climbs gradually'],
    remediationSteps: [
      'Check load generator: kubectl logs -n otel-demo -l app=otel-demo-loadgenerator --tail=20',
      'Scale down locust: kubectl exec -n otel-demo deploy/otel-demo-loadgenerator -- locust --reset-stats',
      'Or restart load generator: kubectl rollout restart deployment otel-demo-loadgenerator -n otel-demo',
      'Watch latency metrics return to baseline'
    ]
  },
  {
    id: 'load-checkout-spike',
    name: 'Checkout Overload',
    category: 'load-spike',
    difficulty: 'easy',
    description: 'Spike checkout requests causing the order pipeline to saturate.',
    targetServices: ['checkout', 'payment', 'shipping', 'email'],
    hint: 'The entire order pipeline is slow. Checkout, payment, shipping, and email all show elevated latency and timeouts.',
    expectedSymptoms: ['checkout p99 latency > 5s', 'payment queuing', 'email delivery delays', 'shipping timeouts'],
    remediationSteps: [
      'Identify bottleneck in traces: look for the longest span in checkout flow',
      'Scale checkout horizontally: kubectl scale deployment otel-demo-checkoutservice -n otel-demo --replicas=3',
      'Reduce load generator intensity',
      'Monitor recovery across the order pipeline'
    ]
  },
  {
    id: 'load-currency-saturation',
    name: 'Currency Service Saturation',
    category: 'load-spike',
    difficulty: 'easy',
    description: 'Flood the currency service with conversion requests.',
    targetServices: ['currency'],
    hint: 'Currency conversion is very slow. Product pages and cart totals take a long time to render.',
    expectedSymptoms: ['currency p99 > 2s', 'frontend product pages slow', 'cart total calculation delays'],
    remediationSteps: [
      'Check currency service metrics for request rate spike',
      'Scale: kubectl scale deployment otel-demo-currencyservice -n otel-demo --replicas=3',
      'Consider rate limiting at the service mesh level',
      'Reduce load generator user count to stabilize'
    ]
  },
  {
    id: 'load-recommendation-spike',
    name: 'Recommendation Service Overload',
    category: 'load-spike',
    difficulty: 'easy',
    description: 'Flood the recommendation service with requests, overwhelming the Python ML model.',
    targetServices: ['recommendation'],
    hint: 'Product recommendations are extremely slow. The service CPU is maxed and frontend product pages are timing out.',
    expectedSymptoms: ['recommendation p99 > 5s', 'frontend product pages timeout on recommendations', 'CPU usage maxed'],
    remediationSteps: [
      'Check load: kubectl top pods -n otel-demo | grep recommendation',
      'Scale: kubectl scale deployment otel-demo-recommendationservice -n otel-demo --replicas=3',
      'Reduce load generator intensity',
      'Monitor p99 latency recovery'
    ]
  },

  // ── Resource pressure (easy–medium) ──────────────────────────────
  {
    id: 'cpu-pressure-recommendation',
    name: 'Recommendation CPU Starvation',
    category: 'resource-pressure',
    difficulty: 'easy',
    description: 'Set CPU limits extremely low on the recommendation service.',
    targetServices: ['recommendation'],
    hint: 'Product recommendations are timing out. The service responds very slowly and frontend product pages only partially load.',
    expectedSymptoms: ['recommendation latency spikes', 'CPU throttling visible in metrics', 'frontend product pages partially load'],
    remediationSteps: [
      'Check resource usage: kubectl top pods -n otel-demo | grep recommendation',
      'Inspect limits: kubectl get deployment otel-demo-recommendationservice -n otel-demo -o yaml | grep -A5 resources',
      'Patch resources: kubectl patch deployment otel-demo-recommendationservice -n otel-demo --type=json -p \'[{"op":"replace","path":"/spec/template/spec/containers/0/resources/limits/cpu","value":"500m"}]\'',
      'Verify CPU throttling stops in metrics'
    ]
  },
  {
    id: 'memory-pressure-cart',
    name: 'Cart Memory Exhaustion',
    category: 'resource-pressure',
    difficulty: 'medium',
    description: 'Reduce memory limits on cart service causing OOMKills.',
    targetServices: ['cart'],
    hint: 'The cart service keeps restarting. It works briefly after each restart then goes down again.',
    expectedSymptoms: ['cart pod OOMKilled restarts', 'intermittent cart failures', 'Valkey connection drops'],
    remediationSteps: [
      'Check restarts: kubectl get pods -n otel-demo | grep cart (look at RESTARTS column)',
      'Describe pod for OOMKilled: kubectl describe pod -n otel-demo -l app=otel-demo-cartservice',
      'Increase memory: kubectl patch deployment otel-demo-cartservice -n otel-demo --type=json -p \'[{"op":"replace","path":"/spec/template/spec/containers/0/resources/limits/memory","value":"512Mi"}]\'',
      'Monitor pod stability'
    ]
  },
  {
    id: 'memory-pressure-ad',
    name: 'Ad Service Memory Leak Simulation',
    category: 'resource-pressure',
    difficulty: 'easy',
    description: 'Constrain ad service memory to simulate a memory leak causing restarts.',
    targetServices: ['ad'],
    hint: 'The ad service keeps crashing and restarting. Ads intermittently disappear from the frontend.',
    expectedSymptoms: ['ad service OOMKilled', 'ads disappear from frontend', 'Java heap errors in logs'],
    remediationSteps: [
      'Check pod events: kubectl describe pod -n otel-demo -l app=otel-demo-adservice',
      'Look for OOMKilled in status',
      'Increase memory limit: kubectl set resources deployment otel-demo-adservice -n otel-demo --limits=memory=1Gi',
      'Optionally tune JVM: add -Xmx512m to JAVA_OPTS env var'
    ]
  },
  {
    id: 'cpu-pressure-frontend',
    name: 'Frontend CPU Throttle',
    category: 'resource-pressure',
    difficulty: 'easy',
    description: 'Set extremely low CPU limits on the frontend, causing slow page renders.',
    targetServices: ['frontend'],
    hint: 'Every page is slow to render. All frontend response times are above 5 seconds.',
    expectedSymptoms: ['frontend response time > 5s', 'all pages slow', 'CPU throttling in container metrics'],
    remediationSteps: [
      'Check: kubectl top pods -n otel-demo | grep frontend',
      'Inspect limits: kubectl get deployment otel-demo-frontend -n otel-demo -o jsonpath=\'{.spec.template.spec.containers[0].resources}\'',
      'Fix: kubectl patch deployment otel-demo-frontend -n otel-demo --type=json -p \'[{"op":"replace","path":"/spec/template/spec/containers/0/resources/limits/cpu","value":"1"}]\'',
      'Verify page load times recover'
    ]
  },

  // ── Network faults (medium) ──────────────────────────────────────
  {
    id: 'network-partition-shipping',
    name: 'Shipping Service Network Partition',
    category: 'network-fault',
    difficulty: 'medium',
    description: 'Partition the shipping service from the network, causing all outbound connections to fail.',
    targetServices: ['shipping'],
    hint: 'Shipping estimates take forever. The checkout flow stalls at the shipping step with timeout errors.',
    expectedSymptoms: ['shipping latency > 10s', 'checkout flow slows at shipping step', 'timeout errors in traces'],
    remediationSteps: [
      'Check shipping pod network: kubectl exec -n otel-demo deploy/otel-demo-shippingservice -- env | grep PROXY',
      'Remove proxy vars or restart pod: kubectl rollout restart deployment otel-demo-shippingservice -n otel-demo',
      'Verify latency returns to normal in traces'
    ]
  },
  {
    id: 'network-drop-email',
    name: 'Email Service Network Partition',
    category: 'network-fault',
    difficulty: 'medium',
    description: 'Partition the email service from the network, causing all outbound connections to fail.',
    targetServices: ['email'],
    hint: 'Order confirmation emails are not arriving. The email service error rate is high and checkout completes without confirmation.',
    expectedSymptoms: ['email delivery failures', 'checkout completes but no confirmation', 'email service error rate high'],
    remediationSteps: [
      'Inspect email pod env: kubectl exec -n otel-demo deploy/otel-demo-emailservice -- env | grep PROXY',
      'Remove proxy vars or restart: kubectl rollout restart deployment otel-demo-emailservice -n otel-demo',
      'Check email delivery traces for recovery'
    ]
  },
  {
    id: 'network-latency-product-catalog',
    name: 'Product Catalog Network Partition',
    category: 'network-fault',
    difficulty: 'medium',
    description: 'Partition the product catalog from the network, causing all outbound connections to fail.',
    targetServices: ['product-catalog'],
    hint: 'Product pages load very slowly. The product catalog p99 latency is above 3 seconds and downstream services are timing out.',
    expectedSymptoms: ['product-catalog p99 > 3s', 'frontend product grid loads slowly', 'recommendation service times out'],
    remediationSteps: [
      'Check: kubectl exec -n otel-demo deploy/otel-demo-productcatalogservice -- env | grep PROXY',
      'Fix: kubectl rollout restart deployment otel-demo-productcatalogservice -n otel-demo',
      'Verify in traces that product catalog latency returns to <100ms',
      'Check downstream services (recommendation, frontend) also recover'
    ]
  },

  // ── Config faults (medium) ───────────────────────────────────────
  {
    id: 'config-fault-frontend-env',
    name: 'Frontend Misconfiguration',
    category: 'config-fault',
    difficulty: 'medium',
    description: 'Set an invalid backend URL env var on the frontend, breaking API calls.',
    targetServices: ['frontend'],
    hint: 'The frontend returns 502/503 on all API calls. Backend services appear healthy when checked individually.',
    expectedSymptoms: ['frontend 502/503 errors', 'all API calls from frontend fail', 'backend services are healthy but unreachable'],
    remediationSteps: [
      'Check frontend env: kubectl get deployment otel-demo-frontend -n otel-demo -o yaml | grep -A20 env',
      'Look for incorrect backend URL',
      'Fix: kubectl set env deployment otel-demo-frontend -n otel-demo CHECKOUT_SERVICE_ADDR=otel-demo-checkoutservice:8080',
      'Verify frontend can reach backends in traces'
    ]
  },
  {
    id: 'config-fault-quote-crash',
    name: 'Quote Service Bad Config',
    category: 'config-fault',
    difficulty: 'medium',
    description: 'Inject a bad config causing the PHP quote service to crash loop.',
    targetServices: ['quote'],
    hint: 'Shipping quotes are unavailable. The quote service pod is in CrashLoopBackOff and checkout cannot calculate totals.',
    expectedSymptoms: ['quote service CrashLoopBackOff', 'shipping cost shows as unavailable', 'checkout cannot calculate total'],
    remediationSteps: [
      'Check: kubectl get pods -n otel-demo | grep quote',
      'Logs: kubectl logs -n otel-demo -l app=otel-demo-quoteservice --previous',
      'Fix config: kubectl rollout undo deployment otel-demo-quoteservice -n otel-demo',
      'Or redeploy: kubectl rollout restart deployment otel-demo-quoteservice -n otel-demo'
    ]
  },

  // ── Feature flag scenarios (via flagd) ───────────────────────────
  {
    id: 'flag-ad-service-failure',
    name: 'Ad Service Failure (Feature Flag)',
    category: 'feature-flag',
    difficulty: 'easy',
    description: 'Enable the adServiceFailure flag, causing the ad service to return errors on 1/10th of GetAds requests.',
    targetServices: ['ad'],
    hint: 'Ads fail intermittently — about 1 in 10 requests errors. The ad service pod is healthy and running.',
    expectedSymptoms: ['ad service error rate ~10%', 'some pages missing ads', 'intermittent gRPC errors in ad traces'],
    remediationSteps: [
      'Check ad service logs: kubectl logs -n otel-demo -l app.kubernetes.io/component=adservice --tail=20',
      'Look for feature flag evaluation in traces',
      'Disable the adServiceFailure flag via the flagd UI at /feature',
      'Verify ad error rate returns to zero'
    ]
  },
  {
    id: 'flag-ad-service-high-cpu',
    name: 'Ad Service High CPU (Feature Flag)',
    category: 'feature-flag',
    difficulty: 'easy',
    description: 'Enable the adServiceHighCpu flag, triggering high CPU load in the Java ad service.',
    targetServices: ['ad'],
    hint: 'The ad service is extremely slow and CPU usage is near the limit. No resource limits were recently changed.',
    expectedSymptoms: ['ad service latency spikes', 'CPU usage near limit', 'downstream timeouts on ad requests'],
    remediationSteps: [
      'Check CPU: kubectl top pods -n otel-demo | grep ad',
      'Look for the adServiceHighCpu feature flag in traces',
      'Disable the flag via flagd UI or ConfigMap',
      'Verify CPU and latency return to normal'
    ]
  },
  {
    id: 'flag-ad-service-manual-gc',
    name: 'Ad Service Manual GC (Feature Flag)',
    category: 'feature-flag',
    difficulty: 'medium',
    description: 'Enable the adServiceManualGc flag, triggering full manual garbage collections in the Java ad service causing stop-the-world pauses.',
    targetServices: ['ad'],
    hint: 'The ad service has periodic latency spikes in a sawtooth pattern. Between spikes it performs normally.',
    expectedSymptoms: ['periodic latency spikes in ad service', 'GC pause times visible in JVM metrics', 'intermittent timeouts'],
    remediationSteps: [
      'Check ad service JVM metrics for GC activity',
      'Look for the adServiceManualGc feature flag',
      'Disable the flag via flagd',
      'Verify GC pauses stop and latency stabilizes'
    ]
  },
  {
    id: 'flag-cart-service-failure',
    name: 'Cart Service Failure (Feature Flag)',
    category: 'feature-flag',
    difficulty: 'easy',
    description: 'Enable the cartServiceFailure flag, causing errors whenever EmptyCart is called.',
    targetServices: ['cart'],
    hint: 'Emptying the cart always fails with an error. Other cart operations like adding items work fine. The pod is healthy.',
    expectedSymptoms: ['EmptyCart requests return errors', 'checkout flow may fail if cart clearing is required', 'cart service error rate increases'],
    remediationSteps: [
      'Check cart service logs for EmptyCart errors',
      'Look for feature flag evaluation in cart service traces',
      'Disable the cartServiceFailure flag',
      'Verify EmptyCart operations succeed'
    ]
  },
  {
    id: 'flag-payment-service-failure',
    name: 'Payment Service Failure (Feature Flag)',
    category: 'feature-flag',
    difficulty: 'easy',
    description: 'Enable the paymentServiceFailure flag, causing the charge method to return errors.',
    targetServices: ['payment', 'checkout'],
    hint: 'All payments fail. The payment service pod is healthy and accepting connections, but every charge request returns an error.',
    expectedSymptoms: ['payment charge requests fail', 'checkout cannot complete', 'order completion rate drops to zero'],
    remediationSteps: [
      'Check payment service traces for charge errors',
      'Look for the paymentServiceFailure feature flag',
      'Disable the flag via flagd',
      'Verify payments succeed again'
    ]
  },
  {
    id: 'flag-payment-service-unreachable',
    name: 'Payment Service Unreachable (Feature Flag)',
    category: 'feature-flag',
    difficulty: 'medium',
    description: 'Enable the paymentServiceUnreachable flag on the checkout service, making it use a bad address for the payment service.',
    targetServices: ['checkout', 'payment'],
    hint: 'Checkout reports the payment service is unreachable. But the payment pod is running, healthy, and shows no incoming traffic.',
    expectedSymptoms: ['checkout reports payment service unreachable', 'connection refused errors in checkout traces', 'payment service itself shows no incoming traffic'],
    remediationSteps: [
      'Check checkout service logs for connection errors to payment',
      'Notice payment service has zero incoming requests (it is healthy)',
      'Look for the paymentServiceUnreachable feature flag',
      'Disable the flag and verify checkout can reach payment again'
    ]
  },
  {
    id: 'flag-product-catalog-failure',
    name: 'Product Catalog Failure (Feature Flag)',
    category: 'feature-flag',
    difficulty: 'medium',
    description: 'Enable the productCatalogFailure flag, causing GetProduct to fail for a specific product ID (OLJCESPC7Z).',
    targetServices: ['product-catalog', 'frontend'],
    hint: 'Most products load fine, but one specific product page always returns an error. The catalog service is up and serving other requests.',
    expectedSymptoms: ['specific product page returns errors', 'GetProduct fails for one product ID', 'frontend shows error for that product'],
    remediationSteps: [
      'Check product catalog traces filtered by the failing product ID',
      'Look for the productCatalogFailure feature flag',
      'Disable the flag via flagd',
      'Verify all product pages load correctly'
    ]
  },
  {
    id: 'flag-recommendation-cache-failure',
    name: 'Recommendation Cache Leak (Feature Flag)',
    category: 'feature-flag',
    difficulty: 'medium',
    description: 'Enable the recommendationServiceCacheFailure flag, creating a memory leak via an exponentially growing cache (1.4x growth, 50% of requests).',
    targetServices: ['recommendation'],
    hint: 'The recommendation service is getting slower over time. Memory usage keeps climbing steadily.',
    expectedSymptoms: ['recommendation memory usage grows continuously', 'latency increases over time', 'eventual OOMKill if left running'],
    remediationSteps: [
      'Check memory: kubectl top pods -n otel-demo | grep recommendation',
      'Look for the recommendationServiceCacheFailure feature flag',
      'Disable the flag via flagd',
      'Restart the recommendation pod to reclaim memory'
    ]
  },
  {
    id: 'flag-kafka-queue-problems',
    name: 'Kafka Queue Overload (Feature Flag)',
    category: 'feature-flag',
    difficulty: 'medium',
    description: 'Enable the kafkaQueueProblems flag, overloading the Kafka queue while introducing consumer-side delays causing a lag spike.',
    targetServices: ['accounting', 'fraud-detection'],
    hint: 'Async order processing is falling behind. Consumer lag is growing and accounting and fraud-detection show processing delays.',
    expectedSymptoms: ['Kafka consumer lag increases', 'accounting and fraud-detection processing delays', 'order events pile up in the queue'],
    remediationSteps: [
      'Check Kafka consumer lag metrics',
      'Look for the kafkaQueueProblems feature flag',
      'Disable the flag via flagd',
      'Monitor lag recovery as consumers catch up'
    ]
  },
  {
    id: 'flag-image-slow-load',
    name: 'Slow Product Images (Feature Flag)',
    category: 'feature-flag',
    difficulty: 'easy',
    description: 'Enable the imageSlowLoad flag, injecting delays into product image loading via envoy fault injection on the frontend.',
    targetServices: ['frontend'],
    hint: 'Product pages load quickly but images take a very long time. API responses and HTML are fast — only image assets are slow.',
    expectedSymptoms: ['product images load very slowly', 'frontend HTML/API responses are fast', 'image request duration spikes'],
    remediationSteps: [
      'Check frontend traces — notice image requests are slow but API calls are fast',
      'Look for envoy fault injection or the imageSlowLoad feature flag',
      'Disable the flag via flagd',
      'Verify images load at normal speed'
    ]
  },

  // ═══════════════════════════════════════════════════════════════════
  // NEW SCENARIOS — Multi-Fault / Compound Failures
  // ═══════════════════════════════════════════════════════════════════
  {
    id: 'multi-payment-flag-cart-oom',
    name: 'Double Whammy: Payment Flag + Cart OOM',
    category: 'multi-fault',
    difficulty: 'hard',
    faultCount: 2,
    description: 'Simultaneously enable paymentServiceFailure flag AND constrain cart memory to 32Mi. Two independent failures in the checkout flow. Fixing only one still leaves the system broken.',
    targetServices: ['payment', 'cart', 'checkout'],
    hint: 'Checkout is completely broken. Some traces show payment errors, others show cart 503s. The failure pattern is inconsistent.',
    expectedSymptoms: [
      'Payment charge errors in ~100% of checkouts',
      'Cart pod OOMKilled with restart cycling',
      'Two separate root causes visible in traces'
    ],
    remediationSteps: [
      { instruction: 'Look at checkout traces — you should see two distinct error patterns', condition: 'Start here' },
      { instruction: 'Disable the paymentServiceFailure feature flag via flagd', condition: 'If traces show payment charge errors' },
      { instruction: 'Increase cart memory limits: kubectl patch deployment otel-demo-cartservice -n otel-demo --type=json -p \'[{"op":"replace","path":"/spec/template/spec/containers/0/resources/limits/memory","value":"512Mi"}]\'', condition: 'If cart pod is OOMKilled / restarting' },
      'Verify BOTH fixes are applied — checkout should fully recover only after both are resolved'
    ]
  },
  {
    id: 'multi-three-layer-degradation',
    name: 'Three-Layer Degradation: CPU + Network + Flag',
    category: 'multi-fault',
    difficulty: 'expert',
    faultCount: 3,
    description: 'Constrain frontend CPU to 10m, inject network partition on product-catalog, AND enable adServiceFailure flag. Three independent faults across three different injection mechanisms.',
    targetServices: ['frontend', 'product-catalog', 'ad'],
    hint: 'The whole storefront is degraded but in different ways. Pages render slowly, product data arrives late, and some ads are missing. Each symptom has a different cause.',
    expectedSymptoms: [
      'Frontend response time >5s (CPU)',
      'Product catalog p99 >3s (network)',
      'Ad service error rate ~10% (flag)',
      'Three separate span anomalies in traces'
    ],
    remediationSteps: [
      'Use traces to separate which spans are slow vs. erroring and map each to a different root cause',
      { instruction: 'Fix frontend CPU: kubectl patch deployment otel-demo-frontend -n otel-demo --type=json -p \'[{"op":"replace","path":"/spec/template/spec/containers/0/resources/limits/cpu","value":"1"}]\'', condition: 'If frontend spans are uniformly slow' },
      { instruction: 'Fix product-catalog network: kubectl rollout restart deployment otel-demo-productcatalogservice -n otel-demo', condition: 'If product-catalog spans show connection timeouts' },
      { instruction: 'Disable adServiceFailure flag via flagd', condition: 'If ad service spans show intermittent errors' },
      'All three must be fixed for full recovery'
    ]
  },
  {
    id: 'multi-red-herring',
    name: 'The Red Herring: Noisy Ad Hides Silent Checkout Break',
    category: 'multi-fault',
    difficulty: 'expert',
    faultCount: 2,
    description: 'Enable adServiceHighCpu flag (very visible, noisy) AND corrupt checkout\'s payment address to an invalid host (subtle, silent). The ad CPU spike dominates dashboards. The checkout misconfiguration silently breaks all orders.',
    targetServices: ['ad', 'checkout', 'payment'],
    hint: 'There are two problems. One is loud and obvious. The other is quiet and more impactful. Don\'t get tunnel-visioned on the noisiest alert.',
    expectedSymptoms: [
      'Ad service CPU pegged, latency through the roof (very visible)',
      'Checkout silently failing to reach payment (less visible)',
      'Order completion rate at zero (the real business impact)'
    ],
    remediationSteps: [
      'Assess business impact first — ads are non-critical, but order completion is zero',
      { instruction: 'Fix checkout payment address: check PAYMENT_SERVICE_ADDR env var on checkout deployment', condition: 'If order completion rate is zero but checkout pod is healthy' },
      { instruction: 'Disable adServiceHighCpu flag via flagd', condition: 'If ad service CPU is pegged' },
      'The checkout fix is higher priority despite the ad problem being noisier'
    ]
  },

  // ═══════════════════════════════════════════════════════════════════
  // NEW SCENARIOS — Cascading Failures
  // ═══════════════════════════════════════════════════════════════════
  {
    id: 'cascade-currency-kill-load',
    name: 'Currency Kill + Load Spike → Retry Storm Cascade',
    category: 'cascading',
    secondaryCategories: ['load-spike', 'pod-kill'],
    difficulty: 'hard',
    faultCount: 2,
    description: 'Kill currency service (highest QPS) AND spike load to 400 users. Currency kill causes retries from all dependents; load spike amplifies the retry storm into a full cascade across frontend, checkout, cart, product-catalog.',
    targetServices: ['currency', 'frontend', 'checkout', 'cart', 'product-catalog'],
    hint: 'Nearly every service is erroring or slow. But one service is completely missing and its absence is the root cause everything else reacts to. The load spike makes the cascade worse.',
    expectedSymptoms: [
      'Currency at 0 replicas',
      'Retry storms visible in trace fan-out',
      '5+ services degraded',
      'Error rate climbs over time (retry backoff)'
    ],
    remediationSteps: [
      'Identify which service is completely missing (not just slow)',
      'Restore currency: kubectl scale deployment otel-demo-currencyservice -n otel-demo --replicas=1',
      'Reduce load generator to stop amplifying the cascade',
      { instruction: 'Wait for retry storms to subside — restored currency may get overwhelmed initially', condition: 'If currency restarts but immediately gets overloaded' },
      'Monitor cascade recovery across all dependent services'
    ]
  },
  {
    id: 'cascade-memory-leak-oom',
    name: 'Memory Leak + Tight Limit → OOM Crash Loop',
    category: 'cascading',
    secondaryCategories: ['feature-flag', 'resource-pressure'],
    difficulty: 'medium',
    faultCount: 2,
    description: 'Enable recommendationServiceCacheFailure (memory leak flag) AND constrain recommendation memory to 128Mi. Leak hits ceiling quickly, causing repeated OOMKills with a sawtooth pattern.',
    targetServices: ['recommendation', 'frontend'],
    hint: 'The recommendation service is in a crash loop but it\'s not simple OOM — it works briefly after each restart then crashes again. Memory shows climb-crash-climb.',
    expectedSymptoms: [
      'Pod restarts every 30-60s',
      'Memory sawtooth pattern',
      'Intermittent recommendations on frontend'
    ],
    remediationSteps: [
      'Check pod restarts and OOMKilled status',
      { instruction: 'Disable the recommendationServiceCacheFailure flag via flagd', condition: 'If memory climbs steadily after each restart (leak)' },
      { instruction: 'Increase memory limit: kubectl patch deployment otel-demo-recommendationservice -n otel-demo --type=json -p \'[{"op":"replace","path":"/spec/template/spec/containers/0/resources/limits/memory","value":"512Mi"}]\'', condition: 'If memory limit is unusually low' },
      'Both the leak (flag) and the tight limit need to be fixed for stable recovery'
    ]
  },

  // ═══════════════════════════════════════════════════════════════════
  // NEW SCENARIOS — Data-Layer
  // ═══════════════════════════════════════════════════════════════════
  {
    id: 'data-valkey-memory-pressure',
    name: 'Valkey Memory Pressure → Silent Cart Data Loss',
    category: 'data-layer',
    difficulty: 'hard',
    description: 'Constrain the Valkey pod\'s memory to force key evictions. Cart data silently disappears — no errors, just empty carts. The cart service itself is healthy and responding 200 OK.',
    targetServices: ['cart'],
    hint: 'Users lose their carts after adding items. Cart service shows no errors — all API calls succeed. But carts are empty on subsequent requests.',
    expectedSymptoms: [
      'Cart service 200 OK on all requests',
      'No errors in RED metrics',
      'Valkey memory at limit, eviction count climbing',
      'Cart contents vanish between requests'
    ],
    remediationSteps: [
      'Notice that cart RED metrics look healthy — this is silent data loss',
      'Check Valkey infrastructure: kubectl top pods -n otel-demo | grep valkey',
      'Check Valkey memory and evictions: kubectl exec -n otel-demo deploy/otel-demo-valkey -- redis-cli info memory',
      'Increase Valkey memory limit: kubectl patch deployment otel-demo-valkey -n otel-demo --type=json -p \'[{"op":"replace","path":"/spec/template/spec/containers/0/resources/limits/memory","value":"256Mi"}]\'',
      'This scenario teaches the limits of RED metrics — data-layer issues can be invisible at the application layer'
    ]
  },
  {
    id: 'data-kafka-broker-kill',
    name: 'Kafka Broker Kill → Consumer Lag Spike',
    category: 'data-layer',
    difficulty: 'medium',
    description: 'Kill the Kafka broker pod, forcing partition leader re-election. During the window, producers see transient errors and consumers stop. After recovery, a burst of reprocessed messages.',
    targetServices: ['accounting', 'fraud-detection', 'checkout'],
    hint: 'Async order processing stopped. Accounting and fraud-detection are idle. Checkout occasionally reports publish errors. The problem is in the message broker.',
    expectedSymptoms: [
      'Kafka broker pod restarting',
      'Producer errors from checkout (transient)',
      'Consumer lag grows then recovers with burst'
    ],
    remediationSteps: [
      'Check Kafka broker status: kubectl get pods -n otel-demo | grep kafka',
      'The StatefulSet will restart the broker automatically',
      'Monitor consumer lag recovery: accounting and fraud-detection should resume processing',
      'Understand the transient failure and recovery pattern — this is expected Kafka behavior during leader re-election'
    ]
  },

  // ═══════════════════════════════════════════════════════════════════
  // NEW SCENARIOS — Observability Pipeline Failures
  // ═══════════════════════════════════════════════════════════════════
  {
    id: 'o11y-collector-cpu-starvation',
    name: 'OTel Collector CPU Starvation → Telemetry Gaps',
    category: 'observability-gap',
    difficulty: 'expert',
    description: 'Constrain OTel Collector\'s CPU to 10m. Collector can\'t process telemetry fast enough — metrics become sparse, traces incomplete, logs have gaps. Application services are actually healthy.',
    targetServices: ['frontend', 'checkout'],
    hint: 'Your metrics dashboard has gaps. Some services appear to have zero traffic but users say the site works. Traces have missing spans. Something is wrong with your observability data, not the application.',
    expectedSymptoms: [
      'Metrics time series with gaps or flatlines',
      'Traces with broken parent-child span chains',
      'All application pods Running and healthy',
      'Collector\'s own metrics show dropped data'
    ],
    remediationSteps: [
      'Recognize that missing data ≠ zero traffic — the application is healthy',
      'Check OTel Collector pod: kubectl top pods -n otel-demo | grep otelcol',
      'Check collector logs for dropped spans/metrics: kubectl logs -n otel-demo -l app.kubernetes.io/component=otelcol --tail=50',
      'Increase collector CPU: kubectl patch deployment otel-demo-otelcol -n otel-demo --type=json -p \'[{"op":"replace","path":"/spec/template/spec/containers/0/resources/limits/cpu","value":"1"}]\'',
      'This is a meta-scenario — your debugging tools are the thing that\'s broken'
    ]
  },
  {
    id: 'o11y-collector-oom-load',
    name: 'Collector OOM + Load Spike → Flying Blind',
    category: 'observability-gap',
    secondaryCategories: ['load-spike'],
    difficulty: 'hard',
    faultCount: 2,
    description: 'Constrain collector memory to 64Mi while spiking load to 300 users. Collector\'s memory_limiter drops telemetry. Application is under genuine load but you can\'t see it properly.',
    targetServices: ['frontend', 'checkout'],
    hint: 'Application under heavy load and you need to diagnose it, but telemetry is unreliable. Metrics sporadic, traces truncated. Flying partially blind.',
    expectedSymptoms: [
      'Incomplete traces with missing spans',
      'Metrics rates don\'t match actual traffic',
      'Collector pod may OOMKill',
      'Real load spike happening but underreported'
    ],
    remediationSteps: [
      'Fix the collector first to get reliable data',
      'Check collector pod: kubectl get pods -n otel-demo | grep otelcol (look for OOMKilled/restarts)',
      'Increase collector memory: kubectl patch deployment otel-demo-otelcol -n otel-demo --type=json -p \'[{"op":"replace","path":"/spec/template/spec/containers/0/resources/limits/memory","value":"512Mi"}]\'',
      'Once telemetry is reliable, diagnose the load spike',
      'Reduce load generator intensity to stabilize the application'
    ]
  },
  {
    id: 'o11y-exporter-misconfigured',
    name: 'OTEL_EXPORTER Misconfigured → Invisible Checkout',
    category: 'observability-gap',
    secondaryCategories: ['config-fault'],
    difficulty: 'hard',
    description: 'Set OTEL_EXPORTER_OTLP_ENDPOINT on checkout to a black-hole address. Checkout works fine but sends zero telemetry. Appears as zero traffic in dashboards.',
    targetServices: ['checkout'],
    hint: 'Checkout appears dead in dashboards. But users are placing orders successfully. The service is working — you just can\'t see it.',
    expectedSymptoms: [
      'Zero rate, errors, duration for checkout in RED metrics',
      'No checkout-sourced spans in traces',
      'Frontend traces show successful calls TO checkout',
      'Pod healthy, 1/1 Running'
    ],
    remediationSteps: [
      'Notice the discrepancy: zero telemetry but pod is healthy and frontend traces show calls to checkout succeeding',
      'Check checkout env vars: kubectl get deployment otel-demo-checkoutservice -n otel-demo -o yaml | grep OTEL_EXPORTER',
      'Fix the exporter endpoint: kubectl set env deployment otel-demo-checkoutservice -n otel-demo OTEL_EXPORTER_OTLP_ENDPOINT=http://otel-demo-otelcol:4317',
      'Verify checkout telemetry reappears in dashboards'
    ]
  },

  // ═══════════════════════════════════════════════════════════════════
  // NEW SCENARIOS — Configuration & Dependency Faults
  // ═══════════════════════════════════════════════════════════════════
  {
    id: 'dependency-service-address-swap',
    name: 'Service Address Swap → Wrong Endpoint',
    category: 'config-fault',
    secondaryCategories: ['multi-fault'],
    difficulty: 'hard',
    description: 'Point checkout\'s PRODUCT_CATALOG_SERVICE_ADDR at the currency service. Checkout asks currency for product data, getting protocol errors. Both services healthy individually.',
    targetServices: ['checkout', 'product-catalog', 'currency'],
    hint: 'Checkout gets strange errors looking up products. Product catalog is healthy and serving other clients. Currency shows unexpected incoming requests.',
    expectedSymptoms: [
      'gRPC errors on checkout\'s product catalog calls',
      'Currency service logs unrecognized method calls',
      'Product catalog normal traffic from other clients'
    ],
    remediationSteps: [
      'Check checkout traces for product catalog call errors — the error type is unusual (protocol mismatch, not connection refused)',
      'Check checkout env vars: kubectl get deployment otel-demo-checkoutservice -n otel-demo -o yaml | grep PRODUCT_CATALOG',
      'Notice the address points to currency, not product-catalog',
      'Fix: kubectl set env deployment otel-demo-checkoutservice -n otel-demo PRODUCT_CATALOG_SERVICE_ADDR=otel-demo-productcatalogservice:8080',
      'Verify checkout can look up products again'
    ]
  },

  // ═══════════════════════════════════════════════════════════════════
  // NEW SCENARIOS — Race Conditions & Timing
  // ═══════════════════════════════════════════════════════════════════
  {
    id: 'race-staggered-kill',
    name: 'Staggered Kill: Payment → (30s) → Cart',
    category: 'race-condition',
    secondaryCategories: ['pod-kill'],
    difficulty: 'expert',
    faultCount: 2,
    triggerDelayMs: 30000,
    description: 'Kill payment immediately, then 30 seconds later kill cart. Player starts investigating payment errors, and mid-investigation symptoms change as cart goes down. Simulates a rolling failure.',
    targetServices: ['payment', 'cart'],
    hint: 'The incident is evolving. What started as payment errors now includes cart failures. Check if you\'re chasing the first problem while a second develops.',
    expectedSymptoms: [
      't=0: Payment errors, checkout fails at charge',
      't=30s: Cart also fails, add-to-cart broken',
      'Player may fixate on payment and miss cart'
    ],
    remediationSteps: [
      'Check ALL services, not just the first one you noticed failing',
      'Restore payment: kubectl scale deployment otel-demo-paymentservice -n otel-demo --replicas=1',
      { instruction: 'Restore cart: kubectl scale deployment otel-demo-cartservice -n otel-demo --replicas=1', condition: 'If cart is also down (it may fail after you start investigating payment)' },
      'Real incidents evolve — always re-check the full picture before declaring resolution'
    ]
  },
  {
    id: 'race-slow-burn-cpu',
    name: 'Slow Burn: Gradual CPU Strangulation',
    category: 'race-condition',
    secondaryCategories: ['resource-pressure'],
    difficulty: 'medium',
    triggerDelayMs: 20000,
    description: 'Set frontend CPU to 200m (mild), after 20s reduce to 50m, after another 20s to 10m. Degradation is gradual — latency creeps up rather than spiking.',
    targetServices: ['frontend'],
    hint: 'Frontend latency increasing over time. Started subtle, getting worse. Something is progressively degrading.',
    expectedSymptoms: [
      'Frontend p99 climbs ~200ms → 1s → 5s+ over 60s',
      'CPU throttling increases in container metrics',
      'Errors only start in final phase'
    ],
    remediationSteps: [
      'Notice the trend — latency is increasing over time, not a sudden spike',
      'Check frontend CPU limits: kubectl get deployment otel-demo-frontend -n otel-demo -o jsonpath=\'{.spec.template.spec.containers[0].resources}\'',
      'Fix: kubectl patch deployment otel-demo-frontend -n otel-demo --type=json -p \'[{"op":"replace","path":"/spec/template/spec/containers/0/resources/limits/cpu","value":"1"}]\'',
      'Gradual degradation simulates noisy-neighbor or resource exhaustion patterns'
    ]
  },

  // ═══════════════════════════════════════════════════════════════════
  // NEW SCENARIOS — Capacity & Scaling
  // ═══════════════════════════════════════════════════════════════════
  {
    id: 'capacity-thundering-herd',
    name: 'Scale-to-Zero + Load → Thundering Herd',
    category: 'capacity',
    secondaryCategories: ['load-spike'],
    difficulty: 'hard',
    faultCount: 2,
    description: 'Scale checkout, payment, shipping to 0 replicas. Spike load to 500. Services get requests before any pods are ready — thundering herd of failures. Even after pods start, queued retries may overwhelm them.',
    targetServices: ['checkout', 'payment', 'shipping'],
    hint: 'Multiple services down, traffic slamming them. Even as pods come up, they\'re immediately overwhelmed. Recovery is slower than expected.',
    expectedSymptoms: [
      'Multiple services at 0 replicas',
      '503s across checkout flow',
      'Pod startup visible as metrics gap',
      'Retry storm extends recovery'
    ],
    remediationSteps: [
      'Scale up the missing services: kubectl scale deployment otel-demo-checkoutservice otel-demo-paymentservice otel-demo-shippingservice -n otel-demo --replicas=1',
      { instruction: 'Reduce load generator to give services time to recover', condition: 'If pods come up but immediately get overwhelmed' },
      'Recovery may be slow due to thundering herd — "fix root cause" isn\'t always sufficient, may need to shed load during recovery',
      'Monitor all three services for stable recovery'
    ]
  },
  {
    id: 'capacity-scheduling-deadlock',
    name: 'Resource Request Inflation → Scheduling Deadlock',
    category: 'capacity',
    difficulty: 'medium',
    description: 'Inflate ad service CPU requests (not limits) to 4 CPU. The scheduler can\'t fit other pods. Ad service runs fine since it got scheduled first, but any pod restart fails to reschedule.',
    targetServices: ['ad'],
    hint: 'A recently restarted pod can\'t schedule. Events show "Insufficient cpu". But total cluster CPU usage isn\'t high — the issue is in resource requests, not actual usage.',
    expectedSymptoms: [
      'Pending pods with "Insufficient cpu" events',
      'Ad service pod running fine',
      'Allocatable CPU exhausted despite low actual usage'
    ],
    remediationSteps: [
      'Check for Pending pods: kubectl get pods -n otel-demo | grep Pending',
      'Describe the pending pod: kubectl describe pod <name> -n otel-demo (look for "Insufficient cpu" in events)',
      'Check resource requests (not limits): kubectl get deployment otel-demo-adservice -n otel-demo -o jsonpath=\'{.spec.template.spec.containers[0].resources.requests}\'',
      'Fix: kubectl patch deployment otel-demo-adservice -n otel-demo --type=json -p \'[{"op":"replace","path":"/spec/template/spec/containers/0/resources/requests/cpu","value":"100m"}]\'',
      'The issue is requests vs. actual usage — a common misconfiguration in production'
    ]
  },
];

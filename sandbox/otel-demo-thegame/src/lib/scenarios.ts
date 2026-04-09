import type { ChaosScenario } from './types';

export const SCENARIOS: ChaosScenario[] = [
  {
    id: 'kill-checkout',
    name: 'Checkout Service Down',
    category: 'pod-kill',
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
    id: 'load-frontend',
    name: 'Frontend Traffic Flood',
    category: 'load-spike',
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
    id: 'cpu-pressure-recommendation',
    name: 'Recommendation CPU Starvation',
    category: 'resource-pressure',
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
    id: 'network-partition-shipping',
    name: 'Shipping Service Network Partition',
    category: 'network-fault',
    description: 'Add network latency to the shipping service pod using tc.',
    targetServices: ['shipping'],
    hint: 'Shipping estimates take forever. The checkout flow stalls at the shipping step with timeout errors.',
    expectedSymptoms: ['shipping latency > 10s', 'checkout flow slows at shipping step', 'timeout errors in traces'],
    remediationSteps: [
      'Check shipping pod network: kubectl exec -n otel-demo deploy/otel-demo-shippingservice -- tc qdisc show',
      'Remove delay: kubectl exec -n otel-demo deploy/otel-demo-shippingservice -- tc qdisc del dev eth0 root',
      'Or restart pod: kubectl rollout restart deployment otel-demo-shippingservice -n otel-demo',
      'Verify latency returns to normal in traces'
    ]
  },
  {
    id: 'network-drop-email',
    name: 'Email Service Packet Loss',
    category: 'network-fault',
    description: 'Introduce 50% packet loss on the email service.',
    targetServices: ['email'],
    hint: 'Order confirmation emails are not arriving. The email service error rate is around 50% and checkout completes without confirmation.',
    expectedSymptoms: ['email delivery failures', 'checkout completes but no confirmation', 'email service error rate ~50%'],
    remediationSteps: [
      'Inspect email pod: kubectl exec -n otel-demo deploy/otel-demo-emailservice -- tc qdisc show',
      'Remove packet loss: kubectl exec -n otel-demo deploy/otel-demo-emailservice -- tc qdisc del dev eth0 root',
      'Restart if needed: kubectl rollout restart deployment otel-demo-emailservice -n otel-demo',
      'Check email delivery traces for recovery'
    ]
  },
  {
    id: 'network-latency-product-catalog',
    name: 'Product Catalog Slow Network',
    category: 'network-fault',
    description: 'Add 3s network latency to product catalog, slowing all product lookups.',
    targetServices: ['product-catalog'],
    hint: 'Product pages load very slowly. The product catalog p99 latency is above 3 seconds and downstream services are timing out.',
    expectedSymptoms: ['product-catalog p99 > 3s', 'frontend product grid loads slowly', 'recommendation service times out'],
    remediationSteps: [
      'Check: kubectl exec -n otel-demo deploy/otel-demo-productcatalogservice -- tc qdisc show',
      'Fix: kubectl exec -n otel-demo deploy/otel-demo-productcatalogservice -- tc qdisc del dev eth0 root',
      'Verify in traces that product catalog latency returns to <100ms',
      'Check downstream services (recommendation, frontend) also recover'
    ]
  },
  {
    id: 'kill-fraud-detection',
    name: 'Fraud Detection Offline',
    category: 'pod-kill',
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
  {
    id: 'config-fault-frontend-env',
    name: 'Frontend Misconfiguration',
    category: 'config-fault',
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
  {
    id: 'load-recommendation-spike',
    name: 'Recommendation Service Overload',
    category: 'load-spike',
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
  {
    id: 'cpu-pressure-frontend',
    name: 'Frontend CPU Throttle',
    category: 'resource-pressure',
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
  // ── Feature flag scenarios (via flagd) ───────────────────────────
  {
    id: 'flag-ad-service-failure',
    name: 'Ad Service Failure (Feature Flag)',
    category: 'feature-flag',
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
];

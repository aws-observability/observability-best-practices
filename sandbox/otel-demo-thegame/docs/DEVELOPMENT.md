# Developer Guide — OTel Chaos Game

This document covers the web application architecture, server-side modules,
API surface, frontend components, and how to extend the game with new
scenarios.

## Prerequisites

- Node.js 20+
- A running EKS cluster with the OTel demo deployed (see `docs/INFRASTRUCTURE.md`)
- A valid kubeconfig pointing at the cluster
- AWS credentials with CloudWatch read access

## Running locally

```bash
cd otel-chaos-game
npm install
npm run dev          # http://localhost:5173
```

The dev server needs network access to both the Kubernetes API (via your
kubeconfig) and CloudWatch (via your AWS credentials / environment).

Type-check without building:

```bash
npm run check
```

Production build:

```bash
npm run build
npm run preview      # serves the built app on :4173
```

## Project layout

```
src/
├── lib/
│   ├── types.ts              # Shared TypeScript interfaces
│   ├── scenarios.ts          # 20 chaos scenario definitions
│   ├── server/               # Server-only modules (never sent to browser)
│   │   ├── k8s.ts            # Kubernetes client wrapper
│   │   ├── chaos-engine.ts   # Scenario trigger + cleanup logic
│   │   ├── cloudwatch.ts     # CloudWatch metrics & logs reader
│   │   └── game-state.ts     # In-memory game state machine
│   └── components/           # Svelte 5 UI components
│       ├── ScoreBoard.svelte
│       ├── RedDashboard.svelte
│       ├── HypothesisForm.svelte
│       ├── RevealPanel.svelte
│       ├── RemediatePanel.svelte
│       └── ServiceGrid.svelte
├── routes/
│   ├── +layout.svelte        # App shell, nav, global styles
│   ├── +page.svelte          # Main game page (state machine UI)
│   └── api/                  # SvelteKit server routes (JSON APIs)
│       ├── game/
│       │   ├── trigger/      # POST — pick & inject a random scenario
│       │   ├── hint/         # GET  — reveal hint + expected symptoms
│       │   ├── hypothesis/   # POST — submit player hypothesis, reveal cause
│       │   ├── remediate/    # POST — auto-remediate or mark manual fix
│       │   ├── state/        # GET  — current game state
│       │   └── reset/        # POST — reset score and history
│       ├── metrics/          # GET  — RED metrics from CloudWatch
│       ├── logs/             # GET  — service logs from CloudWatch
│       └── services/         # GET  — live deployment status from K8s
├── app.html                  # HTML template
└── app.d.ts                  # SvelteKit type augmentations
```

## Core concepts

### Game state machine

The game progresses through phases managed by `game-state.ts`:

```
idle → triggering → observing → hypothesis → reveal → remediate → complete
                                                                      │
                                                                      ↓
                                                              idle (next round)
```

State is held in-memory in a module-level variable. This is intentional —
the app is single-player, single-instance. A restart resets the game.

### Chaos scenarios

Each scenario in `scenarios.ts` is a `ChaosScenario` object:

| Field              | Purpose                                              |
|--------------------|------------------------------------------------------|
| `id`               | Unique key, used by `chaos-engine.ts` switch/case    |
| `name`             | Human-readable title shown in the reveal panel       |
| `category`         | One of: `pod-kill`, `load-spike`, `resource-pressure`, `network-fault`, `config-fault` |
| `description`      | What the scenario does (shown after reveal)          |
| `targetServices`   | Service names from `OTEL_SERVICES` affected          |
| `hint`             | Clue shown to the player during hypothesis phase     |
| `expectedSymptoms` | Observable effects listed alongside the hint         |
| `remediationSteps` | Ordered kubectl commands to fix the issue            |

### Chaos engine

`chaos-engine.ts` maps each scenario ID to a concrete Kubernetes mutation:

| Function               | K8s operation                                      |
|------------------------|----------------------------------------------------|
| `killServicePod`       | Deletes the pod, then scales deployment to 0       |
| `spikeLoadGenerator`   | Sets `LOCUST_USERS` / `LOCUST_SPAWN_RATE` env vars |
| `constrainCpu`         | Patches container CPU limits to a tiny value       |
| `constrainMemory`      | Patches container memory limits to trigger OOMKill |
| `injectNetworkDelay`   | Runs `tc qdisc add netem delay` inside the pod     |
| `injectPacketLoss`     | Runs `tc qdisc add netem loss` inside the pod      |
| `corruptEnvVar`        | Sets an env var to an invalid value                |

Each function records the original state in an in-memory `Map` so that
`cleanupScenario` can reverse the change (scale back up, restart to clear
env/resources/network).

### Kubernetes client (`k8s.ts`)

Wraps `@kubernetes/client-node`. Key exports:

- `listPods(namespace, labelSelector?)` — list pods
- `deletePod(namespace, name)` — delete a single pod
- `scaleDeployment(namespace, name, replicas)` — patch replica count
- `patchDeploymentResources(namespace, name, idx, resources)` — patch CPU/memory limits
- `setEnvVar(namespace, deployment, key, value)` — read-modify-write an env var
- `execInPod(namespace, pod, command[])` — exec a command inside a running pod
- `getDeploymentStatus(namespace, name)` — returns replica counts

The client loads kubeconfig from the default location (`~/.kube/config` or
the `KUBECONFIG` env var). In-cluster config is also supported automatically.

### CloudWatch client (`cloudwatch.ts`)

Reads telemetry that the OTel Collector has exported to CloudWatch:

- `getREDMetrics(services, start, end)` — queries `GetMetricData` for rate
  (SampleCount), errors (5xx SampleCount), and duration (p99) per service.
- `getServiceLogs(service, start, end)` — queries `FilterLogEvents` with a
  JSON filter on `service.name`.
- `getAllServicesREDMetrics(start, end)` — convenience wrapper for all 14
  non-load-generator services.

Configuration via environment variables:

| Variable               | Default      | Description                        |
|------------------------|--------------|------------------------------------|
| `AWS_REGION`           | `eu-west-1`  | AWS region                         |
| `CW_METRICS_NAMESPACE` | `OTelDemo`   | CloudWatch namespace for metrics   |
| `CW_LOG_GROUP`         | `/otel/demo` | CloudWatch Logs group name         |

## API reference

All routes return JSON.

### Game flow

| Method | Path                    | Description                                    |
|--------|-------------------------|------------------------------------------------|
| GET    | `/api/game/state`       | Returns current `GameState`                    |
| POST   | `/api/game/trigger`     | Picks a random scenario, injects chaos         |
| GET    | `/api/game/hint`        | Returns hint + expected symptoms               |
| POST   | `/api/game/hypothesis`  | Body: `{ hypothesis: string }`. Reveals cause  |
| POST   | `/api/game/remediate`   | Body: `{ action: "auto-remediate" | "manual-complete" }` |
| POST   | `/api/game/reset`       | Resets score, round, history                   |

### Observability data

| Method | Path              | Query params                          | Description                  |
|--------|-------------------|---------------------------------------|------------------------------|
| GET    | `/api/metrics`    | `service?`, `minutes?` (default: 15)  | RED metrics from CloudWatch  |
| GET    | `/api/logs`       | `service` (required), `minutes?`      | Service logs from CloudWatch |
| GET    | `/api/services`   | —                                     | Live K8s deployment statuses |

## Frontend components

All components use Svelte 5 runes (`$state`, `$props`, `$effect`).

| Component              | Role                                                        |
|------------------------|-------------------------------------------------------------|
| `ScoreBoard`           | Displays round number, total score, phase badge, history dots |
| `RedDashboard`         | Three Chart.js line charts (rate, errors, duration) per service. Polls every 10s. |
| `ServiceGrid`          | Grid of service cards with health dot (green/red pulsing), language tag, replica count. Polls every 15s. |
| `HypothesisForm`       | Split panel: hint + symptoms on the left, textarea on the right |
| `RevealPanel`          | Side-by-side: player hypothesis vs actual cause with category badge and affected services |
| `RemediatePanel`       | Ordered remediation steps with checkboxes, plus auto-remediate and manual-complete buttons |

## Adding a new chaos scenario

1. Add a `ChaosScenario` entry to `src/lib/scenarios.ts`.
2. Add a `case` for the new `id` in the `triggerScenario` switch in
   `src/lib/server/chaos-engine.ts`, calling one of the existing helper
   functions or writing a new one.
3. If you wrote a new helper, make sure it records original state in the
   `originalState` map and that `cleanupScenario` can reverse it.
4. That's it — the UI, API, and game loop are all scenario-agnostic.

## Scoring

- 100 points for completing a round (both auto-remediate and manual-complete
  award full points).
- 25 points partial credit if the round is completed but marked incorrect
  (currently unused — all completions score 100).


## Using CloudWatch

You can use Amazon CloudWatch to query and visualize the telemetry signals (logs, metrics, traces) ingested via OTLP.

### Metrics: PromQL

Use [PromQL in the AWS console](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-PromQL-Querying.html) or configure the CloudWatch PromQL API as a data source in Grafana.

Memory usage by service (in MB):

```
avg ({"container.memory.usage"}/1024/1024)
   by("@resource.k8s.deployment.name")
```

![CW Query Studio screen shot memory usage](img/promql-memory-usage.png)

Comparing `p75` and `p99` request durations by HTTP response status code:

```
histogram_quantile(0.75,
   sum(rate({"http.client.request.duration"}[5m]))
      by("http.response.status_code")
)

histogram_quantile(0.99,
   sum(rate({"http.client.request.duration"}[5m]))
      by ("@resource.service.name")
)
```

![CW Query Studio screen shot request duration](img/promql-request-duration.png)

RED metrics for all services, errors:

```
sum ({"traces.span.metrics.calls", "status.code"="STATUS_CODE_ERROR"})
   by ("@resource.service.name")
```

![CW Query Studio screen shot request duration](img/promql-red.png)

Advertisement requests by response type:

```
sum ({"app.ads.ad_requests"})
   by ("app.ads.ad_response_type")
```

![CW Query Studio screen shot ad types](img/promql-ads.png)


### Traces: X-Ray

Use [X-Ray in the AWS console](https://docs.aws.amazon.com/xray/latest/devguide/xray-console-filters.html).

Search for traces:

```
(service(id(name: "frontend"  ))) AND (Annotation[aws.local.environment] = "k8s:default")
```

Visualize application map:

![CW application map](img/app-map.png)


## Known limitations

- Game state is in-memory. Restarting the server resets everything.
- Single-player only. No auth, no sessions.

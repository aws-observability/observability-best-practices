# Walkthrough: OpenTelemetry Demo — The Game

Learn observability by breaking things. This walkthrough takes you from your first click to your final score across 5 rounds of chaos engineering mayhem.

---

## Act 1: Orientation

You land on the game screen. Everything is calm. Fourteen microservices hum along happily in the `otel-demo` namespace — checkout, payment, cart, frontend, and friends, written in everything from Go to Rust to PHP.

![Landing screen in idle state](screenshots/01-idle.png)

The header shows your vitals: **Round 0**, **Score 0**, **Phase: idle**. A single green button beckons.

Before you smash it, get familiar with your toolkit. Press `H` to see keyboard shortcuts:

| Key | Opens |
|-----|-------|
| `R` | RED metrics dashboard |
| `M` | Service dependency map |
| `P` | PromQL explorer |
| `K` | Kubectl runner |
| `C` | Cost breakdown |
| `←` / `→` | Shrink / expand time range |

![Keyboard shortcuts help dialog](screenshots/02-help.png)

The **Service Grid** at the top shows all 14 services with their languages. This is your cast of characters — get to know them.

![Service grid showing all microservices](screenshots/03-service-grid.png)

---

## Act 2: Chaos Injection

Hit **Play!** and something breaks. You won't know what. The game picks a random scenario from 44 possibilities across 12 failure categories:

- Pod kills, load spikes, resource pressure
- Network partitions, config corruption, feature flags
- Multi-fault combos, cascading failures, data-layer issues
- Observability pipeline gaps, race conditions, capacity problems

Difficulty ranges from "easy" (one pod dies) to "expert" (your telemetry pipeline is broken while a real incident unfolds — good luck).

![Phase indicator showing OBSERVING](screenshots/04-observing-phase.png)

The phase banner flips to **OBSERVING**: *"Something broke. Observe the metrics and form a hypothesis."*

Metrics start auto-refreshing every 10 seconds. The clock is ticking.

---

## Act 3: Investigation

This is where you play detective. You have five tools at your disposal:

### RED Dashboard

Rate, Errors, Duration — the holy trinity of service health. Spot the anomaly.

![RED metrics dashboard with anomalies visible](screenshots/05-red-dashboard.png)

### Service Map

A dependency graph of the entire system. Affected services light up. Click any service to drill into its logs or traces.

![Service map with highlighted failing services](screenshots/06-service-map.png)

### Traces

Distributed traces show the full request path. Look for broken spans, timeouts, and error codes.

![Traces modal showing span waterfall](screenshots/07-traces.png)

### Logs

CloudWatch Logs Insights queries scoped to a single service. Find the smoking gun.

![Logs modal with error entries](screenshots/08-logs.png)

### PromQL Explorer

Write free-form PromQL queries for when the dashboards aren't enough.

![PromQL explorer with custom query](screenshots/09-promql.png)

### Kubectl Runner

Run sandboxed kubectl commands — `get pods`, `describe`, `top`, `logs`. Your terminal inside the game.

![Kubectl modal running get pods](screenshots/10-kubectl.png)

---

When you've seen enough, hit **"Get Hint & Form Hypothesis"**. The game reveals a hint and a list of expected symptoms. Phase shifts to **HYPOTHESIS**.

![Hint panel with expected symptoms](screenshots/11-hint.png)

---

## Act 4: Hypothesis

Time to commit. Type your best guess at what went wrong in the free-text box.

> *"The payment service pod was killed, breaking the checkout flow. Orders fail at the charge step."*

![Hypothesis form with player input](screenshots/12-hypothesis.png)

Hit submit. An LLM judge scores your answer 0–100 against the actual root cause.

---

## Act 5: The Reveal

Side-by-side comparison: your hypothesis on the left, the actual cause on the right.

![Reveal panel showing hypothesis vs actual cause](screenshots/13-reveal.png)

You'll see:
- **Scenario name** and category badge (e.g., `pod-kill`, `multi-fault`)
- **Difficulty** rating
- **Fault count** (for compound scenarios)
- **AI explanation** — a concise breakdown of what failed, how it cascaded, and what signals you should have spotted

The score bar shows your result:
- 🔴 Red (< 30): way off
- 🟡 Yellow (30–70): on the right track
- 🟢 Green (≥ 70): nailed it

![LLM score bar showing result](screenshots/14-score-bar.png)

Click **"Proceed to Remediation"**.

---

## Act 6: Remediation

Now fix it. The game shows step-by-step remediation instructions with actual kubectl commands.

![Remediation panel with checklist](screenshots/15-remediation.png)

Each step has:
- A checkbox to track your progress
- The command to run (e.g., `kubectl scale deployment ... --replicas=1`)
- Conditions for when to apply it (for multi-fault scenarios)
- Alternative approaches

Two options to finish:

| Button | What it does |
|--------|-------------|
| **Auto-Remediate** | The game restores everything automatically (scales pods back, removes bad env vars, restores flags) |
| **I Fixed It Manually** | You ran the commands yourself — respect ✊ |

Either way, the system heals and the round ends.

---

## Act 7: Progression

🎉 **Round Complete!** Your score for this round gets added to the total.

![Round complete modal with confetti](screenshots/16-round-complete.png)

Hit **Next Round** for another random scenario. The game runs 5 rounds total, each independent and unpredictable.

The header tracks your history with colored dots:
- 🟢 Green = strong score
- 🟡 Yellow = partial credit

### Game Report (After Round 5)

After the final round, you get a full report card:

![Game report showing all 5 rounds](screenshots/17-game-report.png)

- Every scenario you faced
- Your hypothesis for each
- Score per round
- Total score
- **Play Again** to start fresh

---

## Side Quests

Available anytime via keyboard shortcuts or header buttons. These aren't just nice-to-haves — in harder scenarios, the in-game dashboards won't be enough.

---

### PromQL Explorer (`P`)

A full PromQL query interface backed by Amazon CloudWatch. Type a query, pick a time range, and get back a graph, table, or heatmap.

![PromQL explorer with query and graph](screenshots/18-promql-explorer.png)

The explorer runs `query_range` against CloudWatch's Prometheus-compatible endpoint with SigV4 auth — you just write the PromQL.

#### Useful queries to try:

**Request rate per service (last 5 min):**
```promql
rate(http_server_request_duration_seconds_count[5m])
```

**Error ratio for checkout:**
```promql
sum(rate(http_server_request_duration_seconds_count{service_name="otel-demo-checkoutservice", http_response_status_code=~"5.."}[5m]))
/
sum(rate(http_server_request_duration_seconds_count{service_name="otel-demo-checkoutservice"}[5m]))
```

**P99 latency for the frontend:**
```promql
histogram_quantile(0.99, rate(http_server_request_duration_seconds_bucket{service_name="otel-demo-frontend"}[5m]))
```

**CPU throttling (container level):**
```promql
rate(container_cpu_cfs_throttled_seconds_total{namespace="otel-demo"}[5m])
```

**Memory usage approaching limits:**
```promql
container_memory_working_set_bytes{namespace="otel-demo"}
/ container_spec_memory_limit_bytes{namespace="otel-demo"} > 0.8
```

**Kafka consumer lag (for data-layer scenarios):**
```promql
kafka_consumer_group_lag{namespace="otel-demo"}
```

Tips:
- Use the `←`/`→` keys to adjust the time range without leaving the explorer.
- The graph auto-targets ~100 data points. For longer ranges, the step size increases.
- If a query times out (25s limit), try a shorter range or add label filters.

---

### Kubectl Runner (`K`)

A terminal-in-the-browser for read-only kubectl commands. No need to switch windows.

![Kubectl runner with command output](screenshots/19-kubectl-runner.png)

The runner supports tab-completion for subcommands, resource types, flags, and output formats. It blocks destructive commands (`delete`, `apply`, `patch`, `exec`, etc.) — this is an investigation tool, not a remediation tool.

#### Commands you'll use constantly:

**Check pod health (the first thing to run in any incident):**
```
get pods -n otel-demo
```
Look at the STATUS and RESTARTS columns. `CrashLoopBackOff`, `OOMKilled`, or `0/1 Running` are immediate red flags.

**Get more detail on a sick pod:**
```
describe pod -n otel-demo -l app.kubernetes.io/component=cartservice
```
Scroll to the Events section at the bottom — it tells you *why* a pod is failing.

**Check resource consumption:**
```
top pods -n otel-demo --sort-by=cpu
```
Spot which pods are CPU-starved or memory-bloated.

**Tail recent logs from a crashing service:**
```
logs -n otel-demo -l app.kubernetes.io/component=checkoutservice --tail 50
```
Add `--previous` to see logs from the *last* container (useful for OOMKilled pods that already restarted):
```
logs -n otel-demo -l app.kubernetes.io/component=cartservice --previous --tail 30
```

**Check deployment config (resource limits, env vars):**
```
get deployment -n otel-demo otel-demo-checkoutservice -o yaml
```
Pipe-dream: use `-o jsonpath` to extract just what you need:
```
get deployment -n otel-demo otel-demo-frontend -o jsonpath='{.spec.template.spec.containers[0].resources}'
```

**List events sorted by time (cluster-wide view of recent trouble):**
```
events -n otel-demo --sort-by=.lastTimestamp
```

**Check if the OTel Collector is healthy (for observability-gap scenarios):**
```
logs -n otel-demo -l app.kubernetes.io/component=otelcol --tail 30
```
Look for "dropping spans" or "queue full" messages.

Tips:
- Output is auto-limited to 200 lines for logs (no `--tail` needed unless you want fewer).
- Use `↑`/`↓` to cycle through command history.
- Commands time out after 15 seconds — if `top pods` hangs, the metrics-server might be overloaded.

---

### Costs (`C`)

See what this session is costing — AWS infrastructure (EKS, EC2, CloudWatch) plus LLM token usage with per-model pricing.

![Costs modal with breakdown](screenshots/20-costs.png)

### Exit

Panicking? Hit **Exit** in the header. The game auto-remediates any active chaos and resets to idle. No judgment.

---

## Difficulty Ladder

Scenarios get progressively nastier:

| Tier | What you're dealing with |
|------|-------------------------|
| **Easy** | One thing broke. Symptoms are obvious. One service affected. |
| **Medium** | Cause and symptoms are in different services. Requires inspecting env vars or configs. |
| **Hard** | Multiple simultaneous faults. Fixing one still leaves the system broken. Silent failures with no error signals. |
| **Expert** | Your observability tools are the thing that's broken. Faults evolve mid-investigation. Noisy alerts hide the real problem. |

### Expert-tier examples:

- **Three-Layer Degradation** — CPU throttle + network partition + feature flag, all at once, each with different symptoms
- **The Red Herring** — A loud, obvious problem (ad service CPU pegged) masks a quiet, critical one (checkout silently can't reach payment)
- **Flying Blind** — The OTel Collector is OOM-ing while a real load spike happens. Your dashboards lie to you.
- **Staggered Kill** — Payment dies, you start investigating, then 30 seconds later cart dies too. The incident evolves under your feet.

---

## Tips

- **Start with RED metrics** — they tell you which service is sick fastest.
- **Check pod status early** — `kubectl get pods` in the kubectl runner reveals kills and OOMKills immediately.
- **Don't tunnel-vision** — multi-fault scenarios require you to check the whole system, not just the first alert.
- **Zero telemetry ≠ zero traffic** — if a service shows nothing in dashboards but the pod is Running, the observability pipeline might be broken.
- **Silent data loss is real** — cart service returning 200 OK doesn't mean your data is safe (looking at you, Valkey evictions).
- **Fix the collector first** — if traces have gaps or metrics are sparse, fix your telemetry before diagnosing the app.

---

Happy breaking! 🔥

# Observe an NVIDIA AI-Q agent in Amazon CloudWatch

Send an [NVIDIA AI-Q](https://github.com/NVIDIA-AI-Blueprints/aiq) deep-research agent's telemetry — traces,
metrics, and logs — to Amazon CloudWatch **without changing a line of the agent's code**. The agent runs
[NVIDIA Nemotron](https://www.nvidia.com/en-us/ai-data-science/foundation-models/nemotron/) 3 Super on
[Amazon Bedrock](https://aws.amazon.com/bedrock/).

You do not need to have run anything else first. `setup.sh` builds the agent, its Python environment, and the
CloudWatch prerequisites from nothing.

## What you get

| Signal | Path to CloudWatch | Where it lands |
|---|---|---|
| Traces | NAT OTel plugin → collector → CloudWatch OTLP traces endpoint | X-Ray + `aws/spans` |
| Metrics | spans → `span_metrics` / `signal_to_metrics` connectors → `awsemf` | `AIQ/Agent` namespace |
| Logs | NAT file logger → `file_log` receiver → CloudWatch OTLP logs endpoint | `/aiq/agent` |

Plus a 13-widget dashboard, `AIQ-Agent-Observability`, covering all three on one page.

Metrics are *derived from the spans in the collector* rather than emitted by the agent. That's the
conventional OpenTelemetry split, and it's what keeps the no-code-changes promise.

## Prerequisites

- An AWS account with Bedrock access to `nvidia.nemotron-super-3-120b` in your region (default `us-west-2`)
- X-Ray Transaction Search enabled
- An [Amazon Bedrock API key](https://docs.aws.amazon.com/bedrock/latest/userguide/api-keys-generate.html) —
  the agent talks to Bedrock's OpenAI-compatible endpoint with bearer-token auth. **These expire**; a stale one
  is the most likely reason a previously working run starts failing
- A free [Tavily](https://app.tavily.com) API key — the agent's web-search tool. `setup.sh` validates it,
  because a bad key otherwise surfaces much later as an opaque mid-run agent failure
- `git`, `curl`, `python3`, and the AWS CLI. `uv` is installed for you if absent

## Run it

```bash
export AWS_PROFILE=your-profile          # or configure credentials however you like
./scripts/all.sh
```

About 20 minutes, most of it the agent actually working. `all.sh` runs the four steps in order and stops at
the first one that fails:

1. `setup.sh` — build the agent env, create the log group/stream, verify Bedrock and Transaction Search
2. `run-collector.sh` — start the collector (all three pipelines)
3. `loadgen.sh` — send a mix of cheap, medium, and expensive queries
4. `create-dashboard.sh` — build the dashboard

The order matters: `create-dashboard.sh` discovers which agents to break out by reading the metrics that
already exist, so running it before any traffic gives you a page of empty widgets — which looks exactly like a
broken dashboard.

```bash
./scripts/all.sh --dry-run             # print the plan, run nothing
./scripts/all.sh --queries 20          # more traffic
./scripts/all.sh --skip-setup          # env already built
./scripts/all.sh --stop-collector      # stop the collector when done
```

Every script takes `--help`. Run them individually if you want to watch each signal appear on its own.

Tear it all down with `./scripts/cleanup.sh` 

## How the telemetry flows

```
AI-Q agent on Nemotron (Bedrock)
   │  NeMo Agent Toolkit emits OpenTelemetry (otelcollector exporter)
   ▼
localhost:4318  →  otelcol-contrib (SigV4 auth)
   ├── traces  ───────────────────────────→ CloudWatch OTLP traces endpoint → X-Ray, aws/spans
   ├── metrics ← derived from those spans →  awsemf (EMF) ────────────────→ AIQ/Agent namespace
   └── logs    ───────────────────────────→ CloudWatch OTLP logs endpoint  → /aiq/agent
```


## Files

```
configs/config_web_only_otel.yml     agent config — telemetry block only; the agent itself is untouched
collector/collector-full.yaml        all three pipelines. The reusable artifact.
scripts/all.sh                       run everything, in order
scripts/setup.sh                     agent env + CloudWatch prerequisites (idempotent)
scripts/get-collector.sh             download otelcol-contrib for this platform
scripts/run-collector.sh             start the collector in the background
scripts/stop-collector.sh            stop it, and sweep orphans holding 4318/8888
scripts/loadgen.sh                   traffic: 3 query shapes, weighted and interleaved
scripts/create-dashboard.sh          build the dashboard (agents auto-discovered from metrics)
scripts/cleanup.sh                   tear down the AWS resources and local state
scripts/load-env.sh                  shared .env loader (sourced, not run)
```

`setup.sh` creates an `agent/` directory here for the AI-Q checkout and its venv (~1.2 GB, gitignored), and
downloads the collector binary into `bin/` (~352 MB, also gitignored). `cleanup.sh` removes both.


## License

This project is licensed under the MIT-0 License. See [LICENSE](LICENSE).

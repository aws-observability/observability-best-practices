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
- **X-Ray Transaction Search enabled** — a hard requirement of the OTLP traces endpoint, which rejects spans
  without it. `setup.sh` checks and tells you how to turn it on; it does not enable it for you, because it is
  an account-wide setting with billing implications
- An [Amazon Bedrock API key](https://docs.aws.amazon.com/bedrock/latest/userguide/api-keys-generate.html) —
  the agent talks to Bedrock's OpenAI-compatible endpoint with bearer-token auth. **These expire**; a stale one
  is the most likely reason a previously working run starts failing
- A free [Tavily](https://app.tavily.com) API key — the agent's web-search tool. `setup.sh` validates it,
  because a bad key otherwise surfaces much later as an opaque mid-run agent failure
- `git`, `curl`, `python3`, and the AWS CLI. `uv` is installed for you if absent

No Serper key is needed. The observability config uses only Tavily; Serper belongs to NVIDIA's paper-search
lab, which is out of scope here.

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

Tear it all down with `./scripts/cleanup.sh` (`--dry-run` first to see the manifest). It is explicit about the
three things it deliberately cannot undo.

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

The only change on the agent side is the `general.telemetry.tracing` block in
`configs/config_web_only_otel.yml`, which points NAT at the local collector.

## Files

```
configs/config_web_only_otel.yml     agent config — telemetry block only; the agent itself is untouched
collector/collector-full.yaml        all three pipelines. The reusable artifact.
collector/collector-traces.yaml      traces only, for bringing up the first signal on its own
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

If you're instrumenting a different OpenTelemetry-based agent, `collector/collector-full.yaml` is the file to
take. Only the span attribute names in it are AI-Q-specific.

## Notes

- **The collector is upstream `otelcol-contrib`, not ADOT** — and that is a requirement, not a preference.
  **ADOT registers no connectors at all**, so `span_metrics` and `signal_to_metrics` cannot be configured
  there, and this design derives metrics from spans. The `transform` processor that strips ANSI escapes is
  also absent. ADOT does ship `sigv4auth`, `awsemf`, and `filelog`, so it would serve the traces and logs
  pipelines on its own. Contrib also registers components with underscore names — `otlp_http`, `file_log`,
  `span_metrics`, `signal_to_metrics`, `sigv4auth` — and the camelCase spellings in the upstream docs do not
  resolve here. Check any distro with `./bin/otelcol-contrib components` before assuming a name works.
- **Metrics reach CloudWatch as EMF rather than via an OTLP metrics endpoint.** CloudWatch does have a public
  OTLP metrics endpoint; it requires delta data points carrying start timestamps, which these connectors do
  not provide.
- **`.env` holds your API keys.** `setup.sh` writes it `0600` and it's gitignored. Don't commit it, and don't
  paste it into an issue. Note that gitignore does not protect against `zip -r`.
- **Costs.** CloudWatch Logs ingestion, custom metrics, and Bedrock tokens. A deep query is genuinely
  expensive — one measured run made 278 LLM calls totalling 6.26M tokens.
- Log groups get 7-day retention by default (`LOG_RETENTION_DAYS`).

## Relationship to NVIDIA's workshop

If you've seen NVIDIA's *Build Agentic AI Applications with NVIDIA Nemotron on Amazon Bedrock* workshop, this
is a standalone companion, not a continuation. That workshop ends where the agent runs; this starts there. It's
where the agent and the query shapes come from, but nothing here depends on having done it — and if you already
have its checkout, point `AGENT_DIR` at it to reuse the venv. That workshop is a separate upstream project
under its own license and is not included in this repository.

## License

This project is licensed under the MIT-0 License. See [LICENSE](LICENSE).

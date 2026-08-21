---
title: Coding Agents Observability
sidebar_label: Coding Agents
---

import RelatedEvents from '@site/src/components/RelatedEvents';

# Coding Agents Observability

## Related Events

<RelatedEvents topics={["ai-ml"]} />


## Overview

AI coding agents (Claude Code, OpenAI Codex, GitHub Copilot) run on developer laptops outside AWS, making traditional CloudWatch instrumentation impractical. Each of these agents ships a built-in OpenTelemetry SDK that can export metrics directly to the CloudWatch OTLP endpoint using bearer-token authentication — no collectors, sidecars, or AWS SDK required on developer machines.

This solution configures all three agents to send usage metrics (tokens, sessions, cost, tool calls, latency) to CloudWatch, where PromQL dashboards and alarms provide per-developer, per-team, and organizational-level visibility. The same data is queryable from Amazon Managed Grafana via the CloudWatch PromQL data source.

The pattern is consistent across agents: create a CloudWatch metrics API key (bearer token), configure the agent's OTel environment variables or config file, set resource attributes for team attribution, then deploy a pre-built dashboard.

**Cost:** CloudWatch OTLP metrics ingestion is billed at $0.50/GB. For a 200-developer organization (~20 sessions/day per developer), the metric volume is on the order of tens of MB/month — well under $5/month for ingestion. Claude Code's worked example (7 metrics × 450 bytes/point × 200 developers × 20 sessions/day × 22 days) yields ~0.27 GB/month, roughly $0.14/month in the base case. PromQL queries in the Console are free. See the [Amazon CloudWatch Pricing page](https://aws.amazon.com/cloudwatch/pricing/) for the latest rates.

## Prerequisites

- An AWS account with permissions to create IAM users and CloudWatch resources
- AWS CLI v2 installed and configured
- At least one coding agent installed:
  - **Claude Code** — CLI authenticated to Anthropic API or Amazon Bedrock. For enterprise rollouts with corporate SSO/IdP federation (Okta, Azure AD, Auth0, Amazon Cognito, AWS IAM Identity Center) and OIDC credential federation, see the [Claude Apps Gateway](https://github.com/aws-samples/anthropic-on-aws/tree/main/claude-apps-gateway).
  - **OpenAI Codex** — CLI authenticated via `codex login` or Amazon Bedrock (`model_provider = "amazon-bedrock"` in `~/.codex/config.toml`)
  - **GitHub Copilot** — VS Code extension signed in, or Copilot CLI authenticated
- IAM permissions: `iam:CreateUser`, `iam:AttachUserPolicy`, `iam:CreateServiceSpecificCredential`, `cloudwatch:PutDashboard`

## Architecture

```
┌──────────────────────────────────────────────────────────────────┐
│                    Developer Laptops                              │
│                                                                  │
│  ┌─────────────┐   ┌─────────────┐   ┌─────────────────────┐   │
│  │ Claude Code │   │ OpenAI Codex│   │ GitHub Copilot      │   │
│  │ (OTel SDK)  │   │ (OTel SDK)  │   │ (VS Code / CLI)     │   │
│  └──────┬──────┘   └──────┬──────┘   └──────────┬──────────┘   │
│         │                  │                      │              │
└─────────┼──────────────────┼──────────────────────┼──────────────┘
          │ HTTPS + Bearer   │ HTTPS + Bearer       │ HTTPS + Bearer
          │ /v1/metrics      │ /v1/metrics          │ /v1/metrics
          └──────────────────┼──────────────────────┘
                             ▼
              ┌──────────────────────────────┐
              │  CloudWatch OTLP Endpoint    │
              │  monitoring.<region>.aws.com │
              └──────────────┬───────────────┘
                             │
              ┌──────────────┼──────────────┐
              ▼              ▼              ▼
     ┌──────────────┐ ┌───────────┐ ┌───────────────┐
     │  CloudWatch  │ │    AMP    │ │     AMG       │
     │  Dashboards  │ │ (PromQL)  │ │  (Grafana)    │
     │  + Alarms    │ │           │ │               │
     └──────────────┘ └───────────┘ └───────────────┘
```

## Deploy

### Step 1: Create a bearer token (once per team)

Bearer tokens allow tools running outside AWS to send metrics to CloudWatch without IAM credential chains. Each token is tied to an IAM user scoped to the [CloudWatchAPIKeyAccess](https://docs.aws.amazon.com/aws-managed-policy/latest/reference/CloudWatchAPIKeyAccess.html) managed policy.

```bash
aws iam create-user --user-name coding-agents-cw-metrics

aws iam attach-user-policy \
  --user-name coding-agents-cw-metrics \
  --policy-arn arn:aws:iam::aws:policy/CloudWatchAPIKeyAccess

aws iam create-service-specific-credential \
  --user-name coding-agents-cw-metrics \
  --service-name cloudwatch.amazonaws.com \
  --credential-age-days 90
```

Store the `ServiceCredentialSecret` value in AWS Secrets Manager or your vault. Never commit it to version control.

### Step 2: Configure Claude Code

```bash
BEARER_TOKEN=$(aws secretsmanager get-secret-value \
  --secret-id cloudwatch-otlp-bearer-token --query SecretString --output text)

export CLAUDE_CODE_ENABLE_TELEMETRY=1
export OTEL_METRICS_EXPORTER=otlp
export OTEL_EXPORTER_OTLP_PROTOCOL=http/json
export OTEL_EXPORTER_OTLP_ENDPOINT="https://monitoring.us-east-1.amazonaws.com"
export OTEL_EXPORTER_OTLP_HEADERS="Authorization=Bearer ${BEARER_TOKEN}"
export OTEL_METRIC_EXPORT_INTERVAL=2000
export OTEL_RESOURCE_ATTRIBUTES="user.id=$(whoami),user.email=${USER_EMAIL},team.id=${TEAM:-engineering},cost_center=${COST_CENTER:-default},department=${DEPARTMENT:-engineering},environment=${ENV:-dev}"
```

`OTEL_METRIC_EXPORT_INTERVAL=2000` (2 seconds) makes metrics appear quickly during verification. For steady-state fleet use, raise toward the 60000 ms default.

Claude Code can also export events as OpenTelemetry logs. To capture them, additionally set `export OTEL_LOGS_EXPORTER=otlp`.

### Step 3: Configure OpenAI Codex

Add to `~/.codex/config.toml`:

```toml
[otel]

[otel.metrics_exporter.otlp-http]
endpoint = "https://monitoring.us-east-1.amazonaws.com/v1/metrics"
protocol = "binary"

[otel.metrics_exporter.otlp-http.headers]
"Authorization" = "Bearer <YOUR_BEARER_TOKEN>"
```

Paste the **literal token value** — Codex does not expand environment-variable references in TOML headers. Restrict permissions: `chmod 600 ~/.codex/config.toml`.

Set attribution in your shell:

```bash
export OTEL_RESOURCE_ATTRIBUTES="user.id=$(whoami),user.email=${USER_EMAIL},team.id=${TEAM:-engineering},cost_center=${COST_CENTER:-default},department=${DEPARTMENT:-engineering},environment=${ENV:-dev}"
```

### Step 4: Configure GitHub Copilot

There are **two** Copilot products that emit OpenTelemetry with different metric sets:

| | VS Code Copilot Chat extension | GitHub Copilot CLI |
| --- | --- | --- |
| `service.name` | `copilot-chat` | `github-copilot` |
| Tool metric prefix | `copilot_chat.tool.call.*` | `github.copilot.tool.call.*` |
| Default OTLP protocol | `http/protobuf` | `http/json` |

Set common environment variables first (in the shell that launches the client):

```bash
export OTEL_EXPORTER_OTLP_HEADERS="Authorization=Bearer <YOUR_BEARER_TOKEN>"
export OTEL_RESOURCE_ATTRIBUTES="user.id=$(whoami),user.email=${USER_EMAIL},team.id=${TEAM:-engineering},cost_center=${COST_CENTER:-default},department=${DEPARTMENT:-engineering},environment=${ENV:-dev}"
```

**VS Code Copilot Chat extension** — enable OTel in `settings.json` (the auth header must come from the environment variable):

```json
{
  "github.copilot.chat.otel.enabled": true,
  "github.copilot.chat.otel.otlpEndpoint": "https://monitoring.<AWS_REGION>.amazonaws.com",
  "github.copilot.chat.otel.exporterType": "otlp-http"
}
```

Then launch VS Code from the shell with variables set: `code .`

**GitHub Copilot CLI** — configured entirely through environment variables:

```bash
export OTEL_EXPORTER_OTLP_ENDPOINT="https://monitoring.<AWS_REGION>.amazonaws.com"
export OTEL_EXPORTER_OTLP_PROTOCOL="http/json"
copilot
```

To inspect raw metric emissions, set `COPILOT_OTEL_FILE_EXPORTER_PATH` to a local file path, or use `"github.copilot.chat.otel.exporterType": "console"` in VS Code.

### Step 5: Deploy CloudWatch dashboards

```bash
# Claude Code
curl -o claude-code-dashboard.json \
  https://raw.githubusercontent.com/aws-observability/aws-observability-accelerator/main/artifacts/cloudwatch-dashboards/claude-code/claude-code.json
aws cloudwatch put-dashboard --dashboard-name ClaudeCodeDashboard \
  --dashboard-body file://claude-code-dashboard.json --region us-east-1

# Codex
curl -o codex-dashboard.json \
  https://raw.githubusercontent.com/aws-observability/aws-observability-accelerator/main/artifacts/cloudwatch-dashboards/codex/codex.json
aws cloudwatch put-dashboard --dashboard-name CodexDashboard \
  --dashboard-body file://codex-dashboard.json --region us-east-1

# Copilot
curl -o copilot-dashboard.json \
  https://raw.githubusercontent.com/aws-observability/aws-observability-accelerator/main/artifacts/cloudwatch-dashboards/copilot/copilot.json
aws cloudwatch put-dashboard --dashboard-name CopilotDashboard \
  --dashboard-body file://copilot-dashboard.json --region us-east-1
```

### Step 6: Deploy Grafana dashboards

If your organization uses Amazon Managed Grafana (or self-managed Grafana), import the equivalent Grafana JSON for each agent. Each uses the same PromQL against an [Amazon Managed Service for Prometheus data source pointed at the CloudWatch PromQL endpoint](https://docs.aws.amazon.com/grafana/latest/userguide/cloudwatch-promql.html) (set the SigV4 **Service** to `monitoring`). Select that data source for the dashboard's `datasource` variable on import.

```bash
# Claude Code
curl -o claude-code-grafana.json \
  https://raw.githubusercontent.com/aws-observability/aws-observability-accelerator/main/artifacts/grafana-dashboards/claude-code/claude-code.json

# Codex
curl -o codex-grafana.json \
  https://raw.githubusercontent.com/aws-observability/aws-observability-accelerator/main/artifacts/grafana-dashboards/codex/codex.json

# Copilot
curl -o copilot-grafana.json \
  https://raw.githubusercontent.com/aws-observability/aws-observability-accelerator/main/artifacts/grafana-dashboards/copilot/copilot.json
```

## Validate

1. **Claude Code** — run a short session and query:
   ```bash
   claude -p "hello" --max-turns 1
   # Then in CloudWatch Query Studio:
   # sum({"claude_code.token.usage"})
   ```

2. **Codex** — run a one-shot command:
   ```bash
   codex exec "print hello world in python"
   # Query: sum({"codex.turn.token_usage"})
   ```

3. **Copilot** — open VS Code, send a chat prompt, then query:
   ```
   sum(histogram_sum({"gen_ai.client.token.usage", "@resource.service.name"=~"copilot.*"}))
   ```

Metrics take 2–5 minutes to appear. Verify resource attributes with `cwpromql series '{"claude_code.token.usage"}' -o json` or in CloudWatch Query Studio.

### Metrics emitted

#### Claude Code

| Metric | Type | Description |
| --- | --- | --- |
| `claude_code.token.usage` | Counter | Tokens consumed; attribute `type` ∈ `input`, `output`, `cacheRead`, `cacheCreation`, plus `model` |
| `claude_code.cost.usage` | Counter | Estimated cost in USD; attribute `model` |
| `claude_code.session.count` | Counter | CLI sessions started |
| `claude_code.lines_of_code.count` | Counter | Lines of code modified; attribute `type` ∈ `added`, `removed` |
| `claude_code.commit.count` | Counter | Git commits created by Claude Code |
| `claude_code.pull_request.count` | Counter | Pull requests created by Claude Code |
| `claude_code.code_edit_tool.decision` | Counter | Edit-tool permission decisions; attributes `tool`, `decision` ∈ `accept`, `reject` |
| `claude_code.active_time.total` | Counter | Total active developer time in seconds |

Claude Code is the only agent that emits a cost metric (`claude_code.cost.usage`), so dashboards chart estimated spend directly.

#### OpenAI Codex

| Metric | Type | Description |
| --- | --- | --- |
| `codex.turn.token_usage` | Histogram | Token usage; attribute `token_type` ∈ `input`, `output`, `cached_input`, `reasoning_output`, plus `model` |
| `codex.api_request` | Counter | Model API request count; attributes `model`, `success`, `status` |
| `codex.api_request.duration_ms` | Histogram | API request latency |
| `codex.tool.call` | Counter | Tool invocation count; attributes `tool`, `success` |
| `codex.tool.call.duration_ms` | Histogram | Tool execution latency |
| `codex.approval.requested` | Counter | Approval prompts and their `decision` |
| `codex.conversation.turn.count` | Counter | Conversation turns; attribute `model` |
| `codex.turn.e2e_duration_ms` | Histogram | End-to-end turn latency |
| `codex.thread.started` | Counter | Threads/sessions started |

Codex does not emit a cost metric. Multiply token counts by model pricing downstream if needed.

#### GitHub Copilot

There are two clients with different metric sets. The dashboards match both via `@resource.service.name=~"copilot.*"` and union the two tool-metric names.

| Metric | Type | Source | Notes |
| --- | --- | --- | --- |
| `gen_ai.client.token.usage` | Histogram | both | Token counts; `gen_ai.token.type` ∈ `input`, `output`; `gen_ai.request.model`. Query totals with `sum(histogram_sum(...))`. |
| `gen_ai.client.operation.duration` | Histogram | both | LLM call duration (seconds); `gen_ai.request.model`, `error.type` |
| `copilot_chat.tool.call.count` / `github.copilot.tool.call.count` | Counter | VS Code / CLI | Tool invocations; `gen_ai.tool.name`, success |
| `copilot_chat.tool.call.duration` / `github.copilot.tool.call.duration` | Histogram | VS Code / CLI | Tool execution latency |
| `copilot_chat.agent.turn.count` / `github.copilot.agent.turn.count` | Histogram | VS Code / CLI | LLM round-trips per agent invocation |
| `copilot_chat.time_to_first_token` | Histogram | VS Code | Time to first SSE token (seconds) |
| `copilot_chat.agent.invocation.duration` | Histogram | VS Code | Agent end-to-end duration (seconds) |
| `copilot_chat.session.count` | Counter | VS Code | Chat sessions started |
| `copilot_chat.lines_of_code.count` | Counter | VS Code | Lines added or removed by accepted edits |
| `copilot_chat.edit.acceptance.count` | Counter | VS Code | Edit accept/reject decisions |
| `copilot_chat.user.feedback.count` | Counter | VS Code | Thumbs up/down votes |
| `copilot_chat.user.action.count` | Counter | VS Code | Engagement actions (copy, insert, apply, followup) |
| `copilot_chat.pull_request.count` | Counter | VS Code | Pull requests created |

The GitHub Copilot CLI emits only the first five rows. The remaining `copilot_chat.*` metrics are VS Code-extension-only. Copilot does not emit a dollar-cost metric.

Copilot metrics carry these datapoint attributes, which are what you group and
filter by when building panels or alarms: `gen_ai.request.model`,
`gen_ai.provider.name`, `gen_ai.tool.name`, `copilot_chat.edit.source`, and
`error.type`.

## Alerting

Every dashboard panel is backed by a PromQL query. Create an alarm from any panel via **View in Query Studio** > **Create alarm**. Examples by agent:

### Claude Code

**Individual spend spike** — alert when a developer's hourly spend exceeds twice their 24-hour average:

```
sum by ("@resource.user.email") (increase({"claude_code.cost.usage"}[1h]))
> 2 * avg_over_time(sum by ("@resource.user.email") (increase({"claude_code.cost.usage"}[1h]))[24h:1h])
```

**Team budget threshold** — alert when a team's daily cost exceeds a budget (USD):

```
sum by ("@resource.team.id") (increase({"claude_code.cost.usage"}[24h])) > 500
```

**Adoption regression** — detect when a team's daily sessions drop below half their 7-day average:

```
sum by ("@resource.team.id") (increase({"claude_code.session.count"}[24h]))
< 0.5 * avg_over_time(sum by ("@resource.team.id") (increase({"claude_code.session.count"}[1h]))[7d:1d])
```

### OpenAI Codex

**Team token-usage threshold**:

```
sum by ("@resource.team.id") (increase({"codex.turn.token_usage"}[24h])) > 5000000
```

**Elevated API error rate**:

```
sum(increase({"codex.api_request", success="false"}[1h])) > 50
```

**Latency regression** — p90 turn latency exceeds 30s:

```
histogram_quantile(0.9, sum({"codex.turn.e2e_duration_ms"})) > 30000
```

**Adoption regression**:

```
sum by ("@resource.team.id") (increase({"codex.thread.started"}[24h]))
< 0.5 * avg_over_time(sum by ("@resource.team.id") (increase({"codex.thread.started"}[1h]))[7d:1d])
```

### GitHub Copilot

**Team token-usage threshold**:

```
sum by ("@resource.team.id") (increase(histogram_sum({"gen_ai.client.token.usage"})[24h])) > 5000000
```

**LLM latency regression** — p90 operation duration exceeds 30s:

```
histogram_quantile(0.9, sum({"gen_ai.client.operation.duration"})) > 30
```

**Adoption regression**:

```
sum by ("@resource.team.id") (increase({"copilot_chat.session.count"}[24h]))
< 0.5 * avg_over_time(sum by ("@resource.team.id") (increase({"copilot_chat.session.count"}[1h]))[7d:1d])
```

## Troubleshoot

| Symptom | Likely Cause | Fix |
|---------|-------------|-----|
| No metrics after 5 min (any agent) | Bearer token invalid or endpoint URL wrong | Verify token is the literal `ServiceCredentialSecret` value; confirm endpoint is `https://monitoring.<REGION>.amazonaws.com` |
| Codex config ignored | `~/.codex/config.toml` syntax error or env-var reference in header | Paste the literal token value (Codex does not expand `${VAR}` in TOML); run `chmod 600 ~/.codex/config.toml` |
| Copilot metrics missing in CloudWatch | `OTEL_EXPORTER_OTLP_HEADERS` not set in the shell that launched VS Code | Export the variable first, then run `code .` from that shell; VS Code does not pick up headers from settings.json |
| Resource attributes (`@resource.team.id`) empty | `OTEL_RESOURCE_ATTRIBUTES` unset or malformed | Ensure the variable is exported in the shell profile that launches the agent; no spaces around `=` in values |
| Dashboard shows "No Data" for Grafana panels | Data source not pointed at CloudWatch PromQL endpoint | In AMG, set the Prometheus data source URL to `https://monitoring.<REGION>.amazonaws.com` with SigV4 service `monitoring` |
| Copilot CLI export errors for traces/logs | CLI sends all signals to the same endpoint; non-metrics POSTs are rejected | Harmless — metrics still flow. To suppress, run a local OTel Collector and route each signal separately |

## Related Solutions

- [GenAI Workload Observability](../genai-observability/) — Bedrock/SageMaker model invocation monitoring and agent trace observability

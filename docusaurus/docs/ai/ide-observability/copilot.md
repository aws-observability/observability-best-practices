---
sidebar_position: 2
title: GitHub Copilot
---

# Analyzing GitHub Copilot Usage with CloudWatch and OpenTelemetry

:::note
There are **two** Copilot products that emit OpenTelemetry, and they emit *different* metrics. This recipe and its dashboards cover **both**:

| | VS Code Copilot Chat extension | GitHub Copilot CLI |
| --- | --- | --- |
| `service.name` | `copilot-chat` | `github-copilot` |
| Tool metric prefix | `copilot_chat.tool.call.*` | `github.copilot.tool.call.*` |
| Default OTLP protocol | `http/protobuf` | `http/json` |
| Metric breadth | ~20 metrics | 5 metrics (tokens, LLM duration, tool count/duration, agent turns) |

The dashboards match either product with `@resource.service.name=~"copilot.*"` and union the two tool-metric names. Both share `gen_ai.client.token.usage` and `gen_ai.client.operation.duration` (OTel GenAI semantic conventions). Panels that only the VS Code extension emits (sessions, edits, feedback, lines of code, PRs, time-to-first-token) are labelled **(VS Code)**. Metric names come from the official [VS Code monitoring guide](https://code.visualstudio.com/docs/copilot/guides/monitoring-agents), the GitHub Copilot CLI's own `copilot help monitoring`, and the [OTel GenAI semantic conventions](https://github.com/open-telemetry/semantic-conventions-genai). Some per-metric **breakdown attribute keys** (e.g. accepted vs rejected edits) are not published — those panels show totals (see [Metrics Copilot emits](#metrics-copilot-emits)).
:::

## Bearer token authentication

Bearer tokens (CloudWatch metrics API keys) allow tools running outside AWS (like Copilot on developer laptops) to send metrics to CloudWatch without requiring the AWS SDK or IAM credential chains. Each token is tied to an AWS IAM user scoped exclusively to the [CloudWatchAPIKeyAccess](https://docs.aws.amazon.com/aws-managed-policy/latest/reference/CloudWatchAPIKeyAccess.html) managed policy.

:::warning
Bearer tokens are long-term credentials. This recipe uses them because AI coding agents run on developer laptops outside of AWS, where SigV4 with short-term credentials would require a central collector or a per-machine collector process. For workloads running inside AWS where SigV4 with short-term credentials is feasible, prefer that approach for a stronger security posture. The CloudWatch OTLP endpoint requires HTTPS; requests over plain HTTP are rejected. For more information, see [CloudWatch OTLP Metrics Bearer Token Auth](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-OTLP-MetricsBearerTokenAuth.html).
:::

## Solution overview

The setup has three components:

1. **A CloudWatch metrics API key** — a bearer token tied to a narrowly-scoped IAM user. Created once per developer (or shared per team).
2. **Copilot configuration** — VS Code settings plus environment variables that tell Copilot's OpenTelemetry SDK where to send metrics and how to attribute them.
3. **A pre-built dashboard** — a CloudWatch dashboard (and a Grafana equivalent) that visualizes token usage, latency, tool and developer activity, and team-level usage with PromQL queries.

## Prerequisites

* An AWS account with permissions to create CloudWatch and IAM resources.
* AWS CLI v2 installed and configured.
* One (or both) Copilot client: VS Code with the GitHub Copilot Chat extension signed in to Copilot, and/or the GitHub Copilot CLI authenticated (`copilot` then `/login`, or a `GITHUB_TOKEN`).
* A CloudWatch metrics API key (created below).

## Create a bearer token

You can create the token in the CloudWatch console (**Settings** > scroll to **API keys** > **Create**) or with the CLI:

```bash
# Create an IAM user for CloudWatch metrics ingestion
aws iam create-user --user-name copilot-cloudwatch-metrics-user

# Attach the CloudWatchAPIKeyAccess managed policy
aws iam attach-user-policy \
    --user-name copilot-cloudwatch-metrics-user \
    --policy-arn arn:aws:iam::aws:policy/CloudWatchAPIKeyAccess

# Create a service-specific credential (the bearer token), expiring in 90 days
aws iam create-service-specific-credential \
    --user-name copilot-cloudwatch-metrics-user \
    --service-name cloudwatch.amazonaws.com \
    --credential-age-days 90
```

The response includes a `ServiceCredentialSecret` field — this is your bearer token value. Store it securely in [AWS Secrets Manager](https://docs.aws.amazon.com/secretsmanager/latest/userguide/intro.html) or your organization's vault. Never commit it to version control.

## Configure Copilot

Configure whichever client(s) you use. Both honor `OTEL_RESOURCE_ATTRIBUTES` (for attribution) and `OTEL_EXPORTER_OTLP_HEADERS` (for the bearer token). Replace `<AWS_REGION>` (for example `us-east-1`) and `<YOUR_BEARER_TOKEN>` (the `ServiceCredentialSecret` value) throughout.

Set these common environment variables first — define them in the shell that launches the client:

```bash
export OTEL_EXPORTER_OTLP_HEADERS="Authorization=Bearer <YOUR_BEARER_TOKEN>"
export OTEL_RESOURCE_ATTRIBUTES="user.id=$(whoami),user.email=${USER_EMAIL},team.id=${TEAM:-engineering},cost_center=${COST_CENTER:-default},department=${DEPARTMENT:-engineering},environment=${ENV:-dev}"
```

### VS Code Copilot Chat extension

Enable OTel in `settings.json` (the **auth header must come from the environment** — the VS Code docs state: *"Authentication headers for remote collectors are only configurable through the `OTEL_EXPORTER_OTLP_HEADERS` environment variable"*):

```json
{
  "github.copilot.chat.otel.enabled": true,
  "github.copilot.chat.otel.otlpEndpoint": "https://monitoring.<AWS_REGION>.amazonaws.com",
  "github.copilot.chat.otel.exporterType": "otlp-http"
}
```

Then launch VS Code from the shell that has the variables set: `code .`. The default OTLP protocol is `http/protobuf`, which the CloudWatch endpoint accepts. `service.name` defaults to `copilot-chat`.

### GitHub Copilot CLI

The CLI is configured entirely through environment variables (run `copilot help monitoring` for the full reference). Setting the endpoint auto-enables OTel:

```bash
export OTEL_EXPORTER_OTLP_ENDPOINT="https://monitoring.<AWS_REGION>.amazonaws.com"
export OTEL_EXPORTER_OTLP_PROTOCOL="http/json"   # CLI default; CloudWatch accepts json and protobuf
# OTEL_EXPORTER_OTLP_HEADERS + OTEL_RESOURCE_ATTRIBUTES from the common block above
copilot
```

`service.name` defaults to `github-copilot`. The CLI emits a smaller metric set (see the table below); the dashboards already account for both naming schemes.

:::warning
Both clients send **traces, metrics, and events to the same endpoint** — there is no documented metrics-only mode. The CloudWatch metrics endpoint (`/v1/metrics`) ingests the metrics; the trace and log POSTs to that host are simply rejected and dropped, which is harmless but means you will see client-side export errors for the non-metrics signals. To capture traces/logs too, or to cleanly separate signals, run a local OpenTelemetry Collector and route each signal to its matching CloudWatch endpoint instead of pointing the client directly at `/v1/metrics`.
:::

### Identity and team attribution

Copilot honors the standard `OTEL_RESOURCE_ATTRIBUTES` environment variable on its metrics meter provider, attaching the values as **resource attributes** on every metric. These become the PromQL labels the dashboards group by (referenced with the `@resource.` prefix — for example `@resource.team.id`).

| Attribute | PromQL label | Purpose | Example |
| --- | --- | --- | --- |
| `user.id` | `@resource.user.id` | Per-developer attribution | `jdoe` |
| `user.email` | `@resource.user.email` | Per-developer attribution | `jdoe@example.com` |
| `team.id` | `@resource.team.id` | Team-level aggregation | `platform-eng` |
| `cost_center` | `@resource.cost_center` | Finance/chargeback grouping | `CC-4200` |
| `department` | `@resource.department` | Org-level rollup | `engineering` |
| `environment` | `@resource.environment` | Distinguish dev/staging/prod usage | `production` |

## Verify metrics are flowing

Start a Copilot session (a VS Code Chat session, or `copilot` in the configured shell) and send a couple of prompts. Then open [CloudWatch Query Studio](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-PromQL-QueryStudio.html) and type `copilot` or `gen_ai`, or run an instant query such as:

```
sum(histogram_sum({"gen_ai.client.token.usage", "@resource.service.name"=~"copilot.*"}))
```

If metrics appear, the configuration is correct. If not, confirm the endpoint URL, that `OTEL_EXPORTER_OTLP_HEADERS` is set in the shell that launched the client, and that you have completed at least one interaction. CloudWatch ingestion can take a few minutes to become queryable.

### Metrics Copilot emits

The dashboards build on these metrics. The **Source** column shows which client emits each one — the dashboards match both via `@resource.service.name=~"copilot.*"` and union the two tool-metric names.

| Metric | Type | Source | Notes |
| --- | --- | --- | --- |
| `gen_ai.client.token.usage` | Histogram | both | Token counts; `gen_ai.token.type` ∈ `input`, `output`; `gen_ai.request.model`. Query totals with `sum(histogram_sum(...))` — `histogram_sum` alone is per-series, so wrap it in `sum(...)` (or `sum by (...)`) to aggregate. |
| `gen_ai.client.operation.duration` | Histogram | both | LLM call duration (seconds); `gen_ai.request.model`, `error.type`. |
| `copilot_chat.tool.call.count` / `github.copilot.tool.call.count` | Counter | VS Code / CLI | Tool invocations; `gen_ai.tool.name`, success. |
| `copilot_chat.tool.call.duration` / `github.copilot.tool.call.duration` | Histogram | VS Code / CLI | Tool execution latency. |
| `copilot_chat.agent.turn.count` / `github.copilot.agent.turn.count` | Histogram | VS Code / CLI | LLM round-trips per agent invocation. |
| `copilot_chat.time_to_first_token` | Histogram | VS Code | Time to first SSE token (seconds). |
| `copilot_chat.agent.invocation.duration` | Histogram | VS Code | Agent end-to-end duration (seconds). |
| `copilot_chat.session.count` | Counter | VS Code | Chat sessions started. |
| `copilot_chat.lines_of_code.count` | Counter | VS Code | Lines added or removed by accepted edits.¹ |
| `copilot_chat.edit.acceptance.count` | Counter | VS Code | Edit accept/reject decisions.¹ |
| `copilot_chat.user.feedback.count` | Counter | VS Code | Thumbs up/down votes.¹ |
| `copilot_chat.user.action.count` | Counter | VS Code | Engagement actions (copy, insert, apply, followup).¹ |
| `copilot_chat.pull_request.count` | Counter | VS Code | Pull requests created. |

The **GitHub Copilot CLI emits only the first three rows** (`gen_ai.*` plus `github.copilot.tool.call.*` and `github.copilot.agent.turn.count`) — verified via `copilot help monitoring`. The remaining `copilot_chat.*` metrics are VS Code-extension-only, and their panels are labelled **(VS Code)** on the dashboards.

¹ The VS Code docs describe these breakdowns (added/removed, accepted/rejected, up/down) but do **not** publish the attribute keys/values that carry them. The dashboards therefore chart **totals** for these metrics; add the breakdown grouping once you confirm the label names from a real emission (set `"github.copilot.chat.otel.exporterType": "console"` in VS Code, or `COPILOT_OTEL_FILE_EXPORTER_PATH` for the CLI, to inspect them). Confirmed cross-metric filter attributes: `gen_ai.request.model`, `gen_ai.provider.name`, `gen_ai.tool.name`, `copilot_chat.edit.source`, `error.type`.

:::note
Like Claude Code on Amazon Bedrock, Copilot does **not** emit a dollar-cost metric. The dashboards report token consumption; derive cost downstream from token counts and your plan's pricing if needed.
:::

## Sample usage dashboards

### CloudWatch dashboard

Download [copilot-cloudwatch-dashboard.json](https://github.com/aws-observability/terraform-aws-observability-accelerator/blob/main/artifacts/cloudwatch-dashboards/copilot/copilot-cloudwatch-dashboard.json) and deploy it:

```bash
aws cloudwatch put-dashboard \
  --dashboard-name CopilotDashboard \
  --dashboard-body file://copilot-cloudwatch-dashboard.json \
  --region <AWS_REGION>

# Verify
aws cloudwatch list-dashboards --dashboard-name-prefix Copilot --region <AWS_REGION>
```

The dashboard is organized into five sections:

* **Overview** — total tokens, sessions, active users, tool calls.
* **Token Usage** — tokens over time, by type (input / output), by model, and top users.
* **Performance & Latency** — LLM operation duration and time-to-first-token (p50/p90/p99), LLM latency p90 by model, tool-call latency, and agent invocation/turn metrics. Latency panels use CloudWatch's native histogram function over an aggregated selector — `histogram_quantile(0.9, sum({"gen_ai.client.operation.duration"}))` — since OTLP histograms in CloudWatch do not expose classic Prometheus `le` buckets. (Wrap the selector in `sum(...)` so the quantile aggregates across all series instead of one line per user.)
* **Tool & Developer Activity** — tool calls by tool and outcome, lines of code, edit-acceptance, user feedback, and pull requests.
* **Organizational Breakdown** — token usage by department, team, and cost center, and sessions by environment.

### Grafana dashboard

If your organization uses Amazon Managed Grafana (or self-managed Grafana), import [copilot-grafana-dashboard.json](https://github.com/aws-observability/terraform-aws-observability-accelerator/blob/main/artifacts/grafana-dashboards/copilot/copilot-grafana-dashboard.json). It uses the same PromQL against an [Amazon Managed Service for Prometheus data source pointed at the CloudWatch PromQL endpoint](https://docs.aws.amazon.com/grafana/latest/userguide/cloudwatch-promql.html) (set the SigV4 **Service** to `monitoring`). Select that data source for the dashboard's `datasource` variable on import.

## Alerting

Every panel is backed by a PromQL query, so you can create an alarm from any panel via **View in Query Studio** > **Create alarm**. A few examples:

**Team token-usage threshold** — alert when a team's daily token usage exceeds a budget:

```
sum by ("@resource.team.id") (increase(histogram_sum({"gen_ai.client.token.usage"})[24h])) > 5000000
```

**LLM latency regression** — alert when p90 LLM operation duration exceeds 30s:

```
histogram_quantile(0.9, sum({"gen_ai.client.operation.duration"})) > 30
```

**Adoption regression** — detect when a team's daily sessions drop below half their 7-day average:

```
sum by ("@resource.team.id") (increase({"copilot_chat.session.count"}[24h]))
< 0.5 * avg_over_time(sum by ("@resource.team.id") (increase({"copilot_chat.session.count"}[1h]))[7d:1d])
```

## Cost estimate

CloudWatch OTLP metrics ingestion is billed at $0.50/GB. A single OTLP metric data point averages ~300 bytes on the wire. For a 200-developer organization, the metric volume is on the order of tens of MB/month — well under $5/month for ingestion. PromQL queries in the Console are free. See the [Amazon CloudWatch Pricing page](https://aws.amazon.com/cloudwatch/pricing/) for the latest rates.

## Cleanup

:::warning
CloudWatch metrics data persists after you stop telemetry (up to 15 months retention) at no additional charge. CloudWatch alarms, if created, incur $0.10/alarm/month until deleted. Leaving IAM users and bearer tokens active poses a security risk.
:::

```bash
# Delete the dashboard
aws cloudwatch delete-dashboards --dashboard-names CopilotDashboard --region <AWS_REGION>

# Delete the service-specific credential, detach the policy, delete the user
aws iam delete-service-specific-credential --user-name copilot-cloudwatch-metrics-user --service-specific-credential-id <credential-id>
aws iam detach-user-policy --user-name copilot-cloudwatch-metrics-user --policy-arn arn:aws:iam::aws:policy/CloudWatchAPIKeyAccess
aws iam delete-user --user-name copilot-cloudwatch-metrics-user
```

To stop telemetry export, set `"github.copilot.chat.otel.enabled": false` in VS Code settings and unset `OTEL_EXPORTER_OTLP_HEADERS` / `OTEL_RESOURCE_ATTRIBUTES`.

## Resources

* [VS Code: Monitor agent usage with OpenTelemetry](https://code.visualstudio.com/docs/copilot/guides/monitoring-agents)
* [CloudWatch OTLP Metrics Bearer Token Auth](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-OTLP-MetricsBearerTokenAuth.html)
* [Query Amazon CloudWatch metrics using PromQL (Amazon Managed Grafana)](https://docs.aws.amazon.com/grafana/latest/userguide/cloudwatch-promql.html)
* [OpenTelemetry GenAI Semantic Conventions](https://github.com/open-telemetry/semantic-conventions-genai)

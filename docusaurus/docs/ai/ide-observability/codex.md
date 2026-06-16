---
sidebar_position: 3
title: OpenAI Codex
---

# Analyzing OpenAI Codex Usage with CloudWatch and OpenTelemetry

:::note
This guide takes approximately 15 minutes for a single developer. Everything described here was validated against **Codex CLI 0.139.0**. Codex's telemetry is evolving quickly — metric names and configuration keys may differ in other versions, so verify against your installed version (see [Verify metrics are flowing](#verify-metrics-are-flowing)).
:::

## Bearer token authentication

Bearer tokens (CloudWatch metrics API keys) allow tools running outside AWS (like Codex on developer laptops) to send metrics to CloudWatch without requiring the AWS SDK or IAM credential chains. Each token is tied to an AWS IAM user scoped exclusively to the [CloudWatchAPIKeyAccess](https://docs.aws.amazon.com/aws-managed-policy/latest/reference/CloudWatchAPIKeyAccess.html) managed policy.

:::warning
Bearer tokens are long-term credentials. This recipe uses them because AI coding agents run on developer laptops outside of AWS, where SigV4 with short-term credentials would require a central collector or a per-machine collector process. For workloads running inside AWS where SigV4 with short-term credentials is feasible, prefer that approach for a stronger security posture. The CloudWatch OTLP endpoint requires HTTPS; requests over plain HTTP are rejected. For more information, see [CloudWatch OTLP Metrics Bearer Token Auth](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-OTLP-MetricsBearerTokenAuth.html).
:::

## Solution overview

The setup has three components:

1. **A CloudWatch metrics API key** — a bearer token tied to a narrowly-scoped IAM user. Created once per developer (or shared per team).
2. **Codex configuration** — `~/.codex/config.toml` and a couple of environment variables that tell Codex's OpenTelemetry SDK where to send metrics and how to attribute them.
3. **A pre-built dashboard** — a CloudWatch dashboard (and a Grafana equivalent) that visualizes token usage, API and tool activity, and team-level usage with PromQL queries.

## Prerequisites

* An AWS account with permissions to create CloudWatch and IAM resources.
* AWS CLI v2 installed and configured.
* Codex CLI installed and able to reach a model. How you authenticate Codex to the model depends on your model provider and is **independent** of the CloudWatch metrics setup in this recipe:
    * **OpenAI** (default provider) — run `codex login`.
    * **Amazon Bedrock** — do **not** use `codex login`. Authenticate with your AWS credentials (e.g. `export AWS_PROFILE=... AWS_REGION=...`, or any provider in the AWS credential chain) or a Bedrock bearer token via `AWS_BEARER_TOKEN_BEDROCK`, and set `model_provider = "amazon-bedrock"` with `[model_providers.amazon-bedrock.aws] region = "<region>"` in `~/.codex/config.toml`.
* A CloudWatch metrics API key (created below).

## Create a bearer token

You can create the token in the CloudWatch console (**Settings** > scroll to **API keys** > **Create**) or with the CLI:

```bash
# Create an IAM user for CloudWatch metrics ingestion
aws iam create-user --user-name codex-cloudwatch-metrics-user

# Attach the CloudWatchAPIKeyAccess managed policy
aws iam attach-user-policy \
    --user-name codex-cloudwatch-metrics-user \
    --policy-arn arn:aws:iam::aws:policy/CloudWatchAPIKeyAccess

# Create a service-specific credential (the bearer token), expiring in 90 days
aws iam create-service-specific-credential \
    --user-name codex-cloudwatch-metrics-user \
    --service-name cloudwatch.amazonaws.com \
    --credential-age-days 90
```

The response includes a `ServiceCredentialSecret` field — this is your bearer token value. Store it securely in [AWS Secrets Manager](https://docs.aws.amazon.com/secretsmanager/latest/userguide/intro.html) or your organization's vault. Never commit it to version control.

## Configure Codex

Codex is configured through `~/.codex/config.toml`. Add an `[otel]` section that routes **metrics** (only) to the CloudWatch OTLP endpoint over a bearer-authenticated HTTPS connection. Leave logs and traces at their default (`none`).

The `[otel]` block below is independent of your model-provider auth (see [Prerequisites](#prerequisites)) — if you use Amazon Bedrock, this `[otel]` section sits alongside your existing `model_provider` / `[model_providers.amazon-bedrock.aws]` settings in the same file. The bearer token in the `[otel]` header authenticates Codex to **CloudWatch**, not to the model.

```toml
[otel]

[otel.metrics_exporter.otlp-http]
endpoint = "https://monitoring.<AWS_REGION>.amazonaws.com/v1/metrics"
protocol = "binary"  # OTLP/protobuf; "json" also works — both are accepted by CloudWatch

[otel.metrics_exporter.otlp-http.headers]
"Authorization" = "Bearer <YOUR_BEARER_TOKEN>"
```

:::note
Set the `environment` dimension through `OTEL_RESOURCE_ATTRIBUTES` (next section), which lands as `@resource.environment`. Avoid the `[otel] environment = "..."` config key — it surfaces under a *different* label (`@resource.env`), which the dashboards do not use.
:::

Replace `<AWS_REGION>` with your target Region (for example `us-east-1`) and `<YOUR_BEARER_TOKEN>` with the `ServiceCredentialSecret` value.

:::warning
Paste the **literal token value** into the header. Codex 0.139.0 does not expand environment-variable references (such as `Bearer ${MY_TOKEN}`) inside header values — it sends the text verbatim, and CloudWatch rejects it with HTTP 403. Because the token then lives in the file, restrict its permissions: `chmod 600 ~/.codex/config.toml`. Both `protocol = "binary"` (OTLP/protobuf) and `protocol = "json"` are accepted by CloudWatch.
:::

### Add identity and team attribution

Codex reads the standard `OTEL_RESOURCE_ATTRIBUTES` environment variable and attaches the values as **resource attributes** on every metric. This is how you get per-developer and per-team breakdowns. Set it in the developer's shell profile (or via your fleet's profile management):

```bash
export OTEL_RESOURCE_ATTRIBUTES="user.id=$(whoami),user.email=${USER_EMAIL},team.id=${TEAM:-engineering},cost_center=${COST_CENTER:-default},department=${DEPARTMENT:-engineering},environment=${ENV:-dev}"
```

:::note
These dimensions arrive as **resource** attributes, so in PromQL they are referenced with the `@resource.` prefix — for example `@resource.team.id`. The pre-built dashboards already use this prefix. The Codex service name is fixed by the CLI (`codex` for the interactive TUI, `codex_exec` for non-interactive runs) and cannot be overridden, so the dashboards match it with the regex `@resource.service.name=~"codex.*"`.
:::

The attributes you can rely on for grouping and filtering:

<!-- attribution attributes -->
| Attribute | PromQL label | Purpose | Example |
| --- | --- | --- | --- |
| `user.id` | `@resource.user.id` | Per-developer attribution | `jdoe` |
| `user.email` | `@resource.user.email` | Per-developer attribution | `jdoe@example.com` |
| `team.id` | `@resource.team.id` | Team-level aggregation | `platform-eng` |
| `cost_center` | `@resource.cost_center` | Finance/chargeback grouping | `CC-4200` |
| `department` | `@resource.department` | Org-level rollup | `engineering` |
| `environment` | `@resource.environment` | Distinguish dev/staging/prod usage | `production` |

## Verify metrics are flowing

Run a short Codex session so it emits a turn's worth of metrics:

```bash
codex exec "print hello world in python"
```

Then open [CloudWatch Query Studio](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-PromQL-QueryStudio.html) and type `codex` to see the available metrics, or run an instant query such as:

```
sum({"codex.turn.token_usage", "@resource.service.name"=~"codex.*"})
```

If metrics appear, the configuration is correct. If not, confirm the endpoint URL, that the `Authorization` header contains the literal token value (see the warning above), and that at least one Codex turn has completed. Note that CloudWatch ingestion can take a few minutes to become queryable.

### Metrics Codex emits

Codex 0.139.0 emits these usage-relevant metrics (all counters/histograms; metric names verified against the CLI):

| Metric | Type | Description |
| --- | --- | --- |
| `codex.turn.token_usage` | Histogram | Token usage; attribute `token_type` ∈ `input`, `output`, `cached_input`, `reasoning_output`, plus `model` |
| `codex.api_request` | Counter | Model API request count (attributes include `model`, `success`, `status`) |
| `codex.api_request.duration_ms` | Histogram | API request latency |
| `codex.tool.call` | Counter | Tool invocation count (attributes `tool`, `success`) |
| `codex.tool.call.duration_ms` | Histogram | Tool execution latency |
| `codex.approval.requested` | Counter | Approval prompts and their `decision` |
| `codex.conversation.turn.count` | Counter | Conversation turns (attribute `model`) |
| `codex.turn.e2e_duration_ms` | Histogram | End-to-end turn latency |
| `codex.thread.started` | Counter | Threads/sessions started |

:::note
Unlike Claude Code on Amazon Bedrock, **Codex does not emit a cost metric**. The dashboards report token consumption by model; if you need a cost figure, multiply token counts by your model pricing downstream. The full list of metrics and events is in the [Codex observability documentation](https://developers.openai.com/codex/config-advanced).
:::

## Sample usage dashboards

This recipe ships two equivalent pre-built dashboards. As long as your resource attributes follow the conventions above, values populate automatically.

### CloudWatch dashboard

Download [codex-cloudwatch-dashboard.json](https://github.com/aws-observability/terraform-aws-observability-accelerator/blob/main/artifacts/cloudwatch-dashboards/codex/codex-cloudwatch-dashboard.json) and deploy it:

```bash
aws cloudwatch put-dashboard \
  --dashboard-name CodexDashboard \
  --dashboard-body file://codex-cloudwatch-dashboard.json \
  --region <AWS_REGION>

# Verify
aws cloudwatch list-dashboards --dashboard-name-prefix Codex --region <AWS_REGION>
```

The dashboard is organized into five sections:

* **Overview** — total tokens, API requests, active users, conversation turns.
* **Token Usage** — total tokens over time, breakdown by type (input / output / cached input / reasoning output), by model, and top users.
* **API & Tool Activity** — API requests by outcome and by model, conversation turns, tool calls by tool, tool-call outcomes, and approval decisions.
* **Performance & Latency** — cache hit rate, turn latency and time-to-first-token (p50/p90/p99), API request latency p90 by model, and tool-call latency. Latency panels use CloudWatch's native histogram function over an aggregated selector — `histogram_quantile(0.9, sum({"codex.turn.e2e_duration_ms"}))` — since OTLP histograms in CloudWatch do not expose classic Prometheus `le` buckets. (Wrap the selector in `sum(...)` so the quantile is computed across all series, not one line per user/tool.)
* **Organizational Breakdown** — tokens and API requests by department and team, plus token usage by cost center and environment.

### Grafana dashboard

If your organization uses Amazon Managed Grafana (or self-managed Grafana), import [codex-grafana-dashboard.json](https://github.com/aws-observability/terraform-aws-observability-accelerator/blob/main/artifacts/grafana-dashboards/codex/codex-grafana-dashboard.json). It uses the same PromQL against an [Amazon Managed Service for Prometheus data source pointed at the CloudWatch PromQL endpoint](https://docs.aws.amazon.com/grafana/latest/userguide/cloudwatch-promql.html) (set the SigV4 **Service** to `monitoring`). Select that data source for the dashboard's `datasource` variable on import.

## Alerting

Every panel is backed by a PromQL query, so you can create an alarm from any panel via **View in Query Studio** > **Create alarm**. A few examples:

**Team token-usage threshold** — alert when a team's daily token usage exceeds a budget:

```
sum by ("@resource.team.id") (increase({"codex.turn.token_usage"}[24h])) > 5000000
```

**Elevated API error rate** — alert when failed requests climb:

```
sum(increase({"codex.api_request", success="false"}[1h])) > 50
```

**Latency regression** — alert when p90 turn latency exceeds a threshold (for example 30s):

```
histogram_quantile(0.9, sum({"codex.turn.e2e_duration_ms"})) > 30000
```

**Adoption regression** — detect when a team's daily threads drop below half their 7-day average:

```
sum by ("@resource.team.id") (increase({"codex.thread.started"}[24h]))
< 0.5 * avg_over_time(sum by ("@resource.team.id") (increase({"codex.thread.started"}[1h]))[7d:1d])
```

## Cost estimate

CloudWatch OTLP metrics ingestion is billed at $0.50/GB. A single OTLP metric data point averages ~300 bytes on the wire. For a 200-developer organization running ~20 sessions/day, the metric volume is on the order of tens of MB/month — well under $5/month for ingestion. PromQL queries in the Console are free. See the [Amazon CloudWatch Pricing page](https://aws.amazon.com/cloudwatch/pricing/) for the latest rates.

## Cleanup

:::warning
CloudWatch metrics data persists after you stop telemetry (up to 15 months retention) at no additional charge. CloudWatch alarms, if created, incur $0.10/alarm/month until deleted. Leaving IAM users and bearer tokens active poses a security risk.
:::

```bash
# Delete the dashboard
aws cloudwatch delete-dashboards --dashboard-names CodexDashboard --region <AWS_REGION>

# Delete the service-specific credential, detach the policy, delete the user
aws iam delete-service-specific-credential --user-name codex-cloudwatch-metrics-user --service-specific-credential-id <credential-id>
aws iam detach-user-policy --user-name codex-cloudwatch-metrics-user --policy-arn arn:aws:iam::aws:policy/CloudWatchAPIKeyAccess
aws iam delete-user --user-name codex-cloudwatch-metrics-user
```

To stop telemetry export, remove the `[otel]` section from `~/.codex/config.toml` and unset `OTEL_RESOURCE_ATTRIBUTES`.

## Resources

* [OpenAI Codex: Observability and Telemetry](https://developers.openai.com/codex/config-advanced)
* [CloudWatch OTLP Metrics Bearer Token Auth](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-OTLP-MetricsBearerTokenAuth.html)
* [Query Amazon CloudWatch metrics using PromQL (Amazon Managed Grafana)](https://docs.aws.amazon.com/grafana/latest/userguide/cloudwatch-promql.html)
* [OpenTelemetry GenAI Semantic Conventions](https://opentelemetry.io/docs/specs/semconv/gen-ai/)

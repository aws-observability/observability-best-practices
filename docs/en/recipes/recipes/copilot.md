# Analyzing GitHub Copilot Usage with CloudWatch and OpenTelemetry

If your engineering organization uses AI coding agents like [GitHub Copilot](https://github.com/features/copilot), usage is likely growing faster than your ability to track it. Token consumption, model mix, tool activity, edit-acceptance, and per-team adoption are questions that existing dashboards don't answer, because the telemetry never made it to your observability backend.

With Amazon CloudWatch OpenTelemetry Protocol (OTLP) in General Availability, metrics ingestion is now possible with bearer token authentication. GitHub Copilot Chat in VS Code emits OpenTelemetry metrics natively, so it can ship them directly to CloudWatch with a single authorization header. No collectors, no sidecars, no IAM credential wiring on developer machines. Connect the signals in minutes and get per-developer attribution, team-level usage analytics, and operational alerting, all queryable with Prometheus Query Language (PromQL).

This recipe walks through the end-to-end setup for GitHub Copilot Chat. It is the companion to the Claude Code and OpenAI Codex recipes and follows the same bearer-token, direct-to-CloudWatch pattern.

!!! note
    Copilot's OpenTelemetry support is evolving. The metric **names** below are taken from the official [VS Code "Monitor agent usage with OpenTelemetry"](https://code.visualstudio.com/docs/copilot/guides/monitoring-agents) guide and the [OpenTelemetry GenAI semantic conventions](https://github.com/open-telemetry/semantic-conventions-genai). Some per-metric **breakdown attribute keys** (for example, the label distinguishing accepted vs rejected edits) are not published in the docs at the time of writing — those panels show totals (see [Metrics Copilot emits](#metrics-copilot-emits)). Verify against your installed VS Code/Copilot version with the `console` exporter before relying on specific labels.

## Bearer token authentication

Bearer tokens (CloudWatch metrics API keys) allow tools running outside AWS (like Copilot on developer laptops) to send metrics to CloudWatch without requiring the AWS SDK or IAM credential chains. Each token is tied to an AWS IAM user scoped exclusively to the [CloudWatchAPIKeyAccess](https://docs.aws.amazon.com/aws-managed-policy/latest/reference/CloudWatchAPIKeyAccess.html) managed policy.

!!! warning
    Bearer tokens are long-term credentials. This recipe uses them because AI coding agents run on developer laptops outside of AWS, where SigV4 with short-term credentials would require a central collector or a per-machine collector process. For workloads running inside AWS where SigV4 with short-term credentials is feasible, prefer that approach for a stronger security posture. The CloudWatch OTLP endpoint requires HTTPS; requests over plain HTTP are rejected. For more information, see [CloudWatch OTLP Metrics Bearer Token Auth](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-OTLP-MetricsBearerTokenAuth.html).

## Solution overview

The setup has three components:

1. **A CloudWatch metrics API key** — a bearer token tied to a narrowly-scoped IAM user. Created once per developer (or shared per team).
2. **Copilot configuration** — VS Code settings plus environment variables that tell Copilot's OpenTelemetry SDK where to send metrics and how to attribute them.
3. **A pre-built dashboard** — a CloudWatch dashboard (and a Grafana equivalent) that visualizes token usage, latency, tool and developer activity, and team-level usage with PromQL queries.

## Prerequisites

* An AWS account with permissions to create CloudWatch and IAM resources.
* AWS CLI v2 installed and configured.
* VS Code with the GitHub Copilot Chat extension, signed in to Copilot.
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

Copilot OpenTelemetry is enabled through VS Code settings, while the **authentication header must be supplied through an environment variable** — the VS Code docs state: *"Authentication headers for remote collectors are only configurable through the `OTEL_EXPORTER_OTLP_HEADERS` environment variable."*

In VS Code `settings.json`:

```json
{
  "github.copilot.chat.otel.enabled": true,
  "github.copilot.chat.otel.otlpEndpoint": "https://monitoring.<AWS_REGION>.amazonaws.com",
  "github.copilot.chat.otel.exporterType": "otlp-http"
}
```

Then set the auth header, attribution, and (optionally) service name in the environment **before launching VS Code** so the Copilot extension inherits them:

```bash
export OTEL_EXPORTER_OTLP_HEADERS="Authorization=Bearer <YOUR_BEARER_TOKEN>"
export OTEL_RESOURCE_ATTRIBUTES="user.id=$(whoami),user.email=${USER_EMAIL},team.id=${TEAM:-engineering},cost_center=${COST_CENTER:-default},department=${DEPARTMENT:-engineering},environment=${ENV:-dev}"
export OTEL_SERVICE_NAME="copilot-chat"   # default; the dashboards filter on this value
code .
```

Replace `<AWS_REGION>` with your target Region (for example `us-east-1`) and `<YOUR_BEARER_TOKEN>` with the `ServiceCredentialSecret` value. The default OTLP protocol is `http/protobuf`, which the CloudWatch endpoint accepts.

!!! warning
    Copilot sends **traces, metrics, and events to the same endpoint** — there is no documented metrics-only mode. The CloudWatch metrics endpoint (`/v1/metrics`) ingests the metrics; the trace and log POSTs to that host are simply rejected and dropped, which is harmless but means you will see client-side export errors for the non-metrics signals. If you want to capture traces/logs too, or to cleanly separate signals, run a local OpenTelemetry Collector and route each signal to its matching CloudWatch endpoint instead of pointing Copilot directly at `/v1/metrics`.

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

Open VS Code (launched from the configured shell), start a Copilot Chat session, and send a couple of prompts. Then open [CloudWatch Query Studio](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-PromQL-QueryStudio.html) and type `copilot` or `gen_ai`, or run an instant query such as:

```
histogram_sum({"gen_ai.client.token.usage", "@resource.service.name"="copilot-chat"})
```

If metrics appear, the configuration is correct. If not, confirm the endpoint URL, that `OTEL_EXPORTER_OTLP_HEADERS` is set in the shell that launched VS Code, and that you have completed at least one chat interaction. CloudWatch ingestion can take a few minutes to become queryable.

### Metrics Copilot emits

The dashboards are built on these metrics (names from the VS Code monitoring guide; `gen_ai.*` follow the OTel GenAI semantic conventions).

| Metric | Type | Notes |
| --- | --- | --- |
| `gen_ai.client.token.usage` | Histogram | Token counts; attribute `gen_ai.token.type` ∈ `input`, `output`; `gen_ai.request.model`. Query with `histogram_sum(...)`. |
| `gen_ai.client.operation.duration` | Histogram | LLM API call duration (seconds); `gen_ai.request.model`, `error.type`. |
| `copilot_chat.tool.call.count` | Counter | Tool invocations; `gen_ai.tool.name`, success. |
| `copilot_chat.tool.call.duration` | Histogram | Tool execution latency (ms). |
| `copilot_chat.time_to_first_token` | Histogram | Time to first SSE token (seconds). |
| `copilot_chat.agent.invocation.duration` | Histogram | Agent end-to-end duration (seconds). |
| `copilot_chat.agent.turn.count` | Histogram | LLM round-trips per agent invocation. |
| `copilot_chat.session.count` | Counter | Chat sessions started. |
| `copilot_chat.lines_of_code.count` | Counter | Lines added or removed by accepted edits.¹ |
| `copilot_chat.edit.acceptance.count` | Counter | Edit accept/reject decisions.¹ |
| `copilot_chat.user.feedback.count` | Counter | Thumbs up/down votes.¹ |
| `copilot_chat.user.action.count` | Counter | Engagement actions (copy, insert, apply, followup).¹ |
| `copilot_chat.pull_request.count` | Counter | Pull requests created via the CLI agent. |

¹ The VS Code docs describe these breakdowns (added/removed, accepted/rejected, up/down) but do **not** publish the attribute keys/values that carry them. The dashboards therefore chart **totals** for these metrics; add the breakdown grouping once you confirm the label names from a real Copilot emission (use `"github.copilot.chat.otel.exporterType": "console"` to inspect them). The page confirms these filtering attributes exist across metrics: `gen_ai.request.model`, `gen_ai.provider.name`, `gen_ai.tool.name`, `copilot_chat.edit.source`, `error.type`.

!!! note
    Like Claude Code on Amazon Bedrock, Copilot does **not** emit a dollar-cost metric. The dashboards report token consumption; derive cost downstream from token counts and your plan's pricing if needed.

## Sample usage dashboards

### CloudWatch dashboard

Download [copilot-cloudwatch-dashboard.json](./copilot/copilot-cloudwatch-dashboard.json) and deploy it:

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
* **Performance & Latency** — LLM operation duration and time-to-first-token (p50/p90/p99), LLM latency p90 by model, tool-call latency, and agent invocation/turn metrics. Latency panels use CloudWatch's native histogram function — `histogram_quantile(0.9, {"gen_ai.client.operation.duration"})` — since OTLP histograms in CloudWatch do not expose classic Prometheus `le` buckets.
* **Tool & Developer Activity** — tool calls by tool and outcome, lines of code, edit-acceptance, user feedback, and pull requests.
* **Organizational Breakdown** — token usage by department, team, and cost center, and sessions by environment.

### Grafana dashboard

If your organization uses Amazon Managed Grafana (or self-managed Grafana), import [copilot-grafana-dashboard.json](./copilot/copilot-grafana-dashboard.json). It uses the same PromQL against an [Amazon Managed Service for Prometheus data source pointed at the CloudWatch PromQL endpoint](https://docs.aws.amazon.com/grafana/latest/userguide/cloudwatch-promql.html) (set the SigV4 **Service** to `monitoring`). Select that data source for the dashboard's `datasource` variable on import.

## Alerting

Every panel is backed by a PromQL query, so you can create an alarm from any panel via **View in Query Studio** > **Create alarm**. A few examples:

**Team token-usage threshold** — alert when a team's daily token usage exceeds a budget:

```
sum by ("@resource.team.id") (increase(histogram_sum({"gen_ai.client.token.usage"})[24h])) > 5000000
```

**LLM latency regression** — alert when p90 LLM operation duration exceeds 30s:

```
histogram_quantile(0.9, {"gen_ai.client.operation.duration"}) > 30
```

**Adoption regression** — detect when a team's daily sessions drop below half their 7-day average:

```
sum by ("@resource.team.id") (increase({"copilot_chat.session.count"}[24h]))
< 0.5 * avg_over_time(sum by ("@resource.team.id") (increase({"copilot_chat.session.count"}[1h]))[7d:1d])
```

## Cost estimate

CloudWatch OTLP metrics ingestion is billed at $0.50/GB. A single OTLP metric data point averages ~300 bytes on the wire. For a 200-developer organization, the metric volume is on the order of tens of MB/month — well under $5/month for ingestion. PromQL queries in the Console are free. See the [Amazon CloudWatch Pricing page](https://aws.amazon.com/cloudwatch/pricing/) for the latest rates.

## Cleanup

!!! warning
    CloudWatch metrics data persists after you stop telemetry (up to 15 months retention) at no additional charge. CloudWatch alarms, if created, incur $0.10/alarm/month until deleted. Leaving IAM users and bearer tokens active poses a security risk.

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

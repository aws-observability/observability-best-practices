---
sidebar_position: 2
title: Claude Code
---

# Analyzing Claude Code Usage with CloudWatch and OpenTelemetry

:::note
The telemetry environment variables and metric names in this guide follow the official [Claude Code monitoring documentation](https://docs.claude.com/en/docs/claude-code/monitoring-usage). Claude Code's telemetry is evolving quickly — verify metric names against your installed version (see [Verify metrics are flowing](#verify-metrics-are-flowing)).
:::

## Bearer token authentication

Bearer tokens (CloudWatch metrics API keys) allow tools running outside AWS (like Claude Code on developer laptops) to send metrics to CloudWatch without requiring the AWS SDK or IAM credential chains. Each token is tied to an AWS IAM user scoped exclusively to the [CloudWatchAPIKeyAccess](https://docs.aws.amazon.com/aws-managed-policy/latest/reference/CloudWatchAPIKeyAccess.html) managed policy.

:::warning
Bearer tokens are long-term credentials. This recipe uses them because AI coding agents run on developer laptops outside of AWS, where SigV4 with short-term credentials would require a central collector or a per-machine collector process. For workloads running inside AWS where SigV4 with short-term credentials is feasible, prefer that approach for a stronger security posture. The CloudWatch OTLP endpoint requires HTTPS; requests over plain HTTP are rejected. For more information, see [CloudWatch OTLP Metrics Bearer Token Auth](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-OTLP-MetricsBearerTokenAuth.html).
:::

## Solution overview

The setup has three components:

1. **A CloudWatch metrics API key** — a bearer token tied to a narrowly-scoped IAM user. Created once per developer (or shared per team).
2. **Claude Code configuration** — a handful of environment variables that tell Claude Code's OpenTelemetry SDK to enable telemetry, where to send metrics, and how to attribute them.
3. **A pre-built dashboard** — a CloudWatch dashboard (and a Grafana equivalent) that visualizes token usage, cost, developer productivity, and team-level usage with PromQL queries.

## Prerequisites

* An AWS account with permissions to create CloudWatch and IAM resources.
* AWS CLI v2 installed and configured.
* Claude Code installed and able to reach a model. How you authenticate Claude Code to the model depends on your provider and is **independent** of the CloudWatch metrics setup in this recipe:
    * **Anthropic API** (default) — authenticate with `claude` (interactive login) or set `ANTHROPIC_API_KEY`.
    * **Amazon Bedrock** — set `export CLAUDE_CODE_USE_BEDROCK=1` and authenticate with your AWS credentials (e.g. `export AWS_PROFILE=... AWS_REGION=...`, or any provider in the AWS credential chain). The bearer token in this recipe authenticates Claude Code to **CloudWatch**, not to Bedrock.
* A CloudWatch metrics API key (created below).

:::tip
For enterprise rollouts — corporate SSO and IdP federation (Okta, Azure AD, Auth0, Amazon Cognito, AWS IAM Identity Center), OIDC credential federation that eliminates long-lived API keys, per-user attribution (department, team, cost center) from JWT claims, and quota/cost controls — see the [Guidance for Claude Code with Amazon Bedrock](https://github.com/aws-solutions-library-samples/guidance-for-claude-code-with-amazon-bedrock) repository. It provides deployable authentication patterns (External IdP OIDC, IAM Identity Center) for both the Claude Code CLI and Claude Cowork Desktop. That guidance handles **how developers authenticate to Bedrock at scale**; the CloudWatch metrics setup in this recipe is independent and layers on top of it.
:::

## Create a bearer token

You can create the token in the CloudWatch console (**Settings** > scroll to **API keys** > **Create**) or with the CLI:

```bash
# Create an IAM user for CloudWatch metrics ingestion
aws iam create-user --user-name claude-code-cloudwatch-metrics-user

# Attach the CloudWatchAPIKeyAccess managed policy
aws iam attach-user-policy \
    --user-name claude-code-cloudwatch-metrics-user \
    --policy-arn arn:aws:iam::aws:policy/CloudWatchAPIKeyAccess

# Create a service-specific credential (the bearer token), expiring in 90 days
aws iam create-service-specific-credential \
    --user-name claude-code-cloudwatch-metrics-user \
    --service-name cloudwatch.amazonaws.com \
    --credential-age-days 90
```

The response includes a `ServiceCredentialSecret` field — this is your bearer token value. Store it securely in [AWS Secrets Manager](https://docs.aws.amazon.com/secretsmanager/latest/userguide/intro.html) or your organization's vault. Never commit it to version control.

## Configure Claude Code

Claude Code reads its telemetry configuration from standard OpenTelemetry environment variables. Set them in the shell that launches `claude` (or your fleet's profile management). This routes **metrics** to the CloudWatch OTLP endpoint over a bearer-authenticated HTTPS connection.

```bash
# Pull the bearer token from your vault rather than hard-coding it
BEARER_TOKEN=$(aws secretsmanager get-secret-value \
  --secret-id cloudwatch-otlp-bearer-token \
  --query SecretString --output text)

export CLAUDE_CODE_ENABLE_TELEMETRY=1
export OTEL_METRICS_EXPORTER=otlp
export OTEL_EXPORTER_OTLP_PROTOCOL=http/json
export OTEL_EXPORTER_OTLP_ENDPOINT="https://monitoring.<AWS_REGION>.amazonaws.com"
export OTEL_EXPORTER_OTLP_HEADERS="Authorization=Bearer ${BEARER_TOKEN}"
export OTEL_METRIC_EXPORT_INTERVAL=2000
```

Replace `<AWS_REGION>` with your target Region (for example `us-east-1`). The OpenTelemetry SDK appends the `/v1/metrics` path to the base endpoint automatically. `http/json` and `http/protobuf` are both accepted by CloudWatch.

:::note
`OTEL_METRIC_EXPORT_INTERVAL=2000` (2 seconds) makes metrics appear quickly while you verify the setup. Claude Code's default is 60000 ms (60 seconds); for steady-state fleet use, raise the interval back toward the default to reduce request volume.
:::

:::tip
For a fleet-wide rollout, you can set these same variables in the `env` block of a [managed Claude Code `settings.json`](https://docs.claude.com/en/docs/claude-code/settings) instead of each developer's shell profile.
:::

### Add identity and team attribution

Claude Code reads the standard `OTEL_RESOURCE_ATTRIBUTES` environment variable and attaches the values as **resource attributes** on every metric. This is how you get per-developer and per-team breakdowns. Set it in the developer's shell profile (or via your fleet's profile management):

```bash
export OTEL_RESOURCE_ATTRIBUTES="user.id=$(whoami),user.email=${USER_EMAIL},team.id=${TEAM:-engineering},cost_center=${COST_CENTER:-default},department=${DEPARTMENT:-engineering},environment=${ENV:-dev}"
```

:::note
These dimensions arrive as **resource** attributes, so in PromQL they are referenced with the `@resource.` prefix — for example `@resource.team.id`. The pre-built dashboards already use this prefix. Claude Code's service name is fixed by the CLI (`@resource.service.name` is `claude-code`); the dashboards match Claude Code's metrics by their unique `claude_code.*` prefix.
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

Run a short Claude Code session so it emits a turn's worth of metrics:

```bash
claude -p "Let's conquer the world" --max-turns 1
```

Then open [CloudWatch Query Studio](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-PromQL-QueryStudio.html) and type `claude_` to see the available metrics, or run an instant query such as:

```
sum({"claude_code.token.usage"})
```

If metrics appear, the configuration is correct. If not, confirm the endpoint URL, that the `Authorization` header contains the literal token value, that `CLAUDE_CODE_ENABLE_TELEMETRY=1` is set in the shell that launched `claude`, and that at least one session has completed. CloudWatch ingestion can take a few minutes to become queryable.

### Metrics Claude Code emits

Claude Code emits these usage-relevant metrics (metric names follow the official monitoring documentation):

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

:::note
Unlike OpenAI Codex and GitHub Copilot, **Claude Code emits a cost metric** (`claude_code.cost.usage`), so the dashboards can chart estimated spend directly without you having to multiply token counts by model pricing downstream.
:::

:::tip
Claude Code can also export **events** (user prompts, tool results, API requests and errors) as OpenTelemetry logs. To capture them, additionally set `export OTEL_LOGS_EXPORTER=otlp` and route logs to the matching CloudWatch logs endpoint. This guide and its dashboards focus on metrics. See the [Claude Code monitoring documentation](https://docs.claude.com/en/docs/claude-code/monitoring-usage) for the full event reference.
:::

## Sample usage dashboards

This recipe ships two equivalent pre-built dashboards. As long as your resource attributes follow the conventions above, values populate automatically.

### CloudWatch dashboard

Download [claude-code-cloudwatch-dashboard.json](https://raw.githubusercontent.com/aws-observability/aws-observability-accelerator/main/artifacts/cloudwatch-dashboards/claude-code/claude-code.json) and deploy it:

```bash
curl -o claude-code-cloudwatch-dashboard.json \
  https://raw.githubusercontent.com/aws-observability/aws-observability-accelerator/main/artifacts/cloudwatch-dashboards/claude-code/claude-code.json

aws cloudwatch put-dashboard \
  --dashboard-name ClaudeCodeDashboard \
  --dashboard-body file://claude-code-cloudwatch-dashboard.json \
  --region <AWS_REGION>

# Verify
aws cloudwatch list-dashboards --dashboard-name-prefix ClaudeCode --region <AWS_REGION>
```

The dashboard is organized into five sections:

* **Overview** — total tokens, active users, sessions, and cache hit rate.
* **Token Usage** — consumption over time, breakdown by type (input / output / cache read / cache creation), by model, top users, and estimated cost.
* **Developer Productivity** — lines added / removed, commits, active hours, pull requests, and edit accept / reject rates.
* **Organizational Breakdown** — tokens and cost by department and team, plus usage by cost center and environment, for chargeback.
* **Amazon Bedrock API Health** — throttle events and client / server errors by model (when running Claude Code on Amazon Bedrock; sourced from the native `AWS/Bedrock` CloudWatch metrics).

### Grafana dashboard

If your organization uses Amazon Managed Grafana (or self-managed Grafana), import [claude-code-grafana-dashboard.json](https://raw.githubusercontent.com/aws-observability/aws-observability-accelerator/main/artifacts/grafana-dashboards/claude-code/claude-code.json). It uses the same PromQL against an [Amazon Managed Service for Prometheus data source pointed at the CloudWatch PromQL endpoint](https://docs.aws.amazon.com/grafana/latest/userguide/cloudwatch-promql.html) (set the SigV4 **Service** to `monitoring`). Select that data source for the dashboard's `datasource` variable on import.

## Alerting

Every panel is backed by a PromQL query, so you can create an alarm from any panel via **View in Query Studio** > **Create alarm**. A few examples:

**Individual spend spike** — alert when a developer's spend in the last hour exceeds twice their 24-hour hourly average:

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

## Cost estimate

CloudWatch OTLP metrics ingestion is billed at $0.50/GB. As a worked example for a 200-developer organization (~20 sessions/day, ~7 metrics per session, ~450 bytes per data point, ~22 active days/month):

```
200 developers × 20 sessions/day × 7 metrics × 450 bytes ≈ 12.6 MB/day
12.6 MB/day × 22 days ≈ 277 MB/month ≈ 0.27 GB/month
```

At $0.50/GB that is roughly **$0.14/month** in the base case — and stays under $15/month even at 100x that volume. PromQL queries in the Console are free. See the [Amazon CloudWatch Pricing page](https://aws.amazon.com/cloudwatch/pricing/) for the latest rates.

## Cleanup

:::warning
CloudWatch metrics data persists after you stop telemetry (up to 15 months retention) at no additional charge. CloudWatch alarms, if created, incur $0.10/alarm/month until deleted. Leaving IAM users and bearer tokens active poses a security risk.
:::

```bash
# Delete the dashboard
aws cloudwatch delete-dashboards --dashboard-names ClaudeCodeDashboard --region <AWS_REGION>

# Delete the service-specific credential, detach the policy, delete the user
aws iam delete-service-specific-credential --user-name claude-code-cloudwatch-metrics-user --service-specific-credential-id <credential-id>
aws iam detach-user-policy --user-name claude-code-cloudwatch-metrics-user --policy-arn arn:aws:iam::aws:policy/CloudWatchAPIKeyAccess
aws iam delete-user --user-name claude-code-cloudwatch-metrics-user
```

To stop telemetry export, unset the telemetry variables:

```bash
unset CLAUDE_CODE_ENABLE_TELEMETRY OTEL_METRICS_EXPORTER OTEL_EXPORTER_OTLP_PROTOCOL \
  OTEL_EXPORTER_OTLP_ENDPOINT OTEL_EXPORTER_OTLP_HEADERS OTEL_RESOURCE_ATTRIBUTES \
  OTEL_METRIC_EXPORT_INTERVAL
```

## Resources

* [Analyzing Claude Code usage with CloudWatch and OpenTelemetry (AWS blog)](https://aws.amazon.com/blogs/mt/analyzing-claude-code-usage-with-cloudwatch-and-opentelemetry/)
* [Guidance for Claude Code with Amazon Bedrock (enterprise SSO, IdP federation, and Bedrock access patterns)](https://github.com/aws-solutions-library-samples/guidance-for-claude-code-with-amazon-bedrock)
* [Claude Code: Monitoring usage](https://docs.claude.com/en/docs/claude-code/monitoring-usage)
* [CloudWatch OTLP Metrics Bearer Token Auth](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-OTLP-MetricsBearerTokenAuth.html)
* [Query Amazon CloudWatch metrics using PromQL (Amazon Managed Grafana)](https://docs.aws.amazon.com/grafana/latest/userguide/cloudwatch-promql.html)
* [OpenTelemetry GenAI Semantic Conventions](https://opentelemetry.io/docs/specs/semconv/gen-ai/)

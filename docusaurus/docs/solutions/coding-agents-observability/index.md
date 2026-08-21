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

The pattern is consistent across agents: create a CloudWatch metrics API key (bearer token), configure the agent's OTel environment variables or config file, set resource attributes for team attribution, then deploy a pre-built dashboard. Cost for a 200-developer fleet is typically under $5/month for metric ingestion.

## Prerequisites

- An AWS account with permissions to create IAM users and CloudWatch resources
- AWS CLI v2 installed and configured
- At least one coding agent installed:
  - **Claude Code** — CLI authenticated to Anthropic API or Amazon Bedrock
  - **OpenAI Codex** — CLI authenticated via `codex login` or Amazon Bedrock
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

```bash
# Create an IAM user scoped to CloudWatch metrics ingestion
aws iam create-user --user-name coding-agents-cw-metrics

# Attach the CloudWatchAPIKeyAccess managed policy
aws iam attach-user-policy \
  --user-name coding-agents-cw-metrics \
  --policy-arn arn:aws:iam::aws:policy/CloudWatchAPIKeyAccess

# Create the bearer token (expires in 90 days)
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
export OTEL_RESOURCE_ATTRIBUTES="user.id=$(whoami),team.id=${TEAM:-engineering},department=${DEPARTMENT:-engineering}"
```

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

Set attribution in your shell: `export OTEL_RESOURCE_ATTRIBUTES="user.id=$(whoami),team.id=${TEAM:-engineering}"`

### Step 4: Configure GitHub Copilot

In VS Code `settings.json`:

```json
{
  "github.copilot.chat.otel.enabled": true,
  "github.copilot.chat.otel.otlpEndpoint": "https://monitoring.us-east-1.amazonaws.com",
  "github.copilot.chat.otel.exporterType": "otlp-http"
}
```

Set environment variables before launching VS Code:

```bash
export OTEL_EXPORTER_OTLP_HEADERS="Authorization=Bearer <YOUR_BEARER_TOKEN>"
export OTEL_RESOURCE_ATTRIBUTES="user.id=$(whoami),team.id=${TEAM:-engineering}"
code .
```

### Step 5: Deploy dashboards

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

## Troubleshoot

| Symptom | Likely Cause | Fix |
|---------|-------------|-----|
| No metrics after 5 min (any agent) | Bearer token invalid or endpoint URL wrong | Verify token is the literal `ServiceCredentialSecret` value; confirm endpoint is `https://monitoring.<REGION>.amazonaws.com` |
| Codex config ignored | `~/.codex/config.toml` syntax error or env-var reference in header | Paste the literal token value (Codex does not expand `${VAR}` in TOML); run `chmod 600 ~/.codex/config.toml` |
| Copilot metrics missing in CloudWatch | `OTEL_EXPORTER_OTLP_HEADERS` not set in the shell that launched VS Code | Export the variable first, then run `code .` from that shell; VS Code does not pick up headers from settings.json |
| Resource attributes (`@resource.team.id`) empty | `OTEL_RESOURCE_ATTRIBUTES` unset or malformed | Ensure the variable is exported in the shell profile that launches the agent; no spaces around `=` in values |
| Dashboard shows "No Data" for Grafana panels | Data source not pointed at CloudWatch PromQL endpoint | In AMG, set the Prometheus data source URL to `https://monitoring.<REGION>.amazonaws.com` with SigV4 service `monitoring` |

## Related Solutions

- [GenAI Workload Observability](../genai-observability/) — Bedrock/SageMaker model invocation monitoring and agent trace observability

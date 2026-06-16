---
sidebar_position: 1
---

# AI IDE Observability

As AI coding agents become integral to software development workflows, understanding their usage patterns, costs, and performance is essential. These guides show how to ship native OpenTelemetry metrics from AI coding agents directly to Amazon CloudWatch using bearer token authentication — no collectors or sidecars required.

Each guide covers end-to-end setup: creating a CloudWatch metrics API key, configuring the agent, deploying pre-built dashboards, and setting up alerting with PromQL.

| Guide | Agent | Key Metrics |
| --- | --- | --- |
| [GitHub Copilot](./copilot) | VS Code extension & CLI | Tokens, sessions, tool calls, edit acceptance, latency |
| [OpenAI Codex](./codex) | Codex CLI | Tokens, API requests, tool calls, conversation turns, latency |

Both guides follow the same pattern: bearer-token auth → direct-to-CloudWatch OTLP → PromQL dashboards & alerts.

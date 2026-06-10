# AWS 上的 GenAI Observability

## 概述

生成式 AI 工作负载在多个方面与传统应用不同，这使得从第一天起 Observability 就至关重要。响应是非确定性的，延迟随提示复杂度急剧变化，成本直接与 token 使用量挂钩，单个 Agent 调用可以在几秒内跨 Bedrock、S3、Lambda 和 KMS 链接数十个 API 调用。

如果没有适当的 Observability，团队会面临可预见的问题：

- **成本超支** — 未跟踪的 token 使用导致意外账单。单个失控的 Agent 循环可以在几分钟内消耗数百美元。
- **性能下降** — 慢响应影响用户体验，而您无法修复看不到的问题。Agent 工作流可能在编排层静默失败，而模型调用却成功。
- **质量差距** — 错误、幻觉和意外输出在用户投诉之前一直未被检测到。
- **合规和审计风险** — 没有记录模型说了什么、使用了什么参数或哪个 IAM 角色进行了提问。

本指南将引导您完成监控 AWS 上 GenAI 工作负载的策略、AWS 实施、启用模式和 dashboard 设计。它与配套的[为 GenAI 遥测数据创建自定义 Dashboard](../custom-dashboards-for-genai-telemetry) 指南配对，该指南展示了如何将相同的遥测数据转化为面向 DevOps、FinOps 和其他利益相关者的基于角色的 dashboard。

---

## 为什么 GenAI Observability 不同

### 独特挑战

**非确定性行为** — 相同的输入可以产生不同的输出。传统的"是否返回了正确值"测试不适用。您需要质量 metrics，而不仅仅是成功/失败。

**可变延迟** — 响应时间取决于提示复杂度、输出长度、模型负载和跨区域路由。P50 和 P95 的差异比传统 API 大得多。

**基于 Token 的定价** — 成本随使用模式而非仅请求数量扩展。平均提示长度的小幅增加可能使您的月度账单翻倍。

**多服务复杂性** — Agent 跨多个 AWS 服务链接 API 调用。没有单一的日志源能讲述完整的故事。

**快速迭代** — 模型和提示频繁变化。您的 Observability 必须跟踪模型版本、提示模板和配置随时间的变化。

### 业务影响

将 Observability 视为事后考虑的组织通常在事后发现这些模式：

- A single untuned prompt consuming 80% of the monthly Bedrock budget
- Agent workflows failing at the tool layer while model metrics look healthy
- PII leaking into logs because redaction wasn't configured upfront
- Cost attribution impossible because no team tags were applied

Getting observability right early prevents expensive retrofits later.

---

## GenAI 的核心支柱

### Metrics

回答"我的 AI 表现如何？"的运营遥测数据

**需要跟踪的关键 metrics：**

- **Token usage** — input tokens per request, output tokens per request, total tokens by model and user, token cost calculations
- **Latency** — time to first token (TTFT), total response time, P50/P95/P99 percentiles, latency by model and region
- **Request volume** — requests per second/minute/hour, success vs error rates, concurrent requests
- **Cost** — cost per request, cost by model/user/team, daily/monthly trends, cost efficiency (output tokens per dollar)

### Logs

回答"我的 AI 说了什么，对谁说的？"的内容和上下文

**需要记录的内容：**

- Request/response pairs (with PII redaction)
- Prompt templates and variables
- Model parameters (temperature, max_tokens, top_p)
- Error messages and stack traces
- User context and session IDs
- A/B test variants

**Log levels:**

- `DEBUG` — detailed prompt engineering iterations
- `INFO` — successful requests with metadata
- `WARN` — retries, fallbacks, rate limits
- `ERROR` — failures, timeouts, invalid responses

### Traces

回答"请求如何在我的系统中流转？"的分布式流

**需要捕获的内容：**

- End-to-end request flow
- Prompt preprocessing steps
- Model invocation spans
- Tool and function call spans
- Post-processing and validation
- Integration with downstream services
- Multi-hop agent workflows

---

## 战略最佳实践

1. **Instrument early** — add observability when you build, not after you ship. Use OpenTelemetry so your instrumentation is vendor-neutral and portable.
2. **Multi-dimensional tagging** — tag every metric with `model`, `environment`, `application`, `team`, and `region` dimensions so you can slice costs and performance later.
3. **Set baselines before alarms** — run in production for at least a week to establish normal behavior before setting alarm thresholds. Alarms without baselines create noise fatigue.
4. **Watch business metrics, not just technical** — track output quality, user satisfaction (thumbs up/down), and cost-per-feature alongside latency and error rates.
5. **Plan for PII from day one** — redact sensitive data in logs before it lands. Use [CloudWatch Logs data protection policies](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/mask-sensitive-data.html) for automated masking.
6. **Set retention policies** — log volume grows fast. Differentiate retention by purpose:
   - Operational logs: 7 days
   - Model invocations: 30-90 days
   - Audit/compliance: per regulatory requirement (often 7 years)
7. **Track model version and prompt template** — when something changes, you need to correlate with what was in production at the time.

---

## AWS 上的两个数据管道

Amazon CloudWatch 通过两个互补的数据管道为 GenAI 提供端到端的 Observability。它们服务于不同的目的，捕获不同的数据，并以不同的方式启用。大多数生产环境需要两者兼备。

![GenAI Telemetry Pipelines](../../../images/GenAI/genai-telemetry-pipelines.png)

### Pipeline 1: Bedrock Model Invocation Logging

A Bedrock-level logging feature that captures the raw request and response for every model invocation. This is **Bedrock-only** — it only covers calls made to Amazon Bedrock foundation models. If you are using non-Bedrock models (self-hosted on SageMaker, external providers), this pipeline does not apply.

**What it captures:**

| Field | Why it matters |
| --- | --- |
| Full request payload | See exactly what was sent to the model, including system prompt and message history |
| Full response payload | See exactly what the model returned, verbatim |
| Inference parameters (`temperature`, `max_tokens`, `top_p`) | Debug unexpected model behavior — was it called with temp 0.7 or 0.0? |
| Caller IAM identity (role ARN) | Security audit, cost attribution per team/role |
| Bedrock operation type | `InvokeModel`, `Converse`, `ConverseStream` |
| Model version | Exact model ID including suffix (e.g., `cohere.command-r-plus-v1:0`) |
| Token counts | Input and output token counts tied directly to content |

**What it does NOT capture:**

- Agent orchestration flow (which tools were called, agent loop behavior)
- Client-side latency
- Distributed trace correlation (no traceId/spanId — only requestId)
- Tool call details
- Infrastructure context
- Non-Bedrock model calls

**Sample log entry:**

```json
{
  "timestamp": "2026-04-17T14:21:50Z",
  "accountId": "123456789012",
  "region": "us-east-1",
  "requestId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "operation": "InvokeModel",
  "modelId": "cohere.command-r-plus-v1:0",
  "input": {
    "inputBodyJson": {
      "message": "Write a short joke about software engineers.",
      "max_tokens": 256,
      "temperature": 0.7
    },
    "inputTokenCount": 8
  },
  "output": {
    "outputBodyJson": {
      "text": "Why did the engineer break up? Because they couldn't commit.",
      "finish_reason": "COMPLETE"
    },
    "outputTokenCount": 20
  },
  "identity": {
    "arn": "arn:aws:sts::123456789012:assumed-role/my-bedrock-role/my-session"
  },
  "schemaType": "ModelInvocationLog"
}
```

**How to enable:**

Manual opt-in via the Amazon Bedrock console (or API). This is the same step whether the model is invoked by an agent, a direct API call, an SDK, or anything else. It applies account-wide to all Bedrock model invocations once turned on.

1. Open the [Amazon Bedrock console](https://console.aws.amazon.com/bedrock/)
2. Choose **Settings**
3. Under **Model invocation logging**, select **Model invocation logging**
4. Choose the required data types to include in the logs. Choose to send the logs to CloudWatch Logs only, or both Amazon S3 and CloudWatch Logs.
5. Under the CloudWatch Logs configurations, create a log group name and select the appropriate service roles
6. Choose **Save settings**

For more information, see [Model Invocations](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/model-invocations.html) and [Set up a CloudWatch Logs destination](https://docs.aws.amazon.com/bedrock/latest/userguide/model-invocation-logging.html#setup-cloudwatch-logs-destination).

**Pre-configured dashboards:**

After enabling Model Invocation Logging, CloudWatch automatically provides dashboards showing:

- **Invocation count** — Number of successful requests to the Converse, ConverseStream, InvokeModel, and InvokeModelWithResponseStream APIs
- **Invocation latency** — Latency of the invocations
- **Token Counts by Model** — Input and output token counts by model
- **Daily Token Counts by ModelID** — Daily total token counts by model ID
- **Requests grouped by input tokens** — Number of requests grouped into token ranges
- **Invocation Throttles** — Number of throttled invocations
- **Invocation Error Count** — Count of invocations resulting in errors

### Pipeline 2: Agent Telemetry (via ADOT SDK)

OpenTelemetry-based traces, spans, and logs captured by the [AWS Distro for OpenTelemetry (ADOT)](https://aws-otel.github.io/docs/introduction) SDK. Unlike Model Invocation Logging, Agent Telemetry works with any model provider (Bedrock, SageMaker, external), not just Bedrock.

**What it captures:**

- **Agent orchestration flow** — which tools were called, in what order, agent loop iterations
- **Model call metadata** — model ID, token counts (input/output), latency, status codes, finish reasons
- **Tool execution details** — tool name, duration, success/failure for every tool call
- **Distributed trace correlation** — traceId, spanId, parentSpanId for full end-to-end request tracing
- **Session tracking** — session.id ties multiple invocations to a single user session
- **Platform and environment context** — cloud.platform, deployment.environment, service metadata

**What it does NOT capture:**

- Inference parameters (temperature, max_tokens, top_p)
- Caller IAM identity
- Full prompt/response content by default (framework-dependent — Strands, LangChain, CrewAI etc. are supported; others vary)

**Sample model call span** (`aws/spans`):

```json
{
  "resource": {
    "attributes": {
      "deployment.environment.name": "bedrock-agentcore:default",
      "service.name": "MyAgent.DEFAULT",
      "cloud.platform": "aws_bedrock_agentcore",
      "telemetry.sdk.version": "1.40.0"
    }
  },
  "traceId": "a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6",
  "spanId": "1a2b3c4d5e6f7a8b",
  "parentSpanId": "9c8d7e6f5a4b3c2d",
  "name": "chat us.anthropic.claude-sonnet-4-6",
  "durationNano": 2644916837,
  "attributes": {
    "gen_ai.request.model": "us.anthropic.claude-sonnet-4-6",
    "gen_ai.usage.input_tokens": 1980,
    "gen_ai.usage.output_tokens": 119,
    "gen_ai.response.finish_reasons": ["tool_use"],
    "http.response.status_code": 200,
    "session.id": "session-a1b2c3d4-e5f6-7890"
  }
}
```

**Sample tool execution span** (`aws/spans`):

```json
{
  "traceId": "a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6",
  "spanId": "2b3c4d5e6f7a8b9c",
  "parentSpanId": "d4e5f6a7b8c9d0e1",
  "name": "execute_tool http_request",
  "durationNano": 37505594,
  "attributes": {
    "gen_ai.tool.name": "http_request",
    "gen_ai.tool.status": "success",
    "gen_ai.system": "strands-agents"
  }
}
```

**Where the data lands:**

| Log Group | What's in it |
| --- | --- |
| `aws/spans` | OTel trace spans — model calls, tool executions, agent loop iterations |
| `/aws/bedrock-agentcore/runtimes/<agent>` (runtime-logs) | Application stdout/stderr — startup logs, errors, custom app logging |
| `/aws/bedrock-agentcore/runtimes/<agent>` (otel-rt-logs) | OTel log records from agent framework (prompt/response content for supported frameworks) |

**What it powers in CloudWatch:**

- **Application Signals dashboards** — latency percentiles, error rates, throughput
- **Application Maps** — visualize agent → model → tool call chains
- **Distributed Tracing** — end-to-end request tracing across services
- **SLO monitoring**
- **Trace analytics** — drill into individual requests end-to-end
- **Correlation with infrastructure metrics**

**How to enable:**

| Deployment Model | What you do |
| --- | --- |
| Bedrock AgentCore | Nothing — ADOT SDK is baked into the runtime. Telemetry flows automatically. |
| Non-AgentCore (EKS/ECS/self-hosted) | Attach the ADOT auto-instrumentation agent. No code changes needed. |

---

## 并行比较

| What you want to know | Model Invocation Logging (Bedrock only) | Agent Telemetry (ADOT) |
| --- | --- | --- |
| Which model was called? | ✅ | ✅ |
| Latency / duration? | ❌ | ✅ (client-side) |
| Token counts? | ✅ | ✅ |
| Error rates / status? | ✅ | ✅ |
| Agent orchestration flow? | ❌ | ✅ |
| Tool call details? | ❌ | ✅ |
| Full prompt text? | ✅ | Framework-dependent |
| Full model response? | ✅ | Framework-dependent |
| Inference parameters? | ✅ | ❌ |
| Caller IAM identity? | ✅ | ❌ |
| Distributed trace correlation? | ❌ | ✅ |
| Works for non-agent Bedrock calls? | ✅ | ❌ |
| Works for non-Bedrock models? | ❌ (Bedrock only) | ✅ |
| Application Signals / Application Maps? | ❌ | ✅ |

Prompt/response content capture in Pipeline 2 depends on the agent framework's OTel instrumentation. Strands, LangChain, and CrewAI are supported; other frameworks may vary.

**In summary:** Agent Telemetry tells you *how your agent is performing*. Model Invocation Logging tells you *what your model is saying and who is asking*. For complete observability, enable both.

---

## 为 Agentic 工作负载启用 Observability

在开始之前，启用 [CloudWatch Transaction Search](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Enable-TransactionSearch.html) 以解锁完整的 GenAI Observability 体验。

### AgentCore Runtime hosted agents

AgentCore Runtime is a secure, serverless runtime purpose-built for deploying and scaling dynamic AI agents and tools. It supports any open-source framework including LangGraph, CrewAI, Strands Agents, any protocol, and any model.

Observability is built in — the ADOT SDK is baked into the AgentCore runtime. Metrics are automatically generated, and traces flow without any code changes.

- [Configure custom observability](https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/observability-configure.html#observability-configure-custom)
- [Step-by-step tutorial: Enabling observability for AgentCore Runtime hosted agents](https://aws.github.io/bedrock-agentcore-starter-toolkit/user-guide/observability/quickstart.html#enabling-observability-for-agentcore-runtime-hosted-agents)

### Non-AgentCore hosted agents (EKS, ECS, self-hosted)

You can host your agents outside of AgentCore and bring your observability data into CloudWatch for end-to-end monitoring in one location. Attach the ADOT auto-instrumentation agent to your workload — no code changes needed.

- [Configure third-party observability](https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/observability-configure.html#observability-configure-3p)
- [Step-by-step tutorial: Enabling observability for non-AgentCore hosted agents](https://aws.github.io/bedrock-agentcore-starter-toolkit/user-guide/observability/quickstart.html#enabling-observability-for-non-agentcore-hosted-agents)

### AgentCore memory, gateway, and built-in tool resources

Gain visibility into the metrics and traces of AgentCore modular services. See [Configure CloudWatch observability](https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/observability-configure.html#observability-configure-cloudwatch).

### AgentCore Evaluations

AgentCore Evaluations provide capabilities to monitor and assess the performance, quality, and reliability of your AI agents. See [AgentCore evaluations](https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/evaluations.html).

### Enablement Summary

| Component | AgentCore | Non-AgentCore (EKS/ECS) |
| --- | --- | --- |
| Metrics | Automatic | ADOT auto-instrumentation agent |
| Agent traces and spans | Automatic (ADOT baked in) | ADOT auto-instrumentation agent |
| Model Invocation Logging | Manual opt-in via Bedrock console | Manual opt-in via Bedrock console |

The only thing that truly requires manual opt-in across both paths is Model Invocation Logging. Everything else is either automatic or handled by attaching the ADOT auto-instrumentation agent.

---

## 保护敏感数据

When logging model invocations, prompts and responses may contain PII or sensitive information. Amazon CloudWatch Logs provides data protection policies to identify and mask sensitive data using machine learning and pattern matching.

You can configure data protection at two levels:

### Account-level data protection

1. Open the Amazon CloudWatch console
2. In the navigation pane, choose **Settings**
3. Choose the **Logs** tab
4. Choose **Configure the Data protection account policy**
5. Specify the data identifiers relevant to your data (managed or custom)
6. (Optional) Choose a destination for audit findings (CloudWatch Logs, Firehose, or S3)
7. Choose **Activate data protection**

### Log-group-level data protection

1. Open the Amazon CloudWatch console
2. In the navigation panel, choose **Logs**, **Log Management**
3. Choose the **Log groups** tab, select the log group (e.g., `aws/bedrock/modelinvocations`), and choose **Create data protection policy**
4. Specify the data identifiers relevant to your data
5. (Optional) Choose a destination for audit findings
6. Choose **Activate data protection**

For more information, see [Protecting sensitive log data with masking](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/cloudwatch-logs-data-protection-policies.html) and [Protect sensitive data](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/mask-sensitive-data.html).

---

## 何时启用什么

| Scenario | Model Invocation Logging | Agent Telemetry (ADOT) |
| --- | --- | --- |
| Using Bedrock without agents (direct API) | ✅ Only option | ❌ Not applicable |
| Compliance/audit trail of all LLM interactions | ✅ Required | Nice to have |
| Debugging prompt quality or unexpected model outputs | ✅ Required (inference params + content) | Helpful for context |
| Cost attribution per team/role | ✅ Required (IAM identity) | ❌ Cannot do this |
| Building evaluation/fine-tuning pipelines | ✅ Required (structured content) | Framework-dependent |
| Running agents, wants operational dashboards | Nice to have | ✅ Required |
| Latency/error monitoring only | Not needed | ✅ Sufficient |

---

## 构建 Dashboard

Once both pipelines are flowing, you can build dashboards for different audiences. For ready-to-use queries, see the [Creating Custom Dashboards for GenAI Telemetry](../custom-dashboards-for-genai-telemetry) guide.

### Dashboard Tiers by Audience

**Executive dashboard** — high-level KPIs:

- Total daily cost
- Request volume trends
- Error rate
- Top models by usage

**DevOps dashboard** — real-time monitoring:

- Stop reason breakdown (end_turn vs tool_use vs max_tokens)
- Completion rate vs truncation trend
- Agent traces vs errors (hourly)
- Span error drill-down
- Component performance breakdown (P50/P95/P99)
- Cross-region inference latency

**FinOps dashboard** — cost management:

- Total spend (hourly, daily, monthly)
- Cost distribution by model
- Top 10 spenders by role/user
- Input vs output cost split
- Prompt caching opportunities
- Daily cost trend with anomaly detection

**Developer dashboard** — debugging and optimization:

- Request traces
- Token usage by feature
- Latency breakdown
- Error details with stack traces
- Token efficiency (high input, low output waste detection)

### Sample DevOps Query: Completion Rate

Tracks hourly ratio of successful completions vs truncated responses. Target 95%+ completion rate.

```text
fields @timestamp, modelId,
       output.outputBodyJson.stopReason as stop_reason
| filter schemaType = "ModelInvocationLog"
| filter ispresent(output.outputBodyJson.stopReason)
| stats sum(stop_reason = "end_turn" or stop_reason = "tool_use") as ok,
        sum(stop_reason = "max_tokens") as truncated
  by bin(@timestamp, 1h) as hour
| sort hour desc
```

### Sample FinOps Query: Top Spenders by Role

```text
SOURCE "bedrock-model-invocation-logging"
| filter @logStream = 'aws/bedrock/modelinvocations'
| fields replace(`identity.arn`, "arn:aws:sts::ACCOUNT_ID:assumed-role/", "") as userRole
| stats sum(totalCostUSD) as spend, count(*) as invocations
  by userRole
| sort spend desc
| limit 10
```

See the [dashboard queries guide](../custom-dashboards-for-genai-telemetry) for the full cost calculation and more examples.

---

## 告警策略

Set up alerts in tiers matching urgency and impact.

### Critical Alerts (page immediately)

- Error rate above 5%
- P95 latency above 10 seconds
- Daily cost above 150% of baseline
- Model unavailability
- Agent error rate above 10% for 15 minutes

### Warning Alerts (investigate during business hours)

- Token usage trending up 20% week-over-week
- Latency degradation over 7 days
- Cache hit rate dropping
- Unusual request patterns
- Completion rate below 95% for 2 hours
- Component P95 above 5000ms

### Informational Alerts (daily digest)

- Daily cost summaries
- Weekly usage reports
- Model performance comparisons
- Top spenders report

### Alert Routing Example

```yaml
route:
  group_by: ['alertname', 'cloud_provider']
  group_wait: 30s
  group_interval: 5m
  repeat_interval: 4h
  receiver: 'default'
  routes:
    - match:
        severity: critical
      receiver: 'pagerduty'
    - match:
        severity: warning
      receiver: 'slack-ops'
    - match:
        alertname: MonthlyBudgetExceeded
      receiver: 'slack-finops'
```

---

## Observability 成熟度模型

**Level 1: Basic Monitoring**

- Track request counts and errors
- Basic latency metrics
- Manual cost tracking

**Level 2: Comprehensive Metrics**

- Token-level tracking
- Multi-dimensional metrics (model, team, environment)
- Automated dashboards
- Basic alerting with baselines

**Level 3: Advanced Analytics**

- Distributed tracing across agent workflows
- Cost attribution per team/feature
- Quality scoring and user feedback integration
- Predictive alerting based on trends

**Level 4: AI-Powered Observability**

- Anomaly detection on cost and behavior
- Automated root cause analysis
- Self-healing systems (automatic fallback to cheaper models)
- Continuous optimization loops

---

## 与 MLOps 的集成

Observability should extend across the ML lifecycle, not just production:

**Training Phase:**

- Track training costs and duration
- Monitor model quality metrics
- Version control for models and prompts

**Deployment Phase:**

- Canary deployments with metric comparison
- Blue-green deployment monitoring
- Rollback triggers based on observability signals

**Production Phase:**

- Continuous monitoring
- Automated retraining triggers based on drift detection
- Performance degradation detection

**Optimization Phase:**

- A/B testing frameworks for prompts and models
- Cost-performance tradeoff analysis
- Prompt engineering feedback loops

---

## 需要避免的常见反模式

1. **Logging full prompts and responses without PII redaction** — compliance violations, data breach risk. Configure data protection policies *before* enabling Model Invocation Logging.
2. **Tracking only aggregate metrics** — you can't debug individual issues or attribute costs without per-request detail.
3. **Setting alerts without baselines** — alert fatigue from false positives. Always establish normal behavior first.
4. **Ignoring token usage until the bill arrives** — by the time you see the bill, the damage is done. Monitor daily.
5. **Using different metric names per provider** — you can't compare performance across models. Standardize on OpenTelemetry GenAI semantic conventions.
6. **Storing telemetry data indefinitely** — compliance issues and unnecessary storage costs. Set retention policies per data class.
7. **Manual dashboard creation** — inconsistency and maintenance burden. Use Infrastructure as Code for dashboards.
8. **Monitoring only technical metrics** — you miss quality and business impact issues. Track user satisfaction alongside latency.

---

## 入门清单

### Pre-Production

- [ ] Enable CloudWatch Transaction Search
- [ ] For AgentCore: deploy your agent — telemetry flows automatically
- [ ] For non-AgentCore: attach the ADOT auto-instrumentation agent
- [ ] Enable Bedrock Model Invocation Logging via the Bedrock console
- [ ] Configure data protection policies for PII redaction
- [ ] Set log retention policies for each log group
- [ ] Build initial dashboards using the [dashboard queries guide](../custom-dashboards-for-genai-telemetry)
- [ ] Document baseline metrics (latency, token usage, cost)
- [ ] Configure alarms with appropriate thresholds
- [ ] Create runbooks for common issues

### Production

- [ ] Monitoring enabled in production
- [ ] Alerts routed to correct channels (PagerDuty, Slack)
- [ ] Team access configured (read-only dashboards for stakeholders)
- [ ] Backup and disaster recovery tested
- [ ] Regular review schedule established (weekly cost review, monthly performance review)

---

## 其他资源

### 配套指南

- [Creating Custom Dashboards for GenAI Telemetry](../custom-dashboards-for-genai-telemetry) — Turn the telemetry into persona-based dashboards for DevOps, FinOps, and other stakeholders

### AWS Documentation

- [Model Invocations — CloudWatch GenAI Observability](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/model-invocations.html)
- [Getting Started with AgentCore Observability](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/AgentCore-GettingStarted.html)
- [Set up Bedrock Model Invocation Logging](https://docs.aws.amazon.com/bedrock/latest/userguide/model-invocation-logging.html#setup-cloudwatch-logs-destination)
- [Protect Sensitive Data in CloudWatch Logs](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/mask-sensitive-data.html)
- [Configure Custom Observability for AgentCore](https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/observability-configure.html#observability-configure-custom)
- [Configure Third-Party Observability](https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/observability-configure.html#observability-configure-3p)
- [AgentCore Evaluations](https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/evaluations.html)

### Standards and Tools

- [AWS Distro for OpenTelemetry (ADOT)](https://aws-otel.github.io/docs/introduction)
- [OpenTelemetry GenAI Semantic Conventions](https://opentelemetry.io/docs/specs/semconv/gen-ai/)
- [OpenTelemetry Specification](https://opentelemetry.io/docs/)

---

**Contributors:** AWS Observability Team
**Last Updated:** 2026-04-21

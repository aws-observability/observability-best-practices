# MCP Server 演示查询

本指南提供了您可以用来测试 MCP server 与 Kiro IDE 集成的自然语言查询示例。

## 先决条件

1. 确保您已在 Kiro 中设置了 MCP server（请参阅 `SETUP-MCP-KIRO.md`）
2. 运行多云演示以生成遥测数据：`python3 AI-OBS_DEMO/multi-cloud-demo.py`
3. 等待 1-2 分钟让 metrics 出现在 CloudWatch 中

## 截图示例查询

### 1. Token 使用量分析

**查询**: "Which model is consuming the most tokens?"

**预期响应**:
```json
{
  "token_type": "input",
  "time_range_hours": 1,
  "models": [
    {
      "model": "anthropic.claude-3-haiku-20240307-v1:0",
      "total_tokens": 475
    },
    {
      "model": "gpt-4o",
      "total_tokens": 312
    },
    {
      "model": "gemini-1.5-pro",
      "total_tokens": 289
    }
  ]
}
```

**替代查询**:
- "Show me input token usage for the last hour"
- "How many output tokens has Claude Haiku used?"
- "Compare token consumption across all models"

---

### 2. 延迟统计

**查询**: "What is the average latency for Claude Haiku?"

**预期响应**:
```json
{
  "model": "anthropic.claude-3-haiku-20240307-v1:0",
  "avg_latency_ms": 1234.56,
  "max_latency_ms": 1876.23,
  "min_latency_ms": 892.45,
  "time_range_hours": 1,
  "datapoints": 31
}
```

**替代查询**:
- "Show me latency statistics for all models"
- "Which model has the highest latency?"
- "What's the fastest model in terms of response time?"

---

### 3. 请求量

**查询**: "How many requests have been made in the last hour?"

**预期响应**:
```json
{
  "time_range_hours": 1,
  "models": [
    {
      "model": "anthropic.claude-3-sonnet-20240229-v1:0",
      "total_requests": 81
    },
    {
      "model": "anthropic.claude-3-haiku-20240307-v1:0",
      "total_requests": 31
    },
    {
      "model": "gpt-4o",
      "total_requests": 21
    }
  ]
}
```

**替代查询**:
- "Show me request counts by model"
- "Which model is being used the most?"
- "How many times was GPT-4o invoked?"

---

### 4. 成本估算

**查询**: "Estimate the cost of LLM usage for the last hour"

**预期响应**:
```json
{
  "time_range_hours": 1,
  "total_estimated_cost_usd": 0.0142,
  "cost_breakdown": [
    {
      "model": "anthropic.claude-3-haiku-20240307-v1:0",
      "input_tokens": 475,
      "output_tokens": 8084,
      "estimated_cost_usd": 0.0102
    },
    {
      "model": "anthropic.claude-3-sonnet-20240229-v1:0",
      "input_tokens": 312,
      "output_tokens": 2456,
      "estimated_cost_usd": 0.0031
    }
  ],
  "note": "Costs are estimates based on Claude 3 Haiku pricing ($0.25/$1.25 per 1M tokens)"
}
```

**替代查询**:
- "What's my estimated LLM cost today?"
- "How much am I spending on Claude models?"
- "Calculate the cost per request"

---

### 5. 模型比较

**查询**: "Compare all models by latency and token usage"

**预期响应**:
```json
{
  "time_range_hours": 1,
  "latency": {
    "models": [
      {
        "model": "anthropic.claude-3-sonnet-20240229-v1:0",
        "avg_latency_ms": 2567.89
      },
      {
        "model": "gpt-4o",
        "avg_latency_ms": 2234.12
      },
      {
        "model": "anthropic.claude-3-haiku-20240307-v1:0",
        "avg_latency_ms": 1234.56
      }
    ]
  },
  "input_tokens": {
    "models": [
      {
        "model": "anthropic.claude-3-haiku-20240307-v1:0",
        "total_tokens": 475
      },
      {
        "model": "anthropic.claude-3-sonnet-20240229-v1:0",
        "total_tokens": 312
      }
    ]
  },
  "output_tokens": {
    "models": [
      {
        "model": "anthropic.claude-3-haiku-20240307-v1:0",
        "total_tokens": 8084
      },
      {
        "model": "anthropic.claude-3-sonnet-20240229-v1:0",
        "total_tokens": 2456
      }
    ]
  },
  "requests": {
    "models": [
      {
        "model": "anthropic.claude-3-sonnet-20240229-v1:0",
        "total_requests": 81
      },
      {
        "model": "anthropic.claude-3-haiku-20240307-v1:0",
        "total_requests": 31
      }
    ]
  }
}
```

**替代查询**:
- "Show me a comparison of all active models"
- "Which model offers the best performance?"
- "Compare Claude Haiku vs Claude Sonnet"

---

## 高级查询

### 时间范围查询

**查询**: "Show me token usage for the last 2 hours"

MCP server 支持使用 `hours` 参数的自定义时间范围。

### 特定模型查询

**查询**: "What's the latency for anthropic.claude-3-haiku-20240307-v1:0?"

您可以使用完整的模型 ID 查询特定模型。

### 多 Metrics 查询

**查询**: "Give me a complete overview of Claude Haiku performance"

这将触发 `compare_models` 工具来显示指定模型的所有 metrics。

---

## 截图技巧

### 最佳演示截图查询

1. **成本分析**（最具影响力）：
   ```
   "Estimate the cost of LLM usage for the last hour"
   ```
   以美元金额展示真实的业务价值。

2. **模型比较**（最全面）：
   ```
   "Compare all models by latency and token usage"
   ```
   展示跨提供商的统一 Observability 能力。

3. **简单查询**（最易理解）：
   ```
   "Which model is consuming the most tokens?"
   ```
   易于理解，展示自然语言能力。

### 截图构图技巧

1. **展示查询**：确保自然语言查询可见
2. **展示响应**：包含带数据的完整 JSON 响应
3. **展示上下文**：如果可能，包含 IDE 上下文（文件浏览器、终端）
4. **突出关键数据**：指出响应中有趣的洞察

### 示例截图流程

1. 打开 Kiro IDE
2. 打开聊天面板
3. 输入："Estimate the cost of LLM usage for the last hour"
4. 等待 MCP server 响应
5. 截图展示：
   - 您的自然语言查询
   - 结构化的 JSON 响应
   - 按模型的成本明细
   - 总估算成本

---

## 故障排除

### "无数据"响应

**问题**: MCP server 返回空结果

**解决方案**:
1. 运行演示以生成 metrics：`python3 AI-OBS_DEMO/multi-cloud-demo.py`
2. 等待 1-2 分钟让 CloudWatch 接收 metrics
3. 尝试增加时间范围："Show me token usage for the last 2 hours"

### MCP Server 无响应

**问题**: 查询超时或失败

**解决方案**:
1. 检查 MCP server 是否正在运行：在 Kiro MCP 面板中查找 "ai-observability"
2. 验证 AWS 凭证：`aws sts get-caller-identity`
3. 检查 CloudWatch 权限：确保有 CloudWatch metrics 的读取权限
4. 重启 Kiro 以重新加载 MCP 配置

### 权限错误

**问题**: 响应中出现 "AccessDenied" 错误

**解决方案**:
1. 验证 IAM 权限包含 `cloudwatch:GetMetricStatistics`
2. 验证 IAM 权限包含 `cloudwatch:ListMetrics`
3. 检查 AWS region 在 MCP 配置中设置为 `us-east-1`

---

## 直接测试 MCP Server

您也可以不通过 Kiro 直接测试 MCP server：

```bash
python3 AI-OBS_DEMO/test-mcp-server.py
```

这将运行所有 5 个 MCP 工具并显示结果，适用于：
- 验证 MCP server 是否工作
- 调试问题
- 理解响应格式
- 为文档生成示例数据

---

## 后续步骤

截图完成后：

1. **添加到博客文章**：在"演示结果"部分包含截图
2. **创建教程**：使用截图创建分步指南
3. **与团队分享**：演示自然语言查询能力
4. **收集反馈**：询问开发人员还需要哪些查询

---

## 其他资源

- **MCP Server 代码**: `AI-OBS_DEMO/mcp-server/cloudwatch_mcp_server.py`
- **设置指南**: `AI-OBS_DEMO/SETUP-MCP-KIRO.md`
- **测试脚本**: `AI-OBS_DEMO/test-mcp-server.py`
- **Kiro 配置**: `AI-OBS_DEMO/kiro-mcp-config.json`

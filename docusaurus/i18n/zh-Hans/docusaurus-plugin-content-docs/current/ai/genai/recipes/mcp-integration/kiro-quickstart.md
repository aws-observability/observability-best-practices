# Kiro IDE MCP Server - 快速入门指南

## 您将获得什么

直接在 Kiro IDE 中用简单的英语提问：
- "Which model is consuming the most tokens?"
- "What's the average latency for Claude Haiku?"
- "Estimate my LLM costs for the last hour"

无需切换到 dashboard 或编写复杂的查询！

---

## 步骤 1：在 Kiro 中配置 MCP Server

### 选项 A：使用工作区配置（推荐）

1. **创建 MCP 配置目录**：
   ```bash
   mkdir -p .kiro/settings
   ```

2. **复制 MCP 配置**：
   ```bash
   cp AI-OBS_DEMO/kiro-mcp-config.json .kiro/settings/mcp.json
   ```

3. **更新配置中的路径**（如需要）：
   打开 `.kiro/settings/mcp.json` 并验证 `cloudwatch_mcp_server.py` 的路径正确：
   ```json
   {
     "mcpServers": {
       "ai-observability": {
         "command": "python3",
         "args": [
           "/path/to/mcp-server/cloudwatch_mcp_server.py"
         ],
         "env": {
           "AWS_REGION": "your-aws-region"
         },
         "disabled": false,
         "autoApprove": []
       }
     }
   }
   ```

### 选项 B：使用用户级配置（全局）

1. **创建用户配置目录**：
   ```bash
   mkdir -p ~/.kiro/settings
   ```

2. **复制配置**：
   ```bash
   cp AI-OBS_DEMO/kiro-mcp-config.json ~/.kiro/settings/mcp.json
   ```

---

## 步骤 2：验证 AWS 凭证

MCP server 需要 AWS 凭证来查询 CloudWatch：

```bash
# Check your AWS credentials are configured
aws sts get-caller-identity

# Should show:
# {
#     "UserId": "...",
#     "Account": "<your-account-id>",
#     "Arn": "arn:aws:iam::<your-account-id>:user/<your-username>"
# }
```

如果尚未配置，设置 AWS 凭证：
```bash
aws configure
# Enter your AWS Access Key ID
# Enter your AWS Secret Access Key
# Default region: your-aws-region
# Default output format: json
```

---

## 步骤 3：测试 MCP Server（可选）

在 Kiro 中使用之前，验证 MCP server 是否工作：

```bash
python3 AI-OBS_DEMO/test-mcp-server.py
```

您应该看到类似以下的输出：
```
Testing CloudWatch MCP Server
==============================

1. Testing get_token_usage...
Success: {
  "token_type": "input",
  "time_range_hours": 1,
  "models": [...]
}

2. Testing get_model_latency...
Success: {...}
```

---

## 步骤 4：重启 Kiro IDE

为了让 Kiro 加载 MCP 配置：

1. **保存所有工作**
2. **完全退出 Kiro**（Mac 上 Cmd+Q，或 文件 -> 退出）
3. **重新打开 Kiro**
4. **打开您的工作区**（包含 `.kiro/settings/mcp.json` 的文件夹）

---

## 步骤 5：验证 MCP Server 已连接

1. **打开 Kiro 功能面板**（左侧边栏）
2. **查找 "MCP Servers" 部分**
3. **您应该看到**：`ai-observability` 带有绿色状态指示器
4. **如果看到红色指示器**：点击查看错误详情

### 连接问题故障排除

如果 server 显示为断开连接：

1. **检查 MCP Server 视图**，在 Kiro 的左侧面板中
2. **点击"重新连接"**（如果可用）
3. **检查日志**：在 MCP server 输出中查找错误消息
4. **验证 Python 路径**：确保 `python3` 在您的 PATH 中
5. **检查文件权限**：确保 `cloudwatch_mcp_server.py` 可读

---

## 步骤 6：使用自然语言查询

### 在 Kiro 聊天中

1. **打开 Kiro 聊天**（Cmd+L 或点击聊天图标）
2. **输入您的问题**，使用简单的英语：

```
Which model is consuming the most tokens?
```

3. **Kiro 将自动**：
   - 识别这是一个可观测性查询
   - 调用 MCP server 的 `get_token_usage` 工具
   - 返回结构化结果

### 尝试的示例查询

#### 1. Token 使用量
```
Which model is consuming the most tokens?
```

**预期响应**：
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
    }
  ]
}
```

#### 2. 延迟统计
```
What's the average latency for all models?
```

**预期响应**：
```json
{
  "time_range_hours": 1,
  "models": [
    {
      "model": "anthropic.claude-3-sonnet-20240229-v1:0",
      "avg_latency_ms": 2567.89
    },
    {
      "model": "gpt-4o",
      "avg_latency_ms": 2234.12
    }
  ]
}
```

#### 3. 成本估算
```
Estimate the cost of LLM usage for the last hour
```

**预期响应**：
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
    }
  ]
}
```

#### 4. 请求量
```
How many requests have been made in the last hour?
```

#### 5. 模型比较
```
Compare all models by latency and token usage
```

---

## 步骤 7：高级用法

### 自定义时间范围

您可以在查询中指定自定义时间范围：

```
Show me token usage for the last 2 hours
```

```
What was the latency for Claude Haiku in the last 3 hours?
```

### 特定模型查询

使用完整 ID 查询特定模型：

```
What's the latency for anthropic.claude-3-haiku-20240307-v1:0?
```

### 多 Metrics 查询

请求全面分析：

```
Give me a complete overview of Claude Haiku performance
```

---

## 故障排除

### "无数据"响应

**问题**：MCP server 返回空结果

**解决方案**：
1. 运行演示以生成 metrics：
   ```bash
   python3 AI-OBS_DEMO/multi-cloud-demo.py
   ```
2. 等待 1-2 分钟让 CloudWatch 接收 metrics
3. 尝试增加时间范围："Show me token usage for the last 2 hours"

### MCP Server 无响应

**问题**：查询超时或失败

**解决方案**：
1. 在 Kiro 的 MCP 面板中检查 MCP server 状态
2. 验证 AWS 凭证：`aws sts get-caller-identity`
3. 检查 CloudWatch 权限
4. 重启 Kiro 以重新加载 MCP 配置

### 权限错误

**问题**：响应中出现 "AccessDenied" 错误

**解决方案**：
1. 验证 IAM 权限包含：
   - `cloudwatch:GetMetricStatistics`
   - `cloudwatch:ListMetrics`
2. 检查 AWS region 是否正确设置

### Python 路径问题

**问题**："python3: command not found"

**解决方案**：
1. 查找 Python 路径：`which python3`
2. 使用完整路径更新 MCP 配置：
   ```json
   "command": "/usr/local/bin/python3"
   ```

---

## 最佳实践技巧

### 1. 生成新数据

查询前，运行演示以确保有最近的 metrics：
```bash
python3 AI-OBS_DEMO/multi-cloud-demo.py
```

### 2. 使用自然语言

MCP server 理解自然语言问题：
- "Which model costs the most?"
- "Show me latency for all models"
- "How many tokens did Claude use?"

### 3. 需要时具体化

对于特定模型，使用完整 ID：
```
What's the latency for anthropic.claude-3-haiku-20240307-v1:0?
```

### 4. 结合代码上下文

您可以在查看代码时提问：
```
Based on this code, estimate the cost if we run it 1000 times
```

---

## 可用的 MCP 工具

MCP server 提供 5 个工具：

| 工具 | 描述 | 示例查询 |
|------|-------------|---------------|
| `get_token_usage` | 按模型的 Token 消耗 | "Which model uses the most tokens?" |
| `get_model_latency` | 延迟统计 | "What's the average latency?" |
| `get_request_count` | 请求量 | "How many requests were made?" |
| `get_cost_estimate` | 成本估算 | "Estimate my LLM costs" |
| `compare_models` | 多 Metrics 比较 | "Compare all models" |

---

## 后续步骤

### 为演示截图

1. 运行演示：`python3 AI-OBS_DEMO/multi-cloud-demo.py`
2. 等待 1-2 分钟
3. 提问："Estimate the cost of LLM usage for the last hour"
4. 截图展示查询 + 响应

### 为您的用例自定义

编辑 `mcp-server/cloudwatch_mcp_server.py` 以：
- 添加自定义 metrics
- 更改成本计算公式
- 添加新的查询工具
- 集成其他 AWS 服务

### 与团队分享

1. 将 `.kiro/settings/mcp.json` 提交到您的仓库
2. 团队成员将自动获得 MCP 访问权限
3. 每个人都可以从 IDE 中查询可观测性数据

---

## 资源

- **MCP Server 代码**：`AI-OBS_DEMO/mcp-server/cloudwatch_mcp_server.py`
- **测试脚本**：`AI-OBS_DEMO/test-mcp-server.py`
- **示例查询**：`AI-OBS_DEMO/MCP-DEMO-QUERIES.md`
- **架构**：`AI-OBS_DEMO/ARCHITECTURE.md`

---

## 快速参考卡

```bash
# Setup
mkdir -p .kiro/settings
cp AI-OBS_DEMO/kiro-mcp-config.json .kiro/settings/mcp.json

# Test
python3 AI-OBS_DEMO/test-mcp-server.py

# Generate Data
python3 AI-OBS_DEMO/multi-cloud-demo.py

# Restart Kiro
# Cmd+Q -> Reopen

# Query in Chat
"Which model is consuming the most tokens?"
```

---

**有疑问？** 查看 `MCP-DEMO-QUERIES.md` 了解更多示例或在 GitHub 上提交 issue。

# AI 可观测性演示

多云 AI 原生全栈可观测性平台，用于监控 LLM 工作负载。

## 快速开始

### 先决条件
- 具有 Bedrock 访问权限的 AWS 账户。此演示在 us-east-1 中使用 Claude 3 Haiku/Sonnet，但您可以通过更新 `gateway/litellm-config.yaml` 中的模型 ID 来替换任何 Bedrock 支持的模型。可观测性管道与模型无关，可与 LiteLLM 支持的任何 LLM 提供商配合使用。
- 配置了 AdministratorAccess 的 AWS CLI
- Docker Desktop 正在运行
- Docker Compose v2
- Python 3.11+
- Terraform 1.5.0+

### 阶段 1：基础设施部署

```bash
cd AI-OBS_DEMO/terraform
terraform init
terraform plan -out=tfplan
terraform apply tfplan

# 捕获输出
export AMP_WORKSPACE_ID=$(terraform output -raw amp_workspace_id)
export AMP_REMOTE_WRITE_URL=$(terraform output -raw amp_remote_write_url)
export AMP_ENDPOINT=$(terraform output -raw amp_endpoint)
```

### 阶段 2：环境配置

```bash
cd ..
cp .env.example .env

# 使用您的 AWS 凭证和 Terraform 输出编辑 .env
# 添加：
# - AWS_ACCESS_KEY_ID
# - AWS_SECRET_ACCESS_KEY
# - AWS_SESSION_TOKEN（如果使用临时凭证）
# - AMP_REMOTE_WRITE_URL（来自 Terraform）
# - AMP_ENDPOINT（来自 Terraform）
```

### 阶段 3：构建和启动

```bash
# 构建所有服务
docker compose build

# 启动堆栈
docker compose up -d

# 验证服务
docker compose ps

# 检查 OTEL Collector 健康状态
curl http://localhost:13133

# 运行演示并查看日志
docker compose logs -f ai-app
```

### 阶段 4：验证遥测数据

```bash
# 安装 awscurl
pip3 install awscurl

# 查询 AMP 的 token 使用情况
awscurl --service aps --region us-east-1 \
  "${AMP_ENDPOINT}api/v1/query?query=gen_ai_usage_input_tokens_total"

# 在 AWS 控制台中检查 X-Ray traces
# 导航到：X-Ray > Traces > 按服务筛选：ai-observability-demo

# 检查 CloudWatch logs
# 导航到：CloudWatch > Log Groups > /ai-observability-demo
```

### 阶段 5：Grafana Dashboard

1. 打开 AWS 控制台 → Amazon Managed Grafana → ai-可观测性-demo
2. 点击 "Open Grafana"
3. 添加数据源：
   - Prometheus：使用 AMP endpoint 和 SigV4 认证
   - CloudWatch：设置为您资源所在的区域
   - X-Ray：设置为与 CloudWatch 相同的区域
4. 导入 dashboard：`grafana/dashboards/ai-observability.json`

### 阶段 6：MCP Server 集成

```bash
# 安装 MCP server 依赖
cd mcp-server
pip3 install -r requirements.txt

# 配置 Kiro MCP
# 添加到 .kiro/mcp.json：
{
  "mcpServers": {
    "ai-observability": {
      "command": "python3",
      "args": ["/path/to/AI-OBS_DEMO/mcp-server/prometheus_mcp_server.py"],
      "env": {
        "AMP_ENDPOINT": "your-amp-endpoint",
        "AWS_REGION": "your-aws-region",
        "AWS_ACCESS_KEY_ID": "your-key",
        "AWS_SECRET_ACCESS_KEY": "your-secret",
        "AWS_SESSION_TOKEN": "your-token"
      }
    }
  }
}
```

:::tip 区域配置
将 `AWS_REGION` 设置为您的可观测性资源（AMP、CloudWatch、X-Ray）所在的区域。支持这些服务的任何 AWS 区域都可以使用。
:::

### 在 Kiro 中进行自然语言查询

配置完成后，您可以向 Kiro 提问：
- "目前哪个模型消耗的 token 最多？"
- "过去一小时 Claude Haiku 的 P95 延迟是多少？"
- "过去 30 分钟是否有任何限流事件？"
- "估算今天的 LLM 使用成本"
- "比较所有活跃模型的延迟"

## 清理

```bash
# 停止并删除容器
docker compose down

# 销毁 AWS 资源
cd terraform
terraform destroy -auto-approve

# 删除项目（可选）
cd ../..
rm -rf AI-OBS_DEMO
```

## 架构

- **OpenTelemetry**：使用 GenAI 语义约定的供应商中立检测
- **LiteLLM**：多提供商 AI 网关（AWS Bedrock、Azure OpenAI 等）
- **Amazon Managed Prometheus**：使用 SigV4 认证的可扩展 metrics 存储
- **AWS X-Ray**：LLM 调用的分布式追踪
- **Amazon Managed Grafana**：跨 AMP、CloudWatch、X-Ray 的统一可视化
- **自定义 MCP Server**：通过 Kiro 进行自然语言可观测性查询

## 扩展到多云

1. **Azure OpenAI**：将真实凭证添加到 `.env` - LiteLLM 自动处理路由
2. **GCP Vertex AI**：将 Vertex AI 模型添加到 `gateway/litellm-config.yaml`
3. **本地模型**：在本地部署 vLLM/Ollama，作为 LiteLLM 提供商添加
4. **联合 metrics**：在每个云中部署 OTEL Collector，远程写入同一个 AMP 工作区

## 参考资料

- [OpenTelemetry GenAI Semantic Conventions](https://opentelemetry.io/docs/specs/semconv/gen-ai/)
- [Amazon Managed Prometheus](https://docs.aws.amazon.com/prometheus/)
- [Amazon Managed Grafana](https://docs.aws.amazon.com/grafana/)
- [LiteLLM Proxy](https://docs.litellm.ai/docs/proxy/quick_start)
- [AWS Bedrock 可观测性](https://docs.aws.amazon.com/bedrock/latest/userguide/monitoring-cloudwatch.html)

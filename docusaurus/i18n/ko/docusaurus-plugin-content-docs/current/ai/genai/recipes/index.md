# AI Observability 데모

멀티 클라우드 AI 네이티브 풀스택 Observability 플랫폼으로 LLM 워크로드를 모니터링합니다.

## 빠른 시작

### 사전 요구 사항
- Bedrock 액세스가 가능한 AWS 계정. 이 데모는 us-east-1에서 Claude 3 Haiku/Sonnet을 사용하지만, `gateway/litellm-config.yaml`에서 모델 ID를 업데이트하여 Bedrock이 지원하는 다른 모델로 대체할 수 있습니다. Observability 파이프라인은 모델에 관계없이 LiteLLM이 지원하는 모든 LLM 프로바이더에서 동작합니다.
- AdministratorAccess로 구성된 AWS CLI
- Docker Desktop 실행 중
- Docker Compose v2
- Python 3.11+
- Terraform 1.5.0+

### 1단계: 인프라 프로비저닝

```bash
cd AI-OBS_DEMO/terraform
terraform init
terraform plan -out=tfplan
terraform apply tfplan

# 출력값 캡처
export AMP_WORKSPACE_ID=$(terraform output -raw amp_workspace_id)
export AMP_REMOTE_WRITE_URL=$(terraform output -raw amp_remote_write_url)
export AMP_ENDPOINT=$(terraform output -raw amp_endpoint)
```

### 2단계: 환경 구성

```bash
cd ..
cp .env.example .env

# .env 파일을 AWS 자격 증명과 Terraform 출력값으로 편집
# 다음을 추가하세요:
# - AWS_ACCESS_KEY_ID
# - AWS_SECRET_ACCESS_KEY
# - AWS_SESSION_TOKEN (임시 자격 증명 사용 시)
# - AMP_REMOTE_WRITE_URL (Terraform 출력값)
# - AMP_ENDPOINT (Terraform 출력값)
```

### 3단계: 빌드 및 실행

```bash
# 모든 서비스 빌드
docker compose build

# 스택 시작
docker compose up -d

# 서비스 확인
docker compose ps

# OTEL Collector 상태 확인
curl http://localhost:13133

# 데모 실행 및 로그 확인
docker compose logs -f ai-app
```

### 4단계: 텔레메트리 검증

```bash
# awscurl 설치
pip3 install awscurl

# AMP에서 토큰 사용량 쿼리
awscurl --service aps --region us-east-1 \
  "${AMP_ENDPOINT}api/v1/query?query=gen_ai_usage_input_tokens_total"

# AWS 콘솔에서 X-Ray 트레이스 확인
# X-Ray > Traces > Filter by service: ai-observability-demo로 이동

# CloudWatch 로그 확인
# CloudWatch > Log Groups > /ai-observability-demo로 이동
```

### 5단계: Grafana 대시보드

1. AWS Console → Amazon Managed Grafana → ai-observability-demo 열기
2. "Open Grafana" 클릭
3. 데이터 소스 추가:
   - Prometheus: SigV4 인증과 함께 AMP endpoint 사용
   - CloudWatch: 리소스가 배포된 리전으로 설정
   - X-Ray: CloudWatch와 동일한 리전으로 설정
4. 대시보드 임포트: `grafana/dashboards/ai-observability.json`

### 6단계: MCP Server 통합

```bash
# MCP server 의존성 설치
cd mcp-server
pip3 install -r requirements.txt

# Kiro MCP 구성
# .kiro/mcp.json에 추가:
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

:::tip 리전 구성
`AWS_REGION`을 Observability 리소스(AMP, CloudWatch, X-Ray)가 배포된 리전으로 설정하세요. 해당 서비스를 지원하는 모든 AWS 리전에서 동작합니다.
:::

### Kiro에서의 자연어 쿼리

구성이 완료되면 Kiro에게 물어보세요:
- "지금 어떤 모델이 가장 많은 토큰을 소비하고 있나요?"
- "지난 1시간 동안 Claude Haiku의 P95 지연시간은 얼마인가요?"
- "지난 30분간 스로틀 이벤트가 있었나요?"
- "오늘 LLM 사용 비용을 추정해 주세요"
- "모든 활성 모델의 지연시간을 비교해 주세요"

## 정리

```bash
# 컨테이너 중지 및 제거
docker compose down

# AWS 리소스 삭제
cd terraform
terraform destroy -auto-approve

# 프로젝트 제거 (선택사항)
cd ../..
rm -rf AI-OBS_DEMO
```

## 아키텍처

- **OpenTelemetry**: GenAI 시맨틱 컨벤션을 갖춘 벤더 중립적 계측
- **LiteLLM**: 멀티 프로바이더 AI 게이트웨이 (AWS Bedrock, Azure OpenAI 등)
- **Amazon Managed Prometheus**: SigV4 인증을 통한 확장 가능한 메트릭 스토리지
- **AWS X-Ray**: LLM 호출을 위한 분산 트레이싱
- **Amazon Managed Grafana**: AMP, CloudWatch, X-Ray를 아우르는 통합 시각화
- **Custom MCP Server**: Kiro를 통한 자연어 Observability 쿼리

## 멀티 클라우드 확장

1. **Azure OpenAI**: `.env`에 실제 자격 증명 추가 - LiteLLM이 자동으로 라우팅 처리
2. **GCP Vertex AI**: `gateway/litellm-config.yaml`에 Vertex AI 모델 추가
3. **온프레미스 모델**: vLLM/Ollama를 로컬에 배포하고 LiteLLM 프로바이더로 추가
4. **페더레이트 메트릭**: 각 클라우드에 OTEL Collector를 배포하고 동일한 AMP 워크스페이스에 remote write

## 참고 자료

- [OpenTelemetry GenAI Semantic Conventions](https://opentelemetry.io/docs/specs/semconv/gen-ai/)
- [Amazon Managed Prometheus](https://docs.aws.amazon.com/prometheus/)
- [Amazon Managed Grafana](https://docs.aws.amazon.com/grafana/)
- [LiteLLM Proxy](https://docs.litellm.ai/docs/proxy/quick_start)
- [AWS Bedrock Observability](https://docs.aws.amazon.com/bedrock/latest/userguide/monitoring-cloudwatch.html)

# Kiro IDE MCP Server - 빠른 시작 가이드

## 얻을 수 있는 것

Kiro IDE에서 자연어로 직접 질문하세요:
- "Which model is consuming the most tokens?"
- "What's the average latency for Claude Haiku?"
- "Estimate my LLM costs for the last hour"

대시보드로 전환하거나 복잡한 쿼리를 작성할 필요가 없습니다!

---

## 1단계: Kiro에서 MCP Server 구성

### 옵션 A: 워크스페이스 구성 사용 (권장)

1. **MCP 구성 디렉토리 생성**:
   ```bash
   mkdir -p .kiro/settings
   ```

2. **MCP 구성 복사**:
   ```bash
   cp AI-OBS_DEMO/kiro-mcp-config.json .kiro/settings/mcp.json
   ```

3. **구성에서 경로 업데이트** (필요한 경우):
   `.kiro/settings/mcp.json`을 열고 `cloudwatch_mcp_server.py`의 경로가 올바른지 확인하세요:
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

### 옵션 B: 사용자 수준 구성 사용 (글로벌)

1. **사용자 구성 디렉토리 생성**:
   ```bash
   mkdir -p ~/.kiro/settings
   ```

2. **구성 복사**:
   ```bash
   cp AI-OBS_DEMO/kiro-mcp-config.json ~/.kiro/settings/mcp.json
   ```

---

## 2단계: AWS 자격 증명 확인

MCP 서버가 CloudWatch를 쿼리하려면 AWS 자격 증명이 필요합니다:

```bash
# AWS 자격 증명이 구성되어 있는지 확인
aws sts get-caller-identity

# 다음과 같이 표시되어야 합니다:
# {
#     "UserId": "...",
#     "Account": "<your-account-id>",
#     "Arn": "arn:aws:iam::<your-account-id>:user/<your-username>"
# }
```

구성되지 않은 경우, AWS 자격 증명을 설정하세요:
```bash
aws configure
# AWS Access Key ID 입력
# AWS Secret Access Key 입력
# Default region: your-aws-region
# Default output format: json
```

---

## 3단계: MCP Server 테스트 (선택사항)

Kiro에서 사용하기 전에 MCP 서버가 작동하는지 확인하세요:

```bash
python3 AI-OBS_DEMO/test-mcp-server.py
```

다음과 같은 출력이 표시됩니다:
```
Testing CloudWatch MCP Server
==============================

1. Testing get_token_usage...
✅ Success: {
  "token_type": "input",
  "time_range_hours": 1,
  "models": [...]
}

2. Testing get_model_latency...
✅ Success: {...}
```

---

## 4단계: Kiro IDE 재시작

Kiro가 MCP 구성을 로드하려면:

1. **모든 작업 저장**
2. **Kiro 완전 종료** (Mac에서 Cmd+Q, 또는 File → Exit)
3. **Kiro 다시 열기**
4. **워크스페이스 열기** (`.kiro/settings/mcp.json`이 포함된 폴더)

---

## 5단계: MCP Server 연결 확인

1. **Kiro Feature Panel 열기** (왼쪽 사이드바)
2. **"MCP Servers" 섹션 찾기**
3. **다음이 표시되어야 합니다**: `ai-observability`에 녹색 상태 표시기
4. **빨간색 표시기가 보이면**: 클릭하여 오류 세부 정보 확인

### 연결 문제 해결

서버가 연결 해제 상태로 표시되는 경우:

1. **Kiro 왼쪽 패널에서 MCP Server 뷰 확인**
2. **가능한 경우 "Reconnect" 클릭**
3. **로그 확인**: MCP 서버 출력에서 오류 메시지 확인
4. **Python 경로 확인**: `python3`이 PATH에 있는지 확인
5. **파일 권한 확인**: `cloudwatch_mcp_server.py`가 읽기 가능한지 확인

---

## 6단계: 자연어 쿼리 사용

### Kiro 채팅에서

1. **Kiro 채팅 열기** (Cmd+L 또는 채팅 아이콘 클릭)
2. **일반 영어로 질문 입력**:

```
Which model is consuming the most tokens?
```

3. **Kiro가 자동으로**:
   - Observability 쿼리로 인식
   - MCP 서버의 `get_token_usage` 도구 호출
   - 구조화된 결과 반환

### 시도해 볼 쿼리 예시

#### 1. 토큰 사용량
```
Which model is consuming the most tokens?
```

**예상 응답**:
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

#### 2. 지연시간 통계
```
What's the average latency for all models?
```

**예상 응답**:
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

#### 3. 비용 추정
```
Estimate the cost of LLM usage for the last hour
```

**예상 응답**:
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

#### 4. 요청 볼륨
```
How many requests have been made in the last hour?
```

#### 5. 모델 비교
```
Compare all models by latency and token usage
```

---

## 7단계: 고급 사용법

### 커스텀 시간 범위

쿼리에서 커스텀 시간 범위를 지정할 수 있습니다:

```
Show me token usage for the last 2 hours
```

```
What was the latency for Claude Haiku in the last 3 hours?
```

### 특정 모델 쿼리

전체 모델 ID를 사용하여 특정 모델을 쿼리하세요:

```
What's the latency for anthropic.claude-3-haiku-20240307-v1:0?
```

### 멀티 메트릭 쿼리

포괄적인 분석을 요청하세요:

```
Give me a complete overview of Claude Haiku performance
```

---

## 문제 해결

### "No data" 응답

**문제**: MCP 서버가 빈 결과를 반환

**해결책**:
1. 메트릭을 생성하기 위해 데모 실행:
   ```bash
   python3 AI-OBS_DEMO/multi-cloud-demo.py
   ```
2. CloudWatch가 메트릭을 수집할 때까지 1-2분 대기
3. 시간 범위를 늘려보세요: "Show me token usage for the last 2 hours"

### MCP Server 응답 없음

**문제**: 쿼리가 타임아웃되거나 실패

**해결책**:
1. Kiro의 MCP 패널에서 MCP 서버 상태 확인
2. AWS 자격 증명 확인: `aws sts get-caller-identity`
3. CloudWatch 권한 확인
4. MCP 구성을 다시 로드하기 위해 Kiro 재시작

### 권한 오류

**문제**: 응답에서 "AccessDenied" 오류

**해결책**:
1. IAM 권한에 다음이 포함되어 있는지 확인:
   - `cloudwatch:GetMetricStatistics`
   - `cloudwatch:ListMetrics`
2. AWS 리전이 올바르게 설정되어 있는지 확인

### Python 경로 문제

**문제**: "python3: command not found"

**해결책**:
1. Python 경로 찾기: `which python3`
2. MCP 구성에 전체 경로로 업데이트:
   ```json
   "command": "/usr/local/bin/python3"
   ```

---

## 최상의 결과를 위한 팁

### 1. 최신 데이터 생성

쿼리 전에 최신 메트릭을 확보하기 위해 데모를 실행하세요:
```bash
python3 AI-OBS_DEMO/multi-cloud-demo.py
```

### 2. 자연어 사용

MCP 서버는 자연스러운 질문을 이해합니다:
- ✅ "Which model costs the most?"
- ✅ "Show me latency for all models"
- ✅ "How many tokens did Claude use?"

### 3. 필요할 때 구체적으로

특정 모델에 대해서는 전체 ID를 사용하세요:
```
What's the latency for anthropic.claude-3-haiku-20240307-v1:0?
```

### 4. 코드 컨텍스트와 함께 사용

코드를 보면서 질문할 수 있습니다:
```
Based on this code, estimate the cost if we run it 1000 times
```

---

## 사용 가능한 MCP 도구

MCP 서버는 5개의 도구를 제공합니다:

| 도구 | 설명 | 쿼리 예시 |
|------|------|-----------|
| `get_token_usage` | 모델별 토큰 소비량 | "Which model uses the most tokens?" |
| `get_model_latency` | 지연시간 통계 | "What's the average latency?" |
| `get_request_count` | 요청 볼륨 | "How many requests were made?" |
| `get_cost_estimate` | 비용 추정 | "Estimate my LLM costs" |
| `compare_models` | 멀티 메트릭 비교 | "Compare all models" |

---

## 다음 단계

### 데모를 위한 스크린샷 촬영

1. 데모 실행: `python3 AI-OBS_DEMO/multi-cloud-demo.py`
2. 1-2분 대기
3. 질문: "Estimate the cost of LLM usage for the last hour"
4. 쿼리 + 응답을 보여주는 스크린샷 촬영

### 사용 사례에 맞게 커스터마이징

`mcp-server/cloudwatch_mcp_server.py`를 편집하여:
- 커스텀 메트릭 추가
- 비용 계산 공식 변경
- 새로운 쿼리 도구 추가
- 다른 AWS 서비스와 통합

### 팀과 공유

1. `.kiro/settings/mcp.json`을 저장소에 커밋
2. 팀원들이 자동으로 MCP 접근 권한 획득
3. 모든 사람이 IDE에서 Observability 데이터를 쿼리 가능

---

## 리소스

- **MCP Server 코드**: `AI-OBS_DEMO/mcp-server/cloudwatch_mcp_server.py`
- **테스트 스크립트**: `AI-OBS_DEMO/test-mcp-server.py`
- **쿼리 예시**: `AI-OBS_DEMO/MCP-DEMO-QUERIES.md`
- **아키텍처**: `AI-OBS_DEMO/ARCHITECTURE.md`

---

## 빠른 참조 카드

```bash
# 설정
mkdir -p .kiro/settings
cp AI-OBS_DEMO/kiro-mcp-config.json .kiro/settings/mcp.json

# 테스트
python3 AI-OBS_DEMO/test-mcp-server.py

# 데이터 생성
python3 AI-OBS_DEMO/multi-cloud-demo.py

# Kiro 재시작
# Cmd+Q → 다시 열기

# 채팅에서 쿼리
"Which model is consuming the most tokens?"
```

---

**질문이 있으신가요?** 더 많은 예시는 `MCP-DEMO-QUERIES.md`를 참조하시거나 GitHub에서 이슈를 열어주세요.

# MCP Server 데모 쿼리

이 가이드는 Kiro IDE와의 MCP 서버 통합을 테스트하는 데 사용할 수 있는 자연어 쿼리 예제를 제공합니다.

## 사전 요구 사항

1. Kiro에서 MCP 서버를 설정했는지 확인하세요 (`SETUP-MCP-KIRO.md` 참조)
2. 텔레메트리를 생성하기 위해 멀티 클라우드 데모를 실행하세요: `python3 AI-OBS_DEMO/multi-cloud-demo.py`
3. 메트릭이 CloudWatch에 표시되려면 1-2분 대기하세요

## 스크린샷을 위한 예제 쿼리

### 1. 토큰 사용량 분석

**쿼리**: "Which model is consuming the most tokens?"

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
    },
    {
      "model": "gemini-1.5-pro",
      "total_tokens": 289
    }
  ]
}
```

**대체 쿼리**:
- "Show me input token usage for the last hour"
- "How many output tokens has Claude Haiku used?"
- "Compare token consumption across all models"

---

### 2. 지연시간 통계

**쿼리**: "What is the average latency for Claude Haiku?"

**예상 응답**:
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

**대체 쿼리**:
- "Show me latency statistics for all models"
- "Which model has the highest latency?"
- "What's the fastest model in terms of response time?"

---

### 3. 요청 볼륨

**쿼리**: "How many requests have been made in the last hour?"

**예상 응답**:
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

**대체 쿼리**:
- "Show me request counts by model"
- "Which model is being used the most?"
- "How many times was GPT-4o invoked?"

---

### 4. 비용 추정

**쿼리**: "Estimate the cost of LLM usage for the last hour"

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

**대체 쿼리**:
- "What's my estimated LLM cost today?"
- "How much am I spending on Claude models?"
- "Calculate the cost per request"

---

### 5. 모델 비교

**쿼리**: "Compare all models by latency and token usage"

**예상 응답**:
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

**대체 쿼리**:
- "Show me a comparison of all active models"
- "Which model offers the best performance?"
- "Compare Claude Haiku vs Claude Sonnet"

---

## 고급 쿼리

### 시간 범위 쿼리

**쿼리**: "Show me token usage for the last 2 hours"

MCP 서버는 `hours` 파라미터를 사용한 커스텀 시간 범위를 지원합니다.

### 특정 모델 쿼리

**쿼리**: "What's the latency for anthropic.claude-3-haiku-20240307-v1:0?"

전체 모델 ID를 사용하여 특정 모델을 쿼리할 수 있습니다.

### 멀티 메트릭 쿼리

**쿼리**: "Give me a complete overview of Claude Haiku performance"

이 쿼리는 지정된 모델에 대한 모든 메트릭을 표시하기 위해 `compare_models` 도구를 트리거합니다.

---

## 스크린샷 촬영 팁

### 데모 스크린샷에 최적인 쿼리

1. **비용 분석** (가장 인상적):
   ```
   "Estimate the cost of LLM usage for the last hour"
   ```
   달러 금액으로 실제 비즈니스 가치를 보여줍니다.

2. **모델 비교** (가장 포괄적):
   ```
   "Compare all models by latency and token usage"
   ```
   프로바이더 간 통합 Observability의 강력함을 보여줍니다.

3. **간단한 쿼리** (가장 접근하기 쉬운):
   ```
   "Which model is consuming the most tokens?"
   ```
   이해하기 쉽고 자연어 기능을 보여줍니다.

### 스크린샷 구성 팁

1. **쿼리 표시**: 자연어 쿼리가 보이도록 하세요
2. **응답 표시**: 데이터가 포함된 전체 JSON 응답을 포함하세요
3. **컨텍스트 표시**: 가능하면 IDE 컨텍스트(파일 탐색기, 터미널)를 포함하세요
4. **핵심 데이터 강조**: 응답에서 흥미로운 인사이트를 지적하세요

### 스크린샷 촬영 흐름 예시

1. Kiro IDE 열기
2. 채팅 패널 열기
3. 입력: "Estimate the cost of LLM usage for the last hour"
4. MCP 서버 응답 대기
5. 다음을 보여주는 스크린샷 촬영:
   - 자연어 쿼리
   - 구조화된 JSON 응답
   - 모델별 비용 분석
   - 총 예상 비용

---

## 문제 해결

### "No data" 응답

**문제**: MCP 서버가 빈 결과를 반환

**해결책**:
1. 메트릭을 생성하기 위해 데모를 실행하세요: `python3 AI-OBS_DEMO/multi-cloud-demo.py`
2. CloudWatch가 메트릭을 수집할 때까지 1-2분 대기하세요
3. 시간 범위를 늘려보세요: "Show me token usage for the last 2 hours"

### MCP Server 응답 없음

**문제**: 쿼리가 타임아웃되거나 실패

**해결책**:
1. MCP 서버가 실행 중인지 확인하세요: Kiro MCP 패널에서 "ai-observability" 확인
2. AWS 자격 증명 확인: `aws sts get-caller-identity`
3. CloudWatch 권한 확인: CloudWatch 메트릭에 대한 읽기 접근 확인
4. MCP 구성을 다시 로드하기 위해 Kiro 재시작

### 권한 오류

**문제**: 응답에서 "AccessDenied" 오류

**해결책**:
1. IAM 권한에 `cloudwatch:GetMetricStatistics`가 포함되어 있는지 확인
2. IAM 권한에 `cloudwatch:ListMetrics`가 포함되어 있는지 확인
3. MCP 구성에서 AWS 리전이 `us-east-1`로 설정되어 있는지 확인

---

## MCP Server 직접 테스트

Kiro 없이도 MCP 서버를 직접 테스트할 수 있습니다:

```bash
python3 AI-OBS_DEMO/test-mcp-server.py
```

이 스크립트는 5개의 MCP 도구를 모두 실행하고 결과를 표시합니다. 다음과 같은 용도에 유용합니다:
- MCP 서버 동작 확인
- 문제 디버깅
- 응답 형식 이해
- 문서화를 위한 샘플 데이터 생성

---

## 다음 단계

스크린샷 촬영 후:

1. **블로그 포스트에 추가**: "데모 결과" 섹션에 스크린샷 포함
2. **튜토리얼 작성**: 스크린샷을 사용하여 단계별 가이드 작성
3. **팀과 공유**: 자연어 쿼리 기능 시연
4. **피드백 수집**: 개발자에게 어떤 다른 쿼리가 유용할지 물어보기

---

## 추가 리소스

- **MCP Server 코드**: `AI-OBS_DEMO/mcp-server/cloudwatch_mcp_server.py`
- **설정 가이드**: `AI-OBS_DEMO/SETUP-MCP-KIRO.md`
- **테스트 스크립트**: `AI-OBS_DEMO/test-mcp-server.py`
- **Kiro 구성**: `AI-OBS_DEMO/kiro-mcp-config.json`

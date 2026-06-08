# CloudWatch Contributor Insights

## 개요
Amazon CloudWatch Contributor Insights는 로그 데이터를 분석하여 메트릭에 영향을 미치는 상위 기여자를 식별하는 데 도움을 줍니다. 실시간 순위와 통계를 생성하여 시스템의 동작과 성능에 영향을 미치는 엔티티를 파악할 수 있습니다.

## 기능
- 로그 데이터의 실시간 분석
- 일반 AWS 서비스를 위한 기본 제공 규칙
- 사용자 정의 규칙 생성 기능
- 자동 데이터 처리 및 순위 지정
- CloudWatch 대시보드 및 알람과의 통합

## 구현

### 기본 제공 규칙
CloudWatch Contributor Insights는 일반 AWS 서비스를 위한 사전 구축된 규칙을 제공합니다:
- VPC Flow Logs 분석
- Application Load Balancer 로그
- Amazon API Gateway 로그
- AWS Lambda 로그

### 사용자 정의 규칙
다음을 정의하여 사용자 정의 규칙을 생성합니다:
1. 소스 문서의 로그 그룹. 분석할 기여자 필드
3. 메트릭 및 집계
4. 시간 윈도우 및 샘플링 비율

사용자 정의 규칙 예시:
```yaml
{
	"AggregateOn": "Count",
	"Contribution": {
		"Filters": [],
		"Keys": [
			"$.pettype"
		]
	},c
	"LogFormat": "JSON",
	"Schema": {
		"Name": "CloudWatchLogRule",
		"Version": 1
	},
	"LogGroupARNs": [
		"arn:aws:logs:[region]:[account]:log-group:[API Gateway Log Group Name]"
	]
}
```

![CloudWatch Contributor Insights 콘솔 미리보기](../../../images/contrib1.png)

## 모범 사례

### 규칙 구성
- 설명적인 규칙 이름 사용
- 가능한 경우 기본 제공 규칙으로 시작
- 대상이 명확한 로그 필터링 구현
- 적절한 시간 윈도우 구성

### 성능 최적화
- 활성 규칙 수 제한
- 최적의 샘플링 비율 설정
- 적절한 집계 기간 사용
- 필요한 로그 그룹에 대해서만 규칙 활성화

### 비용 관리
- 규칙 사용량 정기적 모니터링
- 사용하지 않는 규칙 삭제
- 로그 필터링 구현
- 샘플링 비율 정기적 검토

### 보안
- 최소 권한 원칙 준수
- 민감한 데이터 암호화
- 정기적인 규칙 감사
- 패턴 변경 모니터링

## 일반적인 문제 및 해결 방법

### 규칙이 로그를 매칭하지 않는 경우
**문제**: 규칙이 예상 로그를 처리하지 않음
**해결 방법**:
- 로그 형식이 규칙 구성과 일치하는지 확인
- 필드 이름이 올바른지 확인
- JSON 구조 유효성 검증

### 누락된 데이터
**문제**: 기여자 데이터의 공백
**해결 방법**:
- 샘플링 비율 구성 확인
- 로그 전달 확인
- 시간 윈도우 설정 검토

### 성능 문제
**문제**: 느린 규칙 처리
**해결 방법**:
- 활성 규칙 수 최적화
- 샘플링 비율 조정
- 기여 임계값 검토

## 통합

### CloudWatch 대시보드
상위 기여자의 시각화 생성:
```yaml
{
  "widgets": [
    {
      "type": "metric",
      "properties": {
        "view": "bar",
        "region": "us-east-1",
        "title": "Top Contributors",
        "period": 300
      }
    }
  ]
}
```

### CloudWatch 알람
기여자 패턴에 대한 알림 설정:
```yaml
{
  "AlarmName": "HighContributorCount",
  "MetricName": "UniqueContributors",
  "Threshold": 100,
  "Period": 300,
  "EvaluationPeriods": 2
}
```

## 도구 및 리소스

### AWS CLI 명령어
```bash
# Create a rule
aws cloudwatch put-insight-rule --rule-name MyRule --rule-definition file://rule.json

# Delete a rule
aws cloudwatch delete-insight-rule --rule-name MyRule
```

### 관련 서비스
- Amazon CloudWatch
- CloudWatch Logs
- CloudWatch Alarms
- Amazon EventBridge

### 추가 리소스
- [공식 문서](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/ContributorInsights.html)
- [규칙 구문 참조](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/ContributorInsights-RuleSyntax.html)
- [AWS CLI 참조](https://docs.aws.amazon.com/cli/latest/reference/cloudwatch/put-insight-rule.html)

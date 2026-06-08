# CloudWatch 비용 절감

## GetMetricData

일반적으로 `GetMetricData`는 서드파티 Observability 도구 및/또는 클라우드 재무 도구가 자사 플랫폼에서 CloudWatch Metrics를 사용하면서 발생하는 호출로 인해 발생합니다.

- 서드파티 도구가 요청하는 빈도를 줄이는 것을 고려하세요. 예를 들어, 빈도를 1분에서 5분으로 줄이면 비용이 1/5(20%)로 절감됩니다.
- 추세를 파악하려면 서드파티 도구에서 데이터 수집을 잠시 중단하는 것을 고려하세요.

## CloudWatch Logs 

- 이 [기술 문서][log-article]를 사용하여 주요 기여자를 찾으세요.
- 필요하지 않은 경우 주요 기여자의 로깅 수준을 줄이세요.
- CloudWatch 외에 서드파티 도구를 로깅에 사용하고 있는지 확인하세요.
- 모든 VPC에서 VPC Flow Log를 활성화하고 트래픽이 많은 경우 비용이 빠르게 증가할 수 있습니다. 여전히 필요하다면 Amazon S3로 전달하는 것을 고려하세요.
- 모든 AWS Lambda 함수에서 로깅이 필요한지 확인하세요. 필요하지 않다면 Lambda 역할에서 "logs:PutLogEvents" 권한을 거부하세요.
- CloudTrail 로그는 종종 주요 기여자입니다. Amazon S3로 전송하고 Amazon Athena를 사용하여 쿼리하고 Amazon EventBridge를 경보/알림에 사용하는 것이 더 저렴합니다.

자세한 내용은 이 [기술 문서][article]를 참조하세요.


[article]: https://aws.amazon.com/premiumsupport/knowledge-center/cloudwatch-understand-and-reduce-charges/
[log-article]: https://aws.amazon.com/premiumsupport/knowledge-center/cloudwatch-logs-bill-increase/

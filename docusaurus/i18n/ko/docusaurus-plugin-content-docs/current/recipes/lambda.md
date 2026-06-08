# AWS Lambda

[AWS Lambda][lambda-main]는 서버를 프로비저닝하거나 관리하지 않고 코드를 실행할 수 있는 서버리스 컴퓨팅 서비스로, 워크로드 인식 클러스터 스케일링 로직 생성, 이벤트 통합 유지 또는 런타임 관리가 필요하지 않습니다.

다음 레시피를 확인하세요:

## 로그

- [서버리스 애플리케이션 배포 및 모니터링][aes-ws]

## 메트릭

- [CloudWatch Lambda Insights 소개][lambda-cwi]
- [Firehose 및 AWS Lambda를 통해 CloudWatch Metric Streams를 Amazon Managed Service for Prometheus로 내보내기](recipes/lambda-cw-metrics-go-amp.md)

## 트레이스

- [AWS Distro for OpenTelemetry Lambda 레이어를 사용한 Python 애플리케이션 자동 계측][lambda-layer-python-xray-adot]
- [OpenTelemetry를 사용한 AWS X-Ray에서의 AWS Lambda 함수 트레이싱][lambda-xray-adot]

[lambda-main]: https://aws.amazon.com/lambda/
[aes-ws]: https://bookstore.aesworkshops.com/
[lambda-cwi]: https://aws.amazon.com/blogs/mt/introducing-cloudwatch-lambda-insights/
[lambda-xray-adot]: https://aws.amazon.com/blogs/opensource/tracing-aws-lambda-functions-in-aws-x-ray-with-opentelemetry/
[lambda-layer-python-xray-adot]: https://aws.amazon.com/blogs/opensource/auto-instrumenting-a-python-application-with-an-aws-distro-for-opentelemetry-lambda-layer/

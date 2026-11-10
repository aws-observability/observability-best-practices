# 추가 리소스

## 문서

아래는 Application Signals와 관련된 주요 AWS 공식 문서 목록입니다:

- [AWS Application Signals 사용자 가이드](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-Application-Monitoring-Sections.html) - Application Signals의 전체 기능과 설정 방법을 안내하는 공식 가이드
- [Transaction Search 문서](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-Transaction-Search.html) - 트랜잭션 검색 기능 활성화 및 사용 방법
- [X-Ray SDK 마이그레이션 가이드](https://docs.aws.amazon.com/xray/latest/devguide/xray-sdk-migration.html) - 기존 X-Ray SDK에서 OpenTelemetry로 마이그레이션하는 방법
- [X-Ray Daemon 지원 종료 안내](https://docs.aws.amazon.com/xray/latest/devguide/xray-daemon-eos.html) - X-Ray Daemon의 지원 종료 일정 및 대안
- [ADOT 문서](https://aws-otel.github.io/docs/) - AWS Distro for OpenTelemetry 공식 문서
- [OpenTelemetry 문서](https://opentelemetry.io/docs/) - OpenTelemetry 프로젝트 공식 문서

## 기술 리소스

계측 구현을 위한 GitHub 리포지토리 및 기술 참고 자료입니다:

- [ADOT Java 계측](https://github.com/aws-observability/aws-otel-java-instrumentation) - Java 애플리케이션용 자동 계측 라이브러리
- [ADOT Python 계측](https://github.com/aws-observability/aws-otel-python-instrumentation) - Python 애플리케이션용 자동 계측 라이브러리
- [ADOT JavaScript 계측](https://github.com/aws-observability/aws-otel-js-instrumentation) - Node.js 애플리케이션용 자동 계측 라이브러리
- [ADOT .NET 계측](https://github.com/aws-observability/aws-otel-dotnet-instrumentation) - .NET 애플리케이션용 자동 계측 라이브러리
- [OpenTelemetry Collector Contrib](https://github.com/open-telemetry/opentelemetry-collector-contrib) - 커뮤니티 기여 Collector 구성요소
- [AWS Application Signals Processor](https://github.com/aws/amazon-cloudwatch-agent/tree/main/plugins/processors/awsapplicationsignals) - Application Signals용 커스텀 프로세서 소스 코드
- [ADOT 커뮤니티 예제](https://github.com/aws-observability/aws-otel-community) - 커뮤니티 제공 구현 예제 모음

## 교육 리소스

실습과 학습을 위한 워크숍 및 커뮤니티 자료입니다:

- [AWS Observability 워크숍](https://observability.workshop.aws/) - 실습 기반의 Observability 학습 환경
- [OpenTelemetry 커뮤니티 리소스](https://opentelemetry.io/community/) - OpenTelemetry 관련 커뮤니티 활동 및 자료

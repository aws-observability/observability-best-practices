# Data Scientist, AI/ML, MLOps 엔지니어

데이터 엔지니어링과 머신러닝 운영에서의 Observability는 안정적이고 성능이 우수하며 신뢰할 수 있는 데이터 파이프라인과 ML 모델을 유지하는 데 매우 중요합니다. 적절한 Observability 없이는 ML 시스템이 유지보수, 디버깅 및 개선이 어려운 블랙박스가 됩니다. 이는 신뢰할 수 없는 예측, 비용 증가, 잠재적인 비즈니스 영향으로 이어질 수 있습니다.

다음은 데이터 및 ML 운영에서 Observability 전략을 안내하는 핵심 모범 사례입니다.

## 모범 사례
CloudWatch [로그](https://aws-observability.github.io/observability-best-practices/tools/logs/)와 [메트릭](https://aws-observability.github.io/observability-best-practices/tools/metrics) 및 [트레이스](https://aws-observability.github.io/observability-best-practices/tools/xray)를 모니터링에 활용하세요. 모든 리소스에 대한 태깅 전략을 구현하고, 중요 이벤트에 대한 메트릭 필터를 생성하며, [이상 탐지](https://aws-observability.github.io/observability-best-practices/tools/metrics#anomaly-detection)를 설정하고, [CloudWatch 알람](https://aws-observability.github.io/observability-best-practices/tools/alarms)을 사용하여 알림 임계값을 구성하세요.

### 데이터 품질 보증
데이터 라이프사이클 전반에 걸쳐 데이터 품질, 파이프라인 성능 및 인프라 상태를 모니터링합니다.

주요 모니터링 영역:
- ETL 파이프라인 처리량, 처리 시간 및 오류율
- 데이터 품질을 위한 데이터 패턴의 이상 탐지, 피처 드리프트 감지, 학습/추론 데이터의 분포 분석

### 모델 성능 모니터링
Amazon CloudWatch와의 통합을 통해 AWS는 상세한 학습 파라미터, 하이퍼파라미터, 파이프라인 실행 메트릭, 작업 성능 메트릭, 인프라 활용 메트릭을 자동으로 캡처하여 학습 작업의 철저한 분석과 디버깅을 가능하게 합니다. 모델 버전 관리 및 레지스트리 기능은 모델 반복, 메타데이터, 승인 상태를 체계적으로 추적하여 모델 계보 관리를 용이하게 합니다.

[Amazon SageMaker Model Monitor](https://docs.aws.amazon.com/sagemaker/latest/dg/how-it-works-model-monitor.html)는 프로덕션 환경에서 머신러닝 모델을 지속적으로 모니터링합니다. 데이터 드리프트 및 이상과 같은 모델 품질 편차가 있을 때 트리거되는 자동 알림 시스템을 제공합니다. 이 시스템은 [Amazon CloudWatch Logs](https://aws-observability.github.io/observability-best-practices/tools/logs/#search-with-cloudwatch-logs)와 통합되어 모니터링 데이터를 수집하며, 배포된 모델의 조기 감지 및 사전 유지보수를 가능하게 합니다.

CloudWatch 메트릭 또는 [ADOT](https://aws-observability.github.io/observability-best-practices/guides/operational/adot-at-scale/operating-adot-collector)와 [Amazon OpenSearch Service](https://aws-observability.github.io/observability-best-practices/patterns/opensearch) 같은 서비스를 사용하여 정확도 및 지연시간과 같은 모델 예측 엔드포인트 메트릭을 집계하고 분석하는 메커니즘을 만드세요. OpenSearch Service는 대시보드 및 시각화를 위한 Kibana를 지원합니다. 추적성을 통해 현재 운영 성능에 영향을 미칠 수 있는 변경 사항을 분석할 수 있습니다.

### 인프라 모니터링
AWS는 리소스 활용률, 스토리지 패턴 및 계산 효율성에 대한 깊은 가시성을 제공합니다. CloudWatch Metrics와 [OpenTelemetry](https://aws-observability.github.io/observability-best-practices/patterns/otel)는 CPU 사용량, 메모리 할당 및 I/O 작업에 대한 실시간 데이터를 캡처하고, CloudWatch Logs는 분석을 위해 로그 데이터를 집계합니다. [AWS X-Ray](https://aws-observability.github.io/observability-best-practices/tools/xray)는 ML 파이프라인 단계 전반에 걸쳐 서비스 종속성을 추적하고 시스템 병목현상을 식별하여 효율적인 리소스 최적화 및 비용 관리를 가능하게 합니다.

### 컴플라이언스 및 거버넌스
여러 계정에 걸친 ML 리소스의 중앙화된 거버넌스와 모델 버전, 계보 및 승인 워크플로우 추적은 매우 중요합니다. AWS CloudTrail은 규제 준수 및 거버넌스에 필수적인 모든 API 활동의 감사 로그를 유지합니다.

### 비즈니스 영향 분석
CloudWatch의 [커스텀 메트릭](https://aws-observability.github.io/observability-best-practices/tools/metrics#collecting-metrics)으로 비즈니스별 KPI를 추적하여 QuickSight 대시보드를 통해 ML 이니셔티브의 ROI를 실시간으로 시각화할 수 있습니다. Amazon QuickSight는 기술 메트릭을 비즈니스 인사이트로 변환하는 대화형 대시보드를 생성하여 ML 성능을 비즈니스 KPI와 연결합니다. Amazon CloudWatch [ServiceLens](https://aws-observability.github.io/observability-best-practices/tools/rum#enable-active-tracing)는 사용자 경험 영향을 모니터링하는 데 도움이 됩니다.

## 참고 자료
- [AWS Observability Workshop](https://catalog.workshops.aws/observability/en-US)
- [AWS Observability Best Practices](https://aws-observability.github.io/observability-best-practices/)
- [AWS Well-Architected Framework Machine Learning Lens](https://docs.aws.amazon.com/wellarchitected/latest/machine-learning-lens/machine-learning-lens.html)
- [Sagemaker Logging and Monitoring](https://docs.aws.amazon.com/sagemaker/latest/dg/sagemaker-incident-response.html)
- [Metrics for monitoring Amazon SageMaker AI](https://docs.aws.amazon.com/sagemaker/latest/dg/monitoring-cloudwatch.html) with Amazon CloudWatch

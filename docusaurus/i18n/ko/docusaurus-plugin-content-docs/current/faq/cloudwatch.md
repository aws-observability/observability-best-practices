# Amazon CloudWatch - FAQ

## Amazon CloudWatch를 선택해야 하는 이유는 무엇인가요?

Amazon CloudWatch는 AWS 클라우드 네이티브 서비스로, AWS 클라우드 리소스와 AWS에서 실행하는 애플리케이션을 모니터링하기 위한 단일 플랫폼에서 통합된 observability를 제공합니다. Amazon CloudWatch는 [로그](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/WhatIsCloudWatchLogs.html), [메트릭](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/working_with_metrics.html) 추적, [이벤트](https://docs.aws.amazon.com/AmazonCloudWatch/latest/events/WhatIsCloudWatchEvents.html) 및 [경보](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/AlarmThatSendsEmail.html) 설정의 형태로 모니터링 및 운영 데이터를 수집하는 데 사용할 수 있습니다. 또한 AWS에서 실행되는 AWS 리소스, 애플리케이션 및 서비스와 [온프레미스 서버](https://aws.amazon.com/blogs/mt/how-to-monitor-hybrid-environment-with-aws-services/)에 대한 [통합 뷰](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch_Dashboards.html)를 제공합니다. Amazon CloudWatch는 리소스 사용률, 애플리케이션 성능 및 워크로드의 운영 상태에 대한 시스템 전체 가시성을 확보하는 데 도움을 줍니다. Amazon CloudWatch는 AWS, 하이브리드 및 온프레미스 애플리케이션과 인프라 리소스에 대한 [실행 가능한 인사이트](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-Insights-Sections.html)를 제공합니다. [크로스 계정 observability](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-Unified-Cross-Account.html)는 CloudWatch의 통합 observability 기능에 대한 추가 사항입니다.

## Amazon CloudWatch와 Amazon CloudWatch Logs에 네이티브로 통합된 AWS 서비스는 무엇인가요?

Amazon CloudWatch는 70개 이상의 AWS 서비스와 네이티브로 통합되어 고객이 별도의 조치 없이 간소화된 모니터링과 확장성을 위해 인프라 메트릭을 수집할 수 있습니다. [CloudWatch 메트릭을 게시하는 AWS 서비스](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/aws-services-cloudwatch-metrics.html)의 전체 목록은 문서를 확인하세요. 현재 30개 이상의 AWS 서비스가 CloudWatch에 로그를 게시합니다. [CloudWatch Logs에 로그를 게시하는 AWS 서비스](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/aws-services-sending-logs.html)의 전체 목록은 문서를 확인하세요.

## 모든 AWS 서비스에서 Amazon CloudWatch로 게시된 모든 메트릭 목록은 어디에서 확인할 수 있나요?

Amazon CloudWatch에 [메트릭을 게시하는 모든 AWS 서비스](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/aws-services-cloudwatch-metrics.html) 목록은 AWS 문서에 있습니다.

## Amazon CloudWatch로 메트릭을 수집하고 모니터링하려면 어디서 시작해야 하나요?

[Amazon CloudWatch는 메트릭을 수집](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/working_with_metrics.html)하며, 이는 [AWS Management Console, AWS CLI 또는 API](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/viewing_metrics_with_cloudwatch.html)를 통해 확인할 수 있습니다. Amazon CloudWatch는 Amazon EC2 인스턴스의 [사용 가능한 메트릭](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/viewing_metrics_with_cloudwatch.html)을 수집합니다. 추가 커스텀 메트릭의 경우, 통합 CloudWatch 에이전트를 사용하여 수집하고 모니터링할 수 있습니다.

> 관련 AWS Observability Workshop: [Metrics](https://catalog.workshops.aws/observability/en-US/aws-native/metrics)

## Amazon EC2 인스턴스에 매우 세밀한 수준의 모니터링이 필요한데, 어떻게 해야 하나요?

기본적으로 Amazon EC2는 인스턴스에 대한 기본 모니터링으로 5분 간격으로 CloudWatch에 메트릭 데이터를 전송합니다. 인스턴스의 메트릭 데이터를 1분 간격으로 CloudWatch에 전송하려면 인스턴스에서 [세부 모니터링](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/using-cloudwatch-new.html)을 활성화할 수 있습니다.

## 애플리케이션에 대한 자체 메트릭을 게시하고 싶습니다. 옵션이 있나요?

고객은 API 또는 CLI를 통해 표준 해상도 1분 단위 또는 고해상도 1초 간격으로 자체 [커스텀 메트릭](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/publishingMetrics.html)을 CloudWatch에 게시할 수 있습니다.

CloudWatch 에이전트는 또한 Elastic Network Adapter(ENA)를 사용하는 Linux에서 실행되는 EC2 인스턴스의 [네트워크 성능 메트릭](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-Agent-network-performance.html), Linux 서버의 [NVIDIA GPU 메트릭](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-Agent-NVIDIA-GPU.html), Linux 및 Windows 서버의 [개별 프로세스](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-Agent-procstat-process-metrics.html)에서 procstat 플러그인을 사용한 프로세스 메트릭과 같은 특수 시나리오에서 EC2 인스턴스의 커스텀 메트릭 수집을 지원합니다.

> 관련 AWS Observability Workshop: [Public custom metrics](https://catalog.workshops.aws/observability/en-US/aws-native/metrics/publishmetrics)

## Amazon CloudWatch 에이전트를 통해 커스텀 메트릭을 수집하는 데 어떤 추가 지원이 있나요?

애플리케이션 또는 서비스의 커스텀 메트릭은 [StatsD](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-Agent-custom-metrics-statsd.html) 또는 [collectd](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-Agent-custom-metrics-collectd.html) 프로토콜을 지원하는 통합 CloudWatch 에이전트를 사용하여 검색할 수 있습니다. StatsD는 다양한 애플리케이션에서 메트릭을 수집할 수 있는 인기 있는 오픈 소스 솔루션입니다. StatsD는 Linux 및 Windows 기반 서버를 모두 지원하여 자체 메트릭을 계측하는 데 특히 유용합니다. collectd 프로토콜은 다양한 애플리케이션에 대한 시스템 통계를 수집할 수 있는 플러그인이 있는 Linux 서버에서만 지원되는 인기 있는 오픈 소스 솔루션입니다.

## 워크로드에 많은 임시 리소스가 포함되어 있고 높은 카디널리티의 로그를 생성하는데, 메트릭과 로그를 수집하고 측정하는 권장 접근 방식은 무엇인가요?

[CloudWatch 임베디드 메트릭 형식](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch_Embedded_Metric_Format.html)을 사용하면 고객이 Lambda 함수 및 컨테이너와 같은 임시 리소스에서 복잡한 높은 카디널리티 애플리케이션 데이터를 로그 형태로 수집하고 실행 가능한 메트릭을 생성할 수 있습니다. 이를 통해 고객은 별도의 코드를 계측하거나 유지 관리할 필요 없이 상세한 로그 이벤트 데이터와 함께 커스텀 메트릭을 포함할 수 있으며, 로그 데이터에 대한 강력한 분석 기능을 제공하고 CloudWatch가 자동으로 커스텀 메트릭을 추출하여 데이터를 시각화하고 실시간 인시던트 감지를 위한 경보를 설정하는 데 도움을 줍니다.

> 관련 AWS Observability Workshop: [Embedded Metric Format](https://catalog.workshops.aws/observability/en-US/aws-native/metrics/emf)

## Amazon CloudWatch로 로그를 수집하고 모니터링하려면 어디서 시작해야 하나요?

[Amazon CloudWatch Logs](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/WhatIsCloudWatchLogs.html)는 고객이 기존 시스템, 애플리케이션 및 커스텀 로그 파일을 사용하여 거의 실시간으로 시스템과 애플리케이션을 모니터링하고 문제를 해결하는 데 도움을 줍니다. 고객은 [통합 CloudWatch 에이전트](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/CWL_GettingStarted.html)를 설치하여 [Amazon EC2 인스턴스 및 온프레미스 서버에서](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Install-CloudWatch-Agent.html) CloudWatch로 로그를 수집할 수 있습니다.

> 관련 AWS Observability Workshop: [Log Insights](https://catalog.workshops.aws/observability/en-US/aws-native/logs/logsinsights)

## CloudWatch 에이전트란 무엇이며 왜 사용해야 하나요?

[통합 CloudWatch 에이전트](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Install-CloudWatch-Agent.html)는 MIT 라이선스 하의 오픈 소스 소프트웨어로, x86-64 및 ARM64 아키텍처를 활용하는 대부분의 운영 체제를 지원합니다. CloudWatch 에이전트는 하이브리드 환경의 Amazon EC2 인스턴스 및 온프레미스 서버에서 운영 체제 전반에 걸쳐 시스템 수준 메트릭을 수집하고, 애플리케이션 또는 서비스에서 커스텀 메트릭을 검색하며, Amazon EC2 인스턴스 및 온프레미스 서버에서 로그를 수집하는 데 도움을 줍니다.

## 환경에 필요한 모든 규모의 설치가 있는데, CloudWatch 에이전트를 일반적으로 그리고 자동화를 사용하여 어떻게 설치할 수 있나요?

Linux 및 Windows 서버를 포함한 지원되는 모든 운영 체제에서, 고객은 [명령줄](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/installing-cloudwatch-agent-commandline.html), AWS [Systems Manager](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/installing-cloudwatch-agent-ssm.html) 또는 AWS [CloudFormation 템플릿](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Install-CloudWatch-Agent-New-Instances-CloudFormation.html)을 사용하여 [CloudWatch 에이전트를 다운로드하고 설치](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/install-CloudWatch-Agent-on-EC2-Instance.html)할 수 있습니다. 모니터링을 위해 [온프레미스 서버에도 CloudWatch 에이전트를 설치](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/install-CloudWatch-Agent-on-premise.html)할 수 있습니다.

## 조직에 여러 리전에 걸친 여러 AWS 계정이 있는데, Amazon CloudWatch가 이러한 시나리오에서 작동하나요?

Amazon CloudWatch는 [크로스 계정 observability](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-Unified-Cross-Account.html)를 제공하여 고객이 리전 내에서 여러 계정에 걸친 리소스와 애플리케이션의 상태를 모니터링하고 문제를 해결하는 데 도움을 줍니다. Amazon CloudWatch는 또한 [크로스 계정, 크로스 리전 대시보드](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Cross-Account-Cross-Region.html)를 제공합니다. 이 기능을 통해 고객은 다중 계정, 다중 리전 리소스와 워크로드에 대한 가시성과 인사이트를 얻을 수 있습니다.

## Amazon CloudWatch에서 사용 가능한 자동화 지원은 무엇인가요?

AWS Management Console을 통한 Amazon CloudWatch 접근 외에도 고객은 API, [AWS 명령줄 인터페이스(CLI)](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html) 및 [AWS SDK](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/sdk-general-information-section.html)를 통해 서비스에 접근할 수 있습니다. 메트릭 및 대시보드를 위한 [CloudWatch API](https://docs.aws.amazon.com/AmazonCloudWatch/latest/APIReference/Welcome.html)는 [AWS CLI](https://docs.aws.amazon.com/AmazonCloudWatch/latest/cli/Welcome.html)를 통한 자동화 또는 소프트웨어/제품과의 통합에 도움이 되어 리소스와 애플리케이션을 관리하거나 운영하는 데 드는 시간을 줄일 수 있습니다. 로그를 위한 [CloudWatch API](https://docs.aws.amazon.com/AmazonCloudWatchLogs/latest/APIReference/Welcome.html)와 [AWS CLI](https://docs.aws.amazon.com/cli/latest/reference/logs/index.html)도 별도로 제공됩니다. 추가 참조를 위해 [AWS SDK를 사용한 CloudWatch 코드 예제](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/service_code_examples.html)가 고객에게 제공됩니다.

## 리소스를 빠르게 모니터링하기 시작하고 싶은데, 권장 접근 방식은 무엇인가요?

CloudWatch의 자동 대시보드는 모든 AWS 퍼블릭 리전에서 사용 가능하며, 모든 AWS 리소스의 상태와 성능에 대한 집계된 뷰를 제공합니다. 이를 통해 고객은 모니터링을 빠르게 시작하고, 메트릭과 경보의 리소스 기반 뷰를 확인하며, 성능 문제의 근본 원인을 쉽게 드릴다운하여 파악할 수 있습니다. [자동 대시보드](https://docs.aws.amazon.com/prescriptive-guidance/latest/implementing-logging-monitoring-cloudwatch/cloudwatch-dashboards-visualizations.html)는 AWS 서비스 권장 모범 사례로 사전 구축되어 있으며, 리소스를 인식하고 중요한 성능 메트릭의 최신 상태를 반영하도록 동적으로 업데이트됩니다.

관련 AWS Observability Workshop: [Automatic Dashboards](https://catalog.workshops.aws/observability/en-US/aws-native/dashboards/autogen-dashboard)

## CloudWatch에서 모니터링할 내용을 커스터마이즈하고 싶은데, 권장 접근 방식은 무엇인가요?

[커스텀 대시보드](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/create_dashboard.html)를 사용하면 고객은 원하는 만큼 추가 대시보드를 만들고 다양한 위젯으로 커스터마이즈할 수 있습니다. 커스텀 대시보드를 생성할 때 커스터마이즈를 위해 선택할 수 있는 다양한 위젯 유형이 제공됩니다.

관련 AWS Observability Workshop: [Dashboarding](https://catalog.workshops.aws/observability/en-US/aws-native/ec2-monitoring/dashboarding)

## 커스텀 대시보드를 몇 개 만들었는데, 공유할 수 있는 방법이 있나요?

네, [CloudWatch 대시보드 공유](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/cloudwatch-dashboard-sharing.html)가 가능합니다. 세 가지 공유 방법이 있습니다. 링크에 접근할 수 있는 모든 사람이 대시보드를 볼 수 있도록 단일 대시보드를 공개적으로 공유하는 것. 대시보드를 볼 수 있도록 허용된 사람들의 이메일 주소를 지정하여 단일 대시보드를 비공개로 공유하는 것. 대시보드 접근을 위해 타사 싱글 사인온(SSO) 제공자를 지정하여 계정의 모든 CloudWatch 대시보드를 공유하는 것.

> 관련 AWS Observability Workshop: [Sharing CloudWatch Dashboards](https://catalog.workshops.aws/observability/en-US/aws-native/dashboards/sharingdashboard)

## 기반이 되는 AWS 리소스를 포함하여 애플리케이션의 observability를 개선하고 싶은데, 어떻게 달성할 수 있나요?

[Amazon CloudWatch Application Insights](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/cloudwatch-application-insights.html)는 SQL Server 데이터베이스, .Net 기반 웹(IIS) 스택, 애플리케이션 서버, OS, 로드 밸런서, 큐 등과 같은 기본 AWS 리소스와 함께 애플리케이션에 대한 observability를 촉진합니다. 애플리케이션 리소스 및 기술 스택 전반에 걸쳐 핵심 메트릭과 로그를 식별하고 설정하는 데 도움을 줍니다. 이를 통해 평균 복구 시간(MTTR)을 줄이고 애플리케이션 문제를 더 빠르게 해결할 수 있습니다.

> 추가 세부 정보 FAQ: [AWS resource & custom metrics monitoring](https://aws.amazon.com/cloudwatch/faqs/#AWS_resource_.26_custom_metrics_monitoring)

## 우리 조직은 오픈 소스 중심인데, Amazon CloudWatch가 오픈 소스 기술을 통한 모니터링 및 observability를 지원하나요?

메트릭과 트레이스 수집을 위해, [AWS Distro for OpenTelemetry (ADOT) Collector](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-Agent-open-telemetry.html)를 CloudWatch 에이전트와 함께 Amazon EC2 인스턴스에 나란히 설치할 수 있으며, OpenTelemetry SDK를 사용하여 Amazon EC2 인스턴스에서 실행되는 워크로드에서 애플리케이션 트레이스 및 메트릭을 수집할 수 있습니다.

Amazon CloudWatch에서 OpenTelemetry 메트릭을 지원하기 위해, [AWS EMF Exporter for OpenTelemetry Collector](https://github.com/open-telemetry/opentelemetry-collector-contrib/tree/main/exporter/awsemfexporter)는 OpenTelemetry 형식 메트릭을 CloudWatch Embedded Metric Format(EMF)으로 변환하여, OpenTelemetry 메트릭에 통합된 애플리케이션이 높은 카디널리티 [애플리케이션 메트릭을 CloudWatch로](https://aws-otel.github.io/docs/getting-started/adot-eks-add-on/config-cloudwatch) 전송할 수 있게 합니다.

로그의 경우, Fluent Bit은 [Amazon EC2에서](https://docs.fluentbit.io/manual/pipeline/outputs/cloudwatch) Amazon CloudWatch를 포함한 AWS 서비스로 로그를 스트리밍하기 위한 쉬운 확장 포인트를 만드는 데 도움을 줍니다. 새로 출시된 [Fluent Bit 플러그인](https://github.com/aws/amazon-cloudwatch-logs-for-fluent-bit#new-higher-performance-core-fluent-bit-plugin)은 Amazon CloudWatch로 로그를 라우팅할 수 있습니다.

대시보드의 경우, Amazon Managed Grafana는 Grafana 워크스페이스 콘솔의 AWS 데이터 소스 구성 옵션을 사용하여 [Amazon CloudWatch를 데이터 소스로](https://docs.aws.amazon.com/grafana/latest/userguide/using-amazon-cloudwatch-in-AMG.html) 추가할 수 있습니다. 이 기능은 CloudWatch에 대한 인증 자격 증명의 구성을 관리하고 기존 CloudWatch 계정을 검색하여 CloudWatch를 데이터 소스로 추가하는 것을 간소화합니다.

## 워크로드가 이미 환경에서 Prometheus를 사용하여 메트릭을 수집하도록 구축되어 있습니다. 동일한 방법론을 계속 사용할 수 있나요?

고객은 observability 요구 사항에 대해 완전한 오픈 소스 설정을 선택할 수 있습니다. 이를 위해 AWS Distro for OpenTelemetry (ADOT) Collector를 Prometheus로 계측된 애플리케이션에서 스크랩하고 메트릭을 Prometheus Server 또는 Amazon Managed Prometheus로 전송하도록 구성할 수 있습니다.

EC2 인스턴스의 CloudWatch 에이전트는 CloudWatch에서 모니터링하기 위해 [Prometheus로 메트릭을 스크랩](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-Agent-PrometheusEC2.html)하도록 설치 및 구성할 수 있습니다. 이는 EC2에서 컨테이너 워크로드를 선호하고 오픈 소스 Prometheus 모니터링과 호환되는 커스텀 메트릭이 필요한 고객에게 도움이 될 수 있습니다.

CloudWatch [Container Insights의 Prometheus 모니터링](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/ContainerInsights-Prometheus.html)은 컨테이너화된 시스템과 워크로드에서 Prometheus 메트릭의 자동 검색을 지원합니다. Prometheus 메트릭 검색은 Amazon Elastic Container Service (ECS), Amazon Elastic Kubernetes Service (EKS) 및 Amazon EC2 인스턴스에서 실행되는 Kubernetes 클러스터에 대해 지원됩니다.

## 워크로드에 마이크로서비스 컴퓨팅, 특히 EKS/Kubernetes 관련 컨테이너가 포함되어 있는데, Amazon CloudWatch를 사용하여 환경에 대한 인사이트를 어떻게 얻을 수 있나요?

고객은 [CloudWatch Container Insights](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/ContainerInsights.html)를 사용하여 [Amazon Elastic Kubernetes Service (Amazon EKS)](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/deploy-container-insights-EKS.html) 또는 Amazon EC2의 Kubernetes 플랫폼에서 실행되는 컨테이너화된 애플리케이션 및 마이크로서비스의 메트릭 및 로그를 수집, 집계, 요약할 수 있습니다. [Container Insights](https://aws.amazon.com/cloudwatch/faqs/#Container_Monitoring)는 Amazon EKS용 Fargate에 배포된 클러스터에서도 메트릭 수집을 지원합니다. CloudWatch는 CPU, 메모리, 디스크 및 네트워크와 같은 많은 리소스의 [메트릭을 자동으로 수집](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Container-Insights-metrics.html)하고 컨테이너 재시작 실패와 같은 [진단 정보를 제공](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Container-Insights-reference.html)하여 문제를 격리하고 신속하게 해결하는 데 도움을 줍니다.

> 관련 AWS Observability Workshop: [Container Insights on EKS](https://catalog.workshops.aws/observability/en-US/aws-native/insights/containerinsights/eks)

## 워크로드에 마이크로서비스 컴퓨팅, 특히 ECS 관련 컨테이너가 포함되어 있는데, Amazon CloudWatch를 사용하여 환경에 대한 인사이트를 어떻게 얻을 수 있나요?

고객은 [CloudWatch Container Insights](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/ContainerInsights.html)를 사용하여 [Amazon Elastic Container Service (Amazon ECS)](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/deploy-container-insights-ECS.html) 또는 Amazon EC2의 컨테이너 플랫폼에서 실행되는 컨테이너화된 애플리케이션 및 마이크로서비스의 메트릭 및 로그를 수집, 집계, 요약할 수 있습니다. [Container Insights](https://aws.amazon.com/cloudwatch/faqs/#Container_Monitoring)는 Amazon ECS용 Fargate에 배포된 클러스터에서도 메트릭 수집을 지원합니다. CloudWatch는 CPU, 메모리, 디스크 및 네트워크와 같은 많은 리소스의 [메트릭을 자동으로 수집](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Container-Insights-metrics.html)하고 컨테이너 재시작 실패와 같은 [진단 정보를 제공](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Container-Insights-reference.html)하여 문제를 격리하고 신속하게 해결하는 데 도움을 줍니다.

> 관련 AWS Observability Workshop: [Container Insights on ECS](https://catalog.workshops.aws/observability/en-US/aws-native/insights/containerinsights/ecs)

## 워크로드에 서버리스 컴퓨팅, 특히 AWS Lambda가 포함되어 있는데, Amazon CloudWatch를 사용하여 환경에 대한 인사이트를 어떻게 얻을 수 있나요?

고객은 AWS Lambda에서 실행되는 서버리스 애플리케이션의 모니터링 및 문제 해결을 위해 [CloudWatch Lambda Insights](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Lambda-Insights.html)를 사용할 수 있습니다. [CloudWatch Lambda Insights](https://aws.amazon.com/cloudwatch/faqs/#Lambda_Monitoring)는 CPU 시간, 메모리, 디스크, 네트워크를 포함한 시스템 수준 메트릭을 수집, 집계, 요약하고 콜드 스타트와 Lambda 워커 종료와 같은 진단 정보를 수집, 집계, 요약하여 고객이 Lambda 함수의 문제를 격리하고 신속하게 해결하는 데 도움을 줍니다.

> 관련 AWS Observability Workshop: [Lambda Insights](https://catalog.workshops.aws/observability/en-US/aws-native/insights/lambdainsights)

## Amazon CloudWatch Logs에 많은 로그를 집계하는데, 해당 데이터에 대한 observability를 어떻게 확보할 수 있나요?

[CloudWatch Logs Insights](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/AnalyzingLogData.html)를 사용하면 고객이 Amazon CloudWatch Logs에서 로그 데이터를 대화식으로 검색, 분석하고 쿼리를 수행하여 운영 문제에 효율적이고 효과적으로 대응할 수 있습니다. 문제가 발생하면 고객은 [CloudWatch Logs Insights](https://aws.amazon.com/cloudwatch/faqs/#Log_analytics)를 사용하여 잠재적 원인을 식별하고 배포된 수정 사항을 검증할 수 있습니다.

## Amazon CloudWatch Logs에서 로그를 어떻게 쿼리하나요?

Amazon CloudWatch Logs의 CloudWatch Logs Insights는 로그 그룹을 쿼리하기 위해 [쿼리 언어](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/CWL_QuerySyntax.html)를 사용합니다.

## Amazon CloudWatch Logs에 저장된 로그를 비용 최적화, 규정 준수 보관 또는 추가 처리를 위해 어떻게 관리하나요?

기본적으로 [로그 그룹](https://aws.amazon.com/cloudwatch/faqs/#Log_management)의 Amazon CloudWatch Logs는 [무기한으로 유지되며 만료되지 않습니다](https://docs.aws.amazon.com/managedservices/latest/userguide/log-customize-retention.html). 고객은 비용 최적화 또는 규정 준수 목적에 따라 로그를 보관하려는 기간에 맞게 각 로그 그룹의 보관 정책을 1일에서 10년 사이로 조정할 수 있습니다.

고객은 [로그 그룹에서 Amazon S3 버킷으로](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/S3Export.html) 로그 데이터를 내보내고 이 데이터를 커스텀 처리 및 분석에 사용하거나 다른 시스템에 로드할 수 있습니다.

고객은 또한 CloudWatch Logs의 로그 그룹을 CloudWatch Logs 구독을 통해 거의 실시간으로 [Amazon OpenSearch Service 클러스터로 데이터를 스트리밍](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/CWL_OpenSearch_Stream.html)하도록 구성할 수 있습니다. 이를 통해 대화식 로그 분석, 실시간 애플리케이션 모니터링, 검색 등을 수행하는 데 도움이 됩니다.

## 워크로드가 민감한 데이터가 포함될 수 있는 로그를 생성하는데, Amazon CloudWatch에서 이를 보호할 수 있는 방법이 있나요?

고객은 CloudWatch Logs의 [로그 데이터 보호 기능](https://aws.amazon.com/cloudwatch/faqs/#Log_data_protection)을 활용하여 시스템과 애플리케이션에서 수집된 로그 내의 민감한 데이터를 [자동으로 감지하고 마스킹하기 위한 자체 규칙과 정책을 정의](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/mask-sensitive-log-data.html#mask-sensitive-log-data-start)할 수 있습니다.

관련 AWS Observability Workshop: [Data Protection](https://catalog.workshops.aws/observability/en-US/aws-native/logs/dataprotection)

## 시스템 및 애플리케이션에 이상 대역 또는 예기치 않은 변경이 발생할 때 알고 싶습니다. 이런 일이 발생할 때 Amazon CloudWatch가 어떻게 알려줄 수 있나요?

[Amazon CloudWatch Anomaly Detection](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch_Anomaly_Detection.html)은 통계 및 머신 러닝 알고리즘을 적용하여 시스템과 애플리케이션의 단일 시계열을 지속적으로 분석하고, 정상 기준을 결정하며, 최소한의 사용자 개입으로 이상을 표면화합니다. 알고리즘은 정상적인 메트릭 동작을 나타내는 예상 값 범위를 생성하는 이상 감지 모델을 만듭니다. 고객은 과거 메트릭 데이터의 분석과 이상 임계값에 설정된 값을 기반으로 [경보를 생성](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Create_Anomaly_Detection_Alarm.html)할 수 있습니다.

> 관련 AWS Observability Workshop: [Anomaly Detection](https://catalog.workshops.aws/observability/en-US/aws-native/metrics/alarms/anomalydetection)

## Amazon CloudWatch에서 메트릭 경보를 설정했는데, 빈번한 경보 노이즈가 발생합니다. 이를 어떻게 제어하고 세밀하게 조정할 수 있나요?

고객은 여러 경보를 경보 계층으로 결합하여 [복합 경보](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Create_Composite_Alarm.html)로 만들어 여러 [경보](https://aws.amazon.com/cloudwatch/faqs/#Alarms)가 동시에 발생할 때 한 번만 트리거되도록 하여 경보 노이즈를 줄일 수 있습니다. 복합 경보는 애플리케이션, AWS 리전 또는 AZ와 같은 리소스를 그룹화하여 전반적인 상태를 지원합니다.

> 관련 AWS Observability Workshop: [Alarms](https://catalog.workshops.aws/observability/en-US/aws-native/metrics/alarms)

## 인터넷을 통해 접근하는 워크로드에 성능 및 가용성 문제가 발생하고 있는데, 어떻게 문제를 해결하나요?

[Amazon CloudWatch Internet Monitor](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-InternetMonitor.html)는 AWS에서 호스팅되는 애플리케이션과 최종 사용자 사이에서 인터넷 문제가 성능과 가용성에 미치는 영향에 대한 가시성을 제공합니다. [Internet Monitor](https://aws.amazon.com/cloudwatch/faqs/#Internet_Monitoring)를 사용하면 애플리케이션의 성능과 가용성에 영향을 미치는 요인을 빠르게 식별하여 인터넷 문제를 진단하는 데 걸리는 시간을 크게 줄일 수 있습니다.

## 워크로드가 AWS에 있고 최종 사용자가 애플리케이션에 접근할 때 영향이나 지연이 발생하기 전에도 알림을 받고 싶습니다. 고객 대면 워크로드의 가시성을 높이고 observability를 개선하려면 어떻게 해야 하나요?

고객은 [Amazon CloudWatch Synthetics](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch_Synthetics_Canaries.html)를 사용하여 엔드포인트와 API를 모니터링하기 위해 일정에 따라 실행되는 구성 가능한 스크립트인 카나리를 생성할 수 있습니다. 카나리는 고객과 동일한 경로를 따르고 동일한 작업을 수행하므로, 애플리케이션에 실시간 트래픽이 없을 때도 최종 사용자 경험을 지속적으로 검증할 수 있습니다. 카나리는 고객보다 먼저 문제를 발견하는 데 도움을 줍니다. 카나리는 엔드포인트의 가용성과 지연 시간을 확인하고 헤드리스 Chromium 브라우저가 렌더링한 UI의 로드 시간 데이터와 스크린샷을 저장할 수 있습니다.

> 관련 AWS Observability Workshop: [CloudWatch Synthetics](https://catalog.workshops.aws/observability/en-US/aws-native/app-monitoring/synthetics)

## 최종 사용자 경험을 관찰하여 클라이언트 측 성능을 식별하고 실시간 문제를 해결하려면 어떻게 하나요?

[CloudWatch RUM](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-RUM.html)은 실제 사용자 모니터링을 수행하여 실제 사용자 세션에서 웹 애플리케이션 성능에 대한 클라이언트 측 데이터를 거의 실시간으로 수집하고 볼 수 있습니다. 수집된 데이터는 클라이언트 측 성능 문제를 빠르게 식별하고 디버그하는 데 도움이 되며 페이지 로드 시간, 클라이언트 측 오류, 사용자 행동을 시각화하고 분석하는 데 도움을 줍니다. 이 데이터를 볼 때 고객은 모든 것을 집계하여 볼 수 있으며 고객이 사용하는 브라우저와 기기별 분석도 볼 수 있습니다. CloudWatch RUM은 애플리케이션 성능의 이상을 시각화하고 오류 메시지, 스택 트레이스, 사용자 세션과 같은 관련 디버깅 데이터를 찾는 데 도움을 줍니다.

> 관련 AWS Observability Workshop: [CloudWatch RUM](https://catalog.workshops.aws/observability/en-US/aws-native/app-monitoring/rum)

## 우리 조직은 모든 작업을 감사 목적으로 기록해야 합니다. Amazon CloudWatch 이벤트를 기록할 수 있나요?

Amazon CloudWatch는 [AWS CloudTrail](https://docs.aws.amazon.com/awscloudtrail/latest/userguide/cloudtrail-user-guide.html)과 통합되어 있어, Amazon CloudWatch에서 사용자, 역할 또는 AWS 서비스가 수행한 작업에 대한 기록을 제공합니다. CloudTrail은 콘솔에서의 호출과 API 작업에 대한 코드 호출을 포함하여 [Amazon CloudWatch에 대한 모든 API 호출](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/logging_cw_api_calls.html)을 이벤트로 캡처합니다.

## 추가 정보는 어디에서 확인할 수 있나요?

추가 정보는 [CloudWatch](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/WhatIsCloudWatch.html), [CloudWatch Events](https://docs.aws.amazon.com/AmazonCloudWatch/latest/events/WhatIsCloudWatchEvents.html) 및 [CloudWatch Logs](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/WhatIsCloudWatchLogs.html)에 대한 AWS 문서를 읽고, [AWS Native Observability](https://catalog.workshops.aws/observability/en-US/aws-native)에 대한 AWS Observability Workshop을 진행하며, [제품 페이지](https://aws.amazon.com/cloudwatch/)에서 [기능](https://aws.amazon.com/cloudwatch/features/) 및 [요금](https://aws.amazon.com/cloudwatch/pricing/) 세부 정보를 확인할 수 있습니다. 고객 사용 사례 시나리오를 설명하는 [CloudWatch 튜토리얼](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-tutorials.html)도 추가로 제공됩니다.

**제품 FAQ:** [https://aws.amazon.com/cloudwatch/faqs/](https://aws.amazon.com/cloudwatch/faqs/)
# Service Level Objectives (SLOs)

고가용성과 복원력 있는 애플리케이션이 여러분의 회사에서 비즈니스를 이끄는 핵심 요소인가요? '**예**'라면, 계속 읽어주세요.

장애는 피할 수 없으며, 시간이 지나면 모든 시스템은 결국 장애가 발생합니다! 특히 확장 가능한 애플리케이션을 구축할 때 이 현실을 직시하는 것이 중요합니다. 바로 이 지점에서 SLO의 중요성이 부각됩니다.

SLO는 핵심 최종 사용자 여정을 기반으로 서비스 가용성에 대해 합의된 목표를 측정합니다. 합의된 목표는 고객/최종 사용자에게 중요한 것을 중심으로 설정되어야 합니다. 이러한 복원력 있는 에코시스템을 구축하려면 성능을 객관적으로 측정하고, 의미 있고 현실적이며 실행 가능한 SLO를 사용하여 신뢰성을 정확하게 보고해야 합니다. 이제 핵심 서비스 수준 용어에 대해 알아보겠습니다.

## 서비스 수준 용어

- SLI는 서비스 수준 지표(Service Level Indicator)입니다: 제공되는 서비스 수준의 특정 측면에 대해 신중하게 정의된 정량적 측정값입니다.

- SLO는 서비스 수준 목표(Service Level Objective)입니다: SLI로 측정되는 서비스 수준에 대한 목표 값 또는 값의 범위로, 일정 기간 동안 측정됩니다.

- SLA는 서비스 수준 계약(Service Level Agreement)입니다: SLO를 충족하지 못했을 때의 결과를 포함하는 고객과의 계약입니다.

다음 다이어그램은 SLA가 '약속/계약'이고, SLO가 '목표/목표값'이며, SLI가 '서비스가 얼마나 잘 수행되었는가?'에 대한 측정임을 보여줍니다.

![SLO 데이터 흐름](../images/slo.png)

### 이 모든 것을 모니터링하는 AWS 도구가 있나요?

답은 '**예**'입니다!

[Amazon CloudWatch Application Signals](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-Application-Monitoring-Sections.html)는 AWS에서 애플리케이션을 쉽게 자동 계측하고 운영할 수 있게 해주는 새로운 기능입니다. Application Signals는 AWS의 애플리케이션을 계측하여 애플리케이션의 상태를 모니터링하고 비즈니스 목표에 대한 성능을 추적할 수 있게 합니다. Application Signals는 애플리케이션, 서비스 및 종속성에 대한 통합된 애플리케이션 중심 뷰를 제공하며, 애플리케이션 상태를 모니터링하고 분류하는 데 도움을 줍니다. Application Signals는 Amazon EKS, Amazon ECS, Amazon EC2에서 지원 및 테스트되었으며, 이 글 작성 시점에서는 Java 애플리케이션만 지원합니다!

Application Signals는 핵심 성능 메트릭에 대한 SLO 설정을 지원합니다. Application Signals를 사용하여 핵심 비즈니스 운영을 위한 서비스에 대한 서비스 수준 목표를 생성할 수 있습니다. 이러한 서비스에 SLO를 생성하면 SLO 대시보드에서 추적할 수 있어 가장 중요한 운영에 대한 한눈에 볼 수 있는 뷰를 제공합니다. 근본 원인 식별을 가속화하기 위해 Application Signals는 애플리케이션 성능의 포괄적인 뷰를 제공하며, 핵심 API 및 사용자 상호작용을 모니터링하는 CloudWatch Synthetics와 실제 사용자 성능을 모니터링하는 CloudWatch RUM의 추가 성능 신호를 통합합니다.

Application Signals는 발견하는 모든 서비스와 작업에 대해 지연 시간과 가용성 메트릭을 자동으로 수집하며, 이러한 메트릭은 SLI로 사용하기에 이상적인 경우가 많습니다. 동시에 Application Signals는 모든 CloudWatch 메트릭 또는 메트릭 표현식을 SLI로 사용할 수 있는 유연성을 제공합니다!

Application Signals는 애플리케이션 성능에 대한 모범 사례를 기반으로 애플리케이션을 자동 계측하고, Amazon EKS에서 실행되는 애플리케이션의 메트릭, 트레이스, 로그, Real User Monitoring, Synthetic Monitoring 전반에 걸쳐 텔레메트리를 상관시킵니다. 자세한 내용은 이 [블로그](https://aws.amazon.com/blogs/aws/amazon-cloudwatch-application-signals-for-automatic-instrumentation-of-your-applications-preview/)를 참조하세요.

CloudWatch Application Signals에서 SLO를 설정하여 서비스의 신뢰성을 모니터링하는 방법을 알아보려면 이 [블로그](https://aws.amazon.com/blogs/mt/how-to-monitor-application-health-using-slos-with-amazon-cloudwatch-application-signals/)를 확인하세요.

Observability는 안정적인 서비스를 구축하기 위한 기초 요소이며, 이를 통해 조직이 대규모로 효과적으로 운영할 수 있는 궤도에 오르게 됩니다. [Amazon CloudWatch Application Signals](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-Application-Monitoring-Sections.html)가 이 목표를 달성하는 데 훌륭한 도구가 될 것이라고 믿습니다.

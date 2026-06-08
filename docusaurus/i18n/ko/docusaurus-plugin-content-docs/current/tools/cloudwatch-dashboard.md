# CloudWatch Dashboard

## 소개

AWS 계정 내 리소스의 인벤토리 세부 정보, 리소스 성능 및 상태 확인을 파악하는 것은 안정적인 리소스 관리를 위해 매우 중요합니다. Amazon CloudWatch 대시보드는 CloudWatch 콘솔에서 제공하는 사용자 정의 가능한 홈페이지로, 리소스가 교차 계정에 있거나 여러 리전에 분산되어 있더라도 단일 뷰에서 리소스를 모니터링할 수 있습니다.

[Amazon CloudWatch 대시보드](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch_Dashboards.html)를 사용하면 재사용 가능한 그래프를 생성하고 클라우드 리소스 및 애플리케이션을 통합된 뷰로 시각화할 수 있습니다. CloudWatch 대시보드를 통해 고객은 메트릭과 로그 데이터를 통합된 뷰에서 나란히 그래프로 표시하여 빠르게 컨텍스트를 파악하고, 문제 진단에서 근본 원인 이해로 전환하며, 평균 복구 시간(MTTR)을 단축할 수 있습니다. 예를 들어, CPU 사용률이나 메모리 같은 핵심 메트릭의 현재 활용도를 시각화하고 할당된 용량과 비교할 수 있습니다. 또한 특정 메트릭의 로그 패턴을 상관시키고 성능 및 운영 이슈에 대한 알람을 설정할 수 있습니다. CloudWatch 대시보드는 알람의 현재 상태를 표시하여 빠르게 시각적으로 확인하고 조치를 취할 수 있도록 도와줍니다. CloudWatch 대시보드 공유 기능을 통해 표시된 대시보드 정보를 조직 내부 또는 외부의 팀이나 이해관계자에게 쉽게 공유할 수 있습니다.

## 위젯

#### 기본 위젯

위젯은 CloudWatch 대시보드의 구성 요소로서, AWS 환경 내 리소스 및 애플리케이션 메트릭과 로그에 대한 중요한 정보와 거의 실시간에 가까운 세부 정보를 표시합니다. 고객은 요구사항에 따라 위젯을 추가, 제거, 재배치 또는 크기 조정하여 대시보드를 원하는 경험에 맞게 사용자 정의할 수 있습니다.

대시보드에 추가할 수 있는 그래프 유형에는 Line, Number, Gauge, Stacked area, Bar, Pie가 있습니다.

**Line, Number, Gauge, Stacked area, Bar, Pie**와 같은 **Graph** 유형의 기본 위젯과 **Text, Alarm Status, Logs table, Explorer** 같은 다른 위젯도 사용할 수 있으며, 고객은 이를 선택하여 메트릭 또는 로그 데이터를 추가해 대시보드를 구축할 수 있습니다.

![Default Widgets](../images/cw_dashboards_widgets.png)

**추가 참고 자료:**

- AWS Observability Workshop: [Metric Number Widgets](https://catalog.workshops.aws/observability/en-US/aws-native/dashboards/metrics-number)
- AWS Observability Workshop: [Text Widgets](https://catalog.workshops.aws/observability/en-US/aws-native/dashboards/text-widget)
- AWS Observability Workshop: [Alarm Widgets](https://catalog.workshops.aws/observability/en-US/aws-native/dashboards/alarm-widgets)
- [CloudWatch 대시보드에서 위젯 생성 및 사용하기](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/create-and-work-with-widgets.html) 문서

#### 커스텀 위젯

고객은 CloudWatch 대시보드에 [커스텀 위젯을 추가](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/create-and-work-with-widgets.html)하여 맞춤형 시각화를 경험하거나, 여러 소스의 정보를 표시하거나, CloudWatch Dashboard에서 직접 작업을 수행하는 버튼과 같은 맞춤형 컨트롤을 추가할 수 있습니다. 커스텀 위젯은 Lambda 함수로 구동되는 완전한 서버리스 방식으로, 콘텐츠, 레이아웃 및 상호작용을 완벽하게 제어할 수 있습니다. 커스텀 위젯은 복잡한 웹 프레임워크를 배울 필요 없이 대시보드에 맞춤형 데이터 뷰 또는 도구를 구축하는 간편한 방법입니다. Lambda에서 코드를 작성하고 HTML을 생성할 수 있다면 유용한 커스텀 위젯을 만들 수 있습니다.

![Custom Widgets](../images/cw_dashboards_custom-widgets.png)

**추가 참고 자료:**

- AWS Observability Workshop: [커스텀 위젯](https://catalog.workshops.aws/observability/en-US/aws-native/dashboards/custom-widgets)
- GitHub의 [CloudWatch Custom Widgets Samples](https://github.com/aws-samples/cloudwatch-custom-widgets-samples#what-are-custom-widgets)
- 블로그: [Amazon CloudWatch 대시보드 커스텀 위젯 사용하기](https://aws.amazon.com/blogs/mt/introducing-amazon-cloudwatch-dashboards-custom-widgets/)

## 자동 대시보드

자동 대시보드는 모든 AWS 퍼블릭 리전에서 사용할 수 있으며, Amazon CloudWatch 하위의 모든 AWS 리소스에 대한 상태 및 성능의 집계된 뷰를 제공합니다. 이를 통해 고객은 모니터링을 빠르게 시작하고, 리소스 기반의 메트릭 및 알람 뷰를 확인하며, 성능 문제의 근본 원인을 쉽게 파악할 수 있습니다. 자동 대시보드는 AWS 서비스에서 권장하는 [모범 사례](https://docs.aws.amazon.com/prescriptive-guidance/latest/implementing-logging-monitoring-cloudwatch/cloudwatch-dashboards-visualizations.html)로 사전 구축되어 있으며, 리소스를 인식하고 중요한 성능 메트릭의 최신 상태를 반영하도록 동적으로 업데이트됩니다. 자동 서비스 대시보드는 서비스에 대한 모든 표준 CloudWatch 메트릭을 표시하고, 각 서비스 메트릭에 사용되는 모든 리소스를 그래프로 표시하며, 계정 전체에서 이상치 리소스를 빠르게 식별하여 활용도가 높거나 낮은 리소스를 파악하고 비용을 최적화하는 데 도움을 줍니다.

![Automatic Dashboards](../images/automatic-dashboard.png)

**추가 참고 자료:**

- AWS Observability Workshop: [자동 대시보드](https://catalog.workshops.aws/observability/en-US/aws-native/dashboards/autogen-dashboard)
- YouTube: [Amazon CloudWatch 대시보드를 사용한 AWS 리소스 모니터링](https://www.youtube.com/watch?v=I7EFLChc07M)

#### 자동 대시보드의 Container Insights

[CloudWatch Container Insights](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/ContainerInsights.html)는 컨테이너화된 애플리케이션 및 마이크로서비스에서 메트릭과 로그를 수집, 집계 및 요약합니다. Container Insights는 Amazon Elastic Container Service(Amazon ECS), Amazon Elastic Kubernetes Service(Amazon EKS) 및 Amazon EC2 기반 Kubernetes 플랫폼에서 사용할 수 있습니다. Container Insights는 Amazon ECS와 Amazon EKS 모두에서 Fargate에 배포된 클러스터의 메트릭 수집을 지원합니다. CloudWatch는 CPU, 메모리, 디스크, 네트워크 등 많은 리소스에 대한 메트릭을 자동으로 수집하며, 컨테이너 재시작 실패와 같은 진단 정보도 제공하여 문제를 격리하고 빠르게 해결할 수 있도록 도와줍니다.

CloudWatch는 [embedded metric format](/guides/signal-collection/emf/)을 사용하는 성능 로그 이벤트인 CloudWatch 메트릭으로서 클러스터, 노드, Pod, 태스크 및 서비스 수준의 집계된 메트릭을 생성합니다. 이는 대규모로 높은 카디널리티 데이터를 수집하고 저장할 수 있는 구조화된 JSON 스키마를 사용합니다. Container Insights가 수집하는 메트릭은 [CloudWatch 자동 대시보드](https://docs.aws.amazon.com/prescriptive-guidance/latest/implementing-logging-monitoring-cloudwatch/cloudwatch-dashboards-visualizations.html#use-automatic-dashboards)에서 확인할 수 있으며, CloudWatch 콘솔의 Metrics 섹션에서도 볼 수 있습니다.

![Container Insights](../images/Container_Insights_CW_Automatic_DB.png)

#### 자동 대시보드의 Lambda Insights

[CloudWatch Lambda Insights](https://docs.aws.amazon.com/lambda/latest/dg/monitoring-insights.html)는 AWS Lambda와 같은 서버리스 애플리케이션을 위한 모니터링 및 문제 해결 솔루션으로, Lambda 함수에 대한 동적 [자동 대시보드](https://docs.aws.amazon.com/prescriptive-guidance/latest/implementing-logging-monitoring-cloudwatch/cloudwatch-dashboards-visualizations.html#use-automatic-dashboards)를 생성합니다. 또한 CPU 시간, 메모리, 디스크, 네트워크를 포함한 시스템 수준 메트릭과 cold start 및 Lambda 워커 종료와 같은 진단 정보를 수집, 집계 및 요약하여 Lambda 함수의 문제를 격리하고 빠르게 해결할 수 있도록 도와줍니다. [Lambda Insights](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Lambda-Insights.html)는 함수 수준에서 레이어로 제공되는 Lambda 확장으로, 활성화되면 [embedded metric format](/guides/signal-collection/emf/)을 사용하여 로그 이벤트에서 메트릭을 추출하며 별도의 에이전트가 필요하지 않습니다.

![Lambda Insights](../images/Lambda_Insights_CW_Automatic_DB.png)

## 커스텀 대시보드

고객은 원하는 만큼 추가적인 [커스텀 대시보드](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/create_dashboard.html)를 다양한 위젯으로 생성하고 그에 맞게 사용자 정의할 수 있습니다. 대시보드는 교차 리전 및 교차 계정 뷰로 구성할 수 있으며, 즐겨찾기 목록에 추가할 수 있습니다.

![Custom Dashboards](../images/CustomDashboard.png)

고객은 자동 또는 커스텀 대시보드를 CloudWatch 콘솔의 [즐겨찾기 목록](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/add-dashboard-to-favorites.html)에 추가하여 콘솔 페이지의 탐색 창에서 빠르고 쉽게 접근할 수 있습니다.

**추가 참고 자료:**

- AWS Observability Workshop: [CloudWatch 대시보드](https://catalog.workshops.aws/observability/en-US/aws-native/dashboards/create)
- AWS Well-Architected Labs: [CloudWatch 대시보드를 사용한 모니터링](https://www.wellarchitectedlabs.com/performance-efficiency/100_labs/100_monitoring_windows_ec2_cloudwatch/) (성능 효율성)

#### CloudWatch 대시보드에 Contributor Insights 추가하기

CloudWatch는 [Contributor Insights](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/ContributorInsights.html)를 제공하여 로그 데이터를 분석하고 기여자 데이터를 표시하는 시계열을 생성합니다. 여기서 상위 N명의 기여자, 고유 기여자의 총 수 및 사용량에 대한 메트릭을 확인할 수 있습니다. 이를 통해 최다 트래픽 발생자를 찾고 시스템 성능에 영향을 미치는 요인을 파악할 수 있습니다. 예를 들어, 문제가 있는 호스트를 찾거나, 가장 많은 네트워크를 사용하는 사용자를 식별하거나, 가장 많은 오류를 발생시키는 URL을 찾을 수 있습니다.

Contributor Insights 보고서는 CloudWatch 콘솔의 [새로운 대시보드 또는 기존 대시보드](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/ContributorInsights-ViewReports.html)에 추가할 수 있습니다.

![Contributor Insights](../images/Contributor_Insights_CW_DB.png)

#### CloudWatch 대시보드에 Application Insights 추가하기

[CloudWatch Application Insights](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/cloudwatch-application-insights.html)는 AWS에 호스팅된 애플리케이션과 기본 AWS 리소스에 대한 Observability를 용이하게 하며, 이를 통해 제공되는 애플리케이션 상태에 대한 향상된 가시성은 애플리케이션 문제를 해결하기 위한 평균 복구 시간(MTTR)을 단축하는 데 도움을 줍니다. Application Insights는 모니터링되는 애플리케이션의 잠재적 문제를 보여주는 자동화된 대시보드를 제공하여, 고객이 애플리케이션 및 인프라의 진행 중인 문제를 빠르게 격리할 수 있도록 도와줍니다.

아래와 같이 Application Insights 내의 'Export to CloudWatch' 옵션을 사용하면 CloudWatch 콘솔에 대시보드가 추가되어 고객이 핵심 애플리케이션의 인사이트를 쉽게 모니터링할 수 있습니다.

![Application Insights](../images/Application_Insights_CW_DB.png)

#### CloudWatch 대시보드에 Service Map 추가하기

[CloudWatch ServiceLens](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/ServiceLens.html)는 트레이스, 메트릭, 로그, 알람 및 기타 리소스 상태 정보를 한 곳에 통합하여 서비스와 애플리케이션의 Observability를 향상시킵니다. ServiceLens는 CloudWatch와 AWS X-Ray를 통합하여 애플리케이션의 엔드투엔드 뷰를 제공함으로써 고객이 성능 병목 현상을 더 효율적으로 파악하고 영향을 받는 사용자를 식별할 수 있도록 합니다. [서비스 맵](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/servicelens_service_map.html)은 서비스 엔드포인트와 리소스를 노드로 표시하고, 각 노드와 연결의 트래픽, 지연 시간 및 오류를 강조합니다. 표시된 각 노드는 해당 서비스 부분과 관련된 상관 메트릭, 로그 및 트레이스에 대한 상세한 인사이트를 제공합니다.

아래와 같이 Service Map 내의 'Add to dashboard' 옵션을 사용하면 CloudWatch 콘솔에 새 대시보드를 추가하거나 기존 대시보드에 추가하여 고객이 애플리케이션의 인사이트를 쉽게 추적할 수 있습니다.

![Service Map](../images/Service_Map_CW_DB.png)

#### CloudWatch 대시보드에 Metrics Explorer 추가하기

CloudWatch의 [Metrics Explorer](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-Metrics-Explorer.html)는 태그 기반 도구로, 고객이 태그와 리소스 속성별로 메트릭을 필터링, 집계 및 시각화하여 AWS 서비스의 Observability를 향상시킬 수 있습니다. Metrics Explorer는 유연하고 동적인 문제 해결 경험을 제공하므로, 고객은 한 번에 여러 그래프를 생성하고 이러한 그래프를 사용하여 애플리케이션 상태 대시보드를 구축할 수 있습니다. Metrics Explorer 시각화는 동적이므로, Metrics Explorer 위젯을 생성하여 CloudWatch 대시보드에 추가한 후 일치하는 리소스가 생성되면 새 리소스가 Explorer 위젯에 자동으로 표시됩니다.

아래와 같이 Metrics Explorer 내의 '[Add to dashboard](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/add_metrics_explorer_dashboard.html)' 옵션을 사용하면 CloudWatch 콘솔에 새 대시보드를 추가하거나 기존 대시보드에 추가하여 고객이 AWS 서비스 및 리소스에 대한 더 많은 그래프 인사이트를 쉽게 얻을 수 있습니다.

![Metrics Explorer](../images/Metrics_Explorer_CW_DB.png)

## CloudWatch 대시보드를 사용한 시각화 대상

고객은 리전과 계정 전체에서 워크로드와 애플리케이션을 모니터링하기 위해 계정 및 애플리케이션 수준의 대시보드를 생성할 수 있습니다. CloudWatch 자동 대시보드는 서비스별 메트릭으로 사전 구성된 AWS 서비스 수준 대시보드로, 빠르게 시작할 수 있습니다. 프로덕션 환경에서 애플리케이션 또는 워크로드와 관련되고 중요한 핵심 메트릭과 리소스에 초점을 맞춘 애플리케이션 및 워크로드별 대시보드를 생성하는 것이 권장됩니다.

#### 메트릭 데이터 시각화

메트릭 데이터는 **Line, Number, Gauge, Stacked area, Bar, Pie** 같은 Graph 위젯을 통해 CloudWatch 대시보드에 추가할 수 있으며, **Average, Minimum, Maximum, Sum, SampleCount** 통계로 지원됩니다. [통계](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Statistics-definitions.html)는 지정된 기간에 걸친 메트릭 데이터 집계입니다.

![Metrics Data Visual](../images/graph_widget_metrics.png)

[Metric math](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/using-metric-math.html)를 사용하면 여러 CloudWatch 메트릭을 쿼리하고 수학 표현식을 사용하여 이러한 메트릭을 기반으로 새로운 시계열을 생성할 수 있습니다. 고객은 결과 시계열을 CloudWatch 콘솔에서 시각화하고 대시보드에 추가할 수 있습니다. 또한 [GetMetricDataAPI](https://docs.aws.amazon.com/AmazonCloudWatch/latest/APIReference/API_GetMetricData.html) 작업을 사용하여 프로그래밍 방식으로 metric math를 수행할 수도 있습니다.

**추가 참고 자료:**

- [CloudWatch를 사용한 IoT 플릿 모니터링](https://aws.amazon.com/blogs/iot/monitoring-your-iot-fleet-using-cloudwatch/)

#### 로그 데이터 시각화

고객은 막대 차트, 선 차트, 누적 영역 차트를 사용하여 CloudWatch 대시보드에서 [로그 데이터 시각화](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/CWL_Insights-Visualizing-Log-Data.html)를 구현하여 패턴을 더 효율적으로 식별할 수 있습니다. CloudWatch Logs Insights는 stats 함수와 하나 이상의 집계 함수를 사용하는 쿼리에 대해 막대 차트를 생성하는 시각화를 생성합니다. 쿼리가 bin() 함수를 사용하여 시간 경과에 따라 하나의 필드로 [데이터를 그룹화](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/CWL_Insights-Visualizing-Log-Data.html#CWL_Insights-Visualizing-ByFields)하는 경우, 선 차트와 누적 영역 차트를 시각화에 사용할 수 있습니다.

[시계열 데이터](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/CWL_Insights-Visualizing-Log-Data.html#CWL_Insights-Visualizing-TimeSeries)는 쿼리에 하나 이상의 status 함수 집계가 포함되어 있거나 쿼리가 bin() 함수를 사용하여 하나의 필드로 데이터를 그룹화하는 경우의 특성을 사용하여 시각화할 수 있습니다.

아래는 count()를 stats 함수로 사용하는 샘플 쿼리입니다.

```java
filter @message like /GET/
| parse @message '_ - - _ "GET _ HTTP/1.0" .*.*.*' as ip, timestamp, page, status, responseTime, bytes
| stats count() as request_count by status
```

위 쿼리에 대한 결과는 아래와 같이 CloudWatch Logs Insights에 표시됩니다.

![CloudWatch Logs Insights](../images/widget_logs_1.png)

쿼리 결과를 파이 차트로 시각화한 모습은 아래와 같습니다.

![CloudWatch Logs Insights Visualization](../images/widget_logs_2.png)

**추가 참고 자료:**

- AWS Observability Workshop: CloudWatch 대시보드에서 [로그 결과 표시](https://catalog.workshops.aws/observability/en-US/aws-native/logs/logsinsights/displayformats)
- [Amazon CloudWatch 대시보드로 AWS WAF 로그 시각화하기](https://aws.amazon.com/blogs/security/visualize-aws-waf-logs-with-an-amazon-cloudwatch-dashboard/)

#### 알람 시각화

CloudWatch의 메트릭 알람은 단일 메트릭 또는 CloudWatch 메트릭 기반의 수학 표현식 결과를 감시합니다. 알람은 일정 기간 동안 임계값 대비 메트릭 또는 표현식의 값을 기반으로 하나 이상의 작업을 수행합니다. [CloudWatch 대시보드](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/add_remove_alarm_dashboard.html)에는 알람의 메트릭 그래프와 알람 상태를 함께 표시하는 위젯에 단일 알람을 추가할 수 있습니다. 또한 그리드에 여러 알람의 상태를 표시하는 알람 상태 위젯을 CloudWatch 대시보드에 추가할 수 있습니다. 이 경우 알람 이름과 현재 상태만 표시되며, 그래프는 표시되지 않습니다.

아래는 CloudWatch 대시보드 내 알람 위젯에 캡처된 샘플 메트릭 알람 상태입니다.

![CloudWatch Alarms](../images/widget_alarms.png)

## 교차 계정 및 교차 리전

여러 AWS 계정을 보유한 고객은 [CloudWatch 교차 계정](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/cloudwatch_crossaccount_dashboard.html) Observability를 설정한 후 중앙 모니터링 계정에서 풍부한 교차 계정 대시보드를 생성하여, 계정 경계 없이 메트릭, 로그 및 트레이스를 원활하게 검색, 시각화 및 분석할 수 있습니다.

고객은 또한 여러 AWS 계정과 여러 리전의 CloudWatch 데이터를 단일 대시보드로 요약하는 [교차 계정 교차 리전](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/cloudwatch_xaxr_dashboard.html) 대시보드를 생성할 수 있습니다. 이 상위 수준 대시보드에서 고객은 전체 애플리케이션의 통합된 뷰를 얻고, 계정을 로그인/로그아웃하거나 리전을 전환하지 않고도 더 구체적인 대시보드로 드릴다운할 수 있습니다.

**추가 참고 자료:**

- [중앙 Amazon CloudWatch 대시보드에 새로운 교차 계정 Amazon EC2 인스턴스를 자동 추가하는 방법](https://aws.amazon.com/blogs/mt/how-to-auto-add-new-cross-account-amazon-ec2-instances-in-a-central-amazon-cloudwatch-dashboard/)
- [다중 계정 Amazon CloudWatch 대시보드 배포](https://aws.amazon.com/blogs/mt/deploy-multi-account-amazon-cloudwatch-dashboards/)
- YouTube: [교차 계정 및 교차 리전 CloudWatch 대시보드 생성](https://www.youtube.com/watch?v=eIUZdaqColg)

## 대시보드 공유

CloudWatch 대시보드는 팀 간, 이해관계자, 그리고 AWS 계정에 직접 접근 권한이 없는 조직 외부 인원에게 공유할 수 있습니다. 이러한 [공유 대시보드](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/cloudwatch-dashboard-sharing.html)는 팀 공간의 대형 스크린, 모니터링 또는 네트워크 운영 센터(NOC)에 표시하거나, Wiki 또는 공개 웹페이지에 임베드할 수도 있습니다.

대시보드를 쉽고 안전하게 공유할 수 있는 세 가지 방법이 있습니다.

- 대시보드를 [공개적으로 공유](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/cloudwatch-dashboard-sharing.html#share-cloudwatch-dashboard-public)하여 링크를 가진 모든 사람이 대시보드를 볼 수 있도록 할 수 있습니다.
- 대시보드를 볼 수 있는 사람들의 [특정 이메일 주소에 공유](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/cloudwatch-dashboard-sharing.html#share-cloudwatch-dashboard-email-addresses)할 수 있습니다. 각 사용자는 대시보드를 보기 위해 입력하는 자체 비밀번호를 생성합니다.
- [Single Sign-On(SSO) 공급자](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/cloudwatch-dashboard-sharing.html#share-cloudwatch-dashboards-setup-SSO)를 통해 AWS 계정 내에서 대시보드를 공유할 수 있습니다.

**대시보드를 공개적으로 공유할 때 유의사항**

대시보드에 민감하거나 기밀 정보가 포함된 경우 CloudWatch 대시보드를 공개적으로 공유하는 것은 권장되지 않습니다. 가능한 경우, 대시보드 공유 시 사용자명/비밀번호 또는 Single Sign-On(SSO)을 통한 인증을 사용하는 것이 권장됩니다.

대시보드를 공개적으로 접근 가능하게 설정하면, CloudWatch는 대시보드를 호스팅하는 웹 페이지의 링크를 생성합니다. 웹 페이지를 보는 모든 사람은 공개적으로 공유된 대시보드의 내용도 볼 수 있습니다. 웹 페이지는 공유하는 대시보드의 알람 및 Contributor Insights 규칙을 쿼리하기 위한 API를 호출할 수 있는 임시 자격 증명을 링크를 통해 제공하며, 대시보드에 표시되지 않더라도 계정의 모든 메트릭과 모든 EC2 인스턴스의 이름 및 태그에 접근할 수 있습니다. 이 정보를 공개적으로 제공하는 것이 적절한지 고려하시기 바랍니다.

대시보드를 웹 페이지에 공개적으로 공유를 활성화하면, 계정에 다음 Amazon Cognito 리소스가 생성됩니다: Cognito user pool, Cognito app client, Cognito Identity pool 및 IAM role.

**자격 증명을 사용하여 대시보드를 공유할 때 유의사항 (사용자명 및 비밀번호로 보호된 대시보드)**

대시보드를 공유하는 사용자에게 공유하고 싶지 않은 민감하거나 기밀 정보가 대시보드에 포함된 경우 CloudWatch 대시보드 공유는 권장되지 않습니다.

대시보드 공유가 활성화되면, CloudWatch는 대시보드를 호스팅하는 웹 페이지의 링크를 생성합니다. 위에서 지정한 사용자에게는 다음 권한이 부여됩니다: 공유하는 대시보드의 알람 및 Contributor Insights 규칙에 대한 CloudWatch 읽기 전용 권한, 그리고 대시보드에 표시되지 않더라도 계정의 모든 메트릭과 모든 EC2 인스턴스의 이름 및 태그에 대한 권한. 공유하는 사용자에게 이 정보를 제공하는 것이 적절한지 고려하시기 바랍니다.

대시보드를 지정한 사용자의 웹 페이지 접근을 위해 공유를 활성화하면, 계정에 다음 Amazon Cognito 리소스가 생성됩니다: Cognito user pool, Cognito users, Cognito app client, Cognito Identity pool 및 IAM role.

**SSO 공급자를 사용하여 대시보드를 공유할 때 유의사항**

CloudWatch 대시보드를 Single Sign-On(SSO)을 사용하여 공유하는 경우, 선택한 SSO 공급자에 등록된 사용자에게 공유된 계정의 모든 대시보드에 접근할 수 있는 권한이 부여됩니다. 또한 이 방법에서 대시보드 공유를 비활성화하면 모든 대시보드의 공유가 자동으로 해제됩니다.

**추가 참고 자료:**

- AWS Observability Workshop: [대시보드 공유](https://catalog.workshops.aws/observability/en-US/aws-native/dashboards/sharingdashboard)
- 블로그: [AWS Single Sign-On을 사용하여 Amazon CloudWatch 대시보드를 누구와도 공유하기](https://aws.amazon.com/blogs/mt/share-your-amazon-cloudwatch-dashboards-with-anyone-using-aws-single-sign-on/)
- 블로그: [Amazon CloudWatch 대시보드 공유를 통한 모니터링 정보 전달](https://aws.amazon.com/blogs/mt/communicate-monitoring-information-by-sharing-amazon-cloudwatch-dashboards/)

## 라이브 데이터

CloudWatch 대시보드는 워크로드에서 메트릭이 지속적으로 게시되는 경우 메트릭 위젯을 통해 [라이브 데이터](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/cloudwatch-live-data.html)를 표시할 수도 있습니다. 고객은 전체 대시보드 또는 대시보드의 개별 위젯에 대해 라이브 데이터를 활성화할 수 있습니다.

라이브 데이터가 **off**로 설정된 경우, 과거에 최소 1분의 집계 기간이 있는 데이터 포인트만 표시됩니다. 예를 들어, 5분 기간을 사용할 때 12:35의 데이터 포인트는 12:35에서 12:40까지 집계되어 12:41에 표시됩니다.

라이브 데이터가 **on**으로 설정된 경우, 해당 집계 간격에 데이터가 게시되는 즉시 가장 최근 데이터 포인트가 표시됩니다. 디스플레이를 새로 고칠 때마다 해당 집계 기간 내에 새로운 데이터가 게시되면 가장 최근 데이터 포인트가 변경될 수 있습니다.

## 애니메이션 대시보드

[애니메이션 대시보드](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/cloudwatch-animated-dashboard.html)는 시간 경과에 따라 캡처된 CloudWatch 메트릭 데이터를 재생하여, 고객이 추세를 확인하고, 프레젠테이션을 만들고, 문제 발생 후 분석할 수 있도록 도와줍니다. 대시보드에서 애니메이션되는 위젯에는 선 위젯, 누적 영역 위젯, 숫자 위젯 및 Metrics Explorer 위젯이 포함됩니다. 파이 그래프, 막대 차트, 텍스트 위젯 및 로그 위젯은 대시보드에 표시되지만 애니메이션되지 않습니다.

## CloudWatch Dashboard의 API/CLI 지원

AWS Management Console을 통해 CloudWatch 대시보드에 접근하는 것 외에도 API, AWS 명령줄 인터페이스(CLI) 및 AWS SDK를 통해 서비스에 접근할 수 있습니다. 대시보드용 CloudWatch API는 AWS CLI를 통한 자동화 또는 소프트웨어/제품과의 통합에 도움을 주어 리소스 및 애플리케이션 관리 또는 운영에 소요되는 시간을 줄일 수 있습니다.

- [ListDashboards](https://docs.aws.amazon.com/AmazonCloudWatch/latest/APIReference/API_ListDashboards.html): 계정의 대시보드 목록을 반환합니다.
- [GetDashboard](https://docs.aws.amazon.com/AmazonCloudWatch/latest/APIReference/API_GetDashboard.html): 지정한 대시보드의 세부 정보를 표시합니다.
- [DeleteDashboards](https://docs.aws.amazon.com/AmazonCloudWatch/latest/APIReference/API_DeleteDashboards.html): 지정한 모든 대시보드를 삭제합니다.
- [PutDashboard](https://docs.aws.amazon.com/AmazonCloudWatch/latest/APIReference/API_PutDashboard.html): 대시보드가 존재하지 않으면 생성하고, 기존 대시보드를 업데이트합니다. 대시보드를 업데이트하면 전체 내용이 여기서 지정한 내용으로 대체됩니다.

CloudWatch API Reference: [Dashboard Body Structure and Syntax](https://docs.aws.amazon.com/AmazonCloudWatch/latest/APIReference/CloudWatch-Dashboard-Body-Structure.html)

AWS 명령줄 인터페이스(AWS CLI)는 명령줄 셸에서 명령을 사용하여 AWS 서비스와 상호작용할 수 있는 오픈 소스 도구로, 터미널 프로그램의 명령 프롬프트에서 브라우저 기반 AWS Management Console이 제공하는 것과 동등한 기능을 구현합니다.

CLI 지원:

- [list-dashboards](https://docs.aws.amazon.com/cli/latest/reference/cloudwatch/list-dashboards.html)
- [get-dashboard](https://docs.aws.amazon.com/cli/latest/reference/cloudwatch/get-dashboard.html)
- [delete-dashboards](https://docs.aws.amazon.com/cli/latest/reference/cloudwatch/delete-dashboards.html)
- [put-dashboard](https://docs.aws.amazon.com/cli/latest/reference/cloudwatch/put-dashboard.html)

**추가 참고 자료:** AWS Observability Workshop: [CloudWatch 대시보드와 AWS CLI](https://catalog.workshops.aws/observability/en-US/aws-native/dashboards/createcli)

## CloudWatch Dashboard 자동화

CloudWatch 대시보드 생성을 자동화하기 위해, 고객은 CloudFormation 또는 Terraform과 같은 Infrastructure as Code(IaC) 도구를 사용할 수 있습니다. 이러한 도구는 AWS 리소스를 설정하여 고객이 리소스 관리에 소요되는 시간을 줄이고 AWS에서 실행되는 애플리케이션에 더 집중할 수 있도록 도와줍니다.

[AWS CloudFormation](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudwatch-dashboard.html)은 템플릿을 통해 대시보드 생성을 지원합니다. AWS::CloudWatch::Dashboard 리소스는 Amazon CloudWatch 대시보드를 지정합니다.

[Terraform](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/cloudwatch_dashboard)에도 IaC 자동화를 통해 CloudWatch 대시보드 생성을 지원하는 모듈이 있습니다.

원하는 위젯으로 대시보드를 수동으로 생성하는 것은 간단합니다. 하지만 Auto Scaling 그룹의 스케일 아웃 및 스케일 인 이벤트 중에 생성되거나 제거되는 EC2 인스턴스와 같은 동적 정보를 기반으로 하는 콘텐츠의 경우 리소스 소스를 업데이트하는 데 다소 노력이 필요할 수 있습니다. [Amazon EventBridge와 AWS Lambda를 사용하여 Amazon CloudWatch 대시보드를 자동으로 생성 및 업데이트](https://aws.amazon.com/blogs/mt/update-your-amazon-cloudwatch-dashboards-automatically-using-amazon-eventbridge-and-aws-lambda/)하려는 경우 블로그 게시물을 참조하세요.

**추가 참고 블로그:**

- [Amazon EBS 볼륨 KPI를 위한 Amazon CloudWatch 대시보드 생성 자동화](https://aws.amazon.com/blogs/storage/automating-amazon-cloudwatch-dashboard-creation-for-amazon-ebs-volume-kpis/)
- [AWS Systems Manager와 Ansible을 사용한 Amazon CloudWatch 알람 및 대시보드 생성 자동화](https://aws.amazon.com/blogs/mt/automate-creation-of-amazon-cloudwatch-alarms-and-dashboards-with-aws-systems-manager-and-ansible/)
- [AWS CDK를 사용하여 AWS Outposts용 자동화된 Amazon CloudWatch 대시보드 배포](https://aws.amazon.com/blogs/compute/deploying-an-automated-amazon-cloudwatch-dashboard-for-aws-outposts-using-aws-cdk/)

**제품 FAQ**: [CloudWatch 대시보드](https://aws.amazon.com/cloudwatch/faqs/#Dashboards)

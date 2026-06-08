# 메트릭

메트릭은 시스템의 성능에 대한 데이터입니다. 시스템 또는 리소스와 관련된 모든 메트릭을 중앙 집중식으로 확인할 수 있으면, 메트릭을 비교하고, 성능을 분석하며, 리소스의 스케일업 또는 스케일인과 같은 더 나은 전략적 결정을 내릴 수 있습니다. 메트릭은 또한 리소스의 상태를 파악하고 선제적 조치를 취하는 데에도 중요합니다.

메트릭 데이터는 기초적인 요소로서, [알람](../signals/alarms.md), 이상 탐지, [이벤트](../signals/events.md), [대시보드](./dashboards.md) 등을 구동하는 데 사용됩니다.

## 제공 메트릭 (Vended metrics)

[CloudWatch 메트릭](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/working_with_metrics.html)은 시스템의 성능에 대한 데이터를 수집합니다. 기본적으로 대부분의 AWS 서비스는 리소스에 대한 무료 메트릭을 제공합니다. 여기에는 [Amazon EC2](https://aws.amazon.com/ec2/) 인스턴스, [Amazon RDS](https://aws.amazon.com/rds/), [Amazon S3](https://aws.amazon.com/s3/?p=pm&c=s3&z=4) 버킷 등이 포함됩니다.

이러한 메트릭을 *제공 메트릭(vended metrics)*이라고 합니다. AWS 계정에서 제공 메트릭을 수집하는 데에는 비용이 부과되지 않습니다.

:::info
	CloudWatch로 메트릭을 내보내는 AWS 서비스의 전체 목록은 [이 페이지](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/aws-services-cloudwatch-metrics.html)를 참조하세요.
:::
## 메트릭 쿼리

CloudWatch의 [metric math](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/using-metric-math.html) 기능을 활용하여 여러 메트릭을 쿼리하고 수학 표현식을 사용하여 더 세밀하게 메트릭을 분석할 수 있습니다. 예를 들어, Lambda 오류율을 구하기 위해 다음과 같은 metric math 표현식을 작성할 수 있습니다:

	Errors/Requests

아래는 CloudWatch 콘솔에서 이 표현식이 어떻게 표시되는지 보여주는 예시입니다:

![Metric math 예시](../images/metrics1.png)

:::info
	metric math를 사용하여 데이터에서 최대한의 가치를 얻고, 개별 데이터 소스의 성능으로부터 파생된 값을 도출하세요.
:::
CloudWatch는 조건문도 지원합니다. 예를 들어, 지연 시간이 특정 임계값을 초과하는 각 시계열에 대해 `1` 값을 반환하고 나머지 모든 데이터 포인트에 대해 `0`을 반환하려면 다음과 같은 쿼리를 사용합니다:

	IF(latency>threshold, 1, 0)

CloudWatch 콘솔에서 이 로직을 사용하여 불리언 값을 생성할 수 있으며, 이를 통해 [CloudWatch 알람](./alarms.md)이나 다른 액션을 트리거할 수 있습니다. 이 기능을 통해 파생된 데이터 포인트에서 자동 액션을 실행할 수 있습니다. CloudWatch 콘솔의 예시는 아래와 같습니다:

![파생된 값으로부터 알람 생성](../images/metrics2.png)

:::info
	파생된 값이 임계값을 초과할 때 알람과 알림을 트리거하기 위해 조건문을 사용하세요.
:::
`SEARCH` 함수를 사용하여 모든 메트릭의 상위 `n`개를 표시할 수도 있습니다. 많은 수의 시계열(예: 수천 대의 서버)에서 최고 또는 최저 성능의 메트릭을 시각화할 때, 이 접근 방식을 통해 가장 중요한 데이터만 볼 수 있습니다. 다음은 지난 5분 동안 평균 CPU 사용량이 가장 높은 상위 2개의 EC2 인스턴스를 반환하는 검색 예시입니다:
```
	SLICE(SORT(SEARCH('{AWS/EC2,InstanceId} MetricName="CPUUtilization"', 'Average', 300), MAX, DESC),0, 2)
```
CloudWatch 콘솔에서의 동일한 뷰:

![CloudWatch 메트릭의 검색 쿼리](../images/metrics3.png)

:::info
	`SEARCH` 접근 방식을 사용하여 환경에서 가장 가치 있거나 성능이 낮은 리소스를 신속하게 표시하고, 이를 [대시보드](./dashboards.md)에 표시하세요.
:::
## 메트릭 수집

EC2 인스턴스의 메모리나 디스크 공간 사용률과 같은 추가 메트릭이 필요한 경우, [CloudWatch 에이전트](./cloudwatch_agent.md)를 사용하여 이 데이터를 CloudWatch에 푸시할 수 있습니다. 또는 그래프 형태로 시각화해야 하는 커스텀 처리 데이터가 있고 이를 CloudWatch 메트릭으로 사용하고 싶다면, [`PutMetricData` API](https://docs.aws.amazon.com/AmazonCloudWatch/latest/APIReference/API_PutMetricData.html)를 사용하여 커스텀 메트릭을 CloudWatch에 게시할 수 있습니다.

:::info
	bare API 대신 [AWS SDK](https://aws.amazon.com/developer/tools/) 중 하나를 사용하여 CloudWatch에 메트릭 데이터를 푸시하세요.
:::
`PutMetricData` API 호출은 쿼리 횟수에 따라 과금됩니다. `PutMetricData` API를 최적으로 사용하는 것이 모범 사례입니다. 이 API에서 Values and Counts 방식을 사용하면 하나의 `PutMetricData` 요청으로 메트릭당 최대 150개의 값을 게시할 수 있으며, 이 데이터에 대한 백분위수 통계 검색도 지원됩니다. 따라서 각 데이터 포인트마다 별도의 API 호출을 하는 대신, 모든 데이터 포인트를 그룹화한 후 단일 `PutMetricData` API 호출로 CloudWatch에 푸시해야 합니다. 이 접근 방식은 다음 두 가지 측면에서 이점이 있습니다:

1. CloudWatch 비용 절감
1. `PutMetricData` API 스로틀링 방지

:::info
	`PutMetricData`를 사용할 때 모범 사례는 가능한 한 데이터를 단일 `PUT` 작업으로 배치하는 것입니다.
:::
:::info
	대량의 메트릭을 CloudWatch로 내보내는 경우, 대안적인 접근 방식으로 [Embedded Metric Format](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch_Embedded_Metric_Format_Manual.html)을 사용하는 것을 고려하세요. Embedded Metric Format은 `PutMetricData`를 사용하거나 그에 대한 요금을 부과하지 않지만, [CloudWatch Logs](./logs/index.md) 사용에 따른 비용은 발생합니다.
:::
## 이상 탐지

CloudWatch에는 기록된 메트릭을 기반으로 *정상* 상태가 무엇인지 학습하여 Observability 전략을 강화하는 [이상 탐지](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch_Anomaly_Detection.html) 기능이 있습니다. 이상 탐지의 사용은 모든 메트릭 신호 수집 시스템에 대한 [모범 사례](../signals/metrics.md#use-anomaly-detection-algorithms)입니다.

이상 탐지는 2주 기간에 걸쳐 모델을 구축합니다.

:::warning
	이상 탐지는 생성 시점부터 앞으로만 모델을 구축합니다. 과거의 이상값을 찾기 위해 시간을 역추적하지 않습니다.
:::

:::warning
	이상 탐지는 메트릭에 대해 *좋은 것*이 무엇인지 알지 못하며, 표준 편차를 기반으로 *정상*이 무엇인지만 파악합니다.
:::

:::info
	모범 사례는 정상적인 동작이 예상되는 시간대에만 분석하도록 이상 탐지 모델을 학습시키는 것입니다. 학습에서 제외할 시간대(야간, 주말 또는 공휴일 등)를 정의할 수 있습니다.
:::
다음은 이상 탐지 밴드의 예시이며, 회색 영역이 밴드를 나타냅니다.

![이상 탐지 밴드](../images/metrics4.png)

이상 탐지의 제외 윈도우 설정은 CloudWatch 콘솔, [CloudFormation](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudwatch-anomalydetector-configuration.html), 또는 AWS SDK 중 하나를 사용하여 수행할 수 있습니다.

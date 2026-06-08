# 백분위수가 중요한 이유

백분위수(Percentile)는 모니터링과 보고에서 중요합니다. 평균에만 의존하는 것보다 데이터 분포에 대한 더 상세하고 정확한 시각을 제공하기 때문입니다. 평균은 때로 이상치나 데이터의 변동과 같은 중요한 정보를 숨길 수 있으며, 이는 성능과 사용자 경험에 큰 영향을 미칠 수 있습니다. 반면 백분위수는 이렇게 숨겨진 세부 사항을 드러내고 데이터가 어떻게 분포되어 있는지 더 잘 이해할 수 있게 해줍니다.

[Amazon CloudWatch](https://aws.amazon.com/cloudwatch/)에서 백분위수를 사용하여 응답 시간, 지연 시간, 오류율 등 애플리케이션과 인프라 전반의 다양한 지표를 모니터링하고 보고할 수 있습니다. 백분위수에 알람을 설정하면 특정 백분위수 값이 임계값을 초과할 때 알림을 받을 수 있어, 더 많은 고객에게 영향을 미치기 전에 조치를 취할 수 있습니다.

CloudWatch에서 [백분위수를 사용](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/cloudwatch_concepts.html#Percentiles)하려면 CloudWatch 콘솔의 **All metrics**에서 지표를 선택하고 기존 지표를 사용하여 **statistic**을 **p99**로 설정한 후, p 뒤의 값을 원하는 백분위수로 편집할 수 있습니다. 그런 다음 백분위수 그래프를 보고, [CloudWatch 대시보드](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch_Dashboards.html)에 추가하고, 이 지표에 알람을 설정할 수 있습니다. 예를 들어, 응답 시간의 95번째 백분위수가 특정 임계값을 초과할 때 알림을 받도록 알람을 설정하여 상당 비율의 사용자가 느린 응답 시간을 경험하고 있음을 나타낼 수 있습니다.

아래 히스토그램은 [Amazon Managed Grafana](https://aws.amazon.com/grafana/)에서 [CloudWatch RUM](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-RUM.html) 로그의 [CloudWatch Logs Insights](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/AnalyzingLogData.html) 쿼리를 사용하여 생성되었습니다. 사용된 쿼리는 다음과 같습니다:

```
fields @timestamp, event_details.duration
| filter event_type = "com.amazon.rum.performance_navigation_event"
| sort @timestamp desc
```

히스토그램은 밀리초 단위의 페이지 로드 시간을 표시합니다. 이 뷰로 이상치를 명확하게 확인할 수 있습니다. 평균을 사용하면 이 데이터가 숨겨집니다.

![히스토그램](../../../images/percentiles-histogram.png)

평균값을 사용하여 CloudWatch에서 동일한 데이터를 보면 페이지 로딩이 2초 미만인 것으로 나타납니다. 위의 히스토그램에서 볼 수 있듯이, 대부분의 페이지는 실제로 1초 미만이며 이상치가 있습니다.

![히스토그램](../../../images/percentiles-average.png)

동일한 데이터를 백분위수(p99)로 사용하면 문제가 있음을 나타냅니다. CloudWatch 그래프는 이제 페이지 로드의 99%가 23초 미만에 완료됨을 보여줍니다.

![히스토그램](../../../images/percentiles-p99.png)

이를 더 쉽게 시각화하기 위해, 아래 그래프는 평균값과 99번째 백분위수를 비교합니다. 이 경우 목표 페이지 로드 시간은 2초이며, 대체 [CloudWatch 통계](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Statistics-definitions.html#Percentile-versus-Trimmed-Mean)와 [metric math](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/using-metric-math.html)를 사용하여 다른 계산을 수행할 수 있습니다. 이 경우 Percentile rank(PR)가 통계 **PR(:2000)**과 함께 사용되어 페이지 로드의 92.7%가 2000ms 목표 내에서 발생하고 있음을 보여줍니다.

![히스토그램](../../../images/percentiles-comparison.png)

CloudWatch에서 백분위수를 사용하면 시스템 성능에 대한 더 깊은 인사이트를 얻고, 문제를 조기에 감지하며, 그렇지 않으면 숨겨질 이상치를 식별하여 고객 경험을 개선할 수 있습니다.




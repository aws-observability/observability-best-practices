# CloudWatch Logs Insights 예제 쿼리

[CloudWatch Logs Insights](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/AnalyzingLogData.html)는 CloudWatch 로그 데이터를 분석하고 쿼리하기 위한 강력한 플랫폼을 제공합니다. 몇 가지 간단하지만 강력한 명령어를 갖춘 SQL과 유사한 쿼리 언어를 사용하여 로그 데이터를 대화형으로 검색할 수 있습니다.

CloudWatch Logs Insights는 다음 카테고리에 대한 기본 제공 예제 쿼리를 제공합니다:

- Lambda
- VPC Flow Logs
- CloudTrail
- Common Queries
- Route 53
- AWS AppSync
- NAT Gateway

이 모범 사례 가이드 섹션에서는 현재 기본 제공 예제에 포함되지 않은 다른 유형의 로그에 대한 예제 쿼리를 제공합니다. 이 목록은 시간이 지남에 따라 발전하고 변경될 것이며, GitHub에서 [이슈](https://github.com/aws-observability/observability-best-practices/issues)를 남겨 자신의 예제를 검토용으로 제출할 수 있습니다.

## API Gateway

### HTTP 메서드 유형을 포함하는 마지막 20개 메시지

```
filter @message like /$METHOD/ 
| fields @timestamp, @message
| sort @timestamp desc
| limit 20
```

이 쿼리는 특정 HTTP 메서드를 포함하는 마지막 20개 로그 메시지를 타임스탬프 내림차순으로 반환합니다. **METHOD**를 쿼리하려는 메서드로 대체하세요. 다음은 이 쿼리를 사용하는 예시입니다:

```
filter @message like /POST/ 
| fields @timestamp, @message
| sort @timestamp desc
| limit 20
```

:::tip
    다른 수의 메시지를 반환하려면 $limit 값을 변경할 수 있습니다.
:::

### IP별로 정렬된 상위 20개 통신자

```
fields @timestamp, @message
| stats count() by ip
| sort ip asc
| limit 20
```

이 쿼리는 IP별로 정렬된 상위 20개 통신자를 반환합니다. API에 대한 악의적인 활동을 감지하는 데 유용할 수 있습니다.

다음 단계로 메서드 유형에 대한 추가 필터를 추가할 수 있습니다. 예를 들어, 이 쿼리는 IP별 상위 통신자를 보여주지만 "PUT" 메서드 호출만 표시합니다:

```
fields @timestamp, @message
| filter @message like /PUT/
| stats count() by ip
| sort ip asc
| limit 20
```

## CloudTrail Logs

### 오류 카테고리별로 그룹화된 API 스로틀링 오류

```
stats count(errorCode) as eventCount by eventSource, eventName, awsRegion, userAgent, errorCode
| filter errorCode = 'ThrottlingException' 
| sort eventCount desc
```

이 쿼리를 사용하면 카테고리별로 그룹화되고 내림차순으로 표시되는 API 스로틀링 오류를 확인할 수 있습니다.

:::tip
    이 쿼리를 사용하려면 먼저 [CloudTrail 로그를 CloudWatch로 전송](https://docs.aws.amazon.com/awscloudtrail/latest/userguide/send-cloudtrail-events-to-cloudwatch-logs.html)하고 있는지 확인해야 합니다.
:::
    
### 라인 그래프로 표시한 Root 계정 활동

```
fields @timestamp, @message, userIdentity.type 
| filter userIdentity.type='Root' 
| stats count() as RootActivity by bin(5m)
```

이 쿼리를 사용하면 라인 그래프에서 root 계정 활동을 시각화할 수 있습니다. 이 쿼리는 시간에 따른 root 활동을 집계하여 각 5분 간격 내에서 root 활동 발생 횟수를 계산합니다.
:::tip
     [로그 데이터를 그래프로 시각화](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/CWL_Insights-Visualizing-Log-Data.html)
:::

## VPC Flow Logs

### 선택한 소스 IP 주소에 대해 REJECT 조치로 필터링한 Flow Logs

```
fields @timestamp, @message, @logStream, @log  | filter srcAddr like '$SOURCEIP' and action = 'REJECT'
| sort @timestamp desc
| limit 20
```

이 쿼리는 $SOURCEIP에서 'REJECT'를 포함하는 마지막 20개 로그 메시지를 반환합니다. 트래픽이 명시적으로 거부되었는지, 또는 문제가 클라이언트 측 네트워크 구성 문제인지 감지하는 데 사용할 수 있습니다.

:::tip
    관심 있는 IP 주소의 값을 '$SOURCEIP'에 대체하세요.
:::

```
fields @timestamp, @message, @logStream, @log  | filter srcAddr like '10.0.0.5' and action = 'REJECT'
| sort @timestamp desc
| limit 20
```

### 가용 영역별 네트워크 트래픽 그룹화

```
stats sum(bytes / 1048576) as Traffic_MB by azId as AZ_ID 
| sort Traffic_MB desc
```

이 쿼리는 가용 영역(AZ)별로 그룹화된 네트워크 트래픽 데이터를 검색합니다. 바이트를 합산하고 MB로 변환하여 총 트래픽을 메가바이트(MB)로 계산합니다. 결과는 각 AZ의 트래픽 볼륨을 기준으로 내림차순으로 정렬됩니다.


### 흐름 방향별 네트워크 트래픽 그룹화

```
stats sum(bytes / 1048576) as Traffic_MB by flowDirection as Flow_Direction 
| sort by Bytes_MB desc
```

이 쿼리는 흐름 방향별로 그룹화된 네트워크 트래픽을 분석하도록 설계되었습니다. (Ingress 또는 Egress)


### 소스 및 대상 IP 주소별 상위 10개 데이터 전송

```
stats sum(bytes / 1048576) as Data_Transferred_MB by srcAddr as Source_IP, dstAddr as Destination_IP 
| sort Data_Transferred_MB desc 
| limit 10
```

이 쿼리는 소스 및 대상 IP 주소별 상위 10개 데이터 전송을 검색합니다. 이 쿼리를 사용하면 특정 소스와 대상 IP 주소 간의 가장 중요한 데이터 전송을 식별할 수 있습니다.

## Amazon SNS Logs

### 이유별 SMS 메시지 실패 건수

```
filter status = "FAILURE"
| stats count(*) by delivery.providerResponse as FailureReason
| sort delivery.providerResponse desc
```

위의 쿼리는 이유별로 내림차순으로 정렬된 전달 실패 건수를 나열합니다. 이 쿼리를 사용하여 전달 실패의 원인을 찾을 수 있습니다.

### 유효하지 않은 전화번호로 인한 SMS 메시지 실패

```
fields notification.messageId as MessageId, delivery.destination as PhoneNumber
| filter status = "FAILURE" and delivery.providerResponse = "Invalid phone number"
| limit 100
```

이 쿼리는 유효하지 않은 전화번호로 인해 전달에 실패한 메시지를 반환합니다. 수정이 필요한 전화번호를 식별하는 데 사용할 수 있습니다.

### SMS 유형별 메시지 실패 통계

```
fields delivery.smsType
| filter status = "FAILURE"
| stats count(notification.messageId), avg(delivery.dwellTimeMs), sum(delivery.priceInUSD) by delivery.smsType
```

이 쿼리는 각 SMS 유형(Transactional 또는 Promotional)에 대한 건수, 평균 대기 시간 및 지출을 반환합니다. 이 쿼리를 사용하여 시정 조치를 트리거하는 임계값을 설정할 수 있습니다. 특정 SMS 유형만 시정 조치가 필요한 경우, 해당 SMS 유형만 필터링하도록 쿼리를 수정할 수 있습니다.

### SNS 실패 알림 통계

```
fields @MessageID 
| filter status = "FAILURE"
| stats count(delivery.deliveryId) as FailedDeliveryCount, avg(delivery.dwellTimeMs) as AvgDwellTime, max(delivery.dwellTimeMs) as MaxDwellTime by notification.messageId as MessageID
| limit 100
```

이 쿼리는 각 실패한 메시지에 대한 건수, 평균 대기 시간 및 지출을 반환합니다. 이 쿼리를 사용하여 시정 조치를 트리거하는 임계값을 설정할 수 있습니다.




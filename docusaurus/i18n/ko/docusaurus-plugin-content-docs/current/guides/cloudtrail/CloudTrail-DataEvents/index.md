---
sidebar_position: 4
---
# CloudTrail 데이터 이벤트

AWS CloudTrail 모범 사례에 따르면, 보안에 민감한 워크로드에 대해 멀티 리전 Trail 수준에서 데이터 이벤트를 기록하는 것이 좋습니다. 엄격한 컴플라이언스 요구 사항이 있는 워크로드의 경우, 리소스 수준의 활동을 감사하기 위해 데이터 이벤트를 활성화할 것을 권장합니다. 데이터 이벤트를 로깅하면 데이터 수준에서 감사할 수 있으며, 가시성을 확보하려는 리소스 내부의 변경 사항도 포함됩니다.

CloudTrail은 Observability를 강화하고 다양한 서비스에 대한 데이터 이벤트를 지원합니다. 이러한 데이터 이벤트를 활용하면 중요한 컴플라이언스, 위험 관리, 보안 목표를 달성하는 데 도움이 됩니다. 이러한 유형의 이벤트 예시로는 삭제, 업데이트, 항목 넣기 등 객체 수준의 API 활동이 있습니다. CloudTrail 데이터 이벤트가 제공하는 향상된 가시성의 예시로는 Amazon Bedrock의 에이전트 별칭 또는 지식 기반에 대한 API 활동, Amazon Q Business의 애플리케이션 또는 데이터 소스에 대한 활동, SageMaker의 Feature Store에 대한 API 활동 등이 있습니다. 이를 통해 다음과 같은 핵심 위험 관리 이점을 제공합니다:

* 개인 데이터 및 민감한 정보에 대한 접근 모니터링
* 개인 데이터 및 민감한 데이터 수정에 대한 가시성 확보
* 개인 데이터 및 민감한 정보를 처리하는 애플리케이션의 활동 감사
* 잠재적 데이터 유출 및 개인정보 침해 사고 탐지
* 개인정보 보호 감사 및 컴플라이언스 보고 지원

### 데이터 이벤트를 위한 Advanced Event Selectors
데이터 이벤트를 사용할 때 Advanced Event Selectors를 활용하면 이벤트 데이터 스토어에 수집되는 CloudTrail 이벤트를 더욱 세밀하게 제어할 수 있습니다. Advanced Event Selectors를 사용하면 EventSource, EventName, userIdentity.arn, ResourceARN과 같은 필드의 값을 포함하거나 제외할 수 있습니다. 또한 부분 문자열에 대한 패턴 매칭을 통해 값을 포함하거나 제외하는 것도 지원합니다. 이를 통해 보안, 컴플라이언스, 운영 조사의 효율성과 정확성을 높이면서 비용을 절감할 수 있습니다. 예를 들어, userIdentity.arn 속성을 기반으로 CloudTrail 이벤트를 필터링하여 특정 IAM 역할이나 사용자가 생성한 이벤트를 제외할 수 있습니다. 모니터링 목적으로 빈번한 API 호출을 수행하는 서비스에서 사용하는 전용 IAM 역할을 제외할 수 있습니다. 이를 통해 CloudTrail Lake에 수집되는 CloudTrail 이벤트의 양을 크게 줄여 비용을 절감하면서도 관련 사용자 및 시스템 활동에 대한 가시성을 유지할 수 있습니다.

![CloudTrail Lake Data Events](/img/cloudops/guides/cloudtrail-lake/cloudtrail-data-events-advanced-selector.png "Advanced Event Selectors for Data Events")

### **워크로드별**

다음 섹션에서는 Trail 및 이벤트 데이터 스토어에서 사용할 수 있는 리소스 유형을 활용하여 특정 워크로드를 모니터링하고 감사하는 모범 사례를 제공합니다. 예를 들어, Amazon S3에 대한 데이터 이벤트를 로깅할 때 `PutObject` API 작업을 캡처하면 Amazon S3 객체에 대해 수행되는 모든 리소스 수준의 작업을 기록할 수 있습니다. 이를 통해 Amazon S3 객체의 리소스 수준에서 수행된 작업에 대한 가시성을 확보할 수 있습니다.

### **Amazon SNS 및 Amazon SQS**

Amazon SNS 보안 모범 사례와 Amazon SQS 보안 모범 사례에 따르면, Amazon SNS 및 Amazon SQS에 접근할 때 VPC 엔드포인트를 사용하는 것을 권장합니다. 예를 들어, 상호작용해야 하지만 인터넷에 절대 노출되어서는 안 되는 Amazon SNS 토픽이나 Amazon SQS 대기열이 있는 경우, VPC 엔드포인트를 사용하면 특정 VPC 내의 호스트에서만 Amazon SNS 토픽에 게시하거나 Amazon SQS 대기열에 메시지를 보낼 수 있도록 접근을 제어할 수 있습니다.

CloudTrail에서 Amazon SNS에 대한 데이터 이벤트를 활성화하면 모든 Amazon SNS 토픽에 대한 `Publish` 및 `PublishBatch` API 작업을 감사할 수 있습니다. 마찬가지로, [Amazon SQS에 대한 데이터 이벤트](https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/sqs-logging-using-cloudtrail.html#sqs-data-events-in-cloud-trail)를 활성화하면 `SendMessage` API 작업을 통해 VPC 내 인스턴스에서 Amazon SQS 대기열로 메시지를 보낼 때 인터넷을 거치지 않고 VPC 엔드포인트를 사용하고 있는지 감사할 수 있습니다.

아래 쿼리는 Amazon SNS의 [Publish](https://docs.aws.amazon.com/sns/latest/api/API_Publish.html) 이벤트에 대한 API 작업을 보여주며, Amazon SNS 토픽에 메시지가 게시되었음을 나타냅니다. 결과에는 해당 작업을 수행한 [IAM](https://aws.amazon.com/iam/) 엔티티와 메시지가 전송된 특정 VPC 엔드포인트 ID도 표시됩니다. VPC 엔드포인트 ID가 없는 경우, Publish API 호출이 VPC 엔드포인트를 사용하지 않고 수행된 것입니다.

#### SQL 쿼리:

```
SELECT eventTime,
    substr(userIdentity.arn, strpos(userIdentity.arn, '/') +1) as IAM, 
    recipientAccountId, 
    awsRegion, 
    eventName,sourceIPAddress, 
    substr(element_At(requestParameters, 'topicArn'), 
    strpos(element_At(requestParameters, 'topicArn'), '.com/') +18) as Topic, 
    vpcEndpointId
FROM $EDS_ID
    WHERE eventSource = 'sns.amazonaws.com'
    AND eventName = 'Publish'
    AND eventtime >= '2024-06-24 00:00:00'
    AND eventtime <= '2024-06-24 23:59:59'
```

Amazon SNS 쿼리에서 보여준 것과 마찬가지로, 아래 쿼리는 Amazon SQS의 [SendMessage](https://docs.aws.amazon.com/AWSSimpleQueueService/latest/APIReference/API_SendMessage.html) 이벤트에 대한 API 작업을 보여주며, 특정 Amazon SQS 대기열에 메시지가 전송되었음을 나타냅니다. 이 결과에도 해당 작업을 수행한 [IAM](https://aws.amazon.com/iam/) 엔티티와 메시지가 전송된 특정 VPC 엔드포인트 ID가 표시됩니다.

#### SQL 쿼리:

```
SELECT eventTime, 
    substr(userIdentity.arn, strpos(userIdentity.arn, '/') +1) as IAM, 
    recipientAccountId, 
    awsRegion, 
    eventName,sourceIPAddress, 
    substr(element_At(requestParameters, 'queueUrl'), 
    strpos(element_At(requestParameters, 'queueUrl'), '.com/') +18) as Queue, 
    vpcEndpointId
FROM $EDS_ID
WHERE eventSource = 'sqs.amazonaws.com'
    AND eventName = 'SendMessage'
    AND eventtime >= '2024-06-24 00:00:00'
    AND eventtime <= '2024-06-24 23:59:59'
```

### Amazon Q for Business

Amazon Q for Business 워크로드의 경우 **AWS::QBusiness::Application** 및 **AWS::S3::Object**에 대한 데이터 이벤트를 구성할 수 있습니다. **AWS::QBusiness::Application**은 Amazon Q Business 애플리케이션과 관련된 데이터 플레인 활동을 로깅하고, **AWS::S3::Object**는 소스 Amazon S3 버킷에 대한 데이터 이벤트를 기록합니다. Trail 또는 이벤트 데이터 스토어에 데이터 이벤트를 구성하면, Amazon Q Business 및 Amazon S3에 대한 이벤트가 생성되기 시작합니다.

아래 쿼리는 [BatchDeleteDocument](https://docs.aws.amazon.com/amazonq/latest/api-reference/API_BatchDeleteDocument.html)에 대한 API 호출을 보여주며, Amazon Q Business 애플리케이션에서 사용된 하나 이상의 문서가 삭제되었음을 나타냅니다.

#### SQL 쿼리:

```
SELECT
    eventName, COUNT(*) AS numberOfCallsFROM
<event-data-store-ID>
WHERE
    eventSource='qbusiness.amazonaws.com' AND eventTime > date_add('day', -1, now())
Group
BY eventName ORDER BY COUNT(*) DESC
```

아래 쿼리는 BatchDeleteDocument API 호출과 관련된 IAM 자격 증명을 찾는 데 도움이 됩니다.

#### SQL 쿼리:

```
SELECT
 sourceIPAddress, eventTime, userIdentity.principalid
 FROM
 <event-data-store-ID>
 WHERE
 eventName='BatchDeleteDocument' AND eventTime > date_add('day', -1, now())
```

아래 쿼리는 StartDataSourceSyncJob API 호출을 확인하여 어떤 작업이 S3 데이터 소스와 Amazon Q Business 애플리케이션 간의 동기화를 트리거했는지 보여줍니다.

#### SQL 쿼리:

```
SELECT
 sourceIPAddress, eventTime, userIdentity.arn AS user
 FROM
 <event-data-store-ID>
 WHERE
 eventName='StartDataSourceSyncJob' AND eventTime > date_add('day', -1, now())
```

다음 쿼리는 Q Business 애플리케이션에 데이터 소스로 연결된 S3 버킷에서 객체가 삭제되었는지 DeleteObject API 이벤트를 확인하여 보여줍니다:

#### SQL 쿼리:

```
SELECT
 sourceIPAddress, eventTime, userIdentity.arn AS user
 FROM
 <event-data-store-ID>
 WHERE
 userIdentity.arn IS NOT NULL AND eventName='DeleteObject'
 AND element_at(requestParameters, 'bucketName') like '<enter-S3-bucket-name>'
 AND eventTime > '[2024-05-09 00](tel:2024050900):00:00'
```

### Amazon Q Developer

Amazon Q Developer의 데이터 이벤트를 사용하여 추적할 수 있는 이벤트 중 하나는 **'StartCodeAnalysis'**로, VS Code 및 JetBrains IDE용 Amazon Q Developer에서 수행되는 보안 스캔을 추적합니다.

아래 쿼리는 보안 스캔을 시작한 모든 사용자 목록을 조회합니다. 이를 통해 조직 내에서 코드 분석에 Amazon Q Developer를 활용하는 사용자를 식별하고 요청의 출처를 파악할 수 있습니다.

```
SELECT
userIdentity.onbehalfof.userid, eventTime, SourceIPAddress
FROM
    <event-data-store-ID>
WHERE
    eventName = 'StartCodeAnalysis'
```

### Amazon Bedrock

Amazon Bedrock에 대한 CloudTrail 데이터 이벤트는 'AWS::Bedrock::AgentAlias' 및 'AWS::Bedrock::KnowledgeBase' 리소스 유형 작업을 통해 Agents for Bedrock 및 Amazon Bedrock 지식 기반의 API 이벤트를 추적합니다.

예를 들어, 채팅 애플리케이션 관리자가 Bedrock 에이전트 호출과 관련된 이벤트를 감사하려는 경우, 다음 쿼리를 사용할 수 있습니다. 이 쿼리는 호출된 에이전트 별칭과 함께 전송된 [요청](https://docs.aws.amazon.com/bedrock/latest/APIReference/API_agent-runtime_InvokeAgent.html#API_agent-runtime_InvokeAgent_RequestSyntax) 및 [응답](https://docs.aws.amazon.com/bedrock/latest/APIReference/API_agent-runtime_InvokeAgent.html#API_agent-runtime_InvokeAgent_ResponseSyntax) 매개변수의 세부 정보를 확인하는 데 도움이 됩니다.

```
SELECT
UserIdentity,eventTime,eventName,UserAgent,requestParameters,resourcesFROM
<event-data-store-ID>
WHERE
    eventName = 'InvokeAgent'
```

추가로, 아래 쿼리는 호출된 지식 기반에 대한 세부 정보와 반환된 요청 및 응답 매개변수를 제공합니다:

```
SELECT
UserIdentity,eventTime,eventName,UserAgent,requestParameters,resourcesFROM
<event-data-store-ID>
WHERE
    eventName = 'RetrieveAndGenerate'
```


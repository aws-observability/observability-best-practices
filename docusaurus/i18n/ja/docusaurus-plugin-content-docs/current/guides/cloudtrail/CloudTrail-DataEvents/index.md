---
sidebar_position: 4
---
# CloudTrail データイベント

AWS CloudTrail のベストプラクティスに従い、セキュリティに敏感なワークロードについては、マルチリージョントレイルレベルでデータイベントを記録する必要があります。コンプライアンス要件が厳しいワークロードについては、リソースレベルのアクティビティへのアクセスを監査するためにデータイベントを有効にすることをお勧めします。データイベントのログ記録により、可視性を有効にしているリソース内の変更を含め、データレベルでの監査が可能になります。

CloudTrail は、可観測性を高め、幅広いサービスのデータイベントをサポートすることで役立ちます。これらのデータイベントは、重要なコンプライアンス、リスク、およびセキュリティの目標を達成するために活用できます。このようなイベントの例としては、削除、更新、アイテムの追加などのオブジェクトレベルの API アクティビティが挙げられます。CloudTrail データイベントによって提供される可視性の向上の例としては、Amazon Bedrock のエージェントエイリアスまたはナレッジベースに対する API アクティビティ、Amazon Q Business のアプリケーションまたはデータソースに対するアクティビティ、フィーチャーストアに対する Sagemaker API アクティビティなどがあります。これらは、以下のような重要なリスク管理上のメリットをもたらします。

* 個人データおよび機密情報へのアクセスの監視
* 個人データおよび機密データの変更に対する可視性
* 個人データおよび機密情報を扱うアプリケーションにおけるアクティビティの監査
* 潜在的なデータ侵害およびプライバシーインシデントの検出
* プライバシー監査およびコンプライアンスレポートの促進*

### データイベントの高度なイベントセレクター
データイベントを使用する場合、高度なイベントセレクターにより、イベントデータストアに取り込まれる CloudTrail イベントをより細かく制御できます。高度なイベントセレクターを使用すると、EventSource、EventName、userIdentity.arn、ResourceARN などのフィールドの値を含めたり除外したりすることができます。高度なイベントセレクターは、部分文字列のパターンマッチングによる値の包含または除外もサポートしています。これにより、セキュリティ、コンプライアンス、および運用調査の効率と精度が向上し、コスト削減にも役立ちます。たとえば、userIdentity.arn 属性に基づいて CloudTrail イベントをフィルタリングし、特定の IAM ロールまたはユーザーによって生成されたイベントを除外することができます。監視目的で頻繁に API 呼び出しを行うサービスが使用する専用の IAM ロールを除外することも可能です。これにより、CloudTrail Lake に取り込まれる CloudTrail イベントの量を大幅に削減し、関連するユーザーおよびシステムアクティビティへの可視性を維持しながらコストを低減できます。

![CloudTrail Lake Data Events](/img/cloudops/guides/cloudtrail-lake/cloudtrail-data-events-advanced-selector.png "Advanced Event Selectors for Data Events")

### **ワークロード固有**

以下のセクションでは、トレイルおよびイベントデータストアで利用可能なリソースタイプを使用して、特定のワークロードを監視および監査するためのベストプラクティスをいくつか紹介します。たとえば、Amazon S3 のデータイベントをログに記録する場合は、`PutObject` API オペレーションをキャプチャして、Amazon S3 オブジェクトに対して行われているすべてのリソースレベルの操作を記録することが推奨されます。これにより、Amazon S3 オブジェクトに対するリソースレベルでのアクションの可視性が提供されます。

### **Amazon SNS と Amazon SQS**

Amazon SNS のセキュリティベストプラクティスおよび Amazon SQS のセキュリティベストプラクティスによると、Amazon SNS および Amazon SQS へのアクセスに VPC エンドポイントの使用を検討することが推奨されています。たとえば、操作できる必要があるが、インターネットに公開してはならない Amazon SNS トピックや Amazon SQS キューがある場合、VPC エンドポイントを使用して、特定の VPC 内のホストのみが Amazon SNS トピックや Amazon SQS キューにメッセージを発行または送信できるようにアクセスを制御します。

Amazon SNS のデータイベントを CloudTrail で有効にすると、すべての Amazon SNS トピックに対する `Publish` および `PublishBatch` API アクションを監査できるようになります。同様に、[Amazon SQS のデータイベント](https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/sqs-logging-using-cloudtrail.html#sqs-data-events-in-cloud-trail)については、`SendMessage` API アクションにより、インターネットを経由せずに VPC 内のインスタンスから Amazon SQS キューにメッセージを送信する際に、VPC Endpoints が使用されていることを監査できます。

以下のクエリは、Amazon SNS からの [Publish](https://docs.aws.amazon.com/sns/latest/api/API_Publish.html) イベントに対する API アクションを表示し、Amazon SNS トピックにメッセージが発行されていることを示します。結果には、このアクションを実行した [IAM](https://aws.amazon.com/iam/) エンティティと、メッセージが送信された特定の VPC エンドポイント ID も表示されます。ただし、VPC エンドポイント ID が存在しない場合、Publish API 呼び出しは VPC エンドポイントを使用せずに行われたことを意味します。 

#### SQL クエリ：

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

Amazon SNS クエリで示したものと同様に、以下のクエリは Amazon SQS からの [SendMessage](https://docs.aws.amazon.com/AWSSimpleQueueService/latest/APIReference/API_SendMessage.html) イベントに対する API アクションを表示し、特定の Amazon SQS キューにメッセージが送信されていたことを示します。これらの結果には、アクションを実行した [IAM](https://aws.amazon.com/iam/) エンティティと、メッセージの送信先となった特定の VPC エンドポイント ID も表示されます。

#### SQL クエリ：

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

Amazon Q for Business ワークロードでは、**AWS::QBusiness::Application** および **AWS::S3::Object** のデータイベントを設定できます。**AWS::QBusiness::Application** は Amazon Q Business アプリケーションに関連するデータプレーンのアクティビティをログに記録し、**AWS::S3::Object** はソースの Amazon S3 バケットのデータイベントを記録します。トレイルまたはイベントデータストアにデータイベントを設定すると、Amazon Q Business および Amazon S3 のイベントが生成されるようになります。

以下のクエリは、Amazon Q Business アプリケーションで使用された 1 つ以上のドキュメントの削除を示す [BatchDeleteDocument](https://docs.aws.amazon.com/amazonq/latest/api-reference/API_BatchDeleteDocument.html) への API コールを表示します。

#### SQL クエリ：

```
SELECT
    eventName, COUNT(*) AS numberOfCallsFROM
<event-data-store-ID>
WHERE
    eventSource='qbusiness.amazonaws.com' AND eventTime > date_add('day', -1, now())
Group
BY eventName ORDER BY COUNT(*) DESC
```

以下のクエリは、BatchDeleteDocument API 呼び出しに関連付けられた IAM アイデンティティを見つけるのに役立ちます。

#### SQL クエリ：

```
SELECT
 sourceIPAddress, eventTime, userIdentity.principalid
 FROM
 <event-data-store-ID>
 WHERE
 eventName='BatchDeleteDocument' AND eventTime > date_add('day', -1, now())
```

以下のクエリは、StartDataSourceSyncJob API 呼び出しを検索することで、どのジョブが S3 データソースと Amazon Q Business Applications の同期をトリガーしたかを特定します。

#### SQL クエリ：

```
SELECT
 sourceIPAddress, eventTime, userIdentity.arn AS user
 FROM
 <event-data-store-ID>
 WHERE
 eventName='StartDataSourceSyncJob' AND eventTime > date_add('day', -1, now())
```

Q ビジネスアプリケーションのデータソースとして接続されている S3 バケットから、DeleteObject API イベントを確認することで、オブジェクトが削除されたかどうかを以下のクエリで確認できます。

#### SQL クエリ：

```
SELECT
 sourceIPAddress, eventTime, userIdentity.arn AS user
 FROM
 <event-data-store-ID>
 WHERE
 userIdentity.arn IS NOT NULL AND eventName='DeleteObject'
 AND element_at(requestParameters, 'bucketName') like '<enter-S3-bucket-name>'
 AND eventTime > '[2024-05-09 00](tel:2024050900):00:00’
```

### Amazon Q Developer

Amazon Q Developer のデータイベントを使用して追跡できるイベントの 1 つは **'StartCodeAnalysis'** です。これは、VS Code および JetBrains IDE 向けの Amazon Q Developer によって実行されるセキュリティスキャンを追跡します。

以下のクエリでは、セキュリティスキャンを開始したすべてのユーザーのリストを取得します。これにより、組織内でコードを分析するために Amazon Q Developer を利用しているユーザーを特定し、リクエストの発生元を確認するのに役立ちます。

```
SELECT
userIdentity.onbehalfof.userid, eventTime, SourceIPAddress
FROM
    <event-data-store-ID>
WHERE
    eventName = 'StartCodeAnalysis'
```

### Amazon Bedrock

CloudTrail のデータイベントは、Amazon Bedrock の AWS::Bedrock::AgentAlias および AWS::Bedrock::KnowledgeBase リソースタイプアクションを通じて、Agents for Bedrock および Amazon Bedrock ナレッジベースの API イベントを追跡します。

例えば、チャットアプリケーションの管理者が Bedrock エージェントの呼び出しに関連するイベントを監査したい場合、次のクエリを使用できます。このクエリは、呼び出されたエージェントエイリアスとともに送信された[リクエスト](https://docs.aws.amazon.com/bedrock/latest/APIReference/API_agent-runtime_InvokeAgent.html#API_agent-runtime_InvokeAgent_RequestSyntax)および[レスポンス](https://docs.aws.amazon.com/bedrock/latest/APIReference/API_agent-runtime_InvokeAgent.html#API_agent-runtime_InvokeAgent_ResponseSyntax)パラメータの詳細を確認するのに役立ちます。

```
SELECT
UserIdentity,eventTime,eventName,UserAgent,requestParameters,resourcesFROM
<event-data-store-ID>
WHERE
    eventName = 'InvokeAgent'
```

さらに、以下のクエリは、呼び出されたナレッジベースの詳細と、返されたリクエストおよびレスポンスのパラメータを提供します。

```
SELECT
UserIdentity,eventTime,eventName,UserAgent,requestParameters,resourcesFROM
<event-data-store-ID>
WHERE
    eventName = 'RetrieveAndGenerate'
```


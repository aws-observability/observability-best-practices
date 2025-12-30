# CloudWatch Logs Insights のクエリ例

[CloudWatch Logs Insights](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/AnalyzingLogData.html) は、CloudWatch ログデータを分析およびクエリするための強力なプラットフォームを提供します。これにより、いくつかのシンプルかつ強力なコマンドを備えた SQL に似たクエリ言語を使用して、ログデータを対話的に検索できます。

CloudWatch Logs insights は、以下のカテゴリに対してすぐに使用できるサンプルクエリを提供します。

- Lambda
- VPC Flow Logs
- CloudTrail
- 一般的なクエリ
- Route 53
- AWS AppSync
- NAT Gateway

このベストプラクティスガイドのセクションでは、現在すぐに使えるサンプルには含まれていない他のタイプのログに対するクエリの例をいくつか紹介します。このリストは時間の経過とともに進化し変更されます。また、GitHub に [issue](https://github.com/aws-observability/observability-best-practices/issues) を残すことで、独自のサンプルをレビュー用に提出できます。

## API Gateway

### HTTP メソッドタイプを含む最新 20 件のメッセージ

```
filter @message like /$METHOD/ 
| fields @timestamp, @message
| sort @timestamp desc
| limit 20
```

このクエリは、特定の HTTP メソッドを含む最新の 20 件のログメッセージをタイムスタンプの降順でソートして返します。置き換えてください `METHOD` クエリを実行するメソッドに対して使用します。このクエリの使用例を次に示します。

```
filter @message like /POST/ 
| fields @timestamp, @message
| sort @timestamp desc
| limit 20
```

:::tip
    $limit 値を変更することで、異なる数のメッセージを返すことができます。
:::

### IP でソートされた上位 20 のトーカー

```
fields @timestamp, @message
| stats count() by ip
| sort ip asc
| limit 20
```

このクエリは、IP でソートされた上位 20 件の通信元を返します。これは、API に対する悪意のあるアクティビティを検出するのに役立ちます。

次のステップとして、メソッドタイプの追加フィルターを追加できます。たとえば、次のクエリは IP 別の上位トーカーを表示しますが、「PUT」メソッド呼び出しのみを対象とします。

```
fields @timestamp, @message
| filter @message like /PUT/
| stats count() by ip
| sort ip asc
| limit 20
```

## CloudTrail ログ

### エラーカテゴリ別にグループ化された API スロットリングエラー

```
stats count(errorCode) as eventCount by eventSource, eventName, awsRegion, userAgent, errorCode
| filter errorCode = 'ThrottlingException' 
| sort eventCount desc
```

このクエリを使用すると、API スロットリングエラーをカテゴリ別にグループ化し、降順で表示できます。

:::tip
    このクエリを使用するには、まず [CloudTrail ログを CloudWatch に送信](https://docs.aws.amazon.com/awscloudtrail/latest/userguide/send-cloudtrail-events-to-cloudwatch-logs.html)していることを確認する必要があります。
:::
    
### 折れ線グラフでのルートアカウントアクティビティ

```
fields @timestamp, @message, userIdentity.type 
| filter userIdentity.type='Root' 
| stats count() as RootActivity by bin(5m)
```

このクエリを使用すると、ルートアカウントのアクティビティを折れ線グラフで可視化できます。このクエリは、ルートアクティビティを時系列で集計し、5 分間隔でルートアクティビティの発生回数をカウントします。
:::tip
     [ログデータをグラフで可視化する](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/CWL_Insights-Visualizing-Log-Data.html)
:::

## VPC Flow Logs

### アクションが REJECT の選択したソースIP アドレスのフローログをフィルタリングする

```
fields @timestamp, @message, @logStream, @log  | filter srcAddr like '$SOURCEIP' and action = 'REJECT'
| sort @timestamp desc
| limit 20
```

このクエリは、最後の 20 件のログメッセージを返します。これらのログメッセージには 'REJECT' が含まれています。 `$SOURCEIP`これを使用して、トラフィックが明示的に拒否されているか、またはクライアント側のネットワーク設定の問題であるかを検出できます。

:::tip
    対象となる IP アドレスの値を必ず置き換えてください `$SOURCEIP`
:::

```
fields @timestamp, @message, @logStream, @log  | filter srcAddr like '10.0.0.5' and action = 'REJECT'
| sort @timestamp desc
| limit 20
```

### アベイラビリティーゾーン別のネットワークトラフィックのグループ化

```
stats sum(bytes / 1048576) as Traffic_MB by azId as AZ_ID 
| sort Traffic_MB desc
```

このクエリは、アベイラビリティーゾーン (AZ) ごとにグループ化されたネットワークトラフィックデータを取得します。バイト数を合計して MB に変換することで、メガバイト (MB) 単位の合計トラフィックを計算します。その後、結果は各 AZ のトラフィック量に基づいて降順にソートされます。


### フロー方向別のネットワークトラフィックのグループ化

```
stats sum(bytes / 1048576) as Traffic_MB by flowDirection as Flow_Direction 
| sort by Bytes_MB desc
```

このクエリは、フロー方向 (Ingress または Egress) でグループ化されたネットワークトラフィックを分析するように設計されています。 


### 送信元および送信先 IP アドレス別の上位 10 件のデータ転送

```
stats sum(bytes / 1048576) as Data_Transferred_MB by srcAddr as Source_IP, dstAddr as Destination_IP 
| sort Data_Transferred_MB desc 
| limit 10
```

このクエリは、送信元と送信先の IP アドレスによる上位 10 件のデータ転送を取得します。このクエリにより、特定の送信元と送信先の IP アドレス間で最も重要なデータ転送を特定できます。

## Amazon SNS ログ

### 理由別の SMS メッセージ失敗数

```
filter status = "FAILURE"
| stats count(*) by delivery.providerResponse as FailureReason
| sort delivery.providerResponse desc
```

上記のクエリは、配信失敗の数を理由別に降順でソートしてリストします。このクエリは、配信失敗の理由を見つけるために使用できます。

### 無効な電話番号による SMS メッセージの失敗

```
fields notification.messageId as MessageId, delivery.destination as PhoneNumber
| filter status = "FAILURE" and delivery.providerResponse = "Invalid phone number"
| limit 100
```

このクエリは、無効な電話番号が原因で配信に失敗したメッセージを返します。これを使用して、修正が必要な電話番号を特定できます。

### SMS タイプ別のメッセージ失敗統計

```
fields delivery.smsType
| filter status = "FAILURE"
| stats count(notification.messageId), avg(delivery.dwellTimeMs), sum(delivery.priceInUSD) by delivery.smsType
```

このクエリは、各 SMS タイプ (トランザクションまたはプロモーション) のカウント、平均滞留時間、および支出を返します。このクエリは、是正措置をトリガーするしきい値を確立するために使用できます。特定の SMS タイプのみが是正措置を必要とする場合は、その SMS タイプのみをフィルタリングするようにクエリを変更できます。

### SNS 失敗通知の統計

```
fields @MessageID 
| filter status = "FAILURE"
| stats count(delivery.deliveryId) as FailedDeliveryCount, avg(delivery.dwellTimeMs) as AvgDwellTime, max(delivery.dwellTimeMs) as MaxDwellTime by notification.messageId as MessageID
| limit 100
```

このクエリは、失敗した各メッセージのカウント、平均滞留時間、および支出を返します。このクエリは、是正措置をトリガーするしきい値を確立するために使用できます。




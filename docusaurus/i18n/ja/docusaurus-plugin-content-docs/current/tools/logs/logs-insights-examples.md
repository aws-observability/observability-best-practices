# CloudWatch Logs Insights のクエリ例

[CloudWatch Logs Insights](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/logs/AnalyzingLogData.html) は、CloudWatch のログデータを分析およびクエリするための強力なプラットフォームを提供します。
シンプルながら強力なコマンドを備えた SQL ライクなクエリ言語を使用して、ログデータをインタラクティブに検索できます。

CloudWatch Logs Insights は、以下のカテゴリに対してすぐに使えるクエリ例を提供しています：

- Lambda
- VPC Flow Logs
- CloudTrail
- Common Queries
- Route 53
- AWS AppSync
- NAT Gateway

このベストプラクティスガイドのセクションでは、現在すぐに使えるクエリ例に含まれていない他のタイプのログに対するクエリ例を提供します。
このリストは時間とともに進化し変更されていきます。また、GitHub の [issue](https://github.com/aws-observability/observability-best-practices/issues) を作成することで、独自の例を提出して確認を依頼することができます。



## API Gateway




### HTTP メソッドタイプを含む最新 20 件のメッセージ

```
filter @message like /$METHOD/ 
| fields @timestamp, @message
| sort @timestamp desc
| limit 20
```

このクエリは、特定の HTTP メソッドを含む最新 20 件のログメッセージを、タイムスタンプの降順で返します。
クエリ対象のメソッドに応じて **METHOD** を置き換えてください。
以下がこのクエリの使用例です：

```
filter @message like /POST/ 
| fields @timestamp, @message
| sort @timestamp desc
| limit 20
```

:::tip
    返すメッセージ数を変更するには、$limit の値を変更することができます。
:::



### IP でソートされた上位 20 のアクセス元

```
fields @timestamp, @message
| stats count() by ip
| sort ip asc
| limit 20
```

このクエリは、IP でソートされた上位 20 のアクセス元を返します。
これは API に対する不正なアクティビティを検出するのに役立ちます。

次のステップとして、メソッドタイプのフィルターを追加することができます。
たとえば、次のクエリは IP ごとの上位アクセス元を表示しますが、「PUT」メソッドの呼び出しのみに限定されます：

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

このクエリを使用すると、カテゴリ別にグループ化された API スロットリングエラーを降順で確認できます。

:::tip
このクエリを使用するには、まず [CloudTrail ログを CloudWatch に送信する](https://docs.aws.amazon.com/ja_jp/awscloudtrail/latest/userguide/send-cloudtrail-events-to-cloudwatch-logs.html) 設定が必要です。
:::



### ルートアカウントのアクティビティを折れ線グラフで表示

```
fields @timestamp, @message, userIdentity.type 
| filter userIdentity.type='Root' 
| stats count() as RootActivity by bin(5m)
```

このクエリを使用すると、ルートアカウントのアクティビティを折れ線グラフで可視化できます。
このクエリは、5 分間隔でルートアクティビティの発生回数をカウントし、時系列で集計します。

:::tip
     [ログデータをグラフで可視化する](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/logs/CWL_Insights-Visualizing-Log-Data.html)
:::



## VPC Flow Logs




### 選択したソース IP アドレスのアクションが REJECT のフローログをフィルタリング

```
fields @timestamp, @message, @logStream, @log  | filter srcAddr like '$SOURCEIP' and action = 'REJECT'
| sort @timestamp desc
| limit 20
```

このクエリは、$SOURCEIP からの「REJECT」を含む最新 20 件のログメッセージを返します。
これは、トラフィックが明示的に拒否されているか、クライアント側のネットワーク設定に問題があるかを検出するために使用できます。

:::tip
    '$SOURCEIP' を確認したい IP アドレスの値に置き換えてください
:::

```
fields @timestamp, @message, @logStream, @log  | filter srcAddr like '10.0.0.5' and action = 'REJECT'
| sort @timestamp desc
| limit 20
```



### アベイラビリティーゾーンによるネットワークトラフィックのグループ化

```
stats sum(bytes / 1048576) as Traffic_MB by azId as AZ_ID 
| sort Traffic_MB desc
```

このクエリは、アベイラビリティーゾーン (AZ) でグループ化されたネットワークトラフィックデータを取得します。
バイトを合計して MB に変換することで、合計トラフィック量をメガバイト (MB) 単位で計算します。
結果は、各 AZ のトラフィック量に基づいて降順でソートされます。



### フロー方向によるネットワークトラフィックのグループ化

```
stats sum(bytes / 1048576) as Traffic_MB by flowDirection as Flow_Direction 
| sort by Bytes_MB desc
```

このクエリは、フロー方向（インバウンドまたはアウトバウンド）でグループ化されたネットワークトラフィックを分析するように設計されています。




### 送信元と宛先 IP アドレスによるデータ転送量のトップ 10

```
stats sum(bytes / 1048576) as Data_Transferred_MB by srcAddr as Source_IP, dstAddr as Destination_IP 
| sort Data_Transferred_MB desc 
| limit 10
```

このクエリは、送信元と宛先 IP アドレスによるデータ転送量のトップ 10 を取得します。
このクエリを使用することで、特定の送信元と宛先 IP アドレス間で発生した最も大きなデータ転送を特定できます。



## Amazon SNS ログ




### 理由別の SMS メッセージ失敗数

```
filter status = "FAILURE"
| stats count(*) by delivery.providerResponse as FailureReason
| sort delivery.providerResponse desc
```

上記のクエリは、配信失敗の理由別にカウントを降順で表示します。
このクエリは、配信失敗の理由を特定するために使用できます。




### 無効な電話番号による SMS メッセージの送信失敗

```
fields notification.messageId as MessageId, delivery.destination as PhoneNumber
| filter status = "FAILURE" and delivery.providerResponse = "Invalid phone number"
| limit 100
```

このクエリは、無効な電話番号により配信に失敗したメッセージを返します。これは、修正が必要な電話番号を特定するために使用できます。




### SMS タイプ別のメッセージ失敗統計

```
fields delivery.smsType
| filter status = "FAILURE"
| stats count(notification.messageId), avg(delivery.dwellTimeMs), sum(delivery.priceInUSD) by delivery.smsType
```

このクエリは、各 SMS タイプ（トランザクショナルまたはプロモーショナル）の件数、平均滞留時間、および支出を返します。
このクエリは、是正措置を実行するためのしきい値を設定するために使用できます。
特定の SMS タイプのみに是正措置が必要な場合は、そのタイプのみをフィルタリングするようにクエリを変更できます。




### SNS 配信失敗通知の統計

```
fields @MessageID 
| filter status = "FAILURE"
| stats count(delivery.deliveryId) as FailedDeliveryCount, avg(delivery.dwellTimeMs) as AvgDwellTime, max(delivery.dwellTimeMs) as MaxDwellTime by notification.messageId as MessageID
| limit 100
```

このクエリは、失敗したメッセージごとの配信失敗回数、平均滞留時間、最大滞留時間を返します。
このクエリは、是正措置を実行するためのしきい値を設定する際に使用できます。

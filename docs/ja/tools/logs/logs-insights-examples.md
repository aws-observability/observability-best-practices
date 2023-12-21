# CloudWatch Logs Insights のクエリ例

[CloudWatch Logs Insights](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/AnalyzingLogData.html) は、CloudWatch ログデータの分析とクエリを実行するための強力なプラットフォームを提供します。SQL ライクなクエリ言語を使用してログデータを対話的に検索できます。

CloudWatch Logs Insights は、次のカテゴリのサンプルクエリをすぐに利用できるように用意しています:

- Lambda
- VPC フローログ  
- CloudTrail
- 一般的なクエリ
- Route 53
- AWS AppSync
- NAT ゲートウェイ

このベストプラクティスガイドのこのセクションでは、現在サンプルクエリに含まれていないその他のタイプのログのクエリ例を紹介します。このリストは時間とともに進化し変化していきます。GitHub の [issue](https://github.com/aws-observability/observability-best-practices/issues) に投稿してクエリ例を提出できます。

## API Gateway

### HTTP メソッドタイプを含む最新 20 件のメッセージ

```
filter @message like /$METHOD/ 
| fields @timestamp, @message
| sort @timestamp desc
| limit 20
```

このクエリは、指定した HTTP メソッドを含む直近 20 件のログメッセージをタイムスタンプの降順で返します。**METHOD** を検索対象のメソッドに置き換えます。このクエリの使用例を次に示します。

```
filter @message like /POST/ 
| fields @timestamp, @message
| sort @timestamp desc
| limit 20
```

!!! tip
    $limit の値を変更することで、返されるメッセージ数を変更できます。

### IP でソートされた上位 20 の通信元

```
fields @timestamp, @message
| stats count() by ip
| sort ip asc
| limit 20
```

このクエリは、IP でソートされた上位 20 の通信元を返します。これは、API に対する悪意のあるアクティビティを検出するのに役立ちます。

次のステップとして、メソッドタイプのフィルタを追加することができます。 たとえば、このクエリは IP での上位の通信元を示しますが、「PUT」メソッド呼び出しのみに限定されます。

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

このクエリを使用すると、カテゴリ別にグループ化された API スロットリングエラーを降順で表示できます。  

!!! tip
    
    このクエリを使用するには、まず [CloudTrail ログを CloudWatch に送信](https://docs.aws.amazon.com/ja_jp/awscloudtrail/latest/userguide/send-cloudtrail-events-to-cloudwatch-logs.html)していることを確認する必要があります。

## VPC フローログ

### 選択した送信元 IP アドレスのフローログをアクションが REJECT であるものにフィルタリング

```
fields @timestamp, @message, @logStream, @log  | filter srcAddr like '$SOURCEIP' and action = 'REJECT'
| sort @timestamp desc
| limit 20
```

このクエリは、$SOURCEIP からの「REJECT」が含まれる直近 20 件のログメッセージを返します。これは、トラフィックが明示的に拒否されているか、問題がクライアント側のネットワーク構成の問題であるかを検出するために使用できます。 

!!! tip
    '$SOURCEIP' を興味のある IP アドレスの値に置き換えてください。

```
fields @timestamp, @message, @logStream, @log  | filter srcAddr like '10.0.0.5' and action = 'REJECT'
| sort @timestamp desc
| limit 20
```

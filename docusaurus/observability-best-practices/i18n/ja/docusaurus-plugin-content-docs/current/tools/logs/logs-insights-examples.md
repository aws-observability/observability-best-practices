# CloudWatch Logs Insights のクエリ例

[CloudWatch Logs Insights](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/logs/AnalyzingLogData.html) は、CloudWatch ログデータを分析およびクエリするための強力なプラットフォームを提供します。 いくつかのシンプルであるが強力なコマンドを使用して、SQL ライクなクエリ言語でログデータを対話的に検索できます。

CloudWatch Logs Insights は、次のカテゴリのためのサンプルクエリをすぐに利用できるように用意しています:

- Lambda
- VPC フローログ  
- CloudTrail
- 一般的なクエリ
- Route 53
- AWS AppSync
- NAT ゲートウェイ

このベストプラクティスガイドのこのセクションでは、現在ボックス付属のサンプルには含まれていないその他のタイプのログのサンプルクエリをいくつか提供します。 このリストは時間の経過とともに進化し変化するでしょう。GitHub で [issue](https://github.com/aws-observability/observability-best-practices/issues) を残すことで、独自のサンプルをレビューのために送信できます。

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

このクエリは、IP でソートされた上位 20 の通信元を返します。これは API に対する悪意のあるアクティビティを検出するのに役立ちます。

次のステップとして、メソッドタイプの追加フィルタを追加できます。たとえば、このクエリは IP ごとの上位の通信元を示しますが、「PUT」メソッド呼び出しのみに限定されます。

```
fields @timestamp, @message
| filter @message like /PUT/
| stats count() by ip
| sort ip asc
| limit 20
```

## CloudTrail ログ

### エラーコード別にグループ化された API スロットリングエラー

```
stats count(errorCode) as eventCount by eventSource, eventName, awsRegion, userAgent, errorCode
| filter errorCode = 'ThrottlingException' 
| sort eventCount desc
```

このクエリを使用すると、カテゴリ別にグループ化された API スロットリングエラーを降順で表示できます。

!!! tip
    
    このクエリを使用するには、まず [CloudTrail ログを CloudWatch に送信](https://docs.aws.amazon.com/ja_jp/awscloudtrail/latest/userguide/send-cloudtrail-events-to-cloudwatch-logs.html) する必要があります。

### ライングラフでのルートアカウントアクティビティ

```
fields @timestamp, @message, userIdentity.type 
| filter userIdentity.type='Root' 
| stats count() as RootActivity by bin(5m)
```

このクエリを使用すると、ルートアカウントのアクティビティをライングラフで視覚化できます。このクエリは時間経過とともにルートアクティビティを集計し、5 分ごとの区間内でのルートアクティビティの発生回数をカウントします。

!!! tip
    
     [グラフでログデータを視覚化する](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/logs/CWL_Insights-Visualizing-Log-Data.html)

## VPC フローログ

### 選択した送信元 IP アドレスのフローログをアクションが REJECT であるものにフィルタリング

```
fields @timestamp, @message, @logStream, @log  | filter srcAddr like '$SOURCEIP' and action = 'REJECT'
| sort @timestamp desc
| limit 20
```

このクエリは、$SOURCEIP からの「REJECT」を含む直近 20 件のログメッセージを返します。これは、トラフィックが明示的に拒否されているか、クライアント側のネットワーク構成の問題があるかどうかを検出するために使用できます。 

!!! tip
    '$SOURCEIP' を調べたい IP アドレスの値に置き換えてください。

```
fields @timestamp, @message, @logStream, @log  | filter srcAddr like '10.0.0.5' and action = 'REJECT'
| sort @timestamp desc
| limit 20
```

### アベイラビリティゾーン別にネットワークトラフィックをグルーピング

```
stats sum(bytes / 1048576) as Traffic_MB by azId as AZ_ID 
| sort Traffic_MB desc
```

このクエリは、アベイラビリティゾーン(AZ)別にネットワークトラフィックデータを取得します。バイト数を合計してメガバイト(MB)に変換することで、トラフィックの総量を計算します。結果は、各 AZ のトラフィック量を基準に降順で並べ替えられます。

### フロー方向別にネットワークトラフィックをグルーピング

```
stats sum(bytes / 1048576) as Traffic_MB by flowDirection as Flow_Direction 
| sort by Bytes_MB desc
```

このクエリは、フロー方向(イングレスまたはエグレス)でグループ化されたネットワークトラフィックを分析するように設計されています。

### 送信元 IP アドレスと送信先 IP アドレス別の上位 10 データ転送

```
stats sum(bytes / 1048576) as Data_Transferred_MB by srcAddr as Source_IP, dstAddr as Destination_IP 
| sort Data_Transferred_MB desc 
| limit 10
```

このクエリは、送信元 IP アドレスと送信先 IP アドレス別の上位 10 データ転送を取得します。このクエリにより、特定の送信元 IP アドレスと送信先 IP アドレス間で最も大きなデータ転送を特定できます。

# CloudWatch のコストを削減する




## GetMetricData

通常、`GetMetricData` は、サードパーティのオブザーバビリティツールやクラウド財務ツールが、プラットフォーム上で CloudWatch Metrics を使用する際の呼び出しによって発生します。

- サードパーティツールがリクエストを行う頻度を減らすことを検討してください。例えば、頻度を 1 分から 5 分に減らすと、コストを 1/5 (20%) に抑えることができます。
- トレンドを特定するために、一時的にサードパーティツールからのデータ収集をオフにすることを検討してください。




## CloudWatch Logs 

- この[ナレッジセンターのドキュメント][log-article]を使用して、主要なコスト要因を特定します。
- 必要でない限り、主要なコスト要因のログレベルを下げます。
- CloudWatch 以外に、サードパーティのログツールを使用しているかどうかを確認します。
- VPC Flow Log のコストは、すべての VPC で有効にしていて、トラフィックが多い場合、急速に増加する可能性があります。必要な場合は、Amazon S3 に配信することを検討してください。
- すべての AWS Lambda 関数でログが必要かどうかを確認します。必要でない場合は、Lambda ロールで "logs:PutLogEvents" 権限を拒否します。
- CloudTrail ログは、多くの場合、主要なコスト要因です。Amazon S3 に送信し、クエリに Amazon Athena を使用し、アラート/通知に Amazon EventBridge を使用する方が安価です。

詳細については、この[ナレッジセンターの記事][article]を参照してください。


[article]: https://aws.amazon.com/premiumsupport/knowledge-center/cloudwatch-understand-and-reduce-charges/
[log-article]: https://aws.amazon.com/premiumsupport/knowledge-center/cloudwatch-logs-bill-increase/

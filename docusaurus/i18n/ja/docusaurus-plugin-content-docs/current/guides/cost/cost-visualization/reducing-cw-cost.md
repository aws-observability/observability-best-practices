# CloudWatch コストの削減

## GetMetricData

通常 `GetMetricData` サードパーティの Observability ツールや、CloudWatch Metrics をプラットフォームで使用するクラウド財務ツールからの呼び出しによって発生します。

- サードパーティツールがリクエストを行う頻度を減らすことを検討してください。たとえば、頻度を 1 分から 5 分に減らすと、コストが 1/5 (20%) になります。
- 傾向を特定するには、サードパーティツールからのデータ収集を短時間オフにすることを検討してください。

## CloudWatch Logs 

- この[ナレッジセンタードキュメント][log-article]を使用して、上位のコントリビューターを見つけます。
- 必要と判断されない限り、上位のコントリビューターのログレベルを下げます。
- Cloud Watch に加えて、ログ記録にサードパーティのツールを使用しているかどうかを確認します。
- すべての VPC で有効にしており、トラフィックが多い場合、VPC Flow Log のコストはすぐに増加する可能性があります。それでも必要な場合は、Amazon S3 への配信を検討してください。
- すべての AWS Lambda 関数でログ記録が必要かどうかを確認します。必要ない場合は、Lambda ロールで "logs:PutLogEvents" 権限を拒否します。
- CloudTrail ログは、多くの場合、上位のコントリビューターです。これらを Amazon S3 に送信し、Amazon Athena を使用してクエリを実行し、Amazon EventBridge をアラーム/通知に使用する方が安価です。

詳細については、この[ナレッジセンターの記事][article]を参照してください。


[article]: https://aws.amazon.com/premiumsupport/knowledge-center/cloudwatch-understand-and-reduce-charges/
[log-article]: https://aws.amazon.com/premiumsupport/knowledge-center/cloudwatch-logs-bill-increase/
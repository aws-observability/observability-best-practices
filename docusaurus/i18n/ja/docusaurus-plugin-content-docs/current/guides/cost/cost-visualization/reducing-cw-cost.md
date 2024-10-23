# CloudWatch のコストを削減する




## GetMetricData

通常、`GetMetricData` は、サードパーティのオブザーバビリティツールやクラウド財務ツールが、プラットフォーム内で CloudWatch Metrics を使用する際の呼び出しによって発生します。

- サードパーティツールがリクエストを行う頻度を減らすことを検討してください。例えば、頻度を 1 分から 5 分に減らすと、コストが 1/5 (20%) になるはずです。
- トレンドを特定するために、短期間サードパーティツールからのデータ収集をオフにすることを検討してください。




## CloudWatch Logs 

- この[ナレッジセンターのドキュメント][log-article]を使用して、主要な貢献者を見つけます。
- 必要でない限り、主要な貢献者のログレベルを下げます。
- CloudWatch に加えて、サードパーティのログツールを使用しているかどうかを確認します。
- すべての VPC で VPC フローログを有効にし、トラフィックが多い場合、コストが急速に増加する可能性があります。それでも必要な場合は、Amazon S3 に配信することを検討してください。
- すべての AWS Lambda 関数でログが必要かどうかを確認します。必要でない場合は、Lambda ロールで "logs:PutLogEvents" 権限を拒否します。
- CloudTrail ログは多くの場合、主要な貢献者です。これらを Amazon S3 に送信し、Amazon Athena を使用してクエリを実行し、Amazon EventBridge を使用してアラーム/通知を設定する方が安価です。

詳細については、この[ナレッジセンターの記事][article]を参照してください。


[article]: https://aws.amazon.com/premiumsupport/knowledge-center/cloudwatch-understand-and-reduce-charges/
[log-article]: https://aws.amazon.com/premiumsupport/knowledge-center/cloudwatch-logs-bill-increase/

# CloudWatch コストの削減

## GetMetricData

通常、`GetMetricData` は、サードパーティのオブザーバビリティツールやクラウド財務ツールが、プラットフォーム内の CloudWatch Metrics を使用して呼び出すことで発生します。

- サードパーティツールがリクエストを行う頻度を減らすことを検討してください。例えば、頻度を 1 分から 5 分に減らすと、コストは 1/5 (20%) になります。
- トレンドを特定するために、一時的にサードパーティツールからのデータ収集を無効にすることを検討してください。

## CloudWatch Logs

- トップの寄与者を見つけるには、この[ナレッジセンターのドキュメント][log-article]を参照してください。
- 必要と判断されない限り、トップの寄与者のロギングレベルを下げてください。
- CloudWatch に加えて、ロギングに第三者のツールを使用しているかどうかを確認してください。
- VPC フローログは、すべての VPC で有効になっていて、トラフィックが多い場合、コストが急増する可能性があります。引き続き必要な場合は、Amazon S3 に配信することを検討してください。
- すべての AWS Lambda 関数でロギングが必要かどうかを確認してください。必要ない場合は、Lambda ロールで "logs:PutLogEvents" の許可を拒否してください。
- CloudTrail ログはしばしばトップの寄与者になります。Amazon S3 に送信し、Amazon Athena でクエリを実行し、Amazon EventBridge でアラート/通知を行うと、コストが安くなります。

詳細については、この[ナレッジセンターの記事][article]を参照してください。

[article]: https://aws.amazon.com/premiumsupport/knowledge-center/cloudwatch-understand-and-reduce-charges/
[log-article]: https://aws.amazon.com/premiumsupport/knowledge-center/cloudwatch-logs-bill-increase/

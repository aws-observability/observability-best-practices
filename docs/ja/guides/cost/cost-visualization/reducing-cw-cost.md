# CloudWatch コストの削減

## GetMetricData

通常、`GetMetricData` は、プラットフォームで CloudWatch メトリクスを使用するサードパーティのオブザーバビリティツールやクラウド財務ツールからの呼び出しによって発生します。

- サードパーティのツールがリクエストを行う頻度を減らすことを検討してください。 たとえば、頻度を 1 分から 5 分に減らすと、コストは 1/5 (20%) になります。
- 傾向を特定するには、しばらくの間サードパーティのツールからのデータ収集をオフにすることを検討してください。

## CloudWatch Logs

- この[ナレッジセンターのドキュメント][log-article]を使用して、トップコントリビューターを特定してください。
- 必要とされない限り、トップコントリビューターのログレベルを下げてください。
- CloudWatch に加えて、ログ記録に第三者ツールを使用しているかどうかを確認してください。
- すべての VPC で有効になっており、トラフィックが多い場合、VPC フローログのコストはすぐに上がる可能性があります。まだ必要な場合は、Amazon S3 に配信することを検討してください。
- すべての AWS Lambda 関数でログが必要かどうかを確認してください。必要ない場合は、Lambda ロールで「logs:PutLogEvents」アクセス許可を拒否してください。
- CloudTrail ログはしばしばトップコントリビューターです。Amazon S3 に送信し、Amazon Athena でクエリと Amazon EventBridge でアラーム/通知を使用するほうが安上がりです。

詳細については、この[ナレッジセンターの記事][article]を参照してください。


[article]: https://aws.amazon.com/premiumsupport/knowledge-center/cloudwatch-understand-and-reduce-charges/
[log-article]: https://aws.amazon.com/premiumsupport/knowledge-center/cloudwatch-logs-bill-increase/

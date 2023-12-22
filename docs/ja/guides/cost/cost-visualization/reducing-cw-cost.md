# CloudWatch コストの削減

## GetMetricData

通常、`GetMetricData` はサードパーティのオブザーバビリティツールやクラウド財務ツールからの呼び出しによって発生します。これらのツールはプラットフォームで CloudWatch メトリクスを使用しています。

- サードパーティのツールがリクエストを行う頻度を減らすことを検討してください。たとえば、頻度を 1 分から 5 分に減らすと、コストは 1/5(20%)になります。
- 傾向を特定するには、短期間、サードパーティのツールからのデータ収集をオフにすることを検討してください。

## CloudWatch Logs

- この[ナレッジセンターのドキュメント][log-article]を使用して、トップコントリビューターを特定します。
- 必要とされない限り、トップコントリビューターのログレベルを下げます。
- CloudWatch に加えて、サードパーティのツールをログに使用しているかどうかを確認します。
- すべての VPC で有効になっており、トラフィックが多い場合、VPC フローログのコストはすぐに上がります。まだ必要な場合は、Amazon S3 に配信することを検討してください。
- すべての AWS Lambda 関数でログが必要かどうかを確認します。必要ない場合は、Lambda ロールで「logs:PutLogEvents」アクセス許可を拒否します。  
- CloudTrail ログはしばしばトップコントリビューターです。Amazon S3 に送信し、Amazon Athena でクエリと Amazon EventBridge でアラーム/通知を使用するほうが安上がりです。

詳細については、この[ナレッジセンターの記事][article]を参照してください。


[article]: https://aws.amazon.com/premiumsupport/knowledge-center/cloudwatch-understand-and-reduce-charges/
[log-article]: https://aws.amazon.com/premiumsupport/knowledge-center/cloudwatch-logs-bill-increase/

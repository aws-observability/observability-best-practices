# AWS Lambda

[AWS Lambda][lambda-main] は、サーバーのプロビジョニングやサーバー管理、ワークロード対応のクラスタースケーリングロジック、イベント統合の保守、ランタイムの管理をすることなく、コードを実行できるサーバーレスコンピューティングサービスです。

次のレシピを確認してください:

## ログ

- [サーバーレスアプリケーションをデプロイしてモニタリングする][aes-ws]

## メトリクス

- [CloudWatch Lambda Insights の紹介][lambda-cwi]
- [Firehose と AWS Lambda を使用して CloudWatch メトリクスストリームを Amazon Managed Service for Prometheus にエクスポートする](recipes/lambda-cw-metrics-go-amp.md)

## トレース

- [AWS Distro for OpenTelemetry Lambda レイヤーを使用して Python アプリケーションを自動インストゥルメント化する][lambda-layer-python-xray-adot]
- [OpenTelemetry を使用して AWS X-Ray で AWS Lambda 関数をトレースする][lambda-xray-adot]

[lambda-main]: https://aws.amazon.com/jp/lambda/
[aes-ws]: https://bookstore.aesworkshops.com/
[lambda-cwi]: https://aws.amazon.com/blogs/mt/introducing-cloudwatch-lambda-insights/
[lambda-xray-adot]: https://aws.amazon.com/blogs/opensource/tracing-aws-lambda-functions-in-aws-x-ray-with-opentelemetry/
[lambda-layer-python-xray-adot]: https://aws.amazon.com/blogs/opensource/auto-instrumenting-a-python-application-with-an-aws-distro-for-opentelemetry-lambda-layer/

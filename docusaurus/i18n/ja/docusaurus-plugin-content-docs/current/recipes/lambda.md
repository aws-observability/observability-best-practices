# AWS Lambda

[AWS Lambda][lambda-main] は、サーバーのプロビジョニングや管理、ワークロード対応のクラスタースケーリングロジックの作成、イベント統合の維持、ランタイムの管理を行うことなく、コードを実行できるサーバーレスコンピューティングサービスです。

以下のレシピを確認してください。

## ログ

- [サーバーレスアプリケーションのデプロイと監視][aes-ws]

## メトリクス

- [CloudWatch Lambda Insights の紹介][lambda-cwi]
- [Firehose と AWS Lambda を使用した CloudWatch メトリクスストリームの Amazon Managed Service for Prometheus へのエクスポート](recipes/lambda-cw-metrics-go-amp.md)

## トレース

- [AWS Distro for OpenTelemetry Lambda レイヤーを使用した Python アプリケーションの自動インストルメンテーション][lambda-layer-python-xray-adot]
- [OpenTelemetry を使用した AWS X-Ray での AWS Lambda 関数のトレース][lambda-xray-adot]

[lambda-main]: https://aws.amazon.com/lambda/
[aes-ws]: https://bookstore.aesworkshops.com/
[lambda-cwi]: https://aws.amazon.com/blogs/mt/introducing-cloudwatch-lambda-insights/
[lambda-xray-adot]: https://aws.amazon.com/blogs/opensource/tracing-aws-lambda-functions-in-aws-x-ray-with-opentelemetry/
[lambda-layer-python-xray-adot]: https://aws.amazon.com/blogs/opensource/auto-instrumenting-a-python-application-with-an-aws-distro-for-opentelemetry-lambda-layer/

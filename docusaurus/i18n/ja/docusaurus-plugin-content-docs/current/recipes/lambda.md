# AWS Lambda

[AWS Lambda][lambda-main] は、サーバーのプロビジョニングや管理、ワークロード対応のクラスタースケーリングロジックの作成、イベントインテグレーションの維持、ランタイムの管理なしでコードを実行できるサーバーレスコンピューティングサービスです。

以下のレシピをご確認ください。

## ログ

- [サーバーレスアプリケーションのデプロイとモニタリング][aes-ws]

## メトリクス

- [CloudWatch Lambda Insights のご紹介][lambda-cwi]
- [Firehose と AWS Lambda を使用した Cloudwatch メトリクスストリームの Amazon Managed Service for Prometheus へのエクスポート](recipes/lambda-cw-metrics-go-amp.md)

## トレース

- [AWS Distro for OpenTelemetry Lambda レイヤーで Python アプリケーションを自動計装][lambda-layer-python-xray-adot]
- [OpenTelemetry で AWS X-Ray で AWS Lambda 関数をトレース][lambda-xray-adot]

[lambda-main]: https://aws.amazon.com/lambda/
[aes-ws]: https://bookstore.aesworkshops.com/
[lambda-cwi]: https://aws.amazon.com/blogs/mt/introducing-cloudwatch-lambda-insights/
[lambda-xray-adot]: https://aws.amazon.com/blogs/opensource/tracing-aws-lambda-functions-in-aws-x-ray-with-opentelemetry/
[lambda-layer-python-xray-adot]: https://aws.amazon.com/blogs/opensource/auto-instrumenting-a-python-application-with-an-aws-distro-for-opentelemetry-lambda-layer/

# AWS App Runner

[AWS App Runner][apprunner-main] は、開発者がコンテナ化された Web アプリケーションと API を迅速にデプロイできるようにするフルマネージドサービスです。大規模なデプロイが可能で、事前のインフラストラクチャの経験は必要ありません。ソースコードまたはコンテナイメージから始めることができます。App Runner は Web アプリケーションを自動的にビルドしてデプロイし、暗号化によってトラフィックを負荷分散し、トラフィックのニーズに合わせてスケーリングし、プライベート Amazon VPC で実行される他の AWS サービスやアプリケーションとサービスが簡単に通信できるようにします。App Runner を使用すると、サーバーやスケーリングについて考える代わりに、アプリケーションに集中する時間を増やすことができます。

以下のレシピを確認してください。

## 一般
- [Container Day - Docker Con | How Developers can get to production web applications at scale easily](https://www.youtube.com/watch?v=Iyp9Ugk9oRs)
- [AWS ブログ | Centralized observability for AWS App Runner services](https://aws.amazon.com/blogs/containers/centralized-observability-for-aws-app-runner-services/)
- [AWS ブログ | Observability for AWS App Runner VPC networking](https://aws.amazon.com/blogs/containers/observability-for-aws-app-runner-vpc-networking/)
- [AWS ブログ | Controlling and monitoring AWS App Runner applications with Amazon EventBridge](https://aws.amazon.com/blogs/containers/controlling-and-monitoring-aws-app-runner-applications-with-amazon-eventbridge/)


## ログ

- [CloudWatch Logs にストリーミングされる App Runner ログの表示][apprunner-cwl]

## メトリクス

- [CloudWatch に報告される App Runner サービスメトリクスの表示][apprunner-cwm]


## トレース
- [AWS Distro for OpenTelemetry を使用した App Runner の AWS X-Ray トレースの開始方法](https://aws-otel.github.io/docs/getting-started/apprunner)
- [Containers from the Couch | AWS App Runner X-Ray Integration](https://youtu.be/cVr8N7enCMM)
- [AWS ブログ | OpenTelemetry を使用した AWS X-Ray による AWS App Runner サービスのトレース](https://aws.amazon.com/blogs/containers/tracing-an-aws-app-runner-service-using-aws-x-ray-with-opentelemetry/)
- [AWS ブログ | AWS Copilot CLI を使用した AWS App Runner サービスの AWS X-Ray トレースの有効化](https://aws.amazon.com/blogs/containers/enabling-aws-x-ray-tracing-for-aws-app-runner-service-using-aws-copilot-cli/)

[apprunner-main]: https://aws.amazon.com/apprunner/
[aes-ws]: https://bookstore.aesworkshops.com/
[apprunner-cwl]: https://docs.aws.amazon.com/apprunner/latest/dg/monitor-cwl.html
[apprunner-cwm]: https://docs.aws.amazon.com/apprunner/latest/dg/monitor-cw.html

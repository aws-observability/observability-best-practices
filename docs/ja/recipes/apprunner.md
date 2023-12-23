# AWS App Runner

[AWS App Runner][apprunner-main] は、開発者がコンテナ化された Web アプリケーションや API を、インフラストラクチャの経験がなくてもスケールしてすぐにデプロイできるようにする、完全マネージドサービスです。ソースコードやコンテナイメージから始めます。App Runner は Web アプリケーションを自動的にビルドおよびデプロイし、トラフィックを暗号化してロードバランシングし、トラフィックニーズに合わせてスケーリングし、プライベート Amazon VPC 内で実行されている他の AWS サービスやアプリケーションとの通信を簡単にします。App Runner を使用することで、サーバーやスケーリングを考える代わりに、アプリケーションに集中する時間が増えます。

以下のレシピをご確認ください:

## 全般
- [Container Day - Docker Con | 開発者が簡単に大規模な本番Webアプリケーションを構築できる方法](https://www.youtube.com/watch?v=Iyp9Ugk9oRs)
- [AWS ブログ | AWS App Runner サービスの集中化されたオブザーバビリティ](https://aws.amazon.com/blogs/containers/centralized-observability-for-aws-app-runner-services/)
- [AWS ブログ | AWS App Runner VPC ネットワーキングのためのオブザーバビリティ](https://aws.amazon.com/blogs/containers/observability-for-aws-app-runner-vpc-networking/)
- [AWS ブログ | Amazon EventBridge による AWS App Runner アプリケーションの制御と監視](https://aws.amazon.com/blogs/containers/controlling-and-monitoring-aws-app-runner-applications-with-amazon-eventbridge/)

## ログ

- [CloudWatch Logs にストリーミングされた App Runner ログの表示][apprunner-cwl]

## メトリクス

- [CloudWatch にレポートされた App Runner サービスメトリクスの表示][apprunner-cwm]

## トレース
- [AWS Distro for OpenTelemetry を使用した App Runner の AWS X-Ray トレース入門](https://aws-otel.github.io/docs/getting-started/apprunner)
- [Containers from the Couch | AWS App Runner X-Ray インテグレーション](https://youtu.be/cVr8N7enCMM)
- [AWS ブログ | OpenTelemetry を使用した AWS X-Ray による AWS App Runner サービスのトレーシング](https://aws.amazon.com/blogs/containers/tracing-an-aws-app-runner-service-using-aws-x-ray-with-opentelemetry/)
- [AWS ブログ | AWS Copilot CLI を使用した AWS App Runner サービスの AWS X-Ray トレースの有効化](https://aws.amazon.com/blogs/containers/enabling-aws-x-ray-tracing-for-aws-app-runner-service-using-aws-copilot-cli/)

[apprunner-main]: https://aws.amazon.com/apprunner/
[aes-ws]: https://bookstore.aesworkshops.com/
[apprunner-cwl]: https://docs.aws.amazon.com/apprunner/latest/dg/monitor-cwl.html
[apprunner-cwm]: https://docs.aws.amazon.com/apprunner/latest/dg/monitor-cw.html

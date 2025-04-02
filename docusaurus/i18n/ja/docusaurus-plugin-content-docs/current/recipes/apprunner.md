# AWS App Runner

[AWS App Runner][apprunner-main] は、開発者がコンテナ化された Web アプリケーションと API を、インフラストラクチャの経験がなくても、迅速かつスケーラブルにデプロイできるフルマネージドサービスです。

ソースコードまたはコンテナイメージから始めることができます。

App Runner は Web アプリケーションを自動的にビルドしてデプロイし、暗号化されたトラフィックをロードバランシングし、トラフィックのニーズに応じてスケーリングを行い、他の AWS サービスやプライベート Amazon VPC で実行されるアプリケーションとの通信を容易にします。

App Runner を使用することで、サーバーやスケーリングについて考える必要がなくなり、アプリケーションに集中する時間が増えます。

以下のレシピをご確認ください：



## 一般
- [Container Day - Docker Con | 開発者がスケーラブルな本番 Web アプリケーションを簡単にデプロイする方法](https://www.youtube.com/watch?v=Iyp9Ugk9oRs)
- [AWS Blog | AWS App Runner サービスの一元化されたオブザーバビリティ](https://aws.amazon.com/blogs/containers/centralized-observability-for-aws-app-runner-services/)
- [AWS Blog | AWS App Runner VPC ネットワーキングのオブザーバビリティ](https://aws.amazon.com/jp/blogs/news/observability-for-aws-app-runner-vpc-networking/)
- [AWS Blog | Amazon EventBridge を使用した AWS App Runner アプリケーションの制御と監視](https://aws.amazon.com/blogs/containers/controlling-and-monitoring-aws-app-runner-applications-with-amazon-eventbridge/)





## ログ

- [CloudWatch Logs にストリーミングされた App Runner のログの表示][apprunner-cwl]




## メトリクス

- [CloudWatch に報告された App Runner サービスのメトリクスを表示する][apprunner-cwm]





## トレース
- [AWS Distro for OpenTelemetry を使用した App Runner の AWS X-Ray トレースの開始方法](https://aws-otel.github.io/docs/getting-started/apprunner)
- [Containers from the Couch | AWS App Runner X-Ray 統合](https://youtu.be/cVr8N7enCMM)
- [AWS Blog | OpenTelemetry を使用した AWS X-Ray による AWS App Runner サービスのトレース](https://aws.amazon.com/blogs/containers/tracing-an-aws-app-runner-service-using-aws-x-ray-with-opentelemetry/)
- [AWS Blog | AWS Copilot CLI を使用した AWS App Runner サービスの AWS X-Ray トレースの有効化](https://aws.amazon.com/blogs/containers/enabling-aws-x-ray-tracing-for-aws-app-runner-service-using-aws-copilot-cli/)

[apprunner-main]: https://aws.amazon.com/jp/apprunner/
[aes-ws]: https://bookstore.aesworkshops.com/
[apprunner-cwl]: https://docs.aws.amazon.com/ja_jp/apprunner/latest/dg/monitor-cwl.html
[apprunner-cwm]: https://docs.aws.amazon.com/ja_jp/apprunner/latest/dg/monitor-cw.html

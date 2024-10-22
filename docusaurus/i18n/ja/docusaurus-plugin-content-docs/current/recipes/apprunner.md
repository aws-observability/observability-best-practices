# AWS App Runner

[AWS App Runner][apprunner-main] は、コンテナ化された Web アプリケーションと API を、インフラストラクチャの経験がなくても簡単にスケーリングして迅速にデプロイできるフルマネージドサービスです。ソースコードまたはコンテナイメージから始めます。App Runner は Web アプリケーションを自動的にビルドおよびデプロイし、暗号化された状態でトラフィックをロードバランシングし、トラフィックの需要に合わせてスケーリングし、プライベート Amazon VPC で実行されている他の AWS サービスやアプリケーションとの通信を簡単にします。App Runner を使えば、サーバーやスケーリングについて考える必要がなくなり、アプリケーションに集中できます。

次のレシピをご覧ください:

## 一般
- [Container Day - Docker Con | 開発者が簡単にウェブアプリケーションを本番環境で大規模に展開する方法](https://www.youtube.com/watch?v=Iyp9Ugk9oRs)
- [AWS ブログ | AWS App Runner サービスの集中監視](https://aws.amazon.com/blogs/containers/centralized-observability-for-aws-app-runner-services/)
- [AWS ブログ | AWS App Runner VPC ネットワーキングのオブザーバビリティ](https://aws.amazon.com/jp/blogs/news/observability-for-aws-app-runner-vpc-networking/)
- [AWS ブログ | Amazon EventBridge を使用した AWS App Runner アプリケーションの制御と監視](https://aws.amazon.com/blogs/containers/controlling-and-monitoring-aws-app-runner-applications-with-amazon-eventbridge/)

## ログ

- [CloudWatch Logs に App Runner のログをストリーミングして表示する][apprunner-cwl]

## メトリクス

- [App Runner サービスから CloudWatch に報告されるメトリクスの表示][apprunner-cwm]

## トレース
- [AWS Distro for OpenTelemetry を使用した App Runner の AWS X-Ray トレーシングの概要](https://aws-otel.github.io/docs/getting-started/apprunner)
- [Containers from the Couch | AWS App Runner X-Ray 統合](https://youtu.be/cVr8N7enCMM)
- [AWS ブログ | OpenTelemetry を使用して AWS App Runner サービスを AWS X-Ray でトレースする](https://aws.amazon.com/blogs/containers/tracing-an-aws-app-runner-service-using-aws-x-ray-with-opentelemetry/)
- [AWS ブログ | AWS Copilot CLI を使用して AWS App Runner サービスの AWS X-Ray トレーシングを有効化する](https://aws.amazon.com/blogs/containers/enabling-aws-x-ray-tracing-for-aws-app-runner-service-using-aws-copilot-cli/)

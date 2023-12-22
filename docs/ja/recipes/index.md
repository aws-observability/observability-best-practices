# レシピ

ここでは、カリキュラムガイダンス、ハウツー、その他のリソースへのリンクを掲載しています。これらは、[Amazon Managed Service for Prometheus][amp] や [Amazon Managed Grafana][amg] などのマネージドサービス、[OpenTelemetry][otel] や [Fluent Bit][fluentbit] などのエージェントを含む、さまざまなユースケースへのオブザーバビリティ (o11y) の適用を支援します。ここでのコンテンツは AWS ツールに限定されているわけではなく、多くのオープンソースプロジェクトが参照されています。

開発者とインフラ担当者のニーズに均等に対応するために、レシピの多くが「幅広い対象」となっています。探索して、あなたが実現しようとしていることに最適なソリューションを見つけてください。

!!! info
    ここにあるコンテンツは、ソリューションアーキテクト、プロフェッショナルサービス、および他のお客様からのフィードバックに基づいて実際の顧客とのエンゲージメントから派生しています。ここで見つけることができるものはすべて、お客様自身の環境で実装されたものです。

o11y スペースについての考え方は次のとおりです。[6 つの次元][dimensions]に分解し、それらを組み合わせて特定のソリューションに到達できます。

| 次元 | 例 |
|---------------|--------------|
| 送信先 | [Prometheus][amp] · [Grafana][amg] · [OpenSearch][aes] · [CloudWatch][cw] · [Jaeger][jaeger] |  
| エージェント | [ADOT][adot] · [Fluent Bit][fluentbit] · CW エージェント · X-Ray エージェント |
| 言語 | [Java][java] · Python · .NET · [JavaScript][nodejs] · Go · Rust |
| インフラとデータベース | [RDS][rds] · [DynamoDB][dynamodb] · [MSK][msk] |
| コンピューティングユニット | [Batch][batch] · [ECS][ecs] · [EKS][eks] · [AEB][beans] · [Lambda][lambda] · [AppRunner][apprunner] |  
| コンピューティングエンジン | [Fargate][fargate] · [EC2][ec2] · [Lightsail][lightsail] |

!!! question "例としてのソリューション要件"
    EKS 上の Fargate で実行している Python アプリのロギングソリューションが必要です。ログを S3 バケットに格納してさらに消費することが目的です。

このニーズに適合するスタックの 1 つは、次のとおりです。

1. *送信先*: データのさらなる消費用の S3 バケット
1. *エージェント*: EKS からログデータを出力する FluentBit  
1. *言語*: Python
1. *インフラとデータベース*: 該当なし
1. *コンピューティングユニット*: Kubernetes (EKS)
1. *コンピューティングエンジン*: EC2

すべての次元を特定する必要はなく、時にはどこから始めればいいか判断しにくいこともあります。
さまざまなパスを試して、特定のレシピの長所と短所を比較してください。

ナビゲーションを簡素化するために、6つの次元を以下のカテゴリにグループ化しています:

- **コンピューティング別**: コンピューティングエンジンとユニットをカバー
- **インフラとデータ別**: インフラとデータベースをカバー  
- **言語別**: 言語をカバー
- **送信先別**: テレメトリと分析をカバー
- **タスク**: 異常検知、アラート、トラブルシューティングなどをカバー

[次元の詳細を見る... ](https://aws-observability.github.io/observability-best-practices/recipes/dimensions/)

## 使い方

トップナビゲーションメニューを使用して、概略的な選択から特定のインデックスページを参照できます。
例えば、「By Compute」->「EKS」->「Fargate」->「Logs」です。

あるいは、`/` キーまたは `s` キーを押してサイト内を検索できます。

![o11y space](images/search.png)  

!!! info "ライセンス"  
    このサイトに公開されているすべてのレシピは、[MIT-0][mit0]ライセンスを介して利用できます。これは、帰属の要件を削除した通常のMITライセンスの変更です。

## 貢献の仕方

計画していることについて [discussion][discussion] を開始し、そこから始めましょう。

## 詳細を知る

このサイトのレシピは、ベストプラクティスのコレクションです。さらに、レシピで使用しているオープンソースプロジェクトのステータスや、マネージドサービスの詳細を学べる場所がいくつかあるので、以下をチェックしてください。

- [observability @ aws][o11yataws] AWS の方々がプロジェクトやサービスについて語るプレイリストです。  
- [AWS オブザーバビリティ ワークショップ](https://aws-observability.github.io/observability-best-practices/recipes/workshops/) 体系的な学習ができるワークショップです。
- [AWS モニタリングとオブザーバビリティ][o11yhome] ケーススタディやパートナーへのリンクがあるホームページです。

[aes]: aes.md "Amazon Elasticsearch Service"  
[adot]: https://aws-otel.github.io/ "AWS Distro for OpenTelemetry"
[amg]: amg.md "Amazon Managed Grafana"
[amp]: amp.md "Amazon Managed Service for Prometheus"  
[batch]: https://aws.amazon.com/batch/ "AWS Batch"
[beans]: https://aws.amazon.com/elasticbeanstalk/ "AWS Elastic Beanstalk"
[cw]: cw.md "Amazon CloudWatch"
[dimensions]: dimensions.md
[dynamodb]: dynamodb.md "Amazon DynamoDB"  
[ec2]: https://aws.amazon.com/ec2/ "Amazon EC2"
[ecs]: ecs.md "Amazon Elastic Container Service"
[eks]: eks.md "Amazon Elastic Kubernetes Service"
[fargate]: https://aws.amazon.com/fargate/ "AWS Fargate"
[fluentbit]: https://fluentbit.io/ "Fluent Bit"
[jaeger]: https://www.jaegertracing.io/ "Jaeger"
[kafka]: https://kafka.apache.org/ "Apache Kafka"  
[apprunner]: apprunner.md "AWS App Runner"
[lambda]: lambda.md "AWS Lambda"
[lightsail]: https://aws.amazon.com/lightsail/ "Amazon Lightsail"
[otel]: https://opentelemetry.io/ "OpenTelemetry"
[java]: java.md
[nodejs]: nodejs.md
[rds]: rds.md "Amazon Relational Database Service"
[msk]: msk.md "Amazon Managed Streaming for Apache Kafka"
[mit0]: https://github.com/aws/mit-0 "MIT-0"
[discussion]: https://github.com/aws-observability/observability-best-practices/discussions "Discussions"
[o11yataws]: https://www.youtube.com/playlist?list=PLaiiCkpc1U7Wy7XwkpfgyOhIf_06IK3U_ "Observability @ AWS YouTube playlist"
[o11yhome]: https://aws.amazon.com/products/management-and-governance/use-cases/monitoring-and-observability/ "AWS Observability home"

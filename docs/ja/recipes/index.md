# レシピ

ここでは、さまざまなユースケースに対するオブザーバビリティ (o11y) の適用を支援するためのキュレーションされたガイダンス、ハウツー、その他のリソースへのリンクを見つけることができます。これには、[Amazon Managed Service for Prometheus][amp] や [Amazon Managed Grafana][amg] などのマネージドサービスと、[OpenTelemetry][otel] や [Fluent Bit][fluentbit] などのエージェントが含まれます。ただし、コンテンツは AWS ツールに限定されているわけではなく、多くのオープンソースプロジェクトがここで参照されています。

開発者とインフラ担当者のニーズに均等に対応するために、多くのレシピが「幅広い対象をカバーしています」。探索して、あなたが達成しようとしていることに最適なソリューションを見つけることをお勧めします。 

!!! info
    ここにあるコンテンツは、ソリューションアーキテクト、プロフェッショナルサービス、および他のお客様からのフィードバックに基づいて実際の顧客とのエンゲージメントから派生しています。ここで見つけることができるすべてのものは、お客様自身の環境で実際に実装されたものです。

o11y スペースについての考え方は次のとおりです。[6 つの次元][dimensions]に分解し、特定のソリューションに到達するために組み合わせます。

| 次元 | 例 |
|---------------|--------------|
| 送信先 | [Prometheus][amp] · [Grafana][amg] · [OpenSearch][aes] · [CloudWatch][cw] · [Jaeger][jaeger] |  
| エージェント | [ADOT][adot] · [Fluent Bit][fluentbit] · CW エージェント · X-Ray エージェント |
| 言語 | [Java][java] · Python · .NET · [JavaScript][nodejs] · Go · Rust |
| インフラとデータベース | [RDS][rds] · [DynamoDB][dynamodb] · [MSK][msk] |
| コンピューティングユニット | [Batch][batch] · [ECS][ecs] · [EKS][eks] · [AEB][beans] · [Lambda][lambda] · [AppRunner][apprunner] |  
| コンピューティングエンジン | [Fargate][fargate] · [EC2][ec2] · [Lightsail][lightsail] |

!!! question "例としてのソリューション要件"
    Fargate 上の EKS で実行している Python アプリのロギングソリューションが必要です。ログを S3 バケットに格納してさらに消費することが目的です。

このニーズに対応するスタックの 1 つは、次のとおりです。

1. *送信先*: データのさらなる消費用の S3 バケット
1. *エージェント*: EKS からログデータを出力する FluentBit
1. *言語*: Python
1. *インフラとデータベース*: 該当なし
1. *コンピューティングユニット*: Kubernetes (EKS)  
1. *コンピューティングエンジン*: EC2

すべての次元を指定する必要はなく、時にはどこから始めればいいか判断しにくいこともあります。さまざまなパスを試し、特定のレシピの長所と短所を比較してください。

ナビゲーションを簡単にするために、6つの次元を以下のカテゴリにグループ化しています。

- **コンピューティング別**: コンピューティングエンジンとユニットをカバー
- **インフラとデータ別**: インフラとデータベースをカバー
- **言語別**: 言語をカバー
- **送信先別**: テレメトリと分析をカバー
- **タスク**: 異常検知、アラート、トラブルシューティングなどをカバー

[次元の詳細を見る... ](dimensions/)

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

このサイトのレシピは、ベストプラクティスのコレクションです。さらに、レシピで使用しているオープンソースプロジェクトのステータスや、マネージドサービスについて学べる場所がいくつかあります。以下をチェックしてください。

- [observability @ aws][o11yataws] AWS の方々がプロジェクトやサービスについて語るプレイリストです。  
- [AWS オブザーバビリティ ワークショップ][workshops] 提供されているものを体系的に試すことができます。
- [AWS モニタリングとオブザーバビリティ][o11yhome] ホームページ。ケーススタディやパートナーへのリンクがあります。

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
[o11yataws]: https://www.youtube.com/playlist?list=PLaiiCkpc1U7Wy7XwkpfgyOhIf_06IK3U_ "Observability @ AWS YouTube プレイリスト"
[o11yhome]: https://aws.amazon.com/products/management-and-governance/use-cases/monitoring-and-observability/ "AWS オブザーバビリティ ホームページ"

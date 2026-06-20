# レシピ

ここでは、さまざまなユースケースにオブザーバビリティ (o11y) を適用する際に役立つ、厳選されたガイダンス、ハウツー、その他のリソースへのリンクを紹介します。これには、[Amazon Managed Service for Prometheus][amp] や [Amazon Managed Grafana][amg] などのマネージドサービス、および [OpenTelemetry][otel] や [Fluent Bit][fluentbit] などのエージェントが含まれます。ただし、ここで紹介するコンテンツは AWS ツールのみに限定されておらず、多くのオープンソースプロジェクトも参照されています。

開発者とインフラストラクチャ担当者の両方のニーズに等しく対応したいと考えているため、多くのレシピは「幅広く網羅」しています。ぜひ探索して、達成しようとしていることに最適なソリューションを見つけてください。

:::info
    ここに記載されている内容は、ソリューションアーキテクト、プロフェッショナルサービスによる実際のお客様とのエンゲージメント、および他のお客様からのフィードバックに基づいています。ここで紹介するすべての内容は、実際のお客様が自身の環境で実装したものです。
:::

o11y 空間について考える方法は次のとおりです。これを[6 つのディメンション][dimensions]に分解し、それらを組み合わせて特定のソリューションに到達できます。

| dimension | examples |
|---------------|--------------|
| Destinations  | [Prometheus][amp] &middot; [Grafana][amg] &middot; [OpenSearch][aes] &middot; [CloudWatch][cw] &middot; [Jaeger][jaeger] |
| Agents        | [ADOT][adot] &middot; [Fluent Bit][fluentbit] &middot; CW agent &middot; X-Ray agent |
| Languages     | [Java][java] &middot; Python &middot; .NET &middot; [JavaScript][nodejs] &middot; Go &middot; Rust |
| Infra & databases  |  [RDS][rds] &middot; [DynamoDB][dynamodb] &middot; [MSK][msk] |
| Compute unit | [Batch][batch] &middot; [ECS][ecs] &middot; [EKS][eks] &middot; [AEB][beans] &middot; [Lambda][lambda] &middot; [AppRunner][apprunner] |
| Compute engine | [Fargate][fargate] &middot; [EC2][ec2] &middot; [Lightsail][lightsail] |

:::note
    「ソリューション要件の例」
    Fargate 上の EKS で実行している Python アプリのログソリューションが必要です。
    ログを S3 バケットに保存して、さらなる利用に備えることが目標です
:::

このニーズに適合するスタックは次のとおりです。

1. *送信先*: データをさらに利用するための S3 バケット
1. *エージェント*: EKS からログデータを送信するための FluentBit
1. *言語*: Python
1. *インフラと DB*: N/A
1. *コンピューティングユニット*: Kubernetes (EKS)
1. *コンピューティングエンジン*: EC2

すべてのディメンションを指定する必要はなく、どこから始めるべきか判断が難しい場合もあります。さまざまなパスを試して、特定のレシピの長所と短所を比較してください。

ナビゲーションを簡素化するために、6 つのディメンションを次のカテゴリにグループ化しています。

- **コンピューティング別**: コンピューティングエンジンとユニットをカバー
- **インフラストラクチャとデータ別**: インフラストラクチャとデータベースをカバー
- **言語別**: プログラミング言語をカバー
- **送信先別**: テレメトリと分析をカバー
- **タスク**: 異常検知、アラート、トラブルシューティングなどをカバー

[ディメンションの詳細については、こちらをご覧ください…](/observability-best-practices/ja/recipes/dimensions/)

## 使用方法

トップナビゲーションメニューを使用して特定のインデックスページを参照できます。まず大まかな選択から始めます。例えば、 `By Compute` -> `EKS` ->
`Fargate` -> `Logs`.

または、サイトを検索することもできます。 `/` または `s` キー:

![o11y space](images/search.png)

:::info
   「ライセンス」
  このサイトで公開されているすべてのレシピは、[MIT-0][mit0] ライセンスで利用できます。これは通常の MIT ライセンスを変更したもので、帰属表示の要件が削除されています。
:::

## 貢献方法

計画していることについて[ディスカッション][discussion]を開始していただければ、そこから進めていきます。

## 詳細情報

このサイトのレシピは、ベストプラクティスのコレクションです。さらに、使用しているオープンソースプロジェクトのステータスや、レシピで紹介しているマネージドサービスについて詳しく学べる場所が数多くありますので、以下をご確認ください。

- [observability @ aws][o11yataws]、AWS の担当者がプロジェクトやサービスについて語るプレイリスト
- [AWS observability workshops](/observability-best-practices/ja/recipes/workshops/)、構造化された方法で提供内容を試すことができます
- [AWS monitoring and observability][o11yhome] ホームページ、ケーススタディとパートナーへのポインタを掲載

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

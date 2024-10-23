# レシピ

ここでは、様々なユースケースにおけるオブザーバビリティ (o11y) の適用に役立つ、厳選されたガイダンス、ハウツー、および他のリソースへのリンクを見つけることができます。これには、[Amazon Managed Service for Prometheus][amp] や [Amazon Managed Grafana][amg] などのマネージドサービスだけでなく、[OpenTelemetry][otel] や [Fluent Bit][fluentbit] などのエージェントも含まれます。ここでのコンテンツは AWS ツールだけに限定されているわけではなく、多くのオープンソースプロジェクトも参照されています。

私たちは、開発者とインフラストラクチャの担当者のニーズに等しく対応したいと考えているため、多くのレシピは「幅広いネットを投げかける」ようになっています。あなたが達成したいことに最適なソリューションを探索し、見つけることをお勧めします。

:::info
    ここでのコンテンツは、ソリューションアーキテクト、プロフェッショナルサービス、および他の顧客からのフィードバックによる実際の顧客エンゲージメントから得られたものです。ここで見つかるすべてのものは、実際の顧客が自身の環境で実装したものです。
:::

私たちが o11y 空間について考える方法は以下の通りです：特定のソリューションに到達するために組み合わせることができる [6 つの次元][dimensions] に分解します：

| 次元 | 例 |
|---------------|--------------|
| 送信先  | [Prometheus][amp] &middot; [Grafana][amg] &middot; [OpenSearch][aes] &middot; [CloudWatch][cw] &middot; [Jaeger][jaeger] |
| エージェント        | [ADOT][adot] &middot; [Fluent Bit][fluentbit] &middot; CW エージェント &middot; X-Ray エージェント |
| 言語     | [Java][java] &middot; Python &middot; .NET &middot; [JavaScript][nodejs] &middot; Go &middot; Rust |
| インフラとデータベース  |  [RDS][rds] &middot; [DynamoDB][dynamodb] &middot; [MSK][msk] |
| コンピュートユニット | [Batch][batch] &middot; [ECS][ecs] &middot; [EKS][eks] &middot; [AEB][beans] &middot; [Lambda][lambda] &middot; [AppRunner][apprunner] |
| コンピュートエンジン | [Fargate][fargate] &middot; [EC2][ec2] &middot; [Lightsail][lightsail] |

:::note
    「ソリューション要件の例」
    Fargate 上の EKS で実行している Python アプリのログソリューションが必要で、ログを S3 バケットに保存して後で消費することが目標です。
:::

このニーズに適合するスタックの一例は以下の通りです：

1. *送信先*：データの後続の消費のための S3 バケット
1. *エージェント*：EKS からログデータを出力するための FluentBit
1. *言語*：Python
1. *インフラと DB*：該当なし
1. *コンピュートユニット*：Kubernetes (EKS)
1. *コンピュートエンジン*：EC2

すべての次元を指定する必要はなく、どこから始めるべきか判断するのが難しい場合もあります。異なるパスを試し、特定のレシピの長所と短所を比較してみてください。

ナビゲーションを簡素化するために、6 つの次元を以下のカテゴリにグループ化しています：

- **コンピュート別**：コンピュートエンジンとユニットをカバー
- **インフラとデータ別**：インフラストラクチャとデータベースをカバー
- **言語別**：言語をカバー
- **送信先別**：テレメトリと分析をカバー
- **タスク**：異常検出、アラート、トラブルシューティングなどをカバー

[次元についてさらに学ぶ …](/observability-best-practices/ja/recipes/dimensions/)



## 使用方法

トップナビゲーションメニューを使用して、大まかな選択から始まる特定のインデックスページに移動できます。例えば、`By Compute` -> `EKS` -> `Fargate` -> `Logs` のようになります。

または、`/` キーまたは `s` キーを押してサイト内を検索することもできます：

![o11y space](images/search.png)

:::info
   「ライセンス」
  このサイトで公開されているすべてのレシピは、[MIT-0][mit0] ライセンスで利用可能です。これは通常の MIT ライセンスを変更し、帰属表示の要件を削除したものです。
:::



## 貢献の方法

あなたが計画していることについて [ディスカッション][discussion] を開始してください。そこから一緒に進めていきましょう。




## もっと学ぶ

このサイトのレシピは、ベストプラクティスのコレクションです。さらに、レシピで使用しているオープンソースプロジェクトの状況やマネージドサービスについて、より詳しく学べる場所がいくつかあります。以下をチェックしてみてください：

- [observability @ aws][o11yataws]：AWS の人々がプロジェクトやサービスについて語るプレイリスト。
- [AWS オブザーバビリティワークショップ](/observability-best-practices/ja/recipes/workshops/)：構造化された方法でサービスを試すことができます。
- [AWS モニタリングとオブザーバビリティ][o11yhome]のホームページ：ケーススタディやパートナーへのリンクがあります。

[aes]: aes.md "Amazon Elasticsearch Service"
[adot]: https://aws-otel.github.io/ "AWS Distro for OpenTelemetry"
[amg]: amg.md "Amazon Managed Grafana"
[amp]: amp.md "Amazon Managed Service for Prometheus"
[batch]: https://aws.amazon.com/jp/batch/ "AWS Batch"
[beans]: https://aws.amazon.com/jp/elasticbeanstalk/ "AWS Elastic Beanstalk"
[cw]: cw.md "Amazon CloudWatch"
[dimensions]: dimensions.md
[dynamodb]: dynamodb.md "Amazon DynamoDB"
[ec2]: https://aws.amazon.com/jp/ec2/ "Amazon EC2"
[ecs]: ecs.md "Amazon Elastic Container Service"
[eks]: eks.md "Amazon Elastic Kubernetes Service"
[fargate]: https://aws.amazon.com/jp/fargate/ "AWS Fargate"
[fluentbit]: https://fluentbit.io/ "Fluent Bit"
[jaeger]: https://www.jaegertracing.io/ "Jaeger"
[kafka]: https://kafka.apache.org/ "Apache Kafka"
[apprunner]: apprunner.md "AWS App Runner"
[lambda]: lambda.md "AWS Lambda"
[lightsail]: https://aws.amazon.com/jp/lightsail/ "Amazon Lightsail"
[otel]: https://opentelemetry.io/ "OpenTelemetry"
[java]: java.md
[nodejs]: nodejs.md
[rds]: rds.md "Amazon Relational Database Service"
[msk]: msk.md "Amazon Managed Streaming for Apache Kafka"
[mit0]: https://github.com/aws/mit-0 "MIT-0"
[discussion]: https://github.com/aws-observability/observability-best-practices/discussions "Discussions"
[o11yataws]: https://www.youtube.com/playlist?list=PLaiiCkpc1U7Wy7XwkpfgyOhIf_06IK3U_ "Observability @ AWS YouTube playlist"
[o11yhome]: https://aws.amazon.com/jp/products/management-and-governance/use-cases/monitoring-and-observability/ "AWS Observability home"

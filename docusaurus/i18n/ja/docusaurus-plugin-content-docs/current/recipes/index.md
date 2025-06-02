# レシピ

ここでは、オブザーバビリティ (o11y) をさまざまなユースケースに適用するためのキュレーションされたガイダンス、ハウツー、その他のリソースへのリンクを見つけることができます。これには、[Amazon Managed Service for Prometheus][amp] や [Amazon Managed Grafana][amg] などのマネージドサービス、また [OpenTelemetry][otel] や [Fluent Bit][fluentbit] などのエージェントが含まれます。ここでのコンテンツは AWS のツールだけに限定されているわけではなく、多くのオープンソースプロジェクトも参照されています。

開発者とインフラストラクチャの担当者のニーズに等しく対応したいと考えているため、多くのレシピは「幅広いニーズに対応」しています。皆さんが目的を達成するために最適なソリューションを探索することをお勧めします。

:::info
    ここでのコンテンツは、Solution Architects、Professional Services による実際のお客様との関わり、そして他のお客様からのフィードバックから得られたものです。ここで見つかるすべてのものは、実際のお客様が自身の環境で実装したものです。
:::

オブザーバビリティ領域について、私たちは以下のように考えています。特定のソリューションに到達するために組み合わせることができる [6 つのディメンション][dimensions] に分解します：

| ディメンション | 例 |
|---------------|--------------|
| Destinations  | [Prometheus][amp] &middot; [Grafana][amg] &middot; [OpenSearch][aes] &middot; [CloudWatch][cw] &middot; [Jaeger][jaeger] |
| Agents        | [ADOT][adot] &middot; [Fluent Bit][fluentbit] &middot; CW agent &middot; X-Ray agent |
| Languages     | [Java][java] &middot; Python &middot; .NET &middot; [JavaScript][nodejs] &middot; Go &middot; Rust |
| Infra & databases  |  [RDS][rds] &middot; [DynamoDB][dynamodb] &middot; [MSK][msk] |
| Compute unit | [Batch][batch] &middot; [ECS][ecs] &middot; [EKS][eks] &middot; [AEB][beans] &middot; [Lambda][lambda] &middot; [AppRunner][apprunner] |
| Compute engine | [Fargate][fargate] &middot; [EC2][ec2] &middot; [Lightsail][lightsail] |

:::note
    "ソリューション要件の例"
    Fargate 上の EKS で実行している Python アプリケーションのログを、さらなる利用のために S3 バケットに保存するロギングソリューションが必要です。
:::

このニーズに適合するスタックは以下の通りです：

1. *Destination*：さらなるデータ利用のための S3 バケット
1. *Agent*：EKS からログデータを出力するための FluentBit
1. *Language*：Python
1. *Infra & DB*：該当なし
1. *Compute unit*：Kubernetes (EKS)
1. *Compute engine*：EC2

すべてのディメンションを指定する必要はなく、どこから始めるべきか判断が難しい場合もあります。異なるパスを試して、特定のレシピのメリットとデメリットを比較してください。

ナビゲーションを簡単にするために、6 つのディメンションを以下のカテゴリにグループ化しています：

- **By Compute**：コンピュートエンジンとユニットをカバー
- **By Infra & Data**：インフラストラクチャとデータベースをカバー
- **By Language**：プログラミング言語をカバー
- **By Destination**：テレメトリとアナリティクスをカバー
- **Tasks**：異常検知、アラート、トラブルシューティングなどをカバー

[ディメンションについてさらに学ぶ …](/observability-best-practices/ja/recipes/dimensions/)



## 使い方

トップナビゲーションメニューを使用して、大まかな選択から始まる特定のインデックスページを参照できます。例えば、`By Compute` -> `EKS` -> `Fargate` -> `Logs` のように選択します。

または、`/` キーまたは `s` キーを押してサイトを検索することもできます：

![o11y space](images/search.png)

:::info
   "ライセンス"
  このサイトで公開されているすべてのレシピは、通常の MIT ライセンスから帰属表示の要件を削除した変更版である [MIT-0][mit0] ライセンスで利用可能です。
:::



## 貢献の方法

あなたが計画していることについて [discussion][discussion] を開始し、そこから始めましょう。




## 詳細情報

このサイトのレシピは、ベストプラクティス集です。
さらに、レシピで使用しているオープンソースプロジェクトの状況や、マネージドサービスについて詳しく学べる場所がいくつかありますので、以下をご確認ください：

- [observability @ aws][o11yataws] - AWS のスタッフがプロジェクトやサービスについて説明するプレイリスト。
- [AWS observability workshops](/observability-best-practices/ja/recipes/workshops/) - 構造化された方法でサービスを試すことができます。
- [AWS monitoring and observability][o11yhome] - ケーススタディやパートナー情報へのリンクがあるホームページ。

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

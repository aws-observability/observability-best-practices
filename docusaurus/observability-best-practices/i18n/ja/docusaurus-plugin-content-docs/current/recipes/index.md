# レシピ

ここでは、[Amazon Managed Service for Prometheus][amp]や[Amazon Managed Grafana][amg]といったマネージドサービス、[OpenTelemetry][otel]や[Fluent Bit][fluentbit]といったエージェントなど、さまざまなユースケースに対するオブザーバビリティの適用に役立つ、厳選されたガイダンス、ハウツー、その他のリソースへのリンクを紹介しています。コンテンツは AWS ツールに限定されているわけではなく、多くのオープンソースプロジェクトが参照されています。

開発者とインフラ担当者の両方のニーズに対応するために、レシピの多くが「幅広い対象」となっています。探索して、あなたが達成しようとしていることに最適なソリューションを見つけることをお勧めします。 

:::info
    ここにあるコンテンツは、ソリューションアーキテクト、プロフェッショナルサービス、およびその他のお客様からのフィードバックによって導き出されたものです。ここで紹介されているものはすべて、お客様自身の環境で実際に実装されたものです。
:::
オブザーバビリティ領域を次のように考えています: 
[6つのディメンション][dimensions]に分解し、それらを組み合わせることで、特定のソリューションに到達できます:

| ディメンション | 例 |
|---------------|--------------|
| デスティネーション | [Prometheus][amp] · [Grafana][amg] · [OpenSearch][aes] · [CloudWatch][cw] · [Jaeger][jaeger] |  
| エージェント | [ADOT][adot] · [Fluent Bit][fluentbit] · CW エージェント · X-Ray エージェント |
| 言語 | [Java][java] · Python · .NET · [JavaScript][nodejs] · Go · Rust |
| インフラとデータベース | [RDS][rds] · [DynamoDB][dynamodb] · [MSK][msk] |
| コンピュートユニット | [Batch][batch] · [ECS][ecs] · [EKS][eks] · [AEB][beans] · [Lambda][lambda] · [AppRunner][apprunner] |  
| コンピュートエンジン | [Fargate][fargate] · [EC2][ec2] · [Lightsail][lightsail] |

:::note
    EKS on Fargate で実行している Python アプリのログソリューションが必要です。データのさらなる消費のためにログを S3 バケットに格納することが目的です。
:::

このニーズを満たすスタックの一例は、次のとおりです:

1. *デスティネーション*: データのさらなる消費のための S3 バケット
2. *エージェント*: EKS からログデータを出力する FluentBit
3. *言語*: Python
4. *インフラとデータベース*: 該当なし
5. *コンピュートユニット*: Kubernetes (EKS)  
6. *コンピュートエンジン*: EC2

すべてのディメンションを指定する必要はなく、時にはどこから始めればいいか判断しにくいこともあります。さまざまなパスを試し、特定のレシピの長所と短所を比較してください。

ナビゲーションを簡略化するために、6つのディメンションを次のカテゴリにグループ化しています:

- **By Compute**: コンピュートエンジンとユニットをカバー
- **By Infra & Data**: インフラとデータベースをカバー  
- **By Language**: 言語をカバー
- **By Destination**: テレメトリと分析をカバー
- **Tasks**: 異常検知、アラート、トラブルシューティングなどをカバー

ディメンションの詳細を見る...

## 使い方

トップナビゲーションメニューを使用して、特定のインデックスページを参照できます。
たとえば、`By Compute` -> `EKS` ->`Fargate` -> `Logs` のように選択していきます。

または、`/` キーまたは `s` キーを押してサイト内検索ができます。

![o11y space](images/search.png)  

:::info
    このサイトで公開されているすべてのレシピは、[MIT-0][mit0]ライセンスを介して利用できます。これは、通常の MIT ライセンスを変更したもので、帰属表示の必要性がなくなっています。
:::

## 貢献の仕方

計画していることについて[ディスカッション][discussion]を開始し、そこから始めましょう。

## 詳細を知る

このサイトのレシピは、ベストプラクティスのコレクションです。さらに、レシピで使用しているオープンソースプロジェクトやマネージドサービスのステータスを知ることができる場所がいくつかあるので、以下をチェックしてください。

- [observability @ aws][o11yataws] - AWS の人々がプロジェクトやサービスについて語るプレイリストです。
- AWS オブザーバビリティ ワークショップ - 提供されているものを体系的に試すことができます。  
- [AWS モニタリングとオブザーバビリティ][o11yhome] ホームページ - ケーススタディやパートナーへのリンクがあります。

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

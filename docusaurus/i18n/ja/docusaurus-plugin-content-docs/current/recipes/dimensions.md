# ディメンション

このサイトでは、o11y の領域を 6 つのディメンションに沿って考えています。
それぞれのディメンションを独立して見ることは、ある特定のワークロードに対して具体的な o11y ソリューションを構築しようとする際に、使用されるプログラミング言語などの開発者関連の側面や、コンテナや Lambda 関数などのランタイム環境のようなオペレーショナルなトピックにまたがる観点から、有益です。

![o11y space](images/o11y-space.png)

note
    「シグナルとは何ですか?」
    ここでシグナルと言う場合、ログエントリ、メトリクス、トレースを含む、あらゆる種類の o11y データやメタデータのポイントを指します。
    より具体的にする必要がない限り、「シグナル」という言葉を使い、文脈から適用される制限が明らかになるはずです。


それでは、6 つのディメンションを 1 つずつ見ていきましょう。

## 宛先

この側面では、長期ストレージやシグナルを視覚化するグラフィカルインターフェースなど、あらゆる種類のシグナル宛先を考えます。開発者として、サービスのトラブルシューティングを行うために、シグナルを発見、検索、相関させることができる UI またはAPI にアクセスできることが望ましいです。インフラストラクチャまたはプラットフォームの役割では、インフラストラクチャの状態を把握するために、シグナルを管理、発見、検索、相関させることができる UI またはAPI にアクセスできることが望ましいです。

![Grafana のスクリーンショット](images/grafana.png)

最終的に、この側面は人間の観点から最も興味深いものです。しかし、その恩恵を受けるためには、最初に少し作業を投資する必要があります。ソフトウェアと外部の依存関係にインストルメンテーションを行い、シグナルを宛先に取り込む必要があります。

では、シグナルはどのように宛先に到達するのでしょうか? 聞いてくれてありがとう、それは...

## エージェント

シグナルがどのように収集され、分析に向けてルーティングされるかについて説明します。
シグナルは 2 つの情報源から来る可能性があります。1 つはアプリケーションのソースコード (言語のセクションも参照)、もう 1 つはデータストアに管理された状態やVPCなどのインフラストラクチャなど、アプリケーションが依存するものです (インフラとデータのセクションも参照)。

エージェントは、シグナルを収集して取り込むためのテレメトリの一部です。
もう一方の部分は、インストルメント化されたアプリケーションとデータベースなどのインフラ部品です。

## 言語

この次元は、サービスやアプリケーションを記述するためのプログラミング言語に関係しています。ここでは、[X-Ray SDK][xraysdks] や OpenTelemetry が [インストルメンテーション][otelinst] の文脈で提供するものなど、SDK やライブラリを扱います。ログやメトリクスなどの特定のシグナルタイプに対して、選択したプログラミング言語をサポートする o11y ソリューションであることを確認する必要があります。

## インフラストラクチャとデータベース

この次元では、サービスが実行されている VPC のようなインフラストラクチャ、RDS や DynamoDB のようなデータストア、SQS のようなキューなど、アプリケーション外部の依存関係のあらゆる種類を意味します。

tip
    "共通点"
    この次元のすべてのソースに共通しているのは、アプリケーション (およびアプリが実行されるコンピューティング環境) の外部に存在し、不透明なボックスとして扱わなければならないことです。


この次元には以下が含まれますが、これらに限定されません。

- [VPC フローログ][vpcfl] などの AWS インフラストラクチャ。
- [Kubernetes コントロールプレーンログ][kubecpl] などのセカンダリ API。
- [S3][s3mon]、[RDS][rdsmon]、[SQS][sqstrace] などのデータストアからのシグナル。

## コンピューティングユニット

コードをパッケージ化、スケジューリング、実行する方法です。例えば、Lambda では関数、[ECS][ecs] と [EKS][eks] ではそれぞれタスク (ECS) またはポッド (EKS) 内で実行されるコンテナがユニットになります。Kubernetes のようなコンテナ化された環境では、テレメトリのデプロイについて、サイドカーとしてまたはノード (インスタンス) ごとのデーモンプロセスとして、2 つの選択肢があることが多いです。

## コンピューティングエンジン

この次元は、基盤となる実行環境を指します。EC2 インスタンスの場合はプロビジョニングとパッチ適用が必要ですが、Fargate や Lambda などのサーバーレスオファリングの場合は必要ありません。使用するコンピューティングエンジンによっては、テレメトリ部分がすでにオファリングに含まれている場合があります。たとえば、[EKS on Fargate][firelensef] には Fluent Bit による Log ルーティングが統合されています。

[aes]: https://aws.amazon.com/jp/elasticsearch-service/ "Amazon Elasticsearch Service"
[adot]: https://aws-otel.github.io/ "AWS Distro for OpenTelemetry"
[amg]: https://aws.amazon.com/jp/grafana/ "Amazon Managed Grafana"
[amp]: https://aws.amazon.com/jp/prometheus/ "Amazon Managed Service for Prometheus"
[batch]: https://aws.amazon.com/jp/batch/ "AWS Batch"
[beans]: https://aws.amazon.com/jp/elasticbeanstalk/ "AWS Elastic Beanstalk"
[cw]: https://aws.amazon.com/jp/cloudwatch/ "Amazon CloudWatch"
[dimensions]: ../dimensions
[ec2]: https://aws.amazon.com/jp/ec2/ "Amazon EC2"
[ecs]: https://aws.amazon.com/jp/ecs/ "Amazon Elastic Container Service"
[eks]: https://aws.amazon.com/jp/eks/ "Amazon Elastic Kubernetes Service"
[fargate]: https://aws.amazon.com/jp/fargate/ "AWS Fargate"
[fluentbit]: https://fluentbit.io/ "Fluent Bit"
[firelensef]: https://aws.amazon.com/blogs/containers/fluent-bit-for-amazon-eks-on-aws-fargate-is-here/ "Fluent Bit for Amazon EKS on AWS Fargate is here"
[jaeger]: https://www.jaegertracing.io/ "Jaeger"
[kafka]: https://kafka.apache.org/ "Apache Kafka"
[kubecpl]: https://docs.aws.amazon.com/ja_jp/eks/latest/userguide/control-plane-logs.html "Amazon EKS control plane logging"
[lambda]: https://aws.amazon.com/jp/lambda/ "AWS Lambda"
[lightsail]: https://aws.amazon.com/jp/lightsail/ "Amazon Lightsail"
[otel]: https://opentelemetry.io/ "OpenTelemetry"
[otelinst]: https://opentelemetry.io/docs/concepts/instrumenting/
[promex]: https://prometheus.io/docs/instrumenting/exporters/ "Prometheus exporters and integrations"
[rdsmon]: https://docs.aws.amazon.com/ja_jp/AmazonRDS/latest/UserGuide/Overview.LoggingAndMonitoring.html "Logging and monitoring in Amazon RDS"
[s3]: https://aws.amazon.com/jp/s3/ "Amazon S3"
[s3mon]: https://docs.aws.amazon.com/ja_jp/AmazonS3/latest/userguide/s3-incident-response.html "Logging and monitoring in Amazon S3"
[sqstrace]: https://docs.aws.amazon.com/ja_jp/xray/latest/devguide/xray-services-sqs.html "Amazon SQS and AWS X-Ray"
[vpcfl]: https://docs.aws.amazon.com/ja_jp/vpc/latest/userguide/flow-logs.html "VPC Flow Logs"
[xray]: https://aws.amazon.com/jp/xray/ "AWS X-Ray"
[xraysdks]: https://docs.aws.amazon.com/ja_jp/xray/index.html

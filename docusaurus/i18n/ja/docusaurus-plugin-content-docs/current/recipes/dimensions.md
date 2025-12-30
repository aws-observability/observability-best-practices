# ディメンション

このサイトのコンテキストでは、o11y 空間を 6 つの次元に沿って考えます。各次元を独立して見ることは、合成的な観点から有益です。つまり、特定のワークロードに対して具体的な o11y ソリューションを構築しようとする場合、使用するプログラミング言語などの開発者関連の側面や、コンテナや Lambda 関数などのランタイム環境といった運用トピックにまたがります。

![o11y space](images/o11y-space.png)


:::note
    「シグナルとは何ですか？」
    ここでシグナルと言う場合、ログエントリ、メトリクス、トレースを含む、あらゆる種類の o11y データおよびメタデータポイントを意味します。より具体的にする必要がある場合や、そうしなければならない場合を除き、「シグナル」という用語を使用します。どのような制限が適用されるかは、文脈から明らかになるはずです。
:::

それでは、6 つのディメンションをそれぞれ見ていきましょう。

## 送信先

この次元では、長期保存や、シグナルを利用できるグラフィカルインターフェイスを含む、あらゆる種類のシグナルの送信先を考慮します。開発者として、サービスのトラブルシューティングのためにシグナルを検出、検索、相関付けできる UI または API へのアクセスが必要です。インフラストラクチャまたはプラットフォームの役割では、インフラストラクチャの状態を把握するためにシグナルを管理、検出、検索、相関付けできる UI または API へのアクセスが必要です。

![Grafana screen shot](images/grafana.png)

最終的に、これは人間の観点から最も興味深い側面です。
ただし、メリットを享受するためには、まず少し作業に投資する必要があります。ソフトウェアと外部依存関係を計装し、シグナルを宛先に取り込む必要があります。

では、シグナルはどのようにして宛先に到達するのでしょうか？良い質問ですね。それは…

## エージェント

シグナルがどのように収集され、分析にルーティングされるか。シグナルは 2 つのソースから取得できます。アプリケーションのソースコード (言語セクションも参照) から取得するか、データストアで管理される状態や VPC などのインフラストラクチャなど、アプリケーションが依存するものから取得します (インフラ & データセクションも参照)。

エージェントは、シグナルを収集して取り込むために使用するテレメトリの一部です。もう一つの部分は、計装されたアプリケーションとデータベースのようなインフラストラクチャ要素です。

## 言語

この側面は、サービスやアプリケーションの記述に使用するプログラミング言語に関係します。ここでは、[X-Ray SDK][xraysdks] や OpenTelemetry が[インストルメンテーション][otelinst]のコンテキストで提供するものなど、SDK やライブラリを扱います。ログやメトリクスなどの特定のシグナルタイプについて、o11y ソリューションが選択したプログラミング言語をサポートしていることを確認する必要があります。

## インフラストラクチャとデータベース

この次元は、サービスが実行されている VPC などのインフラストラクチャ、RDS や DynamoDB などのデータストア、SQS などのキューなど、あらゆる種類のアプリケーション外部の依存関係を意味します。 

:::tip
    「共通点」
    このディメンションのすべてのソースに共通することの 1 つは、それらがアプリケーションの外部に配置されている（およびアプリが実行されるコンピューティング環境の外部にも配置されている）ことであり、そのため、それらを不透明なボックスとして扱う必要があります。
:::

このディメンションには以下が含まれますが、これらに限定されません。

- AWS インフラストラクチャ、例えば [VPC フローログ][vpcfl]
- [Kubernetes コントロールプレーンログ][kubecpl]などのセカンダリ API
- [S3][s3mon]、[RDS][rdsmon]、[SQS][sqstrace]などのデータストアからのシグナル


## コンピューティングユニット

コードをパッケージ化、スケジュール、実行する方法。例えば、Lambda では関数であり、[ECS][ecs] や [EKS][eks] では、それぞれタスク (ECS) またはポッド (EKS) で実行されるコンテナがその単位となります。Kubernetes のようなコンテナ化された環境では、テレメトリのデプロイに関して、サイドカーとして、またはノード (インスタンス) ごとのデーモンプロセスとしての 2 つのオプションが用意されていることがよくあります。

## コンピューティングエンジン

この次元は、基盤となるランタイム環境を指します。これは、プロビジョニングとパッチ適用の責任がユーザーにある場合（例：EC2 インスタンス）と、ない場合（Fargate や Lambda などのサーバーレスオファリング）があります。使用するコンピューティングエンジンによっては、テレメトリ部分がすでにオファリングの一部になっている場合があります。例えば、[EKS on Fargate][firelensef] では、Fluent Bit 経由のログルーティングが統合されています。


[aes]: https://aws.amazon.com/elasticsearch-service/ "Amazon Elasticsearch Service"
[adot]: https://aws-otel.github.io/ "AWS Distro for OpenTelemetry"
[amg]: https://aws.amazon.com/grafana/ "Amazon Managed Grafana"
[amp]: https://aws.amazon.com/prometheus/ "Amazon Managed Service for Prometheus"
[batch]: https://aws.amazon.com/batch/ "AWS Batch"
[beans]: https://aws.amazon.com/elasticbeanstalk/ "AWS Elastic Beanstalk"
[cw]: https://aws.amazon.com/cloudwatch/ "Amazon CloudWatch"
[dimensions]: ../dimensions
[ec2]: https://aws.amazon.com/ec2/ "Amazon EC2"
[ecs]: https://aws.amazon.com/ecs/ "Amazon Elastic Container Service"
[eks]: https://aws.amazon.com/eks/ "Amazon Elastic Kubernetes Service"
[fargate]: https://aws.amazon.com/fargate/ "AWS Fargate"
[fluentbit]: https://fluentbit.io/ "Fluent Bit"
[firelensef]: https://aws.amazon.com/blogs/containers/fluent-bit-for-amazon-eks-on-aws-fargate-is-here/ "Fluent Bit for Amazon EKS on AWS Fargate is here"
[jaeger]: https://www.jaegertracing.io/ "Jaeger"
[kafka]: https://kafka.apache.org/ "Apache Kafka"
[kubecpl]: https://docs.aws.amazon.com/eks/latest/userguide/control-plane-logs.html "Amazon EKS control plane logging"
[lambda]: https://aws.amazon.com/lambda/ "AWS Lambda"
[lightsail]: https://aws.amazon.com/lightsail/ "Amazon Lightsail"
[otel]: https://opentelemetry.io/ "OpenTelemetry"
[otelinst]: https://opentelemetry.io/docs/concepts/instrumenting/
[promex]: https://prometheus.io/docs/instrumenting/exporters/ "Prometheus exporters and integrations"
[rdsmon]: https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/Overview.LoggingAndMonitoring.html "Logging and monitoring in Amazon RDS"
[s3]: https://aws.amazon.com/s3/ "Amazon S3"
[s3mon]: https://docs.aws.amazon.com/AmazonS3/latest/userguide/s3-incident-response.html "Logging and monitoring in Amazon S3"
[sqstrace]: https://docs.aws.amazon.com/xray/latest/devguide/xray-services-sqs.html "Amazon SQS and AWS X-Ray"
[vpcfl]: https://docs.aws.amazon.com/vpc/latest/userguide/flow-logs.html "VPC Flow Logs"
[xray]: https://aws.amazon.com/xray/ "AWS X-Ray"
[xraysdks]: https://docs.aws.amazon.com/xray/index.html

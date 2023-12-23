# サービスレベル目標(SLO)

高可用性とレジリエンスのあるアプリケーションは、貴社の重要なビジネスドライバーですか?**?**
答えが「**はい**」の場合は、読み進めてください。

障害は避けられません。すべてのものは時間とともに最終的には故障します。これは、スケールする必要があるアプリケーションを構築する場合に、さらに重要な教訓となります。ここで SLO の重要性が出てきます。

SLO は、重要なエンドユーザージャーニーに基づいて、サービスの可用性について合意された目標値を測定します。その合意された目標は、お客様やエンドユーザーにとって何が重要かに基づいて策定する必要があります。このようなレジリエントなエコシステムを構築するには、意味のある現実的で実行可能な SLO を使用して、パフォーマンスを客観的に測定し、信頼性を正確に報告する必要があります。さあ、重要なサービスレベルの用語に慣れ親しみましょう。

## サービスレベルの用語

- SLI(Service Level Indicator)は、提供されるサービスレベルのある側面を定量的に測定したものです。

- SLO(Service Level Objective)は、ある期間にわたってSLIによって測定されたサービスレベルの目標値または値の範囲です。

- SLA(Service Level Agreement)は、SLOを満たせなかった場合の結果を含む、顧客との合意です。

次の図は、SLA は「約束/合意」、SLO は「目標値」、SLI は「サービスのパフォーマンス」の測定であることを示しています。

![SLO データフロー](../images/slo.png)

### AWSにはこれらすべてを監視するツールがありますか?

答えは「**はい**」です!

[Amazon CloudWatch Application Signals](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-Application-Monitoring-Sections.html) は、AWS 上のアプリケーションを自動的に計装して運用するのを簡単にする新機能です。Application Signals はアプリケーションを計装することで、アプリケーションの正常性を監視し、ビジネス目標に対するパフォーマンスを追跡できるようにします。Application Signals は、アプリケーション、サービス、依存関係の統合されたアプリケーション中心のビューを提供し、アプリケーションの正常性の監視とトライアージを支援します。Application Signals は Amazon EKS、Amazon ECS、Amazon EC2 でサポートされており、記事作成時点では Java アプリケーションのみをサポートしています。

Application Signals は、重要なパフォーマンスメトリクスに対して SLO を設定するのに役立ちます。重要なビジネスオペレーションのサービスに対して SLO を作成できます。これらのサービスに SLO を設定することで、SLO ダッシュボードで追跡できるようになり、最も重要なオペレーションが一目でわかるようになります。根本原因の特定を高速化するために、Application Signals は CloudWatch Synthetics からの追加のパフォーマンスシグナルを統合したアプリケーションパフォーマンスの包括的なビューを提供します。これにより、重要な API とユーザーインタラクションを監視できます。また、CloudWatch RUM により、リアルユーザーのパフォーマンスを監視できます。

Application Signals は、発見したすべてのサービスと操作の待ち時間と可用性メトリクスを自動的に収集し、これらのメトリクスは SLI として使用するのに適していることがよくあります。同時に、Application Signals は任意の CloudWatch メトリクスまたはメトリック式を SLI として使用する柔軟性を提供します。

Application Signals は、Amazon EKS 上で実行されているアプリケーションのメトリクス、トレース、ログ、リアルユーザーモニタリング、および合成モニタリングを相関させることで、アプリケーションパフォーマンスのベストプラクティスに基づいてアプリケーションを自動的に計装します。 詳細は、この[ブログ](https://aws.amazon.com/blogs/aws/amazon-cloudwatch-application-signals-for-automatic-instrumentation-of-your-applications-preview/)をご覧ください。

CloudWatch Application Signals で SLO を設定してサービスの信頼性を監視する方法については、この[ブログ](https://aws.amazon.com/blogs/mt/how-to-monitor-application-health-using-slos-with-amazon-cloudwatch-application-signals/)を確認してください。

オブザーバビリティは、信頼できるサービスを確立するための基盤であり、組織が大規模に効果的に運用できるようにする上で重要な要素です。 [Amazon CloudWatch Application Signals](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-Application-Monitoring-Sections.html) は、その目標を達成するのに役立つ素晴らしいツールになると信じています。

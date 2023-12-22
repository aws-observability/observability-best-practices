# サービスレベル目標(SLO)

高可用性とレジリエンスのあるアプリケーションは、貴社の重要なビジネスドライバーですか?**?**
答えが「**はい**」の場合は、読み進めてください。

障害は避けられません。そして、すべてのものは時間の経過とともに必ず故障します! これは、スケールする必要があるアプリケーションを構築する場合、特に重要な教訓となります。ここで SLO の重要性が出てきます。  

SLO は、重要なエンドユーザージャーニーに基づいて、サービスの可用性の合意された目標値を測定します。その合意された目標値は、お客様やエンドユーザーにとって何が重要かに基づいて設定する必要があります。このようなレジリエントなエコシステムを構築するには、パフォーマンスを客観的に測定し、意味のある現実的で実行可能な SLO を使用して信頼性を正確に報告する必要があります。さあ、主要なサービスレベルの用語について理解を深めましょう。

## サービスレベルの用語

- SLI はサービスレベルインジケーターで、提供されるサービスレベルのある側面を定量的に測定したものです。

- SLO はサービスレベルオブジェクティブで、SLI によって測定されるサービスレベルの目標値または値の範囲を一定期間にわたって示したものです。

- SLA はサービスレベルアグリーメントで、SLO を含み、それを満たせなかった場合の結果を顧客との間で取り決めたものです。

次の図は、SLA が「約束/合意」であり、SLO が「目標値/目標範囲」であり、SLI は「サービスのパフォーマンスはどうだったか」を測定したものであることを示しています。

![SLO データフロー](../images/slo.png)

### これを監視する AWS のツールはありますか?

答えは「**はい**」です!

[Amazon CloudWatch Application Signals](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-Application-Monitoring-Sections.html) は、AWS 上のアプリケーションを自動的に計装して運用するのを簡単にする新機能です。Application Signals は AWS 上のアプリケーションを計装することで、アプリケーションの健全性を監視し、ビジネス目標に対するパフォーマンスを追跡できるようにします。Application Signals は、アプリケーション、サービス、依存関係の統合されたアプリケーション中心のビューを提供し、アプリケーションの健全性の監視とトライアージを支援します。この記事の執筆時点では、Application Signals は Amazon EKS、Amazon ECS、Amazon EC2 でサポートされており、Java アプリケーションのみをサポートしています。

Application Signals は、重要なパフォーマンスメトリクスに対して SLO を設定するのに役立ちます。クリティカルなビジネスオペレーションのサービスに対して、サービスレベル目標を作成できます。これらのサービスに対して SLO を作成することで、SLO ダッシュボードで追跡できるようになり、最も重要なオペレーションの一目でわかるビューが得られます。根本原因の特定を速めるために、Application Signals は CloudWatch Synthetics(クリティカルな API とユーザー操作を監視)と CloudWatch RUM(リアルユーザーのパフォーマンスを監視)からの追加のパフォーマンス信号を統合した、アプリケーションパフォーマンスの包括的なビューを提供します。

Application Signals は、発見したすべてのサービスと操作の待ち時間と可用性メトリクスを自動的に収集し、これらのメトリクスは SLI として使用するのに適していることがよくあります。同時に、Application Signals は、CloudWatch メトリクスまたはメトリクス式を SLI として使用する柔軟性も提供します。

Application Signals は、Amazon EKS 上で実行されているアプリケーションのメトリクス、トレース、ログ、リアルユーザーモニタリング、合成モニタリング間でテレメトリを相関させることにより、アプリケーションパフォーマンスのベストプラクティスに基づいてアプリケーションを自動的に計装します。 詳細は、この[ブログ](https://aws.amazon.com/blogs/aws/amazon-cloudwatch-application-signals-for-automatic-instrumentation-of-your-applications-preview/)をご覧ください。

サービスの信頼性を監視するために CloudWatch Application Signals で SLO を設定する方法については、この[ブログ](https://aws.amazon.com/blogs/mt/how-to-monitor-application-health-using-slos-with-amazon-cloudwatch-application-signals/)をご覧ください。

オブザーバビリティは、信頼できるサービスを確立するための基盤的な要素であり、組織がスケールで効果的に運用できるようにする上で大きな一歩となります。 [Amazon CloudWatch Application Signals](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-Application-Monitoring-Sections.html) は、その目標を達成するのに役立つ素晴らしいツールになると信じています。

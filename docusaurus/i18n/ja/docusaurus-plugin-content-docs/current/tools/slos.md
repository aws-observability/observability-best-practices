# Service Level Objectives (SLOs)

高可用性と回復力のあるアプリケーションは、あなたの会社にとってアクティブなビジネスドライバーですか？
答えが「**はい**」の場合は、読み進めてください。

障害は必ず発生し、すべてのものは時間とともに最終的に故障します！これは、スケールする必要のあるアプリケーションを構築する際には、さらに重要な教訓となります。ここで SLOs の重要性が出てきます。

SLOs は、重要なエンドユーザージャーニーに基づいて、サービスの可用性に関して合意された目標を測定します。その合意された目標は、お客様やエンドユーザーにとって重要な事項を中心に設定される必要があります。このような回復力のあるエコシステムを構築するには、意味のある、現実的で、実行可能な SLOs を使用して、パフォーマンスを客観的に測定し、信頼性を正確に報告する必要があります。それでは、主要なサービスレベルの用語について理解を深めていきましょう。



## サービスレベルの用語

- SLI (Service Level Indicator): 提供されるサービスレベルの特定の側面を、慎重に定義された定量的な指標です。

- SLO (Service Level Objective): SLI によって測定されるサービスレベルの目標値または値の範囲で、一定期間にわたって測定されます。

- SLA (Service Level Agreement): SLO が未達成の場合の結果を含む、お客様との契約です。

次の図は、SLA が「約束/契約」、SLO が「目標/目標値」、SLI が「サービスがどのように機能したか」の測定であることを示しています。

![SLO data flow](../images/slo.png)




### これらすべてを監視する AWS のツールはありますか？

答えは「**はい**」です！

[Amazon CloudWatch Application Signals](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/CloudWatch-Application-Monitoring-Sections.html) は、AWS 上のアプリケーションを自動的に計測し、運用することを容易にする新しい機能です。Application Signals は AWS 上のアプリケーションを計測し、アプリケーションの健全性を監視し、ビジネス目標に対するパフォーマンスを追跡できるようにします。Application Signals は、アプリケーション、サービス、依存関係の統合されたアプリケーション中心のビューを提供し、アプリケーションの健全性の監視とトリアージを支援します。Application Signals は Amazon EKS、Amazon ECS、Amazon EC2 でサポートされ、テストされていますが、この記事の執筆時点では Java アプリケーションのみをサポートしています！

Application Signals は、主要なパフォーマンスメトリクスに対する SLO の設定を支援します。重要なビジネスオペレーションのサービスに対して Service Level Objective を作成することができます。これらのサービスに SLO を作成することで、SLO ダッシュボードで追跡でき、最も重要なオペレーションを一目で確認できます。根本原因の特定を迅速化するために、Application Signals は、重要な API とユーザーインタラクションを監視する CloudWatch Synthetics や、実際のユーザーパフォーマンスを監視する CloudWatch RUM からの追加のパフォーマンスシグナルを統合した、包括的なアプリケーションパフォーマンスビューを提供します。

Application Signals は、検出したすべてのサービスとオペレーションのレイテンシーと可用性メトリクスを自動的に収集し、これらのメトリクスは SLI として使用するのに理想的です。同時に、Application Signals は、任意の CloudWatch メトリクスまたはメトリクス式を SLI として使用する柔軟性も提供します！

Application Signals は、アプリケーションパフォーマンスのベストプラクティスに基づいてアプリケーションを自動的に計測し、Amazon EKS 上で実行されているアプリケーションのメトリクス、トレース、ログ、実ユーザーモニタリング、合成モニタリングにわたるテレメトリを相関付けます。詳細については、この[ブログ](https://aws.amazon.com/jp/blogs/news/amazon-cloudwatch-application-signals-for-automatic-instrumentation-of-your-applications-preview/)をお読みください。

CloudWatch Application Signals で SLO を設定してサービスの信頼性を監視する方法については、この[ブログ](https://aws.amazon.com/blogs/mt/how-to-monitor-application-health-using-slos-with-amazon-cloudwatch-application-signals/)をご覧ください。

オブザーバビリティは、信頼性の高いサービスを確立するための基礎的な要素であり、組織が効果的にスケールして運用するための道を開きます。私たちは、[Amazon CloudWatch Application Signals](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/CloudWatch-Application-Monitoring-Sections.html) がそのゴールを達成するための素晴らしいツールになると信じています。

# サービスレベル目標 (SLOs)

高可用性と回復力のあるアプリケーションは、あなたの会社にとってビジネス上の重要な課題ですか? もしそうであれば、読み続けてください。

障害は避けられず、いずれすべてが時間とともに失敗します! これは、スケーリングが必要なアプリケーションを構築する際に、さらに重要な教訓となります。ここに SLO の重要性があります。

SLO は、重要なエンドユーザーの体験に基づいてサービスの可用性目標を合意したものを測定します。この合意された目標は、お客様/エンドユーザーにとって重要なことを中心に作成する必要があります。そのような回復力のあるエコシステムを構築するには、パフォーマンスを客観的に測定し、意味のある、現実的で実行可能な SLO を使用して信頼性を正確に報告する必要があります。さて、主要なサービスレベル用語に慣れ親しみましょう。

## サービスレベル用語

- SLI (Service Level Indicator) は、提供されるサービスレベルのある側面を慎重に定義された定量的な測定値です。

- SLO (Service Level Objective) は、一定期間にわたって SLI で測定されるサービスレベルの目標値または値の範囲です。

- SLA (Service Level Agreement) は、含まれる SLO を満たせなかった場合の影響を含む、お客様との合意です。

次の図は、SLA が「約束/合意」、SLO が「目標/目標値」、SLI が「サービスの実績はどうだったか」の測定値であることを示しています。

![SLO data flow](../images/slo.png)

### これらすべてを監視する AWS のツールはありますか?

答えは「**はい**」です!

[Amazon CloudWatch Application Signals](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/CloudWatch-Application-Monitoring-Sections.html) は、AWS 上のアプリケーションを自動的にインストゥルメント化し、運用するのを簡単にする新機能です。Application Signals は、AWS 上のアプリケーションをインストゥルメント化し、アプリケーションの健全性を監視し、ビジネス目標に対するパフォーマンスを追跡できるようにします。Application Signals は、アプリケーション、サービス、依存関係の統合されたアプリケーション中心のビューを提供し、アプリケーションの健全性を監視し、トリアージを支援します。Application Signals は、Amazon EKS、Amazon ECS、Amazon EC2 でサポートされテストされており、執筆時点では Java アプリケーションのみをサポートしています!

Application Signals は、重要なパフォーマンスメトリクスに SLO を設定するのを支援します。重要なビジネスオペレーションのサービスに対して、サービスレベル目標を作成できます。これらのサービスに SLO を作成することで、SLO ダッシュボードで追跡でき、最も重要なオペレーションの概要を一目で確認できます。根本原因の特定を迅速化するため、Application Signals は、重要な API とユーザー インタラクションを監視する CloudWatch Synthetics、および実際のユーザーパフォーマンスを監視する CloudWatch RUM からの追加のパフォーマンスシグナルを統合し、アプリケーションのパフォーマンスの包括的なビューを提供します。

Application Signals は、発見したすべてのサービスとオペレーションの待ち時間と可用性のメトリクスを自動的に収集し、これらのメトリクスは SLI として使用するのに最適です。同時に、Application Signals は、CloudWatch のメトリクスやメトリクス式を SLI として使用する柔軟性も提供します!

Application Signals は、Amazon EKS 上で実行されるアプリケーションのベストプラクティスに基づいてアプリケーションを自動的にインストゥルメント化し、メトリクス、トレース、ログ、実際のユーザーモニタリング、合成モニタリングにわたるテレメトリを相関させます。詳細については、この[ブログ](https://aws.amazon.com/jp/blogs/news/amazon-cloudwatch-application-signals-for-automatic-instrumentation-of-your-applications-preview/)を読んでください。

CloudWatch Application Signals で SLO を設定してサービスの信頼性を監視する方法については、この[ブログ](https://aws.amazon.com/blogs/mt/how-to-monitor-application-health-using-slos-with-amazon-cloudwatch-application-signals/)を参照してください。

オブザーバビリティは、信頼できるサービスを確立するための基盤要素であり、組織がスケールに応じて効果的に運用できるようになります。[Amazon CloudWatch Application Signals](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/CloudWatch-Application-Monitoring-Sections.html) は、その目標を達成するのに役立つ素晴らしいツールになると考えています。

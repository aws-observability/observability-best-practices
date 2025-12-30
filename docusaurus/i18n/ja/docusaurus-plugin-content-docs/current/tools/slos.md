# サービスレベル目標 (SLO)

高可用性と回復力のあるアプリケーションは、貴社にとって積極的なビジネス推進要因ですか**？**  
答えが「**はい**」の場合は、読み続けてください。

障害は避けられないものであり、すべてのものは時間の経過とともに最終的には障害を起こします。これは、スケールする必要があるアプリケーションを構築する際に、さらに重要な教訓となります。ここで SLO の重要性が浮き彫りになります。

SLO は、重要なエンドユーザージャーニーに基づいて合意されたサービス可用性の目標を測定します。その合意された目標は、顧客やエンドユーザーにとって重要なことを中心に作成する必要があります。このような回復力のあるエコシステムを構築するには、パフォーマンスを客観的に測定し、意味のある現実的で実用的な SLO を使用して信頼性を正確に報告する必要があります。それでは、主要なサービスレベルの用語について理解を深めましょう。

## サービスレベルの用語

- SLI はサービスレベルインジケーターです。提供されるサービスレベルのある側面を慎重に定義した定量的な測定値です。

- SLO はサービスレベル目標です。一定期間にわたって SLI によって測定される、サービスレベルの目標値または値の範囲を指します。

- SLA はサービスレベルアグリーメントです。顧客との合意であり、含まれる SLO を満たさなかった場合の影響が含まれます。

次の図は、SLA が「約束/合意」であり、SLO が「目標/目標値」であり、SLI が「サービスはどのように機能したか?」の測定値であることを示しています。  

![SLO data flow](../images/slo.png)

### これらすべてを監視する AWS ツールはありますか？ 

答えは「**はい**」です！

[Amazon CloudWatch Application Signals](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-Application-Monitoring-Sections.html) は、AWS 上のアプリケーションを自動的にインストルメント化し、運用することを容易にする新しい機能です。Application Signals は AWS 上のアプリケーションをインストルメント化することで、アプリケーションの健全性を監視し、ビジネス目標に対するパフォーマンスを追跡できるようにします。Application Signals は、アプリケーション、サービス、依存関係の統合されたアプリケーション中心のビューを提供し、アプリケーションの健全性の監視とトリアージに役立ちます。Application Signals は Amazon EKS、Amazon ECS、Amazon EC2 でサポートされ、テストされています。この記事の執筆時点では、Java アプリケーションのみをサポートしています。

Application Signals は、主要なパフォーマンスメトリクスに SLO を設定するのに役立ちます。Application Signals を使用して、重要なビジネスオペレーションのサービスに対するサービスレベル目標を作成できます。これらのサービスに SLO を作成することで、SLO ダッシュボードでそれらを追跡できるようになり、最も重要なオペレーションを一目で確認できます。根本原因の特定を迅速化するために、Application Signals はアプリケーションパフォーマンスの包括的なビューを提供し、重要な API とユーザーインタラクションを監視する CloudWatch Synthetics や、実際のユーザーパフォーマンスを監視する CloudWatch RUM からの追加のパフォーマンスシグナルを統合します。

Application Signals は、検出したすべてのサービスとオペレーションのレイテンシーと可用性のメトリクスを自動的に収集します。これらのメトリクスは、SLI として使用するのに理想的です。同時に、Application Signals は、任意の CloudWatch メトリクスまたはメトリクス式を SLI として使用できる柔軟性を提供します。

Application Signals は、アプリケーションパフォーマンスのベストプラクティスに基づいてアプリケーションを自動的にインストルメント化し、Amazon EKS 上で実行されるアプリケーションのメトリクス、トレース、ログ、リアルユーザーモニタリング、および Synthetic モニタリング全体でテレメトリを関連付けます。詳細については、この[ブログ](https://aws.amazon.com/blogs/aws/amazon-cloudwatch-application-signals-for-automatic-instrumentation-of-your-applications-preview/)を参照してください。

CloudWatch Application Signals でサービスの信頼性を監視するための SLO を設定する方法については、この[ブログ](https://aws.amazon.com/blogs/mt/how-to-monitor-application-health-using-slos-with-amazon-cloudwatch-application-signals/)を参照してください。

オブザーバビリティは、信頼性の高いサービスを確立するための基盤となる要素であり、組織が大規模に効果的に運用するための道筋を示します。[Amazon CloudWatch Application Signals](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-Application-Monitoring-Sections.html) は、その目標を達成するための素晴らしいツールになると考えています。


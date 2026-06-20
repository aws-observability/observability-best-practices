# クラウドエンジニア 

複雑な AWS インフラストラクチャを管理する Cloud Engineer として、オブザーバビリティは信頼性が高く効率的な運用を維持するために不可欠です。マイクロサービス、コンテナ、サーバーレスアーキテクチャが主流となっている今日の世界では、システムを明確に可視化することが成功の鍵となります。

このガイドでは、Cloud Engineer 向けの主要なオブザーバビリティのベストプラクティスを探求し、AWS 環境を大規模に監視、トラブルシューティング、最適化するための実践的な戦略に焦点を当てています。

---

## AWS Cost Management 💸

**目標:** 支出を監視および管理することで、AWS コストを最適化します。

| Level | Category                | Description                                                        | Tips & Examples                                               | Additional Notes                    |
|-------|-------------------------|--------------------------------------------------------------------|---------------------------------------------------------------|-------------------------------------|
| **基本** | [支出の追跡](/observability-best-practices/ja/guides/cost/cost-visualization/cost) | ビジネス活動がコストに与える影響を監視するためのダッシュボードを設定します | **例:** マーケティングキャンペーンがサーバーコストに与える影響を監視します | **プロのヒント:** 基本的な日次コスト追跡から始めます  
**よくある落とし穴:** アラートの設定を怠ること |
| **Basic** | [Budget Management](/observability-best-practices/ja/guides/operational/business/key-performance-indicators)         | Establish spenditure limits to measure project costs | **Tip:** Focus on setting budgets for each department or service | **Recommendation:** Establish clear budget placements |
| **中級** | [リソースタグ付け](/observability-best-practices/ja/recipes/recipes/metrics-explorer-filter-by-tags) | チームやプロジェクトごとにリソース使用状況を追跡するためのリソースタグ付けを実装します | **クイックウィン:** まずこれらの 3 つのタグから始めましょう。  
1. Project  
2. Environment  
3. Owner | **ご存知でしたか？** タグ付けを実装することで 20～30% のコスト削減が可能です |
| **Intermediate** | [Cost & Usage Visibility](/observability-best-practices/ja/guides/cost/cost-visualization/cost)   | Ensure that you are only incurring the costs you need and that you are not overspending on resources you don't need | **Example:** Set up granular cost dashboards for better tracking | **Pro Tip:** Take into consideration the different [cost optimization tools](https://docs.aws.amazon.com/whitepapers/latest/cost-optimization-laying-the-foundation/reporting-cost-optimization-tools.html) AWS provides                                 |
| **Advanced** | [Smart Cost Management](https://community.aws/content/2muS34cXUidGfdzpd5EkpCcphLc/aws-serverless-how-to-stop-ec2-using-event-bridge-and-lambda)            | Automate tasks that will limit unnecesary spenditure | **Example:** Power off non-production servers during off hours | **Pro Tip:** Begin with non-production environments |
| **上級** | [戦略的実装](/observability-best-practices/ja/guides/operational/business/key-performance-indicators) | KPI を確立し、FinOps Foundation の原則を実装する | コスト最適化 KPI を作成し、時間の経過とともに追跡する | **プロのヒント:** 「ユニットエコノミクス」KPI から始めましょう - ビジネス出力あたりのコストを測定します (例: トランザクションあたりのコスト、顧客あたりのコスト、またはサービスあたりのコスト)。

**ご存知でしたか？** 覚えておいてください。最適な KPI は、クラウド支出をビジネス成果に直接結び付けるものであり、ROI を実証し、FinOps イニシアチブへの賛同を得やすくします。|

### 推奨事項
- **シンプルに始める**: 基本的なモニタリングから始めて、AWS ツールに慣れてきたら、より高度な手法に拡張していきます。
- **タグを効果的に使用する**: タグ付けは、コストを追跡および配分するための最も強力な方法の 1 つです。早期に実装することで、将来的に大幅な時間を節約できます。

---

## AWS パフォーマンスと可用性 🚀

**目標:** AWS でホストされているアプリケーションの最適なパフォーマンスと可用性を確保します。

| Level | Component              | Description                                                        | Tips & Examples                                               | Additional Notes                    |
|-------|------------------------|--------------------------------------------------------------------|---------------------------------------------------------------|-------------------------------------|
| **Basic** | [Watch Your Apps](/observability-best-practices/ja/tools/dashboards)          | Aggregate curated historical data and see it alongside other related data | **Example:** Check if users in different regions experience delays | **Common Pitfall:** Lack of centralization for your monitoring tools |
| **Intermediate** | [Track Connection Points](/observability-best-practices/ja/signals/traces)  | Monitor how different parts of your application communicate with each other | **Quick Win:** Start by tracking the performance of your most critical service | **Did You Know?** Most outages happen due to service-to-service communication failures |
| **Advanced** | [Test your performance](/observability-best-practices/ja/tools/synthetics)     | Test & Simulate applications from the perspective of your customer to understand their experience | **Example:** Execute synthetic tests towards your application endpoints |   **Pro Tip:** Collect client side data from user session to granular [performance insights](/observability-best-practices/ja/tools/rum)                                |
|**上級** | [可用性の目標について合意を確立し、強制する](/observability-best-practices/ja/tools/slos)     | 許容可能な健全性と可用性を確立するアプリケーションの SLO を評価する | リアルタイムモニタリングと迅速なトラブルシューティングに使用する |   **プロのヒント:** 組織のオブザーバビリティ[成熟度](/observability-best-practices/ja/guides/observability-maturity-model)を定期的に評価してください 

### 推奨事項
- **ユーザーエクスペリエンスを理解する**: サーバー側のメトリクスのみを監視するだけでは不十分です。実際のユーザーエクスペリエンスをグローバルに追跡するようにしてください。
- **主要なサービスに優先順位を付ける**: 最も重要なアプリケーションコンポーネントの監視から始め、そこから監視を拡大していきます。

---

## AWS セキュリティモニタリング 🔒

**目標:** セキュリティの脆弱性とインシデントを監視することで、AWS インフラストラクチャを保護します。

| Level | Component              | Description                                                        | Tips & Examples                                               | Additional Notes                    |
|-------|------------------------|--------------------------------------------------------------------|---------------------------------------------------------------|-------------------------------------|
| **Basic** | [Central Security Monitoring](/observability-best-practices/ja/patterns/multiaccount) | Consolidate all security logs in one central place for easy access and analysis | **Example:** Track all access to sensitive data and resources | **Pro Tip:** Start by focusing on login attempts and access patterns |
| **Intermediate** | [Expand telemetry data collection](/observability-best-practices/ja/recipes/telemetry)  | Include additional [attributes](/observability-best-practices/ja/guides/containers/oss/ecs/best-practices-metrics-collection-1) that contributes troubleshooting and auditing sessions | **Implementation:** Implement telemetry data from your applications backend code | **Example:** Send Browser name from which user has logged in from                                    |
| **Advanced** | [Change Monitoring](/observability-best-practices/ja/recipes/anomaly-detection)          | Track abrupt changes in your workloads both from internal and external sources| **Quick Win:** Set up alerts for unexpected login patterns or user activity | **Common Pitfall:** Solely depending on static alarm threshold |

### 推奨事項
- **セキュリティを優先する**: セキュリティは後回しにすべきではありません。基本的な監視から始めて、より高度な設定に進めていきます。
- **アラートを自動化する**: 異常なアクティビティに対する自動アラートを設定することで、潜在的な脅威がエスカレートする前に検出できます。

---

## ユーザーエクスペリエンスモニタリング 📈

**目標:** アプリケーションの使用状況、速度、動作を監視することで、ユーザーエクスペリエンスを最適化します。

| Level | Component              | Description                                                        | Tips & Examples                                               | Additional Notes                    |
|-------|------------------------|--------------------------------------------------------------------|---------------------------------------------------------------|-------------------------------------|
| **Basic** | [Track Page Speed](/observability-best-practices/ja/tools/rum)         | Monitor how fast your pages load for real users | **Example:** Identify if your checkout page slows down during peak traffic hours | **Pro Tip:** Focus on the most important user journeys first |
| **中級** | [外部要因の影響を受けるユーザーパターンを監視する](/observability-best-practices/ja/tools/internet_monitor) | ユーザーがサービスとやり取りする方法に影響を与える可能性のある追加要素を追跡します | **例** インターネットプロバイダーと場所  
**クイックウィン:** 基本的なページ読み込み時間の監視から始めます | **ご存知ですか？** ページ読み込み時間のわずかな遅延が、ユーザーの定着率に大きな影響を与える可能性があります |
| **Advanced** | [Deep Networking Usage Analysis](/observability-best-practices/ja/recipes/infra)       | Evaluate and Analyze deep into your network flow activity and statusm | **Example** [Network Synthetics](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/what-is-network-monitor.html) and [Network Flow Monitor](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-NetworkFlowMonitor.html) | Track deeper network interactions and user behavior |

### 推奨事項
- **主要なアクションに焦点を当てる**: 収益またはユーザー満足度に影響を与えるアクションの監視を優先します。
- **実際のユーザーインタラクションを監視する**: 合成テストのみに依存しないでください。実際のユーザーデータは、より実用的なインサイトを提供します。

---

## サーバーレスワークロード監視 ⚡

**目標:** サーバーレスアプリケーションを効果的に監視および最適化し、信頼性とコスト効率を確保します。

| Level | Component | Description | Tips & Examples | Additional Notes |
|-------|-----------|-------------|-----------------|------------------|
| **基本** | [Lambda 関数のベストプラクティス](/observability-best-practices/ja/guides/serverless/aws-native/lambda-based-observability) | コア Lambda メトリクスと実行統計を監視 | **例:** 呼び出し、期間、エラー率を追跡  
**クイックウィン:** Lambda インサイト用の CloudWatch ダッシュボードを設定 | **プロのヒント:** コールドスタートとメモリ使用率を監視してコストを最適化 |
| **中級** | [イベントソースの監視](https://docs.aws.amazon.com/lambda/latest/dg/monitoring-metrics.html) | イベントソースと統合のパフォーマンスを追跡 | **例:** SQS キューの深さ、API Gateway のレイテンシーを監視  
**クイックウィン:** 失敗したイベント用のデッドレターキューを設定 | **ご存知でしたか?** 適切なイベントソース監視により、カスケード障害を防ぐことができます |
| **上級** | [提供される要約インサイト](https://docs.aws.amazon.com/xray/latest/devguide/xray-services-lambda.html) | CloudWatch の専門的なインサイトツールを活用して、サーバーレスおよびコンテナ化されたアプリケーション全体のワークロードパフォーマンス、リソース使用率、運用パターンに関する自動化された詳細な分析を取得します。 | **例:** [Lambda Insights](/observability-best-practices/ja/guides/serverless/aws-native/lambda-based-observability#cloudwatch-lambda-insights-を使用してシステムレベルのメトリクスを監視する)  
[Container Insights](/observability-best-practices/ja/patterns/adoteksfargate)| AWS CloudFormation を使用してアカウントレベルで Lambda Insights を有効にし、すべての新しい Lambda 関数の詳細なメトリクスを自動的に収集しながら、[Contributor Insights](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/ContributorInsights.html) を使用して最も消費量の多いリソースと潜在的なボトルネックを特定します。 |

### 推奨事項
- **構造化ログの実装**: 検索性を向上させるために、一貫した JSON ログ形式を使用します
- **同時実行数の制限の監視**: 関数の同時実行数を追跡して、スロットリングを防止します
- **コストの最適化**: コスト配分タグを設定し、関数ごとのコストを監視します

---

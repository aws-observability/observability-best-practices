# クラウドエンジニア

複雑な AWS インフラストラクチャを管理するクラウドエンジニアにとって、信頼性の高い効率的な運用を維持するためにオブザーバビリティは不可欠です。
マイクロサービス、コンテナ、サーバーレスアーキテクチャが主流となった今日、システムを明確に可視化することが成功の鍵となります。

このガイドでは、クラウドエンジニアのためのオブザーバビリティのベストプラクティスを探り、スケールする AWS 環境のモニタリング、トラブルシューティング、最適化のための実践的な戦略に焦点を当てます。

---



## AWS コスト管理 💸

**目標：** 支出を監視・管理して AWS コストを最適化する。

| レベル | カテゴリ | 説明 | ヒントと例 | 追加情報 |
|-------|---------|------|------------|-----------|
| **基本** | [支出の追跡](https://aws-observability.github.io/observability-best-practices/guides/cost/cost-visualization/cost) | ビジネス活動がコストに与える影響を監視するためのダッシュボードを設定 | **例：** マーケティングキャンペーンがサーバーコストに与える影響を監視 | **プロのヒント：** 基本的な日次コスト追跡から始める  
**よくある失敗：** アラートを設定しないこと |
| **基本** | [予算管理](https://aws-observability.github.io/observability-best-practices/guides/operational/business/key-performance-indicators) | プロジェクトコストを測定するための支出制限を設定 | **ヒント：** 各部門やサービスごとの予算設定に焦点を当てる | **推奨事項：** 明確な予算配分を確立する |
| **中級** | [リソースタグ付け](https://aws-observability.github.io/observability-best-practices/recipes/recipes/metrics-explorer-filter-by-tags) | チームやプロジェクトごとのリソース使用状況を追跡するためのタグ付けを実装 | **クイックウィン：** 以下の 3 つのタグから始める：  
1. プロジェクト  
2. 環境  
3. オーナー | **ご存知ですか？** タグ付けを実装することで 20-30% のコスト削減が可能です |
| **中級** | [コストと使用状況の可視化](https://aws-observability.github.io/observability-best-practices/guides/cost/cost-visualization/cost) | 必要なコストのみを発生させ、不要なリソースに過剰な支出をしていないことを確認 | **例：** より詳細なコスト追跡のためのダッシュボードを設定 | **プロのヒント：** AWS が提供する様々な[コスト最適化ツール](https://docs.aws.amazon.com/ja_jp/whitepapers/latest/cost-optimization-laying-the-foundation/reporting-cost-optimization-tools.html)を考慮する |
| **上級** | [スマートなコスト管理](https://community.aws/content/2muS34cXUidGfdzpd5EkpCcphLc/aws-serverless-how-to-stop-ec2-using-event-bridge-and-lambda) | 不要な支出を制限するタスクを自動化 | **例：** 非本番環境のサーバーを営業時間外に停止 | **プロのヒント：** 非本番環境から始める |
| **上級** | [戦略的実装](https://aws-observability.github.io/observability-best-practices/guides/operational/business/key-performance-indicators) | KPI を確立し、FinOps Foundation の原則を実装 | コスト最適化 KPI を作成し、時間とともに追跡 | **プロのヒント：**「ユニットエコノミクス」KPI から始める - ビジネスアウトプットあたりのコスト（取引あたりのコスト、顧客あたりのコスト、サービスあたりのコストなど）を測定する。  

**ご存知ですか？** 覚えておいてください：最適な KPI は、クラウド支出をビジネス成果に直接結びつけるものです。これにより、ROI の実証が容易になり、FinOps イニシアチブへの賛同を得やすくなります。 |




### 推奨事項：
- **シンプルに始める**：基本的なモニタリングから始め、AWS ツールに慣れてきたら、より高度なテクニックに拡張していきます。
- **タグを効果的に使用する**：タグ付けは、コストを追跡し割り当てるための最も効果的な方法の 1 つです。早期に導入することで、将来的に大幅な時間の節約になります。

---




## AWS のパフォーマンスと可用性 🚀

**目標：** AWS でホストされているアプリケーションの最適なパフォーマンスと可用性を確保します。

| レベル | コンポーネント              | 説明                                                        | ヒントと例                                               | 追加の注意事項                    |
|-------|------------------------|--------------------------------------------------------------------|---------------------------------------------------------------|-------------------------------------|
| **基本** | [アプリケーションの監視](https://aws-observability.github.io/observability-best-practices/tools/dashboards)          | 厳選された履歴データを集約し、他の関連データと並べて表示 | **例：** 異なるリージョンのユーザーが遅延を経験しているかを確認 | **よくある落とし穴：** 監視ツールの一元化が不足している |
| **中級** | [接続ポイントの追跡](https://aws-observability.github.io/observability-best-practices/signals/traces)  | アプリケーションの異なる部分がどのように通信しているかを監視 | **クイックウィン：** 最も重要なサービスのパフォーマンス追跡から始める | **ご存知ですか？** ほとんどの障害はサービス間通信の失敗によって発生します |
| **上級** | [パフォーマンスのテスト](https://aws-observability.github.io/observability-best-practices/tools/synthetics)     | 顧客の視点からアプリケーションをテストおよびシミュレートして、その体験を理解 | **例：** アプリケーションのエンドポイントに対して合成テストを実行 | **プロのヒント：** ユーザーセッションからきめ細かな [パフォーマンスインサイト](https://aws-observability.github.io/observability-best-practices/tools/rum) のためのクライアントサイドデータを収集 |
| **上級** | [可用性の目標を設定し実施](https://aws-observability.github.io/observability-best-practices/tools/slos)     | アプリケーションの許容可能な健全性と可用性を確立する SLO を評価 | リアルタイムモニタリングとクイックトラブルシューティングに使用 | **プロのヒント：** 組織のオブザーバビリティの [成熟度](https://aws-observability.github.io/observability-best-practices/guides/observability-maturity-model) を定期的に評価




### 推奨事項：
- **ユーザーエクスペリエンスを理解する**：サーバーサイドのメトリクスだけをモニタリングするのは十分ではありません。グローバルに実際のユーザーエクスペリエンスを追跡するようにしてください。
- **重要なサービスを優先する**：最も重要なアプリケーションコンポーネントのモニタリングから始め、そこからモニタリングを拡張していきます。

---




## AWS セキュリティモニタリング 🔒

**目標：** セキュリティの脆弱性とインシデントをモニタリングして AWS インフラストラクチャを保護します。

| レベル | コンポーネント | 説明 | ヒントと例 | 追加のメモ |
|-------|--------------|------|------------|------------|
| **基本** | [セキュリティの一元管理](https://aws-observability.github.io/observability-best-practices/patterns/multiaccount) | すべてのセキュリティログを 1 か所に集約し、簡単にアクセスして分析できるようにします | **例：** 機密データとリソースへのすべてのアクセスを追跡 | **プロのヒント：** ログイン試行とアクセスパターンの追跡から始めましょう |
| **中級** | [テレメトリーデータ収集の拡張](https://aws-observability.github.io/observability-best-practices/recipes/telemetry) | トラブルシューティングと監査セッションに役立つ追加の[属性](https://aws-observability.github.io/observability-best-practices/guides/containers/oss/ecs/best-practices-metrics-collection-1)を含めます | **実装：** アプリケーションのバックエンドコードからテレメトリーデータを実装 | **例：** ユーザーがログインしたブラウザ名を送信 |
| **上級** | [変更のモニタリング](https://aws-observability.github.io/observability-best-practices/recipes/anomaly-detection) | 内部および外部のソースからのワークロードの急激な変更を追跡します | **クイックウィン：** 予期しないログインパターンやユーザーアクティビティのアラートを設定 | **よくある落とし穴：** 静的なアラームしきい値のみに依存すること |



### 推奨事項：
- **セキュリティを優先する**：セキュリティは後回しにしてはいけません。基本的なモニタリングから始めて、より高度な設定へと進めていきます。
- **アラートを自動化する**：異常な活動に対する自動アラートを設定することで、脅威が拡大する前に検知することができます。

---



## ユーザーエクスペリエンスのモニタリング 📈

**目標:** アプリケーションの使用状況、速度、動作をモニタリングしてユーザーエクスペリエンスを最適化します。

| レベル | コンポーネント              | 説明                                                        | ヒントと例                                                    | 追加情報                    |
|-------|------------------------|--------------------------------------------------------------------|---------------------------------------------------------------|-------------------------------------|
| **基本** | [ページ速度の追跡](https://aws-observability.github.io/observability-best-practices/tools/rum)         | 実際のユーザーに対するページの読み込み速度をモニタリング | **例:** トラフィックのピーク時に決済ページが遅くなっていないか確認 | **プロのヒント:** 最も重要なユーザージャーニーから始める |
| **中級** | [外部要因の影響を受けるユーザーパターンの監視](https://aws-observability.github.io/observability-best-practices/tools/internet_monitor)       | サービスとのユーザーインタラクションに影響を与える追加要素を追跡  | **例:** インターネットプロバイダーと場所  
**クイックウィン:** 基本的なページ読み込み時間のモニタリングから始める | **ご存知ですか？** ページ読み込み時間のわずかな遅延が、ユーザーの継続利用に大きな影響を与える可能性があります |
| **上級** | [詳細なネットワーク使用状況分析](https://aws-observability.github.io/observability-best-practices/recipes/infra)       | ネットワークフローのアクティビティとステータスを詳細に評価・分析 | **例:** [Network Synthetics](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/what-is-network-monitor.html) と [Network Flow Monitor](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/CloudWatch-NetworkFlowMonitor.html) | より深いネットワークインタラクションとユーザー行動を追跡 |



### 推奨事項：
- **重要なアクションに焦点を当てる**：収益やユーザー満足度に影響を与えるアクションの監視を優先してください。
- **実際のユーザーインタラクションを監視する**：合成テストだけに頼らず、実際のユーザーデータからより実用的な洞察を得てください。

---




## サーバーレスワークロードのモニタリング ⚡

**目標：** サーバーレスアプリケーションを効果的にモニタリングおよび最適化し、信頼性とコスト効率を確保します。

| レベル | コンポーネント | 説明 | ヒントと例 | 追加情報 |
|-------|-----------|-------------|-----------------|------------------|
| **基本** | [Lambda 関数のベストプラクティス](https://aws-observability.github.io/observability-best-practices/guides/serverless/aws-native/lambda-based-observability) | Lambda の主要なメトリクスと実行統計をモニタリング | **例：** 呼び出し回数、実行時間、エラー率を追跡  
**クイックウィン：** Lambda インサイトのための CloudWatch ダッシュボードを設定 | **プロのヒント：** コストを最適化するためにコールドスタートとメモリ使用率をモニタリング |
| **中級** | [イベントソースのモニタリング](https://docs.aws.amazon.com/ja_jp/lambda/latest/dg/monitoring-metrics.html) | イベントソースと統合のパフォーマンスを追跡 | **例：** SQS キューの深さ、API Gateway のレイテンシーをモニタリング  
**クイックウィン：** 失敗したイベントのためのデッドレターキューを設定 | **ご存知ですか？** 適切なイベントソースのモニタリングはカスケード障害を防ぐことができます |
| **上級** | [提供される要約インサイト](https://docs.aws.amazon.com/ja_jp/xray/latest/devguide/xray-services-lambda.html) | CloudWatch の特殊なインサイトツールを活用して、サーバーレスおよびコンテナ化されたアプリケーションのワークロードパフォーマンス、リソース使用率、運用パターンに関する自動化された詳細な分析を取得します。 | **例：** [Lambda Insights](https://aws-observability.github.io/observability-best-practices/guides/serverless/aws-native/lambda-based-observability#use-cloudwatch-lambda-insights-to-monitor-system-level-metrics)  
[Container Insights](https://aws-observability.github.io/observability-best-practices/patterns/adoteksfargate) | AWS CloudFormation を使用してアカウントレベルで Lambda Insights を有効にし、すべての新しい Lambda 関数の詳細なメトリクスを自動的に収集します。また、[Contributor Insights](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/ContributorInsights.html) を使用して、最も消費の多いリソースとボトルネックの可能性を特定します。 |




### 推奨事項：
- **構造化ログの実装**: より良い検索性のために一貫した JSON ログフォーマットを使用する
- **同時実行制限の監視**: スロットリングを防ぐために関数の同時実行数を追跡する
- **コスト最適化**: コスト配分タグを設定し、関数ごとのコストを監視する

---

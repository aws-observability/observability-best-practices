# クラウドに依存しない AI 可観測性プラットフォーム - アーキテクチャ

## 概要

このドキュメントでは、AWS マネージドサービス上に構築されたクラウドに依存しない AI 可観測性プラットフォームのアーキテクチャについて説明します。このプラットフォームは、複数のクラウドプロバイダーにわたる大規模言語モデル (LLM) ワークロードに対して、統合監視、コスト最適化、運用インサイトを提供します。

## アーキテクチャ図

![Architecture Diagram](./architecture_diagram.png)

## アーキテクチャコンポーネント

### 1. LLM プロバイダーレイヤー (マルチクラウド)

このプラットフォームは、複数のプロバイダーにわたる LLM 呼び出しの監視をサポートしています。

:::info モデルの柔軟性
以下にリストされているモデルは、このデモで使用されているものです。このプラットフォームは AI ゲートウェイとして [LiteLLM](https://docs.litellm.ai/) を使用しているため、LiteLLM がサポートする任意の LLM に置き換えることができます。単に更新するだけです `gateway/litellm-config.yaml` 好みのモデルを使用できます。どのモデルを選択しても、オブザーバビリティパイプラインは同じように機能します。
:::

#### AWS Bedrock
- **モデル**: Claude 3 Haiku、Claude 3 Sonnet
- **統合**: AWS SDK (boto3)
- **メトリクス**: トークン使用量、レイテンシー、リクエスト数
- **ディメンション**: `CloudProvider=aws`

#### Google Vertex AI
- **モデル**: Gemini 1.5 Pro、Gemini 1.5 Flash
- **統合**: シミュレート (本番環境では Google Cloud SDK を使用)
- **メトリクス**: トークン使用量、レイテンシー、リクエスト数
- **ディメンション**: `CloudProvider=gcp`

#### Azure OpenAI
- **モデル**: GPT-4o、GPT-4o Mini
- **統合**: シミュレート (本番環境では Azure SDK を使用)
- **メトリクス**: トークン使用量、レイテンシー、リクエスト数
- **ディメンション**: `CloudProvider=azure`

#### オンプレミス (Ollama)
- **モデル**: Llama 3.1 70B、Mistral 7B
- **統合**: シミュレート (本番環境では Ollama API を使用)
- **メトリクス**: トークン使用量、レイテンシー、リクエスト数
- **ディメンション**: `CloudProvider=on-prem`

### 2. アプリケーション層

#### Python アプリケーション
- **フレームワーク**: 計装用の OpenTelemetry SDK
- **言語**: Python 3.8+
- **責務**:
  - プロバイダー全体で LLM API を呼び出す
  - テレメトリ (メトリクス、トレース、ログ) を収集する
  - OpenTelemetry Collector にデータを送信する

#### OpenTelemetry Collector
- **プロトコル**: OTLP (OpenTelemetry Protocol)
- **形式**: クラウドに依存しない、ベンダーニュートラル
- **責任**:
  - アプリケーションからテレメトリを受信
  - データの変換と強化
  - AWS サービスへのエクスポート

### 3. AWS Observability スタック

#### Amazon CloudWatch
- **サービスタイプ**: マネージド型メトリクスとモニタリング
- **リージョン**: us-east-1
- **ネームスペース**: `AIObservability`
- **メトリクス**:
  - `InputTokens` - プロンプトのトークン数
  - `OutputTokens` - 補完のトークン数
  - `Latency` - レスポンス時間（ミリ秒）
- **ディメンション**:
  - `Model` - LLM モデル識別子
  - `CloudProvider` - プロバイダー (aws、gcp、azure、on-prem)
- **保持期間**: 15 か月 (デフォルト)
- **コスト**: メトリクスあたり月額 $0.30 (最初の 10,000 メトリクスは無料)

#### AWS X-Ray
- **サービスタイプ**: 分散トレーシング
- **リージョン**: us-east-1
- **責任範囲**:
  - サービス間のリクエストフローを追跡
  - パフォーマンスのボトルネックを特定
  - サービスの依存関係を可視化
- **トレース形式**: X-Ray セグメントドキュメント
- **保持期間**: 30 日間
- **コスト**: 記録された 100 万トレースあたり $5.00

#### CloudWatch Logs
- **サービスタイプ**: ログの集約と分析
- **リージョン**: us-east-1
- **ロググループ**: `/ai-observability-demo`
- **形式**: JSON 構造化ログ
- **機能**:
  - クエリ用の CloudWatch Logs Insights
  - ログ保持ポリシー
  - アラート用のメトリクスフィルター
- **保持期間**: 7 日間（設定可能）
- **コスト**: 取り込み 1 GB あたり $0.50

#### Amazon Managed Prometheus (AMP)
- **サービスタイプ**: マネージド型 Prometheus 互換モニタリング
- **リージョン**: us-east-1
- **ワークスペース ID**: `<your-amp-workspace-id>`
- **ユースケース**: 時系列メトリクスストレージ
- **クエリ言語**: PromQL
- **保持期間**: 150 日
- **コスト**: 取り込まれた 100 万サンプルあたり $0.10

#### Amazon Managed Grafana (AMG)
- **サービスタイプ**: 可視化のための Managed Grafana
- **リージョン**: us-east-1
- **ワークスペース ID**: `<your-amg-workspace-id>`
- **認証**: IAM Identity Center (SSO)
- **データソース**:
  - Amazon CloudWatch
  - AWS X-Ray
  - Amazon Managed Prometheus
- **機能**:
  - テンプレート変数を使用した動的ダッシュボード
  - マルチクラウドフィルタリング
  - 自動更新 (30 秒)
- **コスト**: アクティブユーザーあたり月額 $9.00

### 4. セキュリティとアクセス制御

#### IAM ロール (Grafana アクセス)
- **ロール名**: `ai-observability-grafana-role`
- **目的**: Grafana が AWS サービスをクエリできるようにする
- **マネージドポリシー**:
  - `CloudWatchReadOnlyAccess`
  - `AWSXRayReadOnlyAccess`
  - `AmazonPrometheusQueryAccess`
- **信頼ポリシー**: Grafana ワークスペースがロールを引き受けることを許可します
- **最小権限の原則**: 読み取り専用アクセスのみ

#### IAM Identity Center (SSO)
- **リージョン**: us-east-2 (オハイオ)
- **目的**: Grafana ユーザーのシングルサインオン
- **ユーザー**: `<your-email>` (ADMIN ロール)
- **統合**: SAML 2.0 認証
- **メリット**:
  - 一元化されたユーザー管理
  - MFA サポート
  - 監査ログ

### 5. 可視化とクエリレイヤー

#### Grafana ダッシュボード
- **タイプ**: テンプレート変数を使用した動的ダッシュボード
- **ファイル**: `grafana/dashboards/ai-observability-dynamic.json`
- **機能**:
  - Cloud Provider ドロップダウン (aws、gcp、azure、on-prem を自動検出)
  - Model ドロップダウン (すべてのモデルを自動検出)
  - 複数選択フィルター
  - リアルタイムメトリクス (30 秒更新)
- **パネル**:
  - Input Tokens by Model (時系列)
  - Output Tokens by Model (時系列)
  - Latency by Model (時系列)
  - Total Requests (統計)
  - Average Latency (統計)

#### CloudWatch ダッシュボード
- **名前**: `AI-Observability-Demo`
- **タイプ**: ネイティブ CloudWatch ダッシュボード
- **ウィジェット**:
  - 入力/出力トークンメトリクス
  - レイテンシー統計
  - リクエスト数
- **ディメンション**: Model と CloudProvider
- **アクセス**: AWS Console

#### MCP Server (自然言語クエリ)
- **テクノロジー**: Model Context Protocol
- **言語**: Python 3.8+
- **統合**: Kiro IDE
- **ツール**:
  - `get_token_usage` - クエリトークンの消費量 `get_model_latency` - クエリレイテンシー統計
  - `get_request_count` - クエリリクエストボリューム
  - `get_cost_estimate` - コストを見積もる
  - `compare_models` - サイドバイサイド比較
- **クエリ例**:
  - 「最も多くのトークンを消費しているモデルはどれですか？」
  - 「Claude Haiku の平均レイテンシーはどのくらいですか？」
  - 「過去 1 時間の LLM コストを見積もってください」

#### Kiro IDE 統合
- **目的**: 開発者中心のオブザーバビリティ
- **機能**:
  - IDE での自然言語クエリ
  - ダッシュボードへのコンテキスト切り替えなし
  - 開発中のリアルタイムメトリクス
- **設定**: `kiro-mcp-config.json`

### 6. アラートと通知

#### CloudWatch アラーム
- **目的**: プロアクティブな監視とアラート
- **アラームタイプ**:
  - コストしきい値の超過
  - レイテンシー SLA 違反
  - エラー率の増加
  - トークン使用量の異常
- **アクション**: SNS 通知をトリガー

#### Amazon SNS
- **目的**: マルチチャネル通知
- **チャネル**:
  - Email
  - SMS
  - Slack (webhook 経由)
  - PagerDuty 統合
- **サブスクライバー**: 運用チーム

## データフロー

### 1. LLM 呼び出しフロー

```
User Request → Application → LLM Provider API
                    ↓
            OpenTelemetry SDK
                    ↓
         (Collect Telemetry)
                    ↓
            OTLP Collector
```

### 2. テレメトリエクスポートフロー

```
OTLP Collector → CloudWatch (Metrics)
              → X-Ray (Traces)
              → CloudWatch Logs (Logs)
              → Prometheus (Time Series)
```

### 3. 可視化フロー

```
CloudWatch/X-Ray/Prometheus → Grafana → Users
                           → CloudWatch Dashboard → Users
```

### 4. クエリフロー (MCP)

```
Developer → Kiro IDE → MCP Server → CloudWatch API → Response
```

### 5. アラートフロー

```
CloudWatch Metrics → Alarm Threshold → SNS → Operations Team
```

## 主要な設計上の決定事項

### 1. クラウドに依存しないアプローチ

**決定**: OpenTelemetry をインストルメンテーション標準として使用する

**根拠**:
- ベンダーニュートラルなオープンソース標準
- あらゆる LLM プロバイダーで動作
- プロバイダーの変更に対する将来性
- クラウドプラットフォーム間での移植性

**トレードオフ**:
- 追加の抽象化レイヤー
- OTLP コレクターのセットアップが必要
- OpenTelemetry の学習曲線

### 2. AWS マネージドサービス

**決定**: セルフホスト型ではなく Amazon Managed Grafana と Prometheus を使用する

**根拠**:
- インフラストラクチャ管理のオーバーヘッドがない
- 高可用性とスケーラビリティが組み込まれている
- 自動パッチ適用と更新
- AWS ネイティブなセキュリティ統合
- 従量課金制の料金モデル

**トレードオフ**:
- 自己ホスト型よりもコストが高い（大規模な場合）
- カスタマイズの柔軟性が低い
- AWS リージョンへの依存

### 3. ディメンションメトリクス

**決定**: メトリクス名のプレフィックスの代わりに CloudWatch ディメンション (Model、CloudProvider) を使用します

**根拠**:
- 柔軟なクエリと集約
- 効率的なストレージ (メトリクスの爆発的増加なし)
- Grafana での動的フィルタリングのサポート
- 新しいディメンションの追加が容易

**トレードオフ**:
- CloudWatch のディメンション制限（メトリクスあたり 30）
- 慎重なディメンション設計が必要
- クエリの複雑さが増加

### 4. SSO のための IAM Identity Center

**決定**: Grafana ネイティブ認証の代わりに IAM Identity Center を使用する

**根拠**:
- 一元化されたユーザー管理
- すぐに使える MFA サポート
- コンプライアンスのための監査ログ
- 企業の ID プロバイダーとの統合

**トレードオフ**:
- 追加の AWS サービス依存関係
- セットアップの複雑さ
- リージョンの制約 (us-east-2)

### 5. 自然言語クエリのための MCP

**決定**: 既存のクエリツールを使用する代わりに、カスタム MCP サーバーを構築する

**根拠**:
- 開発者中心のエクスペリエンス
- コンテキストの切り替えを削減
- 自然言語インターフェイス
- IDE 統合

**トレードオフ**:
- 保守が必要なカスタムコード
- サポートされている IDE に限定
- MCP プロトコルの知識が必要

## スケーラビリティに関する考慮事項

### メトリクスボリューム

**現在のスケール**:
- 呼び出しごとに 3 つのメトリクス (InputTokens、OutputTokens、Latency)
- メトリクスごとに 2 つのディメンション (Model、CloudProvider)
- デモでは 1 分あたり約 10 回の呼び出し

**本番環境のスケール見積もり**:
- 1 秒あたり 1,000 回の呼び出し
- 1 分あたり 180,000 のメトリクスデータポイント
- 1 日あたり 2 億 5,900 万のデータポイント

**CloudWatch の制限**:
- アカウントごと、リージョンごとに 1 秒あたり 1,000 トランザクション (TPS)
- API ごとに 150 TPS (PutMetricData)
- 解決策: バッチ処理を使用 (リクエストあたり最大 1,000 メトリクス)

### コスト最適化

**戦略**:
1. **メトリクスの集約**: CloudWatch に送信する前にメトリクスを事前集約します
2. **サンプリング**: 大量のワークロードに対してトレースをサンプリングします (例: リクエストの 10%)
3. **保持ポリシー**: 重要度の低いログのログ保持期間を短縮します
4. **予約キャパシティー**: 予測可能なワークロードに Savings Plans を使用します

**推定月額コスト** (1 日あたり 100 万回の呼び出し):
- CloudWatch Metrics: 約 $90
- CloudWatch Logs: 約 $15
- X-Ray: 約 $150
- Amazon Managed Grafana: ユーザーあたり $9
- Amazon Managed Prometheus: 約 $30
- **合計**: 月額約 $300 + ユーザーあたり $9

### 高可用性

**組み込みの HA**:
- CloudWatch: デフォルトでマルチ AZ
- X-Ray: デフォルトでマルチ AZ
- Amazon Managed Grafana: マルチ AZ デプロイメント
- Amazon Managed Prometheus: マルチ AZ デプロイメント

**アプリケーション HA**:
- 複数の AZ にアプリケーションをデプロイします
- Application Load Balancer を使用して分散します
- 指数バックオフを使用した再試行ロジックを実装します

## セキュリティのベストプラクティス

### 1. 最小権限アクセス

- Grafana ロールは AWS サービスへの読み取り専用アクセス権を持ちます
- CloudWatch、X-Ray、または Prometheus への書き込み権限はありません
- 異なるユーザーグループ用に個別のロールを使用します

### 2. 暗号化

- **保管時**: AWS KMS で暗号化された CloudWatch Logs
- **転送時**: すべての API 呼び出しに TLS 1.2 以上を使用
- **Grafana**: 有効な SSL 証明書を使用した HTTPS のみ

### 3. ネットワークセキュリティ

- AWS マネージド VPC 内の Grafana ワークスペース
- バックエンドサービスへのパブリックインターネットアクセスなし
- AWS サービスアクセス用の VPC エンドポイント (オプション)

### 4. 監査ログ

- CloudTrail はすべての API 呼び出しをログに記録します
- CloudWatch の Grafana アクセスログ
- IAM Identity Center 監査ログ

### 5. シークレット管理

- IAM ロールによる AWS 認証情報（ハードコードされたキーなし）
- AWS Secrets Manager 内の LLM API キー
- 自動キーローテーションポリシー

## モニタリングシステムのモニタリング

### メタモニタリング

**プラットフォームヘルスの CloudWatch メトリクス**:
- Grafana ワークスペースのステータス
- Prometheus ワークスペースのステータス
- API 呼び出しの成功率
- クエリのレイテンシー

**アラーム**:
- Grafana ワークスペースが利用不可
- CloudWatch API のスロットリング
- X-Ray トレース取り込みの失敗

## ディザスタリカバリ

### バックアップ戦略

**CloudWatch**:
- メトリクス: 15 か月間保持されます (バックアップ不要)
- ログ: 長期保持のために S3 にエクスポートします
- ダッシュボード: Git でバージョン管理されます

**Grafana**:
- ダッシュボード: JSON としてエクスポートし、Git に保存
- データソース: コードとしての設定 (Terraform)
- ユーザー: IAM Identity Center 経由で管理

**目標復旧時間 (RTO)**: 1 時間
**目標復旧時点 (RPO)**: 5 分

### ディザスタリカバリ計画

1. **インフラストラクチャ**: Terraform 経由で再デプロイ
2. **ダッシュボード**: Git リポジトリからインポート
3. **データ**: CloudWatch データは永続化されます (アクション不要)
4. **ユーザー**: IAM Identity Center 経由で再割り当て

## 今後の機能強化

### 短期 (1〜3 か月)

1. **異常検知**: 異常なパターンに対する ML を活用したアラート
2. **コスト予測**: トレンドに基づいて月次コストを予測
3. **SLO トラッキング**: サービスレベル目標のモニタリング
4. **マルチリージョン**: AWS リージョン全体でメトリクスを集約

### 中期 (3～6 か月)

1. **高度な分析**: BigQuery/Athena 統合
2. **カスタムダッシュボード**: チーム固有のビュー
3. **統合テスト**: 自動化されたオブザーバビリティテスト
4. **API Gateway**: 外部統合のための RESTful API

### 長期 (6～12 か月)

1. **AI を活用したインサイト**: 自動化された根本原因分析
2. **予測スケーリング**: 予測に基づいてクォータを自動調整
3. **コスト最適化エンジン**: 自動化されたモデル選択
4. **コンプライアンス自動化**: 自動化された監査レポート

## 参考資料

### AWS サービスドキュメント
- [Amazon CloudWatch](https://docs.aws.amazon.com/cloudwatch/)
- [AWS X-Ray](https://docs.aws.amazon.com/xray/)
- [Amazon Managed Grafana](https://docs.aws.amazon.com/grafana/)
- [Amazon Managed Prometheus](https://docs.aws.amazon.com/prometheus/)
- [IAM Identity Center](https://docs.aws.amazon.com/singlesignon/)

### 標準とプロトコル
- [OpenTelemetry](https://opentelemetry.io/docs/)
- [OTLP 仕様](https://opentelemetry.io/docs/specs/otlp/)
- [Model Context Protocol](https://modelcontextprotocol.io/)

### 関連パターン
- [AWS Well-Architected Framework](https://aws.amazon.com/architecture/well-architected/)
- [オブザーバビリティのベストプラクティス](https://aws.amazon.com/jp/blogs/news/best-practices-implementing-observability-with-aws/)
- [マルチクラウドアーキテクチャパターン](https://aws.amazon.com/blogs/architecture/)

---

**ドキュメントバージョン**: 1.0  
**最終更新日**: 2026 年 2 月  
**管理者**: AWS Solutions Architecture Team

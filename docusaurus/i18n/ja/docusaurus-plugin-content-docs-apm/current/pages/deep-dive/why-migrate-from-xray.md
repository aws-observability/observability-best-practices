# X-Ray をご利用のお客様が Application Signals と Transaction Search を採用すべき理由

## オブザーバビリティニーズの進化

アプリケーションの複雑さとスケールが増すにつれて、顧客のオブザーバビリティ要件は大幅に進化してきました。[AWS X-Ray](https://docs.aws.amazon.com/xray/latest/devguide/aws-xray.html) は信頼性の高い分散トレーシングソリューションとして機能してきましたが、現代のアプリケーション環境ではより包括的な可視性が求められています。

## 技術的アーキテクチャの違い

**X-Ray の従来のアプローチ：**

![X-Ray Architecture](/apm-src/assets/images/deep-dive/X-ray.png)

**Application Signals + Transaction Search:**

![Application Signals + Transaction Search Architecture](/apm-src/assets/images/deep-dive/ap%20ts.png)

## 主要な移行メリット

| 機能 | X-Ray | Application Signals + Transaction Search |
|---|---|---|
| **データの取り込み** | 100% のトランザクション（設定時） | 100% のトランザクション（設定時） |
| **スループット制限** | 大量時に X-Ray サービスクォータの対象となる | CloudWatch Logs によるより高いスループット容量 |
| **コストモデル** | トレースごとの料金（100% では高コスト） | Application Signals のバンドル料金 |
| **ストレージ形式** | X-Ray 独自形式 | OpenTelemetry 標準形式 |
| **ストレージバックエンド** | X-Ray 最適化ストレージ | 選択的インデックス作成を備えた CloudWatch Logs |
| **分析** | X-Ray コンソールのみ | Transaction Search + X-Ray トレース分析 |
| **クエリ機能** | X-Ray コンソールと API | Transaction Search のビジュアル分析 + X-Ray |
| **インデックス作成** | すべてのトレースをインデックス化 | 選択的インデックス作成（割合を設定可能） |
| **ビジネスコンテキスト** | 限定的なカスタム属性 | 豊富な OTEL スパン属性 + ビジネスコンテキスト |

## 主要な価値提案

### 1. より高いスループットとスケーラビリティ
- **CloudWatch Logs は X-Ray よりも高いスループットを処理します**。これにより、お客様はサービスの制限に達することなく、すべてのアプリケーションイベントを追跡できます
- **トレースデータのストレージとしてのログ**により、大量のトラフィックを処理するアプリケーションにおける X-Ray のスループット制約が解消されます
- **スケーラブルなインフラストラクチャ**は、大規模なログ取り込みボリュームに対応するよう設計されています

### 2. 強化された分析と統合機能
- **スパンデータ分析に利用可能なネイティブ CloudWatch Logs 機能:**
  - **メトリクスフィルター**: スパン属性とパターンからカスタムメトリクスを作成
  - **サブスクリプションフィルター**: スパンデータを他の AWS サービス（Lambda、Kinesis など）にストリーミング
  - **Log Insights**: 従来のトレース分析を超えた高度なクエリ機能
- **トランザクション検索はスパンレベルの分析のための高度なビジュアルクエリインターフェイスを提供します**
- **OTEL 形式によりカスタム属性を使用したスパン内のより豊富なビジネスコンテキストが実現します**

### 3. コスト効率の高い 100% サンプリング
- **バンドル料金**は、トレースごとの X-Ray 料金と比較して、完全な可視性をコスト効率よく実現します。[CloudWatch 料金ページ](https://aws.amazon.com/cloudwatch/pricing/)の**例 13** をご参照ください。
- **予測可能なコスト**は、トレース数ではなくデータ量に基づいています。
- **選択的インデックス作成**により、完全なデータアクセスを維持しながらストレージコストを最適化します。

## スパンデータを活用した CloudWatch Logs 機能の活用

Transaction Search はスパンデータを CloudWatch Logs に保存するため (`aws/spans` ロググループ）を使用することで、CloudWatch Logs のすべてのネイティブ機能を活用できます。

**メトリクスフィルター:**
```bash
# Create custom metrics from span attributes
aws logs put-metric-filter \
  --log-group-name "aws/spans" \
  --filter-name "HighLatencyRequests" \
  --filter-pattern '[timestamp, request_id, span_id, trace_id, duration > 5000]' \
  --metric-transformations \
    metricName=HighLatencySpans,metricNamespace=CustomApp/Performance,metricValue=1
```

**サブスクリプションフィルター:**
```bash
# Stream span data to Lambda for real-time processing
aws logs put-subscription-filter \
  --log-group-name "aws/spans" \
  --filter-name "ErrorSpanProcessor" \
  --filter-pattern '[..., status_code="ERROR"]' \
  --destination-arn "arn:aws:lambda:region:account:function:ProcessErrorSpans"
```

**Log Insights クエリ:**
```sql
-- Find all spans with specific business attributes
fields @timestamp, attributes.customer_id, attributes.order_value, duration
| filter attributes.service_name = "payment-service"
| filter attributes.customer_tier = "premium"
| stats avg(duration) by attributes.customer_id
| sort avg(duration) desc
```

**統合の機会:**
- **リアルタイムアラート**: サブスクリプションフィルターを使用して Lambda 関数をトリガーし、即時インシデント対応を実現します
- **ビジネスインテリジェンス**: Kinesis Data Streams 経由でスパンデータを分析プラットフォームにエクスポートします
- **カスタムダッシュボード**: スパン属性から導出されたメトリクスを使用して CloudWatch ダッシュボードを作成します
- **コンプライアンス監査**: Log Insights を使用してスパンをクエリし、規制コンプライアンスレポートを作成します

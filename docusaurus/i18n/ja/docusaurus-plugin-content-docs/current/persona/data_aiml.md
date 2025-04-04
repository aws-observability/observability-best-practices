# データサイエンティスト、AI/ML、MLOps エンジニア

データエンジニアリングと機械学習オペレーションにおけるオブザーバビリティは、信頼性が高く、パフォーマンスの良い、信頼できるデータパイプラインと ML モデルを維持するために重要です。

適切なオブザーバビリティがないと、ML システムは保守、デバッグ、改善が困難なブラックボックスとなってしまいます。
これは、信頼性の低い予測、コストの増加、ビジネスへの潜在的な影響につながる可能性があります。

以下に、データと ML オペレーションにおけるオブザーバビリティ戦略を導く重要なベストプラクティスを示します。



## ベストプラクティス
モニタリングには CloudWatch の[ログ](/observability-best-practices/ja/tools/logs/)、[メトリクス](/observability-best-practices/ja/tools/metrics)、[トレース](/observability-best-practices/ja/tools/xray)を使用します。
すべてのリソースにタグ付け戦略を実装し、重要なイベントのメトリクスフィルターを作成し、[異常検知](/observability-best-practices/ja/tools/metrics#anomaly-detection)をセットアップし、[CloudWatch アラーム](/observability-best-practices/ja/tools/alarms)を使用してアラートのしきい値を設定します。



### データ品質保証
データのライフサイクル全体を通して、データ品質、パイプラインのパフォーマンス、インフラストラクチャの健全性を監視します。

主な監視領域は以下の通りです：
- ETL パイプラインのスループット、処理時間、エラー率
- データ品質のためのデータパターンの異常検知、特徴量ドリフトの検出、学習/推論データの分布分析




### モデルパフォーマンスのモニタリング
Amazon CloudWatch との統合により、AWS は詳細なトレーニングパラメータ、ハイパーパラメータ、パイプライン実行メトリクス、ジョブパフォーマンスメトリクス、インフラストラクチャ使用率メトリクスを自動的に収集し、トレーニングジョブの徹底的な分析とデバッグを可能にします。
モデルのバージョン管理とレジストリ機能により、モデルの反復、メタデータ、承認状態を体系的に追跡し、モデルの系統管理を容易にします。

[Amazon SageMaker Model Monitor](https://docs.aws.amazon.com/ja_jp/sagemaker/latest/dg/how-it-works-model-monitor.html) は、本番環境のマシンラーニングモデルを継続的にモニタリングします。
データドリフトや異常などのモデル品質の偏差が発生した場合に通知する自動アラートシステムを提供します。
このシステムは [Amazon CloudWatch Logs](/observability-best-practices/ja/tools/logs/#search-with-cloudwatch-logs) と統合されており、モニタリングデータを収集し、デプロイされたモデルの早期検出と予防的なメンテナンスを可能にします。

CloudWatch メトリクスまたは [ADOT](/observability-best-practices/ja/guides/operational/adot-at-scale/operating-adot-collector) と [Amazon OpenSearch Service (OpenSearch Service)](/observability-best-practices/ja/patterns/opensearch) などのサービスを使用して、精度やレイテンシーなどのモデル予測エンドポイントメトリクスを集約・分析するメカニズムを作成します。
OpenSearch Service は、ダッシュボードと可視化のために Kibana をサポートしています。
トレーサビリティにより、現在の運用パフォーマンスに影響を与える可能性のある変更を分析できます。



### インフラストラクチャのモニタリング
AWS はリソース使用率、ストレージパターン、計算効率について深い可視性を提供します。
CloudWatch Metrics と [OpenTelemetry](/observability-best-practices/ja/patterns/otel) は、CPU 使用率、メモリ割り当て、I/O 操作に関するリアルタイムデータを収集し、CloudWatch Logs は分析のためにログデータを集約します。
[AWS X-Ray](/observability-best-practices/ja/tools/xray) は、ML パイプラインのステージ全体でサービスの依存関係を追跡し、システムのボトルネックを特定することで、効率的なリソースの最適化とコスト管理を可能にします。




### コンプライアンスとガバナンス
複数のアカウントやモデルバージョン、系統、承認ワークフローの追跡にわたる ML リソースの一元的なガバナンスは重要です。
AWS CloudTrail は、規制コンプライアンスとガバナンスに不可欠なすべての API アクティビティの監査ログを維持します。




### ビジネスインパクト分析
CloudWatch の[カスタムメトリクス](/observability-best-practices/ja/tools/metrics#collecting-metrics)は、ビジネス固有の KPI を追跡し、QuickSight ダッシュボードを通じて ML イニシアチブの ROI をリアルタイムで可視化できます。
Amazon QuickSight は、技術的なメトリクスをビジネスインサイトに変換し、ML のパフォーマンスをビジネス KPI に結びつけるインタラクティブなダッシュボードを作成します。
Amazon CloudWatch [ServiceLens](/observability-best-practices/ja/tools/rum#enable-active-tracing) は、ユーザーエクスペリエンスへの影響を監視するのに役立ちます。




## 参考資料
- [AWS Observability Workshop](https://catalog.workshops.aws/observability/en-US)
- [AWS Observability Best Practices](/observability-best-practices/ja/)
- [AWS Well-Architected Framework Machine Learning Lens](https://docs.aws.amazon.com/ja_jp/wellarchitected/latest/machine-learning-lens/machine-learning-lens.html)
- [Sagemaker Logging and Monitoring](https://docs.aws.amazon.com/ja_jp/sagemaker/latest/dg/sagemaker-incident-response.html)
- Amazon CloudWatch を使用した [Amazon SageMaker AI のモニタリング用メトリクス](https://docs.aws.amazon.com/ja_jp/sagemaker/latest/dg/monitoring-cloudwatch.html)

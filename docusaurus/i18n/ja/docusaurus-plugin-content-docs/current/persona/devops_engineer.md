# DevOps

DevOps エンジニアとして、高性能で信頼性が高く、安全なシステムを維持するためには、ワークフローに堅牢なオブザーバビリティのプラクティスを組み込むことが重要です。
このガイドでは、継続的デリバリーのライフサイクルとインフラストラクチャ管理プロセス全体における実践的な実装に焦点を当てた、DevOps の観点からのオブザーバビリティのベストプラクティスを提供します。



## 継続的インテグレーションとデリバリーパイプライン (CI/CD)

CI/CD パイプラインをオブザーバビリティで最適化するには、以下を実施します:
 
- CI/CD の信頼性、可用性、パフォーマンスを維持するために、[パイプライン](https://docs.aws.amazon.com/ja_jp/codepipeline/latest/userguide/monitoring.html)、[ビルド](https://docs.aws.amazon.com/ja_jp/codebuild/latest/userguide/monitoring-builds.html)、[デプロイ](https://docs.aws.amazon.com/ja_jp/codedeploy/latest/userguide/monitoring.html) のモニタリングを実装します。

- 重要な CI/CD イベントに対して [CloudWatch アラーム](https://aws-observability.github.io/observability-best-practices/tools/alarms) を作成します。Amazon SNS を使用して通知を設定し、パイプラインの失敗や長時間実行されているステージをチームに通知します。

     * [CodeBuild での CloudWatch アラーム](https://docs.aws.amazon.com/ja_jp/codebuild/latest/userguide/codebuild_cloudwatch_alarms.html) を設定します。
     * [CodeDeploy での CloudWatch アラーム](https://docs.aws.amazon.com/ja_jp/codedeploy/latest/userguide/monitoring-create-alarms.html) を設定します。
 
- [AWS X-Ray](https://aws-observability.github.io/observability-best-practices/tools/xray/) を使用してパイプラインを計測し、CI/CD パイプラインのステージ全体でリクエストをトレースします。

- [CodeBuild](https://docs.aws.amazon.com/ja_jp/codebuild/latest/userguide/monitoring-metrics.html)、[CodeDeploy](https://docs.aws.amazon.com/ja_jp/codedeploy/latest/userguide/monitoring-cloudwatch.html)、[パイプライン](https://docs.aws.amazon.com/ja_jp/codepipeline/latest/userguide/metrics-dimensions.html) の主要なメトリクスを追跡するために、統合された [CloudWatch ダッシュボード](https://aws-observability.github.io/observability-best-practices/tools/dashboards) を作成します。



## Infrastructure as Code (IaC) のプラクティス

IaC ワークフローで効果的なオブザーバビリティを実現するために：

- [AWS CloudFormation](https://docs.aws.amazon.com/ja_jp/AWSCloudFormation/latest/UserGuide/AWS_CloudWatch.html) テンプレートに [CloudWatch アラーム](https://aws-observability.github.io/observability-best-practices/tools/alarms) と [ダッシュボード](https://aws-observability.github.io/observability-best-practices/tools/cloudwatch-dashboard) を組み込みます。これにより、すべての環境で一貫したモニタリングが確保されます。

- 集中ログ管理を実装します：Amazon CloudWatch Logs や [Amazon OpenSearch Service](https://aws-observability.github.io/observability-best-practices/recipes/aes) を使用して[集中ログソリューション](https://aws-observability.github.io/observability-best-practices/patterns/multiaccount)をセットアップします。IaC テンプレートの一部としてログ保持ポリシーとロググループを定義します。

- セキュリティとパフォーマンス分析のためのネットワークトラフィック情報を取得するために、IaC を使用して [VPC フローログ](https://aws-observability.github.io/observability-best-practices/patterns/vpcflowlogs)を設定します。

- より良いリソース管理と、より詳細なモニタリングとコスト配分を可能にするために、[IaC テンプレート](https://docs.aws.amazon.com/ja_jp/whitepapers/latest/tagging-best-practices/implementing-and-enforcing-tagging.html)で一貫したタグ付け戦略を使用します。

- 分散トレースを有効にするために [AWS X-Ray](https://docs.aws.amazon.com/ja_jp/xray/latest/devguide/creating-resources-with-cloudformation.html) を使用し、アプリケーションコードと統合します。IaC テンプレートで X-Ray サンプリングルールとグループを定義します。




## コンテナ化と Kubernetes によるオーケストレーション

コンテナ化されたアプリケーションと Kubernetes 環境では、以下を実施します：

- 包括的なコンテナとクラスターのモニタリングのために、[Amazon EKS と Container Insights](https://aws-observability.github.io/observability-best-practices/guides/containers/aws-native/eks/amazon-cloudwatch-container-insights) を実装します。

- コンテナ化されたアプリケーションからテレメトリーデータを収集してエクスポートするために、[AWS Distro for OpenTelemetry](https://aws-observability.github.io/observability-best-practices/guides/operational/adot-at-scale/operating-adot-collector) を使用します。

- 高度なメトリクス収集と可視化のために、EKS 上で [Prometheus と Grafana](https://aws-observability.github.io/observability-best-practices/patterns/eksampamg) を実装します。セットアップと管理を容易にするために Amazon Managed Grafana サービスを使用します。

- Kubernetes のデプロイメントのために、Flux や ArgoCD などのツールを使用して [GitOps](https://aws-observability.github.io/observability-best-practices/guides/operational/gitops-with-amg/#introduction-to-gitops) を実装します。これらのツールを CloudWatch と統合して、GitOps ワークフローの同期状態と健全性をモニタリングします。



## CI/CD パイプラインのセキュリティとコンプライアンス

パイプラインのセキュリティオブザーバビリティを強化するには、以下の対策を実施します：

- 自動化された脆弱性評価のために [Amazon Inspector](https://aws.amazon.com/jp/inspector/) を CI/CD プロセスに統合します。

- [AWS Security Hub](https://aws.amazon.com/jp/security-hub/) を実装して、AWS アカウント全体のセキュリティアラートを集約し、優先順位付けを行います。

- [AWS Config](https://docs.aws.amazon.com/ja_jp/config/latest/developerguide/aws-config-managed-rules-cloudformation-templates.html) を使用してリソースの構成と変更を追跡します。定義した基準への準拠を自動的に評価するための Config ルールを設定します。

- [Amazon GuardDuty](https://aws.amazon.com/jp/blogs/news/introducing-amazon-guardduty-extended-threat-detection-aiml-attack-sequence-identification-for-enhanced-cloud-security/) を活用してインテリジェントな脅威検出を行い、その結果をインシデント対応ワークフローと統合します。

- CloudFormation や Terraform を使用して AWS WAF ルール、Security Hub コントロール、GuardDuty フィルターを定義することで、セキュリティをコードとして実装します。これにより、インフラストラクチャとともにセキュリティオブザーバビリティも進化することが保証されます。



## 自動テストと品質保証の戦略

オブザーバビリティでテストプロセスを強化するには：

- [CloudWatch Synthetics](https://docs.aws.amazon.com/ja_jp/AmazonSynthetics/latest/APIReference/Welcome.html) を実装して、API とユーザージャーニーを継続的にテストする Canary を作成します。

- AWS CodeBuild を使用してテストスイートを実行し、テスト結果を CloudWatch メトリクスとして公開してトレンド分析を行います。

- テストフェーズでパフォーマンスの洞察を得るために、テスト環境で [AWS X-Ray トレース](https://docs.aws.amazon.com/ja_jp/xray/latest/devguide/xray-console-traces.html) を実装します。

- Amazon CloudWatch [RUM](https://aws-observability.github.io/observability-best-practices/tools/rum)（Real User Monitoring）を活用して、アプリケーションとの実際のユーザーインタラクションからユーザーエクスペリエンスデータを収集・分析します。

- [AWS Fault Injection Simulator](https://aws.amazon.com/blogs/mt/chaos-engineering-leveraging-aws-fault-injection-simulator-in-a-multi-account-aws-environment/) を使用してカオスエンジニアリングを実践します。シミュレートした障害の影響をモニタリングして、[システムの回復性を向上](https://aws.amazon.com/jp/blogs/news/monitor-and-improve-your-application-resiliency-with-resilience-hub/)させます。



## リリース管理とデプロイのベストプラクティス

オブザーバビリティ駆動のリリース管理のために：

- マネージドデプロイメントには [AWS CodeDeploy](https://docs.aws.amazon.com/ja_jp/codedeploy/latest/userguide/welcome.html) を使用し、デプロイメントのモニタリングのために CloudWatch との統合を活用します。

- Canary デプロイメントを実行し、新しいバージョンをインフラストラクチャの一部に段階的にロールアウトします。完全なデプロイメントの前に問題を検出するため、CloudWatch と X-Ray を使用して [Canary デプロイメントを監視](https://aws.amazon.com/jp/blogs/news/create-a-pipeline-with-canary-deployments-for-amazon-ecs-using-aws-app-mesh/) します。

- 事前に定義されたモニタリングのしきい値を超えた場合、[自動的にロールバック](https://docs.aws.amazon.com/ja_jp/codedeploy/latest/userguide/deployments-rollback-and-redeploy.html) して前回の安定バージョンに戻るようにデプロイメントを設定します。

- Amazon CloudWatch [RUM](https://aws-observability.github.io/observability-best-practices/tools/rum)（Real User Monitoring）を使用して、実際のユーザーセッションからパフォーマンスデータを収集・分析します。これにより、リリースがエンドユーザーエクスペリエンスに与える影響についての洞察が得られます。

- リリース後の異常やパフォーマンスの問題をすぐにチームに通知するために、[CloudWatch Alarms](https://aws-observability.github.io/observability-best-practices/tools/alarms) を設定します。タイムリーな通知のために、これらのアラームを Amazon SNS と統合します。

- AI を活用したインサイトとして、[Amazon DevOps Guru](https://aws.amazon.com/jp/blogs/news/amazon-devops-guru-machine-learning-powered-service-identifies-application-errors-and-fixes/) を使用し、運用上の問題を自動的に検出し、リリース後のアプリケーションの健全性とパフォーマンスを改善するための ML ベースの推奨事項を受け取ります。

- フィーチャーフラグの管理には AWS Systems Manager Parameter Store または Secrets Manager を使用し、カスタム [CloudWatch メトリクス](https://docs.aws.amazon.com/ja_jp/secretsmanager/latest/userguide/monitoring-cloudwatch.html) を通じてその使用状況を監視します。




## まとめ

オブザーバビリティの実践は、単にシステムを維持するだけではありません。組織の運用上の優位性を確保し、継続的なイノベーションを推進するための戦略的な取り組みです。
システムの進化に合わせてオブザーバビリティ戦略を継続的に改善し、新しい AWS の機能やサービスを活用することを忘れないでください。

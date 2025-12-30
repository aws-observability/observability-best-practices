# DevOps

DevOps エンジニアとして、堅牢なオブザーバビリティプラクティスをワークフローに統合することは、高性能で信頼性が高く安全なシステムを維持するために不可欠です。このガイドでは、DevOps の観点に合わせたオブザーバビリティのベストプラクティスを提供し、継続的デリバリーライフサイクルとインフラストラクチャ管理プロセス全体にわたる実践的な実装に焦点を当てています。

## 継続的インテグレーションおよびデリバリーパイプライン (CI/CD)

観測可能性を使用して CI/CD パイプラインを最適化するには、次の手順を実行します。

- 信頼性、可用性を維持し、CI/CD を実行するために、[パイプライン](https://docs.aws.amazon.com/codepipeline/latest/userguide/monitoring.html)、[ビルド](https://docs.aws.amazon.com/codebuild/latest/userguide/monitoring-builds.html)、[デプロイ](https://docs.aws.amazon.com/codedeploy/latest/userguide/monitoring.html)のモニタリングを実装します。

- 重要な CI/CD イベントに対して [CloudWatch アラーム](/observability-best-practices/ja/tools/alarms)を作成します。Amazon SNS 経由で通知を設定し、パイプラインの障害や長時間実行されているステージについてチームにアラートを送信します。

*  [CodeBuild で CloudWatch アラーム](https://docs.aws.amazon.com/codebuild/latest/userguide/codebuild_cloudwatch_alarms.html)を設定します。
     *  [CodeDeploy で CloudWatch アラーム](https://docs.aws.amazon.com/codedeploy/latest/userguide/monitoring-create-alarms.html)を設定します。

- [AWS X-Ray](/observability-best-practices/ja/tools/xray/) を使用してパイプラインをインストルメント化し、CI/CD パイプラインステージ全体でリクエストをトレースします。

- 統合された [CloudWatch ダッシュボード](/observability-best-practices/ja/tools/dashboards)を作成して、[CodeBuild](https://docs.aws.amazon.com/codebuild/latest/userguide/monitoring-metrics.html)、[CodeDeploy](https://docs.aws.amazon.com/codedeploy/latest/userguide/monitoring-cloudwatch.html)、[Pipelines](https://docs.aws.amazon.com/codepipeline/latest/userguide/metrics-dimensions.html) の主要なメトリクスを追跡します。

## Infrastructure as Code (IaC) のプラクティス

IaC ワークフローで効果的なオブザーバビリティを実現するには、次のようにします。

- [CloudWatch Alarms](/observability-best-practices/ja/tools/alarms) と [Dashboards](/observability-best-practices/ja/tools/cloudwatch-dashboard) を [AWS CloudFormation](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/AWS_CloudWatch.html) テンプレートに埋め込みます。これにより、すべての環境で一貫したモニタリングが保証されます。

- 一元化されたログ記録を実装する：Amazon CloudWatch Logs や [Amazon OpenSearch Service](/observability-best-practices/ja/recipes/aes) などのサービスを使用して、[一元化されたログ記録ソリューション](/observability-best-practices/ja/patterns/multiaccount)をセットアップします。IaC テンプレートの一部として、ログ保持ポリシーとロググループを定義します。

- IaC を使用して [VPC フローログ](/observability-best-practices/ja/patterns/vpcflowlogs)を設定し、セキュリティとパフォーマンス分析のためにネットワークトラフィック情報をキャプチャします。

- [IaC テンプレート](https://docs.aws.amazon.com/whitepapers/latest/tagging-best-practices/implementing-and-enforcing-tagging.html#cicd-pipeline-managed-resources)で一貫したタグ付け戦略を使用して、リソースの整理を改善し、より詳細なモニタリングとコスト配分を可能にします。

- [AWS X-Ray](https://docs.aws.amazon.com/xray/latest/devguide/creating-resources-with-cloudformation.html) を使用し、アプリケーションコードと統合して分散トレーシングを有効にします。IaC テンプレートで X-Ray サンプリングルールとグループを定義します。



## Kubernetes によるコンテナ化とオーケストレーション

コンテナ化されたアプリケーションと Kubernetes 環境の場合：

- 包括的なコンテナとクラスターの監視のために、[Container Insights を使用した Amazon EKS](/observability-best-practices/ja/guides/containers/aws-native/eks/amazon-cloudwatch-container-insights) を実装します。

- [AWS Distro for OpenTelemetry](/observability-best-practices/ja/guides/operational/adot-at-scale/operating-adot-collector) を使用して、コンテナ化されたアプリケーションからテレメトリデータを収集およびエクスポートします。

- 高度なメトリクス収集と可視化のために、EKS 上に [Prometheus と Grafana](/observability-best-practices/ja/patterns/eksampamg) を実装します。より簡単なセットアップと管理のために、AWS Managed Grafana サービスを使用します。

- Kubernetes デプロイメントには、Flux や ArgoCD などのツールを使用して [GitOps](/observability-best-practices/ja/guides/operational/gitops-with-amg/#gitops-の概要) プラクティスを実装します。これらのツールを CloudWatch と統合して、GitOps ワークフローの同期ステータスと正常性を監視します。

## CI/CD パイプラインにおけるセキュリティとコンプライアンス

パイプラインのセキュリティオブザーバビリティを強化するには、次の手順を実行します。

- CI/CD プロセスに [Amazon Inspector](https://aws.amazon.com/inspector/) を統合して、自動化された脆弱性評価を実行します。

- [AWS Security Hub](https://aws.amazon.com/security-hub/) を実装して、AWS アカウント全体のセキュリティアラートを集約し、優先順位を付けます。

- [AWS Config](https://docs.aws.amazon.com/config/latest/developerguide/aws-config-managed-rules-cloudformation-templates.html) を使用して、リソースの設定と変更を追跡します。Config ルールを設定して、定義された基準へのコンプライアンスを自動的に評価します。

- インテリジェントな脅威検出には [Amazon GuardDuty](https://aws.amazon.com/blogs/aws/introducing-amazon-guardduty-extended-threat-detection-aiml-attack-sequence-identification-for-enhanced-cloud-security/) を活用し、その検出結果をインシデント対応ワークフローに統合します。

- CloudFormation または Terraform を使用して AWS WAF ルール、Security Hub コントロール、GuardDuty フィルターを定義することで、セキュリティをコードとして実装します。これにより、セキュリティのオブザーバビリティがインフラストラクチャとともに進化することが保証されます。

## 自動テストと品質保証戦略

観測可能性を使用してテストプロセスを強化するには、次の手順を実行します。

- [CloudWatch Synthetics](https://docs.aws.amazon.com/AmazonSynthetics/latest/APIReference/Welcome.html) を実装して、API とユーザージャーニーを継続的にテストする Canary を作成します。

- AWS CodeBuild を使用してテストスイートを実行し、テスト結果を CloudWatch メトリクスとして発行してトレンド分析を行います。

- テスト環境に [AWS X-Ray トレーシング](https://docs.aws.amazon.com/xray/latest/devguide/xray-console-traces.html)を実装して、テストフェーズ中にパフォーマンスインサイトを取得します。

- Amazon CloudWatch [RUM](/observability-best-practices/ja/tools/rum)(Real User Monitoring) を活用して、アプリケーションとの実際のユーザーインタラクションからユーザーエクスペリエンスデータを収集および分析します。

- [AWS Fault Injection Simulator](https://aws.amazon.com/blogs/mt/chaos-engineering-leveraging-aws-fault-injection-simulator-in-a-multi-account-aws-environment/) を使用してカオスエンジニアリングプラクティスを実装します。シミュレートされた障害の影響を監視して、[システムの回復性を強化](https://aws.amazon.com/blogs/aws/monitor-and-improve-your-application-resiliency-with-resilience-hub/)します。

## リリース管理とデプロイのベストプラクティス

オブザーバビリティ駆動型リリース管理の場合。

- マネージド型デプロイには [AWS CodeDeploy](https://docs.aws.amazon.com/codedeploy/latest/userguide/welcome.html) を使用し、デプロイ監視のための CloudWatch との統合を活用します。

- カナリアデプロイメントを実行し、インフラストラクチャの小さなサブセットに新しいバージョンを段階的にロールアウトします。CloudWatch と X-Ray を使用して[カナリアデプロイメントを綿密に監視](https://aws.amazon.com/blogs/containers/create-a-pipeline-with-canary-deployments-for-amazon-ecs-using-aws-app-mesh/)し、完全なデプロイメントの前に問題を検出します。

- 事前定義されたモニタリングしきい値に違反した場合、デプロイメントが以前の安定バージョンに[自動的にロールバック](https://docs.aws.amazon.com/codedeploy/latest/userguide/deployments-rollback-and-redeploy.html)するように設定します。

- Amazon CloudWatch [RUM](/observability-best-practices/ja/tools/rum) (Real User Monitoring) を使用して、実際のユーザーセッションからパフォーマンスデータを収集および分析します。これにより、リリースがエンドユーザーエクスペリエンスに与える影響についての洞察が得られます。

- [CloudWatch Alarms](/observability-best-practices/ja/tools/alarms) を設定して、リリース直後の異常やパフォーマンスの問題をチームに通知します。これらのアラームを Amazon SNS と統合して、タイムリーな通知を実現します。

- AI を活用したインサイトを活用し、[Amazon DevOps Guru](https://aws.amazon.com/blogs/aws/amazon-devops-guru-machine-learning-powered-service-identifies-application-errors-and-fixes/) を使用して運用上の問題を自動的に検出し、リリース後のアプリケーションの健全性とパフォーマンスを向上させるための ML を活用した推奨事項を受け取ります。

- 機能フラグの管理には AWS Systems Manager Parameter Store または Secrets Manager を使用し、カスタム [CloudWatch メトリクス](https://docs.aws.amazon.com/secretsmanager/latest/userguide/monitoring-cloudwatch.html)を通じてその使用状況を監視します。


## まとめ

オブザーバビリティのプラクティスを採用することは、単にシステムを維持するだけでなく、組織における運用の卓越性を達成し、継続的なイノベーションを推進するための戦略的な取り組みです。システムが進化するにつれて、利用可能になる新しい AWS の機能やサービスを活用しながら、オブザーバビリティ戦略を継続的に改善することを忘れないでください。
# Amazon Managed Grafana

[Amazon Managed Grafana][amg-main] は、オープンソースの Grafana をベースとしたフルマネージドサービスです。サーバーのプロビジョニング、ソフトウェアの設定と更新、または本番環境での Grafana のセキュリティ保護とスケーリングに伴う重労働を行うことなく、メトリクス、ログ、トレースを分析できます。複数のデータソースに接続して、チームと共にオブザーバビリティダッシュボードを作成、探索、共有できます。

以下のレシピを確認してください。

## 基本

- [開始方法][amg-gettingstarted]
- [自動化のための Terraform の使用][amg-tf-automation]

## 認証とアクセスコントロール

- [ID プロバイダーとの直接 SAML 統合][amg-saml]
- [ID プロバイダー (OneLogin、Ping Identity、Okta、Azure AD) と SSO の統合][amg-idps]
- [SAMLv2 による Google 認証の統合][amg-google-idps]
- [カスタマーマネージド IAM ロールを使用した Amazon Managed Grafana クロスアカウントデータソースのセットアップ][amg-cross-account-access]
- [Grafana Teams を使用した Amazon Managed Grafana のきめ細かなアクセス制御][amg-grafana-teams]

## データソースと可視化

- [Amazon Managed Grafana での Athena の使用][amg-plugin-athena]
- [Amazon Managed Grafana での Redshift の使用][amg-plugin-redshift]
- [Amazon Managed Service for Prometheus と Amazon Managed Grafana を使用した statsd からのカスタムメトリクスの表示][amg-amp-statsd]
- [カスタマーマネージド IAM ロールを使用したクロスアカウントデータソースの設定][amg-xacc-ds]

## その他
- [ハイブリッド環境の監視][amg-hybridenvs]
- [規制されたマルチテナント環境での Grafana と Loki の管理][grafana-loki-regenv]
- [Amazon Managed Service for Prometheus と Amazon Managed Grafana を使用した Amazon EKS Anywhere の監視][amg-anywhere-monitoring]
- [入門ワークショップ][amg-oow]
- [サブネット内の空き IP の監視][amg-subnet-free-ip-monitoring]


[amg-main]: https://aws.amazon.com/grafana/
[amg-gettingstarted]: https://aws.amazon.com/blogs/mt/amazon-managed-grafana-getting-started/
[amg-saml]: https://aws.amazon.com/blogs/mt/amazon-managed-grafana-supports-direct-saml-integration-with-identity-providers/
[amg-idps]: https://aws.amazon.com/blogs/opensource/integrating-identity-providers-such-as-onelogin-ping-identity-okta-and-azure-ad-to-sso-into-aws-managed-service-for-grafana/
[amg-google-idps]: recipes/amg-google-auth-saml.md
[amg-hybridenvs]: https://aws.amazon.com/blogs/mt/monitoring-hybrid-environments-using-amazon-managed-service-for-grafana/
[amg-xacc-ds]: https://aws.amazon.com/blogs/opensource/setting-up-amazon-managed-grafana-cross-account-data-source-using-customer-managed-iam-roles/
[grafana-loki-regenv]: https://aws.amazon.com/blogs/opensource/how-to-manage-grafana-and-loki-in-a-regulated-multitenant-environment/
[amg-oow]: https://observability.workshop.aws/en/amg.html
[amg-tf-automation]: recipes/amg-automation-tf.md
[amg-plugin-athena]: recipes/amg-athena-plugin.md
[amg-plugin-redshift]: recipes/amg-redshift-plugin.md
[amg-cross-account-access]: https://aws.amazon.com/blogs/opensource/setting-up-amazon-managed-grafana-cross-account-data-source-using-customer-managed-iam-roles/
[amg-anywhere-monitoring]: https://aws.amazon.com/blogs/containers/monitoring-amazon-eks-anywhere-using-amazon-managed-service-for-prometheus-and-amazon-managed-grafana/
[amg-amp-statsd]: https://aws.amazon.com/blogs/mt/viewing-custom-metrics-from-statsd-with-amazon-managed-service-for-prometheus-and-amazon-managed-grafana/
[amg-grafana-teams]: https://aws.amazon.com/blogs/mt/fine-grained-access-control-in-amazon-managed-grafana-using-grafana-teams/
[amg-subnet-free-ip-monitoring]: /observability-best-practices/ja/recipes/recipes/amg-subnet-free-ip-monitoring/


# Amazon Managed Grafana

[Amazon Managed Grafana][amg-main] はオープンソースの Grafana をベースにしたフルマネージドサービスで、サーバーのプロビジョニング、ソフトウェアの構成と更新、本番環境での Grafana のセキュリティ確保とスケーリングに関わる重労働を行うことなく、メトリクス、ログ、トレースを分析できます。チームと可視化ダッシュボードを作成し、複数のデータソースに接続して共有できます。

以下のレシピをご確認ください。

## 基本

- [はじめに][amg-gettingstarted]
- [Terraform を使用した自動化][amg-tf-automation]

## 認証とアクセスコントロール

- [アイデンティティプロバイダとのダイレクト SAML インテグレーション][amg-saml]
- [アイデンティティプロバイダ(OneLogin、Ping Identity、Okta、Azure AD) を SSO とインテグレート][amg-idps]
- [SAMLv2 を介した Google 認証のインテグレーション][amg-google-idps] 
- [カスタマーマネージド IAM ロールを使用したクロスアカウント データソースの Amazon Managed Grafana の設定][amg-cross-account-access]
- [Grafana Teams を使用した Amazon Managed Grafana での細かいアクセスコントロール][amg-grafana-teams]

## データソースとビジュアライゼーション

- [Amazon Managed Grafana での Athena の使用][amg-plugin-athena]
- [Amazon Managed Grafana での Redshift の使用][amg-plugin-redshift] 
- [Amazon Managed Service for Prometheus と Amazon Managed Grafana を使用した statsd からのカスタムメトリクスの表示][amg-amp-statsd]
- [カスタマーマネージド IAM ロールを使用したクロスアカウントデータソースの設定][amg-xacc-ds]

## その他のリソース
- [ハイブリッド環境のモニタリング][amg-hybridenvs]
- [規制対象のマルチテナント環境でのGrafanaとLokiの管理][grafana-loki-regenv]
- [Amazon Managed Service for PrometheusとAmazon Managed Grafanaを使用したAmazon EKS Anywhereのモニタリング][amg-anywhere-monitoring]
- [Amazon Managed Grafana のワークショップ][amg-oow]


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

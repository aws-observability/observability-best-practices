# Amazon Managed Grafana

[Amazon Managed Grafana][amg-main] は、オープンソースの Grafana をベースにした完全マネージドサービスで、サーバーのプロビジョニング、ソフトウェアの構成と更新、本番環境での Grafana のセキュリティ対策やスケーリングの作業を行う必要がありません。複数のデータソースに接続し、チームとオブザーバビリティダッシュボードを作成、探索、共有できます。

次のレシピを確認してください:

## 基本

- [はじめに][amg-gettingstarted]
- [Terraform を使った自動化][amg-tf-automation]

## 認証とアクセス制御

- [ID プロバイダーとの直接 SAML 統合][amg-saml]
- [ID プロバイダー (OneLogin、Ping Identity、Okta、Azure AD) を SSO に統合][amg-idps]
- [SAMLv2 経由で Google 認証を統合][amg-google-idps]
- [カスタマー管理の IAM ロールを使用した Amazon Managed Grafana のクロスアカウントデータソースの設定][amg-cross-account-access]
- [Grafana チームを使用した Amazon Managed Grafana の細かいアクセス制御][amg-grafana-teams]

## データソースとビジュアライゼーション

- [Amazon Managed Grafana での Athena の利用][amg-plugin-athena]
- [Amazon Managed Grafana での Redshift の利用][amg-plugin-redshift]
- [Amazon Managed Service for Prometheus と Amazon Managed Grafana を使用した statsd からのカスタムメトリクスの表示][amg-amp-statsd]
- [カスタマー管理の IAM ロールを使用したクロスアカウントデータソースのセットアップ][amg-xacc-ds]

## その他
- [ハイブリッド環境の監視][amg-hybridenvs]
- [規制のある多テナント環境での Grafana と Loki の管理][grafana-loki-regenv]
- [Amazon Managed Service for Prometheus と Amazon Managed Grafana を使用した Amazon EKS Anywhere の監視][amg-anywhere-monitoring]
- [入門ワークショップ][amg-oow]


[amg-main]: https://aws.amazon.com/jp/grafana/
[amg-gettingstarted]: https://aws.amazon.com/jp/blogs/news/amazon-managed-grafana-getting-started/
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

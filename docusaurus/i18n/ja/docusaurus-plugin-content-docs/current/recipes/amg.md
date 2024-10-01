# Amazon Managed Grafana

[Amazon Managed Grafana][amg-main] は、オープンソースの Grafana をベースにした、フルマネージドなサービスです。これにより、サーバーのプロビジョニング、ソフトウェアの構成と更新、Grafana を運用環境でセキュアにスケーリングするための重労働を行うことなく、メトリクス、ログ、トレースを分析できます。チームと可視化ダッシュボードを作成、探索、共有でき、複数のデータソースに接続できます。

以下のレシピをご確認ください。

## 基本

- [はじめに][amg-gettingstarted]
- [Terraform を使用した自動化][amg-tf-automation]

## 認証とアクセスコントロール

- [アイデンティティプロバイダとの直接的な SAML 統合][amg-saml]
- [シングルサインオンのためのアイデンティティプロバイダ(OneLogin、Ping Identity、Okta、Azure AD)の統合][amg-idps] 
- [SAMLv2 を介した Google 認証の統合][amg-google-idps]
- [カスタマーマネージド IAM ロールを使用したクロスアカウント Amazon Managed Grafana データソースの設定][amg-cross-account-access]
- [Grafana Teams を使用した Amazon Managed Grafana でのきめ細かいアクセスコントロール][amg-grafana-teams]

## データソースとビジュアライゼーション

- [Amazon Managed Grafana での Athena の使用][amg-plugin-athena]
- [Amazon Managed Grafana での Redshift の使用][amg-plugin-redshift]
- [Amazon Managed Service for Prometheus と Amazon Managed Grafana を使用した statsd からのカスタムメトリクスの表示][amg-amp-statsd]
- [顧客管理 IAM ロールを使用したクロスアカウント データソースの設定][amg-xacc-ds]

## その他の資料
- [ハイブリッド環境のモニタリング][amg-hybridenvs]
- [規制対象のマルチテナント環境での Grafana と Loki の管理][grafana-loki-regenv]
- [Amazon Managed Service for Prometheus と Amazon Managed Grafana を使用した Amazon EKS Anywhere のモニタリング][amg-anywhere-monitoring]
- [Getting Started ワークショップ][amg-oow]


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

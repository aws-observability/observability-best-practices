---
sidebar_position: 2
---
# リソース設定の追跡

AWS Config は[サポートされている AWS リソース](https://docs.aws.amazon.com/config/latest/developerguide/resource-config-reference.html)の設定を記録および追跡し、現在および過去の設定とともに AWS アカウント内のこれらのリソースのインベントリを作成します。また、設定変更のタイムラインを作成し、AWS インフラストラクチャ全体のリソース属性、関係、および依存関係に関する詳細情報を維持します。ユーザーは AWS Management Console または AWS CLI を介してプログラム的に[コンプライアンス履歴とタイムラインを表示](https://docs.aws.amazon.com/config/latest/developerguide/view-manage-resource-console.html)でき、任意の時点での特定の設定状態をクエリする機能も備えています。


![AWS Config Cost Visualization](/img/cloudops/guides/config/resourcetimeline.png)

### AWS Config カスタムリソース

 AWS Config では、[カスタム Config リソース](https://docs.aws.amazon.com/config/latest/developerguide/customresources.html)を通じて、サポートされている AWS リソースを超えた設定追跡機能を拡張できます。この機能により、サポートされていない AWS リソースを監視したり、オンプレミスサーバー、GitHub リポジトリ、その他のサードパーティリソースなどの外部リソースを追跡したりすることができます。設定が完了すると、サードパーティのリソース設定データを AWS Config に発行し、AWS Config コンソールおよび API を通じて完全なリソースインベントリを表示・監視できます。さらに、AWS Config ルール、適合パック、ベストプラクティス、内部ポリシー、および規制要件を使用して設定コンプライアンスを評価することもできます。

[このブログ記事](https://aws.amazon.com/blogs/mt/using-aws-config-custom-resources-to-track-any-resource-on-aws/)に従って、AWS Config を使用して非標準機能を監視する方法を学んでください。[このブログ記事](https://aws.amazon.com/blogs/mt/simplify-compliance-management-of-multicloud-or-hybrid-resources-with-aws-config/)では、他のクラウドプロバイダーでホストされているリソースを監視する方法のウォークスルーを提供しています。
# SLG/EDU 向け CloudWatch Logs データ保護ポリシー

一般的にログデータは有益ですが、Health Insurance Portability and Accountability Act (HIPAA)、General Data Privacy Regulation (GDPR)、Payment Card Industry Data Security Standard (PCI-DSS)、Federal Risk and Authorization Management Program (FedRAMP) などの厳格な規制を持つ組織にとっては、ログデータをマスキングすることが有用です。

CloudWatch Logs の[データ保護ポリシー](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/logs/cloudwatch-logs-data-protection-policies.html)を使用すると、顧客はデータ保護ポリシーを定義して適用し、転送中のログデータを機密データについてスキャンし、検出された機密データをマスキングすることができます。

これらのポリシーは、パターンマッチングと機械学習モデルを活用して機密データを検出し、アカウント内の CloudWatch ロググループに取り込まれたイベントに表示されるデータを監査およびマスキングするのに役立ちます。

機密データを選択するために使用される技術と基準は、[マッチングデータ識別子](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/logs/cloudwatch-logs-data-protection-policies.html)と呼ばれます。これらの管理されたデータ識別子を使用して、CloudWatch Logs は以下を検出できます：

- 秘密鍵や AWS シークレットアクセスキーなどの認証情報
- IP アドレスや MAC アドレスなどのデバイス識別子
- 銀行口座番号、クレジットカード番号、クレジットカード確認コードなどの金融情報
- 健康保険カード番号（EHIC）や個人健康番号などの保護された健康情報（PHI）
- 運転免許証、社会保障番号、納税者識別番号などの個人を特定できる情報（PII）

:::note
    機密データはロググループに取り込まれる際に検出およびマスキングされます。データ保護ポリシーを設定しても、それ以前にロググループに取り込まれたログイベントはマスキングされません。
:::

上記のデータタイプのいくつかを詳しく説明し、例を見てみましょう：




## データ型




### 認証情報

認証情報は、あなたが誰であるか、そしてリクエストしているリソースへのアクセス権限があるかどうかを確認するために使用される機密性の高いデータタイプです。AWS は、プライベートキーやシークレットアクセスキーなどの認証情報を使用して、リクエストの認証と承認を行います。

CloudWatch Logs データ保護ポリシーを使用すると、選択したデータ識別子に一致する機密データがマスクされます。（セクションの最後でマスクされた例を確認します）。

![認証情報に対する CloudWatch Logs データ保護1](../../../images/cwl-dp-credentials.png)


![認証情報に対する CloudWatch Logs データ保護2](../../../images/cwl-dp-cred-sensitive.png)



:::tip
    データ分類のベストプラクティスは、組織の法的およびコンプライアンス基準を満たす、明確に定義されたデータ分類層と要件から始まります。

    ベストプラクティスとして、組織のデータガバナンスポリシーに従ってコンプライアンスを実装するために、データ分類フレームワークに基づいて AWS リソースにタグを使用してください。
:::

:::tip
    ログイベントに機密データが含まれないようにするためのベストプラクティスは、まずコード内で機密データを除外し、必要な情報のみをログに記録することです。
:::





### 金融情報

Payment Card Industry Data Security Standard (PCI DSS) で定義されているように、銀行口座番号、ルーティング番号、デビットカードおよびクレジットカード番号、クレジットカードの磁気ストリップデータは機密性の高い金融情報とみなされます。

機密データを検出するために、CloudWatch Logs はデータ保護ポリシーを設定すると、ロググループの地理的位置に関係なく、指定したデータ識別子をスキャンします。

![金融情報に関する CloudWatch Logs データ保護](../../../images/cwl-dp-fin-info.png)

:::info
    [金融データタイプとデータ識別子の完全なリスト](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/logs/protect-sensitive-log-data-types-financial.html) を確認してください
:::



### 保護対象医療情報 (PHI)

PHI には、個人を特定できる健康および健康関連データの非常に広範なセットが含まれます。これには、保険および請求情報、診断データ、医療記録やデータセットなどの臨床ケアデータ、画像や検査結果などの検査結果が含まれます。

CloudWatch Logs は、選択されたロググループから健康情報をスキャンして検出し、そのデータをマスクします。

![PHI のための CloudWatch Logs データ保護](../../../images/cwl-dp-phi.png)

:::info
    [PHI データタイプとデータ識別子の完全なリスト](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/logs/protect-sensitive-log-data-types-health.html) を確認してください
:::



### 個人を特定できる情報 (PII)

PII は、個人を特定するために使用される可能性のある個人データへのテキスト参照です。PII の例には、住所、銀行口座番号、電話番号などがあります。

![PHI のための CloudWatch Logs データ保護](../../../images/cwl-dp-pii.png)

:::info
    [PII データタイプとデータ識別子の完全なリスト](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/logs/protect-sensitive-log-data-types-pii.html) を確認してください
:::



## マスクされたログ

データ保護ポリシーを設定したロググループに移動すると、データ保護が `オン` になっており、コンソールには機密データの数も表示されていることがわかります。

![PHI のための CloudWatch Logs データ保護](../../../images/cwl-dp-loggroup.png)

`Log Insights で表示` をクリックすると、Log Insights コンソールに移動します。ログストリーム内のログイベントを確認するために以下のクエリを実行すると、すべてのログのリストが表示されます。

```
fields @timestamp, @message
| sort @timestamp desc
| limit 20
```

クエリを展開すると、以下のようにマスクされた結果が表示されます：

![PHI のための CloudWatch Logs データ保護](../../../images/cwl-dp-masked.png)

:::important
    データ保護ポリシーを作成すると、デフォルトで選択したデータ識別子に一致する機密データがマスクされます。マスクされていないデータを表示できるのは、`logs:Unmask` IAM 権限を持つユーザーのみです。
:::

:::tip
    [AWS IAM and Access Management (IAM)](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/auth-and-access-control-cw.html) を使用して、CloudWatch の機密データへのアクセスを管理および制限します。
:::

:::tip
    クラウド環境の定期的な監視と監査も、機密データを保護する上で同様に重要です。アプリケーションが大量のデータを生成する場合、これは重要な側面となります。そのため、過剰なデータをログに記録しないことが推奨されます。AWS Prescriptive Guidance の [ログ記録のベストプラクティス](https://docs.aws.amazon.com/ja_jp/prescriptive-guidance/latest/logging-monitoring-for-application-owners/logging-best-practices.html) をお読みください。
:::

:::tip
    ロググループのデータは CloudWatch Logs では常に暗号化されています。また、[AWS Key Management Service](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/logs/encrypt-log-data-kms.html) を使用してログデータを暗号化することもできます。
:::

:::tip
    レジリエンスとスケーラビリティのために、CloudWatch アラームを設定し、AWS Amazon EventBridge と AWS Systems Manager を使用して修復を自動化します。
:::


[^1]: 開始するには、AWS ブログの [Amazon CloudWatch Logs で機密データを保護する](https://aws.amazon.com/jp/blogs/news/protect-sensitive-data-with-amazon-cloudwatch-logs/) をご覧ください。

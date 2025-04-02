# SLG/EDU 向け CloudWatch Logs データ保護ポリシー

一般的にログデータは有用ですが、医療保険の携行性と責任に関する法律 (HIPAA)、一般データ保護規則 (GDPR)、支払いカード業界データセキュリティ基準 (PCI-DSS)、連邦リスク認証管理プログラム (FedRAMP) などの厳格な規制を持つ組織にとって、データのマスキングは有用です。

CloudWatch Logs の[データ保護ポリシー](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/logs/cloudwatch-logs-data-protection-policies.html)により、顧客は機密データのトランジットデータをスキャンし、検出された機密データをマスクするデータ保護ポリシーを定義して適用できます。

これらのポリシーは、パターンマッチングと機械学習モデルを活用して機密データを検出し、アカウントの CloudWatch ロググループに取り込まれたイベントに表示されるデータの監査とマスクを支援します。

機密データを選択するために使用される手法と基準は、[マッチングデータ識別子](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/logs/cloudwatch-logs-data-protection-policies.html)と呼ばれます。これらの管理されたデータ識別子を使用して、CloudWatch Logs は以下を検出できます：

- 秘密鍵や AWS シークレットアクセスキーなどの認証情報
- IP アドレスや MAC アドレスなどのデバイス識別子
- 銀行口座番号、クレジットカード番号、クレジットカード確認コードなどの金融情報
- 健康保険カード番号 (EHIC) や個人健康番号などの保護された健康情報 (PHI)
- 運転免許証、社会保障番号、納税者識別番号などの個人を特定できる情報 (PII)

:::note
    機密データはロググループに取り込まれる際に検出およびマスクされます。データ保護ポリシーを設定しても、それ以前にロググループに取り込まれたログイベントはマスクされません。
:::
上記で言及したデータタイプのいくつかについて詳しく見て、例を確認してみましょう：




## データ型




### 認証情報

認証情報は機密性の高いデータ型で、あなたが誰であるか、またリクエストしているリソースへのアクセス権限があるかを確認するために使用されます。
AWS は、プライベートキーやシークレットアクセスキーなどの認証情報を使用して、リクエストの認証と承認を行います。

CloudWatch Logs データ保護ポリシーを使用すると、選択したデータ識別子に一致する機密データがマスクされます。
（セクションの最後でマスクされた例を確認します）。

![The CloudWatch Logs Data Protection for Credentials1](../../../images/cwl-dp-credentials.png)


![The CloudWatch Logs Data Protection for Credentials2](../../../images/cwl-dp-cred-sensitive.png)


:::tip
    データ分類のベストプラクティスは、組織、法律、およびコンプライアンス基準を満たす、明確に定義されたデータ分類層と要件から始まります。

    ベストプラクティスとして、組織のデータガバナンスポリシーに従ってコンプライアンスを実装するために、データ分類フレームワークに基づいて AWS リソースにタグを付けてください。
:::

:::tip
    ログイベントに機密データが含まれることを避けるために、最初からコードで機密データを除外し、必要な情報のみをログに記録することがベストプラクティスです。
:::




### 金融情報

Payment Card Industry Data Security Standard (PCI DSS) で定義されているように、銀行口座、ルーティング番号、デビットカードおよびクレジットカード番号、クレジットカードの磁気ストライプデータは、機密性の高い金融情報とみなされます。

機密データを検出するために、CloudWatch Logs はデータ保護ポリシーを設定すると、ロググループの地理的な場所に関係なく、指定したデータ識別子をスキャンします。

![The CloudWatch Logs Data Protection for Financial](../../../images/cwl-dp-fin-info.png)

:::info
    [金融データタイプとデータ識別子](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/logs/protect-sensitive-log-data-types-financial.html)の完全なリストを確認してください。
:::



### 保護対象医療情報 (PHI)

PHI には、保険および請求情報、診断データ、医療記録やデータセット、画像や検査結果などの臨床ケアデータを含む、非常に幅広い個人を特定できる健康および健康関連データが含まれます。

CloudWatch Logs は、選択されたロググループから医療情報をスキャンして検出し、そのデータをマスクします。

![The CloudWatch Logs Data Protection for PHI](../../../images/cwl-dp-phi.png)

:::info
    [PHI データタイプとデータ識別子](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/logs/protect-sensitive-log-data-types-health.html)の完全なリストを確認してください。
:::



### 個人を特定できる情報 (PII)

PII は、個人を特定するために使用できる個人データへのテキスト参照です。PII の例には、住所、銀行口座番号、電話番号などが含まれます。

![The CloudWatch Logs Data Protection for PHI](../../../images/cwl-dp-pii.png)

:::info
    [PII データタイプとデータ識別子](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/logs/protect-sensitive-log-data-types-pii.html)の完全なリストを確認してください。
:::



## マスクされたログ

データ保護ポリシーを設定したロググループを確認すると、データ保護が `On` になっており、コンソールには機密データの数も表示されています。

![The CloudWatch Logs Data Protection for PHI](../../../images/cwl-dp-loggroup.png)

`View in Log Insights` をクリックすると、Log Insights コンソールに移動します。ログストリーム内のログイベントを確認するために以下のクエリを実行すると、すべてのログのリストが表示されます。

```
fields @timestamp, @message
| sort @timestamp desc
| limit 20
```

クエリを展開すると、以下のようにマスクされた結果が表示されます：

![The CloudWatch Logs Data Protection for PHI](../../../images/cwl-dp-masked.png)

:::important
    データ保護ポリシーを作成すると、デフォルトで選択したデータ識別子に一致する機密データがマスクされます。マスクされていないデータを表示できるのは、`logs:Unmask` IAM 権限を持つユーザーのみです。
:::

:::tip
    CloudWatch の機密データへのアクセスを管理および制限するには、[AWS IAM and Access Management(IAM)](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/auth-and-access-control-cw.html) を使用してください。
:::

:::tip
    クラウド環境の定期的なモニタリングと監査は、機密データを保護する上で同様に重要です。アプリケーションが大量のデータを生成する場合、これは重要な側面となります。そのため、過剰なデータをログに記録しないことが推奨されます。[Logging Best Practices](https://docs.aws.amazon.com/ja_jp/prescriptive-guidance/latest/logging-monitoring-for-application-owners/logging-best-practices.html) の AWS Prescriptive Guidance をご覧ください。
:::

:::tip
    ロググループのデータは CloudWatch Logs では常に暗号化されています。また、[AWS Key Management Service](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/logs/encrypt-log-data-kms.html) を使用してログデータを暗号化することもできます。
:::

:::tip
    レジリエンスとスケーラビリティのために、CloudWatch アラームを設定し、AWS Amazon EventBridge と AWS Systems Manager を使用して修復を自動化してください。
:::

[^1]: 開始するには、AWS ブログの [Protect Sensitive Data with Amazon CloudWatch Logs](https://aws.amazon.com/jp/blogs/news/protect-sensitive-data-with-amazon-cloudwatch-logs/) をご覧ください。

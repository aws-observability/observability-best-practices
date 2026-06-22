# SLG/EDU 向けの CloudWatch Logs データ保護ポリシー

ログデータは一般的に有益ですが、医療保険の相互運用性と説明責任に関する法律 (HIPAA)、一般データ保護規則 (GDPR)、ペイメントカード業界データセキュリティ基準 (PCI-DSS)、連邦リスク・認可管理プログラム (FedRAMP) などの厳格な規制を持つ組織にとって、それらをマスキングすることは有用です。

CloudWatch Logs の[データ保護ポリシー](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/cloudwatch-logs-data-protection-policies.html)を使用すると、転送中のログデータをスキャンして機密データを検出し、検出された機密データをマスクするデータ保護ポリシーを定義および適用できます。

これらのポリシーは、パターンマッチングと機械学習モデルを活用して機密データを検出し、アカウント内の CloudWatch ロググループに取り込まれたイベントに表示されるデータの監査とマスキングを支援します。

機密データの選択に使用される技術と基準は、[データ識別子の照合](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/cloudwatch-logs-data-protection-policies.html)と呼ばれます。これらのマネージド型データ識別子を使用することで、CloudWatch Logs は以下を検出できます。

- プライベートキーや AWS シークレットアクセスキーなどの認証情報
- IP アドレスや MAC アドレスなどのデバイス識別子
- 銀行口座番号、クレジットカード番号、クレジットカード確認コードなどの金融情報
- 健康保険カード番号 (EHIC) や個人健康番号などの保護対象医療情報 (PHI)
- 運転免許証、社会保障番号、納税者番号などの個人を特定できる情報 (PII)

:::note
    機密データは、ロググループに取り込まれる際に検出され、マスクされます。データ保護ポリシーを設定した場合、それ以前にロググループに取り込まれたログイベントはマスクされません。
:::
上記で説明したデータ型のいくつかを詳しく見て、例を確認しましょう。


## データ型

### 認証情報

認証情報は、あなたが誰であるか、およびリクエストしているリソースへのアクセス許可があるかどうかを確認するために使用される機密データタイプです。AWS は、プライベートキーやシークレットアクセスキーなどの認証情報を使用して、リクエストを認証および承認します。

CloudWatch Logs Data Protection ポリシーを使用すると、選択したデータ識別子に一致する機密データがマスクされます。(このセクションの最後にマスクされた例を示します)。

![The CloudWatch Logs Data Protection for Credentials1](../../../images/cwl-dp-credentials.png)


![The CloudWatch Logs Data Protection for Credentials2](../../../images/cwl-dp-cred-sensitive.png)



:::tip
    データ分類のベストプラクティスは、組織、法律、コンプライアンス基準を満たす、明確に定義されたデータ分類階層と要件から始まります。

ベストプラクティスとして、データ分類フレームワークに基づいて AWS リソースにタグを使用し、組織のデータガバナンスポリシーに従ってコンプライアンスを実装します。 
:::

:::tip
    ログイベントに機密データが含まれないようにするには、まずコード内でそれらを除外し、必要な情報のみをログに記録することがベストプラクティスです。
:::


### 財務情報

Payment Card Industry Data Security Standard (PCI DSS) で定義されているように、銀行口座番号、ルーティング番号、デビットカードおよびクレジットカード番号、クレジットカードの磁気ストライプデータは、機密性の高い金融情報とみなされます。

機密データを検出するために、CloudWatch Logs は、データ保護ポリシーを設定すると、ロググループが配置されている地理的な場所に関係なく、指定したデータ識別子をスキャンします。

![The CloudWatch Logs Data Protection for Financial](../../../images/cwl-dp-fin-info.png)

:::info
    [金融データタイプとデータ識別子の完全なリスト](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/protect-sensitive-log-data-types-financial.html)を確認してください。
:::


### 保護対象保健情報 (PHI)

PHI には、保険および請求情報、診断データ、医療記録やデータセットなどの臨床ケアデータ、画像や検査結果などのラボ結果を含む、非常に広範な個人を特定できる健康および健康関連データが含まれます。

CloudWatch Logs は、選択したロググループからヘルス情報をスキャンして検出し、そのデータをマスクします。

![The CloudWatch Logs Data Protection for PHI](../../../images/cwl-dp-phi.png)

:::info
    [phi データタイプとデータ識別子の完全なリスト](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/protect-sensitive-log-data-types-health.html)を確認してください。
:::

### 個人を特定できる情報 (PII)

PII は、個人を特定するために使用される可能性のある個人データへのテキスト参照です。PII の例には、住所、銀行口座番号、電話番号などがあります。

![The CloudWatch Logs Data Protection for PHI](../../../images/cwl-dp-pii.png)

:::info
    [pii データタイプとデータ識別子の完全なリスト](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/protect-sensitive-log-data-types-pii.html)を確認してください。
:::

## マスクされたログ

データ保護ポリシーを設定したロググループに移動すると、データ保護が `On` コンソールには、機密データの数も表示されます。

![The CloudWatch Logs Data Protection for PHI](../../../images/cwl-dp-loggroup.png)

これで、クリックすると `View in Log Insights` Log Insights コンソールに移動します。以下のクエリを実行してログストリーム内のログイベントを確認すると、すべてのログのリストが表示されます。

```
fields @timestamp, @message
| sort @timestamp desc
| limit 20
```

クエリを展開すると、以下に示すようにマスクされた結果が表示されます。

![The CloudWatch Logs Data Protection for PHI](../../../images/cwl-dp-masked.png)

:::important
    データ保護ポリシーを作成すると、デフォルトで、選択したデータ識別子に一致する機密データがマスクされます。次の権限を持つユーザーのみが `logs:Unmask` IAM 権限により、マスクされていないデータを表示できます。
:::

:::tip
    [AWS IAM and Access Management(IAM)](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/auth-and-access-control-cw.html) を使用して、CloudWatch の機密データへのアクセスを管理および制限します。
:::

:::tip
    クラウド環境の定期的な監視と監査は、機密データの保護において同様に重要です。アプリケーションが大量のデータを生成する場合、これは重要な側面となり、手動では対応できなくなるため、過度な量のデータをログに記録しないことが推奨されます。[ログ記録のベストプラクティス](https://docs.aws.amazon.com/prescriptive-guidance/latest/logging-monitoring-for-application-owners/logging-best-practices.html)については、この AWS Prescriptive Guidance をお読みください。
:::

:::tip
    Log Group データは CloudWatch Logs で常に暗号化されます。また、[AWS Key Management Service](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/encrypt-log-data-kms.html) を使用してログデータを暗号化することもできます。
:::

:::tip
    復元性とスケーラビリティのために、CloudWatch アラームを設定し、AWS Amazon EventBridge と AWS Systems Manager を使用して修復を自動化します。 
:::


[^1]: Check our AWS blog [Protect Sensitive Data with Amazon CloudWatch Logs](https://aws.amazon.com/blogs/aws/protect-sensitive-data-with-amazon-cloudwatch-logs/) to get started.


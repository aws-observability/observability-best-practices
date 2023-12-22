# CloudWatch Logs のデータ保護ポリシー (SLG/EDU)

ログデータは一般的には有益ですが、医療保険の相互運用性と説明責任に関する法律 (HIPAA)、一般データ保護規則 (GDPR)、決済カード業界データセキュリティ基準 (PCI-DSS)、連邦リスクおよび認定管理プログラム (FedRAMP) などの厳格な規制を持つ組織にとっては、それらのマスキングが有用です。

CloudWatch Logs の[データ保護ポリシー](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/logs/cloudwatch-logs-data-protection-policies.html) を使用すると、お客様はログデータ内を通過する機密データをスキャンし、検出された機密データをマスクするデータ保護ポリシーを定義および適用できます。 

これらのポリシーは、パターンマッチングと機械学習モデルを利用して機密データを検出し、アカウントの CloudWatch ロググループにインジェストされたイベントに表示されるそれらのデータを監査およびマスクするのに役立ちます。

機密データの選択に使用されるテクニックと基準を[マッチングデータ識別子](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/logs/cloudwatch-logs-data-protection-policies.html)と呼びます。 これらのマネージドデータ識別子を使用することで、CloudWatch Logs は次のものを検出できます。

- プライベートキーや AWS のシークレットアクセスキーなどの資格情報
- IP アドレスや MAC アドレスなどのデバイス識別子  
- 銀行口座番号、クレジットカード番号、クレジットカード確認コードなどの金融情報
- 健康保険カード番号 (EHIC) や個人健康番号などの保護された健康情報 (PHI)
- 運転免許証、社会保障番号、納税者番号などの個人を特定できる情報 (PII)

!!! important
    機密データは、ロググループにインジェストされると検出され、マスクされます。 データ保護ポリシーを設定すると、その時点より前にロググループにインジェストされたログイベントはマスクされません。

上記で言及したデータタイプのいくつかを詳しく説明し、例を見ていきましょう。

## データ型

### 認証情報

認証情報は、あなたが誰であるか、リクエストしているリソースへのアクセス権限があるかどうかを確認するために使用される機密データ型です。AWS はこれらの認証情報(プライベートキーやシークレットアクセスキーなど)を使用して、リクエストの認証と承認を行います。

CloudWatch Logs データ保護ポリシーを使用すると、選択したデータ識別子に一致する機密データがマスクされます(セクションの最後にマスクされた例を示します)。

![CloudWatch Logs データ保護の認証情報1](../../../images/cwl-dp-credentials.png)


![CloudWatch Logs データ保護の認証情報2](../../../images/cwl-dp-cred-sensitive.png)



!!! Tip
    データ分類のベストプラクティスは、組織、法的、コンプライアンス基準を満たす明確に定義されたデータ分類ティアと要件から始まります。

    ベストプラクティスとして、組織のデータガバナンスポリシーに準拠したコンプライアンスを実装するために、データ分類フレームワークに基づいて AWS リソースにタグを付けます。


!!! Tip
    ログイベントに機密データが含まれないようにするには、最良の方法は最初にコードで除外することで、必要な情報のみをログに記録することです。

### 金融情報

決済カード業界データセキュリティ基準(PCI DSS)で定義されているように、銀行口座番号、ルーティング番号、デビットカードとクレジットカードの番号、クレジットカードの磁気ストライプデータは、機密金融情報と見なされます。

機密データを検出するために、CloudWatch Logs はデータ保護ポリシーを設定した後、ロググループが位置する地域に関係なく、指定したデータ識別子をスキャンします。

![CloudWatch Logs の金融情報用データ保護](../../../images/cwl-dp-fin-info.png)

!!! info
    [金融データタイプとデータ識別子の完全なリスト](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/protect-sensitive-log-data-types-financial.html)を確認してください

### 個人識別保健情報(PHI)

PHI には、保険や請求情報、診断データ、医療記録やデータセット、画像や検査結果などの臨床ケアデータを含む、非常に広範囲の個人識別可能な健康および健康関連データが含まれます。

CloudWatch Logs は、選択したロググループから健康情報をスキャンおよび検出し、そのデータをマスクします。

![CloudWatch Logs による PHI のデータ保護](../../../images/cwl-dp-phi.png)

!!! info
    [phi データタイプとデータ識別子の完全なリスト](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/protect-sensitive-log-data-types-health.html) を確認してください

### 個人を特定できる情報(PII)

PII は、個人を特定するのに使用できる個人データへのテキスト参照です。PII の例には、住所、銀行口座番号、電話番号があります。

![The CloudWatch Logs Data Protection for PHI](../../../images/cwl-dp-pii.png)

!!! info
    [pii データタイプとデータ識別子の完全なリスト](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/protect-sensitive-log-data-types-pii.html)を確認してください

## マスクされたログ

データ保護ポリシーを設定したロググループに移動すると、データ保護が `On` になっており、コンソールには機密データのカウントも表示されます。

![The CloudWatch Logs Data Protection for PHI](../../../images/cwl-dp-loggroup.png)

ここで、`View in Log Insights` をクリックすると、Log Insights コンソールに移動します。以下のクエリを実行して、ログストリーム内のログイベントを確認すると、すべてのログのリストが表示されます。

```
fields @timestamp, @message
| sort @timestamp desc
| limit 20
```

クエリを展開すると、以下のようにマスクされた結果が表示されます。

![The CloudWatch Logs Data Protection for PHI](../../../images/cwl-dp-masked.png)

!!! important
    データ保護ポリシーを作成すると、デフォルトで選択したデータ識別子と一致する機密データがマスクされます。 `logs:Unmask` IAM アクセス許可を持つユーザーのみがマスクされていないデータを表示できます。


!!! Tip
    [AWS IAM とアクセス管理(IAM)](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/auth-and-access-control-cw.html) を使用して、CloudWatch の機密データへのアクセスを管理および制限します。


!!! Tip
    機密データを保護するためには、クラウド環境の定期的なモニタリングと監査が同様に重要です。アプリケーションが大量のデータを生成する場合、これはクリティカルな側面となり、過剰な量のデータを記録することは推奨されません。[ロギングのベストプラクティス](https://docs.aws.amazon.com/prescriptive-guidance/latest/logging-monitoring-for-application-owners/logging-best-practices.html) に関するこの AWS 推奨ガイダンスを読んでください。


!!! Tip
    CloudWatch Logs のロググループデータは常に暗号化されています。または、[AWS Key Management Service](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/encrypt-log-data-kms.html) を使用してログデータを暗号化することもできます。


!!! Tip
    回復力とスケーラビリティのために、CloudWatch アラームを設定し、AWS Amazon EventBridge と AWS Systems Manager を使用して自動修復を行ってください。



[^1]: 機密データの保護を開始するには、AWS ブログの [Protect Sensitive Data with Amazon CloudWatch Logs](https://aws.amazon.com/blogs/aws/protect-sensitive-data-with-amazon-cloudwatch-logs/) をご確認ください。

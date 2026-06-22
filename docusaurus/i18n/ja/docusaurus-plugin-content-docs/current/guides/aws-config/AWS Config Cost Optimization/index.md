---
sidebar_position: 4
---
# AWS Config のコスト最適化

### 料金

[AWS Config の料金](https://aws.amazon.com/config/pricing/)は、主に 2 つの主要なディメンションに基づいています。

1. 設定アイテムの記録：

* 継続的な記録
        AWS 環境内のすべての設定変更をリアルタイムで継続的に監視および記録します。これにより、すべてのリソース変更に対する包括的な可視性が提供され、変更が発生した際に追跡および監査することができます。
    * 定期的な記録
        リソース設定の日次スナップショットを取得し、前の 24 時間の状態と異なる場合にのみ変更を記録します。このアプローチは、監視とコスト効率のバランスを提供し、データ量を削減しながら重要な変更を記録します。

1. ルールと適合パックの評価：
    AWS Config は、個別の Config ルール評価、または適合パックの一部としての Config ルール評価に対して課金します。

AWS Config の料金に関する最新の詳細については、[こちらのリンクをご参照ください](https://aws.amazon.com/config/pricing/)。

上記が主な料金コンポーネントですが、AWS Config の使用総コストに影響を与える可能性のある他の要因もあります。

1. [AWS Lambda](https://aws.amazon.com/lambda/pricing/) のコスト: Lambda 関数を介して実装されたカスタムルールを使用している場合、標準の Lambda 料金が適用されます。
2. [Amazon S3](https://aws.amazon.com/s3/pricing/) ストレージ: S3 に設定スナップショットと履歴ファイルを保存するためのコストが発生します。
3. データ転送: AWS サービス間またはリージョン間のデータ転送に料金が適用される場合があります。



### コスト最適化の推奨事項

#### Config コストの分析

[AWS Cost Explorer](https://aws.amazon.com/aws-cost-management/aws-cost-explorer/) は、サービスの使用状況をフィルタリングしてコストディメンションを分析することで、AWS Config のコストに関するインサイトを提供します。これを行うには、[Billing and Cost Management コンソール](https://us-east-1.console.aws.amazon.com/costmanagement/home#/home)に移動し、左パネルから **Cost Explorer** を選択します。右パネルで、希望する期間などのパラメータを設定し、必要な詳細レベルに応じて希望する粒度（日次または月次）を選択します。**Group by** セクションの **Dimensions** から **Usage Type** を選択します。**Filters** で **Service** に移動し、**Config** を選択します。

![AWS Config Cost Visualization](/img/cloudops/guides/config/configcost.png)

[Amazon CloudWatch の](https://aws.amazon.com/cloudwatch/)「ConfigurationItemsRecorded」メトリクスは、最も多くの設定アイテムを生成しているリソースタイプを特定するのに役立ちます。[AWS Config リソースの変更を CloudWatch メトリクスを使用して分析する方法](https://aws.amazon.com/blogs/mt/analyzing-aws-config-resource-changes-using-cloudwatch-metrics/)に関するブログを参照してください。詳細な分析には、[Amazon Athena](https://aws.amazon.com/athena/) を使用して、[AWS CloudTrail](https://aws.amazon.com/cloudtrail/) および [CloudTrail Lake](https://docs.aws.amazon.com/awscloudtrail/latest/userguide/cloudtrail-lake.html) と組み合わせた[コストと使用状況レポート](https://aws.amazon.com/aws-cost-management/aws-cost-and-usage-reporting/)をクエリし、Config レコーダーのコストの見積もりや頻繁に評価されるルールの追跡に役立てることができます。[Athena を使用して AWS Config データを分析する方法](https://aws.amazon.com/blogs/mt/use-amazon-athena-and-aws-cloudtrail-to-estimate-billing-for-aws-config-rule-evaluations/)に関するブログも参照してください。

コストアラートについては、コストが事前に定義されたしきい値を超えた場合に[AWS Budgets](https://aws.amazon.com/aws-cost-management/aws-budgets/)を通じてプロアクティブなコスト管理を実装してください。また、[AWS Cost Anomaly Detection](https://aws.amazon.com/aws-cost-management/aws-cost-anomaly-detection/)サービスは異常な支出パターンを継続的に監視し、コストの急増を迅速に特定して対処しやすくします。さらに、推定料金が定義されたしきい値を超えた場合に通知する[CloudWatch の請求アラーム](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/monitor_estimated_charges_with_cloudwatch.html)を作成することもできます。  

#### 継続的記録と定期的記録の選択

AWS Config を実装する際、適切な記録方法を選択することは、コストとコンプライアンス要件のバランスを取る上で非常に重要です。[継続的な記録](https://docs.aws.amazon.com/config/latest/developerguide/config-concepts.html#continuous-recording)は、リソースが比較的安定している静的なワークロードに対してコスト効率が高い場合が多くあります。このオプションは、リアルタイムモニタリングと設定変更への即時可視性を必要とする、厳格なセキュリティおよびコンプライアンス要件を持つ環境に特に推奨されます。本番データベース、コアネットワークリソース、機密データ処理システムなどの重要なインフラストラクチャコンポーネントは、通常、継続的な記録から恩恵を受けます。一方、[定期的な記録](https://docs.aws.amazon.com/config/latest/developerguide/config-concepts.html#periodic-recording)は、コンテナ化された環境のエフェメラルリソースや頻繁にスケールアップ・ダウンするインフラストラクチャなど、高度に動的なワークロードに対してより経済的な場合があります。具体的な例としては、オートスケーリンググループを使用した開発環境、コンテナオーケストレーションプラットフォーム、または一時的なテスト環境などが挙げられます。ただし、定期的な記録はリアルタイムではなく 24 時間ごとに更新を提供するため、コンプライアンス要件が低いワークロードにのみ実装すべきである点に注意が必要です。また、定期的な記録では、配信される設定アイテムあたりのコストが継続的な記録よりも高くなるため、特定のシナリオでは定期的な記録の総コストが継続的な記録を上回る可能性があります。これらの記録方法の選択は、定期的なスナップショットで十分な運用計画や、継続的なモニタリングが必要なコンプライアンス監査など、特定のユースケースに沿って行われることが多くあります。組織はこの決定を行う際に、セキュリティ要件、運用パターン、および予算上の制約を慎重に評価する必要があります。


#### リソースの除外

AWS Config は[リソース除外](https://docs.aws.amazon.com/config/latest/developerguide/select-resources.html)機能を通じてコスト最適化を実現し、組織が設定監視コストを戦略的に管理できるようにします。リスクプロファイルとの関連性が低い特定のリソースタイプや、大量の設定アイテムを生成するリソースタイプを除外することで、重要なセキュリティ監視を維持しながらコストを大幅に削減できます。この機能は、AWS Management Console および CLI の AWS Config 設定からアクセスおよび設定できます。ただし、リソース除外の実施にあたっては、慎重な検討と適切なステークホルダーの関与が必要です。組織はセキュリティチームおよびオペレーションチームを巻き込み、監視とコンプライアンス要件にとって重要なリソースと、安全に除外できるリソースを徹底的に評価する必要があります。目標は、コスト効率と堅牢なガバナンス体制の維持との間で最適なバランスを実現することです。たとえば、一時的な開発リソースは除外の候補となる場合がありますが、重要な本番インフラストラクチャは通常、継続的な監視の対象として維持する必要があります。除外を実施する前に、[AWS のセキュリティベストプラクティス](https://docs.aws.amazon.com/config/latest/developerguide/security-best-practices.html)を確認し、[AWS Well-Architected Framework](https://aws.amazon.com/architecture/well-architected/) を参照して、意思決定がセキュリティおよびコンプライアンス要件に沿っていることを確認することをお勧めします。さらに、ビジネスニーズとセキュリティ要件が時間とともに変化するにつれて、組織は除外ポリシーを定期的に見直す必要があります。

[AWS Control Tower](https://aws.amazon.com/controltower/) は現在、config recorder のカスタマイズをサポートしていないことに注意が必要です。ただし、ネイティブサポートが追加されるまでの間、Control Tower 環境で AWS Config リソーストラッキングをカスタマイズするための回避策が[このブログで説明されています](https://aws.amazon.com/blogs/mt/customize-aws-config-resource-tracking-in-aws-control-tower-environment/)。


#### 主要な設定項目

[AWS::Config::ResourceCompliance](https://docs.aws.amazon.com/config/latest/developerguide/view-compliance-history.html) は、特に多数のルール評価を持つお客様にとって、最も影響力の大きい CI ジェネレーターの 1 つであることがよくあります。このリソースタイプは、AWS Config コンソールでコンプライアンスステータスのタイムラインビューを提供します。貴重なインサイトを提供する一方で、特に大規模なリソースを評価する際に、設定アイテムのコストを大幅に増加させる可能性があります。その場合は、コストを削減するためにこのリソースタイプの除外を検討することができます。

過去のコンプライアンスチェックには、CloudTrail データをコスト不要の代替手段として活用できます。お客様は以下のクエリを変更して、Athena やサードパーティソリューションで使用したり、CloudTrail Lake が有効になっている場合はそちらで使用したりすることができます。 


```
SELECT
    eventTime,awsRegion, recipientAccountId, element_at(additionalEventData, 'configRuleName'
    ) as configRuleName, json_extract_scalar(json_array_get(element_at(requestParameters,'evaluations'
        ),0
        ),'$.complianceType'
    ) as Compliance, json_extract_scalar(json_array_get(element_at(requestParameters,'evaluations'
        ),0
        ),'$.complianceResourceType'
    ) as ResourceType, json_extract_scalar(json_array_get(element_at(requestParameters,'evaluations'
        ),0
        ),'$.complianceResourceId'
    ) as ResourceName
FROM
    $EDS_ID
WHERE
    eventName='PutEvaluations'
    and eventTime > '2022-03-17 00:00:00'
    AND eventTime < '2022-03-18 00:00:00'
    And json_extract_scalar(json_array_get(element_at(requestParameters,'evaluations'
        ),0
        ),'$.complianceType'
    ) IN ('COMPLIANT','NON_COMPLIANT')
```



#### AWS Config の間接的な関係

AWS Config には 2 種類の関係があります。
直接的な関係：

* リソースの設定データから抽出されたシンプルな A→B の関係
* describe API 呼び出しから直接取得
* 例: Amazon EC2 インスタンスとそのセキュリティグループの関係は直接的です。これは、セキュリティグループが Amazon EC2 インスタンスの describe API レスポンスに含まれているためです。

間接的な関係：

* 古いリソースタイプでは、複数のリソース設定を調べることで設定が記録される場合があります
* 例：セキュリティグループと Amazon EC2 インスタンスの関係は間接的です。セキュリティグループを記述しても、それに関連付けられているインスタンスに関する情報は返されないためです。この場合、AWS Config は 2 つの設定アイテムを作成します。

間接的な関係をサポートするリソースの詳細については、[このリンク](https://docs.aws.amazon.com/config/latest/developerguide/faq.html)を参照してください。

間接的な関係をオプトアウトするには、[テクニカルアカウントマネージャー](https://aws.amazon.com/premiumsupport/plans/enterprise/)にお問い合わせいただくことをお勧めします。

#### ルール管理と評価に関する考慮事項 

AWS Config ルールを管理する際は、ルールの削除と再評価のアクションを考慮してください。これらはコストに大きな影響を与える可能性があります。大量のリソースを評価するルールを削除する場合、コスト効率の高いアプローチとして、まず[リソースコンプライアンスの記録](https://docs.aws.amazon.com/config/latest/developerguide/stop-start-recorder.html)を停止し、次にルールを削除し、最後にコンプライアンスの記録を再開することをお勧めします。このアクションは保存済みデータには影響しませんが、レコーダーが停止している間はリソース設定の可視性に影響します。この順次処理により、設定アイテムの生成と関連コストの不必要な急増を防ぐことができます。

#### API コールの最適化 

効率的な API オペレーションにより、AWS Config のコストを削減できます。[EC2 インスタンス](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/Using_Tags.html)に複数のタグを追加するなど、リソースを変更する場合は、個別に複数回呼び出すのではなく、変更を 1 回の API 呼び出しにまとめることをお勧めします。たとえば、10 個のタグを 1 回の API 呼び出しで追加する方が、10 回に分けて呼び出すよりも効率的です。各呼び出しは API 変更レコードとリソースコンプライアンス設定アイテムの両方を生成するためです。

#### カスタムルールと Lambda 関数の最適化 

カスタムルールの実装には、実行コストを削減するために Lambda 関数よりも [CloudFormation Guard](https://docs.aws.amazon.com/cfn-guard/latest/ug/what-is-guard.html) の使用が推奨されます。ただし、Lambda ベースのカスタムルールが必要な場合は、以下の方法で最適化してください。

* 特定のターゲティングを使用して評価対象リソースのスコープを絞り込む。スコープベースのルールは、定期的な評価ではなくイベントベースの評価にのみサポートされています
* リソースタグ付けを実装してより適切な制御を行う
* 削除されたリソースの評価終了を処理するロジックを追加する
* すべてのリソースを評価するのではなく、リソース固有のトリガーを使用する

#### Conformance Pack とルールの重複排除 

ルールと[コンフォーマンスパック](https://docs.aws.amazon.com/config/latest/developerguide/conformance-packs.html)の定期的な監査は、冗長性を排除するために不可欠です。たとえば、複数のコンフォーマンスパックに同じルール（CloudTrail の有効化チェックなど）が含まれており、それがすでに [AWS Security Hub](https://aws.amazon.com/security-hub/) によって評価されている場合は、不要な評価コストを避けるために重複するルールを削除することを検討してください。コストを最適化しながら有効性を維持するために、異なるコンプライアンス標準にまたがる重複するルールを確認して統合してください。重複する AWS Config ルールを検出するには、[このブログ](https://aws.amazon.com/blogs/security/discover-duplicate-aws-config-rules-for-streamlined-compliance/)を参照してください。

#### AWS Config におけるグローバルリソース記録の最適化

複数のリージョンにわたって AWS Config を実装する場合、グローバルリソースの記録を最適化してコストを管理し、重複したデータ収集を防ぐことができます。ベストプラクティスは、AWS 環境内の単一リージョンにグローバルリソースの記録を限定することです。これは、AWS CloudFormation テンプレートで IncludeGlobalResourceTypes プロパティを true に設定するリージョンを 1 つだけ指定することで管理できます。このアプローチは、IAM ユーザー、ロール、ポリシーなど、本質的にグローバルなリソースに対して重要です。このアプローチを実装することで、組織は複数のリージョンにわたるグローバルリソース記録の不要な重複を回避でき、グローバルリソースへの包括的な可視性を維持しながら、大幅なコスト削減を実現できます。 

#### 統合サービスの最適化 

AWS Config はさまざまな AWS サービスと連携しており、それぞれが全体的なコストに影響します。統合されたサービスのコストを最適化するために、これらのサービスのベストプラクティスを実装してください。
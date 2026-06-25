---
sidebar_position: 3
---
# CloudTrail Lake
CloudTrail Lake は、取り込まれたイベントを集約し、不変の状態で保存してクエリを実行することで、組織向けのマネージドデータレイクを提供します。組織はこれらのイベントを監査、セキュリティ調査、および運用調査に活用できます。CloudTrail Lake は、収集、保存、準備、および分析とクエリのための最適化を CloudTrail 内で統合することで、分析ワークフローを簡素化します。以下では、CloudTrail Lake に関するいくつかのベストプラクティスを概説します。  

### 適切な料金オプションの選択
イベントデータストアを作成する際は、毎月取り込む予定のイベントの種類と量に合った料金オプションを選択することが重要です。ほとんどの場合、1 年間の延長可能な保持期間の料金オプションが最もコスト効率の高いアプローチです。ただし、月に 25 TB を超えるデータを取り込む場合は、7 年間の保持期間の料金オプションの方が適している場合があります。

![CloudTrail Lake Pricing Option](/img/cloudops/guides/cloudtrail-lake/price-option-eds.png "CloudTrail Lake Pricing Option")

### Lake クエリフェデレーション
Lake クエリフェデレーションを有効にすることをお勧めします。これにより、Athena からのゼロ ETL 分析のためにイベントデータストアを設定できるようになります。これにより、S3 に保存されているアプリケーションログやコストと使用状況データとアクティビティログを関連付けるためのデータ処理パイプラインを構築する運用上の複雑さが解消されます。また、Athena 内で他のデータセットに対してクロスジョインクエリを実行することも可能になります。この機能を有効にすると、LakeFormation を使用してイベントデータストアへのフェデレートリンクを提供するため、CloudTrail データをレプリケートまたは移動する必要もなくなります。この機能を使用すると、LakeFormation を活用してデータフィルターを作成し、イベントデータストア内のデータのサブセットを組織内の他のアカウントと共有することもできます。詳細については、次のブログをご覧ください：[アカウント間でデータをレプリケートせずに AWS CloudTrail Lake ログを安全に共有する](https://aws.amazon.com/blogs/mt/securely-share-aws-cloudtrail-lake-logs-across-accounts-without-replicating-data/)

### リソースベースのポリシーを設定する
リソースベースのポリシーを設定して、他の IAM プリンシパルに権限を付与することができます。これにより、EDS を他のメンバーアカウントと共有し、CloudTrail データをクエリできるようになります。特定の IAM プリンシパルにイベントデータストアをクエリするアクセス権を付与できるため、他のアカウントへのイベントの複製やコピーの必要性を回避するのに役立ちます。

### イベントデータストアのタグを設定する
イベントデータストアにタグを追加すると、これらのタグをユーザー定義のコスト配分タグとして追加することで、CloudTrail Lake イベントデータのクエリおよびインジェストコストを追跡できます。イベントデータストアのタグのもう 1 つのユースケースは、イベントデータストアを管理またはクエリできるユーザーを定義するリソースベースの IAM ポリシーを追加することです。

### イベントデータストアのデータイベントを取り込む
データイベントは、リソース上またはリソース内で実行されるリソース操作への可視性を提供します。CloudTrail データイベントは、さまざまなリソースタイプをサポートしています。サポートされているリソースタイプの完全なリストについては、ドキュメント [CloudTrail データイベント](https://docs.aws.amazon.com/awscloudtrail/latest/userguide/logging-data-events-with-cloudtrail.html#logging-data-events) をご覧ください。これらのイベントはデータプレーン操作とも呼ばれます。データイベントは、特に S3 に機密データを保存している場合や、Lambda 関数を通じて重要なビジネス操作が行われている場合、高ボリュームのアクティビティになることが多いです。機密データへの予期しないアクセスを可視化することで、データを保護するための是正措置を講じることができます。一部のコンプライアンスレポート（例：FedRAMP および PCI-DSS）ではデータイベントの有効化が必要とされているため、AWS は AWS Config マネージドルールまたは適切な Conformance Pack サンプルテンプレートを使用して、少なくとも 1 つのトレイルがすべての S3 バケットの S3 データイベントをログに記録していることを確認することを推奨しています。

### 過去の CloudTrail Trail イベントのインポート
CloudTrail Trails から CloudTrail Lake に移行する際は、「Copy Trail event」機能を使用して、イベントデータストア作成前に記録された既存のトレイルイベントを CloudTrail Lake イベントデータストアにコピーしてください。これにより、CloudTrail トレイルに対応する Amazon Simple Storage Service (Amazon S3) バケットから CloudTrail Lake EDS にイベントをインポートできます。ただし、この機能を使用する際は、インポートの日付範囲を指定することをお勧めします。これにより、Lake での長期保存と分析に必要なログのサブセットのみをインポートできます。指定した日付範囲外のログのインポートに関連する追加コストを防ぐのに役立ちます。

![CloudTrail Lake Copy trail events](/img/cloudops/guides/cloudtrail-lake/copy-trail-eds.png "CloudTrail Lake Copy trail events")

### イベントデータストアに取り込まれた CloudTrail イベントの拡張フィルタリングオプション
強化されたイベントフィルタリング機能により、CloudTrail Lake のイベントデータストアに取り込む CloudTrail イベントをより細かく制御できるようになります。これらの強化されたフィルタリングオプションにより、AWS アクティビティデータをより厳密に管理し、セキュリティ、コンプライアンス、および運用調査の効率と精度を向上させることができます。さらに、新しいフィルタリングオプションを使用することで、最も関連性の高いイベントデータのみを CloudTrail Lake のイベントデータストアに取り込み、分析ワークフローのコストを削減できます。

eventSource、eventType、eventName、userIdentity.arn、sessionCredentialFromConsole などの属性に基づいて、Advanced Event Collection を使用して管理イベントをフィルタリングし、含めるまたは除外するイベントをフィルタリングできます。

データイベントを使用する場合は、高度なイベントセレクターの使用をお勧めします。高度なイベントセレクターを使用すると、イベントデータストアに取り込む CloudTrail イベントをより細かく制御できます。高度なイベントセレクターでは、EventSource、EventName、userIdentity.arn、ResourceARN などのフィールドの値を含めたり除外したりすることができます。また、高度なイベントセレクターは、部分文字列のパターンマッチングによる値の包含または除外もサポートしています。

CloudTrail に拡張フィルターを使用することで、セキュリティ、コンプライアンス、および運用調査の効率と精度を高めながら、コストの削減にも役立てることができます。たとえば、userIdentity.arn 属性に基づいて CloudTrail イベントをフィルタリングし、特定の IAM ロールやユーザーによって生成されたイベントを除外することができます。監視目的で頻繁に API 呼び出しを行うサービスが使用する専用の IAM ロールを除外することも可能です。これにより、CloudTrail Lake に取り込まれる CloudTrail イベントの量を大幅に削減し、関連するユーザーおよびシステムアクティビティへの可視性を維持しながらコストを低減できます。

![CloudTrail Lake Data Events](/img/cloudops/guides/cloudtrail-lake/cloudtrail-data-events-advanced-selector.png "Advanced Event Selectors for Data Events")

### SQL クエリ
SQL クエリを実行する際は、クエリに開始および終了の eventTime タイムスタンプを追加してクエリを制限することをお勧めします。これにより、クエリのためにデータがスキャンされる際のコストを最小限に抑えることができます。これを行うには、where 句に eventtime フィールドを追加し、使用したい時間範囲で検索される時間範囲を指定します。eventTime > の後に指定された日付文字列は含まれる最も古いイベントタイムスタンプであり、eventTime < の後に指定された日付文字列は含まれる最も新しいイベントタイムスタンプです。次のクエリは、eventtime フィールドの使用方法を示すサンプルです。

```sql
SELECT eventTime, useridentity.arn, awsRegion FROM $EDS_ID WHERE eventTime > '2024-07-20 00:00:00' AND eventTime < '2024-07-23 00:00:00' AND awsRegion in ('us-east-1') AND eventName = 'ConsoleLogin'
```

### 自然言語プロンプト
CloudTrail Lake に保存されているアクティビティログ（管理イベントおよびデータイベント）を分析する際、SQL クエリを記述したり、アクティビティイベントのクエリに必要な SQL 構文を理解するための時間を費やしたりすることなく、自然言語クエリプロセッサを使用して分析を始めることができます。NLQ は、クエリしたい内容を質問するだけで使用する SQL クエリを提示してくれるため、データへのインサイトをより迅速に得るのにも役立ちます。

### CloudTrail クエリ結果の整合性検証
CloudTrail Lake のクエリ結果整合性検証を使用すると、結果がエクスポートされた際にクエリ結果が変更、削除、または改ざんされたかどうかを確認できます。クエリ結果を検証することで、CloudTrail によって配信されたエクスポート結果ファイルに変更が加えられていないことを確認できます。結果を検証するには、AWS CLI の **verify-query-results** コマンドを使用して、各クエリ結果ファイルのハッシュ値を署名済みファイルのハッシュ値と照合できます。 

### CloudTrail Lake の使用状況を監視する CloudWatch アラートのセットアップ
CloudTrail Lake のサポートされている CloudWatch メトリクスにアラームと通知を作成することで、一定期間にわたるイベントデータストアの使用状況を追跡できます。その後、特定のしきい値を超えた際に通知するアラートを設定できます。CloudWatch を使用すると、HourlyDataIngested、TotalDataRetained、TotalStorageBytes、TotalPaidStorageBytes などのメトリクスを監視し、CloudTrail Lake の全体的なデータ使用状況をより詳細に把握できます。たとえば、CloudTrail Lake イベントデータストアのサイズを表示する CloudWatch ダッシュボードを作成できます。

```sql
SORT(SEARCH('{AWS/CloudTrail,"Event data store ID","Lake Metrics"} MetricName="TotalPaidStorageBytes" NOT "Lake Metrics"="IngestionMetrics"',"Sum"),SUM, DESC)
```
![CloudTrail Lake Event Data Store Size](/img/cloudops/guides/cloudtrail-lake/cloudtrail-lake-storage-size.png "CloudTrail Lake Event Data Store Size")

### CloudTrail Lake ダッシュボード
CloudTrail Lake に保存されているイベントデータストアのイベントトレンドを視覚化するために、CloudTrail Lake ダッシュボードを有効にすることをお勧めします。ハイライトダッシュボードでは、CloudTrail Lake でキャプチャされたデータの全体的なサマリーをわかりやすく表示します。これにより、上位の失敗した API コール、失敗したログイン試行のトレンド、リソース作成のスパイクなど、イベントデータストア内の重要なインサイトを迅速に特定して把握するためのダッシュボードが提供されます。CloudTrail Lake ダッシュボードでは、特定の AWS サービスに関するその他のマネージドダッシュボードも提供されており、そのサービスに関するさらなるインサイトを得ることができます。また、独自のウィジェットや、マネージドダッシュボードの特定のウィジェットを表示するカスタムダッシュボードを作成することもできます。


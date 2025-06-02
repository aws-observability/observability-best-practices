# リソースタグでフィルタリングされたメトリクスを Amazon CloudWatch Metrics explorer で集計・可視化する

このレシピでは、Metrics explorer を使用してリソースタグとリソースプロパティでメトリクスをフィルタリング、集計、可視化する方法を説明します - [Metrics explorer を使用してタグとプロパティでリソースをモニタリングする][metrics-explorer]。

Metrics explorer で可視化を作成する方法は複数ありますが、このチュートリアルでは AWS コンソールを使用します。

:::note
    このガイドは約 5 分で完了します。
:::



## 前提条件

* AWS アカウントへのアクセス
* AWS コンソールを介した Amazon CloudWatch Metrics explorer へのアクセス
* 関連リソースに設定されたリソースタグ





## タグベースのメトリクスエクスプローラーのクエリと可視化

* CloudWatch コンソールを開きます

* <b>メトリクス</b> の下にある <b>エクスプローラー</b> メニューをクリックします

![Screen shot of metrics filtered by tag](../images/metrics-explorer-filter-by-tags/metrics-explorer-cw-menu.png)

* <b>汎用テンプレート</b> または <b>サービスベースのテンプレート</b> リストから選択できます。この例では、<b>EC2 インスタンスタイプ別</b> テンプレートを使用します

![Screen shot of metrics filtered by tag](../images/metrics-explorer-filter-by-tags/metrics-explorer-templates-ec2-by-type.png)

* 探索したいメトリクスを選択します。不要なものを削除し、表示したい他のメトリクスを追加します

![Screen shot of the EC2 metrics](../images/metrics-explorer-filter-by-tags/metrics-explorer-ec2-metrics.png)

* <b>From</b> の下で、探しているリソースタグまたはリソースプロパティを選択します。以下の例では、<b>Name: TeamX</b> タグを持つ異なる EC2 インスタンスの CPU とネットワーク関連のメトリクス数を表示しています

![Screen shot of the Name tag example](../images/metrics-explorer-filter-by-tags/metrics-explorer-teamx-name-tag.png)

* <b>集計方法</b> の下で時系列を集計関数を使用して組み合わせることができます。以下の例では、<b>TeamX</b> のメトリクスを <b>アベイラビリティーゾーン</b> で集計しています

![Screen shot of the EC2 dashboard filter by tag Name](../images/metrics-explorer-filter-by-tags/metrics-explorer-ec2-by-tag-name-dashboard.png)

あるいは、<b>TeamX</b> と <b>TeamY</b> を <b>Team</b> タグで集計したり、ニーズに合わせて他の設定を選択したりすることもできます

![Screen shot of the EC2 dashboard filter by tag Team](../images/metrics-explorer-filter-by-tags/metrics-explorer-ec2-by-tag-team-dashboard.png)



## 動的な可視化
<b>From</b>、<b>Aggregated by</b>、<b>Split by</b> オプションを使用して、結果の可視化を簡単にカスタマイズできます。メトリクスエクスプローラーの可視化は動的であるため、新しくタグ付けされたリソースは自動的にエクスプローラーウィジェットに表示されます。




## リファレンス

Metrics Explorer の詳細については、以下の記事を参照してください:
https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/CloudWatch-Metrics-Explorer.html

[metrics-explorer]: https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/CloudWatch-Metrics-Explorer.html

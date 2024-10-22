# リソースタグでフィルタリングしたメトリクスを集約し可視化するための Amazon CloudWatch Metrics Explorer の利用

このレシピでは、リソースタグとリソースプロパティでメトリクスをフィルタリング、集約、可視化するための Metrics Explorer の使い方を説明します - [Use metrics explorer to monitor resources by their tags and properties][metrics-explorer]。

Metrics Explorer で可視化を作成する方法はいくつかありますが、このウォークスルーではシンプルに AWS コンソールを利用します。

note
    このガイドの完了には約 5 分かかります。


## 前提条件

* AWS アカウントへのアクセス権
* AWS コンソールから Amazon CloudWatch Metrics Explorer へのアクセス権
* 関連リソースにリソースタグが設定されていること

## メトリクスエクスプローラのタグベースのクエリとビジュアライゼーション

* CloudWatch コンソールを開きます

* **Metrics** の下にある **Explorer** メニューをクリックします

![タグでフィルタリングされたメトリクスのスクリーンショット](../images/metrics-explorer-filter-by-tags/metrics-explorer-cw-menu.png)

* **Generic templates** または **Service based templates** リストから選択できます。この例では **EC2 Instances by type** テンプレートを使用します

![タグでフィルタリングされたメトリクスのスクリーンショット](../images/metrics-explorer-filter-by-tags/metrics-explorer-templates-ec2-by-type.png)

* 探索したいメトリクスを選択し、古くなったものは削除し、表示したい他のメトリクスを追加します

![EC2 メトリクスのスクリーンショット](../images/metrics-explorer-filter-by-tags/metrics-explorer-ec2-metrics.png)

* **From** の下で、探したいリソースタグまたはリソースプロパティを選択します。以下の例では、**Name: TeamX** タグを持つ異なる EC2 インスタンスの CPU およびネットワーク関連メトリクスの数を示しています

![Name タグの例のスクリーンショット](../images/metrics-explorer-filter-by-tags/metrics-explorer-teamx-name-tag.png)

* **Aggregated by** の下で集約関数を使用して時系列を組み合わせることができます。以下の例では、**TeamX** のメトリクスが **Availability Zone** で集約されています

![タグ Name でフィルタリングされた EC2 ダッシュボードのスクリーンショット](../images/metrics-explorer-filter-by-tags/metrics-explorer-ec2-by-tag-name-dashboard.png)

あるいは、**TeamX** と **TeamY** を **Team** タグで集約するか、ニーズに合った他の構成を選択することもできます

![タグ Team でフィルタリングされた EC2 ダッシュボードのスクリーンショット](../images/metrics-explorer-filter-by-tags/metrics-explorer-ec2-by-tag-team-dashboard.png)

## 動的な可視化
**From**、**Aggregated by**、**Split by** オプションを使用することで、結果の可視化をカスタマイズできます。Metrics Explorer の可視化は動的なので、新しくタグ付けされたリソースは自動的にエクスプローラーウィジェットに表示されます。

## 参考

Metrics Explorer の詳細については、次の記事を参照してください。
https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/CloudWatch-Metrics-Explorer.html

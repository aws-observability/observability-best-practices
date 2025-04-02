# アラーム

Amazon CloudWatch アラームを使用すると、CloudWatch メトリクスとログに関する閾値を定義し、CloudWatch で設定したルールに基づいて通知を受け取ることができます。

**CloudWatch メトリクスのアラーム：**

CloudWatch アラームでは、CloudWatch メトリクスの閾値を定義し、メトリクスが範囲外になった場合に通知を受け取ることができます。
各メトリクスは複数のアラームをトリガーでき、各アラームには多くのアクションを関連付けることができます。
CloudWatch メトリクスに基づくメトリクスアラームの設定には、2 つの異なる方法があります。

1. **静的閾値**：静的閾値は、メトリクスが違反してはならない固定の制限を表します。
通常の運用時の動作を理解するために、上限と下限のような静的閾値の範囲を定義する必要があります。
メトリクス値が静的閾値を下回るか上回った場合、CloudWatch でアラームを生成するように設定できます。

2. **異常検知**：異常検知は、一般的にデータの大部分から大きく逸脱し、正常な動作の明確な概念に適合しない、まれなアイテム、イベント、または観測値として識別されます。
CloudWatch 異常検知は、過去のメトリクスデータを分析し、期待値のモデルを作成します。
期待値は、メトリクスの典型的な時間別、日別、週別のパターンを考慮します。
必要に応じて各メトリクスに異常検知を適用でき、CloudWatch は機械学習アルゴリズムを適用して有効化された各メトリクスの上限と下限を定義し、メトリクスが期待値から外れた場合にのみアラームを生成します。

:::tip
静的閾値は、ワークロードの特定のパフォーマンスブレークポイントやインフラストラクチャコンポーネントの絶対的な制限など、十分に理解しているメトリクスに最適です。
:::
:::info
特定のメトリクスの時間経過に伴うパフォーマンスが把握できない場合や、負荷テストまたは異常なトラフィックでメトリクス値が観測されていない場合は、アラームに異常検知モデルを使用してください。
:::
![CloudWatch Alarm types](../images/cwalarm1.png)

以下の手順に従って、CloudWatch で静的および異常検知ベースのアラームを設定できます。

[静的閾値アラーム](https://catalog.us-east-1.prod.workshops.aws/workshops/31676d37-bbe9-4992-9cd1-ceae13c5116c/en-US/alarms/mericalarm)

[CloudWatch 異常検知ベースのアラーム](https://catalog.us-east-1.prod.workshops.aws/workshops/31676d37-bbe9-4992-9cd1-ceae13c5116c/en-US/alarms/adalarm)

:::info
アラーム疲れを軽減したり、生成されるアラームの数によるノイズを減らしたりするために、2 つの高度なアラーム設定方法があります：

1. **複合アラーム**：複合アラームには、他のアラームの状態を考慮するルール式が含まれます。
複合アラームは、ルールのすべての条件が満たされた場合にのみ `ALARM` 状態になります。
複合アラームのルール式で指定できるアラームには、メトリクスアラームと他の複合アラームが含まれます。
複合アラームは、[集約によるアラーム疲れの軽減](../signals/alarms/#fight-alarm-fatigue-with-aggregation)に役立ちます。

2. **Metric Math ベースのアラーム**：Metric Math 式を使用して、より意味のある KPI を構築し、それらにアラームを設定できます。
複数のメトリクスを組み合わせて、組み合わせた使用率メトリクスを作成し、それらにアラームを設定できます。
:::

以下の手順では、複合アラームと Metric Math ベースのアラームの設定方法を説明します。

[複合アラーム](https://catalog.us-east-1.prod.workshops.aws/workshops/31676d37-bbe9-4992-9cd1-ceae13c5116c/en-US/alarms/compositealarm)

[Metric Math アラーム](https://aws.amazon.com/blogs/mt/create-a-metric-math-alarm-using-amazon-cloudwatch/)

**CloudWatch Logs のアラーム**

CloudWatch メトリクスフィルターを使用して、CloudWatch Logs に基づくアラームを作成できます。
メトリクスフィルターは、ログデータを数値の CloudWatch メトリクスに変換し、グラフ化やアラーム設定が可能になります。
メトリクスを設定したら、CloudWatch Logs から生成された CloudWatch メトリクスに対して、静的または異常検知ベースのアラームを使用できます。

[CloudWatch Logs のメトリクスフィルター](https://aws.amazon.com/blogs/mt/quantify-custom-application-metrics-with-amazon-cloudwatch-logs-and-metric-filters/)の設定例を確認できます。

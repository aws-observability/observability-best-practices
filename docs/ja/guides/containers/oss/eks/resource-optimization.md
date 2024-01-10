# Kubernetes ワークロードのリソース最適化のベストプラクティス

Kubernetes の採用は加速し続けており、多くの組織がマイクロサービスベースのアーキテクチャに移行しています。当初の焦点は、アプリケーションをサポートするための新しいクラウドネイティブアーキテクチャの設計と構築に置かれていました。 環境が成長するにつれ、リソース割り当ての最適化に焦点を当てる顧客が出てきています。 リソース最適化は、セキュリティの次に運用チームが最も重要視する質問事項です。

Kubernetes 環境でのリソース割り当ての最適化とアプリケーションの適切なサイジングのガイダンスについて説明します。 これには、マネージドノードグループ、セルフマネージドノードグループ、AWS Fargate でデプロイされた Amazon EKS 上で実行されているアプリケーションが含まれます。

## Kubernetes 上のアプリケーションの適切なリソースサイズ設定の理由

Kubernetes では、アプリケーションにリソース仕様を設定することでリソースの適切なサイズ設定が行われます。これらの設定は直接次のことに影響します。

* パフォーマンス - 適切なリソース仕様がないと、Kubernetes アプリケーションは勝手にリソースを奪い合うことになり、アプリケーションのパフォーマンスに悪影響を及ぼします。
* コスト最適化 - 過剰なリソース仕様でデプロイされたアプリケーションはコストの増加とインフラの未利用を招きます。  
* オートスケーリング - Kubernetes クラスターオートスケーラとポッドの水平方向のオートスケーリングには、機能するためにリソース仕様が必要です。

Kubernetes で最も一般的なリソース仕様は、[CPU とメモリのリクエストとリミット](https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/#requests-and-limits) です。

## リクエストと制限

コンテナ化されたアプリケーションは、Pod として Kubernetes 上にデプロイされます。CPU とメモリのリクエストと制限は、Pod 定義のオプションの部分です。CPU は [Kubernetes CPU](https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/#meaning-of-cpu) の単位で指定され、メモリは通常、[メビバイト (Mi)](https://simple.wikipedia.org/wiki/Mebibyte) で指定されたバイト数です。

リクエストと制限は、Kubernetes において異なる機能を果たし、スケジューリングとリソースの実施に異なる影響を与えます。

## おすすめ
アプリケーションの所有者は、CPU とメモリのリソース要求に対して「適切な」値を選択する必要があります。理想的な方法は、開発環境でアプリケーションの負荷テストを実行し、オブザーバビリティツールを使用してリソース使用量を測定することです。これは組織の最も重要なアプリケーションには適しているかもしれませんが、クラスターにデプロイされているすべてのコンテナ化されたアプリケーションについて実行可能というわけではありません。ワークロードを最適化および適正サイジングするのに役立つツールについて説明しましょう。

### Vertical Pod Autoscaler (VPA)

[VPA](https://github.com/kubernetes/autoscaler/tree/master/vertical-pod-autoscaler) は、Autoscaling 特別関心グループ (SIG) が所有する Kubernetes のサブプロジェクトです。これは、観測されたアプリケーションのパフォーマンスに基づいて Pod のリクエストを自動的に設定するように設計されています。VPA はデフォルトで [Kubernetes Metric Server](https://github.com/kubernetes-sigs/metrics-server) を使用してリソース使用量を収集しますが、オプションで Prometheus をデータソースとして設定することもできます。

VPA にはアプリケーションのパフォーマンスを測定し、サイズの推奨を行う推奨エンジンがあります。VPA 推奨エンジンはスタンドアロンで展開できるため、VPA はスケーリングアクションを実行しません。各アプリケーションの VerticalPodAutoscaler カスタムリソースを作成することによって設定され、VPA はリソースサイズの推奨をオブジェクトのステータスフィールドで更新します。

クラスタ内のすべてのアプリケーションの VerticalPodAutoscaler オブジェクトを作成し、JSON 結果を読み取って解釈することは、スケールでは困難です。 [Goldilocks](https://github.com/FairwindsOps/goldilocks) は、これを簡単にするオープンソースプロジェクトです。

### Goldilocks
Goldilocks は Fairwinds が提供するオープンソースプロジェクトで、組織が Kubernetes アプリケーションのリソース要求を「ちょうど良い」状態にするのを支援することを目的としています。Goldilocks のデフォルト設定はオプトインモデルです。goldilocks.fairwinds.com/enabled: true ラベルを名前空間に追加することで、どのワークロードをモニタリングするかを選択します。


![Goldilocks アーキテクチャ](../../../../images/goldilocks-architecture.png)

Metrics Server はワーカーノード上の Kubelet からリソースメトリクスを収集し、Vertical Pod Autoscaler が使用するために Metrics API を通じて公開します。Goldilocks コントローラは、goldilocks.fairwinds.com/enabled: true ラベルの付いた名前空間を監視し、それらの名前空間内の各ワークロードに対して VerticalPodAutoscaler オブジェクトを作成します。

リソース推奨を有効にするには、次のコマンドを実行します:

```
kubectl create ns javajmx-sample
kubectl label ns javajmx-sample goldilocks.fairwinds.com/enabled=true
```

Amazon EKS クラスタに goldilocks をデプロイするには、次のコマンドを実行します:

```
helm repo add fairwinds-stable https://charts.fairwinds.com/stable
helm upgrade --install goldilocks fairwinds-stable/goldilocks --namespace goldilocks --create-namespace --set vpa.enabled=true
```

goldilocks-dashboard はポート 8080 でダッシュボードを公開するので、リソース推奨を取得するためにアクセスできます。ダッシュボードにアクセスするには、次のコマンドを実行します:

```
kubectl -n goldilocks port-forward svc/goldilocks-dashboard 8080:80
```
その後、ブラウザで http://localhost:8080 を開きます

![Goldilocks ダッシュボード](../../../../images/goldilocks-dashboard.png)


サンプル名前空間を分析して、Goldilocks によって提供された推奨を確認しましょう。デプロイメントの推奨が表示されるはずです。
![Goldilocks 推奨](../../../../images/goldilocks-recommendation.png)

javajmx-sample ワークロードの要求と制限の推奨を確認できます。各サービス品質(QoS)の下の Current 列は、現在設定されている CPU とメモリの要求と制限を示しています。Guranteed 列と Burstable 列は、それぞれの QoS に対する推奨される CPU とメモリの要求制限を示しています。

リソースが過剰にプロビジョニングされていることが明らかで、Goldilocks は CPU とメモリの要求を最適化するための推奨を行っています。CPU の要求と制限が Guranteed QoS の 100m と 300m に対して 15m と 15m に推奨されており、メモリの要求と制限は 180Mi と 300 Mi に対して 105M と 105M に推奨されています。
関心のある QoS クラスのマニフェストファイルを単純にコピーして、適切にサイズ調整および最適化されたワークロードをデプロイできます。

### cAdvisor メトリクスを使用したスロットリングの理解とリソースの適切な構成
制限を設定するとき、特定の期間中に特定のコンテナ化されたアプリケーションがどのくらいの長さで実行できるかを Linux ノードに指示しています。これは、ノード上の他のワークロードを、過度な CPU サイクルを消費するプロセスのグループから保護するためです。マザーボード上にあるいくつかの物理的な「コア」を定義しているわけではありません。ただし、他のアプリケーションを圧迫せずにコンテナを一時停止できるように、単一のコンテナ内のプロセスまたはスレッドのグループが実行できる時間を設定しています。

`container_cpu_cfs_throttled_seconds_total` という便利な cAdvisor メトリクスがあり、スロットルされたすべての 5 ms スライスを加算し、プロセスがクォータをどの程度超過しているかを示します。このメトリクスは秒単位なので、コンテナに関連付けられている実際の時間である 100 ms を取得するために値を 10 で割ります。

100 ms の時間で上位 3 つの Pod の CPU 使用率を理解するための PromQl クエリ。
```
topk(3, max by (pod, container)(rate(container_cpu_usage_seconds_total{image!="", instance="$instance"}[$__rate_interval]))) / 10
```
400 ms の vCPU 使用が観測されました。

![Throttled-Period](../../../../images/throttled-period.png)

PromQl は 1 秒あたりのスロットリングを示し、1 秒に 10 期間あります。期間ごとのスロットリングを取得するには、10 で割ります。制限の設定をどのくらい増やす必要があるかを知りたい場合は、10 を掛けることができます(例: 400 ms * 10 = 4000 m)。

上記のツールはリソース最適化の機会を特定する方法を提供しますが、アプリケーションチームは、特定のアプリケーションが CPU/メモリ集中型であるかどうかを特定し、スロットリング/過剰プロビジョニングを防ぐためにリソースを割り当てる時間を費やす必要があります。

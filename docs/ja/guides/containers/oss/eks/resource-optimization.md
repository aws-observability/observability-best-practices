# Kubernetes ワークロードのリソース最適化のベストプラクティス

マイクロサービスベースのアーキテクチャへの移行が進む中、Kubernetes の採用が加速しています。当初の焦点の多くは、アプリケーションをサポートするための新しいクラウドネイティブアーキテクチャの設計と構築に置かれていました。 環境が成長するにつれ、リソース割り当ての最適化に焦点を当てるお客様が増えてきています。 リソースの最適化は、セキュリティの次に運用チームが最も関心のある質問です。

Kubernetes 環境でのリソース割り当ての最適化とアプリケーションの適切なサイジングのガイダンスについて説明しましょう。 これには、マネージドノードグループ、セルフマネージドノードグループ、AWS Fargate でデプロイされた Amazon EKS 上で実行されているアプリケーションが含まれます。

## Kubernetes 上のアプリケーションのサイズ最適化の理由
Kubernetes では、アプリケーションにリソース仕様を設定することでリソースのサイズ最適化が行われます。これらの設定は直接以下に影響します。

* パフォーマンス - 適切なリソース仕様がないと、Kubernetes アプリケーションはリソースを任意に奪い合うことになります。これはアプリケーションのパフォーマンスに悪影響を及ぼす可能性があります。 
* コスト最適化 - 過剰なリソース仕様でデプロイされたアプリケーションは、コストの増加とインフラストラクチャの未利用を招くでしょう。
* 自動スケーリング - Kubernetes クラスターオートスケーラーと Horizontal Pod オートスケーリングには、機能するためにリソース仕様が必要です。

Kubernetes で最も一般的なリソース仕様は、[CPU とメモリのリクエストとリミット](https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/#requests-and-limits)です。

## リクエストと制限

コンテナ化されたアプリケーションは、Pod として Kubernetes 上にデプロイされます。CPU とメモリのリクエストと制限は、Pod の定義のオプションの部分です。CPU は [Kubernetes CPU](https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/#meaning-of-cpu) の単位で指定され、メモリは通常、[メビバイト(Mi)](https://simple.wikipedia.org/wiki/Mebibyte)で指定されます。

リクエストと制限は、Kubernetes で異なる機能を果たし、スケジューリングとリソースの実行に異なる影響を与えます。

## おすすめ
アプリケーションの所有者は、CPU とメモリリソースのリクエストに対して「適切な」値を選択する必要があります。
理想的な方法は、開発環境でアプリケーションの負荷テストを実行し、オブザーバビリティ ツールを使用してリソースの使用状況を測定することです。
これは組織の最も重要なアプリケーションについては理にかなっているかもしれませんが、クラスターにデプロイされているすべてのコンテナ化されたアプリケーションについて実行可能だとは限りません。
ワークロードを最適化および適正サイズ化するのに役立つツールについて説明しましょう。

### Vertical Pod Autoscaler (VPA)
[VPA](https://github.com/kubernetes/autoscaler/tree/master/vertical-pod-autoscaler) は、Autoscaling 特別関心グループ (SIG) が所有する Kubernetes のサブプロジェクトです。これは、観測されたアプリケーションのパフォーマンスに基づいて Pod のリクエストを自動的に設定することを目的としています。VPA はリソース使用量を収集するために、デフォルトで [Kubernetes Metric Server](https://github.com/kubernetes-sigs/metrics-server) を使用しますが、オプションでデータソースとして Prometheus を使用するように構成できます。

VPA には、アプリケーションのパフォーマンスを測定し、サイジングの推奨を行う推奨エンジンがあります。VPA 推奨エンジンはスタンドアロンでデプロイできるため、VPA はいかなる自動スケーリングアクションも実行しません。アプリケーションごとに VerticalPodAutoscaler カスタムリソースを作成することによって構成され、VPA はオブジェクトのステータスフィールドを更新してリソースサイジングの推奨を行います。

クラスタ内のすべてのアプリケーションに対して VerticalPodAutoscaler オブジェクトを作成し、JSON 結果を読み取って解釈することは、スケールが大きくなると困難です。 [Goldilocks](https://github.com/FairwindsOps/goldilocks) は、これを簡単にするオープンソースプロジェクトです。

### Goldilocks
Goldilocks は Fairwinds が提供するオープンソースプロジェクトで、組織の Kubernetes アプリケーションのリソース要求を「適切に」設定するのに役立つことを目的としています。Goldilocks のデフォルト設定はオプトインモデルです。goldilocks.fairwinds.com/enabled: true ラベルを名前空間に追加することで、どのワークロードを監視するかを選択します。


![Goldilocks-Architecture](../../../../images/goldilocks-architecture.png)

Metrics Server はワーカーノード上の Kubelet からリソースメトリクスを収集し、Vertical Pod Autoscaler で使用するために Metrics API を介して公開します。Goldilocks コントローラーは goldilocks.fairwinds.com/enabled: true ラベルの付いた名前空間を監視し、それらの名前空間内の各ワークロードに対して VerticalPodAutoscaler オブジェクトを作成します。

リソース推奨を有効にするには、次のコマンドを実行します:

```
kubectl create ns javajmx-sample
kubectl label ns javajmx-sample goldilocks.fairwinds.com/enabled=true
```

Amazon EKS クラスターに Goldilocks をデプロイするには、次のコマンドを実行します:

```
helm repo add fairwinds-stable https://charts.fairwinds.com/stable
helm upgrade --install goldilocks fairwinds-stable/goldilocks --namespace goldilocks --create-namespace --set vpa.enabled=true
```

Goldilocks-dashboard はポート 8080 でダッシュボードを公開します。次のコマンドを実行してアクセスできます:

```
kubectl -n goldilocks port-forward svc/goldilocks-dashboard 8080:80
```
その後、ブラウザで http://localhost:8080 を開きます

![Goldilocks-Dashboard](../../../../images/goldilocks-dashboard.png)


サンプルの名前空間を分析して、Goldilocks が提供する推奨事項を確認しましょう。デプロイメントの推奨事項が表示されるはずです。 
![Goldilocks-Recommendation](../../../../images/goldilocks-recommendation.png)

javajmx-sample ワークロードの要求と制限の推奨を確認できました。各サービス品質(QoS)の下の「Current」列は、現在設定されている CPU とメモリの要求と制限を示しています。「Guranteed」と「Burstable」列は、それぞれの QoS の推奨 CPU とメモリの要求制限を示しています。

リソースが過剰にプロビジョニングされていることが明らかで、Goldilocks は CPU とメモリの要求を最適化するための推奨を行っています。CPU の要求と制限は、保証された QoS の場合は 100m と 300m と比較して 15m と 15m が推奨されており、メモリの要求と制限は 180Mi と 300Mi と比較して 105M と 105M が推奨されています。
関心のある QoS クラスのマニフェストファイルをコピーして適切にサイズ調整され最適化されたワークロードをデプロイできます。

### cAdvisor メトリクスを使用したスロットリングの理解とリソースの適切な構成

制限を設定すると、特定のコンテナ化されたアプリケーションが特定の期間中にLinuxノードで実行できる時間をノードに指示することになります。これは、制御不能なプロセスのセットがCPUサイクルの不当な量を占有するのを防ぐために、ノード上の他のワークロードを保護するためです。マザーボード上に存在する「コア」の数を定義しているわけではありません。コンテナ内のプロセスやスレッドのグループが、他のアプリケーションを圧倒しないように一時停止する前に実行できる時間を設定しているに過ぎません。

`container_cpu_cfs_throttled_seconds_total` という便利な cAdvisor メトリクスがあり、すべてのスロットルされた 5 ms スライスを合計し、プロセスがクォータをどの程度超えているかを示します。このメトリクスは秒単位なので、コンテナに関連付けられている実際の時間である 100 ms を取得するために値を 10 で割ります。

100 ms の時間で上位3つの Pod の CPU 使用率を理解するための PromQl クエリです。
```
topk(3, max by (pod, container)(rate(container_cpu_usage_seconds_total{image!="", instance="$instance"}[$__rate_interval]))) / 10
```
400 ms の vCPU 使用が観測されました。

![Throttled-Period](../../../../images/throttled-period.png)

PromQl は1秒あたりのスロットリングを提供しますが、1秒に10期間あります。期間ごとのスロットリングを取得するには、10で割ります。制限の設定をどのくらい増やす必要があるかを知りたい場合は、10を掛けることができます(例: 400 ms * 10 = 4000 m)。

上記のツールはリソース最適化の機会を特定する方法を提供しますが、アプリケーションチームは、特定のアプリケーションが CPU/メモリ集中型であるかどうかを特定し、スロットリング/過剰プロビジョニングを防ぐためにリソースを割り当てる時間を費やす必要があります。

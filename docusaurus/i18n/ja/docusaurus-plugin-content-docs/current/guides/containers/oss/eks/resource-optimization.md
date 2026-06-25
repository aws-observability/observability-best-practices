# Kubernetes ワークロードのリソース最適化のベストプラクティス
Kubernetes の採用は加速し続けており、多くの企業がマイクロサービスベースのアーキテクチャに移行しています。当初の焦点の多くは、アプリケーションをサポートするための新しいクラウドネイティブアーキテクチャの設計と構築にありました。環境が成長するにつれて、顧客からのリソース割り当ての最適化に焦点が移り始めています。リソースの最適化は、セキュリティに次いで運用チームが尋ねる 2 番目に重要な質問です。
Kubernetes 環境でリソース割り当てを最適化し、アプリケーションを適切にサイジングする方法についてのガイダンスを説明します。これには、マネージド型ノードグループ、セルフマネージド型ノードグループ、および AWS Fargate でデプロイされた Amazon EKS 上で実行されるアプリケーションが含まれます。

## Kubernetes 上でアプリケーションを適正サイズ化する理由
Kubernetes では、リソースの適正化はアプリケーションにリソース仕様を設定することで行われます。これらの設定は次の項目に直接影響します。

* パフォーマンス — 適切なリソース仕様がない場合、Kubernetes アプリケーションは任意にリソースを競合します。これはアプリケーションのパフォーマンスに悪影響を及ぼす可能性があります。
* コスト最適化 — 過大なリソース仕様でデプロイされたアプリケーションは、コストの増加とインフラストラクチャの低利用につながります。
* オートスケーリング — Kubernetes Cluster Autoscaler と Horizontal Pod Autoscaling は、機能するためにリソース仕様を必要とします。

Kubernetes で最も一般的なリソース仕様は、[CPU とメモリのリクエストと制限](https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/#requests-and-limits)です。

## リクエストと制限

コンテナ化されたアプリケーションは、Pod として Kubernetes にデプロイされます。CPU とメモリのリクエストと制限は、Pod 定義のオプション部分です。CPU は [Kubernetes CPU](https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/#meaning-of-cpu) の単位で指定され、メモリはバイト単位で指定されます。通常は [メビバイト (Mi)](https://simple.wikipedia.org/wiki/Mebibyte) として指定されます。

リクエストと制限は、それぞれ Kubernetes で異なる機能を果たし、スケジューリングとリソース適用に異なる影響を与えます。

## 推奨事項
アプリケーション所有者は、CPU とメモリのリソースリクエストに対して「適切な」値を選択する必要があります。理想的な方法は、開発環境でアプリケーションの負荷テストを行い、オブザーバビリティツールを使用してリソース使用量を測定することです。これは組織の最も重要なアプリケーションには適しているかもしれませんが、クラスターにデプロイされるすべてのコンテナ化されたアプリケーションに対して実行するのは現実的ではない可能性があります。ワークロードの最適化と適切なサイジングに役立つツールについて説明します。

### Vertical Pod Autoscaler (VPA)
[VPA](https://github.com/kubernetes/autoscaler/tree/master/vertical-pod-autoscaler) は、Autoscaling special interest group (SIG) が所有する Kubernetes サブプロジェクトです。観測されたアプリケーションのパフォーマンスに基づいて、Pod のリクエストを自動的に設定するように設計されています。VPA はデフォルトで [Kubernetes Metric Server](https://github.com/kubernetes-sigs/metrics-server) を使用してリソース使用量を収集しますが、オプションで Prometheus をデータソースとして使用するように設定することもできます。
VPA には、アプリケーションのパフォーマンスを測定し、サイジングの推奨事項を作成するレコメンデーションエンジンがあります。VPA レコメンデーションエンジンはスタンドアロンでデプロイできるため、VPA はオートスケーリングアクションを実行しません。各アプリケーションに対して VerticalPodAutoscaler カスタムリソースを作成することで設定され、VPA はオブジェクトの status フィールドをリソースサイジングの推奨事項で更新します。
クラスター内のすべてのアプリケーションに対して VerticalPodAutoscaler オブジェクトを作成し、JSON の結果を読み取って解釈しようとすることは、大規模な環境では困難です。[Goldilocks](https://github.com/FairwindsOps/goldilocks) は、これを簡単にするオープンソースプロジェクトです。

### Goldilocks
Goldilocks は、組織が Kubernetes アプリケーションのリソースリクエストを「ちょうど良く」設定できるように設計された、Fairwinds のオープンソースプロジェクトです。Goldilocks のデフォルト設定はオプトインモデルです。goldilocks.fairwinds.com/enabled: true ラベルを namespace に追加することで、監視するワークロードを選択します。


![Goldilocks-Architecture](../../../../images/goldilocks-architecture.png)

Metrics Server は、ワーカーノードで実行されている Kubelet からリソースメトリクスを収集し、Vertical Pod Autoscaler が使用できるように Metrics API を通じて公開します。Goldilocks コントローラーは、goldilocks.fairwinds.com/enabled: true ラベルが付いた名前空間を監視し、それらの名前空間内の各ワークロードに対して VerticalPodAutoscaler オブジェクトを作成します。

リソース推奨のネームスペースを有効にするには、以下のコマンドを実行します。

```
kubectl create ns javajmx-sample
kubectl label ns javajmx-sample goldilocks.fairwinds.com/enabled=true
```

Amazon EKS クラスターに goldilocks をデプロイするには、以下のコマンドを実行します。

```
helm repo add fairwinds-stable https://charts.fairwinds.com/stable
helm upgrade --install goldilocks fairwinds-stable/goldilocks --namespace goldilocks --create-namespace --set vpa.enabled=true
```

Goldilocks-dashboard はポート 8080 でダッシュボードを公開し、リソースの推奨事項を取得するためにアクセスできます。以下のコマンドを実行してダッシュボードにアクセスします。

```
kubectl -n goldilocks port-forward svc/goldilocks-dashboard 8080:80
```
ブラウザで http://localhost:8080 を開きます

![Goldilocks-Dashboard](../../../../images/goldilocks-dashboard.png)


Goldilocks が提供する推奨事項を確認するために、サンプル namespace を分析してみましょう。deployment の推奨事項を確認できるはずです。
![Goldilocks-Recommendation](../../../../images/goldilocks-recommendation.png)

javajmx-sample ワークロードのリクエストと制限の推奨事項を確認できます。各 Quality of Service (Qos) の下の Current 列は、現在設定されている CPU とメモリのリクエストと制限を示しています。Guranteed 列と Burstable 列は、それぞれの QoS に対して推奨される CPU とメモリのリクエスト制限を示しています。

リソースを過剰にプロビジョニングしていることが明確にわかり、goldilocks が CPU とメモリのリクエストを最適化するための推奨事項を提示しています。CPU のリクエストと制限は、Guaranteed QoS の 100m と 300m に対して 15m と 15m に、メモリのリクエストと制限は 180Mi と 300Mi に対して 105M と 105M に推奨されています。
関心のある QoS クラスに対応するマニフェストファイルを単純にコピーして、適切なサイズに調整され最適化されたワークロードをデプロイできます。

### cAdvisor メトリクスを使用したスロットリングの理解と適切なリソースの設定
制限を設定する際、特定のコンテナ化されたアプリケーションが特定の期間中にどれだけの時間実行できるかを Linux ノードに指示しています。これは、ノード上の他のワークロードを、不正なプロセスのセットが不当な量の CPU サイクルを消費することから保護するために行います。マザーボード上に配置されている物理的な「コア」の数を定義しているわけではありません。しかし、他のアプリケーションを圧迫しないように、単一のコンテナ内のプロセスまたはスレッドのグループが一時的に停止される前にどれだけの時間実行できるかを設定しています。

次のような便利な cAdvisor メトリクスがあります `container_cpu_cfs_throttled_seconds_total` これは、スロットルされたすべての 5 ミリ秒のスライスを合計し、プロセスがクォータをどれだけ超えているかを示します。このメトリクスは秒単位であるため、値を 10 で割ると 100 ミリ秒になります。これは、コンテナに関連付けられた実際の期間です。

100 ミリ秒の時間における上位 3 つの Pod の CPU 使用率を理解するための PromQl クエリ。
```
topk(3, max by (pod, container)(rate(container_cpu_usage_seconds_total{image!="", instance="$instance"}[$__rate_interval]))) / 10
```
 400 ミリ秒の vCPU 使用量が観測されます。

![Throttled-Period](../../../../images/throttled-period.png)

PromQL は 1 秒あたりのスロットリングを提供し、1 秒間に 10 期間があります。期間あたりのスロットリングを取得するには、10 で割ります。制限設定をどれだけ増やすべきかを知りたい場合は、10 を掛けます (例: 400 ms * 10 = 4000 m)。

上記のツールはリソース最適化の機会を特定する方法を提供しますが、アプリケーションチームは、特定のアプリケーションが CPU / メモリ集約型であるかどうかを特定し、スロットリング / 過剰プロビジョニングを防ぐためにリソースを割り当てる時間を費やす必要があります。 


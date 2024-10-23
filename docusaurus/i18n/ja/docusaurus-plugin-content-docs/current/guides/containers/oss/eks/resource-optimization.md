# Kubernetes ワークロードのリソース最適化ベストプラクティス

Kubernetes の採用は、多くの企業がマイクロサービスベースのアーキテクチャに移行するにつれて、加速し続けています。
当初は、アプリケーションをサポートするための新しいクラウドネイティブアーキテクチャの設計と構築に重点が置かれていました。
環境が成長するにつれて、顧客からリソース割り当ての最適化に焦点が当てられるようになってきています。
リソースの最適化は、セキュリティに次いで運用チームが求める 2 番目に重要な課題です。

Kubernetes 環境でのリソース割り当ての最適化とアプリケーションの適切なサイジングに関するガイダンスについて説明します。
これには、マネージド型ノードグループ、セルフマネージド型ノードグループ、および AWS Fargate にデプロイされた Amazon EKS 上で実行されるアプリケーションが含まれます。



## Kubernetes でアプリケーションをライトサイジングする理由

Kubernetes では、アプリケーションにリソース仕様を設定することでリソースのライトサイジングを行います。これらの設定は以下に直接影響します：

* パフォーマンス — 適切なリソース仕様がないと、Kubernetes アプリケーションは無秩序にリソースを奪い合います。これはアプリケーションのパフォーマンスに悪影響を与える可能性があります。

* コスト最適化 — 過大なリソース仕様でデプロイされたアプリケーションは、コストの増加と十分に活用されていないインフラストラクチャにつながります。

* オートスケーリング — Kubernetes クラスターオートスケーラーと水平 Pod オートスケーリングは、機能するためにリソース仕様を必要とします。

Kubernetes で最も一般的なリソース仕様は、[CPU とメモリのリクエストとリミット](https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/#requests-and-limits)です。



## リクエストとリミット

コンテナ化されたアプリケーションは、Kubernetes 上で Pod としてデプロイされます。CPU とメモリのリクエストとリミットは、Pod 定義のオプション部分です。CPU は [Kubernetes CPU](https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/#meaning-of-cpu) 単位で指定され、メモリはバイト単位で指定されます。通常は [メビバイト (Mi)](https://simple.wikipedia.org/wiki/Mebibyte) で表されます。

リクエストとリミットは、Kubernetes において異なる機能を果たし、スケジューリングとリソース強制に異なる影響を与えます。



## 推奨事項
アプリケーションの所有者は、CPU とメモリのリソース要求に対して「適切な」値を選択する必要があります。理想的な方法は、開発環境でアプリケーションの負荷テストを行い、オブザーバビリティツールを使用してリソース使用量を測定することです。これは組織の最も重要なアプリケーションには適していますが、クラスターにデプロイされているすべてのコンテナ化されたアプリケーションに対して実行可能とは限りません。ワークロードを最適化し、適切なサイズを決定するのに役立つツールについて説明しましょう：



### Vertical Pod Autoscaler (VPA)
[VPA](https://github.com/kubernetes/autoscaler/tree/master/vertical-pod-autoscaler) は、Autoscaling 特別利益グループ (SIG) が所有する Kubernetes のサブプロジェクトです。
観測されたアプリケーションのパフォーマンスに基づいて、Pod のリクエストを自動的に設定するように設計されています。
VPA はデフォルトで [Kubernetes Metric Server](https://github.com/kubernetes-sigs/metrics-server) を使用してリソース使用量を収集しますが、オプションで Prometheus をデータソースとして使用するように設定することもできます。

VPA には、アプリケーションのパフォーマンスを測定し、サイジングの推奨を行う推奨エンジンがあります。
VPA 推奨エンジンはスタンドアロンでデプロイでき、VPA は自動スケーリングアクションを実行しません。
各アプリケーションに VerticalPodAutoscaler カスタムリソースを作成することで設定され、VPA はオブジェクトのステータスフィールドをリソースサイジングの推奨で更新します。

クラスター内のすべてのアプリケーションに VerticalPodAutoscaler オブジェクトを作成し、JSON 結果を読み取って解釈しようとすることは、スケールアップ時に課題となります。
[Goldilocks](https://github.com/FairwindsOps/goldilocks) は、これを簡単にするオープンソースプロジェクトです。



### Goldilocks
Goldilocks は Fairwinds が開発したオープンソースプロジェクトで、組織が Kubernetes アプリケーションのリソースリクエストを「ちょうど良い」状態にするのを支援するように設計されています。Goldilocks のデフォルト設定はオプトインモデルです。名前空間に goldilocks.fairwinds.com/enabled: true ラベルを追加することで、監視するワークロードを選択します。

![Goldilocks-Architecture](../../../../images/goldilocks-architecture.png)

Metrics Server はワーカーノードで実行されている Kubelet からリソースメトリクスを収集し、Vertical Pod Autoscaler が使用するために Metrics API を通じて公開します。Goldilocks コントローラーは goldilocks.fairwinds.com/enabled: true ラベルが付いた名前空間を監視し、それらの名前空間内の各ワークロードに対して VerticalPodAutoscaler オブジェクトを作成します。

リソース推奨を有効にするために、以下のコマンドを実行します：

```
kubectl create ns javajmx-sample
kubectl label ns javajmx-sample goldilocks.fairwinds.com/enabled=true
```

Amazon EKS クラスターに Goldilocks をデプロイするには、以下のコマンドを実行します：

```
helm repo add fairwinds-stable https://charts.fairwinds.com/stable
helm upgrade --install goldilocks fairwinds-stable/goldilocks --namespace goldilocks --create-namespace --set vpa.enabled=true
```

Goldilocks ダッシュボードはポート 8080 でダッシュボードを公開し、リソース推奨を取得するためにアクセスできます。ダッシュボードにアクセスするには、以下のコマンドを実行します：

```
kubectl -n goldilocks port-forward svc/goldilocks-dashboard 8080:80
```
そして、ブラウザで http://localhost:8080 を開きます。

![Goldilocks-Dashboard](../../../../images/goldilocks-dashboard.png)

Goldilocks が提供する推奨事項を確認するために、サンプル名前空間を分析してみましょう。デプロイメントの推奨事項を確認できるはずです。
![Goldilocks-Recommendation](../../../../images/goldilocks-recommendation.png)

javajmx-sample ワークロードのリクエストとリミットの推奨事項を確認できます。各サービス品質 (QoS) の下にある Current 列は、現在設定されている CPU とメモリのリクエストとリミットを示しています。Guaranteed と Burstable 列は、それぞれの QoS に対する推奨 CPU とメモリのリクエストリミットを示しています。

リソースを過剰にプロビジョニングしていることが明確に分かり、Goldilocks が CPU とメモリのリクエストを最適化するための推奨事項を提供しています。Guaranteed QoS の場合、CPU リクエストとリミットは 100m と 300m に対して 15m と 15m に、メモリリクエストとリミットは 180Mi と 300Mi に対して 105M と 105M に推奨されています。
関心のある QoS クラスに対応するマニフェストファイルをコピーし、適切なサイズに最適化されたワークロードをデプロイするだけです。



### cAdvisor メトリクスを使用したスロットリングの理解と適切なリソース設定

制限を設定する際、特定のコンテナ化されたアプリケーションが特定の期間中にどれだけ長く実行できるかを Linux ノードに指示しています。これは、ノード上の他のワークロードを、不適切なプロセスセットが過度の CPU サイクルを消費することから保護するためです。マザーボード上の物理的な「コア」の数を定義しているわけではありません。しかし、単一のコンテナ内のプロセスやスレッドのグループが、他のアプリケーションに悪影響を与えないように一時的に停止させたい時間を設定しています。

`container_cpu_cfs_throttled_seconds_total` という便利な cAdvisor メトリクスがあります。これはスロットリングされた 5 ミリ秒のスライスをすべて合計し、プロセスがクォータをどれだけ超過しているかを示します。このメトリクスは秒単位なので、値を 10 で割って 100 ミリ秒を得ます。これがコンテナに関連する実際の期間です。

100 ミリ秒の時間における上位 3 つの Pod の CPU 使用率を理解するための PromQL クエリ：
```
topk(3, max by (pod, container)(rate(container_cpu_usage_seconds_total{image!="", instance="$instance"}[$__rate_interval]))) / 10
```
400 ミリ秒の vCPU 使用量が観測されています。

![Throttled-Period](../../../../images/throttled-period.png)

PromQL は 1 秒あたりのスロットリングを提供し、1 秒に 10 の期間があります。期間あたりのスロットリングを得るには、10 で割ります。制限設定をどれだけ増やすべきかを知りたい場合は、10 を掛けます（例：400 ミリ秒 * 10 = 4000 m）。

上記のツールはリソース最適化の機会を特定する方法を提供しますが、アプリケーションチームは特定のアプリケーションが CPU / メモリ集約型かどうかを識別し、スロットリングや過剰プロビジョニングを防ぐためにリソースを割り当てる時間を費やすべきです。

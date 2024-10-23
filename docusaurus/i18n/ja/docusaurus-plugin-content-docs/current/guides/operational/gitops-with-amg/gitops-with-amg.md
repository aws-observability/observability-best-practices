# GitOps と Grafana Operator を使用した Amazon Managed Grafana の運用




## このガイドの使い方

この Observability のベストプラクティスガイドは、Amazon EKS クラスターで Kubernetes オペレーターとして [grafana-operator](https://github.com/grafana-operator/grafana-operator#:~:text=The%20grafana%2Doperator%20is%20a,an%20easy%20and%20scalable%20way.) を使用し、Kubernetes ネイティブな方法で Amazon Managed Grafana の Grafana リソースと Grafana ダッシュボードを作成および管理するライフサイクルを理解したい開発者やアーキテクト向けです。



## はじめに

お客様は、オープンソースの分析と監視ソリューションのためのオブザーバビリティプラットフォームとして Grafana を使用しています。Amazon EKS でワークロードを実行しているお客様は、ワークロードの重力に焦点を当て、Kubernetes ネイティブのコントローラーを利用してクラウドリソースなどの外部リソースのデプロイとライフサイクル管理を行いたいと考えています。お客様が [AWS Controllers for Kubernetes (ACK)](https://aws-controllers-k8s.github.io/community/docs/community/overview/) をインストールして AWS サービスの作成、デプロイ、管理を行っているのを見てきました。最近では、多くのお客様が Prometheus と Grafana の実装をマネージドサービスにオフロードすることを選択しており、AWS の場合、これらのサービスはワークロードの監視のための [Amazon Managed Service for Prometheus](https://docs.aws.amazon.com/ja_jp/prometheus/) と [Amazon Managed Grafana](https://docs.aws.amazon.com/ja_jp/grafana/) です。

Grafana を使用する際にお客様が直面する一般的な課題の 1 つは、Kubernetes クラスターから Amazon Managed Grafana などの外部 Grafana インスタンスの Grafana リソースと Grafana ダッシュボードを作成し、そのライフサイクルを管理することです。お客様は、Amazon Managed Grafana での Grafana リソースの作成も含む、システム全体のインフラストラクチャとアプリケーションのデプロイを Git ベースのワークフローを使用して完全に自動化し管理する方法を見つけることに課題を感じています。このオブザーバビリティのベストプラクティスガイドでは、以下のトピックに焦点を当てます：

* Grafana Operator の紹介 - Kubernetes クラスターから外部 Grafana インスタンスを管理するための Kubernetes オペレーター
* GitOps の紹介 - Git ベースのワークフローを使用してインフラストラクチャを作成および管理する自動化メカニズム
* Amazon EKS 上で Grafana Operator を使用して Amazon Managed Grafana を管理する
* Amazon EKS 上で Flux を使用した GitOps で Amazon Managed Grafana を管理する



## Grafana Operator の紹介

[grafana-operator](https://github.com/grafana-operator/grafana-operator#:~:text=The%20grafana%2Doperator%20is%20a,an%20easy%20and%20scalable%20way.) は、Kubernetes 内の Grafana インスタンスの管理を支援するために構築された Kubernetes オペレーターです。Grafana Operator を使用すると、複数のインスタンス間で Grafana ダッシュボードやデータソースなどを簡単かつスケーラブルな方法で宣言的に管理および作成することができます。Grafana Operator は現在、Amazon Managed Grafana のような外部環境でホストされているダッシュボードやデータソースなどのリソースの管理もサポートしています。これにより、最終的に [Flux](https://fluxcd.io/) のような CNCF プロジェクトを使用した GitOps メカニズムを利用して、Amazon EKS クラスターから Amazon Managed Grafana のリソースを作成し、そのライフサイクルを管理することが可能になります。



## GitOps の概要




### GitOps と Flux とは

GitOps は、Git をデプロイ設定の信頼できる情報源として使用するソフトウェア開発および運用の方法論です。アプリケーションやインフラストラクチャの望ましい状態を Git リポジトリに保持し、Git ベースのワークフローを使用して変更を管理およびデプロイすることを含みます。GitOps は、システム全体が Git リポジトリで宣言的に記述されるように、アプリケーションとインフラストラクチャのデプロイを管理する方法です。これは、バージョン管理、イミュータブルなアーティファクト、自動化のベストプラクティスを活用して、複数の Kubernetes クラスターの状態を管理する能力を提供する運用モデルです。

Flux は、Kubernetes 上のアプリケーションのデプロイを自動化する GitOps ツールです。Git リポジトリの状態を継続的に監視し、変更をクラスターに適用することで機能します。Flux は、GitHub、GitLab、Bitbucket などの様々な Git プロバイダーと統合します。リポジトリに変更が加えられると、Flux は自動的にそれを検出し、それに応じてクラスターを更新します。



### Flux を使用する利点

* **自動化されたデプロイ**: Flux はデプロイプロセスを自動化し、手動によるエラーを減らし、開発者が他のタスクに集中できるようにします。
* **Git ベースのワークフロー**: Flux は Git をソースオブトゥルースとして活用し、変更の追跡と元に戻すことを容易にします。
* **宣言的な設定**: Flux は [Kubernetes](https://dzone.com/articles/kubernetes-full-stack-example-with-kong-ingress-co) マニフェストを使用してクラスターの望ましい状態を定義し、変更の管理と追跡を容易にします。




### Flux 導入における課題

* **カスタマイズの制限**: Flux はカスタマイズの選択肢が限られており、すべてのユースケースに適していない可能性があります。
* **急な学習曲線**: Flux は新規ユーザーにとって学習曲線が急であり、Kubernetes と Git の深い理解が必要です。




## Amazon EKS 上の Grafana Operator を使用して Amazon Managed Grafana のリソースを管理する

前のセクションで説明したように、Grafana Operator を使用すると、Kubernetes クラスターを使用して、Kubernetes ネイティブな方法で Amazon Managed Grafana のリソースを作成し、ライフサイクルを管理できます。以下のアーキテクチャ図は、Grafana Operator を使用して AMG とのアイデンティティをセットアップし、Amazon Managed Service for Prometheus をデータソースとして追加し、Amazon EKS クラスターから Kubernetes ネイティブな方法で Amazon Managed Grafana 上にダッシュボードを作成する、コントロールプレーンとしての Kubernetes クラスターのデモンストレーションを示しています。

![GitOPS-WITH-AMG-2](../../../images/Operational/gitops-with-amg/gitops-with-amg-2.jpg)

上記のソリューションを Amazon EKS クラスターにデプロイする方法の詳細なデモンストレーションについては、[Kubernetes クラスター上のオープンソース Grafana Operator を使用して Amazon Managed Grafana を管理する](https://aws.amazon.com/blogs/mt/using-open-source-grafana-operator-on-your-kubernetes-cluster-to-manage-amazon-managed-grafana/) の記事を参照してください。



## Amazon EKS での Flux を使用した GitOps による Amazon Managed Grafana リソースの管理

上記で説明したように、Flux は Kubernetes 上のアプリケーションのデプロイを自動化します。
GitHub などの Git リポジトリの状態を継続的に監視し、リポジトリに変更が加えられると、Flux は自動的にそれを検出してクラスターを適宜更新します。
以下のアーキテクチャを参照してください。
ここでは、Kubernetes クラスターから Grafana Operator を使用し、Flux を使用した GitOps メカニズムにより、Amazon Managed Service for Prometheus をデータソースとして追加し、Amazon Managed Grafana にダッシュボードを Kubernetes ネイティブな方法で作成する方法を示します。

![GitOPS-WITH-AMG-1](../../../images/Operational/gitops-with-amg/gitops-with-amg-1.jpg)

One Observability Workshop モジュールの [GitOps with Amazon Managed Grafana](https://catalog.workshops.aws/observability/en-US/aws-managed-oss/gitops-with-amg) を参照してください。
このモジュールでは、EKS クラスターに以下のような必要な「Day 2」運用ツールをセットアップします：

* [External Secrets Operator](https://github.com/external-secrets/external-secrets/tree/main/deploy/charts/external-secrets) が正常にインストールされ、AWS Secret Manager から Amazon Managed Grafana のシークレットを読み取ります
* [Prometheus Node Exporter](https://github.com/prometheus/node_exporter) がメモリ、ディスク、CPU 使用率などのさまざまなマシンリソースを測定します
* [Grafana Operator](https://github.com/grafana-operator/grafana-operator) を使用して、Kubernetes クラスターで Amazon Managed Grafana のリソースを Kubernetes ネイティブな方法で作成および管理します
* [Flux](https://fluxcd.io/) が GitOps メカニズムを使用して Kubernetes 上のアプリケーションのデプロイを自動化します



## 結論

オブザーバビリティのベストプラクティスガイドのこのセクションでは、Grafana Operator と GitOps を Amazon Managed Grafana で使用する方法について学びました。まず、GitOps と Grafana Operator について学びました。

次に、Amazon EKS 上で Grafana Operator を使用して Amazon Managed Grafana のリソースを管理する方法と、Amazon EKS 上の Flux を使用した GitOps で Amazon Managed Grafana のリソースを管理する方法に焦点を当てました。

具体的には、Amazon Managed Grafana でアイデンティティをセットアップし、Amazon EKS クラスターから Amazon Managed Grafana に AWS データソースを Kubernetes ネイティブな方法で追加する方法を学びました。

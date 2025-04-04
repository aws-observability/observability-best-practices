# GitOps と Grafana Operator を使用した Amazon Managed Grafana の管理




## このガイドの使い方

このオブザーバビリティのベストプラクティスガイドは、Amazon EKS クラスターで Kubernetes オペレーターとして [grafana-operator](https://github.com/grafana-operator/grafana-operator#:~:text=The%20grafana%2Doperator%20is%20a,an%20easy%20and%20scalable%20way.) を使用し、Kubernetes ネイティブな方法で Amazon Managed Grafana の Grafana リソースと Grafana ダッシュボードのライフサイクルを作成・管理する方法を理解したい開発者やアーキテクトを対象としています。



## はじめに

お客様は、オープンソースの分析とモニタリングソリューションのためのオブザーバビリティプラットフォームとして Grafana を使用しています。Amazon EKS でワークロードを実行しているお客様は、ワークロードの重要性に焦点を当て、Kubernetes ネイティブのコントローラーを使用して Cloud リソースなどの外部リソースのデプロイとライフサイクル管理に依存したいと考えています。お客様は [AWS Controllers for Kubernetes (ACK)](https://aws-controllers-k8s.github.io/community/docs/community/overview/) をインストールして、AWS サービスの作成、デプロイ、管理を行っています。最近では、多くのお客様が Prometheus と Grafana の実装をマネージドサービスに移行することを選択しており、AWS の場合、これらのサービスはワークロードのモニタリングのために [Amazon Managed Service for Prometheus](https://docs.aws.amazon.com/ja_jp/prometheus/) と [Amazon Managed Grafana](https://docs.aws.amazon.com/ja_jp/grafana/) を使用しています。

お客様が Grafana を使用する際の一般的な課題の 1 つは、Kubernetes クラスターから Amazon Managed Grafana などの外部 Grafana インスタンスで Grafana リソースと Grafana ダッシュボードを作成し、そのライフサイクルを管理することです。お客様は、Amazon Managed Grafana でのGrafana リソースの作成も含めて、Git ベースのワークフローを使用してシステム全体のインフラストラクチャとアプリケーションのデプロイを完全に自動化し管理する方法を見つけることに課題を抱えています。このオブザーバビリティのベストプラクティスガイドでは、以下のトピックに焦点を当てます：

* Grafana Operator の紹介 - Kubernetes クラスターから外部 Grafana インスタンスを管理するための Kubernetes オペレーター
* GitOps の紹介 - Git ベースのワークフローを使用してインフラストラクチャを作成および管理する自動化メカニズム
* Amazon EKS で Grafana Operator を使用して Amazon Managed Grafana を管理する
* Amazon EKS で Flux を使用した GitOps で Amazon Managed Grafana を管理する



## Grafana Operator の概要

[grafana-operator](https://github.com/grafana-operator/grafana-operator#:~:text=The%20grafana%2Doperator%20is%20a,an%20easy%20and%20scalable%20way.) は、Kubernetes 内の Grafana インスタンスの管理を支援するために構築された Kubernetes オペレーターです。
Grafana Operator を使用すると、複数のインスタンス間で Grafana ダッシュボードやデータソースなどを宣言的に作成・管理することが容易にできます。
Grafana Operator は現在、Amazon Managed Grafana のような外部環境でホストされているダッシュボードやデータソースなどのリソースの管理もサポートしています。
これにより、[Flux](https://fluxcd.io/) などの CNCF プロジェクトを使用した GitOps メカニズムを活用して、Amazon EKS クラスターから Amazon Managed Grafana のリソースを作成し、そのライフサイクルを管理することが可能になります。



## GitOps の概要




### GitOps と Flux とは

GitOps は、Git をデプロイ設定の信頼できる情報源として使用するソフトウェア開発および運用手法です。

アプリケーションやインフラストラクチャの望ましい状態を Git リポジトリに保持し、Git ベースのワークフローを使用して変更を管理およびデプロイします。

GitOps は、システム全体を Git リポジトリで宣言的に記述することで、アプリケーションとインフラストラクチャのデプロイを管理する方法です。

これは、バージョン管理、イミュータブル(不変性)なアーティファクト、自動化のベストプラクティスを活用して、複数の Kubernetes クラスターの状態を管理する能力を提供する運用モデルです。

Flux は、Kubernetes 上のアプリケーションのデプロイを自動化する GitOps ツールです。

Git リポジトリの状態を継続的に監視し、クラスターに変更を適用することで機能します。

Flux は、GitHub、[GitLab](https://dzone.com/articles/auto-deploy-spring-boot-app-using-gitlab-cicd)、Bitbucket などの様々な Git プロバイダーと統合されています。

リポジトリに変更が加えられると、Flux は自動的にそれを検出し、それに応じてクラスターを更新します。



### Flux を使用するメリット

* **自動デプロイ**: Flux はデプロイプロセスを自動化し、手動によるエラーを減らし、開発者が他のタスクに集中できるようにします。
* **Git ベースのワークフロー**: Flux は Git をソースオブトゥルースとして活用し、変更の追跡とロールバックを容易にします。
* **宣言的な設定**: Flux は [Kubernetes](https://dzone.com/articles/kubernetes-full-stack-example-with-kong-ingress-co) マニフェストを使用してクラスターの望ましい状態を定義し、変更の管理と追跡を容易にします。




### Flux 導入における課題

* **カスタマイズの制限**: Flux がサポートするカスタマイズは限定的で、すべてのユースケースに適していない可能性があります。
* **急な学習曲線**: Flux は新規ユーザーにとって学習曲線が急で、Kubernetes と Git の深い理解が必要です。




## Amazon EKS で Grafana Operator を使用して Amazon Managed Grafana のリソースを管理する

前のセクションで説明したように、Grafana Operator を使用すると、Kubernetes クラスターを使用して、Kubernetes ネイティブな方法で Amazon Managed Grafana のリソースを作成し、ライフサイクルを管理できます。以下のアーキテクチャ図は、Grafana Operator を使用してコントロールプレーンとして Kubernetes クラスターを使用し、AMG でアイデンティティを設定し、Amazon Managed Service for Prometheus をデータソースとして追加し、Kubernetes ネイティブな方法で Amazon EKS クラスターから Amazon Managed Grafana にダッシュボードを作成する方法を示しています。

![GitOPS-WITH-AMG-2](../../../images/Operational/gitops-with-amg/gitops-with-amg-2.jpg)

上記のソリューションを Amazon EKS クラスターにデプロイする方法の詳細なデモンストレーションについては、[Using Open Source Grafana Operator on your Kubernetes cluster to manage Amazon Managed Grafana](https://aws.amazon.com/blogs/mt/using-open-source-grafana-operator-on-your-kubernetes-cluster-to-manage-amazon-managed-grafana/) を参照してください。



## Amazon EKS で Flux を使用した GitOps による Amazon Managed Grafana リソースの管理

前述のように、Flux は Kubernetes 上のアプリケーションのデプロイを自動化します。
GitHub などの Git リポジトリの状態を継続的に監視し、リポジトリに変更が加えられると、Flux は自動的にそれを検出してクラスターを更新します。
以下のアーキテクチャ図は、Kubernetes クラスターから Grafana Operator を使用し、Flux による GitOps メカニズムを使って、Amazon Managed Service for Prometheus をデータソースとして追加し、Kubernetes ネイティブな方法で Amazon Managed Grafana にダッシュボードを作成する方法を示しています。

![GitOPS-WITH-AMG-1](../../../images/Operational/gitops-with-amg/gitops-with-amg-1.jpg)

One Observability Workshop のモジュール [GitOps with Amazon Managed Grafana](https://catalog.workshops.aws/observability/en-US/aws-managed-oss/gitops-with-amg) を参照してください。
このモジュールでは、EKS クラスターに以下のような必要な「Day One」運用ツールをセットアップします：

* AWS Secrets Manager から Amazon Managed Grafana のシークレットを読み取るための [External Secrets Operator](https://github.com/external-secrets/external-secrets/tree/main/deploy/charts/external-secrets) のインストール
* メモリ、ディスク、CPU 使用率などのマシンリソースを測定するための [Prometheus Node Exporter](https://github.com/prometheus/node_exporter)
* Kubernetes ネイティブな方法で Amazon Managed Grafana のリソースを作成・管理するための [Grafana Operator](https://github.com/grafana-operator/grafana-operator)
* GitOps メカニズムを使用して Kubernetes 上のアプリケーションのデプロイを自動化する [Flux](https://fluxcd.io/)



## まとめ

オブザーバビリティのベストプラクティスガイドのこのセクションでは、Grafana Operator と GitOps を Amazon Managed Grafana で使用する方法について学びました。
まず、GitOps と Grafana Operator について学習しました。
次に、Amazon EKS 上で Grafana Operator を使用して Amazon Managed Grafana のリソースを管理する方法と、Amazon EKS 上の Flux を使用して GitOps で Amazon Managed Grafana のリソースを管理する方法に焦点を当てました。
これにより、Amazon Managed Grafana でのアイデンティティのセットアップ、Amazon EKS クラスターから Kubernetes ネイティブな方法で Amazon Managed Grafana への AWS データソースの追加について学びました。

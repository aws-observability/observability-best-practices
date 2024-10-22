# Amazon Managed Grafana で GitOps と Grafana Operator を使用する

## このガイドの使い方

このオブザーバビリティのベストプラクティスガイドは、[grafana-operator](https://github.com/grafana-operator/grafana-operator#:~:text=The%20grafana%2Doperator%20is%20a,an%20easy%20and%20scalable%20way.) を Amazon EKS クラスター上の Kubernetes オペレーターとして使用し、Kubernetes ネイティブの方法で Amazon Managed Grafana の Grafana リソースと Grafana ダッシュボードのライフサイクルを作成、管理する方法を理解したい開発者やアーキテクトを対象としています。

## はじめに

お客様は、オープンソースのアナリティクスおよびモニタリングソリューションとして Grafana をオブザーバビリティプラットフォームに利用しています。Amazon EKS でワークロードを実行しているお客様の中には、ワークロードの重心をシフトし、外部リソースやクラウドリソースのデプロイとライフサイクル管理を Kubernetes ネイティブのコントローラに依存したいというニーズがあります。お客様の中には、[AWS Controllers for Kubernetes (ACK)](https://aws-controllers-k8s.github.io/community/docs/community/overview/) をインストールして AWS サービスを作成、デプロイ、管理している方もいます。最近では、Prometheus と Grafana の実装をマネージドサービスにオフロードすることを選択するお客様が増えており、AWS の場合は [Amazon Managed Service for Prometheus](https://docs.aws.amazon.com/ja_jp/prometheus/) と [Amazon Managed Grafana](https://docs.aws.amazon.com/ja_jp/grafana/) がワークロードのモニタリングに利用されています。

Grafana を利用する際の一般的な課題は、Amazon Managed Grafana などの外部 Grafana インスタンスから Kubernetes クラスターで Grafana リソースと Grafana ダッシュボードのライフサイクルを作成および管理することです。お客様は、Git ベースのワークフローを使用してシステム全体のインフラストラクチャとアプリケーションのデプロイを完全に自動化および管理する方法を見つけるのに課題を感じており、これには Amazon Managed Grafana での Grafana リソースの作成も含まれます。このオブザーバビリティベストプラクティスガイドでは、以下のトピックに焦点を当てます。

* Grafana Operator の紹介 - Kubernetes クラスターから外部 Grafana インスタンスを管理する Kubernetes Operator
* GitOps の紹介 - Git ベースのワークフローを使用してインフラストラクチャを作成および管理する自動化メカニズム
* Amazon EKS で Grafana Operator を使用して Amazon Managed Grafana を管理する
* Amazon EKS で Flux を使用した GitOps により Amazon Managed Grafana を管理する

## Grafana Operator の概要

[grafana-operator](https://github.com/grafana-operator/grafana-operator#:~:text=The%20grafana%2Doperator%20is%20a,an%20easy%20and%20scalable%20way.) は、Kubernetes 内の Grafana インスタンスを管理するために構築された Kubernetes Operator です。Grafana Operator を使用すると、ダッシュボード、データソースなどの Grafana リソースを、複数のインスタンス間で宣言的に簡単かつスケーラブルな方法で管理および作成できます。Grafana Operator は現在、Amazon Managed Grafana などの外部環境でホストされているダッシュボード、データソースなどのリソースを管理することをサポートしています。これにより最終的に、[Flux](https://fluxcd.io/) などの CNCF プロジェクトを使用した GitOps メカニズムを利用して、Amazon EKS クラスターから Amazon Managed Grafana のリソースのライフサイクルを作成および管理できるようになります。

## GitOps の概要

### GitOps と Flux とは

GitOps は、デプロイ構成のソースオブトゥルースとして Git を使用するソフトウェア開発およびオペレーション手法です。アプリケーションまたはインフラストラクチャの目的の状態を Git リポジトリに保持し、Git ベースのワークフローを使用して変更を管理およびデプロイします。GitOps は、アプリケーションとインフラストラクチャのデプロイを管理する方法で、システム全体を Git リポジトリに宣言的に記述します。これは、バージョン管理、イミュータブルアーティファクト、自動化のベストプラクティスを活用して、複数の Kubernetes クラスターの状態を管理できるオペレーショナルモデルです。

Flux は、Kubernetes 上のアプリケーションのデプロイを自動化する GitOps ツールです。Git リポジトリの状態を継続的に監視し、クラスターに変更を適用します。Flux は GitHub、[GitLab](https://dzone.com/articles/auto-deploy-spring-boot-app-using-gitlab-cicd)、Bitbucket などさまざまな Git プロバイダと統合されています。リポジトリに変更が加えられると、Flux はそれを自動的に検出し、クラスターを適宜更新します。

### Flux を使用するメリット

* **自動デプロイ**: Flux はデプロイプロセスを自動化し、人為的なミスを減らし、開発者が他のタスクに集中できるようになります。
* **Git ベースのワークフロー**: Flux は Git を単一の情報源として利用するため、変更の追跡と元に戻すことが容易になります。
* **宣言型の設定**: Flux は Kubernetes マニフェストを使用してクラスターの目標状態を定義するため、変更の管理と追跡が容易になります。

### Flux の採用における課題

* **カスタマイズ性の制限**: Flux はカスタマイズ可能な範囲が限られているため、すべてのユースケースに適さない可能性があります。
* **学習曲線が急**: Flux は新規ユーザーにとって学習曲線が急で、Kubernetes と Git の深い理解が必要です。

## Amazon EKS 上の Grafana Operator を使用して Amazon Managed Grafana のリソースを管理する

前のセクションで説明したように、Grafana Operator を使用すると、Kubernetes ネイティブの方法で Amazon Managed Grafana のリソースのライフサイクルを作成および管理できます。以下のアーキテクチャ図は、Grafana Operator を使用して Amazon EKS クラスターからコントロールプレーンとして、Amazon Managed Grafana にアイデンティティをセットアップし、Amazon Managed Service for Prometheus をデータソースとして追加し、Kubernetes ネイティブの方法で Amazon Managed Grafana にダッシュボードを作成する様子を示しています。

![GitOPS-WITH-AMG-2](../../../images/Operational/gitops-with-amg/gitops-with-amg-2.jpg)

Amazon EKS クラスターにこのソリューションをデプロイする方法の詳細については、[Using Open Source Grafana Operator on your Kubernetes cluster to manage Amazon Managed Grafana](https://aws.amazon.com/blogs/mt/using-open-source-grafana-operator-on-your-kubernetes-cluster-to-manage-amazon-managed-grafana/) をご覧ください。

## Amazon EKS 上の Flux を使った GitOps による Amazon Managed Grafana のリソース管理

上記で説明したように、Flux は Kubernetes 上のアプリケーションのデプロイを自動化します。GitHub などの Git リポジトリの状態を継続的に監視し、リポジトリに変更があると、Flux がそれを自動的に検出してクラスターを更新します。以下のアーキテクチャを参照してください。ここでは、Kubernetes クラスターから Grafana Operator を使用し、Flux による GitOps メカニズムを使って、Amazon Managed Service for Prometheus をデータソースとして追加し、Kubernetes ネイティブの方法で Amazon Managed Grafana にダッシュボードを作成する方法を示します。

![GitOPS-WITH-AMG-1](../../../images/Operational/gitops-with-amg/gitops-with-amg-1.jpg)

One Observability Workshop モジュール - [GitOps with Amazon Managed Grafana](https://catalog.workshops.aws/observability/en-US/aws-managed-oss/gitops-with-amg) を参照してください。このモジュールでは、EKS クラスターに以下のような "Day 2" の運用ツールをセットアップします。

* Amazon Managed Grafana の秘密鍵を AWS Secrets Manager から読み取るために [External Secrets Operator](https://github.com/external-secrets/external-secrets/tree/main/deploy/charts/external-secrets) がインストールされています
* メモリ、ディスク、CPU 使用率などさまざまなマシンリソースを測定する [Prometheus Node Exporter](https://github.com/prometheus/node_exporter)
* Kubernetes ネイティブの方法で Amazon Managed Grafana のリソースのライフサイクルを作成および管理するための [Grafana Operator](https://github.com/grafana-operator/grafana-operator)
* GitOps メカニズムを使って Kubernetes 上のアプリケーションのデプロイを自動化する [Flux](https://fluxcd.io/)

## 結論

このオブザーバビリティのベストプラクティスガイドのセクションでは、Amazon Managed Grafana での Grafana Operator と GitOps の使用方法を学びました。GitOps と Grafana Operator について学んだ後、Amazon EKS で Grafana Operator を使用して Amazon Managed Grafana のリソースを管理する方法と、Flux を使用して GitOps で Amazon Managed Grafana のリソースを管理し、AMG でアイデンティティをセットアップし、Kubernetes ネイティブの方法で Amazon EKS クラスターから Amazon Managed Grafana に AWS データソースを追加する方法に焦点を当てました。

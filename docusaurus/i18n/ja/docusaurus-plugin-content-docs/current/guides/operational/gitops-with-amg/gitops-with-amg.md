# GitOps と Grafana Operator を Amazon Managed Grafana で使用する

## このガイドの使用方法

この Observability ベストプラクティスガイドは、Amazon EKS クラスター上で Kubernetes オペレーターとして [grafana-operator](https://github.com/grafana-operator/grafana-operator#:~:text=The%20grafana%2Doperator%20is%20a,an%20easy%20and%20scalable%20way.) を使用し、Kubernetes ネイティブな方法で Amazon Managed Grafana 内の Grafana リソースと Grafana ダッシュボードのライフサイクルを作成および管理する方法を理解したい開発者とアーキテクト向けです。

## はじめに

お客様は、オープンソースの分析およびモニタリングソリューションのオブザーバビリティプラットフォームとして Grafana を使用しています。Amazon EKS でワークロードを実行しているお客様が、ワークロードの重心に焦点を移し、Kubernetes ネイティブコントローラーに依存して、クラウドリソースなどの外部リソースのデプロイとライフサイクル管理を行いたいと考えているのを目にしてきました。お客様が [AWS Controllers for Kubernetes (ACK)](https://aws-controllers-k8s.github.io/community/docs/community/overview/) をインストールして、AWS サービスの作成、デプロイ、管理を行っているのを目にしてきました。最近では、多くのお客様が Prometheus と Grafana の実装をマネージドサービスにオフロードすることを選択しており、AWS の場合、これらのサービスはワークロードのモニタリングのための [Amazon Managed Service for Prometheus](https://docs.aws.amazon.com/prometheus/?icmpid=docs_homepage_mgmtgov) と [Amazon Managed Grafana](https://docs.aws.amazon.com/grafana/?icmpid=docs_homepage_mgmtgov) です。

Grafana を使用する際にお客様が直面する一般的な課題の 1 つは、Kubernetes クラスターから Amazon Managed Grafana などの外部 Grafana インスタンスで Grafana リソースと Grafana ダッシュボードのライフサイクルを作成および管理することです。お客様は、Amazon Managed Grafana での Grafana リソースの作成を含む、システム全体のインフラストラクチャとアプリケーションのデプロイを Git ベースのワークフローを使用して完全に自動化および管理する方法を見つけることに課題を抱えています。このオブザーバビリティのベストプラクティスガイドでは、以下のトピックに焦点を当てます。

* Grafana Operator の紹介 - Kubernetes クラスターから外部 Grafana インスタンスを管理するための Kubernetes オペレーター
* GitOps の紹介 - Git ベースのワークフローを使用してインフラストラクチャを作成および管理するための自動化メカニズム
* Amazon EKS で Grafana Operator を使用して Amazon Managed Grafana を管理する
* Amazon EKS で Flux を使用した GitOps で Amazon Managed Grafana を管理する

## Grafana Operator の概要

[grafana-operator](https://github.com/grafana-operator/grafana-operator#:~:text=The%20grafana%2Doperator%20is%20a,an%20easy%20and%20scalable%20way.) は、Kubernetes 内の Grafana インスタンスの管理を支援するために構築された Kubernetes オペレーターです。Grafana Operator を使用すると、複数のインスタンス間で Grafana ダッシュボード、データソースなどを宣言的に管理および作成することが、簡単かつスケーラブルな方法で可能になります。Grafana オペレーターは現在、Amazon Managed Grafana などの外部環境でホストされているダッシュボード、データソースなどのリソースの管理をサポートしています。これにより、最終的には [Flux](https://fluxcd.io/) などの CNCF プロジェクトを使用した GitOps メカニズムを利用して、Amazon EKS クラスターから Amazon Managed Grafana のリソースのライフサイクルを作成および管理できるようになります。

## GitOps の概要

### GitOps と Flux とは

GitOps は、デプロイ設定の信頼できる情報源として Git を使用するソフトウェア開発および運用の方法論です。アプリケーションまたはインフラストラクチャの望ましい状態を Git リポジトリに保持し、Git ベースのワークフローを使用して変更を管理およびデプロイすることが含まれます。GitOps は、システム全体が Git リポジトリで宣言的に記述されるように、アプリケーションとインフラストラクチャのデプロイを管理する方法です。これは、バージョン管理、不変のアーティファクト、自動化のベストプラクティスを活用して、複数の Kubernetes クラスターの状態を管理する機能を提供する運用モデルです。

Flux は、Kubernetes 上のアプリケーションのデプロイを自動化する GitOps ツールです。Git リポジトリの状態を継続的に監視し、クラスタに変更を適用することで動作します。Flux は、GitHub、[GitLab](https://dzone.com/articles/auto-deploy-spring-boot-app-using-gitlab-cicd/)、Bitbucket などのさまざまな Git プロバイダーと統合されます。リポジトリに変更が加えられると、Flux は自動的にそれらを検出し、それに応じてクラスタを更新します。

### Flux を使用する利点

* **自動デプロイ**: Flux はデプロイプロセスを自動化し、手動エラーを削減し、開発者が他のタスクに集中できるようにします。
* **Git ベースのワークフロー**: Flux は Git を信頼できる情報源として活用するため、変更の追跡と元に戻す操作が容易になります。
* **宣言的な設定**: Flux は [Kubernetes](https://dzone.com/articles/kubernetes-full-stack-example-with-kong-ingress-co/) マニフェストを使用してクラスターの望ましい状態を定義するため、変更の管理と追跡が容易になります。

### Flux 導入における課題

* **カスタマイズの制限**: Flux はカスタマイズのセットが限られており、すべてのユースケースに適しているとは限りません。
* **急な学習曲線**: Flux は新規ユーザーにとって学習曲線が急であり、Kubernetes と Git の深い理解が必要です。

## Amazon EKS で Grafana Operator を使用して Amazon Managed Grafana のリソースを管理する

前のセクションで説明したように、Grafana Operator を使用すると、Kubernetes クラスターを使用して、Amazon Managed Grafana のリソースのライフサイクルを Kubernetes ネイティブな方法で作成および管理できます。以下のアーキテクチャ図は、Grafana Operator を使用してコントロールプレーンとしての Kubernetes クラスターのデモンストレーションを示しています。AMG との ID の設定、Amazon Managed Service for Prometheus のデータソースとしての追加、および Amazon EKS クラスターから Amazon Managed Grafana 上でのダッシュボードの作成を Kubernetes ネイティブな方法で行います。

![GitOPS-WITH-AMG-2](../../../images/Operational/gitops-with-amg/gitops-with-amg-2.jpg)

Amazon EKS クラスターに上記のソリューションをデプロイする方法の詳細なデモンストレーションについては、[Kubernetes クラスターでオープンソース Grafana Operator を使用して Amazon Managed Grafana を管理する](https://aws.amazon.com/blogs/mt/using-open-source-grafana-operator-on-your-kubernetes-cluster-to-manage-amazon-managed-grafana/)に関する投稿を参照してください。

## Amazon EKS で Flux を使用した GitOps による Amazon Managed Grafana のリソース管理

上記で説明したように、Flux は Kubernetes 上のアプリケーションのデプロイを自動化します。GitHub などの Git リポジトリの状態を継続的に監視することで動作し、リポジトリに変更が加えられると、Flux は自動的にそれらを検出し、それに応じてクラスターを更新します。以下のアーキテクチャを参照してください。ここでは、Kubernetes クラスターから Grafana Operator を使用し、Flux を使用した GitOps メカニズムを使用して、Amazon Managed Service for Prometheus をデータソースとして追加し、Kubernetes ネイティブな方法で Amazon Managed Grafana にダッシュボードを作成する方法を実演します。 

![GitOPS-WITH-AMG-1](../../../images/Operational/gitops-with-amg/gitops-with-amg-1.jpg)

One Observability Workshop モジュール - [GitOps with Amazon Managed Grafana](https://catalog.workshops.aws/observability/en-US/aws-managed-oss/gitops-with-amg) を参照してください。このモジュールは、EKS クラスター上に以下のような必要な「Day 2」運用ツールをセットアップします。

* [External Secrets Operator](https://github.com/external-secrets/external-secrets/tree/main/deploy/charts/external-secrets) が正常にインストールされ、AWS Secret Manager から Amazon Managed Grafana のシークレットを読み取ります
* [Prometheus Node Exporter](https://github.com/prometheus/node_exporter) でメモリ、ディスク、CPU 使用率などのさまざまなマシンリソースを測定します
* [Grafana Operator](https://github.com/grafana-operator/grafana-operator) を使用して、Kubernetes クラスターで Amazon Managed Grafana のリソースのライフサイクルを Kubernetes ネイティブな方法で作成および管理します。
* [Flux](https://fluxcd.io/) を使用して、GitOps メカニズムを使用した Kubernetes 上のアプリケーションのデプロイを自動化します。

## まとめ

このオブザーバビリティのベストプラクティスガイドのセクションでは、Grafana Operator と GitOps を Amazon Managed Grafana で使用する方法について学びました。まず、GitOps と Grafana Operator について学習しました。次に、Amazon EKS 上の Grafana Operator を使用して Amazon Managed Grafana のリソースを管理する方法、および Amazon EKS 上の Flux を使用した GitOps で Amazon Managed Grafana のリソースを管理する方法に焦点を当て、AMG との ID 設定、Amazon EKS クラスターから Amazon Managed Grafana に AWS データソースを Kubernetes ネイティブな方法で追加する方法について学びました。
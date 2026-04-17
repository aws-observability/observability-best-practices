---
sidebar_position: 3
---
# エージェント/コレクターの設定

モニタリングアカウント構造が整ったら、アプリケーション、サービス、その他のインフラストラクチャコンポーネントがテレメトリを CloudWatch に送信するように設定する必要があります。

これは、エージェントとコレクターを設定するための高レベルのガイドです。詳細なガイダンスについては、このベストプラクティスガイドのさまざまなセクションを参照してください。

## Amazon EKS

EKS の場合、オブザーバビリティを設定する最も簡単な方法は、Amazon EKS アドオンを使用することです。これにより、Amazon EKS の拡張オブザーバビリティを備えた Container Insights がインストールされます。このアドオンは、クラスターからインフラストラクチャメトリクスを送信するために CloudWatch エージェントをインストールし、コンテナログを送信するために Fluent Bit をインストールし、さらにアプリケーションパフォーマンステレメトリを送信するために CloudWatch Application Signals を有効にします。(Application Signals、Container Insights などが不要な場合は設定可能です。)

通常、Amazon CloudWatch Observability EKS アドオンは DaemonSet としてインストールされます。

EKS のオプションには次のものがあります。

### EKS 用 CloudWatch エージェント

- Amazon CloudWatch Observability EKS アドオン
- Amazon CloudWatch Observability Helm Chart

### EKS 用 OTEL Collector

あるいは、OTEL コレクターを使用する場合は、次のことができます。
- AWS Exporter を設定する
- OTLP エクスポーターをログとトレースの OTLP エンドポイントに向けるように設定する
- 処理パイプラインを定義する
- OTEL ライブラリを使用してアプリケーションをインストルメント化する（必要な場合）

## Amazon ECS

ECS の場合、Container Insights を有効にして、クラスターのインフラストラクチャメトリクスを収集できます。また、Application Signals をデプロイして、アプリケーションパフォーマンステレメトリと関連するトレースを収集することもできます。ログについては、awslogs ドライバーを使用してログデータを CloudWatch に送信するか、OpenTelemetry コレクターを使用してデータを送信できます。

EKS のオプションには次のものがあります。

### ECS 用 CloudWatch エージェント

- Container Insights を有効化
- Application Signals をデプロイ (オプション)
- awslogs ログドライバーを使用

### ECS 用 OTEL Collector

あるいは、次のことができます。
- サイドカーとして実行
- AWS Exporter を設定
- OTLP エンドポイントを設定
- 処理パイプラインを定義
- アプリケーションをインストルメント化（必要な場合）

## Amazon EC2 とオンプレミス

CloudWatch エージェントを使用して、EC2 インスタンス、その他の仮想マシン、オンプレミスサーバーから CloudWatch にテレメトリデータを送信できます。

### デプロイオプション

- **EC2 のワークロード検出** – エージェントをデプロイする自動化された方法を提供します

![EC2 Workload Detection](../../images/GettingStarted/ec2workloaddetection.png)

- **Systems Manager** – AWS Systems Manager を使用してエージェントをデプロイおよび設定します
- **カスタム自動化** – 独自の自動化ツールを使用します
- **手動インストール** – 特定のユースケースに対して手動でインストールします

設定ファイルを使用して (自動または手動で) テレメトリを設定/カスタマイズでき、設定を微調整するためのウィザードが利用可能です。

### EC2 用 OTEL Collector

OTEL コレクターは以下でも使用できます。

**OTLP Exporter:**

![OTLP Configuration](../../images/GettingStarted/otlp.png)

トレースとログの OTLP エンドポイントには OTLP エクスポーターを使用します。

**AWS 固有のエクスポーター:**

![ADOT Configuration](../../images/GettingStarted/adot.png)

AWS 固有のエクスポーターと処理パイプラインを使用します。

## まとめ

まとめると、次のようになります。
1. コンピューティングプラットフォーム (EKS、ECS、EC2) に適したエージェント/コレクターを選択します
2. 自動化された方法 (アドオン、Helm チャート、Systems Manager) または手動インストールを使用してデプロイします
3. 要件に基づいてテレメトリ収集を設定します
4. オプションで、ベンダーニュートラルなインストルメンテーションのために OpenTelemetry を使用します

詳細な設定ガイドについては、お使いのコンピューティングプラットフォームと可観測性ツールに関する、このベストプラクティスガイドの特定のセクションを参照してください。

## 次のステップ

[ダッシュボードとアラート](./dashboards-alerts.md)に進みます。

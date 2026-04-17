---
sidebar_position: 4
---
# ダッシュボードとアラート

テレメトリが流れるようになったら、ユースケースに関連するダッシュボードとアラートを設定できます。

## キュレーションされたダッシュボード

CloudWatch コンソールのさまざまな部分で見つけることができる、厳選されたダッシュボードを必ず活用してください。

たとえば、Dashboards の下に多くのサービス (Lambda、EC2、API Gateway など) の自動化されたダッシュボードがあります。

Application Signals を活用している場合、Application Signals (APM) の下にアプリケーションマップとダッシュボードが表示されます。さらに、計装されていないサービスも表示され、オブザーバビリティのギャップが強調表示されます。

## カスタムダッシュボード

ビジネス固有のダッシュボードも設計する必要があります。運用の卓越性のためにダッシュボードを設計する方法については、次のガイドを参照してください。[運用の可視性のためのダッシュボードの構築](https://aws.amazon.com/builders-library/building-dashboards-for-operational-visibility/)

## CloudWatch アラーム

サービスとインフラストラクチャの問題を通知するアラート (CloudWatch ではアラーム) も作成します。一元化されたアラームの可視性のためにモニタリングアカウントでアラームを作成するか、ローカルアカウントで個別のアラームを作成するか、またはその両方を行うことができます。

### アラームの推奨事項

開始方法がわからない場合は、アラームレコメンデーションが役立ちます。アラームレコメンデーションは、モニタリングのベストプラクティスに基づいています。アラームを作成する前に、推奨されるアラーム設定を確認してください。

詳細については、[AWS サービスのアラーム推奨事項](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Best_Practice_Recommended_Alarms_AWS_Services.html)を参照してください。

## サービスレベル目標 (SLO)

SLO と関連するアラームを作成して、重要な KPI を追跡することもできます。

詳細については、[CloudWatch SLO](../../tools/slos.md) を参照してください。

## 概要

これで CloudWatch の開始ガイドは終了です。ここでは、次の手順について説明しました。

1. **モニタリングアカウントとソースアカウントのセットアップ** – 複数の AWS アカウントとリージョンからのテレメトリデータを一元化するために、クロスアカウント可観測性を設定しました
2. **統合データストアのセットアップ** – 統合されたクエリと分析のために、ログデータを単一のアカウントとリージョンに一元化しました
3. **エージェント/コレクターの設定** – アプリケーションとインフラストラクチャからテレメトリを送信するために、CloudWatch エージェントや OpenTelemetry コレクターをデプロイしました
4. **ダッシュボードとアラート** – サービスの健全性を監視するために、可視性のためのダッシュボードとアラームを作成しました

## 次のステップ

特定のトピックに関するより詳細なガイダンスについては、このベストプラクティスガイド全体の詳細なセクションを参照してください。

- [コンテナ (ECS/EKS)](../containers/aws-native/eks/amazon-cloudwatch-container-insights.md)
- [サーバーレス](../serverless/aws-native/lambda-based-observability.md)
- [運用ガイド](../operational/observability-driven-dev.md)
- [コスト最適化](../cost/cost-visualization/cost.md)
- [シグナル収集](../signal-collection/emf.md)

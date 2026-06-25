---
sidebar_position: 2
---
# AIOps

AI と機械学習を活用してクラウド運用を強化する — 異常検知、自動根本原因分析、予測アラート、インテリジェントな修復。

## AIOps のための AWS サービス

- **[Amazon DevOps Guru](https://aws.amazon.com/devops-guru/)** — ML を活用したインサイトにより、異常なアプリケーション動作を検出し、修復策を推奨します
- **[CloudWatch Anomaly Detection](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch_Anomaly_Detection.html)** — ML アルゴリズムを適用してメトリクスを継続的に分析し、異常を特定します
- **[CloudWatch Application Signals](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-Application-Monitoring-Sections.html)** — アプリケーションサービスとその依存関係を自動的に検出してモニタリングします
- **[Amazon Q Developer operational investigations](https://docs.aws.amazon.com/amazonq/latest/qdeveloper-ug/operational-investigation.html)** — AI を活用した運用上の問題の調査を支援します

## ベストプラクティス

- 主要なビジネスメトリクスの異常検出から始め、その後インフラストラクチャへと拡張する
- コンポジットアラームを使用して、個々の ML ベースの検出器からのノイズを低減する
- AIOps のシグナルと人間の判断を組み合わせる — ML を使用して問題を表面化させるが、レビューなしに重要なシステムを自動修復するためには使用しない
- 運用ランブックや過去のインシデントデータを活用して、AI 支援による調査を改善する

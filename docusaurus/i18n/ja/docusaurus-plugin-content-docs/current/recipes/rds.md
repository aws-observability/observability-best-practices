# Amazon Relational Database Service

[Amazon Relational Database Service][rds-main] (RDS) は、クラウド上でリレーショナルデータベースを簡単に設定、運用、スケーリングできるようにします。コスト効率の高い拡張可能な容量を提供し、ハードウェアのプロビジョニング、データベース設定、パッチ適用、バックアップなどの時間のかかる管理タスクを自動化します。

以下のレシピをご覧ください。

- [CloudWatch Logs、Lambda、SNS を使用して RDS の予防的データベースモニタリングを構築する][rds-cw-sns]
- [CloudWatch を使用して RDS for PostgreSQL と Aurora for PostgreSQL のデータベースログエラーを監視し、通知を設定する][rds-pg-au]
- [Amazon RDS におけるログ記録とモニタリング][rds-mon]
- [Performance Insights メトリクスを CloudWatch に公開する][rds-pi-cw]

[rds-main]: https://aws.amazon.com/jp/rds/
[rds-cw-sns]: https://aws.amazon.com/blogs/database/build-proactive-database-monitoring-for-amazon-rds-with-amazon-cloudwatch-logs-aws-lambda-and-amazon-sns/
[rds-pg-au]: https://aws.amazon.com/blogs/database/monitor-amazon-rds-for-postgresql-and-amazon-aurora-for-postgresql-database-log-errors-and-set-up-notifications-using-amazon-cloudwatch/
[rds-mon]: https://docs.aws.amazon.com/ja_jp/AmazonRDS/latest/UserGuide/Overview.LoggingAndMonitoring.html
[rds-pi-cw]: https://docs.aws.amazon.com/ja_jp/AmazonRDS/latest/UserGuide/USER_PerfInsights.Cloudwatch.html

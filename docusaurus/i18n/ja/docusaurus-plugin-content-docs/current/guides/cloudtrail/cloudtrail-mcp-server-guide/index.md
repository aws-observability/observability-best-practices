# セキュリティ、監査、および運用のための CloudTrail MCP Server の使用

## はじめに

[CloudTrail Model Context Protocol (MCP)](https://awslabs.github.io/mcp/servers/cloudtrail-mcp-server) サーバーを使用すると、[Kiro](https://kiro.dev/cli/) などのエージェントが自然言語を通じて [AWS CloudTrail](https://docs.aws.amazon.com/awscloudtrail/latest/userguide/cloudtrail-user-guide.html) イベントを直接クエリおよび分析できます。[CloudWatch Logs](https://docs.aws.amazon.com/awscloudtrail/latest/userguide/send-cloudtrail-events-to-cloudwatch-logs.html) または [CloudTrail Lake](https://docs.aws.amazon.com/awscloudtrail/latest/userguide/cloudtrail-lake.html) のいずれかにある CloudTrail イベントにエージェントを接続することで、セキュリティインシデントの調査、アカウントアクティビティの監査、運用上の問題のトラブルシューティング、コンプライアンスレポートの生成をすべて、複雑な SQL クエリの記述や JSON ログの手動解析の代わりに、会話形式のプロンプトを通じて実行できます。

## これが重要な理由

セキュリティ、コンプライアンス、および運用チームは、AWS アカウントのアクティビティを把握するために CloudTrail ログの分析に多くの時間を費やしています。

- **セキュリティチーム**は、不審なアクティビティを迅速に調査し、不正アクセスの試みを追跡し、複数のアカウントにわたる潜在的なセキュリティインシデントの範囲を特定する必要があります
- **コンプライアンスチーム**は、誰がどのリソースにアクセスしたか、いつ変更が行われたか、アクティビティが組織のポリシーに準拠しているかどうかを示す監査レポートを生成する必要があります
- **オペレーションチーム**は、API コールを追跡し、設定変更を特定し、問題につながる一連のイベントを把握することで、サービス障害のトラブルシューティングを行います
- **すべてのチーム**は、CloudWatch Logs Insights のクエリ構文、JSON の解析、および時間帯やアカウントをまたいだイベントの相関付けに苦労しています

CloudTrail MCP サーバーがない場合、チームは複雑なクエリの記述、JSON ログの手動解析、またはカスタムダッシュボードの構築に頼ることになり、重要なセキュリティおよび運用ワークフローに時間、複雑さ、そして人的エラーの可能性を加えることになります。

## 仕組み

CloudTrail MCP サーバーは、自然言語の質問を CloudTrail データに対するクエリに変換し、それを実行して、コンテキストとインサイトを含む人間が読みやすい結果を返します。

**サポートされているデータソース：**

- **CloudWatch Logs**: [CloudWatch Logs Insights クエリ構文](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/CWL_QuerySyntax.html)を使用 - MCP サーバーが利用可能なロググループを自動的に検出します
- **CloudTrail Lake**: [SQL クエリ](https://docs.aws.amazon.com/awscloudtrail/latest/userguide/query-create-edit-query.html)を使用 - MCP サーバーが CloudTrail Lake の利用可能なイベントデータストアを自動的に検出します

**主な機能：**

- クエリ構文を記述する代わりに自然言語クエリを使用
- マルチアカウントのサポート
- 時系列分析とイベント相関
- セキュリティ調査、コンプライアンスレポート、および運用トラブルシューティング

## セットアップ要件

CloudTrail MCP サーバーを使用するには、以下が必要です。

**CloudWatch Logs の場合:**
- [CloudWatch Logs にイベントを送信するように設定された AWS CloudTrail](https://docs.aws.amazon.com/awscloudtrail/latest/userguide/send-cloudtrail-events-to-cloudwatch-logs.html)
- IAM 権限: `logs:StartQuery`, `logs:GetQueryResults`, `logs:DescribeLogGroups`
- MCP サーバーは利用可能な CloudTrail ロググループを自動的に検出します

**CloudTrail Lake の場合:**
- [CloudTrail Lake イベントデータストア](https://docs.aws.amazon.com/awscloudtrail/latest/userguide/query-event-data-store.html) の作成と設定
- IAM 権限: `cloudtrail:StartQuery`, `cloudtrail:GetQueryResults`, `cloudtrail:DescribeEventDataStores`, `cloudtrail:ListEventDataStores` ([CloudTrail Lake のアクセス許可](https://docs.aws.amazon.com/awscloudtrail/latest/userguide/lake-permissions.html)を参照)
- MCP サーバーは利用可能な CloudTrail Lake イベントデータストアを自動的に検出します

**両方の場合:**
- エージェントに設定された MCP サーバー
- 適切な権限を持つ AWS 認証情報

## 設定

エージェントで CloudTrail MCP サーバーを設定するには、[AWS MCP Servers ドキュメント](https://awslabs.github.io/mcp/)のセットアップ手順に従ってください。MCP サーバーは、AWS アカウント内で利用可能な CloudTrail データソース（CloudWatch Logs および CloudTrail Lake）を自動的に検出します。

**プロンプト内**で、クエリするデータソースをオプションで指定できます。

```
Using CloudWatch Logs, show me all failed login attempts in the last 24 hours.
```

```
Using CloudTrail Lake, show me all IAM policy changes in the last 90 days.
```

## 実際のタスクのサンプルプロンプト

### セキュリティ調査プロンプト

#### 1. ログイン失敗の試行を調査する

**プロンプト：**
```
Show me all failed console login attempts in the last 24 hours. 
Include the username, source IP address, and timestamp.
```

**機能の説明:** [CloudTrail イベントレコード](https://docs.aws.amazon.com/awscloudtrail/latest/userguide/cloudtrail-event-reference-record-contents.html)を分析することで、潜在的なブルートフォース攻撃や侵害された認証情報を特定します。

**ユースケース：** セキュリティチームが複数のログイン失敗に関するアラートを受信し、脅威レベルを評価する必要がある場合

---

#### 2. 権限昇格の特定

**プロンプト：**
```
Show me all IAM policy changes in the last 48 hours. 
Focus on policies that grant admin permissions or modify IAM roles.
```

**機能の説明:** 潜在的な権限昇格の試みを検出します

**ユースケース：** セキュリティチームが、アクターが昇格した権限を取得したかどうかを調査する

---

### コンプライアンスおよび監査プロンプト

#### 3. ユーザーアクティビティレポートの生成

**プロンプト：**
```
Generate a complete audit report for IAM user demo.user for the month of January 2024. 
Include all API calls, resources accessed, and any permission changes.
```

**機能の説明:** 包括的なユーザーアクティビティ監査証跡を作成します

**ユースケース：** 特定の期間のアクティビティのタイムラインを提供する必要がある場合

---

#### 4. MFA の使用状況を追跡する

**プロンプト：**
```
Show me all console logins in the last month. Which users logged in without MFA? 
How many times did each user login?
```

**機能の説明:** 組織全体で MFA コンプライアンスを検証します

**ユースケース:** セキュリティポリシーによりすべてのユーザーに MFA が必要です。非準拠のアカウントを特定します。

---

### 運用トラブルシューティングプロンプト

#### 5. サービス障害の調査

**プロンプト：**
```
Our application stopped working at 2024-01-15 14:30 UTC. Show me all API calls 
related to our production VPC (vpc-abc123) in the 30 minutes before the outage. 
What changed?
```

**機能の説明:** サービス障害を引き起こした設定変更を特定します。

**ユースケース：** 運用チームが障害の根本原因を迅速に特定する必要がある場合

---

#### 6. IAM 権限の問題をデバッグする

**プロンプト：**
```
User reports they can't create EC2 instances. Show me all EC2 RunInstances calls 
from user demo.user in the last 2 hours, including any access denied errors. 
What permissions are missing?
```

**機能の説明:** IAM 権限の問題を診断します

**ユースケース：** ユーザーが必要なタスクを実行できない場合に、不足しているアクセス許可を特定する

---

### 高度なマルチアカウントプロンプト

#### 7. クロスアカウントセキュリティレビュー

**プロンプト：**
```
Across all our AWS accounts, show me any security group rules that allow inbound 
traffic from 0.0.0.0/0 on ports other than 80 and 443. When were these rules created 
and by whom?
```

**機能の概要：** AWS 組織全体のセキュリティリスクを特定します

**ユースケース：** セキュリティチームが組織全体のセキュリティ体制レビューを実施する

**注意:** マルチアカウントクエリには [組織イベントデータストア](https://docs.aws.amazon.com/awscloudtrail/latest/userguide/cloudtrail-lake-organizations.html) を使用した CloudTrail Lake、または CloudWatch Logs に配信される組織トレイルが必要です。

---

#### 8. アカウント間のコンプライアンス

**プロンプト：**
```
For production accounts (account IDs: 111111111111, 222222222222, 333333333333), 
show me any CloudTrail configuration changes in the last year. Has logging ever 
been disabled?
```

**機能の説明:** 組織全体の監査ログコンプライアンスを検証します。

**ユースケース：** コンプライアンス監査では、継続的なロギングの証明が必要です

---

### CloudTrail と VPC Flow Logs の組み合わせ

CloudTrail と [VPC Flow ログ](https://docs.aws.amazon.com/vpc/latest/userguide/flow-logs.html) の両方が CloudWatch Logs に送信される場合、包括的なセキュリティ調査のために API アクションとネットワークトラフィックを関連付けることができます。

#### 9. 接続の問題のトラブルシューティング

**プロンプト：**
```
Application team reports connectivity issues to RDS database at 10:15 AM today. 
Check VPC Flow Logs for rejected connections to the database subnet around that time, 
then check CloudTrail for any security group, NACL, or route table changes in the 
30 minutes before the issue started.
```

**機能の説明:** 接続の問題が設定変更によるものかネットワークの問題によるものかを特定します

**ユースケース：** 運用チームがアプリケーションの障害を迅速に解決する必要がある場合

---

#### 10. ラテラルムーブメントの検出

**プロンプト：**
```
CloudTrail shows user demo.user assumed role "ProductionAdmin" at 2:30 PM. 
Check VPC Flow Logs for all network connections initiated from instances 
accessed by that role in the following hour. Are there any unusual internal 
connections or port scans?
```

**機能の説明：** 権限昇格後の潜在的なラテラルムーブメントを特定します

**ユースケース:** セキュリティチームが、侵害された認証情報を使用して追加のリソースにアクセスされたかどうかを調査する

---

## ベストプラクティス

**効果的なプロンプト：**
- 時間範囲を具体的に指定し、コンテキスト（アカウント ID、リソース名、ユーザー ID）を含める
- フォローアップの質問で結果を絞り込む
- 実行可能なインサイトをリクエストする：「何をすべきか？」または「これは正常か？」

**クエリの最適化：**
- 広い範囲から始めて、絞り込む
- リソース識別子を使用して結果を高速化する
- 関連する質問を 1 つのプロンプトにまとめる

**セキュリティ:**
- クエリ結果の機密データを保護する
- 複数のデータポイントを通じて調査結果を検証する
- MCP サーバーへのアクセスを承認されたユーザーに制限する


## まとめ

CloudTrail MCP サーバーは、CloudTrail イベント分析を、複雑なクエリを記述する技術的な作業から、エージェントとの自然な会話へと変革します。セキュリティチームはインシデントをより迅速に調査でき、コンプライアンスチームは監査レポートを簡単に生成でき、オペレーションチームは複雑なクエリ構文を習得することなく問題をトラブルシューティングできます。

最も一般的なタスク（失敗したログインの調査、IAM の変更の追跡、障害のトラブルシューティングなど）に対する基本的なプロンプトから始め、それを自分の環境に合わせて調整してください。MCP サーバーの会話形式の性質により、質問を繰り返し洗練させ、CloudTrail データを探索しながらより正確な回答を得ることができます。

詳細については、[AWS MCP Servers のドキュメント](https://awslabs.github.io/mcp/)および [Kiro 向け MCP](https://kiro.dev/docs/mcp/) を参照してください。

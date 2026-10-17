---
title: パッチおよびノード管理
sidebar_label: パッチおよびノード管理
---

# パッチおよびノード管理

## 概要

AWS Systems Manager は、EC2 インスタンス、オンプレミスサーバー、エッジデバイス、ハイブリッド環境の VM の一元化された運用管理を提供します。このソリューションは、フリート管理のエンドツーエンドのライフサイクルをカバーします：SSM Agent によるノードの登録、タグベースのポリシーを使用した大規模なパッチ適用、リモートセッションのセキュアな管理、運用タスクの自動化、AWS Organization 全体の一元化されたパッチコンプライアンスレポートの構築です。

Patch Manager、Session Manager、Run Command、Automation ランブックを CloudWatch メトリクスおよびログと組み合わせることで、フリートの正常性、パッチコンプライアンスの状態、運用コマンドの結果を単一のコントロールプレーンから可視化できます。

![AWS Systems Manager の概要](/img/cloudops/guides/centralized-operations-management/BP-SSM-1.png "AWS Systems Manager の概要")

## 前提条件

- ターゲットアカウント/リージョンで AWS Systems Manager が有効化されていること
- すべてのマネージドノードに SSM Agent がインストールされ実行中であること（多くの AWS AMI にプリインストール済み）
- `AmazonSSMManagedInstanceCore` 権限を付与する IAM インスタンスプロファイルまたはデフォルトホスト管理設定（DHMC）
- マネージドノードから Systems Manager サービスエンドポイントへのネットワーク接続（インターネットまたは `ssm`、`ssmmessages`、`ec2messages` 用の VPC エンドポイント）
- AWS Organizations が設定されていること（マルチアカウントパッチ適用用）
- リソースデータ同期用の S3 バケット（一元化レポート用）

## アーキテクチャ

以下の図は、AWS Organization 全体のエンドツーエンドのパッチ管理およびレポートアーキテクチャを示しています：

![エンドツーエンドのパッチ管理レポート](/img/cloudops/guides/centralized-operations-management/patch-management/architecture-diagram-ssm-org-reporting.png "エンドツーエンドのパッチ管理レポートアーキテクチャ")

1. Systems Manager リソースデータ同期が各アカウント/リージョンに作成されます。
2. パッチコンプライアンスとインベントリメタデータが中央 S3 バケットに集約されます。
3. AWS Glue クローラーが JSON メタデータからデータベーステーブルを作成します。
4. Amazon Athena がコンプライアンスレポートのためにデータをクエリします。
5. Amazon QuickSight が組織全体のパッチコンプライアンスを可視化します。

### タグベースのパッチ適用フロー

マネージドノードには、スケジュールをエンコードする値（例：4 番目の土曜日の午前 2 時の場合 `2SATX4`）を持つ `maintenance:patching` キーがタグ付けされます。Quick Setup のパッチポリシーは、このタグ値でノードをターゲットにし、各ノードが割り当てられたウィンドウに従ってパッチを受け取ることを保証します。

![タグベースのパッチ適用戦略](/img/cloudops/solutions/centralized-operations-management/patch-nodes-using-tags/PatchTagging.drawio.png "ノードをパッチポリシーにリンクするタグベースのパッチ適用")

### パッチポリシーの詳細アーキテクチャ

![パッチポリシーの詳細アーキテクチャ](/img/cloudops/guides/centralized-operations-management/patch-management/patch-policy-detailed-architecture.png "CloudFormation StackSets が State Manager アソシエーションをデプロイするパッチポリシーの詳細アーキテクチャ")

## デプロイ

### ステップ 1：SSM Agent でノードを登録する

すべてのノードに SSM Agent がインストールされていることを確認します。方法は以下の通りです：

- SSM Agent がプリインストールされた**ゴールデン AMI**
- 起動時の **EC2 ユーザーデータ**スクリプト：

```bash
#!/bin/bash
yum install -y amazon-ssm-agent
systemctl enable amazon-ssm-agent
systemctl start amazon-ssm-agent
```

- 組織全体の自動 IAM 権限のための**デフォルトホスト管理設定（DHMC）**
- 既存のインスタンスに IAM ポリシーをアタッチするための **Quick Setup ホスト管理**

### ステップ 2：タグ付け戦略を実装する

すべてのマネージドノードに `maintenance:patching` タグを適用します：

```yaml
Key: maintenance:patching
Value: 2SATX4    # Runs at 2 AM every 4th Saturday
```

一般的なパターン：
- `0SUN` — 毎週日曜日の深夜
- `4TUEX2` — 2 週間ごとの火曜日午前 4 時
- `22MONX3` — 3 週間ごとの月曜日午後 10 時

AWS Config ルールを使用してタグ付けコンプライアンスを適用します。

### ステップ 3：パッチポリシーを設定する

承認済みの各スケジュールに対して Quick Setup でパッチポリシーを作成します。各ポリシーは以下を行います：

1. カスタムまたは AWS マネージドのパッチベースラインを使用する
2. `maintenance:patching` タグ値でノードをターゲットにする
3. CloudFormation StackSets を介してターゲット OU およびリージョンにデプロイする
4. スキャンおよびインストール操作用の State Manager アソシエーションを作成する

### ステップ 4：一元化されたコンプライアンスレポートを設定する

中央アカウントにレポートインフラストラクチャをデプロイします：

1. リソースデータ同期ストレージ用の KMS キーを持つ S3 バケットを作成する
2. メタデータを毎日カタログ化する Glue クローラーをデプロイする
3. コンプライアンスレポート用の保存済みクエリを持つ Athena ワークグループを設定する
4. （オプション）QuickSight データセットと分析ダッシュボードをデプロイする

非準拠ノードのサンプル Athena クエリ：

```sql
SELECT
    ci.resourceid,
    ci.status,
    ci.patchstate,
    LISTAGG(DISTINCT ci.id, ', ') WITHIN GROUP (ORDER BY ci.id) AS ids
FROM
    aws_complianceitem ci
WHERE
    ci.compliancetype = 'Patch'
    AND ci.status = 'NON_COMPLIANT'
GROUP BY
    ci.resourceid, ci.status, ci.patchstate
ORDER BY ci.resourceid
LIMIT 20;
```

### ステップ 5：リモートおよびセッション管理を設定する

Session Manager は、SSH キーや開放されたインバウンドポートなしでセキュアなノードアクセスを提供します：

- 暗号化されたセッション（TLS 1.2 + オプションの KMS）
- IAM ベースのアクセス制御
- CloudWatch Logs および/または S3 へのセッションロギング
- RDS、ElastiCache などへのトンネリング用ポートフォワーディング

### ステップ 6：カスタム Windows ユーザーとして PowerShell コマンドを実行する

カスタム資格情報を必要とする操作の場合、AWS Secrets Manager からシークレットを取得します：

```powershell
# Retrieve credentials from Secrets Manager
$SecretContent = Get-SECSecretValue -SecretId <SECRET_ARN> -ErrorAction Stop |
    Select-Object -ExpandProperty 'SecretString' | ConvertFrom-Json -ErrorAction Stop

# Create credentials object
$Username = $SecretContent.username
$UserPassword = ConvertTo-SecureString ($SecretContent.password) -AsPlainText -Force
$Credentials = New-Object -TypeName 'System.Management.Automation.PSCredential' ("$Env:ComputerName\$Username", $UserPassword)

# Run command with custom credentials
$Session = New-PSSession -ComputerName $Env:ComputerName -Credential $Credentials -ErrorAction Stop
Invoke-Command -Session $Session -ScriptBlock { Write-Host "Logged in as: $env:USERNAME" }
```

### ステップ 6：Automation ランブック

反復可能な運用タスクのための Automation ランブックを作成します：

- ビジュアルデザインエクスペリエンスまたは CloudFormation/CDK を使用する
- 最小権限の IAM ポリシーを持つサービスロールを活用する
- レートコントロールと CloudWatch アラーム統合を使用して、複数のアカウントとリージョンにわたって Automation を実行する

## 検証

1. **SSM Agent のステータス**：Fleet Manager または統合コンソールで、すべてのノードが「マネージド」と表示されていることを確認します
2. **パッチコンプライアンス**：パッチスキャンを実行し、Patch Manager ダッシュボードで準拠/非準拠の数を確認します
3. **リソースデータ同期**：スキャン後に中央 S3 バケットに JSON ファイルが表示されていることを確認します
4. **Athena クエリ**：`patch-workgroup` で保存済みクエリを実行し、結果が返されることを確認します
5. **Session Manager**：マネージドノードへのセッションを開始し、コマンドが実行され、ログが CloudWatch に表示されることを確認します

## トラブルシューティング

| 症状 | 考えられる原因 | 修正方法 |
|---------|-------------|-----|
| ノードがマネージドとして表示されない | IAM 権限がないか SSM Agent が実行されていない | インスタンスプロファイルに `AmazonSSMManagedInstanceCore` が含まれていることを確認する。`systemctl status amazon-ssm-agent` を確認する |
| パッチスキャンでコンプライアンスデータが表示されない | リソースデータ同期が設定されていないか Glue クローラーが実行されていない | アカウント/リージョンにリソースデータ同期を作成する。Glue クローラーを手動で実行する |
| Session Manager の接続が失敗する | SSM エンドポイントへのネットワーク接続がブロックされている | `ssm.<region>.amazonaws.com` エンドポイントへのアウトバウンド 443 を確認するか、VPC エンドポイントを設定する |
| ターゲットアカウントで Automation が失敗する | `AWS-SystemsManager-AutomationExecutionRole` がない | CloudFormation StackSets を介してすべてのターゲットアカウントに実行ロールをデプロイする |
| Run Command が終了コード 1 を返す | スクリプトエラーまたは OS レベルの権限不足 | Run Command 履歴でコマンド出力を確認する。マネージドノードの OS ログを確認する |

## 関連ソリューション

- [ジャストインタイムノードアクセス](../just-in-time-node-access/) — Cedar ポリシーによる承認ベースの一時的なノードアクセス
- [AWS Config コンプライアンスモニタリング](../aws-config-compliance/) — 設定コンプライアンスモニタリングとドリフト検出
- [EC2 NGINX モニタリング](../ec2-nginx/) — EC2 ワークロードの CloudWatch Agent モニタリング
---
sidebar_position: 2
title: CloudWatch Unified Data Store を使用したセキュリティ可視性ダッシュボード
---
# CloudWatch Unified Data Store を使用したセキュリティ可視性ダッシュボード

Amazon CloudWatch [統合データストア](https://aws.amazon.com/blogs/aws/amazon-cloudwatch-introduces-unified-data-management-and-analytics-for-operations-security-and-compliance/) は、個々のロググループ名を知らなくても、AWS サービス全体のログデータを検出、整理、クエリするための一元的な方法を提供します。これを実現するために、CloudWatch 統合データストアは[ファセット](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/CloudWatchLogs-Facets.html) を使用します。ファセットとは、CloudWatch がインタラクティブなフィルタリング、グループ化、分析のために表示するログデータのフィールドです。デフォルトのファセット（例えば `@data_source_name`, `@data_source_type`、および `@data_format` は、設定不要ですべての Standard ログクラスのロググループで自動的に利用可能です。[CloudWatch Logs Insights](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/AnalyzingLogData.html) コンソールでは、ファセット値を選択してデータを視覚的に探索したり、クエリ内で参照して検索範囲を一致するロググループとイベントのみに効率的に絞り込んだりすることができます。

これらのファセットを通じて、CloudWatch はログをその発生元の[データソース](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/supported-aws-services-data-sources.html)（AWS CloudTrail や Amazon VPC Flow Logs など）によって自動的に分類するため、ロググループ全体にわたるすべての CloudTrail または VPC Flow Log のログデータをクエリできます。 `@data_source_name` ファセットは、ロググループの数や名前に関係なく適用されます。

[CloudWatch クロスアカウントクロスリージョンログ集約](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/CloudWatchLogs_Centralization.html)を使用することで、その基盤の上にセキュリティ分析を構築できます。このガイドでは、AWS CloudFormation を通じてサンプルのビルド済み[CloudWatch ダッシュボード](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch_Dashboards.html)をデプロイする手順を説明します。このダッシュボードは CloudWatch データソースを活用して、CloudTrail および VPC Flow Logs のアクティビティをほぼリアルタイムで可視化します。また、各ウィジェットが提供する情報と、セキュリティモニタリング、インシデント調査、コンプライアンスの可視化にダッシュボードを活用する方法についても説明します。

## このダッシュボードが重要な理由

セキュリティチームは、AWS アカウント全体の API アクティビティとネットワークトラフィックに対して、一元化されたほぼリアルタイムの可視性を必要としています。一元化されたダッシュボードがなければ、チームは複数のロググループにわたってクエリを手動で実行し、CloudTrail と VPC Flow Logs 間のデータを相関させ、分散したソースからセキュリティコンテキストを組み合わせなければなりません。

このダッシュボードは、いくつかの重要な課題に対応しています。

- **ロググループ名への依存なし**: [`SOURCE logGroups() | filterIndex @data_source_name`](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/CWL_QuerySyntax-FilterIndex.html) を使用して、アカウント内のロググループの名前に関係なく、CloudWatch Unified Data Store のデフォルトファセットを通じて CloudTrail と VPC Flow Logs を動的に検出します。
- **デュアルフォーマットのサポート**: ログフォーマットの設定に基づいて、Standard（ネイティブ AWS フィールド名）または OCSF（Open Cybersecurity Schema Framework）バージョンのダッシュボードをデプロイします。
- **クロスサービスの相関**: CloudTrail API アクティビティと VPC Flow Log ネットワークデータを並べて表示し、セキュリティイベントを視覚的に関連付けます。
- **アカウント間での移植性**: 同じ CloudFormation テンプレートが、CloudTrail と VPC Flow Logs を CloudWatch Logs に送信しているすべてのアカウントで動作し、ロググループ名のパラメータ変更は不要です。

## 前提条件

デプロイする前に、アカウントに必要なデータソースが利用可能であることを確認してください。

```bash
aws logs list-aggregate-log-group-summaries --group-by DATA_SOURCE_NAME_AND_TYPE
```

出力に `aws_cloudtrail` および `amazon_vpc` のエントリが表示されるはずです。これらが欠けている場合は、以下を確認してください。

1. **[CloudTrail](https://aws.amazon.com/about-aws/whats-new/2025/12/key-enhancements-cloudtrail-events-cloudwatch/)** は、CloudWatch Logs にログを配信するように設定されています。
2. **[VPC Flow Logs](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/telemetry-config-rules.html)** は、少なくとも 1 つの VPC に対して CloudWatch Logs に配信するように設定されています。

## ダッシュボードのデプロイ

1. **[CloudWatch_Dashboard_CloudTrail_VPC.yaml](https://raw.githubusercontent.com/aws-samples/aws-management-and-governance-samples/refs/heads/master/AWSCloudTrail/cloudwatch-dashboards/CloudWatch_Dashboard_CloudTrail_VPC.yaml)** テンプレートをダウンロードします。
1. **CloudFormation** → **スタックの作成** → **新しいリソースを使用** に移動します。
1. `CloudWatch_Dashboard_CloudTrail_VPC.yaml` テンプレートをアップロードします。
1. パラメータを設定します。
   - **DashboardName**: ダッシュボードの名前（デフォルト： `CloudTrail-VPC-Dashboard`)。
   - **LogFormat**: ネイティブの AWS CloudTrail/VPC Flow Log フィールド名の場合は `Standard` を、Open Cybersecurity Schema Framework の正規化フィールドの場合は `OCSF` を選択します。
1. スタックを確認して作成します。

### CloudFormation パラメータ

| パラメータ | デフォルト | 説明 |
|------------------------------------|----------------------------|--------------------------------------------------------------------------------------------------|
| `DashboardName`                    | `CloudTrail-VPC-Dashboard`    | CloudWatch ダッシュボードの名前                                                                |
| `LogFormat`                        | `Standard`                 | `Standard`（ネイティブ AWS フィールド）または `OCSF`（正規化スキーマ）                          |

## クエリの仕組み

このダッシュボードのすべての [CloudWatch Logs Insights](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/CWL_QuerySyntax.html) クエリは、同じパターンを使用しています。

```
SOURCE logGroups() | filterIndex @data_source_name in ["aws_cloudtrail"]
| <your query logic here>
```

- [`SOURCE logGroups()`](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/CWL_QuerySyntax-Source.html) は、CloudWatch にアカウント内のすべてのロググループを検索するよう指示します。
- [`filterIndex @data_source_name in [...]`](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/CWL_QuerySyntax-FilterIndex.html) は以下を使用します `@data_source_name` デフォルトのファセットを使用して、指定したデータソースを含むロググループのみに検索を絞り込みます。CloudWatch は、すべての Standard ログクラスのロググループに対して、このファセットをデフォルトのファセットとして自動的に提供します。カスタム設定は不要です。
- CloudTrail クエリの場合、データソース名は `aws_cloudtrail` です。
- VPC Flow Log クエリの場合、データソース名は `amazon_vpc` です。

このアプローチにより、実際のロググループ名を知ったり設定したりする必要が一切なくなります。CloudTrail のロググループ名が `aws-cloudtrail-logs`、`aws/cloudtrail/managementevents`、または任意のカスタム名のいずれであっても、ダッシュボードは同じように動作します。

## セキュリティのベストプラクティス

### IAM によるダッシュボードアクセスの制限

セキュリティデータを表示する CloudWatch ダッシュボードには、ベストプラクティスとして最小権限のアクセスコントロールを適用してください。

以下は、ダッシュボードへの読み取り専用アクセスを許可し、変更を拒否する IAM ポリシーの例です。表示専用アクセスを持つべき IAM ロールまたはグループにアタッチしてください。

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "AllowDashboardReadOnly",
      "Effect": "Allow",
      "Action": [
        "cloudwatch:GetDashboard",
        "cloudwatch:ListDashboards"
      ],
      "Resource": "arn:aws:cloudwatch::ACCOUNT_ID:dashboard/CloudTrail-VPC-Dashboard"
    },
    {
      "Sid": "DenyDashboardModification",
      "Effect": "Deny",
      "Action": [
        "cloudwatch:PutDashboard",
        "cloudwatch:DeleteDashboards"
      ],
      "Resource": "arn:aws:cloudwatch::ACCOUNT_ID:dashboard/CloudTrail-VPC-Dashboard"
    }
  ]
}
```

`ACCOUNT_ID` を AWS アカウント ID に置き換え、カスタマイズした場合は `CloudTrail-VPC-Dashboard` を実際のダッシュボード名に置き換えてください。

ダッシュボードを管理する必要があるセキュリティオペレーションチームには、読み取りと書き込みの両方を許可する個別のポリシーを使用します。

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "AllowDashboardFullAccess",
      "Effect": "Allow",
      "Action": [
        "cloudwatch:GetDashboard",
        "cloudwatch:ListDashboards",
        "cloudwatch:PutDashboard",
        "cloudwatch:DeleteDashboards"
      ],
      "Resource": "arn:aws:cloudwatch::ACCOUNT_ID:dashboard/CloudTrail-VPC-Dashboard"
    }
  ]
}
```

ダッシュボードのクエリには、関連するロググループに対する `logs:StartQuery`、`logs:GetQueryResults`、および `logs:FilterLogEvents` の権限も必要です。IAM ロールがこれらの権限を CloudTrail および VPC Flow Log のロググループにスコープして付与されていることを確認してください。

### CloudWatch Alarms でダッシュボードを補完する

ダッシュボードは現在の状況を表示しますが、問題が発生した際に通知することはありません。重要なセキュリティイベントのアラートを受け取るには、[CloudWatch Logs メトリクスフィルター](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/MonitoringLogData.html)を基盤とした[CloudWatch Alarms](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/AlarmThatSendsEmail.html)を設定してください。検討する価値のあるものをいくつか紹介します。

| イベント | メトリクスフィルターパターン |
|---|---|
| ルートアカウントの使用 | `{ $.userIdentity.type = "Root" && $.userIdentity.invokedBy NOT EXISTS && $.eventType != "AwsServiceEvent" }` | 
| 権限昇格 | `{ ($.eventName = "AttachRolePolicy") \|\| ($.eventName = "PutRolePolicy") \|\| ($.eventName = "CreateAccessKey") \|\| ($.eventName = "CreateLoginProfile") }` | 
| コンソールログインの失敗 | `{ ($.eventName = "ConsoleLogin") && ($.errorMessage = "Failed authentication") }` | 

ローリングウィンドウ内の REJECT カウントに対して[CloudWatch Logs Insights クエリベースのアラーム](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Create_Metrics_Insights_Alarm.html)を使用します。 | ポートスキャンやアクティブなネットワーク攻撃を検出します。 |

[SNS トピック](https://docs.aws.amazon.com/sns/latest/dg/welcome.html)にアラームアクションをルーティングして、メール、Slack、またはインシデント管理プラットフォームを通じてセキュリティオペレーションチームに通知します。

### ログ グループの暗号化と保持期間

CloudWatch Logs は、デフォルトで AWS マネージドキーを使用してすべてのログデータを保存時に暗号化します。設定は不要です。ただし、組織がコンプライアンス上の理由でカスタマーマネージド暗号化キーを必要とする場合は、[KMS キーを各ロググループに関連付ける](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/encrypt-log-data-kms.html)ことができます。これにより、CloudTrail を通じてキーのローテーション、アクセスポリシー、および監査証跡を完全に制御できます。

このテンプレートはダッシュボードのみを作成します。基盤となるロググループの作成や管理は行わないため、それらに対して暗号化や保持設定を強制することはできません。ダッシュボード用の CloudTrail および VPC Flow Log のロググループに適切な設定が適用されていることを確認してください。

- **KMS 暗号化**: 必要な場合は、`aws logs associate-kms-key` を使用するか、ロググループの作成時に CloudFormation を使用して、ロググループに KMS キーを関連付けます。
- **保持ポリシー**: デフォルトでは、CloudWatch Logs はログデータを無期限に保持します。コンプライアンス要件とコストのバランスを取る[保持ポリシー](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/Working-with-log-groups-and-streams.html#SettingLogRetention)を設定してください。

### 追加の推奨事項

- **デプロイ後に CloudFormation スタックの削除保護を有効にして**、誤った削除を防ぎます。
- **AWS Organizations の[サービスコントロールポリシー (SCPs)](https://docs.aws.amazon.com/organizations/latest/userguide/orgs_manage_policies_scps.html)を使用して**、`cloudwatch:PutDashboard` および `cloudwatch:DeleteDashboards` をすべてのアカウントにわたる特定の管理者ロールに制限します。
- **CloudWatch API 呼び出しに対して CloudTrail ログを有効にする**ことで、ダッシュボードの変更が CloudTrail の `PutDashboard` イベントを通じて監査可能になります。

## ダッシュボードセクションとウィジェットリファレンス

ダッシュボードは 6 つのセクションで構成されています。以下は標準フォーマットバージョンです。OCSF バージョンには、OCSF フィールド名を使用した同等のウィジェットがあります (`api.operation`, `src_endpoint.ip`, `actor.user.name`、など）。

---

### セクション 1: セキュリティの概要

このセクションでは、AWS 環境全体のセキュリティ体制を一目で確認できるビューを提供します。

| ウィジェット | タイプ | データソース | 表示内容 | 重要な理由 |
|--------------------------------------------------------------|---------------------------|-------------------|------------------------------------------------------------------------------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| 📈 時間経過に伴うエラー率の傾向                                | Time series               | CloudTrail        | 時間経過に伴う API エラー数を 5 分単位のビンで集計します。                                                             | エラーの急増は、ブルートフォース攻撃、誤設定された自動化、または侵害された認証情報を示している可能性があります。何か異常が起きている最初の指標として活用してください。           |
| 🚨 トップエラーコード (Unauthorized / Access Denied)            | Table                     | CloudTrail        | 最も頻繁に発生するアクセス拒否および不正アクセスのエラーコードを、エラーコード、API イベント名、アカウント、リージョン別に分類して表示します。 | どの特定の API 呼び出しがどのアカウントで拒否されているかを特定します。ここで見られるパターンは、クレデンシャルスタッフィング、権限の誤設定、またはラテラルムーブメントの試みを明らかにする可能性があります。            |
| 🥧 ユーザー ID タイプ                                       | Pie chart                 | CloudTrail        | ID タイプ別（IAMUser、AssumedRole、Root、FederatedUser、AWSService など）の API 呼び出しの分布です。              | 健全な環境では、ほとんどが AssumedRole と AWSService の呼び出しになるはずです。Root や IAMUser のアクティビティが目立つ場合は、調査が必要な可能性があります。                                                      |
| 🥧 VPC フローアクション                                          | Pie chart                 | VPC Flow Logs     | すべての VPC フローログレコードにおける ACCEPT と REJECT アクションの比率です。                                                     | REJECT の比率が高い場合、ポートスキャン、セキュリティグループの誤設定、またはネットワーク境界に対するアクティブな攻撃の試みを示している可能性があります。                                                        |
| 🔐 ルートアカウントのアクティビティ                                     | Table                     | CloudTrail        | ルートアカウントを使用して行われた最近の API 呼び出し（イベント名、ソース IP、アカウント、リージョンを含む）です。                    | ルートアカウントの使用はまれであり、十分に正当な理由があるべきです。予期しないルートアクティビティは、直ちに調査すべき優先度の高いセキュリティイベントです。                                    |

---

### セクション 2: 相関セキュリティインサイト — CloudTrail + VPC Flow Logs

このセクションでは、視覚的な相関関係を確認できるよう、API レイヤーとネットワークレイヤーのセキュリティデータを並べて表示します。

| ウィジェット | タイプ | データソース | 表示内容 | 重要な理由 |
|--------------------------------------------------------------|---------------------------|-------------------|------------------------------------------------------------------------------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| ⚠️ 疑わしい IP: API エラー                                | Table                     | CloudTrail        | 最も多くの API エラーを生成している外部（RFC1918 以外）の IP アドレスを、アカウントとリージョン別にグループ化して表示します。                     | エラー数の多い外部 IP は、不正アクセスを試みている可能性が高いです。これらをネットワークの REJECT ウィジェットと相互参照し、同じ IP がネットワーク層でもブロックされているかどうかを確認してください。 |
| ⚠️ ネットワーク REJECT のある IP                                   | Table                     | VPC Flow Logs     | 最も多くの REJECT アクションを持つ外部 IP アドレスを、宛先ポート別に分類して表示します。                                   | どの外部 IP がセキュリティグループや NACL によってブロックされているかを示します。同じ IP がこのウィジェットと API エラーウィジェットの両方に現れる場合、悪意のあるアクティビティである可能性が強く示唆されます。         |
| 🔗 相互参照: CloudTrail ログ内の外部 IP                 | Table (full width)        | CloudTrail        | API 呼び出しを行っているすべての外部 IP を、IP・アカウント・リージョンごとの API 呼び出し総数とエラー数とともに表示します。              | 外部 IP アクティビティの包括的なビューを提供します。API 呼び出し数が多くエラー数が少ない IP は正当なサービスの可能性があります。エラー比率が高い IP は調査が必要です。               |
| 📈 API アクティビティタイムライン                                     | Time series               | CloudTrail        | 時間経過に伴う API 呼び出しの総量を 10 分単位のビンで表示します。                                                                     | 通常の API アクティビティのベースラインを確立します。ベースラインからの逸脱は、自動化された攻撃、サービスの中断、またはスクリプトを実行する侵害された認証情報を示している可能性があります。                     |
| 📈 ネットワークトラフィックタイムライン                                  | Time series (stacked)     | VPC Flow Logs     | 時間経過に伴うネットワークフロー数を、ACCEPT/REJECT アクション別に積み上げて表示します。                                                        | ネットワークトラフィックのパターンと、時間経過に伴うブロックされたトラフィックの割合を可視化します。REJECT の増加傾向は、進行中の攻撃を示している可能性があります。                                                     |

---

### セクション 3: ネットワークセキュリティ — ネットワークアクティビティ分析

VPC Flow Log データを詳しく分析して、ネットワーク層のセキュリティ可視性を確保します。

| ウィジェット | タイプ | データソース | 表示内容 | 重要な理由 |
|--------------------------------------------------------------|---------------------------|-------------------|------------------------------------------------------------------------------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| 🚫 トップのブロックされたネットワーク接続                           | Table                     | VPC Flow Logs     | 最も多くの REJECT アクションと総転送バイト数を持つ送信元/宛先 IP のペアを表示します。                                   | 最も持続的にブロックされている接続試行を特定します。単一の送信元 IP からの大量のブロックされた接続は、標的型攻撃または誤設定されたアプリケーションを示している可能性があります。                 |
| 📊 トップの宛先ポート                                     | Bar chart                 | VPC Flow Logs     | すべてのフローログレコードにおいて最も頻繁に標的とされる宛先ポートを表示します。                                                | 443（HTTPS）や 80（HTTP）などの一般的なポートは想定内です。異常なポート（例: 22、3389、445）が大量のトラフィックを受けている場合、スキャンや悪用の試みを示している可能性があります。                            |
| 📉 時間経過に伴うネットワークトラフィックのバイト数                           | Time series (stacked)     | VPC Flow Logs     | 時間経過に伴う総転送バイト数を、ACCEPT/REJECT 別に積み上げて表示します。                                                           | データ転送量の傾向を追跡します。受け入れられたバイト数の急増はデータ漏洩を示す可能性があり、拒否されたバイト数の増加は悪意のあるトラフィックが積極的にブロックされていることを示唆します。               |
| 🔍 トップの外部送信元 IP                                   | Table                     | VPC Flow Logs     | 最も多くの接続数と総バイト数を持つ外部 IP を、アクション（ACCEPT/REJECT）別にグループ化して表示します。                             | VPC と通信している最もアクティブな外部 IP を特定します。正当なパートナー、CDN、または潜在的な脅威アクターの識別に役立ちます。                                              |

---

### セクション 4: ID とアクセス管理

CloudTrail からの IAM アクティビティと認証イベントに焦点を当てています。

| ウィジェット | タイプ | データソース | 表示内容 | 重要な理由 |
|--------------------------------------------------------------|---------------------------|-------------------|------------------------------------------------------------------------------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| 🔑 IAM 権限昇格の指標                       | Table                     | CloudTrail        | 高リスクの IAM API 呼び出し（CreateUser、AttachUserPolicy、AttachRolePolicy、PutUserPolicy、PutRolePolicy、CreateAccessKey、CreateLoginProfile）を、イベント名、ユーザー ARN、アカウント、リージョン別にグループ化して表示します。 | これらの API 呼び出しは昇格された権限を付与する可能性があります。予期しない発生は、攻撃者が初期侵害後に永続性を確立したり権限を昇格させたりしていることを示している可能性があります。                      |
| 📊 トップ API 呼び出し                                             | Bar chart                 | CloudTrail        | すべての CloudTrail イベントにわたって最も頻繁に呼び出される 10 個の API です。                                                       | 「通常の」API アクティビティがどのようなものかを把握できます。上位 10 に異常な API が現れる場合、新しい自動化、誤設定、または悪意のあるアクティビティを示している可能性があります。                                    |
| 🛡️ 認証イベント                                    | Table                     | CloudTrail        | AWS マネジメントコンソールへのログイン試行を、成功/失敗（errorCode）、ユーザー ARN、アカウント、リージョン別にグループ化して表示します。                     | コンソールへのログイン失敗は、クレデンシャルスタッフィングやブルートフォース攻撃を示している可能性があります。予期しないユーザーやリージョンからのログイン成功は調査すべきです。                                        |
| 📈 時間経過に伴う認証試行                         | Time series (stacked)     | CloudTrail        | 時間経過に伴うコンソールログイン試行を 30 分単位のビンで、成功/失敗別に積み上げて表示します。                                        | 認証パターンを可視化します。ログイン失敗が続いた後に成功した場合、アカウントが侵害されている可能性があります。                                                                          |

---

### セクション 5: アクティビティの分布と分析

運用およびセキュリティの認識のための API アクティビティパターンの広範な分析。

| ウィジェット | タイプ | データソース | 表示内容 | 重要な理由 |
|--------------------------------------------------------------|---------------------------|-------------------|------------------------------------------------------------------------------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| 🌐 アクティビティ量別のトップ送信元 IP                         | Table                     | CloudTrail        | 最も多くの API アクティビティを生成している外部 IP を、アカウントとリージョン別にグループ化して表示します。                                          | 最もアクティブな外部呼び出し元を特定します。アクティビティ量の多い予期しない IP は、外部インフラストラクチャから使用されている侵害された認証情報を示している可能性があります。                             |
| 🥧 イベントタイプ別のイベント                                      | Pie chart                 | CloudTrail        | CloudTrail イベントタイプ（AwsApiCall、AwsConsoleSignIn、AwsServiceEvent など）の分布です。                          | アクティビティの性質に関するコンテキストを提供します。AwsConsoleSignIn イベントの急増や新しいイベントタイプの出現は、注意が必要な可能性があります。                                                   |
| 📈 イベントソース別のアクティビティ傾向                            | Time series (stacked)     | CloudTrail        | 時間経過に伴う API 呼び出し量を、AWS サービス（eventSource）別に分類して表示します。                                                   | どのサービスが最もアクティブで、アクティビティパターンが時間とともにどのように変化するかを示します。突然非常にアクティブになったサービスは、自動化されたアクションやインシデントを示している可能性があります。                      |
| 🌍 リージョン別のイベント                                          | Pie chart                 | CloudTrail        | AWS リージョン全体にわたる API 呼び出しの分布です。                                                                          | 予期しないリージョンでのアクティビティは、通常リソースを持たないリージョンから攻撃者が操作していることを示している可能性があります。これは一般的な侵害の指標です。                               |
| 🥧 トップサービス                                              | Pie chart                 | CloudTrail        | イベント数別に最も多く呼び出された AWS サービスです。                                                                           | サービス使用状況のベースラインを確立します。新しいサービスの出現や異常な比率は、不正なリソース作成を示している可能性があります。                                                              |
| 📊 読み取りと書き込みの API 呼び出し                                   | Bar chart                 | CloudTrail        | 読み取り専用と変更（書き込み）の API 呼び出しの比率です。                                                                      | 健全な環境では通常、書き込み呼び出しよりも読み取り呼び出しの方が多くなります。書き込み呼び出しの急増は、リソースの一括作成、変更、または削除を示している可能性があり、悪意のあるものである場合があります。    |

---

### セクション 6: 詳細なセキュリティイベントのタイムライン

| ウィジェット | タイプ | データソース | 表示内容 | 重要な理由 |
|--------------------------------------------------------------|---------------------------|-------------------|------------------------------------------------------------------------------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| 🔐 セキュリティイベントタイムライン — エラーとアクセス拒否         | Table (full width)        | CloudTrail        | 最新の 100 件の API エラーを、完全なコンテキスト（タイムスタンプ、イベント名、エラーコード、エラーメッセージ、ユーザー ARN、ソース IP、アカウント、リージョン）とともに表示します。 | これは調査の出発点です。アラートが発生したり、上記のウィジェットで異常に気づいたりした場合は、ここで完全なコンテキストを持つ生のイベントを確認し、インシデント対応に役立ててください。            |

---
![CloudTrail Dashboard](/img/cloudops/solutions/cloudtrail-dashboards/example-dashboard-01.png)

![CloudTrail Dashboard](/img/cloudops/solutions/cloudtrail-dashboards/example-dashboard-02.png)

## クリーンアップ

ダッシュボードおよびすべての関連リソースを削除するには、次の手順を実行します。

```bash
aws cloudformation delete-stack --stack-name CloudTrail-VPC-Dashboard
```

:::note
**CloudTrail-VPC-Dashboard** を、Deploy セクションで使用した CloudFormation スタックの名前に置き換えてください。
:::

## まとめ

この CloudWatch ダッシュボードは、CloudWatch Unified Data Store データソースを使用して、CloudTrail API アクティビティと VPC Flow Log ネットワークデータにわたる一元化されたほぼリアルタイムのセキュリティ可視性を提供します。`@data_source_name` デフォルトファセットを活用することで、ダッシュボードはロググループ名の設定を必要とせずに適切なロググループを自動的に検出するため、任意の AWS アカウント間で移植可能になります。CloudFormation を使用して数分でデプロイし、脅威の検出、インシデントの調査、コンプライアンスモニタリングのためのセキュリティの可視性を即座に確保できます。

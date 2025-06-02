# Amazon Managed Prometheus クロスアカウントスクレイピング

Amazon Managed Service for Prometheus は、Prometheus 互換のメトリクスを自動的に検出して収集する、完全マネージド型でエージェントレスのスクレイパー（コレクター）を提供します。
エージェントやスクレイパーの管理、インストール、パッチ適用、保守は必要ありません。
Amazon Managed Service for Prometheus コレクターは、Amazon EKS クラスターのメトリクスを信頼性が高く、安定した、高可用性で、自動的にスケールする収集機能を提供します。
Amazon Managed Service for Prometheus のマネージドコレクターは、EC2 と Fargate を含む Amazon EKS クラスターと連携します。

Amazon Managed Service for Prometheus コレクターは、スクレイパーの作成時に指定されたサブネットごとに Elastic Network Interface (ENI) を作成します。
コレクターはこれらの ENI を通じてメトリクスをスクレイプし、VPC エンドポイントを使用して remote_write で Amazon Managed Service for Prometheus ワークスペースにデータをプッシュします。
スクレイプされたデータがパブリックインターネットを経由することはありません。

メトリクスを収集したい Amazon EKS クラスターが存在するアカウント（ソースアカウント）と、Amazon Managed Service for Prometheus ワークスペースが存在するアカウント（ターゲットアカウント）が異なるクロスアカウント設定でスクレイパーを作成する場合は、以下の手順を使用してください。



## アーキテクチャの概要

![AMP Managed Collector Cross Account Scraping](./images/ampxa-arch.png)
*図 1: AMP Managed Collector クロスアカウントスクレイピング、コレクターインフラストラクチャは AWS によって完全に管理されています*

このアーキテクチャでは、EKS ワークロードが存在するアカウントでスクレイパーを作成します。スクレイパーは、ターゲットアカウントのロールを引き受けて、ターゲットアカウントの AMP ワークスペースにデータをプッシュできます。

1. ソースアカウントで、STS::AssumeRole 権限を持つロール arn:aws:iam::account_id_source:role/Source を作成し、以下の信頼ポリシーを追加します。

```
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "",
            "Effect": "Allow",
            "Principal": {
                "Service": "scraper.aps.amazonaws.com"
            },
            "Action": "sts:AssumeRole",
            "Condition": {
                "ArnEquals": {
                    "aws:SourceArn": "$SCRAPER_ARN"
                },
                "StringEquals": {
                    "AWS:SourceAccount": "$ACCOUNT_ID"
                }
            }
        }
    ]
}
```

また、ロール引き受け権限のポリシーも必要です：

```
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "VisualEditor0",
            "Effect": "Allow",
            "Action": "sts:AssumeRole",
            "Resource": "$TARGET_ACCOUNT_ROLE_ARN"
        }
    ]
}
```

:::warning

スクレイパーを実際に作成する前に IAM 構成を作成する必要があります。したがって、この時点では $SCRAPER_ARN はプレースホルダーフィールドです。スクレイパーを作成した後に、これを更新します。また、$TARGET_ACCOUNT_ROLE_ARN はステップ 2 が完了するまで存在しません。

:::

2. ソース（Amazon EKS クラスター）とターゲット（Amazon Managed Service for Prometheus ワークスペース）の各組み合わせに対して、ターゲットアカウントに arn:aws:iam::account_id_target:role/Target のロールを作成し、AmazonPrometheusRemoteWriteAccess の管理ポリシーと共に以下の信頼ポリシーを追加する必要があります。

```
{
  "Effect": "Allow",
  "Principal": {
     "AWS": "arn:aws:iam::account_id_source:role/Source"
  },
  "Action": "sts:AssumeRole",
  "Condition": {
     "StringEquals": {
        "sts:ExternalId": "$SCRAPER_ARN"
      }
  }
}
```

:::warning

$SCRAPER_ARN は依然としてプレースホルダーです。スクレイパーを作成した後に値を更新します。

:::

3. ソースアカウント（EKS クラスターが存在するアカウント）で、--role-configuration オプションを使用してスクレイパーを作成します。

```
aws amp create-scraper \
  --source eksConfiguration="{clusterArn='arn:aws:eks:us-west-2:$SOURCE_ACCOUNT_ID:cluster/$CLUSTER_NAME',subnetIds=[$EKS_SUBNET_IDS]}" \
  --scrape-configuration configurationBlob=<base64-encoded-blob> \
  --destination ampConfiguration="{workspaceArn='arn:aws:aps:us-west-2:$TARGET_ACCOUNT_ID:workspace/$TARGET_AMP_WORKSPACE_ID'}"\
  --role-configuration '{"sourceRoleArn":"arn:aws:iam::$SOURCE_ACCOUNT_ID:role/Source", "targetRoleArn":"arn:aws:iam::$TARGET_ACCOUNT_ID:role/Target"}'
```

:::warning

$VARIABLES に特定の値を必ず入力してください。

:::

4. スクレイパーの作成を確認し（約 20 分かかる場合があります）、スクレイパー ARN をメモしてください。

```
aws amp list-scrapers
{
    "scrapers": [
        {
            "scraperId": "scraper-id",
            "arn": "arn:aws:aps:us-west-2:account_id_source:scraper/scraper-id",
            "roleArn": "arn:aws:iam::account_id_source:role/aws-service-role/scraper.aps.amazonaws.com/AWSServiceRoleForAmazonPrometheusScraperInternal_cc319052-41a3-4",
            "status": {
                "statusCode": "ACTIVE"
            },
            "createdAt": "2024-10-29T16:37:58.789000+00:00",
            "lastModifiedAt": "2024-10-29T16:55:17.085000+00:00",
            "tags": {},
            "source": {
                "eksConfiguration": {
                    "clusterArn": "arn:aws:eks:us-west-2:account_id_source:cluster/xarw",
                    "securityGroupIds": [
                        "sg-security-group-id",
                        "sg-security-group-id"
                    ],
                    "subnetIds": [
                        "subnet-subnet_id"
                    ]
                }
            },
            "destination": {
                "ampConfiguration": {
                    "workspaceArn": "arn:aws:aps:us-west-2:account_id_target:workspace/ws-workspace-id"
                }
            }
        }
```

5. ステップ 1 と 2 で作成した信頼ポリシーを、ステップ 4 のコマンドで得られたスクレイパー ARN の値で更新します。

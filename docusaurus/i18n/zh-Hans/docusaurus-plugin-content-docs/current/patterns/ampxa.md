# Amazon Managed Prometheus 跨账户抓取

Amazon Managed Service for Prometheus 提供完全托管的无代理抓取器（或收集器），可自动发现和拉取兼容 Prometheus 的 metrics。您无需管理、安装、修补或维护代理或抓取器。Amazon Managed Service for Prometheus 收集器为您的 Amazon EKS 集群提供可靠、稳定、高可用且自动扩展的 metrics 收集。Amazon Managed Service for Prometheus 托管收集器可与 Amazon EKS 集群配合使用，包括 EC2 和 Fargate。

Amazon Managed Service for Prometheus 收集器在创建抓取器时为每个指定的子网创建一个弹性网络接口（ENI）。收集器通过这些 ENI 抓取 metrics，并使用 remote_write 通过 VPC endpoint 将数据推送到您的 Amazon Managed Service for Prometheus 工作区。抓取的数据永远不会通过公共互联网传输。

要在跨账户设置中创建抓取器（当您要从中收集 metrics 的 Amazon EKS 集群位于与 Amazon Managed Service for Prometheus 工作区不同的账户（源账户）中时（目标账户）），请使用以下步骤。

## 高级架构

![AMP Managed Collector Cross Account Scraping](./images/ampxa-arch.png)
*图 1：AMP 托管收集器跨账户抓取，收集器基础设施完全由 AWS 管理*

在此架构中，我们在 EKS 工作负载所在的账户中创建抓取器。抓取器可以承担目标账户中的角色，以便将数据推送到目标账户中的 AMP 工作区。

1. 在源账户中，创建具有 STS::AssumeRole 权限的角色 arn:aws:iam::account_id_source:role/Source 并添加以下信任策略。

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

您还需要一个承担角色的权限策略：

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

我们必须在实际创建抓取器之前创建 IAM 构造。因此，此时 $SCRAPER_ARN 只是一个占位符字段。创建抓取器后，我们将返回并更新它。$TARGET_ACCOUNT_ROLE_ARN 在完成步骤 2 之前也不存在。

:::

2. 对于每个源（Amazon EKS 集群）和目标（Amazon Managed Service for Prometheus 工作区）的组合，您需要在目标账户中创建一个角色 arn:aws:iam::account_id_target:role/Target，并添加以下信任策略以及 AmazonPrometheusRemoteWriteAccess 的托管权限策略。

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

$SCRAPER_ARN 仍然只是一个占位符。我们将在创建抓取器后更新该值。

:::

3. 在源账户（EKS 集群所在的账户）中使用 --role-configuration 选项创建抓取器。

```
aws amp create-scraper \
  --source eksConfiguration="{clusterArn='arn:aws:eks:us-west-2:$SOURCE_ACCOUNT_ID:cluster/$CLUSTER_NAME',subnetIds=[$EKS_SUBNET_IDS]}" \
  --scrape-configuration configurationBlob=<base64-encoded-blob> \
  --destination ampConfiguration="{workspaceArn='arn:aws:aps:us-west-2:$TARGET_ACCOUNT_ID:workspace/$TARGET_AMP_WORKSPACE_ID'}"\
  --role-configuration '{"sourceRoleArn":"arn:aws:iam::$SOURCE_ACCOUNT_ID:role/Source", "targetRoleArn":"arn:aws:iam::$TARGET_ACCOUNT_ID:role/Target"}'
```
:::warning

确保将 $VARIABLES 替换为您的特定值。

:::

4. 验证抓取器创建（这可能需要约 20 分钟）并记下抓取器 ARN。

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

5. 返回并使用步骤 4 命令中获得的抓取器 ARN 值更新步骤 1 和步骤 2 中创建的信任策略。

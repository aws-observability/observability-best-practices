# Amazon Managed Prometheus 크로스 어카운트 스크래핑

Amazon Managed Service for Prometheus는 Prometheus 호환 메트릭을 자동으로 검색하고 수집하는 완전 관리형 에이전트리스 스크래퍼(Collector)를 제공합니다. 에이전트나 스크래퍼를 관리, 설치, 패치, 유지보수할 필요가 없습니다. Amazon Managed Service for Prometheus Collector는 Amazon EKS 클러스터에 대해 안정적이고 가용성이 높으며 자동으로 확장되는 메트릭 수집을 제공합니다. Amazon Managed Service for Prometheus 관리형 Collector는 EC2 및 Fargate를 포함한 Amazon EKS 클러스터에서 동작합니다.

Amazon Managed Service for Prometheus Collector는 스크래퍼 생성 시 지정된 서브넷당 하나의 Elastic Network Interface(ENI)를 생성합니다. Collector는 이 ENI를 통해 메트릭을 스크래핑하고, VPC 엔드포인트를 사용하여 remote_write로 Amazon Managed Service for Prometheus 워크스페이스에 데이터를 전송합니다. 스크래핑된 데이터는 퍼블릭 인터넷을 통해 전송되지 않습니다.

메트릭을 수집하려는 Amazon EKS 클러스터가 있는 계정(소스 계정)과 Amazon Managed Service for Prometheus 워크스페이스가 있는 계정(대상 계정)이 다른 크로스 어카운트 설정에서 스크래퍼를 생성하려면 아래 절차를 따릅니다.

## 고수준 아키텍처

![AMP Managed Collector Cross Account Scraping](./images/ampxa-arch.png)
*그림 1: AMP Managed Collector 크로스 어카운트 스크래핑, Collector 인프라는 AWS에서 완전 관리*

이 아키텍처에서는 EKS 워크로드가 있는 계정에 스크래퍼를 생성합니다. 스크래퍼는 대상 계정의 역할을 맡아 대상 계정의 AMP 워크스페이스에 데이터를 전송할 수 있습니다.

1. 소스 계정에서 STS::AssumeRole 권한이 있는 역할 arn:aws:iam::account_id_source:role/Source를 생성하고 다음 신뢰 정책을 추가합니다.

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

또한 역할 위임 권한 정책이 필요합니다:

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

스크래퍼를 실제로 생성하기 전에 IAM 구성을 먼저 만들어야 합니다. 따라서 이 시점에서 $SCRAPER_ARN은 플레이스홀더 필드입니다. 스크래퍼를 생성한 후 다시 돌아와서 업데이트합니다. $TARGET_ACCOUNT_ROLE_ARN도 2단계가 완료될 때까지 존재하지 않습니다.

:::

2. 소스(Amazon EKS 클러스터)와 대상(Amazon Managed Service for Prometheus 워크스페이스)의 모든 조합에 대해 대상 계정에 arn:aws:iam::account_id_target:role/Target 역할을 생성하고, AmazonPrometheusRemoteWriteAccess 관리형 권한 정책과 함께 다음 신뢰 정책을 추가해야 합니다.

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

$SCRAPER_ARN은 아직 플레이스홀더입니다. 스크래퍼를 생성한 후 값을 업데이트합니다.

:::

3. 소스 계정(EKS 클러스터가 있는 계정)에서 --role-configuration 옵션을 사용하여 스크래퍼를 생성합니다.

```
aws amp create-scraper \
  --source eksConfiguration="{clusterArn='arn:aws:eks:us-west-2:$SOURCE_ACCOUNT_ID:cluster/$CLUSTER_NAME',subnetIds=[$EKS_SUBNET_IDS]}" \
  --scrape-configuration configurationBlob=<base64-encoded-blob> \
  --destination ampConfiguration="{workspaceArn='arn:aws:aps:us-west-2:$TARGET_ACCOUNT_ID:workspace/$TARGET_AMP_WORKSPACE_ID'}"\
  --role-configuration '{"sourceRoleArn":"arn:aws:iam::$SOURCE_ACCOUNT_ID:role/Source", "targetRoleArn":"arn:aws:iam::$TARGET_ACCOUNT_ID:role/Target"}'
```
:::warning

$VARIABLES를 본인에게 해당하는 값으로 채워야 합니다.

:::

4. 스크래퍼 생성을 검증하고(약 20분 소요될 수 있음) 스크래퍼 ARN을 기록합니다.

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

5. 1단계와 2단계에서 생성한 신뢰 정책을 4단계의 명령에서 얻은 스크래퍼 ARN 값으로 업데이트합니다.

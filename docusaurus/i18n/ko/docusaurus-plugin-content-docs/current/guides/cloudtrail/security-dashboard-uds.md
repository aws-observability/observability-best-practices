---
sidebar_position: 2
title: CloudWatch Unified Data Store를 사용한 보안 가시성 대시보드
---

# CloudWatch Unified Data Store를 사용한 보안 가시성 대시보드

Amazon CloudWatch [Unified Data Store](https://aws.amazon.com/blogs/aws/amazon-cloudwatch-introduces-unified-data-management-and-analytics-for-operations-security-and-compliance/)는 개별 로그 그룹 이름을 알지 못해도 AWS 서비스 전반의 로그 데이터를 중앙에서 검색, 구성, 쿼리할 수 있는 방법을 제공합니다. 이를 가능하게 하기 위해 CloudWatch Unified Data Store는 [패싯(facets)](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/CloudWatchLogs-Facets.html)을 사용합니다. 패싯은 로그 데이터의 필드로, CloudWatch에서 대화형 필터링, 그룹화, 분석을 위해 노출됩니다. `@data_source_name`, `@data_source_type`, `@data_format`과 같은 기본 패싯은 별도의 구성 없이 모든 Standard 로그 클래스의 로그 그룹에서 자동으로 사용할 수 있습니다. [CloudWatch Logs Insights](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/AnalyzingLogData.html) 콘솔에서 패싯 값을 선택하여 데이터를 시각적으로 탐색하거나, 쿼리 내에서 패싯을 참조하여 일치하는 로그 그룹과 이벤트로만 검색 범위를 효율적으로 좁힐 수 있습니다.

이러한 패싯을 통해 CloudWatch는 AWS CloudTrail 및 Amazon VPC Flow Logs와 같은 출처 [데이터 소스](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/supported-aws-services-data-sources.html)별로 로그를 자동 분류합니다. 따라서 로그 그룹이 몇 개가 존재하든, 이름이 무엇이든 관계없이 `@data_source_name` 패싯을 사용하여 모든 CloudTrail 또는 VPC Flow Log 데이터를 로그 그룹 전반에 걸쳐 쿼리할 수 있습니다.

[CloudWatch 교차 계정 교차 리전 로그 중앙화](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/CloudWatchLogs_Centralization.html)를 활용하면 이 기반 위에 보안 분석을 구축할 수 있습니다. 이 가이드에서는 CloudWatch 데이터 소스를 활용하여 CloudTrail 및 VPC Flow Logs 활동에 대한 근실시간 가시성을 제공하는 사전 구축된 샘플 [CloudWatch Dashboard](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch_Dashboards.html)를 AWS CloudFormation을 통해 배포하는 과정을 안내합니다. 각 위젯이 제공하는 정보와 보안 모니터링, 인시던트 조사, 컴플라이언스 가시성을 위해 대시보드를 활용하는 방법을 설명합니다.

## 이 대시보드가 중요한 이유

보안 팀은 AWS 계정 전반의 API 활동과 네트워크 트래픽에 대해 중앙화된 근실시간 가시성이 필요합니다. 중앙화된 대시보드가 없으면 여러 로그 그룹에 걸쳐 수동으로 쿼리를 실행하고, CloudTrail과 VPC Flow Logs 간의 데이터를 상호 연관시키며, 분산된 소스에서 보안 컨텍스트를 하나하나 조합해야 합니다.

이 대시보드는 다음과 같은 주요 과제를 해결합니다:

- **로그 그룹 이름에 대한 의존성 없음**: [`SOURCE logGroups() | filterIndex @data_source_name`](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/CWL_QuerySyntax-FilterIndex.html)을 사용하여 계정 내 로그 그룹의 이름과 관계없이 CloudWatch Unified Data Store 기본 패싯을 통해 CloudTrail과 VPC Flow Logs를 동적으로 검색합니다.
- **이중 포맷 지원**: 로그 포맷 선호도에 따라 Standard(AWS 네이티브 필드명) 또는 OCSF(Open Cybersecurity Schema Framework) 버전의 대시보드를 배포합니다.
- **서비스 간 상관분석**: CloudTrail API 활동과 VPC Flow Log 네트워크 데이터를 나란히 배치하여 보안 이벤트를 시각적으로 상호 연관시킬 수 있습니다.
- **계정 간 이식성**: 동일한 CloudFormation 템플릿이 CloudTrail과 VPC Flow Logs가 CloudWatch Logs로 전달되는 모든 계정에서 로그 그룹 이름 파라미터 변경 없이 동작합니다.

## 사전 요구 사항

배포 전에 계정에 필요한 데이터 소스가 있는지 확인하세요:

```bash
aws logs list-aggregate-log-group-summaries --group-by DATA_SOURCE_NAME_AND_TYPE
```

출력에서 `aws_cloudtrail`과 `amazon_vpc` 항목이 표시되어야 합니다. 이 항목이 누락된 경우 다음을 확인하세요:

1. **[CloudTrail](https://aws.amazon.com/about-aws/whats-new/2025/12/key-enhancements-cloudtrail-events-cloudwatch/)** 이 CloudWatch Logs로 로그를 전달하도록 구성되어 있는지 확인합니다.
2. **[VPC Flow Logs](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/telemetry-config-rules.html)** 가 하나 이상의 VPC에서 CloudWatch Logs로 전달되도록 구성되어 있는지 확인합니다.

## 대시보드 배포

1. **[CloudWatch_Dashboard_CloudTrail_VPC.yaml](https://raw.githubusercontent.com/aws-samples/aws-management-and-governance-samples/refs/heads/master/AWSCloudTrail/cloudwatch-dashboards/CloudWatch_Dashboard_CloudTrail_VPC.yaml)** 템플릿을 다운로드합니다.
1. **CloudFormation** → **Create stack** → **With new resources**로 이동합니다.
1. `CloudWatch_Dashboard_CloudTrail_VPC.yaml` 템플릿을 업로드합니다.
1. 파라미터를 구성합니다:
   - **DashboardName**: 대시보드 이름을 지정합니다 (기본값: `CloudTrail-VPC-Dashboard`).
   - **LogFormat**: AWS 네이티브 CloudTrail/VPC Flow Log 필드명을 사용하려면 `Standard`를, Open Cybersecurity Schema Framework 정규화 필드를 사용하려면 `OCSF`를 선택합니다.
1. 검토 후 스택을 생성합니다.

### CloudFormation 파라미터

| 파라미터                          | 기본값                    | 설명                                                                                      |
|------------------------------------|----------------------------|-----------------------------------------------------------------------------------------------------|
| `DashboardName`                    | `CloudTrail-VPC-Dashboard`    | CloudWatch 대시보드의 이름                                                                |
| `LogFormat`                        | `Standard`                 | `Standard` (AWS 네이티브 필드) 또는 `OCSF` (정규화 스키마)                                    |

## 쿼리 작동 방식

이 대시보드의 모든 [CloudWatch Logs Insights](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/CWL_QuerySyntax.html) 쿼리는 동일한 패턴을 사용합니다:

```
SOURCE logGroups() | filterIndex @data_source_name in ["aws_cloudtrail"]
| <your query logic here>
```

- [`SOURCE logGroups()`](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/CWL_QuerySyntax-Source.html)는 CloudWatch에 계정 내 모든 로그 그룹을 대상으로 검색하도록 지시합니다.
- [`filterIndex @data_source_name in [...]`](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/CWL_QuerySyntax-FilterIndex.html)는 `@data_source_name` 기본 패싯을 사용하여 지정된 데이터 소스가 포함된 로그 그룹으로만 검색 범위를 좁힙니다. CloudWatch는 모든 Standard 로그 클래스의 로그 그룹에 대해 별도의 구성 없이 이 기본 패싯을 자동으로 제공합니다.
- CloudTrail 쿼리의 경우 데이터 소스 이름은 `aws_cloudtrail`입니다.
- VPC Flow Log 쿼리의 경우 데이터 소스 이름은 `amazon_vpc`입니다.

이 접근 방식을 사용하면 실제 로그 그룹 이름을 알거나 구성할 필요가 없습니다. CloudTrail 로그 그룹의 이름이 `aws-cloudtrail-logs`이든, `aws/cloudtrail/managementevents`이든, 기타 사용자 지정 이름이든 관계없이 대시보드는 동일하게 동작합니다.

## 보안 모범 사례

### IAM을 사용한 대시보드 접근 제한

보안 데이터를 표시하는 CloudWatch 대시보드에는 모범 사례로서 최소 권한 접근 제어를 적용해야 합니다.

아래는 대시보드에 대한 읽기 전용 접근을 부여하고 수정을 거부하는 IAM 정책 예시입니다. 보기 전용 접근이 필요한 IAM 역할이나 그룹에 이 정책을 연결하세요:

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

`ACCOUNT_ID`를 AWS 계정 ID로, `CloudTrail-VPC-Dashboard`를 실제 사용하는 대시보드 이름으로 교체하세요(사용자 지정한 경우).

대시보드를 유지 관리해야 하는 보안 운영 팀의 경우, 읽기와 쓰기를 모두 허용하는 별도의 정책을 사용하세요:

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

대시보드 쿼리를 실행하려면 관련 로그 그룹에 대한 `logs:StartQuery`, `logs:GetQueryResults`, `logs:FilterLogEvents` 권한도 필요합니다. IAM 역할에 이러한 권한이 CloudTrail 및 VPC Flow Log 로그 그룹으로 범위가 지정되어 있는지 확인하세요.

### CloudWatch 알람으로 대시보드 보완

대시보드는 현재 상황을 보여주지만 문제 발생 시 알려주지는 않습니다. 중요한 보안 이벤트에 대해 알림을 받으려면 [CloudWatch Logs 지표 필터](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/MonitoringLogData.html)를 기반으로 한 [CloudWatch Alarms](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/AlarmThatSendsEmail.html)를 설정하세요. 고려해볼 만한 항목은 다음과 같습니다:

| 이벤트 | 지표 필터 패턴 |
|---|---|
| Root 계정 사용 | `{ $.userIdentity.type = "Root" && $.userIdentity.invokedBy NOT EXISTS && $.eventType != "AwsServiceEvent" }` | 
| 권한 상승 | `{ ($.eventName = "AttachRolePolicy") \|\| ($.eventName = "PutRolePolicy") \|\| ($.eventName = "CreateAccessKey") \|\| ($.eventName = "CreateLoginProfile") }` | 
| 콘솔 로그인 실패 | `{ ($.eventName = "ConsoleLogin") && ($.errorMessage = "Failed authentication") }` | 

롤링 윈도우에서 REJECT 수에 대한 [CloudWatch Logs Insights 쿼리 기반 알람](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Create_Metrics_Insights_Alarm.html)을 사용하면 포트 스캐닝이나 활성 네트워크 공격을 탐지할 수 있습니다.

알람 작업을 [SNS 주제](https://docs.aws.amazon.com/sns/latest/dg/welcome.html)로 라우팅하여 이메일, Slack 또는 인시던트 관리 플랫폼을 통해 보안 운영 팀에 알림을 보내세요.

### 로그 그룹 암호화 및 보존

CloudWatch Logs는 기본적으로 AWS 관리형 키를 사용하여 저장 시 모든 로그 데이터를 암호화하며, 별도의 구성이 필요하지 않습니다. 그러나 조직에서 컴플라이언스를 위해 고객 관리형 암호화 키가 필요한 경우, [각 로그 그룹에 KMS 키를 연결](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/encrypt-log-data-kms.html)할 수 있습니다. 이를 통해 키 교체, 접근 정책, CloudTrail을 통한 감사 추적을 완전히 제어할 수 있습니다.

이 템플릿은 대시보드만 생성하며, 기본 로그 그룹을 생성하거나 관리하지 않으므로 암호화나 보존 설정을 강제할 수 없습니다. 대시보드에 사용되는 CloudTrail 및 VPC Flow Log 로그 그룹에 적절한 설정이 적용되어 있는지 확인하세요:

- **KMS 암호화**: 필요한 경우 `aws logs associate-kms-key`를 사용하거나 로그 그룹 생성 시 CloudFormation을 통해 KMS 키를 로그 그룹에 연결합니다.
- **보존 정책**: 기본적으로 CloudWatch Logs는 로그 데이터를 무기한 보존합니다. 컴플라이언스 요구 사항과 비용 간의 균형을 맞추는 [보존 정책](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/Working-with-log-groups-and-streams.html#SettingLogRetention)을 설정하세요.

### 추가 권장 사항

- 배포 후 실수로 삭제되는 것을 방지하기 위해 **CloudFormation 스택 종료 보호를 활성화**하세요.
- AWS Organizations에서 **[Service Control Policies (SCPs)](https://docs.aws.amazon.com/organizations/latest/userguide/orgs_manage_policies_scps.html)**를 사용하여 모든 계정에서 `cloudwatch:PutDashboard` 및 `cloudwatch:DeleteDashboards`를 특정 관리자 역할로 제한하세요.
- **CloudWatch API 호출에 대한 CloudTrail 로깅을 활성화**하여 대시보드 수정 사항이 CloudTrail의 `PutDashboard` 이벤트를 통해 감사 가능하도록 하세요.

## 대시보드 섹션 및 위젯 참조

대시보드는 6개 섹션으로 구성되어 있습니다. 아래는 Standard 포맷 버전이며, OCSF 버전은 OCSF 필드명(`api.operation`, `src_endpoint.ip`, `actor.user.name` 등)을 사용하는 동일한 위젯으로 구성됩니다.

---

### 섹션 1: 보안 개요

이 섹션은 AWS 환경 전반의 보안 상태를 한눈에 파악할 수 있는 뷰를 제공합니다.

| 위젯                                                       | 유형                      | 데이터 소스       | 표시 내용                                                                                                          | 중요성                                                                                                                                                                                  |
|--------------------------------------------------------------|---------------------------|-------------------|------------------------------------------------------------------------------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| 📈 Error Rate Trend Over Time                                | 시계열               | CloudTrail        | 5분 단위로 집계된 API 오류 수의 시간별 추이.                                                             | 오류의 갑작스러운 급증은 무차별 대입 공격, 잘못 구성된 자동화, 유출된 자격 증명을 나타낼 수 있습니다. 비정상적인 상황이 발생하고 있음을 알려주는 첫 번째 지표로 활용하세요.           |
| 🚨 Top Error Codes (Unauthorized / Access Denied)            | 테이블                     | CloudTrail        | 가장 빈번한 접근 거부 및 무단 접근 오류 코드를 오류 코드, API 이벤트명, 계정, 리전별로 분류. | 어떤 API 호출이 거부되고 있는지, 어느 계정에서 발생하는지 식별합니다. 여기서의 패턴은 자격 증명 스터핑, 권한 오구성, 횡적 이동 시도를 드러낼 수 있습니다.            |
| 🥧 User Identity Types                                       | 원형 차트                 | CloudTrail        | ID 유형(IAMUser, AssumedRole, Root, FederatedUser, AWSService 등)별 API 호출 분포.              | 정상적인 환경에서는 대부분 AssumedRole과 AWSService 호출이 표시되어야 합니다. 상당한 수준의 Root 또는 IAMUser 활동은 조사가 필요할 수 있습니다.                                                      |
| 🥧 VPC Flow Actions                                          | 원형 차트                 | VPC Flow Logs     | 모든 VPC Flow Log 레코드에서 ACCEPT 대 REJECT 작업의 비율.                                                     | REJECT 비율이 높다면 포트 스캐닝, 보안 그룹 오구성, 네트워크 경계에 대한 활성 공격 시도를 나타낼 수 있습니다.                                                        |
| 🔐 Root Account Activity                                     | 테이블                     | CloudTrail        | Root 계정을 사용한 최근 API 호출(이벤트명, 소스 IP, 계정, 리전 포함).                    | Root 계정 사용은 드물고 정당한 사유가 있어야 합니다. 예상치 못한 Root 활동은 즉시 조사해야 하는 높은 우선순위의 보안 이벤트입니다.                                    |

---

### 섹션 2: 상관 보안 인사이트 — CloudTrail + VPC Flow Logs

이 섹션은 시각적 상관분석을 위해 API 계층과 네트워크 계층의 보안 데이터를 나란히 배치합니다.

| 위젯                                                       | 유형                      | 데이터 소스       | 표시 내용                                                                                                          | 중요성                                                                                                                                                                                  |
|--------------------------------------------------------------|---------------------------|-------------------|------------------------------------------------------------------------------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| ⚠️ Suspicious IPs: API Errors                                | 테이블                     | CloudTrail        | 가장 많은 API 오류를 발생시키는 외부(비RFC1918) IP 주소를 계정 및 리전별로 그룹화.                     | 높은 오류 수를 기록하는 외부 IP는 무단 접근을 시도하고 있을 가능성이 높습니다. 네트워크 REJECT 위젯과 교차 확인하여 동일한 IP가 네트워크 계층에서도 차단되고 있는지 확인하세요. |
| ⚠️ IPs with Network REJECT                                   | 테이블                     | VPC Flow Logs     | REJECT 작업이 가장 많은 외부 IP 주소를 목적지 포트별로 분류.                                   | 보안 그룹이나 NACL에 의해 차단되는 외부 IP를 보여줍니다. 동일한 IP가 이 위젯과 API Errors 위젯 모두에 나타나면 악의적인 활동을 강하게 시사합니다.         |
| 🔗 Cross-Reference: External IPs in CloudTrail Logs                 | 테이블 (전체 너비)        | CloudTrail        | API 호출을 수행하는 모든 외부 IP와 IP, 계정, 리전별 총 API 호출 수 및 오류 수.              | 외부 IP 활동에 대한 종합적인 뷰를 제공합니다. API 호출 수는 높지만 오류 수가 낮은 IP는 정상적인 서비스일 수 있으며, 오류 비율이 높은 IP는 조사가 필요합니다.               |
| 📈 API Activity Timeline                                     | 시계열               | CloudTrail        | 10분 단위의 총 API 호출량 시간별 추이.                                                                     | 정상적인 API 활동의 기준선을 설정합니다. 기준선에서의 이탈은 자동화된 공격, 서비스 중단, 스크립트를 실행하는 유출된 자격 증명을 나타낼 수 있습니다.                     |
| 📈 Network Traffic Timeline                                  | 시계열 (누적)     | VPC Flow Logs     | ACCEPT/REJECT 작업별로 누적된 시간별 네트워크 플로우 수.                                                        | 네트워크 트래픽 패턴과 시간에 따른 차단 트래픽 비율을 시각화합니다. REJECT 추세가 증가하면 진행 중인 공격을 나타낼 수 있습니다.                                                     |

---

### 섹션 3: 네트워크 보안 — 네트워크 활동 분석

VPC Flow Log 데이터를 심층 분석하여 네트워크 계층의 보안 가시성을 제공합니다.

| 위젯                                                       | 유형                      | 데이터 소스       | 표시 내용                                                                                                          | 중요성                                                                                                                                                                                  |
|--------------------------------------------------------------|---------------------------|-------------------|------------------------------------------------------------------------------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| 🚫 Top Blocked Network Connections                           | 테이블                     | VPC Flow Logs     | REJECT 작업이 가장 많은 소스/목적지 IP 쌍과 전송된 총 바이트.                                   | 가장 지속적인 차단된 연결 시도를 식별합니다. 단일 소스 IP에서의 대량 차단 연결은 표적 공격이나 잘못 구성된 애플리케이션을 나타낼 수 있습니다.                 |
| 📊 Top Destination Ports                                     | 막대 차트                 | VPC Flow Logs     | 모든 Flow Log 레코드에서 가장 많이 대상이 되는 목적지 포트.                                                | 443(HTTPS) 및 80(HTTP)과 같은 일반적인 포트는 예상되는 것입니다. 비정상적인 포트(예: 22, 3389, 445)에 높은 트래픽이 발생하면 스캐닝이나 익스플로잇 시도를 나타낼 수 있습니다.                            |
| 📉 Network Traffic Bytes Over Time                           | 시계열 (누적)     | VPC Flow Logs     | ACCEPT/REJECT별로 누적된 시간별 총 전송 바이트.                                                           | 데이터 전송량 추세를 추적합니다. 수락된 바이트의 갑작스러운 증가는 데이터 유출을 나타낼 수 있으며, 거부된 바이트의 증가는 악의적 트래픽의 활성 차단을 시사합니다.               |
| 🔍 Top External Source IPs                                   | 테이블                     | VPC Flow Logs     | 가장 많은 연결 수와 총 바이트를 기록한 외부 IP를 작업(ACCEPT/REJECT)별로 그룹화.                             | VPC와 통신하는 가장 활발한 외부 IP를 식별합니다. 정상적인 파트너, CDN 또는 잠재적 위협 행위자를 파악하는 데 유용합니다.                                              |

---

### 섹션 4: ID 및 접근 관리

CloudTrail의 IAM 활동 및 인증 이벤트에 초점을 맞춥니다.

| 위젯                                                       | 유형                      | 데이터 소스       | 표시 내용                                                                                                          | 중요성                                                                                                                                                                                  |
|--------------------------------------------------------------|---------------------------|-------------------|------------------------------------------------------------------------------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| 🔑 IAM Privilege Escalation Indicators                       | 테이블                     | CloudTrail        | 고위험 IAM API 호출(CreateUser, AttachUserPolicy, AttachRolePolicy, PutUserPolicy, PutRolePolicy, CreateAccessKey, CreateLoginProfile)을 이벤트명, 사용자 ARN, 계정, 리전별로 그룹화. | 이러한 API 호출은 상승된 권한을 부여할 수 있습니다. 예상치 못한 발생은 공격자가 초기 침입 후 지속성을 확보하거나 권한을 상승시키고 있음을 나타낼 수 있습니다.                      |
| 📊 Top API Calls                                             | 막대 차트                 | CloudTrail        | 모든 CloudTrail 이벤트에서 가장 빈번하게 호출된 상위 10개 API.                                                       | "정상적인" API 활동의 모습을 설정합니다. 비정상적인 API가 상위 10개에 나타나면 새로운 자동화, 오구성 또는 악의적 활동을 나타낼 수 있습니다.                                    |
| 🛡️ Authentication Events                                    | 테이블                     | CloudTrail        | AWS 콘솔 로그인 시도를 성공/실패(errorCode), 사용자 ARN, 계정, 리전별로 그룹화.                     | 실패한 콘솔 로그인은 자격 증명 스터핑이나 무차별 대입 공격을 나타낼 수 있습니다. 예상치 못한 사용자나 리전에서의 성공적인 로그인은 조사해야 합니다.                                        |
| 📈 Authentication Attempts Over Time                         | 시계열 (누적)     | CloudTrail        | 30분 단위로 성공/실패별로 누적된 콘솔 로그인 시도 추이.                                        | 인증 패턴을 시각화합니다. 실패한 로그인이 연속된 후 성공이 이어지면 계정이 침해되었을 수 있습니다.                                                                          |

---

### 섹션 5: 활동 분포 및 분석

운영 및 보안 인식을 위한 API 활동 패턴에 대한 광범위한 분석입니다.

| 위젯                                                       | 유형                      | 데이터 소스       | 표시 내용                                                                                                          | 중요성                                                                                                                                                                                  |
|--------------------------------------------------------------|---------------------------|-------------------|------------------------------------------------------------------------------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| 🌐 Top Source IPs by Activity Volume                         | 테이블                     | CloudTrail        | 가장 많은 API 활동을 생성하는 외부 IP를 계정 및 리전별로 그룹화.                                          | 가장 활발한 외부 호출자를 식별합니다. 높은 활동량을 보이는 예상치 못한 IP는 외부 인프라에서 유출된 자격 증명이 사용되고 있음을 나타낼 수 있습니다.                             |
| 🥧 Events by Event Type                                      | 원형 차트                 | CloudTrail        | CloudTrail 이벤트 유형(AwsApiCall, AwsConsoleSignIn, AwsServiceEvent 등)의 분포.                          | 활동의 성격에 대한 맥락을 제공합니다. AwsConsoleSignIn 이벤트의 갑작스러운 증가나 새로운 이벤트 유형의 출현은 주의가 필요할 수 있습니다.                                                   |
| 📈 Activity Trend by Event Source                            | 시계열 (누적)     | CloudTrail        | AWS 서비스(eventSource)별로 분류된 시간별 API 호출량.                                                   | 가장 활발한 서비스와 시간에 따른 활동 패턴 변화를 보여줍니다. 갑자기 매우 활발해진 서비스는 자동화된 작업이나 인시던트를 나타낼 수 있습니다.                      |
| 🌍 Events by Region                                          | 원형 차트                 | CloudTrail        | AWS 리전별 API 호출 분포.                                                                          | 예상치 못한 리전에서의 활동은 일반적으로 리소스가 없는 리전에서 공격자가 운영하고 있음을 나타낼 수 있습니다. 이는 침해의 일반적인 지표입니다.                               |
| 🥧 Top Services                                              | 원형 차트                 | CloudTrail        | 이벤트 수 기준 가장 많이 호출된 AWS 서비스.                                                                           | 서비스 사용 기준선을 설정합니다. 새로운 서비스가 나타나거나 비정상적인 비율이 보이면 무단 리소스 생성을 나타낼 수 있습니다.                                                              |
| 📊 Read vs Write API Calls                                   | 막대 차트                 | CloudTrail        | 읽기 전용 API 호출 대 변경(쓰기) API 호출의 비율.                                                                      | 정상적인 환경에서는 일반적으로 읽기 호출이 쓰기 호출보다 많습니다. 쓰기 호출의 갑작스러운 증가는 대량 리소스 생성, 수정, 삭제를 나타낼 수 있으며 잠재적으로 악의적일 수 있습니다.    |

---

### 섹션 6: 상세 보안 이벤트 타임라인

| 위젯                                                       | 유형                      | 데이터 소스       | 표시 내용                                                                                                          | 중요성                                                                                                                                                                                  |
|--------------------------------------------------------------|---------------------------|-------------------|------------------------------------------------------------------------------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| 🔐 Security Events Timeline — Errors & Access Denied         | 테이블 (전체 너비)        | CloudTrail        | 타임스탬프, 이벤트명, 오류 코드, 오류 메시지, 사용자 ARN, 소스 IP, 계정, 리전의 전체 컨텍스트를 포함한 최근 100건의 API 오류. | 조사의 출발점입니다. 알람이 발생하거나 위의 위젯에서 이상을 발견했을 때, 인시던트 대응을 위해 전체 컨텍스트가 포함된 원시 이벤트를 여기서 확인하세요.            |

---
![CloudTrail 대시보드](/img/cloudops/solutions/cloudtrail-dashboards/example-dashboard-01.png)

![CloudTrail 대시보드](/img/cloudops/solutions/cloudtrail-dashboards/example-dashboard-02.png)

## 정리

대시보드 및 모든 관련 리소스를 제거하려면 다음을 실행하세요:

```bash
aws cloudformation delete-stack --stack-name CloudTrail-VPC-Dashboard
```

:::note
**CloudTrail-VPC-Dashboard**를 배포 섹션에서 사용한 CloudFormation 스택 이름으로 교체하세요.
:::

## 결론

이 CloudWatch Dashboard는 CloudWatch Unified Data Store 데이터 소스를 활용하여 CloudTrail API 활동과 VPC Flow Log 네트워크 데이터에 대한 중앙화된 근실시간 보안 가시성을 제공합니다. `@data_source_name` 기본 패싯을 활용함으로써 대시보드는 로그 그룹 이름 구성 없이 적절한 로그 그룹을 자동으로 검색하여 모든 AWS 계정에서 이식 가능합니다. CloudFormation을 통해 몇 분 만에 배포하여 위협 탐지, 인시던트 조사, 컴플라이언스 모니터링을 위한 즉각적인 보안 가시성을 확보하세요.

# Amazon Managed Grafana - FAQ

## Amazon Managed Grafana를 선택해야 하는 이유는 무엇인가요?

**[고가용성](https://docs.aws.amazon.com/grafana/latest/userguide/disaster-recovery-resiliency.html)**: Amazon Managed Grafana 워크스페이스는 다중 AZ 복제를 통해 고가용성을 제공합니다. Amazon Managed Grafana는 또한 워크스페이스의 상태를 지속적으로 모니터링하고, 워크스페이스에 대한 접근에 영향을 주지 않으면서 비정상 노드를 교체합니다. Amazon Managed Grafana는 컴퓨팅 및 데이터베이스 노드의 가용성을 관리하므로 고객이 관리 및 유지 보수에 필요한 인프라 리소스를 관리할 필요가 없습니다.

**[데이터 보안](https://docs.aws.amazon.com/grafana/latest/userguide/security.html)**: Amazon Managed Grafana는 특별한 구성, 타사 도구 또는 추가 비용 없이 저장 데이터를 암호화합니다. [전송 중 데이터](https://docs.aws.amazon.com/grafana/latest/userguide/infrastructure-security.html)도 TLS를 통해 암호화됩니다.

## 어떤 AWS 리전이 지원되나요?

현재 지원되는 리전 목록은 [문서의 지원되는 리전 섹션](https://docs.aws.amazon.com/grafana/latest/userguide/what-is-Amazon-Managed-Service-Grafana.html#AMG-supported-Regions)에서 확인할 수 있습니다.

## 조직에 여러 리전에 걸친 여러 AWS 계정이 있는데, Amazon Managed Grafana가 이러한 시나리오에서 작동하나요?

Amazon Managed Grafana는 [AWS Organizations](https://docs.aws.amazon.com/organizations/latest/userguide/orgs_introduction.html)와 통합되어 조직 단위(OU)의 AWS 계정과 리소스를 검색합니다. AWS Organizations를 사용하면 고객은 여러 AWS 계정에 대한 [데이터 소스 구성 및 권한 설정을 중앙에서 관리](https://docs.aws.amazon.com/grafana/latest/userguide/AMG-and-Organizations.html)할 수 있습니다.

## Amazon Managed Grafana에서 지원되는 데이터 소스는 무엇인가요?

데이터 소스는 Amazon Managed Grafana에서 대시보드를 구축하기 위해 Grafana에서 쿼리할 수 있는 스토리지 백엔드입니다. Amazon Managed Grafana는 Amazon CloudWatch, Amazon OpenSearch Service, AWS IoT SiteWise, AWS IoT TwinMaker, Amazon Managed Service for Prometheus, Amazon Timestream, Amazon Athena, Amazon Redshift, AWS X-Ray 등 AWS 네이티브 서비스를 포함한 약 [30개 이상의 내장 데이터 소스](https://docs.aws.amazon.com/grafana/latest/userguide/AMG-data-sources-builtin.html)를 지원합니다. 추가로, Grafana Enterprise의 업그레이드된 워크스페이스에서는 [약 15개 이상의 다른 데이터 소스](https://docs.aws.amazon.com/grafana/latest/userguide/AMG-data-sources-enterprise.html)도 사용 가능합니다.

## 워크로드의 데이터 소스가 프라이빗 VPC에 있습니다. Amazon Managed Grafana에 안전하게 연결하려면 어떻게 하나요?

[VPC 내의 프라이빗 데이터 소스](https://docs.aws.amazon.com/grafana/latest/userguide/AMG-configure-vpc.html)는 AWS PrivateLink를 통해 Amazon Managed Grafana에 연결하여 트래픽을 안전하게 유지할 수 있습니다. [VPC 엔드포인트](https://docs.aws.amazon.com/grafana/latest/userguide/AMG-configure-nac.html)에서 Amazon Managed Grafana 서비스에 대한 추가 접근 제어는 [Amazon VPC 엔드포인트](https://docs.aws.amazon.com/whitepapers/latest/aws-privatelink/what-are-vpc-endpoints.html)에 대한 [IAM 리소스 정책](https://docs.aws.amazon.com/grafana/latest/userguide/VPC-endpoints.html#controlling-vpc)을 연결하여 제한할 수 있습니다.

## Amazon Managed Grafana에서 사용 가능한 사용자 인증 메커니즘은 무엇인가요?

Amazon Managed Grafana 워크스페이스에서 [사용자는 Grafana 콘솔에 인증](https://docs.aws.amazon.com/grafana/latest/userguide/authentication-in-AMG.html)됩니다. Security Assertion Markup Language 2.0(SAML 2.0)을 지원하는 모든 IDP 또는 AWS IAM Identity Center(이전 AWS Single Sign-On)를 사용한 싱글 사인온으로 인증합니다.

> 관련 블로그: [Grafana 팀을 사용한 Amazon Managed Grafana의 세분화된 접근 제어](https://aws.amazon.com/blogs/mt/fine-grained-access-control-in-amazon-managed-grafana-using-grafana-teams/)

## Amazon Managed Grafana에서 사용 가능한 자동화 지원은 무엇인가요?

Amazon Managed Grafana는 [AWS CloudFormation과 통합](https://docs.aws.amazon.com/grafana/latest/userguide/creating-resources-with-cloudformation.html)되어 있어 고객이 AWS 리소스를 모델링하고 설정하여 리소스 및 인프라 생성과 관리에 드는 시간을 줄일 수 있습니다. [AWS CloudFormation](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/Welcome.html)을 사용하면 고객은 템플릿을 재사용하여 Amazon Managed Grafana 리소스를 일관되고 반복적으로 설정할 수 있습니다. Amazon Managed Grafana는 또한 [API](https://docs.aws.amazon.com/grafana/latest/APIReference/Welcome.html)를 제공하여 [AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-welcome.html)를 통한 자동화 또는 소프트웨어/제품과의 통합을 지원합니다. Amazon Managed Grafana 워크스페이스는 자동화 및 통합 지원을 위한 [HTTP API](https://docs.aws.amazon.com/grafana/latest/userguide/Using-Grafana-APIs.html)를 제공합니다.

> 관련 블로그: [Amazon Managed Grafana의 프라이빗 VPC 데이터 소스 지원 발표](https://aws.amazon.com/blogs/mt/announcing-private-vpc-data-source-support-for-amazon-managed-grafana/)

## 우리 조직은 자동화를 위해 Terraform을 사용합니다. Amazon Managed Grafana가 Terraform을 지원하나요?
네, [Amazon Managed Grafana는](https://aws-observability.github.io/observability-best-practices/recipes/recipes/amg-automation-tf/) [자동화](https://registry.terraform.io/modules/terraform-aws-modules/managed-service-grafana/aws/latest)를 위한 Terraform을 지원합니다.

> 예시: [Terraform 지원을 위한 참조 구현](https://github.com/aws-observability/terraform-aws-observability-accelerator/tree/main/examples/managed-grafana-workspace)

## 현재 Grafana 설정에서 자주 사용되는 대시보드를 사용하고 있습니다. 다시 만들지 않고 Amazon Managed Grafana에서 사용할 수 있는 방법이 있나요?

Amazon Managed Grafana는 대시보드, 사용자 등의 배포 및 관리를 쉽게 자동화할 수 있는 [HTTP API](https://docs.aws.amazon.com/grafana/latest/userguide/Using-Grafana-APIs.html)를 지원합니다. GitOps/CICD 프로세스에서 이러한 API를 사용하여 이러한 리소스의 관리를 자동화할 수 있습니다.

## Amazon Managed Grafana는 알림을 지원하나요?

[Amazon Managed Grafana 알림](https://docs.aws.amazon.com/grafana/latest/userguide/alerts-overview.html)은 고객에게 시스템의 문제를 거의 실시간으로 알려주는 강력하고 실행 가능한 알림을 제공하여 서비스 중단을 최소화합니다. Grafana는 알림 정보를 단일 검색 가능한 뷰에 중앙화하는 업데이트된 알림 시스템인 Grafana 알림에 대한 접근을 포함합니다.

## 우리 조직은 모든 작업을 감사 목적으로 기록해야 합니다. Amazon Managed Grafana 이벤트를 기록할 수 있나요?

Amazon Managed Grafana는 [AWS CloudTrail](https://docs.aws.amazon.com/awscloudtrail/latest/userguide/cloudtrail-user-guide.html)과 통합되어 있어, Amazon Managed Grafana에서 사용자, 역할 또는 AWS 서비스가 수행한 작업에 대한 기록을 제공합니다. CloudTrail은 [Amazon Managed Grafana에 대한 모든 API 호출](https://docs.aws.amazon.com/grafana/latest/userguide/logging-using-cloudtrail.html)을 이벤트로 캡처합니다. 캡처되는 호출에는 Amazon Managed Grafana 콘솔에서의 호출과 Amazon Managed Grafana API 작업에 대한 코드 호출이 포함됩니다.

## 추가 정보는 어디에서 확인할 수 있나요?

Amazon Managed Grafana에 대한 추가 정보는 AWS [문서](https://docs.aws.amazon.com/grafana/latest/userguide/what-is-Amazon-Managed-Service-Grafana.html)를 읽고, [Amazon Managed Grafana](https://catalog.workshops.aws/observability/en-US/aws-managed-oss/amg)에 대한 AWS Observability Workshop을 진행하며, [제품 페이지](https://aws.amazon.com/grafana/)에서 [기능](https://aws.amazon.com/grafana/features/?nc=sn&loc=2), [요금](https://aws.amazon.com/grafana/pricing/?nc=sn&loc=3) 세부 정보, 최신 [블로그 게시물](https://aws.amazon.com/grafana/resources/?nc=sn&loc=4&msg-blogs.sort-by=item.additionalFields.createdDate&msg-blogs.sort-order=desc#Latest_blog_posts) 및 [동영상](https://aws.amazon.com/grafana/resources/?nc=sn&loc=4&msg-blogs.sort-by=item.additionalFields.createdDate&msg-blogs.sort-order=desc#Videos)을 확인할 수 있습니다.

**제품 FAQ:** [https://aws.amazon.com/grafana/faqs/](https://aws.amazon.com/grafana/faqs/)
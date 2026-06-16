---
sidebar_position: 5
---
# 애플리케이션 운영

AWS 고객은 수백 개의 애플리케이션을 운영하면서 개별 리소스를 모니터링하고 관리하여 애플리케이션의 가용성, 보안, 비용 최적화, 그리고 최적의 성능을 보장해야 합니다. 애플리케이션은 고객 비즈니스에 필수적인 요소로, 최종 사용자가 필요로 하는 특정 기능이나 서비스를 제공하기 위해 함께 작동하는 리소스 그룹입니다. 오늘날 빠르게 변화하는 디지털 환경에서 AWS 리소스를 잘 정의된 애플리케이션 단위로 조직하는 것은 효율적인 클라우드 운영을 위해 매우 중요합니다. 이러한 애플리케이션 중심 접근 방식은 리소스 분산, 운영 비효율성, 여러 AWS 계정에 걸친 리소스 관리의 복잡성 같은 일반적인 문제를 해결하는 데 필요합니다.

AWS는 애플리케이션 중심의 클라우드 운영 전략을 지원하기 위해 설계된 포괄적인 서비스 모음을 제공하여, 리소스 관리를 간소화하고 가시성을 개선하며 전반적인 운영 효율성을 높일 수 있도록 합니다.

애플리케이션 운영은 AWS 전반에 걸친 기능 세트로, 비용, 상태, 보안 태세, 성능과 같은 애플리케이션 metrics를 더 적은 노력으로 대규모로 모니터링할 수 있는 일관된 접근 방식을 제공합니다. 이러한 기능은 여러 AWS 콘솔에 걸쳐 애플리케이션 중심의 뷰를 구현합니다.

![Application Operations](/img/cloudops/guides/app-ops/BP-App-ops-1.png "Application Operations")

복잡한 클라우드 환경에서 애플리케이션을 관리하는 것은 많은 조직에게 어렵고 시간이 많이 소요되는 작업입니다. 과제는 개별 리소스를 관리하는 것뿐만 아니라 애플리케이션 수명 주기의 여러 단계에서 애플리케이션 작업을 수행하는 데도 있습니다. 이렇게 분산된 접근 방식은 특정 애플리케이션과 관련된 리소스를 식별하기 어렵게 만들어, 중요 이벤트 발생 시 대응 시간이 늘어나고 관련 운영 데이터에 접근하는 데 복잡성이 증가합니다.

이러한 문제를 해결하기 위해서는 리소스 관리를 위한 견고한 기반을 구축하는 것이 필수적입니다. 이 기반은 리소스 환경에 대한 포괄적인 이해를 개발하고 애플리케이션을 중심으로 하는 강력한 태깅 전략을 구현하는 것에서 시작됩니다. 이를 통해 조직은 AWS 내에서 애플리케이션 중심의 뷰로 전환할 수 있습니다.

이 접근 방식을 사용하면 고객은 특정 애플리케이션과 관련된 리소스를 빠르게 식별하고, 상호 의존성을 파악하며, 필요할 때 적절한 조치를 취할 수 있습니다. 또한 각 애플리케이션 컨텍스트 내에서 리소스가 어떻게 활용되는지에 대한 명확한 그림을 제공하여 모니터링, 문제 해결 및 비용 최적화 작업을 간소화합니다.

![Application Operations](/img/cloudops/guides/app-ops/BP-App-ops-2.png "Application Operations")


### **기반 구축**

AWS 고객은 단일 계정 내에서 수많은 리소스를 다루는 경우가 많으며, 애플리케이션에 대한 통합된 뷰가 없으면 효율적인 조치와 의사 결정이 크게 저해될 수 있습니다. 고객이 비즈니스 목표를 달성하면서 운영을 확장할 수 있도록 돕기 위해, 리소스 관리 서비스는 AWS 리소스를 효과적으로 탐색, 조직, 관리하기 위한 핵심 기본 요소, 개념, 기술을 제공합니다. 이러한 서비스는 고객이 비즈니스 목표에 맞춰 대규모로 리소스를 처리하는 데 활용할 수 있는 필수 구성 요소를 제공합니다. 이 접근 방식의 기반은 태깅(Tagging), 태깅 정책(Tagging Policies), 리소스 그룹(Resource Groups), 리소스 탐색기(Resources Explorer)로 구성됩니다.

AWS Resource Explorer는 AWS 리소스에 대한 상세 정보를 집계하고 이를 관리할 수 있는 중앙 집중식 위치를 제공합니다. 리소스 사용 현황을 확인하고, 태그가 지정되지 않은 리소스 수 같은 거버넌스를 평가하며, 리소스의 상세 메타데이터와 관계 그래프를 탐색할 수 있습니다. 계정 내 리소스를 식별하는 것이 리소스 환경을 이해하기 위한 첫 번째 단계입니다.

태깅은 리소스를 조직하고 리소스 관리를 간소화하는 데 중요한 단계입니다. 고객이 다양한 리소스를 효율적으로 추적할 수 있게 해줍니다. 많은 조직이 이미 부서, 환경, 비용 센터에 대한 태그를 사용하고 있지만, 애플리케이션 태그를 추가하는 것은 특히 가치가 있습니다. 이 태그는 각 리소스가 어떤 애플리케이션과 연관되어 있는지 식별하는 데 도움이 되며, 개별 리소스와 이를 지원하는 애플리케이션 간의 명확한 연결고리를 제공합니다. 애플리케이션 태깅을 구현하려면 먼저 각 애플리케이션 내에서 운영되는 모든 리소스를 식별하세요. 애플리케이션 이름을 포함하는 일관된 태깅 전략을 개발하고, 이러한 태그를 모든 관련 리소스에 체계적으로 적용하세요.

태깅이 리소스 프로비저닝 프로세스의 일부가 되도록 하여 일관성을 유지하세요. 예를 들어, AWS에서 수백 개의 애플리케이션을 운영하는 소매 고객이 있다고 가정합니다. 이는 Amazon EC2 인스턴스, Amazon S3 버킷, Amazon Relational Database Service(RDS) 데이터베이스, AWS Lambda 함수와 같은 수천 개의 AWS 리소스를 관리한다는 것을 의미합니다. 이러한 리소스는 재고 관리, POS(Point-of-Sale) 시스템, 고객 로열티 프로그램, 전자상거래 플랫폼 등 다양한 애플리케이션의 일부가 될 수 있습니다.


```json
POS 시스템과 재고 관리를 위한 태깅 스키마 예시:
Application name ("pos-system", "inventory-manager")
Environment (예: "production", "development", "testing")
Business unit (예: "north-america", "europe", "e-commerce")
Cost center (예: "it-ops", "marketing", "sales")
```


이 태깅 스키마를 적용하면, 소매 고객으로서 사이버위크 세일과 같은 중요 이벤트 시 POS 시스템 관련 성능 문제를 빠르게 찾아 신속하게 대응할 수 있습니다. 애플리케이션 중심 뷰에서 관련 리소스를 정확히 파악할 수 있기 때문입니다.

태깅과 리소스 그룹은 고객이 환경을 개념화하는 방식과 함께 작동합니다. 리소스 그룹을 사용하면 애플리케이션, 프로젝트 또는 워크로드를 반영하는 구성 요소로 AWS 리소스를 조직할 수 있습니다. 이 접근 방식은 리소스를 집합적으로 관리하고 모니터링하는 직관적인 방법을 제공합니다. 리소스 그룹을 효과적으로 사용하려면 애플리케이션 태그를 기반으로 그룹을 생성하세요. 각 애플리케이션의 모든 관련 리소스를 해당 그룹에 포함시키세요. 이러한 그룹은 모니터링, 권한, 비용 추적 등의 집합적 관리 작업에 사용할 수 있습니다.

소매 고객 예시를 이어서, 태깅 스키마를 사용하여 "Application: pos-system"과 "Environment: production"으로 태그된 모든 리소스를 함께 그룹화했습니다. 이를 통해 프로덕션 환경의 POS 시스템에 속하는 모든 AWS 리소스에 대한 단일 뷰를 제공합니다.

### **애플리케이션 정의**

태그와 리소스 그룹을 기반으로, AWS 내에서 애플리케이션을 응집력 있는 단위로 정의하면 클라우드 운영에 진정한 애플리케이션 중심 접근 방식을 취할 수 있습니다. 이 단계에서는 모든 관련 리소스와 상호 의존성을 포함하는 공식적인 애플리케이션 정의를 생성합니다. 애플리케이션을 설정하려면 AWS Service Catalog AppRegistry와 같은 AWS 서비스를 사용하여 애플리케이션을 정의하고 관리하세요. 모든 관련 리소스 그룹과 개별 리소스를 애플리케이션 정의에 포함하고, 애플리케이션의 수명 주기 단계와 관련 관리 프로세스를 정의하세요.

소매 고객 예시에서는 AWS Service Catalog AppRegistry를 사용하여 웹 서버, 데이터베이스, 로드 밸런서 등 모든 리소스 그룹과 개별 리소스를 포함하는 애플리케이션 정의를 공식화합니다. 수명 주기 단계(개발, 스테이징, 프로덕션)를 설정하고 관리 프로세스를 연결합니다.

이 접근 방식을 통해 AWS에서 애플리케이션 중심의 리소스 관리를 위한 견고한 기반을 만들 수 있습니다. 이 접근 방식은 효율적인 운영, 애플리케이션 상태 및 성능에 대한 더 나은 가시성, IT 리소스와 비즈니스 목표 간의 향상된 정렬을 가능하게 합니다. 자동화된 스케일링, 간소화된 재해 복구, 정확한 비용 할당 등 고급 관리 기능의 토대를 마련합니다. 이러한 단계를 진행하면서 AWS 환경이 더 잘 조직되고, 관리 가능하며, 비즈니스 요구에 맞게 정렬되어 궁극적으로 운영 효율성과 리소스 활용도가 향상되는 것을 경험하게 될 것입니다. 애플리케이션에 초점을 맞춘 멘탈 모델을 구축하세요.

### **애플리케이션 중심 뷰**

애플리케이션 운영에는 일관된 애플리케이션 모델이 필요합니다. [AWS Service Catalog AppRegistry](https://docs.aws.amazon.com/servicecatalog/latest/arguide/intro-app-registry.html)는 애플리케이션 메타데이터를 저장하고, [AWS Resource Groups](https://docs.aws.amazon.com/ARG/latest/userguide/resource-groups.html)는 애플리케이션 리소스를 논리적으로 그룹화하며, 리소스 태깅은 애플리케이션의 리소스를 검색 가능한 리소스 그룹으로 조직합니다.

AppRegistry 애플리케이션이 생성되면, AppRegistry는 제공된 애플리케이션 태그를 사용하여 AWS 리소스를 리소스 그룹으로 연결합니다. 태그 키는 **awsApplication**이고 값은 애플리케이션의 고유 식별자입니다. 태그 키와 값은 모두 대소문자를 구분합니다. 이 키-값 쌍으로 태그된 모든 AWS 리소스는 해당 애플리케이션의 일부가 됩니다. 이 애플리케이션 태그를 통해 AWS 서비스는 콘솔과 API 내에서 해당 애플리케이션 태그를 참조하여 애플리케이션 운영을 지원할 수 있습니다.

이 접근 방식을 통해 AWS에서 애플리케이션 중심의 리소스 관리를 위한 견고한 기반을 만들 수 있습니다. 이 접근 방식은 효율적인 운영, 애플리케이션 상태 및 성능에 대한 더 나은 가시성, IT 리소스와 비즈니스 목표 간의 향상된 정렬을 가능하게 합니다. 자동화된 스케일링, 간소화된 재해 복구, 정확한 비용 할당 등 고급 관리 기능의 토대를 마련합니다. 이러한 단계를 진행하면서 AWS 환경이 더 잘 조직되고, 관리 가능하며, 비즈니스 요구에 맞게 정렬되어 궁극적으로 운영 효율성과 리소스 활용도가 향상되는 것을 경험하게 될 것입니다. 애플리케이션에 초점을 맞춘 멘탈 모델을 구축하세요.

myApplications 대시보드는 애플리케이션 태그를 사용하여 선택한 애플리케이션에 대한 결합된 metrics 뷰를 제공하며, 여러 AWS 서비스의 비용 및 사용량, 보안, 운영 metrics 및 인사이트를 포함합니다. myApplications는 기존 태그를 사용하여 리소스를 자동으로 추가하는 것을 지원합니다. 기존 태그를 사용하여 리소스를 자동으로 추가하고, 시간이 지남에 따라 리소스에서 선택한 태그를 추가하거나 제거할 때 애플리케이션을 업데이트할 수 있습니다.

myApplications 대시보드를 통해 관련 서비스에서 특정 리소스에 대해 더 깊이 파고들어 조치를 취할 수 있습니다. 예를 들어 애플리케이션 성능을 위한 [Amazon CloudWatch](https://aws.amazon.com/cloudwatch), 비용 및 사용량을 위한 [AWS Cost Explorer](https://aws.amazon.com/aws-cost-management/aws-cost-explorer/), 보안 결과를 위한 [AWS Security Hub](https://aws.amazon.com/security-hub/) 등이 있습니다.

#### **비용 및 사용량 위젯**

고객은 애플리케이션 리소스의 비용을 예측하고 비용을 최적화하는 것이 어렵다고 느끼는 경우가 많습니다. 애플리케이션 리소스 비용을 파악하려면, 한눈에 지출을 모니터링하고 애플리케이션의 현재 및 예측 월간 비용을 확인할 수 있습니다. 비용 추세를 자세히 살펴보고 클릭하여 AWS에서 애플리케이션 비용을 최적화하는 조치를 취할 수 있습니다.

비용 및 사용량 위젯은 AWS Cost Explorer에서 AWS 리소스의 비용을 시각화하며, 애플리케이션의 현재 및 예측 월말 비용, 상위 5개 청구 서비스, 월별 애플리케이션 리소스 비용 추세 차트를 포함합니다. 지출을 모니터링하고, 이상 징후를 찾고, 절감 기회를 발견할 수 있습니다.

AWS Organizations를 활용하고 조직 수준에서 AWS Cost Explorer를 활성화한 고객은 멤버 계정에서 별도로 활성화할 필요가 없습니다. FinOps 전략에 따라 Cost Explorer가 이미 활성화되어 있을 수 있으며, 신규 고객이나 여러 독립 계정을 운영하는 고객의 경우 Cost Explorer를 활성화하는 것이 일반적인 모범 사례이며 Cost Explorer 콘솔을 통해 활성화할 수 있습니다. 이를 통해 개별 리소스 지출을 보는 것이 아니라 애플리케이션의 비용을 이해하는 방법을 제공하여 myApplications 경험을 극대화할 수 있습니다. 자세한 내용은 [Cost Explorer 활성화](https://docs.aws.amazon.com/cost-management/latest/userguide/ce-enable.html)를 참조하세요.

#### **DevOps 위젯**
기업이 핵심 비즈니스 애플리케이션을 구동하기 위해 클라우드 기반 아키텍처를 점점 더 많이 채택함에 따라, 포괄적인 운영 인사이트의 필요성이 매우 중요해지고 있습니다. 이러한 애플리케이션은 복잡하고 분산된 인프라 리소스와 서비스 세트에 의존하는 경우가 많아, IT 팀이 전체 애플리케이션 환경의 상태와 규정 준수에 대한 가시성과 통제력을 유지하기 어렵습니다.

DevOps 위젯은 애플리케이션에 대한 핵심 운영 인사이트의 중앙 집중식 뷰를 제공하여 이 문제를 해결합니다. 이 위젯은 플릿 관리, 규정 준수 및 OpsItems 관리에 대한 중요 정보를 표시하여 팀이 애플리케이션의 전반적인 운영 태세를 빠르게 평가하고 규정 준수와 안정성을 보장하기 위해 필요한 조치를 취할 수 있도록 합니다.

이 위젯의 데이터를 모니터링하면 애플리케이션 인프라의 운영 상태에 대한 귀중한 인사이트를 얻고, 규정 준수 편차를 식별하며, 사용자에게 영향을 미치기 전에 사전에 문제를 해결할 수 있습니다. 이를 통해 팀은 AWS에서 핵심 비즈니스 애플리케이션의 운영 수명 주기를 관리하는 데 더 신속하고 효율적이며 효과적일 수 있습니다.

 Systems Manager에서 제공되는 정보는 노드 관리를 제공하고, Config는 배포된 규칙에 대해 리소스 수준에서 규정 준수 상태를 평가합니다.

노드 관리 정보는 인스턴스가 Systems Manager에 의해 관리되고 있는지, [패치 정책](https://docs.aws.amazon.com/systems-manager/latest/userguide/patch-manager-create-a-patch-policy.html)에 따른 패치 규정 준수 상태, 그리고 리소스와 관련된 OpsItems와 심각도 수준을 식별합니다. Systems Manager로 인스턴스를 관리하려면 세 가지 사전 조건이 충족되어야 합니다. 첫째, SSM 에이전트가 설치되어 있어야 합니다. 둘째, [SSM 에이전트](https://docs.aws.amazon.com/systems-manager/latest/userguide/ssm-agent.html)가 사용자를 대신하여 노드에서 작업을 수행하는 데 필요한 권한이 있어야 합니다. [호스트 관리](https://docs.aws.amazon.com/systems-manager/latest/userguide/quick-setup-host-management.html)를 통한 [Quick Setup](https://docs.aws.amazon.com/systems-manager/latest/userguide/systems-manager-quick-setup.html)을 사용하거나, [Default Host Management(DHMC)](https://docs.aws.amazon.com/systems-manager/latest/userguide/quick-setup-default-host-management-configuration.html)를 사용하거나, 리소스를 배포할 때 IaC를 통해 필요한 IAM 역할과 권한을 추가할 수 있습니다. 마지막으로, SSM 에이전트가 인터넷 또는 [VPC 엔드포인트](https://docs.aws.amazon.com/systems-manager/latest/userguide/setup-create-vpc.html)를 통해 서비스 엔드포인트에 네트워크 연결이 가능해야 합니다.

Systems Manager의 [Patch Manager](https://docs.aws.amazon.com/systems-manager/latest/userguide/patch-manager-installing-patches.html)는 인스턴스 패치에 대한 특정 기준을 정의할 수 있는 패치 베이스라인을 사용합니다. 패치 정책을 사용하여 AWS Organization과 리전 전체에 패치를 확장할 수도 있습니다. [Systems Manager OpsCenter](https://docs.aws.amazon.com/systems-manager/latest/userguide/OpsCenter.html)의 운영 데이터도 확인할 수 있습니다. OpsCenter는 조사 및 해결이 필요한 운영 문제나 중단과 관련된 OpsItems를 생성합니다. Amazon CloudWatch와 같은 다른 AWS 서비스와 통합되는 OpsItems를 생성할 수 있습니다. 예를 들어 EC2 인스턴스가 CPU 사용률에 도달하는 경우나 Security Hub 결과에 대한 OpsItem을 생성할 수 있습니다.

다른 구성 요소는 계정 내에 배포된 규칙에 대한 리소스의 규정 준수 상태 관련 Config 데이터입니다. 첫째, 위젯은 계정에서 얼마나 많은 규칙이 규정을 준수하고 비준수 리소스가 없는지를 기반으로 규칙 규정 준수 상태의 집계된 백분율을 표시합니다. 둘째, 위젯은 애플리케이션 리소스가 선택된 규칙을 준수하는지 나타내는 애플리케이션 리소스의 규정 준수 상태 백분율을 제공합니다.

#### **보안 위젯**

AWS 리소스의 보안 결과를 평가하는 보안 팀은 비즈니스 중요도를 파악하고, 다음 단계의 우선순위를 정하며, 해결 경로를 식별하는 데 필요한 애플리케이션 컨텍스트를 조합하는 데 시간이 필요합니다. 애플리케이션의 보안 태세를 개선하려면, AWS 기반 애플리케이션의 보안 태세에 대한 가시성을 더 빠르게 확보할 수 있습니다. 개발자, 보안 팀, 애플리케이션 팀은 보안 위험을 식별하고 애플리케이션 중요도에 따라 문제의 우선순위를 빠르게 정할 수 있습니다.

 보안 위젯은 해당 애플리케이션을 구성하는 리소스에 대한 AWS Security Hub의 정보를 표시합니다. AWS Security Hub는 AWS 리소스에 대한 자동화된 지속적인 보안 모범 사례 검사를 통해 보안 운영을 간소화하여 잘못된 구성을 식별하는 데 도움이 되는 클라우드 보안 태세 관리(CSPM) 서비스입니다. Security Hub는 보안 알림(즉, 결과)을 표준화된 형식으로 집계하고 우선순위를 지정하여 더 쉽게 보강, 조사, 해결할 수 있도록 합니다.

Security Hub는 AWS 계정, 워크로드, 리소스의 보안 관리 및 개선의 복잡성과 노력을 줄여줍니다. 모든 계정과 리전에서 Security Hub를 활성화할 수 있습니다.

**컴퓨팅 위젯**

많은 기업은 핵심 비즈니스 운영을 지원하기 위해 AWS에서 복잡하고 분산된 대규모 애플리케이션 포트폴리오를 운영합니다. 이러한 애플리케이션은 필요한 성능과 확장성을 제공하기 위해 EC2 인스턴스와 Lambda 함수를 포함한 다양한 컴퓨팅 리소스에 의존합니다. 그러나 이러한 모든 애플리케이션의 컴퓨팅 metrics와 사용률에 대한 중앙 집중식 뷰 없이는, IT 팀이 애플리케이션 인프라의 상태와 용량을 효과적으로 모니터링하는 것이 매우 어렵습니다.

AWS는 애플리케이션의 적정 크기 조정 기회를 식별하기 위해 AWS Compute Optimizer를 사용할 것을 권장합니다. AWS Compute Optimizer는 vCPU, 메모리 또는 스토리지와 같은 사양과 최근 14일(기본 기간)에서 최대 93일 동안의 실행 중인 리소스의 CloudWatch metrics를 분석합니다.

myApplications 대시보드의 컴퓨팅 위젯은 각 애플리케이션을 구동하는 컴퓨팅 리소스에 대한 통합된 한눈에 볼 수 있는 관점을 제공하여 이 요구를 해결합니다. 이 위젯은 총 알람 수, 다양한 컴퓨팅 리소스 유형, EC2 인스턴스 CPU 사용률 및 Lambda 호출과 같은 성능 추세 등 구성한 컴퓨팅 리소스에 대한 핵심 정보와 metrics를 표시합니다. 이 위젯의 데이터를 모니터링하면 애플리케이션 컴퓨팅 인프라의 운영 상태와 용량에 대한 귀중한 인사이트를 얻을 수 있습니다. 이를 통해 IT 팀은 전반적인 컴퓨팅 용량을 빠르게 평가하고, 성능 병목 현상을 식별하며, 필요에 따라 리소스를 사전에 확장하여 애플리케이션이 항상 가용하고 최고 효율로 운영될 수 있도록 합니다.

#### **모니터링 및 운영 위젯**

모니터링 및 운영 위젯은 애플리케이션과 관련된 리소스의 알람 및 카나리아 알람, 애플리케이션 서비스 수준 지표(SLI)와 metrics, 기타 사용 가능한 AWS CloudWatch Application Signals metrics를 표시합니다.

알람은 프로브, 모니터의 상태 또는 주어진 임계값을 초과하거나 미달하는 값의 변화를 나타냅니다. 알람을 생성할 때 고려해야 할 몇 가지 사항이 있습니다: 1/ 항상 목표에서 역방향으로 작업하세요(조치 가능한 것에 대해 알림을 보내세요), 2/ 알람이 알림을 보내거나 자동화된 프로세스를 트리거할 필요가 없다면, 알림을 설정할 필요가 없습니다.

[Amazon CloudWatch Application Signals](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-Application-Monitoring-Sections.html)는 AWS에서 애플리케이션을 계측하여 애플리케이션의 상태를 모니터링하고 비즈니스 목표에 대한 성능을 추적하며, 애플리케이션, 서비스, 종속성에 대한 뷰를 제공하고 애플리케이션 상태를 모니터링하고 분류하는 데 도움을 줍니다.

CloudWatch Synthetics 모니터링([카나리아](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch_Synthetics_Canaries.html))은 Application Signals와 통합됩니다. 카나리아는 애플리케이션 최종 사용자와 동일한 경로를 따르고 동일한 작업을 수행하는 예약된 합성 동작을 사용하여 엔드포인트와 API를 모니터링할 수 있는 강력한 기능입니다. 최종 사용자보다 먼저 문제를 발견하고 고객 경험을 지속적으로 평가할 수 있습니다.

Observability를 처음 접하거나 metrics, 알람을 설정하거나 Observability 전략을 개발하는 방법에 대한 지침이 필요한 경우, [AWS Observability Best Practices](/)에서 Observability의 다양한 구성 요소를 이해하고 어떤 metrics, 알람 등이 모니터링에 유용한지 시작하는 방법을 설명합니다.

*참고: 컨테이너 기반 애플리케이션을 운영하는 고객의 경우, 클러스터, 작업 등에 태그를 지정하려면 비 EC2 리소스에 대해 수동으로 태그를 지정해야 합니다.*

### 전략에서 실행까지

1. 애플리케이션 이름, 환경, 비즈니스 단위, 비용 센터에 초점을 맞춘 포괄적인 태깅 전략을 개발하는 것으로 시작하세요. [태깅 전략 구축](https://docs.aws.amazon.com/whitepapers/latest/tagging-best-practices/building-your-tagging-strategy.html)
2. 이러한 태그를 모든 관련 리소스에 체계적으로 적용하여 프로비저닝 프로세스의 일부로 만드세요. AWS Resource Groups & Tag Editor를 사용하여 태그를 기반으로 리소스를 생성, 관리, 검색할 수 있습니다. 계정 수준에서 여러 AWS 서비스의 태그를 관리하는 중앙 집중식 방법을 제공합니다. [Resource Groups and Tagging for AWS](https://aws.amazon.com/blogs/aws/resource-groups-and-tagging/)
3. 이러한 태그를 기반으로 리소스 그룹을 생성합니다. 예를 들어 모든 프로덕션 POS 시스템 리소스를 함께 그룹화합니다. AWS Service Catalog AppRegistry를 사용하여 POS 및 재고 관리와 같은 시스템의 모든 구성 요소와 상호 의존성을 포함하는 애플리케이션을 공식적으로 정의합니다. [AWS Service Catalog AppRegistry의 핵심 개념](https://docs.aws.amazon.com/servicecatalog/latest/arguide/overview-appreg.html#ar-user-tags)
4. myApplications 대시보드를 활용하여 소매 애플리케이션의 통합된 뷰를 확보하고, 사이버 위크 세일과 같은 중요 이벤트 동안 핵심 metrics를 모니터링합니다. 애플리케이션 생성 마법사를 사용하면 콘솔의 단일 뷰에서 AWS 계정의 리소스를 연결하여 애플리케이션을 더 쉽게 생성할 수 있습니다. 생성된 애플리케이션은 myApplications에 자동으로 표시되며, 애플리케이션에 대한 조치를 취할 수 있습니다. [AWS Management Console의 myApplications로 애플리케이션 리소스 관리 간소화](https://aws.amazon.com/blogs/aws/new-myapplications-in-the-aws-management-console-simplifies-managing-your-application-resources/)

### **추가 읽기 자료:**

* [태깅 스키마 정의 및 게시](https://docs.aws.amazon.com/whitepapers/latest/tagging-best-practices/defining-and-publishing-a-tagging-schema.html)
* [AWS 리소스 태깅 모범 사례](https://docs.aws.amazon.com/whitepapers/latest/tagging-best-practices/tagging-best-practices.html)
* [자동화된 중앙 집중식 태깅 제어 구현](https://aws.amazon.com/blogs/mt/implementing-automated-and-centralized-tagging-controls-with-aws-config-and-aws-organizations/)


### 결론

고객 비즈니스가 클라우드에서 계속 성장하고 발전함에 따라, 리소스 관리에 대한 이러한 모범 사례를 채택하는 것은 필수적입니다. 기반을 구축함으로써 조직은 현재의 요구를 충족할 뿐만 아니라 미래의 성장과 혁신을 위한 준비도 할 수 있습니다. AWS 애플리케이션 운영과 myApplications는 이 접근 방식을 한 단계 더 발전시켜, 애플리케이션 리소스와 metrics에 대한 통합된 뷰를 제공합니다. 이를 통해 팀은 빠르게 정보에 기반한 의사 결정을 내리고, 문제에 사전 대응하며, 대규모로 리소스를 더 효과적으로 관리할 수 있습니다.

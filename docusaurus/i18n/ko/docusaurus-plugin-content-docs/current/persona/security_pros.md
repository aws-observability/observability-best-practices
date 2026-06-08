# 보안 전문가

조직의 보안 전문가들은 다양한 역할과 책임에 걸쳐 운영되며, 각각 클라우드 인프라, 애플리케이션 및 리소스를 효과적으로 보호하기 위한 다양한 기술 세트와 도구가 필요합니다. 견고한 클라우드 보안 프레임워크를 설계하는 보안 아키텍트부터 위협을 [모니터링하고 대응](https://aws.amazon.com/cloudops/monitoring-and-observability/)하는 보안 운영 팀까지, AWS를 통한 보안 여정은 역할별 모범 사례와 도구를 요구합니다.

이 가이드는 핵심 보안 페르소나에 맞춘 보안 접근 방식을 제시합니다: 보안 아키텍트는 [AWS Well-Architected Framework](https://aws.amazon.com/architecture/well-architected/)의 보안 축 구현과 안전한 랜딩 존 설계에 집중하고, 보안 운영 팀은 위협 감지 및 대응을 위해 AWS Security Hub와 Amazon GuardDuty를 활용하며, 컴플라이언스 관리자는 규제 표준 유지를 위해 AWS Audit Manager와 AWS Config를 활용하고, 보안 엔지니어는 AWS IAM, AWS KMS, AWS Network Firewall과 같은 서비스를 사용하여 인프라 보안을 구현합니다.

이러한 페르소나별 요구사항을 이해하면 조직이 AWS 환경 전반에서 강력한 보안 태세를 유지하면서 각 보안 역할의 고유한 도전과 책임을 해결하는 포괄적인 보안 프로그램을 구축하는 데 도움이 됩니다.

## 안전한 코딩 실무 및 보안 개발 라이프사이클

AWS는 "설계에 의한 보안" 원칙을 통해 소프트웨어 개발의 기본 요소로서 보안을 강조합니다. 개발 라이프사이클 전반에 걸쳐 보안 제어와 컴플라이언스 요구사항을 통합하는 [안전한 코딩 실무](https://aws-observability.github.io/observability-best-practices/persona/developer)를 구현할 수 있습니다. 이러한 실무는 OWASP Top 10과 같은 산업 표준에 부합하며 애플리케이션 라이프사이클 전반에 걸쳐 강력한 보안 태세를 유지하는 데 도움이 됩니다.

- 일관되고 버전 관리되는 보안 구성을 보장하기 위해 IaC(Infrastructure as Code)를 구현하고, 통합 보안 스캐닝이 있는 AWS CodeBuild를 사용하며, 자동화된 보안 테스트를 위해 AWS CodePipeline을 배포합니다.

- [AWS 공동 책임 모델](https://aws.amazon.com/compliance/shared-responsibility-model/)은 보안 책임을 이해하는 데 안내하며, Amazon CodeGuru Reviewer와 같은 서비스는 보안 취약점을 자동으로 식별하고 해결 단계를 제안합니다.

- AWS는 설계 및 개발부터 테스트, 배포, 유지보수까지 모든 단계에 걸쳐 보안 제어를 구현할 것을 권장합니다. 주요 실무에는 안전한 자격 증명 처리를 위한 AWS Secrets Manager 사용, 애플리케이션 보호를 위한 AWS WAF 구현, 지속적인 보안 평가를 위한 Amazon Inspector 활용이 포함됩니다.

## ID 및 액세스 관리 모범 사례

AWS는 최소 권한 원칙을 ID 및 액세스 관리(IAM) 전략의 초석으로 구현할 것을 권장합니다. 일상적인 클라우드 운영에 루트 계정을 사용하는 대신 개별 IAM 사용자를 생성하고, 강력한 암호 정책을 구현하며, 자격 증명을 정기적으로 교체해야 합니다. AWS는 권한이 있는 사용자와 루트 계정, 특히 민감한 작업에 대해 다중 인증(MFA) 사용을 검증합니다.

- AWS Organizations를 사용하면 여러 계정을 중앙에서 관리하고 거버넌스할 수 있으며, 서비스 제어 정책(SCP)과 리소스 제어 정책(RCP)을 사용하여 조직 전체의 권한에 대한 가드레일을 설정할 수 있습니다. 세분화된 액세스 제어를 위해 IAM 태그를 사용한 속성 기반 액세스 제어(ABAC)를 사용하여 유지해야 할 정책 수를 줄일 수 있습니다.

- AWS IAM Identity Center(이전 AWS Single Sign-On)를 사용하여 AWS 계정 및 비즈니스 애플리케이션 전반의 액세스를 중앙에서 관리함으로써 액세스 관리를 간소화할 수 있습니다.

- AWS IAM Access Analyzer를 사용한 정기적인 액세스 검토는 사용되지 않는 권한을 식별하고 제거하는 데 도움이 되며, AWS CloudTrail은 보안 분석 및 컴플라이언스 감사를 위한 상세한 API 활동 로깅을 제공합니다.

이러한 실무는 AWS Well-Architected Framework의 [보안 축](https://docs.aws.amazon.com/wellarchitected/latest/security-pillar/welcome.html)에 부합하며 대규모로 ID를 관리하면서 강력한 보안 태세를 유지하는 데 도움이 됩니다.

## 데이터 암호화 및 보호 지침

AWS는 저장 중 및 전송 중 암호화를 강조하는 심층 방어 접근 방식을 통해 포괄적인 데이터 보호 기능을 제공합니다.

- AWS Key Management Service(AWS KMS)를 사용하여 암호화 키를 생성하고 제어함으로써 저장 중 데이터를 보호할 수 있으며, AWS Certificate Manager(ACM)는 TLS 인증서로 전송 중 데이터를 보호하는 데 도움이 됩니다.

- Amazon S3 데이터의 경우 AWS KMS 키(SSE-KMS), S3 관리 키(SSE-S3) 또는 고객 제공 키(SSE-C)를 사용하여 서버 측 암호화를 구현할 수 있습니다. AWS는 컴플라이언스 요구사항에 따라 AWS 관리 키 또는 고객 관리 키를 사용하여 Amazon EBS 볼륨, RDS 인스턴스 및 DynamoDB 테이블을 기본적으로 암호화할 것을 권장합니다.

- 데이터 주권을 유지하기 위해 하드웨어 기반 키 스토리지에 AWS CloudHSM을, 민감한 데이터를 자동으로 검색하고 보호하기 위해 AWS Macie를 사용할 수 있습니다. 데이터 전송 시 AWS PrivateLink는 공용 인터넷을 사용하지 않고 AWS 서비스에 대한 안전한 연결을 제공하며, AWS Transfer Family는 SFTP, FTPS, FTP 프로토콜을 사용한 안전한 파일 전송을 보장합니다.

- 또한 Amazon S3 Object Lock 및 버전 관리를 구현하면 우발적 또는 악의적 삭제로부터 보호하는 데 도움이 되며, AWS Backup은 AWS 리소스 전체에 걸쳐 암호화된 백업을 생성합니다. 이러한 암호화 메커니즘은 HIPAA, PCI DSS, GDPR과 같은 컴플라이언스 표준에 부합합니다.

## 컴플라이언스 및 리스크 관리 프레임워크

AWS는 글로벌 표준 및 규정에 부합하면서 고객의 자체 컴플라이언스 여정을 위한 도구와 리소스를 제공하는 견고한 컴플라이언스 및 리스크 관리 프로그램을 유지합니다. AWS 컴플라이언스 프로그램은 ISO 27001, SOC 보고서, PCI DSS와 같은 제3자 감사, 인증 및 증명을 통해 AWS가 구현하는 포괄적인 제어를 이해하는 데 도움이 됩니다.

- AWS Audit Manager를 사용하여 산업 표준 및 내부 정책에 대한 AWS 사용을 지속적으로 평가할 수 있으며, AWS Config는 상세한 리소스 구성 추적 및 컴플라이언스 모니터링을 제공합니다.

- 규제 산업의 경우 AWS Control Tower는 AWS 모범 사례에 기반한 가드레일을 사용하여 안전하고 규정을 준수하는 다중 계정 환경을 구축하고 유지하는 데 도움이 됩니다.

- AWS Security Hub는 계정 전체에 걸쳐 보안 발견 사항과 컴플라이언스 검사를 중앙 집중화하며, 자동화된 보안 평가를 위한 Amazon Inspector 및 위협 감지를 위한 Amazon GuardDuty와 같은 서비스와 통합됩니다.

- AWS Artifact는 보안 및 컴플라이언스 보고서에 대한 온디맨드 액세스를 제공하여 감사자에게 컴플라이언스를 증명할 수 있습니다. AWS 리스크 및 컴플라이언스 백서는 AWS 공동 책임 모델을 설명하여 AWS가 관리하는 컴플라이언스 요구사항과 고객 책임에 남는 요구사항을 이해하는 데 도움이 됩니다.

이러한 도구와 프레임워크는 HIPAA, GDPR, FedRAMP 및 지역 데이터 보호법을 포함한 다양한 규제 요구사항을 지원합니다.

## 취약점 관리 및 침투 테스트 전략

AWS는 자동화된 도구와 수동 평가 기능을 결합한 체계적 접근 방식을 통해 포괄적인 취약점 관리 및 침투 테스트를 지원합니다.

- Amazon EC2 인스턴스, NAT Gateway, Elastic Load Balancer를 포함한 8개 특정 서비스에 대해 사전 승인 없이 AWS 인프라에 대한 허용된 침투 테스트를 수행할 수 있습니다. AWS Inspector는 취약점 및 보안 모범 사례 이탈에 대해 애플리케이션을 자동으로 평가하며, Amazon GuardDuty는 위협 및 무단 행동을 감지하기 위한 지속적인 보안 모니터링을 제공합니다.

- 컨테이너 보안의 경우 Amazon ECR 스캐닝은 컨테이너 이미지의 취약점을 식별하는 데 도움이 되며, AWS Systems Manager Patch Manager는 AWS 리소스 전반의 패치 관리 프로세스를 자동화합니다. AWS Security Hub를 사용하여 여러 AWS 서비스 및 파트너 도구의 보안 발견 사항을 집계하고 우선순위화하여 보안 태세를 강화할 수 있습니다. 또한 잠재적 보안 문제에 대한 심층 조사를 위해 Amazon Detective 구현을 권장합니다.

- 웹 애플리케이션의 경우 AWS WAF는 일반적인 악용 기법으로부터 보호하는 데 도움이 되며, AWS Shield는 DDoS 보호를 제공합니다. AWS Marketplace는 AWS 환경과 통합되는 취약점 스캐닝 및 침투 테스트를 위한 추가 서드파티 보안 도구를 제공합니다.

정기적인 보안 평가는 잠재적 취약점을 식별하면서 컴플라이언스를 유지하기 위해 AWS 이용 약관 및 보안 테스트 지침을 따라야 합니다.

## 인시던트 대응 및 위협 탐지 기술

AWS는 통합 보안 서비스와 자동화 기능을 통해 인시던트 대응 및 사전 위협 탐지를 위한 포괄적 프레임워크를 제공합니다.

- 보안 알림의 중앙 관제 센터로 AWS Security Hub를 구현할 수 있으며, Amazon GuardDuty는 머신러닝을 사용하여 AWS 계정 및 워크로드 전반에 걸쳐 지속적인 위협 감지를 수행합니다.

- 인시던트 대응 자동화를 위해 사전 정의된 대응 계획과 자동화된 런북으로 보안 인시던트를 관리, 해결 및 분석하기 위해 AWS Systems Manager Incident Manager를 사용할 수 있습니다.

- Amazon Detective는 잠재적 보안 문제의 근본 원인을 식별하기 위해 보안 데이터를 분석하고 시각화하는 데 도움이 되며, AWS CloudWatch Logs Insights는 위협 탐지를 위한 실시간 로그 분석을 가능하게 합니다.

- AWS CloudTrail Lake 기능을 사용하면 포렌식 조사를 위해 API 활동 기록 전반에 걸쳐 SQL 기반 쿼리를 실행할 수 있습니다.

- 보안 이벤트에 대한 자동 대응을 위해 Amazon EventBridge를, 서버리스 인시던트 복구를 위해 AWS Lambda를 구현하여 보안 태세를 강화할 수 있습니다. AWS는 네트워크 트래픽 분석을 위해 [VPC Flow Logs를 통한 네트워크 Observability](https://aws-observability.github.io/observability-best-practices/patterns/vpcflowlogs)와 DNS 쿼리 로깅을 구축할 것을 권장하며, AWS Config는 컴플라이언스 분석 및 인시던트 조사를 위한 리소스 구성을 기록합니다.

이러한 기능은 Amazon Kinesis Data Firehose를 통해 기존 SIEM(보안 정보 및 이벤트 관리) 솔루션과 통합되어 중앙 집중식 보안 모니터링 및 자동화된 인시던트 대응 워크플로우를 가능하게 합니다.

## 결론

조직의 보안 페르소나를 지원하는 이러한 보안 서비스, 도구 및 실무를 구현함으로써 고객은 보안 팀이 더 효과적으로 작업할 수 있도록 역량을 강화하면서 AWS 워크로드를 더 잘 보호할 수 있습니다. 조직의 핵심 보안 페르소나를 식별한 다음 해당 책임을 적절한 AWS 서비스 및 도구에 매핑하는 것부터 시작하세요. 클라우드 환경이 발전함에 따라 이러한 역할 기반 보안 실무를 정기적으로 검토하고 업데이트하는 것을 잊지 마세요. AWS Security Hub와 AWS Organizations를 사용하여 계정 전체의 가시성을 유지하고 페르소나 요구사항에 기반한 보안 검사를 자동화할 수 있습니다. 보안 모범 사례 구현에 대한 추가 안내를 위해 조직의 요구에 맞춘 포괄적인 보안 전략을 설계하는 데 도움을 줄 수 있는 AWS 계정 팀과 연결하세요.

# Amazon Managed Grafana

[Amazon Managed Grafana][amg-main]는 오픈 소스 Grafana를 기반으로 한 완전 관리형 서비스로,
서버를 프로비저닝하거나 소프트웨어를 구성 및 업데이트하거나 프로덕션 환경에서 Grafana를
보호하고 확장하는 복잡한 작업 없이 메트릭, 로그, 트레이스를 분석할 수 있습니다.
여러 데이터 소스에 연결하여 팀과 함께 Observability 대시보드를 생성, 탐색 및 공유할 수 있습니다.
Amazon Managed Grafana를 사용하면 인프라 관리 부담 없이 강력한 시각화 및 분석 환경을 구축할 수 있습니다.

다음 레시피를 확인하세요:

## 기본 사항

- [시작하기][amg-gettingstarted]
- [Terraform을 활용한 자동화][amg-tf-automation]

## 인증 및 접근 제어

- [Identity Provider와의 직접 SAML 통합][amg-saml]
- [SSO를 위한 Identity Provider(OneLogin, Ping Identity, Okta, Azure AD) 통합][amg-idps]
- [SAMLv2를 통한 Google 인증 통합][amg-google-idps]
- [고객 관리형 IAM 역할을 사용한 Amazon Managed Grafana 교차 계정 데이터 소스 설정][amg-cross-account-access]
- [Grafana Teams를 사용한 Amazon Managed Grafana의 세분화된 접근 제어][amg-grafana-teams]

## 데이터 소스 및 시각화

- [Amazon Managed Grafana에서 Athena 사용하기][amg-plugin-athena]
- [Amazon Managed Grafana에서 Redshift 사용하기][amg-plugin-redshift]
- [Amazon Managed Service for Prometheus 및 Amazon Managed Grafana로 statsd 커스텀 메트릭 보기][amg-amp-statsd]
- [고객 관리형 IAM 역할을 사용한 교차 계정 데이터 소스 설정][amg-xacc-ds]

## 기타
- [하이브리드 환경 모니터링][amg-hybridenvs]
- [규제 대상 멀티 테넌트 환경에서 Grafana 및 Loki 관리][grafana-loki-regenv]
- [Amazon Managed Service for Prometheus 및 Amazon Managed Grafana를 사용한 Amazon EKS Anywhere 모니터링][amg-anywhere-monitoring]
- [시작하기 워크숍][amg-oow]
- [서브넷 여유 IP 모니터링][amg-subnet-free-ip-monitoring]


[amg-main]: https://aws.amazon.com/grafana/
[amg-gettingstarted]: https://aws.amazon.com/blogs/mt/amazon-managed-grafana-getting-started/
[amg-saml]: https://aws.amazon.com/blogs/mt/amazon-managed-grafana-supports-direct-saml-integration-with-identity-providers/
[amg-idps]: https://aws.amazon.com/blogs/opensource/integrating-identity-providers-such-as-onelogin-ping-identity-okta-and-azure-ad-to-sso-into-aws-managed-service-for-grafana/
[amg-google-idps]: recipes/amg-google-auth-saml.md
[amg-hybridenvs]: https://aws.amazon.com/blogs/mt/monitoring-hybrid-environments-using-amazon-managed-service-for-grafana/
[amg-xacc-ds]: https://aws.amazon.com/blogs/opensource/setting-up-amazon-managed-grafana-cross-account-data-source-using-customer-managed-iam-roles/
[grafana-loki-regenv]: https://aws.amazon.com/blogs/opensource/how-to-manage-grafana-and-loki-in-a-regulated-multitenant-environment/
[amg-oow]: https://observability.workshop.aws/en/amg.html
[amg-tf-automation]: recipes/amg-automation-tf.md
[amg-plugin-athena]: recipes/amg-athena-plugin.md
[amg-plugin-redshift]: recipes/amg-redshift-plugin.md
[amg-cross-account-access]: https://aws.amazon.com/blogs/opensource/setting-up-amazon-managed-grafana-cross-account-data-source-using-customer-managed-iam-roles/
[amg-anywhere-monitoring]: https://aws.amazon.com/blogs/containers/monitoring-amazon-eks-anywhere-using-amazon-managed-service-for-prometheus-and-amazon-managed-grafana/
[amg-amp-statsd]: https://aws.amazon.com/blogs/mt/viewing-custom-metrics-from-statsd-with-amazon-managed-service-for-prometheus-and-amazon-managed-grafana/
[amg-grafana-teams]: https://aws.amazon.com/blogs/mt/fine-grained-access-control-in-amazon-managed-grafana-using-grafana-teams/
[amg-subnet-free-ip-monitoring]: https://aws-observability.github.io/observability-best-practices/recipes/recipes/amg-subnet-free-ip-monitoring/


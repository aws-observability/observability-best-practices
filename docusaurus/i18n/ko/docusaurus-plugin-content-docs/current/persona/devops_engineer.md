# DevOps

DevOps 엔지니어로서, 워크플로우에 강력한 Observability 실무를 통합하는 것은 고성능, 안정적, 보안이 확보된 시스템을 유지하는 데 매우 중요합니다. 이 가이드는 DevOps 관점에 맞춘 Observability 모범 사례를 제공하며, 지속적 전달 라이프사이클과 인프라 관리 프로세스 전반에 걸친 실용적 구현에 초점을 맞춥니다.

## CI/CD(지속적 통합 및 전달) 파이프라인

Observability로 CI/CD 파이프라인을 최적화하려면:

- [파이프라인](https://docs.aws.amazon.com/codepipeline/latest/userguide/monitoring.html), [빌드](https://docs.aws.amazon.com/codebuild/latest/userguide/monitoring-builds.html), [배포](https://docs.aws.amazon.com/codedeploy/latest/userguide/monitoring.html)에 대한 모니터링을 구현하여 CI/CD의 안정성, 가용성 및 성능을 유지합니다.

- 중요 CI/CD 이벤트에 대한 [CloudWatch 알람](/tools/alarms)을 생성합니다. Amazon SNS를 통해 파이프라인 실패 또는 장기 실행 단계에 대한 팀 알림을 설정합니다.
     * [CodeBuild에서 CloudWatch 알람 구성](https://docs.aws.amazon.com/codebuild/latest/userguide/codebuild_cloudwatch_alarms.html)
     * [CodeDeploy에서 CloudWatch 알람 구성](https://docs.aws.amazon.com/codedeploy/latest/userguide/monitoring-create-alarms.html)

- [AWS X-Ray](/tools/xray/)를 사용하여 CI/CD 파이프라인 단계 전반의 요청을 추적하도록 파이프라인을 계측합니다.

- 주요 메트릭을 추적하기 위한 통합 [CloudWatch 대시보드](/tools/dashboards)를 생성합니다: [CodeBuild](https://docs.aws.amazon.com/codebuild/latest/userguide/monitoring-metrics.html), [CodeDeploy](https://docs.aws.amazon.com/codedeploy/latest/userguide/monitoring-cloudwatch.html), [Pipelines](https://docs.aws.amazon.com/codepipeline/latest/userguide/metrics-dimensions.html).

## IaC(Infrastructure as Code) 실무

IaC 워크플로우에서 효과적인 Observability를 위해:

- [AWS CloudFormation](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/AWS_CloudWatch.html) 템플릿에 [CloudWatch 알람](/tools/alarms)과 [대시보드](/tools/cloudwatch-dashboard)를 포함합니다. 이를 통해 모든 환경에서 일관된 모니터링을 보장합니다.

- 중앙 집중식 로깅 구현: Amazon CloudWatch Logs 또는 [Amazon OpenSearch Service](/recipes/aes)를 사용하여 [중앙 집중식 로깅 솔루션](/patterns/multiaccount)을 설정합니다. IaC 템플릿에서 로그 보존 정책과 로그 그룹을 정의합니다.

- 보안 및 성능 분석을 위한 네트워크 트래픽 정보를 캡처하도록 IaC를 사용하여 [VPC 플로우 로그](/patterns/vpcflowlogs)를 구성합니다.

- [IaC 템플릿](https://docs.aws.amazon.com/whitepapers/latest/tagging-best-practices/implementing-and-enforcing-tagging.html#cicd-pipeline-managed-resources)에서 일관된 태깅 전략을 사용하여 더 나은 리소스 구성과 세분화된 모니터링 및 비용 할당을 가능하게 합니다.

- [AWS X-Ray](https://docs.aws.amazon.com/xray/latest/devguide/creating-resources-with-cloudformation.html)를 사용하고 애플리케이션 코드와 통합하여 분산 트레이싱을 활성화합니다. IaC 템플릿에서 X-Ray 샘플링 규칙과 그룹을 정의합니다.

## Kubernetes를 이용한 컨테이너화 및 오케스트레이션

컨테이너화된 애플리케이션 및 Kubernetes 환경:

- 종합적인 컨테이너 및 클러스터 모니터링을 위해 [Amazon EKS with Container Insights](/guides/containers/aws-native/eks/amazon-cloudwatch-container-insights)를 구현합니다.

- 컨테이너화된 애플리케이션에서 텔레메트리 데이터를 수집하고 내보내기 위해 [AWS Distro for OpenTelemetry](/guides/operational/adot-at-scale/operating-adot-collector)를 사용합니다.

- 고급 메트릭 수집 및 시각화를 위해 EKS에서 [Prometheus 및 Grafana](/patterns/eksampamg)를 구현합니다. 더 쉬운 설정 및 관리를 위해 AWS Managed Grafana 서비스를 사용합니다.

- Kubernetes 배포를 위해 Flux 또는 ArgoCD와 같은 도구를 사용하여 [GitOps](/guides/operational/gitops-with-amg/#introduction-to-gitops) 실무를 구현합니다. 이러한 도구를 CloudWatch와 통합하여 GitOps 워크플로우의 동기화 상태와 건강을 모니터링합니다.

## CI/CD 파이프라인에서의 보안 및 컴플라이언스

파이프라인에서 보안 Observability를 강화하려면:

- 자동화된 취약점 평가를 위해 CI/CD 프로세스에 [Amazon Inspector](https://aws.amazon.com/inspector/)를 통합합니다.

- AWS 계정 전체에서 보안 알림을 집계하고 우선순위화하기 위해 [AWS Security Hub](https://aws.amazon.com/security-hub/)를 구현합니다.

- 리소스 구성 및 변경을 추적하기 위해 [AWS Config](https://docs.aws.amazon.com/config/latest/developerguide/aws-config-managed-rules-cloudformation-templates.html)를 사용합니다. 정의된 표준과의 준수를 자동으로 평가하기 위한 Config 규칙을 설정합니다.

- 지능형 위협 감지를 위해 [Amazon GuardDuty](https://aws.amazon.com/blogs/aws/introducing-amazon-guardduty-extended-threat-detection-aiml-attack-sequence-identification-for-enhanced-cloud-security/)를 활용하고, 인시던트 대응 워크플로우와 결과를 통합합니다.

- CloudFormation 또는 Terraform을 사용하여 AWS WAF 규칙, Security Hub 제어, GuardDuty 필터를 정의하여 보안을 코드로 구현합니다. 이를 통해 보안 Observability가 인프라와 함께 발전합니다.

## 자동화된 테스트 및 품질 보증 전략

Observability로 테스트 프로세스를 향상시키려면:

- API와 사용자 여정을 지속적으로 테스트하는 카나리를 생성하기 위해 [CloudWatch Synthetics](https://docs.aws.amazon.com/AmazonSynthetics/latest/APIReference/Welcome.html)를 구현합니다.

- AWS CodeBuild를 사용하여 테스트 스위트를 실행하고 추세 분석을 위한 CloudWatch 메트릭으로 테스트 결과를 게시합니다.

- 테스트 단계에서 성능 인사이트를 얻기 위해 테스트 환경에서 [AWS X-Ray 트레이싱](https://docs.aws.amazon.com/xray/latest/devguide/xray-console-traces.html)을 구현합니다.

- 실제 사용자 상호작용에서 사용자 경험 데이터를 수집하고 분석하기 위해 Amazon CloudWatch [RUM](/tools/rum)(Real User Monitoring)을 활용합니다.

- [AWS Fault Injection Simulator](https://aws.amazon.com/blogs/mt/chaos-engineering-leveraging-aws-fault-injection-simulator-in-a-multi-account-aws-environment/)를 사용하여 카오스 엔지니어링 실무를 구현합니다. 시스템의 [회복력을 향상](https://aws.amazon.com/blogs/aws/monitor-and-improve-your-application-resiliency-with-resilience-hub/)시키기 위해 시뮬레이션된 장애의 영향을 모니터링합니다.

## 릴리스 관리 및 배포 모범 사례

Observability 기반 릴리스 관리를 위해:

- 관리형 배포를 위해 [AWS CodeDeploy](https://docs.aws.amazon.com/codedeploy/latest/userguide/welcome.html)를 사용하고 배포 모니터링을 위한 CloudWatch 통합을 활용합니다.

- 카나리 배포를 수행하여 인프라의 소규모 하위 집합에 새 버전을 점진적으로 롤아웃합니다. 전체 배포 전에 문제를 포착하기 위해 CloudWatch와 X-Ray를 사용하여 [카나리 배포를 면밀히 모니터링](https://aws.amazon.com/blogs/containers/create-a-pipeline-with-canary-deployments-for-amazon-ecs-using-aws-app-mesh/)합니다.

- 사전 정의된 모니터링 임계값이 위반되면 이전 안정 버전으로 [자동 롤백](https://docs.aws.amazon.com/codedeploy/latest/userguide/deployments-rollback-and-redeploy.html)하도록 배포를 구성합니다.

- 실제 사용자 세션에서 성능 데이터를 수집하고 분석하기 위해 Amazon CloudWatch [RUM](/tools/rum)을 사용합니다. 이를 통해 릴리스가 최종 사용자 경험에 미치는 영향에 대한 인사이트를 제공합니다.

- 릴리스 직후 이상 또는 성능 문제에 대해 팀에 알리도록 [CloudWatch 알람](/tools/alarms)을 구성합니다. 적시 알림을 위해 이러한 알람을 Amazon SNS와 통합합니다.

- AI 기반 인사이트 활용: [Amazon DevOps Guru](https://aws.amazon.com/blogs/aws/amazon-devops-guru-machine-learning-powered-service-identifies-application-errors-and-fixes/)를 활용하여 운영 문제를 자동으로 감지하고 릴리스 후 애플리케이션 건강 및 성능 개선을 위한 ML 기반 권장 사항을 받습니다.

- 기능 플래그 관리를 위해 AWS Systems Manager Parameter Store 또는 Secrets Manager를 사용하고, 커스텀 [CloudWatch 메트릭](https://docs.aws.amazon.com/secretsmanager/latest/userguide/monitoring-cloudwatch.html)을 통해 사용량을 모니터링합니다.


## 결론

Observability 실무를 채택하는 것은 단순히 시스템을 유지하는 것이 아닙니다 — 조직에서 운영 우수성을 달성하고 지속적인 혁신을 주도하기 위한 전략적 움직임입니다. 시스템이 발전함에 따라 Observability 전략을 지속적으로 개선하고, 새로운 AWS 기능과 서비스가 제공되면 활용하는 것을 잊지 마세요.

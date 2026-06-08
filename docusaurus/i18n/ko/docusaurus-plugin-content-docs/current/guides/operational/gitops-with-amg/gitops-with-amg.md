# Amazon Managed Grafana에서 GitOps와 Grafana Operator 사용하기

## 이 가이드 사용 방법

이 Observability 모범 사례 가이드는 Amazon EKS 클러스터에서 Kubernetes 오퍼레이터로 [grafana-operator](https://github.com/grafana-operator/grafana-operator#:~:text=The%20grafana%2Doperator%20is%20a,an%20easy%20and%20scalable%20way.)를 사용하여 Kubernetes 네이티브 방식으로 Amazon Managed Grafana에서 Grafana 리소스와 Grafana 대시보드의 수명 주기를 생성하고 관리하는 방법을 이해하고자 하는 개발자와 아키텍트를 위한 것입니다.

## 소개

고객들은 오픈소스 분석 및 모니터링 솔루션을 위한 Observability 플랫폼으로 Grafana를 사용합니다. Amazon EKS에서 워크로드를 실행하는 고객들이 워크로드 중력으로 초점을 전환하고 클라우드 리소스와 같은 외부 리소스의 배포와 수명 주기 관리를 위해 Kubernetes 네이티브 컨트롤러에 의존하려는 것을 확인했습니다. 많은 고객들이 AWS 서비스를 생성, 배포 및 관리하기 위해 [AWS Controllers for Kubernetes (ACK)](https://aws-controllers-k8s.github.io/community/docs/community/overview/)를 설치합니다. 오늘날 많은 고객들은 Prometheus와 Grafana 구현을 관리형 서비스로 오프로드하는 것을 선택하며, AWS의 경우 이 서비스는 워크로드 모니터링을 위한 [Amazon Managed Service for Prometheus](https://docs.aws.amazon.com/prometheus/?icmpid=docs_homepage_mgmtgov)와 [Amazon Managed Grafana](https://docs.aws.amazon.com/grafana/?icmpid=docs_homepage_mgmtgov)입니다.

고객들이 Grafana를 사용할 때 직면하는 한 가지 공통적인 과제는 Kubernetes 클러스터에서 Amazon Managed Grafana와 같은 외부 Grafana 인스턴스의 Grafana 리소스와 Grafana 대시보드의 수명 주기를 생성하고 관리하는 것입니다. 고객들은 Amazon Managed Grafana에서 Grafana 리소스 생성을 포함하여 Git 기반 워크플로우를 사용하여 전체 시스템의 인프라 및 애플리케이션 배포를 완전히 자동화하고 관리하는 방법을 찾는 데 어려움을 겪고 있습니다. 이 Observability 모범 사례 가이드에서는 다음 주제에 초점을 맞춥니다:

* Grafana Operator 소개 - Kubernetes 클러스터에서 외부 Grafana 인스턴스를 관리하는 Kubernetes 오퍼레이터
* GitOps 소개 - Git 기반 워크플로우를 사용하여 인프라를 생성하고 관리하는 자동화 메커니즘
* Amazon EKS에서 Grafana Operator를 사용하여 Amazon Managed Grafana 관리
* Amazon EKS에서 Flux와 함께 GitOps를 사용하여 Amazon Managed Grafana 관리

## Grafana Operator 소개

[grafana-operator](https://github.com/grafana-operator/grafana-operator#:~:text=The%20grafana%2Doperator%20is%20a,an%20easy%20and%20scalable%20way.)는 Kubernetes 내에서 Grafana 인스턴스를 관리하는 데 도움을 주기 위해 구축된 Kubernetes 오퍼레이터입니다. Grafana Operator를 사용하면 여러 인스턴스 간에 Grafana 대시보드, 데이터 소스 등을 쉽고 확장 가능한 방식으로 선언적으로 관리하고 생성할 수 있습니다. Grafana 오퍼레이터는 이제 Amazon Managed Grafana와 같은 외부 환경에서 호스팅되는 대시보드, 데이터 소스 등의 리소스 관리를 지원합니다. 이를 통해 궁극적으로 [Flux](https://fluxcd.io/)와 같은 CNCF 프로젝트를 사용하여 Amazon EKS 클러스터에서 Amazon Managed Grafana의 리소스 수명 주기를 생성하고 관리하는 GitOps 메커니즘을 사용할 수 있습니다.

## GitOps 소개

### GitOps와 Flux란?

GitOps는 배포 구성의 진실의 원천(source of truth)으로 Git를 사용하는 소프트웨어 개발 및 운영 방법론입니다. 애플리케이션이나 인프라의 원하는 상태를 Git 저장소에 유지하고 Git 기반 워크플로우를 사용하여 변경 사항을 관리하고 배포하는 것을 포함합니다. GitOps는 전체 시스템이 Git 저장소에서 선언적으로 설명되도록 애플리케이션 및 인프라 배포를 관리하는 방법입니다. 버전 제어, 불변 아티팩트 및 자동화의 모범 사례를 활용하여 여러 Kubernetes 클러스터의 상태를 관리할 수 있는 운영 모델을 제공합니다.

Flux는 Kubernetes에서 애플리케이션 배포를 자동화하는 GitOps 도구입니다. Git 저장소의 상태를 지속적으로 모니터링하고 클러스터에 변경 사항을 적용합니다. Flux는 GitHub, [GitLab](https://dzone.com/articles/auto-deploy-spring-boot-app-using-gitlab-cicd/), Bitbucket과 같은 다양한 Git 제공자와 통합됩니다. 저장소에 변경이 이루어지면 Flux가 자동으로 이를 감지하고 클러스터를 업데이트합니다.

### Flux 사용의 장점

* **자동화된 배포**: Flux는 배포 프로세스를 자동화하여 수동 오류를 줄이고 개발자가 다른 작업에 집중할 수 있게 합니다.
* **Git 기반 워크플로우**: Flux는 Git를 진실의 원천으로 활용하여 변경 사항을 추적하고 되돌리기가 쉽습니다.
* **선언적 구성**: Flux는 [Kubernetes](https://dzone.com/articles/kubernetes-full-stack-example-with-kong-ingress-co/) 매니페스트를 사용하여 클러스터의 원하는 상태를 정의하므로 변경 사항을 관리하고 추적하기가 더 쉽습니다.

### Flux 채택의 과제

* **제한된 커스터마이징**: Flux는 제한된 커스터마이징만 지원하므로 모든 사용 사례에 적합하지 않을 수 있습니다.
* **가파른 학습 곡선**: Flux는 신규 사용자에게 가파른 학습 곡선이 있으며 Kubernetes와 Git에 대한 깊은 이해가 필요합니다.

## Amazon EKS에서 Grafana Operator를 사용하여 Amazon Managed Grafana 리소스 관리

이전 섹션에서 설명한 것처럼, Grafana Operator를 사용하면 Kubernetes 클러스터에서 Kubernetes 네이티브 방식으로 Amazon Managed Grafana의 리소스 수명 주기를 생성하고 관리할 수 있습니다. 아래 아키텍처 다이어그램은 Grafana Operator를 사용하여 Kubernetes 클러스터를 제어 플레인으로 사용하여 AMG와의 ID 설정, Amazon Managed Service for Prometheus를 데이터 소스로 추가, Amazon EKS 클러스터에서 Kubernetes 네이티브 방식으로 Amazon Managed Grafana에서 대시보드를 생성하는 시연을 보여줍니다.

![GitOPS-WITH-AMG-2](../../../images/Operational/gitops-with-amg/gitops-with-amg-2.jpg)

Amazon EKS 클러스터에 위 솔루션을 배포하는 방법에 대한 자세한 시연은 [Kubernetes 클러스터에서 오픈소스 Grafana Operator를 사용하여 Amazon Managed Grafana 관리하기](https://aws.amazon.com/blogs/mt/using-open-source-grafana-operator-on-your-kubernetes-cluster-to-manage-amazon-managed-grafana/) 게시물을 참조하세요.

## Amazon EKS에서 Flux와 함께 GitOps를 사용하여 Amazon Managed Grafana 리소스 관리

위에서 설명한 것처럼, Flux는 Kubernetes에서 애플리케이션 배포를 자동화합니다. GitHub과 같은 Git 저장소의 상태를 지속적으로 모니터링하고 저장소에 변경이 이루어지면 Flux가 자동으로 이를 감지하고 클러스터를 업데이트합니다. Kubernetes 클러스터에서 Grafana Operator를 사용하고 Flux를 통한 GitOps 메커니즘으로 Amazon Managed Service for Prometheus를 데이터 소스로 추가하고 Kubernetes 네이티브 방식으로 Amazon Managed Grafana에서 대시보드를 생성하는 방법을 시연하는 아래 아키텍처를 참조하세요.

![GitOPS-WITH-AMG-1](../../../images/Operational/gitops-with-amg/gitops-with-amg-1.jpg)

One Observability Workshop 모듈 - [Amazon Managed Grafana와 함께 GitOps](https://catalog.workshops.aws/observability/en-US/aws-managed-oss/gitops-with-amg)를 참조하세요. 이 모듈은 EKS 클러스터에 다음과 같은 필수 "Day 2" 운영 도구를 설정합니다:

* [External Secrets Operator](https://github.com/external-secrets/external-secrets/tree/main/deploy/charts/external-secrets) - AWS Secret Manager에서 Amazon Managed Grafana 시크릿을 읽기 위해 성공적으로 설치됨
* [Prometheus Node Exporter](https://github.com/prometheus/node_exporter) - 메모리, 디스크, CPU 사용률과 같은 다양한 머신 리소스를 측정
* [Grafana Operator](https://github.com/grafana-operator/grafana-operator) - Kubernetes 클러스터를 사용하여 Kubernetes 네이티브 방식으로 Amazon Managed Grafana의 리소스 수명 주기를 생성하고 관리
* [Flux](https://fluxcd.io/) - GitOps 메커니즘을 사용하여 Kubernetes에서 애플리케이션 배포를 자동화

## 결론

이 Observability 모범 사례 가이드 섹션에서는 Amazon Managed Grafana와 함께 Grafana Operator 및 GitOps를 사용하는 방법을 알아보았습니다. GitOps와 Grafana Operator에 대해 학습한 후, Amazon EKS에서 Grafana Operator를 사용하여 Amazon Managed Grafana의 리소스를 관리하는 방법과 Amazon EKS에서 Flux와 함께 GitOps를 사용하여 AMG와의 ID 설정, Amazon EKS 클러스터에서 Kubernetes 네이티브 방식으로 Amazon Managed Grafana에 AWS 데이터 소스를 추가하는 방법에 초점을 맞췄습니다.
# AWS X-Ray를 사용한 컨테이너 트레이싱

Observability 모범 사례 가이드의 이 섹션에서는 AWS X-Ray를 사용한 컨테이너 트레이싱과 관련된 다음 주제를 심층적으로 다룹니다:

* AWS X-Ray 소개
* AWS Distro for OpenTelemetry용 Amazon EKS 애드온을 사용한 트레이스 수집
* 결론

### 소개

[AWS X-Ray](https://docs.aws.amazon.com/xray/latest/devguide/aws-xray.html)는 애플리케이션이 처리하는 요청에 대한 데이터를 수집하고, 해당 데이터를 보고, 필터링하고, 통찰력을 얻어 문제와 최적화 기회를 식별할 수 있는 도구를 제공하는 서비스입니다. 애플리케이션에 대한 추적된 요청의 경우, 요청과 응답에 대한 자세한 정보뿐만 아니라 애플리케이션이 다운스트림 AWS 리소스, 마이크로서비스, 데이터베이스 및 웹 API에 수행하는 호출에 대한 자세한 정보도 확인할 수 있습니다.

애플리케이션 계측은 수신 및 발신 요청과 애플리케이션 내의 기타 이벤트에 대한 트레이스 데이터와 각 요청에 대한 메타데이터를 전송하는 작업을 포함합니다. 많은 계측 시나리오에서는 구성 변경만으로도 충분합니다. 예를 들어, Java 애플리케이션이 수행하는 모든 수신 HTTP 요청과 AWS 서비스에 대한 다운스트림 호출을 계측할 수 있습니다. X-Ray 트레이싱을 위해 애플리케이션을 계측하는 데 사용할 수 있는 여러 SDK, 에이전트 및 도구가 있습니다. 자세한 내용은 [애플리케이션 계측](https://docs.aws.amazon.com/xray/latest/devguide/xray-instrumenting-your-app.html)을 참조하세요.

AWS Distro for OpenTelemetry용 Amazon EKS 애드온을 사용하여 Amazon EKS 클러스터에서 트레이스를 수집하는 컨테이너화된 애플리케이션 트레이싱에 대해 알아보겠습니다.

### AWS Distro for OpenTelemetry용 Amazon EKS 애드온을 사용한 트레이스 수집

[AWS X-Ray](https://aws.amazon.com/xray/)는 애플리케이션 트레이싱 기능을 제공하여 배포된 모든 마이크로서비스에 대한 깊은 통찰력을 제공합니다. X-Ray를 사용하면 모든 요청이 관련된 마이크로서비스를 통해 흐를 때 추적할 수 있습니다. 이를 통해 DevOps 팀은 서비스가 동료 서비스와 어떻게 상호작용하는지 이해하고 문제를 훨씬 빠르게 분석하고 디버그할 수 있습니다.

[AWS Distro for OpenTelemetry(ADOT)](https://aws-otel.github.io/docs/introduction)는 OpenTelemetry 프로젝트의 안전한 AWS 지원 배포판입니다. 사용자는 애플리케이션을 한 번만 계측하고 ADOT를 사용하여 상관관계가 있는 메트릭과 트레이스를 여러 모니터링 솔루션으로 전송할 수 있습니다. Amazon EKS는 이제 클러스터가 가동된 후 언제든지 ADOT를 애드온으로 활성화할 수 있게 합니다. ADOT 애드온에는 최신 보안 패치와 버그 수정이 포함되어 있으며 Amazon EKS와 함께 작동하도록 AWS에서 검증했습니다.

ADOT 애드온은 Kubernetes Operator의 구현으로, 커스텀 리소스를 사용하여 애플리케이션과 그 컴포넌트를 관리하는 Kubernetes의 소프트웨어 확장입니다. 애드온은 OpenTelemetryCollector라는 커스텀 리소스를 감시하고 커스텀 리소스에 지정된 구성 설정에 따라 ADOT Collector의 수명 주기를 관리합니다.

ADOT Collector에는 수신기(receiver), 프로세서(processor), 내보내기(exporter)의 세 가지 핵심 유형의 컴포넌트로 구성되는 파이프라인 개념이 있습니다. [수신기](https://opentelemetry.io/docs/collector/configuration/#receivers)는 데이터가 컬렉터로 들어오는 방식입니다. 특정 형식의 데이터를 수락하고, 내부 형식으로 변환하여 파이프라인에 정의된 [프로세서](https://opentelemetry.io/docs/collector/configuration/#processors)와 [내보내기](https://opentelemetry.io/docs/collector/configuration/#exporters)로 전달합니다. Pull 또는 Push 기반일 수 있습니다. 프로세서는 수신과 내보내기 사이에 배치, 필터링, 변환과 같은 작업을 수행하는 선택적 컴포넌트입니다. 내보내기는 메트릭, 로그 또는 트레이스를 어떤 대상으로 보낼지 결정하는 데 사용됩니다. 컬렉터 아키텍처를 통해 Kubernetes YAML 매니페스트로 여러 파이프라인 인스턴스를 설정할 수 있습니다.

다음 다이어그램은 AWS X-Ray로 텔레메트리 데이터를 전송하는 트레이스 파이프라인으로 구성된 ADOT Collector를 보여줍니다. 트레이스 파이프라인은 [AWS X-Ray Receiver](https://github.com/open-telemetry/opentelemetry-collector-contrib/tree/main/receiver/awsxrayreceiver)와 [AWS X-Ray Exporter](https://github.com/open-telemetry/opentelemetry-collector-contrib/tree/main/exporter/awsxrayexporter) 인스턴스로 구성되며 AWS X-Ray로 트레이스를 전송합니다.

![Tracing-1](../../../../images/Containers/aws-native/eks/tracing-1.jpg)

*그림: AWS Distro for OpenTelemetry용 Amazon EKS 애드온을 사용한 트레이스 수집.*

EKS 클러스터에 ADOT 애드온을 설치하고 워크로드에서 텔레메트리 데이터를 수집하는 세부 사항을 살펴보겠습니다. ADOT 애드온을 설치하기 전에 필요한 사전 조건 목록은 다음과 같습니다.

* Kubernetes 버전 1.19 이상을 지원하는 EKS 클러스터. [여기에 설명된 접근 방식](https://docs.aws.amazon.com/eks/latest/userguide/create-cluster.html) 중 하나를 사용하여 EKS 클러스터를 생성할 수 있습니다.
* 클러스터에 아직 설치되지 않은 경우 [Certificate Manager](https://cert-manager.io/). [이 문서](https://cert-manager.io/docs/installation/)에 따라 기본 구성으로 설치할 수 있습니다.
* 클러스터에 ADOT 애드온을 설치하기 위한 EKS 애드온 전용 Kubernetes RBAC 권한. 이는 kubectl과 같은 CLI 도구를 사용하여 [이 YAML의 설정](https://amazon-eks.s3.amazonaws.com/docs/addons-otel-permissions.yaml)을 클러스터에 적용하여 수행할 수 있습니다.

다음 명령을 사용하여 다양한 EKS 버전에 대해 활성화된 애드온 목록을 확인할 수 있습니다:

`aws eks describe-addon-versions`

JSON 출력에는 아래와 같이 다른 애드온과 함께 ADOT 애드온이 나열되어야 합니다. EKS 클러스터가 생성될 때 EKS 애드온은 어떤 애드온도 자동으로 설치하지 않습니다.


```
{
   "addonName":"adot",
   "type":"observability",
   "addonVersions":[
      {
         "addonVersion":"v0.45.0-eksbuild.1",
         "architecture":[
            "amd64"
         ],
         "compatibilities":[
            {
               "clusterVersion":"1.22",
               "platformVersions":[
                  "*"
               ],
               "defaultVersion":true
            },
            {
               "clusterVersion":"1.21",
               "platformVersions":[
                  "*"
               ],
               "defaultVersion":true
            },
            {
               "clusterVersion":"1.20",
               "platformVersions":[
                  "*"
               ],
               "defaultVersion":true
            },
            {
               "clusterVersion":"1.19",
               "platformVersions":[
                  "*"
               ],
               "defaultVersion":true
            }
         ]
      }
   ]
}
```

다음으로, 다음 명령을 사용하여 ADOT 애드온을 설치할 수 있습니다:

`aws eks create-addon --addon-name adot --addon-version v0.45.0-eksbuild.1 --cluster-name $CLUSTER_NAME `

버전 문자열은 이전에 표시된 출력의 *addonVersion* 필드 값과 일치해야 합니다. 이 명령의 성공적인 실행 결과는 다음과 같습니다:

```
{
    "addon": {
        "addonName": "adot",
        "clusterName": "k8s-production-cluster",
        "status": "ACTIVE",
        "addonVersion": "v0.45.0-eksbuild.1",
        "health": {
            "issues": []
        },
        "addonArn": "arn:aws:eks:us-east-1:123456789000:addon/k8s-production-cluster/adot/f0bff97c-0647-ef6f-eecf-0b2a13f7491b",
        "createdAt": "2022-04-04T10:36:56.966000+05:30",
        "modifiedAt": "2022-04-04T10:38:09.142000+05:30",
        "tags": {}
    }
}
```

다음 단계로 진행하기 전에 애드온이 ACTIVE 상태가 될 때까지 기다리세요. 애드온의 상태는 다음 명령으로 확인할 수 있습니다:

`aws eks describe-addon --addon-name adot --cluster-name $CLUSTER_NAME`

#### ADOT Collector 배포

ADOT 애드온은 Kubernetes Operator의 구현으로, 커스텀 리소스를 사용하여 애플리케이션과 그 컴포넌트를 관리하는 Kubernetes의 소프트웨어 확장입니다. 애드온은 OpenTelemetryCollector라는 커스텀 리소스를 감시하고 커스텀 리소스에 지정된 구성 설정에 따라 ADOT Collector의 수명 주기를 관리합니다. 다음 그림은 이것이 어떻게 작동하는지 보여줍니다.

![Tracing-1](../../../../images/Containers/aws-native/eks/tracing-2.jpg)

*그림: ADOT Collector 배포.*

다음으로 ADOT Collector를 배포하는 방법을 살펴보겠습니다. [여기의 YAML 구성 파일](https://github.com/aws-observability/aws-o11y-recipes/blob/main/sandbox/eks-addon-adot/otel-collector-xray-prometheus-complete.yaml)은 OpenTelemetryCollector 커스텀 리소스를 정의합니다. EKS 클러스터에 배포되면 ADOT 애드온이 위의 첫 번째 그림에 표시된 컴포넌트로 트레이스 및 메트릭 파이프라인을 포함하는 ADOT Collector를 프로비저닝합니다. 컬렉터는 `aws-otel-eks` 네임스페이스에 `${custom-resource-name}-collector`라는 이름의 Kubernetes Deployment로 시작됩니다. 같은 이름의 ClusterIP 서비스도 함께 시작됩니다. 이 컬렉터의 파이프라인을 구성하는 개별 컴포넌트를 살펴보겠습니다.

트레이스 파이프라인의 AWS X-Ray Receiver는 [X-Ray Segment 형식](https://docs.aws.amazon.com/xray/latest/devguide/xray-api-segmentdocuments.html)의 세그먼트나 스팬을 수락하여 X-Ray SDK로 계측된 마이크로서비스에서 전송한 세그먼트를 처리할 수 있습니다. UDP 포트 2000에서 트래픽을 수신하도록 구성되며 Cluster IP 서비스로 노출됩니다. 이 구성에 따라 이 수신기로 트레이스 데이터를 전송하려는 워크로드는 환경 변수 `AWS_XRAY_DAEMON_ADDRESS`를 `observability-collector.aws-otel-eks:2000`으로 설정해야 합니다. 내보내기는 [PutTraceSegments](https://docs.aws.amazon.com/xray/latest/api/API_PutTraceSegments.html) API를 사용하여 이러한 세그먼트를 X-Ray로 직접 전송합니다.

ADOT Collector는 `aws-otel-collector`라는 Kubernetes 서비스 계정의 ID로 시작하도록 구성되며, ClusterRoleBinding과 ClusterRole을 통해 이러한 권한이 부여됩니다. 이는 [구성](https://github.com/aws-observability/aws-o11y-recipes/blob/main/sandbox/eks-addon-adot/otel-collector-xray-prometheus-complete.yaml)에도 표시되어 있습니다. 내보내기는 X-Ray로 데이터를 전송하기 위해 IAM 권한이 필요합니다. 이는 EKS가 지원하는 [서비스 계정에 대한 IAM 역할](https://docs.aws.amazon.com/eks/latest/userguide/iam-roles-for-service-accounts.html) 기능을 사용하여 서비스 계정을 IAM 역할과 연결함으로써 수행됩니다. IAM 역할은 AWSXRayDaemonWriteAccess와 같은 AWS 관리형 정책과 연결되어야 합니다. CLUSTER_NAME 및 REGION 변수를 설정한 후 [여기의 헬퍼 스크립트](https://github.com/aws-observability/aws-o11y-recipes/blob/main/sandbox/eks-addon-adot/adot-irsa.sh)를 사용하여 이러한 권한이 부여되고 `aws-otel-collector` 서비스 계정과 연결된 `EKS-ADOT-ServiceAccount-Role`이라는 IAM 역할을 생성할 수 있습니다.

#### 트레이스 수집의 엔드투엔드 테스트

이제 모든 것을 종합하여 EKS 클러스터에 배포된 워크로드에서 트레이스 수집을 테스트해 보겠습니다. 다음 그림은 이 테스트에 사용된 설정을 보여줍니다. REST API 세트를 노출하고 S3와 상호작용하는 프론트엔드 서비스와 Aurora PostgreSQL 데이터베이스 인스턴스와 상호작용하는 데이터스토어 서비스로 구성됩니다. 서비스는 X-Ray SDK로 계측됩니다. ADOT Collector는 마지막 섹션에서 논의한 YAML 매니페스트를 사용하여 OpenTelemetryCollector 커스텀 리소스를 배포하여 Deployment 모드로 시작됩니다. Postman 클라이언트를 프론트엔드 서비스를 대상으로 하는 외부 트래픽 생성기로 사용합니다.

![Tracing-3](../../../../images/Containers/aws-native/eks/tracing-3.jpg)

*그림: 트레이스 수집의 엔드투엔드 테스트.*

다음 이미지는 서비스에서 캡처한 세그먼트 데이터를 사용하여 X-Ray가 생성한 서비스 그래프를 보여주며, 각 세그먼트의 평균 응답 지연 시간이 표시됩니다.

![Tracing-4](../../../../images/Containers/aws-native/eks/tracing-4.jpg)

*그림: CloudWatch Service Map 콘솔.*

OTLP Receiver와 AWS X-Ray Exporter를 사용하여 AWS X-Ray로 트레이스를 전송하는 [트레이스 파이프라인](https://github.com/aws-observability/aws-otel-community/blob/master/sample-configs/operator/collector-config-xray.yaml)의 OpenTelemetryCollector 커스텀 리소스 정의를 확인하세요. AWS X-Ray와 함께 ADOT Collector를 사용하려는 고객은 이러한 구성 템플릿으로 시작하여 대상 환경에 기반한 값으로 플레이스홀더 변수를 교체하고 ADOT용 EKS 애드온을 사용하여 Amazon EKS 클러스터에 컬렉터를 빠르게 배포할 수 있습니다.


### EKS Blueprints를 사용한 AWS X-Ray 컨테이너 트레이싱 설정

[EKS Blueprints](https://aws.amazon.com/blogs/containers/bootstrapping-clusters-with-eks-blueprints/)는 계정과 리전 전반에 걸쳐 일관되고 배터리가 포함된 EKS 클러스터를 구성하고 배포하는 데 도움이 되는 Infrastructure as Code(IaC) 모듈 모음입니다. EKS Blueprints를 사용하면 [Amazon EKS 애드온](https://docs.aws.amazon.com/eks/latest/userguide/eks-add-ons.html)뿐만 아니라 Prometheus, Karpenter, Nginx, Traefik, AWS Load Balancer Controller, Container Insights, Fluent Bit, Keda, Argo CD 등 다양한 인기 오픈 소스 애드온으로 EKS 클러스터를 쉽게 부트스트랩할 수 있습니다. EKS Blueprints는 인프라 배포를 자동화하는 데 도움이 되는 두 가지 인기 IaC 프레임워크인 [HashiCorp Terraform](https://github.com/aws-ia/terraform-aws-eks-blueprints)과 [AWS Cloud Development Kit(AWS CDK)](https://github.com/aws-quickstart/cdk-eks-blueprints)로 구현되어 있습니다.

EKS Blueprints를 사용한 Amazon EKS 클러스터 생성 프로세스의 일부로, Day 2 운영 도구로서 AWS X-Ray를 설정하여 컨테이너화된 애플리케이션과 마이크로서비스에서 메트릭과 로그를 수집, 집계, 요약하여 Amazon CloudWatch 콘솔로 보낼 수 있습니다.

## 결론

Observability 모범 사례 가이드의 이 섹션에서는 AWS Distro for OpenTelemetry용 Amazon EKS 애드온을 사용한 트레이스 수집을 통해 Amazon EKS에서 애플리케이션의 컨테이너 트레이싱에 AWS X-Ray를 사용하는 방법에 대해 배웠습니다. 추가 학습을 위해 [AWS Distro for OpenTelemetry용 Amazon EKS 애드온을 사용하여 Amazon Managed Service for Prometheus 및 Amazon CloudWatch로 메트릭 및 트레이스 수집](https://aws.amazon.com/blogs/containers/metrics-and-traces-collection-using-amazon-eks-add-ons-for-aws-distro-for-opentelemetry/)을 확인하세요. 마지막으로 Amazon EKS 클러스터 생성 프로세스 중에 AWS X-Ray를 사용한 컨테이너 트레이싱을 설정하기 위한 수단으로 EKS Blueprints를 사용하는 방법에 대해 간략히 이야기했습니다. 추가적인 심층 학습을 위해 AWS [One Observability Workshop](https://catalog.workshops.aws/observability/en-US)의 **AWS native** Observability 카테고리에 있는 X-Ray Traces 모듈을 실습하시는 것을 적극 권장합니다.

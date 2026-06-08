# Amazon Managed Service for Prometheus를 사용하여 EKS에 구성된 App Mesh 환경 모니터링

이 레시피에서는 [Amazon Elastic Kubernetes Service](https://aws.amazon.com/eks/) (EKS) 클러스터의 [App Mesh](https://docs.aws.amazon.com/app-mesh/) Envoy 
메트릭을 [Amazon Managed Service for Prometheus](https://aws.amazon.com/prometheus/) (AMP)로 수집하고
[Amazon Managed Grafana](https://aws.amazon.com/grafana/) (AMG)에서 마이크로서비스의 상태와 성능을 모니터링하기 위한 사용자 지정 대시보드를 생성하는 방법을 보여줍니다.

구현의 일환으로 AMP 워크스페이스를 생성하고, App Mesh Controller for Kubernetes를 설치하며
Pod에 Envoy 컨테이너를 주입합니다. EKS 클러스터에 구성된 [Grafana Agent](https://github.com/grafana/agent)를 사용하여
Envoy 메트릭을 수집하고 AMP에 기록합니다. 마지막으로, AMG 워크스페이스를 생성하고
AMP를 데이터 소스로 구성하며 사용자 지정 대시보드를 생성합니다.

:::note
    이 가이드를 완료하는 데 약 45분이 소요됩니다.
:::
## 인프라
다음 섹션에서는 이 레시피를 위한 인프라를 설정합니다.

### 아키텍처


![Architecture](../images/monitoring-appmesh-environment.png)

Grafana Agent는 Envoy 메트릭을 스크레이핑하고 AMP remote write 엔드포인트를 통해 AMP로 수집하도록 구성됩니다.

:::info 
    Prometheus Remote Write Exporter에 대한 자세한 내용은
    [AMP용 Prometheus Remote Write Exporter 시작하기](https://aws-otel.github.io/docs/getting-started/prometheus-remote-write-exporter)를 확인하세요.
:::

### 사전 요구 사항

* AWS CLI가 환경에 [설치](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-install.html) 및 [구성](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-configure.html)되어 있어야 합니다.
* [eksctl](https://docs.aws.amazon.com/eks/latest/userguide/eksctl.html) 명령을 환경에 설치해야 합니다.
* [kubectl](https://docs.aws.amazon.com/eks/latest/userguide/install-kubectl.html)을 환경에 설치해야 합니다.
* [Docker](https://docs.docker.com/get-docker/)가 환경에 설치되어 있어야 합니다.
* AWS 계정에 AMP 워크스페이스가 구성되어 있어야 합니다.
* [Helm](https://www.eksworkshop.com/beginner/060_helm/helm_intro/install/index.html)을 설치해야 합니다.
* [AWS-SSO](https://docs.aws.amazon.com/singlesignon/latest/userguide/step1.html)를 활성화해야 합니다.

### EKS 클러스터 설정

먼저, 샘플 애플리케이션을 실행하기 위해 App Mesh가 활성화된 EKS 클러스터를 생성합니다.
`eksctl` CLI를 사용하여 [eks-cluster-config.yaml](./servicemesh-monitoring-ampamg/eks-cluster-config.yaml)로
클러스터를 배포합니다. 이 템플릿은 EKS로 새 클러스터를 생성합니다.

템플릿 파일을 편집하고 리전을 AMP에 사용 가능한 리전 중 하나로 설정합니다:

* `us-east-1`
* `us-east-2`
* `us-west-2`
* `eu-central-1`
* `eu-west-1`

세션에서 이 리전을 덮어쓰세요. 예를 들어 Bash 셸에서:

```
export AWS_REGION=eu-west-1
```

다음 명령으로 클러스터를 생성합니다:

```
eksctl create cluster -f eks-cluster-config.yaml
```
이렇게 하면 `AMP-EKS-CLUSTER`라는 EKS 클러스터와 App Mesh 컨트롤러에서 사용할
`appmesh-controller`라는 서비스 계정이 생성됩니다.

### App Mesh Controller 설치

다음으로, [App Mesh Controller](https://docs.aws.amazon.com/app-mesh/latest/userguide/getting-started-kubernetes.html)를 설치하고
Custom Resource Definitions (CRDs)을 구성하기 위해 아래 명령을 실행합니다:

```
helm repo add eks https://aws.github.io/eks-charts
```

```
helm upgrade -i appmesh-controller eks/appmesh-controller \
     --namespace appmesh-system \
     --set region=${AWS_REGION} \
     --set serviceAccount.create=false \
     --set serviceAccount.name=appmesh-controller
```

### AMP 설정
AMP 워크스페이스는 Envoy에서 수집된 Prometheus 메트릭을 수집하는 데 사용됩니다.
워크스페이스는 테넌트 전용 논리적 Cortex 서버입니다. 워크스페이스는 업데이트, 목록,
설명, 삭제 등의 관리와 메트릭 수집 및 쿼리에 대한
세분화된 액세스 제어를 지원합니다.

AWS CLI를 사용하여 워크스페이스를 생성합니다:

```
aws amp create-workspace --alias AMP-APPMESH --region $AWS_REGION
```

필요한 Helm 리포지토리를 추가합니다:

```
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts && \
helm repo add kube-state-metrics https://kubernetes.github.io/kube-state-metrics 
```

AMP에 대한 자세한 내용은 [AMP 시작하기](https://docs.aws.amazon.com/prometheus/latest/userguide/AMP-getting-started.html) 가이드를 확인하세요.

### 메트릭 스크레이핑 및 수집

AMP는 Kubernetes 클러스터의 컨테이너화된 워크로드에서 운영 메트릭을 직접 스크레이핑하지 않습니다.
이 작업을 수행하려면 Prometheus 서버 또는
[AWS Distro for OpenTelemetry Collector](https://github.com/aws-observability/aws-otel-collector)나
Grafana Agent와 같은 OpenTelemetry 에이전트를 배포하고 관리해야 합니다. 이 레시피에서는
Grafana Agent를 구성하여 Envoy 메트릭을 스크레이핑하고 AMP와 AMG를 사용하여 분석하는 과정을 안내합니다.

#### Grafana Agent 구성

Grafana Agent는 전체 Prometheus 서버를 실행하는 것에 대한 경량 대안입니다.
Prometheus 익스포터를 검색하고 스크레이핑하며 Prometheus 호환 백엔드로
메트릭을 보내는 데 필요한 부분을 유지합니다. Grafana Agent는
AWS Identity and Access Management (IAM) 인증을 위한 AWS Signature Version 4 (Sigv4)에 대한
기본 지원도 포함합니다.

이제 AMP로 Prometheus 메트릭을 보내기 위한 IAM 역할을 구성하는 단계를 안내합니다.
EKS 클러스터에 Grafana Agent를 설치하고 메트릭을 AMP로 전달합니다.

#### 권한 구성
Grafana Agent는 EKS 클러스터에서 실행되는 컨테이너화된 워크로드에서 운영 메트릭을 스크레이핑하고
AMP로 보냅니다. AMP로 보내는 데이터는 관리형 서비스에 대한 각 클라이언트 요청을
인증하고 권한 부여하기 위해 Sigv4를 사용하여 유효한 AWS 자격 증명으로 서명해야 합니다.

Grafana Agent는 EKS 클러스터에 배포되어 Kubernetes 서비스 계정의 ID로 실행될 수 있습니다.
IAM roles for service accounts (IRSA)를 사용하면 IAM 역할을 Kubernetes 서비스 계정과 연결하고
해당 서비스 계정을 사용하는 모든 Pod에 IAM 권한을 제공할 수 있습니다.

다음과 같이 IRSA 설정을 준비합니다:

```
kubectl create namespace grafana-agent

export WORKSPACE=$(aws amp list-workspaces | jq -r '.workspaces[] | select(.alias=="AMP-APPMESH").workspaceId')
export ROLE_ARN=$(aws iam get-role --role-name EKS-GrafanaAgent-AMP-ServiceAccount-Role --query Role.Arn --output text)
export NAMESPACE="grafana-agent"
export REMOTE_WRITE_URL="https://aps-workspaces.$AWS_REGION.amazonaws.com/workspaces/$WORKSPACE/api/v1/remote_write"
```

[gca-permissions.sh](./servicemesh-monitoring-ampamg/gca-permissions.sh) 
셸 스크립트를 사용하여 다음 단계를 자동화할 수 있습니다(플레이스홀더 변수
`YOUR_EKS_CLUSTER_NAME`을 EKS 클러스터 이름으로 교체):

* AMP 워크스페이스에 remote-write 권한이 있는 IAM 정책으로 `EKS-GrafanaAgent-AMP-ServiceAccount-Role`이라는 IAM 역할을 생성합니다.
* IAM 역할과 연결된 `grafana-agent` 네임스페이스 아래에 `grafana-agent`라는 Kubernetes 서비스 계정을 생성합니다.
* IAM 역할과 Amazon EKS 클러스터에 호스팅된 OIDC 공급자 간에 신뢰 관계를 생성합니다.

`gca-permissions.sh` 스크립트를 실행하려면 `kubectl`과 `eksctl` CLI 도구가 필요합니다.
Amazon EKS 클러스터에 액세스하도록 구성되어 있어야 합니다.

이제 Envoy 메트릭을 추출하기 위한 스크레이핑 구성이 포함된 매니페스트 파일
[grafana-agent.yaml](./servicemesh-monitoring-ampamg/grafana-agent.yaml)을 생성하고
Grafana Agent를 배포합니다.

:::note
    이 글 작성 시점에서, 이 솔루션은 daemon set에 대한 지원 부족으로 인해
    EKS on Fargate에서는 작동하지 않습니다.
:::
이 예제에서는 `grafana-agent`라는 daemon set과 `grafana-agent-deployment`라는 deployment를 배포합니다.
`grafana-agent` daemon set은 클러스터의 Pod에서 메트릭을 수집하고,
`grafana-agent-deployment` deployment는 EKS 컨트롤 플레인과 같이
클러스터에 존재하지 않는 서비스에서 메트릭을 수집합니다.

```
kubectl apply -f grafana-agent.yaml
```
`grafana-agent`가 배포되면 메트릭을 수집하고 지정된 AMP 워크스페이스에 수집합니다.
이제 EKS 클러스터에 샘플 애플리케이션을 배포하고 메트릭 분석을 시작합니다.

## 샘플 애플리케이션

AppMesh controller for Kubernetes를 사용하여 애플리케이션을 설치하고 Envoy 컨테이너를 주입합니다.

먼저, examples 저장소를 클론하여 기본 애플리케이션을 설치합니다:

```
git clone https://github.com/aws/aws-app-mesh-examples.git
```

클러스터에 리소스를 적용합니다:

```
kubectl apply -f aws-app-mesh-examples/examples/apps/djapp/1_base_application
```

Pod 상태를 확인하고 실행 중인지 확인합니다:

```
$ kubectl -n prod get all

NAME                            READY   STATUS    RESTARTS   AGE
pod/dj-cb77484d7-gx9vk          1/1     Running   0          6m8s
pod/jazz-v1-6b6b6dd4fc-xxj9s    1/1     Running   0          6m8s
pod/metal-v1-584b9ccd88-kj7kf   1/1     Running   0          6m8s
```

다음으로, App Mesh 컨트롤러를 설치하고 배포를 메시화합니다:

```
kubectl apply -f aws-app-mesh-examples/examples/apps/djapp/2_meshed_application/
kubectl rollout restart deployment -n prod dj jazz-v1 metal-v1
```

이제 각 Pod에 두 개의 컨테이너가 실행되는 것을 볼 수 있습니다:

```
$ kubectl -n prod get all
NAME                        READY   STATUS    RESTARTS   AGE
dj-7948b69dff-z6djf         2/2     Running   0          57s
jazz-v1-7cdc4fc4fc-wzc5d    2/2     Running   0          57s
metal-v1-7f499bb988-qtx7k   2/2     Running   0          57s
```

5분 동안 트래픽을 생성하고 나중에 AMG에서 시각화합니다:

```
dj_pod=`kubectl get pod -n prod --no-headers -l app=dj -o jsonpath='{.items[*].metadata.name}'`

loop_counter=0
while [ $loop_counter -le 300 ] ; do \
kubectl exec -n prod -it $dj_pod  -c dj \
-- curl jazz.prod.svc.cluster.local:9080 ; echo ; loop_counter=$[$loop_counter+1] ; \
done
```

### AMG 워크스페이스 생성

AMG 워크스페이스를 생성하려면 [AMG 시작하기](https://aws.amazon.com/blogs/mt/amazon-managed-grafana-getting-started/) 블로그 게시물의 단계를 따릅니다.
사용자에게 대시보드 액세스를 부여하려면 AWS SSO를 활성화해야 합니다. 워크스페이스를 생성한 후 개별 사용자 또는 사용자 그룹에 Grafana 워크스페이스에 대한 액세스를 할당할 수 있습니다.
기본적으로 사용자 유형은 viewer입니다. 사용자 역할에 따라 사용자 유형을 변경합니다. AMP 워크스페이스를 데이터 소스로 추가하고 대시보드 생성을 시작합니다.

이 예제에서 사용자 이름은 `grafana-admin`이고 사용자 유형은 `Admin`입니다.
필요한 데이터 소스를 선택합니다. 구성을 검토한 후 `Create workspace`를 선택합니다.

![Creating AMP Workspace](../images/workspace-creation.png)

### AMG 데이터 소스 구성
AMG에서 AMP를 데이터 소스로 구성하려면 `Data sources` 섹션에서
`Configure in Grafana`를 선택하면 브라우저에서 Grafana 워크스페이스가 시작됩니다.
브라우저에서 Grafana 워크스페이스 URL을 직접 시작할 수도 있습니다.

![Configuring Datasource](../images/configuring-amp-datasource.png)

스크린샷에서 볼 수 있듯이 downstream latency, connections, response code 등의
Envoy 메트릭을 확인할 수 있습니다. 표시된 필터를 사용하여 특정 애플리케이션의
Envoy 메트릭을 자세히 살펴볼 수 있습니다.

### AMG 대시보드 구성

데이터 소스가 구성되면 Envoy 메트릭을 분석하기 위한 사용자 지정 대시보드를 가져옵니다.
이를 위해 미리 정의된 대시보드를 사용하므로, `Import`(아래 표시)를 선택하고
ID `11022`를 입력합니다. 이렇게 하면 Envoy 메트릭 분석을 시작할 수 있도록
Envoy Global 대시보드가 가져와집니다.

![Custom Dashboard](../images/import-dashboard.png)

### AMG에서 알림 구성
메트릭이 의도한 임계값을 초과할 때 Grafana 알림을 구성할 수 있습니다.
AMG를 사용하면 대시보드에서 알림을 평가하는 빈도와 알림 전송을 구성할 수 있습니다.
알림 규칙을 생성하기 전에 알림 채널을 생성해야 합니다.

이 예제에서는 Amazon SNS를 알림 채널로 구성합니다. 기본값, 즉
[서비스 관리형 권한](https://docs.aws.amazon.com/grafana/latest/userguide/AMG-manage-permissions.html#AMG-service-managed-account)을 사용하는 경우
알림이 성공적으로 토픽에 게시되려면 SNS 토픽 이름이 `grafana`로 시작해야 합니다.

다음 명령으로 `grafana-notification`이라는 SNS 토픽을 생성합니다:

```
aws sns create-topic --name grafana-notification
```

이메일 주소를 통해 구독합니다. 아래 명령에서 리전과 계정 ID를 지정합니다:

```
aws sns subscribe \
    --topic-arn arn:aws:sns:<region>:<account-id>:grafana-notification \
	--protocol email \
	--notification-endpoint <email-id>
```

Grafana 대시보드에서 새 알림 채널을 추가합니다.
grafana-notification이라는 새 알림 채널을 구성합니다. Type에서
드롭다운에서 AWS SNS를 사용합니다. Topic에는 방금 생성한 SNS 토픽의 ARN을 사용합니다.
Auth provider로 AWS SDK Default를 선택합니다.

![Creating Notification Channel](../images/alert-configuration.png)

이제 downstream latency가 1분 동안 5밀리초를 초과하면 알림을 구성합니다.
대시보드에서 드롭다운에서 Downstream latency를 선택한 후 Edit를 선택합니다.
그래프 패널의 Alert 탭에서 알림 규칙을 평가하는 빈도와
알림 상태를 변경하고 알림을 시작하기 위해 충족되어야 하는 조건을 구성합니다.

다음 구성에서는 downstream latency가 임계값을 초과하면 알림이 생성되며,
구성된 grafana-alert-notification 채널을 통해 SNS 토픽으로 알림이 전송됩니다.

![Alert Configuration](../images/downstream-latency.png)

## 정리

1. 리소스와 클러스터를 제거합니다:
```
kubectl delete all --all
eksctl delete cluster --name AMP-EKS-CLUSTER
```
2. AMP 워크스페이스를 제거합니다:
```
aws amp delete-workspace --workspace-id `aws amp list-workspaces --alias prometheus-sample-app --query 'workspaces[0].workspaceId' --output text`
```
3. amp-iamproxy-ingest-role IAM 역할을 제거합니다:
```
aws delete-role --role-name amp-iamproxy-ingest-role
```
4. 콘솔에서 AMG 워크스페이스를 제거합니다.

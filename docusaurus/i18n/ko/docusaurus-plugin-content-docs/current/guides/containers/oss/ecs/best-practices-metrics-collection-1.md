# AWS Distro for OpenTelemetry를 사용한 ECS 클러스터의 시스템 메트릭 수집
[AWS Distro for OpenTelemetry](https://aws-otel.github.io/docs/introduction)(ADOT)는 [OpenTelemetry](https://opentelemetry.io/) 프로젝트의 안전한 AWS 지원 배포판입니다. ADOT를 사용하면 여러 소스에서 텔레메트리 데이터를 수집하고 상관관계가 있는 메트릭, 트레이스, 로그를 여러 모니터링 솔루션으로 전송할 수 있습니다. ADOT는 Amazon ECS 클러스터에 두 가지 패턴으로 배포할 수 있습니다.

## ADOT Collector 배포 패턴
1. 사이드카 패턴에서 ADOT Collector는 클러스터의 각 태스크 내에서 실행되며 해당 태스크 내의 애플리케이션 컨테이너에서만 수집된 텔레메트리 데이터를 처리합니다. 이 배포 패턴은 컬렉터가 Amazon ECS [Task Metadata Endpoint](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/task-metadata-endpoint.html)에서 태스크 메타데이터를 읽고 이를 통해 리소스 사용 메트릭(CPU, 메모리, 네트워크, 디스크 등)을 생성해야 하는 경우에만 필요합니다.
![ADOT architecture](../../../../images/ADOT-sidecar.png)

2. 중앙 컬렉터 패턴에서는 단일 ADOT Collector 인스턴스가 클러스터에 배포되며 클러스터에서 실행 중인 모든 태스크의 텔레메트리 데이터를 처리합니다. 이것이 가장 일반적으로 사용되는 배포 패턴입니다. 컬렉터는 REPLICA 또는 DAEMON 서비스 스케줄러 전략을 사용하여 배포됩니다.
![ADOT architecture](../../../../images/ADOT-central.png)

ADOT Collector 아키텍처에는 파이프라인 개념이 있습니다. 단일 컬렉터에는 둘 이상의 파이프라인이 포함될 수 있습니다. 각 파이프라인은 메트릭, 트레이스, 로그의 세 가지 유형의 텔레메트리 데이터 중 하나를 처리하는 데 전용됩니다. 각 유형의 텔레메트리 데이터에 대해 여러 파이프라인을 구성할 수 있습니다. 이 다재다능한 아키텍처를 통해 단일 컬렉터가 클러스터에 배포해야 할 여러 Observability 에이전트의 역할을 수행할 수 있습니다. 이는 클러스터에서 Observability 에이전트의 배포 풋프린트를 크게 줄여줍니다. 파이프라인을 구성하는 컬렉터의 기본 컴포넌트는 수신기(Receiver), 프로세서(Processor), 내보내기(Exporter)의 세 범주로 그룹화됩니다. 확장(Extensions)이라는 보조 컴포넌트는 컬렉터에 추가할 수 있지만 파이프라인의 일부가 아닌 기능을 제공합니다.

:::info
    수신기, 프로세서, 내보내기, 확장에 대한 자세한 설명은 OpenTelemetry [문서](https://opentelemetry.io/docs/collector/configuration/#basics)를 참조하세요.
:::

## ECS 태스크 메트릭 수집을 위한 ADOT Collector 배포

ECS 태스크 수준에서 리소스 사용률 메트릭을 수집하려면 아래와 같은 태스크 정의를 사용하여 사이드카 패턴으로 ADOT Collector를 배포해야 합니다. 컬렉터에 사용되는 컨테이너 이미지에는 여러 파이프라인 구성이 번들되어 있습니다. 요구 사항에 따라 하나를 선택하고 컨테이너 정의의 *command* 섹션에 구성 파일 경로를 지정할 수 있습니다. 이 값을 `--config=/etc/ecs/container-insights/otel-task-metrics-config.yaml`로 설정하면 컬렉터와 동일한 태스크 내에서 실행 중인 다른 컨테이너에서 리소스 사용률 메트릭과 트레이스를 수집하여 Amazon CloudWatch와 AWS X-Ray로 전송하는 [파이프라인 구성](https://github.com/aws-observability/aws-otel-collector/blob/main/config/ecs/container-insights/otel-task-metrics-config.yaml)을 사용합니다. 구체적으로, 컬렉터는 [Amazon ECS Task Metadata Endpoint](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/task-metadata-endpoint-v4.html)에서 태스크 메타데이터와 docker stats를 읽고 이를 통해 리소스 사용 메트릭(CPU, 메모리, 네트워크, 디스크 등)을 생성하는 [AWS ECS Container Metrics Receiver](https://github.com/open-telemetry/opentelemetry-collector-contrib/tree/main/receiver/awsecscontainermetricsreceiver)를 사용합니다.

```javascript
{
    "family":"AdotTask",
    "taskRoleArn":"arn:aws:iam::123456789012:role/ECS-ADOT-Task-Role",
    "executionRoleArn":"arn:aws:iam::123456789012:role/ECS-Task-Execution-Role",
    "networkMode":"awsvpc",
    "containerDefinitions":[
       {
          "name":"application-container",
          "image":"..."
       },
       {
          "name":"aws-otel-collector",
          "image":"public.ecr.aws/aws-observability/aws-otel-collector:latest",
          "cpu":512,
          "memory":1024,
          "command": [
            "--config=/etc/ecs/container-insights/otel-task-metrics-config.yaml"
          ],          
          "portMappings":[
             {
                "containerPort":2000,
                "protocol":"udp"
             }
          ],             
          "essential":true
       }
    ],
    "requiresCompatibilities":[
       "EC2"
    ],
    "cpu":"1024",
    "memory":"2048"
 }
```
:::info
    Amazon ECS 클러스터에 배포할 때 ADOT Collector가 사용하는 IAM 태스크 역할과 태스크 실행 역할 설정에 대한 자세한 내용은 [문서](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/deploy-container-insights-ECS-adot.html)를 참조하세요.
:::

:::info
    [AWS ECS Container Metrics Receiver](https://github.com/open-telemetry/opentelemetry-collector-contrib/tree/main/receiver/awsecscontainermetricsreceiver)는 ECS Task Metadata Endpoint V4에서만 작동합니다. 플랫폼 버전 1.4.0 이상을 사용하는 Fargate의 Amazon ECS 태스크와 Amazon ECS 컨테이너 에이전트 버전 1.39.0 이상을 실행하는 Amazon EC2의 Amazon ECS 태스크가 이 수신기를 활용할 수 있습니다. 자세한 내용은 [Amazon ECS 컨테이너 에이전트 버전](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/ecs-agent-versions.html)을 참조하세요.
:::

기본 [파이프라인 구성](https://github.com/aws-observability/aws-otel-collector/blob/main/config/ecs/container-insights/otel-task-metrics-config.yaml)에서 볼 수 있듯이, 컬렉터의 파이프라인은 먼저 CPU, 메모리, 네트워크, 디스크 사용량과 관련된 [메트릭 하위 집합](https://github.com/aws-observability/aws-otel-collector/blob/09d59966404c2928aaaf6920f27967a84d898254/config/ecs/container-insights/otel-task-metrics-config.yaml#L25)을 필터링하는 [Filter Processor](https://github.com/open-telemetry/opentelemetry-collector-contrib/tree/main/processor/filterprocessor)를 사용합니다. 그런 다음 메트릭의 이름을 변경하고 속성을 업데이트하는 [변환](https://github.com/aws-observability/aws-otel-collector/blob/09d59966404c2928aaaf6920f27967a84d898254/config/ecs/container-insights/otel-task-metrics-config.yaml#L39) 세트를 수행하는 [Metrics Transform Processor](https://github.com/open-telemetry/opentelemetry-collector-contrib/tree/main/processor/metricstransformprocessor)를 사용합니다. 마지막으로, [Amazon CloudWatch EMF Exporter](https://github.com/open-telemetry/opentelemetry-collector-contrib/tree/main/exporter/awsemfexporter)를 사용하여 메트릭이 성능 로그 이벤트로 CloudWatch에 전송됩니다. 이 기본 구성을 사용하면 CloudWatch 네임스페이스 *ECS/ContainerInsights* 아래에 다음 리소스 사용 메트릭이 수집됩니다.

- MemoryUtilized
- MemoryReserved
- CpuUtilized
- CpuReserved
- NetworkRxBytes
- NetworkTxBytes
- StorageReadBytes
- StorageWriteBytes

:::info
    이러한 메트릭은 [Amazon ECS용 Container Insights가 수집하는 메트릭](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Container-Insights-metrics-ECS.html)과 동일하며 클러스터 또는 계정 수준에서 Container Insights를 활성화하면 CloudWatch에서 바로 사용할 수 있습니다. 따라서 CloudWatch에서 ECS 리소스 사용 메트릭을 수집하려면 Container Insights를 활성화하는 것이 권장되는 접근 방식입니다.
:::

AWS ECS Container Metrics Receiver는 Amazon ECS Task Metadata Endpoint에서 읽는 52개의 고유한 메트릭을 생성합니다. 수신기가 수집하는 전체 메트릭 목록은 [여기에 문서화](https://github.com/open-telemetry/opentelemetry-collector-contrib/tree/main/receiver/awsecscontainermetricsreceiver#available-metrics)되어 있습니다. 모든 메트릭을 선호하는 대상으로 전송하고 싶지 않을 수 있습니다. ECS 리소스 사용 메트릭에 대해 더 명시적인 제어를 원한다면, 프로세서/변환기를 선택하여 사용 가능한 메트릭을 필터링하고 변환하며 내보내기를 선택하여 대상으로 전송하는 사용자 지정 파이프라인 구성을 만들 수 있습니다. ECS 태스크 수준 메트릭을 캡처하기 위한 파이프라인 구성의 [추가 예시](https://github.com/open-telemetry/opentelemetry-collector-contrib/tree/main/receiver/awsecscontainermetricsreceiver#full-configuration-examples)는 문서를 참조하세요.

사용자 지정 파이프라인 구성을 사용하려면 아래 표시된 태스크 정의를 사용하고 사이드카 패턴으로 컬렉터를 배포할 수 있습니다. 여기서 컬렉터 파이프라인의 구성은 AWS SSM Parameter Store의 *otel-collector-config*이라는 파라미터에서 로드됩니다.

:::note
    SSM Parameter Store 파라미터 이름은 AOT_CONFIG_CONTENT라는 환경 변수를 사용하여 컬렉터에 노출되어야 합니다.
:::

```javascript
{
    "family":"AdotTask",
    "taskRoleArn":"arn:aws:iam::123456789012:role/ECS-ADOT-Task-Role",
    "executionRoleArn":"arn:aws:iam::123456789012:role/ECS-Task-Execution-Role",
    "networkMode":"awsvpc",
    "containerDefinitions":[
       {
          "name":"application-container",
          "image":"..."
       },        
       {
          "name":"aws-otel-collector",
          "image":"public.ecr.aws/aws-observability/aws-otel-collector:latest",
          "cpu":512,
          "memory":1024,
          "secrets":[
             {
                "name":"AOT_CONFIG_CONTENT",
                "valueFrom":"arn:aws:ssm:us-east-1:123456789012:parameter/otel-collector-config"
             }
          ],          
          "portMappings":[
             {
                "containerPort":2000,
                "protocol":"udp"
             }
          ],             
          "essential":true
       }
    ],
    "requiresCompatibilities":[
       "EC2"
    ],
    "cpu":"1024",
    "memory":"2048"
 }
```

## ECS 컨테이너 인스턴스 메트릭 수집을 위한 ADOT Collector 배포

ECS 클러스터에서 EC2 인스턴스 수준 메트릭을 수집하려면 아래와 같은 태스크 정의를 사용하여 ADOT Collector를 배포할 수 있습니다. daemon 서비스 스케줄러 전략으로 배포해야 합니다. 컨테이너 이미지에 번들된 파이프라인 구성을 선택할 수 있습니다. 컨테이너 정의의 *command* 섹션에서 구성 파일 경로를 `--config=/etc/ecs/otel-instance-metrics-config.yaml`로 설정해야 합니다. 컬렉터는 [AWS Container Insights Receiver](https://github.com/open-telemetry/opentelemetry-collector-contrib/tree/main/receiver/awscontainerinsightreceiver#aws-container-insights-receiver)를 사용하여 CPU, 메모리, 디스크, 네트워크 등 많은 리소스에 대한 EC2 인스턴스 수준 인프라 메트릭을 수집합니다. [Amazon CloudWatch EMF Exporter](https://github.com/open-telemetry/opentelemetry-collector-contrib/tree/main/exporter/awsemfexporter)를 사용하여 메트릭이 성능 로그 이벤트로 CloudWatch에 전송됩니다. 이 구성으로 컬렉터의 기능은 EC2에서 호스팅되는 Amazon ECS 클러스터에 CloudWatch 에이전트를 배포하는 것과 동일합니다.

:::info
    EC2 인스턴스 수준 메트릭을 수집하기 위한 ADOT Collector 배포는 AWS Fargate에서 실행되는 ECS 클러스터에서는 지원되지 않습니다.
:::

```javascript
{
    "family":"AdotTask",
    "taskRoleArn":"arn:aws:iam::123456789012:role/ECS-ADOT-Task-Role",
    "executionRoleArn":"arn:aws:iam::123456789012:role/ECS-Task-Execution-Role",
    "networkMode":"awsvpc",
    "containerDefinitions":[
       {
          "name":"application-container",
          "image":"..."
       },
       {
          "name":"aws-otel-collector",
          "image":"public.ecr.aws/aws-observability/aws-otel-collector:latest",
          "cpu":512,
          "memory":1024,
          "command": [
            "--config=/etc/ecs/otel-instance-metrics-config.yaml"
          ],          
          "portMappings":[
             {
                "containerPort":2000,
                "protocol":"udp"
             }
          ],             
          "essential":true
       }
    ],
    "requiresCompatibilities":[
       "EC2"
    ],
    "cpu":"1024",
    "memory":"2048"
 }
```

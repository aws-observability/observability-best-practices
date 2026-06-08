# Amazon Managed Service for Prometheus 및 Alert Manager를 사용한 Amazon EC2 Auto Scaling

고객은 기존 Prometheus 워크로드를 클라우드로 마이그레이션하고 클라우드가 제공하는 모든 기능을 활용하고자 합니다. AWS에는 CPU 또는 메모리 사용률과 같은 메트릭을 기반으로 [Amazon Elastic Compute Cloud (Amazon EC2)](https://aws.amazon.com/pm/ec2/) 인스턴스를 확장할 수 있는 [EC2 Auto Scaling](https://aws.amazon.com/ec2/autoscaling/)과 같은 서비스가 있습니다. Prometheus 메트릭을 사용하는 애플리케이션은 기존 모니터링 스택을 교체하지 않고도 EC2 Auto Scaling에 쉽게 통합할 수 있습니다. 이 글에서는 [Amazon Managed Service for Prometheus Alert Manager](https://aws.amazon.com/prometheus/)와 함께 Amazon EC2 Auto Scaling을 구성하는 방법을 안내합니다. 이 접근 방식을 통해 Auto Scaling과 같은 서비스를 활용하면서 Prometheus 기반 워크로드를 클라우드로 이전할 수 있습니다.

Amazon Managed Service for Prometheus는 [PromQL](https://prometheus.io/docs/prometheus/latest/querying/basics/)을 사용하는 [알림 규칙](https://docs.aws.amazon.com/prometheus/latest/userguide/AMP-Ruler.html) 지원을 제공합니다. [Prometheus 알림 규칙 문서](https://prometheus.io/docs/prometheus/latest/configuration/alerting_rules/)에서 유효한 알림 규칙의 구문과 예제를 확인할 수 있습니다. 마찬가지로, Prometheus Alert Manager 문서에서 유효한 Alert Manager 구성의 [구문](https://prometheus.io/docs/prometheus/latest/configuration/template_reference/)과 [예제](https://prometheus.io/docs/prometheus/latest/configuration/template_examples/)를 참조할 수 있습니다.

## 솔루션 개요

먼저, Amazon EC2 Auto Scaling의 [Auto Scaling 그룹](https://docs.aws.amazon.com/autoscaling/ec2/userguide/auto-scaling-groups.html) 개념을 간략히 살펴보겠습니다. 이는 Amazon EC2 인스턴스의 논리적 컬렉션입니다. Auto Scaling 그룹은 사전 정의된 시작 템플릿을 기반으로 EC2 인스턴스를 시작할 수 있습니다. [시작 템플릿](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-launch-templates.html)에는 AMI ID, 인스턴스 유형, 네트워크 설정, [AWS Identity and Access Management (IAM)](https://aws.amazon.com/iam/) 인스턴스 프로파일을 포함하여 Amazon EC2 인스턴스를 시작하는 데 사용되는 정보가 포함됩니다.

Amazon EC2 Auto Scaling 그룹에는 [최소 크기, 최대 크기, 희망 용량](https://docs.aws.amazon.com/autoscaling/ec2/userguide/what-is-amazon-ec2-auto-scaling.html) 개념이 있습니다. Amazon EC2 Auto Scaling은 Auto Scaling 그룹의 현재 실행 용량이 희망 용량보다 높거나 낮은 것을 감지하면 필요에 따라 자동으로 스케일 아웃 또는 스케일 인합니다. 이 스케일링 접근 방식을 통해 용량과 비용에 대한 한계를 유지하면서 워크로드의 탄력성을 활용할 수 있습니다.

이 솔루션을 시연하기 위해 두 개의 Amazon EC2 인스턴스를 포함하는 Amazon EC2 Auto Scaling 그룹을 생성했습니다. 이 인스턴스들은 [인스턴스 메트릭을 원격 쓰기](https://docs.aws.amazon.com/prometheus/latest/userguide/AMP-onboard-ingest-metrics-remote-write-EC2.html)하여 Amazon Managed Service for Prometheus 워크스페이스로 보냅니다. Auto Scaling 그룹의 최소 크기를 2로(고가용성 유지), 최대 크기를 10으로(비용 제어) 설정했습니다. 트래픽이 증가하면 Auto Scaling 그룹의 최대 크기까지 부하를 지원하기 위해 추가 Amazon EC2 인스턴스가 자동으로 추가됩니다. 부하가 감소하면 Auto Scaling 그룹의 최소 크기에 도달할 때까지 해당 Amazon EC2 인스턴스가 종료됩니다. 이 접근 방식을 통해 클라우드의 탄력성을 활용하여 높은 성능의 애플리케이션을 구현할 수 있습니다.

스크레이핑하는 리소스가 많아질수록 단일 Prometheus 서버의 용량을 빠르게 초과할 수 있습니다. 워크로드에 따라 Prometheus 서버를 선형적으로 확장하여 이 상황을 방지할 수 있습니다. 이 접근 방식은 원하는 세분화 수준으로 메트릭 데이터를 수집할 수 있도록 보장합니다.

Prometheus 워크로드의 Auto Scaling을 지원하기 위해 다음 규칙을 가진 Amazon Managed Service for Prometheus 워크스페이스를 생성했습니다:

` YAML `
```
groups:
- name: example
  rules:
  - alert: HostHighCpuLoad
    expr: 100 - (avg(rate(node_cpu_seconds_total{mode="idle"}[2m])) * 100) > 60
    for: 5m
    labels:
      severity: warning
      event_type: scale_up
    annotations:
      summary: Host high CPU load (instance {{ $labels.instance }})
      description: "CPU load is > 60%\n  VALUE = {{ $value }}\n  LABELS = {{ $labels }}"
  - alert: HostLowCpuLoad
    expr: 100 - (avg(rate(node_cpu_seconds_total{mode="idle"}[2m])) * 100) < 30
    for: 5m
    labels:
      severity: warning
      event_type: scale_down
    annotations:
      summary: Host low CPU load (instance {{ $labels.instance }})
      description: "CPU load is < 30%\n  VALUE = {{ $value }}\n  LABELS = {{ $labels }}"

```

이 규칙 세트는 `HostHighCpuLoad`와 `HostLowCpuLoad` 규칙을 생성합니다. 이러한 알림은 CPU 사용률이 5분 동안 60%를 초과하거나 30% 미만일 때 트리거됩니다.

알림이 발생하면 Alert Manager는 `alert_type`(알림 이름)과 `event_type`(scale_down 또는 scale_up)을 전달하여 Amazon SNS 토픽으로 메시지를 전달합니다.

` YAML `
```
alertmanager_config: |
  route: 
    receiver: default_receiver
    repeat_interval: 5m
        
  receivers:
    - name: default_receiver
      sns_configs:
        - topic_arn: <ARN OF SNS TOPIC GOES HERE>
          send_resolved: false
          sigv4:
            region: us-east-1
          message: |
            alert_type: {{ .CommonLabels.alertname }}
            event_type: {{ .CommonLabels.event_type }}

```

AWS [Lambda](https://aws.amazon.com/lambda/) 함수가 Amazon SNS 토픽에 구독되어 있습니다. Lambda 함수에 Amazon SNS 메시지를 검사하고 `scale_up` 또는 `scale_down` 이벤트가 발생해야 하는지 판단하는 로직을 작성했습니다. 그런 다음 Lambda 함수가 Amazon EC2 Auto Scaling 그룹의 희망 용량을 증가 또는 감소시킵니다. Amazon EC2 Auto Scaling 그룹이 요청된 용량 변경을 감지하면 Amazon EC2 인스턴스를 시작하거나 해제합니다.

Auto Scaling을 지원하는 Lambda 코드는 다음과 같습니다:

` Python `
```
import json
import boto3
import os

def lambda_handler(event, context):
    print(event)
    msg = event['Records'][0]['Sns']['Message']
    
    scale_type = ''
    if msg.find('scale_up') > -1:
        scale_type = 'scale_up'
    else:
        scale_type = 'scale_down'
    
    get_desired_instance_count(scale_type)
    
def get_desired_instance_count(scale_type):
    
    client = boto3.client('autoscaling')
    asg_name = os.environ['ASG_NAME']
    response = client.describe_auto_scaling_groups(AutoScalingGroupNames=[ asg_name])

    minSize = response['AutoScalingGroups'][0]['MinSize']
    maxSize = response['AutoScalingGroups'][0]['MaxSize']
    desiredCapacity = response['AutoScalingGroups'][0]['DesiredCapacity']
    
    if scale_type == "scale_up":
        desiredCapacity = min(desiredCapacity+1, maxSize)
    if scale_type == "scale_down":
        desiredCapacity = max(desiredCapacity - 1, minSize)
    
    print('Scale type: {}; new capacity: {}'.format(scale_type, desiredCapacity))
    response = client.set_desired_capacity(AutoScalingGroupName=asg_name, DesiredCapacity=desiredCapacity, HonorCooldown=False)

```

전체 아키텍처는 다음 그림에서 확인할 수 있습니다.

![Architecture](../images/ec2-autoscaling-amp-alertmgr/as-ec2-amp-alertmanager3.png)

## 솔루션 테스트

AWS CloudFormation 템플릿을 시작하여 이 솔루션을 자동으로 프로비저닝할 수 있습니다.

스택 사전 요구 사항:

* [Amazon Virtual Private Cloud (Amazon VPC)](https://aws.amazon.com/vpc/)
* 아웃바운드 트래픽을 허용하는 AWS Security Group

Download Launch Stack Template 링크를 선택하여 계정에서 템플릿을 다운로드하고 설정합니다. 구성 과정에서 Amazon EC2 인스턴스와 연결할 서브넷과 보안 그룹을 지정해야 합니다. 자세한 내용은 다음 그림을 참조하세요.

[## Download Launch Stack Template ](https://prometheus-autoscale.s3.amazonaws.com/prometheus-autoscale.template)

![Launch Stack](../images/ec2-autoscaling-amp-alertmgr/as-ec2-amp-alertmanager4.png)

이것은 CloudFormation 스택 세부 정보 화면으로, 스택 이름이 prometheus-autoscale로 설정되어 있습니다. 스택 파라미터에는 Prometheus용 Linux 설치 프로그램 URL, Prometheus용 Linux Node Exporter URL, 솔루션에서 사용되는 서브넷과 보안 그룹, 사용할 AMI 및 인스턴스 유형, Amazon EC2 Auto Scaling 그룹의 최대 용량이 포함됩니다.

스택 배포에 약 8분이 소요됩니다. 완료되면 생성된 Amazon EC2 Auto Scaling 그룹에서 두 개의 Amazon EC2 인스턴스가 배포되어 실행되고 있는 것을 확인할 수 있습니다. 이 솔루션이 Amazon Managed Service for Prometheus Alert Manager를 통해 Auto Scaling되는지 확인하려면, [AWS Systems Manager Run Command](https://docs.aws.amazon.com/systems-manager/latest/userguide/execute-remote-commands.html)와 [AWSFIS-Run-CPU-Stress 자동화 문서](https://docs.aws.amazon.com/fis/latest/userguide/actions-ssm-agent.html#awsfis-run-cpu-stress)를 사용하여 Amazon EC2 인스턴스에 부하를 가합니다.

Amazon EC2 Auto Scaling 그룹의 CPU에 스트레스가 가해지면 Alert Manager가 이러한 알림을 게시하고, Lambda 함수가 Auto Scaling 그룹을 스케일 업하여 응답합니다. CPU 소비가 감소하면 Amazon Managed Service for Prometheus 워크스페이스의 낮은 CPU 알림이 발동하고, Alert Manager가 Amazon SNS 토픽에 알림을 게시하며, Lambda 함수가 Auto Scaling 그룹을 스케일 다운하여 응답합니다. 다음 그림에서 이를 확인할 수 있습니다.

![Dashboard](../images/ec2-autoscaling-amp-alertmgr/as-ec2-amp-alertmanager5.png)

Grafana 대시보드에서 CPU가 100%까지 급증한 선을 볼 수 있습니다. CPU가 높지만 다른 선에서 인스턴스 수가 2에서 10으로 단계적으로 증가한 것을 보여줍니다. CPU가 감소하면 인스턴스 수가 서서히 2로 다시 감소합니다.

## 비용

Amazon Managed Service for Prometheus는 수집된 메트릭, 저장된 메트릭, 쿼리된 메트릭을 기준으로 과금됩니다. 최신 요금 및 요금 예제는 [Amazon Managed Service for Prometheus 요금 페이지](https://aws.amazon.com/prometheus/pricing/)를 참조하세요.

Amazon SNS는 월별 API 요청 수를 기준으로 과금됩니다. Amazon SNS와 Lambda 간의 메시지 전달은 무료이지만 Amazon SNS와 Lambda 간에 전송되는 데이터 양에 대해서는 요금이 부과됩니다. [최신 Amazon SNS 요금 세부 정보](https://aws.amazon.com/sns/pricing/)를 참조하세요.

Lambda는 함수 실행 시간과 함수에 대한 요청 수를 기준으로 과금됩니다. [최신 AWS Lambda 요금 세부 정보](https://aws.amazon.com/lambda/pricing/)를 참조하세요.

Amazon EC2 Auto Scaling [사용에 대한 추가 요금은 없습니다](https://aws.amazon.com/ec2/autoscaling/pricing/).

## 결론

Amazon Managed Service for Prometheus, Alert Manager, Amazon SNS, Lambda를 사용하면 Amazon EC2 Auto Scaling 그룹의 스케일링 활동을 제어할 수 있습니다. 이 글의 솔루션은 기존 Prometheus 워크로드를 AWS로 이전하면서 Amazon EC2 Auto Scaling도 활용하는 방법을 보여줍니다. 애플리케이션에 대한 부하가 증가하면 수요에 맞게 원활하게 확장됩니다.

이 예제에서는 Amazon EC2 Auto Scaling 그룹이 CPU를 기반으로 확장되었지만, 워크로드의 모든 Prometheus 메트릭에 대해 유사한 접근 방식을 따를 수 있습니다. 이 접근 방식은 스케일링 동작에 대한 세밀한 제어를 제공하여 비즈니스에 가장 큰 가치를 제공하는 메트릭으로 워크로드를 확장할 수 있도록 합니다.

이전 블로그 게시물에서 [PagerDuty를 사용하여 Amazon Managed Service for Prometheus Alert Manager에서 알림을 받는 방법](https://aws.amazon.com/blogs/mt/using-amazon-managed-service-for-prometheus-alert-manager-to-receive-alerts-with-pagerduty/)과 [Amazon Managed Service for Prometheus를 Slack과 통합하는 방법](https://aws.amazon.com/blogs/mt/how-to-integrate-amazon-managed-service-for-prometheus-with-slack/)을 시연했습니다. 이러한 솔루션은 가장 유용한 방식으로 워크스페이스에서 알림을 받는 방법을 보여줍니다.

다음 단계로, Amazon Managed Service for Prometheus용 [자체 규칙 구성 파일을 생성](https://docs.aws.amazon.com/prometheus/latest/userguide/AMP-rules-upload.html)하고 [알림 수신자를 설정](https://docs.aws.amazon.com/prometheus/latest/userguide/AMP-alertmanager-receiver.html)하는 방법을 참조하세요.

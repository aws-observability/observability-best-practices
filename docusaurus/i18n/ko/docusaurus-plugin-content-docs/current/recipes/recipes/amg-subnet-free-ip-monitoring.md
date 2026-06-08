# 서브넷의 사용 가능한 IP 모니터링

이 레시피에서는 서브넷에서 사용 가능한 IP를 모니터링하기 위한 모니터링 스택을 설정하는 방법을 보여줍니다.

[AWS Cloud Development Kit (CDK)](https://aws.amazon.com/cdk/)를 사용하여 Lambda, CloudWatch 대시보드 및 CloudWatch 알람을 생성하는 스택을 설정하여 서브넷의 사용 가능한 여유 IP를 모니터링합니다.

:::note
    이 가이드를 완료하는 데 약 30분이 소요됩니다.
:::
## 인프라
다음 섹션에서는 이 레시피를 위한 인프라를 설정합니다.

여기에 배포된 Lambda는 일정 간격으로 EC2 API를 호출하고 여유 IP 메트릭을 [CloudWatch Metrics](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/working_with_metrics.html)로 전송합니다.

### 사전 요구 사항

* AWS CLI가 환경에 [설치](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-install.html) 및 [구성](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-configure.html)되어 있어야 합니다.
* [AWS CDK Typescript](https://docs.aws.amazon.com/cdk/latest/guide/work-with-cdk-typescript.html)가 환경에 설치되어 있어야 합니다.
* Node.js가 설치되어 있어야 합니다.
* [저장소](https://github.com/aws-observability/observability-best-practices/)가 로컬 머신에 클론되어 있어야 합니다. 이 프로젝트의 코드는 `/sandbox/grafana_subnet_ip_monitoring` 아래에 있습니다.

### 종속성 설치

다음 명령으로 grafana_subnet_ip_monitoring 디렉토리로 이동합니다:

```
cd sandbox/grafana_subnet_ip_monitoring
```

이후로 이 디렉토리가 저장소의 루트로 간주됩니다.

다음 명령으로 CDK 종속성을 설치합니다:

```
npm install
```

모든 종속성이 설치되었습니다.

### 설정 파일 수정

저장소 루트에서 `lib/vpc_monitoring_stack.ts`를 열고 요구 사항에 따라 `subnetIds`, `alarmEmail`, `monitoringFrequencyMinutes`를 수정합니다.

예를 들어, 다음과 같이 수정합니다:

```
    const subnet_monitoring_stack = new SubnetMonitoringStack(this, 'SubnetIpMonitoringStack', {
      env: { 
        account: process.env.CDK_DEFAULT_ACCOUNT, 
        region: process.env.CDK_DEFAULT_REGION 
      },
      subnetIds: [
        'subnet-03e46f16d7dc01c0a', // Replace with your subnet IDs
        'subnet-0713ae10e4a8da850',
        'subnet-00a36dd76f1c51d97'
      ],
      ipThreshold: 50, // Alert when available IPs drop below 50
      alarmEmail: 'abc123@email.com', // Replace your email
      monitoringFrequencyMinutes: 5, // Check every 5 minutes
      evaluationPeriods: 2 // Require 2 consecutive breaches to trigger alarm
    });
```


### 스택 배포

위의 변경이 완료되면 CloudFormation에 스택을 배포할 차례입니다. CDK 스택을 배포하려면 다음 명령을 실행합니다:

```
cdk bootstrap
cdk deploy --all
```

## 정리

CloudFormation 스택을 삭제합니다:

```
cdk destroy
```

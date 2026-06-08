# Kotlin 서비스를 위한 Application Signals

## 소개

Kotlin 웹 애플리케이션의 성능과 상태를 모니터링하는 것은 다양한 구성 요소 간의 복잡한 상호작용으로 인해 어려울 수 있습니다. [Kotlin](https://kotlinlang.org/) 웹 서비스는 일반적으로 Java Archive(jar) 파일로 빌드되며, Java가 실행되는 모든 플랫폼에 배포할 수 있습니다. 이러한 애플리케이션은 데이터베이스, 외부 API, 캐싱 레이어 등 여러 상호 연결된 구성 요소를 포함하는 분산 환경에서 운영되는 경우가 많습니다. 이러한 복잡성은 평균 해결 시간(MTTR)을 크게 증가시킬 수 있습니다.

이 가이드에서는 Linux EC2 서버에서 실행 중인 Kotlin 웹 서비스를 자동 계측하는 방법을 설명합니다. [CloudWatch Application Signals](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-Application-Monitoring-Sections.html)를 활성화하면 [AWS Distro for OpenTelemetry](https://aws-otel.github.io/docs/introduction)(ADOT) Java Auto-Instrumentation Agent를 사용하여 코드 변경 없이 애플리케이션에서 메트릭과 트레이스를 수집할 수 있습니다. 호출 볼륨, 가용성, 지연 시간, 장애, 오류 등의 주요 메트릭을 활용하여 애플리케이션 서비스의 현재 운영 상태를 빠르게 확인하고 분류할 수 있으며, 장기적인 성능 및 비즈니스 목표를 충족하는지 검증할 수 있습니다.

## 사전 요구 사항

- CloudWatch Application Signals와 상호작용할 수 있는 적절한 [IAM 권한](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Application_Signals_Permissions.html)이 설정된 Linux EC2 인스턴스. 이 가이드에서는 [Amazon Linux](https://aws.amazon.com/linux/amazon-linux-2023/) 인스턴스를 사용하므로, 다른 운영 체제를 사용하는 경우 명령어가 약간 다를 수 있습니다.
- 인스턴스에 [SSH](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/connect-linux-inst-ssh.html)로 접속할 수 있는 환경.

## 솔루션 개요

고수준에서 수행할 단계는 다음과 같습니다.

- CloudWatch Application Signals 활성화.
- Fat jar로 [ktor 웹 서비스](https://ktor.io/) 배포.
- 웹 서비스에서 Application Signals를 수신하도록 구성된 CloudWatch agent 설치.
- [ADOT](https://aws-otel.github.io/docs/getting-started/java-sdk/auto-instr#introduction) Auto Instrumentation Agent 다운로드.
- Java agent와 함께 Kotlin 서비스 jar를 실행하여 서비스를 자동 계측.
- 텔레메트리를 생성하기 위한 테스트 실행.

### 아키텍처 다이어그램

![Architecture](./images/kotlin-arch.png)

### CloudWatch Application Signals 활성화

1단계: 계정에서 [Application Signals 활성화](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-Application-Signals-Enable-EC2.html#CloudWatch-Application-Signals-EC2-Grant)의 지침을 따르세요.

### Ktor 웹 서비스 배포
[Ktor](https://ktor.io/)는 웹 서비스를 만들기 위한 인기 있는 Kotlin 프레임워크입니다. 비동기 서버 사이드 애플리케이션을 빠르게 시작할 수 있게 해줍니다.

작업 디렉토리 생성
```
mkdir kotlin-signals && cd kotlin-signals
```

Ktor 예제 저장소 클론
```
git clone https://github.com/ktorio/ktor-samples.git && cd ktor-samples/structured-logging
```

애플리케이션 빌드
```
./gradlew build && cd build/libs
```

애플리케이션 실행 테스트
```
java -jar structured-logging-all.jar
```

서비스가 올바르게 빌드되고 실행되었다면, `ctrl + c`로 중지할 수 있습니다.

### CloudWatch Agent 구성
Amazon Linux 인스턴스에는 기본적으로 CloudWatch agent가 설치되어 있습니다. 인스턴스에 설치되어 있지 않은 경우 [설치](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/install-CloudWatch-Agent-on-EC2-Instance.html)해야 합니다.

설치가 완료되면 구성 파일을 생성할 수 있습니다.
```
sudo nano /opt/aws/amazon-cloudwatch-agent/bin/app-signals-config.json
```

다음 구성을 파일에 복사하여 붙여넣으세요.
```
{
    "traces": {
        "traces_collected": {
            "app_signals": {}
        }
    },
    "logs": {
        "metrics_collected": {
            "app_signals": {}
        }
    }
}
```

파일을 저장한 후 방금 생성한 구성으로 CloudWatch agent를 시작합니다.
```
sudo /opt/aws/amazon-cloudwatch-agent/bin/amazon-cloudwatch-agent-ctl -a fetch-config -m ec2 -s -c file:/opt/aws/amazon-cloudwatch-agent/bin/app-signals-config.json
```

### ADOT Auto Instrumentation Agent 다운로드

jar 파일이 있는 디렉토리로 이동합니다. 이 데모에서는 편의를 위해 agent를 여기에 배치합니다. 실제 시나리오에서는 별도의 폴더에 위치할 수 있습니다.

```
cd kotlin-signals/ktor-samples/structured-logging/build/libs
```

Auto Instrumentation Agent 다운로드
```
wget https://github.com/aws-observability/aws-otel-java-instrumentation/releases/latest/download/aws-opentelemetry-agent.jar
```

### ADOT agent와 함께 Ktor 서비스 실행
```
OTEL_RESOURCE_ATTRIBUTES=service.name=KotlinApp,service.namespace=MyKotlinService,aws.hostedin.environment=EC2 \
OTEL_AWS_APPLICATION_SIGNALS_ENABLED=true \
OTEL_AWS_APPLICATION_SIGNALS_EXPORTER_ENDPOINT=http://localhost:4316/v1/metrics \
OTEL_EXPORTER_OTLP_PROTOCOL=http/protobuf \
OTEL_EXPORTER_OTLP_TRACES_ENDPOINT=http://localhost:4316/v1/traces \
OTEL_METRICS_EXPORTER=none \
OTEL_LOGS_EXPORT=none \
java -javaagent:aws-opentelemetry-agent.jar -jar structured-logging-all.jar
```

### 텔레메트리 생성을 위한 서비스 트래픽 발생
```
for i in {1..1800}; do curl http://localhost:8080 && sleep 2; done
```

## 텔레메트리 확인

이제 CloudWatch의 'Services' 섹션에서 Kotlin 서비스가 표시되는 것을 확인할 수 있습니다.

![kotlin-service](./images/kotlin-services.png)

'Service Map'에서도 서비스를 확인할 수 있습니다.

![kotlin-service-map](./images/kotlin-service-map.png)

계측을 통해 지연 시간과 같은 유용한 메트릭을 제공합니다:

![kotlin-metrics](./images/kotlin-metrics.png)

### 다음 단계

여기서부터 다음 단계로는 서비스에 대한 [SLO](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-ServiceLevelObjectives.html) 생성을 포함한 [Application Signals 경험](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-Application-Monitoring-Sections.html)을 더 깊이 탐색하는 것입니다. 또한 Ktor에서 더 많은 Kotlin 마이크로서비스를 생성하여 더 복잡한 백엔드를 구성하는 것도 좋은 다음 단계입니다. 분산되고 복잡한 환경에서 Application Signals와 같은 도구의 가치가 가장 크게 나타납니다.

### 정리

EC2 인스턴스를 종료하고 `/aws/appsignals/generic` 로그 그룹을 삭제하세요.

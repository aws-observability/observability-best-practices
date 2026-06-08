# Java Spring Integration 애플리케이션 계측

이 문서에서는 [Open Telemetry](https://opentelemetry.io/)와 [X-ray](https://aws.amazon.com/xray/)를 활용하여 [Spring-Integration](https://docs.spring.io/spring-integration/reference/overview.html) 애플리케이션을 수동으로 계측하는 방법을 설명합니다.

Spring-Integration 프레임워크는 이벤트 기반 아키텍처와 메시징 중심 아키텍처에 적합한 통합 솔루션 개발을 위해 설계되었습니다. 반면 OpenTelemetry는 HTTP 요청을 통해 서비스 간 통신과 조정이 이루어지는 마이크로서비스 아키텍처에 더 초점을 맞추고 있습니다. 따라서 이 가이드에서는 OpenTelemetry API를 사용한 수동 계측으로 Spring-Integration 애플리케이션을 계측하는 방법의 예시를 제공합니다.

## 배경 정보

### 트레이싱이란?

[OpenTelemetry 문서](https://opentelemetry.io/docs/concepts/signals/traces/)의 다음 인용문은 trace의 목적에 대해 잘 설명하고 있습니다:

:::note
    Traces는 애플리케이션에 요청이 들어왔을 때 무슨 일이 일어나는지 전체적인 그림을 보여줍니다. 단일 데이터베이스를 가진 모놀리스이든, 복잡한 서비스 메시이든, traces는 요청이 애플리케이션에서 거치는 전체 "경로"를 이해하는 데 필수적입니다.
:::
트레이싱의 주요 이점 중 하나가 요청의 엔드투엔드 가시성이므로, 요청 발신지에서 백엔드까지 traces가 올바르게 연결되는 것이 중요합니다. OpenTelemetry에서 이를 수행하는 일반적인 방법은 [중첩된 spans](https://opentelemetry.io/docs/instrumentation/java/manual/#create-nested-spans)를 활용하는 것입니다. 이 방식은 마이크로서비스 아키텍처에서 spans가 서비스 간에 최종 목적지에 도달할 때까지 전달되는 방식으로 작동합니다. Spring Integration 애플리케이션에서는 원격과 로컬 모두에서 생성된 spans 간에 부모/자식 관계를 만들어야 합니다.

## Context Propagation을 활용한 트레이싱

Context propagation을 사용하는 접근 방식을 시연합니다. 이 접근 방식은 전통적으로 로컬과 원격 위치에서 생성된 spans 간에 부모/자식 관계를 만들어야 할 때 사용되지만, Spring Integration 애플리케이션의 경우에도 코드를 단순화하고 확장을 가능하게 하기 때문에 사용합니다: 여러 스레드에서 메시지를 병렬로 처리할 수 있고, 다른 호스트에서 메시지를 처리해야 하는 경우 수평 확장도 가능합니다.

이를 달성하기 위해 필요한 사항의 개요는 다음과 같습니다:

- ```ChannelInterceptor```를 생성하고 ```GlobalChannelInterceptor```로 등록하여 모든 채널에서 전송되는 메시지를 캡처할 수 있도록 합니다.

- ```ChannelInterceptor```에서:
  - ```preSend``` 메서드에서:
    - 업스트림에서 생성된 이전 메시지의 context를 읽으려고 시도합니다. 여기서 업스트림 메시지의 spans를 연결할 수 있습니다. context가 없으면 새 trace가 시작됩니다(OpenTelemetry SDK에 의해 수행됨). 
    - 해당 작업을 식별하는 고유한 이름으로 Span을 생성합니다. 이 메시지가 처리되는 채널의 이름이 될 수 있습니다.
    - 현재 context를 메시지에 저장합니다.
    - 나중에 닫을 수 있도록 context와 scope를 thread.local에 저장합니다.
    - 다운스트림으로 전송되는 메시지에 context를 주입합니다.
  - ```afterSendCompletion```에서:
    - thread.local에서 context와 scope를 복원합니다.
    - context에서 span을 재생성합니다.
    - 메시지 처리 중 발생한 예외를 등록합니다.
    - Scope를 닫습니다.
    - Span을 종료합니다.

이것은 수행해야 할 작업의 간략한 설명입니다. Spring-Integration 프레임워크를 사용하는 동작하는 샘플 애플리케이션을 제공합니다. 이 애플리케이션의 코드는 [여기](https://github.com/rapphil/spring-integration-samples/tree/rapphil-5.5.x-otel/applications/file-split-ftp)에서 확인할 수 있습니다.

애플리케이션을 계측하기 위해 적용된 변경 사항만 보려면 이 [diff](https://github.com/rapphil/spring-integration-samples/compare/30e01ce9eefd8dae288eca44013810afa8c1a585..6f056a76350340a9658db0cad7fc12dbda505437)를 참조하세요.

### 샘플 애플리케이션 실행 방법:

``` bash
# 빌드 및 실행
mvn spring-boot:run
# 플로우를 트리거할 샘플 입력 파일 생성
echo 'testcontent\nline2content\nlastline' > /tmp/in/testfile.txt
```

이 샘플 애플리케이션을 실험하려면 다음과 유사한 구성으로 애플리케이션과 동일한 머신에서 [ADOT collector](https://aws-otel.github.io/docs/getting-started/collector)가 실행되고 있어야 합니다:

``` yaml
receivers:
  otlp:
    protocols:
      grpc: 
        endpoint: 0.0.0.0:4317
      http:
        endpoint: 0.0.0.0:4318
processors:
  batch/traces:
    timeout: 1s
    send_batch_size: 50
  batch/metrics:
    timeout: 60s
exporters:
  aws xray: region:us-west-2
  aws emf:
    region: us-west-2
service:
  pipelines:
    traces:
      receivers: [otlp]
      processors: [batch/traces]
      exporters: [awsxray]
    metrics:
      receivers: [otlp]
      processors: [batch/metrics]
      exporters: [awsemf]
```

## 결과

샘플 애플리케이션을 실행한 후 다음 명령을 실행하면 아래와 같은 결과를 얻을 수 있습니다:

``` bash
echo 'foo123\nbar123\nfoo1234' > /tmp/in/testfile.txt
```

![X-ray 결과](x-ray-results.png)

위의 세그먼트가 샘플 애플리케이션에서 설명된 워크플로우와 일치하는 것을 확인할 수 있습니다. 일부 메시지 처리 시 예외가 예상되므로, 해당 예외가 올바르게 등록되어 X-Ray에서 문제를 해결할 수 있게 됩니다.


## FAQ

### 중첩된 spans는 어떻게 생성하나요?

OpenTelemetry에서 spans를 연결하는 데 사용할 수 있는 세 가지 메커니즘이 있습니다:

##### 명시적 방법

부모 span을 자식 span이 생성되는 위치로 전달하고 다음을 사용하여 둘을 연결해야 합니다:

``` java
    Span childSpan = tracer.spanBuilder("child")
    .setParent(Context.current().with(parentSpan)) 
    .startSpan();
```

##### 암시적 방법

span context가 내부적으로 thread.local에 저장됩니다.
이 방법은 동일한 스레드에서 spans를 생성하고 있다고 확신할 때 적합합니다.

``` java
    void parentTwo() {
        Span parentSpan = tracer.spanBuilder("parent").startSpan(); 
        try(Scope scope = parentSpan.makeCurrent()) {
            childTwo(); 
        } finally {
        parentSpan.end(); 
        }
    }
    void childTwo() {
        Span childSpan = tracer.spanBuilder("child")
            // 참고: setParent(...)는 필요하지 않습니다;
            // `Span.current()`가 자동으로 부모로 추가됩니다 
            .startSpan();
        try(Scope scope = childSpan.makeCurrent()) { 
            // 작업 수행
        } finally {
            childSpan.end();
        } 
    }
```

##### Context Propagation  

이 방법은 context를 어딘가(HTTP 헤더 또는 메시지)에 저장하여 자식 span이 생성되는 원격 위치로 전송될 수 있도록 합니다. 반드시 원격 위치여야 하는 것은 아닙니다. 동일한 프로세스 내에서도 사용할 수 있습니다.

### OpenTelemetry 속성은 어떻게 X-Ray 속성으로 변환되나요?

관계를 확인하려면 다음 [가이드](https://opentelemetry.io/docs/instrumentation/java/manual/#context-propagation)를 참조하세요.



  

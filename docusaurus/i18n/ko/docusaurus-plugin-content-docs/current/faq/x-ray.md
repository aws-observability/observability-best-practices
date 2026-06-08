# AWS X-Ray - FAQ

## AWS Distro for Open Telemetry (ADOT)는 Event Bridge 또는 SQS와 같은 AWS 서비스 간 트레이스 전파를 지원하나요?

엄밀히 말하면 ADOT가 아니라 AWS X-Ray의 기능입니다. 현재 스팬을 전파 및/또는 생성하는 AWS 서비스의 수와 유형을 확대하는 작업을 진행 중입니다. 이에 의존하는 사용 사례가 있다면 문의해 주세요.

## ADOT를 사용하여 W3C 트레이스 헤더로 AWS X-Ray에 스팬을 수집할 수 있나요?

네. [W3C 트레이스 헤더](https://aws.amazon.com/about-aws/whats-new/2023/10/aws-x-ray-w3c-format-trace-ids-distributed-tracing/)는 2023년 10월 27일에 출시되었습니다.

## SQS가 중간에 관여할 때 Lambda 함수 간의 요청을 추적할 수 있나요?

네. X-Ray는 이제 SQS가 중간에 관여할 때 Lambda 함수 간의 추적을 지원합니다. 업스트림 메시지 생산자의 트레이스가 다운스트림 Lambda 소비자 노드의 트레이스에 [자동으로 연결](https://docs.aws.amazon.com/xray/latest/devguide/xray-services-sqs.html)되어 애플리케이션의 엔드투엔드 뷰를 제공합니다.

## 애플리케이션을 계측하려면 X-Ray SDK와 OTel SDK 중 어떤 것을 사용해야 하나요?

OTel은 X-Ray SDK보다 더 많은 기능을 제공하지만, 사용 사례에 적합한 것을 선택하려면 [ADOT와 X-Ray SDK 중 선택하기](https://docs.aws.amazon.com/xray/latest/devguide/xray-instrumenting-your-app.html#xray-instrumenting-choosing)를 참조하세요.

##  [스팬 이벤트](https://opentelemetry.io/docs/instrumentation/ruby/manual/#add-span-events)가 AWS X-Ray에서 지원되나요?

스팬 이벤트는 X-Ray 모델에 맞지 않으므로 삭제됩니다.

## AWS X-Ray에서 데이터를 어떻게 추출할 수 있나요?

[X-Ray API를 사용하여](https://docs.aws.amazon.com/xray/latest/devguide/xray-api-gettingdata.html) 서비스 그래프, 트레이스 및 근본 원인 분석 데이터를 검색할 수 있습니다.

## 100% 샘플링을 달성할 수 있나요? 즉, 모든 트레이스를 샘플링 없이 기록하고 싶습니다.

샘플링 규칙을 조정하여 상당히 증가된 양의 트레이스 데이터를 캡처할 수 있습니다. 전송된 총 세그먼트가 [여기에 언급된 서비스 할당량 제한](https://docs.aws.amazon.com/general/latest/gr/xray.html#limits_xray)을 초과하지 않는 한, X-Ray는 구성된 대로 데이터를 수집하기 위해 노력합니다. 그러나 이것이 100% 트레이스 데이터 캡처를 결과적으로 보장하지는 않습니다.

## API를 통해 샘플링 규칙을 동적으로 늘리거나 줄일 수 있나요?

네, [X-Ray 샘플링 API](https://docs.aws.amazon.com/xray/latest/devguide/xray-api-sampling.html)를 사용하여 필요에 따라 동적으로 조정할 수 있습니다. 사용 사례 기반 설명은 이 [블로그](https://aws.amazon.com/blogs/mt/dynamically-adjusting-x-ray-sampling-rules/)를 참조하세요.

**제품 FAQ:** [https://aws.amazon.com/xray/faqs/](https://aws.amazon.com/xray/faqs/)
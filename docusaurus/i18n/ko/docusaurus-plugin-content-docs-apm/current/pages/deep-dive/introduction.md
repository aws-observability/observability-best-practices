# 소개

이 가이드에서는 Application Signals의 기술 아키텍처, 계측 전략 및 구현 방법을 살펴봅니다. 특히 기존의 X-Ray 샘플링 방식에서 새로운 종합적인 Observability 접근 방식으로 마이그레이션해야 하는 이유에 초점을 맞춥니다.

## 가이드 구성

| 섹션 | 설명 |
|---|---|
| [기존 모니터링의 문제점](../challenges.md)) | 레거시 모니터링이 현대적인 클라우드 네이티브 애플리케이션에 부적합한 이유 |
| [X-Ray에서 마이그레이션해야 하는 이유](../why-migrate-from-xray.md)) | 기존 X-Ray 대비 Application Signals + Transaction Search 도입의 이점 |
| [설정 및 구성](../setup.md)) | Application Signals, Transaction Search 및 샘플링을 활성화하는 단계별 가이드 |
| [계측 및 Collector 설정](../instrumentation-setups.md)) | 계측 방법 및 상세 Collector 아키텍처 (ADOT + CW Agent, ADOT + Custom Collector, Upstream OTEL, Collector-less, X-Ray 레거시) |
| [계측 샘플](../instrumentation-samples.md)) | Java, Python, Node.js, .NET, Go, Rust용 언어별 코드 예제 및 데모 애플리케이션 |
| [리소스](../resources.md)) | 문서 링크, 기술 리소스 및 교육 자료 |

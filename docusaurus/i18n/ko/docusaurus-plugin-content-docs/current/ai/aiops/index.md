---
sidebar_position: 2
---

# AIOps

AI와 머신러닝을 활용한 클라우드 운영 향상 — 이상 탐지, 자동화된 근본 원인 분석, 예측 알림, 지능형 자동 복구.

## AIOps를 위한 AWS 서비스

- **[Amazon DevOps Guru](https://aws.amazon.com/devops-guru/)** — ML 기반 인사이트를 통해 비정상적인 애플리케이션 동작을 감지하고 복구 방법을 제안합니다
- **[CloudWatch Anomaly Detection](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch_Anomaly_Detection.html)** — ML 알고리즘을 적용하여 메트릭을 지속적으로 분석하고 이상을 식별합니다
- **[CloudWatch Application Signals](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-Application-Monitoring-Sections.html)** — 애플리케이션 서비스와 종속성을 자동으로 검색하고 모니터링합니다
- **[Amazon Q Developer operational investigations](https://docs.aws.amazon.com/amazonq/latest/qdeveloper-ug/operational-investigation.html)** — AI 지원 운영 문제 조사

## 모범 사례

- 인프라로 확장하기 전에 주요 비즈니스 메트릭의 이상 탐지부터 시작하세요
- 개별 ML 기반 감지기의 노이즈를 줄이기 위해 복합 알람을 사용하세요
- AIOps 신호를 사람의 판단과 결합하세요 — ML은 문제를 표면화하는 데 사용하고, 검토 없이 중요 시스템을 자동 복구하는 데는 사용하지 마세요
- AI 지원 조사의 정확도를 높이기 위해 운영 런북과 과거 인시던트 데이터를 활용하세요

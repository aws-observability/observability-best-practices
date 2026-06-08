# Amazon CloudWatch Database Insights로 데이터베이스 모니터링

## 소개

Amazon CloudWatch Database Insights는 Amazon RDS 및 Aurora 데이터베이스를 위한 통합 모니터링 솔루션입니다. 데이터베이스 메트릭, 쿼리 분석, 로그, 이벤트, 애플리케이션 텔레메트리를 CloudWatch 콘솔 내 단일 경험으로 통합하여 데이터베이스 계층에서 무슨 일이 일어나고 있는지 이해하기 위해 여러 도구를 전환할 필요를 없앱니다.

이 문서에서는 Database Insights가 제공하는 기능, 두 가지 운영 모드 중에서 선택하는 방법, 데이터베이스를 효과적으로 모니터링하기 위한 실용적인 가이드, 도입 전에 알아야 할 제한 사항을 다룹니다.

---

## Database Insights란?

Database Insights는 Amazon RDS Performance Insights를 기반으로 하며, 플릿 전체 모니터링, 로그 상관관계 분석, 잠금 분석, 실행 계획 캡처, 애플리케이션 수준 통합 기능을 추가로 제공합니다. 곧 수명이 종료되는 독립형 Performance Insights 콘솔 경험의 후속 서비스입니다.

핵심 개념은 **DB Load**입니다. 이는 특정 시점에 데이터베이스에서 활성 상태인 세션의 평균 수를 의미합니다. DB Load가 인스턴스의 vCPU 수를 초과하면 데이터베이스에 과부하가 걸린 상태입니다. Database Insights는 이 메트릭을 시각화하고, 여러 차원(SQL, 대기 이벤트, 사용자, 호스트, 애플리케이션)으로 분할하여 성능 문제의 근본 원인을 빠르게 식별할 수 있도록 합니다.

---

## Standard 모드 vs. Advanced 모드

Database Insights는 두 가지 티어로 운영됩니다. Standard 모드는 추가 비용 없이 기본적으로 활성화됩니다. Advanced 모드는 15개월 보존 기간으로 Performance Insights를 활성화해야 하며, vCPU 시간(프로비저닝) 또는 ACU 시간(서버리스/리미트리스) 기준으로 요금이 부과됩니다.

| 기능 | Standard | Advanced |
|---|:---:|:---:|
| 차원별 상위 DB Load 기여 요인 분석 | ✔ | ✔ |
| 메트릭 쿼리, 그래프, 알람 (7일 보존) | ✔ | ✔ |
| 민감한 차원에 대한 세분화된 IAM 접근 제어 | ✔ | ✔ |
| 플릿 전체 모니터링 뷰 | ✘ | ✔ |
| OS 프로세스 분석 (Enhanced Monitoring) | ✘ | ✔ |
| SQL 잠금 분석 (15개월 보존) | ✘ | ✔ (Aurora PG) |
| SQL 실행 계획 분석 (15개월 보존) | ✘ | ✔ (Aurora PG, Oracle, SQL Server) |
| 쿼리별 통계 시각화 | ✘ | ✔ |
| 느린 SQL 쿼리 분석 | ✘ | ✔ |
| Application Signals 통합 (호출 서비스) | ✘ | ✔ |
| 통합 텔레메트리 대시보드 (메트릭, 로그, 이벤트) | ✘ | ✔ |
| Performance Insights 카운터 메트릭 자동 가져오기 | ✘ | ✔ |
| CloudWatch 내 RDS 이벤트 | ✘ | ✔ |
| 온디맨드 성능 분석 보고서 | ✘ | ✔ |
| 교차 계정 교차 리전 모니터링 | ✘ | ✔ |

**데이터 보존:**
- Standard: Performance Insights 데이터 7일 보존.
- Advanced: Database Insights가 수집하는 모든 메트릭 15개월 보존.

---

## 주요 기능 설명

### Fleet Health 대시보드

Fleet Health Dashboard는 모든 RDS 및 Aurora 인스턴스를 교차 계정, 교차 리전으로 하나의 화면에서 조감도처럼 보여줍니다. 허니콤(벌집) 시각화가 vCPU 용량 대비 DB Load를 기준으로 인스턴스를 상태별(High, Warning, Ok, Idle)로 분류합니다. 태그(환경, 서비스, 팀)로 필터링하고 사용자 정의 플릿 뷰를 저장할 수 있습니다. 상위 10개 차트에서 가장 부하가 높은 인스턴스, 해당 상위 쿼리, 상위 대기 이벤트를 한눈에 확인할 수 있습니다.

수백 개의 데이터베이스를 담당하면서 어떤 데이터베이스에 주의가 필요한지 빠르게 식별해야 할 때, 바로 여기서 시작하면 됩니다.

### DB Load 분석 (조사 워크벤치)

인스턴스 대시보드의 DB Load Analysis 탭은 문제 해결 시 가장 많은 시간을 보내는 곳입니다. 다음 다섯 가지 질문에 답합니다:

- **무엇(WHAT)** — SQL로 분할하여 어떤 쿼리가 부하를 발생시키는지 확인합니다.
- **누가(WHO)** — 사용자 또는 애플리케이션으로 분할하여 담당 주체를 식별합니다.
- **어디서(WHERE)** — 호스트로 분할하여 소스 머신을 찾습니다.
- **언제(WHEN)** — 타임라인에서 문제가 정확히 언제 시작되고 끝났는지 확인합니다.
- **왜(WHY)** — 발견 사항을 연관시키고 조치를 취합니다.

Top SQL 테이블은 부하 기여도 순으로 쿼리를 순위화하고, 초당 호출 수, 평균 지연 시간, 검사된 행 수, 플랜 수를 표시합니다.

### 잠금 분석

Aurora PostgreSQL 및 RDS for PostgreSQL에서 사용할 수 있습니다. Database Insights는 15초마다 잠금 스냅샷을 캡처하고 이를 잠금 트리로 시각화합니다. 부모 노드는 차단 세션이고, 자식 노드는 대기 세션입니다. 차단 SQL, 지속 시간, 하위에 영향을 받는 세션 수를 확인할 수 있습니다. DB Load 차트에서 "Sliced by: Blocking SQL" 옵션을 선택하면 시간 경과에 따라 어떤 SQL 문이 잠금 경합을 유발하는지 볼 수 있습니다.

### 실행 계획 분석

Aurora PostgreSQL(v14.10+, v15.5+), RDS for Oracle, RDS for SQL Server에서 사용할 수 있습니다. Top SQL 테이블의 Plans Count 열은 각 쿼리에 대해 몇 개의 서로 다른 실행 계획이 존재하는지 보여줍니다. 플랜을 나란히 비교하여 플랜 변경이 성능 저하를 유발한 시점을 식별할 수 있습니다. 플랜 수가 높으면 옵티마이저가 불안정하다는 신호입니다.

### 데이터베이스 텔레메트리

다음을 포함하는 통합 탭입니다:
- **메트릭** — CloudWatch, OS, 엔진 카운터 메트릭의 사용자 정의 가능한 대시보드.
- **로그** — CloudWatch Logs로 내보낸 데이터베이스 로그를 인라인으로 조회.
- **OS 프로세스** — Enhanced Monitoring에서 제공하는 프로세스별 CPU/메모리 정보.
- **느린 SQL 쿼리** — 패턴별로 그룹화되고 빈도순으로 정렬된 느린 쿼리.
- **이벤트** — RDS 운영 이벤트(장애 조치, 유지 보수, 구성 변경).

### 호출 서비스 (CloudWatch Application Signals 통합)

이 APM(Application Performance Monitoring) 통합은 어떤 업스트림 마이크로서비스가 데이터베이스를 호출하고 있는지를 가용성, 지연 시간, 오류율, 요청량과 함께 보여줍니다. "데이터베이스가 느리다"와 "이 특정 서비스와 함수가 원인이다" 사이의 간극을 메웁니다.

### 온디맨드 성능 분석

DB Load 차트에서 원하는 시간 구간을 선택하고 "Analyze Performance"를 선택하면 자동화된 ML 기반 분석이 실행됩니다. Database Insights는 머신 러닝 모델을 활용하여 선택한 기간을 데이터베이스의 정상 기준선 동작과 비교하고, 여러 차원(SQL 문, 대기 이벤트, 호스트, 사용자 등)을 스캔하여 이상 징후와 근본 원인을 표면화합니다(예: "대기 이벤트가 CPU에서 I/O로 전환되면서 DB Load가 4배 증가"). 각 보고서에는 구체적인 해결 가이드와 함께 우선순위가 매겨진 발견 사항이 포함되어, 진단 평균 소요 시간을 수 시간에서 수 분으로 단축합니다. 보고서는 15개월 메트릭 이력과 함께 보존되므로 사후 인시던트 검토 시 쉽게 조회할 수 있습니다.

---

## 제한 사항

Database Insights를 도입하기 전에 다음 제약 사항을 숙지하세요:

### 엔진 및 기능 가용성

- **잠금 분석**은 Aurora PostgreSQL 및 RDS for PostgreSQL에서만 사용 가능합니다.
- **실행 계획 분석**은 Aurora PostgreSQL(v14.10+/v15.5+), RDS for Oracle, RDS for SQL Server에서만 사용 가능합니다.
- 모든 Advanced 모드 기능이 모든 AWS 리전에서 사용 가능한 것은 아닙니다.
- Aurora PostgreSQL Limitless Database는 지원되지만, 기능이 제한됩니다(샤드 그룹 수준에서 잠금 분석 및 실행 계획 분석 불가).

### 데이터 및 구성 요구사항

- **느린 SQL 분석**을 사용하려면 CloudWatch Logs로의 데이터베이스 로그 내보내기를 활성화하고 적절한 DB 파라미터를 구성해야 합니다(예: PostgreSQL의 `log_min_duration_statement`, MySQL의 `slow_query_log`).
- **OS 프로세스 데이터**를 보려면 Enhanced Monitoring을 활성화해야 합니다(추가 비용 발생).
- Aurora PostgreSQL에서 **실행 계획** 캡처를 하려면 `aurora_compute_plan_id` 파라미터를 `on`으로 설정해야 합니다. 추정 플랜이 아닌 실제 플랜을 보려면 추가로 `aurora_stat_plans.with_analyze`가 필요합니다.
- **호출 서비스** 기능을 사용하려면 애플리케이션에 CloudWatch Application Signals 계측이 되어 있어야 합니다.
- `pg_stat_statements`는 Aurora PostgreSQL 10 이상에서 기본적으로 로드되지만, SQL 텍스트는 `track_activity_query_size`(기본값 1,024바이트)에서 잘립니다. 긴 쿼리는 불완전하게 표시될 수 있습니다.

### 운영상 제한 사항

- 잠금 분석 스냅샷은 15초마다 수집되므로, 매우 짧은 시간 동안만 유지되는 잠금은 포착되지 않을 수 있습니다.
- Fleet Health Dashboard에서 저장된 플릿 뷰를 사용하려면 Advanced 모드가 필요합니다.
- 교차 계정 모니터링을 사용하려면 모니터링 계정과 소스 계정 모두에서 CloudWatch Observability Access Manager(OAM)를 설정해야 합니다.
- 성능 분석 보고서는 시작 시간이 보존 기간을 벗어나면 삭제됩니다.
- Database Telemetry 탭의 대시보드 사용자 정의는 엔진 유형별, 리전별, 계정별로 적용되며 인스턴스별로는 적용되지 않습니다.

### 비용 고려사항

- Advanced 모드는 vCPU 시간(프로비저닝) 또는 ACU 시간(서버리스/리미트리스) 단위로 요금이 부과됩니다. 대규모 플릿의 경우 비용이 상당할 수 있습니다.
- Enhanced Monitoring은 별도 요금이 부과됩니다.
- 로그 내보내기를 활성화하면 CloudWatch Logs 수집 및 저장 비용이 발생합니다.
- 클러스터 내 개별 인스턴스에만 Advanced 모드를 활성화할 수는 없습니다. DB 클러스터 전체에 적용됩니다.

---

## 모범 사례

### Standard로 시작하고, 전략적으로 업그레이드

Standard 모드는 무료이며 7일 보존의 DB Load 분석을 제공합니다. 15개월 보존, 플릿 뷰, 잠금 분석, 실행 계획 캡처가 필요한 프로덕션 핵심 데이터베이스에 Advanced 모드를 활성화하세요. 모든 개발/테스트 인스턴스에 Advanced 모드가 필요한 것은 아닙니다.

### 인스턴스에 일관된 태그 지정

Database Insights 플릿 뷰는 태그로 필터링됩니다. 일관된 태그 전략(예: `environment`, `service`, `team`)을 채택하여 "결제 서비스의 모든 프로덕션 데이터베이스"와 같은 의미 있는 플릿 뷰를 만들 수 있도록 하세요.

### 로그 내보내기를 조기에 활성화

느린 SQL 분석과 Database Telemetry의 로그 섹션은 CloudWatch Logs로의 로그 내보내기가 활성화되어 있어야만 작동합니다. 나중에가 아닌 인스턴스 생성 시점에 설정하세요. 내보내기가 활성화되기 전의 과거 느린 쿼리는 분석할 수 없습니다.

### DB Load에 대한 알람 설정

인스턴스의 vCPU 수 대비 `DBLoad` 메트릭에 CloudWatch Alarms를 생성하세요. DB Load가 vCPU 수를 지속적으로 초과하면 세션이 대기열에 쌓이고 있다는 의미입니다. 고객이 체감하기 전에 알림을 받으세요.

### Who/What/Where/When 프레임워크 사용

성능 문제를 조사할 때 "Sliced by" 드롭다운을 체계적으로 활용하세요:
1. **SQL** — 문제 쿼리를 식별합니다.
2. **Application** 또는 **User** — 누가 실행하고 있는지 식별합니다.
3. **Host** — 어디서 발생하는지 식별합니다.
4. **Timeline** — 언제 시작되었는지 식별합니다.

이 구조화된 접근 방식은 불필요한 삽질을 방지합니다.

### Aurora PostgreSQL에 대한 실행 계획 캡처 활성화

클러스터 파라미터 그룹에서 `aurora_compute_plan_id = on`을 설정하세요. 플랜 회귀는 갑작스러운 성능 저하의 가장 흔한 원인 중 하나이며, 플랜 캡처 없이는 원인 파악이 불가능합니다. 오버헤드는 미미합니다.

### 사후 인시던트 검토를 위한 온디맨드 분석 사용

성능 인시던트 발생 후, 영향을 받은 시간 구간에 대해 성능 분석 보고서를 생성하세요. COE나 포스트모템에 첨부할 수 있는 자동화된 요약을 제공하며, 15개월간 보존됩니다.

### 멀티 계정 아키텍처를 위한 교차 계정 모니터링 활용

조직에서 서비스나 환경별로 별도의 AWS 계정을 사용하는 경우, OAM으로 CloudWatch 교차 계정 Observability를 설정하세요. 이를 통해 중앙 모니터링 계정에서 모든 계정과 리전에 걸친 Fleet Health Dashboard를 볼 수 있으며, 공유 데이터베이스 인프라를 관리하는 플랫폼 팀에 필수적입니다.

### SQL 텍스트에 대한 접근 제한

IAM 정책을 사용하여 SQL 텍스트 차원에 대한 접근을 제한하세요. 데이터베이스 쿼리에는 민감한 데이터(WHERE 절의 고객 ID, 이메일 주소 등)가 포함될 수 있습니다. 전체 SQL 가시성은 DBA에게만 부여하고, 다른 역할은 집계된 메트릭으로 제한하세요.

---

## 실천 가이드: 지금 바로 해야 할 것들

### 처음 시작하는 경우:

1. **Verify Standard mode is active** — 기본적으로 활성화되어 있어야 합니다. CloudWatch → Insights → Database Insights로 이동하여 인스턴스가 표시되는지 확인하세요.
2. **Enable log export** — 프로덕션 데이터베이스에서 CloudWatch Logs로 로그 내보내기를 활성화하세요.
3. **Set up CloudWatch Alarms** — `CPUUtilization`, `DatabaseConnections`, `DBLoad`에 대해 알람을 설정하세요.
4. **Tag your instances** — 환경, 서비스, 팀 태그를 인스턴스에 지정하세요.

### 프로덕션 워크로드를 실행하는 경우:

1. **Enable Advanced mode** — 프로덕션 클러스터에서 활성화하세요. 15개월 보존과 플릿 뷰는 프로덕션에서 비용 대비 충분한 가치가 있습니다.
2. **Enable Enhanced Monitoring** — OS 수준 가시성을 확보할 수 있습니다.
3. **Set `aurora_compute_plan_id = on`** — Aurora PostgreSQL에서 실행 계획 캡처를 위해 설정하세요.
4. **Create fleet health views** — 프로덕션 태그로 필터링하여 생성하세요.
5. **Instrument your applications** — CloudWatch Application Signals를 계측하여 Calling Services 뷰를 활성화하세요.

### 대규모 플릿을 관리하는 경우:

1. **Set up cross-account cross-region monitoring** — OAM을 사용하여 구성하세요.

   OAM 작동 방식:
   - **Monitoring account** — 팀이 대시보드를 조회하는 중앙 계정입니다. 여기에 다른 계정의 데이터를 수신하는 "sink"를 생성합니다.
   - **Source accounts** — 실제로 데이터베이스를 운영하는 계정입니다. 각 소스 계정에서 모니터링 계정의 sink로 "link"를 생성하여 CloudWatch 데이터 읽기 권한을 부여합니다.

   연결이 완료되면 모니터링 계정에서 모든 소스 계정의 메트릭, 로그, 트레이스를 로컬 데이터처럼 볼 수 있습니다. 연결된 모든 계정과 리전의 인스턴스를 단일 뷰로 보여주는 Database Insights Fleet Health Dashboard도 포함됩니다.
2. **Create multiple fleet views** — 팀, 서비스, 환경별로 분류하여 생성하세요.
3. **Establish a triage workflow** — Fleet Health → 과부하 인스턴스 식별 → DB Load Analysis → who/what/where/when → 조치 순서로 수립하세요.
4. **Run periodic on-demand analyses** — 트래픽이 가장 높은 인스턴스에 대해 정기적으로 실행하여, 인시던트로 발전하기 전에 성능 저하를 포착하세요.

---

## 결론

CloudWatch Database Insights는 기존에 여러 도구 — Performance Insights, CloudWatch Metrics, CloudWatch Logs, RDS 콘솔 — 를 사용해야 했던 것을 하나의 안내된 경험으로 통합합니다. Standard 모드는 추가 비용 없이 즉각적인 가시성을 제공합니다. Advanced 모드는 본격적인 프로덕션 모니터링에 필요한 깊이를 추가합니다: 플릿 뷰, 잠금 트리, 실행 계획, 느린 쿼리 분석, 15개월 보존.

사고 방식의 핵심 전환은 사후 대응("데이터베이스가 느려, SSH로 접속해서 pg_stat_activity를 쿼리해봐야지")에서 사전 예방("전체 플릿의 상태를 볼 수 있고, 어떤 인스턴스든 드릴다운하여 2분 안에 단일 콘솔에서 who/what/where/when에 답할 수 있다")으로 전환하는 것입니다. Database Insights는 커스텀 도구나 서드파티 솔루션 없이도 이 워크플로를 가능하게 합니다.

---

## 참고 자료

- [CloudWatch Database Insights Documentation](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Database-Insights.html)
- [Get Started with Database Insights](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Database-Insights-Get-Started.html)
- [Lock Analysis](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Database-Insights-Lock-Analysis.html)
- [Execution Plan Analysis](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Database-Insights-Execution-Plans.html)
- [Amazon CloudWatch Pricing](https://aws.amazon.com/cloudwatch/pricing/)

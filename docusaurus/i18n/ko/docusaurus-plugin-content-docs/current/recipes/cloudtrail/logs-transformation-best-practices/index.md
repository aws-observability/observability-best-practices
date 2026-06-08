# CloudWatch Logs Transformation을 활용한 CloudTrail 보강

## 소개

[AWS CloudTrail](https://docs.aws.amazon.com/awscloudtrail/latest/userguide/cloudtrail-user-guide.html)은 AWS API 활동에 대한 포괄적인 감사 범위를 제공하여 조직의 완벽한 보안 및 규정 준수 기반을 구축합니다. 이러한 로그를 [Amazon CloudWatch Logs](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/WhatIsCloudWatchLogs.html)로 전송할 때, [CloudWatch Logs Transformation](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/CloudWatch-Logs-Transformation.html)을 사용하면 커스텀 Lambda 함수, 외부 ETL 파이프라인 또는 후처리 스크립트 없이 CloudTrail 데이터를 보강하고 최적화할 수 있습니다.

선언적 JSON 프로세서 구성을 사용하여 CloudTrail 이벤트가 CloudWatch Logs로 유입될 때 중첩된 필드를 파싱하고, 보안 컨텍스트를 추가하고, 리소스를 분류하고, 다운스트림 전달을 위한 데이터를 최적화할 수 있습니다. 이 가이드에서는 AWS 네이티브 로그 관리의 단순성과 안정성을 유지하면서 보안 모니터링, 규정 준수 보고 및 운영 효율성을 위한 실용적인 변환 패턴을 소개합니다.

## 이것이 중요한 이유

[CloudTrail 로그를 CloudWatch Logs로 전송](https://docs.aws.amazon.com/awscloudtrail/latest/userguide/send-cloudtrail-events-to-cloudwatch-logs.html)하는 조직은 특정 운영 워크플로우 및 도구 요구사항에 맞게 이 데이터를 향상시켜야 하는 경우가 많습니다:

- **보안 팀**은 위협 탐지 워크플로우를 가속화하기 위해 커스텀 위험 지표 및 분류 태그를 추가하고자 합니다
- **규정 준수 팀**은 감사 대응을 간소화하기 위해 이벤트를 규정 프레임워크(PCI-DSS, HIPAA, SOC2)별로 사전 분류해야 합니다
- **운영 팀**은 멀티 계정 환경을 관리하면서 CloudTrail의 기술적 이벤트 데이터에 환경 레이블, 비용 센터 또는 팀 소유권과 같은 비즈니스 컨텍스트를 추가하고자 합니다
- **모든 팀**이 다운스트림 시스템(SIEM, OpenSearch, S3)으로 데이터를 전달할 때 데이터 구조를 최적화하려 합니다—도구 호환성을 위해 중첩 필드를 평탄화하거나 다운스트림 수집 비용을 줄이기 위해 보안 관련 필드에 집중합니다

네이티브 변환 기능 없이는 팀이 커스텀 Lambda 함수를 구축하거나, 외부 ETL 파이프라인을 유지하거나, 후처리를 수행해야 하여 로그 관리 인프라에 복잡성, 지연 시간 및 운영 오버헤드를 추가하게 됩니다.

## CloudWatch Logs와 Transformation 작동 방식

### CloudWatch Logs

[Amazon CloudWatch Logs](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/WhatIsCloudWatchLogs.html)는 CloudTrail의 감사 로그 대상으로 사용됩니다. CloudTrail이 CloudWatch Logs로 로그를 전송하면 각 API 이벤트는 [로그 그룹 및 스트림](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/Working-with-log-groups-and-streams.html) 내에 구성된 로그 이벤트가 되어 조직이 다음을 수행할 수 있습니다:

- [CloudWatch Logs Insights](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/AnalyzingLogData.html)를 사용한 최근 API 활동 쿼리
- [메트릭 필터 및 알람](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/MonitoringLogData.html)을 사용한 보안 알림 생성
- [구독 필터](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/SubscriptionFilters.html)를 사용한 다운스트림 시스템으로 로그 전달

### CloudWatch Logs Transformation

[CloudWatch Logs Transformation](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/CloudWatch-Logs-Transformation.html)은 선언적 [프로세서](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/CloudWatch-Logs-Transformation-Processors.html)를 사용하여 수집 중에 로그 데이터를 수정할 수 있게 합니다. Transformation은 다음과 같은 작업을 지정하는 JSON 구성으로 정의됩니다:

- [parseJSON](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/CloudWatch-Logs-Transformation-Processors.html#CloudWatch-Logs-Transformation-parseJSON): JSON 구조 파싱 및 중첩 필드 추출
- [copyValue](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/CloudWatch-Logs-Transformation-Processors.html#CloudWatch-Logs-Transformation-copyValue): 보강을 위해 값을 새 필드로 복사
- [substituteString](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/CloudWatch-Logs-Transformation-Processors.html#CloudWatch-Logs-Transformation-substituteString): 패턴 기반 문자열 대체 수행
- [deleteKeys](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/CloudWatch-Logs-Transformation-Processors.html#CloudWatch-Logs-Transformation-deleteKeys): 불필요한 필드 제거

로그 그룹에 적용되면 Transformation은 저장 전에 모든 수신 로그 이벤트에 대해 자동으로 실행됩니다. 원본 버전과 변환된 버전 모두 CloudWatch Logs에 보존되며, [구독 필터](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/SubscriptionFilters.html)는 변환된 데이터를 다운스트림 시스템으로 전달하고 CloudWatch Logs Insights 쿼리는 분석을 위해 변환된 버전을 표시합니다. [GetLogEvents](https://docs.aws.amazon.com/AmazonCloudWatchLogs/latest/APIReference/API_GetLogEvents.html) 및 [FilterLogEvents](https://docs.aws.amazon.com/AmazonCloudWatchLogs/latest/APIReference/API_FilterLogEvents.html) API는 변환된 버전이 아닌 원본 로그 버전을 반환합니다.

## 솔루션

CloudWatch Logs Transformation은 커스텀 인프라를 제거하면서 즉각적인 운영 가치를 제공하는 네이티브 실시간 보강 기능을 통해 이러한 과제를 해결합니다. 다음 섹션에서는 조직이 네 가지 핵심 영역에서 Transformation을 활용하는 방법에 대한 샘플을 제공합니다:

### 보안 모니터링

조직은 CloudTrail의 포괄적인 이벤트 데이터에 보강된 필드를 추가하여 위협 탐지를 간소화할 수 있습니다:

- **즉각적인 위협 탐지**: 즉시 필터링을 위한 `is_root_user` 플래그 추가 ([사용 사례 #4: Root 사용자 활동 탐지](#4-root-사용자-활동-탐지) 참조)
- **리소스 민감도 태깅**: 네이밍 패턴을 기반으로 S3 버킷 자동 분류 ([사용 사례 #1: S3 데이터 분류](#1-민감한-리소스-식별을-위한-s3-데이터-분류) 참조)
- **간소화된 알림**: 복잡한 JSON 파싱 없이 보강된 필드에 [CloudWatch 알람](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/AlarmThatSendsEmail.html)을 [메트릭 필터](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/MonitoringLogData.html)와 함께 생성
- **SIEM 준비 데이터**: 보안 도구와의 원활한 통합을 위해 중첩 필드 평탄화 ([사용 사례 #2: 중첩 필드 평탄화](#2-siem-통합을-위한-중첩-필드-평탄화) 참조)

### 최적화된 데이터 전달

CloudTrail Data Events는 포괄적인 감사 범위를 제공하며 매일 수백만 건의 로그를 생성합니다. 조직은 특정 다운스트림 시스템을 위해 이 데이터를 최적화할 수 있습니다:

- **간소화된 다운스트림 전달**: 구독 필터를 통해 S3, OpenSearch 또는 타사 SIEM으로 전송하기 전에 불필요한 필드 제거 ([사용 사례 #3: 최적화된 다운스트림 전달](#3-필드-축소를-통한-최적화된-다운스트림-전달) 참조)
- **선택적 필드 보존**: 운영 노이즈를 제거하면서 보안에 중요한 데이터만 유지
- **향상된 쿼리 성능**: 더 작고 평탄화된 로그 구조로 CloudWatch Logs Insights 쿼리 속도 향상
- **다운스트림 비용 절감**: 외부 시스템에 관련 데이터만 전송하여 수집 및 저장 비용 절감

:::info
**참고**: 원본 로그와 변환된 로그 모두 CloudWatch Logs에 저장됩니다. 주요 이점은 구독 필터를 통해 다운스트림 시스템으로 전송되는 데이터를 최적화하는 것이며, [CloudWatch Logs 저장 비용](https://aws.amazon.com/cloudwatch/pricing/)을 줄이는 것이 아닙니다.
:::

### 운영 효율성

수십 또는 수백 개의 AWS 계정을 보유한 조직은 환경 전반에서 CloudTrail 이벤트의 상관관계를 간소화할 수 있습니다:

- **환경 태깅**: 계정 ID를 기반으로 이벤트를 `production`, `staging` 또는 `development`로 자동 레이블링 ([사용 사례 #5: 멀티 계정 환경 태깅](#5-멀티-계정-환경-태깅) 참조)
- **표준화된 필드 이름**: 모든 계정에서 일관된 쿼리를 위해 `userIdentity.type` 및 `sourceIPAddress`와 같은 중첩 필드 평탄화 ([사용 사례 #2: 중첩 필드 평탄화](#2-siem-통합을-위한-중첩-필드-평탄화) 참조)
- **비즈니스 컨텍스트**: 수집 시점에 규정 준수 프레임워크 태그 추가 ([사용 사례 #6: 규정 준수 프레임워크 태깅](#6-규정-준수-프레임워크-태깅) 참조)
- **간소화된 교차 계정 분석**: CloudWatch Logs Insights에서 일관된 필드 이름을 사용하여 모든 계정 쿼리

### 규정 준수 및 감사 준비

조직은 CloudTrail 이벤트를 사전 분류하여 감사 대응을 가속화할 수 있습니다:

- **규정 준수 프레임워크 태깅**: PCI-DSS, HIPAA 또는 SOC2 관련 이벤트 자동 태깅 ([사용 사례 #6: 규정 준수 프레임워크 태깅](#6-규정-준수-프레임워크-태깅) 참조)
- **Root 사용자 모니터링**: 규정 준수 감사를 위한 Root 사용자 활동 플래그 지정 ([사용 사례 #4: Root 사용자 활동 탐지](#4-root-사용자-활동-탐지) 참조)
- **보존 최적화**: 다른 보존 정책을 위해 중요 감사 데이터와 운영 로그 분리
- **빠른 감사 대응**: 사전 분류된 로그로 규정 준수 검토 중 즉시 필터링 가능

## 일반적인 사용 사례 및 솔루션

다음 예제는 [CloudTrail 로그](https://docs.aws.amazon.com/awscloudtrail/latest/userguide/cloudtrail-event-reference-record-contents.html)에 대한 실용적인 변환 패턴을 보여줍니다. 각 사용 사례에는 특정 과제, 이를 해결하기 위한 프로세서 구성 및 결과적인 이점이 포함됩니다. 이러한 패턴은 조직의 특정 보안 모니터링 및 운영 요구사항에 맞게 결합하거나 조정할 수 있습니다.

### 1. 민감한 리소스 식별을 위한 S3 데이터 분류

**과제**: 보안 팀이 각 ARN을 수동으로 검사하지 않고는 어떤 CloudTrail 이벤트가 민감한 또는 프로덕션 S3 버킷과 관련되는지 빠르게 식별하기 어렵습니다.

**솔루션**: 버킷 네이밍 패턴을 기반으로 S3 리소스를 자동 분류합니다.

```json
[
  {
    "parseJSON": {
      "source": "@message"
    }
  },
  {
    "copyValue": {
      "entries": [
        {
          "source": "resources.0.ARN",
          "target": "data_classification"
        }
      ]
    }
  },
  {
    "substituteString": {
      "entries": [
        {
          "source": "data_classification",
          "from": ".*-prod-.*",
          "to": "sensitive"
        },
        {
          "source": "data_classification",
          "from": "^arn:aws:s3:::.*",
          "to": "normal"
        }
      ]
    }
  }
]
```

**이점**: 보안 분석가가 `data_classification` 필드로 필터링하여 민감한 리소스 접근을 즉시 식별할 수 있습니다.

**쿼리 예제**:
```sql
fields @timestamp, eventName, userIdentity.arn, data_classification
| filter data_classification = "sensitive"
| sort @timestamp desc
```

### 2. SIEM 통합을 위한 중첩 필드 평탄화

**과제**: SIEM 도구는 평탄한 필드 구조를 요구합니다. CloudTrail의 상세한 JSON 구조를 SIEM 요구사항에 맞게 평탄화할 수 있습니다.

**솔루션**: 자주 쿼리되는 중첩 필드를 추출하고 평탄화합니다.

```json
[
  {
    "parseJSON": {
      "source": "@message"
    }
  },
  {
    "copyValue": {
      "entries": [
        {
          "source": "userIdentity.type",
          "target": "user_type",
          "overwriteIfExists": true
        },
        {
          "source": "sourceIPAddress",
          "target": "source_ip",
          "overwriteIfExists": true
        },
        {
          "source": "awsRegion",
          "target": "region",
          "overwriteIfExists": true
        }
      ]
    }
  }
]
```

**이점**: 모든 계정에서 표준화된 필드 이름으로 SIEM 상관관계 규칙을 단순화하고 구성 복잡성을 줄입니다.

**쿼리 예제**:
```sql
fields @timestamp, eventName, user_type, source_ip, region
| filter region = "us-east-1"
| sort @timestamp desc
```

### 3. 필드 축소를 통한 최적화된 다운스트림 전달

**과제**: CloudTrail Data Events는 대량의 볼륨을 생성합니다. 조직은 다운스트림 시스템으로 전달할 때 보안 관련 필드에 집중할 수 있습니다.

**솔루션**: 구독 필터를 통해 전달하기 전에 필드를 제거합니다.

```json
[
  {
    "parseJSON": {
      "source": "@message"
    }
  },
  {
    "deleteKeys": {
      "withKeys": [
        "responseElements",
        "requestParameters"
      ]
    }
  }
]
```

**이점**: 다운스트림 시스템(S3, OpenSearch, SIEM)으로 전송되는 데이터 볼륨을 줄여 모든 보안 관련 데이터를 유지하면서 수집 및 저장 비용을 절감합니다.

:::info
**중요**: 원본 로그와 변환된 로그 모두 CloudWatch Logs에 저장됩니다. 구독 필터는 변환된 버전을 전달하여 다운스트림 시스템에서 비용 절감이 가능합니다. 보안 모니터링에 필요하지 않은 필드만 삭제하십시오. 위 예제에서는 장황한 필드(`responseElements` 및 `requestParameters`)를 제거하지만 `eventName`, `userIdentity`, `sourceIPAddress`, `eventTime`과 같은 핵심 감사 데이터는 유지합니다. `deleteKeys`는 이벤트에 존재하는 필드만 삭제합니다 - 필드가 존재하지 않으면 조용히 건너뜁니다. 특정 요구사항에 따라 `additionalEventData`, `resources` 또는 `serviceEventDetails`와 같은 추가 필드를 목록에 추가하십시오.
:::

**쿼리 예제**:
```sql
fields @timestamp, eventName, userIdentity.type, sourceIPAddress
| filter eventName like /Put|Delete|Create/
| sort @timestamp desc
```

### 4. Root 사용자 활동 탐지

**과제**: Root 사용자 활동을 식별하려면 `userIdentity.type` 필드를 파싱해야 합니다. 조직은 명시적 플래그를 추가하여 알림 생성을 단순화할 수 있습니다.

**솔루션**: Root 사용자 탐지를 위한 명시적 불리언 플래그를 추가합니다.

```json
[
  {
    "parseJSON": {
      "source": "@message"
    }
  },
  {
    "copyValue": {
      "entries": [
        {
          "source": "userIdentity.type",
          "target": "is_root_user",
          "overwriteIfExists": true
        }
      ]
    }
  },
  {
    "substituteString": {
      "entries": [
        {
          "source": "is_root_user",
          "from": "Root",
          "to": "true"
        },
        {
          "source": "is_root_user",
          "from": "(IAMUser|AssumedRole|FederatedUser|AWSAccount|AWSService)",
          "to": "false"
        }
      ]
    }
  }
]
```

**이점**: Root 사용자 활동에 대한 간단한 필터링이 가능합니다: `filter is_root_user = "true"`

**쿼리 예제**:
```sql
fields @timestamp, eventName, userIdentity.arn, sourceIPAddress, is_root_user
| filter is_root_user = "true"
| sort @timestamp desc
```

### 5. 멀티 계정 환경 태깅

**과제**: 여러 AWS 계정을 가진 조직은 각 CloudTrail 이벤트가 어떤 환경(prod/staging/dev)에서 생성되었는지 빠르게 식별해야 합니다.

**솔루션**: 계정 ID를 환경 레이블에 매핑합니다.

```json
[
  {
    "parseJSON": {
      "source": "@message"
    }
  },
  {
    "copyValue": {
      "entries": [
        {
          "source": "recipientAccountId",
          "target": "environment",
          "overwriteIfExists": true
        }
      ]
    }
  },
  {
    "substituteString": {
      "entries": [
        {
          "source": "environment",
          "from": "111122223333",
          "to": "production"
        }
      ]
    }
  },
  {
    "substituteString": {
      "entries": [
        {
          "source": "environment",
          "from": "444455556666",
          "to": "staging"
        }
      ]
    }
  },
  {
    "substituteString": {
      "entries": [
        {
          "source": "environment",
          "from": "[0-9]{12}",
          "to": "development"
        }
      ]
    }
  }
]
```

**이점**: 다운스트림 시스템에서 계정 ID 매핑을 유지하지 않고도 환경 기반 필터링 및 알림이 가능합니다.

**쿼리 예제**:
```sql
fields @timestamp, eventName, userIdentity.arn, environment
| filter environment = "production"
| stats count() by eventName
| sort count desc
```

### 6. 규정 준수 프레임워크 태깅

**과제**: 규정 준수 팀은 감사 중에 특정 규정 프레임워크(PCI-DSS, HIPAA, SOC2)와 관련된 CloudTrail 이벤트를 빠르게 필터링해야 합니다.

**솔루션**: 규정 준수 관련 패턴을 기반으로 이벤트를 자동 태깅합니다.

:::info
**참고**: 다음은 규정 준수 프레임워크와 관련된 태그를 추가하는 방법의 예시입니다. 아래 예제에 표시된 eventName 매핑은 특정 프레임워크와 상관관계가 없습니다.
:::

```json
[
  {
    "parseJSON": {
      "source": "@message"
    }
  },
  {
    "copyValue": {
      "entries": [
        {
          "source": "eventName",
          "target": "compliance_framework",
          "overwriteIfExists": true
        }
      ]
    }
  },
  {
    "substituteString": {
      "entries": [
        {
          "source": "compliance_framework",
          "from": ".*(CreateKey|DeleteKey|DisableKey|ScheduleKeyDeletion|PutKeyPolicy).*",
          "to": "PCI-DSS,HIPAA"
        }
      ]
    }
  },
  {
    "substituteString": {
      "entries": [
        {
          "source": "compliance_framework",
          "from": ".*(CreateAccessKey|DeleteAccessKey|UpdateAccessKey|CreateUser|DeleteUser).*",
          "to": "SOC2,PCI-DSS"
        }
      ]
    }
  },
  {
    "substituteString": {
      "entries": [
        {
          "source": "compliance_framework",
          "from": ".*(PutBucketEncryption|DeleteBucketEncryption|PutBucketPolicy|DeleteBucketPolicy).*",
          "to": "HIPAA,PCI-DSS"
        }
      ]
    }
  }
]
```

**이점**: 별도의 이벤트 카탈로그를 유지하지 않고도 감사 중에 규정 준수 관련 이벤트를 즉시 필터링할 수 있습니다.

**쿼리 예제**:
```sql
fields @timestamp, eventName, userIdentity.arn, compliance_framework
| filter compliance_framework like /PCI-DSS/
| sort @timestamp desc
```

## 모범 사례

성공적인 CloudWatch Logs Transformation 구현을 위해서는 신중한 계획과 지속적인 유지 관리가 필요합니다. 이러한 모범 사례는 신뢰할 수 있고 효율적인 변환 파이프라인을 구축하는 데 도움이 되는 설계 원칙, 성능 최적화, 보안 고려 사항 및 비용 관리를 다룹니다.

### 설계 원칙

1. **단순하게 시작**: 기본적인 변환으로 시작하여 필요에 따라 복잡성을 추가합니다
2. **철저한 테스트**: 프로덕션 배포 전에 샘플 CloudTrail 이벤트로 변환을 검증합니다
3. **패턴 문서화**: 정규식 패턴과 의도된 매치에 대한 문서를 유지합니다
4. **버전 관리**: 변경 관리를 위해 소스 제어에서 변환 구성을 추적합니다

### 성능 최적화

1. **프로세서 수 최소화**: 많은 작은 프로세서 대신 적은 수의 잘 설계된 프로세서를 사용합니다
2. **정규식 복잡성 최소화**: 성능 향상을 위해 가능한 한 단순한 패턴을 사용합니다
3. **필드 작업 제한**: 다운스트림 분석에 필요한 필드만 복사하거나 변환합니다
4. **대규모 테스트**: 현실적인 로그 볼륨으로 변환 성능을 검증합니다

### 보안 고려 사항

1. **PII 노출 방지**: 적절한 데이터 처리 제어 없이 커스텀 필드에 PII를 추가하지 않습니다
2. **패턴 검증**: 정규식 패턴이 실수로 민감한 데이터를 노출하지 않는지 확인합니다
3. **변환 감사**: 변환 로직의 보안 영향을 정기적으로 검토합니다
4. **감사 무결성 보존**: 변환이 규정 준수 또는 포렌식 분석에 필요한 필드를 제거하지 않도록 합니다

### 비용 관리

1. **다운스트림 전달 최적화**: [다운스트림 수집 비용](https://aws.amazon.com/cloudwatch/pricing/)을 줄이기 위해 구독 필터를 통해 외부 시스템으로 전달하기 전에 불필요한 필드를 제거합니다
2. **저장소 대 쿼리 성능 균형**: 추가 보강 필드 저장과 쿼리 복잡성 사이의 트레이드오프를 고려합니다
3. **변환 메트릭 모니터링**: 변환 오류 및 성능에 대한 [CloudWatch Logs 메트릭](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/CloudWatch-Logs-Monitoring-CloudWatch-Metrics.html)을 추적합니다
4. **정기적 검토**: 변환이 현재 요구사항에 여전히 부합하는지 주기적으로 평가합니다

## 원본 로그 대 변환된 로그 쿼리

로그 그룹에 변환이 적용되면 원본 버전과 변환된 버전 모두 CloudWatch Logs에 저장됩니다. 검증 및 문제 해결을 위해 각 버전에 액세스하는 방법을 이해하는 것이 중요합니다.

### CloudWatch Logs Insights 동작

- **기본값**: CloudWatch Logs Insights 쿼리는 **변환된** 버전의 로그를 표시합니다
- **원본 액세스**: 원본 로그 내용은 항상 `@message` 필드에서 사용할 수 있습니다
- **API 동작**: [GetLogEvents](https://docs.aws.amazon.com/AmazonCloudWatchLogs/latest/APIReference/API_GetLogEvents.html) 및 [FilterLogEvents](https://docs.aws.amazon.com/AmazonCloudWatchLogs/latest/APIReference/API_FilterLogEvents.html) API는 **원본** 로그 버전을 반환합니다

### 쿼리 예제

**변환된 로그 쿼리 (기본 동작)**:
```sql
fields @timestamp, eventName, user_type, source_ip, region
| filter region = "us-east-1"
| sort @timestamp desc
```

**@message를 사용한 원본 로그 쿼리**:
```sql
fields @timestamp, @message
| parse @message /\"eventName\":\"(?<original_eventName>[^\"]+)\"/
| filter original_eventName like /Create/
| sort @timestamp desc
```

**원본과 변환 나란히 비교**:
```sql
fields @timestamp, @message as original_log, eventName, user_type, region
| limit 10
```

이 이중 저장 방식은 일상 운영을 위한 보강된 변환 데이터의 이점을 누리면서도 원본 감사 추적에 항상 액세스할 수 있도록 보장합니다.

## 구현 단계

1. **요구사항 식별**: 보강 또는 수정이 필요한 [CloudTrail 필드](https://docs.aws.amazon.com/awscloudtrail/latest/userguide/cloudtrail-event-reference-record-contents.html) 결정
2. **변환 로직 설계**: 프로세서 체인과 예상 결과 매핑
3. **테스트 이벤트 생성**: 검증을 위한 샘플 CloudTrail 이벤트 생성
4. **변환 구성**: 로그 그룹에 [프로세서 구성 적용](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/CloudWatch-Logs-Transformation.html#CloudWatch-Logs-Transformation-Permissions)
5. **결과 검증**: [CloudWatch Logs Insights](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/AnalyzingLogData.html)를 사용하여 변환된 로그를 쿼리하여 올바른 처리 확인
6. **모니터링 및 반복**: 운영 피드백을 기반으로 변환을 지속적으로 개선

## 결론

CloudWatch Logs Transformation을 사용하면 조직은 수집 시점에 보안 컨텍스트로 이벤트를 보강하고, 복잡한 JSON 구조를 평탄화하고, 다운스트림 전달을 최적화하여 CloudWatch Logs로 전달되는 CloudTrail 데이터의 가치를 극대화할 수 있습니다—모두 AWS 네이티브 기능을 통해 가능합니다. 보안 및 운영 팀은 커스텀 처리 인프라의 운영 오버헤드 없이 CloudTrail 이벤트를 실행 가능한 인텔리전스로 변환할 수 있습니다. 이 가이드는 AWS 환경에 대한 완전한 감사 추적을 유지하면서 간소화된 규정 준수 보고 및 다운스트림 비용 절감을 가능하게 하는 패턴, 모범 사례 및 구현 전략을 제공합니다.

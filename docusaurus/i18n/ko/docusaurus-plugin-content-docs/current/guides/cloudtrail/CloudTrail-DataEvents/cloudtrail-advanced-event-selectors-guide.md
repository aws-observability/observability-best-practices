---
sidebar_position: 14
---
# Advanced Event Selectors

### Advanced Event Selectors 이해

AWS CloudTrail의 Advanced Event Selectors는 equals, not equals, starts with, ends with와 같은 연산자를 사용하여 필드 기반 조건으로 특정 선택 기준을 정의함으로써 어떤 데이터 이벤트를 기록할지 세밀하게 제어할 수 있게 합니다. 이러한 세분화된 접근 방식을 통해 조직은 보안, 컴플라이언스, 운영 요구 사항에 중요한 데이터 이벤트만 캡처하면서 과도한 이벤트 로깅으로 인한 비용을 절감할 수 있습니다.

Advanced Event Selectors는 필드 셀렉터, 연산자, 값으로 구성됩니다. 각 셀렉터에는 선택 기준을 정의하는 필드 셀렉터 배열이 포함되며, 각 필드 셀렉터는 필드명(eventCategory, eventName, resources.type 등), 연산자(Equals, NotEquals, StartsWith, EndsWith), 그리고 매칭할 하나 이상의 값을 지정합니다. 단일 Advanced Event Selector 내에서 여러 필드 셀렉터 간의 관계는 논리적 AND입니다. 즉, 이벤트가 기록되려면 모든 조건이 충족되어야 합니다.

![CloudTrail Advanced Event Selectors](/img/cloudops/guides/cloudtrail-lake/cloudtrail-data-events-advanced-selector.png "Advanced Event Selectors for Data Events")

### 지원되는 필드 및 연산자

CloudTrail Advanced Event Selectors는 데이터 이벤트에 대한 AWS API 호출의 모든 측면을 포괄하는 종합적인 필드 세트를 지원합니다. 주요 필드에는 특정 API 작업을 위한 eventName, AWS 리소스 유형을 위한 resources.type, 특정 리소스 식별자를 위한 resources.ARN, 읽기 및 쓰기 작업을 구분하기 위한 readOnly가 포함됩니다. 각 필드는 특정 연산자를 지원합니다: Equals와 NotEquals는 정확한 일치에 사용되며, StartsWith와 EndsWith는 패턴 기반 선택을 가능하게 합니다. 이러한 조합을 이해하는 것은 효과적인 선택 전략을 수립하는 데 매우 중요합니다.

다음에서는 Advanced Event Selectors를 사용하여 AWS 리소스와 관련된 특정 데이터 이벤트를 선택하는 방법에 대한 예시를 제공합니다.

### Amazon S3

#### 핵심 쓰기 작업 셀렉터

이 셀렉터는 데이터 유출, 무단 수정, 컴플라이언스 위반을 나타낼 수 있는 고위험 S3 작업에 중점을 둡니다. 민감한 버킷에 대한 쓰기 작업만 기록함으로써 조직은 S3 이벤트의 로그 볼륨을 줄이면서 악의적인 활동을 탐지할 수 있습니다. 이 접근 방식은 일상적인 읽기 작업으로 보안 팀에 과부하를 주지 않으면서 보안 가시성을 유지하는 데 필수적입니다.

```json
[
  {
    "FieldSelectors": [
      {
        "Field": "eventCategory",
        "Equals": ["Data"]
      },
      {
        "Field": "resources.type",
        "Equals": ["AWS::S3::Object"]
      },
      {
        "Field": "eventName",
        "Equals": ["DeleteObject", "PutObject", "RestoreObject"]
      },
      {
        "Field": "resources.ARN",
        "StartsWith": ["arn:aws:s3:::sensitive-bucket/", "arn:aws:s3:::compliance-bucket/"]
      }
    ]
  }
]
```

### AWS Lambda 함수 모니터링

#### 프로덕션 함수 호출 셀렉터

Lambda 호출 모니터링은 무단 함수 실행 및 비정상적인 접근 패턴을 탐지하는 데 필수적입니다. 이 셀렉터는 프로덕션 및 핵심 함수의 네이밍 패턴으로 시작하는 Lambda 함수를 대상으로 하면서 개발 환경의 네이밍 패턴은 제외하여 노이즈를 줄이고 비즈니스에 중요한 활동에 집중합니다. 패턴 기반 ARN 선택은 네이밍 규칙을 따르는 새 함수를 자동으로 포함하여 확장 가능한 보안 모니터링을 제공합니다.

```json
[
  {
    "FieldSelectors": [
      {
        "Field": "eventCategory",
        "Equals": ["Data"]
      },
      {
        "Field": "resources.type",
        "Equals": ["AWS::Lambda::Function"]
      },
      {
        "Field": "eventName",
        "Equals": ["Invoke"]
      },
      {
        "Field": "resources.ARN",
        "StartsWith": ["arn:aws:lambda:us-east-1:123456789012:function:prod-", "arn:aws:lambda:us-east-1:123456789012:function:critical-"]
      }
    ]
  }
]
```

### DynamoDB 테이블 작업

#### 쓰기 작업 및 민감한 테이블 셀렉터

DynamoDB는 대량의 이벤트를 생성하므로 비용 제어와 보안 집중을 위해 선택적 이벤트 선택이 필수적입니다. 이 셀렉터는 무단 접근이나 데이터 변조를 나타낼 수 있는 데이터 수정 이벤트를 캡처하면서 일상적인 읽기 작업은 제외합니다. 다음 예시의 조합 접근 방식은 특정 테이블에 대한 특정 쓰기 작업을 기록하는 동시에 정의된 민감한 테이블에 대해서는 모든 작업을 기록하여, 과도한 비용 없이 포괄적인 범위를 제공합니다.

```json
[
  {
    "FieldSelectors": [
      {
        "Field": "eventCategory",
        "Equals": ["Data"]
      },
      {
        "Field": "resources.type",
        "Equals": ["AWS::DynamoDB::Table"]
      },
      {
        "Field": "eventName",
        "Equals": ["PutItem", "UpdateItem", "DeleteItem", "BatchWriteItem"]
      },
      {
        "Field": "resources.ARN",
        "Equals": ["arn:aws:dynamodb:us-east-1:123456789012:table/UserData"]
      }
    ]
  },
  {
    "FieldSelectors": [
      {
        "Field": "eventCategory",
        "Equals": ["Data"]
      },
      {
        "Field": "resources.type",
        "Equals": ["AWS::DynamoDB::Table"]
      },
      {
        "Field": "resources.ARN",
        "StartsWith": ["arn:aws:dynamodb:us-east-1:123456789012:table/Financial"]
      }
    ]
  }
]
```

### Amazon SQS 큐 모니터링

#### 관리 작업 셀렉터

SQS 관리 작업은 메시지 흐름을 중단시키거나 대기열 권한을 변경할 수 있기 때문에 특정 보안 위험을 나타낼 수 있습니다. 이 셀렉터 예시는 권한 상승이나 서비스 중단 시도를 나타낼 수 있는 대기열 관리 활동에 초점을 맞춥니다. 대량의 메시지 작업을 제외함으로써 이 접근 방식은 보안 관련 관리 변경 사항에 대한 가시성을 유지하면서 로깅 비용을 절감합니다.

```json
[
  {
    "FieldSelectors": [
      {
        "Field": "eventCategory",
        "Equals": ["Data"]
      },
      {
        "Field": "resources.type",
        "Equals": ["AWS::SQS::Queue"]
      },
      {
        "Field": "eventName",
        "Equals": ["CreateQueue", "DeleteQueue", "SetQueueAttributes", "AddPermission", "RemovePermission"]
      }
    ]
  }
]
```

### Amazon SNS 토픽 작업

#### 토픽 관리 및 핵심 토픽 셀렉터

SNS 모니터링은 관리 감독과 핵심 토픽에 대한 메시지 흐름 가시성 사이의 균형을 맞춰야 합니다. 이 셀렉터는 알림 전달에 영향을 줄 수 있는 토픽 관리 작업을 캡처하고 보안에 민감한 토픽의 모든 활동을 모니터링합니다. 다중 셀렉터 접근 방식을 통해 선택적 토픽 선택으로 전체 로그 볼륨을 줄이면서 핵심 커뮤니케이션 채널을 포괄적으로 모니터링할 수 있습니다.

```json
[
  {
    "FieldSelectors": [
      {
        "Field": "eventCategory",
        "Equals": ["Data"]
      },
      {
        "Field": "resources.type",
        "Equals": ["AWS::SNS::Topic"]
      },
      {
        "Field": "eventName",
        "Equals": ["CreateTopic", "DeleteTopic", "Subscribe", "Unsubscribe", "SetTopicAttributes"]
      }
    ]
  },
  {
    "FieldSelectors": [
      {
        "Field": "eventCategory",
        "Equals": ["Data"]
      },
      {
        "Field": "resources.type",
        "Equals": ["AWS::SNS::Topic"]
      },
      {
        "Field": "resources.ARN",
        "Equals": ["arn:aws:sns:us-east-1:123456789012:security-alerts"]
      }
    ]
  },
  {
    "FieldSelectors": [
      {
        "Field": "eventCategory",
        "Equals": ["Data"]
      },
      {
        "Field": "resources.type",
        "Equals": ["AWS::SNS::Topic"]
      },
      {
        "Field": "resources.ARN",
        "StartsWith": ["arn:aws:sns:us-east-1:123456789012:compliance-"]
      }
    ]
  }
]
```

### 사용자 ID 기반 셀렉터

#### 권한 있는 사용자 모니터링 셀렉터

사용자 ID 선택을 통해 특정 IAM 자격 증명이 수행한 작업에 대한 이벤트를 포함하거나 제외할 수 있습니다. 다음 예시는 두 가지 접근 방식을 보여줍니다: 자동화된 프로세스의 노이즈를 줄이기 위해 S3 객체 로깅에서 특정 서비스 역할을 제외하는 방식과, 고위험 활동에 집중하기 위해 DynamoDB 테이블 작업에서 권한 있는 역할만 기록하는 방식입니다.

```json
[
  {
    "FieldSelectors": [
      {
        "Field": "eventCategory",
        "Equals": ["Data"]
      },
      {
        "Field": "resources.type",
        "Equals": ["AWS::S3::Object"]
      },
      {
        "Field": "userIdentity.arn",
        "NotStartsWith": ["arn:aws:sts::123456789012:assumed-role/service-role/backup-automation-role", "arn:aws:sts::123456789012:assumed-role/service-role/monitoring-role"]
      }
    ]
  },
  {
    "FieldSelectors": [
      {
        "Field": "eventCategory",
        "Equals": ["Data"]
      },
      {
        "Field": "resources.type",
        "Equals": ["AWS::DynamoDB::Table"]
      },
      {
        "Field": "userIdentity.arn",
        "StartsWith": ["arn:aws:sts::123456789012:assumed-role/AdminRole/", "arn:aws:sts::123456789012:assumed-role/SecurityRole/"]
      }
    ]
  }
]
```

### 조직 Trail 및 이벤트 데이터 스토어(EDS) 셀렉터

#### 계정 수준 제외 셀렉터

조직 Trail 또는 이벤트 데이터 스토어(EDS) 구성에서는 비용을 절감하고 중요한 계정에 집중하기 위해 특정 계정 전체를 S3 데이터 이벤트 로깅에서 제외할 수 있습니다. 이 셀렉터는 userIdentity.arn 필드를 사용하여 해당 계정의 모든 자격 증명과 매칭함으로써 특정 계정의 모든 S3 데이터 이벤트를 제외합니다. 이 접근 방식은 프로덕션 계정에 대한 범위를 유지하면서 개발 또는 테스트 계정을 포괄적 로깅에서 제외할 때 특히 유용합니다.


```json
[
  {
    "FieldSelectors": [
      {
        "Field": "eventCategory",
        "Equals": ["Data"]
      },
      {
        "Field": "resources.type",
        "Equals": ["AWS::S3::Object"]
      },
      {
        "Field": "userIdentity.arn",
        "NotStartsWith": ["arn:aws:sts::111122223333:", "arn:aws:iam::111122223333:"]
      }
    ]
  }
]
```

:::info
userIdentity ARN 유형은 위에 표시된 STS 및 IAM 예시 외에도 더 다양할 수 있습니다. 조직 내에서 현재 사용 중인 모든 userIdentity ARN 유형을 확인하는 것이 좋습니다.
:::

#### 다중 S3 버킷 제외 셀렉터

조직 전체의 로깅을 관리할 때, 백업 버킷, 임시 스토리지, 자동화된 처리 버킷 등 대량의 저가치 이벤트를 생성하는 여러 S3 버킷을 제외해야 할 수 있습니다. 이 셀렉터는 다른 모든 S3 리소스에 대한 로깅을 유지하면서 여러 특정 버킷을 제외하는 방법을 보여줍니다. 이 접근 방식은 여러 NotStartsWith 조건을 사용하여 서로 다른 버킷 ARN 패턴을 효율적으로 제외합니다.

```json
[
  {
    "FieldSelectors": [
      {
        "Field": "eventCategory",
        "Equals": ["Data"]
      },
      {
        "Field": "resources.type",
        "Equals": ["AWS::S3::Object"]
      },
      {
        "Field": "resources.ARN",
        "NotStartsWith": [
          "arn:aws:s3:::backup-bucket-",
          "arn:aws:s3:::temp-processing-",
          "arn:aws:s3:::automated-logs-",
          "arn:aws:s3:::dev-sandbox-"
        ]
      }
    ]
  }
]
```

### 추가 지원 필드 예시

#### 쓰기 작업 셀렉터

readOnly 필드 셀렉터는 환경에 실제 변경을 나타내는 이벤트에 집중하는 데 매우 중요합니다. 쓰기 작업만 선택함으로써 조직은 보안이나 컴플라이언스에 영향을 줄 수 있는 모든 작업에 대한 가시성을 유지하면서 로그 볼륨을 줄일 수 있습니다. 이 셀렉터는 특정 리소스 유형이나 이벤트 소스와 결합할 때 특히 효과적입니다.

#### 서비스별 이벤트 소스 셀렉터

이벤트 소스 선택을 통해 리소스 유형 선택의 복잡성 없이 특정 AWS 서비스를 타겟으로 모니터링할 수 있습니다. 이 접근 방식은 관련된 특정 리소스에 관계없이 특정 서비스에 대한 포괄적인 로깅이 필요한 컴플라이언스 시나리오에 이상적입니다. 이 셀렉터는 지정된 서비스의 완전한 범위를 보장하면서 서비스 간 노이즈를 크게 줄여줍니다.

#### 특정 API 작업 모니터링

이벤트명 선택은 CloudTrail 로깅에 대해 가장 세분화된 제어를 제공하며, 조직이 모든 서비스에 걸쳐 특정 API 작업을 모니터링할 수 있게 합니다. 이 접근 방식은 특정 공격 패턴을 탐지하거나, 핵심 작업을 모니터링하거나, 정확한 컴플라이언스 요구 사항을 충족하는 데 유용합니다. 이 셀렉터는 고위험 작업에 대한 정밀한 가시성을 제공하면서 로그 볼륨을 대폭 줄여줍니다.

#### 리소스 유형 조합 선택

리소스 유형 선택과 작업 유형 선택을 결합하면 강력하고 타겟화된 모니터링 기능을 구현할 수 있습니다. 다음 예시는 세 가지 접근 방식을 보여줍니다: S3 객체에 대한 쓰기 작업 기록, 특정 DynamoDB 쓰기 작업 캡처, S3 버킷에 대한 쓰기 작업 로깅입니다. 이 조합을 통해 조직은 특정 유형의 리소스에 대한 특정 유형의 작업을 기록할 수 있으며, 불필요한 로깅을 최소화하면서 정밀한 보안 범위를 제공합니다.

```json
[
  {
    "FieldSelectors": [
      {
        "Field": "eventCategory",
        "Equals": ["Data"]
      },
      {
        "Field": "resources.type",
        "Equals": ["AWS::S3::Object"]
      },
      {
        "Field": "readOnly",
        "Equals": ["false"]
      }
    ]
  },
  {
    "FieldSelectors": [
      {
        "Field": "eventCategory",
        "Equals": ["Data"]
      },
      {
        "Field": "resources.type",
        "Equals": ["AWS::DynamoDB::Table"]
      },
      {
        "Field": "eventName",
        "Equals": ["PutItem", "UpdateItem", "DeleteItem"]
      }
    ]
  },
  {
    "FieldSelectors": [
      {
        "Field": "eventCategory",
        "Equals": ["Data"]
      },
      {
        "Field": "resources.type",
        "Equals": ["AWS::S3::Bucket"]
      },
      {
        "Field": "readOnly",
        "Equals": ["false"]
      }
    ]
  }
]
```

## 비용 최적화 전략

### 이벤트 볼륨 분석 및 감소

효과적인 비용 최적화는 현재 이벤트 볼륨을 파악하고 보안이나 컴플라이언스 요구 사항을 훼손하지 않으면서 감소할 수 있는 기회를 식별하는 것에서 시작됩니다. CloudTrail 로그를 분석하여 대량의 이벤트를 식별하고 어떤 이벤트를 안전하게 제외할 수 있는지 결정하세요. 이 분석을 통해 Advanced Event Selector 전략을 수립할 수 있습니다.

### 전략적 선택 접근 방식

보안 및 컴플라이언스 이벤트를 우선시하면서 일상적인 운영 활동을 점진적으로 제외하는 계층적 선택 접근 방식을 구현하세요. 보안 관련 이벤트에 대한 광범위한 포함 기준으로 시작한 후, 알려진 일상 작업에 대한 특정 제외를 추가합니다. 예를 들어, 모든 쓰기 작업을 포함하되 예측 가능하고 위험이 낮은 이벤트를 생성하는 특정 자동화된 프로세스는 제외할 수 있습니다. StartsWith 및 EndsWith 연산자를 사용하여 패턴 기반 셀렉터를 만들면 예상치 못하거나 잠재적으로 악의적인 활동에 대한 범위를 유지하면서 일상적인 이벤트의 전체 카테고리를 효율적으로 제외할 수 있습니다.

### 리소스 기반 비용 관리

리소스의 중요도와 민감도 수준을 기준으로 선택 전략을 구성하세요. 프로덕션 리소스, 민감한 데이터 스토어, 보안에 중요한 서비스에 대해서는 포괄적인 로깅을 구현하고, 개발 및 테스트 환경에는 더 적극적인 선택 기준을 적용합니다. 리소스 ARN 패턴을 활용하여 네이밍 규칙에 따라 적절한 로깅 수준을 자동으로 적용할 수 있습니다. 이 접근 방식은 비용 최적화 노력이 가장 중요한 자산에 대한 보안 모니터링을 훼손하지 않도록 보장하면서, 덜 중요한 리소스에 대한 불필요한 로깅 오버헤드를 줄여줍니다.

## 보안 및 컴플라이언스 고려 사항

### 보안 가시성 유지

Advanced Event Selectors를 통해 비용을 최적화하면서도 포괄적인 보안 가시성을 유지하는 것이 가장 중요합니다. 선택 전략이 보안 인시던트를 나타낼 수 있는 모든 이벤트를 캡처하도록 보장하세요. 이벤트 셀렉터를 정기적으로 검토하고 테스트하면 환경이 변화함에 따라 보안 모니터링 역량이 효과적으로 유지됩니다.

### 컴플라이언스 요구 사항 통합

다양한 컴플라이언스 프레임워크에는 Advanced Event Selectors를 설계할 때 고려해야 하는 감사 로깅에 대한 특정 요구 사항이 있습니다. 컴플라이언스 요구 사항을 특정 CloudTrail 이벤트에 매핑하고 Advanced Event Selectors가 필요한 모든 활동을 캡처하도록 보장하세요. 선택 결정을 문서화하고 로깅 전략이 규제 요구 사항을 충족한다는 증거를 유지하세요.

### 인시던트 대응 준비

Advanced Event Selectors를 설계할 때 인시던트 대응 요구 사항을 염두에 두고, 포렌식 분석 및 위협 헌팅 활동을 지원하기에 충분한 세부 정보를 캡처하도록 보장하세요. 인증 이벤트, 네트워크 접근 패턴, 리소스 구성 변경 등 보안 인시던트에 대한 컨텍스트를 제공하는 이벤트를 포함하세요. 인시던트 대응에 대한 타임라인 요구 사항을 고려하고 로깅 전략이 조사 목적에 적합한 과거 데이터를 제공하도록 보장하세요. 알려진 인시던트 시나리오에 대해 이벤트 셀렉터를 테스트하여 효과적인 대응에 필요한 정보를 캡처하는지 검증하세요.

## 구현 모범 사례

### 단계적 배포 전략

전체 배포 전에 테스트와 개선이 가능한 단계적 접근 방식으로 Advanced Event Selectors를 구현하세요. 비프로덕션 환경에서 파일럿 구현을 시작하여 선택 로직을 검증하고 이벤트 볼륨 및 비용에 대한 영향을 측정합니다. 선택 전략의 효과를 모니터링하면서 구현을 점진적으로 확장하세요. 이 접근 방식은 프로덕션 로깅 기능에 영향을 미치기 전에 문제를 식별하고 해결할 수 있게 하며, 실제 사용 패턴에 기반하여 셀렉터를 개선할 기회를 제공합니다.

### 모니터링 및 검증

시간이 지남에 따라 CloudTrail Advanced Event Selectors가 보안 및 컴플라이언스 요구 사항을 계속 충족하도록 포괄적인 모니터링을 수립하세요. 이벤트 셀렉터가 예상되는 이벤트를 캡처하고 있으며 중요한 활동을 실수로 제외하지 않는지 확인하는 자동화된 검증 점검을 구현하세요. 선택 효과를 정기적으로 검토하면 비용 최적화와 보안 가시성 간의 균형을 유지하는 데 도움이 됩니다.

## 고급 선택 기법

### 패턴 기반 리소스 선택

StartsWith 및 EndsWith 연산자를 활용하여 대량의 리소스를 효율적으로 관리할 수 있는 정교한 패턴 기반 셀렉터를 만드세요. 예를 들어, 리소스 ARN의 네이밍 규칙을 활용하여 환경, 민감도, 사업 부서에 따라 적절한 로깅 수준을 자동으로 적용할 수 있습니다. 패턴 기반 선택은 일관된 네이밍 표준을 가진 조직에 특히 효과적이며, 대규모 AWS 환경에서 이벤트 셀렉터 관리의 복잡성을 크게 줄일 수 있습니다. 이 접근 방식은 설정된 네이밍 패턴을 따르는 새 리소스에 대한 자동 범위도 제공합니다.

### 다중 조건 로직 구현

Advanced Event Selectors는 정교한 선택 규칙을 만드는 데 사용할 수 있는 복잡한 논리 조건을 지원합니다. 단일 Advanced Event Selector 내에서 여러 필드 셀렉터를 결합하여 AND 조건을 만들거나, 여러 Advanced Event Selectors를 사용하여 OR 조건을 만들 수 있습니다. 예를 들어, 민감한 리소스에 대한 모든 쓰기 작업 또는 권한 있는 사용자가 수행한 모든 작업을 캡처하는 셀렉터를 만들 수 있습니다. 조건을 효과적으로 결합하는 방법을 이해하면 필요한 이벤트만 정확히 캡처하면서 나머지는 모두 제외하는 정밀한 선택 규칙을 만들 수 있습니다.

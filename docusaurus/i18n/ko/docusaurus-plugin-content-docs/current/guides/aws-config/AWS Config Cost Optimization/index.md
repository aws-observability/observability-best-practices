---
sidebar_position: 4
---
# AWS Config 비용 최적화

### 요금

[AWS Config 요금](https://aws.amazon.com/config/pricing/)은 주로 두 가지 주요 차원을 기반으로 합니다:

1. 구성 항목 기록:

    * 연속 기록
        AWS 환경의 모든 구성 변경 사항을 실시간으로 지속적으로 모니터링하고 기록합니다. 이를 통해 모든 리소스 수정 사항에 대한 포괄적인 가시성을 제공하여 변경 사항이 발생할 때 추적하고 감사할 수 있습니다.
    * 주기적 기록
        리소스 구성의 일일 스냅샷을 촬영하여 이전 24시간 상태와 다를 때만 변경 사항을 기록합니다. 이 접근 방식은 감독과 비용 효율성 사이의 균형을 제공하며, 데이터 볼륨을 줄이면서 중요한 변경 사항을 포착합니다.

1. 규칙 및 적합성 팩 평가:
    AWS Config는 개별 또는 적합성 팩의 일부로 구성 규칙 평가에 대해 요금을 부과합니다.

AWS Config 요금에 대한 최신 세부 정보는 [이 링크를 참조](https://aws.amazon.com/config/pricing/)하세요.

위의 항목이 주요 요금 구성 요소이지만, AWS Config 사용의 총 비용에 영향을 미칠 수 있는 다른 요인들이 있습니다:

1. [AWS Lambda](https://aws.amazon.com/lambda/pricing/) 비용: Lambda 함수를 통해 구현된 사용자 정의 규칙을 사용하는 경우, 표준 Lambda 요금이 적용됩니다.
2. [Amazon S3](https://aws.amazon.com/s3/pricing/) 스토리지: S3에 구성 스냅샷 및 기록 파일을 저장하는 비용이 발생합니다.
3. 데이터 전송: AWS 서비스 간 또는 리전 간 데이터 전송에 대한 요금이 적용될 수 있습니다.



### 비용 최적화 권장 사항

#### Config 비용 분석

[AWS Cost Explorer](https://aws.amazon.com/aws-cost-management/aws-cost-explorer/)는 서비스 사용량을 필터링하고 비용 차원을 분석하여 AWS Config 비용에 대한 인사이트를 제공합니다. 이를 위해 [결제 및 비용 관리 콘솔](https://us-east-1.console.aws.amazon.com/costmanagement/home#/home)로 이동하여 왼쪽 패널에서 **Cost Explorer**를 선택합니다. 오른쪽 패널에서 원하는 기간과 필요한 세부 수준에 따라 선호하는 세분성(일별 또는 월별)을 설정합니다. **Group by** 섹션의 **Dimensions**에서 **Usage Type**을 선택합니다. **Filters**에서 **Service**로 이동하여 **Config**를 선택합니다.

![AWS Config Cost Visualization](/img/cloudops/guides/config/configcost.png)

[Amazon CloudWatch](https://aws.amazon.com/cloudwatch/)의 "ConfigurationItemsRecorded" metric은 가장 많은 구성 항목을 생성하는 리소스 유형을 식별하는 데 도움이 됩니다. [CloudWatch Metrics를 사용한 AWS Config 리소스 변경 분석](https://aws.amazon.com/blogs/mt/analyzing-aws-config-resource-changes-using-cloudwatch-metrics/) 블로그를 참조하세요. 상세한 분석을 위해 [Amazon Athena](https://aws.amazon.com/athena/)를 사용하여 [비용 및 사용 보고서](https://aws.amazon.com/aws-cost-management/aws-cost-and-usage-reporting/)를 [AWS CloudTrail](https://aws.amazon.com/cloudtrail/) 및 [CloudTrail Lake](https://docs.aws.amazon.com/awscloudtrail/latest/userguide/cloudtrail-lake.html)와 함께 쿼리하여 구성 레코더 비용을 추정하고 자주 평가되는 규칙을 추적할 수 있습니다. [Athena를 사용한 AWS Config 데이터 분석](https://aws.amazon.com/blogs/mt/use-amazon-athena-and-aws-cloudtrail-to-estimate-billing-for-aws-config-rule-evaluations/) 블로그를 참조하세요.

비용 알림의 경우, 비용이 사전 정의된 임계값을 초과할 때 [AWS Budgets](https://aws.amazon.com/aws-cost-management/aws-budgets/)를 통해 사전 비용 관리를 구현하세요. 또한, [AWS Cost Anomaly Detection](https://aws.amazon.com/aws-cost-management/aws-cost-anomaly-detection/) 서비스는 비정상적인 지출 패턴에 대한 지속적인 모니터링을 제공하여 비용 급증을 더 쉽게 식별하고 해결할 수 있습니다. 예상 요금이 정의된 임계값을 초과할 때 알려주는 [CloudWatch 결제 알람](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/monitor_estimated_charges_with_cloudwatch.html)을 생성할 수도 있습니다.

#### 연속 기록과 주기적 기록 선택

AWS Config를 구현할 때, 적절한 기록 방법을 선택하는 것은 비용과 규정 준수 요구 사항의 균형을 맞추는 데 매우 중요합니다. [연속 기록](https://docs.aws.amazon.com/config/latest/developerguide/config-concepts.html#continuous-recording)은 리소스가 시간이 지남에 따라 비교적 안정적인 정적 워크로드에 더 비용 효율적인 경우가 많습니다. 이 옵션은 실시간 모니터링과 구성 변경에 대한 즉각적인 가시성을 요구하는 엄격한 보안 및 규정 준수 요구 사항이 있는 환경에 특히 권장됩니다. 프로덕션 데이터베이스, 핵심 네트워킹 리소스 또는 민감한 데이터 처리 시스템과 같은 중요 인프라 구성 요소는 일반적으로 연속 기록의 이점을 받습니다. 반면, [주기적 기록](https://docs.aws.amazon.com/config/latest/developerguide/config-concepts.html#periodic-recording)은 컨테이너화된 환경의 임시 리소스나 자주 확장 및 축소되는 인프라와 같은 매우 동적인 워크로드에 더 경제적일 수 있습니다. 예를 들어 Auto Scaling 그룹을 사용하는 개발 환경, 컨테이너 오케스트레이션 플랫폼 또는 임시 테스트 환경이 해당됩니다. 다만, 주기적 기록은 실시간이 아닌 24시간 단위로 업데이트를 제공하므로 규정 준수 요구 사항이 낮은 워크로드에만 구현해야 합니다. 또한 주기적 기록의 경우 구성 항목당 전달 비용이 연속 기록보다 높으므로, 특정 시나리오에서는 주기적 기록의 총 비용이 연속 기록을 실제로 초과할 수 있습니다. 이러한 기록 방법 간의 선택은 운영 계획(주기적 스냅샷으로 충분할 수 있는 경우)이나 규정 준수 감사(연속 모니터링이 필요한 경우)와 같은 특정 사용 사례에 맞춰지는 경우가 많습니다. 조직은 이 결정을 내릴 때 보안 요구 사항, 운영 패턴, 예산 제약을 신중하게 평가해야 합니다.


#### 리소스 제외

AWS Config는 [리소스 제외](https://docs.aws.amazon.com/config/latest/developerguide/select-resources.html) 기능을 통해 비용 최적화를 제공하여, 조직이 구성 모니터링 비용을 전략적으로 관리할 수 있도록 합니다. 위험 프로필과 관련성이 낮은 특정 리소스 유형이나 대량의 구성 항목을 생성하는 리소스 유형을 제외하면, 필수 보안 모니터링을 유지하면서 비용을 크게 줄일 수 있습니다. 이 기능은 AWS Management Console과 CLI의 AWS Config 설정을 통해 접근하고 구성할 수 있습니다. 그러나 리소스 제외는 신중한 고려와 적절한 이해관계자 참여를 통해 접근해야 합니다. 조직은 보안 및 운영 팀을 참여시켜 모니터링과 규정 준수 요구 사항에 중요한 리소스와 안전하게 제외할 수 있는 리소스에 대한 철저한 평가를 수행해야 합니다. 목표는 비용 효율성과 강력한 거버넌스 태세 유지 사이의 최적의 균형을 찾는 것입니다. 예를 들어, 임시 개발 리소스는 제외 대상이 될 수 있지만, 중요 프로덕션 인프라는 일반적으로 연속 모니터링을 유지해야 합니다. 제외를 구현하기 전에 [AWS 보안 모범 사례](https://docs.aws.amazon.com/config/latest/developerguide/security-best-practices.html)를 검토하고 [AWS Well-Architected Framework](https://aws.amazon.com/architecture/well-architected/)를 참조하여 결정이 보안 및 규정 준수 요구 사항에 부합하는지 확인하는 것이 권장됩니다. 또한 비즈니스 요구와 보안 요구 사항이 시간이 지남에 따라 변화하므로 조직은 제외 정책을 정기적으로 검토해야 합니다.

[AWS Control Tower](https://aws.amazon.com/controltower/)는 현재 구성 레코더 사용자 지정을 지원하지 않는다는 점에 유의하세요. 그러나 기본 지원이 추가될 때까지 Control Tower 환경에서 AWS Config 리소스 추적을 사용자 지정하기 위한 해결 방법이 [이 블로그에 설명](https://aws.amazon.com/blogs/mt/customize-aws-config-resource-tracking-in-aws-control-tower-environment/)되어 있습니다.


#### 주요 구성 항목

때로 [AWS::Config::ResourceCompliance](https://docs.aws.amazon.com/config/latest/developerguide/view-compliance-history.html)는 가장 영향력 있는 CI 생성기 중 하나이며, 특히 많은 규칙 평가를 수행하는 고객에게 그렇습니다. 이 리소스 유형은 AWS Config 콘솔에서 규정 준수 상태의 타임라인 뷰를 제공합니다. 귀중한 인사이트를 제공하지만, 특히 대규모 리소스를 평가할 때 구성 항목 비용을 크게 증가시킬 수 있습니다. 이 경우, 비용을 줄이기 위해 제외를 고려할 수 있습니다.

과거 규정 준수 검사를 위해 고객은 비용 없는 대안으로 CloudTrail 데이터를 활용할 수 있습니다. 아래 쿼리를 Athena, 타사 솔루션에서 작동하도록 수정하거나 CloudTrail Lake가 활성화된 경우 이를 사용할 수 있습니다.


```
SELECT
    eventTime,awsRegion, recipientAccountId, element_at(additionalEventData, 'configRuleName'
    ) as configRuleName, json_extract_scalar(json_array_get(element_at(requestParameters,'evaluations'
        ),0
        ),'$.complianceType'
    ) as Compliance, json_extract_scalar(json_array_get(element_at(requestParameters,'evaluations'
        ),0
        ),'$.complianceResourceType'
    ) as ResourceType, json_extract_scalar(json_array_get(element_at(requestParameters,'evaluations'
        ),0
        ),'$.complianceResourceId'
    ) as ResourceName
FROM
    $EDS_ID
WHERE
    eventName='PutEvaluations'
    and eventTime > '2022-03-17 00:00:00'
    AND eventTime < '2022-03-18 00:00:00'
    And json_extract_scalar(json_array_get(element_at(requestParameters,'evaluations'
        ),0
        ),'$.complianceType'
    ) IN ('COMPLIANT','NON_COMPLIANT')
```



#### AWS Config 간접 관계

AWS Config에는 두 가지 유형의 관계가 있습니다:
직접 관계:

* 리소스의 구성 데이터에서 추출한 단순한 A→B 관계
* describe API 호출에서 직접 가져옴
* 예: Amazon EC2 인스턴스와 보안 그룹 간의 관계는 직접적입니다. 보안 그룹이 Amazon EC2 인스턴스의 describe API 응답에 포함되기 때문입니다.

간접 관계:

* 이전 리소스 유형은 여러 리소스 구성을 검사하여 구성을 기록할 수 있습니다
* 예: 보안 그룹과 Amazon EC2 인스턴스 간의 관계는 간접적입니다. 보안 그룹을 describe해도 연결된 인스턴스에 대한 정보가 반환되지 않기 때문입니다. 이 경우 AWS Config는 두 개의 구성 항목을 생성합니다.

간접 관계를 지원하는 리소스에 대해 [이 링크에서](https://docs.aws.amazon.com/config/latest/developerguide/faq.html) 자세히 알아볼 수 있습니다.

간접 관계를 옵트아웃하려면 [기술 담당 관리자](https://aws.amazon.com/premiumsupport/plans/enterprise/)에게 문의하는 것을 권장합니다.

#### 규칙 관리 및 평가 고려 사항

AWS Config 규칙을 관리할 때 규칙 삭제와 재평가 작업이 비용에 상당한 영향을 미칠 수 있으므로 이를 고려해야 합니다. 많은 수의 리소스를 평가하는 규칙을 삭제할 때, 비용 효율적인 접근 방식은 먼저 [리소스 규정 준수 기록을 중지](https://docs.aws.amazon.com/config/latest/developerguide/stop-start-recorder.html)한 다음 규칙을 삭제하고 마지막으로 규정 준수 기록을 다시 시작하는 것입니다. 이 작업은 저장된 데이터에는 영향을 미치지 않지만 레코더가 중지된 동안 리소스 구성에 대한 가시성에는 영향을 미칩니다. 이 순차적 프로세스는 불필요한 구성 항목 생성 급증과 관련 비용을 방지하는 데 도움이 됩니다.

#### API 호출 최적화

효율적인 API 작업은 AWS Config 비용을 줄일 수 있습니다. [EC2 인스턴스](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/Using_Tags.html)에 여러 태그를 추가하는 것과 같이 리소스를 수정할 때, 여러 개별 호출을 만드는 것보다 변경 사항을 단일 API 호출로 통합하는 것이 권장됩니다. 예를 들어, 10개의 태그를 하나의 API 호출로 추가하는 것이 10개의 개별 호출을 만드는 것보다 효율적입니다. 각 호출이 API 변경 레코드와 리소스 규정 준수 구성 항목을 모두 생성하기 때문입니다.

#### 사용자 정의 규칙 및 Lambda 함수 최적화

사용자 정의 규칙 구현 시 실행 비용을 줄이기 위해 Lambda 함수보다 [CloudFormation Guard](https://docs.aws.amazon.com/cfn-guard/latest/ug/what-is-guard.html) 사용이 선호됩니다. 그러나 Lambda 기반 사용자 정의 규칙이 필요한 경우 다음을 통해 최적화하세요:

* 특정 대상 지정을 사용하여 평가되는 리소스의 범위를 좁히기. 범위 기반 규칙은 주기적 평가가 아닌 이벤트 기반 평가에만 지원됩니다
* 더 나은 제어를 위한 리소스 태깅 구현
* 삭제된 리소스의 평가 종료를 처리하는 로직 추가
* 모든 리소스를 평가하는 대신 리소스별 트리거 사용

#### 적합성 팩 및 규칙 중복 제거

규칙과 [적합성 팩](https://docs.aws.amazon.com/config/latest/developerguide/conformance-packs.html)의 정기적인 감사는 중복을 제거하는 데 필수적입니다. 예를 들어, 여러 적합성 팩에 이미 [AWS Security Hub](https://aws.amazon.com/security-hub/)에서 평가하고 있는 동일한 규칙(예: CloudTrail 활성화 검사)이 포함된 경우, 불필요한 평가 비용을 피하기 위해 중복 규칙을 제거하는 것을 고려하세요. 효과를 유지하면서 비용을 최적화하기 위해 다양한 규정 준수 표준 간 겹치는 규칙을 검토하고 통합하세요. [중복 AWS Config 규칙 발견](https://aws.amazon.com/blogs/security/discover-duplicate-aws-config-rules-for-streamlined-compliance/) 블로그를 참조하세요.

#### 여러 리전에서 글로벌 리소스 기록 최적화

여러 리전에 걸쳐 AWS Config를 구현할 때, 비용을 제어하고 중복 데이터 수집을 방지하기 위해 글로벌 리소스 기록을 최적화할 수 있습니다. 모범 사례는 AWS 환경 내 단일 리전으로 글로벌 리소스 기록을 제한하는 것입니다. 이는 지정된 한 리전에서만 'IncludeGlobalResourceTypes' 속성을 'true'로 설정하여 AWS CloudFormation 템플릿을 통해 관리할 수 있습니다. 이 접근 방식은 본질적으로 글로벌한 IAM 사용자, 역할, 정책과 같은 리소스에 중요합니다. 이 접근 방식을 구현함으로써 조직은 여러 리전에 걸친 글로벌 리소스 기록의 불필요한 중복을 방지할 수 있으며, 글로벌 리소스에 대한 포괄적인 가시성을 유지하면서 상당한 비용 절감을 달성할 수 있습니다.

#### 통합 서비스 최적화

AWS Config는 다양한 AWS 서비스와 상호 작용하며, 각 서비스가 전체 비용에 기여합니다. 이러한 통합 서비스의 개별 비용을 최적화하기 위한 모범 사례를 구현하세요:

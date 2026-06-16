---
sidebar_position: 4
---

# JITNA Cedar 정책 예제

이 섹션에서는 Systems Manager just-in-time 노드 접근(JITNA) 사용 시 정책 예제 모음을 제공합니다. 이 샘플들은 AWS 고객이 just-in-time 노드 세션 요청에 대한 자동 접근을 허용하거나 거부하는 Cedar 정책을 구현하는 방법을 교육하기 위해 설계되었습니다.

just-in-time 노드 접근의 스키마에 대한 자세한 내용은 [자동 승인 및 거부 접근 정책의 명령문 구조 및 내장 연산자](https://docs.aws.amazon.com/systems-manager/latest/userguide/auto-approval-deny-access-policy-statement-structure.html)를 참조하세요. [Cedar playground](https://www.cedarpolicy.com/)에서 Cedar 정책 작성에 대해 자세히 알아보세요.

이것은 샘플 코드이며, 프로덕션 환경에서 사용하기 전에 개발 환경에서 철저하게 테스트하고 검증해야 합니다.

## 온콜 IDC 그룹의 프로덕션 노드 자동 접근 허용

다음 예제는 다음에 대한 자동 접근을 허용합니다:

* 태그 키-값 쌍 `Environment:DEV`로 식별되는 개발 노드에 대한 모든 ID의 접근.
* AWS Identity Center(IDC) 그룹 **OnCall**의 사용자가 태그 키-값 쌍 `Environment:PROD`로 식별되는 프로덕션 노드에 접근.

```language=cedar
// DEV 노드에 대한 자동 접근 허용
permit (principal, 
      action == AWS::SSM::Action::"getTokenForInstanceAccess", 
      resource)
    when {
    resource.hasTag("Environment") && 
    resource.getTag("Environment") == "DEV"
    };

// OnCall 사용자에 대한 PROD 노드 자동 접근 허용
// OnCall IDC Group ID: 34688438-1061-702c-a03d-1fa788dccfd1
permit (principal in AWS::IdentityStore::Group::"34688438-1061-702c-a03d-1fa788dccfd1", 
      action == AWS::SSM::Action::"getTokenForInstanceAccess", 
      resource)
    when {
    resource.hasTag("Environment") && 
    resource.getTag("Environment") == "PROD"
    };
```

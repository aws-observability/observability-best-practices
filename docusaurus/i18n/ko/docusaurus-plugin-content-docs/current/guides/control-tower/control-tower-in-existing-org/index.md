---
sidebar_position: 4
---
# 기존 AWS Organization에서 Control Tower 활성화 시 추가 고려사항

## Control Tower 계정

Control Tower는 AWS Organization의 관리 계정에서 활성화해야 합니다. 단일 AWS Organization에 여러 랜딩 존을 구성하는 것은 불가능합니다.

처음 Control Tower를 활성화하면 Organization의 기존 계정이 자동으로 등록되지는 않지만, 두 개의 OU와 [공유 계정](https://docs.aws.amazon.com/controltower/latest/userguide/accounts.html#special-accounts) 및 [해당 계정 내 리소스](https://docs.aws.amazon.com/controltower/latest/userguide/shared-account-resources.html)가 생성됩니다. Organization에는 이를 허용할 수 있는 충분한 쿼터가 있어야 합니다.

Control Tower 설정 시 로그 아카이브 또는 감사 계정으로 [기존 계정을 사용](https://aws.amazon.com/blogs/mt/use-existing-logging-and-security-account-with-aws-control-tower/)해야 하는 경우 가능하지만, [Config 레코더를 삭제](https://docs.aws.amazon.com/cli/latest/reference/configservice/delete-configuration-recorder.html)하고 [Config 전송 채널을 삭제](https://docs.aws.amazon.com/cli/latest/reference/configservice/delete-delivery-channel.html)해야 합니다. 일반적으로 Control Tower가 이러한 계정을 생성하도록 하고 필요에 따라 기존 로그를 복사하는 것이 더 간단하지만, AWS 이외의 서비스와 기존 로그 통합이 있는 경우 등 일부 상황에서는 기존 계정을 재사용해야 할 수 있습니다.

## Identity Center

Control Tower와 함께 AWS Identity Center를 사용하여 사용자 인증을 제공하는 것을 강력히 권장합니다. Control Tower가 Identity Center를 관리하지 않도록 선택하고 Identity Center가 아직 활성화되지 않은 경우, Control Tower는 이를 활성화하지 않으며 Organization에 대한 대체 ID 솔루션을 구현해야 합니다.

기존에 Identity Center가 구성되어 있지 않고 Identity Center 관리를 선택(opt-in)하면, Control Tower가 서비스를 활성화하며 [ID 소스 선택에 따라](https://docs.aws.amazon.com/controltower/latest/userguide/getting-started-prereqs.html#sso-considerations) 그룹과 권한 세트를 프로비저닝할 수도 있고 그렇지 않을 수도 있습니다.

이미 Identity Center가 구성되어 있다면, Control Tower 홈 리전과 동일한 리전에 있어야 합니다. Control Tower 관리를 선택하고 로컬 IAM Identity Center 디렉터리를 사용하는 경우, Control Tower가 사용자, 그룹 및 권한 세트를 생성합니다. 다른 디렉터리를 사용하는 경우 [Control Tower는 변경을 수행하지 않습니다](https://docs.aws.amazon.com/controltower/latest/userguide/about-extending-governance.html#sso-and-existing-orgs).

IAM 사용자 또는 IAM 페더레이션을 사용하는 기존 ID 솔루션이 있다면 Identity Center를 도입해야 합니다. Control Tower와 Identity Center를 활성화해도 기존 IAM 사용자, 역할, 정책에 영향을 미치지 않으며 기존 IAM SAML 구성에도 영향을 주지 않습니다. 이를 통해 전환 기간 동안 두 시스템을 병렬로 운영할 수 있으며, 기존 IAM 사용자/IAM 페더레이션을 제거할 준비가 되면 전환할 수 있습니다.



## CloudTrail

기존 Organization에서 Control Tower의 CloudTrail 관리를 활성화하려면, Control Tower [사전 검사(pre-flight checks)](https://docs.aws.amazon.com/controltower/latest/userguide/getting-started-prereqs.html)를 통과하기 위해 CloudTrail에 대한 [신뢰할 수 있는 액세스를 비활성화](https://docs.aws.amazon.com/organizations/latest/userguide/services-that-can-integrate-cloudtrail.html#integrate-disable-ta-cloudtrail)해야 합니다.

Control Tower의 CloudTrail 관리를 선택 해제(opt-out)하면, 추적(trail) 배포, 로깅 중앙화 및 추적 보호를 위한 보안 조치를 직접 구현해야 합니다. Control Tower는 선택 해제 시에도 [조직 추적(organization trail)](https://docs.aws.amazon.com/awscloudtrail/latest/userguide/creating-trail-organization.html)을 생성하지만 상태가 비활성으로 설정됩니다. Control Tower가 CloudTrail을 관리하도록 허용하는 것을 권장합니다.

**계정 수준 추적이 있는 기존 Organization**에서 CloudTrail 관리를 활성화하면, 로그 아카이브 계정의 버킷에 로깅하도록 구성된 새 Organizations 관리 추적이 생성됩니다. 기존 추적은 그대로 유지되므로, 해당 추적이 기록 중이라면 각 계정의 각 리전에서 첫 번째 관리 이벤트 복사본만 무료이기 때문에 Organization 전체에서 CloudTrail 비용이 크게 증가할 수 있습니다. 계정 수준 추적의 기록을 중지하면 추가 비용을 방지할 수 있습니다.

**Organization 추적이 있는 기존 Organization**에서 Control Tower 관리를 선택하려면, [신뢰할 수 있는 액세스를 비활성화](https://docs.aws.amazon.com/organizations/latest/userguide/services-that-can-integrate-cloudtrail.html#integrate-disable-ta-cloudtrail)해야 합니다. 이렇게 하면 계정의 모든 조직 추적이 어차피 비기능 상태가 되므로, 다시 활성화될 때 기록으로 인한 과금을 피하기 위해 기존 추적의 [로깅을 중지](https://docs.aws.amazon.com/awscloudtrail/latest/userguide/cloudtrail-turning-off-logging.html)해야 합니다. 그런 다음 신뢰할 수 있는 액세스를 비활성화하고 Control Tower를 활성화합니다. 이로 인해 Organization에 대한 CloudTrail 데이터가 없는 짧은 기간이 발생하므로 유지보수 기간 중에 계획해야 합니다.


## Config

Control Tower의 Config 관리를 선택 해제하는 것은 불가능합니다.

기존 Organization에서 Control Tower를 활성화하는 경우, Control Tower [사전 시작 검사(pre-launch checks)](https://docs.aws.amazon.com/controltower/latest/userguide/getting-started-prereqs.html)를 통과하려면 [Config에 대한 신뢰할 수 있는 액세스가 비활성화](https://docs.aws.amazon.com/organizations/latest/userguide/services-that-can-integrate-config.html#integrate-disable-ta-config)되어 있어야 합니다. Control Tower는 활성화 과정에서 신뢰할 수 있는 액세스를 활성화합니다.

로그 아카이브 및 감사 계정으로 기존 계정을 사용할 계획이라면, 해당 계정에서 먼저 [모든 Config 리소스를 삭제](https://docs.aws.amazon.com/controltower/latest/userguide/existing-config-resources.html)해야 합니다.




## 백업

Control Tower [AWS Backup 통합](https://docs.aws.amazon.com/controltower/latest/userguide/backup.html)을 통해 각 멤버 계정에 볼트를 갖추고, 공유 계정에 중앙 볼트와 기본적인 백업 정책을 포함하는 기본 백업 솔루션을 구성할 수 있습니다. 이는 OU 수준에서 활성화할 수 있으며, 개별 리소스에 태그를 지정하여 해당 백업 일정의 대상으로 설정할 수 있습니다.

기존 백업 솔루션이 있다면 Backup 통합을 선택 해제할 수 있습니다.

Control Tower 통합은 논리적으로 격리된 볼트(air-gapped vault)를 배포하지 않으며, 기본적으로 리전 간 백업 구성을 제공하지 않습니다.


## 기존 OU 및 계정으로 거버넌스 확장

기존 Organization에서 Control Tower를 활성화해도 Organization의 기존 OU 및 계정에 대한 거버넌스가 자동으로 확장되지 않습니다. Control Tower를 사용하여 [기존 계정을 등록](https://docs.aws.amazon.com/controltower/latest/userguide/enroll-account.html)해야 Control Tower 거버넌스 하에 두 수 있습니다.

계정을 등록하려면 몇 가지 [사전 요구사항](https://docs.aws.amazon.com/controltower/latest/userguide/enrollment-prerequisites.html)이 있습니다:

* 랜딩 존이 드리프트 상태가 아니어야 합니다
* 계정이 Organization의 멤버여야 합니다
* [AWSControlTowerExecution](https://docs.aws.amazon.com/controltower/latest/userguide/awscontroltowerexecution.html) 역할이 있어야 하며 AdministratorAccess 권한을 가지고 있어야 합니다
* AWSControlTowerExecution 역할이 등록하는 계정에 [Control Tower 리소스를 배포](https://docs.aws.amazon.com/controltower/latest/userguide/enroll-account.html#what-happens-during-account-enrollment)할 수 있도록 Organization에 [StackSets 신뢰할 수 있는 액세스가 활성화](https://docs.aws.amazon.com/organizations/latest/userguide/services-that-can-integrate-cloudformation.html)되어 있어야 합니다
* 기존 AWS Config 리소스를 [삭제](https://docs.aws.amazon.com/controltower/latest/userguide/enroll-account.html#example-config-cli-commands)해야 합니다. 이것이 불가능한 경우 고객 지원을 통해 기존 Config 리소스 사용을 활성화하는 [프로세스](https://docs.aws.amazon.com/controltower/latest/userguide/existing-config-resources.html)가 있습니다. 단, 이는 로그 아카이브 및 감사 계정에는 해당되지 않으며, 해당 계정의 Config 리소스는 반드시 삭제해야 합니다.

기존 AWS 계정을 AWS Control Tower에 가져오는 가장 효율적인 방법은 [전체 OU를 등록](https://docs.aws.amazon.com/controltower/latest/userguide/importing-existing.html)하는 것입니다. OU를 등록하면 해당 멤버 계정이 AWS Control Tower 랜딩 존에 등록됩니다. AWSControlTowerExecution 역할이 계정에 자동으로 추가됩니다. OU에는 최대 1000개의 계정을 포함할 수 있습니다.



## 기존 컨트롤

예방적 컨트롤(SCP, RCP)이 적용된 OU에 기존 계정을 등록하는 경우, 이러한 컨트롤이 [프로비저닝 또는 등록 작업을 방해하지 않는지](https://docs.aws.amazon.com/controltower/latest/userguide/quick-account-provisioning.html#common-causes-for-enrollment-failure) 확인하세요. 또는 이러한 컨트롤이 필요한 경우, 계정을 전용 등록 OU에 등록한 후 최종 대상으로 이동할 수 있습니다.

AWS Organizations에는 기존 예방적 컨트롤이 있는 계정과 OU로 거버넌스를 확장할 때 초과하지 않도록 주의해야 하는 [서비스 제한](https://docs.aws.amazon.com/organizations/latest/userguide/orgs_reference_limits.html)이 있습니다:

* RCP 및 SCP의 최대 정책 크기: 5120자
* 최대 OU 중첩 5단계
* OU 또는 계정에 직접 연결된 최대 RCP 5개, SCP 5개


탐지적 컨트롤의 경우, 계정에 기존 Config 규칙이 정의되어 있으면 계정을 등록하기 위해 Config 레코더를 삭제해도 해당 규칙은 유지됩니다. 계정을 Control Tower에 등록하고 새 레코더가 생성되면 규칙의 평가가 재개됩니다.

Control Tower 외부에서 정의된 Config 규칙의 규정 준수 상태는 Control Tower 대시보드에서 확인할 수 없습니다.

사용자 지정 Config 규칙을 사용하고 있으며 전체 AWS Organization에 걸친 포괄적인 규정 준수 보기를 원한다면, [Cloud Intelligence Dashboards](https://catalog.workshops.aws/awscid/en-US) 프레임워크의 [Config Resource Compliance Dashboard](https://catalog.workshops.aws/awscid/en-US/dashboards/additional/config-resource-compliance-dashboard) 구현을 고려하세요.

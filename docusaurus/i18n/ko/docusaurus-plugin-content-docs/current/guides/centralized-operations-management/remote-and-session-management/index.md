---
sidebar_position: 6
---
# 원격 및 세션 관리

원격 및 세션 관리에는 Run Command, Fleet Manager 및 Session Manager와 같은 기능이 포함됩니다.

## 원격 관리

AWS Systems Manager의 도구인 Run Command를 사용하면 관리 노드의 구성을 원격으로 안전하게 관리할 수 있습니다. Run Command를 통해 일반적인 관리 작업을 자동화하고 대규모로 일회성 구성 변경을 수행할 수 있습니다. AWS Management Console, AWS Command Line Interface(AWS CLI), AWS Tools for Windows PowerShell 또는 AWS SDK에서 Run Command를 사용할 수 있습니다.

![Remote Management](/img/cloudops/guides/centralized-operations-management/remote-and-session-management/BP-Remote-Session-Mgmt-1.png "Remote Management")

Run Command의 일반적인 사용 사례는 다음과 같습니다:

* **노드 부트스트랩:** 모든 또는 특정 노드에 애플리케이션을 설치하거나 부트스트랩할 수 있습니다.
* **구성 관리:** Systems Manager는 [Ansible](https://aws.amazon.com/blogs/mt/running-ansible-playbooks-using-ec2-systems-manager-run-command-and-state-manager/), [Salt States](https://aws.amazon.com/blogs/mt/running-salt-states-using-amazon-ec2-systems-manager/), [PowerShell DSC](https://aws.amazon.com/blogs/mt/combating-configuration-drift-using-amazon-ec2-systems-manager-and-windows-powershell-dsc/) 등 다양한 도메인 특화 언어(DSL)를 지원합니다.
* **도메인 가입:** 노드를 Windows 도메인에 가입시킵니다.
* **다른 Amazon 에이전트 배포:** Parameter Store에 에이전트 구성을 저장합니다.

### 복합 명령 문서

이러한 Systems Manager 문서는 관리 노드에서 수행하려는 작업을 정의합니다. Systems Manager는 다양한 사전 정의된 공개 문서를 제공하며 문서를 사용자 지정하는 기능도 제공합니다. 구성의 일부로 [복합 문서를 실행](https://aws.amazon.com/about-aws/whats-new/2017/10/amazon-ec2-systems-manager-now-integrates-with-github/)할 수 있습니다. 복합 문서는 하나 이상의 보조 문서를 실행하는 작업을 수행합니다.

복합 명령 문서를 활용할 때 유의할 점은 순차적 작업만 가능하고 분기가 없다는 것입니다. AWS-RunDocument를 통해 Systems Manager, 비공개 또는 공개 GitHub, Amazon S3에 저장된 문서를 실행할 수 있습니다. 이는 [aws:downloadContent](http://docs.aws.amazon.com/systems-manager/latest/userguide/ssm-plugins.html#aws-downloadContent) 및 [aws:runDocument](http://docs.aws.amazon.com/systems-manager/latest/userguide/ssm-plugins.html#aws-rundocument) 플러그인을 사용하여 구현됩니다. aws:runDocument 플러그인은 Systems Manager 또는 로컬 경로에 있는 문서를 실행합니다. 이에 대한 예시로 AWS-RunPatchBaselineWithHooks가 있습니다.

### Run Command 제한

IAM 사용자/역할을 통해 사용자가 세션에서 실행할 수 있는 명령을 제한할 수 있습니다. 문서에서 사용자가 세션을 시작할 때 실행되는 명령과 사용자가 명령에 제공할 수 있는 파라미터를 정의합니다. ssm:SendCommand, 문서 이름 또는 접두사, 리소스 태그, 리소스 ID를 기반으로 액세스를 제한할 수 있습니다. SAML 세션 태그를 사용하여 ABAC 정책을 적용할 수도 있습니다.

![Restricting Run Command](/img/cloudops/guides/centralized-operations-management/remote-and-session-management/BP-Remote-Session-Mgmt-2.png "Restricting Run Command")

1. 예를 들어, [AWS Identity and Access Management(IAM)](https://aws.amazon.com/iam/) 사용자가 속한 부서를 기반으로 특정 관리 노드에 대한 액세스를 부여할 수 있습니다.
1. Alice와 Bob은 외부 Identity Provider(IdP)를 사용하여 [AWS Management Console](http://aws.amazon.com/console)에 페더레이션합니다. 두 페더레이션 사용자는 각각 "department" 멤버십(Amber와 Blue)에 따라 Session Manager를 사용하여 특정 EC2 인스턴스에 액세스해야 합니다.

### 다중 계정 및 다중 리전 Run Command

* Run Command 자체는 계정/리전별로 작동합니다.
* Automation을 활용하여 계정/리전 간 호출이 가능합니다.

AWS Systems Manager의 도구인 Automation은 일반적인 유지 보수, 배포 및 수정 작업을 간소화합니다. 여러 계정/리전을 대상으로 활용할 수 있습니다. 다중 계정/다중 리전 Automation의 경우 하위 계정을 대상으로 할 때 명령 문서가 대상 계정/리전에 존재해야 합니다. CloudFormation 또는 Terraform을 사용하여 명령 문서를 배포할 수 있습니다. Systems Manager 서비스가 Automation 작업을 실행할 수 있도록 필요한 권한이 설정되어야 합니다. 자세한 내용은 Automation 섹션을 참조하세요.

![Multi-account and multi-Region Run Command](/img/cloudops/guides/centralized-operations-management/remote-and-session-management/BP-Remote-Session-Mgmt-3.png "Multi-account and multi-Region Run Command")

### AWS Systems Manager State Manager 연결을 통한 Run Command 예약

State Manager는 AWS, 온프레미스 또는 멀티클라우드의 관리 노드를 원하는 상태로 유지하는 프로세스를 자동화합니다. State Manager에서 연결이란 문서에 표현된 구성과 특정 일정에 따른 대상 집합 간의 바인딩으로, 일관된 상태를 보장합니다. 런북으로 State Manager 연결을 생성하여 Automation을 시작할 수 있습니다. 구성과 연결된 명령 문서는 모든 대상 계정/리전에 존재해야 합니다.

![Scheduling Run Command](/img/cloudops/guides/centralized-operations-management/remote-and-session-management/BP-Remote-Session-Mgmt-4.png "Scheduling Run Command")

### 오류, 종료 및 재부팅 코드 처리

기본적으로 스크립트에서 마지막으로 실행된 명령의 종료 코드가 전체 스크립트의 종료 코드로 보고됩니다.

* `Exit 0`은 상태: `Success`로 표시됩니다.
* `Exit 1` 또는 기타 값은 상태: `Failed`로 표시됩니다.
* 특정 종료 코드를 포함하여 오류를 더 빠르게 식별할 수 있습니다.
* 재부팅 코드:
  * Windows: `exit 3010`
  * Linux: `exit 194`

![Scheduling Run Command](/img/cloudops/guides/centralized-operations-management/remote-and-session-management/BP-Remote-Session-Mgmt-5.png "Scheduling Run Command")

### Amazon CloudWatch를 사용한 Run Command 모니터링

AWS Systems Manager는 Run Command 명령의 상태에 대한 메트릭을 CloudWatch에 게시하므로 해당 메트릭을 기반으로 알람을 설정할 수 있습니다. Systems Manager가 CloudWatch에 전송하는 특정 메트릭에는 ```Delivery Time Out```, ```Failed``` 수, ```Successful``` 수가 있습니다.

Run Command 모니터링에 대해 자세히 알아보려면 [Amazon CloudWatch를 사용한 Run Command 메트릭 모니터링](https://docs.aws.amazon.com/systems-manager/latest/userguide/monitoring-cloudwatch-metrics.html)을 참조하세요.

## 세션 관리

AWS Session Manager는 완전 관리형 AWS Systems Manager 도구입니다. 대화형 원클릭 브라우저 기반 셸 또는 AWS Command Line Interface(AWS CLI)를 사용하여 관리 노드와 상호 작용할 수 있습니다. Session Manager는 인바운드 포트를 열거나, 배스천 호스트를 유지하거나, SSH 키를 관리할 필요 없이 안전한 노드 관리를 제공합니다. 관리 노드에 대한 제어된 액세스, 엄격한 보안 관행, 노드 액세스 세부 정보가 포함된 로그를 요구하는 기업 정책을 준수하면서도 최종 사용자에게 관리 노드에 대한 간단한 원클릭 크로스 플랫폼 액세스를 제공할 수 있습니다.

### 거버넌스

![Governance](/img/cloudops/guides/centralized-operations-management/remote-and-session-management/BP-Remote-Session-Mgmt-6.png "Governance")

* ***사용자와 데이터 분리***: 클라우드 운영의 핵심 원칙은 가능한 한 사용자와 데이터를 분리하는 것입니다. Session Manager는 자격 증명을 가진 누구라도 서버의 구성에 액세스하고 잠재적으로 변경할 수 있는 인바운드 네트워크 포트를 차단합니다. Session Manager는 개별 명령을 실행하고 대화형 세션 없이 결과를 볼 수 있도록 사용자를 제한함으로써 더 나아갈 수 있습니다.

* ***중앙 집중식 액세스 관리***: 클라우드 운영은 환경에 대한 탄력적이고 지속적인 변경 흐름을 초래할 수 있습니다. 각 서버에서 누가 각 서버에 액세스할 수 있는지 유지하는 대신, Session Manager는 Identity Access Management와 통합하여 누가 어떤 노드에 액세스할 수 있는지 중앙에서 정의할 수 있게 합니다.

* ***워크로드 및 컴포넌트에 대한 액세스 제어***: 조직은 IAM을 사용하여 워크로드 또는 역할에 따라 노드에 대한 액세스를 제어할 수 있습니다. 예를 들어, 데이터베이스 관리자는 "Component: Database"로 태그된 모든 인스턴스에 원격으로 액세스할 수 있고, 애플리케이션 개발자는 "Environment: Development"로 태그된 모든 인스턴스에 원격으로 액세스할 수 있습니다. 이러한 속성 기반 액세스 제어를 통해 프로젝트 팀은 비즈니스에 가치를 제공하는 데 필요한 만큼 빠르게 작업할 수 있으면서도, 조직은 정의된 가드레일 내에서 운영되고 있다는 것을 확신할 수 있습니다.

* ***특정 역할에 대한 명령 제한***: 사용자와 데이터 분리에서 언급했듯이, 역할이 해당 역할에 필요한 특정 명령 세트만 실행하도록 허용할 수 있습니다. 예를 들어, 애플리케이션 개발자가 프로덕션 환경에 대한 대화형 액세스 없이도 프로덕션의 애플리케이션 로그 파일을 "tail"할 수 있습니다.

* ***비즈니스 사유에 따른 임시 액세스 부여***: 오픈 소스 및 상용 임시 권한 상승 액세스 솔루션에서 제공하는 추가 기능을 사용하면, 유효한 비즈니스 사유가 없는 한 모든 운영자에게 원격 액세스를 거부할 수도 있습니다. 예를 들어, 프로덕션 애플리케이션 서버는 원격으로 액세스할 방법이 없습니다. 그러나 인시던트 발생 시 운영자가 인시던트를 조사하기 위해 서버에 대한 임시 액세스를 요청하고 부여받을 수 있습니다. 이 액세스는 기록된 사유와 연결되고, 두 번째 운영자가 승인하며, 작업에 필요한 기간만큼만 설정됩니다.

### Observability 및 컴플라이언스

* **VM 및 컨테이너 세션 활동 로깅 및 관리 노드 액세스 및 활동 모니터링:** Session Manager를 사용하여 AWS 콘솔에서 터미널 세션을 시작하면 세션의 모든 명령과 결과를 S3 및 CloudWatch Log 그룹에 기록할 수 있습니다. 이를 통해 대화형 세션 중 수행된 모든 변경 사항에 대한 감사 추적을 제공할 수 있습니다. CloudTrail 이벤트를 사용하여 노드에 대한 성공 및 실패한 원격 세션을 모니터링(필요시 알림)할 수도 있습니다. 예를 들어, 정의된 변경 창 외에 수행된 원격 세션에 대해 해당 담당자와 관리자에게 알림을 보낼 수 있습니다.

### 운영 간소화

* **콘솔에서 원클릭 액세스:** Session Manager는 EC2 콘솔, Session Manager 콘솔, Fleet Manager 콘솔에서 "Connect" 옵션을 제공하는 AWS 콘솔과 잘 통합되어 있습니다.
* **SSH 관리 불필요:** Session Manager를 사용하면 탄력적인 노드 플릿에 대한 SSH 액세스를 위한 PKI 인프라의 생성, 배포 및 갱신을 관리할 필요가 없습니다. IAM을 통한 중앙 인증이 플릿 전체에서 개인 키의 저장, 보호 및 모니터링 필요성을 대체합니다.
* **보안 그룹을 열지 않고 액세스 허용:** Session Manager의 "Port Forwarding" 기능을 사용하면 인스턴스의 원격 세션 포트에 대한 네트워크 액세스를 열거나 확장할 필요 없이 노드에 대한 승인된 액세스를 허용할 수 있습니다. 예를 들어, 개발자가 완전히 암호화되고 인증된 파이프라인을 통해 자신의 홈 개발 머신에서 Session Manager 서비스를 거쳐 해당 인스턴스로 포트 포워딩된 테스트 환경의 데이터베이스 인스턴스에 안전하게 액세스할 수 있습니다.
* **중앙 집중식 액세스:** 콘솔 및 IAM과의 통합을 통해 운영자는 필요한 곳 어디서든 필요한(그리고 승인된) 원격 액세스를 가질 수 있습니다.
* **낮은 "폭발 반경":** 인바운드 네트워크 포트를 잠그고 사용자 역할이 필요로 하는 노드만으로 원격 액세스를 중앙에서 제한함으로써 잠재적인 침해가 발생할 수 있는 "폭발 반경"을 줄입니다.

### IT 비용 최적화

* **배스천 또는 점프 호스트 불필요:** Session Manager를 사용하면 환경에서 배스천 또는 점프 호스트를 사용할 필요가 없어져 24x7 인스턴스 비용을 제거할 수 있습니다. 이는 SSH 및 RDP 인바운드 네트워크 포트가 열려 있고 환경 내 다른 노드에 SSH 및 RDP를 통한 아웃바운드 액세스가 있는 호스트를 대체하는 것을 의미합니다. 대신 클라우드 환경의 나머지와 동일한 메커니즘인 IAM을 통해 액세스가 보호되며, 세밀한 인증 및 대상 노드에 대한 임시 자격 증명 액세스를 제공합니다.
* **EC2 인스턴스 액세스에 대한 추가 요금 없음**: EC2의 기존 인스턴스 요금 외에 EC2 노드 및 컨테이너에 대한 원격 액세스를 위해 Session Manager를 사용하는 데 추가 요금이 필요하지 않습니다.

### Session Manager는 어떻게 작동하나요?

![Session Manager](/img/cloudops/guides/centralized-operations-management/remote-and-session-management/BP-Remote-Session-Mgmt-7.png "Session Manager")

1. SSM 에이전트가 노드에 설치되어 있어야 하며 포트 443 아웃바운드로 Systems Manager 서비스에 대한 연결이 필요합니다.
2. 이 연결은 퍼블릭 서비스 엔드포인트(즉, 인터넷을 통해)로 연결되거나 VPC의 프라이빗 엔드포인트를 통해 연결될 수 있습니다.
3. 노드는 네트워크를 통해 서비스에 연결하고 영구 연결을 설정하는 데 올바른 권한이 있는 프로파일이 필요합니다.

**참고:** 기본 로컬 사용자: `ssm-user.` Linux의 경우: /etc/sudoers, Windows의 경우: Administrators 그룹.

### Session Manager와 연결 설정

![Session Manager](/img/cloudops/guides/centralized-operations-management/remote-and-session-management/BP-Remote-Session-Mgmt-8.png "Session Manager")

1. 사용자가 해당 노드에 원격으로 연결하려면 노드와 "Start Session"을 시도해야 합니다.
2. Session Manager는 해당 사용자가 특정 EC2 인스턴스에서 "Start Session"이 허용되는지 확인합니다.
3. IAM이 사용자/보안 주체의 권한을 확인합니다.
4. 노드는 AWS Systems Manager에 대한 영구 연결을 통해 승인된 연결 요청을 인식합니다.
5. 노드는 AWS Session Manager 서비스를 통해 요청한 사용자에게 암호화된 터널을 설정합니다.

### Session Manager 기본 설정

Session Manager 기본 설정은 해당 계정의 리전 수준에서 Session Manager 기본 설정을 구성할 수 있는 곳을 제공합니다. 설정이 재정의되지 않는 한(예: 명령줄에서 특정 설정을 전달하는 경우) 모든 변경 사항은 해당 계정/리전의 모든 세션에 적용됩니다.

* **세션 지속 시간/타임아웃**: AWS Session Manager 세션의 최소 지속 시간은 1분이고 최대는 1,440분(24시간)입니다. 최대 지속 시간 외에도 유휴 세션 타임아웃을 구성하여 최소 1분에서 최대 60분으로 정의된 비활성 기간 후에 세션을 종료할 수 있습니다.
* **세션 암호화 설정**: AWS KMS 키 암호화를 통해 클라이언트 머신과 관리 노드 간에 전송되는 데이터에 추가적인 보호를 제공합니다. 일부 Systems Manager 기능(예: 노드 사용자 비밀번호 재설정)은 AWS KMS 암호화가 설정되어 있어야 합니다.
* **Linux/MacOS용 Run As 지원:** Run As 기능을 사용하면 AWS Systems Manager Session Manager가 관리 노드에 생성할 수 있는 시스템 생성 ssm-user 계정의 자격 증명 대신 지정된 운영 체제 사용자의 자격 증명을 사용하여 세션을 시작할 수 있습니다(Run As는 Linux 및 MacOS 노드에서만 사용 가능).
* **감사 및 보고를 위한 세션 로깅**: Session Manager를 구성하여 세션 기록 로그를 Amazon Simple Storage Service(Amazon S3) 버킷 또는 Amazon CloudWatch Logs 로그 그룹에 생성하고 전송합니다. 저장된 로그 데이터를 사용하여 관리 노드에 대한 세션 연결과 세션 중 실행된 명령을 감사하거나 보고할 수 있습니다.
* **셸 프로파일/기본 설정**: 사용자 지정 가능한 프로파일을 통해 셸 기본 설정, 환경 변수, 작업 디렉터리, 세션 시작 시 여러 명령 실행 등 세션 내 기본 설정을 정의할 수 있습니다.

### 세션 암호화

* 세션은 기본적으로 TLS 1.2로 암호화됩니다.
  * KMS 키를 사용하여 추가 암호화 계층을 활성화할 수 있습니다.
* 비밀번호 재설정과 같은 일부 Fleet Manager 작업에는 KMS 암호화가 활성화되어야 합니다.
* KMS로 암호화된 세션은 세션이 시작되면 메시지가 표시됩니다.

**참고:** KMS로 추가 암호화 계층을 추가하려면 기본 설정에 KMS 암호화 키를 추가해야 합니다. Session Manager를 사용하려면 관리 노드와 사용자 모두에게 IAM 권한이 필요합니다. KMS 암호화를 추가하면 노드와 사용자에게 할당해야 하는 권한이 증가합니다.

### 세션 로깅

기본 설정에서 세션 로깅을 활성화할 수 있습니다. 세션 로그는 터미널 세션 중 발행된 모든 명령과 표시된 결과의 기록입니다. CloudWatch 또는 S3 또는 두 곳 모두로 전송할 수 있습니다.

이를 통해 암호화된 로그 그룹과 S3 버킷을 사용할 수 있습니다. 이러한 리소스의 실제 암호화 설정은 CloudWatch와 S3에서 수행됩니다. S3 버킷과 CloudWatch 로그 그룹에 대한 액세스는 "s3:GetEncryptionConfiguration"과 같은 권한과 함께 EC2 Instance Profile에 부여해야 합니다. CloudWatch 로깅의 경우 로그를 입력 시 스트리밍하거나(권장 옵션) 세션 종료 시 로그를 전송할 수 있습니다.

**참고:** Windows Server 관리 노드에 **PowerShell Transcription** 정책 설정이 구성된 경우 세션 데이터를 CloudWatch 또는 S3로 스트리밍할 수 ***없습니다***. Linux 또는 macOS 관리 노드를 사용하는 경우 screen 유틸리티가 설치되어 있는지 확인하세요. 설치되어 있지 않으면 로그 데이터가 잘릴 수 있습니다.

* CloudWatch 로깅을 통해 Session Manager는 감사 목적으로 발행된 각 명령과 사용자에게 표시된 결과를 CloudWatch에 기록할 수 있습니다. 이 정보(및 CloudTrail에 기록된 Session Manager 이벤트)를 사용하여 고객은 IAM ID를 서버의 ssm-user 로컬 사용자로 실행된 명령과 연결할 수 있습니다.
  * 스트리밍된 로그는 JSON 형식으로 저장됩니다.
* AWS Systems Manager Session Manager의 "Session History" 탭은 개별 Session Manager 세션에서 해당 세션의 CloudWatch 로그 또는 S3 기록으로의 직접 링크를 제공합니다.
* 세션 로깅을 기록하려면 SSM, CloudWatch 및 S3에 대한 필수 권한이 있는 IAM 역할이 설정되어 있어야 합니다.

자세한 내용은 [Session Manager 및 Amazon S3와 CloudWatch Logs에 대한 권한이 있는 IAM 역할 생성 시작하기](https://docs.aws.amazon.com/systems-manager/latest/userguide/getting-started-create-iam-instance-profile.html#create-iam-instance-profile-ssn-logging)를 참조하세요.

### 세션 기본 설정 적용 방법

* 제공된 설정으로 SSM-SessionManagerRunShell 문서가 생성되고 해당 리전의 계정에 적용됩니다.
* SessionManagerRunShell.json을 사용하여 사용자 지정 기본 설정을 구성한 다음 JSON 파일을 전달하여 SSM-SessionManagerRunShell 문서를 생성할 수 있습니다.
* SessionManagerRunShell.json 파일을 업데이트하고 Update-document API를 실행하여 SSM-SessionManagerRunShell 문서를 업데이트하여 기본 설정을 수정합니다.

세션 기본 설정에 대한 자세한 내용은 [기본 설정 구성 시작하기](https://docs.aws.amazon.com/systems-manager/latest/userguide/getting-started-configure-preferences-cli.html)를 참조하세요.

### Session Manager를 사용하여 인스턴스에 연결하는 다양한 방법

1. **표준 세션:** EC2 콘솔(Connect to Instance) 또는 Fleet Manager(Start terminal Session)에서 연결하거나, 두 콘솔 모두에서 Windows용 RDP를 통해 연결할 수도 있습니다.
    1. 표준 세션은 터미널 명령줄 세션을 엽니다. Linux의 경우 셸을 열고 Windows의 경우 PowerShell 세션을 엽니다.
    2. ssm-user는 인스턴스에서 세션이 처음 시작될 때 생성됩니다. Windows에서는 Admin 그룹에, Linux에서는 sudoers에 자동으로 추가됩니다.

**참고:** 사용자가 삭제되면 SSM 에이전트가 다시 생성하지 않아 Session Manager 연결이 실패합니다.

1. **SSH:** SSH 터널을 사용하면 로컬 포트에 대한 연결을 보안 채널을 통해 원격 머신으로 전달할 수 있습니다.
    1. AWS CLI를 통해서만 가능합니다.
    1. SSH 키가 필요합니다.
        1. SCP를 통한 파일 복사가 가능합니다.
    1. SSH 구성 파일 수정이 필요합니다.
    1. 로깅
        1. 세션 명령 로깅 없음
        1. Session History, CloudTrail로 제한됨

제한 사항: 세션 명령은 로깅되지 않습니다. SSH가 모든 세션 데이터를 암호화하고 Session Manager는 SSH 연결을 위한 터널 역할만 하기 때문입니다. Session History와 CloudTrail을 사용하여 세션을 확인할 수 있습니다.

![Session Manager](/img/cloudops/guides/centralized-operations-management/remote-and-session-management/BP-Remote-Session-Mgmt-10.png "Session Manager")

1. **포트 포워딩:**
    1. AWS CLI 및 Session Manager 플러그인을 통해서만 가능합니다.
        1. CloudShell도 포함됩니다!
    1. 터널링 사용 사례를 지원합니다.
        1. EC2, RDS, Fargate, ElastiCache로의 터널링
    1. Fleet Manager를 통한 RDP를 지원합니다.
        1. 로깅
        1. 세션 명령 로깅 없음
        1. Session History 및 CloudTrail로 제한됨

**참고:** 포트 포워딩 또는 SSH를 통해 연결하는 Session Manager 세션에는 로깅이 제공되지 않습니다. SSH가 모든 세션 데이터를 암호화하고 Session Manager는 SSH 연결을 위한 터널 역할만 하기 때문입니다.

portNumber에 지정하는 값은 트래픽이 리디렉션되어야 하는 관리 노드의 원격 포트(예: 80)를 나타냅니다. 이 파라미터를 지정하지 않으면 Session Manager는 기본 원격 포트로 80을 가정합니다.

localPortNumber에 지정하는 값은 트래픽이 리디렉션되어야 하는 클라이언트의 로컬 포트(예: 56789)를 나타냅니다. 이 값은 클라이언트를 사용하여 관리 노드에 연결할 때 입력하는 값입니다. 예를 들어, localhost:56789입니다.

![Session Manager](/img/cloudops/guides/centralized-operations-management/remote-and-session-management/BP-Remote-Session-Mgmt-11.png "Session Manager")

### 표준 세션에 대한 접근 제한

IAM이 제공하는 최소 권한 원칙을 사용하여 노드에 대한 액세스를 제어할 수 있는 두 가지 요소가 있습니다.
Session Manager가 사용하는 사용자 계정이 인스턴스에서 수행할 수 있는 작업을 제한하거나, 사용자의 IAM 보안 주체가 세션을 시작할 수 있는 인스턴스를 제한할 수 있습니다.

Windows 관리 노드에서 사용자는 사용 가능한 모든 Windows 사용자(예: 노드가 도메인에 연결된 경우 AD 사용자)를 사용하여 RDP 세션을 통해 연결할 수 있습니다. 그러나 터미널 세션을 사용하여 연결하는 경우 유일한 옵션은 ssm-user입니다. Windows 노드에서 ssm-user가 수행할 수 있는 작업을 제한하려면 관리자/사용자가 ssm-user가 속한 그룹을 변경할 수 있습니다(기본적으로 Administrators 그룹의 구성원입니다).

Linux 관리 노드에서 사용자는 "Run As" 기본 설정을 구성하여 터미널 세션이 연결하는 사용자를 변경할 수 있습니다. 기본값은 sudo 권한이 있는 ssm-user입니다. "Run As"를 사용하여 ssm-user를 다른 기본 사용자로 변경할 수 있습니다.

또는 IAM 사용자 역할에 설정된 태그 값에 따라 어떤 사용자로 연결할 수 있는지 결정하는 데 사용되는 태그를 지정할 수 있습니다.

**참고:** IAM Identity Center와 권한 세트를 사용하여 사용자 액세스를 제어하고 IAM Identity Center 사용자가 태그를 설정할 수 없는 경우, Run As는 해당 사용자에게 유연성이 떨어집니다.

![Session Manager](/img/cloudops/guides/centralized-operations-management/remote-and-session-management/BP-Remote-Session-Mgmt-9.png "Session Manager")

### EC2 Instance Connect는 어떨까요?

Session Manager가 AWS Session Manager로의 아웃바운드 인증 및 승인된 링크를 통해 노드에 대한 원격 연결을 보호하고 간소화하는 것이라면, "EC2 Instance Connect"는 EC2 Linux 호스트에 대한 인바운드 SSH 연결을 간소화하는 것입니다.

EC2 Instance Connect는 EC2 메타데이터 서비스를 통해 인스턴스와 공유되는 단기 SSH 키를 생성하고 사용하여 SSH 관리를 간소화합니다. 원격 연결을 시도하는 사용자가 포트 22에 대한 인바운드 네트워크 액세스를 가지고 있어야 하며, EC2 Instance Connect는 크로스 플랫폼 및 크로스 클라우드에서 작동하는 Session Manager와 달리 EC2에서 실행되는 Linux 호스트에만 적용됩니다.

## Fleet Manager

Fleet Manager는 계정 내 리전의 모든 노드에 대한 통합 콘솔을 제공합니다(다른 리전으로 변경하면 해당 리전에서도 유사한 뷰를 볼 수 있습니다). Systems Manager에 연결되어 있는지, 에이전트 버전 등의 메타데이터를 확인할 수 있습니다. 운영자가 통합 콘솔에서 플랫폼 전반에 걸쳐 일반적인 관리 작업을 수행할 수 있어 시스템 관리자의 효율성이 향상됩니다.

![Fleet Manager](/img/cloudops/guides/centralized-operations-management/remote-and-session-management/BP-Remote-Session-Mgmt-12.png "Fleet Manager")

### Fleet Manager 사용 사례

* 관리 노드에 수동으로 연결하지 않고도 다양한 일반적인 시스템 관리 작업을 수행합니다.
* 서버를 원격으로 관리하기 위한 중앙 집중식 UI: 상태, SSM 에이전트 상태, 플랫폼 등 다양한 플랫폼 인스턴스를 확인할 수 있습니다. 관리 목적으로 UI에서 보고서를 다운로드할 수 있습니다.
  * 단일 통합 콘솔에서 여러 플랫폼에서 실행되는 노드를 관리합니다.
  * 단일 통합 콘솔에서 다양한 운영 체제를 실행하는 노드를 관리합니다.
* 시스템 관리의 효율성을 향상시킵니다.

### Fleet Manager는 노드와 어떻게 상호 작용하나요?

Fleet Manager는 ```AWSFleetManager-*```로 시작하는 문서를 호출합니다. 문서는 Run Command 또는 Session Manager를 사용하여 결과를 가져와 Fleet Manager 콘솔에 표시합니다.

# CloudWatch Agent


## CloudWatch agent 배포

CloudWatch agent는 단일 설치, 분산 구성 파일 사용, 여러 구성 파일 레이어링, 자동화를 통한 완전 배포 등 다양한 방식으로 배포할 수 있습니다. 어떤 접근 방식이 적합한지는 요구 사항에 따라 다릅니다. [^1]

:::info
	Windows 및 Linux 호스트 배포 모두 [Systems Manager Parameter Store](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/install-CloudWatch-Agent-on-EC2-Instance-fleet.html)에 구성을 저장하고 검색하는 기능을 제공합니다. 이 자동화된 메커니즘을 통해 CloudWatch agent 구성을 배포하는 것이 모범 사례입니다.
:::

:::tip
	또는 CloudWatch agent의 구성 파일을 원하는 자동화 도구([Ansible](https://www.ansible.com), [Puppet](https://puppet.com) 등)를 통해 배포할 수 있습니다. Systems Manager Parameter Store의 사용은 필수가 아니지만, 관리를 간소화합니다.
:::
## AWS 외부에서의 배포

CloudWatch agent의 사용은 AWS 내부에만 제한되지 *않으며*, 온프레미스와 다른 클라우드 환경에서도 지원됩니다. 다만 AWS 외부에서 CloudWatch agent를 사용할 때는 두 가지 추가 고려 사항이 있습니다:

1. agent가 필요한 API 호출을 수행할 수 있도록 IAM 자격 증명[^2] 설정. EC2에서도 CloudWatch API에 대한 비인증 액세스는 불가능합니다[^5].
1. 요구 사항을 충족하는 경로를 사용하여 agent가 CloudWatch, CloudWatch Logs 및 기타 AWS 엔드포인트[^3]에 연결할 수 있는지 확인. 인터넷, [AWS Direct Connect](https://aws.amazon.com/directconnect/) 또는 [프라이빗 엔드포인트](https://docs.aws.amazon.com/vpc/latest/privatelink/concepts.html)(일반적으로 *VPC 엔드포인트*라고 함)를 통해 가능합니다.

:::info
	환경과 CloudWatch 간의 전송은 거버넌스 및 보안 요구 사항과 일치해야 합니다. 일반적으로, AWS 외부 워크로드에 프라이빗 엔드포인트를 사용하면 가장 엄격하게 규제되는 산업의 고객 요구 사항도 충족합니다. 그러나 대부분의 고객은 퍼블릭 엔드포인트로 충분히 서비스를 받을 수 있습니다.
:::
## 프라이빗 엔드포인트 사용

메트릭과 로그를 전송하려면 CloudWatch agent가 *CloudWatch* 및 *CloudWatch Logs* 엔드포인트에 연결할 수 있어야 합니다. agent가 설치된 위치에 따라 이를 달성하는 여러 방법이 있습니다.

### VPC에서

a. *VPC 엔드포인트*(CloudWatch 및 CloudWatch Logs용)를 사용하여 VPC와 CloudWatch 간에 완전히 프라이빗하고 안전한 연결을 설정할 수 있으며, EC2에서 실행 중인 agent의 트래픽이 인터넷을 통과하지 않습니다.

b. 또 다른 대안으로 퍼블릭 [NAT 게이트웨이](https://docs.aws.amazon.com/vpc/latest/userguide/vpc-nat-gateway.html)를 사용하여 프라이빗 서브넷이 인터넷에 연결할 수 있지만, 인터넷으로부터 원치 않는 인바운드 연결을 수신할 수 없도록 할 수 있습니다.

:::note
	이 접근 방식에서는 agent 트래픽이 논리적으로 인터넷을 통해 라우팅됩니다.
:::
c. 기존 TLS 및 [Sigv4](https://docs.aws.amazon.com/general/latest/gr/signature-version-4.html) 메커니즘 이상의 프라이빗 또는 보안 연결 요구 사항이 없는 경우, [Internet Gateway](https://docs.aws.amazon.com/vpc/latest/userguide/VPC_Internet_Gateway.html)를 사용하여 엔드포인트에 연결하는 것이 가장 쉬운 옵션입니다.

### 온프레미스 또는 다른 클라우드 환경에서

a. AWS 외부에서 실행되는 agent는 인터넷(자체 네트워크 설정을 통해) 또는 Direct Connect [Public VIF](https://docs.aws.amazon.com/directconnect/latest/UserGuide/WorkingWithVirtualInterfaces.html)를 통해 CloudWatch 퍼블릭 엔드포인트에 연결할 수 있습니다.

b. agent 트래픽이 인터넷을 통해 라우팅되지 않아야 하는 경우, AWS PrivateLink 기반의 [VPC Interface 엔드포인트](https://docs.aws.amazon.com/vpc/latest/userguide/vpce-interface.html)를 활용하여 Direct Connect Private VIF 또는 VPN을 사용해 온프레미스 네트워크까지 프라이빗 연결을 확장할 수 있습니다. 트래픽이 인터넷에 노출되지 않아 위협 벡터가 제거됩니다.

:::success
	[AWS Systems Manager agent](https://docs.aws.amazon.com/systems-manager/latest/userguide/ssm-agent.html)에서 얻은 자격 증명을 사용하여 CloudWatch agent에 [임시 AWS 액세스 토큰](https://aws.amazon.com/premiumsupport/knowledge-center/cloudwatch-on-premises-temp-credentials/)을 추가할 수 있습니다.
:::

[^1]: CloudWatch agent 사용 및 배포에 대한 가이드는 [Getting started with open source Amazon CloudWatch Agent](https://aws.amazon.com/blogs/opensource/getting-started-with-open-source-amazon-cloudwatch-agent/) 블로그를 참조하세요.


[^2]: [온프레미스 및 다른 클라우드 환경에서 실행되는 agent의 자격 증명 설정 가이드](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/install-CloudWatch-Agent-commandline-fleet.html#install-CloudWatch-Agent-iam_user-first)

[^3]: [CloudWatch 엔드포인트 연결 확인 방법](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/install-CloudWatch-Agent-commandline-fleet.html#install-CloudWatch-Agent-internet-access-first-cmd)

[^4]: [온프레미스 프라이빗 연결 블로그](https://aws.amazon.com/blogs/networking-and-content-delivery/hybrid-networking-using-vpc-endpoints-aws-privatelink-and-amazon-cloudwatch-for-financial-services/)

[^5]: Observability와 관련된 모든 AWS API 사용은 일반적으로 [인스턴스 프로파일](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_use_switch-role-ec2_instance-profiles.html)을 통해 수행됩니다. 이는 AWS에서 실행되는 인스턴스와 컨테이너에 임시 액세스 자격 증명을 부여하는 메커니즘입니다.

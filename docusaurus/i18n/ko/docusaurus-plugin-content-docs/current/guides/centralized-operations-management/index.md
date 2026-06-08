---
sidebar_position: 6
---

# 중앙 집중식 운영 관리

## 중앙 집중식 운영 관리란?

AWS는 AWS, 온프레미스, 하이브리드 환경 및 엣지에서 애플리케이션을 관리하고 운영하는 데 사용할 수 있는 [중앙 집중식 운영 관리](https://aws.amazon.com/cloudops/centralized-operations-management/) 솔루션을 제공합니다. 자동화, 통합, 내장된 모범 사례 및 하이브리드 기능을 통해 중앙 위치에서 애플리케이션을 운영할 수 있습니다. IT 서비스 관리(ITSM) 도구의 효율성과 일관성을 개선하고자 한다면, AWS를 활용하여 기존 통합 및 투자를 자동화하면서 올인원 운영 도구를 사용할 수 있습니다.

고객들은 [AWS Systems Manager](https://aws.amazon.com/systems-manager/)를 사용하여 온프레미스, 하이브리드 및 AWS 환경의 리소스를 대규모로 관리하고 운영합니다. Systems Manager는 노드(예: Amazon EC2 인스턴스, 다른 클라우드의 노드, 온프레미스 노드)에서 보안 관련 업데이트 패칭, SSH 키 관리나 배스천 호스트 유지 없이 노드에 연결, 대규모 운영 명령 자동화 등의 운영 작업을 수행할 수 있도록 합니다. AWS에서 노드는 온프레미스, 하이브리드 및 AWS 환경에서 SSM Agent가 완전히 작동하는 경우 관리 대상으로 간주됩니다.

Systems Manager의 핵심 기능은 사용 사례에 중점을 두고 있으며, 에이전트는 AWS Systems Manager 기능을 활용하기 위한 주요 구성 요소입니다. 노드가 Systems Manager에 의해 관리되면 원격 관리, 패치 관리, 세션 관리와 같은 기능을 활용하면서 운영 작업을 자동화할 수 있습니다.

![AWS Systems Manager](/img/cloudops/guides/centralized-operations-management/BP-SSM-1.png "AWS Systems Manager")

---
sidebar_position: 2
---
# 리소스 구성 추적

AWS Config는 [지원되는 AWS 리소스](https://docs.aws.amazon.com/config/latest/developerguide/resource-config-reference.html)의 구성을 기록하고 추적하여, AWS 계정 내 이러한 리소스의 인벤토리와 현재 및 과거 구성을 생성합니다. 또한 구성 변경의 타임라인을 생성하고 AWS 인프라 전체에서 리소스 속성, 관계, 종속성에 대한 상세 정보를 유지합니다. 사용자는 AWS Management Console 또는 AWS CLI를 통해 프로그래밍 방식으로 [규정 준수 기록 및 타임라인을 확인](https://docs.aws.amazon.com/config/latest/developerguide/view-manage-resource-console.html)할 수 있으며, 특정 시점의 구성 상태를 쿼리할 수 있습니다.


![AWS Config Cost Visualization](/img/cloudops/guides/config/resourcetimeline.png)

### AWS Config 사용자 정의 리소스

 AWS Config를 사용하면 [사용자 정의 Config 리소스](https://docs.aws.amazon.com/config/latest/developerguide/customresources.html)를 통해 지원되는 AWS 리소스를 넘어 구성 추적 기능을 확장할 수 있습니다. 이 기능을 통해 지원되지 않는 AWS 리소스를 모니터링하고 온프레미스 서버, GitHub 리포지토리, 기타 타사 리소스와 같은 외부 리소스를 추적할 수 있습니다. 구성이 완료되면 타사 리소스 구성 데이터를 AWS Config에 게시하고, AWS Config 콘솔과 API를 통해 전체 리소스 인벤토리를 확인하고 모니터링할 수 있습니다. 또한 AWS Config 규칙, 적합성 팩, 모범 사례, 내부 정책, 규정 요구 사항을 사용하여 구성 규정 준수를 평가할 수 있습니다.

AWS Config를 사용하여 비표준 기능을 모니터링하는 방법은 [이 블로그 게시물](https://aws.amazon.com/blogs/mt/using-aws-config-custom-resources-to-track-any-resource-on-aws/)을 참조하세요. [이 블로그 게시물](https://aws.amazon.com/blogs/mt/simplify-compliance-management-of-multicloud-or-hybrid-resources-with-aws-config/)은 다른 클라우드 제공업체에 호스팅된 리소스를 모니터링하는 방법에 대한 단계별 가이드를 제공합니다.

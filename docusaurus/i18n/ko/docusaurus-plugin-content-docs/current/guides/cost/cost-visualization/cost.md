# AWS Observability 서비스와 비용

Observability 스택에 투자할 때, Observability 제품의 **비용**을 정기적으로 모니터링하는 것이 중요합니다. 이를 통해 필요한 비용만 발생시키고 불필요한 리소스에 과다 지출하지 않도록 보장할 수 있습니다.

## AWS 비용 최적화 도구

대부분의 조직은 클라우드에서 IT 인프라를 확장하는 데 핵심적으로 집중하며, 일반적으로 실제 또는 향후 클라우드 지출을 통제하지 못하거나, 준비되지 않았거나, 인식하지 못하는 경우가 많습니다. 시간에 따른 비용을 추적, 보고 및 분석하는 데 도움이 되도록 AWS는 다양한 비용 최적화 도구를 제공합니다:

[AWS Cost Explorer][cost-explorer] – 시간에 따른 AWS 지출 패턴을 확인하고, 향후 비용을 예측하고, 추가 조사가 필요한 영역을 식별하고, Reserved Instance 사용률과 커버리지를 관찰하며, Reserved Instance 권장 사항을 받을 수 있습니다.

[AWS Cost and Usage Report(CUR)][CUR] – DIY(Do-It-Yourself) 분석에 사용되는 계정 전체의 시간별 AWS 사용량을 상세히 설명하는 세분화된 원시 데이터 파일입니다. AWS Cost and Usage Report에는 사용하는 서비스에 따라 채워지는 동적 열이 있습니다.

## 아키텍처 개요: AWS Cost and Usage Report 시각화

Amazon Managed Grafana 또는 Amazon QuickSight에서 AWS 비용 및 사용량 대시보드를 구축할 수 있습니다. 다음 아키텍처 다이어그램은 두 솔루션을 모두 보여줍니다.

![아키텍처 다이어그램](../../../images/cur-architecture.png)
*아키텍처 다이어그램*

## Cloud Intelligence Dashboards

[Cloud Intelligence Dashboards][cid]는 AWS Cost and Usage Report(CUR) 위에 구축된 [Amazon QuickSight][quicksight] 대시보드 모음입니다. 이러한 대시보드는 자체 비용 관리 및 최적화(FinOps) 도구로 작동합니다. AWS 사용량과 비용에 대한 심층적이고 세분화된 권장 사항 기반의 대시보드를 통해 상세한 보기를 제공합니다.

### 구현

1.	[Amazon Athena][amazon-athnea] 통합이 활성화된 [CUR 보고서][cur-report]를 생성합니다.  
*초기 구성 중 AWS가 Amazon S3 버킷에 보고서를 전달하기 시작하는 데 최대 24시간이 걸릴 수 있습니다. 보고서는 하루에 한 번 전달됩니다. Athena와의 통합을 간소화하고 자동화하기 위해 AWS는 Athena 통합을 위해 설정한 보고서와 함께 여러 주요 리소스가 포함된 AWS CloudFormation 템플릿을 제공합니다.*

2.	[AWS CloudFormation 템플릿][cloudformation]을 배포합니다.  
*이 템플릿에는 AWS Glue 크롤러, AWS Glue 데이터베이스 및 AWS Lambda 이벤트가 포함됩니다. 이 시점에서 CUR 데이터는 쿼리할 수 있도록 Amazon Athena의 테이블을 통해 사용 가능합니다.*  

    - CUR 데이터에 대해 직접 [Amazon Athena][athena-query] 쿼리를 실행합니다.  
*Athena 쿼리를 실행하려면 먼저 Athena 콘솔을 사용하여 AWS가 데이터를 새로 고치고 있는지 확인한 다음 Athena 콘솔에서 쿼리를 실행합니다.*

3.	Cloud Intelligence 대시보드를 배포합니다.
    - 수동 배포의 경우 AWS Well-Architected **[Cost Optimization lab][cost-optimization-lab]**을 참조하세요. 
    - 자동화된 배포의 경우 [GitHub 리포지토리][GitHub-repo]를 참조하세요.

Cloud Intelligence 대시보드는 재무 팀, 경영진, IT 관리자에게 적합합니다. 그러나 고객에게서 자주 받는 질문 중 하나는 Amazon CloudWatch, AWS X-Ray, Amazon Managed Service for Prometheus, Amazon Managed Grafana와 같은 개별 AWS Observability 제품의 조직 전체 비용에 대한 인사이트를 얻는 방법입니다.

다음 섹션에서는 각 제품의 비용과 사용량에 대해 깊이 살펴봅니다. 모든 규모의 기업이 이러한 사전 예방적 클라우드 비용 최적화 전략을 채택하고, 성능 영향이나 운영 오버헤드 없이 클라우드 비용 분석 및 데이터 기반 의사 결정을 통해 비즈니스 효율성을 개선할 수 있습니다.


[cost-explorer]: https://docs.aws.amazon.com/awsaccountbilling/latest/aboutv2/ce-what-is.html
[CUR]: https://docs.aws.amazon.com/cur/latest/userguide/what-is-cur.html
[cid]: https://wellarchitectedlabs.com/cost/200_labs/200_cloud_intelligence/
[quicksight]: https://aws.amazon.com/quicksight/
[cur-report]: https://docs.aws.amazon.com/cur/latest/userguide/cur-create.html
[amazon-athnea]: https://aws.amazon.com/athena/
[cloudformation]: https://docs.aws.amazon.com/cur/latest/userguide/use-athena-cf.html
[athena-query]: https://docs.aws.amazon.com/cur/latest/userguide/cur-ate-run.html
[cost-optimization-lab]: https://www.wellarchitectedlabs.com/cost/200_labs/200_cloud_intelligence/
[GitHub-repo]: https://github.com/aws-samples/aws-cudos-framework-deployment

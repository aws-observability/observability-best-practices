# Amazon Managed Grafana

Amazon Managed Grafana 비용 및 사용량 시각화를 통해 개별 AWS 계정, AWS 리전, 특정 Grafana Workspace 인스턴스 및 Admin, Editor, Viewer 사용자의 라이선싱 비용에 대한 인사이트를 얻을 수 있습니다!  

비용 및 사용량 데이터를 시각화하고 분석하려면 사용자 지정 Athena 뷰를 생성해야 합니다.

1.	진행하기 전에 [구현 개요][cid-implement]에 언급된 CUR(1단계) 생성과 AWS CloudFormation 템플릿 배포(2단계)를 완료했는지 확인하세요.

2.	다음 쿼리를 사용하여 새 Amazon Athena [뷰][view]를 생성합니다. 이 쿼리는 Organization의 모든 AWS 계정에 걸친 Amazon Managed Grafana의 비용과 사용량을 가져옵니다.

        CREATE OR REPLACE VIEW "grafana_cost" AS 
        SELECT
        line_item_usage_type
        , line_item_resource_id
        , line_item_operation
        , line_item_usage_account_id
        , month
        , year
        , "sum"(line_item_usage_amount) "Usage"
        , "sum"(line_item_unblended_cost) cost
        FROM
        database.tablename #replace database.tablename with your database and table name
        WHERE ("line_item_product_code" = 'AmazonGrafana')
        GROUP BY 1, 2, 3, 4, 5, 6

Athena를 데이터 소스로 사용하여 비즈니스 요구사항에 맞게 Amazon Managed Grafana 또는 Amazon QuickSight에서 대시보드를 구축할 수 있습니다. 또한 생성한 Athena 뷰에 대해 직접 [SQL 쿼리][sql-query]를 실행할 수도 있습니다.


[view]: https://athena-in-action.workshop.aws/30-basics/303-create-view.html
[sql-query]: https://docs.aws.amazon.com/athena/latest/ug/querying-athena-tables.html
[cid-implement]: ../../../guides/cost/cost-visualization/cost.md#implementation

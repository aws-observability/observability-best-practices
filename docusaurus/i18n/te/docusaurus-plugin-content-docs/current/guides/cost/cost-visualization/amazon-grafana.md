# Amazon Managed Grafana

Amazon Managed Grafana cost and usage visuals వ్యక్తిగత AWS Accounts, AWS Regions, నిర్దిష్ట Grafana Workspace instances మరియు Admin, Editor మరియు Viewer users యొక్క licensing cost యొక్క cost లో insights పొందడానికి అనుమతిస్తుంది!

Cost and usage data visualize చేసి analyze చేయడానికి, custom Athena view create చేయాలి.

1.	ముందుగా, [Implementation overview][cid-implement] లో mention చేయబడిన CUR (step #1) create చేసి AWS CloudFormation Template (step #2) deploy చేశారని ensure చేయండి.

2.	ఇప్పుడు, క్రింది query ఉపయోగించి new Amazon Athena [view][view] create చేయండి. ఈ query మీ Organization లోని అన్ని AWS Accounts లో Amazon Managed Grafana cost and usage fetch చేస్తుంది.

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

Athena ను data source గా ఉపయోగించి, మీ business requirements కు suit అయ్యేలా Amazon Managed Grafana లేదా Amazon QuickSight లో dashboards build చేయవచ్చు. అలాగే, మీరు create చేసిన Athena view పై directly [SQL queries][sql-query] run చేయవచ్చు.


[view]: https://athena-in-action.workshop.aws/30-basics/303-create-view.html
[sql-query]: https://docs.aws.amazon.com/athena/latest/ug/querying-athena-tables.html
[cid-implement]: ../../../guides/cost/cost-visualization/cost.md#implementation

# Amazon Managed Service for Prometheus

Amazon Managed Service for Prometheus cost and usage visuals వ్యక్తిగత AWS Accounts, AWS Regions, నిర్దిష్ట Prometheus Workspace instances మరియు RemoteWrite, Query మరియు HourlyStorageMetering వంటి Operations యొక్క cost లో insights పొందడానికి అనుమతిస్తుంది!

Cost and usage data visualize చేసి analyze చేయడానికి, custom Athena view create చేయాలి.

1.	ముందుగా, [Implementation overview][cid-implement] లో mention చేయబడిన CUR (step #1) create చేసి AWS CloudFormation Template (step #2) deploy చేశారని ensure చేయండి.

2.	ఇప్పుడు, క్రింది query ఉపయోగించి new Amazon Athena [view][view] create చేయండి. ఈ query మీ Organization లోని అన్ని AWS Accounts లో Amazon Managed Service for Prometheus cost and usage fetch చేస్తుంది.

        CREATE OR REPLACE VIEW "prometheus_cost" AS 
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
        WHERE ("line_item_product_code" = 'AmazonPrometheus')
        GROUP BY 1, 2, 3, 4, 5, 6

## Amazon Managed Grafana dashboard create చేయడం

Amazon Managed Grafana తో, Grafana workspace console లో AWS data source configuration option ఉపయోగించి Athena ను data source గా add చేయవచ్చు. ఈ feature మీ existing Athena accounts discover చేయడం ద్వారా మరియు Athena access చేయడానికి అవసరమైన authentication credentials configuration manage చేయడం ద్వారా Athena ను data source గా add చేయడం simplify చేస్తుంది. Athena data source ఉపయోగించడానికి associated prerequisites కోసం, [Prerequisites][Prerequisites] చూడండి.


క్రింది **Grafana dashboard** మీ AWS Organizations లోని అన్ని AWS Accounts లో Amazon Managed Service for Prometheus cost and usage, వ్యక్తిగత Prometheus Workspace instances cost మరియు RemoteWrite, Query మరియు HourlyStorageMetering వంటి Operations చూపిస్తుంది!

![prometheus-cost](../../../images/prometheus-cost.png)

Grafana లో dashboard JSON object ద్వారా represent చేయబడుతుంది, ఇది dashboard metadata store చేస్తుంది. Dashboard metadata dashboard properties, panels నుండి metadata, template variables, panel queries మొదలైనవి include చేస్తుంది. పై dashboard యొక్క JSON template ను [ఇక్కడ](AmazonPrometheus.json) access చేయండి.

Preceding dashboard తో, ఇప్పుడు మీ Organization లోని AWS accounts లో Amazon Managed Service for Prometheus cost and usage identify చేయవచ్చు. మీ requirements కు suit అయ్యేలా visuals build చేయడానికి ఇతర Grafana [dashboard panels][panels] ఉపయోగించవచ్చు.

[Prerequisites]: https://docs.aws.amazon.com/grafana/latest/userguide/Athena-prereq.html
[view]: https://athena-in-action.workshop.aws/30-basics/303-create-view.html
[panels]: https://docs.aws.amazon.com/grafana/latest/userguide/Grafana-panels.html
[cid-implement]: ../../../guides/cost/cost-visualization/cost.md#implementation

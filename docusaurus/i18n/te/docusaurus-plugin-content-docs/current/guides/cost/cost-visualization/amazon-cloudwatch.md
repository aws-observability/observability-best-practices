# Amazon CloudWatch

Amazon CloudWatch cost and usage visuals వ్యక్తిగత AWS Accounts, AWS Regions మరియు GetMetricData, PutLogEvents, GetMetricStream, ListMetrics, MetricStorage, HourlyStorageMetering మరియు ListMetrics వంటి అన్ని CloudWatch operations యొక్క cost లో insights పొందడానికి అనుమతిస్తుంది!
  
CloudWatch cost and usage data visualize చేసి analyze చేయడానికి, custom Athena view create చేయాలి. Amazon Athena [view][view] అనేది logical table, ఇది data querying simplify చేయడానికి original CUR table నుండి columns subset create చేస్తుంది.

1.	ముందుగా, [Implementation overview][cid-implement] లో mention చేయబడిన CUR (step #1) create చేసి AWS CloudFormation Template (step #2) deploy చేశారని ensure చేయండి.

2.	ఇప్పుడు, క్రింది query ఉపయోగించి new Amazon Athena [view][view] create చేయండి. ఈ query మీ Organization లోని అన్ని AWS Accounts లో Amazon CloudWatch cost and usage fetch చేస్తుంది.

        CREATE OR REPLACE VIEW "cloudwatch_cost" AS 
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
        WHERE ("line_item_product_code" = 'AmazonCloudWatch')
        GROUP BY 1, 2, 3, 4, 5, 6


### Amazon QuickSight dashboard create చేయడం

ఇప్పుడు, Amazon CloudWatch cost and usage visualize చేయడానికి QuickSight dashboard create చేద్దాం.

1.	AWS Management Console లో, QuickSight service కు navigate చేసి top right corner నుండి మీ AWS Region select చేయండి. QuickSight Dataset Amazon Athena table అదే AWS Region లో ఉండాలని గమనించండి.
2.	QuickSight Amazon S3 మరియు AWS Athena [access][access] చేయగలదని ensure చేయండి.
3.	మీరు ముందు create చేసిన Amazon Athena view ను data-source గా select చేసి [QuickSight Dataset create చేయండి][create-dataset]. Daily basis లో Dataset [refresh schedule చేయడానికి][schedule-refresh] ఈ procedure ఉపయోగించండి.
4.	QuickSight [Analysis][analysis] create చేయండి.
5.	మీ needs కు meet అయ్యే QuickSight [Visuals][visuals] create చేయండి.
6.	మీ needs కు meet అయ్యేలా Visual ను [Format][format] చేయండి.
7.	ఇప్పుడు, Analysis నుండి మీ dashboard [publish][publish] చేయవచ్చు.
8.	Dashboard ను [report][report] format లో individuals లేదా groups కు, once లేదా schedule పై send చేయవచ్చు.

క్రింది **QuickSight dashboard** మీ AWS Organizations లోని అన్ని AWS Accounts లో Amazon CloudWatch cost and usage, GetMetricData, PutLogEvents, GetMetricStream, ListMetrics, MetricStorage, HourlyStorageMetering మరియు ListMetrics వంటి CloudWatch operations తో సహా చూపిస్తుంది.

![cloudwatch-cost1](../../../images/cloudwatch-cost-1.PNG)
![cloudwatch-cost2](../../../images/cloudwatch-cost-2.PNG)

Preceding dashboard తో, ఇప్పుడు మీ Organization లోని AWS accounts లో Amazon CloudWatch cost identify చేయవచ్చు. మీ requirements కు suit అయ్యేలా different dashboards build చేయడానికి ఇతర QuickSight [visual types][types] ఉపయోగించవచ్చు.


[view]: https://athena-in-action.workshop.aws/30-basics/303-create-view.html
[access]: https://docs.aws.amazon.com/quicksight/latest/user/accessing-data-sources.html
[create-dataset]: https://docs.aws.amazon.com/quicksight/latest/user/create-a-data-set-athena.html
[schedule-refresh]: https://docs.aws.amazon.com/quicksight/latest/user/refreshing-imported-data.html
[analysis]: https://docs.aws.amazon.com/quicksight/latest/user/creating-an-analysis.html
[visuals]: https://docs.aws.amazon.com/quicksight/latest/user/creating-a-visual.html
[format]: https://docs.aws.amazon.com/quicksight/latest/user/formatting-a-visual.html
[publish]: https://docs.aws.amazon.com/quicksight/latest/user/creating-a-dashboard.html
[report]: https://docs.aws.amazon.com/quicksight/latest/user/sending-reports.html
[types]: https://docs.aws.amazon.com/quicksight/latest/user/working-with-visual-types.html
[cid-implement]: ../../../guides/cost/cost-visualization/cost.md#implementation

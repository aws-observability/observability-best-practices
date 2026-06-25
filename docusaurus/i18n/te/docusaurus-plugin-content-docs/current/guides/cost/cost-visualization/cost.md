# AWS Observability సేవలు మరియు ఖర్చు

మీ Observability stack లో invest చేస్తున్నప్పుడు, మీ observability products యొక్క **cost** ను regular basis లో monitor చేయడం ముఖ్యం. ఇది మీకు అవసరమైన costs మాత్రమే incur అవుతున్నాయని మరియు అవసరం లేని resources పై overspend చేయడం లేదని ensure చేయడానికి allow చేస్తుంది.

## Cost Optimization కోసం AWS Tools

చాలా organizations core focus cloud పై IT infrastructure scale చేయడంపై ఉంటుంది, మరియు సాధారణంగా వారి actual లేదా forthcoming cloud spend గురించి uncontrolled, unprepared మరియు unaware గా ఉంటారు. Costs ను time లో track, report మరియు analyze చేయడానికి సహాయం చేయడానికి, AWS అనేక cost-optimization tools provide చేస్తుంది:

[AWS Cost Explorer][cost-explorer] – AWS spending లో patterns చూడవచ్చు, future costs project చేయవచ్చు, further inquiry అవసరమైన areas identify చేయవచ్చు, Reserved Instance utilization observe చేయవచ్చు, Reserved Instance coverage observe చేయవచ్చు, మరియు Reserved Instance recommendations receive చేయవచ్చు.

[AWS Cost and Usage Report(CUR)][CUR] – Accounts అంతటా మీ hourly AWS usage detail చేసే Granular raw data files, Do-It-Yourself (DIY) analysis కోసం ఉపయోగించబడతాయి. AWS Cost and Usage Report మీరు ఉపయోగించే services ఆధారంగా populate అయ్యే dynamic columns కలిగి ఉంటుంది.

## ఆర్కిటెక్చర్ అవలోకనం: AWS Cost and Usage Report Visualize చేయడం

Amazon Managed Grafana లేదా Amazon QuickSight లో AWS cost and usage dashboards build చేయవచ్చు. క్రింది architecture diagram రెండు solutions ను illustrate చేస్తుంది.

![Architecture diagram](../../../images/cur-architecture.png)
*ఆర్కిటెక్చర్ diagram*

## Cloud Intelligence Dashboards

[Cloud Intelligence Dashboards][cid] AWS Cost and Usage report (CUR) పై built అయిన [Amazon QuickSight][quicksight] dashboards collection. ఈ dashboards మీ own cost management and optimization (FinOps) tool గా work చేస్తాయి. మీ AWS usage మరియు costs యొక్క detailed view పొందడంలో సహాయపడే in-depth, granular మరియు recommendation-driven dashboards పొందుతారు.

### Implementation

1.	[Amazon Athena][amazon-athnea] integration enabled తో [CUR report][cur-report] create చేయండి.
*Initial configuration సమయంలో, AWS మీ Amazon S3 bucket కు reports deliver చేయడం start చేయడానికి 24 hours వరకు పట్టవచ్చు. Reports రోజుకు ఒకసారి deliver చేయబడతాయి. Athena తో మీ Cost and Usage Reports integration streamline మరియు automate చేయడానికి, AWS Athena integration కోసం set up చేసిన reports తో పాటు అనేక key resources తో AWS CloudFormation template provide చేస్తుంది.*

2.	[AWS CloudFormation template][cloudformation] deploy చేయండి.
*ఈ template AWS Glue crawler, AWS Glue database మరియు AWS Lambda event include చేస్తుంది. ఈ point లో, CUR data మీరు query చేయడానికి Amazon Athena లో tables ద్వారా available చేయబడుతుంది.*

    - మీ CUR data పై directly [Amazon Athena][athena-query] queries run చేయండి.
*మీ data పై Athena queries run చేయడానికి, మొదట AWS మీ data refresh చేస్తుందా అని check చేయడానికి Athena console ఉపయోగించి, తర్వాత Athena console పై మీ query run చేయండి.*

3.	Cloud Intelligence dashboards deploy చేయండి.
    - Manual deployment కోసం, AWS Well-Architected **[Cost Optimization lab][cost-optimization-lab]** refer చేయండి.
    - Automated deployment కోసం, [GitHub repo][GitHub-repo] refer చేయండి.

Cloud Intelligence dashboards Finance teams, Executives మరియు IT managers కోసం great. అయితే, కస్టమర్ల నుండి మనకు వచ్చే ఒక common question Amazon CloudWatch, AWS X-Ray, Amazon Managed Service for Prometheus మరియు Amazon Managed Grafana వంటి individual AWS Observability products యొక్క organization wide cost లో insights ఎలా పొందాలి.

తదుపరి section లో, ఆ ప్రతి product యొక్క cost and usage లో deep-dive చేస్తారు. ఏ size company అయినా cloud cost optimization strategy కు ఈ proactive approach adopt చేసి, ఎటువంటి performance impact లేదా operational overhead లేకుండా cloud cost analytics మరియు data-driven decisions ద్వారా business efficiency improve చేయవచ్చు.


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

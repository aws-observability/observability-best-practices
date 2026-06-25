# Container Insights తో system metrics సేకరించడం
System metrics అనేవి CPU, memory, disks మరియు network interfaces వంటి server లోని physical components ను కలిగి ఉన్న low-level resources కు సంబంధించినవి.
Amazon ECS కు deploy చేయబడిన containerized applications నుండి system metrics ను collect, aggregate మరియు summarize చేయడానికి [CloudWatch Container Insights](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/ContainerInsights.html) ను ఉపయోగించండి. Container Insights container restart failures వంటి diagnostic information ను కూడా అందిస్తుంది, సమస్యలను వేగంగా isolate చేసి resolve చేయడంలో సహాయపడుతుంది. ఇది EC2 మరియు Fargate పై deploy చేయబడిన Amazon ECS clusters కోసం అందుబాటులో ఉంటుంది.

Container Insights [embedded metric format](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch_Embedded_Metric_Format.html) ను ఉపయోగించి performance log events గా data ను collect చేస్తుంది. ఈ performance log events structured JSON schema ను ఉపయోగించే entries, ఇవి high-cardinality data ను scale గా ingest మరియు store చేయడానికి అనుమతిస్తాయి. ఈ data నుండి, CloudWatch cluster, node, service మరియు task level వద్ద CloudWatch metrics గా aggregated metrics ను create చేస్తుంది.

:::note
	Container Insights metrics CloudWatch లో కనిపించడానికి, మీరు మీ Amazon ECS clusters పై Container Insights ను enable చేయాలి. ఇది account level వద్ద లేదా individual cluster level వద్ద చేయవచ్చు. Account level వద్ద enable చేయడానికి, కింది AWS CLI command ను ఉపయోగించండి:

    ```
    aws ecs put-account-setting --name "containerInsights" --value "enabled
    ```

    Individual cluster level వద్ద enable చేయడానికి, కింది AWS CLI command ను ఉపయోగించండి:

    ```
    aws ecs update-cluster-settings --cluster $CLUSTER_NAME --settings name=containerInsights,value=enabled
    ```
:::

## Cluster-level మరియు service-level metrics సేకరించడం
Default గా, CloudWatch Container Insights task, service మరియు cluster level వద్ద metrics ను collect చేస్తుంది. Amazon ECS agent ఈ metrics ను EC2 container instance (ECS on EC2 మరియు ECS on Fargate రెండింటికీ) పై ప్రతి task కోసం collect చేసి CloudWatch కు performance log events గా పంపుతుంది. Cluster కు ఏ agents ను deploy చేయాల్సిన అవసరం లేదు. ఈ log events నుండి metrics extract చేయబడేవి */aws/ecs/containerinsights/$CLUSTER_NAME/performance* అనే CloudWatch log group కింద collect చేయబడతాయి. ఈ events నుండి extract చేయబడిన metrics యొక్క complete list [ఇక్కడ documented చేయబడింది](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Container-Insights-metrics-ECS.html). Container Insights collect చేసే metrics CloudWatch console లో navigation page నుండి *Container Insights* ను select చేసి, dropdown list నుండి *performance monitoring* ను select చేయడం ద్వారా అందుబాటులో ఉన్న pre-built dashboards లో సులభంగా చూడవచ్చు. అవి CloudWatch console యొక్క *Metrics* section లో కూడా చూడవచ్చు.

![Container Insights metrics dashboard](../../../../images/ContainerInsightsMetrics.png)

:::note
    మీరు Amazon EC2 instance పై Amazon ECS ను ఉపయోగిస్తున్నట్లయితే, మరియు Container Insights నుండి network మరియు storage metrics ను collect చేయాలనుకుంటే, Amazon ECS agent version 1.29 ను include చేసే AMI ని ఉపయోగించి ఆ instance ను launch చేయండి.
:::

:::warning
    Container Insights ద్వారా collect చేయబడిన metrics custom metrics గా charge చేయబడతాయి. CloudWatch pricing గురించి మరింత సమాచారం కోసం, [Amazon CloudWatch Pricing](https://aws.amazon.com/cloudwatch/pricing/) చూడండి.
:::

## Instance-level metrics సేకరించడం
EC2 పై host చేయబడిన Amazon ECS cluster కు CloudWatch agent ను deploy చేయడం వల్ల, cluster నుండి instance-level metrics ను collect చేయవచ్చు. Agent daemon service గా deploy చేయబడుతుంది మరియు cluster లోని ప్రతి EC2 container instance నుండి instance-level metrics ను performance log events గా పంపుతుంది. ఈ events నుండి extract చేయబడిన instance-level metrics యొక్క complete list [ఇక్కడ documented చేయబడింది](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Container-Insights-metrics-ECS.html)

:::info
    Instance-level metrics ను collect చేయడానికి Amazon ECS cluster కు CloudWatch agent ను deploy చేసే steps [Amazon CloudWatch User Guide](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/deploy-container-insights-ECS-instancelevel.html) లో documented చేయబడ్డాయి. ఈ option Fargate పై host చేయబడిన Amazon ECS clusters కోసం అందుబాటులో లేదని గమనించండి.
:::
    
## Logs Insights తో performance log events ను analyze చేయడం
Container Insights embedded metric format తో performance log events ను ఉపయోగించి metrics ను collect చేస్తుంది. ప్రతి log event CPU మరియు memory వంటి system resources లేదా tasks మరియు services వంటి ECS resources పై observed performance data ను contain చేయవచ్చు. Container Insights Amazon ECS నుండి cluster, service, task మరియు container level వద్ద collect చేసే performance log events యొక్క ఉదాహరణలు [ఇక్కడ listed చేయబడ్డాయి](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Container-Insights-reference-performance-logs-ECS.html). CloudWatch ఈ log events లోని కొన్ని performance data ఆధారంగా మాత్రమే metrics ను generate చేస్తుంది. కానీ CloudWatch Logs Insights queries ను ఉపయోగించి performance data యొక్క deeper analysis చేయడానికి మీరు ఈ log events ను ఉపయోగించవచ్చు.

Logs Insights queries ను run చేయడానికి user interface CloudWatch console లో navigation page నుండి *Logs Insights* ను select చేయడం ద్వారా అందుబాటులో ఉంటుంది. మీరు log group ను select చేసినప్పుడు, CloudWatch Logs Insights log group లోని performance log events లో fields ను automatically detect చేసి right pane లో *Discovered* fields లో display చేస్తుంది. Query execution యొక్క results log group లో log events యొక్క bar graph గా display చేయబడతాయి. ఈ bar graph మీ query మరియు time range కు match అయ్యే log group లోని events distribution ను చూపుతుంది.

![Logs Insights dashboard](../../../../images/LogInsights.png)

:::info
    CPU మరియు memory usage కోసం container-level metrics ను display చేయడానికి ఒక sample Logs Insights query ఇక్కడ ఉంది.
    
    ```
    stats avg(CpuUtilized) as CPU, avg(MemoryUtilized) as Mem by TaskId, ContainerName | sort Mem, CPU desc
    ```
:::

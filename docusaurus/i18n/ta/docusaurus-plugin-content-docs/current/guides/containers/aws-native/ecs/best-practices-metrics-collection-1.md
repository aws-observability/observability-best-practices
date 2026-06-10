# Container Insights பயன்படுத்தி system மெட்ரிக்குகளை சேகரித்தல்
System மெட்ரிக்குகள் CPU, memory, disks மற்றும் network interfaces போன்ற server-இல் உள்ள physical components-ஐ உள்ளடக்கிய low-level resources-க்கு தொடர்புடையவை.
Amazon ECS-இல் deploy செய்யப்பட்ட containerized applications-இலிருந்து system மெட்ரிக்குகளை சேகரிக்க, aggregate செய்ய மற்றும் summarize செய்ய [CloudWatch Container Insights](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/ContainerInsights.html)-ஐ பயன்படுத்தவும். Container Insights container restart failures போன்ற diagnostic தகவல்களையும் வழங்குகிறது, சிக்கல்களை விரைவாக தனிமைப்படுத்தி தீர்க்க உதவுகிறது. EC2 மற்றும் Fargate-இல் deploy செய்யப்பட்ட Amazon ECS கிளஸ்டர்களுக்கு இது கிடைக்கிறது.

Container Insights [embedded metric format](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch_Embedded_Metric_Format.html) பயன்படுத்தி performance log events ஆக தரவை சேகரிக்கிறது. இந்த performance log events structured JSON schema பயன்படுத்தும் entries ஆகும், high-cardinality data-ஐ பெரிய அளவில் ingest மற்றும் store செய்ய உதவுகின்றன. இந்த தரவிலிருந்து, CloudWatch cluster, node, service மற்றும் task level-இல் aggregated metrics-ஐ CloudWatch metrics ஆக உருவாக்குகிறது.

:::note
	Container Insights மெட்ரிக்குகள் CloudWatch-இல் தோன்ற, உங்கள் Amazon ECS கிளஸ்டர்களில் Container Insights-ஐ enable செய்ய வேண்டும். இது account level அல்லது individual cluster level-இல் செய்யலாம். Account level-இல் enable செய்ய, பின்வரும் AWS CLI command பயன்படுத்தவும்:

    ```
    aws ecs put-account-setting --name "containerInsights" --value "enabled
    ```

    Individual cluster level-இல் enable செய்ய, பின்வரும் AWS CLI command பயன்படுத்தவும்:

    ```
    aws ecs update-cluster-settings --cluster $CLUSTER_NAME --settings name=containerInsights,value=enabled
    ```
:::

## Cluster-level மற்றும் service-level மெட்ரிக்குகளை சேகரித்தல்
இயல்பாக, CloudWatch Container Insights task, service மற்றும் cluster level-இல் மெட்ரிக்குகளை சேகரிக்கிறது. Amazon ECS agent EC2 container instance-இல் ஒவ்வொரு task-க்கும் (ECS on EC2 மற்றும் ECS on Fargate இரண்டிற்கும்) இந்த மெட்ரிக்குகளை சேகரித்து CloudWatch-க்கு performance log events ஆக அனுப்புகிறது. கிளஸ்டரில் எந்த agents-ஐயும் deploy செய்ய தேவையில்லை. மெட்ரிக்குகள் extract செய்யப்படும் இந்த log events */aws/ecs/containerinsights/$CLUSTER_NAME/performance* என்ற CloudWatch log group-இல் சேகரிக்கப்படுகின்றன. இந்த events-இலிருந்து extract செய்யப்படும் மெட்ரிக்குகளின் முழுமையான பட்டியல் [இங்கே ஆவணப்படுத்தப்பட்டுள்ளது](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Container-Insights-metrics-ECS.html). Container Insights சேகரிக்கும் மெட்ரிக்குகள் CloudWatch console-இல் navigation page-இலிருந்து *Container Insights* தேர்வு செய்து dropdown list-இலிருந்து *performance monitoring* தேர்வு செய்வதன் மூலம் pre-built dashboards-இல் எளிதாக பார்க்கலாம். CloudWatch console-இன் *Metrics* பகுதியிலும் பார்க்கலாம்.

![Container Insights metrics dashboard](../../../../images/ContainerInsightsMetrics.png)

:::note
    Amazon EC2 instance-இல் Amazon ECS பயன்படுத்துகிறீர்கள் என்றால், Container Insights-இலிருந்து network மற்றும் storage மெட்ரிக்குகளை சேகரிக்க, Amazon ECS agent version 1.29 உள்ள AMI பயன்படுத்தி அந்த instance-ஐ launch செய்யவும்.
:::

:::warning
    Container Insights சேகரிக்கும் மெட்ரிக்குகள் custom metrics ஆக கட்டணம் வசூலிக்கப்படும். CloudWatch pricing பற்றிய மேலும் தகவலுக்கு, [Amazon CloudWatch Pricing](https://aws.amazon.com/cloudwatch/pricing/) பார்க்கவும்.
:::

## Instance-level மெட்ரிக்குகளை சேகரித்தல்
EC2-இல் host செய்யப்பட்ட Amazon ECS கிளஸ்டரில் CloudWatch agent-ஐ deploy செய்வது, கிளஸ்டரிலிருந்து instance-level மெட்ரிக்குகளை சேகரிக்க உதவுகிறது. Agent daemon service ஆக deploy செய்யப்பட்டு கிளஸ்டரில் ஒவ்வொரு EC2 container instance-இலிருந்தும் instance-level மெட்ரிக்குகளை performance log events ஆக அனுப்புகிறது. இந்த events-இலிருந்து extract செய்யப்படும் instance-level மெட்ரிக்குகளின் முழுமையான பட்டியல் [இங்கே ஆவணப்படுத்தப்பட்டுள்ளது](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Container-Insights-metrics-ECS.html)

:::info
    Instance-level மெட்ரிக்குகளை சேகரிக்க Amazon ECS கிளஸ்டரில் CloudWatch agent-ஐ deploy செய்யும் படிகள் [Amazon CloudWatch User Guide](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/deploy-container-insights-ECS-instancelevel.html)-இல் ஆவணப்படுத்தப்பட்டுள்ளன. இந்த option Fargate-இல் host செய்யப்பட்ட Amazon ECS கிளஸ்டர்களுக்கு கிடைக்காது.
:::
    
## Logs Insights பயன்படுத்தி performance log events-ஐ பகுப்பாய்வு செய்தல்
Container Insights embedded metric format-உடன் performance log events பயன்படுத்தி மெட்ரிக்குகளை சேகரிக்கிறது. ஒவ்வொரு log event-இலும் CPU மற்றும் memory போன்ற system resources அல்லது tasks மற்றும் services போன்ற ECS resources-இல் observed performance data இருக்கலாம். Container Insights Amazon ECS-இலிருந்து cluster, service, task மற்றும் container level-இல் சேகரிக்கும் performance log events-இன் எடுத்துக்காட்டுகள் [இங்கே பட்டியலிடப்பட்டுள்ளன](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Container-Insights-reference-performance-logs-ECS.html). CloudWatch இந்த log events-இல் உள்ள சில performance data அடிப்படையில் மட்டுமே மெட்ரிக்குகளை உருவாக்குகிறது. ஆனால் CloudWatch Logs Insights queries பயன்படுத்தி இந்த log events-உடன் performance data-இன் ஆழமான பகுப்பாய்வு செய்யலாம்.

Logs Insights queries இயக்க user interface CloudWatch console-இல் navigation page-இலிருந்து *Logs Insights* தேர்வு செய்வதன் மூலம் கிடைக்கிறது. Log group தேர்வு செய்யும்போது, CloudWatch Logs Insights log group-இல் உள்ள performance log events-இல் fields-ஐ தானாக detect செய்து வலது pane-இல் *Discovered* fields-இல் காட்டுகிறது. Query execution-இன் முடிவுகள் இந்த log group-இல் log events-இன் bar graph ஆக காட்டப்படுகின்றன. இந்த bar graph உங்கள் query மற்றும் time range-உடன் பொருந்தும் log group-இல் உள்ள events-இன் distribution-ஐ காட்டுகிறது.

![Logs Insights dashboard](../../../../images/LogInsights.png)

:::info
    Container-level CPU மற்றும் memory usage மெட்ரிக்குகளை display செய்ய ஒரு sample Logs Insights query இங்கே உள்ளது.
    
    ```
    stats avg(CpuUtilized) as CPU, avg(MemoryUtilized) as Mem by TaskId, ContainerName | sort Mem, CPU desc
    ```
:::

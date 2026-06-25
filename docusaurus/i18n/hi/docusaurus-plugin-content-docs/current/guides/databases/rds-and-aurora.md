# Amazon RDS और Aurora डेटाबेस की निगरानी

Amazon RDS और Aurora डेटाबेस clusters की reliability, availability, और performance बनाए रखने में monitoring एक महत्वपूर्ण हिस्सा है। AWS आपके Amazon RDS और Aurora databases resources की health की निगरानी, समस्याओं का गंभीर होने से पहले पता लगाने और consistent user experience के लिए performance optimize करने हेतु कई tools प्रदान करता है। यह गाइड आपके databases के सुचारू संचालन को सुनिश्चित करने के लिए ऑब्ज़र्वेबिलिटी बेस्ट प्रैक्टिसेज़ प्रदान करती है। 

## Performance दिशानिर्देश

एक बेस्ट प्रैक्टिस के रूप में, आप अपने workloads के लिए baseline performance स्थापित करना शुरू करना चाहते हैं। जब आप एक DB instance set up करते हैं और इसे एक typical workload के साथ चलाते हैं, तो सभी performance metrics के average, maximum, और minimum values capture करें। विभिन्न intervals (उदाहरण के लिए, एक घंटा, 24 घंटे, एक सप्ताह, दो सप्ताह) पर ऐसा करें। इससे आपको यह पता चल सकता है कि सामान्य क्या है। यह operation के peak और off-peak दोनों घंटों के लिए comparisons प्राप्त करने में मदद करता है। फिर आप इस जानकारी का उपयोग यह पहचानने के लिए कर सकते हैं कि performance मानक स्तर से नीचे कब गिर रहा है।
 
## Monitoring विकल्प

### Amazon CloudWatch metrics

[Amazon CloudWatch](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/monitoring-cloudwatch.html) आपके [RDS](https://aws.amazon.com/rds/) और [Aurora](https://aws.amazon.com/rds/aurora/) databases की monitoring और management के लिए एक महत्वपूर्ण tool है। यह database performance में मूल्यवान insights प्रदान करता है और issues को जल्दी पहचानने और हल करने में मदद करता है। Amazon RDS और Aurora database दोनों प्रत्येक active database instance के लिए 1 minute granularity पर CloudWatch को metrics भेजते हैं। Monitoring डिफ़ॉल्ट रूप से सक्षम है और metrics 15 दिनों के लिए उपलब्ध हैं। RDS और Aurora **AWS/RDS** namespace में Amazon CloudWatch को instance-level metrics publish करते हैं।

CloudWatch Metrics का उपयोग करके, आप अपने database performance में trends या patterns की पहचान कर सकते हैं, और इस जानकारी का उपयोग अपने configurations को optimize करने और अपने application की performance सुधारने के लिए कर सकते हैं। यहां monitor करने के लिए प्रमुख metrics हैं:

* **CPU Utilization** - उपयोग की गई computer processing capacity का प्रतिशत।
* **DB Connections** - DB instance से connected client sessions की संख्या। यदि आप instance performance और response time में कमी के साथ user connections की उच्च संख्या देखते हैं तो database connections को constrain करने पर विचार करें। आपके DB instance के लिए user connections की सर्वोत्तम संख्या आपकी instance class और की जाने वाली operations की complexity के आधार पर भिन्न होगी।
* **Freeable Memory** - DB instance पर कितनी RAM उपलब्ध है, megabytes में। Monitoring tab metrics में red line CPU, Memory और Storage Metrics के लिए 75% पर चिह्नित है। यदि instance memory consumption बार-बार उस line को पार करता है, तो यह इंगित करता है कि आपको अपना workload check करना चाहिए या अपना instance upgrade करना चाहिए।
* **Network throughput** - DB instance से और उसकी ओर bytes per second में network traffic की rate।
* **Read/Write Latency** - एक read या write operation के लिए milliseconds में average time।
* **Read/Write IOPS** - प्रति सेकंड disk read या write operations की average संख्या।
* **Free Storage Space** - DB instance द्वारा वर्तमान में कितना disk space उपयोग नहीं किया जा रहा है, megabytes में। यदि उपयोग किया गया space लगातार total disk space के 85 प्रतिशत या उससे अधिक पर है तो disk space consumption की जांच करें। देखें कि instance से data delete करना या data को किसी अन्य system में archive करना space खाली करने के लिए संभव है या नहीं।

![db_cw_metrics.png](../../images/db_cw_metrics.png)

Performance संबंधित issues के troubleshooting के लिए, पहला step सबसे अधिक उपयोग की जाने वाली और expensive queries को tune करना है। उन्हें tune करें और देखें कि क्या ऐसा करने से system resources पर pressure कम होता है। अधिक जानकारी के लिए, [Tuning queries](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/CHAP_BestPractices.html#CHAP_BestPractices.TuningQueries) देखें।

यदि आपकी queries tuned हैं और issue अभी भी बना रहता है, तो अपने database instance classes को upgrade करने पर विचार करें। आप इसे अधिक resources (CPU, RAM, disk space, network bandwidth, I/O capacity) वाले instance में upgrade कर सकते हैं।

फिर, आप इन metrics के critical thresholds तक पहुंचने पर alert करने के लिए alarms set up कर सकते हैं, और किसी भी issue को जितनी जल्दी हो सके resolve करने के लिए action ले सकते हैं।

CloudWatch metrics पर अधिक जानकारी के लिए, [Amazon CloudWatch metrics for Amazon RDS](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/rds-metrics.html) और [Viewing DB instance metrics in the CloudWatch console and AWS CLI](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/metrics_dimensions.html) देखें।

#### CloudWatch Logs Insights

[CloudWatch Logs Insights](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/AnalyzingLogData.html) आपको Amazon CloudWatch Logs में अपने log data को interactively search और analyze करने में सक्षम बनाता है। आप operational issues पर अधिक कुशलता और प्रभावी ढंग से respond करने में मदद के लिए queries perform कर सकते हैं। यदि कोई issue होता है, तो आप संभावित कारणों की पहचान करने और deployed fixes को validate करने के लिए CloudWatch Logs Insights का उपयोग कर सकते हैं।

RDS या Aurora database cluster से CloudWatch में logs publish करने के लिए, [Publish logs for Amazon RDS or Aurora for MySQL instances to CloudWatch](https://repost.aws/knowledge-center/rds-aurora-mysql-logs-cloudwatch) देखें।

CloudWatch के साथ RDS या Aurora logs monitor करने पर अधिक जानकारी के लिए, [Monitoring Amazon RDS log file](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_LogAccess.html) देखें।

#### CloudWatch Alarms

अपने database clusters के लिए जब performance degraded हो तब पहचानने के लिए, आपको नियमित आधार पर key performance metrics की monitor और alert करनी चाहिए। [Amazon CloudWatch alarms](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/AlarmThatSendsEmail.html) का उपयोग करके, आप अपने द्वारा specify की गई time period में एक single metric को watch कर सकते हैं। यदि metric दिए गए threshold से अधिक हो जाती है, तो Amazon SNS topic या AWS Auto Scaling policy को एक notification भेजी जाती है। CloudWatch alarms actions invoke नहीं करते केवल इसलिए कि वे किसी विशेष state में हैं। बल्कि state बदली होनी चाहिए और specified number of periods तक maintained रहनी चाहिए।

CloudWatch alarm set करने के लिए -

* AWS Management Console पर जाएं और Amazon RDS console को [https://console.aws.amazon.com/rds/](https://console.aws.amazon.com/rds/) पर खोलें।
* Navigation pane में, Databases चुनें, और फिर एक DB instance चुनें।
* Logs & events चुनें।

CloudWatch alarms section में, Create alarm चुनें।

![db_cw_alarm.png](../../images/db_cw_alarm.png)

* Send notifications के लिए, Yes चुनें, और Send notifications to के लिए, New email or SMS topic चुनें।
* Topic name के लिए, notification का एक name enter करें, और With these recipients के लिए, email addresses और phone numbers की comma-separated list enter करें।
* Metric के लिए, set करने के लिए alarm statistic और metric चुनें।
* Threshold के लिए, specify करें कि metric threshold से greater than, less than, या equal to होनी चाहिए, और threshold value specify करें।
* Evaluation period के लिए, alarm के लिए evaluation period चुनें। consecutive period(s) of के लिए, वह period चुनें जिसके दौरान alarm trigger करने के लिए threshold reached होना चाहिए।
* Name of alarm के लिए, alarm का एक name enter करें।
* Create Alarm चुनें।

Alarm CloudWatch alarms section में दिखाई देता है।

Multi-AZ DB cluster replica lag के लिए Amazon CloudWatch alarm बनाने का यह [example](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/multi-az-db-cluster-cloudwatch-alarm.html) देखें।

#### Database Audit Logs

Database Audit Logs आपके RDS और Aurora databases पर की गई सभी actions का एक विस्तृत record प्रदान करते हैं, जो आपको unauthorized access, data changes, और अन्य संभावित हानिकारक activities की निगरानी करने में सक्षम बनाते हैं। Database Audit Logs का उपयोग करने के लिए कुछ बेस्ट प्रैक्टिसेज़:

* अपने सभी RDS और Aurora instances के लिए Database Audit Logs सक्षम करें, और उन्हें सभी relevant data capture करने के लिए configure करें।
* अपने Database Audit Logs को collect और analyze करने के लिए एक centralized log management solution, जैसे Amazon CloudWatch Logs या Amazon Kinesis Data Streams, का उपयोग करें।
* संदिग्ध activity के लिए अपने Database Audit Logs की नियमित रूप से निगरानी करें, और किसी भी issue की जांच और तुरंत resolution के लिए action लें।

Database audit logs configure करने के बारे में अधिक जानकारी के लिए, [Configuring an Audit Log to Capture database activities for Amazon RDS and Aurora](https://aws.amazon.com/blogs/database/configuring-an-audit-log-to-capture-database-activities-for-amazon-rds-for-mysql-and-amazon-aurora-with-mysql-compatibility/) देखें।

#### Database Slow Query और Error Logs

Slow query logs database में slow-performing queries खोजने में मदद करते हैं ताकि आप slowness के कारणों की जांच कर सकें और आवश्यकता पड़ने पर queries tune कर सकें। Error logs query errors खोजने में मदद करते हैं, जो उन errors के कारण application में परिवर्तन खोजने में आगे मदद करते हैं।

आप Amazon CloudWatch Logs Insights (जो आपको Amazon CloudWatch Logs में अपने log data को interactively search और analyze करने में सक्षम बनाता है) का उपयोग करके एक CloudWatch dashboard बनाकर slow query log और error log की monitor कर सकते हैं।

Amazon RDS के लिए error log, slow query log, और general log को activate और monitor करने के लिए, [Manage slow query logs and general logs for RDS MySQL](https://repost.aws/knowledge-center/rds-mysql-logs) देखें। Aurora PostgreSQL के लिए slow query log activate करने के लिए, [Enable slow query logs for PostgreSQL](https://catalog.us-east-1.prod.workshops.aws/workshops/31babd91-aa9a-4415-8ebf-ce0a6556a216/en-US/postgresql-logs/enable-slow-query-log) देखें।

## Performance Insights और operating-system metrics

####  Enhanced Monitoring

[Enhanced Monitoring](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_Monitoring.OS.html) आपको उस operating system (OS) के लिए real time में fine-grain metrics प्राप्त करने में सक्षम बनाता है जिस पर आपका DB instance चलता है। 

RDS Enhanced Monitoring से metrics आपके Amazon CloudWatch Logs account में deliver करता है। डिफ़ॉल्ट रूप से, ये metrics 30 दिनों के लिए store की जाती हैं और Amazon CloudWatch में **RDSOSMetrics** Log group में store की जाती हैं। आपके पास 1s से 60s के बीच granularity चुनने का विकल्प है। आप CloudWatch Logs से CloudWatch में custom metrics filters बना सकते हैं और CloudWatch dashboard पर graphs display कर सकते हैं।

![db_enhanced_monitoring_loggroup.png](../../images/db_enhanced_monitoring_loggroup.png)

Enhanced monitoring में OS level process list भी शामिल है। वर्तमान में, Enhanced Monitoring निम्नलिखित database engines के लिए उपलब्ध है:

* MariaDB
* Microsoft SQL Server
* MySQL
* Oracle
* PostgreSQL

**CloudWatch और Enhanced Monitoring में अंतर**
CloudWatch एक DB instance के लिए hypervisor से CPU utilization के बारे में metrics gather करता है। इसके विपरीत, Enhanced Monitoring DB instance पर एक agent से अपनी metrics gather करता है। एक hypervisor virtual machines (VMs) बनाता और चलाता है। Hypervisor का उपयोग करके, एक instance virtually memory और CPU share करके कई guest VMs को support कर सकता है। आपको CloudWatch और Enhanced Monitoring measurements में अंतर मिल सकता है, क्योंकि hypervisor layer थोड़ी मात्रा में work करता है। यदि आपके DB instances smaller instance classes का उपयोग करते हैं तो अंतर अधिक हो सकता है।

Enhanced Monitoring के साथ उपलब्ध सभी metrics के बारे में जानने के लिए, कृपया [OS metrics in Enhanced Monitoring](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_Monitoring-Available-OS-Metrics.html) देखें।


![db-enhanced-monitoring.png](../../images/db_enhanced_monitoring.png)

#### Performance Insights 

[Amazon RDS Performance Insights](https://aws.amazon.com/rds/performance-insights/) एक database performance tuning और monitoring feature है जो आपको अपने database पर load का quickly assess करने और यह determine करने में मदद करता है कि कब और कहां action लेना है। Performance Insights dashboard के साथ, आप अपने db cluster पर database load visualize कर सकते हैं और load को waits, SQL statements, hosts, या users द्वारा filter कर सकते हैं। यह आपको symptoms chase करने के बजाय root cause पर pin point करने की अनुमति देता है।

Performance Insights सात दिनों की free performance history retention प्रदान करता है और आप शुल्क के साथ इसे 2 वर्ष तक बढ़ा सकते हैं। आप RDS management console या AWS CLI से Performance Insights सक्षम कर सकते हैं।

:::note
	वर्तमान में, RDS Performance Insights केवल Aurora (PostgreSQL- और MySQL-compatible editions), Amazon RDS for PostgreSQL, MySQL, MariaDB, SQL Server और Oracle के लिए उपलब्ध है।
:::

**DBLoad** वह key metric है जो database active sessions की average number को represent करता है। Performance Insights में, इस data को **db.load.avg** metric के रूप में query किया जाता है।

![db_perf_insights.png](../../images/db_perf_insights.png)

Aurora के साथ Performance Insights का उपयोग करने पर अधिक जानकारी के लिए, देखें: [Monitoring DB load with Performance Insights on Amazon Aurora](https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/USER_PerfInsights.html)।


## Open-source ऑब्ज़र्वेबिलिटी Tools

#### Amazon Managed Grafana
[Amazon Managed Grafana](https://aws.amazon.com/grafana/) एक fully managed service है जो RDS और Aurora databases से data को visualize और analyze करना आसान बनाता है। 

Amazon CloudWatch में **AWS/RDS namespace** में वे key metrics शामिल हैं जो Amazon RDS और Amazon Aurora पर चलने वाली database entities पर लागू होती हैं। Amazon Managed Grafana में हमारे RDS/Aurora databases की health और संभावित performance issues को visualize और track करने के लिए, हम CloudWatch data source का लाभ उठा सकते हैं।

![amg-rds-aurora.png](../../images/amg-rds-aurora.png)

अभी तक, CloudWatch में केवल basic Performance Insights metrics उपलब्ध हैं जो database performance analyze करने और आपके database में bottlenecks पहचानने के लिए पर्याप्त नहीं हैं। Amazon Managed Grafana में RDS Performance Insight metrics visualize करने और single pane of glass visibility रखने के लिए, ग्राहक सभी RDS Performance insights metrics collect करने और उन्हें एक custom CloudWatch metrics namespace में publish करने के लिए एक custom lambda function का उपयोग कर सकते हैं। एक बार जब ये metrics Amazon CloudWatch में उपलब्ध हो जाएं, तो आप उन्हें Amazon Managed Grafana में visualize कर सकते हैं।

RDS Performance Insights metrics gather करने के लिए custom lambda function deploy करने के लिए, निम्नलिखित GitHub repository clone करें और install.sh script चलाएं।

```
$ git clone https://github.com/aws-observability/observability-best-practices.git
$ cd sandbox/monitor-aurora-with-grafana

$ chmod +x install.sh
$ ./install.sh
```

उपरोक्त script एक custom lambda function और एक IAM role deploy करने के लिए AWS CloudFormation का उपयोग करता है। Lambda function हर 10 mins में auto trigger होता है RDS Performance Insights API invoke करने और Amazon CloudWatch में /AuroraMonitoringGrafana/PerformanceInsights custom namespace में custom metrics publish करने के लिए।

![db_performanceinsights_amg.png](../../images/db_performanceinsights_amg.png)

Custom lambda function deployment और grafana dashboards पर विस्तृत step-by-step जानकारी के लिए, [Performance Insights in Amazon Managed Grafana](https://aws.amazon.com/blogs/mt/monitoring-amazon-rds-and-amazon-aurora-using-amazon-managed-grafana/) देखें।

अपने database में unintended changes को जल्दी पहचानकर और alerts का उपयोग करके notify करके, आप disruptions को minimize करने के लिए actions ले सकते हैं। Amazon Managed Grafana कई notification channels जैसे SNS, Slack, PagerDuty आदि को support करता है जिन्हें आप alerts notifications भेज सकते हैं। [Grafana Alerting](https://docs.aws.amazon.com/grafana/latest/userguide/alerts-overview.html) आपको Amazon Managed Grafana में alerts set up करने के बारे में अधिक जानकारी दिखाएगा।

<!-- blank line -->
<figure class="video_container">
  <iframe width="560" height="315" src="https://www.youtube.com/embed/Uj9UJ1mXwEA" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
</figure>
<!-- blank line -->

## AIOps - Machine learning आधारित performance bottlenecks detection

#### Amazon DevOps Guru for RDS

[Amazon DevOps Guru for RDS](https://aws.amazon.com/devops-guru/features/devops-guru-for-rds/) के साथ, आप performance bottlenecks और operational issues के लिए अपने databases की monitor कर सकते हैं। यह Performance Insights metrics का उपयोग करता है, Machine Learning (ML) का उपयोग करके उनका एनालिसिस करता है ताकि performance issues का database-specific analyses प्रदान किया जा सके, और corrective actions recommend करता है। DevOps Guru for RDS विभिन्न performance-related database issues की पहचान और एनालिसिस कर सकता है, जैसे host resources का over-utilization, database bottlenecks, या SQL queries का misbehavior, आदि। जब कोई issue या anomalous behavior detected होता है, तो DevOps Guru for RDS finding को DevOps Guru console पर display करता है और [Amazon EventBridge](https://aws.amazon.com/pm/eventbridge) या [Amazon Simple Notification Service (SNS)](https://aws.amazon.com/pm/sns) का उपयोग करके notifications भेजता है।

DevOps Guru for RDS database metrics के लिए एक baseline स्थापित करता है। Baselining में एक normal behavior स्थापित करने के लिए एक अवधि में database performance metrics का एनालिसिस शामिल है। Amazon DevOps Guru for RDS फिर स्थापित baseline के विरुद्ध anomalies detect करने के लिए ML का उपयोग करता है।

:::note
	नए database instances के लिए, Amazon DevOps Guru for RDS को एक initial baseline स्थापित करने में 2 दिन तक लग सकते हैं, क्योंकि इसके लिए database usage patterns का analysis और सामान्य behavior माने जाने वाले को स्थापित करना आवश्यक है।
:::

![db_dgr_anomaly.png.png](../../images/db_dgr_anomaly.png)

![db_dgr_recommendation.png](../../images/db_dgr_recommendation.png)

शुरू करने के बारे में अधिक जानकारी के लिए, कृपया [Amazon DevOps Guru for RDS to Detect, Diagnose, and Resolve Amazon Aurora-Related Issues using ML](https://aws.amazon.com/blogs/aws/new-amazon-devops-guru-for-rds-to-detect-diagnose-and-resolve-amazon-aurora-related-issues-using-ml/) देखें।

<!-- blank line -->
<figure class="video_container">
  <iframe width="560" height="315" src="https://www.youtube.com/embed/N3NNYgzYUDA" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
</figure>
<!-- blank line -->

## Auditing और Governance

####  AWS CloudTrail Logs

[AWS CloudTrail](https://docs.aws.amazon.com/awscloudtrail/latest/userguide/cloudtrail-user-guide.html) RDS में एक user, role, या AWS service द्वारा की गई actions का record प्रदान करता है। CloudTrail RDS के लिए सभी API calls को events के रूप में capture करता है, जिसमें console से calls और RDS API operations के code calls शामिल हैं। CloudTrail द्वारा एकत्रित जानकारी का उपयोग करके, आप RDS से किया गया request, request करने वाला IP address, किसने request किया, कब किया, और अतिरिक्त विवरण determine कर सकते हैं। अधिक जानकारी के लिए, [Monitoring Amazon RDS API calls in AWS CloudTrail](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/logging-using-cloudtrail.html) देखें।

अधिक जानकारी के लिए, [Monitoring Amazon RDS API calls in AWS CloudTrail](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/logging-using-cloudtrail.html) देखें।

## अतिरिक्त जानकारी के लिए संदर्भ

[Blog - Amazon Managed Grafana के साथ RDS और Aurora databases Monitor करें](https://aws.amazon.com/blogs/mt/monitoring-amazon-rds-and-amazon-aurora-using-amazon-managed-grafana/)

[Video - Amazon Managed Grafana के साथ RDS और Aurora databases Monitor करें](https://www.youtube.com/watch?v=Uj9UJ1mXwEA)

[Blog - Amazon CloudWatch के साथ RDS और Aurora databases Monitor करें](https://aws.amazon.com/blogs/database/creating-an-amazon-cloudwatch-dashboard-to-monitor-amazon-rds-and-amazon-aurora-mysql/)

[Blog - Amazon RDS के लिए Amazon CloudWatch Logs, AWS Lambda, और Amazon SNS के साथ proactive database monitoring बनाएं](https://aws.amazon.com/blogs/database/build-proactive-database-monitoring-for-amazon-rds-with-amazon-cloudwatch-logs-aws-lambda-and-amazon-sns/)

[Official Doc - Amazon Aurora Monitoring Guide](https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/MonitoringOverview.html)

[Hands-on Workshop - Amazon Aurora में SQL Performance Issues को Observe और Identify करें](https://catalog.workshops.aws/awsauroramysql/en-US/provisioned/perfobserve)

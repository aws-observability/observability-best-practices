## 1.0 KPIs ("Golden Signals") ను అర్థం చేసుకోవడం
సంస్థలు business మరియు operations యొక్క health లేదా risk లోకి insight అందించే key performance indicators (KPIs) అనగా 'Golden Signals' ను ఉపయోగిస్తాయి. సంస్థలోని వేర్వేరు భాగాలు వారి respective outcomes measure చేయడానికి unique KPIs కలిగి ఉంటాయి. ఉదాహరణకు, eCommerce application యొక్క product team cart orders ను విజయవంతంగా process చేయగల సామర్థ్యాన్ని దాని KPI గా track చేస్తుంది. on-call operations team వారి KPI ని mean-time to detect (MTTD) incident గా measure చేస్తుంది. Financial team కి budget లోపల resources cost అనే KPI ముఖ్యం.

Service Level Indicators (SLIs), Service Level Objectives (SLOs), మరియు Service Level Agreements (SLAs) service reliability management యొక్క essential components. ఈ guide Amazon CloudWatch మరియు దాని features ను ఉపయోగించి SLIs, SLOs, మరియు SLAs calculate మరియు monitor చేయడానికి best practices ను స్పష్టమైన మరియు సంక్షిప్త ఉదాహరణలతో వివరిస్తుంది.

- **SLI (Service Level Indicator):** service యొక్క performance యొక్క quantitative measure.
- **SLO (Service Level Objective):** SLI కోసం target value, desired performance level ను represent చేస్తుంది.
- **SLA (Service Level Agreement):** service provider మరియు దాని users మధ్య expected level of service ను specify చేసే contract.

సాధారణ SLIs ఉదాహరణలు:

- Availability: service operational గా ఉన్న సమయం percentage
- Latency: request fulfill చేయడానికి తీసుకునే సమయం
- Error rate: fail అయిన requests percentage

## 2.0 Customer మరియు stakeholder requirements ను discover చేయడం (కింద suggest చేయబడిన template ఉపయోగించి)

1. ముందుగా ఈ ప్రశ్నతో మొదలు పెట్టండి: "ఇచ్చిన workload (ఉదా. Payment portal, eCommerce order placement, User registration, Data reports, Support portal మొదలైనవి) కోసం scope లో ఉన్న business value లేదా business problem ఏమిటి"
2. Business value ను categories గా విభజించండి - User-Experience (UX); Business-Experience (BX); Operational-Experience (OpsX); Security-Experience(SecX); Developer-Experience (DevX)
3. ప్రతి category కోసం core signals అనగా "Golden Signals" derive చేయండి; UX & BX చుట్టూ top signals సాధారణంగా business metrics ను constitute చేస్తాయి

| ID	| Initials	| Customer	| Business Needs	| Measurements	| Information Sources	| What does good look like?	| Alerts	| Dashboards	| Reports	|
| ---	| ---	| ---	| ---	| ---	| ---	| ---	| ---	| ---	| --- |		
|M1	|ఉదాహరణ	|External End User	|User Experience	|Response time (Page latency)	|Logs / Traces	|< 5s for 99.9%	|No	|Yes	|No	|
|M2	|ఉదాహరణ	|Business	|Availability	|Successful RPS (Requests per second)	|Health Check	|>85% in 5 min window	|Yes	|Yes	|Yes	|
|M3	|ఉదాహరణ	|Security	|Compliance	|Critical non-compliant resources	|Config data	|\<10 under 15 days	|No	|Yes	|Yes	|
|M4	|ఉదాహరణ	|Developers	|Agility	|Deployment time	|Deployment logs	|Always < 10 min	|Yes	|No	|Yes	|
|M5	|ఉదాహరణ	|Operators	|Capacity	|Queue Depth	|App logs/metrics	|Always < 10	|Yes	|Yes	|Yes	|

### 2.1 Golden Signals

|Category	|Signal	|Notes	|References	|
|---	|---	|---	|---	|
|UX	|Performance (Latency)	|Template లో M1 చూడండి	|Whitepaper: [Availability and Beyond (Measuring latency)](https://docs.aws.amazon.com/whitepapers/latest/availability-and-beyond-improving-resilience/measuring-availability.html#latency)	|
|BX	|Availability	|Template లో M2 చూడండి	|Whitepaper: [Avaiability and Beyond (Measuring availability)](https://docs.aws.amazon.com/whitepapers/latest/availability-and-beyond-improving-resilience/measuring-availability.html)	|
|BX	|Business Continuity Plan (BCP)	|నిర్వచించిన RTO/RPO కి వ్యతిరేకంగా Amazon Resilience Hub (ARH) resilience score	|Docs: [ARH user guide (Understanding resilience scores)](https://docs.aws.amazon.com/resilience-hub/latest/userguide/resil-score.html)	|
|SecX	|(Non)-Compliance	|Template లో M3 చూడండి	|Docs: [AWS Control Tower user guide (Compliance status in the console)](https://docs.aws.amazon.com/controltower/latest/userguide/compliance-statuses.html)	|
|DevX	|Agility	|Template లో M4 చూడండి	|Docs: [DevOps Monitoring Dashboard on AWS (DevOps metrics list)](https://docs.aws.amazon.com/solutions/latest/devops-monitoring-dashboard-on-aws/devops-metrics-list.html)	|
|OpsX	|Capacity (Quotas)	|Template లో M5 చూడండి	|Docs: [Amazon CloudWatch user guide (Visualizing your service quotas and setting alarms)](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-Quotas-Visualize-Alarms.html)	|
|OpsX	|Budget Anomalies	|	|Docs:<br/> 1. [AWS Billing and Cost Management (AWS Cost Anomaly Detection)](https://docs.aws.amazon.com/cost-management/latest/userguide/getting-started-ad.html) <br/> 2. [AWS Budgets](https://aws.amazon.com/aws-cost-management/aws-budgets/)	|



## 3.0 Top Level Guidance 'TLG'


### 3.1 TLG సాధారణ

1. Business, architecture మరియు security teams తో పని చేసి business, compliance మరియు governance requirements ను refine చేయడంలో సహాయపడండి మరియు అవి business needs ను సరిగ్గా reflect చేస్తున్నాయని నిర్ధారించుకోండి. ఇందులో [recovery-time మరియు recovery-point targets establish చేయడం](https://aws.amazon.com/blogs/mt/establishing-rpo-and-rto-targets-for-cloud-applications/) (RTOs, RPOs) ఉన్నాయి. [Availability measure చేయడం](https://docs.aws.amazon.com/whitepapers/latest/availability-and-beyond-improving-resilience/measuring-availability.html) మరియు latency (ఉదా. Uptime 5 min window లో చిన్న percentage faults ను allow చేయవచ్చు) వంటి requirements measure చేయడానికి methods formulate చేయండి.

2. వివిధ business functional outcomes కు align అయ్యే purpose built schema తో effective [tagging strategy](https://docs.aws.amazon.com/whitepapers/latest/tagging-best-practices/defining-and-publishing-a-tagging-schema.html) build చేయండి. ఇది ముఖ్యంగా [operational observability](https://docs.aws.amazon.com/whitepapers/latest/tagging-best-practices/operational-observability.html) మరియు [incident management](https://docs.aws.amazon.com/whitepapers/latest/tagging-best-practices/incident-management.html) ను cover చేయాలి.

3. సాధ్యమైన చోట alarms కోసం dynamic thresholds leverage చేయండి (ముఖ్యంగా baseline KPIs లేని metrics కోసం) [CloudWatch anomaly detection](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch_Anomaly_Detection.html) ఉపయోగించి, ఇది baselines establish చేయడానికి machine learning algorithms అందిస్తుంది. CW metrics (లేదా prometheus metrics వంటి ఇతర sources) publish చేసే AWS available services ఉపయోగించేటప్పుడు alarms configure చేయడానికి alarm noise తగ్గించడానికి [composite alarms](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Create_Composite_Alarm.html) create చేయడం consider చేయండి. ఉదాహరణ: availability indicative business metric (successful requests ద్వారా tracked) మరియు latency కలిగిన composite alarm deployments సమయంలో రెండూ critical threshold కంటే దిగువకు drop అయినప్పుడు alarm అయ్యేలా configure చేసినప్పుడు deployment bug యొక్క deterministic indicator కావచ్చు.

4. (NOTE: AWS Business support లేదా higher అవసరం) AWS Personal Health Dashboard లో మీ resources కు సంబంధించిన events ను AWS Health service ఉపయోగించి publish చేస్తుంది. Central account (management account వంటి) నుండి మీ AWS Organization అంతటా aggregated proactive మరియు real-time alerts ingest చేయడానికి [AWS Health Aware (AHA)](https://aws.amazon.com/blogs/mt/aws-health-aware-customize-aws-health-alerts-for-organizational-and-personal-aws-accounts/) framework leverage చేయండి. ఈ alerts Slack వంటి preferred communication platforms కు పంపవచ్చు మరియు ServiceNow మరియు Jira వంటి ITSM tools తో integrate అవుతాయి.
![Image: AWS Health Aware 'AHA'](../../../images/AHA-Integration.jpg)

5. Resources కోసం best monitors setup చేయడానికి మరియు మీ applications తో problems signs కోసం data continuously analyze చేయడానికి Amazon CloudWatch [Application Insights](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/cloudwatch-application-insights.html) leverage చేయండి. ఇది application/infrastructure issues ను quickly isolate/troubleshoot చేయడానికి monitored applications తో potential problems చూపించే automated dashboards కూడా అందిస్తుంది. Containers నుండి metrics మరియు logs aggregate చేయడానికి [Container Insights](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/ContainerInsights.html) leverage చేయండి మరియు CloudWatch Application Insights తో seamlessly integrate చేయవచ్చు.
![Image: CW Application Insights](../../../images/CW-ApplicationInsights.jpg)

6. నిర్వచించిన RTOs మరియు RPOs కి వ్యతిరేకంగా applications analyze చేయడానికి [AWS Resilience Hub](https://aws.amazon.com/resilience-hub/) leverage చేయండి. [AWS Fault Injection Simulator](https://aws.amazon.com/fis/) వంటి tools ఉపయోగించి controlled experiments ద్వారా availability, latency మరియు business continuity requirements meet అవుతున్నాయో validate చేయండి. Workloads AWS best practices follow చేస్తూ business requirements meet చేయడానికి design చేయబడ్డాయని నిర్ధారించడానికి additional Well-Architected reviews మరియు service specific deep-dives conduct చేయండి.

7. మరింత details కోసం [AWS Observability Best Practices](https://aws-observability.github.io/observability-best-practices/) guidance యొక్క ఇతర sections, AWS Cloud Adoption Framework: [Operations Perspective](https://docs.aws.amazon.com/whitepapers/latest/aws-caf-operations-perspective/observability.html) whitepaper మరియు AWS Well-Architected Framework Operational Excellence Pillar whitepaper content '[Understading workload health](https://docs.aws.amazon.com/wellarchitected/latest/operational-excellence-pillar/understanding-workload-health.html)' refer చేయండి.
    

### 3.2 Domain ద్వారా TLG (business metrics అనగా UX, BX పై emphasis)

CloudWatch (CW) వంటి services ఉపయోగించి కింద suitable ఉదాహరణలు ఇవ్వబడ్డాయి (Ref: [CloudWatch metrics documentation](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/aws-services-cloudwatch-metrics.html) publish చేసే AWS Services)

#### 3.2.1 Canaries (అనగా Synthetic transactions) మరియు Real-User Monitoring (RUM)

* TLG: Client/customer experience అర్థం చేసుకోవడానికి అత్యంత సులభమైన మరియు effective ways లో ఒకటి Canaries (Synthetic transactions) తో customer traffic simulate చేయడం, ఇవి మీ services ను regularly probe చేసి metrics record చేస్తాయి.

|AWS Service	|Feature	|Measurement	|Metric	|Example	|Notes	|
|---	|---	|---	|---	|---	|---	|
|CW	|Synthetics	|Availability	|**SuccessPercent**	|(Ex. SuccessPercent > 90 or CW Anomaly Detection for 1min Period)<br/>**[Metric Math where m1 is SuccessPercent if Canaries run each weekday 7a-8a (CloudWatchSynthetics): ** <br/>`IF(((DAY(m1)<6) AND (HOUR(m1)>7 AND HOUR(m1)<8)),m1)]`	|	|
|	|	|	|	|	|	|
|CW	|Synthetics	|Availability	|VisualMonitoringSuccessPercent	|(Ex. VisualMonitoringSuccessPercent > 90 for 5 min Period for UI screenshot comparisons)<br/>**[Metric Math where m1 is SuccessPercent if Canaries run each weekday 7a-8a (CloudWatchSynthetics): ** <br/>`IF(((DAY(m1)<6) AND (HOUR(m1)>7 AND HOUR(m1)<8)),m1)`	|Customer canary ను predetermined UI screenshot తో match చేయాలని expect చేస్తే	|
|	|	|	|	|	|	|
|CW	|RUM	|Response Time	|Apdex Score	|(Ex. Apdex score: <br/> NavigationFrustratedCount < 'N' expected value)	|	|
|	|	|	|	|	|	|


#### 3.2.2 API Frontend


|AWS Service	|Feature	|Measurement	|Metric	|Example	|Notes	|
|---	|---	|---	|---	|---	|---	|
|CloudFront	|	|Availability	|Total error rate	|(Ex. [Total error rate] < 10 or CW Anomaly Detection for 1min Period)	|Error rate measure గా Availability	|
|	|	|	|	|	|	|
|CloudFront	|(Requires turning on additional metrics)	|Peformance	|Cache hit rate	|(Ex.Cache hit rate < 10 CW Anomaly Detection for 1min Period)	|	|
|	|	|	|	|	|	|
|Route53	|Health checks	|(Cross region) Availability	|HealthCheckPercentageHealthy	|(Ex. [Minimum of HealthCheckPercentageHealthy] > 90 or CW Anomaly Detection for 1min Period)	|	|
|	|	|	|	|	|	|
|Route53	|Health checks	|Latency	|TimeToFirstByte	|(Ex. [p99 TimeToFirstByte] < 100 ms or CW Anomaly Detection for 1min Period)	|	|
|	|	|	|	|	|	|
|API Gateway	|	|Availability	|Count	|(Ex. [(4XXError + 5XXError) / Count) * 100] < 10 or CW Anomaly Detection for 1min Period)	|"abandoned" requests measure గా Availability	|
|	|	|	|	|	|	|
|API Gateway	|	|Latency	|Latency (or IntegrationLatency i.e. backend latency)	|(Ex. p99 Latency < 1 sec or CW Anomaly Detection for 1min Period)	|p99 p90 వంటి lower percentile కంటే greater tolerance కలిగి ఉంటుంది. (p50 average తో same)	|
|	|	|	|	|	|	|
|API Gateway	|	|Performance	|CacheHitCount (and Misses)	|(Ex. [CacheMissCount / (CacheHitCount + CacheMissCount)  * 100] < 10 or CW Anomaly Detection for 1min Period)	|Cache (Misses) measure గా Performance	|
|	|	|	|	|	|	|
|Application Load Balancer (ALB)	|	|Availability	|RejectedConnectionCount	|(Ex.[RejectedConnectionCount/(RejectedConnectionCount + RequestCount) * 100] < 10 CW Anomaly Detection for 1min Period)	|Max connections breach వల్ల rejected requests measure గా Availability	|
|	|	|	|	|	|	|
|Application Load Balancer (ALB)	|	|Latency	|TargetResponseTime	|(Ex. p99 TargetResponseTime < 1 sec or CW Anomaly Detection for 1min Period)	|p99 p90 వంటి lower percentile కంటే greater tolerance కలిగి ఉంటుంది. (p50 average తో same)	|
|	|	|	|	|	|	|


#### 3.2.3 Serverless

|AWS Service	|Feature	|Measurement	|Metric	|Example	|Notes	|
|---	|---	|---	|---	|---	|---	|
|S3	|Request metrics	|Availability	|AllRequests	|(Ex. [(4XXErrors + 5XXErrors) / AllRequests) * 100] < 10 or CW Anomaly Detection for 1min Period)	|"abandoned" requests measure గా Availability	|
|	|	|	|	|	|	|
|S3	|Request metrics	|(Overall) Latency	|TotalRequestLatency	|(Ex. [p99 TotalRequestLatency] < 100 ms or CW Anomaly Detection for 1min Period)	|	|
|	|	|	|	|	|	|
|DynamoDB (DDB)	|	|Availability	|ThrottledRequests	|(Ex. [ThrottledRequests] < 100 or CW Anomaly Detection for 1min Period)	|"throttled" requests measure గా Availability	|
|	|	|	|	|	|	|
|DynamoDB (DDB)	|	|Latency	|SuccessfulRequestLatency	|(Ex. [p99 SuccessfulRequestLatency] < 100 ms or CW Anomaly Detection for 1min Period)	|	|
|	|	|	|	|	|	|
|Step Functions	|	|Availability	|ExecutionsFailed	|(Ex. ExecutionsFailed = 0)<br/>**[ex. Metric Math where m1 is ExecutionsFailed (Step function Execution) UTC time: `IF(((DAY(m1)<6 OR ** ** DAY(m1)==7) AND (HOUR(m1)>21 AND HOUR(m1)<7)),m1)]`	|Weekdays లో 9p-7a daily operation గా step functions completion request చేసే business flow assuming (start of day business operations)	|
|	|	|	|	|	|	|


#### 3.2.4 Compute మరియు Containers

|AWS Service	|Feature	|Measurement	|Metric	|Example	|Notes	|
|---	|---	|---	|---	|---	|---	|
|EKS	|Prometheus metrics	|Availability	|APIServer Request Success Ratio	|(ex. Prometheus metric like  [APIServer Request Success Ratio](https://raw.githubusercontent.com/aws-samples/amazon-cloudwatch-container-insights/latest/k8s-deployment-manifest-templates/deployment-mode/service/cwagent-prometheus/sample_cloudwatch_dashboards/kubernetes_api_server/cw_dashboard_kubernetes_api_server.json))	|[EKS control plane metrics monitor చేయడానికి best practices](https://aws.github.io/aws-eks-best-practices/reliability/docs/controlplane/#monitor-control-plane-metrics) మరియు [EKS observability](https://docs.aws.amazon.com/eks/latest/userguide/eks-observe.html) details కోసం చూడండి.	|
|	|	|	|	|	|	|
|EKS	|Prometheus metrics	|Performance	|apiserver_request_duration_seconds, etcd_request_duration_seconds	|apiserver_request_duration_seconds, etcd_request_duration_seconds	|	|
|	|	|	|	|	|	|
|ECS	|	|Availability	|Service RUNNING task count	|Service RUNNING task count	|ECS CW metrics [documentation](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/cloudwatch-metrics.html#cw_running_task_count) చూడండి	|
|	|	|	|	|	|	|
|ECS	|	|Performance	|TargetResponseTime	|(ex.  [p99 TargetResponseTime] < 100 ms or CW Anomaly Detection for 1min Period)	|ECS CW metrics [documentation](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/cloudwatch-metrics.html#cw_running_task_count) చూడండి	|
|	|	|	|	|	|	|
|EC2 (.NET Core)	|CW Agent Performance Counters	|Availability	|(ex. [ASP.NET Application Errors Total/Sec](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/appinsights-metrics-ec2.html#appinsights-metrics-ec2-built-in) < 'N')	|(ex. [ASP.NET Application Errors Total/Sec](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/appinsights-metrics-ec2.html#appinsights-metrics-ec2-built-in) < 'N')	|EC2 CW Application Insights [documentation](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/appinsights-metrics-ec2.html#appinsights-metrics-ec2-built-in) చూడండి	|
|	|	|	|	|	|	|


#### 3.2.5 Databases (RDS)

|AWS Service	|Feature	|Measurement	|Metric	|Example	|Notes	|
|---	|---	|---	|---	|---	|---	|
|RDS Aurora	|Performance Insights (PI)	|Availability	|Average active sessions	|(Ex. Average active serssions with CW Anomaly Detection for 1min Period)	|RDS Aurora CW PI [documentation](https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/USER_PerfInsights.Overview.ActiveSessions.html#USER_PerfInsights.Overview.ActiveSessions.AAS) చూడండి	|
|	|	|	|	|	|	|
|RDS Aurora	|	|Disaster Recovery (DR)	|AuroraGlobalDBRPOLag	|(Ex. AuroraGlobalDBRPOLag < 30000 ms for 1min Period)	|RDS Aurora CW [documentation](https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/Aurora.AuroraMonitoring.Metrics.html) చూడండి	|
|	|	|	|	|	|	|
|RDS Aurora	|	|Performance	|Commit Latency, Buffer Cache Hit Ratio, DDL Latency, DML Latency	|(Ex. Commit Latency with CW Anomaly Detection for 1min Period)	|RDS Aurora CW PI [documentation](https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/USER_PerfInsights.Overview.ActiveSessions.html#USER_PerfInsights.Overview.ActiveSessions.AAS) చూడండి	|
|	|	|	|	|	|	|
|RDS (MSSQL)	|PI	|Performance	|SQL Compilations	|(Ex. <br/>SQL Compliations > 'M' for 5 min Period)	|RDS CW PI [documentation](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_PerfInsights_Counters.html#USER_PerfInsights_Counters.SQLServer) చూడండి	|
|	|	|	|	|	|	|


## 4.0 SLIs, SLOs, మరియు SLAs Calculate చేయడానికి Amazon CloudWatch మరియు Metric Math ఉపయోగించడం

### 4.1 Amazon CloudWatch మరియు Metric Math

Amazon CloudWatch AWS resources కోసం monitoring మరియు observability services అందిస్తుంది. Metric Math CloudWatch metric data ఉపయోగించి calculations perform చేయడానికి allow చేస్తుంది, ఇది SLIs, SLOs, మరియు SLAs calculate చేయడానికి ideal tool.

#### 4.1.1 Detailed Monitoring Enable చేయడం

మరింత accurate SLI calculations కోసం 1-minute data granularity పొందడానికి మీ AWS resources కోసం Detailed Monitoring enable చేయండి.

#### 4.1.2 Namespaces మరియు Dimensions తో Metrics Organize చేయడం

Metrics ను categorize మరియు filter చేయడం సులభం చేయడానికి Namespaces మరియు Dimensions ఉపయోగించండి. ఉదాహరణకు, specific service కు సంబంధించిన metrics group చేయడానికి Namespaces ఉపయోగించండి, మరియు ఆ service యొక్క various instances మధ్య differentiate చేయడానికి Dimensions ఉపయోగించండి.

### 4.2 Metric Math తో SLIs Calculate చేయడం

#### 4.2.1 Availability

Availability calculate చేయడానికి, successful requests సంఖ్యను total requests సంఖ్యతో divide చేయండి:

```
availability = 100 * (successful_requests / total_requests)
```


**ఉదాహరణ:**

మీ API Gateway కింది metrics కలిగి ఉందని అనుకోండి:
- `4XXError`: 4xx client errors సంఖ్య
- `5XXError`: 5xx server errors సంఖ్య
- `Count`: Total requests సంఖ్య

Availability calculate చేయడానికి Metric Math ఉపయోగించండి:

```
availability = 100 * ((Count - 4XXError - 5XXError) / Count)
```


#### 4.2.2 Latency

Average latency calculate చేయడానికి, CloudWatch provide చేసే `SampleCount` మరియు `Sum` statistics ఉపయోగించండి:

```
average_latency = Sum / SampleCount
```


**ఉదాహరణ:**

మీ Lambda function కింది metric కలిగి ఉందని అనుకోండి:
- `Duration`: Function execute చేయడానికి తీసుకునే సమయం

Average latency calculate చేయడానికి Metric Math ఉపయోగించండి:

```
average_latency = Duration.Sum / Duration.SampleCount
```


#### 4.2.3 Error Rate

Error rate calculate చేయడానికి, failed requests సంఖ్యను total requests సంఖ్యతో divide చేయండి:

```
error_rate = 100 * (failed_requests / total_requests)
```


**ఉదాహరణ:**

ముందుగా API Gateway ఉదాహరణ ఉపయోగించి:

```
error_rate = 100 * ((4XXError + 5XXError) / Count)
```


### 4.4 SLOs Define మరియు Monitor చేయడం

#### 4.4.1 Realistic Targets Set చేయడం

User expectations మరియు historical performance data ఆధారంగా SLO targets define చేయండి. Service reliability మరియు resource utilization మధ్య balance ensure చేయడానికి achievable targets set చేయండి.

#### 4.4.2 CloudWatch తో SLOs Monitor చేయడం

మీ SLIs monitor చేయడానికి మరియు అవి SLO targets ను approach లేదా breach చేసినప్పుడు notify చేయడానికి CloudWatch Alarms create చేయండి. ఇది issues ను proactively address చేయడానికి మరియు service reliability maintain చేయడానికి enable చేస్తుంది.

#### 4.4.3 SLOs Review మరియు Adjust చేయడం

మీ service evolve అవుతున్నప్పుడు SLOs relevant గా ఉన్నాయని ensure చేయడానికి periodically review చేయండి. అవసరమైతే targets adjust చేసి stakeholders కు changes communicate చేయండి.

### 4.5 SLAs Define మరియు Measure చేయడం

#### 4.5.1 Realistic Targets Set చేయడం

Historical performance data మరియు user expectations ఆధారంగా SLA targets define చేయండి. Service reliability మరియు resource utilization మధ్య balance ensure చేయడానికి achievable targets set చేయండి.

#### 4.5.2 Monitoring మరియు Alerting

SLIs monitor చేయడానికి మరియు అవి SLA targets ను approach లేదా breach చేసినప్పుడు notify చేయడానికి CloudWatch Alarms set up చేయండి. ఇది issues ను proactively address చేయడానికి మరియు service reliability maintain చేయడానికి enable చేస్తుంది.

#### 4.5.3 SLAs Regular గా Review చేయడం

మీ service evolve అవుతున్నప్పుడు SLAs relevant గా ఉన్నాయని ensure చేయడానికి periodically review చేయండి. అవసరమైతే targets adjust చేసి stakeholders కు changes communicate చేయండి.

### 4.6 Set Period లో SLA లేదా SLO Performance Measure చేయడం

Calendar month వంటి set period లో SLA లేదా SLO performance measure చేయడానికి, custom time ranges తో CloudWatch metric data ఉపయోగించండి.

**ఉదాహరణ:**

మీ API Gateway 99.9% availability SLO target కలిగి ఉందని అనుకోండి. April నెల కోసం availability measure చేయడానికి, కింది Metric Math expression ఉపయోగించండి:

```
availability = 100 * ((Count - 4XXError - 5XXError) / Count)
```


అప్పుడు, custom time range తో CloudWatch metric data query configure చేయండి:

- **Start Time:** `2023-04-01T00:00:00Z`
- **End Time:** `2023-04-30T23:59:59Z`
- **Period:** `2592000` (30 days in seconds)

చివరగా, నెల యొక్క average availability calculate చేయడానికి `AVG` statistic ఉపయోగించండి. Average availability SLO target కి equal లేదా greater అయితే, మీరు మీ objective meet చేసారు.

## 5.0 సారాంశం

Key Performance Indicators (KPIs) అనగా 'Golden Signals' business మరియు stake-holder requirements కు align అవ్వాలి. Amazon CloudWatch మరియు Metric Math ఉపయోగించి SLIs, SLOs, మరియు SLAs calculate చేయడం service reliability manage చేయడానికి crucial. మీ AWS resources యొక్క performance ను effectively monitor మరియు maintain చేయడానికి ఈ guide లో outlined best practices follow చేయండి. Detailed Monitoring enable చేయడం, Namespaces మరియు Dimensions తో metrics organize చేయడం, SLI calculations కోసం Metric Math ఉపయోగించడం, realistic SLO మరియు SLA targets set చేయడం, మరియు CloudWatch Alarms తో monitoring మరియు alerting systems establish చేయడం గుర్తుంచుకోండి. ఈ best practices apply చేయడం ద్వారా, మీరు optimal service reliability, better resource utilization, మరియు improved customer satisfaction ensure చేయగలరు.





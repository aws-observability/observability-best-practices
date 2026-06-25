# AWS లో Databricks మానిటరింగ్ మరియు Observability బెస్ట్ ప్రాక్టీసెస్

Databricks అనేది డేటా అనలిటిక్స్ మరియు AI/ML వర్క్‌లోడ్‌లను నిర్వహించడానికి ఒక ప్లాట్‌ఫారమ్. ఈ గైడ్ [AWS లో Databricks](https://aws.amazon.com/solutions/partners/databricks/) నడుపుతున్న కస్టమర్లకు AWS Native observability సేవలు లేదా OpenSource Managed Services ఉపయోగించి ఈ వర్క్‌లోడ్‌లను మానిటర్ చేయడంలో సహాయం చేయడం లక్ష్యంగా పెట్టుకుంది.

## Databricks ను ఎందుకు మానిటర్ చేయాలి

Databricks క్లస్టర్‌లను నిర్వహించే ఆపరేషన్ టీమ్‌లు వర్క్‌లోడ్ స్థితి, ఎర్రర్లు, పెర్ఫార్మెన్స్ బాటిల్‌నెక్‌లను ట్రాక్ చేయడానికి ఇంటిగ్రేటెడ్, కస్టమైజ్డ్ డాష్‌బోర్డ్ కలిగి ఉండటం వల్ల ప్రయోజనం పొందుతారు; కాలక్రమేణా మొత్తం రిసోర్స్ వాడకం, లేదా ఎర్రర్ల శాతం వంటి అవాంఛనీయ ప్రవర్తనపై అలర్ట్ చేయడం; మరియు రూట్ కాజ్ అనాలిసిస్ కోసం కేంద్రీకృత లాగింగ్, అలాగే అదనపు కస్టమైజ్డ్ మెట్రిక్స్ ను ఎక్స్‌ట్రాక్ట్ చేయడం.

## ఏమి మానిటర్ చేయాలి

Databricks తన క్లస్టర్ ఇన్‌స్టెన్సులలో Apache Spark ను నడుపుతుంది, ఇది మెట్రిక్స్ ను ఎక్స్‌పోజ్ చేయడానికి నేటివ్ ఫీచర్లు కలిగి ఉంది. ఈ మెట్రిక్స్ drivers, workers మరియు క్లస్టర్‌లో అమలవుతున్న వర్క్‌లోడ్‌ల గురించి సమాచారం అందిస్తాయి.

Spark నడుపుతున్న ఇన్‌స్టెన్సులు స్టోరేజ్, CPU, మెమరీ మరియు నెట్‌వర్కింగ్ గురించి అదనపు ఉపయోగకరమైన సమాచారం కలిగి ఉంటాయి. Databricks క్లస్టర్ పెర్ఫార్మెన్స్‌ను ఏ బాహ్య కారకాలు ప్రభావితం చేస్తున్నాయో అర్థం చేసుకోవడం ముఖ్యం. అనేక ఇన్‌స్టెన్సులు కలిగిన క్లస్టర్‌ల విషయంలో, బాటిల్‌నెక్‌లు మరియు సాధారణ ఆరోగ్యాన్ని అర్థం చేసుకోవడం కూడా ముఖ్యం.

## ఎలా మానిటర్ చేయాలి

కలెక్టర్లు మరియు వాటి డిపెండెన్సీలను ఇన్‌స్టాల్ చేయడానికి, Databricks init scripts అవసరం. ఇవి బూట్ సమయంలో Databricks క్లస్టర్ యొక్క ప్రతి ఇన్‌స్టెన్స్‌లో నడిచే స్క్రిప్ట్‌లు.

Databricks క్లస్టర్ అనుమతులకు instance profiles ఉపయోగించి మెట్రిక్స్ మరియు లాగ్‌లు పంపడానికి అనుమతి కూడా అవసరం.

చివరగా, Databricks cluster Spark configuration లో metrics namespace కాన్ఫిగర్ చేయడం బెస్ట్ ప్రాక్టీస్, `testApp` ను క్లస్టర్‌కు తగిన రిఫరెన్స్‌తో భర్తీ చేయండి.

![Databricks Spark Config](../../images/databricks_spark_config.png)
*Figure 1: metrics namespace Spark configuration ఉదాహరణ*

## DataBricks కోసం మంచి Observability సొల్యూషన్ యొక్క ముఖ్య భాగాలు

**1) మెట్రిక్స్:** మెట్రిక్స్ అనేవి ఒక కాల వ్యవధిలో కొలవబడిన కార్యాచరణ లేదా నిర్దిష్ట ప్రక్రియను వివరించే సంఖ్యలు. Databricks లో వివిధ రకాల మెట్రిక్స్ ఇవి:

System resource-level metrics, CPU, memory, disk మరియు network వంటివి.
Custom Metrics Source, StreamingQueryListener మరియు QueryExecutionListener ఉపయోగించి Application Metrics.
MetricsSystem ద్వారా ఎక్స్‌పోజ్ చేయబడిన Spark Metrics.

**2) లాగ్‌లు:** లాగ్‌లు జరిగిన వరుస సంఘటనల ప్రాతినిధ్యం, మరియు అవి వాటి గురించి ఒక రేఖీయ కథను చెబుతాయి. Databricks లో వివిధ రకాల లాగ్‌లు ఇవి:

- Event logs
- Audit logs
- Driver logs: stdout, stderr, log4j custom logs (structured logging ఎనేబుల్ చేయండి)
- Executor logs: stdout, stderr, log4j custom logs (structured logging ఎనేబుల్ చేయండి)

**3) ట్రేసెస్:** Stack traces ఎండ్-టు-ఎండ్ విజిబిలిటీ అందిస్తాయి, మరియు అవి stages ద్వారా మొత్తం ప్రవాహాన్ని చూపిస్తాయి. ఏ stages/codes ఎర్రర్లు/పెర్ఫార్మెన్స్ సమస్యలకు కారణమవుతున్నాయో గుర్తించడానికి మీరు డీబగ్ చేయాల్సి వచ్చినప్పుడు ఇది ఉపయోగకరం.

**4) డాష్‌బోర్డ్‌లు:** డాష్‌బోర్డ్‌లు అప్లికేషన్/సర్వీస్ యొక్క గోల్డెన్ మెట్రిక్స్ యొక్క గొప్ప సారాంశ వీక్షణను అందిస్తాయి.

**5) అలర్ట్‌లు:** అలర్ట్‌లు దృష్టి అవసరమయ్యే పరిస్థితుల గురించి ఇంజనీర్లకు తెలియజేస్తాయి.

## AWS Native Observability ఎంపికలు

Ganglia UI మరియు Log Delivery వంటి Native solutions, system metrics సేకరించడానికి మరియు Apache Spark metrics క్వెరీ చేయడానికి గొప్ప పరిష్కారాలు. అయితే, కొన్ని ప్రాంతాలలో మెరుగుదల అవసరం:

- Ganglia alerts కు మద్దతు ఇవ్వదు.
- Ganglia లాగ్‌ల నుండి తీసుకున్న metrics (ఉదా., ERROR log growth rate) సృష్టించడానికి మద్దతు ఇవ్వదు.
- data-correctness, data-freshness లేదా end-to-end latency కు సంబంధించిన SLO (Service Level Objectives) మరియు SLI (Service Level Indicators) ట్రాక్ చేయడానికి custom dashboards ఉపయోగించి ganglia తో విజువలైజ్ చేయడం సాధ్యం కాదు.

[Amazon CloudWatch](https://aws.amazon.com/cloudwatch/) AWS లో మీ Databricks క్లస్టర్‌లను మానిటర్ చేయడానికి మరియు నిర్వహించడానికి ఒక క్లిష్టమైన సాధనం. ఇది క్లస్టర్ పెర్ఫార్మెన్స్‌పై విలువైన ఇన్‌సైట్స్ అందిస్తుంది మరియు సమస్యలను త్వరగా గుర్తించి పరిష్కరించడంలో సహాయపడుతుంది. Databricks ను CloudWatch తో ఇంటిగ్రేట్ చేయడం మరియు structured logging ఎనేబుల్ చేయడం ఆ ప్రాంతాలను మెరుగుపరచడంలో సహాయపడుతుంది. CloudWatch Application Insights లాగ్‌లలో ఉన్న ఫీల్డ్‌లను ఆటోమేటిక్‌గా డిస్కవర్ చేయడంలో సహాయపడుతుంది, మరియు CloudWatch Logs Insights వేగవంతమైన డీబగ్గింగ్ మరియు విశ్లేషణ కోసం ప్రత్యేకంగా నిర్మించిన query language అందిస్తుంది.

![Databricks With CloudWatch](../../images/databricks_cw_arch.png)
*Figure 2: Databricks CloudWatch ఆర్కిటెక్చర్*

Databricks ను మానిటర్ చేయడానికి CloudWatch ఎలా ఉపయోగించాలో మరింత సమాచారం కోసం, చూడండి:
[How to Monitor Databricks with Amazon CloudWatch](https://aws.amazon.com/blogs/mt/how-to-monitor-databricks-with-amazon-cloudwatch/)

## ఓపెన్-సోర్స్ సాఫ్ట్‌వేర్ observability ఎంపికలు

[Amazon Managed Service for Prometheus](https://aws.amazon.com/prometheus/) అనేది Prometheus-compatible monitoring managed, serverless service, ఇది మెట్రిక్స్ స్టోర్ చేయడానికి మరియు ఈ మెట్రిక్స్ పై సృష్టించిన alerts నిర్వహించడానికి బాధ్యత వహిస్తుంది. Prometheus అనేది ఒక ప్రసిద్ధ ఓపెన్ సోర్స్ మానిటరింగ్ టెక్నాలజీ, ఇది Kubernetes తర్వాత Cloud Native Computing Foundation కు చెందిన రెండవ ప్రాజెక్ట్.

[Amazon Managed Grafana](https://aws.amazon.com/grafana/) అనేది Grafana కోసం ఒక managed service. Grafana అనేది time-series డేటా విజువలైజేషన్ కోసం ఒక ఓపెన్ సోర్స్ టెక్నాలజీ, ఇది సాధారణంగా observability కోసం ఉపయోగించబడుతుంది. Amazon Managed Service for Prometheus, Amazon CloudWatch మరియు అనేక ఇతర మూలాల నుండి డేటాను విజువలైజ్ చేయడానికి Grafana ను ఉపయోగించవచ్చు. ఇది Databricks metrics మరియు alerts విజువలైజ్ చేయడానికి ఉపయోగించబడుతుంది.

[AWS Distro for OpenTelemetry](https://aws-otel.github.io/) అనేది OpenTelemetry project యొక్క AWS-supported distribution, ఇది traces మరియు metrics సేకరించడానికి ఓపెన్ సోర్స్ standards, libraries మరియు services అందిస్తుంది. OpenTelemetry ద్వారా, Prometheus లేదా StatsD వంటి అనేక వేర్వేరు observability data formats సేకరించవచ్చు, ఈ డేటాను enrich చేయవచ్చు, మరియు CloudWatch లేదా Amazon Managed Service for Prometheus వంటి అనేక destinations కు పంపవచ్చు.

### వాడకం సందర్భాలు

AWS Native services Databricks క్లస్టర్‌లను నిర్వహించడానికి అవసరమైన observability అందిస్తాయి, కానీ Open Source managed services ఉపయోగించడం ఉత్తమ ఎంపిక అయిన కొన్ని సందర్భాలు ఉన్నాయి.

Prometheus మరియు Grafana రెండూ చాలా ప్రసిద్ధ టెక్నాలజీలు, మరియు ఇప్పటికే అనేక కంపెనీలలో ఉపయోగించబడుతున్నాయి. AWS Open Source services for observability ఆపరేషన్ టీమ్‌లకు అదే ఉన్న ఇన్‌ఫ్రాస్ట్రక్చర్, అదే query language, మరియు ఉన్న dashboards మరియు alerts ఉపయోగించి Databricks వర్క్‌లోడ్‌లను మానిటర్ చేయడానికి అనుమతిస్తాయి, ఈ services infrastructure, scalability మరియు performance నిర్వహించే భారం లేకుండా.

ADOT అనేది metrics మరియు traces ను CloudWatch మరియు Prometheus వంటి వివిధ destinations కు పంపాల్సిన, లేదా OTLP మరియు StatsD వంటి వివిధ రకాల data sources తో పని చేయాల్సిన టీమ్‌లకు ఉత్తమ ప్రత్యామ్నాయం.

చివరగా, Amazon Managed Grafana CloudWatch మరియు Prometheus తో సహా అనేక వేర్వేరు Data Sources కు మద్దతు ఇస్తుంది, మరియు ఒకటి కంటే ఎక్కువ టూల్స్ ఉపయోగించాలని నిర్ణయించుకునే టీమ్‌లకు డేటాను కోరిలేట్ చేయడంలో సహాయపడుతుంది, అన్ని Databricks Clusters కోసం observability ఎనేబుల్ చేసే templates సృష్టించడానికి అనుమతిస్తుంది, మరియు Infrastructure as Code ద్వారా దాని provisioning మరియు configuration అనుమతించే శక్తివంతమైన API అందిస్తుంది.

![Databricks OpenSource Observability Diagram](../../images/databricks_oss_diagram.png)
*Figure 3: Databricks Open Source Observability ఆర్కిటెక్చర్*

AWS Managed Open Source Services for Observability ఉపయోగించి Databricks క్లస్టర్ నుండి metrics ను గమనించడానికి, మీకు metrics మరియు alerts రెండింటినీ విజువలైజ్ చేయడానికి ఒక Amazon Managed Grafana workspace, మరియు Amazon Managed Grafana workspace లో datasource గా కాన్ఫిగర్ చేయబడిన ఒక Amazon Managed Service for Prometheus workspace అవసరం.

సేకరించాల్సిన రెండు ముఖ్యమైన రకాల metrics ఉన్నాయి: Spark మరియు node metrics.

Spark metrics క్లస్టర్‌లో ప్రస్తుత workers సంఖ్య, లేదా executors; nodes ప్రాసెసింగ్ సమయంలో డేటాను మార్పిడి చేసుకునేటప్పుడు జరిగే shuffles; లేదా డేటా RAM నుండి disk కు మరియు disk నుండి RAM కు వెళ్ళినప్పుడు spills వంటి సమాచారం తీసుకువస్తాయి. ఈ metrics ను ఎక్స్‌పోజ్ చేయడానికి, Spark native Prometheus - version 3.0 నుండి అందుబాటులో - Databricks management console ద్వారా ఎనేబుల్ చేయాలి, మరియు `init_script` ద్వారా కాన్ఫిగర్ చేయాలి.

Disk usage, CPU time, memory, storage performance వంటి node metrics ట్రాక్ చేయడానికి, మేము `node_exporter` ను ఉపయోగిస్తాము, ఇది ఎటువంటి అదనపు configuration లేకుండా ఉపయోగించవచ్చు, కానీ ముఖ్యమైన metrics మాత్రమే ఎక్స్‌పోజ్ చేయాలి.

క్లస్టర్‌లోని ప్రతి node లో ADOT Collector ఇన్‌స్టాల్ చేయాలి, Spark మరియు `node_exporter` రెండింటి ద్వారా ఎక్స్‌పోజ్ చేయబడిన metrics ను scrape చేస్తూ, ఈ metrics ను ఫిల్టర్ చేస్తూ, `cluster_name` వంటి metadata ఇంజెక్ట్ చేస్తూ, మరియు ఈ metrics ను Prometheus workspace కు పంపుతుంది.

ADOT Collector మరియు `node_exporter` రెండూ `init_script` ద్వారా ఇన్‌స్టాల్ చేసి కాన్ఫిగర్ చేయాలి.

Databricks క్లస్టర్ Prometheus workspace లో metrics రాయడానికి అనుమతి ఉన్న IAM Role తో కాన్ఫిగర్ చేయాలి.

## బెస్ట్ ప్రాక్టీసెస్

### విలువైన metrics కు ప్రాధాన్యత ఇవ్వండి

Spark మరియు node_exporter రెండూ అనేక metrics మరియు అదే metrics కోసం అనేక formats ఎక్స్‌పోజ్ చేస్తాయి. మానిటరింగ్ మరియు incident response కోసం ఏ metrics ఉపయోగకరమో ఫిల్టర్ చేయకుండా, సమస్యలను గుర్తించడానికి సగటు సమయం పెరుగుతుంది, samples స్టోర్ చేయడానికి ఖర్చులు పెరుగుతాయి, విలువైన సమాచారం కనుగొనడం మరియు అర్థం చేసుకోవడం కష్టమవుతుంది. OpenTelemetry processors ఉపయోగించి, విలువైన metrics మాత్రమే ఫిల్టర్ చేసి ఉంచడం, లేదా అర్థం చేసుకోని metrics ను ఫిల్టర్ చేయడం సాధ్యం; AMP కు పంపే ముందు metrics ను aggregate చేసి calculate చేయడం సాధ్యం.

### అలర్టింగ్ fatigue ను నివారించండి

విలువైన metrics AMP లో ingest అవుతున్నప్పుడు, alerts కాన్ఫిగర్ చేయడం అవసరం. అయితే, ప్రతి resource usage burst పై alerting చేయడం alerting fatigue కు కారణం కావచ్చు, అంటే చాలా ఎక్కువ noise alerts severity లో నమ్మకాన్ని తగ్గిస్తుంది, మరియు ముఖ్యమైన events ను గుర్తించకుండా వదిలేస్తుంది. AMP alerting rules group feature ను ambiguity నివారించడానికి ఉపయోగించాలి, అంటే అనేక connected alerts వేర్వేరు notifications జనరేట్ చేయడం. అలాగే, alerts సరైన severity అందుకోవాలి, మరియు అది business priorities ను ప్రతిబింబించాలి.

### Amazon Managed Grafana dashboards ను పునర్వినియోగించండి

Amazon Managed Grafana Grafana native templating feature ను ఉపయోగిస్తుంది, ఇది అన్ని ఉన్న మరియు కొత్త Databricks clusters కోసం dashboards సృష్టించడానికి అనుమతిస్తుంది. ఇది ప్రతి cluster కోసం manually visualizations సృష్టించడం మరియు నిర్వహించడం అవసరాన్ని తొలగిస్తుంది. ఈ feature ఉపయోగించడానికి, ఈ metrics ను cluster వారీగా group చేయడానికి metrics లో సరైన labels ఉండటం ముఖ్యం. మరోసారి, OpenTelemetry processors తో ఇది సాధ్యం.

## రిఫరెన్సులు మరియు మరింత సమాచారం

- [Create Amazon Managed Service for Prometheus workspace](https://docs.aws.amazon.com/prometheus/latest/userguide/AMP-onboard-create-workspace.html)
- [Create Amazon Managed Grafana workspace](https://docs.aws.amazon.com/grafana/latest/userguide/Amazon-Managed-Grafana-create-workspace.html)
- [Configure Amazon Managed Service for Prometheus datasource](https://docs.aws.amazon.com/grafana/latest/userguide/prometheus-data-source.html)
- [Databricks Init Scripts](https://docs.databricks.com/clusters/init-scripts.html)

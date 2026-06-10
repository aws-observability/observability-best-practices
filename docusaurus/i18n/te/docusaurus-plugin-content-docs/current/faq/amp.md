# Amazon Managed Service for Prometheus - FAQ

## ప్రస్తుతం ఏ AWS రీజియన్‌లు మద్దతిస్తున్నాయి మరియు ఇతర రీజియన్‌ల నుండి మెట్రిక్స్ సేకరించడం సాధ్యమా?

మేము మద్దతిచ్చే రీజియన్‌ల నవీకరించబడిన జాబితా కోసం మా [డాక్యుమెంటేషన్](https://docs.aws.amazon.com/prometheus/latest/userguide/what-is-Amazon-Managed-Service-Prometheus.html) చూడండి. మేము మా ఇప్పటికే ఉన్న Product Feature Requests (PFRs) ను బాగా ప్రాధాన్యత ఇవ్వగలిగేలా మీకు ఏ రీజియన్‌లు కావాలో దయచేసి మాకు తెలియజేయండి. మీరు ఎల్లప్పుడూ ఏ రీజియన్‌ల నుండి అయినా డేటాను సేకరించి, మేము మద్దతిచ్చే నిర్దిష్ట రీజియన్‌కు పంపవచ్చు. మరిన్ని వివరాల కోసం ఈ బ్లాగ్ చూడండి: [Amazon Managed Service for Prometheus కోసం క్రాస్-రీజియన్ మెట్రిక్స్ సేకరణ](https://aws.amazon.com/blogs/opensource/set-up-cross-region-metrics-collection-for-amazon-managed-service-for-prometheus-workspaces/).

## Cost Explorer లేదా [CloudWatch లో AWS బిల్లింగ్ చార్జీలుగా](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/gs_monitor_estimated_charges_with_cloudwatch.html) మీటరింగ్ మరియు/లేదా బిల్లింగ్ చూడటానికి ఎంత సమయం పడుతుంది?

మేము ప్రతి 2 గంటలకు S3 కు అప్‌లోడ్ చేయబడిన వెంటనే ఇంజెస్ట్ చేయబడిన మెట్రిక్ శాంపిల్స్ బ్లాక్‌లను మీటర్ చేస్తాము. Amazon Managed Service for Prometheus కోసం మీటరింగ్ మరియు చార్జీలు రిపోర్ట్ చేయబడటానికి 3 గంటల వరకు పట్టవచ్చు.

## Prometheus సేవ క్లస్టర్ (EKS/ECS) నుండి మాత్రమే మెట్రిక్స్ స్క్రేప్ చేయగలదా?

ఇతర కంప్యూట్ ఎన్విరాన్‌మెంట్‌ల కోసం డాక్యుమెంటేషన్ లేకపోవడానికి మేము క్షమాపణ చెబుతున్నాము. మీరు Prometheus server ని ఇన్‌స్టాల్ చేయగలిగే ఏ కంప్యూట్ ఎన్విరాన్‌మెంట్‌ల నుండి అయినా [EC2 నుండి Prometheus మెట్రిక్స్ స్క్రేప్ చేయడానికి](https://aws.amazon.com/blogs/opensource/using-amazon-managed-service-for-prometheus-to-monitor-ec2-environments/) Prometheus server ను ఉపయోగించవచ్చు, remote write కాన్ఫిగర్ చేసి [AWS SigV4 proxy](https://github.com/awslabs/aws-sigv4-proxy) సెటప్ చేసినంత వరకు. [EC2 బ్లాగ్](https://aws.amazon.com/blogs/opensource/using-amazon-managed-service-for-prometheus-to-monitor-ec2-environments/) కు లింక్‌లో "Running aws-sigv4-proxy" అనే విభాగం ఉంది, ఇది దాన్ని ఎలా రన్ చేయాలో చూపిస్తుంది. ఇతర కంప్యూట్ ఎన్విరాన్‌మెంట్‌లలో AWS SigV4 ను ఎలా రన్ చేయాలో మా కస్టమర్లకు సరళీకరించడానికి మరిన్ని డాక్యుమెంటేషన్ జోడించాలి.

## Amazon Managed Service for Prometheus ను Grafana కు ఎలా కనెక్ట్ చేయాలి? ఏదైనా డాక్యుమెంటేషన్ ఉందా?

మేము PromQL ఉపయోగించి Amazon Managed Service for Prometheus ను క్వెరీ చేయడానికి Grafana లో అందుబాటులో ఉన్న డిఫాల్ట్ [Prometheus డేటా సోర్స్](https://grafana.com/docs/grafana/latest/datasources/prometheus/) ను ఉపయోగిస్తాము. ప్రారంభించడానికి మీకు సహాయపడే కొన్ని డాక్యుమెంటేషన్ మరియు బ్లాగ్ ఇక్కడ ఉన్నాయి:
1. [సేవ డాక్యుమెంటేషన్](https://docs.aws.amazon.com/prometheus/latest/userguide/AMP-onboard-query.html)
1. [EC2 పై Grafana సెటప్](https://aws.amazon.com/blogs/opensource/setting-up-grafana-on-ec2-to-query-metrics-from-amazon-managed-service-for-prometheus/)

## Amazon Managed Service for Prometheus కు పంపే శాంపిల్స్ సంఖ్యను తగ్గించడానికి ఉత్తమ పద్ధతులు ఏమిటి?

Amazon Managed Service for Prometheus లోకి ఇంజెస్ట్ చేయబడే శాంపిల్స్ సంఖ్యను తగ్గించడానికి, కస్టమర్లు తమ scrape interval ను పెంచవచ్చు (ఉదా., 30s నుండి 1min కు మార్చడం) లేదా వారు స్క్రేప్ చేస్తున్న సిరీస్ సంఖ్యను తగ్గించవచ్చు. సిరీస్ సంఖ్యను తగ్గించడం కంటే scrape interval ని మార్చడం శాంపిల్స్ సంఖ్యపై మరింత నాటకీయ ప్రభావాన్ని కలిగి ఉంటుంది, scrape interval ను రెట్టింపు చేయడం వల్ల ఇంజెస్ట్ చేయబడిన శాంపిల్స్ వాల్యూమ్ సగానికి తగ్గుతుంది.

## CloudWatch మెట్రిక్స్ ను Amazon Managed Service for Prometheus కు ఎలా పంపగలను?

[CloudWatch మెట్రిక్స్ ను Amazon Managed Service for Prometheus కు పంపడానికి CloudWatch metric streams ను ఉపయోగించమని](https://aws-observability.github.io/observability-best-practices/recipes/recipes/lambda-cw-metrics-go-amp/) మేము సిఫార్సు చేస్తున్నాము. ఈ ఇంటిగ్రేషన్ యొక్క కొన్ని సాధ్య లోపాలు,
1. Amazon Managed Service for Prometheus APIs ను కాల్ చేయడానికి Lambda ఫంక్షన్ అవసరం,
1. Amazon Managed Service for Prometheus లోకి ఇంజెస్ట్ చేయడానికి ముందు CloudWatch మెట్రిక్స్ ను మెటాడేటా (ఉదా., AWS tags) తో సమృద్ధి చేయగల సామర్థ్యం లేదు,
1. మెట్రిక్స్ namespace ద్వారా మాత్రమే ఫిల్టర్ చేయగలవు (తగినంత గ్రాన్యులర్ కాదు). ప్రత్యామ్నాయంగా, CloudWatch మెట్రిక్స్ డేటాను Amazon Managed Service for Prometheus కు పంపడానికి కస్టమర్లు Prometheus Exporters ను ఉపయోగించవచ్చు: (1) CloudWatch Exporter: CW ListMetrics మరియు GetMetricStatistics (GMS) APIs ను ఉపయోగించే Java ఆధారిత స్క్రేపింగ్.

[**Yet Another CloudWatch Exporter (YACE)**](https://github.com/nerdswords/yet-another-cloudwatch-exporter) CloudWatch నుండి Amazon Managed Service for Prometheus లోకి మెట్రిక్స్ పొందడానికి మరొక ఎంపిక. ఇది CW ListMetrics, GetMetricData (GMD), మరియు GetMetricStatistics (GMS) APIs ను ఉపయోగించే Go ఆధారిత టూల్. దీన్ని ఉపయోగించడంలో కొన్ని ప్రతికూలతలు ఉండవచ్చు - మీరు ఏజెంట్‌ను డిప్లాయ్ చేయాలి మరియు జీవిత-చక్రాన్ని మీరే నిర్వహించాలి, ఇది ఆలోచనపూర్వకంగా చేయాలి.

## Amazon Managed Service for Prometheus ఏ Prometheus వెర్షన్‌తో అనుకూలం?

Amazon Managed Service for Prometheus [Prometheus 2.x](https://github.com/prometheus/prometheus/blob/main/RELEASE.md) తో అనుకూలం. Amazon Managed Service for Prometheus దాని డేటా ప్లేన్‌గా ఓపెన్ సోర్స్ [CNCF Cortex ప్రాజెక్ట్](https://cortexmetrics.io/) పై ఆధారపడి ఉంటుంది. Cortex Prometheus తో 100% API అనుకూలంగా (/prometheus/* మరియు /api/prom/* కింద) ఉండటానికి ప్రయత్నిస్తుంది. Amazon Managed Service for Prometheus Prometheus-అనుకూల PromQL క్వెరీలు మరియు Remote write మెట్రిక్ ఇంజెషన్ మరియు Gauge, Counters, Summary, మరియు Histogram తో సహా ఇప్పటికే ఉన్న మెట్రిక్ రకాల కోసం Prometheus డేటా మోడల్‌ను మద్దతిస్తుంది. మేము ప్రస్తుతం [అన్ని Cortex APIs](https://cortexmetrics.io/docs/api/) ను ఎక్స్‌పోజ్ చేయము. మేము మద్దతిచ్చే అనుకూల APIs జాబితాను [ఇక్కడ చూడవచ్చు](https://docs.aws.amazon.com/prometheus/latest/userguide/AMP-APIReference.html). Amazon Managed Service for Prometheus నుండి ఏవైనా ఫీచర్లు అవసరమైతే కస్టమర్లు తమ అకౌంట్ టీమ్‌తో కలిసి కొత్త Product Features Requests (PFRs) తెరవడానికి లేదా ఇప్పటికే ఉన్న వాటిని ప్రభావితం చేయడానికి పని చేయవచ్చు.

## Amazon Managed Service for Prometheus లోకి మెట్రిక్స్ ఇంజెస్ట్ చేయడానికి మీరు ఏ కలెక్టర్‌ను సిఫార్సు చేస్తారు? నేను Agent mode లో Prometheus ను ఉపయోగించాలా?

మేము Prometheus servers ను agent mode తో సహా, OpenTelemetry agent, మరియు AWS Distro for OpenTelemetry agent ను కస్టమర్లు Amazon Managed Service for Prometheus కు మెట్రిక్స్ డేటా పంపడానికి ఉపయోగించగల ఏజెంట్‌లుగా మద్దతిస్తాము. AWS Distro for OpenTelemetry అనేది AWS ద్వారా ప్యాకేజ్ చేయబడిన మరియు సురక్షితం చేయబడిన OpenTelemetry ప్రాజెక్ట్ యొక్క downstream డిస్ట్రిబ్యూషన్. మూడింటిలో ఏదైనా బాగానే ఉంటుంది, మరియు మీ వ్యక్తిగత టీమ్ అవసరాలు మరియు ప్రాధాన్యతలకు బాగా సరిపోయేదాన్ని ఎంచుకోవచ్చు.

## Amazon Managed Service for Prometheus పనితీరు వర్క్‌స్పేస్ పరిమాణంతో ఎలా స్కేల్ అవుతుంది?

ప్రస్తుతం, Amazon Managed Service for Prometheus ఒక వర్క్‌స్పేస్‌లో 200M వరకు యాక్టివ్ టైమ్ సిరీస్‌లను మద్దతిస్తుంది. మేము కొత్త గరిష్ట పరిమితిని ప్రకటించినప్పుడు, ఇంజెస్ట్ మరియు క్వెరీ అంతటా సేవ యొక్క పనితీరు మరియు విశ్వసనీయత లక్షణాలు కొనసాగించబడుతున్నాయని మేము నిర్ధారిస్తున్నాము. వర్క్‌స్పేస్‌లో యాక్టివ్ సిరీస్ సంఖ్యతో సంబంధం లేకుండా అదే పరిమాణ డేటాసెట్ అంతటా క్వెరీలు పనితీరు క్షీణతను చూడకూడదు.

**ఉత్పత్తి FAQ:** [https://aws.amazon.com/prometheus/faqs/](https://aws.amazon.com/prometheus/faqs/)

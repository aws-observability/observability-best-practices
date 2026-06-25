# Amazon CloudWatch - FAQ

## నేను Amazon CloudWatch ను ఎందుకు ఎంచుకోవాలి?

Amazon CloudWatch అనేది AWS క్లౌడ్ నేటివ్ సేవ, ఇది AWS క్లౌడ్ వనరులు మరియు మీరు AWS లో రన్ చేసే అప్లికేషన్‌లను మానిటర్ చేయడానికి ఒకే ప్లాట్‌ఫారమ్‌లో ఏకీకృత observability ను అందిస్తుంది. Amazon CloudWatch [logs](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/WhatIsCloudWatchLogs.html) రూపంలో మానిటరింగ్ మరియు ఆపరేషనల్ డేటాను సేకరించడానికి, [metrics](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/working_with_metrics.html), [events](https://docs.aws.amazon.com/AmazonCloudWatch/latest/events/WhatIsCloudWatchEvents.html) ట్రాక్ చేయడానికి మరియు [alarms](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/AlarmThatSendsEmail.html) సెట్ చేయడానికి ఉపయోగించవచ్చు. ఇది AWS వనరులు, అప్లికేషన్‌లు మరియు AWS మరియు [on-premises servers](https://aws.amazon.com/blogs/mt/how-to-monitor-hybrid-environment-with-aws-services/) లో రన్ అయ్యే సేవల [unified view](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch_Dashboards.html) ను కూడా అందిస్తుంది. Amazon CloudWatch వనరుల వినియోగం, అప్లికేషన్ పనితీరు మరియు మీ వర్క్‌లోడ్‌ల ఆపరేషనల్ ఆరోగ్యంపై సిస్టమ్-వైడ్ దృశ్యమానత పొందడానికి సహాయం చేస్తుంది. Amazon CloudWatch AWS, హైబ్రిడ్ మరియు ఆన్-ప్రెమిసెస్ అప్లికేషన్‌లు మరియు మౌలిక సదుపాయాల వనరుల కోసం [actionable insights](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-Insights-Sections.html) అందిస్తుంది. [Cross-account observability](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-Unified-Cross-Account.html) CloudWatch యొక్క ఏకీకృత observability సామర్థ్యానికి అదనపు.

## ఏ AWS సేవలు Amazon CloudWatch మరియు Amazon CloudWatch Logs తో నేటివ్‌గా ఏకీకృతమై ఉన్నాయి?

Amazon CloudWatch 70+ కంటే ఎక్కువ AWS సేవలతో నేటివ్‌గా ఏకీకృతమవుతుంది, ఎటువంటి చర్య అవసరం లేకుండా సరళీకృత మానిటరింగ్ మరియు స్కేలబిలిటీ కోసం మౌలిక సదుపాయాల మెట్రిక్స్‌ను సేకరించడానికి కస్టమర్‌లను అనుమతిస్తుంది. [CloudWatch metrics పబ్లిష్ చేసే AWS సేవల](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/aws-services-cloudwatch-metrics.html) పూర్తి జాబితా కోసం దయచేసి డాక్యుమెంటేషన్ తనిఖీ చేయండి. ప్రస్తుతం, 30 కంటే ఎక్కువ AWS సేవలు CloudWatch కు లాగ్‌లు పబ్లిష్ చేస్తాయి. [CloudWatch Logs కు లాగ్‌లు పబ్లిష్ చేసే AWS సేవల](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/aws-services-sending-logs.html) పూర్తి జాబితా కోసం దయచేసి డాక్యుమెంటేషన్ తనిఖీ చేయండి.

## అన్ని AWS సేవల నుండి Amazon CloudWatch కు పబ్లిష్ చేయబడిన అన్ని మెట్రిక్స్ జాబితా ఎక్కడ పొందవచ్చు?

Amazon CloudWatch కు [metrics పబ్లిష్ చేసే అన్ని AWS సేవల](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/aws-services-cloudwatch-metrics.html) జాబితా AWS డాక్యుమెంటేషన్‌లో ఉంది.

## Amazon CloudWatch కు మెట్రిక్స్ సేకరించడం & మానిటర్ చేయడం ఎక్కడ ప్రారంభించాలి?

[Amazon CloudWatch మెట్రిక్స్‌ను సేకరిస్తుంది](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/working_with_metrics.html) వివిధ AWS సేవల నుండి, వీటిని [AWS Management Console, AWS CLI లేదా API](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/viewing_metrics_with_cloudwatch.html) ద్వారా చూడవచ్చు. Amazon CloudWatch Amazon EC2 ఇన్‌స్టాన్స్‌ల కోసం [అందుబాటులో ఉన్న మెట్రిక్స్‌ను](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/viewing_metrics_with_cloudwatch.html) సేకరిస్తుంది. అదనపు కస్టమ్ మెట్రిక్స్ కోసం కస్టమర్‌లు ఏకీకృత CloudWatch ఏజెంట్‌ను సేకరించడానికి మరియు మానిటర్ చేయడానికి ఉపయోగించవచ్చు.

> సంబంధిత AWS Observability Workshop: [Metrics](https://catalog.workshops.aws/observability/en-US/aws-native/metrics)

## నా Amazon EC2 ఇన్‌స్టాన్స్‌కు చాలా గ్రాన్యులర్ స్థాయి మానిటరింగ్ అవసరం, నేను ఏమి చేయాలి?

డిఫాల్ట్‌గా, Amazon EC2 ఇన్‌స్టాన్స్ కోసం Basic Monitoring గా 5-నిమిషాల కాలాల్లో CloudWatch కు మెట్రిక్ డేటాను పంపుతుంది. మీ ఇన్‌స్టాన్స్ కోసం 1-నిమిషం కాలాల్లో CloudWatch కు మెట్రిక్ డేటా పంపడానికి, ఇన్‌స్టాన్స్‌లో [detailed monitoring](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/using-cloudwatch-new.html) ఎనేబుల్ చేయవచ్చు.

## నా అప్లికేషన్ కోసం సొంత మెట్రిక్స్ పబ్లిష్ చేయాలనుకుంటున్నాను. ఏదైనా ఆప్షన్ ఉందా?

కస్టమర్‌లు API లేదా CLI ద్వారా 1 నిమిషం గ్రాన్యులారిటీ యొక్క స్టాండర్డ్ రిజల్యూషన్ లేదా 1 సెకను ఇంటర్వల్ వరకు హై రిజల్యూషన్ గ్రాన్యులారిటీతో తమ సొంత [custom metrics](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/publishingMetrics.html) ను CloudWatch కు పబ్లిష్ చేయగలరు.

CloudWatch ఏజెంట్ EC2 ఇన్‌స్టాన్స్‌ల నుండి కస్టమ్ మెట్రిక్స్‌ను సేకరించడానికి ప్రత్యేక దృశ్యాలలో కూడా సపోర్ట్ చేస్తుంది, అవి Elastic Network Adapter (ENA) ఉపయోగించే Linux లో నడుస్తున్న EC2 ఇన్‌స్టాన్స్‌ల కోసం [Network performance metrics](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-Agent-network-performance.html), Linux సర్వర్‌ల నుండి [NVIDIA GPU metrics](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-Agent-NVIDIA-GPU.html) మరియు Linux & Windows సర్వర్‌లలో [individual processes](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-Agent-procstat-process-metrics.html) నుండి procstat plugin ఉపయోగించి Process metrics.

> సంబంధిత AWS Observability Workshop: [Public custom metrics](https://catalog.workshops.aws/observability/en-US/aws-native/metrics/publishmetrics)

## Amazon CloudWatch ఏజెంట్ ద్వారా కస్టమ్ మెట్రిక్స్ సేకరించడానికి ఇంకా ఏ సపోర్ట్ అందుబాటులో ఉంది?

అప్లికేషన్‌లు లేదా సేవల నుండి కస్టమ్ మెట్రిక్స్‌ను [StatsD](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-Agent-custom-metrics-statsd.html) లేదా [collectd](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-Agent-custom-metrics-collectd.html) ప్రోటోకాల్‌ల సపోర్ట్‌తో ఏకీకృత CloudWatch ఏజెంట్ ఉపయోగించి పొందవచ్చు. StatsD అనేది విస్తృత వైవిధ్యమైన అప్లికేషన్‌ల నుండి మెట్రిక్స్‌ను సేకరించగల ప్రముఖ ఓపెన్-సోర్స్ సొల్యూషన్. StatsD ప్రత్యేకంగా సొంత మెట్రిక్స్ ఇన్‌స్ట్రుమెంట్ చేయడానికి ఉపయోగకరం, ఇది Linux మరియు Windows ఆధారిత సర్వర్‌లు రెండింటినీ సపోర్ట్ చేస్తుంది. collectd ప్రోటోకాల్ Linux సర్వర్‌లలో మాత్రమే సపోర్ట్ చేయబడే ప్రముఖ ఓపెన్-సోర్స్ సొల్యూషన్, దీనిలో విస్తృత వైవిధ్యమైన అప్లికేషన్‌ల కోసం సిస్టమ్ స్టాటిస్టిక్స్ సేకరించగల ప్లగిన్‌లు ఉన్నాయి.

## నా వర్క్‌లోడ్‌లో చాలా ఎఫెమెరల్ వనరులు ఉన్నాయి మరియు అధిక-కార్డినాలిటీలో లాగ్‌లను ఉత్పత్తి చేస్తుంది, మెట్రిక్స్ మరియు లాగ్‌లను సేకరించి కొలవడానికి సిఫార్సు చేయబడిన విధానం ఏమిటి?

[CloudWatch embedded metric format](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch_Embedded_Metric_Format.html) Lambda ఫంక్షన్‌లు మరియు కంటైనర్‌లు వంటి ఎఫెమెరల్ వనరుల నుండి లాగ్‌ల రూపంలో సంక్లిష్ట అధిక-కార్డినాలిటీ అప్లికేషన్ డేటాను ఇంజెస్ట్ చేయడానికి మరియు చర్య తీసుకోగల మెట్రిక్స్‌ను ఉత్పత్తి చేయడానికి కస్టమర్‌లను అనుమతిస్తుంది.

> సంబంధిత AWS Observability Workshop: [Embedded Metric Format](https://catalog.workshops.aws/observability/en-US/aws-native/metrics/emf)

## Amazon CloudWatch కు లాగ్‌లు సేకరించడం & మానిటర్ చేయడం ఎక్కడ ప్రారంభించాలి?

[Amazon CloudWatch Logs](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/WhatIsCloudWatchLogs.html) ప్రస్తుత సిస్టమ్, అప్లికేషన్ మరియు కస్టమ్ లాగ్ ఫైల్‌లను ఉపయోగించి దాదాపు రియల్ టైమ్‌లో సిస్టమ్‌లు మరియు అప్లికేషన్‌లను మానిటర్ చేయడానికి మరియు ట్రబుల్‌షూట్ చేయడానికి కస్టమర్‌లకు సహాయం చేస్తుంది. CloudWatch కు [Amazon EC2 ఇన్‌స్టాన్స్‌లు మరియు ఆన్-ప్రెమిస్ సర్వర్‌ల నుండి లాగ్‌లను](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Install-CloudWatch-Agent.html) సేకరించడానికి కస్టమర్‌లు [ఏకీకృత CloudWatch Agent](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/CWL_GettingStarted.html) ను ఇన్‌స్టాల్ చేయగలరు.

> సంబంధిత AWS Observability Workshop: [Log Insights](https://catalog.workshops.aws/observability/en-US/aws-native/logs/logsinsights)

## CloudWatch ఏజెంట్ అంటే ఏమిటి మరియు నేను దానిని ఎందుకు ఉపయోగించాలి?

[Unified CloudWatch Agent](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Install-CloudWatch-Agent.html) అనేది MIT లైసెన్స్ కింద x86-64 మరియు ARM64 ఆర్కిటెక్చర్‌లను ఉపయోగించే చాలా ఆపరేటింగ్ సిస్టమ్‌లకు సపోర్ట్ చేసే ఓపెన్-సోర్స్ సాఫ్ట్‌వేర్. CloudWatch Agent హైబ్రిడ్ ఎన్విరాన్‌మెంట్‌లో ఆపరేటింగ్ సిస్టమ్‌ల మధ్య Amazon EC2 ఇన్‌స్టాన్స్‌లు & ఆన్-ప్రెమిస్ సర్వర్‌ల నుండి సిస్టమ్-స్థాయి మెట్రిక్స్‌ను సేకరించడానికి, అప్లికేషన్‌లు లేదా సేవల నుండి కస్టమ్ మెట్రిక్స్‌ను పొందడానికి మరియు Amazon EC2 ఇన్‌స్టాన్స్‌లు మరియు ఆన్-ప్రెమిసెస్ సర్వర్‌ల నుండి లాగ్‌లను సేకరించడానికి సహాయం చేస్తుంది.

## మా సంస్థకు బహుళ రీజియన్‌లలో బహుళ AWS ఖాతాలు ఉన్నాయి, Amazon CloudWatch ఈ సందర్భాలకు పనిచేస్తుందా?

Amazon CloudWatch [cross-account observability](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-Unified-Cross-Account.html) అందిస్తుంది, ఇది ఒక రీజియన్‌లో బహుళ ఖాతాలను span చేసే వనరులు మరియు అప్లికేషన్‌ల ఆరోగ్యాన్ని మానిటర్ చేయడానికి మరియు ట్రబుల్‌షూట్ చేయడానికి కస్టమర్‌లకు సహాయం చేస్తుంది. Amazon CloudWatch [cross-account, cross-region dashboard](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Cross-Account-Cross-Region.html) ను కూడా అందిస్తుంది.

## Amazon CloudWatch కోసం ఏ రకమైన ఆటోమేషన్ సపోర్ట్ అందుబాటులో ఉంది?

AWS Management Console ద్వారా Amazon CloudWatch ను యాక్సెస్ చేయడంతో పాటు కస్టమర్‌లు API, [AWS command-line interface (CLI)](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html) మరియు [AWS SDKs](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/sdk-general-information-section.html) ద్వారా కూడా సేవను యాక్సెస్ చేయగలరు. [CloudWatch API](https://docs.aws.amazon.com/AmazonCloudWatch/latest/APIReference/Welcome.html) మెట్రిక్స్ & డాష్‌బోర్డ్‌ల కోసం [AWS CLI](https://docs.aws.amazon.com/AmazonCloudWatch/latest/cli/Welcome.html) ద్వారా ఆటోమేట్ చేయడంలో లేదా సాఫ్ట్‌వేర్/ఉత్పత్తులతో ఏకీకరించడంలో సహాయం చేస్తుంది.

## నేను వనరులను త్వరగా మానిటర్ చేయడం ప్రారంభించాలనుకుంటున్నాను, సిఫార్సు చేయబడిన విధానం ఏమిటి?

CloudWatch లో Automatic Dashboards అన్ని AWS పబ్లిక్ రీజియన్‌లలో అందుబాటులో ఉన్నాయి, ఇవి అన్ని AWS వనరుల ఆరోగ్యం మరియు పనితీరు యొక్క అగ్రిగేటెడ్ వ్యూను అందిస్తాయి. [Automatic Dashboards](https://docs.aws.amazon.com/prescriptive-guidance/latest/implementing-logging-monitoring-cloudwatch/cloudwatch-dashboards-visualizations.html) AWS సర్వీస్ సిఫార్సు చేయబడిన ఉత్తమ పద్ధతులతో ముందుగా నిర్మించబడి, వనరులను గుర్తించగలవు, మరియు ముఖ్యమైన పనితీరు మెట్రిక్స్ యొక్క తాజా స్థితిని ప్రతిబింబించడానికి డైనమిక్‌గా అప్‌డేట్ అవుతాయి.

సంబంధిత AWS Observability Workshop: [Automatic Dashboards](https://catalog.workshops.aws/observability/en-US/aws-native/dashboards/autogen-dashboard)

## నేను CloudWatch లో ఏమి మానిటర్ చేయాలనుకుంటున్నానో అనుకూలీకరించాలనుకుంటున్నాను, సిఫార్సు చేయబడిన విధానం ఏమిటి?

[Custom Dashboard](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/create_dashboard.html) తో కస్టమర్‌లు కావలసినన్ని అదనపు డాష్‌బోర్డ్‌లను వివిధ విడ్జెట్‌లతో సృష్టించి తదనుగుణంగా అనుకూలీకరించవచ్చు.

సంబంధిత AWS Observability Workshop: [Dashboarding](https://catalog.workshops.aws/observability/en-US/aws-native/ec2-monitoring/dashboarding)

## నేను కొన్ని కస్టమ్ డాష్‌బోర్డ్‌లు నిర్మించాను, వాటిని భాగస్వామ్యం చేయడానికి మార్గం ఉందా?

అవును, [CloudWatch dashboards భాగస్వామ్యం](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/cloudwatch-dashboard-sharing.html) సాధ్యం. మూడు మార్గాలు ఉన్నాయి. లింక్‌కు యాక్సెస్ ఉన్న ఎవరైనా డాష్‌బోర్డ్ చూడడానికి అనుమతించి ఒకే డాష్‌బోర్డ్‌ను పబ్లిక్‌గా భాగస్వామ్యం చేయడం. డాష్‌బోర్డ్ చూడడానికి అనుమతించబడిన వ్యక్తుల ఈమెయిల్ చిరునామాలను నిర్దేశించి ఒకే డాష్‌బోర్డ్‌ను ప్రైవేట్‌గా భాగస్వామ్యం చేయడం. డాష్‌బోర్డ్ యాక్సెస్ కోసం థర్డ్-పార్టీ single sign-on (SSO) ప్రొవైడర్‌ను నిర్దేశించి ఖాతాలోని అన్ని CloudWatch డాష్‌బోర్డ్‌లను భాగస్వామ్యం చేయడం.

> సంబంధిత AWS Observability Workshop: [Sharing CloudWatch Dashboards](https://catalog.workshops.aws/observability/en-US/aws-native/dashboards/sharingdashboard)

## మరింత సమాచారం ఎక్కడ అందుబాటులో ఉంది?

అదనపు సమాచారం కోసం కస్టమర్‌లు [CloudWatch](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/WhatIsCloudWatch.html), [CloudWatch Events](https://docs.aws.amazon.com/AmazonCloudWatch/latest/events/WhatIsCloudWatchEvents.html) మరియు [CloudWatch Logs](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/WhatIsCloudWatchLogs.html) కోసం AWS డాక్యుమెంటేషన్ చదవగలరు, [AWS Native Observability](https://catalog.workshops.aws/observability/en-US/aws-native) పై AWS Observability Workshop చూడగలరు మరియు [features](https://aws.amazon.com/cloudwatch/features/) మరియు [pricing](https://aws.amazon.com/cloudwatch/pricing/) వివరాలు తెలుసుకోవడానికి [product page](https://aws.amazon.com/cloudwatch/) తనిఖీ చేయగలరు.

**Product FAQ:** [https://aws.amazon.com/cloudwatch/faqs/](https://aws.amazon.com/cloudwatch/faqs/)

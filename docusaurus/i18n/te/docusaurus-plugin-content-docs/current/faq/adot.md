# AWS Distro for Open Telemetry (ADOT) - FAQ

## ADOT కలెక్టర్‌ను AMP లోకి మెట్రిక్స్ ఇంజెస్ట్ చేయడానికి ఉపయోగించవచ్చా?

అవును, ఈ ఫంక్షనాలిటీ మే 2022 లో మెట్రిక్స్ సపోర్ట్ కోసం GA లాంచ్‌తో ప్రవేశపెట్టబడింది మరియు మీరు EC2 నుండి, మా EKS add-on ద్వారా, మా ECS side-car ఇంటిగ్రేషన్ ద్వారా, మరియు/లేదా మా Lambda layers ద్వారా ADOT కలెక్టర్‌ను ఉపయోగించవచ్చు.

## ADOT కలెక్టర్‌ను లాగ్‌లు సేకరించి Amazon CloudWatch లేదా Amazon OpenSearch లోకి ఇంజెస్ట్ చేయడానికి ఉపయోగించవచ్చా?

అవును. [లాగ్ సపోర్ట్](https://aws.amazon.com/about-aws/whats-new/2023/11/logs-support-aws-distro-opentelemetry/) నవంబర్ 22, 2023 నుండి అందుబాటులో ఉంది. మీరు మరిన్ని వివరాల కోసం [Logging Exporter](https://aws-otel.github.io/docs/components/misc-exporters) పేజీని చూడవచ్చు.

## ADOT కలెక్టర్ యొక్క రిసోర్స్ వినియోగం మరియు పనితీరు వివరాలు ఎక్కడ చూడగలను?

మేము కలెక్టర్‌లను విడుదల చేసినప్పుడు అప్‌డేట్ చేసే ఒక [పనితీరు నివేదిక](https://aws-observability.github.io/aws-otel-collector/benchmark/report) ఆన్‌లైన్‌లో ఉంది.

## ADOT ను Apache Kafka తో ఉపయోగించడం సాధ్యమా?

అవును, Kafka exporter మరియు receiver కోసం సపోర్ట్ ADOT కలెక్టర్ v0.28.0 లో జోడించబడింది. మరిన్ని వివరాల కోసం, దయచేసి [ADOT కలెక్టర్ డాక్యుమెంటేషన్](https://aws-otel.github.io/docs/components/kafka-receiver-exporter) చూడండి.
.
## ADOT కలెక్టర్‌ను ఎలా కాన్ఫిగర్ చేయాలి?

ADOT కలెక్టర్ స్థానికంగా నిల్వ చేయబడిన YAML కాన్ఫిగరేషన్ ఫైల్‌లను ఉపయోగించి కాన్ఫిగర్ చేయబడుతుంది. దాని అదనంగా, S3 బకెట్‌ల వంటి ఇతర స్థానాలలో నిల్వ చేయబడిన కాన్ఫిగరేషన్‌ను ఉపయోగించడం సాధ్యం. ADOT కలెక్టర్‌ను కాన్ఫిగర్ చేయడానికి మద్దతిచ్చే అన్ని మెకానిజమ్‌లు [ADOT కలెక్టర్ డాక్యుమెంటేషన్](https://aws-otel.github.io/docs/components/confmap-providers) లో వివరంగా వివరించబడ్డాయి.

## ADOT కలెక్టర్‌లో అడ్వాన్స్డ్ శాంప్లింగ్ చేయగలనా?

అవును. [అడ్వాన్స్డ్ శాంప్లింగ్](https://aws.amazon.com/about-aws/whats-new/2023/05/aws-distro-opentelemetry-advanced-sampling/) మే 15, 2023 న విడుదల చేయబడింది. మరిన్ని వివరాల కోసం [AWS Distro for OpenTelemetry తో అడ్వాన్స్డ్ శాంప్లింగ్ ప్రారంభించడం](https://aws-otel.github.io/docs/getting-started/advanced-sampling) పేజీని చూడండి.

## ADOT కలెక్టర్‌ను స్కేల్ చేయడానికి ఏవైనా చిట్కాలు ఉన్నాయా?

అవును! [కలెక్టర్‌ను స్కేలింగ్ చేయడం](https://opentelemetry.io/docs/collector/scaling/) గురించి upstream OpenTelemetry డాక్యుమెంటేషన్ చూడండి.

## నాకు ADOT కలెక్టర్ల ఫ్లీట్ ఉంది, వాటిని ఎలా నిర్వహించగలను?

ఇది సక్రియ అభివృద్ధి ప్రాంతం మరియు 2023 లో పరిణతి చెందుతుందని మేము ఆశిస్తున్నాము, మరిన్ని వివరాల కోసం [నిర్వహణ](https://opentelemetry.io/docs/collector/management/) గురించి upstream OpenTelemetry డాక్యుమెంటేషన్ చూడండి, ప్రత్యేకంగా [Open Agent Management Protocol (OpAMP)](https://opentelemetry.io/docs/collector/management/#opamp) గురించి.

## ADOT కలెక్టర్ యొక్క ఆరోగ్యం మరియు పనితీరును ఎలా పర్యవేక్షించాలి?

1. [కలెక్టర్‌ను పర్యవేక్షించడం](https://github.com/open-telemetry/opentelemetry-collector/blob/main/docs/observability.md) - Prometheus receiver ద్వారా స్క్రేప్ చేయగల పోర్ట్ 8080 లో ఎక్స్‌పోజ్ చేయబడిన డిఫాల్ట్ మెట్రిక్స్
2. [Node Exporter](https://prometheus.io/docs/guides/node-exporter/) ఉపయోగించడం, node exporter రన్ చేయడం వల్ల కలెక్టర్ రన్ అవుతున్న నోడ్, పాడ్, మరియు ఆపరేటింగ్ సిస్టమ్ గురించి అనేక పనితీరు మరియు ఆరోగ్య మెట్రిక్స్ కూడా అందిస్తుంది.
3. [Kube-state-metrics (KSM)](https://github.com/kubernetes/kube-state-metrics), KSM కలెక్టర్ గురించి ఆసక్తికరమైన ఈవెంట్‌లను కూడా ఉత్పత్తి చేయగలదు.
4. [Prometheus `up` మెట్రిక్](https://github.com/open-telemetry/opentelemetry-collector/pull/2918)
5. ప్రారంభించడానికి ఒక సాధారణ Grafana డాష్‌బోర్డ్: [https://grafana.com/grafana/dashboards/12553](https://grafana.com/grafana/dashboards/12553)

**ఉత్పత్తి FAQ:** [https://aws.amazon.com/otel/faqs/](https://aws.amazon.com/otel/faqs/)

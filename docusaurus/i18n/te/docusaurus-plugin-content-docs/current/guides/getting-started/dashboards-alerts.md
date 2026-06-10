---
sidebar_position: 4
---

# డాష్‌బోర్డ్‌లు మరియు అలర్ట్‌లు

మీ telemetry flow అవుతున్నప్పుడు, మీ use case కు సంబంధించిన డాష్‌బోర్డ్‌లు మరియు alerts ను set up చేయవచ్చు.

## Curated డాష్‌బోర్డ్‌లు

CloudWatch console యొక్క వివిధ భాగాల క్రింద మీరు కనుగొనగల curated dashboards ను leverage చేయండి.

ఉదాహరణకు, Dashboards క్రింద అనేక services (Lambda, EC2, API Gateway మరియు అనేక ఇతరాలు వంటివి) కోసం automated dashboards మీకు కనిపిస్తాయి.

మీరు Application Signals ను leverage చేస్తుంటే, Application Signals (APM) క్రింద application maps మరియు dashboards కనిపిస్తాయి. అదనంగా, observability లో ఏవైనా gaps ను highlight చేసే uninstrumented services కనిపిస్తాయి.

## Custom డాష్‌బోర్డ్‌లు

మీకు మీ స్వంత business-specific dashboards ను design చేయాల్సి ఉంటుంది. Operational excellence కోసం మీ dashboards ను ఎలా design చేయాలో ఈ guide ను refer చేయండి: [Building Dashboards for Operational Visibility](https://aws.amazon.com/builders-library/building-dashboards-for-operational-visibility/)

## CloudWatch Alarms

మీ services మరియు infrastructure తో సమస్యలను signal చేయడానికి alerts (లేదా CloudWatch లో Alarms) కూడా సృష్టిస్తారు. Centralized alarm visibility కోసం మీ monitoring account లో alarms సృష్టించవచ్చు లేదా/మరియు local accounts లో individual alarms సృష్టించవచ్చు.

### Alarm Recommendations

ఎలా ప్రారంభించాలో తెలియకపోతే, Alarm Recommendations మీకు సహాయపడతాయి. Alarm recommendations monitoring best practices పై ఆధారపడి ఉంటాయి. Alarm సృష్టించడానికి ముందు recommended alarm configurations ను review చేయండి.

మరింత వివరాల కోసం, [Alarm recommendations for AWS services](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Best_Practice_Recommended_Alarms_AWS_Services.html) చూడండి.

## Service Level Objectives (SLOs)

ముఖ్యమైన KPIs track చేయడంలో సహాయపడటానికి SLOs మరియు associated alarms కూడా సృష్టించవచ్చు.

మరింత సమాచారం కోసం, [CloudWatch SLOs](../../tools/slos.md) చూడండి.

## సారాంశం

ఇది CloudWatch పై Getting Started guide ను ముగిస్తుంది. మేము cover చేసిన steps ఇక్కడ ఉన్నాయి:

1. **Monitoring మరియు Source Accounts Setup** – Multiple AWS accounts మరియు regions నుండి telemetry data centralize చేయడానికి cross-account observability configure చేశాము
2. **Unified Data Store Setup** – Unified querying మరియు analysis కోసం log data ను single account మరియు region లోకి centralize చేశాము
3. **Agents/Collectors Configure చేయడం** – మీ applications మరియు infrastructure నుండి telemetry పంపడానికి CloudWatch agents మరియు/లేదా OpenTelemetry collectors ను deploy చేశాము
4. **డాష్‌బోర్డ్‌లు మరియు Alerts** – మీ services health monitor చేయడానికి visibility కోసం dashboards మరియు alarms సృష్టించాము

## తదుపరి దశలు

Specific topics పై మరింత in-depth guidance కోసం, ఈ best practices guide అంతటా detailed sections ను refer చేయండి:

- [Containers (ECS/EKS)](../containers/aws-native/eks/amazon-cloudwatch-container-insights.md)
- [Serverless](../serverless/aws-native/lambda-based-observability.md)
- [Operational Guides](../operational/observability-driven-dev.md)
- [Cost Optimization](../cost/cost-visualization/cost.md)
- [Signal Collection](../signal-collection/emf.md)

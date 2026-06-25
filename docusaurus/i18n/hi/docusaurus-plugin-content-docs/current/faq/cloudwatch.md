# Amazon CloudWatch - FAQ

## मुझे Amazon CloudWatch क्यों चुनना चाहिए?

Amazon CloudWatch एक AWS क्लाउड नेटिव सेवा है जो AWS क्लाउड संसाधनों और AWS पर चलने वाले एप्लिकेशन की मॉनिटरिंग के लिए एक एकीकृत प्लेटफ़ॉर्म पर एकीकृत ऑब्ज़र्वेबिलिटी प्रदान करती है। Amazon CloudWatch का उपयोग [लॉग्स](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/WhatIsCloudWatchLogs.html), [मेट्रिक्स](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/working_with_metrics.html), [इवेंट](https://docs.aws.amazon.com/AmazonCloudWatch/latest/events/WhatIsCloudWatchEvents.html) ट्रैक करने और [अलार्म](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/AlarmThatSendsEmail.html) सेट करने के रूप में मॉनिटरिंग और ऑपरेशनल डेटा एकत्र करने के लिए किया जा सकता है। यह AWS संसाधनों, एप्लिकेशन और AWS और [ऑन-प्रिमाइसेस सर्वर](https://aws.amazon.com/blogs/mt/how-to-monitor-hybrid-environment-with-aws-services/) पर चलने वाली सेवाओं का [एकीकृत दृश्य](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch_Dashboards.html) भी प्रदान करता है।

## कौन सी AWS सेवाएं Amazon CloudWatch और Amazon CloudWatch Logs के साथ नेटिव रूप से एकीकृत हैं?

Amazon CloudWatch 70+ से अधिक AWS सेवाओं के साथ नेटिव रूप से इंटीग्रेट करता है। कृपया [AWS services that publish CloudWatch metrics](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/aws-services-cloudwatch-metrics.html) की पूरी सूची के लिए डॉक्यूमेंटेशन देखें। वर्तमान में, 30 से अधिक AWS सेवाएं CloudWatch पर लॉग प्रकाशित करती हैं।

## मुझे Amazon CloudWatch में सभी AWS सेवाओं से प्रकाशित सभी मेट्रिक्स की सूची कहां मिलेगी?

सभी [AWS Services that publish metrics](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/aws-services-cloudwatch-metrics.html) की सूची AWS डॉक्यूमेंटेशन में है।

## Amazon CloudWatch में मेट्रिक्स एकत्र और मॉनिटर करना कहां से शुरू करूं?

[Amazon CloudWatch collects metrics](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/working_with_metrics.html) विभिन्न AWS सेवाओं से जिन्हें [AWS Management Console, AWS CLI, या API](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/viewing_metrics_with_cloudwatch.html) के माध्यम से देखा जा सकता है।

> संबंधित AWS ऑब्ज़र्वेबिलिटी Workshop: [Metrics](https://catalog.workshops.aws/observability/en-US/aws-native/metrics)

## मेरे Amazon EC2 Instance को बहुत बारीक स्तर की मॉनिटरिंग चाहिए, मैं क्या करूं?

डिफ़ॉल्ट रूप से, Amazon EC2 Basic Monitoring के रूप में 5-मिनट की अवधि में CloudWatch को मेट्रिक डेटा भेजता है। 1-मिनट की अवधि में मेट्रिक डेटा भेजने के लिए, instance पर [detailed monitoring](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/using-cloudwatch-new.html) सक्षम की जा सकती है।

## मैं अपने एप्लिकेशन के लिए अपनी मेट्रिक्स प्रकाशित करना चाहता हूं। क्या कोई विकल्प है?

ग्राहक API या CLI के माध्यम से CloudWatch में अपनी [custom metrics](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/publishingMetrics.html) भी प्रकाशित कर सकते हैं, 1 मिनट के standard resolution या 1 सेकंड तक के high resolution granularity के साथ।

> संबंधित AWS ऑब्ज़र्वेबिलिटी Workshop: [Public custom metrics](https://catalog.workshops.aws/observability/en-US/aws-native/metrics/publishmetrics)

## CloudWatch agent के माध्यम से custom metrics एकत्र करने के लिए और क्या सपोर्ट उपलब्ध है?

एप्लिकेशन या सेवाओं से custom metrics को unified CloudWatch agent के साथ [StatsD](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-Agent-custom-metrics-statsd.html) या [collectd](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-Agent-custom-metrics-collectd.html) प्रोटोकॉल के सपोर्ट के साथ प्राप्त किया जा सकता है।

## मेरे वर्कलोड में बहुत सारे अल्पकालिक संसाधन हैं और उच्च-cardinality में लॉग जनरेट करते हैं, मेट्रिक्स और लॉग एकत्र करने और मापने का अनुशंसित दृष्टिकोण क्या है?

[CloudWatch embedded metric format](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch_Embedded_Metric_Format.html) ग्राहकों को लॉग के रूप में जटिल उच्च-cardinality एप्लिकेशन डेटा इंजेस्ट करने और Lambda functions और containers जैसे अल्पकालिक संसाधनों से कार्रवाई योग्य मेट्रिक्स जनरेट करने में सक्षम बनाता है।

> संबंधित AWS ऑब्ज़र्वेबिलिटी Workshop: [Embedded Metric Format](https://catalog.workshops.aws/observability/en-US/aws-native/metrics/emf)

## Amazon CloudWatch में लॉग एकत्र और मॉनिटर करना कहां से शुरू करूं?

[Amazon CloudWatch Logs](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/WhatIsCloudWatchLogs.html) ग्राहकों को मौजूदा सिस्टम, एप्लिकेशन और custom log files का उपयोग करके निकट रीयल टाइम में सिस्टम और एप्लिकेशन की मॉनिटर और समस्या निवारण में मदद करता है।

> संबंधित AWS ऑब्ज़र्वेबिलिटी Workshop: [Log Insights](https://catalog.workshops.aws/observability/en-US/aws-native/logs/logsinsights)

## CloudWatch agent क्या है और मुझे इसका उपयोग क्यों करना चाहिए?

[Unified CloudWatch Agent](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Install-CloudWatch-Agent.html) MIT लाइसेंस के तहत एक ओपन-सोर्स सॉफ़्टवेयर है जो x86-64 और ARM64 आर्किटेक्चर का उपयोग करने वाले अधिकांश ऑपरेटिंग सिस्टम का समर्थन करता है।

## CloudWatch agent को सामान्य रूप से और ऑटोमेशन का उपयोग करके कैसे इंस्टॉल किया जा सकता है?

सभी समर्थित ऑपरेटिंग सिस्टम पर, ग्राहक [command line](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/installing-cloudwatch-agent-commandline.html), [Systems Manager](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/installing-cloudwatch-agent-ssm.html), या [CloudFormation template](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Install-CloudWatch-Agent-New-Instances-CloudFormation.html) का उपयोग करके CloudWatch agent डाउनलोड और इंस्टॉल कर सकते हैं।

## हमारे Organization में कई रीजन में कई AWS अकाउंट हैं, क्या Amazon CloudWatch इन परिदृश्यों के लिए काम करता है?

Amazon CloudWatch [cross-account ऑब्ज़र्वेबिलिटी](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-Unified-Cross-Account.html) प्रदान करता है और [cross-account, cross-region dashboard](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Cross-Account-Cross-Region.html) भी प्रदान करता है।

## Amazon CloudWatch के लिए किस प्रकार का ऑटोमेशन सपोर्ट उपलब्ध है?

AWS Management Console के अलावा ग्राहक API, [AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html) और [AWS SDKs](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/sdk-general-information-section.html) के माध्यम से भी सेवा तक पहुंच सकते हैं।

## मैं जल्दी से संसाधनों की मॉनिटरिंग शुरू करना चाहता हूं, अनुशंसित दृष्टिकोण क्या है?

CloudWatch में [Automatic Dashboards](https://docs.aws.amazon.com/prescriptive-guidance/latest/implementing-logging-monitoring-cloudwatch/cloudwatch-dashboards-visualizations.html) सभी AWS पब्लिक रीजन में उपलब्ध हैं जो सभी AWS संसाधनों के स्वास्थ्य और प्रदर्शन का एक एकीकृत दृश्य प्रदान करते हैं।

संबंधित AWS ऑब्ज़र्वेबिलिटी Workshop: [Automatic Dashboards](https://catalog.workshops.aws/observability/en-US/aws-native/dashboards/autogen-dashboard)

## मैं CloudWatch में जो मॉनिटर करना चाहता हूं उसे कस्टमाइज़ करना चाहता हूं, अनुशंसित दृष्टिकोण क्या है?

[Custom Dashboard](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/create_dashboard.html) के साथ ग्राहक विभिन्न widgets के साथ जितने चाहें उतने अतिरिक्त डैशबोर्ड बना सकते हैं और तदनुसार कस्टमाइज़ कर सकते हैं।

संबंधित AWS ऑब्ज़र्वेबिलिटी Workshop: [Dashboarding](https://catalog.workshops.aws/observability/en-US/aws-native/ec2-monitoring/dashboarding)

## मैंने कुछ custom dashboards बनाए हैं, क्या इन्हें शेयर करने का कोई तरीका है?

हां, [CloudWatch dashboards की शेयरिंग](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/cloudwatch-dashboard-sharing.html) संभव है - सार्वजनिक रूप से, ईमेल पतों के अनुसार निजी रूप से, या तृतीय-पक्ष SSO प्रोवाइडर के माध्यम से।

> संबंधित AWS ऑब्ज़र्वेबिलिटी Workshop: [Sharing CloudWatch Dashboards](https://catalog.workshops.aws/observability/en-US/aws-native/dashboards/sharingdashboard)

## मैं अपने एप्लिकेशन की ऑब्ज़र्वेबिलिटी सुधारना चाहता हूं, मैं कैसे पूरा कर सकता हूं?

[Amazon CloudWatch Application Insights](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/cloudwatch-application-insights.html) SQL Server database, .Net आधारित web (IIS) stack, एप्लिकेशन सर्वर, OS, लोड बैलेंसर आदि सहित अंतर्निहित AWS संसाधनों के साथ आपके एप्लिकेशन के लिए ऑब्ज़र्वेबिलिटी की सुविधा प्रदान करता है।

## मेरा Organization ओपन-सोर्स केंद्रित है, क्या Amazon CloudWatch ओपन-सोर्स तकनीकों के माध्यम से मॉनिटरिंग और ऑब्ज़र्वेबिलिटी का समर्थन करता है?

मेट्रिक्स और ट्रेस एकत्र करने के लिए, [AWS Distro for OpenTelemetry (ADOT) Collector](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-Agent-open-telemetry.html) को CloudWatch agent के साथ साइड-बाय-साइड इंस्टॉल किया जा सकता है। लॉग के लिए, Fluent Bit मदद करता है। डैशबोर्ड के लिए, Amazon Managed Grafana को [CloudWatch डेटा सोर्स](https://docs.aws.amazon.com/grafana/latest/userguide/using-amazon-cloudwatch-in-AMG.html) के रूप में जोड़ा जा सकता है।

## हमारा वर्कलोड पहले से Prometheus का उपयोग करके मेट्रिक्स एकत्र करने के लिए बनाया गया है। क्या मैं वही पद्धति जारी रख सकता हूं?

हां। CloudWatch agent को EC2 instances पर [Prometheus मेट्रिक्स स्क्रैप](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-Agent-PrometheusEC2.html) करने के लिए कॉन्फ़िगर किया जा सकता है। CloudWatch [Container Insights monitoring for Prometheus](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/ContainerInsights-Prometheus.html) कंटेनरीकृत सिस्टम से Prometheus मेट्रिक्स की स्वचालित खोज करता है।

## मेरे वर्कलोड में माइक्रोसर्विसेज कंप्यूट हैं, विशेषकर EKS/Kubernetes संबंधित containers, मैं एनवायरनमेंट में अंतर्दृष्टि प्राप्त करने के लिए Amazon CloudWatch का उपयोग कैसे करूं?

ग्राहक [CloudWatch Container Insights](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/ContainerInsights.html) का उपयोग [Amazon EKS](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/deploy-container-insights-EKS.html) या Amazon EC2 पर Kubernetes प्लेटफ़ॉर्म पर चलने वाले कंटेनरीकृत एप्लिकेशन और माइक्रोसर्विसेज से मेट्रिक्स और लॉग एकत्र, एकीकृत और सारांशित करने के लिए कर सकते हैं।

> संबंधित AWS ऑब्ज़र्वेबिलिटी Workshop: [Container Insights on EKS](https://catalog.workshops.aws/observability/en-US/aws-native/insights/containerinsights/eks)

## मेरे वर्कलोड में ECS संबंधित containers हैं, मैं Amazon CloudWatch का उपयोग कैसे करूं?

ग्राहक [CloudWatch Container Insights](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/ContainerInsights.html) का उपयोग [Amazon ECS](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/deploy-container-insights-ECS.html) पर चलने वाले कंटेनरीकृत एप्लिकेशन से मेट्रिक्स और लॉग एकत्र करने के लिए कर सकते हैं।

> संबंधित AWS ऑब्ज़र्वेबिलिटी Workshop: [Container Insights on ECS](https://catalog.workshops.aws/observability/en-US/aws-native/insights/containerinsights/ecs)

## मेरे वर्कलोड में serverless कंप्यूट है, विशेषकर AWS Lambda, मैं Amazon CloudWatch का उपयोग कैसे करूं?

ग्राहक AWS Lambda पर चलने वाले serverless एप्लिकेशन की मॉनिटरिंग और समस्या निवारण के लिए [CloudWatch Lambda Insights](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Lambda-Insights.html) का उपयोग कर सकते हैं।

> संबंधित AWS ऑब्ज़र्वेबिलिटी Workshop: [Lambda Insights](https://catalog.workshops.aws/observability/en-US/aws-native/insights/lambdainsights)

## मैं Amazon CloudWatch logs में बहुत सारे लॉग एकीकृत करता हूं, मैं उस डेटा में ऑब्ज़र्वेबिलिटी कैसे प्राप्त करूं?

[CloudWatch Logs Insights](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/AnalyzingLogData.html) ग्राहकों को इंटरैक्टिव रूप से लॉग डेटा खोजने, एनालिसिस करने और ऑपरेशनल मुद्दों पर कुशलता से प्रतिक्रिया देने में सक्षम बनाता है।

## Amazon CloudWatch Logs में लॉग कैसे क्वेरी करूं?

Amazon CloudWatch Logs में CloudWatch Logs Insights लॉग समूहों को क्वेरी करने के लिए एक [क्वेरी भाषा](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/CWL_QuerySyntax.html) का उपयोग करता है।

## लागत ऑप्टिमाइज़ेशन, अनुपालन retention या अतिरिक्त प्रसंस्करण के लिए Amazon CloudWatch Logs में संग्रहीत लॉग कैसे प्रबंधित करूं?

डिफ़ॉल्ट रूप से, CloudWatch Logs [अनिश्चित काल तक रखे जाते हैं और कभी समाप्त नहीं होते](https://docs.aws.amazon.com/managedservices/latest/userguide/log-customize-retention.html)। ग्राहक प्रत्येक log group की retention policy को एक दिन से 10 वर्ष के बीच समायोजित कर सकते हैं।

## मेरे वर्कलोड संवेदनशील डेटा वाले लॉग जनरेट करते हैं, क्या Amazon CloudWatch में उन्हें सुरक्षित करने का कोई तरीका है?

ग्राहक CloudWatch Logs में [Log data protection feature](https://aws.amazon.com/cloudwatch/faqs/#Log_data_protection) का उपयोग कर सकते हैं जो लॉग के भीतर संवेदनशील डेटा को [स्वचालित रूप से पहचानने और मास्क करने](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/mask-sensitive-log-data.html#mask-sensitive-log-data-start) के लिए अपने नियम और नीतियां परिभाषित करने में मदद करता है।

संबंधित AWS ऑब्ज़र्वेबिलिटी Workshop: [Data Protection](https://catalog.workshops.aws/observability/en-US/aws-native/logs/dataprotection)

## मैं अपने सिस्टम और एप्लिकेशन में anomaly bands या अप्रत्याशित परिवर्तन जानना चाहता हूं। Amazon CloudWatch मुझे कैसे अलर्ट कर सकता है?

[Amazon CloudWatch एनोमली डिटेक्शन](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch_Anomaly_Detection.html) सांख्यिकीय और मशीन लर्निंग एल्गोरिदम लागू करता है ताकि सामान्य बेसलाइन निर्धारित की जा सके और न्यूनतम उपयोगकर्ता हस्तक्षेप के साथ विसंगतियों को सामने लाया जा सके।

> संबंधित AWS ऑब्ज़र्वेबिलिटी Workshop: [एनोमली डिटेक्शन](https://catalog.workshops.aws/observability/en-US/aws-native/metrics/alarms/anomalydetection)

## मैंने Amazon CloudWatch में metric alarm सेट किया है, लेकिन मुझे बार-बार alarm noise मिल रहा है। मैं इसे कैसे नियंत्रित करूं?

ग्राहक कई alarms को alarm पदानुक्रम में [composite alarm](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Create_Composite_Alarm.html) के रूप में जोड़ सकते हैं ताकि जब कई alarms एक साथ fire हों तो केवल एक बार trigger होकर alarm noise कम हो।

> संबंधित AWS ऑब्ज़र्वेबिलिटी Workshop: [Alarms](https://catalog.workshops.aws/observability/en-US/aws-native/metrics/alarms)

## मेरा इंटरनेट-facing वर्कलोड प्रदर्शन और उपलब्धता समस्याओं का सामना कर रहा है, मैं कैसे समस्या निवारण करूं?

[Amazon CloudWatch Internet Monitor](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-InternetMonitor.html) दृश्यता प्रदान करता है कि इंटरनेट मुद्दे AWS पर होस्ट किए गए आपके एप्लिकेशन और आपके अंतिम उपयोगकर्ताओं के बीच प्रदर्शन और उपलब्धता को कैसे प्रभावित करते हैं।

## मैं अपने एंड यूजर्स के प्रभावित होने से पहले ही नोटिफाई होना चाहता हूं। बेहतर दृश्यता कैसे प्राप्त करूं?

ग्राहक [Amazon CloudWatch Synthetics](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch_Synthetics_Canaries.html) का उपयोग करके canaries बना सकते हैं, जो शेड्यूल पर चलने वाली कॉन्फ़िगर करने योग्य स्क्रिप्ट हैं, जो आपके endpoints और APIs की मॉनिटरिंग करती हैं।

> संबंधित AWS ऑब्ज़र्वेबिलिटी Workshop: [CloudWatch Synthetics](https://catalog.workshops.aws/observability/en-US/aws-native/app-monitoring/synthetics)

## मैं client-side प्रदर्शन की पहचान करके एंड यूजर एक्सपीरियंस कैसे observe कर सकता हूं?

[CloudWatch RUM](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-RUM.html) वास्तविक उपयोगकर्ता सत्रों से निकट रीयल टाइम में आपके वेब एप्लिकेशन प्रदर्शन के बारे में client-side डेटा एकत्र और देखने के लिए real user monitoring कर सकता है।

> संबंधित AWS ऑब्ज़र्वेबिलिटी Workshop: [CloudWatch RUM](https://catalog.workshops.aws/observability/en-US/aws-native/app-monitoring/rum)

## मेरे Organization को ऑडिट के लिए सभी कार्यों को रिकॉर्ड करना आवश्यक है। क्या Amazon CloudWatch इवेंट रिकॉर्ड किए जा सकते हैं?

Amazon CloudWatch [AWS CloudTrail](https://docs.aws.amazon.com/awscloudtrail/latest/userguide/cloudtrail-user-guide.html) के साथ इंटीग्रेटेड है, जो Amazon CloudWatch में एक user, role, या AWS सेवा द्वारा की गई कार्रवाइयों का रिकॉर्ड प्रदान करता है।

## और क्या जानकारी उपलब्ध है?

अतिरिक्त जानकारी के लिए ग्राहक [CloudWatch](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/WhatIsCloudWatch.html), [CloudWatch Events](https://docs.aws.amazon.com/AmazonCloudWatch/latest/events/WhatIsCloudWatchEvents.html) और [CloudWatch Logs](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/WhatIsCloudWatchLogs.html) के लिए AWS Documentation पढ़ सकते हैं, [AWS Native ऑब्ज़र्वेबिलिटी](https://catalog.workshops.aws/observability/en-US/aws-native) पर AWS ऑब्ज़र्वेबिलिटी Workshop देख सकते हैं और [फ़ीचर्स](https://aws.amazon.com/cloudwatch/features/) और [मूल्य निर्धारण](https://aws.amazon.com/cloudwatch/pricing/) विवरण जानने के लिए [प्रोडक्ट पेज](https://aws.amazon.com/cloudwatch/) भी देख सकते हैं।

**प्रोडक्ट FAQ:** [https://aws.amazon.com/cloudwatch/faqs/](https://aws.amazon.com/cloudwatch/faqs/)

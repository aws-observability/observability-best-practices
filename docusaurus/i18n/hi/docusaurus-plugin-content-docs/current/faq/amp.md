# Amazon Managed Service for Prometheus - FAQ

## वर्तमान में कौन से AWS रीजन समर्थित हैं और क्या अन्य रीजन से मेट्रिक्स एकत्र करना संभव है?

समर्थित रीजन की अपडेटेड सूची के लिए हमारा [डॉक्यूमेंटेशन](https://docs.aws.amazon.com/prometheus/latest/userguide/what-is-Amazon-Managed-Service-Prometheus.html) देखें। आप हमेशा किसी भी रीजन से डेटा एकत्र कर सकते हैं और इसे हमारे द्वारा समर्थित किसी विशिष्ट रीजन में भेज सकते हैं। अधिक विवरण के लिए यह ब्लॉग देखें: [Cross-region metrics collection for Amazon Managed Service for Prometheus](https://aws.amazon.com/blogs/opensource/set-up-cross-region-metrics-collection-for-amazon-managed-service-for-prometheus-workspaces/)।

## Cost Explorer या [CloudWatch में AWS billing charges के रूप में](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/gs_monitor_estimated_charges_with_cloudwatch.html) metering और/या billing देखने में कितना समय लगता है?

हम इंजेस्ट किए गए मेट्रिक सैंपल के ब्लॉक को हर 2 घंटे में S3 पर अपलोड होते ही मीटर करते हैं। Amazon Managed Service for Prometheus के लिए metering और charges रिपोर्ट होने में 3 घंटे तक लग सकते हैं।

## क्या Prometheus Service केवल एक cluster (EKS/ECS) से मेट्रिक्स स्क्रैप कर सकती है?

अन्य कंप्यूट एनवायरनमेंट के लिए डॉक्यूमेंटेशन की कमी के लिए हम क्षमा चाहते हैं। आप Prometheus server का उपयोग [EC2 से Prometheus मेट्रिक्स स्क्रैप](https://aws.amazon.com/blogs/opensource/using-amazon-managed-service-for-prometheus-to-monitor-ec2-environments/) करने और किसी भी अन्य कंप्यूट एनवायरनमेंट से कर सकते हैं जहां आप आज Prometheus server इंस्टॉल कर सकते हैं, जब तक आप remote write कॉन्फ़िगर करें और [AWS SigV4 proxy](https://github.com/awslabs/aws-sigv4-proxy) सेट अप करें।

## आप Amazon Managed Service for Prometheus को Grafana से कैसे जोड़ते हैं? क्या कोई डॉक्यूमेंटेशन है?

हम PromQL का उपयोग करके Amazon Managed Service for Prometheus को क्वेरी करने के लिए [Grafana में उपलब्ध डिफ़ॉल्ट Prometheus डेटा सोर्स](https://grafana.com/docs/grafana/latest/datasources/prometheus/) का उपयोग करते हैं। यहां कुछ डॉक्यूमेंटेशन और ब्लॉग है जो आपको शुरू करने में मदद करेगा:
1. [Service docs](https://docs.aws.amazon.com/prometheus/latest/userguide/AMP-onboard-query.html)
1. [EC2 पर Grafana सेटअप](https://aws.amazon.com/blogs/opensource/setting-up-grafana-on-ec2-to-query-metrics-from-amazon-managed-service-for-prometheus/)

## Amazon Managed Service for Prometheus को भेजे जाने वाले सैंपल की संख्या कम करने के लिए सर्वोत्तम प्रथाएं क्या हैं?

Amazon Managed Service for Prometheus में इंजेस्ट किए जाने वाले सैंपल की संख्या कम करने के लिए, ग्राहक अपना scrape interval बढ़ा सकते हैं (उदा., 30s से 1min में बदलें) या वे जितनी series स्क्रैप कर रहे हैं उनकी संख्या कम कर सकते हैं। Scrape interval बदलने का series की संख्या कम करने की तुलना में सैंपल की संख्या पर अधिक नाटकीय प्रभाव होगा, scrape interval को दोगुना करने से इंजेस्ट किए गए सैंपल की मात्रा आधी हो जाएगी।

## मैं CloudWatch मेट्रिक्स को Amazon Managed Service for Prometheus में कैसे भेज सकता हूं?

हम [CloudWatch metric streams का उपयोग करके CloudWatch मेट्रिक्स को Amazon Managed Service for Prometheus में भेजने](https://aws-observability.github.io/observability-best-practices/recipes/recipes/lambda-cw-metrics-go-amp/) की अनुशंसा करते हैं।

[**Yet Another CloudWatch Exporter (YACE)**](https://github.com/nerdswords/yet-another-cloudwatch-exporter) CloudWatch से मेट्रिक्स को Amazon Managed Service for Prometheus में लाने का एक और विकल्प है।

## Amazon Managed Service for Prometheus किस Prometheus संस्करण के साथ संगत है?

Amazon Managed Service for Prometheus [Prometheus 2.x](https://github.com/prometheus/prometheus/blob/main/RELEASE.md) के साथ संगत है। Amazon Managed Service for Prometheus ओपन सोर्स [CNCF Cortex प्रोजेक्ट](https://cortexmetrics.io/) पर आधारित है। हम जिन compatible APIs का समर्थन करते हैं उनकी सूची [यहां मिल सकती है](https://docs.aws.amazon.com/prometheus/latest/userguide/AMP-APIReference.html)।

## Amazon Managed Service for Prometheus में मेट्रिक्स इंजेस्ट करने के लिए आप किस कलेक्टर की अनुशंसा करते हैं? क्या मुझे Agent mode में Prometheus का उपयोग करना चाहिए?

हम agent mode सहित Prometheus servers, OpenTelemetry agent, और AWS Distro for OpenTelemetry agent के उपयोग का समर्थन करते हैं। तीनों में से कोई भी ठीक होना चाहिए, और आप जो भी आपकी टीम की आवश्यकताओं और प्राथमिकताओं के लिए सबसे उपयुक्त हो उसे चुन सकते हैं।

## Amazon Managed Service for Prometheus का प्रदर्शन workspace के आकार के साथ कैसे स्केल होता है?

वर्तमान में, Amazon Managed Service for Prometheus एक workspace में 200M सक्रिय time series तक का समर्थन करता है। एक ही आकार के dataset में क्वेरी को workspace में सक्रिय series की संख्या की परवाह किए बिना प्रदर्शन में गिरावट नहीं दिखनी चाहिए।

**प्रोडक्ट FAQ:** [https://aws.amazon.com/prometheus/faqs/](https://aws.amazon.com/prometheus/faqs/)

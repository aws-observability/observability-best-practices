# AWS Distro for Open Telemetry (ADOT) - FAQ

## क्या मैं AMP में मेट्रिक्स इंजेस्ट करने के लिए ADOT कलेक्टर का उपयोग कर सकता हूं?

हां, यह कार्यक्षमता मई 2022 में मेट्रिक्स सपोर्ट के GA लॉन्च के साथ पेश की गई थी और आप EC2 से, हमारे EKS add-on के माध्यम से, हमारे ECS साइड-कार इंटीग्रेशन के माध्यम से, और/या हमारे Lambda layers के माध्यम से ADOT कलेक्टर का उपयोग कर सकते हैं।

## क्या मैं ADOT कलेक्टर का उपयोग लॉग एकत्र करने और उन्हें Amazon CloudWatch या Amazon OpenSearch में इंजेस्ट करने के लिए कर सकता हूं?

हां। [लॉग सपोर्ट](https://aws.amazon.com/about-aws/whats-new/2023/11/logs-support-aws-distro-opentelemetry/) 22 नवंबर, 2023 से उपलब्ध है। अधिक विवरण के लिए आप [Logging Exporter](https://aws-otel.github.io/docs/components/misc-exporters) पेज देख सकते हैं।

## ADOT कलेक्टर पर संसाधन उपयोग और प्रदर्शन विवरण कहां मिल सकते हैं?

हमारे पास एक [Performance Report](https://aws-observability.github.io/aws-otel-collector/benchmark/report) ऑनलाइन है जिसे हम कलेक्टर रिलीज़ करते समय अपडेट रखते हैं।

## क्या Apache Kafka के साथ ADOT का उपयोग संभव है?

हां, Kafka exporter और receiver का सपोर्ट ADOT कलेक्टर v0.28.0 में जोड़ा गया था। अधिक विवरण के लिए, कृपया [ADOT कलेक्टर डॉक्यूमेंटेशन](https://aws-otel.github.io/docs/components/kafka-receiver-exporter) देखें।

## मैं ADOT कलेक्टर को कैसे कॉन्फ़िगर कर सकता हूं?

ADOT कलेक्टर को YAML कॉन्फ़िगरेशन फ़ाइलों का उपयोग करके कॉन्फ़िगर किया जाता है जो स्थानीय रूप से संग्रहीत होती हैं। इसके अलावा, अन्य स्थानों में संग्रहीत कॉन्फ़िगरेशन का उपयोग करना संभव है, जैसे S3 बकेट। ADOT कलेक्टर को कॉन्फ़िगर करने के सभी समर्थित तंत्र [ADOT कलेक्टर डॉक्यूमेंटेशन](https://aws-otel.github.io/docs/components/confmap-providers) में विस्तार से वर्णित हैं।

## क्या मैं ADOT कलेक्टर में उन्नत सैंपलिंग कर सकता हूं?

हां। [Advanced Sampling](https://aws.amazon.com/about-aws/whats-new/2023/05/aws-distro-opentelemetry-advanced-sampling/) 15 मई, 2023 को लॉन्च हुई। अधिक विवरण के लिए [Getting Started with Advanced Sampling using AWS Distro for OpenTelemetry](https://aws-otel.github.io/docs/getting-started/advanced-sampling) पेज देखें।

## ADOT कलेक्टर को स्केल करने के कोई सुझाव?

हां! [Scaling the Collector](https://opentelemetry.io/docs/collector/scaling/) पर upstream OpenTelemetry डॉक्स देखें।

## मेरे पास ADOT कलेक्टर्स का एक फ़्लीट है, मैं उन्हें कैसे प्रबंधित कर सकता हूं?

यह सक्रिय विकास का एक क्षेत्र है और हम अपेक्षा करते हैं कि यह 2023 में परिपक्व होगा, अधिक विवरण के लिए [Management](https://opentelemetry.io/docs/collector/management/) पर upstream OpenTelemetry डॉक्स देखें, विशेष रूप से [Open Agent Management Protocol (OpAMP)](https://opentelemetry.io/docs/collector/management/#opamp) पर।

## आप ADOT कलेक्टर के स्वास्थ्य और प्रदर्शन की मॉनिटरिंग कैसे करते हैं?

1. [Monitoring the collector](https://github.com/open-telemetry/opentelemetry-collector/blob/main/docs/observability.md) - पोर्ट 8080 पर एक्सपोज़ डिफ़ॉल्ट मेट्रिक्स जो Prometheus receiver द्वारा स्क्रैप किए जा सकते हैं
2. [Node Exporter](https://prometheus.io/docs/guides/node-exporter/) का उपयोग करके, node exporter चलाना भी नोड, पॉड और ऑपरेटिंग सिस्टम के बारे में कई प्रदर्शन और स्वास्थ्य मेट्रिक्स प्रदान करेगा जिस पर कलेक्टर चल रहा है।
3. [Kube-state-metrics (KSM)](https://github.com/kubernetes/kube-state-metrics), KSM कलेक्टर के बारे में दिलचस्प इवेंट भी उत्पन्न कर सकता है।
4. [Prometheus `up` metric](https://github.com/open-telemetry/opentelemetry-collector/pull/2918)
5. शुरू करने के लिए एक सरल Grafana डैशबोर्ड: [https://grafana.com/grafana/dashboards/12553](https://grafana.com/grafana/dashboards/12553)

**प्रोडक्ट FAQ:** [https://aws.amazon.com/otel/faqs/](https://aws.amazon.com/otel/faqs/)

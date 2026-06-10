# EKS Observability : आवश्यक मेट्रिक्स

# वर्तमान परिदृश्य

मॉनिटरिंग को एक ऐसे समाधान के रूप में परिभाषित किया जाता है जो इंफ्रास्ट्रक्चर और एप्लिकेशन मालिकों को अपने सिस्टम की ऐतिहासिक और वर्तमान स्थिति देखने और समझने का तरीका प्रदान करता है, जो परिभाषित मेट्रिक्स या लॉग्स एकत्र करने पर केंद्रित है।

मॉनिटरिंग वर्षों में विकसित हुई है। हमने debug और dump logs के साथ समस्याओं को debug और troubleshoot करने से शुरुआत की, फिर syslogs, top जैसे कमांड-लाइन टूल्स का उपयोग करके बेसिक मॉनिटरिंग किया, जो एक डैशबोर्ड में उन्हें विज़ुअलाइज़ करने में प्रगत हुई। क्लाउड के आगमन और स्केल में वृद्धि के साथ, हम आज पहले से कहीं अधिक ट्रैक कर रहे हैं। उद्योग ने Observability की ओर अधिक रुख किया है, जिसे इंफ्रास्ट्रक्चर और एप्लिकेशन मालिकों को अपने सिस्टम का सक्रिय रूप से troubleshoot और debug करने के लिए एक समाधान के रूप में परिभाषित किया गया है। Observability मेट्रिक्स से प्राप्त पैटर्न देखने पर अधिक ध्यान केंद्रित करता है।


# मेट्रिक्स, ये क्यों महत्वपूर्ण हैं?

मेट्रिक्स संख्यात्मक मूल्यों की एक श्रृंखला है जो उनके निर्माण के समय के क्रम में रखी जाती हैं। इनका उपयोग आपके परिवेश में सर्वरों की संख्या, उनके डिस्क उपयोग, प्रति सेकंड हैंडल किए जाने वाले अनुरोधों की संख्या, या इन अनुरोधों को पूरा करने में विलंबता से लेकर सब कुछ ट्रैक करने के लिए किया जाता है। मेट्रिक्स वह डेटा है जो आपको बताता है कि आपके सिस्टम कैसा प्रदर्शन कर रहे हैं। चाहे आप छोटा या बड़ा क्लस्टर चला रहे हों, अपने सिस्टम के स्वास्थ्य और प्रदर्शन में अंतर्दृष्टि प्राप्त करने से आप सुधार के क्षेत्रों की पहचान कर सकते हैं, समस्या का troubleshoot और trace कर सकते हैं, साथ ही अपने वर्कलोड के प्रदर्शन और दक्षता में समग्र रूप से सुधार कर सकते हैं। ये परिवर्तन प्रभावित कर सकते हैं कि आप अपने क्लस्टर पर कितना समय और संसाधन खर्च करते हैं, जो सीधे लागत में परिवर्तित होता है।


# मेट्रिक्स संग्रह

EKS क्लस्टर से मेट्रिक्स एकत्र करने में [तीन कंपोनेंट](https://aws-observability.github.io/observability-best-practices/recipes/telemetry/) शामिल हैं:

1. स्रोत: जहाँ से मेट्रिक्स आती हैं जैसे इस गाइड में सूचीबद्ध हैं।
2. एजेंट: EKS वातावरण में चलने वाले एप्लिकेशन, जिन्हें अक्सर एजेंट कहा जाता है, जो मेट्रिक्स मॉनिटरिंग डेटा एकत्र करते हैं और इस डेटा को दूसरे कंपोनेंट पर पुश करते हैं। इस कंपोनेंट के कुछ उदाहरण [AWS Distro for OpenTelemetry (ADOT)](https://aws-otel.github.io/) और [CloudWatch Agent](https://aws-observability.github.io/observability-best-practices/tools/cloudwatch_agent/) हैं।
3. गंतव्य: एक मॉनिटरिंग डेटा स्टोरेज और विश्लेषण समाधान, यह कंपोनेंट आमतौर पर एक डेटा सेवा है जो [टाइम सीरीज़ फॉर्मेट डेटा](https://aws-observability.github.io/observability-best-practices/signals/metrics/) के लिए अनुकूलित है। इस कंपोनेंट के कुछ उदाहरण [Amazon Managed Service for Prometheus](https://aws.amazon.com/prometheus/) और [AWS CloudWatch](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/deploy-container-insights-EKS.html) हैं।

नोट: इस सेक्शन में, कॉन्फ़िगरेशन उदाहरण [AWS Observability Accelerator](https://aws-observability.github.io/terraform-aws-observability-accelerator/) के संबंधित सेक्शन के लिंक हैं। यह सुनिश्चित करने के लिए कि आपको EKS मेट्रिक्स संग्रह कार्यान्वयन पर अद्यतित मार्गदर्शन और उदाहरण मिलें।

## मैनेज्ड ओपन सोर्स समाधान

[AWS Distro for OpenTelemetry (ADOT)](https://aws-otel.github.io/) [OpenTelemetry](https://opentelemetry.io/) प्रोजेक्ट का एक समर्थित संस्करण है जो उपयोगकर्ताओं को [Amazon Managed Service for Prometheus](https://aws.amazon.com/prometheus/) और [AWS CloudWatch](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/deploy-container-insights-EKS.html) जैसे विभिन्न मॉनिटरिंग डेटा संग्रह समाधानों को सहसंबद्ध मेट्रिक्स और ट्रेस भेजने में सक्षम बनाता है। ADOT को [EKS Managed Add-ons](https://docs.aws.amazon.com/eks/latest/userguide/eks-add-ons.html) के माध्यम से EKS क्लस्टर पर इंस्टॉल किया जा सकता है और मेट्रिक्स (जैसे इस पृष्ठ पर सूचीबद्ध) और वर्कलोड ट्रेस एकत्र करने के लिए कॉन्फ़िगर किया जा सकता है। AWS ने सत्यापित किया है कि ADOT add-on Amazon EKS के साथ संगत है, और इसे नियमित रूप से नवीनतम बग फिक्स और सुरक्षा पैच के साथ अपडेट किया जाता है। [ADOT सर्वोत्तम प्रथाएं और अधिक जानकारी।](https://aws-observability.github.io/observability-best-practices/guides/operational/adot-at-scale/operating-adot-collector/)


## ADOT + AMP

AWS Distro for OpenTelemetry (ADOT), Amazon Managed Service for Prometheus (AMP), और Amazon Managed Service for Grafana (AMG) के साथ जल्दी शुरू करने का सबसे तेज़ तरीका AWS Observability Accelerator से [इंफ्रास्ट्रक्चर मॉनिटरिंग उदाहरण](https://aws-observability.github.io/terraform-aws-observability-accelerator/eks/) का उपयोग करना है। Accelerator उदाहरण आपके वातावरण में आउट-ऑफ-द-बॉक्स मेट्रिक्स संग्रह, अलर्टिंग नियम और Grafana डैशबोर्ड के साथ टूल्स और सेवाओं को तैनात करते हैं।

कृपया [EKS Managed Add-on for ADOT](https://docs.aws.amazon.com/eks/latest/userguide/opentelemetry.html) की स्थापना, कॉन्फ़िगरेशन और संचालन पर अतिरिक्त जानकारी के लिए AWS डॉक्यूमेंटेशन देखें।

### स्रोत

EKS मेट्रिक्स एक समग्र समाधान की विभिन्न परतों पर कई स्थानों से बनाई जाती हैं। यह एक तालिका है जो आवश्यक मेट्रिक्स सेक्शन में बताए गए मेट्रिक्स स्रोतों का सारांश प्रस्तुत करती है।


|परत	|स्रोत	|टूल	|इंस्टॉलेशन और अधिक जानकारी	|Helm Chart	|
|---	|---	|---	|---	|---	|
|Control Plane	|*api server endpoint*/metrics	|N/A - api server सीधे prometheus फॉर्मेट में मेट्रिक्स एक्सपोज करता है	|https://docs.aws.amazon.com/eks/latest/userguide/prometheus.html	|N/A	|
|Cluster State	|*kube-state-metrics-http-endpoint*:8080/metrics	|kube-state-metrics	|https://github.com/kubernetes/kube-state-metrics#overview	|https://github.com/kubernetes/kube-state-metrics#helm-chart	|
|Kube Proxy	|*kube-proxy-http*:10249/metrics	|N/A - kube proxy सीधे prometheus फॉर्मेट में मेट्रिक्स एक्सपोज करता है	|https://kubernetes.io/docs/reference/command-line-tools-reference/kube-proxy/	|N/A	|
|VPC CNI	|*vpc-cni-metrics-helper*/metrics	|cni-metrics-helper	|https://github.com/aws/amazon-vpc-cni-k8s/blob/master/cmd/cni-metrics-helper/README.md	|https://github.com/aws/amazon-vpc-cni-k8s/tree/master/charts/cni-metrics-helper	|
|Core DNS	|*core-dns*:9153/metrics	|N/A - core DNS सीधे prometheus फॉर्मेट में मेट्रिक्स एक्सपोज करता है	|https://github.com/coredns/coredns/tree/master/plugin/metrics	|N/A	|
|Node	|*prom-node-exporter-http*:9100/metrics	|prom-node-exporter	|https://github.com/prometheus/node_exporter
https://prometheus.io/docs/guides/node-exporter/#node-exporter-metrics	|https://github.com/prometheus-community/helm-charts/tree/main/charts/prometheus-node-exporter	|
|Kubelet/Pod	|*kubelet*/metrics/cadvisor	|kubelet या api server के माध्यम से proxied	|https://kubernetes.io/docs/concepts/cluster-administration/system-metrics/	|N/A	|

### एजेंट: AWS Distro for OpenTelemetry

AWS आपके EKS क्लस्टर पर ADOT की स्थापना, कॉन्फ़िगरेशन और संचालन AWS EKS ADOT managed addon के माध्यम से करने की अनुशंसा करता है। यह addon ADOT operator/collector कस्टम रिसोर्स मॉडल का उपयोग करता है जो आपको अपने क्लस्टर पर कई ADOT collectors को तैनात, कॉन्फ़िगर और प्रबंधित करने की अनुमति देता है। इस addon की स्थापना, उन्नत कॉन्फ़िगरेशन और संचालन पर विस्तृत जानकारी के लिए यह [डॉक्यूमेंटेशन](https://aws-otel.github.io/docs/getting-started/adot-eks-add-on) देखें।

नोट: AWS EKS ADOT managed addon वेब कंसोल का उपयोग [ADOT addon के उन्नत कॉन्फ़िगरेशन](https://docs.aws.amazon.com/eks/latest/userguide/deploy-collector-advanced-configuration.html) के लिए किया जा सकता है।

ADOT collector कॉन्फ़िगरेशन के दो कंपोनेंट हैं।

1. [Collector कॉन्फ़िगरेशन](https://github.com/aws-observability/aws-otel-community/blob/master/sample-configs/operator/collector-config-amp.yaml) जिसमें collector डिप्लॉयमेंट मोड (deployment, daemonset, आदि) शामिल है।
2. [OpenTelemetry Pipeline कॉन्फ़िगरेशन](https://opentelemetry.io/docs/collector/configuration/) जिसमें मेट्रिक्स संग्रह के लिए कौन से receivers, processors, और exporters आवश्यक हैं। उदाहरण कॉन्फ़िगरेशन स्निपेट:

```
config: |
    extensions:
      sigv4auth:
        region: <YOUR_AWS_REGION>
        service: "aps"

    receivers:
      #
      # Scrape configuration for the Prometheus Receiver
      # This is the same configuration used when Prometheus is installed using the community Helm chart
      #  
      prometheus:
        config:
          global:
            scrape_interval: 60s
            scrape_timeout: 10s

          scrape_configs:
          - job_name: kubernetes-apiservers
            bearer_token_file: /var/run/secrets/kubernetes.io/serviceaccount/token
            kubernetes_sd_configs:
            - role: endpoints
            relabel_configs:
            - action: keep
              regex: default;kubernetes;https
              source_labels:
              - __meta_kubernetes_namespace
              - __meta_kubernetes_service_name
              - __meta_kubernetes_endpoint_port_name
            scheme: https
            tls_config:
              ca_file: /var/run/secrets/kubernetes.io/serviceaccount/ca.crt
              insecure_skip_verify: true

              ...
              ...

    exporters:
      prometheusremotewrite:
        endpoint: <YOUR AMP WRITE ENDPOINT URL>
        auth:
          authenticator: sigv4auth
      logging:
        loglevel: warn
    extensions:
      sigv4auth:
        region: <YOUR_AWS_REGION>
        service: aps
      health_check:
      pprof:
        endpoint: :1888
      zpages:
        endpoint: :55679
    processors:
      batch/metrics:
        timeout: 30s
        send_batch_size: 500
    service:
      extensions: [pprof, zpages, health_check, sigv4auth]
      pipelines:
        metrics:
          receivers: [prometheus]
          processors: [batch/metrics]
          exporters: [logging, prometheusremotewrite]
```

एक पूर्ण सर्वोत्तम प्रथाओं वाला collector कॉन्फ़िगरेशन, ADOT पाइपलाइन कॉन्फ़िगरेशन और Prometheus scrape कॉन्फ़िगरेशन यहाँ [Observability Accelerator में Helm Chart](https://github.com/aws-observability/terraform-aws-observability-accelerator/blob/main/modules/eks-monitoring/otel-config/templates/opentelemetrycollector.yaml) के रूप में पाया जा सकता है।


### गंतव्य: Amazon Managed Service for Prometheus

ADOT collector पाइपलाइन AMP इंस्टेंस को मेट्रिक्स एक्सपोर्ट करने के लिए Prometheus Remote Write क्षमताओं का उपयोग करती है। उदाहरण कॉन्फ़िगरेशन स्निपेट, AMP WRITE ENDPOINT URL नोट करें:

```
    exporters:
      prometheusremotewrite:
        endpoint: <YOUR AMP WRITE ENDPOINT URL>
        auth:
          authenticator: sigv4auth
      logging:
        loglevel: warn
```

एक पूर्ण सर्वोत्तम प्रथाओं वाला collector कॉन्फ़िगरेशन, ADOT पाइपलाइन कॉन्फ़िगरेशन और Prometheus scrape कॉन्फ़िगरेशन यहाँ [Observability Accelerator में Helm Chart](https://github.com/aws-observability/terraform-aws-observability-accelerator/blob/main/modules/eks-monitoring/otel-config/templates/opentelemetrycollector.yaml) के रूप में पाया जा सकता है।

AMP कॉन्फ़िगरेशन और उपयोग पर सर्वोत्तम प्रथाएं [यहाँ](https://aws-observability.github.io/observability-best-practices/recipes/amp/) हैं।

# प्रासंगिक मेट्रिक्स कौन से हैं?

वे दिन गए जब आपके पास कम मेट्रिक्स उपलब्ध थीं, आजकल इसका उल्टा है, सैकड़ों मेट्रिक्स उपलब्ध हैं। प्रासंगिक मेट्रिक्स निर्धारित करने में सक्षम होना Observability-first मानसिकता के साथ सिस्टम बनाने की दिशा में महत्वपूर्ण है।

यह गाइड आपको उपलब्ध मेट्रिक्स के विभिन्न समूहों की रूपरेखा प्रस्तुत करती है और बताती है कि जब आप अपने इंफ्रास्ट्रक्चर और एप्लिकेशन में observability बनाते हैं तो आपको किन पर ध्यान देना चाहिए। नीचे सूचीबद्ध मेट्रिक्स वे मेट्रिक्स हैं जिन्हें हम सर्वोत्तम प्रथाओं के आधार पर मॉनिटर करने की अनुशंसा करते हैं।

निम्नलिखित सेक्शन में सूचीबद्ध मेट्रिक्स [AWS Observability Accelerator Grafana Dashboards](https://github.com/aws-observability/terraform-aws-observability-accelerator/tree/main/modules/eks-monitoring) और [Kube Prometheus Stack Dashboards](https://monitoring.mixins.dev/) में हाइलाइट किए गए मेट्रिक्स के अतिरिक्त हैं।

## Control Plane मेट्रिक्स

Amazon EKS control plane AWS द्वारा आपके लिए प्रबंधित किया जाता है और AWS द्वारा प्रबंधित अकाउंट में चलता है। इसमें control plane नोड्स होते हैं जो Kubernetes कंपोनेंट्स जैसे etcd और Kubernetes API server चलाते हैं। Kubernetes उपयोगकर्ताओं को क्लस्टर में गतिविधियों की जानकारी रखने के लिए विभिन्न इवेंट्स प्रकाशित करता है, जैसे पॉड्स, डिप्लॉयमेंट्स, नेमस्पेस और अन्य को शुरू करना और बंद करना। Amazon EKS control plane एक महत्वपूर्ण कंपोनेंट है जिसे आपको ट्रैक करने की आवश्यकता है ताकि यह सुनिश्चित हो सके कि मुख्य कंपोनेंट्स ठीक से काम कर सकें और आपके क्लस्टर द्वारा आवश्यक मौलिक गतिविधियों को निष्पादित कर सकें।

Control Plane API Server हज़ारों मेट्रिक्स एक्सपोज करता है, नीचे दी गई तालिका उन आवश्यक control plane मेट्रिक्स को सूचीबद्ध करती है जिनकी हम मॉनिटरिंग की अनुशंसा करते हैं।

|नाम	|मेट्रिक	|विवरण	|कारण	|
|---	|---	|---	|---	|
|API Server कुल अनुरोध	|apiserver_request_total	|प्रत्येक verb, dry run value, group, version, resource, scope, component, और HTTP response code के लिए apiserver अनुरोधों का काउंटर।	|	|
|API Server विलंबता	|apiserver_request_duration_seconds	|प्रत्येक verb, dry run value, group, version, resource, subresource, scope, और component के लिए सेकंड में प्रतिक्रिया विलंबता वितरण।	|	|
|Request विलंबता	|rest_client_request_duration_seconds	|सेकंड में request विलंबता। Verb और URL द्वारा विभाजित।	|	|
|कुल requests	|rest_client_requests_total	|HTTP requests की संख्या, status code, method, और host द्वारा विभाजित।	|	|
|API Server request अवधि	|apiserver_request_duration_seconds_bucket	|Kubernetes API server को प्रत्येक request की विलंबता सेकंड में मापता है	|	|
|API server request विलंबता योग	|apiserver_request_latencies_sum	|संचयी काउंटर जो K8 API server द्वारा requests प्रोसेस करने में लिया गया कुल समय ट्रैक करता है	|	|
|API server पंजीकृत watchers	|apiserver_registered_watchers	|किसी दिए गए resource के लिए वर्तमान में पंजीकृत watchers की संख्या	|	|
|API server ऑब्जेक्ट की संख्या	|apiserver_storage_object	|अंतिम जाँच के समय kind द्वारा विभाजित संग्रहीत ऑब्जेक्ट्स की संख्या।	|	|
|Admission controller विलंबता	|apiserver_admission_controller_admission_duration_seconds	|सेकंड में admission controller विलंबता हिस्टोग्राम, नाम द्वारा पहचाना गया और प्रत्येक operation और API resource और type (validate या admit) के लिए विभाजित।	|	|
|Etcd विलंबता	|etcd_request_duration_seconds	|प्रत्येक operation और object type के लिए सेकंड में Etcd request विलंबता।	|	|
|Etcd DB आकार	|apiserver_storage_db_total_size_in_bytes	|Etcd डेटाबेस आकार।	|यह आपको etcd डेटाबेस उपयोग को सक्रिय रूप से मॉनिटर करने और सीमा पार करने से बचने में मदद करता है।	|

## Cluster State मेट्रिक्स

Cluster State Metrics `kube-state-metrics` (KSM) द्वारा जनरेट की जाती हैं। KSM एक उपयोगिता है जो क्लस्टर में एक पॉड के रूप में चलती है, Kubernetes API Server को सुनती है, आपके क्लस्टर स्टेट और क्लस्टर में Kubernetes ऑब्जेक्ट्स में Prometheus मेट्रिक्स के रूप में अंतर्दृष्टि प्रदान करती है। इन मेट्रिक्स के उपलब्ध होने से पहले KSM को [इंस्टॉल](https://github.com/kubernetes/kube-state-metrics) करना होगा। इन मेट्रिक्स का उपयोग Kubernetes द्वारा प्रभावी रूप से पॉड शेड्यूलिंग करने के लिए किया जाता है, और यह अंदर विभिन्न ऑब्जेक्ट्स जैसे deployments, replica sets, nodes और pods के स्वास्थ्य पर केंद्रित है। Cluster state metrics पॉड की जानकारी को status, capacity और availability पर एक्सपोज करती हैं। अपने क्लस्टर के लिए शेड्यूलिंग टास्क पर कैसा प्रदर्शन हो रहा है इसका ट्रैक रखना आवश्यक है ताकि आप प्रदर्शन का ट्रैक रख सकें, समस्याओं से आगे रह सकें और अपने क्लस्टर के स्वास्थ्य की मॉनिटरिंग कर सकें। नीचे दी गई तालिका उन आवश्यक मेट्रिक्स को सूचीबद्ध करती है जिन्हें ट्रैक किया जाना चाहिए।

|नाम	|मेट्रिक	|विवरण	|
|---	|---	|---	|
|Node status	|kube_node_status_condition	|नोड की वर्तमान स्वास्थ्य स्थिति। प्रत्येक के लिए node conditions और `true`, `false`, या `unknown` का सेट लौटाता है	|
|वांछित pods	|kube_deployment_spec_replicas या kube_daemonset_status_desired_number_scheduled	|Deployment या DaemonSet के लिए निर्दिष्ट pods की संख्या	|
|वर्तमान pods	|kube_deployment_status_replicas या kube_daemonset_status_current_number_scheduled	|Deployment या DaemonSet में वर्तमान में चल रहे pods की संख्या	|
|Pod capacity	|kube_node_status_capacity_pods	|नोड पर अनुमत अधिकतम pods	|
|उपलब्ध pods	|kube_deployment_status_replicas_available या kube_daemonset_status_number_available	|Deployment या DaemonSet के लिए वर्तमान में उपलब्ध pods की संख्या	|
|अनुपलब्ध pods	|kube_deployment_status_replicas_unavailable या kube_daemonset_status_number_unavailable	|Deployment या DaemonSet के लिए वर्तमान में अनुपलब्ध pods की संख्या	|
|Pod readiness	|kube_pod_status_ready	|क्या कोई pod client requests सर्व करने के लिए तैयार है	|
|Pod status	|kube_pod_status_phase	|Pod की वर्तमान स्थिति; मान pending/running/succeeded/failed/unknown होगा	|
|Pod waiting कारण	|kube_pod_container_status_waiting_reason	|कंटेनर के waiting state में होने का कारण	|
|Pod termination status	|kube_pod_container_status_terminated	|क्या कंटेनर वर्तमान में terminated state में है या नहीं	|
|शेड्यूलिंग के लिए pending pods	|pending_pods	|Node असाइनमेंट की प्रतीक्षा करने वाले pods की संख्या	|
|Pod शेड्यूलिंग प्रयास	|pod_scheduling_attempts	|Pods शेड्यूल करने के लिए किए गए प्रयासों की संख्या	|

## Cluster Add-on मेट्रिक्स

Cluster add-on वह सॉफ्टवेयर है जो Kubernetes एप्लिकेशन को सहायक संचालन क्षमताएं प्रदान करता है। इसमें observability एजेंट्स या Kubernetes ड्राइवर जैसे सॉफ्टवेयर शामिल हैं जो क्लस्टर को नेटवर्किंग, कंप्यूट और स्टोरेज के लिए अंतर्निहित AWS रिसोर्सेज के साथ इंटरैक्ट करने की अनुमति देते हैं। Add-on सॉफ्टवेयर आमतौर पर Kubernetes समुदाय, AWS जैसे क्लाउड प्रदाताओं, या तृतीय-पक्ष विक्रेताओं द्वारा बनाया और रखरखाव किया जाता है। Amazon EKS स्वचालित रूप से प्रत्येक क्लस्टर के लिए Amazon VPC CNI plugin for Kubernetes, `kube-proxy`, और CoreDNS जैसे self-managed add-ons इंस्टॉल करता है।

ये Cluster add-ons नेटवर्किंग, डोमेन नेम रिज़ॉल्यूशन आदि जैसे विभिन्न क्षेत्रों में संचालन सहायता प्रदान करते हैं। ये आपको महत्वपूर्ण सहायक इंफ्रास्ट्रक्चर और कंपोनेंट्स कैसे संचालित हो रहे हैं, इसमें अंतर्दृष्टि प्रदान करते हैं। Add-on मेट्रिक्स को ट्रैक करना आपके क्लस्टर के संचालन स्वास्थ्य को समझने के लिए महत्वपूर्ण है।

नीचे वे आवश्यक add-ons हैं जिनकी मॉनिटरिंग पर आपको विचार करना चाहिए उनके आवश्यक मेट्रिक्स के साथ।

## Amazon VPC CNI Plugin

Amazon EKS, Amazon VPC Container Network Interface (VPC CNI) प्लगइन के माध्यम से क्लस्टर नेटवर्किंग लागू करता है। CNI प्लगइन Kubernetes Pods को VPC नेटवर्क पर वही IP एड्रेस रखने की अनुमति देता है। अधिक विशेष रूप से, Pod के अंदर सभी कंटेनर एक नेटवर्क namespace साझा करते हैं, और वे local ports का उपयोग करके एक-दूसरे से संवाद कर सकते हैं। VPC CNI add-on आपको अपने Amazon EKS क्लस्टर की सुरक्षा और स्थिरता को लगातार सुनिश्चित करने और add-ons को इंस्टॉल, कॉन्फ़िगर और अपडेट करने के लिए आवश्यक प्रयास को कम करने में सक्षम बनाता है।

VPC CNI add-on मेट्रिक्स CNI Metrics Helper द्वारा एक्सपोज की जाती हैं। IP एड्रेस आवंटन की मॉनिटरिंग एक स्वस्थ क्लस्टर सुनिश्चित करने और IP exhaustion समस्याओं से बचने के लिए मौलिक है। [यहाँ नवीनतम नेटवर्किंग सर्वोत्तम प्रथाएं और एकत्र और मॉनिटर करने के लिए VPC CNI मेट्रिक्स हैं](https://aws.github.io/aws-eks-best-practices/networking/vpc-cni/#monitor-ip-address-inventory)।

## CoreDNS मेट्रिक्स

CoreDNS एक लचीला, विस्तारयोग्य DNS सर्वर है जो Kubernetes क्लस्टर DNS के रूप में कार्य कर सकता है। CoreDNS pods क्लस्टर में सभी pods के लिए नाम समाधान प्रदान करते हैं। DNS-गहन वर्कलोड चलाने पर कभी-कभी DNS throttling के कारण रुक-रुक कर CoreDNS विफलताएं अनुभव हो सकती हैं, और यह एप्लिकेशन को प्रभावित कर सकता है।

प्रमुख [CoreDNS प्रदर्शन मेट्रिक्स ट्रैक करने के लिए नवीनतम सर्वोत्तम प्रथाएं यहाँ](https://aws.github.io/aws-eks-best-practices/reliability/docs/dataplane/#monitor-coredns-metrics) और [DNS throttling समस्याओं के लिए CoreDNS ट्रैफ़िक मॉनिटरिंग](https://aws.github.io/aws-eks-best-practices/networking/monitoring/) देखें।


## Pod/Container मेट्रिक्स

आपके एप्लिकेशन की सभी परतों में उपयोग का ट्रैक रखना महत्वपूर्ण है, इसमें आपके क्लस्टर के अंदर चल रहे nodes और pods पर करीब से नज़र डालना शामिल है। Pod डाइमेंशन पर उपलब्ध सभी मेट्रिक्स में से, मेट्रिक्स की यह सूची आपके क्लस्टर पर चल रहे वर्कलोड की स्थिति को समझने के लिए व्यावहारिक उपयोग की है। CPU, मेमोरी और नेटवर्क उपयोग को ट्रैक करना एप्लिकेशन संबंधित समस्याओं के निदान और troubleshooting की अनुमति देता है। आपके वर्कलोड मेट्रिक्स को ट्रैक करना EKS पर चल रहे आपके वर्कलोड को सही आकार देने के लिए आपके रिसोर्स उपयोग में अंतर्दृष्टि प्रदान करता है।

|मेट्रिक	|उदाहरण PromQL Query	|डाइमेंशन	|
|---	|---	|---	|
|प्रति namespace चल रहे pods की संख्या	|count by(namespace) (kube_pod_info)	|Per Cluster by Namespace	|
|प्रति pod प्रति container CPU उपयोग	|sum(rate(container_cpu_usage_seconds_total\{container!=""\}[5m])) by (namespace, pod)	|Per Cluster by Namespace by Pod	|
|प्रति pod मेमोरी उपयोग	|sum(container_memory_usage_bytes\{container!=""\}) by (namespace, pod)	|Per Cluster by Namespace by Pod	|
|प्रति pod प्राप्त नेटवर्क बाइट्स	|sum by(pod) (rate(container_network_receive_bytes_total[5m]))	|Per Cluster by Namespace by Pod	|
|प्रति pod प्रेषित नेटवर्क बाइट्स	|sum by(pod) (rate(container_network_transmit_bytes_total[5m]))	|Per Cluster by Namespace by Pod	|
|प्रति container कंटेनर restarts की संख्या	|increase(kube_pod_container_status_restarts_total[15m]) > 3	|Per Cluster by Namespace by Pod	|

## Node मेट्रिक्स

Kube State Metrics और Prometheus node exporter आपके क्लस्टर में nodes पर मेट्रिक आँकड़े एकत्र करते हैं। आपके nodes की status, cpu उपयोग, मेमोरी, filesystem और ट्रैफ़िक को ट्रैक करना आपके node उपयोग को समझने के लिए महत्वपूर्ण है। आपके nodes के रिसोर्सेज का कैसे उपयोग किया जा रहा है यह समझना आपके क्लस्टर पर चलाने की अपेक्षा रखने वाले वर्कलोड के प्रकारों के लिए इंस्टेंस types और स्टोरेज को प्रभावी ढंग से चुनने के लिए महत्वपूर्ण है। नीचे दिए गए मेट्रिक्स कुछ आवश्यक मेट्रिक्स हैं जिन्हें आपको ट्रैक करना चाहिए।


|मेट्रिक	|उदाहरण PromQL Query	|डाइमेंशन	|
|---	|---	|---	|
|Node CPU उपयोग	|sum(rate(container_cpu_usage_seconds_total\{container!=""\}[5m])) by (node)	|Per Cluster by Node	|
|Node मेमोरी उपयोग	|sum(container_memory_usage_bytes\{container!=""\}) by (node)	|Per Cluster by Node	|
|Node नेटवर्क कुल बाइट्स	|sum by (instance) (rate(node_network_receive_bytes_total[3m]))+sum by (instance) (rate(node_network_transmit_bytes_total[3m]))	|Per Cluster by Node	|
|Node CPU आरक्षित capacity	|sum(kube_node_status_capacity\{cluster!=""\}) by (node)	|Per Cluster by Node	|
|प्रति Node चल रहे Pods की संख्या	|sum(kubelet_running_pods) by (instance)	|Per Cluster by Node	||Node Filesystem उपयोग	|rate(container_fs_reads_bytes_total\{job="kubelet", device=~"mmcblk.p.+|.*nvme.+|rbd.+|sd.+|vd.+|xvd.+|dm-.+|dasd.+", container!="", cluster="", namespace!=""\}[$__rate_interval]) + rate(container_fs_writes_bytes_total\{job="kubelet", device=~"mmcblk.p|.*nvme.+|rbd.+|sd.+|vd.+|xvd.+|dm-.+|dasd.+",container!="", cluster="", namespace!=""\}	|Per Cluster by Node	|
|Cluster CPU उपयोग	|sum(rate(node_cpu_seconds_total\{mode!="idle",mode!="iowait",mode!="steal"\}[5m]))	|Per Cluster	|
|Cluster मेमोरी उपयोग	|1 - sum(:node_memory_MemAvailable_bytes:sum\{cluster=""\}) / sum(node_memory_MemTotal_bytes\job="node-exporter",cluster=""\})	|Per Cluster	|
|Cluster नेटवर्क कुल बाइट्स	|sum(rate(node_network_receive_bytes_total[3m]))+sum(rate(node_network_transmit_bytes_total[3m]))	|Per Cluster	|
|चल रहे Pods की संख्या	|sum(kubelet_running_pod_count\{cluster=""\})	|Per Cluster	|
|चल रहे Containers की संख्या	|sum(kubelet_running_container_count\{cluster=""\})	|Per Cluster	|
|Cluster CPU सीमा	|sum(kube_node_status_allocatable\{resource="cpu"\})	|Per Cluster	|
|Cluster मेमोरी सीमा	|sum(kube_node_status_allocatable\{resource="memory"\})	|Per Cluster	|
|Cluster Node गणना	|count(kube_node_info) OR sum(kubelet_node_name\{cluster=""\})	|Per Cluster	|

# अतिरिक्त संसाधन

## AWS सेवाएँ

[https://aws-otel.github.io/](https://aws-otel.github.io/)

[https://aws.amazon.com/prometheus](https://aws.amazon.com/prometheus)

[https://aws.amazon.com/cloudwatch/features/](https://aws.amazon.com/cloudwatch/features/)

## ब्लॉग

[https://aws.amazon.com/blogs/containers/](https://aws.amazon.com/blogs/containers/)

[https://aws.amazon.com/blogs/containers/metrics-and-traces-collection-using-amazon-eks-add-ons-for-aws-distro-for-opentelemetry/](https://aws.amazon.com/blogs/containers/metrics-and-traces-collection-using-amazon-eks-add-ons-for-aws-distro-for-opentelemetry/)

[https://aws.amazon.com/blogs/containers/](https://aws.amazon.com/blogs/containers/)

[https://aws.amazon.com/blogs/containers/introducing-amazon-cloudwatch-container-insights-for-amazon-eks-fargate-using-aws-distro-for-opentelemetry/](https://aws.amazon.com/blogs/containers/introducing-amazon-cloudwatch-container-insights-for-amazon-eks-fargate-using-aws-distro-for-opentelemetry/)

## Infrastructure as Code संसाधन

[https://github.com/aws-observability/terraform-aws-observability-accelerator](https://github.com/aws-observability/terraform-aws-observability-accelerator)

[https://github.com/aws-ia/terraform-aws-eks-blueprints](https://github.com/aws-ia/terraform-aws-eks-blueprints)

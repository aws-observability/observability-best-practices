# Amazon Managed Grafana के साथ GitOps और Grafana Operator का उपयोग

## इस गाइड का उपयोग कैसे करें

यह Observability सर्वोत्तम प्रथाओं की गाइड उन डेवलपर्स और आर्किटेक्ट्स के लिए है जो यह समझना चाहते हैं कि अपने Amazon EKS क्लस्टर पर Kubernetes operator के रूप में [grafana-operator](https://github.com/grafana-operator/grafana-operator#:~:text=The%20grafana%2Doperator%20is%20a,an%20easy%20and%20scalable%20way.) का उपयोग करके Kubernetes native तरीके से Amazon Managed Grafana में Grafana संसाधनों और Grafana dashboards की lifecycle कैसे बनाएं और प्रबंधित करें।

## परिचय

ग्राहक ओपन सोर्स analytics और monitoring समाधान के लिए Grafana को observability platform के रूप में उपयोग करते हैं। हमने देखा है कि Amazon EKS में अपने वर्कलोड चलाने वाले ग्राहक workload gravity की ओर अपना ध्यान केंद्रित करना चाहते हैं और Cloud संसाधनों जैसे बाहरी संसाधनों की lifecycle deploy और प्रबंधित करने के लिए Kubernetes-native controllers पर निर्भर रहना चाहते हैं। हमने देखा है कि ग्राहक AWS services बनाने, deploy करने और प्रबंधित करने के लिए [AWS Controllers for Kubernetes (ACK)](https://aws-controllers-k8s.github.io/community/docs/community/overview/) इंस्टॉल करते हैं। कई ग्राहक इन दिनों Prometheus और Grafana कार्यान्वयन को managed services पर offload करने का विकल्प चुनते हैं और AWS के मामले में ये सेवाएं अपने वर्कलोड की निगरानी के लिए [Amazon Managed Service for Prometheus](https://docs.aws.amazon.com/prometheus/?icmpid=docs_homepage_mgmtgov) और [Amazon Managed Grafana](https://docs.aws.amazon.com/grafana/?icmpid=docs_homepage_mgmtgov) हैं।

एक सामान्य चुनौती जो ग्राहकों को Grafana उपयोग करते समय आती है वह है, अपने Kubernetes cluster से Amazon Managed Grafana जैसे बाहरी Grafana instances में Grafana संसाधनों और Grafana dashboards की lifecycle बनाना और प्रबंधित करना। ग्राहकों को अपने पूरे सिस्टम के infrastructure और application deployment को Git आधारित workflows का उपयोग करके पूरी तरह से automate और प्रबंधित करने के तरीके खोजने में चुनौतियों का सामना करना पड़ता है जिसमें Amazon Managed Grafana में Grafana संसाधन बनाना भी शामिल है। इस Observability सर्वोत्तम प्रथाओं की गाइड में, हम निम्नलिखित विषयों पर ध्यान केंद्रित करेंगे:

* Grafana Operator पर परिचय - आपके Kubernetes cluster से बाहरी Grafana instances प्रबंधित करने के लिए एक Kubernetes operator
* GitOps पर परिचय - Git आधारित workflows का उपयोग करके आपके infrastructure को बनाने और प्रबंधित करने के लिए automated mechanisms
* Amazon Managed Grafana प्रबंधित करने के लिए Amazon EKS पर Grafana Operator का उपयोग
* Amazon Managed Grafana प्रबंधित करने के लिए Amazon EKS पर Flux के साथ GitOps का उपयोग

## Grafana Operator पर परिचय

[grafana-operator](https://github.com/grafana-operator/grafana-operator#:~:text=The%20grafana%2Doperator%20is%20a,an%20easy%20and%20scalable%20way.) एक Kubernetes operator है जो Kubernetes के अंदर आपके Grafana instances को प्रबंधित करने में मदद करने के लिए बनाया गया है। Grafana Operator आपके लिए कई instances के बीच declaratively Grafana dashboards, datasources आदि प्रबंधित करना और बनाना आसान और scalable तरीके से संभव बनाता है। Grafana operator अब Amazon Managed Grafana जैसे बाहरी environments पर hosted dashboards, datasources आदि जैसे संसाधनों को प्रबंधित करने का समर्थन करता है। यह अंततः हमें Amazon EKS cluster से Amazon Managed Grafana में संसाधनों की lifecycle बनाने और प्रबंधित करने के लिए [Flux](https://fluxcd.io/) जैसे CNCF projects का उपयोग करके GitOps mechanisms का उपयोग करने में सक्षम बनाता है।

## GitOps पर परिचय

### GitOps और Flux क्या है

GitOps एक software development और operations पद्धति है जो deployment configurations के लिए Git को source of truth के रूप में उपयोग करती है। इसमें किसी application या infrastructure की वांछित स्थिति को Git repository में रखना और परिवर्तनों को प्रबंधित और deploy करने के लिए Git-based workflows का उपयोग करना शामिल है। GitOps application और infrastructure deployment को प्रबंधित करने का एक तरीका है ताकि पूरे सिस्टम को Git repository में declaratively वर्णित किया जा सके। यह एक operational model है जो आपको version control, immutable artifacts, और automation की सर्वोत्तम प्रथाओं का लाभ उठाते हुए कई Kubernetes clusters की स्थिति प्रबंधित करने की क्षमता प्रदान करता है।

Flux एक GitOps tool है जो Kubernetes पर applications के deployment को automate करता है। यह Git repository की स्थिति की लगातार निगरानी करके और cluster पर किसी भी परिवर्तन को लागू करके काम करता है। Flux विभिन्न Git providers जैसे GitHub, [GitLab](https://dzone.com/articles/auto-deploy-spring-boot-app-using-gitlab-cicd/), और Bitbucket के साथ integrate होता है। जब repository में परिवर्तन किए जाते हैं, तो Flux स्वचालित रूप से उनका पता लगाता है और तदनुसार cluster को अपडेट करता है।

### Flux उपयोग करने के लाभ

* **Automated deployments**: Flux deployment प्रक्रिया को automate करता है, manual errors को कम करता है और developers को अन्य कार्यों पर ध्यान केंद्रित करने के लिए मुक्त करता है।
* **Git-based workflow**: Flux source of truth के रूप में Git का लाभ उठाता है, जो परिवर्तनों को ट्रैक और revert करना आसान बनाता है।
* **Declarative configuration**: Flux cluster की वांछित स्थिति को परिभाषित करने के लिए [Kubernetes](https://dzone.com/articles/kubernetes-full-stack-example-with-kong-ingress-co/) manifests का उपयोग करता है, जिससे परिवर्तनों को प्रबंधित और ट्रैक करना आसान हो जाता है।

### Flux अपनाने में चुनौतियां

* **सीमित customization**: Flux केवल customizations के एक सीमित सेट का समर्थन करता है, जो सभी use cases के लिए उपयुक्त नहीं हो सकता है।
* **कठिन learning curve**: नए उपयोगकर्ताओं के लिए Flux की learning curve कठिन है और Kubernetes और Git की गहरी समझ की आवश्यकता है।

## Amazon Managed Grafana में संसाधनों को प्रबंधित करने के लिए Amazon EKS पर Grafana Operator का उपयोग

जैसा कि पिछले अनुभाग में चर्चा की गई, Grafana Operator हमें Kubernetes native तरीके से Amazon Managed Grafana में संसाधनों की lifecycle बनाने और प्रबंधित करने के लिए अपने Kubernetes cluster का उपयोग करने में सक्षम बनाता है। नीचे दिया गया architecture diagram Kubernetes cluster को control plane के रूप में दिखाता है जो AMG के साथ identity सेटअप करने, Amazon Managed Service for Prometheus को data source के रूप में जोड़ने और Amazon EKS cluster से Kubernetes native तरीके से Amazon Managed Grafana पर dashboards बनाने के लिए Grafana Operator का उपयोग करता है।

![GitOPS-WITH-AMG-2](../../../images/Operational/gitops-with-amg/gitops-with-amg-2.jpg)

अपने Amazon EKS cluster पर उपरोक्त समाधान deploy करने के विस्तृत प्रदर्शन के लिए कृपया हमारी पोस्ट [Using Open Source Grafana Operator on your Kubernetes cluster to manage Amazon Managed Grafana](https://aws.amazon.com/blogs/mt/using-open-source-grafana-operator-on-your-kubernetes-cluster-to-manage-amazon-managed-grafana/) देखें।

## Amazon Managed Grafana में संसाधनों को प्रबंधित करने के लिए Amazon EKS पर Flux के साथ GitOps का उपयोग

जैसा कि ऊपर चर्चा की गई, Flux Kubernetes पर applications के deployment को automate करता है। यह GitHub जैसी Git repository की स्थिति की लगातार निगरानी करके काम करता है और जब repository में परिवर्तन किए जाते हैं, तो Flux स्वचालित रूप से उनका पता लगाता है और तदनुसार cluster को अपडेट करता है। कृपया नीचे दिए गए architecture को देखें जहां हम दिखाएंगे कि कैसे अपने Kubernetes cluster से Grafana Operator और Flux का उपयोग करके GitOps mechanisms के साथ Kubernetes native तरीके से Amazon Managed Service for Prometheus को data source के रूप में जोड़ें और Amazon Managed Grafana में dashboards बनाएं।

![GitOPS-WITH-AMG-1](../../../images/Operational/gitops-with-amg/gitops-with-amg-1.jpg)

कृपया हमारे One Observability Workshop मॉड्यूल - [GitOps with Amazon Managed Grafana](https://catalog.workshops.aws/observability/en-US/aws-managed-oss/gitops-with-amg) देखें। यह मॉड्यूल आपके EKS cluster पर निम्नलिखित जैसे आवश्यक "Day 2" operational tooling सेटअप करता है:

* [External Secrets Operator](https://github.com/external-secrets/external-secrets/tree/main/deploy/charts/external-secrets) AWS Secret Manager से Amazon Managed Grafana secrets पढ़ने के लिए सफलतापूर्वक इंस्टॉल किया गया है
* [Prometheus Node Exporter](https://github.com/prometheus/node_exporter) memory, disk और CPU utilization जैसे विभिन्न machine resources को मापने के लिए
* [Grafana Operator](https://github.com/grafana-operator/grafana-operator) Kubernetes native तरीके से Amazon Managed Grafana में संसाधनों की lifecycle बनाने और प्रबंधित करने के लिए अपने Kubernetes cluster का उपयोग करने हेतु।
* [Flux](https://fluxcd.io/) GitOps mechanisms का उपयोग करके Kubernetes पर applications के deployment को automate करने के लिए।

## निष्कर्ष

Observability सर्वोत्तम प्रथाओं की गाइड के इस अनुभाग में, हमने Amazon Managed Grafana के साथ Grafana Operator और GitOps के उपयोग के बारे में सीखा। हमने GitOps और Grafana Operator के बारे में सीखकर शुरुआत की। फिर हमने इस पर ध्यान केंद्रित किया कि Amazon Managed Grafana में संसाधनों को प्रबंधित करने के लिए Amazon EKS पर Grafana Operator का उपयोग कैसे करें और Amazon Managed Grafana में संसाधनों को प्रबंधित करने के लिए Amazon EKS पर Flux के साथ GitOps का उपयोग कैसे करें ताकि AMG के साथ identity सेटअप करें, Amazon EKS cluster से Kubernetes native तरीके से Amazon Managed Grafana पर AWS data sources जोड़ें।

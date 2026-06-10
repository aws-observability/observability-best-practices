# Amazon Managed Service for Prometheus डिप्लॉय करने और Alert Manager कॉन्फ़िगर करने के लिए Infrastructure as Code के रूप में Terraform

इस रेसिपी में, हम प्रदर्शित करेंगे कि आप [Terraform](https://www.terraform.io/) का उपयोग करके [Amazon Managed Service for Prometheus](https://aws.amazon.com/prometheus/) को प्रोविज़न कैसे कर सकते हैं और किसी निश्चित शर्त पूरी होने पर [SNS](https://docs.aws.amazon.com/sns/) टॉपिक पर नोटिफिकेशन भेजने के लिए नियम प्रबंधन और Alert Manager कैसे कॉन्फ़िगर कर सकते हैं।


:::note
    इस गाइड को पूरा करने में लगभग 30 मिनट लगेंगे।
:::
## पूर्वापेक्षाएँ

सेटअप पूरा करने के लिए आपको निम्नलिखित की आवश्यकता होगी:

* [Amazon EKS क्लस्टर](https://docs.aws.amazon.com/eks/latest/userguide/create-cluster.html)
* [AWS CLI version 2](https://docs.aws.amazon.com/cli/latest/userguide/install-cliv2.html)
* [Terraform CLI](https://www.terraform.io/downloads)
* [AWS Distro for OpenTelemetry(ADOT)](https://aws-otel.github.io/)
* [eksctl](https://eksctl.io/)
* [kubectl](https://docs.aws.amazon.com/eks/latest/userguide/install-kubectl.html)
* [jq](https://stedolan.github.io/jq/download/)
* [helm](https://helm.sh/)
* [SNS टॉपिक](https://docs.aws.amazon.com/sns/latest/dg/sns-create-topic.html)
* [awscurl](https://github.com/okigan/awscurl)

इस रेसिपी में, हम ADOT का उपयोग करके मेट्रिक स्क्रेपिंग और Amazon Managed Service for Prometheus वर्कस्पेस में remote write का प्रदर्शन करने के लिए एक सैंपल एप्लिकेशन का उपयोग करेंगे। [aws-otel-community](https://github.com/aws-observability/aws-otel-community) रिपॉजिटरी से सैंपल ऐप को फ़ोर्क और क्लोन करें।

यह Prometheus सैंपल ऐप सभी 4 Prometheus मेट्रिक प्रकार (counter, gauge, histogram, summary) जनरेट करता है और उन्हें /metrics endpoint पर एक्सपोज़ करता है।

/ पर एक हेल्थ चेक endpoint भी मौजूद है।

कॉन्फ़िगरेशन के लिए वैकल्पिक कमांड लाइन फ़्लैग्स की सूची निम्नलिखित है:

listen_address: (डिफ़ॉल्ट = 0.0.0.0:8080) सैंपल ऐप जिस पते और पोर्ट पर एक्सपोज़ है उसे परिभाषित करता है।

metric_count: (डिफ़ॉल्ट=1) जनरेट करने के लिए प्रत्येक प्रकार की मेट्रिक की मात्रा।

label_count: (डिफ़ॉल्ट=1) प्रति मेट्रिक जनरेट करने के लिए लेबल की मात्रा।


datapoint_count: (डिफ़ॉल्ट=1) प्रति मेट्रिक जनरेट करने के लिए डेटा-पॉइंट्स की संख्या।

### AWS Distro for OpenTelemetry का उपयोग करके मेट्रिक संग्रह सक्षम करना
1. aws-otel-community रिपॉजिटरी से सैंपल ऐप को फ़ोर्क और क्लोन करें। फिर निम्नलिखित कमांड चलाएं।

```
cd ./sample-apps/prometheus
docker build . -t prometheus-sample-app:latest
```
2. इस इमेज को Amazon ECR जैसी रजिस्ट्री में पुश करें। अपने खाते में एक नई ECR रिपॉजिटरी बनाने के लिए निम्नलिखित कमांड का उपयोग करें। "YOUR_REGION" सेट करना सुनिश्चित करें।

```
aws ecr create-repository \
    --repository-name prometheus-sample-app \
    --image-scanning-configuration scanOnPush=true \
    --region <YOUR_REGION>
```
3. इस Kubernetes कॉन्फ़िगरेशन को कॉपी और अप्लाई करके क्लस्टर में सैंपल ऐप डिप्लॉय करें। prometheus-sample-app.yaml फ़ाइल में `PUBLIC_SAMPLE_APP_IMAGE` को अभी पुश की गई इमेज से बदलें।

```
curl https://raw.githubusercontent.com/aws-observability/aws-otel-collector/main/examples/eks/aws-prometheus/prometheus-sample-app.yaml -o prometheus-sample-app.yaml
kubectl apply -f prometheus-sample-app.yaml
```
4. ADOT Collector का एक डिफ़ॉल्ट इंस्टेंस शुरू करें। ऐसा करने के लिए, पहले ADOT Collector का Kubernetes कॉन्फ़िगरेशन प्राप्त करने के लिए निम्नलिखित कमांड दर्ज करें।

```
curl https://raw.githubusercontent.com/aws-observability/aws-otel-collector/main/examples/eks/aws-prometheus/prometheus-daemonset.yaml -o prometheus-daemonset.yaml
```
फिर टेम्पलेट फ़ाइल को संपादित करें, अपने Amazon Managed Service for Prometheus वर्कस्पेस के remote_write endpoint को `YOUR_ENDPOINT` के स्थान पर और अपने रीजन को `YOUR_REGION` के स्थान पर रखें। Amazon Managed Service for Prometheus कंसोल में जब आप अपनी वर्कस्पेस विवरण देखते हैं तो प्रदर्शित remote_write endpoint का उपयोग करें। आपको Kubernetes कॉन्फ़िगरेशन के service account अनुभाग में `YOUR_ACCOUNT_ID` को अपनी AWS खाता ID से भी बदलना होगा।

इस रेसिपी में, ADOT Collector कॉन्फ़िगरेशन एक एनोटेशन `(scrape=true)` का उपयोग करता है जो बताता है कि कौन से target endpoints को स्क्रेप करना है। इससे ADOT Collector आपके क्लस्टर में kube-system endpoints से सैंपल ऐप endpoint को अलग कर सकता है। यदि आप एक अलग सैंपल ऐप को स्क्रेप करना चाहते हैं तो आप इसे re-label कॉन्फ़िगरेशन से हटा सकते हैं।
5. ADOT Collector डिप्लॉय करने के लिए निम्नलिखित कमांड दर्ज करें।
```
kubectl apply -f eks-prometheus-daemonset.yaml
```

### Terraform के साथ वर्कस्पेस कॉन्फ़िगर करें

अब, हम एक Amazon Managed Service for Prometheus वर्कस्पेस प्रोविज़न करेंगे और एक अलर्टिंग नियम परिभाषित करेंगे जो Alert Manager को एक निश्चित शर्त (```expr``` में परिभाषित) एक निर्दिष्ट समय अवधि (```for```) तक सत्य रहने पर नोटिफिकेशन भेजने का कारण बनता है। Terraform भाषा में कोड .tf फ़ाइल एक्सटेंशन वाली सादे टेक्स्ट फ़ाइलों में संग्रहीत होता है। भाषा का एक JSON-आधारित संस्करण भी है जिसे .tf.json फ़ाइल एक्सटेंशन के साथ नामित किया गया है।

अब हम Terraform का उपयोग करके संसाधनों को डिप्लॉय करने के लिए [main.tf](./amp-alertmanager-terraform/main.tf) का उपयोग करेंगे। Terraform कमांड चलाने से पहले, हम `region` और `sns_topic` वेरिएबल एक्सपोर्ट करेंगे।

```
export TF_VAR_region=<your region>
export TF_VAR_sns_topic=<ARN of the SNS topic used by the SNS receiver>
```

अब, वर्कस्पेस प्रोविज़न करने के लिए नीचे दिए गए कमांड निष्पादित करेंगे:

```
terraform init
terraform plan
terraform apply
```

ऊपर के चरण पूरे होने के बाद, awscurl का उपयोग करके endpoint को क्वेरी करके एंड-टू-एंड सेटअप सत्यापित करें। सुनिश्चित करें कि `WORKSPACE_ID` वेरिएबल को उपयुक्त Amazon Managed Service for Prometheus वर्कस्पेस ID से बदला गया है।

नीचे दिया गया कमांड चलाने पर, "metric:recording_rule" मेट्रिक देखें, और यदि आप मेट्रिक को सफलतापूर्वक पाते हैं, तो आपने सफलतापूर्वक एक recording rule बनाया है:

```
awscurl https://aps-workspaces.us-east-1.amazonaws.com/workspaces/$WORKSPACE_ID/api/v1/rules  --service="aps"
```
सैंपल आउटपुट:
```
"status":"success","data":{"groups":[{"name":"alert-test","file":"rules","rules":[{"state":"firing","name":"metric:alerting_rule","query":"rate(adot_test_counter0[5m]) > 5","duration":0,"labels":{},"annotations":{},"alerts":[{"labels":{"alertname":"metric:alerting_rule"},"annotations":{},"state":"firing","activeAt":"2021-09-16T13:20:35.9664022Z","value":"6.96890019778219e+01"}],"health":"ok","lastError":"","type":"alerting","lastEvaluation":"2021-09-16T18:41:35.967122005Z","evaluationTime":0.018121408}],"interval":60,"lastEvaluation":"2021-09-16T18:41:35.967104769Z","evaluationTime":0.018142997},{"name":"test","file":"rules","rules":[{"name":"metric:recording_rule","query":"rate(adot_test_counter0[5m])","labels":{},"health":"ok","lastError":"","type":"recording","lastEvaluation":"2021-09-16T18:40:44.650001548Z","evaluationTime":0.018381387}],"interval":60,"lastEvaluation":"2021-09-16T18:40:44.649986468Z","evaluationTime":0.018400463}]},"errorType":"","error":""}
```

हम इसकी पुष्टि करने के लिए alertmanager endpoint को और क्वेरी कर सकते हैं:
```
awscurl https://aps-workspaces.us-east-1.amazonaws.com/workspaces/$WORKSPACE_ID/alertmanager/api/v2/alerts --service="aps" -H "Content-Type: application/json"
```
सैंपल आउटपुट:
```
[{"annotations":{},"endsAt":"2021-09-16T18:48:35.966Z","fingerprint":"114212a24ca97549","receivers":[{"name":"default"}],"startsAt":"2021-09-16T13:20:35.966Z","status":{"inhibitedBy":[],"silencedBy":[],"state":"active"},"updatedAt":"2021-09-16T18:44:35.984Z","generatorURL":"/graph?g0.expr=sum%28rate%28envoy_http_downstream_rq_time_bucket%5B1m%5D%29%29+%3E+5&g0.tab=1","labels":{"alertname":"metric:alerting_rule"}}]
```
यह पुष्टि करता है कि अलर्ट ट्रिगर हुआ और SNS receiver के माध्यम से SNS को भेजा गया।

## सफाई

Amazon Managed Service for Prometheus वर्कस्पेस को समाप्त करने के लिए निम्नलिखित कमांड चलाएं। सुनिश्चित करें कि बनाई गई EKS क्लस्टर को भी हटा दें:


```
terraform destroy
```


# Managed Grafana में [**kubernetes-mixin**](https://github.com/kubernetes-monitoring/kubernetes-mixin) डैशबोर्ड जोड़ना

एक प्रबंधित सेवा होने के बावजूद, EKS अभी भी Kubernetes कंट्रोल प्लेन से कई मेट्रिक्स एक्सपोज़ करता है। Prometheus समुदाय ने इन मेट्रिक्स की समीक्षा और जांच करने के लिए डैशबोर्ड की एक शृंखला तैयार की है। यह दस्तावेज़ आपको दिखाएगा कि Amazon Managed Service for Prometheus द्वारा होस्ट किए गए एनवायरनमेंट में इन्हें कैसे इंस्टॉल करें।

Prometheus mixin प्रोजेक्ट उम्मीद करता है कि Prometheus Operator के माध्यम से Prometheus इंस्टॉल किया गया है, लेकिन Terraform blueprints डिफ़ॉल्ट helm charts के माध्यम से Prometheus agent इंस्टॉल करते हैं। स्क्रेपिंग जॉब्स और डैशबोर्ड को संरेखित करने के लिए, हमें Prometheus नियमों और mixin डैशबोर्ड कॉन्फ़िगरेशन को अपडेट करना होगा, फिर डैशबोर्ड को हमारे Grafana इंस्टेंस में अपलोड करना होगा।


## पूर्वापेक्षाएँ

* एक EKS क्लस्टर - यहाँ से शुरू करें: [https://github.com/aws-ia/terraform-aws-eks-blueprints/tree/main/examples/complete-kubernetes-addons](https://github.com/aws-ia/terraform-aws-eks-blueprints/tree/main/)
* एक Cloud9 एनवायरनमेंट
* Cloud9 में kubectl EKS क्लस्टर को प्रबंधित करने के लिए कॉन्फ़िगर
* EKS के लिए IAM क्रेडेंशियल
* AMP का एक इंस्टेंस
* Amazon Managed Grafana का एक इंस्टेंस


## mixin डैशबोर्ड इंस्टॉल करना


एक नए Cloud9 इंस्टेंस से शुरू करते हुए और पूर्वापेक्षाओं में लिंक किए गए AWS blueprint for terraform complete addon उदाहरण को लक्ष्य EKS क्लस्टर के रूप में उपयोग करते हुए:

Cloud9 इंस्टेंस का फ़ाइल सिस्टम कम से कम 20 GB तक विस्तारित करें। EC2 कंसोल में, EBS वॉल्यूम को 20 GB तक बढ़ाएं फिर Cloud9 शेल से, नीचे दिए गए कमांड चलाएं:

```
sudo growpart /dev/nvme0n1 1
sudo xfs_growfs -d /
```


awscli को संस्करण 2 में अपग्रेड करें:

```
sudo yum remove -y awscli
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
unzip awscliv2.zip
sudo ./aws/install
ln -s /usr/local/bin/aws /usr/bin/aws
```


पूर्वापेक्षाएँ इंस्टॉल करें:

```
sudo yum install -y jsonnet
go install -a github.com/jsonnet-bundler/jsonnet-bundler/cmd/jb@latest
export PATH="$PATH:~/go/bin"
```


kubernetes-mixin प्रोजेक्ट के लिए jsonnet लाइब्रेरी डाउनलोड और इंस्टॉल करें:


```
git clone https://github.com/kubernetes-monitoring/kubernetes-mixincd kubernetes-mixin/
jb install
```


config.libsonnet को संपादित करें और Prometheus job नामों से मिलान करने के लिए "selectors" अनुभाग को निम्नलिखित से बदलें:

```
 // Selectors are inserted between {} in Prometheus queries.
 cadvisorSelector: 'job="kubernetes-nodes-cadvisor"',
 kubeletSelector: 'job="kubernetes-nodes"',
 kubeStateMetricsSelector: 'job="kubernetes-service-endpoints"',
 nodeExporterSelector: 'job="kubernetes-service-endpoints"',
 kubeSchedulerSelector: 'job="kube-scheduler"',
 kubeControllerManagerSelector: 'job="kube-controller-manager"',
 kubeApiserverSelector: 'job="kubernetes-apiservers"',
 kubeProxySelector: 'job="kubernetes-nodes"',
 podLabel: 'pod',
 hostNetworkInterfaceSelector: 'device!~"veth.+"',
 hostMountpointSelector: 'mountpoint="/"',
 windowsExporterSelector: 'job="kubernetes-windows-exporter"',
 containerfsSelector: 'container!=""',
```



Prometheus नियम, अलर्ट, और Grafana डैशबोर्ड बिल्ड करें:

```
make prometheus_alerts.yaml
make prometheus_rules.yaml
make dashboards_out
```


Prometheus नियमों को Managed Prometheus पर अपलोड करें। "WORKSPACE-ID" को अपने Managed Prometheus इंस्टेंस की ID से और "REGION" को उपयुक्त मान से बदलें।

```
base64 prometheus_rules.yaml > prometheus_rules.b64
aws amp create-rule-groups-namespace --data file://prometheus_rules.b64 --name kubernetes-mixin  --workspace-id <<WORKSPACE-ID> --region <<REGION>>
```



Cloud9 एनवायरनमेंट से 'dashboard_out' फ़ोल्डर की सामग्री डाउनलोड करें और Grafana वेब UI का उपयोग करके उन्हें अपलोड करें।

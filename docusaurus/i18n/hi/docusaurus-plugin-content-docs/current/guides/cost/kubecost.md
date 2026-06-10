# Kubecost का उपयोग
Kubecost ग्राहकों को Kubernetes वातावरण में खर्च और resource efficiency में visibility प्रदान करता है। उच्च स्तर पर, Amazon EKS cost monitoring Kubecost के साथ डिप्लॉय किया जाता है, जिसमें Prometheus शामिल है, एक ओपन-सोर्स मॉनिटरिंग सिस्टम और time series database। Kubecost Prometheus से metrics पढ़ता है फिर cost allocation calculations करता है और metrics को वापस Prometheus में लिखता है। अंत में, Kubecost front end Prometheus से metrics पढ़ता है और उन्हें Kubecost user interface (UI) पर दिखाता है। आर्किटेक्चर निम्नलिखित डायग्राम द्वारा दर्शाया गया है:

![Architecture](../../images/kubecost-architecture.png)

## Kubecost का उपयोग करने के कारण
जैसे-जैसे ग्राहक अपने एप्लिकेशन को आधुनिक बनाते हैं और Amazon EKS का उपयोग करके वर्कलोड डिप्लॉय करते हैं, वे अपने एप्लिकेशन चलाने के लिए आवश्यक compute resources को consolidate करके efficiencies प्राप्त करते हैं। हालांकि, यह utilization efficiency एप्लिकेशन लागत मापने में बढ़ी हुई कठिनाई के tradeoff पर आती है। आज, आप tenant द्वारा लागत वितरित करने के लिए इनमें से एक विधि का उपयोग कर सकते हैं:

* Hard multi-tenancy — dedicated AWS accounts में अलग EKS clusters चलाएं।
* Soft multi-tenancy — एक shared EKS cluster में कई node groups चलाएं।
* Consumption based billing — एक shared EKS cluster में resource consumption का उपयोग करके incurred लागत की गणना करें।

Hard multi-tenancy के साथ, वर्कलोड अलग EKS clusters में डिप्लॉय किए जाते हैं और आप प्रत्येक tenant के खर्च को निर्धारित करने के लिए reports चलाए बिना cluster और इसकी dependencies के लिए incurred लागत की पहचान कर सकते हैं।
Soft multi-tenancy के साथ, आप Kubernetes features जैसे [Node Selectors](https://kubernetes.io/docs/concepts/scheduling-eviction/assign-pod-node/#nodeselector) और [Node Affinity](https://kubernetes.io/docs/concepts/scheduling-eviction/assign-pod-node/#affinity-and-anti-affinity) का उपयोग करके Kubernetes Scheduler को निर्देश दे सकते हैं कि tenant का वर्कलोड dedicated node groups पर चलाएं। आप एक node group में EC2 instances को एक identifier (जैसे product name या team name) के साथ tag कर सकते हैं और लागत वितरित करने के लिए [tags](https://docs.aws.amazon.com/awsaccountbilling/latest/aboutv2/cost-alloc-tags.html) का उपयोग कर सकते हैं।
उपरोक्त दोनों दृष्टिकोणों का एक नकारात्मक पक्ष यह है कि आपके पास अप्रयुक्त capacity हो सकती है और जब आप एक densely packed cluster चलाते हैं तो आने वाली cost savings का पूरा उपयोग नहीं कर पाएंगे। आपको अभी भी Elastic Load Balancing, network transfer charges जैसे shared resources की लागत allocate करने के तरीकों की आवश्यकता है।

Multi-tenant Kubernetes clusters में लागत ट्रैक करने का सबसे कुशल तरीका वर्कलोड द्वारा consumed resources की मात्रा के आधार पर incurred costs को distribute करना है। यह pattern आपको अपने EC2 instances के utilization को maximize करने की अनुमति देता है क्योंकि विभिन्न वर्कलोड nodes share कर सकते हैं, जो आपको अपने nodes पर pod-density बढ़ाने की अनुमति देता है। हालांकि, वर्कलोड या namespaces द्वारा लागत की गणना करना एक चुनौतीपूर्ण कार्य है। एक वर्कलोड की cost-responsibility को समझने के लिए एक time-frame के दौरान consumed या reserved सभी resources को aggregate करना और resource की लागत और उपयोग की अवधि के आधार पर charges का मूल्यांकन करना आवश्यक है। यही वह चुनौती है जिसे Kubecost हल करने के लिए समर्पित है।

:::tip
    Kubecost पर hands-on अनुभव के लिए हमारे [One Observability Workshop](https://catalog.workshops.aws/observability/en-US/aws-managed-oss/amp/ingest-kubecost-metrics) को देखें।
:::

## अनुशंसाएं
### Cost Allocation
Kubecost Cost Allocation डैशबोर्ड आपको सभी native Kubernetes concepts, जैसे namespace, k8s label, और service में allocated spend और optimization opportunity को तुरंत देखने की अनुमति देता है। यह team, product/project, department, या environment जैसी organizational concepts को लागत allocate करने की भी अनुमति देता है। आप विशिष्ट वर्कलोड के बारे में insights derive करने के लिए Date range, filters को modify कर सकते हैं और report save कर सकते हैं। Kubernetes लागत को optimize करने के लिए, आपको efficiency और cluster idle costs पर ध्यान देना चाहिए।

![Allocations](../../images/allocations.png)

### Efficiency

Pod resource efficiency को एक दिए गए time window में resource utilization बनाम resource request के रूप में परिभाषित किया जाता है। यह cost-weighted है और इसे निम्नानुसार व्यक्त किया जा सकता है:
```
(((CPU Usage / CPU Requested) * CPU Cost) + ((RAM Usage / RAM Requested) * RAM Cost)) / (RAM Cost + CPU Cost)
```
जहां CPU Usage = rate(container_cpu_usage_seconds_total) time window में RAM Usage = avg(container_memory_working_set_bytes) time window में

चूंकि AWS द्वारा explicit RAM, CPU या GPU prices प्रदान नहीं किए जाते, Kubecost model supplied base CPU, GPU और RAM price inputs के ratio पर fall back करता है। इन parameters के लिए default values cloud provider की marginal resource rates पर आधारित हैं, लेकिन इन्हें Kubecost में customize किया जा सकता है। ये base resource (RAM/CPU/GPU) prices यह सुनिश्चित करने के लिए normalize किए जाते हैं कि प्रत्येक component का योग आपके provider से billing rates के आधार पर provisioned node की कुल कीमत के बराबर हो।

अधिकतम efficiency की ओर बढ़ना और लक्ष्य प्राप्त करने के लिए वर्कलोड को fine tune करना प्रत्येक service team की जिम्मेदारी है।

### Idle Cost
Cluster idle cost को allocated resources की लागत और उन hardware की लागत के बीच के अंतर के रूप में परिभाषित किया जाता है जिन पर वे चलते हैं। Allocation को usage और requests के अधिकतम के रूप में परिभाषित किया गया है। इसे निम्नानुसार भी व्यक्त किया जा सकता है:
```
idle_cost = sum(node_cost) - (cpu_allocation_cost + ram_allocation_cost + gpu_allocation_cost)
```
जहां allocation = max(request, usage)

तो, idle costs को उस space की लागत के रूप में भी सोचा जा सकता है जिसमें Kubernetes scheduler किसी भी मौजूदा वर्कलोड को बाधित किए बिना pods schedule कर सकता है, लेकिन वर्तमान में नहीं कर रहा है। आप इसे कैसे configure करना चाहते हैं उसके आधार पर इसे workloads या cluster या nodes को distribute किया जा सकता है।


### Network Cost

Kubecost उन लागतों को उत्पन्न करने वाले workloads को network transfer costs allocate करने के लिए best-effort का उपयोग करता है। Network cost निर्धारित करने का सटीक तरीका [AWS Cloud Integration](https://www.ibm.com/docs/en/kubecost/self-hosted/3.x?topic=integration-aws-cloud-using-irsaeks-pod-identities) और [Network costs daemonset](https://docs.kubecost.com/install-and-configure/advanced-configuration/network-costs-configuration) के संयोजन का उपयोग करना है।

आप cluster को उसकी पूरी क्षमता तक उपयोग करने के लिए workloads को fine tune करने हेतु अपने efficiency score और Idle cost को ध्यान में रखना चाहेंगे। यह हमें अगले विषय अर्थात Cluster right-sizing पर ले जाता है।

### वर्कलोड को राइट-साइज़ करना

Kubecost Kubernetes-native metrics के आधार पर आपके workloads के लिए right-sizing recommendations प्रदान करता है। kubecost UI में savings panel शुरू करने के लिए एक बेहतरीन जगह है।

![Savings](../../images/savings.png)

![Right-sizing](../../images/right-sizing.png)

Kubecost आपको इन पर recommendations दे सकता है:

* Over-provisioned और under-provisioned container request दोनों को देखकर container request को right size करना
* Unused capacity पर over-spending बंद करने के लिए cluster nodes की संख्या और size को adjust करना
* ऐसे pods को scale down, delete / resize करना जो meaningful rate of traffic send या receive नहीं करते
* Spot nodes के लिए तैयार workloads की पहचान करना
* किसी भी pods द्वारा unused volumes की पहचान करना


Kubecost में एक pre-release feature भी है जो container resource requests के लिए स्वचालित रूप से अपनी recommendations implement कर सकता है यदि आपके पास Cluster Controller component सक्षम है। Automatic request right-sizing का उपयोग करने से आप अपने पूरे cluster में resource allocation को तुरंत optimize कर सकते हैं, बिना अत्यधिक YAML या जटिल kubectl commands के परीक्षण के। आप आसानी से अपने cluster में resource over-allocation को समाप्त कर सकते हैं, जो cluster right-sizing और अन्य optimizations के माध्यम से भारी बचत का मार्ग प्रशस्त करता है।

### Kubecost को Amazon Managed Service for Prometheus के साथ Integrate करना

Kubecost एक time series database के रूप में open-source Prometheus project का लाभ उठाता है और cost allocation calculations करने के लिए Prometheus में डेटा को post-process करता है। Cluster size और workload के scale के आधार पर, metrics को scrape और store करना एक Prometheus server के लिए overwhelming हो सकता है। ऐसे मामले में, आप metrics को reliably store करने और बड़े पैमाने पर Kubernetes cost की आसानी से निगरानी करने के लिए Amazon Managed Service for Prometheus, एक managed Prometheus-compatible monitoring service का उपयोग कर सकते हैं।

आपको [Kubecost service accounts के लिए IAM roles](https://docs.aws.amazon.com/eks/latest/userguide/iam-roles-for-service-accounts.html) सेट अप करने होंगे। Cluster के OIDC provider का उपयोग करके, आप अपने cluster के service accounts को IAM permissions grant करते हैं। आपको kubecost-cost-analyzer और kubecost-prometheus-server service accounts को उचित permissions grant करनी होंगी। इनका उपयोग workspace से metrics भेजने और retrieve करने के लिए किया जाएगा। कमांड लाइन पर निम्नलिखित commands चलाएं:

```
eksctl create iamserviceaccount \ 
--name kubecost-cost-analyzer \ 
--namespace kubecost \ 
--cluster <CLUSTER_NAME> \
--region <REGION> \ 
--attach-policy-arn arn:aws:iam::aws:policy/AmazonPrometheusQueryAccess \ 
--attach-policy-arn arn:aws:iam::aws:policy/AmazonPrometheusRemoteWriteAccess \ 
--override-existing-serviceaccounts \ 
--approve 

eksctl create iamserviceaccount \ 
--name kubecost-prometheus-server \ 
--namespace kubecost \ 
--cluster <CLUSTER_NAME> --region <REGION> \ 
--attach-policy-arn arn:aws:iam::aws:policy/AmazonPrometheusQueryAccess \ 
--attach-policy-arn arn:aws:iam::aws:policy/AmazonPrometheusRemoteWriteAccess \ 
--override-existing-serviceaccounts \ 
--approve

```
`CLUSTER_NAME` उस Amazon EKS cluster का नाम है जहां आप Kubecost install करना चाहते हैं और "REGION" Amazon EKS cluster का region है।

पूरा होने के बाद, आपको Kubecost helm chart को नीचे दिए अनुसार upgrade करना होगा:
```
helm upgrade -i kubecost \
oci://public.ecr.aws/kubecost/cost-analyzer --version <$VERSION> \
--namespace kubecost --create-namespace \
-f https://tinyurl.com/kubecost-amazon-eks \
-f https://tinyurl.com/kubecost-amp \
--set global.amp.prometheusServerEndpoint=${QUERYURL} \
--set global.amp.remoteWriteService=${REMOTEWRITEURL}
```
### Kubecost UI तक पहुंचना

Kubecost एक web dashboard प्रदान करता है जिसे आप kubectl port-forward, एक ingress, या एक load balancer के माध्यम से access कर सकते हैं। Kubecost का enterprise version [SSO/SAML](https://www.ibm.com/docs/en/kubecost/self-hosted/3.x?topic=configuration-user-management-oidc) का उपयोग करके dashboard तक access को restrict करने और varying level of access प्रदान करने का भी समर्थन करता है। उदाहरण के लिए, team का view केवल उन products तक restrict करना जिनके लिए वे जिम्मेदार हैं।

AWS वातावरण में, Kubecost को expose करने के लिए [AWS Load Balancer Controller](https://docs.aws.amazon.com/eks/latest/userguide/aws-load-balancer-controller.html) और authentication, authorization, और user management के लिए [Amazon Cognito](https://aws.amazon.com/cognito/) का उपयोग करने पर विचार करें। आप इस पर अधिक जान सकते हैं [How to use Application Load Balancer and Amazon Cognito to authenticate users for your Kubernetes web apps](https://aws.amazon.com/blogs/containers/how-to-use-application-load-balancer-and-amazon-cognito-to-authenticate-users-for-your-kubernetes-web-apps/)


### Multi-cluster view

आपकी FinOps team EKS cluster की समीक्षा करके business owners के साथ recommendations share करना चाहेगी। बड़े पैमाने पर operating करते समय, teams के लिए recommendations देखने के लिए प्रत्येक cluster में log in करना चुनौतीपूर्ण हो जाता है। Multi cluster आपको globally सभी aggregated cluster costs में single-pane-of-glass view रखने की अनुमति देता है। Kubecost multiple clusters वाले environments के लिए तीन विकल्पों का समर्थन करता है: Kubecost Free, Kubecost Business, और Kubecost enterprise। Free और business mode में, cloud-billing reconciliation प्रत्येक cluster level पर की जाएगी। Enterprise mode में, cloud billing reconciliation एक primary cluster में की जाएगी जो kubecost UI serve करता है और shared bucket का उपयोग करता है जहां metrics store किए जाते हैं।
यह ध्यान रखना महत्वपूर्ण है कि metrics retention केवल enterprise mode का उपयोग करते समय unlimited है।

### संदर्भ
* [One Observability Workshop पर Hands-On Kubecost अनुभव](https://catalog.workshops.aws/observability/en-US/aws-managed-oss/amp/ingest-kubecost-metrics)
* [Blog - Kubecost को Amazon Managed Service for Prometheus के साथ Integrate करना](https://aws.amazon.com/blogs/mt/integrating-kubecost-with-amazon-managed-service-for-prometheus/)

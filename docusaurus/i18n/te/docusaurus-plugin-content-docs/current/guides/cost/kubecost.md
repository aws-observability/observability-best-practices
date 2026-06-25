# Kubecost ఉపయోగించడం

Kubecost Kubernetes environments లో spend మరియు resource efficiency లోకి visibility ను customers కు provide చేస్తుంది. High level లో, Amazon EKS cost monitoring open-source monitoring system మరియు time series database అయిన Prometheus include చేసే Kubecost తో deploy చేయబడుతుంది. Kubecost Prometheus నుండి metrics read చేస్తుంది, తర్వాత cost allocation calculations perform చేస్తుంది మరియు metrics ను Prometheus కు తిరిగి write చేస్తుంది. చివరగా, Kubecost front end Prometheus నుండి metrics read చేసి Kubecost user interface (UI) లో చూపిస్తుంది. Architecture కింది diagram ద్వారా illustrate చేయబడింది:

![Architecture](../../images/kubecost-architecture.png)

## Kubecost ఉపయోగించడానికి కారణాలు

Customers applications modernize చేసి Amazon EKS ఉపయోగించి workloads deploy చేసినప్పుడు, applications run చేయడానికి అవసరమైన compute resources consolidate చేయడం ద్వారా efficiencies పొందుతారు. అయితే, ఈ utilization efficiency application costs measure చేయడంలో increased difficulty tradeoff తో వస్తుంది. ఈ రోజు, tenant ద్వారా costs distribute చేయడానికి ఈ methods లో ఒకటి ఉపయోగించవచ్చు:

* Hard multi-tenancy — Dedicated AWS accounts లో separate EKS clusters run చేయడం.
* Soft multi-tenancy — Shared EKS cluster లో multiple node groups run చేయడం.
* Consumption based billing — Shared EKS cluster లో incurred cost calculate చేయడానికి resource consumption ఉపయోగించడం.

Multi-tenant Kubernetes clusters లో costs track చేయడానికి most efficient way workloads consume చేసిన resources amount ఆధారంగా incurred costs distribute చేయడం. ఇది Kubecost address చేయడానికి dedicated అయిన exact challenge.

:::tip
    Kubecost పై hands-on experience కోసం మా [One Observability Workshop](https://catalog.workshops.aws/observability/en-US/aws-managed-oss/amp/ingest-kubecost-metrics) చూడండి.
:::

## Recommendations

### Cost Allocation

Kubecost Cost Allocation dashboard అన్ని native Kubernetes concepts అంతటా allocated spend మరియు optimization opportunity quickly చూడటానికి allow చేస్తుంది, ఉదా. namespace, k8s label మరియు service. Kubernetes cost optimize చేయడానికి, efficiency మరియు cluster idle costs కు attention pay చేయాలి.

![Allocations](../../images/allocations.png)

### Efficiency

Pod resource efficiency resource request కంటే resource utilization గా define చేయబడుతుంది:
```
(((CPU Usage / CPU Requested) * CPU Cost) + ((RAM Usage / RAM Requested) * RAM Cost)) / (RAM Cost + CPU Cost)
```

### Idle Cost

Cluster idle cost allocated resources cost మరియు వాటిపై run అయ్యే hardware cost మధ్య difference గా define చేయబడుతుంది:
```
idle_cost = sum(node_cost) - (cpu_allocation_cost + ram_allocation_cost + gpu_allocation_cost)
```

### Network Cost

Kubecost costs generate చేసే workloads కు network transfer costs allocate చేయడానికి best-effort ఉపయోగిస్తుంది.

### Workloads Right-Sizing

Kubecost Kubernetes-native metrics ఆధారంగా మీ workloads కోసం right-sizing recommendations provide చేస్తుంది. Kubecost UI లోని savings panel start చేయడానికి great place.

![Savings](../../images/savings.png)

![Right-sizing](../../images/right-sizing.png)

Kubecost మీకు recommendations ఇవ్వగలదు:

* Over-provisioned మరియు under-provisioned container request రెండింటినీ చూసి container request right sizing చేయడం
* Unused capacity పై over-spending stop చేయడానికి cluster nodes number మరియు size adjust చేయడం
* Meaningful rate of traffic send లేదా receive చేయని pods scale down, delete / resize చేయడం
* Spot nodes కోసం ready workloads identify చేయడం
* ఏ pods ద్వారా unused volumes identify చేయడం

### Amazon Managed Service for Prometheus తో Kubecost Integrate చేయడం

Kubecost time series database గా open-source Prometheus project leverage చేస్తుంది. Cluster size మరియు workload scale ను బట్టి, Prometheus server కు metrics scrape చేయడం మరియు store చేయడం overwhelming అవుతుంది. అటువంటి case లో, metrics reliably store చేయడానికి Amazon Managed Service for Prometheus ఉపయోగించవచ్చు.

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

Complete అయిన తర్వాత, Kubecost helm chart ను ఈ విధంగా upgrade చేయాలి:
```
helm upgrade -i kubecost \
oci://public.ecr.aws/kubecost/cost-analyzer --version <$VERSION> \
--namespace kubecost --create-namespace \
-f https://tinyurl.com/kubecost-amazon-eks \
-f https://tinyurl.com/kubecost-amp \
--set global.amp.prometheusServerEndpoint=${QUERYURL} \
--set global.amp.remoteWriteService=${REMOTEWRITEURL}
```

### Kubecost UI Access చేయడం

Kubecost kubectl port-forward, ingress, లేదా load balancer ద్వారా access చేయగల web dashboard provide చేస్తుంది.

AWS environment లో, Kubecost expose చేయడానికి [AWS Load Balancer Controller](https://docs.aws.amazon.com/eks/latest/userguide/aws-load-balancer-controller.html) మరియు authentication కోసం [Amazon Cognito](https://aws.amazon.com/cognito/) ఉపయోగించడం consider చేయండి.

### Multi-cluster view

మీ FinOps team business owners తో recommendations share చేయడానికి EKS cluster review చేయాలనుకుంటుంది. Multi cluster globally aggregated cluster costs అన్నింటిలోకి single-pane-of-glass view కలిగి ఉండటానికి allow చేస్తుంది.

### References
* [Hands-On Kubecost experience on One Observability Workshop](https://catalog.workshops.aws/observability/en-US/aws-managed-oss/amp/ingest-kubecost-metrics)
* [Blog - Integrating Kubecost with Amazon Managed Service for Prometheus](https://aws.amazon.com/blogs/mt/integrating-kubecost-with-amazon-managed-service-for-prometheus/)

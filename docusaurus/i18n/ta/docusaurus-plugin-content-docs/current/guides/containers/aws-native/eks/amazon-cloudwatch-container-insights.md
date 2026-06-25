# Amazon CloudWatch Container Insights

Observability சிறந்த நடைமுறைகள் வழிகாட்டியின் இந்தப் பகுதியில், Amazon CloudWatch Container Insights தொடர்பான பின்வரும் தலைப்புகளை ஆழமாக ஆராய்வோம்:

* Amazon CloudWatch Container Insights அறிமுகம்
* AWS Distro for Open Telemetry உடன் Amazon CloudWatch Container Insights பயன்படுத்துதல்
* Amazon EKS க்கான CloudWatch Container Insights இல் Fluent Bit ஒருங்கிணைப்பு
* Amazon EKS இல் Container Insights மூலம் செலவு சேமிப்பு
* Container Insights அமைக்க EKS Blueprints பயன்படுத்துதல்

### அறிமுகம்

[Amazon CloudWatch Container Insights](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/ContainerInsights.html) container-ized பயன்பாடுகள் மற்றும் microservices-களிலிருந்து metrics மற்றும் logs-களை சேகரிக்கவும், திரட்டவும், சுருக்கமாக வழங்கவும் வாடிக்கையாளர்களுக்கு உதவுகிறது. Metrics தரவு [embedded metric format](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch_Embedded_Metric_Format.html) பயன்படுத்தி performance log events ஆக சேகரிக்கப்படுகிறது. இந்த performance log events உயர்-cardinality தரவை பெரிய அளவில் உள்ளிணைக்கவும் சேமிக்கவும் அனுமதிக்கும் structured JSON schema-ஐ பயன்படுத்துகின்றன. இந்தத் தரவிலிருந்து, CloudWatch cluster, node, pod, task மற்றும் service நிலையில் திரட்டப்பட்ட metrics-களை CloudWatch metrics ஆக உருவாக்குகிறது. Container Insights சேகரிக்கும் metrics CloudWatch automatic dashboards-ல் கிடைக்கின்றன. Container Insights self managed node groups, managed node groups மற்றும் AWS Fargate profiles கொண்ட Amazon EKS clusters-க்கு கிடைக்கும்.

செலவு மேம்படுத்தல் நோக்கில் மற்றும் உங்கள் Container Insights செலவை நிர்வகிக்க உதவ, CloudWatch தானாகவே log தரவிலிருந்து சாத்தியமான அனைத்து metrics-களையும் உருவாக்காது. இருப்பினும், மூலமான performance log events-ஐ பகுப்பாய்வு செய்ய CloudWatch Logs Insights பயன்படுத்தி கூடுதல் metrics மற்றும் கூடுதல் நுணுக்க நிலைகளை நீங்கள் பார்க்கலாம். Container Insights சேகரிக்கும் metrics custom metrics ஆக கட்டணம் விதிக்கப்படும். CloudWatch விலை நிர்ணயம் பற்றிய கூடுதல் தகவலுக்கு, [Amazon CloudWatch Pricing](https://aws.amazon.com/cloudwatch/pricing/) பார்க்கவும்.

Amazon EKS இல், Container Insights ஒரு cluster-ல் இயங்கும் அனைத்து containers-ஐயும் கண்டறிய Amazon Elastic Container Registry வழியாக Amazon வழங்கும் [CloudWatch agent](https://gallery.ecr.aws/cloudwatch-agent/cloudwatch-agent)-இன் containerized பதிப்பைப் பயன்படுத்துகிறது. இது performance stack-இன் ஒவ்வொரு அடுக்கிலும் செயல்திறன் தரவை சேகரிக்கிறது. Container Insights சேகரிக்கும் logs மற்றும் metrics-க்கு AWS KMS key மூலம் encryption-ஐ ஆதரிக்கிறது. இந்த encryption-ஐ இயக்க, Container Insights தரவைப் பெறும் log group-க்கு AWS KMS encryption-ஐ கைமுறையாக இயக்க வேண்டும். இது CloudWatch Container Insights வழங்கப்பட்ட AWS KMS key-யைப் பயன்படுத்தி இந்தத் தரவை encrypt செய்யும். Symmetric keys மட்டுமே ஆதரிக்கப்படுகின்றன, asymmetric AWS KMS keys உங்கள் log groups-ஐ encrypt செய்ய ஆதரிக்கப்படாது. Container Insights Linux instances-ல் மட்டுமே ஆதரிக்கப்படுகிறது. Amazon EKS க்கான Container Insights [இந்த](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/ContainerInsights.html#:~:text=Container%20Insights%20for%20Amazon%20EKS%20and%20Kubernetes%20is%20supported%20in%20the%20following%20Regions%3A) AWS Regions-ல் ஆதரிக்கப்படுகிறது.

### AWS Distro for Open Telemetry உடன் Amazon CloudWatch Container Insights பயன்படுத்துதல்

இப்போது [AWS Distro for OpenTelemetry (ADOT)](https://aws-otel.github.io/docs/introduction) பற்றி ஆழமாக ஆராய்வோம், இது Amazon EKS workloads-லிருந்து Container insight metrics சேகரிப்பை இயக்குவதற்கான விருப்பங்களில் ஒன்றாகும். [AWS Distro for OpenTelemetry (ADOT)](https://aws-otel.github.io/docs/introduction) என்பது [OpenTelemetry](https://opentelemetry.io/docs/) திட்டத்தின் பாதுகாப்பான, AWS-ஆதரவு கொண்ட விநியோகமாகும். ADOT மூலம், பயனர்கள் தங்கள் பயன்பாடுகளை ஒரே முறை instrument செய்து, தொடர்புடைய metrics மற்றும் traces-ஐ பல monitoring தீர்வுகளுக்கு அனுப்பலாம். CloudWatch Container Insights-க்கான ADOT ஆதரவுடன், வாடிக்கையாளர்கள் [Amazon Elastic Cloud Compute](https://aws.amazon.com/pm/ec2/?trk=ps_a134p000004f2ZFAAY&trkCampaign=acq_paid_search_brand&sc_channel=PS&sc_campaign=acquisition_US&sc_publisher=Google&sc_category=Cloud%20Computing&sc_country=US&sc_geo=NAMER&sc_outcome=acq&sc_detail=amazon%20ec2&sc_content=EC2_e&sc_matchtype=e&sc_segment=467723097970&sc_medium=ACQ-P|PS-GO|Brand|Desktop|SU|Cloud%20Computing|EC2|US|EN|Text&s_kwcid=AL!4422!3!467723097970!e!!g!!amazon%20ec2&ef_id=Cj0KCQiArt6PBhCoARIsAMF5waj-FXPUD0G-cm0dJ05Mz6aXDvqEGu-S7pCXwvVusULN6ZbPbc_Alg8aArOHEALw_wcB:G:s&s_kwcid=AL!4422!3!467723097970!e!!g!!amazon%20ec2) (Amazon EC2) இல் இயங்கும் Amazon EKS clusters-லிருந்து CPU, memory, disk மற்றும் network usage போன்ற system metrics-ஐ சேகரிக்கலாம், இது Amazon CloudWatch agent போன்ற அனுபவத்தை வழங்குகிறது. ADOT Collector இப்போது Amazon EKS மற்றும் Amazon EKS க்கான AWS Fargate profile-க்கு CloudWatch Container Insights ஆதரவுடன் கிடைக்கிறது. வாடிக்கையாளர்கள் இப்போது Amazon EKS cluster-ல் deploy செய்யப்பட்ட pods-க்கான CPU மற்றும் memory utilization போன்ற container மற்றும் pod metrics-ஐ சேகரித்து, ஏற்கனவே உள்ள CloudWatch Container Insights அனுபவத்தில் மாற்றங்கள் இல்லாமல் CloudWatch dashboards-ல் பார்க்கலாம். இது போக்குவரத்துக்கு பதிலளிக்க scale up அல்லது scale down செய்யலாமா என்பதை தீர்மானிக்கவும் செலவைக் குறைக்கவும் வாடிக்கையாளர்களுக்கு உதவும்.

ADOT Collector-க்கு [pipeline என்ற கருத்தாக்கம்](https://opentelemetry.io/docs/collector/configuration/) உள்ளது, இது மூன்று முக்கிய வகை components-ஐ உள்ளடக்கியது: receiver, processor மற்றும் exporter. ஒரு [receiver](https://opentelemetry.io/docs/collector/configuration/#receivers) என்பது collector-க்கு தரவு எவ்வாறு வருகிறது என்பதாகும். இது ஒரு குறிப்பிட்ட வடிவத்தில் தரவை ஏற்றுக்கொண்டு, உள் வடிவத்திற்கு மொழிபெயர்த்து, pipeline-ல் வரையறுக்கப்பட்ட [processors](https://opentelemetry.io/docs/collector/configuration/#processors) மற்றும் [exporters](https://opentelemetry.io/docs/collector/configuration/#exporters)-க்கு அனுப்புகிறது. இது pull அல்லது push அடிப்படையாக இருக்கலாம். Processor என்பது பெறப்பட்டதற்கும் export செய்யப்படுவதற்கும் இடையில் batching, filtering மற்றும் transformations போன்ற பணிகளைச் செய்ய பயன்படுத்தப்படும் ஒரு விருப்ப component ஆகும். Exporter என்பது metrics, logs அல்லது traces-ஐ எந்த இலக்குக்கு அனுப்ப வேண்டும் என்பதை தீர்மானிக்கப் பயன்படுகிறது. Collector architecture YAML configuration மூலம் இத்தகைய pipelines-இன் பல instances-ஐ வரையறுக்க அனுமதிக்கிறது. பின்வரும் வரைபடங்கள் Amazon EKS மற்றும் Fargate profile-உடன் Amazon EKS-க்கு deploy செய்யப்பட்ட ADOT Collector instance-ல் pipeline components-ஐ விளக்குகின்றன.

![CW-ADOT-EKS](../../../../images/Containers/aws-native/eks/cw-adot-collector-pipeline-eks.jpg)

*படம்: Amazon EKS-க்கு deploy செய்யப்பட்ட ADOT Collector instance-ல் Pipeline components*

மேலே உள்ள architecture-ல், pipeline-ல் [AWS Container Insights Receiver](https://github.com/open-telemetry/opentelemetry-collector-contrib/tree/main/receiver/awscontainerinsightreceiver)-இன் ஒரு instance-ஐ பயன்படுத்தி Kubelet-லிருந்து நேரடியாக metrics-ஐ சேகரிக்கிறோம். AWS Container Insights Receiver (`awscontainerinsightreceiver`) என்பது [CloudWatch Container Insights](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/ContainerInsights.html)-ஐ ஆதரிக்கும் AWS-குறிப்பிட்ட receiver ஆகும். CloudWatch Container Insights உங்கள் containerized பயன்பாடுகள் மற்றும் microservices-களிலிருந்து metrics மற்றும் logs-களை சேகரிக்கிறது, திரட்டுகிறது மற்றும் சுருக்குகிறது. தரவு [embedded metric format](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch_Embedded_Metric_Format.html) பயன்படுத்தி performance log events ஆக சேகரிக்கப்படுகிறது. EMF தரவிலிருந்து, Amazon CloudWatch cluster, node, pod, task மற்றும் service நிலையில் திரட்டப்பட்ட CloudWatch metrics-ஐ உருவாக்க முடியும். கீழே ஒரு மாதிரி `awscontainerinsightreceiver` configuration உள்ளது:

```
receivers:
  awscontainerinsightreceiver:
    # all parameters are optional
    collection_interval: 60s
    container_orchestrator: eks
    add_service_as_attribute: true 
    prefer_full_pod_name: false 
    add_full_pod_name_metric_label: false 
```

இது மேலே உள்ள configuration-ஐப் பயன்படுத்தி Amazon EKS இல் DaemonSet ஆக collector-ஐ deploy செய்வதை உள்ளடக்குகிறது. இந்த receiver மூலம் Kubelet-லிருந்து நேரடியாக சேகரிக்கப்படும் metrics-இன் முழுமையான தொகுப்பையும் நீங்கள் அணுகலாம். ஒரு cluster-ல் உள்ள அனைத்து nodes-லிருந்தும் resource metrics-ஐ சேகரிக்க ஒன்றுக்கு மேற்பட்ட ADOT Collector instances இருந்தால் போதுமானது. ஒரே ஒரு ADOT collector instance அதிக சுமைகளின் போது அதிகமாக இருக்கும், எனவே எப்போதும் ஒன்றுக்கு மேற்பட்ட collector-ஐ deploy செய்ய பரிந்துரைக்கப்படுகிறது.

![CW-ADOT-FARGATE](../../../../images/Containers/aws-native/eks/cw-adot-collector-pipeline.jpg)

*படம்: Fargate profile-உடன் Amazon EKS-க்கு deploy செய்யப்பட்ட ADOT Collector instance-ல் Pipeline components*

மேலே உள்ள architecture-ல், Kubernetes cluster-ல் ஒரு worker node-ல் உள்ள kubelet */metrics/cadvisor* endpoint-ல் CPU, memory, disk மற்றும் network usage போன்ற resource metrics-ஐ வெளிப்படுத்துகிறது. இருப்பினும், EKS Fargate networking architecture-ல், ஒரு pod அந்த worker node-ல் உள்ள kubelet-ஐ நேரடியாக அணுக அனுமதிக்கப்படாது. எனவே, ADOT Collector worker node-ல் உள்ள kubelet-க்கு இணைப்பை proxy செய்ய Kubernetes API Server-ஐ அழைக்கிறது, மேலும் அந்த node-ல் உள்ள workloads-க்கான kubelet-இன் cAdvisor metrics-ஐ சேகரிக்கிறது. இந்த metrics Prometheus வடிவத்தில் கிடைக்கின்றன. எனவே, collector Prometheus server-க்கு பதிலாக [Prometheus Receiver](https://github.com/open-telemetry/opentelemetry-collector-contrib/tree/main/receiver/prometheusreceiver)-இன் ஒரு instance-ஐப் பயன்படுத்தி Kubernetes API server endpoint-லிருந்து இந்த metrics-ஐ scrape செய்கிறது. Kubernetes service discovery மூலம், receiver ஒரு EKS cluster-ல் உள்ள அனைத்து worker nodes-ஐயும் கண்டறிய முடியும். எனவே, ஒரு cluster-ல் உள்ள அனைத்து nodes-லிருந்தும் resource metrics-ஐ சேகரிக்க ஒன்றுக்கு மேற்பட்ட ADOT Collector instances போதுமானது. ஒரே ஒரு ADOT collector instance அதிக சுமைகளின் போது அதிகமாக இருக்கும், எனவே எப்போதும் ஒன்றுக்கு மேற்பட்ட collector-ஐ deploy செய்ய பரிந்துரைக்கப்படுகிறது.

Metrics பின்னர் filtering, renaming, தரவு திரட்டல் மற்றும் மாற்றம் போன்றவற்றைச் செய்யும் processors தொடர் வழியாக செல்கின்றன. மேலே விளக்கப்பட்ட Amazon EKS க்கான ADOT Collector instance-இன் pipeline-ல் பயன்படுத்தப்படும் processors பட்டியல் பின்வருமாறு.

* [Filter Processor](https://github.com/open-telemetry/opentelemetry-collector-contrib/tree/main/processor/filterprocessor) AWS OpenTelemetry distribution-இன் ஒரு பகுதியாகும், இது metrics-ஐ அவற்றின் பெயரின் அடிப்படையில் சேர்க்கவோ அல்லது விலக்கவோ பயன்படுகிறது. தேவையற்ற metrics-ஐ வடிகட்ட metrics collection pipeline-இன் ஒரு பகுதியாக இதைப் பயன்படுத்தலாம். எடுத்துக்காட்டாக, Container Insights pod-level metrics-ஐ (பெயர் prefix `pod_`) மட்டும் சேகரிக்க வேண்டும், ஆனால் networking-க்கான (பெயர் prefix `pod_network`) metrics-ஐ விலக்க வேண்டும் என்று வைத்துக்கொள்ளுங்கள்.

```
      # filter out only renamed metrics which we care about
      filter:
        metrics:
          include:
            match_type: regexp
            metric_names:
              - new_container_.*
              - pod_.*
```

* [Metrics Transform Processor](https://github.com/open-telemetry/opentelemetry-collector-contrib/tree/main/processor/metricstransformprocessor) metrics-ஐ rename செய்யவும், label keys மற்றும் values-ஐ சேர்க்கவும், rename செய்யவும் அல்லது நீக்கவும் பயன்படுத்தலாம். Labels அல்லது label values முழுவதும் metrics-ல் scaling மற்றும் aggregations செய்யவும் இதைப் பயன்படுத்தலாம்.

```
     metricstransform/rename:
        transforms:
          - include: container_spec_cpu_quota
            new_name: new_container_cpu_limit_raw
            action: insert
            match_type: regexp
            experimental_match_labels: {"container": "\\S"}
```

* [Cumulative to Delta Processor](https://github.com/open-telemetry/opentelemetry-collector-contrib/tree/main/processor/cumulativetodeltaprocessor) monotonic, cumulative sum மற்றும் histogram metrics-ஐ monotonic, delta metrics-ஆக மாற்றுகிறது. Non-monotonic sums மற்றும் exponential histograms விலக்கப்படுகின்றன.

```
` # convert cumulative sum datapoints to delta
 cumulativetodelta:
    metrics:
        - pod_cpu_usage_seconds_total 
        - pod_network_rx_errors`
```

* [Delta to Rate Processor](https://github.com/open-telemetry/opentelemetry-collector-contrib/tree/main/processor/deltatorateprocessor) delta sum metrics-ஐ rate metrics-ஆக மாற்றுகிறது. இந்த rate ஒரு gauge ஆகும்.

```
` # convert delta to rate
    deltatorate:
        metrics:
            - pod_memory_hierarchical_pgfault 
            - pod_memory_hierarchical_pgmajfault 
            - pod_network_rx_bytes 
            - pod_network_rx_dropped 
            - pod_network_rx_errors 
            - pod_network_tx_errors 
            - pod_network_tx_packets 
            - new_container_memory_pgfault 
            - new_container_memory_pgmajfault 
            - new_container_memory_hierarchical_pgfault 
            - new_container_memory_hierarchical_pgmajfault`
```

* [Metrics Generation Processor](https://github.com/open-telemetry/opentelemetry-collector-contrib/tree/main/processor/metricsgenerationprocessor) ஏற்கனவே உள்ள metrics-ஐப் பயன்படுத்தி கொடுக்கப்பட்ட விதியின் படி புதிய metrics-ஐ உருவாக்கப் பயன்படுத்தலாம்.

```
      experimental_metricsgeneration/1:
        rules:
          - name: pod_memory_utilization_over_pod_limit
            unit: Percent
            type: calculate
            metric1: pod_memory_working_set
            metric2: pod_memory_limit
            operation: percent
```

Pipeline-ல் இறுதி component [AWS CloudWatch EMF Exporter](https://github.com/open-telemetry/opentelemetry-collector-contrib/tree/main/exporter/awsemfexporter) ஆகும், இது metrics-ஐ embedded metric format (EMF) ஆக மாற்றி, [PutLogEvents](https://docs.aws.amazon.com/AmazonCloudWatchLogs/latest/APIReference/API_PutLogEvents.html) API-ஐப் பயன்படுத்தி நேரடியாக CloudWatch Logs-க்கு அனுப்புகிறது. Amazon EKS இல் இயங்கும் ஒவ்வொரு workload-க்கும் ADOT Collector மூலம் CloudWatch-க்கு அனுப்பப்படும் metrics பட்டியல் பின்வருமாறு.

* pod_cpu_utilization_over_pod_limit
* pod_cpu_usage_total
* pod_cpu_limit
* pod_memory_utilization_over_pod_limit
* pod_memory_working_set
* pod_memory_limit
* pod_network_rx_bytes
* pod_network_tx_bytes

ஒவ்வொரு metric-ம் பின்வரும் dimension sets-உடன் தொடர்புடையதாக இருக்கும் மற்றும் *ContainerInsights* என்ற CloudWatch namespace-ல் சேகரிக்கப்படும்.

* ClusterName, LaunchType
* ClusterName, Namespace, LaunchType
* ClusterName, Namespace, PodName, LaunchType

மேலும், [Container Insights Prometheus support for ADOT](https://aws.amazon.com/blogs/containers/introducing-cloudwatch-container-insights-prometheus-support-with-aws-distro-for-opentelemetry-on-amazon-ecs-and-amazon-eks/) மற்றும் [CloudWatch Container Insights-ஐப் பயன்படுத்தி Amazon EKS resource metrics-ஐ காட்சிப்படுத்த Amazon EKS இல் ADOT collector deploy செய்தல்](https://aws.amazon.com/blogs/containers/introducing-amazon-cloudwatch-container-insights-for-amazon-eks-fargate-using-aws-distro-for-opentelemetry/) பற்றி அறிந்து, உங்கள் Amazon EKS cluster-ல் ADOT collector pipeline-ஐ அமைக்கவும், CloudWatch Container Insights-ல் உங்கள் Amazon EKS resource metrics-ஐ காட்சிப்படுத்தவும் கற்றுக்கொள்ளுங்கள். கூடுதலாக, [Easily Monitor Containerized Applications with Amazon CloudWatch Container Insights](https://community.aws/tutorials/navigating-amazon-eks/eks-monitor-containerized-applications#step-3-use-cloudwatch-logs-insights-query-to-search-and-analyze-container-logs) பார்க்கவும், இதில் Amazon EKS cluster-ஐ configure செய்வது, containerized application-ஐ deploy செய்வது மற்றும் Container Insights-ஐப் பயன்படுத்தி application-இன் செயல்திறனை கண்காணிப்பது பற்றிய படிப்படியான வழிமுறைகள் உள்ளன.

### Amazon EKS க்கான CloudWatch Container Insights-ல் Fluent Bit ஒருங்கிணைப்பு

[Fluent Bit](https://fluentbit.io/) என்பது ஒரு open source மற்றும் multi-platform log processor மற்றும் forwarder ஆகும், இது பல்வேறு மூலங்களிலிருந்து தரவு மற்றும் logs-ஐ சேகரிக்கவும், ஒருங்கிணைக்கவும், CloudWatch Logs உட்பட பல்வேறு இலக்குகளுக்கு அனுப்பவும் அனுமதிக்கிறது. இது [Docker](https://www.docker.com/) மற்றும் [Kubernetes](https://kubernetes.io/) சூழல்களுடன் முழுமையாக இணக்கமானது. புதிதாக அறிமுகப்படுத்தப்பட்ட Fluent Bit daemonset-ஐப் பயன்படுத்தி, உங்கள் EKS clusters-லிருந்து container logs-ஐ logs சேமிப்பு மற்றும் analytics-க்காக CloudWatch logs-க்கு அனுப்பலாம்.

அதன் இலகுரக தன்மையின் காரணமாக, EKS worker nodes-ல் Container Insights-ல் இயல்புநிலை log forwarder ஆக Fluent Bit-ஐப் பயன்படுத்துவது application logs-ஐ CloudWatch logs-க்கு திறமையாகவும் நம்பகத்தன்மையுடனும் stream செய்ய அனுமதிக்கும். Fluent Bit மூலம், Container Insights ஆயிரக்கணக்கான வணிக-முக்கிய logs-ஐ resource-efficient முறையில் பெரிய அளவில் வழங்க முடியும், குறிப்பாக pod நிலையில் CPU மற்றும் memory utilization அடிப்படையில். வேறுவிதமாகச் சொன்னால், முன்பு பயன்படுத்தப்பட்ட log forwarder ஆன FluentD-உடன் ஒப்பிடும்போது, Fluent Bit சிறிய resource footprint கொண்டது, இதன் விளைவாக memory மற்றும் CPU-க்கு அதிக resource-efficient ஆக உள்ளது. மறுபுறம், Fluent Bit மற்றும் தொடர்புடைய plugins-ஐ உள்ளடக்கிய [AWS for Fluent Bit image](https://github.com/aws/aws-for-fluent-bit), AWS ecosystem-க்குள் ஒரு ஒருங்கிணைந்த அனுபவத்தை வழங்குவதை நோக்கமாகக் கொண்டுள்ளதால், புதிய AWS features-ஐ விரைவாக ஏற்றுக்கொள்ளும் கூடுதல் நெகிழ்வுத்தன்மையை Fluent Bit-க்கு வழங்குகிறது.

EKS க்கான CloudWatch Container Insights பயன்படுத்தும் தனிப்பட்ட components-ஐ கீழே உள்ள architecture காட்டுகிறது:

![CW-COMPONENTS](../../../../images/Containers/aws-native/eks/cw-components.jpg)

*படம்: EKS க்கான CloudWatch Container Insights பயன்படுத்தும் தனிப்பட்ட components.*

Containers-உடன் பணிபுரியும் போது, Docker JSON logging driver-ஐப் பயன்படுத்தி standard output (stdout) மற்றும் standard error output (stderr) முறைகள் வழியாக application logs உட்பட அனைத்து logs-ஐயும் push செய்வது பரிந்துரைக்கப்படுகிறது. இந்த காரணத்திற்காக, EKS-ல், logging driver இயல்பாகவே configure செய்யப்பட்டுள்ளது, மேலும் containerized application `stdout` அல்லது `stderr`-க்கு எழுதும் அனைத்தும் worker node-ல் `"/var/log/containers"` கீழ் JSON file-க்கு stream செய்யப்படும். Container Insights இந்த logs-ஐ இயல்பாக மூன்று வெவ்வேறு வகைகளாக வகைப்படுத்தி, Fluent Bit-க்குள் ஒவ்வொரு வகைக்கும் பிரத்யேக input streams-ஐயும் CloudWatch Logs-க்குள் சுயாதீன log groups-ஐயும் உருவாக்குகிறது. அந்த வகைகள்:

* **Application logs**: `"/var/log/containers/*.log"` கீழ் சேமிக்கப்பட்ட அனைத்து application logs-ம் பிரத்யேக `/aws/containerinsights/Cluster_Name/application` log group-க்கு stream செய்யப்படும். kube-proxy மற்றும் aws-node logs போன்ற application அல்லாத logs இயல்பாக விலக்கப்படும். இருப்பினும், CoreDNS logs போன்ற கூடுதல் Kubernetes add-on logs-ம் செயலாக்கப்பட்டு இந்த log group-க்கு stream செய்யப்படும்.
* **Host logs**: ஒவ்வொரு EKS worker node-க்கும் system logs `/aws/containerinsights/Cluster_Name/host` log group-க்கு stream செய்யப்படும். இந்த system logs `"/var/log/messages,/var/log/dmesg,/var/log/secure"` files-இன் உள்ளடக்கங்களை உள்ளடக்கும். Containerized workloads-இன் stateless மற்றும் dynamic தன்மையை கருத்தில் கொண்டு, EKS worker nodes scaling activities-இன் போது அடிக்கடி terminate செய்யப்படும், Fluent Bit மூலம் real time-ல் அந்த logs-ஐ stream செய்வதும், node terminate செய்யப்பட்ட பிறகும் CloudWatch logs-ல் அந்த logs கிடைப்பதும், EKS worker nodes-இன் ஆரோக்கியத்தை observability மற்றும் monitoring செய்வதில் முக்கியமானவை. பல சந்தர்ப்பங்களில் worker nodes-க்கு login செய்யாமல் cluster சிக்கல்களை debug அல்லது troubleshoot செய்யவும், இந்த logs-ஐ மிகவும் முறையான வழியில் பகுப்பாய்வு செய்யவும் இது உதவுகிறது.
* **Data plane logs**: EKS ஏற்கனவே [control plane logs](https://docs.aws.amazon.com/eks/latest/userguide/control-plane-logs.html)-ஐ வழங்குகிறது. Container Insights-ல் Fluent Bit ஒருங்கிணைப்புடன், ஒவ்வொரு worker node-லும் இயங்கும் மற்றும் இயங்கும் pods-ஐ பராமரிக்கும் பொறுப்பான EKS data plane components உருவாக்கும் logs data plane logs ஆக பிடிக்கப்படுகின்றன. இந்த logs-ம் `'/aws/containerinsights/Cluster_Name/dataplane` என்ற பிரத்யேக CloudWatch log group-க்கு stream செய்யப்படும். kube-proxy, aws-node மற்றும் Docker runtime logs இந்த log group-ல் சேமிக்கப்படும். Control plane logs-க்கு கூடுதலாக, data plane logs-ஐ CloudWatch Logs-ல் சேமிப்பது உங்கள் EKS clusters-இன் முழுமையான படத்தை வழங்க உதவுகிறது.

மேலும், Fluent Bit Configurations, Fluent Bit Monitoring மற்றும் Log analysis போன்ற தலைப்புகளை [Fluent Bit Integration with Amazon EKS](https://aws.amazon.com/blogs/containers/fluent-bit-integration-in-cloudwatch-container-insights-for-eks/) இலிருந்து அறியுங்கள்.

### Amazon EKS இல் Container Insights மூலம் செலவு சேமிப்பு

இயல்புநிலை configuration-உடன், Container Insights receiver [receiver documentation](https://github.com/open-telemetry/opentelemetry-collector-contrib/tree/main/receiver/awscontainerinsightreceiver#available-metrics-and-resource-attributes) இல் வரையறுக்கப்பட்ட முழுமையான metrics தொகுப்பை சேகரிக்கிறது. சேகரிக்கப்படும் metrics மற்றும் dimensions எண்ணிக்கை அதிகமாக உள்ளது, பெரிய clusters-க்கு இது metric ingestion மற்றும் storage செலவுகளை கணிசமாக அதிகரிக்கும். மதிப்பைத் தரும் metrics-ஐ மட்டும் அனுப்பவும் செலவைக் குறைக்கவும் ADOT Collector-ஐ configure செய்ய நீங்கள் பயன்படுத்தக்கூடிய இரண்டு வெவ்வேறு அணுகுமுறைகளை நிரூபிக்கப் போகிறோம்.

#### Processors பயன்படுத்துதல்

இந்த அணுகுமுறையில் மேலே விவாதிக்கப்பட்டபடி OpenTelemetry processors-ஐ அறிமுகப்படுத்தி metrics அல்லது attributes-ஐ வடிகட்டி [EMF logs](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch_Embedded_Metric_Format.html)-இன் அளவைக் குறைக்கிறது. *Filter* மற்றும் *Resource* என்ற இரண்டு processors-இன் அடிப்படை பயன்பாட்டை நிரூபிப்போம்.

[Filter processors](https://github.com/open-telemetry/opentelemetry-collector-contrib/blob/main/processor/filterprocessor/README.md)-ஐ `otel-agent-conf` என்ற `ConfigMap`-ல் சேர்க்கலாம்:

```
processors:
  # filter processors example
  filter/include:
    # any names NOT matching filters are excluded from remainder of pipeline
    metrics:
      include:
        match_type: regexp
        metric_names:
          # re2 regexp patterns
          - ^pod_.*
  filter/exclude:
    # any names matching filters are excluded from remainder of pipeline
    metrics:
      exclude:
        match_type: regexp
        metric_names:
          - ^pod_network.*
```

[Resource processor](https://github.com/open-telemetry/opentelemetry-collector-contrib/blob/main/processor/resourceprocessor/README.md) AWS OpenTelemetry Distro-வில் உள்ளமைக்கப்பட்டுள்ளது மற்றும் தேவையற்ற metric attributes-ஐ அகற்றப் பயன்படுத்தலாம். எடுத்துக்காட்டாக, EMF logs-லிருந்து `Kubernetes` மற்றும் `Sources` fields-ஐ அகற்ற விரும்பினால், pipeline-க்கு resource processor-ஐ சேர்க்கலாம்:

```
  # resource processors example
  resource:
    attributes:
    - key: Sources
      action: delete
    - key: kubernetes
      action: delete
```

#### Metrics மற்றும் Dimensions தனிப்பயனாக்குதல்

இந்த அணுகுமுறையில், CloudWatch Logs-க்கு அனுப்ப விரும்பும் metrics தொகுப்பை மட்டும் உருவாக்க CloudWatch EMF exporter-ஐ configure செய்வீர்கள். CloudWatch EMF exporter configuration-இன் [metric_declaration](https://github.com/open-telemetry/opentelemetry-collector-contrib/blob/5ccdbe08c6a2a43b7c6c7f9c0031a4b0348394a9/exporter/awsemfexporter/README.md#metric_declaration) பகுதியை export செய்ய விரும்பும் metrics மற்றும் dimensions தொகுப்பை வரையறுக்கப் பயன்படுத்தலாம். எடுத்துக்காட்டாக, இயல்புநிலை configuration-லிருந்து pod metrics-ஐ மட்டும் வைத்திருக்கலாம். இந்த `metric_declaration` பகுதி பின்வருமாறு இருக்கும், metrics எண்ணிக்கையைக் குறைக்க, மற்றவை பற்றி கவலைப்படாவிட்டால் dimension set-ஐ `[PodName, Namespace, ClusterName]` மட்டும் வைத்திருக்கலாம்:

```
  awsemf:
    namespace: ContainerInsights
    log_group_name: '/aws/containerinsights/{ClusterName}/performance'
    log_stream_name: '{NodeName}'
    resource_to_telemetry_conversion:
      enabled: true
    dimension_rollup_option: NoDimensionRollup
    parse_json_encoded_attr_values: [Sources, kubernetes]
    # Customized metric declaration section
    metric_declarations:
      # pod metrics
      - dimensions: [[PodName, Namespace, ClusterName]]
        metric_name_selectors:
          - pod_cpu_utilization
          - pod_memory_utilization
          - pod_cpu_utilization_over_pod_limit
          - pod_memory_utilization_over_pod_limit
```

இந்த configuration இயல்புநிலை configuration-ல் பல dimensions-க்கு 55 வெவ்வேறு metrics-க்கு பதிலாக, ஒற்றை dimension `[PodName, Namespace, ClusterName]`-க்குள் பின்வரும் நான்கு metrics-ஐ உருவாக்கி stream செய்யும்:

* pod_cpu_utilization
* pod_memory_utilization
* pod_cpu_utilization_over_pod_limit
* pod_memory_utilization_over_pod_limit

இந்த configuration-உடன், இயல்பாக configure செய்யப்பட்ட அனைத்து metrics-க்கும் பதிலாக நீங்கள் ஆர்வமுள்ள metrics-ஐ மட்டும் அனுப்புவீர்கள். இதன் விளைவாக, Container Insights-க்கான metric ingestion செலவை கணிசமாகக் குறைக்க முடியும். இந்த நெகிழ்வுத்தன்மை Container Insights வாடிக்கையாளர்களுக்கு export செய்யப்படும் metrics மீது உயர் நிலை கட்டுப்பாட்டை வழங்கும். `awsemf` exporter configuration-ஐ மாற்றி metrics-ஐ தனிப்பயனாக்குவது மிகவும் நெகிழ்வானது, நீங்கள் அனுப்ப விரும்பும் metrics மற்றும் அவற்றின் dimensions இரண்டையும் தனிப்பயனாக்கலாம். இது CloudWatch-க்கு அனுப்பப்படும் logs-க்கு மட்டுமே பொருந்தும் என்பதை கவனிக்கவும்.

மேலே விவாதிக்கப்பட்ட இரண்டு அணுகுமுறைகளும் ஒன்றையொன்று விலக்குவதில்லை. உண்மையில், நமது monitoring system-க்குள் ingestion செய்ய விரும்பும் metrics-ஐ தனிப்பயனாக்குவதில் அதிக நெகிழ்வுத்தன்மைக்காக இரண்டையும் ஒருங்கிணைக்கலாம். பின்வரும் graph-ல் காட்டப்படுவது போல, metric storage மற்றும் processing-உடன் தொடர்புடைய செலவுகளைக் குறைக்க இந்த அணுகுமுறையைப் பயன்படுத்துகிறோம்.

![CW-COST-EXPLORER](../../../../images/Containers/aws-native/eks/cw-cost-explorer.jpg)

*படம்: AWS Cost Explorer*

மேலே உள்ள AWS Cost Explorer graph-ல், ஒரு சிறிய EKS cluster-ல் (20 Worker nodes, 220 pods) ADOT Collector-ல் வெவ்வேறு configurations பயன்படுத்தி CloudWatch-உடன் தொடர்புடைய தினசரி செலவைக் காணலாம். *Aug 15th* இயல்புநிலை configuration-உடன் ADOT Collector-ஐப் பயன்படுத்தி CloudWatch கட்டணத்தைக் காட்டுகிறது. *Aug 16th* அன்று, [Customize EMF exporter](https://aws.amazon.com/blogs/containers/cost-savings-by-customizing-metrics-sent-by-container-insights-in-amazon-eks/#customize-emf-exporter) அணுகுமுறையைப் பயன்படுத்தினோம், சுமார் 30% செலவு சேமிப்பைக் காணலாம். *Aug 17th* அன்று, [Processors](https://aws.amazon.com/blogs/containers/cost-savings-by-customizing-metrics-sent-by-container-insights-in-amazon-eks/#processors) அணுகுமுறையைப் பயன்படுத்தினோம், இது சுமார் 45% செலவு சேமிப்பை அடைகிறது.
Container Insights அனுப்பும் metrics-ஐ தனிப்பயனாக்குவதின் trade-offs-ஐ கருத்தில் கொள்ள வேண்டும், ஏனெனில் கண்காணிக்கப்படும் cluster-இன் visibility-ஐ தியாகம் செய்து monitoring செலவுகளைக் குறைக்க முடியும். மேலும், AWS Console-க்குள் Container Insights வழங்கும் built-in dashboard, dashboard பயன்படுத்தும் metrics மற்றும் dimensions-ஐ அனுப்பாமல் தேர்வு செய்யலாம் என்பதால், தனிப்பயனாக்கப்பட்ட metrics-ஆல் பாதிக்கப்படலாம். மேலும் கற்றுக்கொள்ள [Cost savings by customizing metrics sent by Container Insights in Amazon EKS](https://aws.amazon.com/blogs/containers/cost-savings-by-customizing-metrics-sent-by-container-insights-in-amazon-eks/) பார்க்கவும்.

### Container Insights அமைக்க EKS Blueprints பயன்படுத்துதல்

[EKS Blueprints](https://aws.amazon.com/blogs/containers/bootstrapping-clusters-with-eks-blueprints/) என்பது Infrastructure as Code (IaC) modules-இன் தொகுப்பாகும், இது accounts மற்றும் regions முழுவதும் நிலையான, அனைத்து அம்சங்களும் கொண்ட EKS clusters-ஐ configure செய்யவும் deploy செய்யவும் உதவும். [Amazon EKS add-ons](https://docs.aws.amazon.com/eks/latest/userguide/eks-add-ons.html) மற்றும் Prometheus, Karpenter, Nginx, Traefik, AWS Load Balancer Controller, Container Insights, Fluent Bit, Keda, Argo CD போன்ற பரவலான open-source add-ons உட்பட ஒரு EKS cluster-ஐ எளிதாக bootstrap செய்ய EKS Blueprints-ஐப் பயன்படுத்தலாம். EKS Blueprints இரண்டு பிரபலமான IaC frameworks-ல் செயல்படுத்தப்பட்டுள்ளது: [HashiCorp Terraform](https://github.com/aws-ia/terraform-aws-eks-blueprints) மற்றும் [AWS Cloud Development Kit (AWS CDK)](https://github.com/aws-quickstart/cdk-eks-blueprints), இவை infrastructure deployments-ஐ தானியக்கமாக்க உதவும்.

EKS Blueprints பயன்படுத்தி உங்கள் Amazon EKS Cluster உருவாக்கும் செயல்முறையின் ஒரு பகுதியாக, containerized applications மற்றும் micro-services-களிலிருந்து metrics மற்றும் logs-ஐ Amazon CloudWatch console-க்கு சேகரிக்கவும், திரட்டவும், சுருக்கமாக வழங்கவும் Day 2 operational tooling ஆக Container Insights-ஐ அமைக்கலாம்.

### முடிவுரை

Observability சிறந்த நடைமுறைகள் வழிகாட்டியின் இந்தப் பகுதியில், CloudWatch Container Insights பற்றிய ஆழமான விவரங்களை நாம் உள்ளடக்கினோம், இதில் Amazon CloudWatch Container Insights அறிமுகமும் Amazon EKS இல் உங்கள் containerized workloads-ஐ observe செய்ய இது எவ்வாறு உதவும் என்பதும் அடங்கும். Amazon CloudWatch console-ல் உங்கள் containerized workloads-இன் metrics-ஐ காட்சிப்படுத்த Container insight metrics சேகரிப்பை இயக்க AWS Distro for Open Telemetry உடன் Amazon CloudWatch Container Insights பயன்படுத்துவது பற்றி ஆழமாக ஆராய்ந்தோம். அடுத்ததாக, Application, Host மற்றும் Data Plane logs-க்கு Fluent Bit-க்குள் பிரத்யேக input streams மற்றும் CloudWatch Logs-க்குள் சுயாதீன log groups-ஐ உருவாக்க Amazon EKS க்கான CloudWatch Container Insights-ல் Fluent Bit ஒருங்கிணைப்பு பற்றி ஆழமாகப் பார்த்தோம். அடுத்ததாக, CloudWatch Container Insights மூலம் செலவு சேமிப்பை அடைய processors, metrics dimensions போன்ற இரண்டு வெவ்வேறு அணுகுமுறைகள் பற்றி பேசினோம். இறுதியாக, Amazon EKS cluster உருவாக்கும் செயல்முறையின் போது Container Insights-ஐ அமைக்க EKS Blueprints-ஐ எவ்வாறு பயன்படுத்துவது என்பது பற்றி சுருக்கமாகப் பேசினோம். [CloudWatch Container Insights module](https://catalog.workshops.aws/observability/en-US/aws-native/insights/containerinsights) மூலம் [One Observability Workshop](https://catalog.workshops.aws/observability/en-US) இல் நேரடி அனுபவம் பெறலாம்.

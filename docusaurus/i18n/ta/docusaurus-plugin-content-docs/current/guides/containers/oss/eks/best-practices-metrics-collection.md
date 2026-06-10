# EKS Observability : அத்தியாவசிய மெட்ரிக்குகள்

# தற்போதைய நிலை

Monitoring என்பது infrastructure மற்றும் application உரிமையாளர்கள் தங்கள் systems-இன் historical மற்றும் current state-ஐ பார்க்கவும் புரிந்துகொள்ளவும் உதவும் தீர்வாகும், வரையறுக்கப்பட்ட மெட்ரிக்குகள் அல்லது logs சேகரிப்பதில் கவனம் செலுத்துகிறது.

Monitoring பல ஆண்டுகளாக பரிணாம வளர்ச்சி அடைந்துள்ளது. சிக்கல்களை debug மற்றும் troubleshoot செய்ய debug மற்றும் dump logs பயன்படுத்துவதில் தொடங்கி, syslogs, top போன்ற command-line tools பயன்படுத்தி basic monitoring-க்கு முன்னேறி, dashboard-இல் visualize செய்யக்கூடியதாக மாறியுள்ளது. Cloud-இன் வருகையும் scale-இன் அதிகரிப்பும், இன்று நாம் முன் எப்போதும் இல்லாத அளவுக்கு அதிகமாக tracking செய்கிறோம். Industry Observability-க்கு அதிகமாக மாறியுள்ளது, இது infrastructure மற்றும் application உரிமையாளர்கள் தங்கள் systems-ஐ actively troubleshoot மற்றும் debug செய்ய உதவும் தீர்வாகும். Observability மெட்ரிக்குகளிலிருந்து derived patterns-ஐ பார்ப்பதில் அதிகம் கவனம் செலுத்துகிறது.


# மெட்ரிக்குகள், ஏன் முக்கியம்?

மெட்ரிக்குகள் என்பது உருவாக்கப்பட்ட நேரத்தின் வரிசையில் வைக்கப்படும் numerical values தொடராகும். உங்கள் environment-இல் உள்ள servers எண்ணிக்கை, disk usage, அவை handle செய்யும் requests per second, அல்லது இந்த requests-ஐ complete செய்வதில் உள்ள latency வரை அனைத்தையும் track செய்ய பயன்படுகின்றன. மெட்ரிக்குகள் உங்கள் systems எவ்வாறு perform செய்கின்றன என்பதை சொல்லும் data ஆகும். சிறிய அல்லது பெரிய கிளஸ்டர் இயக்கினாலும், systems health மற்றும் performance பற்றிய insights பெறுவது, improvement areas-ஐ identify செய்யவும், issue-ஐ troubleshoot மற்றும் trace செய்யவும், workloads performance மற்றும் efficiency-ஐ ஒட்டுமொத்தமாக மேம்படுத்தவும் உதவுகிறது. இந்த மாற்றங்கள் உங்கள் கிளஸ்டரில் செலவிடும் நேரம் மற்றும் resources-ஐ பாதிக்கலாம், இது நேரடியாக cost-ஆக மாறுகிறது.


# மெட்ரிக்குகள் சேகரிப்பு

EKS கிளஸ்டரிலிருந்து மெட்ரிக்குகளை சேகரிப்பது [மூன்று components](https://aws-observability.github.io/observability-best-practices/recipes/telemetry/) கொண்டது:

1. Sources: இந்த guide-இல் பட்டியலிடப்பட்டவை போன்ற மெட்ரிக்குகள் வரும் இடங்கள்.
2. Agents: EKS environment-இல் இயங்கும் Applications, பொதுவாக agent என அழைக்கப்படும், monitoring data-ஐ சேகரித்து இரண்டாவது component-க்கு push செய்கிறது. இந்த component-இன் எடுத்துக்காட்டுகள் [AWS Distro for OpenTelemetry (ADOT)](https://aws-otel.github.io/) மற்றும் [CloudWatch Agent](https://aws-observability.github.io/observability-best-practices/tools/cloudwatch_agent/)
3. Destinations: Monitoring data storage மற்றும் analysis solution, இந்த component பொதுவாக [time series formatted data](https://aws-observability.github.io/observability-best-practices/signals/metrics/)-க்கு optimized data service ஆகும். இந்த component-இன் எடுத்துக்காட்டுகள் [Amazon Managed Service for Prometheus](https://aws.amazon.com/prometheus/) மற்றும் [AWS Cloudwatch](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/deploy-container-insights-EKS.html).

குறிப்பு: இந்த section-இல், configuration examples [AWS Observability Accelerator](https://aws-observability.github.io/terraform-aws-observability-accelerator/)-இன் relevant sections-க்கான links ஆகும். EKS metrics collection implementations-க்கான up to date guidance மற்றும் examples வழங்குவதற்காக இது செய்யப்பட்டுள்ளது.

## Managed Open Source Solution

[AWS Distro for OpenTelemetry (ADOT)](https://aws-otel.github.io/) என்பது [OpenTelemetry](https://opentelemetry.io/) project-இன் supported version ஆகும், users correlated metrics மற்றும் traces-ஐ [Amazon Managed Service for Prometheus](https://aws.amazon.com/prometheus/) மற்றும் [AWS Cloudwatch](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/deploy-container-insights-EKS.html) போன்ற monitoring data collection solutions-க்கு அனுப்ப உதவுகிறது. ADOT-ஐ [EKS Managed Add-ons](https://docs.aws.amazon.com/eks/latest/userguide/eks-add-ons.html) மூலம் EKS cluster-இல் install செய்து, இந்த page-இல் listed மெட்ரிக்குகள் மற்றும் workload traces சேகரிக்க configure செய்யலாம். AWS ADOT add-on Amazon EKS-உடன் compatible என validate செய்துள்ளது, latest bug fixes மற்றும் security patches-உடன் regularly update செய்யப்படுகிறது. [ADOT best practices மற்றும் மேலும் தகவல்.](https://aws-observability.github.io/observability-best-practices/guides/operational/adot-at-scale/operating-adot-collector/)


## ADOT + AMP

AWS Distro for OpenTelemetry (ADOT), Amazon Managed Service for Prometheus (AMP), மற்றும் Amazon Managed Service for Grafana (AMG)-உடன் விரைவாக தொடங்க, AWS Observability Accelerator-இன் [infrastructure monitoring example](https://aws-observability.github.io/terraform-aws-observability-accelerator/eks/)-ஐ பயன்படுத்தவும். Accelerator examples out of the box metrics collection, alerting rules மற்றும் Grafana dashboards-உடன் tools மற்றும் services-ஐ உங்கள் environment-இல் deploy செய்கின்றன.

[EKS Managed Add-on for ADOT](https://docs.aws.amazon.com/eks/latest/userguide/opentelemetry.html)-இன் installation, configuration மற்றும் operation பற்றிய கூடுதல் தகவலுக்கு AWS documentation-ஐ பார்க்கவும்.

### Sources

EKS மெட்ரிக்குகள் overall solution-இன் வெவ்வேறு layers-இல் பல locations-இலிருந்து உருவாக்கப்படுகின்றன. Essential metrics section-இல் சுட்டிக்காட்டப்படும் metrics sources-ஐ சுருக்கமாக காட்டும் table இது.


|Layer	|Source	|Tool	|Installation மற்றும் மேலும் தகவல்	|Helm Chart	|
|---	|---	|---	|---	|---	|
|Control Plane	|*api server endpoint*/metrics	|N/A - api server prometheus format-இல் மெட்ரிக்குகளை நேரடியாக expose செய்கிறது	|https://docs.aws.amazon.com/eks/latest/userguide/prometheus.html	|N/A	|
|Cluster State	|*kube-state-metrics-http-endpoint*:8080/metrics	|kube-state-metrics	|https://github.com/kubernetes/kube-state-metrics#overview	|https://github.com/kubernetes/kube-state-metrics#helm-chart	|
|Kube Proxy	|*kube-proxy-http*:10249/metrics	|N/A - kube proxy prometheus format-இல் மெட்ரிக்குகளை நேரடியாக expose செய்கிறது	|https://kubernetes.io/docs/reference/command-line-tools-reference/kube-proxy/	|N/A	|
|VPC CNI	|*vpc-cni-metrics-helper*/metrics	|cni-metrics-helper	|https://github.com/aws/amazon-vpc-cni-k8s/blob/master/cmd/cni-metrics-helper/README.md	|https://github.com/aws/amazon-vpc-cni-k8s/tree/master/charts/cni-metrics-helper	|
|Core DNS	|*core-dns*:9153/metrics	|N/A - core DNS prometheus format-இல் மெட்ரிக்குகளை நேரடியாக expose செய்கிறது	|https://github.com/coredns/coredns/tree/master/plugin/metrics	|N/A	|
|Node	|*prom-node-exporter-http*:9100/metrics	|prom-node-exporter	|https://github.com/prometheus/node_exporter
https://prometheus.io/docs/guides/node-exporter/#node-exporter-metrics	|https://github.com/prometheus-community/helm-charts/tree/main/charts/prometheus-node-exporter	|
|Kubelet/Pod	|*kubelet*/metrics/cadvisor	|kubelet அல்லது api server மூலம் proxied	|https://kubernetes.io/docs/concepts/cluster-administration/system-metrics/	|N/A	|

### Agent : AWS Distro for OpenTelemetry

AWS EKS ADOT managed addon மூலம் உங்கள் EKS cluster-இல் ADOT-ஐ install, configure மற்றும் operate செய்வதை AWS பரிந்துரைக்கிறது. இந்த addon ADOT operator/collector custom resource model-ஐ பயன்படுத்தி உங்கள் cluster-இல் multiple ADOT collectors-ஐ deploy, configure மற்றும் manage செய்ய உதவுகிறது. இந்த addon-இன் installation, advanced configuration மற்றும் operations பற்றிய விரிவான தகவலுக்கு இந்த [documentation](https://aws-otel.github.io/docs/getting-started/adot-eks-add-on)-ஐ பார்க்கவும்.

குறிப்பு: AWS EKS ADOT managed addon web console [ADOT addon-இன் advanced configuration](https://docs.aws.amazon.com/eks/latest/userguide/deploy-collector-advanced-configuration.html)-க்கு பயன்படுத்தலாம்.

ADOT collector configuration-இல் இரண்டு components உள்ளன.

1. Collector deployment mode (deployment, daemonset, etc.) உள்ளடக்கிய [collector configuration](https://github.com/aws-observability/aws-otel-community/blob/master/sample-configs/operator/collector-config-amp.yaml).
2. Metrics collection-க்கு தேவையான receivers, processors மற்றும் exporters உள்ளடக்கிய [OpenTelemetry Pipeline configuration](https://opentelemetry.io/docs/collector/configuration/). Configuration snippet எடுத்துக்காட்டு:

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

முழுமையான best practices collector configuration, ADOT pipeline configuration மற்றும் Prometheus scrape configuration [Observability Accelerator-இல் Helm Chart](https://github.com/aws-observability/terraform-aws-observability-accelerator/blob/main/modules/eks-monitoring/otel-config/templates/opentelemetrycollector.yaml) ஆக காணலாம்.


### Destination: Amazon Managed Service for Prometheus

ADOT collector pipeline Prometheus Remote Write capabilities பயன்படுத்தி AMP instance-க்கு மெட்ரிக்குகளை export செய்கிறது. Configuration snippet எடுத்துக்காட்டு, AMP WRITE ENDPOINT URL-ஐ கவனிக்கவும்:

```
    exporters:
      prometheusremotewrite:
        endpoint: <YOUR AMP WRITE ENDPOINT URL>
        auth:
          authenticator: sigv4auth
      logging:
        loglevel: warn
```

முழுமையான best practices collector configuration, ADOT pipeline configuration மற்றும் Prometheus scrape configuration [Observability Accelerator-இல் Helm Chart](https://github.com/aws-observability/terraform-aws-observability-accelerator/blob/main/modules/eks-monitoring/otel-config/templates/opentelemetrycollector.yaml) ஆக காணலாம்.

AMP configuration மற்றும் usage-க்கான best practices [இங்கே](https://aws-observability.github.io/observability-best-practices/recipes/amp/) உள்ளது.

# தொடர்புடைய மெட்ரிக்குகள் எவை?

மெட்ரிக்குகள் குறைவாக இருந்த நாட்கள் போய்விட்டன, இன்று நூற்றுக்கணக்கான மெட்ரிக்குகள் கிடைக்கின்றன. Observability first mindset-உடன் system கட்டமைக்க relevant metrics-ஐ determine செய்வது முக்கியம்.

இந்த guide உங்களுக்கு கிடைக்கும் மெட்ரிக்குகளின் வெவ்வேறு groupings-ஐ விவரிக்கிறது மற்றும் infrastructure மற்றும் applications-இல் observability கட்டமைக்கும்போது எவற்றில் கவனம் செலுத்த வேண்டும் என்பதை விளக்குகிறது. கீழே உள்ள மெட்ரிக்குகள் பட்டியல் best practices அடிப்படையில் monitoring செய்ய நாங்கள் பரிந்துரைக்கும் மெட்ரிக்குகளின் பட்டியலாகும்.

பின்வரும் sections-இல் listed மெட்ரிக்குகள் [AWS Observability Accelerator Grafana Dashboards](https://github.com/aws-observability/terraform-aws-observability-accelerator/tree/main/modules/eks-monitoring) மற்றும் [Kube Prometheus Stack Dashboards](https://monitoring.mixins.dev/)-இல் highlighted மெட்ரிக்குகளுக்கு additional ஆகும்.

## Control Plane மெட்ரிக்குகள்

Amazon EKS control plane AWS-ஆல் உங்களுக்காக manage செய்யப்படுகிறது, AWS manage செய்யும் account-இல் இயங்குகிறது. etcd மற்றும் Kubernetes API server போன்ற Kubernetes components இயக்கும் control plane nodes-ஐ கொண்டுள்ளது. Kubernetes pods, deployments, namespaces spin up மற்றும் tear down போன்ற cluster-இல் activities பற்றி users-க்கு தெரிவிக்க various events publish செய்கிறது. Amazon EKS control plane core components சரியாக function செய்கின்றனவா மற்றும் cluster-க்கு தேவையான fundamental activities செய்ய முடிகிறதா என்பதை உறுதிசெய்ய track செய்ய வேண்டிய critical component ஆகும்.

Control Plane API Server ஆயிரக்கணக்கான மெட்ரிக்குகளை expose செய்கிறது, கீழே உள்ள table monitoring செய்ய நாங்கள் பரிந்துரைக்கும் essential control plane மெட்ரிக்குகளை பட்டியலிடுகிறது.

|பெயர்	|Metric	|விளக்கம்	|காரணம்	|
|---	|---	|---	|---	|
|API Server மொத்த requests	|apiserver_request_total	|ஒவ்வொரு verb, dry run value, group, version, resource, scope, component மற்றும் HTTP response code-க்கான apiserver requests counter.	|	|
|API Server latency	|apiserver_request_duration_seconds	|ஒவ்வொரு verb, dry run value, group, version, resource, subresource, scope மற்றும் component-க்கான response latency distribution seconds-இல்.	|	|
|Request latency	|rest_client_request_duration_seconds	|Verb மற்றும் URL-ஆல் பிரிக்கப்பட்ட request latency seconds-இல்.	|	|
|மொத்த requests	|rest_client_requests_total	|Status code, method மற்றும் host-ஆல் partitioned HTTP requests எண்ணிக்கை.	|	|
|API Server request duration	|apiserver_request_duration_seconds_bucket	|Kubernetes API server-க்கான ஒவ்வொரு request-இன் latency-ஐ seconds-இல் அளவிடுகிறது	|	|
|API server request latency sum	|apiserver_request_latencies_sum	|K8 API server requests process செய்ய எடுக்கும் மொத்த நேரத்தை track செய்யும் Cumulative Counter	|	|
|API server registered watchers	|apiserver_registered_watchers	|கொடுக்கப்பட்ட resource-க்கு தற்போது registered watchers எண்ணிக்கை	|	|
|API server objects எண்ணிக்கை	|apiserver_storage_object	|கடைசி check நேரத்தில் kind-ஆல் பிரிக்கப்பட்ட stored objects எண்ணிக்கை.	|	|
|Admission controller latency	|apiserver_admission_controller_admission_duration_seconds	|Name-ஆல் identified, ஒவ்வொரு operation, API resource மற்றும் type (validate அல்லது admit)-க்கான Admission controller latency histogram seconds-இல்.	|	|
|Etcd latency	|etcd_request_duration_seconds	|ஒவ்வொரு operation மற்றும் object type-க்கான Etcd request latency seconds-இல்.	|	|
|Etcd DB size	|apiserver_storage_db_total_size_in_bytes	|Etcd database size.	|etcd database usage-ஐ proactively monitor செய்யவும் limit-ஐ exceed செய்வதை தவிர்க்கவும் உதவுகிறது.	|

## Cluster State மெட்ரிக்குகள்

Cluster State Metrics `kube-state-metrics` (KSM)-ஆல் generate செய்யப்படுகின்றன. KSM கிளஸ்டரில் pod ஆக இயங்கும் utility, Kubernetes API Server-ஐ listen செய்து, உங்கள் cluster state மற்றும் cluster-இல் உள்ள Kubernetes objects பற்றிய insights-ஐ Prometheus metrics ஆக வழங்குகிறது. இந்த மெட்ரிக்குகள் கிடைக்க KSM [install](https://github.com/kubernetes/kube-state-metrics) செய்யப்பட வேண்டும். இந்த மெட்ரிக்குகளை Kubernetes pod scheduling effectively செய்ய பயன்படுத்துகிறது, deployments, replica sets, nodes மற்றும் pods போன்ற உள்ளே உள்ள objects-இன் health-இல் கவனம் செலுத்துகிறது.

|பெயர்	|Metric	|விளக்கம்	|
|---	|---	|---	|
|Node status	|kube_node_status_condition	|Node-இன் தற்போதைய health status. Node conditions set மற்றும் ஒவ்வொன்றுக்கும் `true`, `false` அல்லது `unknown` return செய்கிறது	|
|Desired pods	|kube_deployment_spec_replicas அல்லது kube_daemonset_status_desired_number_scheduled	|Deployment அல்லது DaemonSet-க்கு specified pods எண்ணிக்கை	|
|Current pods	|kube_deployment_status_replicas அல்லது kube_daemonset_status_current_number_scheduled	|Deployment அல்லது DaemonSet-இல் currently running pods எண்ணிக்கை	|
|Pod capacity	|kube_node_status_capacity_pods	|Node-இல் allowed maximum pods	|
|Available pods	|kube_deployment_status_replicas_available அல்லது kube_daemonset_status_number_available	|Deployment அல்லது DaemonSet-க்கு currently available pods எண்ணிக்கை	|
|Unavailable pods	|kube_deployment_status_replicas_unavailable அல்லது kube_daemonset_status_number_unavailable	|Deployment அல்லது DaemonSet-க்கு currently unavailable pods எண்ணிக்கை	|
|Pod readiness	|kube_pod_status_ready	|Pod client requests serve செய்ய ready ஆக உள்ளதா	|
|Pod status	|kube_pod_status_phase	|Pod-இன் current status; value pending/running/succeeded/failed/unknown ஆக இருக்கும்	|
|Pod waiting reason	|kube_pod_container_status_waiting_reason	|Container waiting state-இல் இருப்பதற்கான காரணம்	|
|Pod termination status	|kube_pod_container_status_terminated	|Container currently terminated state-இல் உள்ளதா இல்லையா	|
|Scheduling pending pods	|pending_pods	|Node assignment-க்கு காத்திருக்கும் pods எண்ணிக்கை	|
|Pod scheduling attempts	|pod_scheduling_attempts	|Pods schedule செய்ய மேற்கொள்ளப்பட்ட attempts எண்ணிக்கை	|

## Cluster Add-on மெட்ரிக்குகள்

Cluster add-on என்பது Kubernetes applications-க்கு supporting operational capabilities வழங்கும் software ஆகும். இதில் observability agents அல்லது networking, compute மற்றும் storage-க்கான underlying AWS resources-உடன் cluster interact செய்ய உதவும் Kubernetes drivers போன்ற software அடங்கும். Amazon EKS ஒவ்வொரு cluster-க்கும் Amazon VPC CNI plugin, `kube-proxy` மற்றும் CoreDNS போன்ற self-managed add-ons-ஐ automatically install செய்கிறது.

இந்த Cluster add-ons networking, domain name resolution போன்ற areas-இல் operational support வழங்குகின்றன. Critical supporting infrastructure மற்றும் components எவ்வாறு operate ஆகின்றன என்பது பற்றிய insights வழங்குகின்றன. Add-on metrics track செய்வது உங்கள் cluster-இன் operational health புரிந்துகொள்ள முக்கியம்.

## Amazon VPC CNI Plugin

Amazon EKS Amazon VPC Container Network Interface (VPC CNI) plugin மூலம் cluster networking-ஐ implement செய்கிறது. CNI plugin Kubernetes Pods VPC network-இல் உள்ள அதே IP address பெற உதவுகிறது. VPC CNI add-on metrics CNI Metrics Helper-ஆல் expose செய்யப்படுகின்றன. IP address allocation monitor செய்வது healthy cluster உறுதிசெய்யவும் IP exhaustion issues தவிர்க்கவும் அடிப்படையானது. [Latest networking best practices மற்றும் VPC CNI metrics collect மற்றும் monitor செய்ய இங்கே](https://aws.github.io/aws-eks-best-practices/networking/vpc-cni/#monitor-ip-address-inventory) பார்க்கவும்.

## CoreDNS மெட்ரிக்குகள்

CoreDNS Kubernetes cluster DNS ஆக serve செய்யக்கூடிய flexible, extensible DNS server ஆகும். CoreDNS pods cluster-இல் உள்ள அனைத்து pods-க்கும் name resolution வழங்குகின்றன. DNS intensive workloads இயக்கும்போது DNS throttling காரணமாக intermittent CoreDNS failures ஏற்படலாம், இது applications-ஐ பாதிக்கலாம்.

Key [CoreDNS performance metrics track செய்வதற்கான latest best practices](https://aws.github.io/aws-eks-best-practices/reliability/docs/dataplane/#monitor-coredns-metrics) மற்றும் [DNS throttling issues-க்கான CoreDNS traffic monitoring](https://aws.github.io/aws-eks-best-practices/networking/monitoring/) பார்க்கவும்.


## Pod/Container மெட்ரிக்குகள்

உங்கள் application-இன் அனைத்து layers-இலும் usage track செய்வது முக்கியம், cluster-இல் இயங்கும் nodes மற்றும் pods-ஐ closely examine செய்வதும் அடங்கும். Pod dimension-இல் கிடைக்கும் அனைத்து metrics-இலும், cluster-இல் இயங்கும் workloads-இன் state புரிந்துகொள்ள practical use-க்கான metrics இந்த list ஆகும். CPU, memory மற்றும் network usage track செய்வது application related issues diagnose மற்றும் troubleshoot செய்ய உதவுகிறது.

|Metric	|Example PromQL Query	|Dimension	|
|---	|---	|---	|
|Namespace-க்கான running pods எண்ணிக்கை	|count by(namespace) (kube_pod_info)	|Namespace-க்கான Cluster	|
|Pod-க்கான container-க்கான CPU usage	|sum(rate(container_cpu_usage_seconds_total\{container!=""\}[5m])) by (namespace, pod)	|Namespace Pod-க்கான Cluster	|
|Pod-க்கான Memory utilization	|sum(container_memory_usage_bytes\{container!=""\}) by (namespace, pod)	|Namespace Pod-க்கான Cluster	|
|Pod-க்கான Network Received Bytes	|sum by(pod) (rate(container_network_receive_bytes_total[5m]))	|Namespace Pod-க்கான Cluster	|
|Pod-க்கான Network Transmitted Bytes	|sum by(pod) (rate(container_network_transmit_bytes_total[5m]))	|Namespace Pod-க்கான Cluster	|
|Container-க்கான container restarts எண்ணிக்கை	|increase(kube_pod_container_status_restarts_total[15m]) > 3	|Namespace Pod-க்கான Cluster	|

## Node மெட்ரிக்குகள்

Kube State Metrics மற்றும் Prometheus node exporter உங்கள் cluster-இல் உள்ள nodes-இன் metric statistics-ஐ gather செய்கின்றன. Nodes status, cpu usage, memory, filesystem மற்றும் traffic track செய்வது node utilization புரிந்துகொள்ள முக்கியம்.


|Metric	|Example PromQL Query	|Dimension	|
|---	|---	|---	|
|Node CPU Utilization	|sum(rate(container_cpu_usage_seconds_total\{container!=""\}[5m])) by (node)	|Node-க்கான Cluster	|
|Node Memory Utilization	|sum(container_memory_usage_bytes\{container!=""\}) by (node)	|Node-க்கான Cluster	|
|Node Network Total Bytes	|sum by (instance) (rate(node_network_receive_bytes_total[3m]))+sum by (instance) (rate(node_network_transmit_bytes_total[3m]))	|Node-க்கான Cluster	|
|Node CPU Reserved Capacity	|sum(kube_node_status_capacity\{cluster!=""\}) by (node)	|Node-க்கான Cluster	|
|Node-க்கான Running Pods எண்ணிக்கை	|sum(kubelet_running_pods) by (instance)	|Node-க்கான Cluster	||Node Filesystem Usage	|rate(container_fs_reads_bytes_total\{job="kubelet", device=~"mmcblk.p.+|.*nvme.+|rbd.+|sd.+|vd.+|xvd.+|dm-.+|dasd.+", container!="", cluster="", namespace!=""\}[$__rate_interval]) + rate(container_fs_writes_bytes_total\{job="kubelet", device=~"mmcblk.p|.*nvme.+|rbd.+|sd.+|vd.+|xvd.+|dm-.+|dasd.+",container!="", cluster="", namespace!=""\}	|Node-க்கான Cluster	|
|Cluster CPU Utilization	|sum(rate(node_cpu_seconds_total\{mode!="idle",mode!="iowait",mode!="steal"\}[5m]))	|Cluster	|
|Cluster Memory Utilization	|1 - sum(:node_memory_MemAvailable_bytes:sum\{cluster=""\}) / sum(node_memory_MemTotal_bytes\job="node-exporter",cluster=""\})	|Cluster	|
|Cluster Network Total Bytes	|sum(rate(node_network_receive_bytes_total[3m]))+sum(rate(node_network_transmit_bytes_total[3m]))	|Cluster	|
|Running Pods எண்ணிக்கை	|sum(kubelet_running_pod_count\{cluster=""\})	|Cluster	|
|Running Containers எண்ணிக்கை	|sum(kubelet_running_container_count\{cluster=""\})	|Cluster	|
|Cluster CPU Limit	|sum(kube_node_status_allocatable\{resource="cpu"\})	|Cluster	|
|Cluster Memory Limit	|sum(kube_node_status_allocatable\{resource="memory"\})	|Cluster	|
|Cluster Node Count	|count(kube_node_info) OR sum(kubelet_node_name\{cluster=""\})	|Cluster	|

# கூடுதல் Resources

## AWS Services

[https://aws-otel.github.io/](https://aws-otel.github.io/)

[https://aws.amazon.com/prometheus](https://aws.amazon.com/prometheus)

[https://aws.amazon.com/cloudwatch/features/](https://aws.amazon.com/cloudwatch/features/)

## Blogs

[https://aws.amazon.com/blogs/containers/](https://aws.amazon.com/blogs/containers/)

[https://aws.amazon.com/blogs/containers/metrics-and-traces-collection-using-amazon-eks-add-ons-for-aws-distro-for-opentelemetry/](https://aws.amazon.com/blogs/containers/metrics-and-traces-collection-using-amazon-eks-add-ons-for-aws-distro-for-opentelemetry/)

[https://aws.amazon.com/blogs/containers/](https://aws.amazon.com/blogs/containers/)

[https://aws.amazon.com/blogs/containers/introducing-amazon-cloudwatch-container-insights-for-amazon-eks-fargate-using-aws-distro-for-opentelemetry/](https://aws.amazon.com/blogs/containers/introducing-amazon-cloudwatch-container-insights-for-amazon-eks-fargate-using-aws-distro-for-opentelemetry/)

## Infrastructure as Code Resources

[https://github.com/aws-observability/terraform-aws-observability-accelerator](https://github.com/aws-observability/terraform-aws-observability-accelerator)

[https://github.com/aws-ia/terraform-aws-eks-blueprints](https://github.com/aws-ia/terraform-aws-eks-blueprints)

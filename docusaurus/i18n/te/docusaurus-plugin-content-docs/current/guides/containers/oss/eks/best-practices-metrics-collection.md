# EKS Observability : అవసరమైన Metrics

# ప్రస్తుత పరిస్థితి

Monitoring అనేది infrastructure మరియు application యజమానులకు వారి systems యొక్క చారిత్రక మరియు ప్రస్తుత స్థితిని చూడడానికి మరియు అర్థం చేసుకోవడానికి ఒక మార్గాన్ని అందించే పరిష్కారంగా నిర్వచించబడింది, ఇది నిర్వచించిన metrics లేదా logs సేకరించడంపై దృష్టి పెడుతుంది.

Monitoring సంవత్సరాలుగా అభివృద్ధి చెందింది. మేము సమస్యలను debug మరియు troubleshoot చేయడానికి debug మరియు dump logs తో ప్రారంభించాము, తర్వాత syslogs, top వంటి command-line tools ఉపయోగించి basic monitoring కు చేరుకున్నాము, ఇది వాటిని dashboard లో visualize చేయగల స్థాయికి పురోగమించింది. Cloud రాకతో మరియు scale పెరుగుదలతో, మనం ఇప్పటివరకు ట్రాక్ చేసిన దానికంటే ఎక్కువ ట్రాక్ చేస్తున్నాము. పరిశ్రమ Observability వైపు మరింత మారింది, ఇది infrastructure మరియు application యజమానులు తమ systems ను సక్రియంగా troubleshoot మరియు debug చేయడానికి అనుమతించే పరిష్కారంగా నిర్వచించబడింది. Observability metrics నుండి తీసుకున్న patterns పై మరింత దృష్టి పెడుతుంది.


# Metrics, ఇది ఎందుకు ముఖ్యం?

Metrics అనేవి అవి సృష్టించబడిన సమయంతో క్రమంలో ఉంచబడిన సంఖ్యాత్మక విలువల శ్రేణి. మీ environment లోని servers సంఖ్య, వాటి disk usage, అవి సెకనుకు ఎన్ని requests నిర్వహిస్తాయో, లేదా ఈ requests పూర్తి చేయడంలో latency వంటి అన్నింటిని ట్రాక్ చేయడానికి అవి ఉపయోగించబడతాయి. Metrics మీ systems ఎలా పనిచేస్తున్నాయో చెప్పే data. మీరు చిన్న లేదా పెద్ద cluster నడుపుతున్నా, మీ systems health మరియు performance పై insights పొందడం వల్ల మెరుగుదల ప్రాంతాలను గుర్తించడం, సమస్యను troubleshoot చేయడం మరియు trace చేయడం, అలాగే మీ workloads performance మరియు efficiency ను మొత్తంగా మెరుగుపరచడం సాధ్యమవుతుంది. ఈ మార్పులు మీరు మీ cluster పై ఎంత సమయం మరియు resources ఖర్చు చేస్తారో ప్రభావితం చేయవచ్చు, ఇది నేరుగా cost గా మారుతుంది.


# Metrics Collection

EKS cluster నుండి metrics సేకరించడం [మూడు భాగాలను](https://aws-observability.github.io/observability-best-practices/recipes/telemetry/) కలిగి ఉంటుంది:

1. Sources: ఈ గైడ్‌లో జాబితా చేయబడిన వాటి వంటి metrics ఎక్కడ నుండి వస్తాయి.
2. Agents: EKS environment లో నడుస్తున్న applications, తరచుగా agent అని పిలుస్తారు, ఇది metrics monitoring data ను సేకరిస్తుంది మరియు ఈ data ను రెండవ భాగానికి push చేస్తుంది. ఈ భాగానికి కొన్ని ఉదాహరణలు [AWS Distro for OpenTelemetry (ADOT)](https://aws-otel.github.io/) మరియు [CloudWatch Agent](https://aws-observability.github.io/observability-best-practices/tools/cloudwatch_agent/)
3. Destinations: Monitoring data storage మరియు analysis solution, ఈ భాగం సాధారణంగా [time series formatted data](https://aws-observability.github.io/observability-best-practices/signals/metrics/) కోసం optimize చేయబడిన data service. ఈ భాగానికి కొన్ని ఉదాహరణలు [Amazon Managed Service for Prometheus](https://aws.amazon.com/prometheus/) మరియు [AWS Cloudwatch](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/deploy-container-insights-EKS.html).

గమనిక: ఈ విభాగంలో, configuration ఉదాహరణలు [AWS Observability Accelerator](https://aws-observability.github.io/terraform-aws-observability-accelerator/) యొక్క సంబంధిత విభాగాలకు links. EKS metrics collection implementations పై మీకు తాజా మార్గదర్శకత్వం మరియు ఉదాహరణలు అందేలా ఇది నిర్ధారిస్తుంది.

## Managed Open Source Solution

[AWS Distro for OpenTelemetry (ADOT)](https://aws-otel.github.io/) అనేది [OpenTelemetry](https://opentelemetry.io/) project యొక్క supported version, ఇది [Amazon Managed Service for Prometheus](https://aws.amazon.com/prometheus/) మరియు [AWS Cloudwatch](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/deploy-container-insights-EKS.html) వంటి వివిధ monitoring data collection solutions కు correlated metrics మరియు traces పంపడానికి users ను అనుమతిస్తుంది. ADOT ను [EKS Managed Add-ons](https://docs.aws.amazon.com/eks/latest/userguide/eks-add-ons.html) ద్వారా EKS cluster పై install చేయవచ్చు మరియు metrics (ఈ page లో జాబితా చేసిన వాటి వంటివి) మరియు workload traces సేకరించడానికి configure చేయవచ్చు. ADOT add-on Amazon EKS తో compatible అని AWS validate చేసింది, మరియు ఇది తాజా bug fixes మరియు security patches తో క్రమంగా update చేయబడుతుంది. [ADOT best practices మరియు మరింత సమాచారం.](https://aws-observability.github.io/observability-best-practices/guides/operational/adot-at-scale/operating-adot-collector/)


## ADOT + AMP

AWS Distro for OpenTelemetry (ADOT), Amazon Managed Service for Prometheus (AMP), మరియు Amazon Managed Service for Grafana (AMG) తో త్వరగా ప్రారంభించడానికి అత్యంత వేగవంతమైన మార్గం AWS Observability Accelerator నుండి [infrastructure monitoring example](https://aws-observability.github.io/terraform-aws-observability-accelerator/eks/) ను ఉపయోగించడం. accelerator ఉదాహరణలు out of the box metrics collection, alerting rules మరియు Grafana dashboards తో మీ environment లో tools మరియు services ను deploy చేస్తాయి.

[EKS Managed Add-on for ADOT](https://docs.aws.amazon.com/eks/latest/userguide/opentelemetry.html) యొక్క installation, configuration మరియు operation పై అదనపు సమాచారం కోసం దయచేసి AWS documentation ను చూడండి.

### Sources

EKS metrics మొత్తం solution యొక్క వివిధ layers లో బహుళ స్థానాల నుండి సృష్టించబడతాయి. essential metrics విభాగంలో పేర్కొన్న metrics sources ను సంగ్రహించే table ఇది.


|Layer	|Source	|Tool	|Installation and More info	|Helm Chart	|
|---	|---	|---	|---	|---	|
|Control Plane	|*api server endpoint*/metrics	|N/A - api server exposes metrics in prometheus format directly 	|https://docs.aws.amazon.com/eks/latest/userguide/prometheus.html	|N/A	|
|Cluster State	|*kube-state-metrics-http-endpoint*:8080/metrics	|kube-state-metrics	|https://github.com/kubernetes/kube-state-metrics#overview	|https://github.com/kubernetes/kube-state-metrics#helm-chart	|
|Kube Proxy	|*kube-proxy-http*:10249/metrics	|N/A - kube proxy exposes metrics in prometheus format directly	|https://kubernetes.io/docs/reference/command-line-tools-reference/kube-proxy/	|N/A	|
|VPC CNI	|*vpc-cni-metrics-helper*/metrics	|cni-metrics-helper	|https://github.com/aws/amazon-vpc-cni-k8s/blob/master/cmd/cni-metrics-helper/README.md	|https://github.com/aws/amazon-vpc-cni-k8s/tree/master/charts/cni-metrics-helper	|
|Core DNS	|*core-dns*:9153/metrics	|N/A - core DNS exposes metrics in prometheus format directly	|https://github.com/coredns/coredns/tree/master/plugin/metrics	|N/A	|
|Node	|*prom-node-exporter-http*:9100/metrics	|prom-node-exporter	|https://github.com/prometheus/node_exporter
https://prometheus.io/docs/guides/node-exporter/#node-exporter-metrics	|https://github.com/prometheus-community/helm-charts/tree/main/charts/prometheus-node-exporter	|
|Kubelet/Pod	|*kubelet*/metrics/cadvisor	|kubelet or proxied through api server 	|https://kubernetes.io/docs/concepts/cluster-administration/system-metrics/	|N/A	|

### Agent : AWS Distro for OpenTelemetry

AWS EKS ADOT managed addon ద్వారా మీ EKS cluster పై ADOT యొక్క installation, configuration మరియు operations కోసం AWS సిఫార్సు చేస్తుంది. ఈ addon ADOT operator/collector custom resource model ను ఉపయోగిస్తుంది, ఇది మీ cluster పై బహుళ ADOT collectors ను deploy, configure మరియు manage చేయడానికి మిమ్మల్ని అనుమతిస్తుంది. ఈ addon యొక్క installation, advanced configuration మరియు operations పై వివరమైన సమాచారం కోసం ఈ [documentation](https://aws-otel.github.io/docs/getting-started/adot-eks-add-on) చూడండి.

గమనిక: AWS EKS ADOT managed addon web console [ADOT addon యొక్క advanced configuration](https://docs.aws.amazon.com/eks/latest/userguide/deploy-collector-advanced-configuration.html) కోసం ఉపయోగించవచ్చు.

ADOT collector configuration కు రెండు భాగాలు ఉన్నాయి.

1. [collector configuration](https://github.com/aws-observability/aws-otel-community/blob/master/sample-configs/operator/collector-config-amp.yaml) ఇందులో collector deployment mode (deployment, daemonset, etc) ఉంటుంది.
2. [OpenTelemetry Pipeline configuration](https://opentelemetry.io/docs/collector/configuration/) ఇందులో metrics collection కోసం ఏ receivers, processors, మరియు exporters అవసరమో ఉంటుంది. ఉదాహరణ configuration snippet:

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

సంపూర్ణ best practices collector configuration, ADOT pipeline configuration మరియు Prometheus scrape configuration [Observability Accelerator లో Helm Chart గా](https://github.com/aws-observability/terraform-aws-observability-accelerator/blob/main/modules/eks-monitoring/otel-config/templates/opentelemetrycollector.yaml) ఇక్కడ కనుగొనవచ్చు.


### Destination: Amazon Managed Service for Prometheus

ADOT collector pipeline AMP instance కు metrics export చేయడానికి Prometheus Remote Write సామర్థ్యాలను ఉపయోగిస్తుంది. ఉదాహరణ configuration snippet, AMP WRITE ENDPOINT URL గమనించండి

```
    exporters:
      prometheusremotewrite:
        endpoint: <YOUR AMP WRITE ENDPOINT URL>
        auth:
          authenticator: sigv4auth
      logging:
        loglevel: warn
```

సంపూర్ణ best practices collector configuration, ADOT pipeline configuration మరియు Prometheus scrape configuration [Observability Accelerator లో Helm Chart గా](https://github.com/aws-observability/terraform-aws-observability-accelerator/blob/main/modules/eks-monitoring/otel-config/templates/opentelemetrycollector.yaml) ఇక్కడ కనుగొనవచ్చు.

AMP configuration మరియు usage పై best practices [ఇక్కడ](https://aws-observability.github.io/observability-best-practices/recipes/amp/) ఉన్నాయి.

# సంబంధిత metrics ఏమిటి?

మీకు తక్కువ metrics అందుబాటులో ఉండే రోజులు పోయాయి, ఇప్పుడు దీనికి విరుద్ధంగా వందల metrics అందుబాటులో ఉన్నాయి. observability first mindset తో system నిర్మించడంలో సంబంధిత metrics ఏమిటో నిర్ణయించగలగడం ముఖ్యం.

ఈ guide మీకు అందుబాటులో ఉన్న metrics యొక్క వివిధ groupings ను వివరిస్తుంది మరియు మీరు మీ infrastructure మరియు applications లో observability నిర్మించేటప్పుడు ఏవాటిపై దృష్టి పెట్టాలో వివరిస్తుంది. క్రింది metrics జాబితా best practices ఆధారంగా monitoring సిఫార్సు చేసే metrics జాబితా.

ఈ క్రింది విభాగాలలో జాబితా చేయబడిన metrics [AWS Observability Accelerator Grafana Dashboards](https://github.com/aws-observability/terraform-aws-observability-accelerator/tree/main/modules/eks-monitoring) మరియు [Kube Prometheus Stack Dashboards](https://monitoring.mixins.dev/) లో హైలైట్ చేయబడిన metrics కు అదనంగా ఉన్నాయి.

## Control Plane Metrics

Amazon EKS control plane AWS ద్వారా మీ కోసం నిర్వహించబడుతుంది మరియు AWS నిర్వహించే account లో నడుస్తుంది. ఇది etcd మరియు Kubernetes API server వంటి Kubernetes components ను నడిపే control plane nodes ను కలిగి ఉంటుంది. pods, deployments, namespaces మరియు మరిన్నింటి spin up మరియు tear down వంటి cluster లోని activities గురించి users కు తెలియజేయడానికి Kubernetes వివిధ events ను publish చేస్తుంది. Amazon EKS control plane అనేది మీ cluster కు అవసరమైన ప్రాథమిక activities చేయగలగడానికి మరియు సరిగ్గా పనిచేయగలగడానికి core components ను ట్రాక్ చేయడానికి మీరు ట్రాక్ చేయవలసిన critical component.

Control Plane API Server వేలాది metrics ను expose చేస్తుంది, monitoring సిఫార్సు చేసే essential control plane metrics ను క్రింది table జాబితా చేస్తుంది.

|Name	|Metric	|Description	|Reason	|
|---	|---	|---	|---	|
|API Server total requests	|apiserver_request_total	|Counter of apiserver requests broken out for each verb, dry run value, group, version, resource, scope, component, and HTTP response code.	|	|
|API Server latency	|apiserver_request_duration_seconds	|Response latency distribution in seconds for each verb, dry  run value, group, version, resource, subresource, scope, and component.	|	|
|Request latency	|rest_client_request_duration_seconds	|Request latency in seconds. Broken down by verb and URL.	|	|
|Total requests	|rest_client_requests_total	|Number of HTTP requests, partitioned by status code, method,  and host.	|	|
|API Server request duration	|apiserver_request_duration_seconds_bucket	|Measures the latency for each request to the Kubernetes API server in seconds	|	|
|API server request latency sum	|apiserver_request_latencies_sum	|Cumulative Counter which tracks total time taken by the K8 API server to process requests	|	|
|API server registered watchers	|apiserver_registered_watchers	|The number of currently registered watchers for a given resource	|	|
|API server number of objects	|apiserver_storage_object	|Number of stored objects at the time of last check split by kind.	|	|
|Admission controller latency	|apiserver_admission_controller_admission_duration_seconds	|Admission controller latency histogram in seconds, identified  by name and broken out for each operation and API resource and type (validate  or admit).	|	|
|Etcd latency	|etcd_request_duration_seconds	|Etcd request latency in seconds for each operation and object  type.	|	|
|Etcd DB size	|apiserver_storage_db_total_size_in_bytes	|Etcd database size.	|etcd database వినియోగాన్ని proactively monitor చేయడానికి మరియు limit ను exceed చేయడం నివారించడానికి ఇది సహాయపడుతుంది.	|

## Cluster State metrics

Cluster State Metrics `kube-state-metrics` (KSM) ద్వారా generate చేయబడతాయి. KSM అనేది cluster లో pod గా నడిచే utility, ఇది Kubernetes API Server ను listen చేస్తూ, మీ cluster state మరియు cluster లోని Kubernetes objects పై insights ను Prometheus metrics గా అందిస్తుంది. ఈ metrics అందుబాటులో కావడానికి ముందు KSM ను [install](https://github.com/kubernetes/kube-state-metrics) చేయాలి. ఈ metrics Kubernetes ద్వారా pod scheduling సమర్థవంతంగా చేయడానికి ఉపయోగించబడతాయి, మరియు deployments, replica sets, nodes మరియు pods వంటి లోపల వివిధ objects యొక్క health పై దృష్టి పెడతాయి. Cluster state metrics pod సమాచారాన్ని status, capacity మరియు availability పై expose చేస్తాయి. మీ cluster scheduling tasks పై ఎలా perform అవుతుందో ట్రాక్ చేయడం performance ట్రాక్ చేయడానికి, సమస్యలకు ముందే తెలుసుకోవడానికి మరియు మీ cluster health ను monitor చేయడానికి అవసరం.

|Name	|Metric	|Description	|
|---	|---	|---	|
|Node status	|kube_node_status_condition	|Current health status of the node. Returns a set of node conditions and `true`, `false`, or `unknown` for each	|
|Desired pods	|kube_deployment_spec_replicas or kube_daemonset_status_desired_number_scheduled	|Number of pods specified for a Deployment or DaemonSet	|
|Current pods	|kube_deployment_status_replicas or kube_daemonset_status_current_number_scheduled	|Number of pods currently running in a Deployment or DaemonSet	|
|Pod capacity	|kube_node_status_capacity_pods	|Maximum pods allowed on the node	|
|Available pods	|kube_deployment_status_replicas_available or kube_daemonset_status_number_available	|Number of pods currently available for a Deployment or DaemonSet	|
|Unavailable pods	|kube_deployment_status_replicas_unavailable or kube_daemonset_status_number_unavailable	|Number of pods currently not available for a Deployment or DaemonSet	|
|Pod readiness	|kube_pod_status_ready	|If a pod is ready to serve client requests	|
|Pod status	|kube_pod_status_phase	|Current status of the pod; value would be pending/running/succeeded/failed/unknown	|
|Pod waiting reason	|kube_pod_container_status_waiting_reason	|Reason a container is in a waiting state	|
|Pod termination status	|kube_pod_container_status_terminated	|Whether the container is currently in a terminated state or not	|
|Pods pending scheduling	|pending_pods	|Number of pods awaiting node assignment	|
|Pod scheduling attempts	|pod_scheduling_attempts	|Number of attempts made to schedule pods	|

## Cluster Add-on Metrics

Cluster add-on అనేది Kubernetes applications కు supporting operational capabilities అందించే software. ఇందులో observability agents లేదా networking, compute మరియు storage కోసం underlying AWS resources తో cluster interact అయ్యేలా అనుమతించే Kubernetes drivers వంటి software ఉంటుంది. Add-on software సాధారణంగా Kubernetes community, AWS వంటి cloud providers, లేదా third-party vendors ద్వారా నిర్మించబడుతుంది మరియు నిర్వహించబడుతుంది. Amazon EKS ప్రతి cluster కోసం Amazon VPC CNI plugin for Kubernetes, `kube-proxy`, మరియు CoreDNS వంటి self-managed add-ons ను స్వయంచాలకంగా install చేస్తుంది.

ఈ Cluster add-ons networking, domain name resolution వంటి వివిధ ప్రాంతాలలో operational support అందిస్తాయి. critical supporting infrastructure మరియు components ఎలా operate అవుతున్నాయో insights అందిస్తాయి. మీ clusters operational health అర్థం చేసుకోవడానికి add-on metrics ట్రాక్ చేయడం ముఖ్యం.

మీరు monitoring చేయాలని పరిగణించవలసిన essential add-ons వాటి essential metrics తో పాటు క్రింద ఉన్నాయి.

## Amazon VPC CNI Plugin

Amazon EKS cluster networking ను Amazon VPC Container Network Interface (VPC CNI) plugin ద్వారా implement చేస్తుంది. CNI plugin Kubernetes Pods VPC network లో ఉన్న అదే IP address కలిగి ఉండేలా అనుమతిస్తుంది. మరింత ప్రత్యేకంగా, Pod లోని అన్ని containers network namespace ను share చేసుకుంటాయి, మరియు local ports ఉపయోగించి ఒకదానితో ఒకటి communicate చేయగలవు. VPC CNI add-on మీ Amazon EKS clusters యొక్క security మరియు stability ను నిరంతరం నిర్ధారించడానికి మరియు add-ons install, configure మరియు update చేయడానికి అవసరమైన effort తగ్గించడానికి మిమ్మల్ని అనుమతిస్తుంది.

VPC CNI add-on metrics CNI Metrics Helper ద్వారా expose చేయబడతాయి. ఆరోగ్యకరమైన cluster నిర్ధారించడానికి మరియు IP exhaustion సమస్యలను నివారించడానికి IP address allocation ను monitor చేయడం ప్రాథమికం. [తాజా networking best practices మరియు సేకరించి monitor చేయవలసిన VPC CNI metrics ఇక్కడ ఉన్నాయి](https://aws.github.io/aws-eks-best-practices/networking/vpc-cni/#monitor-ip-address-inventory).

## CoreDNS Metrics

CoreDNS అనేది Kubernetes cluster DNS గా పనిచేయగల flexible, extensible DNS server. CoreDNS pods cluster లోని అన్ని pods కు name resolution అందిస్తాయి. DNS intensive workloads నడిపేటప్పుడు DNS throttling వల్ల intermittent CoreDNS failures అనుభవించవచ్చు, ఇది applications ను ప్రభావితం చేయవచ్చు.

ముఖ్యమైన [CoreDNS performance metrics ట్రాక్ చేయడానికి తాజా best practices ఇక్కడ](https://aws.github.io/aws-eks-best-practices/reliability/docs/dataplane/#monitor-coredns-metrics) మరియు [DNS throttling సమస్యల కోసం CoreDNS traffic monitoring](https://aws.github.io/aws-eks-best-practices/networking/monitoring/) చూడండి.


## Pod/Container Metrics

మీ application యొక్క అన్ని layers లో usage ట్రాక్ చేయడం ముఖ్యం, ఇందులో మీ cluster లో నడుస్తున్న nodes మరియు pods ను నిశితంగా చూడడం ఉంటుంది. Pod dimension లో అందుబాటులో ఉన్న అన్ని metrics లో, మీ cluster లో నడుస్తున్న workloads స్థితిని అర్థం చేసుకోవడానికి ఈ metrics జాబితా ఆచరణాత్మక ఉపయోగం. CPU, memory మరియు network usage ట్రాక్ చేయడం application సంబంధిత సమస్యలను diagnosis మరియు troubleshooting చేయడానికి అనుమతిస్తుంది. మీ workload metrics ట్రాక్ చేయడం EKS పై నడుస్తున్న మీ workloads ను right size చేయడానికి resource utilization insights అందిస్తుంది.

|Metric	|Example PromQL Query	|Dimension	|
|---	|---	|---	|
|Number of running pods per namspace	|count by(namespace) (kube_pod_info)	|Per Cluster by Namespace	|
|CPU usage per container per pod	|sum(rate(container_cpu_usage_seconds_total\{container!=""\}[5m])) by (namespace, pod)	|Per Cluster by Namespace by Pod	|
|Memory utilization per pod	|sum(container_memory_usage_bytes\{container!=""\}) by (namespace, pod)	|Per Cluster by Namespace by Pod	|
|Network Received Bytes per pod	|sum by(pod) (rate(container_network_receive_bytes_total[5m]))	|Per Cluster by Namespace by Pod	|
|Network Transmitted Bytes per pod	|sum by(pod) (rate(container_network_transmit_bytes_total[5m]))	|Per Cluster by Namespace by Pod	|
|The number of container restarts per container	|increase(kube_pod_container_status_restarts_total[15m]) > 3	|Per Cluster by Namespace by Pod	|

## Node Metrics

Kube State Metrics మరియు Prometheus node exporter మీ cluster లోని nodes పై metric statistics సేకరిస్తాయి. మీ nodes status, cpu usage, memory, filesystem మరియు traffic ట్రాక్ చేయడం మీ node utilization అర్థం చేసుకోవడానికి ముఖ్యం. మీ nodes resources ఎలా utilize అవుతున్నాయో అర్థం చేసుకోవడం మీ cluster పై నడపాలనుకునే workloads types కు instance types మరియు storage సమర్థవంతంగా ఎంచుకోవడానికి ముఖ్యం. మీరు ట్రాక్ చేయవలసిన essential metrics క్రింద ఉన్నాయి.


|Metric	|Example PromQL Query	|Dimension	|
|---	|---	|---	|
|Node CPU Utilization	|sum(rate(container_cpu_usage_seconds_total\{container!=""\}[5m])) by (node)	|Per Cluster by Node	|
|Node Memory Utilization	|sum(container_memory_usage_bytes\{container!=""\}) by (node)	|Per Cluster by Node	|
|Node Network Total Bytes	|sum by (instance) (rate(node_network_receive_bytes_total[3m]))+sum by (instance) (rate(node_network_transmit_bytes_total[3m]))	|Per Cluster by Node	|
|Node CPU Reserved Capacity	|sum(kube_node_status_capacity\{cluster!=""\}) by (node)	|Per Cluster by Node	|
|Number of Running Pods per Node	|sum(kubelet_running_pods) by (instance)	|Per Cluster by Node	||Node Filesystem Usage	|rate(container_fs_reads_bytes_total\{job="kubelet", device=~"mmcblk.p.+|.*nvme.+|rbd.+|sd.+|vd.+|xvd.+|dm-.+|dasd.+", container!="", cluster="", namespace!=""\}[$__rate_interval]) + rate(container_fs_writes_bytes_total\{job="kubelet", device=~"mmcblk.p|.*nvme.+|rbd.+|sd.+|vd.+|xvd.+|dm-.+|dasd.+",container!="", cluster="", namespace!=""\}	|Per Cluster by Node	|
|Cluster CPU Utilization	|sum(rate(node_cpu_seconds_total\{mode!="idle",mode!="iowait",mode!="steal"\}[5m]))	|Per Cluster	|
|Cluster Memory Utilization	|1 - sum(:node_memory_MemAvailable_bytes:sum\{cluster=""\}) / sum(node_memory_MemTotal_bytes\job="node-exporter",cluster=""\})	|Per Cluster	|
|Cluster Network Total Bytes	|sum(rate(node_network_receive_bytes_total[3m]))+sum(rate(node_network_transmit_bytes_total[3m]))	|Per Cluster	|
|Number of Running Pods	|sum(kubelet_running_pod_count\{cluster=""\})	|Per Cluster	|
|Number of Running Containers	|sum(kubelet_running_container_count\{cluster=""\})	|Per Cluster	|
|Cluster CPU Limit	|sum(kube_node_status_allocatable\{resource="cpu"\})	|Per Cluster	|
|Cluster Memory Limit	|sum(kube_node_status_allocatable\{resource="memory"\})	|Per Cluster	|
|Cluster Node Count	|count(kube_node_info) OR sum(kubelet_node_name\{cluster=""\})	|Per Cluster	|

# అదనపు వనరులు

## AWS Services

[https://aws-otel.github.io/](https://aws-otel.github.io/)

[https://aws.amazon.com/prometheus](https://aws.amazon.com/prometheus)

[https://aws.amazon.com/cloudwatch/features/](https://aws.amazon.com/cloudwatch/features/)

## Blogs

[https://aws.amazon.com/blogs/containers/](https://aws.amazon.com/blogs/containers/)

[https://aws.amazon.com/blogs/containers/metrics-and-traces-collection-using-amazon-eks-add-ons-for-aws-distro-for-opentelemetry/](https://aws.amazon.com/blogs/containers/metrics-and-traces-collection-using-amazon-eks-add-ons-for-aws-distro-for-opentelemetry/)

[https://aws.amazon.com/blogs/containers/](https://aws.amazon.com/blogs/containers/)

[https://aws.amazon.com/blogs/containers/introducing-amazon-cloudwatch-container-insights-for-amazon-eks-fargate-using-aws-distro-for-opentelemetry/](https://aws.amazon.com/blogs/containers/introducing-amazon-cloudwatch-container-insights-for-amazon-eks-fargate-using-aws-distro-for-opentelemetry/)

## Infrastructure as Code వనరులు

[https://github.com/aws-observability/terraform-aws-observability-accelerator](https://github.com/aws-observability/terraform-aws-observability-accelerator)

[https://github.com/aws-ia/terraform-aws-eks-blueprints](https://github.com/aws-ia/terraform-aws-eks-blueprints)

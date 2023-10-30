# EKS Observability : Essential Metrics

# Current Landscape

Monitoring is defined as a solution that allows infrastructure and application owners a way to see and understand both historical and current state of their systems, focused on gathering defined metrics or logs.  

Monitoring has evolved through the years.  We started working with debug and dump logs to debug and troubleshoot issues to having basic monitoring using command-line tools like syslogs, top etc, which progressed to being able to visualize them in a dashboard.  In the advent of cloud and increase in scale,  we are tracking more today that we have ever been.  The industry has shifted more into Observability, which is defined as a solution to allow infrastructure and application owners to actively troubleshoot and debug their systems.  With Observability focusing more on looking at patterns derived from the metrics.


# Metrics, why does it matter?

Metrics are a series of numerical values that are kept in order with the time that they are created. They are used to track everything from the number of servers in your environment, their disk usage, number of requests they handle per second, or the latency in completing these requests.  Metrics are data that tell you how your systems are performing.  Whether you are running a small or large cluster, getting insights on your systems health and performance allows you to identify areas of improvement, ability to troubleshoot and trace an issue, as well as improve your workloads performance and efficiency as whole.  These changes can impact how much time and resources you spend on your cluster, which translates directly into cost.


# Metrics Collection

Collecting metrics from an EKS cluster consists of [three components](https://aws-observability.github.io/observability-best-practices/recipes/telemetry/) :

1. Sources: where metrics come from like the ones listed in this guide.
2. Agents: Applications running in the EKS environment, often called an agent, which collects the metrics monitoring data and pushes this data to the second component. Some examples of this component are [AWS Distro for OpenTelemetry (ADOT)](https://aws-otel.github.io/) and [CloudWatch Agent](https://aws-observability.github.io/observability-best-practices/tools/cloudwatch_agent/)
3. Destinations: A monitoring data storage and analysis solution, this component is typically a data service that is optimized for [time series formatted data](https://aws-observability.github.io/observability-best-practices/signals/metrics/). Some examples of this component are [Amazon Managed Service for Prometheus](https://aws.amazon.com/prometheus/) and [AWS Cloudwatch](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/deploy-container-insights-EKS.html).

Note: In this section, configuration examples are links to relevant sections of the [AWS Observability Accelerator](https://aws-observability.github.io/terraform-aws-observability-accelerator/). This is to ensure you get up to date guidance and examples on EKS metrics collection implementations.

## Managed Open Source Solution

[AWS Distro for OpenTelemetry (ADOT)](https://aws-otel.github.io/) is a supported version of the [OpenTelemetry](https://opentelemetry.io/) project that enables users to send correlated metrics and traces to various monitoring data collection solutions like [Amazon Managed Service for Prometheus](https://aws.amazon.com/prometheus/) and [AWS Cloudwatch](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/deploy-container-insights-EKS.html). ADOT can be installed through [EKS Managed Add-ons](https://docs.aws.amazon.com/eks/latest/userguide/eks-add-ons.html) on to an EKS cluster and configured to collect metrics (like the ones listed on this page) and workload traces. AWS has validated that the ADOT add-on is compatible with Amazon EKS, and it is regularly updated with the latest bug fixes and security patches. [ADOT best practices and more information.](https://aws-observability.github.io/observability-best-practices/guides/operational/adot-at-scale/operating-adot-collector/)


## ADOT + AMP

The quickest way to get up and running with AWS Distro for OpenTelemetry (ADOT), Amazon Managed Service for Prometheus (AMP), and Amazon Managed Service for Grafana (AMG) is to utilize the [infrastructure monitoring example](https://aws-observability.github.io/terraform-aws-observability-accelerator/eks/) from AWS Observability Accelerator. The accelerator examples deploy the tools and services in your environment with out of the box metrics collection, alerting rules and Grafana dashboards.

Please refer to the AWS documentation for additional information on installation, configuration and operation of [EKS Managed Add-on for ADOT](https://docs.aws.amazon.com/eks/latest/userguide/opentelemetry.html).

### Sources

EKS metrics are created from multiple locations at different layers of an overall solution. This is a table summarizing the metrics sources that are called out in essential metrics section.


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

AWS recommends installation, configuration and operations of ADOT on your EKS cluster through the AWS EKS ADOT managed addon. This addon utilized the ADOT operator/collector custom resource model allowing you to deploy, configure and manage multiple ADOT collectors on your cluster. For detailed information on installation, advanced configuration and operations of this addon check out this [documentation](https://aws-otel.github.io/docs/getting-started/adot-eks-add-on).

Note: The AWS EKS ADOT managed addon web console can be used for [advanced configuration of the ADOT addon](https://docs.aws.amazon.com/eks/latest/userguide/deploy-collector-advanced-configuration.html).

There are two components to the ADOT collector configuration.

1. The [collector configuration](https://github.com/aws-observability/aws-otel-community/blob/master/sample-configs/operator/collector-config-amp.yaml) which includes collector deployment mode (deployment, daemonset, etc).
2. The [OpenTelemetry Pipeline configuration](https://opentelemetry.io/docs/collector/configuration/) which includes what receivers, processors, and exporters are needed for metrics collection. Example configuration snippet:

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

A complete best practices collector configuration, ADOT pipeline configuration and Prometheus scrape configuration can be found here as [a Helm Chart in the Observability Accelerator](https://github.com/aws-observability/terraform-aws-observability-accelerator/blob/main/modules/eks-monitoring/otel-config/templates/opentelemetrycollector.yaml).


### Destination: Amazon Managed Service for Prometheus

The ADOT collector pipeline utilizes Prometheus Remote Write capabilities to export metrics to an AMP instance. Example configuration snippet, note the AMP WRITE ENDPOINT URL

```
    exporters:
      prometheusremotewrite:
        endpoint: <YOUR AMP WRITE ENDPOINT URL>
        auth:
          authenticator: sigv4auth
      logging:
        loglevel: warn
```

A complete best practices collector configuration, ADOT pipeline configuration and Prometheus scrape configuration can be found here as [a Helm Chart in the Observability Accelerator](https://github.com/aws-observability/terraform-aws-observability-accelerator/blob/main/modules/eks-monitoring/otel-config/templates/opentelemetrycollector.yaml).

Best practices on AMP configuration and usage is [here](https://aws-observability.github.io/observability-best-practices/recipes/amp/).

# What are the relevant metrics?

Gone are the days where you have little metrics available, nowadays it is the opposite, there are hundreds of metrics available.  Being able to determine what are the relevant metrics is important towards building a system with an observability first mindset.

This guide outlines the different grouping of metrics available to you and explains which ones you should focus on as you build observability into your infrastructure and applications.  The list of metrics below are the list of metrics we recommend monitoring based on best practices.

The metrics listed in the following sections are in addition to the metrics highlighted in the [AWS Observability Accelerator Grafana Dashboards](https://github.com/aws-observability/terraform-aws-observability-accelerator/tree/main/modules/eks-monitoring) and [Kube Prometheus Stack Dashboards](https://monitoring.mixins.dev/).

## Control Plane Metrics

The Amazon EKS control plane is managed by AWS for you and runs in an account managed by AWS.  It consists of control plane nodes that run the Kubernetes components, such as etcd and the Kubernetes API server.   Kubernetes publishes various events to keep users informed of activities in the cluster, such as spinning up and tearing down pods, deployments, namespaces, and more.  The Amazon EKS control plane is a critical component that you need to track to make sure the core components are able function properly and perform the fundamental activities required by your cluster.

The Control Plane API Server exposes thousands of metrics, the table below lists the essential control plane metrics that we recommend monitoring.

|Name	|Metric	|Description	|Reason	|
|---	|---	|---	|---	|
|API Server total requests	|apiserver_request_total	|Counter of apiserver requests broken out for each verb, dry run value, group, version, resource, scope, component, and HTTP response code.	|	|
|API Server latency	|apiserver_request_duration_seconds	|Response latency distribution in seconds for each verb, dry  run value, group, version, resource, subresource, scope, and component.	|	|
|Request latency	|rest_client_request_duration_seconds	|Request latency in seconds. Broken down by verb and URL.	|	|
|Total requests	|rest_client_requests_total	|Number of HTTP requests, partitioned by status code, method,  and host.	|	|
|API Server request duration	|apiserver_request_duration_seconds_bucket	|Measures the latency for each request to the Kubernetes API server in seconds	|	|
|API server request duration seconds	|apiserver_request_duration_seconds	|Response latency distribution in seconds for each verb, dry run value, group, version, resource, subresource, scope and component	|	|
|API server longrunning requests	|apiserver_longrunning_requests	|Gauge of all active long-running apiserver requests broken out by verb, group,version, resource, scope and component. This metric is used for monitoring api watchers |	|
|API server number of objects	|apiserver_storage_object	|Number of stored objects at the time of last check split by kind.	|	|
|Admission controller latency	|apiserver_admission_controller_admission_duration_seconds	|Admission controller latency histogram in seconds, identified  by name and broken out for each operation and API resource and type (validate  or admit).	|	|
|Etcd latency	|etcd_request_duration_seconds	|Etcd request latency in seconds for each operation and object  type.	|	|
|Etcd DB size	|apiserver_storage_db_total_size_in_bytes	|Etcd database size.	|This helps you proactively monitor etcd database usage, and avoid overrunning the limit.	|

## Cluster State metrics

The Cluster State Metrics are generated by `kube-state-metrics` (KSM). KSM is a utility that runs as a pod in the cluster, listening to the Kubernetes API Server, providing you insights into your cluster state and Kubernetes objects in your cluster as Prometheus metrics.  KSM will need to be [installed](https://github.com/kubernetes/kube-state-metrics) before these metrics are available.  These metrics are used by Kubernetes to effectively do pod scheduling, and is focused on the health of various objects inside, such as deployments, replica sets, nodes and pods.  Cluster state metrics expose pod information on status, capacity and availability.  Its essential to keep track on how your cluster is performing on scheduling tasks for your cluster so you can keep track performance, get ahead of issues and monitor the health of your cluster. There are about X number of exposed Cluster State Metrics, the table below lists the essential metrics that should be tracked.

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

Cluster add-on is software that provides supporting operational capabilities to Kubernetes applications.  This includes software like observability agents or Kubernetes drives that allow the cluster to interact with underlying AWS resources for networking, compute and storage.   Add-on software is typically built and maintained by the Kubernetes community, cloud providers like AWS, or third-party vendors. Amazon EKS automatically installs self-managed add-ons such as the Amazon VPC CNI plugin for Kubernetes, `kube-proxy`, and CoreDNS for every cluster.

These Cluster add-ons provide operational support in different areas like networking, domain name resolution, etc.  They provide you with insights on how the critical supporting infrastructure and components are operating. Tracking add-on metrics are important to understand your clusters operational health.

Below are the essential add-ons that you should consider monitoring along with their essential metrics.

## Amazon VPC CNI Plugin

Amazon EKS implements cluster networking through the Amazon VPC Container Network Interface (VPC CNI) plugin.  The CNI plugin allows Kubernetes Pods to have the same IP address ad they do on the VPC network.  More specifically, all containers inside the Pod share a network namespace, and they can communicate with each-other using local ports. The VPC CNI add-on enables you to continuously ensure the security and stability of your Amazon EKS clusters and decrease the amount of effort required to install, configure and update add-ons.

VPC CNI add-on metrics are exposed by the CNI Metrics Helper. Monitoring the IP address allocation is fundamental to ensuring a healthy cluster and avoiding IP exhaustion issues. [Here is the latest networking best practices and VPC CNI metrics to collect and monitor](https://aws.github.io/aws-eks-best-practices/networking/vpc-cni/#monitor-ip-address-inventory).

## CoreDNS Metrics

CoreDNS is a flexible, extensible DNS server that can serve as the Kubernetes cluster DNS.  The CoreDNS pods provide name resolution for all pods in the cluster.  Running DNS intensive workloads can sometimes experience intermittent CoreDNS failures due to DNS throttling, and this can impact applications.  

Checkout the latest best practices for tracking key [CoreDNS performance metrics here](https://aws.github.io/aws-eks-best-practices/reliability/docs/dataplane/#monitor-coredns-metrics) and [Monitoring CoreDNS traffic for DNS throttling issues](https://aws.github.io/aws-eks-best-practices/networking/monitoring/)


## Pod/Container Metrics

Tracking usage in across all layers of you application is important, these includes taking a closer look at your nodes and pods running inside your cluster. Out of all the metrics available at the pod dimension, this list of metrics are of practical use for you to understand the state of the workloads running on your cluster. Tracking CPU, memory and network usage allows for diagnosing and troubleshooting application related issues. Tracking your workload metrics provide you insights into your resource utilization to right size your workloads running on EKS.

|Metric	|Example PromQL Query	|Dimension	|
|---	|---	|---	|
|Number of running pods per namspace	|count by(namespace) (kube_pod_info)	|Per Cluster by Namespace	|
|CPU usage per container per pod	|sum(rate(container_cpu_usage_seconds_total{container!=""}[5m])) by (namespace, pod)	|Per Cluster by Namespace by Pod	|
|Memory utilization per pod	|sum(container_memory_usage_bytes{container!=""}) by (namespace, pod)	|Per Cluster by Namespace by Pod	|
|Network Received Bytes per pod	|sum by(pod) (rate(container_network_receive_bytes_total[5m]))	|Per Cluster by Namespace by Pod	|
|Network Transmitted Bytes per pod	|sum by(pod) (rate(container_network_transmit_bytes_total[5m]))	|Per Cluster by Namespace by Pod	|
|The number of container restarts per container	|increase(kube_pod_container_status_restarts_total[15m]) > 3	|Per Cluster by Namespace by Pod	|

## Node Metrics

Kube State Metrics and Prometheus node exporter gathers metric statistics on the nodes in your cluster.  Tracking your nodes status, cpu usage, memory, filesystem and traffic is important to understand your node utilization.  Understanding how your nodes resources are being utilized is important for properly selecting instance types and storage to effectively the types of workloads you expect to run on your cluster.  The metrics below are some of the essential metrics that you should be tracking.


|Metric	|Example PromQL Query	|Dimension	|
|---	|---	|---	|
|Node CPU Utilization	|sum(rate(container_cpu_usage_seconds_total{container!=""}[5m])) by (node)	|Per Cluster by Node	|
|Node Memory Utilization	|sum(container_memory_usage_bytes{container!=""}) by (node)	|Per Cluster by Node	|
|Node Network Total Bytes	|sum by (instance) (rate(node_network_receive_bytes_total[3m]))+sum by (instance) (rate(node_network_transmit_bytes_total[3m]))	|Per Cluster by Node	|
|Node CPU Reserved Capacity	|sum(kube_node_status_capacity{cluster!=""}) by (node)	|Per Cluster by Node	|
|Number of Running Pods per Node	|sum(kubelet_running_pods) by (instance)	|Per Cluster by Node	|
|Node Filesystem Usage	|rate(container_fs_reads_bytes_total{job="kubelet", device=~"mmcblk.p.+|.*nvme.+|rbd.+|sd.+|vd.+|xvd.+|dm-.+|dasd.+", container!="", cluster="", namespace!=""}[$__rate_interval]) + rate(container_fs_writes_bytes_total{job="kubelet", device=~"mmcblk.p.+|.*nvme.+|rbd.+|sd.+|vd.+|xvd.+|dm-.+|dasd.+", container!="", cluster="", namespace!=""}	|Per Cluster by Node	|
|Cluster CPU Utilization	|sum(rate(node_cpu_seconds_total{mode!="idle",mode!="iowait",mode!="steal"}[5m]))	|Per Cluster	|
|Cluster Memory Utilization	|1 - sum(:node_memory_MemAvailable_bytes:sum{cluster=""}) / sum(node_memory_MemTotal_bytes{job="node-exporter",cluster=""})	|Per Cluster	|
|Cluster Network Total Bytes	|sum(rate(node_network_receive_bytes_total[3m]))+sum(rate(node_network_transmit_bytes_total[3m]))	|Per Cluster	|
|Number of Running Pods	|sum(kubelet_running_pod_count{cluster=""})	|Per Cluster	|
|Number of Running Containers	|sum(kubelet_running_container_count{cluster=""})	|Per Cluster	|
|Cluster CPU Limit	|sum(kube_node_status_allocatable{resource="cpu"})	|Per Cluster	|
|Cluster Memory Limit	|sum(kube_node_status_allocatable{resource="memory"})	|Per Cluster	|
|Cluster Node Count	|count(kube_node_info) OR sum(kubelet_node_name{cluster=""})	|Per Cluster	|

# Additional Resources

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

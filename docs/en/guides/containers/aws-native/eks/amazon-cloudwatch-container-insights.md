# Amazon CloudWatch Container Insights

In this section of Observability best practices guide, we will deep dive on to following topics related to Amazon CloudWatch Container Insights :

* Introduction to Amazon CloudWatch Container Insights
* Using Amazon CloudWatch Container Insights with AWS Distro for Open Telemetry
* Fluent Bit Integration in CloudWatch Container Insights for Amazon EKS
* Cost savings with Container Insights on Amazon EKS
* Using EKS Blueprints to setup Container Insights

### Introduction

[Amazon CloudWatch Container Insights](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/ContainerInsights.html) helps customers collect, aggregate, and summarize metrics and logs from containerized applications and microservices. Metrics data is collected as performance log events using the [embedded metric format](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch_Embedded_Metric_Format.html). These performance log events use a structured JSON schema that enables high-cardinality data to be ingested and stored at scale. From this data, CloudWatch creates aggregated metrics at the cluster, node, pod, task, and service level as CloudWatch metrics. The metrics that Container Insights collects are available in CloudWatch automatic dashboards. Container Insights are available for Amazon EKS clusters with self managed node groups, managed node groups and AWS Fargate profiles.

From a cost optimization standpoint and to help you manage your Container Insights cost, CloudWatch does not automatically create all possible metrics from the log data. However, you can view additional metrics and additional levels of granularity by using CloudWatch Logs Insights to analyze the raw performance log events. Metrics collected by Container Insights are charged as custom metrics. For more information about CloudWatch pricing, see [Amazon CloudWatch Pricing](https://aws.amazon.com/cloudwatch/pricing/).

In Amazon EKS, Container Insights uses a containerized version of the [CloudWatch agent](https://gallery.ecr.aws/cloudwatch-agent/cloudwatch-agent) which is provided by Amazon via Amazon Elastic Container Registry to discover all of the running containers in a cluster. It then collects performance data at every tier of the performance stack. Container Insights supports encryption with the AWS KMS key for the logs and metrics that it collects. To enable this encryption, you must manually enable AWS KMS encryption for the log group that receives Container Insights data. This results in CloudWatch Container Insights encrypting this data using the provided AWS KMS key. Only symmetric keys are supported and asymmetric AWS KMS keys are not supported to encrypt your log groups. Container Insights are supported only in Linux instances. Container Insights for Amazon EKS is supported in the [these](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/ContainerInsights.html#:~:text=Container%20Insights%20for%20Amazon%20EKS%20and%20Kubernetes%20is%20supported%20in%20the%20following%20Regions%3A) AWS Regions.

### Using Amazon CloudWatch Container Insights  with AWS Distro for Open Telemetry

We will now deep dive in to [AWS Distro for OpenTelemetry (ADOT)](https://aws-otel.github.io/docs/introduction) which is one of the options to enable collection of Container insight metrics from Amazon EKS workloads. [AWS Distro for OpenTelemetry (ADOT)](https://aws-otel.github.io/docs/introduction) is a secure, AWS-supported distribution of the [OpenTelemetry](https://opentelemetry.io/docs/) project. With ADOT, users can instrument their applications just once to send correlated metrics and traces to multiple monitoring solutions. With ADOT support for CloudWatch Container Insights, customers can collect system metrics such as CPU, memory, disk, and network usage from Amazon EKS clusters running on [Amazon Elastic Cloud Compute](https://aws.amazon.com/pm/ec2/?trk=ps_a134p000004f2ZFAAY&trkCampaign=acq_paid_search_brand&sc_channel=PS&sc_campaign=acquisition_US&sc_publisher=Google&sc_category=Cloud%20Computing&sc_country=US&sc_geo=NAMER&sc_outcome=acq&sc_detail=amazon%20ec2&sc_content=EC2_e&sc_matchtype=e&sc_segment=467723097970&sc_medium=ACQ-P|PS-GO|Brand|Desktop|SU|Cloud%20Computing|EC2|US|EN|Text&s_kwcid=AL!4422!3!467723097970!e!!g!!amazon%20ec2&ef_id=Cj0KCQiArt6PBhCoARIsAMF5waj-FXPUD0G-cm0dJ05Mz6aXDvqEGu-S7pCXwvVusULN6ZbPbc_Alg8aArOHEALw_wcB:G:s&s_kwcid=AL!4422!3!467723097970!e!!g!!amazon%20ec2) (Amazon EC2), providing the same experience as Amazon CloudWatch agent. ADOT Collector is now available with support for CloudWatch Container Insights for Amazon EKS and AWS Fargate profile for Amazon EKS. Customers can now collect container and pod metrics such as CPU and memory utilization for their pods that are deployed to an Amazon EKS cluster and view them in CloudWatch dashboards without any changes to their existing CloudWatch Container Insights experience. This will enable customers to also determine whether to scale up or down to respond to traffic and save costs.

The ADOT Collector has the [concept of a pipeline](https://opentelemetry.io/docs/collector/configuration/) which comprises three key types of components, namely, receiver, processor, and exporter. A [receiver](https://opentelemetry.io/docs/collector/configuration/#receivers) is how data gets into the collector. It accepts data in a specified format, translates it into the internal format and passes it to [processors](https://opentelemetry.io/docs/collector/configuration/#processors) and [exporters](https://opentelemetry.io/docs/collector/configuration/#exporters) defined in the pipeline. It can be pull or push based. A processor is an optional component that is used to perform tasks such as batching, filtering, and transformations on data between being received and being exported. An exporter is used to determine which destination to send the metrics, logs or traces. The collector architecture allows multiple instances of such pipelines to be defined via YAML configuration. The following diagram illustrates the pipeline components in an ADOT Collector instance deployed to Amazon EKS.

![CW-ADOT](../../../../../images/Containers/aws-native/eks/cw-adot-collector-pipeline.jpg)

*Figure: Pipeline components in an ADOT Collector instance deployed to Amazon EKS*

The kubelet on a worker node in a Kubernetes cluster exposes resource metrics such as CPU, memory, disk, and network usage at the */metrics/cadvisor* endpoint. However, in EKS Fargate networking architecture, a pod is not allowed to directly reach the kubelet on that worker node. Hence, the ADOT Collector calls the Kubernetes API Server to proxy the connection to the kubelet on a worker node, and collect kubelet’s cAdvisor metrics for workloads on that node. These metrics are made available in Prometheus format. Therefore, the collector uses an instance of [Prometheus Receiver](https://github.com/open-telemetry/opentelemetry-collector-contrib/tree/main/receiver/prometheusreceiver) as a drop-in replacement for a Prometheus server and scrapes these metrics from the Kubernetes API server endpoint. Using Kubernetes service discovery, the receiver can discover all the worker nodes in an EKS cluster. Hence, more than one instances of ADOT Collector will suffice to collect resource metrics from all the nodes in a cluster. Having a single instance of ADOT collector can be overwhelming during higher loads so always recommend to deploy more than one collector.

The metrics then go through a series of processors that perform filtering, renaming, data aggregation and conversion, and so on. The following is the list of processors used in the pipeline of an ADOT Collector instance for Amazon EKS illustrated above.

* [Filter Processor](https://github.com/open-telemetry/opentelemetry-collector-contrib/tree/main/processor/filterprocessor) is part of the AWS OpenTelemetry distribution to include or exclude metrics based on their name. It can be used as part of the metrics collection pipeline to filter out unwanted metrics. For example, suppose that you want Container Insights to only collect pod-level metrics (with name prefix `pod_`) excluding those for networking, with name prefix `pod_network`.

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

* [Metrics Transform Processor](https://github.com/open-telemetry/opentelemetry-collector-contrib/tree/main/processor/metricstransformprocessor) can be used to rename metrics, and add, rename or delete label keys and values. It can also be used to perform scaling and aggregations on metrics across labels or label values. 

```
     metricstransform/rename:
        transforms:
          - include: container_spec_cpu_quota
            new_name: new_container_cpu_limit_raw
            action: insert
            match_type: regexp
            experimental_match_labels: {"container": "\\S"}
```

* [Cumulative to Delta Processor](https://github.com/open-telemetry/opentelemetry-collector-contrib/tree/main/processor/cumulativetodeltaprocessor) converts monotonic, cumulative sum and histogram metrics to monotonic, delta metrics. Non-monotonic sums and exponential histograms are excluded.

```
` # convert cumulative sum datapoints to delta
 cumulativetodelta:
    metrics:
        - pod_cpu_usage_seconds_total 
        - pod_network_rx_errors`
```

* [Delta to Rate Processor](https://github.com/open-telemetry/opentelemetry-collector-contrib/tree/main/processor/deltatorateprocessor) to convert delta sum metrics to rate metrics. This rate is a gauge.

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

* [Metrics Generation Processor](https://github.com/open-telemetry/opentelemetry-collector-contrib/tree/main/processor/metricsgenerationprocessor) can be used to create new metrics using existing metrics following a given rule. 

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

The final component in the pipeline is [AWS CloudWatch EMF Exporter](https://github.com/open-telemetry/opentelemetry-collector-contrib/tree/main/exporter/awsemfexporter), which converts the metrics to embedded metric format (EMF) and then sends them directly to CloudWatch Logs using the [PutLogEvents](https://docs.aws.amazon.com/AmazonCloudWatchLogs/latest/APIReference/API_PutLogEvents.html) API. The following list of metrics is sent to CloudWatch by the ADOT Collector for each of the workloads running on Amazon EKS.

* pod_cpu_utilization_over_pod_limit
* pod_cpu_usage_total
* pod_cpu_limit
* pod_memory_utilization_over_pod_limit
* pod_memory_working_set
* pod_memory_limit
* pod_network_rx_bytes
* pod_network_tx_bytes

Each metric will be associated with the following dimension sets and collected under the CloudWatch namespace named *ContainerInsights*.

* ClusterName, LaunchType
* ClusterName, Namespace, LaunchType
* ClusterName, Namespace, PodName, LaunchType

Further, Please learn about [Container Insights Prometheus support for ADOT](https://aws.amazon.com/blogs/containers/introducing-cloudwatch-container-insights-prometheus-support-with-aws-distro-for-opentelemetry-on-amazon-ecs-and-amazon-eks/) and [deploying ADOT collector on Amazon EKS to visualize Amazon EKS resource metrics using CloudWatch Container Insights](https://aws.amazon.com/blogs/containers/introducing-amazon-cloudwatch-container-insights-for-amazon-eks-fargate-using-aws-distro-for-opentelemetry/) to setup ADOT collector pipeline in your Amazon EKS cluster and how to visualize your Amazon EKS resource metrics in CloudWatch Container Insights.

### Fluent Bit Integration in CloudWatch Container Insights for Amazon EKS

[Fluent Bit](https://fluentbit.io/) is an open source and multi-platform log processor and forwarder that allows you to collect data and logs from different sources, and unify and send them to different destinations including CloudWatch Logs. It’s also fully compatible with [Docker](https://www.docker.com/) and [Kubernetes](https://kubernetes.io/) environments. Using the newly launched Fluent Bit daemonset, you can send container logs from your EKS clusters to CloudWatch logs for logs storage and analytics.

Due to its lightweight nature, using Fluent Bit as the default log forwarder in Container Insights on EKS worker nodes will allow you to stream application logs into CloudWatch logs efficiently and reliably. With Fluent Bit, Container Insights is able to deliver thousands of business critical logs at scale in a resource efficient manner, especially in terms of CPU and memory utilization at the pod level. In other words, compared to FluentD, which was the log forwarder used prior, Fluent Bit has a smaller resource footprint and, as a result, is more resource efficient for memory and CPU. On the other hand, [AWS for Fluent Bit image](https://github.com/aws/aws-for-fluent-bit), which includes Fluent Bit and related plugins, gives Fluent Bit an additional flexibility of adopting new AWS features faster as the image aims to provide a unified experience within AWS ecosystem.

The architecture below shows individual components used by CloudWatch Container Insights for EKS:

![CW-COMPONENTS](../../../../../images/Containers/aws-native/eks/cw-components.jpg)

*Figure: Individual components used by CloudWatch Container Insights for EKS.*

While working with containers, it is recommended to push all the logs, including application logs, through the standard output (stdout) and standard error output (stderr) methods whenever possible using the Docker JSON logging driver. For this reason, in EKS, the logging driver is configured by default and everything that a containerized application writes to `stdout` or `stderr` is streamed into a JSON file under `“/var/log/containers"` on the worker node. Container Insights classifies those logs into three different categories by default and creates dedicated input streams for each category within Fluent Bit and independent log groups within CloudWatch Logs. Those categories are:

* Application logs: All applications logs stored under `“/var/log/containers/*.log"` are streamed into the dedicated `/aws/containerinsights/Cluster_Name/application` log group. All non-application logs such as kube-proxy and aws-node logs are excluded by default. However, additional Kubernetes add-on logs, such as CoreDNS logs, are also processed and streamed into this log group.
* Host logs: system logs for each EKS worker node are streamed into the `/aws/containerinsights/Cluster_Name/host` log group. These system logs include the contents of `“/var/log/messages,/var/log/dmesg,/var/log/secure”` files. Considering the stateless and dynamic nature of containerized workloads, where EKS worker nodes are often being terminated during scaling activities, streaming those logs in real time with Fluent Bit and having those logs available in CloudWatch logs, even after the node is terminated, are critical in terms of observability and monitoring health of EKS worker nodes. It also enables you to debug or troubleshoot cluster issues without logging into worker nodes in many cases and analyze these logs in more systematic way.
* Data plane logs: EKS already provides [control plane logs](https://docs.aws.amazon.com/eks/latest/userguide/control-plane-logs.html). With Fluent Bit integration in Container Insights, the logs generated by EKS data plane components, which run on every worker node and are responsible for maintaining running pods are captured as data plane logs. These logs are also streamed into a dedicated CloudWatch log group under `‘ /aws/containerinsights/Cluster_Name/dataplane`. kube-proxy, aws-node, and Docker runtime logs are saved into this log group. In addition to control plane logs, having data plane logs stored in CloudWatch Logs helps to provide a complete picture of your EKS clusters.

Further, Please learn more on topics such as Fluent Bit Configurations, Fluent Bit Monitoring and Log analysis from [Fluent Bit Integration with Amazon EKS](https://aws.amazon.com/blogs/containers/fluent-bit-integration-in-cloudwatch-container-insights-for-eks/).

### Cost savings with Container Insights on Amazon EKS

With the default configuration, the Container Insights receiver collects the complete set of metrics as defined by the [receiver documentation](https://github.com/open-telemetry/opentelemetry-collector-contrib/tree/main/receiver/awscontainerinsightreceiver#available-metrics-and-resource-attributes). The number of metrics and dimensions collected is high, and for large clusters this will significantly increase the costs for metric ingestion and storage. We are going to demonstrate two different approaches that you can use to configure the ADOT Collector to send only metrics that bring value and saves cost.

#### Using processors

This approach involves the introduction of OpenTelemetry processors as discussed above to filter out metrics or attributes to reduce the size of [EMF logs](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch_Embedded_Metric_Format.html). We will demonstrate the basic usage of two processors namely *Filter* and *Resource.*

[Filter processors](https://github.com/open-telemetry/opentelemetry-collector-contrib/blob/main/processor/filterprocessor/README.md) can be included in the `ConfigMap` named `otel-agent-conf`:

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

[Resource processor](https://github.com/open-telemetry/opentelemetry-collector-contrib/blob/main/processor/resourceprocessor/README.md) is also built into the AWS OpenTelemetry Distro and can be used to remove unwanted metric attributes. For example, if you want to remove the `Kubernetes` and `Sources` fields from the EMF logs, you can add the resource processor to the pipeline:

```
  # resource processors example
  resource:
    attributes:
    - key: Sources
      action: delete
    - key: kubernetes
      action: delete
```

#### Customize Metrics and Dimensions

In this approach, you will configure the CloudWatch EMF exporter to generate only the set of metrics that you want to send to CloudWatch Logs. The [metric_declaration](https://github.com/open-telemetry/opentelemetry-collector-contrib/blob/5ccdbe08c6a2a43b7c6c7f9c0031a4b0348394a9/exporter/awsemfexporter/README.md#metric_declaration) section of CloudWatch EMF exporter configuration can be used to define the set of metrics and dimensions that you want to export. For example, you can keep only pod metrics from the default configuration. This `metric_declaration` section will look like the following and to reduce the number of metrics, you can keep the dimension set only `[PodName, Namespace, ClusterName]` if you do not care about others:

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

This configuration will produce and stream the following four metrics within single dimension `[PodName, Namespace, ClusterName]` rather than 55 different metrics for multiple dimensions in the default configuration:

* pod_cpu_utilization
* pod_memory_utilization
* pod_cpu_utilization_over_pod_limit
* pod_memory_utilization_over_pod_limit

With this configuration, you will only send the metrics that you are interested in rather than all the metrics configured by default. As a result, you will be able to decrease metric ingestion cost for Container Insights considerably. Having this flexibility will provide Container Insights costumers with high level of control over metrics being exported. Customizing metrics by modifying the `awsemf` exporter configuration is also highly flexible, and you can customize both the metrics that you want to send and their dimensions. Note that this is only applicable to logs that are sent to CloudWatch.

The two approaches demonstrated discussed above are not mutually exclusive with each other. In fact, they both can be combined for a high degree of flexibility in customizing metrics that we want ingested into our monitoring system. We use this approach to decrease costs associated with metric storage and processing, as show in following graph.

![CW-COST-EXPLORER](../../../../../images/Containers/aws-native/eks/cw-cost-explorer.jpg)

*Figure: AWS Cost Explorer*

In the preceding AWS Cost Explorer graph, we can see daily cost associated with CloudWatch using different configurations on the ADOT Collector in a small EKS cluster (20 Worker nodes, 220 pods). *Aug 15th* shows CloudWatch bill using ADOT Collector with the default configuration. On *Aug 16th*, we have used the [Customize EMF exporter](https://aws.amazon.com/blogs/containers/cost-savings-by-customizing-metrics-sent-by-container-insights-in-amazon-eks/#customize-emf-exporter) approach and can see about 30% cost savings. On *Aug 17th*, we used the [Processors](https://aws.amazon.com/blogs/containers/cost-savings-by-customizing-metrics-sent-by-container-insights-in-amazon-eks/#processors) approach, which achieves about 45% costs saving.
You must consider the trade-offs of customizing metrics sent by Container Insights as you will be able to decrease monitoring costs by sacrificing visibility of the monitored cluster. But also, the built-in dashboard provided by Container Insights within the AWS Console can be impacted by customized metrics as you can select not sending metrics and dimensions used by the dashboard. For further learning please check on [Cost savings by customizing metrics sent by Container Insights in Amazon EKS](https://aws.amazon.com/blogs/containers/cost-savings-by-customizing-metrics-sent-by-container-insights-in-amazon-eks/).

### Using EKS Blueprints to setup Container Insights

[EKS Blueprints](https://aws.amazon.com/blogs/containers/bootstrapping-clusters-with-eks-blueprints/) is a collection of Infrastructure as Code (IaC) modules that will help you configure and deploy consistent, batteries-included EKS clusters across accounts and regions. You can use EKS Blueprints to easily bootstrap an EKS cluster with [Amazon EKS add-ons](https://docs.aws.amazon.com/eks/latest/userguide/eks-add-ons.html) as well as a wide range of popular open-source add-ons, including Prometheus, Karpenter, Nginx, Traefik, AWS Load Balancer Controller, Container Insights, Fluent Bit, Keda, Argo CD, and more. EKS Blueprints is implemented in two popular IaC frameworks, [HashiCorp Terraform](https://github.com/aws-ia/terraform-aws-eks-blueprints) and [AWS Cloud Development Kit (AWS CDK)](https://github.com/aws-quickstart/cdk-eks-blueprints), which help you automate infrastructure deployments. 

As part of your Amazon EKS Cluster creation process using EKS Blueprints, you can setup Container Container Insights as a Day 2 operational tooling to collect, aggregate, and summarize metrics and logs from containerized applications and micro-services to Amazon CloudWatch console.

### Conclusion

In this section of Observability best practices guide, we covered lot of deeper details around CloudWatch Container insights which included a introduction to Amazon CloudWatch Container Insights and how it can help you to observe your containerized workloads on Amazon EKS. We covered deeper grounds on using Amazon CloudWatch Container Insights  with AWS Distro for Open Telemetry to enable collection fo Container insight metrics to visualize the metrics our your containerzied workloads on Amazon CloudWatch console. Next, we covered lot of depth around Fluent Bit Integration in CloudWatch Container Insights for Amazon EKS to create dedicated input streams within Fluent Bit and independent log groups within CloudWatch Logs for Application, Host and Data Plane logs. Next, we talked about two different approaches such as processors, metrics dimensions to achieve cost savings with CloudWatch Container insights. Finally we talked in brief about how use EKS Blueprints as a vehicle to setup Container Insights during the Amazon EKS cluster creation process. You can get hands-on experience with the [CloudWatch Container Insights module](https://catalog.workshops.aws/observability/en-US/aws-native/insights/containerinsights) with in the[One Observability Workshop](https://catalog.workshops.aws/observability/en-US).

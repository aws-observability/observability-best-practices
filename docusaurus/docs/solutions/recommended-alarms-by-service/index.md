---
title: Recommended Alarms by AWS Service
sidebar_label: Recommended Alarms
---

import RelatedEvents from '@site/src/components/RelatedEvents';

# Recommended Alarms by AWS Service

## Related Events

<RelatedEvents topics={["cloudwatch", "metrics"]} />

## Overview

This guide is a per-service catalog of **recommended Amazon CloudWatch alarms for incident detection**. For each AWS service it lists the key metrics to watch, whether the signal is reactive or proactive, a suggested alarm configuration (statistic, period, datapoints, and how to treat missing data), and the operational use case — plus concise notes on newer capabilities (OpenTelemetry metrics with PromQL, CloudWatch Database Insights, SageMaker AI Insights, Application Signals SLOs).

It complements the [Alarms and Alerting](../cloudwatch-alarms-alerting/) guide, which covers the cross-cutting *methodology* (threshold types, composite alarms, alarm fatigue, routing). This page covers *which metrics to alarm on per service*. The tables are starting points aligned with the AWS [Recommended alarms for AWS services](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Best_Practice_Recommended_Alarms_AWS_Services.html) documentation; tune thresholds to your workload.

## When to use this

- You are onboarding a workload and need a concrete starting set of alarms for the AWS services it uses.
- You want per-service metric names, statistics, and thresholds rather than general alarm theory.
- You are searching for a specific service's alarms (for example, "EC2 monitoring", "DynamoDB", "Lambda alarms").
- You want to know where newer signals fit — Database Insights DB Load, SageMaker AI Insights, or OpenTelemetry metrics queried with PromQL.

## Guidance

Each service below lists its recommended alarms. Unless a row states otherwise, treat the configuration as a starting point and baseline thresholds against your own traffic. See [Alarms and Alerting](../cloudwatch-alarms-alerting/) for the techniques (ratios, anomaly detection, composite alarms) referenced throughout.

### Compute & Containers

#### EC2

Recommended CloudWatch alarms for **Amazon EC2** to detect customer-impacting incidents. AWS also publishes [recommended alarms for EC2](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Best_Practice_Recommended_Alarms_AWS_Services.html#EC2).

> General guidelines only — tailor thresholds to your environment.

| Business Objectives | Namespace | Metric name | Reactive/Proactive | Recommended alarm configuration | Use case |
|---|---|---|---|---|---|
| Reliability | AWS/EC2 | `StatusCheckFailed_Instance` | Reactive | Statistic = Maximum; Period = 60s; DatapointsToAlarm = 3; TreatMissingData = Breaching | Reports whether the instance passed the instance status check in the last minute. Value is 0 (passed) or 1 (failed). Available at 1-minute frequency at no charge. |
| Reliability | AWS/EC2 | `StatusCheckFailed_System` | Reactive | Statistic = Maximum; Period = 60s; DatapointsToAlarm = 3; TreatMissingData = Breaching | Reports whether the instance passed the system status check in the last minute. Value is 0 (passed) or 1 (failed). Available at 1-minute frequency at no charge. Pair with an EC2 **recover** action. |
| Reliability | AWS/EC2 | `StatusCheckFailed_AttachedEBS` | Reactive | Statistic = Maximum; Period = 60s; DatapointsToAlarm = 3; TreatMissingData = Breaching | Reports whether the instance passed the attached EBS status check in the last minute. Value is 0 (passed) or 1 (failed). Available at 1-minute frequency at no charge. |
| Reliability | CWAgent | `mem_used_percent` | Proactive | Statistic = Average; Period = 60s; DatapointsToAlarm = 5; TreatMissingData = notBreaching | Percentage of memory in use. Requires the CloudWatch agent. Alarm when approaching 100% to detect memory exhaustion before OOM kills impact the instance. |
| Reliability | CWAgent | `disk_used_percent` | Proactive | Statistic = Average; Period = 60s; DatapointsToAlarm = 5; TreatMissingData = notBreaching | Percentage of disk space in use. Requires the CloudWatch agent. Alarm when above ~85% to prevent disk-full conditions that can cause application failures. |
| Reliability | AWS/EBS | `VolumeQueueLength` | Proactive | Statistic = Average; Period = 60s; DatapointsToAlarm = 5; TreatMissingData = notBreaching | Number of pending I/O requests for an EBS volume. A consistently high queue length indicates storage saturation that can degrade instance performance. |
| Reliability | AWS/EBS | `BurstBalance` | Proactive | Statistic = Average; Period = 60s; DatapointsToAlarm = 5; TreatMissingData = notBreaching | Percentage of I/O burst credits remaining for gp2/st1/sc1 volumes. Alarm when below ~20% to detect impending throughput throttling. |

##### Additional notes

- **Automatic recovery / reboot actions:** Attach EC2 actions to these alarms — `StatusCheckFailed_System` → **recover**, `StatusCheckFailed_Instance` → **reboot** — so remediation is automated. Responders can then focus on cases where auto-recovery fails.
- **CloudWatch agent for OS-level metrics:** `CPUUtilization`, `NetworkIn/Out`, `DiskReadOps` etc. are native, but **memory and disk usage are not** — install the **CloudWatch agent** (which now embeds an OpenTelemetry/OTLP pipeline) to publish the `CWAgent` namespace metrics above.
- **OpenTelemetry (OTEL) via the CloudWatch agent:** The unified CloudWatch agent can ingest **OTLP** metrics and traces; standardize host + application instrumentation on OTEL and still alarm in CloudWatch. OTEL-sourced host metrics land in a custom namespace (e.g., `CWAgent` or your own), so point incident-detection alarms there.
- **Fleet-wide alarming:** For Auto Scaling groups, alarm on ASG-level aggregates and use **CloudWatch metric math / anomaly detection** rather than per-instance alarms that churn as instances scale.


#### ECS

Recommended CloudWatch alarms for **Amazon ECS** (with Container Insights) to detect customer-impacting incidents. AWS also publishes [recommended alarms for ECS with Container Insights](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Best_Practice_Recommended_Alarms_AWS_Services.html#ECS-ContainerInsights).

> General guidelines only — tailor thresholds to your environment. These metrics require **Container Insights** to be enabled on the cluster.

| Business Objectives | Namespace | Metric name | Reactive/Proactive | Recommended alarm configuration | Use case |
|---|---|---|---|---|---|
| Service Status | ECS/ContainerInsights | `RunningTaskCount` | Proactive | Statistic = Average; Period = 60s; DatapointsToAlarm = 5; TreatMissingData = notBreaching | Number of tasks currently in the RUNNING state. Alarm if constantly below the minimal number of resources required for the application. |
| Service Status | ECS/ContainerInsights | `ServiceCount` | Proactive | Statistic = Average; Period = 60s; DatapointsToAlarm = 5; TreatMissingData = notBreaching | Number of services in the cluster. Alarm if constantly below the minimal number of resources required for the application. |
| Service Status | ECS/ContainerInsights | `TaskCount` | Proactive | Statistic = Average; Period = 60s; DatapointsToAlarm = 5; TreatMissingData = notBreaching | Number of tasks running in the cluster. Alarm if `TaskCount` is constantly below `DesiredTaskCount`. |
| Service Status | ECS/ContainerInsights | `DesiredTaskCount` | Proactive | Statistic = Average; Period = 60s; DatapointsToAlarm = 5; TreatMissingData = notBreaching | Desired number of tasks for an ECS service. Alarm if `TaskCount` is constantly below `DesiredTaskCount`. |
| Saturation | ECS/ContainerInsights | `CpuUtilized` | Proactive | Statistic = Average; Period = 60s; DatapointsToAlarm = 5; TreatMissingData = notBreaching | CPU units used by tasks in the service. Compare against `CpuReserved` to detect saturation — alarm when the ratio approaches 100%. |
| Saturation | ECS/ContainerInsights | `CpuReserved` | Proactive | Statistic = Average; Period = 60s; DatapointsToAlarm = 5; TreatMissingData = notBreaching | CPU units reserved by tasks in the service. Use with `CpuUtilized` in a metric-math ratio to measure CPU saturation. |
| Saturation | ECS/ContainerInsights | `MemoryUtilized` | Proactive | Statistic = Average; Period = 60s; DatapointsToAlarm = 5; TreatMissingData = notBreaching | Memory used by tasks in the service. Compare against `MemoryReserved` to detect memory pressure — alarm when the ratio approaches 100%. |
| Saturation | ECS/ContainerInsights | `MemoryReserved` | Proactive | Statistic = Average; Period = 60s; DatapointsToAlarm = 5; TreatMissingData = notBreaching | Memory reserved by tasks in the service. Use with `MemoryUtilized` in a metric-math ratio to measure memory saturation. |
| Saturation | AWS/ECS | `CPUReservation` | Proactive | Statistic = Average; Period = 60s; DatapointsToAlarm = 5; TreatMissingData = notBreaching | Percentage of CPU units reserved by running tasks relative to total registered CPU on EC2 launch-type clusters. Alarm above ~80% to detect capacity exhaustion blocking task placement. |
| Saturation | AWS/ECS | `MemoryReservation` | Proactive | Statistic = Average; Period = 60s; DatapointsToAlarm = 5; TreatMissingData = notBreaching | Percentage of memory reserved by running tasks relative to total registered memory on EC2 launch-type clusters. Alarm above ~80% to detect capacity exhaustion blocking task placement. |
| Reliability | ECS/ContainerInsights | `DeploymentCount` | Reactive | Statistic = Average; Period = 60s; DatapointsToAlarm = 5; TreatMissingData = notBreaching | Number of active deployments for a service. Alarm on anomalies or values above 1 for extended periods to catch stuck or rolled-back deployments. |

##### Additional notes

- **Running vs desired as a composite:** The most actionable incident-detection alarm is a **metric-math comparison of `RunningTaskCount` / `TaskCount` vs `DesiredTaskCount`** (fire when running fewer than desired for N minutes), rather than a static floor that breaks when you scale.
- **OpenTelemetry (OTEL) via the CloudWatch agent:** Instrument the application in each task with the ADOT SDK (sending OTLP to the CloudWatch agent) to export traces + custom metrics to CloudWatch (Application Signals). This gives request-level latency/error SLOs on top of the infra-level task counts here.
- **Fargate vs EC2:** On Fargate there is no host to watch, so task-count and per-task utilization metrics are the primary incident-detection signals. On EC2 launch type, also leverage the `CPUReservation`/`MemoryReservation` alarms above to detect capacity exhaustion.
- **Deployment-failure signals:** Complement the `DeploymentCount` alarm with ECS **service deployment** CloudWatch Events to catch stuck or rolled-back deployments quickly via EventBridge rules.


#### EKS

Recommended CloudWatch alarms for **Amazon EKS** to detect customer-impacting incidents. EKS offers several monitoring paths, so the article presents **four options**. Unless noted, every alarm below uses **Period = 60s, DatapointsToAlarm = 5, TreatMissingData = notBreaching**; only the **Statistic** and **Reactive/Proactive** columns vary.

- **Option 1 — Container Insights (AWS service).** Namespace `ContainerInsights`. Best results with **Container Insights with enhanced observability** (EC2 only; Fargate not supported). Metrics marked *(enhanced)* require enhanced observability.
- **Option 1 Enhanced — Container Insights + Prometheus integration.** Namespace `ContainerInsights/Prometheus`.
- **Option 2 — Prometheus (open-source or AWS Managed).** Control-plane metrics scraped in Prometheus format; ingested to CloudWatch or handled as a 3rd-party APM integrated with incident detection via Webhook/SNS. Namespace N/A (Prometheus).
- **Customer-managed Kubernetes.** Open-source kube-prometheus alerts; 3rd-party APM integrated with incident detection via Webhook/SNS. Namespace N/A (Prometheus).

> General guidelines only — tailor thresholds to your environment.

##### Option 1 — Container Insights (namespace `ContainerInsights`)

| Business Objectives | Metric name | Reactive/Proactive | Statistic | Use case |
|---|---|---|---|---|
| Container Status | `pod_container_status_waiting_reason_crash_loop_back_off` *(enhanced)* | Reactive | Average | Number of containers pending due to a CrashLoopBackOff error (a container repeatedly fails to start). |
| Container Status | `pod_container_status_waiting_reason_create_container_config_error` *(enhanced)* | Reactive | Average | Number of containers pending with reason CreateContainerConfigError (error creating container configuration). |
| Container Status | `pod_container_status_waiting_reason_create_container_error` *(enhanced)* | Reactive | Average | Number of containers pending with reason CreateContainerError (error while creating the container). |
| Container Status | `pod_container_status_waiting_reason_image_pull_error` *(enhanced)* | Reactive | Average | Number of containers pending due to ErrImagePull, ImagePullBackOff, or InvalidImageName (error pulling the container image). |
| Container Status | `pod_container_status_waiting_reason_start_error` *(enhanced)* | Reactive | Average | Number of containers pending with reason StartError (error while starting the container). |
| Container Status | `pod_container_status_terminated` *(enhanced)* | Reactive | Average | Number of containers in the Terminated state. |
| Container Status | `replicas_desired` *(enhanced)* | Proactive | Average | Pods desired for a workload (per workload spec). Alarm when `replicas_ready` is constantly lower than `replicas_desired`. |
| Container Status | `replicas_ready` *(enhanced)* | Proactive | Average | Pods for a workload that reached ready status. Alarm when `replicas_ready` is constantly lower than `replicas_desired`. |
| Cluster Status | `cluster_failed_node_count` | Reactive | Average | Number of failed worker nodes in the cluster (a node with any failing node condition). |
| Pod Status | `pod_status_failed` *(enhanced)* | Reactive | Average | All containers in the pod terminated and at least one terminated with non-zero status or was terminated by the system. |
| Pod Status | `pod_status_unknown` *(enhanced)* | Reactive | Average | Pod status can't be obtained. |
| Pod Status | `pod_status_pending` *(enhanced)* | Reactive | Sum | Pods scheduled but not Running (insufficient capacity, scheduling constraints, etc.). |
| Pod Status | `pod_number_of_container_restarts` | Reactive | Sum | A container is failing and repeatedly restarting — important to capture container failures. |
| Node Status | `node_interface_network_rx_dropped` *(enhanced)* | Reactive | Sum | Packets received and subsequently dropped by a network interface on the node. |
| Node Status | `node_interface_network_tx_dropped` *(enhanced)* | Reactive | Sum | Packets due to be transmitted but dropped by a network interface on the node. |
| API Server Status | `apiserver_request_total_5XX` *(enhanced)* | Reactive | Sum | Requests to the Kubernetes API server responded with a 5XX HTTP response code. |
| API Server Status | `apiserver_request_duration_seconds` *(enhanced)* | Reactive | Average | Response latency for API requests to the Kubernetes API server. |
| API Server Status | `apiserver_longrunning_requests` *(enhanced)* | Reactive | Average | Number of active long-running requests to the Kubernetes API server. |
| API Server Status | `apiserver_admission_webhook_admission_duration_seconds` *(enhanced)* | Reactive | Average | Admission webhook latency (seconds). Admission webhooks are HTTP callbacks that receive admission requests. |
| API Server Status | `apiserver_flowcontrol_rejected_requests_total` *(enhanced)* | Reactive | Average | Helps detect throttling at the API server. |
| API Server Status | `etcd_db_total_size_in_bytes` (v1.25 and earlier) **OR** `apiserver_storage_db_total_size_in_bytes` (v1.26/1.27) **OR** `apiserver_storage_size_bytes` (v1.28) *(enhanced)* | Reactive | Maximum | Tracks ETCD DB size against a threshold (e.g., at 8 GB only read-only API operations are allowed, negatively impacting customer operations). |

##### Option 1 Enhanced — Container Insights + Prometheus (namespace `ContainerInsights/Prometheus`)

| Business Objectives | Metric name | Reactive/Proactive | Statistic | Use case |
|---|---|---|---|---|
| Application Statistics | Highly customized business-level metrics indicating key business operating status or application performance | Proactive | Average or Sum | The CloudWatch agent with Prometheus support auto-collects metrics from services/workloads (App Mesh, NGINX, Memcached, Java/JMX). You can configure it to collect more service metrics and Prometheus metrics from other applications and services. |

##### Option 2 — Prometheus control-plane metrics (namespace N/A — Prometheus)

| Business Objectives | Metric name | Reactive/Proactive | Statistic | Use case |
|---|---|---|---|---|
| API Server Status | `apiserver_admission_controller_admission_duration_seconds` | Proactive | Average | Admission controller latency histogram (seconds), by name, broken out per operation and API resource/type (validate or admit). |
| API Server Status | `apiserver_admission_webhook_admission_duration_seconds` | Proactive | Average | Admission webhook latency histogram (seconds), by name, broken out per operation and API resource/type. |
| API Server Status | `apiserver_longrunning_requests` | Proactive | Average | Gauge of active long-running apiserver requests, broken out by verb, group, version, resource, scope, component. Not all requests tracked this way. |
| API Server Status | `apiserver_authorization_webhook_duration_seconds` | Proactive | Average | Request latency in seconds. |
| API Server Status | `apiserver_clusterip_repair_ip_errors_total` | Reactive | Sum | Errors on clusterips detected by the repair loop, by type: leak, repair, full, outOfRange, duplicate, unknown, invalid. |
| API Server Status | `apiserver_nodeport_repair_port_errors_total` | Reactive | Sum | Errors on ports detected by the repair loop, by type: leak, repair, full, outOfRange, duplicate, unknown. |
| API Server Status | `apiserver_tls_handshake_errors_total` | Reactive | Sum | Requests dropped with a 'TLS handshake error from' error. |
| Cluster Status | `kubernetes_healthchecks_total` | Reactive | Sum | Records the results of all healthchecks. |
| Cluster Status | `kubelet_runtime_operations_errors_total` | Reactive | Sum | Cumulative number of runtime operation errors by operation type. |
| Cluster Status | `kubelet_started_pods_errors_total` | Reactive | Sum | Cumulative number of errors when starting pods. |
| Cluster Status | `node_collector_zone_health` | Reactive | Average | Gauge measuring percentage of healthy nodes per zone. |

##### Customer-managed Kubernetes (namespace N/A — Prometheus / kube-prometheus alerts)

| Business Objectives | Metric / Alert name | Reactive/Proactive | Statistic | Use case |
|---|---|---|---|---|
| Alertmanager Status | `AlertmanagerClusterDown` | Reactive | Average | Half or more of the Alertmanager instances within the same cluster are down. |
| Prometheus Status | `PrometheusNotConnectedToAlertmanagers` | Reactive | Average | Prometheus is not connected to any Alertmanagers. |
| Prometheus Status | `PrometheusBadConfig` | Reactive | Average | Prometheus cannot reload the configuration file due to incorrect content. |
| Kubernetes Status | `KubeAPIDown` | Reactive | Average | Triggered when all Kubernetes API servers have been unreachable by the monitoring system for more than 15 minutes. |
| Kubernetes Status | `KubeClientErrors` | Reactive | Average | Kubernetes API server client is experiencing over 1% error rate in the last 15 minutes. |
| Kubernetes Status | `KubeContainerWaiting` | Reactive | Average | Container in pod is in Waiting state for too long. |
| Kubernetes Status | `KubeControllerManagerDown` | Reactive | Average | KubeControllerManager has disappeared from Prometheus target discovery. |
| Kubernetes Status | `KubePodCrashLooping` | Reactive | Average | Pod is in CrashLoop — the app dies/is unresponsive and Kubernetes tries to restart it automatically. |
| Kubernetes Status | `KubeNodeNotReady` | Reactive | Average | Fired when a Kubernetes node is not in Ready state for a period (can't host new pods) / has been non-ready for more than 15 minutes. |
| Kubernetes Status | `KubeletDown` | Reactive | Average | Triggered when the monitoring system cannot reach any of the cluster's Kubelets for more than 15 minutes. |
| Kubernetes Status | `KubeletTooManyPods` | Reactive | Average | Fires when a node is running >95% of its pod capacity (110 by default). |

##### Additional notes

- **CloudWatch Observability EKS add-on + Container Insights with enhanced observability** is now the recommended default (Option 1). It is delivered as an EKS add-on that deploys the **CloudWatch agent (with an embedded OTEL/OTLP pipeline)** and Fluent Bit, giving cluster→node→pod→container drill-down. Enhanced-observability metrics (marked above) are the most actionable incident-detection signals.
- **OpenTelemetry (OTEL) is now central to EKS observability:** Use the **CloudWatch agent's OTLP endpoint** (deployed by the CloudWatch Observability add-on) to collect application metrics, traces, and logs from your ADOT SDK. Application metrics land in a custom namespace; point incident-detection alarms there. **CloudWatch Application Signals** auto-instruments EKS workloads for golden-signal SLO alarms.
- **Amazon Managed Service for Prometheus (AMP) + Managed Grafana:** Option 2's self-managed Prometheus is largely superseded by **AMP** with **alertmanager**, which can route to SNS for incident detection. Prefer AMP recording/alerting rules over self-hosted Prometheus for reliability.
- **Fargate nodes:** Enhanced observability is EC2-only. For Fargate, rely on Application Signals / OTEL-exported pod metrics (via the CloudWatch agent's OTLP endpoint) and control-plane metrics rather than node-level Container Insights.
- **ETCD size metric name drifts by version:** As shown, the ETCD-size metric changed across 1.25→1.26/1.27→1.28. On current EKS versions (1.29+) confirm the exact metric name (`apiserver_storage_size_bytes`) before wiring the alarm.

##### OpenTelemetry (OTEL) support on EKS

EKS has first-class OpenTelemetry support, and OTEL is the recommended way to collect application and infrastructure telemetry in a vendor-neutral way. The recommended collection paths use the **CloudWatch agent** and **Amazon Managed Service for Prometheus (AMP)** — no self-managed collector required:

- **CloudWatch Observability EKS add-on** (`amazon-cloudwatch-observability`) — deploys the **CloudWatch agent** (with an embedded OTEL/OTLP pipeline) + Fluent Bit. It powers Container Insights with enhanced observability, scrapes **Prometheus** metrics into CloudWatch (as Embedded Metric Format, in a **custom namespace you define**, not `AWS/*`; alarm on them like any CloudWatch metric), and enables **Application Signals** auto-instrumentation (Java, Python, Node.js, .NET) for golden-signal SLO alarms.
- **CloudWatch agent OTLP endpoint** — point your ADOT SDK at the CloudWatch agent's OTLP endpoint to send application metrics and traces. Metrics land in a custom namespace you define; view traces in Application Signals / X-Ray.
- **Amazon Managed Service for Prometheus (AMP)** — for teams standardizing on PromQL, use AMP's **fully-managed (agentless) scrapers** to discover and scrape your cluster, control-plane, and workload `/metrics` endpoints into AMP. Query with PromQL and alert via the AMP alert manager → SNS — without running or operating your own collector.

**Where alarms live:** metrics sent to CloudWatch (EMF/OTLP) are alarmed with CloudWatch Alarms (see the Container Insights tables above); metrics sent to AMP are alarmed with **AMP recording/alerting rules** evaluated in PromQL and routed to SNS. Prefer AMP + Managed Grafana over self-managed Prometheus for reliability.

###### Example PromQL queries

The queries below work against metrics collected into AMP by its managed (agentless) scraper — or into self-managed Prometheus. They mirror the alarm intents in the tables above. Requires the standard exporters — `kube-state-metrics`, `node-exporter`, cAdvisor (kubelet), and the EKS control-plane `/metrics` endpoint.

**Control plane / API server**

```promql
# API server 5xx error rate (requests/sec)
sum(rate(apiserver_request_total{code=~"5.."}[5m]))

# API server error ratio (5xx as a fraction of all requests) — alert above ~0.01
sum(rate(apiserver_request_total{code=~"5.."}[5m]))
  / sum(rate(apiserver_request_total[5m]))

# API server p99 request latency (seconds), excluding long-poll WATCH verbs
histogram_quantile(0.99,
  sum(rate(apiserver_request_duration_seconds_bucket{verb!~"WATCH|CONNECT"}[5m])) by (le))

# etcd database size as a fraction of its backend quota — alert above ~0.8
max(etcd_db_total_size_in_bytes) / max(etcd_server_quota_backend_bytes)

# API Priority & Fairness: rejected (throttled) requests per second
sum(rate(apiserver_flowcontrol_rejected_requests_total[5m]))
```

**Nodes**

```promql
# Count of nodes NOT in Ready state — alert when > 0
count(kube_node_status_condition{condition="Ready",status="true"} == 0)

# Per-node CPU utilization (0-1)
1 - avg by (instance) (rate(node_cpu_seconds_total{mode="idle"}[5m]))

# Per-node available memory ratio — alert when below ~0.1
node_memory_MemAvailable_bytes / node_memory_MemTotal_bytes

# Root filesystem usage ratio — alert above ~0.85
1 - (node_filesystem_avail_bytes{mountpoint="/"}
     / node_filesystem_size_bytes{mountpoint="/"})

# Dropped packets per second per node (rx + tx)
sum by (instance) (
  rate(node_network_receive_drop_total[5m])
  + rate(node_network_transmit_drop_total[5m]))
```

**Workloads / pods**

```promql
# Pods not in Running/Succeeded state, by namespace
sum by (namespace) (kube_pod_status_phase{phase=~"Pending|Unknown|Failed"})

# Containers in CrashLoopBackOff, by pod
sum by (namespace, pod) (
  kube_pod_container_status_waiting_reason{reason="CrashLoopBackOff"})

# Container restarts in the last 15 minutes, by pod
sum by (namespace, pod) (
  increase(kube_pod_container_status_restarts_total[15m]))

# Deployments where ready replicas are fewer than desired — alert when > 0
sum by (namespace, deployment) (
  kube_deployment_spec_replicas - kube_deployment_status_replicas_available) > 0

# Pod CPU throttling ratio — high values mean CPU limits are too low
sum by (namespace, pod) (rate(container_cpu_cfs_throttled_periods_total[5m]))
  / sum by (namespace, pod) (rate(container_cpu_cfs_periods_total[5m]))

# Pod memory working set as a fraction of its limit — alert near 1.0 (OOM risk)
sum by (namespace, pod) (container_memory_working_set_bytes)
  / sum by (namespace, pod) (
      kube_pod_container_resource_limits{resource="memory"})
```

:::tip
In AMP, wrap these expressions in **alerting rules** and route firing alerts to Amazon SNS via the AMP alert manager, or evaluate them as **recording rules** for cheaper, faster dashboards in Amazon Managed Grafana. Metric and label names depend on your exporter versions — confirm names in your environment (for example, some kubelet cAdvisor metrics carry a `container=""` empty-label series you may need to filter out with `{container!=""}`).
:::


#### Lambda

AWS Lambda is a serverless compute service that runs your code in response to events and automatically manages the underlying compute resources. General guidelines only — tailor thresholds to your environment.

| Business Objectives | AWS Service | Namespace | Metric name | Reactive/Proactive | Recommended alarm configuration | Use case |
|---|---|---|---|---|---|---|
| Reliability | Lambda | `AWS/Lambda` | (m1/m2)*100 m1 = Errors m2 = Invocations | Reactive | Statistic = Average; Period = 60 seconds; DatapointsToAlarm = 5; TreatMissingData = notBreaching | This metric monitors the ratio of errors to successful Lambda invocations. Lambda function errors encompass exceptions thrown by the user code as well as exceptions thrown by the Lambda runtime environment for issues including timeouts and configuration problems. As a relative metric, this measure adapts well to fluctuating and unpredictable workloads. |
| Reliability, latency | Lambda | `AWS/Lambda` | `Throttles` | Reactive | Statistic = Average; Period = 60 seconds; DatapointsToAlarm = 5; TreatMissingData = notBreaching | The CloudWatch metric monitors the invocation request throughput and measures when throttling occurs. When the Lambda function is operating at maximum concurrency across all provisioned instances, additional incoming requests will be rejected with a TooManyRequestsException once resource limits are reached. Throttled requests, along with other invocation errors, are not counted towards the Invocations or Errors metrics. |
| Reliability | Lambda | `AWS/Lambda` | `DeadLetterErrors` | Reactive | Statistic = Sum; Period = 60 seconds; DatapointsToAlarm = 5; TreatMissingData = notBreaching | This metric helps in monitoring and alerting when messages fail to reach the DLQ. It is critical for identifying issues with Lambda functions that aren't handling events as expected, particularly in cases where the function repeatedly fails to process the same event. |
| Reliability | Lambda | `AWS/Lambda` | `ConcurrentExecutions` | Proactive | Statistic = Average; Period = 60 seconds; DatapointsToAlarm = 5; TreatMissingData = notBreaching | This metric tracks the number of function instances that run concurrently. By monitoring this, you can understand your usage patterns and make informed decisions about scaling settings or when to request higher concurrency limits if your functions are consistently hitting the configured limits. |
| Reliability | Lambda | `LambdaInsights` | `memory_utilization` | Proactive | Statistic = Average; Period = 60 seconds; DatapointsToAlarm = 5; TreatMissingData = notBreaching | Percentage of allocated memory in use. Requires the Lambda Insights layer. Alarm when approaching 100% to catch OOM risks proactively before function failures occur. |
| Reliability | Lambda | `AWS/Lambda` | `RecursiveInvocationsDropped` | Reactive | Statistic = Sum; Period = 60 seconds; DatapointsToAlarm = 5; TreatMissingData = notBreaching | Counts invocations stopped by Lambda's recursive loop detection (Lambda ↔ SQS/SNS chains). Any non-zero value indicates a runaway recursive loop was halted — investigate the triggering function immediately. |
| Reliability, latency | Lambda | `AWS/Lambda` | `ProvisionedConcurrencySpilloverInvocations` | Proactive | Statistic = Sum; Period = 60 seconds; DatapointsToAlarm = 5; TreatMissingData = notBreaching | Number of invocations that exceeded provisioned concurrency and fell back to on-demand scaling with potential cold starts. Alarm when consistently non-zero to identify when provisioned capacity is insufficient. |

##### Additional notes

- **OpenTelemetry (OTEL) for Lambda:** Lambda can't run the CloudWatch agent, so instrument functions with the **ADOT Lambda layer** (OTEL SDK distribution) or **CloudWatch Application Signals for Lambda** (OTEL-based auto-instrumentation) to export OTLP metrics/traces to CloudWatch. Custom OTEL metrics land in a namespace you define (not `AWS/Lambda`), enabling correlation of business metrics alongside native Lambda metrics.
- **CloudWatch Application Signals:** If your Lambda functions serve as application endpoints, Application Signals provides automatic SLO burn-rate alarms in the `ApplicationSignals` namespace — useful for tracking latency and availability SLOs without manually defining threshold alarms.
- **Anomaly detection bands:** Consider using CloudWatch anomaly detection on `ConcurrentExecutions` and `Duration` rather than static thresholds — this adapts to time-of-day traffic patterns and avoids noisy alerts during expected peaks.
- **Lambda Insights enablement:** Lambda Insights is enabled via a Lambda layer and publishes enhanced metrics (CPU time, init duration, memory utilization, etc.) to the `LambdaInsights` namespace. The layer must be added to each function you want to monitor.


### Databases & Analytics

#### RDS

Amazon RDS is a managed relational database service supporting multiple engines (MySQL, PostgreSQL, MariaDB, Oracle, SQL Server, Aurora) that handles provisioning, patching, backups, and failover. General guidelines only — tailor thresholds to your environment.

| Business Objectives | AWS Service | Namespace | Metric name | Reactive/Proactive | Recommended alarm configuration | Use case |
|---|---|---|---|---|---|---|
| Reliability, Latency | Amazon RDS | `AWS/RDS` | `DiskQueueDepth` | Reactive | Statistic = Average; Period = 60 seconds; DatapointsToAlarm = 5; TreatMissingData = notBreaching | Monitoring the DiskQueueDepth metric is vital for identifying performance bottlenecks on RDS instances. This metric measures the number of outstanding IOs (read/write requests) waiting to be processed at the storage layer, providing insight into how rapidly the database can handle incoming queries and transactions. Tracking DiskQueueDepth over time can reveal when RDS instance compute or storage resources are saturated, signaling a need to scale up instance capacity to prevent slowdowns. |
| Reliability | Amazon RDS | `AWS/RDS` | `FreeStorageSpace` | Proactive | Statistic = Average; Period = 60 seconds; DatapointsToAlarm = 5; TreatMissingData = Breaching | Proactively monitoring available storage capacity on the RDS instance is critical for preventing potential database outages resulting from inadequate disk space. Setting up alerts around utilization thresholds enables a proactive stance to avoid reaching capacity limits. |
| Customer experience, Reliability | Amazon RDS | `AWS/RDS` | `ReplicaLag` | Proactive | Statistic = Average; Period = 60 seconds; DatapointsToAlarm = 5; TreatMissingData = Breaching | Increased replication lag times detected on RDS read replicas could lead to excessively outdated data and negatively impact application performance. Further investigation into the root causes of elevated lag is recommended in order to assess replica data freshness and its suitability for supporting application workloads, which rely on near real-time read consistency. Proactive monitoring of replication lag as a keystone metric can enable early detection and remediation of degradation, optimizing replica availability and safeguarding end user experience. |
| Customer experience, Latency | Amazon RDS | `AWS/RDS` | `ReadLatency` | Proactive | Statistic = Average; Period = 60 seconds; DatapointsToAlarm = 5; TreatMissingData = notBreaching | ReadLatency measures the average amount of time (in milliseconds) that it takes to read data from the database storage. High read latency can indicate performance issues, such as slow queries, inefficient indexing, or resource contention, which can impact the overall performance and responsiveness of your applications. |
| Customer experience, Latency | Amazon RDS | `AWS/RDS` | `WriteLatency` | Proactive | Statistic = Average; Period = 60 seconds; DatapointsToAlarm = 5; TreatMissingData = notBreaching | WriteLatency measures the average amount of time (in milliseconds) that it takes to write data to the database storage. High write latency can indicate performance issues with write operations, such as slow inserts, updates, or inefficient indexing, which can impact the overall performance of your applications. It can indicate that your database instance needs more resources (CPU, memory, or storage) to handle the write workload. |

##### CloudWatch Database Insights

[Amazon CloudWatch Database Insights](/solutions/rds-aurora-monitoring/) is the unified, database-focused observability experience for Amazon RDS and Aurora. It builds on Performance Insights and Enhanced Monitoring and centers on **DB Load** — the average number of active sessions (AAS) in the database — which you can slice by SQL, wait event, host, user, and application to find the root cause of a performance incident. It is the successor to the standalone Performance Insights console experience.

For incident detection, Database Insights adds signals that the base `AWS/RDS` infrastructure metrics above do not capture — most importantly **database saturation relative to compute capacity** and **where that load is waiting** (CPU vs. I/O vs. locks).

###### Recommendation: turn it on

- **Standard mode is on by default at no additional cost** — confirm it is active (CloudWatch → Database Insights) and use it for DB Load analysis with 7-day retention.
- **Enable Advanced mode on production databases.** Advanced mode adds fleet health views, 15-month retention, OS-process analysis, lock and execution-plan analysis, slow-SQL analysis, Application Signals "calling services" correlation, and — key for alarming — **auto-import of Performance Insights counter metrics into CloudWatch** so you can alarm on engine-level counters. Advanced mode requires Performance Insights with a 15-month (≥ 465-day) retention period and is billed per vCPU-hour (provisioned) or ACU-hour (serverless); Enhanced Monitoring and CloudWatch Logs ingestion are billed separately.
- Enabling Advanced mode on an existing instance **does not cause downtime**. For Aurora/Multi-AZ clusters it applies to the whole cluster (every instance must share the same Performance Insights and Enhanced Monitoring settings).

```bash
# Enable Advanced mode of Database Insights on an existing RDS instance (no downtime)
aws rds modify-db-instance \
    --db-instance-identifier <your-db-instance> \
    --database-insights-mode advanced \
    --enable-performance-insights \
    --performance-insights-retention-period 465
```

See [RDS & Aurora Monitoring](/solutions/rds-aurora-monitoring/) for Database Insights setup, and the [AWS documentation](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/CHAP_Monitoring.html) for modes, limitations, and fleet or cross-account configuration.

###### Recommended Database Insights metrics to alarm on

These are published to the `AWS/RDS` namespace once Performance Insights / Database Insights is enabled. The `DBLoad*` metrics are expressed in Average Active Sessions (AAS); the actionable threshold is **relative to the instance's vCPU count**.

| Business Objectives | Namespace | Metric name | Reactive/Proactive | Recommended alarm configuration | Use case |
|---|---|---|---|---|---|
| Performance, Reliability | `AWS/RDS` | `DBLoad` | Proactive | Statistic = Average; Period = 60s; DatapointsToAlarm = 5; Threshold ≈ number of vCPUs on the instance (or metric math `DBLoad / vCPUs ≥ 1`); TreatMissingData = notBreaching | The core Database Insights signal — average active sessions. Sustained `DBLoad` at or above the instance vCPU count means sessions are queuing and the database is overloaded; alarm before customers notice. |
| Performance | `AWS/RDS` | `DBLoadCPU` | Proactive | Statistic = Average; Period = 60s; DatapointsToAlarm = 5; TreatMissingData = notBreaching | Portion of DB Load from sessions actively running on CPU. `DBLoadCPU` trending toward the vCPU count indicates CPU saturation (candidate for scaling up or query tuning). |
| Performance, Latency | `AWS/RDS` | `DBLoadNonCPU` | Proactive | Statistic = Average; Period = 60s; DatapointsToAlarm = 5; TreatMissingData = notBreaching | Portion of DB Load waiting on non-CPU resources (I/O, locks, buffer). A rising `DBLoadNonCPU` points to I/O bottlenecks or lock contention — drill into the wait-event and (Aurora/RDS PostgreSQL) lock-analysis views in Database Insights. |

> **Advanced mode only:** enabling Advanced mode auto-imports Performance Insights **counter metrics** (engine `db.*` counters such as deadlocks, buffer cache hit ratio, and transaction-log usage, plus OS `os.*` metrics) into CloudWatch, letting you build alarms on engine-internal counters that were previously visible only in the Performance Insights console. Slow-SQL analysis additionally requires database log export to CloudWatch Logs.

##### Additional notes

- **OpenTelemetry (OTEL) via the CloudWatch agent:** Use the CloudWatch agent's OTLP endpoint to emit application-level database metrics (connection pool utilization, query durations by type) into a custom namespace. These complement `AWS/RDS` native metrics by providing application-perspective latency breakdowns. OTEL metrics land in a custom namespace you define, not `AWS/RDS`.
- **CloudWatch Application Signals:** If your application connects to RDS as a backend dependency, Application Signals can auto-discover the database dependency and provide SLO burn-rate alarms in the `ApplicationSignals` namespace — useful for tracking end-to-end latency SLOs that include database response time.
- **Anomaly detection bands:** Consider using CloudWatch anomaly detection on `ReadLatency`, `WriteLatency`, and `DiskQueueDepth` instead of static thresholds. Database workloads often exhibit strong time-of-day and day-of-week patterns that anomaly detection handles better than fixed thresholds.
- **CloudWatch Database Insights (unified successor to the PI console):** Database Insights consolidates Performance Insights, Enhanced Monitoring, CloudWatch metrics/logs, and RDS events into one experience and is now the recommended way to monitor RDS/Aurora database health. Enhanced Monitoring still provides OS-level metrics (per-process CPU, memory breakdown, filesystem utilization) at up to 1-second granularity, surfaced in the Database Insights OS-process view. Prefer alarming on `DBLoad` relative to vCPU count as the primary saturation indicator (see the [CloudWatch Database Insights](#cloudwatch-database-insights) section above).
- **Aurora-specific metrics:** If using Aurora, consider monitoring `AuroraReplicaLagMaximum`, `BufferCacheHitRatio`, `DatabaseConnections`, and `ServerlessDatabaseCapacity` (for Aurora Serverless v2) which provide more granular scaling and performance signals than the base RDS metrics.
- **Storage Auto Scaling awareness:** With RDS Storage Auto Scaling enabled, `FreeStorageSpace` alarms should account for the maximum storage threshold configured — alarm when free space is low relative to the max allocation rather than just current allocation to avoid false positives during auto-scaling events.


#### Aurora

Recommended CloudWatch alarms for **Amazon Aurora** to detect customer-impacting incidents. AWS also publishes [recommended alarms for RDS/Aurora](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Best_Practice_Recommended_Alarms_AWS_Services.html#RDS). All alarms use **Period = 60s, DatapointsToAlarm = 5**; `TreatMissingData` varies (`missing` vs `breaching`) as noted.

> General guidelines only — tailor thresholds to your environment.

| Business Objectives | Namespace | Metric name | Reactive/Proactive | Statistic | TreatMissingData | Use case |
|---|---|---|---|---|---|---|
| Availability | AWS/RDS | `DatabaseConnections` | Reactive | Sum | missing | Track active DB sessions to ensure connection limits aren't reached. Applications unable to establish new database connections. |
| Data Freshness | AWS/RDS | `AuroraReplicaLag` | Reactive | Max | breaching | Track replication delay between primary and replica instances for data-consistency monitoring. |
| Reliability, Latency | AWS/RDS | `ReplicaLag` | Reactive | Average | breaching | Measure replication latency for read replicas to ensure data synchronization. |
| Customer experience, Performance | AWS/RDS | `ReadIOPS`, `WriteIOPS` | Reactive | Average | missing | Disk I/O operations per second. Sustained high values indicate bottlenecks (insufficient buffer cache, inefficient queries, heavy writes); sudden spikes reveal unusual application behavior/query patterns that can increase latency and degrade performance. |
| Customer experience, Performance | AWS/RDS | `ReadLatency`, `WriteLatency` | Reactive | Average | missing | Average time for read/write disk I/O. Increased latency indicates storage performance issues, resource contention, or inefficient queries — directly impacting response times and risking timeout errors. |
| Customer experience, Performance | AWS/RDS | `DBLoad`, `DBLoadCPU`, `DBLoadNonCPU` | Proactive | Average | missing | Track response times for specific SQL operations to identify slow queries. |
| Customer experience, Performance | AWS/RDS | `DMLLatency`, `SelectLatency`, `InsertLatency`, `DeleteLatency`, `UpdateLatency` | Proactive | Average | missing | Track response times for specific SQL operations. Crucial for monitoring specific SQL operation performance — higher latency can pinpoint problematic query types. |
| Performance | AWS/RDS | `CPUUtilization` | Proactive | Average | breaching | Monitor DB instance processing-power usage to identify bottlenecks. High utilization → slower application response times and timeouts. |
| Performance | AWS/RDS | `FreeableMemory` | Proactive | Average | breaching | Available RAM on the DB instance. Low values trigger excessive disk I/O (reads from disk instead of memory cache), increasing latency and risking instability. |
| Customer experience, Performance | AWS/RDS | `FreeLocalStorage` | Proactive | Average | breaching | Affects temp tables, sort operations, and transaction logs stored in instance-local storage. When exhausted, causes query failures and performance degradation even if the Aurora cluster volume has space. |
| Customer experience, Performance | AWS/RDS | `VolumeBytesUsed` | Proactive | Average | breaching | Aurora cluster volumes auto-grow (to version-specific limits) and shrink. If less space available, the database is unable to write new data. |
| Customer experience, Performance | AWS/RDS | `BufferCacheHitRatio` | Proactive | Average | missing | Evaluate memory efficiency by monitoring how often data is found in buffer cache vs disk reads. |
| Customer experience, Performance | AWS/RDS | `RollbackSegmentHistoryListLength` | Reactive | Average | missing | Length of undo records needed for transaction rollbacks. High value suggests long-running transactions/large backlogs that can impact performance, consume storage, and risk rollback failures at peak. |
| Performance, Availability | AWS/RDS | `ServerlessDatabaseCapacity` | Proactive | Average | missing | Current ACU usage for Aurora Serverless v2 clusters. Alarm when approaching max ACU allocation to detect scaling ceilings before throttling occurs. |
| Performance, Availability | AWS/RDS | `ACUUtilization` | Proactive | Average | missing | Percentage of provisioned ACU capacity in use for Aurora Serverless v2. High utilization signals the cluster is nearing its scaling ceiling. |
| Data Freshness, Reliability | AWS/RDS | `AuroraGlobalDBReplicationLag` | Reactive | Max | breaching | Cross-region replication delay for Aurora Global Database. Rising lag threatens RPO/RTO objectives for disaster recovery. |
| Data Freshness, Reliability | AWS/RDS | `AuroraGlobalDBRPOLag` | Reactive | Max | breaching | Estimated RPO gap (data at risk of loss) for Aurora Global Database secondary regions. Alarm to ensure DR objectives remain achievable. |

##### CloudWatch Database Insights

[Amazon CloudWatch Database Insights](/solutions/rds-aurora-monitoring/) is the unified, database-focused observability experience for Amazon Aurora and RDS. It builds on Performance Insights and Enhanced Monitoring and centers on **DB Load** — the average number of active sessions (AAS) in the database — sliced by SQL, wait event, host, user, and application. For Aurora it adds cluster-wide fleet health views and, on Aurora PostgreSQL, **lock analysis** (blocking-session trees) and **execution-plan analysis** to catch plan regressions.

For incident detection, Database Insights surfaces the two signals the base `AWS/RDS` metrics above do not: **database saturation relative to compute capacity** (`DBLoad` vs. vCPUs, or ACUs for Serverless v2) and **where load is waiting** (CPU vs. I/O vs. lock contention).

###### Recommendation: turn it on

- **Standard mode is on by default at no additional cost** — confirm it is active (CloudWatch → Database Insights) for DB Load analysis with 7-day retention.
- **Enable Advanced mode on production clusters.** Advanced mode adds cross-account/cross-region fleet health views, 15-month retention, OS-process analysis, **lock analysis and execution-plan analysis (Aurora PostgreSQL)**, slow-SQL analysis, Application Signals "calling services" correlation, and **auto-import of Performance Insights counter metrics into CloudWatch** for engine-level alarming. It requires Performance Insights with a 15-month (≥ 465-day) retention period and is billed per vCPU-hour (provisioned) or **ACU-hour (Aurora Serverless v2)**; Enhanced Monitoring and CloudWatch Logs are billed separately.
- Enabling Advanced mode **does not cause downtime**. For Aurora it is set **at the cluster level** — RDS enables Database Insights on every instance in the cluster, and all instances must share the same Performance Insights and Enhanced Monitoring settings.

```bash
# Enable Advanced mode of Database Insights on an existing Aurora cluster (no downtime)
aws rds modify-db-cluster \
    --db-cluster-identifier <your-aurora-cluster> \
    --database-insights-mode advanced \
    --enable-performance-insights \
    --performance-insights-retention-period 465
```

See [RDS & Aurora Monitoring](/solutions/rds-aurora-monitoring/) for Database Insights setup, and the [AWS documentation](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/CHAP_Monitoring.html) for modes, Aurora engine support, limitations, and fleet or cross-account configuration.

###### Recommended Database Insights metrics to alarm on

Published to the `AWS/RDS` namespace once Performance Insights / Database Insights is enabled. The `DBLoad*` metrics are in Average Active Sessions (AAS); the actionable threshold is **relative to the instance's vCPU count** (or provisioned ACUs for Serverless v2).

| Business Objectives | Namespace | Metric name | Reactive/Proactive | Recommended alarm configuration | Use case |
|---|---|---|---|---|---|
| Performance, Reliability | `AWS/RDS` | `DBLoad` | Proactive | Statistic = Average; Period = 60s; DatapointsToAlarm = 5; Threshold ≈ number of vCPUs (or metric math `DBLoad / vCPUs ≥ 1`; for Serverless v2 compare against max ACUs); TreatMissingData = notBreaching | The core Database Insights signal — average active sessions. Sustained `DBLoad` at or above the vCPU/ACU capacity means sessions are queuing and the database is overloaded. |
| Performance | `AWS/RDS` | `DBLoadCPU` | Proactive | Statistic = Average; Period = 60s; DatapointsToAlarm = 5; TreatMissingData = notBreaching | Portion of DB Load from sessions running on CPU. Trending toward the vCPU/ACU count indicates CPU saturation (scale up or tune queries). |
| Performance, Latency | `AWS/RDS` | `DBLoadNonCPU` | Proactive | Statistic = Average; Period = 60s; DatapointsToAlarm = 5; TreatMissingData = notBreaching | Portion of DB Load waiting on non-CPU resources (I/O, buffer, **locks**). A rising `DBLoadNonCPU` on Aurora PostgreSQL points to I/O or lock contention — drill into the wait-event and lock-analysis views in Database Insights. |

> **Advanced mode only:** enabling Advanced mode auto-imports Performance Insights **counter metrics** (engine `db.*` counters and OS `os.*` metrics) into CloudWatch for alarming on engine internals. Lock/execution-plan analysis requires Aurora PostgreSQL (plans need `aurora_compute_plan_id = on`); slow-SQL analysis requires database log export to CloudWatch Logs.

##### Additional notes

- **Aurora Serverless v2 & I/O-Optimized:** For **Serverless v2**, host `CPUUtilization`/`FreeableMemory` are less meaningful than `ServerlessDatabaseCapacity` and `ACUUtilization` (now in the table above). On **Aurora I/O-Optimized** clusters, `ReadIOPS`/`WriteIOPS` cost/behavior differs; focus on latency and `DBLoad`.
- **CloudWatch Database Insights + `DBLoad` is the modern golden signal:** `DBLoad` (average active sessions) is the most actionable proactive DB-health metric; alarm on `DBLoad` vs vCPU/ACU count and use [CloudWatch Database Insights](#cloudwatch-database-insights) (the unified successor to the Performance Insights console) to find the top SQL, wait events, and — on Aurora PostgreSQL — blocking locks and plan regressions.
- **Blue/Green & failover:** Alarm on `FailoverState`/writer-role changes and Blue/Green switchover events for faster incident-detection awareness of topology changes.
- **OpenTelemetry (OTEL) via the CloudWatch agent:** Aurora metrics are native `AWS/RDS`. Instrument the application's DB client with the ADOT SDK (sending OTLP to the CloudWatch agent) to correlate `SelectLatency`/`DBLoad` spikes with application spans and connection-pool exhaustion.


#### DynamoDB & DAX

Recommended CloudWatch alarms for **Amazon DynamoDB** and **DynamoDB Accelerator (DAX)** to detect customer-impacting incidents. AWS also publishes [recommended alarms for DynamoDB](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Best_Practice_Recommended_Alarms_AWS_Services.html#DynamoDB).

> General guidelines only — tailor thresholds to your environment.

| Business Objectives | Namespace | Metric name | Reactive/Proactive | Recommended alarm configuration | Use case |
|---|---|---|---|---|---|
| Customer Experience, Reliability | AWS/DynamoDB | `SystemErrors` | Reactive | Statistic = Sum; Period = 60s; DatapointsToAlarm = 5; TreatMissingData = notBreaching | HTTP 500 responses from DynamoDB or DynamoDB Streams during the time range. A 500 typically signifies an internal server error; analyzing occurrences can reveal opportunities to improve system stability and request handling. |
| Reliability, Latency | AWS/DynamoDB | `ReadThrottleEvents` | Reactive | Statistic = Average; Period = 60s; DatapointsToAlarm = 5; TreatMissingData = notBreaching | Indicates requests exceeding provisioned read capacity for a table or GSI. Exceeding the threshold can signify under-provisioning for the workload or an abnormal spike in client requests. Scaling capacity / optimizing patterns reduces throttling; continued throttling can increase latency or user-facing errors. |
| Reliability, Latency | AWS/DynamoDB | `WriteThrottleEvents` | Reactive | Statistic = Average; Period = 60s; DatapointsToAlarm = 5; TreatMissingData = notBreaching | Indicates requests exceeding provisioned write capacity for a table or GSI. Signifies under-provisioning for traffic/write patterns. Remediate by scaling write capacity or optimizing patterns; investigate abnormal client-side surges. Proactive monitoring avoids throttling errors and degraded performance. |
| Reliability, Latency | AWS/DynamoDB | `SuccessfulRequestLatency` | Reactive | Statistic = Average; Period = 60s; DatapointsToAlarm = 5; TreatMissingData = notBreaching | Latency of successful requests to DynamoDB/DynamoDB Streams. High latency can indicate inadequate provisioned throughput, inefficient queries, or application-level problems to be addressed. |
| Reliability, Latency | AWS/DynamoDB | `ReplicationLatency` | Reactive | Statistic = Average; Period = 60s; DatapointsToAlarm = 5; TreatMissingData = notBreaching | (Global tables) Elapsed time between an updated item appearing in the source-replica stream and appearing in another replica. High latency can indicate network congestion, cross-region connectivity problems, or excessive write/update workloads causing replication delays. |
| Customer Experience, Reliability | AWS/DAX | `FaultRequestCount` | Reactive | Statistic = Sum; Period = 60s; DatapointsToAlarm = 5; TreatMissingData = notBreaching | Requests that resulted in an HTTP 500 (server error) reported by the node or cluster. A non-zero value typically indicates a potential issue with the DAX cluster's health/operation. |
| Customer Experience, Reliability | AWS/DAX | `ErrorRequestCount` | Reactive | Statistic = Sum; Period = 60s; DatapointsToAlarm = 5; TreatMissingData = notBreaching | Requests that resulted in an HTTP 400 (client error), including throttled requests. A high count can indicate application-interaction issues, misconfigured permissions, or problems within the DAX cluster. |
| Customer Experience, Reliability | AWS/DAX | `FailedRequestCount` | Reactive | Statistic = Sum; Period = 60s; DatapointsToAlarm = 5; TreatMissingData = notBreaching | Requests that resulted in an error reported by the node or cluster. A high count can indicate application logic issues, misconfigured permissions, or problems with the DynamoDB table or service. |
| Reliability, Latency | AWS/DAX | `ThrottledRequestCount` | Reactive | Statistic = Sum; Period = 60s; DatapointsToAlarm = 5; TreatMissingData = notBreaching | Requests throttled by the node or cluster due to reaching provisioned throughput limits. A high count can indicate workload exceeded provisioned capacity, potentially degrading performance or causing interruptions. |
| Customer Experience, Reliability | AWS/DynamoDB | `ThrottledRequests` | Reactive | Statistic = Sum; Period = 60s; DatapointsToAlarm = 5; TreatMissingData = notBreaching | Total count of requests throttled by DynamoDB. Provides a request-level view of throttling across all operations — useful for on-demand and provisioned modes alike. |
| Reliability | AWS/DynamoDB | `AccountMaxTableLevelReads` | Proactive | Statistic = Maximum; Period = 60s; DatapointsToAlarm = 5; TreatMissingData = notBreaching | Percentage of table-level read throughput limit consumed. Alarm to catch account-level throttling that individual table metrics do not surface. |
| Reliability | AWS/DynamoDB | `AccountMaxTableLevelWrites` | Proactive | Statistic = Maximum; Period = 60s; DatapointsToAlarm = 5; TreatMissingData = notBreaching | Percentage of table-level write throughput limit consumed. Alarm to catch account-level throttling that individual table metrics do not surface. |
| Reliability | AWS/DynamoDB | `AccountProvisionedReadCapacityUtilization` | Proactive | Statistic = Maximum; Period = 60s; DatapointsToAlarm = 5; TreatMissingData = notBreaching | Percentage of account-level provisioned read capacity consumed. Alarm to detect approaching account-wide provisioned capacity limits. |
| Reliability | AWS/DynamoDB | `OnlineIndexThrottleEvents` | Reactive | Statistic = Sum; Period = 60s; DatapointsToAlarm = 5; TreatMissingData = notBreaching | Throttle events during GSI backfill. High counts indicate the index build is competing with production traffic for capacity. |

##### Additional notes

- **On-demand capacity changes the throttling story:** Many tables now run in **on-demand** mode where throttling is governed by table-level per-second limits and warm-throughput settings rather than provisioned RCU/WCU. On on-demand tables, alarm on `ThrottledRequests`/`ReadThrottleEvents`/`WriteThrottleEvents` plus `AccountMaxTableLevelReads/Writes` and `OnlineIndexThrottleEvents` (now in the table above) rather than assuming a provisioned ceiling.
- **`ThrottledRequests` vs `*ThrottleEvents`:** `ThrottledRequests` (Sum) gives a request-level view; `ReadThrottleEvents`/`WriteThrottleEvents` count throttles per event. Use a ratio against `ConsumedReadCapacityUnits`/consumed writes for dynamic thresholds.
- **OpenTelemetry (OTEL) via the CloudWatch agent:** The `AWS/DynamoDB`/`AWS/DAX` metrics remain native. Instrument the application's DynamoDB SDK calls with the ADOT SDK (sending OTLP to the CloudWatch agent) to correlate `SuccessfulRequestLatency` spikes with client-side spans, retries, and hot-partition patterns in CloudWatch.
- **Contributor Insights:** Enable **CloudWatch Contributor Insights for DynamoDB** to identify hot keys/partitions behind throttling — a far more actionable incident-detection signal than the aggregate throttle count.


#### ElastiCache

Recommended CloudWatch alarms for **Amazon ElastiCache** to detect customer-impacting incidents. AWS also publishes [recommended alarms for ElastiCache](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Best_Practice_Recommended_Alarms_AWS_Services.html#ElastiCache).

> General guidelines only — tailor thresholds to your environment.

| Business Objectives | AWS Service | Namespace | Metric name | Reactive/Proactive | Recommended alarm configuration | Use case |
|---|---|---|---|---|---|---|
| Reliability | ElastiCache | AWS/ElastiCache | `FreeableMemory` | Proactive | Statistic = Sum; Period = 60s; DatapointsToAlarm = 5; TreatMissingData = notBreaching | Helps monitor low freeable memory, which can mean a spike in database connections or that the instance is under high memory pressure. |
| Reliability | ElastiCache | AWS/ElastiCache | `DatabaseMemoryUsagePercentage` | Proactive | Statistic = Sum; Period = 60s; DatapointsToAlarm = 5; TreatMissingData = notBreaching | Percentage of memory utilization for the cluster. Applicable to Redis OSS only (not Memcached). |
| Reliability | ElastiCache | AWS/ElastiCache | `CurrConnections` | Proactive | Statistic = Max; Period = 60s; DatapointsToAlarm = 5; TreatMissingData = notBreaching | Number of client connections, excluding connections from read replicas. Applicable to Redis OSS only (not Memcached). |
| Reliability | ElastiCache | AWS/ElastiCache | `EngineCPUUtilization` | Proactive | Statistic = Average; Period = 60s; DatapointsToAlarm = 5; TreatMissingData = notBreaching | CPU utilization for the Redis engine thread. Redis is single-threaded — best practice to monitor `EngineCPUUtilization` for nodes with four or more vCPUs. |
| Reliability | ElastiCache | AWS/ElastiCache | `CPUUtilization` | Proactive | Statistic = Average; Period = 60s; DatapointsToAlarm = 5; TreatMissingData = notBreaching | CPU utilization percentage for the host. For smaller nodes with two or fewer vCPUs, use `CPUUtilization` to monitor the cluster workload. |
| Reliability, Performance | ElastiCache | AWS/ElastiCache | `Evictions` | Reactive | Statistic = Sum; Period = 60s; DatapointsToAlarm = 5; TreatMissingData = notBreaching | Number of non-expired items evicted due to memory pressure. Rising evictions indicate the cache is too small for the working set, causing cache misses and increased backend load. |
| Reliability, Data Freshness | ElastiCache | AWS/ElastiCache | `ReplicationLag` | Reactive | Statistic = Average; Period = 60s; DatapointsToAlarm = 5; TreatMissingData = notBreaching | Delay in seconds between the primary node and read replicas. Rising lag signals replica falling behind, risking stale reads and failover data loss. |
| Customer Experience, Performance | ElastiCache | AWS/ElastiCache | `CacheHitRate` | Proactive | Statistic = Average; Period = 60s; DatapointsToAlarm = 5; TreatMissingData = notBreaching | Percentage of successful key lookups. A dropping hit rate signals working-set changes or eviction pressure, increasing backend latency. |
| Customer Experience, Performance | ElastiCache | AWS/ElastiCache | `CacheMisses` | Reactive | Statistic = Sum; Period = 60s; DatapointsToAlarm = 5; TreatMissingData = notBreaching | Number of unsuccessful key lookups. Sustained high misses drive excess load on the backing datastore and increase response times. |
| Reliability | ElastiCache | AWS/ElastiCache | `SwapUsage` | Proactive | Statistic = Average; Period = 60s; DatapointsToAlarm = 5; TreatMissingData = notBreaching | Amount of swap space used. Non-zero swap on a cache node indicates severe memory pressure that will degrade performance. |
| Reliability | ElastiCache Serverless | AWS/ElastiCache | `ElastiCacheProcessingUnits` | Proactive | Statistic = Sum; Period = 60s; DatapointsToAlarm = 5; TreatMissingData = notBreaching | ECPU consumption for ElastiCache Serverless caches. Alarm to detect approaching capacity or cost thresholds in serverless mode. |

##### Additional notes

- **Valkey & serverless:** ElastiCache now supports **Valkey** (in addition to Redis OSS and Memcached) and a **serverless** offering. For **ElastiCache Serverless**, capacity is auto-managed — alarm on `ElastiCacheProcessingUnits` (now in the table above) and `DataStored` rather than host `CPUUtilization`/`FreeableMemory`.
- **`FreeableMemory` statistic:** For node-based clusters, `FreeableMemory` is best alarmed with **Minimum** or **Average** (not Sum) against an absolute-bytes threshold; watch it trending toward zero alongside `SwapUsage` and `DatabaseMemoryUsagePercentage` to pre-empt evictions/OOM.
- **OpenTelemetry (OTEL) via the CloudWatch agent:** ElastiCache engine metrics remain native `AWS/ElastiCache`. Instrument the client application with the ADOT SDK (sending OTLP to the CloudWatch agent) to correlate a connection/CPU spike with the calling service.
- **Anomaly detection:** Connection counts and CPU suit anomaly-detection bands for workloads with daily traffic cycles.


#### Redshift

Amazon Redshift is a fully managed, petabyte-scale cloud data warehouse service used for large-scale data analytics and business intelligence workloads. General guidelines only — tailor thresholds to your environment.

| Business Objectives | AWS Service | Namespace | Metric name | Reactive/Proactive | Recommended alarm configuration | Use case |
|---|---|---|---|---|---|---|
| Reliability | Redshift | `AWS/Redshift` | `DatabaseConnections` | Proactive | Statistic = Sum; Period = 60s; DatapointsToAlarm = 5; TreatMissingData = Breaching | This metric monitors the number of database connections to a cluster. |
| Reliability, Latency | Redshift | `AWS/Redshift` | `HealthStatus` | Proactive | Statistic = Minimum; Period = 60s; DatapointsToAlarm = 5; TreatMissingData = Breaching | Indicates the health of the cluster. Every minute the cluster connects to its database and performs a simple query. If it is able to perform this operation successfully, the cluster is considered healthy. Otherwise, the cluster is unhealthy. An unhealthy status can occur when the cluster database is under extremely heavy load or if there is a configuration problem with a database on the cluster. This is crucial for identifying and responding to issues promptly, which can help minimize downtime. 1 indicates healthy, and 0 indicates unhealthy. |
| Reliability, Latency | Redshift | `AWS/Redshift` | `PercentageDiskSpaceUsed` | Proactive | Statistic = Average; Period = 60s; DatapointsToAlarm = 5; TreatMissingData = Breaching | The percent of disk space used. Consider setting the threshold to around 95% of max storage space. |
| Latency | Redshift | `AWS/Redshift` | `ReadLatency` | Proactive | Statistic = Average; Period = 60s; DatapointsToAlarm = 5; TreatMissingData = notBreaching | The average amount of time taken for disk read I/O operations. High read latency can indicate performance issues, such as slow queries or resource contention, which can impact the overall performance and responsiveness of your applications. |
| Latency | Redshift | `AWS/Redshift` | `WriteLatency` | Proactive | Statistic = Average; Period = 60s; DatapointsToAlarm = 5; TreatMissingData = notBreaching | The average amount of time taken for disk write I/O operations. High write latency can indicate performance issues, such as slow queries or resource contention, which can impact the overall performance and responsiveness of your applications. |
| Latency, Performance | Redshift | `AWS/Redshift` | `QueryDuration` | Reactive | Statistic = Average; Period = 60s; DatapointsToAlarm = 5; TreatMissingData = notBreaching | Average time to complete a query. Sustained high values indicate complex queries, resource contention, or insufficient cluster capacity impacting user-facing latency. |
| Latency, Performance | Redshift | `AWS/Redshift` | `QueryRuntimeBreakdown` | Proactive | Statistic = Average; Period = 60s; DatapointsToAlarm = 5; TreatMissingData = notBreaching | Breakdown of query execution time across planning, waiting, and execution stages. Helps identify whether latency is caused by queuing, compilation, or actual data processing. |
| Latency, Performance | Redshift | `AWS/Redshift` | `WLMQueueWaitTime` | Reactive | Statistic = Average; Period = 60s; DatapointsToAlarm = 5; TreatMissingData = notBreaching | Time queries spend waiting in WLM queues before execution. High wait times indicate queue contention and the need to adjust concurrency or WLM configuration. |
| Reliability, Performance | Redshift | `AWS/Redshift` | `ConcurrencyScalingSeconds` | Proactive | Statistic = Sum; Period = 60s; DatapointsToAlarm = 5; TreatMissingData = notBreaching | Seconds of burst capacity consumed via Concurrency Scaling. Sustained scaling activity signals the primary cluster may be undersized and tracks cost of burst usage. |
| Reliability, Performance | Redshift Serverless | `AWS/Redshift-Serverless` | `ComputeSeconds` | Proactive | Statistic = Sum; Period = 60s; DatapointsToAlarm = 5; TreatMissingData = notBreaching | Compute capacity consumed by Redshift Serverless workloads. Alarm to detect capacity spikes or unexpected cost increases. |
| Latency, Performance | Redshift Serverless | `AWS/Redshift-Serverless` | `QueriesCompletedPerSecond` | Reactive | Statistic = Average; Period = 60s; DatapointsToAlarm = 5; TreatMissingData = notBreaching | Rate of completed queries in Redshift Serverless. A drop can indicate queuing, throttling, or degraded performance. |

##### Additional notes

- **Anomaly detection for latency metrics:** Consider using CloudWatch anomaly detection bands for `ReadLatency` and `WriteLatency` rather than static thresholds — query patterns often follow time-of-day or batch-schedule cycles that make fixed thresholds either too noisy or too lenient.
- **OpenTelemetry (OTEL) via the CloudWatch agent:** Applications querying Redshift can export client-side query latency and connection pool metrics via the CloudWatch agent to a custom CloudWatch namespace (e.g., `MyApp/Redshift`), providing caller-side visibility that complements server-side `AWS/Redshift` metrics.
- **CloudWatch Application Signals:** For ETL or analytics services that depend on Redshift, Application Signals SLO burn-rate alarms in the `ApplicationSignals` namespace can catch sustained degradation patterns across the data pipeline.


#### DMS

Recommended CloudWatch alarms for **AWS Database Migration Service (DMS)** to detect customer-impacting incidents. All alarms use **Period = 60s, DatapointsToAlarm = 5, TreatMissingData = Breaching**.

> General guidelines only — tailor thresholds to your environment.

| Business Objectives | Namespace | Metric name | Reactive/Proactive | Statistic | Use case |
|---|---|---|---|---|---|
| Customer Experience, Reliability | AWS/DMS | `CPUUtilization` | Proactive | Maximum | High CPU indicates an undersized instance or a task-configuration problem. CPU usage directly impacts the replication instance's ability to process transformations, read from source, and write to target — preventing performance degradation and task failures from resource exhaustion. |
| Customer Experience, Reliability | AWS/DMS | `FreeStorageSpace` | Proactive | Sum | If replication instance storage reaches 90% of capacity, CDC ongoing changes are paused, which can halt replication tasks entirely. |
| Customer Experience, Reliability | AWS/DMS | `CDCLatencySource` | Proactive | Maximum | High source latency indicates DMS is falling behind reading changes, which can lead to data inconsistency and increased risk of data loss if source logs are purged before DMS processes them. |
| Customer Experience, Reliability | AWS/DMS | `CDCLatencyTarget` | Proactive | Maximum | High target latency indicates bottlenecks in the apply process (missing indexes, database locks, or insufficient target resources). Critical for ensuring near-real-time replication and data consistency. |
| Customer Experience, Reliability | AWS/DMS | `CDCIncomingChanges` | Proactive | Sum | Number of change events waiting to be applied to the target. A growing backlog indicates the target cannot keep pace with source changes, risking replication drift. |
| Customer Experience, Reliability | AWS/DMS | `CDCChangesMemorySource` | Reactive | Maximum | Memory consumed buffering changes read from the source. High values indicate large transaction volumes or LOB handling pressure on the replication instance. |
| Customer Experience, Reliability | AWS/DMS | `CDCChangesMemoryTarget` | Reactive | Maximum | Memory consumed buffering changes waiting to apply to the target. Rising values indicate target-side bottlenecks or slow apply throughput. |
| Performance, Reliability | AWS/DMS | `FullLoadThroughputRowsSource` | Proactive | Average | Rows per second read from the source during full-load migration. Monitor to track migration progress and detect source-read bottlenecks during cutover windows. |
| Performance, Reliability | AWS/DMS | `FullLoadThroughputRowsTarget` | Proactive | Average | Rows per second written to the target during full-load migration. Monitor to track migration progress and detect target-write bottlenecks during cutover windows. |
| Reliability | AWS/DMS | `CapacityUtilization` | Proactive | Average | Percentage of serverless replication capacity in use (DMS Serverless only). Alarm to detect approaching capacity limits when instance-level metrics are not applicable. |

##### Additional notes

- **DMS Serverless:** With **DMS Serverless**, capacity is auto-managed in DCUs — alarm on `CapacityUtilization` (now in the table above) rather than instance `CPUUtilization`/`FreeStorageSpace`, which don't apply to serverless replications.
- **Task-level failure signals:** In addition to metrics in the table, configure DMS task-state CloudWatch Events (task failed/stopped) so responders are alerted on actual task failures, not just resource pressure.
- **CDC latency remains the core SLO:** `CDCLatencySource`/`CDCLatencyTarget` are the right primary signals; a rising source latency with the risk of source-log purge is the highest-severity DMS incident pattern.
- **OpenTelemetry (OTEL) via the CloudWatch agent:** DMS emits native `AWS/DMS` metrics. Use the ADOT SDK (sending OTLP to the CloudWatch agent) on source/target database clients and any orchestration Lambdas to correlate latency spikes with source load or target locking.
- **`TreatMissingData = Breaching`:** Appropriate here because absent metrics usually mean the replication instance/task is down — exactly what incident detection must catch.


#### OpenSearch

Amazon OpenSearch Service is a managed search and analytics engine used for log analytics, full-text search, and application monitoring. General guidelines only — tailor thresholds to your environment.

| Business Objectives | AWS Service | Namespace | Metric name | Reactive/Proactive | Recommended alarm configuration | Use case |
|---|---|---|---|---|---|---|
| Customer Experience, Reliability | OpenSearch | `ES/OpenSearchService` | `ClusterStatus.red` | Reactive | Statistic = Maximum; Period = 60s; DatapointsToAlarm = 5; TreatMissingData = notBreaching | The ClusterStatus.red metric monitors the health of your OpenSearch cluster. A value of 1 indicates that at least one primary shard and all of its replica shards are unavailable for data operations. This status represents a critical condition where some of your data is inaccessible. |
| Customer Experience, Reliability | OpenSearch | `ES/OpenSearchService` | `FreeStorageSpace` | Proactive | Statistic = Minimum; Period = 60s; DatapointsToAlarm = 5; TreatMissingData = notBreaching | The FreeStorageSpace metric monitors available disk space across your OpenSearch cluster nodes. It's recommended to set the threshold at around 25% of your node's total storage capacity. |
| Customer Experience, Reliability | OpenSearch | `ES/OpenSearchService` | `ClusterIndexWritesBlocked` | Reactive | Statistic = Maximum; Period = 60s; DatapointsToAlarm = 5; TreatMissingData = notBreaching | The ClusterIndexWritesBlocked metric monitors your OpenSearch cluster's ability to process write operations. A value of 0 means that the cluster is accepting requests. A value of 1 means that it is blocking requests. This represents operational impact where data modifications are rejected by the cluster. |
| Customer Experience, Reliability | OpenSearch | `ES/OpenSearchService` | `ClusterStatus.yellow` | Reactive | Statistic = Maximum; Period = 60s; DatapointsToAlarm = 5; TreatMissingData = notBreaching | A value of 1 indicates at least one replica shard is unallocated. The cluster is still functional but has reduced redundancy — a subsequent node failure could cause data loss. |
| Performance, Reliability | OpenSearch | `ES/OpenSearchService` | `CPUUtilization` | Proactive | Statistic = Average; Period = 60s; DatapointsToAlarm = 5; TreatMissingData = notBreaching | Percentage of CPU resources in use across data nodes. Sustained high utilization degrades search and indexing performance. |
| Performance, Reliability | OpenSearch | `ES/OpenSearchService` | `JVMMemoryPressure` | Proactive | Statistic = Maximum; Period = 60s; DatapointsToAlarm = 5; TreatMissingData = notBreaching | Percentage of the Java heap used across data nodes. Values above 80% risk long GC pauses; above 92% may cause out-of-memory node failures. |
| Reliability | OpenSearch | `ES/OpenSearchService` | `AutomatedSnapshotFailure` | Reactive | Statistic = Maximum; Period = 60s; DatapointsToAlarm = 5; TreatMissingData = notBreaching | A value of 1 indicates an automated snapshot failed. Backup gaps increase the risk of data loss during failures. |
| Reliability, Security | OpenSearch | `ES/OpenSearchService` | `KMSKeyError` | Reactive | Statistic = Maximum; Period = 60s; DatapointsToAlarm = 5; TreatMissingData = notBreaching | A value of 1 indicates the KMS encryption key used to encrypt data at rest has been disabled. Re-enable the key to restore normal operations. |
| Reliability, Security | OpenSearch | `ES/OpenSearchService` | `KMSKeyInaccessible` | Reactive | Statistic = Maximum; Period = 60s; DatapointsToAlarm = 5; TreatMissingData = notBreaching | A value of 1 indicates the KMS key is inaccessible (deleted or grants revoked). The domain is at risk of being permanently locked if not resolved within 7 days. |
| Reliability | OpenSearch | `ES/OpenSearchService` | `WarmFreeStorageSpace` | Proactive | Statistic = Minimum; Period = 60s; DatapointsToAlarm = 5; TreatMissingData = notBreaching | Free storage space on UltraWarm nodes. Low values can block migrations from hot storage and degrade warm-tier queries. |
| Reliability | OpenSearch | `ES/OpenSearchService` | `WarmToColdMigrationFailureCount` | Reactive | Statistic = Sum; Period = 60s; DatapointsToAlarm = 5; TreatMissingData = notBreaching | Number of failed migrations from UltraWarm to cold storage. Failures can cause storage buildup on warm nodes and break lifecycle policies. |
| Customer Experience, Reliability | OpenSearch Serverless | `AWS/AOSS` | `SearchRequestErrors` | Reactive | Statistic = Sum; Period = 60s; DatapointsToAlarm = 5; TreatMissingData = notBreaching | Errors from search requests on OpenSearch Serverless collections. Non-zero values indicate query failures impacting users. |
| Customer Experience, Reliability | OpenSearch Serverless | `AWS/AOSS` | `IndexingRequestErrors` | Reactive | Statistic = Sum; Period = 60s; DatapointsToAlarm = 5; TreatMissingData = notBreaching | Errors from indexing requests on OpenSearch Serverless collections. Non-zero values indicate data ingestion failures. |

##### Additional notes

- **Anomaly detection over static thresholds:** Consider using CloudWatch anomaly detection bands for `FreeStorageSpace` and `JVMMemoryPressure` rather than fixed thresholds — baseline storage consumption varies with index lifecycle policies and ingestion patterns.
- **OpenTelemetry (OTEL) via the CloudWatch agent:** If you instrument applications that query OpenSearch, the CloudWatch agent can export client-side latency and error metrics to CloudWatch under a custom namespace (e.g., `MyApp/OpenSearch`). These complement the server-side `ES/OpenSearchService` metrics with caller-perspective observability.
- **CloudWatch Application Signals:** For services fronting OpenSearch (e.g., a search API), Application Signals can provide SLO burn-rate alarms in the `ApplicationSignals` namespace, catching sustained degradation before individual metric thresholds fire.
- **OpenSearch Serverless:** If using OpenSearch Serverless collections, the namespace shifts to `AWS/AOSS` — serverless metrics (now in the table above) are separate from the managed-domain metrics.


### Networking & Content Delivery

#### API Gateway

Recommended CloudWatch alarms for **Amazon API Gateway** that teams can use as a starting point for creating alarms suitable for incident detection. AWS also publishes [recommended alarms for API Gateway](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Best_Practice_Recommended_Alarms_AWS_Services.html#ApiGateway).

> These are general guidelines. Final alarm selection, thresholds, and configuration should be tailored to your environment, workloads, and operational needs. They do not guarantee detection of all issues.

| Business Objectives | Namespace | Metric name | Reactive/Proactive | Recommended alarm configuration | Use case |
|---|---|---|---|---|---|
| Customer Experience, Reliability | AWS/ApiGateway | `5XXError` | Reactive | Statistic = Sum; Period = 60s; DatapointsToAlarm = 5; TreatMissingData = notBreaching | Monitors API request error rates by detecting abnormal occurrence of HTTP 5xx server errors. Configured for a steady-state API with consistent traffic; alerts on unexpected spikes indicating a bug/issue or aiding introduction/verification investigation. |
| Customer Experience, Reliability | AWS/ApiGateway | `(m1/m2)*100` where `m1 = 5XXError`, `m2 = Count` | Reactive | Statistic = Average; Period = 60s; DatapointsToAlarm = 5; TreatMissingData = notBreaching | Metric-math expression calculating the ratio of 5xx errors to total request count. A ratio enables dynamic thresholding based on actual traffic instead of static thresholds — recommended for variable/unpredictable request volumes. |
| Customer Experience, Latency | AWS/ApiGateway | `Latency` | Proactive | Statistic = Average; Period = 60s; DatapointsToAlarm = 5; TreatMissingData = notBreaching | Response-time monitoring gives insight into end-user experience and downstream service performance; facilitates proactive identification of latency issues in underlying infrastructure and application architecture. |
| Customer Experience, Reliability | AWS/ApiGateway | `ClientError` | Reactive | Statistic = Sum; Period = 60s; DatapointsToAlarm = 5; TreatMissingData = notBreaching | Monitors the number of requests that returned a 4XX response from API Gateway (WebSocket protocol) before the integration is invoked. |
| Customer Experience, Reliability | AWS/ApiGateway | `IntegrationError` | Reactive | Statistic = Sum; Period = 60s; DatapointsToAlarm = 5; TreatMissingData = notBreaching | Monitors the number of requests that return a 4XX/5XX response from the integration (WebSocket protocol). |
| Customer Experience, Reliability | AWS/ApiGateway | `ExecutionError` | Reactive | Statistic = Sum; Period = 60s; DatapointsToAlarm = 5; TreatMissingData = notBreaching | Monitors errors that occurred when calling the integration (WebSocket protocol). |
| Customer Experience, Latency | AWS/ApiGateway | `IntegrationLatency` | Proactive | Statistic = Average; Period = 60s; DatapointsToAlarm = 5; TreatMissingData = notBreaching | Measures time between API Gateway forwarding a request to the backend and receiving a response. Helps understand backend integration performance and investigate potential bottlenecks. |

> **Note on the `4XXError` / `Count` metrics:** The REST/HTTP API equivalents of the WebSocket `ClientError`/`IntegrationError` are `4XXError` and `Count`. Consider a `4XXError` ratio alarm the same way as the `5XXError` ratio above.

##### Additional notes

- **OpenTelemetry (OTEL) via the CloudWatch agent:** API Gateway itself still emits the `AWS/ApiGateway` metrics above natively, so no OTEL change is needed to alarm on them. However, if you instrument the **backend integrations** (Lambda, containers, EC2) with the CloudWatch agent (OTLP endpoint), you can now correlate `IntegrationLatency` spikes with backend spans/traces in CloudWatch. OTEL metrics land in a **custom namespace you define** (not `AWS/*`), so incident-detection alarms on those must target that namespace and its dimensions.
- **CloudWatch Application Signals (GA 2024):** For APIs fronting an application, enable Application Signals to get standardized golden-signal metrics (latency, error rate, request volume, faults) and **SLO burn-rate alarms** in the `ApplicationSignals` namespace. Burn-rate alarms are often more actionable for incident detection than raw `5XXError` counts because they tie directly to a customer-facing objective.
- **Anomaly Detection:** For APIs with variable traffic, prefer a **CloudWatch anomaly-detection band** on `Latency`/`Count` (or the `5XXError` ratio) instead of a static threshold — this reduces false pages during traffic swings while still catching real regressions.
- **Extended/high-resolution metrics:** Consider 1-second high-resolution alarms only for very latency-sensitive APIs; the article's 60s period with `DatapointsToAlarm = 5` (≈5 min of breach) remains a good balance for incident detection to avoid flapping.


#### Elastic Load Balancing (ALB/NLB)

Recommended CloudWatch alarms for **Application Load Balancer (ALB)** and **Network Load Balancer (NLB)** to detect customer-impacting incidents.

> General guidelines only — tailor thresholds to your environment. `m*` refer to metric-math source metrics.

| Business Objectives | AWS Service | Namespace | Metric name | Reactive/Proactive | Recommended alarm configuration | Use case |
|---|---|---|---|---|---|---|
| Customer Experience, Reliability | Application Load Balancer | AWS/ApplicationELB | `HTTPCode_ELB_5XX_Count` | Reactive | Statistic = Sum; Period = 60s; DatapointsToAlarm = 5; TreatMissingData = notBreaching | Quantity of 5xx server error codes returned by the load balancer itself. An increase can indicate issues with the LB or the backend instances; ideal values are low. Proactively addressing uptrends helps maintain availability. |
| Customer Experience, Reliability | Application Load Balancer | AWS/ApplicationELB | `HTTPCode_Target_5XX_Count` | Reactive | Statistic = Sum; Period = 60s; DatapointsToAlarm = 5; TreatMissingData = notBreaching | Quantity of HTTP 5xx status codes returned by the backend targets. Evaluate in the context of total request volume; trend analysis and 5xx **rate** relative to traffic is more meaningful for assessing backend application-stack health. |
| Customer Experience, Reliability | Application Load Balancer | AWS/ApplicationELB | `((m1+m2)/m3)*100` where `m1 = HTTPCode_Target_5XX_Count`, `m2 = HTTPCode_Target_4XX_Count`, `m3 = RequestCount` | Reactive | Statistic = Average; Period = 60s; DatapointsToAlarm = 5; TreatMissingData = notBreaching | Ratio of server (5XX) + client (4XX) errors to total requests. Normalizing on total requests makes the metric robust to traffic fluctuations. Set a low threshold (e.g., 5) to alarm when HTTP error rate breaches 5%. |
| Reliability | Application Load Balancer | AWS/ApplicationELB | `HealthyHostCount` | Proactive | Statistic = Minimum; Period = 60s; DatapointsToAlarm = 5; TreatMissingData = Breaching | Ensuring sufficient healthy backend instances is vital to meet SLOs. Proactive alerts when health thresholds are breached allow prompt remediation to mitigate performance-degradation risk. |
| Customer Experience, Reliability | Application Load Balancer | AWS/ApplicationELB | `RejectedConnectionCount` | Reactive | Statistic = Sum; Period = 60s; DatapointsToAlarm = 5; TreatMissingData = notBreaching | Connections rejected because the LB reached its maximum capacity. High values may indicate the need to scale resources or optimize load-balancing to accommodate incoming requests. |
| Customer Experience, Reliability | Application Load Balancer | AWS/ApplicationELB | `TargetResponseTime` | Reactive | Statistic = Average; Period = 60s; DatapointsToAlarm = 5; TreatMissingData = notBreaching | Time elapsed (seconds) after the request leaves the LB until the target starts sending response headers (equivalent to `target_processing_time` in access logs). Reporting criteria: there is a non-zero value. |
| Customer Experience, Reliability | Application Load Balancer | AWS/ApplicationELB | `((m1+m2)/(m1+m2+m3+m4))*100` where `m1 = HTTPCode_Target_5XX_Count`, `m2 = HTTPCode_Target_4XX_Count`, `m3 = HTTPCode_Target_3XX_Count`, `m4 = HTTPCode_Target_2XX_Count` | Reactive | Statistic = Average; Period = 60s; DatapointsToAlarm = 5; TreatMissingData = notBreaching | Normalized error rate for Target Groups across all response classes (2XX/3XX/4XX/5XX). Complements the LB-level error rate (which does not reflect per-target-group behavior); helps detect backend issues even when overall ALB metrics look healthy. |
| Reliability | Network Load Balancer | AWS/NetworkELB | `HealthyHostCount` | Proactive | Statistic = Minimum; Period = 60s; DatapointsToAlarm = 5; TreatMissingData = Breaching | Adequate number of healthy hosts is critical to uphold SLOs. Proactive alerting on health-threshold violations enables prompt remediation of performance-impairment risk. |
| Reliability, Security, Regulatory compliance | Network Load Balancer | AWS/NetworkELB | `TargetTLSNegotiationErrorCount` | Reactive | Statistic = Average; Period = 60s; DatapointsToAlarm = 5; TreatMissingData = notBreaching | Observability of TLS protocol anomalies to uphold encrypted-transport security and compliance. Surfacing/resolving TLS errors and warnings enables timely remediation of infrastructure or application issues over secure connections. |
| Reliability | Network Load Balancer | AWS/NetworkELB | `UnHealthyHostCount` | Proactive | Statistic = Maximum; Period = 60s; DatapointsToAlarm = 5; TreatMissingData = notBreaching | Number of targets considered unhealthy by the NLB. A rising count signals backend failures or health-check misconfigurations that reduce capacity and risk customer impact. |
| Reliability | Network Load Balancer | AWS/NetworkELB | `ActiveFlowCount` | Proactive | Statistic = Average; Period = 60s; DatapointsToAlarm = 5; TreatMissingData = notBreaching | Total number of concurrent TCP flows (connections) active on the NLB. Sustained spikes may indicate traffic surges or connection-leak issues that could exhaust capacity. |
| Customer Experience, Reliability | Network Load Balancer | AWS/NetworkELB | `TCP_Target_Reset_Count` | Reactive | Statistic = Sum; Period = 60s; DatapointsToAlarm = 5; TreatMissingData = notBreaching | Number of TCP RST packets sent from targets to clients. Spikes indicate targets are forcibly closing connections, signaling application crashes, resource exhaustion, or misconfigured keep-alive settings. |

##### Additional notes

- **Error-rate ratios over raw counts:** The article already models metric-math error-rate alarms — keep these as the primary incident-detection signal. Consider anomaly-detection bands on `TargetResponseTime` p90/p99 rather than Average, since averages hide tail-latency incidents.
- **Percentile statistics:** Alarm on `TargetResponseTime` **p99** (extended statistics) for a customer-experience-accurate latency signal; the Average can look fine while the tail degrades.
- **CloudWatch Application Signals (GA 2024):** For ALB-fronted apps, Application Signals provides SLO burn-rate alarms (availability + latency) in the `ApplicationSignals` namespace that map directly to customer impact — often a better incident detection trigger than raw ELB counts.
- **OpenTelemetry (OTEL) via the CloudWatch agent:** ELB metrics are native. Instrument targets with the ADOT SDK (sending OTLP to the CloudWatch agent) so a `HTTPCode_Target_5XX` spike traces to the failing service/dependency in CloudWatch/X-Ray.


#### CloudFront

Recommended CloudWatch alarms for **Amazon CloudFront** to detect customer-impacting incidents. AWS also publishes [recommended alarms for CloudFront](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Best_Practice_Recommended_Alarms_AWS_Services.html#CloudFront).

> General guidelines only — tailor thresholds and configuration to your environment. Note: CloudFront metrics are published in the **US East (N. Virginia) `us-east-1`** region regardless of edge location.

| Business Objectives | Namespace | Metric name | Reactive/Proactive | Recommended alarm configuration | Use case |
|---|---|---|---|---|---|
| Customer Experience, Reliability | AWS/CloudFront | `5xxErrorRate` | Reactive | Statistic = Average; Period = 60s; DatapointsToAlarm = 5; TreatMissingData = notBreaching | Percentage of HTTP 5xx server error responses within total requests processed by CloudFront. Tracking the percentage helps identify performance anomalies causing server-side errors during highly variable/unpredictable traffic, enabling proactive diagnosis and remediation to maintain availability under changing loads. |
| Customer Experience, Reliability | AWS/CloudFront | `TotalErrorRate` | Reactive | Statistic = Average; Period = 60s; DatapointsToAlarm = 5; TreatMissingData = notBreaching | Percentage of all HTTP error responses (4xx + 5xx) relative to total requests. Provides a broader view of client-impacting failures than `5xxErrorRate` alone; use an anomaly-detection approach for variable traffic. |
| Customer Experience, Reliability | AWS/CloudFront | `4xxErrorRate` | Reactive | Statistic = Average; Period = 60s; DatapointsToAlarm = 5; TreatMissingData = notBreaching | Percentage of HTTP 4xx client error responses within total requests. Spikes may indicate misconfigured origins, expired content, or access-control issues impacting end users. |
| Customer Experience, Latency | AWS/CloudFront | `OriginLatency` | Proactive | Statistic = Average; Period = 60s; DatapointsToAlarm = 5; TreatMissingData = notBreaching | Time (ms) from when CloudFront forwards a request to the origin until the origin starts returning response headers. A strong proactive signal for backend degradation before error rates rise. Requires additional CloudFront metrics enabled. |
| Performance, Reliability | AWS/CloudFront | `CacheHitRate` | Proactive | Statistic = Average; Period = 60s; DatapointsToAlarm = 5; TreatMissingData = notBreaching | Percentage of requests served from CloudFront edge caches. A drop in cache-hit rate increases origin load and latency; detecting degradation early enables investigation before customer impact. Requires additional CloudFront metrics enabled. |

##### Additional notes

- **Additional CloudFront metrics (opt-in):** Enable **additional CloudFront metrics** in the CloudFront console to access `OriginLatency`, `CacheHitRate`, and per–status-code error rates (`401`/`403`/`404`/`502`/`503`/`504`ErrorRate). The per-status-code rates provide fine-grained visibility beyond the aggregate metrics in the table.
- **OpenTelemetry (OTEL) via the CloudWatch agent:** CloudFront edge metrics are emitted natively (no OTEL needed), but instrument the **origin** (ALB/API Gateway/EC2/containers) with the ADOT SDK (sending OTLP to the CloudWatch agent) so a `5xxErrorRate` spike can be traced to the originating tier in CloudWatch/X-Ray.
- **Anomaly Detection:** Prefer a CloudWatch anomaly-detection band on the error rate for spiky CDN traffic to cut false pages.
- **Real-time logs / CloudFront Functions:** For latency-sensitive workloads, pair alarms with CloudFront real-time logs to shorten diagnosis time.


#### Route 53

Amazon Route 53 is a highly available and scalable DNS web service that performs domain registration, DNS routing, and health checking. Monitoring Route 53 metrics is essential for incident detection to ensure DNS resolution reliability, resolver endpoint capacity, and DNSSEC integrity. General guidelines only — tailor thresholds to your environment.

| Business Objectives | AWS Service | Namespace | Metric name | Reactive/Proactive | Recommended alarm configuration | Use case |
|---|---|---|---|---|---|---|
| Reliability | Route 53 | `AWS/Route53` | `HealthCheckStatus` | Reactive | Statistic = Minimum; Period = 60s; DatapointsToAlarm = 5; TreatMissingData = Breaching | HealthCheckStatus allows you to monitor the health of your application or service in real-time. This is crucial for identifying and responding to issues promptly, which can help minimize downtime. 1 indicates healthy, and 0 indicates unhealthy. |
| Reliability | Route 53 | `AWS/Route53Resolver` | `EndpointUnhealthyENICount` | Reactive | Statistic = Maximum; Period = 300s; DatapointsToAlarm = 2; TreatMissingData = notBreaching | The number of elastic network interfaces in the AUTO_RECOVERING status. This means that the resolver is trying to recover one or more of the Amazon VPC network interfaces that are associated with the endpoint (specified by EndpointId). During the recovery process, the endpoint functions with limited capacity and is unable to process DNS queries until it's fully recovered. |
| Reliability | Route 53 | `AWS/Route53` | `DNSSECInternalFailure` | Reactive | Statistic = Sum; Period = 60s; DatapointsToAlarm = 5; TreatMissingData = notBreaching | Value is 1 if any object in the hosted zone is in an INTERNAL_FAILURE state. Otherwise, value is 0. Volume: 1 per 4 hours per hosted zone. Region: Route 53 is a global service. To get hosted zone metrics, you must specify US East (N. Virginia) for the Region. |
| Reliability | Route 53 | `AWS/Route53Resolver` | `ResolverEndpointCapacityStatus` | Reactive | Statistic = Maximum; Period = 300s; DatapointsToAlarm = 2; TreatMissingData = notBreaching | The capacity status of the Resolver endpoint. where: 0 = OK (Normal operating capacity), 1 = Warning (At least one elastic network interface exceeds 50% capacity utilization), and 2 = Critical (At least one elastic network interface exceeds 75% capacity utilization). |
| Reliability | Route 53 | `AWS/Route53` | `HealthCheckPercentageHealthy` | Proactive | Statistic = Average; Period = 60s; DatapointsToAlarm = 5; TreatMissingData = notBreaching | Percentage of Route 53 health checkers that consider the endpoint healthy. Alarming on a drop (e.g., below 70%) adapts better to daily patterns than the binary `HealthCheckStatus` and reduces false alarms during expected traffic shifts. |
| Security, Reliability | Route 53 | `AWS/Route53Resolver` | `FirewallRuleGroupQueryVolume` | Proactive | Statistic = Sum; Period = 300s; DatapointsToAlarm = 2; TreatMissingData = notBreaching | Total DNS queries evaluated by a Route 53 Resolver DNS Firewall rule group. Sudden spikes may indicate misconfiguration or an increase in suspicious DNS activity worth investigating. |
| Security, Reliability | Route 53 | `AWS/Route53Resolver` | `BlockedQueries` | Reactive | Statistic = Sum; Period = 300s; DatapointsToAlarm = 2; TreatMissingData = notBreaching | DNS queries blocked by Route 53 Resolver DNS Firewall rules. Spikes in blocked queries can indicate potential DNS exfiltration attempts or compromised workloads making malicious lookups. |
| Reliability | Route 53 | `AWS/InternetMonitor` | `AvailabilityScore` | Proactive | Statistic = Average; Period = 300s; DatapointsToAlarm = 2; TreatMissingData = notBreaching | CloudWatch Internet Monitor availability score per geography. Alarming when the score drops below your SLO threshold provides a proactive complement to reactive health-check alarms, detecting internet-path issues before full outage. |
| Reliability | Route 53 | `AWS/Route53` | `DNSSECKeySigningKeysNeedingAction` | Reactive | Statistic = Maximum; Period = 300s; DatapointsToAlarm = 1; TreatMissingData = notBreaching | Number of DNSSEC key-signing keys (KSKs) that require action (e.g., rotation). Alarming before key rotation deadlines are missed prevents DNSSEC validation failures that could disrupt DNS resolution. |

##### Additional notes

- **Anomaly detection for health checks**: Consider using CloudWatch anomaly-detection bands on `HealthCheckPercentageHealthy` rather than purely static thresholds — this adapts to normal daily patterns and reduces false alarms during expected traffic shifts.
- **Route 53 Resolver Query Logs + CloudWatch Contributor Insights**: Query logging can feed CloudWatch Logs Insights and Contributor Insights for top-talker analysis — pair this with alarms on anomalous query volume per hosted zone.
- **OpenTelemetry (OTEL) via the CloudWatch agent**: If your application makes DNS lookups that you want to trace end-to-end, the CloudWatch agent can export custom resolution-latency metrics to CloudWatch via the OTLP endpoint. These land in a custom namespace you define (not `AWS/Route53`), giving you client-side DNS resolution visibility alongside server-side Route 53 metrics.


#### Direct Connect

Recommended CloudWatch alarms for **AWS Direct Connect** to detect customer-impacting incidents.

> General guidelines only — tailor thresholds to your environment. `BpsEgress`/`BpsIngress` thresholds must be set relative to your normal baseline traffic; a "low" threshold detects an outage/blackhole.

| Business Objectives | Namespace | Metric name | Reactive/Proactive | Recommended alarm configuration | Use case |
|---|---|---|---|---|---|
| Reliability | AWS/DX | `ConnectionState` | Reactive | Statistic = Maximum; Period = 300s; DatapointsToAlarm = 2; TreatMissingData = Breaching | State of the connection: 1 = up, 0 = down. Available for dedicated and hosted connections. |
| Reliability | AWS/DX | `ConnectionErrorCount` | Reactive | Statistic = Sum; Period = 300s; DatapointsToAlarm = 2; TreatMissingData = notBreaching | Total error count for all MAC-level errors on the AWS device (includes CRC errors). Counts errors since the last reported datapoint; reports non-zero when there are interface errors. |
| Reliability | AWS/DX | `ConnectionBpsEgress` | Reactive | Statistic = Average; Period = 60s; DatapointsToAlarm = 5; TreatMissingData = Breaching | Bitrate for outbound data from the AWS side of the connection (bits/sec). Set the threshold to an unusually low value (e.g., 100 bps) to reflect a network traffic outage. |
| Reliability | AWS/DX | `ConnectionBpsIngress` | Reactive | Statistic = Average; Period = 300s; DatapointsToAlarm = 2; TreatMissingData = Breaching | Bitrate for inbound data from the AWS side of the connection (bits/sec). Set the threshold to an unusually low value (e.g., 100 bps) to reflect a network traffic outage. |
| Reliability | AWS/DX | `VirtualInterfaceBpsEgress` | Reactive | Statistic = Average; Period = 300s; DatapointsToAlarm = 2; TreatMissingData = Breaching | Bitrate for outbound data from the AWS side of the virtual interface (bits/sec). Set the threshold to an unusually low value (e.g., 100 bps) to reflect a network traffic outage. |
| Reliability | AWS/DX | `VirtualInterfaceBpsIngress` | Reactive | Statistic = Average; Period = 300s; DatapointsToAlarm = 2; TreatMissingData = Breaching | Bitrate for inbound data from the AWS side of the virtual interface (bits/sec). Set the threshold to an unusually low value (e.g., 100 bps) to reflect a network traffic outage. |
| Reliability | AWS/DX | `ConnectionLightLevelTx` | Proactive | Statistic = Minimum; Period = 300s; DatapointsToAlarm = 2; TreatMissingData = notBreaching | Transmit optical light level on the AWS side of the connection (dBm). Alarm when light level degrades below acceptable threshold for proactive detection of physical-layer degradation before a hard down. |
| Reliability | AWS/DX | `ConnectionLightLevelRx` | Proactive | Statistic = Minimum; Period = 300s; DatapointsToAlarm = 2; TreatMissingData = notBreaching | Receive optical light level on the AWS side of the connection (dBm). Alarm when light level degrades below acceptable threshold for proactive detection of physical-layer degradation before a hard down. |

##### Additional notes

- **Redundancy-aware alarming:** For resilient designs (two DX connections, or DX + Site-to-Site VPN backup), build a **composite alarm** that fires only when *all* redundant `ConnectionState` metrics are down, so responders are paged on true loss of connectivity rather than a single-link maintenance event.
- **Anomaly detection on bitrate:** Instead of a fixed "100 bps" floor, an anomaly-detection band on `*BpsIngress/Egress` adapts to diurnal traffic patterns and catches partial brownouts, not just full outages.
- **OpenTelemetry:** DX metrics come from the AWS network device, so they remain `AWS/DX` (not OTEL). Use the ADOT SDK (via the CloudWatch agent) on the workloads *riding* the link to correlate application impact with a DX event.
- **Cross-account observability:** Centralize DX metrics from network/transit accounts into a monitoring account via CloudWatch cross-account observability so responders see them alongside workload metrics.


#### Transit Gateway

AWS Transit Gateway acts as a regional network hub that interconnects VPCs, VPN connections, Direct Connect gateways, and other Transit Gateways, simplifying network architecture at scale. General guidelines only — tailor thresholds to your environment.

| Business Objectives | AWS Service | Namespace | Metric name | Reactive/Proactive | Recommended alarm configuration | Use case |
|---|---|---|---|---|---|---|
| Reliability | VPC Transit Gateway | `AWS/TransitGateway` | `BytesDropCountBlackhole` | Reactive | Statistic = Sum; Period = 60 seconds; DatapointsToAlarm = 5; TreatMissingData = Breaching | The number of bytes dropped because they matched a blackhole route. This metric is available at both gateway-level and attachment-level. |
| Reliability | VPC Transit Gateway | `AWS/TransitGateway` | `BytesDropCountNoRoute` | Reactive | Statistic = Sum; Period = 60 seconds; DatapointsToAlarm = 5; TreatMissingData = Breaching | The number of bytes dropped because they did not match a route. This metric is available at both gateway-level and attachment-level. |
| Reliability | VPC Transit Gateway | `AWS/TransitGateway` | `BytesIn` | Reactive | Statistic = Sum; Period = 60 seconds; DatapointsToAlarm = 5; TreatMissingData = Breaching | The number of bytes received by the transit gateway. This metric is available at both gateway-level and attachment-level. |
| Reliability | VPC Transit Gateway | `AWS/TransitGateway` | `BytesOut` | Reactive | Statistic = Sum; Period = 60 seconds; DatapointsToAlarm = 5; TreatMissingData = Breaching | The number of bytes sent from the transit gateway. This metric is available at both gateway-level and attachment-level. |
| Reliability | VPC Transit Gateway | `AWS/TransitGateway` | `PacketsDropCountBlackhole` | Reactive | Statistic = Sum; Period = 60 seconds; DatapointsToAlarm = 5; TreatMissingData = Breaching | The number of packets dropped because they matched a blackhole route. Useful for alerting on small-packet flood scenarios where byte counts remain low but packet counts spike. |
| Reliability | VPC Transit Gateway | `AWS/TransitGateway` | `PacketsDropCountNoRoute` | Reactive | Statistic = Sum; Period = 60 seconds; DatapointsToAlarm = 5; TreatMissingData = Breaching | The number of packets dropped because they did not match a route. Useful for alerting on small-packet flood scenarios where byte counts remain low but packet counts spike. |

##### Additional notes

- **Anomaly detection over static thresholds:** For `BytesIn` and `BytesOut`, consider using CloudWatch anomaly-detection bands rather than static thresholds. Traffic patterns on Transit Gateways vary by time of day and day of week, making anomaly detection a better fit than fixed Sum thresholds for detecting unexpected drops or spikes.
- **OpenTelemetry (OTEL) via the CloudWatch agent:** If you emit custom networking telemetry from workloads traversing the TGW (e.g., flow-level latency), CloudWatch agent can forward OTEL metrics to CloudWatch under a custom namespace you define (not `AWS/TransitGateway`). This complements the native VPC-level metrics.
- **Transit Gateway Flow Logs:** Since 2023, Transit Gateway supports flow logs that can be published to CloudWatch Logs. Consider creating metric filters on flow-log data for fine-grained traffic analysis beyond what the built-in CloudWatch metrics provide.
- **Network Manager integration:** AWS Network Manager provides a global view of Transit Gateways and can surface route and topology changes. Consider using Network Manager events alongside CloudWatch alarms for a holistic incident detection posture.
- **Multi-account observability:** CloudWatch cross-account observability allows you to aggregate Transit Gateway metrics from spoke accounts into a central monitoring account, simplifying alarm management for hub-and-spoke TGW architectures.


#### Site-to-Site VPN

AWS Site-to-Site VPN creates encrypted IPsec tunnels between your on-premises network and your AWS VPCs. Monitoring tunnel state is the most critical alarm for detecting connectivity loss during incidents. General guidelines only — tailor thresholds to your environment.

| Business Objectives | AWS Service | Namespace | Metric name | Reactive/Proactive | Recommended alarm configuration | Use case |
|---|---|---|---|---|---|---|
| Reliability | AWS VPN | `AWS/VPN` | `TunnelState` | Reactive | Statistic = Minimum; Period = 60 seconds; DatapointsToAlarm = 5; TreatMissingData = Breaching | This alarm helps you understand if the state of this tunnel is DOWN. For static VPNs, 0 indicates DOWN and 1 indicates UP. For BGP VPNs, 1 indicates ESTABLISHED and 0 is used for all other states. For both types of VPNs, values between 0 and 1 indicate at least one tunnel is not UP. Units: Fractional value between 0 and 1. |
| Reliability | AWS VPN | `AWS/VPN` | `TunnelDataIn` | Reactive | Statistic = Sum; Period = 60 seconds; DatapointsToAlarm = 5; TreatMissingData = Breaching | Bytes received on the AWS side of the tunnel. A sudden drop to zero on a tunnel that normally carries traffic is a leading indicator of routing or connectivity issues even if `TunnelState` still reports UP. |
| Reliability | AWS VPN | `AWS/VPN` | `TunnelDataOut` | Reactive | Statistic = Sum; Period = 60 seconds; DatapointsToAlarm = 5; TreatMissingData = Breaching | Bytes sent from the AWS side of the tunnel. A sudden drop to zero on a tunnel that normally carries traffic is a leading indicator of routing or connectivity issues even if `TunnelState` still reports UP. |

##### Additional notes

- **TreatMissingData = Breaching rationale:** For `TunnelState`, missing data likely means the tunnel is down or the VPN connection itself is unreachable — treating missing data as breaching ensures you are alerted even if metric reporting ceases entirely.
- **Redundant tunnel monitoring:** AWS Site-to-Site VPN provides two tunnels per connection for high availability. Create separate alarms per tunnel (using the `TunnelIpAddress` dimension) so you are alerted when even one tunnel drops — running on a single tunnel means you have lost redundancy.
- **CloudWatch anomaly detection:** For environments with predictable traffic patterns, anomaly-detection bands on `TunnelDataIn`/`TunnelDataOut` can detect subtle degradation (partial packet loss, asymmetric routing) that a binary UP/DOWN alarm would miss.
- **VPN accelerated connections:** If using Global Accelerator with Site-to-Site VPN, monitor the accelerator's health metrics alongside VPN tunnel state to differentiate between tunnel failures and edge network issues.
- **Network Manager integration:** Consider using AWS Network Manager with CloudWatch to get a consolidated view of VPN tunnel health across multiple connections — Network Manager emits topology-change events that can complement per-tunnel CloudWatch alarms for multi-site deployments.


#### Network Firewall

AWS Network Firewall is a managed network firewall service that provides fine-grained control over network traffic using stateless and stateful rule groups for VPC protection. General guidelines only — tailor thresholds to your environment.

| Business Objectives | AWS Service | Namespace | Metric name | Reactive/Proactive | Recommended alarm configuration | Use case |
|---|---|---|---|---|---|---|
| Reliability, Security | AWS Network Firewall | `AWS/NetworkFirewall` | `TLSErrors` | Reactive | Statistic = Sum; Period = 60 seconds; DatapointsToAlarm = 5; TreatMissingData = notBreaching | Number of errors observed by Network Firewall while inspecting SSL/TLS packets. Reporting criteria: There is a nonzero value. |
| Reliability, Security | AWS Network Firewall | `AWS/NetworkFirewall` | `DroppedPackets` | Reactive | Statistic = Sum; Period = 60 seconds; DatapointsToAlarm = 5; TreatMissingData = notBreaching | Number of packets dropped by firewall rules. Indicates rule-blocked traffic or potential misconfigurations. |
| Security | AWS Network Firewall | `AWS/NetworkFirewall` | `InvalidDroppedPackets` | Reactive | Statistic = Sum; Period = 60 seconds; DatapointsToAlarm = 5; TreatMissingData = notBreaching | Number of malformed packets dropped. A spike could indicate an attack or upstream network issues. |
| Reliability | AWS Network Firewall | `AWS/NetworkFirewall` | `StreamExceptionPolicyPackets` | Reactive | Statistic = Sum; Period = 60 seconds; DatapointsToAlarm = 5; TreatMissingData = notBreaching | Number of packets handled by the stream exception policy when inspection capacity is exceeded. Indicates the firewall may be over-capacity. |
| Reliability | AWS Network Firewall | `AWS/NetworkFirewall` | `FirewallEndpointCount` | Proactive | Statistic = Minimum; Period = 60 seconds; DatapointsToAlarm = 5; TreatMissingData = Breaching | Number of healthy firewall endpoints. A drop in endpoint count may indicate AZ-level issues affecting traffic inspection coverage. |

##### Additional notes

- **OpenTelemetry (OTEL) via the CloudWatch agent:** While Network Firewall does not natively emit OTEL metrics, you can use the CloudWatch agent sidecar on workloads behind the firewall to emit custom namespace metrics (e.g., application-level connection failure rates) that correlate with firewall rule actions. OTEL metrics land in a custom namespace you define, not `AWS/NetworkFirewall`.
- **Anomaly detection on traffic metrics:** Consider using CloudWatch anomaly detection bands on `DroppedPackets` and `PassedPackets` metrics rather than static thresholds — traffic patterns vary significantly and anomaly detection adapts to baseline traffic volumes.
- **Network Firewall flow logs integration:** Combine CloudWatch alarms with VPC Flow Logs and Network Firewall alert logs sent to CloudWatch Logs. Use CloudWatch Logs Insights metric filters to create alarms on specific Suricata rule hits or categories of blocked traffic for deeper security visibility.


### Application Integration

#### SNS

Amazon SNS is a fully managed pub/sub messaging service that enables decoupled microservices, distributed systems, and serverless applications to communicate. For incident detection, monitoring SNS delivery failures, filtered-out notifications, and DLQ redirection is critical to ensure messages reach their intended subscribers reliably. General guidelines only — tailor thresholds to your environment.

| Business Objectives | AWS Service | Namespace | Metric name | Reactive/Proactive | Recommended alarm configuration | Use case |
|---|---|---|---|---|---|---|
| Reliability | Amazon SNS | `AWS/SNS` | `NumberOfNotificationsFailed` | Reactive | Statistic = Sum; Period = 60s; DatapointsToAlarm = 5; TreatMissingData = notBreaching | If suboptimal SNS message processing is detected, further analysis recommended to ascertain root cause. Potential factors could include insufficient permissions, throttling limits, or resource constraints on consuming services. |
| Reliability | Amazon SNS | `AWS/SNS` | `NumberOfNotificationsFilteredOut-InvalidAttributes` | Reactive | Statistic = Sum; Period = 60s; DatapointsToAlarm = 5; TreatMissingData = notBreaching | This metric is crucial for maintaining the reliability and effectiveness of message delivery in applications that use Amazon SNS, particularly when custom attributes are heavily utilized. |
| Reliability | Amazon SNS | `AWS/SNS` | `NumberOfNotificationsFilteredOut-NoMessageAttributes` | Reactive | Statistic = Sum; Period = 60s; DatapointsToAlarm = 5; TreatMissingData = notBreaching | This metric specifically measures the number of notifications that are filtered out because they do not contain any message attributes. |
| Reliability | Amazon SNS | `AWS/SNS` | `NumberOfNotificationsFilteredOut-InvalidMessageBody` | Reactive | Statistic = Sum; Period = 60s; DatapointsToAlarm = 5; TreatMissingData = notBreaching | This metric tracks the number of SNS notifications that were filtered out due to an invalid message body. Monitoring this can help in identifying issues with message formatting or content that does not meet the expected criteria. |
| Reliability | Amazon SNS | `AWS/SNS` | `NumberOfNotificationsRedrivenToDlq` | Reactive | Statistic = Sum; Period = 60s; DatapointsToAlarm = 5; TreatMissingData = notBreaching | This metric tracks the number of Amazon SNS notifications that are redirected to a Dead Letter Queue (DLQ). Monitoring this helps in understanding the volume of notifications that fail to be processed successfully by their target subscribers. |
| Reliability | Amazon SNS | `AWS/SNS` | `SMSMonthToDateSpentUSD` | Proactive | Statistic = Maximum; Period = 60s; DatapointsToAlarm = 5; TreatMissingData = notBreaching | You can set an alarm for this metric to know when your month-to-date charges are close to the monthly SMS spend quota for your account. When Amazon SNS determines that sending an SMS message would incur a cost that exceeds this quota, it stops publishing SMS messages within minutes. |
| Reliability | Amazon SNS | `AWS/SNS` | `(m1/m2)*100` where m1 = `SMSSuccessRate`, m2 = `NumberOfMessagesPublished` | Reactive | Statistic = Average; Period = 60s; DatapointsToAlarm = 5; TreatMissingData = notBreaching | This metric measures the rate of successful SMS message deliveries as a percentage of messages sent. |

##### Additional notes

- **SNS delivery status logging + CloudWatch Metrics**: SNS can log delivery status for each protocol (HTTP, SQS, Lambda, etc.) to CloudWatch Logs. Pair these with Metric Filters to create custom metrics on specific delivery failure reasons (e.g., endpoint throttling vs. permission errors) for more granular alarming than `NumberOfNotificationsFailed` alone.
- **Anomaly detection on `NumberOfNotificationsFailed`**: Static thresholds may cause false alarms during expected traffic spikes. CloudWatch anomaly detection adapts to publishing patterns — use anomaly bands on failure counts to detect genuine degradation without tuning fixed thresholds.
- **SNS FIFO topics metrics**: If using FIFO topics (introduced 2020, matured since), monitor `NumberOfMessagesPublished` alongside deduplication metrics. Consider alarming on message-group-level backlog if you have ordering-sensitive workflows.
- **OpenTelemetry (OTEL) via the CloudWatch agent — publish-side latency**: The ADOT SDK auto-instrumentation captures SNS `Publish` API call latency and errors on the producer side. These metrics land in your custom namespace via the CloudWatch OTLP endpoint, giving you publisher-observed latency complementing the server-side `AWS/SNS` metrics.
- **CloudWatch Application Signals**: If SNS is a core messaging layer in your application, Application Signals can derive SLO burn-rate alarms (in the `ApplicationSignals` namespace) on the publish path's success rate and latency — detecting degradation at the application tier before per-topic metrics breach thresholds.
- **SMS origination metrics**: Since ~2023, SNS provides per-origination-identity metrics (`SMSSuccessRate` broken down by origination number/sender ID). Consider alarming per origination identity rather than only at the account level to isolate carrier-specific delivery issues.


#### SQS

Amazon SQS is a fully managed message queuing service that decouples microservices, distributed systems, and serverless applications. Monitoring queue depth and message age is critical for detecting consumer lag and processing bottlenecks during incidents. General guidelines only — tailor thresholds to your environment.

| Business Objectives | AWS Service | Namespace | Metric name | Reactive/Proactive | Recommended alarm configuration | Use case |
|---|---|---|---|---|---|---|
| Reliability, Latency | Amazon SQS | `AWS/SQS` | `ApproximateNumberOfMessagesVisible` | Proactive | Statistic = Average; Period = 60 seconds; DatapointsToAlarm = 5; TreatMissingData = notBreaching | The metric measures the number of visible messages in the SQS queue that are awaiting processing. An elevated number could signify performance degradation in downstream services consuming messages from the queue. Further investigation is advised if depth grows beyond typical levels to prevent processing delays. |
| Reliability, Latency | Amazon SQS | `AWS/SQS` | `ApproximateAgeOfOldestMessage` | Proactive | Statistic = Maximum; Period = 60 seconds; DatapointsToAlarm = 5; TreatMissingData = Breaching | This metric measures the duration (in seconds) that the oldest message has been in the queue without being processed. A high value can indicate that messages are not being consumed as fast as they are being produced, which might suggest a backlog or delay in processing. |
| Reliability | Amazon SQS | `AWS/SQS` | `ApproximateNumberOfMessagesVisible` (DLQ) | Reactive | Statistic = Maximum; Period = 60 seconds; DatapointsToAlarm = 1; TreatMissingData = notBreaching | Alarm on your dead-letter queue with threshold >= 1. Any message landing in the DLQ signals a processing failure that warrants investigation. |
| Reliability | Amazon SQS | `AWS/SQS` | `NumberOfMessagesReceived` | Proactive | Statistic = Sum; Period = 60 seconds; DatapointsToAlarm = 5; TreatMissingData = notBreaching | Detects sudden drops in consumer activity — a leading indicator of downstream failures. Consider anomaly-detection bands for workloads with variable traffic. |
| Reliability | Amazon SQS | `AWS/SQS` | `NumberOfMessagesSent` | Proactive | Statistic = Sum; Period = 60 seconds; DatapointsToAlarm = 5; TreatMissingData = notBreaching | Detects sudden drops in producer activity — a leading indicator of upstream failures. Consider anomaly-detection bands for workloads with variable traffic. |
| Reliability, Latency | Amazon SQS | `AWS/SQS` | `ApproximateNumberOfMessagesDelayed` | Proactive | Statistic = Average; Period = 60 seconds; DatapointsToAlarm = 5; TreatMissingData = notBreaching | For FIFO queues, monitors delayed messages to detect per-group stalls that may not be visible in aggregate queue depth. |

##### Additional notes

- **OpenTelemetry (OTEL) via the CloudWatch agent:** The CloudWatch agent (OTLP endpoint) can emit custom metrics (e.g., consumer processing duration, batch size) to CloudWatch via the OTLP endpoint. These land in a custom namespace you define (not `AWS/SQS`) and complement the native queue-level metrics with application-level visibility.
- **CloudWatch anomaly detection:** Consider using anomaly-detection bands on `ApproximateNumberOfMessagesVisible` instead of a static threshold — queues with variable traffic patterns benefit from dynamic baselines that adapt to time-of-day and day-of-week seasonality.
- **CloudWatch Application Signals:** If your SQS consumers are instrumented services fronting an application, SLO burn-rate alarms in the `ApplicationSignals` namespace can catch latency/error-rate degradation before queue depth rises.
- **FIFO queue message group-level backlog:** For FIFO queues with multiple message groups, monitor per-group backlog to detect stalls that aggregate queue-depth metrics may mask.


#### EventBridge

Recommended CloudWatch alarms for **Amazon EventBridge** to detect customer-impacting incidents.

> General guidelines only — tailor thresholds to your environment.

| Business Objectives | Namespace | Metric name | Reactive/Proactive | Recommended alarm configuration | Use case |
|---|---|---|---|---|---|
| Reliability | AWS/Events | `FailedInvocations` | Reactive | Statistic = Sum; Period = 60s; DatapointsToAlarm = 5; TreatMissingData = notBreaching | Counts failed API calls due to server-side issues (timeouts, resource limits, internal errors). Helps identify when/where problems occur in the API process. **Note:** EventBridge only sends this metric to CloudWatch if it isn't zero. |
| Reliability | AWS/Events | `InvocationsFailedToBeSentToDlq` | Reactive | Statistic = Sum; Period = 60s; DatapointsToAlarm = 5; TreatMissingData = notBreaching | Number of invocations that couldn't be moved to a dead-letter queue. DLQ errors occur due to permissions errors, unavailable resources, or size limits. **Note:** EventBridge only sends this metric to CloudWatch if it isn't zero. |
| Reliability | AWS/Events | `ThrottledRules` | Reactive | Statistic = Sum; Period = 60s; DatapointsToAlarm = 5; TreatMissingData = notBreaching | Number of times rule execution was throttled. Invocations for those rules may be delayed. |
| Reliability | AWS/EventBridge Pipes | `ExecutionFailed` | Reactive | Statistic = Sum; Period = 60s; DatapointsToAlarm = 5; TreatMissingData = notBreaching | Number of EventBridge Pipes executions that failed. Indicates target or enrichment errors in the pipe. |
| Reliability | AWS/EventBridge Pipes | `ExecutionThrottled` | Reactive | Statistic = Sum; Period = 60s; DatapointsToAlarm = 5; TreatMissingData = notBreaching | Number of EventBridge Pipes executions throttled due to service limits. |
| Reliability | AWS/Scheduler | `InvocationAttemptCount` | Proactive | Statistic = Sum; Period = 60s; DatapointsToAlarm = 5; TreatMissingData = notBreaching | Tracks EventBridge Scheduler invocation attempts. A sudden drop may indicate scheduling failures. |
| Reliability | AWS/Scheduler | `InvocationDroppedCount` | Reactive | Statistic = Sum; Period = 60s; DatapointsToAlarm = 5; TreatMissingData = notBreaching | Number of scheduled invocations dropped by EventBridge Scheduler due to failures or limits. |
| Reliability | AWS/Events | `InvocationsSentToDlq` | Reactive | Statistic = Sum; Period = 60s; DatapointsToAlarm = 5; TreatMissingData = notBreaching | Number of invocations sent to a dead-letter queue for rules targeting API Destinations or other targets. Indicates repeated delivery failures. |
| Reliability | AWS/Events | `MatchedEvents` | Proactive | Statistic = Sum; Period = 60s; DatapointsToAlarm = 5; TreatMissingData = notBreaching | Number of events matched by rules. A sudden drop can indicate an upstream producer outage that error metrics won't show. |
| Reliability | AWS/Events | `TriggeredRules` | Proactive | Statistic = Sum; Period = 60s; DatapointsToAlarm = 5; TreatMissingData = notBreaching | Number of rules triggered by incoming events. Useful as a proactive baseline; deviations signal event-flow anomalies. |

##### Additional notes

- **`TreatMissingData` and the "only sent if non-zero" quirk:** Because `FailedInvocations`/`InvocationsFailedToBeSentToDlq` are only published when non-zero, an alarm on them should treat missing data as **notBreaching** (as shown) and use a low threshold (>0) — an anomaly-detection band is inappropriate here.
- **EventBridge Pipes & Scheduler (newer services):** EventBridge Pipes and Scheduler use separate namespaces from `AWS/Events`. Also alarm on Pipes `Invocations` and target-error metrics, and Scheduler target failures beyond what is shown in the table.
- **API Destinations:** For rules targeting API Destinations, also consider `Invocation4xx`/`5xxErrorCount` to detect downstream HTTP endpoint failures (note: these metric names may vary by configuration).
- **OpenTelemetry (OTEL) via the CloudWatch agent:** EventBridge metrics are native `AWS/Events`. Instrument producers/consumers (Lambda, ECS) with the ADOT SDK (sending OTLP to the CloudWatch agent) to trace an event end-to-end and correlate `FailedInvocations` with the failing target.


#### Step Functions

AWS Step Functions is a serverless orchestration service that coordinates distributed application components using visual workflows (state machines). Monitoring execution failures, throttles, and timeouts is essential for detecting broken workflows and capacity issues during incidents. General guidelines only — tailor thresholds to your environment.

| Business Objectives | AWS Service | Namespace | Metric name | Reactive/Proactive | Recommended alarm configuration | Use case |
|---|---|---|---|---|---|---|
| Latency | Step Functions | `AWS/States` | `ExecutionTime` | Proactive | Statistic = Average; Period = 60 seconds; DatapointsToAlarm = 5; TreatMissingData = notBreaching | A sudden increase in execution time might indicate issues with the steps or the resources they interact with. This metric can be a valuable tool for early detection of issues that might not be immediately apparent from other metrics. |
| Latency | Step Functions | `AWS/States` | `ExecutionThrottled` | Reactive | Statistic = Sum; Period = 60 seconds; DatapointsToAlarm = 5; TreatMissingData = notBreaching | This metric tracks the number of times state machine executions are throttled due to exceeding AWS service limits. Monitoring this can help you identify when you are hitting these limits, which could signal that adjustments need to be made either in the process design or in the service limits themselves. |
| Reliability | Step Functions | `AWS/States` | `ExecutionsFailed` | Reactive | Statistic = Sum; Period = 60 seconds; DatapointsToAlarm = 5; TreatMissingData = notBreaching | It helps in tracking the number of executions that fail in AWS Step Functions. This is crucial for identifying workflows that are not performing as expected and require attention. By monitoring the failures, developers can proactively identify and resolve issues before they impact the business operations. This reduces downtime and improves the overall stability of applications. |
| Reliability | Step Functions | `AWS/States` | `ExecutionsTimedOut` | Reactive | Statistic = Sum; Period = 60 seconds; DatapointsToAlarm = 5; TreatMissingData = notBreaching | It helps in identifying timeouts in state machine executions, which can indicate problems like poor configuration, inadequate resource allocation, or issues in the called services that need addressing. |
| Reliability | Step Functions | `AWS/States` | `ExecutionsAborted` | Reactive | Statistic = Sum; Period = 60 seconds; DatapointsToAlarm = 5; TreatMissingData = notBreaching | Aborted executions indicate external cancellation or upstream issues that may require investigation. |
| Performance | Step Functions | `AWS/States` | `ExecutionsStarted` | Proactive | Statistic = Sum; Period = 60 seconds; DatapointsToAlarm = 5; TreatMissingData = notBreaching | Monitors execution throughput. For Express Workflows, use anomaly-detection bands to detect throughput anomalies since Express executions are not individually tracked in the console. |
| Reliability | Step Functions | `AWS/States` | `MapRunsFailed` | Reactive | Statistic = Sum; Period = 60 seconds; DatapointsToAlarm = 5; TreatMissingData = notBreaching | For Distributed Map states, detects failures within individual Map Run iterations. Use with the MapRunArn dimension. |
| Reliability | Step Functions | `AWS/States` | `MapRunsAborted` | Reactive | Statistic = Sum; Period = 60 seconds; DatapointsToAlarm = 5; TreatMissingData = notBreaching | For Distributed Map states, detects aborted Map Runs indicating upstream cancellation or resource issues. Use with the MapRunArn dimension. |

##### Additional notes

- **OpenTelemetry (OTEL) via the CloudWatch agent:** Step Functions natively supports AWS X-Ray tracing. The CloudWatch agent can export these traces alongside custom metrics (e.g., per-step duration, retry counts) to CloudWatch via the OTLP endpoint. Custom metrics land in a namespace you define (not `AWS/States`) and provide step-level granularity beyond the built-in execution-level metrics.
- **CloudWatch anomaly detection:** `ExecutionTime` is an excellent candidate for anomaly-detection alarms — workflows with stable performance profiles benefit from dynamic bands rather than static thresholds that may trigger false positives during expected load spikes.
- **CloudWatch Application Signals:** If your state machines orchestrate instrumented services, SLO burn-rate alarms in the `ApplicationSignals` namespace can catch end-to-end latency or error-rate degradation across the workflow's constituent services.
- **Express Workflows periods:** For Express Workflows (high-volume, short-duration), consider tighter alarm periods (e.g., 30 seconds) since Express executions are not individually tracked in the console.


#### Kinesis Data Streams

Recommended CloudWatch alarms for **Amazon Kinesis Data Streams** to detect customer-impacting incidents. AWS also publishes [recommended alarms for Kinesis Data Streams](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Best_Practice_Recommended_Alarms_AWS_Services.html#Kinesis).

> General guidelines only — tailor thresholds to your environment.

| Business Objectives | Namespace | Metric name | Reactive/Proactive | Recommended alarm configuration | Use case |
|---|---|---|---|---|---|
| Latency | AWS/Kinesis | `ReadProvisionedThroughputExceeded` | Reactive | Statistic = Sum; Period = 60s; DatapointsToAlarm = 5; TreatMissingData = notBreaching | Number of times read operations exceed provisioned read throughput. Monitoring helps ensure you're not losing access to data due to throughput limits during high-traffic periods. |
| Reliability | AWS/Kinesis | `WriteProvisionedThroughputExceeded` | Reactive | Statistic = Sum; Period = 60s; DatapointsToAlarm = 5; TreatMissingData = notBreaching | Identifies moments when write capacity limits are hit, causing ingestion delays/failures. Optimize by adjusting provisioned throughput to actual data-flow needs. |
| Reliability | AWS/Kinesis | `GetRecords.IteratorAgeMilliseconds` | Proactive | Statistic = Maximum; Period = 60s; DatapointsToAlarm = 5; TreatMissingData = notBreaching | How long records have been in the stream before processing. A high iterator age indicates data isn't consumed as quickly as produced, which may lead to real-time processing issues. |
| Reliability | AWS/Kinesis | `PutRecords.FailedRecords` | Reactive | Statistic = Sum; Period = 60s; DatapointsToAlarm = 5; TreatMissingData = notBreaching | Number of records that fail to be processed. Crucial for data integrity; spikes may indicate performance issues with the stream or producer applications. |
| Reliability | AWS/Kinesis | `PutRecords.ThrottledRecords` | Reactive | Statistic = Sum; Period = 60s; DatapointsToAlarm = 5; TreatMissingData = notBreaching | Number of records throttled when using PutRecords. Indicates ingestion throttling from exceeding shard write capacity; adjust shard count or input rate. |
| Latency | AWS/Kinesis | `SubscribeToShardEvent.MillisBehindLatest` | Proactive | Statistic = Maximum; Period = 60s; DatapointsToAlarm = 5; TreatMissingData = notBreaching | For enhanced fan-out consumers, measures how far behind the consumer is. The shared-throughput `IteratorAge` metric doesn't capture per-consumer lag in fan-out mode. |

##### Additional notes

- **On-demand capacity mode:** The throughput-exceeded metrics assume **provisioned** shards. In **on-demand** mode, Kinesis auto-scales shards, so `Read/WriteProvisionedThroughputExceeded` should be near-zero and any breach signals you've hit the on-demand doubling limit — alarm on it plus the account-level shard quota rather than provisioning a fixed shard count.
- **`IteratorAge` is the key consumer-lag SLO:** Keep `GetRecords.IteratorAgeMilliseconds` as the primary **proactive** incident-detection signal; a rising iterator age is the earliest indicator of a stalled/slow consumer. Pair with an anomaly-detection band.
- **OpenTelemetry (OTEL) via the CloudWatch agent:** Kinesis metrics are native `AWS/Kinesis`. Instrument producers and consumer apps (Lambda/KCL/Flink) with the ADOT SDK (sending OTLP to the CloudWatch agent) so `PutRecords.FailedRecords` and iterator-age spikes trace to the failing component.
- **Downstream (Firehose/Managed Flink):** For end-to-end streaming, extend alarms to Data Firehose (`DeliveryToS3.Success`, `ThrottledRecords`) and Managed Service for Apache Flink (`fullRestarts`, `downtime`).


#### Amazon MQ

Recommended CloudWatch alarms for **Amazon MQ** (ActiveMQ and RabbitMQ brokers) to detect customer-impacting incidents. All alarms use **Period = 60s, DatapointsToAlarm = 5, TreatMissingData = notBreaching**.

> General guidelines only — tailor thresholds to your environment.

| Business Objectives | Broker | Namespace | Metric name | Reactive/Proactive | Statistic | Use case |
|---|---|---|---|---|---|---|
| Customer Experience, Reliability | ActiveMQ | AWS/AmazonMQ | `CurrentConnectionsCount` | Reactive | Average | Monitors live broker connections to identify approaching connection quotas and sudden connectivity losses. |
| Customer Experience, Reliability | ActiveMQ | AWS/AmazonMQ | `CpuUtilization` | Proactive | Maximum | Percentage of assigned EC2 compute the ActiveMQ broker consumes. Exceeding the threshold indicates potential message-processing bottlenecks. |
| Customer Experience, Reliability | ActiveMQ | AWS/AmazonMQ | `StorePercentUsage` | Proactive | Maximum | How much available storage capacity is used (percentage). At 100% the broker stops accepting new messages. |
| Customer Experience, Reliability | ActiveMQ | AWS/AmazonMQ | `InflightCount` | Proactive | Maximum | Unacknowledged messages in transit to consumers; helps detect processing bottlenecks. |
| Customer Experience, Reliability | ActiveMQ | AWS/AmazonMQ | `HeapUsage` | Proactive | Maximum | Percentage of the ActiveMQ JVM memory limit currently used. Higher percentage → broker using significant resources and may lead to an OOM alarm. |
| Customer Experience, Reliability | RabbitMQ | AWS/AmazonMQ | `MessageUnacknowledgedCount` | Reactive | Maximum | Count of messages not acknowledged within the queues. An elevated count may indicate message-processing problems. |
| Customer Experience, Reliability | RabbitMQ | AWS/AmazonMQ | `AckRate` | Proactive | Average | Rate at which messages are acknowledged by consumers (messages/second at sampling time). |
| Customer Experience, Reliability | RabbitMQ | AWS/AmazonMQ | `SystemCpuUtilization` | Proactive | Maximum | Current utilization of allocated EC2 compute by the broker (percentage). Increases indicate resource constraints affecting processing. |
| Customer Experience, Reliability | RabbitMQ | AWS/AmazonMQ | `RabbitMQMemUsed` | Proactive | Maximum | Volume of RAM used by a RabbitMQ broker. If `RabbitMQMemUsed` reaches 85% of `RabbitMQMemLimit`, proactively alarm to initiate a broker upgrade before it hits the limit (memory alarm). |
| Customer Experience, Reliability | RabbitMQ | AWS/AmazonMQ | `RabbitMQDiskFree` | Proactive | Maximum | Total volume of free disk space in a RabbitMQ broker. When disk usage exceeds its limit, the cluster blocks all producer connections. |
| Customer Experience, Reliability | RabbitMQ | AWS/AmazonMQ | `RabbitMQQueueMessages` | Proactive | Maximum | Per-queue message count. Broker-level metrics don't reveal a single stuck queue; per-queue alarms catch localized backlogs in quorum queues. |
| Customer Experience, Reliability | RabbitMQ | AWS/AmazonMQ | `ConsumerCount` | Reactive | Minimum | Number of consumers attached to a queue. A drop to zero indicates all consumers have disconnected and messages will accumulate. |

##### Additional notes

- **RabbitMQ quorum queues:** Newer RabbitMQ on Amazon MQ favors quorum queues for durability. Monitor quorum member health in addition to the per-queue metrics in the table — broker-level metrics alone don't reveal replication issues within a single queue.
- **Cluster/HA awareness:** For clustered (multi-AZ) deployments, build a **composite alarm** across broker instances so responders are paged on true quorum loss, not a single-node reboot during maintenance.
- **Memory/disk pre-emptive alarms remain critical:** The `RabbitMQMemUsed` @85% and `RabbitMQDiskFree` guidance is exactly right — these are the two conditions that block producers; keep them as high-priority proactive alarms.
- **OpenTelemetry (OTEL) via the CloudWatch agent:** Amazon MQ emits native `AWS/AmazonMQ` metrics. Instrument producer/consumer applications with the ADOT SDK (sending OTLP to the CloudWatch agent) to correlate `InflightCount`/`MessageUnacknowledgedCount` growth with a slow or crashed consumer.
- **Anomaly detection:** Connection counts and ack rates suit anomaly-detection bands for workloads with daily cycles.


#### MSK

Amazon Managed Streaming for Apache Kafka (MSK) is a fully managed service for building and running applications that use Apache Kafka to process streaming data. General guidelines only — tailor thresholds to your environment.

| Business Objectives | AWS Service | Namespace | Metric name | Reactive/Proactive | Recommended alarm configuration | Use case |
|---|---|---|---|---|---|---|
| Performance | Amazon MSK | `AWS/Kafka` | `(m1 + m2) m1 = CpuUser m2 = CpuSystem` | Proactive | Statistic = Average; Period = 60 seconds; DatapointsToAlarm = 5; TreatMissingData = missing | This metric measures the total CPU utilization (user + system) on the broker. High CPU usage indicates the broker is under heavy load and might struggle to process messages efficiently. Proactive monitoring helps identify when brokers need scaling or when client operations need optimization to maintain performance and prevent throttling. |
| Reliability | Amazon MSK | `AWS/Kafka` | `HeapMemoryAfterGC` | Proactive | Statistic = Average; Period = 60 seconds; DatapointsToAlarm = 5; TreatMissingData = missing | This metric shows the Java heap memory usage after garbage collection occurs. High values post-GC indicate potential memory leaks or insufficient heap allocation. Monitoring helps prevent out-of-memory errors that could crash brokers and disrupt service. |
| Reliability | Amazon MSK | `AWS/Kafka` | `UnderMinIsrPartitionCount` | Reactive | Statistic = Maximum; Period = 60 seconds; DatapointsToAlarm = 5; TreatMissingData = notBreaching | This metric counts partitions that have fewer in-sync replicas (ISR) than the minimum required. A high count indicates replication issues that could lead to data loss or unavailability. Monitoring ensures data durability and helps maintain the cluster's fault tolerance. |
| Reliability | Amazon MSK | `AWS/Kafka` | `OfflinePartitionsCount` | Reactive | Statistic = Maximum; Period = 60 seconds; DatapointsToAlarm = 5; TreatMissingData = notBreaching | This metric shows the number of partitions without an active leader. Offline partitions are unavailable for reads and writes, directly impacting application availability. Monitoring helps quickly identify and resolve partition leadership issues that could cause service disruptions. |
| Performance | Amazon MSK | `AWS/Kafka` | `MessagesInPerSec` | Proactive | Statistic = Sum; Period = 60 seconds; DatapointsToAlarm = 5; TreatMissingData = breaching | This metric measures the rate of incoming messages to the broker. It helps monitor producer traffic patterns and cluster load. Sudden spikes or drops can indicate producer issues or abnormal application behavior. Essential for capacity planning and ensuring the cluster can handle peak throughput. |
| Latency | Amazon MSK | `AWS/Kafka` | `OffsetLag` | Reactive | Statistic = Maximum; Period = 60 seconds; DatapointsToAlarm = 5; TreatMissingData = notBreaching | This metric shows the delay between producer and consumer operations by measuring how far behind consumers are from the latest produced messages. High lag indicates consumers aren't keeping up with producers, which could lead to data processing delays. Critical for monitoring consumer health and identifying potential bottlenecks. |
| Customer Experience | Amazon MSK | `AWS/Kafka` | `TcpConnections` | Proactive | Statistic = Average; Period = 60 seconds; DatapointsToAlarm = 5; TreatMissingData = breaching | This metric tracks the number of active TCP connections to the broker. Helps monitor client connection patterns and identify potential connection leaks. Unusually high numbers might indicate clients not properly closing connections, while sudden drops could signal client connectivity issues. |
| Reliability | Amazon MSK | `AWS/Kafka` | `IAMTooManyConnections` | Reactive | Statistic = Sum; Period = 60 seconds; DatapointsToAlarm = 5; TreatMissingData = notBreaching | This metric indicates when clients exceed IAM authentication connection limits. High values suggest potential security issues or misconfigured clients attempting too many simultaneous authentications. Important for maintaining secure access and preventing authentication-related performance impacts. |
| Availability | Amazon MSK | `AWS/Kafka` | `ActiveControllerCount` | Reactive | Statistic = Sum; Period = 60 seconds; DatapointsToAlarm = 5; TreatMissingData = notBreaching | This metric shows the percentage of CPU resources being used by the broker. High utilization might indicate the need for scaling or optimization of client operations. Essential for capacity planning and ensuring brokers have sufficient resources to handle workload. |
| Customer Experience | Amazon MSK | `AWS/Kafka` | `ConnectionCreationRate` | Proactive | Statistic = Sum; Period = 60 seconds; DatapointsToAlarm = 5; TreatMissingData = notBreaching | This metric measures how frequently new connections are being established. Unusually high rates might indicate connection churning (frequent connect/disconnect cycles) which can impact performance. Helpful for identifying client connection management issues and potential DDoS attempts. |
| Latency | Amazon MSK | `AWS/Kafka` | `EstimatedMaxTimeLag` | Reactive | Statistic = Maximum; Period = 60 seconds; DatapointsToAlarm = 5; TreatMissingData = notBreaching | Available with enhanced monitoring (PER_TOPIC_PER_BROKER level). Provides a more actionable time-based consumer-lag signal than basic `OffsetLag`. |
| Latency | Amazon MSK | `AWS/Kafka` | `MaxOffsetLag` | Reactive | Statistic = Maximum; Period = 60 seconds; DatapointsToAlarm = 5; TreatMissingData = notBreaching | Available with enhanced monitoring (PER_TOPIC_PER_BROKER level). Maximum offset-based consumer lag across partitions — more granular than the basic `OffsetLag` metric. |

##### Additional notes

- **OpenTelemetry (OTEL) via the CloudWatch agent:** MSK clusters can export JMX and node metrics via the CloudWatch agent (OTLP endpoint) as a sidecar or on dedicated monitoring instances. OTEL metrics land in a custom namespace you define (not `AWS/Kafka`), giving you finer-grained dimensionality (e.g., per-topic, per-consumer-group) beyond what the default `AWS/Kafka` namespace provides.
- **CloudWatch anomaly detection bands:** For metrics like `MessagesInPerSec`, `OffsetLag`, and `TcpConnections` that have natural daily/weekly patterns, consider using CloudWatch anomaly detection bands instead of static thresholds to reduce false positives while still catching genuine deviations.
- **MSK Express Brokers:** If using Express Brokers (launched 2024), the metrics surface differs — storage-related metrics are absent and throughput scaling is automatic. Review Express-specific metrics documentation and adjust alarm sets accordingly.
- **CloudWatch Application Signals:** If Kafka-consuming applications are instrumented with Application Signals, consider SLO burn-rate alarms in the `ApplicationSignals` namespace for end-to-end latency from produce-to-consume, complementing broker-side `OffsetLag`.
- **KRaft mode considerations:** Clusters running in KRaft mode (replacing ZooKeeper) change the semantics of `ActiveControllerCount` — ensure your alarm logic accounts for the new controller quorum model where multiple controllers participate but only one is active leader.


### Storage

#### S3

Amazon S3 is an object storage service offering industry-leading scalability, data availability, security, and performance. For incident detection, monitoring S3 error rates, replication lag, and request latency ensures data durability SLAs are met and client-facing degradation is detected early. General guidelines only — tailor thresholds to your environment.

| Business Objectives | AWS Service | Namespace | Metric name | Reactive/Proactive | Recommended alarm configuration | Use case |
|---|---|---|---|---|---|---|
| Customer experience, Reliability | S3 | `AWS/S3` | `5xxErrors` | Reactive | Statistic = Sum; Period = 60s; DatapointsToAlarm = 5; TreatMissingData = notBreaching | This metric tracks the number of server-side errors (5xx HTTP status codes) that Amazon S3 returns. These errors typically indicate problems with Amazon S3 itself or issues on the server side that are affecting the ability to retrieve, store, or process data. |
| Reliability | S3 | `AWS/S3` | `ReplicationLatency` | Proactive | Statistic = Average; Period = 60s; DatapointsToAlarm = 5; TreatMissingData = notBreaching | Many organizations have Service Level Agreements (SLAs) that require data to be replicated within a certain timeframe for reasons like disaster recovery or data locality. Tracking the ReplicationLatency metric helps ensure compliance with these SLAs, providing evidence that data is being replicated within the agreed-upon timelines. |
| Customer experience, Reliability | S3 | `AWS/S3` | `TotalRequestLatency` | Proactive | Statistic = Average; Period = 60s; DatapointsToAlarm = 5; TreatMissingData = notBreaching | This metric measures the total time taken to process requests to an S3 bucket, from the time the request is received to when the response is sent. Monitoring this latency helps in understanding how quickly S3 is handling requests, which is crucial for performance-sensitive applications. High latency values can indicate potential issues either with the S3 service or with how requests are being managed (e.g., network issues, inefficient request handling). This metric can help in identifying and diagnosing such problems. |
| Customer experience, Reliability | S3 | `AWS/S3` | `4xxErrors` | Reactive | Statistic = Sum; Period = 60s; DatapointsToAlarm = 5; TreatMissingData = notBreaching | Tracks client-side errors (4xx HTTP status codes). A spike indicates access-control misconfigurations, missing objects, or client-side request issues impacting consumers. Requires request-level metrics enabled on the bucket/prefix. |
| Reliability | S3 | `AWS/S3` | `OperationsPendingReplication` | Proactive | Statistic = Average; Period = 60s; DatapointsToAlarm = 5; TreatMissingData = notBreaching | Number of objects pending replication. If you require an RPO SLA with S3 Replication Time Control (RTC), alarm on this metric exceeding your threshold to detect replication backlog before it breaches your recovery-point objective. |

##### Additional notes

- **S3 Storage Lens metrics in CloudWatch**: S3 Storage Lens (advanced tier) can publish organization-wide metrics to CloudWatch in the `AWS/S3/Storage-Lens` namespace. Consider alarming on `NonCurrentVersionStorageBytes` growth or `IncompleteMultipartUploadStorageBytes` to catch cost anomalies and orphaned uploads proactively.
- **Enable S3 request-level metrics:** Beyond the default daily storage metrics, enabling request metrics at the bucket/prefix level unlocks `4xxErrors`, `FirstByteLatency`, `AllRequests`, and `GetRequests` at 1-minute granularity.
- **Anomaly detection on `TotalRequestLatency`**: Rather than a static threshold, CloudWatch anomaly detection adapts to workload patterns (e.g., batch jobs at night). Use anomaly-detection bands on latency and error-count metrics for fewer false positives.
- **OpenTelemetry (OTEL) via the CloudWatch agent — client-side S3 latency**: The AWS SDK (v2 Java, JS v3, etc.) emits HTTP-level metrics that can be captured via the CloudWatch agent and exported to CloudWatch as custom metrics in your own namespace. This gives you client-observed latency and retry counts that complement server-side `TotalRequestLatency`.
- **CloudWatch Application Signals**: If your application uses S3 as a backing store behind an API, Application Signals can derive SLO burn-rate alarms (in the `ApplicationSignals` namespace) on that API's error rate and latency — catching degradation at the application layer before bucket-level metrics cross thresholds.


#### EFS / FSx

Recommended CloudWatch alarms for **Amazon EFS** and **Amazon FSx for Windows File Server** to detect customer-impacting incidents. AWS also publishes [recommended alarms for EFS](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Best_Practice_Recommended_Alarms_AWS_Services.html#EFS).

> General guidelines only — tailor thresholds to your environment.

| Business Objectives | AWS Service | Namespace | Metric name | Reactive/Proactive | Recommended alarm configuration | Use case |
|---|---|---|---|---|---|---|
| Reliability, Latency | Amazon EFS | AWS/EFS | `PercentIOLimit` | Proactive | Statistic = Average; Period = 60s; DatapointsToAlarm = 5; TreatMissingData = Breaching | Shows how close a file system is to reaching the I/O limit of the **General Purpose** performance mode. |
| Reliability, Latency | Amazon EFS | AWS/EFS | `PermittedThroughput` | Proactive | Statistic = Average; Period = 60s; DatapointsToAlarm = 5; TreatMissingData = Breaching | Maximum throughput a file system can drive. Reflects Elastic max write throughput; for Provisioned, reflects the higher of provisioned vs what Standard storage allows; for Bursting, a function of file-system size and `BurstCreditBalance`. Min/Max/Average statistics give lowest/highest/average permitted throughput per minute. |
| Reliability, Latency | Amazon FSx for Windows File Server | AWS/FSx | `NetworkThroughputUtilization` | Proactive | Statistic = Average; Period = 60s; DatapointsToAlarm = 5; TreatMissingData = Breaching | Network throughput for clients accessing the file system, as a percentage of the provisioned limit. |
| Reliability, Latency | Amazon FSx for Windows File Server | AWS/FSx | `FileServerDiskThroughputUtilization` | Proactive | Statistic = Average; Period = 60s; DatapointsToAlarm = 5; TreatMissingData = Breaching | Disk throughput between the file server and its storage volumes, as a percentage of the provisioned limit determined by throughput capacity. |
| Reliability, Latency | Amazon FSx for Windows File Server | AWS/FSx | `FileServerDiskIopsUtilization` | Proactive | Statistic = Average; Period = 60s; DatapointsToAlarm = 5; TreatMissingData = Breaching | Disk IOPS between the file server and storage volumes, as a percentage of the provisioned limit determined by throughput capacity. |
| Reliability, Latency | Amazon FSx for Windows File Server | AWS/FSx | `StorageCapacityUtilization` | Proactive | Statistic = Average; Period = 60s; DatapointsToAlarm = 5; TreatMissingData = Breaching | Used physical storage capacity as a percentage of total storage capacity. |
| Reliability | Amazon EFS | AWS/EFS | `BurstCreditBalance` | Proactive | Statistic = Average; Period = 60s; DatapointsToAlarm = 5; TreatMissingData = Breaching | For Bursting-mode file systems, alarm when credits trend toward zero to prevent throughput throttling. Not relevant for Elastic throughput file systems. |
| Reliability | Amazon EFS | AWS/EFS | `StorageBytes` | Proactive | Statistic = Average; Period = 300s; DatapointsToAlarm = 3; TreatMissingData = notBreaching | Total bytes stored in the file system. Alarm on growth to proactively prevent capacity-driven cost overruns. |
| Reliability | Amazon FSx for Windows File Server | AWS/FSx | `FreeStorageCapacity` | Proactive | Statistic = Average; Period = 60s; DatapointsToAlarm = 5; TreatMissingData = Breaching | Remaining free storage capacity in bytes. Alarm when low to prevent capacity-full incidents that block writes. |

##### Additional notes

- **Elastic throughput is now the EFS default:** New EFS file systems default to **Elastic throughput**, where `PermittedThroughput` scales automatically — so the classic Bursting `BurstCreditBalance` exhaustion alarm is often no longer relevant. For Bursting-mode file systems, still alarm on `BurstCreditBalance` (see table).
- **FSx family beyond Windows:** The table covers FSx for Windows. Add equivalents for **FSx for NetApp ONTAP, OpenZFS, and Lustre** (e.g., `StorageCapacityUtilization`, `FileServerDiskIopsUtilization`, and Lustre `FreeDataStorageCapacity`) if you run those.
- **OpenTelemetry (OTEL) via the CloudWatch agent:** Storage metrics remain native `AWS/EFS`/`AWS/FSx`. Instrument the *clients* (EC2/EKS/ECS) with the ADOT SDK (sending OTLP to the CloudWatch agent) to correlate a `PercentIOLimit`/utilization spike with the workload driving it.
- **Anomaly detection:** Utilization percentages suit anomaly-detection bands well for workloads with daily/seasonal patterns.


### AI/ML & Contact Center

#### SageMaker

Amazon SageMaker is a fully managed machine learning service that enables developers and data scientists to build, train, and deploy ML models at scale, with real-time inference endpoints being a critical production component. General guidelines only — tailor thresholds to your environment.

| Business Objectives | AWS Service | Namespace | Metric name | Reactive/Proactive | Recommended alarm configuration | Use case |
|---|---|---|---|---|---|---|
| Customer Experience, Reliability | Amazon SageMaker | `AWS/SageMaker/Endpoints` | `InvocationsPerInstance` | Proactive | Statistic = Sum; Period = 60 seconds; DatapointsToAlarm = 5; TreatMissingData = notBreaching | Tracks the number of inference requests processed by each endpoint instance. It helps detect abnormal traffic patterns, sudden spikes in workload, or unexpected drops in traffic that could indicate upstream service failures. |
| Customer Experience, Reliability | Amazon SageMaker | `AWS/SageMaker` | `ModelLatency` | Reactive | Statistic = p99; Period = 60 seconds; DatapointsToAlarm = 5; TreatMissingData = notBreaching | Measures the time taken by the model container to process an inference request (in microseconds). High p99 latency indicates model performance degradation, compute resource saturation, or container health issues. Threshold should be baselined per customer endpoint. |
| Customer Experience, Reliability | Amazon SageMaker | `AWS/SageMaker` | `Invocation5XXErrors` | Reactive | Statistic = Sum; Period = 60 seconds; DatapointsToAlarm = 5; TreatMissingData = notBreaching | Tracks server-side errors caused by endpoint failures, container crashes, or internal service issues. This is the highest-signal alarm for real customer incidents. Consider using a CloudWatch Metric Math expression (5XXErrors / Invocations * 100) for rate-based alerting to avoid false positives on low-traffic endpoints. |
| Customer Experience, Reliability | Amazon SageMaker | `AWS/SageMaker` | `OverheadLatency` | Reactive | Statistic = p99; Period = 60 seconds; DatapointsToAlarm = 5; TreatMissingData = notBreaching | Measures the additional time spent outside the model container, such as request routing, serialization, and infrastructure overhead before and after model execution. |
| Customer Experience, Reliability | Amazon SageMaker | `AWS/SageMaker` | `Invocations` | Reactive | Statistic = Sum; Period = 300 seconds; DatapointsToAlarm = 3; TreatMissingData = Breaching | Tracks the total number of InvokeEndpoint requests sent to an endpoint. A drop to zero indicates the endpoint is no longer receiving or processing traffic, which could signal endpoint failure, routing issues, or upstream service outages. TreatMissingData is set to breaching because missing data from an active endpoint is itself an incident signal. |
| Customer Experience, Reliability | Amazon SageMaker | `AWS/SageMaker` | `Invocation4XXErrors` | Proactive | Statistic = Sum; Period = 60 seconds; DatapointsToAlarm = 5; TreatMissingData = notBreaching | Tracks client-side errors (4xx). A sustained rise can indicate payload schema drift, authentication issues, or misconfigured upstream callers before they escalate to 5XX failures. |
| Customer Experience, Reliability | Amazon SageMaker | `AWS/SageMaker/Endpoints` | `CPUUtilization` | Proactive | Statistic = Average; Period = 60 seconds; DatapointsToAlarm = 5; TreatMissingData = notBreaching | CPU utilization of endpoint instances. Correlate with latency spikes to identify resource saturation and validate auto-scaling policies. Requires enhanced instance metrics. |
| Customer Experience, Reliability | Amazon SageMaker | `AWS/SageMaker/Endpoints` | `MemoryUtilization` | Proactive | Statistic = Average; Period = 60 seconds; DatapointsToAlarm = 5; TreatMissingData = notBreaching | Memory utilization of endpoint instances. High memory pressure can cause container OOMs and inference failures. Requires enhanced instance metrics. |

##### SageMaker AI Insights (recommended for inference endpoints)

For real-time inference, enable **Amazon SageMaker AI Insights** (SageMaker AI *detailed observability*) — the recommended, deeper observability layer for endpoints. It is **built on OpenTelemetry (OTel)**: SageMaker runs an **AWS-managed OTel Collector on every instance** backing your endpoint (no agent for you to deploy or operate). That collector gathers:

- **GPU accelerator metrics** from the NVIDIA **DCGM** exporter,
- **host/node metrics** from a node exporter (CPU, memory, disk), and
- **inference-framework metrics** scraped from the model container (**vLLM / SGLang**),

and publishes them as **OTel metrics to CloudWatch via OTLP** with rich labels (endpoint name, inference component, instance ID, availability zone, instance type). These are stored natively in CloudWatch as OTel metric data and are **queryable with PromQL** — via the **SageMaker AI Insights dashboard** in CloudWatch, in **CloudWatch Query Studio**, or from **Amazon Managed Grafana / self-hosted Grafana** through a regional **PromQL endpoint** (SigV4-authenticated).

###### Recommendation: turn it on

- **Enable detailed observability on production inference endpoints** (SageMaker AI console → endpoint → *Observability*, or via the API). There is **no collector to manage** — it is delivered by the service.
- Use it for **GPU-aware and LLM-aware incident detection** (GPU saturation/thermal, KV-cache pressure, token throughput, time-to-first-token) that the classic `AWS/SageMaker` metrics above cannot express.
- Query and alarm with **PromQL** (CloudWatch PromQL-in-alarms), and build Grafana dashboards against the regional PromQL endpoint.

###### Key OTel metrics to monitor

| Layer | Metric | What it tells you |
|---|---|---|
| GPU (DCGM) | `DCGM_FI_DEV_GPU_UTIL` | GPU utilization (%). Sustained ~100% = compute-bound; near-0% under load = a stalled/mis-placed model. |
| GPU (DCGM) | `DCGM_FI_DEV_FB_USED` / `DCGM_FI_DEV_FB_FREE` | GPU framebuffer memory used/free (bytes). Near-full memory risks OOM / failed loads. |
| GPU (DCGM) | `DCGM_FI_DEV_GPU_TEMP` | GPU temperature (°C) — thermal throttling risk. |
| GPU (DCGM) | `DCGM_FI_DEV_SM_ACTIVE` | Streaming-multiprocessor active (%) — real compute engagement vs. idle. |
| Inference (vLLM/SGLang) | `TTFT` | Time to First Token (histogram) — the key user-perceived LLM latency; alarm on p99. |
| Inference (vLLM/SGLang) | `InterTokenLatency` | Inter-token latency (histogram) — streaming smoothness. |
| Inference (vLLM/SGLang) | `TotalTPS` / `OutputTokensPerSecond` / `TPSUtilization` | Token throughput and how close you are to capacity. |
| Inference (vLLM/SGLang) | `KVCacheUtilization` | KV-cache usage (%). High values cause request queuing/rejection. |
| Inference (vLLM/SGLang) | `QueueDepth` / `BatchSize` | Waiting vs. in-flight requests — saturation and batching health. |
| Inference (per IC) | `5XXErrorRatePerIC` / `4XXErrorRatePerIC` | Server/client error rate per inference component. |
| Endpoint | `ICECount` | Insufficient Capacity Errors — scaling is blocked by capacity. |
| Endpoint | `InstanceCountPerEndpoint` / `ScalingAction` / `E2EScalingLatency` | Fleet size, scaling events, and how long scaling takes. |
| Node | `node_memory_MemAvailable_bytes` / `node_cpu_seconds_total` / `node_filesystem_avail_bytes` | Instance-level CPU / memory / disk headroom. |
| Lifecycle | `ColdStartDuration` / `ModelDownloadTime` / `GPULoadTime` | Cold-start and model-load latency for new instances. |

> Note: `ModelLatencyPerIC` / `InvocationsPerIC` are available only as CloudWatch classic metrics; for an OTel-native latency signal use the framework metric `vllm:e2e_request_latency_seconds`.

###### Example PromQL queries

CloudWatch supports **PromQL** (Prometheus 3.0 spec) over these OTel metrics — in Query Studio and in PromQL-based alarms. Confirm exact label keys with label discovery (`/api/v1/labels`) in your account, and note the query limits (max 7-day range per query).

```promql
# Average GPU utilization (%) per endpoint
avg by (EndpointName) (DCGM_FI_DEV_GPU_UTIL)

# GPU framebuffer memory used ratio per instance — alert near 1.0 (OOM risk)
sum by (InstanceId) (DCGM_FI_DEV_FB_USED)
  / sum by (InstanceId) (DCGM_FI_DEV_FB_USED + DCGM_FI_DEV_FB_FREE)

# p99 Time-To-First-Token (seconds) per endpoint (vLLM/SGLang)
histogram_quantile(0.99, sum by (le, EndpointName) (rate(TTFT[5m])))

# Total output tokens/sec per endpoint
sum by (EndpointName) (OutputTokensPerSecond)

# KV-cache utilization (%) — high values cause request queuing
max by (EndpointName) (KVCacheUtilization)

# Server-side error rate per inference component
sum by (InferenceComponentName) (5XXErrorRatePerIC)

# Insufficient Capacity Errors (auto-scaling is blocked)
sum by (EndpointName) (ICECount)

# GPU thermal throttling risk — endpoints with any GPU above 85°C
max by (EndpointName) (DCGM_FI_DEV_GPU_TEMP) > 85
```

##### Additional notes

- **OpenTelemetry (OTEL) via the CloudWatch agent — custom inference metrics:** Instrument your model containers with the ADOT SDK to emit custom OTEL metrics (e.g., per-model-version latency, batch size distributions) into a custom CloudWatch namespace via the CloudWatch agent's OTLP endpoint. This supplements the built-in `AWS/SageMaker` namespace with application-level signals not available natively.
- **CloudWatch Application Signals:** If your SageMaker endpoints front a customer-facing application, enable Application Signals to get SLO burn-rate alarms in the `ApplicationSignals` namespace. This provides automatic latency/error SLOs without manual Metric Math expressions.
- **Anomaly detection for `ModelLatency` and `InvocationsPerInstance`:** Rather than static p99 thresholds (which require per-endpoint baselining), consider CloudWatch anomaly detection bands that adapt to each endpoint's traffic pattern — especially useful for endpoints with variable load profiles.
- **SageMaker Inference Components (multi-model endpoints):** For newer multi-model or inference-component deployments, metrics are additionally scoped per inference component. Ensure alarms are configured at the component level (dimension `InferenceComponentName`) to avoid masking per-model degradation behind aggregate endpoint metrics.


#### Lex V2

Amazon Lex V2 is a fully managed AI service for building conversational interfaces (chatbots and voice bots) into applications, contact centers, and IVR systems. General guidelines only — tailor thresholds to your environment.

| Business Objectives | AWS Service | Namespace | Metric name | Reactive/Proactive | Recommended alarm configuration | Use case |
|---|---|---|---|---|---|---|
| Customer Experience, Reliability | Amazon Lex V2 | `AWS/Lex` | `RuntimeSystemErrors` | Reactive | Statistic = Sum; Period = 60s; DatapointsToAlarm = 5; TreatMissingData = notBreaching | Counts 5xx server-side errors from Lex. Not caused by bot config — indicates a Lex service issue. |
| Customer Experience, Reliability | Amazon Lex V2 | `AWS/Lex` | `RuntimeThrottledEvents` | Proactive | Statistic = Sum; Period = 60s; DatapointsToAlarm = 5; TreatMissingData = notBreaching | Counts requests throttled by Lex due to exceeding TPS limit. Customers are actively being rejected from the IVR. |
| Customer Experience, Reliability | Amazon Lex V2 | `AWS/Lex` | `RuntimeConcurrency` | Proactive | Statistic = Maximum; Period = 60s; DatapointsToAlarm = 5; TreatMissingData = notBreaching | Measures concurrent active conversations. Defaults: 50 (text), 125 (voice RecognizeUtterance), 200 (voice StartConversation). |
| Customer Experience, Reliability | Amazon Lex V2 | `AWS/Lex` | `RuntimeLambdaErrors` | Reactive | Statistic = Sum; Period = 60s; DatapointsToAlarm = 5; TreatMissingData = notBreaching | Lambda fulfillment/validation errors. Bot can't complete data dips or fulfill intents. |
| Customer Experience, Reliability | Amazon Lex V2 | `AWS/Lex` | `RuntimeInvalidLambdaResponses` | Reactive | Statistic = Sum; Period = 60s; DatapointsToAlarm = 5; TreatMissingData = notBreaching | Lambda responses Lex couldn't parse. Indicates a code bug in Lambda response format. |
| Customer Experience, Reliability | Amazon Lex V2 | `AWS/Lex` | `RuntimePollyErrors` | Reactive | Statistic = Sum; Period = 60s; DatapointsToAlarm = 5; TreatMissingData = notBreaching | Polly TTS errors. Bot can't speak responses to voice callers — they hear silence. |
| Customer Experience | Amazon Lex V2 | `AWS/Lex` | `MissedUtteranceCount` | Proactive | Statistic = Sum; Period = 300s; DatapointsToAlarm = 3; TreatMissingData = notBreaching | Counts utterances the bot could not match to any intent. A sustained rise signals bot-quality degradation or new user intents not yet modeled. Check regional availability. |

##### Additional notes

- **Anomaly detection for throttling:** Consider using CloudWatch anomaly detection on `RuntimeThrottledEvents` and `RuntimeConcurrency` rather than static thresholds — conversational traffic can be highly seasonal (e.g., contact center call volumes spike around holidays or marketing events).
- **OpenTelemetry (OTEL) for fulfillment Lambdas:** Instrument your Lex fulfillment Lambda functions with the **ADOT SDK** (Lambda layer) or **CloudWatch Application Signals** to capture latency, error rate, and cold-start metrics. This provides end-to-end tracing from Lex → Lambda → downstream services, complementing the `RuntimeLambdaErrors` metric with root-cause context.
- **CloudWatch Application Signals:** If Lex fronts a customer-facing application (e.g., a contact center or web chatbot), Application Signals can provide SLO burn-rate alarms in the `ApplicationSignals` namespace, catching sustained conversation-quality degradation.
- **Lex V2 conversation analytics:** Since ~2023, Lex V2 offers built-in analytics with metrics like intent recognition confidence, slot elicitation success rate, and conversation path analysis. Combine these with CloudWatch alarms for proactive bot-quality monitoring.
- **Multi-channel and streaming considerations:** For voice bots using the streaming `StartConversation` API, monitor both `RuntimeConcurrency` against your account's streaming concurrency limit and the upstream Amazon Connect or telephony integration health. A Lex throttle event in a voice channel results in immediate caller impact (dropped call or silence).
- **Lambda response validation:** For `RuntimeInvalidLambdaResponses`, consider adding a pre-deployment contract-test step that validates Lambda response schemas against the Lex V2 expected format — catching format bugs before they reach production eliminates this class of runtime error entirely.


#### Amazon Connect

Amazon Connect is a cloud-based contact center service that enables organizations to deliver customer service at scale across voice, chat, and task channels. General guidelines only — tailor thresholds to your environment.

| Business Objectives | AWS Service | Namespace | Metric name | Reactive/Proactive | Recommended alarm configuration | Use case |
|---|---|---|---|---|---|---|
| Customer Experience, Reliability | Amazon Connect | `AWS/Connect` | `ConcurrentCalls` | Proactive | Statistic = Maximum; Period = 60 seconds; DatapointsToAlarm = 5; TreatMissingData = notBreaching | This metric measures the number of concurrent active voice calls in the instance. This is a good metric to monitor as you could set the threshold to trigger an alarm at around 80% - 85% of the maximum ConcurrentCalls in your instance. |
| Customer Experience, Reliability | Amazon Connect | `AWS/Connect` | `ConcurrentCallsPercentage` | Proactive | Statistic = Maximum; Period = 60 seconds; DatapointsToAlarm = 5; TreatMissingData = notBreaching | This metric measures the percentage of the concurrent active voice calls service quota used in the instance. This is a good metric to monitor, however the output is provided in a decimal format. With this in mind, you could set the threshold to trigger an alarm at around 0.8 - 0.85 which is 80% - 85% of the maximum ConcurrentCalls in your instance. |
| Customer Experience, Reliability | Amazon Connect | `AWS/Connect` | `ConcurrentActiveChats` | Proactive | Statistic = Maximum; Period = 60 seconds; DatapointsToAlarm = 5; TreatMissingData = notBreaching | This metric measures the number of concurrent active chats in the instance. This is a good metric to monitor as you could set the threshold to trigger an alarm at around 80% - 85% of the maximum ConcurrentActiveChats in your instance. Instances created on or before October 2018 require additional IAM permissions to publish chat metrics to CloudWatch. Required IAM permissions. |
| Customer Experience, Reliability | Amazon Connect | `AWS/Connect` | `ConcurrentActiveChatsPercentage` | Proactive | Statistic = Maximum; Period = 60 seconds; DatapointsToAlarm = 5; TreatMissingData = notBreaching | This metric measures the percentage of the concurrent active chats service quota used in the instance. The output is provided in an integer format. For example, 1% of chats is shown as 1, not as 0.01. This is a good metric to monitor as you could set the threshold to trigger an alarm at around 80% - 85% of the maximum ConcurrentActiveChatsPercentage in your instance. |
| Customer Experience, Reliability | Amazon Connect | `AWS/Connect` | `ConcurrentTasks` | Proactive | Statistic = Maximum; Period = 300 seconds; DatapointsToAlarm = 2; TreatMissingData = notBreaching | This metric measures the number of concurrent active tasks in the instance. This is a good metric to monitor as you could set the threshold to trigger an alarm at around 80% - 85% of the maximum ConcurrentTasks in your instance. |
| Customer Experience, Reliability | Amazon Connect | `AWS/Connect` | `ConcurrentTasksPercentage` | Proactive | Statistic = Maximum; Period = 300 seconds; DatapointsToAlarm = 2; TreatMissingData = notBreaching | This metric measures the percentage of the concurrent active tasks service quota used in the instance. The output is provided in an integer format. For example, 1% of tasks is shown as 1, not as 0.01. This is a good metric to monitor as you could set the threshold to trigger an alarm at around 80% - 85% of the maximum ConcurrentTasks in your instance. |
| Customer Experience, Reliability | Amazon Connect | `AWS/Connect` | `CallRecordingUploadError` | Reactive | Statistic = Sum; Period = 60 seconds; DatapointsToAlarm = 5; TreatMissingData = notBreaching | This metrics measures the number of call recordings that failed to upload to the Amazon S3 bucket configured for your instance. This is the bucket specified in Data Storage > Call Recordings settings for the instance. This is a good metric to monitor as it will be able to alert you to a problem in which call recordings are failing to be uploaded to Amazon S3. |
| Customer Experience, Reliability | Amazon Connect | `AWS/Connect` | `ContactFlowFatalErrors` | Reactive | Statistic = Sum; Period = 60 seconds; DatapointsToAlarm = 5; TreatMissingData = notBreaching | This metric measures the number of times a flow failed to execute due to a system error. This is a good metric to monitor as it will alert you to any system errors causing the contact flow to fail which may indicate a service issue with Amazon Connect. |
| Customer Experience, Reliability | Amazon Connect | `AWS/Connect` | `ConcurrentWebRTCConnections` | Proactive | Statistic = Maximum; Period = 60 seconds; DatapointsToAlarm = 5; TreatMissingData = notBreaching | Tracks concurrent WebRTC softphone connections in the Connect agent workspace. Alarm at 80–85% of your instance limit to detect soft-phone capacity exhaustion independently of PSTN concurrent calls. Check availability for your instance. |

##### Additional notes

- **CloudWatch Application Signals:** If Amazon Connect is fronting a customer-facing application (e.g., via a custom agent workspace or CCP embedded in a web app), consider enabling CloudWatch Application Signals for SLO burn-rate alarms in the `ApplicationSignals` namespace to track end-to-end latency and error rates experienced by agents.
- **Anomaly detection for concurrency metrics:** Rather than setting static 80–85% thresholds on `ConcurrentCalls` and `ConcurrentActiveChats`, consider CloudWatch anomaly-detection bands that adapt to your instance's time-of-day and day-of-week patterns — especially useful for contact centers with variable seasonal demand.
- **OpenTelemetry (OTEL) via the CloudWatch agent — custom agent telemetry:** If you instrument custom agent desktop applications or Lambda-backed integrations, CloudWatch agent can forward OTEL metrics (e.g., agent login latency, custom integration error rates) to CloudWatch under a custom namespace you define, complementing native `AWS/Connect` metrics.
- **Contact Lens analytics metrics:** Amazon Connect Contact Lens publishes real-time analytics. Consider monitoring sentiment-related metrics and creating Composite Alarms that combine capacity thresholds (ConcurrentCalls) with quality signals (ContactFlowFatalErrors) for a more nuanced alerting posture.
- **Service quota alarms via Service Quotas integration:** AWS Service Quotas now integrates with CloudWatch. Consider using the `AWS/Usage` namespace with `ServiceQuota` metrics for Amazon Connect to get quota-utilization alarms without manually calculating percentages.


### Media

#### Elemental Media Services

Recommended CloudWatch alarms for **AWS Elemental Media Services** (MediaLive, MediaPackage, MediaConvert) to detect customer-impacting incidents.

> General guidelines only — tailor thresholds to your environment.

| Business Objectives | AWS Service | Namespace | Metric name | Reactive/Proactive | Recommended alarm configuration | Use case |
|---|---|---|---|---|---|---|
| Customer Experience | AWS Elemental MediaLive | AWS/MediaLive | `SvqTime` | Reactive | Statistic = Maximum; Period = 60s; DatapointsToAlarm = 5; TreatMissingData = notBreaching | Percentage of time MediaLive reduced quality optimizations to emit output in real time. SVQ = speed vs quality; encoding balances real-time output against best possible quality — sometimes MediaLive must reduce quality to keep up. |
| Customer Experience, Reliability | AWS Elemental MediaLive | AWS/MediaLive | `Output5xxErrors` | Reactive | Statistic = Sum; Period = 60s; DatapointsToAlarm = 5; TreatMissingData = notBreaching | Number of 5xx HTTP errors received from the destination while delivering output. |
| Customer Experience, Reliability | AWS Elemental MediaPackage | AWS/MediaPackage | `EgressResponseTime` | Reactive | Statistic = Average; Period = 60s; DatapointsToAlarm = 5; TreatMissingData = notBreaching | Time MediaPackage takes to process each output request. No data if MediaPackage receives no output requests in the interval. |
| Customer Experience, Reliability | AWS Elemental MediaPackage | AWS/MediaPackage | `IngressResponseTime` | Reactive | Statistic = Average; Period = 60s; DatapointsToAlarm = 5; TreatMissingData = notBreaching | Time MediaPackage takes to process each input request. No data if MediaPackage receives no input requests in the interval. |
| Customer Experience, Reliability | AWS Elemental MediaPackage | AWS/MediaPackage | `StatusCodeRange` | Reactive | Statistic = Sum; Period = 60s; DatapointsToAlarm = 5; TreatMissingData = notBreaching | Metrics shown for the specified status-code range. Value: 2xx, 3xx, 4xx, or 5xx. |
| Reliability | AWS Elemental MediaConvert | AWS/MediaConvert | `JobsCanceledCount` | Proactive | Statistic = Sum; Period = 60s; DatapointsToAlarm = 5 out of 5; TreatMissingData = Breaching | Number of jobs canceled in a queue. A sudden increase could indicate an issue with job submissions or underlying infrastructure. |
| Reliability | AWS Elemental MediaConvert | AWS/MediaConvert | `JobsCompletedCount` | Proactive | Statistic = Sum; Period = 60s; DatapointsToAlarm = 5 out of 5; TreatMissingData = Breaching | Number of jobs completed in a queue. Missing data could indicate potential job-processing issues. |
| Reliability | AWS Elemental MediaConvert | AWS/MediaConvert | `JobsErroredCount` | Proactive | Statistic = Sum; Period = 60s; DatapointsToAlarm = 5 out of 5; TreatMissingData = Breaching | Number of jobs that failed due to invalid inputs (e.g., transcoding a file not in the specified input bucket). Alerts on errored jobs to address video-workflow issues. |
| Reliability, Latency | AWS Elemental MediaConvert | AWS/MediaConvert | `StandbyTime` | Proactive | Statistic = Average; Period = 60s; DatapointsToAlarm = 5 out of 5; TreatMissingData = notBreaching | Time (ms) a job spends waiting to be processed by MediaConvert. A long standby time could indicate infrastructure/application issues needing investigation to ensure timely completion. |
| Reliability, Latency | AWS Elemental MediaConvert | AWS/MediaConvert | `TranscodingTime` | Proactive | Statistic = Average; Period = 60s; DatapointsToAlarm = 5 out of 5; TreatMissingData = Breaching | Time (ms) for MediaConvert to complete transcoding. A sudden/sustained increase may signal performance bottlenecks affecting encoding jobs. |
| Reliability | AWS Elemental MediaConvert | AWS/MediaConvert | `Errors` | Reactive | Statistic = Sum; Period = 60s; DatapointsToAlarm = 5 out of 5; TreatMissingData = notBreaching | Errors encountered making a particular API call. Operations include: CreateJob, GetJob, ListJobs, ListPresets, ListQueues, ListTagsForResource, and Subscribe. |
| Customer Experience, Reliability | AWS Elemental MediaLive | AWS/MediaLive | `InputVideoFrameRate` | Reactive | Statistic = Average; Period = 60s; DatapointsToAlarm = 5; TreatMissingData = notBreaching | Current input video frame rate. A drop to zero or significant deviation from the expected rate indicates input loss on a live channel. |
| Reliability | AWS Elemental MediaLive | AWS/MediaLive | `PrimaryInputActive` | Reactive | Statistic = Minimum; Period = 60s; DatapointsToAlarm = 3; TreatMissingData = notBreaching | Indicates whether the primary input pipeline is active (1) or failed over (0). Alarm when value drops to 0 to detect input failover events on redundant channels. |
| Customer Experience, Reliability | AWS Elemental MediaLive | AWS/MediaLive | `FillMsec` | Reactive | Statistic = Maximum; Period = 60s; DatapointsToAlarm = 5; TreatMissingData = notBreaching | Duration (ms) of input buffer fill/gap content inserted. High values indicate input starvation — the channel is generating fill frames because the source is not delivering fast enough. Critical for live channels. |

##### Additional notes

- **Media Services Workflow Monitor:** AWS now offers a **Media Services Workflow Monitor** that auto-discovers a media pipeline (MediaLive → MediaPackage → CloudFront etc.), builds a signal map, and creates recommended CloudWatch alarms and events across the chain. Prefer it as the starting point to detect customer-impacting incidents over hand-built per-service alarms.
- **MediaPackage v2 (live):** If using **MediaPackage v2**, confirm the current namespace/metric names (they differ from the classic `AWS/MediaPackage`); alarm on egress request errors and origination latency.
- **OpenTelemetry (OTEL) via the CloudWatch agent:** Media Services emit native `AWS/Media*` metrics. Use the ADOT SDK (sending OTLP to the CloudWatch agent) on any custom control-plane/orchestration components (e.g., Lambda that submits MediaConvert jobs) to correlate `JobsErroredCount` spikes with the submitting workflow.
- **Anomaly detection:** `SvqTime`, response times, and `TranscodingTime` suit anomaly-detection bands to catch quality/latency regressions without static thresholds.


### IoT & Edge

#### IoT Core

Recommended CloudWatch alarms for **AWS IoT Core** to detect customer-impacting incidents. Several metrics use **metric-math ratios** (`m*`) to express a success/failure percentage.

> General guidelines only — tailor thresholds to your environment.

| Business Objectives | AWS Service | Namespace | Metric name | Reactive/Proactive | Recommended alarm configuration | Use case |
|---|---|---|---|---|---|---|
| Reliability | IoT Core | AWS/IoT | `(m1/(m1+m2))*100` where `m1 = Failure`, `m2 = Success` | Reactive | Statistic = Average; Period = 60s; DatapointsToAlarm = 5; TreatMissingData = Breaching | Monitors the overall success rate of IoT device operations, providing insight into the reliability and performance of the IoT system. |
| Reliability | IoT Core | AWS/IoT | `(m1/(m1+m2))*100` where `m1 = Connect.ServerError`, `m2 = Connect.Success` | Reactive | Statistic = Average; Period = 60s; DatapointsToAlarm = 5; TreatMissingData = Breaching | Helps identify and troubleshoot connection issues between IoT devices and the cloud service, ensuring reliable communication. |
| Reliability | IoT Core | AWS/IoT | `(m1/(m1+m2))*100` where `m1 = PublishIn.ServerError`, `m2 = PublishIn.Success` | Reactive | Statistic = Average; Period = 60s; DatapointsToAlarm = 5; TreatMissingData = Breaching | The `PublishIn.ServerError` metric tracks the number of server errors when IoT devices attempt to publish data/messages to the cloud service or IoT platform. |
| Reliability | IoT Core | AWS/IoT | `Connect.Throttle` | Reactive | Statistic = Sum; Period = 60s; DatapointsToAlarm = 5; TreatMissingData = notBreaching | Monitors the number of connection throttling events, which can indicate excessive connection attempts or potential issues with the IoT infrastructure. |
| Reliability | IoT Core | AWS/IoT | `Ping.Success` | Reactive | Statistic = Average; Period = 60s; DatapointsToAlarm = 5; TreatMissingData = Breaching | Measures the success rate of connectivity/reachability between IoT devices and the cloud service, helping ensure reliable communication and identify network issues. |
| Reliability | IoT Core | AWS/IoT | `(m1/(m1+m2))*100` where `m1 = Subscribe.ServerError`, `m2 = Subscribe.Success` | Reactive | Statistic = Average; Period = 60s; DatapointsToAlarm = 5; TreatMissingData = Breaching | Monitors the server-error rate for subscribe operations. A rising rate indicates devices cannot subscribe to topics, breaking downstream message delivery. |
| Reliability | IoT Core | AWS/IoT | `RuleMessageThrottled` | Reactive | Statistic = Sum; Period = 60s; DatapointsToAlarm = 5; TreatMissingData = notBreaching | Number of messages throttled by the Rules Engine. Indicates rule-evaluation capacity is exceeded, causing downstream delivery failures to actions (DynamoDB, Kinesis, Lambda, etc.). |
| Reliability | IoT Core | AWS/IoT | `RulesExecuted` | Proactive | Statistic = Sum; Period = 60s; DatapointsToAlarm = 5; TreatMissingData = notBreaching | Total rules executed. Use anomaly detection or a drop-to-zero alarm to detect rule-evaluation failures or traffic loss. |

##### Additional notes

- **Ratio alarms remain best practice:** The `(error/(error+success))*100` pattern is exactly the right modern approach for variable device fleets. Consider adding `PublishOut.ServerError`/`PublishOut.Success` ratios for full pub/sub coverage.
- **Device-side fleet health:** Add **AWS IoT Device Defender** detect metrics and **fleet indexing** signals for security/behavior anomalies (unexpected disconnects, message rate spikes) — a dimension the connectivity-focused table doesn't cover.
- **Rules Engine per-action errors:** Beyond `RuleMessageThrottled`, alarm on per-action error metrics (`ErrorActionExecution`, `TopicMatch`) to catch downstream delivery failures to specific targets (DynamoDB/Kinesis/Lambda).
- **OpenTelemetry (OTEL) via the CloudWatch agent:** IoT Core metrics are native `AWS/IoT`. For the backend that consumes device data (Lambda/Kinesis/containers), use the ADOT SDK with the CloudWatch agent to trace a message end-to-end and correlate `PublishIn.ServerError` with downstream saturation.
- **`TreatMissingData = Breaching` caution:** Several rows treat missing data as breaching — appropriate for always-on fleets where absence of data means a connectivity outage, but will false-alarm for intermittently connected devices; tune per fleet.


#### Outposts

AWS Outposts extends AWS infrastructure, services, and tools to on-premises facilities, providing a consistent hybrid experience for workloads that require low-latency access to local systems or local data processing. General guidelines only — tailor thresholds to your environment.

| Business Objectives | AWS Service | Namespace | Metric name | Alarming type | Recommended alarm configuration | Use case |
|---|---|---|---|---|---|---|
| Reliability | AWS Outposts | `AWS/Outposts` | `ConnectedStatus` | Reactive | Statistic = Average; Period = 60 seconds; DatapointsToAlarm = 5; TreatMissingData = Breaching | The ConnectedStatus metric monitors the status of the network connectivity between an Outpost and its associated services. It publishes a value of 1 when connectivity is healthy, and 0 when impaired. By applying an Average aggregator, we can configure an alarm threshold of < 1 to detect sustained connection failures. |
| Reliability | AWS Outposts | `AWS/Outposts` | `VifConnectionStatus` | Reactive | Statistic = Maximum; Period = 60 seconds; DatapointsToAlarm = 5; TreatMissingData = Breaching | This metric shows whether the virtual interfaces (VIFs) are ready to forward traffic. Unit: 1 or 0 where: 1 – Indicates that the Outpost VIF is successfully connected to on-premise devices, configured, and ready to forward traffic. 0 – Indicates that the Outpost VIF is not ready to forward traffic. |
| Reliability | AWS Outposts | `AWS/Outposts` | `VifBgpSessionState` | Reactive | Statistic = Maximum; Period = 60 seconds; DatapointsToAlarm = 5; TreatMissingData = Breaching | This metric monitors the Border Gateway Protocol (BGP) session state between the AWS Outposts of virtual interface (VIF) and on-premise devices. Unit: Values 1 through 6 where: 1 – Idle. This is the initial state where the Outposts rack is waiting for a start event. 2 – Connect. The Outposts rack is waiting for the TCP connection to be completed. 3 – Active. The Outposts rack is trying to initiate a TCP connection. 4 – OpenSent. The router has sent an OPEN message and is waiting for one in return. 5 – OpenConfirm. The router has received an OPEN message and is waiting for a KEEPALIVE message. 6 – Established. The BGP connection is fully established and the Outposts rack and on-premise devices can exchange routing information. Recommend setting the threshold to alarm if the state is less than 6 as the state will be only be established when it is at the value of 6. |
| Reliability | AWS Outposts | `AWS/Outposts` | `AvailableInstanceCapacity` | Proactive | Statistic = Average; Period = 300 seconds; DatapointsToAlarm = 3; TreatMissingData = Breaching | Remaining instance capacity on the Outpost. Alarm when low to proactively detect compute exhaustion before workloads fail to launch. Check availability for your Outpost configuration. |
| Reliability | AWS Outposts | `AWS/Outposts` | `UsedInstanceCapacity` | Proactive | Statistic = Average; Period = 300 seconds; DatapointsToAlarm = 3; TreatMissingData = Breaching | Instance capacity currently in use. Alarm at high utilization (e.g., 80–90%) to trigger proactive scaling or workload redistribution before capacity is fully exhausted. Check availability for your Outpost configuration. |

##### Additional notes

- **Anomaly detection for ConnectedStatus:** While a static threshold of less than 1 works for `ConnectedStatus`, consider using CloudWatch anomaly detection on the Average statistic to catch subtle intermittent connectivity degradation patterns (e.g., brief flaps) that a binary threshold might miss when averaged over a period.
- **OpenTelemetry (OTEL) via the CloudWatch agent — on-premises workloads:** Workloads running on Outposts can use the CloudWatch agent with its OTLP endpoint to emit custom OTEL metrics to CloudWatch under a namespace you define. This is particularly useful for monitoring application-layer health of services deployed on the Outpost rack itself, complementing the infrastructure-level `AWS/Outposts` metrics.
- **Composite Alarms for connectivity posture:** Combine `ConnectedStatus`, `VifConnectionStatus`, and `VifBgpSessionState` into a CloudWatch Composite Alarm that fires only when multiple connectivity signals degrade simultaneously, reducing alert noise from transient single-metric blips.
- **TreatMissingData = Breaching rationale:** The source correctly uses `Breaching` for all Outposts metrics. If the Outpost loses connectivity to the Region, CloudWatch will stop receiving data points — treating missing data as breaching ensures alarms fire during the exact failure scenario they are designed to detect.
- **Local CloudWatch agent buffering:** Since Outposts can experience connectivity interruptions to the Region, ensure the CloudWatch agent on local instances is configured with persistent disk-based buffering so that metrics are not lost during transient disconnects.


## Related

- [Alarms and Alerting](../cloudwatch-alarms-alerting/) — alarm design methodology (thresholds, composite alarms, routing, PromQL)
- [CloudWatch Metrics and EMF](../cloudwatch-metrics/) — the metrics that underpin these alarms
- [Recommended alarms for AWS services](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Best_Practice_Recommended_Alarms_AWS_Services.html) — AWS reference for per-service alarm recommendations
- [Query CloudWatch metrics with PromQL](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-PromQL.html)

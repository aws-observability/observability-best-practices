# Databricks Monitoring and Observability Best Practices in AWS

Databricks is a platform for managing data analytics and AI/ML workloads. This guide aim at supporting customers running [Databricks on AWS](https://aws.amazon.com/solutions/partners/databricks/) with monitoring these workloads using AWS Native services for observability or OpenSource Managed Services.

## Why monitor Databricks

Operation teams managing Databricks clusters benefit from having an integrated, customized dashboard to track workload status, errors, performance bottlenecks; alerting on unwanted behaviour, such as total resource usage over time, or percentual amount of errors; and centralized logging, for root cause analysis, as well as extracting additional customized metrics.

## What to monitor

Databricks run Apache Spark in its cluster instances, which has native features to expose metrics. These metrics will give information regarding drivers, workers, and the workloads being executed in the cluster.

The instances running Spark will have additional useful information about storage, CPU, memory, and networking. It´s important to understand what external factors could be affecting the performance of a Databricks cluster. In the case of clusters with numerous instances, understanding bottlenecks and general health is important as well.

## How to monitor

To install collectors and it's dependencies, Databricks init scripts will be needed. These are scripts that are runned in each instance of a Databricks cluster at boot time.

Databricks cluster permissions will also need permission to send metrics and logs using instance profiles.

Finally, it's a best practice to configure metrics namespace in Databricks cluster Spark configuration, replacing `testApp` with a proper reference to the cluster.

![Databricks Spark Config](../../images/databricks_spark_config.png)
*Figure 1: example of metrics namespace Spark configuration*

## Key parts of a good Observability solution for DataBricks

**1) Metrics:**: Metrics are numbers that describe activity or a particular process measured over a period of time. Here are different types of metrics on Databricks:

System resource-level metrics, such as CPU, memory, disk, and network.
Application Metrics using Custom Metrics Source, StreamingQueryListener, and QueryExecutionListener,
Spark Metrics exposed by MetricsSystem.

**2) Logs:** Logs are a representation of serial events that have happened, and they tell a linear story about them. Here are different types of logs on Databricks:

- Event logs
- Audit logs
- Driver logs: stdout, stderr, log4j custom logs (enable structured logging)
- Executor logs: stdout, stderr, log4j custom logs (enable structured logging)

**3) Traces:** Stack traces provide end-to-end visibility, and they show the entire flow through stages. This is useful when you must debug to identify which stages/codes cause errors/performance issues.

**4) Dashboards:** Dashboards provide a great summary view of an application/service’s golden metrics.

**5) Alerts:** Alerts notify engineers about conditions that require attention.

## AWS Native Observability options

Native solutions, such as Ganglia UI and Log Delivery, are great solutions for collecting system metrics and querying Apache Spark™ metrics. However, some areas can be improved:

- Ganglia doesn’t support alerts.
- Ganglia doesn’t support creating metrics derived from logs (e.g., ERROR log growth rate).
- You can’t use custom dashboards to track SLO (Service Level Objectives) and SLI (Service Level Indicators) related to data-correctness, data-freshness, or end-to-end latency, and then visualize them with ganglia.

[Amazon CloudWatch](https://aws.amazon.com/cloudwatch/) is a critical tool for monitoring and managing your Databricks clusters on AWS. It provides valuable insights into cluster performance and helps you identify and resolve issues quickly. Integrating Databricks with CloudWatch and enabling structured logging can help improve those areas. CloudWatch Application Insights can help you automatically discover the fields contained in the logs, and CloudWatch Logs Insights provides a purpose-built query language for faster debugging and analysis.

![Databricks With CloudWatch](../../images/databricks_cw_arch.png)

For more informaton on how to use CloudWatch to monitor Databricks, see:
[How to Monitor Databricks with Amazon CloudWatch](https://aws.amazon.com/blogs/mt/how-to-monitor-databricks-with-amazon-cloudwatch/)

## Open-source software observability options

###TODO:###
- Add an architecture diagram
- Provide a high level brief overview of the solution

[Amazon Managed Service for Prometheus](https://aws.amazon.com/prometheus/) is a Prometheus-compatible monitoring managed, serverless service, that will be responsible for storing metrics, and managing alerts created on top of these metrics. Prometheus is a popular open source monitoring technology, being the second project belonging to the Cloud Native Computing Foundation, right after Kubernetes.

[Amazon Managed Grafana](https://aws.amazon.com/grafana/) is a managed service for Grafana. Grafana is an open source technology for time-series data visualization, commonly used for observability. We can use Grafana to visualize data from several sources, such as Amazon Managed Service for Prometheus, Amazon CloudWatch, and many others. It will be used to visualize Databricks metrics and alerts.

[AWS Distro for OpenTelemetry](https://aws-otel.github.io/) is the AWS-supported distribution of OpenTelemetry project, which provides open source standards, libraries, and services for collecting traces and metrics. Through OpenTelemetry, we can collect several different observability data formats, such as Prometheus or StatsD, enrich this data, and send it to several destinations, such as CloudWatch or Amazon Managed Service for Prometheus.

### Use cases

While AWS Native services will deliver the observability needed to manage Databricks clusters, there are some scenarios where using Open Source managed services is the best choice.
Both Prometheus and Grafana are very popular technologies, and are already being used in many companies. AWS Open Source services for observability will allow operations teams to use the same existing infrastructure, the same query language, and existing dashboards and alerts to monitor Databricks workloads, without the heavy lifting of managing these services infrastructure, scalability, and performance.
ADOT is the best alternative for teams that need to send metrics and traces to different destinations, such as CloudWatch and Prometheus, or work with different types of data sources, such as OTLP and StatsD.
Finally, Amazon Managed Grafana supports many different Data Sources, including CloudWatch and Prometheus, and help correlate data for teams that decide on using more than one tool, allowing for the creation of templates that will enable observability for all Databricks Clusters, and a powerful API that allow its provisioning and configuration through Infrastructure as Code.

### Architecture Overview

![Databricks OpenSource Observability Diagram](../../images/databricks_oss_diagram.png)

### Procedure

Before start configuring Databricks, Amazon Managed Services for Prometheus (AMP) workspace and Amazon Managed Grafana (Amazon Managed Grafana) workspace should be provisioned, with the AMP datasource configured in Amazon Managed Grafana.

- [Create AMP workspace](https://docs.aws.amazon.com/prometheus/latest/userguide/AMP-onboard-create-workspace.html)
- [Create Amazon Managed Grafana workspace](https://docs.aws.amazon.com/grafana/latest/userguide/Amazon Managed Grafana-create-workspace.html)
- [Configure AMP datasource](https://docs.aws.amazon.com/grafana/latest/userguide/prometheus-data-source.html)


Create an S3 bucket to store the init script that will install ADOT Collector and it's dependencies.

Create an IAM Role granting permission for Databricks cluster instances to remote write metrics into AMP, and read access to the init script's S3 bucket. For AMP permissions, you can attach the AmazonPrometheusRemoteWriteAccess managed policy. Configure this role's instance profile first in Databricks workspace, then into the Databricks cluster.

- [Create IAM role](https://repost.aws/knowledge-center/ec2-instance-access-s3-bucket)
- [Attach a managed policy to an IAM role](https://docs.aws.amazon.com/IAM/latest/UserGuide/access_policies_manage-attach-detach.html#add-policies-console)

![Add instance profile into Databricks workspace](../../images/databricks_iam_workspace_config.png)
*Figure 2: example of Instance Profile configuration in Databricks workspace*

![Add instance profile into Databricks cluster](../../images/databricks_iam_cluster_config.png)
*Figure 3: example of Instance Profile configuration in Databricks cluster*

Finally, grant Databricks the right to assume the IAM Role you just created. You need to attach a policy similar to the one below to the IAM Role used to deploy the workspace. Mind that this is a different IAM Role from the one created for Databricks instances; it was either created at the time the workspace was created, or already existed prior to that.

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": "iam:PassRole",
      "Resource": "arn:aws:iam::<AWS_ACCOUNT_ID>:role/DatabricksAMPRole"
    }
  ]
}
```

Create a configuration for ADOT and upload it to the S3 bucket. Here follows an example:

```yaml
receivers:
  prometheus:
    config:
      global:

      scrape_configs:
      
      - job_name: databricks_prometheus
        metrics_path: /metrics/prometheus/
        sample_limit: 10000
        static_configs:
        - targets:
          - ${env:SPARK_LOCAL_IP:40000}

      - job_name: databricks_node
        sample_limit: 10000
        static_configs:
        - targets:
          - ${env:SPARK_LOCAL_IP:9100}

extensions:
  sigv4auth:
    service: "aps"
    region: "${env:AMP_REGION}"

exporters:
  prometheusremotewrite:
    endpoint: "${env:AMP_REMOTE_WRITE_ENDPOINT}"
    auth:
      authenticator: sigv4auth

service:
  pipelines:
    metrics:
      receivers: [prometheus]
      exporters: [prometheusremotewrite]

  extensions: [sigv4auth]

```

Create an init script to install ADOT and it's dependencies, and add some additional configurations to Spark monitoring. Upload the script to the S3 bucket, and configure this init script into the Databricks cluster. Here follows an example:

```bash
#!/bin/bash
set -e

cat << EOF > /databricks/spark/conf/metrics.properties
*.sink.prometheusServlet.class=org.apache.spark.metrics.sink.PrometheusServlet
*.sink.prometheusServlet.path=/metrics/prometheus
master.sink.prometheusServlet.path=/metrics/master/prometheus
applications.sink.prometheusServlet.path=/metrics/applications/prometheus
EOF

cp /databricks/spark/conf/metrics.properties \
  /databricks/spark/dbconf/log4j/master-worker/metrics.properties
sudo pip3 install awscli
aws s3 cp s3://$ADOT_INIT_SCRIPT_BUCKET/$ADOT_CONFIG adot_config.yaml
wget https://aws-otel-collector.s3.amazonaws.com/ubuntu/amd64/v0.25.0/aws-otel-collector.deb
sudo dpkg -i aws-otel-collector.deb
wget https://github.com/prometheus/node_exporter/releases/download/v1.5.0/node_exporter-1.5.0.linux-amd64.tar.gz
tar zxvf node_exporter-1.5.0.linux-amd64.tar.gz
nohup ./node_exporter-1.5.0.linux-amd64/node_exporter &
disown -h
export SPARK_LOCAL_IP=`/sbin/ip -o -4 addr list eth0 | awk '{print $4}' | cut -d/ -f1`
sudo /opt/aws/aws-otel-collector/bin/aws-otel-collector-ctl -c adot_config.yaml -a start
```

Enable native Spark support for Prometheus. Note that it is available only from Spark 3.0. To do that, you need to add the following configuration to Spark via Databricks cluster Advanced Configurations:

```
spark.ui.prometheus.enabled true
```

Add the following environment variables into Databricks cluster configuration, as it will be needed for AWS Distro for OpenTelemetry (ADOT) Collector later:

```bash
AMP_REMOTE_WRITE_ENDPOINT="<AMP_ENDPOINT>/api/v1/remote_write"
AMP_REGION="<AMP_REGION>"
ADOT_INIT_SCRIPT_BUCKET="<S3_BUCKET>"
ADOT_CONFIG="adot_config.yaml"
```

If the cluster is running, it will be restarted. The next time it runs, it will send Spark and instance metrics to AMP.

## Do's and dont's

### Prioritize valuable metrics

Spark and node_exporter both expose several metrics, and several formats for the same metrics. Without filtering which metrics are useful for monitoring and incident response, the mean time to detect problems increase, costs with storing samples increase, valuable information will be harder to be found and understood. Using OpenTelemetry processors, it is possible to filter and keep only valuable metrics, or filter out metrics that doesn't make sense; aggregate and calculate metrics before sending them to AMP.

### Avoid alerting fatigue

Once valuable metrics are being ingested into AMP, it's essential to configure alerts. However, alerting on every resource usage burst may cause alerting fatigue, that is when too much noise will decrease the confidence in alerts severity, and leave important events undetected. AMP alerting rules group feature should be use to avoid ambiqguity, i.e., several connected alerts generating separated notifications. Also, alerts should receive the proper severity, and it should reflect business priorities.

### Reuse Amazon Managed Grafana dashboards

Amazon Managed Grafana leverages Grafana native templating feature, which allow the creation for dashboards for all existing and new Databricks clusters. It removes the need of manually creating and keeping visualizations for each cluster. To use this feature, its important to have the correct labels in the metrics to group these metrics per cluster. Once again, it's possible with OpenTelemetry processors.

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

## AWS Native

Check out the following recipe:
- [How to Monitor Databricks with Amazon CloudWatch](https://aws.amazon.com/blogs/mt/how-to-monitor-databricks-with-amazon-cloudwatch/)

## Open Source Software




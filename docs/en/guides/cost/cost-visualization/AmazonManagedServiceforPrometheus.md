# Amazon Managed Service for Prometheus: Metrics ingestion rate real-time cost monitoring  

AWS Cost and Usage Reports (CUR) contains the most comprehensive set of cost and usage data available and is updated with your cost data at least once every 24 hours. Each report contains line items for each AWS service like Amazon Managed Service for Prometheus. 

Amazon Managed Service for Prometheus is a server-less, Prometheus-compatible monitoring service for container metrics that makes it easier to securely monitor container environments at scale. Amazon Managed Service for Prometheus pricing model is based on Metric samples ingested, Query samples processed, and Metrics stored. You can find the latest pricing details [here][pricing]. 

As a managed service, Amazon Managed Service for Prometheus automatically scales the ingestion, storage, and querying of operational metrics as workloads scale up and down. Some of our customers asked us guidance on how to track `metric samples ingestion rate` real-time and track its cost real-time. Let's explore how you can achieve that.

### Solution
Amazon Managed Service for Prometheus [vends usage metrics][vendedmetrics] to Amazon CloudWatch. These metrics can be used to help you gain better visibility into your Amazon Managed Service for Prometheus workspace. The vended metrics can be found in the `AWS/Usage` and `AWS/Prometheus` namespaces in CloudWatch and these [metrics][AMPMetrics] are available in CloudWatch for no additional charge. You can always create a CloudWatch dashboard to further explore and visualize these metrics.

Today, you will be using Amazon CloudWatch as a data-source for Amazon Managed Grafana and build dashboards in Grafana to visualize those metrics. The architecture diagram illustrates the following.  

- Amazon Managed Service for Prometheus publishing vended metrics to Amazon CloudWatch  

- Amazon CloudWatch as a data-source for Amazon Managed Grafana  

- Users accessing the dashboards created in Amazon Managed Grafana

![prometheus-ingestion-rate](../../../images/ampmetricsingestionrate.png)

### Amazon Managed Grafana Dashboards

The dashboard created in Amazon Managed Grafana will enable you to visualize;  

1. Prometheus Ingestion Rate per workspace  
![prometheus-ingestion-rate-dash1](../../../images/ampwsingestionrate-1.png)  

2. Prometheus Ingestion Rate and Real-time Cost per workspace  
   For real-time cost tracking, you will be using a `math expression` based on the pricing of `Metrics Ingested Tier` for the `First 2 billion samples` mentioned in the official [AWS pricing document][pricing]. Math operations take numbers and time series as input and change them to different numbers and time series and refer this [document][mathexpression] for further customization to fit your business requirements.  
![prometheus-ingestion-rate-dash2](../../../images/ampwsingestionrate-2.png)  

3. Prometheus Active Series per workspace  
![prometheus-ingestion-rate-dash3](../../../images/ampwsingestionrate-3.png)


A dashboard in Grafana is represented by a JSON object, which stores metadata of its dashboard. Dashboard metadata includes dashboard properties, metadata from panels, template variables, panel queries, etc.  

You can access the **JSON template** of the above dashboard <mark>[here](AmazonPrometheusMetrics.json).<mark>

With the preceding dashboard, you can now identify ingestion rate per workspace and monitor real-time cost per workspace based on the metrics ingestion rate for Amazon Managed Service for Prometheus. You can use other Grafana [dashboard panels][panels] to build visuals to suit your requirements.

[pricing]: https://aws.amazon.com/prometheus/pricing/
[AMPMetrics]: https://docs.aws.amazon.com/prometheus/latest/userguide/AMP-CW-usage-metrics.html
[vendedmetrics]: https://aws.amazon.com/blogs/mt/introducing-vended-metrics-for-amazon-managed-service-for-prometheus/
[mathexpression]: https://grafana.com/docs/grafana/latest/panels-visualizations/query-transform-data/expression-queries/#math
[panels]: https://docs.aws.amazon.com/grafana/latest/userguide/Grafana-panels.html
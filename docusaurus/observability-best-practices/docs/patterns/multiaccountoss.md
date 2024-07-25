# Cross account monitoring with AWS Open source service

## Introduction

Modern cloud environments often span multiple accounts and include on-premises infrastructure, creating complex monitoring challenges. To address these challenges, a sophisticated monitoring architecture can be implemented using AWS services and industry-standard tools. This architecture enables comprehensive visibility across diverse environments, facilitating efficient management and quick issue resolution.

## Core Components

At the heart of this monitoring solution is AWS Distro for OpenTelemetry (ADOT), which serves as a centralized collection point for metrics from various sources. ADOT is deployed in a dedicated central AWS account, forming the hub of the monitoring infrastructure. This central deployment allows for streamlined data aggregation and processing.

Amazon Managed Service for Prometheus is another crucial component, providing a scalable and managed time-series database for storing the collected metrics. This service eliminates the need for self-managed Prometheus instances, reducing operational overhead and ensuring high availability of metric data.

For visualization and analysis, Grafana is integrated into the architecture. Grafana connects to the Amazon Managed Service for Prometheus, offering powerful querying capabilities and customizable dashboards. This allows teams to create insightful visualizations and set up alerting based on the collected metrics.

![multiaccount AMP](./images/multiaccountoss.png)
*Figure 1: Multi account monitoring with AWS Open source services*

## Data Collection and Flow

The architecture supports data collection from multiple AWS accounts, referred to as monitored accounts. These accounts use the OpenTelemetry Protocol (OTLP) to export their metrics to the central ADOT instance. This standardized approach ensures consistency in data format and facilitates easy integration of new accounts into the monitoring setup.

On-premises infrastructure is also incorporated into this monitoring solution. These systems send their metrics data to the central ADOT instance using secure HTTPS POST requests. This method allows for the inclusion of legacy or non-cloud systems in the overall monitoring strategy, providing a truly comprehensive view of the entire IT environment.

Once the data reaches the central ADOT instance, it is processed and forwarded to the Amazon Managed Service for Prometheus using the Prometheus remote write protocol. This step ensures that all collected metrics are stored in a format optimized for time-series data, enabling efficient querying and analysis.

## Benefits and Considerations

This architecture offers several key benefits. It provides a centralized view of metrics from diverse sources, enabling holistic monitoring of complex environments. The use of managed services reduces the operational burden on teams, allowing them to focus on analysis rather than infrastructure maintenance. Additionally, the architecture is highly scalable, capable of accommodating growth in both the number of monitored systems and the volume of metrics collected.

However, implementing this architecture also comes with considerations. The centralized nature of the solution means that the monitoring infrastructure in the central account becomes critical, requiring careful planning for high availability and disaster recovery. There may also be cost implications associated with data transfer between accounts and the usage of managed services, which should be factored into budgeting decisions.

Security is another important aspect to consider. Proper IAM roles and permissions must be set up to allow secure cross-account metric collection. For on-premises systems, ensuring secure and authenticated HTTPS connections is crucial to maintain the integrity and confidentiality of the monitoring data.

## Conclusion

This advanced AWS cloud monitoring architecture provides a robust solution for organizations with complex, multi-account, and hybrid infrastructure environments. By leveraging AWS managed services and industry-standard tools like OpenTelemetry and Grafana, it offers a scalable and powerful monitoring solution. While it requires careful planning and management to implement effectively, the benefits of comprehensive visibility and centralized monitoring make it a valuable approach for modern cloud-native and hybrid environments.

The flexibility of this architecture allows it to adapt to various organizational needs and can evolve as monitoring requirements change. As cloud environments continue to grow in complexity, having such a centralized and comprehensive monitoring solution becomes increasingly critical for maintaining operational excellence and ensuring optimal performance across all infrastructure components.
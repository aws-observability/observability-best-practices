# Internet Monitor

:::warning
	截至撰写本文时，[Internet Monitor](https://aws.amazon.com/blogs/aws/cloudwatch-internet-monitor-end-to-end-visibility-into-internet-performance-for-your-applications/) 在 CloudWatch 控制台中以**预览**形式提供。正式发布的功能范围可能与您今天体验的不同。
:::
[从工作负载的所有层收集遥测数据](../guides/index.md#collect-telemetry-from-all-tiers-of-your-workload)是最佳实践，也可能是一个挑战。但您的工作负载有哪些层？对于某些人来说，可能是 Web、应用程序和数据库服务器。其他人可能将工作负载视为前端和后端。运营 Web 应用程序的人可以使用 [Real User Monitoring](./rum.md)(RUM) 来观察最终用户体验的这些应用程序的健康状况。

但客户端和数据中心或云服务提供商之间的流量呢？以及那些不作为网页提供因此无法使用 RUM 的应用程序呢？

![来自经过互联网的应用程序的网络遥测](../images/internet_monitor.png)

Internet Monitor 在网络层工作，评估观察到的流量的健康状况，并与 [AWS 现有的已知互联网问题知识](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-IM-inside-internet-monitor.html)进行关联。简而言之，如果互联网服务提供商 (ISP) 存在性能或可用性问题，**并且**如果您的应用程序有使用该 ISP 进行客户端/服务器通信的流量，则 Internet Monitor 可以主动通知您该问题对工作负载的影响。此外，它可以根据您选择的托管区域和 [CloudFront](https://aws.amazon.com/cloudfront/) 作为内容分发网络的使用情况向您提出建议[^1]。

:::tip
	Internet Monitor 仅评估您的工作负载经过的网络的流量。例如，如果另一个国家的 ISP 受到影响，但您的用户不使用该运营商，则您将无法看到该问题。
:::

## 为经过互联网的应用程序创建监控器

Internet Monitor 的运作方式是监视从受影响的 ISP 进入您的 CloudFront 分配或进入您的 VPC 的流量。这使您可以对应用程序行为、路由或用户通知做出决策，帮助抵消因超出您控制范围的网络问题而产生的业务问题。

![您的工作负载与 ISP 问题的交集](../images/internet_monitor_2.png)

:::info
	仅为经过互联网的流量创建监控器。私有流量，例如私有网络中两台主机之间的流量 ([RFC1918](https://www.arin.net/reference/research/statistics/address_filters/))，无法使用 Internet Monitor 进行监控。
:::
:::info
	在适用的情况下，优先考虑来自移动应用程序的流量。在提供商之间漫游或位于偏远地理位置的客户可能有不同或意外的体验，您应该了解这些情况。
:::
## 通过 EventBridge 和 CloudWatch 启用操作

观察到的问题将通过 [EventBridge](https://aws.amazon.com/eventbridge/) 使用包含标识为 `aws.internetmonitor` 的来源的 [schema](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-IM-EventBridge-integration.html) 发布。EventBridge 可用于在您的工单管理系统中自动创建工单、通知您的支持团队，甚至触发可以更改工作负载以缓解某些场景的自动化。

```json
{
  "source": ["aws.internetmonitor"]
}
```

同样，[CloudWatch Logs](./logs/index.md) 中提供了观察到的城市、国家、都市区和行政区划流量的详细信息。这允许您创建高度针对性的操作，主动通知受影响的客户关于本地问题。以下是关于单个提供商的国家级别观察示例：

```json
{
    "version": 1,
    "timestamp": 1669659900,
    "clientLocation": {
        "latitude": 0,
        "longitude": 0,
        "country": "United States",
        "subdivision": "",
        "metro": "",
        "city": "",
        "countryCode": "US",
        "subdivisionCode": "",
        "asn": 00000,
        "networkName": "MY-AWESOME-ASN"
    },
    "serviceLocation": "us-east-1",
    "percentageOfTotalTraffic": 0.36,
    "bytesIn": 23,
    "bytesOut": 0,
    "clientConnectionCount": 0,
    "internetHealth": {
        "availability": {
            "experienceScore": 100,
            "percentageOfTotalTrafficImpacted": 0,
            "percentageOfClientLocationImpacted": 0
        },
        "performance": {
            "experienceScore": 100,
            "percentageOfTotalTrafficImpacted": 0,
            "percentageOfClientLocationImpacted": 0,
            "roundTripTime": {
                "p50": 71,
                "p90": 72,
                "p95": 73
            }
        }
    },
    "trafficInsights": {
        "timeToFirstByte": {
            "currentExperience": {
                "serviceName": "VPC",
                "serviceLocation": "us-east-1",
                "value": 48
            },
            "ec2": {
                "serviceName": "EC2",
                "serviceLocation": "us-east-1",
                "value": 48
            }
        }
    }
}
```

:::info
	`percentageOfTotalTraffic` 等值可以揭示关于客户从何处访问您工作负载的强大洞察，并可用于高级分析。
:::

:::warning
	请注意，Internet Monitor 创建的日志组的默认保留期设置为*永不过期*。AWS 不会在未经您同意的情况下删除您的数据，因此请确保设置适合您需求的保留期。
:::
:::info
	每个监控器将至少创建 10 个独立的 CloudWatch metrics。这些应该像任何其他运营 metric 一样用于创建[告警](./alarms.md)。
:::
## 利用流量优化建议

Internet Monitor 具有流量优化建议功能，可以建议您在哪里最佳放置工作负载以获得最佳客户体验。对于全球性工作负载或拥有全球客户的工作负载，此功能特别有价值。

![Internet Monitor 控制台](../images/internet_monitor_3.png)

:::info
	密切关注流量优化建议视图中的当前、预测和最低首字节时间 (TTFB) 值，因为这些值可能表明潜在的糟糕最终用户体验，而这些体验在其他方面很难观察到。
:::
[^1]: 请参阅 [https://aws.amazon.com/blogs/aws/cloudwatch-internet-monitor-end-to-end-visibility-into-internet-performance-for-your-applications/](https://aws.amazon.com/blogs/aws/cloudwatch-internet-monitor-end-to-end-visibility-into-internet-performance-for-your-applications/) 了解关于此新功能的发布博客。

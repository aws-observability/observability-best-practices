# What is Network Flow Monitor?

Network Flow Monitor is a feature of Amazon CloudWatch Network Monitoring that provides near real-time visibility into network performance between your AWS workloads. It uses lightweight agents installed on your compute resources (Amazon EC2 and Amazon EKS) to collect TCP performance metrics from actual workload traffic — giving you insights into packet loss, latency, and retransmissions without injecting synthetic traffic.

Unlike active monitoring solutions that send probe packets, Network Flow Monitor performs ongoing passive monitoring by analyzing real user traffic between workloads. The agents don't have access to TCP payload data — they only receive the `bpf_sock_ops` structure from the Linux kernel, which provides IP addresses, TCP ports, counters, and round-trip times.


## How It Works

1. **Install Agents** on your EC2 or EKS instances — they silently collect TCP performance data from real traffic and send aggregated metrics to the backend every ~30 seconds.

2. **Review Workload Insights** — once agents are running (wait ~10 minutes for data), the console shows you which flows have the most traffic, highest latency, or most packet loss. This helps you identify problem areas.

3. **Create a Monitor** — pick the specific flows you care about (e.g., VPC-A to VPC-B). You'll get ongoing metrics, historical trends, and the Network Health Indicator (NHI) to tell you if AWS network is the problem.

We will look at each step in detail:


## 1: Agent Architecture & Installation

The Network Flow Monitor agent is a lightweight software application with two components:

- **eBPF Program:** Registered within the Linux kernel using extended Berkeley Packet Filter (eBPF). Receives events related to TCP connections raised by the kernel.
- **Aggregator:** Collects statistics from the eBPF portion and sends aggregated metrics to the Network Flow Monitor backend every ~30 seconds (25–35 seconds with jitter).

Agents use the Network Flow Monitor Publish API to send metrics to the backend server. You can also establish a private connection between your VPC and agents using AWS PrivateLink.

### Two Methods for Agent Installation

**Method 1: AWS Systems Manager (Recommended)**

1. Attach `CloudWatchNetworkFlowMonitorAgentPublishPolicy` to instance roles
2. Open Systems Manager Console → Node Tools → Distributor
3. Locate: `AmazonCloudWatchNetworkFlowMonitorAgent`
4. Choose "Install one time" or "Install on schedule"
5. Select target instances (by name, tag, or resource group)
6. Choose "Run"

**Method 2: YUM Command (Manual)**

```bash
sudo yum install network-flow-monitor-agent
service network-flow-monitor status
```

:::tip
Install agents on both sides of the communication path for the most accurate performance data. At minimum, install agents on the source instances generating the traffic you want to monitor.
:::


## 2: Workload Insights

Before creating monitors, use Workload Insights to understand your traffic patterns:

- **Data Transferred** — Top contributors
- **Retransmission Timeouts** — Top contributors
- **Retransmissions** — Top contributors

Top contributors are network flows with the highest values for each metric type. Use this view to identify which flows deserve a dedicated monitor.

![Workload Insights: Data Transferred]


## 3: Monitor Setup

### 3.a: Local Resources

Define the sources you want to monitor. Local Resources = "Which agents do you want this monitor to pay attention to?"

| Option | What it means |
|--------|---------------|
| Everywhere in Region | Use data from ALL agents across all VPCs/subnets |
| Specific resources | Use data from agents in the exact VPC, subnet, AZ, or EKS cluster you pick |

**Example:**
- Local = "Everywhere in us-east-1" → Use data from agents in Subnet A + B + C (all of them)
- Local = "VPC-1" → Use data from agents in VPC-1 only

### 3.b: Remote Resources

Define the destinations. Remote Resources = "Where is that traffic going? It's a filter on the destination."

| Option | What it shows | When to use |
|--------|---------------|-------------|
| Everywhere | All destinations in the Region | Discovery / broad monitoring |
| Specific resources | Only the VPCs/subnets/services you pick | Targeted monitoring of known flows |
| Remote Region | Traffic to another Region's edge only | Cross-Region performance |

:::info
After creating a monitor, wait up to 30 minutes for Network Flow Monitor to begin collecting and aggregating data.
:::


## What You See After Monitor Setup

### 1) Overview

| Metric | What It Shows |
|--------|---------------|
| Network Health Indicator (NHI) | Whether AWS infrastructure caused degradation (0=healthy, 1=degraded) |
| Data Transferred | Total bytes transferred for monitored flows |
| TCP Retransmissions | Number of retransmitted packets (indicates packet loss) |
| Retransmission Timeouts | Number of timeout events (indicates severe congestion) |
| Round-Trip Time (RTT) | Network latency between endpoints (in microseconds, can be sparse) |

:::tip
NHI determines whether AWS infrastructure caused the degradation. This helps you decide: troubleshoot your workload, or escalate to AWS?
:::

### 2) Historical Explorer

Drill into historical performance with corresponding network path for each metric. The topology view displays all components in the network path with service icons and resource IDs during degradation — helping you pinpoint which network segment is causing issues.

### 3) Monitor Details

Detailed view of the specific flows and resources within your monitor configuration.


## Use Cases

- **Network Performance Baselining:** Establish baseline RTT and retransmission rates for your workloads. Understand what "normal" looks like so you can quickly detect degradation.
- **Latency Troubleshooting:** When applications experience high latency, use the NHI to determine whether the issue is in the AWS network or in your workloads — without opening a support case.
- **Cross-AZ and Cross-VPC Performance Monitoring:** Visualize performance between Availability Zones and VPCs to identify network bottlenecks and validate Transit Gateway or VPC Peering performance.
- **Application Performance Correlation:** Correlate network metrics (RTT, packet loss) with application performance issues to confirm or rule out network as the root cause.


## When to Use It

Network Flow Monitor is most valuable in the following scenarios:

- **Ongoing Performance Monitoring:** For production workloads where you need continuous visibility into network performance between compute resources and AWS services.
- **Incident Response — Network Attribution:** During performance incidents, to quickly determine whether the AWS network is contributing to the problem. The NHI provides independent validation.
- **Multi-VPC / Transit Gateway Architectures:** When traffic flows through complex architectures (TGW, VPC Peering, multiple AZs), to identify which network segment is introducing latency.
- **Microservices and Distributed Applications:** For applications with many service-to-service calls where network performance directly impacts user experience.
- **SLA Validation:** To track whether network performance meets your internal SLAs or to validate AWS network behavior during an SLA credit request.
- **Pre/Post Migration Comparison:** Before and after migrating workloads between subnets, AZs, or VPCs, to compare network performance.


## Key Considerations

:::info
Network Flow Monitor operates within a single AWS Region. For cross-Region traffic, it can monitor performance up to the remote Region's edge, but cannot provide end-to-end visibility into the destination Region. For full cross-Region or internet-facing performance monitoring, consider CloudWatch Internet Monitor or CloudWatch Network Synthetic Monitor.
:::

- **TCP Only:** Tracks TCP-based traffic only. UDP, ICMP, and other protocols are not monitored.
- **Agent Required:** Must install agents on EC2 or EKS nodes. No agentless option. Linux kernel 5.8+ required.
- **Passive Monitoring:** Analyzes actual workload traffic — no metrics without traffic.
- **Scale Limits:** Supports ~5 million flows per minute (~5,000 instances with agents). Beyond this may affect performance.
- **Multi-Account Support:** Works with AWS Organizations for cross-account visibility (up to 100 accounts in scope).
- **NHI Limitations:** Not all flow types receive NHI coverage. Internet-bound, Transit Gateway, Local Zone, and unclassified flows do not get NHI attribution.
- **Complementary Tools:**
    - VPC Flow Logs — who talked to whom (connection metadata)
    - VPC Reachability Analyzer — can A reach B? (config analysis)
    - Network Access Analyzer — what unintended paths exist? (security)
    - CloudWatch Internet Monitor — internet-facing app performance
    - CloudWatch Network Synthetic Monitor — active probing with synthetic traffic

:::tip
Use Network Flow Monitor and VPC Flow Logs together for complete visibility. Flow Logs tell you WHAT traffic is flowing (source, destination, accept/reject). Network Flow Monitor tells you HOW WELL that traffic is performing (latency, packet loss, retransmissions).
:::


## CloudWatch Metrics Collected

Network Flow Monitor publishes the following metrics to the CloudWatch namespace: `AWS/NetworkFlowMonitor`

1. **DataTransferred** — Number of bytes transferred for all flows in a monitor.
2. **Retransmissions** — Total retransmitted packets (occurs when sender resends damaged or lost packets).
3. **Timeouts** — Total retransmission timeouts (occurs when sender is missing too many ACKs and stops sending).
4. **RoundTripTime** — Average RTT in microseconds. Note: RTT data can be sparse as this metric is not always calculated.
5. **HealthIndicator (NHI)** — Network Health Indicator. 1 = degraded, 0 = healthy.

You can create CloudWatch Alarms on any of these metrics for proactive alerting.


## Network Flow Classifications

Network Flow Monitor categorizes flows into classifications. Only certain flow types contribute to the Network Health Indicator (NHI):

| Classification | Example | NHI Coverage |
|---------------|---------|:------------:|
| INTER_AZ | App server in AZ-1a talks to RDS in AZ-1b (same VPC) | ✅ |
| INTRA_AZ | App server and cache in the same AZ/subnet | ✅ |
| INTER_VPC | Production VPC to Shared Services VPC via TGW | ✅ |
| AMAZON_S3 | Lambda/EC2 uploading logs or reading data from S3 | ✅ |
| AMAZON_DYNAMODB | API backend doing read/write operations to DynamoDB | ✅ |
| INTER_REGION | Database replication from us-east-1 to eu-west-1 | ✅ |
| INTERNET | EC2 calling a third-party API through IGW | ❌ |
| AWS_SERVICE | Traffic to CloudFront, API Gateway, etc. | ❌ |
| TRANSIT_GATEWAY | Traffic hitting TGW but destination can't be determined | ❌ |
| LOCAL_ZONE | Starts or ends in a local zone | ❌ |
| UNCLASSIFIED | Cannot be otherwise classified | ❌ |


## Pricing

| Dimension | Price |
|-----------|-------|
| Per monitored resource (one compute instance with agent) | $0.0069 / resource / hour |
| Vended Logs | Standard vended logs pricing applies |
| CloudWatch Metrics | Standard CloudWatch metrics pricing applies |

No upfront costs or long-term commitments.


## Conclusion

Network Flow Monitor fills a critical gap in AWS network observability by providing near real-time performance metrics from actual workload traffic. By leveraging lightweight eBPF-based agents and the Network Health Indicator, it enables organizations to:

- Continuously monitor network performance (latency, packet loss, retransmissions) for production workloads
- Quickly attribute network degradation to either AWS infrastructure or application-level issues
- Reduce Mean Time to Detect (MTTD) and Mean Time to Recovery (MTTR) for network-related incidents
- Validate network performance across complex multi-VPC, multi-AZ architectures
- Create CloudWatch alarms for proactive alerting on network performance degradation


## Resources

- [What is Network Flow Monitor?](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-NetworkFlowMonitor.html)
- [How It Works](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-NetworkFlowMonitor-inside-network-flow-monitor.html)
- [Components and Features](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-NetworkFlowMonitor-components.html)
- [Pricing](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-NetworkFlowMonitor.pricing.html)
- [Install Agents](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-NetworkFlowMonitor-agents.html)
- [Blog: Visualizing Network Performance](https://aws.amazon.com/blogs/networking-and-content-delivery/visualizing-network-performance-of-your-aws-cloud-workloads-with-network-flow-monitor/)

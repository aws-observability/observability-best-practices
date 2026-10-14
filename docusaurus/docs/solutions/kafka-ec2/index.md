---
title: Kafka on EC2 Monitoring
sidebar_label: Kafka on EC2
---

# Kafka on EC2 Monitoring

## Overview

Monitor self-managed Apache Kafka clusters running on EC2 instances using the CloudWatch Agent's JMX plugin. This solution captures broker health, partition metrics, consumer lag, and producer throughput without requiring Prometheus infrastructure.

Apache Kafka exposes its internal state through Java Management Extensions (JMX) MBeans. The CloudWatch Agent connects to the broker's JMX port locally, scrapes the MBeans you configure, and publishes them as CloudWatch custom metrics. This gives you alarm, dashboard, and anomaly-detection capabilities without deploying a separate metrics backend.

The most important metric categories to collect are:

- **Broker health** — `UnderReplicatedPartitions` (non-zero means a replica is falling behind), `ActiveControllerCount` (must be exactly 1 across the cluster), `OfflinePartitionsCount` (partitions with no active leader, meaning data is unavailable), and `IsrShrinksPerSec` / `IsrExpandsPerSec` (frequent ISR churn signals disk or network pressure).
- **Producer throughput** — `kafka.server:type=BrokerTopicMetrics,name=MessagesInPerSec` and `BytesInPerSec` track ingest rate. `TotalProduceRequestsPerSec` and `FailedProduceRequestsPerSec` surface request errors before they cascade to producers.
- **Consumer health** — Consumer group lag is the single most important consumer metric. The `kafka.consumer:type=consumer-fetch-manager-metrics` MBean exposes `records-lag-max` and `records-consumed-rate` per consumer group. Growing lag means consumers cannot keep up with production rate and typically precedes data-loss scenarios.
- **JVM** — Heap usage, GC pause time, and thread count for each broker process. Sustained high GC pressure correlates with increased request latency and eventual broker unresponsiveness.

:::caution Needs refresh

This entry collects Kafka broker metrics over JMX with the CloudWatch agent. It
predates the current recommendation and does not cover:

- **OpenTelemetry collection**, including the JMX receiver, which replaces the
  agent's JMX plugin for new deployments
- The **CloudWatch managed Prometheus collector** as an alternative for
  self-managed Kafka
- Dashboards from the observability accelerator artifacts

The steps below still work. If you run **Amazon MSK** rather than self-managed
Kafka, use [Amazon MSK Monitoring](../msk-monitoring/) instead, which is current.

:::

## Prerequisites

- Kafka cluster running on EC2 (v2.8+)
- JMX enabled on Kafka brokers (port 9999)
- CloudWatch Agent v1.300025+
- IAM role with `CloudWatchAgentServerPolicy`
- Java 11+ on broker instances

## Architecture

```
┌────────────────────────────────────────────────────────┐
│                 EC2 Instance (Kafka Broker)             │
│                                                        │
│  ┌──────────────────┐     ┌──────────────────────────┐│
│  │  Kafka Broker    │     │   CloudWatch Agent       ││
│  │                  │◄────│   • JMX Plugin           ││
│  │  JMX Port: 9999 │     │   • Log collection       ││
│  │                  │     │                          ││
│  └──────────────────┘     └────────────┬─────────────┘│
└────────────────────────────────────────┼───────────────┘
                                         │
                              ┌──────────▼──────────┐
                              │     CloudWatch      │
                              │  • Custom/Kafka NS  │
                              │  • Log Groups       │
                              │  • Dashboards       │
                              └─────────────────────┘
```

## Deploy

### Step 1: Enable JMX on Kafka brokers

Add to Kafka startup environment (`/etc/kafka/kafka-env.sh`):

```bash
export KAFKA_JMX_OPTS="-Dcom.sun.management.jmxremote \
  -Dcom.sun.management.jmxremote.port=9999 \
  -Dcom.sun.management.jmxremote.local.only=true \
  -Dcom.sun.management.jmxremote.authenticate=false \
  -Dcom.sun.management.jmxremote.ssl=false"
```

### Step 2: Install CloudWatch Agent

```bash
sudo yum install -y amazon-cloudwatch-agent
```

### Step 3: Configure JMX collection

Create `/opt/aws/amazon-cloudwatch-agent/etc/amazon-cloudwatch-agent.json`:

```json
{
  "metrics": {
    "namespace": "Custom/Kafka",
    "metrics_collected": {
      "jmx": [
        {
          "endpoint": "localhost:9999",
          "metrics": [
            {
              "object_name": "kafka.server:type=BrokerTopicMetrics,name=MessagesInPerSec",
              "measurement": ["Count"]
            },
            {
              "object_name": "kafka.server:type=ReplicaManager,name=UnderReplicatedPartitions",
              "measurement": ["Value"]
            },
            {
              "object_name": "kafka.server:type=BrokerTopicMetrics,name=BytesInPerSec",
              "measurement": ["Count"]
            },
            {
              "object_name": "kafka.server:type=BrokerTopicMetrics,name=BytesOutPerSec",
              "measurement": ["Count"]
            }
          ]
        }
      ]
    }
  },
  "logs": {
    "logs_collected": {
      "files": {
        "collect_list": [
          {
            "file_path": "/var/log/kafka/server.log",
            "log_group_name": "/kafka/broker",
            "log_stream_name": "{instance_id}"
          }
        ]
      }
    }
  }
}
```

### Step 4: Add consumer group lag monitoring

To track consumer lag — the most critical consumer health signal — add the `kafka.consumer:type=consumer-fetch-manager-metrics` MBean to the JMX configuration. This MBean exposes `records-lag-max`, `records-consumed-rate`, and `fetch-rate` per consumer group. Note that these metrics are only available when consumer processes run on the same instance; for remote consumers, deploy the CloudWatch Agent on each consumer host.

Add the following entry to the `"metrics"` array in your agent config:

```json
{
  "object_name": "kafka.consumer:type=consumer-fetch-manager-metrics,client-id=*",
  "measurement": ["records-lag-max", "records-consumed-rate"]
}
```

### Step 5: Add ZooKeeper metrics (if applicable)

If your Kafka cluster uses ZooKeeper (pre-KRaft mode), collect ZooKeeper's `AvgRequestLatency`, `OutstandingRequests`, and `NumAliveConnections` MBeans by enabling JMX on the ZooKeeper process and adding its endpoint to the agent config. ZooKeeper latency spikes propagate to Kafka as broker registration delays and leader election slowdowns.

### Step 6: Start the agent

```bash
sudo /opt/aws/amazon-cloudwatch-agent/bin/amazon-cloudwatch-agent-ctl \
  -a fetch-config -m ec2 \
  -c file:/opt/aws/amazon-cloudwatch-agent/etc/amazon-cloudwatch-agent.json -s
```

:::tip Alternative: OpenTelemetry JMX Receiver
For new deployments, consider the [OpenTelemetry JMX receiver](https://github.com/open-telemetry/opentelemetry-java-contrib/tree/main/jmx-metrics) as a replacement for the CloudWatch Agent JMX plugin. The OTel collector can export to CloudWatch via the [AWS CloudWatch EMF exporter](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-Agent-open-telemetry.html), and supports richer attribute handling and metric transformation. This entry will be updated with OTel-based instructions in a future refresh.
:::

## Validate

1. **Check agent status:**
   ```bash
   sudo /opt/aws/amazon-cloudwatch-agent/bin/amazon-cloudwatch-agent-ctl -a status
   ```

2. **Verify JMX connectivity:**
   ```bash
   # Locally test JMX port
   echo "" | nc -w 2 localhost 9999 && echo "JMX reachable" || echo "JMX unreachable"
   ```

3. **Check CloudWatch namespace:** Navigate to CloudWatch > Metrics > Custom namespaces and confirm `Custom/Kafka` appears. It may take 2–3 minutes after agent start for the namespace to register.

4. **Verify key MBean families with the CLI:**

   Confirm that broker topic metrics and controller metrics are arriving:

   ```bash
   aws cloudwatch list-metrics \
     --namespace "Custom/Kafka" \
     --metric-name "kafka.server.BrokerTopicMetrics.MessagesInPerSec.Count" \
     --region us-east-1
   ```

   Then retrieve recent data points to verify values are non-zero:

   ```bash
   aws cloudwatch get-metric-data \
     --metric-data-queries '[
       {
         "Id": "messagesIn",
         "MetricStat": {
           "Metric": {
             "Namespace": "Custom/Kafka",
             "MetricName": "kafka.server.BrokerTopicMetrics.MessagesInPerSec.Count"
           },
           "Period": 300,
           "Stat": "Average"
         }
       }
     ]' \
     --start-time "$(date -u -d '15 minutes ago' +%Y-%m-%dT%H:%M:%S)" \
     --end-time "$(date -u +%Y-%m-%dT%H:%M:%S)" \
     --region us-east-1
   ```

5. **Verify controller metrics:** Check that `kafka.controller.KafkaController.ActiveControllerCount.Value` reports exactly `1` across your cluster. Multiple active controllers indicate a split-brain condition requiring immediate attention.

## Troubleshoot

| Symptom | Likely Cause | Fix |
|---------|-------------|-----|
| No JMX metrics | Port not open | Verify `KAFKA_JMX_OPTS` and restart broker |
| Partial metrics | Object name mismatch | Check exact MBean names with `jconsole` or `jmxterm` |
| Agent high CPU | Too many MBeans | Reduce scrape targets or increase collection interval |
| Logs not appearing | Wrong file path | Verify Kafka log directory location in `server.properties` |
| JMX connection refused with SSL/SASL error | JMX remote authentication enabled but agent config expects unauthenticated access | Set `-Dcom.sun.management.jmxremote.authenticate=false` and `-Dcom.sun.management.jmxremote.ssl=false` for local-only collection, or configure the agent with matching credentials |
| JMX port conflict on startup | Another Java process (e.g., ZooKeeper, Schema Registry) already binds the same port | Assign each Java process a unique JMX port. Use `ss -tlnp | grep 9999` to identify the conflicting process |
| No ZooKeeper metrics | JMX not enabled on ZooKeeper process | Add `JMXPORT=9998` to `zkEnv.sh` and add a second JMX endpoint in the agent config pointing to port 9998 |
| High-cardinality topic metrics inflate cost | Per-topic MBeans scraped without filtering | Restrict `object_name` to specific topics using `topic=<name>` in the MBean pattern, or use `metric_relabel_configs` to drop internal topics (`__consumer_offsets`, `__transaction_state`) |

## Related Solutions

- [MSK Monitoring](../msk-monitoring/) — managed Kafka alternative with built-in open monitoring and the CloudWatch managed Prometheus collector
- [EC2 NGINX Monitoring](../ec2-nginx/) — same EC2 + CloudWatch Agent pattern applied to a different workload
- [Big Data Observability](../big-data-observability/) — data tier observability covering EMR, Spark, and streaming pipelines

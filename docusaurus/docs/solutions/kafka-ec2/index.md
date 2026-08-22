---
title: Kafka on EC2 Monitoring
sidebar_label: Kafka on EC2
---

# Kafka on EC2 Monitoring

## Overview

Monitor self-managed Apache Kafka clusters running on EC2 instances using the CloudWatch Agent's JMX plugin. This solution captures broker health, partition metrics, consumer lag, and producer throughput without requiring Prometheus infrastructure.

Key metrics captured:
- Broker: messages/sec, bytes in/out, under-replicated partitions, ISR shrinks
- Topics: messages/sec per topic, bytes/sec, failed produce/fetch requests
- Consumer groups: consumer lag, commit rate
- JVM: heap usage, GC time, thread count

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

### Step 4: Start the agent

```bash
sudo /opt/aws/amazon-cloudwatch-agent/bin/amazon-cloudwatch-agent-ctl \
  -a fetch-config -m ec2 \
  -c file:/opt/aws/amazon-cloudwatch-agent/etc/amazon-cloudwatch-agent.json -s
```

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

3. **Check CloudWatch:** Navigate to CloudWatch > Metrics > Custom/Kafka.

## Troubleshoot

| Symptom | Likely Cause | Fix |
|---------|-------------|-----|
| No JMX metrics | Port not open | Verify KAFKA_JMX_OPTS and restart broker |
| Partial metrics | Object name mismatch | Check exact MBean names with `jconsole` |
| Agent high CPU | Too many MBeans | Reduce scrape targets or increase interval |
| Logs not appearing | Wrong file path | Verify Kafka log directory location |

## Related Solutions

- [EC2 NGINX Monitoring](../ec2-nginx/) — Monitor the web tier consuming from Kafka
- [EKS Infrastructure Monitoring](../eks-infrastructure/) — If migrating Kafka to containers

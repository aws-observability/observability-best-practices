---
title: EC2 Monitoring
sidebar_label: EC2 Monitoring
---

# EC2 Monitoring

## Overview

Monitor Amazon EC2 instances using the unified CloudWatch agent for system metrics, logs, and custom application metrics, combined with AWS X-Ray for distributed tracing. This solution provides comprehensive observability for workloads running directly on EC2 instances.

The CloudWatch agent collects system-level metrics (CPU, memory, disk, network), streams log files to CloudWatch Logs, and supports custom metrics via StatsD and collectd protocols. For applications that span multiple EC2 instances or interact with other AWS services, X-Ray provides end-to-end request tracing and service map visualization.

This is the foundational EC2 observability pattern. The full reference is in the [EC2 monitoring documentation](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/monitoring_ec2.html). For open-source alternatives using Prometheus and ADOT, see the [ADOT on EC2 documentation](https://aws-otel.github.io/docs/getting-started/collector).

## Prerequisites

- Amazon EC2 instance(s) running Amazon Linux 2/2023, Ubuntu, Windows Server, or other [supported OS](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Install-CloudWatch-Agent.html)
- IAM instance profile with `CloudWatchAgentServerPolicy` and `AWSXRayDaemonWriteAccess`
- AWS CLI v2 or AWS Systems Manager agent (for SSM-based install)
- (Optional) AWS Systems Manager Quick Setup for fleet-wide deployment

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     EC2 Instance                            │
│                                                             │
│  ┌──────────────────┐     ┌──────────────────┐             │
│  │  Application     │     │  Application     │             │
│  │  (X-Ray SDK)     │     │  (StatsD/        │             │
│  │                  │     │   collectd)      │             │
│  └────────┬─────────┘     └────────┬─────────┘             │
│           │ traces                  │ custom metrics        │
│           ▼                         ▼                       │
│  ┌──────────────────────────────────────────────┐           │
│  │           CloudWatch Agent                   │           │
│  │  - System metrics (CPU, mem, disk, net)      │           │
│  │  - Log file collection                       │           │
│  │  - Custom metrics (StatsD/collectd)          │           │
│  └───────────────────┬──────────────────────────┘           │
│                      │                                      │
│  ┌──────────────────────────────────────────────┐           │
│  │           X-Ray Daemon                       │           │
│  └───────────────────┬──────────────────────────┘           │
│                      │                                      │
└──────────────────────┼──────────────────────────────────────┘
                       │
          ┌────────────┼────────────┐
          ▼            ▼            ▼
┌──────────────┐ ┌──────────┐ ┌──────────────┐
│ CloudWatch   │ │CloudWatch│ │  AWS X-Ray   │
│ Metrics      │ │  Logs    │ │  Traces &    │
│ + Dashboards │ │          │ │  Service Map │
│ + Alarms     │ │          │ │              │
└──────────────┘ └──────────┘ └──────────────┘
```

## Deploy

### Step 1: Install the CloudWatch agent

**Via SSM (recommended for fleets):**

```bash
aws ssm send-command \
  --document-name "AWS-ConfigureAWSPackage" \
  --targets "Key=tag:Environment,Values=production" \
  --parameters '{"action":["Install"],"name":["AmazonCloudWatchAgent"]}'
```

**Via command line (single instance):**

```bash
# Amazon Linux 2 / AL2023
sudo yum install -y amazon-cloudwatch-agent

# Ubuntu
wget https://s3.amazonaws.com/amazoncloudwatch-agent/ubuntu/amd64/latest/amazon-cloudwatch-agent.deb
sudo dpkg -i amazon-cloudwatch-agent.deb
```

### Step 2: Configure the agent

Run the configuration wizard or create a config file directly:

```bash
sudo /opt/aws/amazon-cloudwatch-agent/bin/amazon-cloudwatch-agent-config-wizard
```

Or create `/opt/aws/amazon-cloudwatch-agent/etc/amazon-cloudwatch-agent.json`:

```json
{
  "metrics": {
    "namespace": "CWAgent",
    "metrics_collected": {
      "cpu": { "measurement": ["cpu_usage_idle", "cpu_usage_user", "cpu_usage_system"], "totalcpu": true },
      "mem": { "measurement": ["mem_used_percent"] },
      "disk": { "measurement": ["disk_used_percent"], "resources": ["*"] },
      "net": { "measurement": ["bytes_sent", "bytes_recv"] }
    },
    "append_dimensions": { "InstanceId": "${aws:InstanceId}" }
  },
  "logs": {
    "logs_collected": {
      "files": {
        "collect_list": [
          { "file_path": "/var/log/messages", "log_group_name": "/ec2/system/messages" },
          { "file_path": "/var/log/application/*.log", "log_group_name": "/ec2/application" }
        ]
      }
    }
  }
}
```

### Step 3: Start the agent

```bash
sudo /opt/aws/amazon-cloudwatch-agent/bin/amazon-cloudwatch-agent-ctl \
  -a fetch-config -m ec2 \
  -c file:/opt/aws/amazon-cloudwatch-agent/etc/amazon-cloudwatch-agent.json -s
```

### Step 4: Enable X-Ray tracing (optional)

Install the X-Ray daemon:

```bash
# Amazon Linux 2
sudo yum install -y xray

# Or download directly
curl https://s3.us-east-2.amazonaws.com/aws-xray-assets.us-east-2/xray-daemon/aws-xray-daemon-linux-3.x.zip -o xray.zip
unzip xray.zip && sudo ./xray -o -n us-east-2 &
```

Then instrument your application using the [X-Ray SDK](https://docs.aws.amazon.com/xray/latest/devguide/xray-instrumenting-your-app.html) for your language.

### Step 5: Set up CloudWatch alarms

```bash
aws cloudwatch put-metric-alarm \
  --alarm-name "HighCPU-$(hostname)" \
  --metric-name cpu_usage_user \
  --namespace CWAgent \
  --statistic Average \
  --period 300 \
  --threshold 80 \
  --comparison-operator GreaterThanThreshold \
  --evaluation-periods 2 \
  --alarm-actions arn:aws:sns:$REGION:$ACCOUNT_ID:ops-alerts
```

## Validate

1. **Check agent status:**
   ```bash
   sudo /opt/aws/amazon-cloudwatch-agent/bin/amazon-cloudwatch-agent-ctl -a status
   ```

2. **Verify metrics in CloudWatch:**
   Navigate to CloudWatch → Metrics → CWAgent namespace. Confirm CPU, memory, and disk metrics are present for your instance.

3. **Verify log delivery:**
   ```bash
   aws logs describe-log-streams --log-group-name /ec2/system/messages --limit 5
   ```

4. **Check X-Ray traces (if enabled):**
   Navigate to CloudWatch → X-Ray traces → Service map. Confirm your application nodes appear.

5. **Use Resource Health dashboard:**
   Navigate to CloudWatch → ServiceLens → Resource Health for a fleet-wide view of EC2 instance health.

## Troubleshoot

| Symptom | Likely Cause | Fix |
|---------|-------------|-----|
| No metrics in CWAgent namespace | Agent not running or config error | Run `amazon-cloudwatch-agent-ctl -a status`; check `/opt/aws/amazon-cloudwatch-agent/logs/amazon-cloudwatch-agent.log` |
| Logs not appearing in CloudWatch | IAM permissions missing or wrong log path | Verify instance profile has `CloudWatchAgentServerPolicy`; confirm `file_path` matches actual log locations |
| Memory/disk metrics missing | Default EC2 metrics don't include memory | Install and configure the CloudWatch agent (basic monitoring only provides CPU, network, and disk I/O) |
| X-Ray daemon not sending traces | Security group blocking UDP 2000 | Ensure localhost access is available; check daemon logs at `/var/log/xray/xray.log` |
| Metrics delayed or gaps present | Basic monitoring uses 5-min intervals | Enable detailed monitoring for 1-min resolution: `aws ec2 monitor-instances --instance-ids $ID` |

## Related Solutions

- [EC2 Nginx Monitoring](../ec2-nginx/) — Nginx-specific metrics collection on EC2
- [Kafka on EC2](../kafka-ec2/) — Kafka cluster monitoring with Prometheus and CloudWatch

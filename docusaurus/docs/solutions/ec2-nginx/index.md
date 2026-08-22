---
title: EC2 NGINX Monitoring
sidebar_label: EC2 NGINX
---

# EC2 NGINX Monitoring

## Overview

Collect NGINX access/error logs and performance metrics from EC2 instances using the CloudWatch Agent. This solution provides visibility into request rates, response codes, connection states, and upstream latency.

**Note:** This solution uses the CloudWatch Agent metrics pipeline. For new deployments, consider OpenTelemetry-based approaches for broader ecosystem compatibility.

Key metrics captured:
- Active connections, accepts, handled requests
- Request rate and response status codes (2xx, 4xx, 5xx)
- Response time percentiles
- Upstream connect/response time

:::caution Needs refresh

This entry predates the current recommendation. It configures the CloudWatch
agent directly and does not cover:

- **OpenTelemetry collection into CloudWatch**, now the preferred path for
  application metrics on EC2
- A **dashboard worth shipping** — there is no accelerator artifact referenced
- Validation showing what a working NGINX monitoring setup looks like

The steps below still work. Prefer the
[AWS documentation](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Install-CloudWatch-Agent.html)
when starting fresh, and see
[CloudWatch Agent Configuration](../cloudwatch-agent-configuration/) for
current agent guidance.

:::

## Prerequisites

- EC2 instance with NGINX installed
- IAM role with `CloudWatchAgentServerPolicy` attached
- NGINX stub_status module enabled
- SSM Agent (for remote config management, optional)

## Architecture

```
┌─────────────────────────────────────────┐
│              EC2 Instance                │
│                                         │
│  ┌───────────┐     ┌─────────────────┐  │
│  │   NGINX   │────▶│ /var/log/nginx/ │  │
│  │           │     │ access.log      │  │
│  │ stub_status     │ error.log       │  │
│  └─────┬─────┘     └────────┬────────┘  │
│        │                     │           │
│  ┌─────▼─────────────────────▼────────┐  │
│  │        CloudWatch Agent            │  │
│  │  • procstat (NGINX process)        │  │
│  │  • logs (access + error)           │  │
│  │  • StatsD (custom metrics)         │  │
│  └─────────────────┬──────────────────┘  │
└────────────────────┼─────────────────────┘
                     │
                     ▼
          ┌────────────────────┐
          │    CloudWatch      │
          │  • Metrics         │
          │  • Logs            │
          │  • Dashboards      │
          └────────────────────┘
```

## Deploy

### Step 1: Enable NGINX stub_status

Add to your NGINX config (`/etc/nginx/conf.d/status.conf`):

```nginx
server {
    listen 127.0.0.1:8080;
    location /nginx_status {
        stub_status on;
        allow 127.0.0.1;
        deny all;
    }
}
```

### Step 2: Install CloudWatch Agent

```bash
sudo yum install -y amazon-cloudwatch-agent  # Amazon Linux
# or
sudo apt-get install -y amazon-cloudwatch-agent  # Ubuntu
```

### Step 3: Configure the agent

Create `/opt/aws/amazon-cloudwatch-agent/etc/amazon-cloudwatch-agent.json`:

```json
{
  "agent": {
    "metrics_collection_interval": 60
  },
  "metrics": {
    "namespace": "Custom/NGINX",
    "metrics_collected": {
      "procstat": [{
        "pattern": "nginx",
        "measurement": ["cpu_usage", "memory_rss", "pid_count"]
      }]
    }
  },
  "logs": {
    "logs_collected": {
      "files": {
        "collect_list": [
          {
            "file_path": "/var/log/nginx/access.log",
            "log_group_name": "/nginx/access",
            "log_stream_name": "{instance_id}"
          },
          {
            "file_path": "/var/log/nginx/error.log",
            "log_group_name": "/nginx/error",
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
  -a fetch-config \
  -m ec2 \
  -c file:/opt/aws/amazon-cloudwatch-agent/etc/amazon-cloudwatch-agent.json \
  -s
```

## Validate

1. **Check agent status:**
   ```bash
   sudo /opt/aws/amazon-cloudwatch-agent/bin/amazon-cloudwatch-agent-ctl -a status
   ```

2. **Verify metrics in CloudWatch:** Navigate to CloudWatch > Metrics > Custom/NGINX.

3. **Verify logs:** Navigate to CloudWatch > Log Groups > /nginx/access.

## Troubleshoot

| Symptom | Likely Cause | Fix |
|---------|-------------|-----|
| Agent won't start | Config syntax error | Run agent with `-a verify` flag |
| No metrics appearing | IAM role missing | Attach `CloudWatchAgentServerPolicy` |
| Logs not flowing | File permissions | Ensure agent user can read NGINX logs |
| stub_status 403 | Wrong listen address | Verify listening on 127.0.0.1 |

## Related Solutions

- [EKS Infrastructure Monitoring](../eks-infrastructure/) — If migrating NGINX to containers
- [Kafka on EC2](../kafka-ec2/) — Monitor message queues feeding NGINX backends

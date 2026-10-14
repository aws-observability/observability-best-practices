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

- **NGINX 1.18+** (or any version compiled with `--with-http_stub_status_module`). Verify the module is present:
  ```bash
  nginx -V 2>&1 | grep -o with-http_stub_status_module
  ```
- **EC2 instance** running Amazon Linux 2/2023, Ubuntu 20.04+, or RHEL 8+.
- **IAM instance profile** with [`CloudWatchAgentServerPolicy`](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/create-iam-roles-for-cloudwatch-agent-commandline.html) attached — grants the agent permissions to publish metrics and logs.
- **Security group** allowing inbound on ports 80/443 for web traffic. Do **not** expose the `stub_status` port (8080) externally.
- **SSM Agent** (optional) — pre-installed on Amazon Linux AMIs. Enables remote config via Parameter Store.

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

The CloudWatch Agent runs as a daemon on the same instance. It collects **process-level metrics** via `procstat` (CPU, memory, worker count), **NGINX performance counters** from `stub_status`, and **log files** (access and error), pushing everything to CloudWatch under a custom namespace and dedicated log groups.

For deeper request-level tracing, add [AWS X-Ray](https://docs.aws.amazon.com/xray/latest/devguide/aws-xray.html) instrumentation to applications behind NGINX — X-Ray traces requests end-to-end, generates service maps, and captures latency distributions.

For autoscaling scenarios, couple CloudWatch alarms or [AMP alerting rules](https://docs.aws.amazon.com/prometheus/latest/userguide/AMP-Ruler.html) with an SNS-to-Lambda pattern to adjust Auto Scaling group capacity based on request rate or connection saturation.

## Deploy

### Step 1: Enable NGINX stub_status

The `stub_status` module exposes a lightweight status page that reports four key counters:

| Counter | Description |
|---------|-------------|
| **Active connections** | Current number of open connections including waiting |
| **Accepts** | Total accepted client connections since last restart |
| **Handled** | Total handled connections (equals accepts unless resource limits hit) |
| **Requests** | Total client requests served |

A gap between *accepts* and *handled* indicates dropped connections due to worker or file-descriptor limits.

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

Reload and verify:

```bash
sudo nginx -t && sudo systemctl reload nginx
curl http://127.0.0.1:8080/nginx_status
```

### Step 2: Configure structured access logs

Replace the default combined log format with JSON so CloudWatch Logs Insights can query fields directly:

```nginx
log_format json_combined escape=json
  '{'
    '"time":"$time_iso8601",'
    '"remote_addr":"$remote_addr",'
    '"request_method":"$request_method",'
    '"request_uri":"$request_uri",'
    '"status":$status,'
    '"body_bytes_sent":$body_bytes_sent,'
    '"request_time":$request_time,'
    '"upstream_response_time":"$upstream_response_time",'
    '"http_user_agent":"$http_user_agent"'
  '}';

access_log /var/log/nginx/access.log json_combined;
```

With this format, a CloudWatch Logs Insights query like `fields @timestamp, status, request_time | filter status >= 500` works directly.

### Step 3: Install CloudWatch Agent

```bash
sudo yum install -y amazon-cloudwatch-agent  # Amazon Linux
# or
sudo apt-get install -y amazon-cloudwatch-agent  # Ubuntu
```

### Step 4: Configure the agent

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

The `procstat` plugin tracks NGINX master and worker processes. A `pid_count` drop to zero means NGINX has crashed; an unexpectedly high count may indicate worker misconfiguration.

For curated NGINX Grafana dashboards, the [AWS Observability Accelerator](https://github.com/aws-observability/terraform-aws-observability-accelerator) provides dashboard definitions for NGINX workloads. While those target EKS, the metric patterns (connections, request rates, error ratios) apply to EC2 when you export the same metric names.

### Step 5: Start the agent

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
   The output should show `"status": "running"`. If stopped, check `/opt/aws/amazon-cloudwatch-agent/logs/amazon-cloudwatch-agent.log`.

2. **Verify the metric namespace:** Navigate to **CloudWatch → Metrics → Custom namespaces → Custom/NGINX**. Metrics appear within 2–3 minutes of agent start. Confirm from the CLI:
   ```bash
   aws cloudwatch list-metrics --namespace "Custom/NGINX"
   ```
   Look for metric names `procstat_cpu_usage`, `procstat_memory_rss`, and `procstat_pid_count`.

3. **Verify key metrics:**
   - `procstat_pid_count` should match the number of NGINX processes (`ps aux | grep nginx | grep -v grep | wc -l`).
   - If you have configured `stub_status` metric scraping via StatsD or a custom script, confirm `nginx_connections_active` appears in the namespace.

4. **Verify log groups:** Confirm `/nginx/access` and `/nginx/error` exist under **CloudWatch → Log groups**, each with a stream named after the instance ID:
   ```bash
   aws logs describe-log-groups --log-group-name-prefix "/nginx/"
   ```

5. **Send a test request and trace it:**
   ```bash
   curl -s http://localhost/ > /dev/null
   ```
   Verify the request appears in `/nginx/access`. With JSON log format, use Logs Insights:
   ```
   fields @timestamp, status, request_time
   | sort @timestamp desc
   | limit 5
   ```

## Troubleshoot

| Symptom | Likely Cause | Fix |
|---------|-------------|-----|
| Agent won't start | Config syntax error | Run `amazon-cloudwatch-agent-ctl -a verify` to validate the JSON config. Check `/opt/aws/amazon-cloudwatch-agent/logs/amazon-cloudwatch-agent.log` for details. |
| No metrics appearing | IAM role missing or insufficient | Attach `CloudWatchAgentServerPolicy` to the instance profile. Verify with `aws sts get-caller-identity` from the instance. |
| Logs not flowing | File permissions | Ensure the `cwagent` user can read `/var/log/nginx/`. Run `sudo usermod -aG adm cwagent` on Ubuntu or adjust file ACLs. |
| stub_status returns 403 | Wrong listen address or ACL | Verify the `listen` directive uses `127.0.0.1:8080` and `allow 127.0.0.1` is present. Test with `curl http://127.0.0.1:8080/nginx_status`. |
| Logs stop flowing after rotation | `logrotate` sends SIGUSR1 to NGINX, which reopens files, but the CloudWatch Agent may lose track of the new file descriptor | Add `copytruncate` to the NGINX logrotate config (`/etc/logrotate.d/nginx`) instead of the default `create` mode, so the agent continues tailing the same inode. |
| High-cardinality metrics from access logs | Parsing raw URI paths (e.g., `/users/12345`) as metric dimensions creates unbounded cardinality | Avoid using raw `$request_uri` as a CloudWatch dimension. Normalise URIs in your log processing or use CloudWatch Logs Insights queries with `parse` to group by route pattern. |
| CloudWatch Agent high memory on t3.micro/small | Agent memory grows with the number of tailed files and metric buffers | Reduce `metrics_collection_interval`, limit the number of `collect_list` entries, or upgrade to a t3.medium. Monitor agent memory with `procstat` targeting the `amazon-cloudwatch-agent` pattern. |
| stub_status exposed externally | Listening on `0.0.0.0` instead of `127.0.0.1` | Change the `listen` directive to `127.0.0.1:8080`. Verify with `ss -tlnp | grep 8080` to confirm it is bound to localhost only. Review security group rules to ensure port 8080 is not open inbound. |

## Related Solutions

- [Kafka on EC2](../kafka-ec2/) — same EC2 + CloudWatch Agent pattern applied to data streaming workloads
- [Hybrid Environment Monitoring](../hybrid-monitoring/) — extending EC2 monitoring to on-premises and hybrid environments
- [Observability Cost Management](../observability-cost-management/) — managing CloudWatch metric and log costs as you scale NGINX fleets

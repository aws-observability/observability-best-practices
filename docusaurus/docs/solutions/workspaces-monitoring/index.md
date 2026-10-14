---
title: Amazon WorkSpaces Monitoring
sidebar_label: Amazon WorkSpaces Monitoring
---

import RelatedEvents from '@site/src/components/RelatedEvents';

# Amazon WorkSpaces Monitoring

## Related Events

<RelatedEvents topics={["metrics"]} />

## Overview

Monitor Amazon WorkSpaces virtual desktops using Prometheus agents deployed on each WorkSpace instance, a Prometheus server on EC2 for scraping and remote-writing to Amazon Managed Service for Prometheus (AMP), and Amazon Managed Grafana (AMG) for visualization.

This enables service desk staff to quickly identify CPU, memory, network, and disk issues on WorkSpaces without guesswork, and to investigate historical data for post-event analysis. Organizations adopting [Amazon WorkSpaces](https://docs.aws.amazon.com/workspaces/latest/adminguide/amazon-workspaces.html) as a virtual Desktop-as-a-Service (DaaS) solution need Day 2 operational monitoring. A cloud-based managed open-source stack — AMP for durable metric storage (150-day retention) and AMG for dashboards — removes the overhead of self-managed monitoring infrastructure while giving IT teams the observability they need.

Key organizational benefits:

- **Faster triage** — service desk staff drill down to specific WorkSpace issues using AMG dashboards instead of asking users to describe symptoms.
- **Post-event investigation** — AMP retains metrics for 150 days, enabling root-cause analysis long after an incident.
- **Automated agent rollout** — Active Directory Group Policy Objects (GPO) deploy `windows_exporter` to every new WorkSpace automatically, ensuring no instance goes unmonitored.

## Prerequisites

- Amazon WorkSpaces environment deployed and accessible
- An Amazon Managed Service for Prometheus workspace
- An Amazon Managed Grafana workspace with AMP as a data source
- An EC2 instance for the Prometheus server with network connectivity to WorkSpaces
- Active Directory Group Policy Objects (GPO) access for automated agent deployment
- VPC peering or connectivity between the Prometheus EC2 VPC and the WorkSpaces VPC
- Security groups allowing inbound TCP on port **9182** from the Prometheus server to each WorkSpace
- An IAM role attached to the Prometheus EC2 instance with the `AmazonPrometheusRemoteWriteAccess` managed policy

## Architecture

![WorkSpaces monitoring architecture with Prometheus, AMP, and AMG](../../recipes/recipes/Workspaces-Monitoring-AMP-AMG/prometheus.drawio-dotted.drawio.png)

The diagram shows the end-to-end signal flow:

1. **windows_exporter agents** run on every Amazon WorkSpace, exposing system metrics (CPU, memory, disk, network) on TCP port 9182.
2. A **Prometheus server on EC2** scrapes each agent at a configurable interval (default 15 s). Because WorkSpaces use DHCP addresses, the scrape target list is refreshed periodically — for example via a cron job that performs an Active Directory DNS zone transfer and rewrites the Prometheus target file.
3. Prometheus **remote-writes** scraped metrics to the **AMP workspace** endpoint using SigV4 authentication. The EC2 instance carries an IAM instance profile with the `AmazonPrometheusRemoteWriteAccess` policy. Local retention on the EC2 instance is set to 4 hours since AMP provides 150-day durable storage.
4. **Amazon Managed Grafana** queries AMP as a Prometheus-compatible data source and renders dashboards for service desk staff — giving them real-time and historical views of every WorkSpace.

VPC peering connects the Prometheus VPC to the WorkSpaces VPC, and a dedicated security group on the WorkSpaces side permits inbound traffic on port 9182 from the Prometheus server's private IP.

## Deploy

1. **Create an AMP workspace:**
   ```bash
   aws amp create-workspace --alias workspaces-monitoring
   ```
   Note the `workspaceId` from the output — you will need it for the remote-write URL.

2. **Deploy `windows_exporter` on each WorkSpace.**
   Download the MSI from the [windows_exporter releases page](https://github.com/prometheus-community/windows_exporter/releases) and deploy it via Active Directory GPO so every new WorkSpace receives the agent automatically. The default install exposes metrics on port 9182. You can also install manually on individual WorkSpaces:
   ```powershell
   msiexec /i windows_exporter-<version>-amd64.msi LISTEN_PORT=9182
   ```
   Verify the agent is running:
   ```powershell
   # On the WorkSpace
   Invoke-WebRequest -Uri http://localhost:9182/metrics -UseBasicParsing | Select-Object -First 5
   ```

3. **Deploy a Prometheus server on EC2.** Install Prometheus on an Amazon Linux 2 instance and configure it as a systemd service. Create `/etc/prometheus/prometheus.yml` with scrape and remote-write configuration:

   ```yaml
   global:
     scrape_interval: 15s
     evaluation_interval: 15s

   scrape_configs:
     - job_name: "workspaces"
       static_configs:
         - targets:
             - "10.0.0.10:9182"
             - "10.0.0.11:9182"
             # Add all WorkSpace IPs; automate with DNS zone transfer script

   remote_write:
     - url: "https://aps-workspaces.<region>.amazonaws.com/workspaces/<workspace-id>/api/v1/remote_write"
       sigv4:
         region: "<region>"
       queue_config:
         max_samples_per_send: 1000
         max_shards: 200
         capacity: 2500
   ```

   Replace `<region>` and `<workspace-id>` with your AMP workspace values. The EC2 instance must have an IAM instance profile with `AmazonPrometheusRemoteWriteAccess` — SigV4 signing picks up credentials automatically.

   For environments with DHCP-assigned WorkSpace IPs, set up a cron job to refresh targets by performing an Active Directory DNS zone transfer and rewriting the `static_configs` targets, then reloading Prometheus (`systemctl reload prometheus` or `kill -HUP`).

4. **Configure AMG to use the AMP workspace as a data source.** In your AMG workspace, add a Prometheus data source with the AMP query endpoint:
   ```
   https://aps-workspaces.<region>.amazonaws.com/workspaces/<workspace-id>
   ```
   Enable SigV4 authentication. Import or build dashboards for CPU, memory, network, and disk metrics.

## Validate

1. **Check Prometheus targets.** Open the Prometheus server UI at `http://<prometheus-ec2-ip>:9090/targets` and confirm WorkSpaces endpoints show status **UP**.

2. **Query AMP through AMG.** In Amazon Managed Grafana, open the Explore view with the AMP data source and run the following PromQL queries:

   ```promql
   # Confirm targets are reporting
   up{job="workspaces"}

   # CPU usage per WorkSpace (rate of CPU time in seconds)
   rate(windows_cpu_time_total{mode="idle"}[5m])

   # Available disk space on the C: drive
   windows_logical_disk_free_bytes{volume="C:"}

   # Memory in use
   windows_os_physical_memory_free_bytes

   # List all monitored WorkSpace hostnames
   group by (hostname) (windows_cs_hostname)
   ```

3. **Confirm dashboard panels.** Verify that dashboard panels populate with data. A successful deployment shows:
   - All WorkSpaces appearing as UP targets in Prometheus.
   - Non-zero CPU, memory, and disk metrics flowing into AMG panels.
   - Historical data queryable after several scrape intervals (typically within 1–2 minutes).

## Troubleshoot

| Symptom | Likely Cause | Fix |
|---------|-------------|-----|
| Prometheus target shows DOWN | Agent not installed or firewall blocking scrape port | Verify `windows_exporter` is running on the WorkSpace (`Get-Service windows_exporter`); check security group allows inbound TCP 9182 from the Prometheus server IP |
| No data in AMG dashboards | AMP data source misconfigured or IAM permissions missing | Verify AMG data source URL and SigV4 auth; check the AMG workspace IAM role has `aps:QueryMetrics` permission |
| Remote write errors in Prometheus logs | Incorrect AMP endpoint or missing IAM role on EC2 | Verify remote write URL matches AMP workspace; attach IAM instance profile with `AmazonPrometheusRemoteWriteAccess` |
| Stale or missing WorkSpaces in targets | DHCP address changed and target list is outdated | Re-run the DNS zone transfer script or update `static_configs` in `prometheus.yml` and reload Prometheus |
| `windows_exporter` metrics page returns empty or 404 | Exporter service crashed or collectors disabled | Restart the service (`Restart-Service windows_exporter`); check the Windows event log for exporter errors |

## Related Solutions

- [Hybrid Environment Monitoring](../hybrid-monitoring/) — shared EC2 + AMP + AMG + Prometheus pattern for on-premises and hybrid workloads
- [Amazon Managed Grafana Setup](../managed-grafana-setup/) — AMG configuration, data source management, and dashboard best practices
- [Observability Cost Management](../observability-cost-management/) — strategies for managing AMP and AMG costs at scale

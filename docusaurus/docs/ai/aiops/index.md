---
sidebar_position: 2
---

# AIOps

Using AI and machine learning to enhance cloud operations — anomaly detection, automated root cause analysis, predictive alerting, and intelligent remediation.

## AWS Services for AIOps

- **[Amazon DevOps Guru](https://aws.amazon.com/devops-guru/)** — ML-powered insights to detect anomalous application behavior and recommend remediation
- **[CloudWatch Anomaly Detection](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch_Anomaly_Detection.html)** — Applies ML algorithms to continuously analyze metrics and identify anomalies
- **[CloudWatch Application Signals](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-Application-Monitoring-Sections.html)** — Automatically discovers and monitors application services and their dependencies
- **[Amazon Q Developer operational investigations](https://docs.aws.amazon.com/amazonq/latest/qdeveloper-ug/operational-investigation.html)** — AI-assisted investigation of operational issues

## Best Practices

- Start with anomaly detection on key business metrics before expanding to infrastructure
- Use composite alarms to reduce noise from individual ML-based detectors
- Combine AIOps signals with human judgment — use ML to surface issues, not to auto-remediate critical systems without review
- Feed operational runbooks and past incident data to improve AI-assisted investigations

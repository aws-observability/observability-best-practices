---
sidebar_position: 2
---

# AIOps

క్లౌడ్ ఆపరేషన్లను మెరుగుపరచడానికి AI మరియు machine learning ఉపయోగించడం — anomaly detection, automated root cause analysis, predictive alerting మరియు intelligent remediation.

## AIOps కోసం AWS Services

- **[Amazon DevOps Guru](https://aws.amazon.com/devops-guru/)** — అసాధారణ application behavior detect చేసి remediation recommend చేయడానికి ML-powered insights
- **[CloudWatch Anomaly Detection](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch_Anomaly_Detection.html)** — Metrics ను నిరంతరం analyze చేసి anomalies identify చేయడానికి ML algorithms apply చేస్తుంది
- **[CloudWatch Application Signals](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-Application-Monitoring-Sections.html)** — Application services మరియు వాటి dependencies ను ఆటోమేటిక్‌గా discover చేసి monitor చేస్తుంది
- **[Amazon Q Developer operational investigations](https://docs.aws.amazon.com/amazonq/latest/qdeveloper-ug/operational-investigation.html)** — Operational issues యొక్క AI-assisted investigation

## బెస్ట్ ప్రాక్టీసెస్

- Infrastructure కు expand చేయడానికి ముందు key business metrics పై anomaly detection తో start చేయండి
- Individual ML-based detectors నుండి noise తగ్గించడానికి composite alarms ఉపయోగించండి
- AIOps signals ను human judgment తో combine చేయండి — issues surface చేయడానికి ML ఉపయోగించండి, review లేకుండా critical systems auto-remediate చేయడానికి కాదు
- AI-assisted investigations improve చేయడానికి operational runbooks మరియు past incident data feed చేయండి

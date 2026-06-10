---
sidebar_position: 2
---

# AIOps

利用 AI 和机器学习增强云运营——异常检测、自动化根因分析、预测性告警和智能修复。

## 用于 AIOps 的 AWS 服务

- **[Amazon DevOps Guru](https://aws.amazon.com/devops-guru/)** — 基于 ML 的洞察，用于检测应用程序异常行为并推荐修复方案
- **[CloudWatch Anomaly Detection](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch_Anomaly_Detection.html)** — 应用 ML 算法持续分析 metrics 并识别异常
- **[CloudWatch Application Signals](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-Application-Monitoring-Sections.html)** — 自动发现和监控应用程序服务及其依赖关系
- **[Amazon Q Developer operational investigations](https://docs.aws.amazon.com/amazonq/latest/qdeveloper-ug/operational-investigation.html)** — AI 辅助的运维问题调查

## 最佳实践

- 先从关键业务 metrics 的异常检测开始，再扩展到基础设施
- 使用复合告警来减少单个基于 ML 的检测器产生的噪音
- 将 AIOps 信号与人工判断相结合——使用 ML 来发现问题，而不是在没有审核的情况下自动修复关键系统
- 将运维手册和历史事件数据输入系统，以改善 AI 辅助调查的效果

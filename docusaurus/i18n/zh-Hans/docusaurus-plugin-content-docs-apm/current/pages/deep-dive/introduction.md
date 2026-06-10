# 简介

本指南探讨了 Application Signals 的技术架构、检测策略和实施方法，特别关注组织为什么应该从传统的 X-Ray 采样迁移到新的综合 Observability 方案。

## 指南章节

| 章节 | 描述 |
|---|---|
| [传统监控的挑战](../challenges) | 为什么传统监控在现代云原生应用中力不从心 |
| [为什么要从 X-Ray 迁移](../why-migrate-from-xray) | 采用 Application Signals + Transaction Search 相比传统 X-Ray 的优势 |
| [设置与配置](../setup) | 启用 Application Signals、Transaction Search 和采样的分步指南 |
| [检测和 Collector 配置](../instrumentation-setups) | 检测方法和详细的 collector 架构（ADOT + CW Agent、ADOT + 自定义 Collector、上游 OTEL、无 Collector、X-Ray 旧版） |
| [检测示例](../instrumentation-samples) | Java、Python、Node.js、.NET、Go 和 Rust 的语言特定代码示例和演示应用 |
| [资源](../resources) | 文档链接、技术资源和培训材料 |

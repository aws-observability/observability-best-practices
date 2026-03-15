# Introduction

Comprehensive guides for Amazon CloudWatch Application Signals architecture, instrumentation strategies, and implementation approaches.

## What is Application Signals?

AWS Application Performance Monitoring (APM) has evolved significantly with the introduction of [Amazon CloudWatch Application Signals](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-Application-Monitoring-Sections.html) and [Amazon CloudWatch Transaction Search](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-Transaction-Search.html). Application Signals provides automatic service discovery, golden signal metrics, and comprehensive service health monitoring, while Transaction Search enables 100% span ingestion with advanced analytics capabilities and cost-effective storage through CloudWatch Logs.

Application Signals automatically instruments your applications on AWS to monitor current application health and track long-term application performance against business objectives. It provides a unified, application-centric view of your applications, services, and dependencies, helping you monitor and triage application health without writing custom code or creating dashboards.

## Guide Sections

| Section | Description |
|---|---|
| [Challenges with Traditional Monitoring](challenges) | Why legacy monitoring falls short for modern cloud-native applications |
| [Why Migrate from X-Ray](why-migrate-from-xray) | Benefits of adopting Application Signals + Transaction Search over traditional X-Ray |
| [Setup & Configuration](setup) | Step-by-step guide to enable Application Signals, Transaction Search, and sampling |
| [Instrumentation Setups](instrumentation-setups) | Detailed comparison of ADOT SDK + CW Agent, ADOT SDK + Custom Collector, Upstream OTEL SDK, Collector-less, and X-Ray legacy approaches |
| [Instrumentation Samples](instrumentation-samples) | Language-specific examples for Java, Python, Node.js, .NET, Go, and Rust |
| [Resources](resources) | Documentation links, technical resources, and training materials |

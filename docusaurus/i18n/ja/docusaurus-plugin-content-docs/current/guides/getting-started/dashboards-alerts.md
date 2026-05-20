---
sidebar_position: 4
---

# Dashboards and Alerts

Once your telemetry is flowing, you can set up dashboards and alerts relevant to your use case.

## Curated Dashboards

Be sure to leverage curated dashboards which you can find under various parts of the CloudWatch console.

For example, you will find automated dashboards for many services (such as Lambda, EC2, API Gateway, and many more) under Dashboards.

If you are leveraging Application Signals, you will find application maps and dashboards under Application Signals (APM). In addition, you will find uninstrumented services which will highlight any gaps in observability.

## Custom Dashboards

You will also need to design your own business-specific dashboards. Refer to this guide on how to design your dashboards for operational excellence: [Building Dashboards for Operational Visibility](https://aws.amazon.com/builders-library/building-dashboards-for-operational-visibility/)

## CloudWatch Alarms

You will also create alerts (or Alarms in CloudWatch) to signal any problems with your services and infrastructure. You can create alarms in your monitoring account for centralized alarm visibility or/and individual alarms in local accounts.

### Alarm Recommendations

If you are unsure how to get started, Alarm Recommendations will help you. Alarm recommendations are based on monitoring best practices. Review the recommended alarm configurations before creating an alarm.

For more details, see [Alarm recommendations for AWS services](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Best_Practice_Recommended_Alarms_AWS_Services.html).

## Service Level Objectives (SLOs)

You can also create SLOs and associated alarms to help you track important KPIs.

For more information, see [CloudWatch SLOs](../../tools/slos.md).

## Summary

This concludes the Getting Started on CloudWatch guide. Here are the steps we covered:

1. **Setup Monitoring and Source Accounts** – Configured cross-account observability to centralize telemetry data from multiple AWS accounts and regions
2. **Setup Unified Data Store** – Centralized log data into a single account and region for unified querying and analysis
3. **Configure Agents/Collectors** – Deployed CloudWatch agents and/or OpenTelemetry collectors to send telemetry from your applications and infrastructure
4. **Dashboards and Alerts** – Created dashboards for visibility and alarms to monitor the health of your services

## Next Steps

For more in-depth guidance on specific topics, refer to the detailed sections throughout this best practices guide:

- [Containers (ECS/EKS)](../containers/aws-native/eks/amazon-cloudwatch-container-insights.md)
- [Serverless](../serverless/aws-native/lambda-based-observability.md)
- [Operational Guides](../operational/observability-driven-dev.md)
- [Cost Optimization](../cost/cost-visualization/cost.md)
- [Signal Collection](../signal-collection/emf.md)

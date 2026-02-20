---
sidebar_position: 1
---

# Setup Monitoring and Source Accounts

In the majority of cases, customers need to visualize and correlate telemetry data from multiple AWS accounts because their services run across many accounts, and sometimes, many regions.

If you only plan to run your observability and services in a single account, you can skip this step.

The first step is to setup your monitoring and source accounts and specify exactly what telemetry you wish to share. You will leverage cross-account observability to do so. Please note that this works on a per-region basis.

For more detailed instructions on how to setup cross-account observability, please refer to the [CloudWatch Cross-Account Observability](../cloudwatch_cross_account_observability.md) guide.

## Monitoring Account

Nominate a monitoring account from which you want to view the telemetry data in a centralized manner.

Then define which accounts will share the data with your monitoring account. You can choose all accounts in your AWS organization or pick individual source accounts. You will also specify what telemetry data you want to share with the monitoring account (e.g. logs, metrics, traces, application signals etc).

You will then [link the source accounts](../cloudwatch_cross_account_observability.md#step-2-link-source-accounts-to-the-monitoring-account) to complete the setup.

Your typical monitoring account structure will look similar to this:

![Monitoring Account Structure](../../images/GettingStarted/monitoring-acct-struct.png)

You will [configure](../cloudwatch_cross_account_observability.md#step-1-set-up-a-monitoring-account) this on a per-region basis in CloudWatch settings.

:::info
With cross-account observability, logs and metrics are NOT copied from the source accounts, but trace data is copied to the monitoring account (with trace copy to the 1st monitoring account included at no additional cost). You simply view logs, metrics, traces and other telemetry centrally.
:::

## Multiple Monitoring Accounts

Each monitoring account can be linked with up to 100,000 source accounts.

However, there may be operational situations where you need multiple monitoring accounts. You can have multiple monitoring accounts based on your own requirements. This setup might look something like this:

![Multiple Monitoring Accounts](../../images/GettingStarted/multiple-mon-accts.png)

:::info
If you need to share data from a single source account with multiple monitoring accounts, that is also configurable as each source account can share data with up to 5 monitoring accounts.
:::

## Telemetry Control

You also have control of what telemetry data you share with the ability to specify metric and log filters allowing you extra granularity.

![Telemetry Configuration](../../images/GettingStarted/telemetry-config.png)

You will now be able to [visualize and query cross-account](../cloudwatch_cross_account_observability.md#querying-cross-account-telemetry-data) data from multiple accounts in a single monitoring account (per region).

## Summary

To summarize:
1. Nominate and configure monitoring account(s)
2. Configure source accounts
3. Fine tune which telemetry you want to share
4. Visualize and query all the source account data from the monitoring account

## Next Steps

Continue to [Setup Unified Data Store](./setup-unified-data-store.md)

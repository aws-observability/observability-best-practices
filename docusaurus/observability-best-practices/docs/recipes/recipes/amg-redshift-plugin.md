# Using Redshift in Amazon Managed Grafana

In this recipe we show you how to use [Amazon Redshift][redshift]—a petabyte-scale data 
warehouse service using standard SQL—in [Amazon Managed Grafana][amg]. This integration
is enabled by the [Redshift data source for Grafana][redshift-ds], an open source
plugin available for you to use in any DIY Grafana instance as well as 
pre-installed in Amazon Managed Grafana.

!!! note
    This guide will take approximately 10 minutes to complete.

## Prerequisites

1. You have admin access to Amazon Redshift from your account.
1. Tag your Amazon Redshift cluster with `GrafanaDataSource: true`. 
1. In order to benefit from the service-managed policies, create the database 
   credentials in one of the following ways:
    1. If you want to use the default mechanism, that is, the temporary credentials 
    option, to authenticate against the Redshift database, you must create a database 
    user named `redshift_data_api_user`.
    1. If you want to use the credentials from Secrets Manager, you must tag the 
    secret with `RedshiftQueryOwner: true`.

!!! tip
    For more information on how to work with the service-managed or custom policies,
    see the [examples in the Amazon Managed Grafana docs][svpolicies].

## Infrastructure
We need a Grafana instance, so go ahead and set up a new [Amazon Managed Grafana
workspace][amg-workspace], for example by using the [Getting Started][amg-getting-started] guide,
or use an existing one.

!!! note
    To use AWS data source configuration, first go to the Amazon Managed Grafana
    console to enable service-mananged IAM roles that grant the workspace the 
    IAM policies necessary to read the Athena resources.


To set up the Athena data source, use the left-hand toolbar and choose the 
lower AWS icon and then choose "Redshift". Select your default region you want 
the plugin to discover the Redshift data source to use, and then select the 
accounts that you want, and finally choose "Add data source".

Alternatively, you can manually add and configure the Redshift data source by 
following these steps:

1. Click on the "Configurations" icon on the left-hand toolbar and then on "Add data source".
1. Search for "Redshift".
1. [OPTIONAL] Configure the authentication provider (recommended: workspace IAM
   role).
1. Provide the "Cluster Identifier", "Database", and "Database User" values.
1. Click "Save & test".

You should see something like the following:

![Screen shot of the Redshift data source config](../images/amg-plugin-redshift-ds.png)

## Usage
We will be using the [Redshift Advance Monitoring][redshift-mon] setup.
Since all is available out of the box, there's nothing else to configure at
this point.

You can import the Redshift monitoring dashboard, included in the Redshift
plugin. Once imported you should see something like this:

![Screen shot of the Redshift dashboard in AMG](../images/amg-redshift-mon-dashboard.png)

From here, you can use the following guides to create your own dashboard in
Amazon Managed Grafana:

* [User Guide: Dashboards](https://docs.aws.amazon.com/grafana/latest/userguide/dashboard-overview.html)
* [Best practices for creating dashboards](https://grafana.com/docs/grafana/latest/best-practices/best-practices-for-creating-dashboards/)

That's it, congratulations you've learned how to use Redshift from Grafana!

## Cleanup

Remove the Redshift database you've been using and then
the Amazon Managed Grafana workspace by removing it from the console.

[redshift]: https://aws.amazon.com/redshift/
[amg]: https://aws.amazon.com/grafana/
[svpolicies]: https://docs.aws.amazon.com/grafana/latest/userguide/security_iam_id-based-policy-examples.html
[redshift-ds]: https://grafana.com/grafana/plugins/grafana-redshift-datasource/
[aws-cli]: https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-install.html
[aws-cli-conf]: https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-configure.html
[amg-getting-started]: https://aws.amazon.com/blogs/mt/amazon-managed-grafana-getting-started/
[redshift-console]: https://console.aws.amazon.com/redshift/
[redshift-mon]: https://github.com/awslabs/amazon-redshift-monitoring
[amg-workspace]: https://console.aws.amazon.com/grafana/home#/workspaces

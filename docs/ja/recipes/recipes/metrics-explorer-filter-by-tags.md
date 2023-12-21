# Using Amazon CloudWatch Metrics explorer to aggregate and visualize metrics filtered by resource tags

In this recipe we show you how to use Metrics explorer to filter, aggregate, and visualize metrics by resource tags and resource properties - [Use metrics explorer to monitor resources by their tags and properties][metrics-explorer].

There are number of ways to create visualizations with Metrics explorer; in this walkthrough we simply leverage the AWS Console.

!!! note
    This guide will take approximately 5 minutes to complete.

## Prerequisites

* Access to AWS account
* Access to Amazon CloudWatch Metrics explorer via AWS Console
* Resource tags set for the relevant resources 


## Metrics Explorer tag based queries and visualizations

*  Open the CloudWatch console 

*  Under <b>Metrics</b>, click on the <b>Explorer</b> menu 

![Screen shot of metrics filtered by tag](../images/metrics-explorer-filter-by-tags/metrics-explorer-cw-menu.png)
<!-- <img src="../images/metrics-explorer-filter-by-tags/metrics-explorer-cw-menu.png" alt="Screen shot of the CloudWatch menu" width="271" height="382" style="vertical-align:left"> -->

*  You can either choose from one of the <b>Generic templates</b> or a <b>Service based templates</b> list; in this example we use the <b>EC2 Instances by type</b> template 

![Screen shot of metrics filtered by tag](../images/metrics-explorer-filter-by-tags/metrics-explorer-templates-ec2-by-type.png)
<!-- <img src="../images/metrics-explorer-filter-by-tags/metrics-explorer-templates-ec2-by-type.png" alt="Screen shot of Explorer templates" width="250" height="601" style="vertical-align:left"> -->

*  Choose metrics you would like to explore; remove obsolete once, and add other metrics you would like to see

![Screen shot of the EC2 metrics](../images/metrics-explorer-filter-by-tags/metrics-explorer-ec2-metrics.png)
<!-- <img src="../images/metrics-explorer-filter-by-tags/metrics-explorer-ec2-metrics.png" alt="Screen shot of EC2 metrics" width="424" height="393" style="vertical-align:left"> -->

*  Under <b>From</b>, choose a resource tag or a resource property you are looking for; in the below example we show number of CPU and Network related metrics for different EC2 instances with <b>Name: TeamX</b> Tag

![Screen shot of the Name tag example](../images/metrics-explorer-filter-by-tags/metrics-explorer-teamx-name-tag.png)
<!--
<img src="../images/metrics-explorer-filter-by-tags/metrics-explorer-teamx-name-tag.png" alt="Screen shot of EC2 metrics" style="vertical-align:left">
// width="386" height="176" -->

*  Please note, you can combine time series using an aggregation function under <b>Aggregated by</b>; in the below example <b>TeamX</b> metrics are aggregated by <b>Availability Zone</b>

![Screen shot of the EC2 dashboard filter by tag Name](../images/metrics-explorer-filter-by-tags/metrics-explorer-ec2-by-tag-name-dashboard.png)
<!-- <img src="../images/metrics-explorer-filter-by-tags/metrics-explorer-ec2-by-tag-name-dashboard.png" alt="Screen shot of EC2 metrics" style="vertical-align:left"> -->

Alternatively, you could aggregate <b>TeamX</b> and <b>TeamY</b> by the <b>Team</b> Tag, or choose any other configuration that suits your needs

![Screen shot of the EC2 dashboard filter by tag Team](../images/metrics-explorer-filter-by-tags/metrics-explorer-ec2-by-tag-team-dashboard.png)
<!-- <img src="../images/metrics-explorer-filter-by-tags/metrics-explorer-ec2-by-tag-team-dashboard.png" alt="Screen shot of EC2 metrics" style="vertical-align:left"> -->

## Dynamic visualizations
You can easily customize resulting visualizations by using <b>From</b>, <b>Aggregated by</b> and <b>Split by</b> options. Metrics explorer visualizations are dynamic, so any new tagged resource automatically appears in the explorer widget.

## Reference

For more information on Metrics explorer please refer to the following article:
https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-Metrics-Explorer.html

[metrics-explorer]: https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-Metrics-Explorer.html

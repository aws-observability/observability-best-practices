# Metrics

Metrics are a series of numerical values that are kept in order with the time that they are created. They are used to track everything from the number of servers in your environment, their disk usage, number of requests they handle per second, or the latency in completing these requests.

But metrics are not limited to infrastructure or application monitoring. Rather, they can be used for any kind of business or workload to track sales, call queues, and customer satisfaction. In fact, metrics are most useful when combining both operational data and business metrics, giving a well-rounded view and observable system.

It might be worth looking into [the OpenTelemetry documentation page](https://opentelemetry.io/docs/concepts/signals/metrics/) that provides some additional context on Metrics.

## Know your Key Performance Indicators(KPIs), and measure them!

The *most* important thing with metrics is to *measure the right things*. And what those are will be different for everyone. An e-commerce application may have sales per hour as a critical KPI, whereas a bakery would like be more interested in the number of croissants made per day.

!!! warning
	There is no singular, entirely complete, and comprehensive source for your business KPIs. You must understand your project or application well enough to know what your *output goals* are. 

Your first step is to name your high-level goals, and most likely those goals are not expressed as a single metric that comes from your infrastructure alone. In the e-commerce example above, once you identify the *meta* goal which is measuring *sales per hour*, you then can backtrack to detailed metrics such as time spent to search a product before purchase, time taken to complete the checkout process, latency of product search results and so on. This will guide us to be intentional about collecting relevant information to observe the system.

!!! success
	Having identified your KPIs, you can now *work backwards* to see what metrics in your workload impact them.

## Correlate with operational metric data

If high CPU utilization on your web server causes slow response times, which in turn makes for dissatisfied customers and ultimately lower revenue, then measuring your CPU utilization has a direct impact on your business outcomes and should *absolutely* be measured!

Or conversely, if you have an application that performs batch processing on ephemeral cloud resources (such as an Amazon EC2 fleet, or similar in other cloud provider environments), then you may *want* to have CPU as utilized as possible in order to accomplish the most cost-effective means of completing the batch. 

In either case, you need to have your operational data (e.g. CPU utilization) be in the same system as your business metrics so you can correlate the two. 

!!! success
	Store your business metrics and operational metrics in a system where you can correlate them together and draw conclusions based on observed impacts to both.

## Know what good looks like!

Understanding what a healthy baseline is can be challenging. Many people have to stress test their workloads to understand what healthy metrics look like. However, depending on your needs you may be able to observe existing operational metrics to draw safe conclusions about healthy thresholds.

A healthy workload is one that has a balance of meeting your KPI objectives while remaining resilient, available, and cost-effective.

!!! success
	Your KPIs *must* have an identified healthy range so you can create [alarms](../../signals/alarms/) when performance falls below, or above, what is required.

## Use anomaly detection algorithms

The challenge with [knowing what good looks like](#know-what-good-looks-like) is that it may be impractical to know the healthy thresholds for *every* metric in your system. A Relational Database Management System(RDBMS) can emit dozens of performance metrics, and when coupled with a microservices architecture you can potentially have hundreds of metrics that can impact your KPIs.

Watching such a large number of datapoints and individually identifying their upper and lower thresholds may not always be practical for humans to do. But machine learning is *very* good at this sort of repetitive task. Leverage automation and machine learning wherever possible as it can help identify issues that you would otherwise not even know about!

!!! success
	Use machine learning algorithms and anomaly detection models to automatically calculate your workload's performance thresholds. 

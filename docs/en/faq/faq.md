# General - FAQ

## How are logs different from traces?

Logs are limited to a single application and the events that relate to it. For example, if a user logs into a web site hosted on a microservices platform, and makes a purchase on this site, there may be logs related to that user emitted from multiple applications:

1. A front-end web server
1. Authentication service
1. The inventory service
1. A payment processing backend
1. Outbound mailer that sends the user a receipt

Every one of these may log something about this user, and that data is all valuable. However, traces will present a single, cohesive view of the user's entire interaction across that single transaction, spanning all of these discrete components.

In this way, a trace a collection of events from multiple services intended to show a single view of an activity, whereas logs are bound to the context of the application that created them.

## What signal types are immutable?

All three of the basic signal types ([metrics](../signals/metrics/), [logs](../signals/logs/), and [traces](../signals/traces/)) are immutable, though some implementations have greater or lesser assurance of this. For example, immutability of logs is a strict requirement in many governance frameworks - and many tools exist to ensure this. Metrics and traces should likewise *always* be immutable. 

This leads to a question as to handling "bad data", or data that was inaccurate. With  AWS observability services, there is no facility to delete metrics or traces that were emitted in error. CloudWatch Logs does allow for the deletion of an entire log stream, but you cannot retroactively change data once it has been collected. This is by design, and an important feature to ensure customer data is treated with the utmost care.

## Why does immutability matter for observability?

Immutability is paramount to observability! If past data can be modified then you would lose critical errors, or outliers in behaviour, that inform your *choices* when evolving your systems and operations. For example, a metric datapoint that shows a large gap in time does not simply show a lack of data collection, it may indicate a much larger issue in your infrastructure. Likewise, with "null" data - even empty timeseries are valuable.

From a governance perspective, changing application logs or tracing after the fact violates the principal of [non-reputability](https://en.wikipedia.org/wiki/Non-repudiation), where you would not be able to trust that the data in your system is precisely as it was intended be by the source application. 

## What is a blast radius?

The blast radius of a change is the potential damage that it can create in your environment. For example, if you make a database schema change then the potential risk could include the data in the database plus all of the applications that depend on it.

Generally speaking, working to reduce the blast radius of a change is a best practice, and breaking a change into smaller, safer, and reversible chunks is always recommended wherever feasible.

## What is a "cloud first" approach?

Cloud-first strategies are where organization move all or most of their infrastructure to cloud-computing platforms. Instead of using physical resources like servers, they house resources in the cloud. 

To those used to co-located hardware, this might seem radical. However, the opposite is also true. Developers who adopt a cloud-first mentality find the idea of tying your servers to a physical location unthinkable. Cloud-first teams don’t think of their servers as discrete pieces of hardware or even virtual servers. Instead, they think of them as software to fulfill a business function.

Cloud-first is to the 2020's what mobile-first was to the 2010's, and virtualization was to the early 2000's. 

## What is technical debt?

Taken from [Wikipedia](https://en.wikipedia.org/wiki/Technical_debt):

> In software development, technical debt (also known as design debt or code debt) is the implied cost of additional rework caused by choosing an easy (limited) solution now instead of using a better approach that would take longer.

Basically, you accumulate debt over time as you add more to your workload without removing legacy code, applications, or human processes. Technical debt detracts from your absolute productivity. 

For example, if you have to spend 10% of your time performing maintenance on a legacy system that provides little or no direct value to your business, then that 10% is a *cost* that you pay. Reduction of technical debt equals increasing effective time to create new products that add value. 

## What is the separation of concerns

In the context of observability solutions, the separation of concerns means to divide functional areas of a workload or an application into discrete components that are independently managed. Each component addresses a separate concern (such as log structure and the *emitting* of logs). Controlling configuration of a component without modifying the underlying code means that developers can focus on their concerns (application functionality and feature development), while DevOps personas can focus on optimizing system performance and troubleshooting.

Separation of concerns is a [core concept](https://en.wikipedia.org/wiki/Separation_of_concerns) in computer science.

## What is operational excellence?

Operational excellence is the performance of best practices that align with operating workloads. AWS has an entire framework dedicated to being Well-Architected. See [this page](https://docs.aws.amazon.com/wellarchitected/latest/operational-excellence-pillar/welcome.html) to get started with operational excellence.
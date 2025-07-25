# Traces

Traces track the request processing through complex distributed systems providing detailed information about the request flow through individual components including downstream AWS resources, microservices, databases, and APIs. This will help with performance optimization by identifying bottlenecks and latency issues.

In this section, you will see links to AWS Documention and open source repositories that will provide information on using AWS X-Ray SDK for .NET to instrument .NET applications to create and send trace information to AWS X-Ray via X-Ray daemon.

To learn about AWS X-Ray it's core concepts visit the [**What is AWS X-Ray**](https://docs.aws.amazon.com/xray/latest/devguide/aws-xray.html) and [**Concepts**](https://docs.aws.amazon.com/xray/latest/devguide/aws-xray.html) sections in the AWS X-Ray Developer Guide.

The X-Ray SDK for .NET is a library for instrumenting C# .NET web applications, .NET Core web applications, and .NET Core functions on AWS Lambda. It provides classes and methods for generating and sending trace data to the X-Ray daemon. This includes information about incoming requests served by the application, and calls that the application makes to downstream AWS services, HTTP web APIs, and SQL databases.

## Options for agents and SDKs

You have the option to choose between AWS X-Ray daemon, Cloudwatch agent, and AWS Distro for OpenTelemetry (ADOT) collector to collect traces from Amazon EC2 instances and on-premise servers and send them to AWS X-Ray. Choose the right one for your usecase so you minimize the number of agents you have to manage. 

To learn about configuring X-Ray daemon to collect and send traces from your application and infrastructure read the [**AWS X-Ray daemon**](https://docs.aws.amazon.com/xray/latest/devguide/xray-daemon.html) guide. Instead, if your choice is to use CloudWatch agent, the [**Amazon CloudWatch user guide**](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Install-CloudWatch-Agent.html) will provide the instructions to setup and configure CloudWatch agent.

To instrument your application to generate traces, you have the option to choose between OpenTelemetry and X-Ray SDK for .NET. The guidance to choose between these options is available [**here**](https://docs.aws.amazon.com/xray/latest/devguide/xray-instrumenting-your-app.html#xray-instrumenting-choosing). 

## AWS X-Ray SDK for .NET
 
The X-Ray SDK for .NET is an open source project. X-Ray SDK for .NET is supported for applications targeting .NET Framework 4.5 or later. For .NET Core applications, the SDK requires .NET Core 2.0 or later.

Here are the links for you to get started.

[**AWS X-Ray SDK for .NET developer guide**](https://docs.aws.amazon.com/xray/latest/devguide/xray-sdk-dotnet.html) - The documentation explains installation via NuGet, configuration options, and various instrumentation capabilities including automatic HTTP request tracing and AWS service call monitoring. It covers how developers can create custom segments, add annotations, and utilize sampling rules to manage data collection. The guide offers comprehensive information for integrating X-Ray tracing into ASP.NET applications, helping developers gain visibility into application performance and troubleshoot issues effectively.

[**The SDK open source project repo - aws-xray-sdk-dotnet**](https://docs.aws.amazon.com/xray/latest/devguide/xray-sdk-dotnet.html) - The aws-xray-sdk-dotnet repository houses the open source code for Amazon's X-Ray SDK for .NET. Developers can see the implementation of this tracing tool which supports distributed application monitoring across .NET Core and .NET Framework environments. The repository contains the source code for automatic instrumentation of HTTP requests, AWS service calls, and custom instrumenting capabilities. You can review how the SDK integrates with ASP.NET frameworks and implements sampling rules. This GitHub project provides transparency into the SDK's functionality while allowing developers to report issues or contribute improvements to the codebase.

The below are the API reference manuals that comprehensively describe the components of .NET X-Ray SDK. 

[**The API Reference for .NET Framework**](https://docs.aws.amazon.com/xray-sdk-for-dotnet/latest/reference/html/d0b774be-200e-4897-9ce6-4e43c3f6f5de.htm)

[**The API Reference for .NET (Core)**](https://docs.aws.amazon.com/xray-sdk-for-dotnetcore/latest/reference/html/bdf06719-4833-4e03-8ce5-31debb71506c.htm)

Sample applications to learn using X-Ray SDK for .NET in your ASP.NET and ASP.NET Core applications are linked below

[**Sample ASP.NET and ASP.NET core applications**](https://github.com/aws-samples/aws-xray-dotnet-webapp)
# Best Practices with AWS Native services for Observability of your workloads on Amazon EKS workloads 

This section of Observability best practices guide provides you guidance around AWS native best practices for observability of your workloads on Amazon Elastic Kubernetes Service (Amazon EKS).  

## How to use this guide

This guide is meant for developers and architects who want to understand AWS native best practices for observability of metrics based containerized workloads on Amazon Elastic Kubernetes Service (Amazon EKS). The guide is organized into different topic areas for easier consumption. Each topic starts with a brief overview, followed by a list of recommendations and best practices.

## Introduction

Observability is a measure  of how well internal states of a system can be inferred from knowledge of its external outputs. Three dimensions namely Monitoring, Logging and tracing forms the umbrella of Observability. Architecting solutions with these three dimensions of observability helps you to gain complete operational visibility in to your AWS environment running containerized workloads on Amazon EKS. AWS natively provides many options to architecting solutions with best practices with these three dimensions of observability for containerized workloads on Amazon EKS and we going to discuss those recommendations in detail.

The AWS native best practices for observability of metrics based containerized workloads on EKS have been grouped under the following topics:

* [Amazon CloudWatch Container Insights](./eks-aws-native/amazon-cloudwatch-container-insights.md)
* [Amazon EKS API Server Monitoring](./eks-aws-native/eks-api-server-monitoring.md)
* [Log Aggregation](./eks-aws-native/log-aggregation.md)
* Container Tracing with AWS X-Ray
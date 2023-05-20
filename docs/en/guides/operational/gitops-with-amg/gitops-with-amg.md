# Using GitOps and Grafana Operator with Amazon Managed Grafana

## How to use this guide

This Observability best practices guide is meant for developers and architects who want to understand how to use [grafana-operator](https://github.com/grafana-operator/grafana-operator#:~:text=The%20grafana%2Doperator%20is%20a,an%20easy%20and%20scalable%20way.) as a Kubernetes operator on your Amazon EKS cluster to create and manage the lifecycle of data sources such as Amazon Managed Service for Prometheus, Amazon CloudWatch, AWS X-Ray to Amazon Managed Grafana and create Grafana dashboards in Amazon Managed Grafana in a Kubernetes native way

## Introduction

In this Observability best practices we will focus on using Grafana Operator and GitOps with Amazon Managed Grafana via following topics:

* Introduction to GitOps and Grafana Operator
* Using GitOps with Flux on Amazon EKS to manage Amazon Managed Grafana
* Using Grafana Operator on Amazon EKS to manage Amazon Managed Grafana

## Introduction to GitOps and Grafana Operator

### What is GitOps and Flux

GitOps is a software development and operations methodology that uses Git as the source of truth for deployment configurations. It involves keeping the desired state of an application or infrastructure in a Git repository and using Git-based workflows to manage and deploy changes. GitOps is a way of managing application and infrastructure deployment so that the whole system is described declaratively in a Git repository. It is an operational model that offers you the ability to manage the state of multiple Kubernetes clusters leveraging the best practices of version control, immutable artifacts, and automation. 

Flux is a GitOps tool that automates the deployment of applications on Kubernetes. It works by continuously monitoring the state of a Git repository and applying any changes to a cluster. Flux integrates with various Git providers such as GitHub, [GitLab](https://dzone.com/articles/auto-deploy-spring-boot-app-using-gitlab-cicd), and Bitbucket. When changes are made to the repository, Flux automatically detects them and updates the cluster accordingly.

### Pros of Flux

* **Automated deployments**: Flux automates the deployment process, reducing manual errors and freeing up developers to focus on other tasks.
* **Git-based workflow**: Flux leverages Git as a source of truth, which makes it easier to track and revert changes.
* **Declarative configuration**: Flux uses [Kubernetes](https://dzone.com/articles/kubernetes-full-stack-example-with-kong-ingress-co) manifests to define the desired state of a cluster, making it easier to manage and track changes.

### Cons of Flux

* **Limited customization**: Flux only supports a limited set of customizations, which may not be suitable for all use cases.
* **Steep learning curve**: Flux has a steep learning curve for new users and requires a deep understanding of Kubernetes and Git.

### Deep dive on Grafana Operator

Kubernetes APIs are robust and its control loop mechanism allows us to control the state of resources that are even outside of Kubernetes environments. Customers have shifted their focus towards workload gravity and rely on Kubernetes-native controllers to deploy and manage the lifecycle of external resources such as Cloud resources. We have seen customers installing [AWS Controllers for Kubernetes (ACK)](https://aws-controllers-k8s.github.io/community/docs/community/overview/)to create, deploy and manage AWS services. Many customers these days opt to offload the Prometheus and Grafana implementations to managed services and in case of AWS these services are [Amazon Managed Service for Prometheus](https://docs.aws.amazon.com/prometheus/?icmpid=docs_homepage_mgmtgov) and [Amazon Managed Grafana](https://docs.aws.amazon.com/grafana/?icmpid=docs_homepage_mgmtgov) for monitoring their workloads. Fundamentally what they need is one single API - the Kubernetes API, to control heterogeneous deployments.

The [grafana-operator](https://github.com/grafana-operator/grafana-operator#:~:text=The%20grafana%2Doperator%20is%20a,an%20easy%20and%20scalable%20way.)is a Kubernetes operator built to help you manage your Grafana instances inside Kubernetes. Grafana Operator makes it possible for you to manage and create Grafana dashboards, datasources etc. declaratively between multiple instances in an easy and scalable way. Though Grafana Operator makes it possible to manage Grafana instances using code in a Kubernetes native way, there was no mechanism to integrate Grafana services deployed outside of the cluster, such as Amazon Managed Grafana until recently.

To address this gap, AWS team collaborated with the [grafana-operator](https://github.com/grafana-operator/grafana-operator#:~:text=The%20grafana%2Doperator%20is%20a,an%20easy%20and%20scalable%20way.)team and submitted a [design proposal](https://github.com/grafana-operator/grafana-operator-experimental/pull/39)to support the integration of external Grafana instances. With this mechanism it will be possible to add external Prometheus compatible data sources (e.g., Amazon Managed Service for Prometheus) and create Grafana dashboards in external Grafana instances (e.g., Amazon Managed Grafana) from your Kubernetes cluster. This enables us to use our Kubernetes cluster to create and manage the lifecyle of resources in Amazon Managed Grafana in a Kubernetes native way. This ultimately enables us to use GitOps mechanisms using CNCF projects such as [Flux](https://fluxcd.io/) to create and manage the lifecyle of resources in Amazon Managed Grafana.

## Using GitOps with Flux on Amazon EKS to manage Amazon Managed Grafana

As discussed above, Flux automates the deployment of applications on Kubernetes. It works by continuously monitoring the state of a Git repository such as GitHub and when changes are made to the repository, Flux automatically detects them and updates the cluster accordingly. Please reference the below architecture where we will be demonstrating how to use Grafana Operator from your Kubernetes cluster and GitOps mechanisms using Flux to add Amazon Managed Service for Prometheus as a data source and create dashboards in Amazon Managed Grafana in a Kubernetes native way. 

![GitOPS-WITH-AMG-1](../../../../images/Operational/gitops-with-amg/gitops-with-amg-1.jpg)

Please reference the One Observability Workshop module - [GitOps with Amazon Managed Grafana](https://catalog.workshops.aws/observability/en-US/aws-managed-oss/gitops-with-amg). This module sets up required day 2 operational tooling such as the following on your EKS cluster :

* [External Secrets Operator](https://github.com/external-secrets/external-secrets/tree/main/deploy/charts/external-secrets) is installed successfully to read Amazon Managed Grafana secrets from AWS Secret Manager
* [Prometheus Node Exporter](https://github.com/prometheus/node_exporter)to measure various machine resources such as memory, disk and CPU utilization
* [Grafana Operator](https://github.com/grafana-operator/grafana-operator) to use our Kubernetes cluster to create and manage the lifecyle of resources in Amazon Managed Grafana in a Kubernetes native way. 
* [Flux](https://fluxcd.io/) to automate the deployment of applications on Kubernetes using GitOps mechanisms

## Using Grafana Operator on Amazon EKS to manage Amazon Managed Grafana

As discussed in previous section, Grafana Operator enables us to use our Kubernetes cluster to create and manage the lifecyle of resources in Amazon Managed Grafana in a Kubernetes native way.  The below architecture diagram shows the demonstration of Kubernetes cluster as a control plane with using Grafana Operator to setup an identity with AMG, adding Amazon Managed Service for Prometheus as a data source and creating dashboards on Amazon Managed Grafana from Amazon EKS cluster in a Kubernetes native way.

![GitOPS-WITH-AMG-2](../../../../images/Operational/gitops-with-amg/gitops-with-amg-2.jpg)

Please reference our post on [Using Open Source Grafana Operator on your Kubernetes cluster to manage Amazon Managed Grafana](https://aws.amazon.com/blogs/mt/using-open-source-grafana-operator-on-your-kubernetes-cluster-to-manage-amazon-managed-grafana/) for detailed demonstration of how to deploy the above solution on your Amazon EKS cluster.

## Conclusion

In this section of Observability best practices guide, we learned about using Grafana Operator and GitOps with Amazon Managed Grafana. We started with learning about GitOps and Grafana Operator. Then we focussed on how to use Grafana Operator on Amazon EKS to manage Amazon Managed Grafana and on how to use GitOps with Flux on Amazon EKS to manage Amazon Managed Grafana to setup an identity with AMG, adding AWS data sources on Amazon Managed Grafana from Amazon EKS cluster in a Kubernetes native way.
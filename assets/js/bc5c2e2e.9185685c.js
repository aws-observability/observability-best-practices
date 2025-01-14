"use strict";(self.webpackChunkobservability_best_practices=self.webpackChunkobservability_best_practices||[]).push([[162],{35922:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>c,contentTitle:()=>i,default:()=>h,frontMatter:()=>a,metadata:()=>r,toc:()=>l});var s=n(74848),o=n(28453);const a={},i="Container Tracing with AWS X-Ray",r={id:"guides/containers/aws-native/eks/container-tracing-with-aws-xray",title:"Container Tracing with AWS X-Ray",description:"In this section of Observability best practices guide, we will deep dive on to following topics related to Container Tracing with AWS X-Ray :",source:"@site/docs/guides/containers/aws-native/eks/container-tracing-with-aws-xray.md",sourceDirName:"guides/containers/aws-native/eks",slug:"/guides/containers/aws-native/eks/container-tracing-with-aws-xray",permalink:"/observability-best-practices/guides/containers/aws-native/eks/container-tracing-with-aws-xray",draft:!1,unlisted:!1,editUrl:"https://github.com/aws-observability/observability-best-practices/blob/main/docusaurus/docs/guides/containers/aws-native/eks/container-tracing-with-aws-xray.md",tags:[],version:"current",frontMatter:{},sidebar:"guides",previous:{title:"Amazon EKS API Server Monitoring",permalink:"/observability-best-practices/guides/containers/aws-native/eks/eks-api-server-monitoring"},next:{title:"EKS Observability : Essential Metrics",permalink:"/observability-best-practices/guides/containers/oss/eks/best-practices-metrics-collection"}},c={},l=[{value:"Introduction",id:"introduction",level:3},{value:"Traces collection using Amazon EKS add-ons for AWS Distro for OpenTelemetry",id:"traces-collection-using-amazon-eks-add-ons-for-aws-distro-for-opentelemetry",level:3},{value:"Deploying the ADOT Collector",id:"deploying-the-adot-collector",level:4},{value:"End-to-end test of traces collection",id:"end-to-end-test-of-traces-collection",level:4},{value:"Using EKS Blueprints to setup container tracing with AWS X-Ray",id:"using-eks-blueprints-to-setup-container-tracing-with-aws-x-ray",level:3},{value:"Conclusion",id:"conclusion",level:2}];function d(e){const t={a:"a",code:"code",em:"em",h1:"h1",h2:"h2",h3:"h3",h4:"h4",img:"img",li:"li",p:"p",pre:"pre",strong:"strong",ul:"ul",...(0,o.R)(),...e.components};return(0,s.jsxs)(s.Fragment,{children:[(0,s.jsx)(t.h1,{id:"container-tracing-with-aws-x-ray",children:"Container Tracing with AWS X-Ray"}),"\n",(0,s.jsx)(t.p,{children:"In this section of Observability best practices guide, we will deep dive on to following topics related to Container Tracing with AWS X-Ray :"}),"\n",(0,s.jsxs)(t.ul,{children:["\n",(0,s.jsx)(t.li,{children:"Introduction to AWS X-Ray"}),"\n",(0,s.jsx)(t.li,{children:"Traces collection using Amazon EKS add-ons for AWS Distro for OpenTelemetry"}),"\n",(0,s.jsx)(t.li,{children:"Conclusion"}),"\n"]}),"\n",(0,s.jsx)(t.h3,{id:"introduction",children:"Introduction"}),"\n",(0,s.jsxs)(t.p,{children:[(0,s.jsx)(t.a,{href:"https://docs.aws.amazon.com/xray/latest/devguide/aws-xray.html",children:"AWS X-Ray"})," is a service that collects data about requests that your application serves, and provides tools that you can use to view, filter, and gain insights into that data to identify issues and opportunities for optimization. For any traced request to your application, you can see detailed information not only about the request and response, but also about calls that your application makes to downstream AWS resources, microservices, databases, and web APIs."]}),"\n",(0,s.jsxs)(t.p,{children:["Instrumenting your application involves sending trace data for incoming and outbound requests and other events within your application, along with metadata about each request. Many instrumentation scenarios require only configuration changes. For example, you can instrument all incoming HTTP requests and downstream calls to AWS services that your Java application makes. There are several SDKs, agents, and tools that can be used to instrument your application for X-Ray tracing. See ",(0,s.jsx)(t.a,{href:"https://docs.aws.amazon.com/xray/latest/devguide/xray-instrumenting-your-app.html",children:"Instrumenting your application"})," for more information."]}),"\n",(0,s.jsx)(t.p,{children:"We will learn about about containerized application tracing by collect traces from your Amazon EKS cluster using Amazon EKS add-ons for AWS Distro for OpenTelemetry."}),"\n",(0,s.jsx)(t.h3,{id:"traces-collection-using-amazon-eks-add-ons-for-aws-distro-for-opentelemetry",children:"Traces collection using Amazon EKS add-ons for AWS Distro for OpenTelemetry"}),"\n",(0,s.jsxs)(t.p,{children:[(0,s.jsx)(t.a,{href:"https://aws.amazon.com/xray/",children:"AWS X-Ray"})," provides application-tracing functionality, giving deep insights into all microservices deployed. With X-Ray, every request can be traced as it flows through the involved microservices. This provides your DevOps teams the insights they need to understand how your services interact with their peers and enables them to analyze and debug issues much faster."]}),"\n",(0,s.jsxs)(t.p,{children:[(0,s.jsx)(t.a,{href:"https://aws-otel.github.io/docs/introduction",children:"AWS Distro for OpenTelemetry (ADOT)"})," is a secure, AWS-supported distribution of the OpenTelemetry project. Users can instrument their applications just once and, using ADOT, send correlated metrics and traces to multiple monitoring solutions. Amazon EKS now allows users to enable ADOT as an add-on at any time after the cluster is up and running. The ADOT add-on includes the latest security patches and bug fixes and is validated by AWS to work with Amazon EKS."]}),"\n",(0,s.jsx)(t.p,{children:"The ADOT add-on is an implementation of a Kubernetes Operator, which is a software extension to Kubernetes that makes use of custom resources to manage applications and their components. The add-on watches for a custom resource named OpenTelemetryCollector and manages the lifecycle of an ADOT Collector based on the configuration settings specified in the custom resource."}),"\n",(0,s.jsxs)(t.p,{children:["The ADOT Collector has the concept of a pipeline that comprises three key types of components, namely, receiver, processor, and exporter. A ",(0,s.jsx)(t.a,{href:"https://opentelemetry.io/docs/collector/configuration/#receivers",children:"receiver"})," is how data gets into the collector. It accepts data in a specific format, translates it into the internal format, and passes it to ",(0,s.jsx)(t.a,{href:"https://opentelemetry.io/docs/collector/configuration/#processors",children:"processors"})," and ",(0,s.jsx)(t.a,{href:"https://opentelemetry.io/docs/collector/configuration/#exporters",children:"exporters"})," defined in the pipeline. It can be pull- or push-based. A processor is an optional component that is used to perform tasks such as batching, filtering, and transformations on data between being received and being exported. An exporter is used to determine which destination to send the metrics, logs, or traces to. The collector architecture allows multiple instances of such pipelines to be set up via a Kubernetes YAML manifest."]}),"\n",(0,s.jsxs)(t.p,{children:["The following diagram illustrates an ADOT Collector configured with a traces pipeline, which sends telemetry data to AWS X-Ray. The traces pipeline comprises an instance of ",(0,s.jsx)(t.a,{href:"https://github.com/open-telemetry/opentelemetry-collector-contrib/tree/main/receiver/awsxrayreceiver",children:"AWS X-Ray Receiver"})," and ",(0,s.jsx)(t.a,{href:"https://github.com/open-telemetry/opentelemetry-collector-contrib/tree/main/exporter/awsxrayexporter",children:"AWS X-Ray Exporter"})," and sends traces to AWS X-Ray."]}),"\n",(0,s.jsx)(t.p,{children:(0,s.jsx)(t.img,{alt:"Tracing-1",src:n(10209).A+"",width:"1236",height:"838"})}),"\n",(0,s.jsx)(t.p,{children:(0,s.jsx)(t.em,{children:"Figure: Traces collection using Amazon EKS add-ons for AWS Distro for OpenTelemetry."})}),"\n",(0,s.jsx)(t.p,{children:"Let\u2019s delve into the details of installing the ADOT add-on in an EKS cluster and then collect telemetry data from workloads. The following is a list of prerequisites needed before we can install the ADOT add-on."}),"\n",(0,s.jsxs)(t.ul,{children:["\n",(0,s.jsxs)(t.li,{children:["An EKS cluster supporting Kubernetes version 1.19 or higher. You may create the EKS cluster using one of the ",(0,s.jsx)(t.a,{href:"https://docs.aws.amazon.com/eks/latest/userguide/create-cluster.html",children:"approaches outlined here"}),"."]}),"\n",(0,s.jsxs)(t.li,{children:[(0,s.jsx)(t.a,{href:"https://cert-manager.io/",children:"Certificate Manager"}),", if not already installed in the cluster. It can be installed with the default configuration as per ",(0,s.jsx)(t.a,{href:"https://cert-manager.io/docs/installation/",children:"this documentation"}),"."]}),"\n",(0,s.jsxs)(t.li,{children:["Kubernetes RBAC permissions specifically for EKS add-ons to install the ADOT add-on in your cluster. This can be done by applying the ",(0,s.jsx)(t.a,{href:"https://amazon-eks.s3.amazonaws.com/docs/addons-otel-permissions.yaml",children:"settings in this YAML"})," file to the cluster using a CLI tool such as kubectl."]}),"\n"]}),"\n",(0,s.jsx)(t.p,{children:"You can check the list of add-ons enabled for different versions of EKS using the following command:"}),"\n",(0,s.jsx)(t.p,{children:(0,s.jsx)(t.code,{children:"aws eks describe-addon-versions"})}),"\n",(0,s.jsx)(t.p,{children:"The JSON output should list the ADOT add-on among others, as shown below. Note that when an EKS cluster is created, EKS add-ons does not install any add-ons on it."}),"\n",(0,s.jsx)(t.pre,{children:(0,s.jsx)(t.code,{children:'{\n   "addonName":"adot",\n   "type":"observability",\n   "addonVersions":[\n      {\n         "addonVersion":"v0.45.0-eksbuild.1",\n         "architecture":[\n            "amd64"\n         ],\n         "compatibilities":[\n            {\n               "clusterVersion":"1.22",\n               "platformVersions":[\n                  "*"\n               ],\n               "defaultVersion":true\n            },\n            {\n               "clusterVersion":"1.21",\n               "platformVersions":[\n                  "*"\n               ],\n               "defaultVersion":true\n            },\n            {\n               "clusterVersion":"1.20",\n               "platformVersions":[\n                  "*"\n               ],\n               "defaultVersion":true\n            },\n            {\n               "clusterVersion":"1.19",\n               "platformVersions":[\n                  "*"\n               ],\n               "defaultVersion":true\n            }\n         ]\n      }\n   ]\n}\n'})}),"\n",(0,s.jsx)(t.p,{children:"Next, you can install the ADOT add-on with the following command :"}),"\n",(0,s.jsx)(t.p,{children:(0,s.jsx)(t.code,{children:"aws eks create-addon --addon-name adot --addon-version v0.45.0-eksbuild.1 --cluster-name $CLUSTER_NAME "})}),"\n",(0,s.jsxs)(t.p,{children:["The version string must match the value of ",(0,s.jsx)(t.em,{children:"addonVersion"})," field in the previously shown output. The output from a successful execution of this command looks as follows:"]}),"\n",(0,s.jsx)(t.pre,{children:(0,s.jsx)(t.code,{children:'{\n    "addon": {\n        "addonName": "adot",\n        "clusterName": "k8s-production-cluster",\n        "status": "ACTIVE",\n        "addonVersion": "v0.45.0-eksbuild.1",\n        "health": {\n            "issues": []\n        },\n        "addonArn": "arn:aws:eks:us-east-1:123456789000:addon/k8s-production-cluster/adot/f0bff97c-0647-ef6f-eecf-0b2a13f7491b",\n        "createdAt": "2022-04-04T10:36:56.966000+05:30",\n        "modifiedAt": "2022-04-04T10:38:09.142000+05:30",\n        "tags": {}\n    }\n}\n'})}),"\n",(0,s.jsx)(t.p,{children:"Wait until the add-on is in ACTIVE status before proceeding to the next step. The status of the add-on can be checked using the following command ;"}),"\n",(0,s.jsx)(t.p,{children:(0,s.jsx)(t.code,{children:"aws eks describe-addon --addon-name adot --cluster-name $CLUSTER_NAME"})}),"\n",(0,s.jsx)(t.h4,{id:"deploying-the-adot-collector",children:"Deploying the ADOT Collector"}),"\n",(0,s.jsx)(t.p,{children:"The ADOT add-on is an implementation of a Kubernetes Operator, which is a software extension to Kubernetes that makes use of custom resources to manage applications and their components. The add-on watches for a custom resource named OpenTelemetryCollector and manages the lifecycle of an ADOT Collector based on the configuration settings specified in the custom resource. The following figure shows an illustration of how this works."}),"\n",(0,s.jsx)(t.p,{children:(0,s.jsx)(t.img,{alt:"Tracing-1",src:n(76950).A+"",width:"1408",height:"962"})}),"\n",(0,s.jsx)(t.p,{children:(0,s.jsx)(t.em,{children:"Figure: Deploying the ADOT Collector."})}),"\n",(0,s.jsxs)(t.p,{children:["Next, let\u2019s take a look at how to deploy an ADOT Collector. The ",(0,s.jsx)(t.a,{href:"https://github.com/aws-observability/aws-o11y-recipes/blob/main/sandbox/eks-addon-adot/otel-collector-xray-prometheus-complete.yaml",children:"YAML configuration file here"})," defines an OpenTelemetryCollector custom resource. When deployed to an EKS cluster, this will trigger the ADOT add-on to provision an ADOT Collector that includes a traces and metrics pipelines with components, as shown in the first illustration above. The collector is launched into the ",(0,s.jsx)(t.code,{children:"aws-otel-eks"})," namespace as a Kubernetes Deployment with the name ",(0,s.jsx)(t.code,{children:"${custom-resource-name}-collector"}),". A ClusterIP service with the same name is launched as well. Let\u2019s look into the individual components that make up the pipelines of this collector."]}),"\n",(0,s.jsxs)(t.p,{children:["The AWS X-Ray Receiver in the traces pipeline accepts segments or spans in ",(0,s.jsx)(t.a,{href:"https://docs.aws.amazon.com/xray/latest/devguide/xray-api-segmentdocuments.html",children:"X-Ray Segment format"}),", which enables it to process segments sent by microservices instrumented with X-Ray SDK. It is configured to listen for traffic on UDP port 2000 and is exposed as a Cluster IP service. Per this configuration, workloads that want to send trace data to this receiver should be configured with the environment variable ",(0,s.jsx)(t.code,{children:"AWS_XRAY_DAEMON_ADDRESS"})," set to ",(0,s.jsx)(t.code,{children:"observability-collector.aws-otel-eks:2000"}),". The exporter sends these segments directly to X-Ray using the ",(0,s.jsx)(t.a,{href:"https://docs.aws.amazon.com/xray/latest/api/API_PutTraceSegments.html",children:"PutTraceSegments"})," API."]}),"\n",(0,s.jsxs)(t.p,{children:["ADOT Collector is configured to be launched under the identity of a Kubernetes service account named ",(0,s.jsx)(t.code,{children:"aws-otel-collector"}),", which is granted these permissions using a ClusterRoleBinding and ClusterRole, also shown in the ",(0,s.jsx)(t.a,{href:"https://github.com/aws-observability/aws-o11y-recipes/blob/main/sandbox/eks-addon-adot/otel-collector-xray-prometheus-complete.yaml",children:"configuration"}),". The exporters need IAM permissions to send data to X-Ray. This is done by associating the service account with an IAM role using the ",(0,s.jsx)(t.a,{href:"https://docs.aws.amazon.com/eks/latest/userguide/iam-roles-for-service-accounts.html",children:"IAM roles for service accounts"})," feature supported by EKS. The IAM role should be associated with the AWS-managed policies such as AWSXRayDaemonWriteAccess. The ",(0,s.jsx)(t.a,{href:"https://github.com/aws-observability/aws-o11y-recipes/blob/main/sandbox/eks-addon-adot/adot-irsa.sh",children:"helper script here"})," may be used, after setting the CLUSTER_NAME and REGION variables, to create an IAM role named ",(0,s.jsx)(t.code,{children:"EKS-ADOT-ServiceAccount-Role"})," that is granted these permissions and is associated with the ",(0,s.jsx)(t.code,{children:"aws-otel-collector"})," service account."]}),"\n",(0,s.jsx)(t.h4,{id:"end-to-end-test-of-traces-collection",children:"End-to-end test of traces collection"}),"\n",(0,s.jsx)(t.p,{children:"Let\u2019s now put all this together and test traces collection from workloads deployed to an EKS cluster. The following illustration shows the setup employed for this test. It comprises a front-end service that exposes a set of REST APIs and interacts with S3 as well as a datastore service that, in turn, interacts with an instance of Aurora PostgreSQL database. The services are instrumented with X-Ray SDK. ADOT Collector is launched in Deployment mode by deploying an OpenTelemetryCollector custom resource using the YAML manifest that was discussed in the last section. Postman client is used as an external traffic generator, targeting the front-end service."}),"\n",(0,s.jsx)(t.p,{children:(0,s.jsx)(t.img,{alt:"Tracing-3",src:n(32211).A+"",width:"1122",height:"692"})}),"\n",(0,s.jsx)(t.p,{children:(0,s.jsx)(t.em,{children:"Figure: End-to-end test of traces collection."})}),"\n",(0,s.jsx)(t.p,{children:"The following image shows the service graph generated by X-Ray using the segment data captured from the services, with the average response latency for each segment."}),"\n",(0,s.jsx)(t.p,{children:(0,s.jsx)(t.img,{alt:"Tracing-4",src:n(91904).A+"",width:"1276",height:"636"})}),"\n",(0,s.jsx)(t.p,{children:"Figure: CloudWatch Service Map console.*"}),"\n",(0,s.jsxs)(t.p,{children:["Please check on ",(0,s.jsx)(t.a,{href:"https://github.com/aws-observability/aws-otel-community/blob/master/sample-configs/operator/collector-config-xray.yaml",children:"Traces pipeline with OTLP Receiver and AWS X-Ray Exporter sending traces to AWS X-Ray"})," for OpenTelemetryCollector custom resource definitions that pertain to traces pipeline configurations. Customers who want to use ADOT Collector in conjunction with AWS X-Ray may start with these configuration templates, replace the placeholder variables with values based on their target environments and quickly deploy the collector to their Amazon EKS clusters using EKS add-on for ADOT."]}),"\n",(0,s.jsx)(t.h3,{id:"using-eks-blueprints-to-setup-container-tracing-with-aws-x-ray",children:"Using EKS Blueprints to setup container tracing with AWS X-Ray"}),"\n",(0,s.jsxs)(t.p,{children:[(0,s.jsx)(t.a,{href:"https://aws.amazon.com/blogs/containers/bootstrapping-clusters-with-eks-blueprints/",children:"EKS Blueprints"})," is a collection of Infrastructure as Code (IaC) modules that will help you configure and deploy consistent, batteries-included EKS clusters across accounts and regions. You can use EKS Blueprints to easily bootstrap an EKS cluster with ",(0,s.jsx)(t.a,{href:"https://docs.aws.amazon.com/eks/latest/userguide/eks-add-ons.html",children:"Amazon EKS add-ons"})," as well as a wide range of popular open-source add-ons, including Prometheus, Karpenter, Nginx, Traefik, AWS Load Balancer Controller, Container Insights, Fluent Bit, Keda, Argo CD, and more. EKS Blueprints is implemented in two popular IaC frameworks, ",(0,s.jsx)(t.a,{href:"https://github.com/aws-ia/terraform-aws-eks-blueprints",children:"HashiCorp Terraform"})," and ",(0,s.jsx)(t.a,{href:"https://github.com/aws-quickstart/cdk-eks-blueprints",children:"AWS Cloud Development Kit (AWS CDK)"}),", which help you automate infrastructure deployments."]}),"\n",(0,s.jsx)(t.p,{children:"As part of your Amazon EKS Cluster creation process using EKS Blueprints, you can setup AWS X-Ray as a Day 2 operational tooling to collect, aggregate, and summarize metrics and logs from containerized applications and micro-services to Amazon CloudWatch console."}),"\n",(0,s.jsx)(t.h2,{id:"conclusion",children:"Conclusion"}),"\n",(0,s.jsxs)(t.p,{children:["In this section of Observability best practices guide, we learned about using AWS X-Ray for container tracing your applications on Amazon EKS by traces collection using Amazon EKS add-ons for AWS Distro for OpenTelemetry. For further learning, please check on ",(0,s.jsx)(t.a,{href:"https://aws.amazon.com/blogs/containers/metrics-and-traces-collection-using-amazon-eks-add-ons-for-aws-distro-for-opentelemetry/",children:"Metrics and traces collection using Amazon EKS add-ons for AWS Distro for OpenTelemetry to Amazon Managed Service for Prometheus and Amazon CloudWatch."})," Finally we talked in brief about how use EKS Blueprints as a vehicle to setup Container tracing using AWS X-Ray during the Amazon EKS cluster creation process. For further deep dive, we would highly recommend you to practice X-Ray Traces module under ",(0,s.jsx)(t.strong,{children:"AWS native"})," Observability category of AWS ",(0,s.jsx)(t.a,{href:"https://catalog.workshops.aws/observability/en-US",children:"One Observability Workshop"}),"."]})]})}function h(e={}){const{wrapper:t}={...(0,o.R)(),...e.components};return t?(0,s.jsx)(t,{...e,children:(0,s.jsx)(d,{...e})}):d(e)}},10209:(e,t,n)=>{n.d(t,{A:()=>s});const s=n.p+"assets/images/tracing-1-68aa93b75d26cd6481b1c810eb0db81a.jpg"},76950:(e,t,n)=>{n.d(t,{A:()=>s});const s=n.p+"assets/images/tracing-2-a28ca2c92462910a4d7a18350f4079b7.jpg"},32211:(e,t,n)=>{n.d(t,{A:()=>s});const s=n.p+"assets/images/tracing-3-6eff725e6b951b40fb4b621ea0e39ee4.jpg"},91904:(e,t,n)=>{n.d(t,{A:()=>s});const s=n.p+"assets/images/tracing-4-eda3b20a8a77493e3aaf43d2f3e7e54e.jpg"},28453:(e,t,n)=>{n.d(t,{R:()=>i,x:()=>r});var s=n(96540);const o={},a=s.createContext(o);function i(e){const t=s.useContext(a);return s.useMemo((function(){return"function"==typeof e?e(t):{...t,...e}}),[t,e])}function r(e){let t;return t=e.disableParentContext?"function"==typeof e.components?e.components(o):e.components||o:i(e.components),s.createElement(a.Provider,{value:t},e.children)}}}]);
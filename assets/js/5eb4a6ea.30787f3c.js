"use strict";(self.webpackChunkobservability_best_practices=self.webpackChunkobservability_best_practices||[]).push([[5324],{28453:(e,n,s)=>{s.d(n,{R:()=>t,x:()=>o});var i=s(96540);const r={},a=i.createContext(r);function t(e){const n=i.useContext(a);return i.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function o(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(r):e.components||r:t(e.components),i.createElement(a.Provider,{value:n},e.children)}},80668:(e,n,s)=>{s.r(n),s.d(n,{assets:()=>c,contentTitle:()=>t,default:()=>d,frontMatter:()=>a,metadata:()=>o,toc:()=>l});var i=s(74848),r=s(28453);const a={},t="Amazon Elastic Kubernetes Service",o={id:"recipes/eks",title:"Amazon Elastic Kubernetes Service",description:"Amazon Elastic Kubernetes Service (EKS) gives you the flexibility to",source:"@site/docs/recipes/eks.md",sourceDirName:"recipes",slug:"/recipes/eks",permalink:"/observability-best-practices/recipes/eks",draft:!1,unlisted:!1,editUrl:"https://github.com/aws-observability/observability-best-practices/blob/main/docusaurus/docs/recipes/eks.md",tags:[],version:"current",frontMatter:{},sidebar:"recipes",previous:{title:"AWS App Runner",permalink:"/observability-best-practices/recipes/apprunner"},next:{title:"Amazon Elastic Container Service",permalink:"/observability-best-practices/recipes/ecs"}},c={},l=[{value:"EKS on EC2",id:"eks-on-ec2",level:2},{value:"Logs",id:"logs",level:3},{value:"Metrics",id:"metrics",level:3},{value:"Traces",id:"traces",level:3},{value:"EKS on Fargate",id:"eks-on-fargate",level:2},{value:"Logs",id:"logs-1",level:3},{value:"Metrics",id:"metrics-1",level:3},{value:"Traces",id:"traces-1",level:3}];function h(e){const n={a:"a",h1:"h1",h2:"h2",h3:"h3",li:"li",p:"p",ul:"ul",...(0,r.R)(),...e.components};return(0,i.jsxs)(i.Fragment,{children:[(0,i.jsx)(n.h1,{id:"amazon-elastic-kubernetes-service",children:"Amazon Elastic Kubernetes Service"}),"\n",(0,i.jsxs)(n.p,{children:[(0,i.jsx)(n.a,{href:"https://aws.amazon.com/eks/",children:"Amazon Elastic Kubernetes Service"})," (EKS) gives you the flexibility to\nstart, run, and scale Kubernetes applications in the AWS Cloud or on-premises."]}),"\n",(0,i.jsx)(n.p,{children:"Check out the following recipes, grouped by compute engine:"}),"\n",(0,i.jsx)(n.h2,{id:"eks-on-ec2",children:"EKS on EC2"}),"\n",(0,i.jsx)(n.h3,{id:"logs",children:"Logs"}),"\n",(0,i.jsxs)(n.ul,{children:["\n",(0,i.jsx)(n.li,{children:(0,i.jsx)(n.a,{href:"https://aws.amazon.com/blogs/containers/fluent-bit-integration-in-cloudwatch-container-insights-for-eks/",children:"Fluent Bit Integration in CloudWatch Container Insights for EKS"})}),"\n",(0,i.jsx)(n.li,{children:(0,i.jsx)(n.a,{href:"https://www.eksworkshop.com/intermediate/230_logging/",children:"Logging with EFK Stack"})}),"\n",(0,i.jsx)(n.li,{children:(0,i.jsx)(n.a,{href:"https://github.com/aws-samples/amazon-eks-fluent-logging-examples",children:"Sample logging architectures for Fluent Bit and FluentD on EKS"})}),"\n"]}),"\n",(0,i.jsx)(n.h3,{id:"metrics",children:"Metrics"}),"\n",(0,i.jsxs)(n.ul,{children:["\n",(0,i.jsx)(n.li,{children:(0,i.jsx)(n.a,{href:"https://aws.amazon.com/blogs/mt/getting-started-amazon-managed-service-for-prometheus/",children:"Getting Started with Amazon Managed Service for Prometheus"})}),"\n",(0,i.jsx)(n.li,{children:(0,i.jsx)(n.a,{href:"/observability-best-practices/recipes/recipes/ec2-eks-metrics-go-adot-ampamg",children:"Using ADOT in EKS on EC2 to ingest metrics to AMP and visualize in AMG"})}),"\n",(0,i.jsx)(n.li,{children:(0,i.jsx)(n.a,{href:"https://aws.amazon.com/blogs/opensource/configuring-grafana-cloud-agent-for-amazon-managed-service-for-prometheus/",children:"Configuring Grafana Cloud Agent for Amazon Managed Service for Prometheus"})}),"\n",(0,i.jsx)(n.li,{children:(0,i.jsx)(n.a,{href:"https://www.eksworkshop.com/intermediate/240_monitoring/",children:"Monitoring cluster using Prometheus and Grafana"})}),"\n",(0,i.jsx)(n.li,{children:(0,i.jsx)(n.a,{href:"https://www.eksworkshop.com/intermediate/246_monitoring_amp_amg/",children:"Monitoring with Managed Prometheus and Managed Grafana"})}),"\n",(0,i.jsx)(n.li,{children:(0,i.jsx)(n.a,{href:"https://www.eksworkshop.com/intermediate/250_cloudwatch_container_insights/",children:"CloudWatch Container Insights"})}),"\n",(0,i.jsx)(n.li,{children:(0,i.jsx)(n.a,{href:"https://aws.amazon.com/blogs/opensource/set-up-cross-region-metrics-collection-for-amazon-managed-service-for-prometheus-workspaces/",children:"Set up cross-region metrics collection for AMP workspaces"})}),"\n",(0,i.jsx)(n.li,{children:(0,i.jsx)(n.a,{href:"/observability-best-practices/recipes/recipes/servicemesh-monitoring-ampamg",children:"Monitoring App Mesh environment on EKS using Amazon Managed Service for Prometheus"})}),"\n",(0,i.jsx)(n.li,{children:(0,i.jsx)(n.a,{href:"https://aws.amazon.com/blogs/mt/monitor-istio-on-eks-using-amazon-managed-prometheus-and-amazon-managed-grafana/",children:"Monitor Istio on EKS using Amazon Managed Prometheus and Amazon Managed Grafana"})}),"\n",(0,i.jsx)(n.li,{children:(0,i.jsx)(n.a,{href:"https://aws.amazon.com/blogs/mt/proactive-autoscaling-of-kubernetes-workloads-with-keda-using-metrics-ingested-into-amazon-cloudwatch/",children:"Proactive autoscaling of Kubernetes workloads with KEDA and Amazon CloudWatch"})}),"\n",(0,i.jsx)(n.li,{children:(0,i.jsx)(n.a,{href:"https://aws.amazon.com/blogs/containers/monitoring-amazon-eks-anywhere-using-amazon-managed-service-for-prometheus-and-amazon-managed-grafana/",children:"Monitoring Amazon EKS Anywhere using Amazon Managed Service for Prometheus and Amazon Managed Grafana"})}),"\n"]}),"\n",(0,i.jsx)(n.h3,{id:"traces",children:"Traces"}),"\n",(0,i.jsxs)(n.ul,{children:["\n",(0,i.jsx)(n.li,{children:(0,i.jsx)(n.a,{href:"https://aws.amazon.com/blogs/opensource/migrating-x-ray-tracing-to-aws-distro-for-opentelemetry/",children:"Migrating X-Ray tracing to AWS Distro for OpenTelemetry"})}),"\n",(0,i.jsx)(n.li,{children:(0,i.jsx)(n.a,{href:"https://www.eksworkshop.com/intermediate/245_x-ray/x-ray/",children:"Tracing with X-Ray"})}),"\n"]}),"\n",(0,i.jsx)(n.h2,{id:"eks-on-fargate",children:"EKS on Fargate"}),"\n",(0,i.jsx)(n.h3,{id:"logs-1",children:"Logs"}),"\n",(0,i.jsxs)(n.ul,{children:["\n",(0,i.jsx)(n.li,{children:(0,i.jsx)(n.a,{href:"https://aws.amazon.com/blogs/containers/fluent-bit-for-amazon-eks-on-aws-fargate-is-here/",children:"Fluent Bit for Amazon EKS on AWS Fargate is here"})}),"\n",(0,i.jsx)(n.li,{children:(0,i.jsx)(n.a,{href:"https://github.com/aws-samples/amazon-eks-fluent-logging-examples",children:"Sample logging architectures for Fluent Bit and FluentD on EKS"})}),"\n"]}),"\n",(0,i.jsx)(n.h3,{id:"metrics-1",children:"Metrics"}),"\n",(0,i.jsxs)(n.ul,{children:["\n",(0,i.jsx)(n.li,{children:(0,i.jsx)(n.a,{href:"/observability-best-practices/recipes/recipes/fargate-eks-metrics-go-adot-ampamg",children:"Using ADOT in EKS on Fargate to ingest metrics to AMP and visualize in AMG"})}),"\n",(0,i.jsx)(n.li,{children:(0,i.jsx)(n.a,{href:"https://www.eksworkshop.com/intermediate/250_cloudwatch_container_insights/",children:"CloudWatch Container Insights"})}),"\n",(0,i.jsx)(n.li,{children:(0,i.jsx)(n.a,{href:"https://aws.amazon.com/blogs/opensource/set-up-cross-region-metrics-collection-for-amazon-managed-service-for-prometheus-workspaces/",children:"Set up cross-region metrics collection for AMP workspaces"})}),"\n"]}),"\n",(0,i.jsx)(n.h3,{id:"traces-1",children:"Traces"}),"\n",(0,i.jsxs)(n.ul,{children:["\n",(0,i.jsx)(n.li,{children:(0,i.jsx)(n.a,{href:"/observability-best-practices/recipes/recipes/fargate-eks-xray-go-adot-amg",children:"Using ADOT in EKS on Fargate with AWS X-Ray"})}),"\n",(0,i.jsx)(n.li,{children:(0,i.jsx)(n.a,{href:"https://www.eksworkshop.com/intermediate/245_x-ray/x-ray/",children:"Tracing with X-Ray"})}),"\n"]})]})}function d(e={}){const{wrapper:n}={...(0,r.R)(),...e.components};return n?(0,i.jsx)(n,{...e,children:(0,i.jsx)(h,{...e})}):h(e)}}}]);
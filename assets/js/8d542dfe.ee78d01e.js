"use strict";(self.webpackChunkobservability_best_practices=self.webpackChunkobservability_best_practices||[]).push([[6749],{51904:(e,t,o)=>{o.r(t),o.d(t,{assets:()=>c,contentTitle:()=>a,default:()=>l,frontMatter:()=>n,metadata:()=>i,toc:()=>h});var s=o(74848),r=o(28453);const n={},a="Amazon Managed Service for Prometheus - FAQ",i={id:"faq/amp",title:"Amazon Managed Service for Prometheus - FAQ",description:"1. Which AWS Regions are supported currently and is it possible to collect metrics from other regions? See our documentation for updated list of Regions that we support. We plan to support all commercial regions in 2023. Please let us know which regions you would like so that we can better prioritize our existing Product Feature Requests (PFRs). You can always collect data from any regions and send it to a specific region that we support. Here\u2019s a blog for more details: Cross-region metrics collection for Amazon Managed Service for Prometheus.",source:"@site/docs/faq/amp.md",sourceDirName:"faq",slug:"/faq/amp",permalink:"/observability-best-practices/docs/faq/amp",draft:!1,unlisted:!1,editUrl:"https://github.com/aws-observability/observability-best-practices/blob/main/docusaurus/docs/faq/amp.md",tags:[],version:"current",frontMatter:{},sidebar:"faq",previous:{title:"AWS X-Ray - FAQ",permalink:"/observability-best-practices/docs/faq/x-ray"},next:{title:"Amazon Managed Grafana - FAQ",permalink:"/observability-best-practices/docs/faq/amg"}},c={},h=[];function m(e){const t={a:"a",em:"em",h1:"h1",li:"li",ol:"ol",p:"p",strong:"strong",...(0,r.R)(),...e.components};return(0,s.jsxs)(s.Fragment,{children:[(0,s.jsx)(t.h1,{id:"amazon-managed-service-for-prometheus---faq",children:"Amazon Managed Service for Prometheus - FAQ"}),"\n",(0,s.jsxs)(t.ol,{children:["\n",(0,s.jsxs)(t.li,{children:["\n",(0,s.jsxs)(t.p,{children:[(0,s.jsx)(t.strong,{children:"Which AWS Regions are supported currently and is it possible to collect metrics from other regions?"})," See our ",(0,s.jsx)(t.a,{href:"https://docs.aws.amazon.com/prometheus/latest/userguide/what-is-Amazon-Managed-Service-Prometheus.html",children:"documentation"})," for updated list of Regions that we support. We plan to support all commercial regions in 2023. Please let us know which regions you would like so that we can better prioritize our existing Product Feature Requests (PFRs). You can always collect data from any regions and send it to a specific region that we support. Here\u2019s a blog for more details: ",(0,s.jsx)(t.a,{href:"https://aws.amazon.com/blogs/opensource/set-up-cross-region-metrics-collection-for-amazon-managed-service-for-prometheus-workspaces/",children:"Cross-region metrics collection for Amazon Managed Service for Prometheus"}),"."]}),"\n"]}),"\n",(0,s.jsxs)(t.li,{children:["\n",(0,s.jsxs)(t.p,{children:[(0,s.jsxs)(t.strong,{children:["How long does it take to see metering and/or billing in Cost Explorer or **** ",(0,s.jsx)(t.a,{href:"https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/gs_monitor_estimated_charges_with_cloudwatch.html",children:"CloudWatch as AWS billing charges"}),"?"]}),"\nWe meter blocks of ingested metric samples as soon as they are uploaded to S3 every 2 hours. It can take up to 3 hours to see metering and charges reported for Amazon Managed Service for Prometheus."]}),"\n"]}),"\n",(0,s.jsxs)(t.li,{children:["\n",(0,s.jsxs)(t.p,{children:[(0,s.jsx)(t.strong,{children:"As far as I can see the Prometheus Service is only able to scrape metrics from a cluster (EKS/ECS) Is that correct?"}),"\nWe apologize for the lack of documentation for other compute environments. You can use Prometheus server to scrape ",(0,s.jsx)(t.a,{href:"https://aws.amazon.com/blogs/opensource/using-amazon-managed-service-for-prometheus-to-monitor-ec2-environments/",children:"Prometheus metrics from EC2"})," and any other compute environments where you can install a Prometheus server today as long as you configure the remote write and setup the ",(0,s.jsx)(t.a,{href:"https://github.com/awslabs/aws-sigv4-proxy",children:"AWS SigV4 proxy"}),". The link to the ",(0,s.jsx)(t.a,{href:"https://aws.amazon.com/blogs/opensource/using-amazon-managed-service-for-prometheus-to-monitor-ec2-environments/",children:"EC2 blog"})," has a section \u201cRunning aws-sigv4-proxy\u201d that can show you how to run it. We do need to add more documentation to help our customers simplify how to run AWS SigV4 on other compute environments."]}),"\n"]}),"\n",(0,s.jsxs)(t.li,{children:["\n",(0,s.jsxs)(t.p,{children:[(0,s.jsx)(t.strong,{children:"How would one connect this service to Grafana? Is there some documentation about this?"}),"\nWe use the default ",(0,s.jsx)(t.a,{href:"https://grafana.com/docs/grafana/latest/datasources/prometheus/",children:"Prometheus data source available in Grafana"})," to query Amazon Managed Service for Prometheus using PromQL. Here\u2019s some documentation and a blog that will help you get started:"]}),"\n",(0,s.jsxs)(t.ol,{children:["\n",(0,s.jsx)(t.li,{children:(0,s.jsx)(t.a,{href:"https://docs.aws.amazon.com/prometheus/latest/userguide/AMP-onboard-query.html",children:"Service docs"})}),"\n",(0,s.jsx)(t.li,{children:(0,s.jsx)(t.a,{href:"https://aws.amazon.com/blogs/opensource/setting-up-grafana-on-ec2-to-query-metrics-from-amazon-managed-service-for-prometheus/",children:"Grafana setup on EC2"})}),"\n"]}),"\n"]}),"\n",(0,s.jsxs)(t.li,{children:["\n",(0,s.jsxs)(t.p,{children:[(0,s.jsx)(t.strong,{children:"What are some of the best practices to reduce the number of samples being sent to Amazon Managed Service for Prometheus?"}),"\nTo reduce the number of samples being ingested into Amazon Managed Service for Prometheus, customers can extend their scrape interval (e.g., change from 30s to 1min) or decrease the number of series they are scraping. Changing the scrape interval will have a more dramatic impact on the number of samples than decreasing the number of series, with doubling the scrape interval halving the volume of samples ingested."]}),"\n"]}),"\n",(0,s.jsxs)(t.li,{children:["\n",(0,s.jsxs)(t.p,{children:[(0,s.jsx)(t.strong,{children:"How to send CloudWatch metrics to Amazon Managed Service for Prometheus?"}),"\nWe recommend utilizing ",(0,s.jsx)(t.a,{href:"https://aws-observability.github.io/observability-best-practices/recipes/recipes/lambda-cw-metrics-go-amp/",children:"CloudWatch metric streams to send CloudWatch metrics to Amazon Managed Service for Prometheus"}),". Some possible shortcomings of this integration are,"]}),"\n",(0,s.jsxs)(t.ol,{children:["\n",(0,s.jsx)(t.li,{children:"A Lambda function is required to call the Amazon Managed Service for Prometheus APIs,"}),"\n",(0,s.jsx)(t.li,{children:"No ability to enrich CloudWatch metrics with metadata (e.g., with AWS tags) before ingesting them to Amazon Managed Service for Prometheus,"}),"\n",(0,s.jsx)(t.li,{children:"Metrics can only be filtered by namespace (not granular enough). As an alternative, customers can utilize Prometheus Exporters to send CloudWatch metrics data to Amazon Managed Service for Prometheus: (1) CloudWatch  Exporter: Java based scraping that uses CW ListMetrics and  GetMetricStatistics (GMS) APIs."}),"\n"]}),"\n",(0,s.jsxs)(t.p,{children:[(0,s.jsx)(t.a,{href:"https://github.com/nerdswords/yet-another-cloudwatch-exporter",children:(0,s.jsx)(t.strong,{children:"Yet Another CloudWatch Exporter (YACE)"})})," is another option to get metrics from CloudWatch into Amazon Managed Service for Prometheus. This is a Go based tool that uses the CW ListMetrics, GetMetricData (GMD), and  GetMetricStatistics (GMS) APIs. Some disadvantages in using this could be that you will have to deploy the agent and have to manage the life-cycle yourself which has to be done thoughtfully."]}),"\n"]}),"\n",(0,s.jsxs)(t.li,{children:["\n",(0,s.jsxs)(t.p,{children:["**What version of Prometheus are you compatible with?\n",(0,s.jsxs)(t.em,{children:[(0,s.jsxs)(t.em,{children:["Amazon Managed Service for Prometheus is compatible with ",(0,s.jsx)(t.a,{href:"https://github.com/prometheus/prometheus/blob/main/RELEASE.md",children:"Prometheus 2.x"}),". Amazon Managed Service for Prometheus is based on the open source ",(0,s.jsx)(t.a,{href:"https://cortexmetrics.io/",children:"CNCF Cortex project"})," as its data plane. Cortex strives to be 100% API compatible with Prometheus (under /prometheus/"]})," and /api/prom/"]}),"). Amazon Managed Service for Prometheus supports Prometheus-compatible PromQL queries and Remote write metric ingestion and the Prometheus data model for existing metric types including Gauge, Counters, Summary, and Histogram. We do not currently expose ",(0,s.jsx)(t.a,{href:"https://cortexmetrics.io/docs/api/",children:"all Cortex APIs"}),". The list of compatible APIs we support can be ",(0,s.jsx)(t.a,{href:"https://docs.aws.amazon.com/prometheus/latest/userguide/AMP-APIReference.html",children:"found here"}),". Customers can work with their account team to open new or influence existing Product Features Requests (PFRs) if we are missing any features required from Amazon Managed Service for Prometheus."]}),"\n"]}),"\n",(0,s.jsxs)(t.li,{children:["\n",(0,s.jsx)(t.p,{children:"**What collector do you recommend for ingesting metrics into Amazon Managed Service for Prometheus? Should I utilize Prometheus in Agent mode?\n**We support the usage of Prometheus servers inclusive of agent mode, the OpenTelemetry agent, and the AWS Distro for OpenTelemetry agent as agents that customers can use to send metrics data to Amazon Managed Service for Prometheus. The AWS Distro for OpenTelemetry is a downstream distribution of the OpenTelemetry project packaged and secured by AWS. Any of the three should be fine, and you\u2019re welcome to pick whichever best suits your individual team\u2019s needs and preferences."}),"\n"]}),"\n",(0,s.jsxs)(t.li,{children:["\n",(0,s.jsxs)(t.p,{children:[(0,s.jsx)(t.strong,{children:"How does Amazon Managed Service for Prometheus\u2019s performance scale with the size of a workspace?"}),"\nCurrently, Amazon Managed Service for Prometheus supports up to 200M active time series in a single workspace. When we announce a new max limit, we\u2019re ensuring that the performance and reliability properties of the service continue to be maintained across ingest and query. Queries across the same size dataset should not see a performance degradation regardless of the number of active series in a workspace."]}),"\n"]}),"\n",(0,s.jsxs)(t.li,{children:["\n",(0,s.jsxs)(t.p,{children:[(0,s.jsx)(t.strong,{children:"Product FAQ"})," ",(0,s.jsx)(t.a,{href:".",children:"https://aws.amazon.com/prometheus/faqs/"})]}),"\n"]}),"\n"]})]})}function l(e={}){const{wrapper:t}={...(0,r.R)(),...e.components};return t?(0,s.jsx)(t,{...e,children:(0,s.jsx)(m,{...e})}):m(e)}},28453:(e,t,o)=>{o.d(t,{R:()=>a,x:()=>i});var s=o(96540);const r={},n=s.createContext(r);function a(e){const t=s.useContext(n);return s.useMemo((function(){return"function"==typeof e?e(t):{...t,...e}}),[t,e])}function i(e){let t;return t=e.disableParentContext?"function"==typeof e.components?e.components(r):e.components||r:a(e.components),s.createElement(n.Provider,{value:t},e.children)}}}]);
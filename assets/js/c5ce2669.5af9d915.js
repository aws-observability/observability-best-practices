"use strict";(self.webpackChunkobservability_best_practices=self.webpackChunkobservability_best_practices||[]).push([[5044],{26278:(e,t,s)=>{s.r(t),s.d(t,{assets:()=>r,contentTitle:()=>o,default:()=>d,frontMatter:()=>a,metadata:()=>c,toc:()=>l});var n=s(74848),i=s(28453);const a={},o="Collecting system metrics with Container Insights",c={id:"guides/containers/aws-native/ecs/best-practices-metrics-collection-1",title:"Collecting system metrics with Container Insights",description:"System metrics pertain to low-level resources that include physical components on a server such as CPU, memory, disks and network interfaces.",source:"@site/docs/guides/containers/aws-native/ecs/best-practices-metrics-collection-1.md",sourceDirName:"guides/containers/aws-native/ecs",slug:"/guides/containers/aws-native/ecs/best-practices-metrics-collection-1",permalink:"/observability-best-practices/docs/guides/containers/aws-native/ecs/best-practices-metrics-collection-1",draft:!1,unlisted:!1,editUrl:"https://github.com/aws-observability/observability-best-practices/blob/main/docusaurus/docs/guides/containers/aws-native/ecs/best-practices-metrics-collection-1.md",tags:[],version:"current",frontMatter:{},sidebar:"guides",previous:{title:"EC2 Monitoring and Observability",permalink:"/observability-best-practices/docs/guides/ec2-monitoring"},next:{title:"Collecting service metrics with Container Insights",permalink:"/observability-best-practices/docs/guides/containers/aws-native/ecs/best-practices-metrics-collection-2"}},r={},l=[{value:"Collecting cluster-level and service-level metrics",id:"collecting-cluster-level-and-service-level-metrics",level:2},{value:"Collecting instance-level metrics",id:"collecting-instance-level-metrics",level:2},{value:"Analyzing performance log events with Logs Insights",id:"analyzing-performance-log-events-with-logs-insights",level:2}];function h(e){const t={a:"a",admonition:"admonition",code:"code",em:"em",h1:"h1",h2:"h2",img:"img",p:"p",pre:"pre",...(0,i.R)(),...e.components};return(0,n.jsxs)(n.Fragment,{children:[(0,n.jsx)(t.h1,{id:"collecting-system-metrics-with-container-insights",children:"Collecting system metrics with Container Insights"}),"\n",(0,n.jsxs)(t.p,{children:["System metrics pertain to low-level resources that include physical components on a server such as CPU, memory, disks and network interfaces.\nUse ",(0,n.jsx)(t.a,{href:"https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/ContainerInsights.html",children:"CloudWatch Container Insights"})," to collect, aggregate, and summarize system metrics from containerized applications deployed to Amazon ECS. Container Insights also provides diagnostic information, such as container restart failures, to help isolate issues and resolve them quickly. It is available for Amazon ECS clusters deployed on EC2 and Fargate."]}),"\n",(0,n.jsxs)(t.p,{children:["Container Insights collects data as performance log events using ",(0,n.jsx)(t.a,{href:"https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch_Embedded_Metric_Format.html",children:"embedded metric format"}),". These performance log events are entries that use a structured JSON schema that enables high-cardinality data to be ingested and stored at scale. From this data, CloudWatch creates aggregated metrics at the cluster, node, service and task level as CloudWatch metrics."]}),"\n",(0,n.jsxs)(t.admonition,{type:"note",children:[(0,n.jsx)(t.p,{children:"For Container Insights metrics to appear in CloudWatch, you must enable Container Insights on your Amazon ECS clusters. This can be done either at the account level or at the individual cluster level. To enable at the account level, use the following AWS CLI command:"}),(0,n.jsx)(t.pre,{children:(0,n.jsx)(t.code,{children:'aws ecs put-account-setting --name "containerInsights" --value "enabled\n'})}),(0,n.jsx)(t.p,{children:"To enable at the individual cluster level, use the following AWS CLI command:"}),(0,n.jsx)(t.pre,{children:(0,n.jsx)(t.code,{children:"aws ecs update-cluster-settings --cluster $CLUSTER_NAME --settings name=containerInsights,value=enabled\n"})})]}),"\n",(0,n.jsx)(t.h2,{id:"collecting-cluster-level-and-service-level-metrics",children:"Collecting cluster-level and service-level metrics"}),"\n",(0,n.jsxs)(t.p,{children:["By default, CloudWatch Container Insights collects metrics at the task, service and cluster level. The Amazon ECS agent collects these metrics for each task on an EC2 container instance (for both ECS on EC2 and ECS on Fargate) and sends them to CloudWatch as performance log events. You don't need to deploy any agents to the cluster. These log events from which the metrics are extracted are collected under the CloudWatch log group named ",(0,n.jsx)(t.em,{children:"/aws/ecs/containerinsights/$CLUSTER_NAME/performance"}),". The complete list of metrics extracted from these events are ",(0,n.jsx)(t.a,{href:"https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Container-Insights-metrics-ECS.html",children:"documented here"}),". The metrics that Container Insights collects are readily viewable in pre-built dashboards available in the CloudWatch console by selcting ",(0,n.jsx)(t.em,{children:"Container Insights"})," from the navigation page and then selecting ",(0,n.jsx)(t.em,{children:"performance monitoring"})," from the dropdown list. They are also viewable in the ",(0,n.jsx)(t.em,{children:"Metrics"})," section of the CloudWatch console."]}),"\n",(0,n.jsx)(t.p,{children:(0,n.jsx)(t.img,{alt:"Container Insights metrics dashboard",src:s(68131).A+"",width:"2694",height:"1416"})}),"\n",(0,n.jsx)(t.admonition,{type:"note",children:(0,n.jsx)(t.p,{children:"If you're using Amazon ECS on an Amazon EC2 instance, and you want to collect network and storage metrics from Container Insights, launch that instance using an AMI that includes Amazon ECS agent version 1.29."})}),"\n",(0,n.jsx)(t.admonition,{type:"warning",children:(0,n.jsxs)(t.p,{children:["Metrics collected by Container Insights are charged as custom metrics. For more information about CloudWatch pricing, see ",(0,n.jsx)(t.a,{href:"https://aws.amazon.com/cloudwatch/pricing/",children:"Amazon CloudWatch Pricing"})]})}),"\n",(0,n.jsx)(t.h2,{id:"collecting-instance-level-metrics",children:"Collecting instance-level metrics"}),"\n",(0,n.jsxs)(t.p,{children:["Deploying the CloudWatch agent to an Amazon ECS cluster hosted on EC2, allows you to collect instance-level metrics from the cluster. The agent is deployed as a daemon service and sends instance-level metrics as performance log events from each EC2 container instance in the cluster. The complete list of instance-level extracted from these events are ",(0,n.jsx)(t.a,{href:"https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Container-Insights-metrics-ECS.html",children:"documented here"})]}),"\n",(0,n.jsx)(t.admonition,{type:"info",children:(0,n.jsxs)(t.p,{children:["Steps to deploy the CloudWatch agent to an Amazon ECS cluster to collect instance-level metrics are documented in the ",(0,n.jsx)(t.a,{href:"https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/deploy-container-insights-ECS-instancelevel.html",children:"Amazon CloudWatch User Guide"}),". Note that this option is not availavble for Amazon ECS clusters that are hosted on Fargate."]})}),"\n",(0,n.jsx)(t.h2,{id:"analyzing-performance-log-events-with-logs-insights",children:"Analyzing performance log events with Logs Insights"}),"\n",(0,n.jsxs)(t.p,{children:["Container Insights collects metrics by using performance log events with embedded metric format. Each log event may contain performance data observed on system resources such as CPU and memory or ECS resources such as tasks and services. Examples of performance log events that Container Insights collects from an Amazon ECS at the cluster, service, task and container level are ",(0,n.jsx)(t.a,{href:"https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Container-Insights-reference-performance-logs-ECS.html",children:"listed here"}),". CloudWatch generates metrics based only on some of the performance data in these log events. But you can use these log events to perform a deeper analysis of the performance data using CloudWatch Logs Insights queries."]}),"\n",(0,n.jsxs)(t.p,{children:["The user interface to run Logs Insights queries is available in the CloudWatch console by selecting ",(0,n.jsx)(t.em,{children:"Logs Insights"})," from the navigation page. When you select a log group, CloudWatch Logs Insights automatically detects fields in the performance log events in the log group and displays them in ",(0,n.jsx)(t.em,{children:"Discovered"})," fields in the right pane. The results of a query execution are displayed as a bar graph of log events in this log group over time. This bar graph shows the distribution of events in the log group that matches your query and time range."]}),"\n",(0,n.jsx)(t.p,{children:(0,n.jsx)(t.img,{alt:"Logs Insights dashboard",src:s(83685).A+"",width:"1882",height:"1718"})}),"\n",(0,n.jsxs)(t.admonition,{type:"info",children:[(0,n.jsx)(t.p,{children:"Here's a sample Logs Insights query to display container-level metrics for CPU and memory usage."}),(0,n.jsx)(t.pre,{children:(0,n.jsx)(t.code,{children:"stats avg(CpuUtilized) as CPU, avg(MemoryUtilized) as Mem by TaskId, ContainerName | sort Mem, CPU desc\n"})})]})]})}function d(e={}){const{wrapper:t}={...(0,i.R)(),...e.components};return t?(0,n.jsx)(t,{...e,children:(0,n.jsx)(h,{...e})}):h(e)}},68131:(e,t,s)=>{s.d(t,{A:()=>n});const n=s.p+"assets/images/ContainerInsightsMetrics-589297ecbdecf420593ca5a49a49b62b.png"},83685:(e,t,s)=>{s.d(t,{A:()=>n});const n=s.p+"assets/images/LogInsights-2d76eb699dc7cbc972441815da930ad9.png"},28453:(e,t,s)=>{s.d(t,{R:()=>o,x:()=>c});var n=s(96540);const i={},a=n.createContext(i);function o(e){const t=n.useContext(a);return n.useMemo((function(){return"function"==typeof e?e(t):{...t,...e}}),[t,e])}function c(e){let t;return t=e.disableParentContext?"function"==typeof e.components?e.components(i):e.components||i:o(e.components),n.createElement(a.Provider,{value:t},e.children)}}}]);
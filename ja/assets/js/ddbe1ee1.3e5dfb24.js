"use strict";(self.webpackChunkobservability_best_practices=self.webpackChunkobservability_best_practices||[]).push([[5300],{12933:(i,n,e)=>{e.r(n),e.d(n,{assets:()=>l,contentTitle:()=>s,default:()=>d,frontMatter:()=>o,metadata:()=>r,toc:()=>c});var a=e(74848),t=e(28453);const o={},s="APM with Application Signals",r={id:"patterns/apmappsignals",title:"APM with Application Signals",description:"In the ever-evolving world of modern application development, ensuring optimal performance and meeting service level objectives (SLOs) is crucial for providing a seamless user experience and maintaining business continuity. Amazon CloudWatch Application Signals, an OpenTelemetry (OTel) compatible application performance monitoring (APM) feature, revolutionizes the way organizations monitor and troubleshoot their applications running on AWS.",source:"@site/docs/patterns/apmappsignals.md",sourceDirName:"patterns",slug:"/patterns/apmappsignals",permalink:"/observability-best-practices/ja/docs/patterns/apmappsignals",draft:!1,unlisted:!1,editUrl:"https://github.com/aws-observability/observability-best-practices/blob/main/docusaurus/docs/patterns/apmappsignals.md",tags:[],version:"current",frontMatter:{},sidebar:"patterns",previous:{title:"Pushing Metrics from EKS to Prometheus",permalink:"/observability-best-practices/ja/docs/patterns/ampagentless"},next:{title:"Monitoring ECS Workloads",permalink:"/observability-best-practices/ja/docs/patterns/ecsampamg"}},l={},c=[];function p(i){const n={em:"em",h1:"h1",img:"img",li:"li",ol:"ol",p:"p",strong:"strong",...(0,t.R)(),...i.components};return(0,a.jsxs)(a.Fragment,{children:[(0,a.jsx)(n.h1,{id:"apm-with-application-signals",children:"APM with Application Signals"}),"\n",(0,a.jsx)(n.p,{children:"In the ever-evolving world of modern application development, ensuring optimal performance and meeting service level objectives (SLOs) is crucial for providing a seamless user experience and maintaining business continuity. Amazon CloudWatch Application Signals, an OpenTelemetry (OTel) compatible application performance monitoring (APM) feature, revolutionizes the way organizations monitor and troubleshoot their applications running on AWS."}),"\n",(0,a.jsx)(n.p,{children:"CloudWatch Application Signals takes a holistic approach to application performance monitoring by seamlessly correlating telemetry data across multiple sources, including metrics, traces, logs, real-user monitoring, and synthetic monitoring. This integrated approach enables organizations to gain comprehensive insights into their applications' performance, pinpoint root causes of issues, and proactively address potential disruptions."}),"\n",(0,a.jsx)(n.p,{children:"One of the key advantages of CloudWatch Application Signals is its automatic instrumentation and tracking capabilities. With no manual effort or custom code required, Application Signals provides a pre-built, standardized dashboard that displays the most critical metrics for application performance \u2013 volume, availability, latency, faults, and errors \u2013 for each application running on AWS. This streamlined approach eliminates the need for custom dashboards, enabling service operators to quickly assess application health and performance against their defined SLOs."}),"\n",(0,a.jsxs)(n.p,{children:[(0,a.jsx)(n.img,{alt:"APM",src:e(83036).A+"",width:"1532",height:"680"}),"\n",(0,a.jsx)(n.em,{children:"Figure 1: Cloudwatch Application Signals sending metrics, logs and traces"})]}),"\n",(0,a.jsx)(n.p,{children:"CloudWatch Application Signals empowers organizations with the following capabilities:"}),"\n",(0,a.jsxs)(n.ol,{children:["\n",(0,a.jsxs)(n.li,{children:["\n",(0,a.jsxs)(n.p,{children:[(0,a.jsx)(n.strong,{children:"Comprehensive Application Performance Monitoring"}),": Application Signals provides a unified view of application performance, combining insights from metrics, traces, logs, real-user monitoring, and synthetic monitoring. This holistic approach enables organizations to identify performance bottlenecks, pinpoint root causes, and take proactive measures to ensure optimal application performance."]}),"\n"]}),"\n",(0,a.jsxs)(n.li,{children:["\n",(0,a.jsxs)(n.p,{children:[(0,a.jsx)(n.strong,{children:"Automatic Instrumentation and Tracking"}),": With no manual effort or custom code required, Application Signals automatically instruments and tracks application performance against defined SLOs. This streamlined approach reduces the overhead associated with manual instrumentation and configuration, enabling organizations to focus on application development and optimization."]}),"\n"]}),"\n",(0,a.jsxs)(n.li,{children:["\n",(0,a.jsxs)(n.p,{children:[(0,a.jsx)(n.strong,{children:"Standardized Dashboard and Visualization"}),": Application Signals offers a pre-built, standardized dashboard that displays the most critical metrics for application performance, including volume, availability, latency, faults, and errors. This standardized view enables service operators to quickly assess application health and performance, facilitating informed decision-making and proactive issue resolution."]}),"\n"]}),"\n",(0,a.jsxs)(n.li,{children:["\n",(0,a.jsxs)(n.p,{children:[(0,a.jsx)(n.strong,{children:"Seamless Correlation and Troubleshooting"}),": By correlating telemetry data across multiple sources, Application Signals simplifies the troubleshooting process. Service operators can seamlessly drill down into correlated traces, logs, and metrics to identify the root cause of performance issues or anomalies, reducing the mean time to resolution (MTTR) and minimizing application disruptions."]}),"\n"]}),"\n",(0,a.jsxs)(n.li,{children:["\n",(0,a.jsxs)(n.p,{children:[(0,a.jsx)(n.strong,{children:"Integration with Container Insights"}),": For applications running in containerized environments, CloudWatch Application Signals seamlessly integrates with Container Insights, enabling organizations to identify infrastructure-related issues that may impact application performance, such as memory shortages or high CPU utilization on container pods."]}),"\n"]}),"\n"]}),"\n",(0,a.jsx)(n.p,{children:"To leverage CloudWatch Application Signals for application performance monitoring, organizations can follow these general steps:"}),"\n",(0,a.jsxs)(n.ol,{children:["\n",(0,a.jsxs)(n.li,{children:["\n",(0,a.jsxs)(n.p,{children:[(0,a.jsx)(n.strong,{children:"Enable Application Signals"}),": Enable CloudWatch Application Signals for your applications running on AWS, either through the AWS Management Console, AWS Command Line Interface (CLI), or programmatically using AWS SDKs."]}),"\n"]}),"\n",(0,a.jsxs)(n.li,{children:["\n",(0,a.jsxs)(n.p,{children:[(0,a.jsx)(n.strong,{children:"Define Service Level Objectives (SLOs)"}),": Establish and configure the desired SLOs for your applications, such as target availability, maximum latency, or error thresholds, to align with business requirements and customer expectations."]}),"\n"]}),"\n",(0,a.jsxs)(n.li,{children:["\n",(0,a.jsxs)(n.p,{children:[(0,a.jsx)(n.strong,{children:"Monitor and Analyze Performance"}),": Utilize the pre-built, standardized dashboard provided by Application Signals to monitor application performance against defined SLOs. Analyze metrics, traces, logs, real-user monitoring, and synthetic monitoring data to identify performance issues or anomalies."]}),"\n"]}),"\n",(0,a.jsxs)(n.li,{children:["\n",(0,a.jsxs)(n.p,{children:[(0,a.jsx)(n.strong,{children:"Troubleshoot and Resolve Issues"}),": Leverage the seamless correlation capabilities of Application Signals to drill down into correlated traces, logs, and metrics, enabling rapid identification and resolution of performance issues or root causes."]}),"\n"]}),"\n",(0,a.jsxs)(n.li,{children:["\n",(0,a.jsxs)(n.p,{children:[(0,a.jsx)(n.strong,{children:"Integrate with Container Insights (if applicable)"}),": For containerized applications, integrate CloudWatch Application Signals with Container Insights to identify infrastructure-related issues that may impact application performance."]}),"\n"]}),"\n"]}),"\n",(0,a.jsx)(n.p,{children:"While CloudWatch Application Signals offers powerful application performance monitoring capabilities, it's important to consider potential challenges such as data volume and cost management. As application complexity and scale increase, the volume of telemetry data generated can grow significantly, potentially impacting performance and incurring additional costs. Implementing data sampling strategies, retention policies, and cost optimization techniques may be necessary to ensure an efficient and cost-effective monitoring solution."}),"\n",(0,a.jsx)(n.p,{children:"Additionally, ensuring proper access control and data security for your application performance data is crucial. CloudWatch Application Signals leverages AWS Identity and Access Management (IAM) for granular access control, and data encryption is applied to telemetry data at rest and in transit, protecting the confidentiality and integrity of your application performance data."}),"\n",(0,a.jsx)(n.p,{children:"In conclusion, CloudWatch Application Signals revolutionizes application performance monitoring for applications running on AWS. By providing automatic instrumentation, standardized dashboards, and seamless correlation of telemetry data, Application Signals empowers organizations to proactively monitor application performance, ensure SLO adherence, and rapidly troubleshoot and resolve performance issues. With its integration capabilities and OpenTelemetry compatibility, CloudWatch Application Signals offers a comprehensive and future-proof solution for application performance monitoring in the cloud."})]})}function d(i={}){const{wrapper:n}={...(0,t.R)(),...i.components};return n?(0,a.jsx)(n,{...i,children:(0,a.jsx)(p,{...i})}):p(i)}},83036:(i,n,e)=>{e.d(n,{A:()=>a});const a=e.p+"assets/images/apm-6222651f42edc855adc75e921b38930d.png"},28453:(i,n,e)=>{e.d(n,{R:()=>s,x:()=>r});var a=e(96540);const t={},o=a.createContext(t);function s(i){const n=a.useContext(o);return a.useMemo((function(){return"function"==typeof i?i(n):{...n,...i}}),[n,i])}function r(i){let n;return n=i.disableParentContext?"function"==typeof i.components?i.components(t):i.components||t:s(i.components),a.createElement(o.Provider,{value:n},i.children)}}}]);
"use strict";(self.webpackChunkobservability_best_practices=self.webpackChunkobservability_best_practices||[]).push([[3859],{25212:(e,t,a)=>{a.d(t,{A:()=>o});const o=a.p+"assets/images/cwalarm1-ee555ddd8fad64ccd57c53849b20ca21.png"},28453:(e,t,a)=>{a.d(t,{R:()=>r,x:()=>i});var o=a(96540);const s={},n=o.createContext(s);function r(e){const t=o.useContext(n);return o.useMemo((function(){return"function"==typeof e?e(t):{...t,...e}}),[t,e])}function i(e){let t;return t=e.disableParentContext?"function"==typeof e.components?e.components(s):e.components||s:r(e.components),o.createElement(n.Provider,{value:t},e.children)}},75279:(e,t,a)=>{a.r(t),a.d(t,{assets:()=>l,contentTitle:()=>r,default:()=>h,frontMatter:()=>n,metadata:()=>i,toc:()=>c});var o=a(74848),s=a(28453);const n={},r="Alarms",i={id:"tools/alarms",title:"Alarms",description:"Amazon CloudWatch alarms allows you to define thresholds around CloudWatch Metrics and Logs and receive notifications based on the rules configured in the CloudWatch.",source:"@site/docs/tools/alarms.md",sourceDirName:"tools",slug:"/tools/alarms",permalink:"/observability-best-practices/tools/alarms",draft:!1,unlisted:!1,editUrl:"https://github.com/aws-observability/observability-best-practices/blob/main/docusaurus/docs/tools/alarms.md",tags:[],version:"current",frontMatter:{},sidebar:"tools",previous:{title:"CloudWatch Agent",permalink:"/observability-best-practices/tools/cloudwatch_agent"},next:{title:"Dashboards",permalink:"/observability-best-practices/tools/dashboards"}},l={},c=[];function d(e){const t={a:"a",admonition:"admonition",code:"code",h1:"h1",img:"img",li:"li",ol:"ol",p:"p",strong:"strong",...(0,s.R)(),...e.components};return(0,o.jsxs)(o.Fragment,{children:[(0,o.jsx)(t.h1,{id:"alarms",children:"Alarms"}),"\n",(0,o.jsx)(t.p,{children:"Amazon CloudWatch alarms allows you to define thresholds around CloudWatch Metrics and Logs and receive notifications based on the rules configured in the CloudWatch."}),"\n",(0,o.jsx)(t.p,{children:(0,o.jsx)(t.strong,{children:"Alarms on CloudWatch metrics:"})}),"\n",(0,o.jsx)(t.p,{children:"CloudWatch alarms allows you to define thresholds on CloudWatch metrics and receive notifications when the metrics fall outside range. Each metric can trigger multiple alarms, and each alarm can have many actions associated with it. There are two different ways you could setup metric alarms based on CloudWatch metrics."}),"\n",(0,o.jsxs)(t.ol,{children:["\n",(0,o.jsxs)(t.li,{children:["\n",(0,o.jsxs)(t.p,{children:[(0,o.jsx)(t.strong,{children:"Static threshold"}),": A static threshold represents a hard limit that the metric should not violate. You must define the range for the static threshold like upper limit and the lower limit to understand the behaviour during the normal operations.  If the metric value falls below or above the static threshold you may configure the CloudWatch to generate the alarm."]}),"\n"]}),"\n",(0,o.jsxs)(t.li,{children:["\n",(0,o.jsxs)(t.p,{children:[(0,o.jsx)(t.strong,{children:"Anomaly detection"}),": Anomaly detection is generally identified as rare items, events or observations which deviate significantly from the majority of the data and do not conform to a well-defined notion of normal behaviour.  CloudWatch anomaly detection analyzes past metric data and creates a model of expected values. The expected values take into account the typical hourly, daily, and weekly patterns in the metric.  You can apply the anomaly detection for each metric as required and CloudWatch applies a machine-learning algorithm to define the upper limit and lower limit for each of the enabled metrics and generate an alarm only when the metrics fall out of the expected values."]}),"\n"]}),"\n"]}),"\n",(0,o.jsx)(t.admonition,{type:"tip",children:(0,o.jsx)(t.p,{children:"Static thresholds are best used for metrics that you have a firm understanding of, such as identified performance breakpoints in your workload, or absolute limits on infrastructure components."})}),"\n",(0,o.jsx)(t.admonition,{type:"info",children:(0,o.jsx)(t.p,{children:"Use an anomaly detection model with your alarms when you do not have visibility into the performance of a particular metric over time, or when the metric value has not been observed under load-testing or anomalous traffic previously."})}),"\n",(0,o.jsx)(t.p,{children:(0,o.jsx)(t.img,{alt:"CloudWatch Alarm types",src:a(25212).A+"",width:"685",height:"318"})}),"\n",(0,o.jsx)(t.p,{children:"You can follow the instructions below on how to setup of Static and Anomaly based alarms in CloudWatch."}),"\n",(0,o.jsx)(t.p,{children:(0,o.jsx)(t.a,{href:"https://catalog.us-east-1.prod.workshops.aws/workshops/31676d37-bbe9-4992-9cd1-ceae13c5116c/en-US/alarms/mericalarm",children:"Static threshold alarms"})}),"\n",(0,o.jsx)(t.p,{children:(0,o.jsx)(t.a,{href:"https://catalog.us-east-1.prod.workshops.aws/workshops/31676d37-bbe9-4992-9cd1-ceae13c5116c/en-US/alarms/adalarm",children:"CloudWatch anomaly Detection based alarms"})}),"\n",(0,o.jsxs)(t.admonition,{type:"info",children:[(0,o.jsx)(t.p,{children:"To reduce the alarm fatigue or reduce the noise from the number of alarms generated, you have two advanced methods to configure the alarms:"}),(0,o.jsxs)(t.ol,{children:["\n",(0,o.jsxs)(t.li,{children:["\n",(0,o.jsxs)(t.p,{children:[(0,o.jsx)(t.strong,{children:"Composite alarms"}),": A composite alarm includes a rule expression that takes into account the alarm states of other alarms that have been created. The composite alarm goes into ",(0,o.jsx)(t.code,{children:"ALARM"})," state only if all conditions of the rule are met. The alarms specified in a composite alarm's rule expression can include metric alarms and other composite alarms. Composite alarms help to ",(0,o.jsx)(t.a,{href:"../signals/alarms/#fight-alarm-fatigue-with-aggregation",children:"fight alarm fatigue with aggregation"}),"."]}),"\n"]}),"\n",(0,o.jsxs)(t.li,{children:["\n",(0,o.jsxs)(t.p,{children:[(0,o.jsx)(t.strong,{children:"Metric math based alarms"}),": Metric math expressions can be used to build more meaningful KPIs and alarms on them. You can combine multiple metrics and create a combined utilization metric and alarm on them."]}),"\n"]}),"\n"]})]}),"\n",(0,o.jsx)(t.p,{children:"These instructions below guide you on how to setup of Composite alarms and Metric math based alarms."}),"\n",(0,o.jsx)(t.p,{children:(0,o.jsx)(t.a,{href:"https://catalog.us-east-1.prod.workshops.aws/workshops/31676d37-bbe9-4992-9cd1-ceae13c5116c/en-US/alarms/compositealarm",children:"Composite Alarms"})}),"\n",(0,o.jsx)(t.p,{children:(0,o.jsx)(t.a,{href:"https://aws.amazon.com/blogs/mt/create-a-metric-math-alarm-using-amazon-cloudwatch/",children:"Metric Math alarms"})}),"\n",(0,o.jsx)(t.p,{children:(0,o.jsx)(t.strong,{children:"Alarms on CloudWatch Logs"})}),"\n",(0,o.jsx)(t.p,{children:"You can create alarms based on the CloudWatch Logs uses CloudWatch Metric filter. Metric filters turn the log data into numerical CloudWatch metrics that you can graph or set an alarm on. Once you have setup the metrics you could use either the static or anomaly based alarms on the CloudWatch metrics generated from the CloudWatch Logs."}),"\n",(0,o.jsxs)(t.p,{children:["You can find an example on how to setup ",(0,o.jsx)(t.a,{href:"https://aws.amazon.com/blogs/mt/quantify-custom-application-metrics-with-amazon-cloudwatch-logs-and-metric-filters/",children:"metric filter on CloudWatch logs"}),"."]})]})}function h(e={}){const{wrapper:t}={...(0,s.R)(),...e.components};return t?(0,o.jsx)(t,{...e,children:(0,o.jsx)(d,{...e})}):d(e)}}}]);
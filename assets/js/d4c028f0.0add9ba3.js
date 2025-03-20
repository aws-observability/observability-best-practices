"use strict";(self.webpackChunkobservability_best_practices=self.webpackChunkobservability_best_practices||[]).push([[2110],{28453:(e,i,a)=>{a.d(i,{R:()=>r,x:()=>o});var t=a(96540);const s={},n=t.createContext(s);function r(e){const i=t.useContext(n);return t.useMemo((function(){return"function"==typeof e?e(i):{...i,...e}}),[i,e])}function o(e){let i;return i=e.disableParentContext?"function"==typeof e.components?e.components(s):e.components||s:r(e.components),t.createElement(n.Provider,{value:i},e.children)}},69662:(e,i,a)=>{a.r(i),a.d(i,{assets:()=>c,contentTitle:()=>o,default:()=>h,frontMatter:()=>r,metadata:()=>t,toc:()=>l});const t=JSON.parse('{"id":"persona/data_aiml","title":"Data Scientists, AI/ML, MLOps Engineers","description":"Observability in data engineering and machine learning operations is crucial for maintaining reliable, performant, and trustworthy data pipelines and ML models. Without proper observability, ML systems become black boxes that are difficult to maintain, debug, and improve. This can lead to unreliable predictions, increased costs, and potential business impacts.","source":"@site/docs/persona/data_aiml.md","sourceDirName":"persona","slug":"/persona/data_aiml","permalink":"/observability-best-practices/persona/data_aiml","draft":false,"unlisted":false,"editUrl":"https://github.com/aws-observability/observability-best-practices/blob/main/docusaurus/docs/persona/data_aiml.md","tags":[],"version":"current","frontMatter":{},"sidebar":"persona","previous":{"title":"Cloud Engineer","permalink":"/observability-best-practices/persona/cloud_engineer"},"next":{"title":"Developers","permalink":"/observability-best-practices/persona/developer"}}');var s=a(74848),n=a(28453);const r={},o="Data Scientists, AI/ML, MLOps Engineers",c={},l=[{value:"Best practices",id:"best-practices",level:2},{value:"Data Quality Assurance",id:"data-quality-assurance",level:3},{value:"Model Performance Monitoring",id:"model-performance-monitoring",level:3},{value:"Infrastructure monitoring",id:"infrastructure-monitoring",level:3},{value:"Compliance and Governance",id:"compliance-and-governance",level:3},{value:"Business Impact Analysis",id:"business-impact-analysis",level:3},{value:"References",id:"references",level:2}];function d(e){const i={a:"a",h1:"h1",h2:"h2",h3:"h3",header:"header",li:"li",p:"p",ul:"ul",...(0,n.R)(),...e.components};return(0,s.jsxs)(s.Fragment,{children:[(0,s.jsx)(i.header,{children:(0,s.jsx)(i.h1,{id:"data-scientists-aiml-mlops-engineers",children:"Data Scientists, AI/ML, MLOps Engineers"})}),"\n",(0,s.jsx)(i.p,{children:"Observability in data engineering and machine learning operations is crucial for maintaining reliable, performant, and trustworthy data pipelines and ML models. Without proper observability, ML systems become black boxes that are difficult to maintain, debug, and improve. This can lead to unreliable predictions, increased costs, and potential business impacts."}),"\n",(0,s.jsx)(i.p,{children:"Here are the key best practices to guide your observability strategy in data and ML operations."}),"\n",(0,s.jsx)(i.h2,{id:"best-practices",children:"Best practices"}),"\n",(0,s.jsxs)(i.p,{children:["Use Cloudwatch ",(0,s.jsx)(i.a,{href:"https://aws-observability.github.io/observability-best-practices/tools/logs/",children:"logs"})," and ",(0,s.jsx)(i.a,{href:"https://aws-observability.github.io/observability-best-practices/tools/metrics",children:"metrics"})," and ",(0,s.jsx)(i.a,{href:"https://aws-observability.github.io/observability-best-practices/tools/xray",children:"traces"})," for monitoring.Implement a tagging strategy for all resouces, create metric filters for critical events, setup ",(0,s.jsx)(i.a,{href:"https://aws-observability.github.io/observability-best-practices/tools/metrics#anomaly-detection",children:"anomaly detection"})," and configure alert thresholds using ",(0,s.jsx)(i.a,{href:"https://aws-observability.github.io/observability-best-practices/tools/alarms",children:"Cloudwatch alarms"}),"."]}),"\n",(0,s.jsx)(i.h3,{id:"data-quality-assurance",children:"Data Quality Assurance"}),"\n",(0,s.jsx)(i.p,{children:"It ensures monitoring of data quality, pipeline performance, and infrastructure health throughout the data lifecycle."}),"\n",(0,s.jsx)(i.p,{children:"Key monitoring areas include:"}),"\n",(0,s.jsxs)(i.ul,{children:["\n",(0,s.jsx)(i.li,{children:"ETL pipelines throughput, processing time and error rates"}),"\n",(0,s.jsx)(i.li,{children:"Anomaly detection in data patterns for data qaulity, feature drift detection, distribution analysis for training/inference data"}),"\n"]}),"\n",(0,s.jsx)(i.h3,{id:"model-performance-monitoring",children:"Model Performance Monitoring"}),"\n",(0,s.jsx)(i.p,{children:"Through integration with Amazon CloudWatch, AWS automatically captures detailed training parameters, hyperparameters, pipeline execution metrics, job performance metrics, and infrastructure utilization metrics enabling thorough analysis and debugging of training jobs. Model versioning and registry capabilities ensure systematic tracking of model iterations, metadata, and approval states, making it easy to manage model lineage."}),"\n",(0,s.jsxs)(i.p,{children:[(0,s.jsx)(i.a,{href:"https://docs.aws.amazon.com/sagemaker/latest/dg/how-it-works-model-monitor.html",children:"Amazon SageMaker Model Monitor"})," continuously monitors machine learning models in production environments. It provides automated alert systems that trigger when there are deviations in model quality, such as data drift and anomalies. The system integrates with ",(0,s.jsx)(i.a,{href:"https://aws-observability.github.io/observability-best-practices/tools/logs/#search-with-cloudwatch-logs",children:"Amazon CloudWatch Logs"})," for collecting monitoring data, enabling early detection and proactive maintenance of deployed models."]}),"\n",(0,s.jsxs)(i.p,{children:["Create a mechanism to aggregate and analyze model prediction endpoint metrics like accuracy and latency using Cloudwtach metrics or ",(0,s.jsx)(i.a,{href:"https://aws-observability.github.io/observability-best-practices/guides/operational/adot-at-scale/operating-adot-collector",children:"ADOT"})," and services, such as ",(0,s.jsx)(i.a,{href:"https://aws-observability.github.io/observability-best-practices/patterns/opensearch",children:"Amazon OpenSearch Service (OpenSearch Service)"}),". OpenSearch Service supports Kibana for dashboards and visualization. The traceability allows for analysis of changes that could be impacting current operational performance."]}),"\n",(0,s.jsx)(i.h3,{id:"infrastructure-monitoring",children:"Infrastructure monitoring"}),"\n",(0,s.jsxs)(i.p,{children:["AWS provides deep visibility into resource utilization, storage patterns, and computational efficiency. CloudWatch Metrics and ",(0,s.jsx)(i.a,{href:"https://aws-observability.github.io/observability-best-practices/patterns/otel",children:"OpenTelemetry"})," captures real-time data about CPU usage, memory allocation, and I/O operations, while CloudWatch Logs aggregates log data for analysis. ",(0,s.jsx)(i.a,{href:"https://aws-observability.github.io/observability-best-practices/tools/xray",children:"AWS X-Ray"})," helps trace service dependencies and identify system bottlenecks across the ML pipeline stages, enabling efficient resource optimization and cost management."]}),"\n",(0,s.jsx)(i.h3,{id:"compliance-and-governance",children:"Compliance and Governance"}),"\n",(0,s.jsx)(i.p,{children:"Centralized governance of ML resources across multiple accounts and model versions, lineage, and approval workflows tracking is crucial. AWS CloudTrail maintains audit logs of all API activities essential for regulatory compliance and governance."}),"\n",(0,s.jsx)(i.h3,{id:"business-impact-analysis",children:"Business Impact Analysis"}),"\n",(0,s.jsxs)(i.p,{children:[(0,s.jsx)(i.a,{href:"https://aws-observability.github.io/observability-best-practices/tools/metrics#collecting-metrics",children:"Custom metrics"})," in CloudWatch can track business-specific KPIs, enabling real-time visualization of ML initiatives' ROI through QuickSight dashboards.  Amazon QuickSight creates interactive dashboards that translate technical metrics into business insights, connecting ML performance to business KPIs. Amazon CloudWatch ",(0,s.jsx)(i.a,{href:"https://aws-observability.github.io/observability-best-practices/tools/rum#enable-active-tracing",children:"ServiceLens"})," helps monitor user experience impacts."]}),"\n",(0,s.jsx)(i.h2,{id:"references",children:"References"}),"\n",(0,s.jsxs)(i.ul,{children:["\n",(0,s.jsx)(i.li,{children:(0,s.jsx)(i.a,{href:"https://catalog.workshops.aws/observability/en-US",children:"AWS Observability Workshop"})}),"\n",(0,s.jsx)(i.li,{children:(0,s.jsx)(i.a,{href:"https://aws-observability.github.io/observability-best-practices/",children:"AWS Observability Best Practices"})}),"\n",(0,s.jsx)(i.li,{children:(0,s.jsx)(i.a,{href:"https://docs.aws.amazon.com/wellarchitected/latest/machine-learning-lens/machine-learning-lens.html",children:"AWS Well-Architected Framework Machine Learning Lens"})}),"\n",(0,s.jsx)(i.li,{children:(0,s.jsx)(i.a,{href:"https://docs.aws.amazon.com/sagemaker/latest/dg/sagemaker-incident-response.html",children:"Sagemaker Logging and Monitoring"})}),"\n",(0,s.jsxs)(i.li,{children:[(0,s.jsx)(i.a,{href:"https://docs.aws.amazon.com/sagemaker/latest/dg/monitoring-cloudwatch.html",children:"Metrics for monitoring Amazon SageMaker AI"})," with Amazon CloudWatch"]}),"\n"]})]})}function h(e={}){const{wrapper:i}={...(0,n.R)(),...e.components};return i?(0,s.jsx)(i,{...e,children:(0,s.jsx)(d,{...e})}):d(e)}}}]);
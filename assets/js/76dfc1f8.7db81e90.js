"use strict";(self.webpackChunkobservability_best_practices=self.webpackChunkobservability_best_practices||[]).push([[9172],{28453:(e,t,n)=>{n.d(t,{R:()=>o,x:()=>a});var i=n(96540);const s={},r=i.createContext(s);function o(e){const t=i.useContext(r);return i.useMemo((function(){return"function"==typeof e?e(t):{...t,...e}}),[t,e])}function a(e){let t;return t=e.disableParentContext?"function"==typeof e.components?e.components(s):e.components||s:o(e.components),i.createElement(r.Provider,{value:t},e.children)}},44936:(e,t,n)=>{n.d(t,{A:()=>i});const i=n.p+"assets/images/otel-72441d50596794eea286b87eab835e4f.png"},55333:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>l,contentTitle:()=>a,default:()=>p,frontMatter:()=>o,metadata:()=>i,toc:()=>c});const i=JSON.parse('{"id":"patterns/otel","title":"Observability with OpenTelemetry","description":"OpenTelemetry is an open-source, vendor-neutral observability framework that provides a standardized way to collect and export telemetry data, including logs, metrics, and traces. By leveraging OpenTelemetry, organizations can implement a comprehensive observability pipeline while ensuring vendor independence and future-proofing their observability strategy.","source":"@site/docs/patterns/otel.md","sourceDirName":"patterns","slug":"/patterns/otel","permalink":"/observability-best-practices/patterns/otel","draft":false,"unlisted":false,"editUrl":"https://github.com/aws-observability/observability-best-practices/blob/main/docusaurus/docs/patterns/otel.md","tags":[],"version":"current","frontMatter":{},"sidebar":"patterns","previous":{"title":"Opensearch Logging on AWS","permalink":"/observability-best-practices/patterns/opensearch"},"next":{"title":"Big Data Observability on AWS","permalink":"/observability-best-practices/patterns/sparkbigdata"}}');var s=n(74848),r=n(28453);const o={},a="Observability with OpenTelemetry",l={},c=[{value:"Collecting Metrics and Insights with OpenTelemetry",id:"collecting-metrics-and-insights-with-opentelemetry",level:2},{value:"Benefits of Using OpenTelemetry",id:"benefits-of-using-opentelemetry",level:2}];function d(e){const t={em:"em",h1:"h1",h2:"h2",header:"header",img:"img",li:"li",ol:"ol",p:"p",strong:"strong",...(0,r.R)(),...e.components};return(0,s.jsxs)(s.Fragment,{children:[(0,s.jsx)(t.header,{children:(0,s.jsx)(t.h1,{id:"observability-with-opentelemetry",children:"Observability with OpenTelemetry"})}),"\n",(0,s.jsx)(t.p,{children:"OpenTelemetry is an open-source, vendor-neutral observability framework that provides a standardized way to collect and export telemetry data, including logs, metrics, and traces. By leveraging OpenTelemetry, organizations can implement a comprehensive observability pipeline while ensuring vendor independence and future-proofing their observability strategy."}),"\n",(0,s.jsx)(t.h2,{id:"collecting-metrics-and-insights-with-opentelemetry",children:"Collecting Metrics and Insights with OpenTelemetry"}),"\n",(0,s.jsxs)(t.ol,{children:["\n",(0,s.jsxs)(t.li,{children:["\n",(0,s.jsxs)(t.p,{children:[(0,s.jsx)(t.strong,{children:"Instrumentation"}),": The first step in using OpenTelemetry is to instrument your applications and services with the OpenTelemetry libraries or SDKs. These libraries automatically capture and export telemetry data, such as metrics, traces, and logs, from your application code."]}),"\n"]}),"\n",(0,s.jsxs)(t.li,{children:["\n",(0,s.jsxs)(t.p,{children:[(0,s.jsx)(t.strong,{children:"Metrics Collection"}),": OpenTelemetry provides a standardized way to collect and export metrics from your application. These metrics can include system metrics (CPU, memory, disk usage), application-level metrics (request rates, error rates, latency), and custom business metrics specific to your application."]}),"\n"]}),"\n",(0,s.jsxs)(t.li,{children:["\n",(0,s.jsxs)(t.p,{children:[(0,s.jsx)(t.strong,{children:"Distributed Tracing"}),": OpenTelemetry supports distributed tracing, enabling you to trace requests and operations as they propagate through your distributed system. This provides valuable insights into the end-to-end flow of requests, identifying bottlenecks, and troubleshooting performance issues."]}),"\n"]}),"\n",(0,s.jsxs)(t.li,{children:["\n",(0,s.jsxs)(t.p,{children:[(0,s.jsx)(t.strong,{children:"Logging"}),": While OpenTelemetry's primary focus is on metrics and traces, it also provides a structured logging API that can be used to capture and export log data. This ensures that logs are correlated with other telemetry data, providing a holistic view of your system's behavior."]}),"\n"]}),"\n",(0,s.jsxs)(t.li,{children:["\n",(0,s.jsxs)(t.p,{children:[(0,s.jsx)(t.strong,{children:"Exporters"}),": OpenTelemetry supports various exporters that allow you to send telemetry data to different backends or observability platforms. Popular exporters include Prometheus, Jaeger, Zipkin, and cloud-native observability solutions like AWS CloudWatch, Azure Monitor, and Google Cloud Operations."]}),"\n"]}),"\n",(0,s.jsxs)(t.li,{children:["\n",(0,s.jsxs)(t.p,{children:[(0,s.jsx)(t.strong,{children:"Data Processing and Analysis"}),": Once the telemetry data is exported, you can leverage observability platforms, monitoring tools, or custom data processing pipelines to analyze and visualize the collected metrics, traces, and logs. This analysis can provide insights into system performance, identify bottlenecks, and aid in troubleshooting and root cause analysis.\n",(0,s.jsx)(t.img,{alt:"Otel",src:n(44936).A+"",width:"1424",height:"998"}),"\n",(0,s.jsx)(t.em,{children:"Figure 1: EKS Cluster sending observability signals with ADOT and FluentBit"})]}),"\n"]}),"\n"]}),"\n",(0,s.jsx)(t.h2,{id:"benefits-of-using-opentelemetry",children:"Benefits of Using OpenTelemetry"}),"\n",(0,s.jsxs)(t.ol,{children:["\n",(0,s.jsxs)(t.li,{children:["\n",(0,s.jsxs)(t.p,{children:[(0,s.jsx)(t.strong,{children:"Vendor Neutrality"}),": OpenTelemetry is an open-source, vendor-neutral project, ensuring that your observability strategy is not tied to a specific vendor or platform. This flexibility allows you to switch between observability backends or combine multiple solutions as needed."]}),"\n"]}),"\n",(0,s.jsxs)(t.li,{children:["\n",(0,s.jsxs)(t.p,{children:[(0,s.jsx)(t.strong,{children:"Standardization"}),": OpenTelemetry provides a standardized way of collecting and exporting telemetry data, enabling consistent data formats and interoperability across different components and systems."]}),"\n"]}),"\n",(0,s.jsxs)(t.li,{children:["\n",(0,s.jsxs)(t.p,{children:[(0,s.jsx)(t.strong,{children:"Future-Proofing"}),": By adopting OpenTelemetry, you can future-proof your observability strategy. As the project evolves and new features and integrations are added, your existing instrumentation can be easily updated without the need for significant code changes."]}),"\n"]}),"\n",(0,s.jsxs)(t.li,{children:["\n",(0,s.jsxs)(t.p,{children:[(0,s.jsx)(t.strong,{children:"Comprehensive Observability"}),": OpenTelemetry supports multiple telemetry signals (metrics, traces, and logs), providing a comprehensive view of your system's behavior and performance."]}),"\n"]}),"\n",(0,s.jsxs)(t.li,{children:["\n",(0,s.jsxs)(t.p,{children:[(0,s.jsx)(t.strong,{children:"Ecosystem and Community Support"}),": OpenTelemetry has a growing ecosystem of integrations, tools, and a vibrant community of contributors, ensuring continued development and support."]}),"\n"]}),"\n"]}),"\n",(0,s.jsx)(t.p,{children:"By leveraging OpenTelemetry for observability, organizations can gain deep insights into their systems, enabling proactive monitoring, efficient troubleshooting, and data-driven decision-making, while maintaining flexibility and vendor independence in their observability strategy."})]})}function p(e={}){const{wrapper:t}={...(0,r.R)(),...e.components};return t?(0,s.jsx)(t,{...e,children:(0,s.jsx)(d,{...e})}):d(e)}}}]);
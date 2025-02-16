"use strict";(self.webpackChunkobservability_best_practices=self.webpackChunkobservability_best_practices||[]).push([[8494],{28453:(e,t,n)=>{n.d(t,{R:()=>r,x:()=>o});var a=n(96540);const i={},s=a.createContext(i);function r(e){const t=a.useContext(s);return a.useMemo((function(){return"function"==typeof e?e(t):{...t,...e}}),[t,e])}function o(e){let t;return t=e.disableParentContext?"function"==typeof e.components?e.components(i):e.components||i:r(e.components),a.createElement(s.Provider,{value:t},e.children)}},43412:(e,t,n)=>{n.d(t,{A:()=>a});const a=n.p+"assets/images/service-map-trace-34a4f2c3948eeebd39d3cead571314de.png"},90301:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>c,contentTitle:()=>r,default:()=>h,frontMatter:()=>s,metadata:()=>o,toc:()=>l});var a=n(74848),i=n(28453);const s={},r="Traces",o={id:"signals/traces",title:"Traces",description:"Traces represent an entire journey of the requests as they traverse through different components of an application.",source:"@site/docs/signals/traces.md",sourceDirName:"signals",slug:"/signals/traces",permalink:"/observability-best-practices/signals/traces",draft:!1,unlisted:!1,editUrl:"https://github.com/aws-observability/observability-best-practices/blob/main/docusaurus/docs/signals/traces.md",tags:[],version:"current",frontMatter:{},sidebar:"sigals",previous:{title:"Metrics",permalink:"/observability-best-practices/signals/metrics"},next:{title:"Alarms",permalink:"/observability-best-practices/signals/alarms"}},c={},l=[{value:"Instrument all of your integration points",id:"instrument-all-of-your-integration-points",level:2},{value:"Transaction time and status matters, so measure it!",id:"transaction-time-and-status-matters-so-measure-it",level:2},{value:"Metadata, annotations, and labels are your best friend",id:"metadata-annotations-and-labels-are-your-best-friend",level:2}];function d(e){const t={a:"a",admonition:"admonition",em:"em",h1:"h1",h2:"h2",img:"img",p:"p",...(0,i.R)(),...e.components};return(0,a.jsxs)(a.Fragment,{children:[(0,a.jsx)(t.h1,{id:"traces",children:"Traces"}),"\n",(0,a.jsx)(t.p,{children:"Traces represent an entire journey of the requests as they traverse through different components of an application."}),"\n",(0,a.jsxs)(t.p,{children:["Unlike logs or metrics, ",(0,a.jsx)(t.em,{children:"traces"})," are composed of events from more than one application or a service, and with context about the connection between services such as response latency, service faults, request parameters, and metadata."]}),"\n",(0,a.jsxs)(t.admonition,{type:"tip",children:[(0,a.jsxs)(t.p,{children:["There is conceptual similarity between ",(0,a.jsx)(t.a,{href:"../signals/logs/",children:"logs"})," and traces, however a trace is intended to be considered in a cross-service context, whereas logs are typically limited to the execution of a single service or application."]}),(0,a.jsxs)(t.admonition,{type:"tip",children:[(0,a.jsxs)(t.p,{children:["Today's developers are leaning towards building modular and distributed applications. Some call these ",(0,a.jsx)(t.a,{href:"https://en.wikipedia.org/wiki/Service-oriented_architecture",children:"Service Oriented Architecture"}),", others will refer to them as ",(0,a.jsx)(t.a,{href:"https://aws.amazon.com/microservices/",children:"microservices"}),". Regardless of the name, when something goes wrong in these loosely coupled applications, just looking at logs or events may not be sufficient to track down the root cause of an incident.  Having full visibility into request flow is essential and this is where traces add value. Through a series of causally related events that depict end-to-end request flow, traces help  you gain that visibility."]}),(0,a.jsx)(t.p,{children:"Traces are an essential pillar of observability because they provide the basic information on the flow of the request as it comes and leaves the system."}),(0,a.jsx)(t.admonition,{type:"tip",children:(0,a.jsx)(t.p,{children:"Common use cases for traces include performance profiling, debugging production issues, and root cause analysis of failures."})})]})]}),"\n",(0,a.jsx)(t.h2,{id:"instrument-all-of-your-integration-points",children:"Instrument all of your integration points"}),"\n",(0,a.jsx)(t.p,{children:"When all of your workload functionality and code is at one place, it is easy to look at the source code to see how a request is passed across different functions. At a system level you know which machine the app is running and if something goes wrong, you can find the root cause quickly. Imagine doing that in a microservices-based architecture where different components are loosely coupled and are running in an distributed environment. Logging into numerous systems to see their logs from each interconnected request would be impractical, if not impossible."}),"\n",(0,a.jsx)(t.p,{children:"This is where observability can help. Instrumentation is a key step towards increasing that observability. In broader terms Instrumentation is measuring the events in your application using code."}),"\n",(0,a.jsx)(t.p,{children:"A typical instrumentation approach would be to assign a unique trace identifier for each request entering the system and carry that trace id as it passes through different components while adding additional metadata."}),"\n",(0,a.jsx)(t.admonition,{type:"info",children:(0,a.jsx)(t.p,{children:"Every connection from one service to another should be instrumented to emit traces to a central collector. This approach helps you see into otherwise opaque aspects of your workload."})}),"\n",(0,a.jsx)(t.admonition,{type:"info",children:(0,a.jsx)(t.p,{children:"Instrumenting your application can be a largely automated process when using an auto-instrumentation agent or library."})}),"\n",(0,a.jsx)(t.h2,{id:"transaction-time-and-status-matters-so-measure-it",children:"Transaction time and status matters, so measure it!"}),"\n",(0,a.jsx)(t.p,{children:"A well instrumented application can produce end to end trace, which can be viewed aseither a waterfall graph like this:"}),"\n",(0,a.jsx)(t.p,{children:(0,a.jsx)(t.img,{alt:"WaterFall Trace",src:n(91254).A+"",width:"1164",height:"232"})}),"\n",(0,a.jsx)(t.p,{children:"Or a service map:"}),"\n",(0,a.jsx)(t.p,{children:(0,a.jsx)(t.img,{alt:"servicemap Trace",src:n(43412).A+"",width:"1434",height:"1326"})}),"\n",(0,a.jsx)(t.p,{children:"It is important that you measure the transaction times and response codes to every interaction. This will help in calculating the overall processing times and track it for compliance with your SLAs, SLOs, or business KPIs."}),"\n",(0,a.jsx)(t.admonition,{type:"info",children:(0,a.jsx)(t.p,{children:"Only by understanding and recording the response times and status codes of your interactions can you see the contributing factors overall request patterns and workload health."})}),"\n",(0,a.jsx)(t.h2,{id:"metadata-annotations-and-labels-are-your-best-friend",children:"Metadata, annotations, and labels are your best friend"}),"\n",(0,a.jsxs)(t.p,{children:["Traces are persisted and assigned a unique ID, with each trace broken down into ",(0,a.jsx)(t.em,{children:"spans"})," or ",(0,a.jsx)(t.em,{children:"segments"})," (depending on your tooling) that record each step within the request\u2019s path. A span indicates the entities with which the trace interacts, and, like the parent trace, each span is assigned a unique ID and time stamp and can include additional data and metadata as well. This information is useful for debugging because it gives you the exact time and location a problem occurred."]}),"\n",(0,a.jsx)(t.p,{children:"This is best explained through a practical example. An e-commerce application may be divided into many domains: authentication, authorization, shipping, inventory, payment processing, fulfillment, product search, recommendations, and many more. Rather than search through traces from all of these interconnected domains though, labelling your trace with a customer ID allows you to search for only interactions that are specific to this one person. This helps you to narrow your search instantly when diagnosing an operational issue."}),"\n",(0,a.jsx)(t.admonition,{type:"info",children:(0,a.jsx)(t.p,{children:"While the naming convention may vary between vendors, each trace can be augmented with metadata, labels, or annotations, and these are searchable across your entire workload. Adding them does require code on your part, but greatly increases the observability of your workload."})}),"\n",(0,a.jsx)(t.admonition,{type:"warning",children:(0,a.jsx)(t.p,{children:"Traces are not logs, so be frugal with what metadata you include in your traces. And trace data is not intended for forensics and auditing, even with a high sample rate."})})]})}function h(e={}){const{wrapper:t}={...(0,i.R)(),...e.components};return t?(0,a.jsx)(t,{...e,children:(0,a.jsx)(d,{...e})}):d(e)}},91254:(e,t,n)=>{n.d(t,{A:()=>a});const a=n.p+"assets/images/waterfall-trace-0a8d2812dd66ba77d2daae6d2d7452ce.png"}}]);
"use strict";(self.webpackChunkobservability_best_practices=self.webpackChunkobservability_best_practices||[]).push([[5345],{26271:(e,t,o)=>{o.r(t),o.d(t,{assets:()=>l,contentTitle:()=>a,default:()=>h,frontMatter:()=>n,metadata:()=>r,toc:()=>c});var i=o(74848),s=o(28453);const n={},a="Best practices overview",r={id:"guides/index",title:"Best practices overview",description:"Observability is a broad topic with a mature landscape of tools. Not every tool is right for every solution though! To help you navigate through your observability requirements, configuration, and final deployment, we have summarized five key best practices that will inform your decision making process on your Observability strategy.",source:"@site/docs/guides/index.md",sourceDirName:"guides",slug:"/guides/",permalink:"/observability-best-practices/docs/guides/",draft:!1,unlisted:!1,editUrl:"https://github.com/aws-observability/observability-best-practices/blob/main/docusaurus/docs/guides/index.md",tags:[],version:"current",frontMatter:{},sidebar:"guides",next:{title:"Choosing a tracing agent",permalink:"/observability-best-practices/docs/guides/choosing-a-tracing-agent"}},l={},c=[{value:"Monitor what matters",id:"monitor-what-matters",level:2},{value:"Know your objectives, and measure them!",id:"know-your-objectives-and-measure-them",level:4},{value:"Context propagation and tool selection",id:"context-propagation-and-tool-selection",level:2},{value:"Every workload is different, but common tools make for a faster results",id:"every-workload-is-different-but-common-tools-make-for-a-faster-results",level:4},{value:"Integrate with existing tools and processes",id:"integrate-with-existing-tools-and-processes",level:4},{value:"Use automation and machine learning",id:"use-automation-and-machine-learning",level:4},{value:"Collect telemetry from all tiers of your workload",id:"collect-telemetry-from-all-tiers-of-your-workload",level:2},{value:"Focus on integrations",id:"focus-on-integrations",level:4},{value:"Don&#39;t forget about the end-user experience",id:"dont-forget-about-the-end-user-experience",level:4},{value:"Data is power, but don&#39;t sweat the small stuff",id:"data-is-power-but-dont-sweat-the-small-stuff",level:2},{value:"Include observability from day one",id:"include-observability-from-day-one",level:2}];function d(e){const t={a:"a",admonition:"admonition",em:"em",h1:"h1",h2:"h2",h4:"h4",img:"img",li:"li",ol:"ol",p:"p",section:"section",sup:"sup",ul:"ul",...(0,s.R)(),...e.components};return(0,i.jsxs)(i.Fragment,{children:[(0,i.jsx)(t.h1,{id:"best-practices-overview",children:"Best practices overview"}),"\n",(0,i.jsx)(t.p,{children:"Observability is a broad topic with a mature landscape of tools. Not every tool is right for every solution though! To help you navigate through your observability requirements, configuration, and final deployment, we have summarized five key best practices that will inform your decision making process on your Observability strategy."}),"\n",(0,i.jsx)(t.h2,{id:"monitor-what-matters",children:"Monitor what matters"}),"\n",(0,i.jsxs)(t.p,{children:["The most important consideration with observability is not your servers, network, applications, or customers. It is what matters to ",(0,i.jsx)(t.em,{children:"you"}),", your business, your project, or your users."]}),"\n",(0,i.jsx)(t.p,{children:"Start first with what your success criteria are. For example, if you run an e-commerce application, your measures of success may be number of purchases made over the past hour. If you run a non-profit, then it may be donations vs. your target for the month. A payment processor may watch for transaction processing time, whereas universities would want to measure student attendance."}),"\n",(0,i.jsx)(t.admonition,{type:"tip",children:(0,i.jsxs)(t.p,{children:["Success metrics are different for everyone! We may use an e-commerce application as an example here, but your projects can have a very different measurement. Regardless, the advice remains the same: know what ",(0,i.jsx)(t.em,{children:"good"})," looks like and measure for it."]})}),"\n",(0,i.jsxs)(t.p,{children:["Regardless of your application, you must start with identifying your key metrics. Then ",(0,i.jsxs)(t.em,{children:["work backwards",(0,i.jsx)(t.sup,{children:(0,i.jsx)(t.a,{href:"#user-content-fn-1",id:"user-content-fnref-1","data-footnote-ref":!0,"aria-describedby":"footnote-label",children:"1"})})]})," from that to see what impacts it from an application or infrastructure perspective. For example, if high CPU on your web servers endangers customer satisfaction, and in-turn your sales, then monitoring CPU utilization is important!"]}),"\n",(0,i.jsx)(t.h4,{id:"know-your-objectives-and-measure-them",children:"Know your objectives, and measure them!"}),"\n",(0,i.jsx)(t.p,{children:"Having identified your important top-level KPIs, your next job is to have an automated way to track and measure them. A critical success factor is doing so in the same system that watches your workload's operations. For our e-commerce workload example this may mean:"}),"\n",(0,i.jsxs)(t.ul,{children:["\n",(0,i.jsxs)(t.li,{children:["Publishing sales data into a ",(0,i.jsx)(t.a,{href:"https://en.wikipedia.org/wiki/Time_series",children:(0,i.jsx)(t.em,{children:"time series"})})]}),"\n",(0,i.jsx)(t.li,{children:"Tracking user registrations in this same system"}),"\n",(0,i.jsx)(t.li,{children:"Measure how long customers stay on web pages, and (again) push this data to a time series"}),"\n"]}),"\n",(0,i.jsxs)(t.p,{children:["Most customers have this data already, though not necessarily in the right places from an observability perspective. Sales data can typically be found in relational databases or business intelligence reporting systems, along with user registrations. And data from visit duration can be extracted from logs or from ",(0,i.jsx)(t.a,{href:"../tools/rum",children:"Real User Monitoring"}),"."]}),"\n",(0,i.jsxs)(t.p,{children:["Regardless of your metric data's original location or format, it must be maintained as a ",(0,i.jsx)(t.a,{href:"https://en.wikipedia.org/wiki/Time_series",children:(0,i.jsx)(t.em,{children:"time series"})}),". Every key metric that matters most to you, whether it is business, personal, academic, or for any other purpose, must be in a time series format for you to correlate it with other observability data (sometimes known as ",(0,i.jsx)(t.em,{children:"signals"})," or ",(0,i.jsx)(t.em,{children:"telemetry"}),")."]}),"\n",(0,i.jsxs)(t.p,{children:[(0,i.jsx)(t.img,{alt:"Example of a time series",src:o(28621).A+"",width:"2885",height:"1308"}),"\n",(0,i.jsx)(t.em,{children:"Figure 1: example of a time series"})]}),"\n",(0,i.jsx)(t.h2,{id:"context-propagation-and-tool-selection",children:"Context propagation and tool selection"}),"\n",(0,i.jsxs)(t.p,{children:["Tool selection is important and has a profound difference in how you operate and remediate problems. But worse than choosing a sub-optimal tool is tooling for all basic signal types. For example, collecting basic ",(0,i.jsx)(t.a,{href:"../signals/logs",children:"logs"}),' from a workload, but missing transaction traces, leaves you with a gap. The result is an incohesive view of your entire application experiece. All modern approaches to observability depend on "connecting the dots" with application traces.']}),"\n",(0,i.jsxs)(t.p,{children:["A complete picture of your health and operations requires tools that collect ",(0,i.jsx)(t.a,{href:"../signals/logs",children:"logs"}),", ",(0,i.jsx)(t.a,{href:"../signals/metrics",children:"metrics"}),", and ",(0,i.jsx)(t.a,{href:"../signals/traces",children:"traces"}),", and then performs correlation, analysis, ",(0,i.jsx)(t.a,{href:"../signals/anomalies",children:"anomaly detection"}),", ",(0,i.jsx)(t.a,{href:"../tools/dashboards",children:"dashboarding"}),", ",(0,i.jsx)(t.a,{href:"../tools/alarms",children:"alarms"})," and more."]}),"\n",(0,i.jsx)(t.admonition,{type:"info",children:(0,i.jsx)(t.p,{children:"Some observability solutions may not contain all of the above but are intended to augment, extend, or give added value to existing systems. In all cases, tool interoperability and extensibility is an important consideration when beginning an observability project."})}),"\n",(0,i.jsx)(t.h4,{id:"every-workload-is-different-but-common-tools-make-for-a-faster-results",children:"Every workload is different, but common tools make for a faster results"}),"\n",(0,i.jsx)(t.p,{children:"Using a common set of tools across every workload has add benefits such as reducing operational friction and training, and generally you should strive for a reduced number of tools or vendors. Doing so lets you rapidly deploy existing observability solutions to new environments or workloads, and with faster time-to-resolution when things go wrong."}),"\n",(0,i.jsx)(t.p,{children:"Your tools should be broad enough to observe every tier of your workload: basic infrastructure, applications, web sites, and everything in between. In places where a single tool is not possible, the best practice is to use those that have an open standard, are open source, and therefore have the broadest cross-platform integration possibilities."}),"\n",(0,i.jsx)(t.h4,{id:"integrate-with-existing-tools-and-processes",children:"Integrate with existing tools and processes"}),"\n",(0,i.jsx)(t.p,{children:'Don\'t reinvent the wheel! "Round" is a great shape already, and we should always be building collaborative and open systems, not data silos.'}),"\n",(0,i.jsxs)(t.ul,{children:["\n",(0,i.jsx)(t.li,{children:"Integrate with existing identity providers (e.g. Active Directory, SAML based IdPs)."}),"\n",(0,i.jsx)(t.li,{children:"If you have existing IT trouble tracking system (e.g. JIRA, ServiceNow) then integrate with it to quickly manage problems as they arise."}),"\n",(0,i.jsx)(t.li,{children:"Use existing workload management and escalation tools (e.g. PagerDuty, OpsGenie) if you already have them!"}),"\n",(0,i.jsxs)(t.li,{children:["Infrastructure as code tools such as Ansible, SaltStack, CloudFormation, TerraForm, and CDK are all great tools. Use them to manage your observability as well as everything else, and build your observability solution with the same infrastructure as code tools you already use today (see ",(0,i.jsx)(t.a,{href:"#include-observability-from-day-one",children:"include observability from day one"}),")."]}),"\n"]}),"\n",(0,i.jsx)(t.h4,{id:"use-automation-and-machine-learning",children:"Use automation and machine learning"}),"\n",(0,i.jsxs)(t.p,{children:["Computers are good at finding patterns, and at finding when data does ",(0,i.jsx)(t.em,{children:"not"})," follow a pattern! If you have hundreds, thousands, or even millions of datapoints to monitor, then it would impossible to understand healthy thresholds for every single one of them. But many observability solutions have anomaly detection and machine learning capabilities that manage the undifferentiated heavy lifting of baselining your data."]}),"\n",(0,i.jsx)(t.p,{children:'We refer to this as "knowing what good looks like". If you have load-tested your workload thoroughly then you may know these healthy performance metrics already, but for a complex distributed application it can be unwieldy to create baselines for every metric. This is where anomaly detection, automation, and machine learning are invaluable.'}),"\n",(0,i.jsxs)(t.p,{children:["Leverage tools that manage the baselining and alerting of applications health on your behalf, thereby letting you focus on your goals, and ",(0,i.jsx)(t.a,{href:"#monitor-what-matters",children:"monitor what matters"}),"."]}),"\n",(0,i.jsx)(t.h2,{id:"collect-telemetry-from-all-tiers-of-your-workload",children:"Collect telemetry from all tiers of your workload"}),"\n",(0,i.jsx)(t.p,{children:"Your applications do not exist in isolation, and interactions with your network infrastructure, cloud providers, internet service providers, SasS partners, and other components both within and outside your control can all impact your outcomes. It is important that you have a holistic view of your entire workload."}),"\n",(0,i.jsx)(t.h4,{id:"focus-on-integrations",children:"Focus on integrations"}),"\n",(0,i.jsx)(t.p,{children:"If you have to pick one area to instrument, it will undoubtedly be your integrations between components. This is where the power of observability is most evident. As a rule, every time one component or service calls another, that call must have at least these data points measured:"}),"\n",(0,i.jsxs)(t.ol,{children:["\n",(0,i.jsx)(t.li,{children:"The duration of the request and response"}),"\n",(0,i.jsx)(t.li,{children:"The status of the response"}),"\n"]}),"\n",(0,i.jsxs)(t.p,{children:["And to create the cohesive, holistic view that observability requires, a ",(0,i.jsx)(t.a,{href:"../signals/traces",children:"single unique identier"})," for the entire request chain must be included in the signals collected."]}),"\n",(0,i.jsx)(t.h4,{id:"dont-forget-about-the-end-user-experience",children:"Don't forget about the end-user experience"}),"\n",(0,i.jsx)(t.p,{children:"Having a complete view of your workload means understanding it at all tiers, including how your end users experience it. Measuring, quantifying, and understanding when your objectives are at risk from a poor user experience is just as important as watching for free disk space or CPU utilization - if not more important!"}),"\n",(0,i.jsxs)(t.p,{children:["If your workloads are ones that interact directly with the end user (such as any application served as a web site or mobile app) then ",(0,i.jsx)(t.a,{href:"../tools/rum",children:"Real User Monitoring"}),' monitors not just the "last mile" of delivery to the user, but how they actually have experienced your application. Ultimately, none of the observability journey matters if your users are unable to actually use your services.']}),"\n",(0,i.jsx)(t.h2,{id:"data-is-power-but-dont-sweat-the-small-stuff",children:"Data is power, but don't sweat the small stuff"}),"\n",(0,i.jsxs)(t.p,{children:["Depending on the size of your application, you may have a very large number of components to collect signals from. While doing so is important and empowering, there can be diminished returns from your efforts. This is why the best practice is to start by ",(0,i.jsx)(t.a,{href:"#monitor-what-matters",children:"monitoring what matters"}),", use this as a way to map your important integrations and critical components, and focus on the right details."]}),"\n",(0,i.jsx)(t.h2,{id:"include-observability-from-day-one",children:"Include observability from day one"}),"\n",(0,i.jsx)(t.p,{children:"Like security, observability should not be an afterthought to your development or operations. The best practice is to put observability early in your planning, just like security, which creates a model for people to work with and reduces opaque corners of your application. Adding transaction tracing after major development work is done takes time, even with auto-instrumentation. The effort returns far greater returns! But doing so late in your development cycle may create some rework."}),"\n",(0,i.jsxs)(t.p,{children:["Rather than bolting observability in your workload later one, use it to help ",(0,i.jsx)(t.em,{children:"accelerate"})," your work. Proper ",(0,i.jsx)(t.a,{href:"../signals/logs",children:"logging"}),", ",(0,i.jsx)(t.a,{href:"../signals/metrics",children:"metric"}),", and ",(0,i.jsx)(t.a,{href:"../signals/traces",children:"trace"})," collection enables faster application development, fosters good practices, and lays the foundation for rapid problem solving going forward."]}),"\n","\n",(0,i.jsxs)(t.section,{"data-footnotes":!0,className:"footnotes",children:[(0,i.jsx)(t.h2,{className:"sr-only",id:"footnote-label",children:"Footnotes"}),"\n",(0,i.jsxs)(t.ol,{children:["\n",(0,i.jsxs)(t.li,{id:"user-content-fn-1",children:["\n",(0,i.jsxs)(t.p,{children:["Amazon uses the ",(0,i.jsx)(t.em,{children:"working backwards"})," process extensively as a way to obsession over our customers and their outcomes, and we highly recommend that anyone working on observability solutions work backwards from their own objectives in the same way. You can read more about ",(0,i.jsx)(t.em,{children:"working backwards"})," on ",(0,i.jsx)(t.a,{href:"https://www.allthingsdistributed.com/2006/11/working_backwards.html",children:"Werner Vogels's blog"}),". ",(0,i.jsx)(t.a,{href:"#user-content-fnref-1","data-footnote-backref":"","aria-label":"Back to reference 1",className:"data-footnote-backref",children:"\u21a9"})]}),"\n"]}),"\n"]}),"\n"]})]})}function h(e={}){const{wrapper:t}={...(0,s.R)(),...e.components};return t?(0,i.jsx)(t,{...e,children:(0,i.jsx)(d,{...e})}):d(e)}},28621:(e,t,o)=>{o.d(t,{A:()=>i});const i=o.p+"assets/images/time_series-d1fd8b834c12869f97b606c2259a010d.png"},28453:(e,t,o)=>{o.d(t,{R:()=>a,x:()=>r});var i=o(96540);const s={},n=i.createContext(s);function a(e){const t=i.useContext(n);return i.useMemo((function(){return"function"==typeof e?e(t):{...t,...e}}),[t,e])}function r(e){let t;return t=e.disableParentContext?"function"==typeof e.components?e.components(s):e.components||s:a(e.components),i.createElement(n.Provider,{value:t},e.children)}}}]);
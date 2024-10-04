"use strict";(self.webpackChunkobservability_best_practices=self.webpackChunkobservability_best_practices||[]).push([[4764],{56029:(e,t,a)=>{a.r(t),a.d(t,{assets:()=>l,contentTitle:()=>r,default:()=>d,frontMatter:()=>i,metadata:()=>o,toc:()=>h});var s=a(74848),n=a(28453);const i={},r="Alarms",o={id:"signals/alarms",title:"Alarms",description:"An alarm refers to the state of a probe, monitor, or change in a value over or under a given threshold. A simple example would be an alarm that sends an email when a disk is full or a web site is down. More sophisticated alarms are entirely programmatic and used to drive complex interactions such as auto-scaling or creating of entire server clusters.",source:"@site/docs/signals/alarms.md",sourceDirName:"signals",slug:"/signals/alarms",permalink:"/observability-best-practices/signals/alarms",draft:!1,unlisted:!1,editUrl:"https://github.com/aws-observability/observability-best-practices/blob/main/docusaurus/docs/signals/alarms.md",tags:[],version:"current",frontMatter:{},sidebar:"sigals",previous:{title:"Traces",permalink:"/observability-best-practices/signals/traces"},next:{title:"Events",permalink:"/observability-best-practices/signals/events"}},l={},h=[{value:"Alert on things that are actionable",id:"alert-on-things-that-are-actionable",level:2},{value:"Beware of the &quot;everything is OK alarm&quot;",id:"beware-of-the-everything-is-ok-alarm",level:2},{value:"Fight alarm fatigue with aggregation",id:"fight-alarm-fatigue-with-aggregation",level:2},{value:"Use your existing ITSM and support processes",id:"use-your-existing-itsm-and-support-processes",level:2}];function c(e){const t={a:"a",admonition:"admonition",code:"code",em:"em",h1:"h1",h2:"h2",img:"img",li:"li",ol:"ol",p:"p",section:"section",sup:"sup",...(0,n.R)(),...e.components};return(0,s.jsxs)(s.Fragment,{children:[(0,s.jsx)(t.h1,{id:"alarms",children:"Alarms"}),"\n",(0,s.jsx)(t.p,{children:"An alarm refers to the state of a probe, monitor, or change in a value over or under a given threshold. A simple example would be an alarm that sends an email when a disk is full or a web site is down. More sophisticated alarms are entirely programmatic and used to drive complex interactions such as auto-scaling or creating of entire server clusters."}),"\n",(0,s.jsxs)(t.p,{children:["Regardless of the use case though, an alarm indicates the current ",(0,s.jsx)(t.em,{children:"state"})," of a metric. This state can be ",(0,s.jsx)(t.code,{children:"OK"}),", ",(0,s.jsx)(t.code,{children:"WARNING"}),", ",(0,s.jsx)(t.code,{children:"ALERT"}),", or ",(0,s.jsx)(t.code,{children:"NO DATA"}),", depending on the system in question."]}),"\n",(0,s.jsxs)(t.p,{children:["Alarms reflect this state for a period of time and are built on top of a timeseries. As such, they are derived ",(0,s.jsx)(t.em,{children:"from"})," a time series. This graph below shows two alarms: one with a warning threshold, and another that is indicative of average values across this timeseries. As the volume of traffic in this shows, the alarms for the warning threshold should be in a breach state when it dips below the defined value."]}),"\n",(0,s.jsx)(t.p,{children:(0,s.jsx)(t.img,{alt:"Timeseries with two alarms",src:a(83319).A+"",width:"625",height:"308"})}),"\n",(0,s.jsx)(t.admonition,{type:"info",children:(0,s.jsx)(t.p,{children:"The purpose of an alarm can be either to trigger an action (either human or progammatic), or to be informational (that a threshold is breached). Alarms provide insight into performance of a metric."})}),"\n",(0,s.jsx)(t.h2,{id:"alert-on-things-that-are-actionable",children:"Alert on things that are actionable"}),"\n",(0,s.jsx)(t.p,{children:"Alarm fatigue is when people get so many alerts that they have learned to ignore them. This is not an indication of a well-monitored system! Rather this is an anti-pattern."}),"\n",(0,s.jsx)(t.admonition,{type:"info",children:(0,s.jsxs)(t.p,{children:["Create alarms for things that are actionable, and you should always work from your ",(0,s.jsx)(t.a,{href:"../guides/#monitor-what-matters",children:"objectives"})," backwards."]})}),"\n",(0,s.jsxs)(t.p,{children:["For example, if you operate a web site that requires fast response times, create an alert to be delivered when your response times are exceeding a given threshold. And if you have identified that poor performance is tied to high CPU utilization then alert on this datapoint ",(0,s.jsx)(t.em,{children:"proactively"})," before it becomes an issue. However, there may no need to alert on all CPU utilization ",(0,s.jsx)(t.em,{children:"everywhere"})," in your environment if it does not ",(0,s.jsx)(t.em,{children:"endanger your outcomes"}),"."]}),"\n",(0,s.jsx)(t.admonition,{type:"info",children:(0,s.jsx)(t.p,{children:"If an alarm does not need alert you, or trigger an automated process, then there is no need to have it alert you. You should remove the notifications from alarms that are superfluous."})}),"\n",(0,s.jsx)(t.h2,{id:"beware-of-the-everything-is-ok-alarm",children:'Beware of the "everything is OK alarm"'}),"\n",(0,s.jsxs)(t.p,{children:['Likewise, a common pattern is the "everything is OK" alarm, when operators are so used to getting constant alerts that they only notice when things suddenly go silent! This is a very dangerous mode to operate in, and a pattern that works against ',(0,s.jsx)(t.a,{href:"../faq/#what-is-operational-excellence",children:"operational excellence"}),"."]}),"\n",(0,s.jsx)(t.admonition,{type:"warning",children:(0,s.jsxs)(t.p,{children:['The "everything is OK alarm" usually requries a human to interpret it! This makes patterns like self-healing applications impossible.',(0,s.jsx)(t.sup,{children:(0,s.jsx)(t.a,{href:"#user-content-fn-1",id:"user-content-fnref-1","data-footnote-ref":!0,"aria-describedby":"footnote-label",children:"1"})})]})}),"\n",(0,s.jsx)(t.h2,{id:"fight-alarm-fatigue-with-aggregation",children:"Fight alarm fatigue with aggregation"}),"\n",(0,s.jsxs)(t.p,{children:["Observability is a ",(0,s.jsx)(t.em,{children:"human"})," problem, not a technology problem. And as such, your alarm strategy should focus on reducing alarms rather than creating more. As you implement  telemetry collection, it is natural to have more alerts from your environment. Be cautious though to only ",(0,s.jsx)(t.a,{href:"../signals/alarms/#alert-on-things-that-are-actionable",children:"alert on things that are actionable"}),". If the condition that caused the alert is not actionable then there is no need to report on it."]}),"\n",(0,s.jsxs)(t.p,{children:["This is best shown by example: if you have five web servers that use a single database for their backend, what happens to your web servers if the database is down? The answer for many people is that they get ",(0,s.jsx)(t.em,{children:"at least six"})," alerts - ",(0,s.jsx)(t.em,{children:"five"})," for the web servers and ",(0,s.jsx)(t.em,{children:"one"})," for the database!"]}),"\n",(0,s.jsx)(t.p,{children:(0,s.jsx)(t.img,{alt:"Six alarms",src:a(38292).A+"",width:"889",height:"649"})}),"\n",(0,s.jsx)(t.p,{children:"But there are only two alerts that make sense to deliver:"}),"\n",(0,s.jsxs)(t.ol,{children:["\n",(0,s.jsx)(t.li,{children:"The web site is down, and"}),"\n",(0,s.jsx)(t.li,{children:"The database is the cause"}),"\n"]}),"\n",(0,s.jsx)(t.p,{children:(0,s.jsx)(t.img,{alt:"Two alarms",src:a(4555).A+"",width:"824",height:"649"})}),"\n",(0,s.jsx)(t.admonition,{type:"info",children:(0,s.jsx)(t.p,{children:"Distilling your alerts into aggregates makes it easier for people to understand, and then easier to create runbooks and automation for."})}),"\n",(0,s.jsx)(t.h2,{id:"use-your-existing-itsm-and-support-processes",children:"Use your existing ITSM and support processes"}),"\n",(0,s.jsx)(t.p,{children:"Regardless of your monitoring and observability platform, they must integrate into your current toolchain."}),"\n",(0,s.jsx)(t.admonition,{type:"info",children:(0,s.jsx)(t.p,{children:"Create trouble tickets and issues using a programmatic integration from your alerts into these tools, removing human effort and streamlining processes along the way."})}),"\n",(0,s.jsxs)(t.p,{children:["This allows you to derive important operatonal data such as ",(0,s.jsx)(t.a,{href:"https://en.wikipedia.org/wiki/DevOps",children:"DORA metrics"}),"."]}),"\n","\n",(0,s.jsxs)(t.section,{"data-footnotes":!0,className:"footnotes",children:[(0,s.jsx)(t.h2,{className:"sr-only",id:"footnote-label",children:"Footnotes"}),"\n",(0,s.jsxs)(t.ol,{children:["\n",(0,s.jsxs)(t.li,{id:"user-content-fn-1",children:["\n",(0,s.jsxs)(t.p,{children:["See ",(0,s.jsx)(t.a,{href:"https://aws.amazon.com/blogs/apn/building-self-healing-infrastructure-as-code-with-dynatrace-aws-lambda-and-aws-service-catalog/",children:"https://aws.amazon.com/blogs/apn/building-self-healing-infrastructure-as-code-with-dynatrace-aws-lambda-and-aws-service-catalog/"})," for more about this pattern. ",(0,s.jsx)(t.a,{href:"#user-content-fnref-1","data-footnote-backref":"","aria-label":"Back to reference 1",className:"data-footnote-backref",children:"\u21a9"})]}),"\n"]}),"\n"]}),"\n"]})]})}function d(e={}){const{wrapper:t}={...(0,n.R)(),...e.components};return t?(0,s.jsx)(t,{...e,children:(0,s.jsx)(c,{...e})}):c(e)}},38292:(e,t,a)=>{a.d(t,{A:()=>s});const s=a.p+"assets/images/alarm3-86677227a0a79be2076103507531a6a6.png"},4555:(e,t,a)=>{a.d(t,{A:()=>s});const s=a.p+"assets/images/alarm4-0e146cf7bb6aa818be3b76ef6e3e25ec.png"},83319:(e,t,a)=>{a.d(t,{A:()=>s});const s=a.p+"assets/images/cwalarm2-eba669037e508065fed3158cf2187274.png"},28453:(e,t,a)=>{a.d(t,{R:()=>r,x:()=>o});var s=a(96540);const n={},i=s.createContext(n);function r(e){const t=s.useContext(i);return s.useMemo((function(){return"function"==typeof e?e(t):{...t,...e}}),[t,e])}function o(e){let t;return t=e.disableParentContext?"function"==typeof e.components?e.components(n):e.components||n:r(e.components),s.createElement(i.Provider,{value:t},e.children)}}}]);
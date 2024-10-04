"use strict";(self.webpackChunkobservability_best_practices=self.webpackChunkobservability_best_practices||[]).push([[3928],{69020:(e,t,o)=>{o.r(t),o.d(t,{assets:()=>l,contentTitle:()=>i,default:()=>h,frontMatter:()=>n,metadata:()=>r,toc:()=>c});var s=o(74848),a=o(28453);const n={},i="Logs",r={id:"signals/logs",title:"Logs",description:"Logs are a series of messages that are sent by an application, or an appliance, that are represented by one or more lines of details about an event, or sometimes about the health of that application. Typically, logs are delivered to a file, though sometimes they are sent to a collector that performs analysis and aggregation. There are many full-featured log aggregators, frameworks, and products that aim to make the task of generating, ingesting, and managing log data at any volume \u2013 from megabytes per day to terabytes per hour.",source:"@site/docs/signals/logs.md",sourceDirName:"signals",slug:"/signals/logs",permalink:"/observability-best-practices/docs/signals/logs",draft:!1,unlisted:!1,editUrl:"https://github.com/aws-observability/observability-best-practices/blob/main/docusaurus/docs/signals/logs.md",tags:[],version:"current",frontMatter:{},sidebar:"sigals",next:{title:"Metrics",permalink:"/observability-best-practices/docs/signals/metrics"}},l={},c=[{value:"Structured logging is key to success",id:"structured-logging-is-key-to-success",level:2},{value:"Use log levels appropriately",id:"use-log-levels-appropriately",level:2},{value:"Filter logs close to the source",id:"filter-logs-close-to-the-source",level:2},{value:"Avoid double-ingestion antipatterns",id:"avoid-double-ingestion-antipatterns",level:2},{value:"Collect metric data from your logs",id:"collect-metric-data-from-your-logs",level:2},{value:"Log to <code>stdout</code>",id:"log-to-stdout",level:2}];function d(e){const t={a:"a",admonition:"admonition",code:"code",em:"em",h1:"h1",h2:"h2",img:"img",li:"li",p:"p",pre:"pre",table:"table",tbody:"tbody",td:"td",th:"th",thead:"thead",tr:"tr",ul:"ul",...(0,a.R)(),...e.components};return(0,s.jsxs)(s.Fragment,{children:[(0,s.jsx)(t.h1,{id:"logs",children:"Logs"}),"\n",(0,s.jsx)(t.p,{children:"Logs are a series of messages that are sent by an application, or an appliance, that are represented by one or more lines of details about an event, or sometimes about the health of that application. Typically, logs are delivered to a file, though sometimes they are sent to a collector that performs analysis and aggregation. There are many full-featured log aggregators, frameworks, and products that aim to make the task of generating, ingesting, and managing log data at any volume \u2013 from megabytes per day to terabytes per hour."}),"\n",(0,s.jsxs)(t.p,{children:["Logs are emitted by a single application at a time and usually pertain to the scope of that ",(0,s.jsx)(t.em,{children:"one application"})," - though developers are free to have logs be as complex and nuanced as they desire. For our purposes we consider logs to be a fundamentally different signal from ",(0,s.jsx)(t.a,{href:"../signals/traces",children:"traces"}),", which are composed of events from more than one application or a service, and with context about the connection between services such as response latency, service faults, request parameters etc."]}),"\n",(0,s.jsx)(t.p,{children:"Data in logs can also be aggregate over a period of time. For example, they may be statistical (e.g. number of requests served over the previous minute). They can be structured, free-form, verbose, and in any written language."}),"\n",(0,s.jsx)(t.p,{children:"The primary use cases for logging are describing,"}),"\n",(0,s.jsxs)(t.ul,{children:["\n",(0,s.jsx)(t.li,{children:"an event, including its status and duration, and other vital statistics"}),"\n",(0,s.jsx)(t.li,{children:"errors or warnings related to that event (e.g. stack traces, timeouts)"}),"\n",(0,s.jsx)(t.li,{children:"application launches, start-up and shutdown messages"}),"\n"]}),"\n",(0,s.jsx)(t.admonition,{type:"note",children:(0,s.jsxs)(t.p,{children:["Logs are intended to be ",(0,s.jsx)(t.em,{children:"immutable"}),", and many log management systems include mechanisms to protect against, and detect attempts, to modify log data."]})}),"\n",(0,s.jsx)(t.p,{children:"Regardless of your requirements for logging, these are the best practices that we have identified."}),"\n",(0,s.jsx)(t.h2,{id:"structured-logging-is-key-to-success",children:"Structured logging is key to success"}),"\n",(0,s.jsx)(t.p,{children:"Many systems will emit logs in a semi-structured format. For example, an Apache web server may write logs like this, with each line pertaining to a single web request:"}),"\n",(0,s.jsx)(t.p,{children:'192.168.2.20 - - [28/Jul/2006:10:27:10 -0300] "GET /cgi-bin/try/ HTTP/1.0" 200 3395\n127.0.0.1 - - [28/Jul/2006:10:22:04 -0300] "GET / HTTP/1.0" 200 2216'}),"\n",(0,s.jsx)(t.p,{children:"Whereas a Java stack trace may be a single event that spans multiple lines and is less structured:"}),"\n",(0,s.jsx)(t.p,{children:'Exception in thread "main" java.lang.NullPointerException\nat com.example.myproject.Book.getTitle(Book.java:16)\nat com.example.myproject.Author.getBookTitles(Author.java:25)\nat com.example.myproject.Bootstrap.main(Bootstrap.java:14)'}),"\n",(0,s.jsx)(t.p,{children:"And a Python error log event may look like this:"}),"\n",(0,s.jsx)(t.pre,{children:(0,s.jsx)(t.code,{children:'\tTraceback (most recent call last):\n\t  File "e.py", line 7, in <module>\n\t    raise TypeError("Again !?!")\n\tTypeError: Again !?!\n'})}),"\n",(0,s.jsxs)(t.p,{children:["Of these three examples, only the first one is easily parsed by both humans ",(0,s.jsx)(t.em,{children:"and"})," a log aggregation system. Using structured logs makes it easy to process log data quickly and effectively, giving both humans and machines the data they need to immediately find what they are looking for."]}),"\n",(0,s.jsx)(t.p,{children:"The most commonly understood log format is JSON, wherein each component to an event is represented as a key/value pair. In JSON, the python example above may be rewritten to look like this:"}),"\n",(0,s.jsx)(t.pre,{children:(0,s.jsx)(t.code,{children:'\t{\n\t\t"level", "ERROR"\n\t\t"file": "e.py",\n\t\t"line": 7,\n\t\t"error": "TypeError(\\"Again !?!\\")"\n\t}\n'})}),"\n",(0,s.jsx)(t.p,{children:"The use of structured logs makes your data transportable from one log system to another, simplifies development, and make operational diagnosis faster (with less errors). Also, using JSON embeds the schema of the log message along with the actual data, which enables sophisticated log analysis systems to index your messages automatically."}),"\n",(0,s.jsx)(t.h2,{id:"use-log-levels-appropriately",children:"Use log levels appropriately"}),"\n",(0,s.jsxs)(t.p,{children:["There are two types of logs: those that have a ",(0,s.jsx)(t.em,{children:"level"})," and those that are a series of events. For those that have a level, these are a critical component to a successful logging strategy. Log levels vary slightly from one framework to another, but generally they follow this structure:"]}),"\n",(0,s.jsxs)(t.table,{children:[(0,s.jsx)(t.thead,{children:(0,s.jsxs)(t.tr,{children:[(0,s.jsx)(t.th,{children:"Level"}),(0,s.jsx)(t.th,{children:"Description"})]})}),(0,s.jsxs)(t.tbody,{children:[(0,s.jsxs)(t.tr,{children:[(0,s.jsx)(t.td,{children:(0,s.jsx)(t.code,{children:"DEBUG"})}),(0,s.jsx)(t.td,{children:"Fine-grained informational events that are most useful to debug an application. These are usually of value to devlopers and are very verbose."})]}),(0,s.jsxs)(t.tr,{children:[(0,s.jsx)(t.td,{children:(0,s.jsx)(t.code,{children:"INFO"})}),(0,s.jsx)(t.td,{children:"Informational messages that highlight the progress of the application at coarse-grained level."})]}),(0,s.jsxs)(t.tr,{children:[(0,s.jsx)(t.td,{children:(0,s.jsx)(t.code,{children:"WARN"})}),(0,s.jsx)(t.td,{children:"Potentially harmful situations that indicate a risk to an application. These can trigger an alarm in an applicaiton."})]}),(0,s.jsxs)(t.tr,{children:[(0,s.jsx)(t.td,{children:(0,s.jsx)(t.code,{children:"ERROR"})}),(0,s.jsx)(t.td,{children:"Error events that might still allow the application to continue running. These are likely to trigger an alarm that requires attention."})]}),(0,s.jsxs)(t.tr,{children:[(0,s.jsx)(t.td,{children:(0,s.jsx)(t.code,{children:"FATAL"})}),(0,s.jsx)(t.td,{children:"Very severe error events that will presumably cause an application to abort."})]})]})]}),"\n",(0,s.jsx)(t.admonition,{type:"info",children:(0,s.jsxs)(t.p,{children:["Implicitly logs that have no explicit level may be considered as ",(0,s.jsx)(t.code,{children:"INFO"}),", though this behaviour may vary between applications."]})}),"\n",(0,s.jsxs)(t.p,{children:["Other common log levels are ",(0,s.jsx)(t.code,{children:"CRITICAL"})," and ",(0,s.jsx)(t.code,{children:"NONE"}),", depending on your needs, programming language, and framework. ",(0,s.jsx)(t.code,{children:"ALL"})," and ",(0,s.jsx)(t.code,{children:"NONE"})," are also common, though not found in every application stack."]}),"\n",(0,s.jsx)(t.p,{children:"Log levels are crucial for informing your monitoring and observability solution about the health of your environment, and log data should easily express this data using a logical value."}),"\n",(0,s.jsx)(t.admonition,{type:"tip",children:(0,s.jsxs)(t.p,{children:["Logging too much data at ",(0,s.jsx)(t.code,{children:"WARN"})," will fill your monitoring system with data that is of limited value, and then you may lose important data in the sheer volume of messages."]})}),"\n",(0,s.jsx)(t.p,{children:(0,s.jsx)(t.img,{alt:"Logs flowchart",src:o(13132).A+"",width:"1258",height:"520"})}),"\n",(0,s.jsx)(t.admonition,{type:"info",children:(0,s.jsx)(t.p,{children:"Using a standardized log level strategy makes automation easier, and helps developers get to the root cause of issues quickly."})}),"\n",(0,s.jsx)(t.admonition,{type:"warning",children:(0,s.jsxs)(t.p,{children:["Without a standard approach to log levels, ",(0,s.jsx)(t.a,{href:"#filter-logs-close-to-the-source",children:"filtering your logs"})," is a major challenge."]})}),"\n",(0,s.jsx)(t.h2,{id:"filter-logs-close-to-the-source",children:"Filter logs close to the source"}),"\n",(0,s.jsx)(t.p,{children:"Wherever possible, reduce the volume of logs as close to the source as possible. There are many reasons to follow this best practice:"}),"\n",(0,s.jsxs)(t.ul,{children:["\n",(0,s.jsx)(t.li,{children:"Ingesting logs always costs time, money, and resources."}),"\n",(0,s.jsx)(t.li,{children:"Filtering sensitive data (e.g. personally identifiable data) from downstream systems reduces risk exposure from data leakage."}),"\n",(0,s.jsxs)(t.li,{children:["Downstream systems may not have the same operational concerns as the sources of data. For example, ",(0,s.jsx)(t.code,{children:"INFO"})," logs from an application may be of no interest to a monitoring and alerting system that watches for ",(0,s.jsx)(t.code,{children:"CRITCAL"})," or ",(0,s.jsx)(t.code,{children:"FATAL"})," messages."]}),"\n",(0,s.jsx)(t.li,{children:"Log systems, and networks, need not be placed under undue stress and traffic."}),"\n"]}),"\n",(0,s.jsx)(t.admonition,{type:"info",children:(0,s.jsxs)(t.p,{children:["Filter your log close to the source to keep your costs down, decrease risk of data exposure, and focus each component on the ",(0,s.jsx)(t.a,{href:"../guides/#monitor-what-matters",children:"things that matter"}),"."]})}),"\n",(0,s.jsx)(t.admonition,{type:"tip",children:(0,s.jsxs)(t.p,{children:["Depending on your architecture, you may wish to use infrastructure as code (IaC) to deploy changes to your application ",(0,s.jsx)(t.em,{children:"and"})," environment in one operation. This approach allows you to deploy your log filter patterns along with applications, giving them the same rigor and treatment."]})}),"\n",(0,s.jsx)(t.h2,{id:"avoid-double-ingestion-antipatterns",children:"Avoid double-ingestion antipatterns"}),"\n",(0,s.jsx)(t.p,{children:"A common pattern that administrators pursue is copying all of their logging data into a single system with the goal querying all of their logs all from a single location. There are some manual workflow advantages to doing so, however this pattern introduces additional cost, complexity, points of failure, and operational overhead."}),"\n",(0,s.jsx)(t.p,{children:(0,s.jsx)(t.img,{alt:"Double log ingestion",src:o(15783).A+"",width:"1262",height:"1043"})}),"\n",(0,s.jsx)(t.admonition,{type:"info",children:(0,s.jsxs)(t.p,{children:["Where possible, use a combination of ",(0,s.jsx)(t.a,{href:"#use-log-levels-appropriately",children:"log levels"})," and ",(0,s.jsx)(t.a,{href:"#filter-logs-close-to-the-source",children:"log filtering"})," to avoid a wholesale propagation of log data from your environments."]})}),"\n",(0,s.jsx)(t.admonition,{type:"info",children:(0,s.jsxs)(t.p,{children:["Some organizations or workloads require ",(0,s.jsx)(t.a,{href:"https://en.wikipedia.org/wiki/Log_shipping",children:"log shipping"})," in order to meet regulatory requirements, store logs in a secure location, provide non-reputability, or achieve other objectives. This is a common use case for re-ingesting log data. Note that a proper application of ",(0,s.jsx)(t.a,{href:"#use-log-levels-appropriately",children:"log levels"})," and ",(0,s.jsx)(t.a,{href:"#filter-logs-close-to-the-source",children:"log filtering"})," is still appropriate to reduce the volume of superfluous data entering these log archives."]})}),"\n",(0,s.jsx)(t.h2,{id:"collect-metric-data-from-your-logs",children:"Collect metric data from your logs"}),"\n",(0,s.jsxs)(t.p,{children:["Your logs contain ",(0,s.jsx)(t.a,{href:"../signals/metrics/",children:"metrics"})," that are just waiting to be collected! Even ISV solutions or applications that you have not written yourself will emit valuable data into their logs that you can extract meaningful insights into overall workload health from. Common examples include:"]}),"\n",(0,s.jsxs)(t.ul,{children:["\n",(0,s.jsx)(t.li,{children:"Slow query time from databases"}),"\n",(0,s.jsx)(t.li,{children:"Uptime from web servers"}),"\n",(0,s.jsx)(t.li,{children:"Transaction processing time"}),"\n",(0,s.jsxs)(t.li,{children:["Counts of ",(0,s.jsx)(t.code,{children:"ERROR"})," or ",(0,s.jsx)(t.code,{children:"WARNING"})," events over time"]}),"\n",(0,s.jsx)(t.li,{children:"Raw count of packages that are available for upgrade"}),"\n"]}),"\n",(0,s.jsx)(t.admonition,{type:"tip",children:(0,s.jsx)(t.p,{children:"This data is less useful when locked in a static log file. The best practice is to identify key metric data and then publish it into your metric system where it can be correlated with other signals."})}),"\n",(0,s.jsxs)(t.h2,{id:"log-to-stdout",children:["Log to ",(0,s.jsx)(t.code,{children:"stdout"})]}),"\n",(0,s.jsxs)(t.p,{children:["Where possible, applications shouould log to ",(0,s.jsx)(t.code,{children:"stdout"})," rather than to a fixed location such as a file or socket. This enables log agents to collect and route your log events based on rules that make sense for your own observability solution. While not possible for all applications, this is the best practice for containerized workloads."]}),"\n",(0,s.jsx)(t.admonition,{type:"note",children:(0,s.jsxs)(t.p,{children:["While applications should be generic and simple in their logging practices, remaining loosely coupled from logging solutions, the transmission of log data does still require a ",(0,s.jsx)(t.a,{href:"../tools/logs/",children:"log collector"})," to send data from ",(0,s.jsx)(t.code,{children:"stdout"})," to a file. The important concept is to avoid application and business logic being dependant on your logging infrastructure - in other words, you should work to separate your concerns."]})}),"\n",(0,s.jsx)(t.admonition,{type:"info",children:(0,s.jsxs)(t.p,{children:["Decoupling your application from your log management lets you adapt and evolve your solution without code changes, thereby minimizing the potential ",(0,s.jsx)(t.a,{href:"../faq/#what-is-a-blast-radius",children:"blast radius"})," of changes made to your environment."]})})]})}function h(e={}){const{wrapper:t}={...(0,a.R)(),...e.components};return t?(0,s.jsx)(t,{...e,children:(0,s.jsx)(d,{...e})}):d(e)}},13132:(e,t,o)=>{o.d(t,{A:()=>s});const s=o.p+"assets/images/logs1-a4f5f8c5bd17e1d4d6da94f05b4ade60.png"},15783:(e,t,o)=>{o.d(t,{A:()=>s});const s=o.p+"assets/images/logs2-d1b23acd6d8ac5f898f717570e296fa9.png"},28453:(e,t,o)=>{o.d(t,{R:()=>i,x:()=>r});var s=o(96540);const a={},n=s.createContext(a);function i(e){const t=s.useContext(n);return s.useMemo((function(){return"function"==typeof e?e(t):{...t,...e}}),[t,e])}function r(e){let t;return t=e.disableParentContext?"function"==typeof e.components?e.components(a):e.components||a:i(e.components),s.createElement(n.Provider,{value:t},e.children)}}}]);
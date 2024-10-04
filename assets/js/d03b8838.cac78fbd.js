"use strict";(self.webpackChunkobservability_best_practices=self.webpackChunkobservability_best_practices||[]).push([[6149],{66128:(e,t,o)=>{o.r(t),o.d(t,{assets:()=>h,contentTitle:()=>s,default:()=>c,frontMatter:()=>n,metadata:()=>r,toc:()=>d});var i=o(74848),a=o(28453);const n={},s="Dashboards",r={id:"tools/dashboards",title:"Dashboards",description:"Dashboards are an important part of your Observability soluution. They enable you to produce a curated visualization of your data. They enable you see a history of your data, and see it alongside other related data. They also allow you to provide context. They help you understand the bigger picture.",source:"@site/docs/tools/dashboards.md",sourceDirName:"tools",slug:"/tools/dashboards",permalink:"/observability-best-practices/docs/tools/dashboards",draft:!1,unlisted:!1,editUrl:"https://github.com/aws-observability/observability-best-practices/blob/main/docusaurus/docs/tools/dashboards.md",tags:[],version:"current",frontMatter:{},sidebar:"tools",previous:{title:"Alarms",permalink:"/observability-best-practices/docs/tools/alarms"},next:{title:"Internet Monitor",permalink:"/observability-best-practices/docs/tools/internet_monitor"}},h={},d=[{value:"A practical example: consider an alarm for high CPU",id:"a-practical-example-consider-an-alarm-for-high-cpu",level:2},{value:"See the history of the data",id:"see-the-history-of-the-data",level:3},{value:"See the impact on the workflow",id:"see-the-impact-on-the-workflow",level:3},{value:"See the history of the alarm",id:"see-the-history-of-the-alarm",level:3},{value:"Add context",id:"add-context",level:3},{value:"Don&#39;t try to visualize everything all at once",id:"dont-try-to-visualize-everything-all-at-once",level:3},{value:"Design your dashboard: KPI driven",id:"design-your-dashboard-kpi-driven",level:4},{value:"Design your dashboard: Incident driven",id:"design-your-dashboard-incident-driven",level:4},{value:"Layout",id:"layout",level:3},{value:"Create dynamic content",id:"create-dynamic-content",level:3},{value:"Think about symptoms first over causes",id:"think-about-symptoms-first-over-causes",level:3},{value:"Use top/bottom N",id:"use-topbottom-n",level:3},{value:"Show KPIs with thresholds visually",id:"show-kpis-with-thresholds-visually",level:3},{value:"The importance of context",id:"the-importance-of-context",level:3}];function l(e){const t={a:"a",admonition:"admonition",code:"code",em:"em",h1:"h1",h2:"h2",h3:"h3",h4:"h4",img:"img",li:"li",mdxAdmonitionTitle:"mdxAdmonitionTitle",p:"p",pre:"pre",strong:"strong",ul:"ul",...(0,a.R)(),...e.components};return(0,i.jsxs)(i.Fragment,{children:[(0,i.jsx)(t.h1,{id:"dashboards",children:"Dashboards"}),"\n",(0,i.jsx)(t.p,{children:"Dashboards are an important part of your Observability soluution. They enable you to produce a curated visualization of your data. They enable you see a history of your data, and see it alongside other related data. They also allow you to provide context. They help you understand the bigger picture."}),"\n",(0,i.jsx)(t.p,{children:"Often people gather their data and create alarms, and then stop. However, alarms only show a point in time, and usually for a single metric, or small set of data. Dashboards help you see the behaviour over time."}),"\n",(0,i.jsx)(t.p,{children:(0,i.jsx)(t.img,{alt:"Sample dashboard",src:o(75299).A+"",width:"2912",height:"1699"})}),"\n",(0,i.jsx)(t.h2,{id:"a-practical-example-consider-an-alarm-for-high-cpu",children:"A practical example: consider an alarm for high CPU"}),"\n",(0,i.jsx)(t.p,{children:"You know the machine is running with higher than desired CPU. Do you need to act, and how quickly? What might help you decide?"}),"\n",(0,i.jsxs)(t.ul,{children:["\n",(0,i.jsx)(t.li,{children:"What does normal CPU look like for this instance/application?"}),"\n",(0,i.jsx)(t.li,{children:"Is this a spike, or a trend of increasing CPU?"}),"\n",(0,i.jsx)(t.li,{children:"Is it impacting performance? If not, how long before it will does?"}),"\n",(0,i.jsx)(t.li,{children:"Is this a regular occurrance? And does it usually recover on its own?"}),"\n"]}),"\n",(0,i.jsx)(t.h3,{id:"see-the-history-of-the-data",children:"See the history of the data"}),"\n",(0,i.jsx)(t.p,{children:"Now consider a dashboard, with a historic timechart of the CPU. Even with only this single metric, you can see if this is a spike, or an upward trend. You can also see how quickly it is trending upwards, and so make some decisions on the priority for action."}),"\n",(0,i.jsx)(t.h3,{id:"see-the-impact-on-the-workflow",children:"See the impact on the workflow"}),"\n",(0,i.jsx)(t.p,{children:"But what does this machine do? How important is this in our overall context? Imagine we now add a visualization of the workflow  performance, be it response time, throughput, errors, or some other measure. Now we can see if the high CPU is having an impact on the workflow or users this instance is supporting."}),"\n",(0,i.jsx)(t.h3,{id:"see-the-history-of-the-alarm",children:"See the history of the alarm"}),"\n",(0,i.jsx)(t.p,{children:"Consider adding a visualization which shows how often the alarm has triggered in the last month, and combining that with looking further back to see if this is a regular occurrance. For example, is a backup job triggering the spike? Knowing the pattern of reoccurance can help you understand the underlying issue, and make longer term decisions on how to stop the alarm reoccurring altogether."}),"\n",(0,i.jsx)(t.h3,{id:"add-context",children:"Add context"}),"\n",(0,i.jsx)(t.p,{children:"Finally, add some context to the dashboard. Include a brief description of the reason this dashboard exists, the workflow it relates to, what to do when there is an issue, links to documentation, and who to contact."}),"\n",(0,i.jsx)(t.admonition,{type:"info",children:(0,i.jsxs)(t.p,{children:["Now we have a ",(0,i.jsx)(t.em,{children:"story"}),", which helps the dashboard user to see what is happening, understand the impact, and make appropriate data driven decisions on what action and the urgency of it."]})}),"\n",(0,i.jsx)(t.h3,{id:"dont-try-to-visualize-everything-all-at-once",children:"Don't try to visualize everything all at once"}),"\n",(0,i.jsx)(t.p,{children:"We often talk about alarm fatigue. Too many alarms, without identifiable actions and priorities, can overload your team and lead to inefficiencies. Alarms should be for things which are important to you, and actionable."}),"\n",(0,i.jsx)(t.p,{children:"Dashboards are more flexible here. They don't demand your attention in the same way, so you have more freedom to visualize things that you may not be certain are important yet, or that support your exploration. Still, don't over do it! Everything can suffer from too much of a good thing."}),"\n",(0,i.jsx)(t.p,{children:"Dashboards should provide a picture of something that is important to you. In the same was as deciding what data to ingest, you need to think about what matters to you for dashboards.\nFor your dashboards, think about"}),"\n",(0,i.jsxs)(t.ul,{children:["\n",(0,i.jsxs)(t.li,{children:["Who will be viewing this?","\n",(0,i.jsxs)(t.ul,{children:["\n",(0,i.jsx)(t.li,{children:"What is their background and knowledge?"}),"\n",(0,i.jsx)(t.li,{children:"How much context do they need?"}),"\n"]}),"\n"]}),"\n",(0,i.jsx)(t.li,{children:"What questions are they trying to answer?"}),"\n",(0,i.jsx)(t.li,{children:"What actions will they be taking as a result of seeing this data?"}),"\n"]}),"\n",(0,i.jsx)(t.admonition,{type:"tip",children:(0,i.jsxs)(t.p,{children:["Sometimes it can be hard to know what your dashboard story should be, and how much to include. So where could you start to design your dashboard? Lets look at two ways: ",(0,i.jsx)(t.em,{children:"KPI driven"}),", or ",(0,i.jsx)(t.em,{children:"incident driven"}),"."]})}),"\n",(0,i.jsx)(t.h4,{id:"design-your-dashboard-kpi-driven",children:"Design your dashboard: KPI driven"}),"\n",(0,i.jsxs)(t.p,{children:["One way to understand this is to work back from your KPIs. This is usually a very user driven approach.\nFor ",(0,i.jsx)(t.a,{href:"#layout",children:"layout"}),", typically we are working top down, getting to more detail as we move further down a dashboard, or navigate to lower level dashboards."]}),"\n",(0,i.jsxs)(t.p,{children:["First, ",(0,i.jsx)(t.strong,{children:"understand your KPIs"}),". What they mean. This wil help you decide how you want to visualize these.\nMany KPIs are shown as a single number. For example, what percentage of customers are successfully completing a specific workflow, and in what time? But over what time period? You may well meet your KPI if you average over a week, but still have smaller periods of time within this that breach your standards. Are these breaches important to you? Do they impact your customer experience. If so, you may consider different periods and time charts to see your KPIs. And maybe not everyone needs to see the detail, so perhaps you move the breakdown of KPIs to a separate dashboard, for a separate audience."]}),"\n",(0,i.jsxs)(t.p,{children:["Next, ",(0,i.jsx)(t.strong,{children:"what contribute to those KPIs?"})," What workflows need to be running in order for those actions to happen? Can you measure these?"]}),"\n",(0,i.jsx)(t.p,{children:"Identify the main components and add visualizations of their performance. When a KPI breeches, you should be able to quickly look and see where in the workflow the main impact is."}),"\n",(0,i.jsx)(t.p,{children:"And you can keep going down - what impacts the perfomance of those workflows? Remember your audience as you decide the level of depth."}),"\n",(0,i.jsx)(t.p,{children:"Consider the example of an e-commerce system with a KPI for the number of order placed.\nFor an order to be placed, users must be able to perform the following action: search for products, add them to their cart, add their delivery details, and pay for the order.\nFor each of these workflows, you might consider checking key components are functioning. For example by using RUM or Synthetics to get data on action success and see if the user is being impacted by an issue. You might consider a measurement of throughput, latency, failed action percentages to see if the performance of each action is as expected. You might consider measurements of the underlying infrastructure to see what might be impacting performance."}),"\n",(0,i.jsx)(t.p,{children:"However, don't put all of your information on the same dashboard. Again, consider your user audience."}),"\n",(0,i.jsx)(t.admonition,{type:"info",children:(0,i.jsx)(t.p,{children:"Create layers of dashboards that allow drilldown and provide the right context for the right users."})}),"\n",(0,i.jsx)(t.h4,{id:"design-your-dashboard-incident-driven",children:"Design your dashboard: Incident driven"}),"\n",(0,i.jsx)(t.p,{children:"For many people, incident resolution is a key driver for observability. You have been alerted to an issue, by a user, or by an Observability alarm, and you need to quickly find a fix and potentially a root cause of the issue."}),"\n",(0,i.jsx)(t.admonition,{type:"info",children:(0,i.jsx)(t.p,{children:"Start by looking at your recent incidents. Are there common patterns? Which were the most impactful for your company? Which ones repeat?"})}),"\n",(0,i.jsx)(t.p,{children:"In this case, we're designing a dashboard for those trying to understand the severity, identify the root cause and fix the incident."}),"\n",(0,i.jsx)(t.p,{children:"Think back to the specific indcident."}),"\n",(0,i.jsxs)(t.ul,{children:["\n",(0,i.jsxs)(t.li,{children:["How did you verify the incident was as reported?","\n",(0,i.jsxs)(t.ul,{children:["\n",(0,i.jsx)(t.li,{children:"What did you check? Endpoints? Errors?"}),"\n"]}),"\n"]}),"\n",(0,i.jsx)(t.li,{children:"How did you understand the impact, and therefore priority of the issue?"}),"\n",(0,i.jsx)(t.li,{children:"What did you look at for cause of the issue?"}),"\n"]}),"\n",(0,i.jsxs)(t.p,{children:["Application Performance Monitoring (APM) can help here, with ",(0,i.jsx)(t.a,{href:"../tools/synthetics/",children:"Synthetics"})," for regular baseline and testing of endpoints and workflows, and ",(0,i.jsx)(t.a,{href:"../tools/rum/",children:"RUM"})," for the actual customer experience. You can use this data to quickly visualize which workflows are impacted, and by how much."]}),"\n",(0,i.jsx)(t.p,{children:"Visualizations which show the error count over time, and the top # errors, can help you to focus on the right area, and show you specific details of errors. This is where we are often using log data, and dynamic visualizations of error codes and reasons."}),"\n",(0,i.jsx)(t.p,{children:"It can be very useful here to have some kind of filtering or drilldown, to get to the specifics as quickly as possible. Think about ways to implement this without too much overhead. For example, having a single dashboard which you can filter to get closer to the details."}),"\n",(0,i.jsx)(t.h3,{id:"layout",children:"Layout"}),"\n",(0,i.jsx)(t.p,{children:"The layout of your dashboard is also important."}),"\n",(0,i.jsx)(t.admonition,{type:"info",children:(0,i.jsxs)(t.p,{children:["Typically the most significant visualizations for your user want to be top left, or otherwise aligned with a natural ",(0,i.jsx)(t.em,{children:"beginning"})," of page navigation."]})}),"\n",(0,i.jsx)(t.p,{children:"You can use layout to help tell the story. For example, you may use a top-down layout, where the further down you scroll, the more details you see. Or perhaps a left-right display would be useful with higher level services on the left, and their dependencies as you move to the right."}),"\n",(0,i.jsx)(t.h3,{id:"create-dynamic-content",children:"Create dynamic content"}),"\n",(0,i.jsx)(t.p,{children:"Many of your workloads will be designed to grow or shrink as demand dictates, and your dashboards need to take this into account. For example you may have your instances in an autoscaling group, and when you hit a certain load, additional instances are added."}),"\n",(0,i.jsx)(t.admonition,{type:"info",children:(0,i.jsx)(t.p,{children:"A dashboard showing data from specific instances, specified by some kind of ID, will not allow the data from those new instances to be seen. Add metadata to your resources and data, so you can create your visualizations to capture all instances with a specific metadata value. This way they will reflect the actual state."})}),"\n",(0,i.jsx)(t.p,{children:"Another example of dynamic visualizations might be being able to find the top 10 errors occurring now, and how they have behaved over recent history. You want to be able to see a table, or a chart, without knowledge of which errors might occur."}),"\n",(0,i.jsx)(t.h3,{id:"think-about-symptoms-first-over-causes",children:"Think about symptoms first over causes"}),"\n",(0,i.jsx)(t.p,{children:"When you observe symptoms, you are considering about the impact this has on your users and systems. Many underlying causes might give the same symptoms. This enables you to capture more issues, including unknown issues. As you understand causes, your lower level dashboards may be more specific to these to help you quickly diagnose and fix issues."}),"\n",(0,i.jsxs)(t.admonition,{type:"tip",children:[(0,i.jsx)(t.mdxAdmonitionTitle,{}),(0,i.jsxs)(t.p,{children:["Don't capture the specific JavaScript error that impacted the users last week. Capture the ",(0,i.jsx)(t.em,{children:"impact"})," on the workflow it disrupted, and then show the top count of JavaScript errors over recent history, or which have dramatically increased in recent history."]})]}),"\n",(0,i.jsx)(t.h3,{id:"use-topbottom-n",children:"Use top/bottom N"}),"\n",(0,i.jsxs)(t.p,{children:["Most of the time there is no need to visualize ",(0,i.jsx)(t.em,{children:"all"})," of your operational metrics at the same time. A large fleet of EC2 instances is a good example of this: there is no need or value in having the disk IOPS or CPU utilization for an entire farm of hundreds of servers displayed simultaneously. This creates an anti-pattern where you can spend more time trying to dig-through your metrics than seeing the best (or worst) performing resources."]}),"\n",(0,i.jsx)(t.admonition,{type:"info",children:(0,i.jsxs)(t.p,{children:["Use your dashboards to show the ten or 20 of any given metric, and then focus on the ",(0,i.jsx)(t.a,{href:"#think-about-symptoms-first-over-causes",children:"symptoms"})," this reveals."]})}),"\n",(0,i.jsxs)(t.p,{children:[(0,i.jsx)(t.a,{href:"../tools/metrics/",children:"CloudWatch metrics"})," allows you to search for the top N for any time series. For example, this query will return the busiest 20 EC2 instances by CPU utilization:"]}),"\n",(0,i.jsx)(t.pre,{children:(0,i.jsx)(t.code,{children:"SORT(SEARCH('{AWS/EC2,InstanceId} MetricName=\"CPUUtilization\"', 'Average', 300), SUM, DESC, 10)\n"})}),"\n",(0,i.jsxs)(t.p,{children:["Use this approach, or similar with ",(0,i.jsx)(t.a,{href:"https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/query_with_cloudwatch-metrics-insights.html",children:"CloudWatch Metric Insights"})," to identify the top or bottom performing metrics in your dashboards."]}),"\n",(0,i.jsx)(t.h3,{id:"show-kpis-with-thresholds-visually",children:"Show KPIs with thresholds visually"}),"\n",(0,i.jsx)(t.p,{children:"Your KPIs should have a warning or error threshold, and dashboards can show this using a horizontal annotation. This will appear as a high water mark on a widget. Showing this visually can give human operators a forewarning if business outcomes or infrastructure are in jeopardy."}),"\n",(0,i.jsx)(t.p,{children:(0,i.jsx)(t.img,{alt:"Image of a horizonal annotation",src:o(52750).A+"",width:"1600",height:"570"})}),"\n",(0,i.jsx)(t.admonition,{type:"info",children:(0,i.jsx)(t.p,{children:"Horizontal annotations are a critical part of a well-developed dashboard."})}),"\n",(0,i.jsx)(t.h3,{id:"the-importance-of-context",children:"The importance of context"}),"\n",(0,i.jsx)(t.p,{children:"People can easily misinterpret data. Their background and current context will colour how they view the data."}),"\n",(0,i.jsxs)(t.p,{children:["So make sure you include ",(0,i.jsx)(t.em,{children:"text"})," within your dashboard. What is this data for, and who? What does it mean? Link to documentation on the application, who supports it, the troubleshooting docs. You can also uses text displays to divide your dashboard display. se them on the left to set left-right context. Use them as full horizontal displays to divide your dashboard vertically."]}),"\n",(0,i.jsx)(t.admonition,{type:"info",children:(0,i.jsx)(t.p,{children:"Having links to IT support, operations on-call, or business owners can give teams a fast path to contact people who can help support when issues occur."})}),"\n",(0,i.jsx)(t.admonition,{type:"tip",children:(0,i.jsx)(t.p,{children:"Hyperlinks to ticketing systems is also a very useful addition for dashboards."})})]})}function c(e={}){const{wrapper:t}={...(0,a.R)(),...e.components};return t?(0,i.jsx)(t,{...e,children:(0,i.jsx)(l,{...e})}):l(e)}},75299:(e,t,o)=>{o.d(t,{A:()=>i});const i=o.p+"assets/images/dashboard1-5e5a9a8110074bfb64c8ab8bbfe12cf6.png"},52750:(e,t,o)=>{o.d(t,{A:()=>i});const i=o.p+"assets/images/horizontal-annotation-85b09a5865baa6a4b2fd9798960819e6.png"},28453:(e,t,o)=>{o.d(t,{R:()=>s,x:()=>r});var i=o(96540);const a={},n=i.createContext(a);function s(e){const t=i.useContext(n);return i.useMemo((function(){return"function"==typeof e?e(t):{...t,...e}}),[t,e])}function r(e){let t;return t=e.disableParentContext?"function"==typeof e.components?e.components(a):e.components||a:s(e.components),i.createElement(n.Provider,{value:t},e.children)}}}]);
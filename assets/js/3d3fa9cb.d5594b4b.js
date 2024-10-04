"use strict";(self.webpackChunkobservability_best_practices=self.webpackChunkobservability_best_practices||[]).push([[2108],{59622:(e,t,o)=>{o.r(t),o.d(t,{assets:()=>h,contentTitle:()=>n,default:()=>u,frontMatter:()=>i,metadata:()=>r,toc:()=>c});var s=o(74848),a=o(28453);const i={},n="Why should you do observability?",r={id:"guides/operational/business/monitoring-for-business-outcomes",title:"Why should you do observability?",description:"See Developing an Observability Strategy on YouTube",source:"@site/docs/guides/operational/business/monitoring-for-business-outcomes.md",sourceDirName:"guides/operational/business",slug:"/guides/operational/business/monitoring-for-business-outcomes",permalink:"/observability-best-practices/docs/guides/operational/business/monitoring-for-business-outcomes",draft:!1,unlisted:!1,editUrl:"https://github.com/aws-observability/observability-best-practices/blob/main/docusaurus/docs/guides/operational/business/monitoring-for-business-outcomes.md",tags:[],version:"current",frontMatter:{},sidebar:"guides",previous:{title:"Instrumenting Java Spring Integration Applications",permalink:"/observability-best-practices/docs/guides/operational/adot-at-scale/adot-java-spring/"},next:{title:"Percentiles are important",permalink:"/observability-best-practices/docs/guides/operational/business/sla-percentile"}},h={},c=[{value:"What really matters?",id:"what-really-matters",level:2},{value:"Where do I start?",id:"where-do-i-start",level:2},{value:"Working backwards",id:"working-backwards",level:2},{value:"What to observe",id:"what-to-observe",level:2},{value:"Conclusion",id:"conclusion",level:2}];function l(e){const t={a:"a",blockquote:"blockquote",br:"br",h1:"h1",h2:"h2",li:"li",p:"p",strong:"strong",ul:"ul",...(0,a.R)(),...e.components};return(0,s.jsxs)(s.Fragment,{children:[(0,s.jsx)(t.h1,{id:"why-should-you-do-observability",children:"Why should you do observability?"}),"\n",(0,s.jsxs)(t.p,{children:["See ",(0,s.jsx)(t.a,{href:"https://www.youtube.com/watch?v=Ub3ATriFapQ",children:"Developing an Observability Strategy"})," on YouTube"]}),"\n",(0,s.jsx)(t.h2,{id:"what-really-matters",children:"What really matters?"}),"\n",(0,s.jsx)(t.p,{children:"Everything that you do at work should align to your organization's mission. All of us that are employed work to fulfill our organization's mission and towards its vision. At Amazon, our mission states that:"}),"\n",(0,s.jsxs)(t.blockquote,{children:["\n",(0,s.jsx)(t.p,{children:"Amazon strives to be Earth\u2019s most customer-centric company, Earth\u2019s best employer, and Earth\u2019s safest place to work."}),"\n"]}),"\n",(0,s.jsxs)(t.p,{children:["\u2014 ",(0,s.jsx)(t.a,{href:"https://www.aboutamazon.com/about-us",children:"About Amazon"})]}),"\n",(0,s.jsx)(t.p,{children:"In IT, every project, deployment, security measure or optimization should work towards a business outcome. It seems obvious, but you should not do anything that does not add value to the business. As ITIL puts it:"}),"\n",(0,s.jsxs)(t.blockquote,{children:["\n",(0,s.jsx)(t.p,{children:"Every change should deliver business value."}),"\n"]}),"\n",(0,s.jsxs)(t.p,{children:["\u2014 ITIL Service Transition, AXELOS, 2011, page 44.",(0,s.jsx)(t.br,{}),"\n","\u2014 See ",(0,s.jsx)(t.a,{href:"https://docs.aws.amazon.com/whitepapers/latest/change-management-in-the-cloud/change-management-in-the-cloud.html",children:"Change Management in the Cloud AWS Whitepaper"})]}),"\n",(0,s.jsx)(t.p,{children:"Mission and business value are important because they should inform everything that you do. There are many benefits to observability, these include:"}),"\n",(0,s.jsxs)(t.ul,{children:["\n",(0,s.jsx)(t.li,{children:"Better availability"}),"\n",(0,s.jsx)(t.li,{children:"More reliability"}),"\n",(0,s.jsx)(t.li,{children:"Understanding of application health and performance"}),"\n",(0,s.jsx)(t.li,{children:"Better collaboration"}),"\n",(0,s.jsx)(t.li,{children:"Proactive detection of issues"}),"\n",(0,s.jsx)(t.li,{children:"Increase customer satisfaction"}),"\n",(0,s.jsx)(t.li,{children:"Reduce time to market"}),"\n",(0,s.jsx)(t.li,{children:"Reduce operational costs"}),"\n",(0,s.jsx)(t.li,{children:"Automation"}),"\n"]}),"\n",(0,s.jsx)(t.p,{children:"All of these benefits have one thing in common, they all deliver business value, either directly to the customer or indrectly to the organization. When thinking about observability, everything should come back to thinking about whether or not your application is delivering business value."}),"\n",(0,s.jsx)(t.p,{children:"This means that observability should be measuring things that contribute towards delivering business value, focusing on business outcomes and when they are at risk: you should think about what your customers want and what they need."}),"\n",(0,s.jsx)(t.h2,{id:"where-do-i-start",children:"Where do I start?"}),"\n",(0,s.jsx)(t.p,{children:"Now that you know what matters, you need to think about what you need to measure. At Amazon, we start with the customer and work backwards from their needs:"}),"\n",(0,s.jsxs)(t.blockquote,{children:["\n",(0,s.jsx)(t.p,{children:"We are internally driven to improve our services, adding benefits and features, before we have to. We lower prices and increase value for customers before we have to. We invent before we have to."}),"\n"]}),"\n",(0,s.jsxs)(t.p,{children:["\u2014 Jeff Bezos, ",(0,s.jsx)(t.a,{href:"https://s2.q4cdn.com/299287126/files/doc_financials/annual/2012-Shareholder-Letter.pdf",children:"2012 Shareholder Letter"})]}),"\n",(0,s.jsx)(t.p,{children:"Let's take a simple example, using an e-commerce site. First, think about what you want as a customer when you are buying products online, it may not be the same for everyone, but you probably care about things like:"}),"\n",(0,s.jsxs)(t.ul,{children:["\n",(0,s.jsx)(t.li,{children:"Delivery"}),"\n",(0,s.jsx)(t.li,{children:"Price"}),"\n",(0,s.jsx)(t.li,{children:"Security"}),"\n",(0,s.jsx)(t.li,{children:"Page Speed"}),"\n",(0,s.jsx)(t.li,{children:"Search (can you find the product you are looking for?)"}),"\n"]}),"\n",(0,s.jsx)(t.p,{children:"Once you know what your customers care about, you can start to measure them and how they affect your business outcomes. Page speed directly impacts your conversion rate and search engine ranking. A 2017 study showed that more than half (53%) of mobile users abandon a page if it takes more than 3 seconds to load. There are of course, many studies that show the importance of page speed, and it is an obvious metric to measure, but you need to measure it and take action because it has a measureable impact on conversion and you can use that data to make improvements."}),"\n",(0,s.jsx)(t.h2,{id:"working-backwards",children:"Working backwards"}),"\n",(0,s.jsx)(t.p,{children:"You cannot be expected to know everything that you customers care about. If you are reading this, you are probably in a technical role. You need to talk to the stakeholders in your organisation, this isn't always easy, but it is vital to ensuring that you are measuring what's important."}),"\n",(0,s.jsxs)(t.p,{children:["Let's continue with the e-commerce example. This time, consider search: it may be obvious that customers need to be able to search for a product in order to buy it, but did you know that according to a ",(0,s.jsx)(t.a,{href:"https://www.forrester.com/report/MustHave+eCommerce+Features/-/E-RES89561",children:"Forrester Research report"}),", 43% of visitors navigate immediately to the search box and searches are 2-3 times more likely to convert compared to non-searchers. Search is really important, it has to work well and you need to monitor it - maybe you discover that particular searches are yeilding no results and that you need to move from naive pattern matching to natural language processing. This is an example of monitoring for a business outcome and then acting to improve the customer experience."]}),"\n",(0,s.jsx)(t.p,{children:"At Amazon:"}),"\n",(0,s.jsxs)(t.blockquote,{children:["\n",(0,s.jsx)(t.p,{children:"We strive to deeply understand customers and work backwards from their pain points to rapidly develop innovations that create meaningful solutions in their lives."}),"\n"]}),"\n",(0,s.jsxs)(t.p,{children:["\u2014 Daniel Slater - Worldwide Lead, Culture of Innovation, AWS in ",(0,s.jsx)(t.a,{href:"https://aws.amazon.com/executive-insights/content/how-amazon-defines-and-operationalizes-a-day-1-culture/",children:"Elements of Amazon\u2019s Day 1 Culture"})]}),"\n",(0,s.jsx)(t.p,{children:"We start with the customer and work backwards from their needs. This isn't the only approach to success in business, but it is a good approach to observability. Work with stakeholders to understand what's important to your customers and then work backwards from there."}),"\n",(0,s.jsx)(t.p,{children:'As an added benefit, if you collect metrics that are important to your customers and stakeholders, you can visualize these in near real-time dashboards and avoid having to create reports or answer questions such as "how long is it taking to load the landing page?" or "how much is it costing to run the website?" - stakeholders and executives should be able to self serve this information.'}),"\n",(0,s.jsxs)(t.p,{children:["These are the kind of high level metrics that ",(0,s.jsx)(t.strong,{children:"really matter"})," for your application and they are also almost always the best indicator that there is an issue. For example: an alert indicating that there are fewer orders than you would normally expect in a given time period tells you that there is probably an issue that is impacting customers; an alert indicating that a volume on a server is nearly full or that you have a high number of 5xx errors for a particular service may be something that requires fixing, but you still have to understand customer impact and then prioritize accordingly - this can take time."]}),"\n",(0,s.jsxs)(t.p,{children:["Issues that impact customers are easy to identify when you are measuring these high level business metrics. These metrics are the ",(0,s.jsx)(t.strong,{children:"what"})," is happening. Other metrics and other forms of observability such as tracing and logs are the ",(0,s.jsx)(t.strong,{children:"why"})," is this happening, which will lead you to what you can do to fix it or improve it."]}),"\n",(0,s.jsx)(t.h2,{id:"what-to-observe",children:"What to observe"}),"\n",(0,s.jsx)(t.p,{children:"Now you have an idea of what matters to your customers, you can identify Key Performance Indicators (KPIs). These are your high level metrics that will tell you if business outcomes are at risk. You also need to gather information from many different sources that may impact those KPIs, this is where you need to start thinking about metrics that could impact those KPIs. As was discussed earlier, the number of 5xx errors, does not indicate impact, but it could have an effect on your KPIs. Work your way backwards from what will impact business outcomes to things that may impact business outcomes."}),"\n",(0,s.jsx)(t.p,{children:"Once you know what you need to collect, you need to identify the sources of information that will provide you with the metrics you can use to measure KPIs and related metrics that may impact those KPIs. This is the basis of what you observe."}),"\n",(0,s.jsx)(t.p,{children:"This data is likely to come from Metrics, Logs and Traces. Once you have this data, you can use it to alert when outcomes are at risk."}),"\n",(0,s.jsx)(t.p,{children:"You can then evaluate the impact and attempt to rectify the issue. Almost always, this data will tell you that there\u2019s a problem, before an isolated technical metric (such as cpu or memory) does."}),"\n",(0,s.jsx)(t.p,{children:"You can use observability reactively to fix an issue impacting business outcomes or you can use the data proactively to do something like improve your customer's search experience."}),"\n",(0,s.jsx)(t.h2,{id:"conclusion",children:"Conclusion"}),"\n",(0,s.jsx)(t.p,{children:"Whilst CPU, RAM, Disk Space and other technical metrics are important for scaling, performance, capacity and cost \u2013 they don\u2019t really tell you how your application is doing and don\u2019t give any insight in to customer experience."}),"\n",(0,s.jsx)(t.p,{children:"Your customers are what\u2019s important and it\u2019s their experience that you should be monitoring."}),"\n",(0,s.jsx)(t.p,{children:"That\u2019s why you should work backwards from your customers\u2019 requirements, working with your stakeholders and establish KPIs and metrics that matter."})]})}function u(e={}){const{wrapper:t}={...(0,a.R)(),...e.components};return t?(0,s.jsx)(t,{...e,children:(0,s.jsx)(l,{...e})}):l(e)}},28453:(e,t,o)=>{o.d(t,{R:()=>n,x:()=>r});var s=o(96540);const a={},i=s.createContext(a);function n(e){const t=s.useContext(i);return s.useMemo((function(){return"function"==typeof e?e(t):{...t,...e}}),[t,e])}function r(e){let t;return t=e.disableParentContext?"function"==typeof e.components?e.components(a):e.components||a:n(e.components),s.createElement(i.Provider,{value:t},e.children)}}}]);
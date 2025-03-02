"use strict";(self.webpackChunkobservability_best_practices=self.webpackChunkobservability_best_practices||[]).push([[2331],{18154:(e,t,s)=>{s.r(t),s.d(t,{assets:()=>c,contentTitle:()=>o,default:()=>d,frontMatter:()=>a,metadata:()=>i,toc:()=>l});const i=JSON.parse('{"id":"recipes/index","title":"Recipes","description":"In here you will find curated guidance, how-to\'s, and links to other resources that help with the application of observability (o11y) to various use cases. This includes managed services such as Amazon Managed Service for Prometheus","source":"@site/docs/recipes/index.md","sourceDirName":"recipes","slug":"/recipes/","permalink":"/observability-best-practices/recipes/","draft":false,"unlisted":false,"editUrl":"https://github.com/aws-observability/observability-best-practices/blob/main/docusaurus/docs/recipes/index.md","tags":[],"version":"current","frontMatter":{},"sidebar":"recipes","next":{"title":"Dimensions","permalink":"/observability-best-practices/recipes/dimensions"}}');var n=s(74848),r=s(28453);const a={},o="Recipes",c={},l=[{value:"How to use",id:"how-to-use",level:2},{value:"How to contribute",id:"how-to-contribute",level:2},{value:"Learn more",id:"learn-more",level:2}];function h(e){const t={a:"a",admonition:"admonition",code:"code",em:"em",h1:"h1",h2:"h2",header:"header",img:"img",li:"li",ol:"ol",p:"p",strong:"strong",table:"table",tbody:"tbody",td:"td",th:"th",thead:"thead",tr:"tr",ul:"ul",...(0,r.R)(),...e.components};return(0,n.jsxs)(n.Fragment,{children:[(0,n.jsx)(t.header,{children:(0,n.jsx)(t.h1,{id:"recipes",children:"Recipes"})}),"\n",(0,n.jsxs)(t.p,{children:["In here you will find curated guidance, how-to's, and links to other resources that help with the application of observability (o11y) to various use cases. This includes managed services such as ",(0,n.jsx)(t.a,{href:"/observability-best-practices/recipes/amp",title:"Amazon Managed Service for Prometheus",children:"Amazon Managed Service for Prometheus"}),"\nand ",(0,n.jsx)(t.a,{href:"/observability-best-practices/recipes/amg",title:"Amazon Managed Grafana",children:"Amazon Managed Grafana"})," as well as agents, for example ",(0,n.jsx)(t.a,{href:"https://opentelemetry.io/",title:"OpenTelemetry",children:"OpenTelemetry"}),"\nand ",(0,n.jsx)(t.a,{href:"https://fluentbit.io/",title:"Fluent Bit",children:"Fluent Bit"}),". Content here is not resitricted to AWS tools alone though, and many open source projects are referenced here."]}),"\n",(0,n.jsx)(t.p,{children:'We want to address the needs of both developers and infrastructure folks equally, so many of the recipes "cast a wide net". We encourge you to explore and find the solutions that work best for what you are seeking to accomplish.'}),"\n",(0,n.jsx)(t.admonition,{type:"info",children:(0,n.jsx)(t.p,{children:"The content here is derived from actual customer engagement by our Solutions Architects, Professional Services, and feedback from other customers. Everything you will find here has been implemented by our actual customers in their own environments."})}),"\n",(0,n.jsxs)(t.p,{children:["The way we think about the o11y space is as follows: we decompose it into\n",(0,n.jsx)(t.a,{href:"/observability-best-practices/recipes/dimensions",children:"six dimensions"})," you can then combine to arrive at a specific solution:"]}),"\n",(0,n.jsxs)(t.table,{children:[(0,n.jsx)(t.thead,{children:(0,n.jsxs)(t.tr,{children:[(0,n.jsx)(t.th,{children:"dimension"}),(0,n.jsx)(t.th,{children:"examples"})]})}),(0,n.jsxs)(t.tbody,{children:[(0,n.jsxs)(t.tr,{children:[(0,n.jsx)(t.td,{children:"Destinations"}),(0,n.jsxs)(t.td,{children:[(0,n.jsx)(t.a,{href:"/observability-best-practices/recipes/amp",title:"Amazon Managed Service for Prometheus",children:"Prometheus"})," \xb7 ",(0,n.jsx)(t.a,{href:"/observability-best-practices/recipes/amg",title:"Amazon Managed Grafana",children:"Grafana"})," \xb7 ",(0,n.jsx)(t.a,{href:"/observability-best-practices/recipes/aes",title:"Amazon Elasticsearch Service",children:"OpenSearch"})," \xb7 ",(0,n.jsx)(t.a,{href:"/observability-best-practices/recipes/cw",title:"Amazon CloudWatch",children:"CloudWatch"})," \xb7 ",(0,n.jsx)(t.a,{href:"https://www.jaegertracing.io/",title:"Jaeger",children:"Jaeger"})]})]}),(0,n.jsxs)(t.tr,{children:[(0,n.jsx)(t.td,{children:"Agents"}),(0,n.jsxs)(t.td,{children:[(0,n.jsx)(t.a,{href:"https://aws-otel.github.io/",title:"AWS Distro for OpenTelemetry",children:"ADOT"})," \xb7 ",(0,n.jsx)(t.a,{href:"https://fluentbit.io/",title:"Fluent Bit",children:"Fluent Bit"})," \xb7 CW agent \xb7 X-Ray agent"]})]}),(0,n.jsxs)(t.tr,{children:[(0,n.jsx)(t.td,{children:"Languages"}),(0,n.jsxs)(t.td,{children:[(0,n.jsx)(t.a,{href:"/observability-best-practices/recipes/java",children:"Java"})," \xb7 Python \xb7 .NET \xb7 ",(0,n.jsx)(t.a,{href:"/observability-best-practices/recipes/nodejs",children:"JavaScript"})," \xb7 Go \xb7 Rust"]})]}),(0,n.jsxs)(t.tr,{children:[(0,n.jsx)(t.td,{children:"Infra & databases"}),(0,n.jsxs)(t.td,{children:[(0,n.jsx)(t.a,{href:"/observability-best-practices/recipes/rds",title:"Amazon Relational Database Service",children:"RDS"})," \xb7 ",(0,n.jsx)(t.a,{href:"/observability-best-practices/recipes/dynamodb",title:"Amazon DynamoDB",children:"DynamoDB"})," \xb7 ",(0,n.jsx)(t.a,{href:"/observability-best-practices/recipes/msk",title:"Amazon Managed Streaming for Apache Kafka",children:"MSK"})]})]}),(0,n.jsxs)(t.tr,{children:[(0,n.jsx)(t.td,{children:"Compute unit"}),(0,n.jsxs)(t.td,{children:[(0,n.jsx)(t.a,{href:"https://aws.amazon.com/batch/",title:"AWS Batch",children:"Batch"})," \xb7 ",(0,n.jsx)(t.a,{href:"/observability-best-practices/recipes/ecs",title:"Amazon Elastic Container Service",children:"ECS"})," \xb7 ",(0,n.jsx)(t.a,{href:"/observability-best-practices/recipes/eks",title:"Amazon Elastic Kubernetes Service",children:"EKS"})," \xb7 ",(0,n.jsx)(t.a,{href:"https://aws.amazon.com/elasticbeanstalk/",title:"AWS Elastic Beanstalk",children:"AEB"})," \xb7 ",(0,n.jsx)(t.a,{href:"/observability-best-practices/recipes/lambda",title:"AWS Lambda",children:"Lambda"})," \xb7 ",(0,n.jsx)(t.a,{href:"/observability-best-practices/recipes/apprunner",title:"AWS App Runner",children:"AppRunner"})]})]}),(0,n.jsxs)(t.tr,{children:[(0,n.jsx)(t.td,{children:"Compute engine"}),(0,n.jsxs)(t.td,{children:[(0,n.jsx)(t.a,{href:"https://aws.amazon.com/fargate/",title:"AWS Fargate",children:"Fargate"})," \xb7 ",(0,n.jsx)(t.a,{href:"https://aws.amazon.com/ec2/",title:"Amazon EC2",children:"EC2"})," \xb7 ",(0,n.jsx)(t.a,{href:"https://aws.amazon.com/lightsail/",title:"Amazon Lightsail",children:"Lightsail"})]})]})]})]}),"\n",(0,n.jsx)(t.admonition,{type:"note",children:(0,n.jsx)(t.p,{children:'"Example solution requirement"\nI need a logging solution for a Python app I\'m running on EKS on Fargate\nwith the goal to store the logs in an S3 bucket for further consumption'})}),"\n",(0,n.jsx)(t.p,{children:"One stack that would fit this need is the following:"}),"\n",(0,n.jsxs)(t.ol,{children:["\n",(0,n.jsxs)(t.li,{children:[(0,n.jsx)(t.em,{children:"Destination"}),": An S3 bucket for further consumption of data"]}),"\n",(0,n.jsxs)(t.li,{children:[(0,n.jsx)(t.em,{children:"Agent"}),": FluentBit to emit log data from EKS"]}),"\n",(0,n.jsxs)(t.li,{children:[(0,n.jsx)(t.em,{children:"Language"}),": Python"]}),"\n",(0,n.jsxs)(t.li,{children:[(0,n.jsx)(t.em,{children:"Infra & DB"}),": N/A"]}),"\n",(0,n.jsxs)(t.li,{children:[(0,n.jsx)(t.em,{children:"Compute unit"}),": Kubernetes (EKS)"]}),"\n",(0,n.jsxs)(t.li,{children:[(0,n.jsx)(t.em,{children:"Compute engine"}),": EC2"]}),"\n"]}),"\n",(0,n.jsx)(t.p,{children:"Not every dimension needs to be specified and sometimes it's hard to decide where\nto start. Try different paths and compare the pros and cons of certain recipes."}),"\n",(0,n.jsx)(t.p,{children:"To simplify navigation, we're grouping the six dimension into the following\ncategories:"}),"\n",(0,n.jsxs)(t.ul,{children:["\n",(0,n.jsxs)(t.li,{children:[(0,n.jsx)(t.strong,{children:"By Compute"}),": covering compute engines and units"]}),"\n",(0,n.jsxs)(t.li,{children:[(0,n.jsx)(t.strong,{children:"By Infra & Data"}),": covering infrastructure and databases"]}),"\n",(0,n.jsxs)(t.li,{children:[(0,n.jsx)(t.strong,{children:"By Language"}),": covering languages"]}),"\n",(0,n.jsxs)(t.li,{children:[(0,n.jsx)(t.strong,{children:"By Destination"}),": covering telemetry and analytics"]}),"\n",(0,n.jsxs)(t.li,{children:[(0,n.jsx)(t.strong,{children:"Tasks"}),": covering anomaly detection, alerting, troubleshooting, and more"]}),"\n"]}),"\n",(0,n.jsx)(t.p,{children:(0,n.jsx)(t.a,{href:"https://aws-observability.github.io/observability-best-practices/recipes/dimensions/",children:"Learn more about dimensions \u2026"})}),"\n",(0,n.jsx)(t.h2,{id:"how-to-use",children:"How to use"}),"\n",(0,n.jsxs)(t.p,{children:["You can either use the top navigation menu to browse to a specific index page,\nstarting with a rough selection. For example, ",(0,n.jsx)(t.code,{children:"By Compute"})," -> ",(0,n.jsx)(t.code,{children:"EKS"})," ->\n",(0,n.jsx)(t.code,{children:"Fargate"})," -> ",(0,n.jsx)(t.code,{children:"Logs"}),"."]}),"\n",(0,n.jsxs)(t.p,{children:["Alternatively, you can search the site pressing ",(0,n.jsx)(t.code,{children:"/"})," or the ",(0,n.jsx)(t.code,{children:"s"})," key:"]}),"\n",(0,n.jsx)(t.p,{children:(0,n.jsx)(t.img,{alt:"o11y space",src:s(41310).A+"",width:"1404",height:"502"})}),"\n",(0,n.jsx)(t.admonition,{type:"info",children:(0,n.jsxs)(t.p,{children:['"License"\nAll recipes published on this site are available via the\n',(0,n.jsx)(t.a,{href:"https://github.com/aws/mit-0",title:"MIT-0",children:"MIT-0"})," license, a modification to the usual MIT license\nthat removes the requirement for attribution."]})}),"\n",(0,n.jsx)(t.h2,{id:"how-to-contribute",children:"How to contribute"}),"\n",(0,n.jsxs)(t.p,{children:["Start a ",(0,n.jsx)(t.a,{href:"https://github.com/aws-observability/observability-best-practices/discussions",title:"Discussions",children:"discussion"})," on what you plan to do and we take it from there."]}),"\n",(0,n.jsx)(t.h2,{id:"learn-more",children:"Learn more"}),"\n",(0,n.jsx)(t.p,{children:"The recipes on this site are a good practices collection. In addition, there\nare a number of places where you can learn more about the status of open source\nprojects we use as well as about the managed services from the recipes, so\ncheck out:"}),"\n",(0,n.jsxs)(t.ul,{children:["\n",(0,n.jsxs)(t.li,{children:[(0,n.jsx)(t.a,{href:"https://www.youtube.com/playlist?list=PLaiiCkpc1U7Wy7XwkpfgyOhIf_06IK3U_",title:"Observability @ AWS YouTube playlist",children:"observability @ aws"}),", a playlist of AWS folks talking about\ntheir projects and services."]}),"\n",(0,n.jsxs)(t.li,{children:[(0,n.jsx)(t.a,{href:"https://aws-observability.github.io/observability-best-practices/recipes/workshops/",children:"AWS observability workshops"}),", to try out the offerings in a\nstructured manner."]}),"\n",(0,n.jsxs)(t.li,{children:["The ",(0,n.jsx)(t.a,{href:"https://aws.amazon.com/products/management-and-governance/use-cases/monitoring-and-observability/",title:"AWS Observability home",children:"AWS monitoring and observability"})," homepage with pointers\nto case studies and partners."]}),"\n"]})]})}function d(e={}){const{wrapper:t}={...(0,r.R)(),...e.components};return t?(0,n.jsx)(t,{...e,children:(0,n.jsx)(h,{...e})}):h(e)}},28453:(e,t,s)=>{s.d(t,{R:()=>a,x:()=>o});var i=s(96540);const n={},r=i.createContext(n);function a(e){const t=i.useContext(r);return i.useMemo((function(){return"function"==typeof e?e(t):{...t,...e}}),[t,e])}function o(e){let t;return t=e.disableParentContext?"function"==typeof e.components?e.components(n):e.components||n:a(e.components),i.createElement(r.Provider,{value:t},e.children)}},41310:(e,t,s)=>{s.d(t,{A:()=>i});const i=s.p+"assets/images/search-3e27eeac38309853fffa4ad39a30a7f7.png"}}]);
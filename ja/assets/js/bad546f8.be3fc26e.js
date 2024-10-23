"use strict";(self.webpackChunkobservability_best_practices=self.webpackChunkobservability_best_practices||[]).push([[4945],{82263:(e,s,i)=>{i.r(s),i.d(s,{assets:()=>l,contentTitle:()=>a,default:()=>o,frontMatter:()=>n,metadata:()=>c,toc:()=>h});var t=i(74848),r=i(28453);const n={},a="\u30ec\u30b7\u30d4",c={id:"recipes/index",title:"\u30ec\u30b7\u30d4",description:"\u3053\u3053\u3067\u306f\u3001\u69d8\u3005\u306a\u30e6\u30fc\u30b9\u30b1\u30fc\u30b9\u306b\u304a\u3051\u308b\u30aa\u30d6\u30b6\u30fc\u30d0\u30d3\u30ea\u30c6\u30a3 (o11y) \u306e\u9069\u7528\u306b\u5f79\u7acb\u3064\u3001\u53b3\u9078\u3055\u308c\u305f\u30ac\u30a4\u30c0\u30f3\u30b9\u3001\u30cf\u30a6\u30c4\u30fc\u3001\u304a\u3088\u3073\u4ed6\u306e\u30ea\u30bd\u30fc\u30b9\u3078\u306e\u30ea\u30f3\u30af\u3092\u898b\u3064\u3051\u308b\u3053\u3068\u304c\u3067\u304d\u307e\u3059\u3002\u3053\u308c\u306b\u306f\u3001Amazon Managed Service for Prometheus \u3084 Amazon Managed Grafana \u306a\u3069\u306e\u30de\u30cd\u30fc\u30b8\u30c9\u30b5\u30fc\u30d3\u30b9\u3060\u3051\u3067\u306a\u304f\u3001OpenTelemetry \u3084 Fluent Bit \u306a\u3069\u306e\u30a8\u30fc\u30b8\u30a7\u30f3\u30c8\u3082\u542b\u307e\u308c\u307e\u3059\u3002\u3053\u3053\u3067\u306e\u30b3\u30f3\u30c6\u30f3\u30c4\u306f AWS \u30c4\u30fc\u30eb\u3060\u3051\u306b\u9650\u5b9a\u3055\u308c\u3066\u3044\u308b\u308f\u3051\u3067\u306f\u306a\u304f\u3001\u591a\u304f\u306e\u30aa\u30fc\u30d7\u30f3\u30bd\u30fc\u30b9\u30d7\u30ed\u30b8\u30a7\u30af\u30c8\u3082\u53c2\u7167\u3055\u308c\u3066\u3044\u307e\u3059\u3002",source:"@site/i18n/ja/docusaurus-plugin-content-docs/current/recipes/index.md",sourceDirName:"recipes",slug:"/recipes/",permalink:"/observability-best-practices/ja/recipes/",draft:!1,unlisted:!1,editUrl:"https://github.com/aws-observability/observability-best-practices/blob/main/docusaurus/docs/recipes/index.md",tags:[],version:"current",frontMatter:{},sidebar:"recipes",next:{title:"\u30c7\u30a3\u30e1\u30f3\u30b7\u30e7\u30f3",permalink:"/observability-best-practices/ja/recipes/dimensions"}},l={},h=[{value:"\u4f7f\u7528\u65b9\u6cd5",id:"\u4f7f\u7528\u65b9\u6cd5",level:2},{value:"\u8ca2\u732e\u306e\u65b9\u6cd5",id:"\u8ca2\u732e\u306e\u65b9\u6cd5",level:2},{value:"\u3082\u3063\u3068\u5b66\u3076",id:"\u3082\u3063\u3068\u5b66\u3076",level:2}];function d(e){const s={a:"a",admonition:"admonition",code:"code",em:"em",h1:"h1",h2:"h2",img:"img",li:"li",ol:"ol",p:"p",strong:"strong",table:"table",tbody:"tbody",td:"td",th:"th",thead:"thead",tr:"tr",ul:"ul",...(0,r.R)(),...e.components};return(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)(s.h1,{id:"\u30ec\u30b7\u30d4",children:"\u30ec\u30b7\u30d4"}),"\n",(0,t.jsxs)(s.p,{children:["\u3053\u3053\u3067\u306f\u3001\u69d8\u3005\u306a\u30e6\u30fc\u30b9\u30b1\u30fc\u30b9\u306b\u304a\u3051\u308b\u30aa\u30d6\u30b6\u30fc\u30d0\u30d3\u30ea\u30c6\u30a3 (o11y) \u306e\u9069\u7528\u306b\u5f79\u7acb\u3064\u3001\u53b3\u9078\u3055\u308c\u305f\u30ac\u30a4\u30c0\u30f3\u30b9\u3001\u30cf\u30a6\u30c4\u30fc\u3001\u304a\u3088\u3073\u4ed6\u306e\u30ea\u30bd\u30fc\u30b9\u3078\u306e\u30ea\u30f3\u30af\u3092\u898b\u3064\u3051\u308b\u3053\u3068\u304c\u3067\u304d\u307e\u3059\u3002\u3053\u308c\u306b\u306f\u3001",(0,t.jsx)(s.a,{href:"/observability-best-practices/ja/recipes/amp",title:"Amazon Managed Service for Prometheus",children:"Amazon Managed Service for Prometheus"})," \u3084 ",(0,t.jsx)(s.a,{href:"/observability-best-practices/ja/recipes/amg",title:"Amazon Managed Grafana",children:"Amazon Managed Grafana"})," \u306a\u3069\u306e\u30de\u30cd\u30fc\u30b8\u30c9\u30b5\u30fc\u30d3\u30b9\u3060\u3051\u3067\u306a\u304f\u3001",(0,t.jsx)(s.a,{href:"https://opentelemetry.io/",title:"OpenTelemetry",children:"OpenTelemetry"})," \u3084 ",(0,t.jsx)(s.a,{href:"https://fluentbit.io/",title:"Fluent Bit",children:"Fluent Bit"})," \u306a\u3069\u306e\u30a8\u30fc\u30b8\u30a7\u30f3\u30c8\u3082\u542b\u307e\u308c\u307e\u3059\u3002\u3053\u3053\u3067\u306e\u30b3\u30f3\u30c6\u30f3\u30c4\u306f AWS \u30c4\u30fc\u30eb\u3060\u3051\u306b\u9650\u5b9a\u3055\u308c\u3066\u3044\u308b\u308f\u3051\u3067\u306f\u306a\u304f\u3001\u591a\u304f\u306e\u30aa\u30fc\u30d7\u30f3\u30bd\u30fc\u30b9\u30d7\u30ed\u30b8\u30a7\u30af\u30c8\u3082\u53c2\u7167\u3055\u308c\u3066\u3044\u307e\u3059\u3002"]}),"\n",(0,t.jsx)(s.p,{children:"\u79c1\u305f\u3061\u306f\u3001\u958b\u767a\u8005\u3068\u30a4\u30f3\u30d5\u30e9\u30b9\u30c8\u30e9\u30af\u30c1\u30e3\u306e\u62c5\u5f53\u8005\u306e\u30cb\u30fc\u30ba\u306b\u7b49\u3057\u304f\u5bfe\u5fdc\u3057\u305f\u3044\u3068\u8003\u3048\u3066\u3044\u308b\u305f\u3081\u3001\u591a\u304f\u306e\u30ec\u30b7\u30d4\u306f\u300c\u5e45\u5e83\u3044\u30cd\u30c3\u30c8\u3092\u6295\u3052\u304b\u3051\u308b\u300d\u3088\u3046\u306b\u306a\u3063\u3066\u3044\u307e\u3059\u3002\u3042\u306a\u305f\u304c\u9054\u6210\u3057\u305f\u3044\u3053\u3068\u306b\u6700\u9069\u306a\u30bd\u30ea\u30e5\u30fc\u30b7\u30e7\u30f3\u3092\u63a2\u7d22\u3057\u3001\u898b\u3064\u3051\u308b\u3053\u3068\u3092\u304a\u52e7\u3081\u3057\u307e\u3059\u3002"}),"\n",(0,t.jsx)(s.admonition,{type:"info",children:(0,t.jsx)(s.p,{children:"\u3053\u3053\u3067\u306e\u30b3\u30f3\u30c6\u30f3\u30c4\u306f\u3001\u30bd\u30ea\u30e5\u30fc\u30b7\u30e7\u30f3\u30a2\u30fc\u30ad\u30c6\u30af\u30c8\u3001\u30d7\u30ed\u30d5\u30a7\u30c3\u30b7\u30e7\u30ca\u30eb\u30b5\u30fc\u30d3\u30b9\u3001\u304a\u3088\u3073\u4ed6\u306e\u9867\u5ba2\u304b\u3089\u306e\u30d5\u30a3\u30fc\u30c9\u30d0\u30c3\u30af\u306b\u3088\u308b\u5b9f\u969b\u306e\u9867\u5ba2\u30a8\u30f3\u30b2\u30fc\u30b8\u30e1\u30f3\u30c8\u304b\u3089\u5f97\u3089\u308c\u305f\u3082\u306e\u3067\u3059\u3002\u3053\u3053\u3067\u898b\u3064\u304b\u308b\u3059\u3079\u3066\u306e\u3082\u306e\u306f\u3001\u5b9f\u969b\u306e\u9867\u5ba2\u304c\u81ea\u8eab\u306e\u74b0\u5883\u3067\u5b9f\u88c5\u3057\u305f\u3082\u306e\u3067\u3059\u3002"})}),"\n",(0,t.jsxs)(s.p,{children:["\u79c1\u305f\u3061\u304c o11y \u7a7a\u9593\u306b\u3064\u3044\u3066\u8003\u3048\u308b\u65b9\u6cd5\u306f\u4ee5\u4e0b\u306e\u901a\u308a\u3067\u3059\uff1a\u7279\u5b9a\u306e\u30bd\u30ea\u30e5\u30fc\u30b7\u30e7\u30f3\u306b\u5230\u9054\u3059\u308b\u305f\u3081\u306b\u7d44\u307f\u5408\u308f\u305b\u308b\u3053\u3068\u304c\u3067\u304d\u308b ",(0,t.jsx)(s.a,{href:"/observability-best-practices/ja/recipes/dimensions",children:"6 \u3064\u306e\u6b21\u5143"})," \u306b\u5206\u89e3\u3057\u307e\u3059\uff1a"]}),"\n",(0,t.jsxs)(s.table,{children:[(0,t.jsx)(s.thead,{children:(0,t.jsxs)(s.tr,{children:[(0,t.jsx)(s.th,{children:"\u6b21\u5143"}),(0,t.jsx)(s.th,{children:"\u4f8b"})]})}),(0,t.jsxs)(s.tbody,{children:[(0,t.jsxs)(s.tr,{children:[(0,t.jsx)(s.td,{children:"\u9001\u4fe1\u5148"}),(0,t.jsxs)(s.td,{children:[(0,t.jsx)(s.a,{href:"/observability-best-practices/ja/recipes/amp",title:"Amazon Managed Service for Prometheus",children:"Prometheus"})," \xb7 ",(0,t.jsx)(s.a,{href:"/observability-best-practices/ja/recipes/amg",title:"Amazon Managed Grafana",children:"Grafana"})," \xb7 ",(0,t.jsx)(s.a,{href:"/observability-best-practices/ja/recipes/aes",title:"Amazon Elasticsearch Service",children:"OpenSearch"})," \xb7 ",(0,t.jsx)(s.a,{href:"/observability-best-practices/ja/recipes/cw",title:"Amazon CloudWatch",children:"CloudWatch"})," \xb7 ",(0,t.jsx)(s.a,{href:"https://www.jaegertracing.io/",title:"Jaeger",children:"Jaeger"})]})]}),(0,t.jsxs)(s.tr,{children:[(0,t.jsx)(s.td,{children:"\u30a8\u30fc\u30b8\u30a7\u30f3\u30c8"}),(0,t.jsxs)(s.td,{children:[(0,t.jsx)(s.a,{href:"https://aws-otel.github.io/",title:"AWS Distro for OpenTelemetry",children:"ADOT"})," \xb7 ",(0,t.jsx)(s.a,{href:"https://fluentbit.io/",title:"Fluent Bit",children:"Fluent Bit"})," \xb7 CW \u30a8\u30fc\u30b8\u30a7\u30f3\u30c8 \xb7 X-Ray \u30a8\u30fc\u30b8\u30a7\u30f3\u30c8"]})]}),(0,t.jsxs)(s.tr,{children:[(0,t.jsx)(s.td,{children:"\u8a00\u8a9e"}),(0,t.jsxs)(s.td,{children:[(0,t.jsx)(s.a,{href:"/observability-best-practices/ja/recipes/java",children:"Java"})," \xb7 Python \xb7 .NET \xb7 ",(0,t.jsx)(s.a,{href:"/observability-best-practices/ja/recipes/nodejs",children:"JavaScript"})," \xb7 Go \xb7 Rust"]})]}),(0,t.jsxs)(s.tr,{children:[(0,t.jsx)(s.td,{children:"\u30a4\u30f3\u30d5\u30e9\u3068\u30c7\u30fc\u30bf\u30d9\u30fc\u30b9"}),(0,t.jsxs)(s.td,{children:[(0,t.jsx)(s.a,{href:"/observability-best-practices/ja/recipes/rds",title:"Amazon Relational Database Service",children:"RDS"})," \xb7 ",(0,t.jsx)(s.a,{href:"/observability-best-practices/ja/recipes/dynamodb",title:"Amazon DynamoDB",children:"DynamoDB"})," \xb7 ",(0,t.jsx)(s.a,{href:"/observability-best-practices/ja/recipes/msk",title:"Amazon Managed Streaming for Apache Kafka",children:"MSK"})]})]}),(0,t.jsxs)(s.tr,{children:[(0,t.jsx)(s.td,{children:"\u30b3\u30f3\u30d4\u30e5\u30fc\u30c8\u30e6\u30cb\u30c3\u30c8"}),(0,t.jsxs)(s.td,{children:[(0,t.jsx)(s.a,{href:"https://aws.amazon.com/jp/batch/",title:"AWS Batch",children:"Batch"})," \xb7 ",(0,t.jsx)(s.a,{href:"/observability-best-practices/ja/recipes/ecs",title:"Amazon Elastic Container Service",children:"ECS"})," \xb7 ",(0,t.jsx)(s.a,{href:"/observability-best-practices/ja/recipes/eks",title:"Amazon Elastic Kubernetes Service",children:"EKS"})," \xb7 ",(0,t.jsx)(s.a,{href:"https://aws.amazon.com/jp/elasticbeanstalk/",title:"AWS Elastic Beanstalk",children:"AEB"})," \xb7 ",(0,t.jsx)(s.a,{href:"/observability-best-practices/ja/recipes/lambda",title:"AWS Lambda",children:"Lambda"})," \xb7 ",(0,t.jsx)(s.a,{href:"/observability-best-practices/ja/recipes/apprunner",title:"AWS App Runner",children:"AppRunner"})]})]}),(0,t.jsxs)(s.tr,{children:[(0,t.jsx)(s.td,{children:"\u30b3\u30f3\u30d4\u30e5\u30fc\u30c8\u30a8\u30f3\u30b8\u30f3"}),(0,t.jsxs)(s.td,{children:[(0,t.jsx)(s.a,{href:"https://aws.amazon.com/jp/fargate/",title:"AWS Fargate",children:"Fargate"})," \xb7 ",(0,t.jsx)(s.a,{href:"https://aws.amazon.com/jp/ec2/",title:"Amazon EC2",children:"EC2"})," \xb7 ",(0,t.jsx)(s.a,{href:"https://aws.amazon.com/jp/lightsail/",title:"Amazon Lightsail",children:"Lightsail"})]})]})]})]}),"\n",(0,t.jsx)(s.admonition,{type:"note",children:(0,t.jsx)(s.p,{children:"\u300c\u30bd\u30ea\u30e5\u30fc\u30b7\u30e7\u30f3\u8981\u4ef6\u306e\u4f8b\u300d\nFargate \u4e0a\u306e EKS \u3067\u5b9f\u884c\u3057\u3066\u3044\u308b Python \u30a2\u30d7\u30ea\u306e\u30ed\u30b0\u30bd\u30ea\u30e5\u30fc\u30b7\u30e7\u30f3\u304c\u5fc5\u8981\u3067\u3001\u30ed\u30b0\u3092 S3 \u30d0\u30b1\u30c3\u30c8\u306b\u4fdd\u5b58\u3057\u3066\u5f8c\u3067\u6d88\u8cbb\u3059\u308b\u3053\u3068\u304c\u76ee\u6a19\u3067\u3059\u3002"})}),"\n",(0,t.jsx)(s.p,{children:"\u3053\u306e\u30cb\u30fc\u30ba\u306b\u9069\u5408\u3059\u308b\u30b9\u30bf\u30c3\u30af\u306e\u4e00\u4f8b\u306f\u4ee5\u4e0b\u306e\u901a\u308a\u3067\u3059\uff1a"}),"\n",(0,t.jsxs)(s.ol,{children:["\n",(0,t.jsxs)(s.li,{children:[(0,t.jsx)(s.em,{children:"\u9001\u4fe1\u5148"}),"\uff1a\u30c7\u30fc\u30bf\u306e\u5f8c\u7d9a\u306e\u6d88\u8cbb\u306e\u305f\u3081\u306e S3 \u30d0\u30b1\u30c3\u30c8"]}),"\n",(0,t.jsxs)(s.li,{children:[(0,t.jsx)(s.em,{children:"\u30a8\u30fc\u30b8\u30a7\u30f3\u30c8"}),"\uff1aEKS \u304b\u3089\u30ed\u30b0\u30c7\u30fc\u30bf\u3092\u51fa\u529b\u3059\u308b\u305f\u3081\u306e FluentBit"]}),"\n",(0,t.jsxs)(s.li,{children:[(0,t.jsx)(s.em,{children:"\u8a00\u8a9e"}),"\uff1aPython"]}),"\n",(0,t.jsxs)(s.li,{children:[(0,t.jsx)(s.em,{children:"\u30a4\u30f3\u30d5\u30e9\u3068 DB"}),"\uff1a\u8a72\u5f53\u306a\u3057"]}),"\n",(0,t.jsxs)(s.li,{children:[(0,t.jsx)(s.em,{children:"\u30b3\u30f3\u30d4\u30e5\u30fc\u30c8\u30e6\u30cb\u30c3\u30c8"}),"\uff1aKubernetes (EKS)"]}),"\n",(0,t.jsxs)(s.li,{children:[(0,t.jsx)(s.em,{children:"\u30b3\u30f3\u30d4\u30e5\u30fc\u30c8\u30a8\u30f3\u30b8\u30f3"}),"\uff1aEC2"]}),"\n"]}),"\n",(0,t.jsx)(s.p,{children:"\u3059\u3079\u3066\u306e\u6b21\u5143\u3092\u6307\u5b9a\u3059\u308b\u5fc5\u8981\u306f\u306a\u304f\u3001\u3069\u3053\u304b\u3089\u59cb\u3081\u308b\u3079\u304d\u304b\u5224\u65ad\u3059\u308b\u306e\u304c\u96e3\u3057\u3044\u5834\u5408\u3082\u3042\u308a\u307e\u3059\u3002\u7570\u306a\u308b\u30d1\u30b9\u3092\u8a66\u3057\u3001\u7279\u5b9a\u306e\u30ec\u30b7\u30d4\u306e\u9577\u6240\u3068\u77ed\u6240\u3092\u6bd4\u8f03\u3057\u3066\u307f\u3066\u304f\u3060\u3055\u3044\u3002"}),"\n",(0,t.jsx)(s.p,{children:"\u30ca\u30d3\u30b2\u30fc\u30b7\u30e7\u30f3\u3092\u7c21\u7d20\u5316\u3059\u308b\u305f\u3081\u306b\u30016 \u3064\u306e\u6b21\u5143\u3092\u4ee5\u4e0b\u306e\u30ab\u30c6\u30b4\u30ea\u306b\u30b0\u30eb\u30fc\u30d7\u5316\u3057\u3066\u3044\u307e\u3059\uff1a"}),"\n",(0,t.jsxs)(s.ul,{children:["\n",(0,t.jsxs)(s.li,{children:[(0,t.jsx)(s.strong,{children:"\u30b3\u30f3\u30d4\u30e5\u30fc\u30c8\u5225"}),"\uff1a\u30b3\u30f3\u30d4\u30e5\u30fc\u30c8\u30a8\u30f3\u30b8\u30f3\u3068\u30e6\u30cb\u30c3\u30c8\u3092\u30ab\u30d0\u30fc"]}),"\n",(0,t.jsxs)(s.li,{children:[(0,t.jsx)(s.strong,{children:"\u30a4\u30f3\u30d5\u30e9\u3068\u30c7\u30fc\u30bf\u5225"}),"\uff1a\u30a4\u30f3\u30d5\u30e9\u30b9\u30c8\u30e9\u30af\u30c1\u30e3\u3068\u30c7\u30fc\u30bf\u30d9\u30fc\u30b9\u3092\u30ab\u30d0\u30fc"]}),"\n",(0,t.jsxs)(s.li,{children:[(0,t.jsx)(s.strong,{children:"\u8a00\u8a9e\u5225"}),"\uff1a\u8a00\u8a9e\u3092\u30ab\u30d0\u30fc"]}),"\n",(0,t.jsxs)(s.li,{children:[(0,t.jsx)(s.strong,{children:"\u9001\u4fe1\u5148\u5225"}),"\uff1a\u30c6\u30ec\u30e1\u30c8\u30ea\u3068\u5206\u6790\u3092\u30ab\u30d0\u30fc"]}),"\n",(0,t.jsxs)(s.li,{children:[(0,t.jsx)(s.strong,{children:"\u30bf\u30b9\u30af"}),"\uff1a\u7570\u5e38\u691c\u51fa\u3001\u30a2\u30e9\u30fc\u30c8\u3001\u30c8\u30e9\u30d6\u30eb\u30b7\u30e5\u30fc\u30c6\u30a3\u30f3\u30b0\u306a\u3069\u3092\u30ab\u30d0\u30fc"]}),"\n"]}),"\n",(0,t.jsx)(s.p,{children:(0,t.jsx)(s.a,{href:"/observability-best-practices/ja/recipes/dimensions/",children:"\u6b21\u5143\u306b\u3064\u3044\u3066\u3055\u3089\u306b\u5b66\u3076 \u2026"})}),"\n",(0,t.jsx)(s.h2,{id:"\u4f7f\u7528\u65b9\u6cd5",children:"\u4f7f\u7528\u65b9\u6cd5"}),"\n",(0,t.jsxs)(s.p,{children:["\u30c8\u30c3\u30d7\u30ca\u30d3\u30b2\u30fc\u30b7\u30e7\u30f3\u30e1\u30cb\u30e5\u30fc\u3092\u4f7f\u7528\u3057\u3066\u3001\u5927\u307e\u304b\u306a\u9078\u629e\u304b\u3089\u59cb\u307e\u308b\u7279\u5b9a\u306e\u30a4\u30f3\u30c7\u30c3\u30af\u30b9\u30da\u30fc\u30b8\u306b\u79fb\u52d5\u3067\u304d\u307e\u3059\u3002\u4f8b\u3048\u3070\u3001",(0,t.jsx)(s.code,{children:"By Compute"})," -> ",(0,t.jsx)(s.code,{children:"EKS"})," -> ",(0,t.jsx)(s.code,{children:"Fargate"})," -> ",(0,t.jsx)(s.code,{children:"Logs"})," \u306e\u3088\u3046\u306b\u306a\u308a\u307e\u3059\u3002"]}),"\n",(0,t.jsxs)(s.p,{children:["\u307e\u305f\u306f\u3001",(0,t.jsx)(s.code,{children:"/"})," \u30ad\u30fc\u307e\u305f\u306f ",(0,t.jsx)(s.code,{children:"s"})," \u30ad\u30fc\u3092\u62bc\u3057\u3066\u30b5\u30a4\u30c8\u5185\u3092\u691c\u7d22\u3059\u308b\u3053\u3068\u3082\u3067\u304d\u307e\u3059\uff1a"]}),"\n",(0,t.jsx)(s.p,{children:(0,t.jsx)(s.img,{alt:"o11y space",src:i(56988).A+"",width:"1404",height:"502"})}),"\n",(0,t.jsx)(s.admonition,{type:"info",children:(0,t.jsxs)(s.p,{children:["\u300c\u30e9\u30a4\u30bb\u30f3\u30b9\u300d\n\u3053\u306e\u30b5\u30a4\u30c8\u3067\u516c\u958b\u3055\u308c\u3066\u3044\u308b\u3059\u3079\u3066\u306e\u30ec\u30b7\u30d4\u306f\u3001",(0,t.jsx)(s.a,{href:"https://github.com/aws/mit-0",title:"MIT-0",children:"MIT-0"})," \u30e9\u30a4\u30bb\u30f3\u30b9\u3067\u5229\u7528\u53ef\u80fd\u3067\u3059\u3002\u3053\u308c\u306f\u901a\u5e38\u306e MIT \u30e9\u30a4\u30bb\u30f3\u30b9\u3092\u5909\u66f4\u3057\u3001\u5e30\u5c5e\u8868\u793a\u306e\u8981\u4ef6\u3092\u524a\u9664\u3057\u305f\u3082\u306e\u3067\u3059\u3002"]})}),"\n",(0,t.jsx)(s.h2,{id:"\u8ca2\u732e\u306e\u65b9\u6cd5",children:"\u8ca2\u732e\u306e\u65b9\u6cd5"}),"\n",(0,t.jsxs)(s.p,{children:["\u3042\u306a\u305f\u304c\u8a08\u753b\u3057\u3066\u3044\u308b\u3053\u3068\u306b\u3064\u3044\u3066 ",(0,t.jsx)(s.a,{href:"https://github.com/aws-observability/observability-best-practices/discussions",title:"Discussions",children:"\u30c7\u30a3\u30b9\u30ab\u30c3\u30b7\u30e7\u30f3"})," \u3092\u958b\u59cb\u3057\u3066\u304f\u3060\u3055\u3044\u3002\u305d\u3053\u304b\u3089\u4e00\u7dd2\u306b\u9032\u3081\u3066\u3044\u304d\u307e\u3057\u3087\u3046\u3002"]}),"\n",(0,t.jsx)(s.h2,{id:"\u3082\u3063\u3068\u5b66\u3076",children:"\u3082\u3063\u3068\u5b66\u3076"}),"\n",(0,t.jsx)(s.p,{children:"\u3053\u306e\u30b5\u30a4\u30c8\u306e\u30ec\u30b7\u30d4\u306f\u3001\u30d9\u30b9\u30c8\u30d7\u30e9\u30af\u30c6\u30a3\u30b9\u306e\u30b3\u30ec\u30af\u30b7\u30e7\u30f3\u3067\u3059\u3002\u3055\u3089\u306b\u3001\u30ec\u30b7\u30d4\u3067\u4f7f\u7528\u3057\u3066\u3044\u308b\u30aa\u30fc\u30d7\u30f3\u30bd\u30fc\u30b9\u30d7\u30ed\u30b8\u30a7\u30af\u30c8\u306e\u72b6\u6cc1\u3084\u30de\u30cd\u30fc\u30b8\u30c9\u30b5\u30fc\u30d3\u30b9\u306b\u3064\u3044\u3066\u3001\u3088\u308a\u8a73\u3057\u304f\u5b66\u3079\u308b\u5834\u6240\u304c\u3044\u304f\u3064\u304b\u3042\u308a\u307e\u3059\u3002\u4ee5\u4e0b\u3092\u30c1\u30a7\u30c3\u30af\u3057\u3066\u307f\u3066\u304f\u3060\u3055\u3044\uff1a"}),"\n",(0,t.jsxs)(s.ul,{children:["\n",(0,t.jsxs)(s.li,{children:[(0,t.jsx)(s.a,{href:"https://www.youtube.com/playlist?list=PLaiiCkpc1U7Wy7XwkpfgyOhIf_06IK3U_",title:"Observability @ AWS YouTube playlist",children:"observability @ aws"}),"\uff1aAWS \u306e\u4eba\u3005\u304c\u30d7\u30ed\u30b8\u30a7\u30af\u30c8\u3084\u30b5\u30fc\u30d3\u30b9\u306b\u3064\u3044\u3066\u8a9e\u308b\u30d7\u30ec\u30a4\u30ea\u30b9\u30c8\u3002"]}),"\n",(0,t.jsxs)(s.li,{children:[(0,t.jsx)(s.a,{href:"/observability-best-practices/ja/recipes/workshops/",children:"AWS \u30aa\u30d6\u30b6\u30fc\u30d0\u30d3\u30ea\u30c6\u30a3\u30ef\u30fc\u30af\u30b7\u30e7\u30c3\u30d7"}),"\uff1a\u69cb\u9020\u5316\u3055\u308c\u305f\u65b9\u6cd5\u3067\u30b5\u30fc\u30d3\u30b9\u3092\u8a66\u3059\u3053\u3068\u304c\u3067\u304d\u307e\u3059\u3002"]}),"\n",(0,t.jsxs)(s.li,{children:[(0,t.jsx)(s.a,{href:"https://aws.amazon.com/jp/products/management-and-governance/use-cases/monitoring-and-observability/",title:"AWS Observability home",children:"AWS \u30e2\u30cb\u30bf\u30ea\u30f3\u30b0\u3068\u30aa\u30d6\u30b6\u30fc\u30d0\u30d3\u30ea\u30c6\u30a3"}),"\u306e\u30db\u30fc\u30e0\u30da\u30fc\u30b8\uff1a\u30b1\u30fc\u30b9\u30b9\u30bf\u30c7\u30a3\u3084\u30d1\u30fc\u30c8\u30ca\u30fc\u3078\u306e\u30ea\u30f3\u30af\u304c\u3042\u308a\u307e\u3059\u3002"]}),"\n"]})]})}function o(e={}){const{wrapper:s}={...(0,r.R)(),...e.components};return s?(0,t.jsx)(s,{...e,children:(0,t.jsx)(d,{...e})}):d(e)}},56988:(e,s,i)=>{i.d(s,{A:()=>t});const t=i.p+"assets/images/search-3e27eeac38309853fffa4ad39a30a7f7.png"},28453:(e,s,i)=>{i.d(s,{R:()=>a,x:()=>c});var t=i(96540);const r={},n=t.createContext(r);function a(e){const s=t.useContext(n);return t.useMemo((function(){return"function"==typeof e?e(s):{...s,...e}}),[s,e])}function c(e){let s;return s=e.disableParentContext?"function"==typeof e.components?e.components(r):e.components||r:a(e.components),t.createElement(n.Provider,{value:s},e.children)}}}]);
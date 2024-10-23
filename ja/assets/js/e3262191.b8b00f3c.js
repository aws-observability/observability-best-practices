"use strict";(self.webpackChunkobservability_best_practices=self.webpackChunkobservability_best_practices||[]).push([[1166],{61581:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>r,contentTitle:()=>c,default:()=>h,frontMatter:()=>o,metadata:()=>i,toc:()=>d});var s=n(74848),a=n(28453);const o={},c="CloudWatch \u57cb\u3081\u8fbc\u307f\u30e1\u30c8\u30ea\u30af\u30b9\u30d5\u30a9\u30fc\u30de\u30c3\u30c8",i={id:"guides/signal-collection/emf",title:"CloudWatch \u57cb\u3081\u8fbc\u307f\u30e1\u30c8\u30ea\u30af\u30b9\u30d5\u30a9\u30fc\u30de\u30c3\u30c8",description:"\u306f\u3058\u3081\u306b",source:"@site/i18n/ja/docusaurus-plugin-content-docs/current/guides/signal-collection/emf.md",sourceDirName:"guides/signal-collection",slug:"/guides/signal-collection/emf",permalink:"/observability-best-practices/ja/guides/signal-collection/emf",draft:!1,unlisted:!1,editUrl:"https://github.com/aws-observability/observability-best-practices/blob/main/docusaurus/docs/guides/signal-collection/emf.md",tags:[],version:"current",frontMatter:{},sidebar:"guides",previous:{title:"CloudWatch \u30c0\u30c3\u30b7\u30e5\u30dc\u30fc\u30c9",permalink:"/observability-best-practices/ja/tools/cloudwatch-dashboard"},next:{title:"AWS \u306b\u304a\u3051\u308b Databricks \u306e\u30e2\u30cb\u30bf\u30ea\u30f3\u30b0\u3068\u30aa\u30d6\u30b6\u30fc\u30d0\u30d3\u30ea\u30c6\u30a3\u306e\u30d9\u30b9\u30c8\u30d7\u30e9\u30af\u30c6\u30a3\u30b9",permalink:"/observability-best-practices/ja/guides/partners/databricks"}},r={},d=[{value:"\u306f\u3058\u3081\u306b",id:"\u306f\u3058\u3081\u306b",level:2},{value:"Embedded Metric Format (EMF) \u30ed\u30b0\u306e\u4ed5\u7d44\u307f",id:"embedded-metric-format-emf-\u30ed\u30b0\u306e\u4ed5\u7d44\u307f",level:2},{value:"Embedded Metric Format (EMF) \u30ed\u30b0\u3092\u4f7f\u7528\u3059\u308b\u30bf\u30a4\u30df\u30f3\u30b0",id:"embedded-metric-format-emf-\u30ed\u30b0\u3092\u4f7f\u7528\u3059\u308b\u30bf\u30a4\u30df\u30f3\u30b0",level:2},{value:"\u57cb\u3081\u8fbc\u307f\u30e1\u30c8\u30ea\u30af\u30b9\u30d5\u30a9\u30fc\u30de\u30c3\u30c8 (EMF) \u30ed\u30b0\u306e\u751f\u6210",id:"\u57cb\u3081\u8fbc\u307f\u30e1\u30c8\u30ea\u30af\u30b9\u30d5\u30a9\u30fc\u30de\u30c3\u30c8-emf-\u30ed\u30b0\u306e\u751f\u6210",level:2},{value:"CloudWatch \u30b3\u30f3\u30bd\u30fc\u30eb\u3067 Embedded Metric Format \u30ed\u30b0\u3092\u8868\u793a\u3059\u308b",id:"cloudwatch-\u30b3\u30f3\u30bd\u30fc\u30eb\u3067-embedded-metric-format-\u30ed\u30b0\u3092\u8868\u793a\u3059\u308b",level:2},{value:"EMF \u30ed\u30b0\u3067\u4f5c\u6210\u3055\u308c\u305f\u30e1\u30c8\u30ea\u30af\u30b9\u306b\u5bfe\u3059\u308b\u30a2\u30e9\u30fc\u30e0",id:"emf-\u30ed\u30b0\u3067\u4f5c\u6210\u3055\u308c\u305f\u30e1\u30c8\u30ea\u30af\u30b9\u306b\u5bfe\u3059\u308b\u30a2\u30e9\u30fc\u30e0",level:2},{value:"EMF \u30ed\u30b0\u306e\u6700\u65b0\u6a5f\u80fd",id:"emf-\u30ed\u30b0\u306e\u6700\u65b0\u6a5f\u80fd",level:2},{value:"\u8ffd\u52a0\u306e\u53c2\u8003\u8cc7\u6599:",id:"\u8ffd\u52a0\u306e\u53c2\u8003\u8cc7\u6599",level:2}];function l(e){const t={a:"a",code:"code",h1:"h1",h2:"h2",img:"img",li:"li",ol:"ol",p:"p",pre:"pre",strong:"strong",ul:"ul",...(0,a.R)(),...e.components};return(0,s.jsxs)(s.Fragment,{children:[(0,s.jsx)(t.h1,{id:"cloudwatch-\u57cb\u3081\u8fbc\u307f\u30e1\u30c8\u30ea\u30af\u30b9\u30d5\u30a9\u30fc\u30de\u30c3\u30c8",children:"CloudWatch \u57cb\u3081\u8fbc\u307f\u30e1\u30c8\u30ea\u30af\u30b9\u30d5\u30a9\u30fc\u30de\u30c3\u30c8"}),"\n",(0,s.jsx)(t.h2,{id:"\u306f\u3058\u3081\u306b",children:"\u306f\u3058\u3081\u306b"}),"\n",(0,s.jsx)(t.p,{children:"CloudWatch Embedded Metric Format (EMF) \u3092\u4f7f\u7528\u3059\u308b\u3068\u3001\u304a\u5ba2\u69d8\u306f\u8907\u96d1\u306a\u9ad8\u30ab\u30fc\u30c7\u30a3\u30ca\u30ea\u30c6\u30a3\u306e\u30a2\u30d7\u30ea\u30b1\u30fc\u30b7\u30e7\u30f3\u30c7\u30fc\u30bf\u3092\u30ed\u30b0\u306e\u5f62\u5f0f\u3067 Amazon CloudWatch \u306b\u53d6\u308a\u8fbc\u307f\u3001\u30a2\u30af\u30b7\u30e7\u30f3\u306b\u3064\u306a\u304c\u308b\u30e1\u30c8\u30ea\u30af\u30b9\u3092\u751f\u6210\u3067\u304d\u307e\u3059\u3002\nEmbedded Metric Format \u3092\u4f7f\u7528\u3059\u308b\u3053\u3068\u3067\u3001\u304a\u5ba2\u69d8\u306f\u74b0\u5883\u306b\u95a2\u3059\u308b\u6d1e\u5bdf\u3092\u5f97\u308b\u305f\u3081\u306b\u8907\u96d1\u306a\u30a2\u30fc\u30ad\u30c6\u30af\u30c1\u30e3\u3084\u30b5\u30fc\u30c9\u30d1\u30fc\u30c6\u30a3\u306e\u30c4\u30fc\u30eb\u306b\u983c\u308b\u5fc5\u8981\u304c\u3042\u308a\u307e\u305b\u3093\u3002\n\u3053\u306e\u6a5f\u80fd\u306f\u3059\u3079\u3066\u306e\u74b0\u5883\u3067\u4f7f\u7528\u3067\u304d\u307e\u3059\u304c\u3001\u7279\u306b AWS Lambda \u95a2\u6570\u3084 Amazon Elastic Container Service (Amazon ECS)\u3001Amazon Elastic Kubernetes Service (Amazon EKS)\u3001EC2 \u4e0a\u306e Kubernetes \u306a\u3069\u306e\u4e00\u6642\u7684\u306a\u30ea\u30bd\u30fc\u30b9\u3092\u6301\u3064\u30ef\u30fc\u30af\u30ed\u30fc\u30c9\u3067\u7279\u306b\u6709\u7528\u3067\u3059\u3002\nEmbedded Metric Format \u3092\u4f7f\u7528\u3059\u308b\u3068\u3001\u304a\u5ba2\u69d8\u306f\u5225\u500b\u306e\u30b3\u30fc\u30c9\u3092\u5b9f\u88c5\u3057\u305f\u308a\u7dad\u6301\u3057\u305f\u308a\u3059\u308b\u3053\u3068\u306a\u304f\u3001\u30ab\u30b9\u30bf\u30e0\u30e1\u30c8\u30ea\u30af\u30b9\u3092\u7c21\u5358\u306b\u4f5c\u6210\u3067\u304d\u3001\u540c\u6642\u306b\u30ed\u30b0\u30c7\u30fc\u30bf\u306b\u5bfe\u3059\u308b\u5f37\u529b\u306a\u5206\u6790\u6a5f\u80fd\u3092\u5f97\u308b\u3053\u3068\u304c\u3067\u304d\u307e\u3059\u3002"}),"\n",(0,s.jsx)(t.h2,{id:"embedded-metric-format-emf-\u30ed\u30b0\u306e\u4ed5\u7d44\u307f",children:"Embedded Metric Format (EMF) \u30ed\u30b0\u306e\u4ed5\u7d44\u307f"}),"\n",(0,s.jsx)(t.p,{children:"Amazon EC2\u3001\u30aa\u30f3\u30d7\u30ec\u30df\u30b9\u30b5\u30fc\u30d0\u30fc\u3001Amazon Elastic Container Service (Amazon ECS)\u3001Amazon Elastic Kubernetes Service (Amazon EKS)\u3001\u307e\u305f\u306f EC2 \u4e0a\u306e Kubernetes \u306a\u3069\u306e\u30b3\u30f3\u30d4\u30e5\u30fc\u30c6\u30a3\u30f3\u30b0\u74b0\u5883\u306f\u3001CloudWatch \u30a8\u30fc\u30b8\u30a7\u30f3\u30c8\u3092\u901a\u3058\u3066 Embedded Metric Format (EMF) \u30ed\u30b0\u3092\u751f\u6210\u3057\u3001Amazon CloudWatch \u306b\u9001\u4fe1\u3067\u304d\u307e\u3059\u3002"}),"\n",(0,s.jsx)(t.p,{children:"AWS Lambda \u3092\u4f7f\u7528\u3059\u308b\u3068\u3001\u30ab\u30b9\u30bf\u30e0\u30b3\u30fc\u30c9\u3092\u5fc5\u8981\u3068\u305b\u305a\u3001\u30d6\u30ed\u30c3\u30ad\u30f3\u30b0\u30cd\u30c3\u30c8\u30ef\u30fc\u30af\u547c\u3073\u51fa\u3057\u3092\u884c\u308f\u305a\u3001\u30b5\u30fc\u30c9\u30d1\u30fc\u30c6\u30a3\u306e\u30bd\u30d5\u30c8\u30a6\u30a7\u30a2\u306b\u4f9d\u5b58\u3059\u308b\u3053\u3068\u306a\u304f\u3001\u7c21\u5358\u306b\u30ab\u30b9\u30bf\u30e0\u30e1\u30c8\u30ea\u30af\u30b9\u3092\u751f\u6210\u3057\u3001Embedded Metric Format (EMF) \u30ed\u30b0\u3092 Amazon CloudWatch \u306b\u53d6\u308a\u8fbc\u3080\u3053\u3068\u304c\u3067\u304d\u307e\u3059\u3002"}),"\n",(0,s.jsxs)(t.p,{children:["\u304a\u5ba2\u69d8\u306f\u3001",(0,s.jsx)(t.a,{href:"https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/CloudWatch_Embedded_Metric_Format_Specification.html",children:"EMF \u4ed5\u69d8"}),"\u306b\u6e96\u62e0\u3057\u305f\u69cb\u9020\u5316\u30ed\u30b0\u3092\u516c\u958b\u3059\u308b\u969b\u306b\u3001\u7279\u5225\u306a\u30d8\u30c3\u30c0\u30fc\u5ba3\u8a00\u3092\u63d0\u4f9b\u3059\u308b\u5fc5\u8981\u306a\u304f\u3001\u8a73\u7d30\u306a\u30ed\u30b0\u30a4\u30d9\u30f3\u30c8\u30c7\u30fc\u30bf\u3068\u5171\u306b\u30ab\u30b9\u30bf\u30e0\u30e1\u30c8\u30ea\u30af\u30b9\u3092\u975e\u540c\u671f\u3067\u57cb\u3081\u8fbc\u3080\u3053\u3068\u304c\u3067\u304d\u307e\u3059\u3002CloudWatch \u306f\u81ea\u52d5\u7684\u306b\u30ab\u30b9\u30bf\u30e0\u30e1\u30c8\u30ea\u30af\u30b9\u3092\u62bd\u51fa\u3059\u308b\u305f\u3081\u3001\u304a\u5ba2\u69d8\u306f\u30ea\u30a2\u30eb\u30bf\u30a4\u30e0\u306e\u30a4\u30f3\u30b7\u30c7\u30f3\u30c8\u691c\u51fa\u306e\u305f\u3081\u306b\u30e1\u30c8\u30ea\u30af\u30b9\u3092\u53ef\u8996\u5316\u3057\u3001\u30a2\u30e9\u30fc\u30e0\u3092\u8a2d\u5b9a\u3067\u304d\u307e\u3059\u3002\u62bd\u51fa\u3055\u308c\u305f\u30e1\u30c8\u30ea\u30af\u30b9\u306b\u95a2\u9023\u3059\u308b\u8a73\u7d30\u306a\u30ed\u30b0\u30a4\u30d9\u30f3\u30c8\u3068\u9ad8\u30ab\u30fc\u30c7\u30a3\u30ca\u30ea\u30c6\u30a3\u306e\u30b3\u30f3\u30c6\u30ad\u30b9\u30c8\u306f\u3001CloudWatch Logs Insights \u3092\u4f7f\u7528\u3057\u3066\u30af\u30a8\u30ea\u3092\u5b9f\u884c\u3057\u3001\u904b\u7528\u30a4\u30d9\u30f3\u30c8\u306e\u6839\u672c\u539f\u56e0\u306b\u95a2\u3059\u308b\u6df1\u3044\u6d1e\u5bdf\u3092\u63d0\u4f9b\u3067\u304d\u307e\u3059\u3002"]}),"\n",(0,s.jsxs)(t.p,{children:[(0,s.jsx)(t.a,{href:"https://docs.fluentbit.io/manual/pipeline/outputs/cloudwatch",children:"Fluent Bit"})," \u7528\u306e Amazon CloudWatch \u51fa\u529b\u30d7\u30e9\u30b0\u30a4\u30f3\u3092\u4f7f\u7528\u3059\u308b\u3068\u3001\u304a\u5ba2\u69d8\u306f ",(0,s.jsx)(t.a,{href:"https://github.com/aws/aws-for-fluent-bit",children:"Embedded Metric Format"})," (EMF) \u306e\u30b5\u30dd\u30fc\u30c8\u3092\u542b\u3080 Amazon CloudWatch \u30b5\u30fc\u30d3\u30b9\u306b\u30e1\u30c8\u30ea\u30af\u30b9\u3068\u30ed\u30b0\u30c7\u30fc\u30bf\u3092\u53d6\u308a\u8fbc\u3080\u3053\u3068\u304c\u3067\u304d\u307e\u3059\u3002"]}),"\n",(0,s.jsx)(t.p,{children:(0,s.jsx)(t.img,{alt:"CloudWatch EMF \u30a2\u30fc\u30ad\u30c6\u30af\u30c1\u30e3",src:n(2137).A+"",width:"1163",height:"472"})}),"\n",(0,s.jsx)(t.h2,{id:"embedded-metric-format-emf-\u30ed\u30b0\u3092\u4f7f\u7528\u3059\u308b\u30bf\u30a4\u30df\u30f3\u30b0",children:"Embedded Metric Format (EMF) \u30ed\u30b0\u3092\u4f7f\u7528\u3059\u308b\u30bf\u30a4\u30df\u30f3\u30b0"}),"\n",(0,s.jsx)(t.p,{children:"\u5f93\u6765\u3001\u30e2\u30cb\u30bf\u30ea\u30f3\u30b0\u306f 3 \u3064\u306e\u30ab\u30c6\u30b4\u30ea\u306b\u5206\u985e\u3055\u308c\u3066\u3044\u307e\u3057\u305f\u3002\u7b2c\u4e00\u306e\u30ab\u30c6\u30b4\u30ea\u306f\u3001\u30a2\u30d7\u30ea\u30b1\u30fc\u30b7\u30e7\u30f3\u306e\u53e4\u5178\u7684\u306a\u30d8\u30eb\u30b9\u30c1\u30a7\u30c3\u30af\u3067\u3059\u3002\u7b2c\u4e8c\u306e\u30ab\u30c6\u30b4\u30ea\u306f\u300c\u30e1\u30c8\u30ea\u30af\u30b9\u300d\u3067\u3001\u9867\u5ba2\u306f\u30ab\u30a6\u30f3\u30bf\u30fc\u3001\u30bf\u30a4\u30de\u30fc\u3001\u30b2\u30fc\u30b8\u306a\u3069\u306e\u30e2\u30c7\u30eb\u3092\u4f7f\u7528\u3057\u3066\u30a2\u30d7\u30ea\u30b1\u30fc\u30b7\u30e7\u30f3\u3092\u8a08\u6e2c\u3057\u307e\u3059\u3002\u7b2c\u4e09\u306e\u30ab\u30c6\u30b4\u30ea\u306f\u300c\u30ed\u30b0\u300d\u3067\u3001\u30a2\u30d7\u30ea\u30b1\u30fc\u30b7\u30e7\u30f3\u306e\u5168\u4f53\u7684\u306a\u30aa\u30d6\u30b6\u30fc\u30d0\u30d3\u30ea\u30c6\u30a3\u306b\u4e0d\u53ef\u6b20\u3067\u3059\u3002\u30ed\u30b0\u306f\u3001\u30a2\u30d7\u30ea\u30b1\u30fc\u30b7\u30e7\u30f3\u306e\u52d5\u4f5c\u306b\u95a2\u3059\u308b\u7d99\u7d9a\u7684\u306a\u60c5\u5831\u3092\u9867\u5ba2\u306b\u63d0\u4f9b\u3057\u307e\u3059\u3002\u73fe\u5728\u3001\u9867\u5ba2\u306f Embedded Metric Format (EMF) \u30ed\u30b0\u3092\u901a\u3058\u3066\u3001\u30c7\u30fc\u30bf\u306e\u7c92\u5ea6\u3084\u8c4a\u304b\u3055\u3092\u72a0\u7272\u306b\u3059\u308b\u3053\u3068\u306a\u304f\u3001\u30a2\u30d7\u30ea\u30b1\u30fc\u30b7\u30e7\u30f3\u306e\u89b3\u6e2c\u65b9\u6cd5\u3092\u5927\u5e45\u306b\u6539\u5584\u3059\u308b\u65b9\u6cd5\u3092\u624b\u306b\u5165\u308c\u307e\u3057\u305f\u3002\u3053\u308c\u306b\u3088\u308a\u3001\u30a2\u30d7\u30ea\u30b1\u30fc\u30b7\u30e7\u30f3\u306e\u3059\u3079\u3066\u306e\u8a08\u6e2c\u3092\u7d71\u5408\u30fb\u7c21\u7d20\u5316\u3057\u306a\u304c\u3089\u3001\u4fe1\u3058\u3089\u308c\u306a\u3044\u307b\u3069\u306e\u5206\u6790\u80fd\u529b\u3092\u7372\u5f97\u3067\u304d\u307e\u3059\u3002"}),"\n",(0,s.jsxs)(t.p,{children:[(0,s.jsx)(t.a,{href:"https://aws.amazon.com/blogs/mt/enhancing-workload-observability-using-amazon-cloudwatch-embedded-metric-format/",children:"Embedded Metric Format (EMF) \u30ed\u30b0"})," \u306f\u3001\u30e1\u30c8\u30ea\u30af\u30b9\u306e\u30c7\u30a3\u30e1\u30f3\u30b7\u30e7\u30f3\u3092\u5897\u3084\u3059\u3053\u3068\u306a\u304f\u3001EMF \u30ed\u30b0\u306e\u4e00\u90e8\u3068\u3057\u3066\u9ad8\u30ab\u30fc\u30c7\u30a3\u30ca\u30ea\u30c6\u30a3\u306e\u30a2\u30d7\u30ea\u30b1\u30fc\u30b7\u30e7\u30f3\u30c7\u30fc\u30bf\u3092\u751f\u6210\u3059\u308b\u74b0\u5883\u306b\u6700\u9069\u3067\u3059\u3002\u3053\u308c\u306b\u3088\u308a\u3001\u9867\u5ba2\u306f CloudWatch Logs Insights \u3084 CloudWatch Metrics Insights \u3092\u901a\u3058\u3066 EMF \u30ed\u30b0\u3092\u30af\u30a8\u30ea\u3059\u308b\u3053\u3068\u3067\u3001\u3059\u3079\u3066\u306e\u5c5e\u6027\u3092\u30e1\u30c8\u30ea\u30af\u30b9\u306e\u30c7\u30a3\u30e1\u30f3\u30b7\u30e7\u30f3\u3068\u3057\u3066\u8a2d\u5b9a\u3059\u308b\u5fc5\u8981\u306a\u304f\u3001\u30a2\u30d7\u30ea\u30b1\u30fc\u30b7\u30e7\u30f3\u30c7\u30fc\u30bf\u3092\u81ea\u7531\u306b\u5206\u6790\u3067\u304d\u307e\u3059\u3002"]}),"\n",(0,s.jsxs)(t.p,{children:[(0,s.jsx)(t.a,{href:"https://aws.amazon.com/blogs/mt/how-bt-uses-amazon-cloudwatch-to-monitor-millions-of-devices/",children:"\u6570\u767e\u4e07\u306e\u901a\u4fe1\u6a5f\u5668\u3084 IoT \u30c7\u30d0\u30a4\u30b9\u304b\u3089\u30c6\u30ec\u30e1\u30c8\u30ea\u30c7\u30fc\u30bf\u3092\u96c6\u7d04"})," \u3059\u308b\u9867\u5ba2\u306f\u3001\u30c7\u30d0\u30a4\u30b9\u306e\u30d1\u30d5\u30a9\u30fc\u30de\u30f3\u30b9\u306b\u95a2\u3059\u308b\u6d1e\u5bdf\u3068\u3001\u30c7\u30d0\u30a4\u30b9\u304c\u5831\u544a\u3059\u308b\u30e6\u30cb\u30fc\u30af\u306a\u30c6\u30ec\u30e1\u30c8\u30ea\u3092\u3059\u3070\u3084\u304f\u6df1\u304f\u6398\u308a\u4e0b\u3052\u308b\u80fd\u529b\u3092\u5fc5\u8981\u3068\u3057\u3066\u3044\u307e\u3059\u3002\u307e\u305f\u3001\u8cea\u306e\u9ad8\u3044\u30b5\u30fc\u30d3\u30b9\u3092\u63d0\u4f9b\u3059\u308b\u305f\u3081\u306b\u3001\u81a8\u5927\u306a\u30c7\u30fc\u30bf\u3092\u6398\u308a\u8d77\u3053\u3059\u3053\u3068\u306a\u304f\u3001\u554f\u984c\u3092\u3088\u308a\u7c21\u5358\u304b\u3064\u8fc5\u901f\u306b\u30c8\u30e9\u30d6\u30eb\u30b7\u30e5\u30fc\u30c6\u30a3\u30f3\u30b0\u3059\u308b\u5fc5\u8981\u304c\u3042\u308a\u307e\u3059\u3002Embedded Metric Format (EMF) \u30ed\u30b0\u3092\u4f7f\u7528\u3059\u308b\u3053\u3068\u3067\u3001\u9867\u5ba2\u306f\u30e1\u30c8\u30ea\u30af\u30b9\u3068\u30ed\u30b0\u3092\u5358\u4e00\u306e\u30a8\u30f3\u30c6\u30a3\u30c6\u30a3\u306b\u7d50\u5408\u3057\u3066\u5927\u898f\u6a21\u306a\u30aa\u30d6\u30b6\u30fc\u30d0\u30d3\u30ea\u30c6\u30a3\u3092\u5b9f\u73fe\u3057\u3001\u30b3\u30b9\u30c8\u52b9\u7387\u3068\u512a\u308c\u305f\u30d1\u30d5\u30a9\u30fc\u30de\u30f3\u30b9\u3067\u30c8\u30e9\u30d6\u30eb\u30b7\u30e5\u30fc\u30c6\u30a3\u30f3\u30b0\u3092\u6539\u5584\u3067\u304d\u307e\u3059\u3002"]}),"\n",(0,s.jsx)(t.h2,{id:"\u57cb\u3081\u8fbc\u307f\u30e1\u30c8\u30ea\u30af\u30b9\u30d5\u30a9\u30fc\u30de\u30c3\u30c8-emf-\u30ed\u30b0\u306e\u751f\u6210",children:"\u57cb\u3081\u8fbc\u307f\u30e1\u30c8\u30ea\u30af\u30b9\u30d5\u30a9\u30fc\u30de\u30c3\u30c8 (EMF) \u30ed\u30b0\u306e\u751f\u6210"}),"\n",(0,s.jsx)(t.p,{children:"\u57cb\u3081\u8fbc\u307f\u30e1\u30c8\u30ea\u30af\u30b9\u30d5\u30a9\u30fc\u30de\u30c3\u30c8\u30ed\u30b0\u3092\u751f\u6210\u3059\u308b\u306b\u306f\u3001\u4ee5\u4e0b\u306e\u65b9\u6cd5\u3092\u4f7f\u7528\u3067\u304d\u307e\u3059\u3002"}),"\n",(0,s.jsxs)(t.ol,{children:["\n",(0,s.jsxs)(t.li,{children:["\n",(0,s.jsxs)(t.p,{children:["\u30aa\u30fc\u30d7\u30f3\u30bd\u30fc\u30b9\u306e\u30af\u30e9\u30a4\u30a2\u30f3\u30c8\u30e9\u30a4\u30d6\u30e9\u30ea\u3092\u4f7f\u7528\u3057\u3066\u3001\u30a8\u30fc\u30b8\u30a7\u30f3\u30c8\uff08",(0,s.jsx)(t.a,{href:"https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/CloudWatch_Embedded_Metric_Format_Generation_CloudWatch_Agent.html",children:"CloudWatch"})," \u3084 Fluent-Bit\u3001Firelens \u306a\u3069\uff09\u3092\u901a\u3058\u3066 EMF \u30ed\u30b0\u3092\u751f\u6210\u3057\u9001\u4fe1\u3059\u308b\u3002"]}),"\n",(0,s.jsxs)(t.ul,{children:["\n",(0,s.jsxs)(t.li,{children:["EMF \u30ed\u30b0\u3092\u4f5c\u6210\u3059\u308b\u305f\u3081\u306b\u4f7f\u7528\u3067\u304d\u308b\u30aa\u30fc\u30d7\u30f3\u30bd\u30fc\u30b9\u306e\u30af\u30e9\u30a4\u30a2\u30f3\u30c8\u30e9\u30a4\u30d6\u30e9\u30ea\u304c\u3001\u4ee5\u4e0b\u306e\u8a00\u8a9e\u3067\u5229\u7528\u53ef\u80fd\u3067\u3059\uff1a","\n",(0,s.jsxs)(t.ul,{children:["\n",(0,s.jsx)(t.li,{children:(0,s.jsx)(t.a,{href:"https://github.com/awslabs/aws-embedded-metrics-node",children:"Node.Js"})}),"\n",(0,s.jsx)(t.li,{children:(0,s.jsx)(t.a,{href:"https://github.com/awslabs/aws-embedded-metrics-python",children:"Python"})}),"\n",(0,s.jsx)(t.li,{children:(0,s.jsx)(t.a,{href:"https://github.com/awslabs/aws-embedded-metrics-java",children:"Java"})}),"\n",(0,s.jsx)(t.li,{children:(0,s.jsx)(t.a,{href:"https://github.com/awslabs/aws-embedded-metrics-dotnet",children:"C#"})}),"\n"]}),"\n"]}),"\n",(0,s.jsxs)(t.li,{children:["AWS Distro for OpenTelemetry (ADOT) \u3092\u4f7f\u7528\u3057\u3066 EMF \u30ed\u30b0\u3092\u751f\u6210\u3067\u304d\u307e\u3059\u3002ADOT \u306f\u3001Cloud Native Computing Foundation (CNCF) \u306e\u4e00\u90e8\u3067\u3042\u308b OpenTelemetry \u30d7\u30ed\u30b8\u30a7\u30af\u30c8\u306e\u3001\u5b89\u5168\u3067\u672c\u756a\u74b0\u5883\u306b\u5bfe\u5fdc\u3057\u305f AWS \u30b5\u30dd\u30fc\u30c8\u306e\u914d\u5e03\u7248\u3067\u3059\u3002OpenTelemetry \u306f\u3001\u30a2\u30d7\u30ea\u30b1\u30fc\u30b7\u30e7\u30f3\u30e2\u30cb\u30bf\u30ea\u30f3\u30b0\u306e\u305f\u3081\u306e\u5206\u6563\u30c8\u30ec\u30fc\u30b9\u3001\u30ed\u30b0\u3001\u30e1\u30c8\u30ea\u30af\u30b9\u3092\u53ce\u96c6\u3059\u308b API\u3001\u30e9\u30a4\u30d6\u30e9\u30ea\u3001\u30a8\u30fc\u30b8\u30a7\u30f3\u30c8\u3092\u63d0\u4f9b\u3057\u3001\u30d9\u30f3\u30c0\u30fc\u56fa\u6709\u306e\u30d5\u30a9\u30fc\u30de\u30c3\u30c8\u9593\u306e\u5883\u754c\u3084\u5236\u9650\u3092\u53d6\u308a\u9664\u304f\u30aa\u30fc\u30d7\u30f3\u30bd\u30fc\u30b9\u30a4\u30cb\u30b7\u30a2\u30c1\u30d6\u3067\u3059\u3002\u3053\u308c\u306b\u306f\u3001OpenTelemetry \u6e96\u62e0\u306e\u30c7\u30fc\u30bf\u30bd\u30fc\u30b9\u3068\u3001",(0,s.jsx)(t.a,{href:"https://aws-otel.github.io/docs/getting-started/cloudwatch-metrics#cloudwatch-emf-exporter-awsemf",children:"CloudWatch EMF"})," \u30ed\u30b0\u3067\u4f7f\u7528\u3059\u308b\u305f\u3081\u306e ",(0,s.jsx)(t.a,{href:"https://github.com/open-telemetry/opentelemetry-collector-contrib/tree/main/exporter/awsemfexporter",children:"ADOT Collector"})," \u306e 2 \u3064\u306e\u30b3\u30f3\u30dd\u30fc\u30cd\u30f3\u30c8\u304c\u5fc5\u8981\u3067\u3059\u3002"]}),"\n"]}),"\n"]}),"\n",(0,s.jsxs)(t.li,{children:["\n",(0,s.jsxs)(t.p,{children:[(0,s.jsx)(t.a,{href:"https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/CloudWatch_Embedded_Metric_Format_Specification.html",children:"\u5b9a\u7fa9\u3055\u308c\u305f JSON \u5f62\u5f0f\u306e\u4ed5\u69d8"})," \u306b\u6e96\u62e0\u3057\u3066\u624b\u52d5\u3067\u69cb\u7bc9\u3055\u308c\u305f\u30ed\u30b0\u3092\u3001",(0,s.jsx)(t.a,{href:"https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/CloudWatch_Embedded_Metric_Format_Generation_CloudWatch_Agent.html",children:"CloudWatch \u30a8\u30fc\u30b8\u30a7\u30f3\u30c8"})," \u307e\u305f\u306f ",(0,s.jsx)(t.a,{href:"https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/CloudWatch_Embedded_Metric_Format_Generation_PutLogEvents.html",children:"PutLogEvents API"})," \u3092\u901a\u3058\u3066 CloudWatch \u306b\u9001\u4fe1\u3067\u304d\u307e\u3059\u3002"]}),"\n"]}),"\n"]}),"\n",(0,s.jsx)(t.h2,{id:"cloudwatch-\u30b3\u30f3\u30bd\u30fc\u30eb\u3067-embedded-metric-format-\u30ed\u30b0\u3092\u8868\u793a\u3059\u308b",children:"CloudWatch \u30b3\u30f3\u30bd\u30fc\u30eb\u3067 Embedded Metric Format \u30ed\u30b0\u3092\u8868\u793a\u3059\u308b"}),"\n",(0,s.jsxs)(t.p,{children:["Embedded Metric Format (EMF) \u30ed\u30b0\u3092\u751f\u6210\u3057\u3066\u30e1\u30c8\u30ea\u30af\u30b9\u3092\u62bd\u51fa\u3057\u305f\u5f8c\u3001\u304a\u5ba2\u69d8\u306f ",(0,s.jsx)(t.a,{href:"https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/CloudWatch_Embedded_Metric_Format_View.html",children:"CloudWatch \u30b3\u30f3\u30bd\u30fc\u30eb\u3067\u305d\u308c\u3089\u3092\u8868\u793a"})," \u3067\u304d\u307e\u3059\u3002\u57cb\u3081\u8fbc\u307f\u30e1\u30c8\u30ea\u30af\u30b9\u306b\u306f\u3001\u30ed\u30b0\u751f\u6210\u6642\u306b\u6307\u5b9a\u3055\u308c\u305f\u30c7\u30a3\u30e1\u30f3\u30b7\u30e7\u30f3\u304c\u3042\u308a\u307e\u3059\u3002\u30af\u30e9\u30a4\u30a2\u30f3\u30c8\u30e9\u30a4\u30d6\u30e9\u30ea\u3092\u4f7f\u7528\u3057\u3066\u751f\u6210\u3055\u308c\u305f\u57cb\u3081\u8fbc\u307f\u30e1\u30c8\u30ea\u30af\u30b9\u306b\u306f\u3001\u30c7\u30d5\u30a9\u30eb\u30c8\u306e\u30c7\u30a3\u30e1\u30f3\u30b7\u30e7\u30f3\u3068\u3057\u3066 ServiceType\u3001ServiceName\u3001LogGroup \u304c\u3042\u308a\u307e\u3059\u3002"]}),"\n",(0,s.jsxs)(t.ul,{children:["\n",(0,s.jsxs)(t.li,{children:[(0,s.jsx)(t.strong,{children:"ServiceName"}),": \u30b5\u30fc\u30d3\u30b9\u540d\u306f\u4e0a\u66f8\u304d\u3055\u308c\u307e\u3059\u304c\u3001\u540d\u524d\u3092\u63a8\u6e2c\u3067\u304d\u306a\u3044\u30b5\u30fc\u30d3\u30b9\uff08\u4f8b\uff1aEC2 \u3067\u5b9f\u884c\u3055\u308c\u308b Java \u30d7\u30ed\u30bb\u30b9\uff09\u306e\u5834\u5408\u3001\u660e\u793a\u7684\u306b\u8a2d\u5b9a\u3055\u308c\u3066\u3044\u306a\u3051\u308c\u3070\u30c7\u30d5\u30a9\u30eb\u30c8\u5024\u3068\u3057\u3066 Unknown \u304c\u4f7f\u7528\u3055\u308c\u307e\u3059\u3002"]}),"\n",(0,s.jsxs)(t.li,{children:[(0,s.jsx)(t.strong,{children:"ServiceType"}),": \u30b5\u30fc\u30d3\u30b9\u30bf\u30a4\u30d7\u306f\u4e0a\u66f8\u304d\u3055\u308c\u307e\u3059\u304c\u3001\u30bf\u30a4\u30d7\u3092\u63a8\u6e2c\u3067\u304d\u306a\u3044\u30b5\u30fc\u30d3\u30b9\uff08\u4f8b\uff1aEC2 \u3067\u5b9f\u884c\u3055\u308c\u308b Java \u30d7\u30ed\u30bb\u30b9\uff09\u306e\u5834\u5408\u3001\u660e\u793a\u7684\u306b\u8a2d\u5b9a\u3055\u308c\u3066\u3044\u306a\u3051\u308c\u3070\u30c7\u30d5\u30a9\u30eb\u30c8\u5024\u3068\u3057\u3066 Unknown \u304c\u4f7f\u7528\u3055\u308c\u307e\u3059\u3002"]}),"\n",(0,s.jsxs)(t.li,{children:[(0,s.jsx)(t.strong,{children:"LogGroupName"}),": \u30a8\u30fc\u30b8\u30a7\u30f3\u30c8\u30d9\u30fc\u30b9\u306e\u30d7\u30e9\u30c3\u30c8\u30d5\u30a9\u30fc\u30e0\u3067\u306f\u3001\u304a\u5ba2\u69d8\u306f\u30aa\u30d7\u30b7\u30e7\u30f3\u3067\u30e1\u30c8\u30ea\u30af\u30b9\u3092\u914d\u4fe1\u3059\u308b\u5148\u306e\u30ed\u30b0\u30b0\u30eb\u30fc\u30d7\u3092\u8a2d\u5b9a\u3067\u304d\u307e\u3059\u3002\u3053\u306e\u5024\u306f\u3001\u57cb\u3081\u8fbc\u307f\u30e1\u30c8\u30ea\u30af\u30b9\u306e\u30da\u30a4\u30ed\u30fc\u30c9\u3067\u30e9\u30a4\u30d6\u30e9\u30ea\u304b\u3089\u30a8\u30fc\u30b8\u30a7\u30f3\u30c8\u306b\u6e21\u3055\u308c\u307e\u3059\u3002LogGroup \u304c\u63d0\u4f9b\u3055\u308c\u306a\u3044\u5834\u5408\u3001\u30c7\u30d5\u30a9\u30eb\u30c8\u5024\u306f\u30b5\u30fc\u30d3\u30b9\u540d\u304b\u3089\u6d3e\u751f\u3057\u307e\u3059\uff1a-metrics"]}),"\n",(0,s.jsxs)(t.li,{children:[(0,s.jsx)(t.strong,{children:"LogStreamName"}),": \u30a8\u30fc\u30b8\u30a7\u30f3\u30c8\u30d9\u30fc\u30b9\u306e\u30d7\u30e9\u30c3\u30c8\u30d5\u30a9\u30fc\u30e0\u3067\u306f\u3001\u304a\u5ba2\u69d8\u306f\u30aa\u30d7\u30b7\u30e7\u30f3\u3067\u30e1\u30c8\u30ea\u30af\u30b9\u3092\u914d\u4fe1\u3059\u308b\u5148\u306e\u30ed\u30b0\u30b9\u30c8\u30ea\u30fc\u30e0\u3092\u8a2d\u5b9a\u3067\u304d\u307e\u3059\u3002\u3053\u306e\u5024\u306f\u3001\u57cb\u3081\u8fbc\u307f\u30e1\u30c8\u30ea\u30af\u30b9\u306e\u30da\u30a4\u30ed\u30fc\u30c9\u3067\u30e9\u30a4\u30d6\u30e9\u30ea\u304b\u3089\u30a8\u30fc\u30b8\u30a7\u30f3\u30c8\u306b\u6e21\u3055\u308c\u307e\u3059\u3002LogStreamName \u304c\u63d0\u4f9b\u3055\u308c\u306a\u3044\u5834\u5408\u3001\u30c7\u30d5\u30a9\u30eb\u30c8\u5024\u306f\u30a8\u30fc\u30b8\u30a7\u30f3\u30c8\u306b\u3088\u3063\u3066\u6d3e\u751f\u3057\u307e\u3059\uff08\u901a\u5e38\u306f\u30db\u30b9\u30c8\u540d\u306b\u306a\u308a\u307e\u3059\uff09\u3002"]}),"\n",(0,s.jsxs)(t.li,{children:[(0,s.jsx)(t.strong,{children:"NameSpace"}),": CloudWatch \u306e\u540d\u524d\u7a7a\u9593\u3092\u4e0a\u66f8\u304d\u3057\u307e\u3059\u3002\u8a2d\u5b9a\u3055\u308c\u3066\u3044\u306a\u3044\u5834\u5408\u3001\u30c7\u30d5\u30a9\u30eb\u30c8\u5024\u3068\u3057\u3066 aws-embedded-metrics \u304c\u4f7f\u7528\u3055\u308c\u307e\u3059\u3002"]}),"\n"]}),"\n",(0,s.jsx)(t.p,{children:"CloudWatch \u30b3\u30f3\u30bd\u30fc\u30eb\u30ed\u30b0\u3067\u306e EMF \u30ed\u30b0\u306e\u30b5\u30f3\u30d7\u30eb\u306f\u4ee5\u4e0b\u306e\u3088\u3046\u306b\u306a\u308a\u307e\u3059\u3002"}),"\n",(0,s.jsx)(t.pre,{children:(0,s.jsx)(t.code,{className:"language-json",children:'2023-05-19T15:20:39.391Z 238196b6-c8da-4341-a4b7-0c322e0ef5bb INFO\n{\n    "LogGroup": "emfTestFunction",\n    "ServiceName": "emfTestFunction",\n    "ServiceType": "AWS::Lambda::Function",\n    "Service": "Aggregator",\n    "AccountId": "XXXXXXXXXXXX",\n    "RequestId": "422b1569-16f6-4a03-b8f0-fe3fd9b100f8",\n    "DeviceId": "61270781-c6ac-46f1-baf7-22c808af8162",\n    "Payload": {\n        "sampleTime": 123456789,\n        "temperature": 273,\n        "pressure": 101.3\n    },\n    "executionEnvironment": "AWS_Lambda_nodejs18.x",\n    "memorySize": "256",\n    "functionVersion": "$LATEST",\n    "logStreamId": "2023/05/19/[$LATEST]f3377848231140c185570caa9f97abc8",\n    "_aws": {\n        "Timestamp": 1684509639390,\n        "CloudWatchMetrics": [\n            {\n                "Dimensions": [\n                    [\n                        "LogGroup",\n                        "ServiceName",\n                        "ServiceType",\n                        "Service"\n                    ]\n                ],\n                "Metrics": [\n                    {\n                        "Name": "ProcessingLatency",\n                        "Unit": "Milliseconds"\n                    }\n                ],\n                "Namespace": "aws-embedded-metrics"\n            }\n        ]\n    },\n    "ProcessingLatency": 100\n}\n'})}),"\n",(0,s.jsxs)(t.p,{children:["\u540c\u3058 EMF \u30ed\u30b0\u306b\u5bfe\u3057\u3066\u3001\u62bd\u51fa\u3055\u308c\u305f\u30e1\u30c8\u30ea\u30af\u30b9\u306f\u4ee5\u4e0b\u306e\u3088\u3046\u306b\u306a\u308a\u3001",(0,s.jsx)(t.strong,{children:"CloudWatch Metrics"})," \u3067\u7167\u4f1a\u3067\u304d\u307e\u3059\u3002"]}),"\n",(0,s.jsx)(t.p,{children:(0,s.jsx)(t.img,{alt:"CloudWatch EMF Metrics",src:n(61521).A+"",width:"942",height:"606"})}),"\n",(0,s.jsxs)(t.p,{children:["\u304a\u5ba2\u69d8\u306f ",(0,s.jsx)(t.strong,{children:"CloudWatch Logs Insights"})," \u3092\u4f7f\u7528\u3057\u3066\u3001\u62bd\u51fa\u3055\u308c\u305f\u30e1\u30c8\u30ea\u30af\u30b9\u306b\u95a2\u9023\u3059\u308b\u8a73\u7d30\u306a\u30ed\u30b0\u30a4\u30d9\u30f3\u30c8\u3092\u7167\u4f1a\u3057\u3001\u904b\u7528\u30a4\u30d9\u30f3\u30c8\u306e\u6839\u672c\u539f\u56e0\u306b\u3064\u3044\u3066\u6df1\u3044\u6d1e\u5bdf\u3092\u5f97\u308b\u3053\u3068\u304c\u3067\u304d\u307e\u3059\u3002EMF \u30ed\u30b0\u304b\u3089\u30e1\u30c8\u30ea\u30af\u30b9\u3092\u62bd\u51fa\u3059\u308b\u3053\u3068\u306e\u5229\u70b9\u306e 1 \u3064\u306f\u3001\u304a\u5ba2\u69d8\u304c\u4e00\u610f\u306e\u30e1\u30c8\u30ea\u30af\u30b9\uff08\u30e1\u30c8\u30ea\u30af\u30b9\u540d\u30d7\u30e9\u30b9\u4e00\u610f\u306e\u30c7\u30a3\u30e1\u30f3\u30b7\u30e7\u30f3\u30bb\u30c3\u30c8\uff09\u3068\u30e1\u30c8\u30ea\u30af\u30b9\u5024\u3067\u30ed\u30b0\u3092\u30d5\u30a3\u30eb\u30bf\u30ea\u30f3\u30b0\u3057\u3001\u96c6\u8a08\u3055\u308c\u305f\u30e1\u30c8\u30ea\u30af\u30b9\u5024\u306b\u5bc4\u4e0e\u3057\u305f\u30a4\u30d9\u30f3\u30c8\u306e\u30b3\u30f3\u30c6\u30ad\u30b9\u30c8\u3092\u53d6\u5f97\u3067\u304d\u308b\u3053\u3068\u3067\u3059\u3002"]}),"\n",(0,s.jsx)(t.p,{children:"\u4e0a\u8a18\u3067\u8aac\u660e\u3057\u305f\u540c\u3058 EMF \u30ed\u30b0\u306b\u5bfe\u3057\u3066\u3001ProcessingLatency \u3092\u30e1\u30c8\u30ea\u30af\u30b9\u3068\u3057\u3001Service \u3092\u30c7\u30a3\u30e1\u30f3\u30b7\u30e7\u30f3\u3068\u3057\u3066\u5f71\u97ff\u3092\u53d7\u3051\u305f\u30ea\u30af\u30a8\u30b9\u30c8 ID \u307e\u305f\u306f\u30c7\u30d0\u30a4\u30b9 ID \u3092\u53d6\u5f97\u3059\u308b\u4f8b\u30af\u30a8\u30ea\u3092\u3001CloudWatch Logs Insights \u306e\u30b5\u30f3\u30d7\u30eb\u30af\u30a8\u30ea\u3068\u3057\u3066\u4ee5\u4e0b\u306b\u793a\u3057\u307e\u3059\u3002"}),"\n",(0,s.jsx)(t.pre,{children:(0,s.jsx)(t.code,{className:"language-json",children:'filter ProcessingLatency < 200 and Service = "Aggregator"\n| fields @requestId, @ingestionTime, @DeviceId\n'})}),"\n",(0,s.jsx)(t.p,{children:(0,s.jsx)(t.img,{alt:"CloudWatch EMF Logs",src:n(19303).A+"",width:"1497",height:"717"})}),"\n",(0,s.jsx)(t.h2,{id:"emf-\u30ed\u30b0\u3067\u4f5c\u6210\u3055\u308c\u305f\u30e1\u30c8\u30ea\u30af\u30b9\u306b\u5bfe\u3059\u308b\u30a2\u30e9\u30fc\u30e0",children:"EMF \u30ed\u30b0\u3067\u4f5c\u6210\u3055\u308c\u305f\u30e1\u30c8\u30ea\u30af\u30b9\u306b\u5bfe\u3059\u308b\u30a2\u30e9\u30fc\u30e0"}),"\n",(0,s.jsxs)(t.p,{children:[(0,s.jsx)(t.a,{href:"https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/CloudWatch_Embedded_Metric_Format_Alarms.html",children:"EMF \u3067\u751f\u6210\u3055\u308c\u305f\u30e1\u30c8\u30ea\u30af\u30b9\u306b\u5bfe\u3059\u308b\u30a2\u30e9\u30fc\u30e0"})," \u306e\u4f5c\u6210\u306f\u3001\u4ed6\u306e\u30e1\u30c8\u30ea\u30af\u30b9\u306b\u5bfe\u3059\u308b\u30a2\u30e9\u30fc\u30e0\u306e\u4f5c\u6210\u3068\u540c\u3058\u30d1\u30bf\u30fc\u30f3\u306b\u5f93\u3044\u307e\u3059\u3002\n\u3053\u3053\u3067\u6ce8\u610f\u3059\u3079\u304d\u91cd\u8981\u306a\u70b9\u306f\u3001EMF \u30e1\u30c8\u30ea\u30af\u30b9\u306e\u751f\u6210\u304c\u30ed\u30b0\u306e\u516c\u958b\u30d5\u30ed\u30fc\u306b\u4f9d\u5b58\u3057\u3066\u3044\u308b\u3053\u3068\u3067\u3059\u3002\n\u3053\u308c\u306f\u3001CloudWatch Logs \u304c EMF \u30ed\u30b0\u3092\u51e6\u7406\u3057\u3066\u30e1\u30c8\u30ea\u30af\u30b9\u306b\u5909\u63db\u3059\u308b\u305f\u3081\u3067\u3059\u3002\n\u3057\u305f\u304c\u3063\u3066\u3001\u30a2\u30e9\u30fc\u30e0\u304c\u8a55\u4fa1\u3055\u308c\u308b\u671f\u9593\u5185\u306b\u30e1\u30c8\u30ea\u30af\u30b9\u306e\u30c7\u30fc\u30bf\u30dd\u30a4\u30f3\u30c8\u304c\u4f5c\u6210\u3055\u308c\u308b\u3088\u3046\u306b\u3001\u30bf\u30a4\u30e0\u30ea\u30fc\u306b\u30ed\u30b0\u3092\u516c\u958b\u3059\u308b\u3053\u3068\u304c\u91cd\u8981\u3067\u3059\u3002"]}),"\n",(0,s.jsx)(t.p,{children:"\u4e0a\u8a18\u3067\u8aac\u660e\u3057\u305f EMF \u30ed\u30b0\u3068\u540c\u3058\u3082\u306e\u306b\u3064\u3044\u3066\u3001ProcessingLatency \u30e1\u30c8\u30ea\u30af\u30b9\u3092\u30c7\u30fc\u30bf\u30dd\u30a4\u30f3\u30c8\u3068\u3057\u3066\u4f7f\u7528\u3057\u3001\u3057\u304d\u3044\u5024\u3092\u8a2d\u5b9a\u3057\u305f\u30a2\u30e9\u30fc\u30e0\u306e\u4f8b\u3092\u4ee5\u4e0b\u306b\u793a\u3057\u307e\u3059\u3002"}),"\n",(0,s.jsx)(t.p,{children:(0,s.jsx)(t.img,{alt:"CloudWatch EMF Alarm",src:n(37066).A+"",width:"1648",height:"960"})}),"\n",(0,s.jsx)(t.h2,{id:"emf-\u30ed\u30b0\u306e\u6700\u65b0\u6a5f\u80fd",children:"EMF \u30ed\u30b0\u306e\u6700\u65b0\u6a5f\u80fd"}),"\n",(0,s.jsxs)(t.p,{children:["\u304a\u5ba2\u69d8\u306f ",(0,s.jsx)(t.a,{href:"https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/CloudWatch_Embedded_Metric_Format_Generation_PutLogEvents.html",children:"PutLogEvents API"})," \u3092\u4f7f\u7528\u3057\u3066 EMF \u30ed\u30b0\u3092 CloudWatch Logs \u306b\u9001\u4fe1\u3067\u304d\u307e\u3059\u3002\u4ee5\u524d\u306f\u5fc5\u8981\u3060\u3063\u305f HTTP \u30d8\u30c3\u30c0\u30fc ",(0,s.jsx)(t.code,{children:"x-amzn-logs-format: json/emf"})," \u3092\u542b\u3081\u3066\u30e1\u30c8\u30ea\u30af\u30b9\u3092\u62bd\u51fa\u3059\u308b\u3088\u3046 CloudWatch Logs \u306b\u6307\u793a\u3059\u308b\u3053\u3068\u306f\u3001\u3082\u306f\u3084\u5fc5\u8981\u3042\u308a\u307e\u305b\u3093\u3002"]}),"\n",(0,s.jsxs)(t.p,{children:["Amazon CloudWatch \u306f\u3001Embedded Metric Format (EMF) \u3092\u4f7f\u7528\u3057\u305f\u69cb\u9020\u5316\u30ed\u30b0\u304b\u3089\u3001\u6700\u5927 1 \u79d2\u306e\u7c92\u5ea6\u3067",(0,s.jsx)(t.a,{href:"https://aws.amazon.com/jp/about-aws/whats-new/2023/02/amazon-cloudwatch-high-resolution-metric-extraction-structured-logs/",children:"\u9ad8\u89e3\u50cf\u5ea6\u30e1\u30c8\u30ea\u30af\u30b9\u62bd\u51fa"}),"\u3092\u30b5\u30dd\u30fc\u30c8\u3057\u3066\u3044\u307e\u3059\u3002\u304a\u5ba2\u69d8\u306f EMF \u4ed5\u69d8\u30ed\u30b0\u5185\u3067\u30aa\u30d7\u30b7\u30e7\u30f3\u306e ",(0,s.jsx)(t.a,{href:"https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/cloudwatch_concepts.html",children:"StorageResolution"})," \u30d1\u30e9\u30e1\u30fc\u30bf\u3092\u30011 \u307e\u305f\u306f 60\uff08\u30c7\u30d5\u30a9\u30eb\u30c8\uff09\u306e\u5024\u3067\u63d0\u4f9b\u3057\u3001\u30e1\u30c8\u30ea\u30af\u30b9\u306e\u5e0c\u671b\u3059\u308b\u89e3\u50cf\u5ea6\uff08\u79d2\u5358\u4f4d\uff09\u3092\u6307\u5b9a\u3067\u304d\u307e\u3059\u3002\u304a\u5ba2\u69d8\u306f EMF \u3092\u901a\u3058\u3066\u6a19\u6e96\u89e3\u50cf\u5ea6\uff0860 \u79d2\uff09\u3068\u9ad8\u89e3\u50cf\u5ea6\uff081 \u79d2\uff09\u306e\u4e21\u65b9\u306e\u30e1\u30c8\u30ea\u30af\u30b9\u3092\u516c\u958b\u3067\u304d\u3001\u30a2\u30d7\u30ea\u30b1\u30fc\u30b7\u30e7\u30f3\u306e\u5065\u5168\u6027\u3068\u30d1\u30d5\u30a9\u30fc\u30de\u30f3\u30b9\u3092\u304d\u3081\u7d30\u304b\u304f\u53ef\u8996\u5316\u3067\u304d\u307e\u3059\u3002"]}),"\n",(0,s.jsxs)(t.p,{children:["Amazon CloudWatch \u306f\u3001Embedded Metric Format (EMF) \u306e\u30a8\u30e9\u30fc\u306b\u5bfe\u3057\u3066",(0,s.jsx)(t.a,{href:"https://aws.amazon.com/jp/about-aws/whats-new/2023/01/amazon-cloudwatch-enhanced-error-visibility-embedded-metric-format-emf/",children:"\u5f37\u5316\u3055\u308c\u305f\u53ef\u8996\u6027"}),"\u3092 2 \u3064\u306e\u30a8\u30e9\u30fc\u30e1\u30c8\u30ea\u30af\u30b9\uff08",(0,s.jsx)(t.a,{href:"https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/logs/CloudWatch-Logs-Monitoring-CloudWatch-Metrics.html",children:"EMFValidationErrors \u3068 EMFParsingErrors"}),"\uff09\u3067\u63d0\u4f9b\u3057\u307e\u3059\u3002\u3053\u306e\u5f37\u5316\u3055\u308c\u305f\u53ef\u8996\u6027\u306b\u3088\u308a\u3001\u304a\u5ba2\u69d8\u306f EMF \u3092\u6d3b\u7528\u3059\u308b\u969b\u306e\u30a8\u30e9\u30fc\u3092\u8fc5\u901f\u306b\u7279\u5b9a\u3057\u3066\u4fee\u6b63\u3067\u304d\u3001\u8a08\u88c5\u30d7\u30ed\u30bb\u30b9\u304c\u7c21\u7d20\u5316\u3055\u308c\u307e\u3059\u3002"]}),"\n",(0,s.jsxs)(t.p,{children:["\u73fe\u4ee3\u306e\u30a2\u30d7\u30ea\u30b1\u30fc\u30b7\u30e7\u30f3\u7ba1\u7406\u306e\u8907\u96d1\u3055\u304c\u5897\u3059\u4e2d\u3001\u304a\u5ba2\u69d8\u306f\u30ab\u30b9\u30bf\u30e0\u30e1\u30c8\u30ea\u30af\u30b9\u306e\u5b9a\u7fa9\u3068\u5206\u6790\u306b\u304a\u3044\u3066\u3088\u308a\u67d4\u8edf\u6027\u3092\u5fc5\u8981\u3068\u3057\u3066\u3044\u307e\u3059\u3002\u305d\u306e\u305f\u3081\u3001\u30e1\u30c8\u30ea\u30af\u30b9\u30c7\u30a3\u30e1\u30f3\u30b7\u30e7\u30f3\u306e\u6700\u5927\u6570\u304c 10 \u304b\u3089 30 \u306b\u5897\u52a0\u3057\u307e\u3057\u305f\u3002\u304a\u5ba2\u69d8\u306f ",(0,s.jsx)(t.a,{href:"https://aws.amazon.com/jp/about-aws/whats-new/2022/08/amazon-cloudwatch-metrics-increases-throughput/",children:"EMF \u30ed\u30b0\u3092\u4f7f\u7528\u3057\u3066\u6700\u5927 30 \u306e\u30c7\u30a3\u30e1\u30f3\u30b7\u30e7\u30f3\u3092\u6301\u3064\u30ab\u30b9\u30bf\u30e0\u30e1\u30c8\u30ea\u30af\u30b9"}),"\u3092\u4f5c\u6210\u3067\u304d\u307e\u3059\u3002"]}),"\n",(0,s.jsx)(t.h2,{id:"\u8ffd\u52a0\u306e\u53c2\u8003\u8cc7\u6599",children:"\u8ffd\u52a0\u306e\u53c2\u8003\u8cc7\u6599:"}),"\n",(0,s.jsxs)(t.ul,{children:["\n",(0,s.jsxs)(t.li,{children:["One Observability Workshop \u306e ",(0,s.jsx)(t.a,{href:"https://catalog.workshops.aws/observability/en-US/aws-native/metrics/emf/clientlibrary",children:"AWS Lambda \u95a2\u6570\u3067\u306e Embedded Metric Format"})," \u30b5\u30f3\u30d7\u30eb (NodeJS \u30e9\u30a4\u30d6\u30e9\u30ea\u3092\u4f7f\u7528)"]}),"\n",(0,s.jsxs)(t.li,{children:["Serverless Observability Workshop \u306e ",(0,s.jsx)(t.a,{href:"https://serverless-observability.workshop.aws/en/030_cloudwatch/async_metrics_emf.html",children:"Embedded Metrics Format (EMF) \u3092\u4f7f\u7528\u3057\u305f\u975e\u540c\u671f\u30e1\u30c8\u30ea\u30af\u30b9"})]}),"\n",(0,s.jsxs)(t.li,{children:[(0,s.jsx)(t.a,{href:"https://catalog.workshops.aws/observability/en-US/aws-native/metrics/emf/putlogevents",children:"PutLogEvents API \u3092\u4f7f\u7528\u3057\u305f Java \u30b3\u30fc\u30c9\u30b5\u30f3\u30d7\u30eb"})," (EMF \u30ed\u30b0\u3092 CloudWatch Logs \u306b\u9001\u4fe1)"]}),"\n",(0,s.jsxs)(t.li,{children:["\u30d6\u30ed\u30b0\u8a18\u4e8b: ",(0,s.jsx)(t.a,{href:"https://aws.amazon.com/blogs/mt/lowering-costs-and-focusing-on-our-customers-with-amazon-cloudwatch-embedded-custom-metrics/",children:"Amazon CloudWatch \u306e\u57cb\u3081\u8fbc\u307f\u30ab\u30b9\u30bf\u30e0\u30e1\u30c8\u30ea\u30af\u30b9\u306b\u3088\u308b\u30b3\u30b9\u30c8\u524a\u6e1b\u3068\u9867\u5ba2\u91cd\u8996"})]}),"\n"]})]})}function h(e={}){const{wrapper:t}={...(0,a.R)(),...e.components};return t?(0,s.jsx)(t,{...e,children:(0,s.jsx)(l,{...e})}):l(e)}},37066:(e,t,n)=>{n.d(t,{A:()=>s});const s=n.p+"assets/images/EMF-Alarm-ce48a40336b1ea8336cb1bf87216ffa2.png"},2137:(e,t,n)=>{n.d(t,{A:()=>s});const s=n.p+"assets/images/EMF-Arch-46358de68242627eb3772fd87fbeb613.png"},19303:(e,t,n)=>{n.d(t,{A:()=>s});const s=n.p+"assets/images/emf_extracted_CWLogs-0648411bca1c6b317395e9fe7229df7a.png"},61521:(e,t,n)=>{n.d(t,{A:()=>s});const s=n.p+"assets/images/emf_extracted_metrics-e58bd40dc8c6711406164f696972172e.png"},28453:(e,t,n)=>{n.d(t,{R:()=>c,x:()=>i});var s=n(96540);const a={},o=s.createContext(a);function c(e){const t=s.useContext(o);return s.useMemo((function(){return"function"==typeof e?e(t):{...t,...e}}),[t,e])}function i(e){let t;return t=e.disableParentContext?"function"==typeof e.components?e.components(a):e.components||a:c(e.components),s.createElement(o.Provider,{value:t},e.children)}}}]);
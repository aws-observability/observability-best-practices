"use strict";(self.webpackChunkobservability_best_practices=self.webpackChunkobservability_best_practices||[]).push([[955],{33299:(e,a,s)=>{s.r(a),s.d(a,{assets:()=>d,contentTitle:()=>t,default:()=>h,frontMatter:()=>i,metadata:()=>c,toc:()=>l});var r=s(74848),n=s(28453);const i={},t="AWS \u306b\u304a\u3051\u308b Databricks \u306e\u30e2\u30cb\u30bf\u30ea\u30f3\u30b0\u3068\u30aa\u30d6\u30b6\u30fc\u30d0\u30d3\u30ea\u30c6\u30a3\u306e\u30d9\u30b9\u30c8\u30d7\u30e9\u30af\u30c6\u30a3\u30b9",c={id:"guides/partners/databricks",title:"AWS \u306b\u304a\u3051\u308b Databricks \u306e\u30e2\u30cb\u30bf\u30ea\u30f3\u30b0\u3068\u30aa\u30d6\u30b6\u30fc\u30d0\u30d3\u30ea\u30c6\u30a3\u306e\u30d9\u30b9\u30c8\u30d7\u30e9\u30af\u30c6\u30a3\u30b9",description:"Databricks \u306f\u3001\u30c7\u30fc\u30bf\u5206\u6790\u3084 AI/ML \u30ef\u30fc\u30af\u30ed\u30fc\u30c9\u3092\u7ba1\u7406\u3059\u308b\u305f\u3081\u306e\u30d7\u30e9\u30c3\u30c8\u30d5\u30a9\u30fc\u30e0\u3067\u3059\u3002\u3053\u306e\u30ac\u30a4\u30c9\u306f\u3001AWS \u4e0a\u306e Databricks \u3092\u5b9f\u884c\u3057\u3066\u3044\u308b\u304a\u5ba2\u69d8\u3092\u5bfe\u8c61\u306b\u3001AWS \u30cd\u30a4\u30c6\u30a3\u30d6\u306e\u30aa\u30d6\u30b6\u30fc\u30d0\u30d3\u30ea\u30c6\u30a3\u30b5\u30fc\u30d3\u30b9\u3084\u30aa\u30fc\u30d7\u30f3\u30bd\u30fc\u30b9\u306e\u30de\u30cd\u30fc\u30b8\u30c9\u30b5\u30fc\u30d3\u30b9\u3092\u4f7f\u7528\u3057\u3066\u3053\u308c\u3089\u306e\u30ef\u30fc\u30af\u30ed\u30fc\u30c9\u3092\u30e2\u30cb\u30bf\u30ea\u30f3\u30b0\u3059\u308b\u65b9\u6cd5\u3092\u30b5\u30dd\u30fc\u30c8\u3059\u308b\u3053\u3068\u3092\u76ee\u7684\u3068\u3057\u3066\u3044\u307e\u3059\u3002",source:"@site/i18n/ja/docusaurus-plugin-content-docs/current/guides/partners/databricks.md",sourceDirName:"guides/partners",slug:"/guides/partners/databricks",permalink:"/observability-best-practices/ja/guides/partners/databricks",draft:!1,unlisted:!1,editUrl:"https://github.com/aws-observability/observability-best-practices/blob/main/docusaurus/docs/guides/partners/databricks.md",tags:[],version:"current",frontMatter:{},sidebar:"guides",previous:{title:"CloudWatch \u57cb\u3081\u8fbc\u307f\u30e1\u30c8\u30ea\u30af\u30b9\u30d5\u30a9\u30fc\u30de\u30c3\u30c8",permalink:"/observability-best-practices/ja/guides/signal-collection/emf"},next:{title:"Amazon RDS \u3068 Aurora \u30c7\u30fc\u30bf\u30d9\u30fc\u30b9\u306e\u30e2\u30cb\u30bf\u30ea\u30f3\u30b0",permalink:"/observability-best-practices/ja/guides/databases/rds-and-aurora"}},d={},l=[{value:"Databricks \u3092\u30e2\u30cb\u30bf\u30ea\u30f3\u30b0\u3059\u308b\u7406\u7531",id:"databricks-\u3092\u30e2\u30cb\u30bf\u30ea\u30f3\u30b0\u3059\u308b\u7406\u7531",level:2},{value:"\u76e3\u8996\u3059\u3079\u304d\u9805\u76ee",id:"\u76e3\u8996\u3059\u3079\u304d\u9805\u76ee",level:2},{value:"\u30e2\u30cb\u30bf\u30ea\u30f3\u30b0\u65b9\u6cd5",id:"\u30e2\u30cb\u30bf\u30ea\u30f3\u30b0\u65b9\u6cd5",level:2},{value:"Databricks \u306e\u512a\u308c\u305f\u30aa\u30d6\u30b6\u30fc\u30d0\u30d3\u30ea\u30c6\u30a3\u30bd\u30ea\u30e5\u30fc\u30b7\u30e7\u30f3\u306e\u4e3b\u8981\u306a\u8981\u7d20",id:"databricks-\u306e\u512a\u308c\u305f\u30aa\u30d6\u30b6\u30fc\u30d0\u30d3\u30ea\u30c6\u30a3\u30bd\u30ea\u30e5\u30fc\u30b7\u30e7\u30f3\u306e\u4e3b\u8981\u306a\u8981\u7d20",level:2},{value:"AWS \u30cd\u30a4\u30c6\u30a3\u30d6\u306e\u30aa\u30d6\u30b6\u30fc\u30d0\u30d3\u30ea\u30c6\u30a3\u30aa\u30d7\u30b7\u30e7\u30f3",id:"aws-\u30cd\u30a4\u30c6\u30a3\u30d6\u306e\u30aa\u30d6\u30b6\u30fc\u30d0\u30d3\u30ea\u30c6\u30a3\u30aa\u30d7\u30b7\u30e7\u30f3",level:2},{value:"\u30aa\u30fc\u30d7\u30f3\u30bd\u30fc\u30b9\u30bd\u30d5\u30c8\u30a6\u30a7\u30a2\u306e\u30aa\u30d6\u30b6\u30fc\u30d0\u30d3\u30ea\u30c6\u30a3\u30aa\u30d7\u30b7\u30e7\u30f3",id:"\u30aa\u30fc\u30d7\u30f3\u30bd\u30fc\u30b9\u30bd\u30d5\u30c8\u30a6\u30a7\u30a2\u306e\u30aa\u30d6\u30b6\u30fc\u30d0\u30d3\u30ea\u30c6\u30a3\u30aa\u30d7\u30b7\u30e7\u30f3",level:2},{value:"\u30e6\u30fc\u30b9\u30b1\u30fc\u30b9",id:"\u30e6\u30fc\u30b9\u30b1\u30fc\u30b9",level:3},{value:"\u30d9\u30b9\u30c8\u30d7\u30e9\u30af\u30c6\u30a3\u30b9",id:"\u30d9\u30b9\u30c8\u30d7\u30e9\u30af\u30c6\u30a3\u30b9",level:2},{value:"\u4fa1\u5024\u306e\u3042\u308b\u30e1\u30c8\u30ea\u30af\u30b9\u3092\u512a\u5148\u3059\u308b",id:"\u4fa1\u5024\u306e\u3042\u308b\u30e1\u30c8\u30ea\u30af\u30b9\u3092\u512a\u5148\u3059\u308b",level:3},{value:"\u30a2\u30e9\u30fc\u30c8\u75b2\u308c\u3092\u907f\u3051\u308b",id:"\u30a2\u30e9\u30fc\u30c8\u75b2\u308c\u3092\u907f\u3051\u308b",level:3},{value:"Amazon Managed Grafana \u30c0\u30c3\u30b7\u30e5\u30dc\u30fc\u30c9\u306e\u518d\u5229\u7528",id:"amazon-managed-grafana-\u30c0\u30c3\u30b7\u30e5\u30dc\u30fc\u30c9\u306e\u518d\u5229\u7528",level:3},{value:"\u53c2\u8003\u8cc7\u6599\u3068\u8a73\u7d30\u60c5\u5831",id:"\u53c2\u8003\u8cc7\u6599\u3068\u8a73\u7d30\u60c5\u5831",level:2}];function o(e){const a={a:"a",code:"code",em:"em",h1:"h1",h2:"h2",h3:"h3",img:"img",li:"li",p:"p",strong:"strong",ul:"ul",...(0,n.R)(),...e.components};return(0,r.jsxs)(r.Fragment,{children:[(0,r.jsx)(a.h1,{id:"aws-\u306b\u304a\u3051\u308b-databricks-\u306e\u30e2\u30cb\u30bf\u30ea\u30f3\u30b0\u3068\u30aa\u30d6\u30b6\u30fc\u30d0\u30d3\u30ea\u30c6\u30a3\u306e\u30d9\u30b9\u30c8\u30d7\u30e9\u30af\u30c6\u30a3\u30b9",children:"AWS \u306b\u304a\u3051\u308b Databricks \u306e\u30e2\u30cb\u30bf\u30ea\u30f3\u30b0\u3068\u30aa\u30d6\u30b6\u30fc\u30d0\u30d3\u30ea\u30c6\u30a3\u306e\u30d9\u30b9\u30c8\u30d7\u30e9\u30af\u30c6\u30a3\u30b9"}),"\n",(0,r.jsxs)(a.p,{children:["Databricks \u306f\u3001\u30c7\u30fc\u30bf\u5206\u6790\u3084 AI/ML \u30ef\u30fc\u30af\u30ed\u30fc\u30c9\u3092\u7ba1\u7406\u3059\u308b\u305f\u3081\u306e\u30d7\u30e9\u30c3\u30c8\u30d5\u30a9\u30fc\u30e0\u3067\u3059\u3002\u3053\u306e\u30ac\u30a4\u30c9\u306f\u3001",(0,r.jsx)(a.a,{href:"https://aws.amazon.com/jp/solutions/partners/databricks/",children:"AWS \u4e0a\u306e Databricks"})," \u3092\u5b9f\u884c\u3057\u3066\u3044\u308b\u304a\u5ba2\u69d8\u3092\u5bfe\u8c61\u306b\u3001AWS \u30cd\u30a4\u30c6\u30a3\u30d6\u306e\u30aa\u30d6\u30b6\u30fc\u30d0\u30d3\u30ea\u30c6\u30a3\u30b5\u30fc\u30d3\u30b9\u3084\u30aa\u30fc\u30d7\u30f3\u30bd\u30fc\u30b9\u306e\u30de\u30cd\u30fc\u30b8\u30c9\u30b5\u30fc\u30d3\u30b9\u3092\u4f7f\u7528\u3057\u3066\u3053\u308c\u3089\u306e\u30ef\u30fc\u30af\u30ed\u30fc\u30c9\u3092\u30e2\u30cb\u30bf\u30ea\u30f3\u30b0\u3059\u308b\u65b9\u6cd5\u3092\u30b5\u30dd\u30fc\u30c8\u3059\u308b\u3053\u3068\u3092\u76ee\u7684\u3068\u3057\u3066\u3044\u307e\u3059\u3002"]}),"\n",(0,r.jsx)(a.h2,{id:"databricks-\u3092\u30e2\u30cb\u30bf\u30ea\u30f3\u30b0\u3059\u308b\u7406\u7531",children:"Databricks \u3092\u30e2\u30cb\u30bf\u30ea\u30f3\u30b0\u3059\u308b\u7406\u7531"}),"\n",(0,r.jsx)(a.p,{children:"Databricks \u30af\u30e9\u30b9\u30bf\u30fc\u3092\u7ba1\u7406\u3059\u308b\u904b\u7528\u30c1\u30fc\u30e0\u306f\u3001\u7d71\u5408\u3055\u308c\u305f\u30ab\u30b9\u30bf\u30de\u30a4\u30ba\u53ef\u80fd\u306a\u30c0\u30c3\u30b7\u30e5\u30dc\u30fc\u30c9\u3092\u5229\u7528\u3059\u308b\u3053\u3068\u3067\u3001\u4ee5\u4e0b\u306e\u3088\u3046\u306a\u5229\u70b9\u3092\u5f97\u3089\u308c\u307e\u3059\uff1a"}),"\n",(0,r.jsxs)(a.ul,{children:["\n",(0,r.jsx)(a.li,{children:"\u30ef\u30fc\u30af\u30ed\u30fc\u30c9\u306e\u30b9\u30c6\u30fc\u30bf\u30b9\u3001\u30a8\u30e9\u30fc\u3001\u30d1\u30d5\u30a9\u30fc\u30de\u30f3\u30b9\u306e\u30dc\u30c8\u30eb\u30cd\u30c3\u30af\u3092\u8ffd\u8de1\u3067\u304d\u308b"}),"\n",(0,r.jsx)(a.li,{children:"\u6642\u9593\u7d4c\u904e\u306b\u4f34\u3046\u7dcf\u30ea\u30bd\u30fc\u30b9\u4f7f\u7528\u91cf\u3084\u3001\u30a8\u30e9\u30fc\u306e\u5272\u5408\u306a\u3069\u3001\u671b\u307e\u3057\u304f\u306a\u3044\u52d5\u4f5c\u306b\u5bfe\u3057\u3066\u30a2\u30e9\u30fc\u30c8\u3092\u8a2d\u5b9a\u3067\u304d\u308b"}),"\n",(0,r.jsx)(a.li,{children:"\u6839\u672c\u539f\u56e0\u5206\u6790\u3084\u8ffd\u52a0\u306e\u30ab\u30b9\u30bf\u30e0\u30e1\u30c8\u30ea\u30af\u30b9\u306e\u62bd\u51fa\u306e\u305f\u3081\u306b\u3001\u30ed\u30b0\u3092\u4e00\u5143\u5316\u3067\u304d\u308b"}),"\n"]}),"\n",(0,r.jsx)(a.h2,{id:"\u76e3\u8996\u3059\u3079\u304d\u9805\u76ee",children:"\u76e3\u8996\u3059\u3079\u304d\u9805\u76ee"}),"\n",(0,r.jsx)(a.p,{children:"Databricks \u306f\u3001\u30af\u30e9\u30b9\u30bf\u30fc\u30a4\u30f3\u30b9\u30bf\u30f3\u30b9\u3067 Apache Spark \u3092\u5b9f\u884c\u3057\u3066\u304a\u308a\u3001\u3053\u308c\u306b\u306f\u30e1\u30c8\u30ea\u30af\u30b9\u3092\u516c\u958b\u3059\u308b\u30cd\u30a4\u30c6\u30a3\u30d6\u6a5f\u80fd\u304c\u3042\u308a\u307e\u3059\u3002\u3053\u308c\u3089\u306e\u30e1\u30c8\u30ea\u30af\u30b9\u306f\u3001\u30c9\u30e9\u30a4\u30d0\u30fc\u3001\u30ef\u30fc\u30ab\u30fc\u3001\u304a\u3088\u3073\u30af\u30e9\u30b9\u30bf\u30fc\u3067\u5b9f\u884c\u3055\u308c\u3066\u3044\u308b\u30ef\u30fc\u30af\u30ed\u30fc\u30c9\u306b\u95a2\u3059\u308b\u60c5\u5831\u3092\u63d0\u4f9b\u3057\u307e\u3059\u3002"}),"\n",(0,r.jsx)(a.p,{children:"Spark \u3092\u5b9f\u884c\u3057\u3066\u3044\u308b\u30a4\u30f3\u30b9\u30bf\u30f3\u30b9\u306b\u306f\u3001\u30b9\u30c8\u30ec\u30fc\u30b8\u3001CPU\u3001\u30e1\u30e2\u30ea\u3001\u30cd\u30c3\u30c8\u30ef\u30fc\u30ad\u30f3\u30b0\u306b\u95a2\u3059\u308b\u8ffd\u52a0\u306e\u6709\u7528\u306a\u60c5\u5831\u304c\u3042\u308a\u307e\u3059\u3002Databricks \u30af\u30e9\u30b9\u30bf\u30fc\u306e\u30d1\u30d5\u30a9\u30fc\u30de\u30f3\u30b9\u306b\u5f71\u97ff\u3092\u4e0e\u3048\u308b\u53ef\u80fd\u6027\u306e\u3042\u308b\u5916\u90e8\u8981\u56e0\u3092\u7406\u89e3\u3059\u308b\u3053\u3068\u304c\u91cd\u8981\u3067\u3059\u3002\u591a\u6570\u306e\u30a4\u30f3\u30b9\u30bf\u30f3\u30b9\u3092\u6301\u3064\u30af\u30e9\u30b9\u30bf\u30fc\u306e\u5834\u5408\u3001\u30dc\u30c8\u30eb\u30cd\u30c3\u30af\u3068\u5168\u4f53\u7684\u306a\u5065\u5168\u6027\u3092\u7406\u89e3\u3059\u308b\u3053\u3068\u3082\u540c\u69d8\u306b\u91cd\u8981\u3067\u3059\u3002"}),"\n",(0,r.jsx)(a.h2,{id:"\u30e2\u30cb\u30bf\u30ea\u30f3\u30b0\u65b9\u6cd5",children:"\u30e2\u30cb\u30bf\u30ea\u30f3\u30b0\u65b9\u6cd5"}),"\n",(0,r.jsx)(a.p,{children:"\u30b3\u30ec\u30af\u30bf\u30fc\u3068\u305d\u306e\u4f9d\u5b58\u95a2\u4fc2\u3092\u30a4\u30f3\u30b9\u30c8\u30fc\u30eb\u3059\u308b\u306b\u306f\u3001Databricks \u306e\u521d\u671f\u5316\u30b9\u30af\u30ea\u30d7\u30c8\u304c\u5fc5\u8981\u3067\u3059\u3002\u3053\u308c\u3089\u306e\u30b9\u30af\u30ea\u30d7\u30c8\u306f\u3001Databricks \u30af\u30e9\u30b9\u30bf\u30fc\u306e\u5404\u30a4\u30f3\u30b9\u30bf\u30f3\u30b9\u3067\u8d77\u52d5\u6642\u306b\u5b9f\u884c\u3055\u308c\u307e\u3059\u3002"}),"\n",(0,r.jsx)(a.p,{children:"\u307e\u305f\u3001Databricks \u30af\u30e9\u30b9\u30bf\u30fc\u306e\u6a29\u9650\u306b\u306f\u3001\u30a4\u30f3\u30b9\u30bf\u30f3\u30b9\u30d7\u30ed\u30d5\u30a1\u30a4\u30eb\u3092\u4f7f\u7528\u3057\u3066\u30e1\u30c8\u30ea\u30af\u30b9\u3068\u30ed\u30b0\u3092\u9001\u4fe1\u3059\u308b\u6a29\u9650\u3082\u5fc5\u8981\u3067\u3059\u3002"}),"\n",(0,r.jsxs)(a.p,{children:["\u6700\u5f8c\u306b\u3001Databricks \u30af\u30e9\u30b9\u30bf\u30fc\u306e Spark \u8a2d\u5b9a\u3067\u30e1\u30c8\u30ea\u30af\u30b9\u540d\u524d\u7a7a\u9593\u3092\u8a2d\u5b9a\u3059\u308b\u3053\u3068\u304c\u30d9\u30b9\u30c8\u30d7\u30e9\u30af\u30c6\u30a3\u30b9\u3067\u3059\u3002\u305d\u306e\u969b\u3001",(0,r.jsx)(a.code,{children:"testApp"})," \u3092\u30af\u30e9\u30b9\u30bf\u30fc\u306e\u9069\u5207\u306a\u53c2\u7167\u306b\u7f6e\u304d\u63db\u3048\u3066\u304f\u3060\u3055\u3044\u3002"]}),"\n",(0,r.jsxs)(a.p,{children:[(0,r.jsx)(a.img,{alt:"Databricks Spark Config",src:s(96208).A+"",width:"1422",height:"1274"}),"\n",(0,r.jsx)(a.em,{children:"\u56f3 1: \u30e1\u30c8\u30ea\u30af\u30b9\u540d\u524d\u7a7a\u9593\u306e Spark \u8a2d\u5b9a\u4f8b"})]}),"\n",(0,r.jsx)(a.h2,{id:"databricks-\u306e\u512a\u308c\u305f\u30aa\u30d6\u30b6\u30fc\u30d0\u30d3\u30ea\u30c6\u30a3\u30bd\u30ea\u30e5\u30fc\u30b7\u30e7\u30f3\u306e\u4e3b\u8981\u306a\u8981\u7d20",children:"Databricks \u306e\u512a\u308c\u305f\u30aa\u30d6\u30b6\u30fc\u30d0\u30d3\u30ea\u30c6\u30a3\u30bd\u30ea\u30e5\u30fc\u30b7\u30e7\u30f3\u306e\u4e3b\u8981\u306a\u8981\u7d20"}),"\n",(0,r.jsxs)(a.p,{children:[(0,r.jsx)(a.strong,{children:"1) \u30e1\u30c8\u30ea\u30af\u30b9:"})," \u30e1\u30c8\u30ea\u30af\u30b9\u306f\u3001\u4e00\u5b9a\u671f\u9593\u306b\u308f\u305f\u3063\u3066\u6e2c\u5b9a\u3055\u308c\u305f\u30a2\u30af\u30c6\u30a3\u30d3\u30c6\u30a3\u3084\u7279\u5b9a\u306e\u30d7\u30ed\u30bb\u30b9\u3092\u8868\u3059\u6570\u5024\u3067\u3059\u3002Databricks \u306b\u306f\u4ee5\u4e0b\u306e\u3088\u3046\u306a\u7a2e\u985e\u306e\u30e1\u30c8\u30ea\u30af\u30b9\u304c\u3042\u308a\u307e\u3059\uff1a"]}),"\n",(0,r.jsx)(a.p,{children:"CPU\u3001\u30e1\u30e2\u30ea\u3001\u30c7\u30a3\u30b9\u30af\u3001\u30cd\u30c3\u30c8\u30ef\u30fc\u30af\u306a\u3069\u306e\u30b7\u30b9\u30c6\u30e0\u30ea\u30bd\u30fc\u30b9\u30ec\u30d9\u30eb\u306e\u30e1\u30c8\u30ea\u30af\u30b9\u3002\n\u30ab\u30b9\u30bf\u30e0\u30e1\u30c8\u30ea\u30af\u30b9\u30bd\u30fc\u30b9\u3001StreamingQueryListener\u3001QueryExecutionListener \u3092\u4f7f\u7528\u3057\u305f\u30a2\u30d7\u30ea\u30b1\u30fc\u30b7\u30e7\u30f3\u30e1\u30c8\u30ea\u30af\u30b9\u3002\nMetricsSystem \u306b\u3088\u3063\u3066\u516c\u958b\u3055\u308c\u308b Spark \u30e1\u30c8\u30ea\u30af\u30b9\u3002"}),"\n",(0,r.jsxs)(a.p,{children:[(0,r.jsx)(a.strong,{children:"2) \u30ed\u30b0:"})," \u30ed\u30b0\u306f\u767a\u751f\u3057\u305f\u4e00\u9023\u306e\u30a4\u30d9\u30f3\u30c8\u3092\u8868\u73fe\u3057\u3001\u305d\u308c\u3089\u306b\u3064\u3044\u3066\u7dda\u5f62\u7684\u306a\u30b9\u30c8\u30fc\u30ea\u30fc\u3092\u8a9e\u308a\u307e\u3059\u3002Databricks \u306b\u306f\u4ee5\u4e0b\u306e\u3088\u3046\u306a\u7a2e\u985e\u306e\u30ed\u30b0\u304c\u3042\u308a\u307e\u3059\uff1a"]}),"\n",(0,r.jsxs)(a.ul,{children:["\n",(0,r.jsx)(a.li,{children:"\u30a4\u30d9\u30f3\u30c8\u30ed\u30b0"}),"\n",(0,r.jsx)(a.li,{children:"\u76e3\u67fb\u30ed\u30b0"}),"\n",(0,r.jsx)(a.li,{children:"\u30c9\u30e9\u30a4\u30d0\u30fc\u30ed\u30b0\uff1astdout\u3001stderr\u3001log4j \u30ab\u30b9\u30bf\u30e0\u30ed\u30b0\uff08\u69cb\u9020\u5316\u30ed\u30b0\u3092\u6709\u52b9\u5316\uff09"}),"\n",(0,r.jsx)(a.li,{children:"\u30a8\u30b0\u30bc\u30ad\u30e5\u30fc\u30bf\u30fc\u30ed\u30b0\uff1astdout\u3001stderr\u3001log4j \u30ab\u30b9\u30bf\u30e0\u30ed\u30b0\uff08\u69cb\u9020\u5316\u30ed\u30b0\u3092\u6709\u52b9\u5316\uff09"}),"\n"]}),"\n",(0,r.jsxs)(a.p,{children:[(0,r.jsx)(a.strong,{children:"3) \u30c8\u30ec\u30fc\u30b9:"})," \u30b9\u30bf\u30c3\u30af\u30c8\u30ec\u30fc\u30b9\u306f\u30a8\u30f3\u30c9\u30fb\u30c4\u30fc\u30fb\u30a8\u30f3\u30c9\u306e\u53ef\u8996\u6027\u3092\u63d0\u4f9b\u3057\u3001\u30b9\u30c6\u30fc\u30b8\u5168\u4f53\u306e\u6d41\u308c\u3092\u793a\u3057\u307e\u3059\u3002\u3053\u308c\u306f\u3001\u30a8\u30e9\u30fc\u3084\u30d1\u30d5\u30a9\u30fc\u30de\u30f3\u30b9\u306e\u554f\u984c\u3092\u5f15\u304d\u8d77\u3053\u3059\u30b9\u30c6\u30fc\u30b8\u3084\u30b3\u30fc\u30c9\u3092\u7279\u5b9a\u3059\u308b\u305f\u3081\u306e\u30c7\u30d0\u30c3\u30b0\u304c\u5fc5\u8981\u306a\u5834\u5408\u306b\u5f79\u7acb\u3061\u307e\u3059\u3002"]}),"\n",(0,r.jsxs)(a.p,{children:[(0,r.jsx)(a.strong,{children:"4) \u30c0\u30c3\u30b7\u30e5\u30dc\u30fc\u30c9:"})," \u30c0\u30c3\u30b7\u30e5\u30dc\u30fc\u30c9\u306f\u3001\u30a2\u30d7\u30ea\u30b1\u30fc\u30b7\u30e7\u30f3\u3084\u30b5\u30fc\u30d3\u30b9\u306e\u30b4\u30fc\u30eb\u30c7\u30f3\u30e1\u30c8\u30ea\u30af\u30b9\u306e\u512a\u308c\u305f\u6982\u8981\u30d3\u30e5\u30fc\u3092\u63d0\u4f9b\u3057\u307e\u3059\u3002"]}),"\n",(0,r.jsxs)(a.p,{children:[(0,r.jsx)(a.strong,{children:"5) \u30a2\u30e9\u30fc\u30c8:"})," \u30a2\u30e9\u30fc\u30c8\u306f\u3001\u6ce8\u610f\u304c\u5fc5\u8981\u306a\u72b6\u6cc1\u306b\u3064\u3044\u3066\u30a8\u30f3\u30b8\u30cb\u30a2\u306b\u901a\u77e5\u3057\u307e\u3059\u3002"]}),"\n",(0,r.jsx)(a.h2,{id:"aws-\u30cd\u30a4\u30c6\u30a3\u30d6\u306e\u30aa\u30d6\u30b6\u30fc\u30d0\u30d3\u30ea\u30c6\u30a3\u30aa\u30d7\u30b7\u30e7\u30f3",children:"AWS \u30cd\u30a4\u30c6\u30a3\u30d6\u306e\u30aa\u30d6\u30b6\u30fc\u30d0\u30d3\u30ea\u30c6\u30a3\u30aa\u30d7\u30b7\u30e7\u30f3"}),"\n",(0,r.jsx)(a.p,{children:"Ganglia UI \u3084 Log Delivery \u306a\u3069\u306e\u30cd\u30a4\u30c6\u30a3\u30d6\u30bd\u30ea\u30e5\u30fc\u30b7\u30e7\u30f3\u306f\u3001\u30b7\u30b9\u30c6\u30e0\u30e1\u30c8\u30ea\u30af\u30b9\u306e\u53ce\u96c6\u3084 Apache Spark\u2122 \u30e1\u30c8\u30ea\u30af\u30b9\u306e\u30af\u30a8\u30ea\u306b\u512a\u308c\u305f\u30bd\u30ea\u30e5\u30fc\u30b7\u30e7\u30f3\u3067\u3059\u3002\u3057\u304b\u3057\u3001\u3044\u304f\u3064\u304b\u306e\u6539\u5584\u70b9\u304c\u3042\u308a\u307e\u3059\uff1a"}),"\n",(0,r.jsxs)(a.ul,{children:["\n",(0,r.jsx)(a.li,{children:"Ganglia \u306f\u30a2\u30e9\u30fc\u30c8\u3092\u30b5\u30dd\u30fc\u30c8\u3057\u3066\u3044\u307e\u305b\u3093\u3002"}),"\n",(0,r.jsx)(a.li,{children:"Ganglia \u306f\u30ed\u30b0\u304b\u3089\u6d3e\u751f\u3057\u305f\u30e1\u30c8\u30ea\u30af\u30b9\uff08\u4f8b\uff1aERROR \u30ed\u30b0\u306e\u5897\u52a0\u7387\uff09\u306e\u4f5c\u6210\u3092\u30b5\u30dd\u30fc\u30c8\u3057\u3066\u3044\u307e\u305b\u3093\u3002"}),"\n",(0,r.jsx)(a.li,{children:"\u30c7\u30fc\u30bf\u306e\u6b63\u78ba\u6027\u3001\u30c7\u30fc\u30bf\u306e\u9bae\u5ea6\u3001\u307e\u305f\u306f\u30a8\u30f3\u30c9\u30c4\u30fc\u30a8\u30f3\u30c9\u306e\u30ec\u30a4\u30c6\u30f3\u30b7\u30fc\u306b\u95a2\u9023\u3059\u308b SLO\uff08Service Level Objectives\uff09\u3068 SLI\uff08Service Level Indicators\uff09\u3092\u8ffd\u8de1\u3057\u3001\u305d\u308c\u3089\u3092 Ganglia \u3067\u53ef\u8996\u5316\u3059\u308b\u305f\u3081\u306e\u30ab\u30b9\u30bf\u30e0\u30c0\u30c3\u30b7\u30e5\u30dc\u30fc\u30c9\u3092\u4f7f\u7528\u3067\u304d\u307e\u305b\u3093\u3002"}),"\n"]}),"\n",(0,r.jsxs)(a.p,{children:[(0,r.jsx)(a.a,{href:"https://aws.amazon.com/jp/cloudwatch/",children:"Amazon CloudWatch"})," \u306f\u3001AWS \u4e0a\u306e Databricks \u30af\u30e9\u30b9\u30bf\u30fc\u3092\u76e3\u8996\u304a\u3088\u3073\u7ba1\u7406\u3059\u308b\u305f\u3081\u306e\u91cd\u8981\u306a\u30c4\u30fc\u30eb\u3067\u3059\u3002\u30af\u30e9\u30b9\u30bf\u30fc\u306e\u30d1\u30d5\u30a9\u30fc\u30de\u30f3\u30b9\u306b\u95a2\u3059\u308b\u8cb4\u91cd\u306a\u6d1e\u5bdf\u3092\u63d0\u4f9b\u3057\u3001\u554f\u984c\u3092\u8fc5\u901f\u306b\u7279\u5b9a\u3057\u3066\u89e3\u6c7a\u3059\u308b\u306e\u306b\u5f79\u7acb\u3061\u307e\u3059\u3002Databricks \u3068 CloudWatch \u3092\u7d71\u5408\u3057\u3001\u69cb\u9020\u5316\u30ed\u30b0\u3092\u6709\u52b9\u306b\u3059\u308b\u3053\u3068\u3067\u3001\u3053\u308c\u3089\u306e\u9818\u57df\u3092\u6539\u5584\u3067\u304d\u307e\u3059\u3002CloudWatch Application Insights \u306f\u3001\u30ed\u30b0\u306b\u542b\u307e\u308c\u308b\u30d5\u30a3\u30fc\u30eb\u30c9\u3092\u81ea\u52d5\u7684\u306b\u767a\u898b\u3059\u308b\u306e\u306b\u5f79\u7acb\u3061\u3001CloudWatch Logs Insights \u306f\u3001\u3088\u308a\u8fc5\u901f\u306a\u30c7\u30d0\u30c3\u30b0\u3068\u5206\u6790\u306e\u305f\u3081\u306e\u76ee\u7684\u306b\u7279\u5316\u3057\u305f\u30af\u30a8\u30ea\u8a00\u8a9e\u3092\u63d0\u4f9b\u3057\u307e\u3059\u3002"]}),"\n",(0,r.jsxs)(a.p,{children:[(0,r.jsx)(a.img,{alt:"Databricks With CloudWatch",src:s(83458).A+"",width:"1540",height:"800"}),"\n",(0,r.jsx)(a.em,{children:"\u56f3 2\uff1aDatabricks CloudWatch \u30a2\u30fc\u30ad\u30c6\u30af\u30c1\u30e3"})]}),"\n",(0,r.jsxs)(a.p,{children:["CloudWatch \u3092\u4f7f\u7528\u3057\u3066 Databricks \u3092\u76e3\u8996\u3059\u308b\u65b9\u6cd5\u306e\u8a73\u7d30\u306b\u3064\u3044\u3066\u306f\u3001\u4ee5\u4e0b\u3092\u53c2\u7167\u3057\u3066\u304f\u3060\u3055\u3044\uff1a\n",(0,r.jsx)(a.a,{href:"https://aws.amazon.com/blogs/mt/how-to-monitor-databricks-with-amazon-cloudwatch/",children:"Amazon CloudWatch \u3092\u4f7f\u7528\u3057\u3066 Databricks \u3092\u76e3\u8996\u3059\u308b\u65b9\u6cd5"})]}),"\n",(0,r.jsx)(a.h2,{id:"\u30aa\u30fc\u30d7\u30f3\u30bd\u30fc\u30b9\u30bd\u30d5\u30c8\u30a6\u30a7\u30a2\u306e\u30aa\u30d6\u30b6\u30fc\u30d0\u30d3\u30ea\u30c6\u30a3\u30aa\u30d7\u30b7\u30e7\u30f3",children:"\u30aa\u30fc\u30d7\u30f3\u30bd\u30fc\u30b9\u30bd\u30d5\u30c8\u30a6\u30a7\u30a2\u306e\u30aa\u30d6\u30b6\u30fc\u30d0\u30d3\u30ea\u30c6\u30a3\u30aa\u30d7\u30b7\u30e7\u30f3"}),"\n",(0,r.jsxs)(a.p,{children:[(0,r.jsx)(a.a,{href:"https://aws.amazon.com/jp/prometheus/",children:"Amazon Managed Service for Prometheus"})," \u306f\u3001Prometheus \u4e92\u63db\u306e\u30e2\u30cb\u30bf\u30ea\u30f3\u30b0\u3092\u63d0\u4f9b\u3059\u308b\u30de\u30cd\u30fc\u30b8\u30c9\u578b\u306e\u30b5\u30fc\u30d0\u30fc\u30ec\u30b9\u30b5\u30fc\u30d3\u30b9\u3067\u3001\u30e1\u30c8\u30ea\u30af\u30b9\u306e\u4fdd\u5b58\u3068\u3001\u3053\u308c\u3089\u306e\u30e1\u30c8\u30ea\u30af\u30b9\u4e0a\u306b\u4f5c\u6210\u3055\u308c\u305f\u30a2\u30e9\u30fc\u30c8\u306e\u7ba1\u7406\u3092\u62c5\u5f53\u3057\u307e\u3059\u3002Prometheus \u306f\u4eba\u6c17\u306e\u3042\u308b\u30aa\u30fc\u30d7\u30f3\u30bd\u30fc\u30b9\u306e\u30e2\u30cb\u30bf\u30ea\u30f3\u30b0\u6280\u8853\u3067\u3001Kubernetes \u306b\u6b21\u3044\u3067 Cloud Native Computing Foundation \u306b\u6240\u5c5e\u3059\u308b 2 \u756a\u76ee\u306e\u30d7\u30ed\u30b8\u30a7\u30af\u30c8\u3067\u3059\u3002"]}),"\n",(0,r.jsxs)(a.p,{children:[(0,r.jsx)(a.a,{href:"https://aws.amazon.com/jp/grafana/",children:"Amazon Managed Grafana"})," \u306f\u3001Grafana \u306e\u30de\u30cd\u30fc\u30b8\u30c9\u30b5\u30fc\u30d3\u30b9\u3067\u3059\u3002Grafana \u306f\u6642\u7cfb\u5217\u30c7\u30fc\u30bf\u306e\u53ef\u8996\u5316\u306e\u305f\u3081\u306e\u30aa\u30fc\u30d7\u30f3\u30bd\u30fc\u30b9\u6280\u8853\u3067\u3001\u30aa\u30d6\u30b6\u30fc\u30d0\u30d3\u30ea\u30c6\u30a3\u306b\u3088\u304f\u4f7f\u7528\u3055\u308c\u307e\u3059\u3002Grafana \u3092\u4f7f\u7528\u3057\u3066\u3001Amazon Managed Service for Prometheus\u3001Amazon CloudWatch \u306a\u3069\u3001\u3055\u307e\u3056\u307e\u306a\u30bd\u30fc\u30b9\u304b\u3089\u306e\u30c7\u30fc\u30bf\u3092\u53ef\u8996\u5316\u3067\u304d\u307e\u3059\u3002Databricks \u306e\u30e1\u30c8\u30ea\u30af\u30b9\u3068\u30a2\u30e9\u30fc\u30c8\u306e\u53ef\u8996\u5316\u306b\u4f7f\u7528\u3055\u308c\u307e\u3059\u3002"]}),"\n",(0,r.jsxs)(a.p,{children:[(0,r.jsx)(a.a,{href:"https://aws-otel.github.io/",children:"AWS Distro for OpenTelemetry"})," \u306f\u3001AWS \u304c\u30b5\u30dd\u30fc\u30c8\u3059\u308b OpenTelemetry \u30d7\u30ed\u30b8\u30a7\u30af\u30c8\u306e\u30c7\u30a3\u30b9\u30c8\u30ea\u30d3\u30e5\u30fc\u30b7\u30e7\u30f3\u3067\u3001\u30c8\u30ec\u30fc\u30b9\u3068\u30e1\u30c8\u30ea\u30af\u30b9\u3092\u53ce\u96c6\u3059\u308b\u305f\u3081\u306e\u30aa\u30fc\u30d7\u30f3\u30bd\u30fc\u30b9\u6a19\u6e96\u3001\u30e9\u30a4\u30d6\u30e9\u30ea\u3001\u30b5\u30fc\u30d3\u30b9\u3092\u63d0\u4f9b\u3057\u307e\u3059\u3002OpenTelemetry \u3092\u901a\u3058\u3066\u3001Prometheus \u3084 StatsD \u306a\u3069\u306e\u3055\u307e\u3056\u307e\u306a\u30aa\u30d6\u30b6\u30fc\u30d0\u30d3\u30ea\u30c6\u30a3\u30c7\u30fc\u30bf\u5f62\u5f0f\u3092\u53ce\u96c6\u3057\u3001\u3053\u306e\u30c7\u30fc\u30bf\u3092\u5f37\u5316\u3057\u3066\u3001CloudWatch \u3084 Amazon Managed Service for Prometheus \u306a\u3069\u306e\u8907\u6570\u306e\u5b9b\u5148\u306b\u9001\u4fe1\u3067\u304d\u307e\u3059\u3002"]}),"\n",(0,r.jsx)(a.h3,{id:"\u30e6\u30fc\u30b9\u30b1\u30fc\u30b9",children:"\u30e6\u30fc\u30b9\u30b1\u30fc\u30b9"}),"\n",(0,r.jsx)(a.p,{children:"AWS \u30cd\u30a4\u30c6\u30a3\u30d6\u30b5\u30fc\u30d3\u30b9\u306f Databricks \u30af\u30e9\u30b9\u30bf\u30fc\u3092\u7ba1\u7406\u3059\u308b\u305f\u3081\u306b\u5fc5\u8981\u306a\u30aa\u30d6\u30b6\u30fc\u30d0\u30d3\u30ea\u30c6\u30a3\u3092\u63d0\u4f9b\u3057\u307e\u3059\u304c\u3001\u30aa\u30fc\u30d7\u30f3\u30bd\u30fc\u30b9\u306e\u30de\u30cd\u30fc\u30b8\u30c9\u30b5\u30fc\u30d3\u30b9\u3092\u4f7f\u7528\u3059\u308b\u3053\u3068\u304c\u6700\u9069\u306a\u9078\u629e\u80a2\u3068\u306a\u308b\u30b7\u30ca\u30ea\u30aa\u3082\u3042\u308a\u307e\u3059\u3002"}),"\n",(0,r.jsx)(a.p,{children:"Prometheus \u3068 Grafana \u306f\u975e\u5e38\u306b\u4eba\u6c17\u306e\u3042\u308b\u30c6\u30af\u30ce\u30ed\u30b8\u30fc\u3067\u3042\u308a\u3001\u591a\u304f\u306e\u4f01\u696d\u3067\u3059\u3067\u306b\u4f7f\u7528\u3055\u308c\u3066\u3044\u307e\u3059\u3002AWS \u306e\u30aa\u30fc\u30d7\u30f3\u30bd\u30fc\u30b9\u30aa\u30d6\u30b6\u30fc\u30d0\u30d3\u30ea\u30c6\u30a3\u30b5\u30fc\u30d3\u30b9\u3092\u4f7f\u7528\u3059\u308b\u3053\u3068\u3067\u3001\u904b\u7528\u30c1\u30fc\u30e0\u306f\u65e2\u5b58\u306e\u30a4\u30f3\u30d5\u30e9\u30b9\u30c8\u30e9\u30af\u30c1\u30e3\u3001\u540c\u3058\u30af\u30a8\u30ea\u8a00\u8a9e\u3001\u65e2\u5b58\u306e\u30c0\u30c3\u30b7\u30e5\u30dc\u30fc\u30c9\u3068\u30a2\u30e9\u30fc\u30c8\u3092\u4f7f\u7528\u3057\u3066 Databricks \u30ef\u30fc\u30af\u30ed\u30fc\u30c9\u3092\u76e3\u8996\u3067\u304d\u307e\u3059\u3002\u3053\u308c\u3089\u306e\u30b5\u30fc\u30d3\u30b9\u306e\u30a4\u30f3\u30d5\u30e9\u30b9\u30c8\u30e9\u30af\u30c1\u30e3\u3001\u30b9\u30b1\u30fc\u30e9\u30d3\u30ea\u30c6\u30a3\u3001\u30d1\u30d5\u30a9\u30fc\u30de\u30f3\u30b9\u3092\u7ba1\u7406\u3059\u308b\u624b\u9593\u3092\u304b\u3051\u305a\u306b\u5b9f\u73fe\u3067\u304d\u307e\u3059\u3002"}),"\n",(0,r.jsx)(a.p,{children:"ADOT \u306f\u3001CloudWatch \u3084 Prometheus \u306a\u3069\u306e\u7570\u306a\u308b\u9001\u4fe1\u5148\u306b\u30e1\u30c8\u30ea\u30af\u30b9\u3068\u30c8\u30ec\u30fc\u30b9\u3092\u9001\u4fe1\u3059\u308b\u5fc5\u8981\u304c\u3042\u308b\u5834\u5408\u3084\u3001OTLP \u3084 StatsD \u306a\u3069\u306e\u7570\u306a\u308b\u30bf\u30a4\u30d7\u306e\u30c7\u30fc\u30bf\u30bd\u30fc\u30b9\u3092\u6271\u3046\u5fc5\u8981\u304c\u3042\u308b\u5834\u5408\u306b\u6700\u9069\u306a\u9078\u629e\u80a2\u3067\u3059\u3002"}),"\n",(0,r.jsx)(a.p,{children:"\u6700\u5f8c\u306b\u3001Amazon Managed Grafana \u306f CloudWatch \u3084 Prometheus \u3092\u542b\u3080\u591a\u304f\u306e\u7570\u306a\u308b\u30c7\u30fc\u30bf\u30bd\u30fc\u30b9\u3092\u30b5\u30dd\u30fc\u30c8\u3057\u3066\u304a\u308a\u3001\u8907\u6570\u306e\u30c4\u30fc\u30eb\u3092\u4f7f\u7528\u3059\u308b\u3053\u3068\u3092\u6c7a\u3081\u305f\u30c1\u30fc\u30e0\u304c\u30c7\u30fc\u30bf\u3092\u76f8\u95a2\u3055\u305b\u308b\u306e\u306b\u5f79\u7acb\u3061\u307e\u3059\u3002\u3053\u308c\u306b\u3088\u308a\u3001\u3059\u3079\u3066\u306e Databricks \u30af\u30e9\u30b9\u30bf\u30fc\u306e\u30aa\u30d6\u30b6\u30fc\u30d0\u30d3\u30ea\u30c6\u30a3\u3092\u53ef\u80fd\u306b\u3059\u308b\u30c6\u30f3\u30d7\u30ec\u30fc\u30c8\u306e\u4f5c\u6210\u3084\u3001Infrastructure as Code \u3092\u901a\u3058\u3066\u30d7\u30ed\u30d3\u30b8\u30e7\u30cb\u30f3\u30b0\u3068\u8a2d\u5b9a\u3092\u884c\u3046\u305f\u3081\u306e\u5f37\u529b\u306a API \u304c\u63d0\u4f9b\u3055\u308c\u307e\u3059\u3002"}),"\n",(0,r.jsxs)(a.p,{children:[(0,r.jsx)(a.img,{alt:"Databricks OpenSource Observability Diagram",src:s(49144).A+"",width:"712",height:"235"}),"\n",(0,r.jsx)(a.em,{children:"\u56f3 3: Databricks \u30aa\u30fc\u30d7\u30f3\u30bd\u30fc\u30b9\u30aa\u30d6\u30b6\u30fc\u30d0\u30d3\u30ea\u30c6\u30a3\u30a2\u30fc\u30ad\u30c6\u30af\u30c1\u30e3"})]}),"\n",(0,r.jsx)(a.p,{children:"AWS \u30de\u30cd\u30fc\u30b8\u30c9\u30aa\u30fc\u30d7\u30f3\u30bd\u30fc\u30b9\u30aa\u30d6\u30b6\u30fc\u30d0\u30d3\u30ea\u30c6\u30a3\u30b5\u30fc\u30d3\u30b9\u3092\u4f7f\u7528\u3057\u3066 Databricks \u30af\u30e9\u30b9\u30bf\u30fc\u304b\u3089\u30e1\u30c8\u30ea\u30af\u30b9\u3092\u89b3\u6e2c\u3059\u308b\u306b\u306f\u3001\u30e1\u30c8\u30ea\u30af\u30b9\u3068\u30a2\u30e9\u30fc\u30c8\u306e\u4e21\u65b9\u3092\u53ef\u8996\u5316\u3059\u308b\u305f\u3081\u306e Amazon Managed Grafana \u30ef\u30fc\u30af\u30b9\u30da\u30fc\u30b9\u3068\u3001Amazon Managed Grafana \u30ef\u30fc\u30af\u30b9\u30da\u30fc\u30b9\u306e\u30c7\u30fc\u30bf\u30bd\u30fc\u30b9\u3068\u3057\u3066\u8a2d\u5b9a\u3055\u308c\u305f Amazon Managed Service for Prometheus \u30ef\u30fc\u30af\u30b9\u30da\u30fc\u30b9\u304c\u5fc5\u8981\u3067\u3059\u3002"}),"\n",(0,r.jsx)(a.p,{children:"\u53ce\u96c6\u3059\u3079\u304d\u91cd\u8981\u306a\u30e1\u30c8\u30ea\u30af\u30b9\u306b\u306f\u3001Spark \u30e1\u30c8\u30ea\u30af\u30b9\u3068\u30ce\u30fc\u30c9\u30e1\u30c8\u30ea\u30af\u30b9\u306e 2 \u7a2e\u985e\u304c\u3042\u308a\u307e\u3059\u3002"}),"\n",(0,r.jsxs)(a.p,{children:["Spark \u30e1\u30c8\u30ea\u30af\u30b9\u306f\u3001\u30af\u30e9\u30b9\u30bf\u30fc\u5185\u306e\u73fe\u5728\u306e\u30ef\u30fc\u30ab\u30fc\u6570\u3084\u30a8\u30b0\u30bc\u30ad\u30e5\u30fc\u30bf\u30fc\u6570\u3001\u51e6\u7406\u4e2d\u306b\u30ce\u30fc\u30c9\u9593\u3067\u30c7\u30fc\u30bf\u3092\u4ea4\u63db\u3059\u308b\u969b\u306e\u30b7\u30e3\u30c3\u30d5\u30eb\u3001\u30c7\u30fc\u30bf\u304c RAM \u304b\u3089\u30c7\u30a3\u30b9\u30af\u3078\u3001\u30c7\u30a3\u30b9\u30af\u304b\u3089 RAM \u3078\u79fb\u52d5\u3059\u308b\u30b9\u30d4\u30eb\u306a\u3069\u306e\u60c5\u5831\u3092\u3082\u305f\u3089\u3057\u307e\u3059\u3002\u3053\u308c\u3089\u306e\u30e1\u30c8\u30ea\u30af\u30b9\u3092\u516c\u958b\u3059\u308b\u306b\u306f\u3001Databricks \u7ba1\u7406\u30b3\u30f3\u30bd\u30fc\u30eb\u3092\u901a\u3058\u3066 Spark \u30cd\u30a4\u30c6\u30a3\u30d6\u306e Prometheus\uff08\u30d0\u30fc\u30b8\u30e7\u30f3 3.0 \u4ee5\u964d\u3067\u5229\u7528\u53ef\u80fd\uff09\u3092\u6709\u52b9\u306b\u3057\u3001",(0,r.jsx)(a.code,{children:"init_script"})," \u3092\u901a\u3058\u3066\u8a2d\u5b9a\u3059\u308b\u5fc5\u8981\u304c\u3042\u308a\u307e\u3059\u3002"]}),"\n",(0,r.jsxs)(a.p,{children:["\u30c7\u30a3\u30b9\u30af\u4f7f\u7528\u91cf\u3001CPU \u6642\u9593\u3001\u30e1\u30e2\u30ea\u3001\u30b9\u30c8\u30ec\u30fc\u30b8\u30d1\u30d5\u30a9\u30fc\u30de\u30f3\u30b9\u306a\u3069\u306e\u30ce\u30fc\u30c9\u30e1\u30c8\u30ea\u30af\u30b9\u3092\u8ffd\u8de1\u3059\u308b\u305f\u3081\u306b\u3001",(0,r.jsx)(a.code,{children:"node_exporter"})," \u3092\u4f7f\u7528\u3057\u307e\u3059\u3002\u3053\u308c\u306f\u8ffd\u52a0\u306e\u8a2d\u5b9a\u306a\u3057\u3067\u4f7f\u7528\u3067\u304d\u307e\u3059\u304c\u3001\u91cd\u8981\u306a\u30e1\u30c8\u30ea\u30af\u30b9\u306e\u307f\u3092\u516c\u958b\u3059\u308b\u3079\u304d\u3067\u3059\u3002"]}),"\n",(0,r.jsxs)(a.p,{children:["ADOT Collector \u3092\u30af\u30e9\u30b9\u30bf\u30fc\u306e\u5404\u30ce\u30fc\u30c9\u306b\u30a4\u30f3\u30b9\u30c8\u30fc\u30eb\u3057\u3001Spark \u3068 ",(0,r.jsx)(a.code,{children:"node_exporter"})," \u306e\u4e21\u65b9\u304c\u516c\u958b\u3059\u308b\u30e1\u30c8\u30ea\u30af\u30b9\u3092\u30b9\u30af\u30ec\u30a4\u30d4\u30f3\u30b0\u3057\u3001\u3053\u308c\u3089\u306e\u30e1\u30c8\u30ea\u30af\u30b9\u3092\u30d5\u30a3\u30eb\u30bf\u30ea\u30f3\u30b0\u3057\u3001",(0,r.jsx)(a.code,{children:"cluster_name"})," \u306a\u3069\u306e\u30e1\u30bf\u30c7\u30fc\u30bf\u3092\u6ce8\u5165\u3057\u3066\u3001\u3053\u308c\u3089\u306e\u30e1\u30c8\u30ea\u30af\u30b9\u3092 Prometheus \u30ef\u30fc\u30af\u30b9\u30da\u30fc\u30b9\u306b\u9001\u4fe1\u3059\u308b\u5fc5\u8981\u304c\u3042\u308a\u307e\u3059\u3002"]}),"\n",(0,r.jsxs)(a.p,{children:["ADOT Collector \u3068 ",(0,r.jsx)(a.code,{children:"node_exporter"})," \u306e\u4e21\u65b9\u3092 ",(0,r.jsx)(a.code,{children:"init_script"})," \u3092\u901a\u3058\u3066\u30a4\u30f3\u30b9\u30c8\u30fc\u30eb\u304a\u3088\u3073\u8a2d\u5b9a\u3059\u308b\u5fc5\u8981\u304c\u3042\u308a\u307e\u3059\u3002"]}),"\n",(0,r.jsx)(a.p,{children:"Databricks \u30af\u30e9\u30b9\u30bf\u30fc\u306f\u3001Prometheus \u30ef\u30fc\u30af\u30b9\u30da\u30fc\u30b9\u306b\u30e1\u30c8\u30ea\u30af\u30b9\u3092\u66f8\u304d\u8fbc\u3080\u6a29\u9650\u3092\u6301\u3064 IAM \u30ed\u30fc\u30eb\u3067\u8a2d\u5b9a\u3059\u308b\u5fc5\u8981\u304c\u3042\u308a\u307e\u3059\u3002"}),"\n",(0,r.jsx)(a.h2,{id:"\u30d9\u30b9\u30c8\u30d7\u30e9\u30af\u30c6\u30a3\u30b9",children:"\u30d9\u30b9\u30c8\u30d7\u30e9\u30af\u30c6\u30a3\u30b9"}),"\n",(0,r.jsx)(a.h3,{id:"\u4fa1\u5024\u306e\u3042\u308b\u30e1\u30c8\u30ea\u30af\u30b9\u3092\u512a\u5148\u3059\u308b",children:"\u4fa1\u5024\u306e\u3042\u308b\u30e1\u30c8\u30ea\u30af\u30b9\u3092\u512a\u5148\u3059\u308b"}),"\n",(0,r.jsx)(a.p,{children:"Spark \u3068 node_exporter \u306f\u3001\u3069\u3061\u3089\u3082\u591a\u6570\u306e\u30e1\u30c8\u30ea\u30af\u30b9\u3068\u3001\u540c\u3058\u30e1\u30c8\u30ea\u30af\u30b9\u306b\u5bfe\u3059\u308b\u8907\u6570\u306e\u30d5\u30a9\u30fc\u30de\u30c3\u30c8\u3092\u516c\u958b\u3057\u3066\u3044\u307e\u3059\u3002\u30e2\u30cb\u30bf\u30ea\u30f3\u30b0\u3068\u30a4\u30f3\u30b7\u30c7\u30f3\u30c8\u5bfe\u5fdc\u306b\u6709\u7528\u306a\u30e1\u30c8\u30ea\u30af\u30b9\u3092\u30d5\u30a3\u30eb\u30bf\u30ea\u30f3\u30b0\u3057\u306a\u3044\u3068\u3001\u554f\u984c\u691c\u51fa\u307e\u3067\u306e\u5e73\u5747\u6642\u9593\u304c\u5897\u52a0\u3057\u3001\u30b5\u30f3\u30d7\u30eb\u306e\u4fdd\u5b58\u30b3\u30b9\u30c8\u304c\u4e0a\u304c\u308a\u3001\u4fa1\u5024\u3042\u308b\u60c5\u5831\u306e\u767a\u898b\u3068\u7406\u89e3\u304c\u56f0\u96e3\u306b\u306a\u308a\u307e\u3059\u3002OpenTelemetry \u306e\u30d7\u30ed\u30bb\u30c3\u30b5\u3092\u4f7f\u7528\u3059\u308b\u3053\u3068\u3067\u3001\u4fa1\u5024\u306e\u3042\u308b\u30e1\u30c8\u30ea\u30af\u30b9\u306e\u307f\u3092\u30d5\u30a3\u30eb\u30bf\u30ea\u30f3\u30b0\u3057\u3066\u4fdd\u6301\u3057\u305f\u308a\u3001\u610f\u5473\u306e\u306a\u3044\u30e1\u30c8\u30ea\u30af\u30b9\u3092\u9664\u5916\u3057\u305f\u308a\u3059\u308b\u3053\u3068\u304c\u3067\u304d\u307e\u3059\u3002\u307e\u305f\u3001AMP \u306b\u9001\u4fe1\u3059\u308b\u524d\u306b\u30e1\u30c8\u30ea\u30af\u30b9\u3092\u96c6\u8a08\u3057\u3066\u8a08\u7b97\u3059\u308b\u3053\u3068\u3082\u53ef\u80fd\u3067\u3059\u3002"}),"\n",(0,r.jsx)(a.h3,{id:"\u30a2\u30e9\u30fc\u30c8\u75b2\u308c\u3092\u907f\u3051\u308b",children:"\u30a2\u30e9\u30fc\u30c8\u75b2\u308c\u3092\u907f\u3051\u308b"}),"\n",(0,r.jsx)(a.p,{children:"\u4fa1\u5024\u306e\u3042\u308b\u30e1\u30c8\u30ea\u30af\u30b9\u304c AMP \u306b\u53d6\u308a\u8fbc\u307e\u308c\u305f\u3089\u3001\u30a2\u30e9\u30fc\u30c8\u3092\u8a2d\u5b9a\u3059\u308b\u3053\u3068\u304c\u91cd\u8981\u3067\u3059\u3002\u3057\u304b\u3057\u3001\u30ea\u30bd\u30fc\u30b9\u4f7f\u7528\u91cf\u306e\u3059\u3079\u3066\u306e\u30d0\u30fc\u30b9\u30c8\u306b\u5bfe\u3057\u3066\u30a2\u30e9\u30fc\u30c8\u3092\u8a2d\u5b9a\u3059\u308b\u3068\u3001\u30a2\u30e9\u30fc\u30c8\u75b2\u308c\u3092\u5f15\u304d\u8d77\u3053\u3059\u53ef\u80fd\u6027\u304c\u3042\u308a\u307e\u3059\u3002\u3053\u308c\u306f\u3001\u30ce\u30a4\u30ba\u304c\u591a\u3059\u304e\u308b\u3068\u30a2\u30e9\u30fc\u30c8\u306e\u91cd\u8981\u5ea6\u3078\u306e\u4fe1\u983c\u304c\u4f4e\u4e0b\u3057\u3001\u91cd\u8981\u306a\u30a4\u30d9\u30f3\u30c8\u304c\u691c\u51fa\u3055\u308c\u306a\u304f\u306a\u308b\u72b6\u6cc1\u3067\u3059\u3002AMP \u306e\u30a2\u30e9\u30fc\u30c8\u30eb\u30fc\u30eb\u30b0\u30eb\u30fc\u30d7\u6a5f\u80fd\u3092\u4f7f\u7528\u3057\u3066\u3001\u8907\u6570\u306e\u95a2\u9023\u3059\u308b\u30a2\u30e9\u30fc\u30c8\u304c\u5225\u3005\u306e\u901a\u77e5\u3092\u751f\u6210\u3059\u308b\u3088\u3046\u306a\u66d6\u6627\u3055\u3092\u907f\u3051\u308b\u3079\u304d\u3067\u3059\u3002\u307e\u305f\u3001\u30a2\u30e9\u30fc\u30c8\u306b\u306f\u9069\u5207\u306a\u91cd\u8981\u5ea6\u3092\u8a2d\u5b9a\u3057\u3001\u30d3\u30b8\u30cd\u30b9\u306e\u512a\u5148\u9806\u4f4d\u3092\u53cd\u6620\u3055\u305b\u308b\u5fc5\u8981\u304c\u3042\u308a\u307e\u3059\u3002"}),"\n",(0,r.jsx)(a.h3,{id:"amazon-managed-grafana-\u30c0\u30c3\u30b7\u30e5\u30dc\u30fc\u30c9\u306e\u518d\u5229\u7528",children:"Amazon Managed Grafana \u30c0\u30c3\u30b7\u30e5\u30dc\u30fc\u30c9\u306e\u518d\u5229\u7528"}),"\n",(0,r.jsx)(a.p,{children:"Amazon Managed Grafana \u306f\u3001Grafana \u306e\u30cd\u30a4\u30c6\u30a3\u30d6\u306a\u30c6\u30f3\u30d7\u30ec\u30fc\u30c8\u6a5f\u80fd\u3092\u6d3b\u7528\u3057\u3066\u3044\u307e\u3059\u3002\u3053\u308c\u306b\u3088\u308a\u3001\u65e2\u5b58\u304a\u3088\u3073\u65b0\u898f\u306e Databricks \u30af\u30e9\u30b9\u30bf\u30fc\u3059\u3079\u3066\u306b\u5bfe\u3057\u3066\u30c0\u30c3\u30b7\u30e5\u30dc\u30fc\u30c9\u3092\u4f5c\u6210\u3067\u304d\u307e\u3059\u3002\u5404\u30af\u30e9\u30b9\u30bf\u30fc\u306b\u5bfe\u3057\u3066\u624b\u52d5\u3067\u30d3\u30b8\u30e5\u30a2\u30e9\u30a4\u30bc\u30fc\u30b7\u30e7\u30f3\u3092\u4f5c\u6210\u3057\u3001\u7dad\u6301\u3059\u308b\u5fc5\u8981\u304c\u306a\u304f\u306a\u308a\u307e\u3059\u3002\u3053\u306e\u6a5f\u80fd\u3092\u4f7f\u7528\u3059\u308b\u306b\u306f\u3001\u30e1\u30c8\u30ea\u30af\u30b9\u306b\u6b63\u3057\u3044\u30e9\u30d9\u30eb\u3092\u4ed8\u3051\u3066\u3001\u30af\u30e9\u30b9\u30bf\u30fc\u3054\u3068\u306b\u30e1\u30c8\u30ea\u30af\u30b9\u3092\u30b0\u30eb\u30fc\u30d7\u5316\u3059\u308b\u3053\u3068\u304c\u91cd\u8981\u3067\u3059\u3002\u3053\u308c\u3082 OpenTelemetry \u30d7\u30ed\u30bb\u30c3\u30b5\u30fc\u3092\u4f7f\u7528\u3059\u308b\u3053\u3068\u3067\u53ef\u80fd\u3067\u3059\u3002"}),"\n",(0,r.jsx)(a.h2,{id:"\u53c2\u8003\u8cc7\u6599\u3068\u8a73\u7d30\u60c5\u5831",children:"\u53c2\u8003\u8cc7\u6599\u3068\u8a73\u7d30\u60c5\u5831"}),"\n",(0,r.jsxs)(a.ul,{children:["\n",(0,r.jsx)(a.li,{children:(0,r.jsx)(a.a,{href:"https://docs.aws.amazon.com/ja_jp/prometheus/latest/userguide/AMP-onboard-create-workspace.html",children:"Amazon Managed Service for Prometheus \u30ef\u30fc\u30af\u30b9\u30da\u30fc\u30b9\u306e\u4f5c\u6210"})}),"\n",(0,r.jsx)(a.li,{children:(0,r.jsx)(a.a,{href:"https://docs.aws.amazon.com/ja_jp/grafana/latest/userguide/Amazon-Managed-Grafana-create-workspace.html",children:"Amazon Managed Grafana \u30ef\u30fc\u30af\u30b9\u30da\u30fc\u30b9\u306e\u4f5c\u6210"})}),"\n",(0,r.jsx)(a.li,{children:(0,r.jsx)(a.a,{href:"https://docs.aws.amazon.com/ja_jp/grafana/latest/userguide/prometheus-data-source.html",children:"Amazon Managed Service for Prometheus \u30c7\u30fc\u30bf\u30bd\u30fc\u30b9\u306e\u8a2d\u5b9a"})}),"\n",(0,r.jsx)(a.li,{children:(0,r.jsx)(a.a,{href:"https://docs.databricks.com/clusters/init-scripts.html",children:"Databricks \u521d\u671f\u5316\u30b9\u30af\u30ea\u30d7\u30c8"})}),"\n"]})]})}function h(e={}){const{wrapper:a}={...(0,n.R)(),...e.components};return a?(0,r.jsx)(a,{...e,children:(0,r.jsx)(o,{...e})}):o(e)}},83458:(e,a,s)=>{s.d(a,{A:()=>r});const r=s.p+"assets/images/databricks_cw_arch-5b3ce83f61d1afe9059000f87f9f784c.png"},49144:(e,a,s)=>{s.d(a,{A:()=>r});const r=s.p+"assets/images/databricks_oss_diagram-02a08028d86e08e2b5d97ef3e8aba5b7.png"},96208:(e,a,s)=>{s.d(a,{A:()=>r});const r=s.p+"assets/images/databricks_spark_config-007ae96a1f106d1247c945bac609e98b.png"},28453:(e,a,s)=>{s.d(a,{R:()=>t,x:()=>c});var r=s(96540);const n={},i=r.createContext(n);function t(e){const a=r.useContext(i);return r.useMemo((function(){return"function"==typeof e?e(a):{...a,...e}}),[a,e])}function c(e){let a;return a=e.disableParentContext?"function"==typeof e.components?e.components(n):e.components||n:t(e.components),r.createElement(i.Provider,{value:a},e.children)}}}]);
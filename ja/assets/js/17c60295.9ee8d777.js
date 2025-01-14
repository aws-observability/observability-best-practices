"use strict";(self.webpackChunkobservability_best_practices=self.webpackChunkobservability_best_practices||[]).push([[9864],{13699:(n,s,e)=>{e.r(s),e.d(s,{assets:()=>l,contentTitle:()=>a,default:()=>x,frontMatter:()=>i,metadata:()=>c,toc:()=>o});var r=e(74848),t=e(28453);const i={},a="AWS X-Ray \u3092\u4f7f\u7528\u3057\u305f EKS \u30c8\u30ec\u30fc\u30b7\u30f3\u30b0",c={id:"patterns/Tracing/xrayeks",title:"AWS X-Ray \u3092\u4f7f\u7528\u3057\u305f EKS \u30c8\u30ec\u30fc\u30b7\u30f3\u30b0",description:"\u30e2\u30c0\u30f3\u306a\u30a2\u30d7\u30ea\u30b1\u30fc\u30b7\u30e7\u30f3\u958b\u767a\u306e\u4e16\u754c\u3067\u306f\u3001\u30b3\u30f3\u30c6\u30ca\u5316\u304c\u30a2\u30d7\u30ea\u30b1\u30fc\u30b7\u30e7\u30f3\u306e\u30c7\u30d7\u30ed\u30a4\u3068\u7ba1\u7406\u306e\u4e8b\u5b9f\u4e0a\u306e\u6a19\u6e96\u3068\u306a\u3063\u3066\u3044\u307e\u3059\u3002Amazon Elastic Kubernetes Service (EKS) \u306f\u3001Kubernetes \u3092\u4f7f\u7528\u3057\u3066\u30b3\u30f3\u30c6\u30ca\u5316\u3055\u308c\u305f\u30a2\u30d7\u30ea\u30b1\u30fc\u30b7\u30e7\u30f3\u3092\u30c7\u30d7\u30ed\u30a4\u304a\u3088\u3073\u7ba1\u7406\u3059\u308b\u305f\u3081\u306e\u5805\u7262\u3067\u30b9\u30b1\u30fc\u30e9\u30d6\u30eb\u306a\u30d7\u30e9\u30c3\u30c8\u30d5\u30a9\u30fc\u30e0\u3092\u63d0\u4f9b\u3057\u307e\u3059\u3002\u3057\u304b\u3057\u3001\u30a2\u30d7\u30ea\u30b1\u30fc\u30b7\u30e7\u30f3\u304c\u3088\u308a\u5206\u6563\u5316\u3055\u308c\u8907\u96d1\u306b\u306a\u308b\u306b\u3064\u308c\u3066\u3001\u3053\u308c\u3089\u306e\u30a2\u30d7\u30ea\u30b1\u30fc\u30b7\u30e7\u30f3\u306e\u4fe1\u983c\u6027\u3001\u30d1\u30d5\u30a9\u30fc\u30de\u30f3\u30b9\u3001\u52b9\u7387\u6027\u3092\u78ba\u4fdd\u3059\u308b\u305f\u3081\u306b\u30aa\u30d6\u30b6\u30fc\u30d0\u30d3\u30ea\u30c6\u30a3\u304c\u91cd\u8981\u306b\u306a\u308a\u307e\u3059\u3002",source:"@site/i18n/ja/docusaurus-plugin-content-docs/current/patterns/Tracing/xrayeks.md",sourceDirName:"patterns/Tracing",slug:"/patterns/Tracing/xrayeks",permalink:"/observability-best-practices/ja/patterns/Tracing/xrayeks",draft:!1,unlisted:!1,editUrl:"https://github.com/aws-observability/observability-best-practices/blob/main/docusaurus/docs/patterns/Tracing/xrayeks.md",tags:[],version:"current",frontMatter:{},sidebar:"patterns",previous:{title:"AWS X-Ray \u3092\u4f7f\u7528\u3057\u305f ECS \u30c8\u30ec\u30fc\u30b7\u30f3\u30b0",permalink:"/observability-best-practices/ja/patterns/Tracing/xrayecs"},next:{title:"AWS X-Ray \u3092\u4f7f\u7528\u3057\u305f Lambda \u306e\u30c8\u30ec\u30fc\u30b7\u30f3\u30b0",permalink:"/observability-best-practices/ja/patterns/Tracing/xraylambda"}},l={},o=[];function d(n){const s={em:"em",h1:"h1",img:"img",li:"li",ol:"ol",p:"p",strong:"strong",...(0,t.R)(),...n.components};return(0,r.jsxs)(r.Fragment,{children:[(0,r.jsx)(s.h1,{id:"aws-x-ray-\u3092\u4f7f\u7528\u3057\u305f-eks-\u30c8\u30ec\u30fc\u30b7\u30f3\u30b0",children:"AWS X-Ray \u3092\u4f7f\u7528\u3057\u305f EKS \u30c8\u30ec\u30fc\u30b7\u30f3\u30b0"}),"\n",(0,r.jsx)(s.p,{children:"\u30e2\u30c0\u30f3\u306a\u30a2\u30d7\u30ea\u30b1\u30fc\u30b7\u30e7\u30f3\u958b\u767a\u306e\u4e16\u754c\u3067\u306f\u3001\u30b3\u30f3\u30c6\u30ca\u5316\u304c\u30a2\u30d7\u30ea\u30b1\u30fc\u30b7\u30e7\u30f3\u306e\u30c7\u30d7\u30ed\u30a4\u3068\u7ba1\u7406\u306e\u4e8b\u5b9f\u4e0a\u306e\u6a19\u6e96\u3068\u306a\u3063\u3066\u3044\u307e\u3059\u3002Amazon Elastic Kubernetes Service (EKS) \u306f\u3001Kubernetes \u3092\u4f7f\u7528\u3057\u3066\u30b3\u30f3\u30c6\u30ca\u5316\u3055\u308c\u305f\u30a2\u30d7\u30ea\u30b1\u30fc\u30b7\u30e7\u30f3\u3092\u30c7\u30d7\u30ed\u30a4\u304a\u3088\u3073\u7ba1\u7406\u3059\u308b\u305f\u3081\u306e\u5805\u7262\u3067\u30b9\u30b1\u30fc\u30e9\u30d6\u30eb\u306a\u30d7\u30e9\u30c3\u30c8\u30d5\u30a9\u30fc\u30e0\u3092\u63d0\u4f9b\u3057\u307e\u3059\u3002\u3057\u304b\u3057\u3001\u30a2\u30d7\u30ea\u30b1\u30fc\u30b7\u30e7\u30f3\u304c\u3088\u308a\u5206\u6563\u5316\u3055\u308c\u8907\u96d1\u306b\u306a\u308b\u306b\u3064\u308c\u3066\u3001\u3053\u308c\u3089\u306e\u30a2\u30d7\u30ea\u30b1\u30fc\u30b7\u30e7\u30f3\u306e\u4fe1\u983c\u6027\u3001\u30d1\u30d5\u30a9\u30fc\u30de\u30f3\u30b9\u3001\u52b9\u7387\u6027\u3092\u78ba\u4fdd\u3059\u308b\u305f\u3081\u306b\u30aa\u30d6\u30b6\u30fc\u30d0\u30d3\u30ea\u30c6\u30a3\u304c\u91cd\u8981\u306b\u306a\u308a\u307e\u3059\u3002"}),"\n",(0,r.jsx)(s.p,{children:"AWS X-Ray \u306f\u3001EKS \u4e0a\u3067\u5b9f\u884c\u3055\u308c\u308b\u30b3\u30f3\u30c6\u30ca\u5316\u3055\u308c\u305f\u30a2\u30d7\u30ea\u30b1\u30fc\u30b7\u30e7\u30f3\u306e\u30aa\u30d6\u30b6\u30fc\u30d0\u30d3\u30ea\u30c6\u30a3\u3092\u5411\u4e0a\u3055\u305b\u308b\u5f37\u529b\u306a\u5206\u6563\u30c8\u30ec\u30fc\u30b7\u30f3\u30b0\u30b5\u30fc\u30d3\u30b9\u3092\u63d0\u4f9b\u3059\u308b\u3053\u3068\u3067\u3001\u3053\u306e\u8ab2\u984c\u306b\u5bfe\u51e6\u3057\u307e\u3059\u3002AWS X-Ray \u3092 EKS \u30ef\u30fc\u30af\u30ed\u30fc\u30c9\u3068\u7d71\u5408\u3059\u308b\u3053\u3068\u3067\u3001\u30a2\u30d7\u30ea\u30b1\u30fc\u30b7\u30e7\u30f3\u306e\u52d5\u4f5c\u3068\u30d1\u30d5\u30a9\u30fc\u30de\u30f3\u30b9\u306b\u3064\u3044\u3066\u3088\u308a\u6df1\u3044\u6d1e\u5bdf\u3092\u5f97\u308b\u3053\u3068\u304c\u3067\u304d\u308b\u4e00\u9023\u306e\u5229\u70b9\u3068\u6a5f\u80fd\u3092\u6d3b\u7528\u3067\u304d\u307e\u3059\uff1a"}),"\n",(0,r.jsxs)(s.ol,{children:["\n",(0,r.jsxs)(s.li,{children:["\n",(0,r.jsxs)(s.p,{children:[(0,r.jsx)(s.strong,{children:"\u30a8\u30f3\u30c9\u30c4\u30fc\u30a8\u30f3\u30c9\u306e\u53ef\u8996\u6027"}),"\uff1aAWS X-Ray \u306f\u3001\u30b3\u30f3\u30c6\u30ca\u5316\u3055\u308c\u305f\u30a2\u30d7\u30ea\u30b1\u30fc\u30b7\u30e7\u30f3\u3084\u4ed6\u306e AWS \u30b5\u30fc\u30d3\u30b9\u3092\u901a\u3058\u3066\u30ea\u30af\u30a8\u30b9\u30c8\u3092\u30c8\u30ec\u30fc\u30b9\u3057\u3001\u30ea\u30af\u30a8\u30b9\u30c8\u306e\u30e9\u30a4\u30d5\u30b5\u30a4\u30af\u30eb\u5168\u4f53\u306e\u30a8\u30f3\u30c9\u30c4\u30fc\u30a8\u30f3\u30c9\u30d3\u30e5\u30fc\u3092\u63d0\u4f9b\u3057\u307e\u3059\u3002\u3053\u306e\u53ef\u8996\u6027\u306b\u3088\u308a\u3001\u7570\u306a\u308b\u30de\u30a4\u30af\u30ed\u30b5\u30fc\u30d3\u30b9\u9593\u306e\u76f8\u4e92\u4f5c\u7528\u3092\u7406\u89e3\u3057\u3001\u6f5c\u5728\u7684\u306a\u30dc\u30c8\u30eb\u30cd\u30c3\u30af\u3084\u554f\u984c\u3092\u3088\u308a\u52b9\u679c\u7684\u306b\u7279\u5b9a\u3067\u304d\u307e\u3059\u3002"]}),"\n"]}),"\n",(0,r.jsxs)(s.li,{children:["\n",(0,r.jsxs)(s.p,{children:[(0,r.jsx)(s.strong,{children:"\u30d1\u30d5\u30a9\u30fc\u30de\u30f3\u30b9\u5206\u6790"}),"\uff1aX-Ray \u306f\u3001\u30b3\u30f3\u30c6\u30ca\u5316\u3055\u308c\u305f\u30a2\u30d7\u30ea\u30b1\u30fc\u30b7\u30e7\u30f3\u306e\u30ea\u30af\u30a8\u30b9\u30c8\u30ec\u30a4\u30c6\u30f3\u30b7\u30fc\u3001\u30a8\u30e9\u30fc\u7387\u3001\u30ea\u30bd\u30fc\u30b9\u4f7f\u7528\u7387\u306a\u3069\u306e\u8a73\u7d30\u306a\u30d1\u30d5\u30a9\u30fc\u30de\u30f3\u30b9\u30e1\u30c8\u30ea\u30af\u30b9\u3092\u53ce\u96c6\u3057\u307e\u3059\u3002\u3053\u308c\u3089\u306e\u30e1\u30c8\u30ea\u30af\u30b9\u306b\u3088\u308a\u3001\u30a2\u30d7\u30ea\u30b1\u30fc\u30b7\u30e7\u30f3\u306e\u30d1\u30d5\u30a9\u30fc\u30de\u30f3\u30b9\u3092\u5206\u6790\u3057\u3001\u30d1\u30d5\u30a9\u30fc\u30de\u30f3\u30b9\u306e\u30db\u30c3\u30c8\u30b9\u30dd\u30c3\u30c8\u3092\u7279\u5b9a\u3057\u3001\u30ea\u30bd\u30fc\u30b9\u5272\u308a\u5f53\u3066\u3092\u6700\u9069\u5316\u3067\u304d\u307e\u3059\u3002"]}),"\n"]}),"\n",(0,r.jsxs)(s.li,{children:["\n",(0,r.jsxs)(s.p,{children:[(0,r.jsx)(s.strong,{children:"\u5206\u6563\u30c8\u30ec\u30fc\u30b7\u30f3\u30b0"}),"\uff1a\u6700\u65b0\u306e\u30de\u30a4\u30af\u30ed\u30b5\u30fc\u30d3\u30b9\u30a2\u30fc\u30ad\u30c6\u30af\u30c1\u30e3\u3067\u306f\u3001\u30ea\u30af\u30a8\u30b9\u30c8\u304c\u8907\u6570\u306e\u30b3\u30f3\u30c6\u30ca\u3084\u30b5\u30fc\u30d3\u30b9\u3092\u6a2a\u65ad\u3059\u308b\u3053\u3068\u304c\u3088\u304f\u3042\u308a\u307e\u3059\u3002AWS X-Ray \u306f\u3001\u3053\u308c\u3089\u306e\u5206\u6563\u30c8\u30ec\u30fc\u30b9\u306e\u7d71\u5408\u30d3\u30e5\u30fc\u3092\u63d0\u4f9b\u3057\u3001\u7570\u306a\u308b\u30b3\u30f3\u30dd\u30fc\u30cd\u30f3\u30c8\u9593\u306e\u76f8\u4e92\u4f5c\u7528\u3092\u7406\u89e3\u3057\u3001\u30a2\u30d7\u30ea\u30b1\u30fc\u30b7\u30e7\u30f3\u5168\u4f53\u306e\u30d1\u30d5\u30a9\u30fc\u30de\u30f3\u30b9\u30c7\u30fc\u30bf\u3092\u76f8\u95a2\u4ed8\u3051\u308b\u3053\u3068\u304c\u3067\u304d\u307e\u3059\u3002"]}),"\n"]}),"\n",(0,r.jsxs)(s.li,{children:["\n",(0,r.jsxs)(s.p,{children:[(0,r.jsx)(s.strong,{children:"\u30b5\u30fc\u30d3\u30b9\u30de\u30c3\u30d7\u306e\u53ef\u8996\u5316"}),"\uff1aX-Ray \u306f\u3001\u30a2\u30d7\u30ea\u30b1\u30fc\u30b7\u30e7\u30f3\u306e\u30b3\u30f3\u30dd\u30fc\u30cd\u30f3\u30c8\u3068\u305d\u306e\u76f8\u4e92\u4f5c\u7528\u3092\u8996\u899a\u7684\u306b\u8868\u73fe\u3059\u308b\u52d5\u7684\u306a\u30b5\u30fc\u30d3\u30b9\u30de\u30c3\u30d7\u3092\u751f\u6210\u3057\u307e\u3059\u3002\u3053\u308c\u3089\u306e\u30b5\u30fc\u30d3\u30b9\u30de\u30c3\u30d7\u306f\u3001\u30de\u30a4\u30af\u30ed\u30b5\u30fc\u30d3\u30b9\u30a2\u30fc\u30ad\u30c6\u30af\u30c1\u30e3\u306e\u8907\u96d1\u3055\u3092\u7406\u89e3\u3057\u3001\u6700\u9069\u5316\u3084\u30ea\u30d5\u30a1\u30af\u30bf\u30ea\u30f3\u30b0\u306e\u6f5c\u5728\u7684\u306a\u9818\u57df\u3092\u7279\u5b9a\u3059\u308b\u306e\u306b\u5f79\u7acb\u3061\u307e\u3059\u3002"]}),"\n"]}),"\n",(0,r.jsxs)(s.li,{children:["\n",(0,r.jsxs)(s.p,{children:[(0,r.jsx)(s.strong,{children:"AWS \u30b5\u30fc\u30d3\u30b9\u3068\u306e\u7d71\u5408"}),"\uff1aAWS X-Ray \u306f\u3001AWS Lambda\u3001API Gateway\u3001Amazon EKS\u3001Amazon ECS \u306a\u3069\u3001\u5e45\u5e83\u3044 AWS \u30b5\u30fc\u30d3\u30b9\u3068\u30b7\u30fc\u30e0\u30ec\u30b9\u306b\u7d71\u5408\u3055\u308c\u307e\u3059\u3002\u3053\u306e\u7d71\u5408\u306b\u3088\u308a\u3001\u8907\u6570\u306e\u30b5\u30fc\u30d3\u30b9\u306b\u308f\u305f\u3063\u3066\u30ea\u30af\u30a8\u30b9\u30c8\u3092\u30c8\u30ec\u30fc\u30b9\u3057\u3001\u4ed6\u306e AWS \u30b5\u30fc\u30d3\u30b9\u304b\u3089\u306e\u30ed\u30b0\u3084\u30e1\u30c8\u30ea\u30af\u30b9\u3068\u30d1\u30d5\u30a9\u30fc\u30de\u30f3\u30b9\u30c7\u30fc\u30bf\u3092\u76f8\u95a2\u4ed8\u3051\u308b\u3053\u3068\u304c\u3067\u304d\u307e\u3059\u3002"]}),"\n"]}),"\n",(0,r.jsxs)(s.li,{children:["\n",(0,r.jsxs)(s.p,{children:[(0,r.jsx)(s.strong,{children:"\u30ab\u30b9\u30bf\u30e0\u30a4\u30f3\u30b9\u30c8\u30eb\u30e1\u30f3\u30c6\u30fc\u30b7\u30e7\u30f3"}),"\uff1aAWS X-Ray \u306f\u591a\u304f\u306e AWS \u30b5\u30fc\u30d3\u30b9\u306b\u5bfe\u3057\u3066\u3059\u3050\u306b\u4f7f\u3048\u308b\u30a4\u30f3\u30b9\u30c8\u30eb\u30e1\u30f3\u30c6\u30fc\u30b7\u30e7\u30f3\u3092\u63d0\u4f9b\u3057\u307e\u3059\u304c\u3001AWS X-Ray SDK \u3092\u4f7f\u7528\u3057\u3066\u30ab\u30b9\u30bf\u30e0\u30a2\u30d7\u30ea\u30b1\u30fc\u30b7\u30e7\u30f3\u3084\u30b5\u30fc\u30d3\u30b9\u3092\u30a4\u30f3\u30b9\u30c8\u30eb\u30e1\u30f3\u30c8\u5316\u3059\u308b\u3053\u3068\u3082\u3067\u304d\u307e\u3059\u3002\u3053\u306e\u6a5f\u80fd\u306b\u3088\u308a\u3001\u30b3\u30f3\u30c6\u30ca\u5316\u3055\u308c\u305f\u30a2\u30d7\u30ea\u30b1\u30fc\u30b7\u30e7\u30f3\u5185\u306e\u30ab\u30b9\u30bf\u30e0\u30b3\u30fc\u30c9\u306e\u30d1\u30d5\u30a9\u30fc\u30de\u30f3\u30b9\u3092\u30c8\u30ec\u30fc\u30b9\u304a\u3088\u3073\u5206\u6790\u3067\u304d\u3001\u30a2\u30d7\u30ea\u30b1\u30fc\u30b7\u30e7\u30f3\u306e\u52d5\u4f5c\u3092\u3088\u308a\u5305\u62ec\u7684\u306b\u628a\u63e1\u3067\u304d\u307e\u3059\u3002"]}),"\n"]}),"\n"]}),"\n",(0,r.jsxs)(s.p,{children:[(0,r.jsx)(s.img,{alt:"EKS \u30c8\u30ec\u30fc\u30b7\u30f3\u30b0",src:e(92841).A+"",width:"928",height:"674"}),"\n",(0,r.jsx)(s.em,{children:"\u56f3 1\uff1aEKS \u304b\u3089 X-Ray \u3078\u306e\u30c8\u30ec\u30fc\u30b9\u306e\u9001\u4fe1"})]}),"\n",(0,r.jsx)(s.p,{children:"EKS \u30ef\u30fc\u30af\u30ed\u30fc\u30c9\u306e\u5f37\u5316\u3055\u308c\u305f\u30aa\u30d6\u30b6\u30fc\u30d0\u30d3\u30ea\u30c6\u30a3\u306e\u305f\u3081\u306b AWS X-Ray \u3092\u6d3b\u7528\u3059\u308b\u306b\u306f\u3001\u4ee5\u4e0b\u306e\u4e00\u822c\u7684\u306a\u624b\u9806\u306b\u5f93\u3046\u5fc5\u8981\u304c\u3042\u308a\u307e\u3059\uff1a"}),"\n",(0,r.jsxs)(s.ol,{children:["\n",(0,r.jsxs)(s.li,{children:["\n",(0,r.jsxs)(s.p,{children:[(0,r.jsx)(s.strong,{children:"\u30ab\u30b9\u30bf\u30e0\u30a2\u30d7\u30ea\u30b1\u30fc\u30b7\u30e7\u30f3\u306e\u30a4\u30f3\u30b9\u30c8\u30eb\u30e1\u30f3\u30c8\u5316"}),"\uff1aAWS X-Ray SDK \u3092\u4f7f\u7528\u3057\u3066\u30b3\u30f3\u30c6\u30ca\u5316\u3055\u308c\u305f\u30a2\u30d7\u30ea\u30b1\u30fc\u30b7\u30e7\u30f3\u3092\u30a4\u30f3\u30b9\u30c8\u30eb\u30e1\u30f3\u30c8\u5316\u3057\u3001\u30c8\u30ec\u30fc\u30b9\u30c7\u30fc\u30bf\u3092 X-Ray \u306b\u9001\u4fe1\u3057\u307e\u3059\u3002"]}),"\n"]}),"\n",(0,r.jsxs)(s.li,{children:["\n",(0,r.jsxs)(s.p,{children:[(0,r.jsx)(s.strong,{children:"\u30a4\u30f3\u30b9\u30c8\u30eb\u30e1\u30f3\u30c8\u5316\u3055\u308c\u305f\u30a2\u30d7\u30ea\u30b1\u30fc\u30b7\u30e7\u30f3\u306e\u30c7\u30d7\u30ed\u30a4"}),"\uff1a\u30a4\u30f3\u30b9\u30c8\u30eb\u30e1\u30f3\u30c8\u5316\u3055\u308c\u305f\u30b3\u30f3\u30c6\u30ca\u5316\u30a2\u30d7\u30ea\u30b1\u30fc\u30b7\u30e7\u30f3\u3092 Amazon EKS \u30af\u30e9\u30b9\u30bf\u30fc\u306b\u30c7\u30d7\u30ed\u30a4\u3057\u307e\u3059\u3002"]}),"\n"]}),"\n",(0,r.jsxs)(s.li,{children:["\n",(0,r.jsxs)(s.p,{children:[(0,r.jsx)(s.strong,{children:"\u30c8\u30ec\u30fc\u30b9\u30c7\u30fc\u30bf\u306e\u5206\u6790"}),"\uff1aAWS X-Ray \u30b3\u30f3\u30bd\u30fc\u30eb\u307e\u305f\u306f API \u3092\u4f7f\u7528\u3057\u3066\u30c8\u30ec\u30fc\u30b9\u30c7\u30fc\u30bf\u3092\u5206\u6790\u3057\u3001\u30b5\u30fc\u30d3\u30b9\u30de\u30c3\u30d7\u3092\u8868\u793a\u3057\u3001\u30b3\u30f3\u30c6\u30ca\u5316\u3055\u308c\u305f\u30a2\u30d7\u30ea\u30b1\u30fc\u30b7\u30e7\u30f3\u5185\u306e\u30d1\u30d5\u30a9\u30fc\u30de\u30f3\u30b9\u306e\u554f\u984c\u3084\u30dc\u30c8\u30eb\u30cd\u30c3\u30af\u3092\u8abf\u67fb\u3057\u307e\u3059\u3002"]}),"\n"]}),"\n",(0,r.jsxs)(s.li,{children:["\n",(0,r.jsxs)(s.p,{children:[(0,r.jsx)(s.strong,{children:"\u30a2\u30e9\u30fc\u30c8\u3068\u901a\u77e5\u306e\u8a2d\u5b9a"}),"\uff1aX-Ray \u30e1\u30c8\u30ea\u30af\u30b9\u306b\u57fa\u3065\u3044\u3066 CloudWatch \u30a2\u30e9\u30fc\u30e0\u3068\u901a\u77e5\u3092\u8a2d\u5b9a\u3057\u3001EKS \u30ef\u30fc\u30af\u30ed\u30fc\u30c9\u306e\u30d1\u30d5\u30a9\u30fc\u30de\u30f3\u30b9\u4f4e\u4e0b\u3084\u7570\u5e38\u306b\u95a2\u3059\u308b\u30a2\u30e9\u30fc\u30c8\u3092\u53d7\u3051\u53d6\u308a\u307e\u3059\u3002"]}),"\n"]}),"\n",(0,r.jsxs)(s.li,{children:["\n",(0,r.jsxs)(s.p,{children:[(0,r.jsx)(s.strong,{children:"\u4ed6\u306e\u30aa\u30d6\u30b6\u30fc\u30d0\u30d3\u30ea\u30c6\u30a3\u30c4\u30fc\u30eb\u3068\u306e\u7d71\u5408"}),"\uff1aAWS X-Ray \u3092 AWS CloudWatch Logs\u3001Amazon CloudWatch Metrics\u3001AWS Distro for OpenTelemetry \u306a\u3069\u306e\u4ed6\u306e\u30aa\u30d6\u30b6\u30fc\u30d0\u30d3\u30ea\u30c6\u30a3\u30c4\u30fc\u30eb\u3068\u7d44\u307f\u5408\u308f\u305b\u3066\u3001\u30b3\u30f3\u30c6\u30ca\u5316\u3055\u308c\u305f\u30a2\u30d7\u30ea\u30b1\u30fc\u30b7\u30e7\u30f3\u306e\u30d1\u30d5\u30a9\u30fc\u30de\u30f3\u30b9\u3001\u30ed\u30b0\u3001\u30e1\u30c8\u30ea\u30af\u30b9\u306e\u5305\u62ec\u7684\u306a\u30d3\u30e5\u30fc\u3092\u5f97\u307e\u3059\u3002"]}),"\n"]}),"\n"]}),"\n",(0,r.jsx)(s.p,{children:"AWS X-Ray \u306f EKS \u30ef\u30fc\u30af\u30ed\u30fc\u30c9\u306b\u5f37\u529b\u306a\u30c8\u30ec\u30fc\u30b7\u30f3\u30b0\u6a5f\u80fd\u3092\u63d0\u4f9b\u3057\u307e\u3059\u304c\u3001\u30c8\u30ec\u30fc\u30b9\u30c7\u30fc\u30bf\u306e\u91cf\u3068\u30b3\u30b9\u30c8\u7ba1\u7406\u306a\u3069\u306e\u6f5c\u5728\u7684\u306a\u8ab2\u984c\u3092\u8003\u616e\u3059\u308b\u3053\u3068\u304c\u91cd\u8981\u3067\u3059\u3002\u30b3\u30f3\u30c6\u30ca\u5316\u3055\u308c\u305f\u30a2\u30d7\u30ea\u30b1\u30fc\u30b7\u30e7\u30f3\u304c\u30b9\u30b1\u30fc\u30eb\u30a2\u30c3\u30d7\u3057\u3001\u3088\u308a\u591a\u304f\u306e\u30c8\u30ec\u30fc\u30b9\u30c7\u30fc\u30bf\u3092\u751f\u6210\u3059\u308b\u306b\u3064\u308c\u3066\u3001\u30b3\u30b9\u30c8\u3092\u52b9\u679c\u7684\u306b\u7ba1\u7406\u3059\u308b\u305f\u3081\u306b\u30b5\u30f3\u30d7\u30ea\u30f3\u30b0\u6226\u7565\u3092\u5b9f\u88c5\u3057\u305f\u308a\u3001\u30c8\u30ec\u30fc\u30b9\u30c7\u30fc\u30bf\u306e\u4fdd\u6301\u30dd\u30ea\u30b7\u30fc\u3092\u8abf\u6574\u3057\u305f\u308a\u3059\u308b\u5fc5\u8981\u304c\u3042\u308b\u304b\u3082\u3057\u308c\u307e\u305b\u3093\u3002"}),"\n",(0,r.jsx)(s.p,{children:"\u3055\u3089\u306b\u3001\u30c8\u30ec\u30fc\u30b9\u30c7\u30fc\u30bf\u306e\u9069\u5207\u306a\u30a2\u30af\u30bb\u30b9\u5236\u5fa1\u3068\u30c7\u30fc\u30bf\u30bb\u30ad\u30e5\u30ea\u30c6\u30a3\u3092\u78ba\u4fdd\u3059\u308b\u3053\u3068\u304c\u91cd\u8981\u3067\u3059\u3002AWS X-Ray \u306f\u3001\u4fdd\u5b58\u6642\u304a\u3088\u3073\u8ee2\u9001\u4e2d\u306e\u30c8\u30ec\u30fc\u30b9\u30c7\u30fc\u30bf\u306e\u6697\u53f7\u5316\u3092\u63d0\u4f9b\u3057\u3001\u30c8\u30ec\u30fc\u30b9\u30c7\u30fc\u30bf\u306e\u6a5f\u5bc6\u6027\u3068\u6574\u5408\u6027\u3092\u4fdd\u8b77\u3059\u308b\u305f\u3081\u306e\u8a73\u7d30\u306a\u30a2\u30af\u30bb\u30b9\u5236\u5fa1\u30e1\u30ab\u30cb\u30ba\u30e0\u3082\u63d0\u4f9b\u3057\u307e\u3059\u3002"}),"\n",(0,r.jsx)(s.p,{children:"\u7d50\u8ad6\u3068\u3057\u3066\u3001AWS X-Ray \u3092 Amazon EKS \u30ef\u30fc\u30af\u30ed\u30fc\u30c9\u3068\u7d71\u5408\u3059\u308b\u3053\u3068\u306f\u3001\u30b3\u30f3\u30c6\u30ca\u5316\u3055\u308c\u305f\u30a2\u30d7\u30ea\u30b1\u30fc\u30b7\u30e7\u30f3\u306e\u30aa\u30d6\u30b6\u30fc\u30d0\u30d3\u30ea\u30c6\u30a3\u3092\u5411\u4e0a\u3055\u305b\u308b\u305f\u3081\u306e\u5f37\u529b\u306a\u30a2\u30d7\u30ed\u30fc\u30c1\u3067\u3059\u3002AWS X-Ray \u306f\u3001\u30ea\u30af\u30a8\u30b9\u30c8\u3092\u30a8\u30f3\u30c9\u30c4\u30fc\u30a8\u30f3\u30c9\u3067\u30c8\u30ec\u30fc\u30b9\u3057\u3001\u8a73\u7d30\u306a\u30d1\u30d5\u30a9\u30fc\u30de\u30f3\u30b9\u30e1\u30c8\u30ea\u30af\u30b9\u3092\u63d0\u4f9b\u3059\u308b\u3053\u3068\u3067\u3001\u554f\u984c\u3092\u3088\u308a\u52b9\u679c\u7684\u306b\u7279\u5b9a\u304a\u3088\u3073\u30c8\u30e9\u30d6\u30eb\u30b7\u30e5\u30fc\u30c6\u30a3\u30f3\u30b0\u3057\u3001\u30ea\u30bd\u30fc\u30b9\u4f7f\u7528\u7387\u3092\u6700\u9069\u5316\u3057\u3001\u30b3\u30f3\u30c6\u30ca\u5316\u3055\u308c\u305f\u30a2\u30d7\u30ea\u30b1\u30fc\u30b7\u30e7\u30f3\u306e\u52d5\u4f5c\u3068\u30d1\u30d5\u30a9\u30fc\u30de\u30f3\u30b9\u306b\u3064\u3044\u3066\u3088\u308a\u6df1\u3044\u6d1e\u5bdf\u3092\u5f97\u308b\u3053\u3068\u304c\u3067\u304d\u307e\u3059\u3002AWS X-Ray \u3068\u4ed6\u306e AWS \u30aa\u30d6\u30b6\u30fc\u30d0\u30d3\u30ea\u30c6\u30a3\u30b5\u30fc\u30d3\u30b9\u3092\u7d71\u5408\u3059\u308b\u3053\u3068\u3067\u3001\u30af\u30e9\u30a6\u30c9\u4e0a\u3067\u9ad8\u5ea6\u306b\u89b3\u6e2c\u53ef\u80fd\u3067\u4fe1\u983c\u6027\u304c\u9ad8\u304f\u3001\u30d1\u30d5\u30a9\u30fc\u30de\u30f3\u30b9\u306e\u9ad8\u3044\u30b3\u30f3\u30c6\u30ca\u5316\u3055\u308c\u305f\u30a2\u30d7\u30ea\u30b1\u30fc\u30b7\u30e7\u30f3\u3092\u69cb\u7bc9\u304a\u3088\u3073\u7dad\u6301\u3059\u308b\u3053\u3068\u304c\u3067\u304d\u307e\u3059\u3002"})]})}function x(n={}){const{wrapper:s}={...(0,t.R)(),...n.components};return s?(0,r.jsx)(s,{...n,children:(0,r.jsx)(d,{...n})}):d(n)}},92841:(n,s,e)=>{e.d(s,{A:()=>r});const r=e.p+"assets/images/xrayeks-fdcd6824a022699992c6ed600bc722b1.png"},28453:(n,s,e)=>{e.d(s,{R:()=>a,x:()=>c});var r=e(96540);const t={},i=r.createContext(t);function a(n){const s=r.useContext(i);return r.useMemo((function(){return"function"==typeof n?n(s):{...s,...n}}),[s,n])}function c(n){let s;return s=n.disableParentContext?"function"==typeof n.components?n.components(t):n.components||t:a(n.components),r.createElement(i.Provider,{value:s},n.children)}}}]);
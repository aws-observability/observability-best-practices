"use strict";(self.webpackChunkobservability_best_practices=self.webpackChunkobservability_best_practices||[]).push([[4210],{92407:(e,s,n)=>{n.r(s),n.d(s,{assets:()=>r,contentTitle:()=>i,default:()=>u,frontMatter:()=>o,metadata:()=>a,toc:()=>l});var t=n(74848),c=n(28453);const o={},i="Kubecost \u3092\u4f7f\u7528\u3057\u305f\u30b3\u30b9\u30c8\u306e\u53ef\u8996\u5316\u3068\u30ea\u30bd\u30fc\u30b9\u306e\u9069\u5207\u306a\u30b5\u30a4\u30ba\u8a2d\u5b9a",a={id:"guides/cost/kubecost",title:"Kubecost \u3092\u4f7f\u7528\u3057\u305f\u30b3\u30b9\u30c8\u306e\u53ef\u8996\u5316\u3068\u30ea\u30bd\u30fc\u30b9\u306e\u9069\u5207\u306a\u30b5\u30a4\u30ba\u8a2d\u5b9a",description:"Kubecost \u306f\u3001Kubernetes \u74b0\u5883\u3067\u306e\u30b3\u30b9\u30c8\u3068\u30ea\u30bd\u30fc\u30b9\u52b9\u7387\u306e\u53ef\u8996\u5316\u3092\u9867\u5ba2\u306b\u63d0\u4f9b\u3057\u307e\u3059\u3002",source:"@site/i18n/ja/docusaurus-plugin-content-docs/current/guides/cost/kubecost.md",sourceDirName:"guides/cost",slug:"/guides/cost/kubecost",permalink:"/observability-best-practices/ja/docs/guides/cost/kubecost",draft:!1,unlisted:!1,editUrl:"https://github.com/aws-observability/observability-best-practices/blob/main/docusaurus/docs/guides/cost/kubecost.md",tags:[],version:"current",frontMatter:{},sidebar:"guides",previous:{title:"\u30c8\u30ec\u30fc\u30b7\u30f3\u30b0\u30a8\u30fc\u30b8\u30a7\u30f3\u30c8\u306e\u9078\u629e",permalink:"/observability-best-practices/ja/docs/guides/choosing-a-tracing-agent"},next:{title:"OLA for Existing EC2 Workloads",permalink:"/observability-best-practices/ja/docs/guides/cost/OLA-EC2-righsizing"}},r={},l=[{value:"Kubecost \u3092\u4f7f\u7528\u3059\u308b\u7406\u7531",id:"kubecost-\u3092\u4f7f\u7528\u3059\u308b\u7406\u7531",level:2},{value:"\u304a\u3059\u3059\u3081",id:"\u304a\u3059\u3059\u3081",level:2},{value:"\u30b3\u30b9\u30c8\u5272\u308a\u5f53\u3066",id:"\u30b3\u30b9\u30c8\u5272\u308a\u5f53\u3066",level:3},{value:"\u52b9\u7387\u6027",id:"\u52b9\u7387\u6027",level:3},{value:"\u30a2\u30a4\u30c9\u30eb\u30b3\u30b9\u30c8",id:"\u30a2\u30a4\u30c9\u30eb\u30b3\u30b9\u30c8",level:3},{value:"\u30cd\u30c3\u30c8\u30ef\u30fc\u30af\u30b3\u30b9\u30c8",id:"\u30cd\u30c3\u30c8\u30ef\u30fc\u30af\u30b3\u30b9\u30c8",level:3},{value:"\u30ef\u30fc\u30af\u30ed\u30fc\u30c9\u306e\u6700\u9069\u5316",id:"\u30ef\u30fc\u30af\u30ed\u30fc\u30c9\u306e\u6700\u9069\u5316",level:3},{value:"Kubecost \u3068 Amazon Managed Service for Prometheus \u306e\u7d71\u5408",id:"kubecost-\u3068-amazon-managed-service-for-prometheus-\u306e\u7d71\u5408",level:3},{value:"Kubecost UI \u3078\u306e\u30a2\u30af\u30bb\u30b9",id:"kubecost-ui-\u3078\u306e\u30a2\u30af\u30bb\u30b9",level:3},{value:"\u30de\u30eb\u30c1\u30af\u30e9\u30b9\u30bf\u30fc\u30d3\u30e5\u30fc",id:"\u30de\u30eb\u30c1\u30af\u30e9\u30b9\u30bf\u30fc\u30d3\u30e5\u30fc",level:3},{value:"\u53c2\u8003\u6587\u732e",id:"\u53c2\u8003\u6587\u732e",level:3}];function d(e){const s={a:"a",admonition:"admonition",code:"code",h1:"h1",h2:"h2",h3:"h3",img:"img",li:"li",p:"p",pre:"pre",ul:"ul",...(0,c.R)(),...e.components};return(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)(s.h1,{id:"kubecost-\u3092\u4f7f\u7528\u3057\u305f\u30b3\u30b9\u30c8\u306e\u53ef\u8996\u5316\u3068\u30ea\u30bd\u30fc\u30b9\u306e\u9069\u5207\u306a\u30b5\u30a4\u30ba\u8a2d\u5b9a",children:"Kubecost \u3092\u4f7f\u7528\u3057\u305f\u30b3\u30b9\u30c8\u306e\u53ef\u8996\u5316\u3068\u30ea\u30bd\u30fc\u30b9\u306e\u9069\u5207\u306a\u30b5\u30a4\u30ba\u8a2d\u5b9a"}),"\n",(0,t.jsx)(s.p,{children:"Kubecost \u306f\u3001Kubernetes \u74b0\u5883\u3067\u306e\u30b3\u30b9\u30c8\u3068\u30ea\u30bd\u30fc\u30b9\u52b9\u7387\u306e\u53ef\u8996\u5316\u3092\u9867\u5ba2\u306b\u63d0\u4f9b\u3057\u307e\u3059\u3002\n\u9ad8\u30ec\u30d9\u30eb\u3067\u306f\u3001Amazon EKS \u306e\u30b3\u30b9\u30c8\u30e2\u30cb\u30bf\u30ea\u30f3\u30b0\u306f Kubecost \u3068\u3068\u3082\u306b\u30c7\u30d7\u30ed\u30a4\u3055\u308c\u307e\u3059\u3002\u3053\u308c\u306b\u306f\u3001\u30aa\u30fc\u30d7\u30f3\u30bd\u30fc\u30b9\u306e\u30e2\u30cb\u30bf\u30ea\u30f3\u30b0\u30b7\u30b9\u30c6\u30e0\u304a\u3088\u3073\u6642\u7cfb\u5217\u30c7\u30fc\u30bf\u30d9\u30fc\u30b9\u3067\u3042\u308b Prometheus \u304c\u542b\u307e\u308c\u307e\u3059\u3002\nKubecost \u306f Prometheus \u304b\u3089\u30e1\u30c8\u30ea\u30af\u30b9\u3092\u8aad\u307f\u53d6\u308a\u3001\u30b3\u30b9\u30c8\u5272\u308a\u5f53\u3066\u8a08\u7b97\u3092\u5b9f\u884c\u3057\u3001\u30e1\u30c8\u30ea\u30af\u30b9\u3092 Prometheus \u306b\u66f8\u304d\u623b\u3057\u307e\u3059\u3002\n\u6700\u5f8c\u306b\u3001Kubecost \u30d5\u30ed\u30f3\u30c8\u30a8\u30f3\u30c9\u304c Prometheus \u304b\u3089\u30e1\u30c8\u30ea\u30af\u30b9\u3092\u8aad\u307f\u53d6\u308a\u3001Kubecost \u30e6\u30fc\u30b6\u30fc\u30a4\u30f3\u30bf\u30fc\u30d5\u30a7\u30a4\u30b9 (UI) \u306b\u8868\u793a\u3057\u307e\u3059\u3002\n\u30a2\u30fc\u30ad\u30c6\u30af\u30c1\u30e3\u306f\u6b21\u306e\u56f3\u306b\u3088\u3063\u3066\u793a\u3055\u308c\u307e\u3059\u3002"}),"\n",(0,t.jsx)(s.p,{children:(0,t.jsx)(s.img,{alt:"Architecture",src:n(70174).A+"",width:"1032",height:"774"})}),"\n",(0,t.jsx)(s.h2,{id:"kubecost-\u3092\u4f7f\u7528\u3059\u308b\u7406\u7531",children:"Kubecost \u3092\u4f7f\u7528\u3059\u308b\u7406\u7531"}),"\n",(0,t.jsx)(s.p,{children:"\u304a\u5ba2\u69d8\u304c\u30a2\u30d7\u30ea\u30b1\u30fc\u30b7\u30e7\u30f3\u3092\u30e2\u30c0\u30ca\u30a4\u30ba\u3057\u3001Amazon EKS \u3092\u4f7f\u7528\u3057\u3066\u30ef\u30fc\u30af\u30ed\u30fc\u30c9\u3092\u30c7\u30d7\u30ed\u30a4\u3059\u308b\u306b\u3064\u308c\u3066\u3001\u30a2\u30d7\u30ea\u30b1\u30fc\u30b7\u30e7\u30f3\u3092\u5b9f\u884c\u3059\u308b\u305f\u3081\u306b\u5fc5\u8981\u306a\u30b3\u30f3\u30d4\u30e5\u30fc\u30c6\u30a3\u30f3\u30b0\u30ea\u30bd\u30fc\u30b9\u3092\u7d71\u5408\u3059\u308b\u3053\u3068\u3067\u52b9\u7387\u6027\u304c\u5411\u4e0a\u3057\u307e\u3059\u3002\u305f\u3060\u3057\u3001\u3053\u306e\u5229\u7528\u52b9\u7387\u306e\u5411\u4e0a\u306f\u3001\u30a2\u30d7\u30ea\u30b1\u30fc\u30b7\u30e7\u30f3\u30b3\u30b9\u30c8\u306e\u6e2c\u5b9a\u304c\u56f0\u96e3\u306b\u306a\u308b\u3068\u3044\u3046\u30c8\u30ec\u30fc\u30c9\u30aa\u30d5\u304c\u4f34\u3044\u307e\u3059\u3002\u4eca\u65e5\u3001\u30c6\u30ca\u30f3\u30c8\u3054\u3068\u306b\u30b3\u30b9\u30c8\u3092\u5206\u6563\u3059\u308b\u305f\u3081\u306b\u3001\u6b21\u306e\u65b9\u6cd5\u306e\u3044\u305a\u308c\u304b\u3092\u4f7f\u7528\u3067\u304d\u307e\u3059\u3002"}),"\n",(0,t.jsxs)(s.ul,{children:["\n",(0,t.jsx)(s.li,{children:"\u30cf\u30fc\u30c9\u30de\u30eb\u30c1\u30c6\u30ca\u30f3\u30b7\u30fc - \u5c02\u7528\u306e AWS \u30a2\u30ab\u30a6\u30f3\u30c8\u3067\u500b\u5225\u306e EKS \u30af\u30e9\u30b9\u30bf\u30fc\u3092\u5b9f\u884c\u3057\u307e\u3059\u3002"}),"\n",(0,t.jsx)(s.li,{children:"\u30bd\u30d5\u30c8\u30de\u30eb\u30c1\u30c6\u30ca\u30f3\u30b7\u30fc \u2013 \u5171\u6709 EKS \u30af\u30e9\u30b9\u30bf\u30fc\u3067\u8907\u6570\u306e\u30ce\u30fc\u30c9\u30b0\u30eb\u30fc\u30d7\u3092\u5b9f\u884c\u3057\u307e\u3059\u3002"}),"\n",(0,t.jsx)(s.li,{children:"\u6d88\u8cbb\u30d9\u30fc\u30b9\u306e\u8ab2\u91d1 \u2013 \u5171\u6709 EKS \u30af\u30e9\u30b9\u30bf\u30fc\u3067\u767a\u751f\u3057\u305f\u30b3\u30b9\u30c8\u3092\u30ea\u30bd\u30fc\u30b9\u6d88\u8cbb\u91cf\u3067\u8a08\u7b97\u3057\u307e\u3059\u3002"}),"\n"]}),"\n",(0,t.jsxs)(s.p,{children:["\u30cf\u30fc\u30c9\u30de\u30eb\u30c1\u30c6\u30ca\u30f3\u30b7\u30fc\u306e\u5834\u5408\u3001\u30ef\u30fc\u30af\u30ed\u30fc\u30c9\u306f\u500b\u5225\u306e EKS \u30af\u30e9\u30b9\u30bf\u30fc\u306b\u30c7\u30d7\u30ed\u30a4\u3055\u308c\u3001\u30af\u30e9\u30b9\u30bf\u30fc\u3068\u305d\u306e\u4f9d\u5b58\u95a2\u4fc2\u306b\u304b\u304b\u308b\u30b3\u30b9\u30c8\u3092\u3001\u5404\u30c6\u30ca\u30f3\u30c8\u306e\u652f\u51fa\u3092\u5224\u65ad\u3059\u308b\u30ec\u30dd\u30fc\u30c8\u3092\u5b9f\u884c\u3059\u308b\u3053\u3068\u306a\u304f\u8b58\u5225\u3067\u304d\u307e\u3059\u3002\n\u30bd\u30d5\u30c8\u30de\u30eb\u30c1\u30c6\u30ca\u30f3\u30b7\u30fc\u306e\u5834\u5408\u306f\u3001",(0,t.jsx)(s.a,{href:"https://kubernetes.io/docs/concepts/scheduling-eviction/assign-pod-node/#nodeselector",children:"Node Selectors"})," \u3084 ",(0,t.jsx)(s.a,{href:"https://kubernetes.io/docs/concepts/scheduling-eviction/assign-pod-node/#affinity-and-anti-affinity",children:"Node Affinity"})," \u306a\u3069\u306e Kubernetes \u6a5f\u80fd\u3092\u4f7f\u7528\u3057\u3066\u3001Kubernetes \u30b9\u30b1\u30b8\u30e5\u30fc\u30e9\u30fc\u306b\u30c6\u30ca\u30f3\u30c8\u306e\u30ef\u30fc\u30af\u30ed\u30fc\u30c9\u3092\u5c02\u7528\u306e\u30ce\u30fc\u30c9\u30b0\u30eb\u30fc\u30d7\u3067\u5b9f\u884c\u3059\u308b\u3088\u3046\u6307\u793a\u3067\u304d\u307e\u3059\u3002\u30ce\u30fc\u30c9\u30b0\u30eb\u30fc\u30d7\u306e EC2 \u30a4\u30f3\u30b9\u30bf\u30f3\u30b9\u306b\u8b58\u5225\u5b50(\u88fd\u54c1\u540d\u3084\u30c1\u30fc\u30e0\u540d\u306a\u3069)\u3067\u30bf\u30b0\u4ed8\u3051\u3057\u3001",(0,t.jsx)(s.a,{href:"https://docs.aws.amazon.com/ja_jp/awsaccountbilling/latest/aboutv2/cost-alloc-tags.html",children:"\u30bf\u30b0"})," \u3092\u4f7f\u7528\u3057\u3066\u30b3\u30b9\u30c8\u3092\u5206\u6563\u3067\u304d\u307e\u3059\u3002"]}),"\n",(0,t.jsx)(s.p,{children:"\u4e0a\u8a182\u3064\u306e\u30a2\u30d7\u30ed\u30fc\u30c1\u306e\u6b20\u70b9\u306f\u3001\u672a\u4f7f\u7528\u306e\u5bb9\u91cf\u304c\u767a\u751f\u3059\u308b\u53ef\u80fd\u6027\u304c\u3042\u308a\u3001\u5bc6\u96c6\u3057\u305f\u30af\u30e9\u30b9\u30bf\u30fc\u3092\u5b9f\u884c\u3059\u308b\u3068\u304d\u306b\u5f97\u3089\u308c\u308b\u30b3\u30b9\u30c8\u524a\u6e1b\u306e\u30e1\u30ea\u30c3\u30c8\u3092\u5341\u5206\u306b\u6d3b\u7528\u3067\u304d\u306a\u3044\u3053\u3068\u3067\u3059\u3002Elastic Load Balancing\u3001\u30cd\u30c3\u30c8\u30ef\u30fc\u30af\u8ee2\u9001\u6599\u91d1\u306a\u3069\u306e\u5171\u6709\u30ea\u30bd\u30fc\u30b9\u306e\u30b3\u30b9\u30c8\u3092\u5272\u308a\u5f53\u3066\u308b\u65b9\u6cd5\u304c\u307e\u3060\u5fc5\u8981\u3067\u3059\u3002"}),"\n",(0,t.jsx)(s.p,{children:"\u30de\u30eb\u30c1\u30c6\u30ca\u30f3\u30c8 Kubernetes \u30af\u30e9\u30b9\u30bf\u30fc\u3067\u30b3\u30b9\u30c8\u3092\u8ffd\u8de1\u3059\u308b\u6700\u3082\u52b9\u7387\u7684\u306a\u65b9\u6cd5\u306f\u3001\u30ef\u30fc\u30af\u30ed\u30fc\u30c9\u306b\u3088\u3063\u3066\u6d88\u8cbb\u3055\u308c\u305f\u30ea\u30bd\u30fc\u30b9\u91cf\u306b\u57fa\u3065\u3044\u3066\u767a\u751f\u3057\u305f\u30b3\u30b9\u30c8\u3092\u5206\u6563\u3059\u308b\u3053\u3068\u3067\u3059\u3002\u3053\u306e\u30d1\u30bf\u30fc\u30f3\u306b\u3088\u308a\u3001\u7570\u306a\u308b\u30ef\u30fc\u30af\u30ed\u30fc\u30c9\u304c\u30ce\u30fc\u30c9\u3092\u5171\u6709\u3067\u304d\u308b\u305f\u3081\u3001\u30ce\u30fc\u30c9\u306e Pod \u5bc6\u5ea6\u3092\u9ad8\u3081\u308b\u3053\u3068\u304c\u3067\u304d\u3001EC2 \u30a4\u30f3\u30b9\u30bf\u30f3\u30b9\u306e\u5229\u7528\u7387\u3092\u6700\u5927\u5316\u3067\u304d\u307e\u3059\u3002\u305f\u3060\u3057\u3001\u30ef\u30fc\u30af\u30ed\u30fc\u30c9\u307e\u305f\u306f\u540d\u524d\u7a7a\u9593\u3054\u3068\u306b\u30b3\u30b9\u30c8\u3092\u8a08\u7b97\u3059\u308b\u3053\u3068\u306f\u56f0\u96e3\u306a\u4f5c\u696d\u3067\u3059\u3002 \u30ef\u30fc\u30af\u30ed\u30fc\u30c9\u306e\u30b3\u30b9\u30c8\u8cac\u4efb\u3092\u7406\u89e3\u3059\u308b\u306b\u306f\u3001\u7279\u5b9a\u306e\u671f\u9593\u4e2d\u306b\u6d88\u8cbb\u307e\u305f\u306f\u4e88\u7d04\u3055\u308c\u305f\u3059\u3079\u3066\u306e\u30ea\u30bd\u30fc\u30b9\u3092\u96c6\u8a08\u3057\u3001\u30ea\u30bd\u30fc\u30b9\u306e\u30b3\u30b9\u30c8\u3068\u4f7f\u7528\u671f\u9593\u306b\u57fa\u3065\u3044\u3066\u6599\u91d1\u3092\u8a55\u4fa1\u3059\u308b\u5fc5\u8981\u304c\u3042\u308a\u307e\u3059\u3002 \u3053\u308c\u306f\u3001Kubecost \u304c\u5bfe\u51e6\u3059\u308b\u3053\u3068\u3092\u5c02\u9580\u3068\u3057\u3066\u3044\u308b\u6b63\u78ba\u306a\u8ab2\u984c\u3067\u3059\u3002"}),"\n",(0,t.jsx)(s.admonition,{type:"tip",children:(0,t.jsxs)(s.p,{children:[(0,t.jsx)(s.a,{href:"https://catalog.workshops.aws/observability/ja-JP/aws-managed-oss/amp/ingest-kubecost-metrics",children:"\u30ef\u30f3\u30aa\u30d6\u30b6\u30fc\u30d0\u30d3\u30ea\u30c6\u30a3\u30ef\u30fc\u30af\u30b7\u30e7\u30c3\u30d7"})," \u3092\u3054\u89a7\u3044\u305f\u3060\u304d\u3001Kubecost \u306e\u30cf\u30f3\u30ba\u30aa\u30f3\u4f53\u9a13\u3092\u3057\u3066\u307f\u3066\u304f\u3060\u3055\u3044\u3002"]})}),"\n",(0,t.jsx)(s.h2,{id:"\u304a\u3059\u3059\u3081",children:"\u304a\u3059\u3059\u3081"}),"\n",(0,t.jsx)(s.h3,{id:"\u30b3\u30b9\u30c8\u5272\u308a\u5f53\u3066",children:"\u30b3\u30b9\u30c8\u5272\u308a\u5f53\u3066"}),"\n",(0,t.jsx)(s.p,{children:"Kubecost \u306e\u30b3\u30b9\u30c8\u5272\u308a\u5f53\u3066\u30c0\u30c3\u30b7\u30e5\u30dc\u30fc\u30c9\u3092\u4f7f\u7528\u3059\u308b\u3068\u3001\u540d\u524d\u7a7a\u9593\u3001k8s \u30e9\u30d9\u30eb\u3001\u30b5\u30fc\u30d3\u30b9\u306a\u3069\u3001\u3059\u3079\u3066\u306e\u30cd\u30a4\u30c6\u30a3\u30d6 Kubernetes \u306e\u6982\u5ff5\u306b\u308f\u305f\u3063\u3066\u5272\u308a\u5f53\u3066\u3089\u308c\u305f\u652f\u51fa\u3068\u6700\u9069\u5316\u306e\u6a5f\u4f1a\u3092\u3059\u3070\u3084\u304f\u78ba\u8a8d\u3067\u304d\u307e\u3059\u3002\u307e\u305f\u3001\u30c1\u30fc\u30e0\u3001\u88fd\u54c1/\u30d7\u30ed\u30b8\u30a7\u30af\u30c8\u3001\u90e8\u9580\u3001\u74b0\u5883\u306a\u3069\u306e\u7d44\u7e54\u7684\u6982\u5ff5\u306b\u30b3\u30b9\u30c8\u3092\u5272\u308a\u5f53\u3066\u308b\u3053\u3068\u3082\u3067\u304d\u307e\u3059\u3002 \u65e5\u4ed8\u7bc4\u56f2\u3001\u30d5\u30a3\u30eb\u30bf\u30fc\u3092\u5909\u66f4\u3057\u3066\u3001\u7279\u5b9a\u306e\u30ef\u30fc\u30af\u30ed\u30fc\u30c9\u306b\u95a2\u3059\u308b\u6d1e\u5bdf\u3092\u5f97\u305f\u308a\u3001\u30ec\u30dd\u30fc\u30c8\u3092\u4fdd\u5b58\u3057\u305f\u308a\u3067\u304d\u307e\u3059\u3002 Kubernetes \u306e\u30b3\u30b9\u30c8\u3092\u6700\u9069\u5316\u3059\u308b\u306b\u306f\u3001\u52b9\u7387\u3068\u30af\u30e9\u30b9\u30bf\u306e\u30a2\u30a4\u30c9\u30eb\u30b3\u30b9\u30c8\u306b\u6ce8\u610f\u3092\u6255\u3046\u5fc5\u8981\u304c\u3042\u308a\u307e\u3059\u3002"}),"\n",(0,t.jsx)(s.p,{children:(0,t.jsx)(s.img,{alt:"Allocations",src:n(56155).A+"",width:"2292",height:"854"})}),"\n",(0,t.jsx)(s.h3,{id:"\u52b9\u7387\u6027",children:"\u52b9\u7387\u6027"}),"\n",(0,t.jsx)(s.p,{children:"Pod \u306e\u30ea\u30bd\u30fc\u30b9\u52b9\u7387\u6027\u306f\u3001\u7279\u5b9a\u306e\u6642\u9593\u30a6\u30a3\u30f3\u30c9\u30a6\u306b\u304a\u3051\u308b\u30ea\u30bd\u30fc\u30b9\u5229\u7528\u7387\u3068\u30ea\u30bd\u30fc\u30b9\u8981\u6c42\u306e\u6bd4\u7387\u3068\u3057\u3066\u5b9a\u7fa9\u3055\u308c\u307e\u3059\u3002\u3053\u308c\u306f\u30b3\u30b9\u30c8\u91cd\u307f\u4ed8\u3051\u3055\u308c\u3066\u304a\u308a\u3001\u6b21\u306e\u3088\u3046\u306b\u8868\u3059\u3053\u3068\u304c\u3067\u304d\u307e\u3059\u3002"}),"\n",(0,t.jsx)(s.pre,{children:(0,t.jsx)(s.code,{children:"(((CPU Usage / CPU Requested) * CPU Cost) + ((RAM Usage / RAM Requested) * RAM Cost)) / (RAM Cost + CPU Cost)\n"})}),"\n",(0,t.jsx)(s.p,{children:"\u3053\u3053\u3067\u3001CPU \u4f7f\u7528\u91cf = \u6642\u9593\u30a6\u30a3\u30f3\u30c9\u30a6\u306b\u304a\u3051\u308b rate(container_cpu_usage_seconds_total)\nRAM \u4f7f\u7528\u91cf = \u6642\u9593\u30a6\u30a3\u30f3\u30c9\u30a6\u306b\u304a\u3051\u308b avg(container_memory_working_set_bytes)"}),"\n",(0,t.jsx)(s.p,{children:"AWS \u3067\u306f\u660e\u793a\u7684\u306a RAM\u3001CPU\u3001GPU \u306e\u4fa1\u683c\u304c\u63d0\u4f9b\u3055\u308c\u3066\u3044\u306a\u3044\u305f\u3081\u3001Kubecost \u30e2\u30c7\u30eb\u306f\u5165\u529b\u3055\u308c\u305f\u57fa\u672c\u7684\u306a CPU\u3001GPU\u3001RAM \u4fa1\u683c\u306e\u6bd4\u7387\u306b\u30d5\u30a9\u30fc\u30eb\u30d0\u30c3\u30af\u3057\u307e\u3059\u3002\u3053\u308c\u3089\u306e\u30d1\u30e9\u30e1\u30fc\u30bf\u306e\u30c7\u30d5\u30a9\u30eb\u30c8\u5024\u306f\u3001\u30af\u30e9\u30a6\u30c9\u30d7\u30ed\u30d0\u30a4\u30c0\u306e\u9650\u754c\u30ea\u30bd\u30fc\u30b9\u30ec\u30fc\u30c8\u306b\u57fa\u3065\u3044\u3066\u3044\u307e\u3059\u304c\u3001Kubecost \u5185\u3067\u30ab\u30b9\u30bf\u30de\u30a4\u30ba\u3067\u304d\u307e\u3059\u3002\u3053\u308c\u3089\u306e\u57fa\u672c\u7684\u306a\u30ea\u30bd\u30fc\u30b9(RAM / CPU / GPU)\u4fa1\u683c\u306f\u3001\u30d7\u30ed\u30d0\u30a4\u30c0\u30fc\u306e\u8ab2\u91d1\u30ec\u30fc\u30c8\u306b\u57fa\u3065\u3044\u3066\u30d7\u30ed\u30d3\u30b8\u30e7\u30cb\u30f3\u30b0\u3055\u308c\u305f\u30ce\u30fc\u30c9\u306e\u5168\u4fa1\u683c\u306e\u5408\u8a08\u304c\u7b49\u3057\u304f\u306a\u308b\u3088\u3046\u306b\u6b63\u898f\u5316\u3055\u308c\u307e\u3059\u3002"}),"\n",(0,t.jsx)(s.p,{children:"\u6700\u5927\u9650\u306e\u52b9\u7387\u306b\u5411\u3051\u3066\u79fb\u884c\u3057\u3001\u30ef\u30fc\u30af\u30ed\u30fc\u30c9\u3092\u5fae\u8abf\u6574\u3057\u3066\u76ee\u6a19\u3092\u9054\u6210\u3059\u308b\u3053\u3068\u306f\u3001\u5404\u30b5\u30fc\u30d3\u30b9\u30c1\u30fc\u30e0\u306e\u8cac\u4efb\u3067\u3059\u3002"}),"\n",(0,t.jsx)(s.h3,{id:"\u30a2\u30a4\u30c9\u30eb\u30b3\u30b9\u30c8",children:"\u30a2\u30a4\u30c9\u30eb\u30b3\u30b9\u30c8"}),"\n",(0,t.jsx)(s.p,{children:"\u30af\u30e9\u30b9\u30bf\u306e\u30a2\u30a4\u30c9\u30eb\u30b3\u30b9\u30c8\u306f\u3001\u5272\u308a\u5f53\u3066\u3089\u308c\u305f\u30ea\u30bd\u30fc\u30b9\u306e\u30b3\u30b9\u30c8\u3068\u3001\u305d\u308c\u3089\u304c\u5b9f\u884c\u3055\u308c\u3066\u3044\u308b\u30cf\u30fc\u30c9\u30a6\u30a7\u30a2\u306e\u30b3\u30b9\u30c8\u306e\u5dee\u5206\u3068\u3057\u3066\u5b9a\u7fa9\u3055\u308c\u307e\u3059\u3002\u5272\u308a\u5f53\u3066\u306f\u3001\u4f7f\u7528\u91cf\u3068\u30ea\u30af\u30a8\u30b9\u30c8\u306e\u6700\u5927\u5024\u3068\u3057\u3066\u5b9a\u7fa9\u3055\u308c\u307e\u3059\u3002\u6b21\u306e\u3088\u3046\u306b\u3082\u8868\u3059\u3053\u3068\u304c\u3067\u304d\u307e\u3059\u3002"}),"\n",(0,t.jsx)(s.pre,{children:(0,t.jsx)(s.code,{children:"idle_cost = sum(node_cost) - (cpu_allocation_cost + ram_allocation_cost + gpu_allocation_cost)\n"})}),"\n",(0,t.jsx)(s.p,{children:"\u3053\u3053\u3067\u3001\u5272\u308a\u5f53\u3066 = max(\u30ea\u30af\u30a8\u30b9\u30c8\u3001\u4f7f\u7528\u91cf)"}),"\n",(0,t.jsx)(s.p,{children:"\u3057\u305f\u304c\u3063\u3066\u3001\u30a2\u30a4\u30c9\u30eb\u30b3\u30b9\u30c8\u306f\u3001\u65e2\u5b58\u306e\u30ef\u30fc\u30af\u30ed\u30fc\u30c9\u3092\u4e2d\u65ad\u3059\u308b\u3053\u3068\u306a\u304f\u3001Kubernetes \u30b9\u30b1\u30b8\u30e5\u30fc\u30e9\u304c\u30dd\u30c3\u30c9\u3092\u30b9\u30b1\u30b8\u30e5\u30fc\u30eb\u3067\u304d\u308b\u30b9\u30da\u30fc\u30b9\u306e\u30b3\u30b9\u30c8\u3068\u3057\u3066\u3082\u8003\u3048\u308b\u3053\u3068\u304c\u3067\u304d\u307e\u3059\u304c\u3001\u73fe\u5728\u306f\u305d\u3046\u306a\u3063\u3066\u3044\u307e\u305b\u3093\u3002\u30ef\u30fc\u30af\u30ed\u30fc\u30c9\u3001\u30af\u30e9\u30b9\u30bf\u3001\u30ce\u30fc\u30c9\u306a\u3069\u3001\u69cb\u6210\u65b9\u6cd5\u306b\u5fdc\u3058\u3066\u5206\u6563\u3055\u305b\u308b\u3053\u3068\u304c\u3067\u304d\u307e\u3059\u3002"}),"\n",(0,t.jsx)(s.h3,{id:"\u30cd\u30c3\u30c8\u30ef\u30fc\u30af\u30b3\u30b9\u30c8",children:"\u30cd\u30c3\u30c8\u30ef\u30fc\u30af\u30b3\u30b9\u30c8"}),"\n",(0,t.jsxs)(s.p,{children:["Kubecost \u306f\u30d9\u30b9\u30c8\u30a8\u30d5\u30a9\u30fc\u30c8\u3067\u3001\u3053\u308c\u3089\u306e\u30b3\u30b9\u30c8\u3092\u767a\u751f\u3055\u305b\u3066\u3044\u308b\u30ef\u30fc\u30af\u30ed\u30fc\u30c9\u306b\u30cd\u30c3\u30c8\u30ef\u30fc\u30af\u8ee2\u9001\u30b3\u30b9\u30c8\u3092\u5272\u308a\u5f53\u3066\u307e\u3059\u3002\n\u30cd\u30c3\u30c8\u30ef\u30fc\u30af\u30b3\u30b9\u30c8\u3092\u6b63\u78ba\u306b\u5224\u65ad\u3059\u308b\u65b9\u6cd5\u306f\u3001",(0,t.jsx)(s.a,{href:"https://docs.kubecost.com/install-and-configure/install/cloud-integration/aws-cloud-integrations",children:"AWS \u30af\u30e9\u30a6\u30c9\u30a4\u30f3\u30c6\u30b0\u30ec\u30fc\u30b7\u30e7\u30f3"})," \u3068 ",(0,t.jsx)(s.a,{href:"https://docs.kubecost.com/install-and-configure/advanced-configuration/network-costs-configuration",children:"Network costs daemonset"})," \u306e\u7d44\u307f\u5408\u308f\u305b\u3092\u4f7f\u7528\u3059\u308b\u3053\u3068\u3067\u3059\u3002"]}),"\n",(0,t.jsx)(s.p,{children:"\u52b9\u7387\u30b9\u30b3\u30a2\u3068\u30a2\u30a4\u30c9\u30eb\u30b3\u30b9\u30c8\u3092\u8003\u616e\u3057\u3066\u3001\u30af\u30e9\u30b9\u30bf\u30fc\u306e\u5b8c\u5168\u306a\u30dd\u30c6\u30f3\u30b7\u30e3\u30eb\u3092\u5229\u7528\u3059\u308b\u3053\u3068\u3092\u78ba\u8a8d\u3059\u308b\u305f\u3081\u306b\u3001\u30ef\u30fc\u30af\u30ed\u30fc\u30c9\u3092\u5fae\u8abf\u6574\u3059\u308b\u5fc5\u8981\u304c\u3042\u308a\u307e\u3059\u3002\u3053\u308c\u304c\u6b21\u306e\u30c8\u30d4\u30c3\u30af\u3001\u30af\u30e9\u30b9\u30bf\u30fc\u306e\u9069\u5207\u306a\u30b5\u30a4\u30ba\u8abf\u6574\u306b\u3064\u306a\u304c\u308a\u307e\u3059\u3002"}),"\n",(0,t.jsx)(s.h3,{id:"\u30ef\u30fc\u30af\u30ed\u30fc\u30c9\u306e\u6700\u9069\u5316",children:"\u30ef\u30fc\u30af\u30ed\u30fc\u30c9\u306e\u6700\u9069\u5316"}),"\n",(0,t.jsx)(s.p,{children:"Kubecost \u306f\u3001Kubernetes \u30cd\u30a4\u30c6\u30a3\u30d6\u306e\u30e1\u30c8\u30ea\u30af\u30b9\u306b\u57fa\u3065\u3044\u3066\u3001\u30ef\u30fc\u30af\u30ed\u30fc\u30c9\u306e\u6700\u9069\u5316\u306e\u63a8\u5968\u3092\u63d0\u4f9b\u3057\u307e\u3059\u3002kubecost UI \u306e savings \u30d1\u30cd\u30eb\u306f\u3001\u6700\u9069\u5316\u3092\u958b\u59cb\u3059\u308b\u306e\u306b\u9069\u3057\u3066\u3044\u307e\u3059\u3002"}),"\n",(0,t.jsx)(s.p,{children:(0,t.jsx)(s.img,{alt:"Savings",src:n(45823).A+"",width:"2194",height:"1225"})}),"\n",(0,t.jsx)(s.p,{children:(0,t.jsx)(s.img,{alt:"Right-sizing",src:n(43249).A+"",width:"2254",height:"916"})}),"\n",(0,t.jsx)(s.p,{children:"Kubecost \u306f\u4ee5\u4e0b\u306e\u6700\u9069\u5316\u306e\u63a8\u5968\u3092\u884c\u3044\u307e\u3059:"}),"\n",(0,t.jsxs)(s.ul,{children:["\n",(0,t.jsx)(s.li,{children:"\u30b3\u30f3\u30c6\u30ca\u30ea\u30af\u30a8\u30b9\u30c8\u306e\u904e\u5270\u30d7\u30ed\u30d3\u30b8\u30e7\u30cb\u30f3\u30b0\u3068\u30a2\u30f3\u30c0\u30fc\u30d7\u30ed\u30d3\u30b8\u30e7\u30cb\u30f3\u30b0\u306e\u4e21\u65b9\u3092\u8003\u616e\u3057\u305f\u4e0a\u3067\u306e\u6700\u9069\u306a\u30b3\u30f3\u30c6\u30ca\u30ea\u30af\u30a8\u30b9\u30c8"}),"\n",(0,t.jsx)(s.li,{children:"\u672a\u4f7f\u7528\u306e\u30ad\u30e3\u30d1\u30b7\u30c6\u30a3\u3078\u306e\u904e\u5270\u306a\u652f\u51fa\u3092\u505c\u6b62\u3059\u308b\u305f\u3081\u306b\u3001\u30af\u30e9\u30b9\u30bf\u30fc\u30ce\u30fc\u30c9\u306e\u6570\u3068\u30b5\u30a4\u30ba\u3092\u8abf\u6574"}),"\n",(0,t.jsx)(s.li,{children:"\u6709\u610f\u306a\u30ec\u30fc\u30c8\u306e\u30c8\u30e9\u30d5\u30a3\u30c3\u30af\u3092\u9001\u53d7\u4fe1\u3057\u3066\u3044\u306a\u3044 Pod \u306e\u30b9\u30b1\u30fc\u30eb\u30c0\u30a6\u30f3\u3001\u524a\u9664\u3001\u30ea\u30b5\u30a4\u30ba"}),"\n",(0,t.jsx)(s.li,{children:"\u30b9\u30dd\u30c3\u30c8\u30ce\u30fc\u30c9\u306b\u9069\u3057\u305f\u30ef\u30fc\u30af\u30ed\u30fc\u30c9\u306e\u7279\u5b9a"}),"\n",(0,t.jsx)(s.li,{children:"\u3069\u306e Pod \u304b\u3089\u3082\u4f7f\u7528\u3055\u308c\u3066\u3044\u306a\u3044\u30dc\u30ea\u30e5\u30fc\u30e0\u306e\u7279\u5b9a"}),"\n"]}),"\n",(0,t.jsx)(s.p,{children:"\u307e\u305f\u3001Kubecost \u306b\u306f Cluster Controller \u30b3\u30f3\u30dd\u30fc\u30cd\u30f3\u30c8\u3092\u6709\u52b9\u306b\u3057\u305f\u5834\u5408\u306b\u3001\u30b3\u30f3\u30c6\u30ca\u30ea\u30bd\u30fc\u30b9\u30ea\u30af\u30a8\u30b9\u30c8\u306e\u81ea\u52d5\u6700\u9069\u5316\u3092\u5b9f\u88c5\u3067\u304d\u308b\u30d7\u30ec\u30ea\u30ea\u30fc\u30b9\u6a5f\u80fd\u3082\u3042\u308a\u307e\u3059\u3002\u81ea\u52d5\u30ea\u30af\u30a8\u30b9\u30c8\u6700\u9069\u5316\u3092\u4f7f\u7528\u3059\u308b\u3068\u3001\u8907\u96d1\u306a YAML \u306e\u30c6\u30b9\u30c8\u3084 kubectl \u30b3\u30de\u30f3\u30c9\u3092\u5b9f\u884c\u3059\u308b\u3053\u3068\u306a\u304f\u3001\u30af\u30e9\u30b9\u30bf\u5168\u4f53\u306e\u30ea\u30bd\u30fc\u30b9\u5272\u308a\u5f53\u3066\u3092\u5373\u5ea7\u306b\u6700\u9069\u5316\u3067\u304d\u307e\u3059\u3002\u30af\u30e9\u30b9\u30bf\u5185\u306e\u30ea\u30bd\u30fc\u30b9\u306e\u904e\u5270\u5272\u308a\u5f53\u3066\u3092\u7c21\u5358\u306b\u6392\u9664\u3067\u304d\u308b\u305f\u3081\u3001\u30af\u30e9\u30b9\u30bf\u306e\u6700\u9069\u5316\u3068\u305d\u306e\u4ed6\u306e\u6700\u9069\u5316\u306b\u3088\u308b\u5927\u5e45\u306a\u30b3\u30b9\u30c8\u524a\u6e1b\u306e\u9053\u304c\u958b\u304b\u308c\u307e\u3059\u3002"}),"\n",(0,t.jsx)(s.h3,{id:"kubecost-\u3068-amazon-managed-service-for-prometheus-\u306e\u7d71\u5408",children:"Kubecost \u3068 Amazon Managed Service for Prometheus \u306e\u7d71\u5408"}),"\n",(0,t.jsx)(s.p,{children:"Kubecost \u306f\u3001\u6642\u7cfb\u5217\u30c7\u30fc\u30bf\u30d9\u30fc\u30b9\u3068\u3057\u3066\u30aa\u30fc\u30d7\u30f3\u30bd\u30fc\u30b9\u306e Prometheus \u30d7\u30ed\u30b8\u30a7\u30af\u30c8\u3092\u5229\u7528\u3057\u3001Prometheus \u306e\u30c7\u30fc\u30bf\u3092\u5f8c\u51e6\u7406\u3057\u3066\u30b3\u30b9\u30c8\u5272\u308a\u5f53\u3066\u8a08\u7b97\u3092\u5b9f\u884c\u3057\u307e\u3059\u3002 \u30af\u30e9\u30b9\u30bf\u30fc\u306e\u30b5\u30a4\u30ba\u3084\u30ef\u30fc\u30af\u30ed\u30fc\u30c9\u306e\u898f\u6a21\u306b\u3088\u3063\u3066\u306f\u3001Prometheus \u30b5\u30fc\u30d0\u30fc\u304c\u30e1\u30c8\u30ea\u30af\u30b9\u3092\u30b9\u30af\u30ec\u30a4\u30d7\u304a\u3088\u3073\u4fdd\u5b58\u3059\u308b\u3053\u3068\u304c\u56f0\u96e3\u306b\u306a\u308b\u5834\u5408\u304c\u3042\u308a\u307e\u3059\u3002 \u3053\u306e\u3088\u3046\u306a\u5834\u5408\u306f\u3001\u4fe1\u983c\u6027\u306e\u9ad8\u3044\u65b9\u6cd5\u3067\u30e1\u30c8\u30ea\u30af\u30b9\u3092\u4fdd\u5b58\u3057\u3001Kubernetes \u306e\u30b3\u30b9\u30c8\u3092\u5927\u898f\u6a21\u306b\u76e3\u8996\u3067\u304d\u308b\u3088\u3046\u306b\u3059\u308b\u3001Prometheus \u4e92\u63db\u306e\u30de\u30cd\u30fc\u30b8\u30c9\u76e3\u8996\u30b5\u30fc\u30d3\u30b9\u3067\u3042\u308b Amazon Managed Service for Prometheus \u3092\u4f7f\u7528\u3067\u304d\u307e\u3059\u3002"}),"\n",(0,t.jsxs)(s.p,{children:[(0,t.jsx)(s.a,{href:"https://docs.aws.amazon.com/ja_jp/eks/latest/userguide/iam-roles-for-service-accounts.html",children:"Kubecost \u30b5\u30fc\u30d3\u30b9\u30a2\u30ab\u30a6\u30f3\u30c8\u306e IAM \u30ed\u30fc\u30eb\u3092\u8a2d\u5b9a"}),"\u3059\u308b\u5fc5\u8981\u304c\u3042\u308a\u307e\u3059\u3002 \u30af\u30e9\u30b9\u30bf\u30fc\u306e OIDC \u30d7\u30ed\u30d0\u30a4\u30c0\u30fc\u3092\u4f7f\u7528\u3057\u3066\u3001\u30af\u30e9\u30b9\u30bf\u30fc\u306e\u30b5\u30fc\u30d3\u30b9\u30a2\u30ab\u30a6\u30f3\u30c8\u306b IAM \u30a2\u30af\u30bb\u30b9\u8a31\u53ef\u3092\u4ed8\u4e0e\u3057\u307e\u3059\u3002 kubecost-cost-analyzer \u304a\u3088\u3073 kubecost-prometheus-server \u306e\u30b5\u30fc\u30d3\u30b9\u30a2\u30ab\u30a6\u30f3\u30c8\u306b\u9069\u5207\u306a\u30a2\u30af\u30bb\u30b9\u8a31\u53ef\u3092\u4ed8\u4e0e\u3059\u308b\u5fc5\u8981\u304c\u3042\u308a\u307e\u3059\u3002 \u3053\u308c\u3089\u306f\u3001\u30ef\u30fc\u30af\u30b9\u30da\u30fc\u30b9\u304b\u3089\u30e1\u30c8\u30ea\u30af\u30b9\u3092\u9001\u53d7\u4fe1\u3059\u308b\u305f\u3081\u306b\u4f7f\u7528\u3055\u308c\u307e\u3059\u3002 \u30b3\u30de\u30f3\u30c9\u30e9\u30a4\u30f3\u3067\u6b21\u306e\u30b3\u30de\u30f3\u30c9\u3092\u5b9f\u884c\u3057\u307e\u3059:"]}),"\n",(0,t.jsx)(s.pre,{children:(0,t.jsx)(s.code,{children:"eksctl create iamserviceaccount \\ \n--name kubecost-cost-analyzer \\ \n--namespace kubecost \\ \n--cluster <CLUSTER_NAME> \\\n--region <REGION> \\ \n--attach-policy-arn arn:aws:iam::aws:policy/AmazonPrometheusQueryAccess \\ \n--attach-policy-arn arn:aws:iam::aws:policy/AmazonPrometheusRemoteWriteAccess \\ \n--override-existing-serviceaccounts \\ \n--approve \n\neksctl create iamserviceaccount \\ \n--name kubecost-prometheus-server \\ \n--namespace kubecost \\ \n--cluster <CLUSTER_NAME> --region <REGION> \\ \n--attach-policy-arn arn:aws:iam::aws:policy/AmazonPrometheusQueryAccess \\ \n--attach-policy-arn arn:aws:iam::aws:policy/AmazonPrometheusRemoteWriteAccess \\ \n--override-existing-serviceaccounts \\ \n--approve\n\n"})}),"\n",(0,t.jsxs)(s.p,{children:[(0,t.jsx)(s.code,{children:"CLUSTER_NAME"}),' \u306f Kubecost \u3092\u30a4\u30f3\u30b9\u30c8\u30fc\u30eb\u3059\u308b Amazon EKS \u30af\u30e9\u30b9\u30bf\u30fc\u306e\u540d\u524d\u3067\u3001"region" \u306f Amazon EKS \u30af\u30e9\u30b9\u30bf\u30fc\u306e\u30ea\u30fc\u30b8\u30e7\u30f3\u3067\u3059\u3002']}),"\n",(0,t.jsx)(s.p,{children:"\u5b8c\u4e86\u5f8c\u3001\u6b21\u306e\u3088\u3046\u306b Kubecost helm \u30c1\u30e3\u30fc\u30c8\u3092\u30a2\u30c3\u30d7\u30b0\u30ec\u30fc\u30c9\u3059\u308b\u5fc5\u8981\u304c\u3042\u308a\u307e\u3059:"}),"\n",(0,t.jsx)(s.pre,{children:(0,t.jsx)(s.code,{children:"helm upgrade -i kubecost \\\noci://public.ecr.aws/kubecost/cost-analyzer --version <$VERSION> \\\n--namespace kubecost --create-namespace \\\n-f https://tinyurl.com/kubecost-amazon-eks \\\n-f https://tinyurl.com/kubecost-amp \\\n--set global.amp.prometheusServerEndpoint=${QUERYURL} \\\n--set global.amp.remoteWriteService=${REMOTEWRITEURL}\n"})}),"\n",(0,t.jsx)(s.h3,{id:"kubecost-ui-\u3078\u306e\u30a2\u30af\u30bb\u30b9",children:"Kubecost UI \u3078\u306e\u30a2\u30af\u30bb\u30b9"}),"\n",(0,t.jsxs)(s.p,{children:["Kubecost \u306f\u3001kubectl port-forward\u3001Ingress\u3001\u307e\u305f\u306f Load Balancer \u3092\u4ecb\u3057\u3066\u30a2\u30af\u30bb\u30b9\u3067\u304d\u308b Web \u30c0\u30c3\u30b7\u30e5\u30dc\u30fc\u30c9\u3092\u63d0\u4f9b\u3057\u307e\u3059\u3002Kubecost \u306e\u30a8\u30f3\u30bf\u30fc\u30d7\u30e9\u30a4\u30ba\u7248\u3067\u306f\u3001",(0,t.jsx)(s.a,{href:"https://docs.kubecost.com/install-and-configure/advanced-configuration/user-management-oidc",children:"SSO/SAML"})," \u3092\u4f7f\u7528\u3057\u305f\u30c0\u30c3\u30b7\u30e5\u30dc\u30fc\u30c9\u3078\u306e\u30a2\u30af\u30bb\u30b9\u5236\u9650\u3084\u3001\u7570\u306a\u308b\u30a2\u30af\u30bb\u30b9\u30ec\u30d9\u30eb\u306e\u63d0\u4f9b\u3082\u30b5\u30dd\u30fc\u30c8\u3057\u3066\u3044\u307e\u3059\u3002\u305f\u3068\u3048\u3070\u3001\u30c1\u30fc\u30e0\u306e\u8868\u793a\u3092\u305d\u306e\u30c1\u30fc\u30e0\u304c\u62c5\u5f53\u3059\u308b\u88fd\u54c1\u306b\u9650\u5b9a\u3059\u308b\u3001\u3068\u3044\u3063\u305f\u3053\u3068\u304c\u3067\u304d\u307e\u3059\u3002"]}),"\n",(0,t.jsxs)(s.p,{children:["AWS \u74b0\u5883\u3067\u306f\u3001Kubecost \u3092\u516c\u958b\u3059\u308b\u305f\u3081\u306b ",(0,t.jsx)(s.a,{href:"https://docs.aws.amazon.com/eks/latest/userguide/aws-load-balancer-controller.html",children:"AWS Load Balancer Controller"})," \u306e\u4f7f\u7528\u3084\u3001\u8a8d\u8a3c\u3001\u8a8d\u53ef\u3001\u30e6\u30fc\u30b6\u30fc\u7ba1\u7406\u306b ",(0,t.jsx)(s.a,{href:"https://aws.amazon.com/cognito/",children:"Amazon Cognito"})," \u306e\u4f7f\u7528\u3092\u691c\u8a0e\u3057\u3066\u304f\u3060\u3055\u3044\u3002Kubernetes Web \u30a2\u30d7\u30ea\u30b1\u30fc\u30b7\u30e7\u30f3\u306e\u30e6\u30fc\u30b6\u30fc\u8a8d\u8a3c\u306b Application Load Balancer \u3068 Amazon Cognito \u3092\u4f7f\u7528\u3059\u308b\u65b9\u6cd5\u306e\u8a73\u7d30\u306f\u3001",(0,t.jsx)(s.a,{href:"https://aws.amazon.com/blogs/containers/how-to-use-application-load-balancer-and-amazon-cognito-to-authenticate-users-for-your-kubernetes-web-apps/",children:"\u3053\u3061\u3089\u306e\u8a18\u4e8b"})," \u3092\u53c2\u7167\u3057\u3066\u304f\u3060\u3055\u3044\u3002"]}),"\n",(0,t.jsx)(s.h3,{id:"\u30de\u30eb\u30c1\u30af\u30e9\u30b9\u30bf\u30fc\u30d3\u30e5\u30fc",children:"\u30de\u30eb\u30c1\u30af\u30e9\u30b9\u30bf\u30fc\u30d3\u30e5\u30fc"}),"\n",(0,t.jsx)(s.p,{children:"FinOps \u30c1\u30fc\u30e0\u306f\u3001\u30d3\u30b8\u30cd\u30b9\u30aa\u30fc\u30ca\u30fc\u3068\u306e\u63a8\u5968\u4e8b\u9805\u3092\u5171\u6709\u3059\u308b\u305f\u3081\u306b EKS \u30af\u30e9\u30b9\u30bf\u30fc\u3092\u30ec\u30d3\u30e5\u30fc\u3057\u305f\u3044\u3068\u8003\u3048\u3066\u3044\u308b\u3067\u3057\u3087\u3046\u3002\u5927\u898f\u6a21\u306b\u904b\u7528\u3059\u308b\u5834\u5408\u3001\u5404\u30af\u30e9\u30b9\u30bf\u306b\u30ed\u30b0\u30a4\u30f3\u3057\u3066\u63a8\u5968\u4e8b\u9805\u3092\u8868\u793a\u3059\u308b\u3053\u3068\u304c\u56f0\u96e3\u306b\u306a\u308a\u307e\u3059\u3002\u30de\u30eb\u30c1\u30af\u30e9\u30b9\u30bf\u30fc\u3092\u4f7f\u7528\u3059\u308b\u3068\u3001\u30b0\u30ed\u30fc\u30d0\u30eb\u306b\u96c6\u8a08\u3055\u308c\u305f\u3059\u3079\u3066\u306e\u30af\u30e9\u30b9\u30bf\u30fc\u30b3\u30b9\u30c8\u3092\u5358\u4e00\u306e\u30d1\u30cd\u30eb\u3067\u78ba\u8a8d\u3067\u304d\u307e\u3059\u3002Kubecost \u304c\u30b5\u30dd\u30fc\u30c8\u3057\u3066\u3044\u308b\u30de\u30eb\u30c1\u30af\u30e9\u30b9\u30bf\u30fc\u74b0\u5883\u306e\u30aa\u30d7\u30b7\u30e7\u30f3\u306b\u306f\u3001Kubecost Free\u3001Kubecost Business\u3001Kubecost Enterprise \u306e 3 \u3064\u304c\u3042\u308a\u307e\u3059\u3002Free \u30e2\u30fc\u30c9\u3068 Business \u30e2\u30fc\u30c9\u3067\u306f\u3001\u30af\u30e9\u30a6\u30c9\u8ab2\u91d1\u3068\u306e\u7a81\u5408\u306f\u5404\u30af\u30e9\u30b9\u30bf\u30fc\u30ec\u30d9\u30eb\u3067\u5b9f\u884c\u3055\u308c\u307e\u3059\u3002Enterprise \u30e2\u30fc\u30c9\u3067\u306f\u3001Kubecost UI \u3092\u63d0\u4f9b\u3057\u3001\u30e1\u30c8\u30ea\u30af\u30b9\u304c\u4fdd\u5b58\u3055\u308c\u3066\u3044\u308b\u5171\u6709\u30d0\u30b1\u30c3\u30c8\u3092\u4f7f\u7528\u3059\u308b\u30d7\u30e9\u30a4\u30de\u30ea\u30af\u30e9\u30b9\u30bf\u3067\u30af\u30e9\u30a6\u30c9\u8ab2\u91d1\u3068\u306e\u7a81\u5408\u304c\u5b9f\u884c\u3055\u308c\u307e\u3059\u3002\nEnterprise \u30e2\u30fc\u30c9\u3092\u4f7f\u7528\u3059\u308b\u5834\u5408\u306b\u306e\u307f\u3001\u30e1\u30c8\u30ea\u30af\u30b9\u306e\u4fdd\u6301\u304c\u7121\u5236\u9650\u3067\u3042\u308b\u3053\u3068\u306b\u6ce8\u610f\u3057\u3066\u304f\u3060\u3055\u3044\u3002"}),"\n",(0,t.jsx)(s.h3,{id:"\u53c2\u8003\u6587\u732e",children:"\u53c2\u8003\u6587\u732e"}),"\n",(0,t.jsxs)(s.ul,{children:["\n",(0,t.jsx)(s.li,{children:(0,t.jsx)(s.a,{href:"https://catalog.workshops.aws/observability/ja-JP/aws-managed-oss/amp/ingest-kubecost-metrics",children:"One Observability \u30ef\u30fc\u30af\u30b7\u30e7\u30c3\u30d7\u3067\u306e Kubecost \u306e\u30cf\u30f3\u30ba\u30aa\u30f3\u4f53\u9a13"})}),"\n",(0,t.jsx)(s.li,{children:(0,t.jsx)(s.a,{href:"https://aws.amazon.com/blogs/mt/integrating-kubecost-with-amazon-managed-service-for-prometheus/",children:"\u30d6\u30ed\u30b0 - Kubecost \u3068 Amazon Managed Service for Prometheus \u306e\u7d71\u5408"})}),"\n"]})]})}function u(e={}){const{wrapper:s}={...(0,c.R)(),...e.components};return s?(0,t.jsx)(s,{...e,children:(0,t.jsx)(d,{...e})}):d(e)}},56155:(e,s,n)=>{n.d(s,{A:()=>t});const t=n.p+"assets/images/allocations-35c4a1fc35497449f53fcb9b45f771ce.png"},70174:(e,s,n)=>{n.d(s,{A:()=>t});const t=n.p+"assets/images/kubecost-architecture-ab390df0384114cf473546a9dea8c7b4.png"},43249:(e,s,n)=>{n.d(s,{A:()=>t});const t=n.p+"assets/images/right-sizing-35265644446d58c5797ae8834b61ad3c.png"},45823:(e,s,n)=>{n.d(s,{A:()=>t});const t=n.p+"assets/images/savings-f3efae1e53b422ea62ee3c8c4bcd9b0b.png"},28453:(e,s,n)=>{n.d(s,{R:()=>i,x:()=>a});var t=n(96540);const c={},o=t.createContext(c);function i(e){const s=t.useContext(o);return t.useMemo((function(){return"function"==typeof e?e(s):{...s,...e}}),[s,e])}function a(e){let s;return s=e.disableParentContext?"function"==typeof e.components?e.components(c):e.components||c:i(e.components),t.createElement(o.Provider,{value:s},e.children)}}}]);
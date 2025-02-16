"use strict";(self.webpackChunkobservability_best_practices=self.webpackChunkobservability_best_practices||[]).push([[7130],{3525:(e,n,t)=>{t.d(n,{A:()=>s});const s=t.p+"assets/images/PushPullApproach-f15cc0201d32d62ae60f98265d06d438.png"},28453:(e,n,t)=>{t.d(n,{R:()=>c,x:()=>r});var s=t(96540);const o={},i=s.createContext(o);function c(e){const n=s.useContext(i);return s.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function r(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(o):e.components||o:c(e.components),s.createElement(i.Provider,{value:n},e.children)}},28465:(e,n,t)=>{t.r(n),t.d(n,{assets:()=>a,contentTitle:()=>c,default:()=>d,frontMatter:()=>i,metadata:()=>r,toc:()=>l});var s=t(74848),o=t(28453);const i={},c="Container Insights \u3092\u4f7f\u7528\u3057\u305f\u30b5\u30fc\u30d3\u30b9\u30e1\u30c8\u30ea\u30af\u30b9\u306e\u53ce\u96c6",r={id:"guides/containers/aws-native/ecs/best-practices-metrics-collection-2",title:"Container Insights \u3092\u4f7f\u7528\u3057\u305f\u30b5\u30fc\u30d3\u30b9\u30e1\u30c8\u30ea\u30af\u30b9\u306e\u53ce\u96c6",description:"\u30b5\u30fc\u30d3\u30b9\u30e1\u30c8\u30ea\u30af\u30b9\u306f\u3001\u30b3\u30fc\u30c9\u306b\u8a08\u88c5\u3092\u8ffd\u52a0\u3059\u308b\u3053\u3068\u3067\u53d6\u5f97\u3055\u308c\u308b\u30a2\u30d7\u30ea\u30b1\u30fc\u30b7\u30e7\u30f3\u30ec\u30d9\u30eb\u306e\u30e1\u30c8\u30ea\u30af\u30b9\u3067\u3059\u3002\u3053\u308c\u3089\u306e\u30e1\u30c8\u30ea\u30af\u30b9\u306f\u30012 \u3064\u306e\u7570\u306a\u308b\u30a2\u30d7\u30ed\u30fc\u30c1\u3092\u4f7f\u7528\u3057\u3066\u30a2\u30d7\u30ea\u30b1\u30fc\u30b7\u30e7\u30f3\u304b\u3089\u53ce\u96c6\u3067\u304d\u307e\u3059\u3002",source:"@site/i18n/ja/docusaurus-plugin-content-docs/current/guides/containers/aws-native/ecs/best-practices-metrics-collection-2.md",sourceDirName:"guides/containers/aws-native/ecs",slug:"/guides/containers/aws-native/ecs/best-practices-metrics-collection-2",permalink:"/observability-best-practices/ja/guides/containers/aws-native/ecs/best-practices-metrics-collection-2",draft:!1,unlisted:!1,editUrl:"https://github.com/aws-observability/observability-best-practices/blob/main/docusaurus/docs/guides/containers/aws-native/ecs/best-practices-metrics-collection-2.md",tags:[],version:"current",frontMatter:{},sidebar:"guides",previous:{title:"Container Insights \u3092\u4f7f\u7528\u3057\u305f\u30b7\u30b9\u30c6\u30e0\u30e1\u30c8\u30ea\u30af\u30b9\u306e\u53ce\u96c6",permalink:"/observability-best-practices/ja/guides/containers/aws-native/ecs/best-practices-metrics-collection-1"},next:{title:"AWS Distro for OpenTelemetry \u3092\u4f7f\u7528\u3057\u305f ECS \u30af\u30e9\u30b9\u30bf\u30fc\u3067\u306e\u30b7\u30b9\u30c6\u30e0\u30e1\u30c8\u30ea\u30af\u30b9\u306e\u53ce\u96c6",permalink:"/observability-best-practices/ja/guides/containers/oss/ecs/best-practices-metrics-collection-1"}},a={},l=[{value:"Prometheus \u7528 CloudWatch Container Insights \u30e2\u30cb\u30bf\u30ea\u30f3\u30b0",id:"prometheus-\u7528-cloudwatch-container-insights-\u30e2\u30cb\u30bf\u30ea\u30f3\u30b0",level:2},{value:"Amazon ECS \u30af\u30e9\u30b9\u30bf\u30fc\u3067\u306e\u30bf\u30fc\u30b2\u30c3\u30c8\u306e\u81ea\u52d5\u691c\u51fa",id:"amazon-ecs-\u30af\u30e9\u30b9\u30bf\u30fc\u3067\u306e\u30bf\u30fc\u30b2\u30c3\u30c8\u306e\u81ea\u52d5\u691c\u51fa",level:3},{value:"Prometheus \u30e1\u30c8\u30ea\u30af\u30b9\u306e CloudWatch \u3078\u306e\u30a4\u30f3\u30dd\u30fc\u30c8",id:"prometheus-\u30e1\u30c8\u30ea\u30af\u30b9\u306e-cloudwatch-\u3078\u306e\u30a4\u30f3\u30dd\u30fc\u30c8",level:3}];function h(e){const n={a:"a",admonition:"admonition",code:"code",em:"em",h1:"h1",h2:"h2",h3:"h3",img:"img",li:"li",ol:"ol",p:"p",pre:"pre",...(0,o.R)(),...e.components};return(0,s.jsxs)(s.Fragment,{children:[(0,s.jsx)(n.h1,{id:"container-insights-\u3092\u4f7f\u7528\u3057\u305f\u30b5\u30fc\u30d3\u30b9\u30e1\u30c8\u30ea\u30af\u30b9\u306e\u53ce\u96c6",children:"Container Insights \u3092\u4f7f\u7528\u3057\u305f\u30b5\u30fc\u30d3\u30b9\u30e1\u30c8\u30ea\u30af\u30b9\u306e\u53ce\u96c6"}),"\n",(0,s.jsx)(n.p,{children:"\u30b5\u30fc\u30d3\u30b9\u30e1\u30c8\u30ea\u30af\u30b9\u306f\u3001\u30b3\u30fc\u30c9\u306b\u8a08\u88c5\u3092\u8ffd\u52a0\u3059\u308b\u3053\u3068\u3067\u53d6\u5f97\u3055\u308c\u308b\u30a2\u30d7\u30ea\u30b1\u30fc\u30b7\u30e7\u30f3\u30ec\u30d9\u30eb\u306e\u30e1\u30c8\u30ea\u30af\u30b9\u3067\u3059\u3002\u3053\u308c\u3089\u306e\u30e1\u30c8\u30ea\u30af\u30b9\u306f\u30012 \u3064\u306e\u7570\u306a\u308b\u30a2\u30d7\u30ed\u30fc\u30c1\u3092\u4f7f\u7528\u3057\u3066\u30a2\u30d7\u30ea\u30b1\u30fc\u30b7\u30e7\u30f3\u304b\u3089\u53ce\u96c6\u3067\u304d\u307e\u3059\u3002"}),"\n",(0,s.jsxs)(n.ol,{children:["\n",(0,s.jsxs)(n.li,{children:["\n",(0,s.jsx)(n.p,{children:"\u30d7\u30c3\u30b7\u30e5\u30a2\u30d7\u30ed\u30fc\u30c1\uff1a\u3053\u3053\u3067\u306f\u3001\u30a2\u30d7\u30ea\u30b1\u30fc\u30b7\u30e7\u30f3\u304c\u30e1\u30c8\u30ea\u30af\u30b9\u30c7\u30fc\u30bf\u3092\u76f4\u63a5\u76ee\u7684\u5730\u306b\u9001\u4fe1\u3057\u307e\u3059\u3002\u4f8b\u3048\u3070\u3001CloudWatch PutMetricData API \u3092\u4f7f\u7528\u3057\u3066\u3001\u30a2\u30d7\u30ea\u30b1\u30fc\u30b7\u30e7\u30f3\u306f CloudWatch \u306b\u30e1\u30c8\u30ea\u30af\u30b9\u30c7\u30fc\u30bf\u30dd\u30a4\u30f3\u30c8\u3092\u516c\u958b\u3067\u304d\u307e\u3059\u3002\u307e\u305f\u3001\u30a2\u30d7\u30ea\u30b1\u30fc\u30b7\u30e7\u30f3\u306f OpenTelemetry Collector \u306a\u3069\u306e\u30a8\u30fc\u30b8\u30a7\u30f3\u30c8\u306b\u5bfe\u3057\u3066\u3001OpenTelemetry Protocol (OTLP) \u3092\u4f7f\u7528\u3057\u3066 gRPC \u307e\u305f\u306f HTTP \u7d4c\u7531\u3067\u30c7\u30fc\u30bf\u3092\u9001\u4fe1\u3059\u308b\u3053\u3068\u3082\u3042\u308a\u307e\u3059\u3002\u5f8c\u8005\u306f\u3001\u305d\u306e\u5f8c\u30e1\u30c8\u30ea\u30af\u30b9\u30c7\u30fc\u30bf\u3092\u6700\u7d42\u76ee\u7684\u5730\u306b\u9001\u4fe1\u3057\u307e\u3059\u3002"}),"\n"]}),"\n",(0,s.jsxs)(n.li,{children:["\n",(0,s.jsx)(n.p,{children:"\u30d7\u30eb\u30a2\u30d7\u30ed\u30fc\u30c1\uff1a\u3053\u3053\u3067\u306f\u3001\u30a2\u30d7\u30ea\u30b1\u30fc\u30b7\u30e7\u30f3\u304c\u4e8b\u524d\u306b\u5b9a\u7fa9\u3055\u308c\u305f\u30d5\u30a9\u30fc\u30de\u30c3\u30c8\u3067 HTTP \u30a8\u30f3\u30c9\u30dd\u30a4\u30f3\u30c8\u306b\u30e1\u30c8\u30ea\u30af\u30b9\u30c7\u30fc\u30bf\u3092\u516c\u958b\u3057\u307e\u3059\u3002\u305d\u306e\u30c7\u30fc\u30bf\u306f\u3001\u3053\u306e\u30a8\u30f3\u30c9\u30dd\u30a4\u30f3\u30c8\u306b\u30a2\u30af\u30bb\u30b9\u3067\u304d\u308b\u30a8\u30fc\u30b8\u30a7\u30f3\u30c8\u306b\u3088\u3063\u3066\u30b9\u30af\u30ec\u30a4\u30d4\u30f3\u30b0\u3055\u308c\u3001\u76ee\u7684\u5730\u306b\u9001\u4fe1\u3055\u308c\u307e\u3059\u3002"}),"\n"]}),"\n"]}),"\n",(0,s.jsx)(n.p,{children:(0,s.jsx)(n.img,{alt:"\u30e1\u30c8\u30ea\u30af\u30b9\u53ce\u96c6\u306e\u30d7\u30c3\u30b7\u30e5\u30a2\u30d7\u30ed\u30fc\u30c1",src:t(3525).A+"",width:"1038",height:"378"})}),"\n",(0,s.jsx)(n.h2,{id:"prometheus-\u7528-cloudwatch-container-insights-\u30e2\u30cb\u30bf\u30ea\u30f3\u30b0",children:"Prometheus \u7528 CloudWatch Container Insights \u30e2\u30cb\u30bf\u30ea\u30f3\u30b0"}),"\n",(0,s.jsxs)(n.p,{children:[(0,s.jsx)(n.a,{href:"https://prometheus.io/docs/introduction/overview/",children:"Prometheus"})," \u306f\u3001\u4eba\u6c17\u306e\u3042\u308b\u30aa\u30fc\u30d7\u30f3\u30bd\u30fc\u30b9\u306e\u30b7\u30b9\u30c6\u30e0\u30e2\u30cb\u30bf\u30ea\u30f3\u30b0\u304a\u3088\u3073\u30a2\u30e9\u30fc\u30c8\u901a\u77e5\u30c4\u30fc\u30eb\u30ad\u30c3\u30c8\u3067\u3059\u3002\u30b3\u30f3\u30c6\u30ca\u5316\u3055\u308c\u305f\u30a2\u30d7\u30ea\u30b1\u30fc\u30b7\u30e7\u30f3\u304b\u3089\u30d7\u30eb\u65b9\u5f0f\u3067\u30e1\u30c8\u30ea\u30af\u30b9\u3092\u53ce\u96c6\u3059\u308b\u305f\u3081\u306e\u4e8b\u5b9f\u4e0a\u306e\u6a19\u6e96\u3068\u3057\u3066\u53f0\u982d\u3057\u3066\u3044\u307e\u3059\u3002Prometheus \u3092\u4f7f\u7528\u3057\u3066\u30e1\u30c8\u30ea\u30af\u30b9\u3092\u53d6\u5f97\u3059\u308b\u306b\u306f\u3001\u307e\u305a\u4e3b\u8981\u306a\u30d7\u30ed\u30b0\u30e9\u30df\u30f3\u30b0\u8a00\u8a9e\u3067\u5229\u7528\u53ef\u80fd\u306a Prometheus \u306e ",(0,s.jsx)(n.a,{href:"https://prometheus.io/docs/instrumenting/clientlibs/",children:"\u30af\u30e9\u30a4\u30a2\u30f3\u30c8\u30e9\u30a4\u30d6\u30e9\u30ea"})," \u3092\u4f7f\u7528\u3057\u3066\u30a2\u30d7\u30ea\u30b1\u30fc\u30b7\u30e7\u30f3\u30b3\u30fc\u30c9\u3092\u8a08\u88c5\u3059\u308b\u5fc5\u8981\u304c\u3042\u308a\u307e\u3059\u3002\u901a\u5e38\u3001\u30e1\u30c8\u30ea\u30af\u30b9\u306f Prometheus \u30b5\u30fc\u30d0\u30fc\u304c\u8aad\u307f\u53d6\u308b\u305f\u3081\u306b\u3001\u30a2\u30d7\u30ea\u30b1\u30fc\u30b7\u30e7\u30f3\u306b\u3088\u3063\u3066 HTTP \u7d4c\u7531\u3067\u516c\u958b\u3055\u308c\u307e\u3059\u3002"]}),"\n",(0,s.jsx)(n.p,{children:"Prometheus \u30b5\u30fc\u30d0\u30fc\u304c\u30a2\u30d7\u30ea\u30b1\u30fc\u30b7\u30e7\u30f3\u306e HTTP \u30a8\u30f3\u30c9\u30dd\u30a4\u30f3\u30c8\u3092\u30b9\u30af\u30ec\u30a4\u30d4\u30f3\u30b0\u3059\u308b\u3068\u3001\u30af\u30e9\u30a4\u30a2\u30f3\u30c8\u30e9\u30a4\u30d6\u30e9\u30ea\u306f\u8ffd\u8de1\u3055\u308c\u3066\u3044\u308b\u3059\u3079\u3066\u306e\u30e1\u30c8\u30ea\u30af\u30b9\u306e\u73fe\u5728\u306e\u72b6\u614b\u3092\u30b5\u30fc\u30d0\u30fc\u306b\u9001\u4fe1\u3057\u307e\u3059\u3002\u30b5\u30fc\u30d0\u30fc\u306f\u3001\u30e1\u30c8\u30ea\u30af\u30b9\u3092\u7ba1\u7406\u3059\u308b\u72ec\u81ea\u306e\u30ed\u30fc\u30ab\u30eb\u30b9\u30c8\u30ec\u30fc\u30b8\u306b\u4fdd\u5b58\u3059\u308b\u304b\u3001CloudWatch \u306a\u3069\u306e\u30ea\u30e2\u30fc\u30c8\u306e\u9001\u4fe1\u5148\u306b\u30e1\u30c8\u30ea\u30af\u30b9\u30c7\u30fc\u30bf\u3092\u9001\u4fe1\u3059\u308b\u3053\u3068\u304c\u3067\u304d\u307e\u3059\u3002"}),"\n",(0,s.jsxs)(n.p,{children:[(0,s.jsx)(n.a,{href:"https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/ContainerInsights-Prometheus.html",children:"Prometheus \u7528 CloudWatch Container Insights \u30e2\u30cb\u30bf\u30ea\u30f3\u30b0"})," \u3092\u4f7f\u7528\u3059\u308b\u3068\u3001Amazon ECS \u30af\u30e9\u30b9\u30bf\u30fc\u3067 Prometheus \u306e\u6a5f\u80fd\u3092\u6d3b\u7528\u3067\u304d\u307e\u3059\u3002\u3053\u308c\u306f EC2 \u3068 Fargate \u306b\u30c7\u30d7\u30ed\u30a4\u3055\u308c\u305f Amazon ECS \u30af\u30e9\u30b9\u30bf\u30fc\u3067\u5229\u7528\u53ef\u80fd\u3067\u3059\u3002CloudWatch \u30a8\u30fc\u30b8\u30a7\u30f3\u30c8\u306f Prometheus \u30b5\u30fc\u30d0\u30fc\u306e\u4ee3\u66ff\u3068\u3057\u3066\u4f7f\u7528\u3067\u304d\u3001\u30aa\u30d6\u30b6\u30fc\u30d0\u30d3\u30ea\u30c6\u30a3\u3092\u5411\u4e0a\u3055\u305b\u308b\u305f\u3081\u306b\u5fc5\u8981\u306a\u30e2\u30cb\u30bf\u30ea\u30f3\u30b0\u30c4\u30fc\u30eb\u306e\u6570\u3092\u524a\u6e1b\u3057\u307e\u3059\u3002Amazon ECS \u306b\u30c7\u30d7\u30ed\u30a4\u3055\u308c\u305f\u30b3\u30f3\u30c6\u30ca\u5316\u3055\u308c\u305f\u30a2\u30d7\u30ea\u30b1\u30fc\u30b7\u30e7\u30f3\u304b\u3089\u306e Prometheus \u30e1\u30c8\u30ea\u30af\u30b9\u306e\u691c\u51fa\u3092\u81ea\u52d5\u5316\u3057\u3001\u30e1\u30c8\u30ea\u30af\u30b9\u30c7\u30fc\u30bf\u3092\u30d1\u30d5\u30a9\u30fc\u30de\u30f3\u30b9\u30ed\u30b0\u30a4\u30d9\u30f3\u30c8\u3068\u3057\u3066 CloudWatch \u306b\u9001\u4fe1\u3057\u307e\u3059\u3002"]}),"\n",(0,s.jsx)(n.admonition,{type:"info",children:(0,s.jsxs)(n.p,{children:["Amazon ECS \u30af\u30e9\u30b9\u30bf\u30fc\u306b Prometheus \u30e1\u30c8\u30ea\u30af\u30b9\u53ce\u96c6\u6a5f\u80fd\u3092\u6301\u3064 CloudWatch \u30a8\u30fc\u30b8\u30a7\u30f3\u30c8\u3092\u30c7\u30d7\u30ed\u30a4\u3059\u308b\u624b\u9806\u306f\u3001",(0,s.jsx)(n.a,{href:"https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/ContainerInsights-Prometheus-install-ECS.html",children:"Amazon CloudWatch \u30e6\u30fc\u30b6\u30fc\u30ac\u30a4\u30c9"})," \u306b\u8a18\u8f09\u3055\u308c\u3066\u3044\u307e\u3059\u3002"]})}),"\n",(0,s.jsx)(n.admonition,{type:"warning",children:(0,s.jsxs)(n.p,{children:["Prometheus \u7528 Container Insights \u30e2\u30cb\u30bf\u30ea\u30f3\u30b0\u306b\u3088\u3063\u3066\u53ce\u96c6\u3055\u308c\u308b\u30e1\u30c8\u30ea\u30af\u30b9\u306f\u3001\u30ab\u30b9\u30bf\u30e0\u30e1\u30c8\u30ea\u30af\u30b9\u3068\u3057\u3066\u8ab2\u91d1\u3055\u308c\u307e\u3059\u3002CloudWatch \u306e\u6599\u91d1\u306b\u3064\u3044\u3066\u8a73\u3057\u304f\u306f\u3001",(0,s.jsx)(n.a,{href:"https://aws.amazon.com/jp/cloudwatch/pricing/",children:"Amazon CloudWatch \u306e\u6599\u91d1"})," \u3092\u3054\u89a7\u304f\u3060\u3055\u3044\u3002"]})}),"\n",(0,s.jsx)(n.h3,{id:"amazon-ecs-\u30af\u30e9\u30b9\u30bf\u30fc\u3067\u306e\u30bf\u30fc\u30b2\u30c3\u30c8\u306e\u81ea\u52d5\u691c\u51fa",children:"Amazon ECS \u30af\u30e9\u30b9\u30bf\u30fc\u3067\u306e\u30bf\u30fc\u30b2\u30c3\u30c8\u306e\u81ea\u52d5\u691c\u51fa"}),"\n",(0,s.jsxs)(n.p,{children:["CloudWatch \u30a8\u30fc\u30b8\u30a7\u30f3\u30c8\u306f\u3001Prometheus \u30c9\u30ad\u30e5\u30e1\u30f3\u30c8\u306e ",(0,s.jsx)(n.a,{href:"https://prometheus.io/docs/prometheus/latest/configuration/configuration/#scrape_config",children:"scrape_config"})," \u30bb\u30af\u30b7\u30e7\u30f3\u306b\u3042\u308b\u6a19\u6e96\u7684\u306a Prometheus \u30b9\u30af\u30ec\u30a4\u30d7\u8a2d\u5b9a\u3092\u30b5\u30dd\u30fc\u30c8\u3057\u3066\u3044\u307e\u3059\u3002Prometheus \u306f\u3001\u6570\u5341\u7a2e\u985e\u306e",(0,s.jsx)(n.a,{href:"https://prometheus.io/docs/prometheus/latest/configuration/configuration/#scrape_config",children:"\u30b5\u30fc\u30d3\u30b9\u30c7\u30a3\u30b9\u30ab\u30d0\u30ea\u30e1\u30ab\u30cb\u30ba\u30e0"}),"\u306e\u3044\u305a\u308c\u304b\u3092\u4f7f\u7528\u3057\u3066\u3001\u30b9\u30af\u30ec\u30a4\u30d4\u30f3\u30b0\u30bf\u30fc\u30b2\u30c3\u30c8\u306e\u9759\u7684\u304a\u3088\u3073\u52d5\u7684\u306a\u691c\u51fa\u3092\u30b5\u30dd\u30fc\u30c8\u3057\u3066\u3044\u307e\u3059\u3002Amazon ECS \u306b\u306f\u7d44\u307f\u8fbc\u307f\u306e\u30b5\u30fc\u30d3\u30b9\u30c7\u30a3\u30b9\u30ab\u30d0\u30ea\u30e1\u30ab\u30cb\u30ba\u30e0\u304c\u306a\u3044\u305f\u3081\u3001\u30a8\u30fc\u30b8\u30a7\u30f3\u30c8\u306f\u30d5\u30a1\u30a4\u30eb\u30d9\u30fc\u30b9\u306e\u30bf\u30fc\u30b2\u30c3\u30c8\u691c\u51fa\u306b\u5bfe\u3059\u308b Prometheus \u306e\u30b5\u30dd\u30fc\u30c8\u306b\u4f9d\u5b58\u3057\u3066\u3044\u307e\u3059\u3002\u30d5\u30a1\u30a4\u30eb\u30d9\u30fc\u30b9\u306e\u30bf\u30fc\u30b2\u30c3\u30c8\u691c\u51fa\u306e\u305f\u3081\u306b\u30a8\u30fc\u30b8\u30a7\u30f3\u30c8\u3092\u8a2d\u5b9a\u3059\u308b\u306b\u306f\u3001\u30a8\u30fc\u30b8\u30a7\u30f3\u30c8\u306e\u8d77\u52d5\u306b\u4f7f\u7528\u3055\u308c\u308b\u30bf\u30b9\u30af\u5b9a\u7fa9\u3067\u5b9a\u7fa9\u3055\u308c\u305f 2 \u3064\u306e",(0,s.jsx)(n.a,{href:"https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/ContainerInsights-Prometheus-Setup-configure-ECS.html",children:"\u8a2d\u5b9a\u30d1\u30e9\u30e1\u30fc\u30bf"}),"\u304c\u5fc5\u8981\u3067\u3059\u3002\u3053\u308c\u3089\u306e\u30d1\u30e9\u30e1\u30fc\u30bf\u3092\u30ab\u30b9\u30bf\u30de\u30a4\u30ba\u3059\u308b\u3053\u3068\u3067\u3001\u30a8\u30fc\u30b8\u30a7\u30f3\u30c8\u304c\u53ce\u96c6\u3059\u308b\u30e1\u30c8\u30ea\u30af\u30b9\u3092\u7d30\u304b\u304f\u5236\u5fa1\u3067\u304d\u307e\u3059\u3002"]}),"\n",(0,s.jsx)(n.p,{children:"\u6700\u521d\u306e\u30d1\u30e9\u30e1\u30fc\u30bf\u306b\u306f\u3001\u4ee5\u4e0b\u306e\u30b5\u30f3\u30d7\u30eb\u306e\u3088\u3046\u306a Prometheus \u306e\u30b0\u30ed\u30fc\u30d0\u30eb\u8a2d\u5b9a\u304c\u542b\u307e\u308c\u3066\u3044\u307e\u3059\uff1a"}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{children:'global:\n  scrape_interval: 30s\n  scrape_timeout: 10s\nscrape_configs:\n  - job_name: cwagent_ecs_auto_sd\n    sample_limit: 10000\n    file_sd_configs:\n      - files: [ "/tmp/cwagent_ecs_auto_sd.yaml" ] \n'})}),"\n",(0,s.jsxs)(n.p,{children:["2 \u756a\u76ee\u306e\u30d1\u30e9\u30e1\u30fc\u30bf\u306b\u306f\u3001\u30a8\u30fc\u30b8\u30a7\u30f3\u30c8\u304c\u30b9\u30af\u30ec\u30a4\u30d4\u30f3\u30b0\u30bf\u30fc\u30b2\u30c3\u30c8\u3092\u691c\u51fa\u3059\u308b\u306e\u306b\u5f79\u7acb\u3064\u8a2d\u5b9a\u304c\u542b\u307e\u308c\u3066\u3044\u307e\u3059\u3002\u30a8\u30fc\u30b8\u30a7\u30f3\u30c8\u306f\u5b9a\u671f\u7684\u306b Amazon ECS \u306b API \u30b3\u30fc\u30eb\u3092\u884c\u3044\u3001\u3053\u306e\u8a2d\u5b9a\u306e ",(0,s.jsx)(n.em,{children:"ecs_service_discovery"})," \u30bb\u30af\u30b7\u30e7\u30f3\u3067\u5b9a\u7fa9\u3055\u308c\u305f\u30bf\u30b9\u30af\u5b9a\u7fa9\u30d1\u30bf\u30fc\u30f3\u306b\u4e00\u81f4\u3059\u308b\u5b9f\u884c\u4e2d\u306e ECS \u30bf\u30b9\u30af\u306e\u30e1\u30bf\u30c7\u30fc\u30bf\u3092\u53d6\u5f97\u3057\u307e\u3059\u3002\u691c\u51fa\u3055\u308c\u305f\u3059\u3079\u3066\u306e\u30bf\u30fc\u30b2\u30c3\u30c8\u306f\u3001CloudWatch \u30a8\u30fc\u30b8\u30a7\u30f3\u30c8\u30b3\u30f3\u30c6\u30ca\u306b\u30de\u30a6\u30f3\u30c8\u3055\u308c\u305f\u30d5\u30a1\u30a4\u30eb\u30b7\u30b9\u30c6\u30e0\u4e0a\u306e\u7d50\u679c\u30d5\u30a1\u30a4\u30eb ",(0,s.jsx)(n.em,{children:"/tmp/cwagent_ecs_auto_sd.yaml"})," \u306b\u66f8\u304d\u8fbc\u307e\u308c\u307e\u3059\u3002\u4ee5\u4e0b\u306e\u30b5\u30f3\u30d7\u30eb\u8a2d\u5b9a\u3067\u306f\u3001\u30a8\u30fc\u30b8\u30a7\u30f3\u30c8\u304c ",(0,s.jsx)(n.em,{children:"BackendTask"})," \u3068\u3044\u3046\u30d7\u30ec\u30d5\u30a3\u30c3\u30af\u30b9\u3067\u540d\u4ed8\u3051\u3089\u308c\u305f\u3059\u3079\u3066\u306e\u30bf\u30b9\u30af\u304b\u3089\u30e1\u30c8\u30ea\u30af\u30b9\u3092\u30b9\u30af\u30ec\u30a4\u30d4\u30f3\u30b0\u3059\u308b\u3053\u3068\u306b\u306a\u308a\u307e\u3059\u3002Amazon ECS \u30af\u30e9\u30b9\u30bf\u30fc\u3067\u306e\u30bf\u30fc\u30b2\u30c3\u30c8\u306e\u81ea\u52d5\u691c\u51fa\u306b\u3064\u3044\u3066\u306f\u3001",(0,s.jsx)(n.a,{href:"https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/ContainerInsights-Prometheus-Setup-autodiscovery-ecs.html",children:"\u8a73\u7d30\u30ac\u30a4\u30c9"}),"\u3092\u53c2\u7167\u3057\u3066\u304f\u3060\u3055\u3044\u3002"]}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{children:'{\n   "logs":{\n      "metrics_collected":{\n         "prometheus":{\n            "log_group_name":"/aws/ecs/containerinsights/{ClusterName}/prometheus"\n            "prometheus_config_path":"env:PROMETHEUS_CONFIG_CONTENT",\n            "ecs_service_discovery":{\n               "sd_frequency":"1m",\n               "sd_result_file":"/tmp/cwagent_ecs_auto_sd.yaml",\n               "task_definition_list":[\n                  {\n                     "sd_job_name":"backends",\n                     "sd_metrics_ports":"3000",\n                     "sd_task_definition_arn_pattern":".*:task-definition/BackendTask:[0-9]+",\n                     "sd_metrics_path":"/metrics"\n                  }\n               ]\n            },\n            "emf_processor":{\n               "metric_declaration":[\n                  {\n                     "source_labels":[\n                        "job"\n                     ],\n                     "label_matcher":"^backends$",\n                     "dimensions":[\n                        [\n                           "ClusterName",\n                           "TaskGroup"\n                        ]\n                     ],\n                     "metric_selectors":[\n                        "^http_requests_total$"\n                     ]\n                  }\n               ]\n            }\n         }\n      },\n      "force_flush_interval":5\n   }\n}\n'})}),"\n",(0,s.jsx)(n.h3,{id:"prometheus-\u30e1\u30c8\u30ea\u30af\u30b9\u306e-cloudwatch-\u3078\u306e\u30a4\u30f3\u30dd\u30fc\u30c8",children:"Prometheus \u30e1\u30c8\u30ea\u30af\u30b9\u306e CloudWatch \u3078\u306e\u30a4\u30f3\u30dd\u30fc\u30c8"}),"\n",(0,s.jsxs)(n.p,{children:["\u30a8\u30fc\u30b8\u30a7\u30f3\u30c8\u306b\u3088\u3063\u3066\u53ce\u96c6\u3055\u308c\u305f\u30e1\u30c8\u30ea\u30af\u30b9\u306f\u3001\u8a2d\u5b9a\u306e ",(0,s.jsx)(n.em,{children:"metric_declaration"})," \u30bb\u30af\u30b7\u30e7\u30f3\u3067\u6307\u5b9a\u3055\u308c\u305f\u30d5\u30a3\u30eb\u30bf\u30ea\u30f3\u30b0\u30eb\u30fc\u30eb\u306b\u57fa\u3065\u3044\u3066\u3001\u30d1\u30d5\u30a9\u30fc\u30de\u30f3\u30b9\u30ed\u30b0\u30a4\u30d9\u30f3\u30c8\u3068\u3057\u3066 CloudWatch \u306b\u9001\u4fe1\u3055\u308c\u307e\u3059\u3002\u3053\u306e\u30bb\u30af\u30b7\u30e7\u30f3\u306f\u3001\u751f\u6210\u3055\u308c\u308b\u57cb\u3081\u8fbc\u307f\u30e1\u30c8\u30ea\u30af\u30b9\u5f62\u5f0f\u306e\u30ed\u30b0\u306e\u914d\u5217\u3092\u6307\u5b9a\u3059\u308b\u305f\u3081\u306b\u3082\u4f7f\u7528\u3055\u308c\u307e\u3059\u3002\u4e0a\u8a18\u306e\u30b5\u30f3\u30d7\u30eb\u8a2d\u5b9a\u3067\u306f\u3001",(0,s.jsxs)(n.em,{children:["job",":backends"]})," \u3068\u3044\u3046\u30e9\u30d9\u30eb\u3092\u6301\u3064 ",(0,s.jsx)(n.em,{children:"http_requests_total"})," \u3068\u3044\u3046\u540d\u524d\u306e\u30e1\u30c8\u30ea\u30af\u30b9\u306b\u5bfe\u3057\u3066\u306e\u307f\u3001\u4ee5\u4e0b\u306e\u3088\u3046\u306a\u30ed\u30b0\u30a4\u30d9\u30f3\u30c8\u304c\u751f\u6210\u3055\u308c\u307e\u3059\u3002\u3053\u306e\u30c7\u30fc\u30bf\u3092\u4f7f\u7528\u3057\u3066\u3001CloudWatch \u306f CloudWatch \u540d\u524d\u7a7a\u9593 ",(0,s.jsx)(n.em,{children:"ECS/ContainerInsights/Prometheus"})," \u306e\u4e0b\u306b\u3001",(0,s.jsx)(n.em,{children:"ClusterName"})," \u3068 ",(0,s.jsx)(n.em,{children:"TaskGroup"})," \u3068\u3044\u3046\u30c7\u30a3\u30e1\u30f3\u30b7\u30e7\u30f3\u3092\u6301\u3064 ",(0,s.jsx)(n.em,{children:"http_requests_total"})," \u30e1\u30c8\u30ea\u30af\u30b9\u3092\u4f5c\u6210\u3057\u307e\u3059\u3002"]}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{children:'{\n   "CloudWatchMetrics":[\n      {\n         "Metrics":[\n            {\n               "Name":"http_requests_total"\n            }\n         ],\n         "Dimensions":[\n            [\n               "ClusterName",\n               "TaskGroup"\n            ]\n         ],\n         "Namespace":"ECS/ContainerInsights/Prometheus"\n      }\n   ],\n   "ClusterName":"ecs-sarathy-cluster",\n   "LaunchType":"EC2",\n   "StartedBy":"ecs-svc/4964126209508453538",\n   "TaskDefinitionFamily":"BackendAlarmTask",\n   "TaskGroup":"service:BackendService",\n   "TaskRevision":"4",\n   "Timestamp":"1678226606712",\n   "Version":"0",\n   "container_name":"go-backend",\n   "exported_job":"storebackend",\n   "http_requests_total":36,\n   "instance":"10.10.100.191:3000",\n   "job":"backends",\n   "path":"/popular/category",\n   "prom_metric_type":"counter"\n}\n'})})]})}function d(e={}){const{wrapper:n}={...(0,o.R)(),...e.components};return n?(0,s.jsx)(n,{...e,children:(0,s.jsx)(h,{...e})}):h(e)}}}]);
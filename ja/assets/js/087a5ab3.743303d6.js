"use strict";(self.webpackChunkobservability_best_practices=self.webpackChunkobservability_best_practices||[]).push([[9888],{72468:(n,s,e)=>{e.r(s),e.d(s,{assets:()=>r,contentTitle:()=>o,default:()=>l,frontMatter:()=>a,metadata:()=>c,toc:()=>d});var t=e(74848),i=e(28453);const a={},o="Container Insights \u3092\u4f7f\u7528\u3057\u305f\u30b7\u30b9\u30c6\u30e0\u30e1\u30c8\u30ea\u30af\u30b9\u306e\u53ce\u96c6",c={id:"guides/containers/aws-native/ecs/best-practices-metrics-collection-1",title:"Container Insights \u3092\u4f7f\u7528\u3057\u305f\u30b7\u30b9\u30c6\u30e0\u30e1\u30c8\u30ea\u30af\u30b9\u306e\u53ce\u96c6",description:"\u30b7\u30b9\u30c6\u30e0\u30e1\u30c8\u30ea\u30af\u30b9\u306f\u3001\u30b5\u30fc\u30d0\u30fc\u4e0a\u306e\u7269\u7406\u30b3\u30f3\u30dd\u30fc\u30cd\u30f3\u30c8\u3067\u3042\u308b CPU\u3001\u30e1\u30e2\u30ea\u3001\u30c7\u30a3\u30b9\u30af\u3001\u30cd\u30c3\u30c8\u30ef\u30fc\u30af\u30a4\u30f3\u30bf\u30fc\u30d5\u30a7\u30a4\u30b9\u306a\u3069\u306e\u4f4e\u30ec\u30d9\u30eb\u30ea\u30bd\u30fc\u30b9\u306b\u95a2\u9023\u3059\u308b\u3082\u306e\u3067\u3059\u3002",source:"@site/i18n/ja/docusaurus-plugin-content-docs/current/guides/containers/aws-native/ecs/best-practices-metrics-collection-1.md",sourceDirName:"guides/containers/aws-native/ecs",slug:"/guides/containers/aws-native/ecs/best-practices-metrics-collection-1",permalink:"/observability-best-practices/ja/docs/guides/containers/aws-native/ecs/best-practices-metrics-collection-1",draft:!1,unlisted:!1,editUrl:"https://github.com/aws-observability/observability-best-practices/docs/guides/containers/aws-native/ecs/best-practices-metrics-collection-1.md",tags:[],version:"current",frontMatter:{},sidebar:"guides",previous:{title:"EC2 Monitoring and Observability",permalink:"/observability-best-practices/ja/docs/guides/ec2-monitoring"},next:{title:"Container Insights \u3067\u306e\u30b5\u30fc\u30d3\u30b9\u30e1\u30c8\u30ea\u30af\u30b9\u306e\u53ce\u96c6",permalink:"/observability-best-practices/ja/docs/guides/containers/aws-native/ecs/best-practices-metrics-collection-2"}},r={},d=[{value:"\u30af\u30e9\u30b9\u30bf\u30fc\u30ec\u30d9\u30eb\u3068\u30b5\u30fc\u30d3\u30b9\u30ec\u30d9\u30eb\u306e\u30e1\u30c8\u30ea\u30af\u30b9\u306e\u53ce\u96c6",id:"\u30af\u30e9\u30b9\u30bf\u30fc\u30ec\u30d9\u30eb\u3068\u30b5\u30fc\u30d3\u30b9\u30ec\u30d9\u30eb\u306e\u30e1\u30c8\u30ea\u30af\u30b9\u306e\u53ce\u96c6",level:2},{value:"\u30a4\u30f3\u30b9\u30bf\u30f3\u30b9\u30ec\u30d9\u30eb\u306e\u30e1\u30c8\u30ea\u30af\u30b9\u306e\u53ce\u96c6",id:"\u30a4\u30f3\u30b9\u30bf\u30f3\u30b9\u30ec\u30d9\u30eb\u306e\u30e1\u30c8\u30ea\u30af\u30b9\u306e\u53ce\u96c6",level:2},{value:"Logs Insights \u3092\u4f7f\u7528\u3057\u305f\u30d1\u30d5\u30a9\u30fc\u30de\u30f3\u30b9\u30ed\u30b0\u30a4\u30d9\u30f3\u30c8\u306e\u5206\u6790",id:"logs-insights-\u3092\u4f7f\u7528\u3057\u305f\u30d1\u30d5\u30a9\u30fc\u30de\u30f3\u30b9\u30ed\u30b0\u30a4\u30d9\u30f3\u30c8\u306e\u5206\u6790",level:2}];function h(n){const s={a:"a",admonition:"admonition",code:"code",em:"em",h1:"h1",h2:"h2",img:"img",p:"p",pre:"pre",...(0,i.R)(),...n.components};return(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)(s.h1,{id:"container-insights-\u3092\u4f7f\u7528\u3057\u305f\u30b7\u30b9\u30c6\u30e0\u30e1\u30c8\u30ea\u30af\u30b9\u306e\u53ce\u96c6",children:"Container Insights \u3092\u4f7f\u7528\u3057\u305f\u30b7\u30b9\u30c6\u30e0\u30e1\u30c8\u30ea\u30af\u30b9\u306e\u53ce\u96c6"}),"\n",(0,t.jsxs)(s.p,{children:["\u30b7\u30b9\u30c6\u30e0\u30e1\u30c8\u30ea\u30af\u30b9\u306f\u3001\u30b5\u30fc\u30d0\u30fc\u4e0a\u306e\u7269\u7406\u30b3\u30f3\u30dd\u30fc\u30cd\u30f3\u30c8\u3067\u3042\u308b CPU\u3001\u30e1\u30e2\u30ea\u3001\u30c7\u30a3\u30b9\u30af\u3001\u30cd\u30c3\u30c8\u30ef\u30fc\u30af\u30a4\u30f3\u30bf\u30fc\u30d5\u30a7\u30a4\u30b9\u306a\u3069\u306e\u4f4e\u30ec\u30d9\u30eb\u30ea\u30bd\u30fc\u30b9\u306b\u95a2\u9023\u3059\u308b\u3082\u306e\u3067\u3059\u3002\nAmazon ECS \u306b\u30c7\u30d7\u30ed\u30a4\u3055\u308c\u305f\u30b3\u30f3\u30c6\u30ca\u5316\u3055\u308c\u305f\u30a2\u30d7\u30ea\u30b1\u30fc\u30b7\u30e7\u30f3\u304b\u3089\u306e\u30b7\u30b9\u30c6\u30e0\u30e1\u30c8\u30ea\u30af\u30b9\u3092\u53ce\u96c6\u3001\u96c6\u7d04\u3001\u8981\u7d04\u3059\u308b\u306b\u306f\u3001",(0,t.jsx)(s.a,{href:"https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/ContainerInsights.html",children:"CloudWatch Container Insights"})," \u3092\u4f7f\u7528\u3057\u307e\u3059\u3002Container Insights \u306f\u3001\u30b3\u30f3\u30c6\u30ca\u306e\u518d\u8d77\u52d5\u5931\u6557\u306a\u3069\u306e\u8a3a\u65ad\u60c5\u5831\u3082\u63d0\u4f9b\u3057\u3001\u554f\u984c\u3092\u7279\u5b9a\u3057\u3066\u8fc5\u901f\u306b\u89e3\u6c7a\u3059\u308b\u306e\u306b\u5f79\u7acb\u3061\u307e\u3059\u3002Amazon ECS \u30af\u30e9\u30b9\u30bf\u30fc\u304c EC2 \u3068 Fargate \u3067\u30c7\u30d7\u30ed\u30a4\u3055\u308c\u3066\u3044\u308b\u5834\u5408\u306b\u5229\u7528\u3067\u304d\u307e\u3059\u3002"]}),"\n",(0,t.jsxs)(s.p,{children:["Container Insights \u306f\u3001",(0,t.jsx)(s.a,{href:"https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/CloudWatch_Embedded_Metric_Format.html",children:"\u57cb\u3081\u8fbc\u307f\u30e1\u30c8\u30ea\u30af\u30b9\u30d5\u30a9\u30fc\u30de\u30c3\u30c8"}),"\u3092\u4f7f\u7528\u3057\u3066\u30d1\u30d5\u30a9\u30fc\u30de\u30f3\u30b9\u30ed\u30b0\u30a4\u30d9\u30f3\u30c8\u3068\u3057\u3066\u30c7\u30fc\u30bf\u3092\u53ce\u96c6\u3057\u307e\u3059\u3002\u3053\u308c\u3089\u306e\u30d1\u30d5\u30a9\u30fc\u30de\u30f3\u30b9\u30ed\u30b0\u30a4\u30d9\u30f3\u30c8\u306f\u3001\u9ad8\u57fa\u6570\u30c7\u30fc\u30bf\u3092\u5927\u898f\u6a21\u306b\u53d6\u308a\u8fbc\u307f\u3001\u4fdd\u5b58\u3067\u304d\u308b\u3088\u3046\u306b\u69cb\u9020\u5316\u3055\u308c\u305f JSON \u30b9\u30ad\u30fc\u30de\u3092\u4f7f\u7528\u3057\u305f\u30a8\u30f3\u30c8\u30ea\u3067\u3059\u3002\u3053\u306e\u30c7\u30fc\u30bf\u304b\u3089\u3001CloudWatch \u306f\u30af\u30e9\u30b9\u30bf\u30fc\u3001\u30ce\u30fc\u30c9\u3001\u30b5\u30fc\u30d3\u30b9\u3001\u30bf\u30b9\u30af\u306e\u30ec\u30d9\u30eb\u3067\u96c6\u8a08\u30e1\u30c8\u30ea\u30af\u30b9\u3092 CloudWatch \u30e1\u30c8\u30ea\u30af\u30b9\u3068\u3057\u3066\u4f5c\u6210\u3057\u307e\u3059\u3002"]}),"\n",(0,t.jsxs)(s.admonition,{type:"note",children:[(0,t.jsx)(s.p,{children:"Container Insights \u306e\u30e1\u30c8\u30ea\u30af\u30b9\u3092 CloudWatch \u306b\u8868\u793a\u3059\u308b\u306b\u306f\u3001Amazon ECS \u30af\u30e9\u30b9\u30bf\u30fc\u3067 Container Insights \u3092\u6709\u52b9\u306b\u3059\u308b\u5fc5\u8981\u304c\u3042\u308a\u307e\u3059\u3002\u3053\u308c\u306f\u30a2\u30ab\u30a6\u30f3\u30c8\u30ec\u30d9\u30eb\u307e\u305f\u306f\u500b\u3005\u306e\u30af\u30e9\u30b9\u30bf\u30fc\u30ec\u30d9\u30eb\u3067\u5b9f\u884c\u3067\u304d\u307e\u3059\u3002\u30a2\u30ab\u30a6\u30f3\u30c8\u30ec\u30d9\u30eb\u3067\u6709\u52b9\u306b\u3059\u308b\u306b\u306f\u3001\u6b21\u306e AWS CLI \u30b3\u30de\u30f3\u30c9\u3092\u4f7f\u7528\u3057\u307e\u3059\u3002"}),(0,t.jsx)(s.pre,{children:(0,t.jsx)(s.code,{children:'aws ecs put-account-setting --name "containerInsights" --value "enabled\n'})}),(0,t.jsx)(s.p,{children:"\u500b\u3005\u306e\u30af\u30e9\u30b9\u30bf\u30fc\u30ec\u30d9\u30eb\u3067\u6709\u52b9\u306b\u3059\u308b\u306b\u306f\u3001\u6b21\u306e AWS CLI \u30b3\u30de\u30f3\u30c9\u3092\u4f7f\u7528\u3057\u307e\u3059\u3002"}),(0,t.jsx)(s.pre,{children:(0,t.jsx)(s.code,{children:"aws ecs update-cluster-settings --cluster $CLUSTER_NAME --settings name=containerInsights,value=enabled\n"})})]}),"\n",(0,t.jsx)(s.h2,{id:"\u30af\u30e9\u30b9\u30bf\u30fc\u30ec\u30d9\u30eb\u3068\u30b5\u30fc\u30d3\u30b9\u30ec\u30d9\u30eb\u306e\u30e1\u30c8\u30ea\u30af\u30b9\u306e\u53ce\u96c6",children:"\u30af\u30e9\u30b9\u30bf\u30fc\u30ec\u30d9\u30eb\u3068\u30b5\u30fc\u30d3\u30b9\u30ec\u30d9\u30eb\u306e\u30e1\u30c8\u30ea\u30af\u30b9\u306e\u53ce\u96c6"}),"\n",(0,t.jsxs)(s.p,{children:["\u30c7\u30d5\u30a9\u30eb\u30c8\u3067\u306f\u3001CloudWatch Container Insights \u306f\u30bf\u30b9\u30af\u3001\u30b5\u30fc\u30d3\u30b9\u3001\u30af\u30e9\u30b9\u30bf\u306e\u30ec\u30d9\u30eb\u3067\u30e1\u30c8\u30ea\u30af\u30b9\u3092\u53ce\u96c6\u3057\u307e\u3059\u3002\nAmazon ECS \u30a8\u30fc\u30b8\u30a7\u30f3\u30c8\u306f\u3001EC2 \u30b3\u30f3\u30c6\u30ca\u30a4\u30f3\u30b9\u30bf\u30f3\u30b9\u4e0a\u306e\u5404\u30bf\u30b9\u30af(EC2 \u4e0a\u306e ECS \u3068 Fargate \u4e0a\u306e ECS \u306e\u4e21\u65b9)\u306e\u3053\u308c\u3089\u306e\u30e1\u30c8\u30ea\u30af\u30b9\u3092\u53ce\u96c6\u3057\u3001\u30d1\u30d5\u30a9\u30fc\u30de\u30f3\u30b9\u30ed\u30b0\u30a4\u30d9\u30f3\u30c8\u3068\u3057\u3066 CloudWatch \u306b\u9001\u4fe1\u3057\u307e\u3059\u3002\n\u30af\u30e9\u30b9\u30bf\u306b\u30a8\u30fc\u30b8\u30a7\u30f3\u30c8\u3092\u30c7\u30d7\u30ed\u30a4\u3059\u308b\u5fc5\u8981\u306f\u3042\u308a\u307e\u305b\u3093\u3002\u3053\u308c\u3089\u306e\u30e1\u30c8\u30ea\u30af\u30b9\u304c\u62bd\u51fa\u3055\u308c\u308b\u30ed\u30b0\u30a4\u30d9\u30f3\u30c8\u306f\u3001",(0,t.jsx)(s.em,{children:"/aws/ecs/containerinsights/$CLUSTER_NAME/performance"})," \u3068\u3044\u3046\u540d\u524d\u306e CloudWatch \u30ed\u30b0\u30b0\u30eb\u30fc\u30d7\u4e0b\u306b\u53ce\u96c6\u3055\u308c\u307e\u3059\u3002\n\u3053\u308c\u3089\u306e\u30a4\u30d9\u30f3\u30c8\u304b\u3089\u62bd\u51fa\u3055\u308c\u308b\u30e1\u30c8\u30ea\u30af\u30b9\u306e\u5b8c\u5168\u306a\u30ea\u30b9\u30c8\u306f",(0,t.jsx)(s.a,{href:"https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Container-Insights-metrics-ECS.html",children:"\u3053\u3061\u3089\u3067\u6587\u66f8\u5316\u3055\u308c\u3066\u3044\u307e\u3059"}),"\u3002\nContainer Insights \u304c\u53ce\u96c6\u3059\u308b\u30e1\u30c8\u30ea\u30af\u30b9\u306f\u3001CloudWatch \u30b3\u30f3\u30bd\u30fc\u30eb\u306e\u30ca\u30d3\u30b2\u30fc\u30b7\u30e7\u30f3\u30da\u30fc\u30b8\u304b\u3089 ",(0,t.jsx)(s.em,{children:"Container Insights"})," \u3092\u9078\u629e\u3057\u3001\u30c9\u30ed\u30c3\u30d7\u30c0\u30a6\u30f3\u30ea\u30b9\u30c8\u304b\u3089 ",(0,t.jsx)(s.em,{children:"performance monitoring"})," \u3092\u9078\u629e\u3059\u308b\u3053\u3068\u3067\u5229\u7528\u3067\u304d\u308b\u4e8b\u524d\u69cb\u7bc9\u3055\u308c\u305f\u30c0\u30c3\u30b7\u30e5\u30dc\u30fc\u30c9\u3067\u76f4\u3061\u306b\u8868\u793a\u3067\u304d\u307e\u3059\u3002\n\u307e\u305f\u3001CloudWatch \u30b3\u30f3\u30bd\u30fc\u30eb\u306e ",(0,t.jsx)(s.em,{children:"Metrics"})," \u30bb\u30af\u30b7\u30e7\u30f3\u3067\u3082\u8868\u793a\u3067\u304d\u307e\u3059\u3002"]}),"\n",(0,t.jsx)(s.p,{children:(0,t.jsx)(s.img,{alt:"Container Insights metrics dashboard",src:e(64485).A+"",width:"2694",height:"1416"})}),"\n",(0,t.jsx)(s.admonition,{type:"note",children:(0,t.jsxs)(s.p,{children:["Amazon EC2 \u30a4\u30f3\u30b9\u30bf\u30f3\u30b9\u4e0a\u3067 Amazon ECS \u3092\u4f7f\u7528\u3057\u3066\u3044\u308b\u5834\u5408\u3067\u3001Container Insights \u304b\u3089\u30cd\u30c3\u30c8\u30ef\u30fc\u30af\u3068\u30b9\u30c8\u30ec\u30fc\u30b8\u306e\u30e1\u30c8\u30ea\u30af\u30b9\u3092\u53ce\u96c6\u3057\u305f\u3044\u5834\u5408\u306f\u3001Amazon ECS \u30a8\u30fc\u30b8\u30a7\u30f3\u30c8\u30d0\u30fc\u30b8\u30e7\u30f3 1.29 \u3092\u542b\u3080 AMI \u3092\u4f7f\u7528\u3057\u3066\u305d\u306e\u30a4\u30f3\u30b9\u30bf\u30f3\u30b9\u3092\u8d77\u52d5\u3057\u3066\u304f\u3060\u3055\u3044\u3002\nContainer Insights \u306b\u3088\u3063\u3066\u53ce\u96c6\u3055\u308c\u305f\u30e1\u30c8\u30ea\u30af\u30b9\u306f\u3001\u30ab\u30b9\u30bf\u30e0\u30e1\u30c8\u30ea\u30af\u30b9\u3068\u3057\u3066\u8ab2\u91d1\u3055\u308c\u307e\u3059\u3002CloudWatch \u306e\u6599\u91d1\u306b\u3064\u3044\u3066\u8a73\u3057\u304f\u306f\u3001",(0,t.jsx)(s.a,{href:"https://aws.amazon.com/cloudwatch/pricing/",children:"Amazon CloudWatch \u6599\u91d1"})," \u3092\u53c2\u7167\u3057\u3066\u304f\u3060\u3055\u3044\u3002"]})}),"\n",(0,t.jsx)(s.h2,{id:"\u30a4\u30f3\u30b9\u30bf\u30f3\u30b9\u30ec\u30d9\u30eb\u306e\u30e1\u30c8\u30ea\u30af\u30b9\u306e\u53ce\u96c6",children:"\u30a4\u30f3\u30b9\u30bf\u30f3\u30b9\u30ec\u30d9\u30eb\u306e\u30e1\u30c8\u30ea\u30af\u30b9\u306e\u53ce\u96c6"}),"\n",(0,t.jsxs)(s.p,{children:["EC2 \u4e0a\u3067\u30db\u30b9\u30c8\u3055\u308c\u3066\u3044\u308b Amazon ECS \u30af\u30e9\u30b9\u30bf\u30fc\u306b CloudWatch \u30a8\u30fc\u30b8\u30a7\u30f3\u30c8\u3092\u30c7\u30d7\u30ed\u30a4\u3059\u308b\u3053\u3068\u3067\u3001\u305d\u306e\u30af\u30e9\u30b9\u30bf\u30fc\u306e\u30a4\u30f3\u30b9\u30bf\u30f3\u30b9\u30ec\u30d9\u30eb\u306e\u30e1\u30c8\u30ea\u30af\u30b9\u3092\u53ce\u96c6\u3067\u304d\u307e\u3059\u3002\u3053\u306e\u30a8\u30fc\u30b8\u30a7\u30f3\u30c8\u306f\u30c7\u30fc\u30e2\u30f3\u30b5\u30fc\u30d3\u30b9\u3068\u3057\u3066\u30c7\u30d7\u30ed\u30a4\u3055\u308c\u3001\u30af\u30e9\u30b9\u30bf\u30fc\u5185\u306e\u5404 EC2 \u30b3\u30f3\u30c6\u30ca\u30a4\u30f3\u30b9\u30bf\u30f3\u30b9\u304b\u3089\u30a4\u30f3\u30b9\u30bf\u30f3\u30b9\u30ec\u30d9\u30eb\u306e\u30e1\u30c8\u30ea\u30af\u30b9\u3092\u30d1\u30d5\u30a9\u30fc\u30de\u30f3\u30b9\u30ed\u30b0\u30a4\u30d9\u30f3\u30c8\u3068\u3057\u3066\u9001\u4fe1\u3057\u307e\u3059\u3002\u3053\u308c\u3089\u306e\u30a4\u30d9\u30f3\u30c8\u304b\u3089\u62bd\u51fa\u3055\u308c\u308b\u30a4\u30f3\u30b9\u30bf\u30f3\u30b9\u30ec\u30d9\u30eb\u306e\u30e1\u30c8\u30ea\u30af\u30b9\u306e\u5b8c\u5168\u306a\u30ea\u30b9\u30c8\u306f\u3001",(0,t.jsx)(s.a,{href:"https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Container-Insights-metrics-ECS.html",children:"\u3053\u3061\u3089\u3067\u6587\u66f8\u5316\u3055\u308c\u3066\u3044\u307e\u3059"}),"\u3002"]}),"\n",(0,t.jsx)(s.admonition,{type:"info",children:(0,t.jsxs)(s.p,{children:["Amazon ECS \u30af\u30e9\u30b9\u30bf\u30fc\u306b CloudWatch \u30a8\u30fc\u30b8\u30a7\u30f3\u30c8\u3092\u30c7\u30d7\u30ed\u30a4\u3057\u3066\u30a4\u30f3\u30b9\u30bf\u30f3\u30b9\u30ec\u30d9\u30eb\u306e\u30e1\u30c8\u30ea\u30af\u30b9\u3092\u53ce\u96c6\u3059\u308b\u624b\u9806\u306f\u3001",(0,t.jsx)(s.a,{href:"https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/deploy-container-insights-ECS-instancelevel.html",children:"Amazon CloudWatch \u30e6\u30fc\u30b6\u30fc\u30ac\u30a4\u30c9"}),"\u306b\u6587\u66f8\u5316\u3055\u308c\u3066\u3044\u307e\u3059\u3002Fargate \u4e0a\u3067\u30db\u30b9\u30c8\u3055\u308c\u3066\u3044\u308b Amazon ECS \u30af\u30e9\u30b9\u30bf\u30fc\u3067\u306f\u3001\u3053\u306e\u30aa\u30d7\u30b7\u30e7\u30f3\u306f\u5229\u7528\u3067\u304d\u306a\u3044\u3053\u3068\u306b\u6ce8\u610f\u3057\u3066\u304f\u3060\u3055\u3044\u3002"]})}),"\n",(0,t.jsx)(s.h2,{id:"logs-insights-\u3092\u4f7f\u7528\u3057\u305f\u30d1\u30d5\u30a9\u30fc\u30de\u30f3\u30b9\u30ed\u30b0\u30a4\u30d9\u30f3\u30c8\u306e\u5206\u6790",children:"Logs Insights \u3092\u4f7f\u7528\u3057\u305f\u30d1\u30d5\u30a9\u30fc\u30de\u30f3\u30b9\u30ed\u30b0\u30a4\u30d9\u30f3\u30c8\u306e\u5206\u6790"}),"\n",(0,t.jsxs)(s.p,{children:["Container Insights \u306f\u3001\u30e1\u30c8\u30ea\u30af\u30b9\u5f62\u5f0f\u304c\u57cb\u3081\u8fbc\u307e\u308c\u305f\u30d1\u30d5\u30a9\u30fc\u30de\u30f3\u30b9\u30ed\u30b0\u30a4\u30d9\u30f3\u30c8\u3092\u4f7f\u7528\u3057\u3066\u30e1\u30c8\u30ea\u30af\u30b9\u3092\u53ce\u96c6\u3057\u307e\u3059\u3002\u5404\u30ed\u30b0\u30a4\u30d9\u30f3\u30c8\u306b\u306f\u3001CPU \u3084\u30e1\u30e2\u30ea\u306a\u3069\u306e\u30b7\u30b9\u30c6\u30e0\u30ea\u30bd\u30fc\u30b9\u3001\u307e\u305f\u306f\u30bf\u30b9\u30af\u3084\u30b5\u30fc\u30d3\u30b9\u306a\u3069\u306e ECS \u30ea\u30bd\u30fc\u30b9\u3067\u89b3\u6e2c\u3055\u308c\u305f\u30d1\u30d5\u30a9\u30fc\u30de\u30f3\u30b9\u30c7\u30fc\u30bf\u304c\u542b\u307e\u308c\u3066\u3044\u308b\u5834\u5408\u304c\u3042\u308a\u307e\u3059\u3002Container Insights \u304c Amazon ECS \u306e\u30af\u30e9\u30b9\u30bf\u30fc\u3001\u30b5\u30fc\u30d3\u30b9\u3001\u30bf\u30b9\u30af\u3001\u30b3\u30f3\u30c6\u30ca\u306e\u30ec\u30d9\u30eb\u3067\u53ce\u96c6\u3059\u308b\u30d1\u30d5\u30a9\u30fc\u30de\u30f3\u30b9\u30ed\u30b0\u30a4\u30d9\u30f3\u30c8\u306e\u4f8b\u306f",(0,t.jsx)(s.a,{href:"https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Container-Insights-reference-performance-logs-ECS.html",children:"\u3053\u3061\u3089\u306b\u30ea\u30b9\u30c8\u3055\u308c\u3066\u3044\u307e\u3059"}),"\u3002CloudWatch \u306f\u3001\u3053\u308c\u3089\u306e\u30ed\u30b0\u30a4\u30d9\u30f3\u30c8\u306e\u30d1\u30d5\u30a9\u30fc\u30de\u30f3\u30b9\u30c7\u30fc\u30bf\u306e\u4e00\u90e8\u306e\u307f\u306b\u57fa\u3065\u3044\u3066\u30e1\u30c8\u30ea\u30af\u30b9\u3092\u751f\u6210\u3057\u307e\u3059\u3002\u3057\u304b\u3057\u3001\u3053\u308c\u3089\u306e\u30ed\u30b0\u30a4\u30d9\u30f3\u30c8\u3092\u4f7f\u7528\u3057\u3066\u3001CloudWatch Logs Insights \u30af\u30a8\u30ea\u3092\u4f7f\u7528\u3057\u305f\u30d1\u30d5\u30a9\u30fc\u30de\u30f3\u30b9\u30c7\u30fc\u30bf\u306e\u3088\u308a\u6df1\u3044\u5206\u6790\u3092\u5b9f\u884c\u3067\u304d\u307e\u3059\u3002"]}),"\n",(0,t.jsxs)(s.p,{children:["Logs Insights \u30af\u30a8\u30ea\u3092\u5b9f\u884c\u3059\u308b\u305f\u3081\u306e\u30e6\u30fc\u30b6\u30fc\u30a4\u30f3\u30bf\u30fc\u30d5\u30a7\u30a4\u30b9\u306f\u3001CloudWatch \u30b3\u30f3\u30bd\u30fc\u30eb\u306e\u30ca\u30d3\u30b2\u30fc\u30b7\u30e7\u30f3\u30da\u30fc\u30b8\u304b\u3089 ",(0,t.jsx)(s.em,{children:"Logs Insights"})," \u3092\u9078\u629e\u3059\u308b\u3053\u3068\u3067\u5229\u7528\u3067\u304d\u307e\u3059\u3002\u30ed\u30b0\u30b0\u30eb\u30fc\u30d7\u3092\u9078\u629e\u3059\u308b\u3068\u3001CloudWatch Logs Insights \u306f\u305d\u306e\u30ed\u30b0\u30b0\u30eb\u30fc\u30d7\u5185\u306e\u30d1\u30d5\u30a9\u30fc\u30de\u30f3\u30b9\u30ed\u30b0\u30a4\u30d9\u30f3\u30c8\u306e\u30d5\u30a3\u30fc\u30eb\u30c9\u3092\u81ea\u52d5\u7684\u306b\u691c\u51fa\u3057\u3001\u53f3\u5074\u306e\u30d1\u30cd\u30eb\u306e ",(0,t.jsx)(s.em,{children:"Discovered fields"})," \u306b\u8868\u793a\u3057\u307e\u3059\u3002\u30af\u30a8\u30ea\u306e\u5b9f\u884c\u7d50\u679c\u306f\u3001\u3053\u306e\u30ed\u30b0\u30b0\u30eb\u30fc\u30d7\u5185\u306e\u6642\u7cfb\u5217\u306b\u6cbf\u3063\u305f\u30ed\u30b0\u30a4\u30d9\u30f3\u30c8\u306e\u30d0\u30fc\u30b0\u30e9\u30d5\u3068\u3057\u3066\u8868\u793a\u3055\u308c\u307e\u3059\u3002\u3053\u306e\u30d0\u30fc\u30b0\u30e9\u30d5\u306f\u3001\u30af\u30a8\u30ea\u3068\u6642\u9593\u7bc4\u56f2\u306b\u4e00\u81f4\u3059\u308b\u30ed\u30b0\u30b0\u30eb\u30fc\u30d7\u5185\u306e\u30a4\u30d9\u30f3\u30c8\u306e\u5206\u5e03\u3092\u793a\u3057\u3066\u3044\u307e\u3059\u3002"]}),"\n",(0,t.jsx)(s.p,{children:(0,t.jsx)(s.img,{alt:"Logs Insights \u30c0\u30c3\u30b7\u30e5\u30dc\u30fc\u30c9",src:e(67339).A+"",width:"1882",height:"1718"})}),"\n",(0,t.jsxs)(s.admonition,{type:"info",children:[(0,t.jsx)(s.p,{children:"\u30b3\u30f3\u30c6\u30ca\u30ec\u30d9\u30eb\u306e CPU \u304a\u3088\u3073\u30e1\u30e2\u30ea\u4f7f\u7528\u7387\u30e1\u30c8\u30ea\u30af\u30b9\u3092\u8868\u793a\u3059\u308b Logs Insights \u30af\u30a8\u30ea\u306e\u30b5\u30f3\u30d7\u30eb\u3092\u4ee5\u4e0b\u306b\u793a\u3057\u307e\u3059\u3002"}),(0,t.jsx)(s.pre,{children:(0,t.jsx)(s.code,{children:"stats avg(CpuUtilized) as CPU, avg(MemoryUtilized) as Mem by TaskId, ContainerName | sort Mem, CPU desc\n"})})]})]})}function l(n={}){const{wrapper:s}={...(0,i.R)(),...n.components};return s?(0,t.jsx)(s,{...n,children:(0,t.jsx)(h,{...n})}):h(n)}},64485:(n,s,e)=>{e.d(s,{A:()=>t});const t=e.p+"assets/images/ContainerInsightsMetrics-589297ecbdecf420593ca5a49a49b62b.png"},67339:(n,s,e)=>{e.d(s,{A:()=>t});const t=e.p+"assets/images/LogInsights-2d76eb699dc7cbc972441815da930ad9.png"},28453:(n,s,e)=>{e.d(s,{R:()=>o,x:()=>c});var t=e(96540);const i={},a=t.createContext(i);function o(n){const s=t.useContext(a);return t.useMemo((function(){return"function"==typeof n?n(s):{...s,...n}}),[s,n])}function c(n){let s;return s=n.disableParentContext?"function"==typeof n.components?n.components(i):n.components||i:o(n.components),t.createElement(a.Provider,{value:s},n.children)}}}]);
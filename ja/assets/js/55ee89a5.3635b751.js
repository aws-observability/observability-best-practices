"use strict";(self.webpackChunkobservability_best_practices=self.webpackChunkobservability_best_practices||[]).push([[512],{4148:(e,n,s)=>{s.r(n),s.d(n,{assets:()=>c,contentTitle:()=>l,default:()=>h,frontMatter:()=>a,metadata:()=>t,toc:()=>r});const t=JSON.parse('{"id":"tools/slos","title":"Service Level Objectives (SLOs)","description":"\u9ad8\u53ef\u7528\u6027\u3068\u56de\u5fa9\u529b\u306e\u3042\u308b\u30a2\u30d7\u30ea\u30b1\u30fc\u30b7\u30e7\u30f3\u306f\u3001\u3042\u306a\u305f\u306e\u4f1a\u793e\u306b\u3068\u3063\u3066\u30a2\u30af\u30c6\u30a3\u30d6\u306a\u30d3\u30b8\u30cd\u30b9\u30c9\u30e9\u30a4\u30d0\u30fc\u3067\u3059\u304b\uff1f","source":"@site/i18n/ja/docusaurus-plugin-content-docs/current/tools/slos.md","sourceDirName":"tools","slug":"/tools/slos","permalink":"/observability-best-practices/ja/tools/slos","draft":false,"unlisted":false,"editUrl":"https://github.com/aws-observability/observability-best-practices/blob/main/docusaurus/docs/tools/slos.md","tags":[],"version":"current","frontMatter":{},"sidebar":"tools","previous":{"title":"Synthetic \u30c6\u30b9\u30c8","permalink":"/observability-best-practices/ja/tools/synthetics"},"next":{"title":"AWS X-Ray","permalink":"/observability-best-practices/ja/tools/xray"}}');var i=s(74848),o=s(28453);const a={},l="Service Level Objectives (SLOs)",c={},r=[{value:"\u30b5\u30fc\u30d3\u30b9\u30ec\u30d9\u30eb\u306e\u7528\u8a9e",id:"\u30b5\u30fc\u30d3\u30b9\u30ec\u30d9\u30eb\u306e\u7528\u8a9e",level:2},{value:"\u3053\u308c\u3089\u3059\u3079\u3066\u3092\u76e3\u8996\u3059\u308b AWS \u306e\u30c4\u30fc\u30eb\u306f\u3042\u308a\u307e\u3059\u304b\uff1f",id:"\u3053\u308c\u3089\u3059\u3079\u3066\u3092\u76e3\u8996\u3059\u308b-aws-\u306e\u30c4\u30fc\u30eb\u306f\u3042\u308a\u307e\u3059\u304b",level:3}];function p(e){const n={a:"a",h1:"h1",h2:"h2",h3:"h3",header:"header",img:"img",li:"li",p:"p",strong:"strong",ul:"ul",...(0,o.R)(),...e.components};return(0,i.jsxs)(i.Fragment,{children:[(0,i.jsx)(n.header,{children:(0,i.jsx)(n.h1,{id:"service-level-objectives-slos",children:"Service Level Objectives (SLOs)"})}),"\n",(0,i.jsxs)(n.p,{children:["\u9ad8\u53ef\u7528\u6027\u3068\u56de\u5fa9\u529b\u306e\u3042\u308b\u30a2\u30d7\u30ea\u30b1\u30fc\u30b7\u30e7\u30f3\u306f\u3001\u3042\u306a\u305f\u306e\u4f1a\u793e\u306b\u3068\u3063\u3066\u30a2\u30af\u30c6\u30a3\u30d6\u306a\u30d3\u30b8\u30cd\u30b9\u30c9\u30e9\u30a4\u30d0\u30fc\u3067\u3059\u304b\uff1f\n\u7b54\u3048\u304c\u300c",(0,i.jsx)(n.strong,{children:"\u306f\u3044"}),"\u300d\u306e\u5834\u5408\u306f\u3001\u8aad\u307f\u9032\u3081\u3066\u304f\u3060\u3055\u3044\u3002"]}),"\n",(0,i.jsx)(n.p,{children:"\u969c\u5bb3\u306f\u5fc5\u305a\u767a\u751f\u3057\u3001\u3059\u3079\u3066\u306e\u3082\u306e\u306f\u6642\u9593\u3068\u3068\u3082\u306b\u6700\u7d42\u7684\u306b\u6545\u969c\u3057\u307e\u3059\uff01\u3053\u308c\u306f\u3001\u30b9\u30b1\u30fc\u30eb\u3059\u308b\u5fc5\u8981\u306e\u3042\u308b\u30a2\u30d7\u30ea\u30b1\u30fc\u30b7\u30e7\u30f3\u3092\u69cb\u7bc9\u3059\u308b\u969b\u306b\u306f\u3001\u3055\u3089\u306b\u91cd\u8981\u306a\u6559\u8a13\u3068\u306a\u308a\u307e\u3059\u3002\u3053\u3053\u3067 SLOs \u306e\u91cd\u8981\u6027\u304c\u51fa\u3066\u304d\u307e\u3059\u3002"}),"\n",(0,i.jsx)(n.p,{children:"SLOs \u306f\u3001\u91cd\u8981\u306a\u30a8\u30f3\u30c9\u30e6\u30fc\u30b6\u30fc\u30b8\u30e3\u30fc\u30cb\u30fc\u306b\u57fa\u3065\u3044\u3066\u3001\u30b5\u30fc\u30d3\u30b9\u306e\u53ef\u7528\u6027\u306b\u95a2\u3057\u3066\u5408\u610f\u3055\u308c\u305f\u76ee\u6a19\u3092\u6e2c\u5b9a\u3057\u307e\u3059\u3002\u305d\u306e\u5408\u610f\u3055\u308c\u305f\u76ee\u6a19\u306f\u3001\u304a\u5ba2\u69d8\u3084\u30a8\u30f3\u30c9\u30e6\u30fc\u30b6\u30fc\u306b\u3068\u3063\u3066\u91cd\u8981\u306a\u4e8b\u9805\u3092\u4e2d\u5fc3\u306b\u8a2d\u5b9a\u3055\u308c\u308b\u5fc5\u8981\u304c\u3042\u308a\u307e\u3059\u3002\u3053\u306e\u3088\u3046\u306a\u56de\u5fa9\u529b\u306e\u3042\u308b\u30a8\u30b3\u30b7\u30b9\u30c6\u30e0\u3092\u69cb\u7bc9\u3059\u308b\u306b\u306f\u3001\u610f\u5473\u306e\u3042\u308b\u3001\u73fe\u5b9f\u7684\u3067\u3001\u5b9f\u884c\u53ef\u80fd\u306a SLOs \u3092\u4f7f\u7528\u3057\u3066\u3001\u30d1\u30d5\u30a9\u30fc\u30de\u30f3\u30b9\u3092\u5ba2\u89b3\u7684\u306b\u6e2c\u5b9a\u3057\u3001\u4fe1\u983c\u6027\u3092\u6b63\u78ba\u306b\u5831\u544a\u3059\u308b\u5fc5\u8981\u304c\u3042\u308a\u307e\u3059\u3002\u305d\u308c\u3067\u306f\u3001\u4e3b\u8981\u306a\u30b5\u30fc\u30d3\u30b9\u30ec\u30d9\u30eb\u306e\u7528\u8a9e\u306b\u3064\u3044\u3066\u7406\u89e3\u3092\u6df1\u3081\u3066\u3044\u304d\u307e\u3057\u3087\u3046\u3002"}),"\n",(0,i.jsx)(n.h2,{id:"\u30b5\u30fc\u30d3\u30b9\u30ec\u30d9\u30eb\u306e\u7528\u8a9e",children:"\u30b5\u30fc\u30d3\u30b9\u30ec\u30d9\u30eb\u306e\u7528\u8a9e"}),"\n",(0,i.jsxs)(n.ul,{children:["\n",(0,i.jsxs)(n.li,{children:["\n",(0,i.jsx)(n.p,{children:"SLI (Service Level Indicator): \u63d0\u4f9b\u3055\u308c\u308b\u30b5\u30fc\u30d3\u30b9\u30ec\u30d9\u30eb\u306e\u7279\u5b9a\u306e\u5074\u9762\u3092\u3001\u614e\u91cd\u306b\u5b9a\u7fa9\u3055\u308c\u305f\u5b9a\u91cf\u7684\u306a\u6307\u6a19\u3067\u3059\u3002"}),"\n"]}),"\n",(0,i.jsxs)(n.li,{children:["\n",(0,i.jsx)(n.p,{children:"SLO (Service Level Objective): SLI \u306b\u3088\u3063\u3066\u6e2c\u5b9a\u3055\u308c\u308b\u30b5\u30fc\u30d3\u30b9\u30ec\u30d9\u30eb\u306e\u76ee\u6a19\u5024\u307e\u305f\u306f\u5024\u306e\u7bc4\u56f2\u3067\u3001\u4e00\u5b9a\u671f\u9593\u306b\u308f\u305f\u3063\u3066\u6e2c\u5b9a\u3055\u308c\u307e\u3059\u3002"}),"\n"]}),"\n",(0,i.jsxs)(n.li,{children:["\n",(0,i.jsx)(n.p,{children:"SLA (Service Level Agreement): SLO \u304c\u672a\u9054\u6210\u306e\u5834\u5408\u306e\u7d50\u679c\u3092\u542b\u3080\u3001\u304a\u5ba2\u69d8\u3068\u306e\u5951\u7d04\u3067\u3059\u3002"}),"\n"]}),"\n"]}),"\n",(0,i.jsx)(n.p,{children:"\u6b21\u306e\u56f3\u306f\u3001SLA \u304c\u300c\u7d04\u675f/\u5951\u7d04\u300d\u3001SLO \u304c\u300c\u76ee\u6a19/\u76ee\u6a19\u5024\u300d\u3001SLI \u304c\u300c\u30b5\u30fc\u30d3\u30b9\u304c\u3069\u306e\u3088\u3046\u306b\u6a5f\u80fd\u3057\u305f\u304b\u300d\u306e\u6e2c\u5b9a\u3067\u3042\u308b\u3053\u3068\u3092\u793a\u3057\u3066\u3044\u307e\u3059\u3002"}),"\n",(0,i.jsx)(n.p,{children:(0,i.jsx)(n.img,{alt:"SLO data flow",src:s(50498).A+"",width:"1078",height:"598"})}),"\n",(0,i.jsx)(n.h3,{id:"\u3053\u308c\u3089\u3059\u3079\u3066\u3092\u76e3\u8996\u3059\u308b-aws-\u306e\u30c4\u30fc\u30eb\u306f\u3042\u308a\u307e\u3059\u304b",children:"\u3053\u308c\u3089\u3059\u3079\u3066\u3092\u76e3\u8996\u3059\u308b AWS \u306e\u30c4\u30fc\u30eb\u306f\u3042\u308a\u307e\u3059\u304b\uff1f"}),"\n",(0,i.jsxs)(n.p,{children:["\u7b54\u3048\u306f\u300c",(0,i.jsx)(n.strong,{children:"\u306f\u3044"}),"\u300d\u3067\u3059\uff01"]}),"\n",(0,i.jsxs)(n.p,{children:[(0,i.jsx)(n.a,{href:"https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/CloudWatch-Application-Monitoring-Sections.html",children:"Amazon CloudWatch Application Signals"})," \u306f\u3001AWS \u4e0a\u306e\u30a2\u30d7\u30ea\u30b1\u30fc\u30b7\u30e7\u30f3\u3092\u81ea\u52d5\u7684\u306b\u8a08\u6e2c\u3057\u3001\u904b\u7528\u3059\u308b\u3053\u3068\u3092\u5bb9\u6613\u306b\u3059\u308b\u65b0\u3057\u3044\u6a5f\u80fd\u3067\u3059\u3002Application Signals \u306f AWS \u4e0a\u306e\u30a2\u30d7\u30ea\u30b1\u30fc\u30b7\u30e7\u30f3\u3092\u8a08\u6e2c\u3057\u3001\u30a2\u30d7\u30ea\u30b1\u30fc\u30b7\u30e7\u30f3\u306e\u5065\u5168\u6027\u3092\u76e3\u8996\u3057\u3001\u30d3\u30b8\u30cd\u30b9\u76ee\u6a19\u306b\u5bfe\u3059\u308b\u30d1\u30d5\u30a9\u30fc\u30de\u30f3\u30b9\u3092\u8ffd\u8de1\u3067\u304d\u308b\u3088\u3046\u306b\u3057\u307e\u3059\u3002Application Signals \u306f\u3001\u30a2\u30d7\u30ea\u30b1\u30fc\u30b7\u30e7\u30f3\u3001\u30b5\u30fc\u30d3\u30b9\u3001\u4f9d\u5b58\u95a2\u4fc2\u306e\u7d71\u5408\u3055\u308c\u305f\u30a2\u30d7\u30ea\u30b1\u30fc\u30b7\u30e7\u30f3\u4e2d\u5fc3\u306e\u30d3\u30e5\u30fc\u3092\u63d0\u4f9b\u3057\u3001\u30a2\u30d7\u30ea\u30b1\u30fc\u30b7\u30e7\u30f3\u306e\u5065\u5168\u6027\u306e\u76e3\u8996\u3068\u30c8\u30ea\u30a2\u30fc\u30b8\u3092\u652f\u63f4\u3057\u307e\u3059\u3002Application Signals \u306f Amazon EKS\u3001Amazon ECS\u3001Amazon EC2 \u3067\u30b5\u30dd\u30fc\u30c8\u3055\u308c\u3001\u30c6\u30b9\u30c8\u3055\u308c\u3066\u3044\u307e\u3059\u304c\u3001\u3053\u306e\u8a18\u4e8b\u306e\u57f7\u7b46\u6642\u70b9\u3067\u306f Java \u30a2\u30d7\u30ea\u30b1\u30fc\u30b7\u30e7\u30f3\u306e\u307f\u3092\u30b5\u30dd\u30fc\u30c8\u3057\u3066\u3044\u307e\u3059\uff01"]}),"\n",(0,i.jsx)(n.p,{children:"Application Signals \u306f\u3001\u4e3b\u8981\u306a\u30d1\u30d5\u30a9\u30fc\u30de\u30f3\u30b9\u30e1\u30c8\u30ea\u30af\u30b9\u306b\u5bfe\u3059\u308b SLO \u306e\u8a2d\u5b9a\u3092\u652f\u63f4\u3057\u307e\u3059\u3002\u91cd\u8981\u306a\u30d3\u30b8\u30cd\u30b9\u30aa\u30da\u30ec\u30fc\u30b7\u30e7\u30f3\u306e\u30b5\u30fc\u30d3\u30b9\u306b\u5bfe\u3057\u3066 Service Level Objective \u3092\u4f5c\u6210\u3059\u308b\u3053\u3068\u304c\u3067\u304d\u307e\u3059\u3002\u3053\u308c\u3089\u306e\u30b5\u30fc\u30d3\u30b9\u306b SLO \u3092\u4f5c\u6210\u3059\u308b\u3053\u3068\u3067\u3001SLO \u30c0\u30c3\u30b7\u30e5\u30dc\u30fc\u30c9\u3067\u8ffd\u8de1\u3067\u304d\u3001\u6700\u3082\u91cd\u8981\u306a\u30aa\u30da\u30ec\u30fc\u30b7\u30e7\u30f3\u3092\u4e00\u76ee\u3067\u78ba\u8a8d\u3067\u304d\u307e\u3059\u3002\u6839\u672c\u539f\u56e0\u306e\u7279\u5b9a\u3092\u8fc5\u901f\u5316\u3059\u308b\u305f\u3081\u306b\u3001Application Signals \u306f\u3001\u91cd\u8981\u306a API \u3068\u30e6\u30fc\u30b6\u30fc\u30a4\u30f3\u30bf\u30e9\u30af\u30b7\u30e7\u30f3\u3092\u76e3\u8996\u3059\u308b CloudWatch Synthetics \u3084\u3001\u5b9f\u969b\u306e\u30e6\u30fc\u30b6\u30fc\u30d1\u30d5\u30a9\u30fc\u30de\u30f3\u30b9\u3092\u76e3\u8996\u3059\u308b CloudWatch RUM \u304b\u3089\u306e\u8ffd\u52a0\u306e\u30d1\u30d5\u30a9\u30fc\u30de\u30f3\u30b9\u30b7\u30b0\u30ca\u30eb\u3092\u7d71\u5408\u3057\u305f\u3001\u5305\u62ec\u7684\u306a\u30a2\u30d7\u30ea\u30b1\u30fc\u30b7\u30e7\u30f3\u30d1\u30d5\u30a9\u30fc\u30de\u30f3\u30b9\u30d3\u30e5\u30fc\u3092\u63d0\u4f9b\u3057\u307e\u3059\u3002"}),"\n",(0,i.jsx)(n.p,{children:"Application Signals \u306f\u3001\u691c\u51fa\u3057\u305f\u3059\u3079\u3066\u306e\u30b5\u30fc\u30d3\u30b9\u3068\u30aa\u30da\u30ec\u30fc\u30b7\u30e7\u30f3\u306e\u30ec\u30a4\u30c6\u30f3\u30b7\u30fc\u3068\u53ef\u7528\u6027\u30e1\u30c8\u30ea\u30af\u30b9\u3092\u81ea\u52d5\u7684\u306b\u53ce\u96c6\u3057\u3001\u3053\u308c\u3089\u306e\u30e1\u30c8\u30ea\u30af\u30b9\u306f SLI \u3068\u3057\u3066\u4f7f\u7528\u3059\u308b\u306e\u306b\u7406\u60f3\u7684\u3067\u3059\u3002\u540c\u6642\u306b\u3001Application Signals \u306f\u3001\u4efb\u610f\u306e CloudWatch \u30e1\u30c8\u30ea\u30af\u30b9\u307e\u305f\u306f\u30e1\u30c8\u30ea\u30af\u30b9\u5f0f\u3092 SLI \u3068\u3057\u3066\u4f7f\u7528\u3059\u308b\u67d4\u8edf\u6027\u3082\u63d0\u4f9b\u3057\u307e\u3059\uff01"}),"\n",(0,i.jsxs)(n.p,{children:["Application Signals \u306f\u3001\u30a2\u30d7\u30ea\u30b1\u30fc\u30b7\u30e7\u30f3\u30d1\u30d5\u30a9\u30fc\u30de\u30f3\u30b9\u306e\u30d9\u30b9\u30c8\u30d7\u30e9\u30af\u30c6\u30a3\u30b9\u306b\u57fa\u3065\u3044\u3066\u30a2\u30d7\u30ea\u30b1\u30fc\u30b7\u30e7\u30f3\u3092\u81ea\u52d5\u7684\u306b\u8a08\u6e2c\u3057\u3001Amazon EKS \u4e0a\u3067\u5b9f\u884c\u3055\u308c\u3066\u3044\u308b\u30a2\u30d7\u30ea\u30b1\u30fc\u30b7\u30e7\u30f3\u306e\u30e1\u30c8\u30ea\u30af\u30b9\u3001\u30c8\u30ec\u30fc\u30b9\u3001\u30ed\u30b0\u3001\u5b9f\u30e6\u30fc\u30b6\u30fc\u30e2\u30cb\u30bf\u30ea\u30f3\u30b0\u3001\u5408\u6210\u30e2\u30cb\u30bf\u30ea\u30f3\u30b0\u306b\u308f\u305f\u308b\u30c6\u30ec\u30e1\u30c8\u30ea\u3092\u76f8\u95a2\u4ed8\u3051\u307e\u3059\u3002\u8a73\u7d30\u306b\u3064\u3044\u3066\u306f\u3001\u3053\u306e",(0,i.jsx)(n.a,{href:"https://aws.amazon.com/jp/blogs/news/amazon-cloudwatch-application-signals-for-automatic-instrumentation-of-your-applications-preview/",children:"\u30d6\u30ed\u30b0"}),"\u3092\u304a\u8aad\u307f\u304f\u3060\u3055\u3044\u3002"]}),"\n",(0,i.jsxs)(n.p,{children:["CloudWatch Application Signals \u3067 SLO \u3092\u8a2d\u5b9a\u3057\u3066\u30b5\u30fc\u30d3\u30b9\u306e\u4fe1\u983c\u6027\u3092\u76e3\u8996\u3059\u308b\u65b9\u6cd5\u306b\u3064\u3044\u3066\u306f\u3001\u3053\u306e",(0,i.jsx)(n.a,{href:"https://aws.amazon.com/blogs/mt/how-to-monitor-application-health-using-slos-with-amazon-cloudwatch-application-signals/",children:"\u30d6\u30ed\u30b0"}),"\u3092\u3054\u89a7\u304f\u3060\u3055\u3044\u3002"]}),"\n",(0,i.jsxs)(n.p,{children:["\u30aa\u30d6\u30b6\u30fc\u30d0\u30d3\u30ea\u30c6\u30a3\u306f\u3001\u4fe1\u983c\u6027\u306e\u9ad8\u3044\u30b5\u30fc\u30d3\u30b9\u3092\u78ba\u7acb\u3059\u308b\u305f\u3081\u306e\u57fa\u790e\u7684\u306a\u8981\u7d20\u3067\u3042\u308a\u3001\u7d44\u7e54\u304c\u52b9\u679c\u7684\u306b\u30b9\u30b1\u30fc\u30eb\u3057\u3066\u904b\u7528\u3059\u308b\u305f\u3081\u306e\u9053\u3092\u958b\u304d\u307e\u3059\u3002\u79c1\u305f\u3061\u306f\u3001",(0,i.jsx)(n.a,{href:"https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/CloudWatch-Application-Monitoring-Sections.html",children:"Amazon CloudWatch Application Signals"})," \u304c\u305d\u306e\u30b4\u30fc\u30eb\u3092\u9054\u6210\u3059\u308b\u305f\u3081\u306e\u7d20\u6674\u3089\u3057\u3044\u30c4\u30fc\u30eb\u306b\u306a\u308b\u3068\u4fe1\u3058\u3066\u3044\u307e\u3059\u3002"]})]})}function h(e={}){const{wrapper:n}={...(0,o.R)(),...e.components};return n?(0,i.jsx)(n,{...e,children:(0,i.jsx)(p,{...e})}):p(e)}},28453:(e,n,s)=>{s.d(n,{R:()=>a,x:()=>l});var t=s(96540);const i={},o=t.createContext(i);function a(e){const n=t.useContext(o);return t.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function l(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(i):e.components||i:a(e.components),t.createElement(o.Provider,{value:n},e.children)}},50498:(e,n,s)=>{s.d(n,{A:()=>t});const t=s.p+"assets/images/slo-a3f4fa4a2ae3f5cefd2ca539d328331e.png"}}]);
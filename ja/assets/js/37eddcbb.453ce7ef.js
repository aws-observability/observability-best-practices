"use strict";(self.webpackChunkobservability_best_practices=self.webpackChunkobservability_best_practices||[]).push([[8853],{82171:(e,s,t)=>{t.r(s),t.d(s,{assets:()=>r,contentTitle:()=>o,default:()=>h,frontMatter:()=>i,metadata:()=>c,toc:()=>l});var n=t(74848),a=t(28453);const i={},o="\u30d1\u30fc\u30bb\u30f3\u30bf\u30a4\u30eb\u306e\u91cd\u8981\u6027",c={id:"guides/operational/business/sla-percentile",title:"\u30d1\u30fc\u30bb\u30f3\u30bf\u30a4\u30eb\u306e\u91cd\u8981\u6027",description:"\u30d1\u30fc\u30bb\u30f3\u30bf\u30a4\u30eb\u306f\u3001\u5e73\u5747\u5024\u3060\u3051\u306b\u4f9d\u5b58\u3059\u308b\u306e\u3067\u306f\u306a\u304f\u3001\u30c7\u30fc\u30bf\u5206\u5e03\u306e\u3088\u308a\u8a73\u7d30\u3067\u6b63\u78ba\u306a\u898b\u65b9\u3092\u63d0\u4f9b\u3059\u308b\u305f\u3081\u3001\u30e2\u30cb\u30bf\u30ea\u30f3\u30b0\u3068\u30ec\u30dd\u30fc\u30c8\u3067\u306f\u91cd\u8981\u3067\u3059\u3002\u5e73\u5747\u5024\u306f\u6642\u306b\u306f\u3001\u30d1\u30d5\u30a9\u30fc\u30de\u30f3\u30b9\u3084\u30e6\u30fc\u30b6\u30fc\u30a8\u30af\u30b9\u30da\u30ea\u30a8\u30f3\u30b9\u306b\u5927\u304d\u306a\u5f71\u97ff\u3092\u4e0e\u3048\u308b\u53ef\u80fd\u6027\u306e\u3042\u308b\u3001\u5916\u308c\u5024\u3084\u30c7\u30fc\u30bf\u306e\u5909\u52d5\u306a\u3069\u306e\u91cd\u8981\u306a\u60c5\u5831\u3092\u96a0\u3057\u3066\u3057\u307e\u3046\u3053\u3068\u304c\u3042\u308a\u307e\u3059\u3002\u4e00\u65b9\u3001\u30d1\u30fc\u30bb\u30f3\u30bf\u30a4\u30eb\u306f\u3053\u308c\u3089\u306e\u96a0\u3055\u308c\u305f\u8a73\u7d30\u3092\u660e\u3089\u304b\u306b\u3057\u3001\u30c7\u30fc\u30bf\u304c\u3069\u306e\u3088\u3046\u306b\u5206\u5e03\u3057\u3066\u3044\u308b\u304b\u3092\u3088\u308a\u3088\u304f\u7406\u89e3\u3059\u308b\u306e\u306b\u5f79\u7acb\u3061\u307e\u3059\u3002",source:"@site/i18n/ja/docusaurus-plugin-content-docs/current/guides/operational/business/sla-percentile.md",sourceDirName:"guides/operational/business",slug:"/guides/operational/business/sla-percentile",permalink:"/observability-best-practices/ja/guides/operational/business/sla-percentile",draft:!1,unlisted:!1,editUrl:"https://github.com/aws-observability/observability-best-practices/blob/main/docusaurus/docs/guides/operational/business/sla-percentile.md",tags:[],version:"current",frontMatter:{},sidebar:"guides",previous:{title:"\u306a\u305c\u30aa\u30d6\u30b6\u30fc\u30d0\u30d3\u30ea\u30c6\u30a3\u304c\u5fc5\u8981\u306a\u306e\u304b",permalink:"/observability-best-practices/ja/guides/operational/business/monitoring-for-business-outcomes"},next:{title:"key-performance-indicators",permalink:"/observability-best-practices/ja/guides/operational/business/key-performance-indicators"}},r={},l=[];function d(e){const s={a:"a",code:"code",h1:"h1",img:"img",p:"p",pre:"pre",strong:"strong",...(0,a.R)(),...e.components};return(0,n.jsxs)(n.Fragment,{children:[(0,n.jsx)(s.h1,{id:"\u30d1\u30fc\u30bb\u30f3\u30bf\u30a4\u30eb\u306e\u91cd\u8981\u6027",children:"\u30d1\u30fc\u30bb\u30f3\u30bf\u30a4\u30eb\u306e\u91cd\u8981\u6027"}),"\n",(0,n.jsx)(s.p,{children:"\u30d1\u30fc\u30bb\u30f3\u30bf\u30a4\u30eb\u306f\u3001\u5e73\u5747\u5024\u3060\u3051\u306b\u4f9d\u5b58\u3059\u308b\u306e\u3067\u306f\u306a\u304f\u3001\u30c7\u30fc\u30bf\u5206\u5e03\u306e\u3088\u308a\u8a73\u7d30\u3067\u6b63\u78ba\u306a\u898b\u65b9\u3092\u63d0\u4f9b\u3059\u308b\u305f\u3081\u3001\u30e2\u30cb\u30bf\u30ea\u30f3\u30b0\u3068\u30ec\u30dd\u30fc\u30c8\u3067\u306f\u91cd\u8981\u3067\u3059\u3002\u5e73\u5747\u5024\u306f\u6642\u306b\u306f\u3001\u30d1\u30d5\u30a9\u30fc\u30de\u30f3\u30b9\u3084\u30e6\u30fc\u30b6\u30fc\u30a8\u30af\u30b9\u30da\u30ea\u30a8\u30f3\u30b9\u306b\u5927\u304d\u306a\u5f71\u97ff\u3092\u4e0e\u3048\u308b\u53ef\u80fd\u6027\u306e\u3042\u308b\u3001\u5916\u308c\u5024\u3084\u30c7\u30fc\u30bf\u306e\u5909\u52d5\u306a\u3069\u306e\u91cd\u8981\u306a\u60c5\u5831\u3092\u96a0\u3057\u3066\u3057\u307e\u3046\u3053\u3068\u304c\u3042\u308a\u307e\u3059\u3002\u4e00\u65b9\u3001\u30d1\u30fc\u30bb\u30f3\u30bf\u30a4\u30eb\u306f\u3053\u308c\u3089\u306e\u96a0\u3055\u308c\u305f\u8a73\u7d30\u3092\u660e\u3089\u304b\u306b\u3057\u3001\u30c7\u30fc\u30bf\u304c\u3069\u306e\u3088\u3046\u306b\u5206\u5e03\u3057\u3066\u3044\u308b\u304b\u3092\u3088\u308a\u3088\u304f\u7406\u89e3\u3059\u308b\u306e\u306b\u5f79\u7acb\u3061\u307e\u3059\u3002"}),"\n",(0,n.jsxs)(s.p,{children:[(0,n.jsx)(s.a,{href:"https://aws.amazon.com/cloudwatch/",children:"Amazon CloudWatch"})," \u3067\u306f\u3001\u30a2\u30d7\u30ea\u30b1\u30fc\u30b7\u30e7\u30f3\u3068\u30a4\u30f3\u30d5\u30e9\u30b9\u30c8\u30e9\u30af\u30c1\u30e3\u5168\u4f53\u306e\u30ec\u30b9\u30dd\u30f3\u30b9\u30bf\u30a4\u30e0\u3001\u30ec\u30a4\u30c6\u30f3\u30b7\u30fc\u3001\u30a8\u30e9\u30fc\u30ec\u30fc\u30c8\u306a\u3069\u3001\u3055\u307e\u3056\u307e\u306a\u30e1\u30c8\u30ea\u30af\u30b9\u306e\u30e2\u30cb\u30bf\u30ea\u30f3\u30b0\u3068\u30ec\u30dd\u30fc\u30c8\u306b\u30d1\u30fc\u30bb\u30f3\u30bf\u30a4\u30eb\u3092\u4f7f\u7528\u3067\u304d\u307e\u3059\u3002\u30d1\u30fc\u30bb\u30f3\u30bf\u30a4\u30eb\u306b\u5bfe\u3059\u308b\u30a2\u30e9\u30fc\u30e0\u3092\u8a2d\u5b9a\u3059\u308b\u3053\u3068\u3067\u3001\u7279\u5b9a\u306e\u30d1\u30fc\u30bb\u30f3\u30bf\u30a4\u30eb\u5024\u304c\u3057\u304d\u3044\u5024\u3092\u8d85\u3048\u305f\u3068\u304d\u306b\u30a2\u30e9\u30fc\u30c8\u3092\u53d7\u3051\u53d6\u308a\u3001\u3088\u308a\u591a\u304f\u306e\u9867\u5ba2\u306b\u5f71\u97ff\u3092\u4e0e\u3048\u308b\u524d\u306b\u30a2\u30af\u30b7\u30e7\u30f3\u3092\u5b9f\u884c\u3067\u304d\u307e\u3059\u3002"]}),"\n",(0,n.jsxs)(s.p,{children:["CloudWatch \u3067",(0,n.jsx)(s.a,{href:"https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/cloudwatch_concepts.html#Percentiles",children:"\u30d1\u30fc\u30bb\u30f3\u30bf\u30a4\u30eb\u3092\u4f7f\u7528\u3059\u308b"}),"\u306b\u306f\u3001CloudWatch \u30b3\u30f3\u30bd\u30fc\u30eb\u306e ",(0,n.jsx)(s.strong,{children:"All metrics"})," \u3067\u30e1\u30c8\u30ea\u30af\u30b9\u3092\u9078\u629e\u3057\u3001\u65e2\u5b58\u306e\u30e1\u30c8\u30ea\u30af\u30b9\u3092\u4f7f\u7528\u3057\u3066",(0,n.jsx)(s.strong,{children:"\u7d71\u8a08"})," \u3092 ",(0,n.jsx)(s.strong,{children:"p99"})," \u306b\u8a2d\u5b9a\u3057\u307e\u3059\u3002p \u306e\u5f8c\u306e\u5024\u3092\u5e0c\u671b\u306e\u30d1\u30fc\u30bb\u30f3\u30bf\u30a4\u30eb\u306b\u7de8\u96c6\u3067\u304d\u307e\u3059\u3002\u6b21\u306b\u3001\u30d1\u30fc\u30bb\u30f3\u30bf\u30a4\u30eb\u30b0\u30e9\u30d5\u3092\u8868\u793a\u3057\u305f\u308a\u3001",(0,n.jsx)(s.a,{href:"https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch_Dashboards.html",children:"CloudWatch \u30c0\u30c3\u30b7\u30e5\u30dc\u30fc\u30c9"})," \u306b\u8ffd\u52a0\u3057\u305f\u308a\u3001\u3053\u308c\u3089\u306e\u30e1\u30c8\u30ea\u30af\u30b9\u306b\u5bfe\u3059\u308b\u30a2\u30e9\u30fc\u30e0\u3092\u8a2d\u5b9a\u3067\u304d\u307e\u3059\u3002 \u305f\u3068\u3048\u3070\u3001\u30ec\u30b9\u30dd\u30f3\u30b9\u30bf\u30a4\u30e0\u306e 95 \u30d1\u30fc\u30bb\u30f3\u30bf\u30a4\u30eb\u304c\u7279\u5b9a\u306e\u3057\u304d\u3044\u5024\u3092\u8d85\u3048\u305f\u3068\u304d\u306b\u901a\u77e5\u3059\u308b\u30a2\u30e9\u30fc\u30e0\u3092\u8a2d\u5b9a\u3067\u304d\u307e\u3059\u3002\u3053\u308c\u306f\u3001\u591a\u6570\u306e\u30e6\u30fc\u30b6\u30fc\u304c\u9045\u3044\u30ec\u30b9\u30dd\u30f3\u30b9\u30bf\u30a4\u30e0\u3092\u7d4c\u9a13\u3057\u3066\u3044\u308b\u3053\u3068\u3092\u793a\u3057\u3066\u3044\u307e\u3059\u3002"]}),"\n",(0,n.jsxs)(s.p,{children:["\u4ee5\u4e0b\u306e\u30d2\u30b9\u30c8\u30b0\u30e9\u30e0\u306f\u3001",(0,n.jsx)(s.a,{href:"https://aws.amazon.com/grafana/",children:"Amazon Managed Grafana"})," \u3067\u4f5c\u6210\u3055\u308c\u3066\u304a\u308a\u3001",(0,n.jsx)(s.a,{href:"https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/AnalyzingLogData.html",children:"CloudWath Logs Insights"})," \u304b\u3089\u306e\u30af\u30a8\u30ea\u3092\u4f7f\u7528\u3057\u3066\u3044\u307e\u3059\u3002",(0,n.jsx)(s.a,{href:"https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-RUM.html",children:"CloudWatch RUM"})," \u30ed\u30b0\u3067\u3059\u3002 \u4f7f\u7528\u3057\u305f\u30af\u30a8\u30ea\u306f\u6b21\u306e\u3068\u304a\u308a\u3067\u3059\u3002"]}),"\n",(0,n.jsx)(s.pre,{children:(0,n.jsx)(s.code,{children:'fields @timestamp, event_details.duration\n| filter event_type = "com.amazon.rum.performance_navigation_event"\n| sort @timestamp desc\n'})}),"\n",(0,n.jsx)(s.p,{children:"\u3053\u306e\u30d2\u30b9\u30c8\u30b0\u30e9\u30e0\u306f\u3001\u30da\u30fc\u30b8\u306e\u8aad\u307f\u8fbc\u307f\u6642\u9593\u3092\u30df\u30ea\u79d2\u5358\u4f4d\u3067\u30d7\u30ed\u30c3\u30c8\u3057\u3066\u3044\u307e\u3059\u3002 \u3053\u306e\u30d3\u30e5\u30fc\u3092\u4f7f\u7528\u3059\u308b\u3068\u3001\u5916\u308c\u5024\u3092\u660e\u78ba\u306b\u78ba\u8a8d\u3067\u304d\u307e\u3059\u3002 \u5e73\u5747\u3092\u4f7f\u7528\u3059\u308b\u3068\u3001\u3053\u306e\u30c7\u30fc\u30bf\u306f\u975e\u8868\u793a\u306b\u306a\u308a\u307e\u3059\u3002"}),"\n",(0,n.jsx)(s.p,{children:(0,n.jsx)(s.img,{alt:"\u30d2\u30b9\u30c8\u30b0\u30e9\u30e0",src:t(72427).A+"",width:"761",height:"400"})}),"\n",(0,n.jsx)(s.p,{children:"\u5e73\u5747\u5024\u3092\u4f7f\u7528\u3057\u3066CloudWatch\u306b\u8868\u793a\u3055\u308c\u3066\u3044\u308b\u540c\u3058\u30c7\u30fc\u30bf\u306f\u3001\u30da\u30fc\u30b8\u306e\u8aad\u307f\u8fbc\u307f\u306b2\u79d2\u672a\u6e80\u304b\u304b\u3063\u3066\u3044\u308b\u3053\u3068\u3092\u793a\u3057\u3066\u3044\u307e\u3059\u3002 \u4e0a\u8a18\u306e\u30d2\u30b9\u30c8\u30b0\u30e9\u30e0\u304b\u3089\u3001\u307b\u3068\u3093\u3069\u306e\u30da\u30fc\u30b8\u304c\u5b9f\u969b\u306b\u306f1\u79d2\u672a\u6e80\u3067\u8aad\u307f\u8fbc\u307e\u308c\u3066\u304a\u308a\u3001\u5916\u308c\u5024\u304c\u3042\u308b\u3053\u3068\u304c\u308f\u304b\u308a\u307e\u3059\u3002"}),"\n",(0,n.jsx)(s.p,{children:(0,n.jsx)(s.img,{alt:"\u30d2\u30b9\u30c8\u30b0\u30e9\u30e0",src:t(39488).A+"",width:"761",height:"322"})}),"\n",(0,n.jsx)(s.p,{children:"\u540c\u3058\u30c7\u30fc\u30bf\u3092\u518d\u3073\u30d1\u30fc\u30bb\u30f3\u30bf\u30a4\u30eb(p99)\u3067\u4f7f\u7528\u3059\u308b\u3068\u3001\u554f\u984c\u304c\u3042\u308b\u3053\u3068\u304c\u793a\u3055\u308c\u307e\u3059\u3002CloudWatch \u306e\u30b0\u30e9\u30d5\u306f\u73fe\u5728\u300199%\u306e\u30da\u30fc\u30b8\u8aad\u307f\u8fbc\u307f\u304c 23 \u79d2\u672a\u6e80\u3067\u3042\u308b\u3053\u3068\u3092\u793a\u3057\u3066\u3044\u307e\u3059\u3002"}),"\n",(0,n.jsx)(s.p,{children:(0,n.jsx)(s.img,{alt:"\u30d2\u30b9\u30c8\u30b0\u30e9\u30e0",src:t(77663).A+"",width:"761",height:"322"})}),"\n",(0,n.jsxs)(s.p,{children:["\u3053\u308c\u3092\u3088\u308a\u8996\u899a\u5316\u3057\u3084\u3059\u304f\u3059\u308b\u305f\u3081\u306b\u3001\u4ee5\u4e0b\u306e\u30b0\u30e9\u30d5\u306f\u5e73\u5747\u5024\u3068 99 \u30d1\u30fc\u30bb\u30f3\u30bf\u30a4\u30eb\u3092\u6bd4\u8f03\u3057\u3066\u3044\u307e\u3059\u3002 \u3053\u306e\u5834\u5408\u3001\u30bf\u30fc\u30b2\u30c3\u30c8\u306e\u30da\u30fc\u30b8\u8aad\u307f\u8fbc\u307f\u6642\u9593\u306f 2 \u79d2\u3067\u3042\u308a\u3001\u4ee3\u66ff\u306e ",(0,n.jsx)(s.a,{href:"https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Statistics-definitions.html#Percentile-versus-Trimmed-Mean",children:"CloudWatch \u7d71\u8a08"})," \u3068 ",(0,n.jsx)(s.a,{href:"https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/using-metric-math.html",children:"\u30e1\u30c8\u30ea\u30af\u30b9\u6570\u5b66"})," \u3092\u4f7f\u7528\u3057\u3066\u4ed6\u306e\u8a08\u7b97\u3092\u884c\u3046\u3053\u3068\u304c\u3067\u304d\u307e\u3059\u3002 \u3053\u306e\u5834\u5408\u3001\u30d1\u30fc\u30bb\u30f3\u30bf\u30a4\u30eb\u30e9\u30f3\u30af(PR) \u304c\u7d71\u8a08 ",(0,n.jsx)(s.strong,{children:"PR(:2000)"})," \u3068\u3068\u3082\u306b\u4f7f\u7528\u3055\u308c\u3066\u304a\u308a\u3001\u30da\u30fc\u30b8\u8aad\u307f\u8fbc\u307f\u306e 92.7%\u304c 2000ms \u3068\u3044\u3046\u30bf\u30fc\u30b2\u30c3\u30c8\u5185\u3067\u767a\u751f\u3057\u3066\u3044\u308b\u3053\u3068\u3092\u793a\u3057\u3066\u3044\u307e\u3059\u3002"]}),"\n",(0,n.jsx)(s.p,{children:(0,n.jsx)(s.img,{alt:"\u30d2\u30b9\u30c8\u30b0\u30e9\u30e0",src:t(50594).A+"",width:"761",height:"236"})}),"\n",(0,n.jsx)(s.p,{children:"CloudWatch \u3067\u30d1\u30fc\u30bb\u30f3\u30bf\u30a4\u30eb\u3092\u4f7f\u7528\u3059\u308b\u3053\u3068\u3067\u3001\u30b7\u30b9\u30c6\u30e0\u306e\u30d1\u30d5\u30a9\u30fc\u30de\u30f3\u30b9\u3092\u3088\u308a\u6df1\u304f\u6d1e\u5bdf\u3057\u3001\u554f\u984c\u3092\u65e9\u671f\u306b\u691c\u51fa\u3057\u3001\u305d\u3046\u3067\u306a\u3051\u308c\u3070\u96a0\u3055\u308c\u3066\u3057\u307e\u3046\u5916\u308c\u5024\u3092\u7279\u5b9a\u3059\u308b\u3053\u3068\u3067\u3001\u9867\u5ba2\u306e\u30a8\u30af\u30b9\u30da\u30ea\u30a8\u30f3\u30b9\u3092\u6539\u5584\u3067\u304d\u307e\u3059\u3002"})]})}function h(e={}){const{wrapper:s}={...(0,a.R)(),...e.components};return s?(0,n.jsx)(s,{...e,children:(0,n.jsx)(d,{...e})}):d(e)}},39488:(e,s,t)=>{t.d(s,{A:()=>n});const n=t.p+"assets/images/percentiles-average-35e9153f2b508d0f56903f0c7e1436f0.png"},50594:(e,s,t)=>{t.d(s,{A:()=>n});const n=t.p+"assets/images/percentiles-comparison-3c0ed0f80c0f70c5f216e4139530beea.png"},72427:(e,s,t)=>{t.d(s,{A:()=>n});const n=t.p+"assets/images/percentiles-histogram-ef13e939d20bbff62140a1b4e44428bf.png"},77663:(e,s,t)=>{t.d(s,{A:()=>n});const n=t.p+"assets/images/percentiles-p99-83c797016bdcb4b1fa183333e8b58b2c.png"},28453:(e,s,t)=>{t.d(s,{R:()=>o,x:()=>c});var n=t(96540);const a={},i=n.createContext(a);function o(e){const s=n.useContext(i);return n.useMemo((function(){return"function"==typeof e?e(s):{...s,...e}}),[s,e])}function c(e){let s;return s=e.disableParentContext?"function"==typeof e.components?e.components(a):e.components||a:o(e.components),n.createElement(i.Provider,{value:s},e.children)}}}]);
"use strict";(self.webpackChunkobservability_best_practices=self.webpackChunkobservability_best_practices||[]).push([[2411],{65035:(n,s,i)=>{i.r(s),i.d(s,{assets:()=>r,contentTitle:()=>a,default:()=>d,frontMatter:()=>l,metadata:()=>c,toc:()=>p});var t=i(74848),e=i(28453);const l={},a="\u30a2\u30d7\u30ea\u30b1\u30fc\u30b7\u30e7\u30f3\u30b7\u30b0\u30ca\u30eb\u3092\u4f7f\u7528\u3057\u305f APM",c={id:"patterns/apmappsignals",title:"\u30a2\u30d7\u30ea\u30b1\u30fc\u30b7\u30e7\u30f3\u30b7\u30b0\u30ca\u30eb\u3092\u4f7f\u7528\u3057\u305f APM",description:"\u73fe\u4ee3\u306e\u30a2\u30d7\u30ea\u30b1\u30fc\u30b7\u30e7\u30f3\u958b\u767a\u306e\u4e16\u754c\u3067\u306f\u3001\u6700\u9069\u306a\u30d1\u30d5\u30a9\u30fc\u30de\u30f3\u30b9\u3092\u78ba\u4fdd\u3057\u3001\u30b5\u30fc\u30d3\u30b9\u30ec\u30d9\u30eb\u76ee\u6a19\uff08SLO\uff09\u3092\u9054\u6210\u3059\u308b\u3053\u3068\u304c\u3001\u30b7\u30fc\u30e0\u30ec\u30b9\u306a\u30e6\u30fc\u30b6\u30fc\u30a8\u30af\u30b9\u30da\u30ea\u30a8\u30f3\u30b9\u3092\u63d0\u4f9b\u3057\u3001\u30d3\u30b8\u30cd\u30b9\u306e\u7d99\u7d9a\u6027\u3092\u7dad\u6301\u3059\u308b\u305f\u3081\u306b\u4e0d\u53ef\u6b20\u3067\u3059\u3002OpenTelemetry\uff08OTel\uff09\u4e92\u63db\u306e\u30a2\u30d7\u30ea\u30b1\u30fc\u30b7\u30e7\u30f3\u30d1\u30d5\u30a9\u30fc\u30de\u30f3\u30b9\u30e2\u30cb\u30bf\u30ea\u30f3\u30b0\uff08APM\uff09\u6a5f\u80fd\u3067\u3042\u308b Amazon CloudWatch Application Signals \u306f\u3001AWS \u4e0a\u3067\u5b9f\u884c\u3055\u308c\u308b\u30a2\u30d7\u30ea\u30b1\u30fc\u30b7\u30e7\u30f3\u306e\u30e2\u30cb\u30bf\u30ea\u30f3\u30b0\u3068\u30c8\u30e9\u30d6\u30eb\u30b7\u30e5\u30fc\u30c6\u30a3\u30f3\u30b0\u306e\u65b9\u6cd5\u3092\u9769\u65b0\u3057\u307e\u3059\u3002",source:"@site/i18n/ja/docusaurus-plugin-content-docs/current/patterns/apmappsignals.md",sourceDirName:"patterns",slug:"/patterns/apmappsignals",permalink:"/observability-best-practices/ja/patterns/apmappsignals",draft:!1,unlisted:!1,editUrl:"https://github.com/aws-observability/observability-best-practices/blob/main/docusaurus/docs/patterns/apmappsignals.md",tags:[],version:"current",frontMatter:{},sidebar:"patterns",previous:{title:"EKS \u304b\u3089 Prometheus \u3078\u306e\u30e1\u30c8\u30ea\u30af\u30b9\u306e\u9001\u4fe1",permalink:"/observability-best-practices/ja/patterns/ampagentless"},next:{title:"ECS \u30ef\u30fc\u30af\u30ed\u30fc\u30c9\u306e\u30e2\u30cb\u30bf\u30ea\u30f3\u30b0",permalink:"/observability-best-practices/ja/patterns/ecsampamg"}},r={},p=[];function o(n){const s={em:"em",h1:"h1",img:"img",li:"li",ol:"ol",p:"p",strong:"strong",...(0,e.R)(),...n.components};return(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)(s.h1,{id:"\u30a2\u30d7\u30ea\u30b1\u30fc\u30b7\u30e7\u30f3\u30b7\u30b0\u30ca\u30eb\u3092\u4f7f\u7528\u3057\u305f-apm",children:"\u30a2\u30d7\u30ea\u30b1\u30fc\u30b7\u30e7\u30f3\u30b7\u30b0\u30ca\u30eb\u3092\u4f7f\u7528\u3057\u305f APM"}),"\n",(0,t.jsx)(s.p,{children:"\u73fe\u4ee3\u306e\u30a2\u30d7\u30ea\u30b1\u30fc\u30b7\u30e7\u30f3\u958b\u767a\u306e\u4e16\u754c\u3067\u306f\u3001\u6700\u9069\u306a\u30d1\u30d5\u30a9\u30fc\u30de\u30f3\u30b9\u3092\u78ba\u4fdd\u3057\u3001\u30b5\u30fc\u30d3\u30b9\u30ec\u30d9\u30eb\u76ee\u6a19\uff08SLO\uff09\u3092\u9054\u6210\u3059\u308b\u3053\u3068\u304c\u3001\u30b7\u30fc\u30e0\u30ec\u30b9\u306a\u30e6\u30fc\u30b6\u30fc\u30a8\u30af\u30b9\u30da\u30ea\u30a8\u30f3\u30b9\u3092\u63d0\u4f9b\u3057\u3001\u30d3\u30b8\u30cd\u30b9\u306e\u7d99\u7d9a\u6027\u3092\u7dad\u6301\u3059\u308b\u305f\u3081\u306b\u4e0d\u53ef\u6b20\u3067\u3059\u3002OpenTelemetry\uff08OTel\uff09\u4e92\u63db\u306e\u30a2\u30d7\u30ea\u30b1\u30fc\u30b7\u30e7\u30f3\u30d1\u30d5\u30a9\u30fc\u30de\u30f3\u30b9\u30e2\u30cb\u30bf\u30ea\u30f3\u30b0\uff08APM\uff09\u6a5f\u80fd\u3067\u3042\u308b Amazon CloudWatch Application Signals \u306f\u3001AWS \u4e0a\u3067\u5b9f\u884c\u3055\u308c\u308b\u30a2\u30d7\u30ea\u30b1\u30fc\u30b7\u30e7\u30f3\u306e\u30e2\u30cb\u30bf\u30ea\u30f3\u30b0\u3068\u30c8\u30e9\u30d6\u30eb\u30b7\u30e5\u30fc\u30c6\u30a3\u30f3\u30b0\u306e\u65b9\u6cd5\u3092\u9769\u65b0\u3057\u307e\u3059\u3002"}),"\n",(0,t.jsx)(s.p,{children:"CloudWatch Application Signals \u306f\u3001\u30e1\u30c8\u30ea\u30af\u30b9\u3001\u30c8\u30ec\u30fc\u30b9\u3001\u30ed\u30b0\u3001\u5b9f\u30e6\u30fc\u30b6\u30fc\u30e2\u30cb\u30bf\u30ea\u30f3\u30b0\u3001\u5408\u6210\u30e2\u30cb\u30bf\u30ea\u30f3\u30b0\u306a\u3069\u3001\u8907\u6570\u306e\u30bd\u30fc\u30b9\u304b\u3089\u306e\u30c6\u30ec\u30e1\u30c8\u30ea\u30c7\u30fc\u30bf\u3092\u30b7\u30fc\u30e0\u30ec\u30b9\u306b\u76f8\u95a2\u3055\u305b\u308b\u3053\u3068\u3067\u3001\u30a2\u30d7\u30ea\u30b1\u30fc\u30b7\u30e7\u30f3\u30d1\u30d5\u30a9\u30fc\u30de\u30f3\u30b9\u30e2\u30cb\u30bf\u30ea\u30f3\u30b0\u306b\u5305\u62ec\u7684\u306a\u30a2\u30d7\u30ed\u30fc\u30c1\u3092\u53d6\u308a\u307e\u3059\u3002\u3053\u306e\u7d71\u5408\u3055\u308c\u305f\u30a2\u30d7\u30ed\u30fc\u30c1\u306b\u3088\u308a\u3001\u7d44\u7e54\u306f\u30a2\u30d7\u30ea\u30b1\u30fc\u30b7\u30e7\u30f3\u306e\u30d1\u30d5\u30a9\u30fc\u30de\u30f3\u30b9\u306b\u95a2\u3059\u308b\u5305\u62ec\u7684\u306a\u6d1e\u5bdf\u3092\u5f97\u3066\u3001\u554f\u984c\u306e\u6839\u672c\u539f\u56e0\u3092\u7279\u5b9a\u3057\u3001\u6f5c\u5728\u7684\u306a\u969c\u5bb3\u306b\u4e8b\u524d\u306b\u5bfe\u51e6\u3059\u308b\u3053\u3068\u304c\u3067\u304d\u307e\u3059\u3002"}),"\n",(0,t.jsx)(s.p,{children:"CloudWatch Application Signals \u306e\u4e3b\u306a\u5229\u70b9\u306e 1 \u3064\u306f\u3001\u81ea\u52d5\u8a08\u88c5\u3068\u8ffd\u8de1\u6a5f\u80fd\u3067\u3059\u3002\u624b\u52d5\u306e\u4f5c\u696d\u3084\u30ab\u30b9\u30bf\u30e0\u30b3\u30fc\u30c9\u3092\u5fc5\u8981\u3068\u305b\u305a\u3001Application Signals \u306f AWS \u4e0a\u3067\u5b9f\u884c\u3055\u308c\u308b\u5404\u30a2\u30d7\u30ea\u30b1\u30fc\u30b7\u30e7\u30f3\u306e\u30d1\u30d5\u30a9\u30fc\u30de\u30f3\u30b9\u306b\u95a2\u3059\u308b\u6700\u3082\u91cd\u8981\u306a\u30e1\u30c8\u30ea\u30af\u30b9\uff08\u91cf\u3001\u53ef\u7528\u6027\u3001\u30ec\u30a4\u30c6\u30f3\u30b7\u30fc\u3001\u969c\u5bb3\u3001\u30a8\u30e9\u30fc\uff09\u3092\u8868\u793a\u3059\u308b\u3001\u4e8b\u524d\u69cb\u7bc9\u3055\u308c\u305f\u6a19\u6e96\u5316\u3055\u308c\u305f\u30c0\u30c3\u30b7\u30e5\u30dc\u30fc\u30c9\u3092\u63d0\u4f9b\u3057\u307e\u3059\u3002\u3053\u306e\u5408\u7406\u5316\u3055\u308c\u305f\u30a2\u30d7\u30ed\u30fc\u30c1\u306b\u3088\u308a\u3001\u30ab\u30b9\u30bf\u30e0\u30c0\u30c3\u30b7\u30e5\u30dc\u30fc\u30c9\u306e\u5fc5\u8981\u6027\u304c\u306a\u304f\u306a\u308a\u3001\u30b5\u30fc\u30d3\u30b9\u30aa\u30da\u30ec\u30fc\u30bf\u30fc\u306f\u5b9a\u7fa9\u3055\u308c\u305f SLO \u306b\u5bfe\u3059\u308b\u30a2\u30d7\u30ea\u30b1\u30fc\u30b7\u30e7\u30f3\u306e\u5065\u5168\u6027\u3068\u30d1\u30d5\u30a9\u30fc\u30de\u30f3\u30b9\u3092\u8fc5\u901f\u306b\u8a55\u4fa1\u3067\u304d\u307e\u3059\u3002"}),"\n",(0,t.jsxs)(s.p,{children:[(0,t.jsx)(s.img,{alt:"APM",src:i(86662).A+"",width:"1532",height:"680"}),"\n",(0,t.jsx)(s.em,{children:"\u56f3 1\uff1a\u30e1\u30c8\u30ea\u30af\u30b9\u3001\u30ed\u30b0\u3001\u30c8\u30ec\u30fc\u30b9\u3092\u9001\u4fe1\u3059\u308b Cloudwatch Application Signals"})]}),"\n",(0,t.jsx)(s.p,{children:"CloudWatch Application Signals \u306f\u3001\u7d44\u7e54\u306b\u4ee5\u4e0b\u306e\u6a5f\u80fd\u3092\u63d0\u4f9b\u3057\u307e\u3059\uff1a"}),"\n",(0,t.jsxs)(s.ol,{children:["\n",(0,t.jsxs)(s.li,{children:["\n",(0,t.jsxs)(s.p,{children:[(0,t.jsx)(s.strong,{children:"\u5305\u62ec\u7684\u306a\u30a2\u30d7\u30ea\u30b1\u30fc\u30b7\u30e7\u30f3\u30d1\u30d5\u30a9\u30fc\u30de\u30f3\u30b9\u30e2\u30cb\u30bf\u30ea\u30f3\u30b0"}),"\uff1aApplication Signals \u306f\u3001\u30e1\u30c8\u30ea\u30af\u30b9\u3001\u30c8\u30ec\u30fc\u30b9\u3001\u30ed\u30b0\u3001\u5b9f\u30e6\u30fc\u30b6\u30fc\u30e2\u30cb\u30bf\u30ea\u30f3\u30b0\u3001\u5408\u6210\u30e2\u30cb\u30bf\u30ea\u30f3\u30b0\u304b\u3089\u306e\u6d1e\u5bdf\u3092\u7d44\u307f\u5408\u308f\u305b\u3066\u3001\u30a2\u30d7\u30ea\u30b1\u30fc\u30b7\u30e7\u30f3\u30d1\u30d5\u30a9\u30fc\u30de\u30f3\u30b9\u306e\u7d71\u5408\u30d3\u30e5\u30fc\u3092\u63d0\u4f9b\u3057\u307e\u3059\u3002\u3053\u306e\u5305\u62ec\u7684\u306a\u30a2\u30d7\u30ed\u30fc\u30c1\u306b\u3088\u308a\u3001\u7d44\u7e54\u306f\u30d1\u30d5\u30a9\u30fc\u30de\u30f3\u30b9\u306e\u30dc\u30c8\u30eb\u30cd\u30c3\u30af\u3092\u7279\u5b9a\u3057\u3001\u6839\u672c\u539f\u56e0\u3092\u7a81\u304d\u6b62\u3081\u3001\u6700\u9069\u306a\u30a2\u30d7\u30ea\u30b1\u30fc\u30b7\u30e7\u30f3\u30d1\u30d5\u30a9\u30fc\u30de\u30f3\u30b9\u3092\u78ba\u4fdd\u3059\u308b\u305f\u3081\u306e\u4e8b\u524d\u5bfe\u7b56\u3092\u8b1b\u3058\u308b\u3053\u3068\u304c\u3067\u304d\u307e\u3059\u3002"]}),"\n"]}),"\n",(0,t.jsxs)(s.li,{children:["\n",(0,t.jsxs)(s.p,{children:[(0,t.jsx)(s.strong,{children:"\u81ea\u52d5\u8a08\u88c5\u3068\u8ffd\u8de1"}),"\uff1a\u624b\u52d5\u306e\u4f5c\u696d\u3084\u30ab\u30b9\u30bf\u30e0\u30b3\u30fc\u30c9\u3092\u5fc5\u8981\u3068\u305b\u305a\u3001Application Signals \u306f\u5b9a\u7fa9\u3055\u308c\u305f SLO \u306b\u5bfe\u3059\u308b\u30a2\u30d7\u30ea\u30b1\u30fc\u30b7\u30e7\u30f3\u30d1\u30d5\u30a9\u30fc\u30de\u30f3\u30b9\u3092\u81ea\u52d5\u7684\u306b\u8a08\u88c5\u3057\u8ffd\u8de1\u3057\u307e\u3059\u3002\u3053\u306e\u5408\u7406\u5316\u3055\u308c\u305f\u30a2\u30d7\u30ed\u30fc\u30c1\u306b\u3088\u308a\u3001\u624b\u52d5\u306e\u8a08\u88c5\u3068\u8a2d\u5b9a\u306b\u95a2\u9023\u3059\u308b\u30aa\u30fc\u30d0\u30fc\u30d8\u30c3\u30c9\u304c\u8efd\u6e1b\u3055\u308c\u3001\u7d44\u7e54\u306f\u30a2\u30d7\u30ea\u30b1\u30fc\u30b7\u30e7\u30f3\u306e\u958b\u767a\u3068\u6700\u9069\u5316\u306b\u96c6\u4e2d\u3067\u304d\u307e\u3059\u3002"]}),"\n"]}),"\n",(0,t.jsxs)(s.li,{children:["\n",(0,t.jsxs)(s.p,{children:[(0,t.jsx)(s.strong,{children:"\u6a19\u6e96\u5316\u3055\u308c\u305f\u30c0\u30c3\u30b7\u30e5\u30dc\u30fc\u30c9\u3068\u53ef\u8996\u5316"}),"\uff1aApplication Signals \u306f\u3001\u91cf\u3001\u53ef\u7528\u6027\u3001\u30ec\u30a4\u30c6\u30f3\u30b7\u30fc\u3001\u969c\u5bb3\u3001\u30a8\u30e9\u30fc\u306a\u3069\u3001\u30a2\u30d7\u30ea\u30b1\u30fc\u30b7\u30e7\u30f3\u30d1\u30d5\u30a9\u30fc\u30de\u30f3\u30b9\u306b\u95a2\u3059\u308b\u6700\u3082\u91cd\u8981\u306a\u30e1\u30c8\u30ea\u30af\u30b9\u3092\u8868\u793a\u3059\u308b\u3001\u4e8b\u524d\u69cb\u7bc9\u3055\u308c\u305f\u6a19\u6e96\u5316\u3055\u308c\u305f\u30c0\u30c3\u30b7\u30e5\u30dc\u30fc\u30c9\u3092\u63d0\u4f9b\u3057\u307e\u3059\u3002\u3053\u306e\u6a19\u6e96\u5316\u3055\u308c\u305f\u30d3\u30e5\u30fc\u306b\u3088\u308a\u3001\u30b5\u30fc\u30d3\u30b9\u30aa\u30da\u30ec\u30fc\u30bf\u30fc\u306f\u30a2\u30d7\u30ea\u30b1\u30fc\u30b7\u30e7\u30f3\u306e\u5065\u5168\u6027\u3068\u30d1\u30d5\u30a9\u30fc\u30de\u30f3\u30b9\u3092\u8fc5\u901f\u306b\u8a55\u4fa1\u3067\u304d\u3001\u60c5\u5831\u306b\u57fa\u3065\u3044\u305f\u610f\u601d\u6c7a\u5b9a\u3068\u4e8b\u524d\u306e\u554f\u984c\u89e3\u6c7a\u3092\u4fc3\u9032\u3057\u307e\u3059\u3002"]}),"\n"]}),"\n",(0,t.jsxs)(s.li,{children:["\n",(0,t.jsxs)(s.p,{children:[(0,t.jsx)(s.strong,{children:"\u30b7\u30fc\u30e0\u30ec\u30b9\u306a\u76f8\u95a2\u95a2\u4fc2\u3068\u30c8\u30e9\u30d6\u30eb\u30b7\u30e5\u30fc\u30c6\u30a3\u30f3\u30b0"}),"\uff1a\u8907\u6570\u306e\u30bd\u30fc\u30b9\u304b\u3089\u306e\u30c6\u30ec\u30e1\u30c8\u30ea\u30c7\u30fc\u30bf\u3092\u76f8\u95a2\u3055\u305b\u308b\u3053\u3068\u3067\u3001Application Signals \u306f\u30c8\u30e9\u30d6\u30eb\u30b7\u30e5\u30fc\u30c6\u30a3\u30f3\u30b0\u30d7\u30ed\u30bb\u30b9\u3092\u7c21\u7d20\u5316\u3057\u307e\u3059\u3002\u30b5\u30fc\u30d3\u30b9\u30aa\u30da\u30ec\u30fc\u30bf\u30fc\u306f\u3001\u76f8\u95a2\u95a2\u4fc2\u306e\u3042\u308b\u30c8\u30ec\u30fc\u30b9\u3001\u30ed\u30b0\u3001\u30e1\u30c8\u30ea\u30af\u30b9\u3092\u30b7\u30fc\u30e0\u30ec\u30b9\u306b\u30c9\u30ea\u30eb\u30c0\u30a6\u30f3\u3057\u3066\u3001\u30d1\u30d5\u30a9\u30fc\u30de\u30f3\u30b9\u306e\u554f\u984c\u3084\u7570\u5e38\u306e\u6839\u672c\u539f\u56e0\u3092\u7279\u5b9a\u3057\u3001\u5e73\u5747\u89e3\u6c7a\u6642\u9593\uff08MTTR\uff09\u3092\u77ed\u7e2e\u3057\u3001\u30a2\u30d7\u30ea\u30b1\u30fc\u30b7\u30e7\u30f3\u306e\u4e2d\u65ad\u3092\u6700\u5c0f\u9650\u306b\u6291\u3048\u308b\u3053\u3068\u304c\u3067\u304d\u307e\u3059\u3002"]}),"\n"]}),"\n",(0,t.jsxs)(s.li,{children:["\n",(0,t.jsxs)(s.p,{children:[(0,t.jsx)(s.strong,{children:"Container Insights \u3068\u306e\u7d71\u5408"}),"\uff1a\u30b3\u30f3\u30c6\u30ca\u5316\u3055\u308c\u305f\u74b0\u5883\u3067\u5b9f\u884c\u3055\u308c\u308b\u30a2\u30d7\u30ea\u30b1\u30fc\u30b7\u30e7\u30f3\u306e\u5834\u5408\u3001CloudWatch Application Signals \u306f Container Insights \u3068\u30b7\u30fc\u30e0\u30ec\u30b9\u306b\u7d71\u5408\u3055\u308c\u3001\u7d44\u7e54\u306f\u30b3\u30f3\u30c6\u30ca\u30dd\u30c3\u30c9\u306e\u30e1\u30e2\u30ea\u4e0d\u8db3\u3084\u9ad8 CPU \u4f7f\u7528\u7387\u306a\u3069\u3001\u30a2\u30d7\u30ea\u30b1\u30fc\u30b7\u30e7\u30f3\u306e\u30d1\u30d5\u30a9\u30fc\u30de\u30f3\u30b9\u306b\u5f71\u97ff\u3092\u4e0e\u3048\u308b\u53ef\u80fd\u6027\u306e\u3042\u308b\u30a4\u30f3\u30d5\u30e9\u30b9\u30c8\u30e9\u30af\u30c1\u30e3\u95a2\u9023\u306e\u554f\u984c\u3092\u7279\u5b9a\u3067\u304d\u307e\u3059\u3002"]}),"\n"]}),"\n"]}),"\n",(0,t.jsx)(s.p,{children:"\u30a2\u30d7\u30ea\u30b1\u30fc\u30b7\u30e7\u30f3\u30d1\u30d5\u30a9\u30fc\u30de\u30f3\u30b9\u30e2\u30cb\u30bf\u30ea\u30f3\u30b0\u306b CloudWatch Application Signals \u3092\u6d3b\u7528\u3059\u308b\u305f\u3081\u306b\u3001\u7d44\u7e54\u306f\u4ee5\u4e0b\u306e\u4e00\u822c\u7684\u306a\u624b\u9806\u3092\u5b9f\u884c\u3067\u304d\u307e\u3059\uff1a"}),"\n",(0,t.jsxs)(s.ol,{children:["\n",(0,t.jsxs)(s.li,{children:["\n",(0,t.jsxs)(s.p,{children:[(0,t.jsx)(s.strong,{children:"Application Signals \u306e\u6709\u52b9\u5316"}),"\uff1aAWS \u30de\u30cd\u30b8\u30e1\u30f3\u30c8\u30b3\u30f3\u30bd\u30fc\u30eb\u3001AWS \u30b3\u30de\u30f3\u30c9\u30e9\u30a4\u30f3\u30a4\u30f3\u30bf\u30fc\u30d5\u30a7\u30a4\u30b9\uff08CLI\uff09\u3001\u307e\u305f\u306f AWS SDK \u3092\u4f7f\u7528\u3057\u3066\u30d7\u30ed\u30b0\u30e9\u30e0\u3067\u3001AWS \u4e0a\u3067\u5b9f\u884c\u3055\u308c\u3066\u3044\u308b\u30a2\u30d7\u30ea\u30b1\u30fc\u30b7\u30e7\u30f3\u306e CloudWatch Application Signals \u3092\u6709\u52b9\u306b\u3057\u307e\u3059\u3002"]}),"\n"]}),"\n",(0,t.jsxs)(s.li,{children:["\n",(0,t.jsxs)(s.p,{children:[(0,t.jsx)(s.strong,{children:"\u30b5\u30fc\u30d3\u30b9\u30ec\u30d9\u30eb\u76ee\u6a19\uff08SLO\uff09\u306e\u5b9a\u7fa9"}),"\uff1a\u30d3\u30b8\u30cd\u30b9\u8981\u4ef6\u3068\u9867\u5ba2\u306e\u671f\u5f85\u306b\u5408\u308f\u305b\u3066\u3001\u76ee\u6a19\u53ef\u7528\u6027\u3001\u6700\u5927\u30ec\u30a4\u30c6\u30f3\u30b7\u30fc\u3001\u30a8\u30e9\u30fc\u3057\u304d\u3044\u5024\u306a\u3069\u306e\u30a2\u30d7\u30ea\u30b1\u30fc\u30b7\u30e7\u30f3\u306e\u671b\u307e\u3057\u3044 SLO \u3092\u78ba\u7acb\u3057\u8a2d\u5b9a\u3057\u307e\u3059\u3002"]}),"\n"]}),"\n",(0,t.jsxs)(s.li,{children:["\n",(0,t.jsxs)(s.p,{children:[(0,t.jsx)(s.strong,{children:"\u30d1\u30d5\u30a9\u30fc\u30de\u30f3\u30b9\u306e\u30e2\u30cb\u30bf\u30ea\u30f3\u30b0\u3068\u5206\u6790"}),"\uff1aApplication Signals \u304c\u63d0\u4f9b\u3059\u308b\u4e8b\u524d\u69cb\u7bc9\u3055\u308c\u305f\u6a19\u6e96\u5316\u3055\u308c\u305f\u30c0\u30c3\u30b7\u30e5\u30dc\u30fc\u30c9\u3092\u4f7f\u7528\u3057\u3066\u3001\u5b9a\u7fa9\u3055\u308c\u305f SLO \u306b\u5bfe\u3059\u308b\u30a2\u30d7\u30ea\u30b1\u30fc\u30b7\u30e7\u30f3\u306e\u30d1\u30d5\u30a9\u30fc\u30de\u30f3\u30b9\u3092\u30e2\u30cb\u30bf\u30ea\u30f3\u30b0\u3057\u307e\u3059\u3002\u30e1\u30c8\u30ea\u30af\u30b9\u3001\u30c8\u30ec\u30fc\u30b9\u3001\u30ed\u30b0\u3001\u5b9f\u30e6\u30fc\u30b6\u30fc\u30e2\u30cb\u30bf\u30ea\u30f3\u30b0\u3001\u5408\u6210\u30e2\u30cb\u30bf\u30ea\u30f3\u30b0\u306e\u30c7\u30fc\u30bf\u3092\u5206\u6790\u3057\u3066\u3001\u30d1\u30d5\u30a9\u30fc\u30de\u30f3\u30b9\u306e\u554f\u984c\u3084\u7570\u5e38\u3092\u7279\u5b9a\u3057\u307e\u3059\u3002"]}),"\n"]}),"\n",(0,t.jsxs)(s.li,{children:["\n",(0,t.jsxs)(s.p,{children:[(0,t.jsx)(s.strong,{children:"\u554f\u984c\u306e\u30c8\u30e9\u30d6\u30eb\u30b7\u30e5\u30fc\u30c6\u30a3\u30f3\u30b0\u3068\u89e3\u6c7a"}),"\uff1aApplication Signals \u306e\u30b7\u30fc\u30e0\u30ec\u30b9\u306a\u76f8\u95a2\u6a5f\u80fd\u3092\u6d3b\u7528\u3057\u3066\u3001\u76f8\u95a2\u95a2\u4fc2\u306e\u3042\u308b\u30c8\u30ec\u30fc\u30b9\u3001\u30ed\u30b0\u3001\u30e1\u30c8\u30ea\u30af\u30b9\u3092\u30c9\u30ea\u30eb\u30c0\u30a6\u30f3\u3057\u3001\u30d1\u30d5\u30a9\u30fc\u30de\u30f3\u30b9\u306e\u554f\u984c\u3084\u6839\u672c\u539f\u56e0\u306e\u8fc5\u901f\u306a\u7279\u5b9a\u3068\u89e3\u6c7a\u3092\u53ef\u80fd\u306b\u3057\u307e\u3059\u3002"]}),"\n"]}),"\n",(0,t.jsxs)(s.li,{children:["\n",(0,t.jsxs)(s.p,{children:[(0,t.jsx)(s.strong,{children:"Container Insights \u3068\u306e\u7d71\u5408\uff08\u8a72\u5f53\u3059\u308b\u5834\u5408\uff09"}),"\uff1a\u30b3\u30f3\u30c6\u30ca\u5316\u3055\u308c\u305f\u30a2\u30d7\u30ea\u30b1\u30fc\u30b7\u30e7\u30f3\u306e\u5834\u5408\u3001CloudWatch Application Signals \u3092 Container Insights \u3068\u7d71\u5408\u3057\u3066\u3001\u30a2\u30d7\u30ea\u30b1\u30fc\u30b7\u30e7\u30f3\u306e\u30d1\u30d5\u30a9\u30fc\u30de\u30f3\u30b9\u306b\u5f71\u97ff\u3092\u4e0e\u3048\u308b\u53ef\u80fd\u6027\u306e\u3042\u308b\u30a4\u30f3\u30d5\u30e9\u30b9\u30c8\u30e9\u30af\u30c1\u30e3\u95a2\u9023\u306e\u554f\u984c\u3092\u7279\u5b9a\u3057\u307e\u3059\u3002"]}),"\n"]}),"\n"]}),"\n",(0,t.jsx)(s.p,{children:"CloudWatch Application Signals \u306f\u5f37\u529b\u306a\u30a2\u30d7\u30ea\u30b1\u30fc\u30b7\u30e7\u30f3\u30d1\u30d5\u30a9\u30fc\u30de\u30f3\u30b9\u30e2\u30cb\u30bf\u30ea\u30f3\u30b0\u6a5f\u80fd\u3092\u63d0\u4f9b\u3057\u307e\u3059\u304c\u3001\u30c7\u30fc\u30bf\u91cf\u3068\u30b3\u30b9\u30c8\u7ba1\u7406\u306a\u3069\u306e\u6f5c\u5728\u7684\u306a\u8ab2\u984c\u3092\u8003\u616e\u3059\u308b\u3053\u3068\u304c\u91cd\u8981\u3067\u3059\u3002\u30a2\u30d7\u30ea\u30b1\u30fc\u30b7\u30e7\u30f3\u306e\u8907\u96d1\u3055\u3068\u898f\u6a21\u304c\u5897\u5927\u3059\u308b\u306b\u3064\u308c\u3066\u3001\u751f\u6210\u3055\u308c\u308b\u30c6\u30ec\u30e1\u30c8\u30ea\u30c7\u30fc\u30bf\u306e\u91cf\u304c\u5927\u5e45\u306b\u5897\u52a0\u3057\u3001\u30d1\u30d5\u30a9\u30fc\u30de\u30f3\u30b9\u306b\u5f71\u97ff\u3092\u4e0e\u3048\u3001\u8ffd\u52a0\u30b3\u30b9\u30c8\u304c\u767a\u751f\u3059\u308b\u53ef\u80fd\u6027\u304c\u3042\u308a\u307e\u3059\u3002\u52b9\u7387\u7684\u3067\u30b3\u30b9\u30c8\u52b9\u679c\u306e\u9ad8\u3044\u30e2\u30cb\u30bf\u30ea\u30f3\u30b0\u30bd\u30ea\u30e5\u30fc\u30b7\u30e7\u30f3\u3092\u78ba\u4fdd\u3059\u308b\u305f\u3081\u306b\u3001\u30c7\u30fc\u30bf\u30b5\u30f3\u30d7\u30ea\u30f3\u30b0\u6226\u7565\u3001\u4fdd\u6301\u30dd\u30ea\u30b7\u30fc\u3001\u30b3\u30b9\u30c8\u6700\u9069\u5316\u30c6\u30af\u30cb\u30c3\u30af\u306e\u5b9f\u88c5\u304c\u5fc5\u8981\u306b\u306a\u308b\u5834\u5408\u304c\u3042\u308a\u307e\u3059\u3002"}),"\n",(0,t.jsx)(s.p,{children:"\u3055\u3089\u306b\u3001\u30a2\u30d7\u30ea\u30b1\u30fc\u30b7\u30e7\u30f3\u30d1\u30d5\u30a9\u30fc\u30de\u30f3\u30b9\u30c7\u30fc\u30bf\u306e\u9069\u5207\u306a\u30a2\u30af\u30bb\u30b9\u5236\u5fa1\u3068\u30c7\u30fc\u30bf\u30bb\u30ad\u30e5\u30ea\u30c6\u30a3\u3092\u78ba\u4fdd\u3059\u308b\u3053\u3068\u304c\u91cd\u8981\u3067\u3059\u3002CloudWatch Application Signals \u306f\u3001\u304d\u3081\u7d30\u304b\u306a\u30a2\u30af\u30bb\u30b9\u5236\u5fa1\u306b AWS Identity and Access Management\uff08IAM\uff09\u3092\u6d3b\u7528\u3057\u3001\u4fdd\u5b58\u4e2d\u304a\u3088\u3073\u8ee2\u9001\u4e2d\u306e\u30c6\u30ec\u30e1\u30c8\u30ea\u30c7\u30fc\u30bf\u306b\u5bfe\u3057\u3066\u30c7\u30fc\u30bf\u6697\u53f7\u5316\u3092\u9069\u7528\u3057\u3001\u30a2\u30d7\u30ea\u30b1\u30fc\u30b7\u30e7\u30f3\u30d1\u30d5\u30a9\u30fc\u30de\u30f3\u30b9\u30c7\u30fc\u30bf\u306e\u6a5f\u5bc6\u6027\u3068\u6574\u5408\u6027\u3092\u4fdd\u8b77\u3057\u307e\u3059\u3002"}),"\n",(0,t.jsx)(s.p,{children:"\u7d50\u8ad6\u3068\u3057\u3066\u3001CloudWatch Application Signals \u306f AWS \u4e0a\u3067\u5b9f\u884c\u3055\u308c\u308b\u30a2\u30d7\u30ea\u30b1\u30fc\u30b7\u30e7\u30f3\u306e\u30d1\u30d5\u30a9\u30fc\u30de\u30f3\u30b9\u30e2\u30cb\u30bf\u30ea\u30f3\u30b0\u3092\u9769\u65b0\u3057\u307e\u3059\u3002\u81ea\u52d5\u8a08\u88c5\u3001\u6a19\u6e96\u5316\u3055\u308c\u305f\u30c0\u30c3\u30b7\u30e5\u30dc\u30fc\u30c9\u3001\u30c6\u30ec\u30e1\u30c8\u30ea\u30c7\u30fc\u30bf\u306e\u30b7\u30fc\u30e0\u30ec\u30b9\u306a\u76f8\u95a2\u95a2\u4fc2\u3092\u63d0\u4f9b\u3059\u308b\u3053\u3068\u3067\u3001Application Signals \u306f\u7d44\u7e54\u304c\u30a2\u30d7\u30ea\u30b1\u30fc\u30b7\u30e7\u30f3\u30d1\u30d5\u30a9\u30fc\u30de\u30f3\u30b9\u3092\u4e8b\u524d\u306b\u30e2\u30cb\u30bf\u30ea\u30f3\u30b0\u3057\u3001SLO \u306e\u9075\u5b88\u3092\u78ba\u4fdd\u3057\u3001\u30d1\u30d5\u30a9\u30fc\u30de\u30f3\u30b9\u306e\u554f\u984c\u3092\u8fc5\u901f\u306b\u30c8\u30e9\u30d6\u30eb\u30b7\u30e5\u30fc\u30c6\u30a3\u30f3\u30b0\u3057\u3066\u89e3\u6c7a\u3059\u308b\u3053\u3068\u3092\u53ef\u80fd\u306b\u3057\u307e\u3059\u3002\u305d\u306e\u7d71\u5408\u6a5f\u80fd\u3068 OpenTelemetry \u3068\u306e\u4e92\u63db\u6027\u306b\u3088\u308a\u3001CloudWatch Application Signals \u306f\u30af\u30e9\u30a6\u30c9\u306b\u304a\u3051\u308b\u30a2\u30d7\u30ea\u30b1\u30fc\u30b7\u30e7\u30f3\u30d1\u30d5\u30a9\u30fc\u30de\u30f3\u30b9\u30e2\u30cb\u30bf\u30ea\u30f3\u30b0\u306e\u5305\u62ec\u7684\u3067\u5c06\u6765\u6027\u306e\u3042\u308b\u30bd\u30ea\u30e5\u30fc\u30b7\u30e7\u30f3\u3092\u63d0\u4f9b\u3057\u307e\u3059\u3002"})]})}function d(n={}){const{wrapper:s}={...(0,e.R)(),...n.components};return s?(0,t.jsx)(s,{...n,children:(0,t.jsx)(o,{...n})}):o(n)}},86662:(n,s,i)=>{i.d(s,{A:()=>t});const t=i.p+"assets/images/apm-6222651f42edc855adc75e921b38930d.png"},28453:(n,s,i)=>{i.d(s,{R:()=>a,x:()=>c});var t=i(96540);const e={},l=t.createContext(e);function a(n){const s=t.useContext(l);return t.useMemo((function(){return"function"==typeof n?n(s):{...s,...n}}),[s,n])}function c(n){let s;return s=n.disableParentContext?"function"==typeof n.components?n.components(e):n.components||e:a(n.components),t.createElement(l.Provider,{value:s},n.children)}}}]);
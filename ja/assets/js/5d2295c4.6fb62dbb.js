"use strict";(self.webpackChunkobservability_best_practices=self.webpackChunkobservability_best_practices||[]).push([[767],{53740:(n,e,s)=>{s.r(e),s.d(e,{assets:()=>c,contentTitle:()=>l,default:()=>h,frontMatter:()=>t,metadata:()=>o,toc:()=>a});var i=s(74848),r=s(28453);const t={},l="\u306a\u305c\u30aa\u30d6\u30b6\u30fc\u30d0\u30d3\u30ea\u30c6\u30a3\u3092\u884c\u3046\u3079\u304d\u306a\u306e\u304b\uff1f",o={id:"guides/operational/business/monitoring-for-business-outcomes",title:"\u306a\u305c\u30aa\u30d6\u30b6\u30fc\u30d0\u30d3\u30ea\u30c6\u30a3\u3092\u884c\u3046\u3079\u304d\u306a\u306e\u304b\uff1f",description:"YouTube \u306e \u30aa\u30d6\u30b6\u30fc\u30d0\u30d3\u30ea\u30c6\u30a3\u6226\u7565\u306e\u958b\u767a \u3092\u3054\u89a7\u304f\u3060\u3055\u3044",source:"@site/i18n/ja/docusaurus-plugin-content-docs/current/guides/operational/business/monitoring-for-business-outcomes.md",sourceDirName:"guides/operational/business",slug:"/guides/operational/business/monitoring-for-business-outcomes",permalink:"/observability-best-practices/ja/guides/operational/business/monitoring-for-business-outcomes",draft:!1,unlisted:!1,editUrl:"https://github.com/aws-observability/observability-best-practices/blob/main/docusaurus/docs/guides/operational/business/monitoring-for-business-outcomes.md",tags:[],version:"current",frontMatter:{},sidebar:"guides",previous:{title:"Java Spring Integration \u30a2\u30d7\u30ea\u30b1\u30fc\u30b7\u30e7\u30f3\u306e\u8a08\u88c5",permalink:"/observability-best-practices/ja/guides/operational/adot-at-scale/adot-java-spring/"},next:{title:"\u30d1\u30fc\u30bb\u30f3\u30bf\u30a4\u30eb\u306e\u91cd\u8981\u6027",permalink:"/observability-best-practices/ja/guides/operational/business/sla-percentile"}},c={},a=[{value:"\u672c\u5f53\u306b\u91cd\u8981\u306a\u3053\u3068\u306f\u4f55\u304b\uff1f",id:"\u672c\u5f53\u306b\u91cd\u8981\u306a\u3053\u3068\u306f\u4f55\u304b",level:2},{value:"\u3069\u3053\u304b\u3089\u59cb\u3081\u308c\u3070\u3088\u3044\u3067\u3059\u304b\uff1f",id:"\u3069\u3053\u304b\u3089\u59cb\u3081\u308c\u3070\u3088\u3044\u3067\u3059\u304b",level:2},{value:"Working Backwards",id:"working-backwards",level:2},{value:"\u89b3\u5bdf\u3059\u3079\u304d\u3053\u3068",id:"\u89b3\u5bdf\u3059\u3079\u304d\u3053\u3068",level:2},{value:"\u7d50\u8ad6",id:"\u7d50\u8ad6",level:2}];function d(n){const e={a:"a",blockquote:"blockquote",br:"br",h1:"h1",h2:"h2",li:"li",p:"p",strong:"strong",ul:"ul",...(0,r.R)(),...n.components};return(0,i.jsxs)(i.Fragment,{children:[(0,i.jsx)(e.h1,{id:"\u306a\u305c\u30aa\u30d6\u30b6\u30fc\u30d0\u30d3\u30ea\u30c6\u30a3\u3092\u884c\u3046\u3079\u304d\u306a\u306e\u304b",children:"\u306a\u305c\u30aa\u30d6\u30b6\u30fc\u30d0\u30d3\u30ea\u30c6\u30a3\u3092\u884c\u3046\u3079\u304d\u306a\u306e\u304b\uff1f"}),"\n",(0,i.jsxs)(e.p,{children:["YouTube \u306e ",(0,i.jsx)(e.a,{href:"https://www.youtube.com/watch?v=Ub3ATriFapQ",children:"\u30aa\u30d6\u30b6\u30fc\u30d0\u30d3\u30ea\u30c6\u30a3\u6226\u7565\u306e\u958b\u767a"})," \u3092\u3054\u89a7\u304f\u3060\u3055\u3044"]}),"\n",(0,i.jsx)(e.h2,{id:"\u672c\u5f53\u306b\u91cd\u8981\u306a\u3053\u3068\u306f\u4f55\u304b",children:"\u672c\u5f53\u306b\u91cd\u8981\u306a\u3053\u3068\u306f\u4f55\u304b\uff1f"}),"\n",(0,i.jsx)(e.p,{children:"\u4ed5\u4e8b\u3067\u884c\u3046\u3059\u3079\u3066\u306e\u3053\u3068\u306f\u3001\u7d44\u7e54\u306e\u30df\u30c3\u30b7\u30e7\u30f3\u306b\u6cbf\u3063\u305f\u3082\u306e\u3067\u3042\u308b\u3079\u304d\u3067\u3059\u3002\u96c7\u7528\u3055\u308c\u3066\u3044\u308b\u79c1\u305f\u3061\u5168\u54e1\u306f\u3001\u7d44\u7e54\u306e\u30df\u30c3\u30b7\u30e7\u30f3\u3092\u679c\u305f\u3057\u3001\u305d\u306e\u30d3\u30b8\u30e7\u30f3\u306b\u5411\u304b\u3063\u3066\u50cd\u3044\u3066\u3044\u307e\u3059\u3002\u30a2\u30de\u30be\u30f3\u3067\u306f\u3001\u79c1\u305f\u3061\u306e\u30df\u30c3\u30b7\u30e7\u30f3\u306f\u6b21\u306e\u3088\u3046\u306b\u8ff0\u3079\u3066\u3044\u307e\u3059\uff1a"}),"\n",(0,i.jsxs)(e.blockquote,{children:["\n",(0,i.jsx)(e.p,{children:"\u30a2\u30de\u30be\u30f3\u306f\u3001\u5730\u7403\u4e0a\u3067\u6700\u3082\u9867\u5ba2\u4e2d\u5fc3\u7684\u306a\u4f01\u696d\u3001\u6700\u9ad8\u306e\u96c7\u7528\u4e3b\u3001\u305d\u3057\u3066\u6700\u3082\u5b89\u5168\u306a\u8077\u5834\u3067\u3042\u308b\u3053\u3068\u3092\u76ee\u6307\u3057\u3066\u3044\u307e\u3059\u3002"}),"\n"]}),"\n",(0,i.jsxs)(e.p,{children:["\u2014 ",(0,i.jsx)(e.a,{href:"https://www.aboutamazon.com/about-us",children:"About Amazon"})]}),"\n",(0,i.jsx)(e.p,{children:"IT \u306b\u304a\u3044\u3066\u3001\u3059\u3079\u3066\u306e\u30d7\u30ed\u30b8\u30a7\u30af\u30c8\u3001\u30c7\u30d7\u30ed\u30a4\u30e1\u30f3\u30c8\u3001\u30bb\u30ad\u30e5\u30ea\u30c6\u30a3\u5bfe\u7b56\u3001\u6700\u9069\u5316\u306f\u3001\u30d3\u30b8\u30cd\u30b9\u6210\u679c\u306b\u5411\u3051\u3066\u6a5f\u80fd\u3059\u3079\u304d\u3067\u3059\u3002\u5f53\u305f\u308a\u524d\u306e\u3088\u3046\u306b\u601d\u3048\u307e\u3059\u304c\u3001\u30d3\u30b8\u30cd\u30b9\u306b\u4fa1\u5024\u3092\u52a0\u3048\u306a\u3044\u3053\u3068\u306f\u4f55\u3082\u3059\u3079\u304d\u3067\u306f\u3042\u308a\u307e\u305b\u3093\u3002ITIL \u304c\u8ff0\u3079\u3066\u3044\u308b\u3088\u3046\u306b\uff1a"}),"\n",(0,i.jsxs)(e.blockquote,{children:["\n",(0,i.jsx)(e.p,{children:"\u3059\u3079\u3066\u306e\u5909\u66f4\u306f\u30d3\u30b8\u30cd\u30b9\u4fa1\u5024\u3092\u63d0\u4f9b\u3059\u3079\u304d\u3067\u3059\u3002"}),"\n"]}),"\n",(0,i.jsxs)(e.p,{children:["\u2014 ITIL \u30b5\u30fc\u30d3\u30b9\u30c8\u30e9\u30f3\u30b8\u30b7\u30e7\u30f3\u3001AXELOS\u30012011\u5e74\u300144\u30da\u30fc\u30b8\u3002",(0,i.jsx)(e.br,{}),"\n","\u2014 ",(0,i.jsx)(e.a,{href:"https://docs.aws.amazon.com/whitepapers/latest/change-management-in-the-cloud/change-management-in-the-cloud.html",children:"Change Management in the Cloud AWS \u30db\u30ef\u30a4\u30c8\u30da\u30fc\u30d1\u30fc"})," \u3092\u53c2\u7167"]}),"\n",(0,i.jsx)(e.p,{children:"\u30df\u30c3\u30b7\u30e7\u30f3\u3068\u30d3\u30b8\u30cd\u30b9\u4fa1\u5024\u304c\u91cd\u8981\u306a\u306e\u306f\u3001\u305d\u308c\u3089\u304c\u3042\u306a\u305f\u306e\u884c\u3046\u3059\u3079\u3066\u306e\u3053\u3068\u306b\u60c5\u5831\u3092\u4e0e\u3048\u308b\u3079\u304d\u3060\u304b\u3089\u3067\u3059\u3002\u30aa\u30d6\u30b6\u30fc\u30d0\u30d3\u30ea\u30c6\u30a3\u306b\u306f\u591a\u304f\u306e\u5229\u70b9\u304c\u3042\u308a\u307e\u3059\u3002\u3053\u308c\u3089\u306b\u306f\u4ee5\u4e0b\u304c\u542b\u307e\u308c\u307e\u3059\uff1a"}),"\n",(0,i.jsxs)(e.ul,{children:["\n",(0,i.jsx)(e.li,{children:"\u53ef\u7528\u6027\u306e\u5411\u4e0a"}),"\n",(0,i.jsx)(e.li,{children:"\u4fe1\u983c\u6027\u306e\u5411\u4e0a"}),"\n",(0,i.jsx)(e.li,{children:"\u30a2\u30d7\u30ea\u30b1\u30fc\u30b7\u30e7\u30f3\u306e\u5065\u5168\u6027\u3068\u30d1\u30d5\u30a9\u30fc\u30de\u30f3\u30b9\u306e\u7406\u89e3"}),"\n",(0,i.jsx)(e.li,{children:"\u3088\u308a\u826f\u3044\u30b3\u30e9\u30dc\u30ec\u30fc\u30b7\u30e7\u30f3"}),"\n",(0,i.jsx)(e.li,{children:"\u554f\u984c\u306e\u4e8b\u524d\u691c\u51fa"}),"\n",(0,i.jsx)(e.li,{children:"\u9867\u5ba2\u6e80\u8db3\u5ea6\u306e\u5411\u4e0a"}),"\n",(0,i.jsx)(e.li,{children:"\u5e02\u5834\u6295\u5165\u307e\u3067\u306e\u6642\u9593\u77ed\u7e2e"}),"\n",(0,i.jsx)(e.li,{children:"\u904b\u7528\u30b3\u30b9\u30c8\u306e\u524a\u6e1b"}),"\n",(0,i.jsx)(e.li,{children:"\u81ea\u52d5\u5316"}),"\n"]}),"\n",(0,i.jsx)(e.p,{children:"\u3053\u308c\u3089\u306e\u5229\u70b9\u306b\u306f\u3059\u3079\u3066\u5171\u901a\u70b9\u304c\u3042\u308a\u307e\u3059\u3002\u305d\u308c\u3089\u306f\u3059\u3079\u3066\u3001\u76f4\u63a5\u7684\u306b\u9867\u5ba2\u306b\u3001\u307e\u305f\u306f\u9593\u63a5\u7684\u306b\u7d44\u7e54\u306b\u30d3\u30b8\u30cd\u30b9\u4fa1\u5024\u3092\u63d0\u4f9b\u3057\u307e\u3059\u3002\u30aa\u30d6\u30b6\u30fc\u30d0\u30d3\u30ea\u30c6\u30a3\u306b\u3064\u3044\u3066\u8003\u3048\u308b\u969b\u306f\u3001\u30a2\u30d7\u30ea\u30b1\u30fc\u30b7\u30e7\u30f3\u304c\u30d3\u30b8\u30cd\u30b9\u4fa1\u5024\u3092\u63d0\u4f9b\u3057\u3066\u3044\u308b\u304b\u3069\u3046\u304b\u3092\u8003\u3048\u308b\u3053\u3068\u306b\u7acb\u3061\u8fd4\u308b\u3079\u304d\u3067\u3059\u3002"}),"\n",(0,i.jsx)(e.p,{children:"\u3064\u307e\u308a\u3001\u30aa\u30d6\u30b6\u30fc\u30d0\u30d3\u30ea\u30c6\u30a3\u306f\u30d3\u30b8\u30cd\u30b9\u4fa1\u5024\u306e\u63d0\u4f9b\u306b\u8ca2\u732e\u3059\u308b\u3082\u306e\u3092\u6e2c\u5b9a\u3057\u3001\u30d3\u30b8\u30cd\u30b9\u6210\u679c\u3068\u305d\u308c\u3089\u304c\u5371\u967a\u306b\u3055\u3089\u3055\u308c\u3066\u3044\u308b\u3068\u304d\u306b\u7126\u70b9\u3092\u5f53\u3066\u308b\u3079\u304d\u3067\u3059\uff1a\u9867\u5ba2\u304c\u671b\u3080\u3053\u3068\u3001\u5fc5\u8981\u3068\u3059\u308b\u3053\u3068\u306b\u3064\u3044\u3066\u8003\u3048\u308b\u5fc5\u8981\u304c\u3042\u308a\u307e\u3059\u3002"}),"\n",(0,i.jsx)(e.h2,{id:"\u3069\u3053\u304b\u3089\u59cb\u3081\u308c\u3070\u3088\u3044\u3067\u3059\u304b",children:"\u3069\u3053\u304b\u3089\u59cb\u3081\u308c\u3070\u3088\u3044\u3067\u3059\u304b\uff1f"}),"\n",(0,i.jsx)(e.p,{children:"\u91cd\u8981\u306a\u3053\u3068\u304c\u308f\u304b\u3063\u305f\u3089\u3001\u6b21\u306b\u4f55\u3092\u6e2c\u5b9a\u3059\u308b\u5fc5\u8981\u304c\u3042\u308b\u304b\u3092\u8003\u3048\u308b\u5fc5\u8981\u304c\u3042\u308a\u307e\u3059\u3002Amazon \u3067\u306f\u3001\u9867\u5ba2\u304b\u3089\u59cb\u3081\u3066\u3001\u5f7c\u3089\u306e\u30cb\u30fc\u30ba\u304b\u3089\u9006\u7b97\u3057\u3066\u8003\u3048\u307e\u3059\uff1a"}),"\n",(0,i.jsxs)(e.blockquote,{children:["\n",(0,i.jsx)(e.p,{children:"\u79c1\u305f\u3061\u306f\u3001\u30b5\u30fc\u30d3\u30b9\u3092\u6539\u5584\u3057\u3001\u5229\u70b9\u3084\u6a5f\u80fd\u3092\u8ffd\u52a0\u3059\u308b\u3088\u3046\u5185\u90e8\u304b\u3089\u99c6\u308a\u7acb\u3066\u3089\u308c\u3066\u3044\u307e\u3059\u3002\u305d\u308c\u3082\u3001\u305d\u3046\u3057\u306a\u3051\u308c\u3070\u306a\u3089\u306a\u3044\u524d\u306b\u3002\u79c1\u305f\u3061\u306f\u3001\u305d\u3046\u3057\u306a\u3051\u308c\u3070\u306a\u3089\u306a\u3044\u524d\u306b\u3001\u9867\u5ba2\u306e\u305f\u3081\u306b\u4fa1\u683c\u3092\u4e0b\u3052\u3001\u4fa1\u5024\u3092\u9ad8\u3081\u307e\u3059\u3002\u79c1\u305f\u3061\u306f\u3001\u305d\u3046\u3057\u306a\u3051\u308c\u3070\u306a\u3089\u306a\u3044\u524d\u306b\u767a\u660e\u3057\u307e\u3059\u3002"}),"\n"]}),"\n",(0,i.jsxs)(e.p,{children:["\u2014 \u30b8\u30a7\u30d5\u30fb\u30d9\u30be\u30b9\u3001",(0,i.jsx)(e.a,{href:"https://s2.q4cdn.com/299287126/files/doc_financials/annual/2012-Shareholder-Letter.pdf",children:"2012\u5e74\u682a\u4e3b\u30ec\u30bf\u30fc"})]}),"\n",(0,i.jsx)(e.p,{children:"\u7c21\u5358\u306a\u4f8b\u3068\u3057\u3066\u3001e\u30b3\u30de\u30fc\u30b9\u30b5\u30a4\u30c8\u3092\u4f7f\u3063\u3066\u307f\u307e\u3057\u3087\u3046\u3002\u307e\u305a\u3001\u30aa\u30f3\u30e9\u30a4\u30f3\u3067\u5546\u54c1\u3092\u8cfc\u5165\u3059\u308b\u969b\u306b\u9867\u5ba2\u3068\u3057\u3066\u4f55\u3092\u6c42\u3081\u308b\u304b\u3092\u8003\u3048\u3066\u307f\u3066\u304f\u3060\u3055\u3044\u3002\u8ab0\u3082\u304c\u540c\u3058\u3067\u306f\u306a\u3044\u304b\u3082\u3057\u308c\u307e\u305b\u3093\u304c\u3001\u304a\u305d\u3089\u304f\u4ee5\u4e0b\u306e\u3088\u3046\u306a\u3053\u3068\u3092\u6c17\u306b\u3059\u308b\u3067\u3057\u3087\u3046\uff1a"}),"\n",(0,i.jsxs)(e.ul,{children:["\n",(0,i.jsx)(e.li,{children:"\u914d\u9001"}),"\n",(0,i.jsx)(e.li,{children:"\u4fa1\u683c"}),"\n",(0,i.jsx)(e.li,{children:"\u30bb\u30ad\u30e5\u30ea\u30c6\u30a3"}),"\n",(0,i.jsx)(e.li,{children:"\u30da\u30fc\u30b8\u901f\u5ea6"}),"\n",(0,i.jsx)(e.li,{children:"\u691c\u7d22\uff08\u63a2\u3057\u3066\u3044\u308b\u5546\u54c1\u3092\u898b\u3064\u3051\u3089\u308c\u308b\u304b\uff1f\uff09"}),"\n"]}),"\n",(0,i.jsx)(e.p,{children:"\u9867\u5ba2\u304c\u6c17\u306b\u3059\u308b\u3053\u3068\u304c\u308f\u304b\u3063\u305f\u3089\u3001\u305d\u308c\u3089\u3092\u6e2c\u5b9a\u3057\u3001\u30d3\u30b8\u30cd\u30b9\u306e\u6210\u679c\u306b\u3069\u306e\u3088\u3046\u306b\u5f71\u97ff\u3059\u308b\u304b\u3092\u6e2c\u5b9a\u3057\u59cb\u3081\u308b\u3053\u3068\u304c\u3067\u304d\u307e\u3059\u3002\u30da\u30fc\u30b8\u901f\u5ea6\u306f\u3001\u30b3\u30f3\u30d0\u30fc\u30b8\u30e7\u30f3\u7387\u3068\u691c\u7d22\u30a8\u30f3\u30b8\u30f3\u30e9\u30f3\u30ad\u30f3\u30b0\u306b\u76f4\u63a5\u5f71\u97ff\u3057\u307e\u3059\u30022017\u5e74\u306e\u8abf\u67fb\u3067\u306f\u3001\u30e2\u30d0\u30a4\u30eb\u30e6\u30fc\u30b6\u30fc\u306e\u534a\u6570\u4ee5\u4e0a\uff0853\uff05\uff09\u304c\u3001\u30da\u30fc\u30b8\u306e\u8aad\u307f\u8fbc\u307f\u306b3\u79d2\u4ee5\u4e0a\u304b\u304b\u308b\u3068\u96e2\u8131\u3059\u308b\u3053\u3068\u304c\u793a\u3055\u308c\u3066\u3044\u307e\u3059\u3002\u3082\u3061\u308d\u3093\u3001\u30da\u30fc\u30b8\u901f\u5ea6\u306e\u91cd\u8981\u6027\u3092\u793a\u3059\u591a\u304f\u306e\u7814\u7a76\u304c\u3042\u308a\u3001\u305d\u308c\u306f\u660e\u3089\u304b\u306b\u6e2c\u5b9a\u3059\u3079\u304d\u6307\u6a19\u3067\u3059\u304c\u3001\u6e2c\u5b9a\u3057\u3066\u884c\u52d5\u3092\u8d77\u3053\u3059\u5fc5\u8981\u304c\u3042\u308a\u307e\u3059\u3002\u306a\u305c\u306a\u3089\u3001\u305d\u308c\u306f\u30b3\u30f3\u30d0\u30fc\u30b8\u30e7\u30f3\u306b\u6e2c\u5b9a\u53ef\u80fd\u306a\u5f71\u97ff\u3092\u4e0e\u3048\u3001\u305d\u306e\u30c7\u30fc\u30bf\u3092\u4f7f\u3063\u3066\u6539\u5584\u3092\u884c\u3046\u3053\u3068\u304c\u3067\u304d\u308b\u304b\u3089\u3067\u3059\u3002"}),"\n",(0,i.jsx)(e.h2,{id:"working-backwards",children:"Working Backwards"}),"\n",(0,i.jsx)(e.p,{children:"\u304a\u5ba2\u69d8\u304c\u6c17\u306b\u3057\u3066\u3044\u308b\u3053\u3068\u3092\u3059\u3079\u3066\u77e5\u3063\u3066\u3044\u308b\u3068\u306f\u9650\u308a\u307e\u305b\u3093\u3002\u3053\u308c\u3092\u8aad\u3093\u3067\u3044\u308b\u65b9\u306f\u3001\u304a\u305d\u3089\u304f\u6280\u8853\u7684\u306a\u5f79\u5272\u3092\u62c5\u3063\u3066\u3044\u308b\u3067\u3057\u3087\u3046\u3002\u7d44\u7e54\u5185\u306e\u30b9\u30c6\u30fc\u30af\u30db\u30eb\u30c0\u30fc\u3068\u8a71\u3092\u3059\u308b\u5fc5\u8981\u304c\u3042\u308a\u307e\u3059\u304c\u3001\u3053\u308c\u306f\u5fc5\u305a\u3057\u3082\u7c21\u5358\u3067\u306f\u3042\u308a\u307e\u305b\u3093\u3002\u3057\u304b\u3057\u3001\u91cd\u8981\u306a\u3053\u3068\u3092\u6e2c\u5b9a\u3057\u3066\u3044\u308b\u3053\u3068\u3092\u78ba\u8a8d\u3059\u308b\u305f\u3081\u306b\u306f\u4e0d\u53ef\u6b20\u3067\u3059\u3002"}),"\n",(0,i.jsxs)(e.p,{children:["e \u30b3\u30de\u30fc\u30b9\u306e\u4f8b\u3092\u7d9a\u3051\u3066\u307f\u307e\u3057\u3087\u3046\u3002\u4eca\u56de\u306f\u691c\u7d22\u306b\u3064\u3044\u3066\u8003\u3048\u3066\u307f\u307e\u3059\u3002\u9867\u5ba2\u304c\u5546\u54c1\u3092\u8cfc\u5165\u3059\u308b\u305f\u3081\u306b\u306f\u691c\u7d22\u6a5f\u80fd\u304c\u5fc5\u8981\u3067\u3042\u308b\u3053\u3068\u306f\u660e\u767d\u304b\u3082\u3057\u308c\u307e\u305b\u3093\u3002\u3057\u304b\u3057\u3001",(0,i.jsx)(e.a,{href:"https://www.forrester.com/report/MustHave+eCommerce+Features/-/E-RES89561",children:"Forrester Research \u306e\u30ec\u30dd\u30fc\u30c8"}),"\u306b\u3088\u308b\u3068\u3001\u8a2a\u554f\u8005\u306e 43% \u304c\u5373\u5ea7\u306b\u691c\u7d22\u30dc\u30c3\u30af\u30b9\u306b\u5411\u304b\u3044\u3001\u691c\u7d22\u3092\u4f7f\u7528\u3059\u308b\u4eba\u306f\u4f7f\u7528\u3057\u306a\u3044\u4eba\u3068\u6bd4\u3079\u3066 2\u301c3 \u500d\u306e\u78ba\u7387\u3067\u8cfc\u5165\u306b\u81f3\u308b\u3053\u3068\u3092\u3054\u5b58\u77e5\u3067\u3057\u305f\u304b\uff1f \u691c\u7d22\u306f\u975e\u5e38\u306b\u91cd\u8981\u3067\u3001\u3046\u307e\u304f\u6a5f\u80fd\u3059\u308b\u5fc5\u8981\u304c\u3042\u308a\u3001\u30e2\u30cb\u30bf\u30ea\u30f3\u30b0\u304c\u5fc5\u8981\u3067\u3059\u3002\u7279\u5b9a\u306e\u691c\u7d22\u304c\u7d50\u679c\u3092\u751f\u307f\u51fa\u3057\u3066\u3044\u306a\u3044\u3053\u3068\u306b\u6c17\u3065\u304d\u3001\u5358\u7d14\u306a\u30d1\u30bf\u30fc\u30f3\u30de\u30c3\u30c1\u30f3\u30b0\u304b\u3089\u81ea\u7136\u8a00\u8a9e\u51e6\u7406\u306b\u79fb\u884c\u3059\u308b\u5fc5\u8981\u304c\u3042\u308b\u304b\u3082\u3057\u308c\u307e\u305b\u3093\u3002\u3053\u308c\u306f\u3001\u30d3\u30b8\u30cd\u30b9\u6210\u679c\u3092\u30e2\u30cb\u30bf\u30ea\u30f3\u30b0\u3057\u3001\u9867\u5ba2\u4f53\u9a13\u3092\u6539\u5584\u3059\u308b\u305f\u3081\u306b\u884c\u52d5\u3059\u308b\u4f8b\u3067\u3059\u3002"]}),"\n",(0,i.jsx)(e.p,{children:"Amazon \u3067\u306f\uff1a"}),"\n",(0,i.jsxs)(e.blockquote,{children:["\n",(0,i.jsx)(e.p,{children:"\u79c1\u305f\u3061\u306f\u3001\u9867\u5ba2\u3092\u6df1\u304f\u7406\u89e3\u3057\u3001\u5f7c\u3089\u306e\u75db\u70b9\u304b\u3089\u9006\u7b97\u3057\u3066\u3001\u5f7c\u3089\u306e\u751f\u6d3b\u306b\u610f\u5473\u306e\u3042\u308b\u30bd\u30ea\u30e5\u30fc\u30b7\u30e7\u30f3\u3092\u751f\u307f\u51fa\u3059\u30a4\u30ce\u30d9\u30fc\u30b7\u30e7\u30f3\u3092\u8fc5\u901f\u306b\u958b\u767a\u3059\u308b\u3088\u3046\u52aa\u3081\u3066\u3044\u307e\u3059\u3002"}),"\n"]}),"\n",(0,i.jsxs)(e.p,{children:["\u2014 Daniel Slater - Worldwide Lead, Culture of Innovation, AWS (",(0,i.jsx)(e.a,{href:"https://aws.amazon.com/jp/executive-insights/content/how-amazon-defines-and-operationalizes-a-day-1-culture/",children:"Elements of Amazon's Day 1 Culture"})," \u3088\u308a)"]}),"\n",(0,i.jsx)(e.p,{children:"\u79c1\u305f\u3061\u306f\u9867\u5ba2\u304b\u3089\u59cb\u3081\u3001\u5f7c\u3089\u306e\u30cb\u30fc\u30ba\u304b\u3089\u9006\u7b97\u3057\u3066\u8003\u3048\u307e\u3059\u3002\u3053\u308c\u304c\u30d3\u30b8\u30cd\u30b9\u3067\u6210\u529f\u3059\u308b\u552f\u4e00\u306e\u30a2\u30d7\u30ed\u30fc\u30c1\u3067\u306f\u3042\u308a\u307e\u305b\u3093\u304c\u3001\u30aa\u30d6\u30b6\u30fc\u30d0\u30d3\u30ea\u30c6\u30a3\u306b\u3068\u3063\u3066\u306f\u826f\u3044\u30a2\u30d7\u30ed\u30fc\u30c1\u3067\u3059\u3002\u30b9\u30c6\u30fc\u30af\u30db\u30eb\u30c0\u30fc\u3068\u5354\u529b\u3057\u3066\u9867\u5ba2\u306b\u3068\u3063\u3066\u91cd\u8981\u306a\u3053\u3068\u3092\u7406\u89e3\u3057\u3001\u305d\u3053\u304b\u3089\u9006\u7b97\u3057\u3066\u8003\u3048\u3066\u304f\u3060\u3055\u3044\u3002"}),"\n",(0,i.jsx)(e.p,{children:"\u3055\u3089\u306a\u308b\u5229\u70b9\u3068\u3057\u3066\u3001\u9867\u5ba2\u3084\u30b9\u30c6\u30fc\u30af\u30db\u30eb\u30c0\u30fc\u306b\u3068\u3063\u3066\u91cd\u8981\u306a\u30e1\u30c8\u30ea\u30af\u30b9\u3092\u53ce\u96c6\u3059\u308c\u3070\u3001\u307b\u307c\u30ea\u30a2\u30eb\u30bf\u30a4\u30e0\u306e\u30c0\u30c3\u30b7\u30e5\u30dc\u30fc\u30c9\u3067\u53ef\u8996\u5316\u3067\u304d\u3001\u300c\u30e9\u30f3\u30c7\u30a3\u30f3\u30b0\u30da\u30fc\u30b8\u306e\u8aad\u307f\u8fbc\u307f\u306b\u3069\u308c\u304f\u3089\u3044\u6642\u9593\u304c\u304b\u304b\u3063\u3066\u3044\u308b\u304b\uff1f\u300d\u3084\u300c\u30a6\u30a7\u30d6\u30b5\u30a4\u30c8\u306e\u904b\u7528\u30b3\u30b9\u30c8\u306f\u3044\u304f\u3089\u304b\uff1f\u300d\u3068\u3044\u3063\u305f\u8cea\u554f\u306b\u7b54\u3048\u308b\u305f\u3081\u306e\u30ec\u30dd\u30fc\u30c8\u4f5c\u6210\u3092\u907f\u3051\u308b\u3053\u3068\u304c\u3067\u304d\u307e\u3059\u3002\u30b9\u30c6\u30fc\u30af\u30db\u30eb\u30c0\u30fc\u3084\u7d4c\u55b6\u9663\u304c\u3053\u306e\u60c5\u5831\u3092\u30bb\u30eb\u30d5\u30b5\u30fc\u30d3\u30b9\u3067\u5165\u624b\u3067\u304d\u308b\u3088\u3046\u306b\u3059\u3079\u304d\u3067\u3059\u3002"}),"\n",(0,i.jsxs)(e.p,{children:["\u3053\u308c\u3089\u306f\u3001\u30a2\u30d7\u30ea\u30b1\u30fc\u30b7\u30e7\u30f3\u306b\u3068\u3063\u3066",(0,i.jsx)(e.strong,{children:"\u672c\u5f53\u306b\u91cd\u8981\u306a"}),"\u9ad8\u30ec\u30d9\u30eb\u306e\u30e1\u30c8\u30ea\u30af\u30b9\u3067\u3042\u308a\u3001\u307e\u305f\u554f\u984c\u304c\u3042\u308b\u3053\u3068\u3092\u793a\u3059\u6700\u826f\u306e\u6307\u6a19\u3067\u3082\u3042\u308a\u307e\u3059\u3002\u4f8b\u3048\u3070\u3001\u3042\u308b\u671f\u9593\u306b\u901a\u5e38\u671f\u5f85\u3055\u308c\u308b\u6ce8\u6587\u6570\u3088\u308a\u3082\u5c11\u306a\u3044\u3053\u3068\u3092\u793a\u3059\u30a2\u30e9\u30fc\u30c8\u306f\u3001\u304a\u305d\u3089\u304f\u9867\u5ba2\u306b\u5f71\u97ff\u3092\u4e0e\u3048\u308b\u554f\u984c\u304c\u3042\u308b\u3053\u3068\u3092\u793a\u3057\u3066\u3044\u307e\u3059\u3002\u4e00\u65b9\u3001\u30b5\u30fc\u30d0\u30fc\u306e\u30dc\u30ea\u30e5\u30fc\u30e0\u304c\u307b\u307c\u6e80\u676f\u3067\u3042\u308b\u3053\u3068\u3084\u3001\u7279\u5b9a\u306e\u30b5\u30fc\u30d3\u30b9\u3067 5xx \u30a8\u30e9\u30fc\u304c\u591a\u6570\u767a\u751f\u3057\u3066\u3044\u308b\u3053\u3068\u3092\u793a\u3059\u30a2\u30e9\u30fc\u30c8\u306f\u3001\u4fee\u6b63\u304c\u5fc5\u8981\u304b\u3082\u3057\u308c\u307e\u305b\u3093\u304c\u3001\u9867\u5ba2\u3078\u306e\u5f71\u97ff\u3092\u7406\u89e3\u3057\u3001\u305d\u308c\u306b\u5fdc\u3058\u3066\u512a\u5148\u9806\u4f4d\u3092\u3064\u3051\u308b\u5fc5\u8981\u304c\u3042\u308a\u307e\u3059\u3002\u3053\u308c\u306b\u306f\u6642\u9593\u304c\u304b\u304b\u308b\u5834\u5408\u304c\u3042\u308a\u307e\u3059\u3002"]}),"\n",(0,i.jsxs)(e.p,{children:["\u3053\u308c\u3089\u306e\u9ad8\u30ec\u30d9\u30eb\u306e\u30d3\u30b8\u30cd\u30b9\u30e1\u30c8\u30ea\u30af\u30b9\u3092\u6e2c\u5b9a\u3057\u3066\u3044\u308c\u3070\u3001\u9867\u5ba2\u306b\u5f71\u97ff\u3092\u4e0e\u3048\u308b\u554f\u984c\u3092\u7c21\u5358\u306b\u7279\u5b9a\u3067\u304d\u307e\u3059\u3002\u3053\u308c\u3089\u306e\u30e1\u30c8\u30ea\u30af\u30b9\u306f",(0,i.jsx)(e.strong,{children:"\u4f55\u304c"}),"\u8d77\u3053\u3063\u3066\u3044\u308b\u304b\u3092\u793a\u3057\u307e\u3059\u3002\u305d\u306e\u4ed6\u306e\u30e1\u30c8\u30ea\u30af\u30b9\u3084\u30c8\u30ec\u30fc\u30b7\u30f3\u30b0\u3001\u30ed\u30b0\u306a\u3069\u306e\u4ed6\u306e\u5f62\u5f0f\u306e\u30aa\u30d6\u30b6\u30fc\u30d0\u30d3\u30ea\u30c6\u30a3\u306f\u3001",(0,i.jsx)(e.strong,{children:"\u306a\u305c"}),"\u3053\u308c\u304c\u8d77\u3053\u3063\u3066\u3044\u308b\u304b\u3092\u793a\u3057\u3001\u305d\u308c\u3092\u4fee\u6b63\u307e\u305f\u306f\u6539\u5584\u3059\u308b\u305f\u3081\u306b\u4f55\u304c\u3067\u304d\u308b\u304b\u3092\u5c0e\u304d\u51fa\u3057\u307e\u3059\u3002"]}),"\n",(0,i.jsx)(e.h2,{id:"\u89b3\u5bdf\u3059\u3079\u304d\u3053\u3068",children:"\u89b3\u5bdf\u3059\u3079\u304d\u3053\u3068"}),"\n",(0,i.jsx)(e.p,{children:"\u9867\u5ba2\u306b\u3068\u3063\u3066\u91cd\u8981\u306a\u3053\u3068\u304c\u5206\u304b\u3063\u305f\u3089\u3001\u91cd\u8981\u696d\u7e3e\u8a55\u4fa1\u6307\u6a19\uff08KPI\uff09\u3092\u7279\u5b9a\u3067\u304d\u307e\u3059\u3002\u3053\u308c\u3089\u306f\u3001\u30d3\u30b8\u30cd\u30b9\u6210\u679c\u304c\u30ea\u30b9\u30af\u306b\u3055\u3089\u3055\u308c\u3066\u3044\u308b\u304b\u3069\u3046\u304b\u3092\u793a\u3059\u9ad8\u30ec\u30d9\u30eb\u306e\u6307\u6a19\u3067\u3059\u3002\u307e\u305f\u3001\u3053\u308c\u3089\u306e KPI \u306b\u5f71\u97ff\u3092\u4e0e\u3048\u308b\u53ef\u80fd\u6027\u306e\u3042\u308b\u591a\u304f\u306e\u7570\u306a\u308b\u30bd\u30fc\u30b9\u304b\u3089\u60c5\u5831\u3092\u53ce\u96c6\u3059\u308b\u5fc5\u8981\u304c\u3042\u308a\u307e\u3059\u3002\u3053\u3053\u3067\u3001KPI \u306b\u5f71\u97ff\u3092\u4e0e\u3048\u308b\u53ef\u80fd\u6027\u306e\u3042\u308b\u30e1\u30c8\u30ea\u30af\u30b9\u306b\u3064\u3044\u3066\u8003\u3048\u59cb\u3081\u308b\u5fc5\u8981\u304c\u3042\u308a\u307e\u3059\u3002\u5148\u307b\u3069\u8ff0\u3079\u305f\u3088\u3046\u306b\u30015xx \u30a8\u30e9\u30fc\u306e\u6570\u306f\u5f71\u97ff\u3092\u793a\u3059\u3082\u306e\u3067\u306f\u3042\u308a\u307e\u305b\u3093\u304c\u3001KPI \u306b\u5f71\u97ff\u3092\u4e0e\u3048\u308b\u53ef\u80fd\u6027\u304c\u3042\u308a\u307e\u3059\u3002\u30d3\u30b8\u30cd\u30b9\u6210\u679c\u306b\u5f71\u97ff\u3092\u4e0e\u3048\u308b\u3082\u306e\u304b\u3089\u3001\u30d3\u30b8\u30cd\u30b9\u6210\u679c\u306b\u5f71\u97ff\u3092\u4e0e\u3048\u308b\u53ef\u80fd\u6027\u306e\u3042\u308b\u3082\u306e\u307e\u3067\u3001\u9006\u7b97\u3057\u3066\u8003\u3048\u3066\u304f\u3060\u3055\u3044\u3002"}),"\n",(0,i.jsx)(e.p,{children:"\u53ce\u96c6\u3059\u3079\u304d\u3082\u306e\u304c\u5206\u304b\u3063\u305f\u3089\u3001KPI \u3092\u6e2c\u5b9a\u3059\u308b\u305f\u3081\u306e\u30e1\u30c8\u30ea\u30af\u30b9\u3068\u3001\u305d\u308c\u3089\u306e KPI \u306b\u5f71\u97ff\u3092\u4e0e\u3048\u308b\u53ef\u80fd\u6027\u306e\u3042\u308b\u95a2\u9023\u30e1\u30c8\u30ea\u30af\u30b9\u3092\u63d0\u4f9b\u3059\u308b\u60c5\u5831\u6e90\u3092\u7279\u5b9a\u3059\u308b\u5fc5\u8981\u304c\u3042\u308a\u307e\u3059\u3002\u3053\u308c\u304c\u89b3\u5bdf\u306e\u57fa\u790e\u3068\u306a\u308a\u307e\u3059\u3002"}),"\n",(0,i.jsx)(e.p,{children:"\u3053\u306e\u30c7\u30fc\u30bf\u306f\u3001\u30e1\u30c8\u30ea\u30af\u30b9\u3001\u30ed\u30b0\u3001\u30c8\u30ec\u30fc\u30b9\u304b\u3089\u5f97\u3089\u308c\u308b\u53ef\u80fd\u6027\u304c\u9ad8\u3044\u3067\u3059\u3002\u3053\u306e\u30c7\u30fc\u30bf\u3092\u5165\u624b\u3057\u305f\u3089\u3001\u6210\u679c\u304c\u30ea\u30b9\u30af\u306b\u3055\u3089\u3055\u308c\u305f\u3068\u304d\u306b\u30a2\u30e9\u30fc\u30c8\u3092\u51fa\u3059\u305f\u3081\u306b\u4f7f\u7528\u3067\u304d\u307e\u3059\u3002"}),"\n",(0,i.jsx)(e.p,{children:"\u305d\u306e\u5f8c\u3001\u5f71\u97ff\u3092\u8a55\u4fa1\u3057\u3001\u554f\u984c\u306e\u4fee\u6b63\u3092\u8a66\u307f\u308b\u3053\u3068\u304c\u3067\u304d\u307e\u3059\u3002\u307b\u3068\u3093\u3069\u306e\u5834\u5408\u3001\u3053\u306e\u30c7\u30fc\u30bf\u306f\u3001CPU \u3084\u30e1\u30e2\u30ea\u306a\u3069\u306e\u5358\u72ec\u306e\u6280\u8853\u7684\u306a\u30e1\u30c8\u30ea\u30af\u30b9\u3088\u308a\u3082\u5148\u306b\u554f\u984c\u3092\u793a\u3057\u3066\u304f\u308c\u307e\u3059\u3002"}),"\n",(0,i.jsx)(e.p,{children:"\u30aa\u30d6\u30b6\u30fc\u30d0\u30d3\u30ea\u30c6\u30a3\u3092\u4f7f\u7528\u3057\u3066\u3001\u30d3\u30b8\u30cd\u30b9\u6210\u679c\u306b\u5f71\u97ff\u3092\u4e0e\u3048\u308b\u554f\u984c\u3092\u53cd\u5fdc\u7684\u306b\u4fee\u6b63\u3057\u305f\u308a\u3001\u9867\u5ba2\u306e\u691c\u7d22\u4f53\u9a13\u3092\u5411\u4e0a\u3055\u305b\u308b\u306a\u3069\u3001\u30c7\u30fc\u30bf\u3092\u7a4d\u6975\u7684\u306b\u6d3b\u7528\u3057\u305f\u308a\u3059\u308b\u3053\u3068\u304c\u3067\u304d\u307e\u3059\u3002"}),"\n",(0,i.jsx)(e.h2,{id:"\u7d50\u8ad6",children:"\u7d50\u8ad6"}),"\n",(0,i.jsx)(e.p,{children:"CPU\u3001RAM\u3001\u30c7\u30a3\u30b9\u30af\u5bb9\u91cf\u3001\u305d\u306e\u4ed6\u306e\u6280\u8853\u7684\u306a\u30e1\u30c8\u30ea\u30af\u30b9\u306f\u3001\u30b9\u30b1\u30fc\u30ea\u30f3\u30b0\u3001\u30d1\u30d5\u30a9\u30fc\u30de\u30f3\u30b9\u3001\u5bb9\u91cf\u3001\u30b3\u30b9\u30c8\u306b\u3068\u3063\u3066\u91cd\u8981\u3067\u3059\u304c\u3001\u5b9f\u969b\u306b\u306f\u30a2\u30d7\u30ea\u30b1\u30fc\u30b7\u30e7\u30f3\u304c\u3069\u306e\u3088\u3046\u306b\u52d5\u4f5c\u3057\u3066\u3044\u308b\u304b\u3092\u793a\u3059\u3082\u306e\u3067\u306f\u306a\u304f\u3001\u9867\u5ba2\u4f53\u9a13\u306b\u95a2\u3059\u308b\u6d1e\u5bdf\u3082\u63d0\u4f9b\u3057\u307e\u305b\u3093\u3002"}),"\n",(0,i.jsx)(e.p,{children:"\u91cd\u8981\u306a\u306e\u306f\u304a\u5ba2\u69d8\u3067\u3042\u308a\u3001\u76e3\u8996\u3059\u3079\u304d\u306f\u304a\u5ba2\u69d8\u306e\u4f53\u9a13\u3067\u3059\u3002"}),"\n",(0,i.jsx)(e.p,{children:"\u305d\u306e\u305f\u3081\u3001\u304a\u5ba2\u69d8\u306e\u8981\u4ef6\u304b\u3089\u9006\u7b97\u3057\u3001\u30b9\u30c6\u30fc\u30af\u30db\u30eb\u30c0\u30fc\u3068\u5354\u529b\u3057\u3066\u3001\u91cd\u8981\u306a KPI \u3068\u30e1\u30c8\u30ea\u30af\u30b9\u3092\u78ba\u7acb\u3059\u308b\u5fc5\u8981\u304c\u3042\u308a\u307e\u3059\u3002"})]})}function h(n={}){const{wrapper:e}={...(0,r.R)(),...n.components};return e?(0,i.jsx)(e,{...n,children:(0,i.jsx)(d,{...n})}):d(n)}},28453:(n,e,s)=>{s.d(e,{R:()=>l,x:()=>o});var i=s(96540);const r={},t=i.createContext(r);function l(n){const e=i.useContext(t);return i.useMemo((function(){return"function"==typeof n?n(e):{...e,...n}}),[e,n])}function o(n){let e;return e=n.disableParentContext?"function"==typeof n.components?n.components(r):n.components||r:l(n.components),i.createElement(t.Provider,{value:e},n.children)}}}]);
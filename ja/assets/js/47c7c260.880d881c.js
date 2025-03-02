"use strict";(self.webpackChunkobservability_best_practices=self.webpackChunkobservability_best_practices||[]).push([[9459],{15235:(e,n,s)=>{s.r(n),s.d(n,{assets:()=>l,contentTitle:()=>c,default:()=>h,frontMatter:()=>a,metadata:()=>t,toc:()=>d});const t=JSON.parse('{"id":"tools/rum","title":"\u30ea\u30a2\u30eb\u30e6\u30fc\u30b6\u30fc\u30e2\u30cb\u30bf\u30ea\u30f3\u30b0","description":"CloudWatch RUM \u3092\u4f7f\u7528\u3059\u308b\u3068\u3001\u30ea\u30a2\u30eb\u30e6\u30fc\u30b6\u30fc\u30e2\u30cb\u30bf\u30ea\u30f3\u30b0\u3092\u5b9f\u884c\u3057\u3066\u3001\u5b9f\u969b\u306e\u30e6\u30fc\u30b6\u30fc\u30bb\u30c3\u30b7\u30e7\u30f3\u304b\u3089\u30a6\u30a7\u30d6\u30a2\u30d7\u30ea\u30b1\u30fc\u30b7\u30e7\u30f3\u306e\u30d1\u30d5\u30a9\u30fc\u30de\u30f3\u30b9\u306b\u95a2\u3059\u308b\u30af\u30e9\u30a4\u30a2\u30f3\u30c8\u5074\u306e\u30c7\u30fc\u30bf\u3092\u307b\u307c\u30ea\u30a2\u30eb\u30bf\u30a4\u30e0\u3067\u53ce\u96c6\u3057\u3001\u8868\u793a\u3059\u308b\u3053\u3068\u304c\u3067\u304d\u307e\u3059\u3002\u53ef\u8996\u5316\u304a\u3088\u3073\u5206\u6790\u3067\u304d\u308b\u30c7\u30fc\u30bf\u306b\u306f\u3001\u30da\u30fc\u30b8\u306e\u8aad\u307f\u8fbc\u307f\u6642\u9593\u3001\u30af\u30e9\u30a4\u30a2\u30f3\u30c8\u5074\u306e\u30a8\u30e9\u30fc\u3001\u30e6\u30fc\u30b6\u30fc\u306e\u884c\u52d5\u306a\u3069\u304c\u542b\u307e\u308c\u307e\u3059\u3002\u3053\u306e\u30c7\u30fc\u30bf\u3092\u8868\u793a\u3059\u308b\u969b\u3001\u3059\u3079\u3066\u3092\u96c6\u7d04\u3057\u3066\u898b\u308b\u3053\u3068\u304c\u3067\u304d\u3001\u3055\u3089\u306b\u304a\u5ba2\u69d8\u304c\u4f7f\u7528\u3057\u3066\u3044\u308b\u30d6\u30e9\u30a6\u30b6\u3084\u30c7\u30d0\u30a4\u30b9\u3054\u3068\u306e\u5185\u8a33\u3082\u78ba\u8a8d\u3067\u304d\u307e\u3059\u3002","source":"@site/i18n/ja/docusaurus-plugin-content-docs/current/tools/rum.md","sourceDirName":"tools","slug":"/tools/rum","permalink":"/observability-best-practices/ja/tools/rum","draft":false,"unlisted":false,"editUrl":"https://github.com/aws-observability/observability-best-practices/blob/main/docusaurus/docs/tools/rum.md","tags":[],"version":"current","frontMatter":{},"sidebar":"tools","previous":{"title":"\u30e1\u30c8\u30ea\u30af\u30b9","permalink":"/observability-best-practices/ja/tools/metrics"},"next":{"title":"\u5408\u6210\u30c6\u30b9\u30c8","permalink":"/observability-best-practices/ja/tools/synthetics"}}');var i=s(74848),o=s(28453);const a={},c="\u30ea\u30a2\u30eb\u30e6\u30fc\u30b6\u30fc\u30e2\u30cb\u30bf\u30ea\u30f3\u30b0",l={},d=[{value:"Web \u30af\u30e9\u30a4\u30a2\u30f3\u30c8",id:"web-\u30af\u30e9\u30a4\u30a2\u30f3\u30c8",level:2},{value:"\u30a2\u30d7\u30ea\u30b1\u30fc\u30b7\u30e7\u30f3\u306e\u8a8d\u8a3c",id:"\u30a2\u30d7\u30ea\u30b1\u30fc\u30b7\u30e7\u30f3\u306e\u8a8d\u8a3c",level:2},{value:"\u30c7\u30fc\u30bf\u4fdd\u8b77\u3068\u30d7\u30e9\u30a4\u30d0\u30b7\u30fc",id:"\u30c7\u30fc\u30bf\u4fdd\u8b77\u3068\u30d7\u30e9\u30a4\u30d0\u30b7\u30fc",level:2},{value:"\u30af\u30e9\u30a4\u30a2\u30f3\u30c8\u30b3\u30fc\u30c9\u30b9\u30cb\u30da\u30c3\u30c8",id:"\u30af\u30e9\u30a4\u30a2\u30f3\u30c8\u30b3\u30fc\u30c9\u30b9\u30cb\u30da\u30c3\u30c8",level:2},{value:"URL \u53ce\u96c6\u306e\u7121\u52b9\u5316",id:"url-\u53ce\u96c6\u306e\u7121\u52b9\u5316",level:3},{value:"\u30a2\u30af\u30c6\u30a3\u30d6\u30c8\u30ec\u30fc\u30b9\u306e\u6709\u52b9\u5316",id:"\u30a2\u30af\u30c6\u30a3\u30d6\u30c8\u30ec\u30fc\u30b9\u306e\u6709\u52b9\u5316",level:3},{value:"\u30b9\u30cb\u30da\u30c3\u30c8\u306e\u633f\u5165",id:"\u30b9\u30cb\u30da\u30c3\u30c8\u306e\u633f\u5165",level:3},{value:"\u30ab\u30b9\u30bf\u30e0\u30e1\u30bf\u30c7\u30fc\u30bf\u306e\u4f7f\u7528",id:"\u30ab\u30b9\u30bf\u30e0\u30e1\u30bf\u30c7\u30fc\u30bf\u306e\u4f7f\u7528",level:2},{value:"\u30da\u30fc\u30b8\u30b0\u30eb\u30fc\u30d7\u306e\u4f7f\u7528",id:"\u30da\u30fc\u30b8\u30b0\u30eb\u30fc\u30d7\u306e\u4f7f\u7528",level:2},{value:"\u62e1\u5f35\u30e1\u30c8\u30ea\u30af\u30b9\u306e\u4f7f\u7528",id:"\u62e1\u5f35\u30e1\u30c8\u30ea\u30af\u30b9\u306e\u4f7f\u7528",level:2}];function r(e){const n={a:"a",admonition:"admonition",code:"code",h1:"h1",h2:"h2",h3:"h3",header:"header",img:"img",li:"li",ol:"ol",p:"p",pre:"pre",section:"section",sup:"sup",ul:"ul",...(0,o.R)(),...e.components};return(0,i.jsxs)(i.Fragment,{children:[(0,i.jsx)(n.header,{children:(0,i.jsx)(n.h1,{id:"\u30ea\u30a2\u30eb\u30e6\u30fc\u30b6\u30fc\u30e2\u30cb\u30bf\u30ea\u30f3\u30b0",children:"\u30ea\u30a2\u30eb\u30e6\u30fc\u30b6\u30fc\u30e2\u30cb\u30bf\u30ea\u30f3\u30b0"})}),"\n",(0,i.jsx)(n.p,{children:"CloudWatch RUM \u3092\u4f7f\u7528\u3059\u308b\u3068\u3001\u30ea\u30a2\u30eb\u30e6\u30fc\u30b6\u30fc\u30e2\u30cb\u30bf\u30ea\u30f3\u30b0\u3092\u5b9f\u884c\u3057\u3066\u3001\u5b9f\u969b\u306e\u30e6\u30fc\u30b6\u30fc\u30bb\u30c3\u30b7\u30e7\u30f3\u304b\u3089\u30a6\u30a7\u30d6\u30a2\u30d7\u30ea\u30b1\u30fc\u30b7\u30e7\u30f3\u306e\u30d1\u30d5\u30a9\u30fc\u30de\u30f3\u30b9\u306b\u95a2\u3059\u308b\u30af\u30e9\u30a4\u30a2\u30f3\u30c8\u5074\u306e\u30c7\u30fc\u30bf\u3092\u307b\u307c\u30ea\u30a2\u30eb\u30bf\u30a4\u30e0\u3067\u53ce\u96c6\u3057\u3001\u8868\u793a\u3059\u308b\u3053\u3068\u304c\u3067\u304d\u307e\u3059\u3002\u53ef\u8996\u5316\u304a\u3088\u3073\u5206\u6790\u3067\u304d\u308b\u30c7\u30fc\u30bf\u306b\u306f\u3001\u30da\u30fc\u30b8\u306e\u8aad\u307f\u8fbc\u307f\u6642\u9593\u3001\u30af\u30e9\u30a4\u30a2\u30f3\u30c8\u5074\u306e\u30a8\u30e9\u30fc\u3001\u30e6\u30fc\u30b6\u30fc\u306e\u884c\u52d5\u306a\u3069\u304c\u542b\u307e\u308c\u307e\u3059\u3002\u3053\u306e\u30c7\u30fc\u30bf\u3092\u8868\u793a\u3059\u308b\u969b\u3001\u3059\u3079\u3066\u3092\u96c6\u7d04\u3057\u3066\u898b\u308b\u3053\u3068\u304c\u3067\u304d\u3001\u3055\u3089\u306b\u304a\u5ba2\u69d8\u304c\u4f7f\u7528\u3057\u3066\u3044\u308b\u30d6\u30e9\u30a6\u30b6\u3084\u30c7\u30d0\u30a4\u30b9\u3054\u3068\u306e\u5185\u8a33\u3082\u78ba\u8a8d\u3067\u304d\u307e\u3059\u3002"}),"\n",(0,i.jsx)(n.p,{children:(0,i.jsx)(n.img,{alt:"\u30c7\u30d0\u30a4\u30b9\u306e\u5185\u8a33\u3092\u793a\u3059 RUM \u30a2\u30d7\u30ea\u30b1\u30fc\u30b7\u30e7\u30f3\u30e2\u30cb\u30bf\u30fc\u30c0\u30c3\u30b7\u30e5\u30dc\u30fc\u30c9",src:s(25762).A+"",width:"1293",height:"785"})}),"\n",(0,i.jsx)(n.h2,{id:"web-\u30af\u30e9\u30a4\u30a2\u30f3\u30c8",children:"Web \u30af\u30e9\u30a4\u30a2\u30f3\u30c8"}),"\n",(0,i.jsxs)(n.p,{children:["CloudWatch RUM Web \u30af\u30e9\u30a4\u30a2\u30f3\u30c8\u306f\u3001Node.js \u30d0\u30fc\u30b8\u30e7\u30f3 16 \u4ee5\u4e0a\u3092\u4f7f\u7528\u3057\u3066\u958b\u767a\u304a\u3088\u3073\u30d3\u30eb\u30c9\u3055\u308c\u3066\u3044\u307e\u3059\u3002\u30b3\u30fc\u30c9\u306f GitHub \u3067",(0,i.jsx)(n.a,{href:"https://github.com/aws-observability/aws-rum-web",children:"\u516c\u958b\u3055\u308c\u3066\u3044\u307e\u3059"}),"\u3002\u3053\u306e\u30af\u30e9\u30a4\u30a2\u30f3\u30c8\u306f ",(0,i.jsx)(n.a,{href:"https://github.com/aws-observability/aws-rum-web/blob/main/docs/cdn_angular.md",children:"Angular"})," \u304a\u3088\u3073 ",(0,i.jsx)(n.a,{href:"https://github.com/aws-observability/aws-rum-web/blob/main/docs/cdn_react.md",children:"React"})," \u30a2\u30d7\u30ea\u30b1\u30fc\u30b7\u30e7\u30f3\u3067\u4f7f\u7528\u3067\u304d\u307e\u3059\u3002"]}),"\n",(0,i.jsx)(n.p,{children:"CloudWatch RUM \u306f\u3001\u30a2\u30d7\u30ea\u30b1\u30fc\u30b7\u30e7\u30f3\u306e\u8aad\u307f\u8fbc\u307f\u6642\u9593\u3001\u30d1\u30d5\u30a9\u30fc\u30de\u30f3\u30b9\u3001\u304a\u3088\u3073\u30a2\u30f3\u30ed\u30fc\u30c9\u6642\u9593\u306b\u8a8d\u8b58\u3067\u304d\u308b\u5f71\u97ff\u3092\u4e0e\u3048\u306a\u3044\u3088\u3046\u306b\u8a2d\u8a08\u3055\u308c\u3066\u3044\u307e\u3059\u3002"}),"\n",(0,i.jsx)(n.admonition,{type:"note",children:(0,i.jsx)(n.p,{children:"CloudWatch RUM \u7528\u306b\u53ce\u96c6\u3059\u308b\u30a8\u30f3\u30c9\u30e6\u30fc\u30b6\u30fc\u30c7\u30fc\u30bf\u306f 30 \u65e5\u9593\u4fdd\u6301\u3055\u308c\u3001\u305d\u306e\u5f8c\u81ea\u52d5\u7684\u306b\u524a\u9664\u3055\u308c\u307e\u3059\u3002RUM \u30a4\u30d9\u30f3\u30c8\u3092\u3088\u308a\u9577\u671f\u9593\u4fdd\u5b58\u3057\u305f\u3044\u5834\u5408\u306f\u3001\u30a2\u30d7\u30ea\u30e2\u30cb\u30bf\u30fc\u304c\u30a4\u30d9\u30f3\u30c8\u306e\u30b3\u30d4\u30fc\u3092\u30a2\u30ab\u30a6\u30f3\u30c8\u306e CloudWatch Logs \u306b\u9001\u4fe1\u3059\u308b\u3088\u3046\u306b\u9078\u629e\u3067\u304d\u307e\u3059\u3002"})}),"\n",(0,i.jsx)(n.admonition,{type:"tip",children:(0,i.jsxs)(n.p,{children:["Web \u30a2\u30d7\u30ea\u30b1\u30fc\u30b7\u30e7\u30f3\u3067\u5e83\u544a\u30d6\u30ed\u30c3\u30ab\u30fc\u306b\u3088\u308b\u6f5c\u5728\u7684\u306a\u4e2d\u65ad\u3092\u907f\u3051\u305f\u3044\u5834\u5408\u306f\u3001Web \u30af\u30e9\u30a4\u30a2\u30f3\u30c8\u3092\u72ec\u81ea\u306e\u30b3\u30f3\u30c6\u30f3\u30c4\u30c7\u30ea\u30d0\u30ea\u30fc\u30cd\u30c3\u30c8\u30ef\u30fc\u30af\u3067\u30db\u30b9\u30c8\u3059\u308b\u304b\u3001\u81ea\u8eab\u306e Web \u30b5\u30a4\u30c8\u5185\u3067\u30db\u30b9\u30c8\u3059\u308b\u3053\u3068\u3092\u304a\u52e7\u3081\u3057\u307e\u3059\u3002",(0,i.jsx)(n.a,{href:"https://github.com/aws-observability/aws-rum-web/blob/main/docs/cdn_installation.md",children:"GitHub \u306e\u30c9\u30ad\u30e5\u30e1\u30f3\u30c8"}),"\u3067\u306f\u3001\u72ec\u81ea\u306e\u30aa\u30ea\u30b8\u30f3\u30c9\u30e1\u30a4\u30f3\u304b\u3089 Web \u30af\u30e9\u30a4\u30a2\u30f3\u30c8\u3092\u30db\u30b9\u30c8\u3059\u308b\u305f\u3081\u306e\u30ac\u30a4\u30c0\u30f3\u30b9\u3092\u63d0\u4f9b\u3057\u3066\u3044\u307e\u3059\u3002"]})}),"\n",(0,i.jsx)(n.h2,{id:"\u30a2\u30d7\u30ea\u30b1\u30fc\u30b7\u30e7\u30f3\u306e\u8a8d\u8a3c",children:"\u30a2\u30d7\u30ea\u30b1\u30fc\u30b7\u30e7\u30f3\u306e\u8a8d\u8a3c"}),"\n",(0,i.jsx)(n.p,{children:"CloudWatch RUM \u3092\u4f7f\u7528\u3059\u308b\u306b\u306f\u3001\u30a2\u30d7\u30ea\u30b1\u30fc\u30b7\u30e7\u30f3\u304c\u4ee5\u4e0b\u306e 3 \u3064\u306e\u30aa\u30d7\u30b7\u30e7\u30f3\u306e\u3044\u305a\u308c\u304b\u3092\u901a\u3058\u3066\u8a8d\u8a3c\u3092\u884c\u3046\u5fc5\u8981\u304c\u3042\u308a\u307e\u3059\u3002"}),"\n",(0,i.jsxs)(n.ol,{children:["\n",(0,i.jsx)(n.li,{children:"\u3059\u3067\u306b\u30bb\u30c3\u30c8\u30a2\u30c3\u30d7\u6e08\u307f\u306e\u65e2\u5b58\u306e ID \u30d7\u30ed\u30d0\u30a4\u30c0\u30fc\u304b\u3089\u306e\u8a8d\u8a3c\u3092\u4f7f\u7528\u3059\u308b"}),"\n",(0,i.jsx)(n.li,{children:"\u65e2\u5b58\u306e Amazon Cognito ID \u30d7\u30fc\u30eb\u3092\u4f7f\u7528\u3059\u308b"}),"\n",(0,i.jsx)(n.li,{children:"CloudWatch RUM \u306b\u30a2\u30d7\u30ea\u30b1\u30fc\u30b7\u30e7\u30f3\u7528\u306e\u65b0\u3057\u3044 Amazon Cognito ID \u30d7\u30fc\u30eb\u3092\u4f5c\u6210\u3055\u305b\u308b"}),"\n"]}),"\n",(0,i.jsx)(n.admonition,{type:"info",children:(0,i.jsx)(n.p,{children:"CloudWatch RUM \u306b\u30a2\u30d7\u30ea\u30b1\u30fc\u30b7\u30e7\u30f3\u7528\u306e\u65b0\u3057\u3044 Amazon Cognito ID \u30d7\u30fc\u30eb\u3092\u4f5c\u6210\u3055\u305b\u308b\u30aa\u30d7\u30b7\u30e7\u30f3\u304c\u3001\u30bb\u30c3\u30c8\u30a2\u30c3\u30d7\u306b\u6700\u3082\u52b4\u529b\u304c\u304b\u304b\u308a\u307e\u305b\u3093\u3002\u3053\u308c\u304c\u30c7\u30d5\u30a9\u30eb\u30c8\u306e\u30aa\u30d7\u30b7\u30e7\u30f3\u3067\u3059\u3002"})}),"\n",(0,i.jsx)(n.admonition,{type:"tip",children:(0,i.jsxs)(n.p,{children:["CloudWatch RUM \u306f\u3001\u672a\u8a8d\u8a3c\u30e6\u30fc\u30b6\u30fc\u3068\u8a8d\u8a3c\u6e08\u307f\u30e6\u30fc\u30b6\u30fc\u3092\u5206\u96e2\u3059\u308b\u3088\u3046\u306b\u8a2d\u5b9a\u3067\u304d\u307e\u3059\u3002\u8a73\u7d30\u306b\u3064\u3044\u3066\u306f\u3001",(0,i.jsx)(n.a,{href:"https://aws.amazon.com/blogs/mt/how-to-isolate-signed-in-users-from-guest-users-within-amazon-cloudwatch-rum/",children:"\u3053\u306e\u30d6\u30ed\u30b0\u8a18\u4e8b"})," \u3092\u3054\u89a7\u304f\u3060\u3055\u3044\u3002"]})}),"\n",(0,i.jsx)(n.h2,{id:"\u30c7\u30fc\u30bf\u4fdd\u8b77\u3068\u30d7\u30e9\u30a4\u30d0\u30b7\u30fc",children:"\u30c7\u30fc\u30bf\u4fdd\u8b77\u3068\u30d7\u30e9\u30a4\u30d0\u30b7\u30fc"}),"\n",(0,i.jsxs)(n.p,{children:["CloudWatch RUM \u30af\u30e9\u30a4\u30a2\u30f3\u30c8\u306f\u3001\u30a8\u30f3\u30c9\u30e6\u30fc\u30b6\u30fc\u30c7\u30fc\u30bf\u306e\u53ce\u96c6\u3092\u652f\u63f4\u3059\u308b\u305f\u3081\u306b\u30af\u30c3\u30ad\u30fc\u3092\u4f7f\u7528\u3059\u308b\u3053\u3068\u304c\u3067\u304d\u307e\u3059\u3002\u3053\u308c\u306f\u30e6\u30fc\u30b6\u30fc\u30b8\u30e3\u30fc\u30cb\u30fc\u6a5f\u80fd\u306b\u5f79\u7acb\u3061\u307e\u3059\u304c\u3001\u5fc5\u9808\u3067\u306f\u3042\u308a\u307e\u305b\u3093\u3002\u30d7\u30e9\u30a4\u30d0\u30b7\u30fc\u95a2\u9023\u306e\u60c5\u5831\u306b\u3064\u3044\u3066\u306f\u3001",(0,i.jsx)(n.a,{href:"https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/CloudWatch-RUM-privacy.html",children:"\u8a73\u7d30\u306a\u30c9\u30ad\u30e5\u30e1\u30f3\u30c8"}),"\u3092\u3054\u89a7\u304f\u3060\u3055\u3044\u3002",(0,i.jsx)(n.sup,{children:(0,i.jsx)(n.a,{href:"#user-content-fn-1",id:"user-content-fnref-1","data-footnote-ref":!0,"aria-describedby":"footnote-label",children:"1"})})]}),"\n",(0,i.jsx)(n.admonition,{type:"tip",children:(0,i.jsxs)(n.p,{children:["RUM \u3092\u4f7f\u7528\u3057\u305f Web \u30a2\u30d7\u30ea\u30b1\u30fc\u30b7\u30e7\u30f3\u306e\u30c6\u30ec\u30e1\u30c8\u30ea\u53ce\u96c6\u306f\u5b89\u5168\u3067\u3042\u308a\u3001\u30b3\u30f3\u30bd\u30fc\u30eb\u3084 CloudWatch Logs \u3092\u901a\u3058\u3066\u500b\u4eba\u3092\u7279\u5b9a\u3067\u304d\u308b\u60c5\u5831 (PII) \u304c\u9732\u51fa\u3059\u308b\u3053\u3068\u306f\u3042\u308a\u307e\u305b\u3093\u304c\u3001Web \u30af\u30e9\u30a4\u30a2\u30f3\u30c8\u3092\u901a\u3058\u3066",(0,i.jsx)(n.a,{href:"https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/CloudWatch-RUM-custom-metadata.html",children:"\u30ab\u30b9\u30bf\u30e0\u5c5e\u6027"}),"\u3092\u53ce\u96c6\u3067\u304d\u308b\u3053\u3068\u306b\u6ce8\u610f\u3057\u3066\u304f\u3060\u3055\u3044\u3002\u3053\u306e\u30e1\u30ab\u30cb\u30ba\u30e0\u3092\u4f7f\u7528\u3057\u3066\u6a5f\u5bc6\u30c7\u30fc\u30bf\u3092\u9732\u51fa\u3055\u305b\u306a\u3044\u3088\u3046\u6ce8\u610f\u3057\u3066\u304f\u3060\u3055\u3044\u3002"]})}),"\n",(0,i.jsx)(n.h2,{id:"\u30af\u30e9\u30a4\u30a2\u30f3\u30c8\u30b3\u30fc\u30c9\u30b9\u30cb\u30da\u30c3\u30c8",children:"\u30af\u30e9\u30a4\u30a2\u30f3\u30c8\u30b3\u30fc\u30c9\u30b9\u30cb\u30da\u30c3\u30c8"}),"\n",(0,i.jsx)(n.p,{children:"CloudWatch RUM Web \u30af\u30e9\u30a4\u30a2\u30f3\u30c8\u306e\u30b3\u30fc\u30c9\u30b9\u30cb\u30da\u30c3\u30c8\u306f\u81ea\u52d5\u751f\u6210\u3055\u308c\u307e\u3059\u304c\u3001\u8981\u4ef6\u306b\u5408\u308f\u305b\u3066\u30af\u30e9\u30a4\u30a2\u30f3\u30c8\u3092\u8a2d\u5b9a\u3059\u308b\u305f\u3081\u306b\u624b\u52d5\u3067\u30b3\u30fc\u30c9\u30b9\u30cb\u30da\u30c3\u30c8\u3092\u5909\u66f4\u3059\u308b\u3053\u3068\u3082\u3067\u304d\u307e\u3059\u3002"}),"\n",(0,i.jsx)(n.admonition,{type:"info",children:(0,i.jsxs)(n.p,{children:["\u30b7\u30f3\u30b0\u30eb\u30da\u30fc\u30b8\u30a2\u30d7\u30ea\u30b1\u30fc\u30b7\u30e7\u30f3\u3067\u30af\u30c3\u30ad\u30fc\u306e\u4f5c\u6210\u3092\u52d5\u7684\u306b\u6709\u52b9\u306b\u3059\u308b\u306b\u306f\u3001\u30af\u30c3\u30ad\u30fc\u540c\u610f\u30e1\u30ab\u30cb\u30ba\u30e0\u3092\u4f7f\u7528\u3057\u3066\u304f\u3060\u3055\u3044\u3002\u8a73\u7d30\u306b\u3064\u3044\u3066\u306f\u3001",(0,i.jsx)(n.a,{href:"https://aws.amazon.com/blogs/mt/how-and-when-to-enable-session-cookies-with-amazon-cloudwatch-rum/",children:"\u3053\u306e\u30d6\u30ed\u30b0\u8a18\u4e8b"})," \u3092\u53c2\u7167\u3057\u3066\u304f\u3060\u3055\u3044\u3002"]})}),"\n",(0,i.jsx)(n.h3,{id:"url-\u53ce\u96c6\u306e\u7121\u52b9\u5316",children:"URL \u53ce\u96c6\u306e\u7121\u52b9\u5316"}),"\n",(0,i.jsx)(n.p,{children:"\u500b\u4eba\u60c5\u5831\u3092\u542b\u3080\u53ef\u80fd\u6027\u306e\u3042\u308b\u30ea\u30bd\u30fc\u30b9 URL \u306e\u53ce\u96c6\u3092\u9632\u6b62\u3057\u307e\u3059\u3002"}),"\n",(0,i.jsx)(n.admonition,{type:"info",children:(0,i.jsxs)(n.p,{children:["\u30a2\u30d7\u30ea\u30b1\u30fc\u30b7\u30e7\u30f3\u3067\u500b\u4eba\u3092\u7279\u5b9a\u3067\u304d\u308b\u60c5\u5831\uff08PII\uff09\u3092\u542b\u3080 URL \u3092\u4f7f\u7528\u3057\u3066\u3044\u308b\u5834\u5408\u3001\u30b3\u30fc\u30c9\u30b9\u30cb\u30da\u30c3\u30c8\u306e\u8a2d\u5b9a\u3067 ",(0,i.jsx)(n.code,{children:"recordResourceUrl: false"})," \u3092\u8a2d\u5b9a\u3057\u3066\u3001\u30a2\u30d7\u30ea\u30b1\u30fc\u30b7\u30e7\u30f3\u306b\u633f\u5165\u3059\u308b\u524d\u306b\u30ea\u30bd\u30fc\u30b9 URL \u306e\u53ce\u96c6\u3092\u7121\u52b9\u306b\u3059\u308b\u3053\u3068\u3092\u5f37\u304f\u304a\u3059\u3059\u3081\u3057\u307e\u3059\u3002"]})}),"\n",(0,i.jsx)(n.h3,{id:"\u30a2\u30af\u30c6\u30a3\u30d6\u30c8\u30ec\u30fc\u30b9\u306e\u6709\u52b9\u5316",children:"\u30a2\u30af\u30c6\u30a3\u30d6\u30c8\u30ec\u30fc\u30b9\u306e\u6709\u52b9\u5316"}),"\n",(0,i.jsxs)(n.p,{children:["Web \u30af\u30e9\u30a4\u30a2\u30f3\u30c8\u3067 ",(0,i.jsx)(n.code,{children:"addXRayTraceIdHeader: true"})," \u3092\u8a2d\u5b9a\u3059\u308b\u3053\u3068\u3067\u3001\u30a8\u30f3\u30c9\u30c4\u30fc\u30a8\u30f3\u30c9\u306e\u30c8\u30ec\u30fc\u30b9\u3092\u6709\u52b9\u306b\u3057\u307e\u3059\u3002\u3053\u308c\u306b\u3088\u308a\u3001CloudWatch RUM Web \u30af\u30e9\u30a4\u30a2\u30f3\u30c8\u306f HTTP \u30ea\u30af\u30a8\u30b9\u30c8\u306b X-Ray \u30c8\u30ec\u30fc\u30b9\u30d8\u30c3\u30c0\u30fc\u3092\u8ffd\u52a0\u3057\u307e\u3059\u3002"]}),"\n",(0,i.jsx)(n.p,{children:"\u3053\u306e\u4efb\u610f\u306e\u8a2d\u5b9a\u3092\u6709\u52b9\u306b\u3059\u308b\u3068\u3001\u30a2\u30d7\u30ea\u30b1\u30fc\u30b7\u30e7\u30f3\u30e2\u30cb\u30bf\u30fc\u306b\u3088\u3063\u3066\u30b5\u30f3\u30d7\u30ea\u30f3\u30b0\u3055\u308c\u305f\u30e6\u30fc\u30b6\u30fc\u30bb\u30c3\u30b7\u30e7\u30f3\u4e2d\u306b\u884c\u308f\u308c\u305f XMLHttpRequest \u304a\u3088\u3073 fetch \u30ea\u30af\u30a8\u30b9\u30c8\u304c\u30c8\u30ec\u30fc\u30b9\u3055\u308c\u307e\u3059\u3002\u3053\u308c\u306b\u3088\u308a\u3001RUM \u30c0\u30c3\u30b7\u30e5\u30dc\u30fc\u30c9\u3001CloudWatch ServiceLens \u30b3\u30f3\u30bd\u30fc\u30eb\u3001\u304a\u3088\u3073 X-Ray \u30b3\u30f3\u30bd\u30fc\u30eb\u3067\u3053\u308c\u3089\u306e\u30e6\u30fc\u30b6\u30fc\u30bb\u30c3\u30b7\u30e7\u30f3\u306e\u30c8\u30ec\u30fc\u30b9\u3068\u30bb\u30b0\u30e1\u30f3\u30c8\u3092\u78ba\u8a8d\u3067\u304d\u307e\u3059\u3002"}),"\n",(0,i.jsx)(n.p,{children:"AWS \u30b3\u30f3\u30bd\u30fc\u30eb\u3067\u30a2\u30d7\u30ea\u30b1\u30fc\u30b7\u30e7\u30f3\u30e2\u30cb\u30bf\u30fc\u3092\u30bb\u30c3\u30c8\u30a2\u30c3\u30d7\u3059\u308b\u969b\u306b\u3001\u30c1\u30a7\u30c3\u30af\u30dc\u30c3\u30af\u30b9\u3092\u30af\u30ea\u30c3\u30af\u3057\u3066\u30a2\u30af\u30c6\u30a3\u30d6\u30c8\u30ec\u30fc\u30b9\u3092\u6709\u52b9\u306b\u3059\u308b\u3068\u3001\u30b3\u30fc\u30c9\u30b9\u30cb\u30da\u30c3\u30c8\u3067\u81ea\u52d5\u7684\u306b\u8a2d\u5b9a\u304c\u6709\u52b9\u306b\u306a\u308a\u307e\u3059\u3002"}),"\n",(0,i.jsx)(n.p,{children:(0,i.jsx)(n.img,{alt:"RUM \u30a2\u30d7\u30ea\u30b1\u30fc\u30b7\u30e7\u30f3\u30e2\u30cb\u30bf\u30fc\u306e\u30a2\u30af\u30c6\u30a3\u30d6\u30c8\u30ec\u30fc\u30b9\u8a2d\u5b9a",src:s(92345).A+"",width:"904",height:"359"})}),"\n",(0,i.jsx)(n.h3,{id:"\u30b9\u30cb\u30da\u30c3\u30c8\u306e\u633f\u5165",children:"\u30b9\u30cb\u30da\u30c3\u30c8\u306e\u633f\u5165"}),"\n",(0,i.jsxs)(n.p,{children:["\u524d\u306e\u30bb\u30af\u30b7\u30e7\u30f3\u3067\u30b3\u30d4\u30fc\u307e\u305f\u306f\u30c0\u30a6\u30f3\u30ed\u30fc\u30c9\u3057\u305f\u30b3\u30fc\u30c9\u30b9\u30cb\u30da\u30c3\u30c8\u3092\u3001\u30a2\u30d7\u30ea\u30b1\u30fc\u30b7\u30e7\u30f3\u306e ",(0,i.jsx)(n.code,{children:"<head>"})," \u8981\u7d20\u5185\u306b\u633f\u5165\u3057\u307e\u3059\u3002",(0,i.jsx)(n.code,{children:"<body>"})," \u8981\u7d20\u3084\u4ed6\u306e ",(0,i.jsx)(n.code,{children:"<script>"})," \u30bf\u30b0\u306e\u524d\u306b\u633f\u5165\u3057\u3066\u304f\u3060\u3055\u3044\u3002"]}),"\n",(0,i.jsx)(n.admonition,{type:"info",children:(0,i.jsx)(n.p,{children:"\u30a2\u30d7\u30ea\u30b1\u30fc\u30b7\u30e7\u30f3\u306b\u8907\u6570\u306e\u30da\u30fc\u30b8\u304c\u3042\u308b\u5834\u5408\u306f\u3001\u3059\u3079\u3066\u306e\u30da\u30fc\u30b8\u306b\u542b\u307e\u308c\u308b\u5171\u6709\u30d8\u30c3\u30c0\u30fc\u30b3\u30f3\u30dd\u30fc\u30cd\u30f3\u30c8\u306b\u30b3\u30fc\u30c9\u30b9\u30cb\u30da\u30c3\u30c8\u3092\u633f\u5165\u3057\u3066\u304f\u3060\u3055\u3044\u3002"})}),"\n",(0,i.jsx)(n.admonition,{type:"warning",children:(0,i.jsxs)(n.p,{children:["Web \u30af\u30e9\u30a4\u30a2\u30f3\u30c8\u3092 ",(0,i.jsx)(n.code,{children:"<head>"})," \u8981\u7d20\u306e\u53ef\u80fd\u306a\u9650\u308a\u65e9\u3044\u4f4d\u7f6e\u306b\u914d\u7f6e\u3059\u308b\u3053\u3068\u304c\u975e\u5e38\u306b\u91cd\u8981\u3067\u3059\uff01\u30da\u30fc\u30b8\u306e HTML \u306e\u4e0b\u90e8\u4ed8\u8fd1\u306b\u8aad\u307f\u8fbc\u307e\u308c\u308b\u53d7\u52d5\u7684\u306a Web \u30c8\u30e9\u30c3\u30ab\u30fc\u3068\u306f\u7570\u306a\u308a\u3001RUM \u304c\u6700\u5927\u9650\u306e\u30d1\u30d5\u30a9\u30fc\u30de\u30f3\u30b9\u30c7\u30fc\u30bf\u3092\u53d6\u5f97\u3059\u308b\u306b\u306f\u3001\u30da\u30fc\u30b8\u306e\u30ec\u30f3\u30c0\u30ea\u30f3\u30b0\u30d7\u30ed\u30bb\u30b9\u306e\u65e9\u3044\u6bb5\u968e\u3067\u30a4\u30f3\u30b9\u30bf\u30f3\u30b9\u5316\u3059\u308b\u5fc5\u8981\u304c\u3042\u308a\u307e\u3059\u3002"]})}),"\n",(0,i.jsx)(n.h2,{id:"\u30ab\u30b9\u30bf\u30e0\u30e1\u30bf\u30c7\u30fc\u30bf\u306e\u4f7f\u7528",children:"\u30ab\u30b9\u30bf\u30e0\u30e1\u30bf\u30c7\u30fc\u30bf\u306e\u4f7f\u7528"}),"\n",(0,i.jsxs)(n.p,{children:["CloudWatch RUM \u30a4\u30d9\u30f3\u30c8\u306e\u30c7\u30d5\u30a9\u30eb\u30c8\u306e",(0,i.jsx)(n.a,{href:"https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/CloudWatch-RUM-datacollected.html",children:"\u30a4\u30d9\u30f3\u30c8\u30e1\u30bf\u30c7\u30fc\u30bf"}),"\u306b\u30ab\u30b9\u30bf\u30e0\u30e1\u30bf\u30c7\u30fc\u30bf\u3092\u8ffd\u52a0\u3067\u304d\u307e\u3059\u3002\u30bb\u30c3\u30b7\u30e7\u30f3\u5c5e\u6027\u306f\u3001\u30e6\u30fc\u30b6\u30fc\u306e\u30bb\u30c3\u30b7\u30e7\u30f3\u5185\u306e\u3059\u3079\u3066\u306e\u30a4\u30d9\u30f3\u30c8\u306b\u8ffd\u52a0\u3055\u308c\u307e\u3059\u3002\u30da\u30fc\u30b8\u5c5e\u6027\u306f\u3001\u6307\u5b9a\u3055\u308c\u305f\u30da\u30fc\u30b8\u306b\u306e\u307f\u8ffd\u52a0\u3055\u308c\u307e\u3059\u3002"]}),"\n",(0,i.jsx)(n.admonition,{type:"info",children:(0,i.jsxs)(n.p,{children:["\u30ab\u30b9\u30bf\u30e0\u5c5e\u6027\u306e\u30ad\u30fc\u540d\u306b\u306f\u3001",(0,i.jsx)(n.a,{href:"https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/CloudWatch-RUM-custom-metadata.html",children:"\u3053\u306e\u30da\u30fc\u30b8"}),"\u306b\u8a18\u8f09\u3055\u308c\u3066\u3044\u308b\u4e88\u7d04\u30ad\u30fc\u30ef\u30fc\u30c9\u3092\u4f7f\u7528\u3057\u306a\u3044\u3088\u3046\u306b\u3057\u3066\u304f\u3060\u3055\u3044"]})}),"\n",(0,i.jsx)(n.h2,{id:"\u30da\u30fc\u30b8\u30b0\u30eb\u30fc\u30d7\u306e\u4f7f\u7528",children:"\u30da\u30fc\u30b8\u30b0\u30eb\u30fc\u30d7\u306e\u4f7f\u7528"}),"\n",(0,i.jsxs)(n.admonition,{type:"info",children:[(0,i.jsx)(n.p,{children:"\u30da\u30fc\u30b8\u30b0\u30eb\u30fc\u30d7\u3092\u4f7f\u7528\u3057\u3066\u3001\u30a2\u30d7\u30ea\u30b1\u30fc\u30b7\u30e7\u30f3\u5185\u306e\u7570\u306a\u308b\u30da\u30fc\u30b8\u3092\u76f8\u4e92\u306b\u95a2\u9023\u4ed8\u3051\u308b\u3053\u3068\u3067\u3001\u30da\u30fc\u30b8\u30b0\u30eb\u30fc\u30d7\u306e\u96c6\u8a08\u3055\u308c\u305f\u5206\u6790\u60c5\u5831\u3092\u78ba\u8a8d\u3067\u304d\u307e\u3059\u3002\u4f8b\u3048\u3070\u3001\u30bf\u30a4\u30d7\u3084\u8a00\u8a9e\u5225\u306b\u3059\u3079\u3066\u306e\u30da\u30fc\u30b8\u306e\u96c6\u8a08\u3055\u308c\u305f\u30da\u30fc\u30b8\u8aad\u307f\u8fbc\u307f\u6642\u9593\u3092\u78ba\u8a8d\u3057\u305f\u3044\u5834\u5408\u304c\u3042\u308a\u307e\u3059\u3002"}),(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{children:"awsRum.recordPageView({ pageId: '/home', pageTags: ['en', 'landing']})\n"})})]}),"\n",(0,i.jsx)(n.h2,{id:"\u62e1\u5f35\u30e1\u30c8\u30ea\u30af\u30b9\u306e\u4f7f\u7528",children:"\u62e1\u5f35\u30e1\u30c8\u30ea\u30af\u30b9\u306e\u4f7f\u7528"}),"\n",(0,i.jsxs)(n.p,{children:["CloudWatch RUM \u306b\u3088\u3063\u3066\u81ea\u52d5\u7684\u306b\u53ce\u96c6\u3055\u308c\u308b",(0,i.jsx)(n.a,{href:"https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/CloudWatch-RUM-metrics.html",children:"\u30c7\u30d5\u30a9\u30eb\u30c8\u306e\u30e1\u30c8\u30ea\u30af\u30b9\u30bb\u30c3\u30c8"}),"\u304c\u3042\u308a\u3001\u3053\u308c\u3089\u306f ",(0,i.jsx)(n.code,{children:"AWS/RUM"})," \u3068\u3044\u3046\u540d\u524d\u306e\u540d\u524d\u7a7a\u9593\u3067\u516c\u958b\u3055\u308c\u307e\u3059\u3002\u3053\u308c\u3089\u306f\u7121\u6599\u306e",(0,i.jsx)(n.a,{href:"../tools/metrics/#vended-metrics",children:"\u30d9\u30f3\u30c0\u30fc\u30e1\u30c8\u30ea\u30af\u30b9"}),"\u3067\u3001RUM \u304c\u30e6\u30fc\u30b6\u30fc\u306b\u4ee3\u308f\u3063\u3066\u4f5c\u6210\u3057\u307e\u3059\u3002"]}),"\n",(0,i.jsx)(n.admonition,{type:"info",children:(0,i.jsx)(n.p,{children:"CloudWatch RUM \u30e1\u30c8\u30ea\u30af\u30b9\u3092\u8ffd\u52a0\u306e\u30c7\u30a3\u30e1\u30f3\u30b7\u30e7\u30f3\u3068\u5171\u306b CloudWatch \u306b\u9001\u4fe1\u3059\u308b\u3053\u3068\u3067\u3001\u3088\u308a\u8a73\u7d30\u306a\u30d3\u30e5\u30fc\u3092\u5f97\u308b\u3053\u3068\u304c\u3067\u304d\u307e\u3059\u3002"})}),"\n",(0,i.jsx)(n.p,{children:"\u62e1\u5f35\u30e1\u30c8\u30ea\u30af\u30b9\u3067\u306f\u3001\u4ee5\u4e0b\u306e\u30c7\u30a3\u30e1\u30f3\u30b7\u30e7\u30f3\u304c\u30b5\u30dd\u30fc\u30c8\u3055\u308c\u3066\u3044\u307e\u3059\uff1a"}),"\n",(0,i.jsxs)(n.ul,{children:["\n",(0,i.jsx)(n.li,{children:"BrowserName"}),"\n",(0,i.jsx)(n.li,{children:"CountryCode - ISO-3166 \u30d5\u30a9\u30fc\u30de\u30c3\u30c8\uff082 \u6587\u5b57\u30b3\u30fc\u30c9\uff09"}),"\n",(0,i.jsx)(n.li,{children:"DeviceType"}),"\n",(0,i.jsx)(n.li,{children:"FileType"}),"\n",(0,i.jsx)(n.li,{children:"OSName"}),"\n",(0,i.jsx)(n.li,{children:"PageId"}),"\n"]}),"\n",(0,i.jsxs)(n.p,{children:["\u305f\u3060\u3057\u3001",(0,i.jsx)(n.a,{href:"https://aws.amazon.com/blogs/mt/create-metrics-and-alarms-for-specific-web-pages-amazon-cloudwatch-rum/",children:"\u3053\u306e\u30da\u30fc\u30b8\u306e\u30ac\u30a4\u30c0\u30f3\u30b9"}),"\u3092\u4f7f\u7528\u3057\u3066\u3001\u72ec\u81ea\u306e\u30e1\u30c8\u30ea\u30af\u30b9\u3068\u30a2\u30e9\u30fc\u30e0\u3092\u4f5c\u6210\u3059\u308b\u3053\u3068\u3082\u3067\u304d\u307e\u3059\u3002\u3053\u306e\u30a2\u30d7\u30ed\u30fc\u30c1\u306b\u3088\u308a\u3001\u5fc5\u8981\u306a\u4efb\u610f\u306e\u30c7\u30fc\u30bf\u30dd\u30a4\u30f3\u30c8\u3001URI\u3001\u307e\u305f\u306f\u305d\u306e\u4ed6\u306e\u30b3\u30f3\u30dd\u30fc\u30cd\u30f3\u30c8\u306e\u30d1\u30d5\u30a9\u30fc\u30de\u30f3\u30b9\u3092\u76e3\u8996\u3067\u304d\u307e\u3059\u3002"]}),"\n","\n",(0,i.jsxs)(n.section,{"data-footnotes":!0,className:"footnotes",children:[(0,i.jsx)(n.h2,{className:"sr-only",id:"footnote-label",children:"Footnotes"}),"\n",(0,i.jsxs)(n.ol,{children:["\n",(0,i.jsxs)(n.li,{id:"user-content-fn-1",children:["\n",(0,i.jsxs)(n.p,{children:["CloudWatch RUM \u3067\u30af\u30c3\u30ad\u30fc\u3092\u4f7f\u7528\u3059\u308b\u969b\u306e\u8003\u616e\u4e8b\u9805\u306b\u3064\u3044\u3066\u306f\u3001",(0,i.jsx)(n.a,{href:"https://aws.amazon.com/blogs/mt/how-and-when-to-enable-session-cookies-with-amazon-cloudwatch-rum/",children:"\u30d6\u30ed\u30b0\u6295\u7a3f"}),"\u3092\u3054\u89a7\u304f\u3060\u3055\u3044\u3002 ",(0,i.jsx)(n.a,{href:"#user-content-fnref-1","data-footnote-backref":"","aria-label":"Back to reference 1",className:"data-footnote-backref",children:"\u21a9"})]}),"\n"]}),"\n"]}),"\n"]})]})}function h(e={}){const{wrapper:n}={...(0,o.R)(),...e.components};return n?(0,i.jsx)(n,{...e,children:(0,i.jsx)(r,{...e})}):r(e)}},25762:(e,n,s)=>{s.d(n,{A:()=>t});const t=s.p+"assets/images/rum2-a87d1162e7120b160c6fec3a3570df38.png"},28453:(e,n,s)=>{s.d(n,{R:()=>a,x:()=>c});var t=s(96540);const i={},o=t.createContext(i);function a(e){const n=t.useContext(o);return t.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function c(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(i):e.components||i:a(e.components),t.createElement(o.Provider,{value:n},e.children)}},92345:(e,n,s)=>{s.d(n,{A:()=>t});const t=s.p+"assets/images/rum1-1ff7c8ed90dd5ebf946f603c1262139d.png"}}]);
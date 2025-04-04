"use strict";(self.webpackChunkobservability_best_practices=self.webpackChunkobservability_best_practices||[]).push([[2409],{28453:(n,a,e)=>{e.d(a,{R:()=>i,x:()=>o});var s=e(96540);const t={},l=s.createContext(t);function i(n){const a=s.useContext(l);return s.useMemo((function(){return"function"==typeof n?n(a):{...a,...n}}),[a,n])}function o(n){let a;return a=n.disableParentContext?"function"==typeof n.components?n.components(t):n.components||t:i(n.components),s.createElement(l.Provider,{value:a},n.children)}},50326:(n,a,e)=>{e.d(a,{A:()=>s});const s=e.p+"assets/images/lambdalogging-8240cd2c0f8962dae858d43ab8e8fe17.png"},53820:(n,a,e)=>{e.r(a),e.d(a,{assets:()=>c,contentTitle:()=>o,default:()=>h,frontMatter:()=>i,metadata:()=>s,toc:()=>d});const s=JSON.parse('{"id":"patterns/lambdalogging","title":"Lambda \u306e\u30ed\u30b0\u8a18\u9332","description":"\u30b5\u30fc\u30d0\u30fc\u30ec\u30b9\u30b3\u30f3\u30d4\u30e5\u30fc\u30c6\u30a3\u30f3\u30b0\u306e\u4e16\u754c\u3067\u306f\u3001\u30aa\u30d6\u30b6\u30fc\u30d0\u30d3\u30ea\u30c6\u30a3\u306f\u30a2\u30d7\u30ea\u30b1\u30fc\u30b7\u30e7\u30f3\u306e\u4fe1\u983c\u6027\u3001\u30d1\u30d5\u30a9\u30fc\u30de\u30f3\u30b9\u3001\u52b9\u7387\u6027\u3092\u78ba\u4fdd\u3059\u308b\u305f\u3081\u306e\u91cd\u8981\u306a\u5074\u9762\u3067\u3059\u3002\u30b5\u30fc\u30d0\u30fc\u30ec\u30b9\u30a2\u30fc\u30ad\u30c6\u30af\u30c1\u30e3\u306e\u8981\u3068\u306a\u308b AWS Lambda \u306f\u3001\u57fa\u76e4\u3068\u306a\u308b\u30a4\u30f3\u30d5\u30e9\u30b9\u30c8\u30e9\u30af\u30c1\u30e3\u3092\u7ba1\u7406\u3059\u308b\u3053\u3068\u306a\u304f\u3001\u30a4\u30d9\u30f3\u30c8\u99c6\u52d5\u578b\u306e\u30b3\u30fc\u30c9\u3092\u5b9f\u884c\u3059\u308b\u305f\u3081\u306e\u5f37\u529b\u3067\u30b9\u30b1\u30fc\u30e9\u30d6\u30eb\u306a\u30d7\u30e9\u30c3\u30c8\u30d5\u30a9\u30fc\u30e0\u3092\u63d0\u4f9b\u3057\u307e\u3059\u3002\u3057\u304b\u3057\u3001\u4ed6\u306e\u30a2\u30d7\u30ea\u30b1\u30fc\u30b7\u30e7\u30f3\u3068\u540c\u69d8\u306b\u3001Lambda \u95a2\u6570\u306e\u52d5\u4f5c\u3068\u5065\u5168\u6027\u3092\u76e3\u8996\u3001\u30c8\u30e9\u30d6\u30eb\u30b7\u30e5\u30fc\u30c6\u30a3\u30f3\u30b0\u3001\u6d1e\u5bdf\u3059\u308b\u305f\u3081\u306b\u306f\u3001\u30ed\u30b0\u8a18\u9332\u304c\u4e0d\u53ef\u6b20\u3067\u3059\u3002","source":"@site/i18n/ja/docusaurus-plugin-content-docs/current/patterns/lambdalogging.md","sourceDirName":"patterns","slug":"/patterns/lambdalogging","permalink":"/observability-best-practices/ja/patterns/lambdalogging","draft":false,"unlisted":false,"editUrl":"https://github.com/aws-observability/observability-best-practices/blob/main/docusaurus/docs/patterns/lambdalogging.md","tags":[],"version":"current","frontMatter":{},"sidebar":"patterns","previous":{"title":"AWS \u30aa\u30fc\u30d7\u30f3\u30bd\u30fc\u30b9\u30b5\u30fc\u30d3\u30b9\u306b\u3088\u308b EKS \u30e2\u30cb\u30bf\u30ea\u30f3\u30b0","permalink":"/observability-best-practices/ja/patterns/eksampamg"},"next":{"title":"AWS \u30cd\u30a4\u30c6\u30a3\u30d6\u30b5\u30fc\u30d3\u30b9\u3092\u4f7f\u7528\u3057\u305f\u30af\u30ed\u30b9\u30a2\u30ab\u30a6\u30f3\u30c8\u30e2\u30cb\u30bf\u30ea\u30f3\u30b0","permalink":"/observability-best-practices/ja/patterns/multiaccount"}}');var t=e(74848),l=e(28453);const i={},o="Lambda \u306e\u30ed\u30b0\u8a18\u9332",c={},d=[];function r(n){const a={em:"em",h1:"h1",header:"header",img:"img",li:"li",ol:"ol",p:"p",...(0,l.R)(),...n.components};return(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)(a.header,{children:(0,t.jsx)(a.h1,{id:"lambda-\u306e\u30ed\u30b0\u8a18\u9332",children:"Lambda \u306e\u30ed\u30b0\u8a18\u9332"})}),"\n",(0,t.jsx)(a.p,{children:"\u30b5\u30fc\u30d0\u30fc\u30ec\u30b9\u30b3\u30f3\u30d4\u30e5\u30fc\u30c6\u30a3\u30f3\u30b0\u306e\u4e16\u754c\u3067\u306f\u3001\u30aa\u30d6\u30b6\u30fc\u30d0\u30d3\u30ea\u30c6\u30a3\u306f\u30a2\u30d7\u30ea\u30b1\u30fc\u30b7\u30e7\u30f3\u306e\u4fe1\u983c\u6027\u3001\u30d1\u30d5\u30a9\u30fc\u30de\u30f3\u30b9\u3001\u52b9\u7387\u6027\u3092\u78ba\u4fdd\u3059\u308b\u305f\u3081\u306e\u91cd\u8981\u306a\u5074\u9762\u3067\u3059\u3002\u30b5\u30fc\u30d0\u30fc\u30ec\u30b9\u30a2\u30fc\u30ad\u30c6\u30af\u30c1\u30e3\u306e\u8981\u3068\u306a\u308b AWS Lambda \u306f\u3001\u57fa\u76e4\u3068\u306a\u308b\u30a4\u30f3\u30d5\u30e9\u30b9\u30c8\u30e9\u30af\u30c1\u30e3\u3092\u7ba1\u7406\u3059\u308b\u3053\u3068\u306a\u304f\u3001\u30a4\u30d9\u30f3\u30c8\u99c6\u52d5\u578b\u306e\u30b3\u30fc\u30c9\u3092\u5b9f\u884c\u3059\u308b\u305f\u3081\u306e\u5f37\u529b\u3067\u30b9\u30b1\u30fc\u30e9\u30d6\u30eb\u306a\u30d7\u30e9\u30c3\u30c8\u30d5\u30a9\u30fc\u30e0\u3092\u63d0\u4f9b\u3057\u307e\u3059\u3002\u3057\u304b\u3057\u3001\u4ed6\u306e\u30a2\u30d7\u30ea\u30b1\u30fc\u30b7\u30e7\u30f3\u3068\u540c\u69d8\u306b\u3001Lambda \u95a2\u6570\u306e\u52d5\u4f5c\u3068\u5065\u5168\u6027\u3092\u76e3\u8996\u3001\u30c8\u30e9\u30d6\u30eb\u30b7\u30e5\u30fc\u30c6\u30a3\u30f3\u30b0\u3001\u6d1e\u5bdf\u3059\u308b\u305f\u3081\u306b\u306f\u3001\u30ed\u30b0\u8a18\u9332\u304c\u4e0d\u53ef\u6b20\u3067\u3059\u3002"}),"\n",(0,t.jsx)(a.p,{children:"AWS Lambda \u306f\u3001\u30d5\u30eb\u30de\u30cd\u30fc\u30b8\u30c9\u578b\u306e\u30ed\u30b0\u7ba1\u7406\u30b5\u30fc\u30d3\u30b9\u3067\u3042\u308b Amazon CloudWatch Logs \u3068\u30b7\u30fc\u30e0\u30ec\u30b9\u306b\u7d71\u5408\u3055\u308c\u3001Lambda \u95a2\u6570\u304b\u3089\u306e\u30ed\u30b0\u3092\u4e00\u5143\u5316\u3057\u3066\u5206\u6790\u3059\u308b\u3053\u3068\u304c\u3067\u304d\u307e\u3059\u3002Lambda \u95a2\u6570\u3092 CloudWatch Logs \u306b\u30ed\u30b0\u3092\u8a18\u9332\u3059\u308b\u3088\u3046\u306b\u8a2d\u5b9a\u3059\u308b\u3053\u3068\u3067\u3001\u30b5\u30fc\u30d0\u30fc\u30ec\u30b9\u30a2\u30d7\u30ea\u30b1\u30fc\u30b7\u30e7\u30f3\u306e\u30aa\u30d6\u30b6\u30fc\u30d0\u30d3\u30ea\u30c6\u30a3\u3092\u5411\u4e0a\u3055\u305b\u308b\u69d8\u3005\u306a\u5229\u70b9\u3068\u6a5f\u80fd\u3092\u6d3b\u7528\u3067\u304d\u307e\u3059\u3002"}),"\n",(0,t.jsxs)(a.ol,{children:["\n",(0,t.jsxs)(a.li,{children:["\n",(0,t.jsx)(a.p,{children:"\u4e00\u5143\u5316\u3055\u308c\u305f\u30ed\u30b0\u7ba1\u7406\uff1aCloudWatch Logs \u306f\u8907\u6570\u306e Lambda \u95a2\u6570\u304b\u3089\u306e\u30ed\u30b0\u30c7\u30fc\u30bf\u3092\u7d71\u5408\u3057\u3001\u30ed\u30b0\u7ba1\u7406\u3068\u5206\u6790\u306e\u305f\u3081\u306e\u4e00\u5143\u7684\u306a\u5834\u6240\u3092\u63d0\u4f9b\u3057\u307e\u3059\u3002\u3053\u306e\u4e00\u5143\u5316\u306b\u3088\u308a\u3001\u5206\u6563\u3057\u305f\u30b5\u30fc\u30d0\u30fc\u30ec\u30b9\u30a2\u30d7\u30ea\u30b1\u30fc\u30b7\u30e7\u30f3\u5168\u4f53\u306e\u76e3\u8996\u3068\u30c8\u30e9\u30d6\u30eb\u30b7\u30e5\u30fc\u30c6\u30a3\u30f3\u30b0\u306e\u30d7\u30ed\u30bb\u30b9\u304c\u7c21\u7d20\u5316\u3055\u308c\u307e\u3059\u3002"}),"\n"]}),"\n",(0,t.jsxs)(a.li,{children:["\n",(0,t.jsx)(a.p,{children:"\u30ea\u30a2\u30eb\u30bf\u30a4\u30e0\u30ed\u30b0\u30b9\u30c8\u30ea\u30fc\u30df\u30f3\u30b0\uff1aCloudWatch Logs \u306f\u30ea\u30a2\u30eb\u30bf\u30a4\u30e0\u30ed\u30b0\u30b9\u30c8\u30ea\u30fc\u30df\u30f3\u30b0\u3092\u30b5\u30dd\u30fc\u30c8\u3057\u3001Lambda \u95a2\u6570\u306b\u3088\u3063\u3066\u751f\u6210\u3055\u308c\u305f\u30ed\u30b0\u30c7\u30fc\u30bf\u3092\u30ea\u30a2\u30eb\u30bf\u30a4\u30e0\u3067\u8868\u793a\u304a\u3088\u3073\u5206\u6790\u3059\u308b\u3053\u3068\u304c\u3067\u304d\u307e\u3059\u3002\u3053\u306e\u30ea\u30a2\u30eb\u30bf\u30a4\u30e0\u306e\u53ef\u8996\u6027\u306b\u3088\u308a\u3001\u554f\u984c\u3084\u30a8\u30e9\u30fc\u3092\u8fc5\u901f\u306b\u691c\u51fa\u3057\u3066\u5bfe\u5fdc\u3057\u3001\u30c0\u30a6\u30f3\u30bf\u30a4\u30e0\u3084\u30d1\u30d5\u30a9\u30fc\u30de\u30f3\u30b9\u306e\u4f4e\u4e0b\u3092\u6700\u5c0f\u9650\u306b\u6291\u3048\u308b\u3053\u3068\u304c\u3067\u304d\u307e\u3059\u3002"}),"\n"]}),"\n",(0,t.jsxs)(a.li,{children:["\n",(0,t.jsx)(a.p,{children:"\u30ed\u30b0\u306e\u4fdd\u6301\u3068\u30a2\u30fc\u30ab\u30a4\u30d6\uff1aCloudWatch Logs \u3067\u306f\u3001\u30ed\u30b0\u30c7\u30fc\u30bf\u306e\u4fdd\u6301\u30dd\u30ea\u30b7\u30fc\u3092\u5b9a\u7fa9\u3067\u304d\u3001\u30b3\u30f3\u30d7\u30e9\u30a4\u30a2\u30f3\u30b9\u8981\u4ef6\u3092\u6e80\u305f\u3059\u305f\u3081\u3001\u307e\u305f\u306f\u9577\u671f\u7684\u306a\u5206\u6790\u3068\u76e3\u67fb\u3092\u5bb9\u6613\u306b\u3059\u308b\u305f\u3081\u306b\u3001\u30ed\u30b0\u3092\u5e0c\u671b\u3059\u308b\u671f\u9593\u4fdd\u6301\u3059\u308b\u3053\u3068\u304c\u3067\u304d\u307e\u3059\u3002"}),"\n"]}),"\n",(0,t.jsxs)(a.li,{children:["\n",(0,t.jsx)(a.p,{children:"\u30ed\u30b0\u306e\u30d5\u30a3\u30eb\u30bf\u30ea\u30f3\u30b0\u3068\u691c\u7d22\uff1aCloudWatch Logs \u306f\u5f37\u529b\u306a\u30ed\u30b0\u30d5\u30a3\u30eb\u30bf\u30ea\u30f3\u30b0\u3068\u691c\u7d22\u6a5f\u80fd\u3092\u63d0\u4f9b\u3057\u3001\u7279\u5b9a\u306e\u57fa\u6e96\u3084\u30d1\u30bf\u30fc\u30f3\u306b\u57fa\u3065\u3044\u3066\u95a2\u9023\u3059\u308b\u30ed\u30b0\u30a8\u30f3\u30c8\u30ea\u3092\u7d20\u65e9\u304f\u898b\u3064\u3051\u3066\u5206\u6790\u3059\u308b\u3053\u3068\u304c\u3067\u304d\u307e\u3059\u3002\u3053\u306e\u6a5f\u80fd\u306b\u3088\u308a\u3001\u30c8\u30e9\u30d6\u30eb\u30b7\u30e5\u30fc\u30c6\u30a3\u30f3\u30b0\u306e\u30d7\u30ed\u30bb\u30b9\u304c\u52b9\u7387\u5316\u3055\u308c\u3001\u554f\u984c\u306e\u6839\u672c\u539f\u56e0\u3092\u8fc5\u901f\u306b\u7279\u5b9a\u3067\u304d\u307e\u3059\u3002"}),"\n"]}),"\n",(0,t.jsxs)(a.li,{children:["\n",(0,t.jsx)(a.p,{children:"\u76e3\u8996\u3068\u30a2\u30e9\u30fc\u30c8\uff1aCloudWatch Logs \u3092 Amazon CloudWatch \u306a\u3069\u306e\u4ed6\u306e AWS \u30b5\u30fc\u30d3\u30b9\u3068\u7d71\u5408\u3059\u308b\u3053\u3068\u3067\u3001\u30ed\u30b0\u30c7\u30fc\u30bf\u306b\u57fa\u3065\u3044\u3066\u30ab\u30b9\u30bf\u30e0\u30e1\u30c8\u30ea\u30af\u30b9\u3001\u30a2\u30e9\u30fc\u30e0\u3001\u30c8\u30ea\u30ac\u30fc\u3092\u8a2d\u5b9a\u3067\u304d\u307e\u3059\u3002\u3053\u306e\u7d71\u5408\u306b\u3088\u308a\u3001\u30d7\u30ed\u30a2\u30af\u30c6\u30a3\u30d6\u306a\u76e3\u8996\u3068\u30a2\u30e9\u30fc\u30c8\u304c\u53ef\u80fd\u306b\u306a\u308a\u3001\u91cd\u8981\u306a\u30a4\u30d9\u30f3\u30c8\u3084\u4e88\u671f\u305b\u306c\u52d5\u4f5c\u306e\u901a\u77e5\u3092\u78ba\u5b9f\u306b\u53d7\u3051\u53d6\u308b\u3053\u3068\u304c\u3067\u304d\u307e\u3059\u3002"}),"\n"]}),"\n",(0,t.jsxs)(a.li,{children:["\n",(0,t.jsx)(a.p,{children:"AWS \u30b5\u30fc\u30d3\u30b9\u3068\u306e\u7d71\u5408\uff1aCloudWatch Logs \u306f\u3001AWS Lambda Insights\u3001AWS X-Ray\u3001AWS CloudTrail \u306a\u3069\u306e\u4ed6\u306e AWS \u30b5\u30fc\u30d3\u30b9\u3068\u30b7\u30fc\u30e0\u30ec\u30b9\u306b\u7d71\u5408\u3055\u308c\u3001\u30ed\u30b0\u30c7\u30fc\u30bf\u3092\u30a2\u30d7\u30ea\u30b1\u30fc\u30b7\u30e7\u30f3\u30d1\u30d5\u30a9\u30fc\u30de\u30f3\u30b9\u30e1\u30c8\u30ea\u30af\u30b9\u3001\u5206\u6563\u30c8\u30ec\u30fc\u30b9\u3001\u30bb\u30ad\u30e5\u30ea\u30c6\u30a3\u76e3\u67fb\u3068\u76f8\u95a2\u4ed8\u3051\u308b\u3053\u3068\u304c\u3067\u304d\u3001\u30b5\u30fc\u30d0\u30fc\u30ec\u30b9\u30a2\u30d7\u30ea\u30b1\u30fc\u30b7\u30e7\u30f3\u306e\u5305\u62ec\u7684\u306a\u30d3\u30e5\u30fc\u3092\u63d0\u4f9b\u3057\u307e\u3059\u3002"}),"\n"]}),"\n"]}),"\n",(0,t.jsxs)(a.p,{children:[(0,t.jsx)(a.img,{alt:"Lambda logging",src:e(50326).A+"",width:"1052",height:"424"}),"\n",(0,t.jsx)(a.em,{children:"\u56f3 1\uff1aS3 \u304b\u3089\u306e\u30a4\u30d9\u30f3\u30c8\u304c AWS CloudWatch \u306b\u8a18\u9332\u3055\u308c\u308b Lambda \u306e\u30ed\u30b0\u8a18\u9332"})]}),"\n",(0,t.jsx)(a.p,{children:"CloudWatch Logs \u3067 Lambda \u306e\u30ed\u30b0\u8a18\u9332\u3092\u6d3b\u7528\u3059\u308b\u306b\u306f\u3001\u4ee5\u4e0b\u306e\u4e00\u822c\u7684\u306a\u624b\u9806\u306b\u5f93\u3046\u5fc5\u8981\u304c\u3042\u308a\u307e\u3059\uff1a"}),"\n",(0,t.jsxs)(a.ol,{children:["\n",(0,t.jsx)(a.li,{children:"\u9069\u5207\u306a\u30ed\u30b0\u30b0\u30eb\u30fc\u30d7\u3068\u30ed\u30b0\u30b9\u30c8\u30ea\u30fc\u30e0\u306e\u8a2d\u5b9a\u3092\u6307\u5b9a\u3057\u3066\u3001Lambda \u95a2\u6570\u304c CloudWatch Logs \u306b\u30ed\u30b0\u3092\u8a18\u9332\u3059\u308b\u3088\u3046\u306b\u8a2d\u5b9a\u3057\u307e\u3059\u3002"}),"\n",(0,t.jsx)(a.li,{children:"\u7d44\u7e54\u306e\u8981\u4ef6\u3068\u30b3\u30f3\u30d7\u30e9\u30a4\u30a2\u30f3\u30b9\u898f\u5236\u306b\u5f93\u3063\u3066\u30ed\u30b0\u4fdd\u6301\u30dd\u30ea\u30b7\u30fc\u3092\u5b9a\u7fa9\u3057\u307e\u3059\u3002"}),"\n",(0,t.jsx)(a.li,{children:"CloudWatch Logs Insights \u3092\u4f7f\u7528\u3057\u3066\u30ed\u30b0\u30c7\u30fc\u30bf\u3092\u5206\u6790\u304a\u3088\u3073\u30af\u30a8\u30ea\u3057\u3001\u30d1\u30bf\u30fc\u30f3\u3001\u50be\u5411\u3001\u6f5c\u5728\u7684\u306a\u554f\u984c\u3092\u7279\u5b9a\u3067\u304d\u308b\u3088\u3046\u306b\u3057\u307e\u3059\u3002"}),"\n",(0,t.jsx)(a.li,{children:"\u5fc5\u8981\u306b\u5fdc\u3058\u3066\u3001CloudWatch Logs \u3092 CloudWatch\u3001X-Ray\u3001CloudTrail \u306a\u3069\u306e\u4ed6\u306e AWS \u30b5\u30fc\u30d3\u30b9\u3068\u7d71\u5408\u3057\u3001\u76e3\u8996\u3001\u30c8\u30ec\u30fc\u30b9\u3001\u30bb\u30ad\u30e5\u30ea\u30c6\u30a3\u76e3\u67fb\u6a5f\u80fd\u3092\u5f37\u5316\u3057\u307e\u3059\u3002"}),"\n",(0,t.jsx)(a.li,{children:"\u30ed\u30b0\u30c7\u30fc\u30bf\u306b\u57fa\u3065\u3044\u3066\u30ab\u30b9\u30bf\u30e0\u30e1\u30c8\u30ea\u30af\u30b9\u3001\u30a2\u30e9\u30fc\u30e0\u3001\u901a\u77e5\u3092\u8a2d\u5b9a\u3057\u3001\u30d7\u30ed\u30a2\u30af\u30c6\u30a3\u30d6\u306a\u76e3\u8996\u3068\u30a2\u30e9\u30fc\u30c8\u3092\u53ef\u80fd\u306b\u3057\u307e\u3059\u3002"}),"\n"]}),"\n",(0,t.jsx)(a.p,{children:"CloudWatch Logs \u306f Lambda \u95a2\u6570\u306b\u5bfe\u3057\u3066\u5805\u7262\u306a\u30ed\u30b0\u8a18\u9332\u6a5f\u80fd\u3092\u63d0\u4f9b\u3057\u307e\u3059\u304c\u3001\u30ed\u30b0\u30c7\u30fc\u30bf\u306e\u91cf\u3068\u30b3\u30b9\u30c8\u7ba1\u7406\u306a\u3069\u306e\u6f5c\u5728\u7684\u306a\u8ab2\u984c\u3092\u8003\u616e\u3059\u308b\u3053\u3068\u304c\u91cd\u8981\u3067\u3059\u3002\u30b5\u30fc\u30d0\u30fc\u30ec\u30b9\u30a2\u30d7\u30ea\u30b1\u30fc\u30b7\u30e7\u30f3\u304c\u30b9\u30b1\u30fc\u30eb\u3059\u308b\u306b\u3064\u308c\u3066\u3001\u30ed\u30b0\u30c7\u30fc\u30bf\u306e\u91cf\u304c\u5927\u5e45\u306b\u5897\u52a0\u3057\u3001\u30d1\u30d5\u30a9\u30fc\u30de\u30f3\u30b9\u306b\u5f71\u97ff\u3092\u4e0e\u3048\u3001\u8ffd\u52a0\u30b3\u30b9\u30c8\u304c\u767a\u751f\u3059\u308b\u53ef\u80fd\u6027\u304c\u3042\u308a\u307e\u3059\u3002\u30ed\u30b0\u306e\u30ed\u30fc\u30c6\u30fc\u30b7\u30e7\u30f3\u3001\u5727\u7e2e\u3001\u4fdd\u6301\u30dd\u30ea\u30b7\u30fc\u3092\u5b9f\u88c5\u3059\u308b\u3053\u3068\u3067\u3001\u3053\u308c\u3089\u306e\u8ab2\u984c\u3092\u8efd\u6e1b\u3067\u304d\u307e\u3059\u3002"}),"\n",(0,t.jsx)(a.p,{children:"\u3055\u3089\u306b\u3001\u30ed\u30b0\u30c7\u30fc\u30bf\u3078\u306e\u9069\u5207\u306a\u30a2\u30af\u30bb\u30b9\u5236\u5fa1\u3068\u30c7\u30fc\u30bf\u30bb\u30ad\u30e5\u30ea\u30c6\u30a3\u306e\u78ba\u4fdd\u304c\u91cd\u8981\u3067\u3059\u3002CloudWatch Logs \u306f\u3001\u30ed\u30b0\u30c7\u30fc\u30bf\u306e\u6a5f\u5bc6\u6027\u3068\u6574\u5408\u6027\u3092\u4fdd\u8b77\u3059\u308b\u305f\u3081\u306e\u8a73\u7d30\u306a\u30a2\u30af\u30bb\u30b9\u5236\u5fa1\u30e1\u30ab\u30cb\u30ba\u30e0\u3068\u6697\u53f7\u5316\u6a5f\u80fd\u3092\u63d0\u4f9b\u3057\u307e\u3059\u3002"}),"\n",(0,t.jsx)(a.p,{children:"\u7d50\u8ad6\u3068\u3057\u3066\u3001Lambda \u95a2\u6570\u3092 CloudWatch Logs \u306b\u30ed\u30b0\u3092\u8a18\u9332\u3059\u308b\u3088\u3046\u306b\u8a2d\u5b9a\u3059\u308b\u3053\u3068\u306f\u3001\u30b5\u30fc\u30d0\u30fc\u30ec\u30b9\u30a2\u30d7\u30ea\u30b1\u30fc\u30b7\u30e7\u30f3\u3067\u30aa\u30d6\u30b6\u30fc\u30d0\u30d3\u30ea\u30c6\u30a3\u3092\u78ba\u4fdd\u3059\u308b\u305f\u3081\u306e\u57fa\u672c\u7684\u306a\u5b9f\u8df5\u3067\u3059\u3002\u30ed\u30b0\u30c7\u30fc\u30bf\u3092\u4e00\u5143\u5316\u3057\u3066\u5206\u6790\u3059\u308b\u3053\u3068\u3067\u3001\u4fa1\u5024\u306e\u3042\u308b\u6d1e\u5bdf\u3092\u5f97\u3066\u3001\u30c8\u30e9\u30d6\u30eb\u30b7\u30e5\u30fc\u30c6\u30a3\u30f3\u30b0\u30d7\u30ed\u30bb\u30b9\u3092\u52b9\u7387\u5316\u3057\u3001\u5805\u7262\u3067\u5b89\u5168\u306a\u30b5\u30fc\u30d0\u30fc\u30ec\u30b9\u30a4\u30f3\u30d5\u30e9\u30b9\u30c8\u30e9\u30af\u30c1\u30e3\u3092\u7dad\u6301\u3059\u308b\u3053\u3068\u304c\u3067\u304d\u307e\u3059\u3002CloudWatch Logs \u3068\u4ed6\u306e AWS \u30b5\u30fc\u30d3\u30b9\u306e\u7d71\u5408\u306b\u3088\u308a\u3001\u9ad8\u5ea6\u306a\u76e3\u8996\u3001\u30c8\u30ec\u30fc\u30b9\u3001\u30bb\u30ad\u30e5\u30ea\u30c6\u30a3\u6a5f\u80fd\u3092\u6d3b\u7528\u3067\u304d\u3001\u9ad8\u5ea6\u306b\u89b3\u6e2c\u53ef\u80fd\u3067\u4fe1\u983c\u6027\u306e\u9ad8\u3044\u30b5\u30fc\u30d0\u30fc\u30ec\u30b9\u30a2\u30d7\u30ea\u30b1\u30fc\u30b7\u30e7\u30f3\u3092\u69cb\u7bc9\u30fb\u7dad\u6301\u3059\u308b\u3053\u3068\u304c\u3067\u304d\u307e\u3059\u3002"})]})}function h(n={}){const{wrapper:a}={...(0,l.R)(),...n.components};return a?(0,t.jsx)(a,{...n,children:(0,t.jsx)(r,{...n})}):r(n)}}}]);
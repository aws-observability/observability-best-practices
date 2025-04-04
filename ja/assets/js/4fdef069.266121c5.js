"use strict";(self.webpackChunkobservability_best_practices=self.webpackChunkobservability_best_practices||[]).push([[325],{28453:(e,n,s)=>{s.d(n,{R:()=>c,x:()=>l});var i=s(96540);const r={},t=i.createContext(r);function c(e){const n=i.useContext(t);return i.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function l(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(r):e.components||r:c(e.components),i.createElement(t.Provider,{value:n},e.children)}},65508:(e,n,s)=>{s.r(n),s.d(n,{assets:()=>a,contentTitle:()=>l,default:()=>h,frontMatter:()=>c,metadata:()=>i,toc:()=>d});const i=JSON.parse('{"id":"signals/metrics","title":"\u30e1\u30c8\u30ea\u30af\u30b9","description":"\u30e1\u30c8\u30ea\u30af\u30b9\u306f\u3001\u4f5c\u6210\u3055\u308c\u305f\u6642\u9593\u9806\u306b\u4fdd\u6301\u3055\u308c\u308b\u4e00\u9023\u306e\u6570\u5024\u30c7\u30fc\u30bf\u3067\u3059\u3002\u74b0\u5883\u5185\u306e\u30b5\u30fc\u30d0\u30fc\u6570\u3001\u30c7\u30a3\u30b9\u30af\u4f7f\u7528\u91cf\u30011 \u79d2\u3042\u305f\u308a\u306e\u30ea\u30af\u30a8\u30b9\u30c8\u6570\u3001\u30ea\u30af\u30a8\u30b9\u30c8\u306e\u5b8c\u4e86\u307e\u3067\u306e\u30ec\u30a4\u30c6\u30f3\u30b7\u30fc\u306a\u3069\u3001\u3042\u3089\u3086\u308b\u3082\u306e\u3092\u8ffd\u8de1\u3059\u308b\u305f\u3081\u306b\u4f7f\u7528\u3055\u308c\u307e\u3059\u3002","source":"@site/i18n/ja/docusaurus-plugin-content-docs/current/signals/metrics.md","sourceDirName":"signals","slug":"/signals/metrics","permalink":"/observability-best-practices/ja/signals/metrics","draft":false,"unlisted":false,"editUrl":"https://github.com/aws-observability/observability-best-practices/blob/main/docusaurus/docs/signals/metrics.md","tags":[],"version":"current","frontMatter":{},"sidebar":"sigals","previous":{"title":"\u30ed\u30b0","permalink":"/observability-best-practices/ja/signals/logs"},"next":{"title":"\u30c8\u30ec\u30fc\u30b9","permalink":"/observability-best-practices/ja/signals/traces"}}');var r=s(74848),t=s(28453);const c={},l="\u30e1\u30c8\u30ea\u30af\u30b9",a={},d=[{value:"KPI (\u91cd\u8981\u696d\u7e3e\u8a55\u4fa1\u6307\u6a19) \u3092\u628a\u63e1\u3057\u3001\u6e2c\u5b9a\u3057\u307e\u3057\u3087\u3046\uff01",id:"kpi-\u91cd\u8981\u696d\u7e3e\u8a55\u4fa1\u6307\u6a19-\u3092\u628a\u63e1\u3057\u6e2c\u5b9a\u3057\u307e\u3057\u3087\u3046",level:2},{value:"\u904b\u7528\u30e1\u30c8\u30ea\u30af\u30b9\u30c7\u30fc\u30bf\u3068\u306e\u76f8\u95a2\u95a2\u4fc2",id:"\u904b\u7528\u30e1\u30c8\u30ea\u30af\u30b9\u30c7\u30fc\u30bf\u3068\u306e\u76f8\u95a2\u95a2\u4fc2",level:2},{value:"\u6b63\u5e38\u306a\u72b6\u614b\u3092\u628a\u63e1\u3057\u307e\u3057\u3087\u3046\uff01",id:"\u6b63\u5e38\u306a\u72b6\u614b\u3092\u628a\u63e1\u3057\u307e\u3057\u3087\u3046",level:2},{value:"\u7570\u5e38\u691c\u77e5\u30a2\u30eb\u30b4\u30ea\u30ba\u30e0\u3092\u4f7f\u7528\u3059\u308b",id:"\u7570\u5e38\u691c\u77e5\u30a2\u30eb\u30b4\u30ea\u30ba\u30e0\u3092\u4f7f\u7528\u3059\u308b",level:2}];function o(e){const n={a:"a",admonition:"admonition",em:"em",h1:"h1",h2:"h2",header:"header",p:"p",...(0,t.R)(),...e.components};return(0,r.jsxs)(r.Fragment,{children:[(0,r.jsx)(n.header,{children:(0,r.jsx)(n.h1,{id:"\u30e1\u30c8\u30ea\u30af\u30b9",children:"\u30e1\u30c8\u30ea\u30af\u30b9"})}),"\n",(0,r.jsx)(n.p,{children:"\u30e1\u30c8\u30ea\u30af\u30b9\u306f\u3001\u4f5c\u6210\u3055\u308c\u305f\u6642\u9593\u9806\u306b\u4fdd\u6301\u3055\u308c\u308b\u4e00\u9023\u306e\u6570\u5024\u30c7\u30fc\u30bf\u3067\u3059\u3002\u74b0\u5883\u5185\u306e\u30b5\u30fc\u30d0\u30fc\u6570\u3001\u30c7\u30a3\u30b9\u30af\u4f7f\u7528\u91cf\u30011 \u79d2\u3042\u305f\u308a\u306e\u30ea\u30af\u30a8\u30b9\u30c8\u6570\u3001\u30ea\u30af\u30a8\u30b9\u30c8\u306e\u5b8c\u4e86\u307e\u3067\u306e\u30ec\u30a4\u30c6\u30f3\u30b7\u30fc\u306a\u3069\u3001\u3042\u3089\u3086\u308b\u3082\u306e\u3092\u8ffd\u8de1\u3059\u308b\u305f\u3081\u306b\u4f7f\u7528\u3055\u308c\u307e\u3059\u3002"}),"\n",(0,r.jsx)(n.p,{children:"\u3057\u304b\u3057\u3001\u30e1\u30c8\u30ea\u30af\u30b9\u306f\u30a4\u30f3\u30d5\u30e9\u30b9\u30c8\u30e9\u30af\u30c1\u30e3\u3084\u30a2\u30d7\u30ea\u30b1\u30fc\u30b7\u30e7\u30f3\u306e\u76e3\u8996\u306b\u9650\u5b9a\u3055\u308c\u308b\u3082\u306e\u3067\u306f\u3042\u308a\u307e\u305b\u3093\u3002\u3080\u3057\u308d\u3001\u3042\u3089\u3086\u308b\u7a2e\u985e\u306e\u30d3\u30b8\u30cd\u30b9\u3084\u30ef\u30fc\u30af\u30ed\u30fc\u30c9\u3067\u3001\u58f2\u4e0a\u3001\u30b3\u30fc\u30eb\u30ad\u30e5\u30fc\u3001\u9867\u5ba2\u6e80\u8db3\u5ea6\u306a\u3069\u3092\u8ffd\u8de1\u3059\u308b\u305f\u3081\u306b\u4f7f\u7528\u3067\u304d\u307e\u3059\u3002\u5b9f\u969b\u3001\u30e1\u30c8\u30ea\u30af\u30b9\u306f\u904b\u7528\u30c7\u30fc\u30bf\u3068\u30d3\u30b8\u30cd\u30b9\u30e1\u30c8\u30ea\u30af\u30b9\u306e\u4e21\u65b9\u3092\u7d44\u307f\u5408\u308f\u305b\u308b\u3053\u3068\u3067\u6700\u3082\u6709\u7528\u3068\u306a\u308a\u3001\u30b7\u30b9\u30c6\u30e0\u306e\u5305\u62ec\u7684\u306a\u53ef\u8996\u5316\u3092\u5b9f\u73fe\u3057\u307e\u3059\u3002"}),"\n",(0,r.jsxs)(n.p,{children:["\u30e1\u30c8\u30ea\u30af\u30b9\u306b\u95a2\u3059\u308b\u8ffd\u52a0\u306e\u30b3\u30f3\u30c6\u30ad\u30b9\u30c8\u3092\u63d0\u4f9b\u3057\u3066\u3044\u308b ",(0,r.jsx)(n.a,{href:"https://opentelemetry.io/docs/concepts/signals/metrics/",children:"OpenTelemetry \u306e\u30c9\u30ad\u30e5\u30e1\u30f3\u30c8\u30da\u30fc\u30b8"})," \u3092\u53c2\u7167\u3059\u308b\u3053\u3068\u3092\u304a\u52e7\u3081\u3057\u307e\u3059\u3002"]}),"\n",(0,r.jsx)(n.h2,{id:"kpi-\u91cd\u8981\u696d\u7e3e\u8a55\u4fa1\u6307\u6a19-\u3092\u628a\u63e1\u3057\u6e2c\u5b9a\u3057\u307e\u3057\u3087\u3046",children:"KPI (\u91cd\u8981\u696d\u7e3e\u8a55\u4fa1\u6307\u6a19) \u3092\u628a\u63e1\u3057\u3001\u6e2c\u5b9a\u3057\u307e\u3057\u3087\u3046\uff01"}),"\n",(0,r.jsxs)(n.p,{children:["\u30e1\u30c8\u30ea\u30af\u30b9\u306b\u304a\u3044\u3066 ",(0,r.jsx)(n.em,{children:"\u6700\u3082"})," \u91cd\u8981\u306a\u3053\u3068\u306f\u3001",(0,r.jsx)(n.em,{children:"\u9069\u5207\u306a\u3082\u306e\u3092\u6e2c\u5b9a\u3059\u308b"})," \u3053\u3068\u3067\u3059\u3002\u305d\u308c\u306f\u8ab0\u306b\u3068\u3063\u3066\u3082\u7570\u306a\u308a\u307e\u3059\u3002E \u30b3\u30de\u30fc\u30b9\u30a2\u30d7\u30ea\u30b1\u30fc\u30b7\u30e7\u30f3\u3067\u306f 1 \u6642\u9593\u3042\u305f\u308a\u306e\u58f2\u4e0a\u304c\u91cd\u8981\u306a KPI \u3068\u306a\u308b\u53ef\u80fd\u6027\u304c\u3042\u308a\u307e\u3059\u304c\u3001\u30d1\u30f3\u5c4b\u3067\u306f 1 \u65e5\u3042\u305f\u308a\u306e\u30af\u30ed\u30ef\u30c3\u30b5\u30f3\u306e\u751f\u7523\u6570\u306b\u95a2\u5fc3\u304c\u3042\u308b\u304b\u3082\u3057\u308c\u307e\u305b\u3093\u3002"]}),"\n",(0,r.jsx)(n.admonition,{type:"warning",children:(0,r.jsxs)(n.p,{children:["\u30d3\u30b8\u30cd\u30b9 KPI \u306e\u5b8c\u5168\u3067\u5305\u62ec\u7684\u306a\u5358\u4e00\u306e\u30bd\u30fc\u30b9\u306f\u5b58\u5728\u3057\u307e\u305b\u3093\u3002\u30d7\u30ed\u30b8\u30a7\u30af\u30c8\u3084\u30a2\u30d7\u30ea\u30b1\u30fc\u30b7\u30e7\u30f3\u3092\u5341\u5206\u306b\u7406\u89e3\u3057\u3001",(0,r.jsx)(n.em,{children:"\u76ee\u6a19\u3068\u3059\u308b\u6210\u679c"})," \u3092\u628a\u63e1\u3059\u308b\u5fc5\u8981\u304c\u3042\u308a\u307e\u3059\u3002"]})}),"\n",(0,r.jsxs)(n.p,{children:["\u6700\u521d\u306e\u30b9\u30c6\u30c3\u30d7\u306f\u3001\u9ad8\u30ec\u30d9\u30eb\u306e\u76ee\u6a19\u3092\u5b9a\u7fa9\u3059\u308b\u3053\u3068\u3067\u3059\u3002\u305d\u3057\u3066\u307b\u3068\u3093\u3069\u306e\u5834\u5408\u3001\u3053\u308c\u3089\u306e\u76ee\u6a19\u306f\u30a4\u30f3\u30d5\u30e9\u30b9\u30c8\u30e9\u30af\u30c1\u30e3\u3060\u3051\u304b\u3089\u5f97\u3089\u308c\u308b\u5358\u4e00\u306e\u30e1\u30c8\u30ea\u30af\u30b9\u3068\u3057\u3066\u306f\u8868\u73fe\u3055\u308c\u307e\u305b\u3093\u3002\u4e0a\u8a18\u306e E \u30b3\u30de\u30fc\u30b9\u306e\u4f8b\u3067\u306f\u3001",(0,r.jsx)(n.em,{children:"1 \u6642\u9593\u3042\u305f\u308a\u306e\u58f2\u4e0a"})," \u3092\u6e2c\u5b9a\u3059\u308b\u3068\u3044\u3046 ",(0,r.jsx)(n.em,{children:"\u30e1\u30bf"})," \u76ee\u6a19\u3092\u7279\u5b9a\u3057\u305f\u3089\u3001\u5546\u54c1\u8cfc\u5165\u524d\u306e\u691c\u7d22\u6642\u9593\u3001\u30c1\u30a7\u30c3\u30af\u30a2\u30a6\u30c8\u30d7\u30ed\u30bb\u30b9\u306e\u5b8c\u4e86\u6642\u9593\u3001\u5546\u54c1\u691c\u7d22\u7d50\u679c\u306e\u30ec\u30a4\u30c6\u30f3\u30b7\u30fc\u306a\u3069\u306e\u8a73\u7d30\u306a\u30e1\u30c8\u30ea\u30af\u30b9\u306b\u9061\u308b\u3053\u3068\u304c\u3067\u304d\u307e\u3059\u3002\u3053\u308c\u306b\u3088\u308a\u3001\u30b7\u30b9\u30c6\u30e0\u3092\u89b3\u5bdf\u3059\u308b\u305f\u3081\u306b\u95a2\u9023\u60c5\u5831\u3092\u610f\u56f3\u7684\u306b\u53ce\u96c6\u3059\u308b\u3053\u3068\u304c\u3067\u304d\u307e\u3059\u3002"]}),"\n",(0,r.jsx)(n.admonition,{type:"info",children:(0,r.jsxs)(n.p,{children:["KPI \u3092\u7279\u5b9a\u3057\u305f\u3089\u3001\u30ef\u30fc\u30af\u30ed\u30fc\u30c9\u306e\u3069\u306e\u30e1\u30c8\u30ea\u30af\u30b9\u304c\u305d\u308c\u3089\u306b\u5f71\u97ff\u3092\u4e0e\u3048\u308b\u304b\u3092 ",(0,r.jsx)(n.em,{children:"Working Backwards"})," \u3067\u78ba\u8a8d\u3067\u304d\u307e\u3059\u3002"]})}),"\n",(0,r.jsx)(n.h2,{id:"\u904b\u7528\u30e1\u30c8\u30ea\u30af\u30b9\u30c7\u30fc\u30bf\u3068\u306e\u76f8\u95a2\u95a2\u4fc2",children:"\u904b\u7528\u30e1\u30c8\u30ea\u30af\u30b9\u30c7\u30fc\u30bf\u3068\u306e\u76f8\u95a2\u95a2\u4fc2"}),"\n",(0,r.jsxs)(n.p,{children:["Web \u30b5\u30fc\u30d0\u30fc\u306e CPU \u4f7f\u7528\u7387\u304c\u9ad8\u304f\u306a\u308b\u3068\u5fdc\u7b54\u6642\u9593\u304c\u9045\u304f\u306a\u308a\u3001\u305d\u306e\u7d50\u679c\u3001\u9867\u5ba2\u306e\u4e0d\u6e80\u304c\u9ad8\u307e\u308a\u3001\u6700\u7d42\u7684\u306b\u53ce\u76ca\u304c\u4f4e\u4e0b\u3059\u308b\u5834\u5408\u3001CPU \u4f7f\u7528\u7387\u306e\u6e2c\u5b9a\u306f\u30d3\u30b8\u30cd\u30b9\u306e\u6210\u679c\u306b\u76f4\u63a5\u5f71\u97ff\u3092\u4e0e\u3048\u308b\u305f\u3081\u3001",(0,r.jsx)(n.em,{children:"\u7d76\u5bfe\u306b"})," \u6e2c\u5b9a\u3059\u308b\u5fc5\u8981\u304c\u3042\u308a\u307e\u3059\uff01"]}),"\n",(0,r.jsxs)(n.p,{children:["\u9006\u306b\u3001\u30a8\u30d5\u30a7\u30e1\u30e9\u30eb\u306a\u30af\u30e9\u30a6\u30c9\u30ea\u30bd\u30fc\u30b9\uff08Amazon EC2 \u30d5\u30ea\u30fc\u30c8\u3084\u3001\u4ed6\u306e\u30af\u30e9\u30a6\u30c9\u30d7\u30ed\u30d0\u30a4\u30c0\u30fc\u74b0\u5883\u306e\u540c\u69d8\u306e\u30ea\u30bd\u30fc\u30b9\uff09\u3067\u30d0\u30c3\u30c1\u51e6\u7406\u3092\u5b9f\u884c\u3059\u308b\u30a2\u30d7\u30ea\u30b1\u30fc\u30b7\u30e7\u30f3\u304c\u3042\u308b\u5834\u5408\u3001\u30d0\u30c3\u30c1\u3092\u6700\u3082\u8cbb\u7528\u5bfe\u52b9\u679c\u306e\u9ad8\u3044\u65b9\u6cd5\u3067\u5b8c\u4e86\u3059\u308b\u305f\u3081\u306b\u3001CPU \u3092\u53ef\u80fd\u306a\u9650\u308a\u4f7f\u7528\u3059\u308b\u3053\u3068\u3092 ",(0,r.jsx)(n.em,{children:"\u671b\u3080"})," \u304b\u3082\u3057\u308c\u307e\u305b\u3093\u3002"]}),"\n",(0,r.jsx)(n.p,{children:"\u3044\u305a\u308c\u306e\u5834\u5408\u3082\u3001\u904b\u7528\u30c7\u30fc\u30bf\uff08CPU \u4f7f\u7528\u7387\u306a\u3069\uff09\u3068\u30d3\u30b8\u30cd\u30b9\u30e1\u30c8\u30ea\u30af\u30b9\u3092\u540c\u3058\u30b7\u30b9\u30c6\u30e0\u306b\u4fdd\u5b58\u3057\u3001\u4e21\u8005\u306e\u76f8\u95a2\u95a2\u4fc2\u3092\u5206\u6790\u3059\u308b\u5fc5\u8981\u304c\u3042\u308a\u307e\u3059\u3002"}),"\n",(0,r.jsx)(n.admonition,{type:"info",children:(0,r.jsx)(n.p,{children:"\u30d3\u30b8\u30cd\u30b9\u30e1\u30c8\u30ea\u30af\u30b9\u3068\u904b\u7528\u30e1\u30c8\u30ea\u30af\u30b9\u3092\u540c\u3058\u30b7\u30b9\u30c6\u30e0\u306b\u4fdd\u5b58\u3057\u3001\u4e21\u8005\u3078\u306e\u5f71\u97ff\u3092\u89b3\u5bdf\u3057\u3066\u7d50\u8ad6\u3092\u5c0e\u304d\u51fa\u305b\u308b\u3088\u3046\u306b\u3057\u307e\u3057\u3087\u3046\u3002"})}),"\n",(0,r.jsx)(n.h2,{id:"\u6b63\u5e38\u306a\u72b6\u614b\u3092\u628a\u63e1\u3057\u307e\u3057\u3087\u3046",children:"\u6b63\u5e38\u306a\u72b6\u614b\u3092\u628a\u63e1\u3057\u307e\u3057\u3087\u3046\uff01"}),"\n",(0,r.jsx)(n.p,{children:"\u6b63\u5e38\u306a\u30d9\u30fc\u30b9\u30e9\u30a4\u30f3\u3092\u7406\u89e3\u3059\u308b\u3053\u3068\u306f\u96e3\u3057\u3044\u5834\u5408\u304c\u3042\u308a\u307e\u3059\u3002\u591a\u304f\u306e\u4eba\u306f\u3001\u6b63\u5e38\u306a\u30e1\u30c8\u30ea\u30af\u30b9\u304c\u3069\u306e\u3088\u3046\u306a\u3082\u306e\u304b\u3092\u7406\u89e3\u3059\u308b\u305f\u3081\u306b\u3001\u30ef\u30fc\u30af\u30ed\u30fc\u30c9\u306b\u30b9\u30c8\u30ec\u30b9\u30c6\u30b9\u30c8\u3092\u5b9f\u65bd\u3059\u308b\u5fc5\u8981\u304c\u3042\u308a\u307e\u3059\u3002\u3057\u304b\u3057\u3001\u30cb\u30fc\u30ba\u306b\u5fdc\u3058\u3066\u3001\u65e2\u5b58\u306e\u904b\u7528\u30e1\u30c8\u30ea\u30af\u30b9\u3092\u89b3\u5bdf\u3059\u308b\u3053\u3068\u3067\u3001\u6b63\u5e38\u306a\u3057\u304d\u3044\u5024\u306b\u3064\u3044\u3066\u5b89\u5168\u306a\u7d50\u8ad6\u3092\u5c0e\u304d\u51fa\u3059\u3053\u3068\u304c\u3067\u304d\u308b\u5834\u5408\u3082\u3042\u308a\u307e\u3059\u3002"}),"\n",(0,r.jsx)(n.p,{children:"\u6b63\u5e38\u306a\u30ef\u30fc\u30af\u30ed\u30fc\u30c9\u3068\u306f\u3001KPI \u306e\u76ee\u6a19\u3092\u9054\u6210\u3057\u306a\u304c\u3089\u3001\u56de\u5fa9\u529b\u3001\u53ef\u7528\u6027\u3001\u30b3\u30b9\u30c8\u52b9\u7387\u306e\u30d0\u30e9\u30f3\u30b9\u304c\u53d6\u308c\u3066\u3044\u308b\u3082\u306e\u3067\u3059\u3002"}),"\n",(0,r.jsx)(n.admonition,{type:"info",children:(0,r.jsxs)(n.p,{children:["\u30d1\u30d5\u30a9\u30fc\u30de\u30f3\u30b9\u304c\u8981\u6c42\u3055\u308c\u308b\u6c34\u6e96\u3092\u4e0b\u56de\u308b\u304b\u4e0a\u56de\u3063\u305f\u5834\u5408\u306b",(0,r.jsx)(n.a,{href:"../signals/alarms/",children:"\u30a2\u30e9\u30fc\u30e0"}),"\u3092\u4f5c\u6210\u3067\u304d\u308b\u3088\u3046\u3001KPI \u306b\u306f\u5fc5\u305a\u6b63\u5e38\u306a\u7bc4\u56f2\u3092\u7279\u5b9a\u3057\u3066\u304a\u304f",(0,r.jsx)(n.em,{children:"\u5fc5\u8981\u304c\u3042\u308a\u307e\u3059"}),"\u3002"]})}),"\n",(0,r.jsx)(n.h2,{id:"\u7570\u5e38\u691c\u77e5\u30a2\u30eb\u30b4\u30ea\u30ba\u30e0\u3092\u4f7f\u7528\u3059\u308b",children:"\u7570\u5e38\u691c\u77e5\u30a2\u30eb\u30b4\u30ea\u30ba\u30e0\u3092\u4f7f\u7528\u3059\u308b"}),"\n",(0,r.jsxs)(n.p,{children:[(0,r.jsx)(n.a,{href:"#know-what-good-looks-like",children:"\u6b63\u5e38\u306a\u72b6\u614b\u3092\u628a\u63e1\u3059\u308b\u3053\u3068"})," \u306e\u8ab2\u984c\u306f\u3001\u30b7\u30b9\u30c6\u30e0\u5185\u306e ",(0,r.jsx)(n.em,{children:"\u3059\u3079\u3066\u306e"})," \u30e1\u30c8\u30ea\u30af\u30b9\u306b\u3064\u3044\u3066\u6b63\u5e38\u306a\u95be\u5024\u3092\u628a\u63e1\u3059\u308b\u3053\u3068\u304c\u73fe\u5b9f\u7684\u3067\u306f\u306a\u3044\u5834\u5408\u304c\u3042\u308b\u3053\u3068\u3067\u3059\u3002\n\u30ea\u30ec\u30fc\u30b7\u30e7\u30ca\u30eb\u30c7\u30fc\u30bf\u30d9\u30fc\u30b9\u7ba1\u7406\u30b7\u30b9\u30c6\u30e0 (RDBMS) \u306f\u6570\u5341\u306e\u30d1\u30d5\u30a9\u30fc\u30de\u30f3\u30b9\u30e1\u30c8\u30ea\u30af\u30b9\u3092\u51fa\u529b\u3059\u308b\u3053\u3068\u304c\u3067\u304d\u3001\u30de\u30a4\u30af\u30ed\u30b5\u30fc\u30d3\u30b9\u30a2\u30fc\u30ad\u30c6\u30af\u30c1\u30e3\u3068\u7d44\u307f\u5408\u308f\u305b\u308b\u3068\u3001KPI \u306b\u5f71\u97ff\u3092\u4e0e\u3048\u308b\u53ef\u80fd\u6027\u306e\u3042\u308b\u30e1\u30c8\u30ea\u30af\u30b9\u304c\u6570\u767e\u306b\u53ca\u3076\u53ef\u80fd\u6027\u304c\u3042\u308a\u307e\u3059\u3002"]}),"\n",(0,r.jsxs)(n.p,{children:["\u3053\u306e\u3088\u3046\u306a\u5927\u91cf\u306e\u30c7\u30fc\u30bf\u30dd\u30a4\u30f3\u30c8\u3092\u76e3\u8996\u3057\u3001\u500b\u3005\u306e\u4e0a\u9650\u3068\u4e0b\u9650\u306e\u95be\u5024\u3092\u7279\u5b9a\u3059\u308b\u3053\u3068\u306f\u3001\u4eba\u9593\u304c\u884c\u3046\u306b\u306f\u5fc5\u305a\u3057\u3082\u73fe\u5b9f\u7684\u3067\u306f\u3042\u308a\u307e\u305b\u3093\u3002\n\u3057\u304b\u3057\u3001\u6a5f\u68b0\u5b66\u7fd2\u306f\u3053\u306e\u3088\u3046\u306a\u53cd\u5fa9\u7684\u306a\u30bf\u30b9\u30af\u304c ",(0,r.jsx)(n.em,{children:"\u975e\u5e38\u306b"})," \u5f97\u610f\u3067\u3059\u3002\n\u81ea\u52d5\u5316\u3068\u6a5f\u68b0\u5b66\u7fd2\u306f\u3001\u6c17\u4ed8\u304b\u306a\u304b\u3063\u305f\u554f\u984c\u3092\u7279\u5b9a\u3059\u308b\u306e\u306b\u5f79\u7acb\u3064\u305f\u3081\u3001\u53ef\u80fd\u306a\u9650\u308a\u6d3b\u7528\u3057\u3066\u304f\u3060\u3055\u3044\uff01"]}),"\n",(0,r.jsx)(n.admonition,{type:"info",children:(0,r.jsx)(n.p,{children:"\u6a5f\u68b0\u5b66\u7fd2\u30a2\u30eb\u30b4\u30ea\u30ba\u30e0\u3068\u7570\u5e38\u691c\u77e5\u30e2\u30c7\u30eb\u3092\u4f7f\u7528\u3057\u3066\u3001\u30ef\u30fc\u30af\u30ed\u30fc\u30c9\u306e\u30d1\u30d5\u30a9\u30fc\u30de\u30f3\u30b9\u306e\u95be\u5024\u3092\u81ea\u52d5\u7684\u306b\u8a08\u7b97\u3057\u307e\u3059\u3002"})})]})}function h(e={}){const{wrapper:n}={...(0,t.R)(),...e.components};return n?(0,r.jsx)(n,{...e,children:(0,r.jsx)(o,{...e})}):o(e)}}}]);
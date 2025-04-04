"use strict";(self.webpackChunkobservability_best_practices=self.webpackChunkobservability_best_practices||[]).push([[1468],{28453:(e,s,t)=>{t.d(s,{R:()=>d,x:()=>a});var n=t(96540);const i={},r=n.createContext(i);function d(e){const s=n.useContext(r);return n.useMemo((function(){return"function"==typeof e?e(s):{...s,...e}}),[s,e])}function a(e){let s;return s=e.disableParentContext?"function"==typeof e.components?e.components(i):e.components||i:d(e.components),n.createElement(r.Provider,{value:s},e.children)}},32991:(e,s,t)=>{t.r(s),t.d(s,{assets:()=>l,contentTitle:()=>a,default:()=>u,frontMatter:()=>d,metadata:()=>n,toc:()=>c});const n=JSON.parse('{"id":"guides/dashboards","title":"\u30c0\u30c3\u30b7\u30e5\u30dc\u30fc\u30c9\u4f5c\u6210","description":"\u30d9\u30b9\u30c8 \u30d7\u30e9\u30af\u30c6\u30a3\u30b9","source":"@site/i18n/ja/docusaurus-plugin-content-docs/current/guides/dashboards.md","sourceDirName":"guides","slug":"/guides/dashboards","permalink":"/observability-best-practices/ja/guides/dashboards","draft":false,"unlisted":false,"editUrl":"https://github.com/aws-observability/observability-best-practices/blob/main/docusaurus/docs/guides/dashboards.md","tags":[],"version":"current","frontMatter":{}}');var i=t(74848),r=t(28453);const d={},a="\u30c0\u30c3\u30b7\u30e5\u30dc\u30fc\u30c9\u4f5c\u6210",l={},c=[{value:"\u30d9\u30b9\u30c8 \u30d7\u30e9\u30af\u30c6\u30a3\u30b9",id:"\u30d9\u30b9\u30c8-\u30d7\u30e9\u30af\u30c6\u30a3\u30b9",level:2},{value:"\u91cd\u8981\u306a\u30da\u30eb\u30bd\u30ca\u5411\u3051\u306e\u30d3\u30e5\u30fc\u3092\u4f5c\u6210\u3059\u308b",id:"\u91cd\u8981\u306a\u30da\u30eb\u30bd\u30ca\u5411\u3051\u306e\u30d3\u30e5\u30fc\u3092\u4f5c\u6210\u3059\u308b",level:3},{value:"\u30d3\u30b8\u30cd\u30b9\u30e1\u30c8\u30ea\u30af\u30b9\u3092\u30aa\u30da\u30ec\u30fc\u30b7\u30e7\u30ca\u30eb\u30e1\u30c8\u30ea\u30af\u30b9\u3068\u5171\u306b\u5171\u6709\u3059\u308b",id:"\u30d3\u30b8\u30cd\u30b9\u30e1\u30c8\u30ea\u30af\u30b9\u3092\u30aa\u30da\u30ec\u30fc\u30b7\u30e7\u30ca\u30eb\u30e1\u30c8\u30ea\u30af\u30b9\u3068\u5171\u306b\u5171\u6709\u3059\u308b",level:3},{value:"\u30c0\u30c3\u30b7\u30e5\u30dc\u30fc\u30c9\u306f\u58c1\u3067\u306f\u306a\u304f\u3001\u6a4b\u3092\u7bc9\u304f\u3079\u304d",id:"\u30c0\u30c3\u30b7\u30e5\u30dc\u30fc\u30c9\u306f\u58c1\u3067\u306f\u306a\u304f\u6a4b\u3092\u7bc9\u304f\u3079\u304d",level:3},{value:"\u30c0\u30c3\u30b7\u30e5\u30dc\u30fc\u30c9\u306f\u30b9\u30c8\u30fc\u30ea\u30fc\u3092\u8a9e\u308b\u3079\u304d",id:"\u30c0\u30c3\u30b7\u30e5\u30dc\u30fc\u30c9\u306f\u30b9\u30c8\u30fc\u30ea\u30fc\u3092\u8a9e\u308b\u3079\u304d",level:3},{value:"\u30c0\u30c3\u30b7\u30e5\u30dc\u30fc\u30c9\u306f\u6280\u8853\u8005\u3068\u975e\u6280\u8853\u8005\u306e\u4e21\u65b9\u304c\u5229\u7528\u3067\u304d\u308b\u3088\u3046\u306b\u3059\u308b\u5fc5\u8981\u304c\u3042\u308a\u307e\u3059",id:"\u30c0\u30c3\u30b7\u30e5\u30dc\u30fc\u30c9\u306f\u6280\u8853\u8005\u3068\u975e\u6280\u8853\u8005\u306e\u4e21\u65b9\u304c\u5229\u7528\u3067\u304d\u308b\u3088\u3046\u306b\u3059\u308b\u5fc5\u8981\u304c\u3042\u308a\u307e\u3059",level:3},{value:"\u63a8\u5968\u4e8b\u9805",id:"\u63a8\u5968\u4e8b\u9805",level:2},{value:"\u65e2\u5b58\u306e ID \u30d7\u30ed\u30d0\u30a4\u30c0\u30fc\u306e\u6d3b\u7528",id:"\u65e2\u5b58\u306e-id-\u30d7\u30ed\u30d0\u30a4\u30c0\u30fc\u306e\u6d3b\u7528",level:3}];function o(e){const s={h1:"h1",h2:"h2",h3:"h3",header:"header",...(0,r.R)(),...e.components};return(0,i.jsxs)(i.Fragment,{children:[(0,i.jsx)(s.header,{children:(0,i.jsx)(s.h1,{id:"\u30c0\u30c3\u30b7\u30e5\u30dc\u30fc\u30c9\u4f5c\u6210",children:"\u30c0\u30c3\u30b7\u30e5\u30dc\u30fc\u30c9\u4f5c\u6210"})}),"\n",(0,i.jsx)(s.h2,{id:"\u30d9\u30b9\u30c8-\u30d7\u30e9\u30af\u30c6\u30a3\u30b9",children:"\u30d9\u30b9\u30c8 \u30d7\u30e9\u30af\u30c6\u30a3\u30b9"}),"\n",(0,i.jsx)(s.h3,{id:"\u91cd\u8981\u306a\u30da\u30eb\u30bd\u30ca\u5411\u3051\u306e\u30d3\u30e5\u30fc\u3092\u4f5c\u6210\u3059\u308b",children:"\u91cd\u8981\u306a\u30da\u30eb\u30bd\u30ca\u5411\u3051\u306e\u30d3\u30e5\u30fc\u3092\u4f5c\u6210\u3059\u308b"}),"\n",(0,i.jsx)(s.h3,{id:"\u30d3\u30b8\u30cd\u30b9\u30e1\u30c8\u30ea\u30af\u30b9\u3092\u30aa\u30da\u30ec\u30fc\u30b7\u30e7\u30ca\u30eb\u30e1\u30c8\u30ea\u30af\u30b9\u3068\u5171\u306b\u5171\u6709\u3059\u308b",children:"\u30d3\u30b8\u30cd\u30b9\u30e1\u30c8\u30ea\u30af\u30b9\u3092\u30aa\u30da\u30ec\u30fc\u30b7\u30e7\u30ca\u30eb\u30e1\u30c8\u30ea\u30af\u30b9\u3068\u5171\u306b\u5171\u6709\u3059\u308b"}),"\n",(0,i.jsx)(s.h3,{id:"\u30c0\u30c3\u30b7\u30e5\u30dc\u30fc\u30c9\u306f\u58c1\u3067\u306f\u306a\u304f\u6a4b\u3092\u7bc9\u304f\u3079\u304d",children:"\u30c0\u30c3\u30b7\u30e5\u30dc\u30fc\u30c9\u306f\u58c1\u3067\u306f\u306a\u304f\u3001\u6a4b\u3092\u7bc9\u304f\u3079\u304d"}),"\n",(0,i.jsx)(s.h3,{id:"\u30c0\u30c3\u30b7\u30e5\u30dc\u30fc\u30c9\u306f\u30b9\u30c8\u30fc\u30ea\u30fc\u3092\u8a9e\u308b\u3079\u304d",children:"\u30c0\u30c3\u30b7\u30e5\u30dc\u30fc\u30c9\u306f\u30b9\u30c8\u30fc\u30ea\u30fc\u3092\u8a9e\u308b\u3079\u304d"}),"\n",(0,i.jsx)(s.h3,{id:"\u30c0\u30c3\u30b7\u30e5\u30dc\u30fc\u30c9\u306f\u6280\u8853\u8005\u3068\u975e\u6280\u8853\u8005\u306e\u4e21\u65b9\u304c\u5229\u7528\u3067\u304d\u308b\u3088\u3046\u306b\u3059\u308b\u5fc5\u8981\u304c\u3042\u308a\u307e\u3059",children:"\u30c0\u30c3\u30b7\u30e5\u30dc\u30fc\u30c9\u306f\u6280\u8853\u8005\u3068\u975e\u6280\u8853\u8005\u306e\u4e21\u65b9\u304c\u5229\u7528\u3067\u304d\u308b\u3088\u3046\u306b\u3059\u308b\u5fc5\u8981\u304c\u3042\u308a\u307e\u3059"}),"\n",(0,i.jsx)(s.h2,{id:"\u63a8\u5968\u4e8b\u9805",children:"\u63a8\u5968\u4e8b\u9805"}),"\n",(0,i.jsx)(s.h3,{id:"\u65e2\u5b58\u306e-id-\u30d7\u30ed\u30d0\u30a4\u30c0\u30fc\u306e\u6d3b\u7528",children:"\u65e2\u5b58\u306e ID \u30d7\u30ed\u30d0\u30a4\u30c0\u30fc\u306e\u6d3b\u7528"})]})}function u(e={}){const{wrapper:s}={...(0,r.R)(),...e.components};return s?(0,i.jsx)(s,{...e,children:(0,i.jsx)(o,{...e})}):o(e)}}}]);
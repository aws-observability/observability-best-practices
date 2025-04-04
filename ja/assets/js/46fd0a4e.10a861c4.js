"use strict";(self.webpackChunkobservability_best_practices=self.webpackChunkobservability_best_practices||[]).push([[7487],{19848:(e,t,s)=>{s.r(t),s.d(t,{assets:()=>c,contentTitle:()=>a,default:()=>d,frontMatter:()=>i,metadata:()=>n,toc:()=>l});const n=JSON.parse('{"id":"tutorial-basics/create-a-blog-post","title":"\u30d6\u30ed\u30b0\u6295\u7a3f\u306e\u4f5c\u6210","description":"Docusaurus \u306f \u5404\u30d6\u30ed\u30b0\u6295\u7a3f\u306e\u30da\u30fc\u30b8 \u3092\u4f5c\u6210\u3059\u308b\u3060\u3051\u3067\u306a\u304f\u3001\u30d6\u30ed\u30b0\u306e\u30a4\u30f3\u30c7\u30c3\u30af\u30b9\u30da\u30fc\u30b8\u3001\u30bf\u30b0\u30b7\u30b9\u30c6\u30e0\u3001RSS \u30d5\u30a3\u30fc\u30c9\u306a\u3069\u3082\u4f5c\u6210\u3057\u307e\u3059\u3002","source":"@site/i18n/ja/docusaurus-plugin-content-docs/current/tutorial-basics/create-a-blog-post.md","sourceDirName":"tutorial-basics","slug":"/tutorial-basics/create-a-blog-post","permalink":"/observability-best-practices/ja/tutorial-basics/create-a-blog-post","draft":false,"unlisted":false,"editUrl":"https://github.com/aws-observability/observability-best-practices/blob/main/docusaurus/docs/tutorial-basics/create-a-blog-post.md","tags":[],"version":"current","sidebarPosition":3,"frontMatter":{"sidebar_position":3}}');var r=s(74848),o=s(28453);const i={sidebar_position:3},a="\u30d6\u30ed\u30b0\u6295\u7a3f\u306e\u4f5c\u6210",c={},l=[{value:"\u6700\u521d\u306e\u6295\u7a3f\u3092\u4f5c\u6210\u3059\u308b",id:"\u6700\u521d\u306e\u6295\u7a3f\u3092\u4f5c\u6210\u3059\u308b",level:2}];function u(e){const t={a:"a",code:"code",h1:"h1",h2:"h2",header:"header",p:"p",pre:"pre",strong:"strong",...(0,o.R)(),...e.components};return(0,r.jsxs)(r.Fragment,{children:[(0,r.jsx)(t.header,{children:(0,r.jsx)(t.h1,{id:"\u30d6\u30ed\u30b0\u6295\u7a3f\u306e\u4f5c\u6210",children:"\u30d6\u30ed\u30b0\u6295\u7a3f\u306e\u4f5c\u6210"})}),"\n",(0,r.jsxs)(t.p,{children:["Docusaurus \u306f ",(0,r.jsx)(t.strong,{children:"\u5404\u30d6\u30ed\u30b0\u6295\u7a3f\u306e\u30da\u30fc\u30b8"})," \u3092\u4f5c\u6210\u3059\u308b\u3060\u3051\u3067\u306a\u304f\u3001",(0,r.jsx)(t.strong,{children:"\u30d6\u30ed\u30b0\u306e\u30a4\u30f3\u30c7\u30c3\u30af\u30b9\u30da\u30fc\u30b8"}),"\u3001",(0,r.jsx)(t.strong,{children:"\u30bf\u30b0\u30b7\u30b9\u30c6\u30e0"}),"\u3001",(0,r.jsx)(t.strong,{children:"RSS"})," \u30d5\u30a3\u30fc\u30c9\u306a\u3069\u3082\u4f5c\u6210\u3057\u307e\u3059\u3002"]}),"\n",(0,r.jsx)(t.h2,{id:"\u6700\u521d\u306e\u6295\u7a3f\u3092\u4f5c\u6210\u3059\u308b",children:"\u6700\u521d\u306e\u6295\u7a3f\u3092\u4f5c\u6210\u3059\u308b"}),"\n",(0,r.jsxs)(t.p,{children:[(0,r.jsx)(t.code,{children:"blog/2021-02-28-greetings.md"})," \u306b\u30d5\u30a1\u30a4\u30eb\u3092\u4f5c\u6210\u3057\u307e\u3059\uff1a"]}),"\n",(0,r.jsx)(t.pre,{children:(0,r.jsx)(t.code,{className:"language-md",metastring:'title="blog/2021-02-28-greetings.md"',children:"---\nslug: greetings\ntitle: Greetings!\nauthors:\n  - name: Joel Marcey\n    title: Co-creator of Docusaurus 1\n    url: https://github.com/JoelMarcey\n    image_url: https://github.com/JoelMarcey.png\n  - name: S\xe9bastien Lorber\n    title: Docusaurus maintainer\n    url: https://sebastienlorber.com\n    image_url: https://github.com/slorber.png\ntags: [greetings]\n---\n\n\u304a\u3081\u3067\u3068\u3046\u3054\u3056\u3044\u307e\u3059\uff01\u6700\u521d\u306e\u6295\u7a3f\u3092\u4f5c\u6210\u3057\u307e\u3057\u305f\uff01\n\n\u3053\u306e\u6295\u7a3f\u3092\u81ea\u7531\u306b\u7de8\u96c6\u3057\u3066\u3001\u304a\u597d\u304d\u306a\u3060\u3051\u8a66\u3057\u3066\u307f\u3066\u304f\u3060\u3055\u3044\u3002\n"})}),"\n",(0,r.jsxs)(t.p,{children:["\u65b0\u3057\u3044\u30d6\u30ed\u30b0\u6295\u7a3f\u304c ",(0,r.jsx)(t.a,{href:"http://localhost:3000/blog/greetings",children:"http://localhost:3000/blog/greetings"})," \u3067\u5229\u7528\u53ef\u80fd\u306b\u306a\u308a\u307e\u3057\u305f\u3002"]})]})}function d(e={}){const{wrapper:t}={...(0,o.R)(),...e.components};return t?(0,r.jsx)(t,{...e,children:(0,r.jsx)(u,{...e})}):u(e)}},28453:(e,t,s)=>{s.d(t,{R:()=>i,x:()=>a});var n=s(96540);const r={},o=n.createContext(r);function i(e){const t=n.useContext(o);return n.useMemo((function(){return"function"==typeof e?e(t):{...t,...e}}),[t,e])}function a(e){let t;return t=e.disableParentContext?"function"==typeof e.components?e.components(r):e.components||r:i(e.components),n.createElement(o.Provider,{value:t},e.children)}}}]);
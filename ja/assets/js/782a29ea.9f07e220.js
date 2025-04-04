"use strict";(self.webpackChunkobservability_best_practices=self.webpackChunkobservability_best_practices||[]).push([[6888],{16771:(e,s,t)=>{t.r(s),t.d(s,{assets:()=>i,contentTitle:()=>o,default:()=>p,frontMatter:()=>c,metadata:()=>a,toc:()=>l});const a=JSON.parse('{"id":"tutorial-basics/create-a-page","title":"\u30da\u30fc\u30b8\u306e\u4f5c\u6210","description":"\u30b9\u30bf\u30f3\u30c9\u30a2\u30ed\u30f3\u30da\u30fc\u30b8 \u3092\u4f5c\u6210\u3059\u308b\u306b\u306f\u3001src/pages \u306b Markdown \u307e\u305f\u306f React \u30d5\u30a1\u30a4\u30eb\u3092\u8ffd\u52a0\u3057\u307e\u3059\uff1a","source":"@site/i18n/ja/docusaurus-plugin-content-docs/current/tutorial-basics/create-a-page.md","sourceDirName":"tutorial-basics","slug":"/tutorial-basics/create-a-page","permalink":"/observability-best-practices/ja/tutorial-basics/create-a-page","draft":false,"unlisted":false,"editUrl":"https://github.com/aws-observability/observability-best-practices/blob/main/docusaurus/docs/tutorial-basics/create-a-page.md","tags":[],"version":"current","sidebarPosition":1,"frontMatter":{"sidebar_position":1}}');var n=t(74848),r=t(28453);const c={sidebar_position:1},o="\u30da\u30fc\u30b8\u306e\u4f5c\u6210",i={},l=[{value:"\u6700\u521d\u306e React \u30da\u30fc\u30b8\u3092\u4f5c\u6210\u3059\u308b",id:"\u6700\u521d\u306e-react-\u30da\u30fc\u30b8\u3092\u4f5c\u6210\u3059\u308b",level:2},{value:"\u6700\u521d\u306e Markdown \u30da\u30fc\u30b8\u3092\u4f5c\u6210\u3059\u308b",id:"\u6700\u521d\u306e-markdown-\u30da\u30fc\u30b8\u3092\u4f5c\u6210\u3059\u308b",level:2}];function d(e){const s={a:"a",code:"code",h1:"h1",h2:"h2",header:"header",li:"li",p:"p",pre:"pre",strong:"strong",ul:"ul",...(0,r.R)(),...e.components};return(0,n.jsxs)(n.Fragment,{children:[(0,n.jsx)(s.header,{children:(0,n.jsx)(s.h1,{id:"\u30da\u30fc\u30b8\u306e\u4f5c\u6210",children:"\u30da\u30fc\u30b8\u306e\u4f5c\u6210"})}),"\n",(0,n.jsxs)(s.p,{children:[(0,n.jsx)(s.strong,{children:"\u30b9\u30bf\u30f3\u30c9\u30a2\u30ed\u30f3\u30da\u30fc\u30b8"})," \u3092\u4f5c\u6210\u3059\u308b\u306b\u306f\u3001",(0,n.jsx)(s.code,{children:"src/pages"})," \u306b ",(0,n.jsx)(s.strong,{children:"Markdown \u307e\u305f\u306f React"})," \u30d5\u30a1\u30a4\u30eb\u3092\u8ffd\u52a0\u3057\u307e\u3059\uff1a"]}),"\n",(0,n.jsxs)(s.ul,{children:["\n",(0,n.jsxs)(s.li,{children:[(0,n.jsx)(s.code,{children:"src/pages/index.js"})," \u2192 ",(0,n.jsx)(s.code,{children:"localhost:3000/"})]}),"\n",(0,n.jsxs)(s.li,{children:[(0,n.jsx)(s.code,{children:"src/pages/foo.md"})," \u2192 ",(0,n.jsx)(s.code,{children:"localhost:3000/foo"})]}),"\n",(0,n.jsxs)(s.li,{children:[(0,n.jsx)(s.code,{children:"src/pages/foo/bar.js"})," \u2192 ",(0,n.jsx)(s.code,{children:"localhost:3000/foo/bar"})]}),"\n"]}),"\n",(0,n.jsx)(s.h2,{id:"\u6700\u521d\u306e-react-\u30da\u30fc\u30b8\u3092\u4f5c\u6210\u3059\u308b",children:"\u6700\u521d\u306e React \u30da\u30fc\u30b8\u3092\u4f5c\u6210\u3059\u308b"}),"\n",(0,n.jsxs)(s.p,{children:[(0,n.jsx)(s.code,{children:"src/pages/my-react-page.js"})," \u306b\u30d5\u30a1\u30a4\u30eb\u3092\u4f5c\u6210\u3057\u307e\u3059\uff1a"]}),"\n",(0,n.jsx)(s.pre,{children:(0,n.jsx)(s.code,{className:"language-jsx",metastring:'title="src/pages/my-react-page.js"',children:"import React from 'react';\nimport Layout from '@theme/Layout';\n\nexport default function MyReactPage() {\n  return (\n    <Layout>\n      <h1>My React page</h1>\n      <p>This is a React page</p>\n    </Layout>\n  );\n}\n"})}),"\n",(0,n.jsxs)(s.p,{children:["\u65b0\u3057\u3044\u30da\u30fc\u30b8\u304c ",(0,n.jsx)(s.a,{href:"http://localhost:3000/my-react-page",children:"http://localhost:3000/my-react-page"})," \u3067\u5229\u7528\u3067\u304d\u308b\u3088\u3046\u306b\u306a\u308a\u307e\u3057\u305f\u3002"]}),"\n",(0,n.jsx)(s.h2,{id:"\u6700\u521d\u306e-markdown-\u30da\u30fc\u30b8\u3092\u4f5c\u6210\u3059\u308b",children:"\u6700\u521d\u306e Markdown \u30da\u30fc\u30b8\u3092\u4f5c\u6210\u3059\u308b"}),"\n",(0,n.jsxs)(s.p,{children:[(0,n.jsx)(s.code,{children:"src/pages/my-markdown-page.md"})," \u306b\u30d5\u30a1\u30a4\u30eb\u3092\u4f5c\u6210\u3057\u307e\u3059:"]}),"\n",(0,n.jsx)(s.pre,{children:(0,n.jsx)(s.code,{className:"language-mdx",metastring:'title="src/pages/my-markdown-page.md"',children:"\n\n\n# \u30de\u30fc\u30af\u30c0\u30a6\u30f3\u30da\u30fc\u30b8\n\n\u3053\u308c\u306f\u30de\u30fc\u30af\u30c0\u30a6\u30f3\u30da\u30fc\u30b8\u3067\u3059\u3002\n"})}),"\n",(0,n.jsxs)(s.p,{children:["\u65b0\u3057\u3044\u30da\u30fc\u30b8\u304c ",(0,n.jsx)(s.a,{href:"http://localhost:3000/my-markdown-page",children:"http://localhost:3000/my-markdown-page"})," \u3067\u5229\u7528\u53ef\u80fd\u306b\u306a\u308a\u307e\u3057\u305f\u3002"]})]})}function p(e={}){const{wrapper:s}={...(0,r.R)(),...e.components};return s?(0,n.jsx)(s,{...e,children:(0,n.jsx)(d,{...e})}):d(e)}},28453:(e,s,t)=>{t.d(s,{R:()=>c,x:()=>o});var a=t(96540);const n={},r=a.createContext(n);function c(e){const s=a.useContext(r);return a.useMemo((function(){return"function"==typeof e?e(s):{...s,...e}}),[s,e])}function o(e){let s;return s=e.disableParentContext?"function"==typeof e.components?e.components(n):e.components||n:c(e.components),a.createElement(r.Provider,{value:s},e.children)}}}]);
"use strict";(self.webpackChunkobservability_best_practices=self.webpackChunkobservability_best_practices||[]).push([[7578],{74978:(e,n,s)=>{s.r(n),s.d(n,{assets:()=>l,contentTitle:()=>c,default:()=>u,frontMatter:()=>i,metadata:()=>o,toc:()=>a});var t=s(74848),r=s(28453);const i={sidebar_position:2},c="\u30c9\u30ad\u30e5\u30e1\u30f3\u30c8\u3092\u4f5c\u6210\u3059\u308b",o={id:"tutorial-basics/create-a-document",title:"\u30c9\u30ad\u30e5\u30e1\u30f3\u30c8\u3092\u4f5c\u6210\u3059\u308b",description:"\u30c9\u30ad\u30e5\u30e1\u30f3\u30c8\u306f\u4ee5\u4e0b\u306e\u8981\u7d20\u306b\u3088\u3063\u3066\u63a5\u7d9a\u3055\u308c\u305f \u30da\u30fc\u30b8\u306e\u30b0\u30eb\u30fc\u30d7 \u3067\u3059\uff1a",source:"@site/i18n/ja/docusaurus-plugin-content-docs/current/tutorial-basics/create-a-document.md",sourceDirName:"tutorial-basics",slug:"/tutorial-basics/create-a-document",permalink:"/observability-best-practices/ja/tutorial-basics/create-a-document",draft:!1,unlisted:!1,editUrl:"https://github.com/aws-observability/observability-best-practices/blob/main/docusaurus/docs/tutorial-basics/create-a-document.md",tags:[],version:"current",sidebarPosition:2,frontMatter:{sidebar_position:2}},l={},a=[{value:"\u6700\u521d\u306e\u30c9\u30ad\u30e5\u30e1\u30f3\u30c8\u3092\u4f5c\u6210\u3059\u308b",id:"\u6700\u521d\u306e\u30c9\u30ad\u30e5\u30e1\u30f3\u30c8\u3092\u4f5c\u6210\u3059\u308b",level:2},{value:"\u30b5\u30a4\u30c9\u30d0\u30fc\u306e\u8a2d\u5b9a",id:"\u30b5\u30a4\u30c9\u30d0\u30fc\u306e\u8a2d\u5b9a",level:2}];function d(e){const n={a:"a",code:"code",h1:"h1",h2:"h2",li:"li",p:"p",pre:"pre",strong:"strong",ul:"ul",...(0,r.R)(),...e.components};return(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)(n.h1,{id:"\u30c9\u30ad\u30e5\u30e1\u30f3\u30c8\u3092\u4f5c\u6210\u3059\u308b",children:"\u30c9\u30ad\u30e5\u30e1\u30f3\u30c8\u3092\u4f5c\u6210\u3059\u308b"}),"\n",(0,t.jsxs)(n.p,{children:["\u30c9\u30ad\u30e5\u30e1\u30f3\u30c8\u306f\u4ee5\u4e0b\u306e\u8981\u7d20\u306b\u3088\u3063\u3066\u63a5\u7d9a\u3055\u308c\u305f ",(0,t.jsx)(n.strong,{children:"\u30da\u30fc\u30b8\u306e\u30b0\u30eb\u30fc\u30d7"})," \u3067\u3059\uff1a"]}),"\n",(0,t.jsxs)(n.ul,{children:["\n",(0,t.jsx)(n.li,{children:(0,t.jsx)(n.strong,{children:"\u30b5\u30a4\u30c9\u30d0\u30fc"})}),"\n",(0,t.jsx)(n.li,{children:(0,t.jsx)(n.strong,{children:"\u524d/\u6b21\u306e\u30ca\u30d3\u30b2\u30fc\u30b7\u30e7\u30f3"})}),"\n",(0,t.jsx)(n.li,{children:(0,t.jsx)(n.strong,{children:"\u30d0\u30fc\u30b8\u30e7\u30f3\u7ba1\u7406"})}),"\n"]}),"\n",(0,t.jsx)(n.h2,{id:"\u6700\u521d\u306e\u30c9\u30ad\u30e5\u30e1\u30f3\u30c8\u3092\u4f5c\u6210\u3059\u308b",children:"\u6700\u521d\u306e\u30c9\u30ad\u30e5\u30e1\u30f3\u30c8\u3092\u4f5c\u6210\u3059\u308b"}),"\n",(0,t.jsxs)(n.p,{children:[(0,t.jsx)(n.code,{children:"docs/hello.md"})," \u306b Markdown \u30d5\u30a1\u30a4\u30eb\u3092\u4f5c\u6210\u3057\u307e\u3059\uff1a"]}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-md",metastring:'title="docs/hello.md"',children:"\n\n\n# \u3053\u3093\u306b\u3061\u306f\n\n\u3053\u308c\u306f\u79c1\u306e **\u521d\u3081\u3066\u306e Docusaurus \u30c9\u30ad\u30e5\u30e1\u30f3\u30c8** \u3067\u3059\uff01\n"})}),"\n",(0,t.jsxs)(n.p,{children:["\u65b0\u3057\u3044\u30c9\u30ad\u30e5\u30e1\u30f3\u30c8\u304c ",(0,t.jsx)(n.a,{href:"http://localhost:3000/docs/hello",children:"http://localhost:3000/docs/hello"})," \u3067\u5229\u7528\u53ef\u80fd\u306b\u306a\u308a\u307e\u3057\u305f\u3002"]}),"\n",(0,t.jsx)(n.h2,{id:"\u30b5\u30a4\u30c9\u30d0\u30fc\u306e\u8a2d\u5b9a",children:"\u30b5\u30a4\u30c9\u30d0\u30fc\u306e\u8a2d\u5b9a"}),"\n",(0,t.jsxs)(n.p,{children:["Docusaurus \u306f ",(0,t.jsx)(n.code,{children:"docs"})," \u30d5\u30a9\u30eb\u30c0\u304b\u3089\u81ea\u52d5\u7684\u306b",(0,t.jsx)(n.strong,{children:"\u30b5\u30a4\u30c9\u30d0\u30fc\u3092\u4f5c\u6210"}),"\u3057\u307e\u3059\u3002"]}),"\n",(0,t.jsx)(n.p,{children:"\u30e1\u30bf\u30c7\u30fc\u30bf\u3092\u8ffd\u52a0\u3057\u3066\u3001\u30b5\u30a4\u30c9\u30d0\u30fc\u306e\u30e9\u30d9\u30eb\u3068\u4f4d\u7f6e\u3092\u30ab\u30b9\u30bf\u30de\u30a4\u30ba\u3057\u307e\u3059\uff1a"}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-md",metastring:'title="docs/hello.md" {1-4}',children:"---\nsidebar_label: 'Hi!'\nsidebar_position: 3\n---\n\n\n\n\n# \u3053\u3093\u306b\u3061\u306f\n\n\u3053\u308c\u306f\u79c1\u306e **\u521d\u3081\u3066\u306e Docusaurus \u30c9\u30ad\u30e5\u30e1\u30f3\u30c8**\u3067\u3059\uff01\n"})}),"\n",(0,t.jsxs)(n.p,{children:[(0,t.jsx)(n.code,{children:"sidebars.js"})," \u3067\u30b5\u30a4\u30c9\u30d0\u30fc\u3092\u660e\u793a\u7684\u306b\u4f5c\u6210\u3059\u308b\u3053\u3068\u3082\u53ef\u80fd\u3067\u3059\uff1a"]}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-js",metastring:'title="sidebars.js"',children:"export default {\n  tutorialSidebar: [\n    'intro',\n    // highlight-next-line\n    'hello',\n    {\n      type: 'category',\n      label: 'Tutorial',\n      items: ['tutorial-basics/create-a-document'],\n    },\n  ],\n};\n"})})]})}function u(e={}){const{wrapper:n}={...(0,r.R)(),...e.components};return n?(0,t.jsx)(n,{...e,children:(0,t.jsx)(d,{...e})}):d(e)}},28453:(e,n,s)=>{s.d(n,{R:()=>c,x:()=>o});var t=s(96540);const r={},i=t.createContext(r);function c(e){const n=t.useContext(i);return t.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function o(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(r):e.components||r:c(e.components),t.createElement(i.Provider,{value:n},e.children)}}}]);
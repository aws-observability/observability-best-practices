"use strict";(self.webpackChunkobservability_best_practices=self.webpackChunkobservability_best_practices||[]).push([[3828],{17643:(e,s,a)=>{a.d(s,{A:()=>n});const n=a.p+"assets/images/13-07b97c6f9b4ef62b9ef34819ab5429bb.png"},28453:(e,s,a)=>{a.d(s,{R:()=>o,x:()=>i});var n=a(96540);const r={},t=n.createContext(r);function o(e){const s=n.useContext(t);return n.useMemo((function(){return"function"==typeof e?e(s):{...s,...e}}),[s,e])}function i(e){let s;return s=e.disableParentContext?"function"==typeof e.components?e.components(r):e.components||r:o(e.components),n.createElement(t.Provider,{value:s},e.children)}},36715:(e,s,a)=>{a.d(s,{A:()=>n});const n=a.p+"assets/images/8-3160a57b7375ac768ccd56f4167856b8.png"},38241:(e,s,a)=>{a.d(s,{A:()=>n});const n=a.p+"assets/images/2-22136261aee94d69823499acc55e504b.png"},45143:(e,s,a)=>{a.d(s,{A:()=>n});const n=a.p+"assets/images/4-97f81696f2c066ddc7f72d23ee4d9b3e.png"},55150:(e,s,a)=>{a.d(s,{A:()=>n});const n=a.p+"assets/images/5-790f6db8245706d375af6c8c243c3f68.png"},56412:(e,s,a)=>{a.d(s,{A:()=>n});const n=a.p+"assets/images/7-42d7f60cbd79b50cc9b818bdfd79acc8.png"},61049:(e,s,a)=>{a.d(s,{A:()=>n});const n=a.p+"assets/images/11-dc9745eff63571ecae641cc00a8ed025.png"},64144:(e,s,a)=>{a.d(s,{A:()=>n});const n=a.p+"assets/images/10-5daccd292f8f8dfeff8642c1770ebcf6.png"},65322:(e,s,a)=>{a.r(s),a.d(s,{assets:()=>c,contentTitle:()=>i,default:()=>l,frontMatter:()=>o,metadata:()=>n,toc:()=>d});const n=JSON.parse('{"id":"recipes/recipes/amg-google-auth-saml","title":"SAML \u3092\u4f7f\u7528\u3057\u3066 Amazon Managed Grafana \u3067 Google Workspaces \u8a8d\u8a3c\u3092\u8a2d\u5b9a\u3059\u308b","description":"\u3053\u306e\u30ac\u30a4\u30c9\u3067\u306f\u3001SAML v2.0 \u30d7\u30ed\u30c8\u30b3\u30eb\u3092\u4f7f\u7528\u3057\u3066\u3001Google Workspaces \u3092 Amazon Managed Grafana \u306e\u30a2\u30a4\u30c7\u30f3\u30c6\u30a3\u30c6\u30a3\u30d7\u30ed\u30d0\u30a4\u30c0\u30fc (IdP) \u3068\u3057\u3066\u8a2d\u5b9a\u3059\u308b\u65b9\u6cd5\u3092\u8aac\u660e\u3057\u307e\u3059\u3002","source":"@site/i18n/ja/docusaurus-plugin-content-docs/current/recipes/recipes/amg-google-auth-saml.md","sourceDirName":"recipes/recipes","slug":"/recipes/recipes/amg-google-auth-saml","permalink":"/observability-best-practices/ja/recipes/recipes/amg-google-auth-saml","draft":false,"unlisted":false,"editUrl":"https://github.com/aws-observability/observability-best-practices/blob/main/docusaurus/docs/recipes/recipes/amg-google-auth-saml.md","tags":[],"version":"current","frontMatter":{}}');var r=a(74848),t=a(28453);const o={},i="SAML \u3092\u4f7f\u7528\u3057\u3066 Amazon Managed Grafana \u3067 Google Workspaces \u8a8d\u8a3c\u3092\u8a2d\u5b9a\u3059\u308b",c={},d=[{value:"Amazon Managed Grafana \u30ef\u30fc\u30af\u30b9\u30da\u30fc\u30b9\u306e\u4f5c\u6210",id:"amazon-managed-grafana-\u30ef\u30fc\u30af\u30b9\u30da\u30fc\u30b9\u306e\u4f5c\u6210",level:3},{value:"Google Workspace \u306e\u8a2d\u5b9a",id:"google-workspace-\u306e\u8a2d\u5b9a",level:3},{value:"Amazon Managed Grafana \u3078\u306e SAML \u30e1\u30bf\u30c7\u30fc\u30bf\u306e\u30a2\u30c3\u30d7\u30ed\u30fc\u30c9",id:"amazon-managed-grafana-\u3078\u306e-saml-\u30e1\u30bf\u30c7\u30fc\u30bf\u306e\u30a2\u30c3\u30d7\u30ed\u30fc\u30c9",level:3}];function g(e){const s={a:"a",em:"em",h1:"h1",h3:"h3",header:"header",img:"img",p:"p",strong:"strong",...(0,t.R)(),...e.components};return(0,r.jsxs)(r.Fragment,{children:[(0,r.jsx)(s.header,{children:(0,r.jsx)(s.h1,{id:"saml-\u3092\u4f7f\u7528\u3057\u3066-amazon-managed-grafana-\u3067-google-workspaces-\u8a8d\u8a3c\u3092\u8a2d\u5b9a\u3059\u308b",children:"SAML \u3092\u4f7f\u7528\u3057\u3066 Amazon Managed Grafana \u3067 Google Workspaces \u8a8d\u8a3c\u3092\u8a2d\u5b9a\u3059\u308b"})}),"\n",(0,r.jsx)(s.p,{children:"\u3053\u306e\u30ac\u30a4\u30c9\u3067\u306f\u3001SAML v2.0 \u30d7\u30ed\u30c8\u30b3\u30eb\u3092\u4f7f\u7528\u3057\u3066\u3001Google Workspaces \u3092 Amazon Managed Grafana \u306e\u30a2\u30a4\u30c7\u30f3\u30c6\u30a3\u30c6\u30a3\u30d7\u30ed\u30d0\u30a4\u30c0\u30fc (IdP) \u3068\u3057\u3066\u8a2d\u5b9a\u3059\u308b\u65b9\u6cd5\u3092\u8aac\u660e\u3057\u307e\u3059\u3002"}),"\n",(0,r.jsxs)(s.p,{children:["\u3053\u306e\u30ac\u30a4\u30c9\u306b\u5f93\u3046\u306b\u306f\u3001",(0,r.jsx)(s.a,{href:"https://docs.aws.amazon.com/ja_jp/grafana/latest/userguide/getting-started-with-AMG.html",children:"Amazon Managed Grafana \u30ef\u30fc\u30af\u30b9\u30da\u30fc\u30b9"})," \u306e\u4f5c\u6210\u306b\u52a0\u3048\u3066\u3001\u6709\u6599\u306e ",(0,r.jsx)(s.a,{href:"https://workspace.google.com/",children:"Google Workspaces"})," \u30a2\u30ab\u30a6\u30f3\u30c8\u3092\u4f5c\u6210\u3059\u308b\u5fc5\u8981\u304c\u3042\u308a\u307e\u3059\u3002"]}),"\n",(0,r.jsx)(s.h3,{id:"amazon-managed-grafana-\u30ef\u30fc\u30af\u30b9\u30da\u30fc\u30b9\u306e\u4f5c\u6210",children:"Amazon Managed Grafana \u30ef\u30fc\u30af\u30b9\u30da\u30fc\u30b9\u306e\u4f5c\u6210"}),"\n",(0,r.jsxs)(s.p,{children:["Amazon Managed Grafana \u30b3\u30f3\u30bd\u30fc\u30eb\u306b\u30ed\u30b0\u30a4\u30f3\u3057\u3001",(0,r.jsx)(s.strong,{children:"Create workspace"})," \u3092\u30af\u30ea\u30c3\u30af\u3057\u307e\u3059\u3002\n\u6b21\u306e\u753b\u9762\u3067\u3001\u4ee5\u4e0b\u306e\u3088\u3046\u306b\u30ef\u30fc\u30af\u30b9\u30da\u30fc\u30b9\u540d\u3092\u5165\u529b\u3057\u3001",(0,r.jsx)(s.strong,{children:"Next"})," \u3092\u30af\u30ea\u30c3\u30af\u3057\u307e\u3059\uff1a"]}),"\n",(0,r.jsx)(s.p,{children:(0,r.jsx)(s.img,{alt:"Create Workspace - Specify workspace details",src:a(89258).A+"",width:"1130",height:"513"})}),"\n",(0,r.jsxs)(s.p,{children:[(0,r.jsx)(s.strong,{children:"Configure settings"})," \u30da\u30fc\u30b8\u3067\u3001",(0,r.jsx)(s.strong,{children:"Security Assertion Markup Language (SAML)"})," \u30aa\u30d7\u30b7\u30e7\u30f3\u3092\u9078\u629e\u3057\u3001\u30e6\u30fc\u30b6\u30fc\u306e\u30ed\u30b0\u30a4\u30f3\u306b\u4f7f\u7528\u3059\u308b SAML \u30d9\u30fc\u30b9\u306e Identity Provider \u3092\u8a2d\u5b9a\u3067\u304d\u308b\u3088\u3046\u306b\u3057\u307e\u3059\uff1a"]}),"\n",(0,r.jsx)(s.p,{children:(0,r.jsx)(s.img,{alt:"Create Workspace - Configure settings",src:a(38241).A+"",width:"1106",height:"695"})}),"\n",(0,r.jsxs)(s.p,{children:["\u4f7f\u7528\u3057\u305f\u3044\u30c7\u30fc\u30bf\u30bd\u30fc\u30b9\u3092\u9078\u629e\u3057\u3001",(0,r.jsx)(s.strong,{children:"Next"})," \u3092\u30af\u30ea\u30c3\u30af\u3057\u307e\u3059\uff1a\n",(0,r.jsx)(s.img,{alt:"Create Workspace - Permission settings",src:a(65528).A+"",width:"1115",height:"951"})]}),"\n",(0,r.jsxs)(s.p,{children:[(0,r.jsx)(s.strong,{children:"Review and create"})," \u753b\u9762\u3067 ",(0,r.jsx)(s.strong,{children:"Create workspace"})," \u30dc\u30bf\u30f3\u3092\u30af\u30ea\u30c3\u30af\u3057\u307e\u3059\uff1a\n",(0,r.jsx)(s.img,{alt:"Create Workspace - Review settings",src:a(45143).A+"",width:"1113",height:"1105"})]}),"\n",(0,r.jsx)(s.p,{children:"\u4ee5\u4e0b\u306e\u3088\u3046\u306b\u3001\u65b0\u3057\u3044 Amazon Managed Grafana \u30ef\u30fc\u30af\u30b9\u30da\u30fc\u30b9\u304c\u4f5c\u6210\u3055\u308c\u307e\u3059\uff1a"}),"\n",(0,r.jsx)(s.p,{children:(0,r.jsx)(s.img,{alt:"Create Workspace - Create AMG workspace",src:a(55150).A+"",width:"1580",height:"945"})}),"\n",(0,r.jsx)(s.h3,{id:"google-workspace-\u306e\u8a2d\u5b9a",children:"Google Workspace \u306e\u8a2d\u5b9a"}),"\n",(0,r.jsxs)(s.p,{children:["\u30b9\u30fc\u30d1\u30fc\u7ba1\u7406\u8005\u6a29\u9650\u3067 Google Workspace \u306b\u30ed\u30b0\u30a4\u30f3\u3057\u3001",(0,r.jsx)(s.strong,{children:"Apps"})," \u30bb\u30af\u30b7\u30e7\u30f3\u306e\u4e0b\u306b\u3042\u308b ",(0,r.jsx)(s.strong,{children:"Web and mobile apps"})," \u306b\u79fb\u52d5\u3057\u307e\u3059\u3002\n\u305d\u3053\u3067\u3001",(0,r.jsx)(s.strong,{children:"Add App"})," \u3092\u30af\u30ea\u30c3\u30af\u3057\u3001",(0,r.jsx)(s.strong,{children:"Add custom SAML app"})," \u3092\u9078\u629e\u3057\u307e\u3059\u3002\n\u4ee5\u4e0b\u306e\u3088\u3046\u306b\u3001\u30a2\u30d7\u30ea\u306b\u540d\u524d\u3092\u4ed8\u3051\u307e\u3059\u3002\n",(0,r.jsx)(s.strong,{children:"CONTINUE"})," \u3092\u30af\u30ea\u30c3\u30af\u3057\u307e\u3059\u3002"]}),"\n",(0,r.jsx)(s.p,{children:(0,r.jsx)(s.img,{alt:"Google Workspace - Add custom SAML app - App details",src:a(73925).A+"",width:"1353",height:"724"})}),"\n",(0,r.jsxs)(s.p,{children:["\u6b21\u306e\u753b\u9762\u3067\u3001",(0,r.jsx)(s.strong,{children:"DOWNLOAD METADATA"})," \u30dc\u30bf\u30f3\u3092\u30af\u30ea\u30c3\u30af\u3057\u3066 SAML \u30e1\u30bf\u30c7\u30fc\u30bf\u30d5\u30a1\u30a4\u30eb\u3092\u30c0\u30a6\u30f3\u30ed\u30fc\u30c9\u3057\u307e\u3059\u3002\n",(0,r.jsx)(s.strong,{children:"CONTINUE"})," \u3092\u30af\u30ea\u30c3\u30af\u3057\u307e\u3059\u3002"]}),"\n",(0,r.jsx)(s.p,{children:(0,r.jsx)(s.img,{alt:"Google Workspace - Add custom SAML app - Download Metadata",src:a(56412).A+"",width:"1350",height:"1059"})}),"\n",(0,r.jsx)(s.p,{children:"\u6b21\u306e\u753b\u9762\u3067\u306f\u3001ACS URL\u3001Entity ID\u3001Start URL \u30d5\u30a3\u30fc\u30eb\u30c9\u304c\u8868\u793a\u3055\u308c\u307e\u3059\u3002\n\u3053\u308c\u3089\u306e\u30d5\u30a3\u30fc\u30eb\u30c9\u306e\u5024\u306f\u3001Amazon Managed Grafana \u30b3\u30f3\u30bd\u30fc\u30eb\u304b\u3089\u53d6\u5f97\u3067\u304d\u307e\u3059\u3002"}),"\n",(0,r.jsxs)(s.p,{children:[(0,r.jsx)(s.strong,{children:"Name ID format"})," \u30d5\u30a3\u30fc\u30eb\u30c9\u306e\u30c9\u30ed\u30c3\u30d7\u30c0\u30a6\u30f3\u304b\u3089 ",(0,r.jsx)(s.strong,{children:"EMAIL"})," \u3092\u9078\u629e\u3057\u3001",(0,r.jsx)(s.strong,{children:"Name ID"})," \u30d5\u30a3\u30fc\u30eb\u30c9\u3067 ",(0,r.jsx)(s.strong,{children:"Basic Information > Primary email"})," \u3092\u9078\u629e\u3057\u307e\u3059\u3002"]}),"\n",(0,r.jsxs)(s.p,{children:[(0,r.jsx)(s.strong,{children:"CONTINUE"})," \u3092\u30af\u30ea\u30c3\u30af\u3057\u307e\u3059\u3002\n",(0,r.jsx)(s.img,{alt:"Google Workspace - Add custom SAML app - Service provider details",src:a(36715).A+"",width:"1349",height:"914"})]}),"\n",(0,r.jsx)(s.p,{children:(0,r.jsx)(s.img,{alt:"AMG - SAML Configuration details",src:a(73058).A+"",width:"1531",height:"1183"})}),"\n",(0,r.jsxs)(s.p,{children:[(0,r.jsx)(s.strong,{children:"Attribute mapping"})," \u753b\u9762\u3067\u3001\u4ee5\u4e0b\u306e\u30b9\u30af\u30ea\u30fc\u30f3\u30b7\u30e7\u30c3\u30c8\u306e\u3088\u3046\u306b ",(0,r.jsx)(s.strong,{children:"Google Directory attributes"})," \u3068 ",(0,r.jsx)(s.strong,{children:"App attributes"})," \u306e\u9593\u306e\u30de\u30c3\u30d4\u30f3\u30b0\u3092\u884c\u3044\u307e\u3059\u3002"]}),"\n",(0,r.jsx)(s.p,{children:(0,r.jsx)(s.img,{alt:"Google Workspace - Add custom SAML app - Attribute mapping",src:a(64144).A+"",width:"1351",height:"693"})}),"\n",(0,r.jsxs)(s.p,{children:["Google \u8a8d\u8a3c\u3067\u30ed\u30b0\u30a4\u30f3\u3059\u308b\u30e6\u30fc\u30b6\u30fc\u304c ",(0,r.jsx)(s.strong,{children:"Amazon Managed Grafana"})," \u3067 ",(0,r.jsx)(s.strong,{children:"Admin"})," \u6a29\u9650\u3092\u6301\u3064\u3088\u3046\u306b\u3059\u308b\u306b\u306f\u3001",(0,r.jsx)(s.strong,{children:"Department"})," \u30d5\u30a3\u30fc\u30eb\u30c9\u306e\u5024\u3092 ",(0,r.jsx)(s.em,{children:(0,r.jsx)(s.strong,{children:"monitoring"})})," \u306b\u8a2d\u5b9a\u3057\u307e\u3059\u3002\n\u3053\u306e\u305f\u3081\u306b\u4efb\u610f\u306e\u30d5\u30a3\u30fc\u30eb\u30c9\u3068\u5024\u3092\u9078\u629e\u3067\u304d\u307e\u3059\u3002\nGoogle Workspace \u5074\u3067\u4f55\u3092\u4f7f\u7528\u3059\u308b\u304b\u3092\u9078\u629e\u3057\u305f\u3089\u3001\u305d\u308c\u3092\u53cd\u6620\u3059\u308b\u3088\u3046\u306b Amazon Managed Grafana \u306e SAML \u8a2d\u5b9a\u3067\u30de\u30c3\u30d4\u30f3\u30b0\u3092\u884c\u3063\u3066\u304f\u3060\u3055\u3044\u3002"]}),"\n",(0,r.jsx)(s.h3,{id:"amazon-managed-grafana-\u3078\u306e-saml-\u30e1\u30bf\u30c7\u30fc\u30bf\u306e\u30a2\u30c3\u30d7\u30ed\u30fc\u30c9",children:"Amazon Managed Grafana \u3078\u306e SAML \u30e1\u30bf\u30c7\u30fc\u30bf\u306e\u30a2\u30c3\u30d7\u30ed\u30fc\u30c9"}),"\n",(0,r.jsxs)(s.p,{children:["Amazon Managed Grafana \u30b3\u30f3\u30bd\u30fc\u30eb\u3067\u3001",(0,r.jsx)(s.strong,{children:"Upload or copy/paste"})," \u30aa\u30d7\u30b7\u30e7\u30f3\u3092\u30af\u30ea\u30c3\u30af\u3057\u3001",(0,r.jsx)(s.strong,{children:"Choose file"})," \u30dc\u30bf\u30f3\u3092\u9078\u629e\u3057\u3066\u3001\u5148\u307b\u3069 Google Workspace \u304b\u3089\u30c0\u30a6\u30f3\u30ed\u30fc\u30c9\u3057\u305f SAML \u30e1\u30bf\u30c7\u30fc\u30bf\u30d5\u30a1\u30a4\u30eb\u3092\u30a2\u30c3\u30d7\u30ed\u30fc\u30c9\u3057\u307e\u3059\u3002"]}),"\n",(0,r.jsxs)(s.p,{children:[(0,r.jsx)(s.strong,{children:"Assertion mapping"})," \u30bb\u30af\u30b7\u30e7\u30f3\u3067\u3001",(0,r.jsx)(s.strong,{children:"Assertion attribute role"})," \u30d5\u30a3\u30fc\u30eb\u30c9\u306b ",(0,r.jsx)(s.strong,{children:"Department"})," \u3092\u3001",(0,r.jsx)(s.strong,{children:"Admin role values"})," \u30d5\u30a3\u30fc\u30eb\u30c9\u306b ",(0,r.jsx)(s.strong,{children:"monitoring"})," \u3092\u5165\u529b\u3057\u307e\u3059\u3002\n\u3053\u308c\u306b\u3088\u308a\u3001",(0,r.jsx)(s.strong,{children:"Department"})," \u304c ",(0,r.jsx)(s.strong,{children:"monitoring"})," \u306e\u30e6\u30fc\u30b6\u30fc\u304c Grafana \u3067 ",(0,r.jsx)(s.strong,{children:"Admin"})," \u6a29\u9650\u3092\u6301\u3061\u3001\u30c0\u30c3\u30b7\u30e5\u30dc\u30fc\u30c9\u3084\u30c7\u30fc\u30bf\u30bd\u30fc\u30b9\u306e\u4f5c\u6210\u306a\u3069\u306e\u7ba1\u7406\u8005\u306e\u8077\u52d9\u3092\u5b9f\u884c\u3067\u304d\u308b\u3088\u3046\u306b\u306a\u308a\u307e\u3059\u3002"]}),"\n",(0,r.jsxs)(s.p,{children:["\u4ee5\u4e0b\u306e\u30b9\u30af\u30ea\u30fc\u30f3\u30b7\u30e7\u30c3\u30c8\u306e\u3088\u3046\u306b\u3001",(0,r.jsx)(s.strong,{children:"Additional settings - optional"})," \u30bb\u30af\u30b7\u30e7\u30f3\u306e\u5024\u3092\u8a2d\u5b9a\u3057\u307e\u3059\u3002",(0,r.jsx)(s.strong,{children:"Save SAML configuration"})," \u3092\u30af\u30ea\u30c3\u30af\u3057\u307e\u3059\uff1a"]}),"\n",(0,r.jsx)(s.p,{children:(0,r.jsx)(s.img,{alt:"AMG SAML - Assertion mapping",src:a(61049).A+"",width:"1526",height:"818"})}),"\n",(0,r.jsx)(s.p,{children:"\u3053\u308c\u3067 Amazon Managed Grafana \u306f Google Workspace \u3092\u4f7f\u7528\u3057\u3066\u30e6\u30fc\u30b6\u30fc\u3092\u8a8d\u8a3c\u3059\u308b\u3088\u3046\u306b\u8a2d\u5b9a\u3055\u308c\u307e\u3057\u305f\u3002"}),"\n",(0,r.jsx)(s.p,{children:"\u30e6\u30fc\u30b6\u30fc\u304c\u30ed\u30b0\u30a4\u30f3\u3059\u308b\u3068\u3001\u4ee5\u4e0b\u306e\u3088\u3046\u306b Google \u306e\u30ed\u30b0\u30a4\u30f3\u30da\u30fc\u30b8\u306b\u30ea\u30c0\u30a4\u30ec\u30af\u30c8\u3055\u308c\u307e\u3059\uff1a"}),"\n",(0,r.jsx)(s.p,{children:(0,r.jsx)(s.img,{alt:"Google Workspace - Google sign in",src:a(96514).A+"",width:"694",height:"668"})}),"\n",(0,r.jsxs)(s.p,{children:["\u8a8d\u8a3c\u60c5\u5831\u3092\u5165\u529b\u3059\u308b\u3068\u3001\u4ee5\u4e0b\u306e\u30b9\u30af\u30ea\u30fc\u30f3\u30b7\u30e7\u30c3\u30c8\u306e\u3088\u3046\u306b Grafana \u306b\u30ed\u30b0\u30a4\u30f3\u3055\u308c\u307e\u3059\u3002\n",(0,r.jsx)(s.img,{alt:"AMG - Grafana user settings page",src:a(17643).A+"",width:"867",height:"984"})]}),"\n",(0,r.jsx)(s.p,{children:"\u3054\u89a7\u306e\u3088\u3046\u306b\u3001\u30e6\u30fc\u30b6\u30fc\u306f Google Workspace \u8a8d\u8a3c\u3092\u4f7f\u7528\u3057\u3066 Grafana \u306b\u6b63\u5e38\u306b\u30ed\u30b0\u30a4\u30f3\u3067\u304d\u307e\u3057\u305f\u3002"})]})}function l(e={}){const{wrapper:s}={...(0,t.R)(),...e.components};return s?(0,r.jsx)(s,{...e,children:(0,r.jsx)(g,{...e})}):g(e)}},65528:(e,s,a)=>{a.d(s,{A:()=>n});const n=a.p+"assets/images/3-5b8c9005451c082aeccc189ff68798c7.png"},73058:(e,s,a)=>{a.d(s,{A:()=>n});const n=a.p+"assets/images/9-68f1e10ca2338ff9361f079379c22ccb.png"},73925:(e,s,a)=>{a.d(s,{A:()=>n});const n=a.p+"assets/images/6-a121c9c5bedfdc6b37b61ad51ef9af4c.png"},89258:(e,s,a)=>{a.d(s,{A:()=>n});const n=a.p+"assets/images/1-f980b1293dab6b586bf09eec9ab87925.png"},96514:(e,s,a)=>{a.d(s,{A:()=>n});const n=a.p+"assets/images/12-0eaca88915eeaa464350145b9587fd7a.png"}}]);
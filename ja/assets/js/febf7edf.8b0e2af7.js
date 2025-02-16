"use strict";(self.webpackChunkobservability_best_practices=self.webpackChunkobservability_best_practices||[]).push([[3614],{11769:(e,a,o)=>{o.d(a,{A:()=>s});const s=o.p+"assets/images/prometheus.drawio-dotted.drawio-d85b60429313f79e627c60cd375625fe.png"},28453:(e,a,o)=>{o.d(a,{R:()=>t,x:()=>c});var s=o(96540);const n={},r=s.createContext(n);function t(e){const a=s.useContext(r);return s.useMemo((function(){return"function"==typeof e?e(a):{...a,...e}}),[a,e])}function c(e){let a;return a=e.disableParentContext?"function"==typeof e.components?e.components(n):e.components||n:t(e.components),s.createElement(r.Provider,{value:a},e.children)}},55374:(e,a,o)=>{o.r(a),o.d(a,{assets:()=>i,contentTitle:()=>t,default:()=>d,frontMatter:()=>r,metadata:()=>c,toc:()=>p});var s=o(74848),n=o(28453);const r={},t=void 0,c={id:"recipes/recipes/Workspaces-Monitoring-AMP-AMG/README",title:"README",description:"\u7d44\u7e54\u306f\u3001\u5f93\u6765\u306e\u30c7\u30b9\u30af\u30c8\u30c3\u30d7\u30bd\u30ea\u30e5\u30fc\u30b7\u30e7\u30f3\u3092\u7f6e\u304d\u63db\u3048\u3001\u30e9\u30c3\u30d7\u30c8\u30c3\u30d7\u3084\u30c7\u30b9\u30af\u30c8\u30c3\u30d7\u306e\u7dad\u6301\u306b\u304b\u304b\u308b\u30b3\u30b9\u30c8\u3068\u52b4\u529b\u3092\u30af\u30e9\u30a6\u30c9\u306e\u5f93\u91cf\u8ab2\u91d1\u30e2\u30c7\u30eb\u306b\u79fb\u884c\u3059\u308b\u30bd\u30ea\u30e5\u30fc\u30b7\u30e7\u30f3 (DAAS) \u3068\u3057\u3066\u3001\u30af\u30e9\u30a6\u30c9\u30d9\u30fc\u30b9\u306e\u4eee\u60f3\u30c7\u30b9\u30af\u30c8\u30c3\u30d7\u3067\u3042\u308b Amazon Workspaces \u306e\u63a1\u7528\u3092\u958b\u59cb\u3057\u3066\u3044\u307e\u3059\u3002Amazon Workspaces \u3092\u4f7f\u7528\u3059\u308b\u7d44\u7e54\u306f\u3001Day 2 \u904b\u7528\u306e\u305f\u3081\u306b Workspaces \u74b0\u5883\u3092\u76e3\u8996\u3059\u308b\u305f\u3081\u306e\u3053\u308c\u3089\u306e\u30de\u30cd\u30fc\u30b8\u30c9\u30b5\u30fc\u30d3\u30b9\u306e\u30b5\u30dd\u30fc\u30c8\u3092\u5fc5\u8981\u3068\u3057\u307e\u3059\u3002Amazon Managed Service for Prometheus \u3084 Amazon Managed Grafana \u306e\u3088\u3046\u306a\u30af\u30e9\u30a6\u30c9\u30d9\u30fc\u30b9\u306e\u30de\u30cd\u30fc\u30b8\u30c9\u30aa\u30fc\u30d7\u30f3\u30bd\u30fc\u30b9\u76e3\u8996\u30bd\u30ea\u30e5\u30fc\u30b7\u30e7\u30f3\u306f\u3001IT \u30c1\u30fc\u30e0\u304c\u8fc5\u901f\u306b\u76e3\u8996\u30bd\u30ea\u30e5\u30fc\u30b7\u30e7\u30f3\u3092\u30bb\u30c3\u30c8\u30a2\u30c3\u30d7\u3057\u3001\u904b\u7528\u3057\u3066\u30b3\u30b9\u30c8\u3092\u524a\u6e1b\u3059\u308b\u306e\u306b\u5f79\u7acb\u3061\u307e\u3059\u3002Amazon Workspace \u304b\u3089\u306e CPU\u3001\u30e1\u30e2\u30ea\u3001\u30cd\u30c3\u30c8\u30ef\u30fc\u30af\u3001\u307e\u305f\u306f\u30c7\u30a3\u30b9\u30af\u30a2\u30af\u30c6\u30a3\u30d3\u30c6\u30a3\u306e\u76e3\u8996\u306b\u3088\u308a\u3001Amazon Workspaces \u74b0\u5883\u306e\u30c8\u30e9\u30d6\u30eb\u30b7\u30e5\u30fc\u30c6\u30a3\u30f3\u30b0\u6642\u306e\u63a8\u6e2c\u4f5c\u696d\u304c\u4e0d\u8981\u306b\u306a\u308a\u307e\u3059\u3002",source:"@site/i18n/ja/docusaurus-plugin-content-docs/current/recipes/recipes/Workspaces-Monitoring-AMP-AMG/README.md",sourceDirName:"recipes/recipes/Workspaces-Monitoring-AMP-AMG",slug:"/recipes/recipes/Workspaces-Monitoring-AMP-AMG/",permalink:"/observability-best-practices/ja/recipes/recipes/Workspaces-Monitoring-AMP-AMG/",draft:!1,unlisted:!1,editUrl:"https://github.com/aws-observability/observability-best-practices/blob/main/docusaurus/docs/recipes/recipes/Workspaces-Monitoring-AMP-AMG/README.md",tags:[],version:"current",frontMatter:{}},i={},p=[];function m(e){const a={a:"a",img:"img",li:"li",p:"p",strong:"strong",ul:"ul",...(0,n.R)(),...e.components};return(0,s.jsxs)(s.Fragment,{children:[(0,s.jsxs)(a.p,{children:["\u7d44\u7e54\u306f\u3001\u5f93\u6765\u306e\u30c7\u30b9\u30af\u30c8\u30c3\u30d7\u30bd\u30ea\u30e5\u30fc\u30b7\u30e7\u30f3\u3092\u7f6e\u304d\u63db\u3048\u3001\u30e9\u30c3\u30d7\u30c8\u30c3\u30d7\u3084\u30c7\u30b9\u30af\u30c8\u30c3\u30d7\u306e\u7dad\u6301\u306b\u304b\u304b\u308b\u30b3\u30b9\u30c8\u3068\u52b4\u529b\u3092\u30af\u30e9\u30a6\u30c9\u306e\u5f93\u91cf\u8ab2\u91d1\u30e2\u30c7\u30eb\u306b\u79fb\u884c\u3059\u308b\u30bd\u30ea\u30e5\u30fc\u30b7\u30e7\u30f3 (DAAS) \u3068\u3057\u3066\u3001\u30af\u30e9\u30a6\u30c9\u30d9\u30fc\u30b9\u306e\u4eee\u60f3\u30c7\u30b9\u30af\u30c8\u30c3\u30d7\u3067\u3042\u308b ",(0,s.jsx)(a.a,{href:"https://docs.aws.amazon.com/ja_jp/workspaces/latest/adminguide/amazon-workspaces.html",children:"Amazon Workspaces"})," \u306e\u63a1\u7528\u3092\u958b\u59cb\u3057\u3066\u3044\u307e\u3059\u3002Amazon Workspaces \u3092\u4f7f\u7528\u3059\u308b\u7d44\u7e54\u306f\u3001Day 2 \u904b\u7528\u306e\u305f\u3081\u306b Workspaces \u74b0\u5883\u3092\u76e3\u8996\u3059\u308b\u305f\u3081\u306e\u3053\u308c\u3089\u306e\u30de\u30cd\u30fc\u30b8\u30c9\u30b5\u30fc\u30d3\u30b9\u306e\u30b5\u30dd\u30fc\u30c8\u3092\u5fc5\u8981\u3068\u3057\u307e\u3059\u3002Amazon Managed Service for Prometheus \u3084 Amazon Managed Grafana \u306e\u3088\u3046\u306a\u30af\u30e9\u30a6\u30c9\u30d9\u30fc\u30b9\u306e\u30de\u30cd\u30fc\u30b8\u30c9\u30aa\u30fc\u30d7\u30f3\u30bd\u30fc\u30b9\u76e3\u8996\u30bd\u30ea\u30e5\u30fc\u30b7\u30e7\u30f3\u306f\u3001IT \u30c1\u30fc\u30e0\u304c\u8fc5\u901f\u306b\u76e3\u8996\u30bd\u30ea\u30e5\u30fc\u30b7\u30e7\u30f3\u3092\u30bb\u30c3\u30c8\u30a2\u30c3\u30d7\u3057\u3001\u904b\u7528\u3057\u3066\u30b3\u30b9\u30c8\u3092\u524a\u6e1b\u3059\u308b\u306e\u306b\u5f79\u7acb\u3061\u307e\u3059\u3002Amazon Workspace \u304b\u3089\u306e CPU\u3001\u30e1\u30e2\u30ea\u3001\u30cd\u30c3\u30c8\u30ef\u30fc\u30af\u3001\u307e\u305f\u306f\u30c7\u30a3\u30b9\u30af\u30a2\u30af\u30c6\u30a3\u30d3\u30c6\u30a3\u306e\u76e3\u8996\u306b\u3088\u308a\u3001Amazon Workspaces \u74b0\u5883\u306e\u30c8\u30e9\u30d6\u30eb\u30b7\u30e5\u30fc\u30c6\u30a3\u30f3\u30b0\u6642\u306e\u63a8\u6e2c\u4f5c\u696d\u304c\u4e0d\u8981\u306b\u306a\u308a\u307e\u3059\u3002"]}),"\n",(0,s.jsx)(a.p,{children:"Amazon Workspaces \u74b0\u5883\u306b\u304a\u3051\u308b\u30de\u30cd\u30fc\u30b8\u30c9\u76e3\u8996\u30bd\u30ea\u30e5\u30fc\u30b7\u30e7\u30f3\u306f\u3001\u4ee5\u4e0b\u306e\u7d44\u7e54\u7684\u5229\u70b9\u3092\u3082\u305f\u3089\u3057\u307e\u3059\uff1a"}),"\n",(0,s.jsxs)(a.ul,{children:["\n",(0,s.jsx)(a.li,{children:"\u30b5\u30fc\u30d3\u30b9\u30c7\u30b9\u30af\u306e\u30b9\u30bf\u30c3\u30d5\u306f\u3001Amazon Managed Service for Prometheus \u3084 Amazon Managed Grafana \u306a\u3069\u306e\u30de\u30cd\u30fc\u30b8\u30c9\u76e3\u8996\u30b5\u30fc\u30d3\u30b9\u3092\u6d3b\u7528\u3059\u308b\u3053\u3068\u3067\u3001\u8abf\u67fb\u304c\u5fc5\u8981\u306a Amazon Workspace \u306e\u554f\u984c\u3092\u63a8\u6e2c\u4f5c\u696d\u306a\u3057\u3067\u8fc5\u901f\u306b\u7279\u5b9a\u3057\u3001\u6398\u308a\u4e0b\u3052\u308b\u3053\u3068\u304c\u3067\u304d\u307e\u3059"}),"\n",(0,s.jsx)(a.li,{children:"\u30b5\u30fc\u30d3\u30b9\u30c7\u30b9\u30af\u306e\u30b9\u30bf\u30c3\u30d5\u306f\u3001Amazon Managed Service for Prometheus \u306e\u5c65\u6b74\u30c7\u30fc\u30bf\u3092\u4f7f\u7528\u3057\u3066\u3001\u30a4\u30d9\u30f3\u30c8\u5f8c\u306b Amazon Workspace \u306e\u554f\u984c\u3092\u8abf\u67fb\u3067\u304d\u307e\u3059"}),"\n",(0,s.jsx)(a.li,{children:"Amazon Workspaces \u306e\u554f\u984c\u306b\u3064\u3044\u3066\u3001\u30d3\u30b8\u30cd\u30b9\u30e6\u30fc\u30b6\u30fc\u306b\u8cea\u554f\u3059\u308b\u6642\u9593\u3092\u7121\u99c4\u306b\u3059\u308b\u9577\u3044\u901a\u8a71\u3092\u6392\u9664\u3057\u307e\u3059"}),"\n"]}),"\n",(0,s.jsx)(a.p,{children:"\u3053\u306e\u30d6\u30ed\u30b0\u8a18\u4e8b\u3067\u306f\u3001Amazon Workspaces \u306e\u76e3\u8996\u30bd\u30ea\u30e5\u30fc\u30b7\u30e7\u30f3\u3092\u63d0\u4f9b\u3059\u308b\u305f\u3081\u306b\u3001Amazon Managed Service for Prometheus\u3001Amazon Managed Grafana\u3001\u304a\u3088\u3073 Amazon Elastic Compute Cloud (EC2) \u4e0a\u306e Prometheus \u30b5\u30fc\u30d0\u30fc\u3092\u30bb\u30c3\u30c8\u30a2\u30c3\u30d7\u3057\u307e\u3059\u3002Active Directory \u30b0\u30eb\u30fc\u30d7\u30dd\u30ea\u30b7\u30fc\u30aa\u30d6\u30b8\u30a7\u30af\u30c8 (GPO) \u3092\u4f7f\u7528\u3057\u3066\u3001\u65b0\u3057\u3044 Amazon Workspace \u3078\u306e Prometheus \u30a8\u30fc\u30b8\u30a7\u30f3\u30c8\u306e\u30c7\u30d7\u30ed\u30a4\u30e1\u30f3\u30c8\u3092\u81ea\u52d5\u5316\u3057\u307e\u3059\u3002"}),"\n",(0,s.jsx)(a.p,{children:(0,s.jsx)(a.strong,{children:"\u30bd\u30ea\u30e5\u30fc\u30b7\u30e7\u30f3\u30a2\u30fc\u30ad\u30c6\u30af\u30c1\u30e3"})}),"\n",(0,s.jsxs)(a.p,{children:["\u4ee5\u4e0b\u306e\u56f3\u306f\u3001Amazon Managed Service for Prometheus \u3084 Amazon Managed Grafana \u306a\u3069\u306e AWS \u30cd\u30a4\u30c6\u30a3\u30d6\u306e\u30de\u30cd\u30fc\u30b8\u30c9\u30b5\u30fc\u30d3\u30b9\u3092\u4f7f\u7528\u3057\u3066 Amazon Workspaces \u74b0\u5883\u3092\u76e3\u8996\u3059\u308b\u30bd\u30ea\u30e5\u30fc\u30b7\u30e7\u30f3\u3092\u793a\u3057\u3066\u3044\u307e\u3059\u3002\u3053\u306e\u30bd\u30ea\u30e5\u30fc\u30b7\u30e7\u30f3\u3067\u306f\u3001Amazon Elastic Compute Cloud (EC2) \u30a4\u30f3\u30b9\u30bf\u30f3\u30b9\u4e0a\u306b Prometheus \u30b5\u30fc\u30d0\u30fc\u3092\u30c7\u30d7\u30ed\u30a4\u3057\u3001\u5b9a\u671f\u7684\u306b Amazon Workspace \u4e0a\u306e Prometheus \u30a8\u30fc\u30b8\u30a7\u30f3\u30c8\u3092\u30dd\u30fc\u30ea\u30f3\u30b0\u3057\u3001\u30e1\u30c8\u30ea\u30af\u30b9\u3092 Amazon Managed Service for Prometheus \u306b\u30ea\u30e2\u30fc\u30c8\u30e9\u30a4\u30c8\u3057\u307e\u3059\u3002Amazon Managed Grafana \u3092\u4f7f\u7528\u3057\u3066\u3001Amazon Workspaces \u30a4\u30f3\u30d5\u30e9\u30b9\u30c8\u30e9\u30af\u30c1\u30e3\u306e\u30e1\u30c8\u30ea\u30af\u30b9\u3092\u30af\u30a8\u30ea\u304a\u3088\u3073\u53ef\u8996\u5316\u3057\u307e\u3059\u3002\n",(0,s.jsx)(a.img,{alt:"Screenshot",src:o(11769).A+"",width:"642",height:"581"})]})]})}function d(e={}){const{wrapper:a}={...(0,n.R)(),...e.components};return a?(0,s.jsx)(a,{...e,children:(0,s.jsx)(m,{...e})}):m(e)}}}]);
"use strict";(self.webpackChunkobservability_best_practices=self.webpackChunkobservability_best_practices||[]).push([[6040],{28453:(e,t,n)=>{n.d(t,{R:()=>i,x:()=>l});var r=n(96540);const s={},a=r.createContext(s);function i(e){const t=r.useContext(a);return r.useMemo((function(){return"function"==typeof e?e(t):{...t,...e}}),[t,e])}function l(e){let t;return t=e.disableParentContext?"function"==typeof e.components?e.components(s):e.components||s:i(e.components),r.createElement(a.Provider,{value:t},e.children)}},47908:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>o,contentTitle:()=>i,default:()=>h,frontMatter:()=>a,metadata:()=>l,toc:()=>c});var r=n(74848),s=n(28453);const a={},i="CloudWatch Container Insights",l={id:"patterns/adoteksfargate",title:"CloudWatch Container Insights",description:"\u306f\u3058\u3081\u306b",source:"@site/i18n/ja/docusaurus-plugin-content-docs/current/patterns/adoteksfargate.md",sourceDirName:"patterns",slug:"/patterns/adoteksfargate",permalink:"/observability-best-practices/ja/patterns/adoteksfargate",draft:!1,unlisted:!1,editUrl:"https://github.com/aws-observability/observability-best-practices/blob/main/docusaurus/docs/patterns/adoteksfargate.md",tags:[],version:"current",frontMatter:{},sidebar:"patterns",previous:{title:"AWS X-Ray \u3092\u4f7f\u7528\u3057\u305f Lambda \u306e\u30c8\u30ec\u30fc\u30b7\u30f3\u30b0",permalink:"/observability-best-practices/ja/patterns/Tracing/xraylambda"},next:{title:"EKS \u304b\u3089 Prometheus \u3078\u306e\u30e1\u30c8\u30ea\u30af\u30b9\u306e\u9001\u4fe1",permalink:"/observability-best-practices/ja/patterns/ampagentless"}},o={},c=[{value:"\u306f\u3058\u3081\u306b",id:"\u306f\u3058\u3081\u306b",level:2},{value:"EKS Fargate \u7528\u306e ADOT Collector \u306e\u8a2d\u8a08",id:"eks-fargate-\u7528\u306e-adot-collector-\u306e\u8a2d\u8a08",level:2},{value:"\u30c7\u30d7\u30ed\u30a4\u30e1\u30f3\u30c8\u30d7\u30ed\u30bb\u30b9",id:"\u30c7\u30d7\u30ed\u30a4\u30e1\u30f3\u30c8\u30d7\u30ed\u30bb\u30b9",level:2},{value:"\u30e1\u30ea\u30c3\u30c8\u3068\u30c7\u30e1\u30ea\u30c3\u30c8",id:"\u30e1\u30ea\u30c3\u30c8\u3068\u30c7\u30e1\u30ea\u30c3\u30c8",level:2},{value:"\u30e1\u30ea\u30c3\u30c8:",id:"\u30e1\u30ea\u30c3\u30c8",level:3},{value:"\u30c7\u30e1\u30ea\u30c3\u30c8\uff1a",id:"\u30c7\u30e1\u30ea\u30c3\u30c8",level:3}];function d(e){const t={em:"em",h1:"h1",h2:"h2",h3:"h3",img:"img",li:"li",ol:"ol",p:"p",...(0,s.R)(),...e.components};return(0,r.jsxs)(r.Fragment,{children:[(0,r.jsx)(t.h1,{id:"cloudwatch-container-insights",children:"CloudWatch Container Insights"}),"\n",(0,r.jsx)(t.h2,{id:"\u306f\u3058\u3081\u306b",children:"\u306f\u3058\u3081\u306b"}),"\n",(0,r.jsx)(t.p,{children:"Amazon CloudWatch Container Insights \u306f\u3001\u30b3\u30f3\u30c6\u30ca\u5316\u3055\u308c\u305f\u30a2\u30d7\u30ea\u30b1\u30fc\u30b7\u30e7\u30f3\u3084\u30de\u30a4\u30af\u30ed\u30b5\u30fc\u30d3\u30b9\u304b\u3089\u30e1\u30c8\u30ea\u30af\u30b9\u3068\u30ed\u30b0\u3092\u53ce\u96c6\u3001\u96c6\u7d04\u3001\u8981\u7d04\u3059\u308b\u305f\u3081\u306e\u5f37\u529b\u306a\u30c4\u30fc\u30eb\u3067\u3059\u3002\u3053\u306e\u30c9\u30ad\u30e5\u30e1\u30f3\u30c8\u3067\u306f\u3001EKS Fargate \u30ef\u30fc\u30af\u30ed\u30fc\u30c9\u306b\u304a\u3051\u308b ADOT \u3068 CloudWatch Container Insights \u306e\u7d71\u5408\u306b\u3064\u3044\u3066\u3001\u305d\u306e\u8a2d\u8a08\u3001\u30c7\u30d7\u30ed\u30a4\u30d7\u30ed\u30bb\u30b9\u3001\u5229\u70b9\u3092\u542b\u3081\u3066\u6982\u8981\u3092\u8aac\u660e\u3057\u307e\u3059\u3002"}),"\n",(0,r.jsx)(t.h2,{id:"eks-fargate-\u7528\u306e-adot-collector-\u306e\u8a2d\u8a08",children:"EKS Fargate \u7528\u306e ADOT Collector \u306e\u8a2d\u8a08"}),"\n",(0,r.jsx)(t.p,{children:"ADOT Collector \u306f\u30013 \u3064\u306e\u4e3b\u8981\u30b3\u30f3\u30dd\u30fc\u30cd\u30f3\u30c8\u3067\u69cb\u6210\u3055\u308c\u308b\u30d1\u30a4\u30d7\u30e9\u30a4\u30f3\u30a2\u30fc\u30ad\u30c6\u30af\u30c1\u30e3\u3092\u4f7f\u7528\u3057\u3066\u3044\u307e\u3059\uff1a"}),"\n",(0,r.jsxs)(t.ol,{children:["\n",(0,r.jsx)(t.li,{children:"Receiver\uff1a\u6307\u5b9a\u3055\u308c\u305f\u5f62\u5f0f\u3067\u30c7\u30fc\u30bf\u3092\u53d7\u3051\u53d6\u308a\u3001\u5185\u90e8\u5f62\u5f0f\u306b\u5909\u63db\u3057\u307e\u3059\u3002"}),"\n",(0,r.jsx)(t.li,{children:"Processor\uff1a\u30c7\u30fc\u30bf\u306e\u30d0\u30c3\u30c1\u51e6\u7406\u3001\u30d5\u30a3\u30eb\u30bf\u30ea\u30f3\u30b0\u3001\u5909\u63db\u306a\u3069\u306e\u30bf\u30b9\u30af\u3092\u5b9f\u884c\u3057\u307e\u3059\u3002"}),"\n",(0,r.jsx)(t.li,{children:"Exporter\uff1a\u30e1\u30c8\u30ea\u30af\u30b9\u3001\u30ed\u30b0\u3001\u307e\u305f\u306f\u30c8\u30ec\u30fc\u30b9\u306e\u9001\u4fe1\u5148\u3092\u6c7a\u5b9a\u3057\u307e\u3059\u3002"}),"\n"]}),"\n",(0,r.jsx)(t.p,{children:"EKS Fargate \u306e\u5834\u5408\u3001ADOT Collector \u306f Prometheus Receiver \u3092\u4f7f\u7528\u3057\u3066\u3001\u30ef\u30fc\u30ab\u30fc\u30ce\u30fc\u30c9\u4e0a\u306e kubelet \u306e\u30d7\u30ed\u30ad\u30b7\u3068\u3057\u3066\u6a5f\u80fd\u3059\u308b Kubernetes API \u30b5\u30fc\u30d0\u30fc\u304b\u3089\u30e1\u30c8\u30ea\u30af\u30b9\u3092\u30b9\u30af\u30ec\u30a4\u30d4\u30f3\u30b0\u3057\u307e\u3059\u3002\u3053\u306e\u30a2\u30d7\u30ed\u30fc\u30c1\u306f\u3001EKS Fargate \u306e\u30cd\u30c3\u30c8\u30ef\u30fc\u30af\u5236\u9650\u306b\u3088\u308a kubelet \u306b\u76f4\u63a5\u30a2\u30af\u30bb\u30b9\u3067\u304d\u306a\u3044\u305f\u3081\u5fc5\u8981\u3068\u306a\u308a\u307e\u3059\u3002\u53ce\u96c6\u3055\u308c\u305f\u30e1\u30c8\u30ea\u30af\u30b9\u306f\u3001\u30d5\u30a3\u30eb\u30bf\u30ea\u30f3\u30b0\u3001\u540d\u524d\u306e\u5909\u66f4\u3001\u30c7\u30fc\u30bf\u96c6\u7d04\u3001\u5909\u63db\u306e\u305f\u3081\u306e\u4e00\u9023\u306e Processor \u3092\u7d4c\u7531\u3057\u307e\u3059\u3002\u6700\u5f8c\u306b\u3001AWS CloudWatch EMF Exporter \u304c\u30e1\u30c8\u30ea\u30af\u30b9\u3092\u57cb\u3081\u8fbc\u307f\u30e1\u30c8\u30ea\u30af\u30b9\u5f62\u5f0f (EMF) \u306b\u5909\u63db\u3057\u3001CloudWatch Logs \u306b\u9001\u4fe1\u3057\u307e\u3059\u3002"}),"\n",(0,r.jsxs)(t.p,{children:[(0,r.jsx)(t.img,{alt:"CI EKS fargate with ADOT",src:n(83205).A+"",width:"1072",height:"644"}),"\n",(0,r.jsx)(t.em,{children:"\u56f3 1\uff1aEKS Fargate \u4e0a\u306e ADOT \u3092\u4f7f\u7528\u3057\u305f Container Insights"})]}),"\n",(0,r.jsx)(t.h2,{id:"\u30c7\u30d7\u30ed\u30a4\u30e1\u30f3\u30c8\u30d7\u30ed\u30bb\u30b9",children:"\u30c7\u30d7\u30ed\u30a4\u30e1\u30f3\u30c8\u30d7\u30ed\u30bb\u30b9"}),"\n",(0,r.jsx)(t.p,{children:"EKS Fargate \u30af\u30e9\u30b9\u30bf\u30fc\u306b ADOT Collector \u3092\u30c7\u30d7\u30ed\u30a4\u3059\u308b\u306b\u306f\uff1a"}),"\n",(0,r.jsxs)(t.ol,{children:["\n",(0,r.jsx)(t.li,{children:"Kubernetes \u3067 EKS \u30af\u30e9\u30b9\u30bf\u30fc\u3092\u4f5c\u6210\u3057\u307e\u3059\u3002"}),"\n",(0,r.jsx)(t.li,{children:"Fargate \u30dd\u30c3\u30c9\u5b9f\u884c\u30ed\u30fc\u30eb\u3092\u8a2d\u5b9a\u3057\u307e\u3059\u3002"}),"\n",(0,r.jsx)(t.li,{children:"\u5fc5\u8981\u306a\u540d\u524d\u7a7a\u9593\u306e Fargate \u30d7\u30ed\u30d5\u30a1\u30a4\u30eb\u3092\u5b9a\u7fa9\u3057\u307e\u3059\u3002"}),"\n",(0,r.jsx)(t.li,{children:"\u5fc5\u8981\u306a\u6a29\u9650\u3092\u6301\u3064 ADOT Collector \u7528\u306e IAM \u30ed\u30fc\u30eb\u3092\u4f5c\u6210\u3057\u307e\u3059\u3002"}),"\n",(0,r.jsx)(t.li,{children:"\u63d0\u4f9b\u3055\u308c\u305f\u30de\u30cb\u30d5\u30a7\u30b9\u30c8\u3092\u4f7f\u7528\u3057\u3066\u3001ADOT Collector \u3092 Kubernetes StatefulSet \u3068\u3057\u3066\u30c7\u30d7\u30ed\u30a4\u3057\u307e\u3059\u3002"}),"\n",(0,r.jsx)(t.li,{children:"\u30e1\u30c8\u30ea\u30af\u30b9\u53ce\u96c6\u3092\u30c6\u30b9\u30c8\u3059\u308b\u305f\u3081\u306e\u30b5\u30f3\u30d7\u30eb\u30ef\u30fc\u30af\u30ed\u30fc\u30c9\u3092\u30c7\u30d7\u30ed\u30a4\u3057\u307e\u3059\u3002"}),"\n"]}),"\n",(0,r.jsx)(t.h2,{id:"\u30e1\u30ea\u30c3\u30c8\u3068\u30c7\u30e1\u30ea\u30c3\u30c8",children:"\u30e1\u30ea\u30c3\u30c8\u3068\u30c7\u30e1\u30ea\u30c3\u30c8"}),"\n",(0,r.jsx)(t.h3,{id:"\u30e1\u30ea\u30c3\u30c8",children:"\u30e1\u30ea\u30c3\u30c8:"}),"\n",(0,r.jsxs)(t.ol,{children:["\n",(0,r.jsx)(t.li,{children:"\u7d71\u5408\u30e2\u30cb\u30bf\u30ea\u30f3\u30b0: EKS EC2 \u3068 Fargate \u30ef\u30fc\u30af\u30ed\u30fc\u30c9\u306b\u308f\u305f\u3063\u3066\u4e00\u8cab\u3057\u305f\u30e2\u30cb\u30bf\u30ea\u30f3\u30b0\u4f53\u9a13\u3092\u63d0\u4f9b\u3057\u307e\u3059\u3002"}),"\n",(0,r.jsx)(t.li,{children:"\u30b9\u30b1\u30fc\u30e9\u30d3\u30ea\u30c6\u30a3: \u5358\u4e00\u306e ADOT Collector \u30a4\u30f3\u30b9\u30bf\u30f3\u30b9\u3067\u3001EKS \u30af\u30e9\u30b9\u30bf\u30fc\u5185\u306e\u3059\u3079\u3066\u306e\u30ef\u30fc\u30ab\u30fc\u30ce\u30fc\u30c9\u3092\u767a\u898b\u3057\u3001\u30e1\u30c8\u30ea\u30af\u30b9\u3092\u53ce\u96c6\u3067\u304d\u307e\u3059\u3002"}),"\n",(0,r.jsx)(t.li,{children:"\u8c4a\u5bcc\u306a\u30e1\u30c8\u30ea\u30af\u30b9: CPU\u3001\u30e1\u30e2\u30ea\u3001\u30c7\u30a3\u30b9\u30af\u3001\u30cd\u30c3\u30c8\u30ef\u30fc\u30af\u4f7f\u7528\u91cf\u3092\u542b\u3080\u5305\u62ec\u7684\u306a\u30b7\u30b9\u30c6\u30e0\u30e1\u30c8\u30ea\u30af\u30b9\u30bb\u30c3\u30c8\u3092\u53ce\u96c6\u3057\u307e\u3059\u3002"}),"\n",(0,r.jsx)(t.li,{children:"\u5bb9\u6613\u306a\u7d71\u5408: \u65e2\u5b58\u306e CloudWatch \u30c0\u30c3\u30b7\u30e5\u30dc\u30fc\u30c9\u3084\u30a2\u30e9\u30fc\u30e0\u3068\u30b7\u30fc\u30e0\u30ec\u30b9\u306b\u7d71\u5408\u3067\u304d\u307e\u3059\u3002"}),"\n",(0,r.jsx)(t.li,{children:"\u30b3\u30b9\u30c8\u52b9\u7387: \u8ffd\u52a0\u306e\u30e2\u30cb\u30bf\u30ea\u30f3\u30b0\u30a4\u30f3\u30d5\u30e9\u30b9\u30c8\u30e9\u30af\u30c1\u30e3\u306a\u3057\u3067 Fargate \u30ef\u30fc\u30af\u30ed\u30fc\u30c9\u306e\u30e2\u30cb\u30bf\u30ea\u30f3\u30b0\u304c\u53ef\u80fd\u3067\u3059\u3002"}),"\n"]}),"\n",(0,r.jsx)(t.h3,{id:"\u30c7\u30e1\u30ea\u30c3\u30c8",children:"\u30c7\u30e1\u30ea\u30c3\u30c8\uff1a"}),"\n",(0,r.jsxs)(t.ol,{children:["\n",(0,r.jsx)(t.li,{children:"\u8a2d\u5b9a\u306e\u8907\u96d1\u3055\uff1aADOT Collector \u306e\u30bb\u30c3\u30c8\u30a2\u30c3\u30d7\u306b\u306f\u3001IAM \u30ed\u30fc\u30eb\u3001Fargate \u30d7\u30ed\u30d5\u30a1\u30a4\u30eb\u3001Kubernetes \u30ea\u30bd\u30fc\u30b9\u306e\u614e\u91cd\u306a\u8a2d\u5b9a\u304c\u5fc5\u8981\u3067\u3059\u3002"}),"\n",(0,r.jsx)(t.li,{children:"\u30ea\u30bd\u30fc\u30b9\u306e\u30aa\u30fc\u30d0\u30fc\u30d8\u30c3\u30c9\uff1aADOT Collector \u81ea\u4f53\u304c Fargate \u30af\u30e9\u30b9\u30bf\u30fc\u306e\u30ea\u30bd\u30fc\u30b9\u3092\u6d88\u8cbb\u3059\u308b\u305f\u3081\u3001\u30ad\u30e3\u30d1\u30b7\u30c6\u30a3\u30d7\u30e9\u30f3\u30cb\u30f3\u30b0\u3067\u8003\u616e\u3059\u308b\u5fc5\u8981\u304c\u3042\u308a\u307e\u3059\u3002"}),"\n"]}),"\n",(0,r.jsx)(t.p,{children:"AWS Distro for OpenTelemetry \u3068 CloudWatch Container Insights \u306e EKS Fargate \u30ef\u30fc\u30af\u30ed\u30fc\u30c9\u5411\u3051\u7d71\u5408\u306f\u3001\u30b3\u30f3\u30c6\u30ca\u5316\u3055\u308c\u305f\u30a2\u30d7\u30ea\u30b1\u30fc\u30b7\u30e7\u30f3\u306e\u30e2\u30cb\u30bf\u30ea\u30f3\u30b0\u306b\u5f37\u529b\u306a\u30bd\u30ea\u30e5\u30fc\u30b7\u30e7\u30f3\u3092\u63d0\u4f9b\u3057\u307e\u3059\u3002\n\u3053\u308c\u306f\u3001\u7570\u306a\u308b EKS \u30c7\u30d7\u30ed\u30a4\u30e1\u30f3\u30c8\u30aa\u30d7\u30b7\u30e7\u30f3\u5168\u4f53\u3067\u7d71\u4e00\u3055\u308c\u305f\u30e2\u30cb\u30bf\u30ea\u30f3\u30b0\u4f53\u9a13\u3092\u63d0\u4f9b\u3057\u3001OpenTelemetry \u30d5\u30ec\u30fc\u30e0\u30ef\u30fc\u30af\u306e\u30b9\u30b1\u30fc\u30e9\u30d3\u30ea\u30c6\u30a3\u3068\u67d4\u8edf\u6027\u3092\u6d3b\u7528\u3057\u307e\u3059\u3002\nFargate \u30ef\u30fc\u30af\u30ed\u30fc\u30c9\u304b\u3089\u30b7\u30b9\u30c6\u30e0\u30e1\u30c8\u30ea\u30af\u30b9\u306e\u53ce\u96c6\u3092\u53ef\u80fd\u306b\u3059\u308b\u3053\u3068\u3067\u3001\u3053\u306e\u7d71\u5408\u306b\u3088\u308a\u304a\u5ba2\u69d8\u306f\u30a2\u30d7\u30ea\u30b1\u30fc\u30b7\u30e7\u30f3\u306e\u30d1\u30d5\u30a9\u30fc\u30de\u30f3\u30b9\u306b\u3064\u3044\u3066\u3088\u308a\u6df1\u3044\u6d1e\u5bdf\u3092\u5f97\u3066\u3001\u60c5\u5831\u306b\u57fa\u3065\u3044\u305f\u30b9\u30b1\u30fc\u30ea\u30f3\u30b0\u306e\u6c7a\u5b9a\u3092\u884c\u3044\u3001\u30ea\u30bd\u30fc\u30b9\u5229\u7528\u3092\u6700\u9069\u5316\u3059\u308b\u3053\u3068\u304c\u3067\u304d\u307e\u3059\u3002"})]})}function h(e={}){const{wrapper:t}={...(0,s.R)(),...e.components};return t?(0,r.jsx)(t,{...e,children:(0,r.jsx)(d,{...e})}):d(e)}},83205:(e,t,n)=>{n.d(t,{A:()=>r});const r=n.p+"assets/images/cieksfargateadot-04ff0a5dd8133fec00159ed14705ee18.png"}}]);
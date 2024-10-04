"use strict";(self.webpackChunkobservability_best_practices=self.webpackChunkobservability_best_practices||[]).push([[4566],{27378:(e,t,r)=>{r.r(t),r.d(t,{assets:()=>n,contentTitle:()=>i,default:()=>u,frontMatter:()=>s,metadata:()=>c,toc:()=>l});var a=r(74848),o=r(28453);const s={},i="AWS Observability Accelerator",c={id:"tools/observability_accelerator",title:"AWS Observability Accelerator",description:"AWS Observability Accelerator \u306f\u3001Amazon Managed Service for Prometheus\u3001Amazon Managed Grafana\u3001AWS Distro for OpenTelemetry(ADOT)\u3001Amazon CloudWatch \u306a\u3069\u306e AWS \u30cd\u30a4\u30c6\u30a3\u30d6\u30b5\u30fc\u30d3\u30b9\u3068 AWS \u7ba1\u7406\u578b\u306e\u30aa\u30d6\u30b6\u30fc\u30d0\u30d3\u30ea\u30c6\u30a3\u30b5\u30fc\u30d3\u30b9\u3092\u4f7f\u7528\u3057\u3066\u3001AWS \u74b0\u5883\u306e\u305f\u3081\u306e\u30aa\u30d6\u30b6\u30fc\u30d0\u30d3\u30ea\u30c6\u30a3\u3092\u8a2d\u5b9a\u3059\u308b\u306e\u306b\u5f79\u7acb\u3064\u3001\u610f\u898b\u306e\u3042\u308b\u30e2\u30b8\u30e5\u30fc\u30eb\u306e\u30bb\u30c3\u30c8\u3067\u3059\u3002",source:"@site/i18n/ja/docusaurus-plugin-content-docs/current/tools/observability_accelerator.md",sourceDirName:"tools",slug:"/tools/observability_accelerator",permalink:"/observability-best-practices/ja/tools/observability_accelerator",draft:!1,unlisted:!1,editUrl:"https://github.com/aws-observability/observability-best-practices/blob/main/docusaurus/docs/tools/observability_accelerator.md",tags:[],version:"current",frontMatter:{},sidebar:"tools",next:{title:"CloudWatch \u30a8\u30fc\u30b8\u30a7\u30f3\u30c8",permalink:"/observability-best-practices/ja/tools/cloudwatch_agent"}},n={},l=[];function b(e){const t={a:"a",h1:"h1",p:"p",...(0,o.R)(),...e.components};return(0,a.jsxs)(a.Fragment,{children:[(0,a.jsx)(t.h1,{id:"aws-observability-accelerator",children:"AWS Observability Accelerator"}),"\n",(0,a.jsx)(t.p,{children:"AWS Observability Accelerator \u306f\u3001Amazon Managed Service for Prometheus\u3001Amazon Managed Grafana\u3001AWS Distro for OpenTelemetry(ADOT)\u3001Amazon CloudWatch \u306a\u3069\u306e AWS \u30cd\u30a4\u30c6\u30a3\u30d6\u30b5\u30fc\u30d3\u30b9\u3068 AWS \u7ba1\u7406\u578b\u306e\u30aa\u30d6\u30b6\u30fc\u30d0\u30d3\u30ea\u30c6\u30a3\u30b5\u30fc\u30d3\u30b9\u3092\u4f7f\u7528\u3057\u3066\u3001AWS \u74b0\u5883\u306e\u305f\u3081\u306e\u30aa\u30d6\u30b6\u30fc\u30d0\u30d3\u30ea\u30c6\u30a3\u3092\u8a2d\u5b9a\u3059\u308b\u306e\u306b\u5f79\u7acb\u3064\u3001\u610f\u898b\u306e\u3042\u308b\u30e2\u30b8\u30e5\u30fc\u30eb\u306e\u30bb\u30c3\u30c8\u3067\u3059\u3002"}),"\n",(0,a.jsx)(t.p,{children:"EKS \u30a4\u30f3\u30d5\u30e9\u3001Java/JMX\u3001NGINX \u30d9\u30fc\u30b9\u306e\u30ef\u30fc\u30af\u30ed\u30fc\u30c9\u3001\u30ab\u30b9\u30bf\u30e0\u30a2\u30d7\u30ea\u30b1\u30fc\u30b7\u30e7\u30f3\u306e\u305f\u3081\u306b\u3001\u30ad\u30e5\u30ec\u30fc\u30b7\u30e7\u30f3\u3055\u308c\u305f\u30e1\u30c8\u30ea\u30af\u30b9\u3001\u30ed\u30b0\u3001\u30c8\u30ec\u30fc\u30b9\u306e\u53ce\u96c6\u3001CloudWatch \u30c0\u30c3\u30b7\u30e5\u30dc\u30fc\u30c9\u3001\u30a2\u30e9\u30fc\u30c8\u30eb\u30fc\u30eb\u3001Grafana \u30c0\u30c3\u30b7\u30e5\u30dc\u30fc\u30c9\u3092\u63d0\u4f9b\u3057\u307e\u3059\u3002"}),"\n",(0,a.jsxs)(t.p,{children:["AWS Observability Accelerator \u306f\u3001",(0,a.jsx)(t.a,{href:"https://github.com/aws-observability/terraform-aws-observability-accelerator",children:"Terraform"})," \u3068 ",(0,a.jsx)(t.a,{href:"https://github.com/aws-observability/cdk-aws-observability-accelerator",children:"CDK"})," \u30d7\u30ed\u30b8\u30a7\u30af\u30c8\u306e\u305f\u3081\u306e\u5171\u6709\u30a2\u30fc\u30c6\u30a3\u30d5\u30a1\u30af\u30c8(\u30c9\u30ad\u30e5\u30e1\u30f3\u30c8\u3001\u30c0\u30c3\u30b7\u30e5\u30dc\u30fc\u30c9\u3001\u30a2\u30e9\u30fc\u30c8\u30eb\u30fc\u30eb)\u3092\u63d0\u4f9b\u3057\u307e\u3059\u3002"]}),"\n",(0,a.jsxs)(t.p,{children:[(0,a.jsx)(t.a,{href:"https://aws-observability.github.io/terraform-aws-observability-accelerator/",children:"Terraform"})," \u3068 ",(0,a.jsx)(t.a,{href:"https://aws-observability.github.io/cdk-aws-observability-accelerator/",children:"CDK"})," \u30d7\u30ed\u30b8\u30a7\u30af\u30c8\u306e\u8a73\u7d30\u306b\u3064\u3044\u3066\u306f\u3001\u30d7\u30ed\u30b8\u30a7\u30af\u30c8\u306e\u30c9\u30ad\u30e5\u30e1\u30f3\u30c8\u3092\u3054\u89a7\u304f\u3060\u3055\u3044\u3002"]})]})}function u(e={}){const{wrapper:t}={...(0,o.R)(),...e.components};return t?(0,a.jsx)(t,{...e,children:(0,a.jsx)(b,{...e})}):b(e)}},28453:(e,t,r)=>{r.d(t,{R:()=>i,x:()=>c});var a=r(96540);const o={},s=a.createContext(o);function i(e){const t=a.useContext(s);return a.useMemo((function(){return"function"==typeof e?e(t):{...t,...e}}),[t,e])}function c(e){let t;return t=e.disableParentContext?"function"==typeof e.components?e.components(o):e.components||o:i(e.components),a.createElement(s.Provider,{value:t},e.children)}}}]);
"use strict";(self.webpackChunkobservability_best_practices=self.webpackChunkobservability_best_practices||[]).push([[2981],{714:(e,s,n)=>{n.d(s,{A:()=>r});const r=n.p+"assets/files/adot-collector-ec2-d0b7012e102e6d72c630d55ed303274e.yaml"},24032:(e,s,n)=>{n.d(s,{A:()=>r});const r=n.p+"assets/files/prometheus-sample-app-dashboard-a6a9aaa9da6bca2bf2532ee0e324a8eb.json"},28453:(e,s,n)=>{n.d(s,{R:()=>t,x:()=>i});var r=n(96540);const a={},c=r.createContext(a);function t(e){const s=r.useContext(c);return r.useMemo((function(){return"function"==typeof e?e(s):{...s,...e}}),[s,e])}function i(e){let s;return s=e.disableParentContext?"function"==typeof e.components?e.components(a):e.components||a:t(e.components),r.createElement(c.Provider,{value:s},e.children)}},29614:(e,s,n)=>{n.d(s,{A:()=>r});const r=n.p+"assets/files/cluster-config-87ec9c5286dd5277c7626950a47b82c8.yaml"},37902:(e,s,n)=>{n.d(s,{A:()=>r});const r=n.p+"assets/files/prometheus-sample-app-86a325cf076a1dab0f760adedc8a6492.yaml"},73215:(e,s,n)=>{n.d(s,{A:()=>r});const r=n.p+"assets/images/adot-metrics-pipeline-60be81f1e6633017f92dce2bbe7cbd51.png"},89376:(e,s,n)=>{n.r(s),n.d(s,{assets:()=>o,contentTitle:()=>i,default:()=>h,frontMatter:()=>t,metadata:()=>r,toc:()=>l});const r=JSON.parse('{"id":"recipes/recipes/ec2-eks-metrics-go-adot-ampamg","title":"EKS on EC2 \u3067 AWS Distro for OpenTelemetry \u3092\u4f7f\u7528\u3057\u3001Amazon Managed Service for Prometheus \u3068\u9023\u643a\u3059\u308b","description":"\u3053\u306e\u30ec\u30b7\u30d4\u3067\u306f\u3001\u30b5\u30f3\u30d7\u30eb Go \u30a2\u30d7\u30ea\u30b1\u30fc\u30b7\u30e7\u30f3\u306b\u8a08\u88c5\u3092\u884c\u3044\u3001AWS Distro for OpenTelemetry (ADOT) \u3092\u4f7f\u7528\u3057\u3066 Amazon Managed Service for Prometheus (AMP) \u306b\u30e1\u30c8\u30ea\u30af\u30b9\u3092\u53d6\u308a\u8fbc\u3080\u65b9\u6cd5\u3092\u7d39\u4ecb\u3057\u307e\u3059\u3002","source":"@site/i18n/ja/docusaurus-plugin-content-docs/current/recipes/recipes/ec2-eks-metrics-go-adot-ampamg.md","sourceDirName":"recipes/recipes","slug":"/recipes/recipes/ec2-eks-metrics-go-adot-ampamg","permalink":"/observability-best-practices/ja/recipes/recipes/ec2-eks-metrics-go-adot-ampamg","draft":false,"unlisted":false,"editUrl":"https://github.com/aws-observability/observability-best-practices/blob/main/docusaurus/docs/recipes/recipes/ec2-eks-metrics-go-adot-ampamg.md","tags":[],"version":"current","frontMatter":{}}');var a=n(74848),c=n(28453);const t={},i="EKS on EC2 \u3067 AWS Distro for OpenTelemetry \u3092\u4f7f\u7528\u3057\u3001Amazon Managed Service for Prometheus \u3068\u9023\u643a\u3059\u308b",o={},l=[{value:"\u30a4\u30f3\u30d5\u30e9\u30b9\u30c8\u30e9\u30af\u30c1\u30e3",id:"\u30a4\u30f3\u30d5\u30e9\u30b9\u30c8\u30e9\u30af\u30c1\u30e3",level:2},{value:"\u30a2\u30fc\u30ad\u30c6\u30af\u30c1\u30e3",id:"\u30a2\u30fc\u30ad\u30c6\u30af\u30c1\u30e3",level:3},{value:"\u524d\u63d0\u6761\u4ef6",id:"\u524d\u63d0\u6761\u4ef6",level:3},{value:"EC2 \u4e0a\u306b EKS \u30af\u30e9\u30b9\u30bf\u30fc\u3092\u4f5c\u6210\u3059\u308b",id:"ec2-\u4e0a\u306b-eks-\u30af\u30e9\u30b9\u30bf\u30fc\u3092\u4f5c\u6210\u3059\u308b",level:3},{value:"ECR \u30ea\u30dd\u30b8\u30c8\u30ea\u306e\u30bb\u30c3\u30c8\u30a2\u30c3\u30d7",id:"ecr-\u30ea\u30dd\u30b8\u30c8\u30ea\u306e\u30bb\u30c3\u30c8\u30a2\u30c3\u30d7",level:3},{value:"AMP \u306e\u30bb\u30c3\u30c8\u30a2\u30c3\u30d7",id:"amp-\u306e\u30bb\u30c3\u30c8\u30a2\u30c3\u30d7",level:3},{value:"ADOT Collector \u306e\u30bb\u30c3\u30c8\u30a2\u30c3\u30d7",id:"adot-collector-\u306e\u30bb\u30c3\u30c8\u30a2\u30c3\u30d7",level:3},{value:"AMG \u306e\u30bb\u30c3\u30c8\u30a2\u30c3\u30d7",id:"amg-\u306e\u30bb\u30c3\u30c8\u30a2\u30c3\u30d7",level:3},{value:"\u30a2\u30d7\u30ea\u30b1\u30fc\u30b7\u30e7\u30f3",id:"\u30a2\u30d7\u30ea\u30b1\u30fc\u30b7\u30e7\u30f3",level:2},{value:"\u30b3\u30f3\u30c6\u30ca\u30a4\u30e1\u30fc\u30b8\u306e\u30d3\u30eb\u30c9",id:"\u30b3\u30f3\u30c6\u30ca\u30a4\u30e1\u30fc\u30b8\u306e\u30d3\u30eb\u30c9",level:3},{value:"\u30b5\u30f3\u30d7\u30eb\u30a2\u30d7\u30ea\u306e\u30c7\u30d7\u30ed\u30a4",id:"\u30b5\u30f3\u30d7\u30eb\u30a2\u30d7\u30ea\u306e\u30c7\u30d7\u30ed\u30a4",level:3},{value:"\u30a8\u30f3\u30c9\u30fb\u30c4\u30fc\u30fb\u30a8\u30f3\u30c9",id:"\u30a8\u30f3\u30c9\u30c4\u30fc\u30a8\u30f3\u30c9",level:2},{value:"\u30d1\u30a4\u30d7\u30e9\u30a4\u30f3\u304c\u6a5f\u80fd\u3057\u3066\u3044\u308b\u3053\u3068\u3092\u78ba\u8a8d\u3059\u308b",id:"\u30d1\u30a4\u30d7\u30e9\u30a4\u30f3\u304c\u6a5f\u80fd\u3057\u3066\u3044\u308b\u3053\u3068\u3092\u78ba\u8a8d\u3059\u308b",level:3},{value:"Grafana \u30c0\u30c3\u30b7\u30e5\u30dc\u30fc\u30c9\u306e\u4f5c\u6210",id:"grafana-\u30c0\u30c3\u30b7\u30e5\u30dc\u30fc\u30c9\u306e\u4f5c\u6210",level:3},{value:"\u30af\u30ea\u30fc\u30f3\u30a2\u30c3\u30d7",id:"\u30af\u30ea\u30fc\u30f3\u30a2\u30c3\u30d7",level:2}];function d(e){const s={a:"a",admonition:"admonition",code:"code",h1:"h1",h2:"h2",h3:"h3",header:"header",img:"img",li:"li",ol:"ol",p:"p",pre:"pre",ul:"ul",...(0,c.R)(),...e.components};return(0,a.jsxs)(a.Fragment,{children:[(0,a.jsx)(s.header,{children:(0,a.jsx)(s.h1,{id:"eks-on-ec2-\u3067-aws-distro-for-opentelemetry-\u3092\u4f7f\u7528\u3057amazon-managed-service-for-prometheus-\u3068\u9023\u643a\u3059\u308b",children:"EKS on EC2 \u3067 AWS Distro for OpenTelemetry \u3092\u4f7f\u7528\u3057\u3001Amazon Managed Service for Prometheus \u3068\u9023\u643a\u3059\u308b"})}),"\n",(0,a.jsxs)(s.p,{children:["\u3053\u306e\u30ec\u30b7\u30d4\u3067\u306f\u3001",(0,a.jsx)(s.a,{href:"https://github.com/aws-observability/aws-otel-community/tree/master/sample-apps/prometheus-sample-app",children:"\u30b5\u30f3\u30d7\u30eb Go \u30a2\u30d7\u30ea\u30b1\u30fc\u30b7\u30e7\u30f3"}),"\u306b\u8a08\u88c5\u3092\u884c\u3044\u3001",(0,a.jsx)(s.a,{href:"https://aws.amazon.com/jp/otel",children:"AWS Distro for OpenTelemetry (ADOT)"})," \u3092\u4f7f\u7528\u3057\u3066 ",(0,a.jsx)(s.a,{href:"https://aws.amazon.com/jp/prometheus/",children:"Amazon Managed Service for Prometheus (AMP)"})," \u306b\u30e1\u30c8\u30ea\u30af\u30b9\u3092\u53d6\u308a\u8fbc\u3080\u65b9\u6cd5\u3092\u7d39\u4ecb\u3057\u307e\u3059\u3002\n\u305d\u3057\u3066\u3001",(0,a.jsx)(s.a,{href:"https://aws.amazon.com/jp/grafana/",children:"Amazon Managed Grafana (AMG)"})," \u3092\u4f7f\u7528\u3057\u3066\u30e1\u30c8\u30ea\u30af\u30b9\u3092\u53ef\u8996\u5316\u3057\u307e\u3059\u3002"]}),"\n",(0,a.jsxs)(s.p,{children:["\u5b8c\u5168\u306a\u30b7\u30ca\u30ea\u30aa\u3092\u793a\u3059\u305f\u3081\u306b\u3001",(0,a.jsx)(s.a,{href:"https://aws.amazon.com/jp/eks/",children:"Amazon Elastic Kubernetes Service (EKS)"})," on EC2 \u30af\u30e9\u30b9\u30bf\u30fc\u3068 ",(0,a.jsx)(s.a,{href:"https://aws.amazon.com/jp/ecr/",children:"Amazon Elastic Container Registry (ECR)"})," \u30ea\u30dd\u30b8\u30c8\u30ea\u3092\u30bb\u30c3\u30c8\u30a2\u30c3\u30d7\u3057\u307e\u3059\u3002"]}),"\n",(0,a.jsx)(s.admonition,{type:"note",children:(0,a.jsx)(s.p,{children:"\u3053\u306e\u30ac\u30a4\u30c9\u306f\u5b8c\u4e86\u307e\u3067\u306b\u7d04 1 \u6642\u9593\u304b\u304b\u308a\u307e\u3059\u3002"})}),"\n",(0,a.jsx)(s.h2,{id:"\u30a4\u30f3\u30d5\u30e9\u30b9\u30c8\u30e9\u30af\u30c1\u30e3",children:"\u30a4\u30f3\u30d5\u30e9\u30b9\u30c8\u30e9\u30af\u30c1\u30e3"}),"\n",(0,a.jsx)(s.p,{children:"\u4ee5\u4e0b\u306e\u30bb\u30af\u30b7\u30e7\u30f3\u3067\u306f\u3001\u3053\u306e\u30ec\u30b7\u30d4\u306e\u30a4\u30f3\u30d5\u30e9\u30b9\u30c8\u30e9\u30af\u30c1\u30e3\u3092\u30bb\u30c3\u30c8\u30a2\u30c3\u30d7\u3057\u307e\u3059\u3002"}),"\n",(0,a.jsx)(s.h3,{id:"\u30a2\u30fc\u30ad\u30c6\u30af\u30c1\u30e3",children:"\u30a2\u30fc\u30ad\u30c6\u30af\u30c1\u30e3"}),"\n",(0,a.jsxs)(s.p,{children:["ADOT \u30d1\u30a4\u30d7\u30e9\u30a4\u30f3\u3092\u4f7f\u7528\u3059\u308b\u3053\u3068\u3067\u3001",(0,a.jsx)(s.a,{href:"https://github.com/aws-observability/aws-otel-collector",children:"ADOT Collector"})," \u3092\u5229\u7528\u3057\u3066 Prometheus \u3067\u8a08\u88c5\u3055\u308c\u305f\u30a2\u30d7\u30ea\u30b1\u30fc\u30b7\u30e7\u30f3\u304b\u3089\u30e1\u30c8\u30ea\u30af\u30b9\u3092\u53ce\u96c6\u3057\u3001\u53ce\u96c6\u3057\u305f\u30e1\u30c8\u30ea\u30af\u30b9\u3092 Amazon Managed Service for Prometheus \u306b\u53d6\u308a\u8fbc\u3080\u3053\u3068\u304c\u3067\u304d\u307e\u3059\u3002"]}),"\n",(0,a.jsx)(s.p,{children:(0,a.jsx)(s.img,{alt:"Architecture",src:n(73215).A+"",width:"1020",height:"322"})}),"\n",(0,a.jsx)(s.p,{children:"ADOT Collector \u306b\u306f\u3001Prometheus \u306b\u7279\u5316\u3057\u305f 2 \u3064\u306e\u30b3\u30f3\u30dd\u30fc\u30cd\u30f3\u30c8\u304c\u542b\u307e\u308c\u3066\u3044\u307e\u3059\uff1a"}),"\n",(0,a.jsxs)(s.ul,{children:["\n",(0,a.jsx)(s.li,{children:"Prometheus Receiver"}),"\n",(0,a.jsx)(s.li,{children:"AWS Prometheus Remote Write Exporter"}),"\n"]}),"\n",(0,a.jsx)(s.admonition,{type:"info",children:(0,a.jsxs)(s.p,{children:["Prometheus Remote Write Exporter \u306e\u8a73\u7d30\u306b\u3064\u3044\u3066\u306f\u3001\u4ee5\u4e0b\u3092\u3054\u89a7\u304f\u3060\u3055\u3044\uff1a\n",(0,a.jsx)(s.a,{href:"https://aws-otel.github.io/docs/getting-started/prometheus-remote-write-exporter",children:"Getting Started with Prometheus Remote Write Exporter for AMP"})]})}),"\n",(0,a.jsx)(s.h3,{id:"\u524d\u63d0\u6761\u4ef6",children:"\u524d\u63d0\u6761\u4ef6"}),"\n",(0,a.jsxs)(s.ul,{children:["\n",(0,a.jsxs)(s.li,{children:["AWS CLI \u304c\u74b0\u5883\u306b",(0,a.jsx)(s.a,{href:"https://docs.aws.amazon.com/ja_jp/cli/latest/userguide/cli-chap-install.html",children:"\u30a4\u30f3\u30b9\u30c8\u30fc\u30eb"}),"\u3055\u308c\u3001",(0,a.jsx)(s.a,{href:"https://docs.aws.amazon.com/ja_jp/cli/latest/userguide/cli-chap-configure.html",children:"\u8a2d\u5b9a"}),"\u3055\u308c\u3066\u3044\u308b\u3053\u3068\u3002"]}),"\n",(0,a.jsxs)(s.li,{children:["\u74b0\u5883\u306b ",(0,a.jsx)(s.a,{href:"https://docs.aws.amazon.com/ja_jp/eks/latest/userguide/eksctl.html",children:"eksctl"})," \u30b3\u30de\u30f3\u30c9\u3092\u30a4\u30f3\u30b9\u30c8\u30fc\u30eb\u3059\u308b\u5fc5\u8981\u304c\u3042\u308a\u307e\u3059\u3002"]}),"\n",(0,a.jsxs)(s.li,{children:["\u74b0\u5883\u306b ",(0,a.jsx)(s.a,{href:"https://docs.aws.amazon.com/ja_jp/eks/latest/userguide/install-kubectl.html",children:"kubectl"})," \u3092\u30a4\u30f3\u30b9\u30c8\u30fc\u30eb\u3059\u308b\u5fc5\u8981\u304c\u3042\u308a\u307e\u3059\u3002"]}),"\n",(0,a.jsxs)(s.li,{children:["\u74b0\u5883\u306b ",(0,a.jsx)(s.a,{href:"https://docs.docker.com/get-docker/",children:"docker"})," \u304c\u30a4\u30f3\u30b9\u30c8\u30fc\u30eb\u3055\u308c\u3066\u3044\u308b\u3053\u3068\u3002"]}),"\n"]}),"\n",(0,a.jsx)(s.h3,{id:"ec2-\u4e0a\u306b-eks-\u30af\u30e9\u30b9\u30bf\u30fc\u3092\u4f5c\u6210\u3059\u308b",children:"EC2 \u4e0a\u306b EKS \u30af\u30e9\u30b9\u30bf\u30fc\u3092\u4f5c\u6210\u3059\u308b"}),"\n",(0,a.jsxs)(s.p,{children:["\u3053\u306e\u30ec\u30b7\u30d4\u306e\u30c7\u30e2\u30a2\u30d7\u30ea\u30b1\u30fc\u30b7\u30e7\u30f3\u306f EKS \u4e0a\u3067\u5b9f\u884c\u3055\u308c\u307e\u3059\u3002\n\u65e2\u5b58\u306e EKS \u30af\u30e9\u30b9\u30bf\u30fc\u3092\u4f7f\u7528\u3059\u308b\u304b\u3001",(0,a.jsx)(s.a,{target:"_blank","data-noBrokenLinkCheck":!0,href:n(29614).A+"",children:"cluster-config.yaml"})," \u3092\u4f7f\u7528\u3057\u3066\u65b0\u3057\u3044\u30af\u30e9\u30b9\u30bf\u30fc\u3092\u4f5c\u6210\u3059\u308b\u3053\u3068\u304c\u3067\u304d\u307e\u3059\u3002"]}),"\n",(0,a.jsxs)(s.p,{children:["\u3053\u306e\u30c6\u30f3\u30d7\u30ec\u30fc\u30c8\u306f\u30012 \u3064\u306e EC2 ",(0,a.jsx)(s.code,{children:"t2.large"})," \u30ce\u30fc\u30c9\u3092\u6301\u3064\u65b0\u3057\u3044\u30af\u30e9\u30b9\u30bf\u30fc\u3092\u4f5c\u6210\u3057\u307e\u3059\u3002"]}),"\n",(0,a.jsxs)(s.p,{children:["\u30c6\u30f3\u30d7\u30ec\u30fc\u30c8\u30d5\u30a1\u30a4\u30eb\u3092\u7de8\u96c6\u3057\u3001",(0,a.jsx)(s.code,{children:"<YOUR_REGION>"})," \u3092 ",(0,a.jsx)(s.a,{href:"https://docs.aws.amazon.com/ja_jp/prometheus/latest/userguide/what-is-Amazon-Managed-Service-Prometheus.html",children:"AMP \u304c\u30b5\u30dd\u30fc\u30c8\u3057\u3066\u3044\u308b\u30ea\u30fc\u30b8\u30e7\u30f3"})," \u306e\u3044\u305a\u308c\u304b\u306b\u8a2d\u5b9a\u3057\u3066\u304f\u3060\u3055\u3044\u3002"]}),"\n",(0,a.jsxs)(s.p,{children:["\u30bb\u30c3\u30b7\u30e7\u30f3\u3067 ",(0,a.jsx)(s.code,{children:"<YOUR_REGION>"})," \u3092\u4e0a\u66f8\u304d\u3057\u3066\u304f\u3060\u3055\u3044\u3002\u4f8b\u3048\u3070\u3001bash \u3067\u306f\u4ee5\u4e0b\u306e\u3088\u3046\u306b\u3057\u307e\u3059\uff1a"]}),"\n",(0,a.jsx)(s.pre,{children:(0,a.jsx)(s.code,{children:"export AWS_DEFAULT_REGION=<YOUR_REGION>\n"})}),"\n",(0,a.jsx)(s.p,{children:"\u4ee5\u4e0b\u306e\u30b3\u30de\u30f3\u30c9\u3092\u4f7f\u7528\u3057\u3066\u30af\u30e9\u30b9\u30bf\u30fc\u3092\u4f5c\u6210\u3057\u307e\u3059\u3002"}),"\n",(0,a.jsx)(s.pre,{children:(0,a.jsx)(s.code,{children:"eksctl create cluster -f cluster-config.yaml\n"})}),"\n",(0,a.jsx)(s.h3,{id:"ecr-\u30ea\u30dd\u30b8\u30c8\u30ea\u306e\u30bb\u30c3\u30c8\u30a2\u30c3\u30d7",children:"ECR \u30ea\u30dd\u30b8\u30c8\u30ea\u306e\u30bb\u30c3\u30c8\u30a2\u30c3\u30d7"}),"\n",(0,a.jsxs)(s.p,{children:["EKS \u306b\u30a2\u30d7\u30ea\u30b1\u30fc\u30b7\u30e7\u30f3\u3092\u30c7\u30d7\u30ed\u30a4\u3059\u308b\u306b\u306f\u3001\u30b3\u30f3\u30c6\u30ca\u30ec\u30b8\u30b9\u30c8\u30ea\u304c\u5fc5\u8981\u3067\u3059\u3002\n\u4ee5\u4e0b\u306e\u30b3\u30de\u30f3\u30c9\u3092\u4f7f\u7528\u3057\u3066\u3001\u30a2\u30ab\u30a6\u30f3\u30c8\u306b\u65b0\u3057\u3044 ECR \u30ec\u30b8\u30b9\u30c8\u30ea\u3092\u4f5c\u6210\u3067\u304d\u307e\u3059\u3002\n",(0,a.jsx)(s.code,{children:"<YOUR_REGION>"})," \u3082\u5fc5\u305a\u8a2d\u5b9a\u3057\u3066\u304f\u3060\u3055\u3044\u3002"]}),"\n",(0,a.jsx)(s.pre,{children:(0,a.jsx)(s.code,{children:"aws ecr create-repository \\\n    --repository-name prometheus-sample-app \\\n    --image-scanning-configuration scanOnPush=true \\\n    --region <YOUR_REGION>\n"})}),"\n",(0,a.jsx)(s.h3,{id:"amp-\u306e\u30bb\u30c3\u30c8\u30a2\u30c3\u30d7",children:"AMP \u306e\u30bb\u30c3\u30c8\u30a2\u30c3\u30d7"}),"\n",(0,a.jsx)(s.p,{children:"AWS CLI \u3092\u4f7f\u7528\u3057\u3066\u30ef\u30fc\u30af\u30b9\u30da\u30fc\u30b9\u3092\u4f5c\u6210\u3057\u307e\u3059"}),"\n",(0,a.jsx)(s.pre,{children:(0,a.jsx)(s.code,{children:"aws amp create-workspace --alias prometheus-sample-app\n"})}),"\n",(0,a.jsx)(s.p,{children:"\u4ee5\u4e0b\u306e\u30b3\u30de\u30f3\u30c9\u3092\u4f7f\u7528\u3057\u3066\u30ef\u30fc\u30af\u30b9\u30da\u30fc\u30b9\u304c\u4f5c\u6210\u3055\u308c\u305f\u3053\u3068\u3092\u78ba\u8a8d\u3057\u307e\u3059\uff1a"}),"\n",(0,a.jsx)(s.pre,{children:(0,a.jsx)(s.code,{children:"aws amp list-workspaces\n"})}),"\n",(0,a.jsx)(s.admonition,{type:"info",children:(0,a.jsxs)(s.p,{children:["\u8a73\u7d30\u306b\u3064\u3044\u3066\u306f\u3001",(0,a.jsx)(s.a,{href:"https://docs.aws.amazon.com/ja_jp/prometheus/latest/userguide/AMP-getting-started.html",children:"AMP \u5165\u9580\u30ac\u30a4\u30c9"}),"\u3092\u3054\u89a7\u304f\u3060\u3055\u3044\u3002"]})}),"\n",(0,a.jsx)(s.h3,{id:"adot-collector-\u306e\u30bb\u30c3\u30c8\u30a2\u30c3\u30d7",children:"ADOT Collector \u306e\u30bb\u30c3\u30c8\u30a2\u30c3\u30d7"}),"\n",(0,a.jsxs)(s.p,{children:[(0,a.jsx)(s.a,{target:"_blank","data-noBrokenLinkCheck":!0,href:n(714).A+"",children:"adot-collector-ec2.yaml"})," \u3092\u30c0\u30a6\u30f3\u30ed\u30fc\u30c9\u3057\u3001\u6b21\u306e\u30b9\u30c6\u30c3\u30d7\u3067\u8aac\u660e\u3059\u308b\u30d1\u30e9\u30e1\u30fc\u30bf\u3067\u3053\u306e YAML \u30c9\u30ad\u30e5\u30e1\u30f3\u30c8\u3092\u7de8\u96c6\u3057\u307e\u3059\u3002"]}),"\n",(0,a.jsxs)(s.p,{children:["\u3053\u306e\u4f8b\u3067\u306f\u3001ADOT Collector \u306e\u8a2d\u5b9a\u3067\u30a2\u30ce\u30c6\u30fc\u30b7\u30e7\u30f3 ",(0,a.jsx)(s.code,{children:"(scrape=true)"})," \u3092\u4f7f\u7528\u3057\u3066\u3001\u30b9\u30af\u30ec\u30a4\u30d4\u30f3\u30b0\u3059\u308b\u30bf\u30fc\u30b2\u30c3\u30c8\u30a8\u30f3\u30c9\u30dd\u30a4\u30f3\u30c8\u3092\u6307\u5b9a\u3057\u3066\u3044\u307e\u3059\u3002\n\u3053\u308c\u306b\u3088\u308a\u3001ADOT Collector \u306f\u30af\u30e9\u30b9\u30bf\u30fc\u5185\u306e\u30b5\u30f3\u30d7\u30eb\u30a2\u30d7\u30ea\u306e\u30a8\u30f3\u30c9\u30dd\u30a4\u30f3\u30c8\u3092 ",(0,a.jsx)(s.code,{children:"kube-system"})," \u30a8\u30f3\u30c9\u30dd\u30a4\u30f3\u30c8\u3068\u533a\u5225\u3067\u304d\u307e\u3059\u3002\n\u5225\u306e\u30b5\u30f3\u30d7\u30eb\u30a2\u30d7\u30ea\u3092\u30b9\u30af\u30ec\u30a4\u30d4\u30f3\u30b0\u3057\u305f\u3044\u5834\u5408\u306f\u3001\u518d\u30e9\u30d9\u30eb\u8a2d\u5b9a\u304b\u3089\u3053\u308c\u3092\u524a\u9664\u3067\u304d\u307e\u3059\u3002"]}),"\n",(0,a.jsx)(s.p,{children:"\u30c0\u30a6\u30f3\u30ed\u30fc\u30c9\u3057\u305f\u30d5\u30a1\u30a4\u30eb\u3092\u74b0\u5883\u306b\u5408\u308f\u305b\u3066\u7de8\u96c6\u3059\u308b\u306b\u306f\u3001\u4ee5\u4e0b\u306e\u624b\u9806\u306b\u5f93\u3063\u3066\u304f\u3060\u3055\u3044\uff1a"}),"\n",(0,a.jsxs)(s.p,{children:["1. ",(0,a.jsx)(s.code,{children:"<YOUR_REGION>"})," \u3092\u73fe\u5728\u306e\u30ea\u30fc\u30b8\u30e7\u30f3\u306b\u7f6e\u304d\u63db\u3048\u307e\u3059\u3002"]}),"\n",(0,a.jsxs)(s.p,{children:["2. ",(0,a.jsx)(s.code,{children:"<YOUR_ENDPOINT>"})," \u3092\u30ef\u30fc\u30af\u30b9\u30da\u30fc\u30b9\u306e\u30ea\u30e2\u30fc\u30c8\u30e9\u30a4\u30c8 URL \u306b\u7f6e\u304d\u63db\u3048\u307e\u3059\u3002"]}),"\n",(0,a.jsx)(s.p,{children:"\u4ee5\u4e0b\u306e\u30af\u30a8\u30ea\u3092\u5b9f\u884c\u3057\u3066\u3001AMP \u30ea\u30e2\u30fc\u30c8\u30e9\u30a4\u30c8 URL \u30a8\u30f3\u30c9\u30dd\u30a4\u30f3\u30c8\u3092\u53d6\u5f97\u3057\u307e\u3059\u3002"}),"\n",(0,a.jsx)(s.p,{children:"\u307e\u305a\u3001\u6b21\u306e\u3088\u3046\u306b\u30ef\u30fc\u30af\u30b9\u30da\u30fc\u30b9 ID \u3092\u53d6\u5f97\u3057\u307e\u3059\uff1a"}),"\n",(0,a.jsx)(s.pre,{children:(0,a.jsx)(s.code,{children:"YOUR_WORKSPACE_ID=$(aws amp list-workspaces \\\n                    --alias prometheus-sample-app \\\n                    --query 'workspaces[0].workspaceId' --output text)\n"})}),"\n",(0,a.jsx)(s.p,{children:"\u6b21\u306b\u3001\u4ee5\u4e0b\u3092\u4f7f\u7528\u3057\u3066\u30ef\u30fc\u30af\u30b9\u30da\u30fc\u30b9\u306e\u30ea\u30e2\u30fc\u30c8\u30e9\u30a4\u30c8 URL \u30a8\u30f3\u30c9\u30dd\u30a4\u30f3\u30c8\u3092\u53d6\u5f97\u3057\u307e\u3059\uff1a"}),"\n",(0,a.jsx)(s.pre,{children:(0,a.jsx)(s.code,{children:"YOUR_ENDPOINT=$(aws amp describe-workspace \\\n                --workspace-id $YOUR_WORKSPACE_ID  \\\n                --query 'workspace.prometheusEndpoint' --output text)api/v1/remote_write\n"})}),"\n",(0,a.jsx)(s.admonition,{type:"warning",children:(0,a.jsxs)(s.p,{children:[(0,a.jsx)(s.code,{children:"YOUR_ENDPOINT"})," \u304c\u5b9f\u969b\u306b\u30ea\u30e2\u30fc\u30c8\u30e9\u30a4\u30c8 URL \u3067\u3042\u308b\u3053\u3068\u3092\u78ba\u8a8d\u3057\u3066\u304f\u3060\u3055\u3044\u3002\n\u3064\u307e\u308a\u3001URL \u306f ",(0,a.jsx)(s.code,{children:"/api/v1/remote_write"})," \u3067\u7d42\u308f\u3063\u3066\u3044\u308b\u5fc5\u8981\u304c\u3042\u308a\u307e\u3059\u3002"]})}),"\n",(0,a.jsx)(s.p,{children:"\u30c7\u30d7\u30ed\u30a4\u30e1\u30f3\u30c8\u30d5\u30a1\u30a4\u30eb\u3092\u4f5c\u6210\u3057\u305f\u3089\u3001\u4ee5\u4e0b\u306e\u30b3\u30de\u30f3\u30c9\u3092\u4f7f\u7528\u3057\u3066\u30af\u30e9\u30b9\u30bf\u30fc\u306b\u9069\u7528\u3067\u304d\u307e\u3059\uff1a"}),"\n",(0,a.jsx)(s.pre,{children:(0,a.jsx)(s.code,{children:"kubectl apply -f adot-collector-ec2.yaml\n"})}),"\n",(0,a.jsx)(s.admonition,{type:"info",children:(0,a.jsxs)(s.p,{children:["\u8a73\u7d30\u306b\u3064\u3044\u3066\u306f\u3001",(0,a.jsx)(s.a,{href:"https://aws-otel.github.io/docs/getting-started/prometheus-remote-write-exporter/eks#aws-distro-for-opentelemetry-adot-collector-setup",children:"AWS Distro for OpenTelemetry (ADOT) Collector \u306e\u30bb\u30c3\u30c8\u30a2\u30c3\u30d7"})," \u3092\u3054\u89a7\u304f\u3060\u3055\u3044\u3002"]})}),"\n",(0,a.jsx)(s.h3,{id:"amg-\u306e\u30bb\u30c3\u30c8\u30a2\u30c3\u30d7",children:"AMG \u306e\u30bb\u30c3\u30c8\u30a2\u30c3\u30d7"}),"\n",(0,a.jsxs)(s.p,{children:[(0,a.jsx)(s.a,{href:"https://aws.amazon.com/jp/blogs/news/amazon-managed-grafana-getting-started/",children:"Amazon Managed Grafana \u2013 \u306f\u3058\u3081\u306b"})," \u30ac\u30a4\u30c9\u3092\u4f7f\u7528\u3057\u3066\u3001\u65b0\u3057\u3044 AMG \u30ef\u30fc\u30af\u30b9\u30da\u30fc\u30b9\u3092\u30bb\u30c3\u30c8\u30a2\u30c3\u30d7\u3057\u307e\u3059\u3002"]}),"\n",(0,a.jsx)(s.p,{children:"\u4f5c\u6210\u6642\u306b\u3001\u30c7\u30fc\u30bf\u30bd\u30fc\u30b9\u3068\u3057\u3066\u300cAmazon Managed Service for Prometheus\u300d\u3092\u5fc5\u305a\u8ffd\u52a0\u3057\u3066\u304f\u3060\u3055\u3044\u3002"}),"\n",(0,a.jsx)(s.p,{children:(0,a.jsx)(s.img,{src:"https://d2908q01vomqb2.cloudfront.net/972a67c48192728a34979d9a35164c1295401b71/2020/12/09/image008-1024x870.jpg",alt:"\u30b5\u30fc\u30d3\u30b9\u30de\u30cd\u30fc\u30b8\u30c9\u6a29\u9650\u8a2d\u5b9a"})}),"\n",(0,a.jsx)(s.h2,{id:"\u30a2\u30d7\u30ea\u30b1\u30fc\u30b7\u30e7\u30f3",children:"\u30a2\u30d7\u30ea\u30b1\u30fc\u30b7\u30e7\u30f3"}),"\n",(0,a.jsxs)(s.p,{children:["\u3053\u306e\u30ec\u30b7\u30d4\u3067\u306f\u3001AWS Observability \u30ea\u30dd\u30b8\u30c8\u30ea\u306b\u3042\u308b ",(0,a.jsx)(s.a,{href:"https://github.com/aws-observability/aws-otel-community/tree/master/sample-apps/prometheus",children:"\u30b5\u30f3\u30d7\u30eb\u30a2\u30d7\u30ea\u30b1\u30fc\u30b7\u30e7\u30f3"})," \u3092\u4f7f\u7528\u3057\u307e\u3059\u3002"]}),"\n",(0,a.jsxs)(s.p,{children:["\u3053\u306e Prometheus \u30b5\u30f3\u30d7\u30eb\u30a2\u30d7\u30ea\u306f\u3001Prometheus \u306e 4 \u3064\u306e\u30e1\u30c8\u30ea\u30af\u30b9\u30bf\u30a4\u30d7\uff08\u30ab\u30a6\u30f3\u30bf\u30fc\u3001\u30b2\u30fc\u30b8\u3001\u30d2\u30b9\u30c8\u30b0\u30e9\u30e0\u3001\u30b5\u30de\u30ea\u30fc\uff09\u3092\u3059\u3079\u3066\u751f\u6210\u3057\u3001",(0,a.jsx)(s.code,{children:"/metrics"})," \u30a8\u30f3\u30c9\u30dd\u30a4\u30f3\u30c8\u3067\u516c\u958b\u3057\u307e\u3059\u3002"]}),"\n",(0,a.jsx)(s.h3,{id:"\u30b3\u30f3\u30c6\u30ca\u30a4\u30e1\u30fc\u30b8\u306e\u30d3\u30eb\u30c9",children:"\u30b3\u30f3\u30c6\u30ca\u30a4\u30e1\u30fc\u30b8\u306e\u30d3\u30eb\u30c9"}),"\n",(0,a.jsx)(s.p,{children:"\u30b3\u30f3\u30c6\u30ca\u30a4\u30e1\u30fc\u30b8\u3092\u30d3\u30eb\u30c9\u3059\u308b\u306b\u306f\u3001\u307e\u305a Git \u30ea\u30dd\u30b8\u30c8\u30ea\u3092\u30af\u30ed\u30fc\u30f3\u3057\u3001\u4ee5\u4e0b\u306e\u3088\u3046\u306b\u30c7\u30a3\u30ec\u30af\u30c8\u30ea\u3092\u5909\u66f4\u3057\u307e\u3059\uff1a"}),"\n",(0,a.jsx)(s.pre,{children:(0,a.jsx)(s.code,{children:"git clone https://github.com/aws-observability/aws-otel-community.git && \\\ncd ./aws-otel-community/sample-apps/prometheus\n"})}),"\n",(0,a.jsxs)(s.p,{children:["\u307e\u305a\u3001\u30ea\u30fc\u30b8\u30e7\u30f3\uff08\u4e0a\u8a18\u3067\u8a2d\u5b9a\u3057\u3066\u3044\u306a\u3044\u5834\u5408\uff09\u3068\u30a2\u30ab\u30a6\u30f3\u30c8 ID \u3092\u3001\u304a\u4f7f\u3044\u306e\u74b0\u5883\u306b\u9069\u7528\u3067\u304d\u308b\u3088\u3046\u306b\u8a2d\u5b9a\u3057\u307e\u3059\u3002\n",(0,a.jsx)(s.code,{children:"<YOUR_REGION>"})," \u3092\u73fe\u5728\u306e\u30ea\u30fc\u30b8\u30e7\u30f3\u306b\u7f6e\u304d\u63db\u3048\u3066\u304f\u3060\u3055\u3044\u3002\n\u4f8b\u3048\u3070\u3001Bash \u30b7\u30a7\u30eb\u3067\u306f\u4ee5\u4e0b\u306e\u3088\u3046\u306b\u306a\u308a\u307e\u3059\uff1a"]}),"\n",(0,a.jsx)(s.pre,{children:(0,a.jsx)(s.code,{children:"export AWS_DEFAULT_REGION=<YOUR_REGION>\nexport ACCOUNTID=`aws sts get-caller-identity --query Account --output text`\n"})}),"\n",(0,a.jsx)(s.p,{children:"\u6b21\u306b\u3001\u30b3\u30f3\u30c6\u30ca\u30a4\u30e1\u30fc\u30b8\u3092\u30d3\u30eb\u30c9\u3057\u307e\u3059\uff1a"}),"\n",(0,a.jsx)(s.pre,{children:(0,a.jsx)(s.code,{children:'docker build . -t "$ACCOUNTID.dkr.ecr.$AWS_DEFAULT_REGION.amazonaws.com/prometheus-sample-app:latest"\n'})}),"\n",(0,a.jsxs)(s.admonition,{type:"note",children:[(0,a.jsxs)(s.p,{children:["\u30d7\u30ed\u30ad\u30b7\u3084 i/o \u30bf\u30a4\u30e0\u30a2\u30a6\u30c8\u306b\u3088\u308a\u74b0\u5883\u3067 ",(0,a.jsx)(s.code,{children:"go mod"})," \u304c\u5931\u6557\u3059\u308b\u5834\u5408\u3001Dockerfile \u3092\u7de8\u96c6\u3057\u3066 go mod \u30d7\u30ed\u30ad\u30b7\u3092\u30d0\u30a4\u30d1\u30b9\u3059\u308b\u3053\u3068\u304c\u3067\u304d\u307e\u3059\u3002"]}),(0,a.jsx)(s.p,{children:"Dockerfile \u306e\u4ee5\u4e0b\u306e\u884c\u3092\u5909\u66f4\u3057\u3066\u304f\u3060\u3055\u3044\uff1a"}),(0,a.jsx)(s.pre,{children:(0,a.jsx)(s.code,{children:"RUN GO111MODULE=on go mod download\n"})}),(0,a.jsx)(s.p,{children:"\u3092\u4ee5\u4e0b\u306e\u3088\u3046\u306b\u5909\u66f4\uff1a"}),(0,a.jsx)(s.pre,{children:(0,a.jsx)(s.code,{children:"RUN GOPROXY=direct GO111MODULE=on go mod download\n"})})]}),"\n",(0,a.jsx)(s.p,{children:"\u3053\u308c\u3067\u3001\u5148\u307b\u3069\u4f5c\u6210\u3057\u305f ECR \u30ea\u30dd\u30b8\u30c8\u30ea\u306b\u30b3\u30f3\u30c6\u30ca\u30a4\u30e1\u30fc\u30b8\u3092\u30d7\u30c3\u30b7\u30e5\u3067\u304d\u307e\u3059\u3002"}),"\n",(0,a.jsx)(s.p,{children:"\u305d\u306e\u305f\u3081\u306b\u3001\u307e\u305a\u30c7\u30d5\u30a9\u30eb\u30c8\u306e ECR \u30ec\u30b8\u30b9\u30c8\u30ea\u306b\u30ed\u30b0\u30a4\u30f3\u3057\u307e\u3059\uff1a"}),"\n",(0,a.jsx)(s.pre,{children:(0,a.jsx)(s.code,{children:'aws ecr get-login-password --region $AWS_DEFAULT_REGION | \\\n    docker login --username AWS --password-stdin \\\n    "$ACCOUNTID.dkr.ecr.$AWS_DEFAULT_REGION.amazonaws.com"\n'})}),"\n",(0,a.jsx)(s.p,{children:"\u6700\u5f8c\u306b\u3001\u5148\u307b\u3069\u4f5c\u6210\u3057\u305f ECR \u30ea\u30dd\u30b8\u30c8\u30ea\u306b\u30b3\u30f3\u30c6\u30ca\u30a4\u30e1\u30fc\u30b8\u3092\u30d7\u30c3\u30b7\u30e5\u3057\u307e\u3059\uff1a"}),"\n",(0,a.jsx)(s.pre,{children:(0,a.jsx)(s.code,{children:'docker push "$ACCOUNTID.dkr.ecr.$AWS_DEFAULT_REGION.amazonaws.com/prometheus-sample-app:latest"\n'})}),"\n",(0,a.jsx)(s.h3,{id:"\u30b5\u30f3\u30d7\u30eb\u30a2\u30d7\u30ea\u306e\u30c7\u30d7\u30ed\u30a4",children:"\u30b5\u30f3\u30d7\u30eb\u30a2\u30d7\u30ea\u306e\u30c7\u30d7\u30ed\u30a4"}),"\n",(0,a.jsxs)(s.p,{children:[(0,a.jsx)(s.a,{target:"_blank","data-noBrokenLinkCheck":!0,href:n(37902).A+"",children:"prometheus-sample-app.yaml"})," \u3092\u7de8\u96c6\u3057\u3066\u3001\u3042\u306a\u305f\u306e ECR \u30a4\u30e1\u30fc\u30b8\u30d1\u30b9\u3092\u542b\u3081\u3066\u304f\u3060\u3055\u3044\u3002\n\u3064\u307e\u308a\u3001\u30d5\u30a1\u30a4\u30eb\u5185\u306e ",(0,a.jsx)(s.code,{children:"ACCOUNTID"})," \u3068 ",(0,a.jsx)(s.code,{children:"AWS_DEFAULT_REGION"})," \u3092\u3042\u306a\u305f\u81ea\u8eab\u306e\u5024\u306b\u7f6e\u304d\u63db\u3048\u3066\u304f\u3060\u3055\u3044\uff1a"]}),"\n",(0,a.jsx)(s.pre,{children:(0,a.jsx)(s.code,{children:'    # \u4ee5\u4e0b\u3092\u3042\u306a\u305f\u306e\u30b3\u30f3\u30c6\u30ca\u30a4\u30e1\u30fc\u30b8\u306b\u5909\u66f4\u3057\u3066\u304f\u3060\u3055\u3044\uff1a\n    image: "ACCOUNTID.dkr.ecr.AWS_DEFAULT_REGION.amazonaws.com/prometheus-sample-app:latest"\n'})}),"\n",(0,a.jsx)(s.p,{children:"\u3053\u308c\u3067\u3001\u4ee5\u4e0b\u306e\u30b3\u30de\u30f3\u30c9\u3092\u4f7f\u7528\u3057\u3066\u30b5\u30f3\u30d7\u30eb\u30a2\u30d7\u30ea\u3092\u30af\u30e9\u30b9\u30bf\u30fc\u306b\u30c7\u30d7\u30ed\u30a4\u3067\u304d\u307e\u3059\uff1a"}),"\n",(0,a.jsx)(s.pre,{children:(0,a.jsx)(s.code,{children:"kubectl apply -f prometheus-sample-app.yaml\n"})}),"\n",(0,a.jsx)(s.h2,{id:"\u30a8\u30f3\u30c9\u30c4\u30fc\u30a8\u30f3\u30c9",children:"\u30a8\u30f3\u30c9\u30fb\u30c4\u30fc\u30fb\u30a8\u30f3\u30c9"}),"\n",(0,a.jsx)(s.p,{children:"\u30a4\u30f3\u30d5\u30e9\u30b9\u30c8\u30e9\u30af\u30c1\u30e3\u3068\u30a2\u30d7\u30ea\u30b1\u30fc\u30b7\u30e7\u30f3\u304c\u6574\u3063\u305f\u306e\u3067\u3001\u30bb\u30c3\u30c8\u30a2\u30c3\u30d7\u3092\u30c6\u30b9\u30c8\u3057\u307e\u3059\u3002\nEKS \u3067\u5b9f\u884c\u3055\u308c\u3066\u3044\u308b Go \u30a2\u30d7\u30ea\u304b\u3089 AMP \u306b\u30e1\u30c8\u30ea\u30af\u30b9\u3092\u9001\u4fe1\u3057\u3001AMG \u3067\u53ef\u8996\u5316\u3057\u307e\u3059\u3002"}),"\n",(0,a.jsx)(s.h3,{id:"\u30d1\u30a4\u30d7\u30e9\u30a4\u30f3\u304c\u6a5f\u80fd\u3057\u3066\u3044\u308b\u3053\u3068\u3092\u78ba\u8a8d\u3059\u308b",children:"\u30d1\u30a4\u30d7\u30e9\u30a4\u30f3\u304c\u6a5f\u80fd\u3057\u3066\u3044\u308b\u3053\u3068\u3092\u78ba\u8a8d\u3059\u308b"}),"\n",(0,a.jsx)(s.p,{children:"ADOT \u30b3\u30ec\u30af\u30bf\u30fc\u304c\u30b5\u30f3\u30d7\u30eb\u30a2\u30d7\u30ea\u306e Pod \u3092\u30b9\u30af\u30ec\u30a4\u30d4\u30f3\u30b0\u3057\u3001\u30e1\u30c8\u30ea\u30af\u30b9\u3092 AMP \u306b\u53d6\u308a\u8fbc\u3093\u3067\u3044\u308b\u304b\u3092\u78ba\u8a8d\u3059\u308b\u305f\u3081\u306b\u3001\u30b3\u30ec\u30af\u30bf\u30fc\u306e\u30ed\u30b0\u3092\u78ba\u8a8d\u3057\u307e\u3059\u3002"}),"\n",(0,a.jsx)(s.p,{children:"\u4ee5\u4e0b\u306e\u30b3\u30de\u30f3\u30c9\u3092\u5165\u529b\u3057\u3066\u3001ADOT \u30b3\u30ec\u30af\u30bf\u30fc\u306e\u30ed\u30b0\u3092\u30d5\u30a9\u30ed\u30fc\u3057\u307e\u3059\uff1a"}),"\n",(0,a.jsx)(s.pre,{children:(0,a.jsx)(s.code,{children:"kubectl -n adot-col logs adot-collector -f\n"})}),"\n",(0,a.jsx)(s.p,{children:"\u30b5\u30f3\u30d7\u30eb\u30a2\u30d7\u30ea\u304b\u3089\u30b9\u30af\u30ec\u30a4\u30d4\u30f3\u30b0\u3055\u308c\u305f\u30e1\u30c8\u30ea\u30af\u30b9\u306e\u30ed\u30b0\u306e\u51fa\u529b\u4f8b\u306f\u3001\u4ee5\u4e0b\u306e\u3088\u3046\u306b\u306a\u308a\u307e\u3059\uff1a"}),"\n",(0,a.jsx)(s.pre,{children:(0,a.jsx)(s.code,{children:"...\nResource labels:\n     -> service.name: STRING(kubernetes-service-endpoints)\n     -> host.name: STRING(192.168.16.238)\n     -> port: STRING(8080)\n     -> scheme: STRING(http)\nInstrumentationLibraryMetrics #0\nMetric #0\nDescriptor:\n     -> Name: test_gauge0\n     -> Description: This is my gauge\n     -> Unit:\n     -> DataType: DoubleGauge\nDoubleDataPoints #0\nStartTime: 0\nTimestamp: 1606511460471000000\nValue: 0.000000\n...\n"})}),"\n",(0,a.jsxs)(s.admonition,{type:"tip",children:[(0,a.jsxs)(s.p,{children:["AMP \u304c\u30e1\u30c8\u30ea\u30af\u30b9\u3092\u53d7\u4fe1\u3057\u305f\u304b\u3092\u78ba\u8a8d\u3059\u308b\u306b\u306f\u3001",(0,a.jsx)(s.a,{href:"https://github.com/okigan/awscurl",children:"awscurl"})," \u3092\u4f7f\u7528\u3067\u304d\u307e\u3059\u3002\n\u3053\u306e\u30c4\u30fc\u30eb\u3092\u4f7f\u7528\u3059\u308b\u3068\u3001\u30b3\u30de\u30f3\u30c9\u30e9\u30a4\u30f3\u304b\u3089 AWS Sigv4 \u8a8d\u8a3c\u3092\u4f7f\u7528\u3057\u3066 HTTP \u30ea\u30af\u30a8\u30b9\u30c8\u3092\u9001\u4fe1\u3067\u304d\u307e\u3059\u3002\n\u305d\u306e\u305f\u3081\u3001AMP \u304b\u3089\u30af\u30a8\u30ea\u3092\u5b9f\u884c\u3059\u308b\u305f\u3081\u306e\u9069\u5207\u306a\u6a29\u9650\u3092\u6301\u3064 AWS \u8a8d\u8a3c\u60c5\u5831\u3092\u30ed\u30fc\u30ab\u30eb\u306b\u8a2d\u5b9a\u3057\u3066\u304a\u304f\u5fc5\u8981\u304c\u3042\u308a\u307e\u3059\u3002\n\u4ee5\u4e0b\u306e\u30b3\u30de\u30f3\u30c9\u3067\u3001",(0,a.jsx)(s.code,{children:"$AMP_ENDPOINT"})," \u3092 AMP \u30ef\u30fc\u30af\u30b9\u30da\u30fc\u30b9\u306e\u30a8\u30f3\u30c9\u30dd\u30a4\u30f3\u30c8\u306b\u7f6e\u304d\u63db\u3048\u3066\u304f\u3060\u3055\u3044\uff1a"]}),(0,a.jsx)(s.pre,{children:(0,a.jsx)(s.code,{children:'$ awscurl --service="aps" \\\n        --region="$AWS_DEFAULT_REGION" "https://$AMP_ENDPOINT/api/v1/query?query=adot_test_gauge0"\n{"status":"success","data":{"resultType":"vector","result":[{"metric":{"__name__":"adot_test_gauge0"},"value":[1606512592.493,"16.87214000011479"]}]}}\n'})})]}),"\n",(0,a.jsx)(s.h3,{id:"grafana-\u30c0\u30c3\u30b7\u30e5\u30dc\u30fc\u30c9\u306e\u4f5c\u6210",children:"Grafana \u30c0\u30c3\u30b7\u30e5\u30dc\u30fc\u30c9\u306e\u4f5c\u6210"}),"\n",(0,a.jsxs)(s.p,{children:["\u30b5\u30f3\u30d7\u30eb\u30a2\u30d7\u30ea\u7528\u306e\u30c0\u30c3\u30b7\u30e5\u30dc\u30fc\u30c9\u306e\u4f8b\u3092\u3001",(0,a.jsx)(s.a,{target:"_blank","data-noBrokenLinkCheck":!0,href:n(24032).A+"",children:"prometheus-sample-app-dashboard.json"})," \u304b\u3089\u30a4\u30f3\u30dd\u30fc\u30c8\u3067\u304d\u307e\u3059\u3002\n\u4ee5\u4e0b\u306e\u3088\u3046\u306a\u30c0\u30c3\u30b7\u30e5\u30dc\u30fc\u30c9\u304c\u8868\u793a\u3055\u308c\u307e\u3059\uff1a"]}),"\n",(0,a.jsx)(s.p,{children:(0,a.jsx)(s.img,{alt:"AMG \u306e Prometheus \u30b5\u30f3\u30d7\u30eb\u30a2\u30d7\u30ea\u30c0\u30c3\u30b7\u30e5\u30dc\u30fc\u30c9\u306e\u30b9\u30af\u30ea\u30fc\u30f3\u30b7\u30e7\u30c3\u30c8",src:n(91904).A+"",width:"1000",height:"766"})}),"\n",(0,a.jsx)(s.p,{children:"\u3055\u3089\u306b\u3001\u4ee5\u4e0b\u306e\u30ac\u30a4\u30c9\u3092\u4f7f\u7528\u3057\u3066 Amazon Managed Grafana \u3067\u72ec\u81ea\u306e\u30c0\u30c3\u30b7\u30e5\u30dc\u30fc\u30c9\u3092\u4f5c\u6210\u3067\u304d\u307e\u3059\uff1a"}),"\n",(0,a.jsxs)(s.ul,{children:["\n",(0,a.jsx)(s.li,{children:(0,a.jsx)(s.a,{href:"https://docs.aws.amazon.com/ja_jp/grafana/latest/userguide/dashboard-overview.html",children:"\u30e6\u30fc\u30b6\u30fc\u30ac\u30a4\u30c9\uff1a\u30c0\u30c3\u30b7\u30e5\u30dc\u30fc\u30c9"})}),"\n",(0,a.jsx)(s.li,{children:(0,a.jsx)(s.a,{href:"https://grafana.com/docs/grafana/latest/best-practices/best-practices-for-creating-dashboards/",children:"\u30c0\u30c3\u30b7\u30e5\u30dc\u30fc\u30c9\u4f5c\u6210\u306e\u30d9\u30b9\u30c8\u30d7\u30e9\u30af\u30c6\u30a3\u30b9"})}),"\n"]}),"\n",(0,a.jsx)(s.p,{children:"\u4ee5\u4e0a\u3067\u3059\u3002\u304a\u3081\u3067\u3068\u3046\u3054\u3056\u3044\u307e\u3059\uff01EC2 \u4e0a\u306e EKS \u3067 ADOT \u3092\u4f7f\u7528\u3057\u3066\u30e1\u30c8\u30ea\u30af\u30b9\u3092\u53d6\u308a\u8fbc\u3080\u65b9\u6cd5\u3092\u5b66\u3073\u307e\u3057\u305f\u3002"}),"\n",(0,a.jsx)(s.h2,{id:"\u30af\u30ea\u30fc\u30f3\u30a2\u30c3\u30d7",children:"\u30af\u30ea\u30fc\u30f3\u30a2\u30c3\u30d7"}),"\n",(0,a.jsxs)(s.ol,{children:["\n",(0,a.jsx)(s.li,{children:"\u30ea\u30bd\u30fc\u30b9\u3068\u30af\u30e9\u30b9\u30bf\u30fc\u3092\u524a\u9664\u3057\u307e\u3059"}),"\n"]}),"\n",(0,a.jsx)(s.pre,{children:(0,a.jsx)(s.code,{children:"kubectl delete all --all\neksctl delete cluster --name amp-eks-ec2\n"})}),"\n",(0,a.jsxs)(s.ol,{start:"2",children:["\n",(0,a.jsx)(s.li,{children:"AMP \u30ef\u30fc\u30af\u30b9\u30da\u30fc\u30b9\u3092\u524a\u9664\u3057\u307e\u3059"}),"\n"]}),"\n",(0,a.jsx)(s.pre,{children:(0,a.jsx)(s.code,{children:"aws amp delete-workspace --workspace-id `aws amp list-workspaces --alias prometheus-sample-app --query 'workspaces[0].workspaceId' --output text`\n"})}),"\n",(0,a.jsxs)(s.ol,{start:"3",children:["\n",(0,a.jsx)(s.li,{children:"amp-iamproxy-ingest-role IAM \u30ed\u30fc\u30eb\u3092\u524a\u9664\u3057\u307e\u3059"}),"\n"]}),"\n",(0,a.jsx)(s.pre,{children:(0,a.jsx)(s.code,{children:"aws delete-role --role-name amp-iamproxy-ingest-role\n"})}),"\n",(0,a.jsxs)(s.ol,{start:"4",children:["\n",(0,a.jsx)(s.li,{children:"\u30b3\u30f3\u30bd\u30fc\u30eb\u304b\u3089 AMG \u30ef\u30fc\u30af\u30b9\u30da\u30fc\u30b9\u3092\u524a\u9664\u3057\u307e\u3059\u3002"}),"\n"]})]})}function h(e={}){const{wrapper:s}={...(0,c.R)(),...e.components};return s?(0,a.jsx)(s,{...e,children:(0,a.jsx)(d,{...e})}):d(e)}},91904:(e,s,n)=>{n.d(s,{A:()=>r});const r=n.p+"assets/images/amg-prom-sample-app-dashboard-1d97707e9ef8d9ea445eca10766285a2.png"}}]);
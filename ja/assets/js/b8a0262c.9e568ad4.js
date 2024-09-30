"use strict";(self.webpackChunkobservability_best_practices=self.webpackChunkobservability_best_practices||[]).push([[4687],{90550:(e,a,n)=>{n.r(a),n.d(a,{assets:()=>i,contentTitle:()=>t,default:()=>h,frontMatter:()=>c,metadata:()=>l,toc:()=>d});var s=n(74848),r=n(28453);const c={},t="Fargate \u4e0a\u306e EKS \u3067 AWS Distro for OpenTelemetry \u3092 AWS X-Ray \u3068\u5171\u306b\u4f7f\u7528\u3059\u308b",l={id:"recipes/recipes/fargate-eks-xray-go-adot-amg",title:"Fargate \u4e0a\u306e EKS \u3067 AWS Distro for OpenTelemetry \u3092 AWS X-Ray \u3068\u5171\u306b\u4f7f\u7528\u3059\u308b",description:"\u3053\u306e\u30ec\u30b7\u30d4\u3067\u306f\u3001\u30b5\u30f3\u30d7\u30eb\u306e Go \u30a2\u30d7\u30ea\u30b1\u30fc\u30b7\u30e7\u30f3\u306b\u30a4\u30f3\u30b9\u30c4\u30eb\u30e1\u30f3\u30c6\u30fc\u30b7\u30e7\u30f3\u3092\u9069\u7528\u3057\u3001AWS Distro for OpenTelemetry(ADOT) \u3092\u4f7f\u7528\u3057\u3066\u30c8\u30ec\u30fc\u30b9\u3092 AWS X-Ray \u306b\u30a4\u30f3\u30b8\u30a7\u30b9\u30c8\u3057\u3001\u30c8\u30ec\u30fc\u30b9\u3092 Amazon Managed Grafana \u3067\u53ef\u8996\u5316\u3059\u308b\u65b9\u6cd5\u3092\u793a\u3057\u307e\u3059\u3002",source:"@site/i18n/ja/docusaurus-plugin-content-docs/current/recipes/recipes/fargate-eks-xray-go-adot-amg.md",sourceDirName:"recipes/recipes",slug:"/recipes/recipes/fargate-eks-xray-go-adot-amg",permalink:"/observability-best-practices/ja/docs/recipes/recipes/fargate-eks-xray-go-adot-amg",draft:!1,unlisted:!1,editUrl:"https://github.com/aws-observability/observability-best-practices/docs/recipes/recipes/fargate-eks-xray-go-adot-amg.md",tags:[],version:"current",frontMatter:{}},i={},d=[{value:"\u30a4\u30f3\u30d5\u30e9\u30b9\u30c8\u30e9\u30af\u30c1\u30e3",id:"\u30a4\u30f3\u30d5\u30e9\u30b9\u30c8\u30e9\u30af\u30c1\u30e3",level:2},{value:"\u30a2\u30fc\u30ad\u30c6\u30af\u30c1\u30e3",id:"\u30a2\u30fc\u30ad\u30c6\u30af\u30c1\u30e3",level:3},{value:"\u524d\u63d0\u6761\u4ef6",id:"\u524d\u63d0\u6761\u4ef6",level:3},{value:"Fargate \u4e0a\u306e EKS \u30af\u30e9\u30b9\u30bf\u30fc\u306e\u4f5c\u6210",id:"fargate-\u4e0a\u306e-eks-\u30af\u30e9\u30b9\u30bf\u30fc\u306e\u4f5c\u6210",level:3},{value:"ECR \u30ea\u30dd\u30b8\u30c8\u30ea\u306e\u4f5c\u6210",id:"ecr-\u30ea\u30dd\u30b8\u30c8\u30ea\u306e\u4f5c\u6210",level:3},{value:"ADOT Collector \u306e\u30bb\u30c3\u30c8\u30a2\u30c3\u30d7",id:"adot-collector-\u306e\u30bb\u30c3\u30c8\u30a2\u30c3\u30d7",level:3},{value:"Managed Grafana\u306e\u8a2d\u5b9a",id:"managed-grafana\u306e\u8a2d\u5b9a",level:3},{value:"\u30b7\u30b0\u30ca\u30eb\u30b8\u30a7\u30cd\u30ec\u30fc\u30bf\u30fc",id:"\u30b7\u30b0\u30ca\u30eb\u30b8\u30a7\u30cd\u30ec\u30fc\u30bf\u30fc",level:2},{value:"\u30b3\u30f3\u30c6\u30ca\u30a4\u30e1\u30fc\u30b8\u306e\u30d3\u30eb\u30c9",id:"\u30b3\u30f3\u30c6\u30ca\u30a4\u30e1\u30fc\u30b8\u306e\u30d3\u30eb\u30c9",level:3},{value:"\u30b3\u30f3\u30c6\u30ca\u30a4\u30e1\u30fc\u30b8\u306e\u30d7\u30c3\u30b7\u30e5",id:"\u30b3\u30f3\u30c6\u30ca\u30a4\u30e1\u30fc\u30b8\u306e\u30d7\u30c3\u30b7\u30e5",level:3},{value:"\u30b7\u30b0\u30ca\u30eb\u30b8\u30a7\u30cd\u30ec\u30fc\u30bf\u30fc\u306e\u30c7\u30d7\u30ed\u30a4",id:"\u30b7\u30b0\u30ca\u30eb\u30b8\u30a7\u30cd\u30ec\u30fc\u30bf\u30fc\u306e\u30c7\u30d7\u30ed\u30a4",level:3},{value:"\u30a8\u30f3\u30c9\u30c4\u30fc\u30a8\u30f3\u30c9",id:"\u30a8\u30f3\u30c9\u30c4\u30fc\u30a8\u30f3\u30c9",level:2},{value:"\u30d1\u30a4\u30d7\u30e9\u30a4\u30f3\u306e\u691c\u8a3c",id:"\u30d1\u30a4\u30d7\u30e9\u30a4\u30f3\u306e\u691c\u8a3c",level:3},{value:"Grafana \u30c0\u30c3\u30b7\u30e5\u30dc\u30fc\u30c9",id:"grafana-\u30c0\u30c3\u30b7\u30e5\u30dc\u30fc\u30c9",level:3},{value:"\u30af\u30ea\u30fc\u30f3\u30a2\u30c3\u30d7",id:"\u30af\u30ea\u30fc\u30f3\u30a2\u30c3\u30d7",level:2}];function o(e){const a={a:"a",admonition:"admonition",code:"code",h1:"h1",h2:"h2",h3:"h3",img:"img",li:"li",p:"p",pre:"pre",ul:"ul",...(0,r.R)(),...e.components};return(0,s.jsxs)(s.Fragment,{children:[(0,s.jsx)(a.h1,{id:"fargate-\u4e0a\u306e-eks-\u3067-aws-distro-for-opentelemetry-\u3092-aws-x-ray-\u3068\u5171\u306b\u4f7f\u7528\u3059\u308b",children:"Fargate \u4e0a\u306e EKS \u3067 AWS Distro for OpenTelemetry \u3092 AWS X-Ray \u3068\u5171\u306b\u4f7f\u7528\u3059\u308b"}),"\n",(0,s.jsxs)(a.p,{children:["\u3053\u306e\u30ec\u30b7\u30d4\u3067\u306f\u3001\u30b5\u30f3\u30d7\u30eb\u306e Go \u30a2\u30d7\u30ea\u30b1\u30fc\u30b7\u30e7\u30f3\u306b\u30a4\u30f3\u30b9\u30c4\u30eb\u30e1\u30f3\u30c6\u30fc\u30b7\u30e7\u30f3\u3092\u9069\u7528\u3057\u3001",(0,s.jsx)(a.a,{href:"https://aws.amazon.com/otel",children:"AWS Distro for OpenTelemetry(ADOT)"})," \u3092\u4f7f\u7528\u3057\u3066\u30c8\u30ec\u30fc\u30b9\u3092 ",(0,s.jsx)(a.a,{href:"https://aws.amazon.com/xray/",children:"AWS X-Ray"})," \u306b\u30a4\u30f3\u30b8\u30a7\u30b9\u30c8\u3057\u3001\u30c8\u30ec\u30fc\u30b9\u3092 ",(0,s.jsx)(a.a,{href:"https://aws.amazon.com/grafana/",children:"Amazon Managed Grafana"})," \u3067\u53ef\u8996\u5316\u3059\u308b\u65b9\u6cd5\u3092\u793a\u3057\u307e\u3059\u3002"]}),"\n",(0,s.jsxs)(a.p,{children:[(0,s.jsx)(a.a,{href:"https://aws.amazon.com/eks/",children:"Amazon Elastic Kubernetes Service(EKS)"})," \u3092 ",(0,s.jsx)(a.a,{href:"https://aws.amazon.com/fargate/",children:"AWS Fargate"})," \u4e0a\u306b\u30bb\u30c3\u30c8\u30a2\u30c3\u30d7\u3057\u3001\u30c7\u30e2\u30f3\u30b9\u30c8\u30ec\u30fc\u30b7\u30e7\u30f3\u306e\u305f\u3081\u306b ",(0,s.jsx)(a.a,{href:"https://aws.amazon.com/ecr/",children:"Amazon Elastic Container Registry(ECR)"})," \u30ea\u30dd\u30b8\u30c8\u30ea\u3092\u4f7f\u7528\u3057\u307e\u3059\u3002"]}),"\n",(0,s.jsx)(a.admonition,{type:"note",children:(0,s.jsx)(a.p,{children:"\u3053\u306e\u30ac\u30a4\u30c9\u306e\u5b8c\u4e86\u306b\u306f\u7d04 1 \u6642\u9593\u304b\u304b\u308a\u307e\u3059\u3002"})}),"\n",(0,s.jsx)(a.h2,{id:"\u30a4\u30f3\u30d5\u30e9\u30b9\u30c8\u30e9\u30af\u30c1\u30e3",children:"\u30a4\u30f3\u30d5\u30e9\u30b9\u30c8\u30e9\u30af\u30c1\u30e3"}),"\n",(0,s.jsx)(a.p,{children:"\u3053\u306e\u30ec\u30b7\u30d4\u306e\u30a4\u30f3\u30d5\u30e9\u30b9\u30c8\u30e9\u30af\u30c1\u30e3\u3092\u8a2d\u5b9a\u3059\u308b\u30bb\u30af\u30b7\u30e7\u30f3\u3067\u3059\u3002"}),"\n",(0,s.jsx)(a.h3,{id:"\u30a2\u30fc\u30ad\u30c6\u30af\u30c1\u30e3",children:"\u30a2\u30fc\u30ad\u30c6\u30af\u30c1\u30e3"}),"\n",(0,s.jsxs)(a.p,{children:["ADOT \u30d1\u30a4\u30d7\u30e9\u30a4\u30f3\u3092\u4f7f\u7528\u3059\u308b\u3053\u3068\u3067\u3001\n",(0,s.jsx)(a.a,{href:"https://github.com/aws-observability/aws-otel-collector",children:"ADOT Collector"})," \u3092\u5229\u7528\u3057\u3066\u3001\n\u8a08\u88c5\u3055\u308c\u305f\u30a2\u30d7\u30ea\u30b1\u30fc\u30b7\u30e7\u30f3\u304b\u3089\u30c8\u30ec\u30fc\u30b9\u3092\u53ce\u96c6\u3057\u3001X-Ray \u306b\u30a4\u30f3\u30b8\u30a7\u30b9\u30c8\u3059\u308b\u3053\u3068\u304c\u3067\u304d\u307e\u3059\u3002"]}),"\n",(0,s.jsx)(a.p,{children:(0,s.jsx)(a.img,{alt:"ADOT \u30c7\u30d5\u30a9\u30eb\u30c8\u30d1\u30a4\u30d7\u30e9\u30a4\u30f3",src:n(6367).A+"",width:"1000",height:"379"})}),"\n",(0,s.jsx)(a.h3,{id:"\u524d\u63d0\u6761\u4ef6",children:"\u524d\u63d0\u6761\u4ef6"}),"\n",(0,s.jsxs)(a.ul,{children:["\n",(0,s.jsxs)(a.li,{children:["AWS CLI \u304c",(0,s.jsx)(a.a,{href:"https://docs.aws.amazon.com/ja_jp/cli/latest/userguide/cli-chap-install.html",children:"\u30a4\u30f3\u30b9\u30c8\u30fc\u30eb"}),"\u3055\u308c\u3001\u74b0\u5883\u306b",(0,s.jsx)(a.a,{href:"https://docs.aws.amazon.com/ja_jp/cli/latest/userguide/cli-chap-configure.html",children:"\u8a2d\u5b9a"}),"\u3055\u308c\u3066\u3044\u308b\u3053\u3068\u3002"]}),"\n",(0,s.jsxs)(a.li,{children:["\u74b0\u5883\u306b ",(0,s.jsx)(a.a,{href:"https://docs.aws.amazon.com/ja_jp/eks/latest/userguide/eksctl.html",children:"eksctl"})," \u30b3\u30de\u30f3\u30c9\u3092\u30a4\u30f3\u30b9\u30c8\u30fc\u30eb\u3059\u308b\u5fc5\u8981\u304c\u3042\u308b\u3053\u3068\u3002"]}),"\n",(0,s.jsxs)(a.li,{children:["\u74b0\u5883\u306b ",(0,s.jsx)(a.a,{href:"https://docs.aws.amazon.com/ja_jp/eks/latest/userguide/install-kubectl.html",children:"kubectl"})," \u3092\u30a4\u30f3\u30b9\u30c8\u30fc\u30eb\u3059\u308b\u5fc5\u8981\u304c\u3042\u308b\u3053\u3068\u3002"]}),"\n",(0,s.jsxs)(a.li,{children:[(0,s.jsx)(a.a,{href:"https://docs.docker.com/get-docker/",children:"Docker"})," \u304c\u74b0\u5883\u306b\u30a4\u30f3\u30b9\u30c8\u30fc\u30eb\u3055\u308c\u3066\u3044\u308b\u3053\u3068\u3002"]}),"\n",(0,s.jsxs)(a.li,{children:[(0,s.jsx)(a.a,{href:"https://github.com/aws-observability/aws-o11y-recipes/",children:"aws-observability/aws-o11y-recipes"})," \u30ec\u30dd\u30b8\u30c8\u30ea\u304c\u30ed\u30fc\u30ab\u30eb\u74b0\u5883\u306b\u30af\u30ed\u30fc\u30f3\u3055\u308c\u3066\u3044\u308b\u3053\u3068\u3002"]}),"\n"]}),"\n",(0,s.jsx)(a.h3,{id:"fargate-\u4e0a\u306e-eks-\u30af\u30e9\u30b9\u30bf\u30fc\u306e\u4f5c\u6210",children:"Fargate \u4e0a\u306e EKS \u30af\u30e9\u30b9\u30bf\u30fc\u306e\u4f5c\u6210"}),"\n",(0,s.jsxs)(a.p,{children:["\u30c7\u30e2\u30a2\u30d7\u30ea\u30b1\u30fc\u30b7\u30e7\u30f3\u306f\u3001Fargate \u4e0a\u306e EKS \u30af\u30e9\u30b9\u30bf\u30fc\u3067\u5b9f\u884c\u3059\u308b Kubernetes \u30a2\u30d7\u30ea\u30b1\u30fc\u30b7\u30e7\u30f3\u3067\u3059\u3002\n\u305d\u306e\u305f\u3081\u3001\u307e\u305a\u6700\u521d\u306b ",(0,s.jsx)(a.a,{target:"_blank","data-noBrokenLinkCheck":!0,href:n(1359).A+"",children:"cluster_config.yaml"})," \u3067\u63d0\u4f9b\u3055\u308c\u3066\u3044\u308b\u8a2d\u5b9a\u3092\u4f7f\u7528\u3057\u3066 EKS \u30af\u30e9\u30b9\u30bf\u30fc\u3092\u4f5c\u6210\u3057\u307e\u3059\u3002"]}),"\n",(0,s.jsx)(a.p,{children:"\u6b21\u306e\u30b3\u30de\u30f3\u30c9\u3092\u4f7f\u7528\u3057\u3066\u30af\u30e9\u30b9\u30bf\u30fc\u3092\u4f5c\u6210\u3057\u307e\u3059\u3002"}),"\n",(0,s.jsx)(a.pre,{children:(0,s.jsx)(a.code,{children:"eksctl create cluster -f cluster-config.yaml\n"})}),"\n",(0,s.jsx)(a.h3,{id:"ecr-\u30ea\u30dd\u30b8\u30c8\u30ea\u306e\u4f5c\u6210",children:"ECR \u30ea\u30dd\u30b8\u30c8\u30ea\u306e\u4f5c\u6210"}),"\n",(0,s.jsx)(a.p,{children:"\u30a2\u30d7\u30ea\u30b1\u30fc\u30b7\u30e7\u30f3\u3092 EKS \u306b\u30c7\u30d7\u30ed\u30a4\u3059\u308b\u306b\u306f\u3001\u30b3\u30f3\u30c6\u30ca\u30ea\u30dd\u30b8\u30c8\u30ea\u304c\u5fc5\u8981\u3067\u3059\u3002\n\u30d7\u30e9\u30a4\u30d9\u30fc\u30c8\u306a ECR \u30ec\u30b8\u30b9\u30c8\u30ea\u3092\u4f7f\u7528\u3057\u307e\u3059\u304c\u3001\u30b3\u30f3\u30c6\u30ca\u30a4\u30e1\u30fc\u30b8\u3092\u5171\u6709\u3057\u305f\u3044\u5834\u5408\u306f ECR Public \u3082\u4f7f\u7528\u3067\u304d\u307e\u3059\u3002"}),"\n",(0,s.jsx)(a.p,{children:"\u307e\u305a\u3001\u6b21\u306e\u3088\u3046\u306b\u74b0\u5883\u5909\u6570\u3092\u8a2d\u5b9a\u3057\u307e\u3059(\u30ea\u30fc\u30b8\u30e7\u30f3\u306f\u3054\u81ea\u8eab\u306e\u3082\u306e\u306b\u7f6e\u304d\u63db\u3048\u3066\u304f\u3060\u3055\u3044)\u3002"}),"\n",(0,s.jsx)(a.pre,{children:(0,s.jsx)(a.code,{children:'export REGION="eu-west-1"\nexport ACCOUNTID=`aws sts get-caller-identity --query Account --output text`\n'})}),"\n",(0,s.jsx)(a.p,{children:"\u6b21\u306e\u30b3\u30de\u30f3\u30c9\u3092\u4f7f\u7528\u3057\u3066\u3001\u30a2\u30ab\u30a6\u30f3\u30c8\u306b\u65b0\u3057\u3044 ECR \u30ea\u30dd\u30b8\u30c8\u30ea\u3092\u4f5c\u6210\u3067\u304d\u307e\u3059\u3002"}),"\n",(0,s.jsx)(a.pre,{children:(0,s.jsx)(a.code,{children:"aws ecr create-repository \\\n    --repository-name ho11y \\\n    --image-scanning-configuration scanOnPush=true \\\n    --region $REGION\n"})}),"\n",(0,s.jsx)(a.h3,{id:"adot-collector-\u306e\u30bb\u30c3\u30c8\u30a2\u30c3\u30d7",children:"ADOT Collector \u306e\u30bb\u30c3\u30c8\u30a2\u30c3\u30d7"}),"\n",(0,s.jsxs)(a.p,{children:[(0,s.jsx)(a.a,{target:"_blank","data-noBrokenLinkCheck":!0,href:n(23383).A+"",children:"adot-collector-fargate.yaml"})," \u3092\u30c0\u30a6\u30f3\u30ed\u30fc\u30c9\u3057\u3001\u6b21\u306e\u30b9\u30c6\u30c3\u30d7\u3067\u8aac\u660e\u3059\u308b\u30d1\u30e9\u30e1\u30fc\u30bf\u30fc\u3092\u4f7f\u7528\u3057\u3066\u3053\u306e YAML \u30c9\u30ad\u30e5\u30e1\u30f3\u30c8\u3092\u7de8\u96c6\u3057\u307e\u3059\u3002"]}),"\n",(0,s.jsx)(a.pre,{children:(0,s.jsx)(a.code,{children:"kubectl apply -f adot-collector-fargate.yaml\n"})}),"\n",(0,s.jsx)(a.h3,{id:"managed-grafana\u306e\u8a2d\u5b9a",children:"Managed Grafana\u306e\u8a2d\u5b9a"}),"\n",(0,s.jsxs)(a.p,{children:[(0,s.jsx)(a.a,{href:"https://aws.amazon.com/blogs/mt/amazon-managed-grafana-getting-started/",children:"Amazon Managed Grafana \u2013 Getting Started"})," \u30ac\u30a4\u30c9\u3092\u4f7f\u7528\u3057\u3066\u65b0\u3057\u3044\u30ef\u30fc\u30af\u30b9\u30da\u30fc\u30b9\u3092\u8a2d\u5b9a\u3057\u3001",(0,s.jsx)(a.a,{href:"https://docs.aws.amazon.com/grafana/latest/userguide/x-ray-data-source.html",children:"X-Ray \u3092\u30c7\u30fc\u30bf\u30bd\u30fc\u30b9\u3068\u3057\u3066\u8ffd\u52a0"}),"\u3057\u307e\u3059\u3002"]}),"\n",(0,s.jsx)(a.h2,{id:"\u30b7\u30b0\u30ca\u30eb\u30b8\u30a7\u30cd\u30ec\u30fc\u30bf\u30fc",children:"\u30b7\u30b0\u30ca\u30eb\u30b8\u30a7\u30cd\u30ec\u30fc\u30bf\u30fc"}),"\n",(0,s.jsxs)(a.p,{children:["\u30b7\u30b0\u30ca\u30eb\u30b8\u30a7\u30cd\u30ec\u30fc\u30bf\u30fc\u306e ",(0,s.jsx)(a.code,{children:"ho11y"})," \u3092\u3001\u30ec\u30b7\u30d4\u30ea\u30dd\u30b8\u30c8\u30ea\u306e ",(0,s.jsx)(a.a,{href:"https://github.com/aws-observability/observability-best-practices/tree/main/sandbox/ho11y",children:"sandbox"})," \u304b\u3089\u4f7f\u7528\u3057\u307e\u3059\u3002\n\u3057\u305f\u304c\u3063\u3066\u3001\u307e\u3060\u30ed\u30fc\u30ab\u30eb\u74b0\u5883\u306b\u30ea\u30dd\u30b8\u30c8\u30ea\u3092\u30af\u30ed\u30fc\u30f3\u3057\u3066\u3044\u306a\u3044\u5834\u5408\u306f\u3001\u6b21\u306e\u3088\u3046\u306b\u30af\u30ed\u30fc\u30f3\u3057\u3066\u304f\u3060\u3055\u3044:"]}),"\n",(0,s.jsx)(a.pre,{children:(0,s.jsx)(a.code,{children:"git clone https://github.com/aws-observability/aws-o11y-recipes.git\n"})}),"\n",(0,s.jsx)(a.h3,{id:"\u30b3\u30f3\u30c6\u30ca\u30a4\u30e1\u30fc\u30b8\u306e\u30d3\u30eb\u30c9",children:"\u30b3\u30f3\u30c6\u30ca\u30a4\u30e1\u30fc\u30b8\u306e\u30d3\u30eb\u30c9"}),"\n",(0,s.jsxs)(a.p,{children:[(0,s.jsx)(a.code,{children:"ACCOUNTID"})," \u3068 ",(0,s.jsx)(a.code,{children:"REGION"})," \u306e\u74b0\u5883\u5909\u6570\u304c\u8a2d\u5b9a\u3055\u308c\u3066\u3044\u308b\u3053\u3068\u3092\u78ba\u8a8d\u3057\u3066\u304f\u3060\u3055\u3044\u3002\n\u4f8b:"]}),"\n",(0,s.jsx)(a.pre,{children:(0,s.jsx)(a.code,{children:'export REGION="eu-west-1"\nexport ACCOUNTID=`aws sts get-caller-identity --query Account --output text`\n'})}),"\n",(0,s.jsxs)(a.p,{children:[(0,s.jsx)(a.code,{children:"ho11y"})," \u30b3\u30f3\u30c6\u30ca\u30a4\u30e1\u30fc\u30b8\u3092\u30d3\u30eb\u30c9\u3059\u308b\u306b\u306f\u3001\u307e\u305a ",(0,s.jsx)(a.code,{children:"./sandbox/ho11y/"})," \u30c7\u30a3\u30ec\u30af\u30c8\u30ea\u306b\u79fb\u52d5\u3057\u3001\u30b3\u30f3\u30c6\u30ca\u30a4\u30e1\u30fc\u30b8\u3092\u30d3\u30eb\u30c9\u3057\u307e\u3059\u3002"]}),"\n",(0,s.jsx)(a.admonition,{type:"note",children:(0,s.jsx)(a.p,{children:"\u6b21\u306e\u30d3\u30eb\u30c9\u624b\u9806\u3067\u306f\u3001Docker \u30c7\u30fc\u30e2\u30f3\u307e\u305f\u306f\u540c\u7b49\u306e OCI \u30a4\u30e1\u30fc\u30b8\u30d3\u30eb\u30c9\u30c4\u30fc\u30eb\u304c\u5b9f\u884c\u3055\u308c\u3066\u3044\u308b\u3053\u3068\u3092\u524d\u63d0\u3068\u3057\u3066\u3044\u307e\u3059\u3002"})}),"\n",(0,s.jsx)(a.pre,{children:(0,s.jsx)(a.code,{children:'docker build . -t "$ACCOUNTID.dkr.ecr.$REGION.amazonaws.com/ho11y:latest"\n'})}),"\n",(0,s.jsx)(a.h3,{id:"\u30b3\u30f3\u30c6\u30ca\u30a4\u30e1\u30fc\u30b8\u306e\u30d7\u30c3\u30b7\u30e5",children:"\u30b3\u30f3\u30c6\u30ca\u30a4\u30e1\u30fc\u30b8\u306e\u30d7\u30c3\u30b7\u30e5"}),"\n",(0,s.jsx)(a.p,{children:"\u6b21\u306b\u3001\u524d\u8ff0\u306e\u4f5c\u6210\u3057\u305f ECR \u30ea\u30dd\u30b8\u30c8\u30ea\u306b\u30b3\u30f3\u30c6\u30ca\u30a4\u30e1\u30fc\u30b8\u3092\u30d7\u30c3\u30b7\u30e5\u3067\u304d\u307e\u3059\u3002\n\u305d\u306e\u305f\u3081\u306b\u307e\u305a\u3001\u30c7\u30d5\u30a9\u30eb\u30c8\u306e ECR \u30ec\u30b8\u30b9\u30c8\u30ea\u306b\u30ed\u30b0\u30a4\u30f3\u3057\u307e\u3059\u3002"}),"\n",(0,s.jsx)(a.pre,{children:(0,s.jsx)(a.code,{children:'aws ecr get-login-password --region $REGION | \\\n    docker login --username AWS --password-stdin \\\n    "$ACCOUNTID.dkr.ecr.$REGION.amazonaws.com"\n'})}),"\n",(0,s.jsx)(a.p,{children:"\u6700\u5f8c\u306b\u3001\u4e0a\u8a18\u3067\u4f5c\u6210\u3057\u305f ECR \u30ea\u30dd\u30b8\u30c8\u30ea\u306b\u30b3\u30f3\u30c6\u30ca\u30a4\u30e1\u30fc\u30b8\u3092\u30d7\u30c3\u30b7\u30e5\u3057\u307e\u3059\u3002"}),"\n",(0,s.jsx)(a.pre,{children:(0,s.jsx)(a.code,{children:'docker push "$ACCOUNTID.dkr.ecr.$REGION.amazonaws.com/ho11y:latest"\n'})}),"\n",(0,s.jsx)(a.h3,{id:"\u30b7\u30b0\u30ca\u30eb\u30b8\u30a7\u30cd\u30ec\u30fc\u30bf\u30fc\u306e\u30c7\u30d7\u30ed\u30a4",children:"\u30b7\u30b0\u30ca\u30eb\u30b8\u30a7\u30cd\u30ec\u30fc\u30bf\u30fc\u306e\u30c7\u30d7\u30ed\u30a4"}),"\n",(0,s.jsxs)(a.p,{children:[(0,s.jsx)(a.a,{target:"_blank","data-noBrokenLinkCheck":!0,href:n(72824).A+"",children:"x-ray-sample-app.yaml"})," \u3092\u7de8\u96c6\u3057\u3066\u3001ECR \u30a4\u30e1\u30fc\u30b8\u30d1\u30b9\u3092\u542b\u3081\u307e\u3059\u3002\u3064\u307e\u308a\u3001\u30d5\u30a1\u30a4\u30eb\u5185\u306e ",(0,s.jsx)(a.code,{children:"ACCOUNTID"})," \u3068 ",(0,s.jsx)(a.code,{children:"REGION"})," \u3092\u81ea\u5206\u306e\u5024\u306b\u7f6e\u304d\u63db\u3048\u307e\u3059(\u5408\u8a08 3 \u304b\u6240)\u3002"]}),"\n",(0,s.jsx)(a.pre,{children:(0,s.jsx)(a.code,{children:'    # change the following to your container image:\n    image: "ACCOUNTID.dkr.ecr.REGION.amazonaws.com/ho11y:latest"\n'})}),"\n",(0,s.jsx)(a.p,{children:"\u3053\u308c\u3067\u30b5\u30f3\u30d7\u30eb\u30a2\u30d7\u30ea\u3092\u30af\u30e9\u30b9\u30bf\u306b\u6b21\u306e\u30b3\u30de\u30f3\u30c9\u3067\u30c7\u30d7\u30ed\u30a4\u3067\u304d\u307e\u3059\u3002"}),"\n",(0,s.jsx)(a.pre,{children:(0,s.jsx)(a.code,{children:"kubectl -n example-app apply -f x-ray-sample-app.yaml\n"})}),"\n",(0,s.jsx)(a.h2,{id:"\u30a8\u30f3\u30c9\u30c4\u30fc\u30a8\u30f3\u30c9",children:"\u30a8\u30f3\u30c9\u30c4\u30fc\u30a8\u30f3\u30c9"}),"\n",(0,s.jsxs)(a.p,{children:["\u30a4\u30f3\u30d5\u30e9\u30b9\u30c8\u30e9\u30af\u30c1\u30e3\u3068\u30a2\u30d7\u30ea\u30b1\u30fc\u30b7\u30e7\u30f3\u304c\u6574\u3063\u305f\u306e\u3067\u3001\u30bb\u30c3\u30c8\u30a2\u30c3\u30d7\u3092\u30c6\u30b9\u30c8\u3057\u307e\u3059\u3002EKS \u3067\u5b9f\u884c\u3055\u308c\u3066\u3044\u308b ",(0,s.jsx)(a.code,{children:"ho11y"})," \u304b\u3089 X-Ray \u306b\u30c8\u30ec\u30fc\u30b9\u3092\u9001\u4fe1\u3057\u3001AMG \u3067\u53ef\u8996\u5316\u3057\u307e\u3059\u3002"]}),"\n",(0,s.jsx)(a.h3,{id:"\u30d1\u30a4\u30d7\u30e9\u30a4\u30f3\u306e\u691c\u8a3c",children:"\u30d1\u30a4\u30d7\u30e9\u30a4\u30f3\u306e\u691c\u8a3c"}),"\n",(0,s.jsxs)(a.p,{children:[(0,s.jsx)(a.code,{children:"ho11y"})," \u304b\u3089\u306e\u30c8\u30ec\u30fc\u30b9\u3092 ADOT \u30b3\u30ec\u30af\u30bf\u30fc\u304c\u30a4\u30f3\u30b8\u30a7\u30b9\u30c8\u3057\u3066\u3044\u308b\u3053\u3068\u3092\u78ba\u8a8d\u3059\u308b\u306b\u306f\u3001\u30b5\u30fc\u30d3\u30b9\u306e1\u3064\u3092\u30ed\u30fc\u30ab\u30eb\u3067\u5229\u7528\u53ef\u80fd\u306b\u3057\u3066\u547c\u3073\u51fa\u3057\u307e\u3059\u3002"]}),"\n",(0,s.jsx)(a.p,{children:"\u307e\u305a\u3001\u30c8\u30e9\u30d5\u30a3\u30c3\u30af\u3092\u6b21\u306e\u3088\u3046\u306b\u8ee2\u9001\u3057\u307e\u3059\u3002"}),"\n",(0,s.jsx)(a.pre,{children:(0,s.jsx)(a.code,{children:"kubectl -n example-app port-forward svc/frontend 8765:80\n"})}),"\n",(0,s.jsxs)(a.p,{children:["\u4e0a\u8a18\u306e\u30b3\u30de\u30f3\u30c9\u3067\u30012\u3064\u306e\u4ed6\u306e ",(0,s.jsx)(a.code,{children:"ho11y"})," \u30a4\u30f3\u30b9\u30bf\u30f3\u30b9\u3068\u901a\u4fe1\u3059\u308b\u3088\u3046\u306b\u69cb\u6210\u3055\u308c\u305f ",(0,s.jsx)(a.code,{children:"ho11y"})," \u30a4\u30f3\u30b9\u30bf\u30f3\u30b9\u3067\u3042\u308b ",(0,s.jsx)(a.code,{children:"frontend"})," \u30de\u30a4\u30af\u30ed\u30b5\u30fc\u30d3\u30b9\u304c\u30ed\u30fc\u30ab\u30eb\u74b0\u5883\u3067\u5229\u7528\u3067\u304d\u308b\u3088\u3046\u306b\u306a\u308a\u3001\u6b21\u306e\u3088\u3046\u306b\u547c\u3073\u51fa\u3059\u3053\u3068\u304c\u3067\u304d\u307e\u3059(\u30c8\u30ec\u30fc\u30b9\u306e\u4f5c\u6210\u3092\u30c8\u30ea\u30ac\u30fc\u3057\u307e\u3059)\u3002"]}),"\n",(0,s.jsx)(a.pre,{children:(0,s.jsx)(a.code,{children:'$ curl localhost:8765/\n{"traceId":"1-6193a9be-53693f29a0119ee4d661ba0d"}\n'})}),"\n",(0,s.jsx)(a.admonition,{type:"tip",children:(0,s.jsxs)(a.p,{children:["\u547c\u3073\u51fa\u3057\u3092\u81ea\u52d5\u5316\u3057\u305f\u3044\u5834\u5408\u306f\u3001",(0,s.jsx)(a.code,{children:"curl"})," \u547c\u3073\u51fa\u3057\u3092 ",(0,s.jsx)(a.code,{children:"while true"})," \u30eb\u30fc\u30d7\u3067\u30e9\u30c3\u30d7\u3067\u304d\u307e\u3059\u3002"]})}),"\n",(0,s.jsxs)(a.p,{children:["\u30bb\u30c3\u30c8\u30a2\u30c3\u30d7\u3092\u78ba\u8a8d\u3059\u308b\u306b\u306f\u3001",(0,s.jsx)(a.a,{href:"https://console.aws.amazon.com/cloudwatch/home#xray:service-map/",children:"CloudWatch \u306e X-Ray \u30d3\u30e5\u30fc"})," \u3092\u53c2\u7167\u3057\u3066\u304f\u3060\u3055\u3044\u3002\u6b21\u306e\u3088\u3046\u306a\u8868\u793a\u304c\u3055\u308c\u308b\u306f\u305a\u3067\u3059\u3002"]}),"\n",(0,s.jsx)(a.p,{children:(0,s.jsx)(a.img,{alt:"CW \u306e X-Ray \u30b3\u30f3\u30bd\u30fc\u30eb\u306e\u30b9\u30af\u30ea\u30fc\u30f3\u30b7\u30e7\u30c3\u30c8",src:n(95287).A+"",width:"1000",height:"595"})}),"\n",(0,s.jsx)(a.p,{children:"\u30b7\u30b0\u30ca\u30eb\u30b8\u30a7\u30cd\u30ec\u30fc\u30bf\u30fc\u306e\u30bb\u30c3\u30c8\u30a2\u30c3\u30d7\u3068\u30a2\u30af\u30c6\u30a3\u30d6\u5316\u3001OpenTelemetry \u30d1\u30a4\u30d7\u30e9\u30a4\u30f3\u306e\u30bb\u30c3\u30c8\u30a2\u30c3\u30d7\u304c\u5b8c\u4e86\u3057\u305f\u306e\u3067\u3001\u6b21\u306b Grafana \u3067\u30c8\u30ec\u30fc\u30b9\u3092\u6d88\u8cbb\u3059\u308b\u65b9\u6cd5\u3092\u898b\u3066\u3044\u304d\u307e\u3057\u3087\u3046\u3002"}),"\n",(0,s.jsx)(a.h3,{id:"grafana-\u30c0\u30c3\u30b7\u30e5\u30dc\u30fc\u30c9",children:"Grafana \u30c0\u30c3\u30b7\u30e5\u30dc\u30fc\u30c9"}),"\n",(0,s.jsxs)(a.p,{children:[(0,s.jsx)(a.a,{target:"_blank","data-noBrokenLinkCheck":!0,href:n(40256).A+"",children:"x-ray-sample-dashboard.json"})," \u304b\u3089\u5229\u7528\u3067\u304d\u308b\u30b5\u30f3\u30d7\u30eb\u30c0\u30c3\u30b7\u30e5\u30dc\u30fc\u30c9\u3092\u30a4\u30f3\u30dd\u30fc\u30c8\u3067\u304d\u307e\u3059\u3002\u30c0\u30c3\u30b7\u30e5\u30dc\u30fc\u30c9\u306f\u6b21\u306e\u3088\u3046\u306b\u8868\u793a\u3055\u308c\u307e\u3059\u3002"]}),"\n",(0,s.jsx)(a.p,{children:(0,s.jsx)(a.img,{alt:"AMG \u306e X-Ray \u30c0\u30c3\u30b7\u30e5\u30dc\u30fc\u30c9\u306e\u30b9\u30af\u30ea\u30fc\u30f3\u30b7\u30e7\u30c3\u30c8",src:n(39161).A+"",width:"1000",height:"483"})}),"\n",(0,s.jsxs)(a.p,{children:["\u3055\u3089\u306b\u3001\u4e0b\u90e8\u306e ",(0,s.jsx)(a.code,{children:"downstreams"})," \u30d1\u30cd\u30eb\u306e\u30c8\u30ec\u30fc\u30b9\u3092\u30af\u30ea\u30c3\u30af\u3059\u308b\u3068\u3001\u305d\u308c\u3092\u30af\u30ea\u30c3\u30af\u3057\u3066\u300cExplore\u300d\u30bf\u30d6\u3067\u6b21\u306e\u3088\u3046\u306b\u8868\u793a\u3067\u304d\u307e\u3059\u3002"]}),"\n",(0,s.jsx)(a.p,{children:(0,s.jsx)(a.img,{alt:"AMG \u306e X-Ray \u30c0\u30c3\u30b7\u30e5\u30dc\u30fc\u30c9\u306e\u30b9\u30af\u30ea\u30fc\u30f3\u30b7\u30e7\u30c3\u30c8",src:n(504).A+"",width:"4716",height:"1924"})}),"\n",(0,s.jsx)(a.p,{children:"\u3053\u3053\u304b\u3089\u3001\u6b21\u306e\u30ac\u30a4\u30c9\u3092\u4f7f\u7528\u3057\u3066\u3001Amazon Managed Grafana \u3067\u72ec\u81ea\u306e\u30c0\u30c3\u30b7\u30e5\u30dc\u30fc\u30c9\u3092\u4f5c\u6210\u3067\u304d\u307e\u3059\u3002"}),"\n",(0,s.jsxs)(a.ul,{children:["\n",(0,s.jsx)(a.li,{children:(0,s.jsx)(a.a,{href:"https://docs.aws.amazon.com/grafana/latest/userguide/dashboard-overview.html",children:"\u30e6\u30fc\u30b6\u30fc\u30ac\u30a4\u30c9: \u30c0\u30c3\u30b7\u30e5\u30dc\u30fc\u30c9"})}),"\n",(0,s.jsx)(a.li,{children:(0,s.jsx)(a.a,{href:"https://grafana.com/docs/grafana/latest/best-practices/best-practices-for-creating-dashboards/",children:"\u30c0\u30c3\u30b7\u30e5\u30dc\u30fc\u30c9\u4f5c\u6210\u306e\u30d9\u30b9\u30c8\u30d7\u30e9\u30af\u30c6\u30a3\u30b9"})}),"\n"]}),"\n",(0,s.jsx)(a.p,{children:"\u4ee5\u4e0a\u3067\u7d42\u4e86\u3067\u3059\u3002\u304a\u3081\u3067\u3068\u3046\u3054\u3056\u3044\u307e\u3059\u3002Fargate \u4e0a\u306e EKS \u3067 ADOT \u3092\u4f7f\u7528\u3057\u3066\u30c8\u30ec\u30fc\u30b9\u3092\u53d6\u308a\u8fbc\u3080\u65b9\u6cd5\u3092\u5b66\u3073\u307e\u3057\u305f\u3002"}),"\n",(0,s.jsx)(a.h2,{id:"\u30af\u30ea\u30fc\u30f3\u30a2\u30c3\u30d7",children:"\u30af\u30ea\u30fc\u30f3\u30a2\u30c3\u30d7"}),"\n",(0,s.jsx)(a.p,{children:"\u307e\u305a\u3001Kubernetes \u30ea\u30bd\u30fc\u30b9\u3092\u524a\u9664\u3057\u3001EKS \u30af\u30e9\u30b9\u30bf\u30fc\u3092\u7834\u58ca\u3057\u307e\u3059\u3002"}),"\n",(0,s.jsx)(a.pre,{children:(0,s.jsx)(a.code,{children:"kubectl delete all --all && \\\neksctl delete cluster --name xray-eks-fargate\n"})}),"\n",(0,s.jsx)(a.p,{children:"\u6700\u5f8c\u306b\u3001AWS \u30b3\u30f3\u30bd\u30fc\u30eb\u304b\u3089 Amazon Managed Grafana \u30ef\u30fc\u30af\u30b9\u30da\u30fc\u30b9\u3092\u524a\u9664\u3057\u3066\u304f\u3060\u3055\u3044\u3002"})]})}function h(e={}){const{wrapper:a}={...(0,r.R)(),...e.components};return a?(0,s.jsx)(a,{...e,children:(0,s.jsx)(o,{...e})}):o(e)}},23383:(e,a,n)=>{n.d(a,{A:()=>s});const s=n.p+"assets/files/adot-collector-fargate-f341911426e4ef23dd65c57ac9b670f3.yaml"},1359:(e,a,n)=>{n.d(a,{A:()=>s});const s=n.p+"assets/files/cluster-config-5ef0e2087a2a5646ae9b5502c5df0359.yaml"},72824:(e,a,n)=>{n.d(a,{A:()=>s});const s=n.p+"assets/files/x-ray-sample-app-bf1f799ee0bec9ed5145d83cadba022a.yaml"},40256:(e,a,n)=>{n.d(a,{A:()=>s});const s=n.p+"assets/files/x-ray-sample-dashboard-17616c72dda1c36a967335d42fe0f35c.json"},6367:(e,a,n)=>{n.d(a,{A:()=>s});const s=n.p+"assets/images/adot-default-pipeline-ff22be138946fdcf926d0a69a834816c.png"},39161:(e,a,n)=>{n.d(a,{A:()=>s});const s=n.p+"assets/images/x-ray-amg-ho11y-dashboard-563eda40c7805e1adfa7031b5f25e598.png"},504:(e,a,n)=>{n.d(a,{A:()=>s});const s=n.p+"assets/images/x-ray-amg-ho11y-explore-d3c9b386cec38e1336a0601610be0824.png"},95287:(e,a,n)=>{n.d(a,{A:()=>s});const s=n.p+"assets/images/x-ray-cw-ho11y-331b86fc9b4dbc3076f9d8d6a784f495.png"},28453:(e,a,n)=>{n.d(a,{R:()=>t,x:()=>l});var s=n(96540);const r={},c=s.createContext(r);function t(e){const a=s.useContext(c);return s.useMemo((function(){return"function"==typeof e?e(a):{...a,...e}}),[a,e])}function l(e){let a;return a=e.disableParentContext?"function"==typeof e.components?e.components(r):e.components||r:t(e.components),s.createElement(c.Provider,{value:a},e.children)}}}]);
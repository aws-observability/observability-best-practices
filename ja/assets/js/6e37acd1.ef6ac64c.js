"use strict";(self.webpackChunkobservability_best_practices=self.webpackChunkobservability_best_practices||[]).push([[1947],{2822:(e,n,s)=>{s.r(n),s.d(n,{assets:()=>c,contentTitle:()=>t,default:()=>d,frontMatter:()=>i,metadata:()=>o,toc:()=>l});var a=s(74848),r=s(28453);const i={},t="Amazon Elastic Kubernetes Service",o={id:"recipes/eks",title:"Amazon Elastic Kubernetes Service",description:"Amazon Elastic Kubernetes Service(EKS) \u306f\u3001AWS \u30af\u30e9\u30a6\u30c9\u307e\u305f\u306f\u30aa\u30f3\u30d7\u30ec\u30df\u30b9\u3067 Kubernetes \u30a2\u30d7\u30ea\u30b1\u30fc\u30b7\u30e7\u30f3\u3092\u958b\u59cb\u3001\u5b9f\u884c\u3001\u30b9\u30b1\u30fc\u30ea\u30f3\u30b0\u3059\u308b\u67d4\u8edf\u6027\u3092\u63d0\u4f9b\u3057\u307e\u3059\u3002",source:"@site/i18n/ja/docusaurus-plugin-content-docs/current/recipes/eks.md",sourceDirName:"recipes",slug:"/recipes/eks",permalink:"/observability-best-practices/ja/docs/recipes/eks",draft:!1,unlisted:!1,editUrl:"https://github.com/aws-observability/observability-best-practices/blob/main/docusaurus/docs/recipes/eks.md",tags:[],version:"current",frontMatter:{},sidebar:"recipes",previous:{title:"AWS App Runner",permalink:"/observability-best-practices/ja/docs/recipes/apprunner"},next:{title:"Amazon Elastic Container Service",permalink:"/observability-best-practices/ja/docs/recipes/ecs"}},c={},l=[{value:"EKS on EC2",id:"eks-on-ec2",level:2},{value:"\u30ed\u30b0",id:"\u30ed\u30b0",level:3},{value:"\u30e1\u30c8\u30ea\u30af\u30b9",id:"\u30e1\u30c8\u30ea\u30af\u30b9",level:3},{value:"\u30c8\u30ec\u30fc\u30b9",id:"\u30c8\u30ec\u30fc\u30b9",level:3},{value:"EKS on Fargate",id:"eks-on-fargate",level:2},{value:"\u30ed\u30b0",id:"\u30ed\u30b0-1",level:3},{value:"\u30e1\u30c8\u30ea\u30af\u30b9",id:"\u30e1\u30c8\u30ea\u30af\u30b9-1",level:3},{value:"\u30c8\u30ec\u30fc\u30b9",id:"\u30c8\u30ec\u30fc\u30b9-1",level:3}];function h(e){const n={a:"a",h1:"h1",h2:"h2",h3:"h3",li:"li",p:"p",ul:"ul",...(0,r.R)(),...e.components};return(0,a.jsxs)(a.Fragment,{children:[(0,a.jsx)(n.h1,{id:"amazon-elastic-kubernetes-service",children:"Amazon Elastic Kubernetes Service"}),"\n",(0,a.jsxs)(n.p,{children:[(0,a.jsx)(n.a,{href:"https://aws.amazon.com/eks/",children:"Amazon Elastic Kubernetes Service"}),"(EKS) \u306f\u3001AWS \u30af\u30e9\u30a6\u30c9\u307e\u305f\u306f\u30aa\u30f3\u30d7\u30ec\u30df\u30b9\u3067 Kubernetes \u30a2\u30d7\u30ea\u30b1\u30fc\u30b7\u30e7\u30f3\u3092\u958b\u59cb\u3001\u5b9f\u884c\u3001\u30b9\u30b1\u30fc\u30ea\u30f3\u30b0\u3059\u308b\u67d4\u8edf\u6027\u3092\u63d0\u4f9b\u3057\u307e\u3059\u3002"]}),"\n",(0,a.jsx)(n.p,{children:"\u30b3\u30f3\u30d4\u30e5\u30fc\u30c8\u30a8\u30f3\u30b8\u30f3\u5225\u306b\u30b0\u30eb\u30fc\u30d7\u5316\u3055\u308c\u305f\u4ee5\u4e0b\u306e\u30ec\u30b7\u30d4\u3092\u3054\u89a7\u304f\u3060\u3055\u3044\u3002"}),"\n",(0,a.jsx)(n.h2,{id:"eks-on-ec2",children:"EKS on EC2"}),"\n",(0,a.jsx)(n.h3,{id:"\u30ed\u30b0",children:"\u30ed\u30b0"}),"\n",(0,a.jsxs)(n.ul,{children:["\n",(0,a.jsx)(n.li,{children:(0,a.jsx)(n.a,{href:"https://aws.amazon.com/blogs/containers/fluent-bit-integration-in-cloudwatch-container-insights-for-eks/",children:"EKS \u306e CloudWatch Container Insights \u3078\u306e Fluent Bit \u30a4\u30f3\u30c6\u30b0\u30ec\u30fc\u30b7\u30e7\u30f3"})}),"\n",(0,a.jsx)(n.li,{children:(0,a.jsx)(n.a,{href:"https://www.eksworkshop.com/intermediate/230_logging/",children:"EFK \u30b9\u30bf\u30c3\u30af\u3092\u4f7f\u7528\u3057\u305f\u30ed\u30ae\u30f3\u30b0"})}),"\n",(0,a.jsx)(n.li,{children:(0,a.jsx)(n.a,{href:"https://github.com/aws-samples/amazon-eks-fluent-logging-examples",children:"EKS \u4e0a\u306e Fluent Bit \u3068 FluentD \u306e\u30b5\u30f3\u30d7\u30eb\u30ed\u30ae\u30f3\u30b0\u30a2\u30fc\u30ad\u30c6\u30af\u30c1\u30e3"})}),"\n"]}),"\n",(0,a.jsx)(n.h3,{id:"\u30e1\u30c8\u30ea\u30af\u30b9",children:"\u30e1\u30c8\u30ea\u30af\u30b9"}),"\n",(0,a.jsxs)(n.ul,{children:["\n",(0,a.jsx)(n.li,{children:(0,a.jsx)(n.a,{href:"https://aws.amazon.com/blogs/mt/getting-started-amazon-managed-service-for-prometheus/",children:"Amazon Managed Service for Prometheus \u306e\u6982\u8981"})}),"\n",(0,a.jsx)(n.li,{children:(0,a.jsx)(n.a,{href:"/observability-best-practices/ja/docs/recipes/recipes/ec2-eks-metrics-go-adot-ampamg",children:"EC2 \u4e0a\u306e EKS \u3067 ADOT \u3092\u4f7f\u7528\u3057\u3066 AMP \u306b\u30e1\u30c8\u30ea\u30af\u30b9\u3092\u53d6\u308a\u8fbc\u307f\u3001AMG \u3067\u53ef\u8996\u5316"})}),"\n",(0,a.jsx)(n.li,{children:(0,a.jsx)(n.a,{href:"https://aws.amazon.com/blogs/opensource/configuring-grafana-cloud-agent-for-amazon-managed-service-for-prometheus/",children:"Amazon Managed Service for Prometheus \u7528 Grafana Cloud \u30a8\u30fc\u30b8\u30a7\u30f3\u30c8\u306e\u8a2d\u5b9a"})}),"\n",(0,a.jsx)(n.li,{children:(0,a.jsx)(n.a,{href:"https://www.eksworkshop.com/intermediate/240_monitoring/",children:"Prometheus \u3068 Grafana \u3092\u4f7f\u7528\u3057\u305f\u30af\u30e9\u30b9\u30bf\u30fc\u306e\u30e2\u30cb\u30bf\u30ea\u30f3\u30b0"})}),"\n",(0,a.jsx)(n.li,{children:(0,a.jsx)(n.a,{href:"https://www.eksworkshop.com/intermediate/246_monitoring_amp_amg/",children:"Managed Prometheus \u3068 Managed Grafana \u306b\u3088\u308b\u30e2\u30cb\u30bf\u30ea\u30f3\u30b0"})}),"\n",(0,a.jsx)(n.li,{children:(0,a.jsx)(n.a,{href:"https://www.eksworkshop.com/intermediate/250_cloudwatch_container_insights/",children:"CloudWatch Container Insights"})}),"\n",(0,a.jsx)(n.li,{children:(0,a.jsx)(n.a,{href:"https://aws.amazon.com/blogs/opensource/set-up-cross-region-metrics-collection-for-amazon-managed-service-for-prometheus-workspaces/",children:"AMP \u30ef\u30fc\u30af\u30b9\u30da\u30fc\u30b9\u306e\u30af\u30ed\u30b9\u30ea\u30fc\u30b8\u30e7\u30f3\u30e1\u30c8\u30ea\u30af\u30b9\u53ce\u96c6\u306e\u8a2d\u5b9a"})}),"\n",(0,a.jsx)(n.li,{children:(0,a.jsx)(n.a,{href:"/observability-best-practices/ja/docs/recipes/recipes/servicemesh-monitoring-ampamg",children:"Amazon Managed Service for Prometheus \u3092\u4f7f\u7528\u3057\u305f EKS \u4e0a\u306e App Mesh \u74b0\u5883\u306e\u30e2\u30cb\u30bf\u30ea\u30f3\u30b0"})}),"\n",(0,a.jsx)(n.li,{children:(0,a.jsx)(n.a,{href:"https://aws.amazon.com/blogs/mt/monitor-istio-on-eks-using-amazon-managed-prometheus-and-amazon-managed-grafana/",children:"Amazon Managed Prometheus \u3068 Amazon Managed Grafana \u3092\u4f7f\u7528\u3057\u305f EKS \u4e0a\u306e Istio \u306e\u30e2\u30cb\u30bf\u30ea\u30f3\u30b0"})}),"\n",(0,a.jsx)(n.li,{children:(0,a.jsx)(n.a,{href:"https://aws.amazon.com/blogs/mt/proactive-autoscaling-of-kubernetes-workloads-with-keda-using-metrics-ingested-into-amazon-cloudwatch/",children:"KEDA \u3068 Amazon CloudWatch \u306b\u3088\u308b Kubernetes \u30ef\u30fc\u30af\u30ed\u30fc\u30c9\u306e\u30d7\u30ed\u30a2\u30af\u30c6\u30a3\u30d6\u306a\u81ea\u52d5\u30b9\u30b1\u30fc\u30ea\u30f3\u30b0"})}),"\n",(0,a.jsx)(n.li,{children:(0,a.jsx)(n.a,{href:"https://aws.amazon.com/blogs/containers/monitoring-amazon-eks-anywhere-using-amazon-managed-service-for-prometheus-and-amazon-managed-grafana/",children:"Amazon Managed Service for Prometheus \u3068 Amazon Managed Grafana \u3092\u4f7f\u7528\u3057\u305f Amazon EKS Anywhere \u306e\u30e2\u30cb\u30bf\u30ea\u30f3\u30b0"})}),"\n"]}),"\n",(0,a.jsx)(n.h3,{id:"\u30c8\u30ec\u30fc\u30b9",children:"\u30c8\u30ec\u30fc\u30b9"}),"\n",(0,a.jsxs)(n.ul,{children:["\n",(0,a.jsx)(n.li,{children:(0,a.jsx)(n.a,{href:"https://aws.amazon.com/blogs/opensource/migrating-x-ray-tracing-to-aws-distro-for-opentelemetry/",children:"X-Ray \u30c8\u30ec\u30fc\u30b7\u30f3\u30b0\u3092 AWS Distro for OpenTelemetry \u306b\u79fb\u884c\u3059\u308b"})}),"\n",(0,a.jsx)(n.li,{children:(0,a.jsx)(n.a,{href:"https://www.eksworkshop.com/intermediate/245_x-ray/x-ray/",children:"X-Ray \u3092\u4f7f\u7528\u3057\u305f\u30c8\u30ec\u30fc\u30b7\u30f3\u30b0"})}),"\n"]}),"\n",(0,a.jsx)(n.h2,{id:"eks-on-fargate",children:"EKS on Fargate"}),"\n",(0,a.jsx)(n.h3,{id:"\u30ed\u30b0-1",children:"\u30ed\u30b0"}),"\n",(0,a.jsxs)(n.ul,{children:["\n",(0,a.jsx)(n.li,{children:(0,a.jsx)(n.a,{href:"https://aws.amazon.com/blogs/containers/fluent-bit-for-amazon-eks-on-aws-fargate-is-here/",children:"AWS Fargate \u4e0a\u306e Amazon EKS \u7528 Fluent Bit \u304c\u767b\u5834"})}),"\n",(0,a.jsx)(n.li,{children:(0,a.jsx)(n.a,{href:"https://github.com/aws-samples/amazon-eks-fluent-logging-examples",children:"EKS \u4e0a\u306e Fluent Bit \u3068 FluentD \u306e\u30b5\u30f3\u30d7\u30eb\u30ed\u30ae\u30f3\u30b0\u30a2\u30fc\u30ad\u30c6\u30af\u30c1\u30e3"})}),"\n"]}),"\n",(0,a.jsx)(n.h3,{id:"\u30e1\u30c8\u30ea\u30af\u30b9-1",children:"\u30e1\u30c8\u30ea\u30af\u30b9"}),"\n",(0,a.jsxs)(n.ul,{children:["\n",(0,a.jsx)(n.li,{children:(0,a.jsx)(n.a,{href:"/observability-best-practices/ja/docs/recipes/recipes/fargate-eks-metrics-go-adot-ampamg",children:"Fargate \u4e0a\u306e EKS \u3067 ADOT \u3092\u4f7f\u7528\u3057\u3066 AMP \u306b\u30e1\u30c8\u30ea\u30af\u30b9\u3092\u53d6\u308a\u8fbc\u307f\u3001AMG \u3067\u53ef\u8996\u5316\u3059\u308b"})}),"\n",(0,a.jsx)(n.li,{children:(0,a.jsx)(n.a,{href:"https://www.eksworkshop.com/intermediate/250_cloudwatch_container_insights/",children:"CloudWatch Container Insights"})}),"\n",(0,a.jsx)(n.li,{children:(0,a.jsx)(n.a,{href:"https://aws.amazon.com/blogs/opensource/set-up-cross-region-metrics-collection-for-amazon-managed-service-for-prometheus-workspaces/",children:"AMP \u30ef\u30fc\u30af\u30b9\u30da\u30fc\u30b9\u306e\u30af\u30ed\u30b9\u30ea\u30fc\u30b8\u30e7\u30f3\u30e1\u30c8\u30ea\u30af\u30b9\u53ce\u96c6\u306e\u8a2d\u5b9a"})}),"\n"]}),"\n",(0,a.jsx)(n.h3,{id:"\u30c8\u30ec\u30fc\u30b9-1",children:"\u30c8\u30ec\u30fc\u30b9"}),"\n",(0,a.jsxs)(n.ul,{children:["\n",(0,a.jsx)(n.li,{children:(0,a.jsx)(n.a,{href:"/observability-best-practices/ja/docs/recipes/recipes/fargate-eks-xray-go-adot-amg",children:"AWS X-Ray \u3092\u4f7f\u7528\u3057\u305f Fargate \u4e0a\u306e EKS \u3067\u306e ADOT \u306e\u5229\u7528"})}),"\n",(0,a.jsx)(n.li,{children:(0,a.jsx)(n.a,{href:"https://www.eksworkshop.com/intermediate/245_x-ray/x-ray/",children:"X-Ray \u306b\u3088\u308b\u30c8\u30ec\u30fc\u30b9"})}),"\n"]})]})}function d(e={}){const{wrapper:n}={...(0,r.R)(),...e.components};return n?(0,a.jsx)(n,{...e,children:(0,a.jsx)(h,{...e})}):h(e)}},28453:(e,n,s)=>{s.d(n,{R:()=>t,x:()=>o});var a=s(96540);const r={},i=a.createContext(r);function t(e){const n=a.useContext(i);return a.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function o(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(r):e.components||r:t(e.components),a.createElement(i.Provider,{value:n},e.children)}}}]);
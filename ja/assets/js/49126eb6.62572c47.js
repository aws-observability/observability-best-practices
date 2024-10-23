"use strict";(self.webpackChunkobservability_best_practices=self.webpackChunkobservability_best_practices||[]).push([[3900],{96390:(e,s,a)=>{a.r(s),a.d(s,{assets:()=>c,contentTitle:()=>d,default:()=>l,frontMatter:()=>i,metadata:()=>r,toc:()=>o});var n=a(74848),t=a(28453);const i={},d="AMP \u3068 EKS \u4e0a\u3067 KEDA \u3092\u4f7f\u7528\u3057\u305f\u30a2\u30d7\u30ea\u30b1\u30fc\u30b7\u30e7\u30f3\u306e\u81ea\u52d5\u30b9\u30b1\u30fc\u30ea\u30f3\u30b0",r={id:"guides/containers/oss/eks/keda-amp-eks",title:"AMP \u3068 EKS \u4e0a\u3067 KEDA \u3092\u4f7f\u7528\u3057\u305f\u30a2\u30d7\u30ea\u30b1\u30fc\u30b7\u30e7\u30f3\u306e\u81ea\u52d5\u30b9\u30b1\u30fc\u30ea\u30f3\u30b0",description:"Amazon EKS \u30a2\u30d7\u30ea\u30b1\u30fc\u30b7\u30e7\u30f3\u3067\u306e\u30c8\u30e9\u30d5\u30a3\u30c3\u30af\u5897\u52a0\u3078\u306e\u5bfe\u5fdc\u306f\u8ab2\u984c\u3068\u306a\u3063\u3066\u304a\u308a\u3001\u624b\u52d5\u3067\u306e\u30b9\u30b1\u30fc\u30ea\u30f3\u30b0\u306f\u975e\u52b9\u7387\u7684\u3067\u30a8\u30e9\u30fc\u304c\u767a\u751f\u3057\u3084\u3059\u3044\u72b6\u6cc1\u3067\u3059\u3002\u30aa\u30fc\u30c8\u30b9\u30b1\u30fc\u30ea\u30f3\u30b0\u306f\u30ea\u30bd\u30fc\u30b9\u5272\u308a\u5f53\u3066\u306b\u304a\u3044\u3066\u3088\u308a\u826f\u3044\u30bd\u30ea\u30e5\u30fc\u30b7\u30e7\u30f3\u3092\u63d0\u4f9b\u3057\u307e\u3059\u3002KEDA \u306f\u69d8\u3005\u306a\u30e1\u30c8\u30ea\u30af\u30b9\u3084\u30a4\u30d9\u30f3\u30c8\u306b\u57fa\u3065\u3044\u3066 Kubernetes \u306e\u30aa\u30fc\u30c8\u30b9\u30b1\u30fc\u30ea\u30f3\u30b0\u3092\u53ef\u80fd\u306b\u3057\u3001\u4e00\u65b9 Amazon Managed Service for Prometheus \u306f EKS \u30af\u30e9\u30b9\u30bf\u30fc\u306e\u30bb\u30ad\u30e5\u30a2\u306a\u30e1\u30c8\u30ea\u30af\u30b9\u76e3\u8996\u3092\u63d0\u4f9b\u3057\u307e\u3059\u3002\u3053\u306e\u30bd\u30ea\u30e5\u30fc\u30b7\u30e7\u30f3\u3067\u306f\u3001KEDA \u3068 Amazon Managed Service for Prometheus \u3092\u7d44\u307f\u5408\u308f\u305b\u30011 \u79d2\u3042\u305f\u308a\u306e\u30ea\u30af\u30a8\u30b9\u30c8\u6570 (RPS) \u30e1\u30c8\u30ea\u30af\u30b9\u306b\u57fa\u3065\u304f\u30aa\u30fc\u30c8\u30b9\u30b1\u30fc\u30ea\u30f3\u30b0\u3092\u5b9f\u6f14\u3057\u307e\u3059\u3002\u3053\u306e\u30a2\u30d7\u30ed\u30fc\u30c1\u306b\u3088\u308a\u3001\u30ef\u30fc\u30af\u30ed\u30fc\u30c9\u306e\u9700\u8981\u306b\u5408\u308f\u305b\u305f\u81ea\u52d5\u30b9\u30b1\u30fc\u30ea\u30f3\u30b0\u304c\u5b9f\u73fe\u3055\u308c\u3001\u30e6\u30fc\u30b6\u30fc\u306f\u81ea\u8eab\u306e EKS \u30ef\u30fc\u30af\u30ed\u30fc\u30c9\u306b\u9069\u7528\u3067\u304d\u307e\u3059\u3002Amazon Managed Grafana \u306f\u30b9\u30b1\u30fc\u30ea\u30f3\u30b0\u30d1\u30bf\u30fc\u30f3\u306e\u76e3\u8996\u3068\u53ef\u8996\u5316\u306b\u4f7f\u7528\u3055\u308c\u3001\u30e6\u30fc\u30b6\u30fc\u306f\u30aa\u30fc\u30c8\u30b9\u30b1\u30fc\u30ea\u30f3\u30b0\u306e\u52d5\u4f5c\u306b\u95a2\u3059\u308b\u6d1e\u5bdf\u3092\u5f97\u3066\u3001\u30d3\u30b8\u30cd\u30b9\u30a4\u30d9\u30f3\u30c8\u3068\u95a2\u9023\u4ed8\u3051\u308b\u3053\u3068\u304c\u3067\u304d\u307e\u3059\u3002",source:"@site/i18n/ja/docusaurus-plugin-content-docs/current/guides/containers/oss/eks/keda-amp-eks.md",sourceDirName:"guides/containers/oss/eks",slug:"/guides/containers/oss/eks/keda-amp-eks",permalink:"/observability-best-practices/ja/guides/containers/oss/eks/keda-amp-eks",draft:!1,unlisted:!1,editUrl:"https://github.com/aws-observability/observability-best-practices/blob/main/docusaurus/docs/guides/containers/oss/eks/keda-amp-eks.md",tags:[],version:"current",frontMatter:{},sidebar:"guides",previous:{title:"EKS \u30aa\u30d6\u30b6\u30fc\u30d0\u30d3\u30ea\u30c6\u30a3\uff1a\u91cd\u8981\u306a\u30e1\u30c8\u30ea\u30af\u30b9",permalink:"/observability-best-practices/ja/guides/containers/oss/eks/best-practices-metrics-collection"},next:{title:"AWS Lambda \u30d9\u30fc\u30b9\u306e\u30b5\u30fc\u30d0\u30fc\u30ec\u30b9\u30aa\u30d6\u30b6\u30fc\u30d0\u30d3\u30ea\u30c6\u30a3",permalink:"/observability-best-practices/ja/guides/serverless/aws-native/lambda-based-observability"}},c={},o=[{value:"KEDA \u306e\u8a2d\u5b9a",id:"keda-\u306e\u8a2d\u5b9a",level:2},{value:"\u30d6\u30ed\u30b0",id:"\u30d6\u30ed\u30b0",level:2}];function h(e){const s={a:"a",h1:"h1",h2:"h2",img:"img",p:"p",...(0,t.R)(),...e.components};return(0,n.jsxs)(n.Fragment,{children:[(0,n.jsx)(s.h1,{id:"amp-\u3068-eks-\u4e0a\u3067-keda-\u3092\u4f7f\u7528\u3057\u305f\u30a2\u30d7\u30ea\u30b1\u30fc\u30b7\u30e7\u30f3\u306e\u81ea\u52d5\u30b9\u30b1\u30fc\u30ea\u30f3\u30b0",children:"AMP \u3068 EKS \u4e0a\u3067 KEDA \u3092\u4f7f\u7528\u3057\u305f\u30a2\u30d7\u30ea\u30b1\u30fc\u30b7\u30e7\u30f3\u306e\u81ea\u52d5\u30b9\u30b1\u30fc\u30ea\u30f3\u30b0"}),"\n",(0,n.jsx)(s.h1,{id:"\u73fe\u72b6\u306e\u6982\u8981",children:"\u73fe\u72b6\u306e\u6982\u8981"}),"\n",(0,n.jsx)(s.p,{children:"Amazon EKS \u30a2\u30d7\u30ea\u30b1\u30fc\u30b7\u30e7\u30f3\u3067\u306e\u30c8\u30e9\u30d5\u30a3\u30c3\u30af\u5897\u52a0\u3078\u306e\u5bfe\u5fdc\u306f\u8ab2\u984c\u3068\u306a\u3063\u3066\u304a\u308a\u3001\u624b\u52d5\u3067\u306e\u30b9\u30b1\u30fc\u30ea\u30f3\u30b0\u306f\u975e\u52b9\u7387\u7684\u3067\u30a8\u30e9\u30fc\u304c\u767a\u751f\u3057\u3084\u3059\u3044\u72b6\u6cc1\u3067\u3059\u3002\u30aa\u30fc\u30c8\u30b9\u30b1\u30fc\u30ea\u30f3\u30b0\u306f\u30ea\u30bd\u30fc\u30b9\u5272\u308a\u5f53\u3066\u306b\u304a\u3044\u3066\u3088\u308a\u826f\u3044\u30bd\u30ea\u30e5\u30fc\u30b7\u30e7\u30f3\u3092\u63d0\u4f9b\u3057\u307e\u3059\u3002KEDA \u306f\u69d8\u3005\u306a\u30e1\u30c8\u30ea\u30af\u30b9\u3084\u30a4\u30d9\u30f3\u30c8\u306b\u57fa\u3065\u3044\u3066 Kubernetes \u306e\u30aa\u30fc\u30c8\u30b9\u30b1\u30fc\u30ea\u30f3\u30b0\u3092\u53ef\u80fd\u306b\u3057\u3001\u4e00\u65b9 Amazon Managed Service for Prometheus \u306f EKS \u30af\u30e9\u30b9\u30bf\u30fc\u306e\u30bb\u30ad\u30e5\u30a2\u306a\u30e1\u30c8\u30ea\u30af\u30b9\u76e3\u8996\u3092\u63d0\u4f9b\u3057\u307e\u3059\u3002\u3053\u306e\u30bd\u30ea\u30e5\u30fc\u30b7\u30e7\u30f3\u3067\u306f\u3001KEDA \u3068 Amazon Managed Service for Prometheus \u3092\u7d44\u307f\u5408\u308f\u305b\u30011 \u79d2\u3042\u305f\u308a\u306e\u30ea\u30af\u30a8\u30b9\u30c8\u6570 (RPS) \u30e1\u30c8\u30ea\u30af\u30b9\u306b\u57fa\u3065\u304f\u30aa\u30fc\u30c8\u30b9\u30b1\u30fc\u30ea\u30f3\u30b0\u3092\u5b9f\u6f14\u3057\u307e\u3059\u3002\u3053\u306e\u30a2\u30d7\u30ed\u30fc\u30c1\u306b\u3088\u308a\u3001\u30ef\u30fc\u30af\u30ed\u30fc\u30c9\u306e\u9700\u8981\u306b\u5408\u308f\u305b\u305f\u81ea\u52d5\u30b9\u30b1\u30fc\u30ea\u30f3\u30b0\u304c\u5b9f\u73fe\u3055\u308c\u3001\u30e6\u30fc\u30b6\u30fc\u306f\u81ea\u8eab\u306e EKS \u30ef\u30fc\u30af\u30ed\u30fc\u30c9\u306b\u9069\u7528\u3067\u304d\u307e\u3059\u3002Amazon Managed Grafana \u306f\u30b9\u30b1\u30fc\u30ea\u30f3\u30b0\u30d1\u30bf\u30fc\u30f3\u306e\u76e3\u8996\u3068\u53ef\u8996\u5316\u306b\u4f7f\u7528\u3055\u308c\u3001\u30e6\u30fc\u30b6\u30fc\u306f\u30aa\u30fc\u30c8\u30b9\u30b1\u30fc\u30ea\u30f3\u30b0\u306e\u52d5\u4f5c\u306b\u95a2\u3059\u308b\u6d1e\u5bdf\u3092\u5f97\u3066\u3001\u30d3\u30b8\u30cd\u30b9\u30a4\u30d9\u30f3\u30c8\u3068\u95a2\u9023\u4ed8\u3051\u308b\u3053\u3068\u304c\u3067\u304d\u307e\u3059\u3002"}),"\n",(0,n.jsx)(s.h1,{id:"keda-\u3092\u4f7f\u7528\u3057\u305f-amp-\u30e1\u30c8\u30ea\u30af\u30b9\u306b\u57fa\u3065\u304f\u30a2\u30d7\u30ea\u30b1\u30fc\u30b7\u30e7\u30f3\u306e\u30aa\u30fc\u30c8\u30b9\u30b1\u30fc\u30ea\u30f3\u30b0",children:"KEDA \u3092\u4f7f\u7528\u3057\u305f AMP \u30e1\u30c8\u30ea\u30af\u30b9\u306b\u57fa\u3065\u304f\u30a2\u30d7\u30ea\u30b1\u30fc\u30b7\u30e7\u30f3\u306e\u30aa\u30fc\u30c8\u30b9\u30b1\u30fc\u30ea\u30f3\u30b0"}),"\n",(0,n.jsx)(s.p,{children:(0,n.jsx)(s.img,{alt:"keda-arch",src:a(18575).A+"",width:"559",height:"340"})}),"\n",(0,n.jsx)(s.p,{children:"\u3053\u306e\u30bd\u30ea\u30e5\u30fc\u30b7\u30e7\u30f3\u306f\u3001\u81ea\u52d5\u30b9\u30b1\u30fc\u30ea\u30f3\u30b0\u30d1\u30a4\u30d7\u30e9\u30a4\u30f3\u3092\u4f5c\u6210\u3059\u308b\u305f\u3081\u306e AWS \u3068\u30aa\u30fc\u30d7\u30f3\u30bd\u30fc\u30b9\u30bd\u30d5\u30c8\u30a6\u30a7\u30a2\u306e\u7d71\u5408\u3092\u793a\u3057\u3066\u3044\u307e\u3059\u3002\n\u30de\u30cd\u30fc\u30b8\u30c9 Kubernetes \u7528\u306e Amazon EKS\u3001\u30e1\u30c8\u30ea\u30af\u30b9\u53ce\u96c6\u7528\u306e AWS Distro for Open Telemetry (ADOT)\u3001\u30a4\u30d9\u30f3\u30c8\u99c6\u52d5\u578b\u30aa\u30fc\u30c8\u30b9\u30b1\u30fc\u30ea\u30f3\u30b0\u7528\u306e KEDA\u3001\u30e1\u30c8\u30ea\u30af\u30b9\u30b9\u30c8\u30ec\u30fc\u30b8\u7528\u306e Amazon Managed Service for Prometheus\u3001\u53ef\u8996\u5316\u7528\u306e Amazon Managed Grafana \u3092\u7d44\u307f\u5408\u308f\u305b\u3066\u3044\u307e\u3059\u3002"}),"\n",(0,n.jsx)(s.p,{children:"\u30a2\u30fc\u30ad\u30c6\u30af\u30c1\u30e3\u306b\u306f\u3001EKS \u4e0a\u3078\u306e KEDA \u306e\u30c7\u30d7\u30ed\u30a4\u3001\u30e1\u30c8\u30ea\u30af\u30b9\u3092\u30b9\u30af\u30ec\u30a4\u30d4\u30f3\u30b0\u3059\u308b\u305f\u3081\u306e ADOT \u306e\u8a2d\u5b9a\u3001KEDA ScaledObject \u306b\u3088\u308b\u30aa\u30fc\u30c8\u30b9\u30b1\u30fc\u30ea\u30f3\u30b0\u30eb\u30fc\u30eb\u306e\u5b9a\u7fa9\u3001\u30b9\u30b1\u30fc\u30ea\u30f3\u30b0\u3092\u76e3\u8996\u3059\u308b\u305f\u3081\u306e Grafana \u30c0\u30c3\u30b7\u30e5\u30dc\u30fc\u30c9\u306e\u4f7f\u7528\u304c\u542b\u307e\u308c\u307e\u3059\u3002"}),"\n",(0,n.jsx)(s.p,{children:"\u30aa\u30fc\u30c8\u30b9\u30b1\u30fc\u30ea\u30f3\u30b0\u30d7\u30ed\u30bb\u30b9\u306f\u3001\u30de\u30a4\u30af\u30ed\u30b5\u30fc\u30d3\u30b9\u3078\u306e\u30e6\u30fc\u30b6\u30fc\u30ea\u30af\u30a8\u30b9\u30c8\u304b\u3089\u59cb\u307e\u308a\u3001ADOT \u304c\u30e1\u30c8\u30ea\u30af\u30b9\u3092\u53ce\u96c6\u3057\u3001Prometheus \u306b\u9001\u4fe1\u3057\u307e\u3059\u3002\nKEDA \u306f\u5b9a\u671f\u7684\u306b\u3053\u308c\u3089\u306e\u30e1\u30c8\u30ea\u30af\u30b9\u3092\u30af\u30a8\u30ea\u3057\u3001\u30b9\u30b1\u30fc\u30ea\u30f3\u30b0\u306e\u5fc5\u8981\u6027\u3092\u5224\u65ad\u3057\u3001Horizontal Pod Autoscaler (HPA) \u3068\u9023\u643a\u3057\u3066 Pod \u306e\u30ec\u30d7\u30ea\u30ab\u6570\u3092\u8abf\u6574\u3057\u307e\u3059\u3002"}),"\n",(0,n.jsx)(s.p,{children:"\u3053\u306e\u30bb\u30c3\u30c8\u30a2\u30c3\u30d7\u306b\u3088\u308a\u3001Kubernetes \u30de\u30a4\u30af\u30ed\u30b5\u30fc\u30d3\u30b9\u306e\u30e1\u30c8\u30ea\u30af\u30b9\u99c6\u52d5\u578b\u30aa\u30fc\u30c8\u30b9\u30b1\u30fc\u30ea\u30f3\u30b0\u304c\u53ef\u80fd\u306b\u306a\u308a\u3001\u3055\u307e\u3056\u307e\u306a\u4f7f\u7528\u7387\u6307\u6a19\u306b\u57fa\u3065\u3044\u3066\u30b9\u30b1\u30fc\u30ea\u30f3\u30b0\u3067\u304d\u308b\u67d4\u8edf\u306a\u30af\u30e9\u30a6\u30c9\u30cd\u30a4\u30c6\u30a3\u30d6\u30a2\u30fc\u30ad\u30c6\u30af\u30c1\u30e3\u3092\u63d0\u4f9b\u3057\u307e\u3059\u3002"}),"\n",(0,n.jsx)(s.h1,{id:"amp-\u30e1\u30c8\u30ea\u30af\u30b9\u3092\u4f7f\u7528\u3057\u305f-keda-\u306b\u3088\u308b-eks-\u30a2\u30d7\u30ea\u30b1\u30fc\u30b7\u30e7\u30f3\u306e\u30af\u30ed\u30b9\u30a2\u30ab\u30a6\u30f3\u30c8\u30b9\u30b1\u30fc\u30ea\u30f3\u30b0",children:"AMP \u30e1\u30c8\u30ea\u30af\u30b9\u3092\u4f7f\u7528\u3057\u305f KEDA \u306b\u3088\u308b EKS \u30a2\u30d7\u30ea\u30b1\u30fc\u30b7\u30e7\u30f3\u306e\u30af\u30ed\u30b9\u30a2\u30ab\u30a6\u30f3\u30c8\u30b9\u30b1\u30fc\u30ea\u30f3\u30b0"}),"\n",(0,n.jsx)(s.p,{children:"\u3053\u306e\u4f8b\u3067\u306f\u3001KEDA EKS \u304c ID 117 \u3067\u7d42\u308f\u308b AWS \u30a2\u30ab\u30a6\u30f3\u30c8\u3067\u5b9f\u884c\u3055\u308c\u3066\u304a\u308a\u3001\u4e2d\u592e\u306e AMP \u30a2\u30ab\u30a6\u30f3\u30c8 ID \u304c 814 \u3067\u7d42\u308f\u308b\u3068\u4eee\u5b9a\u3057\u307e\u3059\u3002KEDA EKS \u30a2\u30ab\u30a6\u30f3\u30c8\u3067\u3001\u4ee5\u4e0b\u306e\u3088\u3046\u306b\u30af\u30ed\u30b9\u30a2\u30ab\u30a6\u30f3\u30c8 IAM \u30ed\u30fc\u30eb\u3092\u8a2d\u5b9a\u3057\u307e\u3059\uff1a"}),"\n",(0,n.jsx)(s.p,{children:(0,n.jsx)(s.img,{alt:"keda1",src:a(20077).A+"",width:"1654",height:"1048"})}),"\n",(0,n.jsxs)(s.p,{children:["\u307e\u305f\u3001\u4fe1\u983c\u95a2\u4fc2\u3092\u4ee5\u4e0b\u306e\u3088\u3046\u306b\u66f4\u65b0\u3057\u307e\u3059\uff1a\n",(0,n.jsx)(s.img,{alt:"keda2",src:a(4662).A+"",width:"1674",height:"990"})]}),"\n",(0,n.jsxs)(s.p,{children:["EKS \u30af\u30e9\u30b9\u30bf\u30fc\u3067\u306f\u3001IRSA \u304c\u4f7f\u7528\u3055\u308c\u3066\u3044\u308b\u305f\u3081\u3001Pod \u30a2\u30a4\u30c7\u30f3\u30c6\u30a3\u30c6\u30a3\u3092\u4f7f\u7528\u3057\u3066\u3044\u306a\u3044\u3053\u3068\u304c\u308f\u304b\u308a\u307e\u3059\u3002\n",(0,n.jsx)(s.img,{alt:"keda3",src:a(42111).A+"",width:"1674",height:"1152"})]}),"\n",(0,n.jsxs)(s.p,{children:["\u4e2d\u592e\u306e AMP \u30a2\u30ab\u30a6\u30f3\u30c8\u3067\u306f\u3001AMP \u30a2\u30af\u30bb\u30b9\u3092\u4ee5\u4e0b\u306e\u3088\u3046\u306b\u8a2d\u5b9a\u3057\u3066\u3044\u307e\u3059\u3002\n",(0,n.jsx)(s.img,{alt:"keda4",src:a(30432).A+"",width:"1662",height:"780"})]}),"\n",(0,n.jsxs)(s.p,{children:["\u4fe1\u983c\u95a2\u4fc2\u306b\u3082\u30a2\u30af\u30bb\u30b9\u304c\u8a2d\u5b9a\u3055\u308c\u3066\u3044\u307e\u3059\u3002\n",(0,n.jsx)(s.img,{alt:"keda5",src:a(54633).A+"",width:"1680",height:"924"})]}),"\n",(0,n.jsxs)(s.p,{children:["\u4ee5\u4e0b\u306e\u3088\u3046\u306b\u30ef\u30fc\u30af\u30b9\u30da\u30fc\u30b9 ID \u3092\u30e1\u30e2\u3057\u3066\u304a\u304d\u307e\u3059\u3002\n",(0,n.jsx)(s.img,{alt:"keda6",src:a(90098).A+"",width:"1674",height:"682"})]}),"\n",(0,n.jsx)(s.h2,{id:"keda-\u306e\u8a2d\u5b9a",children:"KEDA \u306e\u8a2d\u5b9a"}),"\n",(0,n.jsx)(s.p,{children:"\u30bb\u30c3\u30c8\u30a2\u30c3\u30d7\u304c\u5b8c\u4e86\u3057\u305f\u3089\u3001\u4ee5\u4e0b\u306e\u3088\u3046\u306b KEDA \u304c\u5b9f\u884c\u3055\u308c\u3066\u3044\u308b\u3053\u3068\u3092\u78ba\u8a8d\u3057\u307e\u3059\u3002\u30bb\u30c3\u30c8\u30a2\u30c3\u30d7\u624b\u9806\u306b\u3064\u3044\u3066\u306f\u3001\u4ee5\u4e0b\u306b\u5171\u6709\u3055\u308c\u3066\u3044\u308b\u30d6\u30ed\u30b0\u30ea\u30f3\u30af\u3092\u53c2\u7167\u3057\u3066\u304f\u3060\u3055\u3044\u3002"}),"\n",(0,n.jsx)(s.p,{children:(0,n.jsx)(s.img,{alt:"keda7",src:a(11643).A+"",width:"1674",height:"554"})}),"\n",(0,n.jsxs)(s.p,{children:["\u8a2d\u5b9a\u3067\u4e0a\u8a18\u3067\u5b9a\u7fa9\u3057\u305f\u4e2d\u592e AMP \u30ed\u30fc\u30eb\u3092\u4f7f\u7528\u3057\u3066\u3044\u308b\u3053\u3068\u3092\u78ba\u8a8d\u3057\u3066\u304f\u3060\u3055\u3044\u3002\n",(0,n.jsx)(s.img,{alt:"keda8",src:a(7628).A+"",width:"1668",height:"326"})]}),"\n",(0,n.jsxs)(s.p,{children:["KEDA \u30b9\u30b1\u30fc\u30e9\u30fc\u306e\u8a2d\u5b9a\u3067\u3001\u4ee5\u4e0b\u306e\u3088\u3046\u306b\u4e2d\u592e AMP \u30a2\u30ab\u30a6\u30f3\u30c8\u3092\u6307\u5b9a\u3057\u307e\u3059\u3002\n",(0,n.jsx)(s.img,{alt:"keda9",src:a(19253).A+"",width:"1552",height:"862"})]}),"\n",(0,n.jsxs)(s.p,{children:["\u3053\u308c\u3067\u3001Pod \u304c\u9069\u5207\u306b\u30b9\u30b1\u30fc\u30eb\u3055\u308c\u3066\u3044\u308b\u3053\u3068\u304c\u78ba\u8a8d\u3067\u304d\u307e\u3059\u3002\n",(0,n.jsx)(s.img,{alt:"keda10",src:a(2777).A+"",width:"1360",height:"864"})]}),"\n",(0,n.jsx)(s.h2,{id:"\u30d6\u30ed\u30b0",children:"\u30d6\u30ed\u30b0"}),"\n",(0,n.jsx)(s.p,{children:(0,n.jsx)(s.a,{href:"https://aws.amazon.com/blogs/mt/autoscaling-kubernetes-workloads-with-keda-using-amazon-managed-service-for-prometheus-metrics/",children:"https://aws.amazon.com/blogs/mt/autoscaling-kubernetes-workloads-with-keda-using-amazon-managed-service-for-prometheus-metrics/"})})]})}function l(e={}){const{wrapper:s}={...(0,t.R)(),...e.components};return s?(0,n.jsx)(s,{...e,children:(0,n.jsx)(h,{...e})}):h(e)}},18575:(e,s,a)=>{a.d(s,{A:()=>n});const n=a.p+"assets/images/arch-ba3f06a9d099b8a55247d888269f65ae.png"},20077:(e,s,a)=>{a.d(s,{A:()=>n});const n=a.p+"assets/images/keda1-d8a375bf73aad401e33ce229cc307e78.png"},2777:(e,s,a)=>{a.d(s,{A:()=>n});const n=a.p+"assets/images/keda10-82e65c546a6bbed8f1852c26f7f06b78.png"},4662:(e,s,a)=>{a.d(s,{A:()=>n});const n=a.p+"assets/images/keda2-16022f1d3dd486f14a565662c8ebee83.png"},42111:(e,s,a)=>{a.d(s,{A:()=>n});const n=a.p+"assets/images/keda3-ef4da21377989f4c7820c015b7a126f1.png"},30432:(e,s,a)=>{a.d(s,{A:()=>n});const n=a.p+"assets/images/keda4-fdf35c9439598ec86650c83b44df6cf3.png"},54633:(e,s,a)=>{a.d(s,{A:()=>n});const n=a.p+"assets/images/keda5-fdf9c73abc77c8ec9402e01ebb07e707.png"},90098:(e,s,a)=>{a.d(s,{A:()=>n});const n=a.p+"assets/images/keda6-1bed5794e7c96191e530dbc5dda8bfa6.png"},11643:(e,s,a)=>{a.d(s,{A:()=>n});const n=a.p+"assets/images/keda7-e069b701309fe2112637b73428faae19.png"},7628:(e,s,a)=>{a.d(s,{A:()=>n});const n=a.p+"assets/images/keda8-80b49c92e8874797ba0908a64b7c34b4.png"},19253:(e,s,a)=>{a.d(s,{A:()=>n});const n=a.p+"assets/images/keda9-d92387e98158e8b37afa666a20468172.png"},28453:(e,s,a)=>{a.d(s,{R:()=>d,x:()=>r});var n=a(96540);const t={},i=n.createContext(t);function d(e){const s=n.useContext(i);return n.useMemo((function(){return"function"==typeof e?e(s):{...s,...e}}),[s,e])}function r(e){let s;return s=e.disableParentContext?"function"==typeof e.components?e.components(t):e.components||t:d(e.components),n.createElement(i.Provider,{value:s},e.children)}}}]);
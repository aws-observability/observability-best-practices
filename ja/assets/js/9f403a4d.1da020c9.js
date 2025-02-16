"use strict";(self.webpackChunkobservability_best_practices=self.webpackChunkobservability_best_practices||[]).push([[6482],{28453:(e,a,s)=>{s.d(a,{R:()=>r,x:()=>c});var n=s(96540);const i={},t=n.createContext(i);function r(e){const a=n.useContext(t);return n.useMemo((function(){return"function"==typeof e?e(a):{...a,...e}}),[a,e])}function c(e){let a;return a=e.disableParentContext?"function"==typeof e.components?e.components(i):e.components||i:r(e.components),n.createElement(t.Provider,{value:a},e.children)}},49277:(e,a,s)=>{s.r(a),s.d(a,{assets:()=>l,contentTitle:()=>r,default:()=>h,frontMatter:()=>t,metadata:()=>c,toc:()=>o});var n=s(74848),i=s(28453);const t={},r="\u30a4\u30f3\u30d5\u30e9\u30b9\u30c8\u30e9\u30af\u30c1\u30e3\u3068\u30c7\u30fc\u30bf\u30d9\u30fc\u30b9",c={id:"recipes/infra",title:"\u30a4\u30f3\u30d5\u30e9\u30b9\u30c8\u30e9\u30af\u30c1\u30e3\u3068\u30c7\u30fc\u30bf\u30d9\u30fc\u30b9",description:"\u30cd\u30c3\u30c8\u30ef\u30fc\u30ad\u30f3\u30b0",source:"@site/i18n/ja/docusaurus-plugin-content-docs/current/recipes/infra.md",sourceDirName:"recipes",slug:"/recipes/infra",permalink:"/observability-best-practices/ja/recipes/infra",draft:!1,unlisted:!1,editUrl:"https://github.com/aws-observability/observability-best-practices/blob/main/docusaurus/docs/recipes/infra.md",tags:[],version:"current",frontMatter:{},sidebar:"recipes",previous:{title:"AWS Lambda",permalink:"/observability-best-practices/ja/recipes/lambda"},next:{title:"Amazon Relational Database Service",permalink:"/observability-best-practices/ja/recipes/rds"}},l={},o=[{value:"\u30cd\u30c3\u30c8\u30ef\u30fc\u30ad\u30f3\u30b0",id:"\u30cd\u30c3\u30c8\u30ef\u30fc\u30ad\u30f3\u30b0",level:2},{value:"\u30b3\u30f3\u30d4\u30e5\u30fc\u30c6\u30a3\u30f3\u30b0",id:"\u30b3\u30f3\u30d4\u30e5\u30fc\u30c6\u30a3\u30f3\u30b0",level:2},{value:"\u30c7\u30fc\u30bf\u30d9\u30fc\u30b9\u3001\u30b9\u30c8\u30ec\u30fc\u30b8\u3001\u30ad\u30e5\u30fc",id:"\u30c7\u30fc\u30bf\u30d9\u30fc\u30b9\u30b9\u30c8\u30ec\u30fc\u30b8\u30ad\u30e5\u30fc",level:2},{value:"\u305d\u306e\u4ed6",id:"\u305d\u306e\u4ed6",level:2}];function d(e){const a={a:"a",h1:"h1",h2:"h2",li:"li",ul:"ul",...(0,i.R)(),...e.components};return(0,n.jsxs)(n.Fragment,{children:[(0,n.jsx)(a.h1,{id:"\u30a4\u30f3\u30d5\u30e9\u30b9\u30c8\u30e9\u30af\u30c1\u30e3\u3068\u30c7\u30fc\u30bf\u30d9\u30fc\u30b9",children:"\u30a4\u30f3\u30d5\u30e9\u30b9\u30c8\u30e9\u30af\u30c1\u30e3\u3068\u30c7\u30fc\u30bf\u30d9\u30fc\u30b9"}),"\n",(0,n.jsx)(a.h2,{id:"\u30cd\u30c3\u30c8\u30ef\u30fc\u30ad\u30f3\u30b0",children:"\u30cd\u30c3\u30c8\u30ef\u30fc\u30ad\u30f3\u30b0"}),"\n",(0,n.jsxs)(a.ul,{children:["\n",(0,n.jsx)(a.li,{children:(0,n.jsx)(a.a,{href:"https://docs.aws.amazon.com/ja_jp/elasticloadbalancing/latest/application/load-balancer-monitoring.html",children:"Application Load Balancer \u306e\u30e2\u30cb\u30bf\u30ea\u30f3\u30b0"})}),"\n",(0,n.jsx)(a.li,{children:(0,n.jsx)(a.a,{href:"https://docs.aws.amazon.com/ja_jp/elasticloadbalancing/latest/network/load-balancer-monitoring.html",children:"Network Load Balancer \u306e\u30e2\u30cb\u30bf\u30ea\u30f3\u30b0"})}),"\n",(0,n.jsx)(a.li,{children:(0,n.jsx)(a.a,{href:"https://docs.aws.amazon.com/ja_jp/vpc/latest/userguide/flow-logs.html",children:"VPC \u30d5\u30ed\u30fc\u30ed\u30b0"})}),"\n",(0,n.jsx)(a.li,{children:"[Amazon Elasticsearch Service \u3092\u4f7f\u7528\u3057\u305f VPC \u30d5\u30ed\u30fc\u30ed\u30b0\u306e\u5206\u6790][vpcf-ws]"}),"\n"]}),"\n",(0,n.jsx)(a.h2,{id:"\u30b3\u30f3\u30d4\u30e5\u30fc\u30c6\u30a3\u30f3\u30b0",children:"\u30b3\u30f3\u30d4\u30e5\u30fc\u30c6\u30a3\u30f3\u30b0"}),"\n",(0,n.jsxs)(a.ul,{children:["\n",(0,n.jsx)(a.li,{children:(0,n.jsx)(a.a,{href:"https://docs.aws.amazon.com/ja_jp/eks/latest/userguide/control-plane-logs.html",children:"Amazon EKS \u30b3\u30f3\u30c8\u30ed\u30fc\u30eb\u30d7\u30ec\u30fc\u30f3\u306e\u30ed\u30ae\u30f3\u30b0"})}),"\n",(0,n.jsx)(a.li,{children:(0,n.jsx)(a.a,{href:"https://docs.aws.amazon.com/ja_jp/lambda/latest/operatorguide/monitoring-observability.html",children:"AWS Lambda \u306e\u30e2\u30cb\u30bf\u30ea\u30f3\u30b0\u3068\u30aa\u30d6\u30b6\u30fc\u30d0\u30d3\u30ea\u30c6\u30a3"})}),"\n"]}),"\n",(0,n.jsx)(a.h2,{id:"\u30c7\u30fc\u30bf\u30d9\u30fc\u30b9\u30b9\u30c8\u30ec\u30fc\u30b8\u30ad\u30e5\u30fc",children:"\u30c7\u30fc\u30bf\u30d9\u30fc\u30b9\u3001\u30b9\u30c8\u30ec\u30fc\u30b8\u3001\u30ad\u30e5\u30fc"}),"\n",(0,n.jsxs)(a.ul,{children:["\n",(0,n.jsx)(a.li,{children:(0,n.jsx)(a.a,{href:"/observability-best-practices/ja/recipes/rds",children:"Amazon Relational Database Service"})}),"\n",(0,n.jsx)(a.li,{children:(0,n.jsx)(a.a,{href:"/observability-best-practices/ja/recipes/dynamodb",children:"Amazon DynamoDB"})}),"\n",(0,n.jsx)(a.li,{children:(0,n.jsx)(a.a,{href:"/observability-best-practices/ja/recipes/msk",children:"Amazon Managed Streaming for Apache Kafka"})}),"\n",(0,n.jsx)(a.li,{children:(0,n.jsx)(a.a,{href:"https://docs.aws.amazon.com/ja_jp/AmazonS3/latest/userguide/s3-incident-response.html",children:"Amazon S3 \u3067\u306e\u30ed\u30b0\u8a18\u9332\u3068\u30e2\u30cb\u30bf\u30ea\u30f3\u30b0"})}),"\n",(0,n.jsx)(a.li,{children:(0,n.jsx)(a.a,{href:"https://docs.aws.amazon.com/ja_jp/xray/latest/devguide/xray-services-sqs.html",children:"Amazon SQS \u3068 AWS X-Ray"})}),"\n"]}),"\n",(0,n.jsx)(a.h2,{id:"\u305d\u306e\u4ed6",children:"\u305d\u306e\u4ed6"}),"\n",(0,n.jsxs)(a.ul,{children:["\n",(0,n.jsx)(a.li,{children:(0,n.jsx)(a.a,{href:"https://prometheus.io/docs/instrumenting/exporters/",children:"Prometheus \u30a8\u30af\u30b9\u30dd\u30fc\u30bf\u30fc"})}),"\n"]})]})}function h(e={}){const{wrapper:a}={...(0,i.R)(),...e.components};return a?(0,n.jsx)(a,{...e,children:(0,n.jsx)(d,{...e})}):d(e)}}}]);
"use strict";(self.webpackChunkobservability_best_practices=self.webpackChunkobservability_best_practices||[]).push([[4237],{5535:(e,s,n)=>{n.d(s,{A:()=>r});const r=n.p+"assets/images/cloudwatch-metric-stream-configuration-f32f65524b45355c3638464f222d9ec0.png"},28453:(e,s,n)=>{n.d(s,{R:()=>i,x:()=>t});var r=n(96540);const c={},a=r.createContext(c);function i(e){const s=r.useContext(a);return r.useMemo((function(){return"function"==typeof e?e(s):{...s,...e}}),[s,e])}function t(e){let s;return s=e.disableParentContext?"function"==typeof e.components?e.components(c):e.components||c:i(e.components),r.createElement(a.Provider,{value:s},e.children)}},36893:(e,s,n)=>{n.r(s),n.d(s,{assets:()=>d,contentTitle:()=>t,default:()=>h,frontMatter:()=>i,metadata:()=>r,toc:()=>o});const r=JSON.parse('{"id":"recipes/recipes/lambda-cw-metrics-go-amp","title":"CloudWatch \u30e1\u30c8\u30ea\u30af\u30b9\u30b9\u30c8\u30ea\u30fc\u30e0\u3092 Firehose \u3068 AWS Lambda \u3092\u4f7f\u7528\u3057\u3066 Amazon Managed Service for Prometheus \u306b\u30a8\u30af\u30b9\u30dd\u30fc\u30c8\u3059\u308b","description":"\u3053\u306e\u30ec\u30b7\u30d4\u3067\u306f\u3001CloudWatch \u30e1\u30c8\u30ea\u30af\u30b9\u30b9\u30c8\u30ea\u30fc\u30e0 \u3092\u8a2d\u5b9a\u3057\u3001Kinesis Data Firehose \u3068 AWS Lambda \u3092\u4f7f\u7528\u3057\u3066 Amazon Managed Service for Prometheus (AMP) \u306b\u30e1\u30c8\u30ea\u30af\u30b9\u3092\u53d6\u308a\u8fbc\u3080\u65b9\u6cd5\u3092\u8aac\u660e\u3057\u307e\u3059\u3002","source":"@site/i18n/ja/docusaurus-plugin-content-docs/current/recipes/recipes/lambda-cw-metrics-go-amp.md","sourceDirName":"recipes/recipes","slug":"/recipes/recipes/lambda-cw-metrics-go-amp","permalink":"/observability-best-practices/ja/recipes/recipes/lambda-cw-metrics-go-amp","draft":false,"unlisted":false,"editUrl":"https://github.com/aws-observability/observability-best-practices/blob/main/docusaurus/docs/recipes/recipes/lambda-cw-metrics-go-amp.md","tags":[],"version":"current","frontMatter":{}}');var c=n(74848),a=n(28453);const i={},t="CloudWatch \u30e1\u30c8\u30ea\u30af\u30b9\u30b9\u30c8\u30ea\u30fc\u30e0\u3092 Firehose \u3068 AWS Lambda \u3092\u4f7f\u7528\u3057\u3066 Amazon Managed Service for Prometheus \u306b\u30a8\u30af\u30b9\u30dd\u30fc\u30c8\u3059\u308b",d={},o=[{value:"\u30a4\u30f3\u30d5\u30e9\u30b9\u30c8\u30e9\u30af\u30c1\u30e3",id:"\u30a4\u30f3\u30d5\u30e9\u30b9\u30c8\u30e9\u30af\u30c1\u30e3",level:2},{value:"\u524d\u63d0\u6761\u4ef6",id:"\u524d\u63d0\u6761\u4ef6",level:3},{value:"AMP \u30ef\u30fc\u30af\u30b9\u30da\u30fc\u30b9\u306e\u4f5c\u6210",id:"amp-\u30ef\u30fc\u30af\u30b9\u30da\u30fc\u30b9\u306e\u4f5c\u6210",level:3},{value:"\u4f9d\u5b58\u95a2\u4fc2\u306e\u30a4\u30f3\u30b9\u30c8\u30fc\u30eb",id:"\u4f9d\u5b58\u95a2\u4fc2\u306e\u30a4\u30f3\u30b9\u30c8\u30fc\u30eb",level:3},{value:"\u8a2d\u5b9a\u30d5\u30a1\u30a4\u30eb\u306e\u5909\u66f4",id:"\u8a2d\u5b9a\u30d5\u30a1\u30a4\u30eb\u306e\u5909\u66f4",level:3},{value:"\u30b9\u30bf\u30c3\u30af\u306e\u30c7\u30d7\u30ed\u30a4",id:"\u30b9\u30bf\u30c3\u30af\u306e\u30c7\u30d7\u30ed\u30a4",level:3},{value:"CloudWatch \u30b9\u30c8\u30ea\u30fc\u30e0\u306e\u4f5c\u6210",id:"cloudwatch-\u30b9\u30c8\u30ea\u30fc\u30e0\u306e\u4f5c\u6210",level:2},{value:"\u30af\u30ea\u30fc\u30f3\u30a2\u30c3\u30d7",id:"\u30af\u30ea\u30fc\u30f3\u30a2\u30c3\u30d7",level:2}];function l(e){const s={a:"a",admonition:"admonition",code:"code",h1:"h1",h2:"h2",h3:"h3",header:"header",img:"img",li:"li",p:"p",pre:"pre",ul:"ul",...(0,a.R)(),...e.components};return(0,c.jsxs)(c.Fragment,{children:[(0,c.jsx)(s.header,{children:(0,c.jsx)(s.h1,{id:"cloudwatch-\u30e1\u30c8\u30ea\u30af\u30b9\u30b9\u30c8\u30ea\u30fc\u30e0\u3092-firehose-\u3068-aws-lambda-\u3092\u4f7f\u7528\u3057\u3066-amazon-managed-service-for-prometheus-\u306b\u30a8\u30af\u30b9\u30dd\u30fc\u30c8\u3059\u308b",children:"CloudWatch \u30e1\u30c8\u30ea\u30af\u30b9\u30b9\u30c8\u30ea\u30fc\u30e0\u3092 Firehose \u3068 AWS Lambda \u3092\u4f7f\u7528\u3057\u3066 Amazon Managed Service for Prometheus \u306b\u30a8\u30af\u30b9\u30dd\u30fc\u30c8\u3059\u308b"})}),"\n",(0,c.jsxs)(s.p,{children:["\u3053\u306e\u30ec\u30b7\u30d4\u3067\u306f\u3001",(0,c.jsx)(s.a,{href:"https://console.aws.amazon.com/cloudwatch/home#metric-streams:streamsList",children:"CloudWatch \u30e1\u30c8\u30ea\u30af\u30b9\u30b9\u30c8\u30ea\u30fc\u30e0"})," \u3092\u8a2d\u5b9a\u3057\u3001",(0,c.jsx)(s.a,{href:"https://aws.amazon.com/jp/kinesis/data-firehose/",children:"Kinesis Data Firehose"})," \u3068 ",(0,c.jsx)(s.a,{href:"https://aws.amazon.com/jp/lambda",children:"AWS Lambda"})," \u3092\u4f7f\u7528\u3057\u3066 ",(0,c.jsx)(s.a,{href:"https://aws.amazon.com/jp/prometheus/",children:"Amazon Managed Service for Prometheus (AMP)"})," \u306b\u30e1\u30c8\u30ea\u30af\u30b9\u3092\u53d6\u308a\u8fbc\u3080\u65b9\u6cd5\u3092\u8aac\u660e\u3057\u307e\u3059\u3002"]}),"\n",(0,c.jsxs)(s.p,{children:["\u5b8c\u5168\u306a\u30b7\u30ca\u30ea\u30aa\u3092\u5b9f\u6f14\u3059\u308b\u305f\u3081\u306b\u3001",(0,c.jsx)(s.a,{href:"https://aws.amazon.com/jp/cdk/",children:"AWS Cloud Development Kit (CDK)"})," \u3092\u4f7f\u7528\u3057\u3066\u3001Firehose \u914d\u4fe1\u30b9\u30c8\u30ea\u30fc\u30e0\u3001Lambda\u3001S3 \u30d0\u30b1\u30c3\u30c8\u3092\u4f5c\u6210\u3059\u308b\u30b9\u30bf\u30c3\u30af\u3092\u30bb\u30c3\u30c8\u30a2\u30c3\u30d7\u3057\u307e\u3059\u3002"]}),"\n",(0,c.jsx)(s.admonition,{type:"note",children:(0,c.jsx)(s.p,{children:"\u3053\u306e\u30ac\u30a4\u30c9\u306f\u5b8c\u4e86\u307e\u3067\u306b\u7d04 30 \u5206\u304b\u304b\u308a\u307e\u3059\u3002"})}),"\n",(0,c.jsx)(s.h2,{id:"\u30a4\u30f3\u30d5\u30e9\u30b9\u30c8\u30e9\u30af\u30c1\u30e3",children:"\u30a4\u30f3\u30d5\u30e9\u30b9\u30c8\u30e9\u30af\u30c1\u30e3"}),"\n",(0,c.jsx)(s.p,{children:"\u4ee5\u4e0b\u306e\u30bb\u30af\u30b7\u30e7\u30f3\u3067\u306f\u3001\u3053\u306e\u30ec\u30b7\u30d4\u306e\u30a4\u30f3\u30d5\u30e9\u30b9\u30c8\u30e9\u30af\u30c1\u30e3\u3092\u30bb\u30c3\u30c8\u30a2\u30c3\u30d7\u3057\u307e\u3059\u3002"}),"\n",(0,c.jsxs)(s.p,{children:["CloudWatch Metric Streams \u3092\u4f7f\u7528\u3059\u308b\u3068\u3001\u30b9\u30c8\u30ea\u30fc\u30df\u30f3\u30b0\u30e1\u30c8\u30ea\u30af\u30b9\u30c7\u30fc\u30bf\u3092 HTTP \u30a8\u30f3\u30c9\u30dd\u30a4\u30f3\u30c8\u307e\u305f\u306f ",(0,c.jsx)(s.a,{href:"https://aws.amazon.com/jp/s3",children:"S3 \u30d0\u30b1\u30c3\u30c8"})," \u306b\u8ee2\u9001\u3067\u304d\u307e\u3059\u3002"]}),"\n",(0,c.jsx)(s.h3,{id:"\u524d\u63d0\u6761\u4ef6",children:"\u524d\u63d0\u6761\u4ef6"}),"\n",(0,c.jsxs)(s.ul,{children:["\n",(0,c.jsxs)(s.li,{children:["AWS CLI \u304c\u74b0\u5883\u306b",(0,c.jsx)(s.a,{href:"https://docs.aws.amazon.com/ja_jp/cli/latest/userguide/cli-chap-install.html",children:"\u30a4\u30f3\u30b9\u30c8\u30fc\u30eb"}),"\u3055\u308c\u3001",(0,c.jsx)(s.a,{href:"https://docs.aws.amazon.com/ja_jp/cli/latest/userguide/cli-chap-configure.html",children:"\u8a2d\u5b9a"}),"\u3055\u308c\u3066\u3044\u308b\u3053\u3068\u3002"]}),"\n",(0,c.jsxs)(s.li,{children:[(0,c.jsx)(s.a,{href:"https://docs.aws.amazon.com/ja_jp/cdk/latest/guide/work-with-cdk-typescript.html",children:"AWS CDK Typescript"})," \u304c\u74b0\u5883\u306b\u30a4\u30f3\u30b9\u30c8\u30fc\u30eb\u3055\u308c\u3066\u3044\u308b\u3053\u3068\u3002"]}),"\n",(0,c.jsx)(s.li,{children:"Node.js \u3068 Go \u304c\u30a4\u30f3\u30b9\u30c8\u30fc\u30eb\u3055\u308c\u3066\u3044\u308b\u3053\u3068\u3002"}),"\n",(0,c.jsxs)(s.li,{children:[(0,c.jsx)(s.a,{href:"https://github.com/aws-observability/observability-best-practices/",children:"\u30ea\u30dd\u30b8\u30c8\u30ea"}),"\u304c\u30ed\u30fc\u30ab\u30eb\u30de\u30b7\u30f3\u306b\u30af\u30ed\u30fc\u30f3\u3055\u308c\u3066\u3044\u308b\u3053\u3068\u3002\u3053\u306e\u30d7\u30ed\u30b8\u30a7\u30af\u30c8\u306e\u30b3\u30fc\u30c9\u306f ",(0,c.jsx)(s.code,{children:"/sandbox/CWMetricStreamExporter"})," \u306b\u3042\u308a\u307e\u3059\u3002"]}),"\n"]}),"\n",(0,c.jsx)(s.h3,{id:"amp-\u30ef\u30fc\u30af\u30b9\u30da\u30fc\u30b9\u306e\u4f5c\u6210",children:"AMP \u30ef\u30fc\u30af\u30b9\u30da\u30fc\u30b9\u306e\u4f5c\u6210"}),"\n",(0,c.jsx)(s.p,{children:"\u3053\u306e\u30ec\u30b7\u30d4\u306e\u30c7\u30e2\u30a2\u30d7\u30ea\u30b1\u30fc\u30b7\u30e7\u30f3\u306f AMP \u4e0a\u3067\u5b9f\u884c\u3055\u308c\u307e\u3059\u3002\n\u4ee5\u4e0b\u306e\u30b3\u30de\u30f3\u30c9\u3067 AMP \u30ef\u30fc\u30af\u30b9\u30da\u30fc\u30b9\u3092\u4f5c\u6210\u3057\u307e\u3059\uff1a"}),"\n",(0,c.jsx)(s.pre,{children:(0,c.jsx)(s.code,{children:"aws amp create-workspace --alias prometheus-demo-recipe\n"})}),"\n",(0,c.jsx)(s.p,{children:"\u4ee5\u4e0b\u306e\u30b3\u30de\u30f3\u30c9\u3067\u30ef\u30fc\u30af\u30b9\u30da\u30fc\u30b9\u304c\u4f5c\u6210\u3055\u308c\u305f\u3053\u3068\u3092\u78ba\u8a8d\u3057\u307e\u3059\uff1a"}),"\n",(0,c.jsx)(s.pre,{children:(0,c.jsx)(s.code,{children:"aws amp list-workspaces\n"})}),"\n",(0,c.jsx)(s.admonition,{type:"info",children:(0,c.jsxs)(s.p,{children:["\u8a73\u7d30\u306b\u3064\u3044\u3066\u306f\u3001",(0,c.jsx)(s.a,{href:"https://docs.aws.amazon.com/ja_jp/prometheus/latest/userguide/AMP-getting-started.html",children:"AMP \u5165\u9580"})," \u30ac\u30a4\u30c9\u3092\u3054\u78ba\u8a8d\u304f\u3060\u3055\u3044\u3002"]})}),"\n",(0,c.jsx)(s.h3,{id:"\u4f9d\u5b58\u95a2\u4fc2\u306e\u30a4\u30f3\u30b9\u30c8\u30fc\u30eb",children:"\u4f9d\u5b58\u95a2\u4fc2\u306e\u30a4\u30f3\u30b9\u30c8\u30fc\u30eb"}),"\n",(0,c.jsx)(s.p,{children:"aws-o11y-recipes \u30ea\u30dd\u30b8\u30c8\u30ea\u306e\u30eb\u30fc\u30c8\u304b\u3089\u3001\u4ee5\u4e0b\u306e\u30b3\u30de\u30f3\u30c9\u3092\u4f7f\u7528\u3057\u3066 CWMetricStreamExporter \u30c7\u30a3\u30ec\u30af\u30c8\u30ea\u306b\u79fb\u52d5\u3057\u307e\u3059\uff1a"}),"\n",(0,c.jsx)(s.pre,{children:(0,c.jsx)(s.code,{children:"cd sandbox/CWMetricStreamExporter\n"})}),"\n",(0,c.jsx)(s.p,{children:"\u4ee5\u964d\u3001\u3053\u308c\u3092\u30ea\u30dd\u30b8\u30c8\u30ea\u306e\u30eb\u30fc\u30c8\u3068\u3057\u3066\u6271\u3044\u307e\u3059\u3002"}),"\n",(0,c.jsxs)(s.p,{children:["\u4ee5\u4e0b\u306e\u30b3\u30de\u30f3\u30c9\u3092\u4f7f\u7528\u3057\u3066 ",(0,c.jsx)(s.code,{children:"/cdk"})," \u30c7\u30a3\u30ec\u30af\u30c8\u30ea\u306b\u79fb\u52d5\u3057\u307e\u3059\uff1a"]}),"\n",(0,c.jsx)(s.pre,{children:(0,c.jsx)(s.code,{children:"cd cdk\n"})}),"\n",(0,c.jsx)(s.p,{children:"\u4ee5\u4e0b\u306e\u30b3\u30de\u30f3\u30c9\u3092\u4f7f\u7528\u3057\u3066 CDK \u306e\u4f9d\u5b58\u95a2\u4fc2\u3092\u30a4\u30f3\u30b9\u30c8\u30fc\u30eb\u3057\u307e\u3059\uff1a"}),"\n",(0,c.jsx)(s.pre,{children:(0,c.jsx)(s.code,{children:"npm install\n"})}),"\n",(0,c.jsxs)(s.p,{children:["\u30ea\u30dd\u30b8\u30c8\u30ea\u306e\u30eb\u30fc\u30c8\u306b\u623b\u308a\u3001\u4ee5\u4e0b\u306e\u30b3\u30de\u30f3\u30c9\u3092\u4f7f\u7528\u3057\u3066 ",(0,c.jsx)(s.code,{children:"/lambda"})," \u30c7\u30a3\u30ec\u30af\u30c8\u30ea\u306b\u79fb\u52d5\u3057\u307e\u3059\uff1a"]}),"\n",(0,c.jsx)(s.pre,{children:(0,c.jsx)(s.code,{children:"cd lambda\n"})}),"\n",(0,c.jsxs)(s.p,{children:[(0,c.jsx)(s.code,{children:"/lambda"})," \u30d5\u30a9\u30eb\u30c0\u3067\u3001\u4ee5\u4e0b\u306e\u30b3\u30de\u30f3\u30c9\u3092\u4f7f\u7528\u3057\u3066 Go \u306e\u4f9d\u5b58\u95a2\u4fc2\u3092\u30a4\u30f3\u30b9\u30c8\u30fc\u30eb\u3057\u307e\u3059\uff1a"]}),"\n",(0,c.jsx)(s.pre,{children:(0,c.jsx)(s.code,{children:"go get\n"})}),"\n",(0,c.jsx)(s.p,{children:"\u3053\u308c\u3067\u3059\u3079\u3066\u306e\u4f9d\u5b58\u95a2\u4fc2\u304c\u30a4\u30f3\u30b9\u30c8\u30fc\u30eb\u3055\u308c\u307e\u3057\u305f\u3002"}),"\n",(0,c.jsx)(s.h3,{id:"\u8a2d\u5b9a\u30d5\u30a1\u30a4\u30eb\u306e\u5909\u66f4",children:"\u8a2d\u5b9a\u30d5\u30a1\u30a4\u30eb\u306e\u5909\u66f4"}),"\n",(0,c.jsxs)(s.p,{children:["\u30ea\u30dd\u30b8\u30c8\u30ea\u306e\u30eb\u30fc\u30c8\u306b\u3042\u308b ",(0,c.jsx)(s.code,{children:"config.yaml"})," \u3092\u958b\u304d\u3001\u65b0\u3057\u304f\u4f5c\u6210\u3057\u305f\u30ef\u30fc\u30af\u30b9\u30da\u30fc\u30b9 ID \u3068 AMP \u30ef\u30fc\u30af\u30b9\u30da\u30fc\u30b9\u304c\u5b58\u5728\u3059\u308b\u30ea\u30fc\u30b8\u30e7\u30f3\u3092\u4f7f\u7528\u3057\u3066\u3001AMP \u30ef\u30fc\u30af\u30b9\u30da\u30fc\u30b9 URL \u306e ",(0,c.jsx)(s.code,{children:"{workspace}"})," \u3092\u7f6e\u304d\u63db\u3048\u307e\u3059\u3002"]}),"\n",(0,c.jsx)(s.p,{children:"\u4f8b\u3048\u3070\u3001\u4ee5\u4e0b\u306e\u3088\u3046\u306b\u5909\u66f4\u3057\u307e\u3059\uff1a"}),"\n",(0,c.jsx)(s.pre,{children:(0,c.jsx)(s.code,{children:'AMP:\n    remote_write_url: "https://aps-workspaces.us-east-2.amazonaws.com/workspaces/{workspaceId}/api/v1/remote_write"\n    region: us-east-2\n'})}),"\n",(0,c.jsx)(s.p,{children:"Firehose Delivery Stream \u3068 S3 \u30d0\u30b1\u30c3\u30c8\u306e\u540d\u524d\u3092\u4efb\u610f\u306e\u3082\u306e\u306b\u5909\u66f4\u3057\u3066\u304f\u3060\u3055\u3044\u3002"}),"\n",(0,c.jsx)(s.h3,{id:"\u30b9\u30bf\u30c3\u30af\u306e\u30c7\u30d7\u30ed\u30a4",children:"\u30b9\u30bf\u30c3\u30af\u306e\u30c7\u30d7\u30ed\u30a4"}),"\n",(0,c.jsxs)(s.p,{children:[(0,c.jsx)(s.code,{children:"config.yaml"})," \u306b AMP \u30ef\u30fc\u30af\u30b9\u30da\u30fc\u30b9 ID \u3092\u8a2d\u5b9a\u3057\u305f\u3089\u3001CloudFormation \u306b\u30b9\u30bf\u30c3\u30af\u3092\u30c7\u30d7\u30ed\u30a4\u3059\u308b\u6e96\u5099\u304c\u6574\u3044\u307e\u3057\u305f\u3002\nCDK \u3068 Lambda \u30b3\u30fc\u30c9\u3092\u30d3\u30eb\u30c9\u3059\u308b\u306b\u306f\u3001\u30ea\u30dd\u30b8\u30c8\u30ea\u306e\u30eb\u30fc\u30c8\u3067\u6b21\u306e\u30b3\u30de\u30f3\u30c9\u3092\u5b9f\u884c\u3057\u307e\u3059\uff1a"]}),"\n",(0,c.jsx)(s.pre,{children:(0,c.jsx)(s.code,{children:"npm run build\n"})}),"\n",(0,c.jsx)(s.p,{children:"\u3053\u306e\u30d3\u30eb\u30c9\u30b9\u30c6\u30c3\u30d7\u3067\u306f\u3001Go Lambda \u30d0\u30a4\u30ca\u30ea\u304c\u30d3\u30eb\u30c9\u3055\u308c\u3001CDK \u304c CloudFormation \u306b\u30c7\u30d7\u30ed\u30a4\u3055\u308c\u307e\u3059\u3002"}),"\n",(0,c.jsx)(s.p,{children:"\u30b9\u30bf\u30c3\u30af\u3092\u30c7\u30d7\u30ed\u30a4\u3059\u308b\u306b\u306f\u3001\u4ee5\u4e0b\u306e IAM \u306e\u5909\u66f4\u3092\u627f\u8a8d\u3057\u3066\u304f\u3060\u3055\u3044\uff1a"}),"\n",(0,c.jsx)(s.p,{children:(0,c.jsx)(s.img,{alt:"Screen shot of the IAM Changes when deploying the CDK",src:n(61919).A+"",width:"2782",height:"1108"})}),"\n",(0,c.jsx)(s.p,{children:"\u6b21\u306e\u30b3\u30de\u30f3\u30c9\u3092\u5b9f\u884c\u3057\u3066\u3001\u30b9\u30bf\u30c3\u30af\u304c\u4f5c\u6210\u3055\u308c\u305f\u3053\u3068\u3092\u78ba\u8a8d\u3057\u307e\u3059\uff1a"}),"\n",(0,c.jsx)(s.pre,{children:(0,c.jsx)(s.code,{children:"aws cloudformation list-stacks\n"})}),"\n",(0,c.jsxs)(s.p,{children:[(0,c.jsx)(s.code,{children:"CDK Stack"})," \u3068\u3044\u3046\u540d\u524d\u306e\u30b9\u30bf\u30c3\u30af\u304c\u4f5c\u6210\u3055\u308c\u3066\u3044\u308b\u306f\u305a\u3067\u3059\u3002"]}),"\n",(0,c.jsx)(s.h2,{id:"cloudwatch-\u30b9\u30c8\u30ea\u30fc\u30e0\u306e\u4f5c\u6210",children:"CloudWatch \u30b9\u30c8\u30ea\u30fc\u30e0\u306e\u4f5c\u6210"}),"\n",(0,c.jsxs)(s.p,{children:["CloudWatch \u30b3\u30f3\u30bd\u30fc\u30eb\u306b\u79fb\u52d5\u3057\u307e\u3059\u3002\u4f8b\u3048\u3070\u3001\n",(0,c.jsx)(s.code,{children:"https://console.aws.amazon.com/cloudwatch/home?region=us-east-1#metric-streams:streamsList"}),"\n\u306b\u30a2\u30af\u30bb\u30b9\u3057\u3001\u300cCreate metric stream\u300d\u3092\u30af\u30ea\u30c3\u30af\u3057\u307e\u3059\u3002"]}),"\n",(0,c.jsx)(s.p,{children:"\u5fc5\u8981\u306a\u30e1\u30c8\u30ea\u30af\u30b9\u3092\u9078\u629e\u3057\u307e\u3059\u3002\u3059\u3079\u3066\u306e\u30e1\u30c8\u30ea\u30af\u30b9\u304b\u3001\u9078\u629e\u3057\u305f\u540d\u524d\u7a7a\u9593\u306e\u30e1\u30c8\u30ea\u30af\u30b9\u306e\u307f\u3092\u9078\u629e\u3067\u304d\u307e\u3059\u3002"}),"\n",(0,c.jsx)(s.p,{children:"CDK \u306b\u3088\u3063\u3066\u4f5c\u6210\u3055\u308c\u305f\u65e2\u5b58\u306e Firehose \u3092\u4f7f\u7528\u3057\u3066\u3001\u30e1\u30c8\u30ea\u30af\u30b9\u30b9\u30c8\u30ea\u30fc\u30e0\u3092\u8a2d\u5b9a\u3057\u307e\u3059\u3002\n\u51fa\u529b\u5f62\u5f0f\u3092 OpenTelemetry 0.7 \u304b\u3089 JSON \u306b\u5909\u66f4\u3057\u307e\u3059\u3002\n\u30e1\u30c8\u30ea\u30af\u30b9\u30b9\u30c8\u30ea\u30fc\u30e0\u540d\u3092\u4efb\u610f\u306e\u3082\u306e\u306b\u5909\u66f4\u3057\u3001\u300cCreate metric stream\u300d\u3092\u30af\u30ea\u30c3\u30af\u3057\u307e\u3059\u3002"}),"\n",(0,c.jsx)(s.p,{children:(0,c.jsx)(s.img,{alt:"Screen shot of the Cloudwatch Metric Stream Configuration",src:n(5535).A+"",width:"1606",height:"1372"})}),"\n",(0,c.jsxs)(s.p,{children:["Lambda \u95a2\u6570\u306e\u547c\u3073\u51fa\u3057\u3092\u78ba\u8a8d\u3059\u308b\u306b\u306f\u3001",(0,c.jsx)(s.a,{href:"https://console.aws.amazon.com/lambda/home",children:"Lambda \u30b3\u30f3\u30bd\u30fc\u30eb"}),"\u306b\u79fb\u52d5\u3057\u3001",(0,c.jsx)(s.code,{children:"KinesisMessageHandler"})," \u95a2\u6570\u3092\u30af\u30ea\u30c3\u30af\u3057\u307e\u3059\u3002\n",(0,c.jsx)(s.code,{children:"Monitor"})," \u30bf\u30d6\u3068 ",(0,c.jsx)(s.code,{children:"Logs"})," \u30b5\u30d6\u30bf\u30d6\u3092\u30af\u30ea\u30c3\u30af\u3059\u308b\u3068\u3001\u300cRecent Invocations\u300d\u306e\u4e0b\u306b Lambda \u95a2\u6570\u304c\u30c8\u30ea\u30ac\u30fc\u3055\u308c\u305f\u30a8\u30f3\u30c8\u30ea\u304c\u8868\u793a\u3055\u308c\u308b\u306f\u305a\u3067\u3059\u3002"]}),"\n",(0,c.jsx)(s.admonition,{type:"note",children:(0,c.jsx)(s.p,{children:"Monitor \u30bf\u30d6\u306b\u547c\u3073\u51fa\u3057\u304c\u8868\u793a\u3055\u308c\u308b\u307e\u3067\u3001\u6700\u5927 5 \u5206\u304b\u304b\u308b\u5834\u5408\u304c\u3042\u308a\u307e\u3059\u3002"})}),"\n",(0,c.jsx)(s.p,{children:"\u4ee5\u4e0a\u3067\u3059\uff01\u304a\u3081\u3067\u3068\u3046\u3054\u3056\u3044\u307e\u3059\u3002\u3053\u308c\u3067 CloudWatch \u304b\u3089 Amazon Managed Service for Prometheus \u3078\u30e1\u30c8\u30ea\u30af\u30b9\u306e\u30b9\u30c8\u30ea\u30fc\u30df\u30f3\u30b0\u304c\u958b\u59cb\u3055\u308c\u307e\u3057\u305f\u3002"}),"\n",(0,c.jsx)(s.h2,{id:"\u30af\u30ea\u30fc\u30f3\u30a2\u30c3\u30d7",children:"\u30af\u30ea\u30fc\u30f3\u30a2\u30c3\u30d7"}),"\n",(0,c.jsx)(s.p,{children:"\u307e\u305a\u3001CloudFormation \u30b9\u30bf\u30c3\u30af\u3092\u524a\u9664\u3057\u307e\u3059\u3002"}),"\n",(0,c.jsx)(s.pre,{children:(0,c.jsx)(s.code,{children:"cd cdk\ncdk destroy\n"})}),"\n",(0,c.jsx)(s.p,{children:"AMP \u30ef\u30fc\u30af\u30b9\u30da\u30fc\u30b9\u3092\u524a\u9664\u3057\u307e\u3059\u3002"}),"\n",(0,c.jsx)(s.pre,{children:(0,c.jsx)(s.code,{children:"aws amp delete-workspace --workspace-id \\\n    `aws amp list-workspaces --alias prometheus-sample-app --query 'workspaces[0].workspaceId' --output text`\n"})}),"\n",(0,c.jsx)(s.p,{children:"\u6700\u5f8c\u306b\u3001\u30b3\u30f3\u30bd\u30fc\u30eb\u304b\u3089 CloudWatch Metric Stream \u3092\u524a\u9664\u3057\u307e\u3059\u3002"})]})}function h(e={}){const{wrapper:s}={...(0,a.R)(),...e.components};return s?(0,c.jsx)(s,{...e,children:(0,c.jsx)(l,{...e})}):l(e)}},61919:(e,s,n)=>{n.d(s,{A:()=>r});const r=n.p+"assets/images/cdk-amp-iam-changes-3a782e1a12d809c1087c8120564ecb95.png"}}]);
"use strict";(self.webpackChunkobservability_best_practices=self.webpackChunkobservability_best_practices||[]).push([[3707],{8525:(e,s,i)=>{i.r(s),i.d(s,{assets:()=>a,contentTitle:()=>d,default:()=>h,frontMatter:()=>r,metadata:()=>n,toc:()=>o});const n=JSON.parse('{"id":"tools/logs/logs-insights-examples","title":"CloudWatch Logs Insights \u306e\u30af\u30a8\u30ea\u4f8b","description":"CloudWatch Logs Insights \u306f\u3001CloudWatch \u30ed\u30b0\u30c7\u30fc\u30bf\u3092\u5206\u6790\u304a\u3088\u3073\u30af\u30a8\u30ea\u3059\u308b\u305f\u3081\u306e\u5f37\u529b\u306a\u30d7\u30e9\u30c3\u30c8\u30d5\u30a9\u30fc\u30e0\u3092\u63d0\u4f9b\u3057\u307e\u3059\u3002","source":"@site/i18n/ja/docusaurus-plugin-content-docs/current/tools/logs/logs-insights-examples.md","sourceDirName":"tools/logs","slug":"/tools/logs/logs-insights-examples","permalink":"/observability-best-practices/ja/tools/logs/logs-insights-examples","draft":false,"unlisted":false,"editUrl":"https://github.com/aws-observability/observability-best-practices/blob/main/docusaurus/docs/tools/logs/logs-insights-examples.md","tags":[],"version":"current","frontMatter":{},"sidebar":"tools","previous":{"title":"\u30ed\u30ae\u30f3\u30b0","permalink":"/observability-best-practices/ja/tools/logs/"},"next":{"title":"CloudWatch Contributor Insights","permalink":"/observability-best-practices/ja/tools/logs/contributor_insights/"}}');var t=i(74848),l=i(28453);const r={},d="CloudWatch Logs Insights \u306e\u30af\u30a8\u30ea\u4f8b",a={},o=[{value:"API Gateway",id:"api-gateway",level:2},{value:"HTTP \u30e1\u30bd\u30c3\u30c9\u30bf\u30a4\u30d7\u3092\u542b\u3080\u6700\u65b0\u306e 20 \u4ef6\u306e\u30e1\u30c3\u30bb\u30fc\u30b8",id:"http-\u30e1\u30bd\u30c3\u30c9\u30bf\u30a4\u30d7\u3092\u542b\u3080\u6700\u65b0\u306e-20-\u4ef6\u306e\u30e1\u30c3\u30bb\u30fc\u30b8",level:3},{value:"IP \u3067\u30bd\u30fc\u30c8\u3055\u308c\u305f\u4e0a\u4f4d 20 \u306e\u30c8\u30fc\u30ab\u30fc",id:"ip-\u3067\u30bd\u30fc\u30c8\u3055\u308c\u305f\u4e0a\u4f4d-20-\u306e\u30c8\u30fc\u30ab\u30fc",level:3},{value:"CloudTrail \u30ed\u30b0",id:"cloudtrail-\u30ed\u30b0",level:2},{value:"\u30a8\u30e9\u30fc\u30ab\u30c6\u30b4\u30ea\u5225\u306b\u30b0\u30eb\u30fc\u30d7\u5316\u3055\u308c\u305f API \u30b9\u30ed\u30c3\u30c8\u30ea\u30f3\u30b0\u30a8\u30e9\u30fc",id:"\u30a8\u30e9\u30fc\u30ab\u30c6\u30b4\u30ea\u5225\u306b\u30b0\u30eb\u30fc\u30d7\u5316\u3055\u308c\u305f-api-\u30b9\u30ed\u30c3\u30c8\u30ea\u30f3\u30b0\u30a8\u30e9\u30fc",level:3},{value:"\u30eb\u30fc\u30c8\u30a2\u30ab\u30a6\u30f3\u30c8\u306e\u30a2\u30af\u30c6\u30a3\u30d3\u30c6\u30a3\u3092\u6298\u308c\u7dda\u30b0\u30e9\u30d5\u3067\u8868\u793a",id:"\u30eb\u30fc\u30c8\u30a2\u30ab\u30a6\u30f3\u30c8\u306e\u30a2\u30af\u30c6\u30a3\u30d3\u30c6\u30a3\u3092\u6298\u308c\u7dda\u30b0\u30e9\u30d5\u3067\u8868\u793a",level:3},{value:"VPC \u30d5\u30ed\u30fc\u30ed\u30b0",id:"vpc-\u30d5\u30ed\u30fc\u30ed\u30b0",level:2},{value:"\u9078\u629e\u3057\u305f\u30bd\u30fc\u30b9 IP \u30a2\u30c9\u30ec\u30b9\u306e\u30d5\u30ed\u30fc\u30ed\u30b0\u3092\u30a2\u30af\u30b7\u30e7\u30f3\u304c REJECT \u306e\u3082\u306e\u3067\u30d5\u30a3\u30eb\u30bf\u30ea\u30f3\u30b0\u3059\u308b",id:"\u9078\u629e\u3057\u305f\u30bd\u30fc\u30b9-ip-\u30a2\u30c9\u30ec\u30b9\u306e\u30d5\u30ed\u30fc\u30ed\u30b0\u3092\u30a2\u30af\u30b7\u30e7\u30f3\u304c-reject-\u306e\u3082\u306e\u3067\u30d5\u30a3\u30eb\u30bf\u30ea\u30f3\u30b0\u3059\u308b",level:3},{value:"\u30a2\u30d9\u30a4\u30e9\u30d3\u30ea\u30c6\u30a3\u30fc\u30be\u30fc\u30f3\u5225\u306e\u30cd\u30c3\u30c8\u30ef\u30fc\u30af\u30c8\u30e9\u30d5\u30a3\u30c3\u30af\u306e\u30b0\u30eb\u30fc\u30d7\u5316",id:"\u30a2\u30d9\u30a4\u30e9\u30d3\u30ea\u30c6\u30a3\u30fc\u30be\u30fc\u30f3\u5225\u306e\u30cd\u30c3\u30c8\u30ef\u30fc\u30af\u30c8\u30e9\u30d5\u30a3\u30c3\u30af\u306e\u30b0\u30eb\u30fc\u30d7\u5316",level:3},{value:"\u30d5\u30ed\u30fc\u65b9\u5411\u306b\u3088\u308b\u30cd\u30c3\u30c8\u30ef\u30fc\u30af\u30c8\u30e9\u30d5\u30a3\u30c3\u30af\u306e\u30b0\u30eb\u30fc\u30d7\u5316",id:"\u30d5\u30ed\u30fc\u65b9\u5411\u306b\u3088\u308b\u30cd\u30c3\u30c8\u30ef\u30fc\u30af\u30c8\u30e9\u30d5\u30a3\u30c3\u30af\u306e\u30b0\u30eb\u30fc\u30d7\u5316",level:3},{value:"\u9001\u4fe1\u5143\u3068\u5b9b\u5148 IP \u30a2\u30c9\u30ec\u30b9\u5225\u306e\u4e0a\u4f4d 10 \u4ef6\u306e\u30c7\u30fc\u30bf\u8ee2\u9001",id:"\u9001\u4fe1\u5143\u3068\u5b9b\u5148-ip-\u30a2\u30c9\u30ec\u30b9\u5225\u306e\u4e0a\u4f4d-10-\u4ef6\u306e\u30c7\u30fc\u30bf\u8ee2\u9001",level:3},{value:"Amazon SNS \u30ed\u30b0",id:"amazon-sns-\u30ed\u30b0",level:2},{value:"\u7406\u7531\u5225\u306e SMS \u30e1\u30c3\u30bb\u30fc\u30b8\u5931\u6557\u6570",id:"\u7406\u7531\u5225\u306e-sms-\u30e1\u30c3\u30bb\u30fc\u30b8\u5931\u6557\u6570",level:3},{value:"\u7121\u52b9\u306a\u96fb\u8a71\u756a\u53f7\u306b\u3088\u308b SMS \u30e1\u30c3\u30bb\u30fc\u30b8\u306e\u9001\u4fe1\u5931\u6557",id:"\u7121\u52b9\u306a\u96fb\u8a71\u756a\u53f7\u306b\u3088\u308b-sms-\u30e1\u30c3\u30bb\u30fc\u30b8\u306e\u9001\u4fe1\u5931\u6557",level:3},{value:"SMS \u30bf\u30a4\u30d7\u5225\u306e\u30e1\u30c3\u30bb\u30fc\u30b8\u5931\u6557\u7d71\u8a08",id:"sms-\u30bf\u30a4\u30d7\u5225\u306e\u30e1\u30c3\u30bb\u30fc\u30b8\u5931\u6557\u7d71\u8a08",level:3},{value:"SNS \u5931\u6557\u901a\u77e5\u306e\u7d71\u8a08",id:"sns-\u5931\u6557\u901a\u77e5\u306e\u7d71\u8a08",level:3}];function c(e){const s={a:"a",admonition:"admonition",code:"code",h1:"h1",h2:"h2",h3:"h3",header:"header",li:"li",p:"p",pre:"pre",strong:"strong",ul:"ul",...(0,l.R)(),...e.components};return(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)(s.header,{children:(0,t.jsx)(s.h1,{id:"cloudwatch-logs-insights-\u306e\u30af\u30a8\u30ea\u4f8b",children:"CloudWatch Logs Insights \u306e\u30af\u30a8\u30ea\u4f8b"})}),"\n",(0,t.jsxs)(s.p,{children:[(0,t.jsx)(s.a,{href:"https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/logs/AnalyzingLogData.html",children:"CloudWatch Logs Insights"})," \u306f\u3001CloudWatch \u30ed\u30b0\u30c7\u30fc\u30bf\u3092\u5206\u6790\u304a\u3088\u3073\u30af\u30a8\u30ea\u3059\u308b\u305f\u3081\u306e\u5f37\u529b\u306a\u30d7\u30e9\u30c3\u30c8\u30d5\u30a9\u30fc\u30e0\u3092\u63d0\u4f9b\u3057\u307e\u3059\u3002\nSQL \u306b\u4f3c\u305f\u30af\u30a8\u30ea\u8a00\u8a9e\u3092\u4f7f\u7528\u3057\u3066\u3001\u3044\u304f\u3064\u304b\u306e\u30b7\u30f3\u30d7\u30eb\u3067\u5f37\u529b\u306a\u30b3\u30de\u30f3\u30c9\u3067\u30ed\u30b0\u30c7\u30fc\u30bf\u3092\u30a4\u30f3\u30bf\u30e9\u30af\u30c6\u30a3\u30d6\u306b\u691c\u7d22\u3067\u304d\u307e\u3059\u3002"]}),"\n",(0,t.jsx)(s.p,{children:"CloudWatch Logs Insights \u306f\u3001\u4ee5\u4e0b\u306e\u30ab\u30c6\u30b4\u30ea\u306b\u5bfe\u3057\u3066\u3001\u3059\u3050\u306b\u4f7f\u3048\u308b\u30af\u30a8\u30ea\u4f8b\u3092\u63d0\u4f9b\u3057\u3066\u3044\u307e\u3059\uff1a"}),"\n",(0,t.jsxs)(s.ul,{children:["\n",(0,t.jsx)(s.li,{children:"Lambda"}),"\n",(0,t.jsx)(s.li,{children:"VPC Flow Logs"}),"\n",(0,t.jsx)(s.li,{children:"CloudTrail"}),"\n",(0,t.jsx)(s.li,{children:"\u5171\u901a\u30af\u30a8\u30ea"}),"\n",(0,t.jsx)(s.li,{children:"Route 53"}),"\n",(0,t.jsx)(s.li,{children:"AWS AppSync"}),"\n",(0,t.jsx)(s.li,{children:"NAT Gateway"}),"\n"]}),"\n",(0,t.jsxs)(s.p,{children:["\u3053\u306e\u30d9\u30b9\u30c8\u30d7\u30e9\u30af\u30c6\u30a3\u30b9\u30ac\u30a4\u30c9\u306e\u30bb\u30af\u30b7\u30e7\u30f3\u3067\u306f\u3001\u73fe\u5728\u3059\u3050\u306b\u4f7f\u3048\u308b\u4f8b\u306b\u542b\u307e\u308c\u3066\u3044\u306a\u3044\u4ed6\u306e\u30bf\u30a4\u30d7\u306e\u30ed\u30b0\u306b\u5bfe\u3059\u308b\u30af\u30a8\u30ea\u4f8b\u3092\u63d0\u4f9b\u3057\u307e\u3059\u3002\n\u3053\u306e\u30ea\u30b9\u30c8\u306f\u6642\u9593\u3068\u3068\u3082\u306b\u9032\u5316\u3057\u5909\u5316\u3057\u3066\u3044\u304d\u307e\u3059\u3002\n\u307e\u305f\u3001GitHub \u306e ",(0,t.jsx)(s.a,{href:"https://github.com/aws-observability/observability-best-practices/issues",children:"issue"})," \u3092\u4f5c\u6210\u3059\u308b\u3053\u3068\u3067\u3001\u72ec\u81ea\u306e\u4f8b\u3092\u5be9\u67fb\u306e\u305f\u3081\u306b\u63d0\u51fa\u3059\u308b\u3053\u3068\u304c\u3067\u304d\u307e\u3059\u3002"]}),"\n",(0,t.jsx)(s.h2,{id:"api-gateway",children:"API Gateway"}),"\n",(0,t.jsx)(s.h3,{id:"http-\u30e1\u30bd\u30c3\u30c9\u30bf\u30a4\u30d7\u3092\u542b\u3080\u6700\u65b0\u306e-20-\u4ef6\u306e\u30e1\u30c3\u30bb\u30fc\u30b8",children:"HTTP \u30e1\u30bd\u30c3\u30c9\u30bf\u30a4\u30d7\u3092\u542b\u3080\u6700\u65b0\u306e 20 \u4ef6\u306e\u30e1\u30c3\u30bb\u30fc\u30b8"}),"\n",(0,t.jsx)(s.pre,{children:(0,t.jsx)(s.code,{children:"filter @message like /$METHOD/ \n| fields @timestamp, @message\n| sort @timestamp desc\n| limit 20\n"})}),"\n",(0,t.jsxs)(s.p,{children:["\u3053\u306e\u30af\u30a8\u30ea\u306f\u3001\u7279\u5b9a\u306e HTTP \u30e1\u30bd\u30c3\u30c9\u3092\u542b\u3080\u6700\u65b0\u306e 20 \u4ef6\u306e\u30ed\u30b0\u30e1\u30c3\u30bb\u30fc\u30b8\u3092\u3001\u30bf\u30a4\u30e0\u30b9\u30bf\u30f3\u30d7\u306e\u964d\u9806\u3067\u30bd\u30fc\u30c8\u3057\u3066\u8fd4\u3057\u307e\u3059\u3002",(0,t.jsx)(s.strong,{children:"METHOD"})," \u3092\u3001\u30af\u30a8\u30ea\u5bfe\u8c61\u306e\u30e1\u30bd\u30c3\u30c9\u306b\u7f6e\u304d\u63db\u3048\u3066\u304f\u3060\u3055\u3044\u3002\u4ee5\u4e0b\u306f\u3001\u3053\u306e\u30af\u30a8\u30ea\u306e\u4f7f\u7528\u4f8b\u3067\u3059\uff1a"]}),"\n",(0,t.jsx)(s.pre,{children:(0,t.jsx)(s.code,{children:"filter @message like /POST/ \n| fields @timestamp, @message\n| sort @timestamp desc\n| limit 20\n"})}),"\n",(0,t.jsx)(s.admonition,{type:"tip",children:(0,t.jsx)(s.p,{children:"$limit \u306e\u5024\u3092\u5909\u66f4\u3059\u308b\u3053\u3068\u3067\u3001\u7570\u306a\u308b\u6570\u306e\u30e1\u30c3\u30bb\u30fc\u30b8\u3092\u8fd4\u3059\u3053\u3068\u304c\u3067\u304d\u307e\u3059\u3002"})}),"\n",(0,t.jsx)(s.h3,{id:"ip-\u3067\u30bd\u30fc\u30c8\u3055\u308c\u305f\u4e0a\u4f4d-20-\u306e\u30c8\u30fc\u30ab\u30fc",children:"IP \u3067\u30bd\u30fc\u30c8\u3055\u308c\u305f\u4e0a\u4f4d 20 \u306e\u30c8\u30fc\u30ab\u30fc"}),"\n",(0,t.jsx)(s.pre,{children:(0,t.jsx)(s.code,{children:"fields @timestamp, @message\n| stats count() by ip\n| sort ip asc\n| limit 20\n"})}),"\n",(0,t.jsx)(s.p,{children:"\u3053\u306e\u30af\u30a8\u30ea\u306f\u3001IP \u3067\u30bd\u30fc\u30c8\u3055\u308c\u305f\u4e0a\u4f4d 20 \u306e\u30c8\u30fc\u30ab\u30fc\u3092\u8fd4\u3057\u307e\u3059\u3002\u3053\u308c\u306f\u3001API \u306b\u5bfe\u3059\u308b\u60aa\u610f\u306e\u3042\u308b\u30a2\u30af\u30c6\u30a3\u30d3\u30c6\u30a3\u3092\u691c\u51fa\u3059\u308b\u306e\u306b\u5f79\u7acb\u3061\u307e\u3059\u3002"}),"\n",(0,t.jsx)(s.p,{children:"\u6b21\u306e\u30b9\u30c6\u30c3\u30d7\u3068\u3057\u3066\u3001\u30e1\u30bd\u30c3\u30c9\u30bf\u30a4\u30d7\u306e\u8ffd\u52a0\u30d5\u30a3\u30eb\u30bf\u30fc\u3092\u52a0\u3048\u308b\u3053\u3068\u304c\u3067\u304d\u307e\u3059\u3002\u4f8b\u3048\u3070\u3001\u3053\u306e\u30af\u30a8\u30ea\u306f IP \u306b\u3088\u308b\u4e0a\u4f4d\u306e\u30c8\u30fc\u30ab\u30fc\u3092\u8868\u793a\u3057\u307e\u3059\u304c\u3001\u300cPUT\u300d\u30e1\u30bd\u30c3\u30c9\u547c\u3073\u51fa\u3057\u306e\u307f\u3092\u5bfe\u8c61\u3068\u3057\u3066\u3044\u307e\u3059\uff1a"}),"\n",(0,t.jsx)(s.pre,{children:(0,t.jsx)(s.code,{children:"fields @timestamp, @message\n| filter @message like /PUT/\n| stats count() by ip\n| sort ip asc\n| limit 20\n"})}),"\n",(0,t.jsx)(s.h2,{id:"cloudtrail-\u30ed\u30b0",children:"CloudTrail \u30ed\u30b0"}),"\n",(0,t.jsx)(s.h3,{id:"\u30a8\u30e9\u30fc\u30ab\u30c6\u30b4\u30ea\u5225\u306b\u30b0\u30eb\u30fc\u30d7\u5316\u3055\u308c\u305f-api-\u30b9\u30ed\u30c3\u30c8\u30ea\u30f3\u30b0\u30a8\u30e9\u30fc",children:"\u30a8\u30e9\u30fc\u30ab\u30c6\u30b4\u30ea\u5225\u306b\u30b0\u30eb\u30fc\u30d7\u5316\u3055\u308c\u305f API \u30b9\u30ed\u30c3\u30c8\u30ea\u30f3\u30b0\u30a8\u30e9\u30fc"}),"\n",(0,t.jsx)(s.pre,{children:(0,t.jsx)(s.code,{children:"stats count(errorCode) as eventCount by eventSource, eventName, awsRegion, userAgent, errorCode\n| filter errorCode = 'ThrottlingException' \n| sort eventCount desc\n"})}),"\n",(0,t.jsx)(s.p,{children:"\u3053\u306e\u30af\u30a8\u30ea\u3092\u4f7f\u7528\u3059\u308b\u3068\u3001\u30ab\u30c6\u30b4\u30ea\u5225\u306b\u30b0\u30eb\u30fc\u30d7\u5316\u3055\u308c\u305f API \u30b9\u30ed\u30c3\u30c8\u30ea\u30f3\u30b0\u30a8\u30e9\u30fc\u3092\u964d\u9806\u3067\u8868\u793a\u3067\u304d\u307e\u3059\u3002"}),"\n",(0,t.jsx)(s.admonition,{type:"tip",children:(0,t.jsxs)(s.p,{children:["\u3053\u306e\u30af\u30a8\u30ea\u3092\u4f7f\u7528\u3059\u308b\u306b\u306f\u3001\u307e\u305a ",(0,t.jsx)(s.a,{href:"https://docs.aws.amazon.com/ja_jp/awscloudtrail/latest/userguide/send-cloudtrail-events-to-cloudwatch-logs.html",children:"CloudTrail \u30ed\u30b0\u3092 CloudWatch \u306b\u9001\u4fe1\u3059\u308b"})," \u3088\u3046\u306b\u8a2d\u5b9a\u3059\u308b\u5fc5\u8981\u304c\u3042\u308a\u307e\u3059\u3002"]})}),"\n",(0,t.jsx)(s.h3,{id:"\u30eb\u30fc\u30c8\u30a2\u30ab\u30a6\u30f3\u30c8\u306e\u30a2\u30af\u30c6\u30a3\u30d3\u30c6\u30a3\u3092\u6298\u308c\u7dda\u30b0\u30e9\u30d5\u3067\u8868\u793a",children:"\u30eb\u30fc\u30c8\u30a2\u30ab\u30a6\u30f3\u30c8\u306e\u30a2\u30af\u30c6\u30a3\u30d3\u30c6\u30a3\u3092\u6298\u308c\u7dda\u30b0\u30e9\u30d5\u3067\u8868\u793a"}),"\n",(0,t.jsx)(s.pre,{children:(0,t.jsx)(s.code,{children:"fields @timestamp, @message, userIdentity.type \n| filter userIdentity.type='Root' \n| stats count() as RootActivity by bin(5m)\n"})}),"\n",(0,t.jsx)(s.p,{children:"\u3053\u306e\u30af\u30a8\u30ea\u3092\u4f7f\u7528\u3059\u308b\u3068\u3001\u30eb\u30fc\u30c8\u30a2\u30ab\u30a6\u30f3\u30c8\u306e\u30a2\u30af\u30c6\u30a3\u30d3\u30c6\u30a3\u3092\u6298\u308c\u7dda\u30b0\u30e9\u30d5\u3067\u53ef\u8996\u5316\u3067\u304d\u307e\u3059\u3002\u3053\u306e\u30af\u30a8\u30ea\u306f\u3001\u6642\u9593\u7d4c\u904e\u306b\u4f34\u3046\u30eb\u30fc\u30c8\u30a2\u30af\u30c6\u30a3\u30d3\u30c6\u30a3\u3092\u96c6\u8a08\u3057\u30015 \u5206\u9593\u9694\u3054\u3068\u306e\u30eb\u30fc\u30c8\u30a2\u30af\u30c6\u30a3\u30d3\u30c6\u30a3\u306e\u767a\u751f\u56de\u6570\u3092\u30ab\u30a6\u30f3\u30c8\u3057\u307e\u3059\u3002"}),"\n",(0,t.jsx)(s.admonition,{type:"tip",children:(0,t.jsx)(s.p,{children:(0,t.jsx)(s.a,{href:"https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/logs/CWL_Insights-Visualizing-Log-Data.html",children:"\u30ed\u30b0\u30c7\u30fc\u30bf\u3092\u30b0\u30e9\u30d5\u3067\u53ef\u8996\u5316\u3059\u308b"})})}),"\n",(0,t.jsx)(s.h2,{id:"vpc-\u30d5\u30ed\u30fc\u30ed\u30b0",children:"VPC \u30d5\u30ed\u30fc\u30ed\u30b0"}),"\n",(0,t.jsx)(s.h3,{id:"\u9078\u629e\u3057\u305f\u30bd\u30fc\u30b9-ip-\u30a2\u30c9\u30ec\u30b9\u306e\u30d5\u30ed\u30fc\u30ed\u30b0\u3092\u30a2\u30af\u30b7\u30e7\u30f3\u304c-reject-\u306e\u3082\u306e\u3067\u30d5\u30a3\u30eb\u30bf\u30ea\u30f3\u30b0\u3059\u308b",children:"\u9078\u629e\u3057\u305f\u30bd\u30fc\u30b9 IP \u30a2\u30c9\u30ec\u30b9\u306e\u30d5\u30ed\u30fc\u30ed\u30b0\u3092\u30a2\u30af\u30b7\u30e7\u30f3\u304c REJECT \u306e\u3082\u306e\u3067\u30d5\u30a3\u30eb\u30bf\u30ea\u30f3\u30b0\u3059\u308b"}),"\n",(0,t.jsx)(s.pre,{children:(0,t.jsx)(s.code,{children:"fields @timestamp, @message, @logStream, @log  | filter srcAddr like '$SOURCEIP' and action = 'REJECT'\n| sort @timestamp desc\n| limit 20\n"})}),"\n",(0,t.jsx)(s.p,{children:"\u3053\u306e\u30af\u30a8\u30ea\u306f\u3001$SOURCEIP \u304b\u3089\u306e 'REJECT' \u3092\u542b\u3080\u6700\u65b0\u306e 20 \u4ef6\u306e\u30ed\u30b0\u30e1\u30c3\u30bb\u30fc\u30b8\u3092\u8fd4\u3057\u307e\u3059\u3002\u3053\u308c\u306f\u3001\u30c8\u30e9\u30d5\u30a3\u30c3\u30af\u304c\u660e\u793a\u7684\u306b\u62d2\u5426\u3055\u308c\u3066\u3044\u308b\u304b\u3001\u30af\u30e9\u30a4\u30a2\u30f3\u30c8\u5074\u306e\u30cd\u30c3\u30c8\u30ef\u30fc\u30af\u8a2d\u5b9a\u306b\u554f\u984c\u304c\u3042\u308b\u304b\u3092\u691c\u51fa\u3059\u308b\u306e\u306b\u4f7f\u7528\u3067\u304d\u307e\u3059\u3002"}),"\n",(0,t.jsx)(s.admonition,{type:"tip",children:(0,t.jsx)(s.p,{children:"'$SOURCEIP' \u306e\u90e8\u5206\u3092\u3001\u8abf\u67fb\u5bfe\u8c61\u306e IP \u30a2\u30c9\u30ec\u30b9\u306e\u5024\u306b\u7f6e\u304d\u63db\u3048\u3066\u304f\u3060\u3055\u3044\u3002"})}),"\n",(0,t.jsx)(s.pre,{children:(0,t.jsx)(s.code,{children:"fields @timestamp, @message, @logStream, @log  | filter srcAddr like '10.0.0.5' and action = 'REJECT'\n| sort @timestamp desc\n| limit 20\n"})}),"\n",(0,t.jsx)(s.h3,{id:"\u30a2\u30d9\u30a4\u30e9\u30d3\u30ea\u30c6\u30a3\u30fc\u30be\u30fc\u30f3\u5225\u306e\u30cd\u30c3\u30c8\u30ef\u30fc\u30af\u30c8\u30e9\u30d5\u30a3\u30c3\u30af\u306e\u30b0\u30eb\u30fc\u30d7\u5316",children:"\u30a2\u30d9\u30a4\u30e9\u30d3\u30ea\u30c6\u30a3\u30fc\u30be\u30fc\u30f3\u5225\u306e\u30cd\u30c3\u30c8\u30ef\u30fc\u30af\u30c8\u30e9\u30d5\u30a3\u30c3\u30af\u306e\u30b0\u30eb\u30fc\u30d7\u5316"}),"\n",(0,t.jsx)(s.pre,{children:(0,t.jsx)(s.code,{children:"stats sum(bytes / 1048576) as Traffic_MB by azId as AZ_ID \n| sort Traffic_MB desc\n"})}),"\n",(0,t.jsx)(s.p,{children:"\u3053\u306e\u30af\u30a8\u30ea\u306f\u3001\u30a2\u30d9\u30a4\u30e9\u30d3\u30ea\u30c6\u30a3\u30fc\u30be\u30fc\u30f3 (AZ) \u3054\u3068\u306b\u30b0\u30eb\u30fc\u30d7\u5316\u3055\u308c\u305f\u30cd\u30c3\u30c8\u30ef\u30fc\u30af\u30c8\u30e9\u30d5\u30a3\u30c3\u30af\u30c7\u30fc\u30bf\u3092\u53d6\u5f97\u3057\u307e\u3059\u3002\n\u30d0\u30a4\u30c8\u6570\u3092\u5408\u8a08\u3057\u3001\u30e1\u30ac\u30d0\u30a4\u30c8 (MB) \u306b\u5909\u63db\u3059\u308b\u3053\u3068\u3067\u3001\u7dcf\u30c8\u30e9\u30d5\u30a3\u30c3\u30af\u91cf\u3092 MB \u5358\u4f4d\u3067\u8a08\u7b97\u3057\u307e\u3059\u3002\n\u7d50\u679c\u306f\u3001\u5404 AZ \u306e\u30c8\u30e9\u30d5\u30a3\u30c3\u30af\u91cf\u306b\u57fa\u3065\u3044\u3066\u964d\u9806\u306b\u30bd\u30fc\u30c8\u3055\u308c\u307e\u3059\u3002"}),"\n",(0,t.jsx)(s.h3,{id:"\u30d5\u30ed\u30fc\u65b9\u5411\u306b\u3088\u308b\u30cd\u30c3\u30c8\u30ef\u30fc\u30af\u30c8\u30e9\u30d5\u30a3\u30c3\u30af\u306e\u30b0\u30eb\u30fc\u30d7\u5316",children:"\u30d5\u30ed\u30fc\u65b9\u5411\u306b\u3088\u308b\u30cd\u30c3\u30c8\u30ef\u30fc\u30af\u30c8\u30e9\u30d5\u30a3\u30c3\u30af\u306e\u30b0\u30eb\u30fc\u30d7\u5316"}),"\n",(0,t.jsx)(s.pre,{children:(0,t.jsx)(s.code,{children:"stats sum(bytes / 1048576) as Traffic_MB by flowDirection as Flow_Direction \n| sort by Bytes_MB desc\n"})}),"\n",(0,t.jsx)(s.p,{children:"\u3053\u306e\u30af\u30a8\u30ea\u306f\u3001\u30d5\u30ed\u30fc\u65b9\u5411\uff08\u30a4\u30f3\u30d0\u30a6\u30f3\u30c9\u307e\u305f\u306f\u30a2\u30a6\u30c8\u30d0\u30a6\u30f3\u30c9\uff09\u3067\u30b0\u30eb\u30fc\u30d7\u5316\u3055\u308c\u305f\u30cd\u30c3\u30c8\u30ef\u30fc\u30af\u30c8\u30e9\u30d5\u30a3\u30c3\u30af\u3092\u5206\u6790\u3059\u308b\u3088\u3046\u306b\u8a2d\u8a08\u3055\u308c\u3066\u3044\u307e\u3059\u3002"}),"\n",(0,t.jsx)(s.h3,{id:"\u9001\u4fe1\u5143\u3068\u5b9b\u5148-ip-\u30a2\u30c9\u30ec\u30b9\u5225\u306e\u4e0a\u4f4d-10-\u4ef6\u306e\u30c7\u30fc\u30bf\u8ee2\u9001",children:"\u9001\u4fe1\u5143\u3068\u5b9b\u5148 IP \u30a2\u30c9\u30ec\u30b9\u5225\u306e\u4e0a\u4f4d 10 \u4ef6\u306e\u30c7\u30fc\u30bf\u8ee2\u9001"}),"\n",(0,t.jsx)(s.pre,{children:(0,t.jsx)(s.code,{children:"stats sum(bytes / 1048576) as Data_Transferred_MB by srcAddr as Source_IP, dstAddr as Destination_IP \n| sort Data_Transferred_MB desc \n| limit 10\n"})}),"\n",(0,t.jsx)(s.p,{children:"\u3053\u306e\u30af\u30a8\u30ea\u306f\u3001\u9001\u4fe1\u5143\u3068\u5b9b\u5148 IP \u30a2\u30c9\u30ec\u30b9\u5225\u306e\u4e0a\u4f4d 10 \u4ef6\u306e\u30c7\u30fc\u30bf\u8ee2\u9001\u3092\u53d6\u5f97\u3057\u307e\u3059\u3002\n\u3053\u306e\u30af\u30a8\u30ea\u3092\u4f7f\u7528\u3059\u308b\u3053\u3068\u3067\u3001\u7279\u5b9a\u306e\u9001\u4fe1\u5143\u3068\u5b9b\u5148 IP \u30a2\u30c9\u30ec\u30b9\u9593\u3067\u6700\u3082\u91cd\u8981\u306a\u30c7\u30fc\u30bf\u8ee2\u9001\u3092\u7279\u5b9a\u3059\u308b\u3053\u3068\u304c\u3067\u304d\u307e\u3059\u3002"}),"\n",(0,t.jsx)(s.h2,{id:"amazon-sns-\u30ed\u30b0",children:"Amazon SNS \u30ed\u30b0"}),"\n",(0,t.jsx)(s.h3,{id:"\u7406\u7531\u5225\u306e-sms-\u30e1\u30c3\u30bb\u30fc\u30b8\u5931\u6557\u6570",children:"\u7406\u7531\u5225\u306e SMS \u30e1\u30c3\u30bb\u30fc\u30b8\u5931\u6557\u6570"}),"\n",(0,t.jsx)(s.pre,{children:(0,t.jsx)(s.code,{children:'filter status = "FAILURE"\n| stats count(*) by delivery.providerResponse as FailureReason\n| sort delivery.providerResponse desc\n'})}),"\n",(0,t.jsx)(s.p,{children:"\u4e0a\u8a18\u306e\u30af\u30a8\u30ea\u306f\u3001\u7406\u7531\u5225\u306b\u4e26\u3079\u3089\u308c\u305f\u914d\u4fe1\u5931\u6557\u306e\u6570\u3092\u964d\u9806\u3067\u8868\u793a\u3057\u307e\u3059\u3002\u3053\u306e\u30af\u30a8\u30ea\u306f\u3001\u914d\u4fe1\u5931\u6557\u306e\u7406\u7531\u3092\u898b\u3064\u3051\u308b\u305f\u3081\u306b\u4f7f\u7528\u3067\u304d\u307e\u3059\u3002"}),"\n",(0,t.jsx)(s.h3,{id:"\u7121\u52b9\u306a\u96fb\u8a71\u756a\u53f7\u306b\u3088\u308b-sms-\u30e1\u30c3\u30bb\u30fc\u30b8\u306e\u9001\u4fe1\u5931\u6557",children:"\u7121\u52b9\u306a\u96fb\u8a71\u756a\u53f7\u306b\u3088\u308b SMS \u30e1\u30c3\u30bb\u30fc\u30b8\u306e\u9001\u4fe1\u5931\u6557"}),"\n",(0,t.jsx)(s.pre,{children:(0,t.jsx)(s.code,{children:'fields notification.messageId as MessageId, delivery.destination as PhoneNumber\n| filter status = "FAILURE" and delivery.providerResponse = "Invalid phone number"\n| limit 100\n'})}),"\n",(0,t.jsx)(s.p,{children:"\u3053\u306e\u30af\u30a8\u30ea\u306f\u3001\u7121\u52b9\u306a\u96fb\u8a71\u756a\u53f7\u304c\u539f\u56e0\u3067\u914d\u4fe1\u306b\u5931\u6557\u3057\u305f\u30e1\u30c3\u30bb\u30fc\u30b8\u3092\u8fd4\u3057\u307e\u3059\u3002\n\u3053\u308c\u306f\u3001\u4fee\u6b63\u304c\u5fc5\u8981\u306a\u96fb\u8a71\u756a\u53f7\u3092\u7279\u5b9a\u3059\u308b\u305f\u3081\u306b\u4f7f\u7528\u3067\u304d\u307e\u3059\u3002"}),"\n",(0,t.jsx)(s.h3,{id:"sms-\u30bf\u30a4\u30d7\u5225\u306e\u30e1\u30c3\u30bb\u30fc\u30b8\u5931\u6557\u7d71\u8a08",children:"SMS \u30bf\u30a4\u30d7\u5225\u306e\u30e1\u30c3\u30bb\u30fc\u30b8\u5931\u6557\u7d71\u8a08"}),"\n",(0,t.jsx)(s.pre,{children:(0,t.jsx)(s.code,{children:'fields delivery.smsType\n| filter status = "FAILURE"\n| stats count(notification.messageId), avg(delivery.dwellTimeMs), sum(delivery.priceInUSD) by delivery.smsType\n'})}),"\n",(0,t.jsx)(s.p,{children:"\u3053\u306e\u30af\u30a8\u30ea\u306f\u3001\u5404 SMS \u30bf\u30a4\u30d7\uff08\u30c8\u30e9\u30f3\u30b6\u30af\u30b7\u30e7\u30ca\u30eb\u307e\u305f\u306f\u30d7\u30ed\u30e2\u30fc\u30b7\u30e7\u30f3\uff09\u306e\u4ef6\u6570\u3001\u5e73\u5747\u6ede\u7559\u6642\u9593\u3001\u304a\u3088\u3073\u652f\u51fa\u3092\u8fd4\u3057\u307e\u3059\u3002\u3053\u306e\u30af\u30a8\u30ea\u306f\u3001\u662f\u6b63\u63aa\u7f6e\u3092\u958b\u59cb\u3059\u308b\u305f\u3081\u306e\u3057\u304d\u3044\u5024\u3092\u8a2d\u5b9a\u3059\u308b\u306e\u306b\u4f7f\u7528\u3067\u304d\u307e\u3059\u3002\u7279\u5b9a\u306e SMS \u30bf\u30a4\u30d7\u306e\u307f\u306b\u662f\u6b63\u63aa\u7f6e\u304c\u5fc5\u8981\u306a\u5834\u5408\u306f\u3001\u30af\u30a8\u30ea\u3092\u5909\u66f4\u3057\u3066\u7279\u5b9a\u306e SMS \u30bf\u30a4\u30d7\u306e\u307f\u3092\u30d5\u30a3\u30eb\u30bf\u30ea\u30f3\u30b0\u3059\u308b\u3053\u3068\u304c\u3067\u304d\u307e\u3059\u3002"}),"\n",(0,t.jsx)(s.h3,{id:"sns-\u5931\u6557\u901a\u77e5\u306e\u7d71\u8a08",children:"SNS \u5931\u6557\u901a\u77e5\u306e\u7d71\u8a08"}),"\n",(0,t.jsx)(s.pre,{children:(0,t.jsx)(s.code,{children:'fields @MessageID \n| filter status = "FAILURE"\n| stats count(delivery.deliveryId) as FailedDeliveryCount, avg(delivery.dwellTimeMs) as AvgDwellTime, max(delivery.dwellTimeMs) as MaxDwellTime by notification.messageId as MessageID\n| limit 100\n'})}),"\n",(0,t.jsx)(s.p,{children:"\u3053\u306e\u30af\u30a8\u30ea\u306f\u3001\u5931\u6557\u3057\u305f\u30e1\u30c3\u30bb\u30fc\u30b8\u3054\u3068\u306e\u914d\u4fe1\u5931\u6557\u56de\u6570\u3001\u5e73\u5747\u6ede\u7559\u6642\u9593\u3001\u6700\u5927\u6ede\u7559\u6642\u9593\u3092\u8fd4\u3057\u307e\u3059\u3002\n\u3053\u306e\u30af\u30a8\u30ea\u306f\u3001\u662f\u6b63\u63aa\u7f6e\u3092\u958b\u59cb\u3059\u308b\u305f\u3081\u306e\u3057\u304d\u3044\u5024\u3092\u8a2d\u5b9a\u3059\u308b\u306e\u306b\u4f7f\u7528\u3067\u304d\u307e\u3059\u3002"})]})}function h(e={}){const{wrapper:s}={...(0,l.R)(),...e.components};return s?(0,t.jsx)(s,{...e,children:(0,t.jsx)(c,{...e})}):c(e)}},28453:(e,s,i)=>{i.d(s,{R:()=>r,x:()=>d});var n=i(96540);const t={},l=n.createContext(t);function r(e){const s=n.useContext(l);return n.useMemo((function(){return"function"==typeof e?e(s):{...s,...e}}),[s,e])}function d(e){let s;return s=e.disableParentContext?"function"==typeof e.components?e.components(t):e.components||t:r(e.components),n.createElement(l.Provider,{value:s},e.children)}}}]);
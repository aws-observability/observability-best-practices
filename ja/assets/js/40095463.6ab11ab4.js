"use strict";(self.webpackChunkobservability_best_practices=self.webpackChunkobservability_best_practices||[]).push([[5456],{59884:(e,n,t)=>{t.r(n),t.d(n,{assets:()=>c,contentTitle:()=>i,default:()=>u,frontMatter:()=>r,metadata:()=>a,toc:()=>o});var s=t(74848),l=t(28453);const r={},i="AWS Rust SDK \u3092\u4f7f\u7528\u3057\u305f\u30ab\u30b9\u30bf\u30e0\u30e1\u30c8\u30ea\u30af\u30b9\u306e\u4f5c\u6210",a={id:"guides/rust-custom-metrics/README",title:"AWS Rust SDK \u3092\u4f7f\u7528\u3057\u305f\u30ab\u30b9\u30bf\u30e0\u30e1\u30c8\u30ea\u30af\u30b9\u306e\u4f5c\u6210",description:"\u306f\u3058\u3081\u306b",source:"@site/i18n/ja/docusaurus-plugin-content-docs/current/guides/rust-custom-metrics/README.md",sourceDirName:"guides/rust-custom-metrics",slug:"/guides/rust-custom-metrics/",permalink:"/observability-best-practices/ja/guides/rust-custom-metrics/",draft:!1,unlisted:!1,editUrl:"https://github.com/aws-observability/observability-best-practices/blob/main/docusaurus/docs/guides/rust-custom-metrics/README.md",tags:[],version:"current",frontMatter:{},sidebar:"guides",previous:{title:"key-performance-indicators",permalink:"/observability-best-practices/ja/guides/operational/business/key-performance-indicators"},next:{title:"Amazon Managed Service for Prometheus \u30a2\u30e9\u30fc\u30c8\u30de\u30cd\u30fc\u30b8\u30e3\u30fc",permalink:"/observability-best-practices/ja/guides/operational/alerting/amp-alertmgr"}},c={},o=[{value:"\u306f\u3058\u3081\u306b",id:"\u306f\u3058\u3081\u306b",level:2},{value:"\u524d\u63d0\u6761\u4ef6",id:"\u524d\u63d0\u6761\u4ef6",level:2},{value:"Rust \u306e\u30a4\u30f3\u30b9\u30c8\u30fc\u30eb",id:"rust-\u306e\u30a4\u30f3\u30b9\u30c8\u30fc\u30eb",level:3},{value:"CloudWatch \u30ed\u30b0\u30b0\u30eb\u30fc\u30d7\u3068\u30ed\u30b0\u30b9\u30c8\u30ea\u30fc\u30e0\u306e\u4f5c\u6210",id:"cloudwatch-\u30ed\u30b0\u30b0\u30eb\u30fc\u30d7\u3068\u30ed\u30b0\u30b9\u30c8\u30ea\u30fc\u30e0\u306e\u4f5c\u6210",level:3},{value:"\u30b3\u30fc\u30c9",id:"\u30b3\u30fc\u30c9",level:2},{value:"\u30a2\u30d7\u30ea\u30b1\u30fc\u30b7\u30e7\u30f3\u306e\u30bb\u30c3\u30c8\u30a2\u30c3\u30d7",id:"\u30a2\u30d7\u30ea\u30b1\u30fc\u30b7\u30e7\u30f3\u306e\u30bb\u30c3\u30c8\u30a2\u30c3\u30d7",level:3},{value:"\u30e1\u30c8\u30ea\u30af\u30b9\u30c7\u30fc\u30bf\u306e\u9001\u4fe1",id:"\u30e1\u30c8\u30ea\u30af\u30b9\u30c7\u30fc\u30bf\u306e\u9001\u4fe1",level:3},{value:"PutLogEvent + \u30e1\u30c8\u30ea\u30af\u30b9\u30d5\u30a3\u30eb\u30bf\u30fc",id:"putlogevent--\u30e1\u30c8\u30ea\u30af\u30b9\u30d5\u30a3\u30eb\u30bf\u30fc",level:3},{value:"PutLogEvent + Embedded Metric Format",id:"putlogevent--embedded-metric-format",level:3},{value:"\u3059\u3079\u3066\u3092\u307e\u3068\u3081\u308b",id:"\u3059\u3079\u3066\u3092\u307e\u3068\u3081\u308b",level:3},{value:"\u30af\u30ea\u30fc\u30f3\u30a2\u30c3\u30d7",id:"\u30af\u30ea\u30fc\u30f3\u30a2\u30c3\u30d7",level:2}];function d(e){const n={a:"a",code:"code",h1:"h1",h2:"h2",h3:"h3",img:"img",li:"li",ol:"ol",p:"p",pre:"pre",...(0,l.R)(),...e.components};return(0,s.jsxs)(s.Fragment,{children:[(0,s.jsx)(n.h1,{id:"aws-rust-sdk-\u3092\u4f7f\u7528\u3057\u305f\u30ab\u30b9\u30bf\u30e0\u30e1\u30c8\u30ea\u30af\u30b9\u306e\u4f5c\u6210",children:"AWS Rust SDK \u3092\u4f7f\u7528\u3057\u305f\u30ab\u30b9\u30bf\u30e0\u30e1\u30c8\u30ea\u30af\u30b9\u306e\u4f5c\u6210"}),"\n",(0,s.jsx)(n.h2,{id:"\u306f\u3058\u3081\u306b",children:"\u306f\u3058\u3081\u306b"}),"\n",(0,s.jsx)(n.p,{children:"Rust \u306f\u3001\u5b89\u5168\u6027\u3001\u30d1\u30d5\u30a9\u30fc\u30de\u30f3\u30b9\u3001\u4e26\u884c\u6027\u306b\u7126\u70b9\u3092\u5f53\u3066\u305f\u30b7\u30b9\u30c6\u30e0\u30d7\u30ed\u30b0\u30e9\u30df\u30f3\u30b0\u8a00\u8a9e\u3067\u3001\u30bd\u30d5\u30c8\u30a6\u30a7\u30a2\u958b\u767a\u306e\u4e16\u754c\u3067\u4eba\u6c17\u3092\u96c6\u3081\u3066\u3044\u307e\u3059\u3002\u30e1\u30e2\u30ea\u7ba1\u7406\u3068\u30b9\u30ec\u30c3\u30c9\u306e\u5b89\u5168\u6027\u306b\u5bfe\u3059\u308b\u30e6\u30cb\u30fc\u30af\u306a\u30a2\u30d7\u30ed\u30fc\u30c1\u306b\u3088\u308a\u3001\u5805\u7262\u3067\u52b9\u7387\u7684\u306a\u30a2\u30d7\u30ea\u30b1\u30fc\u30b7\u30e7\u30f3\u3092\u69cb\u7bc9\u3059\u308b\u305f\u3081\u306e\u9b45\u529b\u7684\u306a\u9078\u629e\u80a2\u3068\u306a\u3063\u3066\u3044\u307e\u3059\u3002\u7279\u306b\u30af\u30e9\u30a6\u30c9\u74b0\u5883\u3067\u306e\u5229\u7528\u306b\u9069\u3057\u3066\u3044\u307e\u3059\u3002\u30b5\u30fc\u30d0\u30fc\u30ec\u30b9\u30a2\u30fc\u30ad\u30c6\u30af\u30c1\u30e3\u306e\u53f0\u982d\u3068\u3001\u9ad8\u6027\u80fd\u3067\u30b9\u30b1\u30fc\u30e9\u30d6\u30eb\u306a\u30b5\u30fc\u30d3\u30b9\u306e\u9700\u8981\u306e\u5897\u52a0\u306b\u4f34\u3044\u3001Rust \u306e\u6a5f\u80fd\u306f\u30af\u30e9\u30a6\u30c9\u30cd\u30a4\u30c6\u30a3\u30d6\u30a2\u30d7\u30ea\u30b1\u30fc\u30b7\u30e7\u30f3\u306e\u69cb\u7bc9\u306b\u6700\u9069\u306a\u9078\u629e\u80a2\u3068\u306a\u3063\u3066\u3044\u307e\u3059\u3002\u3053\u306e\u30ac\u30a4\u30c9\u3067\u306f\u3001AWS Rust SDK \u3092\u6d3b\u7528\u3057\u3066\u30ab\u30b9\u30bf\u30e0 CloudWatch \u30e1\u30c8\u30ea\u30af\u30b9\u3092\u4f5c\u6210\u3059\u308b\u65b9\u6cd5\u3092\u63a2\u308a\u307e\u3059\u3002\u3053\u308c\u306b\u3088\u308a\u3001AWS \u30a8\u30b3\u30b7\u30b9\u30c6\u30e0\u5185\u3067\u306e\u30a2\u30d7\u30ea\u30b1\u30fc\u30b7\u30e7\u30f3\u306e\u30d1\u30d5\u30a9\u30fc\u30de\u30f3\u30b9\u3068\u52d5\u4f5c\u306b\u3064\u3044\u3066\u3088\u308a\u6df1\u3044\u6d1e\u5bdf\u3092\u5f97\u308b\u3053\u3068\u304c\u3067\u304d\u307e\u3059\u3002"}),"\n",(0,s.jsx)(n.h2,{id:"\u524d\u63d0\u6761\u4ef6",children:"\u524d\u63d0\u6761\u4ef6"}),"\n",(0,s.jsx)(n.p,{children:"\u3053\u306e\u30ac\u30a4\u30c9\u3092\u4f7f\u7528\u3059\u308b\u306b\u306f\u3001Rust \u3092\u30a4\u30f3\u30b9\u30c8\u30fc\u30eb\u3057\u3001\u5f8c\u3067\u4f7f\u7528\u3059\u308b\u30c7\u30fc\u30bf\u3092\u4fdd\u5b58\u3059\u308b\u305f\u3081\u306e CloudWatch \u30ed\u30b0\u30b0\u30eb\u30fc\u30d7\u3068\u30ed\u30b0\u30b9\u30c8\u30ea\u30fc\u30e0\u3092\u4f5c\u6210\u3059\u308b\u5fc5\u8981\u304c\u3042\u308a\u307e\u3059\u3002"}),"\n",(0,s.jsx)(n.h3,{id:"rust-\u306e\u30a4\u30f3\u30b9\u30c8\u30fc\u30eb",children:"Rust \u306e\u30a4\u30f3\u30b9\u30c8\u30fc\u30eb"}),"\n",(0,s.jsx)(n.p,{children:"Mac \u307e\u305f\u306f Linux \u306e\u5834\u5408:"}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{children:"curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh\n"})}),"\n",(0,s.jsxs)(n.p,{children:["Windows \u306e\u5834\u5408\u3001",(0,s.jsx)(n.a,{href:"https://static.rust-lang.org/rustup/dist/i686-pc-windows-gnu/rustup-init.exe",children:"rustup-init.exe"})," \u3092\u30c0\u30a6\u30f3\u30ed\u30fc\u30c9\u3057\u3066\u5b9f\u884c\u3057\u3066\u304f\u3060\u3055\u3044\u3002"]}),"\n",(0,s.jsx)(n.h3,{id:"cloudwatch-\u30ed\u30b0\u30b0\u30eb\u30fc\u30d7\u3068\u30ed\u30b0\u30b9\u30c8\u30ea\u30fc\u30e0\u306e\u4f5c\u6210",children:"CloudWatch \u30ed\u30b0\u30b0\u30eb\u30fc\u30d7\u3068\u30ed\u30b0\u30b9\u30c8\u30ea\u30fc\u30e0\u306e\u4f5c\u6210"}),"\n",(0,s.jsxs)(n.ol,{children:["\n",(0,s.jsx)(n.li,{children:"CloudWatch \u30ed\u30b0\u30b0\u30eb\u30fc\u30d7\u3092\u4f5c\u6210\u3057\u307e\u3059\uff1a"}),"\n"]}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{children:"aws logs create-log-group --log-group-name rust_custom\n"})}),"\n",(0,s.jsxs)(n.ol,{start:"2",children:["\n",(0,s.jsx)(n.li,{children:"CloudWatch \u30ed\u30b0\u30b9\u30c8\u30ea\u30fc\u30e0\u3092\u4f5c\u6210\u3057\u307e\u3059\uff1a"}),"\n"]}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{children:"aws logs create-log-stream --log-group-name rust_custom --log-stream-name diceroll_log_stream\n"})}),"\n",(0,s.jsx)(n.h2,{id:"\u30b3\u30fc\u30c9",children:"\u30b3\u30fc\u30c9"}),"\n",(0,s.jsx)(n.p,{children:"\u5b8c\u5168\u306a\u30b3\u30fc\u30c9\u306f\u3001\u3053\u306e\u30ea\u30dd\u30b8\u30c8\u30ea\u306e sandbox \u30bb\u30af\u30b7\u30e7\u30f3\u3067\u898b\u3064\u3051\u308b\u3053\u3068\u304c\u3067\u304d\u307e\u3059\u3002"}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{children:"git clone https://github.com/aws-observability/observability-best-practices.git\ncd observability-best-practices/sandbox/rust-custom-metrics\n"})}),"\n",(0,s.jsx)(n.p,{children:"\u3053\u306e\u30b3\u30fc\u30c9\u306f\u307e\u305a\u3001\u30b5\u30a4\u30b3\u30ed\u3092\u632f\u308b\u30b7\u30df\u30e5\u30ec\u30fc\u30b7\u30e7\u30f3\u3092\u884c\u3044\u307e\u3059\u3002\u3053\u306e\u30b5\u30a4\u30b3\u30ed\u306e\u76ee\u306e\u5024\u3092\u30ab\u30b9\u30bf\u30e0\u30e1\u30c8\u30ea\u30af\u30b9\u3068\u3057\u3066\u6271\u3046\u3053\u3068\u306b\u3057\u307e\u3059\u3002\u305d\u306e\u5f8c\u3001\u3053\u306e\u30e1\u30c8\u30ea\u30af\u30b9\u3092 CloudWatch \u306b\u8ffd\u52a0\u3057\u3001\u30c0\u30c3\u30b7\u30e5\u30dc\u30fc\u30c9\u3067\u8868\u793a\u3059\u308b 3 \u3064\u306e\u7570\u306a\u308b\u65b9\u6cd5\u3092\u793a\u3057\u307e\u3059\u3002"}),"\n",(0,s.jsx)(n.h3,{id:"\u30a2\u30d7\u30ea\u30b1\u30fc\u30b7\u30e7\u30f3\u306e\u30bb\u30c3\u30c8\u30a2\u30c3\u30d7",children:"\u30a2\u30d7\u30ea\u30b1\u30fc\u30b7\u30e7\u30f3\u306e\u30bb\u30c3\u30c8\u30a2\u30c3\u30d7"}),"\n",(0,s.jsx)(n.p,{children:"\u307e\u305a\u3001\u30a2\u30d7\u30ea\u30b1\u30fc\u30b7\u30e7\u30f3\u3067\u4f7f\u7528\u3059\u308b\u3044\u304f\u3064\u304b\u306e\u30af\u30ec\u30fc\u30c8\u3092\u30a4\u30f3\u30dd\u30fc\u30c8\u3059\u308b\u5fc5\u8981\u304c\u3042\u308a\u307e\u3059\u3002"}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-rust",children:"use crate::cloudwatch::types::Dimension;\nuse crate::cloudwatchlogs::types::InputLogEvent;\nuse aws_sdk_cloudwatch as cloudwatch;\nuse aws_sdk_cloudwatch::config::BehaviorVersion;\nuse aws_sdk_cloudwatch::types::MetricDatum;\nuse aws_sdk_cloudwatchlogs as cloudwatchlogs;\nuse rand::prelude::*;\nuse serde::Serialize;\nuse serde_json::json;\nuse std::time::{SystemTime, UNIX_EPOCH};\n"})}),"\n",(0,s.jsx)(n.p,{children:"\u3053\u306e\u30a4\u30f3\u30dd\u30fc\u30c8\u30d6\u30ed\u30c3\u30af\u3067\u306f\u3001\u4e3b\u306b\u4f7f\u7528\u3059\u308b AWS SDK \u30e9\u30a4\u30d6\u30e9\u30ea\u3092\u30a4\u30f3\u30dd\u30fc\u30c8\u3057\u3066\u3044\u307e\u3059\u3002\u307e\u305f\u3001\u30e9\u30f3\u30c0\u30e0\u306a\u30b5\u30a4\u30b3\u30ed\u306e\u5024\u3092\u4f5c\u6210\u3059\u308b\u305f\u3081\u306b 'rand' \u30af\u30ec\u30fc\u30c8\u3082\u5c0e\u5165\u3057\u3066\u3044\u307e\u3059\u3002\u6700\u5f8c\u306b\u3001SDK \u547c\u3073\u51fa\u3057\u306b\u4f7f\u7528\u3059\u308b\u30c7\u30fc\u30bf\u4f5c\u6210\u3092\u51e6\u7406\u3059\u308b\u305f\u3081\u306b\u3001'serde' \u3084 'time' \u306a\u3069\u306e\u3044\u304f\u3064\u304b\u306e\u30e9\u30a4\u30d6\u30e9\u30ea\u304c\u3042\u308a\u307e\u3059\u3002"}),"\n",(0,s.jsx)(n.p,{children:"\u6b21\u306b\u3001main \u95a2\u6570\u3067\u30b5\u30a4\u30b3\u30ed\u306e\u5024\u3092\u4f5c\u6210\u3067\u304d\u307e\u3059\u3002\u3053\u306e\u5024\u306f\u30013 \u3064\u306e AWS SDK \u547c\u3073\u51fa\u3057\u3059\u3079\u3066\u3067\u4f7f\u7528\u3055\u308c\u307e\u3059\u3002"}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-rust",children:"//1\u304b\u30896\u306e\u30e9\u30f3\u30c0\u30e0\u306a\u6570\u5b57\u3092\u9078\u629e\u3057\u3066\u30b5\u30a4\u30b3\u30ed\u306e\u76ee\u3092\u8868\u3059\nlet mut rng = rand::thread_rng();\nlet roll_value = rng.gen_range(1..7);\n"})}),"\n",(0,s.jsx)(n.p,{children:"\u30b5\u30a4\u30b3\u30ed\u306e\u6570\u5024\u304c\u5f97\u3089\u308c\u305f\u306e\u3067\u3001\u3053\u306e\u5024\u3092 CloudWatch \u306b\u30ab\u30b9\u30bf\u30e0\u30e1\u30c8\u30ea\u30af\u30b9\u3068\u3057\u3066\u8ffd\u52a0\u3059\u308b 3 \u3064\u306e\u7570\u306a\u308b\u65b9\u6cd5\u3092\u63a2\u3063\u3066\u307f\u307e\u3057\u3087\u3046\u3002\u5024\u304c\u30ab\u30b9\u30bf\u30e0\u30e1\u30c8\u30ea\u30af\u30b9\u306b\u306a\u308b\u3068\u3001\u305d\u306e\u5024\u306b\u30a2\u30e9\u30fc\u30e0\u3092\u8a2d\u5b9a\u3057\u305f\u308a\u3001\u7570\u5e38\u691c\u51fa\u3092\u8a2d\u5b9a\u3057\u305f\u308a\u3001\u30c0\u30c3\u30b7\u30e5\u30dc\u30fc\u30c9\u306b\u30d7\u30ed\u30c3\u30c8\u3057\u305f\u308a\u3059\u308b\u306a\u3069\u3001\u3055\u307e\u3056\u307e\u306a\u3053\u3068\u304c\u3067\u304d\u308b\u3088\u3046\u306b\u306a\u308a\u307e\u3059\u3002"}),"\n",(0,s.jsx)(n.h3,{id:"\u30e1\u30c8\u30ea\u30af\u30b9\u30c7\u30fc\u30bf\u306e\u9001\u4fe1",children:"\u30e1\u30c8\u30ea\u30af\u30b9\u30c7\u30fc\u30bf\u306e\u9001\u4fe1"}),"\n",(0,s.jsx)(n.p,{children:"CloudWatch \u306b\u5024\u3092\u8ffd\u52a0\u3059\u308b\u6700\u521d\u306e\u65b9\u6cd5\u306f PutMetricData \u3067\u3059\u3002PutMetricData \u3092\u4f7f\u7528\u3059\u308b\u3068\u3001\u30e1\u30c8\u30ea\u30af\u30b9\u306e\u6642\u7cfb\u5217\u306e\u5024\u3092\u76f4\u63a5 CloudWatch \u306b\u66f8\u304d\u8fbc\u307f\u307e\u3059\u3002\u3053\u308c\u306f\u5024\u3092\u8ffd\u52a0\u3059\u308b\u6700\u3082\u52b9\u7387\u7684\u306a\u65b9\u6cd5\u3067\u3059\u3002PutMetricData \u3092\u4f7f\u7528\u3059\u308b\u969b\u306f\u3001\u540d\u524d\u7a7a\u9593\u3068\u30e1\u30c8\u30ea\u30af\u30b9\u5024\u306b\u52a0\u3048\u3066\u3001\u5404 AWS SDK \u547c\u3073\u51fa\u3057\u306b\u30c7\u30a3\u30e1\u30f3\u30b7\u30e7\u30f3\u3092\u63d0\u4f9b\u3059\u308b\u5fc5\u8981\u304c\u3042\u308a\u307e\u3059\u3002\u4ee5\u4e0b\u304c\u30b3\u30fc\u30c9\u3067\u3059\uff1a"}),"\n",(0,s.jsxs)(n.p,{children:["\u307e\u305a\u3001\u30e1\u30c8\u30ea\u30af\u30b9\uff08\u30b5\u30a4\u30b3\u30ed\u306e\u5024\uff09\u3092\u53d7\u3051\u53d6\u308a\u3001Result \u578b\u3092\u8fd4\u3059\u95a2\u6570\u3092\u8a2d\u5b9a\u3057\u307e\u3059\u3002Rust \u3067\u306f Result \u578b\u306f\u6210\u529f\u307e\u305f\u306f\u5931\u6557\u3092\u793a\u3057\u307e\u3059\u3002\u95a2\u6570\u5185\u3067\u6700\u521d\u306b\u884c\u3046\u306e\u306f\u3001AWS Rust SDK \u30af\u30e9\u30a4\u30a2\u30f3\u30c8\u306e\u521d\u671f\u5316\u3067\u3059\u3002\u30af\u30e9\u30a4\u30a2\u30f3\u30c8\u306f\u30ed\u30fc\u30ab\u30eb\u74b0\u5883\u304b\u3089\u8a8d\u8a3c\u60c5\u5831\u3068\u30ea\u30fc\u30b8\u30e7\u30f3\u3092\u7d99\u627f\u3057\u307e\u3059\u3002\u3053\u306e\u30b3\u30fc\u30c9\u3092\u5b9f\u884c\u3059\u308b\u524d\u306b\u3001\u30b3\u30de\u30f3\u30c9\u30e9\u30a4\u30f3\u304b\u3089 ",(0,s.jsx)(n.code,{children:"aws configure"})," \u3092\u5b9f\u884c\u3057\u3066\u3001\u3053\u308c\u3089\u304c\u8a2d\u5b9a\u3055\u308c\u3066\u3044\u308b\u3053\u3068\u3092\u78ba\u8a8d\u3057\u3066\u304f\u3060\u3055\u3044\u3002"]}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-rust",children:"async fn put_metric_data(roll_value: i32) -> Result<(), cloudwatch::Error> {\n    //\u30af\u30e9\u30a4\u30a2\u30f3\u30c8\u306b\u6e21\u305b\u308b\u518d\u5229\u7528\u53ef\u80fd\u306a aws \u8a2d\u5b9a\u3092\u4f5c\u6210\n    let config = aws_config::load_defaults(BehaviorVersion::v2023_11_09()).await;\n\n    //CloudWatch \u30af\u30e9\u30a4\u30a2\u30f3\u30c8\u3092\u4f5c\u6210\n    let client = cloudwatch::Client::new(&config);\n"})}),"\n",(0,s.jsx)(n.p,{children:"\u30af\u30e9\u30a4\u30a2\u30f3\u30c8\u306e\u521d\u671f\u5316\u5f8c\u3001PutMetricData API \u547c\u3073\u51fa\u3057\u306b\u5fc5\u8981\u306a\u5165\u529b\u306e\u8a2d\u5b9a\u3092\u958b\u59cb\u3067\u304d\u307e\u3059\u3002\u30c7\u30a3\u30e1\u30f3\u30b7\u30e7\u30f3\u3092\u5b9a\u7fa9\u3057\u3001\u6b21\u306b\u30c7\u30a3\u30e1\u30f3\u30b7\u30e7\u30f3\u3068\u5024\u306e\u7d44\u307f\u5408\u308f\u305b\u3067\u3042\u308b MetricDatum \u81ea\u4f53\u3092\u5b9a\u7fa9\u3059\u308b\u5fc5\u8981\u304c\u3042\u308a\u307e\u3059\u3002"}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-rust",children:'//\u6d41\u66a2\u306a\u30d3\u30eb\u30c0\u30fc\u3092\u4f7f\u7528\u3057\u3066 pmd \u547c\u3073\u51fa\u3057\u306b\u5fc5\u8981\u306a\u5165\u529b\u3092\u69cb\u7bc9\u3001\u30c7\u30a3\u30e1\u30f3\u30b7\u30e7\u30f3\u304b\u3089\u59cb\u3081\u307e\u3059\u3002\nlet dimensions = Dimension::builder()\n    .name("roll_value_pmd_dimension")\n    .value(roll_value.to_string())\n    .build();\n\nlet put_metric_data_input = MetricDatum::builder()\n    .metric_name("roll_value_pmd")\n    .dimensions(dimensions)\n    .value(f64::from(roll_value))\n    .build();\n'})}),"\n",(0,s.jsx)(n.p,{children:"\u6700\u5f8c\u306b\u3001\u5148\u307b\u3069\u5b9a\u7fa9\u3057\u305f\u5165\u529b\u3092\u4f7f\u7528\u3057\u3066 PutMetricData API \u547c\u3073\u51fa\u3057\u3092\u884c\u3044\u307e\u3059\u3002"}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-rust",children:'let response = client\n    .put_metric_data()\n    .namespace("rust_custom_metrics")\n    .metric_data(put_metric_data_input)\n    .send()\n    .await?;\nprintln!("\u30e1\u30c8\u30ea\u30af\u30b9\u304c\u9001\u4fe1\u3055\u308c\u307e\u3057\u305f: {:?}", response);\nOk(())\n'})}),"\n",(0,s.jsxs)(n.p,{children:["SDK \u547c\u3073\u51fa\u3057\u304c\u975e\u540c\u671f\u95a2\u6570\u5185\u306b\u3042\u308b\u3053\u3068\u306b\u6ce8\u610f\u3057\u3066\u304f\u3060\u3055\u3044\u3002\u95a2\u6570\u304c\u975e\u540c\u671f\u3067\u5b8c\u4e86\u3059\u308b\u305f\u3081\u3001\u305d\u306e\u5b8c\u4e86\u3092 ",(0,s.jsx)(n.code,{children:"await"})," \u3059\u308b\u5fc5\u8981\u304c\u3042\u308a\u307e\u3059\u3002\u305d\u3057\u3066\u3001\u95a2\u6570\u306e\u6700\u4e0a\u4f4d\u3067\u5b9a\u7fa9\u3055\u308c\u305f Result \u578b\u3092\u8fd4\u3057\u307e\u3059\u3002"]}),"\n",(0,s.jsx)(n.p,{children:"main \u304b\u3089\u95a2\u6570\u3092\u547c\u3073\u51fa\u3059\u6642\u306f\u3001\u4ee5\u4e0b\u306e\u3088\u3046\u306b\u306a\u308a\u307e\u3059\uff1a"}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-rust",children:'//put_metric_data \u95a2\u6570\u3092\u30ed\u30fc\u30eb\u5024\u3067\u547c\u3073\u51fa\u3059\nprintln!("\u307e\u305a\u3001PutMetricData API \u547c\u3073\u51fa\u3057\u3067\u30ab\u30b9\u30bf\u30e0\u30e1\u30c8\u30ea\u30af\u30b9\u3092\u66f8\u304d\u8fbc\u307f\u307e\u3059");\nput_metric_data(roll_value).await.unwrap();\n'})}),"\n",(0,s.jsxs)(n.p,{children:["\u3053\u3053\u3067\u3082\u95a2\u6570\u547c\u3073\u51fa\u3057\u306e\u5b8c\u4e86\u3092\u5f85\u3061\u3001\u5024\u3092 ",(0,s.jsx)(n.code,{children:"unwrap"})," \u3057\u3066\u3044\u307e\u3059\u3002\u3053\u306e\u5834\u5408\u3001\u30a8\u30e9\u30fc\u3067\u306f\u306a\u304f 'Ok' \u306e\u7d50\u679c\u306b\u306e\u307f\u8208\u5473\u304c\u3042\u308b\u305f\u3081\u3067\u3059\u3002\u672c\u756a\u30b7\u30ca\u30ea\u30aa\u3067\u306f\u3001\u304a\u305d\u3089\u304f\u7570\u306a\u308b\u65b9\u6cd5\u3067\u30a8\u30e9\u30fc\u51e6\u7406\u3092\u884c\u3046\u3067\u3057\u3087\u3046\u3002"]}),"\n",(0,s.jsx)(n.h3,{id:"putlogevent--\u30e1\u30c8\u30ea\u30af\u30b9\u30d5\u30a3\u30eb\u30bf\u30fc",children:"PutLogEvent + \u30e1\u30c8\u30ea\u30af\u30b9\u30d5\u30a3\u30eb\u30bf\u30fc"}),"\n",(0,s.jsxs)(n.p,{children:["\u30ab\u30b9\u30bf\u30e0\u30e1\u30c8\u30ea\u30af\u30b9\u3092\u4f5c\u6210\u3059\u308b\u6b21\u306e\u65b9\u6cd5\u306f\u3001\u5358\u7d14\u306b CloudWatch \u30ed\u30b0\u30b0\u30eb\u30fc\u30d7\u306b\u66f8\u304d\u8fbc\u3080\u3053\u3068\u3067\u3059\u3002\u30e1\u30c8\u30ea\u30af\u30b9\u304c CloudWatch \u30ed\u30b0\u30b0\u30eb\u30fc\u30d7\u306b\u5165\u3063\u305f\u3089\u3001",(0,s.jsx)(n.a,{href:"https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/logs/MonitoringPolicyExamples.html",children:"\u30e1\u30c8\u30ea\u30af\u30b9\u30d5\u30a3\u30eb\u30bf\u30fc"})," \u3092\u4f7f\u7528\u3057\u3066\u30ed\u30b0\u30c7\u30fc\u30bf\u304b\u3089\u30e1\u30c8\u30ea\u30af\u30b9\u30c7\u30fc\u30bf\u3092\u62bd\u51fa\u3067\u304d\u307e\u3059\u3002"]}),"\n",(0,s.jsx)(n.p,{children:"\u307e\u305a\u3001\u30ed\u30b0\u30e1\u30c3\u30bb\u30fc\u30b8\u7528\u306e\u69cb\u9020\u4f53\u3092\u5b9a\u7fa9\u3057\u307e\u3059\u3002\u3053\u308c\u306f\u30aa\u30d7\u30b7\u30e7\u30f3\u3067\u3001\u624b\u52d5\u3067 JSON \u3092\u69cb\u7bc9\u3059\u308b\u3053\u3068\u3082\u3067\u304d\u307e\u3059\u3002\u3057\u304b\u3057\u3001\u3088\u308a\u8907\u96d1\u306a\u30a2\u30d7\u30ea\u30b1\u30fc\u30b7\u30e7\u30f3\u3067\u306f\u3001\u518d\u5229\u7528\u6027\u306e\u305f\u3081\u306b\u3053\u306e\u3088\u3046\u306a\u30ed\u30b0\u69cb\u9020\u4f53\u304c\u5fc5\u8981\u306b\u306a\u308b\u53ef\u80fd\u6027\u304c\u9ad8\u3044\u3067\u3057\u3087\u3046\u3002"}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-rust",children:"// \u30ed\u30b0\u30e1\u30c3\u30bb\u30fc\u30b8\u7528\u306e\u5358\u7d14\u306a\u69cb\u9020\u4f53\u3092\u4f5c\u6210\u3057\u307e\u3059\u3002\u624b\u52d5\u3067 JSON \u6587\u5b57\u5217\u3092\u4f5c\u6210\u3059\u308b\u3053\u3068\u3082\u3067\u304d\u307e\u3059\u3002\n\n\n\n#[derive(Serialize)]\nstruct DicerollValue {\n    welcome_message: String,\n    roll_value: i32,\n}\n"})}),"\n",(0,s.jsx)(n.p,{children:"\u69cb\u9020\u4f53\u3092\u5b9a\u7fa9\u3057\u305f\u3089\u3001AWS API \u547c\u3073\u51fa\u3057\u306e\u6e96\u5099\u304c\u6574\u3044\u307e\u3059\u3002\u4eca\u56de\u3082 API \u30af\u30e9\u30a4\u30a2\u30f3\u30c8\u3092\u4f5c\u6210\u3057\u307e\u3059\u304c\u3001\u4eca\u56de\u306f logs SDK \u3092\u4f7f\u7528\u3057\u307e\u3059\u3002\u307e\u305f\u3001Unix \u30a8\u30dd\u30c3\u30af\u30bf\u30a4\u30df\u30f3\u30b0\u3092\u4f7f\u7528\u3057\u3066\u30b7\u30b9\u30c6\u30e0\u6642\u9593\u3092\u5b9a\u7fa9\u3057\u307e\u3059\u3002"}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-rust",children:"// \u518d\u5229\u7528\u53ef\u80fd\u306a AWS \u8a2d\u5b9a\u3092\u4f5c\u6210\u3057\u3001\u30af\u30e9\u30a4\u30a2\u30f3\u30c8\u306b\u6e21\u3057\u307e\u3059\nlet config = aws_config::load_defaults(BehaviorVersion::v2023_11_09()).await;\n\n// CloudWatch Logs \u30af\u30e9\u30a4\u30a2\u30f3\u30c8\u3092\u4f5c\u6210\u3057\u307e\u3059\nlet client = cloudwatchlogs::Client::new(&config);\n\n// Unix \u30a8\u30dd\u30c3\u30af\u304b\u3089\u306e\u6642\u9593\u3092\u30df\u30ea\u79d2\u5358\u4f4d\u3067\u53d6\u5f97\u3057\u307e\u3059\u3002\u3053\u308c\u306f CloudWatch Logs \u306b\u5fc5\u8981\u3067\u3059\nlet time_now = SystemTime::now()\n    .duration_since(UNIX_EPOCH)\n    .unwrap()\n    .as_millis() as i64;\n"})}),"\n",(0,s.jsx)(n.p,{children:"\u307e\u305a\u3001\u5148\u307b\u3069\u5b9a\u7fa9\u3057\u305f\u69cb\u9020\u4f53\u306e\u65b0\u3057\u3044\u30a4\u30f3\u30b9\u30bf\u30f3\u30b9\u304b\u3089 JSON \u3092\u4f5c\u6210\u3057\u307e\u3059\u3002\u6b21\u306b\u3001\u3053\u308c\u3092\u4f7f\u7528\u3057\u3066\u30ed\u30b0\u30a4\u30d9\u30f3\u30c8\u3092\u4f5c\u6210\u3057\u307e\u3059\u3002"}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-rust",children:'let log_json = json!(DicerollValue {\n    welcome_message: String::from("Hello from rust!"),\n    roll_value\n});\n\nlet log_event = InputLogEvent::builder()\n    .timestamp(time_now)\n    .message(log_json.to_string())\n    .build();\n'})}),"\n",(0,s.jsx)(n.p,{children:"\u3053\u308c\u3067\u3001PutMetricData \u3067\u884c\u3063\u305f\u306e\u3068\u540c\u69d8\u306e\u65b9\u6cd5\u3067 API \u547c\u3073\u51fa\u3057\u3092\u5b8c\u4e86\u3067\u304d\u307e\u3059\u3002"}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-rust",children:'let response = client\n    .put_log_events()\n    .log_group_name("rust_custom")\n    .log_stream_name("diceroll_log_stream")\n    .log_events(log_event.unwrap())\n    .send()\n    .await?;\n\nprintln!("Log event submitted: {:?}", response);\nOk(())\n'})}),"\n",(0,s.jsx)(n.p,{children:"\u30ed\u30b0\u30a4\u30d9\u30f3\u30c8\u304c\u9001\u4fe1\u3055\u308c\u305f\u3089\u3001CloudWatch \u306b\u79fb\u52d5\u3057\u3001\u30ed\u30b0\u30b0\u30eb\u30fc\u30d7\u306e\u30e1\u30c8\u30ea\u30af\u30b9\u30d5\u30a3\u30eb\u30bf\u30fc\u3092\u4f5c\u6210\u3057\u3066\u30e1\u30c8\u30ea\u30af\u30b9\u3092\u9069\u5207\u306b\u62bd\u51fa\u3059\u308b\u5fc5\u8981\u304c\u3042\u308a\u307e\u3059\u3002"}),"\n",(0,s.jsxs)(n.p,{children:["CloudWatch \u30b3\u30f3\u30bd\u30fc\u30eb\u3067\u3001\u4f5c\u6210\u3057\u305f rust_custom \u30ed\u30b0\u30b0\u30eb\u30fc\u30d7\u306b\u79fb\u52d5\u3057\u307e\u3059\u3002\u6b21\u306b\u3001\u30e1\u30c8\u30ea\u30af\u30b9\u30d5\u30a3\u30eb\u30bf\u30fc\u3092\u4f5c\u6210\u3057\u307e\u3059\u3002\u30d5\u30a3\u30eb\u30bf\u30fc\u30d1\u30bf\u30fc\u30f3\u306f ",(0,s.jsx)(n.code,{children:"{$.roll_value = *}"})," \u3068\u3057\u307e\u3059\u3002\u6b21\u306b\u3001\u30e1\u30c8\u30ea\u30af\u30b9\u5024\u306b\u306f ",(0,s.jsx)(n.code,{children:"$.roll_value"})," \u3092\u4f7f\u7528\u3057\u307e\u3059\u3002\u540d\u524d\u7a7a\u9593\u3068\u30e1\u30c8\u30ea\u30af\u30b9\u540d\u306f\u4efb\u610f\u306e\u3082\u306e\u3092\u4f7f\u7528\u3067\u304d\u307e\u3059\u3002\u3053\u306e\u30e1\u30c8\u30ea\u30af\u30b9\u30d5\u30a3\u30eb\u30bf\u30fc\u306f\u6b21\u306e\u3088\u3046\u306b\u8aac\u660e\u3067\u304d\u307e\u3059\uff1a"]}),"\n",(0,s.jsx)(n.p,{children:"\u300c'roll_value' \u3068\u3044\u3046\u30d5\u30a3\u30fc\u30eb\u30c9\u3092\u53d7\u3051\u53d6\u308b\u305f\u3073\u306b\u3001\u5024\u306b\u95a2\u4fc2\u306a\u304f\u30d5\u30a3\u30eb\u30bf\u30fc\u3092\u30c8\u30ea\u30ac\u30fc\u3057\u307e\u3059\u3002\u30c8\u30ea\u30ac\u30fc\u3055\u308c\u305f\u3089\u3001'roll_value' \u3092 CloudWatch Metrics \u306b\u66f8\u304d\u8fbc\u3080\u6570\u5024\u3068\u3057\u3066\u4f7f\u7528\u3057\u307e\u3059\u3002\u300d"}),"\n",(0,s.jsx)(n.p,{children:"\u3053\u306e\u65b9\u6cd5\u3067\u30e1\u30c8\u30ea\u30af\u30b9\u3092\u4f5c\u6210\u3059\u308b\u3053\u3068\u306f\u3001\u30ed\u30b0\u5f62\u5f0f\u3092\u5236\u5fa1\u3067\u304d\u306a\u3044\u5834\u5408\u306b\u30ed\u30b0\u30c7\u30fc\u30bf\u304b\u3089\u6642\u7cfb\u5217\u306e\u5024\u3092\u62bd\u51fa\u3059\u308b\u306e\u306b\u975e\u5e38\u306b\u5f37\u529b\u3067\u3059\u3002\u79c1\u305f\u3061\u306f\u76f4\u63a5\u30b3\u30fc\u30c9\u3092\u8a08\u88c5\u3057\u3066\u3044\u308b\u305f\u3081\u3001\u30ed\u30b0\u30c7\u30fc\u30bf\u306e\u5f62\u5f0f\u3092\u5236\u5fa1\u3067\u304d\u307e\u3059\u3002\u3057\u305f\u304c\u3063\u3066\u3001\u3088\u308a\u826f\u3044\u65b9\u6cd5\u306f CloudWatch \u7d44\u307f\u8fbc\u307f\u30e1\u30c8\u30ea\u30af\u30b9\u5f62\u5f0f\u3092\u4f7f\u7528\u3059\u308b\u3053\u3068\u304b\u3082\u3057\u308c\u307e\u305b\u3093\u3002\u3053\u308c\u306b\u3064\u3044\u3066\u306f\u6b21\u306e\u30b9\u30c6\u30c3\u30d7\u3067\u8aac\u660e\u3057\u307e\u3059\u3002"}),"\n",(0,s.jsx)(n.h3,{id:"putlogevent--embedded-metric-format",children:"PutLogEvent + Embedded Metric Format"}),"\n",(0,s.jsxs)(n.p,{children:["CloudWatch \u306e ",(0,s.jsx)(n.a,{href:"https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/CloudWatch_Embedded_Metric_Format_Specification.html",children:"Embedded Metric Format"}),"\uff08EMF\uff09\u306f\u3001\u6642\u7cfb\u5217\u30e1\u30c8\u30ea\u30af\u30b9\u3092\u30ed\u30b0\u306b\u76f4\u63a5\u57cb\u3081\u8fbc\u3080\u65b9\u6cd5\u3067\u3059\u3002\nCloudWatch \u306f\u3001\u30e1\u30c8\u30ea\u30af\u30b9\u30d5\u30a3\u30eb\u30bf\u30fc\u3092\u4f7f\u7528\u305b\u305a\u306b\u30e1\u30c8\u30ea\u30af\u30b9\u3092\u62bd\u51fa\u3057\u307e\u3059\u3002\n\u30b3\u30fc\u30c9\u3092\u898b\u3066\u307f\u307e\u3057\u3087\u3046\u3002"]}),"\n",(0,s.jsx)(n.p,{children:"\u307e\u305a\u3001\u30ed\u30b0\u30af\u30e9\u30a4\u30a2\u30f3\u30c8\u3092\u518d\u5ea6\u4f5c\u6210\u3057\u3001Unix \u30a8\u30dd\u30c3\u30af\u3067\u306e\u30b7\u30b9\u30c6\u30e0\u6642\u9593\u3092\u53d6\u5f97\u3057\u307e\u3059\u3002"}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-rust",children:"//Create a reusable aws config that we can pass to our clients\nlet config = aws_config::load_defaults(BehaviorVersion::v2023_11_09()).await;\n\n//Create a cloudwatch logs client\nlet client = cloudwatchlogs::Client::new(&config);\n\n//get the time in unix epoch ms\nlet time_now = SystemTime::now()\n    .duration_since(UNIX_EPOCH)\n    .unwrap()\n    .as_millis() as i64;\n"})}),"\n",(0,s.jsx)(n.p,{children:"\u6b21\u306b\u3001EMF \u306e JSON \u6587\u5b57\u5217\u3092\u4f5c\u6210\u3057\u307e\u3059\u3002\n\u3053\u308c\u306b\u306f\u3001CloudWatch \u304c\u30ab\u30b9\u30bf\u30e0\u30e1\u30c8\u30ea\u30af\u30b9\u3092\u4f5c\u6210\u3059\u308b\u305f\u3081\u306b\u5fc5\u8981\u306a\u3059\u3079\u3066\u306e\u30c7\u30fc\u30bf\u304c\u542b\u307e\u308c\u3066\u3044\u308b\u5fc5\u8981\u304c\u3042\u308b\u305f\u3081\u3001\u540d\u524d\u7a7a\u9593\u3001\u30c7\u30a3\u30e1\u30f3\u30b7\u30e7\u30f3\u3001\u5024\u3092\u6587\u5b57\u5217\u306b\u57cb\u3081\u8fbc\u307f\u307e\u3059\u3002"}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-rust",children:'//Create a json string in embedded metric format with our diceroll value.\nlet json_emf = json!(\n    {\n        "_aws": {\n        "Timestamp": time_now,\n        "CloudWatchMetrics": [\n            {\n            "Namespace": "rust_custom_metrics",\n            "Dimensions": [["roll_value_emf_dimension"]],\n            "Metrics": [\n                {\n                "Name": "roll_value_emf"\n                }\n            ]\n            }\n        ]\n        },\n        "roll_value_emf_dimension": roll_value.to_string(),\n        "roll_value_emf": roll_value\n    }\n);\n'})}),"\n",(0,s.jsx)(n.p,{children:"\u3053\u3053\u3067\u3001\u30ed\u30fc\u30eb\u5024\u3092\u5024\u3068\u3057\u3066\u4f7f\u7528\u3059\u308b\u3060\u3051\u3067\u306a\u304f\u3001\u30c7\u30a3\u30e1\u30f3\u30b7\u30e7\u30f3\u3068\u3057\u3066\u3082\u4f5c\u6210\u3057\u3066\u3044\u308b\u3053\u3068\u306b\u6ce8\u76ee\u3057\u3066\u304f\u3060\u3055\u3044\u3002\n\u3053\u308c\u306b\u3088\u308a\u3001\u30ed\u30fc\u30eb\u5024\u3067 GroupBy \u3092\u5b9f\u884c\u3057\u3001\u5404\u30ed\u30fc\u30eb\u5024\u304c\u4f55\u56de\u51fa\u305f\u304b\u3092\u78ba\u8a8d\u3067\u304d\u307e\u3059\u3002"}),"\n",(0,s.jsx)(n.p,{children:"\u3053\u308c\u3067\u3001\u4ee5\u524d\u3068\u540c\u3058\u3088\u3046\u306b API \u547c\u3073\u51fa\u3057\u3092\u884c\u3063\u3066\u30ed\u30b0\u30a4\u30d9\u30f3\u30c8\u3092\u66f8\u304d\u8fbc\u3080\u3053\u3068\u304c\u3067\u304d\u307e\u3059\uff1a"}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-rust",children:'let log_event = InputLogEvent::builder()\n    .timestamp(time_now)\n    .message(json_emf.to_string())\n    .build();\n\nlet response = client\n    .put_log_events()\n    .log_group_name("rust_custom")\n    .log_stream_name("diceroll_log_stream_emf")\n    .log_events(log_event.unwrap())\n    .send()\n    .await?;\n\nprintln!("EMF Log event submitted: {:?}", response);\nOk(())\n'})}),"\n",(0,s.jsx)(n.p,{children:"\u30ed\u30b0\u30a4\u30d9\u30f3\u30c8\u304c CloudWatch \u306b\u9001\u4fe1\u3055\u308c\u308b\u3068\u3001\u30e1\u30c8\u30ea\u30af\u30b9\u30d5\u30a3\u30eb\u30bf\u30fc\u3092\u4f7f\u7528\u305b\u305a\u306b\u30e1\u30c8\u30ea\u30af\u30b9\u304c\u62bd\u51fa\u3055\u308c\u307e\u3059\u3002\n\u3053\u308c\u306f\u3001\u9ad8\u30ab\u30fc\u30c7\u30a3\u30ca\u30ea\u30c6\u30a3\u306e\u30e1\u30c8\u30ea\u30af\u30b9\u3092\u4f5c\u6210\u3059\u308b\u512a\u308c\u305f\u65b9\u6cd5\u3067\u3001\u3059\u3079\u3066\u306e\u7570\u306a\u308b\u30c7\u30a3\u30e1\u30f3\u30b7\u30e7\u30f3\u3092\u6301\u3064 PutMetricData API \u547c\u3073\u51fa\u3057\u3092\u884c\u3046\u3088\u308a\u3082\u3001\u3053\u308c\u3089\u306e\u5024\u3092\u30ed\u30b0\u30e1\u30c3\u30bb\u30fc\u30b8\u3068\u3057\u3066\u66f8\u304d\u8fbc\u3080\u65b9\u304c\u7c21\u5358\u306a\u5834\u5408\u304c\u3042\u308a\u307e\u3059\u3002"}),"\n",(0,s.jsx)(n.h3,{id:"\u3059\u3079\u3066\u3092\u307e\u3068\u3081\u308b",children:"\u3059\u3079\u3066\u3092\u307e\u3068\u3081\u308b"}),"\n",(0,s.jsx)(n.p,{children:"\u6700\u7d42\u7684\u306a main \u95a2\u6570\u306f\u3001\u4ee5\u4e0b\u306e\u3088\u3046\u306b 3 \u3064\u306e API \u547c\u3073\u51fa\u3057\u3092\u884c\u3044\u307e\u3059\u3002"}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-rust",children:'\n\n\n#[::tokio::main]\nasync fn main() {\n    println!("Rust SDK \u3092\u4f7f\u7528\u3057\u3066\u30ab\u30b9\u30bf\u30e0\u30e1\u30c8\u30ea\u30af\u30b9\u3092\u4f5c\u6210\u3057\u3066\u697d\u3057\u307f\u307e\u3057\u3087\u3046");\n\n    //1-6 \u306e\u30e9\u30f3\u30c0\u30e0\u306a\u6570\u5b57\u3092\u9078\u629e\u3057\u3066\u30b5\u30a4\u30b3\u30ed\u306e\u51fa\u76ee\u3092\u8868\u73fe\u3057\u307e\u3059\n    let mut rng = rand::thread_rng();\n    let roll_value = rng.gen_range(1..7);\n\n    //roll_value \u3092\u4f7f\u7528\u3057\u3066 put_metric_data \u95a2\u6570\u3092\u547c\u3073\u51fa\u3057\u307e\u3059\n    println!("\u307e\u305a\u3001PutMetricData API \u547c\u3073\u51fa\u3057\u3067\u30ab\u30b9\u30bf\u30e0\u30e1\u30c8\u30ea\u30af\u30b9\u3092\u66f8\u304d\u8fbc\u307f\u307e\u3059");\n    put_metric_data(roll_value).await.unwrap();\n\n    println!("\u6b21\u306b\u3001\u30ed\u30b0\u30a4\u30d9\u30f3\u30c8\u3092\u66f8\u304d\u8fbc\u307f\u3001\u305d\u3053\u304b\u3089\u30ab\u30b9\u30bf\u30e0\u30e1\u30c8\u30ea\u30af\u30b9\u3092\u62bd\u51fa\u3057\u307e\u3059\u3002");\n    //roll_value \u3092\u4f7f\u7528\u3057\u3066 put_log_data \u95a2\u6570\u3092\u547c\u3073\u51fa\u3057\u307e\u3059\n    put_log_event(roll_value).await.unwrap();\n\n    //roll_value \u3092\u4f7f\u7528\u3057\u3066 put_log_emf \u95a2\u6570\u3092\u547c\u3073\u51fa\u3057\u307e\u3059\n    println!("\u6b21\u306b\u3001\u57cb\u3081\u8fbc\u307f\u30e1\u30c8\u30ea\u30af\u30b9\u5f62\u5f0f\u306e\u30ed\u30b0\u30a4\u30d9\u30f3\u30c8\u3092\u914d\u7f6e\u3057\u3066\u3001\u30ab\u30b9\u30bf\u30e0\u30e1\u30c8\u30ea\u30af\u30b9\u3092\u76f4\u63a5\u9001\u4fe1\u3057\u307e\u3059\u3002");\n    put_log_event_emf(roll_value).await.unwrap();\n}\n'})}),"\n",(0,s.jsx)(n.p,{children:"\u30c6\u30b9\u30c8\u30c7\u30fc\u30bf\u3092\u751f\u6210\u3059\u308b\u305f\u3081\u306b\u3001\u30a2\u30d7\u30ea\u30b1\u30fc\u30b7\u30e7\u30f3\u3092\u30d3\u30eb\u30c9\u3057\u3001\u30eb\u30fc\u30d7\u3067\u5b9f\u884c\u3057\u3066 CloudWatch \u3067\u8868\u793a\u3059\u308b\u30c7\u30fc\u30bf\u3092\u751f\u6210\u3067\u304d\u307e\u3059\u3002\u30eb\u30fc\u30c8\u30c7\u30a3\u30ec\u30af\u30c8\u30ea\u304b\u3089\u4ee5\u4e0b\u3092\u5b9f\u884c\u3057\u307e\u3059\u3002"}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{children:"cargo build\n"})}),"\n",(0,s.jsx)(n.p,{children:"\u6b21\u306b\u30012 \u79d2\u306e\u30b9\u30ea\u30fc\u30d7\u3092\u631f\u3093\u3067 50 \u56de\u5b9f\u884c\u3057\u307e\u3059\u3002\u30b9\u30ea\u30fc\u30d7\u306f\u3001CloudWatch \u30c0\u30c3\u30b7\u30e5\u30dc\u30fc\u30c9\u3067\u30e1\u30c8\u30ea\u30af\u30b9\u3092\u898b\u3084\u3059\u304f\u3059\u308b\u305f\u3081\u306b\u3001\u30e1\u30c8\u30ea\u30af\u30b9\u306e\u9593\u9694\u3092\u5c11\u3057\u7a7a\u3051\u308b\u305f\u3081\u3067\u3059\u3002"}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{children:"for run in {1..50}; do ./target/debug/custom-metrics; sleep 2; done\n"})}),"\n",(0,s.jsx)(n.p,{children:"\u3053\u308c\u3067 CloudWatch \u3067\u7d50\u679c\u3092\u78ba\u8a8d\u3067\u304d\u307e\u3059\u3002\u79c1\u306f\u30c7\u30a3\u30e1\u30f3\u30b7\u30e7\u30f3\u3067 GroupBy \u3059\u308b\u306e\u304c\u597d\u304d\u3067\u3059\u3002\u3053\u308c\u306b\u3088\u308a\u3001\u5404\u30ed\u30fc\u30eb\u5024\u304c\u9078\u629e\u3055\u308c\u305f\u56de\u6570\u3092\u78ba\u8a8d\u3067\u304d\u307e\u3059\u3002\u30e1\u30c8\u30ea\u30af\u30b9\u30a4\u30f3\u30b5\u30a4\u30c8\u306e\u30af\u30a8\u30ea\u306f\u4ee5\u4e0b\u306e\u3088\u3046\u306b\u306a\u308b\u306f\u305a\u3067\u3059\u3002\u4f55\u304b\u5909\u66f4\u3057\u305f\u5834\u5408\u306f\u3001\u30e1\u30c8\u30ea\u30af\u30b9\u540d\u3068\u30c7\u30a3\u30e1\u30f3\u30b7\u30e7\u30f3\u540d\u3092\u9069\u5b9c\u5909\u66f4\u3057\u3066\u304f\u3060\u3055\u3044\u3002"}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{children:"SELECT COUNT(roll_value_emf) FROM rust_custom_metrics GROUP BY roll_value_emf_dimension\n"})}),"\n",(0,s.jsx)(n.p,{children:"\u3053\u308c\u3067\u30013 \u3064\u3059\u3079\u3066\u3092\u30c0\u30c3\u30b7\u30e5\u30dc\u30fc\u30c9\u306b\u914d\u7f6e\u3057\u3001\u4e88\u60f3\u901a\u308a\u540c\u3058\u30b0\u30e9\u30d5\u304c\u8868\u793a\u3055\u308c\u308b\u3053\u3068\u3092\u78ba\u8a8d\u3067\u304d\u307e\u3059\u3002"}),"\n",(0,s.jsx)(n.p,{children:(0,s.jsx)(n.img,{alt:"dashboard",src:t(59360).A+"",width:"3284",height:"918"})}),"\n",(0,s.jsx)(n.h2,{id:"\u30af\u30ea\u30fc\u30f3\u30a2\u30c3\u30d7",children:"\u30af\u30ea\u30fc\u30f3\u30a2\u30c3\u30d7"}),"\n",(0,s.jsxs)(n.p,{children:[(0,s.jsx)(n.code,{children:"rust_custom"})," \u30ed\u30b0\u30b0\u30eb\u30fc\u30d7\u3092\u5fc5\u305a\u524a\u9664\u3057\u3066\u304f\u3060\u3055\u3044\u3002"]}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{children:"aws logs delete-log-group --log-group-name rust_custom\n"})})]})}function u(e={}){const{wrapper:n}={...(0,l.R)(),...e.components};return n?(0,s.jsx)(n,{...e,children:(0,s.jsx)(d,{...e})}):d(e)}},59360:(e,n,t)=>{t.d(n,{A:()=>s});const s=t.p+"assets/images/dashboard-dffded594ab378ed3aa1dce00992278a.png"},28453:(e,n,t)=>{t.d(n,{R:()=>i,x:()=>a});var s=t(96540);const l={},r=s.createContext(l);function i(e){const n=s.useContext(r);return s.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function a(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(l):e.components||l:i(e.components),s.createElement(r.Provider,{value:n},e.children)}}}]);
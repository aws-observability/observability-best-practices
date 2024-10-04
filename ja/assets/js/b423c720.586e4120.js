"use strict";(self.webpackChunkobservability_best_practices=self.webpackChunkobservability_best_practices||[]).push([[6216],{89115:(t,s,e)=>{e.r(s),e.d(s,{assets:()=>r,contentTitle:()=>c,default:()=>u,frontMatter:()=>n,metadata:()=>o,toc:()=>l});var a=e(74848),i=e(28453);const n={},c="Amazon CloudWatch",o={id:"guides/cost/cost-visualization/amazon-cloudwatch",title:"Amazon CloudWatch",description:"Amazon CloudWatch \u306e\u30b3\u30b9\u30c8\u3068\u4f7f\u7528\u91cf\u306e\u30d3\u30b8\u30e5\u30a2\u30eb\u306b\u3088\u308a\u3001\u500b\u3005\u306e AWS \u30a2\u30ab\u30a6\u30f3\u30c8\u3001AWS \u30ea\u30fc\u30b8\u30e7\u30f3\u3001GetMetricData\u3001PutLogEvents\u3001GetMetricStream\u3001ListMetrics\u3001MetricStorage\u3001HourlyStorageMetering\u3001ListMetrics \u306a\u3069\u3001\u3059\u3079\u3066\u306e CloudWatch \u30aa\u30da\u30ec\u30fc\u30b7\u30e7\u30f3\u306e\u30b3\u30b9\u30c8\u306e\u6d1e\u5bdf\u304c\u5f97\u3089\u308c\u307e\u3059\u3002",source:"@site/i18n/ja/docusaurus-plugin-content-docs/current/guides/cost/cost-visualization/amazon-cloudwatch.md",sourceDirName:"guides/cost/cost-visualization",slug:"/guides/cost/cost-visualization/amazon-cloudwatch",permalink:"/observability-best-practices/ja/docs/guides/cost/cost-visualization/amazon-cloudwatch",draft:!1,unlisted:!1,editUrl:"https://github.com/aws-observability/observability-best-practices/blob/main/docusaurus/docs/guides/cost/cost-visualization/amazon-cloudwatch.md",tags:[],version:"current",frontMatter:{},sidebar:"guides",previous:{title:"AWS Observability \u30b5\u30fc\u30d3\u30b9\u3068\u30b3\u30b9\u30c8",permalink:"/observability-best-practices/ja/docs/guides/cost/cost-visualization/cost"},next:{title:"Amazon Managed Grafana",permalink:"/observability-best-practices/ja/docs/guides/cost/cost-visualization/amazon-grafana"}},r={},l=[{value:"Amazon QuickSight \u30c0\u30c3\u30b7\u30e5\u30dc\u30fc\u30c9\u306e\u4f5c\u6210",id:"amazon-quicksight-\u30c0\u30c3\u30b7\u30e5\u30dc\u30fc\u30c9\u306e\u4f5c\u6210",level:3}];function h(t){const s={a:"a",h1:"h1",h3:"h3",img:"img",li:"li",ol:"ol",p:"p",strong:"strong",...(0,i.R)(),...t.components};return(0,a.jsxs)(a.Fragment,{children:[(0,a.jsx)(s.h1,{id:"amazon-cloudwatch",children:"Amazon CloudWatch"}),"\n",(0,a.jsx)(s.p,{children:"Amazon CloudWatch \u306e\u30b3\u30b9\u30c8\u3068\u4f7f\u7528\u91cf\u306e\u30d3\u30b8\u30e5\u30a2\u30eb\u306b\u3088\u308a\u3001\u500b\u3005\u306e AWS \u30a2\u30ab\u30a6\u30f3\u30c8\u3001AWS \u30ea\u30fc\u30b8\u30e7\u30f3\u3001GetMetricData\u3001PutLogEvents\u3001GetMetricStream\u3001ListMetrics\u3001MetricStorage\u3001HourlyStorageMetering\u3001ListMetrics \u306a\u3069\u3001\u3059\u3079\u3066\u306e CloudWatch \u30aa\u30da\u30ec\u30fc\u30b7\u30e7\u30f3\u306e\u30b3\u30b9\u30c8\u306e\u6d1e\u5bdf\u304c\u5f97\u3089\u308c\u307e\u3059\u3002"}),"\n",(0,a.jsxs)(s.p,{children:["CloudWatch \u306e\u30b3\u30b9\u30c8\u3068\u4f7f\u7528\u91cf\u30c7\u30fc\u30bf\u3092\u8996\u899a\u5316\u304a\u3088\u3073\u5206\u6790\u3059\u308b\u306b\u306f\u3001\u30ab\u30b9\u30bf\u30e0 Athena \u30d3\u30e5\u30fc\u3092\u4f5c\u6210\u3059\u308b\u5fc5\u8981\u304c\u3042\u308a\u307e\u3059\u3002Amazon Athena ",(0,a.jsx)(s.a,{href:"https://athena-in-action.workshop.aws/30-basics/303-create-view.html",children:"\u30d3\u30e5\u30fc"}),"\u306f\u8ad6\u7406\u30c6\u30fc\u30d6\u30eb\u3067\u3042\u308a\u3001\u30af\u30a8\u30ea\u306e\u7c21\u7565\u5316\u306e\u305f\u3081\u306b\u5143\u306e CUR \u30c6\u30fc\u30d6\u30eb\u304b\u3089\u5217\u306e\u30b5\u30d6\u30bb\u30c3\u30c8\u3092\u4f5c\u6210\u3057\u307e\u3059\u3002"]}),"\n",(0,a.jsxs)(s.ol,{children:["\n",(0,a.jsxs)(s.li,{children:["\n",(0,a.jsx)(s.p,{children:"[\u5b9f\u88c5\u306e\u6982\u8981][cid-implement] \u3067\u8a00\u53ca\u3055\u308c\u3066\u3044\u308b CUR (\u30b9\u30c6\u30c3\u30d7 #1) \u3092\u4f5c\u6210\u3057\u3001AWS \u6e96\u62e0\u30c6\u30f3\u30d7\u30ec\u30fc\u30c8 (\u30b9\u30c6\u30c3\u30d7 #2) \u3092\u30c7\u30d7\u30ed\u30a4\u3057\u305f\u3053\u3068\u3092\u78ba\u8a8d\u3057\u3066\u304f\u3060\u3055\u3044\u3002"}),"\n"]}),"\n",(0,a.jsxs)(s.li,{children:["\n",(0,a.jsxs)(s.p,{children:["\u6b21\u306b\u3001\u4ee5\u4e0b\u306e\u30af\u30a8\u30ea\u3092\u4f7f\u7528\u3057\u3066\u3001\u65b0\u3057\u3044 Amazon Athena ",(0,a.jsx)(s.a,{href:"https://athena-in-action.workshop.aws/30-basics/303-create-view.html",children:"\u30d3\u30e5\u30fc"})," \u3092\u4f5c\u6210\u3057\u307e\u3059\u3002\u3053\u306e\u30af\u30a8\u30ea\u306f\u3001Organization \u5185\u306e\u3059\u3079\u3066\u306e AWS \u30a2\u30ab\u30a6\u30f3\u30c8\u306b\u308f\u305f\u308b Amazon CloudWatch \u306e\u30b3\u30b9\u30c8\u3068\u4f7f\u7528\u91cf\u3092\u53d6\u5f97\u3057\u307e\u3059\u3002"]}),"\n",(0,a.jsx)(s.p,{children:'CREATE OR REPLACE VIEW "cloudwatch_cost" AS\nSELECT\nline_item_usage_type\n, line_item_resource_id\n, line_item_operation\n, line_item_usage_account_id\n, month\n, year\n, "sum"(line_item_usage_amount) "Usage"\n, "sum"(line_item_unblended_cost) cost\nFROM\ndatabase.tablename #\u30c7\u30fc\u30bf\u30d9\u30fc\u30b9\u540d\u3068\u30c6\u30fc\u30d6\u30eb\u540d\u3092\u7f6e\u304d\u63db\u3048\u3066\u304f\u3060\u3055\u3044\nWHERE ("line_item_product_code" = \'AmazonCloudWatch\')\nGROUP BY 1, 2, 3, 4, 5, 6'}),"\n"]}),"\n"]}),"\n",(0,a.jsx)(s.h3,{id:"amazon-quicksight-\u30c0\u30c3\u30b7\u30e5\u30dc\u30fc\u30c9\u306e\u4f5c\u6210",children:"Amazon QuickSight \u30c0\u30c3\u30b7\u30e5\u30dc\u30fc\u30c9\u306e\u4f5c\u6210"}),"\n",(0,a.jsx)(s.p,{children:"\u6b21\u306b\u3001Amazon CloudWatch \u306e\u30b3\u30b9\u30c8\u3068\u4f7f\u7528\u91cf\u3092\u53ef\u8996\u5316\u3059\u308b\u305f\u3081\u306e QuickSight \u30c0\u30c3\u30b7\u30e5\u30dc\u30fc\u30c9\u3092\u4f5c\u6210\u3057\u307e\u3057\u3087\u3046\u3002"}),"\n",(0,a.jsxs)(s.ol,{children:["\n",(0,a.jsx)(s.li,{children:"AWS Management Console \u3067\u3001QuickSight \u30b5\u30fc\u30d3\u30b9\u306b\u79fb\u52d5\u3057\u3001\u53f3\u4e0a\u9685\u304b\u3089 AWS \u30ea\u30fc\u30b8\u30e7\u30f3\u3092\u9078\u629e\u3057\u307e\u3059\u3002QuickSight \u30c7\u30fc\u30bf\u30bb\u30c3\u30c8\u306f\u3001Amazon Athena \u30c6\u30fc\u30d6\u30eb\u3068\u540c\u3058 AWS \u30ea\u30fc\u30b8\u30e7\u30f3\u306b\u3042\u308b\u5fc5\u8981\u304c\u3042\u308a\u307e\u3059\u3002"}),"\n",(0,a.jsxs)(s.li,{children:["QuickSight \u304c ",(0,a.jsx)(s.a,{href:"https://docs.aws.amazon.com/quicksight/latest/user/accessing-data-sources.html",children:"Amazon S3 \u3068 AWS Athena \u306b\u30a2\u30af\u30bb\u30b9\u3067\u304d\u308b"}),"\u3053\u3068\u3092\u78ba\u8a8d\u3057\u307e\u3059\u3002"]}),"\n",(0,a.jsxs)(s.li,{children:["\u4e8b\u524d\u306b\u4f5c\u6210\u3057\u305f Amazon Athena \u30d3\u30e5\u30fc\u3092\u30c7\u30fc\u30bf\u30bd\u30fc\u30b9\u3068\u3057\u3066\u9078\u629e\u3057\u3001",(0,a.jsx)(s.a,{href:"https://docs.aws.amazon.com/quicksight/latest/user/create-a-data-set-athena.html",children:"QuickSight \u30c7\u30fc\u30bf\u30bb\u30c3\u30c8\u3092\u4f5c\u6210"}),"\u3057\u307e\u3059\u3002\u3053\u306e\u624b\u9806\u3092\u4f7f\u7528\u3057\u3066\u3001\u30c7\u30fc\u30bf\u30bb\u30c3\u30c8\u3092\u6bce\u65e5\u66f4\u65b0\u3059\u308b",(0,a.jsx)(s.a,{href:"https://docs.aws.amazon.com/quicksight/latest/user/refreshing-imported-data.html",children:"\u30b9\u30b1\u30b8\u30e5\u30fc\u30eb\u3092\u8a2d\u5b9a"}),"\u3057\u307e\u3059\u3002"]}),"\n",(0,a.jsxs)(s.li,{children:["QuickSight ",(0,a.jsx)(s.a,{href:"https://docs.aws.amazon.com/quicksight/latest/user/creating-an-analysis.html",children:"\u5206\u6790"})," \u3092\u4f5c\u6210\u3057\u307e\u3059\u3002"]}),"\n",(0,a.jsxs)(s.li,{children:["\u5fc5\u8981\u306b\u5fdc\u3058\u3066 QuickSight ",(0,a.jsx)(s.a,{href:"https://docs.aws.amazon.com/quicksight/latest/user/creating-a-visual.html",children:"\u30d3\u30b8\u30e5\u30a2\u30eb"})," \u3092\u4f5c\u6210\u3057\u307e\u3059\u3002"]}),"\n",(0,a.jsxs)(s.li,{children:["\u5fc5\u8981\u306b\u5fdc\u3058\u3066\u30d3\u30b8\u30e5\u30a2\u30eb\u306e",(0,a.jsx)(s.a,{href:"https://docs.aws.amazon.com/quicksight/latest/user/formatting-a-visual.html",children:"\u66f8\u5f0f\u8a2d\u5b9a"}),"\u3092\u884c\u3044\u307e\u3059\u3002"]}),"\n",(0,a.jsxs)(s.li,{children:["\u3053\u308c\u3067\u5206\u6790\u304b\u3089\u30c0\u30c3\u30b7\u30e5\u30dc\u30fc\u30c9\u3092",(0,a.jsx)(s.a,{href:"https://docs.aws.amazon.com/quicksight/latest/user/creating-a-dashboard.html",children:"\u516c\u958b"}),"\u3067\u304d\u307e\u3059\u3002"]}),"\n",(0,a.jsxs)(s.li,{children:["\u500b\u4eba\u307e\u305f\u306f\u30b0\u30eb\u30fc\u30d7\u306b\u5bfe\u3057\u3066\u3001\u30c0\u30c3\u30b7\u30e5\u30dc\u30fc\u30c9\u3092",(0,a.jsx)(s.a,{href:"https://docs.aws.amazon.com/quicksight/latest/user/sending-reports.html",children:"\u30ec\u30dd\u30fc\u30c8"}),"\u5f62\u5f0f\u3067\u4e00\u5ea6\u307e\u305f\u306f\u30b9\u30b1\u30b8\u30e5\u30fc\u30eb\u306b\u5f93\u3063\u3066\u9001\u4fe1\u3067\u304d\u307e\u3059\u3002"]}),"\n"]}),"\n",(0,a.jsxs)(s.p,{children:["\u6b21\u306e ",(0,a.jsx)(s.strong,{children:"QuickSight \u30c0\u30c3\u30b7\u30e5\u30dc\u30fc\u30c9"})," \u306f\u3001AWS Organizations \u306e\u3059\u3079\u3066\u306e AWS \u30a2\u30ab\u30a6\u30f3\u30c8\u306b\u304a\u3051\u308b Amazon CloudWatch \u306e\u30b3\u30b9\u30c8\u3068\u4f7f\u7528\u91cf\u3092\u793a\u3057\u3066\u3044\u307e\u3059\u3002\u307e\u305f\u3001GetMetricData\u3001PutLogEvents\u3001GetMetricStream\u3001ListMetrics\u3001MetricStorage\u3001HourlyStorageMetering\u3001ListMetrics \u306a\u3069\u306e CloudWatch \u30aa\u30da\u30ec\u30fc\u30b7\u30e7\u30f3\u3082\u793a\u3057\u3066\u3044\u307e\u3059\u3002"]}),"\n",(0,a.jsxs)(s.p,{children:[(0,a.jsx)(s.img,{alt:"cloudwatch-cost1",src:e(17486).A+"",width:"881",height:"695"}),"\n",(0,a.jsx)(s.img,{alt:"cloudwatch-cost2",src:e(81061).A+"",width:"875",height:"654"})]}),"\n",(0,a.jsxs)(s.p,{children:["\u3053\u306e\u30c0\u30c3\u30b7\u30e5\u30dc\u30fc\u30c9\u306b\u3088\u308a\u3001Organization \u5185\u306e AWS \u30a2\u30ab\u30a6\u30f3\u30c8\u306b\u304a\u3051\u308b Amazon CloudWatch \u306e\u30b3\u30b9\u30c8\u3092\u7279\u5b9a\u3067\u304d\u308b\u3088\u3046\u306b\u306a\u308a\u307e\u3057\u305f\u3002\u7570\u306a\u308b\u30c0\u30c3\u30b7\u30e5\u30dc\u30fc\u30c9\u3092\u69cb\u7bc9\u3057\u3066\u8981\u4ef6\u306b\u5bfe\u5fdc\u3059\u308b\u305f\u3081\u306b\u3001\u4ed6\u306e QuickSight ",(0,a.jsx)(s.a,{href:"https://docs.aws.amazon.com/quicksight/latest/user/working-with-visual-types.html",children:"\u30d3\u30b8\u30e5\u30a2\u30eb\u30bf\u30a4\u30d7"})," \u3092\u4f7f\u7528\u3067\u304d\u307e\u3059\u3002"]})]})}function u(t={}){const{wrapper:s}={...(0,i.R)(),...t.components};return s?(0,a.jsx)(s,{...t,children:(0,a.jsx)(h,{...t})}):h(t)}},17486:(t,s,e)=>{e.d(s,{A:()=>a});const a=e.p+"assets/images/cloudwatch-cost-1-91e893ccdfc33b206e9e3a113f3f03c0.PNG"},81061:(t,s,e)=>{e.d(s,{A:()=>a});const a=e.p+"assets/images/cloudwatch-cost-2-caef62f7b18ef5d00f4f725530703b9c.PNG"},28453:(t,s,e)=>{e.d(s,{R:()=>c,x:()=>o});var a=e(96540);const i={},n=a.createContext(i);function c(t){const s=a.useContext(n);return a.useMemo((function(){return"function"==typeof t?t(s):{...s,...t}}),[s,t])}function o(t){let s;return s=t.disableParentContext?"function"==typeof t.components?t.components(i):t.components||i:c(t.components),a.createElement(n.Provider,{value:s},t.children)}}}]);
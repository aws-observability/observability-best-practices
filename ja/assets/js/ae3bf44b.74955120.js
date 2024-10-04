"use strict";(self.webpackChunkobservability_best_practices=self.webpackChunkobservability_best_practices||[]).push([[7477],{93196:(e,a,s)=>{s.r(a),s.d(a,{assets:()=>c,contentTitle:()=>o,default:()=>m,frontMatter:()=>r,metadata:()=>i,toc:()=>l});var t=s(74848),n=s(28453);const r={},o="Amazon Relational Database Service",i={id:"recipes/rds",title:"Amazon Relational Database Service",description:"Amazon Relational Database Service(RDS) \u306f\u3001\u30af\u30e9\u30a6\u30c9\u3067\u30ea\u30ec\u30fc\u30b7\u30e7\u30ca\u30eb\u30c7\u30fc\u30bf\u30d9\u30fc\u30b9\u3092\u8a2d\u5b9a\u3001\u904b\u7528\u3001\u30b9\u30b1\u30fc\u30ea\u30f3\u30b0\u3059\u308b\u3053\u3068\u3092\u7c21\u5358\u306b\u3057\u307e\u3059\u3002\u30b3\u30b9\u30c8\u52b9\u7387\u306e\u9ad8\u3044\u62e1\u5f35\u53ef\u80fd\u306a\u5bb9\u91cf\u3092\u63d0\u4f9b\u3057\u3001\u30cf\u30fc\u30c9\u30a6\u30a7\u30a2\u306e\u30d7\u30ed\u30d3\u30b8\u30e7\u30cb\u30f3\u30b0\u3001\u30c7\u30fc\u30bf\u30d9\u30fc\u30b9\u306e\u30bb\u30c3\u30c8\u30a2\u30c3\u30d7\u3001\u30d1\u30c3\u30c1\u9069\u7528\u3001\u30d0\u30c3\u30af\u30a2\u30c3\u30d7\u306a\u3069\u306e\u6642\u9593\u306e\u304b\u304b\u308b\u7ba1\u7406\u30bf\u30b9\u30af\u3092\u81ea\u52d5\u5316\u3057\u307e\u3059\u3002",source:"@site/i18n/ja/docusaurus-plugin-content-docs/current/recipes/rds.md",sourceDirName:"recipes",slug:"/recipes/rds",permalink:"/observability-best-practices/ja/docs/recipes/rds",draft:!1,unlisted:!1,editUrl:"https://github.com/aws-observability/observability-best-practices/blob/main/docusaurus/docs/recipes/rds.md",tags:[],version:"current",frontMatter:{},sidebar:"recipes",previous:{title:"\u30a4\u30f3\u30d5\u30e9\u30b9\u30c8\u30e9\u30af\u30c1\u30e3\u3068\u30c7\u30fc\u30bf\u30d9\u30fc\u30b9",permalink:"/observability-best-practices/ja/docs/recipes/infra"},next:{title:"Amazon DynamoDB",permalink:"/observability-best-practices/ja/docs/recipes/dynamodb"}},c={},l=[];function d(e){const a={a:"a",h1:"h1",li:"li",p:"p",ul:"ul",...(0,n.R)(),...e.components};return(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)(a.h1,{id:"amazon-relational-database-service",children:"Amazon Relational Database Service"}),"\n",(0,t.jsxs)(a.p,{children:[(0,t.jsx)(a.a,{href:"https://aws.amazon.com/rds/",children:"Amazon Relational Database Service"}),"(RDS) \u306f\u3001\u30af\u30e9\u30a6\u30c9\u3067\u30ea\u30ec\u30fc\u30b7\u30e7\u30ca\u30eb\u30c7\u30fc\u30bf\u30d9\u30fc\u30b9\u3092\u8a2d\u5b9a\u3001\u904b\u7528\u3001\u30b9\u30b1\u30fc\u30ea\u30f3\u30b0\u3059\u308b\u3053\u3068\u3092\u7c21\u5358\u306b\u3057\u307e\u3059\u3002\u30b3\u30b9\u30c8\u52b9\u7387\u306e\u9ad8\u3044\u62e1\u5f35\u53ef\u80fd\u306a\u5bb9\u91cf\u3092\u63d0\u4f9b\u3057\u3001\u30cf\u30fc\u30c9\u30a6\u30a7\u30a2\u306e\u30d7\u30ed\u30d3\u30b8\u30e7\u30cb\u30f3\u30b0\u3001\u30c7\u30fc\u30bf\u30d9\u30fc\u30b9\u306e\u30bb\u30c3\u30c8\u30a2\u30c3\u30d7\u3001\u30d1\u30c3\u30c1\u9069\u7528\u3001\u30d0\u30c3\u30af\u30a2\u30c3\u30d7\u306a\u3069\u306e\u6642\u9593\u306e\u304b\u304b\u308b\u7ba1\u7406\u30bf\u30b9\u30af\u3092\u81ea\u52d5\u5316\u3057\u307e\u3059\u3002"]}),"\n",(0,t.jsx)(a.p,{children:"\u4ee5\u4e0b\u306e\u30ec\u30b7\u30d4\u3092\u3054\u78ba\u8a8d\u304f\u3060\u3055\u3044:"}),"\n",(0,t.jsxs)(a.ul,{children:["\n",(0,t.jsx)(a.li,{children:(0,t.jsx)(a.a,{href:"https://aws.amazon.com/blogs/database/build-proactive-database-monitoring-for-amazon-rds-with-amazon-cloudwatch-logs-aws-lambda-and-amazon-sns/",children:"CloudWatch Logs\u3001Lambda\u3001SNS \u3092\u4f7f\u7528\u3057\u305f RDS \u306e\u30d7\u30ed\u30a2\u30af\u30c6\u30a3\u30d6\u306a\u30c7\u30fc\u30bf\u30d9\u30fc\u30b9\u76e3\u8996\u306e\u69cb\u7bc9"})}),"\n",(0,t.jsx)(a.li,{children:(0,t.jsx)(a.a,{href:"https://aws.amazon.com/blogs/database/monitor-amazon-rds-for-postgresql-and-amazon-aurora-for-postgresql-database-log-errors-and-set-up-notifications-using-amazon-cloudwatch/",children:"CloudWatch \u3092\u4f7f\u7528\u3057\u305f RDS for PostgreSQL \u3068 Aurora PostgreSQL \u306e\u30c7\u30fc\u30bf\u30d9\u30fc\u30b9\u30ed\u30b0\u30a8\u30e9\u30fc\u306e\u76e3\u8996\u3068\u901a\u77e5\u306e\u8a2d\u5b9a"})}),"\n",(0,t.jsx)(a.li,{children:(0,t.jsx)(a.a,{href:"https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/Overview.LoggingAndMonitoring.html",children:"Amazon RDS \u306b\u304a\u3051\u308b\u30ed\u30ae\u30f3\u30b0\u3068\u30e2\u30cb\u30bf\u30ea\u30f3\u30b0"})}),"\n",(0,t.jsx)(a.li,{children:(0,t.jsx)(a.a,{href:"https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_PerfInsights.Cloudwatch.html",children:"CloudWatch \u306b\u516c\u958b\u3055\u308c\u308b Performance Insights \u30e1\u30c8\u30ea\u30af\u30b9"})}),"\n"]})]})}function m(e={}){const{wrapper:a}={...(0,n.R)(),...e.components};return a?(0,t.jsx)(a,{...e,children:(0,t.jsx)(d,{...e})}):d(e)}},28453:(e,a,s)=>{s.d(a,{R:()=>o,x:()=>i});var t=s(96540);const n={},r=t.createContext(n);function o(e){const a=t.useContext(r);return t.useMemo((function(){return"function"==typeof e?e(a):{...a,...e}}),[a,e])}function i(e){let a;return a=e.disableParentContext?"function"==typeof e.components?e.components(n):e.components||n:o(e.components),t.createElement(r.Provider,{value:a},e.children)}}}]);
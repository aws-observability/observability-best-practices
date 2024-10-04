"use strict";(self.webpackChunkobservability_best_practices=self.webpackChunkobservability_best_practices||[]).push([[7344],{85421:(e,a,t)=>{t.r(a),t.d(a,{assets:()=>c,contentTitle:()=>i,default:()=>l,frontMatter:()=>o,metadata:()=>r,toc:()=>d});var s=t(74848),n=t(28453);const o={},i="Amazon Managed Service for Prometheus",r={id:"guides/cost/cost-visualization/amazon-prometheus",title:"Amazon Managed Service for Prometheus",description:"Amazon Managed Service for Prometheus cost and usage visuals will allow you to gain insights into cost of individual AWS Accounts, AWS Regions, specific Prometheus Workspace instances along with Operations like RemoteWrite, Query, and HourlyStorageMetering!",source:"@site/docs/guides/cost/cost-visualization/amazon-prometheus.md",sourceDirName:"guides/cost/cost-visualization",slug:"/guides/cost/cost-visualization/amazon-prometheus",permalink:"/observability-best-practices/docs/guides/cost/cost-visualization/amazon-prometheus",draft:!1,unlisted:!1,editUrl:"https://github.com/aws-observability/observability-best-practices/blob/main/docusaurus/docs/guides/cost/cost-visualization/amazon-prometheus.md",tags:[],version:"current",frontMatter:{},sidebar:"guides",previous:{title:"Amazon Managed Grafana",permalink:"/observability-best-practices/docs/guides/cost/cost-visualization/amazon-grafana"},next:{title:"Real-time cost monitoring",permalink:"/observability-best-practices/docs/guides/cost/cost-visualization/AmazonManagedServiceforPrometheus"}},c={},d=[{value:"Create Amazon Managed Grafana dashboard",id:"create-amazon-managed-grafana-dashboard",level:2}];function u(e){const a={a:"a",h1:"h1",h2:"h2",img:"img",li:"li",ol:"ol",p:"p",strong:"strong",...(0,n.R)(),...e.components};return(0,s.jsxs)(s.Fragment,{children:[(0,s.jsx)(a.h1,{id:"amazon-managed-service-for-prometheus",children:"Amazon Managed Service for Prometheus"}),"\n",(0,s.jsx)(a.p,{children:"Amazon Managed Service for Prometheus cost and usage visuals will allow you to gain insights into cost of individual AWS Accounts, AWS Regions, specific Prometheus Workspace instances along with Operations like RemoteWrite, Query, and HourlyStorageMetering!"}),"\n",(0,s.jsx)(a.p,{children:"To visualize and analyze the cost and usage data, you need to create a custom Athena view."}),"\n",(0,s.jsxs)(a.ol,{children:["\n",(0,s.jsxs)(a.li,{children:["\n",(0,s.jsxs)(a.p,{children:["Before proceeding, make sure that you\u2019ve created the CUR (step #1) and deployed the AWS Conformation Template (step #2) mentioned in the ",(0,s.jsx)(a.a,{href:"/observability-best-practices/docs/guides/cost/cost-visualization/cost#implementation",children:"Implementation overview"}),"."]}),"\n"]}),"\n",(0,s.jsxs)(a.li,{children:["\n",(0,s.jsxs)(a.p,{children:["Now, Create a new Amazon Athena ",(0,s.jsx)(a.a,{href:"https://athena-in-action.workshop.aws/30-basics/303-create-view.html",children:"view"})," by using the following query. This query fetches cost and usage of Amazon Managed Service for Prometheus across all the AWS Accounts in your Organization."]}),"\n",(0,s.jsx)(a.p,{children:'CREATE OR REPLACE VIEW "prometheus_cost" AS\nSELECT\nline_item_usage_type\n, line_item_resource_id\n, line_item_operation\n, line_item_usage_account_id\n, month\n, year\n, "sum"(line_item_usage_amount) "Usage"\n, "sum"(line_item_unblended_cost) cost\nFROM\ndatabase.tablename #replace database.tablename with your database and table name\nWHERE ("line_item_product_code" = \'AmazonPrometheus\')\nGROUP BY 1, 2, 3, 4, 5, 6'}),"\n"]}),"\n"]}),"\n",(0,s.jsx)(a.h2,{id:"create-amazon-managed-grafana-dashboard",children:"Create Amazon Managed Grafana dashboard"}),"\n",(0,s.jsxs)(a.p,{children:["With Amazon Managed Grafana, you can add Athena as a data source by using the AWS data source configuration option in the Grafana workspace console. This feature simplifies adding Athena as a data source by discovering your existing Athena accounts and manages the configuration of the authentication credentials that are required to access Athena. For prerequisites associated with using the Athena data source, see ",(0,s.jsx)(a.a,{href:"https://docs.aws.amazon.com/grafana/latest/userguide/Athena-prereq.html",children:"Prerequisites"}),"."]}),"\n",(0,s.jsxs)(a.p,{children:["The following ",(0,s.jsx)(a.strong,{children:"Grafana dashboard"})," shows Amazon Managed Service for Prometheus cost and usage across all AWS Accounts in your AWS Organizations along with cost of individual Prometheus Workspace instances and the Operations like RemoteWrite, Query, and HourlyStorageMetering!"]}),"\n",(0,s.jsx)(a.p,{children:(0,s.jsx)(a.img,{alt:"prometheus-cost",src:t(17030).A+"",width:"3005",height:"1390"})}),"\n",(0,s.jsxs)(a.p,{children:["A dashboard in Grafana is represented by a JSON object, which stores metadata of its dashboard. Dashboard metadata includes dashboard properties, metadata from panels, template variables, panel queries, etc. Access the JSON template of the above dashboard ",(0,s.jsx)(a.a,{target:"_blank","data-noBrokenLinkCheck":!0,href:t(65430).A+"",children:"here"}),"."]}),"\n",(0,s.jsxs)(a.p,{children:["With the preceding dashboard, you can now identify the cost and usage of Amazon Managed Service for Prometheus in the AWS accounts across your Organization. You can use other Grafana ",(0,s.jsx)(a.a,{href:"https://docs.aws.amazon.com/grafana/latest/userguide/Grafana-panels.html",children:"dashboard panels"})," to build visuals to suit your requirements."]})]})}function l(e={}){const{wrapper:a}={...(0,n.R)(),...e.components};return a?(0,s.jsx)(a,{...e,children:(0,s.jsx)(u,{...e})}):u(e)}},65430:(e,a,t)=>{t.d(a,{A:()=>s});const s=t.p+"assets/files/AmazonPrometheus-61602cb0332ade0b5e768b0f00ee2d7d.json"},17030:(e,a,t)=>{t.d(a,{A:()=>s});const s=t.p+"assets/images/prometheus-cost-ac8ec270353978dba9ad4d41a30286f7.png"},28453:(e,a,t)=>{t.d(a,{R:()=>i,x:()=>r});var s=t(96540);const n={},o=s.createContext(n);function i(e){const a=s.useContext(o);return s.useMemo((function(){return"function"==typeof e?e(a):{...a,...e}}),[a,e])}function r(e){let a;return a=e.disableParentContext?"function"==typeof e.components?e.components(n):e.components||n:i(e.components),s.createElement(o.Provider,{value:a},e.children)}}}]);
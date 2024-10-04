"use strict";(self.webpackChunkobservability_best_practices=self.webpackChunkobservability_best_practices||[]).push([[1753],{76898:(a,e,n)=>{n.r(e),n.d(e,{assets:()=>c,contentTitle:()=>t,default:()=>m,frontMatter:()=>r,metadata:()=>o,toc:()=>d});var s=n(74848),i=n(28453);const r={},t="Amazon Managed Grafana",o={id:"recipes/amg",title:"Amazon Managed Grafana",description:"Amazon Managed Grafana is a fully managed service based on open",source:"@site/docs/recipes/amg.md",sourceDirName:"recipes",slug:"/recipes/amg",permalink:"/observability-best-practices/docs/recipes/amg",draft:!1,unlisted:!1,editUrl:"https://github.com/aws-observability/observability-best-practices/blob/main/docusaurus/docs/recipes/amg.md",tags:[],version:"current",frontMatter:{},sidebar:"recipes",previous:{title:"Amazon Managed Service for Prometheus",permalink:"/observability-best-practices/docs/recipes/amp"},next:{title:"Amazon OpenSearch Service",permalink:"/observability-best-practices/docs/recipes/aes"}},c={},d=[{value:"Basics",id:"basics",level:2},{value:"Authentication and Access Control",id:"authentication-and-access-control",level:2},{value:"Data sources and Visualizations",id:"data-sources-and-visualizations",level:2},{value:"Others",id:"others",level:2}];function l(a){const e={a:"a",h1:"h1",h2:"h2",li:"li",p:"p",ul:"ul",...(0,i.R)(),...a.components};return(0,s.jsxs)(s.Fragment,{children:[(0,s.jsx)(e.h1,{id:"amazon-managed-grafana",children:"Amazon Managed Grafana"}),"\n",(0,s.jsxs)(e.p,{children:[(0,s.jsx)(e.a,{href:"https://aws.amazon.com/grafana/",children:"Amazon Managed Grafana"})," is a fully managed service based on open\nsource Grafana, enabling you to analyze your metrics, logs, and traces without\nhaving to provision servers, configure and update software, or do the heavy\nlifting involved in securing and scaling Grafana in production. You can create,\nexplore, and share observability dashboards with your team, connecting to\nmultiple data sources."]}),"\n",(0,s.jsx)(e.p,{children:"Check out the following recipes:"}),"\n",(0,s.jsx)(e.h2,{id:"basics",children:"Basics"}),"\n",(0,s.jsxs)(e.ul,{children:["\n",(0,s.jsx)(e.li,{children:(0,s.jsx)(e.a,{href:"https://aws.amazon.com/blogs/mt/amazon-managed-grafana-getting-started/",children:"Getting Started"})}),"\n",(0,s.jsx)(e.li,{children:(0,s.jsx)(e.a,{href:"/observability-best-practices/docs/recipes/recipes/amg-automation-tf",children:"Using Terraform for automation"})}),"\n"]}),"\n",(0,s.jsx)(e.h2,{id:"authentication-and-access-control",children:"Authentication and Access Control"}),"\n",(0,s.jsxs)(e.ul,{children:["\n",(0,s.jsx)(e.li,{children:(0,s.jsx)(e.a,{href:"https://aws.amazon.com/blogs/mt/amazon-managed-grafana-supports-direct-saml-integration-with-identity-providers/",children:"Direct SAML integration with identity providers"})}),"\n",(0,s.jsx)(e.li,{children:(0,s.jsx)(e.a,{href:"https://aws.amazon.com/blogs/opensource/integrating-identity-providers-such-as-onelogin-ping-identity-okta-and-azure-ad-to-sso-into-aws-managed-service-for-grafana/",children:"Integrating identity providers (OneLogin, Ping Identity, Okta, and Azure AD) to SSO"})}),"\n",(0,s.jsx)(e.li,{children:(0,s.jsx)(e.a,{href:"/observability-best-practices/docs/recipes/recipes/amg-google-auth-saml",children:"Integrating Google authentication via SAMLv2"})}),"\n",(0,s.jsx)(e.li,{children:(0,s.jsx)(e.a,{href:"https://aws.amazon.com/blogs/opensource/setting-up-amazon-managed-grafana-cross-account-data-source-using-customer-managed-iam-roles/",children:"Setting up Amazon Managed Grafana cross-account data source using customer managed IAM roles"})}),"\n",(0,s.jsx)(e.li,{children:(0,s.jsx)(e.a,{href:"https://aws.amazon.com/blogs/mt/fine-grained-access-control-in-amazon-managed-grafana-using-grafana-teams/",children:"Fine-grained access control in Amazon Managed Grafana using Grafana Teams"})}),"\n"]}),"\n",(0,s.jsx)(e.h2,{id:"data-sources-and-visualizations",children:"Data sources and Visualizations"}),"\n",(0,s.jsxs)(e.ul,{children:["\n",(0,s.jsx)(e.li,{children:(0,s.jsx)(e.a,{href:"/observability-best-practices/docs/recipes/recipes/amg-athena-plugin",children:"Using Athena in Amazon Managed Grafana"})}),"\n",(0,s.jsx)(e.li,{children:(0,s.jsx)(e.a,{href:"/observability-best-practices/docs/recipes/recipes/amg-redshift-plugin",children:"Using Redshift in Amazon Managed Grafana"})}),"\n",(0,s.jsx)(e.li,{children:(0,s.jsx)(e.a,{href:"https://aws.amazon.com/blogs/mt/viewing-custom-metrics-from-statsd-with-amazon-managed-service-for-prometheus-and-amazon-managed-grafana/",children:"Viewing custom metrics from statsd with Amazon Managed Service for Prometheus and Amazon Managed Grafana"})}),"\n",(0,s.jsx)(e.li,{children:(0,s.jsx)(e.a,{href:"https://aws.amazon.com/blogs/opensource/setting-up-amazon-managed-grafana-cross-account-data-source-using-customer-managed-iam-roles/",children:"Setting up cross-account data source using customer managed IAM roles"})}),"\n"]}),"\n",(0,s.jsx)(e.h2,{id:"others",children:"Others"}),"\n",(0,s.jsxs)(e.ul,{children:["\n",(0,s.jsx)(e.li,{children:(0,s.jsx)(e.a,{href:"https://aws.amazon.com/blogs/mt/monitoring-hybrid-environments-using-amazon-managed-service-for-grafana/",children:"Monitoring hybrid environments"})}),"\n",(0,s.jsx)(e.li,{children:(0,s.jsx)(e.a,{href:"https://aws.amazon.com/blogs/opensource/how-to-manage-grafana-and-loki-in-a-regulated-multitenant-environment/",children:"Managing Grafana and Loki in a regulated multitenant environment"})}),"\n",(0,s.jsx)(e.li,{children:(0,s.jsx)(e.a,{href:"https://aws.amazon.com/blogs/containers/monitoring-amazon-eks-anywhere-using-amazon-managed-service-for-prometheus-and-amazon-managed-grafana/",children:"Monitoring Amazon EKS Anywhere using Amazon Managed Service for Prometheus and Amazon Managed Grafana"})}),"\n",(0,s.jsx)(e.li,{children:(0,s.jsx)(e.a,{href:"https://observability.workshop.aws/en/amg.html",children:"Workshop for Getting Started"})}),"\n"]})]})}function m(a={}){const{wrapper:e}={...(0,i.R)(),...a.components};return e?(0,s.jsx)(e,{...a,children:(0,s.jsx)(l,{...a})}):l(a)}},28453:(a,e,n)=>{n.d(e,{R:()=>t,x:()=>o});var s=n(96540);const i={},r=s.createContext(i);function t(a){const e=s.useContext(r);return s.useMemo((function(){return"function"==typeof a?a(e):{...e,...a}}),[e,a])}function o(a){let e;return e=a.disableParentContext?"function"==typeof a.components?a.components(i):a.components||i:t(a.components),s.createElement(r.Provider,{value:e},a.children)}}}]);
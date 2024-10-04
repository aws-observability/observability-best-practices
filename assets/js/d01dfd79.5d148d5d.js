"use strict";(self.webpackChunkobservability_best_practices=self.webpackChunkobservability_best_practices||[]).push([[7786],{44041:(a,e,n)=>{n.r(e),n.d(e,{assets:()=>c,contentTitle:()=>o,default:()=>h,frontMatter:()=>r,metadata:()=>i,toc:()=>d});var s=n(74848),t=n(28453);const r={},o="Amazon Managed Grafana - FAQ",i={id:"faq/amg",title:"Amazon Managed Grafana - FAQ",description:"Why should I choose Amazon Managed Grafana?",source:"@site/docs/faq/amg.md",sourceDirName:"faq",slug:"/faq/amg",permalink:"/observability-best-practices/faq/amg",draft:!1,unlisted:!1,editUrl:"https://github.com/aws-observability/observability-best-practices/blob/main/docusaurus/docs/faq/amg.md",tags:[],version:"current",frontMatter:{},sidebar:"faq",previous:{title:"Amazon Managed Service for Prometheus - FAQ",permalink:"/observability-best-practices/faq/amp"},next:{title:"AWS Distro for Open Telemetry (ADOT) -  FAQ",permalink:"/observability-best-practices/faq/adot"}},c={},d=[];function l(a){const e={a:"a",blockquote:"blockquote",h1:"h1",p:"p",strong:"strong",...(0,t.R)(),...a.components};return(0,s.jsxs)(s.Fragment,{children:[(0,s.jsx)(e.h1,{id:"amazon-managed-grafana---faq",children:"Amazon Managed Grafana - FAQ"}),"\n",(0,s.jsx)(e.p,{children:(0,s.jsx)(e.strong,{children:"Why should I choose Amazon Managed Grafana?"})}),"\n",(0,s.jsxs)(e.p,{children:[(0,s.jsx)(e.strong,{children:(0,s.jsx)(e.a,{href:"https://docs.aws.amazon.com/grafana/latest/userguide/disaster-recovery-resiliency.html",children:"High Availability"})}),": Amazon Managed Grafana workspaces are highly available with multi-az replication. Amazon Managed Grafana also continuously monitors for the health of workspaces and replaces unhealthy nodes, without impacting access to the workspaces. Amazon Managed Grafana manages the availability of compute and database nodes so customers don\u2019t have to manage the infrastructure resources required for the administration & maintenance."]}),"\n",(0,s.jsxs)(e.p,{children:[(0,s.jsx)(e.strong,{children:(0,s.jsx)(e.a,{href:"https://docs.aws.amazon.com/grafana/latest/userguide/security.html",children:"Data Security"})}),": Amazon Managed Grafana encrypts the data at rest without any special configuration, third-party tools, or additional cost. ",(0,s.jsx)(e.a,{href:"https://docs.aws.amazon.com/grafana/latest/userguide/infrastructure-security.html",children:"Data in-transit"})," area also encrypted via TLS."]}),"\n",(0,s.jsx)(e.p,{children:(0,s.jsx)(e.strong,{children:"Which AWS regions are supported?"})}),"\n",(0,s.jsxs)(e.p,{children:["Current list of supported Regions is available in the ",(0,s.jsx)(e.a,{href:"https://docs.aws.amazon.com/grafana/latest/userguide/what-is-Amazon-Managed-Service-Grafana.html#AMG-supported-Regions",children:"Supported Regions section in the documentation."})]}),"\n",(0,s.jsx)(e.p,{children:(0,s.jsx)(e.strong,{children:"We have multiple AWS accounts in multiple regions in our Organization, does Amazon Managed Grafana work for these scenarios"})}),"\n",(0,s.jsxs)(e.p,{children:["Amazon Managed Grafana integrates with ",(0,s.jsx)(e.a,{href:"https://docs.aws.amazon.com/organizations/latest/userguide/orgs_introduction.html",children:"AWS Organizations"})," to discover AWS accounts and resources in Organizational Units (OUs). With AWS Organizations customers can ",(0,s.jsx)(e.a,{href:"https://docs.aws.amazon.com/grafana/latest/userguide/AMG-and-Organizations.html",children:"centrally manage data source configuration and permission settings"})," for multiple AWS accounts."]}),"\n",(0,s.jsx)(e.p,{children:(0,s.jsx)(e.strong,{children:"What data sources are supported in Amazon Managed Grafana?"})}),"\n",(0,s.jsxs)(e.p,{children:["Data sources are storage backends that customers can query in Grafana to build dashboards in Amazon Managed Grafana. Amazon Managed Grafana supports about ",(0,s.jsx)(e.a,{href:"https://docs.aws.amazon.com/grafana/latest/userguide/AMG-data-sources-builtin.html",children:"30+ built-in data sources"})," including AWS native services like Amazon CloudWatch, Amazon OpenSearch Service, AWS IoT SiteWise, AWS IoT TwinMaker, Amazon Managed Service for Prometheus, Amazon Timestream, Amazon Athena, Amazon Redshift, AWS X-Ray and many others. Additionally, ",(0,s.jsx)(e.a,{href:"https://docs.aws.amazon.com/grafana/latest/userguide/AMG-data-sources-enterprise.html",children:"about 15+ other data sources"})," are also available for upgraded workspaces in Grafana Enterprise."]}),"\n",(0,s.jsx)(e.p,{children:(0,s.jsx)(e.strong,{children:"Data sources of my workloads are in private VPCs. How do I connect them to Amazon Managed Grafana securely?"})}),"\n",(0,s.jsxs)(e.p,{children:["Private ",(0,s.jsx)(e.a,{href:"https://docs.aws.amazon.com/grafana/latest/userguide/AMG-configure-vpc.html",children:"data sources within a VPC"})," can be connected to Amazon Managed Grafana through AWS PrivateLink to keep the traffic secure. Further access control to Amazon Managed Grafana service from the ",(0,s.jsx)(e.a,{href:"https://docs.aws.amazon.com/grafana/latest/userguide/AMG-configure-nac.html",children:"VPC endpoints"})," can be restricted by attaching an ",(0,s.jsx)(e.a,{href:"https://docs.aws.amazon.com/grafana/latest/userguide/VPC-endpoints.html#controlling-vpc",children:"IAM resource policy"})," for ",(0,s.jsx)(e.a,{href:"https://docs.aws.amazon.com/whitepapers/latest/aws-privatelink/what-are-vpc-endpoints.html",children:"Amazon VPC endpoints"}),"."]}),"\n",(0,s.jsx)(e.p,{children:(0,s.jsx)(e.strong,{children:"What User Authentication mechanism is available in Amazon Managed Grafana?"})}),"\n",(0,s.jsxs)(e.p,{children:["In Amazon Managed Grafana workspace, ",(0,s.jsx)(e.a,{href:"https://docs.aws.amazon.com/grafana/latest/userguide/authentication-in-AMG.html",children:"users are authenticated to the Grafana console"})," by single sign-on using any IDP that supports Security Assertion Markup Language 2.0 (SAML 2.0) or AWS IAM Identity Center (successor to AWS Single Sign-On)."]}),"\n",(0,s.jsxs)(e.blockquote,{children:["\n",(0,s.jsxs)(e.p,{children:["Related blog: ",(0,s.jsx)(e.a,{href:"https://aws.amazon.com/blogs/mt/fine-grained-access-control-in-amazon-managed-grafana-using-grafana-teams/",children:"Fine-grained access control in Amazon Managed Grafana using Grafana Teams"})]}),"\n"]}),"\n",(0,s.jsx)(e.p,{children:(0,s.jsx)(e.strong,{children:"What kind of automation support is available for Amazon Managed Grafana?"})}),"\n",(0,s.jsxs)(e.p,{children:["Amazon Managed Grafana is ",(0,s.jsx)(e.a,{href:"https://docs.aws.amazon.com/grafana/latest/userguide/creating-resources-with-cloudformation.html",children:"integrated with AWS CloudFormation"}),", which helps customers in modeling and setting up AWS resources so that customers can spend less time creating and managing resources and infrastructure in AWS. With ",(0,s.jsx)(e.a,{href:"https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/Welcome.html",children:"AWS CloudFormation"})," customers can reuse templates to set up Amazon Managed Grafana resources consistently and repeatedly. Amazon Managed Grafana also has ",(0,s.jsx)(e.a,{href:"https://docs.aws.amazon.com/grafana/latest/APIReference/Welcome.html",children:"API"}),"available which supports customers in automating through ",(0,s.jsx)(e.a,{href:"https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-welcome.html",children:"AWS CLI"})," or integrating with software/products. Amazon Managed Grafana workspaces has ",(0,s.jsx)(e.a,{href:"https://docs.aws.amazon.com/grafana/latest/userguide/Using-Grafana-APIs.html",children:"HTTP APIs"})," for automation and integration support."]}),"\n",(0,s.jsxs)(e.blockquote,{children:["\n",(0,s.jsxs)(e.p,{children:["Related blog: ",(0,s.jsx)(e.a,{href:"https://aws.amazon.com/blogs/mt/announcing-private-vpc-data-source-support-for-amazon-managed-grafana/",children:"Announcing Private VPC data source support for Amazon Managed Grafana"})]}),"\n"]}),"\n",(0,s.jsxs)(e.p,{children:[(0,s.jsx)(e.strong,{children:"My Organization uses Terraform for automation. Does Amazon Managed Grafana support Terraform?"}),"\nYes, ",(0,s.jsx)(e.a,{href:"https://aws-observability.github.io/observability-best-practices/recipes/recipes/amg-automation-tf/",children:"Amazon Managed Grafana supports"})," Terraform for ",(0,s.jsx)(e.a,{href:"https://registry.terraform.io/modules/terraform-aws-modules/managed-service-grafana/aws/latest",children:"automation"})]}),"\n",(0,s.jsxs)(e.blockquote,{children:["\n",(0,s.jsxs)(e.p,{children:["Example: ",(0,s.jsx)(e.a,{href:"https://github.com/aws-observability/terraform-aws-observability-accelerator/tree/main/examples/managed-grafana-workspace",children:"Reference implementation for Terraform support"})]}),"\n"]}),"\n",(0,s.jsx)(e.p,{children:(0,s.jsx)(e.strong,{children:"I am using commonly used Dashboards in my current Grafana setup. Is there a way to use them on Amazon Managed Grafana rather than re-creating again?"})}),"\n",(0,s.jsxs)(e.p,{children:["Amazon Managed Grafana supports ",(0,s.jsx)(e.a,{href:"https://docs.aws.amazon.com/grafana/latest/userguide/Using-Grafana-APIs.html",children:"HTTP APIs"})," that allow you to easily automate deployment and management of Dashboards, users and much more. You can use these APIs in your GitOps/CICD processes to automate management of these resources."]}),"\n",(0,s.jsx)(e.p,{children:(0,s.jsx)(e.strong,{children:"Does Amazon Managed Grafana support Alerts?"})}),"\n",(0,s.jsxs)(e.p,{children:[(0,s.jsx)(e.a,{href:"https://docs.aws.amazon.com/grafana/latest/userguide/alerts-overview.html",children:"Amazon Managed Grafana alerting"})," provides customers with robust and actionable alerts that help learn about problems in the systems in near real time, minimizing disruption to services. Grafana includes access to an updated alerting system, Grafana alerting, that centralizes alerting information in a single, searchable view."]}),"\n",(0,s.jsx)(e.p,{children:(0,s.jsx)(e.strong,{children:"My Organization requires all actions be recorded for audits. Can Amazon Managed Grafana events be recorded?"})}),"\n",(0,s.jsxs)(e.p,{children:["Amazon Managed Grafana is integrated with ",(0,s.jsx)(e.a,{href:"https://docs.aws.amazon.com/awscloudtrail/latest/userguide/cloudtrail-user-guide.html",children:"AWS CloudTrail"}),", which provides a record of actions taken by a user, a role, or an AWS service in Amazon Managed Grafana. CloudTrail captures all ",(0,s.jsx)(e.a,{href:"https://docs.aws.amazon.com/grafana/latest/userguide/logging-using-cloudtrail.html",children:"API calls for Amazon Managed Grafana"}),"as events. The calls that are captured include calls from the Amazon Managed Grafana console and code calls to the Amazon Managed Grafana API operations."]}),"\n",(0,s.jsx)(e.p,{children:(0,s.jsx)(e.strong,{children:"What more information is available?"})}),"\n",(0,s.jsxs)(e.p,{children:["For additional information on Amazon Managed Grafana customers can read the AWS ",(0,s.jsx)(e.a,{href:"https://docs.aws.amazon.com/grafana/latest/userguide/what-is-Amazon-Managed-Service-Grafana.html",children:"Documentation"}),", go through the AWS Observability Workshop on ",(0,s.jsx)(e.a,{href:"https://catalog.workshops.aws/observability/en-US/aws-managed-oss/amg",children:"Amazon Managed Grafana"})," and also check the ",(0,s.jsx)(e.a,{href:"https://aws.amazon.com/grafana/",children:"product page"})," to know the ",(0,s.jsx)(e.a,{href:"https://aws.amazon.com/grafana/features/?nc=sn&loc=2",children:"features"}),", ",(0,s.jsx)(e.a,{href:"https://aws.amazon.com/grafana/pricing/?nc=sn&loc=3",children:"pricing"})," details, latest ",(0,s.jsx)(e.a,{href:"https://aws.amazon.com/grafana/resources/?nc=sn&loc=4&msg-blogs.sort-by=item.additionalFields.createdDate&msg-blogs.sort-order=desc#Latest_blog_posts",children:"blog posts"})," and ",(0,s.jsx)(e.a,{href:"https://aws.amazon.com/grafana/resources/?nc=sn&loc=4&msg-blogs.sort-by=item.additionalFields.createdDate&msg-blogs.sort-order=desc#Videos",children:"videos"}),"."]}),"\n",(0,s.jsxs)(e.p,{children:[(0,s.jsx)(e.strong,{children:"Product FAQ"})," ",(0,s.jsx)(e.a,{href:"https://aws.amazon.com/grafana/faqs/",children:"https://aws.amazon.com/grafana/faqs/"})]})]})}function h(a={}){const{wrapper:e}={...(0,t.R)(),...a.components};return e?(0,s.jsx)(e,{...a,children:(0,s.jsx)(l,{...a})}):l(a)}},28453:(a,e,n)=>{n.d(e,{R:()=>o,x:()=>i});var s=n(96540);const t={},r=s.createContext(t);function o(a){const e=s.useContext(r);return s.useMemo((function(){return"function"==typeof a?a(e):{...e,...a}}),[e,a])}function i(a){let e;return e=a.disableParentContext?"function"==typeof a.components?a.components(t):a.components||t:o(a.components),s.createElement(r.Provider,{value:e},a.children)}}}]);
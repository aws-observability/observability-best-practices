"use strict";(self.webpackChunkobservability_best_practices=self.webpackChunkobservability_best_practices||[]).push([[5459],{28453:(e,t,n)=>{n.d(t,{R:()=>i,x:()=>r});var o=n(96540);const a={},s=o.createContext(a);function i(e){const t=o.useContext(s);return o.useMemo((function(){return"function"==typeof e?e(t):{...t,...e}}),[t,e])}function r(e){let t;return t=e.disableParentContext?"function"==typeof e.components?e.components(a):e.components||a:i(e.components),o.createElement(s.Provider,{value:t},e.children)}},94631:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>c,contentTitle:()=>i,default:()=>h,frontMatter:()=>s,metadata:()=>r,toc:()=>l});var o=n(74848),a=n(28453);const s={},i="CloudWatch Agent",r={id:"tools/cloudwatch_agent",title:"CloudWatch Agent",description:"Deploying the CloudWatch agent",source:"@site/docs/tools/cloudwatch_agent.md",sourceDirName:"tools",slug:"/tools/cloudwatch_agent",permalink:"/observability-best-practices/tools/cloudwatch_agent",draft:!1,unlisted:!1,editUrl:"https://github.com/aws-observability/observability-best-practices/blob/main/docusaurus/docs/tools/cloudwatch_agent.md",tags:[],version:"current",frontMatter:{},sidebar:"tools",previous:{title:"AWS Observability Accelerator",permalink:"/observability-best-practices/tools/observability_accelerator"},next:{title:"Alarms",permalink:"/observability-best-practices/tools/alarms"}},c={},l=[{value:"Deploying the CloudWatch agent",id:"deploying-the-cloudwatch-agent",level:2},{value:"Deployment outside of AWS",id:"deployment-outside-of-aws",level:2},{value:"Use of private endpoints",id:"use-of-private-endpoints",level:2},{value:"From a VPC",id:"from-a-vpc",level:3},{value:"From on-premises or other cloud environments",id:"from-on-premises-or-other-cloud-environments",level:3}];function d(e){const t={a:"a",admonition:"admonition",em:"em",h1:"h1",h2:"h2",h3:"h3",li:"li",ol:"ol",p:"p",section:"section",sup:"sup",...(0,a.R)(),...e.components};return(0,o.jsxs)(o.Fragment,{children:[(0,o.jsx)(t.h1,{id:"cloudwatch-agent",children:"CloudWatch Agent"}),"\n",(0,o.jsx)(t.h2,{id:"deploying-the-cloudwatch-agent",children:"Deploying the CloudWatch agent"}),"\n",(0,o.jsxs)(t.p,{children:["The CloudWatch agent can be deployed as a single installation, using a distributed configuration file, layering multiple configuration files, and entirely though automation. Which approach is appropriate for you depends on your needs. ",(0,o.jsx)(t.sup,{children:(0,o.jsx)(t.a,{href:"#user-content-fn-1",id:"user-content-fnref-1","data-footnote-ref":!0,"aria-describedby":"footnote-label",children:"1"})})]}),"\n",(0,o.jsx)(t.admonition,{type:"info",children:(0,o.jsxs)(t.p,{children:["Deployment to Windows and Linux hosts both have the capability to store and retrieve their configurations into ",(0,o.jsx)(t.a,{href:"https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/install-CloudWatch-Agent-on-EC2-Instance-fleet.html",children:"Systems Manager Parameter Store"}),". Treating the deployment of CloudWatch agent configuration through this automated mechanism is a best practice."]})}),"\n",(0,o.jsx)(t.admonition,{type:"tip",children:(0,o.jsxs)(t.p,{children:["Alternatively, the configuration files for the CloudWatch agent can be deployed through the automation tool of your choice (",(0,o.jsx)(t.a,{href:"https://www.ansible.com",children:"Ansible"}),", ",(0,o.jsx)(t.a,{href:"https://puppet.com",children:"Puppet"}),", etc.). The use of Systems Manager Parameter Store is not required, though it does simplify management."]})}),"\n",(0,o.jsx)(t.h2,{id:"deployment-outside-of-aws",children:"Deployment outside of AWS"}),"\n",(0,o.jsxs)(t.p,{children:["The use of the CloudWatch agent is ",(0,o.jsx)(t.em,{children:"not"})," limited to within AWS, and is supported both on-premises and in other cloud environments. There are two additional considerations that must be heeded when using the CloudWatch agent outside of AWS though:"]}),"\n",(0,o.jsxs)(t.ol,{children:["\n",(0,o.jsxs)(t.li,{children:["Setting up IAM credentials",(0,o.jsx)(t.sup,{children:(0,o.jsx)(t.a,{href:"#user-content-fn-2",id:"user-content-fnref-2","data-footnote-ref":!0,"aria-describedby":"footnote-label",children:"2"})})," to allow agent to make required API calls. Even in EC2 there is no unauthenticated access to the CloudWatch APIs",(0,o.jsx)(t.sup,{children:(0,o.jsx)(t.a,{href:"#user-content-fn-5",id:"user-content-fnref-5","data-footnote-ref":!0,"aria-describedby":"footnote-label",children:"3"})}),"."]}),"\n",(0,o.jsxs)(t.li,{children:["Ensure agent has connectivity to CloudWatch, CloudWatch Logs, and other AWS endpoints",(0,o.jsx)(t.sup,{children:(0,o.jsx)(t.a,{href:"#user-content-fn-3",id:"user-content-fnref-3","data-footnote-ref":!0,"aria-describedby":"footnote-label",children:"4"})})," using a route that meets your requirements. This can be either through the Internet, using ",(0,o.jsx)(t.a,{href:"https://aws.amazon.com/directconnect/",children:"AWS Direct Connect"}),", or through a ",(0,o.jsx)(t.a,{href:"https://docs.aws.amazon.com/vpc/latest/privatelink/concepts.html",children:"private endpoint"})," (typically called a ",(0,o.jsx)(t.em,{children:"VPC endpoint"}),")."]}),"\n"]}),"\n",(0,o.jsx)(t.admonition,{type:"info",children:(0,o.jsx)(t.p,{children:"Transport between your environment(s) and CloudWatch needs to match your governance and security requirements. Broadly speaking, using private endpoints for workloads outside of AWS meets the needs of customers in even the most strictly regulated industries. However, the majority of customers will be served well through our public endpoints."})}),"\n",(0,o.jsx)(t.h2,{id:"use-of-private-endpoints",children:"Use of private endpoints"}),"\n",(0,o.jsxs)(t.p,{children:["In order to push metrics and logs, the CloudWatch agent must have connectivity to the ",(0,o.jsx)(t.em,{children:"CloudWatch"}),", and ",(0,o.jsx)(t.em,{children:"CloudWatch Logs"})," endpoints. There are several ways to achieve this based on where the agent is installed."]}),"\n",(0,o.jsx)(t.h3,{id:"from-a-vpc",children:"From a VPC"}),"\n",(0,o.jsxs)(t.p,{children:["a. You can make use of ",(0,o.jsx)(t.em,{children:"VPC Endpoints"})," (for CloudWatch and CloudWatch Logs) in order to establish fully private and secure connection between your VPC and CloudWatch for the agent running on EC2. With this approach, agent traffic never traverses the internet."]}),"\n",(0,o.jsxs)(t.p,{children:["b. Another alternative is to have a public ",(0,o.jsx)(t.a,{href:"https://docs.aws.amazon.com/vpc/latest/userguide/vpc-nat-gateway.html",children:"NAT gateway"})," through which private subnets can connect to the internet, but cannot receive unsolicited inbound connections from the internet."]}),"\n",(0,o.jsx)(t.admonition,{type:"note",children:(0,o.jsx)(t.p,{children:"Please note with this approach agent traffic will be logically routed via internet."})}),"\n",(0,o.jsxs)(t.p,{children:["c. If you don\u2019t have requirement to establish private or secure connectivity beyond the existing TLS and ",(0,o.jsx)(t.a,{href:"https://docs.aws.amazon.com/general/latest/gr/signature-version-4.html",children:"Sigv4"})," mechanisms, the easiest option is to have ",(0,o.jsx)(t.a,{href:"https://docs.aws.amazon.com/vpc/latest/userguide/VPC_Internet_Gateway.html",children:"Internet Gateway"})," to provide connectivity to our endpoints."]}),"\n",(0,o.jsx)(t.h3,{id:"from-on-premises-or-other-cloud-environments",children:"From on-premises or other cloud environments"}),"\n",(0,o.jsxs)(t.p,{children:["a. Agents running outside of AWS can establish connectivity to CloudWatch public endpoints over the internet(via their own network setup) or Direct Connect ",(0,o.jsx)(t.a,{href:"https://docs.aws.amazon.com/directconnect/latest/UserGuide/WorkingWithVirtualInterfaces.html",children:"Public VIF"}),"."]}),"\n",(0,o.jsxs)(t.p,{children:["b. If you require that agent traffic not route through the internet you can leverage ",(0,o.jsx)(t.a,{href:"https://docs.aws.amazon.com/vpc/latest/userguide/vpce-interface.html",children:"VPC Interface endpoints"}),", powered by AWS PrivateLink, to extend the private connectivity all the way to your on-premises network using Direct Connect Private VIF or VPN. Your traffic is not exposed to the internet, eliminating threat vectors."]}),"\n",(0,o.jsx)(t.admonition,{type:"success",children:(0,o.jsxs)(t.p,{children:["You can add ",(0,o.jsx)(t.a,{href:"https://aws.amazon.com/premiumsupport/knowledge-center/cloudwatch-on-premises-temp-credentials/",children:"ephemeral AWS access tokens"})," for use by the CloudWatch agent by using credentials obtained from the ",(0,o.jsx)(t.a,{href:"https://docs.aws.amazon.com/systems-manager/latest/userguide/ssm-agent.html",children:"AWS Systems Manager agent"}),"."]})}),"\n","\n",(0,o.jsxs)(t.section,{"data-footnotes":!0,className:"footnotes",children:[(0,o.jsx)(t.h2,{className:"sr-only",id:"footnote-label",children:"Footnotes"}),"\n",(0,o.jsxs)(t.ol,{children:["\n",(0,o.jsxs)(t.li,{id:"user-content-fn-1",children:["\n",(0,o.jsxs)(t.p,{children:["See ",(0,o.jsx)(t.a,{href:"https://aws.amazon.com/blogs/opensource/getting-started-with-open-source-amazon-cloudwatch-agent/",children:"Getting started with open source Amazon CloudWatch Agent"})," for a blog that gives guidance for CloudWatch agent use and deployment. ",(0,o.jsx)(t.a,{href:"#user-content-fnref-1","data-footnote-backref":"","aria-label":"Back to reference 1",className:"data-footnote-backref",children:"\u21a9"})]}),"\n"]}),"\n",(0,o.jsxs)(t.li,{id:"user-content-fn-2",children:["\n",(0,o.jsxs)(t.p,{children:[(0,o.jsx)(t.a,{href:"https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/install-CloudWatch-Agent-commandline-fleet.html#install-CloudWatch-Agent-iam_user-first",children:"Guidance on setting credentials for agents running on-premises and in other cloud environments"})," ",(0,o.jsx)(t.a,{href:"#user-content-fnref-2","data-footnote-backref":"","aria-label":"Back to reference 2",className:"data-footnote-backref",children:"\u21a9"})]}),"\n"]}),"\n",(0,o.jsxs)(t.li,{id:"user-content-fn-5",children:["\n",(0,o.jsxs)(t.p,{children:["Use of all AWS APIs related to observability is typically accomplished by an ",(0,o.jsx)(t.a,{href:"https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_use_switch-role-ec2_instance-profiles.html",children:"instance profile"})," - a mechanism to grant temporary access credentials to instances and containers running in AWS. ",(0,o.jsx)(t.a,{href:"#user-content-fnref-5","data-footnote-backref":"","aria-label":"Back to reference 3",className:"data-footnote-backref",children:"\u21a9"})]}),"\n"]}),"\n",(0,o.jsxs)(t.li,{id:"user-content-fn-3",children:["\n",(0,o.jsxs)(t.p,{children:[(0,o.jsx)(t.a,{href:"https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/install-CloudWatch-Agent-commandline-fleet.html#install-CloudWatch-Agent-internet-access-first-cmd",children:"How to verify connectivity to the CloudWatch endpoints"})," ",(0,o.jsx)(t.a,{href:"#user-content-fnref-3","data-footnote-backref":"","aria-label":"Back to reference 4",className:"data-footnote-backref",children:"\u21a9"})]}),"\n"]}),"\n"]}),"\n"]})]})}function h(e={}){const{wrapper:t}={...(0,a.R)(),...e.components};return t?(0,o.jsx)(t,{...e,children:(0,o.jsx)(d,{...e})}):d(e)}}}]);
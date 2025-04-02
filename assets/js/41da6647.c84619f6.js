"use strict";(self.webpackChunkobservability_best_practices=self.webpackChunkobservability_best_practices||[]).push([[156],{28453:(e,n,i)=>{i.d(n,{R:()=>o,x:()=>c});var t=i(96540);const s={},r=t.createContext(s);function o(e){const n=t.useContext(r);return t.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function c(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(s):e.components||s:o(e.components),t.createElement(r.Provider,{value:n},e.children)}},44224:(e,n,i)=>{i.r(n),i.d(n,{assets:()=>l,contentTitle:()=>c,default:()=>h,frontMatter:()=>o,metadata:()=>t,toc:()=>a});const t=JSON.parse('{"id":"recipes/recipes/amg-subnet-free-ip-monitoring","title":"Monitoring Free IP in Subnet","description":"In this recipe we show you how to setup monitoring stack to monitor for available IPs in the subnet.","source":"@site/docs/recipes/recipes/amg-subnet-free-ip-monitoring.md","sourceDirName":"recipes/recipes","slug":"/recipes/recipes/amg-subnet-free-ip-monitoring","permalink":"/observability-best-practices/recipes/recipes/amg-subnet-free-ip-monitoring","draft":false,"unlisted":false,"editUrl":"https://github.com/aws-observability/observability-best-practices/blob/main/docusaurus/docs/recipes/recipes/amg-subnet-free-ip-monitoring.md","tags":[],"version":"current","frontMatter":{}}');var s=i(74848),r=i(28453);const o={},c="Monitoring Free IP in Subnet",l={},a=[{value:"Infrastructure",id:"infrastructure",level:2},{value:"Prerequisites",id:"prerequisites",level:3},{value:"Install dependencies",id:"install-dependencies",level:3},{value:"Modify config file",id:"modify-config-file",level:3},{value:"Deploy stack",id:"deploy-stack",level:3},{value:"Cleanup",id:"cleanup",level:2}];function d(e){const n={a:"a",admonition:"admonition",code:"code",h1:"h1",h2:"h2",h3:"h3",header:"header",li:"li",p:"p",pre:"pre",ul:"ul",...(0,r.R)(),...e.components};return(0,s.jsxs)(s.Fragment,{children:[(0,s.jsx)(n.header,{children:(0,s.jsx)(n.h1,{id:"monitoring-free-ip-in-subnet",children:"Monitoring Free IP in Subnet"})}),"\n",(0,s.jsx)(n.p,{children:"In this recipe we show you how to setup monitoring stack to monitor for available IPs in the subnet."}),"\n",(0,s.jsxs)(n.p,{children:["We will be setting up a stack using ",(0,s.jsx)(n.a,{href:"https://aws.amazon.com/cdk/",children:"AWS Cloud Development Kit (CDK)"})," to create a Lambda, cloudwatch dashboard and a cloudwatch alarm for monitoring available free IPs in the subnet."]}),"\n",(0,s.jsx)(n.admonition,{type:"note",children:(0,s.jsx)(n.p,{children:"This guide will take approximately 30 minutes to complete."})}),"\n",(0,s.jsx)(n.h2,{id:"infrastructure",children:"Infrastructure"}),"\n",(0,s.jsx)(n.p,{children:"In the following section we will be setting up the infrastructure for this recipe."}),"\n",(0,s.jsxs)(n.p,{children:["The lambda deployed here will be calling EC2 APIs at an interval and will emitting free IP metrics to ",(0,s.jsx)(n.a,{href:"https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/working_with_metrics.html",children:"Cloudwatch Metrics"}),"."]}),"\n",(0,s.jsx)(n.h3,{id:"prerequisites",children:"Prerequisites"}),"\n",(0,s.jsxs)(n.ul,{children:["\n",(0,s.jsxs)(n.li,{children:["The AWS CLI is ",(0,s.jsx)(n.a,{href:"https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-install.html",children:"installed"})," and ",(0,s.jsx)(n.a,{href:"https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-configure.html",children:"configured"})," in your environment."]}),"\n",(0,s.jsxs)(n.li,{children:["The ",(0,s.jsx)(n.a,{href:"https://docs.aws.amazon.com/cdk/latest/guide/work-with-cdk-typescript.html",children:"AWS CDK Typescript"})," is installed in your environment."]}),"\n",(0,s.jsx)(n.li,{children:"Node.js."}),"\n",(0,s.jsxs)(n.li,{children:["The ",(0,s.jsx)(n.a,{href:"https://github.com/aws-observability/observability-best-practices/",children:"repo"})," has been cloned to your local machine. The code for this project is under ",(0,s.jsx)(n.code,{children:"/sandbox/grafana_subnet_ip_monitoring"}),"."]}),"\n"]}),"\n",(0,s.jsx)(n.h3,{id:"install-dependencies",children:"Install dependencies"}),"\n",(0,s.jsx)(n.p,{children:"Change your directory to grafana_subnet_ip_monitoring via the command:"}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{children:"cd sandbox/grafana_subnet_ip_monitoring\n"})}),"\n",(0,s.jsx)(n.p,{children:"This will now be considered the root of the repo, going forward."}),"\n",(0,s.jsx)(n.p,{children:"Install the CDK dependencies via the following command:"}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{children:"npm install\n"})}),"\n",(0,s.jsx)(n.p,{children:"All the dependencies are now installed."}),"\n",(0,s.jsx)(n.h3,{id:"modify-config-file",children:"Modify config file"}),"\n",(0,s.jsxs)(n.p,{children:["In the root of the repo, open ",(0,s.jsx)(n.code,{children:"lib/vpc_monitoring_stack.ts"})," and modify the ",(0,s.jsx)(n.code,{children:"subnetIds"}),", ",(0,s.jsx)(n.code,{children:"alarmEmail"})," and ",(0,s.jsx)(n.code,{children:"monitoringFrequencyMinutes"})," based on your requirement."]}),"\n",(0,s.jsx)(n.p,{children:"For example, modify the following like the one given below:"}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{children:"    const subnet_monitoring_stack = new SubnetMonitoringStack(this, 'SubnetIpMonitoringStack', {\n      env: { \n        account: process.env.CDK_DEFAULT_ACCOUNT, \n        region: process.env.CDK_DEFAULT_REGION \n      },\n      subnetIds: [\n        'subnet-03e46f16d7dc01c0a', // Replace with your subnet IDs\n        'subnet-0713ae10e4a8da850',\n        'subnet-00a36dd76f1c51d97'\n      ],\n      ipThreshold: 50, // Alert when available IPs drop below 50\n      alarmEmail: 'abc123@email.com', // Replace your email\n      monitoringFrequencyMinutes: 5, // Check every 5 minutes\n      evaluationPeriods: 2 // Require 2 consecutive breaches to trigger alarm\n    });\n"})}),"\n",(0,s.jsx)(n.h3,{id:"deploy-stack",children:"Deploy stack"}),"\n",(0,s.jsx)(n.p,{children:"Once the above changes are made, it is time to deploy the stack to CloudFormation. To deploy CDK stack run the follwong command:"}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{children:"cdk bootstrap\ncdk deploy --all\n"})}),"\n",(0,s.jsx)(n.h2,{id:"cleanup",children:"Cleanup"}),"\n",(0,s.jsx)(n.p,{children:"Delete the CloudFormation stack:"}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{children:"cdk destroy\n"})})]})}function h(e={}){const{wrapper:n}={...(0,r.R)(),...e.components};return n?(0,s.jsx)(n,{...e,children:(0,s.jsx)(d,{...e})}):d(e)}}}]);
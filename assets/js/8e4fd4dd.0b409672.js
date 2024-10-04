"use strict";(self.webpackChunkobservability_best_practices=self.webpackChunkobservability_best_practices||[]).push([[2688],{36373:(e,n,t)=>{t.r(n),t.d(n,{assets:()=>c,contentTitle:()=>r,default:()=>l,frontMatter:()=>o,metadata:()=>s,toc:()=>h});var i=t(74848),a=t(28453);const o={},r="Monitoring hybrid environments using Amazon Managed Service for Grafana",s={id:"recipes/recipes/monitoring-hybridenv-amg",title:"Monitoring hybrid environments using Amazon Managed Service for Grafana",description:"In this recipe we show you how to visualize metrics from an Azure Cloud environment to Amazon Managed Service for Grafana (AMG) and create alert notifications in AMG to be sent to Amazon Simple Notification Service and Slack.",source:"@site/docs/recipes/recipes/monitoring-hybridenv-amg.md",sourceDirName:"recipes/recipes",slug:"/recipes/recipes/monitoring-hybridenv-amg",permalink:"/observability-best-practices/docs/recipes/recipes/monitoring-hybridenv-amg",draft:!1,unlisted:!1,editUrl:"https://github.com/aws-observability/observability-best-practices/blob/main/docusaurus/docs/recipes/recipes/monitoring-hybridenv-amg.md",tags:[],version:"current",frontMatter:{}},c={},h=[{value:"Infrastructure",id:"infrastructure",level:2},{value:"Prerequisites",id:"prerequisites",level:3},{value:"Architecture",id:"architecture",level:3},{value:"Configure the data source and custom dashboard",id:"configure-the-data-source-and-custom-dashboard",level:3},{value:"Configure the notification channels on AMG",id:"configure-the-notification-channels-on-amg",level:3},{value:"Slack notification channel",id:"slack-notification-channel",level:3},{value:"Configure alerts in AMG",id:"configure-alerts-in-amg",level:3},{value:"Conclusion",id:"conclusion",level:2}];function d(e){const n={a:"a",admonition:"admonition",code:"code",h1:"h1",h2:"h2",h3:"h3",img:"img",li:"li",mdxAdmonitionTitle:"mdxAdmonitionTitle",p:"p",pre:"pre",ul:"ul",...(0,a.R)(),...e.components};return(0,i.jsxs)(i.Fragment,{children:[(0,i.jsx)(n.h1,{id:"monitoring-hybrid-environments-using-amazon-managed-service-for-grafana",children:"Monitoring hybrid environments using Amazon Managed Service for Grafana"}),"\n",(0,i.jsxs)(n.p,{children:["In this recipe we show you how to visualize metrics from an Azure Cloud environment to ",(0,i.jsx)(n.a,{href:"https://aws.amazon.com/grafana/",children:"Amazon Managed Service for Grafana"})," (AMG) and create alert notifications in AMG to be sent to ",(0,i.jsx)(n.a,{href:"https://docs.aws.amazon.com/sns/latest/dg/welcome.html",children:"Amazon Simple Notification Service"})," and Slack."]}),"\n",(0,i.jsx)(n.p,{children:"As part of the implementation, we will create an AMG workspace, configure the Azure Monitor plugin as the data source for AMG and configure the Grafana dashboard. We will be creating two notification channels: one for Amazon SNS and one for slack.We will also configure alerts in the AMG dashboard to be sent to the notification channels."}),"\n",(0,i.jsx)(n.admonition,{type:"note",children:(0,i.jsx)(n.p,{children:"This guide will take approximately 30 minutes to complete."})}),"\n",(0,i.jsx)(n.h2,{id:"infrastructure",children:"Infrastructure"}),"\n",(0,i.jsx)(n.p,{children:"In the following section we will be setting up the infrastructure for this recipe."}),"\n",(0,i.jsx)(n.h3,{id:"prerequisites",children:"Prerequisites"}),"\n",(0,i.jsxs)(n.ul,{children:["\n",(0,i.jsxs)(n.li,{children:["The AWS CLI is ",(0,i.jsx)(n.a,{href:"https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-install.html",children:"installed"})," and ",(0,i.jsx)(n.a,{href:"https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-configure.html",children:"configured"})," in your environment."]}),"\n",(0,i.jsxs)(n.li,{children:["You need to enable ",(0,i.jsx)(n.a,{href:"https://docs.aws.amazon.com/singlesignon/latest/userguide/step1.html",children:"AWS-SSO"})]}),"\n"]}),"\n",(0,i.jsx)(n.h3,{id:"architecture",children:"Architecture"}),"\n",(0,i.jsxs)(n.p,{children:["First, create an AMG workspace to visualize the metrics from Azure Monitor. Follow the steps in the ",(0,i.jsx)(n.a,{href:"https://aws.amazon.com/blogs/mt/amazon-managed-grafana-getting-started/",children:"Getting Started with Amazon Managed Service for Grafana"})," blog post. After you create the workspace, you can assign access to the Grafana workspace to an individual user or a user group. By default, the user has a user type of viewer. Change the user type based on the user role."]}),"\n",(0,i.jsxs)(n.admonition,{type:"note",children:[(0,i.jsx)(n.mdxAdmonitionTitle,{}),(0,i.jsx)(n.p,{children:"You must assign an Admin role to at least one user in the workspace."})]}),"\n",(0,i.jsxs)(n.p,{children:["In Figure 1, the user name is grafana-admin. The user type is Admin. On the Data sources tab, choose the required data source. Review the configuration, and then choose Create workspace.\n",(0,i.jsx)(n.img,{alt:"azure-monitor-grafana-demo",src:t(14411).A+"",width:"1540",height:"680"})]}),"\n",(0,i.jsx)(n.h3,{id:"configure-the-data-source-and-custom-dashboard",children:"Configure the data source and custom dashboard"}),"\n",(0,i.jsxs)(n.p,{children:["Now, under Data sources, configure the Azure Monitor plugin to start querying and visualizing the metrics from the Azure environment. Choose Data sources to add a data source.\n",(0,i.jsx)(n.img,{alt:"datasources",src:t(97589).A+"",width:"602",height:"528"})]}),"\n",(0,i.jsxs)(n.p,{children:["In Add data source, search for Azure Monitor and then configure the parameters from the app registration console in the Azure environment.\n",(0,i.jsx)(n.img,{alt:"Add data source",src:t(2144).A+"",width:"1536",height:"526"})]}),"\n",(0,i.jsxs)(n.p,{children:["To configure the Azure Monitor plugin, you need the directory (tenant) ID and the application (client) ID. For instructions, see the ",(0,i.jsx)(n.a,{href:"https://docs.microsoft.com/en-us/azure/active-directory/develop/howto-create-service-principal-portal",children:"article"})," about creating an Azure AD application and service principal. It explains how to register the app and grant access to Grafana to query the data."]}),"\n",(0,i.jsx)(n.p,{children:(0,i.jsx)(n.img,{alt:"Azure-Monitor-metrics",src:t(70420).A+"",width:"1542",height:"806"})}),"\n",(0,i.jsx)(n.p,{children:"After the data source is configured, import a custom dashboard to analyze the Azure metrics. In the left pane, choose the + icon, and then choose Import."}),"\n",(0,i.jsx)(n.p,{children:"In Import via grafana.com, enter the dashboard ID, 10532."}),"\n",(0,i.jsx)(n.p,{children:(0,i.jsx)(n.img,{alt:"Importing-dashboard",src:t(46446).A+"",width:"1190",height:"322"})}),"\n",(0,i.jsx)(n.p,{children:"This will import the Azure Virtual Machine dashboard where you can start analyzing the Azure Monitor metrics. In my setup, I have a virtual machine running in the Azure environment."}),"\n",(0,i.jsx)(n.p,{children:(0,i.jsx)(n.img,{alt:"Azure-Monitor-Dashbaord",src:t(33462).A+"",width:"1544",height:"728"})}),"\n",(0,i.jsx)(n.h3,{id:"configure-the-notification-channels-on-amg",children:"Configure the notification channels on AMG"}),"\n",(0,i.jsx)(n.p,{children:"In this section, you\u2019ll configure two notifications channels and then send alerts."}),"\n",(0,i.jsx)(n.p,{children:"Use the following command to create an SNS topic named grafana-notification and subscribe an email address."}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{children:"aws sns create-topic --name grafana-notification\naws sns subscribe --topic-arn arn:aws:sns:<region>:<account-id>:grafana-notification --protocol email --notification-endpoint <email-id>\n\n"})}),"\n",(0,i.jsx)(n.p,{children:"In the left pane, choose the bell icon to add a new notification channel.\nNow configure the grafana-notification notification channel. On Edit notification channel, for Type, choose AWS SNS. For Topic, use the ARN of the SNS topic you just created. For Auth Provider, choose the workspace IAM role."}),"\n",(0,i.jsx)(n.p,{children:(0,i.jsx)(n.img,{alt:"Notification Channels",src:t(35134).A+"",width:"1004",height:"932"})}),"\n",(0,i.jsx)(n.h3,{id:"slack-notification-channel",children:"Slack notification channel"}),"\n",(0,i.jsxs)(n.p,{children:["To configure a Slack notification channel, create a Slack workspace or use an existing one. Enable Incoming Webhooks as described in ",(0,i.jsx)(n.a,{href:"https://api.slack.com/messaging/webhooks",children:"Sending messages using Incoming Webhooks"}),"."]}),"\n",(0,i.jsx)(n.p,{children:"After you\u2019ve configured the workspace, you should be able to get a webhook URL that will be used in the Grafana dashboard."}),"\n",(0,i.jsx)(n.p,{children:(0,i.jsx)(n.img,{alt:"Slack notification Channel",src:t(94066).A+"",width:"1012",height:"928"})}),"\n",(0,i.jsx)(n.h3,{id:"configure-alerts-in-amg",children:"Configure alerts in AMG"}),"\n",(0,i.jsx)(n.p,{children:"You can configure Grafana alerts when the metric increases beyond the threshold. With AMG, you can configure how often the alert must be evaluated in the dashboard and send the notification. In this example, configure an alert for CPU utilization for an Azure virtual machine. When the utilization exceeds a threshold, configure AMG to send notifications to both channels."}),"\n",(0,i.jsx)(n.p,{children:"In the dashboard, choose CPU utilization from the dropdown, and then choose Edit. On the Alert tab of the graph panel, configure how often the alert rule should be evaluated and the conditions that must be met for the alert to change state and initiate its notifications."}),"\n",(0,i.jsx)(n.p,{children:"In the following configuration, an alert is created if the CPU utilization exceeds 50%. Notifications will be sent to the grafana-alert-notification and slack-alert-notification channels."}),"\n",(0,i.jsx)(n.p,{children:(0,i.jsx)(n.img,{alt:"Azure VM Edit panel",src:t(78759).A+"",width:"1546",height:"996"})}),"\n",(0,i.jsx)(n.p,{children:"Now, you can sign in to the Azure virtual machine and initiate stress testing using tools like stress. When the CPU utilization exceeds the threshold, you will receive notifications on both channels."}),"\n",(0,i.jsx)(n.p,{children:"Now configure alerts for CPU utilization with the right threshold to simulate an alert that is sent to the Slack channel."}),"\n",(0,i.jsx)(n.h2,{id:"conclusion",children:"Conclusion"}),"\n",(0,i.jsx)(n.p,{children:"In the recipe, we showed you how to deploy the AMG workspace, configure notification channels, collect metrics from Azure Cloud, and configure alerts on the AMG dashboard. Because AMG is a fully managed, serverless solution, you can spend your time on the applications that transform your business and leave the heavy lifting of managing Grafana to AWS."})]})}function l(e={}){const{wrapper:n}={...(0,a.R)(),...e.components};return n?(0,i.jsx)(n,{...e,children:(0,i.jsx)(d,{...e})}):d(e)}},78759:(e,n,t)=>{t.d(n,{A:()=>i});const i=t.p+"assets/images/alert-config-d2b8d82a011d0ad24a6962f559c2215c.png"},33462:(e,n,t)=>{t.d(n,{A:()=>i});const i=t.p+"assets/images/azure-dashboard-d115b789dd1d14cf751217514d9bc43b.png"},14411:(e,n,t)=>{t.d(n,{A:()=>i});const i=t.p+"assets/images/azure-monitor-grafana-2fdd4e5b6cd578cd3503aa8e37838bd9.png"},70420:(e,n,t)=>{t.d(n,{A:()=>i});const i=t.p+"assets/images/azure-monitor-metrics-b8732b8c2a52f3c8b2a180c17816e1bf.png"},2144:(e,n,t)=>{t.d(n,{A:()=>i});const i=t.p+"assets/images/datasource-addition-30005cf9df725c29982bda9011c04bb1.png"},97589:(e,n,t)=>{t.d(n,{A:()=>i});const i=t.p+"assets/images/datasource-34ea908e68bcf97725782e0dd83b4185.png"},46446:(e,n,t)=>{t.d(n,{A:()=>i});const i=t.p+"assets/images/import-dashboard-23920a9362a89085cd907e27531bd6d5.png"},35134:(e,n,t)=>{t.d(n,{A:()=>i});const i=t.p+"assets/images/notification-channels-6514412a0a85486cd8b7b48650be919b.png"},94066:(e,n,t)=>{t.d(n,{A:()=>i});const i=t.p+"assets/images/slack-notification-87133c013e3f476bfee13e9a771f09e3.png"},28453:(e,n,t)=>{t.d(n,{R:()=>r,x:()=>s});var i=t(96540);const a={},o=i.createContext(a);function r(e){const n=i.useContext(o);return i.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function s(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(a):e.components||a:r(e.components),i.createElement(o.Provider,{value:n},e.children)}}}]);
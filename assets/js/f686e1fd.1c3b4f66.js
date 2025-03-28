"use strict";(self.webpackChunkobservability_best_practices=self.webpackChunkobservability_best_practices||[]).push([[4201],{14661:(e,n,r)=>{r.r(n),r.d(n,{assets:()=>i,contentTitle:()=>c,default:()=>d,frontMatter:()=>o,metadata:()=>t,toc:()=>l});const t=JSON.parse('{"id":"patterns/ampxa","title":"Amazon Managed Prometheus Cross Account Scraping","description":"Amazon Managed Service for Prometheus provides a fully managed, agent less scraper, or collector, that automatically discovers and pulls Prometheus-compatible metrics. You don\'t have to manage, install, patch, or maintain agents or scrapers. An Amazon Managed Service for Prometheus collector provides reliable, stable, highly available, automatically scaled collection of metrics for your Amazon EKS cluster. Amazon Managed Service for Prometheus managed collectors work with Amazon EKS clusters, including EC2 and Fargate.","source":"@site/docs/patterns/ampxa.md","sourceDirName":"patterns","slug":"/patterns/ampxa","permalink":"/observability-best-practices/patterns/ampxa","draft":false,"unlisted":false,"editUrl":"https://github.com/aws-observability/observability-best-practices/blob/main/docusaurus/docs/patterns/ampxa.md","tags":[],"version":"current","frontMatter":{},"sidebar":"patterns","previous":{"title":"Pushing Metrics from EKS to Prometheus","permalink":"/observability-best-practices/patterns/ampagentless"},"next":{"title":"APM with Application Signals","permalink":"/observability-best-practices/patterns/apmappsignals"}}');var a=r(74848),s=r(28453);const o={},c="Amazon Managed Prometheus Cross Account Scraping",i={},l=[{value:"High Level Architecture",id:"high-level-architecture",level:2}];function u(e){const n={admonition:"admonition",code:"code",em:"em",h1:"h1",h2:"h2",header:"header",img:"img",li:"li",ol:"ol",p:"p",pre:"pre",...(0,s.R)(),...e.components};return(0,a.jsxs)(a.Fragment,{children:[(0,a.jsx)(n.header,{children:(0,a.jsx)(n.h1,{id:"amazon-managed-prometheus-cross-account-scraping",children:"Amazon Managed Prometheus Cross Account Scraping"})}),"\n",(0,a.jsx)(n.p,{children:"Amazon Managed Service for Prometheus provides a fully managed, agent less scraper, or collector, that automatically discovers and pulls Prometheus-compatible metrics. You don't have to manage, install, patch, or maintain agents or scrapers. An Amazon Managed Service for Prometheus collector provides reliable, stable, highly available, automatically scaled collection of metrics for your Amazon EKS cluster. Amazon Managed Service for Prometheus managed collectors work with Amazon EKS clusters, including EC2 and Fargate."}),"\n",(0,a.jsx)(n.p,{children:"An Amazon Managed Service for Prometheus collector creates an Elastic Network Interface (ENI) per subnet specified when creating the scraper. The collector scrapes the metrics through these ENIs, and uses remote_write to push the data to your Amazon Managed Service for Prometheus workspace using a VPC endpoint. The scraped data never travels on the public internet."}),"\n",(0,a.jsx)(n.p,{children:"To create a scraper in a cross-account setup when your Amazon EKS cluster from which you want to collect metrics is in a different account (Source Account) from the Amazon Managed Service for Prometheus workspace (Target Account), use the procedure below."}),"\n",(0,a.jsx)(n.h2,{id:"high-level-architecture",children:"High Level Architecture"}),"\n",(0,a.jsxs)(n.p,{children:[(0,a.jsx)(n.img,{alt:"AMP Managed Collector Cross Account Scraping",src:r(44938).A+"",width:"4528",height:"1310"}),"\n",(0,a.jsx)(n.em,{children:"Figure 1: AMP Managed Collector Cross Account Scraping, Collector Infrastructure is Completely Managed by AWS"})]}),"\n",(0,a.jsx)(n.p,{children:"In this architecture we create scrapers in the account where the EKS workload exists. The scrapers can assume a role in the target account in order to push data to the AMP workspace in the target account."}),"\n",(0,a.jsxs)(n.ol,{children:["\n",(0,a.jsxs)(n.li,{children:["In the source account, create a role arn:aws:iam::account_id_source",":role","/Source with STS::AssumeRole permissions and add the following trust policy."]}),"\n"]}),"\n",(0,a.jsx)(n.pre,{children:(0,a.jsx)(n.code,{children:'{\n    "Version": "2012-10-17",\n    "Statement": [\n        {\n            "Sid": "",\n            "Effect": "Allow",\n            "Principal": {\n                "Service": "scraper.aps.amazonaws.com"\n            },\n            "Action": "sts:AssumeRole",\n            "Condition": {\n                "ArnEquals": {\n                    "aws:SourceArn": "$SCRAPER_ARN"\n                },\n                "StringEquals": {\n                    "AWS:SourceAccount": "$ACCOUNT_ID"\n                }\n            }\n        }\n    ]\n}\n'})}),"\n",(0,a.jsx)(n.p,{children:"You also need an assume role permissions policy:"}),"\n",(0,a.jsx)(n.pre,{children:(0,a.jsx)(n.code,{children:'{\n    "Version": "2012-10-17",\n    "Statement": [\n        {\n            "Sid": "VisualEditor0",\n            "Effect": "Allow",\n            "Action": "sts:AssumeRole",\n            "Resource": "$TARGET_ACCOUNT_ROLE_ARN"\n        }\n    ]\n}\n'})}),"\n",(0,a.jsx)(n.admonition,{type:"warning",children:(0,a.jsx)(n.p,{children:"We have to make the IAM constructs before we can actually make the scraper. Therefore at this point the $SCRAPER_ARN is just a placeholder field. After we create the scraper we will go back and update it. The $TARGET_ACCOUNT_ROLE_ARN also does not exist until step 2 is completed."})}),"\n",(0,a.jsxs)(n.ol,{start:"2",children:["\n",(0,a.jsxs)(n.li,{children:["On every combination of source (Amazon EKS cluster) and target (Amazon Managed Service for Prometheus workspace), you need to create a role in the TARGET account of arn:aws:iam::account_id_target",":role","/Target and add the following trust policy with managed permissions policy for AmazonPrometheusRemoteWriteAccess."]}),"\n"]}),"\n",(0,a.jsx)(n.pre,{children:(0,a.jsx)(n.code,{children:'{\n  "Effect": "Allow",\n  "Principal": {\n     "AWS": "arn:aws:iam::account_id_source:role/Source"\n  },\n  "Action": "sts:AssumeRole",\n  "Condition": {\n     "StringEquals": {\n        "sts:ExternalId": "$SCRAPER_ARN"\n      }\n  }\n}\n'})}),"\n",(0,a.jsx)(n.admonition,{type:"warning",children:(0,a.jsx)(n.p,{children:"$SCRAPER_ARN is still just a placeholder. We will update the value after creating the scraper."})}),"\n",(0,a.jsxs)(n.ol,{start:"3",children:["\n",(0,a.jsx)(n.li,{children:"Create a scraper in the source account (where the EKS cluster exists) with the --role-configuration option."}),"\n"]}),"\n",(0,a.jsx)(n.pre,{children:(0,a.jsx)(n.code,{children:'aws amp create-scraper \\\n  --source eksConfiguration="{clusterArn=\'arn:aws:eks:us-west-2:$SOURCE_ACCOUNT_ID:cluster/$CLUSTER_NAME\',subnetIds=[$EKS_SUBNET_IDS]}" \\\n  --scrape-configuration configurationBlob=<base64-encoded-blob> \\\n  --destination ampConfiguration="{workspaceArn=\'arn:aws:aps:us-west-2:$TARGET_ACCOUNT_ID:workspace/$TARGET_AMP_WORKSPACE_ID\'}"\\\n  --role-configuration \'{"sourceRoleArn":"arn:aws:iam::$SOURCE_ACCOUNT_ID:role/Source", "targetRoleArn":"arn:aws:iam::$TARGET_ACCOUNT_ID:role/Target"}\'\n'})}),"\n",(0,a.jsx)(n.admonition,{type:"warning",children:(0,a.jsx)(n.p,{children:"Make sure you fill in the $VARIABLES with the values specific to you."})}),"\n",(0,a.jsxs)(n.ol,{start:"4",children:["\n",(0,a.jsx)(n.li,{children:"Validate the scraper creation (This can take ~20 minutes) and take note of the scraper ARN."}),"\n"]}),"\n",(0,a.jsx)(n.pre,{children:(0,a.jsx)(n.code,{children:'aws amp list-scrapers\n{\n    "scrapers": [\n        {\n            "scraperId": "scraper-id",\n            "arn": "arn:aws:aps:us-west-2:account_id_source:scraper/scraper-id",\n            "roleArn": "arn:aws:iam::account_id_source:role/aws-service-role/scraper.aps.amazonaws.com/AWSServiceRoleForAmazonPrometheusScraperInternal_cc319052-41a3-4",\n            "status": {\n                "statusCode": "ACTIVE"\n            },\n            "createdAt": "2024-10-29T16:37:58.789000+00:00",\n            "lastModifiedAt": "2024-10-29T16:55:17.085000+00:00",\n            "tags": {},\n            "source": {\n                "eksConfiguration": {\n                    "clusterArn": "arn:aws:eks:us-west-2:account_id_source:cluster/xarw",\n                    "securityGroupIds": [\n                        "sg-security-group-id",\n                        "sg-security-group-id"\n                    ],\n                    "subnetIds": [\n                        "subnet-subnet_id"\n                    ]\n                }\n            },\n            "destination": {\n                "ampConfiguration": {\n                    "workspaceArn": "arn:aws:aps:us-west-2:account_id_target:workspace/ws-workspace-id"\n                }\n            }\n        }\n'})}),"\n",(0,a.jsxs)(n.ol,{start:"5",children:["\n",(0,a.jsx)(n.li,{children:"Go back and update the trust polcies created in steps 1 and 2 with the scraper ARN value from the command in step 4."}),"\n"]})]})}function d(e={}){const{wrapper:n}={...(0,s.R)(),...e.components};return n?(0,a.jsx)(n,{...e,children:(0,a.jsx)(u,{...e})}):u(e)}},28453:(e,n,r)=>{r.d(n,{R:()=>o,x:()=>c});var t=r(96540);const a={},s=t.createContext(a);function o(e){const n=t.useContext(s);return t.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function c(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(a):e.components||a:o(e.components),t.createElement(s.Provider,{value:n},e.children)}},44938:(e,n,r)=>{r.d(n,{A:()=>t});const t=r.p+"assets/images/ampxa-arch-6ea4117d6f54341e727ee62d4606d2de.png"}}]);
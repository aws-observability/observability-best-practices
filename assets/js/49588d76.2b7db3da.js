"use strict";(self.webpackChunkobservability_best_practices=self.webpackChunkobservability_best_practices||[]).push([[9718],{20967:(e,t,a)=>{a.d(t,{A:()=>i});const i=a.p+"assets/images/cwl-dp-phi-fa93aa30d65d2194ad061b8dcd8d7980.png"},28453:(e,t,a)=>{a.d(t,{R:()=>o,x:()=>d});var i=a(96540);const n={},s=i.createContext(n);function o(e){const t=i.useContext(s);return i.useMemo((function(){return"function"==typeof e?e(t):{...t,...e}}),[t,e])}function d(e){let t;return t=e.disableParentContext?"function"==typeof e.components?e.components(n):e.components||n:o(e.components),i.createElement(s.Provider,{value:t},e.children)}},31232:(e,t,a)=>{a.d(t,{A:()=>i});const i=a.p+"assets/images/cwl-dp-pii-b4ae1a4afff16b273861d505ffcd456f.png"},32752:(e,t,a)=>{a.d(t,{A:()=>i});const i=a.p+"assets/images/cwl-dp-credentials-8d0f8f39b355471ec82343adc37df92c.png"},44284:(e,t,a)=>{a.d(t,{A:()=>i});const i=a.p+"assets/images/cwl-dp-fin-info-b300e773ec01e49988049ae166700f47.png"},45736:(e,t,a)=>{a.r(t),a.d(t,{assets:()=>c,contentTitle:()=>o,default:()=>h,frontMatter:()=>s,metadata:()=>d,toc:()=>r});var i=a(74848),n=a(28453);const s={},o="CloudWatch Logs Data Protection Policies for SLG/EDU",d={id:"tools/logs/dataprotection/data-protection-policies",title:"CloudWatch Logs Data Protection Policies for SLG/EDU",description:"Although logging data is beneficial in general, however, masking them is useful for organizations who have strict regulations such as the Health Insurance Portability and Accountability Act (HIPAA), General Data Privacy Regulation (GDPR), Payment Card Industry Data Security Standard (PCI-DSS), and Federal Risk and Authorization Management Program (FedRAMP).",source:"@site/docs/tools/logs/dataprotection/data-protection-policies.md",sourceDirName:"tools/logs/dataprotection",slug:"/tools/logs/dataprotection/data-protection-policies",permalink:"/observability-best-practices/tools/logs/dataprotection/data-protection-policies",draft:!1,unlisted:!1,editUrl:"https://github.com/aws-observability/observability-best-practices/blob/main/docusaurus/docs/tools/logs/dataprotection/data-protection-policies.md",tags:[],version:"current",frontMatter:{},sidebar:"tools",previous:{title:"CloudWatch Logs Insights Example Queries",permalink:"/observability-best-practices/tools/logs/logs-insights-examples"},next:{title:"Application Signals for Kotlin Services",permalink:"/observability-best-practices/tools/application-signals/kotlin-signals"}},c={},r=[{value:"Data Types",id:"data-types",level:2},{value:"Credentials",id:"credentials",level:3},{value:"Financial Information",id:"financial-information",level:3},{value:"Protected Health Information (PHI)",id:"protected-health-information-phi",level:3},{value:"Personally Identifiable Information (PII)",id:"personally-identifiable-information-pii",level:3},{value:"Masked Logs",id:"masked-logs",level:2}];function l(e){const t={a:"a",admonition:"admonition",code:"code",h1:"h1",h2:"h2",h3:"h3",img:"img",li:"li",p:"p",pre:"pre",ul:"ul",...(0,n.R)(),...e.components};return(0,i.jsxs)(i.Fragment,{children:[(0,i.jsx)(t.h1,{id:"cloudwatch-logs-data-protection-policies-for-slgedu",children:"CloudWatch Logs Data Protection Policies for SLG/EDU"}),"\n",(0,i.jsx)(t.p,{children:"Although logging data is beneficial in general, however, masking them is useful for organizations who have strict regulations such as the Health Insurance Portability and Accountability Act (HIPAA), General Data Privacy Regulation (GDPR), Payment Card Industry Data Security Standard (PCI-DSS), and Federal Risk and Authorization Management Program (FedRAMP)."}),"\n",(0,i.jsxs)(t.p,{children:[(0,i.jsx)(t.a,{href:"https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/cloudwatch-logs-data-protection-policies.html",children:"Data Protection policies"})," in CloudWatch Logs enables customers to define and apply data protection policies that scan log data-in-transit for sensitive data and mask sensitive data that is detected."]}),"\n",(0,i.jsx)(t.p,{children:"These policies leverage pattern matching and machine learning models to detect sensitive data and helps you audit and mask those data that appears in events ingested by CloudWatch log groups in your account."}),"\n",(0,i.jsxs)(t.p,{children:["The techniques and criteria used to select sensitive data are referred to as ",(0,i.jsx)(t.a,{href:"https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/cloudwatch-logs-data-protection-policies.html",children:"matching data identifiers"}),". Using these managed data identifiers, CloudWatch Logs can detect:"]}),"\n",(0,i.jsxs)(t.ul,{children:["\n",(0,i.jsx)(t.li,{children:"Credentials such as private keys or AWS secret access keys"}),"\n",(0,i.jsx)(t.li,{children:"Device identifiers such as IP addresses or MAC addresses"}),"\n",(0,i.jsx)(t.li,{children:"Financial information such as bank account number, credit card numbers or credit card verification code"}),"\n",(0,i.jsx)(t.li,{children:"Protected Health Information (PHI) such as Health Insurance Card Number (EHIC) or Personal health Number"}),"\n",(0,i.jsx)(t.li,{children:"Personally Identifiable Information (PII) such as driver\u2019s licenses, social security numbers or taxpayer identification numbers"}),"\n"]}),"\n",(0,i.jsx)(t.admonition,{type:"note",children:(0,i.jsx)(t.p,{children:"Sensitive data is detected and masked when it is ingested into the log group. When you set a data protection policy, log events ingested to the log group before that time are not masked."})}),"\n",(0,i.jsx)(t.p,{children:"Let us expand on some of the data types mentioned above and see some examples:"}),"\n",(0,i.jsx)(t.h2,{id:"data-types",children:"Data Types"}),"\n",(0,i.jsx)(t.h3,{id:"credentials",children:"Credentials"}),"\n",(0,i.jsx)(t.p,{children:"Credentials are sensitive data types which are used to verify who you are and whether you have permission to access the resources that you are requesting. AWS uses these credentials like private keys and secret access keys to authenticate and authorize your requests."}),"\n",(0,i.jsx)(t.p,{children:"Using CloudWatch Logs Data Protection policies, sensitive data that matches the data identifiers you have selected is masked. (We will see a masked example at the end of the section)."}),"\n",(0,i.jsx)(t.p,{children:(0,i.jsx)(t.img,{alt:"The CloudWatch Logs Data Protection for Credentials1",src:a(32752).A+"",width:"651",height:"661"})}),"\n",(0,i.jsx)(t.p,{children:(0,i.jsx)(t.img,{alt:"The CloudWatch Logs Data Protection for Credentials2",src:a(49703).A+"",width:"936",height:"243"})}),"\n",(0,i.jsxs)(t.admonition,{type:"tip",children:[(0,i.jsx)(t.p,{children:"Data classification best practices start with clearly defined data classification tiers and requirements, which meet your organizational, legal, and compliance standards."}),(0,i.jsx)(t.p,{children:"As a best practice, use tags on AWS resources based on the data classification framework to implement compliance in accordance with your organization data governance policies."})]}),"\n",(0,i.jsx)(t.admonition,{type:"tip",children:(0,i.jsx)(t.p,{children:"To avoid sensitive data in your log events, best practice is to exclude them in your code in the first place and log only necessary information."})}),"\n",(0,i.jsx)(t.h3,{id:"financial-information",children:"Financial Information"}),"\n",(0,i.jsx)(t.p,{children:"As defined by the Payment Card Industry Data Security Standard (PCI DSS), bank account, routing numbers, debit and credit card numbers, credit card magnetic strip data are considered as sensitive financial information."}),"\n",(0,i.jsx)(t.p,{children:"To detect sensitive data, CloudWatch Logs scans for the data identifiers that you specify regardless of the geo-location the log group is located once you set a data protection policy."}),"\n",(0,i.jsx)(t.p,{children:(0,i.jsx)(t.img,{alt:"The CloudWatch Logs Data Protection for Financial",src:a(44284).A+"",width:"586",height:"257"})}),"\n",(0,i.jsx)(t.admonition,{type:"info",children:(0,i.jsxs)(t.p,{children:["Check the full list of ",(0,i.jsx)(t.a,{href:"https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/protect-sensitive-log-data-types-financial.html",children:"financial data types and data identifiers"})]})}),"\n",(0,i.jsx)(t.h3,{id:"protected-health-information-phi",children:"Protected Health Information (PHI)"}),"\n",(0,i.jsx)(t.p,{children:"PHI includes a very wide set of personally identifiable health and health-related data, including insurance and billing information, diagnosis data, clinical care data like medical records and data sets and lab results such as images and test results."}),"\n",(0,i.jsx)(t.p,{children:"CloudWatch Logs scan and detect the health information from the chosen log group and mask that data."}),"\n",(0,i.jsx)(t.p,{children:(0,i.jsx)(t.img,{alt:"The CloudWatch Logs Data Protection for PHI",src:a(20967).A+"",width:"594",height:"265"})}),"\n",(0,i.jsx)(t.admonition,{type:"info",children:(0,i.jsxs)(t.p,{children:["Check the full list of ",(0,i.jsx)(t.a,{href:"https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/protect-sensitive-log-data-types-health.html",children:"phi data types and data identifiers"})]})}),"\n",(0,i.jsx)(t.h3,{id:"personally-identifiable-information-pii",children:"Personally Identifiable Information (PII)"}),"\n",(0,i.jsx)(t.p,{children:"PII is a textual reference to personal data that could be used to identify an individual. PII examples include addresses, bank account numbers, and phone numbers."}),"\n",(0,i.jsx)(t.p,{children:(0,i.jsx)(t.img,{alt:"The CloudWatch Logs Data Protection for PHI",src:a(31232).A+"",width:"594",height:"265"})}),"\n",(0,i.jsx)(t.admonition,{type:"info",children:(0,i.jsxs)(t.p,{children:["Check the full list of ",(0,i.jsx)(t.a,{href:"https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/protect-sensitive-log-data-types-pii.html",children:"pii data types and data identifiers"})]})}),"\n",(0,i.jsx)(t.h2,{id:"masked-logs",children:"Masked Logs"}),"\n",(0,i.jsxs)(t.p,{children:["Now if you go to your log group where you set your data protection policy, you will see that data protection is ",(0,i.jsx)(t.code,{children:"On"})," and the console also displays a count of sensitive data."]}),"\n",(0,i.jsx)(t.p,{children:(0,i.jsx)(t.img,{alt:"The CloudWatch Logs Data Protection for PHI",src:a(62067).A+"",width:"920",height:"500"})}),"\n",(0,i.jsxs)(t.p,{children:["Now, clicking on ",(0,i.jsx)(t.code,{children:"View in Log Insights"})," will take you to the Log Insights console. Running the below query to check the logs events in a log stream will give you a list of all the logs."]}),"\n",(0,i.jsx)(t.pre,{children:(0,i.jsx)(t.code,{children:"fields @timestamp, @message\n| sort @timestamp desc\n| limit 20\n"})}),"\n",(0,i.jsx)(t.p,{children:"Once you expand a query, you will see the masked results as shown below:"}),"\n",(0,i.jsx)(t.p,{children:(0,i.jsx)(t.img,{alt:"The CloudWatch Logs Data Protection for PHI",src:a(63571).A+"",width:"907",height:"344"})}),"\n",(0,i.jsx)(t.admonition,{type:"important",children:(0,i.jsxs)(t.p,{children:["When you create a data protection policy, then by default, sensitive data that matches the data identifiers you've selected is masked. Only users who have the ",(0,i.jsx)(t.code,{children:"logs:Unmask"})," IAM permission can view unmasked data."]})}),"\n",(0,i.jsx)(t.admonition,{type:"tip",children:(0,i.jsxs)(t.p,{children:["Use ",(0,i.jsx)(t.a,{href:"https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/auth-and-access-control-cw.html",children:"AWS IAM and Access Management(IAM)"})," to administer and restrict access to sensitive data in CloudWatch."]})}),"\n",(0,i.jsx)(t.admonition,{type:"tip",children:(0,i.jsxs)(t.p,{children:["Regular monitoring and auditing of your cloud environment are equally important in safeguarding sensitive data. It becomes a critical aspect when applications generate a large volume of data and manual and thereby, it is recommended not to log an excessive amount of data. Read this AWS Prescriptive Guidance for ",(0,i.jsx)(t.a,{href:"https://docs.aws.amazon.com/prescriptive-guidance/latest/logging-monitoring-for-application-owners/logging-best-practices.html",children:"Logging Best Practices"})]})}),"\n",(0,i.jsx)(t.admonition,{type:"tip",children:(0,i.jsxs)(t.p,{children:["Log Group Data is always encrypted in CloudWatch Logs. Alternatively, you can also use ",(0,i.jsx)(t.a,{href:"https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/encrypt-log-data-kms.html",children:"AWS Key Management Service"})," to encrypt your log data."]})}),"\n",(0,i.jsx)(t.admonition,{type:"tip",children:(0,i.jsx)(t.p,{children:"For resiliency and scalability, set up CloudWatch alarms and automate remediation using AWS Amazon EventBridge and AWS Systems Manager."})})]})}function h(e={}){const{wrapper:t}={...(0,n.R)(),...e.components};return t?(0,i.jsx)(t,{...e,children:(0,i.jsx)(l,{...e})}):l(e)}},49703:(e,t,a)=>{a.d(t,{A:()=>i});const i=a.p+"assets/images/cwl-dp-cred-sensitive-bd263d6b449e954ca64bc2f458237862.png"},62067:(e,t,a)=>{a.d(t,{A:()=>i});const i=a.p+"assets/images/cwl-dp-loggroup-8bc6779dc645f98e2ed44dc314a14b9f.png"},63571:(e,t,a)=>{a.d(t,{A:()=>i});const i=a.p+"assets/images/cwl-dp-masked-994ef2241d2bb9f6fba9570de301170e.png"}}]);
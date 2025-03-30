"use strict";(self.webpackChunkobservability_best_practices=self.webpackChunkobservability_best_practices||[]).push([[5342],{28453:(e,s,i)=>{i.d(s,{R:()=>r,x:()=>o});var n=i(96540);const t={},a=n.createContext(t);function r(e){const s=n.useContext(a);return n.useMemo((function(){return"function"==typeof e?e(s):{...s,...e}}),[s,e])}function o(e){let s;return s=e.disableParentContext?"function"==typeof e.components?e.components(t):e.components||t:r(e.components),n.createElement(a.Provider,{value:s},e.children)}},94137:(e,s,i)=>{i.r(s),i.d(s,{assets:()=>l,contentTitle:()=>o,default:()=>h,frontMatter:()=>r,metadata:()=>n,toc:()=>c});const n=JSON.parse('{"id":"persona/devops_engineer","title":"DevOps","description":"As a DevOps engineer, integrating robust observability practices into your workflows is crucial for maintaining high-performance, reliable, and secure systems. This guide provides observability best practices tailored to the DevOps perspective, focusing on practical implementation across the continuous delivery lifecycle and infrastructure management processes.","source":"@site/docs/persona/devops_engineer.md","sourceDirName":"persona","slug":"/persona/devops_engineer","permalink":"/observability-best-practices/persona/devops_engineer","draft":false,"unlisted":false,"editUrl":"https://github.com/aws-observability/observability-best-practices/blob/main/docusaurus/docs/persona/devops_engineer.md","tags":[],"version":"current","frontMatter":{},"sidebar":"persona","previous":{"title":"Developers","permalink":"/observability-best-practices/persona/developer"},"next":{"title":"Leader/Executive","permalink":"/observability-best-practices/persona/leader_manager"}}');var t=i(74848),a=i(28453);const r={},o="DevOps",l={},c=[{value:"Continuous Integration and Delivery Pipelines (CI/CD)",id:"continuous-integration-and-delivery-pipelines-cicd",level:2},{value:"Infrastructure as Code (IaC) Practices",id:"infrastructure-as-code-iac-practices",level:2},{value:"Containerization and Orchestration with Kubernetes",id:"containerization-and-orchestration-with-kubernetes",level:2},{value:"Security and Compliance in CI/CD Pipelines",id:"security-and-compliance-in-cicd-pipelines",level:2},{value:"Automated Testing and Quality Assurance Strategies",id:"automated-testing-and-quality-assurance-strategies",level:2},{value:"Release Management and Deployment Best Practices",id:"release-management-and-deployment-best-practices",level:2},{value:"Conclusion",id:"conclusion",level:2}];function d(e){const s={a:"a",h1:"h1",h2:"h2",header:"header",li:"li",p:"p",ul:"ul",...(0,a.R)(),...e.components};return(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)(s.header,{children:(0,t.jsx)(s.h1,{id:"devops",children:"DevOps"})}),"\n",(0,t.jsx)(s.p,{children:"As a DevOps engineer, integrating robust observability practices into your workflows is crucial for maintaining high-performance, reliable, and secure systems. This guide provides observability best practices tailored to the DevOps perspective, focusing on practical implementation across the continuous delivery lifecycle and infrastructure management processes."}),"\n",(0,t.jsx)(s.h2,{id:"continuous-integration-and-delivery-pipelines-cicd",children:"Continuous Integration and Delivery Pipelines (CI/CD)"}),"\n",(0,t.jsx)(s.p,{children:"To optimize your CI/CD pipelines with observability:"}),"\n",(0,t.jsxs)(s.ul,{children:["\n",(0,t.jsxs)(s.li,{children:["\n",(0,t.jsxs)(s.p,{children:["Implement monitoring for the ",(0,t.jsx)(s.a,{href:"https://docs.aws.amazon.com/codepipeline/latest/userguide/monitoring.html",children:"pipeline"}),", ",(0,t.jsx)(s.a,{href:"https://docs.aws.amazon.com/codebuild/latest/userguide/monitoring-builds.html",children:"build"})," and ",(0,t.jsx)(s.a,{href:"https://docs.aws.amazon.com/codedeploy/latest/userguide/monitoring.html",children:"deploy"})," for maintaining the reliability, availability, and performing CI/CD."]}),"\n"]}),"\n",(0,t.jsxs)(s.li,{children:["\n",(0,t.jsxs)(s.p,{children:["Create ",(0,t.jsx)(s.a,{href:"https://aws-observability.github.io/observability-best-practices/tools/alarms",children:"CloudWatch alarms"})," for critical CI/CD events. Set up notifications via Amazon SNS to alert your team of pipeline failures or long-running stages."]}),"\n",(0,t.jsxs)(s.ul,{children:["\n",(0,t.jsxs)(s.li,{children:["Configure ",(0,t.jsx)(s.a,{href:"https://docs.aws.amazon.com/codebuild/latest/userguide/codebuild_cloudwatch_alarms.html",children:"CloudWatch alarm in CodeBuild"}),"."]}),"\n",(0,t.jsxs)(s.li,{children:["Configure ",(0,t.jsx)(s.a,{href:"https://docs.aws.amazon.com/codedeploy/latest/userguide/monitoring-create-alarms.html",children:"CloudWatch alarm in CodeDeploy"}),"."]}),"\n"]}),"\n"]}),"\n",(0,t.jsxs)(s.li,{children:["\n",(0,t.jsxs)(s.p,{children:["Instrument your pipeline using ",(0,t.jsx)(s.a,{href:"https://aws-observability.github.io/observability-best-practices/tools/xray/",children:"AWS X-Ray"})," to trace requests across your CI/CD pipeline stages."]}),"\n"]}),"\n",(0,t.jsxs)(s.li,{children:["\n",(0,t.jsxs)(s.p,{children:["Create consolidated ",(0,t.jsx)(s.a,{href:"https://aws-observability.github.io/observability-best-practices/tools/dashboards",children:"CloudWatch dashboards"})," to track key metrics ",(0,t.jsx)(s.a,{href:"https://docs.aws.amazon.com/codebuild/latest/userguide/monitoring-metrics.html",children:"CodeBuild"}),", ",(0,t.jsx)(s.a,{href:"https://docs.aws.amazon.com/codedeploy/latest/userguide/monitoring-cloudwatch.html",children:"CodeDeploy"})," and ",(0,t.jsx)(s.a,{href:"https://docs.aws.amazon.com/codepipeline/latest/userguide/metrics-dimensions.html",children:"Pipelines"}),"."]}),"\n"]}),"\n"]}),"\n",(0,t.jsx)(s.h2,{id:"infrastructure-as-code-iac-practices",children:"Infrastructure as Code (IaC) Practices"}),"\n",(0,t.jsx)(s.p,{children:"For effective observability in your IaC workflows:"}),"\n",(0,t.jsxs)(s.ul,{children:["\n",(0,t.jsxs)(s.li,{children:["\n",(0,t.jsxs)(s.p,{children:["Embed ",(0,t.jsx)(s.a,{href:"https://aws-observability.github.io/observability-best-practices/tools/alarms",children:"CloudWatch Alarms"})," and ",(0,t.jsx)(s.a,{href:"https://aws-observability.github.io/observability-best-practices/tools/cloudwatch-dashboard",children:"Dashboards"})," in your ",(0,t.jsx)(s.a,{href:"https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/AWS_CloudWatch.html",children:"AWS CloudFormation"})," templates. This ensures consistent monitoring across all environments."]}),"\n"]}),"\n",(0,t.jsxs)(s.li,{children:["\n",(0,t.jsxs)(s.p,{children:["Implement centralized logging: Set up a ",(0,t.jsx)(s.a,{href:"https://aws-observability.github.io/observability-best-practices/patterns/multiaccount",children:"centralized logging solution"})," using services like Amazon CloudWatch Logs or ",(0,t.jsx)(s.a,{href:"https://aws-observability.github.io/observability-best-practices/recipes/aes",children:"Amazon OpenSearch Service"}),". Define log retention policies and log groups as part of your IaC templates."]}),"\n"]}),"\n",(0,t.jsxs)(s.li,{children:["\n",(0,t.jsxs)(s.p,{children:["Configure ",(0,t.jsx)(s.a,{href:"https://aws-observability.github.io/observability-best-practices/patterns/vpcflowlogs",children:"VPC flow logs"})," using IaC to capture network traffic information for security and performance analysis."]}),"\n"]}),"\n",(0,t.jsxs)(s.li,{children:["\n",(0,t.jsxs)(s.p,{children:["Use a consistent tagging strategy in your ",(0,t.jsx)(s.a,{href:"https://docs.aws.amazon.com/whitepapers/latest/tagging-best-practices/implementing-and-enforcing-tagging.html#cicd-pipeline-managed-resources",children:"IaC templates"})," to facilitate better resource organization and enable more granular monitoring and cost allocation."]}),"\n"]}),"\n",(0,t.jsxs)(s.li,{children:["\n",(0,t.jsxs)(s.p,{children:["Use ",(0,t.jsx)(s.a,{href:"https://docs.aws.amazon.com/xray/latest/devguide/creating-resources-with-cloudformation.html",children:"AWS X-Ray"})," and integrate it with application code to enable distributed tracing. Define X-Ray sampling rules and groups in your IaC templates."]}),"\n"]}),"\n"]}),"\n",(0,t.jsx)(s.h2,{id:"containerization-and-orchestration-with-kubernetes",children:"Containerization and Orchestration with Kubernetes"}),"\n",(0,t.jsx)(s.p,{children:"For containerized applications and Kubernetes environments:"}),"\n",(0,t.jsxs)(s.ul,{children:["\n",(0,t.jsxs)(s.li,{children:["\n",(0,t.jsxs)(s.p,{children:["Implement ",(0,t.jsx)(s.a,{href:"https://aws-observability.github.io/observability-best-practices/guides/containers/aws-native/eks/amazon-cloudwatch-container-insights",children:"Amazon EKS with Container Insights"})," for comprehensive container and cluster monitoring."]}),"\n"]}),"\n",(0,t.jsxs)(s.li,{children:["\n",(0,t.jsxs)(s.p,{children:["Use ",(0,t.jsx)(s.a,{href:"https://aws-observability.github.io/observability-best-practices/guides/operational/adot-at-scale/operating-adot-collector",children:"AWS Distro for OpenTelemetry"})," to collect and export telemetry data from your containerized applications."]}),"\n"]}),"\n",(0,t.jsxs)(s.li,{children:["\n",(0,t.jsxs)(s.p,{children:["Implement ",(0,t.jsx)(s.a,{href:"https://aws-observability.github.io/observability-best-practices/patterns/eksampamg",children:"Prometheus and Grafana"})," on EKS for advanced metric collection and visualization. Use the AWS Managed Grafana service for easier setup and management."]}),"\n"]}),"\n",(0,t.jsxs)(s.li,{children:["\n",(0,t.jsxs)(s.p,{children:["Implement ",(0,t.jsx)(s.a,{href:"https://aws-observability.github.io/observability-best-practices/guides/operational/gitops-with-amg/#introduction-to-gitops",children:"GitOps"})," practices using tools like Flux or ArgoCD for Kubernetes deployments. Integrate these tools with CloudWatch to monitor the sync status and health of your GitOps workflows."]}),"\n"]}),"\n"]}),"\n",(0,t.jsx)(s.h2,{id:"security-and-compliance-in-cicd-pipelines",children:"Security and Compliance in CI/CD Pipelines"}),"\n",(0,t.jsx)(s.p,{children:"To enhance security observability in your pipelines:"}),"\n",(0,t.jsxs)(s.ul,{children:["\n",(0,t.jsxs)(s.li,{children:["\n",(0,t.jsxs)(s.p,{children:["Integrate ",(0,t.jsx)(s.a,{href:"https://aws.amazon.com/inspector/",children:"Amazon Inspector"})," into your CI/CD process for automated vulnerability assessments."]}),"\n"]}),"\n",(0,t.jsxs)(s.li,{children:["\n",(0,t.jsxs)(s.p,{children:["Implement ",(0,t.jsx)(s.a,{href:"https://aws.amazon.com/security-hub/",children:"AWS Security Hub"})," to aggregate and prioritize security alerts across your AWS accounts."]}),"\n"]}),"\n",(0,t.jsxs)(s.li,{children:["\n",(0,t.jsxs)(s.p,{children:["Use ",(0,t.jsx)(s.a,{href:"https://docs.aws.amazon.com/config/latest/developerguide/aws-config-managed-rules-cloudformation-templates.html",children:"AWS Config"})," to track resource configurations and changes. Set up Config rules to automatically evaluate compliance with your defined standards."]}),"\n"]}),"\n",(0,t.jsxs)(s.li,{children:["\n",(0,t.jsxs)(s.p,{children:["Leverage ",(0,t.jsx)(s.a,{href:"https://aws.amazon.com/blogs/aws/introducing-amazon-guardduty-extended-threat-detection-aiml-attack-sequence-identification-for-enhanced-cloud-security/",children:"Amazon GuardDuty"})," for intelligent threat detection, and integrate its findings with your incident response workflows."]}),"\n"]}),"\n",(0,t.jsxs)(s.li,{children:["\n",(0,t.jsx)(s.p,{children:"Implement security as code by defining AWS WAF rules, Security Hub controls, and GuardDuty filters using CloudFormation or Terraform. This ensures that security observability evolves alongside your infrastructure."}),"\n"]}),"\n"]}),"\n",(0,t.jsx)(s.h2,{id:"automated-testing-and-quality-assurance-strategies",children:"Automated Testing and Quality Assurance Strategies"}),"\n",(0,t.jsx)(s.p,{children:"To enhance your testing processes with observability:"}),"\n",(0,t.jsxs)(s.ul,{children:["\n",(0,t.jsxs)(s.li,{children:["\n",(0,t.jsxs)(s.p,{children:["Implement ",(0,t.jsx)(s.a,{href:"https://docs.aws.amazon.com/AmazonSynthetics/latest/APIReference/Welcome.html",children:"CloudWatch Synthetics"})," to create canaries that continuously test your APIs and user journeys."]}),"\n"]}),"\n",(0,t.jsxs)(s.li,{children:["\n",(0,t.jsx)(s.p,{children:"Use AWS CodeBuild to run your test suites and publish test results as CloudWatch metrics for trend analysis."}),"\n"]}),"\n",(0,t.jsxs)(s.li,{children:["\n",(0,t.jsxs)(s.p,{children:["Implement ",(0,t.jsx)(s.a,{href:"https://docs.aws.amazon.com/xray/latest/devguide/xray-console-traces.html",children:"AWS X-Ray tracing"})," in your test environments to gain performance insights during testing phases."]}),"\n"]}),"\n",(0,t.jsxs)(s.li,{children:["\n",(0,t.jsxs)(s.p,{children:["Leverage Amazon CloudWatch ",(0,t.jsx)(s.a,{href:"https://aws-observability.github.io/observability-best-practices/tools/rum",children:"RUM"}),"(Real User Monitoring) to gather and analyze user experience data from real user interactions with your applications."]}),"\n"]}),"\n",(0,t.jsxs)(s.li,{children:["\n",(0,t.jsxs)(s.p,{children:["Implement chaos engineering practices using ",(0,t.jsx)(s.a,{href:"https://aws.amazon.com/blogs/mt/chaos-engineering-leveraging-aws-fault-injection-simulator-in-a-multi-account-aws-environment/",children:"AWS Fault Injection Simulator"}),". Monitor the impact of simulated failures to ",(0,t.jsx)(s.a,{href:"https://aws.amazon.com/blogs/aws/monitor-and-improve-your-application-resiliency-with-resilience-hub/",children:"enhance your system's resilience"}),"."]}),"\n"]}),"\n"]}),"\n",(0,t.jsx)(s.h2,{id:"release-management-and-deployment-best-practices",children:"Release Management and Deployment Best Practices"}),"\n",(0,t.jsx)(s.p,{children:"For observability driven release management:"}),"\n",(0,t.jsxs)(s.ul,{children:["\n",(0,t.jsxs)(s.li,{children:["\n",(0,t.jsxs)(s.p,{children:["Use ",(0,t.jsx)(s.a,{href:"https://docs.aws.amazon.com/codedeploy/latest/userguide/welcome.html",children:"AWS CodeDeploy"})," for managed deployments, leveraging its integration with CloudWatch for deployment monitoring ."]}),"\n"]}),"\n",(0,t.jsxs)(s.li,{children:["\n",(0,t.jsxs)(s.p,{children:["Perform canary deployments, gradually rolling out new versions to a small subset of your infrastructure. ",(0,t.jsx)(s.a,{href:"https://aws.amazon.com/blogs/containers/create-a-pipeline-with-canary-deployments-for-amazon-ecs-using-aws-app-mesh/",children:"Monitor the canary deployments"})," closely using CloudWatch and X-Ray to catch any issues before full deployment."]}),"\n"]}),"\n",(0,t.jsxs)(s.li,{children:["\n",(0,t.jsxs)(s.p,{children:["Configure the deployment to ",(0,t.jsx)(s.a,{href:"https://docs.aws.amazon.com/codedeploy/latest/userguide/deployments-rollback-and-redeploy.html",children:"automatically roll back"})," to the previous stable version if predefined monitoring threshold is breached."]}),"\n"]}),"\n",(0,t.jsxs)(s.li,{children:["\n",(0,t.jsxs)(s.p,{children:["Use Amazon CloudWatch ",(0,t.jsx)(s.a,{href:"https://aws-observability.github.io/observability-best-practices/tools/rum",children:"RUM"})," (Real User Monitoring) to gather and analyze performance data from actual user sessions. This provides insights into how releases impact the end-user experience."]}),"\n"]}),"\n",(0,t.jsxs)(s.li,{children:["\n",(0,t.jsxs)(s.p,{children:["Configure ",(0,t.jsx)(s.a,{href:"https://aws-observability.github.io/observability-best-practices/tools/alarms",children:"CloudWatch Alarms"})," to notify your team of any anomalies or performance issues immediately after a release. Integrate these alarms with Amazon SNS for timely notifications."]}),"\n"]}),"\n",(0,t.jsxs)(s.li,{children:["\n",(0,t.jsxs)(s.p,{children:["Leverage AI-powered insights, utilize ",(0,t.jsx)(s.a,{href:"https://aws.amazon.com/blogs/aws/amazon-devops-guru-machine-learning-powered-service-identifies-application-errors-and-fixes/",children:"Amazon DevOps Guru"})," to automatically detect operational issues and receive ML-powered recommendations for improving application health and performance post-release."]}),"\n"]}),"\n",(0,t.jsxs)(s.li,{children:["\n",(0,t.jsxs)(s.p,{children:["Use AWS Systems Manager Parameter Store or Secrets Manager for managing feature flags, and monitor their usage through custom ",(0,t.jsx)(s.a,{href:"https://docs.aws.amazon.com/secretsmanager/latest/userguide/monitoring-cloudwatch.html",children:"CloudWatch metrics"}),"."]}),"\n"]}),"\n"]}),"\n",(0,t.jsx)(s.h2,{id:"conclusion",children:"Conclusion"}),"\n",(0,t.jsx)(s.p,{children:"Adopting observability practices isn't just about maintaining your systems\u2014it's a strategic move toward achieving operational excellence and driving continuous innovation in your organization. Remember to continuously refine your observability strategy as your systems evolve, leveraging new AWS features and services as they become available."})]})}function h(e={}){const{wrapper:s}={...(0,a.R)(),...e.components};return s?(0,t.jsx)(s,{...e,children:(0,t.jsx)(d,{...e})}):d(e)}}}]);
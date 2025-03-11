"use strict";(self.webpackChunkobservability_best_practices=self.webpackChunkobservability_best_practices||[]).push([[5557],{28453:(e,n,i)=>{i.d(n,{R:()=>o,x:()=>a});var s=i(96540);const r={},t=s.createContext(r);function o(e){const n=s.useContext(t);return s.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function a(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(r):e.components||r:o(e.components),s.createElement(t.Provider,{value:n},e.children)}},79924:(e,n,i)=>{i.r(n),i.d(n,{assets:()=>l,contentTitle:()=>a,default:()=>h,frontMatter:()=>o,metadata:()=>s,toc:()=>d});const s=JSON.parse('{"id":"persona/developer","title":"Developers","description":"Observability is crucial for developers as it enhances productivity, improves application performance, and drives business success through better decision-making and faster issue resolution. This guide provides best practices and recommendations for leveraging observability effectively.","source":"@site/i18n/ja/docusaurus-plugin-content-docs/current/persona/developer.md","sourceDirName":"persona","slug":"/persona/developer","permalink":"/observability-best-practices/ja/persona/developer","draft":false,"unlisted":false,"editUrl":"https://github.com/aws-observability/observability-best-practices/blob/main/docusaurus/docs/persona/developer.md","tags":[],"version":"current","frontMatter":{},"sidebar":"persona","previous":{"title":"Cloud Engineer","permalink":"/observability-best-practices/ja/persona/cloud_engineer"},"next":{"title":"DevOps","permalink":"/observability-best-practices/ja/persona/devops_engineer"}}');var r=i(74848),t=i(28453);const o={},a="Developers",l={},d=[{value:"Why Observability Matters for Developers",id:"why-observability-matters-for-developers",level:2},{value:"Best practices for code quality",id:"best-practices-for-code-quality",level:2},{value:"Efficient logging and monitoring",id:"efficient-logging-and-monitoring",level:2},{value:"Profiling and performance optimization - TODO",id:"profiling-and-performance-optimization---todo",level:2},{value:"Error handling and debugging techniques - TODO",id:"error-handling-and-debugging-techniques---todo",level:2},{value:"Code reviews and collaboration strategies",id:"code-reviews-and-collaboration-strategies",level:2},{value:"API design and documentation guidelines",id:"api-design-and-documentation-guidelines",level:2}];function c(e){const n={a:"a",h1:"h1",h2:"h2",header:"header",li:"li",p:"p",strong:"strong",ul:"ul",...(0,t.R)(),...e.components};return(0,r.jsxs)(r.Fragment,{children:[(0,r.jsx)(n.header,{children:(0,r.jsx)(n.h1,{id:"developers",children:"Developers"})}),"\n",(0,r.jsx)(n.p,{children:"Observability is crucial for developers as it enhances productivity, improves application performance, and drives business success through better decision-making and faster issue resolution. This guide provides best practices and recommendations for leveraging observability effectively."}),"\n",(0,r.jsx)(n.h2,{id:"why-observability-matters-for-developers",children:"Why Observability Matters for Developers"}),"\n",(0,r.jsx)(n.p,{children:"Developers use observability for several key purposes:"}),"\n",(0,r.jsxs)(n.ul,{children:["\n",(0,r.jsxs)(n.li,{children:[(0,r.jsx)(n.strong,{children:"Quick Issue Identification and Resolution:"}),"\n",(0,r.jsxs)(n.ul,{children:["\n",(0,r.jsx)(n.li,{children:"Observability allows developers to identify and diagnose issues quickly, reducing the time to resolve problems (MTTR) and improving overall software delivery performance"}),"\n",(0,r.jsx)(n.li,{children:"It helps developers understand how their systems behave in production, enabling them to make informed decisions and improve operations"}),"\n"]}),"\n"]}),"\n",(0,r.jsxs)(n.li,{children:[(0,r.jsx)(n.strong,{children:"Improve Customer Experience:"}),"\n",(0,r.jsxs)(n.ul,{children:["\n",(0,r.jsx)(n.li,{children:"By analyzing system behavior, developers can optimize performance and reliability, leading to better customer experiences and increased user satisfaction"}),"\n",(0,r.jsx)(n.li,{children:"Observability tools help monitor user interactions, allowing developers to identify and address UI/UX issues promptly"}),"\n"]}),"\n"]}),"\n",(0,r.jsxs)(n.li,{children:[(0,r.jsx)(n.strong,{children:"Enhanced Team Efficiency and Innovation:"}),"\n",(0,r.jsxs)(n.ul,{children:["\n",(0,r.jsx)(n.li,{children:"Observability platforms provide a single source of truth for operational data, facilitating cross-team collaboration and reducing troubleshooting time"}),"\n",(0,r.jsx)(n.li,{children:"Developers can focus more on innovation and less on manual debugging, thanks to automated insights and alerts"}),"\n"]}),"\n"]}),"\n",(0,r.jsxs)(n.li,{children:[(0,r.jsx)(n.strong,{children:"Data-Driven Decision Making:"}),"\n",(0,r.jsxs)(n.ul,{children:["\n",(0,r.jsx)(n.li,{children:"Observability provides detailed insights into system performance, enabling developers to make data-driven decisions about code improvements and resource allocation"}),"\n",(0,r.jsx)(n.li,{children:"It helps organizations optimize investments and accelerate time to market by identifying areas for improvement"}),"\n"]}),"\n"]}),"\n",(0,r.jsxs)(n.li,{children:[(0,r.jsx)(n.strong,{children:"Complexity Management:"}),"\n",(0,r.jsxs)(n.ul,{children:["\n",(0,r.jsx)(n.li,{children:"Observability helps manage the complexity of modern cloud-native and multi-cloud environments by providing a comprehensive view of system interdependencies"}),"\n",(0,r.jsx)(n.li,{children:"It allows developers to distill complexity and focus on relevant data, promoting more efficient development processes"}),"\n"]}),"\n"]}),"\n"]}),"\n",(0,r.jsx)(n.h2,{id:"best-practices-for-code-quality",children:"Best practices for code quality"}),"\n",(0,r.jsxs)(n.ul,{children:["\n",(0,r.jsxs)(n.li,{children:["\n",(0,r.jsx)(n.p,{children:(0,r.jsx)(n.strong,{children:"Monitor Issue Tracking Metrics:"})}),"\n",(0,r.jsxs)(n.ul,{children:["\n",(0,r.jsxs)(n.li,{children:["Use tools like JIRA or Trello or other issue tracking platforms to track metrics such as:","\n",(0,r.jsxs)(n.ul,{children:["\n",(0,r.jsx)(n.li,{children:"How many times a ticket moves from code review to test review and back to in progress. A high number may indicate lack of skills, high complexity, or inadequate tooling."}),"\n",(0,r.jsx)(n.li,{children:"How many times a ticket is blocked due to external dependencies. A high number could indicate high coupling between dependencies and/or high complexity."}),"\n"]}),"\n"]}),"\n",(0,r.jsxs)(n.li,{children:[(0,r.jsx)(n.strong,{children:"Recommendations:"}),"\n",(0,r.jsxs)(n.ul,{children:["\n",(0,r.jsxs)(n.li,{children:["Use a tool like ",(0,r.jsx)(n.a,{href:"https://aws.amazon.com/q/developer",children:"Amazon Q Developer"})," to boost productivity and code quality with automated code reviews. Amazon Q Developer can speed up software development tasks by up to 80%, contributes to higher-quality code by reducing the likelihood of human error during rapid development cycles."]}),"\n",(0,r.jsx)(n.li,{children:"Schedule regular reviews of metrics as part of retrospectives to identify improvements and foster a mindset of continuous improvement"}),"\n"]}),"\n"]}),"\n"]}),"\n"]}),"\n",(0,r.jsxs)(n.li,{children:["\n",(0,r.jsx)(n.p,{children:(0,r.jsx)(n.strong,{children:"Instrument Code for Performance Metrics:"})}),"\n",(0,r.jsxs)(n.ul,{children:["\n",(0,r.jsxs)(n.li,{children:["Instrument your code to be able to measure the following which provide an indirect measure of code quality by assessing the performance efficiency and scalability of the code implementation","\n",(0,r.jsxs)(n.ul,{children:["\n",(0,r.jsxs)(n.li,{children:[(0,r.jsx)(n.strong,{children:"RED Method:"})," Monitor Requests, Errors, and Duration for microservices. This provides insights into service performance and reliability."]}),"\n",(0,r.jsxs)(n.li,{children:[(0,r.jsx)(n.strong,{children:"USE Method:"})," Track Utilization, Saturation, and Errors for system resources. This helps identify bottlenecks and resource constraints."]}),"\n"]}),"\n"]}),"\n",(0,r.jsx)(n.li,{children:"Add instrumentation around calls to all external dependencies in the request processing path, like other services, database, cache, etc.. This can provide you with required information to investigate sudden changes in request processing time as well as enable faster identification of the root cause of an issue"}),"\n",(0,r.jsxs)(n.li,{children:[(0,r.jsx)(n.strong,{children:"Recommendations:"}),"\n",(0,r.jsxs)(n.ul,{children:["\n",(0,r.jsx)(n.li,{children:"Set a SLO(Service Level Objective) on the request latency and error rate and use that to drive improvements for better quality and performance"}),"\n",(0,r.jsx)(n.li,{children:"Add validation of instrumentation to automated tests that exercise critical data flow and request processing paths"}),"\n",(0,r.jsx)(n.li,{children:"Build an automated load test task to create a baseline of system performance and code quality measure"}),"\n",(0,r.jsx)(n.li,{children:"Ensure instrumentation has added context to be able to identify performance impact of a single request"}),"\n",(0,r.jsx)(n.li,{children:"Configure and make use of auto-instrumentation provided by the SDKs to reduce the manual work involved with adding instrumentation"}),"\n"]}),"\n"]}),"\n"]}),"\n"]}),"\n"]}),"\n",(0,r.jsx)(n.h2,{id:"efficient-logging-and-monitoring",children:"Efficient logging and monitoring"}),"\n",(0,r.jsxs)(n.ul,{children:["\n",(0,r.jsx)(n.li,{children:"Use structured log formats eg. json. For existing applications, consider using log transformation features to inject more context, add or remove fields"}),"\n",(0,r.jsx)(n.li,{children:"Use wide event format containing adequate metadata to be able to derive meaninful signals and cross correlate across the signals."}),"\n",(0,r.jsx)(n.li,{children:"Use OpenTelemetry or ADOT SDKs which inject additional context into the logs which enables cross signal correlation and reduction in Mean Time To Identify(MTTI) therefore reducing Mean Time To Recover(MTTR)"}),"\n",(0,r.jsxs)(n.li,{children:["Use log levels appropriately - these can help you control the volume of logs and therefore the cost of ingestion.","\n",(0,r.jsxs)(n.ul,{children:["\n",(0,r.jsx)(n.li,{children:"Use ERROR for any unexpected and expected error conditions. Add as much additional context to be able to accelerate root cause analysis."}),"\n",(0,r.jsx)(n.li,{children:"Use INFO for general run time events like user login, which can provide context and are important"}),"\n",(0,r.jsx)(n.li,{children:"Use DEBUG for logging the calls in the processing path to get a deeper understanding of the application's flow and states."}),"\n"]}),"\n"]}),"\n",(0,r.jsx)(n.li,{children:"Avoid logging any data that may be considered sensitive such as PII or PHI. Where the requirement exists, consider using the data protection policy or redacting the data on ingestion. Use IAM policies to control who can view the raw data."}),"\n",(0,r.jsxs)(n.li,{children:["Use the embedded metric format(EMF) to embed metrics within logs, reducing the number of API calls to the Observability platform, reducing cost.","\n",(0,r.jsxs)(n.ul,{children:["\n",(0,r.jsx)(n.li,{children:"Avoid using EMF for metrics with high cardinality dimensions such as requestId"}),"\n"]}),"\n"]}),"\n",(0,r.jsxs)(n.li,{children:[(0,r.jsx)(n.strong,{children:"Alerts:"}),"\n",(0,r.jsxs)(n.ul,{children:["\n",(0,r.jsx)(n.li,{children:"Use anomaly detection to avoid setting rigid thresholds for alerts"}),"\n",(0,r.jsx)(n.li,{children:"Use metric math and combination alerts to reduce the number of alerts that are generated"}),"\n",(0,r.jsx)(n.li,{children:"Only alert when a SLO is at risk of/is failing"}),"\n",(0,r.jsx)(n.li,{children:"Only alert if someone can take action on notification of failure"}),"\n",(0,r.jsx)(n.li,{children:"Automate resolution of the alert where possible. For example, leverage the native platform configuration like autoscaling, automatic failover to replica or standby instance, etc."}),"\n",(0,r.jsx)(n.li,{children:"Add adequate context to the alert notification to ensure that the person who is notified can quickly identify the dashboards to look at, playbook to use"}),"\n"]}),"\n"]}),"\n",(0,r.jsxs)(n.li,{children:[(0,r.jsx)(n.strong,{children:"Dashboards:"}),"\n",(0,r.jsxs)(n.ul,{children:["\n",(0,r.jsx)(n.li,{children:"Create dashboard(s) per persona/stakeholder"}),"\n",(0,r.jsx)(n.li,{children:"Use a consistent timezone across all dashboards"}),"\n",(0,r.jsx)(n.li,{children:"Use the same time range across all widgets on a dashboard"}),"\n",(0,r.jsx)(n.li,{children:"Use annotations to add more context to dashboards"}),"\n",(0,r.jsx)(n.li,{children:"Ensure only widgets which add context to aid in error resolutions are on the dashboard"}),"\n",(0,r.jsx)(n.li,{children:"Ensure the entire dashboard fits on a single screen and trends are visible with the resolution and screen size of a laptop"}),"\n",(0,r.jsx)(n.li,{children:"Have a widget with a description of the dashboard and guidance on how to use the dashboard"}),"\n",(0,r.jsx)(n.li,{children:"Configure and display thresholds on widgets"}),"\n"]}),"\n"]}),"\n",(0,r.jsxs)(n.li,{children:[(0,r.jsx)(n.strong,{children:"Recommendations:"}),"\n",(0,r.jsxs)(n.ul,{children:["\n",(0,r.jsxs)(n.li,{children:[(0,r.jsx)(n.strong,{children:"Controlling Cost:"}),"\n",(0,r.jsxs)(n.ul,{children:["\n",(0,r.jsxs)(n.li,{children:[(0,r.jsx)(n.strong,{children:"Identify Stakeholders:"}),"\n",(0,r.jsxs)(n.ul,{children:["\n",(0,r.jsx)(n.li,{children:"Determine the different personas interested in feature performance, such as functionality, availability, security, cost, sales, and product usage."}),"\n",(0,r.jsx)(n.li,{children:"Stakeholders can include development teams, end customers, internal business stakeholders, platform operations teams, or application developers."}),"\n"]}),"\n"]}),"\n",(0,r.jsxs)(n.li,{children:[(0,r.jsx)(n.strong,{children:"Identify key outcomes:"}),"\n",(0,r.jsxs)(n.ul,{children:["\n",(0,r.jsx)(n.li,{children:"For each stakeholder, define quantifiable outcomes (e.g., error rates, request processing duration, number of logins per minute, number of products purchased per minute, number of abandoned carts, etc) that are typically measured using Service Level Objectives (SLOs)."}),"\n",(0,r.jsx)(n.li,{children:"Use these SLOs per persona to identify required instrumentation"}),"\n"]}),"\n"]}),"\n",(0,r.jsxs)(n.li,{children:[(0,r.jsx)(n.strong,{children:"Choose the right signal:"}),"\n",(0,r.jsxs)(n.ul,{children:["\n",(0,r.jsx)(n.li,{children:"A wide log with enough context can be converted into metrics and traces giving one source of truth, controlling cost and enabling signal correlation"}),"\n",(0,r.jsxs)(n.li,{children:["Run an ",(0,r.jsx)(n.a,{href:"https://catalog.us-east-1.prod.workshops.aws/workshops/e31f4fcc-1944-4e46-815d-26fc9eafabce/en-US/5-practical-examples/5-1petstore-site-exercise/scenario1",children:"Observability Strategy Workshop"})," to identify the right signals to be instrumentated into the application"]}),"\n"]}),"\n"]}),"\n"]}),"\n"]}),"\n",(0,r.jsxs)(n.li,{children:[(0,r.jsx)(n.strong,{children:"Choose the right signal:"}),"\n",(0,r.jsxs)(n.ul,{children:["\n",(0,r.jsx)(n.li,{children:'Logs and traces help you find out the root cause of a failure or unexpected behaviour. Ensure to add logs which can help you answer questions like "why did a particular request fail?" or "what would I need to know for the SLO related to request duration if there is an increase in the p50 or p99 for the request processing time?"'}),"\n",(0,r.jsx)(n.li,{children:"Metrics are good to understand baseline performance, predict trends and anomalies. They can proactively give you an indication of something not working as expected. Custom metrics are however expensive."}),"\n"]}),"\n"]}),"\n",(0,r.jsxs)(n.li,{children:[(0,r.jsx)(n.strong,{children:"Reduce Alert Fatigue:"}),"\n",(0,r.jsxs)(n.ul,{children:["\n",(0,r.jsx)(n.li,{children:"Depending on the configuration, alerts can proactively or reactively highlight an issue in the system. Too many alerts can lead to alert fatigue and inefficient teams, leading to bad code quality and product delivery."}),"\n"]}),"\n"]}),"\n",(0,r.jsxs)(n.li,{children:[(0,r.jsx)(n.strong,{children:"Periodic Reviews and Continuous Improvement:"}),"\n",(0,r.jsxs)(n.ul,{children:["\n",(0,r.jsx)(n.li,{children:"Have a periodic roster for a member on the team to monitor the dashboards and report on any new trends or patterns identified."}),"\n",(0,r.jsx)(n.li,{children:"Allocate a portion of each release to improve signals, tweak alert thresholds and dashboards based on gaps identified during retrospectives and roster observations"}),"\n",(0,r.jsx)(n.li,{children:"Prioritize fixing the root cause of a recurring alert based on effort to resolve and number of times the alert triggers"}),"\n"]}),"\n"]}),"\n"]}),"\n"]}),"\n"]}),"\n",(0,r.jsx)(n.h2,{id:"profiling-and-performance-optimization---todo",children:"Profiling and performance optimization - TODO"}),"\n",(0,r.jsxs)(n.ul,{children:["\n",(0,r.jsx)(n.li,{children:"RUM"}),"\n",(0,r.jsx)(n.li,{children:"Synthetics"}),"\n",(0,r.jsx)(n.li,{children:"XRay"}),"\n",(0,r.jsx)(n.li,{children:"OTEL SDK - auto vs manual instrumentation"}),"\n"]}),"\n",(0,r.jsx)(n.h2,{id:"error-handling-and-debugging-techniques---todo",children:"Error handling and debugging techniques - TODO"}),"\n",(0,r.jsxs)(n.ul,{children:["\n",(0,r.jsx)(n.li,{children:"Q Developer for Operational Investigations"}),"\n",(0,r.jsx)(n.li,{children:"Playbooks and run books"}),"\n",(0,r.jsx)(n.li,{children:"Service Map"}),"\n",(0,r.jsx)(n.li,{children:"Tuning XRay Sampling rules"}),"\n"]}),"\n",(0,r.jsx)(n.h2,{id:"code-reviews-and-collaboration-strategies",children:"Code reviews and collaboration strategies"}),"\n",(0,r.jsxs)(n.ul,{children:["\n",(0,r.jsxs)(n.li,{children:[(0,r.jsx)(n.strong,{children:"Ticket elaboration:"}),"\n",(0,r.jsxs)(n.ul,{children:["\n",(0,r.jsxs)(n.li,{children:["Identify Observability requirements as part of the feature elaboration process. This may include","\n",(0,r.jsxs)(n.ul,{children:["\n",(0,r.jsx)(n.li,{children:"Impacted Stakeholders and related SLOs"}),"\n",(0,r.jsx)(n.li,{children:"Required telemetry/signals"}),"\n",(0,r.jsx)(n.li,{children:"Required alerts"}),"\n",(0,r.jsx)(n.li,{children:"List of dashboards to be created or updated"}),"\n"]}),"\n"]}),"\n"]}),"\n"]}),"\n",(0,r.jsxs)(n.li,{children:[(0,r.jsx)(n.strong,{children:"Blamesless retrospectives:"}),"\n",(0,r.jsxs)(n.ul,{children:["\n",(0,r.jsx)(n.li,{children:"After every incident, conduct a blameless retrospective to look for opportunities to improve processes or add automation. Always factor in cost of change and ensure you leave each post mortem exercise with at least one agreed upon actionable item which also has a timeline for completion associated with it."}),"\n"]}),"\n"]}),"\n",(0,r.jsxs)(n.li,{children:[(0,r.jsx)(n.strong,{children:"Operational Readiness Reviews:"}),"\n",(0,r.jsxs)(n.ul,{children:["\n",(0,r.jsx)(n.li,{children:"Participate in operational readiness reviews with the platform and operations team to identify gaps in observability posture - this can be a checklist and a mandatory exercise before deployments to production. For large organisations with multiple teams, to avoid this process becoming a bottleneck, conduct these periodically, per new feature and release cadence."}),"\n"]}),"\n"]}),"\n",(0,r.jsxs)(n.li,{children:[(0,r.jsx)(n.strong,{children:"Recommendations:"}),"\n",(0,r.jsxs)(n.ul,{children:["\n",(0,r.jsxs)(n.li,{children:["Use a tool like ",(0,r.jsx)(n.a,{href:"https://docs.aws.amazon.com/incident-manager/latest/userguide/analysis.html",children:"AWS Systems Manager Incident Manager"})," to help guide you through the post-incident analysis"]}),"\n",(0,r.jsxs)(n.li,{children:["Refer the ",(0,r.jsx)(n.a,{href:"https://docs.aws.amazon.com/wellarchitected/latest/operational-readiness-reviews/wa-operational-readiness-reviews.html",children:"Operational Readiness Review"})," for inspiration on questions to include in your operational readiness review checklist or process."]}),"\n",(0,r.jsx)(n.li,{children:"Always share learnings from retrospectives, operational readiness reviews - this could be via a wiki or mail group subscriptions"}),"\n"]}),"\n"]}),"\n"]}),"\n",(0,r.jsx)(n.h2,{id:"api-design-and-documentation-guidelines",children:"API design and documentation guidelines"}),"\n",(0,r.jsxs)(n.ul,{children:["\n",(0,r.jsxs)(n.li,{children:[(0,r.jsx)(n.strong,{children:"Versioning:"}),"\n",(0,r.jsxs)(n.ul,{children:["\n",(0,r.jsx)(n.li,{children:"Ensure APIs are versioned and the version is added as context for every request processed"}),"\n",(0,r.jsx)(n.li,{children:"Where sending custom metrics, add a dimension on the version if applicable"}),"\n",(0,r.jsx)(n.li,{children:"Add an annotation or identifier on dashboards to clearly distinguish a cutover from one version to another"}),"\n",(0,r.jsx)(n.li,{children:"Ensure you track the requests to each version and a widget to visualize usage of the versions. This is to ascertain that requests are being routed as expected and also to reduce the time to identify the root cause. This can provide increased confidence when deprecating and removing an older version"}),"\n"]}),"\n"]}),"\n",(0,r.jsxs)(n.li,{children:[(0,r.jsx)(n.strong,{children:"Backwards Compatibilty:"}),"\n",(0,r.jsxs)(n.ul,{children:["\n",(0,r.jsx)(n.li,{children:"Ensure there are no requests to older versions before removing the code paths related to an older API version"}),"\n"]}),"\n"]}),"\n",(0,r.jsxs)(n.li,{children:[(0,r.jsx)(n.strong,{children:"Batch APIs:"}),"\n",(0,r.jsxs)(n.ul,{children:["\n",(0,r.jsx)(n.li,{children:"Emit signals for the status of each individual request as well as for the overall batch request"}),"\n",(0,r.jsx)(n.li,{children:"Ensure context is added to the logs identifying the batch request id and individual request"}),"\n"]}),"\n"]}),"\n"]})]})}function h(e={}){const{wrapper:n}={...(0,t.R)(),...e.components};return n?(0,r.jsx)(n,{...e,children:(0,r.jsx)(c,{...e})}):c(e)}}}]);
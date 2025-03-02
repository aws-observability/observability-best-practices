"use strict";(self.webpackChunkobservability_best_practices=self.webpackChunkobservability_best_practices||[]).push([[8714],{20471:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>c,contentTitle:()=>r,default:()=>u,frontMatter:()=>a,metadata:()=>i,toc:()=>l});const i=JSON.parse('{"id":"patterns/multiaccountoss","title":"Cross account monitoring with AWS Open source service","description":"Introduction","source":"@site/docs/patterns/multiaccountoss.md","sourceDirName":"patterns","slug":"/patterns/multiaccountoss","permalink":"/observability-best-practices/patterns/multiaccountoss","draft":false,"unlisted":false,"editUrl":"https://github.com/aws-observability/observability-best-practices/blob/main/docusaurus/docs/patterns/multiaccountoss.md","tags":[],"version":"current","frontMatter":{},"sidebar":"patterns","previous":{"title":"Cross account Monitoring with AWS Native services","permalink":"/observability-best-practices/patterns/multiaccount"},"next":{"title":"ADOT Observability Pipeline","permalink":"/observability-best-practices/patterns/o11ypipeline"}}');var o=n(74848),s=n(28453);const a={},r="Cross account monitoring with AWS Open source service",c={},l=[{value:"Introduction",id:"introduction",level:2},{value:"Core Components",id:"core-components",level:2},{value:"Data Collection and Flow",id:"data-collection-and-flow",level:2},{value:"Benefits and Considerations",id:"benefits-and-considerations",level:2},{value:"Conclusion",id:"conclusion",level:2}];function d(e){const t={em:"em",h1:"h1",h2:"h2",header:"header",img:"img",p:"p",...(0,s.R)(),...e.components};return(0,o.jsxs)(o.Fragment,{children:[(0,o.jsx)(t.header,{children:(0,o.jsx)(t.h1,{id:"cross-account-monitoring-with-aws-open-source-service",children:"Cross account monitoring with AWS Open source service"})}),"\n",(0,o.jsx)(t.h2,{id:"introduction",children:"Introduction"}),"\n",(0,o.jsx)(t.p,{children:"Modern cloud environments often span multiple accounts and include on-premises infrastructure, creating complex monitoring challenges. To address these challenges, a sophisticated monitoring architecture can be implemented using AWS services and industry-standard tools. This architecture enables comprehensive visibility across diverse environments, facilitating efficient management and quick issue resolution."}),"\n",(0,o.jsx)(t.h2,{id:"core-components",children:"Core Components"}),"\n",(0,o.jsx)(t.p,{children:"At the heart of this monitoring solution is AWS Distro for OpenTelemetry (ADOT), which serves as a centralized collection point for metrics from various sources. ADOT is deployed in a dedicated central AWS account, forming the hub of the monitoring infrastructure. This central deployment allows for streamlined data aggregation and processing."}),"\n",(0,o.jsx)(t.p,{children:"Amazon Managed Service for Prometheus is another crucial component, providing a scalable and managed time-series database for storing the collected metrics. This service eliminates the need for self-managed Prometheus instances, reducing operational overhead and ensuring high availability of metric data."}),"\n",(0,o.jsx)(t.p,{children:"For visualization and analysis, Grafana is integrated into the architecture. Grafana connects to the Amazon Managed Service for Prometheus, offering powerful querying capabilities and customizable dashboards. This allows teams to create insightful visualizations and set up alerting based on the collected metrics."}),"\n",(0,o.jsxs)(t.p,{children:[(0,o.jsx)(t.img,{alt:"multiaccount AMP",src:n(26885).A+"",width:"1578",height:"900"}),"\n",(0,o.jsx)(t.em,{children:"Figure 1: Multi account monitoring with AWS Open source services"})]}),"\n",(0,o.jsx)(t.h2,{id:"data-collection-and-flow",children:"Data Collection and Flow"}),"\n",(0,o.jsx)(t.p,{children:"The architecture supports data collection from multiple AWS accounts, referred to as monitored accounts. These accounts use the OpenTelemetry Protocol (OTLP) to export their metrics to the central ADOT instance. This standardized approach ensures consistency in data format and facilitates easy integration of new accounts into the monitoring setup."}),"\n",(0,o.jsx)(t.p,{children:"On-premises infrastructure is also incorporated into this monitoring solution. These systems send their metrics data to the central ADOT instance using secure HTTPS POST requests. This method allows for the inclusion of legacy or non-cloud systems in the overall monitoring strategy, providing a truly comprehensive view of the entire IT environment."}),"\n",(0,o.jsx)(t.p,{children:"Once the data reaches the central ADOT instance, it is processed and forwarded to the Amazon Managed Service for Prometheus using the Prometheus remote write protocol. This step ensures that all collected metrics are stored in a format optimized for time-series data, enabling efficient querying and analysis."}),"\n",(0,o.jsx)(t.h2,{id:"benefits-and-considerations",children:"Benefits and Considerations"}),"\n",(0,o.jsx)(t.p,{children:"This architecture offers several key benefits. It provides a centralized view of metrics from diverse sources, enabling holistic monitoring of complex environments. The use of managed services reduces the operational burden on teams, allowing them to focus on analysis rather than infrastructure maintenance. Additionally, the architecture is highly scalable, capable of accommodating growth in both the number of monitored systems and the volume of metrics collected."}),"\n",(0,o.jsx)(t.p,{children:"However, implementing this architecture also comes with considerations. The centralized nature of the solution means that the monitoring infrastructure in the central account becomes critical, requiring careful planning for high availability and disaster recovery. There may also be cost implications associated with data transfer between accounts and the usage of managed services, which should be factored into budgeting decisions."}),"\n",(0,o.jsx)(t.p,{children:"Security is another important aspect to consider. Proper IAM roles and permissions must be set up to allow secure cross-account metric collection. For on-premises systems, ensuring secure and authenticated HTTPS connections is crucial to maintain the integrity and confidentiality of the monitoring data."}),"\n",(0,o.jsx)(t.h2,{id:"conclusion",children:"Conclusion"}),"\n",(0,o.jsx)(t.p,{children:"This advanced AWS cloud monitoring architecture provides a robust solution for organizations with complex, multi-account, and hybrid infrastructure environments. By leveraging AWS managed services and industry-standard tools like OpenTelemetry and Grafana, it offers a scalable and powerful monitoring solution. While it requires careful planning and management to implement effectively, the benefits of comprehensive visibility and centralized monitoring make it a valuable approach for modern cloud-native and hybrid environments."}),"\n",(0,o.jsx)(t.p,{children:"The flexibility of this architecture allows it to adapt to various organizational needs and can evolve as monitoring requirements change. As cloud environments continue to grow in complexity, having such a centralized and comprehensive monitoring solution becomes increasingly critical for maintaining operational excellence and ensuring optimal performance across all infrastructure components."})]})}function u(e={}){const{wrapper:t}={...(0,s.R)(),...e.components};return t?(0,o.jsx)(t,{...e,children:(0,o.jsx)(d,{...e})}):d(e)}},26885:(e,t,n)=>{n.d(t,{A:()=>i});const i=n.p+"assets/images/multiaccountoss-0324cd87d64306848c58ef673330cbff.png"},28453:(e,t,n)=>{n.d(t,{R:()=>a,x:()=>r});var i=n(96540);const o={},s=i.createContext(o);function a(e){const t=i.useContext(s);return i.useMemo((function(){return"function"==typeof e?e(t):{...t,...e}}),[t,e])}function r(e){let t;return t=e.disableParentContext?"function"==typeof e.components?e.components(o):e.components||o:a(e.components),i.createElement(s.Provider,{value:t},e.children)}}}]);
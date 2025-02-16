"use strict";(self.webpackChunkobservability_best_practices=self.webpackChunkobservability_best_practices||[]).push([[8173],{5254:(e,t,n)=>{n.d(t,{A:()=>i});const i=n.p+"assets/images/x-ray-results-77cd2763e179758e2252045d5a605b0e.png"},28453:(e,t,n)=>{n.d(t,{R:()=>r,x:()=>o});var i=n(96540);const a={},s=i.createContext(a);function r(e){const t=i.useContext(s);return i.useMemo((function(){return"function"==typeof e?e(t):{...t,...e}}),[t,e])}function o(e){let t;return t=e.disableParentContext?"function"==typeof e.components?e.components(a):e.components||a:r(e.components),i.createElement(s.Provider,{value:t},e.children)}},65047:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>l,contentTitle:()=>r,default:()=>h,frontMatter:()=>s,metadata:()=>o,toc:()=>c});var i=n(74848),a=n(28453);const s={},r="Instrumenting Java Spring Integration Applications",o={id:"guides/operational/adot-at-scale/adot-java-spring/adot-java-spring",title:"Instrumenting Java Spring Integration Applications",description:"This article describes an approach for manually instrumenting Spring-Integration applications utilizing Open Telemetry and X-ray.",source:"@site/docs/guides/operational/adot-at-scale/adot-java-spring/adot-java-spring.md",sourceDirName:"guides/operational/adot-at-scale/adot-java-spring",slug:"/guides/operational/adot-at-scale/adot-java-spring/",permalink:"/observability-best-practices/guides/operational/adot-at-scale/adot-java-spring/",draft:!1,unlisted:!1,editUrl:"https://github.com/aws-observability/observability-best-practices/blob/main/docusaurus/docs/guides/operational/adot-at-scale/adot-java-spring/adot-java-spring.md",tags:[],version:"current",frontMatter:{},sidebar:"guides",previous:{title:"Operating the AWS Distro for OpenTelemetry (ADOT) Collector",permalink:"/observability-best-practices/guides/operational/adot-at-scale/operating-adot-collector"},next:{title:"Why should you do observability?",permalink:"/observability-best-practices/guides/operational/business/monitoring-for-business-outcomes"}},l={},c=[{value:"Background Information",id:"background-information",level:2},{value:"What is tracing?",id:"what-is-tracing",level:3},{value:"Tracing Utilizing Context Propagation",id:"tracing-utilizing-context-propagation",level:2},{value:"To run this sample application use:",id:"to-run-this-sample-application-use",level:3},{value:"Results",id:"results",level:2},{value:"FAQ",id:"faq",level:2},{value:"How do we create nested spans?",id:"how-do-we-create-nested-spans",level:3},{value:"Explicitly",id:"explicitly",level:5},{value:"Implicitly",id:"implicitly",level:5},{value:"Context Propagation",id:"context-propagation",level:5},{value:"How are OpenTelemetry properties translated into X-Ray properties?",id:"how-are-opentelemetry-properties-translated-into-x-ray-properties",level:3}];function p(e){const t={a:"a",admonition:"admonition",code:"code",h1:"h1",h2:"h2",h3:"h3",h5:"h5",img:"img",li:"li",p:"p",pre:"pre",ul:"ul",...(0,a.R)(),...e.components};return(0,i.jsxs)(i.Fragment,{children:[(0,i.jsx)(t.h1,{id:"instrumenting-java-spring-integration-applications",children:"Instrumenting Java Spring Integration Applications"}),"\n",(0,i.jsxs)(t.p,{children:["This article describes an approach for manually instrumenting ",(0,i.jsx)(t.a,{href:"https://docs.spring.io/spring-integration/reference/overview.html",children:"Spring-Integration"})," applications utilizing ",(0,i.jsx)(t.a,{href:"https://opentelemetry.io/",children:"Open Telemetry"})," and ",(0,i.jsx)(t.a,{href:"https://aws.amazon.com/xray/",children:"X-ray"}),"."]}),"\n",(0,i.jsx)(t.p,{children:"The Spring-Integration framework is designed to enable the development of integration solutions typical of event-driven architectures and messaging-centric architectures. On the other hand, OpenTelemetry tends to be more focused on micro services architectures, in which services communicate and coordinate with each other using HTTP requests. Therefore this guide will provide an example of how to instrument Spring-Integration applications using manual instrumentation with the OpenTelemetry API."}),"\n",(0,i.jsx)(t.h2,{id:"background-information",children:"Background Information"}),"\n",(0,i.jsx)(t.h3,{id:"what-is-tracing",children:"What is tracing?"}),"\n",(0,i.jsxs)(t.p,{children:["The following quote from the ",(0,i.jsx)(t.a,{href:"https://opentelemetry.io/docs/concepts/signals/traces/",children:"OpenTelemetry documentation"})," gives a good overview of what a trace's purpose is:"]}),"\n",(0,i.jsx)(t.admonition,{type:"note",children:(0,i.jsx)(t.p,{children:"Traces give us the big picture of what happens when a request is made to an application. Whether your application is a monolith with a single database or a sophisticated mesh of services, traces are essential to understanding the full \u201cpath\u201d a request takes in your application."})}),"\n",(0,i.jsxs)(t.p,{children:["Given that one of the main benefits of tracing is end-to-end visibility of a request, it is important for traces to link properly all the way from the request origin to the backend. A common way of doing this in OpenTelemetry is to utilize ",(0,i.jsx)(t.a,{href:"https://opentelemetry.io/docs/instrumentation/java/manual/#create-nested-spans",children:"nested spans"}),". This works in a microservices architecture where the spans are passed from service to service until they reach the final destination. In a Spring Integration application, we need to create parent/child relationships between spans created both remotely AND locally."]}),"\n",(0,i.jsx)(t.h2,{id:"tracing-utilizing-context-propagation",children:"Tracing Utilizing Context Propagation"}),"\n",(0,i.jsx)(t.p,{children:"We will demonstrate an approach using context propagation. Although this approach is traditionally used when you need to create parent/child relationship between spans created locally and in remote locations, it will be used for the case of the Spring Integration Application because it simplifies the code and will allow the application to scale: it will be possible to process messages in parallel in multiple threads and it will also be possible to scale horizontally in case we need to process messages in different hosts."}),"\n",(0,i.jsx)(t.p,{children:"Here is an overview of what is necessary to achieve this:"}),"\n",(0,i.jsxs)(t.ul,{children:["\n",(0,i.jsxs)(t.li,{children:["\n",(0,i.jsxs)(t.p,{children:["Create a ",(0,i.jsx)(t.code,{children:"ChannelInterceptor"})," and register it as a ",(0,i.jsx)(t.code,{children:"GlobalChannelInterceptor"})," so that it can capture messages being sent across all channels."]}),"\n"]}),"\n",(0,i.jsxs)(t.li,{children:["\n",(0,i.jsxs)(t.p,{children:["In the ",(0,i.jsx)(t.code,{children:"ChannelInterceptor"}),":"]}),"\n",(0,i.jsxs)(t.ul,{children:["\n",(0,i.jsxs)(t.li,{children:["In the ",(0,i.jsx)(t.code,{children:"preSend"})," method:","\n",(0,i.jsxs)(t.ul,{children:["\n",(0,i.jsx)(t.li,{children:"try to read the context from the previous message that is being generated upstream.This is where we are able to connect spans from upstream messages. If no context exists, a new trace is started (this is done by the OpenTelemetry SDK)."}),"\n",(0,i.jsx)(t.li,{children:"Create a Span with a unique name that identifies that operation. This can be the name of the channel where this message is being processed."}),"\n",(0,i.jsx)(t.li,{children:"Save current context in the message."}),"\n",(0,i.jsx)(t.li,{children:"Store the context and scope in thread.local so that they can be closed afterwards."}),"\n",(0,i.jsx)(t.li,{children:"inject context in the message being sent downstream."}),"\n"]}),"\n"]}),"\n",(0,i.jsxs)(t.li,{children:["In the ",(0,i.jsx)(t.code,{children:"afterSendCompletion"}),":","\n",(0,i.jsxs)(t.ul,{children:["\n",(0,i.jsx)(t.li,{children:"Restore the context and scope from thread.local"}),"\n",(0,i.jsx)(t.li,{children:"Recreate the span from the context."}),"\n",(0,i.jsx)(t.li,{children:"Register any exceptions raised while processing the message."}),"\n",(0,i.jsx)(t.li,{children:"Close Scope."}),"\n",(0,i.jsx)(t.li,{children:"End Span."}),"\n"]}),"\n"]}),"\n"]}),"\n"]}),"\n"]}),"\n",(0,i.jsxs)(t.p,{children:["This is a simplified description of what needs to be done. We are providing a functional sample application that uses the Spring-Integration framework. The code for this application can be found ",(0,i.jsx)(t.a,{href:"https://github.com/rapphil/spring-integration-samples/tree/rapphil-5.5.x-otel/applications/file-split-ftp",children:"here"}),"."]}),"\n",(0,i.jsxs)(t.p,{children:["To view only the changes that were put in place to instrument the application, view this ",(0,i.jsx)(t.a,{href:"https://github.com/rapphil/spring-integration-samples/compare/30e01ce9eefd8dae288eca44013810afa8c1a585..6f056a76350340a9658db0cad7fc12dbda505437",children:"diff"}),"."]}),"\n",(0,i.jsx)(t.h3,{id:"to-run-this-sample-application-use",children:"To run this sample application use:"}),"\n",(0,i.jsx)(t.pre,{children:(0,i.jsx)(t.code,{className:"language-bash",children:"# build and run\nmvn spring-boot:run\n# create sample input file to trigger flow\necho 'testcontent\\nline2content\\nlastline' > /tmp/in/testfile.txt\n"})}),"\n",(0,i.jsxs)(t.p,{children:["To experiment with this sample application, you will need to have the ",(0,i.jsx)(t.a,{href:"https://aws-otel.github.io/docs/getting-started/collector",children:"ADOT collector"})," running in the same machine as the application with a configuration similar to the following one:"]}),"\n",(0,i.jsx)(t.pre,{children:(0,i.jsx)(t.code,{className:"language-yaml",children:"receivers:\n  otlp:\n    protocols:\n      grpc: \n        endpoint: 0.0.0.0:4317\n      http:\n        endpoint: 0.0.0.0:4318\nprocessors:\n  batch/traces:\n    timeout: 1s\n    send_batch_size: 50\n  batch/metrics:\n    timeout: 60s\nexporters:\n  aws xray: region:us-west-2\n  aws emf:\n    region: us-west-2\nservice:\n  pipelines:\n    traces:\n      receivers: [otlp]\n      processors: [batch/traces]\n      exporters: [awsxray]\n    metrics:\n      receivers: [otlp]\n      processors: [batch/metrics]\n      exporters: [awsemf]\n"})}),"\n",(0,i.jsx)(t.h2,{id:"results",children:"Results"}),"\n",(0,i.jsx)(t.p,{children:"If we run the sample application and then run the following command, this is what we get:"}),"\n",(0,i.jsx)(t.pre,{children:(0,i.jsx)(t.code,{className:"language-bash",children:"echo 'foo123\\nbar123\\nfoo1234' > /tmp/in/testfile.txt\n"})}),"\n",(0,i.jsx)(t.p,{children:(0,i.jsx)(t.img,{alt:"X-ray Results",src:n(5254).A+"",width:"1298",height:"598"})}),"\n",(0,i.jsx)(t.p,{children:"We can see that the segments above match the workflow described in the sample application. Exceptions are expected when some of the messages were processed, therefore we can see that they are being properly registered and will allow us to troubleshoot them in X-Ray."}),"\n",(0,i.jsx)(t.h2,{id:"faq",children:"FAQ"}),"\n",(0,i.jsx)(t.h3,{id:"how-do-we-create-nested-spans",children:"How do we create nested spans?"}),"\n",(0,i.jsx)(t.p,{children:"There are three mechanisms in OpenTelemetry that can be used to connect spans:"}),"\n",(0,i.jsx)(t.h5,{id:"explicitly",children:"Explicitly"}),"\n",(0,i.jsx)(t.p,{children:"You need to pass the parent span to the place where the child span is created and link both of them using:"}),"\n",(0,i.jsx)(t.pre,{children:(0,i.jsx)(t.code,{className:"language-java",children:'    Span childSpan = tracer.spanBuilder("child")\n    .setParent(Context.current().with(parentSpan)) \n    .startSpan();\n'})}),"\n",(0,i.jsx)(t.h5,{id:"implicitly",children:"Implicitly"}),"\n",(0,i.jsx)(t.p,{children:"The span context will be stored in thread.local under the hood.\nThis method is indicated when you are sure that you are creating spans in the same thread."}),"\n",(0,i.jsx)(t.pre,{children:(0,i.jsx)(t.code,{className:"language-java",children:'    void parentTwo() {\n        Span parentSpan = tracer.spanBuilder("parent").startSpan(); \n        try(Scope scope = parentSpan.makeCurrent()) {\n            childTwo(); \n        } finally {\n        parentSpan.end(); \n        }\n    }\n    void childTwo() {\n        Span childSpan = tracer.spanBuilder("child")\n            // NOTE: setParent(...) is not required;\n            // `Span.current()` is automatically added as the parent \n            .startSpan();\n        try(Scope scope = childSpan.makeCurrent()) { \n            // do stuff\n        } finally {\n            childSpan.end();\n        } \n    }\n'})}),"\n",(0,i.jsx)(t.h5,{id:"context-propagation",children:"Context Propagation"}),"\n",(0,i.jsx)(t.p,{children:"This method will store the context somewhere (HTTP headers or in a message) so that it can be transported to a remote location where the child span is created. It is not a strict requirement to be a remote location. This can be used in the same process as well."}),"\n",(0,i.jsx)(t.h3,{id:"how-are-opentelemetry-properties-translated-into-x-ray-properties",children:"How are OpenTelemetry properties translated into X-Ray properties?"}),"\n",(0,i.jsxs)(t.p,{children:["Please see the following ",(0,i.jsx)(t.a,{href:"https://opentelemetry.io/docs/instrumentation/java/manual/#context-propagation",children:"guide"})," to view the relationship."]})]})}function h(e={}){const{wrapper:t}={...(0,a.R)(),...e.components};return t?(0,i.jsx)(t,{...e,children:(0,i.jsx)(p,{...e})}):p(e)}}}]);
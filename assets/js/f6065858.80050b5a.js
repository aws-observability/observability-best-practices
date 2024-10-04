"use strict";(self.webpackChunkobservability_best_practices=self.webpackChunkobservability_best_practices||[]).push([[2353],{68603:(e,a,t)=>{t.r(a),t.d(a,{assets:()=>c,contentTitle:()=>o,default:()=>h,frontMatter:()=>r,metadata:()=>i,toc:()=>l});var s=t(74848),n=t(28453);const r={},o="AWS X-Ray - FAQ",i={id:"faq/x-ray",title:"AWS X-Ray - FAQ",description:"1. Does AWS Distro for Open Telemetry (ADOT) support trace propagation across AWS services such as Event Bridge or SQS?",source:"@site/docs/faq/x-ray.md",sourceDirName:"faq",slug:"/faq/x-ray",permalink:"/observability-best-practices/faq/x-ray",draft:!1,unlisted:!1,editUrl:"https://github.com/aws-observability/observability-best-practices/blob/main/docusaurus/docs/faq/x-ray.md",tags:[],version:"current",frontMatter:{},sidebar:"faq",previous:{title:"Amazon CloudWatch - FAQ",permalink:"/observability-best-practices/faq/cloudwatch"},next:{title:"Amazon Managed Service for Prometheus - FAQ",permalink:"/observability-best-practices/faq/amp"}},c={},l=[];function d(e){const a={a:"a",h1:"h1",li:"li",ol:"ol",strong:"strong",...(0,n.R)(),...e.components};return(0,s.jsxs)(s.Fragment,{children:[(0,s.jsx)(a.h1,{id:"aws-x-ray---faq",children:"AWS X-Ray - FAQ"}),"\n",(0,s.jsxs)(a.ol,{children:["\n",(0,s.jsx)(a.li,{children:"**Does AWS Distro for Open Telemetry (ADOT) support trace propagation across AWS services such as Event Bridge or SQS?\n**Technically, that\u2019s not ADOT but AWS X-Ray. We are working on expanding the number and types of AWS services that propagate and/or generate spans. If you have a use case depending on this, please reach out to us."}),"\n",(0,s.jsxs)(a.li,{children:[(0,s.jsx)(a.strong,{children:"Will I be able to use the W3C trace header to ingest spans into AWS X-Ray using ADOT?"}),"\nYes, later in 2023. We\u2019re working on supporting W3C trace context propagation."]}),"\n",(0,s.jsxs)(a.li,{children:["Can I trace requests across Lambda functions when SQS is involved in the middle?\nYes. X-Ray now supports tracing across Lambda functions when SQS is involved in the middle. Traces from upstream message producers are ",(0,s.jsx)(a.a,{href:"https://docs.aws.amazon.com/xray/latest/devguide/xray-services-sqs.html",children:"automatically linked to traces"})," from downstream Lambda consumer nodes, creating an end-to-end view of the application."]}),"\n",(0,s.jsxs)(a.li,{children:[(0,s.jsx)(a.strong,{children:"Should I use X-Ray SDK or the OTel SDK to instrument my application?"}),"\nOTel offers more features than the X-Ray SDK, but to choose which one is right for your use case see ",(0,s.jsx)(a.a,{href:"https://docs.aws.amazon.com/xray/latest/devguide/xray-instrumenting-your-app.html#xray-instrumenting-choosing",children:"Choosing between ADOT and X-Ray SDK"})]}),"\n",(0,s.jsxs)(a.li,{children:[(0,s.jsxs)(a.strong,{children:["Are ",(0,s.jsx)(a.a,{href:"https://opentelemetry.io/docs/instrumentation/ruby/manual/#add-span-events",children:"span events"})," supported in AWS X-Ray?"]}),"\nSpan events do not fit into the X-Ray model and are hence dropped."]}),"\n",(0,s.jsxs)(a.li,{children:[(0,s.jsx)(a.strong,{children:"How can I extract data out of AWS X-Ray?"}),"\nYou can retrieve Service Graph, Traces and Root cause analytics data ",(0,s.jsx)(a.a,{href:"https://docs.aws.amazon.com/xray/latest/devguide/xray-api-gettingdata.html",children:"using X-Ray APIs"}),"."]}),"\n",(0,s.jsxs)(a.li,{children:[(0,s.jsx)(a.strong,{children:"Can I achieve 100% sampling? That is, I want all traces to be recorded without sampling at all."}),"\nYou can adjust the sampling rules to capture significantly increased amount of trace data. As long as the total segments sent do not breach the ",(0,s.jsx)(a.a,{href:"https://docs.aws.amazon.com/general/latest/gr/xray.html#limits_xray",children:"service quota limits mentioned here"}),", X-Ray will make an effort to collect data as configured. There is no guarantee that this will result in 100% trace data capture as a result."]}),"\n",(0,s.jsxs)(a.li,{children:[(0,s.jsx)(a.strong,{children:"Can I dynamically increase or decrease sampling rules through APIs?"}),"\nYes, you can use the ",(0,s.jsx)(a.a,{href:"https://docs.aws.amazon.com/xray/latest/devguide/xray-api-sampling.html",children:"X-Ray sampling APIs"})," to make adjustments dynamically as necessary. See this ",(0,s.jsx)(a.a,{href:"https://aws.amazon.com/blogs/mt/dynamically-adjusting-x-ray-sampling-rules/",children:"blog for a use-case based explanation"}),"."]}),"\n",(0,s.jsxs)(a.li,{children:[(0,s.jsx)(a.strong,{children:"Product FAQ"}),"\n",(0,s.jsx)(a.a,{href:".",children:"https://aws.amazon.com/xray/faqs/"})]}),"\n"]})]})}function h(e={}){const{wrapper:a}={...(0,n.R)(),...e.components};return a?(0,s.jsx)(a,{...e,children:(0,s.jsx)(d,{...e})}):d(e)}},28453:(e,a,t)=>{t.d(a,{R:()=>o,x:()=>i});var s=t(96540);const n={},r=s.createContext(n);function o(e){const a=s.useContext(r);return s.useMemo((function(){return"function"==typeof e?e(a):{...a,...e}}),[a,e])}function i(e){let a;return a=e.disableParentContext?"function"==typeof e.components?e.components(n):e.components||n:o(e.components),s.createElement(r.Provider,{value:a},e.children)}}}]);
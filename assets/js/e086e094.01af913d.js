"use strict";(self.webpackChunkobservability_best_practices=self.webpackChunkobservability_best_practices||[]).push([[9758],{2787:(e,t,o)=>{o.d(t,{A:()=>n});const n=o.p+"assets/images/rum1-1ff7c8ed90dd5ebf946f603c1262139d.png"},28453:(e,t,o)=>{o.d(t,{R:()=>s,x:()=>r});var n=o(96540);const i={},a=n.createContext(i);function s(e){const t=n.useContext(a);return n.useMemo((function(){return"function"==typeof e?e(t):{...t,...e}}),[t,e])}function r(e){let t;return t=e.disableParentContext?"function"==typeof e.components?e.components(i):e.components||i:s(e.components),n.createElement(a.Provider,{value:t},e.children)}},40808:(e,t,o)=>{o.d(t,{A:()=>n});const n=o.p+"assets/images/rum2-a87d1162e7120b160c6fec3a3570df38.png"},50477:(e,t,o)=>{o.r(t),o.d(t,{assets:()=>c,contentTitle:()=>s,default:()=>h,frontMatter:()=>a,metadata:()=>r,toc:()=>l});var n=o(74848),i=o(28453);const a={},s="Real User Monitoring",r={id:"tools/rum",title:"Real User Monitoring",description:"With CloudWatch RUM, you can perform real user monitoring to collect and view client-side data about your web application performance from actual user sessions in near real time. The data that you can visualize and analyze includes page load times, client-side errors, and user behavior. When you view this data, you can see it all aggregated together, and also see breakdowns by the browsers and devices that your customers use.",source:"@site/docs/tools/rum.md",sourceDirName:"tools",slug:"/tools/rum",permalink:"/observability-best-practices/tools/rum",draft:!1,unlisted:!1,editUrl:"https://github.com/aws-observability/observability-best-practices/blob/main/docusaurus/docs/tools/rum.md",tags:[],version:"current",frontMatter:{},sidebar:"tools",previous:{title:"Metrics",permalink:"/observability-best-practices/tools/metrics"},next:{title:"Synthetic testing",permalink:"/observability-best-practices/tools/synthetics"}},c={},l=[{value:"Web client",id:"web-client",level:2},{value:"Authorize Your Application",id:"authorize-your-application",level:2},{value:"Data Protection &amp; Privacy",id:"data-protection--privacy",level:2},{value:"Client Code Snippet",id:"client-code-snippet",level:2},{value:"Disable URL Collection",id:"disable-url-collection",level:3},{value:"Enable Active Tracing",id:"enable-active-tracing",level:3},{value:"Inserting the Snippet",id:"inserting-the-snippet",level:3},{value:"Use Custom Metadata",id:"use-custom-metadata",level:2},{value:"Use Page Groups",id:"use-page-groups",level:2},{value:"Use Extended Metrics",id:"use-extended-metrics",level:2}];function d(e){const t={a:"a",admonition:"admonition",code:"code",h1:"h1",h2:"h2",h3:"h3",img:"img",li:"li",ol:"ol",p:"p",pre:"pre",section:"section",sup:"sup",ul:"ul",...(0,i.R)(),...e.components};return(0,n.jsxs)(n.Fragment,{children:[(0,n.jsx)(t.h1,{id:"real-user-monitoring",children:"Real User Monitoring"}),"\n",(0,n.jsx)(t.p,{children:"With CloudWatch RUM, you can perform real user monitoring to collect and view client-side data about your web application performance from actual user sessions in near real time. The data that you can visualize and analyze includes page load times, client-side errors, and user behavior. When you view this data, you can see it all aggregated together, and also see breakdowns by the browsers and devices that your customers use."}),"\n",(0,n.jsx)(t.p,{children:(0,n.jsx)(t.img,{alt:"RUM application monitor dashboard showing device breakdown",src:o(40808).A+"",width:"1293",height:"785"})}),"\n",(0,n.jsx)(t.h2,{id:"web-client",children:"Web client"}),"\n",(0,n.jsxs)(t.p,{children:["The CloudWatch RUM web client is developed and built using Node.js version 16 or higher. The code is ",(0,n.jsx)(t.a,{href:"https://github.com/aws-observability/aws-rum-web",children:"publicly available"})," on GitHub. You can use the client with ",(0,n.jsx)(t.a,{href:"https://github.com/aws-observability/aws-rum-web/blob/main/docs/cdn_angular.md",children:"Angular"})," and ",(0,n.jsx)(t.a,{href:"https://github.com/aws-observability/aws-rum-web/blob/main/docs/cdn_react.md",children:"React"})," applications."]}),"\n",(0,n.jsx)(t.p,{children:"CloudWatch RUM is designed to create no perceptible impact to your application\u2019s load time, performance, and unload time."}),"\n",(0,n.jsx)(t.admonition,{type:"note",children:(0,n.jsx)(t.p,{children:"End user data that you collect for CloudWatch RUM is retained for 30 days and then automatically deleted. If you want to keep the RUM events for a longer time, you can choose to have the app monitor send copies of the events to CloudWatch Logs in your account."})}),"\n",(0,n.jsx)(t.admonition,{type:"tip",children:(0,n.jsxs)(t.p,{children:["If avoiding potential interruption by ad blockers is a concern for your web application then you may wish to host the web client on your own content delivery network, or even inside your own web site. Our ",(0,n.jsx)(t.a,{href:"https://github.com/aws-observability/aws-rum-web/blob/main/docs/cdn_installation.md",children:"documentation on GitHub"})," provides guidance on hosting the web client from your own origin domain."]})}),"\n",(0,n.jsx)(t.h2,{id:"authorize-your-application",children:"Authorize Your Application"}),"\n",(0,n.jsx)(t.p,{children:"To use CloudWatch RUM, your application must have authorization through one of three options."}),"\n",(0,n.jsxs)(t.ol,{children:["\n",(0,n.jsx)(t.li,{children:"Use authentication from an existing identity provider that you have already set up."}),"\n",(0,n.jsx)(t.li,{children:"Use an existing Amazon Cognito identity pool"}),"\n",(0,n.jsx)(t.li,{children:"Let CloudWatch RUM create a new Amazon Cognito identity pool for the application"}),"\n"]}),"\n",(0,n.jsx)(t.admonition,{type:"info",children:(0,n.jsx)(t.p,{children:"Letting CloudWatch RUM create a new Amazon Cognito identity pool for the application requires the least effort to set up. It's the default option."})}),"\n",(0,n.jsx)(t.admonition,{type:"tip",children:(0,n.jsxs)(t.p,{children:["CloudWatch RUM can configured to separate unauthenticated users from authenticated users. See ",(0,n.jsx)(t.a,{href:"https://aws.amazon.com/blogs/mt/how-to-isolate-signed-in-users-from-guest-users-within-amazon-cloudwatch-rum/",children:"this blog post"})," for details."]})}),"\n",(0,n.jsx)(t.h2,{id:"data-protection--privacy",children:"Data Protection & Privacy"}),"\n",(0,n.jsxs)(t.p,{children:["The CloudWatch RUM client can use cookies to help collect end user data. This is useful for the user journey feature, but is not required. See ",(0,n.jsx)(t.a,{href:"https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-RUM-privacy.html",children:"our detailed documentation for privacy related information"}),".",(0,n.jsx)(t.sup,{children:(0,n.jsx)(t.a,{href:"#user-content-fn-1",id:"user-content-fnref-1","data-footnote-ref":!0,"aria-describedby":"footnote-label",children:"1"})})]}),"\n",(0,n.jsx)(t.admonition,{type:"tip",children:(0,n.jsxs)(t.p,{children:["While the collection of web application telemetry using RUM is safe and does not expose personally identifiable information (PII) to you through the console or CloudWatch Logs, be mindful that you can collect ",(0,n.jsx)(t.a,{href:"https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-RUM-custom-metadata.html",children:"custom attribute"})," through the web client. Be careful not to expose sensitive data using this mechanism."]})}),"\n",(0,n.jsx)(t.h2,{id:"client-code-snippet",children:"Client Code Snippet"}),"\n",(0,n.jsx)(t.p,{children:"While the code snippet for the CloudWatch RUM web client will be automatically generated, you can also manually modify the code snippet to configure the client to your requirements."}),"\n",(0,n.jsx)(t.admonition,{type:"info",children:(0,n.jsxs)(t.p,{children:["Use a cookie consent mechanism to dynamically enable cookie creation in singe page applications. See ",(0,n.jsx)(t.a,{href:"https://aws.amazon.com/blogs/mt/how-and-when-to-enable-session-cookies-with-amazon-cloudwatch-rum/",children:"this blog post"})," for more information."]})}),"\n",(0,n.jsx)(t.h3,{id:"disable-url-collection",children:"Disable URL Collection"}),"\n",(0,n.jsx)(t.p,{children:"Prevent the collection of resource URLs that might contain personal information."}),"\n",(0,n.jsx)(t.admonition,{type:"info",children:(0,n.jsxs)(t.p,{children:["If your application uses URLs that contain personally identifiable information (PII), we strongly recommend that you disable the collection of resource URLs by setting ",(0,n.jsx)(t.code,{children:"recordResourceUrl: false"})," in the code snippet configuration, before inserting it into your application."]})}),"\n",(0,n.jsx)(t.h3,{id:"enable-active-tracing",children:"Enable Active Tracing"}),"\n",(0,n.jsxs)(t.p,{children:["Enable end-to-end tracing by setting ",(0,n.jsx)(t.code,{children:"addXRayTraceIdHeader: true"})," in the web client. This causes the CloudWatch RUM web client to add an X-Ray trace header to HTTP requests."]}),"\n",(0,n.jsx)(t.p,{children:"If you enable this optional setting, XMLHttpRequest and fetch requests made during user sessions sampled by the app monitor are traced. You can then see traces and segments from these user sessions in the RUM dashboard, the CloudWatch ServiceLens console, and the X-Ray console."}),"\n",(0,n.jsx)(t.p,{children:"Click the checkbox to enable active tracing when setting up your application monitor in the AWS Console to have the setting automatically enabled in your code snippet."}),"\n",(0,n.jsx)(t.p,{children:(0,n.jsx)(t.img,{alt:"Active tracing setup for RUM application monitor",src:o(2787).A+"",width:"904",height:"359"})}),"\n",(0,n.jsx)(t.h3,{id:"inserting-the-snippet",children:"Inserting the Snippet"}),"\n",(0,n.jsxs)(t.p,{children:["Insert the code snippet that you copied or downloaded in the previous section inside the ",(0,n.jsx)(t.code,{children:"<head>"})," element of your application. Insert it before the ",(0,n.jsx)(t.code,{children:"<body>"})," element or any other ",(0,n.jsx)(t.code,{children:"<script>"})," tags."]}),"\n",(0,n.jsx)(t.admonition,{type:"info",children:(0,n.jsx)(t.p,{children:"If your application has multiple pages, insert the code snippet in a shared header component that is included in all pages."})}),"\n",(0,n.jsx)(t.admonition,{type:"warning",children:(0,n.jsxs)(t.p,{children:["It is critical that the web client be as early in the ",(0,n.jsx)(t.code,{children:"<head>"})," element as possible! Unlike passive web trackers that are loaded near the bottom of a page's HTML, for RUM to capture the most performance data requires it be instantiated early in the page render process."]})}),"\n",(0,n.jsx)(t.h2,{id:"use-custom-metadata",children:"Use Custom Metadata"}),"\n",(0,n.jsxs)(t.p,{children:["You can add custom metadata to the CloudWatch RUM events default ",(0,n.jsx)(t.a,{href:"https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-RUM-datacollected.html#CloudWatch-RUM-datacollected-metadata",children:"event metadata"}),". Session attributes are added to all events in a user's session. Page attributes are added only to the pages specified."]}),"\n",(0,n.jsx)(t.admonition,{type:"info",children:(0,n.jsxs)(t.p,{children:["Avoid using reserved keywords noted on ",(0,n.jsx)(t.a,{href:"https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-RUM-custom-metadata.html#CloudWatch-RUM-custom-metadata-syntax",children:"this page"})," as key names for your custom attributes"]})}),"\n",(0,n.jsx)(t.h2,{id:"use-page-groups",children:"Use Page Groups"}),"\n",(0,n.jsxs)(t.admonition,{type:"info",children:[(0,n.jsx)(t.p,{children:"Use page groups to associate different pages in your application with each other so that you can see aggregated analytics for groups of pages. For example, you might want to see the aggregated page load times of all of your pages by type and language."}),(0,n.jsx)(t.pre,{children:(0,n.jsx)(t.code,{children:"awsRum.recordPageView({ pageId: '/home', pageTags: ['en', 'landing']})\n"})})]}),"\n",(0,n.jsx)(t.h2,{id:"use-extended-metrics",children:"Use Extended Metrics"}),"\n",(0,n.jsxs)(t.p,{children:["There is a ",(0,n.jsx)(t.a,{href:"https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-RUM-metrics.html",children:"default set of metrics"})," automatically collected by CloudWatch RUM that are published in the metric namespace named ",(0,n.jsx)(t.code,{children:"AWS/RUM"}),". These are free, ",(0,n.jsx)(t.a,{href:"../tools/metrics/#vended-metrics",children:"vended metrics"})," that RUM creates on your behalf."]}),"\n",(0,n.jsx)(t.admonition,{type:"info",children:(0,n.jsx)(t.p,{children:"Send any of the CloudWatch RUM metrics to CloudWatch with additional dimensions so that the metrics give you a more fine-grained view."})}),"\n",(0,n.jsx)(t.p,{children:"The following dimensions are supported for extended metrics:"}),"\n",(0,n.jsxs)(t.ul,{children:["\n",(0,n.jsx)(t.li,{children:"BrowserName"}),"\n",(0,n.jsx)(t.li,{children:"CountryCode - ISO-3166 format (two-letter code)"}),"\n",(0,n.jsx)(t.li,{children:"DeviceType"}),"\n",(0,n.jsx)(t.li,{children:"FileType"}),"\n",(0,n.jsx)(t.li,{children:"OSName"}),"\n",(0,n.jsx)(t.li,{children:"PageId"}),"\n"]}),"\n",(0,n.jsxs)(t.p,{children:["However, you can create your own metrics and alarms based on them using our ",(0,n.jsx)(t.a,{href:"https://aws.amazon.com/blogs/mt/create-metrics-and-alarms-for-specific-web-pages-amazon-cloudwatch-rum/",children:"guidance from this page"}),". This approach allows you to monitor performance for any datapoint, URI, or other component that you need."]}),"\n","\n",(0,n.jsxs)(t.section,{"data-footnotes":!0,className:"footnotes",children:[(0,n.jsx)(t.h2,{className:"sr-only",id:"footnote-label",children:"Footnotes"}),"\n",(0,n.jsxs)(t.ol,{children:["\n",(0,n.jsxs)(t.li,{id:"user-content-fn-1",children:["\n",(0,n.jsxs)(t.p,{children:["See our ",(0,n.jsx)(t.a,{href:"https://aws.amazon.com/blogs/mt/how-and-when-to-enable-session-cookies-with-amazon-cloudwatch-rum/",children:"blog post"})," discussing the considerations when using cookies with CloudWatch RUM. ",(0,n.jsx)(t.a,{href:"#user-content-fnref-1","data-footnote-backref":"","aria-label":"Back to reference 1",className:"data-footnote-backref",children:"\u21a9"})]}),"\n"]}),"\n"]}),"\n"]})]})}function h(e={}){const{wrapper:t}={...(0,i.R)(),...e.components};return t?(0,n.jsx)(t,{...e,children:(0,n.jsx)(d,{...e})}):d(e)}}}]);
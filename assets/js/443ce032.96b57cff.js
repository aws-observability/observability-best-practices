"use strict";(self.webpackChunkobservability_best_practices=self.webpackChunkobservability_best_practices||[]).push([[5109],{53212:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>l,contentTitle:()=>s,default:()=>u,frontMatter:()=>r,metadata:()=>i,toc:()=>c});var o=n(74848),a=n(28453);const r={},s="AWS Lambda based Serverless Observability with OpenTelemetry",i={id:"guides/serverless/oss/lambda-based-observability-adot",title:"AWS Lambda based Serverless Observability with OpenTelemetry",description:"This guide covers the best practices on configuring observability for Lambda based serverless applications using managed open-source tools and technologies together with the native AWS monitoring services such as AWS X-Ray, and Amazon CloudWatch. We will cover tools such as AWS Distro for OpenTelemetry (ADOT), AWS X-Ray, and Amazon Managed Service for Prometheus (AMP) and how you can use these tools to gain actionable insights into your serverless applications, troubleshoot issues, and optimize application performance.",source:"@site/docs/guides/serverless/oss/lambda-based-observability-adot.md",sourceDirName:"guides/serverless/oss",slug:"/guides/serverless/oss/lambda-based-observability-adot",permalink:"/observability-best-practices/docs/guides/serverless/oss/lambda-based-observability-adot",draft:!1,unlisted:!1,editUrl:"https://github.com/aws-observability/observability-best-practices/blob/main/docusaurus/docs/guides/serverless/oss/lambda-based-observability-adot.md",tags:[],version:"current",frontMatter:{},sidebar:"guides",previous:{title:"AWS Lambda based Serverless Observability",permalink:"/observability-best-practices/docs/guides/serverless/aws-native/lambda-based-observability"},next:{title:"Best practices for hybrid and multicloud",permalink:"/observability-best-practices/docs/guides/hybrid-and-multicloud"}},l={},c=[{value:"<strong>Key topics covered</strong>",id:"key-topics-covered",level:2},{value:"<strong>Introduction to AWS Distro for OpenTelemetry (ADOT)</strong>",id:"introduction-to-aws-distro-for-opentelemetry-adot",level:2},{value:"<strong>Auto-instrumentation using ADOT Lambda Layer with AWS Lambda</strong>",id:"auto-instrumentation-using-adot-lambda-layer-with-aws-lambda",level:2},{value:"<strong>Custom configuration support for ADOT Collector</strong>",id:"custom-configuration-support-for-adot-collector",level:2},{value:"<strong>Integration with Amazon Managed Service for Prometheus (AMP)</strong>",id:"integration-with-amazon-managed-service-for-prometheus-amp",level:2},{value:"<strong>Pros and Cons of using ADOT Lambda Layer</strong>",id:"pros-and-cons-of-using-adot-lambda-layer",level:2},{value:"<strong>Managing cold start latency when using ADOT</strong>",id:"managing-cold-start-latency-when-using-adot",level:2},{value:"<strong>Additional Resources</strong>",id:"additional-resources",level:2},{value:"<strong>Summary</strong>",id:"summary",level:2}];function d(e){const t={a:"a",code:"code",h1:"h1",h2:"h2",img:"img",li:"li",ol:"ol",p:"p",pre:"pre",strong:"strong",ul:"ul",...(0,a.R)(),...e.components};return(0,o.jsxs)(o.Fragment,{children:[(0,o.jsx)(t.h1,{id:"aws-lambda-based-serverless-observability-with-opentelemetry",children:"AWS Lambda based Serverless Observability with OpenTelemetry"}),"\n",(0,o.jsxs)(t.p,{children:["This guide covers the best practices on configuring observability for Lambda based serverless applications using managed open-source tools and technologies together with the native AWS monitoring services such as AWS X-Ray, and Amazon CloudWatch. We will cover tools such as ",(0,o.jsx)(t.a,{href:"https://aws-otel.github.io/docs/introduction",children:"AWS Distro for OpenTelemetry (ADOT)"}),", ",(0,o.jsx)(t.a,{href:"https://aws.amazon.com/xray",children:"AWS X-Ray"}),", and ",(0,o.jsx)(t.a,{href:"https://aws.amazon.com/prometheus/",children:"Amazon Managed Service for Prometheus (AMP)"})," and how you can use these tools to gain actionable insights into your serverless applications, troubleshoot issues, and optimize application performance."]}),"\n",(0,o.jsx)(t.h2,{id:"key-topics-covered",children:(0,o.jsx)(t.strong,{children:"Key topics covered"})}),"\n",(0,o.jsx)(t.p,{children:"In this section of the observability best practices guide, we will deep dive on to following topics:"}),"\n",(0,o.jsxs)(t.ul,{children:["\n",(0,o.jsx)(t.li,{children:"Introduction to AWS Distro for OpenTelemetry (ADOT) and ADOT Lambda Layer"}),"\n",(0,o.jsx)(t.li,{children:"Auto-instrumentation Lambda function using ADOT Lambda Layer"}),"\n",(0,o.jsx)(t.li,{children:"Custom configuration support for ADOT Collector"}),"\n",(0,o.jsx)(t.li,{children:"Integration with Amazon Managed Service for Prometheus (AMP)"}),"\n",(0,o.jsx)(t.li,{children:"Pros and cons of using ADOT Lambda Layer"}),"\n",(0,o.jsx)(t.li,{children:"Managing cold start latency when using ADOT"}),"\n"]}),"\n",(0,o.jsx)(t.h2,{id:"introduction-to-aws-distro-for-opentelemetry-adot",children:(0,o.jsx)(t.strong,{children:"Introduction to AWS Distro for OpenTelemetry (ADOT)"})}),"\n",(0,o.jsxs)(t.p,{children:[(0,o.jsx)(t.a,{href:"https://aws-otel.github.io/docs/introduction",children:"AWS Distro for OpenTelemetry (ADOT)"})," is a secure, production-ready, AWS-supported distribution of the Cloud Native Computing Foundation (CNCF) ",(0,o.jsx)(t.a,{href:"https://opentelemetry.io/",children:"OpenTelemetry (OTel)"})," project. Using ADOT, you can instrument your applications just once and send correlated metrics and traces to multiple monitoring solutions."]}),"\n",(0,o.jsxs)(t.p,{children:["AWS's managed ",(0,o.jsx)(t.a,{href:"https://aws-otel.github.io/docs/getting-started/lambda",children:"OpenTelemetry Lambda Layer"})," utilizes ",(0,o.jsx)(t.a,{href:"https://github.com/open-telemetry/opentelemetry-lambda",children:"OpenTelemetry Lambda Layer"}),"  to export telemetry data asynchronously from AWS Lambda. It provides plug-and-play user experience by wrapping an AWS Lambda function, and by packaging the OpenTelemetry runtime specific SDK, trimmed down version of ADOT collector together with an out-of-the-box configuration for auto-instrumenting AWS Lambda functions. ADOT Lambda Layer collector components, such as Receivers, Exporters, and Extensions support integration with Amazon CloudWatch, Amazon OpenSearch Service, Amazon Managed Service for Prometheus, AWS X-Ray, and others. Find the complete list ",(0,o.jsx)(t.a,{href:"https://github.com/aws-observability/aws-otel-lambda",children:"here"}),". ADOT also supports integrations with ",(0,o.jsx)(t.a,{href:"https://aws.amazon.com/otel/partners",children:"partner solutions"}),"."]}),"\n",(0,o.jsxs)(t.p,{children:["ADOT Lambda Layer supports both auto-instrumentation (for Python, NodeJS, and Java) as well as custom instrumentation for any specific set of libraries and SDKs. With auto-instrumentation, by default, the Lambda Layer is configured to export traces to AWS X-Ray. For custom instrumentation, you will need to include the corresponding library instrumentation from the respective ",(0,o.jsx)(t.a,{href:"https://github.com/open-telemetry",children:"OpenTelemetry runtime instrumentation repository"})," and modify your code to initialize it in your function."]}),"\n",(0,o.jsx)(t.h2,{id:"auto-instrumentation-using-adot-lambda-layer-with-aws-lambda",children:(0,o.jsx)(t.strong,{children:"Auto-instrumentation using ADOT Lambda Layer with AWS Lambda"})}),"\n",(0,o.jsx)(t.p,{children:"You can easily enable auto-instrumentation of Lambda function using ADOT Lambda Layer without any code changes. Let\u2019s take an example of adding ADOT Lambda layer to your existing Java based Lambda function and view execution logs and traces in CloudWatch."}),"\n",(0,o.jsxs)(t.ol,{children:["\n",(0,o.jsxs)(t.li,{children:["Choose the ARN of the Lambda Layer based on the ",(0,o.jsx)(t.code,{children:"runtime"}),", ",(0,o.jsx)(t.code,{children:"region"})," and the ",(0,o.jsx)(t.code,{children:"arch type"})," as per the ",(0,o.jsx)(t.a,{href:"https://aws-otel.github.io/docs/getting-started/lambda",children:"documentation"}),". Make sure you use the Lambda Layer in the same region as your Lambda function. For example, Lambda Layer for java auto-instrumentation would be ",(0,o.jsx)(t.code,{children:"arn:aws:lambda:us-east-1:901920570463:layer:aws-otel-java-agent-x86_64-ver-1-28-1:1"})]}),"\n",(0,o.jsxs)(t.li,{children:["Add Layer to your Lambda function either via Console of IaC of your choice.","\n",(0,o.jsxs)(t.ul,{children:["\n",(0,o.jsxs)(t.li,{children:["With AWS Console, follow the ",(0,o.jsx)(t.a,{href:"https://docs.aws.amazon.com/lambda/latest/dg/adding-layers.html",children:"instructions"})," to add Layer to your Lambda function. Under Specify an ARN paste the layer ARN selected above."]}),"\n",(0,o.jsx)(t.li,{children:"With IaC option, SAM template for Lambda function would look like this:"}),"\n"]}),"\n",(0,o.jsx)(t.pre,{children:(0,o.jsx)(t.code,{children:"Layers:\n- !Sub arn:aws:lambda:${AWS::Region}:901920570463:layer:aws-otel-java-agent-arm64-ver-1-28-1:1\n"})}),"\n"]}),"\n",(0,o.jsxs)(t.li,{children:["Add an environment variable ",(0,o.jsx)(t.code,{children:"AWS_LAMBDA_EXEC_WRAPPER=/opt/otel-handler"})," for Node.js or Java, and ",(0,o.jsx)(t.code,{children:"AWS_LAMBDA_EXEC_WRAPPER=/opt/otel-instrument"})," for Python to your Lambda function."]}),"\n",(0,o.jsxs)(t.li,{children:["Enable Active Tracing for your Lambda function. ",(0,o.jsx)(t.strong,{children:(0,o.jsx)(t.code,{children:"Note"})})," that by default, the layer is configured to export traces to AWS X-Ray. Make sure your Lambda function\u2019s execution role has the required AWS X-Ray permissions. For more on AWS X-Ray permissions for AWS Lambda, see the ",(0,o.jsx)(t.a,{href:"https://docs.aws.amazon.com/lambda/latest/dg/services-xray.html#services-xray-permissions",children:"AWS Lambda documentation"}),".","\n",(0,o.jsxs)(t.ul,{children:["\n",(0,o.jsx)(t.li,{children:(0,o.jsx)(t.code,{children:"Tracing: Active"})}),"\n"]}),"\n"]}),"\n",(0,o.jsx)(t.li,{children:"Example SAM template with Lambda Layer configuration, Environment Variable, and X-Ray tracing would look something like this:"}),"\n"]}),"\n",(0,o.jsx)(t.pre,{children:(0,o.jsx)(t.code,{children:"Resources:\n  ListBucketsFunction:\n    Type: AWS::Serverless::Function\n    Properties:\n      Handler: com.example.App::handleRequest\n      ...\n      ProvisionedConcurrencyConfig:\n        ProvisionedConcurrentExecutions: 1\n      Policies:\n        - AWSXrayWriteOnlyAccess\n        - AmazonS3ReadOnlyAccess\n      Environment:\n        Variables:\n          AWS_LAMBDA_EXEC_WRAPPER: /opt/otel-handler\n      Tracing: Active\n      Layers:\n        - !Sub arn:aws:lambda:${AWS::Region}:901920570463:layer:aws-otel-java-agent-amd64-ver-1-28-1:1\n      Events:\n        HelloWorld:\n          Type: Api\n          Properties:\n            Path: /listBuckets\n            Method: get\n"})}),"\n",(0,o.jsxs)(t.ol,{start:"6",children:["\n",(0,o.jsxs)(t.li,{children:["Testing and Visualizing traces in AWS X-Ray\nInvoke your Lambda function either directly or via an API (if an API is configured as a trigger). For example, invoking Lambda function via API (using ",(0,o.jsx)(t.code,{children:"curl"}),") would generate logs as below:"]}),"\n"]}),"\n",(0,o.jsx)(t.pre,{children:(0,o.jsx)(t.code,{children:"curl -X GET https://XXXXXX.execute-api.us-east-1.amazonaws.com/Prod/listBuckets\n"})}),"\n",(0,o.jsx)(t.p,{children:"Lambda function logs:"}),"\n",(0,o.jsx)("pre",{children:(0,o.jsx)("code",{children:(0,o.jsxs)(t.p,{children:["OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended\n[otel.javaagent 2023-09-24 15:28:16:862 +0000] [main] INFO io.opentelemetry.javaagent.tooling.VersionLogger - opentelemetry-javaagent - version: 1.28.0-adot-lambda1-aws\nEXTENSION Name: collector State: Ready Events: [INVOKE, SHUTDOWN]\nSTART RequestId: ed8f8444-3c29-40fe-a4a1-aca7af8cd940 Version: 3\n...\nEND RequestId: ed8f8444-3c29-40fe-a4a1-aca7af8cd940\nREPORT RequestId: ed8f8444-3c29-40fe-a4a1-aca7af8cd940 Duration: 5144.38 ms Billed Duration: 5145 ms Memory Size: 1024 MB Max Memory Used: 345 MB Init Duration: 27769.64 ms\n",(0,o.jsx)("b",{children:"XRAY TraceId: 1-65105691-384f7da75714148655fa631b SegmentId: 2c52a147021ebd20 Sampled: true"})]})})}),"\n",(0,o.jsx)(t.p,{children:"As you can see from the logs, OpenTelemetry Lambda extension starts listening and instrumenting Lambda functions using opentelemetry-javaagent and generates traces in AWS X-Ray."}),"\n",(0,o.jsxs)(t.p,{children:["To view the traces from the above Lambda function invocation, navigate to the AWS X-Ray console and select the trace id under Traces. You should see a Trace Map along with Segments Timeline as below:\n",(0,o.jsx)(t.img,{alt:"Lambda Insights",src:n(31913).A+"",width:"2491",height:"1174"})]}),"\n",(0,o.jsx)(t.h2,{id:"custom-configuration-support-for-adot-collector",children:(0,o.jsx)(t.strong,{children:"Custom configuration support for ADOT Collector"})}),"\n",(0,o.jsxs)(t.p,{children:["The ADOT Lambda Layer combines both OpenTelemetry SDK and the ADOT Collector components. The configuration of the ADOT Collector follows the OpenTelemetry standard. By default, the ADOT Lambda Layer uses ",(0,o.jsx)(t.a,{href:"https://github.com/aws-observability/aws-otel-lambda/blob/main/adot/collector/config.yaml",children:"config.yaml"}),", which exports telemetry data to AWS X-Ray. However, ADOT Lambda Layer also supports other exporters, which enables you to send metrics and traces to other destinations. Find the complete list of available components supported for custom configuration ",(0,o.jsx)(t.a,{href:"https://github.com/aws-observability/aws-otel-lambda/blob/main/README.md#adot-lambda-layer-available-components",children:"here"}),"."]}),"\n",(0,o.jsx)(t.h2,{id:"integration-with-amazon-managed-service-for-prometheus-amp",children:(0,o.jsx)(t.strong,{children:"Integration with Amazon Managed Service for Prometheus (AMP)"})}),"\n",(0,o.jsx)(t.p,{children:"You can use custom collector configuration to export metrics from your Lambda function to Amazon Managed Prometheus (AMP)."}),"\n",(0,o.jsxs)(t.ol,{children:["\n",(0,o.jsxs)(t.li,{children:["Follow the steps from auto-instrumentation above, to configure Lambda Layer, set Environment variable ",(0,o.jsx)(t.code,{children:"AWS_LAMBDA_EXEC_WRAPPER"}),"."]}),"\n",(0,o.jsxs)(t.li,{children:["Follow the ",(0,o.jsx)(t.a,{href:"https://docs.aws.amazon.com/prometheus/latest/userguide/AMP-onboard-create-workspace.html",children:"instructions"})," to create Amazon Manager Prometheus workspace in your AWS account, where your Lambda function will be sending metrics to. Make a note of the ",(0,o.jsx)(t.code,{children:"Endpoint - remote write URL"})," from the AMP workspace. You would need that to be configured on ADOT collector configuration."]}),"\n",(0,o.jsxs)(t.li,{children:["Create a custom ADOT collector configuration file (say ",(0,o.jsx)(t.code,{children:"collector.yaml"}),") in your Lambda function's root directory with details of AMP endpoint remote write URL from previous step. You can also load the configuration file from S3 bucket.\nSample ADOT collector configuration file:"]}),"\n"]}),"\n",(0,o.jsx)(t.pre,{children:(0,o.jsx)(t.code,{children:'#collector.yaml in the root directory\n#Set an environemnt variable \'OPENTELEMETRY_COLLECTOR_CONFIG_FILE\' to \'/var/task/collector.yaml\'\n\nextensions:\n  sigv4auth:\n    service: "aps"\n    region: "<workspace_region>"\n\nreceivers:\n  otlp:\n    protocols:\n      grpc:\n      http:\n\nexporters:\n  logging:\n  prometheusremotewrite:\n    endpoint: "<workspace_remote_write_url>"\n    namespace: test\n    auth:\n      authenticator: sigv4auth\n\nservice:\n  extensions: [sigv4auth]\n  pipelines:\n    traces:\n      receivers: [otlp]\n      exporters: [awsxray]\n    metrics:\n      receivers: [otlp]\n      exporters: [logging, prometheusremotewrite]\n'})}),"\n",(0,o.jsxs)(t.p,{children:["Prometheus Remote Write Exporter can also be configured with retry, and timeout settings. For more information see the ",(0,o.jsx)(t.a,{href:"https://github.com/open-telemetry/opentelemetry-collector-contrib/blob/main/exporter/prometheusremotewriteexporter/README.md",children:"documentation"}),". ",(0,o.jsx)(t.strong,{children:(0,o.jsx)(t.code,{children:"Note"})})," Service value for ",(0,o.jsx)(t.code,{children:"sigv4auth"})," extension should be ",(0,o.jsx)(t.code,{children:"aps"})," (amazon prometheus service). Also, Make sure your Lambda function execution role has the required AMP permissions. For more information on permissions and policies required on AMP for AWS Lambda, see the AWS Managed Service for Prometheus ",(0,o.jsx)(t.a,{href:"https://docs.aws.amazon.com/prometheus/latest/userguide/AMP-and-IAM.html#AMP-IAM-policies-built-in",children:"documentation"}),"."]}),"\n",(0,o.jsxs)(t.ol,{start:"4",children:["\n",(0,o.jsxs)(t.li,{children:["Add an environment variable ",(0,o.jsx)(t.code,{children:"OPENTELEMETRY_COLLECTOR_CONFIG_FILE"})," and set value to the path of configuration file. E.g.  /var/task/",(0,o.jsx)(t.code,{children:"<path to config file>"}),".yaml. This will tell the Lambda Layer extension where to find the collector configuration."]}),"\n"]}),"\n",(0,o.jsx)(t.pre,{children:(0,o.jsx)(t.code,{children:"Function:\n    Type: AWS::Serverless::Function\n    Properties:\n      ...\n      Environment:\n        Variables:\n          OPENTELEMETRY_COLLECTOR_CONFIG_FILE: /var/task/collector.yaml\n"})}),"\n",(0,o.jsxs)(t.ol,{start:"5",children:["\n",(0,o.jsx)(t.li,{children:"Update your Lambda function code to add metrics using OpenTelemetry Metrics API. Check out examples here."}),"\n"]}),"\n",(0,o.jsx)(t.pre,{children:(0,o.jsx)(t.code,{children:'// get meter\nMeter meter = GlobalOpenTelemetry.getMeterProvider()\n    .meterBuilder("aws-otel")\n    .setInstrumentationVersion("1.0")\n    .build();\n\n// Build counter e.g. LongCounter\nLongCounter counter = meter\n    .counterBuilder("processed_jobs")\n    .setDescription("Processed jobs")\n    .setUnit("1")\n    .build();\n\n// It is recommended that the API user keep a reference to Attributes they will record against\nAttributes attributes = Attributes.of(stringKey("Key"), "SomeWork");\n\n// Record data\ncounter.add(123, attributes);\n'})}),"\n",(0,o.jsx)(t.h2,{id:"pros-and-cons-of-using-adot-lambda-layer",children:(0,o.jsx)(t.strong,{children:"Pros and Cons of using ADOT Lambda Layer"})}),"\n",(0,o.jsxs)(t.p,{children:["If you intend to send traces to AWS X-Ray from Lambda function, you can either use ",(0,o.jsx)(t.a,{href:"https://docs.aws.amazon.com/xray/latest/devguide/xray-sdk-nodejs.html",children:"X-Ray SDK"})," or  ",(0,o.jsx)(t.a,{href:"https://aws-otel.github.io/docs/getting-started/lambda",children:"AWS Distro for OpenTelemetry (ADOT) Lambda Layer"}),". While X-Ray SDK supports easy instrumentation of various AWS services, it can only send traces to X-Ray. Whereas, ADOT collector, which is included as part of the Lambda Layer supports large number of library instrumentations for each language. You can use it to collect and send metrics and traces to AWS X-Ray and other monitoring solutions, such as Amazon CloudWatch, Amazon OpenSearch Service, Amazon Managed Service for Prometheus and other ",(0,o.jsx)(t.a,{href:"https://aws-otel.github.io/docs/components/otlp-exporter#appdynamics",children:"partner"})," solutions."]}),"\n",(0,o.jsxs)(t.p,{children:["However, due to the flexibility ADOT offers, your Lambda function may require additional memory and can experience notable impact on cold start latency. So, if you are optimizing your Lambda function for low-latency and do not need advanced features of OpenTelemetry, using AWS X-Ray SDK over ADOT might be more suitable. For detailed comparison and guidance on choosing the right tracing tool, refer to AWS docs on ",(0,o.jsx)(t.a,{href:"https://docs.aws.amazon.com/xray/latest/devguide/xray-instrumenting-your-app.html#xray-instrumenting-choosing",children:"choosing between ADOT and X-Ray SDK"}),"."]}),"\n",(0,o.jsx)(t.h2,{id:"managing-cold-start-latency-when-using-adot",children:(0,o.jsx)(t.strong,{children:"Managing cold start latency when using ADOT"})}),"\n",(0,o.jsxs)(t.p,{children:["ADOT Lambda Layer for Java is agent-based, which means that when you enable auto-instrumentation, Java Agent will try to instrument all the OTel ",(0,o.jsx)(t.a,{href:"https://github.com/open-telemetry/opentelemetry-java-instrumentation/tree/main/instrumentation",children:"supported"})," libraries. This will increase the Lambda function cold start latency significantly. So, we recommend that you only enable auto-instrumentation for the libraries/frameworks that are used by your application."]}),"\n",(0,o.jsx)(t.p,{children:"To enable only specific instrumentations, you can use the following environment variables:"}),"\n",(0,o.jsxs)(t.ul,{children:["\n",(0,o.jsxs)(t.li,{children:[(0,o.jsx)(t.code,{children:"OTEL_INSTRUMENTATION_COMMON_DEFAULT_ENABLED"}),": when set to false, disables auto-instrumentation in the Layer, requiring each instrumentation to be enabled individually."]}),"\n",(0,o.jsxs)(t.li,{children:[(0,o.jsx)(t.code,{children:"OTEL_INSTRUMENTATION_<NAME>_ENABLED"}),': set to true to enable auto-instrumentation for a specific library or framework. Replace "NAME" by the instrumentation that you want to enable. For the list of available instrumentations, see Suppressing specific agent instrumentation.']}),"\n"]}),"\n",(0,o.jsx)(t.p,{children:"For example, to only enable auto-instrumentation for Lambda and the AWS SDK, you would set the following environment variables:"}),"\n",(0,o.jsx)(t.pre,{children:(0,o.jsx)(t.code,{children:"OTEL_INSTRUMENTATION_COMMON_DEFAULT_ENABLED=false\nOTEL_INSTRUMENTATION_AWS_LAMBDA_ENABLED=true\nOTEL_INSTRUMENTATION_AWS_SDK_ENABLED=true\n"})}),"\n",(0,o.jsx)(t.h2,{id:"additional-resources",children:(0,o.jsx)(t.strong,{children:"Additional Resources"})}),"\n",(0,o.jsxs)(t.ul,{children:["\n",(0,o.jsx)(t.li,{children:(0,o.jsx)(t.a,{href:"https://opentelemetry.io",children:"OpenTelemetry"})}),"\n",(0,o.jsx)(t.li,{children:(0,o.jsx)(t.a,{href:"https://aws-otel.github.io/docs/introduction",children:"AWS Distro for OpenTelemetry (ADOT)"})}),"\n",(0,o.jsx)(t.li,{children:(0,o.jsx)(t.a,{href:"https://aws-otel.github.io/docs/getting-started/lambda",children:"ADOT Lambda Layer"})}),"\n"]}),"\n",(0,o.jsx)(t.h2,{id:"summary",children:(0,o.jsx)(t.strong,{children:"Summary"})}),"\n",(0,o.jsx)(t.p,{children:"In this observability best practice guide for AWS Lambda based serverless application using Open Source technologies, we covered AWS Distro for OpenTelemetry (ADOT) and Lambda Layer and how you can use it instrument your AWS Lambda functions. We covered how you can easily enable auto-instrumentation as well as customize the ADOT collector with simple configuration to send observability signals to multiple destinations. We highlighted pros and cons of using ADOT and how it can impact cold start latency for your Lambda function and also recommended best practices to manage cold-start times. By adopting these best practices, you can instrument your applications just once to send logs, metrics and traces to multiple monitoring solutions in a vendor agnostic way."}),"\n",(0,o.jsxs)(t.p,{children:["For further deep dive, we would highly recommend you to practice AWS managed open-source Observability module of ",(0,o.jsx)(t.a,{href:"https://catalog.workshops.aws/observability/en-US",children:"AWS One Observability Workshop"}),"."]})]})}function u(e={}){const{wrapper:t}={...(0,a.R)(),...e.components};return t?(0,o.jsx)(t,{...e,children:(0,o.jsx)(d,{...e})}):d(e)}},31913:(e,t,n)=>{n.d(t,{A:()=>o});const o=n.p+"assets/images/xray-trace-67990b791cb455e28b42e1716556a32a.png"},28453:(e,t,n)=>{n.d(t,{R:()=>s,x:()=>i});var o=n(96540);const a={},r=o.createContext(a);function s(e){const t=o.useContext(r);return o.useMemo((function(){return"function"==typeof e?e(t):{...t,...e}}),[t,e])}function i(e){let t;return t=e.disableParentContext?"function"==typeof e.components?e.components(a):e.components||a:s(e.components),o.createElement(r.Provider,{value:t},e.children)}}}]);
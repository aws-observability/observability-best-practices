"use strict";(self.webpackChunkobservability_best_practices=self.webpackChunkobservability_best_practices||[]).push([[1067],{28453:(e,t,n)=>{n.d(t,{R:()=>o,x:()=>i});var r=n(96540);const s={},a=r.createContext(s);function o(e){const t=r.useContext(a);return r.useMemo((function(){return"function"==typeof e?e(t):{...t,...e}}),[t,e])}function i(e){let t;return t=e.disableParentContext?"function"==typeof e.components?e.components(s):e.components||s:o(e.components),r.createElement(a.Provider,{value:t},e.children)}},30599:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>c,contentTitle:()=>o,default:()=>h,frontMatter:()=>a,metadata:()=>i,toc:()=>l});var r=n(74848),s=n(28453);const a={},o="Using AWS Distro for OpenTelemetry in EKS on Fargate with Amazon Managed Service for Prometheus",i={id:"recipes/recipes/fargate-eks-metrics-go-adot-ampamg",title:"Using AWS Distro for OpenTelemetry in EKS on Fargate with Amazon Managed Service for Prometheus",description:"In this recipe we show you how to instrument a sample Go application and",source:"@site/docs/recipes/recipes/fargate-eks-metrics-go-adot-ampamg.md",sourceDirName:"recipes/recipes",slug:"/recipes/recipes/fargate-eks-metrics-go-adot-ampamg",permalink:"/observability-best-practices/recipes/recipes/fargate-eks-metrics-go-adot-ampamg",draft:!1,unlisted:!1,editUrl:"https://github.com/aws-observability/observability-best-practices/blob/main/docusaurus/docs/recipes/recipes/fargate-eks-metrics-go-adot-ampamg.md",tags:[],version:"current",frontMatter:{}},c={},l=[{value:"Infrastructure",id:"infrastructure",level:2},{value:"Architecture",id:"architecture",level:3},{value:"Prerequisites",id:"prerequisites",level:3},{value:"Create EKS on Fargate cluster",id:"create-eks-on-fargate-cluster",level:3},{value:"Create ECR repository",id:"create-ecr-repository",level:3},{value:"Set up AMP",id:"set-up-amp",level:3},{value:"Set up ADOT Collector",id:"set-up-adot-collector",level:3},{value:"Set up AMG",id:"set-up-amg",level:3},{value:"Application",id:"application",level:2},{value:"Build container image",id:"build-container-image",level:3},{value:"Deploy sample app",id:"deploy-sample-app",level:3},{value:"End-to-end",id:"end-to-end",level:2},{value:"Verify your pipeline is working",id:"verify-your-pipeline-is-working",level:3},{value:"Create a Grafana dashboard",id:"create-a-grafana-dashboard",level:3},{value:"Cleanup",id:"cleanup",level:2}];function d(e){const t={a:"a",admonition:"admonition",code:"code",h1:"h1",h2:"h2",h3:"h3",img:"img",li:"li",p:"p",pre:"pre",ul:"ul",...(0,s.R)(),...e.components};return(0,r.jsxs)(r.Fragment,{children:[(0,r.jsx)(t.h1,{id:"using-aws-distro-for-opentelemetry-in-eks-on-fargate-with-amazon-managed-service-for-prometheus",children:"Using AWS Distro for OpenTelemetry in EKS on Fargate with Amazon Managed Service for Prometheus"}),"\n",(0,r.jsxs)(t.p,{children:["In this recipe we show you how to instrument a ",(0,r.jsx)(t.a,{href:"https://github.com/aws-observability/aws-otel-community/tree/master/sample-apps/prometheus-sample-app",children:"sample Go application"})," and\nuse ",(0,r.jsx)(t.a,{href:"https://aws.amazon.com/otel",children:"AWS Distro for OpenTelemetry (ADOT)"})," to ingest metrics into\n",(0,r.jsx)(t.a,{href:"https://aws.amazon.com/prometheus/",children:"Amazon Managed Service for Prometheus"})," .\nThen we're using ",(0,r.jsx)(t.a,{href:"https://aws.amazon.com/grafana/",children:"Amazon Managed Grafana"})," to visualize the metrics."]}),"\n",(0,r.jsxs)(t.p,{children:["We will be setting up an ",(0,r.jsx)(t.a,{href:"https://aws.amazon.com/eks/",children:"Amazon Elastic Kubernetes Service (EKS)"}),"\non ",(0,r.jsx)(t.a,{href:"https://aws.amazon.com/fargate/",children:"AWS Fargate"})," cluster and use an\n",(0,r.jsx)(t.a,{href:"https://aws.amazon.com/ecr/",children:"Amazon Elastic Container Registry (ECR)"})," repository\nto demonstrate a complete scenario."]}),"\n",(0,r.jsx)(t.admonition,{type:"note",children:(0,r.jsx)(t.p,{children:"This guide will take approximately 1 hour to complete."})}),"\n",(0,r.jsx)(t.h2,{id:"infrastructure",children:"Infrastructure"}),"\n",(0,r.jsx)(t.p,{children:"In the following section we will be setting up the infrastructure for this recipe."}),"\n",(0,r.jsx)(t.h3,{id:"architecture",children:"Architecture"}),"\n",(0,r.jsxs)(t.p,{children:["The ADOT pipeline enables us to use the\n",(0,r.jsx)(t.a,{href:"https://github.com/aws-observability/aws-otel-collector",children:"ADOT Collector"})," to\nscrape a Prometheus-instrumented application, and ingest the scraped metrics to\nAmazon Managed Service for Prometheus."]}),"\n",(0,r.jsx)(t.p,{children:(0,r.jsx)(t.img,{alt:"Architecture",src:n(53085).A+"",width:"1020",height:"322"})}),"\n",(0,r.jsx)(t.p,{children:"The ADOT Collector includes two components specific to Prometheus:"}),"\n",(0,r.jsxs)(t.ul,{children:["\n",(0,r.jsx)(t.li,{children:"the Prometheus Receiver, and"}),"\n",(0,r.jsx)(t.li,{children:"the AWS Prometheus Remote Write Exporter."}),"\n"]}),"\n",(0,r.jsx)(t.admonition,{type:"info",children:(0,r.jsxs)(t.p,{children:["For more information on Prometheus Remote Write Exporter check out:\n",(0,r.jsx)(t.a,{href:"https://aws-otel.github.io/docs/getting-started/prometheus-remote-write-exporter",children:"Getting Started with Prometheus Remote Write Exporter for AMP"}),"."]})}),"\n",(0,r.jsx)(t.h3,{id:"prerequisites",children:"Prerequisites"}),"\n",(0,r.jsxs)(t.ul,{children:["\n",(0,r.jsxs)(t.li,{children:["The AWS CLI is ",(0,r.jsx)(t.a,{href:"https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-install.html",children:"installed"})," and ",(0,r.jsx)(t.a,{href:"https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-configure.html",children:"configured"})," in your environment."]}),"\n",(0,r.jsxs)(t.li,{children:["You need to install the ",(0,r.jsx)(t.a,{href:"https://docs.aws.amazon.com/eks/latest/userguide/eksctl.html",children:"eksctl"})," command in your environment."]}),"\n",(0,r.jsxs)(t.li,{children:["You need to install ",(0,r.jsx)(t.a,{href:"https://docs.aws.amazon.com/eks/latest/userguide/install-kubectl.html",children:"kubectl"})," in your environment."]}),"\n",(0,r.jsxs)(t.li,{children:["You have ",(0,r.jsx)(t.a,{href:"https://docs.docker.com/get-docker/",children:"Docker"})," installed into your environment."]}),"\n"]}),"\n",(0,r.jsx)(t.h3,{id:"create-eks-on-fargate-cluster",children:"Create EKS on Fargate cluster"}),"\n",(0,r.jsxs)(t.p,{children:["Our demo application is a Kubernetes app that we will run in an EKS on Fargate\ncluster. So, first create an EKS cluster using the\nprovided ",(0,r.jsx)(t.a,{target:"_blank","data-noBrokenLinkCheck":!0,href:n(61776).A+"",children:"cluster-config.yaml"}),"\ntemplate file by changing ",(0,r.jsx)(t.code,{children:"<YOUR_REGION>"})," to one of the\n",(0,r.jsx)(t.a,{href:"https://docs.aws.amazon.com/prometheus/latest/userguide/what-is-Amazon-Managed-Service-Prometheus.html#AMP-supported-Regions",children:"supported regions for AMP"}),"."]}),"\n",(0,r.jsxs)(t.p,{children:["Make sure to set ",(0,r.jsx)(t.code,{children:"<YOUR_REGION>"})," in your shell session, for example, in Bash:"]}),"\n",(0,r.jsx)(t.pre,{children:(0,r.jsx)(t.code,{children:"export AWS_DEFAULT_REGION=<YOUR_REGION>\n"})}),"\n",(0,r.jsx)(t.p,{children:"Create your cluster using the following command:"}),"\n",(0,r.jsx)(t.pre,{children:(0,r.jsx)(t.code,{children:"eksctl create cluster -f cluster-config.yaml\n"})}),"\n",(0,r.jsx)(t.h3,{id:"create-ecr-repository",children:"Create ECR repository"}),"\n",(0,r.jsxs)(t.p,{children:["In order to deploy our application to EKS we need a container repository.\nYou can use the following command to create a new ECR repository in your account.\nMake sure to set ",(0,r.jsx)(t.code,{children:"<YOUR_REGION>"})," as well."]}),"\n",(0,r.jsx)(t.pre,{children:(0,r.jsx)(t.code,{children:"aws ecr create-repository \\\n    --repository-name prometheus-sample-app \\\n    --image-scanning-configuration scanOnPush=true \\\n    --region <YOUR_REGION>\n"})}),"\n",(0,r.jsx)(t.h3,{id:"set-up-amp",children:"Set up AMP"}),"\n",(0,r.jsx)(t.p,{children:"First, create an Amazon Managed Service for Prometheus workspace using the AWS CLI with:"}),"\n",(0,r.jsx)(t.pre,{children:(0,r.jsx)(t.code,{children:"aws amp create-workspace --alias prometheus-sample-app\n"})}),"\n",(0,r.jsx)(t.p,{children:"Verify the workspace is created using:"}),"\n",(0,r.jsx)(t.pre,{children:(0,r.jsx)(t.code,{children:"aws amp list-workspaces\n"})}),"\n",(0,r.jsx)(t.admonition,{type:"info",children:(0,r.jsxs)(t.p,{children:["For more details check out the ",(0,r.jsx)(t.a,{href:"https://docs.aws.amazon.com/prometheus/latest/userguide/AMP-getting-started.html",children:"AMP Getting started"})," guide."]})}),"\n",(0,r.jsx)(t.h3,{id:"set-up-adot-collector",children:"Set up ADOT Collector"}),"\n",(0,r.jsxs)(t.p,{children:["Download ",(0,r.jsx)(t.a,{target:"_blank","data-noBrokenLinkCheck":!0,href:n(76040).A+"",children:"adot-collector-fargate.yaml"}),"\nand edit this YAML doc with the parameters described in the next steps."]}),"\n",(0,r.jsxs)(t.p,{children:["In this example, the ADOT Collector configuration uses an annotation ",(0,r.jsx)(t.code,{children:"(scrape=true)"}),"\nto tell which target endpoints to scrape. This allows the ADOT Collector to distinguish\nthe sample app endpoint from ",(0,r.jsx)(t.code,{children:"kube-system"})," endpoints in your cluster.\nYou can remove this from the re-label configurations if you want to scrape a different sample app."]}),"\n",(0,r.jsx)(t.p,{children:"Use the following steps to edit the downloaded file for your environment:"}),"\n",(0,r.jsxs)(t.p,{children:["1. Replace ",(0,r.jsx)(t.code,{children:"<YOUR_REGION>"})," with your current region."]}),"\n",(0,r.jsxs)(t.p,{children:["2. Replace ",(0,r.jsx)(t.code,{children:"<YOUR_ENDPOINT>"})," with the remote write URL of your workspace."]}),"\n",(0,r.jsx)(t.p,{children:"Get your AMP remote write URL endpoint by executing the following queries."}),"\n",(0,r.jsx)(t.p,{children:"First, get the workspace ID like so:"}),"\n",(0,r.jsx)(t.pre,{children:(0,r.jsx)(t.code,{children:"YOUR_WORKSPACE_ID=$(aws amp list-workspaces \\\n                    --alias prometheus-sample-app \\\n                    --query 'workspaces[0].workspaceId' --output text)\n"})}),"\n",(0,r.jsx)(t.p,{children:"Now get the remote write URL endpoint URL for your workspace using:"}),"\n",(0,r.jsx)(t.pre,{children:(0,r.jsx)(t.code,{children:"YOUR_ENDPOINT=$(aws amp describe-workspace \\\n                --workspace-id $YOUR_WORKSPACE_ID  \\\n                --query 'workspace.prometheusEndpoint' --output text)api/v1/remote_write\n"})}),"\n",(0,r.jsx)(t.admonition,{type:"warning",children:(0,r.jsxs)(t.p,{children:["Make sure that ",(0,r.jsx)(t.code,{children:"YOUR_ENDPOINT"})," is in fact the remote write URL, that is,\nthe URL should end in ",(0,r.jsx)(t.code,{children:"/api/v1/remote_write"}),"."]})}),"\n",(0,r.jsx)(t.p,{children:"After creating deployment file we can now apply this to our cluster by using the following command:"}),"\n",(0,r.jsx)(t.pre,{children:(0,r.jsx)(t.code,{children:"kubectl apply -f adot-collector-fargate.yaml\n"})}),"\n",(0,r.jsx)(t.admonition,{type:"info",children:(0,r.jsxs)(t.p,{children:["For more information check out the ",(0,r.jsx)(t.a,{href:"https://aws-otel.github.io/docs/getting-started/prometheus-remote-write-exporter/eks#aws-distro-for-opentelemetry-adot-collector-setup",children:"AWS Distro for OpenTelemetry (ADOT)\nCollector Setup"}),"."]})}),"\n",(0,r.jsx)(t.h3,{id:"set-up-amg",children:"Set up AMG"}),"\n",(0,r.jsxs)(t.p,{children:["Set up a new AMG workspace using the\n",(0,r.jsx)(t.a,{href:"https://aws.amazon.com/blogs/mt/amazon-managed-grafana-getting-started/",children:"Amazon Managed Grafana \u2013 Getting Started"})," guide."]}),"\n",(0,r.jsx)(t.p,{children:'Make sure to add "Amazon Managed Service for Prometheus" as a datasource during creation.'}),"\n",(0,r.jsx)(t.p,{children:(0,r.jsx)(t.img,{alt:"Service managed permission settings",src:n(86679).A+"",width:"1024",height:"870"})}),"\n",(0,r.jsx)(t.h2,{id:"application",children:"Application"}),"\n",(0,r.jsxs)(t.p,{children:["In this recipe we will be using a\n",(0,r.jsx)(t.a,{href:"https://github.com/aws-observability/aws-otel-community/tree/master/sample-apps/prometheus-sample-app",children:"sample application"}),"\nfrom the AWS Observability repository."]}),"\n",(0,r.jsxs)(t.p,{children:["This Prometheus sample app generates all four Prometheus metric types\n(counter, gauge, histogram, summary) and exposes them at the ",(0,r.jsx)(t.code,{children:"/metrics"})," endpoint."]}),"\n",(0,r.jsx)(t.h3,{id:"build-container-image",children:"Build container image"}),"\n",(0,r.jsx)(t.p,{children:"To build the container image, first clone the Git repository and change\ninto the directory as follows:"}),"\n",(0,r.jsx)(t.pre,{children:(0,r.jsx)(t.code,{children:"git clone https://github.com/aws-observability/aws-otel-community.git && \\\ncd ./aws-otel-community/sample-apps/prometheus\n"})}),"\n",(0,r.jsxs)(t.p,{children:["First, set the region (if not already done above) and account ID to what is applicable in your case.\nReplace ",(0,r.jsx)(t.code,{children:"<YOUR_REGION>"})," with your current region. For\nexample, in the Bash shell this would look as follows:"]}),"\n",(0,r.jsx)(t.pre,{children:(0,r.jsx)(t.code,{children:"export AWS_DEFAULT_REGION=<YOUR_REGION>\nexport ACCOUNTID=`aws sts get-caller-identity --query Account --output text`\n"})}),"\n",(0,r.jsx)(t.p,{children:"Next, build the container image:"}),"\n",(0,r.jsx)(t.pre,{children:(0,r.jsx)(t.code,{children:'docker build . -t "$ACCOUNTID.dkr.ecr.$AWS_DEFAULT_REGION.amazonaws.com/prometheus-sample-app:latest"\n'})}),"\n",(0,r.jsxs)(t.admonition,{type:"note",children:[(0,r.jsxs)(t.p,{children:["If ",(0,r.jsx)(t.code,{children:"go mod"})," fails in your environment due to a proxy.golang.or i/o timeout,\nyou are able to bypass the go mod proxy by editing the Dockerfile."]}),(0,r.jsx)(t.p,{children:"Change the following line in the Docker file:"}),(0,r.jsx)(t.pre,{children:(0,r.jsx)(t.code,{children:"RUN GO111MODULE=on go mod download\n"})}),(0,r.jsx)(t.p,{children:"to:"}),(0,r.jsx)(t.pre,{children:(0,r.jsx)(t.code,{children:"RUN GOPROXY=direct GO111MODULE=on go mod download\n"})})]}),"\n",(0,r.jsx)(t.p,{children:"Now you can push the container image to the ECR repo you created earlier on."}),"\n",(0,r.jsx)(t.p,{children:"For that, first log in to the default ECR registry:"}),"\n",(0,r.jsx)(t.pre,{children:(0,r.jsx)(t.code,{children:'aws ecr get-login-password --region $AWS_DEFAULT_REGION | \\\n    docker login --username AWS --password-stdin \\\n    "$ACCOUNTID.dkr.ecr.$AWS_DEFAULT_REGION.amazonaws.com"\n'})}),"\n",(0,r.jsx)(t.p,{children:"And finally, push the container image to the ECR repository you created, above:"}),"\n",(0,r.jsx)(t.pre,{children:(0,r.jsx)(t.code,{children:'docker push "$ACCOUNTID.dkr.ecr.$AWS_DEFAULT_REGION.amazonaws.com/prometheus-sample-app:latest"\n'})}),"\n",(0,r.jsx)(t.h3,{id:"deploy-sample-app",children:"Deploy sample app"}),"\n",(0,r.jsxs)(t.p,{children:["Edit ",(0,r.jsx)(t.a,{target:"_blank","data-noBrokenLinkCheck":!0,href:n(63420).A+"",children:"prometheus-sample-app.yaml"}),"\nto contain your ECR image path. That is, replace ",(0,r.jsx)(t.code,{children:"ACCOUNTID"})," and ",(0,r.jsx)(t.code,{children:"AWS_DEFAULT_REGION"})," in the\nfile with your own values:"]}),"\n",(0,r.jsx)(t.pre,{children:(0,r.jsx)(t.code,{children:'    # change the following to your container image:\n    image: "ACCOUNTID.dkr.ecr.AWS_DEFAULT_REGION.amazonaws.com/prometheus-sample-app:latest"\n'})}),"\n",(0,r.jsx)(t.p,{children:"Now you can deploy the sample app to your cluster using:"}),"\n",(0,r.jsx)(t.pre,{children:(0,r.jsx)(t.code,{children:"kubectl apply -f prometheus-sample-app.yaml\n"})}),"\n",(0,r.jsx)(t.h2,{id:"end-to-end",children:"End-to-end"}),"\n",(0,r.jsx)(t.p,{children:"Now that you have the infrastructure and the application in place, we will\ntest out the setup, sending metrics from the Go app running in EKS to AMP and\nvisualize it in AMG."}),"\n",(0,r.jsx)(t.h3,{id:"verify-your-pipeline-is-working",children:"Verify your pipeline is working"}),"\n",(0,r.jsx)(t.p,{children:"To verify if the ADOT collector is scraping the pod of the sample app and\ningests the metrics into AMP, we look at the collector logs."}),"\n",(0,r.jsx)(t.p,{children:"Enter the following command to follow the ADOT collector logs:"}),"\n",(0,r.jsx)(t.pre,{children:(0,r.jsx)(t.code,{children:"kubectl -n adot-col logs adot-collector -f\n"})}),"\n",(0,r.jsx)(t.p,{children:"One example output in the logs of the scraped metrics from the sample app\nshould look like the following:"}),"\n",(0,r.jsx)(t.pre,{children:(0,r.jsx)(t.code,{children:"...\nResource labels:\n     -> service.name: STRING(kubernetes-service-endpoints)\n     -> host.name: STRING(192.168.16.238)\n     -> port: STRING(8080)\n     -> scheme: STRING(http)\nInstrumentationLibraryMetrics #0\nMetric #0\nDescriptor:\n     -> Name: test_gauge0\n     -> Description: This is my gauge\n     -> Unit:\n     -> DataType: DoubleGauge\nDoubleDataPoints #0\nStartTime: 0\nTimestamp: 1606511460471000000\nValue: 0.000000\n...\n"})}),"\n",(0,r.jsxs)(t.admonition,{type:"tip",children:[(0,r.jsxs)(t.p,{children:["To verify if AMP received the metrics, you can use ",(0,r.jsx)(t.a,{href:"https://github.com/okigan/awscurl",children:"awscurl"}),".\nThis tool enables you to send HTTP requests from the command line with AWS Sigv4 authentication,\nso you must have AWS credentials set up locally with the correct permissions to query from AMP.\nIn the following command replace ",(0,r.jsx)(t.code,{children:"$AMP_ENDPOINT"})," with the endpoint for your AMP workspace:"]}),(0,r.jsx)(t.pre,{children:(0,r.jsx)(t.code,{children:'$ awscurl --service="aps" \\\n        --region="$AWS_DEFAULT_REGION" "https://$AMP_ENDPOINT/api/v1/query?query=adot_test_gauge0"\n{"status":"success","data":{"resultType":"vector","result":[{"metric":{"__name__":"adot_test_gauge0"},"value":[1606512592.493,"16.87214000011479"]}]}}\n'})})]}),"\n",(0,r.jsx)(t.h3,{id:"create-a-grafana-dashboard",children:"Create a Grafana dashboard"}),"\n",(0,r.jsxs)(t.p,{children:["You can import an example dashboard, available via\n",(0,r.jsx)(t.a,{target:"_blank","data-noBrokenLinkCheck":!0,href:n(45550).A+"",children:"prometheus-sample-app-dashboard.json"}),",\nfor the sample app that looks as follows:"]}),"\n",(0,r.jsx)(t.p,{children:(0,r.jsx)(t.img,{alt:"Screen shot of the Prometheus sample app dashboard in AMG",src:n(57194).A+"",width:"1000",height:"766"})}),"\n",(0,r.jsx)(t.p,{children:"Further, use the following guides to create your own dashboard in Amazon Managed Grafana:"}),"\n",(0,r.jsxs)(t.ul,{children:["\n",(0,r.jsx)(t.li,{children:(0,r.jsx)(t.a,{href:"https://docs.aws.amazon.com/grafana/latest/userguide/dashboard-overview.html",children:"User Guide: Dashboards"})}),"\n",(0,r.jsx)(t.li,{children:(0,r.jsx)(t.a,{href:"https://grafana.com/docs/grafana/latest/best-practices/best-practices-for-creating-dashboards/",children:"Best practices for creating dashboards"})}),"\n"]}),"\n",(0,r.jsx)(t.p,{children:"That's it, congratulations you've learned how to use ADOT in EKS on Fargate to\ningest metrics."}),"\n",(0,r.jsx)(t.h2,{id:"cleanup",children:"Cleanup"}),"\n",(0,r.jsx)(t.p,{children:"First remove the Kubernetes resources and destroy the EKS cluster:"}),"\n",(0,r.jsx)(t.pre,{children:(0,r.jsx)(t.code,{children:"kubectl delete all --all && \\\neksctl delete cluster --name amp-eks-fargate\n"})}),"\n",(0,r.jsx)(t.p,{children:"Remove the Amazon Managed Service for Prometheus workspace:"}),"\n",(0,r.jsx)(t.pre,{children:(0,r.jsx)(t.code,{children:"aws amp delete-workspace --workspace-id \\\n    `aws amp list-workspaces --alias prometheus-sample-app --query 'workspaces[0].workspaceId' --output text`\n"})}),"\n",(0,r.jsx)(t.p,{children:"Remove the  IAM role:"}),"\n",(0,r.jsx)(t.pre,{children:(0,r.jsx)(t.code,{children:"aws delete-role --role-name adot-collector-role\n"})}),"\n",(0,r.jsx)(t.p,{children:"Finally, remove the Amazon Managed Grafana  workspace by removing it via the AWS console."})]})}function h(e={}){const{wrapper:t}={...(0,s.R)(),...e.components};return t?(0,r.jsx)(t,{...e,children:(0,r.jsx)(d,{...e})}):d(e)}},45550:(e,t,n)=>{n.d(t,{A:()=>r});const r=n.p+"assets/files/prometheus-sample-app-dashboard-a6a9aaa9da6bca2bf2532ee0e324a8eb.json"},53085:(e,t,n)=>{n.d(t,{A:()=>r});const r=n.p+"assets/images/adot-metrics-pipeline-60be81f1e6633017f92dce2bbe7cbd51.png"},57194:(e,t,n)=>{n.d(t,{A:()=>r});const r=n.p+"assets/images/amg-prom-sample-app-dashboard-1d97707e9ef8d9ea445eca10766285a2.png"},61776:(e,t,n)=>{n.d(t,{A:()=>r});const r=n.p+"assets/files/cluster-config-0a10a95e974614d1174db2ee427ca351.yaml"},63420:(e,t,n)=>{n.d(t,{A:()=>r});const r=n.p+"assets/files/prometheus-sample-app-86a325cf076a1dab0f760adedc8a6492.yaml"},76040:(e,t,n)=>{n.d(t,{A:()=>r});const r=n.p+"assets/files/adot-collector-fargate-d0b7012e102e6d72c630d55ed303274e.yaml"},86679:(e,t,n)=>{n.d(t,{A:()=>r});const r=n.p+"assets/images/amg-console-create-workspace-managed-permissions-8bfac29279b909dd847d657544f5978a.jpg"}}]);
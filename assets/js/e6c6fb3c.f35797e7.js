"use strict";(self.webpackChunkobservability_best_practices=self.webpackChunkobservability_best_practices||[]).push([[6131],{13054:(e,n,t)=>{t.r(n),t.d(n,{assets:()=>c,contentTitle:()=>o,default:()=>h,frontMatter:()=>r,metadata:()=>i,toc:()=>l});var s=t(74848),a=t(28453);const r={},o="Using Amazon Managed Service for Prometheus to monitor App Mesh environment configured on EKS",i={id:"recipes/recipes/servicemesh-monitoring-ampamg",title:"Using Amazon Managed Service for Prometheus to monitor App Mesh environment configured on EKS",description:"In this recipe we show you how to ingest App Mesh Envoy",source:"@site/docs/recipes/recipes/servicemesh-monitoring-ampamg.md",sourceDirName:"recipes/recipes",slug:"/recipes/recipes/servicemesh-monitoring-ampamg",permalink:"/observability-best-practices/recipes/recipes/servicemesh-monitoring-ampamg",draft:!1,unlisted:!1,editUrl:"https://github.com/aws-observability/observability-best-practices/blob/main/docusaurus/docs/recipes/recipes/servicemesh-monitoring-ampamg.md",tags:[],version:"current",frontMatter:{}},c={},l=[{value:"Infrastructure",id:"infrastructure",level:2},{value:"Architecture",id:"architecture",level:3},{value:"Prerequisites",id:"prerequisites",level:3},{value:"Setup an EKS cluster",id:"setup-an-eks-cluster",level:3},{value:"Install App Mesh Controller",id:"install-app-mesh-controller",level:3},{value:"Set up AMP",id:"set-up-amp",level:3},{value:"Scraping &amp; ingesting metrics",id:"scraping--ingesting-metrics",level:3},{value:"Configure Grafana Agent",id:"configure-grafana-agent",level:4},{value:"Configure permissions",id:"configure-permissions",level:4},{value:"Sample application",id:"sample-application",level:2},{value:"Create an AMG workspace",id:"create-an-amg-workspace",level:3},{value:"Configure AMG datasource",id:"configure-amg-datasource",level:3},{value:"Configure AMG dashboard",id:"configure-amg-dashboard",level:3},{value:"Configure alerts on AMG",id:"configure-alerts-on-amg",level:3},{value:"Cleanup",id:"cleanup",level:2}];function d(e){const n={a:"a",admonition:"admonition",code:"code",h1:"h1",h2:"h2",h3:"h3",h4:"h4",img:"img",li:"li",mdxAdmonitionTitle:"mdxAdmonitionTitle",ol:"ol",p:"p",pre:"pre",ul:"ul",...(0,a.R)(),...e.components};return(0,s.jsxs)(s.Fragment,{children:[(0,s.jsx)(n.h1,{id:"using-amazon-managed-service-for-prometheus-to-monitor-app-mesh-environment-configured-on-eks",children:"Using Amazon Managed Service for Prometheus to monitor App Mesh environment configured on EKS"}),"\n",(0,s.jsxs)(n.p,{children:["In this recipe we show you how to ingest ",(0,s.jsx)(n.a,{href:"https://docs.aws.amazon.com/app-mesh/",children:"App Mesh"})," Envoy\nmetrics in an ",(0,s.jsx)(n.a,{href:"https://aws.amazon.com/eks/",children:"Amazon Elastic Kubernetes Service"})," (EKS) cluster\nto ",(0,s.jsx)(n.a,{href:"https://aws.amazon.com/prometheus/",children:"Amazon Managed Service for Prometheus"})," (AMP)\nand create a custom dashboard on ",(0,s.jsx)(n.a,{href:"https://aws.amazon.com/grafana/",children:"Amazon Managed Grafana"}),"\n(AMG) to monitor the health and performance of microservices."]}),"\n",(0,s.jsxs)(n.p,{children:["As part of the implementation, we will create an AMP workspace, install the App Mesh\nController for Kubernetes and inject the Envoy container into the pods. We will be\ncollecting the Envoy metrics using ",(0,s.jsx)(n.a,{href:"https://github.com/grafana/agent",children:"Grafana Agent"}),"\nconfigured in the EKS cluster and write them to AMP. Finally, we will be creating\nan AMG workspace and configure the AMP as the datasource and create a custom dashboard."]}),"\n",(0,s.jsx)(n.admonition,{type:"note",children:(0,s.jsx)(n.p,{children:"This guide will take approximately 45 minutes to complete."})}),"\n",(0,s.jsx)(n.h2,{id:"infrastructure",children:"Infrastructure"}),"\n",(0,s.jsx)(n.p,{children:"In the following section we will be setting up the infrastructure for this recipe."}),"\n",(0,s.jsx)(n.h3,{id:"architecture",children:"Architecture"}),"\n",(0,s.jsx)(n.p,{children:(0,s.jsx)(n.img,{alt:"Architecture",src:t(14157).A+"",width:"1496",height:"636"})}),"\n",(0,s.jsx)(n.p,{children:"The Grafana agent is configured to scrape the Envoy metrics and ingest them to AMP through the AMP remote write endpoint"}),"\n",(0,s.jsxs)(n.admonition,{type:"info",children:[(0,s.jsx)(n.mdxAdmonitionTitle,{}),(0,s.jsxs)(n.p,{children:["For more information on Prometheus Remote Write Exporter check out\n",(0,s.jsx)(n.a,{href:"https://aws-otel.github.io/docs/getting-started/prometheus-remote-write-exporter",children:"Getting Started with Prometheus Remote Write Exporter for AMP"}),"."]})]}),"\n",(0,s.jsx)(n.h3,{id:"prerequisites",children:"Prerequisites"}),"\n",(0,s.jsxs)(n.ul,{children:["\n",(0,s.jsxs)(n.li,{children:["The AWS CLI is ",(0,s.jsx)(n.a,{href:"https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-install.html",children:"installed"})," and ",(0,s.jsx)(n.a,{href:"https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-configure.html",children:"configured"})," in your environment."]}),"\n",(0,s.jsxs)(n.li,{children:["You need to install the ",(0,s.jsx)(n.a,{href:"https://docs.aws.amazon.com/eks/latest/userguide/eksctl.html",children:"eksctl"})," command in your environment."]}),"\n",(0,s.jsxs)(n.li,{children:["You need to install ",(0,s.jsx)(n.a,{href:"https://docs.aws.amazon.com/eks/latest/userguide/install-kubectl.html",children:"kubectl"})," in your environment."]}),"\n",(0,s.jsxs)(n.li,{children:["You have ",(0,s.jsx)(n.a,{href:"https://docs.docker.com/get-docker/",children:"Docker"})," installed into your environment."]}),"\n",(0,s.jsx)(n.li,{children:"You need AMP workspace configured in your AWS account."}),"\n",(0,s.jsxs)(n.li,{children:["You need to install ",(0,s.jsx)(n.a,{href:"https://www.eksworkshop.com/beginner/060_helm/helm_intro/install/index.html",children:"Helm"}),"."]}),"\n",(0,s.jsxs)(n.li,{children:["You need to enable ",(0,s.jsx)(n.a,{href:"https://docs.aws.amazon.com/singlesignon/latest/userguide/step1.html",children:"AWS-SSO"}),"."]}),"\n"]}),"\n",(0,s.jsx)(n.h3,{id:"setup-an-eks-cluster",children:"Setup an EKS cluster"}),"\n",(0,s.jsxs)(n.p,{children:["First, create an EKS cluster that will be enabled with App Mesh for running the sample application.\nThe ",(0,s.jsx)(n.code,{children:"eksctl"})," CLI will be used to deploy the cluster using the ",(0,s.jsx)(n.a,{target:"_blank","data-noBrokenLinkCheck":!0,href:t(34349).A+"",children:"eks-cluster-config.yaml"}),".\nThis template will create a new cluster with EKS."]}),"\n",(0,s.jsx)(n.p,{children:"Edit the template file and set your region to one of the available regions for AMP:"}),"\n",(0,s.jsxs)(n.ul,{children:["\n",(0,s.jsx)(n.li,{children:(0,s.jsx)(n.code,{children:"us-east-1"})}),"\n",(0,s.jsx)(n.li,{children:(0,s.jsx)(n.code,{children:"us-east-2"})}),"\n",(0,s.jsx)(n.li,{children:(0,s.jsx)(n.code,{children:"us-west-2"})}),"\n",(0,s.jsx)(n.li,{children:(0,s.jsx)(n.code,{children:"eu-central-1"})}),"\n",(0,s.jsx)(n.li,{children:(0,s.jsx)(n.code,{children:"eu-west-1"})}),"\n"]}),"\n",(0,s.jsx)(n.p,{children:"Make sure to overwrite this region in your session, for example, in the Bash\nshell:"}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{children:"export AWS_REGION=eu-west-1\n"})}),"\n",(0,s.jsx)(n.p,{children:"Create your cluster using the following command:"}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{children:"eksctl create cluster -f eks-cluster-config.yaml\n"})}),"\n",(0,s.jsxs)(n.p,{children:["This creates an EKS cluster named ",(0,s.jsx)(n.code,{children:"AMP-EKS-CLUSTER"})," and a service account\nnamed ",(0,s.jsx)(n.code,{children:"appmesh-controller"})," that will be used by the App Mesh controller for EKS."]}),"\n",(0,s.jsx)(n.h3,{id:"install-app-mesh-controller",children:"Install App Mesh Controller"}),"\n",(0,s.jsxs)(n.p,{children:["Next, we will run the below commands to install the ",(0,s.jsx)(n.a,{href:"https://docs.aws.amazon.com/app-mesh/latest/userguide/getting-started-kubernetes.html",children:"App Mesh Controller"}),"\nand configure the Custom Resource Definitions (CRDs):"]}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{children:"helm repo add eks https://aws.github.io/eks-charts\n"})}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{children:"helm upgrade -i appmesh-controller eks/appmesh-controller \\\n     --namespace appmesh-system \\\n     --set region=${AWS_REGION} \\\n     --set serviceAccount.create=false \\\n     --set serviceAccount.name=appmesh-controller\n"})}),"\n",(0,s.jsx)(n.h3,{id:"set-up-amp",children:"Set up AMP"}),"\n",(0,s.jsx)(n.p,{children:"The AMP workspace is used to ingest the Prometheus metrics collected from Envoy.\nA workspace is a logical Cortex server dedicated to a tenant. A workspace supports\nfine-grained access control for authorizing its management such as update, list,\ndescribe, and delete, and the ingestion and querying of metrics."}),"\n",(0,s.jsx)(n.p,{children:"Create a workspace using the AWS CLI:"}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{children:"aws amp create-workspace --alias AMP-APPMESH --region $AWS_REGION\n"})}),"\n",(0,s.jsx)(n.p,{children:"Add the necessary Helm repositories:"}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{children:"helm repo add prometheus-community https://prometheus-community.github.io/helm-charts && \\\nhelm repo add kube-state-metrics https://kubernetes.github.io/kube-state-metrics \n"})}),"\n",(0,s.jsxs)(n.p,{children:["For more details on AMP check out the ",(0,s.jsx)(n.a,{href:"https://docs.aws.amazon.com/prometheus/latest/userguide/AMP-getting-started.html",children:"AMP Getting started"})," guide."]}),"\n",(0,s.jsx)(n.h3,{id:"scraping--ingesting-metrics",children:"Scraping & ingesting metrics"}),"\n",(0,s.jsxs)(n.p,{children:["AMP does not directly scrape operational metrics from containerized workloads in a Kubernetes cluster.\nYou must deploy and manage a Prometheus server or an OpenTelemetry agent such as the\n",(0,s.jsx)(n.a,{href:"https://github.com/aws-observability/aws-otel-collector",children:"AWS Distro for OpenTelemetry Collector"}),"\nor the Grafana Agent to perform this task. In this receipe, we walk you through the\nprocess of configuring the Grafana Agent to scrape the Envoy metrics and analyze them using AMP and AMG."]}),"\n",(0,s.jsx)(n.h4,{id:"configure-grafana-agent",children:"Configure Grafana Agent"}),"\n",(0,s.jsx)(n.p,{children:"The Grafana Agent is a lightweight alternative to running a full Prometheus server.\nIt keeps the necessary parts for discovering and scraping Prometheus exporters and\nsending metrics to a Prometheus-compatible backend. The Grafana Agent also includes\nnative support for AWS Signature Version 4 (Sigv4) for AWS Identity and Access Management (IAM)\nauthentication."}),"\n",(0,s.jsx)(n.p,{children:"We now walk you through the steps to configure an IAM role to send Prometheus metrics to AMP.\nWe install the Grafana Agent on the EKS cluster and forward metrics to AMP."}),"\n",(0,s.jsx)(n.h4,{id:"configure-permissions",children:"Configure permissions"}),"\n",(0,s.jsx)(n.p,{children:"The Grafana Agent scrapes operational metrics from containerized workloads running in the\nEKS cluster and sends them to AMP. Data sent to AMP must be signed with valid AWS credentials\nusing Sigv4 to authenticate and authorize each client request for the managed service."}),"\n",(0,s.jsx)(n.p,{children:"The Grafana Agent can be deployed to an EKS cluster to run under the identity of a Kubernetes service account.\nWith IAM roles for service accounts (IRSA), you can associate an IAM role with a Kubernetes service account\nand thus provide IAM permissions to any pod that uses the service account."}),"\n",(0,s.jsx)(n.p,{children:"Prepare the IRSA setup as follows:"}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{children:'kubectl create namespace grafana-agent\n\nexport WORKSPACE=$(aws amp list-workspaces | jq -r \'.workspaces[] | select(.alias=="AMP-APPMESH").workspaceId\')\nexport ROLE_ARN=$(aws iam get-role --role-name EKS-GrafanaAgent-AMP-ServiceAccount-Role --query Role.Arn --output text)\nexport NAMESPACE="grafana-agent"\nexport REMOTE_WRITE_URL="https://aps-workspaces.$AWS_REGION.amazonaws.com/workspaces/$WORKSPACE/api/v1/remote_write"\n'})}),"\n",(0,s.jsxs)(n.p,{children:["You can use the ",(0,s.jsx)(n.a,{target:"_blank","data-noBrokenLinkCheck":!0,href:t(36888).A+"",children:"gca-permissions.sh"}),"\nshell script to automate the following steps (note to replace the placeholder variable\n",(0,s.jsx)(n.code,{children:"YOUR_EKS_CLUSTER_NAME"})," with the name of your EKS cluster):"]}),"\n",(0,s.jsxs)(n.ul,{children:["\n",(0,s.jsxs)(n.li,{children:["Creates an IAM role named ",(0,s.jsx)(n.code,{children:"EKS-GrafanaAgent-AMP-ServiceAccount-Rol"}),"e with an IAM policy that has permissions to remote-write into an AMP workspace."]}),"\n",(0,s.jsxs)(n.li,{children:["Creates a Kubernetes service account named ",(0,s.jsx)(n.code,{children:"grafana-agent"})," under the ",(0,s.jsx)(n.code,{children:"grafana-agent"})," namespace that is associated with the IAM role."]}),"\n",(0,s.jsx)(n.li,{children:"Creates a trust relationship between the IAM role and the OIDC provider hosted in your Amazon EKS cluster."}),"\n"]}),"\n",(0,s.jsxs)(n.p,{children:["You need ",(0,s.jsx)(n.code,{children:"kubectl"})," and ",(0,s.jsx)(n.code,{children:"eksctl"})," CLI tools to run the ",(0,s.jsx)(n.code,{children:"gca-permissions.sh"})," script.\nThey must be configured to access your Amazon EKS cluster."]}),"\n",(0,s.jsxs)(n.p,{children:["Now create a manifest file, ",(0,s.jsx)(n.a,{target:"_blank","data-noBrokenLinkCheck":!0,href:t(40136).A+"",children:"grafana-agent.yaml"}),",\nwith the scrape configuration to extract Envoy metrics and deploy the Grafana Agent."]}),"\n",(0,s.jsx)(n.admonition,{type:"note",children:(0,s.jsx)(n.p,{children:"At time of writing, this solution will not work for EKS on Fargate\ndue to the lack of support for daemon sets there."})}),"\n",(0,s.jsxs)(n.p,{children:["The example deploys a daemon set named ",(0,s.jsx)(n.code,{children:"grafana-agent"})," and a deployment named\n",(0,s.jsx)(n.code,{children:"grafana-agent-deployment"}),". The ",(0,s.jsx)(n.code,{children:"grafana-agent"})," daemon set collects metrics\nfrom pods on the cluster and the ",(0,s.jsx)(n.code,{children:"grafana-agent-deployment"})," deployment collects\nmetrics from services that do not live on the cluster, such as the EKS control plane."]}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{children:"kubectl apply -f grafana-agent.yaml\n"})}),"\n",(0,s.jsxs)(n.p,{children:["After the ",(0,s.jsx)(n.code,{children:"grafana-agent"})," is deployed, it will collect the metrics and ingest\nthem into the specified AMP workspace. Now deploy a sample application on the\nEKS cluster and start analyzing the metrics."]}),"\n",(0,s.jsx)(n.h2,{id:"sample-application",children:"Sample application"}),"\n",(0,s.jsx)(n.p,{children:"To install an application and inject an Envoy container, we use the AppMesh controller for Kubernetes."}),"\n",(0,s.jsx)(n.p,{children:"First, install the base application by cloning the examples repo:"}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{children:"git clone https://github.com/aws/aws-app-mesh-examples.git\n"})}),"\n",(0,s.jsx)(n.p,{children:"And now apply the resources to your cluster:"}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{children:"kubectl apply -f aws-app-mesh-examples/examples/apps/djapp/1_base_application\n"})}),"\n",(0,s.jsx)(n.p,{children:"Check the pod status and make sure it is running:"}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{children:"$ kubectl -n prod get all\n\nNAME                            READY   STATUS    RESTARTS   AGE\npod/dj-cb77484d7-gx9vk          1/1     Running   0          6m8s\npod/jazz-v1-6b6b6dd4fc-xxj9s    1/1     Running   0          6m8s\npod/metal-v1-584b9ccd88-kj7kf   1/1     Running   0          6m8s\n"})}),"\n",(0,s.jsx)(n.p,{children:"Next, install the App Mesh controller and meshify the deployment:"}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{children:"kubectl apply -f aws-app-mesh-examples/examples/apps/djapp/2_meshed_application/\nkubectl rollout restart deployment -n prod dj jazz-v1 metal-v1\n"})}),"\n",(0,s.jsx)(n.p,{children:"Now we should see two containers running in each pod:"}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{children:"$ kubectl -n prod get all\nNAME                        READY   STATUS    RESTARTS   AGE\ndj-7948b69dff-z6djf         2/2     Running   0          57s\njazz-v1-7cdc4fc4fc-wzc5d    2/2     Running   0          57s\nmetal-v1-7f499bb988-qtx7k   2/2     Running   0          57s\n"})}),"\n",(0,s.jsx)(n.p,{children:"Generate the traffic for 5 mins and we will visualize it AMG later:"}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{children:"dj_pod=`kubectl get pod -n prod --no-headers -l app=dj -o jsonpath='{.items[*].metadata.name}'`\n\nloop_counter=0\nwhile [ $loop_counter -le 300 ] ; do \\\nkubectl exec -n prod -it $dj_pod  -c dj \\\n-- curl jazz.prod.svc.cluster.local:9080 ; echo ; loop_counter=$[$loop_counter+1] ; \\\ndone\n"})}),"\n",(0,s.jsx)(n.h3,{id:"create-an-amg-workspace",children:"Create an AMG workspace"}),"\n",(0,s.jsxs)(n.p,{children:["To create an AMG workspace follow the steps in the ",(0,s.jsx)(n.a,{href:"https://aws.amazon.com/blogs/mt/amazon-managed-grafana-getting-started/",children:"Getting Started with AMG"})," blog post.\nTo grant users access to the dashboard, you must enable AWS SSO. After you create the workspace, you can assign access to the Grafana workspace to an individual user or a user group.\nBy default, the user has a user type of viewer. Change the user type based on the user role. Add the AMP workspace as the data source and then start creating the dashboard."]}),"\n",(0,s.jsxs)(n.p,{children:["In this example, the user name is ",(0,s.jsx)(n.code,{children:"grafana-admin"})," and the user type is ",(0,s.jsx)(n.code,{children:"Admin"}),".\nSelect the required data source. Review the configuration, and then choose ",(0,s.jsx)(n.code,{children:"Create workspace"}),"."]}),"\n",(0,s.jsx)(n.p,{children:(0,s.jsx)(n.img,{alt:"Creating AMP Workspace",src:t(4069).A+"",width:"1440",height:"526"})}),"\n",(0,s.jsx)(n.h3,{id:"configure-amg-datasource",children:"Configure AMG datasource"}),"\n",(0,s.jsxs)(n.p,{children:["To configure AMP as a data source in AMG, in the ",(0,s.jsx)(n.code,{children:"Data sources"})," section, choose\n",(0,s.jsx)(n.code,{children:"Configure in Grafana"}),", which will launch a Grafana workspace in the browser.\nYou can also manually launch the Grafana workspace URL in the browser."]}),"\n",(0,s.jsx)(n.p,{children:(0,s.jsx)(n.img,{alt:"Configuring Datasource",src:t(3664).A+"",width:"1656",height:"1218"})}),"\n",(0,s.jsx)(n.p,{children:"As you can see from the screenshots, you can view Envoy metrics like downstream\nlatency, connections, response code, and more. You can use the filters shown to\ndrill down to the envoy metrics of a particular application."}),"\n",(0,s.jsx)(n.h3,{id:"configure-amg-dashboard",children:"Configure AMG dashboard"}),"\n",(0,s.jsxs)(n.p,{children:["After the data source is configured, import a custom dashboard to analyze the Envoy metrics.\nFor this we use a pre-defined dashboard, so choose ",(0,s.jsx)(n.code,{children:"Import"})," (shown below), and\nthen enter the ID ",(0,s.jsx)(n.code,{children:"11022"}),". This will import the Envoy Global dashboard so you can\nstart analyzing the Envoy metrics."]}),"\n",(0,s.jsx)(n.p,{children:(0,s.jsx)(n.img,{alt:"Custom Dashboard",src:t(46446).A+"",width:"1190",height:"322"})}),"\n",(0,s.jsx)(n.h3,{id:"configure-alerts-on-amg",children:"Configure alerts on AMG"}),"\n",(0,s.jsx)(n.p,{children:"You can configure Grafana alerts when the metric increases beyond the intended threshold.\nWith AMG, you can configure how often the alert must be evaluated in the dashboard and send the notification.\nBefore you create alert rules, you must create a notification channel."}),"\n",(0,s.jsxs)(n.p,{children:["In this example, configure Amazon SNS as a notification channel. The SNS topic must be\nprefixed with ",(0,s.jsx)(n.code,{children:"grafana"})," for notifications to be successfully published to the topic\nif you use the defaults, that is, the ",(0,s.jsx)(n.a,{href:"https://docs.aws.amazon.com/grafana/latest/userguide/AMG-manage-permissions.html#AMG-service-managed-account",children:"service-managed permissions"}),"."]}),"\n",(0,s.jsxs)(n.p,{children:["Use the following command to create an SNS topic named ",(0,s.jsx)(n.code,{children:"grafana-notification"}),":"]}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{children:"aws sns create-topic --name grafana-notification\n"})}),"\n",(0,s.jsx)(n.p,{children:"And subscribe to it via an email address. Make sure you specify the region and Account ID in the\nbelow command:"}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{children:"aws sns subscribe \\\n    --topic-arn arn:aws:sns:<region>:<account-id>:grafana-notification \\\n\t--protocol email \\\n\t--notification-endpoint <email-id>\n"})}),"\n",(0,s.jsx)(n.p,{children:"Now, add a new notification channel from the Grafana dashboard.\nConfigure the new notification channel named grafana-notification. For Type,\nuse AWS SNS from the drop down. For Topic, use the ARN of the SNS topic you just created.\nFor Auth provider, choose AWS SDK Default."}),"\n",(0,s.jsx)(n.p,{children:(0,s.jsx)(n.img,{alt:"Creating Notification Channel",src:t(355).A+"",width:"1310",height:"1214"})}),"\n",(0,s.jsx)(n.p,{children:"Now configure an alert if downstream latency exceeds five milliseconds in a one-minute period.\nIn the dashboard, choose Downstream latency from the dropdown, and then choose Edit.\nOn the Alert tab of the graph panel, configure how often the alert rule should be evaluated\nand the conditions that must be met for the alert to change state and initiate its notifications."}),"\n",(0,s.jsx)(n.p,{children:"In the following configuration, an alert is created if the downstream latency exceeds the\nthreshold and notification will be sent through the configured grafana-alert-notification channel to the SNS topic."}),"\n",(0,s.jsx)(n.p,{children:(0,s.jsx)(n.img,{alt:"Alert Configuration",src:t(15307).A+"",width:"1322",height:"946"})}),"\n",(0,s.jsx)(n.h2,{id:"cleanup",children:"Cleanup"}),"\n",(0,s.jsxs)(n.ol,{children:["\n",(0,s.jsx)(n.li,{children:"Remove the resources and cluster:"}),"\n"]}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{children:"kubectl delete all --all\neksctl delete cluster --name AMP-EKS-CLUSTER\n"})}),"\n",(0,s.jsxs)(n.ol,{start:"2",children:["\n",(0,s.jsx)(n.li,{children:"Remove the AMP workspace:"}),"\n"]}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{children:"aws amp delete-workspace --workspace-id `aws amp list-workspaces --alias prometheus-sample-app --query 'workspaces[0].workspaceId' --output text`\n"})}),"\n",(0,s.jsxs)(n.ol,{start:"3",children:["\n",(0,s.jsx)(n.li,{children:"Remove the amp-iamproxy-ingest-role IAM role:"}),"\n"]}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{children:"aws delete-role --role-name amp-iamproxy-ingest-role\n"})}),"\n",(0,s.jsxs)(n.ol,{start:"4",children:["\n",(0,s.jsx)(n.li,{children:"Remove the AMG workspace by removing it from the console."}),"\n"]})]})}function h(e={}){const{wrapper:n}={...(0,a.R)(),...e.components};return n?(0,s.jsx)(n,{...e,children:(0,s.jsx)(d,{...e})}):d(e)}},34349:(e,n,t)=>{t.d(n,{A:()=>s});const s=t.p+"assets/files/eks-cluster-config-638253ba22fa7d27da64bb220b6ec663.yaml"},36888:(e,n,t)=>{t.d(n,{A:()=>s});const s=t.p+"assets/files/gca-permissions-da5d026b7a99561bc5134fb7575d8e56.sh"},40136:(e,n,t)=>{t.d(n,{A:()=>s});const s=t.p+"assets/files/grafana-agent-fe9dfb058034910773da075aa50ad119.yaml"},355:(e,n,t)=>{t.d(n,{A:()=>s});const s=t.p+"assets/images/alert-configuration-309c1b689c37ddd01054aec3f8e52664.png"},3664:(e,n,t)=>{t.d(n,{A:()=>s});const s=t.p+"assets/images/configuring-amp-datasource-32c4c6a83188d7a71e1fa28784c1274d.png"},15307:(e,n,t)=>{t.d(n,{A:()=>s});const s=t.p+"assets/images/downstream-latency-136785406e3778d28fd1d34646ba97bb.png"},46446:(e,n,t)=>{t.d(n,{A:()=>s});const s=t.p+"assets/images/import-dashboard-23920a9362a89085cd907e27531bd6d5.png"},14157:(e,n,t)=>{t.d(n,{A:()=>s});const s=t.p+"assets/images/monitoring-appmesh-environment-50670603f0c4805834d00ec9b80f302b.png"},4069:(e,n,t)=>{t.d(n,{A:()=>s});const s=t.p+"assets/images/workspace-creation-403f403cf7493dddcb3351e74e87cad6.png"},28453:(e,n,t)=>{t.d(n,{R:()=>o,x:()=>i});var s=t(96540);const a={},r=s.createContext(a);function o(e){const n=s.useContext(r);return s.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function i(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(a):e.components||a:o(e.components),s.createElement(r.Provider,{value:n},e.children)}}}]);
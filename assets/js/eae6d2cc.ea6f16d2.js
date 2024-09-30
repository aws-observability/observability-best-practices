"use strict";(self.webpackChunkobservability_best_practices=self.webpackChunkobservability_best_practices||[]).push([[5124],{21633:(e,t,s)=>{s.r(t),s.d(t,{assets:()=>c,contentTitle:()=>a,default:()=>u,frontMatter:()=>i,metadata:()=>r,toc:()=>l});var o=s(74848),n=s(28453);const i={},a="Using Kubecost",r={id:"guides/cost/kubecost",title:"Using Kubecost",description:"Kubecost provides customers with visibility into spend and resource efficiency in Kubernetes environments. At a high level, Amazon EKS cost monitoring is deployed with Kubecost, which includes Prometheus, an open-source monitoring system and time series database. Kubecost reads metrics from Prometheus then performs cost allocation calculations and writes the metrics back to Prometheus. Finally, the Kubecost front end reads metrics from Prometheus and shows them on the Kubecost user interface (UI). The architecture is illustrated by the following diagram:",source:"@site/docs/guides/cost/kubecost.md",sourceDirName:"guides/cost",slug:"/guides/cost/kubecost",permalink:"/observability-best-practices/docs/guides/cost/kubecost",draft:!1,unlisted:!1,editUrl:"https://github.com/aws-observability/observability-best-practices/docs/guides/cost/kubecost.md",tags:[],version:"current",frontMatter:{},sidebar:"guides",previous:{title:"Choosing a tracing agent",permalink:"/observability-best-practices/docs/guides/choosing-a-tracing-agent"},next:{title:"AWS Observability services and Cost",permalink:"/observability-best-practices/docs/guides/cost/cost-visualization/cost"}},c={},l=[{value:"Reasons to use Kubecost",id:"reasons-to-use-kubecost",level:2},{value:"Recommendations",id:"recommendations",level:2},{value:"Cost Allocation",id:"cost-allocation",level:3},{value:"Efficiency",id:"efficiency",level:3},{value:"Idle Cost",id:"idle-cost",level:3},{value:"Network Cost",id:"network-cost",level:3},{value:"Right-Sizing Workloads",id:"right-sizing-workloads",level:3},{value:"Integrating Kubecost with Amazon Managed Service for Prometheus",id:"integrating-kubecost-with-amazon-managed-service-for-prometheus",level:3},{value:"Accessing Kubecost UI",id:"accessing-kubecost-ui",level:3},{value:"Multi-cluster view",id:"multi-cluster-view",level:3},{value:"References",id:"references",level:3}];function d(e){const t={a:"a",admonition:"admonition",code:"code",h1:"h1",h2:"h2",h3:"h3",img:"img",li:"li",p:"p",pre:"pre",ul:"ul",...(0,n.R)(),...e.components};return(0,o.jsxs)(o.Fragment,{children:[(0,o.jsx)(t.h1,{id:"using-kubecost",children:"Using Kubecost"}),"\n",(0,o.jsx)(t.p,{children:"Kubecost provides customers with visibility into spend and resource efficiency in Kubernetes environments. At a high level, Amazon EKS cost monitoring is deployed with Kubecost, which includes Prometheus, an open-source monitoring system and time series database. Kubecost reads metrics from Prometheus then performs cost allocation calculations and writes the metrics back to Prometheus. Finally, the Kubecost front end reads metrics from Prometheus and shows them on the Kubecost user interface (UI). The architecture is illustrated by the following diagram:"}),"\n",(0,o.jsx)(t.p,{children:(0,o.jsx)(t.img,{alt:"Architecture",src:s(52468).A+"",width:"1032",height:"774"})}),"\n",(0,o.jsx)(t.h2,{id:"reasons-to-use-kubecost",children:"Reasons to use Kubecost"}),"\n",(0,o.jsx)(t.p,{children:"As customers modernize their applications and deploy workloads using Amazon EKS, they gain efficiencies by consolidating the compute resources required to run their applications. However, this utilization efficiency comes at a tradeoff of increased difficulty measuring application costs. Today, you can use one of these methods to distribute costs by tenant:"}),"\n",(0,o.jsxs)(t.ul,{children:["\n",(0,o.jsx)(t.li,{children:"Hard multi-tenancy \u2014 Run separate EKS clusters in dedicated AWS accounts."}),"\n",(0,o.jsx)(t.li,{children:"Soft multi-tenancy \u2014 Run multiple node groups in a shared EKS cluster."}),"\n",(0,o.jsx)(t.li,{children:"Consumption based billing \u2014 Use resource consumption to calculate the cost incurred in a shared EKS cluster."}),"\n"]}),"\n",(0,o.jsxs)(t.p,{children:["With Hard multi-tenancy, workloads get deployed in separate EKS clusters and you can identify the cost incurred for the cluster and its dependencies without having to run reports to determine each tenant\u2019s spend.\nWith Soft multi-tenancy, you can use Kubernetes features like ",(0,o.jsx)(t.a,{href:"https://kubernetes.io/docs/concepts/scheduling-eviction/assign-pod-node/#nodeselector",children:"Node Selectors"})," and ",(0,o.jsx)(t.a,{href:"https://kubernetes.io/docs/concepts/scheduling-eviction/assign-pod-node/#affinity-and-anti-affinity",children:"Node Affinity"})," to instruct Kubernetes Scheduler to run a tenant\u2019s workload on dedicated node groups. You can tag the EC2 instances in a node group with an identifier (like product name or team name) and use ",(0,o.jsx)(t.a,{href:"https://docs.aws.amazon.com/awsaccountbilling/latest/aboutv2/cost-alloc-tags.html",children:"tags"})," to distribute costs.\nA downside of the above two approach is that you may end up with unused capacity and may not fully utilize the cost savings that come when you run a densely packed cluster. You still need ways to allocate cost of shared resources like Elastic Load Balancing, network transfer charges."]}),"\n",(0,o.jsx)(t.p,{children:"The most efficient way to track costs in multi-tenant Kubernetes clusters is to distribute incurred costs based on the amount of resources consumed by workloads. This pattern allows you to maximize the utilization of your EC2 instances because different workloads can share nodes, which allows you to increase the pod-density on your nodes. However, calculating costs by workload or namespaces is a challenging task. Understanding the cost-responsibility of a workload requires aggregating all the resources consumed or reserved during a time-frame, and evaluating the charges based on the cost of the resource and the duration of the usage. This is the exact challenge that Kubecost is dedicated to tackling."}),"\n",(0,o.jsx)(t.admonition,{type:"tip",children:(0,o.jsxs)(t.p,{children:["Take a look at our ",(0,o.jsx)(t.a,{href:"https://catalog.workshops.aws/observability/en-US/aws-managed-oss/amp/ingest-kubecost-metrics",children:"One Observability Workshop"})," to get a hands-on experience on Kubecost."]})}),"\n",(0,o.jsx)(t.h2,{id:"recommendations",children:"Recommendations"}),"\n",(0,o.jsx)(t.h3,{id:"cost-allocation",children:"Cost Allocation"}),"\n",(0,o.jsx)(t.p,{children:"The Kubecost Cost Allocation dashboard allows you to quickly see allocated spend and optimization opportunity across all native Kubernetes concepts, e.g. namespace, k8s label, and service. It also allows for allocating cost to organizational concepts like team, product/project, department, or environment. You can modify Date range, filters to derive insights about specific workload and save the report. To optimize the Kubernetes cost, you should be paying attention to the efficiency and cluster idle costs."}),"\n",(0,o.jsx)(t.p,{children:(0,o.jsx)(t.img,{alt:"Allocations",src:s(71561).A+"",width:"2292",height:"854"})}),"\n",(0,o.jsx)(t.h3,{id:"efficiency",children:"Efficiency"}),"\n",(0,o.jsx)(t.p,{children:"Pod resource efficiency is defined as the resource utilization versus the resource request over a given time window. It is cost-weighted and can be expressed as follows:"}),"\n",(0,o.jsx)(t.pre,{children:(0,o.jsx)(t.code,{children:"(((CPU Usage / CPU Requested) * CPU Cost) + ((RAM Usage / RAM Requested) * RAM Cost)) / (RAM Cost + CPU Cost)\n"})}),"\n",(0,o.jsx)(t.p,{children:"where CPU Usage = rate(container_cpu_usage_seconds_total) over the time window RAM Usage = avg(container_memory_working_set_bytes) over the time window"}),"\n",(0,o.jsx)(t.p,{children:"As explicit RAM, CPU or GPU prices are not provided by AWS, the Kubecost model falls back to the ratio of base CPU, GPU and RAM price inputs supplied. The default values for these parameters are based on the marginal resource rates of the cloud provider, but they can be customized within Kubecost. These base resource (RAM/CPU/GPU) prices are normalized to ensure the sum of each component is equal to the total price of the node provisioned, based on billing rates from your provider"}),"\n",(0,o.jsx)(t.p,{children:"It is the responsibility of each service team to move towards maximum efficiency and fine tune the workloads to achieve the goal."}),"\n",(0,o.jsx)(t.h3,{id:"idle-cost",children:"Idle Cost"}),"\n",(0,o.jsx)(t.p,{children:"Cluster idle cost is defined as the difference between the cost of allocated resources and the cost of the hardware they run on. Allocation is defined as the max of usage and requests. It can also be expressed as follows:"}),"\n",(0,o.jsx)(t.pre,{children:(0,o.jsx)(t.code,{children:"idle_cost = sum(node_cost) - (cpu_allocation_cost + ram_allocation_cost + gpu_allocation_cost)\n"})}),"\n",(0,o.jsx)(t.p,{children:"where allocation = max(request, usage)"}),"\n",(0,o.jsx)(t.p,{children:"So, idle costs can also be thought of as the cost of the space that the Kubernetes scheduler could schedule pods, without disrupting any existing workloads, but it is not currently. It can be distributed to the workloads or cluster or by nodes depending on how you want to configure."}),"\n",(0,o.jsx)(t.h3,{id:"network-cost",children:"Network Cost"}),"\n",(0,o.jsxs)(t.p,{children:["Kubecost uses best-effort to allocate network transfer costs to the workloads generating those costs. The accurate way of determining the network cost is by using the combination of  ",(0,o.jsx)(t.a,{href:"https://docs.kubecost.com/install-and-configure/install/cloud-integration/aws-cloud-integrations",children:"AWS Cloud Integration"})," and ",(0,o.jsx)(t.a,{href:"https://docs.kubecost.com/install-and-configure/advanced-configuration/network-costs-configuration",children:"Network costs daemonset"}),"."]}),"\n",(0,o.jsx)(t.p,{children:"You would want to take into account your efficiency score and Idle cost to fine tune the workloads to ensure you utilize the cluster to its complete potential. This takes us to the next topic namely Cluster right-sizing."}),"\n",(0,o.jsx)(t.h3,{id:"right-sizing-workloads",children:"Right-Sizing Workloads"}),"\n",(0,o.jsx)(t.p,{children:"Kubecost provides right-sizing recommendations for your workloads based on Kubernetes-native metrics. The savings panel in the kubecost UI is a great place to start."}),"\n",(0,o.jsx)(t.p,{children:(0,o.jsx)(t.img,{alt:"Savings",src:s(22469).A+"",width:"2194",height:"1225"})}),"\n",(0,o.jsx)(t.p,{children:(0,o.jsx)(t.img,{alt:"Right-sizing",src:s(68599).A+"",width:"2254",height:"916"})}),"\n",(0,o.jsx)(t.p,{children:"Kubecost can give you recommendations on:"}),"\n",(0,o.jsxs)(t.ul,{children:["\n",(0,o.jsx)(t.li,{children:"Right sizing container request by taking a look at both over-provisioned and under-provisioned container request"}),"\n",(0,o.jsx)(t.li,{children:"Adjust the number and size of the cluster nodes to stop over-spending on unused capacity"}),"\n",(0,o.jsx)(t.li,{children:"Scale down, delete / resize pods that don\u2019t send or receive meaningful rate of traffic"}),"\n",(0,o.jsx)(t.li,{children:"Identifying workloads ready for spot nodes"}),"\n",(0,o.jsx)(t.li,{children:"Identifying volumes that are unused by any pods"}),"\n"]}),"\n",(0,o.jsx)(t.p,{children:"Kubecost also has a pre-release feature that can automatically implement its recommendations for container resource requests if you have the Cluster Controller component enabled. Using automatic request right-sizing allows you to instantly optimize resource allocation across your entire cluster, without testing excessive YAML or complicated kubectl commands. You can easily eliminate resource over-allocation in your cluster, which paves the way for vast savings via cluster right-sizing and other optimizations."}),"\n",(0,o.jsx)(t.h3,{id:"integrating-kubecost-with-amazon-managed-service-for-prometheus",children:"Integrating Kubecost with Amazon Managed Service for Prometheus"}),"\n",(0,o.jsx)(t.p,{children:"Kubecost leverages the open-source Prometheus project as a time series database and post-processes the data in Prometheus to perform cost allocation calculations. Depending on the cluster size and scale of the workload, it could be overwhelming for a Prometheus server to scrape and store the metrics. In such case, you can use the Amazon Managed Service for Prometheus, a managed Prometheus-compatible monitoring service to store the metrics reliably and enable you to easily monitor Kubernetes cost at scale."}),"\n",(0,o.jsxs)(t.p,{children:["You must setup ",(0,o.jsx)(t.a,{href:"https://docs.aws.amazon.com/eks/latest/userguide/iam-roles-for-service-accounts.html",children:"IAM roles for Kubecost service accounts"}),". Using the OIDC provider for the cluster, you grant IAM permissions to your cluster\u2019s service accounts. You must grant appropriate permissions to the kubecost-cost-analyzer and kubecost-prometheus-server service accounts. These will be used to send and retrieve metrics from the workspace. Run the following commands on the command line:"]}),"\n",(0,o.jsx)(t.pre,{children:(0,o.jsx)(t.code,{children:"eksctl create iamserviceaccount \\ \n--name kubecost-cost-analyzer \\ \n--namespace kubecost \\ \n--cluster <CLUSTER_NAME> \\\n--region <REGION> \\ \n--attach-policy-arn arn:aws:iam::aws:policy/AmazonPrometheusQueryAccess \\ \n--attach-policy-arn arn:aws:iam::aws:policy/AmazonPrometheusRemoteWriteAccess \\ \n--override-existing-serviceaccounts \\ \n--approve \n\neksctl create iamserviceaccount \\ \n--name kubecost-prometheus-server \\ \n--namespace kubecost \\ \n--cluster <CLUSTER_NAME> --region <REGION> \\ \n--attach-policy-arn arn:aws:iam::aws:policy/AmazonPrometheusQueryAccess \\ \n--attach-policy-arn arn:aws:iam::aws:policy/AmazonPrometheusRemoteWriteAccess \\ \n--override-existing-serviceaccounts \\ \n--approve\n\n"})}),"\n",(0,o.jsxs)(t.p,{children:[(0,o.jsx)(t.code,{children:"CLUSTER_NAME"}),' is the name of the Amazon EKS cluster where you want to install Kubecost and "REGION" is the region of the Amazon EKS cluster.']}),"\n",(0,o.jsx)(t.p,{children:"Once complete, you will have to upgrade the Kubecost helm chart as below :"}),"\n",(0,o.jsx)(t.pre,{children:(0,o.jsx)(t.code,{children:"helm upgrade -i kubecost \\\noci://public.ecr.aws/kubecost/cost-analyzer --version <$VERSION> \\\n--namespace kubecost --create-namespace \\\n-f https://tinyurl.com/kubecost-amazon-eks \\\n-f https://tinyurl.com/kubecost-amp \\\n--set global.amp.prometheusServerEndpoint=${QUERYURL} \\\n--set global.amp.remoteWriteService=${REMOTEWRITEURL}\n"})}),"\n",(0,o.jsx)(t.h3,{id:"accessing-kubecost-ui",children:"Accessing Kubecost UI"}),"\n",(0,o.jsxs)(t.p,{children:["Kubecost provides a web dashboard that you can access either through kubectl port-forward, an ingress, or a load balancer. The enterprise version of Kubecost also supports restricting access to the dashboard using ",(0,o.jsx)(t.a,{href:"https://docs.kubecost.com/install-and-configure/advanced-configuration/user-management-oidc",children:"SSO/SAML"})," and providing varying level of access. For example, restricting team\u2019s view to only the products they are responsible for."]}),"\n",(0,o.jsxs)(t.p,{children:["In AWS environment, consider using the ",(0,o.jsx)(t.a,{href:"https://docs.aws.amazon.com/eks/latest/userguide/aws-load-balancer-controller.html",children:"AWS Load Balancer Controller"})," to expose Kubecost and use ",(0,o.jsx)(t.a,{href:"https://aws.amazon.com/cognito/",children:"Amazon Cognito"})," for authentication, authorization, and user management. You can learn more on this ",(0,o.jsx)(t.a,{href:"https://aws.amazon.com/blogs/containers/how-to-use-application-load-balancer-and-amazon-cognito-to-authenticate-users-for-your-kubernetes-web-apps/",children:"How to use Application Load Balancer and Amazon Cognito to authenticate users for your Kubernetes web apps"})]}),"\n",(0,o.jsx)(t.h3,{id:"multi-cluster-view",children:"Multi-cluster view"}),"\n",(0,o.jsx)(t.p,{children:"Your FinOps team would want to review the EKS cluster to share recommendations with business owners. When operating at large scale, it becomes challenging for the teams to log into each cluster to view the recommendations. Multi cluster allows you to have  a single-pane-of-glass view into all aggregated cluster costs globally.  There are three options that Kubecost supports for environments with multiple clusters: Kubecost Free, Kubecost Business, and Kubecost enterprise. In the free and business mode, the cloud-billing reconciliation will be performed at each cluster level. In the enterprise mode, the cloud billing reconciliation will be performed in a primary cluster that serves the kubecost UI and uses the shared bucket where the metrics are stored.\nIt is important to note that metrics retention is unlimited only when you use enterprise mode."}),"\n",(0,o.jsx)(t.h3,{id:"references",children:"References"}),"\n",(0,o.jsxs)(t.ul,{children:["\n",(0,o.jsx)(t.li,{children:(0,o.jsx)(t.a,{href:"https://catalog.workshops.aws/observability/en-US/aws-managed-oss/amp/ingest-kubecost-metrics",children:"Hands-On Kubecost experience on One Observability Workshop"})}),"\n",(0,o.jsx)(t.li,{children:(0,o.jsx)(t.a,{href:"https://aws.amazon.com/blogs/mt/integrating-kubecost-with-amazon-managed-service-for-prometheus/",children:"Blog - Integrating Kubecost with Amazon Managed Service for Prometheus"})}),"\n"]})]})}function u(e={}){const{wrapper:t}={...(0,n.R)(),...e.components};return t?(0,o.jsx)(t,{...e,children:(0,o.jsx)(d,{...e})}):d(e)}},71561:(e,t,s)=>{s.d(t,{A:()=>o});const o=s.p+"assets/images/allocations-35c4a1fc35497449f53fcb9b45f771ce.png"},52468:(e,t,s)=>{s.d(t,{A:()=>o});const o=s.p+"assets/images/kubecost-architecture-ab390df0384114cf473546a9dea8c7b4.png"},68599:(e,t,s)=>{s.d(t,{A:()=>o});const o=s.p+"assets/images/right-sizing-35265644446d58c5797ae8834b61ad3c.png"},22469:(e,t,s)=>{s.d(t,{A:()=>o});const o=s.p+"assets/images/savings-f3efae1e53b422ea62ee3c8c4bcd9b0b.png"},28453:(e,t,s)=>{s.d(t,{R:()=>a,x:()=>r});var o=s(96540);const n={},i=o.createContext(n);function a(e){const t=o.useContext(i);return o.useMemo((function(){return"function"==typeof e?e(t):{...t,...e}}),[t,e])}function r(e){let t;return t=e.disableParentContext?"function"==typeof e.components?e.components(n):e.components||n:a(e.components),o.createElement(i.Provider,{value:t},e.children)}}}]);
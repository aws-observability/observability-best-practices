"use strict";(self.webpackChunkobservability_best_practices=self.webpackChunkobservability_best_practices||[]).push([[801],{48613:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>c,contentTitle:()=>o,default:()=>h,frontMatter:()=>i,metadata:()=>a,toc:()=>l});var s=n(74848),r=n(28453);const i={},o="Collecting service metrics in an ECS cluster using AWS Distro for OpenTelemetry",a={id:"guides/containers/oss/ecs/best-practices-metrics-collection-2",title:"Collecting service metrics in an ECS cluster using AWS Distro for OpenTelemetry",description:"Deploying ADOT Collector with default configuration",source:"@site/docs/guides/containers/oss/ecs/best-practices-metrics-collection-2.md",sourceDirName:"guides/containers/oss/ecs",slug:"/guides/containers/oss/ecs/best-practices-metrics-collection-2",permalink:"/observability-best-practices/guides/containers/oss/ecs/best-practices-metrics-collection-2",draft:!1,unlisted:!1,editUrl:"https://github.com/aws-observability/observability-best-practices/blob/main/docusaurus/docs/guides/containers/oss/ecs/best-practices-metrics-collection-2.md",tags:[],version:"current",frontMatter:{},sidebar:"guides",previous:{title:"Collecting system metrics in an ECS cluster using AWS Distro for OpenTelemetry",permalink:"/observability-best-practices/guides/containers/oss/ecs/best-practices-metrics-collection-1"},next:{title:"Amazon CloudWatch Container Insights",permalink:"/observability-best-practices/guides/containers/aws-native/eks/amazon-cloudwatch-container-insights"}},c={},l=[{value:"Deploying ADOT Collector with default configuration",id:"deploying-adot-collector-with-default-configuration",level:2},{value:"Deploying ADOT Collector for Prometheus metrics collection",id:"deploying-adot-collector-for-prometheus-metrics-collection",level:2},{value:"Sending metrics data to Amazon Managed Prometheus workspace",id:"sending-metrics-data-to-amazon-managed-prometheus-workspace",level:3},{value:"Sending metrics data to Amazon CloudWatch",id:"sending-metrics-data-to-amazon-cloudwatch",level:3}];function m(e){const t={a:"a",admonition:"admonition",code:"code",em:"em",h1:"h1",h2:"h2",h3:"h3",p:"p",pre:"pre",...(0,r.R)(),...e.components};return(0,s.jsxs)(s.Fragment,{children:[(0,s.jsx)(t.h1,{id:"collecting-service-metrics-in-an-ecs-cluster-using-aws-distro-for-opentelemetry",children:"Collecting service metrics in an ECS cluster using AWS Distro for OpenTelemetry"}),"\n",(0,s.jsx)(t.h2,{id:"deploying-adot-collector-with-default-configuration",children:"Deploying ADOT Collector with default configuration"}),"\n",(0,s.jsxs)(t.p,{children:["The ADOT collector can be deployed using a task definition as shown below, using the sidecar pattern. The container image used for the collector is bundled with two collector pipeline configurations which can be specified in the ",(0,s.jsx)(t.em,{children:"command"})," section of the container defintion. Seting this value ",(0,s.jsx)(t.code,{children:"--config=/etc/ecs/ecs-default-config.yaml"}),"\nwill result in the use of a ",(0,s.jsx)(t.a,{href:"https://github.com/aws-observability/aws-otel-collector/blob/main/config/ecs/ecs-default-config.yaml",children:"pipeline configuration"})," that will collect application metrics and traces from other containers running within the same task as the collector and send them to Amazon CloudWatch and AWS X-Ray. Specifically, the collector uses an ",(0,s.jsx)(t.a,{href:"https://github.com/open-telemetry/opentelemetry-collector/tree/main/receiver/otlpreceiver",children:"OpenTelemetry Protocol (OTLP) Receiver"})," to receive metrics sent by applications that have been instrumented with OpenTelemetry SDKs as well as a ",(0,s.jsx)(t.a,{href:"https://github.com/open-telemetry/opentelemetry-collector-contrib/tree/main/receiver/statsdreceiver",children:"StatsD Receiver"})," to collect StatsD metrics. Additionally, it uses an ",(0,s.jsx)(t.a,{href:"https://github.com/open-telemetry/opentelemetry-collector-contrib/tree/main/receiver/awsxrayreceiver",children:"AWS X-ray Receiver"})," to collect traces from applications that have been instrumented with AWS X-Ray SDK."]}),"\n",(0,s.jsx)(t.admonition,{type:"info",children:(0,s.jsxs)(t.p,{children:["Refer to the ",(0,s.jsx)(t.a,{href:"https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/deploy-container-insights-ECS-adot.html",children:"documentation"})," for details about setting up the IAM task role and task execution role that the ADOT collector will use when deployed on an Amazon ECS cluster."]})}),"\n",(0,s.jsx)(t.pre,{children:(0,s.jsx)(t.code,{className:"language-javascript",children:'{\n    "family":"AdotTask",\n    "taskRoleArn":"arn:aws:iam::123456789012:role/ECS-ADOT-Task-Role",\n    "executionRoleArn":"arn:aws:iam::123456789012:role/ECS-Task-Execution-Role",\n    "networkMode":"awsvpc",\n    "containerDefinitions":[\n       {\n          "name":"application-container",\n          "image":"..."\n       },      \n       {\n          "name":"aws-otel-collector",\n          "image":"public.ecr.aws/aws-observability/aws-otel-collector:latest",\n          "cpu":512,\n          "memory":1024,\n          "command": [\n            "--config=/etc/ecs/ecs-default-config.yaml"\n          ],          \n          "portMappings":[\n             {\n                "containerPort":2000,\n                "protocol":"udp"\n             }\n          ],             \n          "essential":true\n       }\n    ],\n    "requiresCompatibilities":[\n       "EC2"\n    ],\n    "cpu":"1024",\n    "memory":"2048"\n }\n'})}),"\n",(0,s.jsx)(t.h2,{id:"deploying-adot-collector-for-prometheus-metrics-collection",children:"Deploying ADOT Collector for Prometheus metrics collection"}),"\n",(0,s.jsxs)(t.p,{children:["To deploy ADOT with the central collector pattern, with a pipeline that is different from the default configuration, the task definition shown below can be used. Here, the configuration of the collector pipeline is loaded from a parameter named ",(0,s.jsx)(t.em,{children:"otel-collector-config"})," in AWS SSM Parameter Store. The collector is launched using REPLICA service scheduler strategy."]}),"\n",(0,s.jsx)(t.pre,{children:(0,s.jsx)(t.code,{className:"language-javascript",children:'{\n    "family":"AdotTask",\n    "taskRoleArn":"arn:aws:iam::123456789012:role/ECS-ADOT-Task-Role",\n    "executionRoleArn":"arn:aws:iam::123456789012:role/ECS-Task-Execution-Role",\n    "networkMode":"awsvpc",\n    "containerDefinitions":[\n       {\n          "name":"aws-otel-collector",\n          "image":"public.ecr.aws/aws-observability/aws-otel-collector:latest",\n          "cpu":512,\n          "memory":1024,\n          "secrets":[\n             {\n                "name":"AOT_CONFIG_CONTENT",\n                "valueFrom":"arn:aws:ssm:us-east-1:123456789012:parameter/otel-collector-config"\n             }\n          ],          \n          "portMappings":[\n             {\n                "containerPort":2000,\n                "protocol":"udp"\n             }\n          ],             \n          "essential":true\n       }\n    ],\n    "requiresCompatibilities":[\n       "EC2"\n    ],\n    "cpu":"1024",\n    "memory":"2048"\n }\n'})}),"\n",(0,s.jsx)(t.admonition,{type:"note",children:(0,s.jsx)(t.p,{children:"The SSM Parameter Store parameter name must be exposed to the collector using an environment variable named AOT_CONFIG_CONTENT.\nWhen using the ADOT collector for Prometheus metrics collection from applications and deploying it with REPLICA service scheduler startegy, make sure that you set the replica count to 1. Deploying more than 1 replica of the collector will result in an incorrect representation of metrics data in the target destination."})}),"\n",(0,s.jsxs)(t.p,{children:["The configuration shown below enables the ADOT collector to collect Prometheus metrics from services in the cluster using a ",(0,s.jsx)(t.a,{href:"https://github.com/open-telemetry/opentelemetry-collector-contrib/tree/main/receiver/prometheusreceiver",children:"Prometheus Receiver"}),". The receiver is meant to minimally be a drop-in replacement for Prometheus server. To collect metrics with this receiver, you need a mechanism for discovering the set of target services to be scraped. The receiver supports both static and dynamic discovery of scraping targets using one of the dozens of supported ",(0,s.jsx)(t.a,{href:"https://prometheus.io/docs/prometheus/latest/configuration/configuration/#scrape_config",children:"service-discovery mechanisms"}),"."]}),"\n",(0,s.jsxs)(t.p,{children:["As Amazon ECS does not have any built-in service discovery mechanism, the collector relies on Prometheus' support for file-based discovery of targets. To setup the Prometheus receiver for file-based discovery of targets, the collector makes use of the ",(0,s.jsx)(t.a,{href:"https://github.com/open-telemetry/opentelemetry-collector-contrib/blob/main/extension/observer/ecsobserver/README.md",children:"Amazon ECS Observer"})," extension. The extension uses ECS/EC2 API to discover Prometheus scrape targets from all running tasks and filter them based on service names, task definitions and container labels listed under the ",(0,s.jsx)(t.em,{children:"ecs_observer/task_definitions"})," section in the configuration. All discovered targets are written into the file specified by the ",(0,s.jsx)(t.em,{children:"result_file"})," field, which resides on the file system mounted to ADOT collector container. Subequently, the Prometheus receiver scrapes metrics from the targets listed in this file."]}),"\n",(0,s.jsx)(t.h3,{id:"sending-metrics-data-to-amazon-managed-prometheus-workspace",children:"Sending metrics data to Amazon Managed Prometheus workspace"}),"\n",(0,s.jsxs)(t.p,{children:["The metrics collected by the Prometheus Receiver can be sent to an Amazon Managed Prometheus workspace using a ",(0,s.jsx)(t.a,{href:"https://github.com/open-telemetry/opentelemetry-collector-contrib/tree/main/exporter/prometheusremotewriteexporter",children:"Prometheus Remote Write Exporter"})," in the collector pipeline, as shown in the ",(0,s.jsx)(t.em,{children:"exporters"})," section of the configuration below. The exporter is configured with the remote write URL of the workspace and it sends the metrics data using HTTP POST requests. It makes use of the built-in AWS Signature Version 4 authenticator to sign the requests sent to the workspace."]}),"\n",(0,s.jsx)(t.pre,{children:(0,s.jsx)(t.code,{className:"language-yaml",children:"extensions:\n  health_check:\n  sigv4auth:\n    region: us-east-1\n  ecs_observer:\n    refresh_interval: 60s \n    cluster_name: 'ecs-ec2-cluster'\n    cluster_region: us-east-1\n    result_file: '/etc/ecs_sd_targets.yaml' \n    services:\n      - name_pattern: '^WebAppService$'\n    task_definitions:\n      - job_name: \"webapp-tasks\"\n        arn_pattern: '.*:task-definition/WebAppTask:[0-9]+'\n        metrics_path: '/metrics'\n        metrics_ports:\n          - 3000\n\nreceivers:\n  awsxray:\n  prometheus:\n    config:\n      scrape_configs:\n        - job_name: ecs_services\n          file_sd_configs:\n            - files:\n                - '/etc/ecs_sd_targets.yaml'\n              refresh_interval: 30s\n          relabel_configs: \n            - source_labels: [ __meta_ecs_cluster_name ] \n              action: replace\n              target_label: cluster\n            - source_labels: [ __meta_ecs_service_name ] \n              action: replace\n              target_label: service\n            - source_labels: [ __meta_ecs_task_definition_family ] \n              action: replace\n              target_label: taskdefinition       \n            - source_labels: [ __meta_ecs_task_container_name ] \n              action: replace\n              target_label: container                        \n\nprocessors:\n    filter/include:\n      metrics:\n        include:\n          match_type: regexp\n          metric_names:\n            - ^http_requests_total$  \n\nexporters:\n  awsxray:\n  prometheusremotewrite:\n    endpoint: https://aps-workspaces.us-east-1.amazonaws.com/workspaces/WORKSPACE_ID/api/v1/remote_write\n    auth:\n      authenticator: sigv4auth\n    resource_to_telemetry_conversion:\n      enabled: true\n\nservice:\n  extensions:\n    - ecs_observer\n    - health_check\n    - sigv4auth\n  pipelines:\n    metrics:\n      receivers: [prometheus]\n      exporters: [prometheusremotewrite]       \n    traces:\n      receivers: [awsxray]\n      exporters: [awsxray]       \n"})}),"\n",(0,s.jsx)(t.h3,{id:"sending-metrics-data-to-amazon-cloudwatch",children:"Sending metrics data to Amazon CloudWatch"}),"\n",(0,s.jsxs)(t.p,{children:["Alternatively, the metrics data can be sent to Amazon CloudWatch by using the ",(0,s.jsx)(t.a,{href:"https://github.com/open-telemetry/opentelemetry-collector-contrib/tree/main/exporter/awsemfexporter",children:"Amazon CloudWatch EMF Exporter"})," in the collector pipeline, as shown in the ",(0,s.jsx)(t.em,{children:"exporters"})," section of the configuration below. This exporter sends metrics data to CloudWatch as performance log events. The ",(0,s.jsx)(t.em,{children:"metric_declaration"})," field in the exporter is used to specify the array of logs with embedded metric format to be generated. The configurtion below will generate log events only for a metric named ",(0,s.jsx)(t.em,{children:"http_requests_total"}),". Using this data, CloudWatch will create the metric ",(0,s.jsx)(t.em,{children:"http_requests_total"})," under the CloudWatch namespace ",(0,s.jsx)(t.em,{children:"ECS/ContainerInsights/Prometheus"})," with the dimensions ",(0,s.jsx)(t.em,{children:"ClusterName"}),", ",(0,s.jsx)(t.em,{children:"ServiceName"})," and ",(0,s.jsx)(t.em,{children:"TaskDefinitionFamily"}),"."]}),"\n",(0,s.jsx)(t.pre,{children:(0,s.jsx)(t.code,{className:"language-yaml",children:"extensions:\n  health_check:\n  sigv4auth:\n    region: us-east-1\n  ecs_observer:\n    refresh_interval: 60s \n    cluster_name: 'ecs-ec2-cluster'\n    cluster_region: us-east-1\n    result_file: '/etc/ecs_sd_targets.yaml' \n    services:\n      - name_pattern: '^WebAppService$'\n    task_definitions:\n      - job_name: \"webapp-tasks\"\n        arn_pattern: '.*:task-definition/WebAppTask:[0-9]+'\n        metrics_path: '/metrics'\n        metrics_ports:\n          - 3000\n\nreceivers:\n  awsxray:\n  prometheus:\n    config:\n      global:\n        scrape_interval: 15s\n        scrape_timeout: 10s\n      scrape_configs:\n        - job_name: ecs_services\n          file_sd_configs::\n            - files:\n                - '/etc/ecs_sd_targets.yaml'\n          relabel_configs: \n            - source_labels: [ __meta_ecs_cluster_name ] \n              action: replace\n              target_label: ClusterName\n            - source_labels: [ __meta_ecs_service_name ] \n              action: replace\n              target_label: ServiceName\n            - source_labels: [ __meta_ecs_task_definition_family ] \n              action: replace\n              target_label: TaskDefinitionFamily       \n            - source_labels: [ __meta_ecs_task_container_name ] \n              action: replace\n              target_label: container          \n\nprocessors:\n    filter/include:\n      metrics:\n        include:\n          match_type: regexp\n          metric_names:\n            - ^http_requests_total$  \n\nexporters:\n  awsxray:\n  awsemf:\n    namespace: ECS/ContainerInsights/Prometheus\n    log_group_name: '/aws/ecs/containerinsights/{ClusterName}/prometheus'\n    dimension_rollup_option: NoDimensionRollup\n    metric_declarations:\n      - dimensions: [[ClusterName, ServiceName, TaskDefinitionFamily]]\n        metric_name_selectors:\n          - http_requests_total\n\nservice:\n  extensions:\n    - ecs_observer\n    - health_check\n    - sigv4auth\n  pipelines:\n    metrics:\n      receivers: [prometheus]\n      processors: [filter/include]\n      exporters: [awsemf]       \n    traces:\n      receivers: [awsxray]\n      exporters: [awsxray]       \n"})})]})}function h(e={}){const{wrapper:t}={...(0,r.R)(),...e.components};return t?(0,s.jsx)(t,{...e,children:(0,s.jsx)(m,{...e})}):m(e)}},28453:(e,t,n)=>{n.d(t,{R:()=>o,x:()=>a});var s=n(96540);const r={},i=s.createContext(r);function o(e){const t=s.useContext(i);return s.useMemo((function(){return"function"==typeof e?e(t):{...t,...e}}),[t,e])}function a(e){let t;return t=e.disableParentContext?"function"==typeof e.components?e.components(r):e.components||r:o(e.components),s.createElement(i.Provider,{value:t},e.children)}}}]);
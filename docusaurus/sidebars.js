/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation

 The sidebars can be generated from the filesystem, or explicitly defined here.

 Create as many sidebars as you want.
 */

// @ts-check

/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
// const sidebars = {
//   // By default, Docusaurus generates a sidebar from the docs folder structure
//   //tutorialSidebar: [{type: 'autogenerated', dirName: '.'}],
//   faq: [{type: 'autogenerated', dirName: 'faq'}],
//   guides: [{type: 'autogenerated', dirName: 'guides'}],
//   signals: [{type: 'autogenerated', dirName: 'signals'}],
//   tools: [{type: 'autogenerated', dirName: 'tools'}],
//   recipes: [{type: 'autogenerated', dirName: 'recipes'}],
//   patterns: [{type: 'autogenerated', dirName: 'patterns'}],   
  
// };

// export default sidebars;



module.exports = {
 // sidebar: {
    //'home',
    guides: [{
      type: 'category',
      label: 'Guides',
      items: [
        'guides/index',
        'guides/choosing-a-tracing-agent',
        {
          type: 'category',
          label: 'Cost',
          items: [
            'guides/cost/kubecost',
            'guides/cost/OLA-EC2-righsizing',
            {
              type: 'category',
              label: 'Visualizing costs',
              items: [
                'guides/cost/cost-visualization/cost',
                'guides/cost/cost-visualization/amazon-cloudwatch',
                'guides/cost/cost-visualization/amazon-grafana',
                'guides/cost/cost-visualization/amazon-prometheus',
                'guides/cost/cost-visualization/AmazonManagedServiceforPrometheus',
                'guides/cost/cost-visualization/aws-xray',
              ],
            },
          ],
        },
        {
          type: 'category',
          label: 'Databases',
          items: ['guides/databases/rds-and-aurora'],
        },
        'guides/ec2-monitoring',
        {
          type: 'category',
          label: 'ECS best practices',
          items: [
            {
              type: 'category',
              label: 'AWS Native',
              items: [
                'guides/containers/aws-native/ecs/best-practices-metrics-collection-1',
                'guides/containers/aws-native/ecs/best-practices-metrics-collection-2',
              ],
            },
            {
              type: 'category',
              label: 'Open Source',
              items: [
                'guides/containers/oss/ecs/best-practices-metrics-collection-1',
                'guides/containers/oss/ecs/best-practices-metrics-collection-2',
              ],
            },
          ],
        },
        {
          type: 'category',
          label: 'EKS best practices',
          items: [
            {
              type: 'category',
              label: 'AWS Native',
              items: [
                'guides/containers/aws-native/eks/amazon-cloudwatch-container-insights',
                'guides/containers/aws-native/eks/log-aggregation',
                'guides/containers/aws-native/eks/eks-api-server-monitoring',
                'guides/containers/aws-native/eks/container-tracing-with-aws-xray',
              ],
            },
            {
              type: 'category',
              label: 'Open Source',
              items: ['guides/containers/oss/eks/best-practices-metrics-collection',
                'guides/containers/oss/eks/keda-amp-eks',
              ],
            },
          ],
        },

        {
          type: 'category',
          label: '.NET',
          items: [
            {
              type: 'category',
              label: 'AWS Native',
              items: [
                'guides/dotnet/aws-native/logs',
                'guides/dotnet/aws-native/metrics',
                'guides/dotnet/aws-native/traces'
              ],
            },
            {
              type: 'category',
              label: 'Open Source',
              items: [
                'guides/dotnet/oss/logs',
                'guides/dotnet/oss/metrics',
                'guides/dotnet/oss/traces',
                'guides/dotnet/oss/opentelemetry'
              ],
            },
          ],
        },
        {
          type: 'category',
          label: 'Serverless best practices',
          items: [
            'guides/serverless/aws-native/lambda-based-observability',
            'guides/serverless/oss/lambda-based-observability-adot',
          ],
        },
        'guides/hybrid-and-multicloud',
        {
          type: 'category',
          label: 'Operational',
          items: [
            {
              type: 'category',
              label: 'ADOT Collector',
              items: [
                'guides/operational/adot-at-scale/operating-adot-collector',
                'guides/operational/adot-at-scale/adot-java-spring/adot-java-spring',
              ],
            },
            'guides/operational/business/monitoring-for-business-outcomes',
            'guides/operational/business/sla-percentile',
            'guides/operational/business/key-performance-indicators',
            'guides/rust-custom-metrics/README',
            {
              type: 'category',
              label: 'Alerting',
              items: ['guides/operational/alerting/amp-alertmgr'],
            },
            {
              type: 'category',
              label: 'GitOps',
              items: ['guides/operational/gitops-with-amg/gitops-with-amg'],
            },
            {
              type: 'category',
              label: 'Dashboards',
              items: ['tools/cloudwatch-dashboard'],
            },
          ],
        },
        {
          type: 'category',
          label: 'Signal collection',
          items: ['guides/signal-collection/emf'],
        },
        {
          type: 'category',
          label: 'Partners',
          items: [
            'guides/partners/databricks',
            {
              type: 'category',
              label: 'Databases',
              items: ['guides/databases/rds-and-aurora'],
            },
            {
              type: 'category',
              label: 'Cost',
              items: [
                'guides/cost/kubecost',
                'guides/cost/OLA-EC2-righsizing',
                {
                  type: 'category',
                  label: 'Visualizing costs',
                  items: [
                    'guides/cost/cost-visualization/cost',
                    'guides/cost/cost-visualization/amazon-cloudwatch',
                    'guides/cost/cost-visualization/amazon-grafana',
                    'guides/cost/cost-visualization/amazon-prometheus',
                    'guides/cost/cost-visualization/aws-xray',
                  ],
                },
              ],
            },
          ],
        },
        'guides/observability-maturity-model',
        'guides/cloudwatch_cross_account_observability',
      ],
    },
    ],
    sigals:[{
      type: 'category',
      label: 'Data types',
      items: [
        'signals/logs',
        'signals/metrics',
        'signals/traces',
        'signals/alarms',
        'signals/events',
      ],
    }],
    tools:[{
      type: 'category',
      label: 'Tools',
      items: [
        'tools/observability_accelerator',
        'tools/cloudwatch_agent',
        'tools/alarms',
        'tools/dashboards',
        'tools/internet_monitor',
        {
          type: 'category',
          label: 'Logs',
          items: [
            'tools/logs/index',
            'tools/logs/logs-insights-examples',
            'tools/logs/contributor_insights/contributor_insights',
            {
              type: 'category',
              label: 'Data Protection',
              items: ['tools/logs/dataprotection/data-protection-policies'],
            },
          ],
        },
        {
          type: 'category',
          label: 'Application Signals',
          items: [
            'tools/application-signals/kotlin-signals',
          ],
        },
        'tools/metrics',
        'tools/rum',
        'tools/synthetics',
        'tools/slos',
        'tools/xray',
      ],
    }],
    recipes:[{
      type: 'category',
      label: 'Curated recipes',
      items: [
        'recipes/index',
        'recipes/dimensions',
        'recipes/telemetry',
        {
          type: 'category',
          label: 'By Compute',
          items: [
            'recipes/apprunner',
            'recipes/eks',
            'recipes/ecs',
            'recipes/lambda',
          ],
        },
        {
          type: 'category',
          label: 'By Infra & Databases',
          items: [
            'recipes/infra',
            {
              type: 'category',
              label: 'Databases',
              items: [
                'recipes/rds',
                'recipes/dynamodb',
                'recipes/msk',
              ],
            },
          ],
        },
        {
          type: 'category',
          label: 'By Language',
          items: [
            'recipes/java',
            'recipes/nodejs',
          ],
        },
        {
          type: 'category',
          label: 'By Destination',
          items: [
            'recipes/cw',
            'recipes/amp',
            'recipes/amg',
            'recipes/aes',
          ],
        },
        {
          type: 'category',
          label: 'Tasks',
          items: [
            'recipes/anomaly-detection',
            'recipes/alerting',
            'recipes/troubleshooting',
            'recipes/workshops',
          ],
        },
      ],
    }],
    faq:[{
      type: 'category',
      label: 'FAQ',
      items: [
        'faq/general',
        'faq/cloudwatch',
        'faq/x-ray',
        'faq/amp',
        'faq/amg',
        'faq/adot',
      ],
    }],
    patterns: [{type: 'autogenerated', dirName: 'patterns'}],
    persona: [{type: 'autogenerated', dirName: 'persona'}],
    resources: [{type: 'autogenerated', dirName: 'resources'}],
   // 'contributors',
//  },
};

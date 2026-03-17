/**
 * APM sidebar mirrors cw-apm-docs left nav structure.
 * @type {import('@docusaurus/plugin-content-docs').SidebarsConfig}
 */
module.exports = {
  apmSidebar: [
    {
      type: 'doc',
      id: 'index',
      label: 'APM Home',
    },
    {
      type: 'category',
      label: 'Overview',
      items: [
        'pages/getting-started',
        'pages/whats-new',
        'pages/release-notes',
      ],
    },
    {
      type: 'category',
      label: 'Implementation guides',
      items: [
        'pages/implementation',
      ],
    },
    {
      type: 'category',
      label: 'Features & capabilities',
      items: [
        'pages/auto-discovery',
        'pages/auto-instrumentation',
        'pages/dashboards',
        'pages/features',
        'pages/application-map',
        'pages/performance-analytics',
        'pages/searching-spans',
        'pages/slos',
        'pages/synthetic-monitoring',
        'pages/rum',
        'pages/generative-ai',
      ],
    },
    {
      type: 'category',
      label: 'Examples & code samples',
      items: ['pages/examples'],
    },
    {
      type: 'category',
      label: 'API reference',
      items: ['pages/api', 'pages/sdk-reference'],
    },
    {
      type: 'category',
      label: 'Best practices',
      items: ['pages/best-practices'],
    },
    {
      type: 'category',
      label: 'Troubleshooting',
      items: ['pages/troubleshooting', 'pages/debugging'],
    },
    {
      type: 'category',
      label: 'Security & compliance',
      items: ['pages/security'],
    },
    {
      type: 'category',
      label: 'Integrations',
      items: ['pages/integrations'],
    },
    {
      type: 'category',
      label: 'Reference',
      items: ['pages/reference'],
    },
  ],
};


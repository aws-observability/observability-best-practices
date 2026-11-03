/**
 * Resource data for the "re:Invent 2026 Cloud Operations Resources" guide.
 *
 * Each resource is ONE object. To add a link, copy a line and edit it. It shows
 * up in the matching content-type tab and topic filter automatically.
 *
 * type:        'video' | 'blog' | 'guide' | 'demo' | 'workshop' | 'training' | 'docs' | 'tool' | 'event'
 * topics:      any of 'observability' | 'ai-agents' | 'operations' | 'devops-agent' | 'cost' | 'resilience' | 'learning'
 * href:        full https:// URL for external links; site path starting with '/' for catalog
 *              entries (e.g. '/solutions/cw-omni-guide/'). Never link the legacy,
 *              unrendered trees listed in AGENTS.md; link the catalog entry instead.
 * source:      optional short provenance shown on the card (e.g. 'YouTube', 'Storylane').
 * description: optional one sentence (about 140 characters max).
 * isNew:       optional boolean, renders a "New" pill.
 *
 * Cards render in array order, so position controls ordering.
 */
const resources = [
  // Events and session recordings
  { title: 'AWS re:Invent 2026', href: 'https://aws.amazon.com/events/reinvent/', type: 'event', topics: ['learning'], source: 'AWS Events', description: 'The official AWS re:Invent event site: agenda, registration, and session catalog.' },
  { title: 'Cloud Operations sessions at AWS re:Invent 2025 (COP playlist)', href: 'https://www.youtube.com/playlist?list=PL2yQDdvlhXf8fUGVeljVNpQwugV7XBZRt', type: 'video', topics: ['learning', 'observability', 'operations'], source: 'YouTube', description: 'Breakout session playlist for the Cloud Operations (COP) track at AWS re:Invent 2025.' },
  { title: 'AWS Cloud Operations Show', href: 'https://www.youtube.com/playlist?list=PLehXSATXjcQHj8bPSf0uZuQBoxJ7a7ag7', type: 'video', topics: ['learning'], source: 'YouTube', description: 'Live stream recordings that dive deep into AWS Cloud Operations features and use cases.' },

  // Blogs and announcements
  { title: 'Introducing Amazon CloudWatch Omni: Observability for the AI Era', href: 'https://aws.amazon.com/blogs/mt/introducing-amazon-cloudwatch-omni-observability-for-the-ai-era/', type: 'blog', topics: ['observability'], source: 'AWS Blog', description: 'Announcement blog for CloudWatch Omni.' },
  { title: 'Collaborative AI-powered observability for your applications', href: 'https://aws.amazon.com/blogs/aws/introducing-amazon-cloudwatch-omni-collaborative-ai-powered-observability-for-your-applications/', type: 'blog', topics: ['observability'], source: 'AWS News Blog', description: 'How CloudWatch Omni brings collaborative, AI-powered observability to applications.' },
  { title: 'AI-powered observability for generative AI and agentic workloads', href: 'https://aws.amazon.com/blogs/aws/introducing-amazon-cloudwatch-omni-ai-powered-observability-for-generative-ai-and-agentic-workloads/', type: 'blog', topics: ['ai-agents', 'observability'], source: 'AWS News Blog', description: 'CloudWatch Omni for generative AI and agentic workloads.' },
  { title: 'CloudWatch Omni: AI-first observability for agents and applications', href: 'https://aws.amazon.com/about-aws/whats-new/2026/09/amazon-cloudwatch-omni-ai/', type: 'blog', topics: ['observability'], source: "What's New", description: "What's New post announcing CloudWatch Omni." },

  // Best-practices guides
  { title: 'Introducing Amazon CloudWatch Omni', href: '/solutions/cw-omni-guide/', type: 'guide', topics: ['observability'], source: 'Best Practices catalog', description: 'AI-powered, OpenTelemetry-based observability for AI agents, applications, and infrastructure.' },
  { title: 'GenAI Workload Observability', href: '/solutions/genai-observability/', type: 'guide', topics: ['ai-agents'], source: 'Best Practices catalog', description: 'Bedrock and SageMaker invocation monitoring, agent traces, and token and cost dashboards on CloudWatch.' },
  { title: 'Coding Agents Observability', href: '/solutions/coding-agents-observability/', type: 'guide', topics: ['ai-agents'], source: 'Best Practices catalog', description: 'OpenTelemetry-based telemetry for Claude Code, Codex, and Copilot developer fleets.' },
  { title: 'AWS Observability Best Practices', href: '/', type: 'guide', topics: ['observability'], source: 'Best Practices catalog', description: 'The home of this guide: best practices, patterns, and recipes for observability on AWS.' },
  { title: 'AWS Cloud Operations Best Practices', href: 'https://aws-samples.github.io/cloud-operations-best-practices/', type: 'guide', topics: ['operations'], source: 'Cloud Ops Best Practices', description: 'Recommended approaches for configuring and operating Cloud Operations workloads on AWS.' },
  { title: 'AWS CloudTrail Resources', href: 'https://aws-samples.github.io/cloud-operations-best-practices/docs/resources/cloudtrail-resources', type: 'guide', topics: ['operations'], source: 'Cloud Ops Best Practices', description: 'Curated resources for CloudTrail security practices, incident response, and monitoring.' },

  // AWS DevOps Agent
  { title: 'AWS DevOps Agent', href: 'https://aws.amazon.com/devops-agent/', type: 'docs', topics: ['devops-agent', 'operations', 'ai-agents'], source: 'AWS', description: 'Product page for AWS DevOps Agent, an always-available agent spanning software change and operations.' },
  { title: 'AWS DevOps Agent User Guide', href: 'https://docs.aws.amazon.com/devopsagent/latest/userguide/about-aws-devops-agent.html', type: 'docs', topics: ['devops-agent', 'operations'], source: 'AWS Documentation', description: 'How AWS DevOps Agent reviews releases and investigates and prevents operational issues.' },
  { title: 'AWS DevOps Agent helps you accelerate incident response and improve system reliability', href: 'https://aws.amazon.com/blogs/aws/aws-devops-agent-helps-you-accelerate-incident-response-and-improve-system-reliability-preview', type: 'blog', topics: ['devops-agent', 'operations'], source: 'AWS News Blog', description: 'Launch post introducing AWS DevOps Agent for incident response and reliability.' },

  // Interactive demos and sample applications
  { title: 'CloudWatch Omni clickthrough demos', href: 'https://aws-cloudops.storylane.io/hub/cw-omni', type: 'demo', topics: ['observability'], source: 'Storylane', description: 'Interactive clickthrough demos of CloudWatch Omni.' },
  { title: 'Cloud Operations interactive demos', href: 'https://aws-cloudops.storylane.io/hub/9ajhvqeu78kb', type: 'demo', topics: ['observability', 'operations'], source: 'Storylane', description: 'AWS Cloud Operations demos for monitoring and observability and cloud operations management.' },
  { title: 'Pet Adoptions sample application', href: 'https://github.com/aws-samples/one-observability-demo', type: 'demo', topics: ['observability', 'ai-agents'], source: 'GitHub', description: 'The One Observability sample application used to explore CloudWatch Omni end to end.' },
  { title: 'OpenTelemetry Astronomy Shop on EKS with CloudWatch', href: 'https://github.com/sunkavar/opentelemetry-demo/tree/otel-cw/eks-cloudwatch', type: 'demo', topics: ['observability'], source: 'GitHub', description: 'The OpenTelemetry demo application deployed on Amazon EKS and sending telemetry to CloudWatch.' },
  { title: 'Application Signals demo (Pet Clinic)', href: 'https://github.com/aws-observability/application-signals-demo', type: 'demo', topics: ['observability'], source: 'GitHub', description: 'A deployable Pet Clinic app showing how CloudWatch Application Signals works in practice.' },

  // Workshops and training
  { title: 'Upcoming Cloud Operations workshops', href: 'https://awsworkshop.io/browse?service=CloudOps', type: 'workshop', topics: ['learning', 'observability', 'operations'], source: 'AWS Workshops', description: 'Register for upcoming hands-on Cloud Operations workshops led by AWS experts.' },
  { title: 'One Observability Workshop', href: 'https://catalog.workshops.aws/observability/en-US', type: 'workshop', topics: ['observability', 'learning'], source: 'AWS Workshops', description: 'Hands-on, modular workshop covering the AWS monitoring and observability tool sets.' },
  { title: 'CloudWatch Omni foundational course', href: 'https://skillbuilder.aws/learn/NZDASJ5FBZ', type: 'training', topics: ['observability', 'learning'], source: 'AWS Skill Builder', description: 'Skill Builder course introducing CloudWatch Omni.' },
  { title: 'Cloud Operations Enablement events', href: 'https://aws-experience.com/amer/smb/events/series/Cloud-Operations-Enablement', type: 'event', topics: ['learning'], source: 'AWS Connected Community', description: 'Live webinars and workshops for anyone interested in cloud operations.' },

  // Docs and tools
  { title: 'Amazon CloudWatch Omni', href: 'https://aws.amazon.com/cloudwatch/omni/', type: 'docs', topics: ['observability'], source: 'Product page', description: 'CloudWatch Omni product page.' },
  { title: 'CloudWatch Omni pricing', href: 'https://aws.amazon.com/cloudwatch/omni/pricing/', type: 'docs', topics: ['cost', 'observability'], source: 'Pricing', description: 'Pricing details for CloudWatch Omni.' },
  { title: 'What is CloudWatch Omni', href: 'https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/cloudwatch-omni.html', type: 'docs', topics: ['observability'], source: 'AWS Docs', description: 'CloudWatch Omni user guide.' },
  { title: 'Set up Omni', href: 'https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/omni-set-up-omni.html', type: 'docs', topics: ['observability'], source: 'AWS Docs', description: 'Setup guide for CloudWatch Omni.' },
  { title: 'Amazon CloudWatch', href: 'https://aws.amazon.com/cloudwatch/', type: 'docs', topics: ['observability'], source: 'Product page', description: 'Amazon CloudWatch product page.' },
  { title: 'AWS Distro for OpenTelemetry (ADOT)', href: 'https://aws-otel.github.io/docs/introduction', type: 'docs', topics: ['observability'], source: 'ADOT docs', description: 'Guides for instrumenting code with ADOT to collect distributed traces and metrics.' },
  { title: 'OpenTelemetry', href: 'https://opentelemetry.io/', type: 'docs', topics: ['observability'], source: 'opentelemetry.io', description: 'The open standard CloudWatch Omni is built on.' },
  { title: 'OpenTelemetry Demo documentation', href: 'https://opentelemetry.io/docs/demo/', type: 'docs', topics: ['observability'], source: 'opentelemetry.io', description: 'Documentation for the OpenTelemetry Astronomy Shop demo application.' },
  { title: 'CloudWatch MCP server', href: 'https://awslabs.github.io/mcp/servers/cloudwatch-mcp-server', type: 'tool', topics: ['ai-agents', 'observability'], source: 'AWS MCP Servers', description: 'MCP server that gives AI assistants access to CloudWatch.' },
  { title: 'CloudWatch Application Signals MCP server', href: 'https://awslabs.github.io/mcp/servers/cloudwatch-applicationsignals-mcp-server', type: 'tool', topics: ['ai-agents', 'observability'], source: 'AWS MCP Servers', description: 'MCP server that gives AI assistants access to CloudWatch Application Signals.' },
  { title: 'CloudTrail MCP server', href: 'https://awslabs.github.io/mcp/servers/cloudtrail-mcp-server', type: 'tool', topics: ['ai-agents', 'operations'], source: 'AWS MCP Servers', description: 'MCP server that gives AI assistants access to AWS CloudTrail.' },
];

/*
 * PLACEHOLDER EXAMPLES: copy into the array above, then replace every <...> value
 * once the real link exists. Do not invent session codes or URLs.
 *
 * re:Invent 2026 session video:
 * { title: '<SESSION-CODE>: <Session title>', href: 'https://www.youtube.com/watch?v=<VIDEO_ID>', type: 'video', topics: ['observability'], source: 'YouTube', isNew: true, description: 'AWS re:Invent 2026 breakout session recording.' },
 *
 * Storylane demo:
 * { title: '<Demo title>', href: 'https://aws-cloudops.storylane.io/share/<DEMO_ID>', type: 'demo', topics: ['observability'], source: 'Storylane', isNew: true },
 */

export default resources;

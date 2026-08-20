# Content dispositions

Proposed disposition for every one of the 257 documents outside `docs/solutions/`
and `docs/events/`. Generated for review: veto or amend rows rather than
authoring them.

Companion to `MAPPING.md`, which records the ten clusters already converted.
`CONTRIBUTING.md` defines the entry format that FOLD targets refer to.

## Execution status (2026-08-20)

**The additive half is done. The deletions are deliberately deferred.**

28 new entries were authored from the content below, taking the catalog from
18 to 47 entries (28 solutions, 19 guides) with all seven workload chips
populated. Every entry validates, and the site builds with zero broken links.

| Wave | Entries | Covering |
|---|---|---|
| Solutions | 10 | cost management, cross-account, ADOT at scale, Managed Grafana, hybrid, Databricks, big data, frontend and SLO, WorkSpaces, Rust |
| Guides | 11 | strategy, maturity, adoption, dashboards, alarms, metrics and EMF, logs analysis, tracing, agent config, getting started, AI audit |
| Operations | 8 | CloudTrail (3), Config, Control Tower, patch and node management, JITNA, Organizations and Regions |

### Source files are retained on purpose

All 257 source files remain on disk. They are **inert**: the docs plugin is
scoped to `solutions/` and `events/`, so nothing under `guides/`, `recipes/`,
`tools/`, `patterns/`, `ai/`, `signals/`, `persona/`, `faq/`, or `resources/`
is rendered or reachable. Retaining them is a decision, not an oversight.

The reason is a ratio worth checking before anything is deleted:

> The 47 entries hold **45,701 words**. The 257 sources hold **320,985**.
> The catalog is **14%** of the source volume.

Much of that reduction is intended: cutting marketing prose, linking to AWS
Documentation instead of duplicating reference material, collapsing genuine
duplicates, and discarding stubs. One case is deliberate by instruction, the
21,000-word AI workload source distilled into a single guide.

But 14% is aggressive enough that agent-authored entries should be read by a
human before 275,000 words of source material is removed. Deletion is scheduled
as a separate change in a few weeks.

**Review the thinnest entries first**, since they carry the most compression
risk: `workspaces-monitoring` (401 words), `big-data-observability` (440),
`databricks-monitoring` (656), `cloudtrail-monitoring` (674, standing in for six
CloudTrail sources), `aws-config-compliance` (702).

### Corrections found while executing

- `recipes/java.md` (14 words) and `recipes/nodejs.md` (12 words) were recorded
  as NEW ENTRY but are stubs with no content to convert. Both become DROP.
  Java and Node.js entries would have to be written from scratch.
- Four further sources turned out to be unusable: `tools/adot-traces.md`
  contains only "todo", `tools/collector-arch.md` is empty,
  `tools/alerting_and_incident_management.md` is five words, and
  `guides/dashboards.md` is a 52-word heading skeleton.
- `recipes/dimensions.md` is about conceptual observability dimensions, not
  CloudWatch metric dimensions, so it did not fit `cloudwatch-metrics`.

## The five dispositions

| Disposition | Meaning |
|---|---|
| **NEW ENTRY** | Becomes its own catalog entry |
| **FOLD** | Content merges into an existing entry, at `entry-slug > Section` |
| **GUIDE** | Becomes a guide-type entry: advice, no deploy steps |
| **DROP** | No catalog home |
| **DUPLICATE** | Already captured by a converted entry |

Keep/Drop alone could not express the most common outcome. A page rarely
survives as a page; it survives as a *section* of an entry. That is why FOLD
names a target section, and why "badly formatted" source material stops being a
problem: the template dictates the shape.

## Totals

| Disposition | Files | Share |
|---|---|---|
| DROP | 64 | 25% |
| FOLD | 61 | 24% |
| DUPLICATE | 48 | 19% |
| GUIDE | 18 | 7% |
| NEW ENTRY | 14 | 5% |
| NEW ENTRY (operations) | 15 | 6% |
| Operations subtrees, sized not itemised | 37 | 14% |
| **Total** | **257** | |

What this means in practice:

- **112 files (44%) leave the rendered site without losing anything.** 48 are
  already converted; 64 are empty stubs, navigation landing pages, link lists
  that go stale, or conceptual primers with no AWS-specific guidance.
- **61 files fold into existing entries**, mostly into `Architecture`, `Deploy`,
  and `Guidance` sections.
- **32 new catalog entries are proposed** (14 solutions + 18 guides), taking the
  catalog from 19 to roughly 51 entries.
- **52 files were blocked on the `operations` chip decision** (15 recipes + 37
  guides). That decision is now APPROVED, so they are convertible; the tranche
  still needs writing and is the largest remaining piece of work.

## Decisions (resolved 2026-08-20)

**1. `operations` becomes a chip. APPROVED.** Yes — these are the quick filters
on the homepage, so the chip row is now: AI/ML, Compute, Applications, Data &
Streaming, Security & Compliance, Network, Operations. The value is active in
`taxonomy.yaml` with search synonyms, which unblocks all 52 operations files
(15 recipes + 37 guides). Those move from blocked to convertible; the tranche
still needs writing.

**2. dotnet duplication. RESOLVED — both sources are superseded.** Correct, the
collapsed entry is `/solutions/dotnet-application-monitoring/`, so
`guides/dotnet/oss/` and `guides/dotnet/open-source/` are both DUPLICATE against
it and the "which wins" question is moot for navigation.

One caveat worth knowing: the entry was written from `aws-native/*` plus
`oss/opentelemetry.md`. It did not draw on `open-source/`, which is the longer
and more complete of the two source trees. So the entry may be thinner than the
best available material. Flagged as a content-quality follow-up, not a blocker.

**3. `guides/index.md` kept. APPROVED as GUIDE** — see decision 6, it is folding
into the strategy guide rather than standing alone.

**4. `ai/aiops/index.md` dropped. CONFIRMED.**

**5. `signals/` dropped, all six. CONFIRMED.**

**6. Strategy guide consolidated.** Decisions 3 and 6 combine into a single
high-level guide rather than two thin ones:

| Slug | `observability-strategy` |
|---|---|
| Type | guide |
| workload_type | `applications` (cross-cutting; no domain chip fits) |
| Sources | `guides/index.md` (~1500 words of best-practice overview), `persona/leader_manager.md` (ROI and KPI material), `guides/operational/business/monitoring-for-business-outcomes.md`, `guides/operational/business/sla-percentile.md` |
| Sections | Overview, When to use this, Guidance, Related |

`guides/observability-maturity-model.md` stays a separate guide. It is a
staged assessment model with its own structure, and folding it into a strategy
overview would bury it. `guides/strategy.md` remains DROP — it is a 4-word stub,
not related content.

This also rescues `persona/leader_manager.md`, which was the one `persona/` file
with material worth keeping.

## Images: a correction to earlier conversions

The first ten conversions stripped every image and substituted ASCII diagrams,
because the conversion instructions said to avoid image references in case they
did not resolve. That traded real content for a green build and was wrong.

**107 image references were dropped.** 36 have been restored across the 9 entries
whose sources had usable visuals, all verified to resolve:

| Entry | Images |
|---|---|
| eks-container-insights | 5 |
| lambda-monitoring | 5 |
| network-observability | 5 |
| ecs-monitoring | 4 |
| eks-infrastructure | 4 |
| rds-aurora-monitoring | 4 |
| genai-observability | 3 |
| opensearch-monitoring | 1 |

Selection favoured one architecture diagram plus screenshots in `Validate` that
show what success looks like, capped at six per entry rather than carrying over
every console capture. The remaining ten entries have no images because their
sources had none.

`CONTRIBUTING.md` now carries an explicit images rule, including the resolved
paths from an entry directory, so future conversions preserve visuals. An ASCII
diagram is an acceptable addition for signal flow, never a replacement for a
real diagram that already exists.

## Proposed new entry slugs

Solutions: `observability-cost-management`, `cross-account-observability`,
`adot-at-scale`, `managed-grafana-setup`, `hybrid-monitoring`,
`databricks-monitoring`, `big-data-observability`, `frontend-slo-monitoring`,
`security-log-analytics`

Guides: `observability-strategy`, `observability-maturity-model`,
`choosing-a-tracing-agent`, `observability-kpis-slos`,
`observability-adoption-guide`, `ai-workload-audit-monitoring`

Any slug used as a FOLD target is either an existing entry or listed above;
this was checked mechanically across all 62 FOLD targets.

## How to review

Scan the Disposition column. Most rows are mechanical. Focus on:
- rows marked `(UNSURE: ...)`, where the call genuinely could go either way
- every `NEW ENTRY` and `GUIDE`, since each one commits somebody to writing it
- any `DROP` you disagree with, since that is the only irreversible column

---


# Tools and patterns

## Disposition: docs/tools/ and docs/patterns/

## docs/tools/ (25 files)

| Path | Title | Disposition | Notes |
|------|-------|-------------|-------|
| tools/adot-traces.md | Tracing with ADOT | DROP | Stub file — contains only "todo" |
| tools/alarms.md | Alarms | GUIDE | Proposed slug: `cloudwatch-alarms-guide`, workload_type: compute; cross-cutting alarm best practices |
| tools/alerting_and_incident_management.md | Alerting and incident management | DROP | Empty stub — title only |
| tools/amp.md | Amazon Managed Service for Prometheus | FOLD: eks-container-insights > Related Solutions | AMP overview; most relevant to EKS metrics pipeline |
| tools/application-signals/kotlin-signals.md | Application Signals for Kotlin Services | FOLD: eks-application-signals > Deploy | EC2-based Kotlin instrumentation via Application Signals |
| tools/cloudwatch_agent.md | CloudWatch Agent | GUIDE | Proposed slug: `cloudwatch-agent-guide`, workload_type: compute; deployment/config advice applicable across workloads |
| tools/cloudwatch-dashboard.md | CloudWatch Dashboard | GUIDE (`cloudwatch-dashboards`) | Reassigned: ec2-monitoring dropped. The UNSURE alternative becomes the call |
| tools/collector-arch.md | (empty) | DROP | Known-empty per rules |
| tools/dashboards.md | Dashboards | GUIDE | Proposed slug: `dashboard-design-guide`, workload_type: compute; general dashboard best-practice guidance |
| tools/emf.md | Embedded Metric Format | FOLD: lambda-monitoring > Architecture | EMF primarily used in Lambda/serverless context |
| tools/internet_monitor.md | Internet Monitor | FOLD: network-observability > Guidance | Internet monitoring for network-traversing apps |
| tools/logs/contributor_insights/contributor_insights.md | CloudWatch Contributor Insights | FOLD: cloudwatch-logs-security > Guidance | Reassigned: ec2-monitoring dropped. Contributor Insights is log analysis |
| tools/logs/dataprotection/data-protection-policies.md | CloudWatch Logs Data Protection Policies for SLG/EDU | FOLD: cloudwatch-logs-security > Guidance | Data masking / protection for log groups |
| tools/logs/index.md | Logging | GUIDE | Proposed slug: `cloudwatch-logs-guide`, workload_type: compute; CW agent logging best practices |
| tools/logs/logs-insights-examples.md | CloudWatch Logs Insights Example Queries | GUIDE | Proposed slug: `logs-insights-queries-guide`, workload_type: compute; query cookbook |
| tools/logs/security/cloudwatch-logs-security-best-practices.md | Security Best Practices for CloudWatch Logs | DUPLICATE | Winner: cloudwatch-logs-security |
| tools/logs/security/querying_security_lake_with_cloudwatch_uds.md | Querying Historical Security Lake Data with Amazon CloudWatch Logs Using Athena | DUPLICATE | Winner: security-lake-cloudwatch |
| tools/logs/security/s3-server-access-logs-security-compliance.mdx | Amazon S3 server access logs for Security, Compliance & Auditing | DUPLICATE | Winner: s3-access-logs-security |
| tools/logs/security/waf-security-analysis-with-cloudwatch.md | AWS WAF Security Analysis with CloudWatch | DUPLICATE | Winner: waf-security-analysis |
| tools/metrics.md | Metrics | GUIDE | Proposed slug: `cloudwatch-metrics-guide`, workload_type: compute; general metrics best practices |
| tools/observability_accelerator.md | AWS Observability Accelerator | FOLD: eks-container-insights > Related Solutions | EKS-focused accelerator for Terraform/CDK |
| tools/rum.md | Real User Monitoring | NEW ENTRY | Proposed slug: `frontend-slo-monitoring`, workload_type: applications; candidate alongside SLOs and Synthetics |
| tools/slos.md | Service Level Objectives (SLOs) | FOLD: frontend-slo-monitoring > Overview | Core SLO concepts; folds into the proposed frontend-slo-monitoring entry |
| tools/synthetics.md | Synthetic testing | FOLD: frontend-slo-monitoring > Deploy | Canary testing; folds into frontend-slo-monitoring |
| tools/xray.md | AWS X-Ray | GUIDE | Proposed slug: `xray-sampling-guide`, workload_type: applications; sampling-rule advice applicable across workloads |

## docs/patterns/ (20 files)

| Path | Title | Disposition | Notes |
|------|-------|-------------|-------|
| patterns/adoteksfargate.md | CloudWatch Container Insights | FOLD: eks-container-insights > Architecture | ADOT + CI on EKS Fargate |
| patterns/ampagentless.md | Pushing Metrics from EKS to Prometheus | FOLD: eks-container-insights > Deploy | AMP managed collector for EKS |
| patterns/ampxa.md | Amazon Managed Prometheus Cross Account Scraping | FOLD: cross-account-observability > Architecture | Cross-account AMP scraping setup |
| patterns/apmappsignals.md | APM with Application Signals | FOLD: eks-application-signals > Overview | Application Signals overview and capabilities |
| patterns/ecsampamg.md | Monitoring ECS Workloads | FOLD: ecs-monitoring > Architecture | ECS with ADOT, X-Ray, and AMP |
| patterns/eksampamg.md | EKS Monitoring with AWS Open source service | FOLD: eks-infrastructure > Architecture | Node Exporter + AMP + Grafana on EKS |
| patterns/lambdalogging.md | Lambda Logging | FOLD: lambda-monitoring > Architecture | Lambda → CloudWatch Logs pattern |
| patterns/multiaccount.md | Cross account Monitoring with AWS Native services | NEW ENTRY | Proposed slug: `cross-account-observability`, workload_type: compute; AWS-native multi-account pattern |
| patterns/multiaccountoss.md | Cross account monitoring with AWS Open source service | FOLD: cross-account-observability > Architecture | OSS variant (ADOT + AMP + Grafana) folds into cross-account-observability |
| patterns/o11ypipeline.md | ADOT Observability Pipeline | FOLD: eks-container-insights > Deploy | ADOT operator Helm-based pipeline on EKS (UNSURE: could be adot-at-scale NEW ENTRY) |
| patterns/opensearch.md | Opensearch Logging on AWS | FOLD: opensearch-monitoring > Architecture | Log pipeline to OpenSearch from ECS/EKS/EC2 |
| patterns/otel.md | Observability with OpenTelemetry | FOLD: eks-container-insights > Architecture | General OTel overview with EKS focus |
| patterns/sparkbigdata.md | Big Data Observability on AWS | NEW ENTRY | Proposed slug: `big-data-observability`, workload_type: data-streaming; EMR/Spark observability pattern |
| patterns/Startup Observability Adoption/Anti-patterns and common pitfalls.md | Anti-patterns and common pitfalls | GUIDE | Proposed slug: `observability-adoption-guide`, workload_type: compute; startup anti-patterns |
| patterns/Startup Observability Adoption/Startup Observability Adoption Stages.md | Startup Observability Adoption Stages | FOLD: observability-adoption-guide > Guidance | Staged maturity model; folds into the guide above |
| patterns/Tracing/xrayec2.md | EC2 Tracing with AWS X-Ray | FOLD: ec2-nginx > Architecture | Reassigned: ec2-monitoring dropped. ec2-nginx is the remaining EC2 entry |
| patterns/Tracing/xrayecs.md | ECS Tracing with AWS X-Ray | FOLD: ecs-monitoring > Architecture | X-Ray tracing on ECS |
| patterns/Tracing/xrayeks.md | EKS Tracing with AWS X-Ray | FOLD: eks-container-insights > Architecture | X-Ray tracing on EKS |
| patterns/Tracing/xraylambda.md | Lambda Tracing with AWS X-Ray | FOLD: lambda-monitoring > Architecture | X-Ray tracing on Lambda |
| patterns/vpcflowlogs.md | VPC Flow Logs for Network Observability | FOLD: network-observability > Architecture | VPC Flow Logs pattern with Grafana visualization |

## Disposition Tally

| Disposition | Count |
|-------------|-------|
| FOLD | 27 |
| GUIDE | 8 |
| DROP | 3 |
| DUPLICATE | 4 |
| NEW ENTRY | 3 |
| **Total** | **45** |

### NEW ENTRY slugs proposed
- `frontend-slo-monitoring` (workload_type: applications) — absorbs rum.md, slos.md, synthetics.md
- `cross-account-observability` (workload_type: compute) — absorbs multiaccount.md, multiaccountoss.md, ampxa.md
- `big-data-observability` (workload_type: data-streaming) — from sparkbigdata.md

---

# Recipes

## Disposition: docs/recipes/

| Path | Title | Disposition | Notes |
|------|-------|-------------|-------|
| recipes/index.md | Recipes | DROP | Thin landing page with links; replaced by catalog index |
| recipes/dimensions.md | Dimensions | DROP | Conceptual overview of o11y space dimensions; no actionable recipe content |
| recipes/telemetry.md | Telemetry | DROP | Conceptual overview of telemetry agents/sources; no actionable recipe |
| recipes/infra.md | Infrastructure & Databases | DROP | Link list landing page with no substantive content |
| recipes/cw.md | Amazon CloudWatch | DROP | Link list landing page; links point to external blogs/workshops |
| recipes/amp.md | Amazon Managed Service for Prometheus | DROP | Link list landing page; links point to child recipes and external blogs |
| recipes/amg.md | Amazon Managed Grafana | DROP | Link list landing page; individual AMG recipes handled separately |
| recipes/alerting.md | Alerting | DROP | Single external link; no substantive content |
| recipes/anomaly-detection.md | Anomaly Detection | DROP | Single external link; no substantive content |
| recipes/troubleshooting.md | Troubleshooting | DROP | Single external link; no substantive content |
| recipes/workshops.md | Workshops | DROP | Link list to external workshops; overlaps with /events/ |
| recipes/aes.md | Amazon OpenSearch Service | DUPLICATE | opensearch-monitoring — link list landing page, content migrated |
| recipes/msk.md | Amazon Managed Streaming for Apache Kafka | DUPLICATE | msk-monitoring — link list landing page, content migrated |
| recipes/rds.md | Amazon Relational Database Service | DUPLICATE | rds-aurora-monitoring — link list landing page, content migrated |
| recipes/ecs.md | Amazon Elastic Container Service | DUPLICATE | ecs-monitoring — link list landing page, content migrated |
| recipes/eks.md | Amazon Elastic Kubernetes Service | FOLD: eks-infrastructure > Related Solutions | Link list; substantive EKS recipes fold individually |
| recipes/lambda.md | AWS Lambda | FOLD: lambda-monitoring > Related Solutions | Link list landing with pointers to Lambda observability |
| recipes/dynamodb.md | Amazon DynamoDB | FOLD: rds-aurora-monitoring > Related Solutions | Link list; DynamoDB monitoring links (UNSURE: no dedicated DynamoDB entry exists; closest is rds-aurora) |
| recipes/apprunner.md | AWS App Runner | FOLD: ecs-monitoring > Related Solutions | Compute service recipes covering logs/metrics/traces for containerized apps |
| recipes/java.md | Java | NEW ENTRY | slug: java-application-monitoring, workload_type: applications, solution. Single link currently but mirrors dotnet-application-monitoring pattern |
| recipes/nodejs.md | Node.js | NEW ENTRY | slug: nodejs-application-monitoring, workload_type: applications, solution. Single link; mirrors dotnet-application-monitoring pattern |
| recipes/eks-gpu-cost-attribution.md | EKS cluster wide GPU Cost Attribution | NEW ENTRY | slug: observability-cost-management, workload_type: compute, solution. GPU cost allocation PoC |
| recipes/recipes/msk-monitoring-with-managed-collector.md | Monitoring Amazon MSK with AWS Managed Collector | DUPLICATE | msk-monitoring — this IS the converted entry source |
| recipes/recipes/opensearch-monitoring-with-managed-collector.md | Monitoring Amazon OpenSearch Service with AWS Managed Collector | DUPLICATE | opensearch-monitoring — this IS the converted entry source |
| recipes/recipes/amg-athena-plugin.md | Using Athena in Amazon Managed Grafana | NEW ENTRY | slug: managed-grafana-setup, workload_type: applications, solution. Section: Athena plugin |
| recipes/recipes/amg-automation-tf.md | Using Terraform for Amazon Managed Grafana automation | FOLD: managed-grafana-setup > Deploy | Terraform automation for AMG workspace provisioning |
| recipes/recipes/amg-redshift-plugin.md | Using Redshift in Amazon Managed Grafana | FOLD: managed-grafana-setup > Deploy | Redshift data source plugin configuration |
| recipes/recipes/amg-google-auth-saml.md | Configure Google Workspaces authentication with AMG using SAML | FOLD: managed-grafana-setup > Deploy | SAML auth setup for AMG |
| recipes/recipes/amg-subnet-free-ip-monitoring.md | Monitoring Free IP in Subnet | FOLD: network-observability > Deploy | CDK-based Lambda + CW dashboard for VPC subnet IP monitoring |
| recipes/recipes/amp-alertmanager-terraform.md | Terraform to deploy AMP and configure Alert Manager | FOLD: eks-infrastructure > Deploy | AMP + alertmanager provisioning via Terraform with ADOT on EKS |
| recipes/recipes/amp-mixin-dashboards.md | Adding kubernetes-mixin dashboards to Managed Grafana | FOLD: managed-grafana-setup > Deploy | Prometheus community mixin dashboards for EKS in AMG |
| recipes/recipes/as-ec2-using-amp-and-alertmanager.md | Auto-scaling Amazon EC2 using AMP and alert manager | FOLD: ec2-nginx > Deploy | Reassigned: ec2-monitoring dropped. EC2 autoscaling via AMP alert manager |
| recipes/recipes/ec2-eks-metrics-go-adot-ampamg.md | Using ADOT in EKS on EC2 with AMP | FOLD: eks-infrastructure > Deploy | ADOT collector on EKS EC2 ingesting to AMP, visualizing in AMG |
| recipes/recipes/fargate-eks-metrics-go-adot-ampamg.md | Using ADOT in EKS on Fargate with AMP | FOLD: eks-infrastructure > Deploy | ADOT collector on EKS Fargate ingesting to AMP |
| recipes/recipes/fargate-eks-xray-go-adot-amg.md | Using ADOT in EKS on Fargate with AWS X-Ray | FOLD: eks-infrastructure > Deploy | ADOT tracing on EKS Fargate with X-Ray, AMG visualization |
| recipes/recipes/lambda-cw-metrics-go-amp.md | Exporting CloudWatch Metric Streams via Firehose and Lambda to AMP | FOLD: lambda-monitoring > Deploy | CW Metric Streams → Firehose → Lambda → AMP pipeline |
| recipes/recipes/metrics-explorer-filter-by-tags.md | Using CW Metrics explorer to filter by tags | DROP | Reassigned: ec2-monitoring dropped. The UNSURE alternative becomes the call; lightweight console walkthrough |
| recipes/recipes/monitoring-hybridenv-amg.md | Monitoring hybrid environments using AMG | NEW ENTRY | slug: hybrid-monitoring, workload_type: compute, solution. Azure Monitor plugin in AMG + alerting |
| recipes/recipes/servicemesh-monitoring-ampamg.md | Using AMP to monitor App Mesh on EKS | FOLD: eks-infrastructure > Deploy | App Mesh Envoy metrics via Grafana Agent to AMP |
| recipes/recipes/Workspaces-Monitoring-AMP-AMG/README.md | Monitoring Amazon Workspaces with AMP and AMG | NEW ENTRY (`workspaces-monitoring`, compute) | Reassigned: ec2-monitoring dropped. The UNSURE alternative becomes the call |
| recipes/application-operations/index.md | Application Operations | NEW ENTRY (operations, pending) | 4-word stub "Coming Soon"; operations content, blocked on workload_type decision |
| recipes/centralized-operations-management/index.md | Centralized Operations Management | NEW ENTRY (operations, pending) | Landing page for JITNA, patch reporting, Run Command recipes; blocked |
| recipes/centralized-operations-management/just-in-time-node-access/index.md | Just-in-time node access (JITNA) | NEW ENTRY (operations, pending) | SSM JITNA overview; blocked |
| recipes/centralized-operations-management/just-in-time-node-access/enable-using-iac.mdx | Enable JITNA using IaC | NEW ENTRY (operations, pending) | CloudFormation deployment of JITNA in AWS Orgs; blocked |
| recipes/centralized-operations-management/just-in-time-node-access/event-driven-requests.mdx | EventBridge integration with JITNA | NEW ENTRY (operations, pending) | EventBridge events for JITNA session requests; blocked |
| recipes/centralized-operations-management/just-in-time-node-access/policy-examples.md | JITNA Cedar policy examples | NEW ENTRY (operations, pending) | Cedar IAM policy samples for JITNA; blocked |
| recipes/centralized-operations-management/patch-reporting/index.md | Centralized patch compliance reporting | NEW ENTRY (operations, pending) | SSM Patch Manager + Athena + QuickSight reporting; blocked |
| recipes/centralized-operations-management/pwsh-run-command-custom-credentials/index.md | Invoking PowerShell commands as custom Windows user in Run Command | NEW ENTRY (operations, pending) | SSM Run Command with Secrets Manager credentials; blocked |
| recipes/cloudtrail/index.md | AWS CloudTrail | NEW ENTRY (operations, pending) | CloudTrail landing page with security/cost links; blocked |
| recipes/cloudtrail/CloudTrail Security/index.md | Security Incident Response and Forensic Analysis | NEW ENTRY (operations, pending) | CloudTrail for security forensics overview; blocked |
| recipes/cloudtrail/CloudTrail Security/best-practice-security-forensics.mdx | Best Practices for Security Forensics | NEW ENTRY (operations, pending) | Comprehensive CloudTrail security best practices; blocked |
| recipes/cloudtrail/CloudTrail Security/event-fields.mdx | Understand the Security Importance of CloudTrail Event Fields | NEW ENTRY (operations, pending) | CloudTrail event field reference for forensics; blocked |
| recipes/cloudtrail/cloudwatch-logs-ingestion-cost/index.md | Estimating Cost: CloudTrail Trails to CW Logs Ingestion | NEW ENTRY (operations, pending) | Cost estimation guide for CloudTrail → CW Logs migration; blocked |
| recipes/cloudtrail/data-events-estimate-cost/index.md | Estimating CloudTrail Data Event Costs | NEW ENTRY (operations, pending) | CUR-based cost estimation for data events; blocked |
| recipes/cloudtrail/logs-transformation-best-practices/index.md | CloudTrail Enrichment with CW Logs Transformation | NEW ENTRY (operations, pending) | CW Logs Transformation for CloudTrail enrichment; blocked |

## Disposition Tally

| Disposition | Count |
|-------------|-------|
| DROP | 11 |
| DUPLICATE | 6 |
| FOLD | 18 |
| NEW ENTRY | 5 |
| NEW ENTRY (operations, pending) | 15 |
| **Total** | **55** |

---

# Guides (excluding operations subtrees)

## Disposition: guides (core, non-cloud-operations)

Generated: 2026-08-20

---

### guides/ (top-level)

| Path | Title | Disposition | Notes |
|------|-------|-------------|-------|
| guides/index.md | Best practices overview | GUIDE | Slug: observability-strategy, workload_type: applications. Substantive (1508w), covers 5 best practices pillars. |
| guides/apm.md | Application Performance Monitoring | DROP | Empty stub (4 words, title only) |
| guides/full-stack.md | Full-stack | DROP | Empty stub (2 words, title only) |
| guides/strategy.md | Creating an observability strategy | DROP | Empty stub (5 words, title only) |
| guides/dashboards.md | Dashboarding | DROP | Near-empty stub (52w), headings only, no substance |
| guides/ec2-monitoring.md | EC2 Monitoring and Observability | DROP | Owner: "quite old, no value at all". The converted entry was also dropped |
| guides/choosing-a-tracing-agent.md | Choosing a tracing agent | GUIDE | Slug: choosing-a-tracing-agent, workload_type: applications. Decision advice on ADOT vs X-Ray SDK (444w). |
| guides/cloudwatch_cross_account_observability.md | CloudWatch Cross-Account Observability | NEW ENTRY | Slug: cross-account-observability, workload_type: applications, type: solution. Step-by-step tutorial (3299w). |
| guides/hybrid-and-multicloud.md | Best practices for hybrid and multicloud | NEW ENTRY | Slug: hybrid-monitoring, workload_type: applications, type: guide. Advisory best practices (1966w). |
| guides/observability-maturity-model.md | AWS Observability Maturity Model | GUIDE | Slug: observability-maturity-model, workload_type: applications. Framework/advisory content (3208w). |

### guides/getting-started/

| Path | Title | Disposition | Notes |
|------|-------|-------------|-------|
| guides/getting-started/setup-monitoring-source-accounts.md | Setup Monitoring and Source Accounts | FOLD: cross-account-observability > Overview | Onboarding walkthrough pointing to cross-account setup (439w) |
| guides/getting-started/setup-unified-data-store.md | Setup Unified Data Store | FOLD: cross-account-observability > Deploy | CloudWatch Unified Data Store setup (476w) |
| guides/getting-started/configure-agents-collectors.md | Configure Agents/Collectors | GUIDE | Slug: observability-strategy, workload_type: applications. High-level onboarding advice (531w). (UNSURE: could be part of cross-account-observability > Deploy) |
| guides/getting-started/dashboards-alerts.md | Dashboards and Alerts | GUIDE | Slug: observability-strategy, workload_type: applications. Onboarding advice on dashboards (360w). (UNSURE: thin, could DROP) |

### guides/databases/

| Path | Title | Disposition | Notes |
|------|-------|-------------|-------|
| guides/databases/rds-and-aurora.md | RDS and Aurora Monitoring | DUPLICATE | Winner: rds-aurora-monitoring entry (already converted, 2623w) |
| guides/databases/DBI.md | Database Insights (DBI) | DUPLICATE | Winner: rds-aurora-monitoring entry (already converted, 2169w) |

### guides/containers/aws-native/ecs/

| Path | Title | Disposition | Notes |
|------|-------|-------------|-------|
| guides/containers/aws-native/ecs/best-practices-metrics-collection-1.md | Collecting system metrics with Container Insights | DUPLICATE | Winner: ecs-monitoring entry (747w) |
| guides/containers/aws-native/ecs/best-practices-metrics-collection-2.md | Collecting service metrics with Container Insights | DUPLICATE | Winner: ecs-monitoring entry (814w) |
| guides/containers/aws-native/ecs/cost-optimization.md | (empty) | DROP | Empty stub (0 words, confirmed in rules) |
| guides/containers/aws-native/ecs/resource-optimization.md | (empty) | DROP | Empty stub (0 words, confirmed in rules) |

### guides/containers/aws-native/eks/

| Path | Title | Disposition | Notes |
|------|-------|-------------|-------|
| guides/containers/aws-native/eks/amazon-cloudwatch-container-insights.md | Amazon CloudWatch Container Insights | DUPLICATE | Winner: eks-container-insights entry (3477w) |
| guides/containers/aws-native/eks/container-tracing-with-aws-xray.md | Container Tracing with AWS X-Ray | DUPLICATE | Winner: eks-container-insights entry (1767w) |
| guides/containers/aws-native/eks/eks-api-server-monitoring.md | Amazon EKS API Server Monitoring | DUPLICATE | Winner: eks-container-insights entry (2679w) |
| guides/containers/aws-native/eks/log-aggregation.md | Log Aggregation | DUPLICATE | Winner: eks-container-insights entry (3402w) |

### guides/containers/oss/ecs/

| Path | Title | Disposition | Notes |
|------|-------|-------------|-------|
| guides/containers/oss/ecs/best-practices-metrics-collection-1.md | Collecting system metrics with ADOT on ECS | DUPLICATE | Winner: ecs-monitoring entry (1170w) |
| guides/containers/oss/ecs/best-practices-metrics-collection-2.md | Collecting service metrics with ADOT on ECS | DUPLICATE | Winner: ecs-monitoring entry (1022w) |
| guides/containers/oss/ecs/best-practices-metrics-collection.md | (empty) | DROP | Empty stub (0 words, confirmed in rules) |

### guides/containers/oss/eks/

| Path | Title | Disposition | Notes |
|------|-------|-------------|-------|
| guides/containers/oss/eks/best-practices-metrics-collection.md | EKS Observability: Essential Metrics | FOLD: eks-infrastructure > Overview | OSS EKS metrics guidance (2683w). Fits eks-infrastructure entry. |
| guides/containers/oss/eks/cost-optimization.md | (empty) | DROP | Empty stub (0 words, confirmed in rules) |
| guides/containers/oss/eks/keda-amp-eks.md | Autoscaling applications using KEDA on AMP and EKS | FOLD: eks-infrastructure > Deploy | KEDA + AMP autoscaling recipe (447w) |
| guides/containers/oss/eks/resource-optimization.md | Resource Optimization best practices for Kubernetes | FOLD: eks-infrastructure > Guidance | Kubernetes right-sizing guide (1096w). (UNSURE: could be NEW ENTRY or GUIDE for cost) |

### guides/cost/

| Path | Title | Disposition | Notes |
|------|-------|-------------|-------|
| guides/cost/cost-visualization/cost.md | AWS Observability services and Cost | NEW ENTRY | Slug: observability-cost-management, workload_type: applications, type: solution. Umbrella/intro for cost cluster (558w). |
| guides/cost/cost-visualization/amazon-cloudwatch.md | Amazon CloudWatch cost visualization | FOLD: observability-cost-management > Deploy | CUR + Athena view for CloudWatch costs (425w) |
| guides/cost/cost-visualization/amazon-grafana.md | Amazon Managed Grafana cost visualization | FOLD: observability-cost-management > Deploy | CUR + Athena view for AMG costs (201w) |
| guides/cost/cost-visualization/amazon-prometheus.md | Amazon Managed Service for Prometheus cost (real-time) | FOLD: observability-cost-management > Deploy | Vended metrics + Grafana dashboard for AMP costs (356w) |
| guides/cost/cost-visualization/AmazonManagedServiceforPrometheus.md | Amazon Managed Service for Prometheus cost (CUR) | FOLD: observability-cost-management > Deploy | CUR + Athena view for AMP costs (437w) |
| guides/cost/cost-visualization/aws-xray.md | AWS X-Ray cost visualization | FOLD: observability-cost-management > Deploy | CUR + Athena view for X-Ray costs (185w) |
| guides/cost/cost-visualization/reducing-cw-cost.md | Reducing CloudWatch cost | FOLD: observability-cost-management > Guidance | Actionable cost-reduction tips for CW (1071w) |
| guides/cost/kubecost.md | Using Kubecost | FOLD: observability-cost-management > Deploy | Kubecost on EKS for container cost visibility (1571w) |
| guides/cost/OLA-EC2-righsizing.md | OLA for Existing EC2 Workloads | FOLD: observability-cost-management > Guidance | AWS OLA program for EC2 right-sizing (2002w). (UNSURE: more about licensing/migration than observability cost) |

### guides/dotnet/aws-native/

| Path | Title | Disposition | Notes |
|------|-------|-------------|-------|
| guides/dotnet/aws-native/logs.md | Logs (.NET aws-native) | DUPLICATE | Winner: dotnet-application-monitoring entry |
| guides/dotnet/aws-native/metrics.md | Metrics (.NET aws-native) | DUPLICATE | Winner: dotnet-application-monitoring entry |
| guides/dotnet/aws-native/traces.md | Traces (.NET aws-native) | DUPLICATE | Winner: dotnet-application-monitoring entry |

### guides/dotnet/oss/

| Path | Title | Disposition | Notes |
|------|-------|-------------|-------|
| guides/dotnet/oss/opentelemetry.md | OpenTelemetry with .NET (oss) | DUPLICATE | Winner: dotnet-application-monitoring entry. oss/ is the shorter version (1194w total); open-source/ wins. |
| guides/dotnet/oss/logs.md | Logs (.NET oss) | DUPLICATE | Winner: dotnet-application-monitoring entry. oss/ is shorter; open-source/ wins. |
| guides/dotnet/oss/metrics.md | Metrics (.NET oss) | DUPLICATE | Winner: dotnet-application-monitoring entry. oss/ is shorter; open-source/ wins. |
| guides/dotnet/oss/traces.md | Traces (.NET oss) | DUPLICATE | Winner: dotnet-application-monitoring entry. oss/ is shorter; open-source/ wins. |

### guides/dotnet/open-source/

| Path | Title | Disposition | Notes |
|------|-------|-------------|-------|
| guides/dotnet/open-source/opentelemetry.md | OpenTelemetry with .NET (open-source) | DUPLICATE | Winner: dotnet-application-monitoring entry. open-source/ is the winning variant (1812w total). |
| guides/dotnet/open-source/logs.md | Logs (.NET open-source) | DUPLICATE | Winner: dotnet-application-monitoring entry. open-source/ is the winning variant. |
| guides/dotnet/open-source/metrics.md | Metrics (.NET open-source) | DUPLICATE | Winner: dotnet-application-monitoring entry. open-source/ is the winning variant. |
| guides/dotnet/open-source/traces.md | Traces (.NET open-source) | DUPLICATE | Winner: dotnet-application-monitoring entry. open-source/ is the winning variant. |

### guides/network-observation/

| Path | Title | Disposition | Notes |
|------|-------|-------------|-------|
| guides/network-observation/cloudwatch/flow-monitor.md | What is Network Flow Monitor? | DUPLICATE | Winner: network-observability entry (1003w) |
| guides/network-observation/cloudwatch/internet-monitor.md | What is Internet Monitor? | DUPLICATE | Winner: network-observability entry (668w) |
| guides/network-observation/cloudwatch/synthetic-monitor.md | What is Network Synthetic Monitor? | DUPLICATE | Winner: network-observability entry (356w) |
| guides/network-observation/comprehensive-solutions/east-west-traffic.md | East-West Traffic | DUPLICATE | Winner: network-observability entry. "Coming soon" placeholder (10w). |
| guides/network-observation/comprehensive-solutions/north-south-traffic.md | North-South Traffic | DUPLICATE | Winner: network-observability entry. "Coming soon" placeholder (10w). |
| guides/network-observation/network-manager/infrastructure-performance.md | What is Infrastructure Performance? | DUPLICATE | Winner: network-observability entry (433w) |
| guides/network-observation/network-manager/reachability-analyzer.md | What is Reachability Analyzer? | DUPLICATE | Winner: network-observability entry (401w) |

### guides/serverless/

| Path | Title | Disposition | Notes |
|------|-------|-------------|-------|
| guides/serverless/aws-native/lambda-based-observability.md | AWS Lambda based Serverless Observability | DUPLICATE | Winner: lambda-monitoring entry (3696w) |
| guides/serverless/oss/lambda-based-observability-adot.md | Lambda Observability with OpenTelemetry | DUPLICATE | Winner: lambda-monitoring entry (1751w) |

### guides/operational/

| Path | Title | Disposition | Notes |
|------|-------|-------------|-------|
| guides/operational/observability-driven-dev.md | (empty) | DROP | Empty stub (0 words, confirmed in rules) |
| guides/operational/alerts/amg-alerts.md | (empty) | DROP | Empty stub (0 words, confirmed in rules) |
| guides/operational/alerts/cw-alarms.md | (empty) | DROP | Empty stub (0 words, confirmed in rules) |
| guides/operational/alerts/prometheus-alerts.md | (empty) | DROP | Empty stub (0 words, confirmed in rules) |
| guides/operational/alerting/amp-alertmgr.md | AMP Alert Manager | FOLD: eks-infrastructure > Deploy | AMP alerting rules & Alert Manager setup (2387w). (UNSURE: could be NEW ENTRY adot-at-scale or standalone) |
| guides/operational/gitops-with-amg/gitops-with-amg.md | Using GitOps and Grafana Operator with AMG | NEW ENTRY | Slug: managed-grafana-setup, workload_type: compute, type: solution. GitOps + grafana-operator on EKS (1113w). |
| guides/operational/adot-at-scale/operating-adot-collector.md | Operating the ADOT Collector | NEW ENTRY | Slug: adot-at-scale, workload_type: applications, type: solution. Production operations guide (3304w). |
| guides/operational/adot-at-scale/adot-java-spring/adot-java-spring.md | Instrumenting Java Spring Integration Apps | FOLD: adot-at-scale > Deploy | Manual OTel instrumentation for Spring-Integration (945w) |

### guides/operational/business/

| Path | Title | Disposition | Notes |
|------|-------|-------------|-------|
| guides/operational/business/key-performance-indicators.md | Understanding KPIs (Golden Signals) | GUIDE | Slug: observability-kpis-slos, workload_type: applications. SLI/SLO/SLA framework (2800w). |
| guides/operational/business/monitoring-for-business-outcomes.md | Why should you do observability? | GUIDE | Slug: observability-kpis-slos, workload_type: applications. Business alignment advice (1316w). |
| guides/operational/business/sla-percentile.md | Percentiles are important | GUIDE | Slug: observability-kpis-slos, workload_type: applications. Percentile-based monitoring advice (457w). |

### guides/partners/

| Path | Title | Disposition | Notes |
|------|-------|-------------|-------|
| guides/partners/databricks.md | Databricks Monitoring on AWS | NEW ENTRY | Slug: databricks-monitoring, workload_type: data-streaming, type: solution. Partner pilot (1454w). |

### guides/rust-custom-metrics/

| Path | Title | Disposition | Notes |
|------|-------|-------------|-------|
| guides/rust-custom-metrics/README.md | Creating Custom Metrics with the AWS Rust SDK | NEW ENTRY (`rust-custom-metrics`, applications) | Reassigned: ec2-monitoring dropped. The UNSURE alternative becomes the call |

### guides/signal-collection/

| Path | Title | Disposition | Notes |
|------|-------|-------------|-------|
| guides/signal-collection/emf.md | CloudWatch Embedded Metric Format | FOLD: lambda-monitoring > Deploy | EMF deep-dive (1593w). tools/emf.md (132w) is a stub; this is the substantive version. Not a duplicate — complementary to the tools reference. |

### guides/signal-correlation/

| Path | Title | Disposition | Notes |
|------|-------|-------------|-------|
| guides/signal-correlation/how-does-it-work.md | (empty) | DROP | Empty stub (0 words, confirmed in rules) |

---

## Disposition Tally

| Disposition | Count |
|-------------|-------|
| DUPLICATE | 33 |
| DROP | 14 |
| NEW ENTRY | 6 |
| FOLD | 14 |
| GUIDE | 8 |
| **Total** | **75** |

---

## Notable Calls

- **dotnet/oss/ vs dotnet/open-source/**: open-source/ wins (1812w vs 1194w). Content is near-identical at the start but open-source/ has more substance in logs/metrics/traces. oss/ marked DUPLICATE.
- **guides/index.md** (1508w): Despite the generic name, this is a substantive best-practices overview — assigned GUIDE (observability-strategy), not DROP.
- **guides/operational/alerting/amp-alertmgr.md**: Placed as FOLD into eks-infrastructure > Deploy since AMP alerting is EKS-centric, but could alternatively go into adot-at-scale.
- **guides/rust-custom-metrics/README.md**: Now NEW ENTRY (`rust-custom-metrics`, applications), since ec2-monitoring was dropped.
- **guides/cost/OLA-EC2-righsizing.md**: More about AWS licensing assessment than observability cost per se, but fits cost management broadly.

---

# Signals, persona, FAQ, resources, AI, root

## Disposition — Remainder Categories

## Part A: Dispositions

### docs/signals/

| File | Disposition | Target / Slug | Notes |
|------|-------------|---------------|-------|
| signals/metrics.md | DROP | — | Conceptual primer; signals primers have no catalog entry type; content is generic and available in OTel docs |
| signals/logs.md | DROP | — | Same rationale as metrics — generic primer |
| signals/traces.md | DROP | — | Same rationale |
| signals/alarms.md | DROP | — | Same rationale |
| signals/events.md | DROP | — | Same rationale |
| signals/anomalies.md | DROP | — | Empty stub (2 words: "# Anomalies\nWIP") |

**Recommendation:** DROP the entire directory rather than consolidating into one GUIDE. Rationale: each file is a short conceptual primer (~1500 words average) restating material readily available in OpenTelemetry and CloudWatch docs. None contains AWS-specific deployment steps, architecture patterns, or unique best-practice content that would justify a catalog entry. The catalog's signal taxonomy tags already convey which signals matter per entry.

---

### docs/persona/

| File | Disposition | Target / Slug | Notes |
|------|-------------|---------------|-------|
| persona/cloud_engineer.md | DROP | — | Owner decision: no catalog home for persona content |
| persona/developer.md | DROP | — | Owner decision: no catalog home for persona content |
| persona/devops_engineer.md | DROP | — | Owner decision: no catalog home for persona content |
| persona/leader_manager.md | DROP | — | Owner decision: no catalog home for persona content (UNSURE: substantive ROI/KPI prose could be salvaged into a future "observability-strategy" guide) |
| persona/security_pros.md | DROP | — | Owner decision: no catalog home for persona content |
| persona/site_reliability_engineer.md | DROP | — | Owner decision: no catalog home for persona content |

---

### docs/faq/

| File | Disposition | Target / Slug | Notes |
|------|-------------|---------------|-------|
| faq/general.md | DROP | — | Owner decision: faq/ drops entirely |
| faq/cloudwatch.md | DROP | — | Owner decision: faq/ drops entirely |
| faq/amp.md | DROP | — | Owner decision: faq/ drops entirely |
| faq/amg.md | DROP | — | Owner decision: faq/ drops entirely |
| faq/adot.md | DROP | — | Owner decision: faq/ drops entirely |
| faq/x-ray.md | DROP | — | Owner decision: faq/ drops entirely |
| faq/cloudtrail/index.md | DROP | — | Owner decision: faq/ drops entirely |
| faq/control-tower/index.md | DROP | — | Owner decision: faq/ drops entirely (UNSURE: has real Q&A content on Control Tower that could FOLD into a future operations entry) |
| faq/centralized-operations-management/index.md | DROP | — | Owner decision: faq/ drops entirely; "Coming Soon" stub |
| faq/application-operations/index.md | DROP | — | Owner decision: faq/ drops entirely; "Coming Soon" stub |

---

### docs/resources/

| File | Disposition | Target / Slug | Notes |
|------|-------------|---------------|-------|
| resources/index.md | DROP | — | Interactive demo embed; link-list page that goes stale |
| resources/events.md | DROP | — | Overlaps the /events/ page; just a link to external site |
| resources/useful-links.md | DROP | — | Curated link list; goes stale |
| resources/videos.md | DROP | — | Video embed list; goes stale |
| resources/cloudtrail-resources.mdx | DROP | — | Blog/workshop link collection; goes stale (UNSURE: workshop links could be added to a future cloudtrail operations entry as Related) |

---

### docs/home.md

| File | Disposition | Target / Slug | Notes |
|------|-------------|---------------|-------|
| home.md | DROP | — | Superseded by catalog homepage. Contains ~300 words of "what is observability" prose that is generic and not worth a standalone GUIDE; any needed framing will live in the catalog intro. |

---

### docs/ai/

| File | Disposition | Target / Slug | Notes |
|------|-------------|---------------|-------|
| ai/index.md | DROP | — | Owner decision: navigation stub |
| ai/_category_.json | DROP | — | Docusaurus metadata only |
| ai/aiops/index.md | DROP | — | Owner decision. **FLAG:** 4 events are tagged `aiops` or `devops-agent`. Content is a short bullet list of AWS services (DevOps Guru, CloudWatch Anomaly Detection, Application Signals, Q Developer investigations) with 4 best-practice bullets. Dropping it does NOT leave a real content gap — the listed services are covered by existing entries (eks-application-signals) or are linked AWS docs. The 4 events stand on their own as event descriptions. No unique architecture or deployment guidance is lost. |
| ai/aiops/_category_.json | DROP | — | Docusaurus metadata only |
| ai/genai/index.md | DROP | — | Owner decision: navigation stub |
| ai/genai/_category_.json | DROP | — | Docusaurus metadata only |
| ai/genai/persona/data_aiml.md | DROP | — | Owner decision |
| ai/genai/recipes/index.md | DROP | — | Owner decision: demo setup index |
| ai/genai/recipes/mcp-integration/kiro-quickstart.md | DROP | — | Owner decision |
| ai/genai/recipes/mcp-integration/mcp-queries.md | DROP | — | Owner decision |
| ai/genai/recipes/setup/grafana-setup.md | DROP | — | Owner decision |
| ai/coding-agents-observability/index.md | DUPLICATE | coding-agents-observability | Already converted |
| ai/coding-agents-observability/claude-code.md | DUPLICATE | coding-agents-observability | Already converted |
| ai/coding-agents-observability/codex.md | DUPLICATE | coding-agents-observability | Already converted |
| ai/coding-agents-observability/copilot.md | DUPLICATE | coding-agents-observability | Already converted |
| ai/coding-agents-observability/_category_.json | DROP | — | Docusaurus metadata only |
| ai/genai/guides/genai-observability-on-aws.md | DUPLICATE | genai-observability | Already converted |
| ai/genai/guides/custom-dashboards-for-genai-telemetry.md | FOLD | genai-observability > Guidance | Owner said "Keep / challenge"; content is persona-based dashboard queries extending the main genai-observability guide |
| ai/genai/recipes/architecture.md | FOLD | genai-observability > Overview | Owner said content fine but badly formatted; describes multi-cloud AI observability architecture |
| ai/genai/recipes/best-practices.md | GUIDE | genai-observability-best-practices (ai-ml) | Owner said "challenge / improve"; standalone tactical implementation best practices for OTel instrumentation of GenAI workloads |
| ai/genai/recipes/monitoring_and_auditing_ai_workloads.mdx | GUIDE | ai-workload-audit-monitoring (ai-ml, security) | Owner said "improve / check for duplicates"; audit + compliance framing using CloudTrail + Bedrock logging + ADOT. Checked overlap: the 4 existing security entries cover CW Logs analysis, Security Lake, S3 access logs, and WAF — none covers AI-specific audit correlation. No duplicate; unique content. |

---

## Part A: Disposition Tally

| Disposition | Count |
|-------------|-------|
| DROP | 36 |
| DUPLICATE | 5 |
| FOLD | 2 |
| GUIDE | 2 |
| NEW ENTRY | 0 |
| **Total** | **45** |

---

## Part B: Cloud Operations Subtree Inventory

| Subtree | Files | Dominant content type | Proposed operations entries (if chip approved) |
|---------|-------|-----------------------|------------------------------------------------|
| docs/guides/cloudtrail/ | 12 | How-to guides (Lake queries, network activity events, MCP server) | cloudtrail-monitoring, cloudtrail-lake-analytics |
| docs/guides/aws-config/ | 5 | Best-practice guide (compliance eval, resource tracking, cost optimization) | aws-config-compliance |
| docs/guides/control-tower/ | 6 | Setup + operations guide (planning, customizing, operating landing zones) | control-tower-landing-zone |
| docs/guides/organizations-and-accounts/ | 2 | Conceptual overview (multi-account strategy) | multi-account-observability |
| docs/guides/region-usage/ | 3 | Guidance (region selection, multi-region patterns) | region-usage-observability |
| docs/guides/centralized-operations-management/ | 7 | How-to + reference (patch mgmt, node mgmt, session mgmt via SSM) | centralized-ops-management |
| docs/guides/application-operations/ | 2 | Guidance (tagging strategy for operations) | application-operations-tagging |
| **Total** | **37** | | |

---

# Content Mapping: existing pages → catalog entries

Status legend: **CONVERT** (folds into a new entry now) · **KEEP** (already an entry) ·
**LATER** (candidate, not converted in this pass) · **DROP** (no catalog home; stays
on disk unrendered until a call is made)

## New entries created in this pass

| # | New entry (slug) | Sources folded in |
|---|------------------|-------------------|
| 1 | `eks-container-insights` | guides/containers/aws-native/eks/* (Container Insights, log aggregation, API server monitoring, X-Ray tracing), patterns/adoteksfargate.md, patterns/Tracing/xrayeks.md |
| 2 | `ecs-monitoring` | guides/containers/aws-native/ecs/* , guides/containers/oss/ecs/* , patterns/ecsampamg.md, patterns/Tracing/xrayecs.md, recipes/ecs.md |
| 3 | `dotnet-application-monitoring` | guides/dotnet/aws-native/* , guides/dotnet/oss/* (logs/metrics/traces/OTel) |
| 4 | `rds-aurora-monitoring` | guides/databases/rds-and-aurora.md, guides/databases/DBI.md, recipes/rds.md |
| 5 | `msk-monitoring` | recipes/msk.md, recipes/recipes/msk-monitoring-with-managed-collector.md |
| 6 | `opensearch-monitoring` | recipes/aes.md, recipes/recipes/opensearch-monitoring-with-managed-collector.md, patterns/opensearch.md |
| 7 | `network-observability` | guides/network-observation/** (flow monitor, internet monitor, synthetic monitor, network manager, north-south/east-west scenarios), patterns/vpcflowlogs.md |
| 8 | `coding-agents-observability` | ai/coding-agents-observability/* (Claude Code, Codex, Copilot) |
| 9 | `genai-observability` | ai/genai/** (guides, recipes, dashboards, MCP integration) |
| 10 | `ec2-monitoring` | guides/ec2-monitoring.md, patterns/Tracing/xrayec2.md |

## Existing entries (KEEP, unchanged)

| Entry | Notes |
|-------|-------|
| `eks-infrastructure` | Absorbs guides/containers/oss/eks/* as LATER refinement |
| `eks-application-signals` | Absorbs patterns/apmappsignals.md as LATER refinement |
| `ec2-nginx` | — |
| `lambda-monitoring` | Absorbs guides/serverless/* , patterns/lambdalogging.md, patterns/Tracing/xraylambda.md as LATER refinement |
| `kafka-ec2` | Self-managed Kafka; `msk-monitoring` covers managed |

## LATER (good candidates, not in this pass)

| Cluster | Would become | Why later |
|---------|--------------|-----------|
| guides/cost/** (kubecost, cost-visualization, CW cost reduction) | `observability-cost-management` | Big cluster, needs an editorial pass |
| tools/logs/security/* + recipes/cloudtrail/CloudTrail Security/* | `security-log-analytics` | Spans two old trees |
| guides/operational/adot-at-scale/* | `adot-at-scale` | Ops guide, not workload-shaped; may need template variance |
| recipes/recipes/amg-* (Grafana config recipes) | `managed-grafana-setup` | Config how-tos, weak workload fit |
| guides/hybrid-and-multicloud.md, recipes/recipes/monitoring-hybridenv-amg.md | `hybrid-monitoring` | Needs consolidation |
| patterns/multiaccount*.md, guides/cloudwatch_cross_account_observability.md | `cross-account-observability` | Cross-cutting, high value |
| guides/partners/databricks.md | `databricks-monitoring` | Partner entry — good pilot for partner process |
| patterns/sparkbigdata.md | `big-data-observability` | Single page, low effort |
| recipes/eks-gpu-cost-attribution.md | fold into `observability-cost-management` | — |
| tools/slos.md, tools/rum.md, tools/synthetics.md | `frontend-and-slo-monitoring` | Digital experience cluster |

## DROP (no catalog home — conceptual/meta content)

| Content | Rationale |
|---------|-----------|
| signals/* (metrics, logs, traces, alarms, events, anomalies) | Conceptual primers; belongs in an "About observability" page or AWS docs, not workload entries |
| persona/* | Navigation aid for a nav that no longer exists; personas can become search keywords in entries instead |
| faq/* | Per-service FAQs; fold relevant Q&As into entry Troubleshoot sections opportunistically |
| guides/index.md, guides/strategy.md, guides/observability-maturity-model.md, guides/apm.md, guides/full-stack.md, guides/dashboards.md | Strategy/editorial essays; candidate for a single "Start here" page later |
| resources/* (videos, links, events lists) | Events page covers events; video/link lists go stale — fold links into entries |
| guides/cloudtrail/**, guides/control-tower/**, guides/aws-config/**, guides/organizations-and-accounts/**, guides/region-usage/**, guides/centralized-operations-management/**, guides/application-operations/**, recipes/centralized-operations-management/**, recipes/application-operations/**, recipes/cloudtrail/** | Cloud operations management content (not observability); kept on disk, politics above our paygrade — a future pass can catalog these with an `ops` workload type |
| tutorial-basics/, tutorial-extras/, intro.md, contributors.md | DELETED (Docusaurus boilerplate / dead weight) |
| home.md | Superseded by the catalog homepage; kept on disk for salvage |

## Conversion method (applied to every new entry)

1. Read all source pages in the cluster.
2. Write `meta.yaml` classifying the workload against `_catalog/taxonomy.yaml`.
3. Write `index.md` on the fixed template (Overview → Prerequisites → Architecture →
   Deploy → Validate → Troubleshoot → Related Solutions).
4. Salvage: keep the best working steps/commands from sources; link to AWS docs
   for reference material; cut narrative filler.
5. Sources stay on disk (unrendered) until this mapping is reviewed and approved.

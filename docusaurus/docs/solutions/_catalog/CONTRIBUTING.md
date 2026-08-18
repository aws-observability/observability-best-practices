# Contributing a Catalog Entry

Every piece of content in this site is a **catalog entry**. There are no separate
"recipes" or "patterns" — two content types, one method, one place:

| Type | Answers | Template |
|------|---------|----------|
| **solution** | "How do I observe workload X on platform Y?" — deployable, step-by-step | Solution template (below) |
| **guide** | "What should I know / how should I think about X?" — advice, best practices | Guide template (below) |

If your content doesn't fit either, it probably belongs in AWS Documentation,
a blog post, or a workshop — not here.

## Entry anatomy

Each entry is a directory under `docs/solutions/`:

```
docs/solutions/<slug>/
├── meta.yaml     # Machine-readable metadata (drives the catalog UI)
├── index.md      # The human-readable guide
└── artifacts/    # (optional) dashboards, configs, IaC snippets
```

### meta.yaml (required)

```yaml
name: "EKS Infrastructure Monitoring"          # Card title
slug: eks-infrastructure                       # Must match directory name
content_type: solution                         # solution / guide
description: "One sentence. Max 200 chars. Shows on the card."
workload_type: [containers, kubernetes]        # See _catalog/taxonomy.yaml
compute_platform: [eks]                        # Solutions only (guides may omit)
backends: [amp, amg, cloudwatch]
signals: [metrics, logs]
iac_available: [terraform]                     # Empty list if none
partner_integrations: []
setup_complexity: medium                       # Solutions only: low / medium / high
time_to_value_minutes: 30                      # Solutions only
instrumentation: otel                          # Solutions only: otel / cwagent / prometheus / adot / custom
status: active                                 # active / deprecated / preview
accelerator_link: ""                           # GitHub repo if IaC exists
docs_link: "https://docs.aws.amazon.com/..."   # REQUIRED if AWS docs page exists
last_validated: "2026-08-17"                   # Date you last tested/reviewed
related_events: []                             # Topic tags matching events.json topics
```

All allowed values live in `_catalog/taxonomy.yaml`. Do not invent new values —
propose taxonomy additions in a separate PR.

### index.md for SOLUTIONS (content_type: solution)

Fixed section order. Every section present, even if brief:

```markdown
---
title: <Entry Name>
sidebar_label: <Short Name>
---

# <Entry Name>

## Overview
What this monitors, what you get, why it matters. 2-4 paragraphs max.
If an AWS Documentation page covers the full setup, SAY SO here and link it.
This entry then serves as the discovery + decision layer, not a duplicate.

## Prerequisites
Bullet list. Versions, permissions, existing resources.

## Architecture
A diagram (image or ASCII) showing signal flow: source → collection → backend.

## Deploy
Numbered steps. Copy-pasteable commands. Target: under 15 minutes guided,
under 5 minutes with IaC.

## Validate
How to confirm data is flowing. Specific console paths or CLI commands.

## Troubleshoot
Table: Symptom | Likely Cause | Fix. Minimum 3 rows.

## Related Solutions
Links to 1-3 other catalog entries.
```

### index.md for GUIDES (content_type: guide)

Guides are advisory. No deploy steps, no time-to-value promise. Fixed order:

```markdown
---
title: <Guide Name>
sidebar_label: <Short Name>
---

# <Guide Name>

## Overview
What this guidance covers and who it's for. 2-3 paragraphs max.

## When to use this
Bullet list of scenarios where this guidance applies.

## Guidance
The advice itself. Use H3 subsections per topic. Keep each recommendation
actionable: what to do, why, and the trade-off if you don't.

## Related
Links to 1-3 catalog entries (solutions or guides) and relevant AWS docs.
```

## Rules

1. **Link out, don't fork.** If AWS Documentation covers a step, link to it.
   The catalog entry owns discovery, decision guidance, and the fast path —
   not exhaustive reference material.
2. **One entry per workload+approach.** "EKS with CloudWatch" and "EKS with
   AMP/AMG" can be one entry with an options section, or two entries if the
   paths diverge substantially. Prefer one.
3. **`last_validated` is a promise.** If you touch an entry, re-test the steps
   and bump the date. Entries not validated in 12 months get `status: deprecated`.
4. **No orphan content.** Videos, walkthroughs, and deep dives fold INTO the
   relevant entry (embed or link from the Overview/Deploy sections). They do
   not get their own navigation.
5. **Run the catalog build before submitting:**
   ```bash
   python3 scripts/generate-catalog.py   # validates meta.yaml against taxonomy
   npm run build                         # must pass
   ```

## Submission process

1. Fork, create your entry directory.
2. Run validation (above).
3. Open a PR. The catalog CI regenerates `catalog.json` automatically.
4. A maintainer reviews against this template. Non-conformant entries are
   returned with specific gaps listed.

## Partner contributions

Partners follow the same template. Additional requirements:
- `partner_integrations` field must name the partner product(s)
- The entry must work with a vanilla AWS account plus the partner product —
  no private preview features
- Partner logo/branding is limited to the Overview section

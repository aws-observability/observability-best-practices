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

## Tags and search

Tags make an entry findable. The taxonomy is **closed** — every value you use must already exist in `_catalog/taxonomy.yaml`. To add a new value, open a separate PR proposing the addition with a justification.

### What each tag field does for discovery

| Field | Discovery role | Notes |
|-------|---------------|-------|
| `workload_type` | The **only** visible filter chips on the homepage. Answers "what am I running?" | Pick every one that genuinely applies, but do not pad. An entry tagged with 6 workload types is usually mis-scoped and should be split. |
| `compute_platform` | Not a filter chip, but **fully searchable** | Solutions only. |
| `backends` | Not a filter chip, but **fully searchable** | |
| `signals` | Not a filter chip, but **fully searchable** | |
| `instrumentation` | Not a filter chip, but **fully searchable** | Solutions only. |
| `content_type` | Renders as the card badge and is **searchable** | Users can type "guide" to filter. |

### Search and synonyms

The catalog search matches **all metadata fields** plus a built-in synonym map. Examples:

| User types | Finds entries tagged with |
|------------|--------------------------|
| `grafana` | `amg` |
| `kubernetes` | `eks` |
| `k8s` | `eks` |
| `serverless` | `lambda` |
| `prometheus` | `amp` |

The synonym map lives in `src/pages/index.tsx` (`SEARCH_SYNONYMS`). When a new backend or platform is added to the taxonomy, extend the synonym map in the same PR.

### Tagging guidance

- Prefer **accuracy over reach**. Tag what the entry actually deploys on or covers.
- If you need more than 3 workload types, ask yourself whether the entry should be split into focused pieces.
- Use `content_type: guide` explicitly in meta.yaml for guides; solutions can omit it (defaults to `solution`).

## Catalog ordering and appearance

`catalog.json` is **generated** — never hand-edit it. The generator reads every `meta.yaml`, validates it, and writes the catalog file.

Entries are ordered by `last_validated` descending. The freshest 9 entries land on page 1 of the catalog homepage. Bumping the date without actually re-testing the steps is a **review-blocking offense** — reviewers will check the commit diff against the entry content.

To regenerate after adding or updating an entry:

```bash
python3 scripts/generate-catalog.py
```

## Events and how they link to content

Catalog entries can surface upcoming live events via the `related_events` field and the `<RelatedEvents>` component. The join key is the **topics** array in `docs/events/events.json`.

### events.json object shape

| Field | Type | Description |
|-------|------|-------------|
| `theme` | string | Event series name |
| `level` | number | Depth (100–400) |
| `format` | string | "Hands-on workshop", "Technical talk", "In-person event" |
| `name` | string | Event title |
| `description` | string | Brief summary |
| `date` | string | Primary date (e.g. "Tue 4 Aug") |
| `time` | string | Time range in UTC |
| `location` | string | "Online" or venue |
| `registerUrl` | string | Registration link |
| `additionalDates` | array | Objects with `date`, `time`, `location`, `registerUrl` |
| `topics` | string[] | **Join key** — matched against entry `related_events` values |

### Topics currently in use

`ai-ml` · `aiops` · `applications` · `apm` · `cloudwatch` · `databases` · `devops-agent` · `genai` · `general` · `logs` · `metrics` · `security`

### How the link works

1. You set `related_events: [security, logs]` in your `meta.yaml`.
2. The `<RelatedEvents>` component finds events whose `topics` array contains `security` OR `logs`.
3. It renders up to 3 matching events with registration links.

**Topic naming convention:** Reuse an existing topic rather than inventing a near-duplicate (e.g. use `ai-ml` not `machine-learning`). The validator warns when `related_events` references a topic that no event currently uses.

### Adding Related Events to your entry

At the top of `index.md`, immediately after the frontmatter closing `---`:

```markdown
import RelatedEvents from '@site/src/components/RelatedEvents';
```

At the bottom of `index.md`, add a final section:

```markdown
## Related Events

<RelatedEvents topics={["security", "logs"]} />
```

The `topics` array in the component should match your `related_events` values in `meta.yaml`.

## CI enforcement

CI runs `.github/workflows/catalog-validation.yaml` on any change under `docusaurus/docs/solutions/`.

### Errors (PR fails)

- Unknown taxonomy values (not in `taxonomy.yaml`)
- `slug` does not match directory name
- `description` exceeds 200 characters
- `last_validated` is malformed or in the future
- Missing or out-of-order `index.md` H2 sections
- Missing `meta.yaml` or `index.md`
- Invalid YAML syntax
- Committed `catalog.json` is stale (doesn't match regenerated output)

### Warnings (PR passes, reviewer notified)

- Entry not validated in over 365 days
- Missing `docs_link`
- `related_events` references a topic no event currently uses

### Local validation commands

Run these **before** opening a PR:

```bash
# Validate meta.yaml and regenerate catalog.json
python3 scripts/generate-catalog.py

# Validate only (what CI runs) — exits non-zero on errors
python3 scripts/generate-catalog.py --check

# Full site build — catches broken links and MDX errors
npm run build
```

The only Python dependency is `pyyaml` (`pip install pyyaml`).

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

1. Copy the appropriate template from `_catalog/templates/solution/` or `_catalog/templates/guide/` into a new directory under `docs/solutions/<your-slug>/`.
2. Fill in all `REPLACE_ME` placeholders in both `meta.yaml` and `index.md`.
3. Run validation:
   ```bash
   python3 scripts/generate-catalog.py
   npm run build
   ```
4. Open a PR. The catalog CI regenerates `catalog.json` automatically.
5. A maintainer reviews against this template. Non-conformant entries are
   returned with specific gaps listed.

## Partner contributions

Partners follow the same template. Additional requirements:
- `partner_integrations` field must name the partner product(s)
- The entry must work with a vanilla AWS account plus the partner product —
  no private preview features
- Partner logo/branding is limited to the Overview section

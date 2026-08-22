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
workload_type: [compute]                       # See _catalog/taxonomy.yaml
compute_platform: [eks]                        # Solutions only (guides may omit)
backends: [amp, amg, cloudwatch]
signals: [metrics, logs]
iac_available: [terraform]                     # Empty list if none
partner_integrations: []
time_to_value_minutes: 30                      # Solutions only
instrumentation: otel                          # Solutions only: otel / cwagent / prometheus / adot / custom
status: active                                 # active / deprecated / preview
accelerator_link: ""                           # GitHub repo if IaC exists
docs_link: "https://docs.aws.amazon.com/..."   # REQUIRED if AWS docs page exists
last_validated: "2026-08-17"                   # Date you last tested/reviewed
featured: false                                # Optional: pin ahead of others in catalog order
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

### workload_type values (current)

The `workload_type` field drives the **filter chips** on the catalog homepage. The taxonomy was consolidated from 10 thin values to 6 balanced groups:

| id | Label | Current entries |
|---|---|---|
| `ai-ml` | AI/ML | 2 |
| `compute` | Compute | 8 |
| `applications` | Applications | 2 |
| `data-streaming` | Data & Streaming | 4 |
| `security` | Security & Compliance | 4 |
| `network` | Network | 2 |

**Why six groups, not ten?** The previous values (`containers`, `kubernetes`, `serverless`, `ec2`, `databases`, `messaging`, `ai-ml`, `networking`, `applications`, `security`) produced chips matching 1–3 entries each and left `kubernetes` as a strict subset of `containers` — every kubernetes entry was also tagged containers, so the chip never narrowed anything. Fewer, better-populated groups give users meaningful filtering without dead-end clicks.

Consolidation mapping:
- `containers` + `kubernetes` + `serverless` + `ec2` → **compute**
- `databases` + `messaging` → **data-streaming** (users reason about "my data tier", not databases vs. messaging)
- `networking` → **network** (rename)
- `security` absorbs compliance (a separate chip would hold ~1 entry)

**Reserved value: `operations`** — intended for cloud operations management content (CloudTrail, Config, Control Tower, Organizations) but deliberately not active because no current entry would use it. An empty chip is worse than a missing one. Rule: a new chip value ships in the same PR as its first entry.

### What each tag field does for discovery

| Field | Discovery role | Notes |
|-------|---------------|-------|
| `workload_type` | The **only** visible filter chips on the homepage. Answers "what am I running?" | Pick the single most accurate group; dual-tag only when an entry genuinely spans two. |
| `compute_platform` | Not a filter chip, but **fully searchable** | Solutions only. Deliberately rejected as a chip row: 10 of 19 entries have no compute platform at all, and four platforms have exactly one entry each — most chips would be empty or singleton. |
| `backends` | Not a filter chip, but **fully searchable** | |
| `signals` | Not a filter chip, but **fully searchable** | |
| `instrumentation` | Not a filter chip, but **fully searchable** | Solutions only. |
| `content_type` | Renders as the card badge and is **searchable** | Users can type "guide" to filter. |

### Search and synonyms

The catalog search matches **all metadata fields** plus a built-in synonym map defined in `src/pages/index.tsx` (`SEARCH_SYNONYMS`). Examples:

| User types | Finds entries tagged with |
|------------|--------------------------|
| `grafana` | `amg` |
| `kubernetes` | `eks` |
| `k8s` | `eks` |
| `serverless` | `lambda` |
| `prometheus` | `amp` |

When a new backend or platform is added to the taxonomy, extend the synonym map in the same PR.

#### Group-synonym rule

Group-level synonyms (those keyed to a `workload_type` value) may contain **only domain vocabulary describing the whole group**. Specific technology names must NOT appear in a group synonym.

**Cautionary example:** putting `"kubernetes"` as a synonym for `compute` caused every compute entry to match a kubernetes search — so typing "kubernetes" returned the EC2 NGINX entry. The fix: product-specific words come from `compute_platform`, `name`, and `description`, which are per-entry and precise. If a technology name should find a specific entry, put it in that entry's `description` field (e.g., MSK's description spells out "Managed Streaming for Apache Kafka" so users searching "kafka" find it without polluting the `data-streaming` group synonym).

### Tagging guidance

- Prefer the **single most accurate group**. Most entries belong to exactly one workload_type.
- **Dual-tag only when an entry genuinely spans two groups.** Current real examples:
  - *EKS Java Application Monitoring* → `compute` + `applications`
  - *Kafka on EC2* → `data-streaming` + `compute`
  - *WAF* → `security` + `network`
- If you need more than 2 workload types, the entry is probably mis-scoped and should be split.
- Use `content_type: guide` explicitly in meta.yaml for guides; solutions can omit it (defaults to `solution`).

## Linking rules

### Legacy paths are not link targets

Several hundred documents remain on disk under `docs/guides/`, `docs/recipes/`,
`docs/tools/`, `docs/patterns/`, `docs/ai/`, `docs/signals/`, `docs/persona/`,
`docs/faq/`, and `docs/resources/`. **None of them are rendered.** The docs
plugin is scoped to `solutions/` and `events/`, so any link into those trees is
dead on the published site even though the file plainly exists in your editor.

This is the single most common broken link in this repository, and it has three
disguises:

| Looks like | Example | Why it breaks |
|---|---|---|
| A relative path up and over | `../../../databases/DBI/` | resolves to an unrendered tree |
| An absolute site path | `/guides/genai/genai-observability-on-aws/` | same, with no relative hint that it is leaving |
| A full production URL | `https://aws-observability.github.io/observability-best-practices/guides/...` | passes a glance, 404s in CI |

It happens most when converting legacy material, because the source you are
reading sits right next to the thing you want to link.

**Link to the catalog entry that absorbed the content instead.** If no entry
covers it yet, link to AWS Documentation, or say nothing. Do not link a file
because it is on disk.

**Images are the exception.** An image *asset* under a legacy directory is fine
to reference. Docusaurus bundles it into `assets/` with a content hash at build
time, so it resolves regardless of whether the page it came from is rendered.
Only *page* links into legacy trees break. Do not "fix" a working image path.

Check before you open a PR. The `grep -v` is what keeps image assets out of the
results:

```bash
# page links into unrendered trees, ignoring image assets
grep -nE '\]\((\.\./)*[a-z-]+/(guides|recipes|tools|patterns|ai|signals|persona|faq|resources)/[^)]*\)' \
  docs/solutions/*/index.md | grep -vE '\.(png|jpe?g|gif|svg|webp)\)'

# full production URLs pointing at unrendered trees
grep -n 'observability-best-practices/\(guides\|recipes\|tools\|patterns\|ai\|signals\|persona\|faq\|resources\)/' \
  docs/solutions/*/index.md
```

Both should return nothing.

### Which link style to use

- **Another catalog entry**: relative, `../<slug>/`. The site build validates
  these and fails on a broken one.
- **AWS Documentation and other external targets**: full `https://` URL. CI link
  checking covers these; the site build does not.
- **Images**: see the images rule below.

## Catalog ordering and appearance

`catalog.json` is **generated** — never hand-edit it. The generator reads every `meta.yaml`, validates it, and writes the catalog file.

Entries are ordered by `featured` first, then `last_validated` descending, then name. The freshest 9 entries land on page 1 of the catalog homepage.

### `last_validated` must be a real date

It records **when a human last verified this entry's steps against reality**. It is not the date you edited the file, and it is not a dial for controlling placement.

Three rules follow from that:

1. **Bumping the date without re-testing is a review-blocking offense.** Reviewers check the commit diff against the entry content.
2. **Editing prose does not refresh it.** Fixing a typo, a link, or a caption leaves the date alone, because none of that revalidates the instructions.
3. **When converting existing material, inherit the source's date**, not today's. Use the last commit date of the files you drew from:
   ```bash
   git log -1 --format=%cs -- <source paths>
   ```
   An entry assembled from a 2024 guide is 2024-vintage content in a new wrapper. Dating it today claims a verification that never happened.

The validator warns when an entry passes 365 days. Those warnings are the point: they are the re-test backlog, and a catalog that shows several is being honest rather than broken.

### `featured` is deliberately rare

`featured: true` pins an entry above the date ordering. It exists for a genuine editorial reason to override freshness, and **no entry currently carries it**.

It was previously applied to 18 entries to keep reviewed content ahead of bulk-converted content. That inverted its own purpose: new, deliberately authored entries defaulted to unpinned and landed on page 3, below older pinned material. Reviewed-versus-unreviewed is not a thing the catalog should model at all, since anything merged has been reviewed.

If you pin something, expect to justify it in review and to unpin it later.

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

1. **Keep the images.** If source material has architecture diagrams, console
   screenshots, or dashboard examples, carry them into the entry. Readers are
   visual, and a screenshot of a working dashboard proves the thing succeeded in
   a way prose cannot. An ASCII diagram is an acceptable *addition* for signal
   flow, never a *replacement* for a real diagram that already exists.
   - Images live in `docs/images/` (221 files), `docs/recipes/images/` (85),
     `docs/patterns/images/` (19), and a few colocated directories.
   - From `docs/solutions/<slug>/index.md`, `docs/images/` is `../../images/`.
   - Verify the file exists at the resolved path before committing; a broken
     image is worse than no image.
   - Budget roughly four to six images per entry. Prefer one architecture
     diagram plus screenshots that show what success looks like in `Validate`.
     Do not carry over every step-by-step console capture.
2. **Link out, don't fork.** If AWS Documentation covers a step, link to it.
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

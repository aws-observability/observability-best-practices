# AGENTS.md

Guidance for AI agents and automated consumers of this repository.

This site is the **AWS Observability Best Practices** guide. Its content is a
catalog of entries, each answering how to observe a particular workload on AWS.
The catalog is deliberately machine-readable, so **read the structured index
rather than scraping the rendered site**.

## Start here: the structured index

```
docusaurus/static/catalog.json
```

Served publicly at `/observability-best-practices/catalog.json`. It is generated
from the entry metadata and is the single best source for answering "what
content exists and what does it cover".

```json
{
  "generated_at": "ISO-8601 timestamp",
  "schema_version": "1.0",
  "solutions": [ { /* one object per entry, see below */ } ],
  "taxonomy":  { /* the controlled vocabulary, see below */ }
}
```

Each object in `solutions` carries:

| Field | Notes |
|---|---|
| `name` | human-readable title |
| `slug` | URL segment; the page is at `/solutions/<slug>/` |
| `content_type` | `solution` or `guide` — see below |
| `description` | one sentence, max 200 characters |
| `workload_type` | array; the only user-visible filter |
| `compute_platform` | array; solutions only, may be absent |
| `backends` | array, e.g. `cloudwatch`, `amp`, `amg`, `xray` |
| `signals` | array of `metrics`, `logs`, `traces`, `profiling` |
| `instrumentation` | single value; solutions only, may be absent |
| `time_to_value_minutes` | integer; solutions only, may be absent |
| `iac_available` | array, e.g. `terraform`, `cdk`; may be absent |
| `status` | `active`, `needs-refresh`, `deprecated`, or `preview` |
| `last_validated` | `YYYY-MM-DD`, the date a human last re-tested it |
| `featured` | boolean, ordering only; may be absent |
| `docs_link` | link to authoritative AWS documentation, may be empty |
| `related_events` | array of event topic strings |

**Guide entries legitimately omit** `compute_platform`,
`time_to_value_minutes`, `instrumentation`, and `iac_available`. Treat every one
of those as optional and guard your field access; assuming they are present is
the most common way to break against this data.

## Two content types

| `content_type` | Answers | Has deploy steps |
|---|---|---|
| `solution` | "How do I observe X on Y?" | yes |
| `guide` | "What should I know about X?" | no |

Do not present a `guide` as though it contains deployment instructions. It
deliberately does not.

## Entries have a fixed section order

This is what makes the content reliably extractable. Every entry document uses
these H2 headings, in this order, and CI fails the build if one is missing or
out of sequence.

Solutions:
`Overview` → `Prerequisites` → `Architecture` → `Deploy` → `Validate` →
`Troubleshoot` → `Related Solutions`

Guides:
`Overview` → `When to use this` → `Guidance` → `Related`

So if you need the deployment steps for a workload, take the `Deploy` section of
the relevant entry. If you need failure modes, take `Troubleshoot`, which is
always a table of Symptom / Likely Cause / Fix. An entry may carry extra H2
sections, such as `Related Events`, in addition to the required ones.

## The taxonomy is closed

```
docusaurus/docs/solutions/_catalog/taxonomy.yaml
```

`workload_type`, `compute_platform`, `backends`, `signals`, and
`instrumentation` draw from fixed vocabularies. Do not invent values when
generating or classifying content: the validator rejects unknown ones. Adding a
value is a deliberate change to that file.

`workload_type` is the only vocabulary surfaced as a user-facing filter. The
others are searchable but not filter chips.

## Entry layout on disk

```
docusaurus/docs/solutions/<slug>/
├── meta.yaml     # the metadata that feeds catalog.json
├── index.md      # the document
└── artifacts/    # optional supporting assets
```

Everything under `docusaurus/docs/solutions/_catalog/` is machinery, not
content: schema, taxonomy, templates, and planning records. It is excluded from
the rendered site.

## Events

```
docusaurus/docs/events/events.json
```

Each event has `name`, `description`, `format`, `level`, `date`, `time`,
`location`, `registerUrl`, an optional `additionalDates` array of further
sessions, and a `topics` array.

Two things to know before using this data:

- **Dates carry no year.** They look like `"Tue 28 Jul"`. The year is resolved
  from the weekday name, since a given day and month falls on a specific weekday
  only once every several years. Assuming the current year is wrong across a
  year boundary.
- **The primary `date` is often past.** For a recurring series it is the first
  session. Upcoming sessions live in `additionalDates`, each with its own
  `registerUrl`. An event is only genuinely over when every session is past.

`topics` is the join key between events and entries: an entry's
`related_events` values are matched against it.

## Working in this repository

Regenerate the index after changing any `meta.yaml`:

```bash
cd docusaurus
python3 scripts/generate-catalog.py          # validate and write catalog.json
python3 scripts/generate-catalog.py --check  # validate only, what CI runs
npm run build                                # must pass
```

`pyyaml` is the only Python dependency. `catalog.json` is a build artifact:
never hand-edit it, and commit the regenerated file, because CI fails when the
committed copy does not match generator output.

Before authoring or modifying content, read:

- `docusaurus/docs/solutions/_catalog/CONTRIBUTING.md` — the entry contract,
  both templates, tagging and search rules, and what CI enforces
- `docusaurus/docs/solutions/_catalog/DISPOSITIONS.md` — the plan for legacy
  content, and why several hundred unrendered source files are retained on
  purpose rather than deleted
- `docusaurus/docs/solutions/_catalog/BACKLOG.md` — known gaps and deferred work

## Things that will trip you up

- **Legacy directories are not live content.** `docs/guides/`, `docs/recipes/`,
  `docs/tools/`, `docs/patterns/`, `docs/ai/`, `docs/signals/`, `docs/persona/`,
  `docs/faq/`, and `docs/resources/` still exist on disk but are **not rendered**
  and are superseded by catalog entries. Do not cite them as current guidance,
  and do not treat their absence from the site as a bug. Deletion is planned.
- **Never link to a legacy path.** This is the most common broken link in the
  repository, and it has bitten three separate changes. A relative
  `../../../databases/DBI/`, an absolute `/guides/genai/...`, and a full
  `https://aws-observability.github.io/observability-best-practices/guides/...`
  all resolve into unrendered trees and 404 in CI, even though the file is
  visibly present on disk. Link to the catalog entry that absorbed the content,
  or to AWS Documentation. Image *assets* under those directories are the one
  exception: Docusaurus bundles them at build time, so they resolve fine.
- **The homepage is the catalog**, a React page, not a document. There is no
  index document to parse.
- **`status: needs-refresh` means do not present this as current.** The topic is
  right and the steps still work, but the recommendation is behind current AWS
  guidance and a rework is pending. These entries sort last and carry a caution
  admonition naming what is missing. Read that admonition before summarising the
  entry, and prefer the AWS documentation it links to.
- **`last_validated` is a promise, not a timestamp.** It means a human re-tested
  the steps. Do not update it unless that happened.
- **Ordering is `featured`, then `last_validated` descending, then name.** It is
  not relevance ranked. No entry currently sets `featured`, so in practice the
  catalog is ordered by freshness.
- **`last_validated` reflects the vintage of the content, not the file.** Entries
  converted from older material inherit that material's date, so a recent commit
  to an entry does not mean its instructions were recently verified. Several
  entries are deliberately over a year old; that is a visible re-test backlog,
  not a defect.
- Only English is published. Translation files exist under `docusaurus/i18n/`
  but no locale covers the catalog yet.

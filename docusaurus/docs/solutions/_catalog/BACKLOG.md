# Catalog Backlog

Deferred work, captured so it is not lost. Not scheduled.

## AGENTS.md — machine-readable site guide

**Status:** deferred, agreed as a good idea

Add an `AGENTS.md` at the repository root so coding agents and other automated
consumers can navigate the catalog and pull data without scraping the rendered
site. Intended contents:

- What this site is and the two content types (solution, guide)
- Where the machine-readable index lives (`docusaurus/static/catalog.json`) and
  its shape, so an agent reads that instead of crawling HTML
- The taxonomy source of truth (`_catalog/taxonomy.yaml`) and why values are
  closed rather than free text
- Entry layout convention (`docs/solutions/<slug>/meta.yaml` + `index.md`)
- How to regenerate the index (`scripts/generate-catalog.py`) and validate a
  contribution before opening a PR
- Event data shape (`docs/events/events.json`) and how `topics` join events to
  entries
- Explicit guidance that entries follow a fixed section order, so an agent can
  extract Deploy or Troubleshoot sections reliably

**Why it matters:** the catalog is already machine-readable by design. A short
contract file makes that usable by agents answering "how do I monitor X on AWS"
without inventing steps.

## Other deferred items

- Content trimming pass on the remaining ~40 guide candidates (owner: team)
- Decide featured/pinned entries on top of the `last_validated` ordering
- Analytics-driven ordering (most viewed) once RUM data is wired up
- Convert the LATER clusters listed in `MAPPING.md` (cost management,
  cross-account observability, security log analytics, Databricks partner pilot)
- Resolve `.github/workflows/linkcheck.json`: an uncommitted change broadens the
  ignore list to include `^/`, which would disable validation of all absolute
  internal links

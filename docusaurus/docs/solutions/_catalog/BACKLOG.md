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

## Entries awaiting refresh (`status: needs-refresh`)

Published and reachable, sorted last, badged on their cards. The generator lists
them on every run. Each carries a caution admonition naming what is missing.

- **ec2-nginx** — configures the CloudWatch agent directly; needs OpenTelemetry
  collection into CloudWatch, a dashboard artifact, and real validation steps.
- **kafka-ec2** — collects broker metrics over JMX via the agent's JMX plugin;
  needs the OpenTelemetry JMX receiver, the CloudWatch managed Prometheus
  collector as an alternative, and accelerator dashboards. Readers on Amazon MSK
  should use `msk-monitoring`, which is current.
- **lambda-monitoring** — leads with Lambda Insights; needs Application Signals
  for Lambda, the AWS-managed OpenTelemetry Lambda layers, and Transaction
  Search. Lambda Insights stays useful for memory and cold-start analysis.

## Other deferred items

- **Delete the 257 retained source files** (scheduled: a few weeks out). All are
  superseded by the 47 catalog entries and are already unrendered, but the
  catalog is only 14% of the source word count, so a human should spot-check
  entries against sources before removal. Start with the thinnest entries listed
  in `DISPOSITIONS.md`. Deleting is a single change once reviewed.
- Restore i18n locales once solutions content is translated. `docusaurus.config.js`
  currently ships English only; the ~1670 translated documents are untouched
  on disk but none cover `solutions/`.
- Write Java and Node.js application entries from scratch. The existing
  `recipes/java.md` and `recipes/nodejs.md` are 14 and 12 word stubs, so there is
  nothing to convert, yet the two languages are obvious gaps beside
  `dotnet-application-monitoring` and `rust-custom-metrics`.
- Write a general-purpose EC2 entry. `ec2-monitoring` was dropped as too old to
  carry value, leaving only workload-specific EC2 coverage in `ec2-nginx` and
  `kafka-ec2`.
- Content trimming pass on the remaining ~40 guide candidates (owner: team)
- Decide featured/pinned entries on top of the `last_validated` ordering
- Analytics-driven ordering (most viewed) once RUM data is wired up
- Resolve `.github/workflows/linkcheck.json`: a stashed change broadens the
  ignore list to include `^/`, which would disable validation of all absolute
  internal links. The build is currently at zero broken links, which that change
  would let regress unnoticed.

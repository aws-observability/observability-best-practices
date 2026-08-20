#!/usr/bin/env python3
"""
Validate catalog entries and generate catalog.json.

Scans docs/solutions/*/ for meta.yaml + index.md, validates both against the
taxonomy and the required document structure, then writes static/catalog.json
for the front end.

Two failure levels:
  ERROR   - blocks the build. Malformed or unusable entry.
  WARNING - reported but does not block. Style and freshness concerns.

Usage:
    python3 scripts/generate-catalog.py           # validate and write catalog.json
    python3 scripts/generate-catalog.py --check   # validate only, write nothing (CI)

Run from the docusaurus/ directory, or set DOCUSAURUS_ROOT.
"""

import argparse
import json
import os
import re
import sys
from datetime import datetime, timezone, date
from pathlib import Path

try:
    import yaml
except ImportError:
    print("ERROR: PyYAML is required. Install with: pip install pyyaml", file=sys.stderr)
    sys.exit(1)

# Document sections required per content type, in this exact order.
REQUIRED_SECTIONS = {
    "solution": [
        "Overview", "Prerequisites", "Architecture",
        "Deploy", "Validate", "Troubleshoot", "Related Solutions",
    ],
    "guide": [
        "Overview", "When to use this", "Guidance", "Related",
    ],
}

# Fields required per content type. Guides make no deploy promise, so they omit
# complexity, time-to-value, instrumentation, and platform.
REQUIRED_FIELDS = {
    "solution": [
        "name", "slug", "description", "workload_type", "compute_platform",
        "backends", "signals", "instrumentation", "status",
        "time_to_value_minutes", "last_validated",
    ],
    "guide": [
        "name", "slug", "description", "workload_type",
        "signals", "status", "last_validated",
    ],
}

VALID_CONTENT_TYPES = ("solution", "guide")
VALID_STATUSES = ("active", "deprecated", "preview")
VALID_IAC = ("terraform", "cdk", "cloudformation", "pulumi")

SLUG_PATTERN = re.compile(r"^[a-z0-9-]+$")
DESCRIPTION_MAX = 200
STALE_AFTER_DAYS = 365


class Findings:
    """Collects errors and warnings across all entries."""

    def __init__(self):
        self.errors: list[str] = []
        self.warnings: list[str] = []

    def error(self, slug: str, message: str) -> None:
        self.errors.append(f"  [{slug}] {message}")

    def warn(self, slug: str, message: str) -> None:
        self.warnings.append(f"  [{slug}] {message}")

    @property
    def ok(self) -> bool:
        return not self.errors


def get_project_root() -> Path:
    """Determine the docusaurus project root."""
    env_root = os.environ.get("DOCUSAURUS_ROOT")
    if env_root:
        return Path(env_root)

    script_dir = Path(__file__).resolve().parent
    if (script_dir.parent / "docusaurus.config.js").exists():
        return script_dir.parent

    cwd = Path.cwd()
    if (cwd / "docusaurus.config.js").exists():
        return cwd

    print(
        "ERROR: Cannot find docusaurus root. Run from docusaurus/ or set DOCUSAURUS_ROOT.",
        file=sys.stderr,
    )
    sys.exit(1)


def load_taxonomy(solutions_dir: Path) -> tuple[dict, dict]:
    """Load taxonomy.yaml. Returns (id-only lookup, raw structure for the front end)."""
    taxonomy_path = solutions_dir / "_catalog" / "taxonomy.yaml"
    if not taxonomy_path.exists():
        print(f"ERROR: taxonomy.yaml not found at {taxonomy_path}", file=sys.stderr)
        sys.exit(1)

    with open(taxonomy_path, "r") as f:
        raw = yaml.safe_load(f)

    lookup = {}
    for category, items in raw.items():
        if isinstance(items, list):
            lookup[category] = [
                item["id"] if isinstance(item, dict) else item for item in items
            ]

    return lookup, raw


def load_event_topics(project_root: Path) -> set[str]:
    """Collect every topic tag used in events.json, for related_events validation."""
    events_path = project_root / "docs" / "events" / "events.json"
    if not events_path.exists():
        return set()

    with open(events_path, "r") as f:
        events = json.load(f)

    topics: set[str] = set()
    for event in events:
        for topic in event.get("topics", []):
            topics.add(topic)
    return topics


def parse_sections(markdown: str) -> list[str]:
    """Return H2 headings in document order, ignoring fenced code blocks.

    Code blocks matter: an ASCII architecture diagram or a shell snippet can
    contain a line starting with '## ', which would otherwise be read as a
    heading and break section-order validation.
    """
    sections = []
    in_fence = False
    for line in markdown.splitlines():
        stripped = line.strip()
        if stripped.startswith("```"):
            in_fence = not in_fence
            continue
        if in_fence:
            continue
        if stripped.startswith("## ") and not stripped.startswith("###"):
            sections.append(stripped[3:].strip())
    return sections


def validate_meta(meta: dict, taxonomy: dict, slug: str, event_topics: set[str],
                  findings: Findings) -> None:
    """Validate meta.yaml contents."""
    content_type = meta.setdefault("content_type", "solution")

    if content_type not in VALID_CONTENT_TYPES:
        findings.error(slug, f"Invalid content_type '{content_type}' (expected one of {', '.join(VALID_CONTENT_TYPES)})")
        content_type = "solution"

    for field in REQUIRED_FIELDS[content_type]:
        if field not in meta:
            findings.error(slug, f"Missing required field for {content_type}: {field}")

    # Slug must match the directory and be URL-safe, since it forms the route.
    entry_slug = meta.get("slug")
    if entry_slug:
        if entry_slug != slug:
            findings.error(slug, f"Slug '{entry_slug}' does not match directory name")
        if not SLUG_PATTERN.match(entry_slug):
            findings.error(slug, f"Slug '{entry_slug}' must be lowercase letters, digits, and hyphens only")

    # Description drives the card; overflow breaks the grid layout.
    description = meta.get("description", "")
    if description and len(description) > DESCRIPTION_MAX:
        findings.error(slug, f"Description is {len(description)} chars, max is {DESCRIPTION_MAX}")

    # Closed vocabularies.
    array_fields = {
        "workload_type": "workload_types",
        "compute_platform": "compute_platforms",
        "backends": "backends",
        "signals": "signals",
    }
    for meta_field, taxonomy_key in array_fields.items():
        values = meta.get(meta_field)
        if values is None:
            continue
        if not isinstance(values, list):
            findings.error(slug, f"Field {meta_field} must be a list")
            continue
        for val in values:
            if taxonomy_key in taxonomy and val not in taxonomy[taxonomy_key]:
                findings.error(
                    slug,
                    f"Unknown {meta_field} value '{val}'. Add it to taxonomy.yaml in a separate PR first.",
                )

    single_fields = {
        "instrumentation": "instrumentation",
    }
    for meta_field, taxonomy_key in single_fields.items():
        val = meta.get(meta_field)
        if val and taxonomy_key in taxonomy and val not in taxonomy[taxonomy_key]:
            findings.error(slug, f"Unknown {meta_field} value '{val}'")

    if meta.get("status") and meta["status"] not in VALID_STATUSES:
        findings.error(slug, f"Invalid status '{meta['status']}'")

    for val in meta.get("iac_available") or []:
        if val not in VALID_IAC:
            findings.error(slug, f"Unknown iac_available value '{val}'")

    # last_validated is a freshness contract, so the format must be machine-readable.
    raw_date = meta.get("last_validated")
    if raw_date is not None:
        parsed = None
        if isinstance(raw_date, date):
            parsed = raw_date
        else:
            try:
                parsed = datetime.strptime(str(raw_date), "%Y-%m-%d").date()
            except ValueError:
                findings.error(slug, f"last_validated '{raw_date}' must be YYYY-MM-DD")
        if parsed:
            if parsed > date.today():
                findings.error(slug, f"last_validated '{parsed}' is in the future")
            elif (date.today() - parsed).days > STALE_AFTER_DAYS:
                findings.warn(
                    slug,
                    f"last_validated '{parsed}' is over {STALE_AFTER_DAYS} days old; re-test or mark deprecated",
                )

    # Event topics must exist, otherwise Related Events silently renders nothing.
    for topic in meta.get("related_events") or []:
        if event_topics and topic not in event_topics:
            findings.warn(slug, f"related_events topic '{topic}' matches no event in events.json")

    # An entry with no AWS docs link is allowed but usually means duplicated reference material.
    if not meta.get("docs_link"):
        findings.warn(slug, "No docs_link set; link to AWS Documentation instead of duplicating reference detail")


def validate_document(entry_dir: Path, content_type: str, slug: str,
                      findings: Findings) -> None:
    """Validate index.md exists and follows the template section order."""
    index_path = entry_dir / "index.md"
    if not index_path.exists():
        index_path = entry_dir / "index.mdx"
    if not index_path.exists():
        findings.error(slug, "Missing index.md")
        return

    markdown = index_path.read_text(encoding="utf-8")
    found = parse_sections(markdown)
    expected = REQUIRED_SECTIONS.get(content_type, [])

    missing = [s for s in expected if s not in found]
    if missing:
        findings.error(slug, f"index.md missing required section(s): {', '.join(missing)}")

    # Order check only makes sense once all required sections are present.
    if not missing:
        positions = [found.index(s) for s in expected]
        if positions != sorted(positions):
            findings.error(
                slug,
                f"index.md sections out of order. Expected: {' > '.join(expected)}",
            )

    if not markdown.lstrip().startswith("---"):
        findings.error(slug, "index.md missing frontmatter block")


def main() -> None:
    parser = argparse.ArgumentParser(description="Validate catalog entries and generate catalog.json")
    parser.add_argument(
        "--check",
        action="store_true",
        help="Validate only; do not write catalog.json (use in CI)",
    )
    args = parser.parse_args()

    project_root = get_project_root()
    solutions_dir = project_root / "docs" / "solutions"
    output_path = project_root / "static" / "catalog.json"

    if not solutions_dir.exists():
        print(f"ERROR: Solutions directory not found at {solutions_dir}", file=sys.stderr)
        sys.exit(1)

    taxonomy, raw_taxonomy = load_taxonomy(solutions_dir)
    event_topics = load_event_topics(project_root)
    print(f"Loaded taxonomy ({len(taxonomy)} categories) and {len(event_topics)} event topics")

    findings = Findings()
    solutions = []

    for entry in sorted(solutions_dir.iterdir()):
        if not entry.is_dir() or entry.name.startswith("_"):
            continue

        meta_path = entry / "meta.yaml"
        if not meta_path.exists():
            findings.error(entry.name, "Missing meta.yaml")
            continue

        try:
            with open(meta_path, "r") as f:
                meta = yaml.safe_load(f)
        except yaml.YAMLError as exc:
            findings.error(entry.name, f"meta.yaml is not valid YAML: {exc}")
            continue

        if not isinstance(meta, dict):
            findings.error(entry.name, "meta.yaml must contain a mapping")
            continue

        validate_meta(meta, taxonomy, entry.name, event_topics, findings)
        validate_document(entry, meta.get("content_type", "solution"), entry.name, findings)

        solutions.append(meta)
        label = meta.get("content_type", "solution").upper()[:3]
        print(f"  {label}  {entry.name}/ -> {meta.get('name', 'UNNAMED')}")

    # Newest validated first: freshness drives catalog order and page 1 placement.
    # Stable sort: alphabetical first, then date descending, so ties stay alphabetical.
    solutions.sort(key=lambda s: str(s.get("name", "")))
    solutions.sort(key=lambda s: str(s.get("last_validated", "")), reverse=True)

    if findings.warnings:
        print(f"\n{len(findings.warnings)} warning(s):")
        for w in findings.warnings:
            print(w)

    if findings.errors:
        print(f"\n{len(findings.errors)} error(s):", file=sys.stderr)
        for e in findings.errors:
            print(e, file=sys.stderr)
        print(
            "\nFailed. See docs/solutions/_catalog/CONTRIBUTING.md for the entry format.",
            file=sys.stderr,
        )
        sys.exit(1)

    if args.check:
        print(f"\nValidated {len(solutions)} entries. No errors. (--check: nothing written)")
        return

    catalog = {
        "generated_at": datetime.now(timezone.utc).isoformat(),
        "schema_version": "1.0",
        "solutions": solutions,
        "taxonomy": raw_taxonomy,
    }

    output_path.parent.mkdir(parents=True, exist_ok=True)
    with open(output_path, "w") as f:
        json.dump(catalog, f, indent=2, default=str)

    print(f"\nWrote {output_path} with {len(solutions)} entries. No errors.")


if __name__ == "__main__":
    main()

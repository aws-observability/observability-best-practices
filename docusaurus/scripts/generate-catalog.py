#!/usr/bin/env python3
"""
Generate catalog.json from solution meta.yaml files.

Scans docusaurus/docs/solutions/*/meta.yaml, validates against taxonomy,
and outputs static/catalog.json for the front-end.

Usage:
    python scripts/generate-catalog.py

Run from the docusaurus/ directory, or set DOCUSAURUS_ROOT env var.
"""

import json
import os
import sys
from datetime import datetime, timezone
from pathlib import Path

try:
    import yaml
except ImportError:
    print("ERROR: PyYAML is required. Install with: pip install pyyaml", file=sys.stderr)
    sys.exit(1)


def get_project_root() -> Path:
    """Determine the docusaurus project root."""
    env_root = os.environ.get("DOCUSAURUS_ROOT")
    if env_root:
        return Path(env_root)

    # Try relative to script location
    script_dir = Path(__file__).resolve().parent
    if (script_dir.parent / "docusaurus.config.js").exists():
        return script_dir.parent

    # Try current working directory
    cwd = Path.cwd()
    if (cwd / "docusaurus.config.js").exists():
        return cwd

    print("ERROR: Cannot find docusaurus root. Run from docusaurus/ or set DOCUSAURUS_ROOT.", file=sys.stderr)
    sys.exit(1)


def load_taxonomy(solutions_dir: Path) -> dict:
    """Load taxonomy.yaml and return a dict with lists of valid IDs per category."""
    taxonomy_path = solutions_dir / "_catalog" / "taxonomy.yaml"
    if not taxonomy_path.exists():
        print(f"ERROR: taxonomy.yaml not found at {taxonomy_path}", file=sys.stderr)
        sys.exit(1)

    with open(taxonomy_path, "r") as f:
        raw = yaml.safe_load(f)

    # Extract just the IDs for validation
    taxonomy = {}
    for category, items in raw.items():
        if isinstance(items, list):
            taxonomy[category] = [item["id"] if isinstance(item, dict) else item for item in items]

    return taxonomy, raw


def validate_meta(meta: dict, taxonomy: dict, slug: str) -> list[str]:
    """Validate a meta.yaml against the taxonomy. Returns list of warnings."""
    warnings = []

    # Default content_type for backward compatibility
    meta.setdefault("content_type", "solution")

    if meta["content_type"] not in ("solution", "guide"):
        warnings.append(f"  [{slug}] Invalid content_type: '{meta['content_type']}'")

    # Guides are advisory content: no deploy steps, so no complexity/time/instrumentation.
    if meta["content_type"] == "guide":
        required_fields = [
            "name", "slug", "description", "workload_type",
            "signals", "status", "last_validated"
        ]
    else:
        required_fields = [
            "name", "slug", "description", "workload_type", "compute_platform",
            "backends", "signals", "instrumentation", "status", "setup_complexity",
            "time_to_value_minutes", "last_validated"
        ]

    for field in required_fields:
        if field not in meta:
            warnings.append(f"  [{slug}] Missing required field: {field}")

    # Validate slug matches directory name
    if meta.get("slug") and meta["slug"] != slug:
        warnings.append(f"  [{slug}] Slug '{meta['slug']}' does not match directory name '{slug}'")

    # Validate array fields against taxonomy
    array_validations = {
        "workload_type": "workload_types",
        "compute_platform": "compute_platforms",
        "backends": "backends",
        "signals": "signals",
    }

    for meta_field, taxonomy_key in array_validations.items():
        values = meta.get(meta_field, [])
        if isinstance(values, list) and taxonomy_key in taxonomy:
            for val in values:
                if val not in taxonomy[taxonomy_key]:
                    warnings.append(f"  [{slug}] Invalid {meta_field} value: '{val}'")

    # Validate single-value fields
    if meta.get("instrumentation") and "instrumentation" in taxonomy:
        if meta["instrumentation"] not in taxonomy["instrumentation"]:
            warnings.append(f"  [{slug}] Invalid instrumentation: '{meta['instrumentation']}'")

    if meta.get("setup_complexity") and "setup_complexity" in taxonomy:
        if meta["setup_complexity"] not in taxonomy["setup_complexity"]:
            warnings.append(f"  [{slug}] Invalid setup_complexity: '{meta['setup_complexity']}'")

    valid_statuses = ["active", "deprecated", "preview"]
    if meta.get("status") and meta["status"] not in valid_statuses:
        warnings.append(f"  [{slug}] Invalid status: '{meta['status']}'")

    return warnings


def main():
    project_root = get_project_root()
    solutions_dir = project_root / "docs" / "solutions"
    output_path = project_root / "static" / "catalog.json"

    if not solutions_dir.exists():
        print(f"ERROR: Solutions directory not found at {solutions_dir}", file=sys.stderr)
        sys.exit(1)

    # Load taxonomy
    taxonomy, raw_taxonomy = load_taxonomy(solutions_dir)
    print(f"Loaded taxonomy with {len(taxonomy)} categories")

    # Scan for solution directories
    solutions = []
    all_warnings = []

    for entry in sorted(solutions_dir.iterdir()):
        if not entry.is_dir():
            continue
        if entry.name.startswith("_"):
            continue

        meta_path = entry / "meta.yaml"
        if not meta_path.exists():
            print(f"  SKIP: {entry.name}/ (no meta.yaml)")
            continue

        with open(meta_path, "r") as f:
            meta = yaml.safe_load(f)

        # Validate
        warnings = validate_meta(meta, taxonomy, entry.name)
        all_warnings.extend(warnings)

        # Add to catalog
        solutions.append(meta)
        print(f"  OK: {entry.name}/ -> {meta.get('name', 'UNNAMED')}")

    # Newest validated first: freshness drives catalog order (and page 1 placement).
    # Stable sort: alphabetical first, then by date descending — ties stay alphabetical.
    solutions.sort(key=lambda s: str(s.get("name", "")))
    solutions.sort(key=lambda s: str(s.get("last_validated", "")), reverse=True)

    # Build catalog output
    catalog = {
        "generated_at": datetime.now(timezone.utc).isoformat(),
        "schema_version": "1.0",
        "solutions": solutions,
        "taxonomy": raw_taxonomy,
    }

    # Write output
    output_path.parent.mkdir(parents=True, exist_ok=True)
    with open(output_path, "w") as f:
        json.dump(catalog, f, indent=2, default=str)

    print(f"\nGenerated {output_path} with {len(solutions)} solutions")

    # Report warnings
    if all_warnings:
        print(f"\n⚠️  {len(all_warnings)} validation warnings:")
        for w in all_warnings:
            print(w)
        # Exit with warning code but don't fail CI
        sys.exit(0)
    else:
        print("✅ All solutions passed validation")


if __name__ == "__main__":
    main()

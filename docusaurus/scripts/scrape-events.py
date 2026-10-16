#!/usr/bin/env python3
"""Fetch Cloud-Operations-Enablement events from the AWS Experience API and
produce an events.json array consumable by the Observability Best Practices
Docusaurus site.

Usage:
    python3 scrape-events.py                     # JSON to stdout
    python3 scrape-events.py --output events.json # write to file
    python3 scrape-events.py --future-only        # exclude past events

The script uses only the Python standard library (no pip dependencies).
"""

import argparse
import json
import re
import ssl
import sys
import urllib.error
import urllib.request
from datetime import datetime, timezone

# ---------------------------------------------------------------------------
# Constants
# ---------------------------------------------------------------------------

API_URL = "https://aws-experience.com/amer/smb/api/session"
REGISTER_BASE = "https://aws-experience.com/amer/smb/e"

# Theme display order — must match THEME_ORDER in EventCard/index.js.
THEME_ORDER = [
    "Amazon CloudWatch Omni",
    "One Observability Workshop",
    "CloudWatch Fundamentals & What's New",
    "DevOps Agent",
    "GenAI Observability",
    "Database Observability",
    "Security Visibility",
    "Regional & In-Person Events",
    "OpenTelemetry native AWS",
]

# ---------------------------------------------------------------------------
# Mapping helpers
# ---------------------------------------------------------------------------


def _ci(text: str, *terms: str) -> bool:
    """Case-insensitive check: return True if ANY term appears in *text*.

    Uses a word-start boundary to prevent false positives like 'RDS' matching
    inside 'Dashboards', but allows natural suffixes (e.g. 'Agent' matches
    'Agents').
    """
    lower = text.lower()
    for t in terms:
        # Require a non-letter (or start of string) before the term
        pattern = r"(?<![a-z])" + re.escape(t.lower())
        if re.search(pattern, lower):
            return True
    return False


def derive_theme(title: str, setting: str) -> str:
    """Derive the theme field from the event title and setting.

    Rules are evaluated in order; first match wins.
    """
    t = title

    if _ci(t, "Omni"):
        return "Amazon CloudWatch Omni"
    if _ci(t, "One Observability") or t.startswith("Hands-On AWS Observability"):
        return "One Observability Workshop"
    if _ci(t, "DevOps Agent"):
        return "DevOps Agent"
    if _ci(t, "GenAI", "Generative AI") or (_ci(t, "Bedrock") and _ci(t, "Observability")):
        return "GenAI Observability"
    if _ci(t, "Database", "Performance Insights", "Database Insights"):
        return "Database Observability"
    if _ci(t, "Security", "CloudTrail"):
        return "Security Visibility"
    if _ci(t, "500 Bits", "OpenTelemetry", "OTel"):
        return "OpenTelemetry native AWS"
    if setting == "physical":
        return "Regional & In-Person Events"
    if _ci(t, "CloudWatch", "Every Signal", "Fundamentals"):
        return "CloudWatch Fundamentals & What's New"
    return "CloudWatch Fundamentals & What's New"


def derive_topics(title: str, theme: str) -> list[str]:
    """Derive the topics array from the event title and resolved theme."""
    topics: list[str] = []

    def _add(*vals: str) -> None:
        for v in vals:
            if v not in topics:
                topics.append(v)

    if theme == "GenAI Observability" or _ci(title, "GenAI", "Bedrock", "Generative AI"):
        _add("genai", "ai-ml")
    if theme == "DevOps Agent" or _ci(title, "DevOps Agent"):
        _add("devops-agent", "aiops")
    if theme == "Database Observability" or _ci(title, "Database", "RDS", "Aurora"):
        _add("databases")
    if theme == "Security Visibility" or _ci(title, "Security", "CloudTrail"):
        _add("security")
    if theme == "Amazon CloudWatch Omni":
        _add("cloudwatch", "apm")
    if _ci(title, "APM", "Application Performance"):
        _add("apm", "applications")
    if _ci(title, "Logs", "Log"):
        _add("logs")
    if _ci(title, "Metrics", "Alarms", "Dashboards"):
        _add("metrics", "cloudwatch")

    # Always include cloudwatch
    if "cloudwatch" not in topics:
        _add("cloudwatch")
    # If nothing specific matched beyond cloudwatch, add general
    if topics == ["cloudwatch"]:
        _add("general")

    return topics


def derive_format(event_type: str, setting: str) -> str:
    """Map API type + setting to a human-readable format string."""
    if setting == "physical":
        return "In-person event"
    mapping = {
        "handsonworkshop": "Hands-on workshop",
        "technicaltalk": "Technical talk",
    }
    return mapping.get((event_type or "").lower(), "Technical talk")


def derive_level(levels: list) -> int:
    """Extract integer level from the API levels array."""
    if levels:
        try:
            return int(levels[0])
        except (ValueError, TypeError):
            pass
    return 200


def _extract_setting(setting_details: list | None) -> str:
    """Extract the setting value ('virtual' or 'physical') from the
    settingDetails list returned by the API."""
    if not setting_details or not isinstance(setting_details, list):
        return "virtual"
    for entry in setting_details:
        if isinstance(entry, dict) and "setting" in entry:
            return entry["setting"].lower()
    return "virtual"


def derive_location(setting: str, setting_details: list | None) -> str:
    """Derive a human-readable location string.

    For physical events we return 'In-person' to match the existing
    events.json convention — the address formats from the API are too
    inconsistent for reliable city extraction.
    """
    if setting == "virtual":
        return "Online"
    if setting == "physical":
        return "In-person"
    return "Online"


# ---------------------------------------------------------------------------
# HTML stripping
# ---------------------------------------------------------------------------

_TAG_RE = re.compile(r"<[^>]+>")
_WHITESPACE_RE = re.compile(r"\s+")


def strip_html(html: str) -> str:
    """Remove HTML tags and collapse whitespace to produce a plain-text
    description."""
    text = _TAG_RE.sub(" ", html)
    text = _WHITESPACE_RE.sub(" ", text).strip()
    return text


# ---------------------------------------------------------------------------
# Date formatting
# ---------------------------------------------------------------------------


def parse_utc_time(iso_str: str) -> datetime | None:
    """Parse a UTC timestamp from the API.

    The API returns formats like '2026-10-16T17:30' (no seconds, no Z).
    """
    if not iso_str:
        return None
    cleaned = iso_str.strip().rstrip("Z")
    # Remove fractional seconds if present
    cleaned = re.sub(r"\.\d+$", "", cleaned)
    for fmt in ("%Y-%m-%dT%H:%M:%S", "%Y-%m-%dT%H:%M"):
        try:
            return datetime.strptime(cleaned, fmt).replace(tzinfo=timezone.utc)
        except ValueError:
            continue
    return None


def format_date(dt: datetime) -> str:
    """Format a datetime as 'Ddd D Mon' (no year), e.g. 'Fri 16 Oct'."""
    day_name = dt.strftime("%a")
    month_name = dt.strftime("%b")
    return f"{day_name} {dt.day} {month_name}"


def format_time_range(start_utc: datetime, end_utc: datetime) -> str:
    """Format a time range as 'HH:MM \u2013 HH:MM UTC'."""
    s = start_utc.strftime("%H:%M")
    e = end_utc.strftime("%H:%M")
    return f"{s} \u2013 {e} UTC"


# ---------------------------------------------------------------------------
# API fetch
# ---------------------------------------------------------------------------


def fetch_sessions() -> list[dict]:
    """Fetch sessions from the AWS Experience API.

    The API returns ``{"future": [...], "past": [...]}``. We combine both
    lists so the caller can decide whether to include past events.
    """
    ctx = ssl.create_default_context()
    req = urllib.request.Request(
        API_URL,
        headers={
            "Accept": "application/json",
            "User-Agent": "observability-best-practices-scraper/1.0",
        },
    )
    try:
        with urllib.request.urlopen(req, context=ctx, timeout=30) as resp:
            data = json.loads(resp.read().decode("utf-8"))
    except urllib.error.HTTPError as exc:
        print(f"ERROR: HTTP {exc.code} from {API_URL}", file=sys.stderr)
        sys.exit(1)
    except urllib.error.URLError as exc:
        print(f"ERROR: Cannot reach {API_URL}: {exc.reason}", file=sys.stderr)
        sys.exit(1)
    except Exception as exc:
        print(f"ERROR: Unexpected error fetching sessions: {exc}", file=sys.stderr)
        sys.exit(1)

    if isinstance(data, dict):
        future = data.get("future", [])
        past = data.get("past", [])
        if isinstance(future, list) and isinstance(past, list):
            return future + past

    # Fallback: if the shape changes, try common patterns
    if isinstance(data, list):
        return data
    print(f"WARNING: Unexpected API response shape: {type(data).__name__}", file=sys.stderr)
    return []


# ---------------------------------------------------------------------------
# Transform pipeline
# ---------------------------------------------------------------------------


def build_register_url(url_slug: str) -> str:
    """Build the full registration URL from the urlSlug field."""
    if not url_slug:
        return ""
    return f"{REGISTER_BASE}/{url_slug}"


def transform_session(session: dict) -> dict | None:
    """Transform a raw API session into the intermediate representation used
    for grouping.  Returns None if essential fields are missing."""
    title = (session.get("title") or "").strip()
    if not title:
        return None

    start_utc = parse_utc_time(session.get("startInUtc", ""))
    end_utc = parse_utc_time(session.get("endInUtc", ""))
    if not start_utc or not end_utc:
        return None

    setting_details = session.get("settingDetails")
    setting = _extract_setting(setting_details)
    event_type = (session.get("type") or "technicaltalk").strip()
    levels = session.get("levels") or []
    url_slug = (session.get("urlSlug") or "").strip()

    # Prefer summary (plain text) over description (HTML).
    description = (session.get("summary") or "").strip()
    if not description:
        description = strip_html(session.get("description") or "")

    return {
        "title": title,
        "description": description,
        "setting": setting,
        "setting_details": setting_details,
        "type": event_type,
        "levels": levels,
        "start_utc": start_utc,
        "end_utc": end_utc,
        "url_slug": url_slug,
        "start_utc_iso": session.get("startInUtc", ""),
    }


def group_and_build(sessions: list[dict], future_only: bool = False) -> list[dict]:
    """Group transformed sessions by title, sort, and build the final
    events.json entries."""
    now = datetime.now(timezone.utc)

    # Deduplicate: (title, startInUtc ISO string) -> skip duplicates
    seen: set[tuple[str, str]] = set()
    groups: dict[str, list[dict]] = {}

    for s in sessions:
        key = (s["title"], s["start_utc_iso"])
        if key in seen:
            continue
        seen.add(key)

        if future_only and s["start_utc"] < now:
            continue

        groups.setdefault(s["title"], []).append(s)

    # Sort each group by start time (earliest first)
    for title in groups:
        groups[title].sort(key=lambda x: x["start_utc"])

    # Build output entries
    entries: list[dict] = []
    for title, sessions_list in groups.items():
        primary = sessions_list[0]

        theme = derive_theme(title, primary["setting"])
        topics = derive_topics(title, theme)
        fmt = derive_format(primary["type"], primary["setting"])
        level = derive_level(primary["levels"])
        location = derive_location(primary["setting"], primary.get("setting_details"))

        additional_dates = []
        for s in sessions_list[1:]:
            loc = derive_location(s["setting"], s.get("setting_details"))
            additional_dates.append({
                "date": format_date(s["start_utc"]),
                "time": format_time_range(s["start_utc"], s["end_utc"]),
                "location": loc,
                "registerUrl": build_register_url(s["url_slug"]),
            })

        entry = {
            "theme": theme,
            "level": level,
            "format": fmt,
            "name": title,
            "description": primary["description"],
            "date": format_date(primary["start_utc"]),
            "time": format_time_range(primary["start_utc"], primary["end_utc"]),
            "location": location,
            "registerUrl": build_register_url(primary["url_slug"]),
            "additionalDates": additional_dates,
            "topics": topics,
        }
        entries.append(entry)

    # Sort: by THEME_ORDER index, then by earliest date within theme
    theme_index = {t: i for i, t in enumerate(THEME_ORDER)}
    default_theme_idx = len(THEME_ORDER)

    def sort_key(entry: dict) -> tuple:
        tidx = theme_index.get(entry["theme"], default_theme_idx)
        title_sessions = groups.get(entry["name"], [])
        earliest = (
            title_sessions[0]["start_utc"]
            if title_sessions
            else datetime.min.replace(tzinfo=timezone.utc)
        )
        return (tidx, earliest)

    entries.sort(key=sort_key)
    return entries


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------


def main() -> None:
    parser = argparse.ArgumentParser(
        description="Fetch Cloud-Operations-Enablement events from the AWS "
        "Experience API and produce events.json.",
    )
    parser.add_argument(
        "--output", "-o",
        help="Write JSON to this file instead of stdout.",
    )
    parser.add_argument(
        "--future-only",
        action="store_true",
        help="Exclude events whose start time is in the past.",
    )
    args = parser.parse_args()

    # 1. Fetch
    print("Fetching sessions from AWS Experience API...", file=sys.stderr)
    raw_sessions = fetch_sessions()
    print(f"Fetched {len(raw_sessions)} events", file=sys.stderr)

    # 2. Filter to Cloud-Operations-Enablement series
    cloud_ops = [
        s for s in raw_sessions
        if "Cloud-Operations-Enablement" in (s.get("series") or [])
    ]
    print(f"Filtered to {len(cloud_ops)} Cloud-Ops events", file=sys.stderr)

    # 3. Transform
    transformed = []
    skipped = 0
    for s in cloud_ops:
        t = transform_session(s)
        if t:
            transformed.append(t)
        else:
            skipped += 1
    if skipped:
        print(f"Skipped {skipped} events with missing fields", file=sys.stderr)

    # 4. Group, deduplicate, sort, build
    entries = group_and_build(transformed, future_only=args.future_only)
    print(f"Produced {len(entries)} grouped events", file=sys.stderr)

    # 5. Output
    output = json.dumps(entries, indent=2, ensure_ascii=False) + "\n"

    if args.output:
        with open(args.output, "w", encoding="utf-8") as f:
            f.write(output)
        print(f"Wrote {args.output}", file=sys.stderr)
    else:
        sys.stdout.write(output)


if __name__ == "__main__":
    main()

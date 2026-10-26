#!/usr/bin/env python3
"""Fetch Cloud Operations events from the awsworkshop.io feed and produce an
events.json array consumable by the Observability Best Practices Docusaurus
site.

The feed at https://awsworkshop.io/data/feed.json is the full workshop catalog.
This script filters to the CloudOps category, groups sessions of the same
workshop title into a single event entry (first session = primary date, the
rest = additionalDates), and writes the same schema previously produced by the
aws-experience.com scraper.

Usage:
    python3 scrape-events.py                     # JSON to stdout
    python3 scrape-events.py --output events.json # write to file
    python3 scrape-events.py --future-only        # exclude past sessions

The script uses only the Python standard library (no pip dependencies).
"""

import argparse
import json
import re
import ssl
import sys
import urllib.error
import urllib.request
from datetime import datetime, timedelta, timezone

# ---------------------------------------------------------------------------
# Constants
# ---------------------------------------------------------------------------

FEED_URL = "https://awsworkshop.io/data/feed.json"
CLOUDOPS_CATEGORY = "CloudOps"

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
# Date / time helpers
# ---------------------------------------------------------------------------


def parse_session_times(session: dict) -> tuple[datetime | None, datetime | None]:
    """Parse the start and end UTC datetimes from a feed session.

    The feed provides ``date`` (YYYY-MM-DD), ``timeUtc`` (HH:MM), and
    ``durationMinutes``.  Some sessions also carry ``endTimeUtc``.
    """
    date_str = session.get("date", "")
    time_str = session.get("timeUtc", "")
    if not date_str or not time_str:
        return None, None

    try:
        start = datetime.strptime(f"{date_str}T{time_str}", "%Y-%m-%dT%H:%M").replace(
            tzinfo=timezone.utc
        )
    except ValueError:
        return None, None

    # Prefer explicit endTimeUtc when available
    end_time_str = session.get("endTimeUtc", "")
    if end_time_str:
        try:
            end = datetime.strptime(f"{date_str}T{end_time_str}", "%Y-%m-%dT%H:%M").replace(
                tzinfo=timezone.utc
            )
            # Handle midnight crossover
            if end <= start:
                end += timedelta(days=1)
            return start, end
        except ValueError:
            pass

    # Fall back to durationMinutes
    duration = session.get("durationMinutes")
    if duration:
        try:
            end = start + timedelta(minutes=int(duration))
            return start, end
        except (ValueError, TypeError):
            pass

    return start, None


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
# Feed-specific helpers
# ---------------------------------------------------------------------------


def infer_event_type(session: dict, duration_minutes: int | None) -> str:
    """Infer whether a session is a hands-on workshop or a technical talk.

    The feed does not carry an explicit type field.  Workshops are typically
    120+ minutes; talks are 60 minutes.  The session title can also hint at
    the format.
    """
    title = (session.get("title") or "").lower()
    if "workshop" in title or "hands-on" in title or "activation day" in title:
        return "handsonworkshop"
    if duration_minutes and duration_minutes >= 120:
        return "handsonworkshop"
    return "technicaltalk"


# ---------------------------------------------------------------------------
# Feed fetch
# ---------------------------------------------------------------------------


def fetch_feed() -> dict:
    """Fetch the full workshop feed from awsworkshop.io.

    Returns the parsed JSON object which contains ``sessions``,
    ``workshops``, and ``categories`` arrays.
    """
    ctx = ssl.create_default_context()
    req = urllib.request.Request(
        FEED_URL,
        headers={
            "Accept": "application/json",
            "User-Agent": "observability-best-practices-scraper/2.0 (awsworkshop.io feed)",
        },
    )
    try:
        with urllib.request.urlopen(req, context=ctx, timeout=30) as resp:
            data = json.loads(resp.read().decode("utf-8"))
    except urllib.error.HTTPError as exc:
        print(f"ERROR: HTTP {exc.code} from {FEED_URL}", file=sys.stderr)
        sys.exit(1)
    except urllib.error.URLError as exc:
        print(f"ERROR: Cannot reach {FEED_URL}: {exc.reason}", file=sys.stderr)
        sys.exit(1)
    except Exception as exc:
        print(f"ERROR: Unexpected error fetching feed: {exc}", file=sys.stderr)
        sys.exit(1)

    if not isinstance(data, dict):
        print(f"ERROR: Unexpected feed shape: {type(data).__name__}", file=sys.stderr)
        sys.exit(1)
    return data


# ---------------------------------------------------------------------------
# Transform pipeline
# ---------------------------------------------------------------------------


def build_workshop_index(workshops: list[dict]) -> dict[str, dict]:
    """Build a lookup from workshop id to workshop metadata.

    Workshop ids correspond to the ``workshopType`` field on sessions.
    """
    return {w["id"]: w for w in workshops if "id" in w}


def transform_session(
    session: dict,
    workshop_index: dict[str, dict],
) -> dict | None:
    """Transform a raw feed session into an intermediate representation used
    for grouping.  Returns None if essential fields are missing."""
    title = (session.get("title") or "").strip()
    if not title:
        return None

    start_utc, end_utc = parse_session_times(session)
    if not start_utc or not end_utc:
        return None

    raw_duration = session.get("durationMinutes")
    try:
        duration = int(raw_duration) if raw_duration is not None else None
    except (ValueError, TypeError):
        duration = None
    event_type = infer_event_type(session, duration)

    # Look up the workshop to get description and level
    workshop_type = session.get("workshopType", "")
    workshop = workshop_index.get(workshop_type, {})

    # Prefer the session summary; fall back to the workshop summary, then
    # the workshop description (which may contain HTML/markdown).
    description = (session.get("summary") or "").strip()
    if not description:
        description = (workshop.get("summary") or "").strip()
    if not description:
        description = strip_html(workshop.get("description") or "")

    # Level comes from the workshop metadata (sessions don't carry it).
    workshop_level_str = workshop.get("level", "200")
    try:
        level = int(workshop_level_str)
    except (ValueError, TypeError):
        level = 200

    url = (session.get("url") or "").strip()

    # The feed is entirely virtual events; no setting field exists.
    setting = "virtual"

    return {
        "title": title,
        "description": description,
        "setting": setting,
        "type": event_type,
        "level": level,
        "start_utc": start_utc,
        "end_utc": end_utc,
        "url": url,
        "start_utc_iso": f"{session.get('date', '')}T{session.get('timeUtc', '')}",
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
        level = primary["level"]
        location = "Online" if primary["setting"] == "virtual" else "In-person"

        additional_dates = []
        for s in sessions_list[1:]:
            loc = "Online" if s["setting"] == "virtual" else "In-person"
            additional_dates.append({
                "date": format_date(s["start_utc"]),
                "time": format_time_range(s["start_utc"], s["end_utc"]),
                "location": loc,
                "registerUrl": s["url"],
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
            "registerUrl": primary["url"],
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
        description="Fetch Cloud Operations events from the awsworkshop.io "
        "feed and produce events.json.",
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
    print(f"Fetching feed from {FEED_URL}...", file=sys.stderr)
    feed = fetch_feed()
    all_sessions = feed.get("sessions", [])
    all_workshops = feed.get("workshops", [])
    print(f"Fetched {len(all_sessions)} total sessions, {len(all_workshops)} workshops", file=sys.stderr)

    # 2. Filter to CloudOps category
    cloudops_sessions = [
        s for s in all_sessions
        if s.get("category") == CLOUDOPS_CATEGORY
    ]
    print(f"Filtered to {len(cloudops_sessions)} CloudOps sessions", file=sys.stderr)

    # 3. Build workshop lookup and transform
    workshop_index = build_workshop_index(all_workshops)
    transformed = []
    skipped = 0
    for s in cloudops_sessions:
        t = transform_session(s, workshop_index)
        if t:
            transformed.append(t)
        else:
            skipped += 1
    if skipped:
        print(f"Skipped {skipped} sessions with missing fields", file=sys.stderr)

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

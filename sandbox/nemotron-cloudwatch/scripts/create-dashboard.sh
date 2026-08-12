#!/usr/bin/env bash
# Creates the CloudWatch dashboard for the AI-Q agent — all three signals on one page.
#
# Layout (24-column grid, top to bottom):
#   row 1  latency percentiles + per-agent latency        (metrics, from traces)
#   row 2  call volume + token cost by model              (metrics, from traces)
#   row 3  token cost by agent + LLM-call efficiency      (metrics, from traces)
#   row 4  slowest traces                                 (traces,  aws/spans)
#   row 5  span breakdown by agent                        (traces,  aws/spans)
#   row 6  agent log volume by severity + recent WARN/ERROR (logs,  /aiq/agent)
#
# Everything here is derived from spans the agent already emits — no agent code
# changes. See collector/collector-full.yaml for how the metrics are synthesized.
#
# Usage:
#   ./scripts/create-dashboard.sh                  # create/update
#   ./scripts/create-dashboard.sh --name MyBoard   # custom name
#   ./scripts/create-dashboard.sh --dry-run        # print the JSON only
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
WS2_DIR="$(dirname "$SCRIPT_DIR")"

# shellcheck source=scripts/load-env.sh
source "$SCRIPT_DIR/load-env.sh"

DASH_NAME="AIQ-Agent-Observability"
DRY_RUN=0

while [[ $# -gt 0 ]]; do
  case "$1" in
    --name)    DASH_NAME="${2:?}"; shift 2 ;;
    --dry-run) DRY_RUN=1; shift ;;
    # Print the header block, stopping at the first non-comment line: a hardcoded
    # range leaks code into --help whenever the header changes length.
    -h|--help) awk 'NR==1 {next} /^#/ {sub(/^# ?/, ""); print; next} {exit}' "$0"; exit 0 ;;
    *) echo "Unknown option: $1" >&2; exit 2 ;;
  esac
done

load_env "$WS2_DIR/.env" || true

AWS_REGION="${AWS_REGION:-us-west-2}"
SERVICE="${OTEL_SERVICE_NAME:-aiq-observability-workshop}"
NAMESPACE="AIQ/Agent"
LOG_GROUP="${LOG_GROUP:-/aiq/agent}"
SPANS_LOG_GROUP="${SPANS_LOG_GROUP:-aws/spans}"
export AWS_PAGER=""

# The agents to break out individually. Discovered from the metrics themselves so
# the dashboard matches whatever actually ran, rather than a hardcoded guess that
# silently renders empty widgets.
#
# A while-read loop rather than `mapfile -t`: mapfile is bash 4+, and macOS still
# ships bash 3.2 as /bin/bash, where it fails with "mapfile: command not found".
AGENTS=()
while IFS= read -r agent; do
  [[ -n "$agent" ]] && AGENTS+=("$agent")
done < <(
  aws cloudwatch list-metrics --namespace "$NAMESPACE" \
    --metric-name traces.span.metrics.duration --region "$AWS_REGION" \
    --query 'Metrics[].Dimensions' --output json 2>/dev/null \
  | python3 -c '
import sys, json
names = set()
for dims in json.load(sys.stdin):
    d = {x["Name"]: x["Value"] for x in dims}
    # Only the (service.name, nat.function.name) sets — skip span.name and the
    # stale OTelLib-only series left by any pre-fix experiments.
    if "nat.function.name" in d and "service.name" in d:
        names.add(d["nat.function.name"])
for n in sorted(names):
    print(n)
' 2>/dev/null || true
)

if [[ "${#AGENTS[@]}" -eq 0 ]]; then
  echo "WARNING: no per-agent metrics found in $NAMESPACE." >&2
  echo "         Run scripts/loadgen.sh first, or the widgets will be empty." >&2
  AGENTS=(root intent_classifier shallow_research_agent web_search_tool)
fi

# To stderr, so `--dry-run | jq` and similar stay pipeable.
{
  echo "Dashboard : $DASH_NAME"
  echo "Region    : $AWS_REGION"
  echo "Service   : $SERVICE"
  echo "Agents    : ${AGENTS[*]}"
} >&2

# Build the JSON in Python — hand-rolling this much nested JSON in bash is how
# you get an unparseable dashboard and a useless error message.
#
# The generator is staged to a temp file rather than heredoc'd straight into a
# `$( ... )`: bash 3.2 (still /bin/bash on macOS) cannot parse a heredoc inside a
# command substitution and dies with "unexpected EOF while looking for matching )".
PY_SRC="$(mktemp -t aiq-dashboard)" || { echo "mktemp failed" >&2; exit 1; }
trap 'rm -f "$PY_SRC"' EXIT

cat > "$PY_SRC" <<'PY'
import json, os

region  = os.environ["REGION"]
svc     = os.environ["SERVICE"]
ns      = os.environ["NAMESPACE"]
lg      = os.environ["LOG_GROUP"]
spans   = os.environ["SPANS_LOG_GROUP"]
agents  = [a for a in os.environ["AGENTS_CSV"].split(",") if a]

widgets = []
y = 0

def add(w, h, x, width, **kw):
    """Append a widget at the current row offset."""
    widgets.append({"type": kw.pop("type", "metric"), "x": x, "y": y,
                    "width": width, "height": h, "properties": w})

# ---------------------------------------------------------------- row 0: header
widgets.append({
    "type": "text", "x": 0, "y": y, "width": 24, "height": 2,
    "properties": {"markdown": (
        f"# AI-Q Agent Observability — `{svc}`\n"
        "All three signals, derived entirely from spans the agent already emits "
        "(**no agent code changes**). "
        f"Metrics: `{ns}` · Traces: `{spans}` · Logs: `{lg}`"
    )},
})
y += 2

# ------------------------------------------------------- row 1: latency (metrics)
# Percentiles work only because the collector uses an EXPONENTIAL histogram.
# With explicit buckets awsemf emits Max/Min of 0 and every percentile reads 0.0.
add({
    "title": "Query latency percentiles (all spans)",
    "view": "timeSeries", "stacked": False, "region": region,
    "metrics": [
        [ns, "traces.span.metrics.duration", "service.name", svc,
         {"stat": "p50", "label": "p50"}],
        ["...", {"stat": "p90", "label": "p90"}],
        ["...", {"stat": "p99", "label": "p99"}],
        ["...", {"stat": "Maximum", "label": "max"}],
    ],
    "yAxis": {"left": {"label": "ms", "showUnits": False, "min": 0}},
    "period": 60,
}, h=6, x=0, width=12)

add({
    "title": "Latency by agent (p90)",
    "view": "timeSeries", "stacked": False, "region": region,
    "metrics": [
        [ns, "traces.span.metrics.duration", "service.name", svc,
         "nat.function.name", a, {"label": a}]
        for a in agents
    ],
    "yAxis": {"left": {"label": "ms", "showUnits": False, "min": 0}},
    "stat": "p90", "period": 60,
}, h=6, x=12, width=12)
y += 6

# ------------------------------------------- row 2: volume + token cost (metrics)
add({
    "title": "Call volume by agent",
    "view": "timeSeries", "stacked": True, "region": region,
    "metrics": [
        [ns, "traces.span.metrics.calls", "service.name", svc,
         "nat.function.name", a, {"label": a}]
        for a in agents
    ],
    "yAxis": {"left": {"label": "calls", "showUnits": False, "min": 0}},
    "stat": "Sum", "period": 300,
}, h=6, x=0, width=12)

add({
    "title": "Token cost by model (prompt vs completion)",
    "view": "timeSeries", "stacked": False, "region": region,
    "metrics": [
        [ns, "gen_ai.client.token_usage.prompt", "service.name", svc,
         "nat.subspan.name", "nvidia.nemotron-super-3-120b", {"label": "prompt"}],
        [ns, "gen_ai.client.token_usage.completion", "service.name", svc,
         "nat.subspan.name", "nvidia.nemotron-super-3-120b", {"label": "completion"}],
    ],
    "yAxis": {"left": {"label": "tokens", "showUnits": False, "min": 0}},
    "stat": "Sum", "period": 300,
}, h=6, x=12, width=12)
y += 6

# --------------------------------------- row 3: token attribution + efficiency
add({
    "title": "Prompt tokens by agent",
    "view": "timeSeries", "stacked": True, "region": region,
    "metrics": [
        [ns, "gen_ai.client.token_usage.prompt", "service.name", svc,
         "nat.function.name", a, {"label": a}]
        for a in agents
    ],
    "yAxis": {"left": {"label": "tokens", "showUnits": False, "min": 0}},
    "stat": "Sum", "period": 300,
}, h=6, x=0, width=12)

# Average tokens per LLM call: a rising line means prompts are growing (context
# accumulation), which is the usual cause of a slow agent that isn't network-bound.
add({
    "title": "Avg tokens per LLM call",
    "view": "timeSeries", "stacked": False, "region": region,
    "metrics": [
        [ns, "gen_ai.client.token_usage.prompt", "service.name", svc,
         "nat.subspan.name", "nvidia.nemotron-super-3-120b",
         {"stat": "Average", "label": "prompt / call"}],
        [ns, "gen_ai.client.token_usage.completion", "service.name", svc,
         "nat.subspan.name", "nvidia.nemotron-super-3-120b",
         {"stat": "Average", "label": "completion / call"}],
    ],
    "yAxis": {"left": {"label": "tokens", "showUnits": False, "min": 0}},
    "period": 300,
}, h=6, x=12, width=12)
y += 6

# ------------------------------------------------------- row 4: traces (aws/spans)
# Logs Insights over aws/spans rather than the X-Ray widget: it works for traces
# of any size, including runs big enough for X-Ray to return LimitExceeded.
add({
    "title": "Slowest queries (end-to-end, from spans)",
    "view": "table", "region": region,
    "query": (
        f"SOURCE '{spans}'\n"
        "| filter `attributes.nat.function.name` = 'root'\n"
        "| fields traceId, durationNano/1000000000 as seconds\n"
        "| sort seconds desc\n"
        "| limit 20"
    ),
}, h=7, x=0, width=12, type="log")

add({
    "title": "Time spent by agent (sum of span durations)",
    "view": "table", "region": region,
    "query": (
        f"SOURCE '{spans}'\n"
        "| stats sum(durationNano)/1000000000 as total_sec,\n"
        "        avg(durationNano)/1000000    as avg_ms,\n"
        "        max(durationNano)/1000000    as max_ms,\n"
        "        count(*) as spans\n"
        "    by `attributes.nat.function.name` as agent\n"
        "| sort total_sec desc"
    ),
}, h=7, x=12, width=12, type="log")
y += 7

# --------------------------------------------------- row 5: LLM calls (aws/spans)
add({
    "title": "Most expensive LLM calls (prompt tokens)",
    "view": "table", "region": region,
    "query": (
        f"SOURCE '{spans}'\n"
        "| filter ispresent(`attributes.llm.token_count.prompt`)\n"
        "| fields `attributes.nat.function.name` as agent,\n"
        "         `attributes.llm.token_count.prompt`     as prompt_tokens,\n"
        "         `attributes.llm.token_count.completion` as completion_tokens,\n"
        "         durationNano/1000000 as ms\n"
        "| sort prompt_tokens desc\n"
        "| limit 20"
    ),
}, h=7, x=0, width=24, type="log")
y += 7

# --------------------------------------------------------- row 6: logs (/aiq/agent)
add({
    "title": "Log volume by severity",
    "view": "timeSeries", "stacked": True, "region": region,
    "query": (
        f"SOURCE '{lg}'\n"
        "| stats count(*) by bin(1m), severityText"
    ),
}, h=6, x=0, width=12, type="log")

add({
    "title": "Warnings and errors",
    "view": "table", "region": region,
    "query": (
        f"SOURCE '{lg}'\n"
        "| filter severityText in ['WARN', 'WARNING', 'ERROR', 'CRITICAL']\n"
        "| fields @timestamp, severityText, `attributes.logger` as logger,\n"
        "         `attributes.msg` as message\n"
        "| sort @timestamp desc\n"
        "| limit 20"
    ),
}, h=6, x=12, width=12, type="log")
y += 6

# ------------------------------------------------------------------ row 7: footer
widgets.append({
    "type": "text", "x": 0, "y": y, "width": 24, "height": 3,
    "properties": {"markdown": (
        "**Reading this dashboard.** Start top-left: if p99 latency spikes, check "
        "*Latency by agent* to see which agent owns it, then *Slowest queries* for a "
        "`traceId` and open it in the X-Ray console for the full span tree. "
        "*Most expensive LLM calls* usually explains a slow agent — a large prompt, "
        "not slow tooling.\n\n"
        "**Caveats.** Agent log lines carry no trace ID, so log↔trace correlation is "
        "by timestamp and logger name. Trace panels read `aws/spans` via Logs Insights "
        "rather than the X-Ray widget, because very large traces exceed X-Ray's "
        "per-trace limit and disappear from the trace view entirely."
    )},
})

print(json.dumps({"widgets": widgets}, indent=1))
PY

DASH_JSON="$(
  AGENTS_CSV="$(IFS=,; echo "${AGENTS[*]}")" \
  REGION="$AWS_REGION" SERVICE="$SERVICE" NAMESPACE="$NAMESPACE" \
  LOG_GROUP="$LOG_GROUP" SPANS_LOG_GROUP="$SPANS_LOG_GROUP" \
  python3 "$PY_SRC"
)"

if [[ "$DRY_RUN" -eq 1 ]]; then
  printf '%s\n' "$DASH_JSON"
  exit 0
fi

# put-dashboard validates server-side and returns non-fatal warnings for things
# like metrics that do not exist yet — surface them rather than swallowing.
VALIDATION="$(aws cloudwatch put-dashboard \
  --dashboard-name "$DASH_NAME" \
  --dashboard-body "$DASH_JSON" \
  --region "$AWS_REGION" \
  --query 'DashboardValidationMessages' --output json)"

if [[ "$VALIDATION" != "[]" && "$VALIDATION" != "null" ]]; then
  echo
  echo "Validation messages from CloudWatch:"
  printf '%s\n' "$VALIDATION"
fi

echo
echo "Created/updated dashboard: $DASH_NAME"
echo "  https://${AWS_REGION}.console.aws.amazon.com/cloudwatch/home?region=${AWS_REGION}#dashboards/dashboard/${DASH_NAME}"

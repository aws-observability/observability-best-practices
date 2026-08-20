#!/usr/bin/env bash
# Runs the whole blog end-to-end, in the one order that works:
#
#   1. setup.sh            build the agent env + CloudWatch prerequisites
#   2. run-collector.sh    start the collector (all three signals)
#   3. loadgen.sh          generate traffic
#   4. create-dashboard.sh build the dashboard
#
# The ordering is not cosmetic. create-dashboard.sh discovers which agents to
# break out by reading the metrics that already exist, so running it before any
# traffic gives you a dashboard of empty widgets — and an empty widget looks
# exactly like a broken one in the console.
#
# Usage:
#   ./scripts/all.sh                      # full run, 9 queries
#   ./scripts/all.sh --queries 12         # more traffic
#   ./scripts/all.sh --skip-setup         # env already built
#   ./scripts/all.sh --stop-collector     # stop the collector when done
#   ./scripts/all.sh --dry-run            # print the plan, run nothing
#
# Keys are read from the environment if set, so this is CI-friendly:
#   AWS_BEARER_TOKEN_BEDROCK=... TAVILY_API_KEY=... ./scripts/all.sh
set -uo pipefail   # not -e: we want to report which step failed, not die silently

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
WS2_DIR="$(dirname "$SCRIPT_DIR")"

# shellcheck source=scripts/load-env.sh
source "$SCRIPT_DIR/load-env.sh"

COLLECTOR_CONFIG="collector/collector-full.yaml"
QUERIES=9
SKIP_SETUP=0
STOP_COLLECTOR=0
DRY_RUN=0
# After loadgen finishes, the last spans still have to flush through the
# connectors (15s interval) and then land in CloudWatch as metrics via EMF.
# Creating the dashboard immediately would run its agent discovery against
# metrics that have not appeared yet.
SETTLE_SECS="${SETTLE_SECS:-45}"

# Print the header comment block as help. Stops at the first non-comment line
# rather than using a hardcoded line range, which silently starts leaking code
# into --help the moment the header grows or shrinks.
usage() {
  awk 'NR==1 {next} /^#/ {sub(/^# ?/, ""); print; next} {exit}' "$0"
  exit 0
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    --queries)        QUERIES="${2:?}"; shift 2 ;;
    --config)         COLLECTOR_CONFIG="${2:?}"; shift 2 ;;
    --skip-setup)     SKIP_SETUP=1; shift ;;
    --stop-collector) STOP_COLLECTOR=1; shift ;;
    --settle)         SETTLE_SECS="${2:?}"; shift 2 ;;
    --dry-run)        DRY_RUN=1; shift ;;
    -h|--help)        usage ;;
    *) echo "Unknown option: $1 (try --help)" >&2; exit 2 ;;
  esac
done

[[ "$QUERIES" =~ ^[0-9]+$ && "$QUERIES" -gt 0 ]] \
  || { echo "--queries must be a positive integer" >&2; exit 2; }
[[ "$SETTLE_SECS" =~ ^[0-9]+$ ]] \
  || { echo "--settle must be a non-negative integer" >&2; exit 2; }

hr()   { printf '\n\033[1m%s\033[0m\n' "======================================================================"; }
head_() { hr; printf '\033[1m %s\033[0m\n' "$*"; hr; }
die()  { printf '\n\033[31mFAILED at step %s\033[0m — %s\n' "$1" "$2" >&2; exit 1; }

if [[ "$DRY_RUN" -eq 1 ]]; then
  echo "Plan:"
  [[ "$SKIP_SETUP" -eq 1 ]] && echo "  1. setup.sh              (skipped)" \
                            || echo "  1. setup.sh"
  echo "  2. run-collector.sh $COLLECTOR_CONFIG"
  echo "  3. loadgen.sh --queries $QUERIES"
  echo "  4. settle ${SETTLE_SECS}s, then create-dashboard.sh"
  [[ "$STOP_COLLECTOR" -eq 1 ]] && echo "  5. stop-collector.sh"
  exit 0
fi

START_ALL="$(date +%s)"

# --- 1. Setup ----------------------------------------------------------------
if [[ "$SKIP_SETUP" -eq 1 ]]; then
  head_ "[1/4] Setup — skipped (--skip-setup)"
  [[ -f "$WS2_DIR/.env" ]] \
    || die "1/4" "--skip-setup was given but $WS2_DIR/.env does not exist. Run without it."
else
  head_ "[1/4] Setup — agent environment + CloudWatch prerequisites"
  bash "$SCRIPT_DIR/setup.sh" \
    || die "1/4" "setup.sh reported [fail] items. Fix them and re-run; it is idempotent."
fi

# Every later step needs .env. setup.sh writes it; sourcing here also means an
# AWS_PROFILE captured at setup time applies to the collector and the dashboard.
load_env "$WS2_DIR/.env" \
  || die "1/4" "$WS2_DIR/.env was not created — cannot continue."
export AWS_REGION="${AWS_REGION:-us-west-2}"

# --- 2. Collector ------------------------------------------------------------
head_ "[2/4] Collector — starting all three signal pipelines"
bash "$SCRIPT_DIR/run-collector.sh" "$COLLECTOR_CONFIG" \
  || die "2/4" "the collector did not come up. See $WS2_DIR/.collector.log"

# --- 3. Traffic --------------------------------------------------------------
head_ "[3/4] Traffic — $QUERIES queries through the agent"
echo "Deep queries fan out across many tool calls and take minutes each."
echo
bash "$SCRIPT_DIR/loadgen.sh" --queries "$QUERIES"
LOADGEN_RC=$?

# loadgen deliberately does not fail the run on a single bad query, and neither
# do we — partial traffic still produces a usable dashboard. But say so plainly
# rather than letting a silent partial run look like a clean one.
if [[ "$LOADGEN_RC" -ne 0 ]]; then
  printf '\n\033[33mWARNING\033[0m loadgen.sh exited %d — some queries may have failed.\n' "$LOADGEN_RC"
  echo "        Continuing: the dashboard is still built from whatever telemetry arrived."
fi

# --- 4. Dashboard ------------------------------------------------------------
head_ "[4/4] Dashboard — waiting ${SETTLE_SECS}s for metrics to land"
echo "Spans flush through the connectors every 15s, then reach CloudWatch as"
echo "metrics via EMF. The dashboard's agent discovery needs them present."
sleep "$SETTLE_SECS"

bash "$SCRIPT_DIR/create-dashboard.sh" \
  || die "4/4" "create-dashboard.sh failed. Re-run it alone once metrics appear."

# --- Wrap up -----------------------------------------------------------------
if [[ "$STOP_COLLECTOR" -eq 1 ]]; then
  echo
  bash "$SCRIPT_DIR/stop-collector.sh" || true
fi

ELAPSED=$(( $(date +%s) - START_ALL ))
head_ "Done in $(( ELAPSED / 60 ))m $(( ELAPSED % 60 ))s"

cat <<EOF
  Dashboard
    https://${AWS_REGION}.console.aws.amazon.com/cloudwatch/home?region=${AWS_REGION}#dashboards/dashboard/AIQ-Agent-Observability

  Traces   CloudWatch -> X-Ray traces, or Logs Insights over aws/spans
  Metrics  CloudWatch -> Metrics -> AIQ/Agent
  Logs     CloudWatch -> Log groups -> ${LOG_GROUP:-/aiq/agent}

  Collector counters (verify zero drops)
    curl -s localhost:8888/metrics | grep -E 'otelcol_exporter_(sent|send_failed)'
EOF

if [[ "$STOP_COLLECTOR" -eq 0 ]]; then
  echo
  echo "  The collector is still running. Stop it with:"
  echo "    bash $SCRIPT_DIR/stop-collector.sh"
fi

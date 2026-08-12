#!/usr/bin/env bash
# Tears down everything setup.sh, run-collector.sh, loadgen.sh and
# create-dashboard.sh left behind, in dependency order:
#
#   1. stop the collector          (before deleting what it writes to)
#   2. delete the dashboard
#   3. delete the two log groups   (/aiq/agent and the EMF group)
#   4. remove local state          (.env with the API keys, logs, agent checkout)
#
# Three things this cannot undo, by design:
#   * Custom metrics in AIQ/Agent cannot be deleted. The namespace expires on
#     CloudWatch's own 15-month schedule.
#   * aws/spans is Region-wide and shared by anything else using Transaction
#     Search, so it is never touched here.
#   * Transaction Search stays enabled, and billing, until you revert it with
#     `aws xray update-trace-segment-destination --destination XRay`.
#
# Usage:
#   ./scripts/cleanup.sh              # prompt before deleting AWS resources
#   ./scripts/cleanup.sh --yes        # no prompt
#   ./scripts/cleanup.sh --dry-run    # print what would be deleted
#   ./scripts/cleanup.sh --keep-local # AWS resources only; leave .env and the agent
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
WS2_DIR="$(dirname "$SCRIPT_DIR")"
# The repo root *is* WS2_DIR. This must match setup.sh exactly: the rm -rf guard
# below compares AGENT_DIR against "$REPO_DIR/agent", so a mismatch between the
# two scripts would either skip the cleanup or aim it at the wrong directory.
REPO_DIR="$WS2_DIR"

# shellcheck source=scripts/load-env.sh
source "$SCRIPT_DIR/load-env.sh"

ASSUME_YES=0
DRY_RUN=0
KEEP_LOCAL=0

while [[ $# -gt 0 ]]; do
  case "$1" in
    -y|--yes)     ASSUME_YES=1; shift ;;
    --dry-run)    DRY_RUN=1; shift ;;
    --keep-local) KEEP_LOCAL=1; shift ;;
    # Print the header block, stopping at the first non-comment line: a hardcoded
    # range leaks code into --help whenever the header changes length.
    -h|--help) awk 'NR==1 {next} /^#/ {sub(/^# ?/, ""); print; next} {exit}' "$0"; exit 0 ;;
    *) echo "Unknown option: $1 (try --help)" >&2; exit 2 ;;
  esac
done

# Read the same values setup.sh wrote, so we delete what was actually created
# rather than the defaults below. An explicit AWS_REGION or LOG_GROUP in the
# environment still wins over both — see scripts/load-env.sh.
load_env "$WS2_DIR/.env" || true

AWS_REGION="${AWS_REGION:-us-west-2}"
LOG_GROUP="${LOG_GROUP:-/aiq/agent}"
EMF_LOG_GROUP="${EMF_LOG_GROUP:-/aws/emf/aiq}"
DASH_NAME="${DASH_NAME:-AIQ-Agent-Observability}"
AGENT_DIR="${AGENT_DIR:-${WS1_DIR:-$REPO_DIR/agent}}"

export AWS_REGION AWS_DEFAULT_REGION="$AWS_REGION"
export AWS_PAGER=""

step() { printf '\n\033[1m=== %s\033[0m\n' "$*"; }
ok()   { printf '  \033[32m[ok]\033[0m   %s\n' "$*"; }
warn() { printf '  \033[33m[warn]\033[0m %s\n' "$*"; }
skip() { printf '  \033[90m[skip]\033[0m %s\n' "$*"; }

# ---------------------------------------------------------------------------
# Confirmation. Deleting a log group takes its contents with it, and both
# groups may hold spans and EMF records from runs other than this one.
cat <<EOF

This will delete, in $AWS_REGION:
  dashboard   $DASH_NAME
  log group   $LOG_GROUP        (agent runtime logs)
  log group   $EMF_LOG_GROUP    (EMF records behind the AIQ/Agent metrics)
EOF
if [[ "$KEEP_LOCAL" -eq 0 ]]; then
  cat <<EOF
and locally:
  $WS2_DIR/.env             (API keys)
  $WS2_DIR/.aiq-agent.log, .collector.*, .loadgen/, .ws1_dir, bin/
EOF
  # Only claim the agent checkout when we will actually remove it. Saying
  # otherwise about an rm -rf target is how people lose directories.
  if [[ "$AGENT_DIR" == "$REPO_DIR/agent" && -d "$AGENT_DIR" ]]; then
    echo "  $AGENT_DIR                (AI-Q checkout and venv)"
  elif [[ -d "${AGENT_DIR:-}" ]]; then
    echo
    echo "NOT deleted: $AGENT_DIR"
    echo "  Your agent lives outside this project, so cleanup leaves it alone."
  fi
fi
cat <<EOF

Not deleted: custom metrics in AIQ/Agent (cannot be), the Region-wide
aws/spans log group, and Transaction Search (still enabled, still billing).

EOF

if [[ "$DRY_RUN" -eq 1 ]]; then
  echo "--dry-run: nothing was deleted."
  exit 0
fi

if [[ "$ASSUME_YES" -eq 0 ]]; then
  read -r -p "Proceed? [y/N] " REPLY
  case "$REPLY" in
    [yY]|[yY][eE][sS]) ;;
    *) echo "Aborted."; exit 0 ;;
  esac
fi

# ---------------------------------------------------------------------------
step "[1/4] Stopping the collector"
# First, so it cannot write to a log group mid-delete and recreate the stream.
if bash "$SCRIPT_DIR/stop-collector.sh"; then
  ok "collector stopped"
else
  warn "stop-collector.sh reported a problem — check for a stray otelcol-contrib"
fi

# ---------------------------------------------------------------------------
step "[2/4] Deleting the dashboard"
if aws cloudwatch delete-dashboards --dashboard-names "$DASH_NAME" 2>/dev/null; then
  ok "$DASH_NAME"
else
  # delete-dashboards is idempotent and returns 0 for a missing dashboard, so a
  # failure here is credentials or Region, not absence.
  warn "could not delete $DASH_NAME — check credentials and AWS_REGION"
fi

# ---------------------------------------------------------------------------
step "[3/4] Deleting the log groups"
for LG in "$LOG_GROUP" "$EMF_LOG_GROUP"; do
  if aws logs delete-log-group --log-group-name "$LG" 2>/dev/null; then
    ok "$LG"
  else
    # ResourceNotFoundException is the common case on a second run.
    skip "$LG (absent, or already deleted)"
  fi
done
warn "custom metrics in AIQ/Agent remain — they expire on CloudWatch's 15-month schedule"

# ---------------------------------------------------------------------------
step "[4/4] Removing local state"
if [[ "$KEEP_LOCAL" -eq 1 ]]; then
  skip "--keep-local: .env, logs, and $AGENT_DIR left in place"
else
  rm -f  "$WS2_DIR/.env" \
         "$WS2_DIR/.aiq-agent.log" \
         "$WS2_DIR/.collector.pid" \
         "$WS2_DIR/.collector.log" \
         "$WS2_DIR/.ws1_dir"
  rm -rf "$WS2_DIR/.loadgen" "$WS2_DIR/bin"
  ok "removed .env, agent log, collector state, .loadgen/, bin/"

  # Guard the rm -rf. AGENT_DIR comes from .env and may point at a checkout this
  # project did not create — setup.sh explicitly supports reusing NVIDIA's
  # workshop tree by setting AGENT_DIR at it. Deleting that would take the
  # reader's workshop with it, so only remove the default location setup.sh
  # builds ($REPO_DIR/agent). Anything else is reported, not deleted.
  if [[ "$AGENT_DIR" == "$REPO_DIR/agent" && -d "$AGENT_DIR" ]]; then
    rm -rf "$AGENT_DIR"
    ok "removed $AGENT_DIR"
  elif [[ -d "${AGENT_DIR:-}" ]]; then
    warn "$AGENT_DIR is not the default checkout — left in place, remove it by hand if you want it gone"
  else
    skip "no agent checkout at $AGENT_DIR"
  fi
fi

# ---------------------------------------------------------------------------
printf '\n\033[32m  DONE\033[0m — AWS resources and local state removed.\n\n'
echo "  Still active, and still billing:"
echo "    X-Ray Transaction Search. To revert:"
echo "      aws xray update-trace-segment-destination --destination XRay"
echo "    The Region-wide aws/spans log group, left alone deliberately."
echo "  Rotate your Tavily and Serper keys — .env is deleted, but the keys are still live."
echo

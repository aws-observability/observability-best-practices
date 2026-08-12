#!/usr/bin/env bash
# Starts the otelcol-contrib collector in the background with the given config,
# waits for its OTLP port to open, and writes the PID + log path so stop-collector.sh
# can manage it.
#
# Usage: run-collector.sh <config-file>
#   e.g. run-collector.sh collector/collector-traces.yaml
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
WS2_DIR="$(dirname "$SCRIPT_DIR")"
BIN="$WS2_DIR/bin/otelcol-contrib"
CONFIG="${1:?Usage: run-collector.sh <config-file>}"
PIDFILE="$WS2_DIR/.collector.pid"
LOGFILE="$WS2_DIR/.collector.log"

# shellcheck source=scripts/load-env.sh
source "$SCRIPT_DIR/load-env.sh"

# The collector authenticates to CloudWatch with sigv4auth, which resolves
# credentials the same way the AWS CLI does — so without AWS_PROFILE it silently
# uses the *default* profile, not the account setup.sh provisioned. The failure is
# a long way from the cause: traces come back 400 "The OTLP API is supported with
# CloudWatch Logs as a destination" (Transaction Search is off in that other
# account) and logs 400 "The specified log group does not exist". Both look like
# configuration bugs rather than a credential mismatch.
load_env "$WS2_DIR/.env" || true

: "${AWS_REGION:?Set AWS_REGION (e.g. us-west-2) before starting the collector}"

# Fail fast and loudly if the credentials point somewhere the prerequisites were
# not created, instead of discovering it in the exporter counters later.
if command -v aws >/dev/null; then
  if ! ACCOUNT="$(aws sts get-caller-identity --query Account --output text 2>/dev/null)"; then
    echo "WARNING: could not resolve AWS credentials — the collector will start," >&2
    echo "         but every export will be rejected. Check AWS_PROFILE." >&2
  elif ! aws logs describe-log-groups --log-group-name-prefix "${LOG_GROUP:-/aiq/agent}" \
          --query 'logGroups[0].logGroupName' --output text 2>/dev/null | grep -q .; then
    echo "WARNING: ${LOG_GROUP:-/aiq/agent} does not exist in account $ACCOUNT" >&2
    echo "         (region $AWS_REGION, profile ${AWS_PROFILE:-default})." >&2
    echo "         Logs and traces will be rejected with HTTP 400. Re-run scripts/setup.sh" >&2
    echo "         against this account, or set AWS_PROFILE to the one it provisioned." >&2
  else
    echo "Credentials: account $ACCOUNT, profile ${AWS_PROFILE:-default}"
  fi
fi

# The full config expands these. Defaults match scripts/setup.sh so the collector
# still starts if .env was not sourced.
export AWS_REGION
export LOG_GROUP="${LOG_GROUP:-/aiq/agent}"
export LOG_STREAM="${LOG_STREAM:-otel}"
export EMF_LOG_GROUP="${EMF_LOG_GROUP:-/aws/emf/aiq}"
export AIQ_LOG_FILE="${AIQ_LOG_FILE:-$WS2_DIR/.aiq-agent.log}"

# file_log fails to start if its target does not exist yet. The agent creates it
# on first run, which may be after the collector starts.
touch "$AIQ_LOG_FILE" 2>/dev/null || true

# Stop any previous instance.
"$SCRIPT_DIR/stop-collector.sh" 2>/dev/null || true

echo "Starting collector with config: $CONFIG (region: $AWS_REGION)"
"$BIN" --config "file:$WS2_DIR/$CONFIG" >"$LOGFILE" 2>&1 &
echo $! >"$PIDFILE"

# Wait up to 15s for the OTLP/HTTP port (4318) to accept connections.
#
# Probe with a real OTLP POST, not /dev/tcp: the collector binds [::]:4318 (IPv6
# wildcard) and /dev/tcp/127.0.0.1/4318 reports failure against it even while
# HTTP to localhost:4318 succeeds — a false negative that makes a healthy
# collector look dead.
for i in $(seq 1 15); do
  if curl -s -o /dev/null --max-time 2 -X POST "http://localhost:4318/v1/traces" \
       -H 'Content-Type: application/json' -d '{"resourceSpans":[]}' 2>/dev/null; then
    echo "Collector is up (pid $(cat "$PIDFILE")). Logs: $LOGFILE"
    exit 0
  fi
  sleep 1
done

echo "Collector did not open port 4318 in time. Recent logs:" >&2
tail -n 30 "$LOGFILE" >&2
exit 1

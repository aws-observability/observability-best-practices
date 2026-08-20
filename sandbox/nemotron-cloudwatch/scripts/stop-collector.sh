#!/usr/bin/env bash
# Stops the background collector started by run-collector.sh.
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
WS2_DIR="$(dirname "$SCRIPT_DIR")"
PIDFILE="$WS2_DIR/.collector.pid"

BIN="$WS2_DIR/bin/otelcol-contrib"

if [[ -f "$PIDFILE" ]]; then
  PID="$(cat "$PIDFILE")"
  if kill -0 "$PID" 2>/dev/null; then
    kill "$PID" && echo "Stopped collector (pid $PID)."
  fi
  rm -f "$PIDFILE"
else
  echo "No collector pidfile; nothing to stop."
fi

# Also clear collectors started outside this script (a crashed run, or a manual
# invocation during debugging). They keep holding ports 4318 and 8888, and the
# next start then fails with "address already in use" — pointing at the internal
# telemetry port rather than the actual cause.
if pgrep -f "$BIN" >/dev/null 2>&1; then
  echo "Stopping other otelcol-contrib processes..."
  pkill -f "$BIN" 2>/dev/null || true
  for _ in 1 2 3 4 5; do
    pgrep -f "$BIN" >/dev/null 2>&1 || break
    sleep 1
  done
  pgrep -f "$BIN" >/dev/null 2>&1 && pkill -9 -f "$BIN" 2>/dev/null || true
fi

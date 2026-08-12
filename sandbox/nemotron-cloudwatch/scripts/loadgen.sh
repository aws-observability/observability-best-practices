#!/usr/bin/env bash
# Traffic generator for the observability blog.
#
# Runs a mix of query shapes against the AI-Q agent so the CloudWatch
# dashboards have a realistic spread of latency and token cost instead of the
# two or three data points you get from hand-running the notebook.
#
# The mix matters. Three shapes, deliberately different:
#   meta    - answered by one cheap LLM call, no tools      (fast, cheap)
#   shallow - one or two web searches, short synthesis      (medium)
#   deep    - researcher fans out across many tool calls    (slow, expensive)
#
# That spread is what makes the dashboard readable: p50 vs p99 separate, the
# token histogram gets a long tail, and the deep queries produce the slow
# outlier used in the trace/metric/log correlation walkthrough.
#
# Usage:
#   ./scripts/loadgen.sh                          # 9 queries, 2 at a time
#   ./scripts/loadgen.sh --queries 30 --concurrency 3
#   ./scripts/loadgen.sh --mix 6,3,1              # meta,shallow,deep weights
#   ./scripts/loadgen.sh --deep-only --queries 4  # just the expensive shape
#   ./scripts/loadgen.sh --dry-run                # print the plan, run nothing
#
# Prerequisites: scripts/setup.sh has been run, and the collector is running
# (scripts/run-collector.sh collector/collector-full.yaml).
set -uo pipefail   # deliberately NOT -e: one failed query must not kill the run

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
WS2_DIR="$(dirname "$SCRIPT_DIR")"

# shellcheck source=scripts/load-env.sh
source "$SCRIPT_DIR/load-env.sh"

# --- Defaults ----------------------------------------------------------------
QUERIES=9
CONCURRENCY=2
MIX="5,3,1"          # meta,shallow,deep
CONFIG="configs/config_web_only_otel.yml"
DRY_RUN=0
DEEP_ONLY=0
# Deep queries are genuinely long: a measured run took 26+ minutes and 266 LLM
# calls to survey the Nemotron family. 900s would have killed healthy work, so
# the cap is set well above the observed worst case — it exists to catch a hang,
# not to bound normal latency.
TIMEOUT_SECS="${TIMEOUT_SECS:-3600}"
RETRIES="${RETRIES:-2}"          # retries per query, only on 429/throttling

# Print the header comment block as help, stopping at the first non-comment line.
# A hardcoded line range leaks code into --help as soon as the header changes
# length — which it had already started doing here.
usage() {
  awk 'NR==1 {next} /^#/ {sub(/^# ?/, ""); print; next} {exit}' "$0"
  exit 0
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    --queries)     QUERIES="${2:?}"; shift 2 ;;
    --concurrency) CONCURRENCY="${2:?}"; shift 2 ;;
    --mix)         MIX="${2:?}"; shift 2 ;;
    --config)      CONFIG="${2:?}"; shift 2 ;;
    --deep-only)   DEEP_ONLY=1; shift ;;
    --dry-run)     DRY_RUN=1; shift ;;
    -h|--help)     usage ;;
    *) echo "Unknown option: $1 (try --help)" >&2; exit 2 ;;
  esac
done

[[ "$QUERIES" =~ ^[0-9]+$ && "$QUERIES" -gt 0 ]] || { echo "--queries must be a positive integer" >&2; exit 2; }
[[ "$CONCURRENCY" =~ ^[0-9]+$ && "$CONCURRENCY" -gt 0 ]] || { echo "--concurrency must be a positive integer" >&2; exit 2; }

# --- Environment -------------------------------------------------------------
# load_env fills in only what the caller has not set, so
# AWS_PROFILE=other ./scripts/loadgen.sh targets `other` rather than whatever
# account the last setup.sh run happened to write. See scripts/load-env.sh.
load_env "$WS2_DIR/.env" || {
  echo "ERROR: $WS2_DIR/.env not found. Run scripts/setup.sh first." >&2
  exit 1
}

WS1_DIR="${WS1_DIR:?WS1_DIR not set — re-run scripts/setup.sh}"
[[ -n "${VIRTUAL_ENV:-}" ]] && export PATH="$VIRTUAL_ENV/bin:$PATH"

# The agent config references ${AIQ_LOG_FILE} with no fallback, and nat runs with
# WS1_DIR as its cwd — so an unset value would either abort the run or (with a
# relative default) write the log somewhere the collector is not watching, losing
# the logs signal silently. An .env written before this variable existed is the
# realistic way to hit it, hence the explicit check rather than a default here.
if [[ -z "${AIQ_LOG_FILE:-}" ]]; then
  echo "ERROR: AIQ_LOG_FILE is not set (stale $WS2_DIR/.env?)." >&2
  echo "       Re-run scripts/setup.sh to regenerate it." >&2
  exit 1
fi
export AIQ_LOG_FILE

command -v nat >/dev/null || { echo "ERROR: 'nat' CLI not on PATH. Re-run scripts/setup.sh." >&2; exit 1; }

cd "$WS1_DIR" || { echo "ERROR: cannot cd to $WS1_DIR" >&2; exit 1; }

# The OTel-enabled config lives in this repo but nat resolves configs relative
# to the workshop dir, so stage a copy (same thing the notebook does).
#
# Re-copy whenever the source differs, not just when the destination is missing.
# Staging only-if-absent silently runs a stale config after any edit to the
# repo original — a trap that cost real debugging time here when a newly
# added logging exporter appeared to do nothing.
CANDIDATE="$WS2_DIR/$(basename "$CONFIG")"
[[ -f "$CANDIDATE" ]] || CANDIDATE="$WS2_DIR/configs/$(basename "$CONFIG")"
if [[ -f "$CANDIDATE" ]]; then
  if ! cmp -s "$CANDIDATE" "$CONFIG" 2>/dev/null; then
    mkdir -p "$(dirname "$CONFIG")"
    cp "$CANDIDATE" "$CONFIG"
    echo "Staged $(basename "$CONFIG") into $WS1_DIR/$(dirname "$CONFIG")/"
  fi
elif [[ ! -f "$CONFIG" ]]; then
  echo "ERROR: config not found: $CONFIG" >&2
  exit 1
fi

# Warn (don't fail) if nothing is listening on the collector's OTLP port —
# queries would still run, but their telemetry would go nowhere.
#
# Probe with a real OTLP POST rather than bash's /dev/tcp: the collector binds
# [::]:4318 (IPv6 wildcard), and /dev/tcp/127.0.0.1/4318 reports failure against
# it even though HTTP to localhost:4318 succeeds — a false negative.
if ! curl -s -o /dev/null --max-time 5 \
     -X POST "http://localhost:4318/v1/traces" \
     -H 'Content-Type: application/json' -d '{"resourceSpans":[]}' 2>/dev/null; then
  echo "WARNING: nothing is listening on localhost:4318."
  echo "         Telemetry will be dropped. Start the collector first:"
  echo "           bash $WS2_DIR/scripts/run-collector.sh collector/collector-full.yaml"
  echo
fi

# --- Query pools -------------------------------------------------------------
# Varied wording per shape so repeated runs don't all collapse onto one cache
# path or one identical span tree.
META_QUERIES=(
  "Hello, what can you do?"
  "What kinds of questions are you good at?"
  "Summarize your capabilities in two sentences."
  "Who are you and what tools do you have?"
)
SHALLOW_QUERIES=(
  "What is Amazon Bedrock?"
  "What is NVIDIA Nemotron?"
  "What is OpenTelemetry used for?"
  "What is AWS X-Ray?"
  "What does an AI agent framework do?"
)
DEEP_QUERIES=(
  "Give a comprehensive overview of NVIDIA's Nemotron model family."
  "Compare the leading approaches to observability for LLM agents, with sources."
  "Analyze the tradeoffs between self-hosted GPU inference and managed model APIs."
  "Survey recent research on reasoning models and their token-cost behavior."
)

IFS=',' read -r W_META W_SHALLOW W_DEEP <<< "$MIX"
W_META="${W_META:-5}"; W_SHALLOW="${W_SHALLOW:-3}"; W_DEEP="${W_DEEP:-1}"
if [[ "$DEEP_ONLY" -eq 1 ]]; then W_META=0; W_SHALLOW=0; W_DEEP=1; fi
W_TOTAL=$(( W_META + W_SHALLOW + W_DEEP ))
[[ "$W_TOTAL" -gt 0 ]] || { echo "--mix weights sum to zero" >&2; exit 2; }

# Build the run plan. Two properties we want:
#   - proportions honour --mix across the whole run, not per weight-cycle
#     (a plain round-robin truncates mid-cycle and skews the tail)
#   - shapes are interleaved, so fast and slow queries overlap in time and the
#     dashboard shows a realistic mixed workload rather than three blocks
# Counts use largest-remainder; ordering uses stride scheduling. Both are
# deterministic, so a given --queries/--mix always yields the same plan — which
# matters for a blog whose screenshots should be reproducible.
PLAN_SHAPES_ORDERED="$(awk -v q="$QUERIES" -v wm="$W_META" -v ws="$W_SHALLOW" -v wd="$W_DEEP" '
  BEGIN {
    split("meta shallow deep", name, " ");
    w[1]=wm; w[2]=ws; w[3]=wd; tot=wm+ws+wd;
    # Largest remainder: floor the ideal share, then hand out the leftovers to
    # the largest fractional parts.
    assigned=0;
    for (i=1; i<=3; i++) { ideal=q*w[i]/tot; c[i]=int(ideal); frac[i]=ideal-c[i]; assigned+=c[i]; }
    for (leftover=q-assigned; leftover>0; leftover--) {
      best=0; bestf=-1;
      for (i=1; i<=3; i++) if (w[i]>0 && frac[i]>bestf) { bestf=frac[i]; best=i; }
      if (best==0) break;
      c[best]++; frac[best]=-1;
    }
    # Stride scheduling: repeatedly emit whichever shape is furthest behind its
    # ideal pace, which spreads the single deep query through the run instead of
    # pinning it to one position.
    for (n=0; n<q; n++) {
      best=0; bestv=0;
      for (i=1; i<=3; i++) {
        if (c[i]<=placed[i]) continue;
        v=(placed[i]+0.5)/c[i];                 # virtual finish time
        if (best==0 || v<bestv) { bestv=v; best=i; }
      }
      if (best==0) break;
      placed[best]++;
      print name[best];
    }
  }')"

declare -a PLAN_SHAPE PLAN_QUERY
mi=0; si=0; di=0
while IFS= read -r shape; do
  [[ -n "$shape" ]] || continue
  case "$shape" in
    meta)    q="${META_QUERIES[$(( mi++ % ${#META_QUERIES[@]} ))]}" ;;
    shallow) q="${SHALLOW_QUERIES[$(( si++ % ${#SHALLOW_QUERIES[@]} ))]}" ;;
    deep)    q="${DEEP_QUERIES[$(( di++ % ${#DEEP_QUERIES[@]} ))]}" ;;
    *) continue ;;
  esac
  PLAN_SHAPE+=("$shape"); PLAN_QUERY+=("$q")
done <<< "$PLAN_SHAPES_ORDERED"

if [[ "${#PLAN_QUERY[@]}" -eq 0 ]]; then
  echo "ERROR: produced an empty run plan (check --queries and --mix)" >&2
  exit 2
fi

RUN_DIR="$WS2_DIR/.loadgen"
mkdir -p "$RUN_DIR"
SUMMARY="$RUN_DIR/summary.tsv"

echo "======================================================================"
echo " AI-Q load generator"
echo "======================================================================"
echo "  workshop dir : $WS1_DIR"
echo "  config       : $CONFIG"
echo "  queries      : $QUERIES  (concurrency $CONCURRENCY)"
echo "  mix          : meta=$W_META shallow=$W_SHALLOW deep=$W_DEEP"
printf "  shapes       : meta=%d shallow=%d deep=%d\n" \
  "$(printf '%s\n' "${PLAN_SHAPE[@]}" | grep -c '^meta$')" \
  "$(printf '%s\n' "${PLAN_SHAPE[@]}" | grep -c '^shallow$')" \
  "$(printf '%s\n' "${PLAN_SHAPE[@]}" | grep -c '^deep$')"
echo "  logs         : $RUN_DIR/"
echo "======================================================================"
echo

if [[ "$DRY_RUN" -eq 1 ]]; then
  echo "Dry run — planned queries:"
  for (( n=0; n<${#PLAN_QUERY[@]}; n++ )); do
    printf "  %2d  %-8s %s\n" "$(( n+1 ))" "${PLAN_SHAPE[$n]}" "${PLAN_QUERY[$n]}"
  done
  echo
  echo "Deep queries fan out across many tool calls and can each take several minutes."
  exit 0
fi

: > "$SUMMARY"

# Portable elapsed-seconds helper (macOS bash 3.2 has no $EPOCHSECONDS).
now_s() { date +%s; }

run_with_timeout() {
  # run_with_timeout <secs> <cmd...> — stand-in for timeout(1), which macOS does
  # not ship (nor gtimeout, unless coreutils is installed). Without this the
  # timeout was silently a no-op and a wedged query would hang the whole run.
  #
  # The child gets its own process group so the kill reaches nat's grandchildren
  # too; a plain kill on the pid alone leaves them running. SIGTERM first, with a
  # short grace period, so the OTel exporter can flush the spans it already has
  # before SIGKILL. Exits 124 on timeout, matching timeout(1).
  local secs="$1"; shift
  perl -e '
    my $secs = shift @ARGV;
    my $pid = fork();
    die "fork failed: $!\n" unless defined $pid;
    if ($pid == 0) { setpgrp(0,0); exec @ARGV; exit 127; }
    $SIG{ALRM} = sub { kill("TERM", -$pid); sleep 5; kill("KILL", -$pid); exit 124; };
    alarm $secs;
    waitpid($pid, 0);
    my $st = $?;
    alarm 0;
    exit($st & 127 ? 128 + ($st & 127) : $st >> 8);
  ' "$secs" "$@"
}

invoke_nat() {
  # invoke_nat <query> <logfile> — returns nat's exit status (124 on timeout)
  local query="$1" log="$2"
  if command -v timeout >/dev/null 2>&1; then
    timeout "$TIMEOUT_SECS" nat run --config_file "$CONFIG" --input "$query" >"$log" 2>&1
  else
    run_with_timeout "$TIMEOUT_SECS" \
      nat run --config_file "$CONFIG" --input "$query" >"$log" 2>&1
  fi
}

run_one() {
  # run_one <index> <shape> <query>
  local idx="$1" shape="$2" query="$3"
  local log="$RUN_DIR/q$(printf '%03d' "$idx")-$shape.log"
  local start end elapsed status attempt=1 backoff_total=0

  start="$(now_s)"
  invoke_nat "$query" "$log"; status=$?

  # Bedrock throttles under concurrency. Back off and retry rather than
  # recording a spurious failure — a 429 is not the kind of error the blog is
  # trying to show. Deliberately capped at RETRIES so a hard quota problem
  # still surfaces instead of looping.
  while [[ "$status" -ne 0 && "$attempt" -le "$RETRIES" ]] \
        && grep -qE '429|Too Many Requests|ThrottlingException' "$log" 2>/dev/null; do
    local backoff=$(( attempt * 15 ))
    printf '  [%3d] %-8s throttled (429) — retry %d/%d in %ds\n' \
      "$idx" "$shape" "$attempt" "$RETRIES" "$backoff"
    sleep "$backoff"
    backoff_total=$(( backoff_total + backoff ))
    attempt=$(( attempt + 1 ))
    invoke_nat "$query" "$log"; status=$?
  done

  end="$(now_s)"
  # Exclude backoff sleeps: the reported latency should be the agent's, not ours.
  elapsed=$(( end - start - backoff_total ))

  local outcome="ok"
  if   [[ "$status" -eq 124 ]]; then outcome="timeout"
  elif [[ "$status" -ne 0   ]]; then outcome="error"
  fi

  # Sum NAT's per-call [Tokens] lines across the whole query. Reporting one line
  # would understate a deep query by orders of magnitude: a measured run made 278
  # LLM calls totalling 6.26M tokens.
  #
  # This is best-effort and deliberately not the blog's source of truth. Only the
  # deep-researcher path emits [Tokens] at all — meta/shallow queries print none,
  # yet their spans still carry llm.token_count.* (a meta query showing nothing
  # here recorded prompt=626 completion=75 on its span). Stdout undercounts; the
  # spans in aws/spans are complete. That gap is the whole argument for exporting
  # telemetry rather than reading logs.
  #
  # NAT colourises these lines, so strip ANSI escapes before parsing — otherwise
  # the escape bytes land in the TSV and corrupt any downstream table.
  local calls prompt completion
  read -r calls prompt completion <<<"$(
    sed $'s/\033\\[[0-9;]*m//g' "$log" 2>/dev/null \
    | awk -F'[=,]' '/\[Tokens\]/ { n++; p += $2; c += $4 }
                    END { printf "%d %d %d", n+0, p+0, c+0 }'
  )"

  local tokens=""
  if [[ "${calls:-0}" -gt 0 ]]; then
    tokens="calls=$calls prompt=$prompt completion=$completion total=$(( prompt + completion ))"
  fi

  printf '%d\t%s\t%s\t%ds\t%s\n' "$idx" "$shape" "$outcome" "$elapsed" "$tokens" >> "$SUMMARY"
  printf '  [%3d] %-8s %-7s %5ds  %s\n' "$idx" "$shape" "$outcome" "$elapsed" "$tokens"
}

START_ALL="$(now_s)"
echo "Running (this takes a while — deep queries are minutes each):"

# Simple concurrency gate: keep at most CONCURRENCY children alive.
#
# The `|| sleep 2` is not just belt-and-braces: `wait -n` is bash 4+, and macOS
# ships bash 3.2 as /bin/bash, where it exits 2 immediately ("invalid option").
# The fallback turns the gate into a 2-second poll there instead of a busy loop —
# same behaviour, slightly less prompt. Don't remove it.
for (( n=0; n<${#PLAN_QUERY[@]}; n++ )); do
  while (( $(jobs -rp | wc -l) >= CONCURRENCY )); do wait -n 2>/dev/null || sleep 2; done
  run_one "$(( n+1 ))" "${PLAN_SHAPE[$n]}" "${PLAN_QUERY[$n]}" &
done
wait
END_ALL="$(now_s)"

# --- Summary -----------------------------------------------------------------
TOTAL=$(wc -l < "$SUMMARY" | tr -d ' ')
OK=$(awk -F'\t' '$3=="ok"' "$SUMMARY" | wc -l | tr -d ' ')
ERR=$(awk -F'\t' '$3=="error"' "$SUMMARY" | wc -l | tr -d ' ')
TMO=$(awk -F'\t' '$3=="timeout"' "$SUMMARY" | wc -l | tr -d ' ')

echo
echo "======================================================================"
echo " Done in $(( END_ALL - START_ALL ))s — $OK ok, $ERR error, $TMO timeout (of $TOTAL)"
echo "======================================================================"
if [[ -s "$SUMMARY" ]]; then
  echo
  echo " Latency by shape (seconds):"
  awk -F'\t' '$3=="ok"{
      s=$2; v=$4; gsub("s","",v);
      n[s]++; sum[s]+=v;
      if (n[s]==1) { min[s]=v; max[s]=v }
      else { if (v<min[s]) min[s]=v; if (v>max[s]) max[s]=v }
    }
    END{
      for (s in n) printf("   %-8s n=%-3d min=%-5s avg=%-6.1f max=%s\n", s, n[s], min[s], sum[s]/n[s], max[s]);
    }' "$SUMMARY"
fi
echo
if [[ "$ERR" -gt 0 || "$TMO" -gt 0 ]]; then
  echo " Some queries did not succeed. Inspect their logs:"
  awk -F'\t' '$3!="ok"{printf("   %s/q%03d-%s.log\n", "'"$RUN_DIR"'", $1, $2)}' "$SUMMARY"
  echo
fi
echo " Telemetry should now be in CloudWatch:"
echo "   traces  : CloudWatch -> X-Ray traces  (look for the slowest deep query)"
echo "   logs    : CloudWatch -> Log groups -> ${LOG_GROUP:-/aiq/agent}"
echo "   metrics : CloudWatch -> Metrics  (see the blog's metrics section)"
echo
echo " Per-query summary: $SUMMARY"

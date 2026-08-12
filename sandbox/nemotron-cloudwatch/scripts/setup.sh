#!/usr/bin/env bash
# One-shot prerequisite setup for the observability blog.
#
# Builds everything the AI-Q agent needs (Workshop 1's environment) *and* the
# observability prerequisites, so the blog itself can start at "run the
# collector". Replaces hand-running Workshop 1's 00_Prerequisite notebook.
#
# What it does:
#   1. Clones the AI-Q blueprint (tag 2.0.0) and builds a Python 3.12 venv
#      with the `nat` CLI, from aiq's committed uv.lock.
#   2. Installs the NAT OpenTelemetry plugin (the `otelcollector` exporter).
#   3. Collects and validates the Bedrock and Tavily keys.
#   4. Creates the CloudWatch log group AND log stream (the OTLP logs endpoint
#      requires both to pre-exist; it does not create them).
#   5. Verifies X-Ray Transaction Search is enabled (required by the OTLP
#      traces endpoint) and Bedrock model access.
#   6. Downloads the collector binary.
#   7. Writes .env for loadgen.sh / the notebooks, then prints a preflight.
#
# Usage:
#   ./scripts/setup.sh                 # interactive (prompts for keys)
#   AWS_PROFILE=member2 ./scripts/setup.sh
#
# Keys are read from the environment if already set, so it is CI-friendly:
#   AWS_BEARER_TOKEN_BEDROCK=... TAVILY_API_KEY=... ./scripts/setup.sh
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
WS2_DIR="$(dirname "$SCRIPT_DIR")"
# The repo root *is* WS2_DIR — scripts/ sits directly under it. Deriving this as
# dirname(WS2_DIR) would point one level above the checkout, which is how the
# agent venv and the .gitignore check end up outside the repo entirely.
REPO_DIR="$WS2_DIR"

# --- Configuration (override via environment) --------------------------------
AWS_REGION="${AWS_REGION:-us-west-2}"
MODEL_ID="${MODEL_ID:-nvidia.nemotron-super-3-120b}"
LOG_GROUP="${LOG_GROUP:-/aiq/agent}"
LOG_STREAM="${LOG_STREAM:-otel}"
LOG_RETENTION_DAYS="${LOG_RETENTION_DAYS:-7}"
# EMF log group backing the metrics pipeline (awsemf exporter). CloudWatch reads
# EMF records from here and turns them into metrics in the AIQ/Agent namespace.
EMF_LOG_GROUP="${EMF_LOG_GROUP:-/aws/emf/aiq}"
# The agent's log file: NAT's `file` logging exporter writes it, the collector's
# file_log receiver tails it. This is the logs signal.
AIQ_LOG_FILE="${AIQ_LOG_FILE:-$WS2_DIR/.aiq-agent.log}"
AIQ_REPO_URL="https://github.com/NVIDIA-AI-Blueprints/aiq.git"
AIQ_REPO_TAG="${AIQ_REPO_TAG:-2.0.0}"

# Where the agent gets installed: the venv, the AI-Q clone, and the cwd that
# `nat run` executes from. Nothing needs to pre-exist here — this script creates
# it. If you already have NVIDIA's workshop checked out and want to reuse its
# venv, point AGENT_DIR at it.
#
# WS1_DIR is the old name for this and is still honoured, since it is what a
# previously generated .env exports.
AGENT_DIR="${AGENT_DIR:-${WS1_DIR:-$REPO_DIR/agent}}"
WS1_DIR="$AGENT_DIR"
VENV_DIR="$AGENT_DIR/.venv"
AIQ_DIR="$AGENT_DIR/aiq"

export AWS_REGION AWS_DEFAULT_REGION="$AWS_REGION"
export AWS_PAGER=""

# --- Output helpers ----------------------------------------------------------
step() { printf '\n\033[1m=== %s\033[0m\n' "$*"; }
ok()   { printf '  \033[32m[ok]\033[0m   %s\n' "$*"; }
warn() { printf '  \033[33m[warn]\033[0m %s\n' "$*"; }
fail() { printf '  \033[31m[fail]\033[0m %s\n' "$*"; }

PREFLIGHT_FAILED=0
note_fail() { fail "$*"; PREFLIGHT_FAILED=1; }

# ---------------------------------------------------------------------------
step "[1/7] Checking host prerequisites"

command -v git >/dev/null || { fail "git is required"; exit 1; }
command -v curl >/dev/null || { fail "curl is required"; exit 1; }
if ! command -v aws >/dev/null; then
  fail "The AWS CLI is required (for log groups, Transaction Search, Bedrock checks)."
  exit 1
fi
ok "git, curl, aws present"

# uv drives the Python toolchain, exactly as Workshop 1's notebook does.
export PATH="$HOME/.local/bin:$HOME/.cargo/bin:$PATH"
if ! command -v uv >/dev/null; then
  echo "  Installing uv..."
  curl -LsSf https://astral.sh/uv/install.sh | sh >/dev/null 2>&1
  export PATH="$HOME/.local/bin:$HOME/.cargo/bin:$PATH"
fi
command -v uv >/dev/null && ok "uv $(uv --version 2>/dev/null | awk '{print $2}')" || { fail "uv install failed"; exit 1; }

CALLER_ARN="$(aws sts get-caller-identity --query Arn --output text 2>/dev/null || true)"
if [[ -z "$CALLER_ARN" ]]; then
  fail "No usable AWS credentials. Set AWS_PROFILE (e.g. AWS_PROFILE=member2) and retry."
  exit 1
fi
ok "AWS identity: $CALLER_ARN"
ok "Region: $AWS_REGION"

# ---------------------------------------------------------------------------
step "[2/7] Building the AI-Q agent environment"

# Created if absent. This used to hard-exit unless NVIDIA's workshop checkout was
# already present, which made the script unusable for anyone who had not run the
# workshop first — and nothing here actually needs it: configs/config_web_only_otel.yml
# is self-contained, and this directory serves only as the venv location, the AI-Q
# clone parent, and the cwd `nat run` executes from.
mkdir -p "$AGENT_DIR/configs" || { fail "Cannot create $AGENT_DIR"; exit 1; }
if [[ -f "$AGENT_DIR/configs/config_web_only.yml" ]]; then
  ok "Existing workshop checkout detected: $AGENT_DIR"
else
  ok "Agent directory: $AGENT_DIR"
fi

# Clone AI-Q at the pinned tag. Idempotent: skip if the tag already matches.
if [[ -d "$AIQ_DIR/.git" ]] \
   && [[ "$(git -C "$AIQ_DIR" describe --tags --always 2>/dev/null)" == "$AIQ_REPO_TAG" ]]; then
  ok "AI-Q clone already at tag $AIQ_REPO_TAG (skipping)"
else
  rm -rf "$AIQ_DIR"
  echo "  Cloning AI-Q $AIQ_REPO_TAG..."
  git clone --depth 1 --branch "$AIQ_REPO_TAG" "$AIQ_REPO_URL" "$AIQ_DIR" >/dev/null 2>&1
  ok "Cloned AI-Q $AIQ_REPO_TAG"
fi

# Build the venv unless the nat CLI is already there (uv sync is slow).
if [[ -x "$VENV_DIR/bin/nat" ]]; then
  ok "venv already has the nat CLI (skipping build; rm -rf $VENV_DIR to rebuild)"
else
  echo "  Installing Python 3.12 + creating venv (this takes a few minutes)..."
  uv python install 3.12 >/dev/null 2>&1
  uv venv --python 3.12 --clear "$VENV_DIR" >/dev/null 2>&1
  export VIRTUAL_ENV="$VENV_DIR"

  echo "  Installing AI-Q dependencies from its committed uv.lock..."
  ( cd "$AIQ_DIR" && UV_PROJECT_ENVIRONMENT="$VENV_DIR" uv sync --frozen --no-dev >/dev/null 2>&1 )

  # Workspace tools live in aiq's dev group, which `uv sync --no-dev` skips.
  uv pip install -q -e "$AIQ_DIR/sources/tavily_web_search"

  # Same transitive-dependency fixups Workshop 1's notebook applies.
  uv pip uninstall -q chardet >/dev/null 2>&1 || true
  uv pip install -q --upgrade "requests==2.32.3" "urllib3==2.3.0" "charset-normalizer==3.4.1"
  ok "venv built"
fi

export VIRTUAL_ENV="$VENV_DIR"
export PATH="$VENV_DIR/bin:$PATH"
if [[ -x "$VENV_DIR/bin/nat" ]]; then
  ok "nat CLI: $("$VENV_DIR/bin/nat" --version 2>/dev/null || echo present)"
else
  note_fail "nat CLI missing after build — check the uv sync output above"
fi

# ---------------------------------------------------------------------------
step "[3/7] Installing the NAT OpenTelemetry plugin"

# This provides the `otelcollector` tracing exporter the observability config
# uses. Pin to the NAT version already in the venv so we don't silently
# upgrade the agent out from under Workshop 1.
NAT_VERSION="$(uv pip show nvidia-nat 2>/dev/null | awk '/^Version:/{print $2}' || true)"
if [[ -n "$NAT_VERSION" ]]; then
  if uv pip install -q "nvidia-nat-opentelemetry==$NAT_VERSION" 2>/dev/null; then
    ok "nvidia-nat-opentelemetry==$NAT_VERSION (pinned to installed NAT)"
  elif uv pip install -q "nvidia-nat[opentelemetry]==$NAT_VERSION" 2>/dev/null; then
    ok "nvidia-nat[opentelemetry]==$NAT_VERSION"
  else
    note_fail "Could not install the NAT OpenTelemetry plugin for NAT $NAT_VERSION"
  fi
else
  warn "Could not determine the installed NAT version; installing unpinned"
  uv pip install -q nvidia-nat-opentelemetry || note_fail "NAT OpenTelemetry plugin install failed"
fi

# Confirm the exporter actually registered under the `nat` CLI.
#
# Two non-obvious requirements here:
#   COLUMNS=400 — `nat info` renders a Rich table sized to the terminal. In a
#     narrow/non-TTY context it wraps the component_name cell and splits
#     "otelcollector" across lines, defeating a line-oriented grep.
#   grep -c, not grep -q — `grep -q` exits at the first match, which kills the
#     upstream `nat` with SIGPIPE. Under `set -o pipefail` that makes the whole
#     pipeline return 120 and the check reports "not found" even though the
#     exporter is present. Counting consumes all input, so nat exits cleanly.
if [[ "$(COLUMNS=400 "$VENV_DIR/bin/nat" info components -t tracing 2>/dev/null | grep -ci otelcollector)" -gt 0 ]]; then
  ok "'otelcollector' tracing exporter is registered"
else
  warn "'otelcollector' not listed by 'nat info components -t tracing' — traces may not export"
fi

# ---------------------------------------------------------------------------
step "[4/7] Collecting API keys"

# Reuse any previously saved values so re-runs aren't re-prompted. load_env only
# fills variables the caller has not set, so passing a different AWS_PROFILE or a
# rotated key on the command line takes effect instead of being silently replaced
# by the last run's values. See scripts/load-env.sh.
ENV_FILE="$WS2_DIR/.env"
load_env "$ENV_FILE" || true

prompt_key() {
  # prompt_key <VAR_NAME> <description> <url>
  local var="$1" desc="$2" url="$3" current="${!1:-}"
  if [[ -n "$current" ]]; then
    ok "$var: already set"
    return
  fi
  if [[ ! -t 0 ]]; then
    note_fail "$var is not set and there is no TTY to prompt on. Export it and re-run."
    return
  fi
  printf '  %s\n    (%s)\n' "$desc" "$url"
  read -rsp "    Enter value: " value; echo
  printf -v "$var" '%s' "$value" 2>/dev/null || eval "$var=\$value"
  export "$var"
}

prompt_key AWS_BEARER_TOKEN_BEDROCK "Amazon Bedrock API key" \
  "https://docs.aws.amazon.com/bedrock/latest/userguide/api-keys-generate.html"
prompt_key TAVILY_API_KEY "Tavily API key (web search)" "https://app.tavily.com"
# No Serper prompt. The observability config (configs/config_web_only_otel.yml)
# declares only tavily_web_search tools and never references ${SERPER_API_KEY};
# Serper is used by NVIDIA's paper-search lab, which is out of scope here. Asking
# readers to sign up for, store, and rotate a key that nothing reads is a
# prerequisite with no payoff. Still honoured if already exported, so an existing
# .env keeps working and a paper-search config can be passed to loadgen --config.

# Default to empty so the rest of the script (and the .env heredoc) is safe
# under `set -u` when a key could not be collected.
: "${AWS_BEARER_TOKEN_BEDROCK:=}"
: "${TAVILY_API_KEY:=}"
: "${SERPER_API_KEY:=}"
KEYS_COMPLETE=1
[[ -n "$AWS_BEARER_TOKEN_BEDROCK" && -n "$TAVILY_API_KEY" ]] || KEYS_COMPLETE=0

# An *empty* AWS_BEARER_TOKEN_BEDROCK is worse than an unset one: the AWS CLI
# and boto3 see the variable, choose bearer-token auth over SigV4, and then fail
# with "IncompleteSignatureException: Authorization header requires 'Credential'"
# — an error that points nowhere near the real cause. Unset it so the step-6
# Bedrock checks below can still use this profile's normal credentials.
[[ -n "$AWS_BEARER_TOKEN_BEDROCK" ]] || unset AWS_BEARER_TOKEN_BEDROCK

ENDPOINT_URL="https://bedrock-runtime.${AWS_REGION}.amazonaws.com/openai/v1"

# ---------------------------------------------------------------------------
step "[5/7] Setting up CloudWatch prerequisites"

# The OTLP logs endpoint will NOT create the log group or stream: it returns
# 400 "The specified log group does not exist", then 400 "The specified log
# stream does not exist". Both must pre-exist.
if [[ "$(aws logs describe-log-groups --log-group-name-prefix "$LOG_GROUP" \
     --query "logGroups[?logGroupName=='$LOG_GROUP'] | length(@)" --output text 2>/dev/null)" == "1" ]]; then
  ok "Log group exists: $LOG_GROUP"
else
  if aws logs create-log-group --log-group-name "$LOG_GROUP" 2>/dev/null; then
    ok "Created log group: $LOG_GROUP"
  else
    note_fail "Could not create log group $LOG_GROUP (need logs:CreateLogGroup)"
  fi
fi
aws logs put-retention-policy --log-group-name "$LOG_GROUP" \
  --retention-in-days "$LOG_RETENTION_DAYS" 2>/dev/null \
  && ok "Retention: ${LOG_RETENTION_DAYS} days" \
  || warn "Could not set retention on $LOG_GROUP"

if [[ "$(aws logs describe-log-streams --log-group-name "$LOG_GROUP" \
     --log-stream-name-prefix "$LOG_STREAM" \
     --query "logStreams[?logStreamName=='$LOG_STREAM'] | length(@)" --output text 2>/dev/null)" == "1" ]]; then
  ok "Log stream exists: $LOG_STREAM"
else
  if aws logs create-log-stream --log-group-name "$LOG_GROUP" --log-stream-name "$LOG_STREAM" 2>/dev/null; then
    ok "Created log stream: $LOG_STREAM"
  else
    note_fail "Could not create log stream $LOG_STREAM (need logs:CreateLogStream)"
  fi
fi

# The metrics pipeline exports EMF into its own log group. awsemf will create it
# on demand, but creating it here lets us set retention — EMF records are only an
# intermediate representation, so there is no reason to keep them long.
if [[ "$(aws logs describe-log-groups --log-group-name-prefix "$EMF_LOG_GROUP" \
     --query "logGroups[?logGroupName=='$EMF_LOG_GROUP'] | length(@)" --output text 2>/dev/null)" == "1" ]]; then
  ok "EMF log group exists: $EMF_LOG_GROUP"
else
  if aws logs create-log-group --log-group-name "$EMF_LOG_GROUP" 2>/dev/null; then
    ok "Created EMF log group: $EMF_LOG_GROUP"
  else
    warn "Could not create $EMF_LOG_GROUP — awsemf will create it on first export"
  fi
fi
aws logs put-retention-policy --log-group-name "$EMF_LOG_GROUP" \
  --retention-in-days "$LOG_RETENTION_DAYS" 2>/dev/null \
  && ok "EMF retention: ${LOG_RETENTION_DAYS} days" \
  || warn "Could not set retention on $EMF_LOG_GROUP"

# Transaction Search is a documented prerequisite for the OTLP traces endpoint:
# "Make sure Transaction Search is enabled before you use the OTLP Endpoint for
# traces." Without it, spans are rejected.
TS_STATUS="$(aws xray get-trace-segment-destination --query 'Status' --output text 2>/dev/null || echo UNKNOWN)"
TS_DEST="$(aws xray get-trace-segment-destination --query 'Destination' --output text 2>/dev/null || echo UNKNOWN)"
if [[ "$TS_STATUS" == "ACTIVE" && "$TS_DEST" == "CloudWatchLogs" ]]; then
  ok "Transaction Search: ACTIVE (destination CloudWatchLogs)"
else
  note_fail "Transaction Search is not active (status=$TS_STATUS destination=$TS_DEST)."
  echo "         Traces will be REJECTED by the OTLP endpoint until it is enabled."
  echo "         Enable it: CloudWatch console -> Settings -> Transaction Search,"
  echo "         or: aws xray update-trace-segment-destination --destination CloudWatchLogs"
fi

# ---------------------------------------------------------------------------
step "[6/7] Verifying Bedrock model access and the Tavily key"

if [[ "$(aws bedrock list-foundation-models \
     --query "modelSummaries[?modelId=='$MODEL_ID'] | length(@)" --output text 2>/dev/null)" == "1" ]]; then
  ok "Model listed in $AWS_REGION: $MODEL_ID"
else
  note_fail "$MODEL_ID is not available in $AWS_REGION (request access in the Bedrock console)"
fi

# Listing is not the same as invoke access; do a minimal real invoke.
INVOKE_OUT="$(aws bedrock-runtime converse --model-id "$MODEL_ID" \
  --messages '[{"role":"user","content":[{"text":"Reply with the single word: ok"}]}]' \
  --inference-config '{"maxTokens":16}' \
  --query 'output.message.content[0].text' --output text 2>&1 || true)"
if [[ "$INVOKE_OUT" == *ok* ]]; then
  ok "Model invoke succeeded"
else
  note_fail "Model invoke failed: $(printf '%s' "$INVOKE_OUT" | head -c 160)"
fi

# Validate Tavily here rather than letting a bad key surface later as an opaque
# agent failure mid-run. The web-search span is load-bearing for the blog's
# correlation walkthrough, so a silently broken key costs a whole loadgen run.
#
# Only the HTTP status is checked, and the key goes in the POST body — never on a
# command line, where it would be visible in `ps` output.
if [[ -n "$TAVILY_API_KEY" ]]; then
  TAVILY_CODE="$(curl -s -o /dev/null -w '%{http_code}' --max-time 20 \
    -X POST https://api.tavily.com/search \
    -H 'Content-Type: application/json' \
    --data-binary @<(printf '{"api_key":"%s","query":"observability","max_results":1}' "$TAVILY_API_KEY") \
    2>/dev/null || echo 000)"
  case "$TAVILY_CODE" in
    200)     ok "Tavily key is valid" ;;
    401|403) note_fail "Tavily rejected the key (HTTP $TAVILY_CODE) — web search will fail" ;;
    000)     warn "Could not reach api.tavily.com — skipping key validation" ;;
    *)       warn "Tavily returned HTTP $TAVILY_CODE; continuing" ;;
  esac
else
  note_fail "TAVILY_API_KEY is empty — the agent's only search tool will fail"
fi

# ---------------------------------------------------------------------------
step "[7/7] Installing the collector and writing .env"

bash "$SCRIPT_DIR/get-collector.sh" >/dev/null 2>&1 \
  && ok "Collector binary: $WS2_DIR/bin/$(ls "$WS2_DIR/bin" 2>/dev/null | head -1)" \
  || note_fail "Collector download failed (run scripts/get-collector.sh to see why)"

echo "$WS1_DIR" > "$WS2_DIR/.ws1_dir"

# .env is what loadgen.sh and the notebooks source. It holds secrets, so 0600.
# Never overwrite a complete .env with blanks: a re-run without the keys in the
# environment would otherwise destroy working credentials.
if [[ "$KEYS_COMPLETE" -eq 0 && -f "$ENV_FILE" ]]; then
  warn "Keys incomplete — leaving the existing $ENV_FILE untouched"
else
umask 077
# ${VAR:+...} below requires VAR to be *set* under `set -u`; the bearer token is
# deliberately unset above when empty, so re-declare the optional keys as blanks.
: "${AWS_BEARER_TOKEN_BEDROCK:=}" "${TAVILY_API_KEY:=}" "${SERPER_API_KEY:=}" "${AWS_PROFILE:=}"
cat > "$ENV_FILE" <<EOF
# Generated by scripts/setup.sh — sourced by loadgen.sh and the notebooks.
# Contains API keys: keep out of version control.
export WS1_DIR="$WS1_DIR"
export VIRTUAL_ENV="$VENV_DIR"
export AWS_REGION="$AWS_REGION"
export AWS_DEFAULT_REGION="$AWS_REGION"
${AWS_PROFILE:+export AWS_PROFILE="$AWS_PROFILE"}

# Consumed by the AI-Q configs (\${MODEL}, \${ENDPOINT_URL}, \${OPENAI_API_KEY}, ...)
export MODEL="$MODEL_ID"
export ENDPOINT_URL="$ENDPOINT_URL"
export OPENAI_BASE_URL="$ENDPOINT_URL"
# Emitted only when non-empty. Exporting AWS_BEARER_TOKEN_BEDROCK="" would make
# the AWS CLI pick bearer auth over SigV4 and fail with IncompleteSignatureException.
${AWS_BEARER_TOKEN_BEDROCK:+export OPENAI_API_KEY="$AWS_BEARER_TOKEN_BEDROCK"}
${AWS_BEARER_TOKEN_BEDROCK:+export AWS_BEARER_TOKEN_BEDROCK="$AWS_BEARER_TOKEN_BEDROCK"}
${TAVILY_API_KEY:+export TAVILY_API_KEY="$TAVILY_API_KEY"}
${SERPER_API_KEY:+export SERPER_API_KEY="$SERPER_API_KEY"}

export LOG_GROUP="$LOG_GROUP"
export LOG_STREAM="$LOG_STREAM"

# Metrics + logs pipelines (collector/collector-full.yaml reads all three).
export EMF_LOG_GROUP="$EMF_LOG_GROUP"
export AIQ_LOG_FILE="$AIQ_LOG_FILE"
EOF
chmod 600 "$ENV_FILE"
if [[ "$KEYS_COMPLETE" -eq 1 ]]; then
  ok "Wrote $ENV_FILE (0600)"
else
  warn "Wrote $ENV_FILE (0600) with placeholder keys — fill them in and re-run"
fi
umask 022
fi

# Two -e patterns, not BRE '\|' alternation: BSD grep (the default on macOS)
# does not support \| and silently matches nothing.
if ! grep -qs -e '^\.env$' -e '/\.env$' "$REPO_DIR/.gitignore" 2>/dev/null; then
  warn ".env is not in .gitignore — it holds API keys. Add it before committing."
fi

# ---------------------------------------------------------------------------
step "Preflight summary"
if [[ "$PREFLIGHT_FAILED" -eq 0 ]]; then
  printf '\033[32m  READY\033[0m — agent environment and CloudWatch prerequisites are in place.\n\n'
  echo "  Next:"
  echo "    source .env"
  echo "    bash scripts/run-collector.sh collector/collector-full.yaml"
  echo "    bash scripts/loadgen.sh --queries 12"
  exit 0
else
  printf '\033[31m  NOT READY\033[0m — fix the [fail] items above and re-run. The script is idempotent.\n'
  exit 1
fi

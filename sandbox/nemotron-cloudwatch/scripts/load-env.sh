#!/usr/bin/env bash
# Shared .env loader. Sourced by setup.sh, all.sh, loadgen.sh, create-dashboard.sh
# and cleanup.sh — not meant to be run directly.
#
# Why this exists rather than a plain `source .env`:
#
# .env is generated as a list of `export VAR="value"` lines, so sourcing it
# overrides the environment the caller supplied. That makes
#
#     AWS_PROFILE=other AWS_BEARER_TOKEN_BEDROCK=$NEW ./scripts/setup.sh
#
# silently run against whatever account and key the *previous* run wrote, and the
# mismatch surfaces much further down as an unrelated-looking failure — a model
# that "is not available" in an account you are not actually talking to. A
# rotated key behaves the same way: ignored.
#
# So: values already set in the environment win, and .env only fills the gaps.

# load_env <path-to-env-file>
# Returns 1 if the file does not exist; callers decide whether that is fatal.
load_env() {
  local env_file="$1" line name
  [[ -f "$env_file" ]] || return 1

  while IFS= read -r line; do
    [[ -n "$line" ]] || continue
    name="${line%%=*}"
    # Caller wins. Note -n rather than declared-ness: an exported-but-empty
    # AWS_BEARER_TOKEN_BEDROCK should be treated as absent, since that is the
    # shape that makes the AWS CLI pick bearer auth and then fail confusingly.
    [[ -n "${!name:-}" ]] && continue
    eval "$line"
    export "${name?}"
  done < <(
    # Source in a subshell and re-emit as %q-quoted assignments, so values with
    # spaces or quotes survive and the parent never runs .env's own exports.
    set +u
    # shellcheck disable=SC1090
    source "$env_file"
    while IFS= read -r n; do
      printf '%s=%q\n' "$n" "${!n:-}"
    done < <(grep -oE '^export [A-Za-z_][A-Za-z0-9_]*' "$env_file" | awk '{print $2}')
  )
}

#!/usr/bin/env bash
set -euo pipefail

# Get current replica counts
odtg=$(kubectl -n odtg get deployment odtg -o jsonpath='{.spec.replicas}')
frontend=$(kubectl -n otel-demo get deployment frontend-proxy -o jsonpath='{.spec.replicas}')

if [[ "$odtg" -gt 0 || "$frontend" -gt 0 ]]; then
  echo "Currently ENABLED (odtg=$odtg, frontend-proxy=$frontend) → disabling..."
  kubectl -n odtg scale deployment odtg --replicas=0
  kubectl -n otel-demo scale deployment frontend-proxy --replicas=0
else
  echo "Currently DISABLED (odtg=$odtg, frontend-proxy=$frontend) → enabling..."
  kubectl -n odtg scale deployment odtg --replicas=1
  kubectl -n otel-demo scale deployment frontend-proxy --replicas=1
fi

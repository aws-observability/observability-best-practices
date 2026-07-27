#!/usr/bin/env bash
# Send repeated requests to the sample app to generate traces
ENDPOINT=${1:-http://localhost:3000/checkout}
for i in {1..20}; do
  curl -s "$ENDPOINT" > /dev/null &
  sleep 0.3
done
echo "Sent 20 requests to $ENDPOINT"

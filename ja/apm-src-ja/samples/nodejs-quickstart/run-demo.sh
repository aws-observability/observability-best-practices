#!/usr/bin/env bash
set -euo pipefail

# One-command demo: starts ADOT collector (Docker), the Node app, and generates traffic.
# Usage: ./run-demo.sh

ROOT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$ROOT_DIR"

COLLECTOR_NAME="adot-collector-demo"
COLLECTOR_IMAGE="public.ecr.aws/aws-observability/aws-otel-collector:latest"
COLLECTOR_CONFIG="$ROOT_DIR/adot-collector-config.yaml"

function cleanup() {
  echo "\nCleaning up..."
  if [[ -n "${APP_PID:-}" ]]; then
    kill "$APP_PID" 2>/dev/null || true
  fi
  docker rm -f "$COLLECTOR_NAME" 2>/dev/null || true
  exit 0
}

trap cleanup INT TERM EXIT

echo "Starting ADOT collector (Docker) using config: $COLLECTOR_CONFIG"
docker run --rm --name "$COLLECTOR_NAME" -p 4317:4317 -v "$COLLECTOR_CONFIG":/etc/adot-config.yaml "$COLLECTOR_IMAGE" --config /etc/adot-config.yaml &
COLLECTOR_PID=$!

echo "Waiting for collector to be ready..."
sleep 4

if ! docker ps --filter "name=$COLLECTOR_NAME" --format '{{.Names}}' | grep -q "$COLLECTOR_NAME"; then
  echo "Collector failed to start. See docker logs $COLLECTOR_NAME"
  docker logs "$COLLECTOR_NAME" || true
  exit 1
fi

echo "Installing Node dependencies (if needed)..."
if [[ ! -d node_modules ]]; then
  npm install
fi

echo "Starting sample app..."
npm start > app.log 2>&1 &
APP_PID=$!

echo "Waiting for app to be healthy on http://localhost:3000/"
for i in {1..15}; do
  if curl -sSf http://localhost:3000/ >/dev/null; then
    echo "App is up"
    break
  fi
  sleep 1
done

echo "Generating traffic (20 requests)..."
./generate_requests.sh

echo "Tailing logs for collector and app (press Ctrl-C to stop)..."
echo "---- collector logs ----"
docker logs -f "$COLLECTOR_NAME" &
DOCKER_LOG_PID=$!

echo "---- app logs ----"
tail -f app.log &
TAIL_PID=$!

wait

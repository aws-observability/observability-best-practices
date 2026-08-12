#!/usr/bin/env bash
# Downloads the OpenTelemetry Collector Contrib binary for the current platform
# into ./bin/. Handles x86_64 Linux and arm64/x86_64 macOS.
#
# Upstream contrib, not ADOT, and the difference is load-bearing: ADOT registers
# NO connectors at all (its otelcol.Factories sets only Extensions, Receivers,
# Processors and Exporters), so span_metrics and signal_to_metrics cannot be
# configured there. Since this design derives metrics from spans, that rules ADOT
# out for the metrics pipeline. The transform processor we use to strip ANSI
# escapes is also absent (ADOT has metricstransform, a different component).
# ADOT *does* ship sigv4auth, awsemf and filelog, so it would serve the traces
# and logs pipelines fine on its own.
#
# Contrib also registers components under underscore names -- otlp_http,
# file_log, span_metrics, signal_to_metrics, sigv4auth -- and the camelCase
# spellings in the upstream docs do not resolve. collector-full.yaml is written
# against these names, so swapping in a different distro means renaming.
#
# Verify against a downloaded binary with: ./bin/otelcol-contrib components
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
WS2_DIR="$(dirname "$SCRIPT_DIR")"
BIN_DIR="$WS2_DIR/bin"
mkdir -p "$BIN_DIR"

OS="$(uname -s | tr '[:upper:]' '[:lower:]')"
ARCH="$(uname -m)"
case "$ARCH" in
  x86_64|amd64) ARCH="amd64" ;;
  arm64|aarch64) ARCH="arm64" ;;
  *) echo "Unsupported arch: $ARCH" >&2; exit 1 ;;
esac

# Contrib carries everything all three pipelines need: sigv4auth (required by the
# CloudWatch OTLP endpoints), the awsemf exporter, both metric connectors, and the
# transform processor.
OTELCOL="otelcol-contrib"
BASE="https://github.com/open-telemetry/opentelemetry-collector-releases/releases/download"
OTELCOL_VERSION="${OTELCOL_VERSION:-0.156.0}"
TARBALL="${OTELCOL}_${OTELCOL_VERSION}_${OS}_${ARCH}.tar.gz"
URL="${BASE}/v${OTELCOL_VERSION}/${TARBALL}"

echo "Downloading OpenTelemetry Collector Contrib ${OTELCOL_VERSION} (${OS}/${ARCH})..."
echo "  $URL"
curl -fsSL "$URL" -o "/tmp/${TARBALL}"
tar -xzf "/tmp/${TARBALL}" -C "$BIN_DIR" "${OTELCOL}"
chmod +x "$BIN_DIR/${OTELCOL}"
rm -f "/tmp/${TARBALL}"

echo "Collector installed: $BIN_DIR/${OTELCOL}"
"$BIN_DIR/${OTELCOL}" --version || true

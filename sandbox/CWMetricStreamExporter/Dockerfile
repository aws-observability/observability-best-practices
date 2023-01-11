# syntax=docker/dockerfile:1
FROM golang:1.18-alpine AS build

ARG TARGETPLATFORM
ARG BUILDPLATFORM

WORKDIR /src

RUN apk --no-cache add git
COPY lambda ./
RUN CGO_ENABLED=0 GOOS=linux go build -o /bin/cw-metric-stream-exporter .

FROM alpine:latest

LABEL org.opencontainers.image.description="Exports a cloudwatch metric stream to Amazon Managed Prometheus"
LABEL org.opencontainers.image.name="aws-observability/cw-metrics-exporter"
LABEL org.opencontainers.image.license="MIT-0"

RUN apk --no-cache add ca-certificates
COPY --from=build /bin/cw-metric-stream-exporter /bin/

ENTRYPOINT ["cw-metric-stream-exporter"]
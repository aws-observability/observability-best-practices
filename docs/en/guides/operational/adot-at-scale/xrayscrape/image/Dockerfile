FROM --platform=linux/amd64 public.ecr.aws/aws-observability/aws-otel-collector:latest

COPY config.yaml /otel-local-config.yaml

EXPOSE 2000/udp 4317/tcp 55680/tcp 8889/tcp

CMD ["--config=/otel-local-config.yaml"]

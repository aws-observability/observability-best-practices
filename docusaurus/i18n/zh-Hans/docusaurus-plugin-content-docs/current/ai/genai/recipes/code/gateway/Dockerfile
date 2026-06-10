FROM ghcr.io/berriai/litellm:main-latest

WORKDIR /app

COPY litellm-config.yaml /app/config.yaml

ENV LITELLM_CONFIG_PATH=/app/config.yaml

CMD ["--config", "/app/config.yaml", "--port", "4000", "--host", "0.0.0.0"]

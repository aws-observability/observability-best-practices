# AWS Lambda

[AWS Lambda][lambda-main] est un service de calcul serverless qui vous permet d'exécuter du code sans provisionner ni gérer de serveurs, sans créer de logique de mise à l'échelle adaptée aux charges de travail, sans maintenir d'intégrations d'événements, ni gérer de runtimes.

Consultez les recettes suivantes :

## Logs

- [Déployer et surveiller une application serverless][aes-ws]

## Métriques

- [Présentation de CloudWatch Lambda Insights][lambda-cwi]
- [Exportation de CloudWatch Metric Streams via Firehose et AWS Lambda vers Amazon Managed Service for Prometheus](recipes/lambda-cw-metrics-go-amp.md)

## Traces

- [Auto-instrumentation d'une application Python avec une couche AWS Distro for OpenTelemetry Lambda][lambda-layer-python-xray-adot]
- [Traçage des fonctions AWS Lambda dans AWS X-Ray avec OpenTelemetry][lambda-xray-adot]

[lambda-main]: https://aws.amazon.com/lambda/
[aes-ws]: https://bookstore.aesworkshops.com/
[lambda-cwi]: https://aws.amazon.com/blogs/mt/introducing-cloudwatch-lambda-insights/
[lambda-xray-adot]: https://aws.amazon.com/blogs/opensource/tracing-aws-lambda-functions-in-aws-x-ray-with-opentelemetry/
[lambda-layer-python-xray-adot]: https://aws.amazon.com/blogs/opensource/auto-instrumenting-a-python-application-with-an-aws-distro-for-opentelemetry-lambda-layer/

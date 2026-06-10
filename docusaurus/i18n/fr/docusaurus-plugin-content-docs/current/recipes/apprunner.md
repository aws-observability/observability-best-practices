# AWS App Runner

[AWS App Runner][apprunner-main] est un service entièrement géré qui permet aux développeurs de déployer rapidement des applications web conteneurisées et des API, à grande échelle et sans expérience préalable en infrastructure. Commencez avec votre code source ou une image de conteneur. App Runner construit et déploie automatiquement l'application web, équilibre la charge du trafic avec chiffrement, s'adapte à vos besoins en trafic, et facilite la communication de vos services avec d'autres services AWS et applications exécutées dans un Amazon VPC privé. Avec App Runner, au lieu de penser aux serveurs ou à la mise à l'échelle, vous avez plus de temps pour vous concentrer sur vos applications.




Consultez les recettes suivantes :

## Général
- [Container Day - Docker Con | Comment les développeurs peuvent facilement mettre en production des applications web à grande échelle](https://www.youtube.com/watch?v=Iyp9Ugk9oRs)
- [Blog AWS | Observability centralisée pour les services AWS App Runner](https://aws.amazon.com/blogs/containers/centralized-observability-for-aws-app-runner-services/)
- [Blog AWS | Observability pour la mise en réseau VPC d'AWS App Runner](https://aws.amazon.com/blogs/containers/observability-for-aws-app-runner-vpc-networking/)
- [Blog AWS | Contrôle et surveillance des applications AWS App Runner avec Amazon EventBridge](https://aws.amazon.com/blogs/containers/controlling-and-monitoring-aws-app-runner-applications-with-amazon-eventbridge/)


## Logs

- [Consultation des logs App Runner diffusés vers CloudWatch Logs][apprunner-cwl]

## Métriques

- [Consultation des métriques de service App Runner rapportées à CloudWatch][apprunner-cwm]


## Traces
- [Démarrer avec le traçage AWS X-Ray pour App Runner en utilisant AWS Distro for OpenTelemetry](https://aws-otel.github.io/docs/getting-started/apprunner)
- [Containers from the Couch | Intégration AWS App Runner X-Ray](https://youtu.be/cVr8N7enCMM)
- [Blog AWS | Traçage d'un service AWS App Runner avec AWS X-Ray et OpenTelemetry](https://aws.amazon.com/blogs/containers/tracing-an-aws-app-runner-service-using-aws-x-ray-with-opentelemetry/)
- [Blog AWS | Activation du traçage AWS X-Ray pour le service AWS App Runner avec AWS Copilot CLI](https://aws.amazon.com/blogs/containers/enabling-aws-x-ray-tracing-for-aws-app-runner-service-using-aws-copilot-cli/)

[apprunner-main]: https://aws.amazon.com/apprunner/
[aes-ws]: https://bookstore.aesworkshops.com/
[apprunner-cwl]: https://docs.aws.amazon.com/apprunner/latest/dg/monitor-cwl.html
[apprunner-cwm]: https://docs.aws.amazon.com/apprunner/latest/dg/monitor-cw.html

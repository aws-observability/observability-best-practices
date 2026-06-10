# Introduction

Ce guide explore l'architecture technique, les strategies d'instrumentation et les approches d'implementation pour Application Signals, avec un focus particulier sur les raisons pour lesquelles les organisations devraient migrer de l'echantillonnage X-Ray traditionnel vers la nouvelle approche d'Observability complete.

## Sections du guide

| Section | Description |
|---|---|
| [Defis de la surveillance traditionnelle](../challenges) | Pourquoi la surveillance historique est insuffisante pour les applications cloud-native modernes |
| [Pourquoi migrer depuis X-Ray](../why-migrate-from-xray) | Avantages de l'adoption d'Application Signals + Transaction Search par rapport au X-Ray traditionnel |
| [Configuration](../setup) | Guide etape par etape pour activer Application Signals, Transaction Search et l'echantillonnage |
| [Configuration de l'instrumentation et du collecteur](../instrumentation-setups) | Approches d'instrumentation et architectures detaillees des collecteurs (ADOT + CW Agent, ADOT + Custom Collector, Upstream OTEL, sans collecteur, X-Ray historique) |
| [Exemples d'instrumentation](../instrumentation-samples) | Exemples de code specifiques aux langages et applications de demonstration pour Java, Python, Node.js, .NET, Go et Rust |
| [Ressources](../resources) | Liens vers la documentation, ressources techniques et materiaux de formation |

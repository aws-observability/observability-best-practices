# Réduire les coûts CloudWatch

## GetMetricData

Généralement, `GetMetricData` est causé par des appels provenant d'outils d'Observability tiers et/ou d'outils financiers cloud utilisant les métriques CloudWatch dans leur plateforme.

- Envisagez de réduire la fréquence à laquelle l'outil tiers effectue des requêtes. Par exemple, réduire la fréquence de 1 min à 5 min devrait entraîner un coût de 1/5 (20 %) du coût initial.
- Pour identifier la tendance, envisagez de désactiver temporairement toute collecte de données des outils tiers.

## CloudWatch Logs

- Identifiez les principaux contributeurs en utilisant ce [document du centre de connaissances][log-article].
- Réduisez le niveau de journalisation des principaux contributeurs sauf si cela est jugé nécessaire.
- Vérifiez si vous utilisez des outils tiers pour la journalisation en plus de CloudWatch.
- Les coûts de VPC Flow Log peuvent augmenter rapidement si vous l'avez activé sur chaque VPC avec beaucoup de trafic. Si vous en avez toujours besoin, envisagez de les livrer vers Amazon S3.
- Vérifiez si la journalisation est nécessaire sur toutes les fonctions AWS Lambda. Si ce n'est pas le cas, refusez les permissions "logs:PutLogEvents" dans le rôle Lambda.
- Les logs CloudTrail sont souvent un contributeur majeur. Les envoyer vers Amazon S3 et utiliser Amazon Athena pour les requêtes et Amazon EventBridge pour les alarmes/notifications est moins coûteux.

Consultez cet [article du centre de connaissances][article] pour plus de détails.


[article]: https://aws.amazon.com/premiumsupport/knowledge-center/cloudwatch-understand-and-reduce-charges/
[log-article]: https://aws.amazon.com/premiumsupport/knowledge-center/cloudwatch-logs-bill-increase/

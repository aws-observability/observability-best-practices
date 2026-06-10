# Amazon Managed Grafana

[Amazon Managed Grafana][amg-main] est un service entierement gere base sur Grafana
open source, vous permettant d'analyser vos metriques, journaux et traces sans avoir
a provisionner des serveurs, configurer et mettre a jour des logiciels, ou effectuer
le travail lourd implique dans la securisation et la mise a l'echelle de Grafana en
production. Vous pouvez creer, explorer et partager des tableaux de bord d'observabilite
avec votre equipe, en vous connectant a plusieurs sources de donnees.

Consultez les recettes suivantes :

## Bases

- [Premiers pas][amg-gettingstarted]
- [Utilisation de Terraform pour l'automatisation][amg-tf-automation]

## Authentification et controle d'acces

- [Integration SAML directe avec les fournisseurs d'identite][amg-saml]
- [Integration de fournisseurs d'identite (OneLogin, Ping Identity, Okta et Azure AD) au SSO][amg-idps]
- [Integration de l'authentification Google via SAMLv2][amg-google-idps]
- [Configuration d'une source de donnees inter-comptes Amazon Managed Grafana avec des roles IAM geres par le client][amg-cross-account-access]
- [Controle d'acces granulaire dans Amazon Managed Grafana avec Grafana Teams][amg-grafana-teams]

## Sources de donnees et visualisations

- [Utilisation d'Athena dans Amazon Managed Grafana][amg-plugin-athena]
- [Utilisation de Redshift dans Amazon Managed Grafana][amg-plugin-redshift]
- [Affichage de metriques personnalisees depuis statsd avec Amazon Managed Service for Prometheus et Amazon Managed Grafana][amg-amp-statsd]
- [Configuration d'une source de donnees inter-comptes avec des roles IAM geres par le client][amg-xacc-ds]

## Autres
- [Surveillance des environnements hybrides][amg-hybridenvs]
- [Gestion de Grafana et Loki dans un environnement multitenant reglemente][grafana-loki-regenv]
- [Surveillance d'Amazon EKS Anywhere avec Amazon Managed Service for Prometheus et Amazon Managed Grafana][amg-anywhere-monitoring]
- [Atelier pour demarrer][amg-oow]
- [Surveillance des IP libres dans un sous-reseau][amg-subnet-free-ip-monitoring]


[amg-main]: https://aws.amazon.com/grafana/
[amg-gettingstarted]: https://aws.amazon.com/blogs/mt/amazon-managed-grafana-getting-started/
[amg-saml]: https://aws.amazon.com/blogs/mt/amazon-managed-grafana-supports-direct-saml-integration-with-identity-providers/
[amg-idps]: https://aws.amazon.com/blogs/opensource/integrating-identity-providers-such-as-onelogin-ping-identity-okta-and-azure-ad-to-sso-into-aws-managed-service-for-grafana/
[amg-google-idps]: recipes/amg-google-auth-saml.md
[amg-hybridenvs]: https://aws.amazon.com/blogs/mt/monitoring-hybrid-environments-using-amazon-managed-service-for-grafana/
[amg-xacc-ds]: https://aws.amazon.com/blogs/opensource/setting-up-amazon-managed-grafana-cross-account-data-source-using-customer-managed-iam-roles/
[grafana-loki-regenv]: https://aws.amazon.com/blogs/opensource/how-to-manage-grafana-and-loki-in-a-regulated-multitenant-environment/
[amg-oow]: https://observability.workshop.aws/en/amg.html
[amg-tf-automation]: recipes/amg-automation-tf.md
[amg-plugin-athena]: recipes/amg-athena-plugin.md
[amg-plugin-redshift]: recipes/amg-redshift-plugin.md
[amg-cross-account-access]: https://aws.amazon.com/blogs/opensource/setting-up-amazon-managed-grafana-cross-account-data-source-using-customer-managed-iam-roles/
[amg-anywhere-monitoring]: https://aws.amazon.com/blogs/containers/monitoring-amazon-eks-anywhere-using-amazon-managed-service-for-prometheus-and-amazon-managed-grafana/
[amg-amp-statsd]: https://aws.amazon.com/blogs/mt/viewing-custom-metrics-from-statsd-with-amazon-managed-service-for-prometheus-and-amazon-managed-grafana/
[amg-grafana-teams]: https://aws.amazon.com/blogs/mt/fine-grained-access-control-in-amazon-managed-grafana-using-grafana-teams/
[amg-subnet-free-ip-monitoring]: https://aws-observability.github.io/observability-best-practices/recipes/recipes/amg-subnet-free-ip-monitoring/

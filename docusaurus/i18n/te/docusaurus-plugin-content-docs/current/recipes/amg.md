# Amazon Managed Grafana

[Amazon Managed Grafana][amg-main] అనేది ఓపెన్ సోర్స్ Grafana ఆధారంగా పూర్తిగా నిర్వహించబడే సర్వీస్, ఇది సర్వర్లను ప్రొవిజన్ చేయడం, సాఫ్ట్‌వేర్‌ను కాన్ఫిగర్ చేసి అప్‌డేట్ చేయడం లేదా ప్రొడక్షన్‌లో Grafana ను సెక్యూర్ చేసి స్కేల్ చేయడంలో భారీ పనిని చేయాల్సిన అవసరం లేకుండా మీ మెట్రిక్స్, లాగ్‌లు మరియు ట్రేసెస్‌ను విశ్లేషించడానికి మిమ్మల్ని అనుమతిస్తుంది. మీరు బహుళ డేటా సోర్స్‌లకు కనెక్ట్ అవుతూ మీ టీమ్‌తో observability డాష్‌బోర్డ్‌లను సృష్టించవచ్చు, అన్వేషించవచ్చు మరియు షేర్ చేయవచ్చు.

కింది రెసిపీలను చూడండి:

## ప్రాథమికాలు

- [ప్రారంభించడం][amg-gettingstarted]
- [ఆటోమేషన్ కోసం Terraform ఉపయోగించడం][amg-tf-automation]

## ఆథెంటికేషన్ మరియు యాక్సెస్ కంట్రోల్

- [ఐడెంటిటీ ప్రొవైడర్లతో డైరెక్ట్ SAML ఇంటిగ్రేషన్][amg-saml]
- [SSO కు ఐడెంటిటీ ప్రొవైడర్లను (OneLogin, Ping Identity, Okta, మరియు Azure AD) ఇంటిగ్రేట్ చేయడం][amg-idps]
- [SAMLv2 ద్వారా Google ఆథెంటికేషన్ ఇంటిగ్రేట్ చేయడం][amg-google-idps]
- [కస్టమర్ మేనేజ్డ్ IAM రోల్స్ ఉపయోగించి Amazon Managed Grafana క్రాస్-అకౌంట్ డేటా సోర్స్ సెటప్ చేయడం][amg-cross-account-access]
- [Grafana Teams ఉపయోగించి Amazon Managed Grafana లో ఫైన్-గ్రెయిన్డ్ యాక్సెస్ కంట్రోల్][amg-grafana-teams]

## డేటా సోర్స్‌లు మరియు విజువలైజేషన్లు

- [Amazon Managed Grafana లో Athena ఉపయోగించడం][amg-plugin-athena]
- [Amazon Managed Grafana లో Redshift ఉపయోగించడం][amg-plugin-redshift]
- [Amazon Managed Service for Prometheus మరియు Amazon Managed Grafana తో statsd నుండి కస్టమ్ మెట్రిక్స్ చూడడం][amg-amp-statsd]
- [కస్టమర్ మేనేజ్డ్ IAM రోల్స్ ఉపయోగించి క్రాస్-అకౌంట్ డేటా సోర్స్ సెటప్ చేయడం][amg-xacc-ds]

## ఇతరాలు
- [హైబ్రిడ్ ఎన్విరాన్‌మెంట్ల మానిటరింగ్][amg-hybridenvs]
- [రెగ్యులేటెడ్ మల్టీటెనెంట్ ఎన్విరాన్‌మెంట్‌లో Grafana మరియు Loki నిర్వహించడం][grafana-loki-regenv]
- [Amazon Managed Service for Prometheus మరియు Amazon Managed Grafana ఉపయోగించి Amazon EKS Anywhere మానిటరింగ్][amg-anywhere-monitoring]
- [ప్రారంభించడానికి వర్క్‌షాప్][amg-oow]
- [Subnet లో ఉచిత IP మానిటరింగ్][amg-subnet-free-ip-monitoring]


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

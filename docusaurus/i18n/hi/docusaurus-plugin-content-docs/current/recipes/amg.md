# Amazon Managed Grafana

[Amazon Managed Grafana][amg-main] ओपन सोर्स Grafana पर आधारित एक पूर्ण प्रबंधित सेवा है,
जो आपको सर्वर प्रोविजन किए बिना, सॉफ्टवेयर कॉन्फ़िगर और अपडेट किए बिना,
या प्रोडक्शन में Grafana को सुरक्षित और स्केल करने में शामिल भारी काम किए बिना
अपने मेट्रिक्स, लॉग्स और ट्रेस का विश्लेषण करने में सक्षम बनाती है। आप कई डेटा सोर्स से
कनेक्ट करते हुए अपनी टीम के साथ Observability डैशबोर्ड बना,
एक्सप्लोर और शेयर कर सकते हैं।

निम्नलिखित रेसिपी देखें:

## बेसिक्स

- [शुरुआत करना][amg-gettingstarted]
- [ऑटोमेशन के लिए Terraform का उपयोग][amg-tf-automation]

## प्रमाणीकरण और एक्सेस कंट्रोल

- [Identity providers के साथ सीधा SAML इंटीग्रेशन][amg-saml]
- [SSO के लिए identity providers (OneLogin, Ping Identity, Okta, और Azure AD) को इंटीग्रेट करना][amg-idps]
- [SAMLv2 के माध्यम से Google प्रमाणीकरण इंटीग्रेट करना][amg-google-idps]
- [Customer managed IAM roles का उपयोग करके Amazon Managed Grafana cross-account data source सेट अप करना][amg-cross-account-access]
- [Grafana Teams का उपयोग करके Amazon Managed Grafana में fine-grained access control][amg-grafana-teams]

## डेटा सोर्स और विज़ुअलाइज़ेशन

- [Amazon Managed Grafana में Athena का उपयोग][amg-plugin-athena]
- [Amazon Managed Grafana में Redshift का उपयोग][amg-plugin-redshift]
- [Amazon Managed Service for Prometheus और Amazon Managed Grafana के साथ statsd से कस्टम मेट्रिक्स देखना][amg-amp-statsd]
- [Customer managed IAM roles का उपयोग करके cross-account data source सेट अप करना][amg-xacc-ds]

## अन्य
- [हाइब्रिड वातावरण की मॉनिटरिंग][amg-hybridenvs]
- [एक विनियमित मल्टीटेनेंट वातावरण में Grafana और Loki का प्रबंधन][grafana-loki-regenv]
- [Amazon Managed Service for Prometheus और Amazon Managed Grafana का उपयोग करके Amazon EKS Anywhere की मॉनिटरिंग][amg-anywhere-monitoring]
- [शुरुआत करने के लिए Workshop][amg-oow]
- [Subnet में मुफ्त IP की मॉनिटरिंग][amg-subnet-free-ip-monitoring]


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

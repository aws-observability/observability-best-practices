# Amazon Managed Grafana

[Amazon Managed Grafana][amg-main] என்பது திறந்த மூல Grafana அடிப்படையிலான முழுமையாக நிர்வகிக்கப்படும் சேவையாகும், இது சர்வர்களை வழங்காமல், மென்பொருளை கட்டமைத்து புதுப்பிக்காமல், அல்லது உற்பத்தியில் Grafana-ஐ பாதுகாப்பது மற்றும் அளவிடுவது தொடர்பான கடினமான வேலைகளை செய்யாமல் உங்கள் மெட்ரிக்குகள், லாக்குகள் மற்றும் ட்ரேஸ்களை பகுப்பாய்வு செய்ய உங்களை அனுமதிக்கிறது. பல தரவு ஆதாரங்களுடன் இணைந்து உங்கள் குழுவுடன் observability டாஷ்போர்டுகளை உருவாக்கலாம், ஆராயலாம் மற்றும் பகிரலாம்.

பின்வரும் செய்முறைகளைப் பாருங்கள்:

## அடிப்படைகள்

- [தொடங்குதல்][amg-gettingstarted]
- [தானியங்குமயமாக்கலுக்கு Terraform பயன்படுத்துதல்][amg-tf-automation]

## அங்கீகாரம் மற்றும் அணுகல் கட்டுப்பாடு

- [அடையாள வழங்குநர்களுடன் நேரடி SAML ஒருங்கிணைப்பு][amg-saml]
- [SSO-க்கு அடையாள வழங்குநர்களை (OneLogin, Ping Identity, Okta, மற்றும் Azure AD) ஒருங்கிணைத்தல்][amg-idps]
- [SAMLv2 வழியாக Google அங்கீகாரத்தை ஒருங்கிணைத்தல்][amg-google-idps]
- [வாடிக்கையாளர் நிர்வகிக்கும் IAM பாத்திரங்களைப் பயன்படுத்தி Amazon Managed Grafana குறுக்கு-கணக்கு தரவு ஆதாரத்தை அமைத்தல்][amg-cross-account-access]
- [Grafana Teams பயன்படுத்தி Amazon Managed Grafana-இல் நுணுக்கமான அணுகல் கட்டுப்பாடு][amg-grafana-teams]

## தரவு ஆதாரங்கள் மற்றும் காட்சிப்படுத்தல்கள்

- [Amazon Managed Grafana-இல் Athena பயன்படுத்துதல்][amg-plugin-athena]
- [Amazon Managed Grafana-இல் Redshift பயன்படுத்துதல்][amg-plugin-redshift]
- [Amazon Managed Service for Prometheus மற்றும் Amazon Managed Grafana மூலம் statsd-இலிருந்து தனிப்பயன் மெட்ரிக்குகளைப் பார்த்தல்][amg-amp-statsd]
- [வாடிக்கையாளர் நிர்வகிக்கும் IAM பாத்திரங்களைப் பயன்படுத்தி குறுக்கு-கணக்கு தரவு ஆதாரத்தை அமைத்தல்][amg-xacc-ds]

## மற்றவை
- [ஹைப்ரிட் சூழல்களை கண்காணித்தல்][amg-hybridenvs]
- [ஒழுங்குபடுத்தப்பட்ட பல-குத்தகையாளர் சூழலில் Grafana மற்றும் Loki நிர்வகித்தல்][grafana-loki-regenv]
- [Amazon Managed Service for Prometheus மற்றும் Amazon Managed Grafana பயன்படுத்தி Amazon EKS Anywhere கண்காணித்தல்][amg-anywhere-monitoring]
- [தொடங்குவதற்கான பயிலரங்கு][amg-oow]
- [Subnet-இல் இலவச IP கண்காணிப்பு][amg-subnet-free-ip-monitoring]


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

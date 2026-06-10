# Amazon Managed Grafana-வில் Redshift பயன்படுத்துதல்

இந்த ரெசிபியில் [Amazon Redshift][redshift]--standard SQL பயன்படுத்தும் petabyte-scale data warehouse service--ஐ [Amazon Managed Grafana][amg]-வில் எவ்வாறு பயன்படுத்துவது என்பதைக் காட்டுகிறோம். இந்த ஒருங்கிணைப்பு [Redshift data source for Grafana][redshift-ds] மூலம் இயக்கப்படுகிறது, இது எந்த DIY Grafana instance-லும் பயன்படுத்தக் கிடைக்கும் open source plugin ஆகும், மேலும் Amazon Managed Grafana-வில் முன்-நிறுவப்பட்டுள்ளது.

:::note
    இந்த வழிகாட்டியை முடிக்க சுமார் 10 நிமிடங்கள் ஆகும்.
:::
## முன்நிபந்தனைகள்

1. உங்கள் கணக்கிலிருந்து Amazon Redshift-க்கு admin அணுகல் இருக்க வேண்டும்.
1. உங்கள் Amazon Redshift cluster-ஐ `GrafanaDataSource: true` என tag செய்யவும்.
1. Service-managed policies-இன் பலனைப் பெற, database credentials-ஐ பின்வரும் வழிகளில் ஒன்றில் உருவாக்கவும்:
    1. Default mechanism-ஐ, அதாவது temporary credentials விருப்பத்தை, Redshift database-க்கு எதிராக authenticate செய்ய பயன்படுத்த விரும்பினால், `redshift_data_api_user` என்ற database user-ஐ உருவாக்க வேண்டும்.
    1. Secrets Manager-இலிருந்து credentials பயன்படுத்த விரும்பினால், secret-ஐ `RedshiftQueryOwner: true` என tag செய்ய வேண்டும்.

:::tip
    Service-managed அல்லது custom policies-உடன் எவ்வாறு பணியாற்றுவது என்பது பற்றிய கூடுதல் தகவலுக்கு, [Amazon Managed Grafana docs-ல் உள்ள எடுத்துக்காட்டுகளைப்][svpolicies] பார்க்கவும்.
:::

## உள்கட்டமைப்பு
Grafana instance தேவை, எனவே புதிய [Amazon Managed Grafana workspace][amg-workspace] அமைக்கவும், உதாரணமாக [தொடங்குதல்][amg-getting-started] வழிகாட்டியைப் பயன்படுத்தி, அல்லது ஏற்கனவே உள்ள ஒன்றைப் பயன்படுத்தவும்.

:::note
    AWS data source configuration பயன்படுத்த, முதலில் Amazon Managed Grafana console-க்குச் சென்று Athena resources படிக்க workspace-க்கு IAM policies வழங்கும் service-managed IAM roles-ஐ இயக்கவும்.
:::

Athena data source அமைக்க, இடது பக்க toolbar-ஐ பயன்படுத்தி கீழே உள்ள AWS icon-ஐ தேர்ந்தெடுத்து "Redshift"-ஐ தேர்வு செய்யவும். Redshift data source-ஐ கண்டறிய plugin-க்கு உங்கள் default region-ஐ தேர்ந்தெடுத்து, நீங்கள் விரும்பும் accounts-ஐ தேர்ந்தெடுத்து, இறுதியாக "Add data source"-ஐ தேர்வு செய்யவும்.

மாற்றாக, பின்வரும் படிகளைப் பின்பற்றி Redshift data source-ஐ கைமுறையாக சேர்த்து கட்டமைக்கலாம்:

1. இடது பக்க toolbar-ல் "Configurations" icon-ஐ கிளிக் செய்து "Add data source"-ஐ கிளிக் செய்யவும்.
1. "Redshift"-ஐ தேடவும்.
1. [OPTIONAL] Authentication provider-ஐ கட்டமைக்கவும் (பரிந்துரை: workspace IAM role).
1. "Cluster Identifier", "Database" மற்றும் "Database User" மதிப்புகளை வழங்கவும்.
1. "Save & test"-ஐ கிளிக் செய்யவும்.

பின்வருவது போன்ற ஒன்றைக் காண வேண்டும்:

![Redshift data source config-இன் screenshot](../images/amg-plugin-redshift-ds.png)

## பயன்பாடு
[Redshift Advance Monitoring][redshift-mon] setup-ஐ பயன்படுத்துவோம்.
அனைத்தும் out of the box கிடைப்பதால், இந்த நேரத்தில் வேறு எதையும் கட்டமைக்க தேவையில்லை.

Redshift plugin-ல் உள்ள Redshift monitoring dashboard-ஐ இறக்குமதி செய்யலாம். இறக்குமதி செய்த பிறகு பின்வருவது போன்ற ஒன்றைக் காண வேண்டும்:

![AMG-யில் Redshift dashboard-இன் screenshot](../images/amg-redshift-mon-dashboard.png)

இங்கிருந்து, Amazon Managed Grafana-வில் உங்கள் சொந்த டாஷ்போர்டை உருவாக்க பின்வரும் வழிகாட்டிகளைப் பயன்படுத்தவும்:

* [User Guide: Dashboards](https://docs.aws.amazon.com/grafana/latest/userguide/dashboard-overview.html)
* [டாஷ்போர்டுகள் உருவாக்குவதற்கான சிறந்த நடைமுறைகள்](https://grafana.com/docs/grafana/latest/best-practices/best-practices-for-creating-dashboards/)

அவ்வளவுதான், வாழ்த்துக்கள்! Grafana-விலிருந்து Redshift-ஐ எவ்வாறு பயன்படுத்துவது என்பதை கற்றுக்கொண்டீர்கள்!

## சுத்தம் செய்தல்

நீங்கள் பயன்படுத்திய Redshift database-ஐ நீக்கி, பின்னர் Amazon Managed Grafana workspace-ஐ console-இலிருந்து நீக்கவும்.

[redshift]: https://aws.amazon.com/redshift/
[amg]: https://aws.amazon.com/grafana/
[svpolicies]: https://docs.aws.amazon.com/grafana/latest/userguide/security_iam_id-based-policy-examples.html
[redshift-ds]: https://grafana.com/grafana/plugins/grafana-redshift-datasource/
[aws-cli]: https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-install.html
[aws-cli-conf]: https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-configure.html
[amg-getting-started]: https://aws.amazon.com/blogs/mt/amazon-managed-grafana-getting-started/
[redshift-console]: https://console.aws.amazon.com/redshift/
[redshift-mon]: https://github.com/awslabs/amazon-redshift-monitoring
[amg-workspace]: https://console.aws.amazon.com/grafana/home#/workspaces

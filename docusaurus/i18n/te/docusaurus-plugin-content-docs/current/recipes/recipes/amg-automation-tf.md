# Amazon Managed Grafana automation కోసం Terraform ఉపయోగించడం

ఈ recipe లో Amazon Managed Grafana automate చేయడానికి Terraform ఎలా ఉపయోగించాలో చూపిస్తాము, ఉదాహరణకు అనేక workspaces అంతటా consistently datasources లేదా dashboards add చేయడానికి.

:::note
    ఈ గైడ్ complete చేయడానికి సుమారు 30 నిమిషాలు పడుతుంది.
:::
## Prerequisites

* [AWS command line][aws-cli] మీ local environment లో install మరియు [configured][aws-cli-conf] అయి ఉండాలి.
* మీ local environment లో [Terraform][tf] command line install అయి ఉండాలి.
* మీకు Amazon Managed Service for Prometheus workspace ready to use ఉండాలి.
* మీకు Amazon Managed Grafana workspace ready to use ఉండాలి.

## Amazon Managed Grafana Set up చేయండి

Terraform Grafana తో [authenticate][grafana-authn] చేయడానికి, మనం API Key ఉపయోగిస్తాము, ఇది ఒక password లాగా act చేస్తుంది.

:::info
    API key అనేది [RFC 6750][rfc6750] HTTP Bearer header, 51 character long alpha-numeric value ఇది ప్రతి request తో Grafana API కు caller ను authenticate చేస్తుంది.
:::

కాబట్టి, Terraform manifest set up చేయడానికి ముందు, మొదట API key create చేయాలి. Grafana UI ద్వారా ఈ విధంగా చేయవచ్చు.

మొదట, left-hand side menu లో `Configuration` section నుండి `API keys` menu item select చేయండి:

![Configuration, API keys menu item](../images/api-keys-menu-item.png)

ఇప్పుడు new API key create చేయండి, మీ task కు అర్థవంతమైన name ఇవ్వండి, `Admin` role assign చేసి duration time ను, ఉదాహరణకు, one day కు set చేయండి:

![API key creation](../images/api-key-creation.png)

:::note
    API key limited time కోసం valid, AMG లో 30 days వరకు values ఉపయోగించవచ్చు.
:::
`Add` button hit చేసిన తర్వాత API key contain చేసే pop-up dialog చూడాలి:

![API key result](../images/api-key-result.png)

:::warning
    API key చూడగలిగే ఏకైక సమయం ఇది, కాబట్టి దీన్ని safe place లో store చేయండి, తర్వాత Terraform manifest లో అవసరం.
:::
దీనితో Amazon Managed Grafana లో Terraform automation కోసం అవసరమైనవన్నీ set up చేశాము, కాబట్టి ఈ step కు move అవ్వండి.

## Terraform తో Automation

### Terraform Prepare చేయడం

Terraform Grafana తో interact చేయగలిగేలా, official [Grafana provider][tf-grafana-provider] version 1.13.3 లేదా above ఉపయోగిస్తున్నాము.

ఇక్కడ, data source creation automate చేయాలనుకుంటున్నాము, మన case లో Prometheus [data source][tf-ds] add చేయాలనుకుంటున్నాము, exactly AMP workspace.

మొదట, ఈ content తో `main.tf` అనే file create చేయండి:

```
terraform {
  required_providers {
    grafana = {
      source  = "grafana/grafana"
      version = ">= 1.13.3"
    }
  }
}

provider "grafana" {
  url  = "INSERT YOUR GRAFANA WORKSPACE URL HERE"
  auth = "INSERT YOUR API KEY HERE"
}

resource "grafana_data_source" "prometheus" {
  type          = "prometheus"
  name          = "amp"
  is_default    = true
  url           = "INSERT YOUR AMP WORKSPACE URL HERE "
  json_data {
	http_method     = "POST"
	sigv4_auth      = true
	sigv4_auth_type = "workspace-iam-role"
	sigv4_region    = "eu-west-1"
  }
}
```
పై file లో మీ environment పై depend అయ్యే మూడు values insert చేయాలి.

Grafana provider section లో:

* `url` ... Grafana workspace URL ఇది ఈ విధంగా కనిపిస్తుంది: `https://xxxxxxxx.grafana-workspace.eu-west-1.amazonaws.com`.
* `auth` ... previous step లో create చేసిన API key.

Prometheus resource section లో, `url` insert చేయండి ఇది `https://aps-workspaces.eu-west-1.amazonaws.com/workspaces/ws-xxxxxxxxx` form లో AMP workspace URL.

:::note
    Amazon Managed Grafana ను file లో చూపిన region కంటే different region లో ఉపయోగిస్తుంటే, above కి అదనంగా, `sigv4_region` ను మీ region కు set చేయాలి.
:::
Preparation phase wrap up చేయడానికి, ఇప్పుడు Terraform initialize చేద్దాం:

```
$ terraform init
Initializing the backend...

Initializing provider plugins...
- Finding grafana/grafana versions matching ">= 1.13.3"...
- Installing grafana/grafana v1.13.3...
- Installed grafana/grafana v1.13.3 (signed by a HashiCorp partner, key ID 570AA42029AE241A)

Partner and community providers are signed by their developers.
If you'd like to know more about provider signing, you can read about it here:
https://www.terraform.io/docs/cli/plugins/signing.html

Terraform has created a lock file .terraform.lock.hcl to record the provider
selections it made above. Include this file in your version control repository
so that Terraform can guarantee to make the same selections by default when
you run "terraform init" in the future.

Terraform has been successfully initialized!

You may now begin working with Terraform. Try running "terraform plan" to see
any changes that are required for your infrastructure. All Terraform commands
should now work.

If you ever set or change modules or backend configuration for Terraform,
rerun this command to reinitialize your working directory. If you forget, other
commands will detect it and remind you to do so if necessary.
```

దీనితో, అన్నీ set అయ్యాయి మరియు ఈ క్రింద explain చేసినట్లు data source creation automate చేయడానికి Terraform ఉపయోగించవచ్చు.

### Terraform ఉపయోగించడం

సాధారణంగా, Terraform plan ఏమిటో మొదట చూస్తారు:

```
$ terraform plan

Terraform used the selected providers to generate the following execution plan. 
Resource actions are indicated with the following symbols:
  + create

Terraform will perform the following actions:

  # grafana_data_source.prometheus will be created
  + resource "grafana_data_source" "prometheus" {
      + access_mode        = "proxy"
      + basic_auth_enabled = false
      + id                 = (known after apply)
      + is_default         = true
      + name               = "amp"
      + type               = "prometheus"
      + url                = "https://aps-workspaces.eu-west-1.amazonaws.com/workspaces/ws-xxxxxx/"

      + json_data {
          + http_method     = "POST"
          + sigv4_auth      = true
          + sigv4_auth_type = "workspace-iam-role"
          + sigv4_region    = "eu-west-1"
        }
    }

Plan: 1 to add, 0 to change, 0 to destroy.

```

అక్కడ చూసిన దానితో happy అయితే, plan apply చేయవచ్చు:

```
$ terraform apply

Terraform used the selected providers to generate the following execution plan. 
Resource actions are indicated with the following symbols:
  + create

Terraform will perform the following actions:

  # grafana_data_source.prometheus will be created
  + resource "grafana_data_source" "prometheus" {
      + access_mode        = "proxy"
      + basic_auth_enabled = false
      + id                 = (known after apply)
      + is_default         = true
      + name               = "amp"
      + type               = "prometheus"
      + url                = "https://aps-workspaces.eu-west-1.amazonaws.com/workspaces/ws-xxxxxxxxx/"

      + json_data {
          + http_method     = "POST"
          + sigv4_auth      = true
          + sigv4_auth_type = "workspace-iam-role"
          + sigv4_region    = "eu-west-1"
        }
    }

Plan: 1 to add, 0 to change, 0 to destroy.

Do you want to perform these actions?
  Terraform will perform the actions described above.
  Only 'yes' will be accepted to approve.

  Enter a value: yes

grafana_data_source.prometheus: Creating...
grafana_data_source.prometheus: Creation complete after 1s [id=10]

Apply complete! Resources: 1 added, 0 changed, 0 destroyed.

```

ఇప్పుడు Grafana లో data source list కు వెళ్తే ఇలా కనిపించాలి:

![AMG లో AMP as data source](../images/amg-prom-ds-with-tf.png)

మీ newly created data source work అవుతుందో verify చేయడానికి, bottom లో blue `Save & test` button hit చేయవచ్చు మరియు result గా `Data source is working` confirmation message చూడాలి.

Terraform ను ఇతర విషయాలు automate చేయడానికి కూడా ఉపయోగించవచ్చు, ఉదాహరణకు, [Grafana provider][tf-grafana-provider] folders మరియు dashboards manage చేయడం support చేస్తుంది.

మీ dashboards organize చేయడానికి folder create చేయాలనుకుంటే:

```
resource "grafana_folder" "examplefolder" {
  title = "devops"
}
```

ఇంకా, `example-dashboard.json` అనే dashboard ఉంది, మరియు దాన్ని above folder లో create చేయాలనుకుంటే, ఈ snippet ఉపయోగించవచ్చు:

```
resource "grafana_dashboard" "exampledashboard" {
  folder = grafana_folder.examplefolder.id
  config_json = file("example-dashboard.json")
}
```

Terraform automation కోసం powerful tool మరియు ఇక్కడ చూపినట్లు మీ Grafana resources manage చేయడానికి ఉపయోగించవచ్చు.

:::note
    అయితే, Terraform లో [state][tf-state] default గా locally manage అవుతుందని గుర్తుంచుకోండి. అంటే, Terraform తో collaboratively work చేయాలని plan చేస్తే, team అంతటా state share చేయడానికి allow చేసే available options లో ఒకటి pick చేయాలి.
:::
## Cleanup

Console నుండి remove చేయడం ద్వారా Amazon Managed Grafana workspace remove చేయండి.

[aws-cli]: https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-install.html
[aws-cli-conf]: https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-configure.html
[tf]: https://www.terraform.io/downloads.html
[grafana-authn]: https://grafana.com/docs/grafana/latest/http_api/auth/
[rfc6750]: https://datatracker.ietf.org/doc/html/rfc6750
[tf-grafana-provider]: https://registry.terraform.io/providers/grafana/grafana/latest/docs
[tf-ds]: https://registry.terraform.io/providers/grafana/grafana/latest/docs/resources/data_source
[tf-state]: https://www.terraform.io/docs/language/state/remote.html

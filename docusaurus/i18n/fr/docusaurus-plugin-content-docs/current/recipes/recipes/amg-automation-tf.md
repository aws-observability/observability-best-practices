# Utiliser Terraform pour l'automatisation d'Amazon Managed Grafana

Dans cette recette, nous vous montrons comment utiliser Terraform pour automatiser Amazon Managed Grafana, par exemple pour ajouter des sources de données ou des tableaux de bord de manière cohérente sur plusieurs espaces de travail.

:::note
    Ce guide prendra environ 30 minutes à compléter.
:::
## Prérequis

* La [ligne de commande AWS][aws-cli] est installée et [configurée][aws-cli-conf] dans votre environnement local.
* Vous avez la ligne de commande [Terraform][tf] installée dans votre environnement local.
* Vous avez un espace de travail Amazon Managed Service for Prometheus prêt à l'emploi.
* Vous avez un espace de travail Amazon Managed Grafana prêt à l'emploi.

## Configurer Amazon Managed Grafana

Pour que Terraform puisse [s'authentifier][grafana-authn] auprès de Grafana, nous utilisons une clé API, qui agit comme un mot de passe.

:::info
    La clé API est un en-tête HTTP Bearer [RFC 6750][rfc6750]
    avec une valeur alphanumérique de 51 caractères authentifiant l'appelant à
    chaque requête envoyée à l'API Grafana.
:::

Donc, avant de pouvoir configurer le manifeste Terraform, nous devons d'abord créer une clé API. Vous le faites via l'interface Grafana comme suit.

Tout d'abord, sélectionnez dans le menu de gauche dans la section `Configuration` l'élément de menu `API keys` :

![Configuration, élément de menu API keys](../images/api-keys-menu-item.png)

Maintenant créez une nouvelle clé API, donnez-lui un nom pertinent pour votre tâche, assignez-lui le rôle `Admin` et définissez la durée de validité à, par exemple, un jour :

![Création de clé API](../images/api-key-creation.png)

:::note
    La clé API est valide pour une durée limitée, dans AMG vous pouvez utiliser des valeurs jusqu'à 30 jours.
:::
Une fois que vous cliquez sur le bouton `Add`, vous devriez voir une boîte de dialogue contenant la clé API :

![Résultat de la clé API](../images/api-key-result.png)

:::warning
    C'est la seule fois où vous verrez la clé API, alors conservez-la
    dans un endroit sûr, nous en aurons besoin dans le manifeste Terraform plus tard.
:::
Avec cela, nous avons configuré tout ce dont nous avons besoin dans Amazon Managed Grafana pour utiliser Terraform pour l'automatisation, passons donc à cette étape.

## Automatisation avec Terraform

### Préparation de Terraform

Pour que Terraform puisse interagir avec Grafana, nous utilisons le [fournisseur Grafana][tf-grafana-provider] officiel en version 1.13.3 ou supérieure.

Dans ce qui suit, nous voulons automatiser la création d'une source de données, dans notre cas nous voulons ajouter une [source de données][tf-ds] Prometheus, plus précisément, un espace de travail AMP.

Tout d'abord, créez un fichier appelé `main.tf` avec le contenu suivant :

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
Dans le fichier ci-dessus, vous devez insérer trois valeurs qui dépendent de votre environnement.

Dans la section du fournisseur Grafana :

* `url` ... l'URL de l'espace de travail Grafana qui ressemble à quelque chose comme :
      `https://xxxxxxxx.grafana-workspace.eu-west-1.amazonaws.com`.
* `auth` ... la clé API que vous avez créée à l'étape précédente.

Dans la section ressource Prometheus, insérez l'`url` qui est l'URL de l'espace de travail AMP sous la forme
`https://aps-workspaces.eu-west-1.amazonaws.com/workspaces/ws-xxxxxxxxx`.

:::note
    Si vous utilisez Amazon Managed Grafana dans une région différente de celle
    indiquée dans le fichier, vous devrez, en plus de ce qui précède, également définir
    `sigv4_region` sur votre région.
:::
Pour terminer la phase de préparation, initialisons maintenant Terraform :

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

Avec cela, nous sommes prêts et pouvons utiliser Terraform pour automatiser la création de la source de données comme expliqué ci-dessous.

### Utiliser Terraform

Habituellement, vous voudriez d'abord voir ce que Terraform prévoit de faire, comme ceci :

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

───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

Note: You didn't use the -out option to save this plan, so Terraform can't guarantee to take exactly these actions if you run "terraform apply" now.

```

Si vous êtes satisfait de ce que vous voyez, vous pouvez appliquer le plan :

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

Lorsque vous accédez à la liste des sources de données dans Grafana, vous devriez voir quelque chose comme ceci :

![AMP comme source de données dans AMG](../images/amg-prom-ds-with-tf.png)

Pour vérifier si votre source de données nouvellement créée fonctionne, vous pouvez cliquer sur le bouton bleu `Save & test` en bas et vous devriez voir un message de confirmation `Data source is working` comme résultat.

Vous pouvez également utiliser Terraform pour automatiser d'autres choses, par exemple, le [fournisseur Grafana][tf-grafana-provider] prend en charge la gestion des dossiers et des tableaux de bord.

Supposons que vous souhaitiez créer un dossier pour organiser vos tableaux de bord, par exemple :

```
resource "grafana_folder" "examplefolder" {
  title = "devops"
}
```

De plus, supposons que vous ayez un tableau de bord appelé `example-dashboard.json`, et que vous souhaitiez le créer dans le dossier ci-dessus, vous utiliseriez alors l'extrait suivant :

```
resource "grafana_dashboard" "exampledashboard" {
  folder = grafana_folder.examplefolder.id
  config_json = file("example-dashboard.json")
}
```

Terraform est un outil puissant pour l'automatisation et vous pouvez l'utiliser comme montré ici pour gérer vos ressources Grafana.

:::note
    Gardez à l'esprit, cependant, que l'[état dans Terraform][tf-state] est, par défaut,
    géré localement. Cela signifie que si vous prévoyez de travailler en collaboration avec Terraform,
    vous devez choisir l'une des options disponibles qui vous permettent de partager l'état au sein d'une équipe.
:::
## Nettoyage

Supprimez l'espace de travail Amazon Managed Grafana en le supprimant depuis la console.

[aws-cli]: https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-install.html
[aws-cli-conf]: https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-configure.html
[tf]: https://www.terraform.io/downloads.html
[grafana-authn]: https://grafana.com/docs/grafana/latest/http_api/auth/
[rfc6750]: https://datatracker.ietf.org/doc/html/rfc6750
[tf-grafana-provider]: https://registry.terraform.io/providers/grafana/grafana/latest/docs
[tf-ds]: https://registry.terraform.io/providers/grafana/grafana/latest/docs/resources/data_source
[tf-state]: https://www.terraform.io/docs/language/state/remote.html

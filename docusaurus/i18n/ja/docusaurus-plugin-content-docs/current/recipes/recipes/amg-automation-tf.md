# Terraform を使用した Amazon Managed Grafana の自動化

このレシピでは、Terraform を使用して Amazon Managed Grafana を自動化する方法を示します。たとえば、複数のワークスペース全体で一貫してデータソースやダッシュボードを追加できます。

:::note
    このガイドは完了までに約 30 分かかります。
:::
## 前提条件

* [AWS コマンドライン][aws-cli]がローカル環境にインストールされ、[設定][aws-cli-conf]されていること。
* ローカル環境に [Terraform][tf] コマンドラインがインストールされていること。
* 使用可能な Amazon Managed Service for Prometheus ワークスペースがあること。
* 使用可能な Amazon Managed Grafana ワークスペースがあること。

## Amazon Managed Grafana をセットアップする

Terraform が Grafana に対して[認証][grafana-authn]を行うために、パスワードのような役割を果たす API Key を使用しています。 

:::info
    API キーは [RFC 6750][rfc6750] HTTP Bearer ヘッダーであり、51 文字の英数字値を持ち、Grafana API に対するすべてのリクエストで呼び出し元を認証します。
:::

したがって、Terraform マニフェストをセットアップする前に、まず API キーを作成する必要があります。これは、次のように Grafana UI を使用して行います。

まず、左側のメニューから選択します。 `Configuration` セクション
the `API keys` メニュー項目

![Configuration, API keys menu item](../images/api-keys-menu-item.png)

新しい API キーを作成し、実行するタスクに適した名前を付けて、割り当てます。 `Admin` ロールを設定し、期間を例えば 1 日に設定します。

![API key creation](../images/api-key-creation.png)

:::note
    API キーは限られた期間有効です。AMG では最大 30 日間の値を使用できます。
:::
一度 `Add` ボタンをクリックすると、API キーを含むポップアップダイアログが表示されます。

![API key result](../images/api-key-result.png)

:::warning
    API キーが表示されるのはこのときだけなので、安全な場所に保存してください。後で Terraform マニフェストで必要になります。
:::
これで、Terraform を使用した自動化のために Amazon Managed Grafana で必要なすべての設定が完了しましたので、次のステップに進みましょう。

## Terraform による自動化

### Terraform の準備

Terraform が Grafana と対話できるようにするために、バージョン 1.13.3 以降の公式 [Grafana プロバイダー][tf-grafana-provider]を使用しています。

以下では、データソースの作成を自動化します。今回のケースでは、Prometheus [データソース][tf-ds]、正確には AMP ワークスペースを追加します。

まず、次のファイルを作成します。 `main.tf` 以下の内容を含みます。

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
上記のファイルでは、環境に応じた 3 つの値を挿入する必要があります。

Grafana プロバイダーセクションで、次の操作を行います。

* `url` … 次のような Grafana ワークスペース URL `https://xxxxxxxx.grafana-workspace.eu-west-1.amazonaws.com`.
* `auth` … 前のステップで作成した API キー。

Prometheus リソースセクションに、次を挿入します。 `url` AMP ワークスペース URL の形式は次のとおりです。 
`https://aps-workspaces.eu-west-1.amazonaws.com/workspaces/ws-xxxxxxxxx`.

:::note
    ファイルに表示されているリージョンとは異なるリージョンで Amazon Managed Grafana を使用している場合は、上記に加えて、次の設定も行う必要があります。
    `sigv4_region` お客様のリージョンに変更してください。
:::
準備フェーズを完了するために、Terraform を初期化しましょう。

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

これで準備が整い、以下で説明するように Terraform を使用してデータソースの作成を自動化できます。

### Terraform の使用

通常、まず次のように Terraform のプランを確認します。

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

表示された内容に問題がなければ、プランを適用できます。

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

Grafana のデータソースリストに移動すると、次のような画面が表示されます。

![AMP as data source in AMG](../images/amg-prom-ds-with-tf.png)

新しく作成したデータソースが機能するかどうかを確認するには、青色の `Save & test` 下部のボタンをクリックすると、次のように表示されます `Data source is working` ここで確認メッセージが結果として表示されます。

Terraform を使用して他のことも自動化できます。たとえば、[Grafana プロバイダー][tf-grafana-provider]はフォルダーとダッシュボードの管理をサポートしています。

ダッシュボードを整理するためのフォルダを作成したいとします。例えば次のようになります。

```
resource "grafana_folder" "examplefolder" {
  title = "devops"
}
```

さらに、次のようなダッシュボードがあるとします `example-dashboard.json`を使用し、上記のフォルダに作成する場合は、次のスニペットを使用します。

```
resource "grafana_dashboard" "exampledashboard" {
  folder = grafana_folder.examplefolder.id
  config_json = file("example-dashboard.json")
}
```

Terraform は自動化のための強力なツールであり、ここに示すように Grafana リソースの管理に使用できます。 

:::note
    ただし、[Terraform の state][tf-state] は、デフォルトではローカルで管理されることに注意してください。つまり、Terraform を使用して共同作業を行う予定がある場合は、チーム全体で state を共有できる利用可能なオプションのいずれかを選択する必要があります。
:::
## クリーンアップ

コンソールから削除して、Amazon Managed Grafana ワークスペースを削除します。

[aws-cli]: https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-install.html
[aws-cli-conf]: https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-configure.html
[tf]: https://www.terraform.io/downloads.html
[grafana-authn]: https://grafana.com/docs/grafana/latest/http_api/auth/
[rfc6750]: https://datatracker.ietf.org/doc/html/rfc6750
[tf-grafana-provider]: https://registry.terraform.io/providers/grafana/grafana/latest/docs
[tf-ds]: https://registry.terraform.io/providers/grafana/grafana/latest/docs/resources/data_source
[tf-state]: https://www.terraform.io/docs/language/state/remote.html

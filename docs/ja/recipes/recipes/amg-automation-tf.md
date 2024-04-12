# Terraform を使用した Amazon Managed Grafana の自動化

このレシピでは、[Amazon Managed Grafana](../../amg/) の Terraform による自動化の方法を示します。
たとえば、ワークスペース間でデータソースやダッシュボードを一貫性をもって追加することができます。

!!! note
    このガイドの完了には約 30 分かかります。

## 前提条件

* [AWS コマンドライン][aws-cli] がインストールされ、ローカル環境で[設定][aws-cli-conf]されていること。
* ローカル環境に [Terraform][tf] コマンドラインがインストールされていること。
* 使用できる [Amazon Managed Service for Prometheus](../../amp/) ワークスペースがあること。 
* 使用できる [Amazon Managed Grafana](../../amg/) ワークスペースがあること。

## Amazon Managed Grafanaの設定

Terraformが[Grafanaに対して認証][grafana-authn]するために、APIキーを使用しています。APIキーはパスワードのようなものです。

!!! info
    APIキーは、Grafana APIに対するすべてのリクエストで呼び出し元を認証するための51文字の英数字値を持つ[RFC 6750][rfc6750] HTTPベアラーヘッダーです。

したがって、Terraformマニフェストを設定する前に、まずAPIキーを作成する必要があります。Grafana UIで次のように行います。

まず、左側のメニューの`Configuration`セクションから`API keys`メニュー項目を選択します。

![Configuration、API keys メニュー項目](../images/api-keys-menu-item.png)

次に、新しいAPIキーを作成し、現在のタスクに合った名前を付け、`Admin` ロールを割り当て、期間を例えば1日に設定します。

![APIキーの作成](../images/api-key-creation.png)

!!! note
    APIキーの有効期間は限定されています。AMGでは30日までの値を使用できます。

`Add`ボタンをクリックすると、APIキーが含まれているポップアップダイアログが表示されます。

![APIキーの結果](../images/api-key-result.png) 

!!! warning
    これがAPIキーを確認できる唯一の機会なので、ここから安全な場所に保存しておきましょう。後でTerraformマニフェストで必要になります。

これで、Terraformによる自動化のためにAmazon Managed Grafanaで必要なすべての設定が完了しました。次はその手順に進みましょう。

## Terraform による自動化

### Terraformの準備

TerraformがGrafanaと対話できるようにするために、バージョン1.13.3以上の公式[Grafanaプロバイダー][tf-grafana-provider]を使用します。

以下では、データソースの自動作成をしたいと考えています。具体的には、Prometheusの[データソース][tf-ds]、つまりAMPワークスペースを追加したいです。

まず、次の内容で`main.tf`というファイルを作成します。

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
上記のファイルでは、環境に依存する3つの値を入力する必要があります。

Grafanaプロバイダーセクションで:

* `url` ... 次のような形式のGrafanaワークスペースのURLを入力します。`https://xxxxxxxx.grafana-workspace.eu-west-1.amazonaws.com`
* `auth` ... 前のステップで作成したAPIキーを入力します

Prometheusリソースセクションで、 `https://aps-workspaces.eu-west-1.amazonaws.com/workspaces/ws-xxxxxxxxx`の形式のAMPワークスペースのURLを入力します。

!!! note
    ファイルに示されているリージョンとは異なるリージョンでAmazon Managed Grafanaを使用している場合は、上記に加えて、`sigv4_region`をご利用のリージョンに設定する必要があります。

準備フェーズの締めくくりとして、次にTerraformを初期化しましょう:

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

これで準備が整い、以下で説明するデータソースの自動作成にTerraformを使用できるようになりました。

### Terraform の使用

通常、Terraform の計画を最初に確認します。

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

表示内容に問題がなければ、プランを適用できます。

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

Grafana のデータソースリストを確認すると、次のように表示されます。

![AMP as data source in AMG](../images/amg-prom-ds-with-tf.png)

作成したデータソースが機能していることを確認するには、下部の青い `Save & test` ボタンをクリックします。  
`Data source is working` という確認メッセージが表示されれば、データソースは正常に機能しています。

Terraform は他の自動化にも使用できます。たとえば、[Grafana プロバイダー][tf-grafana-provider]は、フォルダやダッシュボードの管理をサポートしています。

ダッシュボードを整理するフォルダを作成する場合は、次のように記述できます。

```
resource "grafana_folder" "examplefolder" {
  title = "devops"
}
```

さらに、`example-dashboard.json` というダッシュボードがあり、上記のフォルダに作成したい場合は、次のスニペットを使用します。

```
resource "grafana_dashboard" "exampledashboard" {
  folder = grafana_folder.examplefolder.id
  config_json = file("example-dashboard.json")
}
```

Terraform は自動化のための強力なツールであり、ここで示したように Grafana リソースを管理するために使用できます。

!!! note
    ただし、[Terraform の状態][tf-state]はデフォルトでローカルに管理されていることに注意してください。つまり、Terraform でチームとして共同作業する場合は、状態をチーム間で共有できるオプションのいずれかを選択する必要があります。

## クリーンアップ

コンソールから Amazon Managed Grafana ワークスペースを削除してください。

[aws-cli]: https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-install.html
[aws-cli-conf]: https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-configure.html
[tf]: https://www.terraform.io/downloads.html
[grafana-authn]: https://grafana.com/docs/grafana/latest/http_api/auth/
[rfc6750]: https://datatracker.ietf.org/doc/html/rfc6750
[tf-grafana-provider]: https://registry.terraform.io/providers/grafana/grafana/latest/docs
[tf-ds]: https://registry.terraform.io/providers/grafana/grafana/latest/docs/resources/data_source
[tf-state]: https://www.terraform.io/docs/language/state/remote.html

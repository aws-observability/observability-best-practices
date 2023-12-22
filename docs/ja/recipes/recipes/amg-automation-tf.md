# Terraform を使用した Amazon Managed Grafana の自動化

このレシピでは、Terraform を使用して [Amazon Managed Grafana](../../amg/) を自動化する方法を示します。
たとえば、複数のワークスペースにわたってデータソースやダッシュボードを一貫して追加するなどです。

!!! note
    このガイドの完了には約 30 分かかります。

## 前提条件

* [AWS コマンドライン][aws-cli] がインストールされ、ローカル環境で[設定][aws-cli-conf]されていること。
* ローカル環境に [Terraform][tf] コマンドラインがインストールされていること。
* 使用できる [Amazon Managed Service for Prometheus](../../amp/) ワークスペースがあること。 
* 使用できる [Amazon Managed Grafana](../../amg/) ワークスペースがあること。

## Amazon Managed Grafanaの設定

Terraformが[Grafanaに対して認証][grafana-authn]するために、パスワードのような役割を果たすAPIキーを使用しています。

!!! info
    APIキーは、Grafana APIに対する呼び出しごとに呼び出し元を認証する51文字の英数字値を持つ[RFC 6750][rfc6750] HTTPベアラーヘッダーです。

したがって、Terraformマニフェストを設定する前に、まずAPIキーを作成する必要があります。これは、Grafana UIで次のように行います。

まず、`Configuration`セクションの左側のメニューから`API keys`メニュー項目を選択します。

![Configuration、API keys メニュー項目](../images/api-keys-menu-item.png)

次に、新しいAPIキーを作成し、現在のタスクに対して意味のある名前を付け、`Admin` ロールを割り当て、期間を例えば1日に設定します。

![APIキーの作成](../images/api-key-creation.png)

!!! note
    APIキーの有効期間は限定されています。AMGでは30日までの値を使用できます。

`Add`ボタンをクリックすると、APIキーが含まれているポップアップダイアログが表示されます。

![APIキーの結果](../images/api-key-result.png) 

!!! warning
    これがAPIキーを確認できる唯一のタイミングなので、ここから安全な場所に保存しておきます。後でTerraformマニフェストで必要になります。

これで、Terraformによる自動化のためにAmazon Managed Grafanaで必要なすべての設定が完了しました。次はその手順に進みましょう。

## Terraform による自動化

### Terraform の準備

Terraform が Grafana と対話できるようにするために、バージョン 1.13.3 以上の公式 [Grafana プロバイダー][tf-grafana-provider] を使用しています。

以下では、データソースの自動作成を行いたいと考えています。具体的には、Prometheus の [データソース][tf-ds]、つまり AMP ワークスペースを追加したいと考えています。

まず、次のコンテンツを含む `main.tf` というファイルを作成します。

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
上記のファイルでは、環境に依存する 3 つの値を挿入する必要があります。

Grafana プロバイダー セクションで:

* `url` ... 次のような形式の Grafana ワークスペース URL: 
      `https://xxxxxxxx.grafana-workspace.eu-west-1.amazonaws.com`。
* `auth` ... 前のステップで作成した API キー。

Prometheus リソース セクションでは、`https://aps-workspaces.eu-west-1.amazonaws.com/workspaces/ws-xxxxxxxxx` のような形式の AMP ワークスペース URL を挿入します。

!!! note
    ファイルに示されているリージョンとは異なるリージョンで Amazon Managed Grafana を使用している場合は、上記に加えて、 `sigv4_region` をご利用のリージョンに設定する必要があります。

準備フェーズの締めくくりとして、次に Terraform を初期化しましょう:

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

これで準備が整い、以下で説明するデータソースの作成を Terraform で自動化できるようになりました。

### Terraform の使用

通常、Terraform のプランを次のように確認します。

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

Grafana のデータソースリストを確認すると、次のような内容が表示されるはずです。

![AMP as data source in AMG](../images/amg-prom-ds-with-tf.png)

新しく作成したデータソースが機能するかどうかを確認するには、下部の青い `Save & test` ボタンをクリックします。
結果として「Data source is working」の確認メッセージが表示されるはずです。

Terraform は他の自動化にも使用できます。例えば、[Grafana プロバイダー][tf-grafana-provider]は、フォルダやダッシュボードの管理をサポートしています。

ダッシュボードを整理するためのフォルダを作成したいとします。例:

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
    ただし、[Terraform の状態][tf-state]は、デフォルトでローカルに管理されていることに注意してください。つまり、Terraform で共同作業を行う場合は、状態をチーム全体で共有できるオプションのいずれかを選択する必要があります。

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

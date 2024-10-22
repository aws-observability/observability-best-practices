# Amazon Managed Grafana の自動化に Terraform を使用する

このレシピでは、Amazon Managed Grafana を自動化するために Terraform を使用する方法を示します。
たとえば、複数のワークスペースにわたってデータソースやダッシュボードを一貫して追加する場合などです。

note
    このガイドを完了するのに約 30 分かかります。


## 前提条件

* [AWS コマンドライン][aws-cli] がローカル環境にインストールされ、[設定][aws-cli-conf] されている。
* [Terraform][tf] コマンドラインがローカル環境にインストールされている。
* 使用可能な Amazon Managed Service for Prometheus ワークスペースがある。
* 使用可能な Amazon Managed Grafana ワークスペースがある。

## Amazon Managed Grafana のセットアップ

Terraform が Grafana に対して[認証][grafana-authn]するために、パスワードのようなものとして機能する API キーを使用しています。

info
    API キーは、[RFC 6750][rfc6750] の HTTP Bearer ヘッダで、51 文字の英数字の値を持ち、Grafana API に対する各リクエストで呼び出し元を認証します。


そのため、Terraform マニフェストをセットアップする前に、まず API キーを作成する必要があります。これは Grafana UI から以下のように行います。

まず、左側のメニューから `Configuration` セクションの `API keys` メニュー項目を選択します。

![Configuration, API keys menu item](../images/api-keys-menu-item.png)

次に、新しい API キーを作成し、作業に適した名前を付け、`Admin` ロールを割り当て、有効期間を例えば 1 日に設定します。

![API key creation](../images/api-key-creation.png)

note
    API キーの有効期間は限られています。AMG では最大 30 日まで設定できます。


`Add` ボタンを押すと、API キーが表示されるポップアップダイアログが表示されます。

![API key result](../images/api-key-result.png)

warning
    API キーはこの時しか表示されないので、安全な場所に保存してください。後で Terraform マニフェストで必要になります。


これで、Terraform による自動化のために Amazon Managed Grafana で必要なセットアップが完了しました。次のステップに進みましょう。

## Terraform による自動化

### Terraform の準備

Terraform が Grafana と対話できるようにするため、公式の [Grafana プロバイダー][tf-grafana-provider] バージョン 1.13.3 以上を使用しています。

以下では、データソースの作成を自動化したいと考えています。具体的には、Prometheus の [データソース][tf-ds]、つまり AMP ワークスペースを追加したいと思っています。

まず、次の内容で `main.tf` というファイルを作成します。

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

Grafana プロバイダーのセクションでは:

* `url` ... Grafana ワークスペースの URL で、次のような形式になります: `https://xxxxxxxx.grafana-workspace.eu-west-1.amazonaws.com`。
* `auth` ... 前のステップで作成した API キー。

Prometheus リソースのセクションでは、`url` に AMP ワークスペースの URL を `https://aps-workspaces.eu-west-1.amazonaws.com/workspaces/ws-xxxxxxxxx` の形式で挿入します。

note
    Amazon Managed Grafana を、ファイルに示されている以外のリージョンで使用している場合は、上記に加えて `sigv4_region` を使用しているリージョンに設定する必要があります。

準備フェーズを終えるため、次に Terraform を初期化しましょう:

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

これで準備が整い、以下で説明するようにデータソースの作成を Terraform で自動化できます。

### Terraform の使用

通常、最初に Terraform の計画を確認するところから始めます。

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

表示された内容に問題がなければ、計画を適用できます。

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

これで Grafana のデータソースリストに次のようなものが表示されるはずです。

![AMG でのデータソースとしての AMP](../images/amg-prom-ds-with-tf.png)

新しく作成したデータソースが機能することを確認するには、下部の青い「Save & test」ボタンをクリックすると、「Data source is working」という確認メッセージが表示されます。

Terraform を使えば、他のことも自動化できます。たとえば、[Grafana プロバイダ][tf-grafana-provider] はフォルダやダッシュボードの管理をサポートしています。

例えば、ダッシュボードを整理するためのフォルダを作成したい場合は、次のようにします。

```
resource "grafana_folder" "examplefolder" {
  title = "devops"
}
```

さらに、`example-dashboard.json` という名前のダッシュボードがあり、上記のフォルダにそれを作成したい場合は、次のスニペットを使用します。

```
resource "grafana_dashboard" "exampledashboard" {
  folder = grafana_folder.examplefolder.id
  config_json = file("example-dashboard.json")
}
```

Terraform は自動化に強力なツールであり、ここに示したように Grafana リソースを管理するために使用できます。

note
    ただし、Terraform の[ステート][tf-state]はデフォルトでローカルに管理されることに注意してください。つまり、Terraform を協調して作業する予定の場合は、チーム全体でステートを共有できるオプションのいずれかを選択する必要があります。


## クリーンアップ

コンソールから Amazon Managed Grafana ワークスペースを削除することで、ワークスペースを削除します。

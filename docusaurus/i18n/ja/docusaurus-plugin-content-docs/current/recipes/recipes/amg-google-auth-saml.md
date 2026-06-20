# SAML を使用して Amazon Managed Grafana で Google Workspaces 認証を設定する

このガイドでは、SAML v2.0 プロトコルを使用して、Google Workspaces を Amazon Managed Grafana の ID プロバイダー (IdP) として設定する方法について説明します。

このガイドに従うには、有料の [Google Workspaces][google-workspaces] アカウントを作成することに加えて、[Amazon Managed Grafana ワークスペース][amg-ws]を作成する必要があります。

### Amazon Managed Grafana ワークスペースを作成する

Amazon Managed Grafana コンソールにログインし、**Create workspace** をクリックします。次の画面で、以下に示すようにワークスペース名を入力します。次に **Next** をクリックします。

![Create Workspace - Specify workspace details](../images/amg-saml-google-auth/1.png)

**設定の構成**ページで、**Security Assertion Markup Language (SAML)** オプションを選択し、ユーザーがログインするための SAML ベースの Identity Provider を構成できるようにします。

![Create Workspace - Configure settings](../images/amg-saml-google-auth/2.png)

選択するデータソースを選び、**Next** をクリックします。
![Create Workspace - Permission settings](../images/amg-saml-google-auth/3.png)

**Review and create** 画面で **Create workspace** ボタンをクリックします。
![Create Workspace - Review settings](../images/amg-saml-google-auth/4.png)

これにより、以下に示すように新しい Amazon Managed Grafana ワークスペースが作成されます。

![Create Workspace - Create AMG workspace](../images/amg-saml-google-auth/5.png)

### Google Workspaces を設定する

Google Workspaces にスーパー管理者権限でログインし、**Apps** セクションの **Web and mobile apps** に移動します。そこで **Add App** をクリックし、**Add custom SAML app** を選択します。次に、以下に示すようにアプリに名前を付けます。**CONTINUE** をクリックします。

![Google Workspace - Add custom SAML app - App details](../images/amg-saml-google-auth/6.png)


次の画面で、**DOWNLOAD METADATA** ボタンをクリックして SAML メタデータファイルをダウンロードします。**CONTINUE** をクリックします。

![Google Workspace - Add custom SAML app - Download Metadata](../images/amg-saml-google-auth/7.png)

次の画面に、ACS URL、Entity ID、Start URL のフィールドが表示されます。
これらのフィールドの値は、Amazon Managed Grafana コンソールから取得できます。

**Name ID format** フィールドのドロップダウンから **EMAIL** を選択し、**Name ID** フィールドで **Basic Information > Primary email** を選択します。

**CONTINUE** をクリックします。
![Google Workspace - Add custom SAML app - Service provider details](../images/amg-saml-google-auth/8.png)

![AMG - SAML Configuration details](../images/amg-saml-google-auth/9.png)

**属性マッピング**画面で、以下のスクリーンショットに示すように、**Google Directory 属性**と**アプリ属性**の間のマッピングを行います。

![Google Workspace - Add custom SAML app - Attribute mapping](../images/amg-saml-google-auth/10.png)

Google 認証を通じてログインするユーザーが **Amazon Managed Grafana** で **Admin** 権限を持つようにするには、**Department** フィールドの値を ***monitoring*** に設定します。これには任意のフィールドと任意の値を選択できます。Google Workspaces 側で使用することを選択したものは、必ず Amazon Managed Grafana の SAML 設定でマッピングを行い、それを反映させてください。

### SAML メタデータを Amazon Managed Grafana にアップロードする

Amazon Managed Grafana コンソールで、**Upload or copy/paste** オプションをクリックし、**Choose file** ボタンを選択して、先ほど Google Workspaces からダウンロードした SAML メタデータファイルをアップロードします。

**Assertion mapping** セクションで、**Assertion attribute role** フィールドに **Department** を入力し、**Admin role values** フィールドに **monitoring** を入力します。これにより、**Department** が **monitoring** でログインするユーザーは、Grafana で **Admin** 権限を持つことができ、ダッシュボードやデータソースの作成などの管理者タスクを実行できるようになります。

以下のスクリーンショットに示すように、**Additional settings - optional** セクションで値を設定します。**Save SAML configuration** をクリックします。

![AMG SAML - Assertion mapping](../images/amg-saml-google-auth/11.png)

これで Amazon Managed Grafana が Google Workspaces を使用してユーザーを認証するように設定されました。

ユーザーがログインすると、次のように Google ログインページにリダイレクトされます。

![Google Workspace - Google sign in](../images/amg-saml-google-auth/12.png)

認証情報を入力すると、以下のスクリーンショットに示すように Grafana にログインされます。
![AMG - Grafana user settings page](../images/amg-saml-google-auth/13.png)

ご覧のとおり、ユーザーは Google Workspaces 認証を使用して Grafana に正常にログインできました。

[google-workspaces]: https://workspace.google.com/
[amg-ws]: https://docs.aws.amazon.com/grafana/latest/userguide/getting-started-with-AMG.html#AMG-getting-started-workspace

# SAML を使用して Amazon Managed Grafana で Google Workspaces 認証を設定する

このガイドでは、SAML v2.0 プロトコルを使用して、Google Workspaces を Amazon Managed Grafana のアイデンティティプロバイダー (IdP) として設定する方法を説明します。

このガイドに従うには、[Amazon Managed Grafana ワークスペース][amg-ws] の作成に加えて、有料の [Google Workspaces][google-workspaces] アカウントを作成する必要があります。



### Amazon Managed Grafana ワークスペースの作成

Amazon Managed Grafana コンソールにログインし、**Create workspace** をクリックします。
次の画面で、以下のようにワークスペース名を入力し、**Next** をクリックします：

![Create Workspace - Specify workspace details](../images/amg-saml-google-auth/1.png)

**Configure settings** ページで、**Security Assertion Markup Language (SAML)** オプションを選択し、ユーザーのログインに使用する SAML ベースの Identity Provider を設定できるようにします：

![Create Workspace - Configure settings](../images/amg-saml-google-auth/2.png)

使用したいデータソースを選択し、**Next** をクリックします：
![Create Workspace - Permission settings](../images/amg-saml-google-auth/3.png)

**Review and create** 画面で **Create workspace** ボタンをクリックします：
![Create Workspace - Review settings](../images/amg-saml-google-auth/4.png)

以下のように、新しい Amazon Managed Grafana ワークスペースが作成されます：

![Create Workspace - Create AMG workspace](../images/amg-saml-google-auth/5.png)



### Google Workspace の設定

スーパー管理者権限で Google Workspace にログインし、**Apps** セクションの下にある **Web and mobile apps** に移動します。
そこで、**Add App** をクリックし、**Add custom SAML app** を選択します。
以下のように、アプリに名前を付けます。
**CONTINUE** をクリックします。

![Google Workspace - Add custom SAML app - App details](../images/amg-saml-google-auth/6.png)

次の画面で、**DOWNLOAD METADATA** ボタンをクリックして SAML メタデータファイルをダウンロードします。
**CONTINUE** をクリックします。

![Google Workspace - Add custom SAML app - Download Metadata](../images/amg-saml-google-auth/7.png)

次の画面では、ACS URL、Entity ID、Start URL フィールドが表示されます。
これらのフィールドの値は、Amazon Managed Grafana コンソールから取得できます。

**Name ID format** フィールドのドロップダウンから **EMAIL** を選択し、**Name ID** フィールドで **Basic Information > Primary email** を選択します。

**CONTINUE** をクリックします。
![Google Workspace - Add custom SAML app - Service provider details](../images/amg-saml-google-auth/8.png)

![AMG - SAML Configuration details](../images/amg-saml-google-auth/9.png)

**Attribute mapping** 画面で、以下のスクリーンショットのように **Google Directory attributes** と **App attributes** の間のマッピングを行います。

![Google Workspace - Add custom SAML app - Attribute mapping](../images/amg-saml-google-auth/10.png)

Google 認証でログインするユーザーが **Amazon Managed Grafana** で **Admin** 権限を持つようにするには、**Department** フィールドの値を ***monitoring*** に設定します。
このために任意のフィールドと値を選択できます。
Google Workspace 側で何を使用するかを選択したら、それを反映するように Amazon Managed Grafana の SAML 設定でマッピングを行ってください。



### Amazon Managed Grafana への SAML メタデータのアップロード

Amazon Managed Grafana コンソールで、**Upload or copy/paste** オプションをクリックし、**Choose file** ボタンを選択して、先ほど Google Workspace からダウンロードした SAML メタデータファイルをアップロードします。

**Assertion mapping** セクションで、**Assertion attribute role** フィールドに **Department** を、**Admin role values** フィールドに **monitoring** を入力します。
これにより、**Department** が **monitoring** のユーザーが Grafana で **Admin** 権限を持ち、ダッシュボードやデータソースの作成などの管理者の職務を実行できるようになります。

以下のスクリーンショットのように、**Additional settings - optional** セクションの値を設定します。**Save SAML configuration** をクリックします：

![AMG SAML - Assertion mapping](../images/amg-saml-google-auth/11.png)

これで Amazon Managed Grafana は Google Workspace を使用してユーザーを認証するように設定されました。

ユーザーがログインすると、以下のように Google のログインページにリダイレクトされます：

![Google Workspace - Google sign in](../images/amg-saml-google-auth/12.png)

認証情報を入力すると、以下のスクリーンショットのように Grafana にログインされます。
![AMG - Grafana user settings page](../images/amg-saml-google-auth/13.png)

ご覧のように、ユーザーは Google Workspace 認証を使用して Grafana に正常にログインできました。

[google-workspaces]: https://workspace.google.com/
[amg-ws]: https://docs.aws.amazon.com/ja_jp/grafana/latest/userguide/getting-started-with-AMG.html

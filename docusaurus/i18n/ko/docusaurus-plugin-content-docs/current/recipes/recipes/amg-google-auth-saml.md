# SAML을 사용하여 Amazon Managed Grafana에서 Google Workspaces 인증 구성

이 가이드에서는 SAML v2.0 프로토콜을 사용하여 Google Workspaces를 Amazon Managed Grafana의
ID 공급자(IdP)로 설정하는 방법을 안내합니다.

이 가이드를 따르려면 유료 [Google Workspaces][google-workspaces] 계정과
[Amazon Managed Grafana 워크스페이스][amg-ws]가 생성되어 있어야 합니다.

### Amazon Managed Grafana 워크스페이스 생성

Amazon Managed Grafana 콘솔에 로그인하고 **Create workspace**를 클릭합니다. 다음 화면에서
아래와 같이 워크스페이스 이름을 입력합니다. 그런 다음 **Next**를 클릭합니다:

![Create Workspace - Specify workspace details](../images/amg-saml-google-auth/1.png)

**Configure settings** 페이지에서 **Security Assertion Markup Language (SAML)** 
옵션을 선택하여 사용자 로그인을 위한 SAML 기반 ID 공급자를 구성합니다:

![Create Workspace - Configure settings](../images/amg-saml-google-auth/2.png)

사용하려는 데이터 소스를 선택하고 **Next**를 클릭합니다:
![Create Workspace - Permission settings](../images/amg-saml-google-auth/3.png)

**Review and create** 화면에서 **Create workspace** 버튼을 클릭합니다:
![Create Workspace - Review settings](../images/amg-saml-google-auth/4.png)

아래와 같이 새 Amazon Managed Grafana 워크스페이스가 생성됩니다:

![Create Workspace - Create AMG workspace](../images/amg-saml-google-auth/5.png)

### Google Workspaces 구성

Super Admin 권한으로 Google Workspaces에 로그인하고 **Apps** 섹션에서
**Web and mobile apps**로 이동합니다. 거기서 **Add App**을 클릭하고
**Add custom SAML app**을 선택합니다. 아래와 같이 앱 이름을 지정합니다.
**CONTINUE**를 클릭합니다:

![Google Workspace - Add custom SAML app - App details](../images/amg-saml-google-auth/6.png)


다음 화면에서 **DOWNLOAD METADATA** 버튼을 클릭하여 SAML 메타데이터 파일을 다운로드합니다. **CONTINUE**를 클릭합니다.

![Google Workspace - Add custom SAML app - Download Metadata](../images/amg-saml-google-auth/7.png)

다음 화면에서 ACS URL, Entity ID, Start URL 필드가 표시됩니다.
이러한 필드의 값은 Amazon Managed Grafana 콘솔에서 확인할 수 있습니다.

**Name ID format** 필드의 드롭다운에서 **EMAIL**을 선택하고, **Name ID** 필드에서 **Basic Information > Primary email**을 선택합니다.

**CONTINUE**를 클릭합니다.
![Google Workspace - Add custom SAML app - Service provider details](../images/amg-saml-google-auth/8.png)

![AMG - SAML Configuration details](../images/amg-saml-google-auth/9.png)

**Attribute mapping** 화면에서 아래 스크린샷과 같이 **Google Directory attributes**와 **App attributes** 간의 매핑을 설정합니다.

![Google Workspace - Add custom SAML app - Attribute mapping](../images/amg-saml-google-auth/10.png)

Google 인증을 통해 로그인하는 사용자가 **Amazon Managed Grafana**에서 **Admin** 권한을 가지려면,
**Department** 필드의 값을 ***monitoring***으로 설정합니다. 이를 위해 어떤 필드와 값을 사용하든
Google Workspaces 측에서 선택한 내용이 Amazon Managed Grafana SAML 설정에 반영되도록 매핑해야 합니다.

### Amazon Managed Grafana에 SAML 메타데이터 업로드

이제 Amazon Managed Grafana 콘솔에서 **Upload or copy/paste** 옵션을 클릭하고
**Choose file** 버튼을 선택하여 앞서 Google Workspaces에서 다운로드한 SAML 메타데이터 파일을 업로드합니다.

**Assertion mapping** 섹션에서 **Assertion attribute role** 필드에 **Department**를 입력하고
**Admin role values** 필드에 **monitoring**을 입력합니다.
이렇게 하면 **Department**가 **monitoring**인 상태로 로그인하는 사용자가 Grafana에서
**Admin** 권한을 갖게 되어 대시보드 및 데이터 소스 생성과 같은 관리자 작업을 수행할 수 있습니다.

아래 스크린샷에 표시된 대로 **Additional settings - optional** 섹션의 값을 설정합니다.
**Save SAML configuration**을 클릭합니다:

![AMG SAML - Assertion mapping](../images/amg-saml-google-auth/11.png)

이제 Amazon Managed Grafana가 Google Workspaces를 사용하여 사용자를 인증하도록 설정되었습니다.

사용자가 로그인하면 다음과 같이 Google 로그인 페이지로 리다이렉트됩니다:

![Google Workspace - Google sign in](../images/amg-saml-google-auth/12.png)

자격 증명을 입력하면 아래 스크린샷과 같이 Grafana에 로그인됩니다.
![AMG - Grafana user settings page](../images/amg-saml-google-auth/13.png)

보시다시피, 사용자가 Google Workspaces 인증을 사용하여 Grafana에 성공적으로 로그인할 수 있었습니다.

[google-workspaces]: https://workspace.google.com/
[amg-ws]: https://docs.aws.amazon.com/grafana/latest/userguide/getting-started-with-AMG.html#AMG-getting-started-workspace

---
sidebar_position: 4
---
# JITNA Cedar ポリシーの例

このセクションには、Systems Manager のジャストインタイムノードアクセス (JITNA) を使用する際のポリシー例のサンプルが含まれています。これらのサンプルは、ジャストインタイムノードセッションリクエストへの自動アクセスを許可または拒否するための Cedar ポリシーの実装方法について、AWS のお客様に説明することを目的としています。

ジャストインタイムノードアクセスのスキーマの詳細については、[自動承認およびアクセス拒否ポリシーのステートメント構造と組み込み演算子](https://docs.aws.amazon.com/systems-manager/latest/userguide/auto-approval-deny-access-policy-statement-structure.html)を参照してください。Cedar ポリシーの作成の詳細については、[Cedar プレイグラウンド](https://www.cedarpolicy.com/en/playground)を参照してください。

このコードはサンプルコードであり、本番環境で使用する前に、開発環境で十分にテストおよび検証する必要があることに注意してください。

## オンコール IDC グループに本番ノードへの自動アクセスを許可する

以下の例では、次のものへの自動アクセスを許可します。

* すべての ID から開発ノードへ。開発ノードはタグのキーと値のペア `Environment:DEV` で識別されます。
* AWS Identity Center (IDC) グループ **OnCall** のユーザーから本番ノードへ。本番ノードはタグのキーと値のペア `Environment:PROD` で識別されます。

```language=cedar
// Permit automatic access to DEV nodes
permit (principal, 
      action == AWS::SSM::Action::"getTokenForInstanceAccess", 
      resource)
    when {
    resource.hasTag("Environment") && 
    resource.getTag("Environment") == "DEV"
    };

// Permit automatic access to PROD nodes for OnCall users
// OnCall IDC Group ID: 34688438-1061-702c-a03d-1fa788dccfd1
permit (principal in AWS::IdentityStore::Group::"34688438-1061-702c-a03d-1fa788dccfd1", 
      action == AWS::SSM::Action::"getTokenForInstanceAccess", 
      resource)
    when {
    resource.hasTag("Environment") && 
    resource.getTag("Environment") == "PROD"
    };
```

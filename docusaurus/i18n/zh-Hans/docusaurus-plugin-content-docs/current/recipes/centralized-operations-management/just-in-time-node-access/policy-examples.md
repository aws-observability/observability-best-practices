---
sidebar_position: 4
---

# JITNA Cedar 策略示例

本节包含使用 Systems Manager 即时节点访问 (JITNA) 时的策略示例集合。这些示例旨在帮助 AWS 客户了解如何实施 Cedar 策略来允许或禁止对即时节点会话请求的自动访问。

有关即时节点访问的架构的更多信息，请参见 [自动批准和拒绝访问策略的语句结构和内置运算符](https://docs.aws.amazon.com/systems-manager/latest/userguide/auto-approval-deny-access-policy-statement-structure.html)。在 [Cedar playground](https://www.cedarpolicy.com/en/playground) 中了解更多关于编写 Cedar 策略的信息。

请注意，这是示例代码，在任何生产环境中使用之前，应在开发环境中进行全面的测试和验证。

## 允许值班 IDC 组自动访问生产节点

以下示例允许自动访问：

* 任何身份访问开发节点，通过标签键值对 `Environment:DEV` 标识。
* AWS Identity Center (IDC) **OnCall** 组中的用户访问生产节点，通过标签键值对 `Environment:PROD` 标识。

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

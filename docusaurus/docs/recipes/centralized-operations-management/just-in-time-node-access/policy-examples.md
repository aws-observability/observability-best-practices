---
sidebar_position: 4
---

# JITNA Cedar policy examples

This section contains a collection of samples of policy examples when using Systems Manager just-in-time node access (JITNA). The samples are designed to educate AWS customers on how to implement Cedar policies to permit or forbid automatic access to just-in-time node session requests.

For more information on the schema for just-in-time node access, see [Statement structure and built-in operators for auto-approval and deny-access policies](https://docs.aws.amazon.com/systems-manager/latest/userguide/auto-approval-deny-access-policy-statement-structure.html). Learn more about authoring Cedar policies in the [Cedar playground](https://www.cedarpolicy.com/en/playground).

Please keep in mind that this is sample code and should be thoroughly tested and validated in a development environment prior to any usage in a production environment.

## Permit automatic access to production nodes for the on-call IDC group

The following example permits automatic access for:

* Any identity to development nodes, identified by the tag key-value pair `Environment:DEV`.
* Users in the AWS Identity Center (IDC) group **OnCall** to access production nodes, identified by the tag key-value pair `Environment:PROD`.

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

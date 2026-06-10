---
sidebar_position: 2
---
# Suivi de la configuration des ressources

AWS Config records and tracks the configuration of [supported AWS resources](https://docs.aws.amazon.com/config/latest/developerguide/resource-config-reference.html), creating an inventory of these resources in your AWS account along with their current and historical configurations. It also creates a timeline of configuration changes and maintains detailed information about resource attributes, relationships, and dependencies across your AWS infrastructure. Users can [view compliance history and timeline](https://docs.aws.amazon.com/config/latest/developerguide/view-manage-resource-console.html) either through the AWS Management Console or programmatically via AWS CLI, with the ability to query specific configuration states at any point in time.


![AWS Config Cost Visualization](/img/cloudops/guides/config/resourcetimeline.png)

### Ressources personnalisees AWS Config

 AWS Config allows you to extend its configuration tracking capabilities beyond supported AWS resources through [custom config resources.](https://docs.aws.amazon.com/config/latest/developerguide/customresources.html) This feature enables you to monitor non-supported AWS resources and track external resources such as on-premises servers, GitHub repositories, and other third-party resources. Once configured, you can publish third-party resource configuration data to AWS Config and view and monitor your complete resource inventory through the AWS Config console and APIs. Additionally, you can evaluate configuration compliance using AWS Config rules, conformance packs, best practices, internal policies, and regulatory requirements. 

Follow [this blog post](https://aws.amazon.com/blogs/mt/using-aws-config-custom-resources-to-track-any-resource-on-aws/) to learn how to monitor non-standard features using AWS Config. [This blog post](https://aws.amazon.com/blogs/mt/simplify-compliance-management-of-multicloud-or-hybrid-resources-with-aws-config/) provides walk-through on how to monitor resources hosted on other cloud providers.
---
sidebar_position: 5
---
# 应用程序运营

AWS 客户通常运营数百个应用程序，需要监控和管理各个资源，以确保其应用程序可用、安全、成本优化且性能最佳。应用程序对客户业务至关重要。它们是一组协同工作的资源，为最终用户提供特定功能或服务。在当今快速发展的数字化环境中，将 AWS 资源组织成定义明确的应用程序对于高效的云运营变得至关重要。这种以应用程序为中心的方法需要解决常见的挑战，如资源分散、运营效率低下以及跨多个 AWS 账户管理资源的复杂性。

AWS 提供了一套全面的服务，旨在支持以应用程序为中心的云运营策略，使您能够简化资源管理、提高可见性并增强整体运营效率。

应用程序运营是 AWS 中的一组能力，提供一种一致的方法来以更少的工作量和大规模地监控应用程序的成本、健康状况、安全态势和性能等 metrics。这些能力在多个 AWS 控制台中编织以应用程序为中心的视图。

![Application Operations](/img/cloudops/guides/app-ops/BP-App-ops-1.png "Application Operations")

在复杂的云环境中，管理应用程序对许多组织来说可能既具有挑战性又耗时。挑战不仅在于管理单个资源，还在于在应用程序生命周期的不同阶段执行应用程序任务。这种碎片化的方法使得难以识别哪些资源与特定应用程序相关联，导致关键事件期间的响应时间增加，以及访问相关运营数据的复杂性。

为了应对这些挑战，建立资源管理的坚实基础至关重要。这个基础从全面了解资源现状和实施以应用程序为中心的强大标记策略开始。通过这样做，组织可以在 AWS 中过渡到以应用程序为中心的视图。

这种方法使客户能够快速识别与特定应用程序相关的资源，了解其相互依赖关系，并在需要时采取适当的行动。它还通过提供更清晰的资源在每个应用程序上下文中使用情况的图景，简化了监控、故障排除和成本优化工作。

![Application Operations](/img/cloudops/guides/app-ops/BP-App-ops-2.png "Application Operations")


### **建立基础**

AWS 客户通常在单个账户中处理大量资源，缺乏对其应用程序的统一视图会显著阻碍高效行动和决策。为帮助客户在实现业务目标的同时扩展运营，资源管理服务提供了核心原语、概念和技术，用于有效地探索、组织和管理 AWS 资源。这些服务提供了基本构建块，客户可以利用它们按照业务目标大规模处理资源。此方法的基础包含以下组件：标记、标记策略、资源组和 Resources Explorer。

AWS Resource Explorer 聚合有关 AWS 资源的详细信息，并提供集中位置对其采取行动。您可以查看资源足迹的详细信息，评估治理情况（如有多少未标记的资源），并探索详细的资源元数据和资源的关系图。识别账户中的资源是了解资源现状的第一步。

标记是组织资源和简化资源管理的关键步骤。它允许客户高效跟踪各种资源。虽然许多组织已经使用标签来标识部门、环境和成本中心，但添加应用程序标签特别有价值。此标签有助于识别每个资源与哪个应用程序相关联，在单个资源和它们支持的应用程序之间提供清晰的链接。要实施应用程序标记，首先识别在每个应用程序中运行的所有资源。制定包含应用程序名称的一致标记策略，并在所有相关资源中系统地应用这些标签。

确保标记是您资源预配过程的一部分以保持一致性。例如，一个拥有数百个在 AWS 上运行的应用程序的零售客户。这意味着管理数千个 AWS 资源，如 Amazon EC2 实例、Amazon S3 存储桶、Amazon Relational Database Service (RDS) 数据库和 AWS Lambda 函数。这些资源可以属于各种应用程序，如库存管理、销售点系统（POS）、客户忠诚度计划和电子商务平台。


```json
Example for tagging schema for POS system and inventory manager can be as:
Application name ("pos-system", "inventory-manager")
Environment (e.g., "production", "development", "testing")
Business unit (e.g., "north-america", "europe", "e-commerce")
Cost center (e.g., "it-ops", "marketing", "sales")
```


通过应用此标记方案，作为零售客户，您可以在关键事件（如 Cyberweek 促销）期间查找并及时响应与 POS 系统相关的性能问题。因为您将能够从以应用程序为中心的视图中精确定位相关资源。

标记和资源组与客户如何概念化其环境协同工作。资源组允许您将 AWS 资源组织成反映应用程序、项目或工作负载的组件。这种方法提供了一种直观的方式来集体管理和监控资源。要有效使用资源组，请根据您的应用程序标签创建它们。在相应的组中包含每个应用程序的所有相关资源。然后可以将这些组用于集体管理任务，如监控、权限和成本跟踪。

继续我们的零售客户使用标记方案的示例，所有标记为 "Application: pos-system" 和 "Environment: production" 的资源被分组在一起。提供了对所有属于生产环境 POS 系统的 AWS 资源的单一视图。

### **定义应用程序**

在标签和资源组的基础上，在 AWS 中将应用程序定义为内聚单元可以实现真正以应用程序为中心的云运营方法。此步骤涉及创建正式的应用程序定义，涵盖所有相关资源及其相互依赖关系。要建立应用程序，请使用 AWS Service Catalog AppRegistry 等 AWS 服务来定义和管理应用程序。在应用程序定义中包含所有相关的资源组和单个资源，并定义应用程序的生命周期阶段和关联的管理流程。

在我们的零售客户示例中，将使用 AWS Service Catalog AppRegistry 来规范化应用程序定义，包括所有资源组和单个资源（如 Web 服务器、数据库和负载均衡器）。建立生命周期阶段（开发、暂存、生产）并关联管理流程。

通过使用这种方法，您可以为 AWS 中以应用程序为中心的资源管理创建坚实的基础。这种方法实现了高效运营、更好的应用程序健康和性能可见性，以及 IT 资源与业务目标之间更好的对齐。它为高级管理能力奠定了基础，如自动扩展、简化的灾难恢复和准确的成本分配。随着您逐步完成这些步骤，您会发现 AWS 环境变得更有组织、更易管理，并与您的业务需求保持一致，最终带来更高的运营效率和更好的资源利用率。构建以应用程序为中心的思维模型。

### **以应用程序为中心的视图**

应用程序运营需要一致的应用程序模型；[AWS Service Catalog AppRegistry](https://docs.aws.amazon.com/servicecatalog/latest/arguide/intro-app-registry.html) 存储应用程序元数据，[AWS Resource Groups](https://docs.aws.amazon.com/ARG/latest/userguide/resource-groups.html) 逻辑地分组应用程序资源，资源标记将应用程序的资源组织成可搜索的资源组。

当创建 AppRegistry 应用程序时，AppRegistry 使用提供的应用程序标签将 AWS 资源关联为资源组。标签键是 **awsApplication**，值是应用程序的唯一标识符。标签键和值都区分大小写。任何使用此键值对标记的 AWS 资源都会成为应用程序的一部分。此应用程序标签允许 AWS 服务通过在其控制台和 API 中引用该应用程序标签来支持应用程序运营。

通过使用这种方法，您可以为 AWS 中以应用程序为中心的资源管理创建坚实的基础。这种方法实现了高效运营、更好的应用程序健康和性能可见性，以及 IT 资源与业务目标之间更好的对齐。它为高级管理能力奠定了基础，如自动扩展、简化的灾难恢复和准确的成本分配。随着您逐步完成这些步骤，您会发现 AWS 环境变得更有组织、更易管理，并与您的业务需求保持一致，最终带来更高的运营效率和更好的资源利用率。构建以应用程序为中心的思维模型。

myApplications dashboard 使用应用程序标签为您选择的应用程序提供 metrics 的组合视图，包括来自多个 AWS 服务的成本和使用情况、安全和运营 metrics 及洞察。myApplications 支持使用现有标签自动添加资源。您可以使用现有标签自动添加资源，并在添加和删除资源上的选定标签时更新您的应用程序。

使用 myApplications dashboard，您可以深入到相关服务中对特定资源采取行动，例如 [Amazon CloudWatch](https://aws.amazon.com/cloudwatch) 用于应用程序性能，[AWS Cost Explorer](https://aws.amazon.com/aws-cost-management/aws-cost-explorer/) 用于成本和使用情况，以及 [AWS Security Hub](https://aws.amazon.com/security-hub/) 用于安全发现等。

#### **成本和使用情况小部件**

客户发现预测其应用程序资源的成本和优化成本具有挑战性。要了解您的应用程序资源成本，您可以一目了然地监控支出，并了解应用程序的当前和预测月度成本。您可以深入了解成本趋势，并点击采取行动来优化 AWS 上应用程序的成本。

成本和使用情况小部件可视化来自 AWS Cost Explorer 的 AWS 资源成本，包括应用程序当前和预测的月末成本、前五个计费服务以及月度应用程序资源成本趋势图。您可以监控支出，查找异常和节省机会。

使用 AWS Organizations 并在组织级别启用 AWS Cost Explorer 的客户无需在成员账户中显式启用它。根据客户的 FinOps 策略，Cost Explorer 可能已经启用；对于新客户或运营多个独立账户的客户，启用 Cost Explorer 是一般最佳实践，可以通过 Cost Explorer 控制台启用。这有助于最大化 myApplications 体验，提供一种了解应用程序花费的方式，而不是查看单个资源的支出。有关更多信息，请访问[启用 Cost Explorer](https://docs.aws.amazon.com/cost-management/latest/userguide/ce-enable.html)。

#### **DevOps 小部件**
随着企业越来越多地采用基于云的架构来支持其关键业务应用程序，对全面运营洞察的需求变得至关重要。这些应用程序通常依赖于复杂的分布式基础设施资源和服务集，使得 IT 团队难以维护对整个应用程序环境的整体健康和合规性的可见性和控制。

DevOps 小部件通过为您的应用程序提供关键运营洞察的集中视图来应对这一挑战。此小部件展示有关舰队管理、合规性和 OpsItems 管理的关键信息——使您的团队能够快速评估应用程序的整体运营态势，并采取必要的行动以确保合规性和可靠性。

通过监控此小部件中的数据，您可以获得有关应用程序基础设施运营健康的宝贵洞察，识别任何合规性偏差，并在影响用户之前主动加以解决。这有助于您的团队在管理 AWS 上关键业务应用程序的运营生命周期时更具响应性、效率和效果。

从 Systems Manager 提供的信息包括节点管理，Config 从资源级别评估已部署规则的合规状态。

节点管理信息识别实例是否由 Systems Manager 管理、[补丁策略](https://docs.aws.amazon.com/systems-manager/latest/userguide/patch-manager-create-a-patch-policy.html)的补丁合规状态，以及与资源相关联的任何 OpsItems 及其严重性级别。要让实例由 Systems Manager 管理，必须满足三个先决条件。首先，必须安装 SSM agent。其次，[SSM agent](https://docs.aws.amazon.com/systems-manager/latest/userguide/ssm-agent.html) 需要代表您在节点上执行操作的必要权限。您可以通过[快速设置](https://docs.aws.amazon.com/systems-manager/latest/userguide/systems-manager-quick-setup.html)的[主机管理](https://docs.aws.amazon.com/systems-manager/latest/userguide/quick-setup-host-management.html)或使用[默认主机管理 (DHMC)](https://docs.aws.amazon.com/systems-manager/latest/userguide/quick-setup-default-host-management-configuration.html) 或在部署资源时通过 IaC 添加必要的 IAM 角色和权限来完成此操作。最后，SSM agent 必须通过互联网或使用 [VPC endpoints](https://docs.aws.amazon.com/systems-manager/latest/userguide/setup-create-vpc.html) 具有到服务 endpoints 的网络连接。

Systems Manager [Patch Manager](https://docs.aws.amazon.com/systems-manager/latest/userguide/patch-manager-installing-patches.html) 使用补丁基线，允许您定义修补实例的某些标准。您还可以使用补丁策略在 AWS Organization 和区域之间扩展修补。您还将看到来自 [Systems Manager OpsCenter](https://docs.aws.amazon.com/systems-manager/latest/userguide/OpsCenter.html) 的运营数据。OpsCenter 创建与需要调查和修复的运营问题或中断相关联的 OpsItems。您可以创建与其他 AWS 服务集成的 OpsItems，例如 Amazon CloudWatch 中 EC2 实例可能达到其 CPU 利用率时，或为 Security Hub 发现创建 OpsItem。

另一个组件是围绕资源针对账户中部署的规则的合规状态收集的 Config 数据。首先，小部件呈现基于账户中有多少规则合规且没有不合规资源的规则合规状态的聚合百分比。其次，小部件提供应用程序资源的合规状态百分比，指示您的应用程序资源是否符合所选规则。

#### **安全小部件**

评估 AWS 资源安全发现的安全团队需要时间来拼凑了解业务关键性、确定下一步优先级和确定解决方案路径所需的应用程序上下文。为了改善应用程序的安全态势，您可以更快地获得基于 AWS 的应用程序安全态势的可见性。开发人员、安全团队和应用程序团队可以快速识别安全风险，并根据对他们的应用程序关键性确定问题优先级。

安全小部件显示来自 AWS Security Hub 的有关构成该应用程序的资源的信息。AWS Security Hub 是一项云安全态势管理 (CSPM) 服务，通过针对 AWS 资源进行自动化、持续的安全最佳实践检查来简化安全运营，帮助您识别配置错误。Security Hub 以标准化格式聚合安全告警（即发现），并对其进行优先级排序，以便您可以更轻松地丰富、调查和修复它们。

Security Hub 降低了管理和改善 AWS 账户、工作负载和资源安全性的复杂性和工作量。您可以在所有账户和区域中启用 Security Hub。

**计算小部件**

许多企业在 AWS 上运营大量复杂的分布式应用程序以支持其关键业务运营。这些应用程序依赖于各种计算资源（包括 EC2 实例和 Lambda 函数）来提供所需的性能和可扩展性。然而，如果没有跨所有这些应用程序的计算 metrics 和利用率的集中视图，IT 团队将极难有效监控其应用程序基础设施的健康和容量。

AWS 建议使用 AWS Compute Optimizer 来识别应用程序的资源调整优化机会。AWS Compute Optimizer 分析您运行中资源的规格（如 vCPU、内存或存储）以及过去 14 天（默认期间）到 93 天的 CloudWatch metrics。

myApplications dashboard 中的计算小部件通过为每个应用程序提供计算资源的综合、一目了然的视角来满足这一需求。此小部件显示有关您已配置的计算资源的关键信息和 metrics，例如告警总数、不同的计算资源类型以及性能趋势（如 EC2 实例 CPU 利用率和 Lambda 调用）。通过监控此小部件中的数据，您可以获得有关应用程序计算基础设施运营健康和容量的宝贵洞察。这使 IT 团队能够快速评估整体计算容量、识别性能瓶颈，并根据需要主动扩展资源，以确保其应用程序始终可用并以最高效率运行。

#### **监控和运营小部件**

监控和运营小部件显示与您应用程序关联的资源的告警和 canary 告警、应用程序服务级别指标 (SLI) 和 metrics，以及其他可用的 AWS CloudWatch Application Signals metrics。

告警是指探针、监控器的状态，或值超过或低于给定阈值的变化。创建告警时需要考虑几点：1/ 始终从目标向后工作（对可操作的事项进行告警），2/ 如果告警不需要通知您或触发自动化流程，则没有必要让它通知您。

[Amazon CloudWatch Application Signals](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-Application-Monitoring-Sections.html) 检测您在 AWS 上的应用程序，以便您可以监控应用程序的健康状况并根据业务目标跟踪性能，同时提供应用程序、服务和依赖项的视图，帮助您监控和分类应用程序健康状况。

CloudWatch Synthetics 监控（[canaries](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch_Synthetics_Canaries.html)）与 Application Signals 集成。Canaries 是一个强大的功能，允许您使用计划的合成行为监控 endpoints 和 API，这些行为遵循与应用程序最终用户相同的路线并执行相同的操作。它们使您能够持续评估客户体验，并在最终用户之前发现问题。

如果您是 Observability 新手或需要有关如何设置 metrics、告警或制定 Observability 策略的指导，[AWS Observability Best Practices](https://aws-observability.github.io/observability-best-practices/) 概述了如何开始了解 Observability 的不同组件以及哪些 metrics、告警等对监控有益。

*注意：对于运营基于容器的应用程序的客户，要能够标记集群、任务等，您需要手动标记这些资源，特别是非 EC2 资源。*

### 从战略到执行

1. 首先制定全面的标记策略，重点关注应用程序名称、环境、业务部门和成本中心。[构建标记策略](https://docs.aws.amazon.com/whitepapers/latest/tagging-best-practices/building-your-tagging-strategy.html)
2. 在所有相关资源中系统地应用这些标签，使其成为预配过程的一部分。使用 AWS Resource Groups 和 Tag Editor 允许您根据标签创建、管理和搜索资源。在账户级别提供集中方式来管理跨多个 AWS 服务的标签。[Resource Groups and Tagging for AWS](https://aws.amazon.com/blogs/aws/resource-groups-and-tagging/)
3. 根据这些标签创建资源组，例如将所有生产 POS 系统资源分组在一起。使用 AWS Service Catalog AppRegistry 正式定义应用程序，包括所有组件和相互依赖关系（如 POS 和库存管理系统）。[AWS Service Catalog AppRegistry 的关键概念](https://docs.aws.amazon.com/serviwecatalog/latest/arguide/overview-appreg.html#ar-user-tags)
4. 利用 myApplications dashboard 获得零售应用程序的统一视图，在关键事件（如 Cyber Week 促销）期间监控关键 metrics。您可以使用创建应用程序向导更轻松地创建应用程序，在控制台的一个视图中连接 AWS 账户中的资源。创建的应用程序将自动显示在 myApplications 中，您可以对应用程序采取行动。[myApplications in the AWS Management Console simplifies managing your application resources](https://aws.amazon.com/blogs/aws/new-myapplications-in-the-aws-management-console-simplifies-managing-your-application-resources/)

### **延伸阅读：**

* [Defining and publishing a tagging schema](https://docs.aws.amazon.com/whitepapers/latest/tagging-best-practices/defining-and-publishing-a-tagging-schema.html)
* [Best Practices for Tagging AWS Resources](https://docs.aws.amazon.com/whitepapers/latest/tagging-best-practices/tagging-best-practices.html)
* [Implementing automated and centralized tagging control](https://aws.amazon.com/blogs/mt/implementing-automated-and-centralized-tagging-controls-with-aws-config-and-aws-organizations/)


### 总结

随着客户业务在云中持续增长和演变，采用这些资源管理最佳实践至关重要。通过打好基础，组织不仅可以满足当前需求，还能为未来的增长和创新做好准备。AWS 应用程序运营和 myApplications 将这种方法更进一步，提供应用程序资源和 metrics 的综合视图。这使团队能够快速做出明智的决策，主动响应问题，并更有效地大规模管理资源。

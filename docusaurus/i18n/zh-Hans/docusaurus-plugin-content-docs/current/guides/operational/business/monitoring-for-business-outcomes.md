# 为什么应该做可观测性？

观看 YouTube 上的 [Developing an 可观测性 Strategy](https://www.youtube.com/watch?v=Ub3ATriFapQ)

## 真正重要的是什么？

您在工作中所做的一切都应与组织的使命保持一致。我们所有受雇的人都在为实现组织的使命和愿景而工作。在 Amazon，我们的使命是：

> Amazon strives to be Earth\'s most customer-centric company, Earth\'s best employer, and Earth\'s safest place to work.

— [About Amazon](https://www.aboutamazon.com/about-us)

在 IT 领域，每个项目、部署、安全措施或优化都应为业务成果服务。这看起来很明显，但您不应该做任何不为业务增加价值的事情。正如 ITIL 所说：

> Every change should deliver business value.

— ITIL Service Transition, AXELOS, 2011, page 44.  
— 参见 [Change Management in the Cloud AWS Whitepaper](https://docs.aws.amazon.com/whitepapers/latest/change-management-in-the-cloud/change-management-in-the-cloud.html)

使命和业务价值很重要，因为它们应该指导您所做的一切。可观测性有许多好处，包括：

- 更好的可用性
- 更高的可靠性
- 了解应用程序健康状况和性能
- 更好的协作
- 主动检测问题
- 提高客户满意度
- 缩短上市时间
- 降低运营成本
- 自动化

所有这些好处有一个共同点，它们都直接向客户或间接向组织交付业务价值。在考虑可观测性时，一切都应该回归到思考您的应用程序是否在交付业务价值。

这意味着可观测性应该衡量那些有助于交付业务价值的事物，关注业务成果以及当它们面临风险时：您应该考虑客户想要什么和需要什么。

## 从哪里开始？

既然您知道什么是重要的，就需要考虑需要衡量什么。在 Amazon，我们从客户开始，从他们的需求倒推：

> We are internally driven to improve our services, adding benefits and features, before we have to. We lower prices and increase value for customers before we have to. We invent before we have to.

— Jeff Bezos, [2012 Shareholder Letter](https://s2.q4cdn.com/299287126/files/doc_financials/annual/2012-Shareholder-Letter.pdf)

让我们以一个电子商务网站为例。首先，想想作为客户在网上购买产品时您想要什么，每个人可能不一样，但您可能关心以下事情：

- 配送
- 价格
- 安全性
- 页面速度
- 搜索（您能找到您要找的产品吗？）

一旦您知道客户关心什么，就可以开始衡量它们以及它们如何影响您的业务成果。页面速度直接影响您的转化率和搜索引擎排名。2017年的一项研究表明，超过一半（53%）的移动用户会在页面加载超过3秒时放弃。当然有许多研究表明页面速度的重要性，它是一个明显的衡量指标，但您需要衡量它并采取行动，因为它对转化有可衡量的影响，您可以使用这些数据来改进。

## 从客户倒推

您不可能知道客户关心的所有事情。如果您正在阅读本文，您可能处于技术岗位。您需要与组织中的利益相关者交谈，这并不总是容易的，但对于确保您衡量的是重要的事情至关重要。

让我们继续电子商务的例子。这次，考虑搜索：客户需要能够搜索产品才能购买它可能是显而易见的，但您是否知道根据 [Forrester Research 报告](https://www.forrester.com/report/MustHave+eCommerce+Features/-/E-RES89561)，43% 的访问者会立即导航到搜索框，而搜索者的转化率比非搜索者高2-3倍。搜索真的很重要，它必须运作良好，您需要监控它 - 也许您发现特定搜索没有产生任何结果，您需要从简单的模式匹配转向自然语言处理。这就是为业务成果进行监控然后采取行动改善客户体验的一个例子。

在 Amazon：

> We strive to deeply understand customers and work backwards from their pain points to rapidly develop innovations that create meaningful solutions in their lives.

— Daniel Slater - Worldwide Lead, Culture of Innovation, AWS in [Elements of Amazon\'s Day 1 Culture](https://aws.amazon.com/executive-insights/content/how-amazon-defines-and-operationalizes-a-day-1-culture/)

我们从客户开始，从他们的需求倒推。这不是商业成功的唯一方法，但它是可观测性的一个好方法。与利益相关者合作，了解什么对您的客户重要，然后从那里倒推。

作为额外的好处，如果您收集对客户和利益相关者重要的 metrics，您可以将这些可视化为近实时 dashboard，避免必须创建报告或回答诸如"加载登录页面需要多长时间？"或"运行网站的成本是多少？"之类的问题 - 利益相关者和高管应该能够自助获取这些信息。

这些是您的应用程序**真正重要**的高级 metrics，它们几乎总是存在问题的最佳指标。例如：一个告警表明在给定时间段内订单数量低于正常预期，这告诉您可能存在影响客户的问题；一个告警表明服务器上的卷几乎已满或某个特定服务有大量 5xx 错误，可能需要修复，但您仍然需要了解客户影响，然后相应地确定优先级 - 这可能需要时间。

当您衡量这些高级业务 metrics 时，影响客户的问题很容易识别。这些 metrics 是发生了**什么**。其他 metrics 和其他形式的可观测性（如 traces 和 logs）是**为什么**会发生这种情况，这将引导您找到可以做什么来修复或改善它。

## 观察什么

现在您了解了什么对客户重要，可以确定关键绩效指标（KPI）。这些是您的高级 metrics，将告诉您业务成果是否面临风险。您还需要从许多不同来源收集可能影响这些 KPI 的信息，这就是您需要开始考虑可能影响这些 KPI 的 metrics 的地方。如前所述，5xx 错误的数量不能表明影响，但它可能对您的 KPI 有影响。从将影响业务成果的事物倒推到可能影响业务成果的事物。

一旦您知道需要收集什么，就需要确定将为您提供可以用来衡量 KPI 和可能影响这些 KPI 的相关 metrics 的信息来源。这是您观察内容的基础。

这些数据可能来自 Metrics、Logs 和 Traces。一旦您拥有这些数据，就可以在成果面临风险时使用它来发出告警。

然后您可以评估影响并尝试纠正问题。几乎总是，这些数据会在孤立的技术 metrics（如 CPU 或内存）之前告诉您存在问题。

您可以被动地使用可观测性来修复影响业务成果的问题，也可以主动使用数据来做一些事情，比如改善客户的搜索体验。

## 结论

虽然 CPU、RAM、磁盘空间和其他技术 metrics 对于扩展、性能、容量和成本很重要，但它们并不能真正告诉您应用程序运行状况如何，也不能提供对客户体验的任何洞察。

您的客户是最重要的，您应该监控的是他们的体验。

这就是为什么您应该从客户的需求倒推，与利益相关者合作，建立真正重要的 KPI 和 metrics。

# Real User Monitoring

使用 CloudWatch RUM，您可以执行 real user monitoring，近实时地从实际用户会话中收集和查看有关 Web 应用程序性能的客户端数据。您可以可视化和分析的数据包括页面加载时间、客户端错误和用户行为。当您查看这些数据时，可以看到所有数据的汇总，也可以按客户使用的浏览器和设备进行细分。

![RUM 应用程序监控 dashboard 显示设备细分](../images/rum2.png)

## Web 客户端

CloudWatch RUM web 客户端使用 Node.js 16 或更高版本开发和构建。代码在 GitHub 上[公开可用](https://github.com/aws-observability/aws-rum-web)。您可以将该客户端与 [Angular](https://github.com/aws-observability/aws-rum-web/blob/main/docs/cdn_angular.md) 和 [React](https://github.com/aws-observability/aws-rum-web/blob/main/docs/cdn_react.md) 应用程序一起使用。

CloudWatch RUM 旨在不对应用程序的加载时间、性能和卸载时间产生可感知的影响。

:::note
    您为 CloudWatch RUM 收集的最终用户数据保留 30 天，然后自动删除。如果您希望保留 RUM 事件更长时间，可以选择让应用程序监控器将事件副本发送到您账户中的 CloudWatch Logs。
:::
:::tip
    如果避免广告拦截器的潜在中断对您的 Web 应用程序很重要，您可能希望在自己的内容分发网络上托管 web 客户端，甚至在自己的网站内部。我们在 [GitHub 上的文档](https://github.com/aws-observability/aws-rum-web/blob/main/docs/cdn_installation.md)提供了从您自己的源域托管 web 客户端的指导。
:::

## 授权您的应用程序

要使用 CloudWatch RUM，您的应用程序必须通过以下三个选项之一进行授权。

1. 使用您已设置的现有身份提供商的身份验证。
1. 使用现有的 Amazon Cognito 身份池
1. 让 CloudWatch RUM 为应用程序创建新的 Amazon Cognito 身份池

:::info
    让 CloudWatch RUM 为应用程序创建新的 Amazon Cognito 身份池需要的设置工作最少。这是默认选项。
:::
:::tip
    CloudWatch RUM 可以配置为将未经身份验证的用户与经过身份验证的用户分开。详情请参阅[此博客文章](https://aws.amazon.com/blogs/mt/how-to-isolate-signed-in-users-from-guest-users-within-amazon-cloudwatch-rum/)。
:::
## 数据保护与隐私

CloudWatch RUM 客户端可以使用 cookie 来帮助收集最终用户数据。这对用户旅程功能有用，但不是必需的。请参阅[我们关于隐私相关信息的详细文档](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-RUM-privacy.html)。[^1]

:::tip
    虽然使用 RUM 收集 Web 应用程序遥测数据是安全的，不会通过控制台或 CloudWatch Logs 向您暴露个人身份信息 (PII)，但请注意您可以通过 web 客户端收集[自定义属性](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-RUM-custom-metadata.html)。注意不要使用此机制暴露敏感数据。
:::

## 客户端代码片段

虽然 CloudWatch RUM web 客户端的代码片段会自动生成，但您也可以手动修改代码片段以根据您的要求配置客户端。
:::info
    使用 cookie 同意机制在单页应用程序中动态启用 cookie 创建。有关更多信息，请参阅[此博客文章](https://aws.amazon.com/blogs/mt/how-and-when-to-enable-session-cookies-with-amazon-cloudwatch-rum/)。
:::
### 禁用 URL 收集

防止收集可能包含个人信息的资源 URL。

:::info
    如果您的应用程序使用包含个人身份信息 (PII) 的 URL，我们强烈建议您在将代码片段插入应用程序之前，通过在代码片段配置中设置 `recordResourceUrl: false` 来禁用资源 URL 的收集。
:::

### 启用主动 Tracing

通过在 web 客户端中设置 `addXRayTraceIdHeader: true` 来启用端到端 tracing。这会导致 CloudWatch RUM web 客户端向 HTTP 请求添加 X-Ray trace 头。

如果您启用此可选设置，由应用程序监控器采样的用户会话期间发出的 XMLHttpRequest 和 fetch 请求将被追踪。然后您可以在 RUM dashboard、CloudWatch ServiceLens 控制台和 X-Ray 控制台中查看这些用户会话的 traces 和段。

在 AWS 控制台中设置应用程序监控器时，单击复选框以启用主动 tracing，代码片段中将自动启用该设置。

![RUM 应用程序监控器的主动 tracing 设置](../images/rum1.png)

### 插入代码片段

将您在上一节中复制或下载的代码片段插入应用程序的 `<head>` 元素内。在 `<body>` 元素或任何其他 `<script>` 标签之前插入。

:::info
    如果您的应用程序有多个页面，请将代码片段插入到所有页面中包含的共享头部组件中。
:::

:::warning
    web 客户端尽可能早地位于 `<head>` 元素中至关重要！与加载在页面 HTML 底部附近的被动 web 跟踪器不同，RUM 要捕获最多的性能数据需要在页面渲染过程的早期实例化。
:::
## 使用自定义元数据

您可以将自定义元数据添加到 CloudWatch RUM 事件的默认[事件元数据](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-RUM-datacollected.html#CloudWatch-RUM-datacollected-metadata)中。会话属性会添加到用户会话中的所有事件。页面属性仅添加到指定的页面。

:::info
    避免使用[此页面](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-RUM-custom-metadata.html#CloudWatch-RUM-custom-metadata-syntax)上注明的保留关键字作为自定义属性的键名
:::
## 使用页面组

:::info
    使用页面组将应用程序中的不同页面相互关联，以便您可以查看页面组的汇总分析。例如，您可能希望按类型和语言查看所有页面的汇总页面加载时间。

    ```
    awsRum.recordPageView({ pageId: '/home', pageTags: ['en', 'landing']})
    ```
:::
## 使用扩展 Metrics

CloudWatch RUM 自动收集一组[默认 metrics](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-RUM-metrics.html)，发布在名为 `AWS/RUM` 的 metric namespace 中。这些是 RUM 代表您创建的免费 [vended metrics](./metrics.md#vended-metrics)。

:::info
    将任何 CloudWatch RUM metrics 发送到 CloudWatch 并附加额外维度，以便 metrics 为您提供更细粒度的视图。
:::
扩展 metrics 支持以下维度：

- BrowserName
- CountryCode - ISO-3166 格式（两字母代码）
- DeviceType
- FileType
- OSName
- PageId

但是，您可以使用我们[此页面的指导](https://aws.amazon.com/blogs/mt/create-metrics-and-alarms-for-specific-web-pages-amazon-cloudwatch-rum/)创建自己的 metrics 和基于它们的告警。这种方法允许您监控任何数据点、URI 或其他您需要的组件的性能。

[^1]: 请参阅我们的[博客文章](https://aws.amazon.com/blogs/mt/how-and-when-to-enable-session-cookies-with-amazon-cloudwatch-rum/)，讨论使用 cookie 与 CloudWatch RUM 的注意事项。

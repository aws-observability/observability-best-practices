# Real User Monitoring

CloudWatch RUM を使用すると、リアルユーザーモニタリングを実行して、実際のユーザーセッションから Web アプリケーションのパフォーマンスに関するクライアント側のデータをほぼリアルタイムで収集および表示できます。視覚化および分析できるデータには、ページの読み込み時間、クライアント側のエラー、ユーザーの行動が含まれます。このデータを表示すると、すべてを集約して確認できるだけでなく、顧客が使用するブラウザやデバイスごとの内訳も確認できます。

![RUM application monitor dashboard showing device breakdown](../images/rum2.png)

## Web クライアント

CloudWatch RUM Web クライアントは、Node.js バージョン 16 以降を使用して開発およびビルドされています。コードは GitHub で[公開されています](https://github.com/aws-observability/aws-rum-web)。このクライアントは、[Angular](https://github.com/aws-observability/aws-rum-web/blob/main/docs/cdn_angular.md) および [React](https://github.com/aws-observability/aws-rum-web/blob/main/docs/cdn_react.md) アプリケーションで使用できます。

CloudWatch RUM は、アプリケーションの読み込み時間、パフォーマンス、およびアンロード時間に知覚可能な影響を与えないように設計されています。

:::note
    CloudWatch RUM 用に収集したエンドユーザーデータは 30 日間保持され、その後自動的に削除されます。RUM イベントをより長期間保持したい場合は、アプリケーションモニターがイベントのコピーをアカウント内の CloudWatch Logs に送信するように選択できます。
:::
:::tip
    広告ブロッカーによる潜在的な中断を回避することが Web アプリケーションにとって懸念事項である場合は、独自のコンテンツ配信ネットワーク、または独自の Web サイト内で Web クライアントをホストすることをお勧めします。[GitHub のドキュメント](https://github.com/aws-observability/aws-rum-web/blob/main/docs/cdn_installation.md)では、独自のオリジンドメインから Web クライアントをホストする方法についてのガイダンスを提供しています。
:::

## アプリケーションを認証する

CloudWatch RUM を使用するには、アプリケーションが 3 つのオプションのいずれかを通じて認証を受ける必要があります。

1. すでに設定済みの既存のアイデンティティプロバイダーからの認証を使用します。
1. 既存の Amazon Cognito アイデンティティプールを使用します。
1. CloudWatch RUM にアプリケーション用の新しい Amazon Cognito アイデンティティプールを作成させます。

:::info
    CloudWatch RUM でアプリケーション用の新しい Amazon Cognito アイデンティティプールを作成する方法は、セットアップに最も手間がかかりません。これがデフォルトのオプションです。
:::
:::tip
    CloudWatch RUM は、認証されていないユーザーと認証されたユーザーを分離するように設定できます。詳細については、[このブログ記事](https://aws.amazon.com/blogs/mt/how-to-isolate-signed-in-users-from-guest-users-within-amazon-cloudwatch-rum/)を参照してください。 
:::
## データ保護とプライバシー

CloudWatch RUM クライアントは、エンドユーザーデータの収集を支援するために Cookie を使用できます。これはユーザージャーニー機能に役立ちますが、必須ではありません。[プライバシー関連情報の詳細なドキュメント](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-RUM-privacy.html)を参照してください。[^1]

:::tip
    RUM を使用した Web アプリケーションテレメトリの収集は安全であり、コンソールや CloudWatch Logs を通じて個人を特定できる情報 (PII) が公開されることはありませんが、Web クライアントを通じて[カスタム属性](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-RUM-custom-metadata.html)を収集できることに注意してください。このメカニズムを使用して機密データを公開しないように注意してください。
:::

## クライアントコードスニペット

CloudWatch RUM ウェブクライアントのコードスニペットは自動的に生成されますが、要件に合わせてクライアントを設定するためにコードスニペットを手動で変更することもできます。 
:::info
    シングルページアプリケーションで Cookie の作成を動的に有効にするには、Cookie 同意メカニズムを使用します。詳細については、[このブログ記事](https://aws.amazon.com/blogs/mt/how-and-when-to-enable-session-cookies-with-amazon-cloudwatch-rum/)を参照してください。
:::
### URL 収集の無効化 

個人情報を含む可能性のあるリソース URL の収集を防止します。

:::info
    アプリケーションが個人を特定できる情報 (PII) を含む URL を使用している場合は、リソース URL の収集を無効にすることを強くお勧めします。次のように設定してください。 `recordResourceUrl: false` コードスニペット設定で、アプリケーションに挿入する前に行います。
:::

### アクティブトレーシングを有効にする

エンドツーエンドのトレースを有効にするには、次のように設定します。 `addXRayTraceIdHeader: true` Web クライアント内で実行します。これにより、CloudWatch RUM Web クライアントは HTTP リクエストに X-Ray トレースヘッダーを追加します。

このオプション設定を有効にすると、アプリケーションモニターによってサンプリングされたユーザーセッション中に行われた XMLHttpRequest および fetch リクエストがトレースされます。その後、RUM ダッシュボード、CloudWatch ServiceLens コンソール、および X-Ray コンソールで、これらのユーザーセッションからのトレースとセグメントを確認できます。

AWS コンソールでアプリケーションモニターを設定する際にチェックボックスをクリックしてアクティブトレースを有効にすると、コードスニペットで設定が自動的に有効になります。

![Active tracing setup for RUM application monitor](../images/rum1.png)

### スニペットの挿入

前のセクションでコピーまたはダウンロードしたコードスニペットを次の中に挿入します。 `<head>` アプリケーションの要素。その前に挿入します `<body>` 要素またはその他の `<script>` タグ。

:::info
    アプリケーションに複数のページがある場合は、すべてのページに含まれる共有ヘッダーコンポーネントにコードスニペットを挿入します。
:::

:::warning
    Web クライアントができるだけ早い段階で `<head>` 要素をできるだけ早く配置してください。ページの HTML の下部付近に読み込まれる受動的な Web トラッカーとは異なり、RUM が最も多くのパフォーマンスデータをキャプチャするには、ページのレンダリングプロセスの早い段階でインスタンス化する必要があります。
:::
## カスタムメタデータを使用する

CloudWatch RUM イベントのデフォルトの[イベントメタデータ](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-RUM-datacollected.html#CloudWatch-RUM-datacollected-metadata)にカスタムメタデータを追加できます。セッション属性は、ユーザーのセッション内のすべてのイベントに追加されます。ページ属性は、指定されたページにのみ追加されます。

:::info
    カスタム属性のキー名として、[このページ](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-RUM-custom-metadata.html#CloudWatch-RUM-custom-metadata-syntax)に記載されている予約キーワードの使用は避けてください。
:::
## ページグループを使用する

:::info
    ページグループを使用して、アプリケーション内の異なるページを相互に関連付けることで、ページのグループに対する集計分析を表示できます。たとえば、すべてのページのページ読み込み時間を、タイプと言語別に集計して表示できます。

    ```
    awsRum.recordPageView({ pageId: '/home', pageTags: ['en', 'landing']})
    ```
:::
## 拡張メトリクスを使用する

CloudWatch RUM によって自動的に収集される[デフォルトのメトリクスセット](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-RUM-metrics.html)があり、これらは次の名前のメトリクス名前空間に発行されます `AWS/RUM`これらは、RUM がユーザーに代わって作成する無料の[ベンダー提供メトリクス](../tools/metrics/#vended-メトリクス)です。

:::info
    CloudWatch RUM メトリクスのいずれかを追加のディメンションとともに CloudWatch に送信することで、メトリクスがより詳細なビューを提供します。
:::
拡張メトリクスでは、以下のディメンションがサポートされています。

- BrowserName
- CountryCode - ISO-3166 形式（2 文字コード）
- DeviceType
- FileType
- OSName
- PageId

ただし、[このページのガイダンス](https://aws.amazon.com/blogs/mt/create-metrics-and-alarms-for-specific-web-pages-amazon-cloudwatch-rum/)を使用して、独自のメトリクスとそれに基づくアラームを作成できます。このアプローチにより、必要な任意のデータポイント、URI、またはその他のコンポーネントのパフォーマンスを監視できます。

[^1]: See our [blog post](https://aws.amazon.com/blogs/mt/how-and-when-to-enable-session-cookies-with-amazon-cloudwatch-rum/) discussing the considerations when using cookies with CloudWatch RUM.
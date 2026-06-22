# リアルユーザーモニタリング

CloudWatch RUM を使用すると、リアルユーザーモニタリングを実行して、実際のユーザーセッションからほぼリアルタイムで Web アプリケーションのパフォーマンスに関するクライアントサイドデータを収集および表示できます。視覚化および分析できるデータには、ページの読み込み時間、クライアントサイドエラー、ユーザーの行動が含まれます。このデータを表示する際、すべてを集約した形で確認できるほか、お客様が使用するブラウザやデバイス別の内訳も確認できます。

![RUM application monitor dashboard showing device breakdown](../images/rum2.png)

## Web クライアント

CloudWatch RUM ウェブクライアントは、Node.js バージョン 16 以降を使用して開発およびビルドされています。コードは GitHub 上で[公開されています](https://github.com/aws-observability/aws-rum-web)。このクライアントは [Angular](https://github.com/aws-observability/aws-rum-web/blob/main/docs/cdn_angular.md) および [React](https://github.com/aws-observability/aws-rum-web/blob/main/docs/cdn_react.md) アプリケーションで使用できます。

CloudWatch RUM は、アプリケーションのロード時間、パフォーマンス、およびアンロード時間に知覚できる影響を与えないように設計されています。

:::note
    CloudWatch RUM 向けに収集したエンドユーザーデータは 30 日間保持された後、自動的に削除されます。RUM イベントをより長期間保持したい場合は、アカウントの CloudWatch Logs にイベントのコピーを送信するようにアプリモニターを設定することができます。
:::
:::tip
    Ad blocker による潜在的な中断を回避することが Web アプリケーションにとって懸念事項である場合は、Web クライアントを独自のコンテンツデリバリーネットワーク、または独自の Web サイト内でホストすることをお勧めします。[GitHub のドキュメント](https://github.com/aws-observability/aws-rum-web/blob/main/docs/cdn_installation.md)では、独自のオリジンドメインから Web クライアントをホストする方法についてのガイダンスを提供しています。
:::

## アプリケーションを認可する

CloudWatch RUM を使用するには、アプリケーションが 3 つのオプションのいずれかを通じて認可を受けている必要があります。

1. すでに設定済みの既存の ID プロバイダーからの認証を使用します。
1. 既存の Amazon Cognito ID プールを使用します。
1. CloudWatch RUM にアプリケーション用の新しい Amazon Cognito ID プールを作成させます。

:::info
    CloudWatch RUM が新しい Amazon Cognito アイデンティティプールをアプリケーション用に作成できるようにすることは、セットアップに最も手間がかかりません。これはデフォルトのオプションです。
:::
:::tip
    CloudWatch RUM は、未認証ユーザーと認証済みユーザーを分離するように設定できます。詳細については、[このブログ記事](https://aws.amazon.com/blogs/mt/how-to-isolate-signed-in-users-from-guest-users-within-amazon-cloudwatch-rum/)を参照してください。 
:::
## データ保護とプライバシー

CloudWatch RUM クライアントは、Cookie を使用してエンドユーザーデータの収集を支援できます。これはユーザージャーニー機能に役立ちますが、必須ではありません。[プライバシー関連情報の詳細なドキュメント](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-RUM-privacy.html)を参照してください。[^1]

:::tip
    RUM を使用した Web アプリケーションテレメトリの収集は安全であり、コンソールや CloudWatch Logs を通じて個人を特定できる情報 (PII) が公開されることはありませんが、Web クライアントを通じて[カスタム属性](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-RUM-custom-metadata.html)を収集できることに注意してください。このメカニズムを使用して機密データが公開されないよう注意してください。
:::

## クライアントコードスニペット

CloudWatch RUM ウェブクライアントのコードスニペットは自動的に生成されますが、クライアントを要件に合わせて設定するためにコードスニペットを手動で変更することもできます。 
:::info
    シングルページアプリケーションでクッキーの作成を動的に有効にするには、クッキー同意メカニズムを使用してください。詳細については、[このブログ投稿](https://aws.amazon.com/blogs/mt/how-and-when-to-enable-session-cookies-with-amazon-cloudwatch-rum/)を参照してください。
:::
### URL 収集の無効化 

個人情報が含まれる可能性のあるリソース URL の収集を防止します。

:::info
    アプリケーションが個人を特定できる情報 (PII) を含む URL を使用している場合は、アプリケーションに挿入する前に、コードスニペットの設定で `recordResourceUrl: false` を設定して、リソース URL の収集を無効にすることを強くお勧めします。
:::

### アクティブトレースを有効にする

ウェブクライアントで `addXRayTraceIdHeader: true` を設定して、エンドツーエンドのトレーシングを有効にします。これにより、CloudWatch RUM ウェブクライアントが HTTP リクエストに X-Ray トレースヘッダーを追加します。

このオプション設定を有効にすると、アプリモニターによってサンプリングされたユーザーセッション中に行われた XMLHttpRequest および fetch リクエストがトレースされます。これにより、RUM ダッシュボード、CloudWatch ServiceLens コンソール、および X-Ray コンソールで、これらのユーザーセッションのトレースとセグメントを確認できます。

AWS コンソールでアプリケーションモニターを設定する際に、チェックボックスをクリックしてアクティブトレースを有効にすると、コードスニペットで設定が自動的に有効になります。

![Active tracing setup for RUM application monitor](../images/rum1.png)

### スニペットの挿入

前のセクションでコピーまたはダウンロードしたコードスニペットを、アプリケーションの `<head>` 要素内に挿入します。`<body>` 要素やその他の `<script>` タグの前に挿入してください。

:::info
    アプリケーションに複数のページがある場合は、すべてのページに含まれる共有ヘッダーコンポーネントにコードスニペットを挿入してください。
:::

:::warning
    Web クライアントをできる限り `<head>` 要素の早い段階に配置することが重要です！ページの HTML の下部付近に読み込まれるパッシブな Web トラッカーとは異なり、RUM が最大限のパフォーマンスデータを取得するには、ページのレンダリングプロセスの早い段階でインスタンス化される必要があります。
:::
## カスタムメタデータの使用

CloudWatch RUM イベントのデフォルトの[イベントメタデータ](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-RUM-datacollected.html#CloudWatch-RUM-datacollected-metadata)にカスタムメタデータを追加できます。セッション属性は、ユーザーのセッション内のすべてのイベントに追加されます。ページ属性は、指定されたページにのみ追加されます。

:::info
    カスタム属性のキー名として、[このページ](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-RUM-custom-metadata.html#CloudWatch-RUM-custom-metadata-syntax)に記載されている予約済みキーワードの使用は避けてください。
:::
## ページグループを使用する

:::info
    ページグループを使用して、アプリケーション内のさまざまなページを相互に関連付けることで、ページグループの集計分析を確認できます。たとえば、タイプや言語別にすべてのページの集計ページロード時間を確認したい場合などに活用できます。

    ```
    awsRum.recordPageView({ pageId: '/home', pageTags: ['en', 'landing']})
    ```
:::
## 拡張メトリクスの使用

CloudWatch RUM によって自動的に収集され、`AWS/RUM` という名前のメトリクス名前空間に発行される[デフォルトのメトリクスセット](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-RUM-metrics.html)があります。これらは、RUM がユーザーに代わって作成する無料の[ベンダー提供メトリクス](./metrics.md#vended-metrics)です。

:::info
    CloudWatch RUM メトリクスを追加のディメンションと共に CloudWatch に送信することで、より詳細なビューを得ることができます。
:::
拡張メトリクスでサポートされているディメンションは以下のとおりです。

- BrowserName
- CountryCode - ISO-3166 形式（2 文字コード）
- DeviceType
- FileType
- OSName
- PageId

ただし、[このページのガイダンス](https://aws.amazon.com/blogs/mt/create-metrics-and-alarms-for-specific-web-pages-amazon-cloudwatch-rum/)を使用して、独自のメトリクスとアラームを作成することができます。このアプローチにより、必要なデータポイント、URI、またはその他のコンポーネントのパフォーマンスを監視できます。

[^1]: CloudWatch RUM で Cookie を使用する際の考慮事項について説明している、[ブログ記事](https://aws.amazon.com/blogs/mt/how-and-when-to-enable-session-cookies-with-amazon-cloudwatch-rum/)を参照してください。
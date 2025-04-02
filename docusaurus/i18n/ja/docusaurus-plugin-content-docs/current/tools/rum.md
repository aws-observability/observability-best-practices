# リアルユーザーモニタリング

CloudWatch RUM を使用すると、実際のユーザーセッションからウェブアプリケーションのパフォーマンスに関するクライアント側のデータをほぼリアルタイムで収集し、表示できます。
可視化および分析できるデータには、ページの読み込み時間、クライアント側のエラー、ユーザーの行動などが含まれます。
このデータを表示する際、すべてのデータを集約して表示できるだけでなく、お客様が使用しているブラウザやデバイスごとの内訳も確認できます。

![RUM アプリケーションモニターダッシュボードにデバイスの内訳を表示](../images/rum2.png)



## Web クライアント

CloudWatch RUM Web クライアントは、Node.js バージョン 16 以上を使用して開発およびビルドされています。コードは GitHub で[公開されています](https://github.com/aws-observability/aws-rum-web)。このクライアントは [Angular](https://github.com/aws-observability/aws-rum-web/blob/main/docs/cdn_angular.md) および [React](https://github.com/aws-observability/aws-rum-web/blob/main/docs/cdn_react.md) アプリケーションで使用できます。

CloudWatch RUM は、アプリケーションの読み込み時間、パフォーマンス、アンロード時間に認識できる影響を与えないように設計されています。

:::note
    CloudWatch RUM で収集したエンドユーザーデータは 30 日間保持された後、自動的に削除されます。RUM イベントをより長期間保持したい場合は、アプリモニターがイベントのコピーをアカウントの CloudWatch Logs に送信するように設定できます。
:::
:::tip
    Web アプリケーションで広告ブロッカーによる潜在的な中断を避けたい場合は、Web クライアントを独自のコンテンツ配信ネットワークまたは Web サイト内でホストすることをお勧めします。[GitHub のドキュメント](https://github.com/aws-observability/aws-rum-web/blob/main/docs/cdn_installation.md)では、独自のオリジンドメインから Web クライアントをホストするためのガイダンスを提供しています。
:::



## アプリケーションの認証

CloudWatch RUM を使用するには、アプリケーションは以下の 3 つのオプションのいずれかで認証を行う必要があります。

1. すでにセットアップされている既存の ID プロバイダーからの認証を使用する
1. 既存の Amazon Cognito ID プールを使用する
1. CloudWatch RUM にアプリケーション用の新しい Amazon Cognito ID プールを作成させる

:::info
    CloudWatch RUM にアプリケーション用の新しい Amazon Cognito ID プールを作成させる方法が、セットアップに最も手間がかかりません。これがデフォルトのオプションです。
:::
:::tip
    CloudWatch RUM は、未認証ユーザーと認証済みユーザーを分離するように設定できます。詳細については、[このブログ記事](https://aws.amazon.com/blogs/mt/how-to-isolate-signed-in-users-from-guest-users-within-amazon-cloudwatch-rum/) を参照してください。
:::



## データ保護とプライバシー

CloudWatch RUM クライアントは、エンドユーザーデータの収集を支援するためにクッキーを使用できます。これはユーザージャーニー機能に役立ちますが、必須ではありません。[プライバシー関連情報の詳細なドキュメント](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/CloudWatch-RUM-privacy.html) をご覧ください。[^1]

:::tip
RUM を使用した Web アプリケーションのテレメトリ収集は安全で、コンソールや CloudWatch Logs を通じて個人を特定できる情報 (PII) が公開されることはありません。ただし、Web クライアントを通じて[カスタム属性](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/CloudWatch-RUM-custom-metadata.html)を収集できることに注意してください。このメカニズムを使用して機密データを公開しないよう注意してください。
:::



## クライアントコードスニペット

CloudWatch RUM Web クライアントのコードスニペットは自動的に生成されますが、要件に合わせてクライアントを設定するために手動でコードスニペットを変更することもできます。

:::info
シングルページアプリケーションでクッキーの作成を動的に有効にするには、クッキー同意メカニズムを使用してください。詳細については、[このブログ記事](https://aws.amazon.com/blogs/mt/how-and-when-to-enable-session-cookies-with-amazon-cloudwatch-rum/) を参照してください。
:::



### URL 収集の無効化

個人情報を含む可能性のあるリソース URL の収集を防止します。

:::info
アプリケーションで個人を特定できる情報 (PII) を含む URL を使用している場合は、アプリケーションにコードスニペットを挿入する前に、コードスニペット設定で `recordResourceUrl: false` を設定して、リソース URL の収集を無効にすることを強くおすすめします。
:::




### アクティブトレースの有効化

Web クライアントで `addXRayTraceIdHeader: true` を設定することで、エンドツーエンドのトレースを有効にします。これにより、CloudWatch RUM Web クライアントは HTTP リクエストに X-Ray トレースヘッダーを追加します。

このオプション設定を有効にすると、アプリケーションモニターによってサンプリングされたユーザーセッション中の XMLHttpRequest および fetch リクエストがトレースされます。これらのユーザーセッションのトレースとセグメントを、RUM ダッシュボード、CloudWatch ServiceLens コンソール、X-Ray コンソールで確認できます。

AWS コンソールでアプリケーションモニターを設定する際に、アクティブトレースを有効にするチェックボックスをクリックすると、コードスニペットで自動的に設定が有効になります。

![Active tracing setup for RUM application monitor](../images/rum1.png)



### スニペットの挿入

前のセクションでコピーまたはダウンロードしたコードスニペットを、アプリケーションの `<head>` 要素内に挿入します。`<body>` 要素や他の `<script>` タグの前に挿入してください。

:::info
アプリケーションに複数のページがある場合は、すべてのページに含まれる共有ヘッダーコンポーネントにコードスニペットを挿入してください。
:::

:::warning
Web クライアントを `<head>` 要素内のできるだけ早い位置に配置することが重要です！パッシブな Web トラッカーが HTML の下部付近に読み込まれるのとは異なり、RUM が最大限のパフォーマンスデータを収集するためには、ページのレンダリングプロセスの早い段階でインスタンス化される必要があります。
:::



## カスタムメタデータの使用

CloudWatch RUM イベントのデフォルトの[イベントメタデータ](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/CloudWatch-RUM-datacollected.html)にカスタムメタデータを追加できます。
セッション属性は、ユーザーのセッション内のすべてのイベントに追加されます。
ページ属性は、指定されたページにのみ追加されます。

:::info
    カスタム属性のキー名には、[このページ](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/CloudWatch-RUM-custom-metadata.html)に記載されている予約済みキーワードを使用しないようにしてください。
:::



## ページグループの使用

:::info
    ページグループを使用して、アプリケーション内の異なるページを相互に関連付けることで、ページグループの集計分析を確認できます。たとえば、タイプと言語別にすべてのページの集計されたページ読み込み時間を確認したい場合があります。

    ```
    awsRum.recordPageView({ pageId: '/home', pageTags: ['en', 'landing']})
    ```
:::



## 拡張メトリクスの使用

CloudWatch RUM によって自動的に収集される[デフォルトのメトリクス](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/CloudWatch-RUM-metrics.html)のセットがあり、これらは `AWS/RUM` という名前の名前空間で公開されます。
これらは、RUM がユーザーに代わって作成する無料の[ベンダーメトリクス](../tools/metrics/#vended-metrics)です。

:::info
    CloudWatch RUM メトリクスを追加のディメンションと共に CloudWatch に送信することで、より詳細なメトリクスの表示が可能になります。
:::
拡張メトリクスでは、以下のディメンションがサポートされています：

- BrowserName
- CountryCode - ISO-3166 フォーマット (2 文字コード)
- DeviceType
- FileType
- OSName
- PageId

ただし、[このページのガイダンス](https://aws.amazon.com/blogs/mt/create-metrics-and-alarms-for-specific-web-pages-amazon-cloudwatch-rum/)を使用して、独自のメトリクスとアラームを作成することができます。
このアプローチにより、必要なデータポイント、URI、その他のコンポーネントのパフォーマンスを監視することができます。

[^1]: CloudWatch RUM でクッキーを使用する際の考慮事項については、[ブログ投稿](https://aws.amazon.com/blogs/mt/how-and-when-to-enable-session-cookies-with-amazon-cloudwatch-rum/)を参照してください。

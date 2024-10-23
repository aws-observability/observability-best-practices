# リアルユーザーモニタリング

CloudWatch RUM を使用すると、リアルユーザーモニタリングを実行して、実際のユーザーセッションからウェブアプリケーションのパフォーマンスに関するクライアント側のデータをほぼリアルタイムで収集し、表示することができます。可視化および分析できるデータには、ページの読み込み時間、クライアント側のエラー、ユーザーの行動などが含まれます。このデータを表示する際、すべてを集約して見ることができ、さらにお客様が使用しているブラウザやデバイスごとの内訳も確認できます。

![デバイスの内訳を示す RUM アプリケーションモニターダッシュボード](../images/rum2.png)



## Web クライアント

CloudWatch RUM Web クライアントは、Node.js バージョン 16 以上を使用して開発およびビルドされています。コードは GitHub で[公開されています](https://github.com/aws-observability/aws-rum-web)。このクライアントは [Angular](https://github.com/aws-observability/aws-rum-web/blob/main/docs/cdn_angular.md) および [React](https://github.com/aws-observability/aws-rum-web/blob/main/docs/cdn_react.md) アプリケーションで使用できます。

CloudWatch RUM は、アプリケーションの読み込み時間、パフォーマンス、およびアンロード時間に認識できる影響を与えないように設計されています。

:::note
    CloudWatch RUM 用に収集するエンドユーザーデータは 30 日間保持され、その後自動的に削除されます。RUM イベントをより長期間保存したい場合は、アプリモニターがイベントのコピーをアカウントの CloudWatch Logs に送信するように選択できます。
:::
:::tip
    Web アプリケーションで広告ブロッカーによる潜在的な中断を避けたい場合は、Web クライアントを独自のコンテンツデリバリーネットワークでホストするか、自身の Web サイト内でホストすることをお勧めします。[GitHub のドキュメント](https://github.com/aws-observability/aws-rum-web/blob/main/docs/cdn_installation.md)では、独自のオリジンドメインから Web クライアントをホストするためのガイダンスを提供しています。
:::



## アプリケーションの認証

CloudWatch RUM を使用するには、アプリケーションが以下の 3 つのオプションのいずれかを通じて認証を行う必要があります。

1. すでにセットアップ済みの既存の ID プロバイダーからの認証を使用する
2. 既存の Amazon Cognito ID プールを使用する
3. CloudWatch RUM にアプリケーション用の新しい Amazon Cognito ID プールを作成させる

:::info
    CloudWatch RUM にアプリケーション用の新しい Amazon Cognito ID プールを作成させるオプションが、セットアップに最も労力がかかりません。これがデフォルトのオプションです。
:::
:::tip
    CloudWatch RUM は、未認証ユーザーと認証済みユーザーを分離するように設定できます。詳細については、[このブログ記事](https://aws.amazon.com/blogs/mt/how-to-isolate-signed-in-users-from-guest-users-within-amazon-cloudwatch-rum/) をご覧ください。
:::



## データ保護とプライバシー

CloudWatch RUM クライアントは、エンドユーザーデータの収集を支援するためにクッキーを使用することができます。これはユーザージャーニー機能に役立ちますが、必須ではありません。プライバシー関連の情報については、[詳細なドキュメント](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/CloudWatch-RUM-privacy.html)をご覧ください。[^1]

:::tip
    RUM を使用した Web アプリケーションのテレメトリ収集は安全であり、コンソールや CloudWatch Logs を通じて個人を特定できる情報 (PII) が露出することはありませんが、Web クライアントを通じて[カスタム属性](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/CloudWatch-RUM-custom-metadata.html)を収集できることに注意してください。このメカニズムを使用して機密データを露出させないよう注意してください。
:::



## クライアントコードスニペット

CloudWatch RUM Web クライアントのコードスニペットは自動生成されますが、要件に合わせてクライアントを設定するために手動でコードスニペットを変更することもできます。

:::info
シングルページアプリケーションでクッキーの作成を動的に有効にするには、クッキー同意メカニズムを使用してください。詳細については、[このブログ記事](https://aws.amazon.com/blogs/mt/how-and-when-to-enable-session-cookies-with-amazon-cloudwatch-rum/) を参照してください。
:::



### URL 収集の無効化

個人情報を含む可能性のあるリソース URL の収集を防止します。

:::info
    アプリケーションで個人を特定できる情報（PII）を含む URL を使用している場合、コードスニペットの設定で `recordResourceUrl: false` を設定して、アプリケーションに挿入する前にリソース URL の収集を無効にすることを強くおすすめします。
:::



### アクティブトレースの有効化

Web クライアントで `addXRayTraceIdHeader: true` を設定することで、エンドツーエンドのトレースを有効にします。これにより、CloudWatch RUM Web クライアントは HTTP リクエストに X-Ray トレースヘッダーを追加します。

この任意の設定を有効にすると、アプリケーションモニターによってサンプリングされたユーザーセッション中に行われた XMLHttpRequest および fetch リクエストがトレースされます。これにより、RUM ダッシュボード、CloudWatch ServiceLens コンソール、および X-Ray コンソールでこれらのユーザーセッションのトレースとセグメントを確認できます。

AWS コンソールでアプリケーションモニターをセットアップする際に、チェックボックスをクリックしてアクティブトレースを有効にすると、コードスニペットで自動的に設定が有効になります。

![RUM アプリケーションモニターのアクティブトレース設定](../images/rum1.png)



### スニペットの挿入

前のセクションでコピーまたはダウンロードしたコードスニペットを、アプリケーションの `<head>` 要素内に挿入します。`<body>` 要素や他の `<script>` タグの前に挿入してください。

:::info
アプリケーションに複数のページがある場合は、すべてのページに含まれる共有ヘッダーコンポーネントにコードスニペットを挿入してください。
:::

:::warning
Web クライアントを `<head>` 要素の可能な限り早い位置に配置することが非常に重要です！ページの HTML の下部付近に読み込まれる受動的な Web トラッカーとは異なり、RUM が最大限のパフォーマンスデータを取得するには、ページのレンダリングプロセスの早い段階でインスタンス化する必要があります。
:::



## カスタムメタデータの使用

CloudWatch RUM イベントのデフォルトの[イベントメタデータ](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/CloudWatch-RUM-datacollected.html)にカスタムメタデータを追加できます。セッション属性は、ユーザーのセッション内のすべてのイベントに追加されます。ページ属性は、指定されたページにのみ追加されます。

:::info
    カスタム属性のキー名には、[このページ](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/CloudWatch-RUM-custom-metadata.html)に記載されている予約キーワードを使用しないようにしてください
:::



## ページグループの使用

:::info
    ページグループを使用して、アプリケーション内の異なるページを相互に関連付けることで、ページグループの集計された分析情報を確認できます。例えば、タイプや言語別にすべてのページの集計されたページ読み込み時間を確認したい場合があります。

    ```
    awsRum.recordPageView({ pageId: '/home', pageTags: ['en', 'landing']})
    ```
:::



## 拡張メトリクスの使用

CloudWatch RUM によって自動的に収集される[デフォルトのメトリクスセット](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/CloudWatch-RUM-metrics.html)があり、これらは `AWS/RUM` という名前の名前空間で公開されます。これらは無料の[ベンダーメトリクス](../tools/metrics/#vended-metrics)で、RUM がユーザーに代わって作成します。

:::info
    CloudWatch RUM メトリクスを追加のディメンションと共に CloudWatch に送信することで、より詳細なビューを得ることができます。
:::
拡張メトリクスでは、以下のディメンションがサポートされています：

- BrowserName
- CountryCode - ISO-3166 フォーマット（2 文字コード）
- DeviceType
- FileType
- OSName
- PageId

ただし、[このページのガイダンス](https://aws.amazon.com/blogs/mt/create-metrics-and-alarms-for-specific-web-pages-amazon-cloudwatch-rum/)を使用して、独自のメトリクスとアラームを作成することもできます。このアプローチにより、必要な任意のデータポイント、URI、またはその他のコンポーネントのパフォーマンスを監視できます。

[^1]: CloudWatch RUM でクッキーを使用する際の考慮事項については、[ブログ投稿](https://aws.amazon.com/blogs/mt/how-and-when-to-enable-session-cookies-with-amazon-cloudwatch-rum/)をご覧ください。

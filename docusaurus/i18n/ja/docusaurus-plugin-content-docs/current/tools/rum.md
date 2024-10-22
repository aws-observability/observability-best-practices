# リアルユーザーモニタリング

CloudWatch RUM を使用すると、リアルユーザーモニタリングを実行して、実際のユーザーセッションからのウェブアプリケーションのパフォーマンスに関するクライアント側のデータをほぼリアルタイムで収集および表示できます。可視化および分析できるデータには、ページロード時間、クライアント側のエラー、ユーザーの動作が含まれます。このデータを表示すると、すべてが集約されて表示されるだけでなく、お客様が使用しているブラウザやデバイスごとの内訳も表示できます。

## Web クライアント

CloudWatch RUM の Web クライアントは、Node.js バージョン 16 以降を使用して開発およびビルドされています。コードは GitHub で [公開](https://github.com/aws-observability/aws-rum-web) されています。このクライアントを [Angular](https://github.com/aws-observability/aws-rum-web/blob/main/docs/cdn_angular.md) および [React](https://github.com/aws-observability/aws-rum-web/blob/main/docs/cdn_react.md) アプリケーションで使用できます。

CloudWatch RUM は、アプリケーションの読み込み時間、パフォーマンス、アンロード時間に影響を与えないように設計されています。

note
    CloudWatch RUM で収集したエンドユーザーデータは 30 日間保持された後、自動的に削除されます。RUM イベントをより長期間保持したい場合は、アプリケーションモニターからイベントのコピーを自分のアカウントの CloudWatch Logs に送信するよう選択できます。

tip
    Web アプリケーションで広告ブロッカーによる中断の可能性を回避することが懸念される場合は、Web クライアントを独自のコンテンツ配信ネットワークまたは Web サイト内にホストすることをお勧めします。GitHub の [ドキュメント](https://github.com/aws-observability/aws-rum-web/blob/main/docs/cdn_installation.md) では、独自のオリジンドメインから Web クライアントをホストする手順を説明しています。


## アプリケーションを認証する

CloudWatch RUM を使用するには、アプリケーションを次の 3 つのオプションのいずれかで認証する必要があります。

1. 既に設定済みの ID プロバイダーから認証を使用する
2. 既存の Amazon Cognito ID プールを使用する
3. CloudWatch RUM に新しい Amazon Cognito ID プールをアプリケーション用に作成させる

info
CloudWatch RUM に新しい Amazon Cognito ID プールをアプリケーション用に作成させるのが、最も設定が簡単です。これがデフォルトのオプションです。

tip
CloudWatch RUM は、認証されていないユーザーと認証されたユーザーを分離するように設定できます。詳細については、[このブログ記事](https://aws.amazon.com/blogs/mt/how-to-isolate-signed-in-users-from-guest-users-within-amazon-cloudwatch-rum/)を参照してください。


## データ保護とプライバシー

CloudWatch RUM クライアントは、エンドユーザーデータの収集を支援するためにクッキーを使用できます。これはユーザージャーニー機能に役立ちますが、必須ではありません。プライバシー関連の情報については、[詳細なドキュメント](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/CloudWatch-RUM-privacy.html)を参照してください。[^1]

tip
    RUM を使用したウェブアプリケーションのテレメトリ収集は安全であり、個人を特定できる情報 (PII) がコンソールや CloudWatch Logs に公開されることはありません。ただし、ウェブクライアントを通じて[カスタム属性](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/CloudWatch-RUM-custom-metadata.html)を収集できることに注意してください。このメカニズムを使用して機密データを公開しないよう注意してください。


## クライアントコードスニペット

CloudWatch RUM Web クライアントのコードスニペットは自動生成されますが、要件に応じてコードスニペットを手動で変更することもできます。
info
    シングルページアプリケーションでは、Cookie 同意メカニズムを使用して動的に Cookie の作成を有効にしてください。詳細については、[このブログ記事](https://aws.amazon.com/blogs/mt/how-and-when-to-enable-session-cookies-with-amazon-cloudwatch-rum/)を参照してください。


### URL 収集を無効にする

個人情報が含まれる可能性のあるリソース URL の収集を防ぎます。

info
アプリケーションが個人を特定できる情報 (PII) を含む URL を使用している場合は、コードスニペットの構成で `recordResourceUrl: false` を設定し、アプリケーションに挿入する前に、リソース URL の収集を無効にすることを強くお勧めします。


### アクティブトレーシングを有効化する

Web クライアントで `addXRayTraceIdHeader: true` を設定することで、エンドツーエンドのトレーシングを有効にします。これにより、CloudWatch RUM Web クライアントが HTTP リクエストに X-Ray トレースヘッダーを追加します。

このオプション設定を有効にすると、アプリケーションモニターによってサンプリングされたユーザーセッション中に行われた XMLHttpRequest と fetch リクエストがトレースされます。その後、これらのユーザーセッションのトレースとセグメントを RUM ダッシュボード、CloudWatch ServiceLens コンソール、X-Ray コンソールで確認できます。

AWS コンソールでアプリケーションモニターを設定する際にチェックボックスをオンにすると、コードスニペットでこの設定が自動的に有効になります。

![RUM アプリケーションモニターのアクティブトレーシング設定](../images/rum1.png)

### スニペットの挿入

前のセクションでコピーまたはダウンロードしたコードスニペットを、アプリケーションの `<head>` 要素内に挿入します。`<body>` 要素やその他の `<script></script></body></head>

## カスタムメタデータを使用する

CloudWatch RUM イベントのデフォルトの [イベントメタデータ](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/CloudWatch-RUM-datacollected.html) にカスタムメタデータを追加できます。セッション属性は、ユーザーのセッション内のすべてのイベントに追加されます。ページ属性は、指定したページにのみ追加されます。

alert{type="info"}
    [このページ](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/CloudWatch-RUM-custom-metadata.html) で予約語として記載されているキーワードは、カスタム属性のキー名として使用しないでください。


## ページグループを使用する

info
アプリケーション内の異なるページを関連付けるためにページグループを使用し、ページグループの集約された分析を確認できるようにします。たとえば、タイプと言語別にすべてのページの集約されたページロード時間を確認したい場合があります。

```
    awsRum.recordPageView({ pageId: '/home', pageTags: ['en', 'landing']})
    ```


## 拡張メトリクスを使用する

CloudWatch RUM によって自動的に収集される[デフォルトのメトリクスセット](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/CloudWatch-RUM-metrics.html)があり、`AWS/RUM` という名前空間で公開されています。これらは RUM が代わりに作成する無料の[ベンダーメトリクス](../tools/metrics/#vended-metrics)です。

info
    追加のディメンションを使用して、CloudWatch RUM のメトリクスを CloudWatch に送信すると、より詳細なビューが得られます。

拡張メトリクスでサポートされているディメンションは次のとおりです。

- BrowserName
- CountryCode - ISO-3166 形式 (2 文字のコード)
- DeviceType
- FileType
- OSName
- PageId

ただし、[このページのガイダンス](https://aws.amazon.com/blogs/mt/create-metrics-and-alarms-for-specific-web-pages-amazon-cloudwatch-rum/)に従って、独自のメトリクスとアラームを作成することができます。このアプローチを使用すると、必要なデータポイント、URI、その他のコンポーネントのパフォーマンスを監視できます。

[^1]: CloudWatch RUM でクッキーを使用する際の考慮事項については、[ブログ記事](https://aws.amazon.com/blogs/mt/how-and-when-to-enable-session-cookies-with-amazon-cloudwatch-rum/)を参照してください。

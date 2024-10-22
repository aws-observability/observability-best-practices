# AWS X-Ray - FAQ

1. **AWS Distro for Open Telemetry (ADOT) は、Event Bridge や SQS などの AWS サービス間でトレースの伝搬をサポートしていますか?**
    技術的には、それは ADOT ではなく AWS X-Ray です。スパンを伝搬または生成する AWS サービスの数と種類を拡大する作業を行っています。この機能に依存するユースケースがある場合は、お問い合わせください。
2. **2023 年後半に、ADOT を使用して W3C トレースヘッダーを使って AWS X-Ray にスパンを取り込めるようになりますか?**
    はい、2023 年後半にはそうなる予定です。W3C トレースコンテキストの伝搬をサポートする作業を行っています。
3. SQS が関与する場合、Lambda 関数間のリクエストをトレースできますか?
    はい。X-Ray は、SQS が関与する場合でも Lambda 関数間のトレースをサポートするようになりました。アップストリームのメッセージプロデューサーからのトレースは、ダウンストリームの Lambda コンシューマーノードからのトレースに[自動的にリンク](https://docs.aws.amazon.com/ja_jp/xray/latest/devguide/xray-services-sqs.html)され、アプリケーション全体の視点が得られます。
4. **アプリケーションのインストルメンテーションに X-Ray SDK か OTel SDK を使うべきですか?**
    OTel には X-Ray SDK よりも多くの機能がありますが、どちらを使うべきかは[ADOT と X-Ray SDK の選択](https://docs.aws.amazon.com/ja_jp/xray/latest/devguide/xray-instrumenting-your-app.html)を参照してください。
5. **[スパンイベント](https://opentelemetry.io/docs/instrumentation/ruby/manual/#add-span-events)は AWS X-Ray でサポートされていますか?**
    スパンイベントは X-Ray モデルに適合しないため、破棄されます。
6. **AWS X-Ray からデータを抽出するにはどうすればよいですか?**
    [X-Ray API を使用して](https://docs.aws.amazon.com/ja_jp/xray/latest/devguide/xray-api-gettingdata.html)、サービスグラフ、トレース、ルートコース分析データを取得できます。
7. **100% のサンプリングを実現できますか? つまり、サンプリングを一切行わずにすべてのトレースを記録したいのです。**
    サンプリングルールを調整することで、大量のトレースデータをキャプチャできます。[ここに記載されているサービスクォータ制限](https://docs.aws.amazon.com/ja_jp/general/latest/gr/xray.html)を超えない限り、X-Ray は設定どおりにデータを収集しようと努力します。ただし、100% のトレースデータキャプチャが保証されるわけではありません。
8. **API を通じてサンプリングルールを動的に増減できますか?**
    はい、[X-Ray サンプリング API](https://docs.aws.amazon.com/ja_jp/xray/latest/devguide/xray-api-sampling.html) を使用して、必要に応じて動的に調整できます。[このブログ](https://aws.amazon.com/blogs/mt/dynamically-adjusting-x-ray-sampling-rules/)にユースケースベースの説明があります。
9. **製品 FAQ**
[https://aws.amazon.com/jp/xray/faqs/](.)

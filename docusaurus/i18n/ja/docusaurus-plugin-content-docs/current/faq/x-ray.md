# AWS X-Ray - よくある質問

1. **AWS Distro for Open Telemetry (ADOT) は、EventBridge や SQS などの AWS サービス間でトレースの伝播をサポートしていますか？**
    技術的には、それは ADOT ではなく AWS X-Ray です。私たちは、スパンを伝播および/または生成する AWS サービスの数と種類を拡大する作業を進めています。これに依存するユースケースがある場合は、ぜひお問い合わせください。

2. **ADOT を使用して W3C トレースヘッダーで AWS X-Ray にスパンを取り込むことはできますか？**
    はい、2023 年後半に可能になります。W3C トレースコンテキストの伝播をサポートする作業を進めています。

3. **SQS が中間に介在する場合、Lambda 関数間でリクエストをトレースできますか？**
    はい。X-Ray は現在、SQS が中間に介在する場合でも Lambda 関数間のトレースをサポートしています。上流のメッセージ生成者からのトレースは、下流の Lambda 消費者ノードからのトレースに[自動的にリンク](https://docs.aws.amazon.com/ja_jp/xray/latest/devguide/xray-services-sqs.html)され、アプリケーションのエンドツーエンドのビューを作成します。

4. **アプリケーションの計測には X-Ray SDK と OTel SDK のどちらを使用すべきですか？**
    OTel は X-Ray SDK よりも多くの機能を提供しますが、どちらがユースケースに適しているかを選択するには、[ADOT と X-Ray SDK の選択](https://docs.aws.amazon.com/ja_jp/xray/latest/devguide/xray-instrumenting-your-app.html)をご覧ください。

5. **AWS X-Ray では[スパンイベント](https://opentelemetry.io/docs/instrumentation/ruby/manual/#add-span-events)はサポートされていますか？**
    スパンイベントは X-Ray モデルに適合しないため、破棄されます。

6. **AWS X-Ray からデータを抽出するにはどうすればよいですか？**
    [X-Ray API を使用して](https://docs.aws.amazon.com/ja_jp/xray/latest/devguide/xray-api-gettingdata.html)、サービスグラフ、トレース、根本原因分析データを取得できます。

7. **100% サンプリングを実現できますか？つまり、サンプリングを全く行わずにすべてのトレースを記録したいのですが。**
    サンプリングルールを調整して、トレースデータの取得量を大幅に増やすことができます。送信されるセグメントの総数が[ここに記載されているサービスクォータ制限](https://docs.aws.amazon.com/ja_jp/general/latest/gr/xray.html)を超えない限り、X-Ray は設定通りにデータを収集するよう努めます。ただし、これにより 100% のトレースデータ取得が保証されるわけではありません。

8. **API を通じてサンプリングルールを動的に増減できますか？**
    はい、[X-Ray サンプリング API](https://docs.aws.amazon.com/ja_jp/xray/latest/devguide/xray-api-sampling.html) を使用して、必要に応じて動的に調整できます。ユースケースに基づく説明については、[このブログ](https://aws.amazon.com/blogs/mt/dynamically-adjusting-x-ray-sampling-rules/)をご覧ください。

9. **製品 FAQ**
    [https://aws.amazon.com/jp/xray/faqs/](.)

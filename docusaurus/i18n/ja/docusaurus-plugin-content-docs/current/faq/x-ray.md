# AWS X-Ray - FAQ

1. **AWS Distro for OpenTelemetry(ADOT) は、EventBridge や SQS などの AWS サービス間でのトレースのプロパゲーションをサポートしていますか?**
    技術的には、それは ADOT ではなく AWS X-Ray です。プロパゲーションを行ったり、スパンを生成したりする AWS サービスの数と種類を拡大する作業を行っています。これに依存するユースケースがある場合は、ご連絡ください。

2. **2023年後半に、ADOT を使用して W3C トレースヘッダーを利用してスパンを AWS X-Ray にインジェストすることができますか?**
    はい、できます。W3C トレースコンテキストのプロパゲーションのサポートに取り組んでいます。

3. SQS が中間にある場合、Lambda 関数間のリクエストをトレースできますか?
    はい。SQS が中間にある場合でも、Lambda 関数間のトレースをサポートするようになりました。上流のメッセージプロデューサーからのトレースは、下流の Lambda コンシューマーノードからのトレースと[自動的にリンクされ](https://docs.aws.amazon.com/ja_jp/xray/latest/devguide/xray-services-sqs.html)、アプリケーションのエンドツーエンドのビューが作成されます。

4. **アプリケーションのインスツルメンテーションには X-Ray SDK と OTel SDK のどちらを使用するべきですか?**
    OTel は X-Ray SDK よりも多くの機能を提供しますが、ユースケースに適したものを選択するには、 [ADOT と X-Ray SDK の選択](https://docs.aws.amazon.com/ja_jp/xray/latest/devguide/xray-instrumenting-your-app.html#xray-instrumenting-choosing) を参照してください。

5. **[スパンイベント](https://opentelemetry.io/docs/instrumentation/ruby/manual/#add-span-events) は AWS X-Ray でサポートされていますか?**
スパンイベントは X-Ray モデルに適合しないため、ドロップされます。

6. **AWS X-Ray からデータを抽出するにはどうすればよいですか?**
[X-Ray API を使用して](https://docs.aws.amazon.com/ja_jp/xray/latest/devguide/xray-api-gettingdata.html)、サービスグラフ、トレース、ルートコーズ分析データを取得できます。

7. **サンプリングなしで、すべてのトレースを記録する 100% サンプリングを実現できますか。**
サンプリングルールを調整して、大幅に増加した量のトレースデータをキャプチャできます。送信されるセグメントの総数が、[ここで言及されているサービスクォータ制限](https://docs.aws.amazon.com/ja_jp/general/latest/gr/xray.html#limits_xray) を超えなければ、X-Ray は設定されたとおりにデータを収集する努力をします。その結果として 100% のトレースデータのキャプチャが保証されるわけではありません。

8. **サンプリングルールを動的に増減できますか?**
はい、必要に応じて[X-Ray サンプリング API](https://docs.aws.amazon.com/ja_jp/xray/latest/devguide/xray-api-sampling.html) を使用して動的に調整できます。ユースケースベースの説明については、この[ブログ](https://aws.amazon.com/blogs/mt/dynamically-adjusting-x-ray-sampling-rules/) を参照してください。 

9. **製品 FAQ**
[https://aws.amazon.com/xray/faqs/](.)

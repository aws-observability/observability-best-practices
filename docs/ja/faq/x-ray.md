# AWS X-Ray - FAQ

1. **EventBridge や SQS などの AWS サービス間でトレースの伝播を ADOT はサポートしていますか?**
    技術的には、それは ADOT ではなく AWS X-Ray です。スパンを伝播および/または生成する AWS サービスの数と種類を拡大することに取り組んでいます。これに依存するユースケースがある場合は、お問い合わせください。
1. **2023年後半にW3Cトレースヘッダを使用して、ADOTを使用してAWS X-Rayにスパンを取り込むことができますか?**
    はい、2023年後半にできるようになります。W3Cトレースコンテキストの伝播をサポートする作業を行っています。
1. SQS が途中に関与している場合、Lambda 関数間でリクエストをトレースできますか?
    はい。X-Ray は現在、SQS が途中に関与している場合の Lambda 関数間のトレースをサポートしています。上流のメッセージプロデューサーからのトレースは、下流の Lambda コンシューマーノードからのトレースと[自動的にリンクされ](https://docs.aws.amazon.com/xray/latest/devguide/xray-services-sqs.html)、アプリケーションのエンドツーエンドのビューが作成されます。
1. **アプリケーションの計装に X-Ray SDK と OTel SDK のどちらを使用するべきですか?**
    OTel は X-Ray SDK よりも機能が豊富ですが、ユースケースに適したものを選択するには、 [ADOT と X-Ray SDK の比較](https://docs.aws.amazon.com/xray/latest/devguide/xray-instrumenting-your-app.html#xray-instrumenting-choosing) を参照してください。
1. **[スパンイベント](https://opentelemetry.io/docs/instrumentation/ruby/manual/#add-span-events) は AWS X-Ray でサポートされていますか?**
    スパンイベントは X-Ray モデルに適合せず、ドロップされます。  
1. **AWS X-Ray からデータを抽出するにはどうすればよいですか?**
    [X-Ray API を使用して](https://docs.aws.amazon.com/xray/latest/devguide/xray-api-gettingdata.html)、サービスグラフ、トレース、ルート原因分析データを取得できます。
1. **サンプリングなしで、すべてのトレースを記録する 100% サンプリングを実現できますか?**
    サンプリングルールを調整して、大幅に増加した量のトレースデータをキャプチャできます。送信されるセグメントの合計が[ここで述べられているサービスクォータ制限](https://docs.aws.amazon.com/general/latest/gr/xray.html#limits_xray)を超えない限り、X-Ray は設定されたとおりにデータを収集する努力をします。ただし、これが必ずしも 100% のトレースデータのキャプチャにつながるとは限りません。  
1. **サンプリングルールを動的に増減できますか?**
    はい、必要に応じて[X-Ray サンプリング API](https://docs.aws.amazon.com/xray/latest/devguide/xray-api-sampling.html) を使用して動的に調整できます。ユースケースベースの説明については、この[ブログ](https://aws.amazon.com/blogs/mt/dynamically-adjusting-x-ray-sampling-rules/)を参照してください。
1. **製品に関する FAQ**  
 [https://aws.amazon.com/xray/faqs/]()

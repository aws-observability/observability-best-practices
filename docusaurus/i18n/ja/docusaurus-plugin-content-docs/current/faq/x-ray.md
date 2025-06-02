# AWS X-Ray - よくある質問




## AWS Distro for Open Telemetry (ADOT) は、EventBridge や SQS などの AWS サービス間でトレースの伝播をサポートしていますか？

技術的には、これは ADOT ではなく AWS X-Ray の機能です。私たちは、スパンを伝播および生成する AWS サービスの数と種類の拡大に取り組んでいます。このユースケースに依存する場合は、お気軽にお問い合わせください。




## ADOT を使用して W3C トレースヘッダーで AWS X-Ray にスパンを取り込むことはできますか？

はい。[W3c トレースヘッダー](https://aws.amazon.com/jp/about-aws/whats-new/2023/10/aws-x-ray-w3c-format-trace-ids-distributed-tracing/) は 2023 年 10 月 27 日にリリースされました。




## SQS が中継する Lambda 関数間でリクエストをトレースできますか？

はい。X-Ray は SQS が中継する Lambda 関数間のトレースをサポートしています。上流のメッセージ生成者からのトレースは、下流の Lambda 使用者ノードからのトレースと[自動的にリンク](https://docs.aws.amazon.com/ja_jp/xray/latest/devguide/xray-services-sqs.html)され、アプリケーションのエンドツーエンドのビューを作成します。




## アプリケーションの計装に X-Ray SDK と OTel SDK のどちらを使用すべきですか？

OTel は X-Ray SDK よりも多くの機能を提供しますが、ユースケースに適したものを選択するには、[ADOT と X-Ray SDK の選択](https://docs.aws.amazon.com/ja_jp/xray/latest/devguide/xray-instrumenting-your-app.html) を参照してください。




## [span イベント](https://opentelemetry.io/docs/instrumentation/ruby/manual/#add-span-events) は AWS X-Ray でサポートされていますか？

span イベントは X-Ray モデルに適合しないため、破棄されます。




## AWS X-Ray からデータを抽出するにはどうすればよいですか？

[X-Ray API を使用して](https://docs.aws.amazon.com/ja_jp/xray/latest/devguide/xray-api-gettingdata.html)、サービスグラフ、トレース、根本原因分析のデータを取得できます。




## 100% のサンプリングは可能ですか？つまり、サンプリングなしですべてのトレースを記録したいのですが。

サンプリングルールを調整することで、トレースデータの収集量を大幅に増やすことができます。送信されるセグメントの総数が [ここで説明されているサービスクォータの制限](https://docs.aws.amazon.com/ja_jp/general/latest/gr/xray.html) を超えない限り、X-Ray は設定通りにデータを収集するよう努めます。ただし、これによって 100% のトレースデータが確実に収集されるという保証はありません。



## サンプリングルールを API を使用して動的に増減できますか？

はい、[X-Ray サンプリング API](https://docs.aws.amazon.com/ja_jp/xray/latest/devguide/xray-api-sampling.html) を使用して、必要に応じて動的に調整できます。ユースケースに基づく説明については、[このブログ](https://aws.amazon.com/blogs/mt/dynamically-adjusting-x-ray-sampling-rules/)をご覧ください。

**製品 FAQ:** [https://aws.amazon.com/jp/xray/faqs/](https://aws.amazon.com/jp/xray/faqs/)

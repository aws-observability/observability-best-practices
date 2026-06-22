# AWS X-Ray - FAQ

## AWS Distro for Open Telemetry (ADOT) は、Event Bridge や SQS などの AWS サービス間でのトレース伝播をサポートしていますか?

技術的には、これは ADOT ではなく AWS X-Ray です。スパンを伝播および/または生成する AWS サービスの数と種類を拡大する取り組みを進めています。これに依存するユースケースがある場合は、お問い合わせください。

## W3C トレースヘッダーを使用して ADOT 経由で AWS X-Ray にスパンを取り込むことはできますか?

はい。[W3c トレースヘッダー](https://aws.amazon.com/about-aws/whats-new/2023/10/aws-x-ray-w3c-format-trace-ids-distributed-tracing/)は 2023 年 10 月 27 日にリリースされました。

## SQS が中間に関与している場合、Lambda 関数間でリクエストをトレースできますか？

はい。X-Ray は、SQS が中間に関与する場合の Lambda 関数間のトレースをサポートするようになりました。アップストリームメッセージプロデューサーからのトレースは、ダウンストリーム Lambda コンシューマーノードからのトレースに[自動的にリンクされ](https://docs.aws.amazon.com/xray/latest/devguide/xray-services-sqs.html)、アプリケーションのエンドツーエンドのビューが作成されます。

## アプリケーションをインストルメント化するには、X-Ray SDK と OTel SDK のどちらを使用すべきですか？

OTel は X-Ray SDK よりも多くの機能を提供しますが、ユースケースに適したものを選択するには、[ADOT と X-Ray SDK のどちらを選択するか](https://docs.aws.amazon.com/xray/latest/devguide/xray-instrumenting-your-app.html#xray-instrumenting-choosing)を参照してください。

##  [スパンイベント](https://opentelemetry.io/docs/instrumentation/ruby/manual/#add-span-events)は AWS X-Ray でサポートされていますか?

スパンイベントは X-Ray モデルに適合しないため、ドロップされます。

## AWS X-Ray からデータを抽出するにはどうすればよいですか?

[X-Ray API を使用](https://docs.aws.amazon.com/xray/latest/devguide/xray-api-gettingdata.html)して、サービスグラフ、トレース、根本原因分析データを取得できます。

## 100% のサンプリングを実現できますか？つまり、サンプリングなしですべてのトレースを記録したいのですが。

サンプリングルールを調整して、大幅に増加したトレースデータ量をキャプチャできます。送信される総セグメント数が[ここに記載されているサービスクォータ制限](https://docs.aws.amazon.com/general/latest/gr/xray.html#limits_xray)に違反しない限り、X-Ray は設定に従ってデータを収集するよう努めます。ただし、この結果として 100% のトレースデータキャプチャが保証されるわけではありません。

## API を通じてサンプリングルールを動的に増減できますか?

はい、[X-Ray サンプリング API](https://docs.aws.amazon.com/xray/latest/devguide/xray-api-sampling.html) を使用して、必要に応じて動的に調整できます。ユースケースに基づく説明については、この[ブログ](https://aws.amazon.com/blogs/mt/dynamically-adjusting-x-ray-sampling-rules/)を参照してください。

**製品 FAQ:** [https://aws.amazon.com/xray/faqs/](https://aws.amazon.com/xray/faqs/)


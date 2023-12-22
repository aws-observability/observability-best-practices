# トレーシングエージェントの選択

## 正しいエージェントを選択する

AWS は、[トレース](../../signals/traces/) 収集のために 2 つのツールセットを直接サポートしています(さらに、豊富な[オブザーバビリティ パートナー](https://aws.amazon.com/products/management-and-governance/partners/)もあります)。

* [AWS Distro for OpenTelemetry](https://aws-otel.github.io/) (一般的に ADOT と呼ばれる)
* X-Ray の [SDK](https://docs.aws.amazon.com/xray/latest/devguide/xray-instrumenting-your-app.html) と [デーモン](https://docs.aws.amazon.com/xray/latest/devguide/xray-daemon.html)

どのツールまたはツールを使用するかの選択は、オブザーバビリティ ソリューションを進化させるにつれて行わなければならない主要な決定です。これらのツールは相互に排他的ではなく、必要に応じて一緒に混在させることができます。そして、この選択を行うためのベスト プラクティスがあります。ただし、まずは [OpenTelemetry (OTEL)](https://opentelemetry.io/) の現状を理解する必要があります。

OTEL は、現在の業界標準のオブザーバビリティ シグナリングの仕様であり、3 つのコア シグナル型([メトリクス](../../signals/metrics/)、[トレース](../../signals/traces/)、[ログ](../../signals/logs))のそれぞれの定義が含まれています。ただし、OTEL は常に存在したわけではなく、[OpenMetrics](https://openmetrics.io) や [OpenTracing](https://opentracing.io) などの以前の仕様から進化してきました。オブザーバビリティ ベンダーは、最近年になって OpenTelemetry Line Protocol (OTLP) を公開サポートし始めました。

AWS X-Ray と CloudWatch は OTEL 仕様に先行しており、他の主要なオブザーバビリティ ソリューションも同様です。ただし、AWS X-Ray サービスは、ADOT を使用した OTEL トレースを容易に受け入れます。ADOT には、X-Ray や他の ISV ソリューションに直接テレメトリをエミットするための統合がすでに組み込まれています。

トランザクション トレーシング ソリューションには、シグナルを収集するためにエージェントと基盤アプリケーションへの統合が必要です。これにより、テスト、メンテナンス、アップグレードを行う必要があるライブラリの形での [テクニカル ・デット](../../faq/#what-is-technical-debt) が発生し、将来的にソリューションの変更を選択した場合は再構築が必要になる可能性があります。 

X-Ray に含まれる SDK は、AWS が提供する緊密に統合されたインスツルメンテーション ソリューションの一部です。ADOT は、X-Ray がトレース ソリューションのひとつに過ぎない、より広範な業界ソリューションの一部です。X-Ray を使用したエンドツーエンドのトレーシングは、どちらのアプローチでも実装できますが、最も有用なアプローチを決定するためには違いを理解することが重要です。

!!! success
	次の機能が必要な場合は、アプリケーションに AWS Distro for OpenTelemetry をインスツルメンテーションすることをお勧めします。

    * コードを再度インスツルメンテーションすることなく、複数の異なるトレース バックエンドにトレースを送信できる機能。たとえば、X-Ray コンソールの使用から [Zipkin](https://zipkin.io) への移行を希望する場合、コレクターの構成のみが変更され、アプリケーション コードは変更されません。

    * OpenTelemetry コミュニティによってメンテナンスされている、各言語の多数のライブラリ インスツルメンテーションのサポート。

!!! success
	アプリケーションへのインスツルメンテーションに X-Ray SDK を選択する必要がある場合は、次の機能が必要です。

    * 緊密に統合されたシングル ベンダー ソリューション。

    * Node.js、Python、Ruby、.NET を使用している場合、X-Ray コンソールからサンプリング ルールを構成し、複数のホストで自動的に使用する機能を含む、X-Ray 集中サンプリング ルールとの統合。

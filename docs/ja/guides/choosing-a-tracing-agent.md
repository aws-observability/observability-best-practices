# トレーシングエージェントの選択

## 正しいエージェントの選択

AWS は直接、[トレース](../../signals/traces/) 収集のための 2 つのツールセット(さらにたくさんの[オブザーバビリティパートナー](https://aws.amazon.com/products/management-and-governance/partners/) もあります)をサポートしています。

* [AWS Distro for OpenTelemetry](https://aws-otel.github.io/)。一般的に ADOT と呼ばれます
* X-Ray の [SDK](https://docs.aws.amazon.com/xray/latest/devguide/xray-instrumenting-your-app.html) と [デーモン](https://docs.aws.amazon.com/xray/latest/devguide/xray-daemon.html)

使用するツールまたはツールの選択は、オブザーバビリティソリューションを進化させるにつれて行う主要な決定事項です。これらのツールは相互に排他的ではなく、必要に応じて混在させることができます。この選択を行うためのベストプラクティスがあります。しかし、まず [OpenTelemetry (OTEL)](https://opentelemetry.io/) の現状を理解する必要があります。 

OTEL は現在、業界標準のオブザーバビリティシグナリングの仕様であり、3 つのコアシグナルタイプのそれぞれの定義、[メトリクス](../../signals/metrics/)、[トレース](../../signals/traces/)、[ログ](../../signals/logs)が含まれています。ただし、OTEL は常に存在していたわけではなく、[OpenMetrics](https://openmetrics.io) や [OpenTracing](https://opentracing.io) などの以前の仕様から進化してきました。オブザーバビリティベンダーは、最近数年間で OpenTelemetry Line Protocol (OTLP) を公開サポートし始めました。

AWS X-Ray や CloudWatch は OTEL 仕様よりも前に存在しており、他の主要なオブザーバビリティソリューションも同様です。ただし、AWS X-Ray サービスは、ADOT を使用した OTEL トレースを簡単に受け入れます。ADOT には X-Ray や他の ISV ソリューションに直接テレメトリを送信するための統合がすでに組み込まれています。

トランザクショントレースソリューションには、シグナルを収集するためにエージェントとアプリケーションへの統合が必要です。これにより、テスト、メンテナンス、アップグレードが必要なライブラリの形での[技術的負債](../../faq/#what-is-technical-debt)が発生し、将来ソリューションを変更する場合に再構築が必要になる可能性があります。

X-Ray に含まれる SDK は、AWS が提供する緊密に統合されたインスツルメンテーションソリューションの一部です。ADOT は、X-Ray が多数のトレースソリューションのひとつにすぎない、より広範な業界ソリューションの一部です。X-Ray を使用したエンドツーエンドのトレースは、どちらのアプローチでも実装できますが、最も有用なアプローチを決定するためには違いを理解することが重要です。

!!! success
	アプリケーションを次の場合は AWS Distro for OpenTelemetry でインスツルメンテーションすることをお勧めします。

    * コードを再度インスツルメンテーションすることなく、複数の異なるトレースバックエンドにトレースを送信できる必要がある場合。 たとえば、X-Ray コンソールの使用から [Zipkin](https://zipkin.io) への移行の場合、コレクターの構成のみが変更され、アプリケーションコードは変更されません。

    * OpenTelemetry コミュニティによってメンテナンスされている、各言語の多数のライブラリインスツルメンテーションのサポート。

!!! success
	アプリケーションへのインスツルメンテーションに X-Ray SDK を選択することをお勧めする場合

    * 緊密に統合されたシングルベンダーソリューションが必要な場合。

    * Node.js、Python、Ruby、.NET を使用している場合、X-Ray コンソールから集中サンプリングルールを構成し、複数のホストで自動的に使用する機能を含む、X-Ray との統合。

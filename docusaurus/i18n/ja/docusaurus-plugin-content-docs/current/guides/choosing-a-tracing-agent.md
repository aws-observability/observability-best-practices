# トレーシングエージェントの選択

## 適切なエージェントを選択する

AWS は、[トレース](../signals/traces/)収集のために直接 2 つのツールセットをサポートしています (加えて、[オブザーバビリティパートナー](https://aws.amazon.com/jp/products/management-and-governance/partners/)も豊富にあります)。

* [AWS Distro for OpenTelemetry](https://aws-otel.github.io/) (一般に ADOT と呼ばれる)
* X-Ray [SDK](https://docs.aws.amazon.com/ja_jp/xray/latest/devguide/xray-instrumenting-your-app.html) と [デーモン](https://docs.aws.amazon.com/ja_jp/xray/latest/devguide/xray-daemon.html)

どのツールを使用するかの選択は、オブザーバビリティソリューションを進化させる上で行わなければならない主要な決定事項です。これらのツールは相互に排他的ではなく、必要に応じて組み合わせて使用できます。また、この選択には優れた実践があります。しかし、まず [OpenTelemetry (OTEL)](https://opentelemetry.io/) の現状を理解する必要があります。

OTEL は、オブザーバビリティシグナルの業界標準仕様であり、[メトリクス](../signals/metrics/)、[トレース](../signals/traces/)、[ログ](../signals/logs/)の 3 つの中核シグナルタイプの定義が含まれています。しかし、OTEL は常に存在していたわけではなく、[OpenMetrics](https://openmetrics.io) や [OpenTracing](https://opentracing.io) などの以前の仕様から進化してきました。オブザーバビリティベンダーは最近になって OpenTelemetry Line Protocol (OTLP) をオープンにサポートし始めました。

AWS X-Ray と CloudWatch は OTEL 仕様よりも前から存在しており、他の主要なオブザーバビリティソリューションも同様です。しかし、AWS X-Ray サービスは ADOT を使って OTEL トレースを容易に受け入れることができます。ADOT には、X-Ray に直接テレメトリを送信したり、他の ISV ソリューションに送信したりするための統合機能が組み込まれています。

トランザクショントレーシングソリューションには、シグナルを収集するためにエージェントとアプリケーションへの統合が必要です。そして、これによって、テスト、メンテナンス、アップグレードが必要なライブラリの形で[技術的負債](../faq/#what-is-technical-debt)が発生します。また、将来ソリューションを変更することになれば、再ツーリングが必要になる可能性があります。

X-Ray に含まれる SDK は、AWS が提供する密に統合されたインストルメンテーションソリューションの一部です。一方、ADOT は、X-Ray がトレーシングソリューションの 1 つにすぎない、より広範な業界ソリューションの一部です。どちらのアプローチでも X-Ray でエンドツーエンドのトレーシングを実装できますが、最も有用なアプローチを決定するには違いを理解することが重要です。

info
以下の場合は、アプリケーションに AWS Distro for OpenTelemetry を導入することをお勧めします。

* コードを再インストルメンテーションすることなく、複数の異なるトレーシングバックエンドにトレースを送信できる必要がある場合。例えば、X-Ray コンソールの使用から [Zipkin](https://zipkin.io) に移行したい場合、アプリケーションコードは変更せずにコレクターの設定のみを変更します。

* OpenTelemetry コミュニティによって維持されている、各言語の多数のライブラリインストルメンテーションをサポートする必要がある場合。


info
以下の場合は、アプリケーションのインストルメンテーションに X-Ray SDK を選択することをお勧めします。

* 単一ベンダーによる密に統合されたソリューションが必要な場合。

* X-Ray の集中サンプリングルールとの統合が必要な場合。これには、Node.js、Python、Ruby、または .NET を使用する際に、X-Ray コンソールからサンプリングルールを設定し、複数のホストで自動的に使用できる機能が含まれます。

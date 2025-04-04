# トレーシングエージェントの選択




## エージェントの選択

AWS は、[トレース](../signals/traces/) 収集のために 2 つのツールセットを直接サポートしています（[オブザーバビリティパートナー](https://aws.amazon.com/jp/products/management-and-governance/partners/) も多数あります）：

* [AWS Distro for OpenTelemetry](https://aws-otel.github.io/)（一般的に ADOT と呼ばれます）
* X-Ray の [SDK](https://docs.aws.amazon.com/ja_jp/xray/latest/devguide/xray-instrumenting-your-app.html) と [デーモン](https://docs.aws.amazon.com/ja_jp/xray/latest/devguide/xray-daemon.html)

オブザーバビリティソリューションを発展させる上で、どのツールを使用するかの選択は重要な決定事項です。
これらのツールは相互に排他的ではなく、必要に応じて組み合わせることができます。
また、この選択には最適な方法があります。
しかし、まず [OpenTelemetry (OTEL)](https://opentelemetry.io/) の現状を理解する必要があります。

OTEL は、オブザーバビリティシグナルの現在の業界標準仕様であり、3 つのコアシグナルタイプ（[メトリクス](../signals/metrics/)、[トレース](../signals/traces/)、[ログ](../signals/logs)）の定義を含んでいます。
しかし、OTEL は常に存在していたわけではなく、[OpenMetrics](https://openmetrics.io) や [OpenTracing](https://opentracing.io) などの以前の仕様から進化してきました。
オブザーバビリティベンダーは近年、OpenTelemetry Line Protocol (OTLP) のオープンサポートを開始しました。

AWS X-Ray と CloudWatch は OTEL 仕様以前からあり、他の主要なオブザーバビリティソリューションも同様です。
しかし、AWS X-Ray サービスは ADOT を使用して OTEL トレースを容易に受け入れることができます。
ADOT には、X-Ray や他の ISV ソリューションにテレメトリを直接送信するための統合機能が既に組み込まれています。

トランザクショントレースソリューションには、シグナルを収集するためのエージェントとアプリケーションへの統合が必要です。
これにより、テスト、保守、アップグレードが必要なライブラリの形で技術的負債が生まれ、将来ソリューションを変更する場合には再ツール化が必要になる可能性があります。

X-Ray に含まれる SDK は、AWS が提供する緊密に統合された計装ソリューションの一部です。
ADOT は、X-Ray が多くのトレースソリューションの 1 つに過ぎない、より広範な業界ソリューションの一部です。
どちらのアプローチでも X-Ray でエンドツーエンドのトレースを実装できますが、最も有用なアプローチを決定するために、その違いを理解することが重要です。

:::info
以下が必要な場合は、AWS Distro for OpenTelemetry でアプリケーションを計装することをお勧めします：

    * コードを再計装することなく、複数の異なるトレースバックエンドにトレースを送信する機能。例えば、X-Ray コンソールから [Zipkin](https://zipkin.io) に移行する場合、コレクターの設定のみを変更し、アプリケーションコードは変更しません。

    * OpenTelemetry コミュニティによって維持される、各言語用の多数のライブラリ計装のサポート。
:::

:::info
以下が必要な場合は、アプリケーションの計装に X-Ray SDK を選択することをお勧めします：

    * 緊密に統合された単一ベンダーソリューション。

    * Node.js、Python、Ruby、.NET を使用する場合の X-Ray 集中サンプリングルールとの統合。これには X-Ray コンソールからサンプリングルールを設定し、複数のホストで自動的に使用する機能が含まれます。
:::

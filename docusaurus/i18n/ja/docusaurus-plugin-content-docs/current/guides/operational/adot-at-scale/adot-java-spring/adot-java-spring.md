# Java Spring Integration アプリケーションのインストルメンテーション

この記事では、[Open Telemetry](https://opentelemetry.io/) と [X-ray](https://aws.amazon.com/xray/) を利用して [Spring-Integration](https://docs.spring.io/spring-integration/reference/overview.html) アプリケーションを手動でインストルメント化するアプローチについて説明します。

Spring-Integration フレームワークは、イベント駆動型アーキテクチャやメッセージング中心のアーキテクチャに典型的な統合ソリューションの開発を可能にするように設計されています。一方、OpenTelemetry は、HTTP リクエストを使用してサービスが相互に通信および調整するマイクロサービスアーキテクチャにより焦点を当てる傾向があります。そのため、このガイドでは、OpenTelemetry API を使用した手動インストルメンテーションによって Spring-Integration アプリケーションをインストルメント化する方法の例を提供します。

## 背景情報

### トレーシングとは

[OpenTelemetry ドキュメント](https://opentelemetry.io/docs/concepts/signals/traces/)からの以下の引用は、トレースの目的について優れた概要を示しています。

:::note
    トレースは、アプリケーションにリクエストが行われたときに何が起こるかの全体像を提供します。アプリケーションが単一のデータベースを持つモノリスであっても、洗練されたサービスメッシュであっても、トレースはアプリケーション内でリクエストが辿る完全な「パス」を理解するために不可欠です。
:::
トレーシングの主な利点の 1 つがリクエストのエンドツーエンドの可視性であることを考えると、トレースがリクエストの発信元からバックエンドまで適切にリンクされることが重要です。OpenTelemetry でこれを行う一般的な方法は、[ネストされたスパン](https://opentelemetry.io/docs/instrumentation/java/manual/#create-nested-spans)を利用することです。これは、スパンが最終的な宛先に到達するまでサービスからサービスへと渡されるマイクロサービスアーキテクチャで機能します。Spring Integration アプリケーションでは、リモートとローカルの両方で作成されたスパン間に親子関係を作成する必要があります。

## コンテキスト伝播を利用したトレーシング

コンテキスト伝播を使用したアプローチを実証します。このアプローチは従来、ローカルおよびリモートロケーションで作成されたスパン間に親子関係を作成する必要がある場合に使用されますが、Spring Integration アプリケーションのケースでは、コードを簡素化し、アプリケーションのスケーリングを可能にするために使用されます。複数のスレッドでメッセージを並列処理することが可能になり、異なるホストでメッセージを処理する必要がある場合に水平方向にスケーリングすることも可能になります。

これを実現するために必要な事項の概要は次のとおりです。

- 作成します `ChannelInterceptor` として登録します。 `GlobalChannelInterceptor` すべてのチャネルで送信されるメッセージをキャプチャできるようにします。

- 次の場所で `ChannelInterceptor`:
  - In the `preSend` メソッド:
    - 上流で生成されている前のメッセージからコンテキストを読み取ろうとします。これにより、上流のメッセージからスパンを接続できます。コンテキストが存在しない場合は、新しいトレースが開始されます (これは OpenTelemetry SDK によって行われます)。
    - その操作を識別する一意の名前を持つスパンを作成します。これは、このメッセージが処理されているチャネルの名前にすることができます。
    - 現在のコンテキストをメッセージに保存します。
    - コンテキストとスコープを thread.local に保存して、後でクローズできるようにします。
    - 下流に送信されるメッセージにコンテキストを注入します。
  - 次の場合 `afterSendCompletion`:
    - thread.local からコンテキストとスコープを復元します
    - コンテキストからスパンを再作成します
    - メッセージの処理中に発生した例外を登録します
    - スコープを閉じます
    - スパンを終了します

これは実行する必要がある内容の簡略化された説明です。Spring-Integration フレームワークを使用する機能的なサンプルアプリケーションを提供しています。このアプリケーションのコードは[こちら](https://github.com/rapphil/spring-integration-samples/tree/rapphil-5.5.x-otel/applications/file-split-ftp)にあります。

アプリケーションをインストルメント化するために実施された変更のみを表示するには、この [diff](https://github.com/rapphil/spring-integration-samples/compare/30e01ce9eefd8dae288eca44013810afa8c1a585..6f056a76350340a9658db0cad7fc12dbda505437) を参照してください。

### このサンプルアプリケーションを実行するには、次のコマンドを使用します。

``` bash
# build and run
mvn spring-boot:run
# create sample input file to trigger flow
echo 'testcontent\nline2content\nlastline' > /tmp/in/testfile.txt
```

このサンプルアプリケーションを試すには、アプリケーションと同じマシンで [ADOT コレクター](https://aws-otel.github.io/docs/getting-started/collector)を実行する必要があります。設定は以下のようなものにします。

``` yaml
receivers:
  otlp:
    protocols:
      grpc: 
        endpoint: 0.0.0.0:4317
      http:
        endpoint: 0.0.0.0:4318
processors:
  batch/traces:
    timeout: 1s
    send_batch_size: 50
  batch/metrics:
    timeout: 60s
exporters:
  aws xray: region:us-west-2
  aws emf:
    region: us-west-2
service:
  pipelines:
    traces:
      receivers: [otlp]
      processors: [batch/traces]
      exporters: [awsxray]
    metrics:
      receivers: [otlp]
      processors: [batch/metrics]
      exporters: [awsemf]
```

## 結果

サンプルアプリケーションを実行してから次のコマンドを実行すると、以下のような結果が得られます。

``` bash
echo 'foo123\nbar123\nfoo1234' > /tmp/in/testfile.txt
```

![X-ray Results](x-ray-results.png)

上記のセグメントが、サンプルアプリケーションで説明されているワークフローと一致していることがわかります。一部のメッセージが処理されたときに例外が発生することが予想されるため、それらが適切に登録されており、X-Ray でトラブルシューティングできることがわかります。


## よくある質問

### ネストされたスパンを作成する方法

OpenTelemetry でスパンを接続するために使用できる 3 つのメカニズムがあります。

##### 明示的に

親スパンを子スパンが作成される場所に渡し、次を使用して両方をリンクする必要があります。

``` java
    Span childSpan = tracer.spanBuilder("child")
    .setParent(Context.current().with(parentSpan)) 
    .startSpan();
```

##### 暗黙的に

スパンコンテキストは内部的に thread.local に保存されます。
この方法は、同じスレッドでスパンを作成していることが確実な場合に適しています。

``` java
    void parentTwo() {
        Span parentSpan = tracer.spanBuilder("parent").startSpan(); 
        try(Scope scope = parentSpan.makeCurrent()) {
            childTwo(); 
        } finally {
        parentSpan.end(); 
        }
    }
    void childTwo() {
        Span childSpan = tracer.spanBuilder("child")
            // NOTE: setParent(...) is not required;
            // `Span.current()` is automatically added as the parent 
            .startSpan();
        try(Scope scope = childSpan.makeCurrent()) { 
            // do stuff
        } finally {
            childSpan.end();
        } 
    }
```

##### コンテキスト伝播  

このメソッドは、コンテキストをどこか (HTTP ヘッダーまたはメッセージ内) に保存し、子スパンが作成されるリモートロケーションに転送できるようにします。リモートロケーションである必要は厳密にはありません。同じプロセス内でも使用できます。

### OpenTelemetry プロパティは X-Ray プロパティにどのように変換されますか?

関係を確認するには、次の[ガイド](https://opentelemetry.io/docs/instrumentation/java/manual/#context-propagation)を参照してください。



  

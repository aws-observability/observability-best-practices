# Java Spring Integration アプリケーションの計装

この記事では、[Open Telemetry](https://opentelemetry.io/) と [X-ray](https://aws.amazon.com/jp/xray/) を利用して [Spring-Integration](https://docs.spring.io/spring-integration/reference/overview.html) アプリケーションを手動で計装するアプローチについて説明します。

Spring-Integration フレームワークは、イベント駆動型アーキテクチャやメッセージング中心のアーキテクチャに典型的な統合ソリューションの開発を可能にするように設計されています。
一方、OpenTelemetry は、サービスが HTTP リクエストを使用して相互に通信および調整するマイクロサービスアーキテクチャに重点を置く傾向があります。
そのため、このガイドでは OpenTelemetry API を使用した手動計装により Spring-Integration アプリケーションを計装する方法の例を提供します。



## 背景情報




### トレーシングとは何か？

[OpenTelemetry のドキュメント](https://opentelemetry.io/docs/concepts/signals/traces/) からの以下の引用は、トレースの目的について良い概要を示しています：

:::note
    トレースは、アプリケーションにリクエストが行われたときに何が起こるかの全体像を示します。アプリケーションが単一のデータベースを持つモノリスであっても、洗練されたサービスメッシュであっても、トレースはアプリケーション内でリクエストが辿る完全な「パス」を理解するために不可欠です。
:::

トレーシングの主な利点の 1 つがリクエストのエンドツーエンドの可視性であることを考えると、リクエストの発信元からバックエンドまで、トレースが適切にリンクすることが重要です。OpenTelemetry でこれを行う一般的な方法は、[ネストされたスパン](https://opentelemetry.io/docs/instrumentation/java/manual/#create-nested-spans) を利用することです。これは、スパンがサービスからサービスへと最終目的地に到達するまで渡されるマイクロサービスアーキテクチャで機能します。Spring Integration アプリケーションでは、リモートとローカルの両方で作成されたスパン間に親子関係を作成する必要があります。



## コンテキスト伝播を利用したトレーシング

コンテキスト伝播を使用するアプローチを紹介します。このアプローチは通常、ローカルおよびリモートの場所で作成されたスパン間に親子関係を作成する必要がある場合に使用されますが、Spring Integration アプリケーションの場合にも使用されます。これはコードを簡素化し、アプリケーションのスケーリングを可能にするためです。複数のスレッドでメッセージを並列処理することが可能になり、異なるホストでメッセージを処理する必要がある場合に水平方向にスケールすることも可能になります。

これを実現するために必要なことの概要は以下の通りです：

- `ChannelInterceptor` を作成し、`GlobalChannelInterceptor` として登録して、すべてのチャンネルで送信されるメッセージをキャプチャできるようにします。

- `ChannelInterceptor` 内で：
  - `preSend` メソッドで：
    - 上流で生成される前のメッセージからコンテキストを読み取ろうとします。これにより、上流のメッセージからのスパンを接続できます。コンテキストが存在しない場合は、新しいトレースが開始されます（これは OpenTelemetry SDK によって行われます）。
    - その操作を識別するユニークな名前でスパンを作成します。これはメッセージが処理されているチャンネルの名前にすることができます。
    - 現在のコンテキストをメッセージに保存します。
    - コンテキストとスコープを thread.local に保存し、後で閉じることができるようにします。
    - 下流に送信されるメッセージにコンテキストを注入します。
  - `afterSendCompletion` で：
    - thread.local からコンテキストとスコープを復元します。
    - コンテキストからスパンを再作成します。
    - メッセージの処理中に発生した例外を登録します。
    - スコープを閉じます。
    - スパンを終了します。

これは必要な作業の簡略化された説明です。Spring-Integration フレームワークを使用した機能的なサンプルアプリケーションを提供しています。このアプリケーションのコードは[こちら](https://github.com/rapphil/spring-integration-samples/tree/rapphil-5.5.x-otel/applications/file-split-ftp)で見つけることができます。

アプリケーションを計測するために行われた変更のみを表示するには、この[差分](https://github.com/rapphil/spring-integration-samples/compare/30e01ce9eefd8dae288eca44013810afa8c1a585..6f056a76350340a9658db0cad7fc12dbda505437)を参照してください。



### このサンプルアプリケーションを実行するには、以下を使用します：

``` bash



# ビルドと実行
mvn spring-boot:run



# サンプル入力ファイルを作成してフローをトリガーする
echo 'testcontent\nline2content\nlastline' > /tmp/in/testfile.txt
```

このサンプルアプリケーションを試すには、アプリケーションと同じマシンで [ADOT コレクター](https://aws-otel.github.io/docs/getting-started/collector) を実行する必要があります。以下のような設定を使用します：

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

サンプルアプリケーションを実行し、以下のコマンドを実行すると、次のような結果が得られます：

``` bash
echo 'foo123\nbar123\nfoo1234' > /tmp/in/testfile.txt
```

![X-ray の結果](x-ray-results.png)

上記のセグメントが、サンプルアプリケーションで説明されているワークフローと一致していることがわかります。
一部のメッセージの処理中に例外が発生することが予想されるため、それらが適切に登録され、X-Ray でトラブルシューティングできるようになっていることがわかります。



## よくある質問




### ネストされたスパンをどのように作成しますか？

OpenTelemetry には、スパンを接続するために使用できる 3 つのメカニズムがあります：




##### 明示的に

子スパンを作成する場所に親スパンを渡し、以下のように両者をリンクする必要があります：

``` java
    Span childSpan = tracer.spanBuilder("child")
    .setParent(Context.current().with(parentSpan)) 
    .startSpan();
```



##### 暗黙的に

スパンコンテキストは、内部的に thread.local に保存されます。
この方法は、同じスレッド内でスパンを作成することが確実な場合に適しています。

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
            // 注意: setParent(...) は必要ありません。
            // `Span.current()` が自動的に親として追加されます
            .startSpan();
        try(Scope scope = childSpan.makeCurrent()) { 
            // 処理を行う
        } finally {
            childSpan.end();
        } 
    }
```



##### コンテキスト伝播

この方法では、コンテキストを（HTTP ヘッダーやメッセージ内に）保存し、子スパンが作成されるリモートの場所に転送できるようにします。厳密にリモートの場所である必要はありません。同一プロセス内でも使用できます。



### OpenTelemetry のプロパティは X-Ray のプロパティにどのように変換されますか？

関係性を確認するには、以下の[ガイド](https://opentelemetry.io/docs/instrumentation/java/manual/#context-propagation)をご覧ください。

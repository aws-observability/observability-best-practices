# AWS Rust SDK を使用したカスタムメトリクスの作成




## はじめに

Rust は、安全性、パフォーマンス、並行性に焦点を当てたシステムプログラミング言語で、ソフトウェア開発の世界で人気を集めています。メモリ管理とスレッドの安全性に対するユニークなアプローチにより、堅牢で効率的なアプリケーションを構築するための魅力的な選択肢となっています。特にクラウド環境での利用に適しています。サーバーレスアーキテクチャの台頭と、高性能でスケーラブルなサービスの需要の増加に伴い、Rust の機能はクラウドネイティブアプリケーションの構築に最適な選択肢となっています。このガイドでは、AWS Rust SDK を活用してカスタム CloudWatch メトリクスを作成する方法を探ります。これにより、AWS エコシステム内でのアプリケーションのパフォーマンスと動作についてより深い洞察を得ることができます。



## 前提条件

このガイドを使用するには、Rust をインストールし、後で使用するデータを保存するための CloudWatch ロググループとログストリームを作成する必要があります。




### Rust のインストール

Mac または Linux の場合:

```
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```

Windows の場合、[rustup-init.exe](https://static.rust-lang.org/rustup/dist/i686-pc-windows-gnu/rustup-init.exe) をダウンロードして実行してください。



### CloudWatch ロググループとログストリームの作成

1. CloudWatch ロググループを作成します：

```
aws logs create-log-group --log-group-name rust_custom
```

2. CloudWatch ログストリームを作成します：

```
aws logs create-log-stream --log-group-name rust_custom --log-stream-name diceroll_log_stream
```



## コード

完全なコードは、このリポジトリの sandbox セクションで見つけることができます。

```
git clone https://github.com/aws-observability/observability-best-practices.git
cd observability-best-practices/sandbox/rust-custom-metrics
```

このコードはまず、サイコロを振るシミュレーションを行います。このサイコロの目の値をカスタムメトリクスとして扱うことにします。その後、このメトリクスを CloudWatch に追加し、ダッシュボードで表示する 3 つの異なる方法を示します。



### アプリケーションのセットアップ

まず、アプリケーションで使用するいくつかのクレートをインポートする必要があります。

```rust
use crate::cloudwatch::types::Dimension;
use crate::cloudwatchlogs::types::InputLogEvent;
use aws_sdk_cloudwatch as cloudwatch;
use aws_sdk_cloudwatch::config::BehaviorVersion;
use aws_sdk_cloudwatch::types::MetricDatum;
use aws_sdk_cloudwatchlogs as cloudwatchlogs;
use rand::prelude::*;
use serde::Serialize;
use serde_json::json;
use std::time::{SystemTime, UNIX_EPOCH};
```

このインポートブロックでは、主に使用する AWS SDK ライブラリをインポートしています。また、ランダムなサイコロの値を作成するために 'rand' クレートも導入しています。最後に、SDK 呼び出しに使用するデータ作成を処理するために、'serde' や 'time' などのいくつかのライブラリがあります。

次に、main 関数でサイコロの値を作成できます。この値は、3 つの AWS SDK 呼び出しすべてで使用されます。

```rust
//1から6のランダムな数字を選択してサイコロの目を表す
let mut rng = rand::thread_rng();
let roll_value = rng.gen_range(1..7);
```

サイコロの数値が得られたので、この値を CloudWatch にカスタムメトリクスとして追加する 3 つの異なる方法を探ってみましょう。値がカスタムメトリクスになると、その値にアラームを設定したり、異常検出を設定したり、ダッシュボードにプロットしたりするなど、さまざまなことができるようになります。



### メトリクスデータの送信

CloudWatch に値を追加する最初の方法は PutMetricData です。PutMetricData を使用すると、メトリクスの時系列の値を直接 CloudWatch に書き込みます。これは値を追加する最も効率的な方法です。PutMetricData を使用する際は、名前空間とメトリクス値に加えて、各 AWS SDK 呼び出しにディメンションを提供する必要があります。以下がコードです：

まず、メトリクス（サイコロの値）を受け取り、Result 型を返す関数を設定します。Rust では Result 型は成功または失敗を示します。関数内で最初に行うのは、AWS Rust SDK クライアントの初期化です。クライアントはローカル環境から認証情報とリージョンを継承します。このコードを実行する前に、コマンドラインから `aws configure` を実行して、これらが設定されていることを確認してください。

```rust
async fn put_metric_data(roll_value: i32) -> Result<(), cloudwatch::Error> {
    //クライアントに渡せる再利用可能な aws 設定を作成
    let config = aws_config::load_defaults(BehaviorVersion::v2023_11_09()).await;

    //CloudWatch クライアントを作成
    let client = cloudwatch::Client::new(&config);
```

クライアントの初期化後、PutMetricData API 呼び出しに必要な入力の設定を開始できます。ディメンションを定義し、次にディメンションと値の組み合わせである MetricDatum 自体を定義する必要があります。

```rust
//流暢なビルダーを使用して pmd 呼び出しに必要な入力を構築、ディメンションから始めます。
let dimensions = Dimension::builder()
    .name("roll_value_pmd_dimension")
    .value(roll_value.to_string())
    .build();

let put_metric_data_input = MetricDatum::builder()
    .metric_name("roll_value_pmd")
    .dimensions(dimensions)
    .value(f64::from(roll_value))
    .build();
```

最後に、先ほど定義した入力を使用して PutMetricData API 呼び出しを行います。

```rust
let response = client
    .put_metric_data()
    .namespace("rust_custom_metrics")
    .metric_data(put_metric_data_input)
    .send()
    .await?;
println!("メトリクスが送信されました: {:?}", response);
Ok(())
```

SDK 呼び出しが非同期関数内にあることに注意してください。関数が非同期で完了するため、その完了を `await` する必要があります。そして、関数の最上位で定義された Result 型を返します。

main から関数を呼び出す時は、以下のようになります：

```rust
//put_metric_data 関数をロール値で呼び出す
println!("まず、PutMetricData API 呼び出しでカスタムメトリクスを書き込みます");
put_metric_data(roll_value).await.unwrap();
```

ここでも関数呼び出しの完了を待ち、値を `unwrap` しています。この場合、エラーではなく 'Ok' の結果にのみ興味があるためです。本番シナリオでは、おそらく異なる方法でエラー処理を行うでしょう。



### PutLogEvent + メトリクスフィルター

カスタムメトリクスを作成する次の方法は、単純に CloudWatch ロググループに書き込むことです。メトリクスが CloudWatch ロググループに入ったら、[メトリクスフィルター](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/logs/MonitoringPolicyExamples.html) を使用してログデータからメトリクスデータを抽出できます。

まず、ログメッセージ用の構造体を定義します。これはオプションで、手動で JSON を構築することもできます。しかし、より複雑なアプリケーションでは、再利用性のためにこのようなログ構造体が必要になる可能性が高いでしょう。

```rust
// ログメッセージ用の単純な構造体を作成します。手動で JSON 文字列を作成することもできます。



#[derive(Serialize)]
struct DicerollValue {
    welcome_message: String,
    roll_value: i32,
}
```

構造体を定義したら、AWS API 呼び出しの準備が整います。今回も API クライアントを作成しますが、今回は logs SDK を使用します。また、Unix エポックタイミングを使用してシステム時間を定義します。

```rust
// 再利用可能な AWS 設定を作成し、クライアントに渡します
let config = aws_config::load_defaults(BehaviorVersion::v2023_11_09()).await;

// CloudWatch Logs クライアントを作成します
let client = cloudwatchlogs::Client::new(&config);

// Unix エポックからの時間をミリ秒単位で取得します。これは CloudWatch Logs に必要です
let time_now = SystemTime::now()
    .duration_since(UNIX_EPOCH)
    .unwrap()
    .as_millis() as i64;
```

まず、先ほど定義した構造体の新しいインスタンスから JSON を作成します。次に、これを使用してログイベントを作成します。

```rust
let log_json = json!(DicerollValue {
    welcome_message: String::from("Hello from rust!"),
    roll_value
});

let log_event = InputLogEvent::builder()
    .timestamp(time_now)
    .message(log_json.to_string())
    .build();
```

これで、PutMetricData で行ったのと同様の方法で API 呼び出しを完了できます。

```rust
let response = client
    .put_log_events()
    .log_group_name("rust_custom")
    .log_stream_name("diceroll_log_stream")
    .log_events(log_event.unwrap())
    .send()
    .await?;

println!("Log event submitted: {:?}", response);
Ok(())
```

ログイベントが送信されたら、CloudWatch に移動し、ロググループのメトリクスフィルターを作成してメトリクスを適切に抽出する必要があります。

CloudWatch コンソールで、作成した rust_custom ロググループに移動します。次に、メトリクスフィルターを作成します。フィルターパターンは `{$.roll_value = *}` とします。次に、メトリクス値には `$.roll_value` を使用します。名前空間とメトリクス名は任意のものを使用できます。このメトリクスフィルターは次のように説明できます：

「'roll_value' というフィールドを受け取るたびに、値に関係なくフィルターをトリガーします。トリガーされたら、'roll_value' を CloudWatch Metrics に書き込む数値として使用します。」

この方法でメトリクスを作成することは、ログ形式を制御できない場合にログデータから時系列の値を抽出するのに非常に強力です。私たちは直接コードを計装しているため、ログデータの形式を制御できます。したがって、より良い方法は CloudWatch 組み込みメトリクス形式を使用することかもしれません。これについては次のステップで説明します。



### PutLogEvent + Embedded Metric Format

CloudWatch の [Embedded Metric Format](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/CloudWatch_Embedded_Metric_Format_Specification.html)（EMF）は、時系列メトリクスをログに直接埋め込む方法です。
CloudWatch は、メトリクスフィルターを使用せずにメトリクスを抽出します。
コードを見てみましょう。

まず、ログクライアントを再度作成し、Unix エポックでのシステム時間を取得します。

```rust
//Create a reusable aws config that we can pass to our clients
let config = aws_config::load_defaults(BehaviorVersion::v2023_11_09()).await;

//Create a cloudwatch logs client
let client = cloudwatchlogs::Client::new(&config);

//get the time in unix epoch ms
let time_now = SystemTime::now()
    .duration_since(UNIX_EPOCH)
    .unwrap()
    .as_millis() as i64;
```

次に、EMF の JSON 文字列を作成します。
これには、CloudWatch がカスタムメトリクスを作成するために必要なすべてのデータが含まれている必要があるため、名前空間、ディメンション、値を文字列に埋め込みます。

```rust
//Create a json string in embedded metric format with our diceroll value.
let json_emf = json!(
    {
        "_aws": {
        "Timestamp": time_now,
        "CloudWatchMetrics": [
            {
            "Namespace": "rust_custom_metrics",
            "Dimensions": [["roll_value_emf_dimension"]],
            "Metrics": [
                {
                "Name": "roll_value_emf"
                }
            ]
            }
        ]
        },
        "roll_value_emf_dimension": roll_value.to_string(),
        "roll_value_emf": roll_value
    }
);
```

ここで、ロール値を値として使用するだけでなく、ディメンションとしても作成していることに注目してください。
これにより、ロール値で GroupBy を実行し、各ロール値が何回出たかを確認できます。

これで、以前と同じように API 呼び出しを行ってログイベントを書き込むことができます：

```rust
let log_event = InputLogEvent::builder()
    .timestamp(time_now)
    .message(json_emf.to_string())
    .build();

let response = client
    .put_log_events()
    .log_group_name("rust_custom")
    .log_stream_name("diceroll_log_stream_emf")
    .log_events(log_event.unwrap())
    .send()
    .await?;

println!("EMF Log event submitted: {:?}", response);
Ok(())
```

ログイベントが CloudWatch に送信されると、メトリクスフィルターを使用せずにメトリクスが抽出されます。
これは、高カーディナリティのメトリクスを作成する優れた方法で、すべての異なるディメンションを持つ PutMetricData API 呼び出しを行うよりも、これらの値をログメッセージとして書き込む方が簡単な場合があります。



### すべてをまとめる

最終的な main 関数は、以下のように 3 つの API 呼び出しを行います。

```rust



#[::tokio::main]
async fn main() {
    println!("Rust SDK を使用してカスタムメトリクスを作成して楽しみましょう");

    //1-6 のランダムな数字を選択してサイコロの出目を表現します
    let mut rng = rand::thread_rng();
    let roll_value = rng.gen_range(1..7);

    //roll_value を使用して put_metric_data 関数を呼び出します
    println!("まず、PutMetricData API 呼び出しでカスタムメトリクスを書き込みます");
    put_metric_data(roll_value).await.unwrap();

    println!("次に、ログイベントを書き込み、そこからカスタムメトリクスを抽出します。");
    //roll_value を使用して put_log_data 関数を呼び出します
    put_log_event(roll_value).await.unwrap();

    //roll_value を使用して put_log_emf 関数を呼び出します
    println!("次に、埋め込みメトリクス形式のログイベントを配置して、カスタムメトリクスを直接送信します。");
    put_log_event_emf(roll_value).await.unwrap();
}
```

テストデータを生成するために、アプリケーションをビルドし、ループで実行して CloudWatch で表示するデータを生成できます。ルートディレクトリから以下を実行します。

```
cargo build
```

次に、2 秒のスリープを挟んで 50 回実行します。スリープは、CloudWatch ダッシュボードでメトリクスを見やすくするために、メトリクスの間隔を少し空けるためです。

```
for run in {1..50}; do ./target/debug/custom-metrics; sleep 2; done
```

これで CloudWatch で結果を確認できます。私はディメンションで GroupBy するのが好きです。これにより、各ロール値が選択された回数を確認できます。メトリクスインサイトのクエリは以下のようになるはずです。何か変更した場合は、メトリクス名とディメンション名を適宜変更してください。

```
SELECT COUNT(roll_value_emf) FROM rust_custom_metrics GROUP BY roll_value_emf_dimension
```

これで、3 つすべてをダッシュボードに配置し、予想通り同じグラフが表示されることを確認できます。

![dashboard](./dashboard.png)



## クリーンアップ

`rust_custom` ロググループを必ず削除してください。

```
aws logs delete-log-group --log-group-name rust_custom
```

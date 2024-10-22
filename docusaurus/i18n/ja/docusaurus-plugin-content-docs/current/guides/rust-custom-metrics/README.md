# AWS Rust SDK でカスタムメトリクスを作成する

## はじめに

安全性、パフォーマンス、並行性に焦点を当てたシステムプログラミング言語である Rust は、ソフトウェア開発の世界で人気が高まっています。メモリ管理とスレッド安全性に対するユニークなアプローチにより、堅牢で効率的なアプリケーションを構築するのに魅力的な選択肢となっています。特にクラウド環境においてです。サーバーレスアーキテクチャの台頭と、高性能で拡張性の高いサービスへのニーズの高まりから、Rust の機能はクラウドネイティブアプリケーションを構築するのに最適です。このガイドでは、AWS Rust SDK を活用してカスタム CloudWatch メトリクスを作成する方法を説明します。これにより、AWS エコシステム内のアプリケーションのパフォーマンスと動作をより深く洞察できるようになります。

## 前提条件

このガイドを使用するには、Rust をインストールし、CloudWatch のロググループとログストリームを作成して、後で使用するデータの一部を保存する必要があります。

### Rust のインストール

Mac または Linux の場合:

```
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```

Windows の場合は、[rustup-init.exe](https://static.rust-lang.org/rustup/dist/i686-pc-windows-gnu/rustup-init.exe) をダウンロードして実行してください。

### CloudWatch ロググループとログストリームの作成

1. CloudWatch ロググループを作成します。

```
aws logs create-log-group --log-group-name rust_custom
```

2. CloudWatch ログストリームを作成します。

```
aws logs create-log-stream --log-group-name rust_custom --log-stream-name diceroll_log_stream
```

## コード

完全なコードは、このリポジトリのサンドボックスセクションにあります。

```
git clone https://github.com/aws-observability/observability-best-practices.git
cd observability-best-practices/sandbox/rust-custom-metrics
```

このコードは最初にサイコロを振るシミュレーションを行い、サイコロの値をカスタムメトリクスとして扱うことにします。次に、そのメトリクスを CloudWatch に追加し、ダッシュボードで表示する 3 つの異なる方法を示します。

### アプリケーションのセットアップ

まず、アプリケーションで使用するためのいくつかのクレートをインポートする必要があります。

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

このインポートブロックでは、主に使用する AWS SDK ライブラリをインポートしています。また、'rand' クレートを取り込んで、ランダムなサイコロの値を作成できるようにしています。最後に、'serde' や 'time' などのライブラリを使って、SDK 呼び出しに使用するデータの作成を処理しています。

次に、main 関数内でサイコロの値を作成できます。この値は、行う 3 つの AWS SDK 呼び出しすべてで使用されます。

```rust
//select a random number 1-6 to represent a diceroll
let mut rng = rand::thread_rng();
let roll_value = rng.gen_range(1..7);
```

サイコロの値を取得できたので、その値をカスタムメトリクスとして CloudWatch に追加する 3 つの異なる方法を見ていきましょう。一度値をカスタムメトリクスにすると、その値に対してアラームを設定したり、異常検知を設定したり、ダッシュボードにプロットしたり、さまざまな機能を利用できるようになります。

### メトリックデータの送信

CloudWatch にメトリック値を追加する最初の方法は、PutMetricData を使う方法です。PutMetricData を使うと、メトリックの時系列データを直接 CloudWatch に書き込むことができます。これがメトリック値を追加する最も効率的な方法です。PutMetricData を使う場合は、メトリック値に加えて、名前空間やディメンションを AWS SDK の呼び出しごとに指定する必要があります。コードは次のとおりです。

まず、メトリック (サイコロの値) を受け取り、成功か失敗を示す Result 型を返す関数を設定します。関数内で最初に行うことは、AWS Rust SDK クライアントを初期化することです。クライアントは、ローカル環境からクレデンシャルとリージョンを継承します。このコードを実行する前に、コマンドラインから `aws configure` を実行して、これらを設定してください。

```rust
async fn put_metric_data(roll_value: i32) -> Result<(), cloudwatch::Error> {
    //Create a reusable aws config that we can pass to our clients
    let config = aws_config::load_defaults(BehaviorVersion::v2023_11_09()).await;

    //Create a cloudwatch client
    let client = cloudwatch::Client::new(&config);
```

クライアントを初期化した後、PutMetricData API 呼び出しに必要な入力を設定できます。ディメンションを定義し、次にディメンションと値の組み合わせである MetricDatum 自体を定義する必要があります。

```rust
//Use fluent builders to build the required input for pmd call, starting with dimensions.
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

最後に、前に定義した入力を使って PutMetricData API 呼び出しを行えます。

```rust
let response = client
    .put_metric_data()
    .namespace("rust_custom_metrics")
    .metric_data(put_metric_data_input)
    .send()
    .await?;
println!("Metric Submitted: {:?}", response);
Ok(())
```
SDK の呼び出しは非同期関数内にあることに注意してください。関数は非同期で完了するため、完了を `await` する必要があります。そして、関数の最上位で定義した Result 型を返します。

メイン関数から関数を呼び出すときは、次のようになります。

```rust
//call the put_metric_data function with the roll value
println!("First we will write a custom metric with PutMetricData API call");
put_metric_data(roll_value).await.unwrap();
```
ここでも関数呼び出しの完了を待ち、`unwrap` で値を取り出しています。この場合は 'Ok' の結果のみに興味があり、エラーは扱いません。本番環境では、別の方法でエラー処理を行うことになるでしょう。

### PutLogEvent + メトリックフィルター

カスタムメトリックを作成する次の方法は、CloudWatch ロググループにメトリックを書き込むことです。メトリックが CloudWatch ロググループに入ると、[メトリックフィルター](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/logs/MonitoringPolicyExamples.html) を使ってログデータからメトリックデータを抽出できます。

まず、ログメッセージ用の構造体を定義します。これは省略可能で、手動で JSON を作成することもできます。しかし、より複雑なアプリケーションでは、再利用性のためにこのようなロギング構造体が必要になる可能性があります。

```rust
//Make a simple struct for the log message. We could also just create a json string manually.
#[derive(Serialize)]
struct DicerollValue {
    welcome_message: String,
    roll_value: i32,
}
```

構造体を定義したので、AWS API 呼び出しの準備ができました。再び API クライアントを作成しますが、今回は logs SDK を使用します。また、Unix エポック時間を使用してシステム時間を定義します。

```rust
//Create a reusable aws config that we can pass to our clients
let config = aws_config::load_defaults(BehaviorVersion::v2023_11_09()).await;

//Create a cloudwatch logs client
let client = cloudwatchlogs::Client::new(&config);

//Let's get the time in ms from unix epoch, this is required for CWlogs
let time_now = SystemTime::now()
    .duration_since(UNIX_EPOCH)
    .unwrap()
    .as_millis() as i64;
```

まず、前に定義した構造体の新しいインスタンスから JSON を作成します。次にこれを使用してログイベントを作成します。

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

PutMetricData で行ったのと同様の方法で、API 呼び出しを完了できます。

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

ログイベントが送信されたら、ロググループでメトリックフィルターを作成し、メトリックを適切に抽出する必要があります。

CloudWatch コンソールで作成した rust_custom ロググループに移動します。次にメトリックフィルターを作成します。フィルターパターンは `{$.roll_value = *}` とします。メトリック値には `$.roll_value` を使用します。任意の名前空間とメトリック名を使用できます。このメトリックフィルターは次のように説明できます。

「'roll_value' という名前のフィールドが来たら、値に関係なくフィルターをトリガーする。トリガーされたら、'roll_value' の値を CloudWatch Metrics に書き込む」

このようにしてメトリックを作成する方法は、ログフォーマットを制御できない場合にログデータから時系列値を抽出するのに非常に強力です。今回はコードを直接インストルメント化しているため、ログデータのフォーマットを制御できます。したがって、次のステップで説明する CloudWatch Embedded Metric Format を使用する方が良い方法かもしれません。

### PutLogEvent + 埋め込みメトリックフォーマット

CloudWatch の[埋め込みメトリックフォーマット](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/CloudWatch_Embedded_Metric_Format_Specification.html)(EMF)は、時系列メトリクスをログに直接埋め込む方法です。CloudWatch はメトリックフィルターを必要とせずにメトリクスを抽出します。コードを見てみましょう。

再び logs クライアントを作成し、システム時間をユニックスエポックで取得します。

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

次に EMF の JSON 文字列を作成します。CloudWatch がカスタムメトリクスを作成するために必要なすべてのデータ (名前空間、ディメンション、値) を文字列に埋め込む必要があります。

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

ダイスロール値をディメンションとして作成し、値としても使用していることに注目してください。これにより、ダイスロール値ごとの出現回数を確認するために、ダイスロール値で GroupBy を実行できます。

前と同様に、API 呼び出しを行ってログイベントを書き込みます。

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

ログイベントが CloudWatch に送信されると、メトリックフィルターを必要とせずにメトリクスが抽出されます。これは、すべての異なるディメンションを使用して PutMetricData API 呼び出しを行うよりも、ログメッセージとしてこれらの値を書き込む方が簡単な場合に、高カーディナリティメトリクスを作成する優れた方法です。

### 全てをまとめる

最終的な main 関数は、次のように 3 つの API 呼び出しをすべて呼び出します。

```rust
#[::tokio::main]
async fn main() {
    println!("Let's have some fun by creating custom metrics with the Rust SDK");

    //select a random number 1-6 to represent a dicerolll
    let mut rng = rand::thread_rng();
    let roll_value = rng.gen_range(1..7);

    //call the put_metric_data function with the roll value
    println!("First we will write a custom metric with PutMetricData API call");
    put_metric_data(roll_value).await.unwrap();

    println!("Now let's write a log event, which we will then extract a custom metric from.");
    //call the put_log_data function with the roll value
    put_log_event(roll_value).await.unwrap();

    //call the put_log_emf function with the roll value
    println!("Now we will put a log event with embedded metric format to directly submit the custom metric.");
    put_log_event_emf(roll_value).await.unwrap();
}
```

テストデータを生成するために、アプリケーションをビルドし、ループで実行して CloudWatch で確認できるデータを生成できます。ルートディレクトリから次のコマンドを実行します。

```
cargo build
```

次に 50 回実行し、2 秒間スリープさせます。スリープは、メトリクスを少し間隔を空けて CloudWatch ダッシュボードで見やすくするためです。

```
for run in {1..50}; do ./target/debug/custom-metrics; sleep 2; done
```

これで CloudWatch で結果を確認できます。ディメンションでグループ化すると、各ロール値が選択された回数を確認できます。Metric Insights クエリは次のようになります。メトリクス名やディメンション名を変更した場合は、それに合わせて変更してください。

```
SELECT COUNT(roll_value_emf) FROM rust_custom_metrics GROUP BY roll_value_emf_dimension
```

これで 3 つ全てをダッシュボードに表示でき、予想通り同じグラフが表示されます。

![dashboard](./dashboard.png)

## クリーンアップ

`rust_custom` ロググループを削除してください。

```
aws logs delete-log-group --log-group-name rust_custom
```

# AWS Rust SDK を使用したカスタムメトリクスの作成

## はじめに

Rust は、安全性、パフォーマンス、並行性に焦点を当てたシステムプログラミング言語であり、ソフトウェア開発の世界で人気を集めています。メモリ管理とスレッドセーフティに対する独自のアプローチにより、堅牢で効率的なアプリケーションを構築するための魅力的な選択肢となっており、特にクラウドにおいて優れています。サーバーレスアーキテクチャの台頭と高性能でスケーラブルなサービスの必要性により、Rust の機能はクラウドネイティブアプリケーションの構築に最適な選択肢となっています。このガイドでは、AWS Rust SDK を活用してカスタム CloudWatch メトリクスを作成する方法を探り、AWS エコシステム内でアプリケーションのパフォーマンスと動作に関するより深い洞察を得られるようにします。

## 前提条件

このガイドを使用するには、Rust をインストールし、後で使用するデータの一部を保存するための CloudWatch ロググループとログストリームを作成する必要があります。

### Rust のインストール

Mac または Linux の場合：

```
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```

Windows では、[rustup-init.exe](https://static.rust-lang.org/rustup/dist/i686-pc-windows-gnu/rustup-init.exe) をダウンロードして実行します。

### CloudWatch ロググループとログストリームの作成

1. CloudWatch Log Group を作成します。

```
aws logs create-log-group --log-group-name rust_custom
```

2. CloudWatch Log Stream を作成します。

```
aws logs create-log-stream --log-group-name rust_custom --log-stream-name diceroll_log_stream
```

## コード

このリポジトリの sandbox セクションに完全なコードがあります。

```
git clone https://github.com/aws-observability/observability-best-practices.git
cd observability-best-practices/sandbox/rust-custom-metrics
```

このコードは、まずサイコロの出目をシミュレートします。この出目の値をカスタムメトリクスとして扱うことを想定します。次に、メトリクスを CloudWatch に追加してダッシュボードで表示する 3 つの異なる方法を示します。

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

この import ブロックでは、主に使用する AWS SDK ライブラリをインポートしています。また、ランダムなサイコロの値を作成できるように 'rand' クレートも取り込んでいます。最後に、SDK 呼び出しに入力するデータの作成を処理するために、'serde' や 'time' などのいくつかのライブラリを使用しています。

これで、main 関数内に diceroll 値を作成できます。この値は、実行する 3 つの AWS SDK 呼び出しすべてで使用されます。

```rust
//select a random number 1-6 to represent a diceroll
let mut rng = rand::thread_rng();
let roll_value = rng.gen_range(1..7);
```

diceroll の数値が得られたので、この値を CloudWatch のカスタムメトリクスとして追加する 3 つの異なる方法を見ていきましょう。値がカスタムメトリクスになると、その値にアラームを設定したり、異常検知を設定したり、ダッシュボードに値をプロットしたりする機能が利用できるようになります。

### メトリクスデータの送信

CloudWatch に値を追加するために使用する最初の方法は PutMetricData です。PutMetricData を使用することで、メトリクスの時系列値を CloudWatch に直接書き込みます。これが値を追加する最も効率的な方法です。PutMetricData を使用する場合、メトリクス値と共に、各 AWS SDK 呼び出しに名前空間とディメンションを提供する必要があります。以下がコードです。

まず、メトリクス（サイコロの値）を受け取り、Rust で成功または失敗を示す Result 型を返す関数を設定します。関数内で最初に行うのは、AWS Rust SDK クライアントの初期化です。クライアントは、ローカル環境から認証情報とリージョンを継承します。そのため、次のコマンドを実行して、これらが設定されていることを確認してください。 `aws configure` このコードを実行する前に、コマンドラインから実行してください。

```rust
async fn put_metric_data(roll_value: i32) -> Result<(), cloudwatch::Error> {
    //Create a reusable aws config that we can pass to our clients
    let config = aws_config::load_defaults(BehaviorVersion::v2023_11_09()).await;

    //Create a cloudwatch client
    let client = cloudwatch::Client::new(&config);
```

クライアントを初期化した後、PutMetricData API 呼び出しに必要な入力の設定を開始できます。ディメンションを定義し、次にディメンションと値の組み合わせである MetricDatum 自体を定義する必要があります。

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

最後に、前に定義した入力を使用して PutMetricData API 呼び出しを行うことができます。

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
SDK 呼び出しが非同期関数内にあることに注意してください。関数は非同期的に完了するため、次のことが必要です `await` 完了します。次に、関数のトップレベルで定義された Result 型を返します。

main から関数を呼び出すときは、次のようになります。

```rust
//call the put_metric_data function with the roll value
println!("First we will write a custom metric with PutMetricData API call");
put_metric_data(roll_value).await.unwrap();
```
再び、関数呼び出しが完了するのを待機してから、 `unwrap` 値を取得します。この例では 'Ok' の結果のみに関心があり、エラーには関心がないためです。本番環境のシナリオでは、おそらく異なる方法でエラー処理を行うことになるでしょう。

### PutLogEvent + Metric Filter

カスタムメトリクスを作成する次の方法は、単純に CloudWatch ロググループに書き込むことです。メトリクスが CloudWatch ロググループに記録されたら、[メトリクスフィルター](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/MonitoringPolicyExamples.html)を使用してログデータからメトリクスデータを抽出できます。

まず、ログメッセージ用の構造体を定義します。これはオプションであり、手動で json を構築することもできます。しかし、より複雑なアプリケーションでは、再利用性のためにこのロギング構造体が必要になる可能性があります。

```rust
//Make a simple struct for the log message. We could also just create a json string manually.
#[derive(Serialize)]
struct DicerollValue {
    welcome_message: String,
    roll_value: i32,
}
```

構造体を定義したら、AWS API 呼び出しを行う準備が整います。再び API クライアントを作成しますが、今回は logs SDK を使用します。また、Unix エポック時間を使用してシステム時間を定義します。

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

ログイベントが送信されたら、CloudWatch に移動して、ロググループのメトリクスフィルターを作成し、メトリクスを適切に抽出する必要があります。

CloudWatch コンソールで、作成した rust_custom ロググループに移動します。次に、メトリクスフィルターを作成します。フィルターパターンは次のようにする必要があります。 `{$.roll_value = *}` 。次に、Metric Value には `$.roll_value` 。任意の名前空間とメトリクス名を使用できます。このメトリクスフィルターは次のように説明できます。

「'roll_value' というフィールドを取得したら、値に関係なくフィルターをトリガーします。トリガーされたら、'roll_value' を CloudWatch Metrics に書き込む数値として使用します」。

このメトリクス作成方法は、ログフォーマットを制御できない場合にログデータから時系列値を抽出するのに非常に強力です。コードを直接計装しているため、ログデータのフォーマットを制御できます。そのため、より良い方法として CloudWatch Embedded Metric Format を使用することができます。これについては次のステップで説明します。

### PutLogEvent + Embedded Metric Format

CloudWatch [Embedded Metric Format](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch_Embedded_Metric_Format_Specification.html)(EMF) は、時系列メトリクスをログに直接埋め込む方法です。CloudWatch は、メトリクスフィルターを必要とせずにメトリクスを抽出します。コードを見てみましょう。

unix エポックでシステム時刻を取得するとともに、logs クライアントを再度作成します。

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

これで EMF JSON 文字列を作成できます。CloudWatch がカスタムメトリクスを作成するために必要なすべてのデータを含める必要があるため、名前空間、ディメンション、および値を文字列に埋め込みます。

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

ロール値からディメンションを実際に作成し、それを値としても使用していることに注目してください。これにより、ロール値に対して GroupBy を実行できるため、各ロール値が何回出たかを確認できます。

これで、以前と同じように API 呼び出しを行ってログイベントを書き込むことができます。

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

ログイベントが CloudWatch に送信されると、メトリクスフィルターを使用することなくメトリクスが抽出されます。これは、さまざまなディメンションを使用して PutMetricData API 呼び出しを行う代わりに、これらの値をログメッセージとして書き込む方が簡単な場合に、高カーディナリティメトリクスを作成する優れた方法です。

### すべてをまとめる

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

テストデータを生成するために、アプリケーションをビルドしてからループで実行し、CloudWatch で表示するデータを生成できます。ルートディレクトリから次のコマンドを実行します。

```
cargo build
```

次に、2 秒のスリープを入れて 50 回実行します。このスリープは、CloudWatch ダッシュボードで表示しやすくするために、メトリクスを少し間隔を空けて配置するためのものです。

```
for run in {1..50}; do ./target/debug/custom-metrics; sleep 2; done
```

これで CloudWatch で結果を確認できます。ディメンションで GroupBy を実行するのが好きです。これにより、各ロール値が選択された回数を確認できます。メトリクスインサイトクエリは次のようになります。何か変更した場合は、メトリクス名とディメンション名を変更してください。

```
SELECT COUNT(roll_value_emf) FROM rust_custom_metrics GROUP BY roll_value_emf_dimension
```

これで、3つすべてをダッシュボードに配置し、予想どおり同じグラフが表示されることを確認できます。

![dashboard](./dashboard.png)

## クリーンアップ

必ず削除してください `rust_custom` ログループ。

```
aws logs delete-log-group --log-group-name rust_custom
```
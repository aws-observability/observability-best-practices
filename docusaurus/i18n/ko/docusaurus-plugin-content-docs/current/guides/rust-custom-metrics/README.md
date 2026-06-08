# AWS Rust SDK로 커스텀 Metrics 생성하기

## 소개

Rust는 안전성, 성능, 동시성에 중점을 둔 시스템 프로그래밍 언어로, 소프트웨어 개발 분야에서 꾸준히 인기를 얻고 있습니다. 메모리 관리와 스레드 안전성에 대한 독특한 접근 방식 덕분에, 안정적이고 효율적인 애플리케이션을 구축하는 데 매력적인 선택지가 되고 있으며, 특히 클라우드 환경에서 그 강점이 두드러집니다. 서버리스 아키텍처가 확산되고 고성능·확장 가능한 서비스가 필요해지면서, Rust의 역량은 클라우드 네이티브 애플리케이션 구축에 탁월한 선택이 되었습니다. 이 가이드에서는 AWS Rust SDK를 활용하여 CloudWatch 커스텀 metrics를 생성하는 방법을 살펴봅니다. 이를 통해 AWS 에코시스템 내에서 애플리케이션의 성능과 동작에 대한 더 깊은 인사이트를 확보할 수 있습니다.

## 사전 준비 사항

이 가이드를 따라하려면 Rust를 설치하고, 이후 사용할 데이터를 저장할 CloudWatch log group과 log stream을 생성해야 합니다.

### Rust 설치

Mac 또는 Linux 환경:

```
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```

Windows 환경에서는 [rustup-init.exe](https://static.rust-lang.org/rustup/dist/i686-pc-windows-gnu/rustup-init.exe)를 다운로드하여 실행합니다.

### CloudWatch Log Group 및 Log Stream 생성

1. CloudWatch Log Group 생성:

```
aws logs create-log-group --log-group-name rust_custom
```

2. CloudWatch Log Stream 생성:

```
aws logs create-log-stream --log-group-name rust_custom --log-stream-name diceroll_log_stream
```

## 코드

전체 코드는 이 저장소의 sandbox 섹션에서 확인할 수 있습니다.

```
git clone https://github.com/aws-observability/observability-best-practices.git
cd observability-best-practices/sandbox/rust-custom-metrics
```

이 코드는 먼저 주사위 굴리기를 시뮬레이션합니다. 주사위 값을 커스텀 metric으로 사용한다고 가정하겠습니다. 그런 다음 이 metric을 CloudWatch에 추가하고 대시보드에서 확인하는 3가지 방법을 보여드리겠습니다.

### 애플리케이션 설정

먼저 애플리케이션에서 사용할 crate들을 import해야 합니다.

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

이 import 블록에서는 주로 사용할 AWS SDK 라이브러리를 가져옵니다. 랜덤 주사위 값을 생성하기 위해 'rand' crate도 포함합니다. 마지막으로 'serde'와 'time' 같은 라이브러리를 사용하여 SDK 호출에 필요한 데이터를 생성합니다.

이제 main 함수에서 주사위 값을 생성할 수 있습니다. 이 값은 이후 3가지 AWS SDK 호출 모두에서 사용됩니다.

```rust
//select a random number 1-6 to represent a diceroll
let mut rng = rand::thread_rng();
let roll_value = rng.gen_range(1..7);
```

주사위 값을 얻었으므로, 이제 이 값을 CloudWatch 커스텀 metric으로 추가하는 3가지 방법을 살펴보겠습니다. 값이 커스텀 metric으로 등록되면, 해당 값에 대해 알람 설정, 이상 탐지 구성, 대시보드에 시각화하는 등 다양한 기능을 활용할 수 있습니다.

### Put Metric Data

CloudWatch에 값을 추가하는 첫 번째 방법은 PutMetricData입니다. PutMetricData를 사용하면 metric의 시계열 값을 CloudWatch에 직접 기록합니다. 이것이 값을 추가하는 가장 효율적인 방법입니다. PutMetricData를 사용할 때는 metric 값과 함께 namespace, 그리고 각 AWS SDK 호출에 dimension을 함께 제공해야 합니다. 코드를 살펴보겠습니다:

먼저 metric(주사위 값)을 받아 Result 타입을 반환하는 함수를 설정합니다. Rust에서 Result는 성공 또는 실패를 나타냅니다. 함수 내에서 가장 먼저 하는 일은 AWS Rust SDK 클라이언트를 초기화하는 것입니다. 클라이언트는 로컬 환경에서 자격 증명과 리전을 상속받습니다. 따라서 이 코드를 실행하기 전에 커맨드 라인에서 `aws configure`를 실행하여 설정이 완료되어 있는지 확인하세요.

```rust
async fn put_metric_data(roll_value: i32) -> Result<(), cloudwatch::Error> {
    //Create a reusable aws config that we can pass to our clients
    let config = aws_config::load_defaults(BehaviorVersion::v2023_11_09()).await;

    //Create a cloudwatch client
    let client = cloudwatch::Client::new(&config);
```

클라이언트를 초기화한 후, PutMetricData API 호출에 필요한 입력값을 설정할 수 있습니다. dimension을 정의한 다음, dimension과 값을 조합한 MetricDatum 자체를 정의해야 합니다.

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

마지막으로 앞서 정의한 입력값을 사용하여 PutMetricData API 호출을 수행합니다.

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
SDK 호출이 async 함수 내에 있다는 점에 주목하세요. 함수가 비동기적으로 완료되므로, 완료될 때까지 `await`해야 합니다. 그런 다음 함수 최상위에 정의한 대로 Result 타입을 반환합니다.

main에서 함수를 호출할 때는 다음과 같이 작성합니다:

```rust
//call the put_metric_data function with the roll value
println!("First we will write a custom metric with PutMetricData API call");
put_metric_data(roll_value).await.unwrap();
```
여기서도 함수 호출이 완료될 때까지 await한 다음, 값을 `unwrap`합니다. 이 예제에서는 'Ok' 결과만 관심이 있고 에러는 처리하지 않기 때문입니다. 프로덕션 환경에서는 다른 방식으로 에러를 처리하는 것이 일반적입니다.

### PutLogEvent + Metric Filter

커스텀 metric을 생성하는 두 번째 방법은 값을 CloudWatch log group에 기록하는 것입니다. metric이 CloudWatch log group에 저장되면, [Metric Filter](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/MonitoringPolicyExamples.html)를 사용하여 로그 데이터에서 metric 데이터를 추출할 수 있습니다.

먼저 로그 메시지를 위한 struct를 정의합니다. JSON을 수동으로 만들 수도 있으므로 이 단계는 선택 사항이지만, 더 복잡한 애플리케이션에서는 재사용성을 위해 이러한 로깅 struct를 사용하는 것이 좋습니다.

```rust
//Make a simple struct for the log message. We could also just create a json string manually.
#[derive(Serialize)]
struct DicerollValue {
    welcome_message: String,
    roll_value: i32,
}
```

struct가 정의되면 AWS API 호출을 할 준비가 됩니다. 이번에는 logs SDK를 사용하여 API 클라이언트를 생성합니다. 또한 unix epoch 타이밍으로 시스템 시간을 정의합니다.

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

먼저 앞서 정의한 struct의 새 인스턴스로부터 JSON을 생성합니다. 그런 다음 이를 사용하여 log event를 만듭니다.

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

이제 PutMetricData와 유사한 방식으로 API 호출을 완료할 수 있습니다.

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

log event가 제출되면, CloudWatch에서 해당 log group에 대한 Metric Filter를 생성하여 metric을 올바르게 추출해야 합니다.

CloudWatch 콘솔에서 생성한 rust_custom log group으로 이동합니다. 그런 다음 metric filter를 생성합니다. 필터 패턴은 `{$.roll_value = *}`로 설정합니다. Metric Value에는 `$.roll_value`를 사용합니다. namespace와 metric 이름은 원하는 대로 설정할 수 있습니다. 이 Metric Filter는 다음과 같이 설명할 수 있습니다:

"'roll_value'라는 필드가 들어올 때마다, 값에 관계없이 필터를 트리거합니다. 트리거되면 'roll_value'를 CloudWatch Metrics에 기록할 숫자로 사용합니다."

이 방법은 로그 형식을 직접 제어할 수 없는 상황에서 로그 데이터로부터 시계열 값을 추출할 때 매우 유용합니다. 지금처럼 코드를 직접 계측하는 경우에는 로그 데이터 형식을 제어할 수 있으므로, 다음 단계에서 설명할 CloudWatch Embedded Metric Format을 사용하는 것이 더 나은 방법일 수 있습니다.

### PutLogEvent + Embedded Metric Format

CloudWatch [Embedded Metric Format](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch_Embedded_Metric_Format_Specification.html)(EMF)은 시계열 metrics를 로그에 직접 임베드하는 방식입니다. CloudWatch가 Metric Filter 없이도 자동으로 metrics를 추출합니다. 코드를 살펴보겠습니다.

다시 logs 클라이언트를 생성하고 unix epoch로 시스템 시간을 가져옵니다.

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

이제 EMF JSON 문자열을 생성합니다. CloudWatch가 커스텀 metric을 생성하는 데 필요한 모든 데이터를 포함해야 하므로, namespace, dimensions, 값을 문자열에 임베드합니다.

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

주사위 값을 dimension으로도 사용하고 metric 값으로도 사용하는 점에 주목하세요. 이렇게 하면 주사위 값에 대해 GroupBy를 수행하여 각 값이 몇 번 나왔는지 확인할 수 있습니다.

이제 이전과 같은 방식으로 API를 호출하여 log event를 기록합니다:

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

log event가 CloudWatch에 제출되면, metric filter 없이도 metric이 자동으로 추출됩니다. 이 방법은 다양한 dimension을 포함한 PutMetricData API 호출 대신 로그 메시지 형태로 값을 기록하는 것이 더 간편한 고카디널리티 metrics를 생성할 때 매우 유용합니다.

### 전체 코드 통합

최종 main 함수에서 세 가지 API 호출을 모두 수행하는 코드는 다음과 같습니다:

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

테스트 데이터를 생성하기 위해 애플리케이션을 빌드한 후 반복 실행하여 CloudWatch에서 확인할 데이터를 생성할 수 있습니다. 루트 디렉토리에서 다음을 실행합니다:

```
cargo build
```

이제 2초 간격으로 50회 실행합니다. 간격을 두는 이유는 metrics를 약간씩 분산시켜 CloudWatch Dashboard에서 보기 쉽게 하기 위함입니다.

```
for run in {1..50}; do ./target/debug/custom-metrics; sleep 2; done
```

이제 CloudWatch에서 결과를 확인할 수 있습니다. dimension에 대해 GroupBy를 수행하면 각 주사위 값이 몇 번 선택되었는지 확인할 수 있습니다. Metric Insights 쿼리는 다음과 같아야 합니다. metric 이름이나 dimension 이름을 변경한 경우 그에 맞게 수정하세요.

```
SELECT COUNT(roll_value_emf) FROM rust_custom_metrics GROUP BY roll_value_emf_dimension
```

이제 세 가지 방법 모두를 하나의 대시보드에 배치하면 예상대로 동일한 그래프를 확인할 수 있습니다.

![dashboard](./dashboard.png)

## 정리

`rust_custom` log group을 반드시 삭제하세요.

```
aws logs delete-log-group --log-group-name rust_custom
```

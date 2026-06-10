# AWS Rust SDK के साथ Custom Metrics बनाना

## परिचय

Rust, एक systems programming language जो safety, performance, और concurrency पर केंद्रित है, सॉफ्टवेयर विकास की दुनिया में लोकप्रियता हासिल कर रही है। memory management और thread safety के प्रति इसका अनूठा दृष्टिकोण इसे मजबूत और कुशल applications बनाने के लिए एक आकर्षक विकल्प बनाता है, विशेष रूप से क्लाउड में। serverless architectures के उदय और high-performance, scalable services की आवश्यकता के साथ, Rust की क्षमताएं इसे cloud-native applications बनाने के लिए एक उत्कृष्ट विकल्प बनाती हैं। इस गाइड में, हम AWS Rust SDK का उपयोग करके custom CloudWatch metrics बनाने का तरीका जानेंगे, जो आपको AWS ecosystem के भीतर अपने applications के प्रदर्शन और व्यवहार में गहरी अंतर्दृष्टि प्राप्त करने में सक्षम बनाता है।

## पूर्व-आवश्यकताएं

इस गाइड का उपयोग करने के लिए हमें Rust install करना होगा और एक CloudWatch log group और log stream भी बनाना होगा जिसमें हम बाद में उपयोग किया जाने वाला कुछ डेटा संग्रहीत करेंगे।

### Rust Install करना

Mac या Linux पर:

```
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```

Windows पर, [rustup-init.exe](https://static.rust-lang.org/rustup/dist/i686-pc-windows-gnu/rustup-init.exe) डाउनलोड करें और चलाएं

### CloudWatch Log Group और Log Stream बनाना

1. CloudWatch Log Group बनाएं:

```
aws logs create-log-group --log-group-name rust_custom
```

2. CloudWatch Log Stream बनाएं:

```
aws logs create-log-stream --log-group-name rust_custom --log-stream-name diceroll_log_stream
```

## कोड

आप इस repository के sandbox अनुभाग में पूरा कोड पा सकते हैं।

```
git clone https://github.com/aws-observability/observability-best-practices.git
cd observability-best-practices/sandbox/rust-custom-metrics
```

यह कोड पहले एक diceroll simulate करेगा, हम मान लेंगे कि हमें इस diceroll के value की custom metric के रूप में परवाह है। फिर हम CloudWatch में metric जोड़ने और dashboard पर देखने के 3 अलग-अलग तरीके दिखाएंगे।

### Application सेट अप करना

सबसे पहले हमें अपने application में उपयोग के लिए कुछ crates import करने होंगे।

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

इस import block में हम मुख्य रूप से aws sdk libraries import कर रहे हैं जिनका हम उपयोग करेंगे। हम 'rand' crate भी लाते हैं ताकि हम एक random diceroll value बना सकें। अंत में हमारे पास कुछ libraries हैं जैसे 'serde' और 'time' जो हमारे sdk calls को populate करने के लिए उपयोग किए जाने वाले कुछ data creation को handle करती हैं।

अब हम अपनी main function में अपना diceroll value बना सकते हैं, इस value का उपयोग हमारे सभी 3 AWS SDK calls द्वारा किया जाएगा।

```rust
//select a random number 1-6 to represent a diceroll
let mut rng = rand::thread_rng();
let roll_value = rng.gen_range(1..7);
```

अब जब हमारे पास diceroll नंबर है, आइए CloudWatch में value को custom metric के रूप में जोड़ने के 3 अलग-अलग तरीके देखें। एक बार value custom metric बन जाने के बाद हम value पर alarms सेट करने, anomaly detection सेट करने, dashboard पर value plot करने, और बहुत कुछ करने की क्षमता प्राप्त करते हैं।

### Put Metric Data

value को CloudWatch में जोड़ने के लिए हम जो पहला तरीका उपयोग करेंगे वह PutMetricData है। PutMetricData का उपयोग करके हम metric की time-series value सीधे CloudWatch में लिख रहे हैं। यह value जोड़ने का सबसे कुशल तरीका है। जब हम PutMetricData का उपयोग करते हैं तो हमें metric value के साथ namespace, और dimensions प्रत्येक AWS SDK call को प्रदान करने होते हैं। यहां कोड है:

सबसे पहले हम एक function सेट करेंगे जो हमारी metric (diceroll value) लेता है और यह Result type लौटाता है, जो Rust में सफलता या विफलता दर्शाता है। function के भीतर पहली चीज जो हम करते हैं वह है अपने AWS Rust SDK client को initialize करना। हमारा client local environment से credentials और region inherit करेगा। इसलिए इस कोड को चलाने से पहले अपनी command line से `aws configure` चलाकर सुनिश्चित करें कि ये configured हैं।

```rust
async fn put_metric_data(roll_value: i32) -> Result<(), cloudwatch::Error> {
    //Create a reusable aws config that we can pass to our clients
    let config = aws_config::load_defaults(BehaviorVersion::v2023_11_09()).await;

    //Create a cloudwatch client
    let client = cloudwatch::Client::new(&config);
```

अपने client को initialize करने के बाद हम अपने PutMetricData API call के लिए आवश्यक input सेट करना शुरू कर सकते हैं। हमें dimensions define करने होंगे और फिर MetricDatum स्वयं, जो dimensions और value का संयोजन है।

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

अंत में हम पहले define किए गए input का उपयोग करके PutMetricData API call कर सकते हैं।

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
ध्यान दें कि sdk call एक async function में है। चूंकि function asynchronously पूरा होता है, हमें इसके completion का `await` करना होगा। फिर हम अपने function के top level में define किए अनुसार Result type लौटाते हैं।

जब main से हमारे function को call करने का समय आता है तो यह ऐसा दिखेगा:

```rust
//call the put_metric_data function with the roll value
println!("First we will write a custom metric with PutMetricData API call");
put_metric_data(roll_value).await.unwrap();
```
फिर से हम function call के complete होने का await कर रहे हैं और फिर हम value को `unwrap` करते हैं क्योंकि हमारे मामले में हम केवल 'Ok' result में रुचि रखते हैं error में नहीं। production scenario में आप संभवतः error handle अलग तरीके से करेंगे।

### PutLogEvent + Metric Filter

custom metric बनाने का अगला तरीका इसे बस CloudWatch log group में लिखना है। एक बार metric CloudWatch log group में होने के बाद हम log data से metric data extract करने के लिए [Metric Filter](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/MonitoringPolicyExamples.html) का उपयोग कर सकते हैं।

सबसे पहले हम अपने log messages के लिए एक struct define करेंगे। यह optional है, क्योंकि हम बस manually json build कर सकते हैं। लेकिन अधिक complex application में आप re-usability के लिए संभवतः यह logging struct चाहेंगे।

```rust
//Make a simple struct for the log message. We could also just create a json string manually.
#[derive(Serialize)]
struct DicerollValue {
    welcome_message: String,
    roll_value: i32,
}
```

एक बार हमारा struct define हो जाने के बाद हम अपना AWS API call करने के लिए तैयार हैं। फिर से हम एक API client बनाएंगे, इस बार logs sdk का उपयोग करके। हम unix epoch timing का उपयोग करके system time भी define करेंगे।

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

सबसे पहले हम पहले define किए गए struct के एक नए instantiation से json बनाएंगे। फिर इसका उपयोग log event बनाने के लिए करें।

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

अब हम PutMetricData के साथ जो किया उसी तरह अपना API call पूरा कर सकते हैं

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

एक बार log event submit हो जाने के बाद, हमें CloudWatch में जाकर log group के लिए metric को ठीक से extract करने के लिए Metric Filter बनाना होगा।

CloudWatch console में हमारे द्वारा बनाए गए rust_custom log group पर जाएं। फिर एक metric filter बनाएं। filter pattern `{$.roll_value = *}` होना चाहिए। फिर Metric Value के लिए `$.roll_value` का उपयोग करें। आप कोई भी namespace और metric name उपयोग कर सकते हैं। इस Metric Filter को इस प्रकार समझाया जा सकता है:

"जब भी हमें 'roll_value' नामक field मिलता है, चाहे value कुछ भी हो, filter trigger करें। trigger होने पर, CloudWatch Metrics में लिखने के लिए number के रूप में 'roll_value' का उपयोग करें।"

metrics बनाने का यह तरीका log-data से time series values extract करने के लिए बहुत शक्तिशाली है जब आपके पास log formatting पर नियंत्रण नहीं होता। चूंकि हम सीधे code instrument कर रहे हैं, हमारे पास अपने log data के format पर नियंत्रण है, इसलिए एक बेहतर तरीका CloudWatch Embedded Metric Format का उपयोग करना हो सकता है, जिसे हम अगले चरण में चर्चा करेंगे।

### PutLogEvent + Embedded Metric Format

CloudWatch [Embedded Metric Format](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch_Embedded_Metric_Format_Specification.html)(EMF) आपके logs में सीधे time series metrics embed करने का एक तरीका है। CloudWatch फिर Metric Filters की आवश्यकता के बिना metrics extract करेगा। आइए कोड देखें।

system time के साथ फिर से एक logs client बनाएं unix epoch में।

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

अब हम अपनी EMF json string बना सकते हैं। इसमें CloudWatch को custom metric बनाने के लिए आवश्यक सभी data होना चाहिए, इसलिए हम string में namespace, dimensions, और value embed करते हैं।

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

ध्यान दें कि हम वास्तव में अपने roll value से एक dimension बनाते हैं साथ ही इसे value के रूप में उपयोग करते हैं। यह हमें roll value पर GroupBy करने की अनुमति देता है ताकि हम देख सकें कि प्रत्येक roll value कितनी बार आया।

अब हम पहले की तरह log event लिखने के लिए API call कर सकते हैं:

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

एक बार log event CloudWatch को submit हो जाने के बाद, metric बिना किसी metric filter की आवश्यकता के extract हो जाएगी। यह high-cardinality metrics बनाने का एक बढ़िया तरीका है जहां सभी विभिन्न dimensions के साथ PutMetricData API call करने की बजाय इन values को log messages के रूप में लिखना आसान हो सकता है।

### सब कुछ एक साथ रखना

हमारी अंतिम main function तीनों API calls को इस तरह call करेगी

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

कुछ test data generate करने के लिए, हम application build कर सकते हैं और फिर CloudWatch में देखने के लिए कुछ data generate करने के लिए इसे loop में चला सकते हैं। root directory से निम्नलिखित चलाएं

```
cargo build
```

अब हम इसे 2 second sleep के साथ 50 बार चलाएंगे। sleep बस metrics को थोड़ा space देने के लिए है ताकि उन्हें CloudWatch Dashboard में देखना आसान हो।

```
for run in {1..50}; do ./target/debug/custom-metrics; sleep 2; done
```

अब हम CloudWatch में परिणाम देख सकते हैं। मैं dimensions पर GroupBy करना पसंद करता हूं, यह मुझे देखने देता है कि प्रत्येक बार roll value कितनी बार चुना गया। metric insights query इस तरह दिखनी चाहिए। यदि आपने कुछ बदला है तो metric name और dimension name बदलें।

```
SELECT COUNT(roll_value_emf) FROM rust_custom_metrics GROUP BY roll_value_emf_dimension
```

अब हम तीनों को एक dashboard पर रख सकते हैं और अपेक्षानुसार एक ही graph देख सकते हैं।

![dashboard](./dashboard.png)

## Cleanup

अपना `rust_custom` log group delete करना सुनिश्चित करें।

```
aws logs delete-log-group --log-group-name rust_custom
```

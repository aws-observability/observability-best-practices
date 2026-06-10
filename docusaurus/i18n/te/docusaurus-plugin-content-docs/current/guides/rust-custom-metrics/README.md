# AWS Rust SDK తో Custom Metrics సృష్టించడం

## పరిచయం

Rust, safety, performance మరియు concurrency పై focus చేసే systems programming language, software development ప్రపంచంలో ఎక్కువగా ప్రాచుర్యం పొందుతోంది. Memory management మరియు thread safety కు దాని unique approach robust మరియు efficient applications build చేయడానికి ఆకర్షణీయమైన ఎంపికగా చేస్తుంది, ప్రత్యేకంగా cloud లో. Serverless architectures పెరుగుదల మరియు high-performance, scalable services అవసరంతో, Rust యొక్క capabilities cloud-native applications build చేయడానికి excellent ఎంపిగా చేస్తాయి. ఈ guide లో, AWS Rust SDK ను leverage చేసి custom CloudWatch metrics create చేయడం ఎలాగో explore చేస్తాము, AWS ecosystem లో మీ applications performance మరియు behavior లో deeper insights పొందడానికి enable చేస్తుంది.

## ముందస్తు అవసరాలు

ఈ guide ఉపయోగించడానికి Rust install చేయాలి మరియు తర్వాత ఉపయోగించే కొంత data store చేయడానికి CloudWatch log group మరియు log stream create చేయాలి.

### Rust Install చేయడం

Mac లేదా Linux లో:

```
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```

Windows లో, [rustup-init.exe](https://static.rust-lang.org/rustup/dist/i686-pc-windows-gnu/rustup-init.exe) download చేసి run చేయండి

### CloudWatch Log Group మరియు Log Stream Create చేయడం

1. CloudWatch Log Group create చేయండి:

```
aws logs create-log-group --log-group-name rust_custom
```

2. CloudWatch Log Stream create చేయండి:

```
aws logs create-log-stream --log-group-name rust_custom --log-stream-name diceroll_log_stream
```

## కోడ్

మీరు complete code ను ఈ repository యొక్క sandbox section లో కనుగొనవచ్చు.

```
git clone https://github.com/aws-observability/observability-best-practices.git
cd observability-best-practices/sandbox/rust-custom-metrics
```

ఈ code మొదట diceroll simulate చేస్తుంది, ఈ diceroll value custom metric గా మనకు important అని pretend చేస్తాము. తర్వాత metric ను CloudWatch కు add చేసి dashboard పై view చేయడానికి 3 వేర్వేరు మార్గాలు చూపిస్తాము.

### Application Setup చేయడం

మొదట మన application లో ఉపయోగించడానికి కొన్ని crates import చేయాలి.

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

ఈ import block లో ప్రధానంగా మనం ఉపయోగించే aws sdk libraries import చేస్తున్నాము. Random diceroll value create చేయడానికి 'rand' crate కూడా తెస్తున్నాము. చివరగా మన sdk calls populate చేయడానికి ఉపయోగించే data creation handle చేయడానికి 'serde' మరియు 'time' వంటి కొన్ని libraries ఉన్నాయి.

ఇప్పుడు మన main function లో diceroll value create చేయవచ్చు, ఈ value మనం చేసే అన్ని 3 AWS SDK calls ద్వారా ఉపయోగించబడుతుంది.

```rust
//select a random number 1-6 to represent a diceroll
let mut rng = rand::thread_rng();
let roll_value = rng.gen_range(1..7);
```

ఇప్పుడు మన diceroll number ఉంది, value ను CloudWatch కు custom metric గా add చేయడానికి 3 వేర్వేరు మార్గాలు explore చేద్దాం. Value custom metric అయిన తర్వాత value పై alarms set up చేయడం, anomaly detection set up చేయడం, value ను dashboard పై plot చేయడం మరియు చాలా ఎక్కువ చేయగల ability పొందుతాము.

### Put Metric Data

Value ను CloudWatch కు add చేయడానికి మనం ఉపయోగించే మొదటి method PutMetricData. PutMetricData ఉపయోగించడం ద్వారా metric యొక్క time-series value ను CloudWatch కు directly write చేస్తున్నాము. Value add చేయడానికి ఇది most efficient way. PutMetricData ఉపయోగించేటప్పుడు metric value తో పాటు ప్రతి AWS SDK call కు namespace, అలాగే dimensions provide చేయాలి. Code ఇక్కడ ఉంది:

మొదట మన metric (diceroll value) take in చేసి Result type return చేసే function set up చేస్తాము, ఇది Rust లో success లేదా failure indicate చేస్తుంది. Function లో మొదట చేసేది మన AWS Rust SDK client initialize చేయడం. మన client local environment నుండి credentials మరియు region inherit చేసుకుంటుంది. కాబట్టి ఈ code run చేయడానికి ముందు మీ command line నుండి `aws configure` run చేసి అవి configured అయ్యాయని ensure చేయండి.

```rust
async fn put_metric_data(roll_value: i32) -> Result<(), cloudwatch::Error> {
    //Create a reusable aws config that we can pass to our clients
    let config = aws_config::load_defaults(BehaviorVersion::v2023_11_09()).await;

    //Create a cloudwatch client
    let client = cloudwatch::Client::new(&config);
```

Client initialize చేసిన తర్వాత మన PutMetricData API call కోసం అవసరమైన input setup చేయడం start చేయవచ్చు. Dimensions define చేయాలి, తర్వాత MetricDatum itself, ఇది dimensions మరియు value combination.

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

చివరగా ముందు define చేసిన input ఉపయోగించి PutMetricData API call చేయవచ్చు.

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
Sdk call async function లో ఉందని గమనించండి. Function asynchronously complete అవుతుంది కాబట్టి, దాని completion `await` చేయాలి. తర్వాత మన function top level లో define చేసినట్లు Result type return చేస్తాము.

Main నుండి మన function call చేసేటప్పుడు ఇలా కనిపిస్తుంది:

```rust
//call the put_metric_data function with the roll value
println!("First we will write a custom metric with PutMetricData API call");
put_metric_data(roll_value).await.unwrap();
```
మళ్ళీ function call complete అవడానికి await చేస్తున్నాము మరియు తర్వాత value `unwrap` చేస్తున్నాము, మన case లో 'Ok' result లో మాత్రమే interested మరియు error లో కాదు. Production scenario లో మీరు likely different way లో error handle చేస్తారు.

### PutLogEvent + Metric Filter

Custom metric create చేయడానికి తదుపరి way దాన్ని CloudWatch log group కు simply write చేయడం. Metric CloudWatch log group లో ఉన్న తర్వాత log data నుండి metric data extract చేయడానికి [Metric Filter](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/MonitoringPolicyExamples.html) ఉపయోగించవచ్చు.

మొదట మన log messages కోసం struct define చేస్తాము. ఇది optional, manually json build చేయవచ్చు. కానీ more complex application లో re-usability కోసం ఈ logging struct likely అవసరం.

```rust
//Make a simple struct for the log message. We could also just create a json string manually.
#[derive(Serialize)]
struct DicerollValue {
    welcome_message: String,
    roll_value: i32,
}
```

Struct define అయిన తర్వాత AWS API call చేయడానికి ready. మళ్ళీ API client create చేస్తాము, ఈసారి logs sdk ఉపయోగించి. Unix epoch timing ఉపయోగించి system time కూడా define చేస్తాము.

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

మొదట ముందు define చేసిన struct యొక్క new instantiation నుండి json create చేస్తాము. తర్వాత దీన్ని log event create చేయడానికి ఉపయోగిస్తాము.

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

ఇప్పుడు PutMetricData తో చేసినట్లే API call complete చేయవచ్చు

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

Log event submit అయిన తర్వాత, metric properly extract చేయడానికి CloudWatch కు వెళ్ళి log group కోసం Metric Filter create చేయాలి.

CloudWatch console లో మనం create చేసిన rust_custom log group కు వెళ్ళండి. తర్వాత metric filter create చేయండి. Filter pattern `{$.roll_value = *}` ఉండాలి. తర్వాత Metric Value కోసం `$.roll_value` ఉపయోగించండి. మీకు నచ్చిన namespace మరియు metric name ఉపయోగించవచ్చు. ఈ Metric Filter ఇలా explain చేయవచ్చు:

"'roll_value' అనే field వచ్చినప్పుడల్లా filter trigger అవుతుంది, value ఏదైనా సరే. Trigger అయిన తర్వాత, CloudWatch Metrics కు write చేయడానికి number గా 'roll_value' ఉపయోగించండి".

Metrics create చేయడానికి ఈ way చాలా powerful, log formatting పై control లేనప్పుడు log-data నుండి time series values extract చేయడానికి. మనం directly code instrument చేస్తున్నాము కాబట్టి, మన log data format పై control ఉంది, అందువల్ల better method CloudWatch Embedded Metric Format ఉపయోగించడం కావచ్చు, దీన్ని తదుపరి step లో discuss చేస్తాము.

### PutLogEvent + Embedded Metric Format

CloudWatch [Embedded Metric Format](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch_Embedded_Metric_Format_Specification.html)(EMF) అనేది మీ logs లో time series metrics directly embed చేయడానికి ఒక way. CloudWatch తర్వాత Metric Filters అవసరం లేకుండా metrics extract చేస్తుంది. Code చూద్దాం.

Unix epoch లో system time grab చేస్తూ logs client మళ్ళీ create చేయండి.

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

ఇప్పుడు మన EMF json string create చేయవచ్చు. CloudWatch custom metric create చేయడానికి అవసరమైన అన్ని data ఇందులో ఉండాలి, కాబట్టి namespace, dimensions మరియు value string లో embed చేస్తాము.

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

మన roll value ను dimension గా కూడా create చేస్తూ value కోసం కూడా ఉపయోగిస్తున్నామని గమనించండి. ఇది ప్రతి roll value ఎన్నిసార్లు land అయ్యిందో చూడడానికి roll value పై GroupBy perform చేయడానికి అనుమతిస్తుంది.

ఇప్పుడు ముందు చేసినట్లే log event write చేయడానికి API call చేయవచ్చు:

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

Log event CloudWatch కు submit అయిన తర్వాత, metric filter అవసరం లేకుండా metric extract అవుతుంది. అన్ని different dimensions తో PutMetricData API call చేయడం కంటే log messages గా ఈ values write చేయడం easier అయ్యే high-cardinality metrics create చేయడానికి ఇది great way.

### అన్నింటినీ కలపడం

మన final main function అన్ని మూడు API calls ఇలా call చేస్తుంది

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

Test data generate చేయడానికి, application build చేసి CloudWatch లో view చేయడానికి data generate చేయడానికి loop లో run చేయవచ్చు. Root directory నుండి క్రింది run చేయండి

```
cargo build
```

ఇప్పుడు 2 second sleep తో 50 సార్లు run చేస్తాము. Sleep CloudWatch Dashboard లో view చేయడానికి easier గా చేయడానికి metrics ను కొంచెం space out చేయడానికి.

```
for run in {1..50}; do ./target/debug/custom-metrics; sleep 2; done
```

ఇప్పుడు CloudWatch లో results review చేయవచ్చు. Dimensions పై GroupBy చేయడం నాకు ఇష్టం, ఇది ప్రతిసారి roll value ఎన్నిసార్లు selected అయ్యిందో చూడడానికి అనుమతిస్తుంది. Metric insights query ఇలా కనిపించాలి. Metric name మరియు dimension name ఏదైనా change చేస్తే accordingly మార్చండి.

```
SELECT COUNT(roll_value_emf) FROM rust_custom_metrics GROUP BY roll_value_emf_dimension
```

ఇప్పుడు మూడింటినీ dashboard పై పెట్టి expected గా same graph చూడవచ్చు.

![dashboard](./dashboard.png)

## Cleanup

మీ `rust_custom` log group delete చేయడం ensure చేయండి.

```
aws logs delete-log-group --log-group-name rust_custom
```

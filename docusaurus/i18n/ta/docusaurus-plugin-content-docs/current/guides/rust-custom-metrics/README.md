# AWS Rust SDK உடன் தனிப்பயன் மெட்ரிக்குகளை உருவாக்குதல்

## அறிமுகம்

Rust, பாதுகாப்பு, செயல்திறன் மற்றும் ஒருங்கிணைவில் கவனம் செலுத்தும் ஒரு systems programming மொழி, மென்பொருள் மேம்பாட்டு உலகில் பிரபலமடைந்து வருகிறது. நினைவக மேலாண்மை மற்றும் thread safety க்கான அதன் தனிப்பட்ட அணுகுமுறை, வலுவான மற்றும் திறமையான பயன்பாடுகளை உருவாக்க ஒரு கவர்ச்சிகரமான தேர்வாக ஆக்குகிறது, குறிப்பாக கிளவுட்டில். Serverless architectures இன் எழுச்சி மற்றும் உயர்-செயல்திறன், அளவிடக்கூடிய சேவைகளின் தேவையுடன், Rust இன் திறன்கள் cloud-native பயன்பாடுகளை உருவாக்குவதற்கு ஒரு சிறந்த தேர்வாக ஆக்குகின்றன. இந்த வழிகாட்டியில், AWS சூழலத்தில் உங்கள் பயன்பாடுகளின் செயல்திறன் மற்றும் நடத்தை குறித்த ஆழமான நுண்ணறிவுகளைப் பெற தனிப்பயன் CloudWatch மெட்ரிக்குகளை உருவாக்க AWS Rust SDK ஐ எவ்வாறு பயன்படுத்துவது என்பதை ஆராய்வோம்.

## முன்நிபந்தனைகள்

இந்த வழிகாட்டியை பயன்படுத்த Rust ஐ நிறுவ வேண்டும் மற்றும் பின்னர் நாம் பயன்படுத்தும் சில தரவை சேமிக்க ஒரு CloudWatch log group மற்றும் log stream ஐ உருவாக்க வேண்டும்.

### Rust ஐ நிறுவுதல்

Mac அல்லது Linux இல்:

```
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```

Windows இல், [rustup-init.exe](https://static.rust-lang.org/rustup/dist/i686-pc-windows-gnu/rustup-init.exe) ஐ பதிவிறக்கி இயக்கவும்

### CloudWatch Log Group மற்றும் Log Stream உருவாக்குதல்

1. CloudWatch Log Group ஐ உருவாக்கவும்:

```
aws logs create-log-group --log-group-name rust_custom
```

2. CloudWatch Log Stream ஐ உருவாக்கவும்:

```
aws logs create-log-stream --log-group-name rust_custom --log-stream-name diceroll_log_stream
```

## குறியீடு

முழு குறியீட்டை இந்த repository இன் sandbox பிரிவில் காணலாம்.

```
git clone https://github.com/aws-observability/observability-best-practices.git
cd observability-best-practices/sandbox/rust-custom-metrics
```

இந்த குறியீடு முதலில் ஒரு diceroll ஐ simulate செய்யும், இந்த diceroll இன் மதிப்பை தனிப்பயன் மெட்ரிக்காக கருதுவோம். பின்னர் CloudWatch க்கு மெட்ரிக்கை சேர்ப்பதற்கும் டாஷ்போர்டில் பார்ப்பதற்கும் 3 வெவ்வேறு வழிகளை காண்பிப்போம்.

### பயன்பாட்டை அமைத்தல்

முதலில் நம் பயன்பாட்டில் பயன்படுத்த சில crates ஐ import செய்ய வேண்டும்.

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

இந்த import block இல் முக்கியமாக நாம் பயன்படுத்தும் aws sdk libraries ஐ import செய்கிறோம். ஒரு random diceroll மதிப்பை உருவாக்க 'rand' crate ஐயும் கொண்டு வருகிறோம். இறுதியாக நம் sdk calls ஐ நிரப்பும் சில தரவு உருவாக்கத்தை கையாள 'serde' மற்றும் 'time' போன்ற சில libraries உள்ளன.

இப்போது நம் main function இல் diceroll மதிப்பை உருவாக்கலாம், இந்த மதிப்பு நாம் செய்யும் அனைத்து 3 AWS SDK calls ஆலும் பயன்படுத்தப்படும்.

```rust
//select a random number 1-6 to represent a diceroll
let mut rng = rand::thread_rng();
let roll_value = rng.gen_range(1..7);
```

இப்போது நம் diceroll எண் கிடைத்துள்ளது, CloudWatch க்கு மதிப்பை தனிப்பயன் மெட்ரிக்காக சேர்ப்பதற்கான 3 வெவ்வேறு வழிகளை ஆராய்வோம். மதிப்பு தனிப்பயன் மெட்ரிக்காக மாறியவுடன் alarms அமைக்கவும், anomaly detection அமைக்கவும், dashboard இல் மதிப்பை plot செய்யவும் மற்றும் பலவற்றை செய்யும் திறனைப் பெறுவோம்.

### Put Metric Data

CloudWatch க்கு மதிப்பை சேர்ப்பதற்கான முதல் முறை PutMetricData ஆகும். PutMetricData ஐ பயன்படுத்துவதன் மூலம் மெட்ரிக்கின் time-series மதிப்பை நேரடியாக CloudWatch க்கு எழுதுகிறோம். இது மதிப்பை சேர்ப்பதற்கான மிகவும் திறமையான வழியாகும். PutMetricData ஐ பயன்படுத்தும்போது namespace, அத்துடன் எந்த dimensions ஐயும் மெட்ரிக் மதிப்புடன் ஒவ்வொரு AWS SDK call க்கும் வழங்க வேண்டும்.

```rust
async fn put_metric_data(roll_value: i32) -> Result<(), cloudwatch::Error> {
    let config = aws_config::load_defaults(BehaviorVersion::v2023_11_09()).await;
    let client = cloudwatch::Client::new(&config);
```

```rust
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

### PutLogEvent + Metric Filter

தனிப்பயன் மெட்ரிக்கை உருவாக்குவதற்கான அடுத்த வழி CloudWatch log group க்கு எழுதுவதாகும். மெட்ரிக் CloudWatch log group இல் இருந்தவுடன் log data இலிருந்து மெட்ரிக் data ஐ பிரித்தெடுக்க ஒரு [Metric Filter](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/MonitoringPolicyExamples.html) ஐ பயன்படுத்தலாம்.

```rust
#[derive(Serialize)]
struct DicerollValue {
    welcome_message: String,
    roll_value: i32,
}
```

CloudWatch console இல் rust_custom log group க்கு சென்று Metric Filter ஐ உருவாக்கவும். Filter pattern `{$.roll_value = *}` ஆக இருக்க வேண்டும். Metric Value க்கு `$.roll_value` ஐ பயன்படுத்தவும்.

### PutLogEvent + Embedded Metric Format

CloudWatch [Embedded Metric Format](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch_Embedded_Metric_Format_Specification.html)(EMF) உங்கள் logs இல் நேரடியாக time series metrics ஐ உட்பொதிக்கும் ஒரு வழியாகும். Metric Filters தேவையில்லாமல் CloudWatch மெட்ரிக்குகளை பிரித்தெடுக்கும்.

```rust
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

### அனைத்தையும் ஒன்றிணைத்தல்

நம் இறுதி main function மூன்று API calls ஐயும் இவ்வாறு அழைக்கும்

```rust
#[::tokio::main]
async fn main() {
    println!("Let's have some fun by creating custom metrics with the Rust SDK");

    let mut rng = rand::thread_rng();
    let roll_value = rng.gen_range(1..7);

    println!("First we will write a custom metric with PutMetricData API call");
    put_metric_data(roll_value).await.unwrap();

    println!("Now let's write a log event, which we will then extract a custom metric from.");
    put_log_event(roll_value).await.unwrap();

    println!("Now we will put a log event with embedded metric format to directly submit the custom metric.");
    put_log_event_emf(roll_value).await.unwrap();
}
```

சோதனை தரவை உருவாக்க, பயன்பாட்டை build செய்து CloudWatch இல் பார்க்க சில தரவை உருவாக்க loop இல் இயக்கலாம். Root directory இலிருந்து பின்வருவனவற்றை இயக்கவும்

```
cargo build
```

இப்போது 2 வினாடி sleep உடன் 50 முறை இயக்குவோம்.

```
for run in {1..50}; do ./target/debug/custom-metrics; sleep 2; done
```

இப்போது CloudWatch இல் முடிவுகளை மதிப்பாய்வு செய்யலாம். Dimensions இல் GroupBy செய்வது நல்லது, இது ஒவ்வொரு roll value எத்தனை முறை தேர்ந்தெடுக்கப்பட்டது என்பதைப் பார்க்க உதவுகிறது. Metric insights query இவ்வாறு இருக்க வேண்டும்.

```
SELECT COUNT(roll_value_emf) FROM rust_custom_metrics GROUP BY roll_value_emf_dimension
```

இப்போது மூன்றையும் ஒரு dashboard இல் வைத்து எதிர்பார்த்தபடி அதே graph ஐ பார்க்கலாம்.

![dashboard](./dashboard.png)

## சுத்தம் செய்தல்

உங்கள் `rust_custom` log group ஐ நீக்குவதை உறுதிசெய்யவும்.

```
aws logs delete-log-group --log-group-name rust_custom
```

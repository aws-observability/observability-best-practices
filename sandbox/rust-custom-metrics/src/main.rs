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

//CloudWatch Put Metric Data Example

async fn put_metric_data(roll_value: i32) -> Result<(), cloudwatch::Error> {
    //Create a reusable aws config that we can pass to our clients
    let config = aws_config::load_defaults(BehaviorVersion::v2023_11_09()).await;

    //Create a cloudwatch client
    let client = cloudwatch::Client::new(&config);

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

    //Create PMD call, return the future to the main thread for execution.
    let response = client
        .put_metric_data()
        .namespace("rust_custom_metrics")
        .metric_data(put_metric_data_input)
        .send()
        .await?;
    println!("Metric Submitted: {:?}", response);
    Ok(())
}

//CloudWatch PutLogEvent Example

//Make a simple struct for the log message. We could also just create a json string manually.
#[derive(Serialize)]
struct DicerollValue {
    welcome_message: String,
    roll_value: i32,
}

async fn put_log_event(roll_value: i32) -> Result<(), cloudwatchlogs::Error> {
    //Create a reusable aws config that we can pass to our clients
    let config = aws_config::load_defaults(BehaviorVersion::v2023_11_09()).await;

    //Create a cloudwatch logs client
    let client = cloudwatchlogs::Client::new(&config);

    //Let's get the time in ms from unix epoch, this is required for CWlogs
    let time_now = SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .unwrap()
        .as_millis() as i64;

    let log_json = json!(DicerollValue {
        welcome_message: String::from("Hello from rust!"),
        roll_value
    });

    let log_event = InputLogEvent::builder()
        .timestamp(time_now)
        .message(log_json.to_string())
        .build();

    let response = client
        .put_log_events()
        .log_group_name("rust_custom")
        .log_stream_name("diceroll_log_stream")
        .log_events(log_event.unwrap())
        .send()
        .await?;

    println!("Log event submitted: {:?}", response);
    Ok(())
}

//CloudWatch Put Log Event with EMF example.

async fn put_log_event_emf(roll_value: i32) -> Result<(), cloudwatchlogs::Error> {
    //Create a reusable aws config that we can pass to our clients
    let config = aws_config::load_defaults(BehaviorVersion::v2023_11_09()).await;

    //Create a cloudwatch logs client
    let client = cloudwatchlogs::Client::new(&config);

    //get the time in unix epoch ms
    let time_now = SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .unwrap()
        .as_millis() as i64;

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
}

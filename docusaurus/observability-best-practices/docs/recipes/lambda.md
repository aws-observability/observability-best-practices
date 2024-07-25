# AWS Lambda

[AWS Lambda][lambda-main] is a serverless compute service that lets you run
code without provisioning or managing servers, creating workload-aware cluster 
scaling logic, maintaining event integrations, or managing runtimes.

Check out the following recipes:

## Logs

- [Deploy and Monitor a Serverless Application][aes-ws]

## Metrics

- [Introducing CloudWatch Lambda Insights][lambda-cwi]
- [Exporting Cloudwatch Metric Streams via Firehose and AWS Lambda to Amazon Managed Service for Prometheus](recipes/lambda-cw-metrics-go-amp.md)

## Traces

- [Auto-instrumenting a Python application with an AWS Distro for OpenTelemetry Lambda layer][lambda-layer-python-xray-adot]
- [Tracing AWS Lambda functions in AWS X-Ray with OpenTelemetry][lambda-xray-adot]

[lambda-main]: https://aws.amazon.com/lambda/
[aes-ws]: https://bookstore.aesworkshops.com/
[lambda-cwi]: https://aws.amazon.com/blogs/mt/introducing-cloudwatch-lambda-insights/
[lambda-xray-adot]: https://aws.amazon.com/blogs/opensource/tracing-aws-lambda-functions-in-aws-x-ray-with-opentelemetry/
[lambda-layer-python-xray-adot]: https://aws.amazon.com/blogs/opensource/auto-instrumenting-a-python-application-with-an-aws-distro-for-opentelemetry-lambda-layer/

# AWS App Runner

[AWS App Runner][apprunner-main] is a fully managed service that makes it easy for developers to quickly deploy containerized web applications and APIs, at scale and with no prior infrastructure experience required. Start with your source code or a container image. App Runner builds and deploys the web application automatically, load balances traffic with encryption, scales to meet your traffic needs, and makes it easy for your services to communicate with other AWS services and applications that run in a private Amazon VPC. With App Runner, rather than thinking about servers or scaling, you have more time to focus on your applications.




Check out the following recipes:

## General
- [Container Day - Docker Con | How Developers can get to production web applications at scale easily](https://www.youtube.com/watch?v=Iyp9Ugk9oRs)
- [AWS Blog | Centralized observability for AWS App Runner services](https://aws.amazon.com/blogs/containers/centralized-observability-for-aws-app-runner-services/)
- [AWS Blog | Observability for AWS App Runner VPC networking](https://aws.amazon.com/blogs/containers/observability-for-aws-app-runner-vpc-networking/)
- [AWS Blog | Controlling and monitoring AWS App Runner applications with Amazon EventBridge](https://aws.amazon.com/blogs/containers/controlling-and-monitoring-aws-app-runner-applications-with-amazon-eventbridge/)


## Logs

- [Viewing App Runner logs streamed to CloudWatch Logs][apprunner-cwl]

## Metrics

- [Viewing App Runner service metrics reported to CloudWatch](apprunner-cwm)


## Traces
- [Getting Started with AWS X-Ray tracing for App Runner using AWS Distro for OpenTelemetry](https://aws-otel.github.io/docs/getting-started/apprunner)
- [Containers from the Couch | AWS App Runner X-Ray Integration](https://youtu.be/cVr8N7enCMM)
- [AWS Blog | Tracing an AWS App Runner service using AWS X-Ray with OpenTelemetry](https://aws.amazon.com/blogs/containers/tracing-an-aws-app-runner-service-using-aws-x-ray-with-opentelemetry/)
- [AWS Blog | Enabling AWS X-Ray tracing for AWS App Runner service using AWS Copilot CLI](https://aws.amazon.com/blogs/containers/enabling-aws-x-ray-tracing-for-aws-app-runner-service-using-aws-copilot-cli/)

[apprunner-main]: https://aws.amazon.com/apprunner/
[aes-ws]: https://bookstore.aesworkshops.com/
[apprunner-cwl]: https://docs.aws.amazon.com/apprunner/latest/dg/monitor-cwl.html
[apprunner-cwm]: https://docs.aws.amazon.com/apprunner/latest/dg/monitor-cw.html

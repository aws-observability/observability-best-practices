# AWS X-Ray - FAQ

**Does AWS Distro for Open Telemetry (ADOT) support trace propagation across AWS services such as Event Bridge or SQS?**

Technically, that’s not ADOT but AWS X-Ray. We are working on expanding the number and types of AWS services that propagate and/or generate spans. If you have a use case depending on this, please reach out to us.

**Will I be able to use the W3C trace header to ingest spans into AWS X-Ray using ADOT?**

Yes, later in 2023. We’re working on supporting W3C trace context propagation. 

**Can I trace requests across Lambda functions when SQS is involved in the middle?**

Yes. X-Ray now supports tracing across Lambda functions when SQS is involved in the middle. Traces from upstream message producers are [automatically linked to traces](https://docs.aws.amazon.com/xray/latest/devguide/xray-services-sqs.html) from downstream Lambda consumer nodes, creating an end-to-end view of the application.

**Should I use X-Ray SDK or the OTel SDK to instrument my application?**

OTel offers more features than the X-Ray SDK, but to choose which one is right for your use case see [Choosing between ADOT and X-Ray SDK](https://docs.aws.amazon.com/xray/latest/devguide/xray-instrumenting-your-app.html#xray-instrumenting-choosing)

**Are [span events](https://opentelemetry.io/docs/instrumentation/ruby/manual/#add-span-events) supported in AWS X-Ray?**

Span events do not fit into the X-Ray model and are hence dropped.

**How can I extract data out of AWS X-Ray?**

You can retrieve Service Graph, Traces and Root cause analytics data [using X-Ray APIs](https://docs.aws.amazon.com/xray/latest/devguide/xray-api-gettingdata.html).

**Can I achieve 100% sampling? That is, I want all traces to be recorded without sampling at all.**

You can adjust the sampling rules to capture significantly increased amount of trace data. As long as the total segments sent do not breach the [service quota limits mentioned here](https://docs.aws.amazon.com/general/latest/gr/xray.html#limits_xray), X-Ray will make an effort to collect data as configured. There is no guarantee that this will result in 100% trace data capture as a result.

**Can I dynamically increase or decrease sampling rules through APIs?**

Yes, you can use the [X-Ray sampling APIs](https://docs.aws.amazon.com/xray/latest/devguide/xray-api-sampling.html) to make adjustments dynamically as necessary. See this [blog for a use-case based explanation](https://aws.amazon.com/blogs/mt/dynamically-adjusting-x-ray-sampling-rules/).

**Product FAQ:** [https://aws.amazon.com/xray/faqs/](https://aws.amazon.com/xray/faqs/)


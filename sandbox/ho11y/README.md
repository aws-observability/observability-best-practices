# ho11y

Hello and welcome to `ho11y` (pronounced: howl-y), a synthetic signal generator
allowing you to test observability solutions for microservices. It emits logs,
metrics, and traces in a configurable manner.

Contents:

* [Overview](#overview)
* [Signals](#signals)
* [Configuration](#configuration)

----

## Overview

`ho11y` emits and exposes signals as follows:

* Logs in JSON format, using [Logrus](https://github.com/sirupsen/logrus).
* Metrics using the [Prometheus Go client library](https://github.com/prometheus/client_golang).
* Traces using OpenTelemetry, with the [ADOT Go SDK](https://aws-otel.github.io/docs/getting-started/go-sdk).

In a nutshell, this is what you get with `ho11y`: invoke at `/` and optionally
up to five downstreams that are invoked:

```
               main service path at '/'

                        :8765
                          |
                          |
                  +-------+-------+
                  |               |
        :55680----+               +----:8765
                  |   h o 1 1 y   |
OTLP interface    |               |    OM exposition at '/metrics'
                  |               |
                  +-+--+--+--+--+-+
                    |  |  |  |  |
                    |  |  |  |  |
                    v  v  v  v  v
                    D0 D1 D2 D3 D4

                     downstreams
```

To use `ho11y`, build the binary with `go build .` and launch it then as follows:

```
$ ./ho11y
{"level":"info","msg":"Using OTLP endpoint: 0.0.0.0:55680","time":"2021-04-26T18:07:31+01:00"}
{"level":"info","msg":"Init instrumentation done","time":"2021-04-26T18:07:31+01:00"}
{"level":"info","msg":"Launching ho11y, listening on :8765","time":"2021-04-26T18:07:31+01:00"}
{"event":"invoke","level":"info","msg":"ho11y was invoked by [::1]:62421","time":"2021-04-26T18:07:43+01:00"}
```

With `ho11y` running, you can now invoke it as follows:

```
$ curl http://localhost:8765/
{"traceId":"1-6086f35f-fdb81d0f3235709c09a86978"}
```

Every time you hit the root URL, that's path (`/`), you trigger signals as described 
below in greater detail. Note that logs and traces are pushed and metrics are
pulled (or: scraped).


You can also run `ho11y` as a container:

```
docker build . -t ho11y:stable

docker run --name ho11y --rm -p 8765:8765 ho11y:stable
```

## Signals

Currently, we support the three major signal types: logs, metrics, and traces.

### Logs

Whenever `ho11y` is invoked, a log message of the following form is written
to `stdout`:

```json
{
  "event": "invoke",
  "level": "info",
  "msg": "ho11y was invoked by [::1]:56993",
  "time": "2021-04-26T12:12:01+01:00"
}
```

### Metrics

We expose a number of metrics in `ho11y` via the `/metrics` enpoint, making it 
convenient to scrape it from Prometheus. There are two types of metrics:

1. Request-based: `ho11y_total`, `ho11y_downstream_payload_bytes`, and 
   `ho11y_downstream_duration_seconds`, which you can directly influence by
   invoking the service.
1. Random: `ho11y_randval` and `ho11y_randhist`, which are automatically filled.

Let's have a closer look at all of them now and show how you can consume them
with [PromQL](https://prometheus.io/docs/prometheus/latest/querying/basics/).
If you're not familiar with Prometheus, consider checking out a quick 
[introduction to it](https://github.com/yolossn/Prometheus-Basics).

#### Request-based metrics

To see the overall number of invokes, that is, the metric `ho11y_total` of 
type counter, use the following PromQL statement:

```
rate(ho11y_total[1m])
```

In addition, we have instrumented `ho11y` with two further metrics that provide
information about the downstreams invocations: `ho11y_downstream_payload_bytes`
is a summary that captures the HTTP body size received from a downstream and
`ho11y_downstream_duration_seconds` is a histogram that represents the duration
taken for invoking a downstream. 

You can use the following PromQL statements for those:

```
# average of the downstream payloads over the past 10 minutes:
sum(rate(ho11y_downstream_payload_bytes_sum[10m])) 
/
sum(rate(ho11y_downstream_payload_bytes_count[10m]))

# histogram of downstream invoke durations:
ho11y_downstream_duration_seconds_bucket
```

#### Random metrics

To see a random value, that is, the metric `ho11y_randval` of type gauge, use the
following PromQL statement:

```
ho11y_randval
```

To see a random histogram, that is, the metric `ho11y_randhist` of type histogram,
use the following PromQL statements:

```
rate(ho11y_randhist_sum[1m])
/
rate(ho11y_randhist_count[1m])
```

As well as:

```
histogram_quantile(0.8, sum(rate(ho11y_randhist_bucket[1m])) by (le))
```

### Traces

In `ho11y` we're using the [ADOT collector](https://aws-otel.github.io/docs/getting-started/collector)
with the X-Ray exporter defaults. In order to use tracing in a local setup,
you need to run the ADOT collector somewhere, for example, using Docker:

```
docker run -d -p 55680:55680 \
           --rm --name adot-collector \
           -e AWS_REGION="eu-west-1" \
           -e AWS_ACCESS_KEY_ID="XXXXXXXXXXXXXXXX" \
           -e AWS_SECRET_ACCESS_KEY="XXXXXXXXXXXXXXXX" \
           public.ecr.aws/aws-observability/aws-otel-collector:latest
```

Note to replace the credentials `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY`
with your own.

On invoke, you will find traces akin to the following emitted:

```json
{
    "Id": "1-6086f9bc-7552c97e8b3ef57f25f94346",
    "Duration": 0.001,
    "LimitExceeded": false,
    "Segments": [
        {
            "Id": "9fa75c93b73f980b",
            "Document": {
                "id": "9fa75c93b73f980b",
                "name": "ho11y-svc",
                "start_time": 1619458492.3810492,
                "trace_id": "1-6086f9bc-7552c97e8b3ef57f25f94346",
                "end_time": 1619458492.382217,
                "fault": false,
                "error": false,
                "http": {
                    "request": {
                        "url": "http://192.168.178.23:8765/metrics",
                        "method": "GET",
                        "user_agent": "Prometheus/2.21.0",
                        "client_ip": "192.168.178.23"
                    },
                    "response": {
                        "status": 200,
                        "content_length": 0
                    }
                },
                "aws": {
                    "xray": {
                        "auto_instrumentation": false,
                        "sdk_version": "0.18.0",
                        "sdk": "opentelemetry for go"
                    }
                },
                "metadata": {
                    "default": {
                        "otel.resource.telemetry.sdk.name": "opentelemetry",
                        "net.transport": "IP.TCP",
                        "http.flavor": "1.1",
                        "http.route": "/metrics",
                        "net.host.port": "",
                        "otel.resource.host.name": "xxx.amazon.com",
                        "otel.resource.service.name": "ho11y-svc",
                        "otel.resource.telemetry.sdk.language": "go",
                        "net.host.ip": "192.168.178.23",
                        "otel.resource.telemetry.sdk.version": "0.18.0"
                    }
                }
            }
        }
    ]
}
```

OK, enough of the signals that `ho11y` emits, let's move on how you can 
adapt it to your needs.

## Configuration

In the following we review the `ho11y` configuration options, all of them have
to be provided via environment variables. This is mainly to make the
configuration straightforward in container orchestrators such as Kubernetes,
using YAML or the like.

### Failure injection

To simulate dropped requests, you can enable failure injection. Set the
`HO11Y_INJECT_FAILURE` to a value (it does not matter which value you provide,
it's a boolean flag for now, everything counts as long as it's not the empty
string) and `ho11y` will drop, in average, half of the requests. This means,
half of the time returning an `200` HTTP status code and the other half
returning one of the 3x, 4x, or 5x HTTP status codes.

For example:

```
$ HO11Y_INJECT_FAILURE=enabled
$ ./ho11y
{"level":"info","msg":"Failure injection enabled, dropping half of the requests","time":"2021-04-28T11:31:38+01:00"}
{"level":"info","msg":"Using OTLP endpoint: 0.0.0.0:55680","time":"2021-04-28T11:31:38+01:00"}
{"level":"info","msg":"Init instrumentation done","time":"2021-04-28T11:31:38+01:00"}
{"level":"info","msg":"Launching ho11y, listening on :8765","time":"2021-04-28T11:31:38+01:00"}
...
```

### Downstreams

To simulate the invocation of other services, use the `DOWNSTREAMn` environment
variable, with n between `0` and `4`. The value must be a reachable HTTP URL. For
example, to make `ho11y` call two other `ho11y` instances you wou use:

```
$ DOWNSTREAM0=http://localhost:9990
$ DOWNSTREAM1=http://localhost:9991
$ ./ho11y
{"level":"info","msg":"Using downstream 0: http://localhost:9990","time":"2021-04-26T18:07:31+01:00"}
{"level":"info","msg":"Using downstream 1: http://localhost:9991","time":"2021-04-26T18:07:31+01:00"}
{"level":"info","msg":"Using OTLP endpoint: 0.0.0.0:55680","time":"2021-04-26T18:07:31+01:00"}
{"level":"info","msg":"Init instrumentation done","time":"2021-04-26T18:07:31+01:00"}
{"level":"info","msg":"Launching ho11y, listening on :8765","time":"2021-04-26T18:07:31+01:00"}
{"event":"invoke","level":"info","msg":"ho11y was invoked by [::1]:62421","time":"2021-04-26T18:07:43+01:00"}
```
Further, in order to simulate a downstream with a deterministic response time
and size (rather than actually calling it) you can use the `DUMMY` type.

The format fur dummy downstreams is `DUMMY:$BODY_SIZE:$INVOKE_DURATION`, that is
for example if you wanted to simulate a downstream that returned a 187kB payload 
in 42ms you would use:

```
DOWNSTREAM2=DUMMY:187kB:42ms
```

Note that the dummy in fact takes as long to return as you specify it. This
means that not only the metrics values are used but also the execution is 
delayed by the time duration you specify.

### Service port

To define on which port `ho11y` should listen, use the `HO11Y_PORT` environment
variable. Defaults to `8765`.

### OpenTelemetry settings

* `OTEL_EXPORTER_OTLP_ENDPOINT` ... IP and port of the ADOT collector, defaults
  to `0.0.0.0:55680`
* `OTEL_RESOURCE_ATTRIB` ... service name, defaults to `ho11y-svc`

Note that above configures the ADOT collector connection and defines what you
will see in the X-Ray service map.


#### Throttling

Using the `HO11Y_CUTOFF_TPS` you can set a cutoff point beyond which `ho11y`
will return a 429 HTTP status response code. If this environment variable is not
set, then no throttling takes place.

For example:

```
$ HO11Y_CUTOFF_TPS=1
$ ./ho11y
{"level":"info","msg":"Throttling enabled with a 1 TPS cutoff point","time":"2021-06-10T09:24:44+01:00"}
{"level":"info","msg":"Using Otel collector at 0.0.0.0:55680","time":"2021-06-10T09:24:44+01:00"}
{"level":"info","msg":"Init instrumentation done","time":"2021-06-10T09:24:44+01:00"}
{"level":"info","msg":"Launching ho11y: I am [ho11y-svc] listening on port :8765 on all local IPs.","time":"2021-06-10T09:24:44+01:00"}
...
{"level":"info","msg":"Throttle engaged, got 2 TPS with a 1 TPS cutoff point","time":"2021-06-10T09:25:37+01:00"}
```

Now, if you `curl` more often than once per second, you should see (also note
the corresponding log line, above):

```
$ curl -s -o /dev/null -w "%{http_code}" http://localhost:8765
429
```

Many front-ends such as AWS X-Ray, treat the 429 HTTP status code 
[in a special way][x-ray-throttle], for example by highlighting it in a different color.


[x-ray-throttle]: https://docs.aws.amazon.com/xray/latest/devguide/xray-api-segmentdocuments.html#api-segmentdocuments-errors

# .NET తో OpenTelemetry

.NET లో OpenTelemetry implementation framework యొక్క ఇప్పటికే ఉన్న instrumentation capabilities పై నిర్మించబడినందున ఇతర languages లో implementations నుండి భిన్నంగా ఉంటుంది. ఇతర platforms OpenTelemetry complete telemetry APIs అందించాలి అవసరం ఉండగా, .NET ఇప్పటికే logging, metrics, మరియు activities కోసం తన platform APIs ద్వారా robust built-in mechanisms అందిస్తుంది. OpenTelemetry .NET implementation కొత్తవి సృష్టించడం కంటే ఈ native components ([System.Diagnostics](https://learn.microsoft.com/en-us/dotnet/api/system.diagnostics?view=net-9.0) వంటివి) ను simply leverage చేస్తుంది. ఇది library authors ఇప్పటికే familiar అయిన standard .NET APIs ఉపయోగించవచ్చని, మరియు OpenTelemetry ఈ ఇప్పటికే ఉన్న instrumentation points తో seamlessly integrate అవుతుందని అర్థం.

## OpenTelemetry Libraries

.NET లో OpenTelemetry మూడు fundamental package categories చుట్టూ structured చేయబడింది:

1. **Core API** packages essential foundation మరియు base functionality అందిస్తాయి, telemetry collection కోసం core interfaces మరియు implementations తో సహా.

1. **Instrumentation** packages వివిధ .NET components మరియు popular libraries నుండి స్వయంచాలకంగా telemetry data collect చేస్తాయి, ASP.NET Core, HTTP clients, మరియు Entity Framework వంటి sources నుండి metrics, traces, మరియు logs capture చేస్తాయి.

1. **Exporter** packages విభిన్న observability platforms కు bridges గా serve చేస్తాయి, Jaeger, Prometheus, లేదా OTLP protocol support చేసే ఏదైనా system వంటి వివిధ destinations కు మీ collected telemetry data send చేయడానికి అనుమతిస్తాయి.

ఈ components .NET applications కోసం complete observability solution అందించడానికి NuGet ద్వారా అందుబాటులో ఉన్న cohesive system గా కలిసి పని చేస్తాయి.

కింది table ఈ packages వివరిస్తుంది.

| Package | వివరణ |
| -------- | -------- |
| [OpenTelemetry](https://github.com/open-telemetry/opentelemetry-dotnet/blob/main/src/OpenTelemetry/README.md)   | Core functionality అందించే Main OTEL library    |
| [OpenTelemetry.Instrumentation.AspNetCore](https://github.com/open-telemetry/opentelemetry-dotnet-contrib/blob/main/src/OpenTelemetry.Instrumentation.AspNetCore/README.md)    | ASP.NET Core మరియు Kestrel కోసం Instrumentation    |
| [OpenTelemetry.Instrumentation.GrpcNetClient](https://github.com/open-telemetry/opentelemetry-dotnet-contrib/blob/main/src/OpenTelemetry.Instrumentation.GrpcNetClient/README.md)    | gRPC Client కోసం Instrumentation    |
| [OpenTelemetry.Instrumentation.Http](https://github.com/open-telemetry/opentelemetry-dotnet-contrib/blob/main/src/OpenTelemetry.Instrumentation.Http/README.md)    | HttpClient మరియు HttpWebRequest classes కోసం Instrumentation    |
| [OpenTelemetry.Instrumentation.SqlClient](https://github.com/open-telemetry/opentelemetry-dotnet/tree/main/src/OpenTelemetry.Exporter.Console/README.md)    | Entity Framework Core వంటి database operations trace చేయడానికి ఉపయోగించే SqlClient కోసం Instrumentation    |
| [OpenTelemetry.Exporter.Console](https://github.com/open-telemetry/opentelemetry-dotnet/tree/main/src/OpenTelemetry.Exporter.Console/README.md)    | OTLP protocol ఉపయోగించే Exporter    |
| [OpenTelemetry.Exporter.OpenTelemetryProtocol](https://github.com/open-telemetry/opentelemetry-dotnet/tree/main/src/OpenTelemetry.Exporter.OpenTelemetryProtocol/README.md)    | OTLP protocol ఉపయోగించే Exporter    |
| [OpenTelemetry.Exporter.Prometheus.AspNetCore](https://github.com/open-telemetry/opentelemetry-dotnet/blob/main/src/OpenTelemetry.Exporter.Prometheus.AspNetCore/README.md)    | ASP.NET Core endpoint ఉపయోగించి implement చేయబడిన Prometheus కోసం Exporter    |
| [OpenTelemetry.Exporter.Zipkin](https://github.com/open-telemetry/opentelemetry-dotnet/blob/main/src/OpenTelemetry.Exporter.Zipkin/README.md)    | Zipkin tracing కోసం Exporter    |

## AWS .NET OpenTelemetry Libraries

AWS NuGet లో అందుబాటులో ఉన్న OpenTelemetry packages యొక్క తాజా iteration release చేసింది. Packages simplicity కోసం మరియు తాజా OpenTelemetry naming conventions కు conform అవ్వడానికి rework చేయబడ్డాయి. AWS SDK for .NET లో enhanced observability కోసం support, Amazon Bedrock తో సహా AWS services కోసం additional instrumentation, అలాగే multiple bug fixes, enhancements మరియు OpenTelemetry community contributions వంటి కొత్త features include చేయబడ్డాయి.

కింది table ఈ packages వివరిస్తుంది.

| Package | వివరణ |
| -------- | -------- |
| [OpenTelemetry.Instrumentation.AWS](https://github.com/open-telemetry/opentelemetry-dotnet-contrib/tree/main/src/OpenTelemetry.Instrumentation.AWS)    | AWS SDK for .NET ఉపయోగిస్తూ AWS services గురించి additional data తో metrics మరియు tracing calls enhance చేస్తుంది.    |
| [OpenTelemetry.Instrumentation.AWSLambda](https://github.com/open-telemetry/opentelemetry-dotnet-contrib/tree/main/src/OpenTelemetry.Instrumentation.AWSLambda)    | Incoming spans సృష్టించడానికి AWS Lambda Handler instrument చేయడానికి SDK methods    |
| [OpenTelemetry.Resources.AWS](https://github.com/open-telemetry/opentelemetry-dotnet-contrib/tree/main/src/OpenTelemetry.Resources.AWS)    | మీ application ఎక్కడ run అవుతుందో ఆధారంగా metadata తో telemetry enhance చేయడానికి AWS specific resource detectors. Amazon EC2, AWS Elastic Beanstalk, Amazon Elastic Container Service (Amazon ECS), మరియు Amazon Elastic Kubernetes Service (Amazon EKS) కోసం support include చేయబడింది    |

# .NET తో OpenTelemetry

.NET లో OpenTelemetry ఇతర భాషలలోని అమలుల నుండి భిన్నంగా ఉంటుంది ఎందుకంటే ఇది ఫ్రేమ్‌వర్క్ యొక్క ఇప్పటికే ఉన్న instrumentation సామర్థ్యాలపై నిర్మించబడింది. ఇతర ప్లాట్‌ఫామ్‌లకు OpenTelemetry పూర్తి telemetry API లను అందించాల్సి ఉండగా, .NET ఇప్పటికే logging, metrics మరియు activities కోసం దాని platform API ల ద్వారా బలమైన అంతర్నిర్మిత మెకానిజమ్‌లను అందిస్తుంది. OpenTelemetry .NET అమలు కొత్తవి సృష్టించడానికి బదులుగా ఈ స్థానిక భాగాలను ([System.Diagnostics](https://learn.microsoft.com/en-us/dotnet/api/system.diagnostics?view=net-9.0) వంటివి) ఉపయోగిస్తుంది. దీని అర్థం లైబ్రరీ రచయితలు వారికి ఇప్పటికే తెలిసిన ప్రామాణిక .NET API లను ఉపయోగించవచ్చు, మరియు OpenTelemetry ఈ ఇప్పటికే ఉన్న instrumentation పాయింట్లతో సజావుగా ఏకీకృతం అవుతుంది.

## OpenTelemetry లైబ్రరీలు

.NET లో OpenTelemetry మూడు ప్రాథమిక ప్యాకేజీ వర్గాల చుట్టూ నిర్మించబడింది:

1. **Core API** ప్యాకేజీలు telemetry సేకరణ కోసం కోర్ ఇంటర్‌ఫేస్‌లు మరియు అమలులతో సహా అవసరమైన ఫౌండేషన్ మరియు బేస్ ఫంక్షనాలిటీని అందిస్తాయి.

1. **Instrumentation** ప్యాకేజీలు వివిధ .NET భాగాలు మరియు ప్రాచుర్యమైన లైబ్రరీల నుండి స్వయంచాలకంగా telemetry డేటాను సేకరిస్తాయి, ASP.NET Core, HTTP clients మరియు Entity Framework వంటి మూలాల నుండి metrics, traces మరియు logs ను క్యాప్చర్ చేస్తాయి.

1. **Exporter** ప్యాకేజీలు వివిధ observability ప్లాట్‌ఫామ్‌లకు వంతెనలుగా పనిచేస్తాయి, Jaeger, Prometheus లేదా OTLP ప్రోటోకాల్‌ను మద్దతు ఇచ్చే ఏదైనా వ్యవస్థకు మీ సేకరించిన telemetry డేటాను పంపడానికి అనుమతిస్తాయి.

ఈ భాగాలు NuGet ద్వారా అందుబాటులో ఉండే ఒక సమన్వయ వ్యవస్థగా కలిసి పనిచేస్తాయి, .NET అప్లికేషన్ల కోసం పూర్తి observability పరిష్కారాన్ని అందిస్తాయి.

క్రింది పట్టిక ఈ ప్యాకేజీలను వివరిస్తుంది.

| ప్యాకేజీ | వివరణ |
| -------- | -------- |
| [OpenTelemetry](https://github.com/open-telemetry/opentelemetry-dotnet/blob/main/src/OpenTelemetry/README.md)   | కోర్ ఫంక్షనాలిటీని అందించే ప్రధాన OTEL లైబ్రరీ    |
| [OpenTelemetry.Instrumentation.AspNetCore](https://github.com/open-telemetry/opentelemetry-dotnet-contrib/blob/main/src/OpenTelemetry.Instrumentation.AspNetCore/README.md)    | ASP.NET Core మరియు Kestrel కోసం Instrumentation    |
| [OpenTelemetry.Instrumentation.GrpcNetClient](https://github.com/open-telemetry/opentelemetry-dotnet-contrib/blob/main/src/OpenTelemetry.Instrumentation.GrpcNetClient/README.md)    | gRPC Client కోసం Instrumentation    |
| [OpenTelemetry.Instrumentation.Http](https://github.com/open-telemetry/opentelemetry-dotnet-contrib/blob/main/src/OpenTelemetry.Instrumentation.Http/README.md)    | HttpClient మరియు HttpWebRequest classes కోసం Instrumentation    |
| [OpenTelemetry.Instrumentation.SqlClient](https://github.com/open-telemetry/opentelemetry-dotnet/tree/main/src/OpenTelemetry.Exporter.Console/README.md)    | Entity Framework Core వంటి database operations ను trace చేయడానికి ఉపయోగించే SqlClient కోసం Instrumentation    |
| [OpenTelemetry.Exporter.Console](https://github.com/open-telemetry/opentelemetry-dotnet/tree/main/src/OpenTelemetry.Exporter.Console/README.md)    | OTLP ప్రోటోకాల్ ఉపయోగించే Exporter    |
| [OpenTelemetry.Exporter.OpenTelemetryProtocol](https://github.com/open-telemetry/opentelemetry-dotnet/tree/main/src/OpenTelemetry.Exporter.OpenTelemetryProtocol/README.md)    | OTLP ప్రోటోకాల్ ఉపయోగించే Exporter    |
| [OpenTelemetry.Exporter.Prometheus.AspNetCore](https://github.com/open-telemetry/opentelemetry-dotnet/blob/main/src/OpenTelemetry.Exporter.Prometheus.AspNetCore/README.md)    | ASP.NET Core endpoint ఉపయోగించి అమలు చేయబడిన Prometheus కోసం Exporter    |
| [OpenTelemetry.Exporter.Zipkin](https://github.com/open-telemetry/opentelemetry-dotnet/blob/main/src/OpenTelemetry.Exporter.Zipkin/README.md)    | Zipkin tracing కోసం Exporter    |

## AWS .NET OpenTelemetry లైబ్రరీలు

AWS వారి తాజా OpenTelemetry ప్యాకేజీలను NuGet లో విడుదల చేసింది. ప్యాకేజీలు సరళత కోసం మరియు తాజా OpenTelemetry నామకరణ సంప్రదాయాలకు అనుగుణంగా పునర్నిర్మించబడ్డాయి. వీటిలో AWS SDK for .NET లో మెరుగైన observability కోసం మద్దతు, Amazon Bedrock తో సహా AWS సేవల కోసం అదనపు instrumentation, అనేక బగ్ ఫిక్స్‌లు, మెరుగుదలలు మరియు OpenTelemetry సంఘం చేసిన సహకారాలు వంటి కొత్త ఫీచర్లు ఉన్నాయి.

క్రింది పట్టిక ఈ ప్యాకేజీలను వివరిస్తుంది.

| ప్యాకేజీ | వివరణ |
| -------- | -------- |
| [OpenTelemetry.Instrumentation.AWS](https://github.com/open-telemetry/opentelemetry-dotnet-contrib/tree/main/src/OpenTelemetry.Instrumentation.AWS)    | AWS SDK for .NET ఉపయోగిస్తున్నప్పుడు AWS సేవల గురించి అదనపు డేటాతో metrics మరియు tracing కాల్‌లను మెరుగుపరుస్తుంది.    |
| [OpenTelemetry.Instrumentation.AWSLambda](https://github.com/open-telemetry/opentelemetry-dotnet-contrib/tree/main/src/OpenTelemetry.Instrumentation.AWSLambda)    | ఇన్‌కమింగ్ spans సృష్టించడానికి AWS Lambda Handler ను instrument చేయడానికి SDK methods    |
| [OpenTelemetry.Resources.AWS](https://github.com/open-telemetry/opentelemetry-dotnet-contrib/tree/main/src/OpenTelemetry.Resources.AWS)    | మీ అప్లికేషన్ ఎక్కడ నడుస్తుందో దాని ఆధారంగా metadata తో telemetry ని మెరుగుపరచడానికి AWS నిర్దిష్ట resource detectors. Amazon EC2, AWS Elastic Beanstalk, Amazon Elastic Container Service (Amazon ECS) మరియు Amazon Elastic Kubernetes Service (Amazon EKS) కోసం మద్దతు    |
| [OpenTelemetry.Extensions.AWS](https://github.com/open-telemetry/opentelemetry-dotnet-contrib/tree/main/src/OpenTelemetry.Extensions.AWS)    | AWS X-Ray ద్వారా Trace Context propagation కు మద్దతు ఇస్తుంది. |

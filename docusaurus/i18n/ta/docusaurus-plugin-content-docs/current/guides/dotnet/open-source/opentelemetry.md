# .NET உடன் OpenTelemetry

.NET இல் OpenTelemetry மற்ற மொழிகளில் செயல்படுத்தல்களிலிருந்து தனித்துவமாக இருக்கிறது, ஏனெனில் இது framework இன் ஏற்கனவே உள்ள instrumentation திறன்களின் மீது கட்டமைக்கப்பட்டுள்ளது. மற்ற தளங்களுக்கு OpenTelemetry முழுமையான டெலிமெட்ரி API களை வழங்க வேண்டியிருக்கும் போது, .NET ஏற்கனவே லாக்கிங், மெட்ரிக்குகள் மற்றும் activities க்கான அதன் platform API கள் மூலம் வலுவான உள்ளமைக்கப்பட்ட வழிமுறைகளை வழங்குகிறது. OpenTelemetry .NET செயல்படுத்தல் புதியவற்றை உருவாக்குவதற்கு பதிலாக இந்த நேட்டிவ் கூறுகளை ([System.Diagnostics](https://learn.microsoft.com/en-us/dotnet/api/system.diagnostics?view=net-9.0) போன்றவை) பயன்படுத்துகிறது. இதன் பொருள் லைப்ரரி ஆசிரியர்கள் அவர்கள் ஏற்கனவே அறிந்த நிலையான .NET API களை பயன்படுத்தலாம், மேலும் OpenTelemetry இந்த ஏற்கனவே உள்ள instrumentation புள்ளிகளுடன் தடையின்றி ஒருங்கிணைகிறது.

## OpenTelemetry லைப்ரரிகள்

.NET இல் OpenTelemetry மூன்று அடிப்படை தொகுப்பு வகைகளைச் சுற்றி கட்டமைக்கப்பட்டுள்ளது:

1. **Core API** தொகுப்புகள் அத்தியாவசிய அடித்தளம் மற்றும் அடிப்படை செயல்பாட்டை வழங்குகின்றன, டெலிமெட்ரி சேகரிப்புக்கான core interfaces மற்றும் implementations உட்பட.

1. **Instrumentation** தொகுப்புகள் பல்வேறு .NET கூறுகள் மற்றும் பிரபலமான லைப்ரரிகளிலிருந்து தானாகவே டெலிமெட்ரி தரவை சேகரிக்கின்றன, ASP.NET Core, HTTP clients மற்றும் Entity Framework போன்ற மூலங்களிலிருந்து மெட்ரிக்குகள், ட்ரேஸ்கள் மற்றும் லாக்குகளை படம்பிடிக்கின்றன.

1. **Exporter** தொகுப்புகள் வெவ்வேறு observability தளங்களுக்கான பாலங்களாக செயல்படுகின்றன, உங்கள் சேகரிக்கப்பட்ட டெலிமெட்ரி தரவை Jaeger, Prometheus அல்லது OTLP protocol ஐ ஆதரிக்கும் எந்த அமைப்பிற்கும் அனுப்ப அனுமதிக்கின்றன.

இந்த கூறுகள் .NET பயன்பாடுகளுக்கு முழுமையான observability தீர்வை வழங்க NuGet மூலம் கிடைக்கும் ஒரு ஒருங்கிணைந்த அமைப்பாக இணைந்து செயல்படுகின்றன.

கீழே உள்ள அட்டவணை இந்த தொகுப்புகளை விவரிக்கிறது.

| தொகுப்பு | விளக்கம் |
| -------- | -------- |
| [OpenTelemetry](https://github.com/open-telemetry/opentelemetry-dotnet/blob/main/src/OpenTelemetry/README.md)   | core செயல்பாட்டை வழங்கும் முதன்மை OTEL லைப்ரரி    |
| [OpenTelemetry.Instrumentation.AspNetCore](https://github.com/open-telemetry/opentelemetry-dotnet-contrib/blob/main/src/OpenTelemetry.Instrumentation.AspNetCore/README.md)    | ASP.NET Core மற்றும் Kestrel க்கான Instrumentation    |
| [OpenTelemetry.Instrumentation.GrpcNetClient](https://github.com/open-telemetry/opentelemetry-dotnet-contrib/blob/main/src/OpenTelemetry.Instrumentation.GrpcNetClient/README.md)    | gRPC Client க்கான Instrumentation    |
| [OpenTelemetry.Instrumentation.Http](https://github.com/open-telemetry/opentelemetry-dotnet-contrib/blob/main/src/OpenTelemetry.Instrumentation.Http/README.md)    | HttpClient மற்றும் HttpWebRequest classes க்கான Instrumentation    |
| [OpenTelemetry.Instrumentation.SqlClient](https://github.com/open-telemetry/opentelemetry-dotnet/tree/main/src/OpenTelemetry.Exporter.Console/README.md)    | Entity Framework Core போன்ற தரவுத்தள செயல்பாடுகளை trace செய்ய பயன்படும் SqlClient க்கான Instrumentation    |
| [OpenTelemetry.Exporter.Console](https://github.com/open-telemetry/opentelemetry-dotnet/tree/main/src/OpenTelemetry.Exporter.Console/README.md)    | OTLP protocol ஐ பயன்படுத்தும் Exporter    |
| [OpenTelemetry.Exporter.OpenTelemetryProtocol](https://github.com/open-telemetry/opentelemetry-dotnet/tree/main/src/OpenTelemetry.Exporter.OpenTelemetryProtocol/README.md)    | OTLP protocol ஐ பயன்படுத்தும் Exporter    |
| [OpenTelemetry.Exporter.Prometheus.AspNetCore](https://github.com/open-telemetry/opentelemetry-dotnet/blob/main/src/OpenTelemetry.Exporter.Prometheus.AspNetCore/README.md)    | ASP.NET Core எண்ட்பாயிண்ட் ஐ பயன்படுத்தி செயல்படுத்தப்பட்ட Prometheus க்கான Exporter    |
| [OpenTelemetry.Exporter.Zipkin](https://github.com/open-telemetry/opentelemetry-dotnet/blob/main/src/OpenTelemetry.Exporter.Zipkin/README.md)    | Zipkin tracing க்கான Exporter    |

## AWS .NET OpenTelemetry லைப்ரரிகள்

AWS அவர்களின் OpenTelemetry தொகுப்புகளின் சமீபத்திய வெளியீட்டை வெளியிட்டது, அவை NuGet இல் கிடைக்கின்றன. தொகுப்புகள் எளிமைக்காகவும் சமீபத்திய OpenTelemetry பெயரிடும் மரபுகளுக்கு இணங்கவும் மறுவடிவமைக்கப்பட்டுள்ளன. அவை AWS SDK for .NET இல் மேம்படுத்தப்பட்ட observability க்கான ஆதரவு மற்றும் Amazon Bedrock உட்பட AWS சேவைகளுக்கான கூடுதல் instrumentation, அத்துடன் பல பிழை திருத்தங்கள், மேம்பாடுகள் மற்றும் OpenTelemetry சமூகத்தின் பங்களிப்புகள் போன்ற புதிய அம்சங்களை உள்ளடக்கியது.

கீழே உள்ள அட்டவணை இந்த தொகுப்புகளை விவரிக்கிறது.

| தொகுப்பு | விளக்கம் |
| -------- | -------- |
| [OpenTelemetry.Instrumentation.AWS](https://github.com/open-telemetry/opentelemetry-dotnet-contrib/tree/main/src/OpenTelemetry.Instrumentation.AWS)    | AWS SDK for .NET ஐ பயன்படுத்தும் போது AWS சேவைகள் பற்றிய கூடுதல் தரவுடன் மெட்ரிக்குகள் மற்றும் tracing அழைப்புகளை மேம்படுத்துகிறது.    |
| [OpenTelemetry.Instrumentation.AWSLambda](https://github.com/open-telemetry/opentelemetry-dotnet-contrib/tree/main/src/OpenTelemetry.Instrumentation.AWSLambda)    | உள்வரும் spans ஐ உருவாக்க AWS Lambda Handler ஐ instrument செய்வதற்கான SDK methods    |
| [OpenTelemetry.Resources.AWS](https://github.com/open-telemetry/opentelemetry-dotnet-contrib/tree/main/src/OpenTelemetry.Resources.AWS)    | உங்கள் பயன்பாடு எங்கு இயங்குகிறது என்பதை அடிப்படையாகக் கொண்டு metadata உடன் டெலிமெட்ரியை மேம்படுத்த AWS-குறிப்பிட்ட resource detectors. Amazon EC2, AWS Elastic Beanstalk, Amazon Elastic Container Service (Amazon ECS) மற்றும் Amazon Elastic Kubernetes Service (Amazon EKS) க்கான ஆதரவை உள்ளடக்கியது    |

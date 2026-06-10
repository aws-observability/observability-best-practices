# .NET உடன் OpenTelemetry

.NET இல் OpenTelemetry பிற மொழிகளின் செயல்படுத்தல்களிலிருந்து வேறுபடுகிறது, ஏனெனில் இது கட்டமைப்பின் ஏற்கனவே உள்ள இன்ஸ்ட்ருமென்டேஷன் திறன்களின் மீது கட்டமைக்கப்படுகிறது. மற்ற தளங்களுக்கு OpenTelemetry முழுமையான டெலிமெட்ரி API களை வழங்க வேண்டியிருக்கும் போது, .NET ஏற்கனவே லாக்கிங், மெட்ரிக்குகள் மற்றும் ஆக்டிவிட்டிகளுக்கான அதன் தள API கள் மூலம் வலுவான உள்ளமைந்த வழிமுறைகளை வழங்குகிறது. .NET இல் OpenTelemetry செயல்படுத்தல் புதியவற்றை உருவாக்காமல் இந்த நேட்டிவ் கூறுகளை ([System.Diagnostics](https://learn.microsoft.com/en-us/dotnet/api/system.diagnostics?view=net-9.0) போன்றவை) பயன்படுத்துகிறது. இதன் பொருள் நூலக ஆசிரியர்கள் தாங்கள் ஏற்கனவே அறிந்த நிலையான .NET API களைப் பயன்படுத்தலாம், மேலும் OpenTelemetry இந்த ஏற்கனவே உள்ள இன்ஸ்ட்ருமென்டேஷன் புள்ளிகளுடன் தடையின்றி ஒருங்கிணைக்கிறது.

## OpenTelemetry நூலகங்கள்

.NET இல் OpenTelemetry மூன்று அடிப்படை தொகுப்பு வகைகளை மையமாகக் கொண்டு கட்டமைக்கப்பட்டுள்ளது:

1. **Core API** தொகுப்புகள் அத்தியாவசிய அடித்தளத்தையும் அடிப்படை செயல்பாட்டையும் வழங்குகின்றன, டெலிமெட்ரி சேகரிப்புக்கான முக்கிய இடைமுகங்கள் மற்றும் செயல்படுத்தல்களை உள்ளடக்கியது.

1. **Instrumentation** தொகுப்புகள் பல்வேறு .NET கூறுகள் மற்றும் பிரபலமான நூலகங்களிலிருந்து தானாகவே டெலிமெட்ரி தரவை சேகரிக்கின்றன, ASP.NET Core, HTTP கிளையண்டுகள் மற்றும் Entity Framework போன்ற மூலங்களிலிருந்து மெட்ரிக்குகள், ட்ரேஸ்கள் மற்றும் லாக்குகளைப் பிடிக்கின்றன.

1. **Exporter** தொகுப்புகள் வெவ்வேறு observability தளங்களுக்கு பாலங்களாக செயல்படுகின்றன, Jaeger, Prometheus அல்லது OTLP நெறிமுறையை ஆதரிக்கும் எந்த அமைப்பிற்கும் உங்கள் சேகரிக்கப்பட்ட டெலிமெட்ரி தரவை அனுப்ப அனுமதிக்கின்றன.

இந்த கூறுகள் NuGet மூலம் கிடைக்கும் ஒரு ஒருங்கிணைந்த அமைப்பாக இணைந்து செயல்படுகின்றன, .NET பயன்பாடுகளுக்கு முழுமையான observability தீர்வை வழங்குகின்றன.

கீழே உள்ள அட்டவணை இந்த தொகுப்புகளை விவரிக்கிறது.

| தொகுப்பு | விளக்கம் |
| -------- | -------- |
| [OpenTelemetry](https://github.com/open-telemetry/opentelemetry-dotnet/blob/main/src/OpenTelemetry/README.md)   | முக்கிய செயல்பாட்டை வழங்கும் பிரதான OTEL நூலகம்    |
| [OpenTelemetry.Instrumentation.AspNetCore](https://github.com/open-telemetry/opentelemetry-dotnet-contrib/blob/main/src/OpenTelemetry.Instrumentation.AspNetCore/README.md)    | ASP.NET Core மற்றும் Kestrel க்கான இன்ஸ்ட்ருமென்டேஷன்    |
| [OpenTelemetry.Instrumentation.GrpcNetClient](https://github.com/open-telemetry/opentelemetry-dotnet-contrib/blob/main/src/OpenTelemetry.Instrumentation.GrpcNetClient/README.md)    | gRPC Client க்கான இன்ஸ்ட்ருமென்டேஷன்    |
| [OpenTelemetry.Instrumentation.Http](https://github.com/open-telemetry/opentelemetry-dotnet-contrib/blob/main/src/OpenTelemetry.Instrumentation.Http/README.md)    | HttpClient மற்றும் HttpWebRequest வகுப்புகளுக்கான இன்ஸ்ட்ருமென்டேஷன்    |
| [OpenTelemetry.Instrumentation.SqlClient](https://github.com/open-telemetry/opentelemetry-dotnet/tree/main/src/OpenTelemetry.Exporter.Console/README.md)    | Entity Framework Core போன்ற தரவுத்தள செயல்பாடுகளை ட்ரேஸ் செய்ய பயன்படுத்தப்படும் SqlClient க்கான இன்ஸ்ட்ருமென்டேஷன்    |
| [OpenTelemetry.Exporter.Console](https://github.com/open-telemetry/opentelemetry-dotnet/tree/main/src/OpenTelemetry.Exporter.Console/README.md)    | OTLP நெறிமுறையைப் பயன்படுத்தும் ஏற்றுமதியாளர்    |
| [OpenTelemetry.Exporter.OpenTelemetryProtocol](https://github.com/open-telemetry/opentelemetry-dotnet/tree/main/src/OpenTelemetry.Exporter.OpenTelemetryProtocol/README.md)    | OTLP நெறிமுறையைப் பயன்படுத்தும் ஏற்றுமதியாளர்    |
| [OpenTelemetry.Exporter.Prometheus.AspNetCore](https://github.com/open-telemetry/opentelemetry-dotnet/blob/main/src/OpenTelemetry.Exporter.Prometheus.AspNetCore/README.md)    | ASP.NET Core எண்ட்பாயிண்ட்டைப் பயன்படுத்தி செயல்படுத்தப்பட்ட Prometheus க்கான ஏற்றுமதியாளர்    |
| [OpenTelemetry.Exporter.Zipkin](https://github.com/open-telemetry/opentelemetry-dotnet/blob/main/src/OpenTelemetry.Exporter.Zipkin/README.md)    | Zipkin ட்ரேசிங்கிற்கான ஏற்றுமதியாளர்    |

## AWS .NET OpenTelemetry நூலகங்கள்

AWS தங்கள் OpenTelemetry தொகுப்புகளின் சமீபத்திய பதிப்பை வெளியிட்டுள்ளது, அவை NuGet இல் கிடைக்கின்றன. தொகுப்புகள் எளிமைக்காகவும் சமீபத்திய OpenTelemetry பெயரிடல் மரபுகளுக்கு இணங்கவும் மறுவேலை செய்யப்பட்டுள்ளன. AWS SDK for .NET இல் மேம்படுத்தப்பட்ட observability க்கான ஆதரவு மற்றும் Amazon Bedrock உட்பட AWS சேவைகளுக்கான கூடுதல் இன்ஸ்ட்ருமென்டேஷன், பல பிழை திருத்தங்கள், மேம்பாடுகள் மற்றும் OpenTelemetry சமூகத்தின் பங்களிப்புகள் போன்ற புதிய அம்சங்களை அவை உள்ளடக்கியுள்ளன.

கீழே உள்ள அட்டவணை இந்த தொகுப்புகளை விவரிக்கிறது.

| தொகுப்பு | விளக்கம் |
| -------- | -------- |
| [OpenTelemetry.Instrumentation.AWS](https://github.com/open-telemetry/opentelemetry-dotnet-contrib/tree/main/src/OpenTelemetry.Instrumentation.AWS)    | AWS SDK for .NET ஐப் பயன்படுத்தும் போது AWS சேவைகள் பற்றிய கூடுதல் தரவுடன் மெட்ரிக்குகள் மற்றும் ட்ரேசிங் அழைப்புகளை மேம்படுத்துகிறது.    |
| [OpenTelemetry.Instrumentation.AWSLambda](https://github.com/open-telemetry/opentelemetry-dotnet-contrib/tree/main/src/OpenTelemetry.Instrumentation.AWSLambda)    | உள்வரும் span களை உருவாக்க AWS Lambda Handler ஐ இன்ஸ்ட்ருமென்ட் செய்வதற்கான SDK முறைகள்    |
| [OpenTelemetry.Resources.AWS](https://github.com/open-telemetry/opentelemetry-dotnet-contrib/tree/main/src/OpenTelemetry.Resources.AWS)    | உங்கள் பயன்பாடு எங்கு இயங்குகிறது என்பதன் அடிப்படையில் மெட்டாடேட்டாவுடன் டெலிமெட்ரியை மேம்படுத்த AWS குறிப்பிட்ட ரிசோர்ஸ் டிடெக்டர்கள். Amazon EC2, AWS Elastic Beanstalk, Amazon Elastic Container Service (Amazon ECS) மற்றும் Amazon Elastic Kubernetes Service (Amazon EKS) க்கான ஆதரவை உள்ளடக்கியது    |
| [OpenTelemetry.Extensions.AWS](https://github.com/open-telemetry/opentelemetry-dotnet-contrib/tree/main/src/OpenTelemetry.Extensions.AWS)    | AWS X-Ray வழியாக Trace Context பரப்புதலை ஆதரிக்கிறது. |

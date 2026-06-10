# மெட்ரிக்குகள்

.NET பயன்பாட்டு observability க்கான தரநிலையாக OpenTelemetry ஐ ஏற்றுக்கொண்டுள்ளது, ட்ரேஸ்கள் மற்றும் லாக்குகளுடன் சேர்ந்து மெட்ரிக்குகள் ஒரு முக்கிய தூணாக உள்ளன. இந்த ஒருங்கிணைப்பு டெவலப்பர்களுக்கு குறைந்தபட்ச மேல்நிலையுடன் பயன்பாட்டு செயல்திறனை கண்காணிக்க உதவுகிறது.

.NET சூழலமைப்பில், OpenTelemetry மெட்ரிக்குகள் பயன்பாட்டு மெட்ரிக்குகளை அளவிடுவதற்கும் வெளிப்படுத்துவதற்கும் தரப்படுத்தப்பட்ட அணுகுமுறையை வழங்குகின்றன. .NET 6 இல் தொடங்கி .NET 8 இல் கணிசமாக மேம்படுத்தப்பட்ட framework, மெட்ரிக் தரவை சேகரிப்பதற்கும் ஏற்றுமதி செய்வதற்கும் உள்ளமைக்கப்பட்ட ஆதரவை வழங்குகிறது.

ASP.NET Core, HTTP clients மற்றும் Entity Framework போன்ற பொதுவான கூறுகளுக்கு framework தானியங்கி instrumentation ஐ வழங்குகிறது, கூடுதல் குறியீடு இல்லாமல் மதிப்புமிக்க மெட்ரிக்குகளை சேகரிக்கிறது.

.NET இல் OpenTelemetry பல ஏற்றுமதி வடிவங்களை ஆதரிக்கிறது, மெட்ரிக்குகளுக்கு Prometheus குறிப்பாக பிரபலமானது. இந்த நெகிழ்வுத்தன்மை குழுக்களுக்கு நிலையான சேகரிப்பு அணுகுமுறையை பராமரிக்கும் அதே வேளையில் அவர்கள் விரும்பும் observability தளங்களுடன் ஒருங்கிணைக்க அனுமதிக்கிறது.

OpenTelemetry மெட்ரிக்குகளை ஏற்றுக்கொள்வதன் மூலம், .NET பயன்பாடுகள் டெவலப்மெண்ட் சூழல்களிலிருந்து சிக்கலான உற்பத்தி டிப்ளாய்மென்ட்கள் வரை அளவிடக்கூடிய, விற்பனையாளர்-நடுநிலையான, தரப்படுத்தப்பட்ட கண்காணிப்பு அணுகுமுறையிலிருந்து பயனடைகின்றன, இது பயன்பாட்டு ஆரோக்கியம் மற்றும் செயல்திறனில் முக்கியமான தெரிவுநிலையை வழங்குகிறது.

## மெட்ரிக்குகள் செயல்படுத்தல்

.NET 8 பயன்பாடுகளில் OpenTelemetry மெட்ரிக்குகளை செயல்படுத்துவது மிகவும் எளிமையானதாகிவிட்டது. கட்டமைப்பு செயல்முறை நவீன .NET பயன்பாடுகளுக்கு மையமான dependency injection அமைப்பை பயன்படுத்துகிறது. டெவலப்பர்கள் fluent API ஐ பயன்படுத்தி பயன்பாட்டு bootstrap செயல்முறையின் போது மெட்ரிக்குகள் சேகரிப்பை கட்டமைக்கலாம்:

```c#
var builder = WebApplication.CreateBuilder(args);

// Add OpenTelemetry metrics
builder.Services.AddOpenTelemetry()
    .WithMetrics(metrics => metrics
        .AddAspNetCoreInstrumentation()
        .AddHttpClientInstrumentation()
        .AddRuntimeInstrumentation()
        .AddOtlpExporter());
```

## தனிப்பயன் மெட்ரிக்குகள்

டெவலப்பர்கள் System.Diagnostics.Metrics namespace ஐ பயன்படுத்தி தனிப்பயன் மெட்ரிக்குகளை உருவாக்கலாம்:

```c#
using var meter = new Meter("MyApplication.Metrics");
var orderCounter = meter.CreateCounter<int>("orders.processed");

// Recording values
orderCounter.Add(1, new("customer", customerId));
```

## அடுத்த படிகள்

உங்கள் பயன்பாடு instrumented செய்யப்பட்டவுடன், மெட்ரிக்குகளை நீங்கள் விரும்பும் observability backend க்கு அனுப்ப OpenTelemetry Collector, CloudWatch Agent, அல்லது Fluent Bit போன்ற collector agent ஐ பயன்படுத்தவும். விவரங்கள் மற்றும் செயல்படுத்தல் வழிகாட்டுதலுக்கு கீழே உள்ள இணைப்புகளைப் பார்க்கவும்.

- [OpenTelemetry உடன் Observability](https://aws-observability.github.io/observability-best-practices/patterns/otel) - உங்கள் பயன்பாடுகளில் OpenTelemetry ஐ செயல்படுத்துவதற்கான விரிவான வழிகாட்டி, முழு-ஸ்டாக் observability ஐ அடைய AWS சேவைகளுடன் டெலிமெட்ரி தரவை சேகரிப்பதற்கும், செயலாக்குவதற்கும், காட்சிப்படுத்துவதற்கும் பேட்டர்ன்களை வழங்குகிறது.

- [AWS Distro for OpenTelemetry (ADOT) Collector ஐ இயக்குதல்](https://aws-observability.github.io/observability-best-practices/guides/operational/adot-at-scale/operating-adot-collector) - உற்பத்தி சூழல்களில் ADOT Collector ஐ டிப்ளாய் செய்வதற்கும், அளவிடுவதற்கும், நிர்வகிப்பதற்கும் நடைமுறை வழிகாட்டுதல், கட்டமைப்பு சிறந்த நடைமுறைகள் மற்றும் AWS observability சேவைகளுடன் ஒருங்கிணைப்பு உட்பட.

- [CloudWatch agent மூலம் மெட்ரிக்குகள், லாக்குகள் மற்றும் ட்ரேஸ்களை சேகரிக்கவும்](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Install-CloudWatch-Agent.html) - உங்கள் பயன்பாடுகள் மற்றும் உள்கட்டமைப்பிலிருந்து டெலிமெட்ரி தரவை சேகரிக்க CloudWatch agent ஐ நிறுவுவதற்கும் கட்டமைப்பதற்கும் படிப்படியான வழிமுறைகள், AWS CloudWatch உடன் தடையற்ற ஒருங்கிணைப்பு.

- [AWS for Fluent Bit](https://github.com/aws/aws-for-fluent-bit?tab=readme-ov-file) - பல AWS சேவைகளுக்கு லாக்குகள், மெட்ரிக்குகள் மற்றும் ட்ரேஸ்களை சேகரிப்பதற்கும் அனுப்புவதற்கும் இலகுரக மற்றும் திறமையான தீர்வு, கண்டெய்னர்மயமாக்கப்பட்ட சூழல்கள் மற்றும் Kubernetes டிப்ளாய்மென்ட்களுக்கு உகந்ததாக்கப்பட்டது.

- [CloudWatch EMF](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch_Embedded_Metric_Format.html) - லாக் நிகழ்வுகளில் மெட்ரிக் தரவை உட்பொதிப்பதற்கான specification, தனி மெட்ரிக்குகள் pipeline தேவையின்றி பயன்பாட்டு லாக்குகளிலிருந்து மெட்ரிக்குகளை பிரித்தெடுக்கவும் காட்சிப்படுத்தவும் உதவுகிறது, serverless மற்றும் கண்டெய்னர்மயமாக்கப்பட்ட பயன்பாடுகளுக்கு ஏற்றது.

- [Amazon Managed Grafana - தொடங்குதல்](https://aws.amazon.com/blogs/mt/amazon-managed-grafana-getting-started/) - உங்கள் மெட்ரிக்குகள் தரவின் சக்திவாய்ந்த காட்சிப்படுத்தல்களை உருவாக்க Amazon Managed Grafana ஐ அமைப்பதற்கான பயிற்சிக்குறிப்பு, தரவு மூலங்களை கட்டமைப்பது, டாஷ்போர்டுகளை உருவாக்குவது மற்றும் விழிப்பூட்டல்களை செயல்படுத்துவது ஆகியவற்றிற்கான படிப்படியான வழிமுறைகளுடன்.

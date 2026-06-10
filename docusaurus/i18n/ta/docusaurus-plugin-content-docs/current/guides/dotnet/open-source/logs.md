# லாக்குகள்

.NET OpenTelemetry லாக்கிங்கிற்கு விரிவான ஆதரவை வழங்குகிறது, மெட்ரிக்குகள் மற்றும் ட்ரேஸ்களுடன் சேர்ந்து observability மூவரையை நிறைவு செய்கிறது. இந்த ஒருங்கிணைப்பு நவீன observability தளங்களில் தடையின்றி பாயும் கட்டமைக்கப்பட்ட, சூழல்சார்ந்த லாக்கிங்கை செயல்படுத்துகிறது.

.NET இல் OpenTelemetry லாக்கிங் செயல்படுத்தல் ஏற்கனவே நிறுவப்பட்ட Microsoft.Extensions.Logging abstractions மீது கட்டமைக்கப்பட்டுள்ளது, இது டெவலப்பர்கள் ஏற்கனவே உள்ள லாக்கிங் குறியீட்டை மாற்றாமல் OpenTelemetry ஐ ஏற்றுக்கொள்ள அனுமதிக்கிறது. இந்த பின்னோக்கு இணக்கத்தன்மை புதிய மற்றும் ஏற்கனவே உள்ள பயன்பாடுகளில் ஏற்றுக்கொள்வதை எளிதாக்குகிறது.

## லாக்கிங் செயல்படுத்தல்

.NET பயன்பாட்டில் OpenTelemetry லாக்குகளை அமைப்பதற்கு குறைந்தபட்ச கட்டமைப்பு தேவை:

```c#
builder.Logging.AddOpenTelemetry(options =>
{
    options.SetResourceBuilder(ResourceBuilder.CreateDefault()
        .AddService("MyServiceName"));
    
    options.AddOtlpExporter();
});
```

.NET இல் OpenTelemetry லாக்குகளின் மிகவும் சக்திவாய்ந்த அம்சங்களில் ஒன்று தானியங்கி சூழல் பரப்புதல் ஆகும். செயலில் உள்ள ட்ரேஸ்க்குள் லாக்கிங் நடைபெறும்போது லாக் உள்ளீடுகள் trace மற்றும் span IDs உடன் தானாகவே செறிவூட்டப்படும், இது லாக்குகள் மற்றும் தொடர்புடைய விநியோகிக்கப்பட்ட ட்ரேஸ்களுக்கு இடையே இணைப்புகளை உருவாக்குகிறது.

```c#
// Logs created within this span will contain its context
using var activity = MyActivitySource.StartActivity("ProcessOrder");
logger.LogInformation("Processing order {OrderId}", orderId);
```

.NET பயன்பாடுகளில் OpenTelemetry லாக்குகளை செயல்படுத்துவதன் மூலம், டெவலப்மெண்ட் குழுக்கள் பரந்த observability சூழலமைப்புடன் சீராக ஒருங்கிணைக்கும் லாக்கிங்கிற்கான தரப்படுத்தப்பட்ட அணுகுமுறையை பெறுகின்றன. இந்த ஒருங்கிணைப்பு சிக்கல் தீர்வுக்கு முக்கியமான சூழலை வழங்குகிறது, சேவைகள் முழுவதும் தொடர்புடைய சிக்னல்களை இணைக்கிறது, மேலும் விநியோகிக்கப்பட்ட சூழல்களில் மிகவும் பயனுள்ள கண்காணிப்பு மற்றும் பிழைத்திருத்தத்தை செயல்படுத்துகிறது.

## அடுத்த படிகள்

உங்கள் பயன்பாடு instrumented செய்யப்பட்டவுடன், லாக்குகளை நீங்கள் விரும்பும் observability backend க்கு அனுப்ப OpenTelemetry Collector, CloudWatch Agent, அல்லது Fluent Bit போன்ற collector agent ஐ பயன்படுத்தவும். விவரங்கள் மற்றும் செயல்படுத்தல் வழிகாட்டுதலுக்கு கீழே உள்ள இணைப்புகளைப் பார்க்கவும்.

- [OpenTelemetry உடன் Observability](https://aws-observability.github.io/observability-best-practices/patterns/otel) - உங்கள் பயன்பாடுகளில் OpenTelemetry ஐ செயல்படுத்துவதற்கான விரிவான வழிகாட்டி, முழு-ஸ்டாக் observability ஐ அடைய AWS சேவைகளுடன் டெலிமெட்ரி தரவை சேகரிப்பதற்கும், செயலாக்குவதற்கும், காட்சிப்படுத்துவதற்கும் பேட்டர்ன்களை வழங்குகிறது.

- [AWS Distro for OpenTelemetry (ADOT) Collector ஐ இயக்குதல்](https://aws-observability.github.io/observability-best-practices/guides/operational/adot-at-scale/operating-adot-collector) - உற்பத்தி சூழல்களில் ADOT Collector ஐ டிப்ளாய் செய்வதற்கும், அளவிடுவதற்கும், நிர்வகிப்பதற்கும் நடைமுறை வழிகாட்டுதல், கட்டமைப்பு சிறந்த நடைமுறைகள் மற்றும் AWS observability சேவைகளுடன் ஒருங்கிணைப்பு உட்பட.

- [CloudWatch agent மூலம் மெட்ரிக்குகள், லாக்குகள் மற்றும் ட்ரேஸ்களை சேகரிக்கவும்](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Install-CloudWatch-Agent.html) - உங்கள் பயன்பாடுகள் மற்றும் உள்கட்டமைப்பிலிருந்து டெலிமெட்ரி தரவை சேகரிக்க CloudWatch agent ஐ நிறுவுவதற்கும் கட்டமைப்பதற்கும் படிப்படியான வழிமுறைகள், AWS CloudWatch உடன் தடையற்ற ஒருங்கிணைப்பு.

- [AWS for Fluent Bit](https://github.com/aws/aws-for-fluent-bit?tab=readme-ov-file) - பல AWS சேவைகளுக்கு லாக்குகள், மெட்ரிக்குகள் மற்றும் ட்ரேஸ்களை சேகரிப்பதற்கும் அனுப்புவதற்கும் இலகுரக மற்றும் திறமையான தீர்வு, கண்டெய்னர்மயமாக்கப்பட்ட சூழல்கள் மற்றும் Kubernetes டிப்ளாய்மென்ட்களுக்கு உகந்ததாக்கப்பட்டது.

- [ADOT Collector Amazon CloudWatch Exporter](https://github.com/open-telemetry/opentelemetry-collector-contrib/tree/main/exporter/awscloudwatchlogsexporter) - Amazon CloudWatch Logs க்கு நேரடியாக லாக்குகளை ஏற்றுமதி செய்யும் சிறப்பு OpenTelemetry Collector கூறு, லாக் குழுக்கள், ஸ்ட்ரீம்கள் மற்றும் AWS அங்கீகாரத்திற்கான கட்டமைப்பு விருப்பங்களுடன்.

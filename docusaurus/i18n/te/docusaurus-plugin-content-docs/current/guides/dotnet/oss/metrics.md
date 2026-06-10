# Metrics

.NET అనేది అప్లికేషన్ observability కోసం ప్రామాణికంగా OpenTelemetry ని స్వీకరించింది, traces మరియు logs తో పాటు metrics కీలక స్తంభంగా ఉంది. ఈ ఏకీకరణ డెవలపర్లకు కనీస ఓవర్‌హెడ్‌తో అప్లికేషన్ పనితీరును పర్యవేక్షించడానికి వీలు కల్పిస్తుంది.

.NET ఎకోసిస్టమ్‌లో, OpenTelemetry metrics అప్లికేషన్ metrics ను కొలవడానికి మరియు బహిర్గతం చేయడానికి ప్రామాణిక విధానాన్ని అందిస్తాయి. .NET 6 తో ప్రారంభించి .NET 8 లో గణనీయంగా మెరుగుపరచబడిన ఈ ఫ్రేమ్‌వర్క్, metric డేటాను సేకరించడానికి మరియు ఎగుమతి చేయడానికి అంతర్నిర్మిత మద్దతును అందిస్తుంది.

ఈ ఫ్రేమ్‌వర్క్ ASP.NET Core, HTTP clients మరియు Entity Framework వంటి సాధారణ భాగాలకు స్వయంచాలక instrumentation ను అందిస్తుంది, అదనపు కోడ్ లేకుండా విలువైన metrics ను సేకరిస్తుంది.

.NET లో OpenTelemetry అనేక ఎగుమతి ఫార్మాట్‌లను మద్దతు ఇస్తుంది, metrics కోసం Prometheus ప్రత్యేకంగా ప్రాచుర్యంలో ఉంది. ఈ వశ్యత బృందాలు స్థిరమైన సేకరణ విధానాన్ని కొనసాగిస్తూ వారి ఇష్టమైన observability ప్లాట్‌ఫామ్‌లతో ఏకీకృతం చేయడానికి అనుమతిస్తుంది.

OpenTelemetry metrics ను అవలంబించడం ద్వారా, .NET అప్లికేషన్లు అభివృద్ధి వాతావరణాల నుండి సంక్లిష్ట ప్రొడక్షన్ డిప్లాయ్‌మెంట్ల వరకు స్కేల్ అయ్యే, అప్లికేషన్ ఆరోగ్యం మరియు పనితీరుపై కీలకమైన దృశ్యమానతను అందించే vendor-neutral, ప్రామాణిక పర్యవేక్షణ విధానం నుండి ప్రయోజనం పొందుతాయి.

## Metrics అమలు

.NET 8 అప్లికేషన్లలో OpenTelemetry metrics ను అమలు చేయడం చాలా సులభమైంది. కాన్ఫిగరేషన్ ప్రక్రియ ఆధునిక .NET అప్లికేషన్లకు కేంద్రంగా ఉండే dependency injection వ్యవస్థను ఉపయోగిస్తుంది. డెవలపర్లు fluent API ని ఉపయోగించి అప్లికేషన్ bootstrap ప్రక్రియ సమయంలో metrics సేకరణను కాన్ఫిగర్ చేయవచ్చు:

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

## Custom Metrics

డెవలపర్లు System.Diagnostics.Metrics namespace ను ఉపయోగించి custom metrics ను సృష్టించవచ్చు:

```c#
using var meter = new Meter("MyApplication.Metrics");
var orderCounter = meter.CreateCounter<int>("orders.processed");

// Recording values
orderCounter.Add(1, new("customer", customerId));
```

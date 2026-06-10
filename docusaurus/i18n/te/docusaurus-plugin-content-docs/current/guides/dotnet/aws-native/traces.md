# Traces

Traces సంక్లిష్ట పంపిణీ వ్యవస్థలలో అభ్యర్థన ప్రాసెసింగ్‌ను ట్రాక్ చేస్తాయి, downstream AWS వనరులు, microservices, databases మరియు APIs తో సహా వ్యక్తిగత భాగాల ద్వారా అభ్యర్థన ప్రవాహం గురించి వివరమైన సమాచారాన్ని అందిస్తాయి. ఇది bottlenecks మరియు latency సమస్యలను గుర్తించడం ద్వారా పనితీరు ఆప్టిమైజేషన్‌కు సహాయపడుతుంది.

ఈ విభాగంలో, AWS X-Ray SDK for .NET ను ఉపయోగించి .NET అప్లికేషన్‌లను instrument చేసి X-Ray daemon ద్వారా AWS X-Ray కు trace సమాచారాన్ని సృష్టించి పంపడం గురించి AWS డాక్యుమెంటేషన్ మరియు ఓపెన్ సోర్స్ రిపోజిటరీలకు లింక్‌లను చూస్తారు.

AWS X-Ray మరియు దాని ప్రధాన భావనల గురించి తెలుసుకోవడానికి AWS X-Ray డెవలపర్ గైడ్‌లోని [**What is AWS X-Ray**](https://docs.aws.amazon.com/xray/latest/devguide/aws-xray.html) మరియు [**Concepts**](https://docs.aws.amazon.com/xray/latest/devguide/aws-xray.html) విభాగాలను సందర్శించండి.

X-Ray SDK for .NET అనేది C# .NET వెబ్ అప్లికేషన్‌లు, .NET Core వెబ్ అప్లికేషన్‌లు మరియు AWS Lambda లో .NET Core ఫంక్షన్‌లను instrument చేయడానికి ఒక లైబ్రరీ. ఇది X-Ray daemon కు trace డేటాను ఉత్పత్తి చేయడానికి మరియు పంపడానికి classes మరియు methods ను అందిస్తుంది. ఇందులో అప్లికేషన్ అందించే ఇన్‌కమింగ్ అభ్యర్థనలు, మరియు అప్లికేషన్ downstream AWS సేవలు, HTTP వెబ్ APIs మరియు SQL databases కు చేసే కాల్‌ల గురించి సమాచారం ఉంటుంది.

## Agents మరియు SDKs కోసం ఎంపికలు

Amazon EC2 instances మరియు on-premise servers నుండి traces సేకరించి AWS X-Ray కు పంపడానికి AWS X-Ray daemon, CloudWatch agent మరియు AWS Distro for OpenTelemetry (ADOT) collector మధ్య ఎంచుకునే ఎంపిక మీకు ఉంది. మీరు నిర్వహించాల్సిన agents సంఖ్యను తగ్గించడానికి మీ వినియోగ సందర్భానికి సరైనదాన్ని ఎంచుకోండి.

మీ అప్లికేషన్ మరియు infrastructure నుండి traces సేకరించి పంపడానికి X-Ray daemon ను కాన్ఫిగర్ చేయడం గురించి తెలుసుకోవడానికి [**AWS X-Ray daemon**](https://docs.aws.amazon.com/xray/latest/devguide/xray-daemon.html) గైడ్ చదవండి. బదులుగా, మీ ఎంపిక CloudWatch agent ఉపయోగించడం అయితే, [**Amazon CloudWatch user guide**](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Install-CloudWatch-Agent.html) CloudWatch agent ను సెటప్ చేసి కాన్ఫిగర్ చేయడానికి సూచనలను అందిస్తుంది.

Traces ఉత్పత్తి చేయడానికి మీ అప్లికేషన్‌ను instrument చేయడానికి, OpenTelemetry మరియు X-Ray SDK for .NET మధ్య ఎంచుకునే ఎంపిక మీకు ఉంది. ఈ ఎంపికల మధ్య ఎంచుకోవడానికి మార్గదర్శకత్వం [**ఇక్కడ**](https://docs.aws.amazon.com/xray/latest/devguide/xray-instrumenting-your-app.html#xray-instrumenting-choosing) అందుబాటులో ఉంది.

## AWS X-Ray SDK for .NET
 
X-Ray SDK for .NET ఒక ఓపెన్ సోర్స్ ప్రాజెక్ట్. X-Ray SDK for .NET .NET Framework 4.5 లేదా తరువాత వెర్షన్‌లను లక్ష్యంగా చేసుకునే అప్లికేషన్‌లకు మద్దతు ఇస్తుంది. .NET Core అప్లికేషన్‌లకు, SDK కి .NET Core 2.0 లేదా తరువాత అవసరం.

ప్రారంభించడానికి ఇక్కడ లింక్‌లు ఉన్నాయి.

[**AWS X-Ray SDK for .NET developer guide**](https://docs.aws.amazon.com/xray/latest/devguide/xray-sdk-dotnet.html) - ఈ డాక్యుమెంటేషన్ NuGet ద్వారా ఇన్‌స్టాలేషన్, కాన్ఫిగరేషన్ ఎంపికలు మరియు ఆటోమేటిక్ HTTP అభ్యర్థన ట్రేసింగ్ మరియు AWS సేవ కాల్ మానిటరింగ్ తో సహా వివిధ instrumentation సామర్థ్యాలను వివరిస్తుంది. డెవలపర్‌లు custom segments ను ఎలా సృష్టించాలో, annotations ఎలా జోడించాలో మరియు డేటా సేకరణను నిర్వహించడానికి sampling rules ను ఎలా ఉపయోగించాలో ఇది కవర్ చేస్తుంది. ASP.NET అప్లికేషన్‌లలో X-Ray tracing ను ఇంటిగ్రేట్ చేయడానికి సమగ్ర సమాచారాన్ని అందిస్తుంది, ఇది డెవలపర్‌లకు అప్లికేషన్ పనితీరులో దృశ్యమానత పొందడానికి మరియు సమస్యలను సమర్థవంతంగా పరిష్కరించడానికి సహాయపడుతుంది.

[**The SDK open source project repo - aws-xray-sdk-dotnet**](https://docs.aws.amazon.com/xray/latest/devguide/xray-sdk-dotnet.html) - aws-xray-sdk-dotnet రిపోజిటరీ Amazon యొక్క X-Ray SDK for .NET కోసం ఓపెన్ సోర్స్ కోడ్‌ను కలిగి ఉంది. .NET Core మరియు .NET Framework environments లో distributed application monitoring కు మద్దతు ఇచ్చే ఈ tracing tool యొక్క implementation ను డెవలపర్‌లు చూడవచ్చు. HTTP అభ్యర్థనల యొక్క ఆటోమేటిక్ instrumentation, AWS సేవ కాల్‌లు మరియు custom instrumentation సామర్థ్యాల కోసం సోర్స్ కోడ్ రిపోజిటరీలో ఉంది. SDK ASP.NET frameworks తో ఎలా ఇంటిగ్రేట్ అవుతుందో మరియు sampling rules ను ఎలా implement చేస్తుందో మీరు సమీక్షించవచ్చు. ఈ GitHub ప్రాజెక్ట్ SDK యొక్క కార్యాచరణలో పారదర్శకతను అందిస్తుంది, అదే సమయంలో డెవలపర్‌లు సమస్యలను నివేదించడానికి లేదా కోడ్‌బేస్‌కు మెరుగుదలలు అందించడానికి అనుమతిస్తుంది.

.NET X-Ray SDK భాగాలను సమగ్రంగా వివరించే API reference manuals క్రింద ఉన్నాయి.

[**The API Reference for .NET Framework**](https://docs.aws.amazon.com/xray-sdk-for-dotnet/latest/reference/html/d0b774be-200e-4897-9ce6-4e43c3f6f5de.htm)

[**The API Reference for .NET (Core)**](https://docs.aws.amazon.com/xray-sdk-for-dotnetcore/latest/reference/html/bdf06719-4833-4e03-8ce5-31debb71506c.htm)

మీ ASP.NET మరియు ASP.NET Core అప్లికేషన్‌లలో X-Ray SDK for .NET ను ఉపయోగించడం నేర్చుకోవడానికి నమూనా అప్లికేషన్‌లు క్రింద లింక్ చేయబడ్డాయి

[**Sample ASP.NET and ASP.NET core applications**](https://github.com/aws-samples/aws-xray-dotnet-webapp)

# Internet Monitor

:::warning
	ఈ రచన సమయంలో, [Internet Monitor](https://aws.amazon.com/blogs/aws/cloudwatch-internet-monitor-end-to-end-visibility-into-internet-performance-for-your-applications/) CloudWatch console లో **preview** లో అందుబాటులో ఉంది. సాధారణ లభ్యత కోసం ఫీచర్‌ల పరిధి మీరు ఈ రోజు అనుభవించే దాని నుండి మారవచ్చు.
:::
[మీ వర్క్‌లోడ్ యొక్క అన్ని టైర్‌ల నుండి టెలిమెట్రీ సేకరించడం](../guides/index.md#collect-telemetry-from-all-tiers-of-your-workload) ఒక ఉత్తమ పద్ధతి, మరియు ఇది ఒక సవాలు కావచ్చు. కానీ మీ వర్క్‌లోడ్ యొక్క టైర్‌లు ఏమిటి? కొందరికి ఇది వెబ్, అప్లికేషన్ మరియు డేటాబేస్ సర్వర్‌లు కావచ్చు. ఇతరులు తమ వర్క్‌లోడ్‌ను ఫ్రంట్ ఎండ్ మరియు బ్యాక్ ఎండ్ గా చూడవచ్చు. మరియు వెబ్ అప్లికేషన్‌లను ఆపరేట్ చేసేవారు ఎండ్ యూజర్‌ల ద్వారా అనుభవించబడినట్లు ఈ apps ఆరోగ్యాన్ని పరిశీలించడానికి [Real User Monitoring](./rum.md)(RUM) ను ఉపయోగించవచ్చు.

కానీ క్లయింట్ మరియు డేటాసెంటర్ లేదా క్లౌడ్ సర్వీసెస్ ప్రొవైడర్ మధ్య ట్రాఫిక్ గురించి ఏమిటి? మరియు వెబ్ పేజీలుగా అందించబడని మరియు అందువల్ల RUM ఉపయోగించలేని అప్లికేషన్‌ల కోసం?

![ఇంటర్నెట్-ట్రావర్స్ చేసే అప్లికేషన్‌ల నుండి నెట్‌వర్క్ టెలిమెట్రీ](../images/internet_monitor.png)

Internet Monitor నెట్‌వర్కింగ్ స్థాయిలో పనిచేస్తుంది మరియు తెలిసిన Internet సమస్యల యొక్క [AWS ఉన్న జ్ఞానం](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-IM-inside-internet-monitor.html) తో కొరిలేట్ చేయబడిన పరిశీలించబడిన ట్రాఫిక్ ఆరోగ్యాన్ని మూల్యాంకనం చేస్తుంది. సంక్షిప్తంగా, ఒక Internet Service Provider (ISP) కి పనితీరు లేదా అందుబాటు సమస్య ఉంటే **మరియు** మీ అప్లికేషన్‌కు క్లయింట్/సర్వర్ కమ్యూనికేషన్ కోసం ఈ ISP ను ఉపయోగించే ట్రాఫిక్ ఉంటే, Internet Monitor మీ వర్క్‌లోడ్‌పై ఈ ప్రభావం గురించి మీకు ముందుగానే తెలియజేయగలదు. అదనంగా, మీ ఎంచుకున్న హోస్టింగ్ region మరియు Content Delivery Network గా [CloudFront](https://aws.amazon.com/cloudfront/) ఉపయోగం ఆధారంగా ఇది మీకు సిఫారసులు చేయగలదు [^1].

:::tip
	Internet Monitor మీ వర్క్‌లోడ్‌లు ట్రావర్స్ చేసే నెట్‌వర్క్‌ల నుండి ట్రాఫిక్‌ను మాత్రమే మూల్యాంకనం చేస్తుంది. ఉదాహరణకు, మరొక దేశంలోని ISP ప్రభావితమైతే, కానీ మీ వినియోగదారులు ఆ carrier ను ఉపయోగించకపోతే, ఆ సమస్యలో మీకు దృశ్యమానత ఉండదు.
:::

## ఇంటర్నెట్‌ను ట్రావర్స్ చేసే అప్లికేషన్‌ల కోసం monitors ను సృష్టించండి

Internet Monitor పనిచేసే విధానం ఏమిటంటే, ప్రభావిత ISP ల నుండి మీ CloudFront distributions లోకి లేదా మీ VPC లలోకి వచ్చే ట్రాఫిక్‌ను గమనించడం. ఇది మీ నియంత్రణ బయట ఉన్న నెట్‌వర్క్ సమస్యల ఫలితంగా తలెత్తే వ్యాపార సమస్యలను ఆఫ్‌సెట్ చేయడంలో సహాయపడే అప్లికేషన్ ప్రవర్తన, రూటింగ్ లేదా వినియోగదారు నోటిఫికేషన్ గురించి నిర్ణయాలు తీసుకోవడానికి మిమ్మల్ని అనుమతిస్తుంది.

![మీ వర్క్‌లోడ్ మరియు ISP సమస్యల కలయిక](../images/internet_monitor_2.png)

:::info
	ఇంటర్నెట్‌ను ట్రావర్స్ చేసే ట్రాఫిక్‌ను గమనించే monitors ను మాత్రమే సృష్టించండి. ప్రైవేట్ నెట్‌వర్క్‌లోని ([RFC1918](https://www.arin.net/reference/research/statistics/address_filters/)) రెండు hosts మధ్య వంటి ప్రైవేట్ ట్రాఫిక్‌ను Internet Monitor ఉపయోగించి మానిటర్ చేయడం సాధ్యం కాదు.
:::
:::info
	వర్తించే చోట మొబైల్ అప్లికేషన్‌ల నుండి ట్రాఫిక్‌కు ప్రాధాన్యత ఇవ్వండి. ప్రొవైడర్‌ల మధ్య రోమింగ్ చేసే, లేదా మారుమూల భౌగోళిక ప్రదేశాలలో ఉన్న కస్టమర్లు మీకు తెలిసి ఉండవలసిన భిన్నమైన లేదా ఊహించని అనుభవాలను కలిగి ఉండవచ్చు.
:::
## EventBridge మరియు CloudWatch ద్వారా actions ను ఎనేబుల్ చేయండి

పరిశీలించబడిన సమస్యలు `aws.internetmonitor` గా గుర్తించబడిన source ను కలిగి ఉన్న [schema](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-IM-EventBridge-integration.html) ఉపయోగించి [EventBridge](https://aws.amazon.com/eventbridge/) ద్వారా ప్రచురించబడతాయి. EventBridge మీ టికెట్ నిర్వహణ వ్యవస్థలో స్వయంచాలకంగా సమస్యలను సృష్టించడానికి, మీ సపోర్ట్ టీమ్‌లను పేజ్ చేయడానికి లేదా కొన్ని దృశ్యాలను తగ్గించడానికి మీ వర్క్‌లోడ్‌ను మార్చగల ఆటోమేషన్‌ను ట్రిగ్గర్ చేయడానికి కూడా ఉపయోగించవచ్చు.

```json
{
  "source": ["aws.internetmonitor"]
}
```

అదేవిధంగా, పరిశీలించబడిన నగరాలు, దేశాలు, metros మరియు subdivisions కోసం ట్రాఫిక్ యొక్క విస్తృత వివరాలు [CloudWatch Logs](./logs/index.md) లో అందుబాటులో ఉన్నాయి. ఇది ప్రభావిత కస్టమర్లకు వారికి స్థానికమైన సమస్యల గురించి ముందుగానే నోటిఫై చేయగల అత్యంత-లక్ష్యిత actions ను సృష్టించడానికి మిమ్మల్ని అనుమతిస్తుంది. ఒక ప్రొవైడర్ గురించి దేశ-స్థాయి పరిశీలన యొక్క ఉదాహరణ ఇక్కడ ఉంది:

```json
{
    "version": 1,
    "timestamp": 1669659900,
    "clientLocation": {
        "latitude": 0,
        "longitude": 0,
        "country": "United States",
        "subdivision": "",
        "metro": "",
        "city": "",
        "countryCode": "US",
        "subdivisionCode": "",
        "asn": 00000,
        "networkName": "MY-AWESOME-ASN"
    },
    "serviceLocation": "us-east-1",
    "percentageOfTotalTraffic": 0.36,
    "bytesIn": 23,
    "bytesOut": 0,
    "clientConnectionCount": 0,
    "internetHealth": {
        "availability": {
            "experienceScore": 100,
            "percentageOfTotalTrafficImpacted": 0,
            "percentageOfClientLocationImpacted": 0
        },
        "performance": {
            "experienceScore": 100,
            "percentageOfTotalTrafficImpacted": 0,
            "percentageOfClientLocationImpacted": 0,
            "roundTripTime": {
                "p50": 71,
                "p90": 72,
                "p95": 73
            }
        }
    },
    "trafficInsights": {
        "timeToFirstByte": {
            "currentExperience": {
                "serviceName": "VPC",
                "serviceLocation": "us-east-1",
                "value": 48
            },
            "ec2": {
                "serviceName": "EC2",
                "serviceLocation": "us-east-1",
                "value": 48
            }
        }
    }
}
```

:::info
	`percentageOfTotalTraffic` వంటి విలువలు మీ కస్టమర్లు మీ వర్క్‌లోడ్‌లను ఎక్కడ నుండి యాక్సెస్ చేస్తారనే దాని గురించి శక్తివంతమైన insights ను వెల్లడించగలవు మరియు అధునాతన విశ్లేషణల కోసం ఉపయోగించవచ్చు.
:::

:::warning
	Internet Monitor ద్వారా సృష్టించబడిన log groups *ఎప్పుడూ గడువు తీరదు* అని సెట్ చేయబడిన డిఫాల్ట్ retention period ను కలిగి ఉంటాయని గమనించండి. AWS మీ సమ్మతి లేకుండా మీ డేటాను తొలగించదు, కాబట్టి మీ అవసరాలకు అర్థవంతమైన retention period ను సెట్ చేయడం నిర్ధారించుకోండి.
:::
:::info
	ప్రతి monitor కనీసం 10 వేరు వేరు CloudWatch metrics ను సృష్టిస్తుంది. మీరు ఏదైనా ఇతర operational metric తో చేసినట్లే [alarms](./alarms.md) సృష్టించడానికి వీటిని ఉపయోగించాలి.
:::
## ట్రాఫిక్ ఆప్టిమైజేషన్ సూచనలను ఉపయోగించండి

Internet Monitor ట్రాఫిక్ ఆప్టిమైజేషన్ రికమెండేషన్‌లను కలిగి ఉంది, ఇవి ఉత్తమ కస్టమర్ అనుభవాలను కలిగి ఉండటానికి మీ వర్క్‌లోడ్‌లను ఎక్కడ ఉంచాలో మీకు సలహా ఇవ్వగలవు. గ్లోబల్ వర్క్‌లోడ్‌లు లేదా గ్లోబల్ కస్టమర్లు ఉన్న వాటికి, ఈ ఫీచర్ ప్రత్యేకంగా విలువైనది.

![Internet Monitor console](../images/internet_monitor_3.png)

:::info
	ట్రాఫిక్ ఆప్టిమైజేషన్ సూచనల వీక్షణలో ప్రస్తుత, అంచనా వేయబడిన మరియు అత్యల్ప time-to-first-byte (TTFB) విలువలపై ప్రత్యేక శ్రద్ధ వహించండి, ఎందుకంటే ఇవి పరిశీలించడానికి కష్టమైన సంభావ్య పేలవ ఎండ్-యూజర్ అనుభవాలను సూచించగలవు.
:::
[^1]: ఈ కొత్త ఫీచర్ గురించి మా లాంచ్ బ్లాగ్ కోసం [https://aws.amazon.com/blogs/aws/cloudwatch-internet-monitor-end-to-end-visibility-into-internet-performance-for-your-applications/](https://aws.amazon.com/blogs/aws/cloudwatch-internet-monitor-end-to-end-visibility-into-internet-performance-for-your-applications/) చూడండి.

# AWS App Runner

[AWS App Runner][apprunner-main] అనేది పూర్తిగా నిర్వహించబడే సర్వీస్, ఇది డెవలపర్లు కంటైనరైజ్డ్ వెబ్ అప్లికేషన్లు మరియు APIలను స్కేల్ వద్ద త్వరగా డిప్లాయ్ చేయడం సులభం చేస్తుంది, ముందుగా ఇన్‌ఫ్రాస్ట్రక్చర్ అనుభవం అవసరం లేదు. మీ సోర్స్ కోడ్ లేదా కంటైనర్ ఇమేజ్‌తో ప్రారంభించండి. App Runner వెబ్ అప్లికేషన్‌ను స్వయంచాలకంగా నిర్మించి డిప్లాయ్ చేస్తుంది, ఎన్‌క్రిప్షన్‌తో ట్రాఫిక్‌ను లోడ్ బ్యాలెన్స్ చేస్తుంది, మీ ట్రాఫిక్ అవసరాలను తీర్చడానికి స్కేల్ చేస్తుంది మరియు ప్రైవేట్ Amazon VPC లో నడిచే ఇతర AWS సర్వీసులు మరియు అప్లికేషన్‌లతో మీ సర్వీసులు కమ్యూనికేట్ చేయడం సులభం చేస్తుంది. App Runner తో, సర్వర్లు లేదా స్కేలింగ్ గురించి ఆలోచించే బదులు, మీ అప్లికేషన్‌లపై దృష్టి పెట్టడానికి మీకు ఎక్కువ సమయం ఉంటుంది.




కింది రెసిపీలను చూడండి:

## సాధారణం
- [Container Day - Docker Con | డెవలపర్లు ఎలా స్కేల్ వద్ద ప్రొడక్షన్ వెబ్ అప్లికేషన్‌లకు సులభంగా చేరుకోగలరు](https://www.youtube.com/watch?v=Iyp9Ugk9oRs)
- [AWS Blog | AWS App Runner సర్వీసుల కోసం సెంట్రలైజ్డ్ observability](https://aws.amazon.com/blogs/containers/centralized-observability-for-aws-app-runner-services/)
- [AWS Blog | AWS App Runner VPC నెట్‌వర్కింగ్ కోసం Observability](https://aws.amazon.com/blogs/containers/observability-for-aws-app-runner-vpc-networking/)
- [AWS Blog | Amazon EventBridge తో AWS App Runner అప్లికేషన్‌లను నియంత్రించడం మరియు మానిటర్ చేయడం](https://aws.amazon.com/blogs/containers/controlling-and-monitoring-aws-app-runner-applications-with-amazon-eventbridge/)


## లాగ్‌లు

- [CloudWatch Logs కు స్ట్రీమ్ చేయబడిన App Runner లాగ్‌లను చూడడం][apprunner-cwl]

## మెట్రిక్స్

- [CloudWatch కు రిపోర్ట్ చేయబడిన App Runner సర్వీస్ మెట్రిక్స్ చూడడం][apprunner-cwm]


## ట్రేసెస్
- [AWS Distro for OpenTelemetry ఉపయోగించి App Runner కోసం AWS X-Ray ట్రేసింగ్‌తో ప్రారంభించడం](https://aws-otel.github.io/docs/getting-started/apprunner)
- [Containers from the Couch | AWS App Runner X-Ray ఇంటిగ్రేషన్](https://youtu.be/cVr8N7enCMM)
- [AWS Blog | OpenTelemetry తో AWS App Runner సర్వీస్‌ను ట్రేస్ చేయడం](https://aws.amazon.com/blogs/containers/tracing-an-aws-app-runner-service-using-aws-x-ray-with-opentelemetry/)
- [AWS Blog | AWS Copilot CLI ఉపయోగించి AWS App Runner సర్వీస్ కోసం AWS X-Ray ట్రేసింగ్ ఎనేబుల్ చేయడం](https://aws.amazon.com/blogs/containers/enabling-aws-x-ray-tracing-for-aws-app-runner-service-using-aws-copilot-cli/)

[apprunner-main]: https://aws.amazon.com/apprunner/
[aes-ws]: https://bookstore.aesworkshops.com/
[apprunner-cwl]: https://docs.aws.amazon.com/apprunner/latest/dg/monitor-cwl.html
[apprunner-cwm]: https://docs.aws.amazon.com/apprunner/latest/dg/monitor-cw.html

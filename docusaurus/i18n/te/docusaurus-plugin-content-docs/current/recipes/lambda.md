# AWS Lambda

[AWS Lambda][lambda-main] అనేది సర్వర్‌లను ప్రొవిజన్ చేయడం లేదా నిర్వహించడం, వర్క్‌లోడ్-అవేర్ క్లస్టర్ స్కేలింగ్ లాజిక్ సృష్టించడం, ఈవెంట్ ఇంటిగ్రేషన్‌లను నిర్వహించడం లేదా రన్‌టైమ్‌లను నిర్వహించడం అవసరం లేకుండా కోడ్ రన్ చేయడానికి మిమ్మల్ని అనుమతించే సర్వర్‌లెస్ కంప్యూట్ సర్వీస్.

కింది రెసిపీలను చూడండి:

## లాగ్‌లు

- [సర్వర్‌లెస్ అప్లికేషన్‌ను డిప్లాయ్ చేసి మానిటర్ చేయడం][aes-ws]

## మెట్రిక్స్

- [CloudWatch Lambda Insights పరిచయం][lambda-cwi]
- [Firehose మరియు AWS Lambda ద్వారా Cloudwatch Metric Streams ను Amazon Managed Service for Prometheus కు ఎక్స్‌పోర్ట్ చేయడం](recipes/lambda-cw-metrics-go-amp.md)

## ట్రేసెస్

- [AWS Distro for OpenTelemetry Lambda లేయర్‌తో Python అప్లికేషన్‌ను ఆటో-ఇన్‌స్ట్రుమెంట్ చేయడం][lambda-layer-python-xray-adot]
- [OpenTelemetry తో AWS X-Ray లో AWS Lambda ఫంక్షన్‌లను ట్రేస్ చేయడం][lambda-xray-adot]

[lambda-main]: https://aws.amazon.com/lambda/
[aes-ws]: https://bookstore.aesworkshops.com/
[lambda-cwi]: https://aws.amazon.com/blogs/mt/introducing-cloudwatch-lambda-insights/
[lambda-xray-adot]: https://aws.amazon.com/blogs/opensource/tracing-aws-lambda-functions-in-aws-x-ray-with-opentelemetry/
[lambda-layer-python-xray-adot]: https://aws.amazon.com/blogs/opensource/auto-instrumenting-a-python-application-with-an-aws-distro-for-opentelemetry-lambda-layer/

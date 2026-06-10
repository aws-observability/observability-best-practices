# AWS Lambda

[AWS Lambda][lambda-main] एक सर्वरलेस कंप्यूट सर्विस है जो आपको सर्वर प्रोविजन या प्रबंधित किए बिना,
वर्कलोड-अवेयर क्लस्टर स्केलिंग लॉजिक बनाए, इवेंट एकीकरण बनाए रखे, या रनटाइम प्रबंधित किए बिना कोड चलाने देती है।

निम्नलिखित रेसिपी देखें:

## लॉग्स

- [सर्वरलेस एप्लिकेशन डिप्लॉय और मॉनिटर करें][aes-ws]

## मेट्रिक्स

- [CloudWatch Lambda Insights का परिचय][lambda-cwi]
- [Firehose और AWS Lambda के माध्यम से CloudWatch Metric Streams को Amazon Managed Service for Prometheus में एक्सपोर्ट करना](recipes/lambda-cw-metrics-go-amp.md)

## ट्रेसेस

- [AWS Distro for OpenTelemetry Lambda लेयर के साथ Python एप्लिकेशन का ऑटो-इंस्ट्रूमेंटेशन][lambda-layer-python-xray-adot]
- [OpenTelemetry के साथ AWS X-Ray में AWS Lambda फ़ंक्शन की ट्रेसिंग][lambda-xray-adot]

[lambda-main]: https://aws.amazon.com/lambda/
[aes-ws]: https://bookstore.aesworkshops.com/
[lambda-cwi]: https://aws.amazon.com/blogs/mt/introducing-cloudwatch-lambda-insights/
[lambda-xray-adot]: https://aws.amazon.com/blogs/opensource/tracing-aws-lambda-functions-in-aws-x-ray-with-opentelemetry/
[lambda-layer-python-xray-adot]: https://aws.amazon.com/blogs/opensource/auto-instrumenting-a-python-application-with-an-aws-distro-for-opentelemetry-lambda-layer/

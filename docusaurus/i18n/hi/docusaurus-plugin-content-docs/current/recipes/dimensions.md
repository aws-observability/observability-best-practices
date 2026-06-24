# डाइमेंशन्स

इस साइट के संदर्भ में हम o11y स्पेस को छह डाइमेंशन्स में देखते हैं।
प्रत्येक डाइमेंशन को स्वतंत्र रूप से देखना एनालिसिसात्मक दृष्टिकोण से लाभदायक है, अर्थात, जब आप किसी दिए गए वर्कलोड के लिए एक ठोस o11y समाधान बनाने का प्रयास कर रहे हैं, जिसमें उपयोग की जाने वाली प्रोग्रामिंग भाषा जैसे डेवलपर-संबंधित पहलुओं के साथ-साथ कंटेनर या Lambda फ़ंक्शन जैसे रनटाइम एनवायरनमेंट जैसे ऑपरेशनल विषय शामिल हैं।

![o11y space](images/o11y-space.png)


:::note
    "सिग्नल क्या है?"
    जब हम यहाँ सिग्नल कहते हैं तो हमारा मतलब किसी भी प्रकार के o11y डेटा और मेटाडेटा पॉइंट्स से है,
    जिसमें लॉग एंट्रीज़, मेट्रिक्स और ट्रेसेस शामिल हैं। जब तक हम अधिक विशिष्ट होना नहीं चाहते या
    होना आवश्यक नहीं है, हम "सिग्नल" का उपयोग करते हैं और संदर्भ से स्पष्ट होना चाहिए कि
    कौन सी सीमाएँ लागू हो सकती हैं।
:::

आइए अब छह डाइमेंशन्स में से प्रत्येक को एक-एक करके देखें:

## डेस्टिनेशन्स

इस डाइमेंशन में हम सभी प्रकार के सिग्नल डेस्टिनेशन्स पर विचार करते हैं जिसमें लॉन्ग टर्म
स्टोरेज और ग्राफिकल इंटरफेस शामिल हैं जो आपको सिग्नल्स का उपभोग करने देते हैं। एक डेवलपर के रूप में,
आप एक UI या API तक पहुँच चाहते हैं जो आपको अपनी सर्विस की समस्या निवारण के लिए सिग्नल्स को खोजने, देखने और
सहसंबंधित करने की अनुमति दे। इन्फ्रास्ट्रक्चर या प्लेटफ़ॉर्म भूमिका में
आप एक UI या API तक पहुँच चाहते हैं जो आपको इन्फ्रास्ट्रक्चर की स्थिति को समझने के लिए सिग्नल्स को प्रबंधित, खोजने, देखने और
सहसंबंधित करने की अनुमति दे।

![Grafana screen shot](images/grafana.png)

अंततः, यह मानवीय दृष्टिकोण से सबसे दिलचस्प डाइमेंशन है।
हालाँकि, लाभ उठाने में सक्षम होने के लिए पहले हमें थोड़ा काम करना होगा: हमें अपने सॉफ़्टवेयर और बाहरी निर्भरताओं को इंस्ट्रूमेंट करना होगा और
सिग्नल्स को डेस्टिनेशन्स में इंजेस्ट करना होगा।

तो, सिग्नल्स डेस्टिनेशन्स तक कैसे पहुँचते हैं? अच्छा सवाल, यह है ...

## एजेंट्स

सिग्नल्स कैसे एकत्र और एनालिटिक्स तक रूट किए जाते हैं। सिग्नल्स
दो स्रोतों से आ सकते हैं: या तो आपके एप्लिकेशन सोर्स कोड से (भाषा
अनुभाग भी देखें) या उन चीज़ों से जिन पर आपका एप्लिकेशन निर्भर करता है,
जैसे डेटास्टोर्स में प्रबंधित स्टेट तथा VPC जैसा इन्फ्रास्ट्रक्चर (इन्फ्रा
और डेटा अनुभाग भी देखें)।

एजेंट्स टेलीमेट्री का हिस्सा हैं जिनका उपयोग आप सिग्नल्स एकत्र करने और इंजेस्ट करने के लिए करेंगे। दूसरा हिस्सा इंस्ट्रूमेंटेड एप्लिकेशन और
डेटाबेस जैसे इन्फ्रा पीसेस हैं।

## भाषाएँ

यह डाइमेंशन उस प्रोग्रामिंग भाषा से संबंधित है जिसका उपयोग आप अपनी
सर्विस या एप्लिकेशन लिखने के लिए करते हैं। यहाँ, हम SDK और लाइब्रेरीज़ से निपटते हैं, जैसे
[X-Ray SDKs][xraysdks] या OpenTelemetry जो [इंस्ट्रूमेंटेशन][otelinst] के संदर्भ में प्रदान करता है। आप यह सुनिश्चित करना चाहते हैं कि एक o11y समाधान
दिए गए सिग्नल प्रकार जैसे लॉग्स या मेट्रिक्स के लिए आपकी पसंद की प्रोग्रामिंग भाषा का समर्थन करता है।

## इन्फ्रास्ट्रक्चर और डेटाबेस

इस डाइमेंशन से हमारा मतलब किसी भी प्रकार की एप्लिकेशन-बाहरी निर्भरताओं से है,
चाहे वह VPC जैसा इन्फ्रास्ट्रक्चर हो जिसमें सर्विस चल रही है या RDS या DynamoDB जैसा डेटास्टोर
या SQS जैसी कतार।

:::tip
    "समानताएँ"
    इस डाइमेंशन में सभी स्रोतों में एक बात समान है
    कि वे आपके एप्लिकेशन (साथ ही आपके ऐप
    जिस कंप्यूट एनवायरनमेंट में चलता है) के बाहर स्थित हैं और इसके साथ आपको
    उन्हें एक ओपेक बॉक्स के रूप में मानना होगा।
:::

इस डाइमेंशन में शामिल हैं लेकिन इन तक सीमित नहीं हैं:

- AWS इन्फ्रास्ट्रक्चर, उदाहरण के लिए [VPC फ्लो लॉग्स][vpcfl]।
- सेकेंडरी API जैसे [Kubernetes कंट्रोल प्लेन लॉग्स][kubecpl]।
- डेटास्टोर्स से सिग्नल्स, जैसे [S3][s3mon], [RDS][rdsmon] या [SQS][sqstrace]।


## कंप्यूट यूनिट

जिस तरह से आप अपने कोड को पैकेज, शेड्यूल और रन करते हैं। उदाहरण के लिए, Lambda में यह एक
फ़ंक्शन है और [ECS][ecs] और [EKS][eks] में वह यूनिट एक कंटेनर है जो
टास्क्स (ECS) या पॉड्स (EKS) में क्रमशः चलता है। Kubernetes जैसे कंटेनराइज्ड एनवायरनमेंट
अक्सर टेलीमेट्री डिप्लॉयमेंट के संबंध में दो विकल्प प्रदान करते हैं: साइड कार्स के रूप में या
पर-नोड (इंस्टेंस) डेमन प्रोसेसेज के रूप में।

## कंप्यूट इंजन

यह डाइमेंशन बेस रनटाइम एनवायरनमेंट को संदर्भित करता है, जो (EC2
इंस्टेंस के मामले में, उदाहरण के लिए) आपकी जिम्मेदारी हो सकता है या नहीं भी हो सकता है (Fargate या Lambda जैसी सर्वरलेस ऑफरिंग्स) प्रोविजन और पैच करने की। आपके द्वारा उपयोग किए जाने वाले कंप्यूट इंजन के आधार पर,
टेलीमेट्री भाग पहले से ही ऑफरिंग का हिस्सा हो सकता है, उदाहरण के लिए,
[EKS on Fargate][firelensef] में Fluent Bit के माध्यम से लॉग रूटिंग एकीकृत है।


[aes]: https://aws.amazon.com/elasticsearch-service/ "Amazon Elasticsearch Service"
[adot]: https://aws-otel.github.io/ "AWS Distro for OpenTelemetry"
[amg]: https://aws.amazon.com/grafana/ "Amazon Managed Grafana"
[amp]: https://aws.amazon.com/prometheus/ "Amazon Managed Service for Prometheus"
[batch]: https://aws.amazon.com/batch/ "AWS Batch"
[beans]: https://aws.amazon.com/elasticbeanstalk/ "AWS Elastic Beanstalk"
[cw]: https://aws.amazon.com/cloudwatch/ "Amazon CloudWatch"
[dimensions]: ../dimensions
[ec2]: https://aws.amazon.com/ec2/ "Amazon EC2"
[ecs]: https://aws.amazon.com/ecs/ "Amazon Elastic Container Service"
[eks]: https://aws.amazon.com/eks/ "Amazon Elastic Kubernetes Service"
[fargate]: https://aws.amazon.com/fargate/ "AWS Fargate"
[fluentbit]: https://fluentbit.io/ "Fluent Bit"
[firelensef]: https://aws.amazon.com/blogs/containers/fluent-bit-for-amazon-eks-on-aws-fargate-is-here/ "Fluent Bit for Amazon EKS on AWS Fargate is here"
[jaeger]: https://www.jaegertracing.io/ "Jaeger"
[kafka]: https://kafka.apache.org/ "Apache Kafka"
[kubecpl]: https://docs.aws.amazon.com/eks/latest/userguide/control-plane-logs.html "Amazon EKS control plane logging"
[lambda]: https://aws.amazon.com/lambda/ "AWS Lambda"
[lightsail]: https://aws.amazon.com/lightsail/ "Amazon Lightsail"
[otel]: https://opentelemetry.io/ "OpenTelemetry"
[otelinst]: https://opentelemetry.io/docs/concepts/instrumenting/
[promex]: https://prometheus.io/docs/instrumenting/exporters/ "Prometheus exporters and integrations"
[rdsmon]: https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/Overview.LoggingAndMonitoring.html "Logging and monitoring in Amazon RDS"
[s3]: https://aws.amazon.com/s3/ "Amazon S3"
[s3mon]: https://docs.aws.amazon.com/AmazonS3/latest/userguide/s3-incident-response.html "Logging and monitoring in Amazon S3"
[sqstrace]: https://docs.aws.amazon.com/xray/latest/devguide/xray-services-sqs.html "Amazon SQS and AWS X-Ray"
[vpcfl]: https://docs.aws.amazon.com/vpc/latest/userguide/flow-logs.html "VPC Flow Logs"
[xray]: https://aws.amazon.com/xray/ "AWS X-Ray"
[xraysdks]: https://docs.aws.amazon.com/xray/index.html

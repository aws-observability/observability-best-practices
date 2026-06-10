# AWS App Runner

[AWS App Runner][apprunner-main] एक पूर्ण प्रबंधित सेवा है जो डेवलपर्स के लिए बिना किसी पूर्व इंफ्रास्ट्रक्चर अनुभव की आवश्यकता के, स्केल पर कंटेनराइज्ड वेब एप्लिकेशन और API को तेजी से डिप्लॉय करना आसान बनाती है। अपने सोर्स कोड या कंटेनर इमेज से शुरू करें। App Runner स्वचालित रूप से वेब एप्लिकेशन बनाता और डिप्लॉय करता है, एन्क्रिप्शन के साथ ट्रैफिक को लोड बैलेंस करता है, आपकी ट्रैफिक आवश्यकताओं को पूरा करने के लिए स्केल करता है, और आपकी सेवाओं को प्राइवेट Amazon VPC में चलने वाली अन्य AWS सेवाओं और एप्लिकेशन के साथ आसानी से संवाद करने देता है। App Runner के साथ, सर्वर या स्केलिंग के बारे में सोचने के बजाय, आपके पास अपने एप्लिकेशन पर ध्यान केंद्रित करने के लिए अधिक समय है।




निम्नलिखित रेसिपी देखें:

## सामान्य
- [Container Day - Docker Con | डेवलपर्स कैसे आसानी से स्केल पर प्रोडक्शन वेब एप्लिकेशन तक पहुंच सकते हैं](https://www.youtube.com/watch?v=Iyp9Ugk9oRs)
- [AWS Blog | AWS App Runner सेवाओं के लिए केंद्रीकृत Observability](https://aws.amazon.com/blogs/containers/centralized-observability-for-aws-app-runner-services/)
- [AWS Blog | AWS App Runner VPC नेटवर्किंग के लिए Observability](https://aws.amazon.com/blogs/containers/observability-for-aws-app-runner-vpc-networking/)
- [AWS Blog | Amazon EventBridge के साथ AWS App Runner एप्लिकेशन को नियंत्रित और मॉनिटर करना](https://aws.amazon.com/blogs/containers/controlling-and-monitoring-aws-app-runner-applications-with-amazon-eventbridge/)


## लॉग्स

- [CloudWatch Logs में स्ट्रीम किए गए App Runner लॉग देखना][apprunner-cwl]

## मेट्रिक्स

- [CloudWatch को रिपोर्ट किए गए App Runner सेवा मेट्रिक्स देखना][apprunner-cwm]


## ट्रेस
- [AWS Distro for OpenTelemetry का उपयोग करके App Runner के लिए AWS X-Ray tracing के साथ शुरुआत करना](https://aws-otel.github.io/docs/getting-started/apprunner)
- [Containers from the Couch | AWS App Runner X-Ray Integration](https://youtu.be/cVr8N7enCMM)
- [AWS Blog | OpenTelemetry के साथ AWS X-Ray का उपयोग करके AWS App Runner सेवा को ट्रेस करना](https://aws.amazon.com/blogs/containers/tracing-an-aws-app-runner-service-using-aws-x-ray-with-opentelemetry/)
- [AWS Blog | AWS Copilot CLI का उपयोग करके AWS App Runner सेवा के लिए AWS X-Ray tracing सक्षम करना](https://aws.amazon.com/blogs/containers/enabling-aws-x-ray-tracing-for-aws-app-runner-service-using-aws-copilot-cli/)

[apprunner-main]: https://aws.amazon.com/apprunner/
[aes-ws]: https://bookstore.aesworkshops.com/
[apprunner-cwl]: https://docs.aws.amazon.com/apprunner/latest/dg/monitor-cwl.html
[apprunner-cwm]: https://docs.aws.amazon.com/apprunner/latest/dg/monitor-cw.html

# रेसिपी

यहाँ आपको विभिन्न उपयोग मामलों में Observability (o11y) को लागू करने में मदद करने वाले क्यूरेटेड मार्गदर्शन, हाउ-टू, और अन्य संसाधनों के लिंक मिलेंगे। इसमें [Amazon Managed Service for Prometheus][amp] और [Amazon Managed Grafana][amg] जैसी प्रबंधित सेवाओं के साथ-साथ [OpenTelemetry][otel] और [Fluent Bit][fluentbit] जैसे एजेंट शामिल हैं। यहाँ की सामग्री केवल AWS टूल्स तक सीमित नहीं है, और कई ओपन सोर्स प्रोजेक्ट्स का संदर्भ दिया गया है।

हम डेवलपर्स और इन्फ्रास्ट्रक्चर लोगों दोनों की ज़रूरतों को समान रूप से संबोधित करना चाहते हैं, इसलिए कई रेसिपी "व्यापक दायरे" को कवर करती हैं। हम आपको उन समाधानों को खोजने और खोजने के लिए प्रोत्साहित करते हैं जो आप जो हासिल करना चाहते हैं उसके लिए सबसे अच्छे हैं।

:::info
    यहाँ की सामग्री हमारे Solutions Architects, Professional Services, और अन्य ग्राहकों की प्रतिक्रिया से वास्तविक ग्राहक जुड़ाव से प्राप्त है। यहाँ जो कुछ भी आप पाएंगे वह हमारे वास्तविक ग्राहकों द्वारा उनके अपने एनवायरनमेंट में लागू किया गया है।
:::

हम o11y स्पेस के बारे में जिस तरह से सोचते हैं वह इस प्रकार है: हम इसे
[छह डाइमेंशन्स][dimensions] में विभाजित करते हैं जिन्हें आप फिर एक विशिष्ट समाधान पर पहुँचने के लिए जोड़ सकते हैं:

| डाइमेंशन | उदाहरण |
|---------------|--------------|
| डेस्टिनेशन्स  | [Prometheus][amp] &middot; [Grafana][amg] &middot; [OpenSearch][aes] &middot; [CloudWatch][cw] &middot; [Jaeger][jaeger] |
| एजेंट्स        | [ADOT][adot] &middot; [Fluent Bit][fluentbit] &middot; CW agent &middot; X-Ray agent |
| भाषाएँ     | [Java][java] &middot; Python &middot; .NET &middot; [JavaScript][nodejs] &middot; Go &middot; Rust |
| इन्फ्रा और डेटाबेस  |  [RDS][rds] &middot; [DynamoDB][dynamodb] &middot; [MSK][msk] |
| कंप्यूट यूनिट | [Batch][batch] &middot; [ECS][ecs] &middot; [EKS][eks] &middot; [AEB][beans] &middot; [Lambda][lambda] &middot; [AppRunner][apprunner] |
| कंप्यूट इंजन | [Fargate][fargate] &middot; [EC2][ec2] &middot; [Lightsail][lightsail] |

:::note
    "उदाहरण समाधान आवश्यकता"
    मुझे Fargate पर EKS पर चलने वाले Python ऐप के लिए एक लॉगिंग समाधान चाहिए
    जिसका लक्ष्य आगे उपभोग के लिए लॉग्स को S3 बकेट में स्टोर करना है
:::

एक स्टैक जो इस आवश्यकता को पूरा करेगा वह निम्नलिखित है:

1. *डेस्टिनेशन*: डेटा के आगे उपभोग के लिए एक S3 बकेट
1. *एजेंट*: EKS से लॉग डेटा एमिट करने के लिए FluentBit
1. *भाषा*: Python
1. *इन्फ्रा और DB*: N/A
1. *कंप्यूट यूनिट*: Kubernetes (EKS)
1. *कंप्यूट इंजन*: EC2

हर डाइमेंशन को निर्दिष्ट करने की आवश्यकता नहीं है और कभी-कभी यह तय करना कठिन होता है कि
कहाँ से शुरू करें। विभिन्न रास्तों को आज़माएं और कुछ रेसिपी के फायदे और नुकसान की तुलना करें।

नेविगेशन को सरल बनाने के लिए, हम छह डाइमेंशन को निम्नलिखित
श्रेणियों में समूहित कर रहे हैं:

- **कंप्यूट के अनुसार**: कंप्यूट इंजन और यूनिट्स को कवर करता है
- **इन्फ्रा और डेटा के अनुसार**: इन्फ्रास्ट्रक्चर और डेटाबेस को कवर करता है
- **भाषा के अनुसार**: भाषाओं को कवर करता है
- **डेस्टिनेशन के अनुसार**: टेलीमेट्री और एनालिटिक्स को कवर करता है
- **कार्य**: एनोमली डिटेक्शन, अलर्टिंग, ट्रबलशूटिंग, और अधिक को कवर करता है

[डाइमेंशन्स के बारे में और जानें ...](https://aws-observability.github.io/observability-best-practices/recipes/dimensions/)

## कैसे उपयोग करें

आप या तो शीर्ष नेविगेशन मेनू का उपयोग करके एक विशिष्ट इंडेक्स पेज पर ब्राउज़ कर सकते हैं,
एक मोटे चयन से शुरू करते हुए। उदाहरण के लिए, `By Compute` -> `EKS` ->
`Fargate` -> `Logs`।

वैकल्पिक रूप से, आप `/` या `s` कुंजी दबाकर साइट खोज सकते हैं:

![o11y space](images/search.png)

:::info
   "लाइसेंस"
  इस साइट पर प्रकाशित सभी रेसिपी
	[MIT-0][mit0] लाइसेंस के तहत उपलब्ध हैं, जो सामान्य MIT लाइसेंस का एक संशोधन है
	जो एट्रिब्यूशन की आवश्यकता को हटा देता है।
:::

## कैसे योगदान करें

एक [चर्चा][discussion] शुरू करें कि आप क्या करने की योजना बना रहे हैं और हम वहाँ से आगे बढ़ेंगे।

## और जानें

इस साइट पर रेसिपी एक अच्छी प्रथाओं का संग्रह है। इसके अलावा,
कई स्थान हैं जहाँ आप हमारे द्वारा उपयोग किए जाने वाले ओपन सोर्स
प्रोजेक्ट्स की स्थिति के साथ-साथ रेसिपी की प्रबंधित सेवाओं के बारे में और जान सकते हैं, इसलिए
देखें:

- [observability @ aws][o11yataws], AWS लोगों की अपने प्रोजेक्ट्स और सेवाओं के बारे में बात करने वाली प्लेलिस्ट।
- [AWS observability workshops](https://aws-observability.github.io/observability-best-practices/recipes/workshops/), एक संरचित तरीके से ऑफरिंग्स को आज़माने के लिए।
- [AWS monitoring and observability][o11yhome] होमपेज जिसमें केस स्टडीज़ और पार्टनर्स के पॉइंटर्स हैं।

[aes]: aes.md "Amazon Elasticsearch Service"
[adot]: https://aws-otel.github.io/ "AWS Distro for OpenTelemetry"
[amg]: amg.md "Amazon Managed Grafana"
[amp]: amp.md "Amazon Managed Service for Prometheus"
[batch]: https://aws.amazon.com/batch/ "AWS Batch"
[beans]: https://aws.amazon.com/elasticbeanstalk/ "AWS Elastic Beanstalk"
[cw]: cw.md "Amazon CloudWatch"
[dimensions]: dimensions.md
[dynamodb]: dynamodb.md "Amazon DynamoDB"
[ec2]: https://aws.amazon.com/ec2/ "Amazon EC2"
[ecs]: ecs.md "Amazon Elastic Container Service"
[eks]: eks.md "Amazon Elastic Kubernetes Service"
[fargate]: https://aws.amazon.com/fargate/ "AWS Fargate"
[fluentbit]: https://fluentbit.io/ "Fluent Bit"
[jaeger]: https://www.jaegertracing.io/ "Jaeger"
[kafka]: https://kafka.apache.org/ "Apache Kafka"
[apprunner]: apprunner.md "AWS App Runner"
[lambda]: lambda.md "AWS Lambda"
[lightsail]: https://aws.amazon.com/lightsail/ "Amazon Lightsail"
[otel]: https://opentelemetry.io/ "OpenTelemetry"
[java]: java.md
[nodejs]: nodejs.md
[rds]: rds.md "Amazon Relational Database Service"
[msk]: msk.md "Amazon Managed Streaming for Apache Kafka"
[mit0]: https://github.com/aws/mit-0 "MIT-0"
[discussion]: https://github.com/aws-observability/observability-best-practices/discussions "Discussions"
[o11yataws]: https://www.youtube.com/playlist?list=PLaiiCkpc1U7Wy7XwkpfgyOhIf_06IK3U_ "Observability @ AWS YouTube playlist"
[o11yhome]: https://aws.amazon.com/products/management-and-governance/use-cases/monitoring-and-observability/ "AWS Observability home"

# AWS X-Ray - FAQ

## क्या AWS Distro for Open Telemetry (ADOT) Event Bridge या SQS जैसी AWS सेवाओं में ट्रेस प्रोपेगेशन का समर्थन करता है?

तकनीकी रूप से, यह ADOT नहीं बल्कि AWS X-Ray है। हम उन AWS सेवाओं की संख्या और प्रकार का विस्तार करने पर काम कर रहे हैं जो spans को प्रोपेगेट और/या जनरेट करती हैं। यदि आपके पास इस पर निर्भर कोई उपयोग मामला है, तो कृपया हमसे संपर्क करें।

## क्या मैं ADOT का उपयोग करके AWS X-Ray में spans इंजेस्ट करने के लिए W3C trace header का उपयोग कर पाऊंगा?

हां। [W3C trace header](https://aws.amazon.com/about-aws/whats-new/2023/10/aws-x-ray-w3c-format-trace-ids-distributed-tracing/) 27 अक्टूबर 2023 को रिलीज़ किया गया था।

## क्या मैं Lambda functions के बीच अनुरोधों को ट्रेस कर सकता हूं जब SQS बीच में शामिल हो?

हां। X-Ray अब Lambda functions के बीच ट्रेसिंग का समर्थन करता है जब SQS बीच में शामिल हो। upstream मैसेज प्रोड्यूसर्स से ट्रेस स्वचालित रूप से downstream Lambda consumer nodes से ट्रेस के साथ [लिंक किए जाते हैं](https://docs.aws.amazon.com/xray/latest/devguide/xray-services-sqs.html), जो एप्लिकेशन का एंड-टू-एंड दृश्य बनाता है।

## क्या मुझे अपने एप्लिकेशन को इंस्ट्रूमेंट करने के लिए X-Ray SDK या OTel SDK का उपयोग करना चाहिए?

OTel X-Ray SDK की तुलना में अधिक फ़ीचर प्रदान करता है, लेकिन यह चुनने के लिए कि आपके उपयोग के मामले के लिए कौन सा सही है, [Choosing between ADOT and X-Ray SDK](https://docs.aws.amazon.com/xray/latest/devguide/xray-instrumenting-your-app.html#xray-instrumenting-choosing) देखें

## क्या AWS X-Ray में [span events](https://opentelemetry.io/docs/instrumentation/ruby/manual/#add-span-events) समर्थित हैं?

Span events X-Ray मॉडल में फ़िट नहीं होते हैं और इसलिए ड्रॉप कर दिए जाते हैं।

## मैं AWS X-Ray से डेटा कैसे निकाल सकता हूं?

आप [X-Ray APIs का उपयोग करके](https://docs.aws.amazon.com/xray/latest/devguide/xray-api-gettingdata.html) Service Graph, Traces और Root cause analytics डेटा प्राप्त कर सकते हैं।

## क्या मैं 100% सैंपलिंग प्राप्त कर सकता हूं? यानी, मैं चाहता हूं कि सभी ट्रेस बिना सैंपलिंग के रिकॉर्ड किए जाएं।

आप सैंपलिंग नियमों को समायोजित कर सकते हैं ताकि काफ़ी बढ़ी हुई मात्रा में ट्रेस डेटा कैप्चर किया जा सके। जब तक भेजे गए कुल segments [यहां उल्लिखित सेवा कोटा सीमाओं](https://docs.aws.amazon.com/general/latest/gr/xray.html#limits_xray) का उल्लंघन नहीं करते, X-Ray कॉन्फ़िगर किए अनुसार डेटा एकत्र करने का प्रयास करेगा। इसका परिणामस्वरूप 100% ट्रेस डेटा कैप्चर होने की कोई गारंटी नहीं है।

## क्या मैं APIs के माध्यम से सैंपलिंग नियमों को गतिशील रूप से बढ़ा या घटा सकता हूं?

हां, आप आवश्यकतानुसार गतिशील रूप से समायोजन करने के लिए [X-Ray sampling APIs](https://docs.aws.amazon.com/xray/latest/devguide/xray-api-sampling.html) का उपयोग कर सकते हैं। उपयोग-मामले आधारित स्पष्टीकरण के लिए यह [ब्लॉग](https://aws.amazon.com/blogs/mt/dynamically-adjusting-x-ray-sampling-rules/) देखें।

**प्रोडक्ट FAQ:** [https://aws.amazon.com/xray/faqs/](https://aws.amazon.com/xray/faqs/)

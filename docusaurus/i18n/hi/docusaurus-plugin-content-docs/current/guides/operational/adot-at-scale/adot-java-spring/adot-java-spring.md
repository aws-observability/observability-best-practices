# Java Spring Integration अनुप्रयोगों को इंस्ट्रूमेंट करना

यह लेख [Open Telemetry](https://opentelemetry.io/) और [X-ray](https://aws.amazon.com/xray/) का उपयोग करके [Spring-Integration](https://docs.spring.io/spring-integration/reference/overview.html) अनुप्रयोगों को मैन्युअल रूप से इंस्ट्रूमेंट करने के दृष्टिकोण का वर्णन करता है।

Spring-Integration फ्रेमवर्क event-driven आर्किटेक्चर और messaging-centric आर्किटेक्चर के लिए विशिष्ट एकीकरण समाधानों के विकास को सक्षम करने के लिए डिज़ाइन किया गया है। दूसरी ओर, OpenTelemetry माइक्रोसर्विसेज आर्किटेक्चर पर अधिक केंद्रित है, जिसमें सेवाएं HTTP अनुरोधों का उपयोग करके एक-दूसरे के साथ संवाद और समन्वय करती हैं। इसलिए यह गाइड OpenTelemetry API के साथ manual instrumentation का उपयोग करके Spring-Integration अनुप्रयोगों को इंस्ट्रूमेंट करने का एक उदाहरण प्रदान करेगा।

## पृष्ठभूमि जानकारी

### ट्रेसिंग क्या है?

[OpenTelemetry डॉक्यूमेंटेशन](https://opentelemetry.io/docs/concepts/signals/traces/) से निम्नलिखित उद्धरण trace के उद्देश्य का एक अच्छा अवलोकन देता है:

:::note
    ट्रेसेस हमें यह बड़ी तस्वीर देते हैं कि जब किसी एप्लिकेशन को अनुरोध किया जाता है तो क्या होता है। चाहे आपका एप्लिकेशन एकल डेटाबेस वाला monolith हो या सेवाओं का एक परिष्कृत mesh, ट्रेसेस यह समझने के लिए आवश्यक हैं कि एक अनुरोध आपके एप्लिकेशन में पूर्ण "पथ" कैसे लेता है।
:::
यह देखते हुए कि ट्रेसिंग के मुख्य लाभों में से एक अनुरोध की एंड-टू-एंड दृश्यता है, ट्रेसेस के लिए अनुरोध मूल से लेकर backend तक सही ढंग से लिंक करना महत्वपूर्ण है। OpenTelemetry में ऐसा करने का एक सामान्य तरीका [nested spans](https://opentelemetry.io/docs/instrumentation/java/manual/#create-nested-spans) का उपयोग करना है। यह माइक्रोसर्विसेज आर्किटेक्चर में काम करता है जहां spans सेवा से सेवा तक पास किए जाते हैं जब तक वे अंतिम गंतव्य तक नहीं पहुंच जाते। Spring Integration एप्लिकेशन में, हमें दूरस्थ और स्थानीय दोनों रूप से बनाए गए spans के बीच parent/child संबंध बनाने की आवश्यकता है।

## Context Propagation का उपयोग करके ट्रेसिंग

हम context propagation का उपयोग करके एक दृष्टिकोण प्रदर्शित करेंगे। हालांकि यह दृष्टिकोण पारंपरिक रूप से तब उपयोग किया जाता है जब आपको स्थानीय और दूरस्थ स्थानों पर बनाए गए spans के बीच parent/child संबंध बनाने की आवश्यकता होती है, इसका उपयोग Spring Integration Application के मामले में किया जाएगा क्योंकि यह कोड को सरल बनाता है और एप्लिकेशन को स्केल करने की अनुमति देगा: कई threads में समानांतर रूप से messages को प्रसंस्करित करना संभव होगा और यदि हमें विभिन्न hosts में messages को प्रसंस्करित करने की आवश्यकता है तो क्षैतिज रूप से स्केल करना भी संभव होगा।

यहां इसे प्राप्त करने के लिए आवश्यक चीज़ों का एक अवलोकन है:

- एक ```ChannelInterceptor``` बनाएं और इसे ```GlobalChannelInterceptor``` के रूप में रजिस्टर करें ताकि यह सभी channels पर भेजे जा रहे messages को कैप्चर कर सके।

- ```ChannelInterceptor``` में:
  - ```preSend``` method में:
    - upstream में जनरेट किए जा रहे पिछले message से context पढ़ने का प्रयास करें। यहीं हम upstream messages से spans को कनेक्ट करने में सक्षम होते हैं। यदि कोई context मौजूद नहीं है, तो एक नया trace शुरू किया जाता है (यह OpenTelemetry SDK द्वारा किया जाता है)।
    - एक अद्वितीय नाम के साथ एक Span बनाएं जो उस ऑपरेशन की पहचान करे। यह उस channel का नाम हो सकता है जहां यह message प्रसंस्करित किया जा रहा है।
    - वर्तमान context को message में सहेजें।
    - context और scope को thread.local में स्टोर करें ताकि उन्हें बाद में बंद किया जा सके।
    - downstream भेजे जा रहे message में context इंजेक्ट करें।
  - ```afterSendCompletion``` में:
    - thread.local से context और scope को पुनर्स्थापित करें।
    - context से span को पुनः बनाएं।
    - message प्रसंस्करण के दौरान उठाए गए किसी भी exception को रजिस्टर करें।
    - Scope बंद करें।
    - Span समाप्त करें।

यह एक सरलीकृत विवरण है कि क्या करने की आवश्यकता है। हम एक कार्यात्मक नमूना एप्लिकेशन प्रदान कर रहे हैं जो Spring-Integration फ्रेमवर्क का उपयोग करता है। इस एप्लिकेशन का कोड [यहां](https://github.com/rapphil/spring-integration-samples/tree/rapphil-5.5.x-otel/applications/file-split-ftp) पाया जा सकता है।

एप्लिकेशन को इंस्ट्रूमेंट करने के लिए किए गए केवल परिवर्तनों को देखने के लिए, यह [diff](https://github.com/rapphil/spring-integration-samples/compare/30e01ce9eefd8dae288eca44013810afa8c1a585..6f056a76350340a9658db0cad7fc12dbda505437) देखें।

### इस नमूना एप्लिकेशन को चलाने के लिए:

``` bash
# build and run
mvn spring-boot:run
# create sample input file to trigger flow
echo 'testcontent\nline2content\nlastline' > /tmp/in/testfile.txt
```

इस नमूना एप्लिकेशन के साथ प्रयोग करने के लिए, आपको एप्लिकेशन के समान मशीन पर [ADOT collector](https://aws-otel.github.io/docs/getting-started/collector) निम्नलिखित के समान कॉन्फ़िगरेशन के साथ चलना होगा:

``` yaml
receivers:
  otlp:
    protocols:
      grpc: 
        endpoint: 0.0.0.0:4317
      http:
        endpoint: 0.0.0.0:4318
processors:
  batch/traces:
    timeout: 1s
    send_batch_size: 50
  batch/metrics:
    timeout: 60s
exporters:
  aws xray: region:us-west-2
  aws emf:
    region: us-west-2
service:
  pipelines:
    traces:
      receivers: [otlp]
      processors: [batch/traces]
      exporters: [awsxray]
    metrics:
      receivers: [otlp]
      processors: [batch/metrics]
      exporters: [awsemf]
```

## परिणाम

यदि हम नमूना एप्लिकेशन चलाते हैं और फिर निम्नलिखित कमांड चलाते हैं, तो हमें यह मिलता है:

``` bash
echo 'foo123\nbar123\nfoo1234' > /tmp/in/testfile.txt
```

![X-ray परिणाम](x-ray-results.png)

हम देख सकते हैं कि ऊपर के segments नमूना एप्लिकेशन में वर्णित workflow से मेल खाते हैं। कुछ messages के प्रसंस्करण के दौरान exceptions अपेक्षित हैं, इसलिए हम देख सकते हैं कि वे ठीक से रजिस्टर किए जा रहे हैं और हमें X-Ray में उनका समस्या निवारण करने की अनुमति देंगे।


## FAQ

### हम nested spans कैसे बनाते हैं?

OpenTelemetry में तीन तंत्र हैं जिनका उपयोग spans को कनेक्ट करने के लिए किया जा सकता है:

##### स्पष्ट रूप से (Explicitly)

आपको parent span को उस स्थान पर पास करना होगा जहां child span बनाया गया है और दोनों को निम्न का उपयोग करके लिंक करना होगा:

``` java
    Span childSpan = tracer.spanBuilder("child")
    .setParent(Context.current().with(parentSpan)) 
    .startSpan();
```

##### अंतर्निहित रूप से (Implicitly)

Span context को आंतरिक रूप से thread.local में संग्रहीत किया जाएगा।
यह विधि तब इंगित की जाती है जब आप सुनिश्चित हों कि आप एक ही thread में spans बना रहे हैं।

``` java
    void parentTwo() {
        Span parentSpan = tracer.spanBuilder("parent").startSpan(); 
        try(Scope scope = parentSpan.makeCurrent()) {
            childTwo(); 
        } finally {
        parentSpan.end(); 
        }
    }
    void childTwo() {
        Span childSpan = tracer.spanBuilder("child")
            // NOTE: setParent(...) is not required;
            // `Span.current()` is automatically added as the parent 
            .startSpan();
        try(Scope scope = childSpan.makeCurrent()) { 
            // do stuff
        } finally {
            childSpan.end();
        } 
    }
```

##### Context Propagation  

यह विधि context को कहीं (HTTP headers या एक message में) संग्रहीत करेगी ताकि इसे दूरस्थ स्थान पर ले जाया जा सके जहां child span बनाया गया है। यह कड़ी आवश्यकता नहीं है कि यह एक दूरस्थ स्थान हो। इसका उपयोग उसी प्रक्रिया में भी किया जा सकता है।

### OpenTelemetry properties X-Ray properties में कैसे अनुवादित होती हैं?

कृपया संबंध देखने के लिए निम्नलिखित [गाइड](https://opentelemetry.io/docs/instrumentation/java/manual/#context-propagation) देखें।
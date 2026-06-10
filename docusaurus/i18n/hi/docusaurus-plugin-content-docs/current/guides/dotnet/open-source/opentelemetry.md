# .NET के साथ OpenTelemetry

.NET में OpenTelemetry अन्य भाषाओं में कार्यान्वयन से अलग है क्योंकि यह फ्रेमवर्क की मौजूदा इंस्ट्रूमेंटेशन क्षमताओं पर आधारित है। जबकि अन्य प्लेटफ़ॉर्म को पूर्ण टेलीमेट्री APIs प्रदान करने के लिए OpenTelemetry की आवश्यकता होती है, .NET पहले से ही लॉगिंग, मेट्रिक्स और activities के लिए अपने प्लेटफ़ॉर्म APIs के माध्यम से मजबूत बिल्ट-इन तंत्र प्रदान करता है। OpenTelemetry .NET कार्यान्वयन बस इन मूल कंपोनेंट्स (जैसे [System.Diagnostics](https://learn.microsoft.com/en-us/dotnet/api/system.diagnostics?view=net-9.0)) का लाभ उठाता है बजाय नए बनाने के। इसका मतलब है कि लाइब्रेरी लेखक मानक .NET APIs का उपयोग कर सकते हैं जिनसे वे पहले से परिचित हैं, और OpenTelemetry इन मौजूदा इंस्ट्रूमेंटेशन बिंदुओं के साथ सहज रूप से एकीकृत होता है।

## OpenTelemetry लाइब्रेरीज़

.NET में OpenTelemetry तीन मूलभूत पैकेज श्रेणियों के आसपास संरचित है:

1. **Core API** पैकेज आवश्यक आधार और बुनियादी कार्यक्षमता प्रदान करते हैं, जिसमें टेलीमेट्री संग्रह के लिए कोर interfaces और implementations शामिल हैं।

1. **Instrumentation** पैकेज विभिन्न .NET कंपोनेंट्स और लोकप्रिय लाइब्रेरीज़ से स्वचालित रूप से टेलीमेट्री डेटा एकत्र करते हैं, ASP.NET Core, HTTP clients और Entity Framework जैसे स्रोतों से मेट्रिक्स, ट्रेसेस और लॉग्स कैप्चर करते हैं।

1. **Exporter** पैकेज विभिन्न observability प्लेटफ़ॉर्म के लिए bridges के रूप में कार्य करते हैं, जो आपको अपने एकत्रित टेलीमेट्री डेटा को Jaeger, Prometheus, या OTLP प्रोटोकॉल का समर्थन करने वाली किसी भी प्रणाली जैसे विभिन्न गंतव्यों पर भेजने की अनुमति देते हैं।

ये कंपोनेंट NuGet के माध्यम से उपलब्ध एक समेकित प्रणाली के रूप में एक साथ काम करते हैं, .NET अनुप्रयोगों के लिए एक संपूर्ण observability समाधान प्रदान करते हैं।

नीचे दी गई तालिका इन पैकेजों का वर्णन करती है।

| पैकेज | विवरण |
| -------- | -------- |
| [OpenTelemetry](https://github.com/open-telemetry/opentelemetry-dotnet/blob/main/src/OpenTelemetry/README.md)   | मुख्य OTEL लाइब्रेरी जो कोर कार्यक्षमता प्रदान करती है    |
| [OpenTelemetry.Instrumentation.AspNetCore](https://github.com/open-telemetry/opentelemetry-dotnet-contrib/blob/main/src/OpenTelemetry.Instrumentation.AspNetCore/README.md)    | ASP.NET Core और Kestrel के लिए इंस्ट्रूमेंटेशन    |
| [OpenTelemetry.Instrumentation.GrpcNetClient](https://github.com/open-telemetry/opentelemetry-dotnet-contrib/blob/main/src/OpenTelemetry.Instrumentation.GrpcNetClient/README.md)    | gRPC Client के लिए इंस्ट्रूमेंटेशन    |
| [OpenTelemetry.Instrumentation.Http](https://github.com/open-telemetry/opentelemetry-dotnet-contrib/blob/main/src/OpenTelemetry.Instrumentation.Http/README.md)    | HttpClient और HttpWebRequest classes के लिए इंस्ट्रूमेंटेशन    |
| [OpenTelemetry.Instrumentation.SqlClient](https://github.com/open-telemetry/opentelemetry-dotnet/tree/main/src/OpenTelemetry.Exporter.Console/README.md)    | SqlClient के लिए इंस्ट्रूमेंटेशन जो Entity Framework Core जैसे डेटाबेस ऑपरेशन को ट्रेस करने के लिए उपयोग किया जाता है    |
| [OpenTelemetry.Exporter.Console](https://github.com/open-telemetry/opentelemetry-dotnet/tree/main/src/OpenTelemetry.Exporter.Console/README.md)    | OTLP प्रोटोकॉल का उपयोग करने वाला Exporter    |
| [OpenTelemetry.Exporter.OpenTelemetryProtocol](https://github.com/open-telemetry/opentelemetry-dotnet/tree/main/src/OpenTelemetry.Exporter.OpenTelemetryProtocol/README.md)    | OTLP प्रोटोकॉल का उपयोग करने वाला Exporter    |
| [OpenTelemetry.Exporter.Prometheus.AspNetCore](https://github.com/open-telemetry/opentelemetry-dotnet/blob/main/src/OpenTelemetry.Exporter.Prometheus.AspNetCore/README.md)    | ASP.NET Core endpoint का उपयोग करके लागू किया गया Prometheus के लिए Exporter    |
| [OpenTelemetry.Exporter.Zipkin](https://github.com/open-telemetry/opentelemetry-dotnet/blob/main/src/OpenTelemetry.Exporter.Zipkin/README.md)    | Zipkin ट्रेसिंग के लिए Exporter    |

## AWS .NET OpenTelemetry लाइब्रेरीज़

AWS ने OpenTelemetry पैकेजों का अपना नवीनतम संस्करण जारी किया है जो NuGet में उपलब्ध हैं। पैकेजों को सरलता के लिए और नवीनतम OpenTelemetry नामकरण परंपराओं के अनुरूप पुनर्निर्मित किया गया है। इनमें AWS SDK for .NET में बेहतर observability के लिए समर्थन और Amazon Bedrock सहित AWS सेवाओं के लिए अतिरिक्त इंस्ट्रूमेंटेशन जैसी नई सुविधाएं शामिल हैं, साथ ही OpenTelemetry समुदाय द्वारा कई बग फ़िक्स, सुधार और योगदान भी शामिल हैं।

नीचे दी गई तालिका इन पैकेजों का वर्णन करती है।

| पैकेज | विवरण |
| -------- | -------- |
| [OpenTelemetry.Instrumentation.AWS](https://github.com/open-telemetry/opentelemetry-dotnet-contrib/tree/main/src/OpenTelemetry.Instrumentation.AWS)    | AWS SDK for .NET का उपयोग करते समय AWS सेवाओं के बारे में अतिरिक्त डेटा के साथ मेट्रिक्स और ट्रेसिंग कॉल को बेहतर बनाता है।    |
| [OpenTelemetry.Instrumentation.AWSLambda](https://github.com/open-telemetry/opentelemetry-dotnet-contrib/tree/main/src/OpenTelemetry.Instrumentation.AWSLambda)    | इनकमिंग spans बनाने के लिए AWS Lambda Handler को इंस्ट्रूमेंट करने के SDK तरीके    |
| [OpenTelemetry.Resources.AWS](https://github.com/open-telemetry/opentelemetry-dotnet-contrib/tree/main/src/OpenTelemetry.Resources.AWS)    | आपका एप्लिकेशन कहां चल रहा है, इसके आधार पर मेटाडेटा के साथ टेलीमेट्री को बेहतर बनाने के लिए AWS-विशिष्ट resource detectors। Amazon EC2, AWS Elastic Beanstalk, Amazon Elastic Container Service (Amazon ECS), और Amazon Elastic Kubernetes Service (Amazon EKS) के लिए समर्थन शामिल है    |
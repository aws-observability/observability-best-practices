# ट्रेसेस

ट्रेसेस जटिल वितरित प्रणालियों के माध्यम से अनुरोध प्रसंस्करण को ट्रैक करते हैं, जो डाउनस्ट्रीम AWS संसाधनों, माइक्रोसर्विसेज, डेटाबेस और APIs सहित अलग-अलग कंपोनेंट्स के माध्यम से अनुरोध प्रवाह के बारे में विस्तृत जानकारी प्रदान करते हैं। यह बॉटलनेक और लेटेंसी समस्याओं की पहचान करके प्रदर्शन अनुकूलन में मदद करेगा।

इस अनुभाग में, आप AWS डॉक्यूमेंटेशन और ओपन सोर्स रिपॉज़िटरी के लिंक देखेंगे जो AWS X-Ray SDK for .NET का उपयोग करके .NET अनुप्रयोगों को इंस्ट्रूमेंट करने और X-Ray daemon के माध्यम से AWS X-Ray को ट्रेस जानकारी बनाने और भेजने के बारे में जानकारी प्रदान करेंगे।

AWS X-Ray और इसकी मूल अवधारणाओं के बारे में जानने के लिए AWS X-Ray Developer Guide में [**AWS X-Ray क्या है**](https://docs.aws.amazon.com/xray/latest/devguide/aws-xray.html) और [**अवधारणाएं**](https://docs.aws.amazon.com/xray/latest/devguide/aws-xray.html) अनुभागों पर जाएं।

X-Ray SDK for .NET, C# .NET वेब अनुप्रयोगों, .NET Core वेब अनुप्रयोगों और AWS Lambda पर .NET Core फ़ंक्शंस को इंस्ट्रूमेंट करने के लिए एक लाइब्रेरी है। यह X-Ray daemon को ट्रेस डेटा जनरेट करने और भेजने के लिए classes और methods प्रदान करती है। इसमें एप्लिकेशन द्वारा सर्व किए गए इनकमिंग अनुरोधों और एप्लिकेशन द्वारा डाउनस्ट्रीम AWS सेवाओं, HTTP वेब APIs और SQL डेटाबेस को किए गए कॉल के बारे में जानकारी शामिल है।

## एजेंट और SDKs के विकल्प

Amazon EC2 इंस्टेंस और ऑन-प्रेमिस सर्वर से ट्रेसेस एकत्र करने और उन्हें AWS X-Ray को भेजने के लिए आपके पास AWS X-Ray daemon, CloudWatch agent और AWS Distro for OpenTelemetry (ADOT) collector में से चुनने का विकल्प है। अपने उपयोग के मामले के लिए सही विकल्प चुनें ताकि आपको प्रबंधित करने वाले एजेंटों की संख्या कम से कम हो।

अपने एप्लिकेशन और इंफ्रास्ट्रक्चर से ट्रेसेस एकत्र और भेजने के लिए X-Ray daemon को कॉन्फ़िगर करने के बारे में जानने के लिए [**AWS X-Ray daemon**](https://docs.aws.amazon.com/xray/latest/devguide/xray-daemon.html) गाइड पढ़ें। इसके बजाय, यदि आपकी पसंद CloudWatch agent का उपयोग करना है, तो [**Amazon CloudWatch उपयोगकर्ता गाइड**](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Install-CloudWatch-Agent.html) CloudWatch agent को सेटअप और कॉन्फ़िगर करने के निर्देश प्रदान करेगा।

ट्रेसेस जनरेट करने के लिए अपने एप्लिकेशन को इंस्ट्रूमेंट करने के लिए, आपके पास OpenTelemetry और X-Ray SDK for .NET में से चुनने का विकल्प है। इन विकल्पों के बीच चुनने का मार्गदर्शन [**यहां**](https://docs.aws.amazon.com/xray/latest/devguide/xray-instrumenting-your-app.html#xray-instrumenting-choosing) उपलब्ध है।

## AWS X-Ray SDK for .NET
 
X-Ray SDK for .NET एक ओपन सोर्स प्रोजेक्ट है। X-Ray SDK for .NET, .NET Framework 4.5 या बाद के संस्करण को लक्षित करने वाले अनुप्रयोगों के लिए समर्थित है। .NET Core अनुप्रयोगों के लिए, SDK को .NET Core 2.0 या बाद के संस्करण की आवश्यकता है।

शुरू करने के लिए यहां लिंक दिए गए हैं।

[**AWS X-Ray SDK for .NET डेवलपर गाइड**](https://docs.aws.amazon.com/xray/latest/devguide/xray-sdk-dotnet.html) - डॉक्यूमेंटेशन NuGet के माध्यम से इंस्टॉलेशन, कॉन्फ़िगरेशन विकल्प और स्वचालित HTTP अनुरोध ट्रेसिंग और AWS सेवा कॉल मॉनिटरिंग सहित विभिन्न इंस्ट्रूमेंटेशन क्षमताओं की व्याख्या करता है। यह बताता है कि डेवलपर कस्टम segments कैसे बना सकते हैं, annotations जोड़ सकते हैं और डेटा संग्रह प्रबंधित करने के लिए sampling rules का उपयोग कर सकते हैं। गाइड ASP.NET अनुप्रयोगों में X-Ray ट्रेसिंग को एकीकृत करने के लिए व्यापक जानकारी प्रदान करता है, जो डेवलपर्स को एप्लिकेशन प्रदर्शन में दृश्यता प्राप्त करने और समस्याओं का प्रभावी ढंग से निवारण करने में मदद करता है।

[**SDK ओपन सोर्स प्रोजेक्ट रिपो - aws-xray-sdk-dotnet**](https://docs.aws.amazon.com/xray/latest/devguide/xray-sdk-dotnet.html) - aws-xray-sdk-dotnet रिपॉज़िटरी में Amazon के X-Ray SDK for .NET का ओपन सोर्स कोड है। डेवलपर इस ट्रेसिंग टूल के कार्यान्वयन को देख सकते हैं जो .NET Core और .NET Framework वातावरण में वितरित एप्लिकेशन मॉनिटरिंग का समर्थन करता है। रिपॉज़िटरी में HTTP अनुरोधों, AWS सेवा कॉल और कस्टम इंस्ट्रूमेंटिंग क्षमताओं के स्वचालित इंस्ट्रूमेंटेशन के लिए सोर्स कोड है। आप देख सकते हैं कि SDK कैसे ASP.NET फ्रेमवर्क के साथ एकीकृत होता है और sampling rules को लागू करता है। यह GitHub प्रोजेक्ट SDK की कार्यक्षमता में पारदर्शिता प्रदान करता है जबकि डेवलपर्स को समस्याओं की रिपोर्ट करने या कोडबेस में सुधार में योगदान करने की अनुमति देता है।

नीचे API संदर्भ मैनुअल हैं जो .NET X-Ray SDK के कंपोनेंट्स का व्यापक रूप से वर्णन करते हैं।

[**.NET Framework के लिए API संदर्भ**](https://docs.aws.amazon.com/xray-sdk-for-dotnet/latest/reference/html/d0b774be-200e-4897-9ce6-4e43c3f6f5de.htm)

[**.NET (Core) के लिए API संदर्भ**](https://docs.aws.amazon.com/xray-sdk-for-dotnetcore/latest/reference/html/bdf06719-4833-4e03-8ce5-31debb71506c.htm)

अपने ASP.NET और ASP.NET Core अनुप्रयोगों में X-Ray SDK for .NET का उपयोग सीखने के लिए नमूना अनुप्रयोग नीचे लिंक किए गए हैं

[**नमूना ASP.NET और ASP.NET Core अनुप्रयोग**](https://github.com/aws-samples/aws-xray-dotnet-webapp)
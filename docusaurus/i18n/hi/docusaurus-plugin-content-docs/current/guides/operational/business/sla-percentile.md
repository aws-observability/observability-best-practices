# Percentiles महत्वपूर्ण हैं

Percentiles मॉनिटरिंग और रिपोर्टिंग में महत्वपूर्ण हैं क्योंकि वे केवल averages पर निर्भर रहने की तुलना में डेटा वितरण का अधिक विस्तृत और सटीक दृश्य प्रदान करते हैं। एक average कभी-कभी महत्वपूर्ण जानकारी छिपा सकता है, जैसे outliers या डेटा में variations, जो प्रदर्शन और उपयोगकर्ता अनुभव को महत्वपूर्ण रूप से प्रभावित कर सकते हैं। दूसरी ओर, Percentiles इन छिपे हुए विवरणों को प्रकट कर सकते हैं और डेटा कैसे वितरित है इसकी बेहतर समझ प्रदान कर सकते हैं।

[Amazon CloudWatch](https://aws.amazon.com/cloudwatch/) में, percentiles का उपयोग आपके applications और infrastructure में response times, latency, और error rates जैसे विभिन्न metrics की निगरानी और रिपोर्ट करने के लिए किया जा सकता है। Percentiles पर alarms सेट करके, आप तब सूचित हो सकते हैं जब विशिष्ट percentile values thresholds से अधिक हों, जिससे आप अधिक ग्राहकों को प्रभावित करने से पहले कार्रवाई कर सकें।

[CloudWatch में percentiles](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/cloudwatch_concepts.html#Percentiles) का उपयोग करने के लिए, CloudWatch कंसोल में **All metrics** में अपना metric चुनें और एक मौजूदा metric का उपयोग करें और **statistic** को **p99** पर सेट करें, फिर आप p के बाद के मान को जिस भी percentile पर चाहें उसमें संपादित कर सकते हैं। फिर आप percentile graphs देख सकते हैं, उन्हें [CloudWatch dashboards](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch_Dashboards.html) में जोड़ सकते हैं और इन metrics पर alarms सेट कर सकते हैं। उदाहरण के लिए, आप एक alarm सेट कर सकते हैं जो आपको सूचित करे जब response times का 95th percentile एक निश्चित threshold से अधिक हो, जो इंगित करता है कि उपयोगकर्ताओं का एक महत्वपूर्ण प्रतिशत धीमी response times अनुभव कर रहा है।

नीचे दिया गया histogram [Amazon Managed Grafana](https://aws.amazon.com/grafana/) में [CloudWatch RUM](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-RUM.html) logs से [CloudWatch Logs Insights](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/AnalyzingLogData.html) query का उपयोग करके बनाया गया था। उपयोग की गई query थी:

```
fields @timestamp, event_details.duration
| filter event_type = "com.amazon.rum.performance_navigation_event"
| sort @timestamp desc
```

Histogram मिलीसेकंड में page load time को plot करता है। इस दृश्य के साथ, outliers को स्पष्ट रूप से देखना संभव है। यदि average का उपयोग किया जाए तो यह डेटा छिपा रहता है।

![Histogram](../../../images/percentiles-histogram.png)

Average value का उपयोग करके CloudWatch में दिखाया गया वही डेटा इंगित करता है कि pages को लोड होने में दो सेकंड से कम समय लग रहा है। आप ऊपर के histogram से देख सकते हैं कि अधिकांश pages वास्तव में एक सेकंड से भी कम समय ले रहे हैं और हमारे पास outliers हैं।

![Histogram](../../../images/percentiles-average.png)

उसी डेटा का फिर से percentile (p99) के साथ उपयोग करने पर पता चलता है कि एक समस्या है, CloudWatch graph अब दिखाता है कि 99 प्रतिशत page loads 23 सेकंड से कम में हो रहे हैं।

![Histogram](../../../images/percentiles-p99.png)

इसे visualize करना आसान बनाने के लिए, नीचे दिए गए graphs average value की तुलना 99th percentile से करते हैं। इस मामले में, target page load time दो सेकंड है, अन्य गणनाएं करने के लिए वैकल्पिक [CloudWatch statistics](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Statistics-definitions.html#Percentile-versus-Trimmed-Mean) और [metric math](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/using-metric-math.html) का उपयोग करना संभव है। इस मामले में Percentile rank (PR) का उपयोग statistic **PR(:2000)** के साथ किया जाता है यह दिखाने के लिए कि 92.7% page loads 2000ms के target के भीतर हो रहे हैं।

![Histogram](../../../images/percentiles-comparison.png)

CloudWatch में percentiles का उपयोग करने से आपको अपने सिस्टम के प्रदर्शन में गहरी अंतर्दृष्टि प्राप्त करने, समस्याओं का जल्दी पता लगाने और outliers की पहचान करके अपने ग्राहक के अनुभव में सुधार करने में मदद मिल सकती है जो अन्यथा छिपे रहते।

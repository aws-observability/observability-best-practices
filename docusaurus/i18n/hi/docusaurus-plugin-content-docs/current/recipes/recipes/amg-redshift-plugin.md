# Amazon Managed Grafana में Redshift का उपयोग

इस रेसिपी में हम आपको दिखाते हैं कि [Amazon Managed Grafana][amg] में मानक SQL का उपयोग करने वाली पेटाबाइट-स्केल डेटा वेयरहाउस सेवा [Amazon Redshift][redshift] का उपयोग कैसे करें। यह एकीकरण [Redshift data source for Grafana][redshift-ds] द्वारा सक्षम है, जो एक ओपन सोर्स प्लगइन है जो किसी भी DIY Grafana इंस्टेंस में उपयोग के लिए उपलब्ध है और Amazon Managed Grafana में पूर्व-स्थापित भी है।

:::note
    इस गाइड को पूरा करने में लगभग 10 मिनट लगेंगे।
:::
## पूर्वापेक्षाएँ

1. आपके खाते से Amazon Redshift तक व्यवस्थापक पहुँच होनी चाहिए।
1. अपने Amazon Redshift क्लस्टर को `GrafanaDataSource: true` के साथ टैग करें।
1. सर्विस-मैनेज्ड पॉलिसी का लाभ उठाने के लिए, निम्नलिखित तरीकों में से एक में डेटाबेस क्रेडेंशियल बनाएं:
    1. यदि आप डिफ़ॉल्ट मैकेनिज्म, अर्थात, Redshift डेटाबेस के विरुद्ध प्रमाणित करने के लिए अस्थायी क्रेडेंशियल विकल्प का उपयोग करना चाहते हैं, तो आपको `redshift_data_api_user` नाम का एक डेटाबेस उपयोगकर्ता बनाना होगा।
    1. यदि आप Secrets Manager से क्रेडेंशियल का उपयोग करना चाहते हैं, तो आपको सीक्रेट को `RedshiftQueryOwner: true` के साथ टैग करना होगा।

:::tip
    सर्विस-मैनेज्ड या कस्टम पॉलिसी के साथ कार्य करने के बारे में अधिक जानकारी के लिए, [Amazon Managed Grafana डॉक्स में उदाहरण][svpolicies] देखें।
:::

## इंफ्रास्ट्रक्चर
हमें एक Grafana इंस्टेंस की आवश्यकता है, इसलिए [शुरू करें][amg-getting-started] गाइड का उपयोग करके एक नया [Amazon Managed Grafana वर्कस्पेस][amg-workspace] सेट करें, या मौजूदा का उपयोग करें।

:::note
    AWS डेटा स्रोत कॉन्फ़िगरेशन का उपयोग करने के लिए, पहले Amazon Managed Grafana कंसोल पर जाएं और सर्विस-मैनेज्ड IAM रोल्स को सक्षम करें जो वर्कस्पेस को Athena संसाधनों को पढ़ने के लिए आवश्यक IAM पॉलिसी प्रदान करते हैं।
:::

Athena डेटा स्रोत सेट करने के लिए, बाएँ टूलबार का उपयोग करें और निचला AWS आइकन चुनें और फिर "Redshift" चुनें। अपना डिफ़ॉल्ट रीजन चुनें जहाँ आप चाहते हैं कि प्लगइन Redshift डेटा स्रोत खोजे, और फिर वे खाते चुनें जो आप चाहते हैं, और अंत में "Add data source" चुनें।

वैकल्पिक रूप से, आप इन चरणों का पालन करके Redshift डेटा स्रोत को मैन्युअल रूप से जोड़ और कॉन्फ़िगर कर सकते हैं:

1. बाएँ टूलबार पर "Configurations" आइकन पर क्लिक करें और फिर "Add data source" पर क्लिक करें।
1. "Redshift" खोजें।
1. [वैकल्पिक] प्रमाणीकरण प्रदाता कॉन्फ़िगर करें (अनुशंसित: workspace IAM role)।
1. "Cluster Identifier", "Database", और "Database User" मान प्रदान करें।
1. "Save & test" पर क्लिक करें।

आपको कुछ इस तरह दिखाई देना चाहिए:

![Redshift डेटा स्रोत कॉन्फ़िग का स्क्रीनशॉट](../images/amg-plugin-redshift-ds.png)

## उपयोग
हम [Redshift Advance Monitoring][redshift-mon] सेटअप का उपयोग करेंगे। चूंकि सब कुछ बॉक्स से बाहर उपलब्ध है, इस बिंदु पर कॉन्फ़िगर करने के लिए और कुछ नहीं है।

आप Redshift प्लगइन में शामिल Redshift मॉनिटरिंग डैशबोर्ड आयात कर सकते हैं। आयात करने के बाद आपको कुछ इस तरह दिखाई देना चाहिए:

![AMG में Redshift डैशबोर्ड का स्क्रीनशॉट](../images/amg-redshift-mon-dashboard.png)

यहाँ से, आप Amazon Managed Grafana में अपना डैशबोर्ड बनाने के लिए निम्नलिखित गाइड का उपयोग कर सकते हैं:

* [उपयोगकर्ता गाइड: डैशबोर्ड](https://docs.aws.amazon.com/grafana/latest/userguide/dashboard-overview.html)
* [डैशबोर्ड बनाने के लिए सर्वोत्तम प्रथाएं](https://grafana.com/docs/grafana/latest/best-practices/best-practices-for-creating-dashboards/)

बस इतना ही, बधाई हो आपने Grafana से Redshift का उपयोग करना सीख लिया!

## सफाई

आप जिस Redshift डेटाबेस का उपयोग कर रहे थे उसे हटाएं और फिर कंसोल से Amazon Managed Grafana वर्कस्पेस हटाएं।

[redshift]: https://aws.amazon.com/redshift/
[amg]: https://aws.amazon.com/grafana/
[svpolicies]: https://docs.aws.amazon.com/grafana/latest/userguide/security_iam_id-based-policy-examples.html
[redshift-ds]: https://grafana.com/grafana/plugins/grafana-redshift-datasource/
[aws-cli]: https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-install.html
[aws-cli-conf]: https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-configure.html
[amg-getting-started]: https://aws.amazon.com/blogs/mt/amazon-managed-grafana-getting-started/
[redshift-console]: https://console.aws.amazon.com/redshift/
[redshift-mon]: https://github.com/awslabs/amazon-redshift-monitoring
[amg-workspace]: https://console.aws.amazon.com/grafana/home#/workspaces

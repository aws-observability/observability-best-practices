---
sidebar_position: 2
---
# संसाधन कॉन्फ़िगरेशन ट्रैकिंग

AWS Config [समर्थित AWS संसाधनों](https://docs.aws.amazon.com/config/latest/developerguide/resource-config-reference.html) के कॉन्फ़िगरेशन को रिकॉर्ड और ट्रैक करता है, आपके AWS खाते में इन संसाधनों की एक इन्वेंट्री उनके वर्तमान और ऐतिहासिक कॉन्फ़िगरेशन के साथ बनाता है। यह कॉन्फ़िगरेशन परिवर्तनों की एक टाइमलाइन भी बनाता है और आपके AWS बुनियादी ढाँचे में संसाधन विशेषताओं, संबंधों और निर्भरताओं के बारे में विस्तृत जानकारी बनाए रखता है। उपयोगकर्ता [अनुपालन इतिहास और टाइमलाइन देख सकते हैं](https://docs.aws.amazon.com/config/latest/developerguide/view-manage-resource-console.html) या तो AWS Management Console के माध्यम से या AWS CLI के माध्यम से प्रोग्रामेटिक रूप से, किसी भी समय विशिष्ट कॉन्फ़िगरेशन स्थितियों को क्वेरी करने की क्षमता के साथ।


![AWS Config लागत विज़ुअलाइज़ेशन](/img/cloudops/guides/config/resourcetimeline.png)

### AWS Config कस्टम संसाधन

 AWS Config आपको [custom config resources](https://docs.aws.amazon.com/config/latest/developerguide/customresources.html) के माध्यम से समर्थित AWS संसाधनों से परे अपनी कॉन्फ़िगरेशन ट्रैकिंग क्षमताओं का विस्तार करने की अनुमति देता है। यह सुविधा आपको गैर-समर्थित AWS संसाधनों की निगरानी करने और बाहरी संसाधनों जैसे ऑन-प्रिमाइसेस सर्वर, GitHub रिपॉजिटरी, और अन्य तृतीय-पक्ष संसाधनों को ट्रैक करने में सक्षम बनाती है। एक बार कॉन्फ़िगर होने के बाद, आप तृतीय-पक्ष संसाधन कॉन्फ़िगरेशन डेटा AWS Config पर प्रकाशित कर सकते हैं और AWS Config कंसोल और APIs के माध्यम से अपनी पूर्ण संसाधन इन्वेंट्री देख और मॉनिटर कर सकते हैं। इसके अतिरिक्त, आप AWS Config नियमों, conformance packs, सर्वोत्तम प्रथाओं, आंतरिक नीतियों, और नियामक आवश्यकताओं का उपयोग करके कॉन्फ़िगरेशन अनुपालन का मूल्यांकन कर सकते हैं।

AWS Config का उपयोग करके गैर-मानक सुविधाओं की निगरानी कैसे करें, यह जानने के लिए [इस ब्लॉग पोस्ट](https://aws.amazon.com/blogs/mt/using-aws-config-custom-resources-to-track-any-resource-on-aws/) का पालन करें। [यह ब्लॉग पोस्ट](https://aws.amazon.com/blogs/mt/simplify-compliance-management-of-multicloud-or-hybrid-resources-with-aws-config/) अन्य क्लाउड प्रदाताओं पर होस्ट किए गए संसाधनों की निगरानी कैसे करें इसका वॉकथ्रू प्रदान करता है।

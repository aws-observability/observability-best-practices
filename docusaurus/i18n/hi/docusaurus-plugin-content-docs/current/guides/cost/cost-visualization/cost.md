# AWS Observability सेवाएं और लागत

जैसे-जैसे आप अपने Observability स्टैक में निवेश करते हैं, यह महत्वपूर्ण है कि आप नियमित आधार पर अपने Observability उत्पादों की **लागत** की निगरानी करें। इससे आप यह सुनिश्चित कर सकते हैं कि आप केवल आवश्यक लागत वहन कर रहे हैं और उन resources पर अधिक खर्च नहीं कर रहे जिनकी आपको आवश्यकता नहीं है।

## लागत ऑप्टिमाइज़ेशन के लिए AWS उपकरण

अधिकांश संगठनों का मुख्य ध्यान क्लाउड पर अपने IT infrastructure को scale करने पर होता है, और आमतौर पर वे अपने वास्तविक या आगामी cloud खर्च के बारे में अनियंत्रित, अप्रस्तुत और अनजान होते हैं। समय के साथ लागत को ट्रैक, रिपोर्ट और विश्लेषित करने में मदद के लिए, AWS कई लागत-ऑप्टिमाइज़ेशन उपकरण प्रदान करता है:

[AWS Cost Explorer][cost-explorer] – समय के साथ AWS खर्च में पैटर्न देखें, भविष्य की लागत का अनुमान लगाएं, आगे की जांच की आवश्यकता वाले क्षेत्रों की पहचान करें, Reserved Instance उपयोग देखें, Reserved Instance coverage देखें, और Reserved Instance recommendations प्राप्त करें।

[AWS Cost and Usage Report(CUR)][CUR] – accounts में आपके hourly AWS उपयोग का विवरण देने वाली granular raw data files जो Do-It-Yourself (DIY) विश्लेषण के लिए उपयोग की जाती हैं। AWS Cost and Usage Report में dynamic columns हैं जो आपके द्वारा उपयोग की जाने वाली services के आधार पर populate होते हैं।

## आर्किटेक्चर अवलोकन: AWS Cost and Usage Report को विज़ुअलाइज़ करना

आप Amazon Managed Grafana या Amazon QuickSight में AWS लागत और उपयोग डैशबोर्ड बना सकते हैं। निम्नलिखित आर्किटेक्चर डायग्राम दोनों समाधानों को दर्शाता है।

![Architecture diagram](../../../images/cur-architecture.png)
*आर्किटेक्चर डायग्राम*

## Cloud Intelligence Dashboards

[Cloud Intelligence Dashboards][cid] AWS Cost and Usage report (CUR) पर निर्मित [Amazon QuickSight][quicksight] डैशबोर्ड का एक संग्रह है। ये डैशबोर्ड आपके अपने cost management और optimization (FinOps) उपकरण के रूप में काम करते हैं। आपको गहन, granular, और recommendation-driven डैशबोर्ड मिलते हैं जो आपको आपके AWS उपयोग और लागत का विस्तृत दृश्य प्राप्त करने में मदद कर सकते हैं।

### Implementation

1.	[Amazon Athena][amazon-athnea] integration सक्षम के साथ एक [CUR report][cur-report] बनाएं।  
*प्रारंभिक कॉन्फ़िगरेशन के दौरान, AWS को आपके Amazon S3 bucket में reports deliver करना शुरू करने में 24 घंटे तक लग सकते हैं। Reports दिन में एक बार deliver की जाती हैं। Athena के साथ अपने Cost and Usage Reports के integration को streamline और automate करने के लिए, AWS Athena integration के लिए सेट अप की गई reports के साथ कई प्रमुख resources वाला एक AWS CloudFormation template प्रदान करता है।*

2.	[AWS CloudFormation template][cloudformation] डिप्लॉय करें।  
*इस template में एक AWS Glue crawler, एक AWS Glue database, और एक AWS Lambda event शामिल है। इस बिंदु पर, CUR डेटा Amazon Athena में tables के माध्यम से आपके query करने के लिए उपलब्ध है।*  

    - अपने CUR डेटा पर सीधे [Amazon Athena][athena-query] queries चलाएं।  
*Athena queries चलाने के लिए, पहले Athena console का उपयोग करके जांचें कि AWS आपका डेटा refresh कर रहा है या नहीं और फिर Athena console पर अपनी query चलाएं।*

3.	Cloud Intelligence dashboards डिप्लॉय करें।
    - मैन्युअल deployment के लिए, AWS Well-Architected **[Cost Optimization lab][cost-optimization-lab]** देखें।
    - Automated deployment के लिए, [GitHub repo][GitHub-repo] देखें।

Cloud Intelligence dashboards Finance teams, Executives, और IT managers के लिए उत्कृष्ट हैं। हालांकि, ग्राहकों से हमें एक सामान्य प्रश्न यह मिलता है कि Amazon CloudWatch, AWS X-Ray, Amazon Managed Service for Prometheus, और Amazon Managed Grafana जैसे व्यक्तिगत AWS Observability उत्पादों की organization-wide लागत में अंतर्दृष्टि कैसे प्राप्त करें।  

अगले अनुभाग में, आप उन प्रत्येक उत्पादों की लागत और उपयोग में गहराई से जाएंगे। किसी भी आकार की कंपनियां cloud cost optimization रणनीति के इस सक्रिय दृष्टिकोण को अपना सकती हैं और बिना किसी performance प्रभाव या operational overhead के cloud cost analytics और data-driven निर्णयों के माध्यम से व्यापार दक्षता में सुधार कर सकती हैं।


[cost-explorer]: https://docs.aws.amazon.com/awsaccountbilling/latest/aboutv2/ce-what-is.html
[CUR]: https://docs.aws.amazon.com/cur/latest/userguide/what-is-cur.html
[cid]: https://wellarchitectedlabs.com/cost/200_labs/200_cloud_intelligence/
[quicksight]: https://aws.amazon.com/quicksight/
[cur-report]: https://docs.aws.amazon.com/cur/latest/userguide/cur-create.html
[amazon-athnea]: https://aws.amazon.com/athena/
[cloudformation]: https://docs.aws.amazon.com/cur/latest/userguide/use-athena-cf.html
[athena-query]: https://docs.aws.amazon.com/cur/latest/userguide/cur-ate-run.html
[cost-optimization-lab]: https://www.wellarchitectedlabs.com/cost/200_labs/200_cloud_intelligence/
[GitHub-repo]: https://github.com/aws-samples/aws-cudos-framework-deployment

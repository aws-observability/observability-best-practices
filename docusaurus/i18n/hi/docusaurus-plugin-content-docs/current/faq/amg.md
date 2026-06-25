# Amazon Managed Grafana - FAQ

## मुझे Amazon Managed Grafana क्यों चुनना चाहिए?

**[उच्च उपलब्धता](https://docs.aws.amazon.com/grafana/latest/userguide/disaster-recovery-resiliency.html)**: Amazon Managed Grafana workspaces मल्टी-AZ रेप्लिकेशन के साथ उच्च उपलब्ध हैं। Amazon Managed Grafana workspaces के स्वास्थ्य की निरंतर निगरानी भी करता है और अस्वस्थ नोड्स को बदलता है, workspaces तक पहुंच को प्रभावित किए बिना। Amazon Managed Grafana कंप्यूट और डेटाबेस नोड्स की उपलब्धता का प्रबंधन करता है ताकि ग्राहकों को प्रशासन और रखरखाव के लिए आवश्यक इंफ्रास्ट्रक्चर संसाधनों का प्रबंधन न करना पड़े।

**[डेटा सुरक्षा](https://docs.aws.amazon.com/grafana/latest/userguide/security.html)**: Amazon Managed Grafana बिना किसी विशेष कॉन्फ़िगरेशन, तृतीय-पक्ष टूल, या अतिरिक्त लागत के रेस्ट पर डेटा को एन्क्रिप्ट करता है। [ट्रांज़िट में डेटा](https://docs.aws.amazon.com/grafana/latest/userguide/infrastructure-security.html) भी TLS के माध्यम से एन्क्रिप्ट किया जाता है।

## कौन से AWS रीजन समर्थित हैं?

समर्थित रीजन की वर्तमान सूची [डॉक्यूमेंटेशन के Supported Regions सेक्शन](https://docs.aws.amazon.com/grafana/latest/userguide/what-is-Amazon-Managed-Service-Grafana.html#AMG-supported-Regions) में उपलब्ध है।

## हमारे Organization में कई रीजन में कई AWS अकाउंट हैं, क्या Amazon Managed Grafana इन परिदृश्यों के लिए काम करता है?

Amazon Managed Grafana [AWS Organizations](https://docs.aws.amazon.com/organizations/latest/userguide/orgs_introduction.html) के साथ इंटीग्रेट होता है ताकि Organizational Units (OUs) में AWS अकाउंट और संसाधनों की खोज की जा सके। AWS Organizations के साथ ग्राहक कई AWS अकाउंट के लिए [डेटा सोर्स कॉन्फ़िगरेशन और अनुमति सेटिंग्स को केंद्रीय रूप से प्रबंधित](https://docs.aws.amazon.com/grafana/latest/userguide/AMG-and-Organizations.html) कर सकते हैं।

## Amazon Managed Grafana में कौन से डेटा सोर्स समर्थित हैं?

डेटा सोर्स स्टोरेज बैकएंड हैं जिन्हें ग्राहक Amazon Managed Grafana में डैशबोर्ड बनाने के लिए क्वेरी कर सकते हैं। Amazon Managed Grafana लगभग [30+ बिल्ट-इन डेटा सोर्स](https://docs.aws.amazon.com/grafana/latest/userguide/AMG-data-sources-builtin.html) का समर्थन करता है जिसमें Amazon CloudWatch, Amazon OpenSearch Service, AWS IoT SiteWise, AWS IoT TwinMaker, Amazon Managed Service for Prometheus, Amazon Timestream, Amazon Athena, Amazon Redshift, AWS X-Ray और कई अन्य जैसी AWS नेटिव सेवाएं शामिल हैं। इसके अतिरिक्त, Grafana Enterprise में अपग्रेड किए गए workspaces के लिए [लगभग 15+ अन्य डेटा सोर्स](https://docs.aws.amazon.com/grafana/latest/userguide/AMG-data-sources-enterprise.html) भी उपलब्ध हैं।

## मेरे वर्कलोड के डेटा सोर्स प्राइवेट VPC में हैं। मैं उन्हें Amazon Managed Grafana से सुरक्षित रूप से कैसे जोड़ूं?

[VPC के भीतर](https://docs.aws.amazon.com/grafana/latest/userguide/AMG-configure-vpc.html) प्राइवेट डेटा सोर्स को ट्रैफ़िक को सुरक्षित रखने के लिए AWS PrivateLink के माध्यम से Amazon Managed Grafana से जोड़ा जा सकता है। [VPC endpoints](https://docs.aws.amazon.com/grafana/latest/userguide/AMG-configure-nac.html) से Amazon Managed Grafana सेवा तक पहुंच नियंत्रण को [Amazon VPC endpoints](https://docs.aws.amazon.com/whitepapers/latest/aws-privatelink/what-are-vpc-endpoints.html) के लिए [IAM resource policy](https://docs.aws.amazon.com/grafana/latest/userguide/VPC-endpoints.html#controlling-vpc) संलग्न करके प्रतिबंधित किया जा सकता है।

## Amazon Managed Grafana में कौन सा User प्रमाणीकरण तंत्र उपलब्ध है?

Amazon Managed Grafana workspace में, [users को Grafana console में प्रमाणित](https://docs.aws.amazon.com/grafana/latest/userguide/authentication-in-AMG.html) किया जाता है single sign-on के माध्यम से जो Security Assertion Markup Language 2.0 (SAML 2.0) या AWS IAM Identity Center (AWS Single Sign-On का उत्तराधिकारी) का समर्थन करने वाले किसी भी IDP का उपयोग करता है।

> संबंधित ब्लॉग: [Fine-grained access control in Amazon Managed Grafana using Grafana Teams](https://aws.amazon.com/blogs/mt/fine-grained-access-control-in-amazon-managed-grafana-using-grafana-teams/)

## Amazon Managed Grafana के लिए किस प्रकार का ऑटोमेशन सपोर्ट उपलब्ध है?

Amazon Managed Grafana [AWS CloudFormation के साथ इंटीग्रेटेड](https://docs.aws.amazon.com/grafana/latest/userguide/creating-resources-with-cloudformation.html) है, जो ग्राहकों को AWS संसाधनों को मॉडल और सेट अप करने में मदद करता है। Amazon Managed Grafana में [API](https://docs.aws.amazon.com/grafana/latest/APIReference/Welcome.html) भी उपलब्ध है जो [AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-welcome.html) के माध्यम से ऑटोमेशन या सॉफ़्टवेयर/उत्पादों के साथ इंटीग्रेशन का समर्थन करता है। Amazon Managed Grafana workspaces में ऑटोमेशन और इंटीग्रेशन सपोर्ट के लिए [HTTP APIs](https://docs.aws.amazon.com/grafana/latest/userguide/Using-Grafana-APIs.html) हैं।

> संबंधित ब्लॉग: [Announcing Private VPC data source support for Amazon Managed Grafana](https://aws.amazon.com/blogs/mt/announcing-private-vpc-data-source-support-for-amazon-managed-grafana/)

## मेरा Organization ऑटोमेशन के लिए Terraform का उपयोग करता है। क्या Amazon Managed Grafana Terraform का समर्थन करता है?
हां, [Amazon Managed Grafana](https://aws-observability.github.io/observability-best-practices/recipes/recipes/amg-automation-tf/) [ऑटोमेशन](https://registry.terraform.io/modules/terraform-aws-modules/managed-service-grafana/aws/latest) के लिए Terraform का समर्थन करता है

> उदाहरण: [Terraform सपोर्ट के लिए रेफरेंस इम्प्लीमेंटेशन](https://github.com/aws-observability/terraform-aws-observability-accelerator/tree/main/examples/managed-grafana-workspace)

## मैं अपने वर्तमान Grafana सेटअप में सामान्य रूप से उपयोग किए जाने वाले Dashboards का उपयोग कर रहा हूं। क्या उन्हें फिर से बनाने के बजाय Amazon Managed Grafana पर उपयोग करने का कोई तरीका है?

Amazon Managed Grafana [HTTP APIs](https://docs.aws.amazon.com/grafana/latest/userguide/Using-Grafana-APIs.html) का समर्थन करता है जो आपको Dashboards, users और बहुत कुछ के डिप्लॉयमेंट और प्रबंधन को आसानी से ऑटोमेट करने की अनुमति देता है। आप इन APIs को अपने GitOps/CICD प्रक्रियाओं में इन संसाधनों के प्रबंधन को ऑटोमेट करने के लिए उपयोग कर सकते हैं।

## क्या Amazon Managed Grafana Alerts का समर्थन करता है?

[Amazon Managed Grafana alerting](https://docs.aws.amazon.com/grafana/latest/userguide/alerts-overview.html) ग्राहकों को मजबूत और कार्रवाई योग्य अलर्ट प्रदान करता है जो सिस्टम में समस्याओं के बारे में निकट रीयल-टाइम में सीखने में मदद करते हैं, सेवाओं में व्यवधान को कम करते हैं।

## मेरे Organization को ऑडिट के लिए सभी कार्यों को रिकॉर्ड करना आवश्यक है। क्या Amazon Managed Grafana इवेंट रिकॉर्ड किए जा सकते हैं?

Amazon Managed Grafana [AWS CloudTrail](https://docs.aws.amazon.com/awscloudtrail/latest/userguide/cloudtrail-user-guide.html) के साथ इंटीग्रेटेड है, जो Amazon Managed Grafana में एक user, एक role, या एक AWS सेवा द्वारा की गई कार्रवाइयों का रिकॉर्ड प्रदान करता है। CloudTrail Amazon Managed Grafana के लिए सभी [API कॉल को इवेंट के रूप में कैप्चर](https://docs.aws.amazon.com/grafana/latest/userguide/logging-using-cloudtrail.html) करता है।

## कौन सी अतिरिक्त जानकारी उपलब्ध है?

Amazon Managed Grafana पर अतिरिक्त जानकारी के लिए ग्राहक AWS [डॉक्यूमेंटेशन](https://docs.aws.amazon.com/grafana/latest/userguide/what-is-Amazon-Managed-Service-Grafana.html) पढ़ सकते हैं, [Amazon Managed Grafana](https://catalog.workshops.aws/observability/en-US/aws-managed-oss/amg) पर AWS ऑब्ज़र्वेबिलिटी Workshop देख सकते हैं और [फ़ीचर्स](https://aws.amazon.com/grafana/features/?nc=sn&loc=2), [मूल्य निर्धारण](https://aws.amazon.com/grafana/pricing/?nc=sn&loc=3) विवरण, नवीनतम [ब्लॉग पोस्ट](https://aws.amazon.com/grafana/resources/?nc=sn&loc=4&msg-blogs.sort-by=item.additionalFields.createdDate&msg-blogs.sort-order=desc#Latest_blog_posts) और [वीडियो](https://aws.amazon.com/grafana/resources/?nc=sn&loc=4&msg-blogs.sort-by=item.additionalFields.createdDate&msg-blogs.sort-order=desc#Videos) जानने के लिए [प्रोडक्ट पेज](https://aws.amazon.com/grafana/) भी देख सकते हैं।

**प्रोडक्ट FAQ:** [https://aws.amazon.com/grafana/faqs/](https://aws.amazon.com/grafana/faqs/)

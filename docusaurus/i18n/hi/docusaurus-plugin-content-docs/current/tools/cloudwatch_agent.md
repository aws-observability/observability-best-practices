# CloudWatch Agent


## CloudWatch agent डिप्लॉय करना

CloudWatch agent को एकल इंस्टॉलेशन के रूप में, डिस्ट्रीब्यूटेड कॉन्फ़िगरेशन फ़ाइल का उपयोग करके, कई कॉन्फ़िगरेशन फ़ाइलों को लेयर करके, और पूरी तरह से स्वचालन के माध्यम से डिप्लॉय किया जा सकता है। कौन सा दृष्टिकोण आपके लिए उपयुक्त है यह आपकी आवश्यकताओं पर निर्भर करता है। [^1]

:::info
	Windows और Linux होस्ट दोनों पर डिप्लॉयमेंट में [Systems Manager Parameter Store](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/install-CloudWatch-Agent-on-EC2-Instance-fleet.html) में अपने कॉन्फ़िगरेशन संग्रहीत और पुनर्प्राप्त करने की क्षमता होती है। इस स्वचालित तंत्र के माध्यम से CloudWatch agent कॉन्फ़िगरेशन का डिप्लॉयमेंट एक सर्वोत्तम प्रथा है।
:::

:::tip
	वैकल्पिक रूप से, CloudWatch agent की कॉन्फ़िगरेशन फ़ाइलों को आपकी पसंद के स्वचालन टूल ([Ansible](https://www.ansible.com), [Puppet](https://puppet.com), आदि) के माध्यम से डिप्लॉय किया जा सकता है। Systems Manager Parameter Store का उपयोग आवश्यक नहीं है, हालाँकि यह प्रबंधन को सरल बनाता है।
:::
## AWS के बाहर डिप्लॉयमेंट

CloudWatch agent का उपयोग AWS के अंदर तक *सीमित नहीं* है, और यह ऑन-प्रिमाइसेस और अन्य क्लाउड वातावरण दोनों में समर्थित है। हालाँकि AWS के बाहर CloudWatch agent का उपयोग करते समय दो अतिरिक्त बातों का ध्यान रखना होगा:

1. Agent को आवश्यक API कॉल करने की अनुमति देने के लिए IAM क्रेडेंशियल[^2] सेट अप करना। EC2 में भी CloudWatch API तक अप्रमाणित पहुँच नहीं है[^5]।
1. यह सुनिश्चित करना कि agent की CloudWatch, CloudWatch Logs, और अन्य AWS endpoints[^3] तक कनेक्टिविटी एक ऐसे रूट का उपयोग करके है जो आपकी आवश्यकताओं को पूरा करता है। यह इंटरनेट के माध्यम से, [AWS Direct Connect](https://aws.amazon.com/directconnect/) का उपयोग करके, या [प्राइवेट endpoint](https://docs.aws.amazon.com/vpc/latest/privatelink/concepts.html) (आम तौर पर *VPC endpoint* कहा जाता है) के माध्यम से हो सकता है।

:::info
	आपके वातावरण और CloudWatch के बीच परिवहन को आपकी गवर्नेंस और सुरक्षा आवश्यकताओं से मेल खाना चाहिए। सामान्य रूप से, AWS के बाहर वर्कलोड के लिए प्राइवेट endpoints का उपयोग सबसे कड़ाई से विनियमित उद्योगों के ग्राहकों की आवश्यकताओं को भी पूरा करता है। हालाँकि, अधिकांश ग्राहकों को हमारे पब्लिक endpoints द्वारा अच्छी तरह से सेवा दी जाएगी।
:::
## प्राइवेट endpoints का उपयोग

Metrics और logs पुश करने के लिए, CloudWatch agent की *CloudWatch* और *CloudWatch Logs* endpoints तक कनेक्टिविटी होनी चाहिए। Agent कहाँ इंस्टॉल है इसके आधार पर इसे प्राप्त करने के कई तरीके हैं।

### VPC से

a. आप *VPC Endpoints* (CloudWatch और CloudWatch Logs के लिए) का उपयोग करके अपने VPC और CloudWatch के बीच EC2 पर चल रहे agent के लिए पूरी तरह से प्राइवेट और सुरक्षित कनेक्शन स्थापित कर सकते हैं। इस दृष्टिकोण से, agent ट्रैफ़िक कभी भी इंटरनेट से नहीं गुज़रता।

b. एक अन्य विकल्प पब्लिक [NAT gateway](https://docs.aws.amazon.com/vpc/latest/userguide/vpc-nat-gateway.html) है जिसके माध्यम से प्राइवेट सबनेट इंटरनेट से कनेक्ट हो सकते हैं, लेकिन इंटरनेट से अनचाहे इनबाउंड कनेक्शन प्राप्त नहीं कर सकते।

:::note
	कृपया ध्यान दें कि इस दृष्टिकोण में agent ट्रैफ़िक तार्किक रूप से इंटरनेट के माध्यम से रूट होगा।
:::
c. यदि आपके पास मौजूदा TLS और [Sigv4](https://docs.aws.amazon.com/general/latest/gr/signature-version-4.html) तंत्र से परे प्राइवेट या सुरक्षित कनेक्टिविटी की आवश्यकता नहीं है, तो सबसे आसान विकल्प हमारे endpoints तक कनेक्टिविटी प्रदान करने के लिए [Internet Gateway](https://docs.aws.amazon.com/vpc/latest/userguide/VPC_Internet_Gateway.html) का होना है।

### ऑन-प्रिमाइसेस या अन्य क्लाउड वातावरण से

a. AWS के बाहर चल रहे agent इंटरनेट (अपने नेटवर्क सेटअप के माध्यम से) या Direct Connect [Public VIF](https://docs.aws.amazon.com/directconnect/latest/UserGuide/WorkingWithVirtualInterfaces.html) के माध्यम से CloudWatch पब्लिक endpoints से कनेक्टिविटी स्थापित कर सकते हैं।

b. यदि आपको आवश्यकता है कि agent ट्रैफ़िक इंटरनेट के माध्यम से रूट न हो तो आप AWS PrivateLink द्वारा संचालित [VPC Interface endpoints](https://docs.aws.amazon.com/vpc/latest/userguide/vpce-interface.html) का लाभ उठा सकते हैं, Direct Connect Private VIF या VPN का उपयोग करके प्राइवेट कनेक्टिविटी को अपने ऑन-प्रिमाइसेस नेटवर्क तक विस्तारित कर सकते हैं। आपका ट्रैफ़िक इंटरनेट पर एक्सपोज़ नहीं होता, खतरे के वेक्टर समाप्त हो जाते हैं।

:::success
	आप [AWS Systems Manager agent](https://docs.aws.amazon.com/systems-manager/latest/userguide/ssm-agent.html) से प्राप्त क्रेडेंशियल का उपयोग करके CloudWatch agent के लिए [अस्थायी AWS एक्सेस टोकन](https://aws.amazon.com/premiumsupport/knowledge-center/cloudwatch-on-premises-temp-credentials/) जोड़ सकते हैं।
:::

[^1]: CloudWatch agent के उपयोग और डिप्लॉयमेंट के लिए मार्गदर्शन के लिए [Getting started with open source Amazon CloudWatch Agent](https://aws.amazon.com/blogs/opensource/getting-started-with-open-source-amazon-cloudwatch-agent/) ब्लॉग देखें।


[^2]: [ऑन-प्रिमाइसेस और अन्य क्लाउड वातावरण में चल रहे agent के लिए क्रेडेंशियल सेट करने का मार्गदर्शन](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/install-CloudWatch-Agent-commandline-fleet.html#install-CloudWatch-Agent-iam_user-first)

[^3]: [CloudWatch endpoints तक कनेक्टिविटी सत्यापित करने का तरीका](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/install-CloudWatch-Agent-commandline-fleet.html#install-CloudWatch-Agent-internet-access-first-cmd)

[^4]: [ऑन-प्रिमाइसेस प्राइवेट कनेक्टिविटी ब्लॉग](https://aws.amazon.com/blogs/networking-and-content-delivery/hybrid-networking-using-vpc-endpoints-aws-privatelink-and-amazon-cloudwatch-for-financial-services/)

[^5]: Observability से संबंधित सभी AWS API का उपयोग आम तौर पर [इंस्टेंस प्रोफ़ाइल](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_use_switch-role-ec2_instance-profiles.html) के माध्यम से किया जाता है - AWS में चल रहे इंस्टेंस और कंटेनरों को अस्थायी एक्सेस क्रेडेंशियल प्रदान करने का एक तंत्र।

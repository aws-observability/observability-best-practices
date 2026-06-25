# CloudWatch Agent


## CloudWatch agent ను డిప్లాయ్ చేయడం

CloudWatch agent ను సింగిల్ ఇన్‌స్టాలేషన్‌గా, డిస్ట్రిబ్యూటెడ్ కాన్ఫిగరేషన్ ఫైల్ ఉపయోగించి, మల్టిపుల్ కాన్ఫిగరేషన్ ఫైల్‌లను లేయరింగ్ చేయడం ద్వారా మరియు పూర్తిగా ఆటోమేషన్ ద్వారా డిప్లాయ్ చేయవచ్చు. మీ అవసరాలను బట్టి ఏ విధానం మీకు సరైనదో నిర్ణయించబడుతుంది. [^1]

:::info
	Windows మరియు Linux హోస్ట్‌లకు డిప్లాయ్‌మెంట్ రెండూ వాటి కాన్ఫిగరేషన్‌లను [Systems Manager Parameter Store](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/install-CloudWatch-Agent-on-EC2-Instance-fleet.html) లో స్టోర్ చేయడానికి మరియు తిరిగి పొందడానికి సామర్థ్యం కలిగి ఉన్నాయి. ఈ ఆటోమేటెడ్ మెకానిజం ద్వారా CloudWatch agent కాన్ఫిగరేషన్ యొక్క డిప్లాయ్‌మెంట్‌ను ట్రీట్ చేయడం ఒక ఉత్తమ పద్ధతి.
:::

:::tip
	ప్రత్యామ్నాయంగా, CloudWatch agent కోసం కాన్ఫిగరేషన్ ఫైల్‌లను మీ ఎంపిక యొక్క ఆటోమేషన్ టూల్ ([Ansible](https://www.ansible.com), [Puppet](https://puppet.com), మొదలైనవి) ద్వారా డిప్లాయ్ చేయవచ్చు. Systems Manager Parameter Store ఉపయోగం అవసరం లేదు, అయినప్పటికీ ఇది నిర్వహణను సులభతరం చేస్తుంది.
:::
## AWS వెలుపల డిప్లాయ్‌మెంట్

CloudWatch agent ఉపయోగం AWS లోపలికి *మాత్రమే* పరిమితం కాదు, మరియు ఆన్-ప్రిమైసెస్ మరియు ఇతర క్లౌడ్ పరిసరాలలో రెండింటిలోనూ మద్దతు ఇవ్వబడుతుంది. AWS వెలుపల CloudWatch agent ను ఉపయోగించేటప్పుడు పాటించవలసిన రెండు అదనపు పరిగణనలు ఉన్నాయి:

1. అవసరమైన API కాల్స్ చేయడానికి agent కు అనుమతించడానికి IAM credentials [^2] సెటప్ చేయడం. EC2 లో కూడా CloudWatch API లకు అనధీకృత ప్రాప్యత లేదు [^5].
1. మీ అవసరాలకు అనుగుణమైన మార్గాన్ని ఉపయోగించి CloudWatch, CloudWatch Logs మరియు ఇతర AWS ఎండ్‌పాయింట్‌లకు [^3] agent కనెక్టివిటీ ఉందని నిర్ధారించడం. ఇది ఇంటర్నెట్ ద్వారా, [AWS Direct Connect](https://aws.amazon.com/directconnect/) ఉపయోగించి, లేదా [private endpoint](https://docs.aws.amazon.com/vpc/latest/privatelink/concepts.html) ద్వారా (సాధారణంగా *VPC endpoint* అని పిలువబడేది) కావచ్చు.

:::info
	మీ పరిసరం(లు) మరియు CloudWatch మధ్య రవాణా మీ గవర్నెన్స్ మరియు భద్రతా అవసరాలకు అనుగుణంగా ఉండాలి. సాధారణంగా చెప్పాలంటే, AWS వెలుపల వర్క్‌లోడ్‌ల కోసం private endpoints ను ఉపయోగించడం అత్యంత కఠినంగా నియంత్రించబడే పరిశ్రమలలోని కస్టమర్ల అవసరాలను తీరుస్తుంది. అయితే, ఎక్కువ మంది కస్టమర్లు మా పబ్లిక్ ఎండ్‌పాయింట్‌ల ద్వారా బాగా సేవలందుకుంటారు.
:::
## Private endpoints ఉపయోగం

మెట్రిక్స్ మరియు లాగ్‌లను పుష్ చేయడానికి, CloudWatch agent కు *CloudWatch* మరియు *CloudWatch Logs* ఎండ్‌పాయింట్‌లకు కనెక్టివిటీ ఉండాలి. Agent ఇన్‌స్టాల్ చేయబడిన ప్రదేశం ఆధారంగా దీనిని సాధించడానికి అనేక మార్గాలు ఉన్నాయి.

### VPC నుండి

a. EC2 పై నడుస్తున్న agent కోసం మీ VPC మరియు CloudWatch మధ్య పూర్తిగా ప్రైవేట్ మరియు సురక్షిత కనెక్షన్‌ను స్థాపించడానికి మీరు *VPC Endpoints* (CloudWatch మరియు CloudWatch Logs కోసం) ను ఉపయోగించవచ్చు. ఈ విధానంతో, agent ట్రాఫిక్ ఎప్పుడూ ఇంటర్నెట్‌ను దాటదు.

b. మరొక ప్రత్యామ్నాయం ఏమిటంటే, ప్రైవేట్ సబ్‌నెట్‌లు ఇంటర్నెట్‌కు కనెక్ట్ అవ్వవచ్చు కానీ ఇంటర్నెట్ నుండి అనవసరమైన ఇన్‌బౌండ్ కనెక్షన్‌లను అందుకోలేవు అనే పబ్లిక్ [NAT gateway](https://docs.aws.amazon.com/vpc/latest/userguide/vpc-nat-gateway.html) కలిగి ఉండటం.

:::note
	దయచేసి ఈ విధానంతో agent ట్రాఫిక్ తార్కికంగా ఇంటర్నెట్ ద్వారా రూట్ చేయబడుతుందని గమనించండి.
:::
c. ఇప్పటికే ఉన్న TLS మరియు [Sigv4](https://docs.aws.amazon.com/general/latest/gr/signature-version-4.html) మెకానిజమ్‌ల కంటే ప్రైవేట్ లేదా సురక్షిత కనెక్టివిటీని స్థాపించే అవసరం మీకు లేకపోతే, మా ఎండ్‌పాయింట్‌లకు కనెక్టివిటీని అందించడానికి [Internet Gateway](https://docs.aws.amazon.com/vpc/latest/userguide/VPC_Internet_Gateway.html) కలిగి ఉండటం సులభమైన ఎంపిక.

### ఆన్-ప్రిమైసెస్ లేదా ఇతర క్లౌడ్ పరిసరాల నుండి

a. AWS వెలుపల నడుస్తున్న Agents ఇంటర్నెట్ ద్వారా (వారి స్వంత నెట్‌వర్క్ సెటప్ ద్వారా) లేదా Direct Connect [Public VIF](https://docs.aws.amazon.com/directconnect/latest/UserGuide/WorkingWithVirtualInterfaces.html) ద్వారా CloudWatch పబ్లిక్ ఎండ్‌పాయింట్‌లకు కనెక్టివిటీని స్థాపించగలరు.

b. Agent ట్రాఫిక్ ఇంటర్నెట్ ద్వారా రూట్ కాకూడదని మీకు అవసరమైతే, Direct Connect Private VIF లేదా VPN ఉపయోగించి మీ ఆన్-ప్రిమైసెస్ నెట్‌వర్క్ వరకు ప్రైవేట్ కనెక్టివిటీని విస్తరించడానికి AWS PrivateLink ద్వారా ఆధారితమైన [VPC Interface endpoints](https://docs.aws.amazon.com/vpc/latest/userguide/vpce-interface.html) ను ఉపయోగించవచ్చు. మీ ట్రాఫిక్ ఇంటర్నెట్‌కు బహిర్గతం కాదు, ముప్పు వెక్టర్‌లను తొలగిస్తుంది.

:::success
	[AWS Systems Manager agent](https://docs.aws.amazon.com/systems-manager/latest/userguide/ssm-agent.html) నుండి పొందిన credentials ఉపయోగించి CloudWatch agent ద్వారా ఉపయోగించడానికి [ephemeral AWS access tokens](https://aws.amazon.com/premiumsupport/knowledge-center/cloudwatch-on-premises-temp-credentials/) ను జోడించవచ్చు.
:::

[^1]: CloudWatch agent ఉపయోగం మరియు డిప్లాయ్‌మెంట్ కోసం మార్గదర్శకత్వం అందించే బ్లాగ్ కోసం [Getting started with open source Amazon CloudWatch Agent](https://aws.amazon.com/blogs/opensource/getting-started-with-open-source-amazon-cloudwatch-agent/) చూడండి.


[^2]: [ఆన్-ప్రిమైసెస్ మరియు ఇతర క్లౌడ్ పరిసరాలలో నడుస్తున్న agents కోసం credentials సెట్ చేయడం గురించి మార్గదర్శకత్వం](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/install-CloudWatch-Agent-commandline-fleet.html#install-CloudWatch-Agent-iam_user-first)

[^3]: [CloudWatch ఎండ్‌పాయింట్‌లకు కనెక్టివిటీని ఎలా ధృవీకరించాలి](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/install-CloudWatch-Agent-commandline-fleet.html#install-CloudWatch-Agent-internet-access-first-cmd)

[^4]: [ఆన్-ప్రిమైసెస్, ప్రైవేట్ కనెక్టివిటీ కోసం బ్లాగ్](https://aws.amazon.com/blogs/networking-and-content-delivery/hybrid-networking-using-vpc-endpoints-aws-privatelink-and-amazon-cloudwatch-for-financial-services/)

[^5]: Observability కి సంబంధించిన అన్ని AWS API ల ఉపయోగం సాధారణంగా [instance profile](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_use_switch-role-ec2_instance-profiles.html) ద్వారా సాధించబడుతుంది - AWS లో నడుస్తున్న instances మరియు containers కు తాత్కాలిక ప్రాప్యత credentials ను మంజూరు చేసే మెకానిజం.

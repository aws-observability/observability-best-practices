# CloudWatch Agent


## CloudWatch agent-ஐ நிறுவுதல்

CloudWatch agent-ஐ ஒற்றை நிறுவலாக, விநியோகிக்கப்பட்ட உள்ளமைவு கோப்பைப் பயன்படுத்தி, பல உள்ளமைவு கோப்புகளை அடுக்கி வைத்து, மற்றும் முழுமையாக தானியக்கம் மூலம் நிறுவலாம். உங்களுக்கு எந்த அணுகுமுறை பொருத்தமானது என்பது உங்கள் தேவைகளைப் பொறுத்தது. [^1]

:::info
	Windows மற்றும் Linux ஹோஸ்ட்களுக்கான நிறுவல் இரண்டும் [Systems Manager Parameter Store](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/install-CloudWatch-Agent-on-EC2-Instance-fleet.html)-ல் உள்ளமைவுகளைச் சேமிக்கவும் மீட்டெடுக்கவும் திறன் கொண்டவை. இந்த தானியங்கி வழிமுறை மூலம் CloudWatch agent உள்ளமைவை நிறுவுவது சிறந்த நடைமுறையாகும்.
:::

:::tip
	மாற்றாக, CloudWatch agent-ன் உள்ளமைவு கோப்புகளை உங்கள் விருப்பமான தானியக்க கருவி ([Ansible](https://www.ansible.com), [Puppet](https://puppet.com) போன்றவை) மூலம் நிறுவலாம். Systems Manager Parameter Store-ன் பயன்பாடு கட்டாயமில்லை, ஆனால் நிர்வாகத்தை எளிதாக்குகிறது.
:::
## AWS-க்கு வெளியே நிறுவுதல்

CloudWatch agent-ன் பயன்பாடு AWS-க்குள் மட்டுமே *வரம்பிடப்படவில்லை*, மேலும் ஆன்-பிரிமைஸ் மற்றும் பிற கிளவுட் சூழல்களிலும் ஆதரிக்கப்படுகிறது. இருப்பினும், AWS-க்கு வெளியே CloudWatch agent-ஐப் பயன்படுத்தும்போது இரண்டு கூடுதல் கருத்தில் கொள்ள வேண்டிய விஷயங்கள் உள்ளன:

1. agent தேவையான API அழைப்புகளைச் செய்ய IAM சான்றுகளை[^2] அமைத்தல். EC2-லும் கூட CloudWatch API-களுக்கு அங்கீகரிக்கப்படாத அணுகல் இல்லை[^5].
1. உங்கள் தேவைகளைப் பூர்த்தி செய்யும் வழியைப் பயன்படுத்தி agent-க்கு CloudWatch, CloudWatch Logs மற்றும் பிற AWS எண்ட்பாயிண்ட்களுக்கு[^3] இணைப்பு இருப்பதை உறுதிசெய்தல். இது இணையம் வழியாக, [AWS Direct Connect](https://aws.amazon.com/directconnect/) பயன்படுத்தி, அல்லது [தனிப்பட்ட எண்ட்பாயிண்ட்](https://docs.aws.amazon.com/vpc/latest/privatelink/concepts.html) (பொதுவாக *VPC எண்ட்பாயிண்ட்* என அழைக்கப்படுகிறது) மூலம் இருக்கலாம்.

:::info
	உங்கள் சூழல்(கள்) மற்றும் CloudWatch இடையிலான போக்குவரத்து உங்கள் நிர்வாகம் மற்றும் பாதுகாப்பு தேவைகளுடன் பொருந்த வேண்டும். பொதுவாக, AWS-க்கு வெளியே பணிச்சுமைகளுக்கு தனிப்பட்ட எண்ட்பாயிண்ட்களைப் பயன்படுத்துவது மிகவும் கடுமையாக ஒழுங்குபடுத்தப்பட்ட தொழில்களின் வாடிக்கையாளர் தேவைகளையும் பூர்த்தி செய்கிறது. இருப்பினும், பெரும்பாலான வாடிக்கையாளர்களுக்கு எங்கள் பொது எண்ட்பாயிண்ட்கள் மூலம் நன்றாக சேவை செய்யப்படும்.
:::
## தனிப்பட்ட எண்ட்பாயிண்ட்களின் பயன்பாடு

மெட்ரிக்குகள் மற்றும் லாக்குகளை அனுப்ப, CloudWatch agent *CloudWatch* மற்றும் *CloudWatch Logs* எண்ட்பாயிண்ட்களுக்கு இணைப்பு கொண்டிருக்க வேண்டும். agent நிறுவப்பட்ட இடத்தின் அடிப்படையில் இதை அடைய பல வழிகள் உள்ளன.

### VPC-யிலிருந்து

a. *VPC எண்ட்பாயிண்ட்களைப்* (CloudWatch மற்றும் CloudWatch Logs-க்கு) பயன்படுத்தி உங்கள் VPC மற்றும் CloudWatch இடையே முழுமையாக தனிப்பட்ட மற்றும் பாதுகாப்பான இணைப்பை நிறுவலாம், EC2-ல் இயங்கும் agent போக்குவரத்து இணையத்தை கடக்காது.

b. மற்றொரு மாற்று பொது [NAT gateway](https://docs.aws.amazon.com/vpc/latest/userguide/vpc-nat-gateway.html) வைத்திருப்பது, இதன் மூலம் தனிப்பட்ட சப்நெட்கள் இணையத்துடன் இணையலாம், ஆனால் இணையத்திலிருந்து வேண்டாத உள்வரும் இணைப்புகளைப் பெற முடியாது.

:::note
	இந்த அணுகுமுறையில் agent போக்குவரத்து தர்க்கரீதியாக இணையம் வழியாக வழிநடத்தப்படும் என்பதை நினைவில் கொள்ளுங்கள்.
:::
c. ஏற்கனவே உள்ள TLS மற்றும் [Sigv4](https://docs.aws.amazon.com/general/latest/gr/signature-version-4.html) வழிமுறைகளுக்கு அப்பால் தனிப்பட்ட அல்லது பாதுகாப்பான இணைப்பு தேவையில்லை எனில், எங்கள் எண்ட்பாயிண்ட்களுக்கு இணைப்பை வழங்க [Internet Gateway](https://docs.aws.amazon.com/vpc/latest/userguide/VPC_Internet_Gateway.html) வைத்திருப்பது எளிதான வழி.

### ஆன்-பிரிமைஸ் அல்லது பிற கிளவுட் சூழல்களிலிருந்து

a. AWS-க்கு வெளியே இயங்கும் agent-கள் இணையம் வழியாக (தங்கள் சொந்த நெட்வொர்க் அமைப்பு மூலம்) அல்லது Direct Connect [Public VIF](https://docs.aws.amazon.com/directconnect/latest/UserGuide/WorkingWithVirtualInterfaces.html) மூலம் CloudWatch பொது எண்ட்பாயிண்ட்களுக்கு இணைப்பை நிறுவலாம்.

b. agent போக்குவரத்து இணையம் வழியாக வழிநடத்தப்படாமல் இருக்க வேண்டும் எனில், AWS PrivateLink ஆல் இயக்கப்படும் [VPC Interface எண்ட்பாயிண்ட்களைப்](https://docs.aws.amazon.com/vpc/latest/userguide/vpce-interface.html) பயன்படுத்தி Direct Connect Private VIF அல்லது VPN மூலம் உங்கள் ஆன்-பிரிமைஸ் நெட்வொர்க் வரை தனிப்பட்ட இணைப்பை நீட்டிக்கலாம். உங்கள் போக்குவரத்து இணையத்தில் வெளிப்படாது, அச்சுறுத்தல் வழிகள் நீக்கப்படும்.

:::success
	[AWS Systems Manager agent](https://docs.aws.amazon.com/systems-manager/latest/userguide/ssm-agent.html)-லிருந்து பெறப்பட்ட சான்றுகளைப் பயன்படுத்தி CloudWatch agent-க்கு [தற்காலிக AWS அணுகல் டோக்கன்களைச்](https://aws.amazon.com/premiumsupport/knowledge-center/cloudwatch-on-premises-temp-credentials/) சேர்க்கலாம்.
:::

[^1]: CloudWatch agent பயன்பாடு மற்றும் நிறுவல் பற்றிய வழிகாட்டுதலுக்கு [Getting started with open source Amazon CloudWatch Agent](https://aws.amazon.com/blogs/opensource/getting-started-with-open-source-amazon-cloudwatch-agent/) வலைப்பதிவைப் பாருங்கள்.


[^2]: [ஆன்-பிரிமைஸ் மற்றும் பிற கிளவுட் சூழல்களில் இயங்கும் agent-களுக்கான சான்றுகள் அமைக்கும் வழிகாட்டுதல்](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/install-CloudWatch-Agent-commandline-fleet.html#install-CloudWatch-Agent-iam_user-first)

[^3]: [CloudWatch எண்ட்பாயிண்ட்களுக்கான இணைப்பை சரிபார்க்கும் முறை](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/install-CloudWatch-Agent-commandline-fleet.html#install-CloudWatch-Agent-internet-access-first-cmd)

[^4]: [ஆன்-பிரிமைஸ் தனிப்பட்ட இணைப்பு வலைப்பதிவு](https://aws.amazon.com/blogs/networking-and-content-delivery/hybrid-networking-using-vpc-endpoints-aws-privatelink-and-amazon-cloudwatch-for-financial-services/)

[^5]: Observability தொடர்பான அனைத்து AWS API-களின் பயன்பாடும் பொதுவாக [instance profile](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_use_switch-role-ec2_instance-profiles.html) மூலம் நிறைவேற்றப்படுகிறது - இது AWS-ல் இயங்கும் நிகழ்வுகள் மற்றும் கண்டெய்னர்களுக்கு தற்காலிக அணுகல் சான்றுகளை வழங்கும் வழிமுறையாகும்.

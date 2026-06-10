# Amazon Managed Grafana - அடிக்கடி கேட்கப்படும் கேள்விகள்

## நான் ஏன் Amazon Managed Grafana-ஐ தேர்வு செய்ய வேண்டும்?

**[உயர் கிடைக்கும்தன்மை](https://docs.aws.amazon.com/grafana/latest/userguide/disaster-recovery-resiliency.html)**: Amazon Managed Grafana வொர்க்ஸ்பேஸ்கள் மல்டி-AZ ரெப்ளிகேஷனுடன் உயர் கிடைக்கும்தன்மை கொண்டவை. Amazon Managed Grafana வொர்க்ஸ்பேஸ்களின் ஆரோக்கியத்தை தொடர்ச்சியாக கண்காணித்து, வொர்க்ஸ்பேஸ்களுக்கான அணுகலை பாதிக்காமல் ஆரோக்கியமற்ற நோடுகளை மாற்றுகிறது. Amazon Managed Grafana கம்ப்யூட் மற்றும் டேட்டாபேஸ் நோடுகளின் கிடைக்கும்தன்மையை நிர்வகிப்பதால், வாடிக்கையாளர்கள் நிர்வாகம் மற்றும் பராமரிப்புக்கு தேவையான உள்கட்டமைப்பு வளங்களை நிர்வகிக்க வேண்டியதில்லை.

**[தரவு பாதுகாப்பு](https://docs.aws.amazon.com/grafana/latest/userguide/security.html)**: Amazon Managed Grafana எந்த சிறப்பு உள்ளமைவு, மூன்றாம் தரப்பு கருவிகள் அல்லது கூடுதல் செலவு இல்லாமல் ஓய்வு நிலையில் தரவை என்கிரிப்ட் செய்கிறது. [பரிமாற்றத்தில் உள்ள தரவு](https://docs.aws.amazon.com/grafana/latest/userguide/infrastructure-security.html) TLS வழியாகவும் என்கிரிப்ட் செய்யப்படுகிறது.

## எந்த AWS பிராந்தியங்கள் ஆதரிக்கப்படுகின்றன?

ஆதரிக்கப்படும் பிராந்தியங்களின் தற்போதைய பட்டியல் [ஆவணத்தில் உள்ள ஆதரிக்கப்படும் பிராந்தியங்கள் பிரிவில்](https://docs.aws.amazon.com/grafana/latest/userguide/what-is-Amazon-Managed-Service-Grafana.html#AMG-supported-Regions) கிடைக்கிறது.

## எங்கள் Organization-ல் பல AWS கணக்குகள் பல பிராந்தியங்களில் உள்ளன, Amazon Managed Grafana இந்த சூழ்நிலைகளுக்கு வேலை செய்யுமா?

Amazon Managed Grafana [AWS Organizations](https://docs.aws.amazon.com/organizations/latest/userguide/orgs_introduction.html)-உடன் ஒருங்கிணைக்கப்பட்டு, Organizational Units (OUs)-ல் உள்ள AWS கணக்குகள் மற்றும் வளங்களைக் கண்டறிகிறது. AWS Organizations மூலம் வாடிக்கையாளர்கள் பல AWS கணக்குகளுக்கான [டேட்டா சோர்ஸ் உள்ளமைவு மற்றும் அனுமதி அமைப்புகளை மையமாக நிர்வகிக்கலாம்](https://docs.aws.amazon.com/grafana/latest/userguide/AMG-and-Organizations.html).

## Amazon Managed Grafana-வில் எந்த டேட்டா சோர்ஸ்கள் ஆதரிக்கப்படுகின்றன?

டேட்டா சோர்ஸ்கள் என்பது Grafana-வில் டாஷ்போர்டுகளை உருவாக்க வாடிக்கையாளர்கள் வினவக்கூடிய சேமிப்பு பின்னணிகள் ஆகும். Amazon Managed Grafana Amazon CloudWatch, Amazon OpenSearch Service, AWS IoT SiteWise, AWS IoT TwinMaker, Amazon Managed Service for Prometheus, Amazon Timestream, Amazon Athena, Amazon Redshift, AWS X-Ray மற்றும் பல உள்ளிட்ட AWS நேட்டிவ் சேவைகள் உட்பட [30+ உள்ளமைக்கப்பட்ட டேட்டா சோர்ஸ்களை](https://docs.aws.amazon.com/grafana/latest/userguide/AMG-data-sources-builtin.html) ஆதரிக்கிறது. கூடுதலாக, Grafana Enterprise-ல் மேம்படுத்தப்பட்ட வொர்க்ஸ்பேஸ்களுக்கு [சுமார் 15+ பிற டேட்டா சோர்ஸ்களும்](https://docs.aws.amazon.com/grafana/latest/userguide/AMG-data-sources-enterprise.html) கிடைக்கின்றன.

## எனது வொர்க்லோடுகளின் டேட்டா சோர்ஸ்கள் தனிப்பட்ட VPC-களில் உள்ளன. அவற்றை Amazon Managed Grafana-வுடன் பாதுகாப்பாக எவ்வாறு இணைப்பது?

[VPC-க்குள் உள்ள](https://docs.aws.amazon.com/grafana/latest/userguide/AMG-configure-vpc.html) தனிப்பட்ட டேட்டா சோர்ஸ்களை AWS PrivateLink வழியாக Amazon Managed Grafana-வுடன் இணைத்து ட்ராஃபிக்கை பாதுகாப்பாக வைக்கலாம். [VPC எண்ட்பாயிண்ட்களிலிருந்து](https://docs.aws.amazon.com/grafana/latest/userguide/AMG-configure-nac.html) Amazon Managed Grafana சேவைக்கான கூடுதல் அணுகல் கட்டுப்பாட்டை [Amazon VPC எண்ட்பாயிண்ட்களுக்கான](https://docs.aws.amazon.com/whitepapers/latest/aws-privatelink/what-are-vpc-endpoints.html) [IAM resource policy](https://docs.aws.amazon.com/grafana/latest/userguide/VPC-endpoints.html#controlling-vpc) இணைப்பதன் மூலம் கட்டுப்படுத்தலாம்.

## Amazon Managed Grafana-வில் எந்த பயனர் அங்கீகார வழிமுறை கிடைக்கிறது?

Amazon Managed Grafana வொர்க்ஸ்பேஸில், Security Assertion Markup Language 2.0 (SAML 2.0) அல்லது AWS IAM Identity Center (AWS Single Sign-On-ன் வாரிசு) ஆதரிக்கும் எந்த IDP-யையும் பயன்படுத்தி [பயனர்கள் Grafana கன்சோலில் அங்கீகரிக்கப்படுகிறார்கள்](https://docs.aws.amazon.com/grafana/latest/userguide/authentication-in-AMG.html).

> தொடர்புடைய வலைப்பதிவு: [Grafana Teams பயன்படுத்தி Amazon Managed Grafana-வில் நுண்ணிய அணுகல் கட்டுப்பாடு](https://aws.amazon.com/blogs/mt/fine-grained-access-control-in-amazon-managed-grafana-using-grafana-teams/)

## Amazon Managed Grafana-வுக்கு எந்த வகையான ஆட்டோமேஷன் ஆதரவு கிடைக்கிறது?

Amazon Managed Grafana [AWS CloudFormation-உடன் ஒருங்கிணைக்கப்பட்டுள்ளது](https://docs.aws.amazon.com/grafana/latest/userguide/creating-resources-with-cloudformation.html), இது AWS வளங்களை மாடலிங் செய்வதிலும் அமைப்பதிலும் வாடிக்கையாளர்களுக்கு உதவுகிறது. [AWS CloudFormation](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/Welcome.html) மூலம் வாடிக்கையாளர்கள் Amazon Managed Grafana வளங்களை நிலையாகவும் மீண்டும் மீண்டும் அமைக்க டெம்ப்ளேட்களை மறுபயன்படுத்தலாம். Amazon Managed Grafana-வில் [API](https://docs.aws.amazon.com/grafana/latest/APIReference/Welcome.html) கிடைக்கிறது, இது [AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-welcome.html) வழியாக ஆட்டோமேஷன் செய்வதில் அல்லது மென்பொருள்/தயாரிப்புகளுடன் ஒருங்கிணைப்பதில் வாடிக்கையாளர்களுக்கு உதவுகிறது. Amazon Managed Grafana வொர்க்ஸ்பேஸ்களில் ஆட்டோமேஷன் மற்றும் ஒருங்கிணைப்பு ஆதரவுக்காக [HTTP APIs](https://docs.aws.amazon.com/grafana/latest/userguide/Using-Grafana-APIs.html) உள்ளன.

> தொடர்புடைய வலைப்பதிவு: [Amazon Managed Grafana-வுக்கான தனிப்பட்ட VPC டேட்டா சோர்ஸ் ஆதரவை அறிவிக்கிறோம்](https://aws.amazon.com/blogs/mt/announcing-private-vpc-data-source-support-for-amazon-managed-grafana/)

## எனது Organization ஆட்டோமேஷனுக்கு Terraform-ஐ பயன்படுத்துகிறது. Amazon Managed Grafana Terraform-ஐ ஆதரிக்கிறதா?
ஆம், [Amazon Managed Grafana ஆதரிக்கிறது](https://aws-observability.github.io/observability-best-practices/recipes/recipes/amg-automation-tf/) Terraform-ஐ [ஆட்டோமேஷனுக்காக](https://registry.terraform.io/modules/terraform-aws-modules/managed-service-grafana/aws/latest)

> உதாரணம்: [Terraform ஆதரவுக்கான குறிப்பு செயல்படுத்தல்](https://github.com/aws-observability/terraform-aws-observability-accelerator/tree/main/examples/managed-grafana-workspace)

## நான் எனது தற்போதைய Grafana அமைப்பில் பொதுவாக பயன்படுத்தப்படும் டாஷ்போர்டுகளைப் பயன்படுத்துகிறேன். அவற்றை மீண்டும் உருவாக்காமல் Amazon Managed Grafana-வில் பயன்படுத்த வழி உள்ளதா?

Amazon Managed Grafana [HTTP APIs](https://docs.aws.amazon.com/grafana/latest/userguide/Using-Grafana-APIs.html)-ஐ ஆதரிக்கிறது, இது டாஷ்போர்டுகள், பயனர்கள் மற்றும் பலவற்றின் டிப்ளாய்மென்ட் மற்றும் நிர்வாகத்தை எளிதாக ஆட்டோமேட் செய்ய உங்களை அனுமதிக்கிறது. இந்த வளங்களின் நிர்வாகத்தை ஆட்டோமேட் செய்ய உங்கள் GitOps/CICD செயல்முறைகளில் இந்த API-களைப் பயன்படுத்தலாம்.

## Amazon Managed Grafana அலர்ட்களை ஆதரிக்கிறதா?

[Amazon Managed Grafana அலர்ட்டிங்](https://docs.aws.amazon.com/grafana/latest/userguide/alerts-overview.html) வாடிக்கையாளர்களுக்கு வலுவான மற்றும் செயல்படக்கூடிய அலர்ட்களை வழங்குகிறது, இது சேவைகளுக்கான இடையூறுகளை குறைத்து, கிட்டத்தட்ட நிகழ்நேரத்தில் அமைப்புகளில் உள்ள சிக்கல்களைப் பற்றி அறிய உதவுகிறது. Grafana புதுப்பிக்கப்பட்ட அலர்ட்டிங் அமைப்பான Grafana alerting-க்கான அணுகலை உள்ளடக்கியது, இது அலர்ட்டிங் தகவலை ஒற்றை, தேடக்கூடிய பார்வையில் மையப்படுத்துகிறது.

## எனது Organization அனைத்து செயல்களும் ஆடிட்களுக்காக பதிவு செய்யப்பட வேண்டும் என்று கோருகிறது. Amazon Managed Grafana நிகழ்வுகளை பதிவு செய்ய முடியுமா?

Amazon Managed Grafana [AWS CloudTrail](https://docs.aws.amazon.com/awscloudtrail/latest/userguide/cloudtrail-user-guide.html)-உடன் ஒருங்கிணைக்கப்பட்டுள்ளது, இது Amazon Managed Grafana-வில் ஒரு பயனர், ஒரு பாத்திரம் அல்லது ஒரு AWS சேவையால் எடுக்கப்பட்ட செயல்களின் பதிவை வழங்குகிறது. CloudTrail Amazon Managed Grafana-வுக்கான [அனைத்து API அழைப்புகளையும்](https://docs.aws.amazon.com/grafana/latest/userguide/logging-using-cloudtrail.html) நிகழ்வுகளாகப் பிடிக்கிறது. பிடிக்கப்படும் அழைப்புகளில் Amazon Managed Grafana கன்சோலிலிருந்தும் Amazon Managed Grafana API செயல்பாடுகளுக்கான கோட் அழைப்புகளும் அடங்கும்.

## கூடுதல் தகவல் எங்கே கிடைக்கும்?

Amazon Managed Grafana பற்றிய கூடுதல் தகவலுக்கு வாடிக்கையாளர்கள் AWS [ஆவணத்தை](https://docs.aws.amazon.com/grafana/latest/userguide/what-is-Amazon-Managed-Service-Grafana.html) படிக்கலாம், [Amazon Managed Grafana](https://catalog.workshops.aws/observability/en-US/aws-managed-oss/amg) பற்றிய AWS Observability Workshop-ஐ பார்க்கலாம், மற்றும் [அம்சங்கள்](https://aws.amazon.com/grafana/features/?nc=sn&loc=2), [விலை](https://aws.amazon.com/grafana/pricing/?nc=sn&loc=3) விவரங்கள், சமீபத்திய [வலைப்பதிவு இடுகைகள்](https://aws.amazon.com/grafana/resources/?nc=sn&loc=4&msg-blogs.sort-by=item.additionalFields.createdDate&msg-blogs.sort-order=desc#Latest_blog_posts) மற்றும் [வீடியோக்கள்](https://aws.amazon.com/grafana/resources/?nc=sn&loc=4&msg-blogs.sort-by=item.additionalFields.createdDate&msg-blogs.sort-order=desc#Videos) அறிய [தயாரிப்பு பக்கத்தையும்](https://aws.amazon.com/grafana/) பார்க்கலாம்.

**தயாரிப்பு FAQ:** [https://aws.amazon.com/grafana/faqs/](https://aws.amazon.com/grafana/faqs/)

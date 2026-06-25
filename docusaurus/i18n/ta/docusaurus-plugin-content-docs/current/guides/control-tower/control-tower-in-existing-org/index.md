---
sidebar_position: 4
---
# ஏற்கனவே உள்ள AWS Organization-ல் Control Tower இயக்கும்போது கூடுதல் கருத்தில் கொள்ள வேண்டியவை

## Control Tower கணக்குகள்

Control Tower உங்கள் AWS Organization-ன் management கணக்கில் இயக்கப்பட வேண்டும். ஒரே AWS Organization-ல் பல landing zones வைக்க முடியாது.

Control Tower-ஐ ஆரம்பத்தில் இயக்கும்போது, உங்கள் organization-ல் ஏற்கனவே உள்ள கணக்குகளை தானாகவே enroll செய்யாது, ஆனால் இரண்டு OUs, [shared accounts](https://docs.aws.amazon.com/controltower/latest/userguide/accounts.html#special-accounts) மற்றும் [அவற்றில் உள்ள resources](https://docs.aws.amazon.com/controltower/latest/userguide/shared-account-resources.html)-ஐ உருவாக்கும். இதற்கு அனுமதிக்க உங்கள் Organization போதுமான quota கொண்டிருக்க வேண்டும். 

Control Tower அமைக்கும்போது log archive அல்லது audit கணக்குகளுக்கு [ஏற்கனவே உள்ள கணக்குகளைப் பயன்படுத்த](https://aws.amazon.com/blogs/mt/use-existing-logging-and-security-account-with-aws-control-tower/) வேண்டுமானால் முடியும், ஆனால் [config recorder-ஐ நீக்கவும்](https://docs.aws.amazon.com/cli/latest/reference/configservice/delete-configuration-recorder.html) [config delivery channel-ஐ நீக்கவும்](https://docs.aws.amazon.com/cli/latest/reference/configservice/delete-delivery-channel.html) வேண்டும். Control Tower இந்த கணக்குகளை உருவாக்க அனுமதிப்பதும், தேவைக்கேற்ப historical logs-ஐ copy செய்வதும் பொதுவாக எளிது, ஆனால் சில சூழ்நிலைகளில், எடுத்துக்காட்டாக non-AWS சேவைகளுடன் ஏற்கனவே உள்ள log integrations இருக்கும்போது, ஏற்கனவே உள்ள கணக்குகளை மீண்டும் பயன்படுத்துவது அவசியமாக இருக்கலாம். 

## Identity Center

AWS Identity Center-ஐ Control Tower-உடன் பயன்படுத்தி உங்கள் பயனர்களுக்கு authentication வழங்க வலுவாகப் பரிந்துரைக்கிறோம். Control Tower Identity Center நிர்வகிக்க வேண்டாம் என்று தேர்வு செய்தால், ஏற்கனவே Identity Center இயக்கப்படவில்லை என்றால், Control Tower அதை இயக்காது, உங்கள் Organization-க்கு மாற்று identity solution செயல்படுத்த வேண்டும்.

ஏற்கனவே கட்டமைக்கப்பட்ட Identity Center இல்லை என்றால், Identity Center management-க்கு opt-in செய்தால், Control Tower சேவையை இயக்கும் மற்றும் [identity source-ன் தேர்வைப் பொறுத்து](https://docs.aws.amazon.com/controltower/latest/userguide/getting-started-prereqs.html#sso-considerations) groups மற்றும் permission sets provision செய்யலாம் அல்லது செய்யாமலும் இருக்கலாம். 

ஏற்கனவே Identity Center கட்டமைக்கப்பட்டிருந்தால், அது உங்கள் Control Tower home region-ல் இருக்க வேண்டும். Control Tower management-க்கு opt in செய்து, local IAM Identity Center Directory பயன்படுத்துகிறீர்கள் என்றால், Control Tower உங்களுக்கு users, groups மற்றும் permission sets உருவாக்கும். வேறு directory பயன்படுத்துகிறீர்கள் என்றால் [Control Tower எந்த மாற்றமும் செய்யாது](https://docs.aws.amazon.com/controltower/latest/userguide/about-extending-governance.html#sso-and-existing-orgs).

IAM users அல்லது IAM federation பயன்படுத்தும் ஏற்கனவே உள்ள identity solution இருந்தால், Identity Center-ஐ ஏற்றுக்கொள்ள வேண்டும். Control Tower & Identity Center இயக்குவது உங்கள் ஏற்கனவே உள்ள IAM users, roles மற்றும் policies-ல் தாக்கத்தை ஏற்படுத்தாது மற்றும் ஏற்கனவே உள்ள IAM SAML configuration-ஐ பாதிக்காது. உங்கள் பழைய IAM Users / IAM federation-ஐ நீக்கத் தயாராகும் வரை இரண்டு systems-ஐயும் transition காலத்தில் இணையாக இயக்க அனுமதிக்கும். 



## CloudTrail

ஏற்கனவே உள்ள Organization-ல் Control Tower CloudTrail management-ஐ இயக்க விரும்பினால், AWS Control Tower [pre-flight checks](https://docs.aws.amazon.com/controltower/latest/userguide/getting-started-prereqs.html)-ஐ pass செய்ய CloudTrail-க்கு [trusted access-ஐ முடக்க](https://docs.aws.amazon.com/organizations/latest/userguide/services-that-can-integrate-cloudtrail.html#integrate-disable-ta-cloudtrail) வேண்டும்.

Control Tower CloudTrail management-லிருந்து opt out செய்தால், trails டிப்ளாய் செய்தல், logging-ஐ centralizing செய்தல் மற்றும் உங்கள் trails-ஐ பாதுகாக்க security measures செயல்படுத்துவதற்கு நீங்களே பொறுப்பாவீர்கள். Control Tower எப்படியும் [organization trail உருவாக்கும்](https://docs.aws.amazon.com/awscloudtrail/latest/userguide/creating-trail-organization.html), ஆனால் opt-out செய்யும்போது அதன் status off ஆக இருக்கும். Control Tower-ஐ CloudTrail நிர்வகிக்க அனுமதிக்க பரிந்துரைக்கிறோம். 

**Account-level trails கொண்ட ஏற்கனவே உள்ள Organization** இருந்து Control Tower-ல் CloudTrail management இயக்கினால், log archive கணக்கில் உள்ள bucket-க்கு log செய்ய கட்டமைக்கப்பட்ட புதிய Organizations management trail உருவாக்கும். உங்கள் ஏற்கனவே உள்ள trails-ஐ தொடாது, எனவே அவை recording செய்யும்போது உங்கள் Organization முழுவதும் CloudTrail செலவுகளில் குறிப்பிடத்தக்க அதிகரிப்பு எதிர்பார்க்கலாம், ஏனெனில் ஒவ்வொரு account-க்கும் ஒவ்வொரு region-க்கும் management events-ன் முதல் பிரதி மட்டுமே இலவசம். Account level trails-ன் recording-ஐ நிறுத்துவது கூடுதல் செலவுகளைத் தடுக்கும்.

**Organization trail கொண்ட ஏற்கனவே உள்ள Organization** இருந்து Control Tower management-க்கு opt-in செய்தால், [trusted access-ஐ முடக்க](https://docs.aws.amazon.com/organizations/latest/userguide/services-that-can-integrate-cloudtrail.html#integrate-disable-ta-cloudtrail) வேண்டும். இதைச் செய்யும்போது, உங்கள் கணக்குகளில் உள்ள அனைத்து organization trails-ம் செயலிழக்கும், எனவே மீண்டும் active ஆகும்போது recording-க்கு கட்டணம் வசூலிக்கப்படுவதைத் தவிர்க்க உங்கள் ஏற்கனவே உள்ள trail-க்கு [logging-ஐ நிறுத்த](https://docs.aws.amazon.com/awscloudtrail/latest/userguide/cloudtrail-turning-off-logging.html) வேண்டும். பின்னர் trusted access-ஐ முடக்கி Control Tower-ஐ இயக்கவும். இதனால் உங்கள் organization-க்கு CloudTrail data இல்லாத சிறிய காலம் ஏற்படும், எனவே maintenance window-ல் திட்டமிட வேண்டும். 


## Config

Control Tower Config management-லிருந்து opt out செய்ய முடியாது.  

ஏற்கனவே உள்ள Organization-ல் Control Tower இயக்குகிறீர்கள் என்றால், Control Tower [pre-launch checks](https://docs.aws.amazon.com/controltower/latest/userguide/getting-started-prereqs.html)-ஐ pass செய்ய [Config-க்கான Trusted Access முடக்கப்பட்டிருப்பதை](https://docs.aws.amazon.com/organizations/latest/userguide/services-that-can-integrate-config.html#integrate-disable-ta-config) உறுதிசெய்ய வேண்டும். Enablement process-ன் போது Control Tower trusted access-ஐ இயக்கும்.

Log archive மற்றும் audit கணக்குகளுக்கு ஏற்கனவே உள்ள கணக்குகளைப் பயன்படுத்த திட்டமிட்டால், முதலில் அந்த கணக்குகளிலிருந்து [அனைத்து Config resources-ஐ நீக்க](https://docs.aws.amazon.com/controltower/latest/userguide/existing-config-resources.html) வேண்டும். 



## Backup

Control Tower [AWS Backup integration](https://docs.aws.amazon.com/controltower/latest/userguide/backup.html) ஒவ்வொரு member கணக்கிலும் vault, shared கணக்கில் central vault மற்றும் சில அடிப்படை backup policies கொண்ட அடிப்படை backup solution அமைக்க உதவும். இது OU level-ல் இயக்கலாம் மற்றும் தனிப்பட்ட resources-ஐ தொடர்புடைய backup schedule-க்கு tag செய்யலாம். 

ஏற்கனவே backup solution இருந்தால் Backup integration-லிருந்து opt out செய்யலாம். 

Control Tower integration logically air-gapped vault-ஐ டிப்ளாய் செய்யாது மற்றும் cross-region backup-க்கான configuration-ஐ out of the box வழங்காது.


## ஏற்கனவே உள்ள OUs மற்றும் கணக்குகளுக்கு governance நீட்டித்தல்

ஏற்கனவே உள்ள organization-ல் Control Tower இயக்குவது, Organization-ல் ஏற்கனவே உள்ள OUs மற்றும் கணக்குகளுக்கு தானாகவே governance நீட்டிக்காது. [ஏற்கனவே உள்ள கணக்குகளை enroll](https://docs.aws.amazon.com/controltower/latest/userguide/enroll-account.html) செய்து Control Governance-க்கு கீழ் கொண்டுவர Control Tower பயன்படுத்த வேண்டும்.
 
கணக்குகள் enroll செய்ய சில [முன்நிபந்தனைகள்](https://docs.aws.amazon.com/controltower/latest/userguide/enrollment-prerequisites.html) உள்ளன:

* உங்கள் landing zone drift நிலையில் இருக்கக்கூடாது 
* கணக்கு Organization-ன் member ஆக இருக்க வேண்டும்
* [AWSControlTowerExecution](https://docs.aws.amazon.com/controltower/latest/userguide/awscontroltowerexecution.html) role இருக்க வேண்டும் மற்றும் AdministratorAccess permissions கொண்டிருக்க வேண்டும்
* AWSControlTowerExecution role enroll செய்யும் கணக்கில் [Control Tower resources டிப்ளாய்](https://docs.aws.amazon.com/controltower/latest/userguide/enroll-account.html#what-happens-during-account-enrollment) செய்ய Organization [StackSets trusted access enabled](https://docs.aws.amazon.com/organizations/latest/userguide/services-that-can-integrate-cloudformation.html) ஆக இருக்க வேண்டும். 
* ஏற்கனவே உள்ள AWS Config resources [நீக்கப்பட](https://docs.aws.amazon.com/controltower/latest/userguide/enroll-account.html#example-config-cli-commands) வேண்டும். இது சாத்தியமில்லை என்றால் ஏற்கனவே உள்ள Config resources-ஐ பயன்படுத்த customer support-உடன் [process](https://docs.aws.amazon.com/controltower/latest/userguide/existing-config-resources.html) உள்ளது. ஏற்கனவே உள்ள log archive மற்றும் audit கணக்குகளுக்கு இது option அல்ல, அவை Config resources நீக்கப்பட வேண்டும்.

ஏற்கனவே உள்ள AWS கணக்குகளை AWS Control Tower-க்கு கொண்டுவர மிகவும் திறமையான வழி [முழு OU-ஐ register](https://docs.aws.amazon.com/controltower/latest/userguide/importing-existing.html) செய்வதாகும். OU-ஐ register செய்யும்போது, அதன் member கணக்குகள் AWS Control Tower landing zone-க்கு enrolled ஆகும். AWSControlTowerExecution role கணக்குகளுக்கு தானாகவே சேர்க்கப்படும். OU 1000 கணக்குகள் வரை கொண்டிருக்கலாம்.  



## ஏற்கனவே உள்ள Controls

Preventative controls (SCP, RCPs) உள்ள OUs-க்கு ஏற்கனவே உள்ள கணக்குகளை enroll செய்யும்போது, இவை [provisioning அல்லது enrolment actions-ஐ தடுக்காமல்](https://docs.aws.amazon.com/controltower/latest/userguide/quick-account-provisioning.html#common-causes-for-enrollment-failure) இருப்பதை உறுதிசெய்யவும். மாற்றாக, இந்த controls தேவைப்பட்டால், கணக்குகளை dedicated Enrollment OU-க்கு enroll செய்து, பின்னர் அவற்றின் இறுதி இடத்திற்கு நகர்த்தவும்.

AWS Organizations-ல் ஏற்கனவே உள்ள preventative controls கொண்ட கணக்குகள் மற்றும் OUs-க்கு governance நீட்டிக்கும்போது மீறக்கூடாத சில [service limits](https://docs.aws.amazon.com/organizations/latest/userguide/orgs_reference_limits.html) உள்ளன:

* RCPs மற்றும் SCPs-க்கு அதிகபட்ச policy size: 5120 characters
* அதிகபட்ச OU nesting 5 levels
* OU அல்லது கணக்கில் நேரடியாக இணைக்கப்பட்ட அதிகபட்சம் 5 RCPs, 5 SCPs 


Detective controls-க்கு, கணக்கில் ஏற்கனவே வரையறுக்கப்பட்ட Config rules இருந்தால், கணக்கை enroll செய்ய Config recorder-ஐ நீக்கினாலும் இவை நிலைத்திருக்கும். Control Tower-க்கு கணக்கை enroll செய்து புதிய recorder உருவாக்கும்போது rules evaluation-ஐ மீண்டும் தொடங்க வேண்டும். 

Control Tower-க்கு வெளியே வரையறுக்கப்பட்ட config rules-ன் Compliance state Control Tower dashboard-லிருந்து தெரியாது.

Custom Config rules பயன்படுத்துகிறீர்கள் என்றால், உங்கள் முழு AWS Organization-லிருந்தும் compliance-ன் விரிவான பார்வை பெற, [Cloud Intelligence Dashboards](https://catalog.workshops.aws/awscid/en-US) framework-லிருந்து [Config Resource Compliance Dashboard](https://catalog.workshops.aws/awscid/en-US/dashboards/additional/config-resource-compliance-dashboard)-ஐ செயல்படுத்துவதைக் கருத்தில் கொள்ளவும்.  

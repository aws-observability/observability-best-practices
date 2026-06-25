---
sidebar_position: 1
---
# உங்கள் landing zone-ஐ திட்டமிடுதல் மற்றும் செயல்படுத்துதல்

## உங்கள் வணிகத் தேவைகளுக்கு ஏற்ப பிராந்தியங்களை இயக்கவும்

### உங்கள் மிகவும் பொதுவாகப் பயன்படுத்தப்படும் பிராந்தியத்தை Home Region ஆக தேர்வு செய்யவும்

Control Tower பல பிராந்தியங்களை நிர்வகிக்க முடியும் என்றாலும், அது ஒரே ஒரு home region-லிருந்து இயக்கப்பட வேண்டும். உங்கள் பெரும்பாலான பணிச்சுமைகளை இயக்க எதிர்பார்க்கும் பிராந்தியத்தை அடையாளம் கண்டு, இதை உங்கள் Control Tower Home Region ஆக நியமிக்கவும். நீங்கள் AWS Identity Center-ன் ஏற்கனவே உள்ள நிகழ்வைப் பயன்படுத்துகிறீர்கள் என்றால், உங்கள் home region AWS Identity Center கட்டமைக்கப்பட்ட அதே பிராந்தியமாக இருக்க வேண்டும். 

Control Tower home region உங்கள் Landing Zone-க்கான முக்கிய கட்டமைப்பு உருப்படிகளை கொண்டுள்ளது. AWS Organization அங்கே உருவாக்கப்படுகிறது, IAM Identity Center அங்கே இயக்கப்படுகிறது, Cloudtrail தரவு சேமிப்புக்கான S3 பக்கெட்டுகள் அங்கே உள்ளன. Audit கணக்கில் உள்ள AWS Config-ம் home region-ல் கண்டுபிடிப்புகளை ஒருங்கிணைக்க கட்டமைக்கப்பட்டுள்ளது.  


### பயன்படுத்தாத பிராந்தியங்களை மறுக்கவும், அனுமதிக்கப்பட்ட அனைத்து பிராந்தியங்களையும் நிர்வகிக்கவும்

Control Tower பெரும்பாலான AWS பிராந்தியங்களின் பயன்பாட்டை மறுக்கும் திறனை வழங்குகிறது மற்றும் உங்கள் வணிகத் தேவைகளுக்கான துணைக்குழுவை மட்டுமே இயக்குகிறது. இது உங்கள் தாக்குதல் பரப்பைக் குறைக்கிறது, தேவையற்ற செலவை உருவாக்கும் பணிச்சுமைகளின் சாத்தியத்தைக் குறைக்கிறது மற்றும் உங்கள் நிர்வாகம் மற்றும் observability தேவைகளை எளிதாக்குகிறது.  

[Global region deny control](https://docs.aws.amazon.com/controltower/latest/userguide/region-deny.html) உங்கள் landing zone-ஐ உருவாக்கும்போது அல்லது புதுப்பிக்கும்போது அமைக்கலாம். இது Control Tower நிர்வகிக்கப்படும் பிராந்தியப் பட்டியலுடன் இணைந்து செயல்படுகிறது, அதாவது பிராந்தியம் நிர்வாகத்திற்கு இயக்கப்படவில்லை என்றால், அது மறுக்கப்படும். குறிப்பிட்ட Organizational Unit (OU)-க்கு பிராந்திய பயன்பாட்டை மேலும் கட்டுப்படுத்த, [OU region deny control](https://docs.aws.amazon.com/controltower/latest/controlreference/ou-region-deny.html)-ஐயும் செயல்படுத்தலாம். இந்த இரண்டு controls-ம் [Service Control Policies (SCP)](https://docs.aws.amazon.com/organizations/latest/userguide/orgs_manage_policies_scps.html) பயன்படுத்தி செயல்படுத்தப்படுகின்றன. ஒரு பிராந்தியம் மறுக்கப்படவில்லை என்றால், IAM அனுமதிகளுக்கு உட்பட்டு பயனர்கள் அதில் வளங்களை டிப்ளாய் செய்யலாம். உங்கள் பணிச்சுமைகளுக்கு தாக்கம் ஏற்படாமல் இருக்க, ஒரு பிராந்தியத்தை மறுப்பதற்கு முன் அதில் பயன்பாட்டில் உள்ள வளங்கள் இல்லை என்பதை உறுதிசெய்யவும்.

Control Tower Home Region இயல்பாகவே நிர்வகிக்கப்படுகிறது மற்றும் நிர்வாகத்திலிருந்து நீக்க முடியாது.

Control Tower region-deny SCPs Control Tower செயல்பட தேவையான விதிவிலக்குகளை உள்ளடக்கியது. 

## அணுகல் கட்டுப்பாட்டை எளிதாக்க AWS Identity Center-ஐ பயன்படுத்தவும்

IAM Users பயன்பாட்டைத் தவிர்ப்பதும், AWS வளங்களுக்கான மனித அணுகலை வழங்க [identity federation](https://docs.aws.amazon.com/IAM/latest/UserGuide/best-practices.html#bp-users-federation-idp)-ஐ தேவைப்படுத்துவதும் AWS சிறந்த நடைமுறையாகும். இது நீண்டகால AWS credentials பயன்படுத்த வேண்டிய அவசியமின்மையால் credential compromise அபாயத்தின் பெரும்பகுதியை குறைக்கிறது. மையப்படுத்தப்பட்ட அணுகல் மேலாண்மைக்கு, உங்கள் கணக்குகள் மற்றும் அந்த கணக்குகளுக்குள் அனுமதிகளை நிர்வகிக்க [AWS IAM Identity Center](https://docs.aws.amazon.com/singlesignon/latest/userguide/getting-started.html) பயன்படுத்த பரிந்துரைக்கிறோம். 

Identity Center ஒரே பிராந்தியத்தில் இயக்கப்பட்டு உலகளவில் பயனர்களுக்கு கிடைக்கும். உங்கள் Organization-க்கு Identity Center இயக்கப்படவில்லை என்றால், Control Tower உங்கள் Control Tower Home Region-ல் அதை இயக்கும். Identity Center ஏற்கனவே இயக்கப்பட்டிருந்தால், அது உங்கள் Control Tower home region-ல் இயக்கப்பட்டிருக்க வேண்டும் அல்லது [pre-flight checks](https://docs.aws.amazon.com/controltower/latest/userguide/getting-started-prereqs.html) தோல்வியடையும்.

AWS Identity Center Permission Sets-ஐ ஆதரிக்கிறது, இவை உங்கள் AWS Organization-ல் உள்ள கணக்குகளுக்கு ஒதுக்கப்படலாம் மற்றும் அந்த கணக்குகளில் IAM roles உருவாக்குவதற்கான டெம்ப்ளேட்டாக செயல்படும். நீங்கள் Control Tower-ஐ Identity Center நிர்வகிக்க அனுமதித்தால், அது சில [முன்கட்டமைக்கப்பட்ட groups மற்றும் permission sets](https://docs.aws.amazon.com/controltower/latest/userguide/sso-groups.html)-ஐ உருவாக்கி, பயனர் அணுகலுக்கான அடித்தளத்தை வழங்க கணக்குகளுக்கு ஒதுக்கும். 


### உங்கள் நிறுவன identity provider-ஐ ஒருங்கிணைக்கவும்

Identity Center பயனர்கள் மற்றும் குழுக்களை நிர்வகிக்கப் பயன்படுத்தலாம், ஆனால் உங்களிடம் ஏற்கனவே ஒரு நிறுவன identity provider இருந்தால், உங்கள் identities-க்கான ஒற்றை உண்மை ஆதாரத்தை பராமரிக்க அதை [Identity Center-உடன் இணைக்க](https://docs.aws.amazon.com/singlesignon/latest/userguide/tutorials.html) வேண்டும். 

நீங்கள் federated users பயன்படுத்துகிறீர்கள் மற்றும் Control Tower Identity Center-ல் அமைக்கும் இயல்புநிலை group மற்றும் permission set கட்டமைப்பைப் பயன்படுத்த விரும்பினால், உங்கள் upstream provider-ல் அதே பெயர்களில் groups-ஐ உருவாக்கி Identity Center-க்கு sync செய்யலாம். பின்னர் உங்கள் enrolled கணக்குகளுக்கான அணுகலை வழங்க identity provider-ல் இந்த groups-க்கு பயனர்களை ஒதுக்கலாம்.

### குறைந்தபட்ச சலுகை அணுகலை நோக்கி முன்னேறவும் 

Control Tower உருவாக்கும் இயல்புநிலை Permission Sets **AdministratorAccess** மற்றும் **DeveloperAccess** போன்ற பொதுவான பயன்பாட்டு வழக்குகளுக்காக வடிவமைக்கப்பட்டுள்ளன. உற்பத்தி பணிச்சுமைகளுக்கு, குறிப்பாக முக்கியமான தரவு அல்லது பாதுகாப்பு மற்றும் இணக்கம் முக்கிய கவலைகளாக இருக்கும் சூழ்நிலைகளில், சிறந்த நடைமுறை அனுமதிகளை குறைந்தபட்ச அவசியமான அணுகலுக்கு குறைக்க பரிந்துரைக்கிறது. [AWS IAM Access Analyzer](https://docs.aws.amazon.com/IAM/latest/UserGuide/what-is-access-analyzer.html) தேவையான அனுமதிகளை அடையாளம் காண, பயன்படுத்தப்படாத அனுமதிகளை நீக்க மற்றும் குறைந்தபட்ச சலுகை கொள்கைகளை எழுத உதவும்.


### Delegated Administrator கணக்கை இயக்கவும்

Control Tower Organization management கணக்கில் Identity Center-ஐ இயக்குகிறது. Management கணக்குக்கு யாரும் அணுகல் பெற வேண்டிய அவசியத்தை குறைப்பது சிறந்த நடைமுறையாகும், ஏனெனில் அது உங்கள் AWS Organization-ன் மீதியை கட்டுப்படுத்துகிறது மற்றும் உறுப்பினர் கணக்குகளை போல் preventative controls (SCP)-ஆல் அதே அளவில் கட்டுப்படுத்த முடியாது. இதனால் நீங்கள் [Identity Center-க்கான delegated administrator கணக்கை இயக்க](https://docs.aws.amazon.com/singlesignon/latest/userguide/delegated-admin.html) வேண்டும். 

Management கணக்குக்கு டிப்ளாய் செய்யப்பட்ட Permission sets delegated administrator கணக்கிலிருந்து நிர்வகிக்க முடியாது, management கணக்குக்கான பிரத்யேக permission sets (எடுத்துக்காட்டாக MA_Administrator) உருவாக்கி, மிகக் கட்டுப்படுத்தப்பட்ட பயனர்கள் மட்டுமே assume செய்ய முடியுமாறு பரிந்துரைக்கிறோம்.

### Control Tower நிர்வகிக்கும் roles-க்கு கூடுதல் கட்டுப்பாடுகளை பயன்படுத்தவும்

Control Tower உறுப்பினர் கணக்குகளில் AWS சேவைகளால் assume செய்யக்கூடிய [பல்வேறு roles](https://docs.aws.amazon.com/controltower/latest/userguide/roles-how.html)-ஐ உருவாக்குகிறது. 

[Cross-service confused deputy](https://docs.aws.amazon.com/IAM/latest/UserGuide/confused-deputy.html) சிக்கலுக்கு எதிராக பாதுகாக்க, உங்கள் AWS Organization-க்கு வெளியே உள்ள identities சேவைகளை ஏமாற்றி அவர்கள் சார்பாக roles assume செய்வதைத் தடுக்க [Resource Control Policy (RCP)](https://docs.aws.amazon.com/organizations/latest/userguide/orgs_manage_policies_rcps_examples.html) வரையறுக்கலாம். 

Control Tower roles-க்கு [அணுகலை மேலும் கட்டுப்படுத்த](https://docs.aws.amazon.com/controltower/latest/userguide/conditions-for-role-trust.html) Conditions-ஐயும் சேர்க்கலாம், ஆனால் இந்த roles-க்கான மாற்றங்கள் landing zone புதுப்பிப்புகளில் மேலெழுதப்படலாம் என்பதை நினைவில் கொள்ளுங்கள்.


## AWS Backup மூலம் உங்கள் தரவைப் பாதுகாக்கவும்

Control Tower [AWS Backup ஒருங்கிணைப்பு](https://docs.aws.amazon.com/controltower/latest/userguide/backup.html/) ஒவ்வொரு உறுப்பினர் கணக்கிலும் backup vault, பகிரப்பட்ட கணக்கில் மைய vault மற்றும் சில நிலையான backup கொள்கைகள் (hourly, weekly, daily, monthly) கொண்ட சிறந்த நடைமுறை backup தீர்வை அமைக்க உதவும். Backup OU மட்டத்தில் இயக்கலாம் மற்றும் தனிப்பட்ட வளங்களை தொடர்புடைய backup அட்டவணைக்கு இலக்காக tag செய்யலாம். 

உங்கள் விருப்பமான Control Tower தனிப்பயனாக்க முறையைப் பயன்படுத்தி ([AFC](https://docs.aws.amazon.com/controltower/latest/userguide/af-customization-page.html), [CfCT](https://docs.aws.amazon.com/controltower/latest/userguide/cfct-overview.html), [AFT](https://docs.aws.amazon.com/controltower/latest/userguide/aft-overview.html), [StackSets](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/what-is-cfnstacksets.html)) கணக்குகளுக்கு கூடுதல் backup plans டிப்ளாய் செய்யலாம். இவை [aws-controltower-BackupRole](https://docs.aws.amazon.com/controltower/latest/userguide/backup-resources.html) role-ஐ மீண்டும் பயன்படுத்தலாம் அல்லது தேவைக்கேற்ப புதிய roles உருவாக்கலாம். 

உங்களிடம் ஏற்கனவே backup தீர்வு இருந்தால், இந்த ஒருங்கிணைப்பிலிருந்து விலகலாம்.


## உங்கள் வணிகத் தேவைகளுக்கு ஏற்ப AWS Organization கட்டமைப்பை விரிவாக்கவும்

### AWS Organizations multi-account சிறந்த நடைமுறைகளைப் பின்பற்றவும்

பொதுவாக, Control Tower பயன்படுத்தும்போது [multi-account strategy](https://docs.aws.amazon.com/whitepapers/latest/organizing-your-aws-environment/organizing-your-aws-environment.html) மற்றும் Organizational Units (OUs) வடிவமைப்பு தொடர்பான AWS Organizations சிறந்த நடைமுறைகளைப் பின்பற்றவும். எளிமையாக வைக்கவும் - உங்கள் வேறுபட்ட நிர்வாகம், பாதுகாப்பு மற்றும் கொள்கை தேவைகளை ஆதரிக்க தேவையான OUs-உடன் தொடங்கவும் மற்றும் ஆழமான nesting-ஐ தவிர்க்கவும் - Control Tower அதிகபட்சமாக ஐந்து நிலை nesting-ஐ ஆதரிக்கிறது.  


### Control Tower Security OU-ஐ மாற்றவோ நீக்கவோ வேண்டாம்

Control Tower உங்கள் Organization-ல் பயன்படுத்தும் சில வரம்புகளில் ஒன்று என்னவென்றால், Security OU-க்கு கீழ் கூடுதல் கணக்குகள் அல்லது OUs உருவாக்க முடியாது மற்றும் Control Tower உருவாக்கிய கணக்குகளை (log archive, audit) உங்கள் Control Tower சூழலை உடைக்காமல் நகர்த்தவோ நீக்கவோ முடியாது.  


### Security OU மட்டுமே இருக்கும்படி அனைத்து OUs-ஐயும் நீக்க வேண்டாம்

Control Tower குறைந்தது இரண்டு OUs எதிர்பார்க்கிறது, அவற்றில் ஒன்று security OU ஆக இருக்க வேண்டும். Control Tower இயக்கும்போது உருவாக்கப்படும் Sandbox OU-ஐ நீக்கலாம், ஆனால் உங்கள் Organization-ல் குறைந்தது ஒரு வேறு OU இருந்தால் மட்டுமே. 



---
sidebar_position: 5
---
# AWS Control Tower

### AWS Control Tower எந்த சிக்கலை தீர்க்கிறது?

AWS Control Tower பல AWS கணக்குகள் மற்றும் குழுக்களைக் கொண்ட நிறுவனங்களுக்கு, நிறுவப்பட்ட கொள்கைகளுடன் இணக்கத்தை உறுதி செய்யும் அதே நேரத்தில் அவர்களின் [பல-கணக்கு AWS சூழலை](https://docs.aws.amazon.com/whitepapers/latest/organizing-your-aws-environment/organizing-your-aws-environment.html) அளவில் அமைக்கவும் நிர்வகிக்கவும் நேரடியான வழியை தேவைப்படுபவர்களுக்கு உதவுகிறது.


### AWS Control Tower ஐ பயன்படுத்துவதற்கு கூடுதல் செலவுகள் உள்ளனவா?

AWS Control Tower ஐ பயன்படுத்துவதற்கு கூடுதல் கட்டணங்கள் அல்லது முன்கூட்டிய உறுதிப்பாடுகள் இல்லை. AWS Control Tower ஆல் செயல்படுத்தப்பட்ட AWS சேவைகள் மற்றும் உங்கள் landing zone இல் நீங்கள் பயன்படுத்தும் சேவைகளுக்கு மட்டுமே நீங்கள் செலுத்துவீர்கள்.


### AWS Control Tower இல் controls (guardrails) என்ன?

[Controls](https://docs.aws.amazon.com/controltower/latest/controlreference/controls.html), முன்பு guardrails என குறிப்பிடப்பட்டவை, பாதுகாப்பு, செயல்பாடுகள் மற்றும் இணக்கத்திற்கான தெளிவாக வரையறுக்கப்பட்ட விதிகளாகும், அவை இணக்கமற்ற ஆதாரங்களின் டிப்ளாய்மென்ட்டை தடுக்கவும், டிப்ளாய் செய்யப்பட்ட ஆதாரங்களை இணக்கத்திற்காக தொடர்ந்து கண்காணிக்கவும் உதவுகின்றன.


### AWS Control Tower எந்த வகையான controls களை வழங்குகிறது?

AWS Control Tower மூன்று முக்கிய வகையான controls களை வழங்குகிறது:

1. [Preventive controls](https://docs.aws.amazon.com/controltower/latest/controlreference/preventive-controls.html): இவை செயல்கள் நிகழாமல் தடுக்கின்றன. AWS Organizations இல் Service Control Policies (SCPs) ஐ பயன்படுத்தி செயல்படுத்தப்படுகின்றன.
2. [Detective controls](https://docs.aws.amazon.com/controltower/latest/controlreference/detective-controls.html): இவை குறிப்பிட்ட நிகழ்வுகள் அல்லது ஆதாரங்களின் இணக்கமின்மையை நிகழ்ந்த பிறகு கண்டறிந்து டாஷ்போர்டு மூலம் எச்சரிக்கைகளை வழங்குகின்றன. AWS Config விதிகளை பயன்படுத்தி செயல்படுத்தப்படுகின்றன.
3. [Proactive controls](https://docs.aws.amazon.com/controltower/latest/controlreference/proactive-controls.html): இவை ஆதாரங்கள் உங்கள் கணக்குகளில் வழங்கப்படுவதற்கு முன்பே உங்கள் நிறுவனக் கொள்கைகள் மற்றும் நோக்கங்களுக்கு இணக்கமாக உள்ளனவா என சரிபார்க்கின்றன. AWS CloudFormation hooks ஐ பயன்படுத்தி செயல்படுத்தப்படுகின்றன.

AWS Control Tower இல் இந்த மூன்று வகையான controls களை இணைப்பதன் மூலம், உங்கள் பல-கணக்கு AWS சூழல் பாதுகாப்பானதாகவும் சிறந்த நடைமுறைகளின்படி நிர்வகிக்கப்படுவதாகவும் கண்காணிக்கலாம்.


### Control Tower எந்த AWS சேவைகளை ஒழுங்கமைக்கிறது?

AWS Control Tower பல-கணக்கு AWS சூழலை அமைக்கவும் நிர்வகிக்கவும் [பல AWS சேவைகளை](https://docs.aws.amazon.com/controltower/latest/userguide/integrated-services.html) ஒழுங்கமைக்கிறது. முதன்மை சேவைகளில் AWS Organizations, AWS Service Catalog, AWS IAM Identity Center, AWS CloudTrail மற்றும் AWS Config ஆகியவை அடங்கும்.


### AWS Control Tower உடன் எனது ஏற்கனவே உள்ள அடையாள வழங்குநரைப் பயன்படுத்த முடியுமா?

AWS Control Tower அடையாள வழங்குநர் ஒருங்கிணைப்புக்கான மூன்று விருப்பங்களை வழங்குகிறது: IAM Identity Center User Store, Active Directory மற்றும் வெளிப்புற Identity Provider (IdP). நீங்கள் AWS IAM Identity Center ஐ AWS Control Tower அமைக்க அனுமதிக்காமல் [சுய-நிர்வகிக்கும்](https://docs.aws.amazon.com/controltower/latest/userguide/select-idp.html) விருப்பமும் உள்ளது.


### எனது தரவு என்கிரிப்ட் செய்யப்பட்டுள்ளதா மற்றும் எனது சொந்த AWS Key Management Service key ஐ பயன்படுத்த முடியுமா?

AWS Control Tower உங்கள் landing zone க்கு இரண்டு முக்கிய என்கிரிப்ஷன் விருப்பங்களை வழங்குகிறது: இயல்புநிலை என்கிரிப்ஷன் (SSE-S3) மற்றும் AWS KMS என்கிரிப்ஷன்.


### AWS இல் கிடைக்கும் சில பிராந்தியங்களுக்கான அணுகலை கட்டுப்படுத்த AWS Control Tower ஐ பயன்படுத்த முடியுமா?

AWS Control Tower பதிவுசெய்யப்பட்ட கணக்குகளுக்கான குறிப்பிட்ட பிராந்தியங்களில் AWS சேவைகளுக்கான அணுகலை கட்டுப்படுத்த [Region deny](https://docs.aws.amazon.com/controltower/latest/userguide/region-how.html) திறன்களை வழங்குகிறது.


### ஏற்கனவே AWS Config ஆதாரங்களைக் கொண்ட ஏற்கனவே உள்ள AWS கணக்குகளை எவ்வாறு பதிவுசெய்வது

ஏற்கனவே AWS Config ஆதாரங்களைக் கொண்ட ஒரு ஏற்கனவே உள்ள கணக்கை AWS Control Tower க்கு இடம்பெயர்க்க, குறிப்பிட்ட [5-படி செயல்முறையை](https://docs.aws.amazon.com/controltower/latest/userguide/existing-config-resources.html) பின்பற்ற வேண்டும்.


### Drift என்ன மற்றும் Control Tower drift மற்றும் கட்டமைப்பை எவ்வாறு கையாள்வது

AWS Control Tower இல் Drift என்பது AWS Control Tower க்கு வெளியே கட்டமைப்பு மாற்றங்கள் செய்யப்படும்போது நிகழ்கிறது, இதனால் ஆதாரங்கள் ஆளுகை தேவைகளுக்கு இணக்கமற்றதாக மாறுகின்றன. AWS Control Tower கண்டறியப்பட்ட drift வகையைப் பொறுத்து பல்வேறு [நிவாரண விருப்பங்களை](https://docs.aws.amazon.com/controltower/latest/userguide/resolving-drift.html) வழங்குகிறது.


### AWS Control Tower கணக்கு தனிப்பயனாக்க விருப்பங்கள் என்ன?

AWS Control Tower கணக்குகளை தனிப்பயனாக்க பல விருப்பங்களை வழங்குகிறது: [Account Factory Customization](https://docs.aws.amazon.com/controltower/latest/userguide/af-customization-page.html) (AFC), [Customizations for AWS Control Tower](https://docs.aws.amazon.com/controltower/latest/userguide/cfct-overview.html) (CfCT), மற்றும் [AWS Control Tower Account Factory for Terraform](https://docs.aws.amazon.com/controltower/latest/userguide/taf-account-provisioning.html) (AFT).


### CfCT க்கான கட்டமைப்பு மூலமாக GitHub ஐ பயன்படுத்த முடியுமா?

ஆம், GitHub ஐ Customizations for AWS Control Tower (CfCT) க்கான கட்டமைப்பு மூலமாகப் பயன்படுத்தலாம்.


### AFT repository ஆக GitHub ஐ பயன்படுத்த முடியுமா?

ஆம், AWS Control Tower Account Factory for Terraform (AFT) ஐ AWS CodeCommit இலிருந்து மற்றொரு VCS வழங்குநருக்கு நகர்த்தலாம்.

### AFT உடன் OpenTofu ஐ பயன்படுத்த முடியுமா?

OpenTofu என்பது Terraform இலிருந்து fork செய்யப்பட்ட பிரபலமான ஓப்பன் சோர்ஸ் infrastructure as code (IaC) கருவியாகும். OpenTofu ஒரு module - sourcefuse/arc-control-tower-aft ஐ கொண்டுள்ளது, இது சில மாற்றங்களுடன் AFT செயல்பாடுகளை ஆதரிக்கலாம், இருப்பினும் இது AWS ஆல் ஆதரிக்கப்படவில்லை.

### எனது CfCT க்கு VCS ஆக Gitlab ஐ பயன்படுத்த முடியுமா?

இல்லை, CfCT க்கான Gitlab ஆதரவு இன்னும் கிடைக்கவில்லை. v2.8.1 இலிருந்து Github ஐ VCS ஆக பயன்படுத்தலாம்.

### நான் ஏற்கனவே Landing Zone Accelerator (LZA) ஐ டிப்ளாய் செய்துள்ளேன், இன்னும் AWS Control Tower ஐ பயன்படுத்த முடியுமா?

AWS Control Tower மற்றும் Landing Zone Accelerator (LZA) நிரப்பு தீர்வுகளாக நன்றாக இணைந்து செயல்படுகின்றன. பரிந்துரைக்கப்பட்ட சிறந்த நடைமுறை என்னவென்றால் முதலில் AWS Control Tower ஐ உங்கள் அடிப்படை landing zone ஆக டிப்ளாய் செய்வது, பின்னர் தேவைக்கேற்ப LZA உடன் அதன் திறன்களை மேம்படுத்துவது.


### AWS Control Tower அமைப்புடன் தொடர்புகொள்ள API ஐ பயன்படுத்த முடியுமா?

AWS Control Tower பல்வேறு பணிகளை தானியங்கு செய்ய [பல API-களை](https://docs.aws.amazon.com/controltower/latest/APIReference/Welcome.html) வழங்குகிறது: Control APIs, Landing Zone APIs மற்றும் Baseline APIs.


### Control Tower ஆல் உருவாக்கப்பட்ட கணக்கின் மின்னஞ்சல் முகவரியை எவ்வாறு மாற்றுவது?

AWS Control Tower இல் பதிவுசெய்யப்பட்ட உறுப்பினர் கணக்கின் மின்னஞ்சல் முகவரியை மாற்ற, root user password ஐ மீட்டெடுத்து, மின்னஞ்சல் முகவரியை மாற்றி, Service Catalog இல் provisioned product ஐ புதுப்பிக்க வேண்டும்.


### நெட்வொர்க்கிங் இணைப்பு கருத்தாய்வுகள்

AWS Control Tower இயல்பாக ஒரு நிறுவன அலகுக்குள் (OU) உருவாக்கப்பட்ட ஒவ்வொரு கணக்கிற்கும் ஒவ்வொரு VPC க்கும் ஒரே CIDR வரம்பை (172.31.0.0/16) ஒதுக்குகிறது. VPC peering ஐ ஆதரிக்க, Account Factory அமைப்புகளில் CIDR வரம்பை மாற்ற வேண்டும்.


### ஏற்கனவே உள்ள பாதுகாப்பு மற்றும் லாக்கிங் கணக்குகளை Control Tower க்கான audit மற்றும் logging கணக்காக பயன்படுத்த முடியுமா?

ஆம், AWS Control Tower ஆரம்ப landing zone அமைப்பின் போது ஏற்கனவே உள்ள AWS கணக்குகளை உங்கள் audit (பாதுகாப்பு) மற்றும் log archive (லாக்கிங்) கணக்குகளாக குறிப்பிடும் விருப்பத்தை வழங்குகிறது.


### ஏற்கனவே உள்ள வெளிப்புற IDP உள்ளது, Control Tower ஐ செயல்படுத்தினால் ஏற்கனவே உள்ள அமைப்புகளுக்கு AWS Control Tower என்ன மாற்றங்களைச் செய்யும்?

ஏற்கனவே உள்ள அடையாள வழங்குநருடன் AWS Control Tower ஐ அமைக்கும்போது, நீங்கள் தேர்ந்தெடுக்கும் அடையாள மூலத்தின் அடிப்படையில் வெவ்வேறு தாக்கங்கள் உள்ளன.


### AWS Control Tower nested OU ஐ ஆதரிக்கிறதா?

ஆம், AWS Control Tower nested organizational units (OUs) ஐ ஆதரிக்கிறது. AWS Control Tower இல் nested OU படிநிலை அதிகபட்சம் ஐந்து நிலைகள் ஆழமாக இருக்கலாம்.


### AWS GovCloud இல் AWS Control Tower ஆதரிக்கப்படுகிறதா?

ஆம், AWS Control Tower [GovCloud இல் ஆதரிக்கப்படுகிறது](https://docs.aws.amazon.com/govcloud-us/latest/UserGuide/govcloud-controltower.html). இருப்பினும், கடுமையான இணக்கம் மற்றும் செயல்பாட்டு தேவைகள் காரணமாக வணிக பிராந்தியங்களிலிருந்து வேறுபடுகிறது.


### AWS Control Tower resource control policies (RCPs) ஐ பயன்படுத்துகிறதா?

AWS Control Tower இப்போது resource control policies (RCPs) உடன் செயல்படுத்தப்படும் preventive controls ஐ ஆதரிக்கிறது.


### செயல்படுத்துவதற்கு முன்பு OU-களில் கொள்கைகளை எவ்வாறு சோதிப்பது

Policy Staging OU, AWS கொள்கைகள், controls மற்றும் சேவைகளை உற்பத்திக்கு டிப்ளாய் செய்வதற்கு முன்பு சோதிப்பதற்கும் சரிபார்ப்பதற்கும் கட்டுப்படுத்தப்பட்ட சூழலாக செயல்படுகிறது.

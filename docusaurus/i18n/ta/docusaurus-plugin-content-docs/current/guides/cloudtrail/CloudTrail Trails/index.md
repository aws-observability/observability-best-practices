---
sidebar_position: 2
---
# CloudTrail Trails

AWS CloudTrail உங்கள் AWS உள்கட்டமைப்பு முழுவதும் கணக்கு செயல்பாட்டை கண்காணிக்கிறது மற்றும் பதிவு செய்கிறது, சேமிப்பு, பகுப்பாய்வு மற்றும் நிவாரண நடவடிக்கைகள் மீது கட்டுப்பாட்டை வழங்குகிறது. ஒரு trail என்பது நீங்கள் குறிப்பிடும் Amazon Simple Storage Service (Amazon S3) bucket க்கு CloudTrail events ஐ வழங்க உதவும் ஒரு கட்டமைப்பாகும்.

CloudTrail உங்கள் AWS உள்கட்டமைப்பில் கணக்கு செயல்பாட்டை கண்காணிக்கவும் பதிவு செய்யவும் மூன்று வகையான trails ஐ வழங்குகிறது. முதல் வகை அனைத்து AWS Regions களிலிருந்தும் செயல்பாட்டை படம்பிடிக்கும் multi-Regional trail ஆகும். AWS Management Console மூலம் trail ஐ உருவாக்கும் போது, இது இயல்பாகவே அனைத்து Regions களுக்கும் பொருந்தும். இரண்டாவது வகை ஒரு குறிப்பிட்ட Region இல் செயல்பாட்டை படம்பிடிக்கும் single-Region trail ஆகும், இது AWS CLI இல் மட்டுமே கிடைக்கும். எனினும், பரந்த கவரேஜுக்கு multi-Region trails ஐ பயன்படுத்துவதை நாங்கள் பரிந்துரைக்கிறோம்.

கடைசியாக, AWS Organizations சேவையை பயன்படுத்தும் போது உங்கள் நிறுவனத்தின் அனைத்து AWS கணக்குகளுக்கும் பொருந்தும் organizational trail உள்ளது. இந்த வகை trail பல-கணக்கு சூழலில் விரிவான கவரேஜ் மற்றும் மையப்படுத்தப்பட்ட கண்காணிப்பை வழங்குகிறது.

CloudTrail Trails க்கான சில சிறந்த நடைமுறைகள் கீழே கொடுக்கப்பட்டுள்ளன.

### அனைத்து AWS கணக்குகள் மற்றும் Regions களில் CloudTrail ஐ கட்டமைக்கவும்

AWS கணக்குகளில் ஒரு பயனர், பங்கு அல்லது சேவையால் எடுக்கப்பட்ட நிகழ்வுகளின் முழுமையான பதிவைப் பெற, ஒவ்வொரு trail ஐயும் அனைத்து AWS Regions களிலும் நிகழ்வுகளை பதிவு செய்ய கட்டமைக்கவும். இந்த trails ஐ உங்கள் நிறுவனம் பயன்படுத்தும் ஒவ்வொரு AWS கணக்கிலும் அமைக்கவும். அனைத்து Regions களுக்கும் பொருந்தும் trail ஐ உருவாக்கினால், எந்த புதிய AWS Region உம் தானாகவே சேர்க்கப்படும். AWS Organizations மூலம் பல-கணக்கு அமைப்பு இருந்தால், அந்த நிறுவனத்தின் அனைத்து AWS கணக்குகளுக்கான அனைத்து நிகழ்வுகளையும் பதிவு செய்யும் trail ஐ உருவாக்கலாம்.

### வெவ்வேறு பயன்பாட்டு நிலைகளுக்கு தனி trails ஐ அமைக்கவும்

CloudTrail auditing, security monitoring மற்றும் operational troubleshooting போன்ற பயன்பாட்டு நிலைகளை ஆதரிக்கிறது. ஒவ்வொரு பயன்பாட்டு நிலைக்கும் தனி trails ஐ அமைக்க AWS பரிந்துரைக்கிறது, இதனால் ஒவ்வொரு குழுவிற்கும் தேவையான அறிவை வழங்கலாம்.

### தனி பாதுகாப்பு எல்லையில் உள்ள S3 bucket க்கு CloudTrail logs ஐ வழங்க கட்டமைக்கவும்

audit நோக்கங்களுக்காக, தனி நிர்வாக domain இல் உள்ள dedicated S3 bucket இல் log files ஐ சேமிக்கும் போது, கடுமையான பாதுகாப்புக் கட்டுப்பாடுகள் மற்றும் கடமைகளின் பிரிவை செயல்படுத்தலாம்.

### S3 Bucket இல் MFA-delete மற்றும் versioning ஐ இயக்கவும்

Multi-factor authentication (MFA) இந்த S3 bucket இல் கட்டமைக்கப்பட்டிருக்கும் போது, bucket அல்லது bucket இல் உள்ள object ஐ நிரந்தரமாக நீக்க கூடுதல் அங்கீகாரம் தேவை என்பதை உறுதி செய்யலாம்.

### CloudTrail log file integrity validation ஐ இயக்கவும்

CloudTrail log file integrity validation ஒரு log file நீக்கப்பட்டதா அல்லது மாற்றப்பட்டதா என்பதை தெரிவிக்கிறது. இந்த insights பாதுகாப்பு மற்றும் forensic விசாரணைகளில் மதிப்புமிக்கவை.

### CloudTrail log files ஐ ஓய்வு நிலையில் என்க்ரிப்ட் செய்யவும்

இயல்பாக, CloudTrail உங்கள் bucket க்கு வழங்கும் log files Amazon server-side encryption with Amazon S3-managed encryption keys (SSE-S3) மூலம் என்க்ரிப்ட் செய்யப்படுகின்றன. நேரடியாக நிர்வகிக்கக்கூடிய பாதுகாப்பு அடுக்கை வழங்க, AWS KMS-managed keys (SSE-KMS) ஐ பயன்படுத்தலாம்.

### Trails க்கு data events ஐ இயக்கவும்

Data events S3 மற்றும் AWS Lambda இல் செய்யப்படும் resource operations பற்றிய தெரிவுநிலையை வழங்குகின்றன. Data events அடிக்கடி அதிக-அளவு செயல்பாடுகளாக இருக்கும்.

### Data events உடன் advanced event selectors ஐ பயன்படுத்தவும்

Advanced event selectors data event logging இன் மிகவும் நுணுக்கமான கட்டுப்பாட்டை வழங்குகின்றன. EventSource, EventName மற்றும் ResourceARN போன்ற fields இல் மதிப்புகளை சேர்க்கவோ அல்லது விலக்கவோ முடியும்.

### CloudTrail ஐ Amazon CloudWatch Logs உடன் ஒருங்கிணைக்கவும்

Amazon CloudWatch Logs உடன் CloudTrail ஐ ஒருங்கிணைக்கும் போது, CloudTrail ஆல் படம்பிடிக்கப்பட்ட குறிப்பிட்ட நிகழ்வுகளுக்கு நிகழ்நேரத்திற்கு அருகில் கண்காணிக்கவும் alerts ஐ பெறவும் முடியும்.

### அனைத்து Regions களுக்கும் Trails ஐ பொருந்தச் செய்யவும்

ஒரு IAM identity அல்லது சேவையால் செய்யப்பட்ட அனைத்து செயல்பாடுகளையும் படம்பிடிக்க, ஒவ்வொரு trail ஐயும் அனைத்து Regions களிலும் நிகழ்வுகளை பதிவு செய்ய கட்டமைக்கவும்.

### CloudTrail logs ஐ மைய S3 bucket க்கு வழங்கவும்

CloudTrail logs ஐ வரையறுக்கப்பட்ட அணுகலுடன் தனி AWS கணக்கில் உள்ள மைய S3 bucket க்கு வழங்க கட்டமைக்கவும்.

### Log files சேமிக்கும் S3 bucket இல் data protection ஐ கட்டமைக்கவும்

பின்வரும் நடவடிக்கைகளை செய்யவும்:
* S3 bucket க்கு கூடுதல் பாதுகாப்பு அளவை சேர்க்க multi-factor authentication (MFA) ஐ இயக்கவும்.
* தேவையற்ற நீக்குதல்கள் அல்லது மாற்றங்களிலிருந்து objects ஐ மீட்க S3 bucket இல் versioning ஐ இயக்கவும்.
* CloudTrail log files க்கு encryption ஐ இயக்கவும்.
* Log files delivery க்குப் பிறகு மாறவில்லை என்பதை உறுதி செய்ய log file validation ஐ கட்டமைக்கவும்.

### S3 bucket இல் object lifecycle management ஐ கட்டமைக்கவும்

CloudTrail இயல்பாக log files ஐ கட்டமைக்கப்பட்ட S3 bucket இல் காலவரையின்றி சேமிக்கும். Amazon S3 object lifecycle management rules ஐ பயன்படுத்தி உங்கள் சொந்த retention policy ஐ வரையறுக்கலாம்.

### AWSCloudTrail_FullAccess policy க்கான அணுகலை கட்டுப்படுத்தவும்

இந்த policy க்கான அணுகலை கட்டுப்படுத்த சில காரணங்கள்:
* இந்த policy உள்ள பயனர்கள் தங்கள் AWS கணக்குகளில் முக்கியமான auditing functions ஐ முடக்கலாம் அல்லது மறுகட்டமைக்கலாம்.
* இந்த policy உங்கள் AWS கணக்கில் IAM identities க்கு பரவலாக பகிரப்படவோ பொருந்தவோ கூடாது.

---
sidebar_position: 1
---
# AWS Config-ஐ இயக்குதல்

### **அனைத்து கணக்குகளிலும் அனைத்து regions-லும் AWS Config-ஐ இயக்கவும்**

பல AWS கணக்குகளை இயக்கும் வாடிக்கையாளர்களுக்கு, உங்கள் முழு நிறுவனத்திலும் AWS Config-ஐ செயல்படுத்த பரிந்துரைக்கிறோம். AWS Config ஒரு region-specific service ஆகும், resource configuration மாற்றங்கள் மற்றும் compliance evaluations-ஐ கண்காணிக்க விரும்பும் ஒவ்வொரு region-லும் இதை இயக்க வேண்டும். மூன்று வழிகளில் இதைச் செய்யலாம்:

1. CloudFormation StackSets பயன்படுத்துதல்:
    [CloudFormation StackSets](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/what-is-cfnstacksets.html) பல regions மற்றும் accounts-ல் ஒரே நேரத்தில் AWS Config-ஐ இயக்க முன்-கட்டப்பட்ட templates-ஐ வழங்குகிறது.
2. AWS Systems Manager Quick Setup பயன்படுத்துதல்:
    [AWS Systems Manager Quick Setup](https://docs.aws.amazon.com/systems-manager/latest/userguide/systems-manager-quick-setup.html) உங்கள் முழு நிறுவனத்திலும் Config recorder-ஐ இயக்க streamlined வழியை வழங்குகிறது.
3. AWS Control Tower:
    [AWS Control Tower](https://aws.amazon.com/controltower/) ஒரு central location-லிருந்து பல AWS accounts-ஐ பாதுகாப்பாக அமைக்கவும் நிர்வகிக்கவும் உதவுகிறது.

### AWS Config recorder settings

AWS Config recorder settings-ஐ கட்டமைக்கும்போது, [அனைத்து resource types](https://docs.aws.amazon.com/config/latest/developerguide/select-resources.html)-க்கும் tracking-ஐ இயக்குவது ஒரு முக்கிய சிறந்த நடைமுறையாகும்.

[Global resources](https://docs.aws.amazon.com/config/latest/developerguide/select-resources.html#select-resources-global) தொடர்பாக, [IAM](https://aws.amazon.com/iam/) போன்றவை, ஒரு region-ல் மட்டும் recording-ஐ இயக்குவது முக்கியம். இது duplicate configuration items-ஐ தடுக்கவும் தேவையற்ற செலவுகளைத் தவிர்க்கவும் உதவுகிறது.

### Delivery Method சிறந்த நடைமுறைகள்

AWS configuration management-ஐ செயல்படுத்தும்போது, configuration items-க்கான சரியான delivery methods-ஐ நிறுவுவது முக்கியமானது. Central account-ல் centralized [Amazon S3 bucket](https://aws.amazon.com/pm/serv-s3/)-ஐ designate செய்வது பரிந்துரைக்கப்படும் சிறந்த நடைமுறையாகும்.

### AWS Config-க்கான Delegated Admin

AWS Config-க்கான delegated administrator என்பது AWS organization-க்குள் configuration settings-ஐ நிர்வகிக்கும் அனுமதிகளைப் பெறும் designated member account ஆகும். Delegated admin-ஐ [AWS Config operations மற்றும் aggregation-க்கு பயன்படுத்த இந்த blog-ஐ பின்பற்றவும்](https://aws.amazon.com/blogs/mt/using-delegated-admin-for-aws-config-operations-and-aggregation/).

---
sidebar_position: 3
---
# இணக்கத்தன்மை மதிப்பீடு

AWS Config உங்கள் AWS சூழலில் resource configurations-ஐ மதிப்பிடுவதற்கு இரண்டு முதன்மை வகையான rules-ஐ வழங்குகிறது. முதல் வகை, [Managed Rules](https://docs.aws.amazon.com/config/latest/developerguide/managed-rules-by-aws-config.html), AWS வழங்கும் முன்-கட்டப்பட்ட rules ஆகும், பல்வேறு பாதுகாப்பு, செயல்பாட்டு மற்றும் இணக்கத்தன்மை use cases-ஐ கவர் செய்கின்றன. இரண்டாவது வகை [Custom Rules](https://docs.aws.amazon.com/config/latest/developerguide/evaluate-config_develop-rules.html), நிறுவனங்கள் தங்கள் சொந்த rules-ஐ உருவாக்க அனுமதிக்கிறது.

Custom rules AWS Lambda functions மூலம் உருவாக்கலாம். AWS Config [Guard Custom policy-ஐ பயன்படுத்தி custom rules உருவாக்குவதையும்](https://aws.amazon.com/blogs/mt/announcing-aws-config-custom-rules-using-guard-custom-policy/) அனுமதிக்கிறது.

AWS Config remediation actions-க்கு [Systems Manager Automation documents](https://aws.amazon.com/blogs/mt/remediate-noncompliant-aws-config-rules-with-aws-systems-manager-automation-runbooks/)-உடன் native-ஆக ஒருங்கிணைக்கப்பட்டுள்ளது.

### Conformance Packs:

Managed rules அல்லது custom rules-ஐ தனிப்பட்ட regions மற்றும் accounts-க்கு deploy செய்வதற்கு பதிலாக, அவற்றை [Conformance Packs](https://docs.aws.amazon.com/config/latest/developerguide/conformance-packs.html)-ஆக bundle செய்வது சிறந்த நடைமுறையாகும்.

#### Organizational Deployment:

உங்கள் AWS Organization முழுவதும் automatic deployment-க்கு organizational conformance packs-ஐ பயன்படுத்த AWS உதவுகிறது.

### AWS Config Rules Development Kit (RDK)

AWS Config [Rules Development Kit](https://github.com/awslabs/aws-config-rdk) (RDK) custom Config rules-ன் உருவாக்கத்தை எளிதாக்குகிறது.

### Global Resource Management

Global resources-ஐ (IAM rules போன்றவை) மதிப்பிடும் rules-ஐ duplicate costs மற்றும் redundant API calls-ஐ தவிர்க்க ஒரு region-ல் மட்டும் deploy செய்யவும்.

## Cross-Account Aggregation மற்றும் Querying

நிறுவனங்கள் பல regions மற்றும் accounts-ல் AWS Config-ஐ இயக்கும்போது, விரிவான தெரிவுநிலை மற்றும் மேலாண்மைக்கு தரவை centralize செய்வது முக்கியமாகிறது. [AWS Config Aggregators](https://docs.aws.amazon.com/config/latest/developerguide/aggregate-data.html) பல்வேறு regions மற்றும் accounts-லிருந்து configuration-தொடர்பான தரவை ஒரே designated aggregator account-ல் consolidate செய்யும் இலவச அம்சத்தை வழங்குகின்றன.

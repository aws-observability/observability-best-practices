---
sidebar_position: 2
---
# உங்கள் landing zone-ஐ இயக்குதல்

## சோதனை landing zone உருவாக்குவதைக் கருத்தில் கொள்ளவும்

Controls-ஐ production OUs-க்கு பயன்படுத்துவதற்கு முன் non-production OUs-ல் சோதிக்கலாம் (மற்றும் சோதிக்க வேண்டும்), ஆனால் இரண்டாவது சோதனை Organization பயனுள்ளதாக இருக்கும் சில சூழ்நிலைகளும் உள்ளன. Landing zone புதுப்பிப்புகளை சோதிக்க, landing zone management automations-ஐ மாற்ற அல்லது account customization processes-ஐ மாற்ற வேண்டுமானால், production பணிச்சுமைகளில் தற்செயலான தாக்கத்தைத் தவிர்க்க முற்றிலும் தனி Organization இருப்பது பயனுள்ளதாக இருக்கும்.

## உங்கள் Landing Zone-ஐ புதுப்பிக்கவும்

Landing zone புதுப்பிப்புகள் பாதுகாப்பு மேம்பாடுகள், செலவு மேம்படுத்தல்கள் மற்றும் அம்ச மேம்பாடுகளை உள்ளடக்கலாம். புதிய landing zone பதிப்பு கிடைக்கும்போது, கூடிய விரைவில் [புதுப்பிக்க](https://docs.aws.amazon.com/controltower/latest/userguide/update-controltower.html) வேண்டும். AWS Console-லிருந்து இதைச் செய்யலாம். இந்த செயல்முறை பகிரப்பட்ட (log archive, audit, backup) கணக்குகள் உள்ளிட்ட landing zone கூறுகளைப் புதுப்பிக்கும். 

நீங்கள் 2.x-லிருந்து 3.x-க்கு புதுப்பிக்கிறீர்கள் என்றால், account level-லிருந்து Organization level CloudTrail trails-க்கான மாற்றத்தைச் சுற்றி [கூடுதல் எச்சரிக்கைகள்](https://docs.aws.amazon.com/controltower/latest/userguide/lz-update-best-practices.html) உள்ளன. 

## Control Tower மூலம் கணக்குகளை உருவாக்கவும் 

Control Tower-ன் Account Factory மூலம் புதிய கணக்குகளை உருவாக்கி, உருவாக்கத்தின் போதே அவை enrolled மற்றும் managed ஆக இருக்கும். Control Tower இயக்கப்பட்டிருக்கும்போது AWS Organizations மூலம் கணக்குகளை உருவாக்க முடியும் என்றாலும், அவை Control Tower-ல் enrolled ஆக இருக்காது, அவை Control Tower managed OU-க்கு கீழ் இருந்தாலும். Control Tower மூலம் உருவாக்கப்படாத கணக்குகள் உங்கள் Organization-ல் இருந்தால், Control Tower controls மற்றும் baselines பயன்படுத்த அவற்றை enroll செய்யலாம்.

### Control Tower managed Identity Center-உடன் federated identities பயன்படுத்தும்போது, கணக்கு உருவாக்கத்தின் போது பொதுவான SSO பயனரைப் பயன்படுத்தவும்

Identity Center Control Tower-ஆல் நிர்வகிக்கப்பட்டால், Account Factory-க்கு Identity Center பயனர் parameter தேவை. இந்த பயனருக்கு உருவாக்கப்பட்ட கணக்கில் admin அணுகல் வழங்கப்படும், ஆனால் identity federation இயக்கப்பட்டிருக்கும்போது பயன்படுத்த முடியாது. Federated identities பயன்படுத்தும்போது இந்த பயனர் பயன்படுத்த முடியாது, ஆனால் தேவையான parameter ஆகும். பல கணக்குகளுக்கு ஒரே பயனரைப் பயன்படுத்தலாம். Identity federation பின்னர் முடக்கப்பட்டால், கடவுச்சொல்லை இயக்கி கணக்குகளை அணுகுவதற்கு பயனருடன் தொடர்புடைய email முகவரிக்கான அணுகல் தேவைப்படும்.

## உங்கள் கணக்குகளைப் புதுப்பிக்கவும்

Landing zone புதுப்பிப்பு முடிந்தவுடன், உங்கள் கணக்குகளைப் புதுப்பிக்க வேண்டும். தனிப்பட்ட கணக்குகளுக்கு console-ல் இதைச் செய்யலாம் அல்லது முழு OUs-ஐ மீண்டும் பதிவு செய்யலாம் (1000-க்கும் குறைவான கணக்குகள் இருந்தால்). இந்த செயல்முறையை [தானியங்காக்கவும்](https://docs.aws.amazon.com/controltower/latest/userguide/update-accounts-by-script.html) முடியும்.

Non-prod பணிச்சுமைகளை prod பணிச்சுமைகளிலிருந்து வேறு OU-ல் வைப்பது சிறந்த நடைமுறையாகும், இது முதலில் non-prod OUs-ஐ மீண்டும் பதிவு செய்வதன் மூலம் புதுப்பிப்புகளின் தாக்கத்தை சோதிக்க அனுமதிக்கிறது.


## Drift-ஐ நிர்வகிக்கவும்

உங்கள் AWS Control Tower landing zone கூறுகள், கணக்குகள் அல்லது organizational units (OUs) வரையறுக்கப்பட்ட baselines மற்றும் controls-உடன் sync-லிருந்து விலகும்போது Drift ஏற்படுகிறது. உங்கள் AWS சூழலில் நிர்வாகம் மற்றும் இணக்கத்தை பராமரிக்க drift-ஐ புரிந்துகொள்வதும் நிர்வகிப்பதும் முக்கியமானது. 

### Drift ஏற்படாமல் இருக்க Control Tower மூலம் கணக்குகள் மற்றும் OUs-க்கு மாற்றங்கள் செய்யவும்

Control Tower-க்கு வெளியே (பொதுவாக AWS Organizations console-ல் நேரடியாக மாற்றங்கள் செய்யும்போது) கணக்குகள், OUs அல்லது Control Tower managed Organization policies (SCPs, RCPs)-க்கு மாற்றங்கள் செய்தால் drift ஏற்படலாம். 

### உங்கள் landing zone-ஐ தொடர்ந்து drift-க்கு மதிப்பாய்வு செய்யவும்

Control Tower தானாகவே drift-ஐ கண்டறியும். உங்கள் landing zone-ஐ தொடர்ந்து drift-க்கு மதிப்பாய்வு செய்து தேவைக்கேற்ப சரிசெய்யவும். Console-ல் Organization page-க்கு சென்று, நீங்கள் ஆய்வு செய்ய விரும்பும் OUs அல்லது கணக்குகளைத் தேர்ந்தெடுப்பதன் மூலம் OU மற்றும் account drift நிலையைக் காணலாம். Drift audit கணக்கில் ஒருங்கிணைக்கப்படும் [SNS notifications](https://docs.aws.amazon.com/controltower/latest/userguide/sns-guidance.html)-லும் காட்டப்படுகிறது. அனைத்து drift notifications-ஐயும் பெற aws-controltower-AggregateSecurityNotifications topic-க்கு subscribe செய்யலாம். இந்த topic config non-compliance மற்றும் பிற notifications-ஐயும் பெறுவதால் noisy ஆக இருக்கலாம், எனவே ஆர்வமுள்ள notifications-ஐ செயல்படுத்த Lambda-ஐ subscribe செய்யலாம். 


### இணக்கத்தை உறுதிசெய்ய drift-ஐ சரிசெய்யவும்

உங்கள் landing zone drift ஆக இருந்தால், நீங்கள் இயக்கிய controls-உடன் உங்கள் வளங்கள் இணக்கமாக உள்ளதா என்பதை துல்லியமாக தீர்மானிக்க முடியாது. உங்கள் நிர்வாகத் தேவைகள் பூர்த்தி செய்யப்படுவதை உறுதிசெய்ய drift-ஐ கண்டறிந்ததும் சரிசெய்யவும். சில [சரிசெய்யக்கூடிய drift](https://docs.aws.amazon.com/controltower/latest/userguide/drift.html#repairable-changes-to-resources) எடுத்துக்காட்டுகளுக்கு ஆவணத்தைப் பார்க்கவும்.

* கணக்குகள் அல்லது OUs drift ஆக இருந்தால், console-ல் கணக்கைப் புதுப்பிப்பதன் மூலம் அல்லது OU-ஐ மீண்டும் பதிவு செய்வதன் மூலம் இதை தீர்க்கலாம். 
* Controls-க்கு, ResetEnabledControl API-ஐ அழைப்பதன் மூலம் பல வகையான drift-ஐ தீர்க்கலாம்.
* Landing Zone-ன் Reset மூலம் பல வகையான drift-ஐ தானாகவே தீர்க்கலாம். Landing zone settings-ல் Versions பிரிவில் Reset பொத்தானை அழுத்துவதன் மூலம் இதைச் செய்யலாம்.


## தேவையான Control Tower OUs அல்லது கணக்குகளை நீக்க வேண்டாம்

Landing zone விரிவாக்கம் பற்றிய முந்தைய பிரிவில் குறிப்பிட்டபடி, Security OU அல்லது Control Tower managed கணக்குகளை நீக்குதல் அல்லது நகர்த்துதல் அல்லது Security OU மட்டுமே இருக்கும்படி அனைத்து OUs-ஐயும் நீக்குதல் landing zone drift-ஐ ஏற்படுத்தும். இந்த நிலையில், நீங்கள் landing zone-ஐ reset செய்யும் வரை Control Tower செயல்படாது.

## தேவையான roles-ஐ நீக்க வேண்டாம்

[Control Tower தேவையான roles](https://docs.aws.amazon.com/controltower/latest/userguide/roles-how.html) காணாமல் போனால் அல்லது அணுக முடியாவிட்டால், உங்கள் landing zone-ஐ reset செய்ய அறிவுறுத்தும் error page தெரியும். 

## உங்கள் நிர்வாகத் தேவைகளை செயல்படுத்த controls-ஐ இயக்கவும்

[Controls பயன்படுத்துவதற்கான சிறந்த நடைமுறைகளைப்](https://aws.amazon.com/blogs/mt/best-practices-for-applying-controls-with-aws-control-tower/) பின்பற்றவும்

AWS Controls Catalog-ல் உங்கள் தேவைகளுக்கு ஏற்ற Control Tower controls-ஐ அடையாளம் காணவும். Implementation, behaviour, owner, service மற்றும் framework உள்ளிட்ட metadata அடிப்படையில் Controls-ஐ தேடலாம்:

* Control Tower Console
* [Control Tower Catalog ஆவணம்](https://docs.aws.amazon.com/controltower/latest/controlreference/controls-reference.html)
* [Amazon Q](https://docs.aws.amazon.com/controltower/latest/controlreference/q-search.html)


தேவைப்பட்டால் அடிப்படை சேவைகளைப் பயன்படுத்தி custom controls வரையறுக்கலாம், ஆனால் இவை Control Tower dashboards அல்லது compliance metrics-ல் சேர்க்கப்படாது:

* Preventative Controls-க்கு AWS Organization [SCPs](https://docs.aws.amazon.com/organizations/latest/userguide/orgs_manage_policies_scps.html) மற்றும் [RCPs](https://docs.aws.amazon.com/organizations/latest/userguide/orgs_manage_policies_rcps.html)
* Detective Controls-க்கு AWS [Config Rules](https://docs.aws.amazon.com/config/latest/developerguide/evaluate-config_develop-rules.html)
* Proactive Controls-க்கு AWS [CloudFormation hooks](https://docs.aws.amazon.com/cloudformation-cli/latest/hooks-userguide/what-is-cloudformation-hooks.html)
* AWS [Security Hub CSPM Controls](https://docs.aws.amazon.com/securityhub/latest/userguide/securityhub-controls-reference.html) 

Custom policies (SCPs அல்லது RCPs) டிப்ளாய் செய்யும்போது, [Control Tower service roles](https://docs.aws.amazon.com/controltower/latest/userguide/awscontroltowerexecution.html) மறுக்கப்படாமல் இருப்பதை உறுதிசெய்யவும், இல்லையெனில் errors அல்லது Control Tower இயங்க முடியாமல் போகலாம்.


Production கணக்குகளுக்கு டிப்ளாய் செய்வதற்கு முன் எப்போதும் controls-ஐ சோதிக்கவும்.

* முதலில் non-production OUs மற்றும்/அல்லது சோதனை Organization-ல் டிப்ளாய் செய்யவும்
* புதிய preventative control-ஐ அறிமுகப்படுத்துவதற்கு முன் non-compliance-ஐ அடையாளம் கண்டு தீர்க்க இணையான detective controls-ஐ டிப்ளாய் செய்வதைக் கருத்தில் கொள்ளவும்

## Control inheritance-ஐ புரிந்துகொள்ளவும் 

Controls AWS Control Tower-ன் அடிப்படை அங்கமாகும், அவை எவ்வாறு செயல்படுகின்றன என்பதை புரிந்துகொள்வது வெற்றிகரமான landing zone operations-க்கு அவசியம்.

* Mandatory controls முடக்க முடியாது மற்றும் குறிப்பாக Control Tower வளங்களைப் பாதுகாக்கின்றன. அவை பயனர் பணிச்சுமைகளுக்கு பொருந்தாது.
* Control Tower enrolled கணக்குகள் parent OU-லிருந்து controls-ஐ மரபுரிமையாகப் பெறுகின்றன
    * Preventative, AWS Organizations policy based controls nested OUs-ல் மரபுரிமையாகப் பெறப்படும், மற்றவை பெறாது.
    * Preventative, AWS Organizations policy based controls Control Tower registered OUs-ல் un-enrolled கணக்குகளுக்கு பொருந்தும், மற்றவை பொருந்தாது.

## Service Linked Rules பயன்படுத்த Config controls-ஐ புதுப்பிக்கவும்

[ஜூன் 2025](https://aws.amazon.com/about-aws/whats-new/2025/06/aws-control-tower-service-linked-aws-config-managed-rules/) முதல் Control Tower service-linked AWS Config managed Config rules-ஐ ஆதரிக்கிறது. முன்பு, rules StackSets வழியாக டிப்ளாய் செய்யப்பட்டன. Service-linked rules சேவையால் நேரடியாக கணக்குகளில் டிப்ளாய் செய்யப்படுகின்றன மற்றும் Control Tower வழியாக தவிர பயனர்களால் திருத்தவோ நீக்கவோ முடியாது. இது deployment வேகத்தை மேம்படுத்துகிறது மற்றும் தற்செயலான drift-ஐ தடுக்கிறது. 


## AWS Organizations வழியாக கணக்குகளை நகர்த்த வேண்டாம்

AWS Organizations மூலம் நேரடியாக, console அல்லது API வழியாக, OUs-க்கு இடையே கணக்குகளை நகர்த்துவது Control Tower-ல் drift-ஐ ஏற்படுத்தும்.

OUs-க்கு இடையே கணக்குகளை நகர்த்த வேண்டுமானால், [Control Tower console மூலம் கணக்கைப் புதுப்பிப்பதன்](https://docs.aws.amazon.com/controltower/latest/userguide/updating-account-factory-accounts.html#update-account-in-console) மூலமோ அல்லது [Service Catalog-ல் கணக்கின் provisioned product-ஐ புதுப்பிப்பதன்](https://docs.aws.amazon.com/controltower/latest/userguide/updating-account-factory-accounts.html#update-provisioned-product) மூலமோ செய்யவும். Organizations-ல் கணக்கை நகர்த்தியிருந்தால், [கணக்கைப் புதுப்பிப்பது](https://docs.aws.amazon.com/controltower/latest/userguide/governance-drift.html#drift-account-moved) drift-ஐ தீர்க்கும். 


## இணக்க நிலையை மதிப்பாய்வு செய்யவும் 

உங்கள் கணக்குகள் மற்றும் OUs-ன் இணக்க நிலையை தொடர்ந்து மதிப்பாய்வு செய்து non-compliance-ஐ சரிசெய்ய நடவடிக்கை எடுக்கவும்.

Control Tower dashboard உங்கள் பயன்படுத்தப்பட்ட Control Tower controls-ன் இணக்க நிலையைக் காட்டும். தற்போது Control Tower-க்கு வெளியே பயன்படுத்தப்பட்ட config rules-ன் (Security Hub-க்கு சொந்தமானவை உட்பட) இணக்க நிலையைக் காட்டாது.

உங்கள் Organization முழுவதும் config compliance-ன் விரிவான பார்வையைப் பெற Cloud Intelligence Dashboards திட்டத்திலிருந்து [Config Resource Compliance Dashboard](https://catalog.workshops.aws/awscid/en-US/dashboards/additional/config-resource-compliance-dashboard)-ஐ செயல்படுத்துவதைக் கருத்தில் கொள்ளவும்.

இணக்க மாற்றங்கள் பற்றிய notifications பெற audit கணக்கில் உள்ள [SNS topics-க்கு](https://docs.aws.amazon.com/controltower/latest/controlreference/receive-notifications.html) subscribe செய்யவும்.

## இயக்கப்பட்ட controls-ஐ அவ்வப்போது மதிப்பாய்வு செய்யவும்

உங்கள் கணக்குகள் மற்றும் OUs-க்கு பயன்படுத்தப்பட்ட controls-ஐ தொடர்ந்து மதிப்பாய்வு செய்து, அவை உங்கள் வணிகத் தேவைகளை தொடர்ந்து பூர்த்தி செய்கின்றனவா என்பதையும், புதிய controls-ஐ பயன்படுத்திக்கொள்கிறீர்களா என்பதையும் உறுதிசெய்யவும். 


## Non-compliance மீது நடவடிக்கை எடுக்கவும்

[Systems Manager Documents](https://docs.aws.amazon.com/systems-manager/latest/userguide/documents.html) வரையறுத்து, அவற்றை உங்கள் இயக்கப்பட்ட Config rules-உடன் இணைத்து, [non-compliance-ஐ சரிசெய்ய](https://docs.aws.amazon.com/config/latest/developerguide/remediation.html) பயன்படுத்தலாம். Remediation [கைமுறையாக](https://docs.aws.amazon.com/config/latest/developerguide/setup-manualremediation.html) தூண்டலாம் அல்லது [தானாக இயங்க](https://docs.aws.amazon.com/config/latest/developerguide/setup-autoremediation.html) கட்டமைக்கலாம். 



## Landing zone செலவை கண்காணித்து மேம்படுத்தவும்

### உங்கள் landing zone செலவுகளில் தெரிவுநிலை உள்ளதா உறுதிசெய்யவும்.

* Organization-wide AWS செலவில் தெரிவுநிலைக்கு management கணக்கில் [AWS Cost Explorer](https://docs.aws.amazon.com/cost-management/latest/userguide/ce-what-is.html) பயன்படுத்தவும்
* [AWS Cost Anomaly Detection](https://docs.aws.amazon.com/cost-management/latest/userguide/getting-started-ad.html) கட்டமைத்து notifications-க்கு subscribe செய்யவும்.
* [Cost & Usage Report data exports](https://docs.aws.amazon.com/cur/latest/userguide/dataexports-create.html), Athena integration மற்றும் விரிவான QuickSight cost Dashboards எளிதாக இயக்க Cloud Intelligence Dashboards செயல்படுத்துவதைக் கருத்தில் கொள்ளவும் 

### செலவு உயர்வுகளுக்கான பொதுவான காரணங்களை அறிந்திருங்கள்

* CloudTrail integration-உடன் Control Tower இயக்கும்போது, கூடுதல் CloudTrail கட்டணங்களைத் தவிர்க்க ஏற்கனவே உள்ள management trails-ஐ நீக்குவதை உறுதிசெய்யவும்
* Control Tower resource state-ஐ கண்காணிக்க AWS Config-ஐ பயன்படுத்துகிறது. இணக்கத்தை பராமரிக்க இது முக்கியம், ஆனால் அடிக்கடி மாறும் ephemeral workloads-க்கு கண்காணிப்பது விலையுயர்ந்ததாக இருக்கலாம். Control Tower-ல் member accounts-ல் Config recorder-ஐ மாற்ற built-in option தற்போது இல்லை, ஆனால் அதிகப்படியான Config செலவுகள் மற்றும் குறைவான இணக்கத் தேவைகள் கொண்ட கணக்குகளுக்கு Config recorder-ஐ முடக்க இந்த [workaround](https://aws.amazon.com/blogs/mt/customize-aws-config-resource-tracking-in-aws-control-tower-environment/)-ஐ கருத்தில் கொள்ளவும்.



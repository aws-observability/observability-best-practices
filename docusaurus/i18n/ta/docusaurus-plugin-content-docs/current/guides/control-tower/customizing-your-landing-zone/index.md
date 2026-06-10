---
sidebar_position: 3
---
# உங்கள் landing zone-ஐ தனிப்பயனாக்குதல்


Control Tower நன்கு நிர்வகிக்கப்படும் landing zone-க்கான ஆரம்ப புள்ளியை வரையறுக்கிறது, ஆனால் பெரும்பாலான வாடிக்கையாளர்கள் தங்கள் பணிச்சுமைகளுக்கு கூடுதல் platform சேவைகளை செயல்படுத்த வேண்டும். இதில் centralized networking, security சேவைகள், centralized observability சேவைகள் போன்றவை அடங்கும். 

## Infrastructure as code பயன்படுத்தவும்

கூடுதல் platform சேவைகள் infrastructure as code (IaC) பயன்படுத்தி வரையறுக்கப்பட்டு டிப்ளாய் செய்யப்பட வேண்டும், இது:

* அனைத்து கணக்குகள் மற்றும் பிராந்தியங்களில் ஒரே மாதிரியான கட்டமைப்புகளை உறுதிசெய்யும்
* Version control & change management-ஐ இயக்கும், peer review மற்றும் rollback-ஐ ஆதரிக்கும், மேலும் அனைத்து மாற்றங்களும் பதிவு செய்யப்படுவதையும் audit செய்யக்கூடியதாக இருப்பதையும் உறுதிசெய்யும்
* Control Tower lifecycle events-க்கு பதிலளிக்கும் வகையில் deployment தூண்டப்படக்கூடிய விரைவான, தானியங்கு account provisioning-ஐ ஆதரிக்கும் 

## சரியான தனிப்பயனாக்க விருப்பத்தைத் தேர்வு செய்யவும் 

ஆரம்பத்தில் சரியான தனிப்பயனாக்க அணுகுமுறையைத் தேர்வு செய்வது முக்கியமானது, ஏனெனில் இது உங்கள் operational model மற்றும் flexibility-ஐ கணிசமாக பாதிக்கும். IaC preferences, operational requirements மற்றும் விரும்பும் customization flexibility போன்ற காரணிகளைப் பொறுத்தது. உங்கள் landing zone-க்கு ஒரே ஒரு customization option-ஐ செயல்படுத்த பரிந்துரைக்கிறோம்.

Control Tower-ஐ code மூலம் தனிப்பயனாக்க நான்கு முக்கிய விருப்பங்கள் உள்ளன: 

* AWS Organizations StackSets
* Account Factory Customization (AFC)
* Customization for AWS Control Tower (CfCT)
* Account Factory for Terraform (AFT) 
* Landing Zone Accelerator (LZA)

### CloudFormation StackSets

CloudFormation-ல் infrastructure resources வரையறுத்து, native [CloudFormation StackSets](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/what-is-cfnstacksets.html) feature பயன்படுத்தி குறிப்பிட்ட கணக்குகளுக்கு டிப்ளாய் செய்ய முடியும். StackSet ஒரே template பயன்படுத்தி பிராந்தியங்கள் முழுவதும் stacks உருவாக்க அனுமதிக்கிறது. CloudFormation புதிய AWS Organizations கணக்குகள் சேர்க்கப்படும்போது [தானாகவே கூடுதல் stacks-ஐ டிப்ளாய்](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/stacksets-orgs-manage-auto-deployment.html) செய்யலாம், [சில எச்சரிக்கைகளுடன்](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/stacksets-orgs-manage-auto-deployment.html#stacksets-orgs-auto-deployment-considerations).

StackSets குறைந்தபட்ச dependencies கொண்ட எளிய templates டிப்ளாய் செய்ய பயனுள்ளது (baseline IAM Roles போன்றவற்றை டிப்ளாய் செய்ய Control Tower-ஆல் பயன்படுத்தப்படுகிறது) ஆனால் CI/CD இல்லாமை மற்றும் Control Tower-ன் account provisioning process-உடன் ஒருங்கிணைப்பு இல்லாமை மிகவும் சிக்கலான customizations-க்கு சவாலாக இருக்கும். 

CloudFormation-ல் எளிய customizations டிப்ளாய் செய்ய managed service தேடுகிறீர்கள் என்றால், AFC-ஐ கருத்தில் கொள்ளவும். CI/CD ஆதரிக்கும் CloudFormation based solution தேடுகிறீர்கள் என்றால், CfCT-ஐ கருத்தில் கொள்ளவும்.


### Account Factory Customization (AFC)

[AFC](https://docs.aws.amazon.com/controltower/latest/userguide/af-customization-page.html) native Control Tower feature ஆகும் மற்றும் AWS Control Tower-ன் account provisioning workflow-உடன் நேரடியாக ஒருங்கிணைகிறது. Account provision செய்யும்போது resources மற்றும் configurations-உடன் baseline செய்ய blueprints (CloudFormation அல்லது Terraform-ல்) வரையறுக்க அனுமதிக்கிறது. 

Blueprints Service Catalog-ல் புதுப்பிக்கவும் version செய்யவும் முடியும். புதுப்பிக்கப்பட்ட baseline பயன்படுத்த Control Tower account update process-ஐ பயன்படுத்தலாம். AFC-ல் பல blueprints வரையறுக்க முடியும் என்றாலும், ஒரு கணக்கை ஒன்றுக்கு மேற்பட்ட blueprint-உடன் baseline செய்ய இன்னும் முடியாது. இது மிகவும் சிக்கலான customization-க்கு AFC பயன்படுத்துவதை சவாலாக்குகிறது.  

நேரடியான customization தேவைப்பட்டால், ஒரு கணக்குக்கு ஒரே baseline போதுமானது என்றால், customization process-க்கு எந்த resources-ஐயும் நிர்வகிக்க விரும்பவில்லை என்றால் AFC பயன்படுத்தவும்.


### Customizations for AWS Control Tower (CfCT)

[CfCT](https://docs.aws.amazon.com/controltower/latest/userguide/cfct-overview.html) என்பது Control Tower management கணக்கில், Control Tower home region-ல் AWS Code Pipeline pipeline-ஐ செயல்படுத்தும் AWS solution ஆகும். இது S3 அல்லது Github-ல் உள்ள CloudFormation templates repository-ஆல் ஆதரிக்கப்படுகிறது. உங்கள் Organization-ல் target கணக்குகள் மற்றும் OUs-க்கு CloudFormation templates, SCPs மற்றும் RCPs டிப்ளாய்மென்ட்டை ஆதரிக்கிறது. CfCT account creation-ன் automation-ஐ ஆதரிக்காது. அதற்கு பதிலாக, Control Tower-ன் Account Factory மூலம் உருவாக்கப்பட்ட புதிய கணக்குகளுக்கு customization தானாகவே trigger ஆகும் வகையில் Control Tower-ன் lifecycle events-உடன் ஒருங்கிணைக்கப்பட்டுள்ளது. 

உங்களிடம் in-house CloudFormation திறன்கள் இருந்து, management கணக்கில் solution-ஐ பராமரிக்கவும் [புதுப்பிக்கவும்](https://docs.aws.amazon.com/controltower/latest/userguide/update-stack.html) தயாராக இருந்தால் CfCT பயன்படுத்தவும்.



### Account Factory for Terraform (AFT)

[AFT](https://docs.aws.amazon.com/controltower/latest/userguide/taf-account-provisioning.html) Terraform மற்றும் நேரடி AWS API calls பயன்படுத்தி account creation மற்றும் customization-ன் முழு செயல்முறையையும் நிர்வகிக்கிறது. இது மிகவும் flexible solution ஆனால் அதிக management overhead வருகிறது. CfCT-போல் அல்லாமல், AFT account creation-லிருந்து account customization வரை முழு செயல்முறையையும் automate செய்ய முடியும். Account customizations-ன் Terraform state files-ஐ நிர்வகிக்கவும் வடிவமைக்கப்பட்டுள்ளது. 

Control Tower Proactive controls (CloudFormation Guard rules-ஆக செயல்படுத்தப்படும்) பொருந்தாது, ஏனெனில் resources CloudFormation பயன்படுத்தி டிப்ளாய் செய்யப்படவில்லை.

உங்களிடம் in-house Terraform திறன்கள் இருந்து, Terraform state மற்றும் processes அமைப்பதிலும் பராமரிப்பதிலும் அனுபவம் இருந்தால், பல repositories நிர்வகிக்க முடிந்தால், வெவ்வேறு teams-க்கு இடையே ஒருங்கிணைக்க முடிந்தால் AFT பயன்படுத்தவும். 


### Landing Zone Accelerator (LZA)

[LZA](https://aws.amazon.com/solutions/implementations/landing-zone-accelerator-on-aws/) என்பது AWS best practices மற்றும் security frameworks அடிப்படையில் பாதுகாப்பான, multi-account சூழலை செயல்படுத்துவதற்கான AWS solution ஆகும். LZA AWS Control Tower தேவையில்லை என்றாலும், Control Tower-ஐ உங்கள் foundational landing zone ஆகவும் அதன் மேல் LZA செயல்படுத்தவும் [பரிந்துரைக்கப்படுகிறது](https://docs.aws.amazon.com/controltower/latest/userguide/about-lza.html). LZA security tooling மற்றும் shared networking services உள்ளிட்ட பொதுவான landing zone functions-ன் opinionated deployments-ஐ வழங்குகிறது, configuration files மூலம் வரையறுக்கப்பட்ட customization கிடைக்கும்.

கடுமையான பாதுகாப்பு மற்றும் இணக்கத் தேவைகள் உள்ள துறையில் இருந்தால்; பாதுகாப்பான மற்றும் இணக்கமான landing zone விரைவாக டிப்ளாய் செய்ய வேண்டுமானால்; infrastructure deployment-க்கு மிகவும் opinionated அணுகுமுறையில் comfortable ஆக இருந்தால்; solution-ஐ பராமரிக்க தயாராக இருந்தால்; மற்றும் ஏதேனும் சிக்கல்கள் எழுந்தால் அடிப்படை CDK code-ஐ புரிந்துகொண்டு நிர்வகிக்க தயாராக இருந்தால் LZA பயன்படுத்தவும்.  


| அம்சம் | Account Factory Customization (AFC) | Customizations for AWS Control Tower (CfCT) | Account Factory for Terraform (AFT) | Landing Zone Accelerator (LZA) |
| ------- | ------------------------------------ | -------------------------------------------- | ------------------------------------ | ------------------------------- |
| Service Managed | ஆம் | இல்லை | இல்லை | இல்லை |
| IaC Engine | CloudFormation, Terraform | CloudFormation | Terraform | CDK |
| Deploys SCP | இல்லை | ஆம் | ஆம் | ஆம் |
| பல Configuration Packages ஆதரிப்பு | இல்லை | ஆம் | ஆம் | ஆம் |
| கற்றல் வளைவு | குறைவு | நடுத்தரம் | அதிகம் | குறைவு |
| Operational Overhead | குறைவு | நடுத்தரம் | அதிகம் | நடுத்தரம் |
| API ஆதரவு | இல்லை | ஆம் | ஆம் | ஆம் |
| Version Control Integration | இல்லை | ஆம் | ஆம் | ஆம் |
| Delegated Administration | இல்லை | இல்லை | ஆம் | ஆம் |
| Account Provisioning | நேரடி | Lifecycle events வழியாக மட்டும் | நேரடி | நேரடி |
| Console Management | ஆம் | வரையறுக்கப்பட்டது | வரையறுக்கப்பட்டது | வரையறுக்கப்பட்டது |
| Deployment சிக்கல்தன்மை | குறைவு | நடுத்தரம் | அதிகம் | நடுத்தரம் |
| Customization Flexibility | வரையறுக்கப்பட்டது | அதிகம் | மிக அதிகம் | அதிகம் |
| Proactive Controls பொருந்தும் | ஆம் | ஆம் | இல்லை | ஆம் |

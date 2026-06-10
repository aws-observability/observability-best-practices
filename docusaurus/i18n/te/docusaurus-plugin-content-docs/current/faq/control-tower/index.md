---
sidebar_position: 5
---
# AWS Control Tower

### AWS Control Tower ఏ సమస్యను పరిష్కరిస్తుంది?

AWS Control Tower బహుళ AWS ఖాతాలు మరియు బృందాలు ఉన్న సంస్థలకు వారి [multi-account AWS environment](https://docs.aws.amazon.com/whitepapers/latest/organizing-your-aws-environment/organizing-your-aws-environment.html) ను scale లో సెటప్ చేసి govern చేయడానికి నేరుగా మార్గం అవసరమైనప్పుడు, స్థాపించబడిన policies తో compliance నిర్ధారిస్తూ సహాయపడుతుంది.


### AWS Control Tower ఉపయోగించడానికి అదనపు ఖర్చులు ఉన్నాయా?

AWS Control Tower ఉపయోగించడానికి అదనపు charges లేదా upfront commitments లేవు. AWS Control Tower ద్వారా enable చేయబడిన AWS services మరియు మీ landing zone లో ఉపయోగించే services మరియు ఎంచుకున్న controls implement చేయడానికి మాత్రమే చెల్లిస్తారు. ఉదాహరణకు, మీరు: - Account Factory తో accounts provision చేయడానికి Service Catalog మరియు AWS Config ఉపయోగించి implement చేయబడిన mandatory controls కోసం చెల్లిస్తారు.


### AWS Control Tower లో controls (guardrails) ఏమిటి?

[Controls](https://docs.aws.amazon.com/controltower/latest/controlreference/controls.html), గతంలో guardrails అని సూచించబడినవి, non-conforming resources deploy చేయకుండా నిరోధించడంలో మరియు deployed resources ను compliance కోసం నిరంతరం monitor చేయడంలో సహాయపడే security, operations, మరియు compliance కోసం స్పష్టంగా నిర్వచించబడిన rules.


### AWS Control Tower ఏ రకాల controls అందిస్తుంది?

AWS Control Tower మూడు ప్రధాన రకాల controls అందిస్తుంది:

1. [Preventive controls](https://docs.aws.amazon.com/controltower/latest/controlreference/preventive-controls.html): ఇవి actions జరగకుండా నిరోధిస్తాయి. AWS Organizations లో Service Control Policies (SCPs) ఉపయోగించి implement చేయబడతాయి.
2. [Detective controls](https://docs.aws.amazon.com/controltower/latest/controlreference/detective-controls.html): ఇవి specific events లేదా resources noncompliance ను జరిగిన తర్వాత detect చేసి dashboard ద్వారా alerts అందిస్తాయి. AWS Config rules ఉపయోగించి implement చేయబడతాయి.
3. [Proactive controls](https://docs.aws.amazon.com/controltower/latest/controlreference/proactive-controls.html): ఇవి resources మీ company policies మరియు objectives కు compliant గా ఉన్నాయా అని resources provision చేయడానికి ముందే check చేస్తాయి. resources out of compliance లో ఉంటే, అవి provision చేయబడవు. AWS CloudFormation hooks తో implement చేయబడతాయి.

 ఈ మూడు రకాల controls ను AWS Control Tower లో కలపడం ద్వారా, మీ multi-account AWS environment secure గా ఉందో మరియు best practices ప్రకారం manage అవుతోందో monitor చేయవచ్చు.


### Control Tower ఏ AWS services ను orchestrate చేస్తుంది?

AWS Control Tower multi-account AWS environment సెటప్ చేయడానికి మరియు govern చేయడానికి [అనేక AWS services](https://docs.aws.amazon.com/controltower/latest/userguide/integrated-services.html) ను orchestrate చేస్తుంది. AWS Control Tower ద్వారా orchestrate చేయబడే primary services:
1. AWS Organizations - మీ multi-account environment అంతటా consistent compliance మరియు governance కోసం framework సెటప్ చేయడానికి ఉపయోగించబడుతుంది
2. AWS Service Catalog - account deployment మరియు enrollment automate చేసే Account Factory functionality కోసం ఉపయోగించబడుతుంది
3. AWS IAM Identity Center (గతంలో AWS SSO) - user identities మరియు federated access manage చేయడానికి ఉపయోగించబడుతుంది అదనంగా, AWS Control Tower ఇంటిగ్రేట్ అవుతుంది:
4. AWS CloudTrail - centralized log archive సృష్టించడంలో భాగంగా ఉపయోగించబడుతుంది
5. AWS Config - deployed resources monitor చేయడానికి మరియు best practices నుండి drift నిరోధించడానికి ఉపయోగించబడుతుంది.



### నా ఉన్న identity provider ను AWS Control Tower తో ఉపయోగించవచ్చా?

AWS Control Tower identity provider integration కోసం మూడు options అందిస్తుంది:
1. IAM Identity Center User Store: ఇది default option, AWS Control Tower మీ కోసం IAM Identity Center సెటప్ చేసి manage చేస్తుంది.
2. Active Directory: Active Directory తో సెటప్ చేసినప్పుడు, AWS Control Tower IAM Identity Center directory ను manage చేయదు.
3. External Identity Provider (IdP): ఈ option తో, AWS Control Tower IAM Identity Center directory లో groups సృష్టించి selected users కోసం access provision చేస్తుంది. Microsoft Entra ID, Google Workspace లేదా Okta వంటి external IdPs నుండి existing users ను specify చేయవచ్చు.
దయచేసి AWS Control Tower సెటప్ చేయడానికి అనుమతించకుండా AWS IAM Identity Center ను [self-manage](https://docs.aws.amazon.com/controltower/latest/userguide/select-idp.html) చేయగల option ఉందని గమనించండి.


### నా data encrypted అవుతుందా మరియు నా స్వంత AWS Key Management Service key ఉపయోగించవచ్చా?

AWS Control Tower మీ landing zone కోసం రెండు ప్రధాన encryption options అందిస్తుంది: 1. Default encryption: Default గా, AWS Control Tower మీ landing zone లోని resources కోసం Amazon S3-Managed Keys (SSE-S3) ఉపయోగించి data at rest encrypt చేస్తుంది. 2. AWS KMS encryption: optional enhanced security level గా, AWS Control Tower deploy చేసే services secure చేయడానికి AWS Key Management Service (AWS KMS) key ఉపయోగించడానికి కాన్ఫిగర్ చేయవచ్చు.


### AWS లో అందుబాటులో ఉన్న నిర్దిష్ట regions కు access restrict చేయడానికి AWS Control Tower ఉపయోగించవచ్చా?

AWS Control Tower enrolled accounts కోసం specific regions లో AWS services కు access restrict చేయడానికి [Region deny](https://docs.aws.amazon.com/controltower/latest/userguide/region-how.html) capabilities అందిస్తుంది. ఇది compliance requirements address చేయడానికి మరియు specific Regions కు access restrict చేయడం ద్వారా costs manage చేయడానికి సహాయపడుతుంది.


### AWS Config resources ఇప్పటికే ఉన్న existing AWS accounts ను ఎలా enroll చేయవచ్చు

Existing AWS Config resources తో existing account ను AWS Control Tower లోకి migrate చేయడానికి, నిర్దిష్ట [5-step process](https://docs.aws.amazon.com/controltower/latest/userguide/existing-config-resources.html) అనుసరించాలి:

1. AWS customer support ను సంప్రదించి account ను AWS Control Tower allow list కు add చేయండి.
2. AWS CloudFormation ఉపయోగించి member account లో కొత్త IAM role సృష్టించండి.
3. Pre-existing AWS Config resources ఉన్న AWS Regions గుర్తించండి.
4. AWS Config resources లేని AWS Regions గుర్తించండి.
5. ప్రతి Region లో existing AWS Config resources ను AWS Control Tower settings కు align చేయడానికి modify చేసి, account ను enroll చేయండి.



### Drift అంటే ఏమిటి మరియు control tower drift మరియు configuration ను ఎలా handle చేయాలి

AWS Control Tower లో Drift అంటే AWS Control Tower బయట configuration changes చేయబడినప్పుడు, resources governance requirements కు non-compliant అవడం. సాధారణ drift types:
 1. Control policy drift - AWS Control Tower own చేసిన policies unexpectedly update అయినప్పుడు.
2. Security Hub control drift.
3. Required organizational units deletion (Security OU వంటివి)
4. Required IAM roles deletion లేదా inaccessibility
5. Registered AWS Control Tower OUs నుండి member accounts ను ఇతర OUs కు move చేయడం.

AWS Control Tower detect అయిన drift type ను బట్టి వివిధ [remediation options](https://docs.aws.amazon.com/controltower/latest/userguide/resolving-drift.html) అందిస్తుంది.


### AWS Control Tower account customization options ఏమిటి?

AWS Control Tower accounts customize చేయడానికి అనేక options అందిస్తుంది:
1. [Account Factory Customization](https://docs.aws.amazon.com/controltower/latest/userguide/af-customization-page.html) (AFC) - AWS Control Tower console నుండి నేరుగా new మరియు existing AWS accounts customize చేయడానికి అనుమతిస్తుంది.
2. [Customizations for AWS Control Tower](https://docs.aws.amazon.com/controltower/latest/userguide/cfct-overview.html) (CfCT) - AWS Control Tower console ద్వారా అందుబాటులో ఉన్నదానికి మించి మీ landing zone customize చేయడంలో సహాయపడే functionality package.
3. [AWS Control Tower Account Factory for Terraform](https://docs.aws.amazon.com/controltower/latest/userguide/taf-account-provisioning.html) (AFT) - Terraform ఉపయోగించి AWS accounts provision మరియు customize చేయడానికి అనుమతించే solution.


### CfCT కోసం configuration source గా GitHub ఉపయోగించవచ్చా?

అవును, Customizations for AWS Control Tower (CfCT) కోసం configuration source గా GitHub ఉపయోగించవచ్చు.


### AFT repository గా GitHub ఉపయోగించవచ్చా?

అవును, AWS Control Tower Account Factory for Terraform (AFT) ను AWS CodeCommit నుండి మరొక VCS provider కు move చేయవచ్చు.

### AFT తో OpenTofu ఉపయోగించవచ్చా?

OpenTofu Terraform నుండి fork అయిన popular open source infrastructure as code (IaC) tool. OpenTofu sourcefuse/arc-control-tower-aft module కలిగి ఉంది, ఇది కొన్ని tweaks తో AFT functions కు మద్దతు ఇవ్వవచ్చు, కానీ ఇది AWS ద్వారా supported కాదు.

### నా CfCT కోసం VCS గా Gitlab ఉపయోగించవచ్చా?

లేదు, CfCT కోసం Gitlab support ఇంకా అందుబాటులో లేదు. v2.8.1 నుండి Github ను VCS గా ఉపయోగించవచ్చు.

### నాకు ఇప్పటికే Landing Zone Accelerator (LZA) deploy అయి ఉంది, ఇప్పటికీ AWS Control Tower ఉపయోగించవచ్చా?

AWS Control Tower మరియు Landing Zone Accelerator (LZA) complementary solutions గా బాగా కలిసి పని చేస్తాయి. recommended best practice ముందుగా మీ foundational landing zone గా AWS Control Tower deploy చేయడం, ఆపై అవసరమైనప్పుడు LZA తో దాని capabilities enhance చేయడం.


### AWS Control Tower setup తో interact చేయడానికి API ఉపయోగించవచ్చా?

AWS Control Tower వివిధ tasks automate చేయడానికి [అనేక APIs](https://docs.aws.amazon.com/controltower/latest/APIReference/Welcome.html) అందిస్తుంది: 1. Control APIs 2. Landing Zone APIs 3. Baseline APIs.


### Control Tower ద్వారా create చేయబడిన account కోసం email address ఎలా మార్చవచ్చు?

AWS Control Tower లో enrolled member account email address మార్చడానికి, ఈ దశలు అనుసరించాలి: 1. Account కోసం root user password recover చేయండి. 2. Root user password తో account లో sign in అవ్వండి. 3. ఏదైనా ఇతర AWS account మాదిరిగా email address మార్చండి. 4. Service Catalog లో provisioned product update చేయండి.


### Inter-networking connectivity considerations

AWS Control Tower default గా organizational unit (OU) లో create చేయబడిన ప్రతి account కోసం ప్రతి VPC కి ఒకే CIDR range (172.31.0.0/16) assign చేస్తుంది. ఈ default configuration overlapping IP addresses వల్ల మీ AWS Control Tower VPCs మధ్య peering initially permit చేయదు.


### మాకు ఇప్పటికే existing security మరియు logging accounts ఉన్నాయి, AWS Control Tower కోసం audit మరియు logging account గా existing account ఉపయోగించవచ్చా?

అవును, AWS Control Tower initial landing zone setup process సమయంలో మీ audit (security) మరియు log archive (logging) accounts గా existing AWS accounts specify చేయగల option అందిస్తుంది.


### మాకు ఇప్పటికే existing external IDP ఉంది, Control Tower enable చేస్తే existing settings కు AWS Control Tower ఏ changes చేస్తుంది?

Existing identity provider తో AWS Control Tower సెటప్ చేసేటప్పుడు, మీరు ఎంచుకునే identity source ను బట్టి different impacts ఉంటాయి. IAM Identity Center Directory ఉపయోగిస్తుంటే, AWS Control Tower మీ existing configuration delete చేయకుండా permission sets మరియు groups వంటి resources add చేస్తుంది.


### AWS Control Tower nested OU support చేస్తుందా

అవును, AWS Control Tower nested organizational units (OUs) support చేస్తుంది. AWS Control Tower లో nested OU hierarchy maximum five levels deep ఉంటుంది.


### AWS GovCloud లో AWS Control Tower support అవుతుందా?

అవును, AWS Control Tower [GovCloud లో supported](https://docs.aws.amazon.com/govcloud-us/latest/UserGuide/govcloud-controltower.html). అయితే, stricterమ compliance మరియు operational requirements వల్ల AWS GovCloud (US) లో commercial regions నుండి భిన్నంగా ఉంటుంది.


### AWS Control Tower resource control policies (RCPs) ఉపయోగిస్తుందా?

AWS Control Tower ఇప్పుడు resource control policies (RCPs) తో implement చేయబడిన preventive controls support చేస్తుంది. ఈ RCP-based controls మీ AWS Control Tower environment అంతటా data perimeter establish చేయడంలో resources ను unintended access నుండి protect చేయడంలో సహాయపడతాయి.


### implement చేయడానికి ముందు OUs పై policies ఎలా test చేయాలి

Policy Staging OU production కు deploy చేయడానికి ముందు AWS policies, controls, మరియు services test మరియు validate చేయడానికి controlled environment గా పనిచేస్తుంది.

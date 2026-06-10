---
sidebar_position: 7
---

# ఆటోమేషన్

Automation, [AWS Systems Manager](https://docs.aws.amazon.com/systems-manager/latest/userguide/systems-manager-automation.html) యొక్క ఒక సామర్థ్యంతో, మీరు తక్కువ-కోడ్ [visual designer](https://docs.aws.amazon.com/systems-manager/latest/userguide/automation-visual-designer.html) ఉపయోగించి [అనుకూల runbooks](https://docs.aws.amazon.com/systems-manager/latest/userguide/automation-documents.html) రాయవచ్చు, లేదా AWS అందించే 370 కంటే ఎక్కువ ముందుగా నిర్వచించిన runbooks నుండి [బహుళ accounts మరియు AWS Regions లో](https://docs.aws.amazon.com/systems-manager/latest/userguide/running-automations-multiple-accounts-regions.html) ఎంచుకోవచ్చు. మీరు ఆమోదాలు, AWS API calls, లేదా మీ nodes పై commands అమలు చేయడం వంటి ఇతర [Systems Manager Automation actions](https://docs.aws.amazon.com/systems-manager/latest/userguide/automation-actions.html) తో కలిసి runbook లో భాగంగా Python లేదా PowerShell scripts అమలు చేయవచ్చు.

Automation వ్యాపారాలకు లోపాలను తగ్గించడం, స్థితిస్థాపకతను మెరుగుపరచడం ద్వారా పనితీరును మెరుగుపరచడానికి సహాయపడుతుంది. Automation భద్రత మరియు కార్యకలాపాలు రెండింటినీ వివిధ మార్గాలలో మెరుగుపరుస్తుంది, ఇక్కడ కొన్ని ఉదాహరణలు:

* **Configuration Management**: Automation సాధనాలు servers, workstations మరియు network devices అంతటా ప్రమాణీకృత configurations ను అమలు చేయగలవు, భద్రతా దుర్బలత్వాలకు దారితీసే తప్పు configurations యొక్క సంభావ్యతను తగ్గిస్తాయి.
* **Patch Management**: తెలిసిన దోపిడీలకు దుర్బలత్వ విండోను తగ్గించడానికి, systems అంతటా భద్రతా patches మరియు updates ను deploy చేయడానికి Automation ఉపయోగించవచ్చు.
* **Incident Response Playbooks**: భద్రతా సంఘటనలను నిరోధించడం, దర్యాప్తు చేయడం మరియు పరిష్కరించడం కోసం అవసరమైన దశల ద్వారా భద్రతా బృందాలకు మార్గదర్శకత్వం చేయడానికి Automation ముందుగా నిర్వచించిన incident response playbooks ను అమలు చేయగలదు. Application యజమానులు systems outage incidents కు ప్రతిస్పందించడానికి Automation runbooks సృష్టించవచ్చు. ఉదాహరణకు, నెట్‌వర్క్ కనెక్టివిటీ కోల్పోవడం, భౌతిక host లో software సమస్యలు, system శక్తి కోల్పోవడం. EC2 instance ను ఆపడం, terminate చేయడం, reboot చేయడం లేదా recover చేయడం కోసం [Amazon CloudWatch alarms](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/WhatIsCloudWatch.html) ఉపయోగించడం.
* **Compliance Management**: ఆడిట్ ప్రక్రియలను ఆటోమేట్ చేయడం, compliance నివేదికలను రూపొందించడం మరియు భద్రతా నియంత్రణలను స్థిరంగా అమలు చేయడం ద్వారా పరిశ్రమ నిబంధనలు మరియు అంతర్గత విధానాలతో compliance ను నిర్వహించడంలో Automation సహాయపడగలదు.

Systems Manager Automation ను ఉపయోగించడం ద్వారా, మీరు ఈ క్లిష్టమైన ప్రక్రియను క్రమబద్ధం చేయవచ్చు, మీ application servers మీ సంస్థ యొక్క భద్రతా విధానాలతో తాజాగా మరియు అనుగుణంగా ఉండేలా నిర్ధారిస్తుంది. ఇది సమయాన్ని ఆదా చేయడమే కాకుండా మాన్యువల్ లోపాల సంభావ్యతను తగ్గిస్తుంది, మరియు ఈ పునరావృత పనికి స్థిరమైన మరియు పునరావృత విధానాన్ని అందిస్తుంది.

![Automation](/img/cloudops/guides/centralized-operations-management/automation/BP-Automation-1.png "Automation")

## Service role ఉపయోగించి permissions నిర్వహించడం

భద్రతా ఉత్తమ అభ్యాసంగా, automation ప్రారంభించడానికి మీరు IAM role (SSM service ద్వారా assume చేయగలిగేది) సృష్టించవచ్చు. మీరు service role ఉపయోగించినప్పుడు, automation AWS resources పై అమలు చేయడానికి అనుమతించబడుతుంది, కానీ automation అమలు చేసిన వినియోగదారుకు ఆ resources కు పరిమిత ప్రాప్యత (లేదా ప్రాప్యత లేదు) ఉంటుంది.

ఉన్నతమైన భద్రత మరియు నియంత్రణ - Delegated administration మీ AWS resources యొక్క ఉన్నతమైన భద్రత మరియు నియంత్రణను నిర్ధారిస్తుంది. మీరు permissions మార్చాలనుకుంటే, బహుళ IAM accounts కు బదులుగా service role వద్ద ఆ మార్పులు చేయండి.

మెరుగైన auditing అనుభవం - బహుళ IAM accounts కు బదులుగా ఒక కేంద్ర service role ద్వారా మీ resources పై చర్యలు నిర్వహించబడుతున్నందున మెరుగైన auditing అనుభవాన్ని అనుమతిస్తుంది.

కింది పరిస్థితులకు మీరు Automation కోసం service role పేర్కొనాలి: 1/ మీరు delegated administration ఉపయోగించాలనుకున్నప్పుడు. 2/ మీరు runbook అమలు చేసే Systems Manager State Manager association సృష్టించినప్పుడు. 3/ 12 గంటల కంటే ఎక్కువ సమయం అమలు అవుతుందని మీరు ఆశించే operations ఉన్నప్పుడు. 4/ AWS API operation కాల్ చేయడానికి లేదా AWS resource పై పని చేయడానికి aws:executeScript action ఉపయోగించే Amazon యాజమాన్యం కాని runbook అమలు చేస్తున్నప్పుడు.

![Managing permissions](/img/cloudops/guides/centralized-operations-management/automation/BP-Automation-2.png "Managing permissions")

మీ service role సృష్టించిన తర్వాత, ఆ account లో Systems Manager Automation మాత్రమే role assume చేయడానికి అనుమతించబడేలా trust policy ని సవరించమని మేము సిఫార్సు చేస్తున్నాము. Role policy కోసం, runbook లో నిర్వచించిన automation actions అమలు చేయడానికి అవసరమైన permission మాత్రమే జోడించండి. Automation ప్రారంభించే IAM entity కు అవసరమైన automation runbooks ప్రారంభించడానికి అనుమతి ఉంటుంది. Entity కు automation service role ను Systems Manager కు pass చేయడానికి అనుమతి ఉంటుంది. ఈ entity కు AWS resources తో నేరుగా interact చేయడానికి permissions ఇవ్వబడవు. ఆ permissions service role కు delegate చేయబడతాయి.

* Service role trust policy
  * Systems Manager ద్వారా assume చేయగలిగేది
* Service role policy – తక్కువ ప్రాప్యత విధానం
  * Automation actions అమలు చేయడానికి అవసరమైన permission మాత్రమే ఇవ్వండి
* IAM User/Group/Role policy
  * Service role ను automation కు pass చేయడానికి అనుమతించండి
  * Automation executions ను start/stop/describe చేయడానికి permissions అనుమతించండి
  * Automation వెలుపల resources నిర్వహించడానికి permissions అవసరం లేదు

## Automation runbooks సృష్టించడం

మీ స్వంత automation runbooks సృష్టించడానికి బహుళ మార్గాలు ఉన్నాయి. Document ను ప్రోగ్రామాటిక్‌గా సృష్టించడానికి, మీరు CreateDocument API, లేదా SSM Documents CDK library ఉపయోగించవచ్చు. మీరు CloudFormation ఉపయోగించి కూడా document సృష్టించవచ్చు.

AWS Systems Manager Automation automation runbooks సృష్టించడంలో సహాయపడే తక్కువ-కోడ్ visual design అనుభవాన్ని అందిస్తుంది. Visual design అనుభవం drag-and-drop interface ను మీ స్వంత కోడ్ జోడించే ఎంపికతో అందిస్తుంది, తద్వారా మీరు runbooks ను మరింత సులభంగా సృష్టించవచ్చు మరియు సవరించవచ్చు.

మీరు runbook సృష్టిస్తున్నప్పుడు, visual design అనుభవం మీ పనిని ధృవీకరిస్తుంది మరియు కోడ్‌ను స్వయంచాలకంగా ఉత్పత్తి చేస్తుంది. మీరు ఉత్పత్తి చేయబడిన కోడ్‌ను సమీక్షించవచ్చు, లేదా స్థానిక అభివృద్ధి కోసం export చేయవచ్చు. మీరు పూర్తి చేసిన తర్వాత, మీరు మీ runbook ను save చేయవచ్చు, అమలు చేయవచ్చు మరియు Systems Manager Automation console లో ఫలితాలను పరిశీలించవచ్చు.

Visual design అనుభవంలో, మీ Python scripts లో భద్రతా విధాన ఉల్లంఘనలు మరియు దుర్బలత్వాలను గుర్తించడంలో సహాయపడటానికి Automation Amazon CodeGuru Security తో integrate అవుతుంది.

అందుబాటులో ఉన్న ఎంపికలు:

* AWS APIs ఉపయోగించండి లేదా CloudFormation ఉపయోగించి documents సృష్టించండి
* [Automation runbooks కోసం Visual design అనుభవం](https://docs.aws.amazon.com/systems-manager/latest/userguide/automation-visual-designer.html)
* [Visual Studio Code Toolkit](https://docs.aws.amazon.com/toolkit-for-vscode/latest/userguide/systems-manager-automation-docs.html)
* [Systems Manager Documents కోసం CDK](https://github.com/cdklabs/cdk-ssm-documents)

Systems Manager runbooks ను AWS accounts అంతటా భాగస్వామ్యం చేయడానికి అనుమతిస్తుంది. ఇది సమర్థవంతమైన సహకారాన్ని మరియు ఉత్తమ అభ్యాసాల స్వీకరణను ప్రోత్సహిస్తుంది. ఉదాహరణకు, ఒక కేంద్ర account భద్రతా ఉత్తమ అభ్యాసాలను automation runbooks గా నిర్వచించవచ్చు మరియు సంస్థలోని ఇతర accounts తో భాగస్వామ్యం చేయవచ్చు. ఇది మొత్తం AWS వాతావరణంలో భద్రతా చర్యల స్థిరమైన అమలును నిర్ధారిస్తుంది.

Default గా SSM AWS Organization Unit (OU) ఉపయోగించి runbooks భాగస్వామ్యం చేయడానికి మద్దతు ఇవ్వదు. ఈ పరిమితిని అధిగమించడానికి ఒక పరిష్కారం అందుబాటులో ఉంది.

![Automation runbooks](/img/cloudops/guides/centralized-operations-management/automation/BP-Automation-3.png "Automation runbooks")

ఈ పరిష్కారం EventBridge Rule, Lambda functions, Step Function State Machine మరియు SNS topic తో సహా అనేక AWS resources ను ఉపయోగిస్తుంది. Deploy చేసిన తర్వాత, CreateAccount లేదా InviteAccountToOrganization API call ద్వారా AWS Organizations కు కొత్త account జోడించబడిన ప్రతిసారి పరిష్కారం workflow ను trigger చేస్తుంది. Workflow నియమించబడిన AWS Organizations child account లో కొత్తగా జోడించబడిన Account ID కోసం మరియు అన్ని పేర్కొన్న Region(s) లో SSM Document share permissions ను జోడిస్తుంది. [Automate AWS Organizations SSM Document Share Permissions](https://github.com/aws-samples/aws-management-and-governance-samples/tree/master/AWSSystemsManager/AWS-Org-SSM-Permissions) పై మరింత తెలుసుకోండి.

## Automation అమలు చేయడం

* **Simple Automation** – ప్రస్తుత region & account
* **Manual Automation** – Interactive step-by-step execution. ప్రతి step manually అమలు చేయబడుతుంది. Troubleshooting ప్రయోజనం కోసం ఉపయోగపడుతుంది.
* **Multi Account Multi Region Automation** – కేంద్ర account నుండి బహుళ AWS Regions మరియు AWS accounts లేదా AWS Organizations organizational units (OUs) అంతటా automation అమలు చేయండి.
* **Run at scale** – Tags, Resource Groups లేదా Parameter values ఉపయోగించి target చేయండి
* **Rate Control** – Concurrency & Error threshold. Blast radius ను నియంత్రిస్తుంది. Concurrency value ఏకకాలంలో ఎన్ని resources automation అమలు చేయడానికి అనుమతించబడతాయో నిర్ణయిస్తుంది.
* **Adaptive Concurrency** – 500 వరకు ఏకకాల automations. Automation preferences లో దీన్ని enable చేయండి.
* **CloudWatch Alarm Integration** – Automation ను monitor చేయడానికి CloudWatch alarm జోడించండి. Alarm activate అయితే, automation ఆపివేయబడుతుంది.
* **Security** – IAM access control.
  * IAM policies ఉపయోగించి, administrators మీ సంస్థలో ఏ వ్యక్తిగత users లేదా groups Automation ఉపయోగించగలరో మరియు ఏ runbooks ను access చేయగలరో నియంత్రించగలరు.
  * IAM service role ఉపయోగించి Automation access delegation ను అనుమతిస్తుంది. మీరు service role ఉపయోగించినప్పుడు, automation AWS resources పై అమలు చేయడానికి అనుమతించబడుతుంది, కానీ automation అమలు చేసిన వినియోగదారుకు ఆ resources కు పరిమిత ప్రాప్యత (లేదా ప్రాప్యత లేదు) ఉంటుంది.

## బహుళ accounts మరియు Regions లో Automation అమలు చేయడం

![Running Automation](/img/cloudops/guides/centralized-operations-management/automation/BP-Automation-4.png "Running Automation")

బహుళ Regions మరియు accounts లేదా OUs అంతటా automations అమలు చేయడం ఈ విధంగా పనిచేస్తుంది:

1. మీరు automation అమలు చేయాలనుకునే అన్ని resources, అన్ని Regions మరియు accounts లేదా OUs లో, ఒకే tags ఉపయోగిస్తున్నాయని ధృవీకరించండి. అవి ఉపయోగించకపోతే, మీరు వాటిని AWS resource group కు జోడించి ఆ group ను target చేయవచ్చు. మరింత సమాచారం కోసం, *AWS Resource Groups and Tags User Guide* లో [What are resource groups?](https://docs.aws.amazon.com/ARG/latest/userguide/) చూడండి.
1. Automation central account గా configure చేయాలనుకునే account లో sign in చేయండి.
1. కింది IAM roles సృష్టించడానికి ఈ topic లోని [Setting up management account permissions for multi-Region and multi-account automation](https://docs.aws.amazon.com/systems-manager/latest/userguide/running-automations-multiple-accounts-regions.html) procedure ఉపయోగించండి:
1. **AWS-SystemsManager-AutomationAdministrationRole** - ఈ role వినియోగదారుకు బహుళ accounts మరియు OUs లో automations అమలు చేయడానికి permission ఇస్తుంది.
1. **AWS-SystemsManager-AutomationExecutionRole** - ఈ role వినియోగదారుకు target చేయబడిన accounts లో automations అమలు చేయడానికి permission ఇస్తుంది.
1. Runbook, Regions మరియు మీరు automation అమలు చేయాలనుకునే accounts లేదా OUs ఎంచుకోండి.

**Multi-account/Region Automation కోసం పరిగణనలు:**

* Resource Groups ను target చేసినప్పుడు, resource group ప్రతి target account మరియు Region లో ఉండాలి
  * Resource group పేరు ప్రతి target account మరియు Region లో ఖచ్చితంగా ఒకే విధంగా ఉండాలి
* Automations OUs ద్వారా recursively అమలు కావు
  * Automation accounts కలిగి ఉన్న OUs ను మాత్రమే target చేయగలదు
* Multi-account/Region కోసం అవసరమైన IAM roles ను CloudFormation లేదా IaC ఉపయోగించి సృష్టించమని customers కు సిఫార్సు చేస్తున్నాము

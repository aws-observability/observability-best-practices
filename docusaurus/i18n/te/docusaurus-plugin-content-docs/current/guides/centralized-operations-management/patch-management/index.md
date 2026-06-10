---
sidebar_position: 5
---
# Patch Management

[Patch Manager](https://docs.aws.amazon.com/systems-manager/latest/userguide/systems-manager-patch.html), Systems Manager యొక్క ఒక సామర్థ్యం, భద్రత సంబంధిత updates తో managed nodes ను patching చేయడం ప్రక్రియను automate చేయడానికి మిమ్మల్ని అనుమతిస్తుంది. మీరు Amazon EC2 instances, edge devices, మరియు on-premises servers మరియు virtual machines (VMs), ఇతర cloud environments లోని VMs తో సహా patch చేయవచ్చు.

## Patching కష్టంగా మారేది ఏమిటి?

![What makes patching hard?](/img/cloudops/guides/centralized-operations-management/patch-management/what-makes-patching-hard.png "What makes patching hard?")

Patching వ్యూహాన్ని రూపొందించడం సంస్థలకు సవాలుగా ఉంటుంది. మొదటగా, patch management అనేది కంపెనీ environment లోని ప్రతి node లో install చేయబడిన applications మరియు operating systems తో సహా patchable software యొక్క ప్రస్తుత మరియు పూర్తి inventory ను కలిగి ఉండటం మీద ఆధారపడి ఉంటుంది. రెండవది, enterprise patch management వ్యక్తులు మరియు infrastructure రెండు పరంగా కొన్ని resources ను overload చేయవచ్చు.

తదుపరి, patches install చేయడం side effects కు కారణం కావచ్చు. సంస్థలు జాగ్రత్తగా ఉండేలా చేసే మరొక సాధారణ సవాలు ఏమిటంటే, patches install చేయడం వల్ల కలిగే అనుకోని లేదా ఊహించని సమస్యలు. ఒక node ను పరిశీలించి ఒక నిర్దిష్ట patch వాస్తవంగా అమలులోకి వచ్చిందా అనేది నిర్ధారించడం ఆశ్చర్యకరంగా కష్టంగా ఉంటుంది. ఈ సవాలు ఒక node మీద ఎదురవ్వవచ్చు, లేదా మీరు దానిని మొత్తం సంస్థ fleet of nodes మరియు operating systems అంతటా విస్తరిస్తే, ఆ సవాలు యొక్క scale చాలా త్వరగా చాలా భారంగా మారవచ్చు.

## విషయాలను మెరుగుపరచడం

![Prioritizing patching](/img/cloudops/guides/centralized-operations-management/patch-management/prioritize.png "Prioritizing patching")

కొన్ని సాధారణ సవాళ్లను పరిష్కరించడంలో సహాయపడటానికి, మీరు ప్రాధాన్యత ఇవ్వాల్సిన patches యొక్క చిన్న subset ను గుర్తించడానికి classifications ద్వారా నిర్దిష్ట patches కు ప్రాధాన్యత ఇవ్వడంతో ప్రారంభించండి. దీని కోసం, మీ వ్యాపారానికి ఏ workloads లేదా applications అత్యంత క్లిష్టమైనవో నిర్ణయించండి మరియు ఆ workloads కు ఏ patches అత్యంత ముఖ్యమైన తేడాను చేస్తాయో నిర్ణయించండి. ఉదాహరణకు, email servers, databases, web applications, customer facing digital properties, మొదలైనవి.

![How it works](/img/cloudops/guides/centralized-operations-management/patch-management/how-it-works.png "How it works")

అక్కడ నుండి మీరు ప్రతి workload కోసం [patch baselines](https://docs.aws.amazon.com/systems-manager/latest/userguide/patch-manager-patch-baselines.html) సృష్టించవచ్చు, ఇది patch scan operations చేసేటప్పుడు missing గా గుర్తించబడే applicable patches ను నిర్ణయించడంలో సహాయపడుతుంది. Scanning మీరు స్థాపించిన baselines కు వ్యతిరేకంగా compliance స్థాయిని నిర్ణయించడంలో మీకు సహాయపడుతుంది.

మీరు routine maintenance periods సమయంలో updates apply చేయడానికి recurring patch install operations ను schedule చేయడం ప్రారంభించవచ్చు లేదా emergent patch releases సమయంలో on-demand updates install చేయవచ్చు. Patch installation తర్వాత, Patch Manager అందించిన patch compliance data ఉపయోగించి ఫలితాన్ని నిర్ధారించవచ్చు.

## Patching సమయంలో OS లో ఏమి జరుగుతుంది?

కస్టమర్‌ల నుండి ఒక సాధారణ ప్రశ్న ఏమిటంటే Patch Manager patches ను ఎలా scan లేదా install చేస్తుంది? Patch operation ప్రారంభించినప్పుడు, scheduled లేదా ad-hoc అయినా, operation Systems Manager endpoints లో queue చేయబడుతుంది. SSM agent scan లేదా install చేయడానికి command ను retrieve చేస్తుంది. SSM agent patch baseline approval rules ను retrieve చేసి, local OS package manager ఉపయోగించి scan లేదా install ను ప్రారంభిస్తుంది, అంటే Windows Update, yum, apt-get. Operation పూర్తయిన తర్వాత, SSM agent patch compliance data ను Patch Manager కు తిరిగి report చేస్తుంది.

![Patch Management OS Patching](/img/cloudops/guides/centralized-operations-management/patch-management/os-patching.png "Patch Management OS Patching")

### Patch source కు connectivity

మీ managed nodes కు Internet కు direct connection లేకపోతే మరియు మీరు VPC endpoint తో Amazon Virtual Private Cloud (Amazon VPC) ను ఉపయోగిస్తుంటే, nodes కు source patch repositories (repos) కు access ఉందని మీరు నిర్ధారించుకోవాలి.

Linux nodes లో, patch updates సాధారణంగా node లో configured చేయబడిన remote repos నుండి download చేయబడతాయి. అందువల్ల, patching నిర్వహించబడటానికి node repos కు connect అవ్వగలగాలి. Windows Server managed nodes Windows Update Catalog లేదా Windows Server Update Services (WSUS) కు connect అవ్వగలగాలి. మరింత సమాచారం కోసం, [Patch Manager prerequisites](https://docs.aws.amazon.com/systems-manager/latest/userguide/patch-manager-prerequisites.html) చూడండి.

## Patch criteria నిర్వచించడం

Patch Manager ప్రతి Patch Manager మద్దతు ఇచ్చే operating system కోసం [predefined patch baselines](https://docs.aws.amazon.com/systems-manager/latest/userguide/sysman-patch-baselines.html) అందిస్తుంది. మీరు ఈ baselines ను ప్రస్తుతం configured చేయబడినట్లు ఉపయోగించవచ్చు (మీరు వాటిని customize చేయలేరు) లేదా మీ స్వంత custom patch baselines సృష్టించవచ్చు. Custom patch baselines మీ environment కోసం ఏ patches approved లేదా rejected అనేదానిపై మీకు ఎక్కువ control ను అనుమతిస్తుంది.

Custom patch baseline లో మీరు:

* ఏ patches approved అనేది నిర్వచించవచ్చు
* Cutoffs కోసం auto-approval delays ఉపయోగించవచ్చు
* Patch exceptions నిర్వచించవచ్చు
* Linux కోసం custom patch repositories నిర్వచించవచ్చు
* బహుళ operating system versions కోసం patch criteria నిర్వచించవచ్చు

## Patching యొక్క వివిధ రకాలు

మీ patching solution తో మీరు తీసుకోగల రెండు సాధారణ విధానాలు ఉన్నాయి: centralized లేదా decentralized.

| Centralized Patching | Decentralized Patching |
| -------------------- | ---------------------- |
| Central team patch scan operations ను deploy చేస్తుంది | Application / account owner కు ఎక్కువ బాధ్యత బదిలీ చేస్తుంది |
| Central team patch install operations ను deploy చేస్తుంది | Central team patch scan operations deploy చేస్తుంది & compliance reporting ఇంకా centralized గా ఉంటుంది |
| Schedule మరియు operations చేయడంలో పరిమిత flexibility | Owners patch install operations కు బాధ్యత & central team building blocks అందించగలరు, అంటే AWS Service Catalog ద్వారా |
| Central team సాధారణంగా troubleshooting కు బాధ్యత | Owner install కోసం schedule నిర్వచించడానికి అనుమతిస్తుంది |
| అత్యధికంగా regulated లేదా secured environments లో సాధారణం | Central team కు on-demand patch install override ఉండాలి |

### Multi-account organizations కోసం centralized patching solutions ఉదాహరణ

**Option 1:** [Quick Setup Patch Policy configurations](https://docs.aws.amazon.com/systems-manager/latest/userguide/quick-setup-patch-manager.html) ఉపయోగించి centralized patching solution స్థాపించవచ్చు. Patch policies కస్టమర్‌లకు AWS accounts మరియు AWS Regions అంతటా బహుళ patch baselines కోసం scan మరియు schedule patch installation అనుమతిస్తాయి. మరింత సమాచారం కోసం, [Patching across an AWS Organization - Patch Policies](/guides/centralized-operations-management/patch-management/#patching-across-an-aws-organization---patch-policies) చూడండి.

![Patch Management Centralized Patching Option 1](/img/cloudops/guides/centralized-operations-management/patch-management/patch-policy-architecture.png "Patch Management Centralized Patching Option 1")

**Option 2:** Centralized solution కోసం మరొక ఎంపిక ఏమిటంటే [Amazon EventBridge](https://aws.amazon.com/eventbridge/), [AWS Lambda](https://aws.amazon.com/lambda/), మరియు [Systems Manager Automation](https://docs.aws.amazon.com/systems-manager/latest/userguide/systems-manager-automation.html) కలయికను ఉపయోగించి multi-account మరియు multi-Region patching operation ను schedule చేయడం. మరింత సమాచారం కోసం, [Scheduling centralized multi-account and multi-Region patching with AWS Systems Manager Automation](https://aws.amazon.com/blogs/mt/scheduling-centralized-multi-account-multi-region-patching-aws-systems-manager-automation/) చూడండి.

![Patch Management Centralized Patching Option 2](/img/cloudops/guides/centralized-operations-management/patch-management/scheduled-mamr-patching-automation.png "Patch Management Centralized Patching Option 2")

### Multi-account organizations కోసం decentralized self-service patching solution ఉదాహరణ

వివిధ application owners కు patch operations, patch timing, patching frequency, మరియు lower environments (DEV లేదా UAT) లో patches test చేయడంలో flexibility పరంగా వేర్వేరు అవసరాలు ఉండవచ్చు. [AWS Service Catalog](https://aws.amazon.com/servicecatalog/) ఉపయోగించి, central teams self-service patching కోసం building blocks గా పనిచేసే products సృష్టించగలరు. Application/account owners ఈ products ను తమ environment లో deploy చేయవచ్చు మరియు schedule వంటి కొన్ని parameters మాత్రమే అందించాలి, తమంతట తాముగా solution నిర్మించాల్సిన అవసరం లేకుండా. మరింత సమాచారం కోసం, [A self-service patching solution for multi-account organizations](https://aws.amazon.com/blogs/mt/a-self-service-patching-solution-for-multi-account-organisations/) చూడండి.

![Self-service patching using Service Catalog](/img/cloudops/guides/centralized-operations-management/patch-management/self-service-patching.png "Self-service patching using Service Catalog")

## Patch in place vs Rehydration

Rehydration (repaving, refreshing) అనేది తాజా patches install చేయబడిన కొత్త servers ను spin up చేయడం మరియు పాత nodes ను decommission చేయడం ప్రక్రియ. Auto Scaling Group లోని EC2 instances, container cluster (ECS / EKS) లోని managed node groups, మరియు application workload అవసరాలతో preconfigure చేయబడిన AMIs కోసం ఇది సాధారణ practice.

| Patch in place | Rehydration |
| -------------- | ----------- |
| Rehydration కంటే ఎక్కువ frequency తో నిర్వహించబడుతుంది (వారానికి, రెండు వారాలకు ఒకసారి) | సాధారణంగా నెలవారీ లేదా త్రైమాసికంగా నిర్వహించబడుతుంది. కొందరు కస్టమర్‌లు ప్రతి 2 వారాలకు నిర్వహిస్తారు! |
| సులభంగా replace చేయలేని (mutable) long-standing nodes కోసం ideal | Post-launch configuration ఎక్కువగా అవసరం లేని workloads కోసం ideal (immutable) |
| Patch install workflow కు backups తీసుకోవడం అవసరం కావచ్చు | Auto Scaling groups తో integrate చేయడానికి EC2 Image Builder వంటి services ఉపయోగించండి |
| | Patch in place చేయడానికి ఇంకా ఒక mechanism అవసరం కావచ్చు. ఉదాహరణకు, zero-day vulnerability patch విడుదలైతే కానీ nodes తదుపరి rehydration cycle వరకు replace చేయలేకపోతే |

మీ environment లో application workload ను బట్టి patch in place మరియు rehydration రెండు methods అవసరం కావచ్చు.

## AWS Organization అంతటా Patching - Patch Policies

AWS Organization లో patching అవసరాలను standardize చేయడానికి, మీరు [Quick Setup లో patch policies](https://docs.aws.amazon.com/systems-manager/latest/userguide/patch-manager-policies.html) ఉపయోగించవచ్చు. మీరు బహుళ operating systems, బహుళ accounts మరియు Regions అంతటా మొత్తం organization కు patch policy apply చేయవచ్చు మరియు target managed nodes కోసం resource compliance review చేయవచ్చు.

బహుళ accounts అంతటా Quick Setup ఉపయోగించడం మీ organization consistent configurations నిర్వహిస్తుందని నిర్ధారిస్తుంది. అదనంగా, Quick Setup configuration drift కోసం క్రమానుగతంగా తనిఖీ చేస్తుంది మరియు దానిని remediate చేయడానికి ప్రయత్నిస్తుంది. Quick Setup ద్వారా ఎంచుకున్న వాటితో విరుద్ధంగా ఒక user ఏదైనా service లేదా feature కు మార్పు చేసినప్పుడు configuration drift సంభవిస్తుంది.

![Patch Policy architecture](/img/cloudops/guides/centralized-operations-management/patch-management/patch-policy-detailed-architecture.png "Patch Policy architecture")

### ఇది ఎలా పనిచేస్తుంది

1. మీరు Quick Setup ఉపయోగించి patch policy సృష్టిస్తారు మరియు ఎంచుకున్న parameters CloudFormation కు పంపబడతాయి.
1. CloudFormation నిర్వచించిన parameters మరియు నిర్వచించిన target accounts మరియు Regions తో stack set సృష్టిస్తుంది. ఇది deployment సమయంలో Quick Setup ద్వారా generate చేయబడుతుంది.
1. CloudFormation ప్రతి target account మరియు Region లో stack instances సృష్టిస్తుంది.
1. Stack instances నిర్వచించిన patch scan కోసం [State Manager associations](https://docs.aws.amazon.com/systems-manager/latest/userguide/systems-manager-state.html) మరియు ఎంచుకుంటే patch installation కోసం association సృష్టిస్తాయి. ఈ associations మీరు patch policy సృష్టించేటప్పుడు అందించిన schedules ఉపయోగించి apply చేయబడతాయి.
1. Management account లో, State Manager association రోజుకు ఒకసారి Lambda function ను invoke చేయడానికి Automation runbook ప్రారంభిస్తుంది.
1. Lambda function నిర్దిష్ట patch baselines ను S3 bucket లో JSON file గా store చేస్తుంది. అదనంగా, Lambda function Quick Setup లో నిర్దిష్ట custom patch baselines ను ఏవైనా మార్పుల కోసం evaluate చేస్తుంది. Custom patch baselines కు మార్పులు చేయబడితే, Lambda function S3 bucket లో JSON file ను update చేస్తుంది.
1. Managed nodes patching operations సమయంలో updates scan లేదా install చేయడానికి central patch baseline JSON file ను pull చేస్తాయి.

**Note:** ప్రస్తుతం, Quick Setup ద్వారా Patch Policies deploy చేయడానికి మీరు మీ AWS Organization లో management account ఉపయోగించాలి. Quick Setup బయట Patch Policies deploy చేయడానికి, [How to deploy Patch Policies outside of Quick Setup](https://catalog.us-east-1.prod.workshops.aws/workshops/7c0ea253-6462-41cd-af76-3850c92458fa/en-US) సందర్శించండి.

## On-demand patching

మీ routine patching cycles బయట nodes ను patch చేయాల్సిన సమయాలు ఉన్నాయి, ఉదాహరణకు emergent vulnerability scenarios లో.

**Option 1:** [Patch now](https://docs.aws.amazon.com/systems-manager/latest/userguide/patch-manager-patch-now-on-demand.html) (*single-account/Region*)

* Patch Manager లో **Patch now** option ఉపయోగించి, మీరు on-demand patching operations ను త్వరగా run చేయవచ్చు. అయితే, **Patch now** ఒక సమయంలో ఒకే AWS account మరియు Region లో patching ను మాత్రమే అనుమతిస్తుంది. ఇది patch policies లో నిర్వచించిన patch baselines ఉపయోగించలేదు. మీ patch policy baselines నుండి భిన్నంగా approval rules ఆధారంగా patch scan లేదా applicable patches install చేసే వేరే baseline మీరు సృష్టించవచ్చు.

**Option 2:** Automation *(multi-account/Region)*

* Accounts మరియు Regions అంతటా on-demand patching operation నిర్వహించడానికి, మీరు [running automations in multiple AWS Regions and accounts](https://docs.aws.amazon.com/systems-manager/latest/userguide/running-automations-multiple-accounts-regions.html) మద్దతు ఇచ్చే Automation ను ఉపయోగించవచ్చు. Actions నిర్వహించడానికి target accounts లో deploy చేయబడిన IAM roles ను మీరు ఉపయోగించవచ్చు. మీరు Patch Policies లేదా stand alone patching అవసరాలతో integrate చేయవచ్చు.

## Vulnerability management మరియు remediation integrate చేయడం

[Amazon Inspector](https://aws.amazon.com/inspector) Amazon EC2 instances మరియు Amazon Elastic Container Registry (Amazon ECR) లో store చేయబడిన container images మీద నిరంతర vulnerability scans అందిస్తుంది. ఈ scans software vulnerabilities మరియు unintended network exposure ను assess చేస్తాయి. Amazon Inspector EC2 instances యొక్క software application inventory సేకరించడానికి Systems Manager (SSM) agent ఉపయోగిస్తుంది. తర్వాత, Inspector ఈ data ను scan చేసి software vulnerabilities ను గుర్తిస్తుంది, ఇది vulnerability management లో ఒక కీలక అడుగు.

Amazon Inspector గుర్తించిన vulnerabilities ను resolve చేయడానికి vulnerabilities యొక్క severity ఆధారంగా మీరు regular patching operations నిర్వహించాలి. SSM agent ఉపయోగించి Systems Manager ద్వారా managed nodes ను patch చేసే ప్రక్రియను automate చేయడానికి మీరు AWS Systems Manager Patch Manager ఉపయోగించవచ్చు.

Patches అందుబాటులో ఉన్న zero-day లేదా ఇతర high మరియు critical severity vulnerabilities ఉండవచ్చు. అయితే, వాటిని remediate చేయడానికి regular patching schedule కోసం మీరు వేచి ఉండకూడదనుకోవచ్చు. ఈ సందర్భాలలో, patching కోసం on-demand mechanisms ఉండాలి.

మరింత తెలుసుకోవడానికి, చూడండి:

* [AWS on Air: LockDown - The Magical World of Vulnerability Management](https://www.linkedin.com/events/awsonair-lockdown-themagicalwor7061737757479481344/comments/)
* [Automate vulnerability management and remediation in AWS using Amazon Inspector and AWS Systems Manager – Part 1](https://aws.amazon.com/blogs/mt/automate-vulnerability-management-and-remediation-in-aws-using-amazon-inspector-and-aws-systems-manager-part-1/)
* [Automate vulnerability management and remediation in AWS using Amazon Inspector and AWS Systems Manager – Part 2](https://aws.amazon.com/blogs/mt/automate-vulnerability-management-and-remediation-in-aws-using-amazon-inspector-and-aws-systems-manager-part-2/)

![Automate vulnerability management and remediation](/img/cloudops/guides/centralized-operations-management/patch-management/vulnerability-remediation-architecture.png "Automate vulnerability management and remediation")

## Patch compliance review చేయడం

Patch Manager dashboard ప్రస్తుత AWS account మరియు Region లో patch compliance యొక్క snapshot అందిస్తుంది. Compliance reporting nodes కోసం patch compliance నిర్ణయించడానికి మిమ్మల్ని అనుమతిస్తుంది. Fleet Manager console ఉపయోగించి ఏ patches install చేయబడ్డాయి మరియు ఆ patches యొక్క severity మరియు criticality ఏమిటి అనే దాని గురించి మరిన్ని వివరాలను మీరు review చేయవచ్చు.

ఈ views ప్రస్తుత AWS account మరియు Region కు specific అయినప్పటికీ, మీరు మొత్తం AWS Organization కోసం centralized patch compliance reporting సృష్టించవచ్చు.

## AWS Organization లో end-to-end patch management మరియు inventory reporting సృష్టించడం

:::tip
మీకు తెలుసా, multi-step manual process ను కొన్ని సాధారణ prompts గా తగ్గించడానికి మీరు [Amazon Quick Suite](https://aws.amazon.com/quicksuite/) ఉపయోగించవచ్చు, ఇది మీకు insightful patching compliance మరియు inventory visualizations త్వరగా generate చేయడానికి అనుమతిస్తుంది. AI-powered సామర్థ్యాలు dynamic dashboards సృష్టించడంలో ఎలా సహాయపడతాయో, విలువైన సమయాన్ని ఆదా చేస్తూ accuracy నిర్వహించడంలో మరియు మీ organization యొక్క patching status పై real-time insights అందించడంలో ఈ blog లో కనుగొనండి: [Building enterprise patching and inventory dashboards using Amazon Quick Suite](https://aws.amazon.com/blogs/mt/building-enterprise-patching-and-inventory-dashboards-using-amazon-q-in-amazon-quicksuite/).
:::

మీ AWS Organization అంతటా patch compliance మీద report సృష్టించడానికి, మీరు మీ అన్ని managed nodes నుండి సేకరించిన inventory data ను ఒకే Amazon S3 bucket కు పంపడానికి Systems Manager [resource data syncs](https://docs.aws.amazon.com/systems-manager/latest/userguide/inventory-create-resource-data-sync.html) ఉపయోగించవచ్చు. కొత్త inventory data సేకరించినప్పుడు resource data sync స్వయంచాలకంగా centralized data ను update చేస్తుంది.

[AWS Glue crawler](https://docs.aws.amazon.com/glue/latest/dg/add-crawler.html) ఉపయోగించి, మీరు S3 లోని patch compliance data నుండి స్వయంచాలకంగా databases మరియు tables సృష్టించవచ్చు మరియు తర్వాత [Amazon Athena](https://aws.amazon.com/athena/) తో patch compliance data query చేయవచ్చు. ఈ solution inventory మరియు patch compliance data visualize చేయడానికి [Amazon QuickSight](https://aws.amazon.com/quicksight/) ఉపయోగిస్తుంది, అయితే, S3 bucket నుండి data pull చేయగల ఏదైనా BI లేదా analytics tool ను మీరు ఉపయోగించవచ్చు.

**Note:** మీ nodes నుండి inventory data సేకరించాలనుకునే ప్రతి account మరియు Region లో మీరు resource data sync సృష్టించాలి.

![End-to-end patch management reporting](/img/cloudops/guides/centralized-operations-management/patch-management/architecture-diagram-ssm-org-reporting.png "End-to-end patch management reporting")

1. ప్రతి account/Region లో Systems Manager resource data syncs సృష్టించండి.
1. ఒకే Amazon S3 Bucket లో patch compliance data ను centrally aggregate చేయండి.
1. AWS Glue Crawler ఉపయోగించి స్వయంచాలకంగా database మరియు tables సృష్టించండి.
1. Amazon Athena ఉపయోగించి patch లేదా inventory data query చేయండి.
1. Amazon QuickSight ఉపయోగించి patch compliance visualize చేయండి.

## AWS Systems Manager Inventory Metadata అర్థం చేసుకోవడం

Resource data syncs on-demand actions (Instances register లేదా terminate చేయడం / patch scan లేదా install నిర్వహించడం), scheduled actions (Software inventory సేకరించడం, custom inventory metadata సేకరించడం, patch install నిర్వహించడం, మరియు Chef InSpec ఉపయోగించి compliance evaluate చేయడం) ఆధారంగా S3 buckets కు data push చేస్తాయి.

![Inventory metadata](/img/cloudops/guides/centralized-operations-management/patch-management/resource-data-sync-inventory-metadata.png "Inventory metadata")

Source: [Understanding AWS Systems Manager Inventory Metadata](https://aws.amazon.com/blogs/mt/understanding-aws-systems-manager-inventory-metadata/)

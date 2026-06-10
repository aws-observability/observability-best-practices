---
sidebar_position: 1
---
# కేంద్రీకృత ప్యాచ్ సమ్మతి నివేదికలు

## ప్యాచ్ సమ్మతి అంటే ఏమిటి?

Patch compliance అనేది organizational policies ప్రకారం అన్ని computing resources కు latest security updates మరియు bug fixes install చేయబడి ఉన్నాయని ensure చేసే process. మీ patch baseline లో define చేయబడిన అన్ని required patches విజయవంతంగా apply చేయబడినప్పుడు system "patch compliant" గా పరిగణించబడుతుంది.

Modern cloud environments లో multiple AWS accounts మరియు regions span చేస్తూ, decentralized patch management visibility gaps, inconsistent reporting, delayed responses to vulnerabilities, complex audit processes, మరియు teams అంతటా duplicated effort తో సహా significant challenges సృష్టిస్తుంది.

Centralized patch compliance reporting అన్ని accounts మరియు regions నుండి data ను single location లో consolidate చేయడం ద్వారా ఈ challenges address చేస్తుంది, మీ security posture యొక్క comprehensive view అందిస్తుంది.

AWS Systems Manager patching processes automate చేయడానికి Patch Manager, compliance data ను central S3 bucket లోకి aggregate చేయడానికి [resource data syncs](https://docs.aws.amazon.com/systems-manager/latest/userguide/inventory-create-resource-data-sync.html), మరియు data transform, query, మరియు visualize చేయడానికి AWS Glue, Amazon Athena, మరియు Amazon QuickSight వంటి analytics services ద్వారా ఈ centralization కు foundation అందిస్తుంది.

:::tip
Resource data sync JSON file రూపంలో inventory మరియు patch compliance metadata అందిస్తుంది. Athena మరియు QuickSight ఉపయోగించడానికి alternative గా, S3 bucket నుండి data pull చేయగల ఏదైనా BI లేదా analytics tool ఉపయోగించవచ్చు.
:::

## ఉద్దేశ్యం

ఈ recipe ఉద్దేశ్యం centralized patch compliance reporting కోసం అవసరమైన resources provision చేయడానికి ఉపయోగించగల sample CloudFormation templates అందించడం. ఈ recipe patch scan లేదా install operations deploy చేయడం cover చేయదు.

Managed nodes patch చేయడానికి prepare ఎలా చేయాలనే దాని గురించి మరింత సమాచారం కోసం, [Patching managed nodes using AWS Systems Manager and tagging](/guides/centralized-operations-management/patch-nodes-using-tags/) చూడండి.

## ముందస్తు అవసరాలు

Deployment ప్రారంభించడానికి ముందు, మీ దగ్గర ఉన్నాయని ensure చేయండి:

* AWS Organizations setup: properly configured AWS Organization
* Managed nodes configured: Amazon EC2 instances, AWS IoT Greengrass core devices, on-premises servers Systems Manager managed nodes గా ఉండాలి
* Patch operations implemented: minimum గా, patch scan operation configured మరియు కనీసం ఒకసారి execute అయి ఉండాలి
* IAM permissions: CloudFormation templates deploy చేయడానికి మరియు required resources create చేయడానికి appropriate permissions
* Amazon QuickSight: QuickSight ఉపయోగించి patch compliance information visualize చేయడానికి, [sign up for QuickSight](https://docs.aws.amazon.com/quicksight/latest/user/signing-up.html) చేయాలి

## ఆర్కిటెక్చర్ అవలోకనం

### Central reporting account

ఈ క్రింది diagram లో, **Central Reporting** account అనేది patch మరియు inventory metadata store చేయడానికి మరియు querying లేదా visualization కోసం అంకితమైన మీ AWS Organization లోని AWS account.

:::warning
**Central reporting account** గా [AWS Organization management account](https://docs.aws.amazon.com/managedservices/latest/userguide/management-account.html) ఉపయోగించడం **recommend చేయబడదు**.
:::

![Central reporting account కోసం ఆర్కిటెక్చర్](/img/cloudops/recipes/central-reporting/architecture-diagram-reporting-account.png "Central reporting account కోసం ఆర్కిటెక్చర్")

1. Glue crawler రోజుకు ఒకసారి run అయి resource data sync provide చేసిన metadata host చేసే S3 bucket crawl చేస్తుంది.
2. Glue crawler S3 bucket లోని metadata ఆధారంగా database మరియు tables update చేస్తుంది.
3. Glue crawler run complete అయిన తర్వాత, EventBridge కు event send అవుతుంది.
4. EventBridge rule Lambda function invoke చేస్తుంది.
5. Lambda function AWS:InstanceInformation table కోసం duplicative column remove చేస్తుంది.
6. Athena మీరు run చేసే queries ఆధారంగా Glue database మరియు tables query చేస్తుంది.
7. (Optional గా) Patch compliance information visualize చేయడానికి QuickSight dashboard create చేయవచ్చు.

### Member account(s)/Region(s) with managed nodes

![AWS Organization resource data sync కోసం ఆర్కిటెక్చర్](/img/cloudops/recipes/central-reporting/architecture-diagram-ssm-org-resource-data-sync.png "AWS Organization resource data sync కోసం ఆర్కిటెక్చర్")

1. Delegated administrator account లోని CloudFormation StackSet required resources create చేయడానికి target AWS accounts/Regions లో stack instances create చేస్తుంది.
2. Stack instance IAM service role, Lambda function, మరియు custom CloudFormation resource create చేస్తుంది.
3. Lambda function AWS Organizations కోసం Systems Manager resource data sync create చేస్తుంది.
4. Resource data sync inventory మరియు patch compliance metadata ను central reporting account లో specified S3 bucket కు send చేస్తుంది.

## Deployment దశలు

### Phase 1: Central account setup

#### Athena కోసం Sample CloudFormation template

[Sample CloudFormation template for central reporting using Athena](https://github.com/aws-samples/cloud-operations-best-practices/blob/main/cloud-operations-best-practices/static/cfn-templates/patch-reporting/patch-reporting.yaml)

#### Central reporting account లో Athena కోసం CloudFormation stack deploy చేయడం

1. [Sample CloudFormation template](https://github.com/aws-samples/cloud-operations-best-practices/blob/main/cloud-operations-best-practices/static/cfn-templates/patch-reporting/patch-reporting.yaml) మీ local machine కు download చేయండి.
2. Central reporting account మరియు Region లో, [AWS CloudFormation console](https://console.aws.amazon.com/cloudformation/home) కు navigate చేయండి.
3. Left navigation pane లో, **Stacks** choose చేసి, **Create stack** choose చేయండి.
4. Template upload చేసి deploy చేయండి.

#### Amazon QuickSight visualization కోసం Sample CloudFormation template

[Sample CloudFormation template for Amazon QuickSight visualization](https://github.com/aws-samples/cloud-operations-best-practices/blob/main/cloud-operations-best-practices/static/cfn-templates/patch-reporting/quicksight.yaml)

### Phase 2: Member account configuration

#### Organization resource data sync కోసం Sample CloudFormation template

[Sample CloudFormation template for organization resource data sync](https://github.com/aws-samples/cloud-operations-best-practices/blob/main/cloud-operations-best-practices/static/cfn-templates/patch-reporting/organization-resource-data-sync.yaml)

## Phase 3: Verification మరియు Testing

### Resource data sync S3 bucket లో metadata verify చేయడం

Central reporting account లో, [Amazon S3 console](https://console.aws.amazon.com/s3/home) కు navigate చేసి CloudFormation ద్వారా create చేయబడిన S3 bucket select చేయండి.

### Athena ఉపయోగించి Query చేయడం

1. [Central reporting AWS account](#central-reporting-account) లో login అవ్వండి.
2. [Amazon Athena console](https://console.aws.amazon.com/athena/home) open చేయండి.
3. **Workgroup** కోసం, **patch-workgroup** choose చేయండి.
4. **Saved queries** tab choose చేసి sample queries చూడండి.
5. Saved query select చేసి **Run** choose చేయండి.

![Athena query results](/img/cloudops/recipes/central-reporting/athena-query-results.png "Athena query results for QueryNonCompliantPatch")

## QuickSight ఉపయోగించి Patch compliance visualize చేయడం

QuickSight visuals create చేయడానికి, ఈ క్రింది topics లో procedures follow చేయండి:

1. [Part 1: Managed nodes కోసం metadata ఆధారంగా QuickSight visuals create చేయడం](https://catalog.workshops.aws/getting-started-with-com/en-US/advanced-workshops/organization-patch-reporting/create-quicksight-visuals-and-dashboard)
2. [Part 2: Patch Compliance సమాచారం కోసం AWS QuickSight Visuals create చేయడం](https://catalog.workshops.aws/getting-started-with-com/en-US/advanced-workshops/organization-patch-reporting/create-quicksight-visuals-for-patch-compliance)

## Deploy చేయబడిన resources clean-up

:::warning
ఈ recipe లోని sample CloudFormation templates central reporting account కోసం CloudFormation stack delete చేసినప్పుడు S3 buckets contents delete చేస్తాయి.
:::

## తదుపరి దశలు

మీ patch operations మరియు reporting mechanisms మెరుగుపరచడానికి reference గా ఉపయోగించగల సంబంధిత AWS blogs:

* [Automate Systems Manager patching reports via email and Slack notifications in an AWS Organization](https://aws.amazon.com/blogs/mt/automate-systems-manager-patching-reports-via-email-and-slack-notifications-in-an-aws-organization/)
* [Troubleshooting AWS Systems Manager patching made easy with Amazon Bedrock's automated recommendations](https://aws.amazon.com/blogs/mt/troubleshooting-aws-systems-manager-patching-made-easy-with-amazon-bedrocks-automated-recommendations/)
* [Visualize AWS Systems Manager Patch Manager information using Amazon QuickSight](https://aws.amazon.com/blogs/mt/visualize-aws-systems-manager-patch-manager-information-using-amazon-quicksight/)

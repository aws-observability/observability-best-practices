---
sidebar_position: 1
---
# केंद्रीकृत पैच अनुपालन रिपोर्टिंग

## पैच अनुपालन क्या है?

पैच अनुपालन यह सुनिश्चित करने की प्रक्रिया है कि सभी कंप्यूटिंग रिसोर्सेज में संगठनात्मक नीतियों के अनुसार नवीनतम सुरक्षा अपडेट और बग फिक्स इंस्टॉल हैं। एक सिस्टम को "पैच अनुपालित" माना जाता है जब आपकी patch baseline में परिभाषित सभी आवश्यक patches सफलतापूर्वक लागू किए गए हों। गैर-अनुपालित सिस्टम में महत्वपूर्ण सुरक्षा अपडेट गायब हो सकते हैं, जो संभावित रूप से आपके संगठन को सुरक्षा कमजोरियों के प्रति उजागर करते हैं।

कई AWS accounts और regions में फैले आधुनिक क्लाउड वातावरण में, विकेंद्रीकृत पैच प्रबंधन दृश्यता अंतराल, असंगत रिपोर्टिंग, कमजोरियों के प्रति विलंबित प्रतिक्रियाएं, जटिल audit प्रक्रियाएं, और टीमों में दोहराए गए प्रयास सहित महत्वपूर्ण चुनौतियां बनाता है।

केंद्रीकृत पैच अनुपालन रिपोर्टिंग सभी accounts और regions से डेटा को एक ही स्थान पर समेकित करके इन चुनौतियों को संबोधित करती है, जो आपकी सुरक्षा स्थिति का एक व्यापक दृश्य प्रदान करती है।

AWS Systems Manager इस केंद्रीकरण की नींव प्रदान करता है - patching प्रक्रियाओं को स्वचालित करने के लिए Patch Manager, compliance data को एक central S3 bucket में एकीकृत करने के लिए [resource data syncs](https://docs.aws.amazon.com/systems-manager/latest/userguide/inventory-create-resource-data-sync.html), और डेटा को transform, query और visualize करने के लिए AWS Glue, Amazon Athena, और Amazon QuickSight जैसी analytics सेवाएं।

:::tip
Resource data sync JSON फ़ाइल के रूप में inventory और patch compliance metadata प्रदान करता है। Athena और QuickSight के विकल्प के रूप में, आप किसी भी BI या analytics tool का उपयोग कर सकते हैं जो S3 bucket से डेटा pull कर सके।
:::

## उद्देश्य

इस recipe का उद्देश्य sample CloudFormation templates प्रदान करना है जिनका उपयोग केंद्रीकृत पैच अनुपालन रिपोर्टिंग के लिए आवश्यक resources प्रोविज़न करने के लिए किया जा सकता है। यह recipe patch scan या install operations तैनात करना कवर नहीं करती।

अधिक जानकारी के लिए [Patching managed nodes using AWS Systems Manager and tagging](/guides/centralized-operations-management/patch-nodes-using-tags/) देखें।

## पूर्वापेक्षाएं

Deployment शुरू करने से पहले, सुनिश्चित करें कि आपके पास:

* AWS Organizations setup: एक properly configured AWS Organization जिसमें management account और member accounts हों।
* Managed nodes configured: Amazon EC2 instances, AWS IoT Greengrass core devices, on-premises servers, edge devices, और VMs Systems Manager managed nodes होने चाहिए।
* Patch operations implemented: कम से कम एक patch scan operation कॉन्फ़िगर और निष्पादित होना चाहिए।
* IAM permissions: CloudFormation templates deploy करने और आवश्यक resources बनाने के लिए उचित अनुमतियाँ।
* Amazon QuickSight: QuickSight का उपयोग करके patch compliance information visualize करने के लिए, आपको [QuickSight के लिए sign up](https://docs.aws.amazon.com/quicksight/latest/user/signing-up.html) करना होगा।
* Amazon QuickSight Permissions to S3: आपको यह सुनिश्चित करना होगा कि QuickSight के पास [Phase 1: Central account setup](#phase-1-central-account-setup) में बनाए गए S3 buckets की अनुमतियाँ हों।

## विचार

### Resource data sync

वर्तमान में, AWS CloudFormation में `AWS::SSM::ResourceDataSync` resource [S3Destination](https://docs.aws.amazon.com/AWSCloudFormation/latest/TemplateReference/aws-properties-ssm-resourcedatasync-s3destination.html) property के भीतर `DestinationDataSharing` property का समर्थन नहीं करता है।

इसके कारण, यह recipe [Sample CloudFormation template for organization resource data sync](#sample-cloudformation-template-for-organization-resource-data-sync) सेक्शन में resource data sync बनाने के लिए Lambda function का उपयोग करने हेतु एक custom CloudFormation resource उपयोग करती है।

Resource data sync बनाने के लिए custom resource के विकल्प:

1. Standard resource data sync का उपयोग करें जो CloudFormation द्वारा समर्थित है।
    1. इसके लिए, आपको एक bucket policy बनानी और उपयोग करनी होगी जो AWS account IDs के आधार पर अनुमतियाँ प्रदान करती है।
    1. [Sample CloudFormation template for central reporting using Athena](#sample-cloudformation-template-for-central-reporting-using-athena) में S3 bucket policy को अपडेट करें।
    1. `AWS::SSM::ResourceDataSync` resource deploy करने के लिए CloudFormation StackSets का उपयोग करें।
1. Organization resource data sync बनाने के लिए वैकल्पिक विधि का उपयोग करें, उदाहरण के लिए, AWS CLI या अन्य SDKs के माध्यम से scripting।

### लागत विचार

केंद्रीकृत पैच अनुपालन रिपोर्टिंग लागू करने में कई AWS सेवाएं शामिल हैं:

1. [Amazon S3 pricing](https://aws.amazon.com/s3/pricing/):
    * Inventory और patch compliance data के लिए Standard storage costs
    * कई accounts और regions से data sync करने के लिए Data transfer costs
1. [AWS Glue pricing](https://aws.amazon.com/glue/pricing/):
    * Crawler costs
1. [Amazon Athena pricing](https://aws.amazon.com/athena/pricing/):
    * Query costs
1. [AWS Lambda pricing](https://aws.amazon.com/lambda/pricing/):
    * Custom resource Lambda function के लिए न्यूनतम costs
1. [Amazon QuickSight pricing](https://aws.amazon.com/quicksight/pricing/) (वैकल्पिक):
    * Author licenses और Reader licenses

## आर्किटेक्चर अवलोकन

### Central reporting account

निम्नलिखित आरेख में, **Central Reporting** account आपके AWS Organization के भीतर एक AWS account है जो patch और inventory metadata को संग्रहीत करने और querying या visualization के लिए समर्पित है।

:::warning
**Central reporting account** के रूप में [AWS Organization management account](https://docs.aws.amazon.com/managedservices/latest/userguide/management-account.html) का उपयोग करना **अनुशंसित नहीं** है।
:::

![Architecture for the central reporting account](/img/cloudops/recipes/central-reporting/architecture-diagram-reporting-account.png "Architecture for the central reporting account")

1. Glue crawler दिन में एक बार S3 bucket को crawl करने के लिए चलता है जो resource data sync द्वारा प्रदान किया गया metadata होस्ट करता है।
1. Glue crawler S3 bucket में metadata के आधार पर database और tables अपडेट करता है।
1. Glue crawler अपना run पूरा करने के बाद, EventBridge को एक event भेजा जाता है।
1. EventBridge rule Lambda function को invoke करता है।
1. Lambda function AWS:InstanceInformation table के लिए एक duplicative column हटाता है।
    :::info
    `AWS:InstanceInformation` table में `resourcetype` नामक एक column शामिल है, जो एक partition key भी है, जिससे Athena queries fail हो जाती हैं। EventBridge rule Glue crawler execution द्वारा trigger होता है, जो फिर column delete करने के लिए Lambda function को invoke करता है।
    :::
1. Athena आपके द्वारा चलाई जाने वाली queries के आधार पर Glue database और tables को query करता है।
1. (वैकल्पिक) आप patch compliance information visualize करने के लिए QuickSight dashboard बना सकते हैं।

### Member account(s)/Region(s) with managed nodes

![Architecture for the AWS Organization resource data sync](/img/cloudops/recipes/central-reporting/architecture-diagram-ssm-org-resource-data-sync.png "Architecture for the AWS Organization resource data sync")

1. Delegated administrator account में CloudFormation StackSet target AWS accounts/Regions में आवश्यक resources बनाने के लिए stack instances बनाता है।
1. Stack instance IAM service role, Lambda function, और custom CloudFormation resource बनाता है।
1. Lambda function AWS Organizations के लिए Systems Manager resource data sync बनाता है।
1. Resource data sync inventory और patch compliance metadata को [central reporting account](#central-reporting-account) में निर्दिष्ट S3 bucket को भेजता है।

### Process timeline

निम्नलिखित आरेख managed nodes के लिए patch compliance querying की process timeline प्रदर्शित करता है।

![Process timeline for patching operations](/img/cloudops/recipes/central-reporting/architecture-diagram-org-patch-reporting-combined.png "Process timeline for patching operations")

1. Patch scan, install, या inventory metadata gathering operation के बाद, managed node पर SSM agent Systems Manager को data रिपोर्ट करता है।
1. Patch और inventory metadata updates की गई कार्रवाइयों के आधार पर resource data sync द्वारा पहचानी जाती हैं।
1. Resource data sync metadata को central reporting account में निर्दिष्ट S3 bucket को ship करता है।
1. फिर आप operation के बाद results query करने के लिए Athena का उपयोग कर सकते हैं।

## Deployment चरण

### Deployment checklist

#### Central reporting account कार्य

* [ ] Athena resources के लिए CloudFormation stack deploy करें
* [ ] Stack outputs से S3 bucket names नोट करें
* [ ] S3 buckets के लिए QuickSight permissions कॉन्फ़िगर करें
* [ ] QuickSight visualization के लिए CloudFormation stack deploy करें
* [ ] QuickSight analysis तक access verify करें

#### Member account कार्य (StackSets के माध्यम से)

* [ ] Organization resource data sync CloudFormation StackSet deploy करें
* [ ] Member accounts में resource data syncs बनाए गए verify करें

### Phase 1: Central account setup

#### Athena का उपयोग करके central reporting के लिए Sample CloudFormation template

[Sample CloudFormation template for central reporting using Athena](https://github.com/aws-samples/cloud-operations-best-practices/blob/main/cloud-operations-best-practices/static/cfn-templates/patch-reporting/patch-reporting.yaml)

| Resource Name | उद्देश्य |
| -------- | ------ |
| **KMS resources** | |
| ManagedInstanceDataEncryptionKey | Resource data sync S3 bucket में managed node metadata encrypt करने के लिए Customer managed key (CMK)। |
| ManagedInstanceDataEncryptionKeyAlias | CMK के लिए Alias। |
| **S3 resources** | |
| AthenaQueryResultsBucket | Athena query results संग्रहीत करने के लिए S3 bucket। |
| ResourceSyncBucket | Resource data sync द्वारा प्रदान किए गए managed node metadata संग्रहीत करने के लिए S3 bucket। |
| ResourceSyncBucketPolicy | Resource data sync S3 bucket के लिए S3 bucket policy। |
| **Glue resources** | |
| GlueDatabase | Resource data sync metadata के लिए Glue database। |
| GlueCrawler | Database और tables बनाने के लिए Glue crawler। |
| GlueCrawlerRole | Glue crawler द्वारा उपयोग किया जाने वाला IAM role। |
| **Athena resources** | |
| AthenaWorkGroup | Named queries के लिए Athena workgroup। |
| AthenaQueryCompliantPatch | Patching के लिए compliant managed nodes सूचीबद्ध करने की example query। |
| AthenaQueryNonCompliantPatch | Patching के लिए non-compliant managed nodes सूचीबद्ध करने की example query। |

#### Central reporting account में Athena के लिए CloudFormation stack deploy करें

1. [Sample CloudFormation template for central reporting using Athena](https://github.com/aws-samples/cloud-operations-best-practices/blob/main/cloud-operations-best-practices/static/cfn-templates/patch-reporting/patch-reporting.yaml) अपनी local machine पर download करें।
1. Central reporting account और Region में, [AWS CloudFormation console](https://console.aws.amazon.com/cloudformation/home) पर navigate करें।
1. Left navigation pane में, **Stacks** चुनें, फिर **Create stack** चुनें।
1. Dropdown list से, **With new resources (standard)** चुनें।
1. **Create stack** page पर, **Upload a template file** चुनें, **Choose file** चुनें, `patch-reporting.yaml` फ़ाइल चुनें, फिर **Next** चुनें।
1. **Specify stack details** page पर:
    1. **Stack name** के लिए, एक वर्णनात्मक नाम दर्ज करें, जैसे `patch-reporting`।
    1. **Organization ID** के लिए, अपने AWS Organization का AWS Organization ID दर्ज करें।
    :::tip
    AWS Organization ID retrieve करने के बारे में अधिक जानकारी के लिए, [Viewing details of an organization from the management account](https://docs.aws.amazon.com/organizations/latest/userguide/orgs_view_org.html) देखें।
    :::
    1. **Next** चुनें।
1. **Configure stack options** page पर, आवश्यक tags जोड़ें, **I acknowledge that AWS CloudFormation might create IAM resources with custom names** चुनें, फिर **Next** चुनें।
1. **Review and create** page पर, सारी जानकारी review करें फिर **Submit** चुनें।

:::tip
**AthenaQueryResultsBucket** और **ResourceDataSyncBucketName** के लिए Amazon S3 buckets के नाम नोट करें जो CloudFormation stack के **Outputs** tab में पाए जा सकते हैं।

![Outputs of the CloudFormation stack to show the resource data sync S3 bucket name](/img/cloudops/recipes/central-reporting/patch-reporting-cfn-outputs.png "Outputs of the CloudFormation stack to show the resource data sync S3 bucket name")
:::

#### Amazon QuickSight visualization के लिए Sample CloudFormation template

[Sample CloudFormation template for Amazon QuickSight visualization](https://github.com/aws-samples/cloud-operations-best-practices/blob/main/cloud-operations-best-practices/static/cfn-templates/patch-reporting/quicksight.yaml)

#### QuickSight के लिए CloudFormation template deploy करने से पहले पूर्ण करने के लिए पूर्वापेक्षाएं

QuickSight को patch compliance और inventory metadata तक पहुँचने के लिए, आपको [Deploy a CloudFormation stack for Athena in the central reporting account](#deploy-a-cloudformation-stack-for-athena-in-the-central-reporting-account) में बनाए गए S3 buckets के लिए QuickSight को access grant करना होगा।

![QuickSight permissions to S3 buckets](/img/cloudops/recipes/central-reporting/quicksight-athena-resources.png "QuickSight permissions to S3 buckets")

अधिक जानकारी के लिए, [I can't connect to Amazon S3](https://docs.aws.amazon.com/quicksight/latest/user/troubleshoot-connect-S3.html) देखें।

### Phase 2: Member account configuration

#### Organization resource data sync के लिए Sample CloudFormation template

[Sample CloudFormation template for organization resource data sync](https://github.com/aws-samples/cloud-operations-best-practices/blob/main/cloud-operations-best-practices/static/cfn-templates/patch-reporting/organization-resource-data-sync.yaml)

| Resource Name | उद्देश्य |
| -------- | ------ |
| ResourceDataSyncLambdaRole | Organization resource data sync बनाने के लिए Lambda का IAM service role |
| ResourceDataSyncLambdaFunction | Organization resource data sync बनाने के लिए Lambda function |
| ResourceDataSyncCustomResource | Lambda function invoke करने के लिए CFN custom resource |

#### CloudFormation StackSet deploy करें

1. [Sample CloudFormation template for organizational resource data syncs](https://github.com/aws-samples/cloud-operations-best-practices/blob/main/cloud-operations-best-practices/static/cfn-templates/patch-reporting/organizational-resource-data-sync.yaml) download करें।
1. Delegated administrator account for CloudFormation में, [AWS CloudFormation console](https://console.aws.amazon.com/cloudformation/home) पर navigate करें।
1. Left navigation pane में, **StackSets** चुनें, फिर **Create StackSet** चुनें।
1. **Choose a template** page पर:
    1. **Permission model** के लिए, default option **Service-managed permissions** चुनें।
    1. **Specify template** के लिए, **Upload a template file** चुनें, `organization-resource-data-sync.yaml` फ़ाइल चुनें, फिर **Next** चुनें।
1. **Specify StackSet details** page पर:
    1. **StackSet name** के लिए, एक वर्णनात्मक नाम दर्ज करें, जैसे `org-resource-data-sync`।
    1. **Name of the resource data sync S3 bucket** के लिए, पिछले सेक्शन में बनाए गए S3 bucket का नाम दर्ज करें।
    :::tip
    Central reporting account में, आप प्रोविज़न किए गए CloudFormation stack के **Outputs** में S3 bucket name पा सकते हैं।
    :::
    1. **Next** चुनें।
1. **Set deployment options** page पर:
    1. **Deployment targets** के लिए, organization या specific organization units (OUs) में deploy करने का चयन करें।
    :::tip
    सभी उपलब्ध inventory और patch metadata को querying, reporting और visualization के लिए एक single S3 bucket में एकीकृत सुनिश्चित करने के लिए सभी accounts और Regions जहाँ AWS Systems Manager द्वारा managed nodes हैं वहाँ resource data syncs deploy करने की अनुशंसा की जाती है।
    :::
    1. **Specify Regions** के लिए, वे Regions चुनें जहाँ resource data sync deploy करना है।
    1. **Next** चुनें।
1. **Review** page पर, सारी जानकारी review करें, फिर **Submit** चुनें।

## Phase 3: Verification और Testing

### Resource data sync S3 bucket में metadata verify करें

Central reporting account में, [Amazon S3 console](https://console.aws.amazon.com/s3/home) पर navigate करें और CloudFormation द्वारा बनाए गए S3 bucket को चुनें। S3 bucket में, [CloudFormation StackSet deploy](#deploy-a-cloudformation-stackset) करते समय आपके द्वारा प्रदान किया गया bucket prefix चुनें।

![S3 bucket folders for resource data sync metadata](/img/cloudops/recipes/central-reporting/s3-bucket-objects.png "S3 bucket folders for resource data sync metadata")

### QuickSight analysis तक access verify करें

[QuickSight console](https://quicksight.aws.amazon.com/sn/start/analyses) पर navigate करके CloudFormation द्वारा बनाए गए QuickSight Analysis dashboard तक आपकी access verify करें।

![QuickSight analysis created by CloudFormation](/img/cloudops/recipes/central-reporting/quicksight-analysis.png "QuickSight analysis created by CloudFormation")

## Patch compliance query करें

### Glue crawler review करें

अब जबकि resource data sync ने Systems Manager data को S3 bucket में सिंक्रोनाइज़ किया है, हम JSON files से tables बनाने के लिए Glue crawler का उपयोग कर सकते हैं। Glue crawler दिन में एक बार 00:00 UTC पर चलने के लिए कॉन्फ़िगर किया गया है।

1. [AWS Glue console](https://console.aws.amazon.com/glue/home/v2/home) खोलें और navigation pane में, **Data Catalog** header के तहत **Crawlers** चुनें।
1. **SSM-GlueCrawler** चुनें और **Run** चुनें।

### Athena का उपयोग करके Query करें

1. [Central reporting AWS account](#central-reporting-account) में log in करें।
1. [Amazon Athena console](https://console.aws.amazon.com/athena/home) खोलें और navigation pane में, **Query editor** चुनें।
1. Upper-right corner में, **Workgroup** के लिए, **patch-workgroup** चुनें।
1. **Saved queries** tab चुनें।
1. एक saved query चुनें, जैसे **QueryNonCompliantPatch**, और **Run** चुनें।

![Athena query results for QueryNonCompliantPatch](/img/cloudops/recipes/central-reporting/athena-query-results.png "Athena query results for QueryNonCompliantPatch")

:::warning
**QuerySSMAgentVersion** और **QueryInstanceApplications** नामक **Saved queries** का उपयोग करने के लिए, आपको [Systems Manager Inventory](https://docs.aws.amazon.com/systems-manager/latest/userguide/systems-manager-inventory.html) सक्षम करना होगा।
:::

### अतिरिक्त Athena sample queries

#### Non-compliant managed nodes के लिए updates group करें

निम्नलिखित example Athena query non-compliant updates को managed node द्वारा group करती है।

```sql
-- Query to aggregate non-compliant patch compliance items by resource (limited to 20 results)
SELECT 
    ci.resourceid,
    ci.status,
    ci.patchstate,
    LISTAGG(DISTINCT ci.id, ', ') WITHIN GROUP (ORDER BY ci.id) AS ids
FROM 
    aws_complianceitem ci
WHERE 
    ci.compliancetype = 'Patch'
    AND ci.status = 'NON_COMPLIANT'
GROUP BY 
    ci.resourceid,
    ci.status,
    ci.patchstate
ORDER BY 
    ci.resourceid
LIMIT 20;
```

#### Non-active managed nodes filter out करें

Resource data syncs S3 buckets को inventory और patch compliance metadata भेजते हैं। जब एक managed EC2 instance stopped या terminated होता है, तो `AWS:InstanceInformation` metadata नई स्थिति प्रतिबिंबित करने के लिए अपडेट किया जाता है। ये मान `InstanceStatus` key में इंगित किए जाते हैं:

* `Active` - SSM agent सक्रिय रूप से चल रहा है और AWS Systems Manager के साथ communicate कर रहा है।
* `Stopped` - EC2 instance `Stopped` state में है।
* `Terminated` - EC2 instance terminate (deleted) हो गया है।
* `ConnectionLost` - Hybrid managed node पर SSM agent AWS Systems Manager के साथ communicate करने में असमर्थ है।

:::tip
Resource data syncs निर्दिष्ट S3 bucket से JSON files नहीं हटाते। Terminated EC2 instances या deregistered hybrid managed nodes के लिए managed node metadata JSON files को स्वचालित रूप से clean-up करने के लिए, आप [S3 lifecycle policies](https://docs.aws.amazon.com/AmazonS3/latest/userguide/object-lifecycle-mgmt.html) का उपयोग कर सकते हैं।
:::

आप अपनी Athena queries में stopped या terminated instances या connection lost state में hybrid managed nodes को filter out करने के लिए `InstanceStatus` का उपयोग कर सकते हैं:

```sql
-- Query to return only Active managed nodes
SELECT 
    ii.accountid,
    ii.region,
    ii.resourceid,
    ii.computername,
    ii.ipaddress,
    ii.instancestatus,
    ii.platformtype,
    ii.platformname,
    ii.platformversion,
    ii.agenttype,
    ii.agentversion,
    ii.capturetime
FROM 
    aws_instanceinformation ii
WHERE 
    ii.instancestatus = 'Active'
LIMIT 20;
```

## QuickSight का उपयोग करके patch compliance visualize करें

[Deploy a CloudFormation stack for QuickSight in the central reporting account](#deploy-a-cloudformation-stack-for-quicksight-in-the-central-reporting-account) में deploy किए गए CloudFormation stack ने QuickSight datasets और एक empty analysis dashboard बनाया है ताकि आप patch compliance और inventory metadata visualize करना शुरू कर सकें।

QuickSight visuals बनाने के लिए, नीचे सूचीबद्ध दो विषयों में procedures follow करें:

1. [Part 1: Create QuickSight visuals based on metadata for managed nodes](https://catalog.workshops.aws/getting-started-with-com/en-US/advanced-workshops/organization-patch-reporting/create-quicksight-visuals-and-dashboard)
1. [Part 2: Create AWS QuickSight Visuals for information on Patch Compliance](https://catalog.workshops.aws/getting-started-with-com/en-US/advanced-workshops/organization-patch-reporting/create-quicksight-visuals-for-patch-compliance)

## Deploy किए गए resources clean-up करें

:::warning
इस recipe में sample CloudFormation templates central reporting account के लिए CloudFormation stack delete करने पर S3 buckets की सामग्री delete कर देते हैं।
:::

[Phase 2: Member account configuration](#phase-2-member-account-configuration) में बनाए गए sample resources को clean-up करने के लिए, आपको पहले [अपने StackSet में stack instances delete करने](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/stackinstances-delete.html) होंगे और फिर [StackSet delete करना](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/stacksets-delete.html) होगा।

CloudFormation stacks delete करने की जानकारी के लिए, [Delete a stack from the CloudFormation console](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/cfn-console-delete-stack.html) देखें।

## अगले कदम

नीचे आप संबंधित AWS blogs की एक श्रृंखला पाएंगे जिनका उपयोग आपकी patch operations और reporting mechanisms को बेहतर बनाने के लिए एक संदर्भ के रूप में किया जा सकता है।

* [Automate Systems Manager patching reports via email and Slack notifications in an AWS Organization](https://aws.amazon.com/blogs/mt/automate-systems-manager-patching-reports-via-email-and-slack-notifications-in-an-aws-organization/)
* [Troubleshooting AWS Systems Manager patching made easy with Amazon Bedrock's automated recommendations](https://aws.amazon.com/blogs/mt/troubleshooting-aws-systems-manager-patching-made-easy-with-amazon-bedrocks-automated-recommendations/)
* [Visualize AWS Systems Manager Patch Manager information using Amazon QuickSight](https://aws.amazon.com/blogs/mt/visualize-aws-systems-manager-patch-manager-information-using-amazon-quicksight/)
* [Automate vulnerability management and remediation in AWS using Amazon Inspector and AWS Systems Manager – Part 1](https://aws.amazon.com/blogs/mt/automate-vulnerability-management-and-remediation-in-aws-using-amazon-inspector-and-aws-systems-manager-part-1/)

## तकनीकी शब्दावली

| शब्द | परिभाषा |
|---|---|
| AWS Glue Crawler | एक सेवा जो स्वचालित रूप से data sources से metadata खोजती और catalog करती है। |
| AWS Organizations | कई AWS accounts को एक organization के रूप में केंद्रीय रूप से manage और govern करने की सेवा। |
| Custom Resource | एक CloudFormation resource type जो आपको templates में custom provisioning logic लिखने में सक्षम बनाता है। |
| Delegated Administrator | एक AWS account जिसे AWS organization की ओर से कुछ AWS services administer करने की अनुमतियाँ दी गई हैं। |
| Managed Node | कोई भी server (EC2 instance या VM on-premises या अन्य clouds में) जो AWS Systems Manager द्वारा management के लिए configured है। |
| Patch Baseline | नियमों का एक सेट जो परिभाषित करता है कि आपके managed nodes पर कौन से patches install होने चाहिए। |
| Patch Compliance | आवश्यक patches के संबंध में managed node की स्थिति। |
| Patch Group | एक tag-based grouping mechanism जो managed nodes को specific patch baselines के साथ associate करता है। |
| Resource Data Sync | एक Systems Manager feature जो स्वचालित रूप से managed nodes से inventory data को एक central S3 bucket में aggregate करता है। |
| SSM Agent | Managed nodes पर installed AWS software जो Systems Manager को इन resources को update, manage और configure करने में सक्षम बनाता है। |
| StackSet | एक CloudFormation feature जो आपको एक operation के साथ कई accounts और regions में stacks create, update, या delete करने देता है। |

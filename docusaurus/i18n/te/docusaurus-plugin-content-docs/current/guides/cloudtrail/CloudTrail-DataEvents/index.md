---
sidebar_position: 4
---
# CloudTrail Data Events

AWS CloudTrail ఉత్తమ పద్ధతుల ప్రకారం, మీరు భద్రత-సున్నితమైన workloads కోసం multi-region trail స్థాయిలో data events ను రికార్డ్ చేయాలి. తీవ్రమైన compliance అవసరాలు ఉన్న workloads కోసం, resource level కార్యకలాపాలను audit చేయడానికి data events ను ప్రారంభించమని మేము సిఫార్సు చేస్తున్నాము. Data events ను లాగ్ చేయడం వల్ల data స్థాయిలో audit చేసే సామర్థ్యం లభిస్తుంది, మీరు visibility ను ప్రారంభించే resource లోపల మార్పులు కూడా ఇందులో ఉంటాయి.

CloudTrail అదనపు observability ను అందించడంలో సహాయపడుతుంది మరియు విస్తృత శ్రేణి సేవల కోసం data events కు మద్దతు ఇస్తుంది. ఈ data events మీ క్లిష్టమైన compliance, risk మరియు security లక్ష్యాలను చేరుకోవడంలో సహాయపడతాయి. ఈ రకమైన events కు కొన్ని ఉదాహరణలు object-level API కార్యకలాపాలు, అంటే delete, update మరియు put items. CloudTrail data events అందించే మెరుగైన visibility యొక్క ఉదాహరణలలో Amazon Bedrock లో agent alias లేదా knowledge base పై API కార్యకలాపాలు, Amazon Q Business లో application లేదా data source పై కార్యకలాపాలు, లేదా feature store పై Sagemaker API కార్యకలాపాలు ఉన్నాయి. ఇవి కీలకమైన risk management ప్రయోజనాలను అందిస్తాయి:

* వ్యక్తిగత డేటా మరియు సున్నితమైన సమాచారానికి ప్రాప్యతను పర్యవేక్షించడం
* వ్యక్తిగత డేటా మరియు సున్నితమైన డేటా మార్పుల పట్ల visibility
* వ్యక్తిగత డేటా మరియు సున్నితమైన సమాచారాన్ని నిర్వహించే applications లో కార్యకలాపాలను auditing చేయడం
* సంభావ్య data breaches మరియు privacy incidents ను కనుగొనడం
* Privacy audits మరియు compliance reporting ను సులభతరం చేయడం*

### Data Events కోసం Advanced Event Selectors
మీరు data events ను ఉపయోగించినప్పుడు, advanced event selectors ఏ CloudTrail events మీ event data stores లోకి ingest అవుతాయో అనే దానిపై ఎక్కువ నియంత్రణను అందిస్తాయి. Advanced event selectors తో, మీరు EventSource, EventName, userIdentity.arn మరియు ResourceARN వంటి fields పై విలువలను include లేదా exclude చేయవచ్చు. Advanced event selectors partial strings పై pattern matching తో విలువలను include లేదా exclude చేయడానికి కూడా మద్దతు ఇస్తాయి. ఇది ఖర్చులను తగ్గించడంలో సహాయపడుతూ మీ security, compliance మరియు operational investigations యొక్క efficiency మరియు precision ను పెంచుతుంది. ఉదాహరణకు, నిర్దిష్ట IAM roles లేదా users ద్వారా generate చేయబడిన events ను exclude చేయడానికి మీరు userIdentity.arn attribute ఆధారంగా CloudTrail events ను filter చేయవచ్చు. monitoring purposes కోసం తరచుగా API calls చేసే service ద్వారా ఉపయోగించే ఒక dedicated IAM role ను మీరు exclude చేయవచ్చు. ఇది CloudTrail Lake లోకి ingest అయ్యే CloudTrail events volume ను గణనీయంగా తగ్గించడానికి అనుమతిస్తుంది, సంబంధిత user మరియు system కార్యకలాపాలపై visibility ను నిలుపుకుంటూ ఖర్చులను తగ్గిస్తుంది.

![CloudTrail Lake Data Events](/img/cloudops/guides/cloudtrail-lake/cloudtrail-data-events-advanced-selector.png "Advanced Event Selectors for Data Events")

### **Workload నిర్దిష్టం**

కింది విభాగాలు trails మరియు event data stores కోసం అందుబాటులో ఉన్న resource types ను ఉపయోగించి నిర్దిష్ట workloads ను monitoring మరియు auditing చేయడానికి కొన్ని ఉత్తమ పద్ధతులను అందిస్తాయి. ఉదాహరణకు, Amazon S3 కోసం data events ను లాగ్ చేసేటప్పుడు, Amazon S3 objects కు చేసే అన్ని resource level operations ను రికార్డ్ చేయడానికి మీరు `PutObject` API operations ను capture చేయాలి. ఇది Amazon S3 objects కోసం resource స్థాయిలో చేసిన actions పై visibility ను అందిస్తుంది.

### **Amazon SNS మరియు Amazon SQS**

Amazon SNS security ఉత్తమ పద్ధతులు మరియు Amazon SQS security ఉత్తమ పద్ధతుల ప్రకారం, Amazon SNS మరియు Amazon SQS ను access చేయడానికి VPC endpoints ను ఉపయోగించడం గురించి ఆలోచించమని ఇది సిఫార్సు చేస్తుంది. ఉదాహరణకు, మీకు Amazon SNS topics లేదా Amazon SQS queues ఉండి, వాటితో interact చేయగలగాలి, కానీ అవి ఖచ్చితంగా internet కు exposed కాకూడదు అంటే, ఒక నిర్దిష్ట VPC లోని hosts నుండి మాత్రమే Amazon SNS topic లేదా Amazon SQS queue కు messages publish లేదా send చేయడానికి access ను నియంత్రించడానికి VPC endpoints ను ఉపయోగించండి.

CloudTrail లో Amazon SNS కోసం data events ను ప్రారంభించడం ద్వారా మీరు మీ అన్ని Amazon SNS topics కోసం `Publish` మరియు `PublishBatch` API actions ను audit చేయగలుగుతారు. అదే విధంగా, [Amazon SQS కోసం data events](https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/sqs-logging-using-cloudtrail.html#sqs-data-events-in-cloud-trail) కోసం `SendMessage` API action, మీ VPC లోని instances నుండి Amazon SQS queues కు messages పంపేటప్పుడు VPC Endpoints ఉపయోగించబడుతున్నాయని audit చేయడం నిర్ధారిస్తుంది, internet ను cross చేయకుండా.

కింది query Amazon SNS నుండి [Publish](https://docs.aws.amazon.com/sns/latest/api/API_Publish.html) events కోసం API actions ను చూపుతుంది, messages Amazon SNS topic కు publish అవుతున్నాయని సూచిస్తుంది. ఫలితాలు ఏ [IAM](https://aws.amazon.com/iam/) entity ఈ action తీసుకుందో మరియు message పంపబడిన నిర్దిష్ట VPC endpoint ID ను కూడా చూపుతాయి. అయితే, VPC endpoint ID లేకపోతే, Publish API call VPC Endpoint ఉపయోగించకుండా చేయబడింది.

#### SQL Query:

```
SELECT eventTime,
    substr(userIdentity.arn, strpos(userIdentity.arn, '/') +1) as IAM, 
    recipientAccountId, 
    awsRegion, 
    eventName,sourceIPAddress, 
    substr(element_At(requestParameters, 'topicArn'), 
    strpos(element_At(requestParameters, 'topicArn'), '.com/') +18) as Topic, 
    vpcEndpointId
FROM $EDS_ID
    WHERE eventSource = 'sns.amazonaws.com'
    AND eventName = 'Publish'
    AND eventtime >= '2024-06-24 00:00:00'
    AND eventtime <= '2024-06-24 23:59:59'
```

Amazon SNS query కోసం చూపించిన విధంగానే, కింది query Amazon SQS నుండి [SendMessage](https://docs.aws.amazon.com/AWSSimpleQueueService/latest/APIReference/API_SendMessage.html) events కోసం API actions ను చూపుతుంది, నిర్దిష్ట Amazon SQS queue కు messages పంపబడుతున్నాయని సూచిస్తుంది. ఈ ఫలితాలు ఏ [IAM](https://aws.amazon.com/iam/) entity action తీసుకుందో మరియు message పంపబడిన నిర్దిష్ట VPC endpoint ID ను కూడా చూపుతాయి.

#### SQL Query:

```
SELECT eventTime, 
    substr(userIdentity.arn, strpos(userIdentity.arn, '/') +1) as IAM, 
    recipientAccountId, 
    awsRegion, 
    eventName,sourceIPAddress, 
    substr(element_At(requestParameters, 'queueUrl'), 
    strpos(element_At(requestParameters, 'queueUrl'), '.com/') +18) as Queue, 
    vpcEndpointId
FROM $EDS_ID
WHERE eventSource = 'sqs.amazonaws.com'
    AND eventName = 'SendMessage'
    AND eventtime >= '2024-06-24 00:00:00'
    AND eventtime <= '2024-06-24 23:59:59'
```

### Amazon Q for Business

Amazon Q for Business workloads కోసం మీరు **AWS::QBusiness::Application** మరియు **AWS::S3::Object** కోసం data events ను configure చేయవచ్చు. **AWS::QBusiness::Application** మీ Amazon Q Business application కు సంబంధించిన data plane కార్యకలాపాలను లాగ్ చేస్తుంది మరియు **AWS::S3::Object** source Amazon S3 bucket కోసం data events ను రికార్డ్ చేస్తుంది. మీ trail లేదా event data store కోసం data events configure చేయబడిన తర్వాత, Amazon Q Business మరియు Amazon S3 కోసం events generate అవడం ప్రారంభమవుతుంది.

కింది query [BatchDeleteDocument](https://docs.aws.amazon.com/amazonq/latest/api-reference/API_BatchDeleteDocument.html) కు API calls ను చూపుతుంది, మీ Amazon Q Business Application లో ఉపయోగించిన ఒకటి లేదా అంతకంటే ఎక్కువ documents ను delete చేయడాన్ని సూచిస్తుంది.

#### SQL Query:

```
SELECT
    eventName, COUNT(*) AS numberOfCallsFROM
<event-data-store-ID>
WHERE
    eventSource='qbusiness.amazonaws.com' AND eventTime > date_add('day', -1, now())
Group
BY eventName ORDER BY COUNT(*) DESC
```

కింది query BatchDeleteDocument API call తో అనుబంధించబడిన IAM identity ని కనుగొనడంలో సహాయపడుతుంది.

#### SQL Query:

```
SELECT
 sourceIPAddress, eventTime, userIdentity.principalid
 FROM
 <event-data-store-ID>
 WHERE
 eventName='BatchDeleteDocument' AND eventTime > date_add('day', -1, now())
```

కింది query StartDataSourceSyncJob API call కోసం చూడటం ద్వారా Amazon Q Business Applications తో S3 data source యొక్క synchronization ను ఏ job trigger చేసిందో చూపుతుంది.

#### SQL Query:

```
SELECT
 sourceIPAddress, eventTime, userIdentity.arn AS user
 FROM
 <event-data-store-ID>
 WHERE
 eventName='StartDataSourceSyncJob' AND eventTime > date_add('day', -1, now())
```

కింది query, మీ Q business application కు data source గా కనెక్ట్ చేయబడిన S3 bucket నుండి ఏవైనా objects delete చేయబడ్డాయా అని DeleteObject API event కోసం తనిఖీ చేయడం ద్వారా చూపుతుంది:

#### SQL Query:

```
SELECT
 sourceIPAddress, eventTime, userIdentity.arn AS user
 FROM
 <event-data-store-ID>
 WHERE
 userIdentity.arn IS NOT NULL AND eventName='DeleteObject'
 AND element_at(requestParameters, 'bucketName') like '<enter-S3-bucket-name>'
 AND eventTime > '[2024-05-09 00](tel:2024050900):00:00'
```

### Amazon Q Developer

Amazon Q Developer కోసం data events ఉపయోగించి మీరు track చేయగల events లో ఒకటి **'StartCodeAnalysis'**, ఇది VS Code మరియు JetBrains IDEs కోసం Amazon Q Developer ద్వారా నిర్వహించబడే security scans ను track చేస్తుంది.

కింది query లో మేము security scan ను ప్రారంభించిన అన్ని users జాబితాను retrieve చేస్తాము. ఇది మీ organization లో code ను analyze చేయడానికి Amazon Q Developer ను ఏ users ఉపయోగిస్తున్నారో గుర్తించడానికి మరియు వారి requests యొక్క source ను నిర్ణయించడానికి సహాయపడుతుంది.

```
SELECT
userIdentity.onbehalfof.userid, eventTime, SourceIPAddress
FROM
    <event-data-store-ID>
WHERE
    eventName = 'StartCodeAnalysis'
```

### Amazon Bedrock

Amazon Bedrock కోసం CloudTrail data events, 'AWS::Bedrock::AgentAlias' మరియు 'AWS::Bedrock::KnowledgeBase' resource type actions ద్వారా Agents for Bedrock మరియు Amazon Bedrock knowledge bases కోసం API events ను track చేస్తాయి.

ఉదాహరణకు, chat application యొక్క administrator Bedrock agents invocation కు సంబంధించిన events ను audit చేయాలనుకుంటే, వారు కింది query ను ఉపయోగించవచ్చు, ఇది invoked agent alias తో పాటు పంపబడిన [request](https://docs.aws.amazon.com/bedrock/latest/APIReference/API_agent-runtime_InvokeAgent.html#API_agent-runtime_InvokeAgent_RequestSyntax) మరియు [response](https://docs.aws.amazon.com/bedrock/latest/APIReference/API_agent-runtime_InvokeAgent.html#API_agent-runtime_InvokeAgent_ResponseSyntax) parameters వివరాలను నిర్ణయించడంలో సహాయపడుతుంది.

```
SELECT
UserIdentity,eventTime,eventName,UserAgent,requestParameters,resourcesFROM
<event-data-store-ID>
WHERE
    eventName = 'InvokeAgent'
```

అదనంగా, కింది query invoked knowledge base యొక్క వివరాలను, return చేయబడిన request మరియు response parameters తో పాటు అందిస్తుంది:

```
SELECT
UserIdentity,eventTime,eventName,UserAgent,requestParameters,resourcesFROM
<event-data-store-ID>
WHERE
    eventName = 'RetrieveAndGenerate'
```

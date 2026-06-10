---
sidebar_position: 4
---
# AWS Config ఖర్చు ఆప్టిమైజేషన్

### ధరలు

[AWS Config ధరలు](https://aws.amazon.com/config/pricing/) ప్రధానంగా రెండు ప్రధాన కోణాలపై ఆధారపడి ఉంటాయి:

1. Configuration Item Recording : 

    * Continuous Recording
        మీ AWS పరిసరంలో ప్రతి configuration మార్పును real-time లో నిరంతరం పర్యవేక్షించి రికార్డ్ చేస్తుంది. ఇది అన్ని resource మార్పులపై సమగ్ర దృశ్యమానతను అందిస్తుంది, మార్పులు జరిగినప్పుడు వాటిని ట్రాక్ చేయడానికి మరియు ఆడిట్ చేయడానికి మిమ్మల్ని అనుమతిస్తుంది.
    * Periodic Recording
        మీ resource configurations యొక్క రోజువారీ snapshots తీసుకుంటుంది, గత 24-గంటల స్థితి నుండి భిన్నంగా ఉన్నప్పుడు మాత్రమే మార్పులను రికార్డ్ చేస్తుంది. ఈ విధానం పర్యవేక్షణ మరియు ఖర్చు సామర్థ్యం మధ్య సమతుల్యతను అందిస్తుంది, డేటా వాల్యూమ్‌ను తగ్గిస్తూ ముఖ్యమైన మార్పులను సంగ్రహిస్తుంది.

1. Rule మరియు Conformance Pack Evaluations:
    AWS Config config rule evaluations కోసం ఛార్జ్ చేస్తుంది, వ్యక్తిగతంగా లేదా conformance pack భాగంగా.

AWS Config ధరల ప్రస్తుత వివరాల కోసం, [దయచేసి ఈ లింక్‌ను చూడండి](https://aws.amazon.com/config/pricing/).

పైవి ప్రాథమిక ధరల భాగాలు అయినప్పటికీ, AWS Config ఉపయోగించడం యొక్క మొత్తం ఖర్చును ఇతర అంశాలు ప్రభావితం చేయవచ్చు:

1. [AWS Lambda](https://aws.amazon.com/lambda/pricing/) ఖర్చులు: Lambda functions ద్వారా అమలు చేయబడిన custom rules ఉపయోగిస్తుంటే, ప్రమాణ Lambda ధరలు వర్తిస్తాయి.
2. [Amazon S3](https://aws.amazon.com/s3/pricing/) storage: S3 లో configuration snapshots మరియు history files నిల్వ చేయడానికి ఖర్చులు వర్తిస్తాయి.
3. Data Transfer: AWS services లేదా regions మధ్య డేటా బదిలీకి ఛార్జీలు వర్తించవచ్చు.



### ఖర్చు ఆప్టిమైజేషన్ సిఫార్సులు

#### Config ఖర్చులను విశ్లేషించడం

[AWS Cost Explorer](https://aws.amazon.com/aws-cost-management/aws-cost-explorer/) service వినియోగాన్ని ఫిల్టర్ చేయడం మరియు cost dimensions విశ్లేషించడం ద్వారా AWS Config ఖర్చులపై అంతర్దృష్టులను అందిస్తుంది. దీని కోసం, మీ [Billing and Cost Management console](https://us-east-1.console.aws.amazon.com/costmanagement/home#/home) కు నావిగేట్ చేయండి మరియు ఎడమ ప్యానెల్ నుండి **Cost Explorer** ఎంచుకోండి. కుడి ప్యానెల్ నుండి, మీకు అవసరమైన వివరాల స్థాయి ఆధారంగా మీ కోరుకున్న సమయం మరియు మీ ఇష్టపడే granularity (daily లేదా monthly) ఎంచుకోండి. **Group by** విభాగంలో **Dimensions** కింద **Usage Type** ఎంచుకోండి. **Filters** కింద, **Service** కు నావిగేట్ చేసి **Config** ఎంచుకోండి.

![AWS Config Cost Visualization](/img/cloudops/guides/config/configcost.png)

[Amazon CloudWatch](https://aws.amazon.com/cloudwatch/) యొక్క "ConfigurationItemsRecorded" metric అత్యధిక configuration items ఉత్పత్తి చేస్తున్న resource types ను గుర్తించడంలో సహాయపడుతుంది. [CloudWatch Metrics ఉపయోగించి AWS Config Resource Changes విశ్లేషించడం](https://aws.amazon.com/blogs/mt/analyzing-aws-config-resource-changes-using-cloudwatch-metrics/) గురించి బ్లాగ్ చూడండి. వివరణాత్మక విశ్లేషణ కోసం, config recorder ఖర్చులను అంచనా వేయడానికి మరియు తరచుగా evaluate చేయబడే rules ట్రాక్ చేయడానికి [Amazon Athena](https://aws.amazon.com/athena/) [Cost and Usage Reports](https://aws.amazon.com/aws-cost-management/aws-cost-and-usage-reporting/) ను [AWS CloudTrail](https://aws.amazon.com/cloudtrail/) మరియు [CloudTrail Lake](https://docs.aws.amazon.com/awscloudtrail/latest/userguide/cloudtrail-lake.html) తో query చేయడానికి ఉపయోగించవచ్చు. [AWS Config Data విశ్లేషించడానికి Athena ఉపయోగించడం](https://aws.amazon.com/blogs/mt/use-amazon-athena-and-aws-cloudtrail-to-estimate-billing-for-aws-config-rule-evaluations/) గురించి బ్లాగ్ చూడండి.

ఖర్చు alerts కోసం, ఖర్చులు ముందుగా నిర్ణయించిన thresholds మించినప్పుడు [AWS Budgets](https://aws.amazon.com/aws-cost-management/aws-budgets/) ద్వారా proactive ఖర్చు నిర్వహణను అమలు చేయండి. అలాగే, [AWS Cost Anomaly Detection](https://aws.amazon.com/aws-cost-management/aws-cost-anomaly-detection/) service అసాధారణ ఖర్చు నమూనాల కోసం నిరంతర పర్యవేక్షణను అందిస్తుంది, ఖర్చు spikes ను త్వరగా గుర్తించడం మరియు పరిష్కరించడం సులభం చేస్తుంది. మీ అంచనా ఛార్జీలు నిర్వచించిన threshold మించినప్పుడు మిమ్మల్ని తెలియజేసే [CloudWatch billing alarms](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/monitor_estimated_charges_with_cloudwatch.html) కూడా సృష్టించవచ్చు.

#### Continuous మరియు Periodic Recording మధ్య ఎంపిక

AWS Config అమలు చేసేటప్పుడు, ఖర్చులు మరియు compliance అవసరాలను సమతుల్యపరచడానికి తగిన recording పద్ధతిని ఎంచుకోవడం చాలా ముఖ్యమైనది. [Continuous recording](https://docs.aws.amazon.com/config/latest/developerguide/config-concepts.html#continuous-recording) సాధారణంగా resources కాలక్రమేణా సాపేక్షంగా స్థిరంగా ఉండే static workloads కోసం మరింత ఖర్చు-ప్రభావవంతం. ఈ ఎంపిక ముఖ్యంగా real-time monitoring మరియు configuration మార్పులలో తక్షణ దృశ్యమానతను కోరే కఠినమైన భద్రత మరియు compliance అవసరాలు ఉన్న environments కోసం సిఫార్సు చేయబడుతుంది. Production databases, core networking resources, లేదా sensitive data processing systems వంటి క్రిటికల్ infrastructure భాగాలు సాధారణంగా continuous recording నుండి ప్రయోజనం పొందుతాయి. మరోవైపు, [periodic recording](https://docs.aws.amazon.com/config/latest/developerguide/config-concepts.html#periodic-recording) containerized environments లో ephemeral resources లేదా తరచుగా scale up మరియు down అయ్యే infrastructure వంటి అత్యంత dynamic workloads కోసం మరింత ఆర్థికంగా అనుకూలంగా ఉంటుంది. Auto-scaling groups ఉపయోగించే development environments, container orchestration platforms, లేదా temporary testing environments ఉదాహరణలు. అయితే, periodic recording real-time కాకుండా 24-గంటల ప్రాతిపదికన updates అందిస్తుంది కాబట్టి తక్కువ compliance అవసరాలు ఉన్న workloads కోసం మాత్రమే అమలు చేయాలని గమనించడం ముఖ్యం. అలాగే periodic recording కోసం, deliver చేయబడిన configuration item కి ఖర్చు continuous recording కంటే ఎక్కువగా ఉంటుంది, కాబట్టి కొన్ని scenarios లో, periodic recording యొక్క మొత్తం ఖర్చు continuous recording కంటే ఎక్కువగా ఉండవచ్చు. ఈ recording పద్ధతుల మధ్య ఎంపిక తరచుగా నిర్దిష్ట use cases తో సమానంగా ఉంటుంది, periodic snapshots సరిపోయే operational planning, లేదా continuous monitoring అవసరమైన compliance auditing వంటివి. సంస్థలు ఈ నిర్ణయం తీసుకునేటప్పుడు తమ భద్రత అవసరాలు, operational patterns, మరియు budget constraints ను జాగ్రత్తగా అంచనా వేయాలి.


#### Resource Exclusion

AWS Config [resource exclusion](https://docs.aws.amazon.com/config/latest/developerguide/select-resources.html) సామర్థ్యం ద్వారా ఖర్చు ఆప్టిమైజేషన్ అందిస్తుంది, సంస్థలు తమ configuration monitoring ఖర్చులను వ్యూహాత్మకంగా నిర్వహించడానికి అనుమతిస్తుంది. మీ risk profile కు తక్కువ సంబంధం ఉన్న లేదా అధిక configuration items వాల్యూమ్‌లు ఉత్పత్తి చేసే నిర్దిష్ట resource types ను మినహాయించడం ద్వారా, అవసరమైన భద్రత monitoring నిర్వహిస్తూ ఖర్చులను గణనీయంగా తగ్గించవచ్చు. ఈ ఫీచర్ AWS Management Console మరియు CLI ద్వారా AWS Config settings లో యాక్సెస్ చేయవచ్చు మరియు configure చేయవచ్చు. అయితే, మీరు resource exclusion ను జాగ్రత్తగా పరిశీలనతో మరియు సరైన stakeholder భాగస్వామ్యంతో చేరుకోవాలి. సంస్థలు monitoring మరియు compliance అవసరాల కోసం ఏ resources క్రిటికల్ అనే మరియు ఏవి సురక్షితంగా మినహాయించవచ్చనే పూర్తి అంచనా నిర్వహించడానికి తమ భద్రత మరియు operations teams ను భాగస్వామ్యం చేయాలి. ఖర్చు సామర్థ్యం మరియు బలమైన governance posture నిర్వహణ మధ్య optimal సమతుల్యతను సాధించడం లక్ష్యం. ఉదాహరణకు, temporary development resources మినహాయింపునకు అభ్యర్థులు అయినప్పటికీ, critical production infrastructure సాధారణంగా నిరంతర monitoring కింద ఉండాలి. ఏదైనా exclusions అమలు చేయడానికి ముందు, మీ నిర్ణయాలు భద్రత మరియు compliance అవసరాలతో అనుగుణంగా ఉన్నాయని నిర్ధారించడానికి [AWS యొక్క Security Best Practices](https://docs.aws.amazon.com/config/latest/developerguide/security-best-practices.html) సమీక్షించడం మరియు [AWS Well-Architected Framework](https://aws.amazon.com/architecture/well-architected/) సంప్రదించడం సిఫార్సు చేయబడుతుంది. అదనంగా, వ్యాపార అవసరాలు మరియు భద్రత అవసరాలు కాలక్రమేణా మారుతున్నందున సంస్థలు తమ exclusion policies ను క్రమం తప్పకుండా సమీక్షించాలి.

[AWS Control Tower](https://aws.amazon.com/controltower/) ప్రస్తుతం config recorder customization కు మద్దతు ఇవ్వడం లేదని గమనించదగ్గ విషయం. అయితే, native support జోడించబడే వరకు Control Tower environments లో AWS Config resource tracking customize చేయడానికి [ఈ బ్లాగ్‌లో వివరించిన](https://aws.amazon.com/blogs/mt/customize-aws-config-resource-tracking-in-aws-control-tower-environment/) ఒక workaround ఉంది.


#### Top Configuration Items

కొన్నిసార్లు [AWS::Config::ResourceCompliance](https://docs.aws.amazon.com/config/latest/developerguide/view-compliance-history.html) అత్యంత ప్రభావవంతమైన CI generators లో ఒకటిగా ఉంటుంది, ముఖ్యంగా అనేక rule evaluations ఉన్న కస్టమర్‌ల కోసం. ఈ resource type AWS Config console లో compliance status యొక్క timeline view అందిస్తుంది. ఇది విలువైన అంతర్దృష్టులను అందించినప్పటికీ, ముఖ్యంగా పెద్ద resources evaluate చేసేటప్పుడు configuration item ఖర్చులను గణనీయంగా పెంచవచ్చు. అదే పరిస్థితి ఉంటే, ఖర్చులు తగ్గించడానికి దాని exclusion పరిగణించవచ్చు.

చారిత్రక compliance checks కోసం, కస్టమర్లు ఖర్చు-రహిత ప్రత్యామ్నాయంగా CloudTrail data ఉపయోగించవచ్చు. మీ కస్టమర్లు Athena, 3rd party solutions తో పని చేయడానికి క్రింది query ను మార్చవచ్చు, లేదా CloudTrail Lake ఎనేబుల్ చేసి ఉంటే అందులో ఉపయోగించవచ్చు.


```
SELECT
    eventTime,awsRegion, recipientAccountId, element_at(additionalEventData, 'configRuleName'
    ) as configRuleName, json_extract_scalar(json_array_get(element_at(requestParameters,'evaluations'
        ),0
        ),'$.complianceType'
    ) as Compliance, json_extract_scalar(json_array_get(element_at(requestParameters,'evaluations'
        ),0
        ),'$.complianceResourceType'
    ) as ResourceType, json_extract_scalar(json_array_get(element_at(requestParameters,'evaluations'
        ),0
        ),'$.complianceResourceId'
    ) as ResourceName
FROM
    $EDS_ID
WHERE
    eventName='PutEvaluations'
    and eventTime > '2022-03-17 00:00:00'
    AND eventTime < '2022-03-18 00:00:00'
    And json_extract_scalar(json_array_get(element_at(requestParameters,'evaluations'
        ),0
        ),'$.complianceType'
    ) IN ('COMPLIANT','NON_COMPLIANT')
```



#### AWS Config Indirect Relationship

AWS Config లో రెండు రకాల relationships ఉన్నాయి:
Direct Relationships:

* Resource యొక్క configuration data నుండి extract చేయబడిన సరళమైన A→B relationship
* describe API calls నుండి నేరుగా తీసుకోబడినది
* ఉదాహరణ: Amazon EC2 instance మరియు దాని security group మధ్య relationship direct ఎందుకంటే Amazon EC2 instance కోసం describe API response లో security groups చేర్చబడ్డాయి.

Indirect Relationships:

* పాత resource types తమ configuration ను అనేక resources configurations పరిశీలించడం ద్వారా రికార్డ్ చేయవచ్చు
* ఉదాహరణ: Security group మరియు Amazon EC2 instance మధ్య relationship indirect ఎందుకంటే security group ను describe చేయడం దానితో సంబంధిత instances గురించి ఎటువంటి సమాచారం ఇవ్వదు. ఈ సందర్భంలో AWS Config రెండు configuration items సృష్టిస్తుంది.

ఏ resources indirect relationships కు మద్దతు ఇస్తాయో [ఈ లింక్‌లో](https://docs.aws.amazon.com/config/latest/developerguide/faq.html) మరింత తెలుసుకోవచ్చు.

Indirect relationships నుండి opt out కావడానికి, మీ [Technical Account Manager](https://aws.amazon.com/premiumsupport/plans/enterprise/) ను సంప్రదించమని సిఫార్సు చేస్తున్నాము.

#### Rule Management మరియు Evaluation పరిగణనలు

AWS Config rules నిర్వహించేటప్పుడు, rule deletion మరియు re-evaluation actions పరిగణించండి, ఎందుకంటే ఇవి ఖర్చులను గణనీయంగా ప్రభావితం చేయవచ్చు. పెద్ద సంఖ్యలో resources evaluate చేసే rules తొలగించేటప్పుడు, ఖర్చు-ప్రభావవంతమైన విధానం ముందుగా [resource compliance recording](https://docs.aws.amazon.com/config/latest/developerguide/stop-start-recorder.html) ఆపడం, తర్వాత rules తొలగించడం, మరియు చివరగా compliance recording పునఃప్రారంభించడం. ఈ చర్య మీ నిల్వ చేసిన data ను ప్రభావితం చేయదు కానీ recorder ఆపివేసినప్పుడు resource configuration లోకి మీ దృశ్యమానతను ప్రభావితం చేస్తుంది. ఈ sequential process అనవసరమైన configuration item generation మరియు సంబంధిత ఖర్చులలో spikes నిరోధించడంలో సహాయపడుతుంది.

#### API Call ఆప్టిమైజేషన్

సమర్థవంతమైన API operations AWS Config ఖర్చులను తగ్గించగలవు. [EC2 instance](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/Using_Tags.html) కు అనేక tags జోడించడం వంటి resources మార్పులు చేసేటప్పుడు, అనేక వ్యక్తిగత calls చేయడం కంటే మార్పులను ఒకే API call లో ఏకీకృతం చేయడం సిఫార్సు చేయబడుతుంది. ఉదాహరణకు, 10 tags ను ఒకే API call లో జోడించడం 10 ప్రత్యేక calls చేయడం కంటే మరింత సమర్థవంతమైనది, ఎందుకంటే ప్రతి call API change record మరియు resource compliance configuration item రెండింటినీ ఉత్పత్తి చేస్తుంది.

#### Custom Rules మరియు Lambda Function ఆప్టిమైజేషన్

Custom rule implementation కోసం, execution ఖర్చులు తగ్గించడానికి Lambda functions కంటే [CloudFormation Guard](https://docs.aws.amazon.com/cfn-guard/latest/ug/what-is-guard.html) ఉపయోగించడం ఇష్టం. అయితే, Lambda-based custom rules అవసరమైతే, వాటిని ఈ విధంగా optimize చేయండి:

* నిర్దిష్ట targeting ఉపయోగించి evaluate చేయబడిన resources scope తగ్గించడం. Scope based rules event-based evaluations కోసం మాత్రమే మద్దతు ఇస్తాయి periodic కాదు
* మెరుగైన నియంత్రణ కోసం resource tagging అమలు చేయడం
* తొలగించబడిన resources కోసం evaluation termination handle చేయడానికి logic జోడించడం
* అన్ని resources evaluate చేయడం కంటే resource-specific triggers ఉపయోగించడం

#### Conformance Pack మరియు Rule Deduplication

[Conformance packs](https://docs.aws.amazon.com/config/latest/developerguide/conformance-packs.html) మరియు rules యొక్క క్రమం తప్పకుండా auditing redundancy తొలగించడానికి అవసరం. ఉదాహరణకు, అనేక conformance packs [AWS Security Hub](https://aws.amazon.com/security-hub/) ద్వారా ఇప్పటికే evaluate చేయబడుతున్న అదే rule (CloudTrail enablement checks వంటివి) కలిగి ఉంటే, అనవసరమైన evaluation ఖర్చులు నివారించడానికి duplicate rules తొలగించడం పరిగణించండి. ఖర్చులను optimize చేస్తూ ప్రభావశీలత కొనసాగించడానికి వివిధ compliance standards అంతటా overlapping rules సమీక్షించి ఏకీకృతం చేయండి. [Duplicate AWS Config rules కనుగొనడానికి ఈ బ్లాగ్ అనుసరించండి](https://aws.amazon.com/blogs/security/discover-duplicate-aws-config-rules-for-streamlined-compliance/).

#### AWS Config లో Global Resource Recording ఆప్టిమైజ్ చేయడం

అనేక regions లో AWS Config అమలు చేసేటప్పుడు, ఖర్చులను నియంత్రించడానికి మరియు duplicate data collection నిరోధించడానికి global resources రికార్డింగ్ ను optimize చేయవచ్చు. ఉత్తమ పద్ధతి మీ AWS environment లో ఒకే region కు global resource recording పరిమితం చేయడం. ఒక నియమిత region లో మాత్రమే 'IncludeGlobalResourceTypes' property ను 'true' గా సెట్ చేయడం ద్వారా AWS CloudFormation templates ద్వారా దీన్ని నిర్వహించవచ్చు. IAM users, roles, మరియు policies వంటి ప్రకృతిలో global అయిన resources కోసం ఈ విధానం ముఖ్యం. ఈ విధానాన్ని అమలు చేయడం ద్వారా, సంస్థలు అనేక regions లో global resource recording యొక్క అనవసరమైన duplication నివారించవచ్చు, తమ global resources లోకి సమగ్ర దృశ్యమానత కొనసాగిస్తూ గణనీయమైన ఖర్చు ఆదాలకు దారి తీస్తుంది.

#### Integrated Services ఆప్టిమైజేషన్

AWS Config వివిధ AWS services తో ఇంటరాక్ట్ అవుతుంది, ప్రతి ఒక్కటి మొత్తం ఖర్చుకు దోహదం చేస్తుంది. వాటి వ్యక్తిగత ఖర్చులను optimize చేయడానికి ఈ integrated services కోసం ఉత్తమ పద్ధతులు అమలు చేయండి:

---
sidebar_position: 3
---
# Compliance Evaluation

AWS Config మీ AWS environment లోని resource configurations ను evaluate చేయడానికి రెండు ప్రాథమిక రకాల rules ను అందిస్తుంది. మొదటి రకం, [Managed Rules](https://docs.aws.amazon.com/config/latest/developerguide/managed-rules-by-aws-config.html), AWS చే అందించబడిన pre-built rules, వివిధ security, operational, మరియు compliance use cases ను cover చేస్తాయి. Managed Rules మీ AWS resources ను best practices మరియు common compliance standards కు వ్యతిరేకంగా evaluate చేసే pre-configured rule templates. రెండవ రకం [Custom Rules](https://docs.aws.amazon.com/config/latest/developerguide/evaluate-config_develop-rules.html), organizations తమ స్వంత rules ను create చేయడానికి అనుమతిస్తుంది, organization-specific compliance requirements మరియు checks ను implement చేయడానికి.

Custom rules AWS Lambda functions ద్వారా create చేయవచ్చు, ఇక్కడ మీ AWS resources compliant అవుతున్నాయా లేదా అనే logic ను మీరు code చేస్తారు. AWS Config [Guard Custom policy ఉపయోగించి custom rules creation](https://aws.amazon.com/blogs/mt/announcing-aws-config-custom-rules-using-guard-custom-policy/) ను కూడా అనుమతిస్తుంది. [Guard Custom policy](https://docs.aws.amazon.com/config/latest/developerguide/evaluate-config_develop-rules.html) custom rules create చేసే process ను simplify చేస్తుంది, ఎందుకంటే మీరు Lambda functions create చేయవలసిన అవసరం ఉండదు. Guard Custom policy [Guard domain-specific language (DSL)](https://docs.aws.amazon.com/cfn-guard/latest/ug/writing-rules.html) ఉపయోగించి define చేయబడిన policy కు వ్యతిరేకంగా మీ resource ను evaluate చేయడానికి మీ policy-as-code ను define చేయడానికి అనుమతిస్తుంది.

AWS Config remediation actions కోసం [Systems Manager Automation documents](https://aws.amazon.com/blogs/mt/remediate-noncompliant-aws-config-rules-with-aws-systems-manager-automation-runbooks/) తో natively integrated అయి ఉంది. మీరు AWS Systems Manager Automation documents ఉపయోగించి మీ స్వంత custom remediation actions ను create చేయగలరు మరియు AWS Config ద్వారా manual లేదా automatic remediation ఎంచుకునే option కలిగి ఉంటారు.

అదనంగా, AWS [Service-Linked Rules](https://docs.aws.amazon.com/config/latest/developerguide/service-linked-rules.html) ను కూడా అందిస్తుంది, ఇవి ఆ services కు specific resource configurations ను evaluate చేయడానికి ఇతర AWS services ద్వారా automatically create చేయబడతాయి మరియు manage చేయబడతాయి. ఉదాహరణకు, AWS Security Hub security best practices మరియు standards ను evaluate చేయడానికి AWS Config లో service-linked rules ను create చేయగలదు. మీరు [Organization Rules](https://docs.aws.amazon.com/config/latest/developerguide/config-rule-multi-account-deployment.html) ను కూడా deploy చేయవచ్చు, ఇవి మీ AWS Organizations structure లో multiple accounts అంతటా rules ను deploy చేయడానికి మరియు manage చేయడానికి అనుమతిస్తాయి, మీ మొత్తం AWS environment అంతటా consistent compliance ను maintain చేయడం సులభతరం చేస్తుంది.

### Conformance Packs:

Managed rules లేదా custom rules ను individually specific regions మరియు accounts కు deploy చేయడం కంటే, వాటిని [Conformance Packs](https://docs.aws.amazon.com/config/latest/developerguide/conformance-packs.html) లోకి bundle చేయడం ఉత్తమ పద్ధతి. AWS Conformance Packs multiple accounts మరియు regions అంతటా వందలాది rules ను deploy చేయడానికి మరియు monitor చేయడానికి single point of control ను అందిస్తాయి, scale వద్ద consistent security మరియు compliance standards ను నిర్ధారిస్తాయి. ఇవి common frameworks (HIPAA, NIST, PCI-DSS వంటివి) కోసం [pre-built templates](https://docs.aws.amazon.com/config/latest/developerguide/conformancepack-sample-templates.html) ను offer చేస్తాయి మరియు custom rule creation ను అనుమతిస్తాయి, compliance management కోసం అవసరమైన సమయం మరియు ప్రయత్నాన్ని గణనీయంగా తగ్గిస్తాయి. ఈ packs Config rules యొక్క immutable groups ను represent చేస్తాయి, changes conformance pack కు formal updates ద్వారా మాత్రమే చేయగలరని నిర్ధారిస్తాయి. ఈ approach మీ compliance rules పై better governance మరియు control ను అందిస్తుంది.


#### Organizational Deployment:

AWS మీ AWS Organization అంతటా automatic deployment కోసం organizational conformance packs ను leverage చేయడానికి మిమ్మల్ని అనుమతిస్తుంది. ఈ capability conformance packs మరియు individual Config rules రెండింటికీ extend అవుతుంది. AWS Config delegated administrator functionality ను కూడా support చేస్తుంది, మీ organization అంతటా conformance pack deployments ను manage చేయడానికి specific account ను designate చేయడానికి అనుమతిస్తుంది. Immutable వంటి benefits ను maintain చేస్తూ [delegated admin ఉపయోగించి conformance packs ను deploy చేయడానికి](https://aws.amazon.com/blogs/mt/deploy-aws-config-rules-and-conformance-packs-using-a-delegated-admin/) ఈ documentation ను follow చేయండి.


### AWS Config Rules Development Kit (RDK)

AWS Config [Rules Development Kit](https://github.com/awslabs/aws-config-rdk) (RDK), AWS samples GitHub repository లో available, custom Config rules creation ను streamline చేస్తుంది. ఇది resource evaluations implement చేయడానికి minimal modification అవసరమయ్యే boilerplate code templates ను అందిస్తుంది. RDK centralized Lambda function approach తో సహా వివిధ deployment scenarios ను support చేస్తుంది.

AWS Config RDK ఉపయోగించి [scale వద్ద custom AWS Config rules build చేయడం మరియు operate చేయడం](https://aws.amazon.com/blogs/mt/aws-config-rule-development-kit-library-build-and-operate-rules-at-scale/) కోసం ఈ blog ను refer చేయండి.

#### Lambda Functions ను Centralize చేయండి

Multiple custom rules అవసరమైన multi-account environments లో, Lambda functions ను single account లో (security లేదా compliance account వంటిది) centralize చేయడం recommended. ఇతర accounts నుండి Custom rules ఈ centralized functions ను invoke చేయగలవు.

### Global Resource Management

Global resources (IAM rules వంటివి) ను evaluate చేసే rules కోసం, duplicate costs మరియు redundant API calls ను avoid చేయడానికి ఒకే region లో deploy చేయండి. ఈ practice effective compliance monitoring ను maintain చేస్తూ cost efficiency మరియు resource utilization రెండింటినీ optimize చేస్తుంది.


### Evaluation Management

Rule evaluations ను manage చేసేటప్పుడు, evaluation results delete చేయడానికి లేదా re-evaluations trigger చేయడానికి options గురించి mindful ఉండండి. ఈ features యొక్క frequent use resources కోసం new [configuration items](https://docs.aws.amazon.com/config/latest/APIReference/API_ConfigurationItem.html) ను generate చేస్తుంది, potentially storage మరియు processing requirements ను impact చేస్తుంది.



## Cross-Account Aggregation మరియు Querying

Organizations multiple regions మరియు accounts అంతటా AWS Config ను enable చేసినప్పుడు, comprehensive visibility మరియు management కోసం data ను centralize చేయడం crucial అవుతుంది. [AWS Config Aggregators](https://docs.aws.amazon.com/config/latest/developerguide/aggregate-data.html) వివిధ regions మరియు accounts నుండి configuration-related data ను single, designated aggregator account లోకి consolidate చేయడానికి free feature ను offer చేస్తాయి. ఈ centralization మీ AWS environment యొక్క unified view ను అందిస్తుంది, మీ organization అంతటా Config rule evaluations, conformance pack assessments, మరియు overall compliance status ను easier monitoring ను enable చేస్తుంది. Organization wide aggregator deploy చేయడానికి, [ఈ blog ను follow చేయండి](https://aws.amazon.com/blogs/mt/org-aggregator-delegated-admin/).

Central account లోని ఈ aggregated data [advanced querying](https://docs.aws.amazon.com/config/latest/developerguide/querying-AWS-resources.html) capabilities ను unlock చేస్తుంది. ఈ feature మీ AWS environment అంతటా complex queries perform చేయడానికి అనుమతిస్తుంది, resource configurations మరియు compliance states లో insights ను అందిస్తుంది. ఉదాహరణకు, simple SQL-like syntax ఉపయోగించి మీ accounts అంతటా అన్ని unattached EBS volumes ను మీరు సులభంగా identify చేయగలరు. ఈ advanced queries operational మరియు compliance-related data రెండింటినీ offer చేస్తాయి, మీ AWS infrastructure ను effectively manage చేయడానికి మరియు optimize చేయడానికి మీ ability ను enhance చేస్తాయి.

S3 లో [AWS Config configuration snapshot data](https://docs.aws.amazon.com/config/latest/developerguide/deliver-snapshot-cli.html) ను [Amazon Athena](https://aws.amazon.com/athena/) ఉపయోగించి query చేయవచ్చు మరియు customers [Amazon QuickSight](https://aws.amazon.com/quicksight) ఉపయోగించి custom visualizations create చేయగలరు. AWS Config data ను aggregate చేయడం, advanced queries perform చేయడం, మరియు customized inventory dashboards create చేయడం ఎలాగో తెలుసుకోవడానికి, [monitoring with AWS Config workshop ను follow చేయండి](https://catalog.workshops.aws/cloudops-accelerator/en-US/inventory/monitoring-resources-with-aws-config). [AWS Organizations పై AWS Config dashboard deploy చేయడం](https://catalog.workshops.aws/awscid/en-US/dashboards/additional/config-resource-compliance-dashboard#aws-config-aggregator-dashboard) ఎలాగో చూపించే [AWS Config Resource Compliance Dashboard](https://catalog.workshops.aws/awscid/en-US/dashboards/additional/config-resource-compliance-dashboard#aws-config-aggregator-dashboard) పై workshop ను కూడా refer చేయండి.

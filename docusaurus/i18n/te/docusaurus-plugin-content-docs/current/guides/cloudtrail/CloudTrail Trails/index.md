---
sidebar_position: 2
---
# CloudTrail Trails

AWS CloudTrail మీ AWS infrastructure అంతటా account activity ను monitor చేసి record చేస్తుంది, storage, analysis, మరియు remediation actions పై control అందిస్తుంది. Trail అనేది మీరు specify చేసిన Amazon Simple Storage Service (Amazon S3) bucket కు CloudTrail events deliver చేయడంలో సహాయపడే configuration.

CloudTrail మీ AWS infrastructure లో account activity monitor మరియు record చేయడానికి మూడు రకాల trails అందిస్తుంది. మొదటి రకం multi-Regional trail, ఇది అన్ని AWS Regions నుండి activity capture చేస్తుంది. Default గా, AWS Management Console ద్వారా trail సృష్టించినప్పుడు, ఇది అన్ని Regions కు వర్తిస్తుంది. రెండవ రకం single-Region trail, ఇది AWS CLI లో మాత్రమే అందుబాటులో ఉంటుంది, ఒక specific Region లో activity capture చేస్తుంది. అయితే, విస్తృత coverage కోసం multi-Region trails ఉపయోగించమని సిఫార్సు చేస్తున్నాము.

చివరగా, AWS Organizations service ఉపయోగించేటప్పుడు మీ organization లోని అన్ని AWS accounts కు వర్తించే organizational trail ఉంది. ఈ రకం trail multi-account environment లో comprehensive coverage మరియు centralized monitoring అందిస్తుంది.

ఈ trail types ఉపయోగించి, మీ CloudTrail setup ను మీ monitoring మరియు recording అవసరాలకు తగినట్లు customize చేయవచ్చు. ఇది Regional level లో లేదా మీ మొత్తం organization అంతటా చేయవచ్చు. CloudTrail Trails కోసం కొన్ని ఉత్తమ పద్ధతులు ఇక్కడ ఉన్నాయి.

### అన్ని AWS accounts మరియు Regions లో CloudTrail configure చేయండి

AWS accounts లో user, role, లేదా service ద్వారా తీసుకోబడిన events యొక్క పూర్తి record పొందడానికి, అన్ని AWS Regions లో events log చేయడానికి ప్రతి trail ను configure చేయండి. మీ company లేదా organization ఉపయోగించే ప్రతి AWS account లో ఈ trails సెటప్ చేయండి. ఈ setup event ఏ AWS Region లో జరిగినా ప్రతి event log చేయబడుతుందని నిర్ధారిస్తుంది. ఫలితంగా, లేకపోతే ఉపయోగించని Regions లో unexpected activity detect చేయవచ్చు. Global service events (ఉదాహరణకు, AWS Identity and Access Management మరియు Amazon Route 53) కూడా include చేయబడి log చేయబడతాయి. అన్ని Regions కు వర్తించే trail సృష్టిస్తే, ఏదైనా కొత్త AWS Region స్వయంచాలకంగా include చేయబడుతుంది. AWS Organizations ద్వారా multi-account setup ఉంటే, ఆ organization లోని అన్ని AWS accounts కోసం అన్ని events log చేసే trail సృష్టించవచ్చు.

### వివిధ use cases కోసం ప్రత్యేక trails సెటప్ చేయండి

CloudTrail auditing, security monitoring, మరియు operational troubleshooting వంటి use cases కు మద్దతు ఇస్తుంది. ప్రతి use case కోసం multiple trails సెటప్ చేయమని AWS సిఫార్సు చేస్తుంది, తద్వారా మీరు ప్రతి team కు వారికి అవసరమైన జ్ఞానం అందించవచ్చు. దీని కోసం, వివిధ users manage చేయడానికి trails సృష్టించండి. Log files ప్రత్యేక S3 buckets కు deliver చేయడానికి trails configure చేయవచ్చు. ఉదాహరణకు, security administrator అన్ని Regions కు వర్తించే trail సృష్టించి log files ను ఒక AWS Key Management Service (AWS KMS) key తో encrypt చేసి, log file validation ఎనేబుల్ చేయవచ్చు. అదే company లో developer ఒక Region కు మాత్రమే వర్తించే trail సృష్టించి specific API activity notifications అందుకోవడానికి Amazon CloudWatch alarms configure చేయవచ్చు.

### CloudTrail logs ను పరిమిత access ఉన్న ప్రత్యేక security boundary లోని S3 bucket కు deliver చేయడానికి configure చేయండి (ప్రత్యేక AWS account)

Auditing purposes కోసం, ప్రత్యేక administrative domain లోని dedicated S3 bucket లో log files store చేసినప్పుడు, కఠినమైన security controls మరియు segregation of duties enforce చేయవచ్చు. ఈ S3 bucket కు access restrict చేయడం unauthorized మరియు unfettered logs access అవకాశాలను తగ్గిస్తుంది. ఈ controls ఉన్నప్పుడు, ఏదైనా AWS account credentials compromise అయితే, logs ప్రత్యేక domain లో store చేయబడినందున కోల్పోబడవు.

### Log files store చేసే Amazon S3 Bucket పై MFA-delete మరియు versioning ఎనేబుల్ చేయండి

ఈ S3 bucket పై multi-factor authentication (MFA) configure చేయడం ద్వారా, bucket లేదా bucket లోని object ను permanently delete చేయడానికి అదనపు authentication అవసరమని నిర్ధారించవచ్చు. అదనంగా, versioning-enabled buckets accidental deletion లేదా overwrite నుండి objects recover చేయడంలో సహాయపడగలవు. ఉదాహరణకు, object delete చేస్తే, Amazon S3 object ను permanently remove చేయడానికి బదులు delete marker insert చేస్తుంది. చాలా AWS users మరియు admins malicious intent లేనప్పటికీ, ఎవరైనా accidentally critical log files store చేసే S3 bucket delete చేయవచ్చు. ఈ safeguards add చేసినప్పుడు, compromised log files risk తగ్గించవచ్చు.

### CloudTrail log file integrity validation ఎనేబుల్ చేయండి

CloudTrail log file integrity validation log file delete చేయబడిందా లేదా మార్చబడిందా తెలియజేస్తుంది. ఇచ్చిన period లో మీ account కు log files deliver చేయబడలేదని confirm చేయడానికి కూడా ఈ validation ఉపయోగించవచ్చు. ఈ insights security మరియు forensic investigations లో విలువైనవి. Log files integrity నిర్ధారించడానికి ఇవి అదనపు protection layer అందిస్తాయి. CloudTrail log file integrity validation industry standard algorithms ఉపయోగిస్తుంది: hashing కోసం SHA-256 మరియు digital signing కోసం SHA-256 with RSA, ఇది detection లేకుండా log files modify చేయడం computationally unfeasible చేస్తుంది.

### CloudTrail log files at rest encrypt చేయండి

Default గా, CloudTrail మీ bucket కు deliver చేసే log files Amazon server-side encryption with Amazon S3-managed encryption keys (SSE-S3) తో encrypt చేయబడతాయి. నేరుగా manageable security layer అందించడానికి, మీ CloudTrail log files కోసం server-side encryption with AWS KMS-managed keys (SSE-KMS) ఉపయోగించవచ్చు.

### Trails కోసం data events turn on చేయండి

Data events S3 మరియు AWS Lambda లో performed resource operations లో visibility అందిస్తాయి. ఈ events data plane operations గా కూడా తెలుసు. Data events తరచుగా high-volume activities, ముఖ్యంగా S3 పై sensitive data store చేస్తుంటే లేదా Lambda functions ద్వారా key business operations జరుగుతుంటే. Sensitive data కు ఏదైనా unexpected access లో visibility corrective action తీసుకోవడానికి అనుమతిస్తుంది. కొన్ని compliance reports (ఉదాహరణకు, FedRAMP మరియు PCI-DSS) data events turn on చేయడం అవసరం కాబట్టి, AWS Config managed rules లేదా తగిన Conformance Pack Sample Templates ఉపయోగించి అన్ని S3 buckets కోసం కనీసం ఒక trail S3 data events log చేస్తుందని check చేయమని AWS సిఫార్సు చేస్తుంది.

### Data events తో advanced event selectors ఉపయోగించండి

Data events ఉపయోగించేటప్పుడు, advanced event selectors data event logging పై మరింత granular control అందిస్తాయి. Advanced event selectors తో, EventSource, EventName, మరియు ResourceARN వంటి fields పై values include లేదా exclude చేయవచ్చు. Advanced event selectors regular expressions లాగా partial strings పై pattern matching తో values include లేదా exclude చేయడానికి కూడా మద్దతు ఇస్తాయి. ఇది ఏ CloudTrail data events log చేయాలో మరియు దేనికి pay చేయాలో మరింత control అందిస్తుంది. ఉదాహరణకు, ఖర్చులు నియంత్రిస్తూ security issues identify చేయడానికి మీరు receive చేసే CloudTrail events ను destructive actions కు మాత్రమే narrow చేయడానికి S3 DeleteObject APIs log చేయవచ్చు. Auditing కోసం CloudTrail ఉపయోగించేటప్పుడు, అన్ని data events record చేయడం best practice అని గుర్తుంచుకోండి. అయితే, operational monitoring లేదా ఇతర use cases కోసం data events ఉపయోగించేటప్పుడు, advanced event selectors చాలా సహాయకరంగా ఉంటాయి.

### CloudTrail ను Amazon CloudWatch Logs తో integrate చేయండి

Amazon CloudWatch logs, metrics, మరియు events రూపంలో monitoring మరియు operational data collect చేయడంలో సహాయపడుతుంది. CloudTrail ను CloudWatch Logs తో integrate చేసినప్పుడు, CloudTrail capture చేసిన specific events కోసం near real time లో monitor మరియు alerts receive చేయవచ్చు. ఉదాహరణకు, anomalous AWS API activity కోసం alarms మరియు notifications సెటప్ చేయవచ్చు.

CloudTrail ను CloudWatch Logs తో integrate చేసినప్పుడు, CloudWatch Insights produce చేసిన data కూడా visualize చేయవచ్చు. ఈ insights మీకు అవసరమైన data extract చేయడానికి అనుమతిస్తాయి, querying process ను simplify చేస్తాయి. ఉదాహరణకు, near real time లో Amazon Elasticsearch Service కు logs stream చేయడానికి CloudWatch Logs ఉపయోగించి, తర్వాత data visualize చేయడానికి Kibana endpoint access చేయవచ్చు.

### అన్ని Regions కు Trails apply చేయండి
మీ AWS account లో IAM identity లేదా service ద్వారా performed అన్ని actions capture చేయడానికి, అన్ని Regions లో events log చేయడానికి ప్రతి trail configure చేయండి. అన్ని Regions లో events log చేయడం ద్వారా, మీ AWS account లో జరిగే అన్ని events ఏ Region లో జరిగినా log చేయబడతాయని ensure చేస్తారు.

### CloudTrail logs ను central S3 bucket కు deliver చేయండి
పరిమిత access ఉన్న ప్రత్యేక AWS account లోని central S3 bucket కు deliver చేయడానికి CloudTrail logs configure చేయండి. CloudTrail deliver చేసిన logs ఎవరు access చేయవచ్చో permissions limit చేయడానికి Amazon S3 access policy define చేయవచ్చు. ఇది logs కు unauthorized access minimize చేయడంలో సహాయపడగలదు.

### Log files store చేసే S3 bucket పై data protection configure చేయండి
దీని కోసం, కింది actions perform చేయండి:

*   Bucket delete చేయడానికి లేదా bucket లో objects delete చేయడానికి ఏదైనా requests కోసం రెండు forms of authentication అవసరం చేసే S3 bucket కు extra level of security add చేయడానికి multi-factor authentication (MFA) turn on చేయండి.
*   Unwanted deletions లేదా changes నుండి objects recover చేయడంలో సహాయపడటానికి S3 bucket పై versioning turn on చేయండి. ఈ extra layer of protection add చేయడం మీ files కు changes risk తగ్గించడంలో సహాయపడగలదు.
*   మీ S3 bucket కు deliver చేయబడిన log files encrypt చేయడానికి అదనపు safeguard add చేయడానికి CloudTrail log files కోసం encryption turn on చేయండి.
*   CloudTrail deliver చేసిన log files deliver చేయబడిన తర్వాత change కాలేదని ensure చేయడానికి log file validation configure చేయండి.

### S3 bucket పై object lifecycle management configure చేయండి
CloudTrail default trail కోసం configure చేయబడిన S3 bucket లో log files indefinitely store చేయడం. మీ business మరియు auditing needs కు better meet అయ్యే మీ సొంత retention policy define చేయడానికి Amazon S3 object lifecycle management rules ఉపయోగించవచ్చు. ఉదాహరణకు, 1 year కంటే పాతబడిన log files ను Amazon Simple Storage Service Glacier (Amazon S3 Glacier) వంటి different storage tier కు archive చేయాలనుకోవచ్చు. మరొక ఉదాహరణ నిర్దిష్ట సమయం గడిచిన తర్వాత log files delete చేయడం.

### AWSCloudTrail_FullAccess policy కు access limit చేయండి
ఈ policy కు access limit చేయడానికి కొన్ని కారణాలు:

*   AWSCloudTrail_FullAccess policy ఉన్న users తమ AWS accounts లో critical మరియు significant auditing functions disable లేదా reconfigure చేయవచ్చు.
*   ఈ policy మీ AWS account లో IAM identities కు broadly share చేయడానికి లేదా apply చేయడానికి intended కాదు. AWS account administrators గా act చేయాలని expect చేసే individuals కు ఈ policy application limit చేయండి.

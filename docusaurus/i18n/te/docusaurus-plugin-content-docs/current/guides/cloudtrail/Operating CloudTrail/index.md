---
sidebar_position: 1
---
# CloudTrail ను ఆపరేట్ చేయడం

AWS CloudTrail మీ AWS infrastructure అంతటా చర్యలకు సంబంధించిన account కార్యకలాపాలను లాగ్ చేయగలదు, నిరంతరం monitor చేయగలదు మరియు retain చేయగలదు. ఇది మీ account కోసం AWS calls యొక్క చరిత్రను కూడా అందిస్తుంది, AWS Management Console, AWS SDKs మరియు command line tools ద్వారా చేసిన API calls తో సహా. ఫలితంగా, మీరు ఈ క్రింది వాటిని గుర్తించవచ్చు:

*   CloudTrail కు మద్దతు ఇచ్చే services కోసం ఏ users మరియు accounts AWS APIs ను call చేశారు.
*   Calls ఏ source IP address నుండి చేయబడ్డాయి.
*   Calls ఎప్పుడు జరిగాయి.

మీరు మీ AWS account ను create చేసినప్పుడు CloudTrail ప్రారంభించబడుతుంది మరియు గత 90 రోజుల అన్ని management event కార్యకలాపాల event history ను అందిస్తుంది. మీ AWS environment లో 90 రోజుల కంటే ఎక్కువ కాలం events ను retain చేయడానికి trail లేదా Lake కోసం event data store ను create చేయమని AWS సిఫార్సు చేస్తుంది. కింది విభాగం CloudTrail కోసం కొన్ని మొత్తం ఉత్తమ పద్ధతులను వివరిస్తుంది, ఆ తర్వాత CloudTrail Trails మరియు CloudTrail Lake వంటి CloudTrail లోని నిర్దిష్ట areas కోసం ఉత్తమ పద్ధతులను అందిస్తుంది.

### CloudTrail కోసం delegated administrator గా security లేదా logging account ను register చేయండి
CloudTrail organization యొక్క trails మరియు Lake event data stores ను manage చేయడానికి 3 delegated administrators వరకు configure చేయడానికి అనుమతిస్తుంది. Delegated administrator organization తరపున resources ను manage చేయడానికి permission కలిగి ఉంటారు. Delegated administrator support, management account CloudTrail administrative actions ను security లేదా logging account వంటి organization member account కు delegate చేయడానికి అనుమతించడం ద్వారా customers కు flexibility ని అందిస్తుంది.

ఈ feature తో, organization యొక్క management account అన్ని CloudTrail organization resources యొక్క owner గా ఉంటుంది, ఆ organization trails లేదా CloudTrail Lake event data store resources delegated administrator account ద్వారా create మరియు manage చేయబడినప్పటికీ. ఇది customers కు organization-wide CloudTrail audit logs యొక్క continuity ని maintain చేయడంలో సహాయపడుతుంది, AWS Organizations లో వారి organization కు మార్పులు చేసినప్పుడు ఏ disruption లేకుండా. CloudTrail కోసం delegated administrator ను ఉపయోగించడం వల్ల CloudTrail సంబంధిత administrative tasks కోసం management account ను ఉపయోగించే users ను తగ్గించడంలో సహాయపడుతుంది, ఇది మీ security మరియు compliance posture ను మెరుగుపరచడంలో సహాయపడుతుంది.

### అసాధారణ API కార్యకలాపాలను monitor చేయడానికి CloudTrail Insights ను ఉపయోగించండి

AWS CloudTrail Insights, CloudTrail management events ను నిరంతరం analyze చేయడం ద్వారా API calls తో అనుబంధించబడిన అసాధారణ కార్యకలాపాలను గుర్తించడంలో మరియు respond చేయడంలో AWS users కు సహాయపడుతుంది. మీరు CloudTrail Insights ను ప్రారంభించి, CloudTrail అసాధారణ కార్యకలాపాలను detect చేస్తే, Insights events మీ trail కోసం destination S3 bucket కు లేదా CloudTrail Lake కోసం event data store కు deliver చేయబడతాయి. Trail లో capture చేయబడిన ఇతర రకాల events కాకుండా, Insights events CloudTrail మీ account యొక్క API usage లో account యొక్క సాధారణ usage patterns నుండి గణనీయంగా భిన్నంగా ఉండే మార్పులను detect చేసినప్పుడు మాత్రమే లాగ్ చేయబడతాయి. CloudTrail Insights Event Bridge తో integrate అవుతుంది, email notification పంపడం లేదా Lambda function ను trigger చేయడం వంటి criteria ఆధారంగా నిర్దిష్ట actions ను trigger చేయడానికి rules ను create చేయడానికి మిమ్మల్ని అనుమతిస్తుంది. ఫలితంగా, ఏదైనా అసాధారణ API కార్యకలాపం గురించి మీ teams సమాచారం పొందేలా మీరు నిర్ధారించుకోవచ్చు.

![CloudTrail Insights](/img/cloudops/guides/cloudtrail/cloudtrail-insights.png "CloudTrail Insights")

### CloudTrail ఖర్చులను manage చేయడం
CloudTrail ను ఉపయోగించేటప్పుడు, మీ CloudTrail spending ను manage చేయడంలో సహాయపడే areas ను పరిగణించడం గుర్తుంచుకోండి. CloudTrail కోసం cost ను control చేయడంలో సహాయపడే కొన్ని ఉత్తమ పద్ధతులు కింద ఉన్నాయి.

-   **AWS Budgets**: AWS Budgets మీ CloudTrail spending ను track చేయడంలో సహాయపడుతుంది. CloudTrail service ఆధారంగా AWS Budgets లో cost-based budget ను setup చేయవచ్చు. మీరు ఒక నిర్దిష్ట budget threshold కు చేరుకున్నప్పుడు email లేదా AWS Chatbot ద్వారా notify చేయడానికి budget alerts ను కూడా setup చేయవచ్చు.

![AWS Budgets](/img/cloudops/guides/cloudtrail/cloudtrail-budgets.png "AWS Budgets")

-   **AWS Cost Anomaly Detection**: AWS Cost Anomaly Detection మీ organization అంతటా AWS spending లో unexpected spikes ను గుర్తించడంలో మరియు resolve చేయడంలో సహాయపడుతుంది. మీ spend ను track చేయడానికి AWS CloudTrail service కోసం monitor ను create చేయవచ్చు. Service machine learning ను ఉపయోగించి historical data ను analyze చేసి expected daily spend ను calculate చేస్తుంది మరియు actual spend తో compare చేస్తుంది. మీ CloudTrail actual spend expected amount కంటే ఒక నిర్దిష్ట threshold కంటే ఎక్కువగా ఉన్నప్పుడు, ఇది anomaly గా identify చేసి root cause analysis చేస్తుంది. AWS Cost Anomaly Detection మీ CloudTrail spend కు సంబంధించిన anomalies ను detect చేస్తే మీరు త్వరగా action తీసుకోవచ్చు.

-   **CloudTrail S3 bucket కోసం SSE-KMS తో అనుబంధించబడిన cost ను తగ్గించడానికి Amazon S3 Bucket Keys ను ఉపయోగించండి**: Amazon S3 server-side encryption with AWS KMS (SSE-KMS) కోసం object-level keys ను ఉపయోగించేటప్పుడు, Amazon S3 నుండి AWS KMS కు request traffic ను తగ్గించడం ద్వారా AWS KMS request costs ను 99% వరకు తగ్గించడంలో సహాయపడటానికి Amazon S3 Bucket Keys కు switch చేయడం గురించి ఆలోచించాలి. ఇది CloudTrail లో లాగ్ చేయబడిన events volume ను కూడా గణనీయంగా తగ్గిస్తుంది, CloudTrail charges ను తగ్గించడంలో సహాయపడుతుంది. S3 Bucket Keys ను ఉపయోగించడం యొక్క కొన్ని అదనపు ప్రయోజనాలు:
    *   **సరళీకృత Management:** Bucket-level keys individual object-level keys తో పోలిస్తే manage చేయడం సులభం.
    *   **Performance Improvement**: KMS కు API calls తగ్గడం వల్ల encrypted objects తో operations కోసం performance మెరుగుపడుతుంది.
    *   **సులభమైన Implementation:** S3 Bucket Keys AWS Management Console లో కొన్ని clicks తో enable చేయవచ్చు, client applications కు changes అవసరం లేకుండా.

-   **Multiple Trails**: Account కోసం management events యొక్క first copy AWS Free Tier లో include చేయబడింది. అదే management events ను deliver చేసే additional trails ను create చేస్తే, ఆ subsequent deliveries additional CloudTrail costs ను incur చేస్తాయి. మీకు multiple trails అవసరమైతే, CloudTrail కోసం additional trails cost ను తగ్గించడానికి కింది recommendation సహాయపడుతుంది:

    *   **CloudTrail Lake**: మీ management events యొక్క additional copies ను ingest చేయడానికి CloudTrail Lake ను ఉపయోగించండి. CloudTrail Lake ను ఉపయోగించడం వల్ల management events యొక్క additional copies కోసం మీ overall charges 90% వరకు తగ్గవచ్చు.
    
    *   **AWS Key Management Service (AWS KMS) మరియు Amazon Relational Database Service (Amazon RDS) data API events ను exclude చేయండి**: Management events యొక్క ఏదైనా additional copies కోసం, AWS Key Management Service (AWS KMS) మరియు Amazon Relational Database Service (Amazon RDS) data API events ను కూడా exclude చేయమని సిఫార్సు చేయబడింది. ఈ events యొక్క ఒక కంటే ఎక్కువ copies మీకు అవసరం కాకపోవచ్చు. ఈ high-volume events high costs ను generate చేయగలవు మరియు మీ trails లేదా event data store page లోని management filters లో exclude చేయవచ్చు.

-   **Data Events కోసం Advanced Event Selectors**: మీరు data events ను ఉపయోగించినప్పుడు, advanced event selectors data event logging పై granular control ను అందిస్తాయి. Advanced event selectors partial strings పై pattern matching తో విలువలను include లేదా exclude చేయడానికి కూడా మద్దతు ఇస్తాయి. ఇది మీరు ఏ CloudTrail data events ను లాగ్ చేయాలి మరియు చెల్లించాలి అనే దానిపై enhanced control ను అందిస్తుంది. ఉదాహరణకు, మీరు receive చేసే CloudTrail events ను కేవలం destructive actions కు narrow down చేయడానికి Amazon S3 DeleteObject APIs ను లాగ్ చేయవచ్చు. ఇది costs ను control చేస్తూ security issues ను గుర్తించడంలో సహాయపడుతుంది.

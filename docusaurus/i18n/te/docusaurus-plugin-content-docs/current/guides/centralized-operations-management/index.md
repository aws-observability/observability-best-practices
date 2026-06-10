---
sidebar_position: 6
---

# కేంద్రీకృత ఆపరేషన్ల నిర్వహణ

## కేంద్రీకృత ఆపరేషన్ల నిర్వహణ అంటే ఏమిటి?

AWS ఒక [centralized operations management](https://aws.amazon.com/cloudops/centralized-operations-management/) సొల్యూషన్ అందిస్తుంది, దీనిని మీరు AWS, on-premises, hybrid environments మరియు edge లో మీ అప్లికేషన్లను నిర్వహించడానికి మరియు ఆపరేట్ చేయడానికి ఉపయోగించవచ్చు. ఆటోమేషన్, ఇంటిగ్రేషన్లు, బిల్ట్-ఇన్ బెస్ట్ ప్రాక్టీసెస్ మరియు hybrid సామర్థ్యాలతో ఒక కేంద్ర స్థానం నుండి మీ అప్లికేషన్లను ఆపరేట్ చేయండి. సమర్థత మరియు స్థిరత్వాన్ని మెరుగుపరచడానికి మీ IT Service Management (ITSM) టూల్స్ మెరుగుపరచాలనుకుంటే, మీ ప్రస్తుత integrations మరియు investments ను ఆటోమేట్ చేయడానికి AWS ను ఉపయోగించవచ్చు, అదే సమయంలో operations కోసం ఆల్-ఇన్-వన్ టూల్ ఉపయోగించవచ్చు.

కస్టమర్లు on-premises, hybrid మరియు AWS కోసం తమ resources ను స్కేల్‌లో నిర్వహించడానికి మరియు ఆపరేట్ చేయడానికి [AWS Systems Manager](https://aws.amazon.com/systems-manager/) ను ఉపయోగిస్తారు. Systems Manager nodes (ఉదా., Amazon EC2 instances, ఇతర clouds లోని nodes మరియు on-premises nodes) పై security-related updates తో patching, SSH keys నిర్వహించకుండా లేదా bastion hosts నిర్వహించకుండా nodes కు connecting, మరియు స్కేల్‌లో operational commands ఆటోమేట్ చేయడం వంటి ఆపరేషనల్ tasks సులభతరం చేస్తుంది. AWS లో, on-premises, hybrid మరియు AWS లో పూర్తిగా పనిచేస్తున్న SSM Agent ఉన్నప్పుడు ఒక node managed గా పరిగణించబడుతుంది.

Systems Manager యొక్క core functionality use cases పై కేంద్రీకరించబడింది. AWS Systems Manager features ను ఉపయోగించడానికి agent ప్రధాన component. Systems Manager ద్వారా ఒక node managed అయిన తర్వాత, Remote Management, Patch Management మరియు Session Management వంటి ఇతర features అన్‌లాక్ చేయగలుగుతారు, అదే సమయంలో operational tasks ఆటోమేట్ చేయగలుగుతారు.

![AWS Systems Manager](/img/cloudops/guides/centralized-operations-management/BP-SSM-1.png "AWS Systems Manager")

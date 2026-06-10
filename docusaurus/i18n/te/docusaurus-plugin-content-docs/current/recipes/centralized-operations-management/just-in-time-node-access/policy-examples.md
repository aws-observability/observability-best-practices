---
sidebar_position: 4
---

# JITNA Cedar పాలసీ ఉదాహరణలు

ఈ విభాగంలో Systems Manager just-in-time node access (JITNA) ఉపయోగించేటప్పుడు పాలసీ ఉదాహరణల నమూనాల సేకరణ ఉంది. just-in-time node session requests కు automatic access ను permit లేదా forbid చేయడానికి Cedar policies ఎలా implement చేయాలో AWS కస్టమర్లకు అవగాహన కల్పించడానికి ఈ నమూనాలు రూపొందించబడ్డాయి.

just-in-time node access కోసం schema గురించి మరింత సమాచారం కోసం, [auto-approval మరియు deny-access policies కోసం Statement structure మరియు built-in operators](https://docs.aws.amazon.com/systems-manager/latest/userguide/auto-approval-deny-access-policy-statement-structure.html) చూడండి. [Cedar playground](https://www.cedarpolicy.com/en/playground) లో Cedar policies రాయడం గురించి మరింత నేర్చుకోండి.

దయచేసి ఇది sample code అని మరియు production environment లో ఏదైనా ఉపయోగించడానికి ముందు development environment లో క్షుణ్ణంగా test మరియు validate చేయాలని గుర్తుంచుకోండి.

## on-call IDC group కోసం production nodes కు automatic access ను permit చేయడం

ఈ క్రింది ఉదాహరణ automatic access ను permit చేస్తుంది:

* development nodes కు ఏ identity కైనా, tag key-value pair `Environment:DEV` ద్వారా గుర్తించబడుతుంది.
* production nodes కు AWS Identity Center (IDC) group **OnCall** లోని users, tag key-value pair `Environment:PROD` ద్వారా గుర్తించబడుతుంది.

```language=cedar
// DEV nodes కు automatic access permit చేయడం
permit (principal, 
      action == AWS::SSM::Action::"getTokenForInstanceAccess", 
      resource)
    when {
    resource.hasTag("Environment") && 
    resource.getTag("Environment") == "DEV"
    };

// OnCall users కోసం PROD nodes కు automatic access permit చేయడం
// OnCall IDC Group ID: 34688438-1061-702c-a03d-1fa788dccfd1
permit (principal in AWS::IdentityStore::Group::"34688438-1061-702c-a03d-1fa788dccfd1", 
      action == AWS::SSM::Action::"getTokenForInstanceAccess", 
      resource)
    when {
    resource.hasTag("Environment") && 
    resource.getTag("Environment") == "PROD"
    };
```

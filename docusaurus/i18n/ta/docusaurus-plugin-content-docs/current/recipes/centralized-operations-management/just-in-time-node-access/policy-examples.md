---
sidebar_position: 4
---

# JITNA Cedar policy எடுத்துக்காட்டுகள்

இந்த பிரிவு Systems Manager just-in-time node access (JITNA) ஐப் பயன்படுத்தும் போது policy எடுத்துக்காட்டுகளின் மாதிரிகளின் தொகுப்பை உள்ளடக்கியது. Just-in-time node session கோரிக்கைகளுக்கு தானியங்கி அணுகலை அனுமதிக்க அல்லது தடை செய்ய Cedar policies களை எவ்வாறு செயல்படுத்துவது என்பதை AWS வாடிக்கையாளர்களுக்கு கற்பிக்க இந்த மாதிரிகள் வடிவமைக்கப்பட்டுள்ளன.

Just-in-time node access க்கான schema பற்றிய கூடுதல் தகவலுக்கு, [auto-approval மற்றும் deny-access policies க்கான statement structure மற்றும் built-in operators](https://docs.aws.amazon.com/systems-manager/latest/userguide/auto-approval-deny-access-policy-statement-structure.html) ஐப் பார்க்கவும். [Cedar playground](https://www.cedarpolicy.com/en/playground) இல் Cedar policies எழுதுவது பற்றி மேலும் அறியுங்கள்.

இது மாதிரி குறியீடு என்பதையும், உற்பத்தி சூழலில் பயன்படுத்துவதற்கு முன் மேம்பாட்டு சூழலில் முழுமையாக சோதிக்கப்பட்டு சரிபார்க்கப்பட வேண்டும் என்பதையும் நினைவில் கொள்ளுங்கள்.

## On-call IDC குழுவிற்கு production nodes க்கு தானியங்கி அணுகலை அனுமதித்தல்

பின்வரும் எடுத்துக்காட்டு தானியங்கி அணுகலை அனுமதிக்கிறது:

* `Environment:DEV` tag key-value pair ஆல் அடையாளம் காணப்படும் development nodes க்கு எந்த identity க்கும்.
* `Environment:PROD` tag key-value pair ஆல் அடையாளம் காணப்படும் production nodes க்கு AWS Identity Center (IDC) குழு **OnCall** இல் உள்ள பயனர்களுக்கு.

```language=cedar
// Permit automatic access to DEV nodes
permit (principal, 
      action == AWS::SSM::Action::"getTokenForInstanceAccess", 
      resource)
    when {
    resource.hasTag("Environment") && 
    resource.getTag("Environment") == "DEV"
    };

// Permit automatic access to PROD nodes for OnCall users
// OnCall IDC Group ID: 34688438-1061-702c-a03d-1fa788dccfd1
permit (principal in AWS::IdentityStore::Group::"34688438-1061-702c-a03d-1fa788dccfd1", 
      action == AWS::SSM::Action::"getTokenForInstanceAccess", 
      resource)
    when {
    resource.hasTag("Environment") && 
    resource.getTag("Environment") == "PROD"
    };
```

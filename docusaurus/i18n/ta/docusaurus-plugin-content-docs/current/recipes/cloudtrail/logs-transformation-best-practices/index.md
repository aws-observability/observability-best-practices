# CloudWatch Logs Transformation மூலம் CloudTrail செறிவூட்டல்

## அறிமுகம்

[AWS CloudTrail](https://docs.aws.amazon.com/awscloudtrail/latest/userguide/cloudtrail-user-guide.html) AWS API செயல்பாட்டின் விரிவான தணிக்கை கவரேஜை வழங்குகிறது, நிறுவனங்களுக்கான முழுமையான பாதுகாப்பு மற்றும் இணக்கத்தன்மை அடித்தளத்தை உருவாக்குகிறது. இந்த லாக்குகளை [Amazon CloudWatch Logs](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/WhatIsCloudWatchLogs.html)-க்கு வழங்கும்போது, [CloudWatch Logs Transformation](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/CloudWatch-Logs-Transformation.html) தனிப்பயன் Lambda ஃபங்ஷன்கள், வெளிப்புற ETL pipelines அல்லது post-processing scripts இல்லாமல் CloudTrail தரவை செறிவூட்டவும் உகப்பாக்கவும் நிறுவனங்களை அனுமதிக்கிறது.

declarative JSON processor கட்டமைப்புகளைப் பயன்படுத்தி, CloudTrail நிகழ்வுகள் CloudWatch Logs-க்குள் பாயும்போது nested fields-ஐ parse செய்யலாம், பாதுகாப்பு சூழலைச் சேர்க்கலாம், ரிசோர்ஸ்களை வகைப்படுத்தலாம், downstream delivery-க்கு தரவை உகப்பாக்கலாம். இந்த வழிகாட்டி AWS-native லாக் மேலாண்மையின் எளிமை மற்றும் நம்பகத்தன்மையை பராமரிக்கும் அதே நேரத்தில் பாதுகாப்பு கண்காணிப்பு, இணக்கத்தன்மை அறிக்கையிடல் மற்றும் செயல்பாட்டு செயல்திறனுக்கான நடைமுறை transformation patterns-ஐ விளக்குகிறது.

## இது ஏன் முக்கியம்

[CloudTrail லாக்குகளை CloudWatch Logs-க்கு வழங்கும்](https://docs.aws.amazon.com/awscloudtrail/latest/userguide/send-cloudtrail-events-to-cloudwatch-logs.html) நிறுவனங்களுக்கு குறிப்பிட்ட செயல்பாட்டு பணிப்பாய்வுகள் மற்றும் கருவித் தேவைகளுடன் ஒத்துப்போக இந்த தரவை மேம்படுத்த வேண்டியிருக்கும்:

- **பாதுகாப்பு குழுக்கள்** அச்சுறுத்தல் கண்டறிதல் பணிப்பாய்வுகளை துரிதப்படுத்த தனிப்பயன் ஆபத்து குறிகாட்டிகள் மற்றும் வகைப்படுத்தல் tags-ஐ சேர்க்க விரும்புகின்றன
- **இணக்கத்தன்மை குழுக்கள்** தணிக்கை பதில்களை எளிதாக்க ஒழுங்குமுறை framework (PCI-DSS, HIPAA, SOC2) மூலம் நிகழ்வுகளை முன்-வகைப்படுத்த வேண்டும்
- **செயல்பாட்டுக் குழுக்கள்** சூழல் labels, செலவு மையங்கள் அல்லது குழு உரிமை போன்ற வணிக சூழலை CloudTrail-ன் தொழில்நுட்ப நிகழ்வு தரவுடன் சேர்க்க விரும்புகின்றன

## தீர்வு

CloudWatch Logs Transformation தனிப்பயன் உள்கட்டமைப்பை நீக்கி உடனடி செயல்பாட்டு மதிப்பை வழங்கும் native, நிகழ்நேர செறிவூட்டல் திறன்களை வழங்குவதன் மூலம் இந்த சவால்களை எதிர்கொள்கிறது.

### பொதுவான பயன்பாட்டு நிகழ்வுகள் மற்றும் தீர்வுகள்

#### 1. முக்கியமான ரிசோர்ஸ் அடையாளத்திற்கான S3 தரவு வகைப்படுத்தல்

**சவால்**: ஒவ்வொரு ARN-ஐயும் கைமுறையாக ஆய்வு செய்யாமல் எந்த CloudTrail நிகழ்வுகள் முக்கியமான அல்லது production S3 பக்கெட்களை உள்ளடக்குகின்றன என்பதை விரைவாக அடையாளம் காண பாதுகாப்பு குழுக்கள் போராடுகின்றன.

**தீர்வு**: பக்கெட் பெயரிடல் patterns-ன் அடிப்படையில் S3 ரிசோர்ஸ்களை தானாக வகைப்படுத்தவும்.

```json
[
  {
    "parseJSON": {
      "source": "@message"
    }
  },
  {
    "copyValue": {
      "entries": [
        {
          "source": "resources.0.ARN",
          "target": "data_classification"
        }
      ]
    }
  },
  {
    "substituteString": {
      "entries": [
        {
          "source": "data_classification",
          "from": ".*-prod-.*",
          "to": "sensitive"
        },
        {
          "source": "data_classification",
          "from": "^arn:aws:s3:::.*",
          "to": "normal"
        }
      ]
    }
  }
]
```

**நன்மை**: முக்கியமான ரிசோர்ஸ் அணுகலை உடனடியாக அடையாளம் காண பாதுகாப்பு ஆய்வாளர்கள் `data_classification` புலத்தின் மூலம் வடிகட்டலாம்.

#### 2. SIEM ஒருங்கிணைப்புக்காக Nested Fields-ஐ தட்டையாக்குதல்

**சவால்**: SIEM கருவிகளுக்கு தட்டையான field structures தேவை.

**தீர்வு**: பொதுவாக வினவப்படும் nested fields-ஐ extract செய்து தட்டையாக்கவும்.

```json
[
  {
    "parseJSON": {
      "source": "@message"
    }
  },
  {
    "copyValue": {
      "entries": [
        {
          "source": "userIdentity.type",
          "target": "user_type",
          "overwriteIfExists": true
        },
        {
          "source": "sourceIPAddress",
          "target": "source_ip",
          "overwriteIfExists": true
        }
      ]
    }
  }
]
```

#### 3. Field குறைப்பு மூலம் உகப்பாக்கப்பட்ட Downstream Delivery

**தீர்வு**: Subscription filters மூலம் forward செய்வதற்கு முன் fields-ஐ நீக்கவும்.

```json
[
  {
    "parseJSON": {
      "source": "@message"
    }
  },
  {
    "deleteKeys": {
      "withKeys": [
        "responseElements",
        "requestParameters"
      ]
    }
  }
]
```

:::info
**முக்கியம்**: அசல் மற்றும் transformed லாக்குகள் இரண்டும் CloudWatch Logs-ல் சேமிக்கப்படுகின்றன. Subscription filters transformed பதிப்பை forward செய்கின்றன, downstream சிஸ்டங்களில் செலவு சேமிப்பை செயல்படுத்துகின்றன.
:::

#### 4. Root User செயல்பாடு கண்டறிதல்

**தீர்வு**: root user கண்டறிதலுக்கான வெளிப்படையான boolean flag-ஐ சேர்க்கவும்.

```json
[
  {
    "parseJSON": {
      "source": "@message"
    }
  },
  {
    "copyValue": {
      "entries": [
        {
          "source": "userIdentity.type",
          "target": "is_root_user",
          "overwriteIfExists": true
        }
      ]
    }
  },
  {
    "substituteString": {
      "entries": [
        {
          "source": "is_root_user",
          "from": "Root",
          "to": "true"
        },
        {
          "source": "is_root_user",
          "from": "(IAMUser|AssumedRole|FederatedUser|AWSAccount|AWSService)",
          "to": "false"
        }
      ]
    }
  }
]
```

## சிறந்த நடைமுறைகள்

### வடிவமைப்பு கொள்கைகள்

1. **எளிமையாகத் தொடங்கவும்**: அடிப்படை transformations-உடன் தொடங்கி தேவைக்கேற்ப சிக்கலான்மையைச் சேர்க்கவும்
2. **முழுமையாக சோதிக்கவும்**: production deployment-க்கு முன் மாதிரி CloudTrail நிகழ்வுகளுடன் transformations-ஐ சரிபார்க்கவும்
3. **Patterns-ஐ ஆவணப்படுத்தவும்**: regex patterns மற்றும் அவற்றின் நோக்கம் கொண்ட matches-ன் ஆவணத்தை பராமரிக்கவும்
4. **Version Control**: மாற்ற மேலாண்மைக்கு source control-ல் transformation configurations-ஐ கண்காணிக்கவும்

### செலவு மேலாண்மை

1. **Downstream Delivery-ஐ உகப்பாக்கவும்**: subscription filters மூலம் வெளிப்புற சிஸ்டங்களுக்கு forward செய்வதற்கு முன் தேவையற்ற fields-ஐ நீக்கவும்
2. **சேமிப்பு vs வினவல் செயல்திறன் சமநிலை**: கூடுதல் enriched fields சேமிப்பதற்கும் வினவல் சிக்கலான்மைக்கும் இடையிலான trade-offs-ஐ கருத்தில் கொள்ளவும்

## செயல்படுத்தல் படிகள்

1. **தேவைகளை அடையாளம் காணவும்**: எந்த [CloudTrail fields](https://docs.aws.amazon.com/awscloudtrail/latest/userguide/cloudtrail-event-reference-record-contents.html) செறிவூட்டல் அல்லது மாற்றம் தேவை என்பதை தீர்மானிக்கவும்
2. **Transformation Logic-ஐ வடிவமைக்கவும்**: processor chain மற்றும் எதிர்பார்க்கப்படும் விளைவுகளை வரைபடமிடவும்
3. **சோதனை நிகழ்வுகளை உருவாக்கவும்**: சரிபார்ப்புக்கான மாதிரி CloudTrail நிகழ்வுகளை உருவாக்கவும்
4. **Transformation-ஐ கட்டமைக்கவும்**: உங்கள் log group-க்கு [processor configuration-ஐ பயன்படுத்தவும்](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/CloudWatch-Logs-Transformation.html#CloudWatch-Logs-Transformation-Permissions)
5. **முடிவுகளை சரிபார்க்கவும்**: சரியான processing-ஐ சரிபார்க்க [CloudWatch Logs Insights](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/AnalyzingLogData.html)-ஐ பயன்படுத்தி transformed லாக்குகளை வினவவும்
6. **கண்காணிக்கவும் மற்றும் மேம்படுத்தவும்**: செயல்பாட்டு feedback-ன் அடிப்படையில் transformations-ஐ தொடர்ந்து மேம்படுத்தவும்

## முடிவுரை

CloudWatch Logs Transformation நிறுவனங்களுக்கு CloudWatch Logs-க்கு வழங்கப்படும் CloudTrail தரவின் மதிப்பை அதிகரிக்க உதவுகிறது - ingestion நேரத்தில் நிகழ்வுகளை பாதுகாப்பு சூழலுடன் செறிவூட்டுவது, சிக்கலான JSON structures-ஐ தட்டையாக்குவது மற்றும் downstream delivery-ஐ உகப்பாக்குவது - அனைத்தும் native AWS திறன்கள் மூலம்.

---
sidebar_position: 4
---
# AWS Config செலவு உகப்பாக்கம்

### விலை நிர்ணயம்

[AWS Config pricing](https://aws.amazon.com/config/pricing/) முதன்மையாக இரண்டு முக்கிய dimensions-ன் அடிப்படையில் அமைந்துள்ளது:

1. Configuration Item Recording:

    * Continuous Recording
        உங்கள் AWS சூழலில் ஒவ்வொரு configuration மாற்றத்தையும் நிகழ்நேரத்தில் தொடர்ந்து கண்காணிக்கிறது மற்றும் பதிவு செய்கிறது.
    * Periodic Recording
        உங்கள் resource configurations-ன் தினசரி snapshots-ஐ எடுக்கிறது, முந்தைய 24-மணி நேர நிலையிலிருந்து வேறுபடும்போது மட்டும் மாற்றங்களை பதிவு செய்கிறது.

1. Rule மற்றும் Conformance Pack Evaluations:
    AWS Config config rule evaluations-க்கு கட்டணம் விதிக்கிறது.

### செலவு உகப்பாக்க பரிந்துரைகள்

#### Config செலவுகளை பகுப்பாய்வு செய்தல்

[AWS Cost Explorer](https://aws.amazon.com/aws-cost-management/aws-cost-explorer/) service usage-ஐ filter செய்து cost dimensions-ஐ பகுப்பாய்வு செய்வதன் மூலம் AWS Config செலவுகளில் நுண்ணறிவுகளை வழங்குகிறது.

![AWS Config Cost Visualization](/img/cloudops/guides/config/configcost.png)

#### Continuous மற்றும் Periodic Recording இடையே தேர்வு செய்தல்

AWS Config-ஐ செயல்படுத்தும்போது, compliance தேவைகளுடன் செலவுகளை சமநிலைப்படுத்த சரியான recording method-ஐ தேர்ந்தெடுப்பது முக்கியமானது. [Continuous recording](https://docs.aws.amazon.com/config/latest/developerguide/config-concepts.html#continuous-recording) resources ஒப்பீட்டளவில் நிலையான static workloads-க்கு பெரும்பாலும் அதிக cost-effective ஆகும். [Periodic recording](https://docs.aws.amazon.com/config/latest/developerguide/config-concepts.html#periodic-recording) containerized environments-ல் ephemeral resources போன்ற highly dynamic workloads-க்கு அதிக economical ஆக இருக்கலாம்.

#### Resource Exclusion

AWS Config [resource exclusion](https://docs.aws.amazon.com/config/latest/developerguide/select-resources.html) capability மூலம் செலவு உகப்பாக்கத்தை வழங்குகிறது, உங்கள் configuration monitoring செலவுகளை strategically நிர்வகிக்க நிறுவனங்களை அனுமதிக்கிறது.

#### Rule Management மற்றும் Evaluation Considerations

AWS Config rules-ஐ நிர்வகிக்கும்போது, rule deletion மற்றும் re-evaluation actions-ஐ கருத்தில் கொள்ளவும், ஏனெனில் இவை செலவுகளை கணிசமாக பாதிக்கலாம்.

#### API Call Optimization

Resources-ஐ modify செய்யும்போது, பல individual calls செய்வதை விட ஒரே API call-ல் மாற்றங்களை consolidate செய்வது பரிந்துரைக்கப்படுகிறது.

#### Conformance Pack மற்றும் Rule Deduplication

Redundancy-ஐ நீக்க rules மற்றும் [conformance packs](https://docs.aws.amazon.com/config/latest/developerguide/conformance-packs.html)-ன் regular auditing அவசியம். [Duplicate AWS Config rules-ஐ கண்டறிய இந்த blog-ஐ பின்பற்றவும்](https://aws.amazon.com/blogs/security/discover-duplicate-aws-config-rules-for-streamlined-compliance/).

#### Global Resource Recording-ஐ உகப்பாக்குதல்

பல regions-ல் AWS Config-ஐ செயல்படுத்தும்போது, செலவுகளைக் கட்டுப்படுத்தவும் duplicate data collection-ஐ தடுக்கவும் global resources-ன் recording-ஐ உகப்பாக்கலாம். சிறந்த நடைமுறை உங்கள் AWS சூழலில் ஒரு single region-க்கு global resource recording-ஐ கட்டுப்படுத்துவதாகும்.

#### Integrated Services Optimization

AWS Config பல்வேறு AWS services-உடன் interact செய்கிறது, ஒவ்வொன்றும் overall cost-க்கு பங்களிக்கிறது. அவற்றின் individual செலவுகளை உகப்பாக்க இந்த integrated services-க்கான சிறந்த நடைமுறைகளை செயல்படுத்தவும்.

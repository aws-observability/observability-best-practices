---
sidebar_position: 1
---
# CloudTrail ஐ இயக்குதல்

AWS CloudTrail உங்கள் AWS உள்கட்டமைப்பு முழுவதும் செயல்பாடுகளை பதிவு செய்யலாம், தொடர்ச்சியாக கண்காணிக்கலாம் மற்றும் கணக்கு செயல்பாட்டை தக்க வைக்கலாம். இது AWS Management Console, AWS SDKs மற்றும் command line tools மூலம் செய்யப்பட்ட API அழைப்புகள் உட்பட உங்கள் கணக்கிற்கான AWS அழைப்புகளின் வரலாற்றையும் வழங்கும். இதன் விளைவாக, நீங்கள் அடையாளம் காணலாம்:

*   CloudTrail ஐ ஆதரிக்கும் சேவைகளுக்கு எந்த பயனர்கள் மற்றும் கணக்குகள் AWS API களை அழைத்தன.
*   அழைப்புகள் செய்யப்பட்ட source IP address.
*   அழைப்புகள் எப்போது நிகழ்ந்தன.

உங்கள் AWS கணக்கை உருவாக்கும் போது CloudTrail இயக்கப்படுகிறது மற்றும் கடந்த 90 நாட்களின் அனைத்து management event செயல்பாடுகளின் event history ஐ வழங்குகிறது. 90 நாட்களுக்கு மேல் events ஐ தக்கவைக்க trail அல்லது Lake க்கான event data store ஐ உருவாக்க AWS பரிந்துரைக்கிறது. CloudTrail க்கான சில ஒட்டுமொத்த சிறந்த நடைமுறைகள் கீழே கொடுக்கப்பட்டுள்ளன.

### CloudTrail க்கு பாதுகாப்பு அல்லது logging கணக்கை delegated administrator ஆக பதிவு செய்யவும்

CloudTrail நிறுவனத்தின் trails மற்றும் Lake event data stores ஐ நிர்வகிக்க 3 delegated administrators வரை கட்டமைக்க அனுமதிக்கிறது. Delegated administrator நிறுவனத்தின் சார்பாக resources ஐ நிர்வகிக்க அனுமதி பெற்றவர்.

### அசாதாரண API செயல்பாட்டை கண்காணிக்க CloudTrail Insights ஐ பயன்படுத்தவும்

AWS CloudTrail Insights CloudTrail management events ஐ தொடர்ச்சியாக பகுப்பாய்வு செய்வதன் மூலம் API அழைப்புகளுடன் தொடர்புடைய அசாதாரண செயல்பாட்டை அடையாளம் காணவும் பதிலளிக்கவும் AWS பயனர்களுக்கு உதவுகிறது. CloudTrail Insights Event Bridge உடன் ஒருங்கிணைகிறது, இது மின்னஞ்சல் அறிவிப்பை அனுப்புதல் அல்லது Lambda function ஐ தூண்டுதல் போன்ற குறிப்பிட்ட செயல்களை தூண்ட விதிகளை உருவாக்க அனுமதிக்கிறது.

![CloudTrail Insights](/img/cloudops/guides/cloudtrail/cloudtrail-insights.png "CloudTrail Insights")

### CloudTrail செலவுகளை நிர்வகித்தல்

CloudTrail ஐ பயன்படுத்தும் போது, உங்கள் CloudTrail செலவினத்தை நிர்வகிக்க உதவும் பகுதிகளை கருத்தில் கொள்ளுங்கள். CloudTrail க்கான செலவை கட்டுப்படுத்த உதவும் சில சிறந்த நடைமுறைகள்:

-   **AWS Budgets**: AWS Budgets உங்கள் CloudTrail செலவினத்தை கண்காணிக்க உதவுகிறது. CloudTrail சேவையின் அடிப்படையில் AWS Budgets இல் செலவு அடிப்படையிலான budget ஐ அமைக்கலாம்.

![AWS Budgets](/img/cloudops/guides/cloudtrail/cloudtrail-budgets.png "AWS Budgets")

-   **AWS Cost Anomaly Detection**: AWS Cost Anomaly Detection உங்கள் நிறுவனம் முழுவதும் AWS செலவினத்தில் எதிர்பாராத உயர்வுகளை அடையாளம் காணவும் தீர்க்கவும் உதவுகிறது.

-   **CloudTrail S3 bucket க்கு SSE-KMS தொடர்பான செலவை குறைக்க Amazon S3 Bucket Keys ஐ பயன்படுத்தவும்**: Object-level keys ஐ பயன்படுத்தும் போது, Amazon S3 Bucket Keys க்கு மாறுவதை கருத்தில் கொள்ளுங்கள், இது AWS KMS request costs ஐ 99% வரை குறைக்க உதவும்.

-   **Multiple Trails**: முதல் management events நகல் AWS Free Tier உடன் சேர்க்கப்படுகிறது. கூடுதல் trails க்கு CloudTrail Lake ஐ பயன்படுத்துவது கூடுதல் management events நகல்களுக்கான செலவை 90% வரை குறைக்கலாம்.

-   **Data Events க்கு Advanced Event Selectors**: Data events ஐ பயன்படுத்தும் போது, advanced event selectors data event logging இன் நுணுக்கமான கட்டுப்பாட்டை வழங்கும்.

---
sidebar_position: 2
---
# Resource configuration கண்காணிப்பு

AWS Config [ஆதரிக்கப்படும் AWS resources](https://docs.aws.amazon.com/config/latest/developerguide/resource-config-reference.html)-ன் configuration-ஐ பதிவு செய்து கண்காணிக்கிறது, இந்த resources-ன் inventory-ஐ அவற்றின் தற்போதைய மற்றும் வரலாற்று configurations-உடன் உங்கள் AWS கணக்கில் உருவாக்குகிறது. இது configuration மாற்றங்களின் timeline-ஐ உருவாக்குகிறது, resource attributes, relationships மற்றும் dependencies பற்றிய விரிவான தகவல்களை உங்கள் AWS infrastructure முழுவதும் பராமரிக்கிறது.

![AWS Config Cost Visualization](/img/cloudops/guides/config/resourcetimeline.png)

### AWS Config custom resources

AWS Config ஆதரிக்கப்படும் AWS resources-க்கு அப்பால் [custom config resources](https://docs.aws.amazon.com/config/latest/developerguide/customresources.html) மூலம் configuration tracking capabilities-ஐ நீட்டிக்க அனுமதிக்கிறது. இந்த அம்சம் ஆதரிக்கப்படாத AWS resources-ஐ கண்காணிக்கவும், on-premises servers, GitHub repositories மற்றும் பிற third-party resources போன்ற external resources-ஐ கண்காணிக்கவும் உதவுகிறது.

AWS Config-ஐ பயன்படுத்தி non-standard features-ஐ எவ்வாறு கண்காணிப்பது என்பதை அறிய [இந்த blog post](https://aws.amazon.com/blogs/mt/using-aws-config-custom-resources-to-track-any-resource-on-aws/)-ஐ பின்பற்றவும். பிற cloud providers-ல் host செய்யப்பட்ட resources-ஐ எவ்வாறு கண்காணிப்பது என்பதற்கான walk-through-ஐ [இந்த blog post](https://aws.amazon.com/blogs/mt/simplify-compliance-management-of-multicloud-or-hybrid-resources-with-aws-config/) வழங்குகிறது.

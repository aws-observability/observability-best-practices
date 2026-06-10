---
sidebar_position: 2
---

# AIOps

கிளவுட் செயல்பாடுகளை மேம்படுத்த AI மற்றும் இயந்திர கற்றலைப் பயன்படுத்துதல் — அசாதாரண கண்டறிதல், தானியங்கு மூல காரண பகுப்பாய்வு, முன்கணிப்பு எச்சரிக்கை மற்றும் அறிவார்ந்த சரிசெய்தல்.

## AIOps க்கான AWS சேவைகள்

- **[Amazon DevOps Guru](https://aws.amazon.com/devops-guru/)** — அசாதாரண பயன்பாட்டு நடத்தையை கண்டறிந்து சரிசெய்தலை பரிந்துரைக்க ML-இயக்கப்பட்ட நுண்ணறிவுகள்
- **[CloudWatch Anomaly Detection](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch_Anomaly_Detection.html)** — மெட்ரிக்குகளை தொடர்ந்து பகுப்பாய்வு செய்து அசாதாரணங்களை கண்டறிய ML வழிமுறைகளை பயன்படுத்துகிறது
- **[CloudWatch Application Signals](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-Application-Monitoring-Sections.html)** — பயன்பாட்டு சேவைகள் மற்றும் அவற்றின் சார்புகளை தானாகவே கண்டறிந்து கண்காணிக்கிறது
- **[Amazon Q Developer செயல்பாட்டு ஆய்வுகள்](https://docs.aws.amazon.com/amazonq/latest/qdeveloper-ug/operational-investigation.html)** — செயல்பாட்டு சிக்கல்களின் AI-உதவி ஆய்வு

## சிறந்த நடைமுறைகள்

- உள்கட்டமைப்புக்கு விரிவாக்குவதற்கு முன் முக்கிய வணிக மெட்ரிக்குகளில் அசாதாரண கண்டறிதலுடன் தொடங்கவும்
- தனிப்பட்ட ML-அடிப்படையிலான கண்டறிவிகளிலிருந்து சத்தத்தை குறைக்க composite alarms ஐ பயன்படுத்தவும்
- AIOps சிக்னல்களை மனித தீர்ப்புடன் இணைக்கவும் — சிக்கல்களை வெளிக்கொணர ML ஐ பயன்படுத்தவும், மதிப்பாய்வு இல்லாமல் முக்கியமான அமைப்புகளை தானாக சரிசெய்ய வேண்டாம்
- AI-உதவி ஆய்வுகளை மேம்படுத்த செயல்பாட்டு runbooks மற்றும் கடந்தகால சம்பவ தரவை ஊட்டவும்

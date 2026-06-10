# Amazon Managed Service for Prometheus

[Prometheus](https://prometheus.io/) என்பது கணினி நோடுகள் மற்றும் அப்ளிகேஷன் தொடர்பான செயல்திறன் தரவு போன்ற ரிசோர்ஸ்கள் பற்றிய விரிவான மெட்ரிக்குகள் திறன்களையும் நுண்ணறிவுகளையும் வழங்கும் பிரபலமான ஓப்பன் சோர்ஸ் கண்காணிப்பு கருவியாகும்.

Prometheus தரவை சேகரிக்க *pull* மாடலைப் பயன்படுத்துகிறது, CloudWatch *push* மாடலைப் பயன்படுத்துகிறது. Prometheus மற்றும் CloudWatch சில ஒன்றுடன் ஒன்று மேலோட்டமான பயன்பாட்டு நிலைகளுக்கு பயன்படுத்தப்படுகின்றன, ஆனால் அவற்றின் செயல்பாட்டு மாடல்கள் மிகவும் வேறுபட்டவை மற்றும் வேறுபட்ட விலையிடல் கொண்டவை.

[Amazon Managed Service for Prometheus](https://aws.amazon.com/prometheus/) Kubernetes மற்றும் [Amazon ECS](https://aws.amazon.com/ecs/)-ல் ஹோஸ்ட் செய்யப்பட்ட கண்டெய்னர் அப்ளிகேஷன்களில் பரவலாகப் பயன்படுத்தப்படுகிறது.

[CloudWatch ஏஜெண்ட்](./cloudwatch_agent.md) அல்லது [AWS Distro for OpenTelemetry](https://aws-otel.github.io/) ஐ பயன்படுத்தி உங்கள் EC2 இன்ஸ்டன்ஸ் அல்லது ECS/EKS கிளஸ்டரில் Prometheus மெட்ரிக் திறன்களை சேர்க்கலாம். Prometheus ஆதரவுடன் கூடிய CloudWatch ஏஜெண்ட், அப்ளிகேஷன் செயல்திறன் சீரழிவு மற்றும் தோல்விகளை விரைவாக கண்காணிக்கவும், சரிசெய்யவும், அலாரம் செய்யவும் Prometheus மெட்ரிக்குகளை கண்டறிந்து சேகரிக்கிறது. இது Observability-ஐ மேம்படுத்த தேவையான கண்காணிப்பு கருவிகளின் எண்ணிக்கையையும் குறைக்கிறது.

CloudWatch Container Insights monitoring for Prometheus, கண்டெய்னர் சிஸ்டங்கள் மற்றும் வொர்க்லோடுகளிலிருந்து Prometheus மெட்ரிக்குகளின் கண்டுபிடிப்பை தானியங்கமாக்குகிறது https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/ ContainerInsights-Prometheus.html

# DevOps

ஒரு DevOps பொறியாளராக, உங்கள் பணிப்பாய்வுகளில் வலுவான Observability நடைமுறைகளை ஒருங்கிணைப்பது உயர்-செயல்திறன், நம்பகமான மற்றும் பாதுகாப்பான அமைப்புகளை பராமரிப்பதற்கு மிக முக்கியமானது. இந்த வழிகாட்டி DevOps கண்ணோட்டத்திற்கு ஏற்றவாறு Observability சிறந்த நடைமுறைகளை வழங்குகிறது, தொடர்ச்சியான விநியோக வாழ்க்கை சுழற்சி மற்றும் உள்கட்டமைப்பு மேலாண்மை செயல்முறைகள் முழுவதும் நடைமுறை செயல்படுத்தலில் கவனம் செலுத்துகிறது.

## தொடர்ச்சியான ஒருங்கிணைப்பு மற்றும் விநியோக பைப்லைன்கள் (CI/CD)

உங்கள் CI/CD பைப்லைன்களை Observability-யுடன் மேம்படுத்த:
 
- CI/CD-யின் நம்பகத்தன்மை, கிடைக்கும் தன்மை மற்றும் செயல்திறனை பராமரிக்க [பைப்லைன்](https://docs.aws.amazon.com/codepipeline/latest/userguide/monitoring.html), [பில்ட்](https://docs.aws.amazon.com/codebuild/latest/userguide/monitoring-builds.html) மற்றும் [டிப்ளாய்](https://docs.aws.amazon.com/codedeploy/latest/userguide/monitoring.html) ஆகியவற்றுக்கான கண்காணிப்பை செயல்படுத்தவும்.

- முக்கியமான CI/CD நிகழ்வுகளுக்கு [CloudWatch அலாரங்கள்](https://aws-observability.github.io/observability-best-practices/tools/alarms) உருவாக்கவும். பைப்லைன் தோல்விகள் அல்லது நீண்ட நேரம் இயங்கும் நிலைகள் குறித்து உங்கள் குழுவை எச்சரிக்க Amazon SNS வழியாக அறிவிப்புகளை அமைக்கவும்.

     *  [CodeBuild-ல் CloudWatch அலாரத்தை](https://docs.aws.amazon.com/codebuild/latest/userguide/codebuild_cloudwatch_alarms.html) கட்டமைக்கவும்.
     *  [CodeDeploy-ல் CloudWatch அலாரத்தை](https://docs.aws.amazon.com/codedeploy/latest/userguide/monitoring-create-alarms.html) கட்டமைக்கவும்.
 
- உங்கள் CI/CD பைப்லைன் நிலைகள் முழுவதும் கோரிக்கைகளை ட்ரேஸ் செய்ய [AWS X-Ray](https://aws-observability.github.io/observability-best-practices/tools/xray/) பயன்படுத்தி உங்கள் பைப்லைனை இன்ஸ்ட்ரூமென்ட் செய்யவும்.

- முக்கிய மெட்ரிக்குகளான [CodeBuild](https://docs.aws.amazon.com/codebuild/latest/userguide/monitoring-metrics.html), [CodeDeploy](https://docs.aws.amazon.com/codedeploy/latest/userguide/monitoring-cloudwatch.html) மற்றும் [Pipelines](https://docs.aws.amazon.com/codepipeline/latest/userguide/metrics-dimensions.html) ஆகியவற்றை கண்காணிக்க ஒருங்கிணைக்கப்பட்ட [CloudWatch டாஷ்போர்டுகளை](https://aws-observability.github.io/observability-best-practices/tools/dashboards) உருவாக்கவும்.

## Infrastructure as Code (IaC) நடைமுறைகள்

உங்கள் IaC பணிப்பாய்வுகளில் திறம்பட Observability-க்கு:

- உங்கள் [AWS CloudFormation](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/AWS_CloudWatch.html) டெம்ப்ளேட்களில் [CloudWatch அலாரங்கள்](https://aws-observability.github.io/observability-best-practices/tools/alarms) மற்றும் [டாஷ்போர்டுகளை](https://aws-observability.github.io/observability-best-practices/tools/cloudwatch-dashboard) உட்பொதிக்கவும். இது அனைத்து சூழல்களிலும் நிலையான கண்காணிப்பை உறுதி செய்கிறது.

- மையப்படுத்தப்பட்ட லாகிங்கை செயல்படுத்தவும்: Amazon CloudWatch Logs அல்லது [Amazon OpenSearch Service](https://aws-observability.github.io/observability-best-practices/recipes/aes) போன்ற சேவைகளைப் பயன்படுத்தி [மையப்படுத்தப்பட்ட லாகிங் தீர்வை](https://aws-observability.github.io/observability-best-practices/patterns/multiaccount) அமைக்கவும். உங்கள் IaC டெம்ப்ளேட்களின் ஒரு பகுதியாக லாக் தக்கவைப்பு கொள்கைகள் மற்றும் லாக் குழுக்களை வரையறுக்கவும்.

- பாதுகாப்பு மற்றும் செயல்திறன் பகுப்பாய்விற்கான நெட்வொர்க் போக்குவரத்து தகவலை கைப்பற்ற IaC பயன்படுத்தி [VPC flow logs](https://aws-observability.github.io/observability-best-practices/patterns/vpcflowlogs)-ஐ கட்டமைக்கவும்.

- சிறந்த வள ஒழுங்கமைப்பை எளிதாக்கவும், மேலும் விரிவான கண்காணிப்பு மற்றும் செலவு ஒதுக்கீட்டை செயல்படுத்தவும் உங்கள் [IaC டெம்ப்ளேட்களில்](https://docs.aws.amazon.com/whitepapers/latest/tagging-best-practices/implementing-and-enforcing-tagging.html#cicd-pipeline-managed-resources) நிலையான டேக்கிங் உத்தியைப் பயன்படுத்தவும்.

- பரவலான ட்ரேசிங்கை செயல்படுத்த [AWS X-Ray](https://docs.aws.amazon.com/xray/latest/devguide/creating-resources-with-cloudformation.html)-ஐ பயன்படுத்தி பயன்பாட்டு குறியீட்டுடன் ஒருங்கிணைக்கவும். உங்கள் IaC டெம்ப்ளேட்களில் X-Ray மாதிரி விதிகள் மற்றும் குழுக்களை வரையறுக்கவும்.



## Kubernetes-உடன் கண்டெய்னரைசேஷன் மற்றும் ஆர்கெஸ்ட்ரேஷன்

கண்டெய்னரைஸ் செய்யப்பட்ட பயன்பாடுகள் மற்றும் Kubernetes சூழல்களுக்கு:

- விரிவான கண்டெய்னர் மற்றும் கிளஸ்டர் கண்காணிப்புக்கு [Amazon EKS with Container Insights](https://aws-observability.github.io/observability-best-practices/guides/containers/aws-native/eks/amazon-cloudwatch-container-insights)-ஐ செயல்படுத்தவும்.

- உங்கள் கண்டெய்னரைஸ் செய்யப்பட்ட பயன்பாடுகளிலிருந்து டெலிமெட்ரி தரவை சேகரித்து ஏற்றுமதி செய்ய [AWS Distro for OpenTelemetry](https://aws-observability.github.io/observability-best-practices/guides/operational/adot-at-scale/operating-adot-collector)-ஐ பயன்படுத்தவும்.

- மேம்பட்ட மெட்ரிக் சேகரிப்பு மற்றும் காட்சிப்படுத்தலுக்கு EKS-ல் [Prometheus மற்றும் Grafana](https://aws-observability.github.io/observability-best-practices/patterns/eksampamg)-ஐ செயல்படுத்தவும். எளிதான அமைப்பு மற்றும் மேலாண்மைக்கு AWS Managed Grafana சேவையைப் பயன்படுத்தவும்.

- Kubernetes டிப்ளாய்மென்ட்களுக்கு Flux அல்லது ArgoCD போன்ற கருவிகளைப் பயன்படுத்தி [GitOps](https://aws-observability.github.io/observability-best-practices/guides/operational/gitops-with-amg/#introduction-to-gitops) நடைமுறைகளை செயல்படுத்தவும். உங்கள் GitOps பணிப்பாய்வுகளின் ஒத்திசைவு நிலை மற்றும் ஆரோக்கியத்தை கண்காணிக்க இந்த கருவிகளை CloudWatch-உடன் ஒருங்கிணைக்கவும்.

## CI/CD பைப்லைன்களில் பாதுகாப்பு மற்றும் இணக்கம்

உங்கள் பைப்லைன்களில் பாதுகாப்பு Observability-ஐ மேம்படுத்த:

- தானியங்கி பாதிப்பு மதிப்பீடுகளுக்கு உங்கள் CI/CD செயல்முறையில் [Amazon Inspector](https://aws.amazon.com/inspector/)-ஐ ஒருங்கிணைக்கவும்.

- உங்கள் AWS கணக்குகள் முழுவதும் பாதுகாப்பு எச்சரிக்கைகளை ஒருங்கிணைத்து முன்னுரிமையளிக்க [AWS Security Hub](https://aws.amazon.com/security-hub/)-ஐ செயல்படுத்தவும்.

- வள கட்டமைப்புகள் மற்றும் மாற்றங்களை கண்காணிக்க [AWS Config](https://docs.aws.amazon.com/config/latest/developerguide/aws-config-managed-rules-cloudformation-templates.html)-ஐ பயன்படுத்தவும். உங்கள் வரையறுக்கப்பட்ட தரங்களுக்கான இணக்கத்தை தானாக மதிப்பீடு செய்ய Config விதிகளை அமைக்கவும்.

- புத்திசாலித்தனமான அச்சுறுத்தல் கண்டறிதலுக்கு [Amazon GuardDuty](https://aws.amazon.com/blogs/aws/introducing-amazon-guardduty-extended-threat-detection-aiml-attack-sequence-identification-for-enhanced-cloud-security/)-ஐ பயன்படுத்தவும், அதன் கண்டுபிடிப்புகளை உங்கள் சம்பவ பதில் பணிப்பாய்வுகளுடன் ஒருங்கிணைக்கவும்.

- CloudFormation அல்லது Terraform பயன்படுத்தி AWS WAF விதிகள், Security Hub கட்டுப்பாடுகள் மற்றும் GuardDuty வடிப்பான்களை வரையறுப்பதன் மூலம் பாதுகாப்பை குறியீடாக செயல்படுத்தவும். இது பாதுகாப்பு Observability உங்கள் உள்கட்டமைப்புடன் சேர்ந்து வளர்வதை உறுதி செய்கிறது.

## தானியங்கி சோதனை மற்றும் தர உத்தரவாத உத்திகள்

உங்கள் சோதனை செயல்முறைகளை Observability-யுடன் மேம்படுத்த:

- உங்கள் API-கள் மற்றும் பயனர் பயணங்களை தொடர்ச்சியாக சோதிக்கும் கேனரிகளை உருவாக்க [CloudWatch Synthetics](https://docs.aws.amazon.com/AmazonSynthetics/latest/APIReference/Welcome.html)-ஐ செயல்படுத்தவும்.

- உங்கள் சோதனை தொகுப்புகளை இயக்கவும், போக்கு பகுப்பாய்விற்கு சோதனை முடிவுகளை CloudWatch மெட்ரிக்குகளாக வெளியிடவும் AWS CodeBuild-ஐ பயன்படுத்தவும்.

- சோதனை கட்டங்களில் செயல்திறன் நுண்ணறிவுகளைப் பெற உங்கள் சோதனை சூழல்களில் [AWS X-Ray tracing](https://docs.aws.amazon.com/xray/latest/devguide/xray-console-traces.html)-ஐ செயல்படுத்தவும்.

- உங்கள் பயன்பாடுகளுடன் உண்மையான பயனர் தொடர்புகளிலிருந்து பயனர் அனுபவ தரவை சேகரித்து பகுப்பாய்வு செய்ய Amazon CloudWatch [RUM](https://aws-observability.github.io/observability-best-practices/tools/rum)(Real User Monitoring)-ஐ பயன்படுத்தவும்.

- [AWS Fault Injection Simulator](https://aws.amazon.com/blogs/mt/chaos-engineering-leveraging-aws-fault-injection-simulator-in-a-multi-account-aws-environment/) பயன்படுத்தி கேயாஸ் எஞ்சினியரிங் நடைமுறைகளை செயல்படுத்தவும். உங்கள் அமைப்பின் நெகிழ்திறனை [மேம்படுத்த](https://aws.amazon.com/blogs/aws/monitor-and-improve-your-application-resiliency-with-resilience-hub/) உருவகப்படுத்தப்பட்ட தோல்விகளின் தாக்கத்தை கண்காணிக்கவும்.

## வெளியீட்டு மேலாண்மை மற்றும் டிப்ளாய்மென்ட் சிறந்த நடைமுறைகள்

Observability சார்ந்த வெளியீட்டு மேலாண்மைக்கு:

- டிப்ளாய்மென்ட் கண்காணிப்புக்கான CloudWatch-உடனான ஒருங்கிணைப்பைப் பயன்படுத்தி, நிர்வகிக்கப்பட்ட டிப்ளாய்மென்ட்களுக்கு [AWS CodeDeploy](https://docs.aws.amazon.com/codedeploy/latest/userguide/welcome.html)-ஐ பயன்படுத்தவும்.

- கேனரி டிப்ளாய்மென்ட்களை செய்யவும், உங்கள் உள்கட்டமைப்பின் சிறிய துணைக்குழுவிற்கு புதிய பதிப்புகளை படிப்படியாக விரிவாக்கவும். முழு டிப்ளாய்மென்ட்டிற்கு முன் ஏதேனும் சிக்கல்களைக் கண்டறிய CloudWatch மற்றும் X-Ray பயன்படுத்தி [கேனரி டிப்ளாய்மென்ட்களை](https://aws.amazon.com/blogs/containers/create-a-pipeline-with-canary-deployments-for-amazon-ecs-using-aws-app-mesh/) நெருக்கமாக கண்காணிக்கவும்.

- முன்வரையறுக்கப்பட்ட கண்காணிப்பு வரம்பு மீறப்பட்டால் முந்தைய நிலையான பதிப்புக்கு [தானாக திரும்ப](https://docs.aws.amazon.com/codedeploy/latest/userguide/deployments-rollback-and-redeploy.html) டிப்ளாய்மென்ட்டை கட்டமைக்கவும்.

- உண்மையான பயனர் அமர்வுகளிலிருந்து செயல்திறன் தரவை சேகரித்து பகுப்பாய்வு செய்ய Amazon CloudWatch [RUM](https://aws-observability.github.io/observability-best-practices/tools/rum) (Real User Monitoring)-ஐ பயன்படுத்தவும். இது வெளியீடுகள் இறுதிப் பயனர் அனுபவத்தை எவ்வாறு பாதிக்கின்றன என்பதில் நுண்ணறிவுகளை வழங்குகிறது.

- ஒரு வெளியீட்டிற்குப் பிறகு உடனடியாக ஏதேனும் அசாதாரணங்கள் அல்லது செயல்திறன் சிக்கல்கள் குறித்து உங்கள் குழுவை அறிவிக்க [CloudWatch அலாரங்களை](https://aws-observability.github.io/observability-best-practices/tools/alarms) கட்டமைக்கவும். சரியான நேரத்தில் அறிவிப்புகளுக்கு இந்த அலாரங்களை Amazon SNS-உடன் ஒருங்கிணைக்கவும்.

- AI-சார்ந்த நுண்ணறிவுகளைப் பயன்படுத்தவும், செயல்பாட்டு சிக்கல்களை தானாக கண்டறிந்து வெளியீட்டிற்குப் பின் பயன்பாட்டு ஆரோக்கியம் மற்றும் செயல்திறனை மேம்படுத்துவதற்கான ML-சார்ந்த பரிந்துரைகளைப் பெற [Amazon DevOps Guru](https://aws.amazon.com/blogs/aws/amazon-devops-guru-machine-learning-powered-service-identifies-application-errors-and-fixes/)-ஐ பயன்படுத்தவும்.

- அம்ச கொடிகளை நிர்வகிக்க AWS Systems Manager Parameter Store அல்லது Secrets Manager-ஐ பயன்படுத்தவும், தனிப்பயன் [CloudWatch மெட்ரிக்குகள்](https://docs.aws.amazon.com/secretsmanager/latest/userguide/monitoring-cloudwatch.html) மூலம் அவற்றின் பயன்பாட்டை கண்காணிக்கவும்.


## முடிவுரை

Observability நடைமுறைகளை ஏற்றுக்கொள்வது உங்கள் அமைப்புகளை பராமரிப்பது மட்டுமல்ல—இது செயல்பாட்டு சிறப்பை அடைவதற்கும் உங்கள் நிறுவனத்தில் தொடர்ச்சியான புதுமையை உந்துவதற்கும் ஒரு மூலோபாய நடவடிக்கையாகும். உங்கள் அமைப்புகள் வளரும்போது உங்கள் Observability உத்தியை தொடர்ந்து மேம்படுத்துவதை நினைவில் கொள்ளுங்கள், புதிய AWS அம்சங்கள் மற்றும் சேவைகள் கிடைக்கும்போது அவற்றைப் பயன்படுத்துங்கள்.

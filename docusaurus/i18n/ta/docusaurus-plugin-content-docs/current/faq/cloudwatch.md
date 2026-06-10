# Amazon CloudWatch - அடிக்கடி கேட்கப்படும் கேள்விகள்

## நான் ஏன் Amazon CloudWatch-ஐ தேர்வு செய்ய வேண்டும்?

Amazon CloudWatch என்பது ஒரு AWS கிளவுட் நேட்டிவ் சேவையாகும், இது AWS கிளவுட் வளங்களையும் AWS-இல் நீங்கள் இயக்கும் பயன்பாடுகளையும் கண்காணிப்பதற்கான ஒருங்கிணைந்த observability-ஐ ஒற்றை தளத்தில் வழங்குகிறது. Amazon CloudWatch-ஐ [லாக்குகள்](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/WhatIsCloudWatchLogs.html), [மெட்ரிக்குகள்](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/working_with_metrics.html), [நிகழ்வுகள்](https://docs.aws.amazon.com/AmazonCloudWatch/latest/events/WhatIsCloudWatchEvents.html) மற்றும் [அலாரங்கள்](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/AlarmThatSendsEmail.html) வடிவத்தில் கண்காணிப்பு மற்றும் செயல்பாட்டுத் தரவுகளை சேகரிக்கப் பயன்படுத்தலாம். இது AWS வளங்கள், பயன்பாடுகள் மற்றும் AWS-இல் இயங்கும் சேவைகள் மற்றும் [ஆன்-பிரிமைஸ் சர்வர்களின்](https://aws.amazon.com/blogs/mt/how-to-monitor-hybrid-environment-with-aws-services/) [ஒருங்கிணைந்த காட்சியையும்](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch_Dashboards.html) வழங்குகிறது. Amazon CloudWatch வள பயன்பாடு, பயன்பாட்டு செயல்திறன் மற்றும் உங்கள் பணிச்சுமைகளின் செயல்பாட்டு ஆரோக்கியம் ஆகியவற்றில் கணினி-அளவிலான தெரிவுநிலையை பெற உதவுகிறது. Amazon CloudWatch AWS, ஹைப்ரிட் மற்றும் ஆன்-பிரிமைஸ் பயன்பாடுகள் மற்றும் உள்கட்டமைப்பு வளங்களுக்கு [செயல்படக்கூடிய நுண்ணறிவுகளை](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-Insights-Sections.html) வழங்குகிறது. [Cross-account observability](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-Unified-Cross-Account.html) என்பது CloudWatch-இன் ஒருங்கிணைந்த observability திறனுக்கான கூடுதல் அம்சமாகும்.

## எந்த AWS சேவைகள் Amazon CloudWatch மற்றும் Amazon CloudWatch Logs உடன் நேட்டிவ்வாக ஒருங்கிணைக்கப்பட்டுள்ளன?

Amazon CloudWatch 70+ AWS சேவைகளுடன் நேட்டிவ்வாக ஒருங்கிணைக்கிறது, இது வாடிக்கையாளர்களுக்கு எந்த நடவடிக்கையும் இல்லாமல் எளிமையான கண்காணிப்பு மற்றும் அளவிடுதல் திறனுக்காக உள்கட்டமைப்பு மெட்ரிக்குகளை சேகரிக்க அனுமதிக்கிறது. ஆதரிக்கப்படும் [CloudWatch மெட்ரிக்குகளை வெளியிடும் AWS சேவைகளின்](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/aws-services-cloudwatch-metrics.html) முழுமையான பட்டியலுக்கு ஆவணத்தை சரிபார்க்கவும். தற்போது, 30+ AWS சேவைகள் CloudWatch-க்கு லாக்குகளை வெளியிடுகின்றன. ஆதரிக்கப்படும் [CloudWatch Logs-க்கு லாக்குகளை வெளியிடும் AWS சேவைகளின்](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/aws-services-sending-logs.html) முழுமையான பட்டியலுக்கு ஆவணத்தை சரிபார்க்கவும்.

## எல்லா AWS சேவைகளிலிருந்தும் Amazon CloudWatch-க்கு வெளியிடப்பட்ட அனைத்து மெட்ரிக்குகளின் பட்டியலை எங்கே பெறுவது?

Amazon CloudWatch-க்கு [மெட்ரிக்குகளை வெளியிடும் அனைத்து AWS சேவைகளின்](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/aws-services-cloudwatch-metrics.html) பட்டியல் AWS ஆவணத்தில் உள்ளது.

## Amazon CloudWatch-க்கு மெட்ரிக்குகளை சேகரித்து கண்காணிக்க எங்கே தொடங்குவது?

[Amazon CloudWatch மெட்ரிக்குகளை சேகரிக்கிறது](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/working_with_metrics.html), இவை பல்வேறு AWS சேவைகளிலிருந்து [AWS Management Console, AWS CLI அல்லது API](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/viewing_metrics_with_cloudwatch.html) மூலம் பார்க்கலாம். Amazon CloudWatch Amazon EC2 இன்ஸ்டன்ஸ்களுக்கான [கிடைக்கும் மெட்ரிக்குகளை](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/viewing_metrics_with_cloudwatch.html) சேகரிக்கிறது. கூடுதல் கஸ்டம் மெட்ரிக்குகளுக்கு வாடிக்கையாளர்கள் ஒருங்கிணைந்த CloudWatch ஏஜெண்ட்டை சேகரிக்கவும் கண்காணிக்கவும் பயன்படுத்தலாம்.

> தொடர்புடைய AWS Observability பயிலரங்கம்: [Metrics](https://catalog.workshops.aws/observability/en-US/aws-native/metrics)

## என் Amazon EC2 இன்ஸ்டன்ஸுக்கு மிகவும் நுணுக்கமான நிலை கண்காணிப்பு தேவை, நான் என்ன செய்வது?

முன்னிருப்பாக, Amazon EC2 5 நிமிட காலகட்டங்களில் CloudWatch-க்கு மெட்ரிக் தரவை அனுப்புகிறது, இது ஒரு இன்ஸ்டன்ஸுக்கான அடிப்படை கண்காணிப்பாகும். உங்கள் இன்ஸ்டன்ஸிற்கான மெட்ரிக் தரவை 1 நிமிட காலகட்டங்களில் CloudWatch-க்கு அனுப்ப, இன்ஸ்டன்ஸில் [விரிவான கண்காணிப்பை](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/using-cloudwatch-new.html) இயக்கலாம்.

## என் பயன்பாட்டிற்கான சொந்த மெட்ரிக்குகளை வெளியிட விரும்புகிறேன். ஏதேனும் விருப்பம் உள்ளதா?

வாடிக்கையாளர்கள் தங்கள் சொந்த [கஸ்டம் மெட்ரிக்குகளையும்](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/publishingMetrics.html) API அல்லது CLI மூலம் 1 நிமிட நுணுக்கத்தின் நிலையான தெளிவுத்திறனில் அல்லது 1 வினாடி இடைவெளி வரை உயர் தெளிவுத்திறன் நுணுக்கத்தில் CloudWatch-க்கு வெளியிடலாம்.

CloudWatch ஏஜெண்ட் EC2 இன்ஸ்டன்ஸ்களிலிருந்து சிறப்பு சூழ்நிலைகளில் கஸ்டம் மெட்ரிக்குகளை சேகரிப்பதையும் ஆதரிக்கிறது, உதாரணமாக Elastic Network Adapter (ENA) பயன்படுத்தும் Linux-இல் இயங்கும் [EC2 இன்ஸ்டன்ஸ்களுக்கான நெட்வொர்க் செயல்திறன் மெட்ரிக்குகள்](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-Agent-network-performance.html), Linux சர்வர்களிலிருந்து [NVIDIA GPU மெட்ரிக்குகள்](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-Agent-NVIDIA-GPU.html) மற்றும் Linux & Windows சர்வர்களில் [தனிப்பட்ட செயல்முறைகளிலிருந்து](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-Agent-procstat-process-metrics.html) procstat plugin பயன்படுத்தி செயல்முறை மெட்ரிக்குகள்.

> தொடர்புடைய AWS Observability பயிலரங்கம்: [Public custom metrics](https://catalog.workshops.aws/observability/en-US/aws-native/metrics/publishmetrics)

## Amazon CloudWatch ஏஜெண்ட் மூலம் கஸ்டம் மெட்ரிக்குகளை சேகரிப்பதற்கு என்ன கூடுதல் ஆதரவு உள்ளது?

பயன்பாடுகள் அல்லது சேவைகளிலிருந்து கஸ்டம் மெட்ரிக்குகளை [StatsD](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-Agent-custom-metrics-statsd.html) அல்லது [collectd](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-Agent-custom-metrics-collectd.html) நெறிமுறைகள் ஆதரவுடன் ஒருங்கிணைந்த CloudWatch ஏஜெண்ட் பயன்படுத்தி மீட்டெடுக்கலாம். StatsD என்பது பல்வேறு பயன்பாடுகளிலிருந்து மெட்ரிக்குகளை சேகரிக்கக்கூடிய பிரபலமான ஓப்பன் சோர்ஸ் தீர்வாகும். StatsD குறிப்பாக சொந்த மெட்ரிக்குகளை இன்ஸ்ட்ரூமெண்ட் செய்வதற்கு பயனுள்ளது, இது Linux மற்றும் Windows அடிப்படையிலான சர்வர்களை ஆதரிக்கிறது. collectd நெறிமுறை என்பது பல்வேறு பயன்பாடுகளுக்கான கணினி புள்ளிவிவரங்களை சேகரிக்கக்கூடிய plugins-உடன் Linux சர்வர்களில் மட்டும் ஆதரிக்கப்படும் பிரபலமான ஓப்பன் சோர்ஸ் தீர்வாகும்.

## என் பணிச்சுமையில் நிறைய எபிமரல் வளங்கள் உள்ளன மற்றும் உயர்-கார்டினாலிட்டியில் லாக்குகளை உருவாக்குகிறது, மெட்ரிக்குகள் மற்றும் லாக்குகளை சேகரிக்கவும் அளவிடவும் பரிந்துரைக்கப்படும் அணுகுமுறை என்ன?

[CloudWatch embedded metric format](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch_Embedded_Metric_Format.html) வாடிக்கையாளர்களுக்கு Lambda functions மற்றும் கண்டெய்னர்கள் போன்ற எபிமரல் வளங்களிலிருந்து சிக்கலான உயர்-கார்டினாலிட்டி பயன்பாட்டுத் தரவை லாக்குகள் வடிவத்தில் உட்கொள்ளவும் செயல்படக்கூடிய மெட்ரிக்குகளை உருவாக்கவும் உதவுகிறது. இதன் மூலம், வாடிக்கையாளர்கள் தனித்தனி குறியீட்டை இன்ஸ்ட்ரூமெண்ட் செய்யவோ பராமரிக்கவோ தேவையின்றி விரிவான லாக் நிகழ்வு தரவுடன் கஸ்டம் மெட்ரிக்குகளை உட்பொதிக்கலாம், அதே நேரத்தில் உங்கள் லாக் தரவு மற்றும் CloudWatch-இல் சக்திவாய்ந்த பகுப்பாய்வு திறன்களைப் பெறலாம், மேலும் தரவை காட்சிப்படுத்தவும் நிகழ்நேர சம்பவ கண்டறிதலுக்கு அலாரம் அமைக்கவும் தானாகவே கஸ்டம் மெட்ரிக்குகளை பிரித்தெடுக்க முடியும்.

> தொடர்புடைய AWS Observability பயிலரங்கம்: [Embedded Metric Format](https://catalog.workshops.aws/observability/en-US/aws-native/metrics/emf)

## Amazon CloudWatch-க்கு லாக்குகளை சேகரித்து கண்காணிக்க எங்கே தொடங்குவது?

[Amazon CloudWatch Logs](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/WhatIsCloudWatchLogs.html) வாடிக்கையாளர்களுக்கு ஏற்கனவே உள்ள கணினி, பயன்பாடு மற்றும் கஸ்டம் லாக் கோப்புகளைப் பயன்படுத்தி நிகழ்நேரத்திற்கு அருகில் கணினிகளையும் பயன்பாடுகளையும் கண்காணிக்கவும் சிக்கல்களை தீர்க்கவும் உதவுகிறது. வாடிக்கையாளர்கள் [ஒருங்கிணைந்த CloudWatch ஏஜெண்ட்டை](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/CWL_GettingStarted.html) நிறுவி [Amazon EC2 இன்ஸ்டன்ஸ்கள் மற்றும் ஆன்-பிரிமைஸ் சர்வர்களிலிருந்து](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Install-CloudWatch-Agent.html) CloudWatch-க்கு லாக்குகளை சேகரிக்கலாம்.

> தொடர்புடைய AWS Observability பயிலரங்கம்: [Log Insights](https://catalog.workshops.aws/observability/en-US/aws-native/logs/logsinsights)

## CloudWatch ஏஜெண்ட் என்றால் என்ன, நான் ஏன் அதைப் பயன்படுத்த வேண்டும்?

[ஒருங்கிணைந்த CloudWatch ஏஜெண்ட்](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Install-CloudWatch-Agent.html) MIT உரிமத்தின் கீழ் ஒரு ஓப்பன் சோர்ஸ் மென்பொருளாகும், இது x86-64 மற்றும் ARM64 கட்டமைப்புகளைப் பயன்படுத்தும் பெரும்பாலான இயக்க முறைமைகளை ஆதரிக்கிறது. CloudWatch ஏஜெண்ட் Amazon EC2 இன்ஸ்டன்ஸ்கள் & ஹைப்ரிட் சூழலில் ஆன்-பிரிமைஸ் சர்வர்களிலிருந்து இயக்க முறைமைகள் முழுவதும் கணினி-நிலை மெட்ரிக்குகளை சேகரிக்கவும், பயன்பாடுகள் அல்லது சேவைகளிலிருந்து கஸ்டம் மெட்ரிக்குகளை மீட்டெடுக்கவும், Amazon EC2 இன்ஸ்டன்ஸ்கள் மற்றும் ஆன்-பிரிமைஸ் சர்வர்களிலிருந்து லாக்குகளை சேகரிக்கவும் உதவுகிறது.

## என் சூழலில் அனைத்து அளவிலான நிறுவலும் தேவை, எனவே CloudWatch ஏஜெண்ட்டை சாதாரணமாகவும் ஆட்டோமேஷன் பயன்படுத்தியும் எவ்வாறு நிறுவலாம்?

Linux மற்றும் Windows சர்வர்கள் உள்ளிட்ட அனைத்து ஆதரிக்கப்படும் இயக்க முறைமைகளிலும், வாடிக்கையாளர்கள் [கமாண்ட் லைன்](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/installing-cloudwatch-agent-commandline.html), AWS [Systems Manager](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/installing-cloudwatch-agent-ssm.html) அல்லது AWS [CloudFormation template](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Install-CloudWatch-Agent-New-Instances-CloudFormation.html) பயன்படுத்தி CloudWatch ஏஜெண்ட்டை [பதிவிறக்கம் செய்து நிறுவலாம்](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/install-CloudWatch-Agent-on-EC2-Instance.html). கண்காணிப்புக்காக [ஆன்-பிரிமைஸ் சர்வர்களிலும் CloudWatch ஏஜெண்ட்டை நிறுவலாம்](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/install-CloudWatch-Agent-on-premise.html).

## எங்கள் அமைப்பில் பல AWS கணக்குகள் பல பிராந்தியங்களில் உள்ளன, Amazon CloudWatch இந்த சூழ்நிலைகளுக்கு வேலை செய்யுமா?

Amazon CloudWatch [cross-account observability](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-Unified-Cross-Account.html) வழங்குகிறது, இது வாடிக்கையாளர்களுக்கு ஒரு பிராந்தியத்தில் பல கணக்குகளில் பரவியுள்ள வளங்கள் மற்றும் பயன்பாடுகளின் ஆரோக்கியத்தை கண்காணிக்கவும் சிக்கல்களை தீர்க்கவும் உதவுகிறது. Amazon CloudWatch [cross-account, cross-region டாஷ்போர்டையும்](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Cross-Account-Cross-Region.html) வழங்குகிறது. இந்த செயல்பாட்டினால் வாடிக்கையாளர்கள் தங்கள் பல கணக்கு, பல பிராந்திய வளங்கள் மற்றும் பணிச்சுமைகளின் தெரிவுநிலை மற்றும் நுண்ணறிவுகளைப் பெறலாம்.

## Amazon CloudWatch-க்கு என்ன வகையான ஆட்டோமேஷன் ஆதரவு கிடைக்கிறது?

AWS Management Console மூலம் Amazon CloudWatch-ஐ அணுகுவதைத் தவிர, வாடிக்கையாளர்கள் API, [AWS command-line interface (CLI)](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html) மற்றும் [AWS SDKs](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/sdk-general-information-section.html) மூலமும் சேவையை அணுகலாம். மெட்ரிக்குகள் & டாஷ்போர்டுகளுக்கான [CloudWatch API](https://docs.aws.amazon.com/AmazonCloudWatch/latest/APIReference/Welcome.html) [AWS CLI](https://docs.aws.amazon.com/AmazonCloudWatch/latest/cli/Welcome.html) மூலம் ஆட்டோமேட் செய்வதற்கு அல்லது மென்பொருள்/தயாரிப்புகளுடன் ஒருங்கிணைக்க உதவுகிறது. லாக்குகளுக்கான [CloudWatch API](https://docs.aws.amazon.com/AmazonCloudWatchLogs/latest/APIReference/Welcome.html) [AWS CLI](https://docs.aws.amazon.com/cli/latest/reference/logs/index.html) உடன் தனியாகவும் கிடைக்கிறது. [AWS SDKs பயன்படுத்தி CloudWatch-க்கான குறியீடு எடுத்துக்காட்டுகள்](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/service_code_examples.html) கூடுதல் குறிப்புக்காக வாடிக்கையாளர்களுக்கு கிடைக்கின்றன.

## வளங்களை விரைவாக கண்காணிக்க தொடங்க விரும்புகிறேன், பரிந்துரைக்கப்படும் அணுகுமுறை என்ன?

CloudWatch-இல் தானியங்கி டாஷ்போர்டுகள் அனைத்து AWS பொது பிராந்தியங்களிலும் கிடைக்கின்றன, இவை அனைத்து AWS வளங்களின் ஆரோக்கியம் மற்றும் செயல்திறனின் ஒருங்கிணைந்த காட்சியை வழங்குகின்றன. இது வாடிக்கையாளர்களுக்கு கண்காணிப்பை விரைவாக தொடங்கவும், வள-அடிப்படையிலான மெட்ரிக்குகள் மற்றும் அலாரங்களின் காட்சியை பெறவும், செயல்திறன் சிக்கல்களின் மூல காரணத்தை எளிதாக புரிந்துகொள்ளவும் உதவுகிறது. [தானியங்கி டாஷ்போர்டுகள்](https://docs.aws.amazon.com/prescriptive-guidance/latest/implementing-logging-monitoring-cloudwatch/cloudwatch-dashboards-visualizations.html) AWS சேவை பரிந்துரைக்கப்பட்ட சிறந்த நடைமுறைகளுடன் முன்-கட்டமைக்கப்பட்டவை, வள-விழிப்புடன் இருக்கின்றன, மற்றும் முக்கியமான செயல்திறன் மெட்ரிக்குகளின் சமீபத்திய நிலையை பிரதிபலிக்கும் வகையில் மாறும் வகையில் புதுப்பிக்கப்படுகின்றன.

தொடர்புடைய AWS Observability பயிலரங்கம்: [Automatic Dashboards](https://catalog.workshops.aws/observability/en-US/aws-native/dashboards/autogen-dashboard)

## CloudWatch-இல் நான் கண்காணிக்க விரும்புவதை தனிப்பயனாக்க விரும்புகிறேன், பரிந்துரைக்கப்படும் அணுகுமுறை என்ன?

[கஸ்டம் டாஷ்போர்டு](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/create_dashboard.html) மூலம் வாடிக்கையாளர்கள் விரும்பும் எண்ணிக்கையில் கூடுதல் டாஷ்போர்டுகளை வெவ்வேறு விட்ஜெட்டுகளுடன் உருவாக்கி அதற்கேற்ப தனிப்பயனாக்கலாம். கஸ்டம் டாஷ்போர்டை உருவாக்கும்போது, தனிப்பயனாக்குவதற்கு பல்வேறு விட்ஜெட் வகைகள் தேர்ந்தெடுக்கக் கிடைக்கின்றன.

தொடர்புடைய AWS Observability பயிலரங்கம்: [Dashboarding](https://catalog.workshops.aws/observability/en-US/aws-native/ec2-monitoring/dashboarding)

## சில கஸ்டம் டாஷ்போர்டுகளை உருவாக்கியுள்ளேன், அதை பகிர வழி உள்ளதா?

ஆம், [CloudWatch டாஷ்போர்டுகளை பகிர்வது](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/cloudwatch-dashboard-sharing.html) சாத்தியம். பகிர மூன்று வழிகள் உள்ளன. இணைப்பிற்கான அணுகல் உள்ள எவரும் டாஷ்போர்டைப் பார்க்க அனுமதிப்பதன் மூலம் ஒரு டாஷ்போர்டை பொதுவாக பகிர்வது. டாஷ்போர்டைப் பார்க்க அனுமதிக்கப்பட்டவர்களின் மின்னஞ்சல் முகவரிகளைக் குறிப்பிடுவதன் மூலம் ஒரு டாஷ்போர்டை தனிப்பட்ட முறையில் பகிர்வது. டாஷ்போர்டு அணுகலுக்கு மூன்றாம் தரப்பு single sign-on (SSO) வழங்குநரைக் குறிப்பிடுவதன் மூலம் கணக்கிலுள்ள அனைத்து CloudWatch டாஷ்போர்டுகளையும் பகிர்வது.

> தொடர்புடைய AWS Observability பயிலரங்கம்: [Sharing CloudWatch Dashboards](https://catalog.workshops.aws/observability/en-US/aws-native/dashboards/sharingdashboard)

## கீழே உள்ள AWS வளங்கள் உட்பட என் பயன்பாட்டின் observability-ஐ மேம்படுத்த விரும்புகிறேன், எவ்வாறு நிறைவேற்றுவது?

[Amazon CloudWatch Application Insights](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/cloudwatch-application-insights.html) SQL Server தரவுத்தளம், .Net அடிப்படையிலான வலை (IIS) ஸ்டாக், அப்ளிகேஷன் சர்வர்கள், OS, லோட் பேலன்சர்கள், வரிசைகள் போன்ற அடிப்படை AWS வளங்களுடன் உங்கள் பயன்பாடுகளுக்கான observability-ஐ எளிதாக்குகிறது. இது வாடிக்கையாளர்களுக்கு பயன்பாட்டு வளங்கள் & தொழில்நுட்ப ஸ்டாக் முழுவதும் முக்கிய மெட்ரிக்குகள் மற்றும் லாக்குகளை அடையாளம் கண்டு அமைக்க உதவுகிறது. இதன் மூலம், சராசரி பழுதுபார்ப்பு நேரத்தை (MTTR) குறைக்கிறது & பயன்பாட்டு சிக்கல்களை வேகமாக தீர்க்க உதவுகிறது.

> கூடுதல் விவரங்கள் FAQ-இல்: [AWS resource & custom metrics monitoring](https://aws.amazon.com/cloudwatch/faqs/#AWS_resource_.26_custom_metrics_monitoring)

## என் அமைப்பு ஓப்பன் சோர்ஸ் மையமானது, Amazon CloudWatch ஓப்பன் சோர்ஸ் தொழில்நுட்பங்கள் மூலம் கண்காணிப்பு & observability-ஐ ஆதரிக்கிறதா?

மெட்ரிக்குகள் மற்றும் ட்ரேஸ்களை சேகரிக்க, [AWS Distro for OpenTelemetry (ADOT) Collector](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-Agent-open-telemetry.html) CloudWatch ஏஜெண்ட்டுடன் Amazon EC2 இன்ஸ்டன்ஸில் அருகருகே நிறுவலாம், மற்றும் OpenTelemetry SDKs-ஐ Amazon EC2 இன்ஸ்டன்ஸ்களில் இயங்கும் உங்கள் பணிச்சுமைகளிலிருந்து பயன்பாட்டு ட்ரேஸ்கள் & மெட்ரிக்குகளை சேகரிக்கப் பயன்படுத்தலாம்.

Amazon CloudWatch-இல் OpenTelemetry மெட்ரிக்குகளை ஆதரிக்க, [AWS EMF Exporter for OpenTelemetry Collector](https://github.com/open-telemetry/opentelemetry-collector-contrib/tree/main/exporter/awsemfexporter) OpenTelemetry வடிவ மெட்ரிக்குகளை CloudWatch Embedded Metric Format(EMF)-க்கு மாற்றுகிறது, இது OpenTelemetry மெட்ரிக்குகளில் ஒருங்கிணைக்கப்பட்ட பயன்பாடுகளை [CloudWatch-க்கு](https://aws-otel.github.io/docs/getting-started/adot-eks-add-on/config-cloudwatch) உயர்-கார்டினாலிட்டி பயன்பாட்டு மெட்ரிக்குகளை அனுப்ப இயலுமாக்குகிறது.

லாக்குகளுக்கு, Fluent Bit Amazon CloudWatch உள்ளிட்ட AWS சேவைகளுக்கு லாக் தக்கவைப்பு மற்றும் பகுப்பாய்விற்காக [Amazon EC2-இலிருந்து](https://docs.fluentbit.io/manual/pipeline/outputs/cloudwatch) லாக்குகளை ஸ்ட்ரீம் செய்வதற்கான எளிய நீட்டிப்பு புள்ளியை உருவாக்க உதவுகிறது. புதிதாக அறிமுகப்படுத்தப்பட்ட [Fluent Bit plugin](https://github.com/aws/amazon-cloudwatch-logs-for-fluent-bit#new-higher-performance-core-fluent-bit-plugin) லாக்குகளை Amazon CloudWatch-க்கு ரூட் செய்ய முடியும்.

டாஷ்போர்டுகளுக்கு, Grafana workspace console-இல் AWS data source configuration விருப்பத்தைப் பயன்படுத்தி Amazon Managed Grafana-வை [Amazon CloudWatch data source-ஆக](https://docs.aws.amazon.com/grafana/latest/userguide/using-amazon-cloudwatch-in-AMG.html) சேர்க்கலாம். இந்த அம்சம் ஏற்கனவே உள்ள CloudWatch கணக்குகளை கண்டறிவதன் மூலமும் CloudWatch-ஐ அணுக தேவையான அங்கீகாரச் சான்றுகளின் கட்டமைப்பை நிர்வகிப்பதன் மூலமும் CloudWatch-ஐ data source-ஆக சேர்ப்பதை எளிதாக்குகிறது.

## எங்கள் பணிச்சுமை ஏற்கனவே சூழலிலிருந்து Prometheus பயன்படுத்தி மெட்ரிக்குகளை சேகரிக்க கட்டப்பட்டுள்ளது. அதே முறையை தொடர்ந்து பயன்படுத்தலாமா?

வாடிக்கையாளர்கள் தங்கள் observability தேவைகளுக்கு முழுமையான ஓப்பன் சோர்ஸ் அமைப்பை தேர்வு செய்யலாம். இதற்காக, AWS Distro for OpenTelemetry (ADOT) Collector-ஐ Prometheus-instrumented பயன்பாட்டிலிருந்து scrape செய்து Prometheus Server அல்லது Amazon Managed Prometheus-க்கு மெட்ரிக்குகளை அனுப்ப கட்டமைக்கலாம்.

EC2 இன்ஸ்டன்ஸ்களில் CloudWatch ஏஜெண்ட்டை நிறுவி CloudWatch-இல் கண்காணிப்புக்காக [Prometheus-உடன் மெட்ரிக்குகளை scrape செய்ய](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-Agent-PrometheusEC2.html) கட்டமைக்கலாம். EC2-இல் கண்டெய்னர் பணிச்சுமைகளை விரும்பும் மற்றும் ஓப்பன் சோர்ஸ் Prometheus கண்காணிப்புடன் இணக்கமான கஸ்டம் மெட்ரிக்குகள் தேவைப்படும் வாடிக்கையாளர்களுக்கு இது பயனுள்ளதாக இருக்கும்.

CloudWatch [Container Insights monitoring for Prometheus](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/ContainerInsights-Prometheus.html) கண்டெய்னரைஸ் செய்யப்பட்ட கணினிகள் மற்றும் பணிச்சுமைகளிலிருந்து Prometheus மெட்ரிக்குகளின் தானியங்கி கண்டறிதலை செய்கிறது. Prometheus மெட்ரிக்குகளின் கண்டறிதல் Amazon Elastic Container Service (ECS), Amazon Elastic Kubernetes Service (EKS) மற்றும் Amazon EC2 இன்ஸ்டன்ஸ்களில் இயங்கும் Kubernetes கிளஸ்டர்களுக்கு ஆதரிக்கப்படுகிறது.

## என் பணிச்சுமைகளில் மைக்ரோசர்வீஸ் கம்ப்யூட், குறிப்பாக EKS/Kubernetes தொடர்பான கண்டெய்னர்கள் உள்ளன, சூழலில் நுண்ணறிவுகளைப் பெற Amazon CloudWatch-ஐ எவ்வாறு பயன்படுத்துவது?

வாடிக்கையாளர்கள் [CloudWatch Container Insights](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/ContainerInsights.html)-ஐ பயன்படுத்தி [Amazon Elastic Kubernetes Service (Amazon EKS)](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/deploy-container-insights-EKS.html) அல்லது Amazon EC2-இல் Kubernetes தளங்களில் இயங்கும் கண்டெய்னரைஸ் செய்யப்பட்ட பயன்பாடுகள் மற்றும் மைக்ரோசர்வீஸ்களிலிருந்து மெட்ரிக்குகள் & லாக்குகளை சேகரிக்கவும், ஒருங்கிணைக்கவும், சுருக்கமாக தொகுக்கவும் முடியும். [Container Insights](https://aws.amazon.com/cloudwatch/faqs/#Container_Monitoring) Amazon EKS-க்கான Fargate-இல் டிப்ளாய் செய்யப்பட்ட கிளஸ்டர்களிலிருந்து மெட்ரிக்குகளை சேகரிப்பதையும் ஆதரிக்கிறது. CloudWatch CPU, நினைவகம், டிஸ்க் & நெட்வொர்க் போன்ற பல வளங்களுக்கான [மெட்ரிக்குகளை](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Container-Insights-metrics.html) தானாகவே சேகரிக்கிறது மற்றும் சிக்கல்களை தனிமைப்படுத்தி விரைவாக தீர்க்க கண்டெய்னர் மறுதொடக்க தோல்விகள் போன்ற [கண்டறிதல் தகவல்களையும்](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Container-Insights-reference.html) வழங்குகிறது.

> தொடர்புடைய AWS Observability பயிலரங்கம்: [Container Insights on EKS](https://catalog.workshops.aws/observability/en-US/aws-native/insights/containerinsights/eks)

## என் பணிச்சுமைகளில் மைக்ரோசர்வீஸ் கம்ப்யூட், குறிப்பாக ECS தொடர்பான கண்டெய்னர்கள் உள்ளன, சூழலில் நுண்ணறிவுகளைப் பெற Amazon CloudWatch-ஐ எவ்வாறு பயன்படுத்துவது?

வாடிக்கையாளர்கள் [CloudWatch Container Insights](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/ContainerInsights.html)-ஐ பயன்படுத்தி [Amazon Elastic Container Service (Amazon ECS)](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/deploy-container-insights-ECS.html) அல்லது Amazon EC2-இல் கண்டெய்னர் தளங்களில் இயங்கும் கண்டெய்னரைஸ் செய்யப்பட்ட பயன்பாடுகள் மற்றும் மைக்ரோசர்வீஸ்களிலிருந்து மெட்ரிக்குகள் & லாக்குகளை சேகரிக்கவும், ஒருங்கிணைக்கவும், சுருக்கமாக தொகுக்கவும் முடியும். [Container Insights](https://aws.amazon.com/cloudwatch/faqs/#Container_Monitoring) Amazon ECS-க்கான Fargate-இல் டிப்ளாய் செய்யப்பட்ட கிளஸ்டர்களிலிருந்து மெட்ரிக்குகளை சேகரிப்பதையும் ஆதரிக்கிறது. CloudWatch CPU, நினைவகம், டிஸ்க் & நெட்வொர்க் போன்ற பல வளங்களுக்கான [மெட்ரிக்குகளை](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Container-Insights-metrics.html) தானாகவே சேகரிக்கிறது மற்றும் சிக்கல்களை தனிமைப்படுத்தி விரைவாக தீர்க்க கண்டெய்னர் மறுதொடக்க தோல்விகள் போன்ற [கண்டறிதல் தகவல்களையும்](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Container-Insights-reference.html) வழங்குகிறது.

> தொடர்புடைய AWS Observability பயிலரங்கம்: [Container Insights on ECS](https://catalog.workshops.aws/observability/en-US/aws-native/insights/containerinsights/ecs)

## என் பணிச்சுமைகளில் சர்வர்லெஸ் கம்ப்யூட், குறிப்பாக AWS Lambda உள்ளது, சூழலில் நுண்ணறிவுகளைப் பெற Amazon CloudWatch-ஐ எவ்வாறு பயன்படுத்துவது?

வாடிக்கையாளர்கள் AWS Lambda-இல் இயங்கும் சர்வர்லெஸ் பயன்பாடுகளை கண்காணிக்கவும் சிக்கல் தீர்க்கவும் [CloudWatch Lambda Insights](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Lambda-Insights.html)-ஐ பயன்படுத்தலாம். [CloudWatch Lambda Insights](https://aws.amazon.com/cloudwatch/faqs/#Lambda_Monitoring) CPU நேரம், நினைவகம், டிஸ்க் மற்றும் நெட்வொர்க் உள்ளிட்ட கணினி-நிலை மெட்ரிக்குகளை சேகரிக்கிறது, ஒருங்கிணைக்கிறது மற்றும் சுருக்கமாக தொகுக்கிறது, மேலும் cold starts மற்றும் Lambda worker shutdowns போன்ற கண்டறிதல் தகவல்களை சேகரிக்கிறது, ஒருங்கிணைக்கிறது மற்றும் சுருக்கமாக தொகுக்கிறது, இது வாடிக்கையாளர்களுக்கு Lambda functions-உடன் சிக்கல்களை தனிமைப்படுத்தி விரைவாக தீர்க்க உதவுகிறது.

> தொடர்புடைய AWS Observability பயிலரங்கம்: [Lambda Insights](https://catalog.workshops.aws/observability/en-US/aws-native/insights/lambdainsights)

## Amazon CloudWatch logs-இல் நிறைய லாக்குகளை ஒருங்கிணைக்கிறேன், அந்தத் தரவுகளில் observability-ஐ எவ்வாறு பெறுவது?

[CloudWatch Logs Insights](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/AnalyzingLogData.html) வாடிக்கையாளர்களுக்கு Amazon CloudWatch Logs-இல் செயல்பாட்டு சிக்கல்களுக்கு திறமையாகவும் பயனுள்ள முறையிலும் பதிலளிக்க லாக் தரவை ஊடாடும் முறையில் தேடவும், பகுப்பாய்வு செய்யவும் மற்றும் வினவல்களை செய்யவும் உதவுகிறது. ஒரு சிக்கல் ஏற்பட்டால், வாடிக்கையாளர்கள் [CloudWatch Logs Insights](https://aws.amazon.com/cloudwatch/faqs/#Log_analytics)-ஐ சாத்தியமான காரணங்களை அடையாளம் காணவும் செயல்படுத்தப்பட்ட திருத்தங்களை சரிபார்க்கவும் பயன்படுத்தலாம்.

## Amazon CloudWatch Logs-இல் லாக்குகளை எவ்வாறு வினவுவது?

Amazon CloudWatch Logs-இல் CloudWatch Logs Insights லாக் குழுக்களை வினவ ஒரு [வினவல் மொழியைப்](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/CWL_QuerySyntax.html) பயன்படுத்துகிறது.

## செலவு மேம்படுத்தல், இணக்கத்தன்மை தக்கவைப்பு அல்லது கூடுதல் செயலாக்கத்திற்காக Amazon CloudWatch Logs-இல் சேமிக்கப்பட்ட லாக்குகளை எவ்வாறு நிர்வகிப்பது?

முன்னிருப்பாக, [LogGroups](https://aws.amazon.com/cloudwatch/faqs/#Log_management) Amazon CloudWatch Logs [காலவரையின்றி வைக்கப்படும் மற்றும் காலாவதியாவதில்லை](https://docs.aws.amazon.com/managedservices/latest/userguide/log-customize-retention.html). வாடிக்கையாளர்கள் செலவை மேம்படுத்தவோ அல்லது இணக்கத்தன்மை நோக்கங்களுக்காகவோ லாக்குகளை எவ்வளவு காலம் தக்கவைக்க விரும்புகிறார்கள் என்பதைப் பொறுத்து ஒரு நாள் முதல் 10 ஆண்டுகள் வரை தக்கவைப்புக் காலத்தை தேர்வு செய்ய ஒவ்வொரு லாக் குழுவின் தக்கவைப்புக் கொள்கையை மாற்றலாம்.

வாடிக்கையாளர்கள் [லாக் குழுக்களிலிருந்து Amazon S3 bucket-க்கு](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/S3Export.html) லாக் தரவை ஏற்றுமதி செய்யலாம் மற்றும் இந்தத் தரவை கஸ்டம் செயலாக்கம் மற்றும் பகுப்பாய்வுக்கு அல்லது பிற கணினிகளில் ஏற்றப் பயன்படுத்தலாம்.

வாடிக்கையாளர்கள் CloudWatch Logs subscription மூலம் CloudWatch Logs-இல் லாக் குழுக்களை நிகழ்நேரத்திற்கு அருகில் உங்கள் [Amazon OpenSearch Service](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/CWL_OpenSearch_Stream.html) கிளஸ்டருக்கு தரவை ஸ்ட்ரீம் செய்ய கட்டமைக்கலாம். இதன் மூலம், ஊடாடும் லாக் பகுப்பாய்வு, நிகழ்நேர பயன்பாட்டு கண்காணிப்பு, தேடல் மற்றும் பலவற்றில் உதவுகிறது.

## என் பணிச்சுமைகள் முக்கியமான தரவுகளைக் கொண்ட லாக்குகளை உருவாக்குகின்றன, Amazon CloudWatch-இல் அவற்றைப் பாதுகாக்க வழி உள்ளதா?

வாடிக்கையாளர்கள் CloudWatch Logs-இல் [லாக் தரவு பாதுகாப்பு அம்சத்தைப்](https://aws.amazon.com/cloudwatch/faqs/#Log_data_protection) பயன்படுத்தி கணினிகள் மற்றும் பயன்பாடுகளிலிருந்து சேகரிக்கப்படும் லாக்குகளில் உள்ள முக்கியமான தரவை [தானாக கண்டறிந்து மறைக்க சொந்த விதிகள் மற்றும் கொள்கைகளை வரையறுக்கலாம்](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/mask-sensitive-log-data.html#mask-sensitive-log-data-start).

தொடர்புடைய AWS Observability பயிலரங்கம்: [Data Protection](https://catalog.workshops.aws/observability/en-US/aws-native/logs/dataprotection)

## என் கணினிகள் & பயன்பாடுகளில் அசாதாரண மாற்றங்கள் அல்லது எதிர்பாராத மாற்றங்கள் நடக்கும்போது அறிய விரும்புகிறேன். Amazon CloudWatch எப்போது அது நிகழ்கிறது என்று என்னை எவ்வாறு எச்சரிக்க முடியும்?

[Amazon CloudWatch Anomaly Detection](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch_Anomaly_Detection.html) புள்ளியியல் மற்றும் இயந்திர கற்றல் அல்காரிதங்களை பயன்படுத்தி கணினிகள் மற்றும் பயன்பாடுகளின் ஒற்றை நேர வரிசைகளை தொடர்ந்து பகுப்பாய்வு செய்கிறது, சாதாரண அடிப்படை நிலைகளை தீர்மானிக்கிறது, மற்றும் குறைந்தபட்ச பயனர் தலையீட்டுடன் அசாதாரணங்களை கண்டறிகிறது. அல்காரிதங்கள் சாதாரண மெட்ரிக் நடத்தையை பிரதிநிதித்துவப்படுத்தும் எதிர்பார்க்கப்படும் மதிப்புகளின் வரம்பை உருவாக்கும் ஒரு anomaly detection மாடலை உருவாக்குகின்றன. வாடிக்கையாளர்கள் கடந்த மெட்ரிக் தரவின் பகுப்பாய்வு மற்றும் anomaly threshold-க்கான மதிப்பு அமைப்பின் அடிப்படையில் [அலாரத்தை உருவாக்கலாம்](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Create_Anomaly_Detection_Alarm.html).

> தொடர்புடைய AWS Observability பயிலரங்கம்: [Anomaly Detection](https://catalog.workshops.aws/observability/en-US/aws-native/metrics/alarms/anomalydetection)

## Amazon CloudWatch-இல் மெட்ரிக் அலாரத்தை அமைத்துள்ளேன், ஆனால் அடிக்கடி அலாரம் இரைச்சல்கள் வருகின்றன. இதை எவ்வாறு கட்டுப்படுத்தி நுணுக்கமாக மாற்றுவது?

வாடிக்கையாளர்கள் பல [அலாரங்கள்](https://aws.amazon.com/cloudwatch/faqs/#Alarms) ஒரே நேரத்தில் சுடும்போது ஒரு முறை மட்டும் இயக்குவதன் மூலம் அலாரம் இரைச்சலைக் குறைக்க பல அலாரங்களை அலாரம் படிநிலைகளாக [composite alarm](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Create_Composite_Alarm.html) என இணைக்கலாம். Composite alarms ஒரு பயன்பாடு, AWS Region அல்லது AZ போன்ற வளங்களை குழுவாக்குவதில் வாடிக்கையாளர்களுக்கு உதவும் ஒட்டுமொத்த நிலையை ஆதரிக்கிறது.

> தொடர்புடைய AWS Observability பயிலரங்கம்: [Alarms](https://catalog.workshops.aws/observability/en-US/aws-native/metrics/alarms)

## இணையத்தை எதிர்கொள்ளும் என் பணிச்சுமை செயல்திறன் மற்றும் கிடைக்கும் தன்மை சிக்கல்களை எதிர்கொள்கிறது, எவ்வாறு சிக்கல்தீர்ப்பது?

[Amazon CloudWatch Internet Monitor](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-InternetMonitor.html) AWS-இல் ஹோஸ்ட் செய்யப்பட்ட உங்கள் பயன்பாடுகளுக்கும் உங்கள் இறுதி பயனர்களுக்கும் இடையே இணைய சிக்கல்கள் செயல்திறன் மற்றும் கிடைக்கும் தன்மையை எவ்வாறு பாதிக்கின்றன என்பதில் தெரிவுநிலையை வழங்குகிறது. [Internet Monitor](https://aws.amazon.com/cloudwatch/faqs/#Internet_Monitoring) மூலம், உங்கள் பயன்பாட்டின் செயல்திறன் மற்றும் கிடைக்கும் தன்மையை என்ன பாதிக்கிறது என்பதை விரைவாக அடையாளம் காணலாம், இதனால் இணைய சிக்கல்களைக் கண்டறிவதற்கான நேரத்தை கணிசமாகக் குறைக்கக்கூடிய சிக்கல்களைக் கண்டுபிடித்து நிவர்த்தி செய்யலாம்.

## என் பணிச்சுமை AWS-இல் உள்ளது, இறுதிப் பயனர்கள் பயன்பாட்டை அணுகுவதில் தாக்கம் அல்லது தாமதத்தை அனுபவிக்கும் முன்பே எனக்கு அறிவிக்கப்பட வேண்டும். வாடிக்கையாளர் எதிர்கொள்ளும் பணிச்சுமையின் observability-ஐ எவ்வாறு மேம்படுத்துவது?

வாடிக்கையாளர்கள் [Amazon CloudWatch Synthetics](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch_Synthetics_Canaries.html)-ஐ பயன்படுத்தி உங்கள் எண்ட்பாயிண்ட்கள் மற்றும் API-களை கண்காணிக்க ஒரு அட்டவணையில் இயங்கும் கட்டமைக்கக்கூடிய ஸ்கிரிப்ட்களான canaries-ஐ உருவாக்கலாம். Canaries ஒரு வாடிக்கையாளர் அதே வழிகளைப் பின்பற்றி அதே செயல்களைச் செய்வதால், உங்கள் பயன்பாடுகளுக்கு நேரடி ட்ராஃபிக் இல்லாவிட்டாலும் இறுதிப் பயனர் அனுபவத்தை தொடர்ந்து சரிபார்க்க முடியும். உங்கள் வாடிக்கையாளர்கள் கண்டுபிடிப்பதற்கு முன்பே சிக்கல்களைக் கண்டறிய Canaries உதவுகிறது. Canaries எண்ட்பாயிண்ட்களின் கிடைக்கும் தன்மை மற்றும் தாமதத்தை சரிபார்க்கிறது மற்றும் headless Chromium browser மூலம் ரெண்டர் செய்யப்பட்ட UI-இன் ஏற்றும் நேர தரவு மற்றும் ஸ்கிரீன்ஷாட்களை சேமிக்க முடியும்.

> தொடர்புடைய AWS Observability பயிலரங்கம்: [CloudWatch Synthetics](https://catalog.workshops.aws/observability/en-US/aws-native/app-monitoring/synthetics)

## கிளையண்ட்-சைட் செயல்திறனை அடையாளம் கண்டு நிகழ்நேர சிக்கல்களை தீர்ப்பதன் மூலம் இறுதிப் பயனர் அனுபவத்தை எவ்வாறு கண்காணிப்பது?

[CloudWatch RUM](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-RUM.html) நிகழ்நேரத்திற்கு அருகில் உண்மையான பயனர் அமர்வுகளிலிருந்து உங்கள் வலை பயன்பாட்டு செயல்திறன் பற்றிய கிளையண்ட்-சைட் தரவை சேகரிக்கவும் பார்க்கவும் நிகழ்நேர பயனர் கண்காணிப்பை செய்ய முடியும். இந்த சேகரிக்கப்பட்ட தரவு கிளையண்ட்-சைட் செயல்திறன் சிக்கல்களை விரைவாக அடையாளம் கண்டு பிழைத்திருத்தம் செய்ய உதவுகிறது, மேலும் பக்க ஏற்றும் நேரங்கள், கிளையண்ட்-சைட் பிழைகள் மற்றும் பயனர் நடத்தையை காட்சிப்படுத்தவும் பகுப்பாய்வு செய்யவும் உதவுகிறது. இந்தத் தரவைப் பார்க்கும்போது, வாடிக்கையாளர்கள் அதை ஒட்டுமொத்தமாகவும் உங்கள் வாடிக்கையாளர்கள் பயன்படுத்தும் உலாவிகள் மற்றும் சாதனங்களின் அடிப்படையிலும் பிரித்துப் பார்க்கலாம். CloudWatch RUM உங்கள் பயன்பாட்டு செயல்திறனில் அசாதாரணங்களை காட்சிப்படுத்தவும் பிழை செய்திகள், stack traces மற்றும் பயனர் அமர்வுகள் போன்ற தொடர்புடைய பிழைத்திருத்த தரவைக் கண்டறியவும் உதவுகிறது.

> தொடர்புடைய AWS Observability பயிலரங்கம்: [CloudWatch RUM](https://catalog.workshops.aws/observability/en-US/aws-native/app-monitoring/rum)

## என் அமைப்பு அனைத்து நடவடிக்கைகளும் தணிக்கைகளுக்காக பதிவு செய்யப்பட வேண்டும் என்று கோருகிறது. Amazon CloudWatch நிகழ்வுகளை பதிவு செய்ய முடியுமா?

Amazon CloudWatch [AWS CloudTrail](https://docs.aws.amazon.com/awscloudtrail/latest/userguide/cloudtrail-user-guide.html)-உடன் ஒருங்கிணைக்கப்பட்டுள்ளது, இது Amazon CloudWatch-இல் ஒரு பயனர், ஒரு பங்கு அல்லது ஒரு AWS சேவையால் எடுக்கப்பட்ட நடவடிக்கைகளின் பதிவை வழங்குகிறது. CloudTrail கன்சோலிலிருந்து வரும் அழைப்புகள் மற்றும் API செயல்பாடுகளுக்கான குறியீடு அழைப்புகள் உள்ளிட்ட [Amazon CloudWatch-க்கான அனைத்து API அழைப்புகளையும்](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/logging_cw_api_calls.html) நிகழ்வுகளாக பதிவு செய்கிறது.

## கூடுதல் தகவல்கள் எங்கே கிடைக்கும்?

கூடுதல் தகவல்களுக்கு வாடிக்கையாளர்கள் [CloudWatch](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/WhatIsCloudWatch.html), [CloudWatch Events](https://docs.aws.amazon.com/AmazonCloudWatch/latest/events/WhatIsCloudWatchEvents.html) மற்றும் [CloudWatch Logs](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/WhatIsCloudWatchLogs.html)-க்கான AWS ஆவணத்தை படிக்கலாம், [AWS Native Observability](https://catalog.workshops.aws/observability/en-US/aws-native)-இல் AWS Observability பயிலரங்கத்தை பார்க்கலாம், மேலும் [அம்சங்கள்](https://aws.amazon.com/cloudwatch/features/) மற்றும் [விலை](https://aws.amazon.com/cloudwatch/pricing/) விவரங்களை அறிய [தயாரிப்பு பக்கத்தையும்](https://aws.amazon.com/cloudwatch/) சரிபார்க்கலாம். வாடிக்கையாளர் பயன்பாட்டு சூழ்நிலைகளை விளக்கும் [CloudWatch-இல் கூடுதல் பயிற்சிகள்](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-tutorials.html).

**தயாரிப்பு FAQ:** [https://aws.amazon.com/cloudwatch/faqs/](https://aws.amazon.com/cloudwatch/faqs/)

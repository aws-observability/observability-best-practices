# லாக்கிங்

லாக்கிங் கருவிகளின் தேர்வு, உங்கள் தரவு பரிமாற்றம், வடிகட்டுதல், தக்கவைப்பு, பிடிப்பு மற்றும் உங்கள் தரவை உருவாக்கும் அப்ளிகேஷன்களுடன் ஒருங்கிணைப்பு ஆகியவற்றுக்கான தேவைகளுடன் இணைக்கப்பட்டுள்ளது. Observability க்காக Amazon Web Services ஐ பயன்படுத்தும்போது (நீங்கள் வளாகத்தில் அல்லது மற்றொரு கிளவுட் சூழலில் ஹோஸ்ட் செய்தாலும்), பகுப்பாய்விற்கான லாக்கிங் தரவை அனுப்ப [CloudWatch agent](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Install-CloudWatch-Agent.html) அல்லது [Fluentd](https://www.fluentd.org/) போன்ற மற்றொரு கருவியை பயன்படுத்தலாம்.

இங்கே நாம் லாக்கிங்கிற்கான CloudWatch agent ஐ செயல்படுத்துவதற்கான சிறந்த நடைமுறைகளை மற்றும் AWS கன்சோல் அல்லது API-கள் வழியாக CloudWatch Logs பயன்பாட்டை விரிவாக்குவோம்.

:::info
	CloudWatch agent ஐ CloudWatch க்கு [மெட்ரிக் தரவை](../../signals/metrics) வழங்கவும் பயன்படுத்தலாம். செயல்படுத்தும் விவரங்களுக்கு [மெட்ரிக்குகள்](../metrics) பக்கத்தைப் பார்க்கவும். OpenTelemetry அல்லது X-Ray கிளையண்ட் SDK-களிலிருந்து [ட்ரேஸ்களை](../../signals/traces.md) சேகரிக்கவும், அவற்றை [AWS X-Ray](../xray.md) க்கு அனுப்பவும் பயன்படுத்தலாம்.
:::
## CloudWatch agent உடன் லாக்குகளை சேகரித்தல்

### பகிர்தல்

Observability க்கு [கிளவுட் முதல் அணுகுமுறையை](../../faq/general.md#what-is-a-cloud-first-approach) எடுக்கும்போது, ஒரு விதியாக, ஒரு இயந்திரத்தின் லாக்குகளை பெற அதில் உள்நுழைய வேண்டியிருந்தால், அது ஒரு எதிர்-முறை. உங்கள் பணிச்சுமைகள் தங்கள் எல்லைகளுக்கு வெளியே கிட்டத்தட்ட நிகழ்நேரத்தில் ஒரு லாக் பகுப்பாய்வு அமைப்புக்கு தங்கள் லாக்கிங் தரவை அனுப்ப வேண்டும், மற்றும் அந்த பரிமாற்றத்திற்கும் அசல் நிகழ்வுக்கும் இடையிலான தாமதம் உங்கள் பணிச்சுமைக்கு ஒரு பேரிடர் ஏற்பட்டால் புள்ளி-நேர தகவல்களின் சாத்தியமான இழப்பை குறிக்கிறது.

ஒரு கட்டமைப்பாளராக, லாக்கிங் தரவுக்கான உங்கள் ஏற்கக்கூடிய இழப்பு என்ன என்பதை நீங்கள் தீர்மானிக்க வேண்டும் மற்றும் இதை ஏற்றுக்கொள்ள CloudWatch agent இன் [`force_flush_interval`](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-Agent-Configuration-File-Details.html#CloudWatch-Agent-Configuration-File-Logssection) ஐ சரிசெய்ய வேண்டும்.

`force_flush_interval` agent ஐ ஒரு வழக்கமான இடைவெளியில் தரவு தளத்திற்கு லாக்கிங் தரவை அனுப்ப அறிவுறுத்துகிறது, பஃபர் அளவு எட்டப்படாவிட்டால், அப்போது அது அனைத்து பஃபர் செய்யப்பட்ட லாக்குகளையும் உடனடியாக அனுப்பும்.

:::tip
	எட்ஜ் சாதனங்கள் குறைந்த-தாமத, AWS-உள் பணிச்சுமைகளிலிருந்து மிகவும் வேறுபட்ட தேவைகளைக் கொண்டிருக்கலாம், மற்றும் மிக நீண்ட `force_flush_interval` அமைப்புகள் தேவைப்படலாம். உதாரணமாக, குறைந்த அலைவரிசை இணைய இணைப்பில் உள்ள IoT சாதனம் ஒவ்வொரு 15 நிமிடங்களுக்கும் மட்டுமே லாக்குகளை flush செய்ய வேண்டியிருக்கலாம்.
:::
:::info
	கண்டெய்னர்மயமாக்கப்பட்ட அல்லது நிலையற்ற பணிச்சுமைகள் லாக் flush தேவைகளுக்கு குறிப்பாக உணர்திறன் கொண்டதாக இருக்கலாம். எந்த நேரத்திலும் அளவை குறைக்கக்கூடிய நிலையற்ற Kubernetes அப்ளிகேஷன் அல்லது EC2 குழுவை கருத்தில் கொள்ளுங்கள். இந்த ஆதாரங்கள் திடீரென நிறுத்தப்படும்போது லாக்களின் இழப்பு ஏற்படலாம், எதிர்காலத்தில் அவற்றிலிருந்து லாக்குகளை பிரித்தெடுக்க வழி இல்லை. நிலையான `force_flush_interval` பொதுவாக இந்த சூழ்நிலைகளுக்கு பொருத்தமானது, ஆனால் தேவைப்பட்டால் குறைக்கலாம்.
:::
### லாக் குழுக்கள்

CloudWatch Logs இல், ஒரு அப்ளிகேஷனுக்கு தர்க்கரீதியாக பொருந்தும் ஒவ்வொரு லாக் தொகுப்பும் ஒரு [log group](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/CloudWatchLogsConcepts.html) க்கு வழங்கப்பட வேண்டும். அந்த log group க்குள் உள்ள log stream-களை உருவாக்கும் மூல அமைப்புகளிடையே *பொதுத்தன்மை* இருக்க வேண்டும்.

ஒரு LAMP stack ஐ கருத்தில் கொள்ளுங்கள்: Apache, MySQL, உங்கள் PHP அப்ளிகேஷன் மற்றும் ஹோஸ்டிங் Linux ஆப்பரேட்டிங் சிஸ்டம் ஆகியவற்றின் லாக்குகள் ஒவ்வொன்றும் தனி log group க்கு சேரும்.

இந்த குழுவாக்கம் முக்கியமானது, ஏனெனில் இது குழுக்களை ஒரே தக்கவைப்பு காலம், என்கிரிப்ஷன் கீ, metric filters, subscription filters மற்றும் Contributor Insights விதிகளுடன் நடத்த உதவுகிறது.

:::info
	ஒரு log group இல் log stream-களின் எண்ணிக்கையில் வரம்பு இல்லை, மற்றும் உங்கள் அப்ளிகேஷனுக்கான முழு லாக்குகளையும் ஒரே CloudWatch Logs Insights வினவலில் தேடலாம். Kubernetes சேவையில் உள்ள ஒவ்வொரு pod-க்கும், அல்லது உங்கள் குழுவில் உள்ள ஒவ்வொரு EC2 நிகழ்விற்கும் தனி log stream வைத்திருப்பது ஒரு நிலையான முறை.
:::
:::info
	ஒரு log group க்கான இயல்புநிலை தக்கவைப்பு காலம் *முடிவிலி* ஆகும். log group ஐ உருவாக்கும் நேரத்தில் தக்கவைப்பு காலத்தை அமைப்பது சிறந்த நடைமுறை.

	நீங்கள் எந்த நேரத்திலும் CloudWatch கன்சோலில் இதை அமைக்கலாம் என்றாலும், சிறந்த நடைமுறை என்னவென்றால் infrastructure as code (CloudFormation, Cloud Development Kit, போன்றவை) ஐ பயன்படுத்தி log group உருவாக்கத்துடன் இணைந்து அல்லது CloudWatch agent கட்டமைப்பின் உள்ளே `retention_in_days` அமைப்பை பயன்படுத்தி செய்வது.

	எந்த அணுகுமுறையும் லாக் தக்கவைப்பு காலத்தை முன்கூட்டியே அமைக்க அனுமதிக்கிறது, மற்றும் உங்கள் திட்டத்தின் தரவு தக்கவைப்பு தேவைகளுடன் இணைந்துள்ளது.
:::

:::info
	Log group தரவு CloudWatch Logs இல் எப்போதும் என்கிரிப்ட் செய்யப்படுகிறது. இயல்பாக, CloudWatch Logs ஓய்வு நிலையில் லாக் தரவுக்கு `server-side` என்கிரிப்ஷனைப் பயன்படுத்துகிறது. மாற்றாக, இந்த என்கிரிப்ஷனுக்கு AWS Key Management Service ஐ பயன்படுத்தலாம். [AWS KMS ஐ பயன்படுத்தி என்கிரிப்ஷன்](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/encrypt-log-data-kms.html) log group மட்டத்தில் செயல்படுத்தப்படுகிறது.

	CloudWatch Logs க்கான கீகளை நிர்வகிக்க AWS Key Management Service ஐ பயன்படுத்துவதற்கு கூடுதல் கட்டமைப்பு மற்றும் உங்கள் பயனர்களுக்கான கீகளுக்கு அனுமதிகளை வழங்குதல் தேவை.[^1]
:::
### லாக் வடிவமைப்பு

CloudWatch Logs தானாகவே லாக் புலங்களைக் கண்டறிந்து உள்ளீட்டின் போது JSON தரவை இன்டெக்ஸ் செய்யும் திறனைக் கொண்டுள்ளது. இந்த அம்சம் ad hoc வினவல்கள் மற்றும் வடிகட்டலை எளிதாக்குகிறது. இருப்பினும், தானியங்கு இன்டெக்சிங் கட்டமைக்கப்பட்ட தரவுக்கு மட்டுமே பொருந்தும். கட்டமைக்கப்படாத லாக்கிங் தரவு தானாக இன்டெக்ஸ் செய்யப்படாது ஆனால் CloudWatch Logs க்கு வழங்கப்படலாம்.

கட்டமைக்கப்படாத லாக்குகளை `parse` கட்டளையுடன் ரெகுலர் எக்ஸ்பிரஷன் பயன்படுத்தி தேடலாம் அல்லது வினவலாம்.

:::info
	CloudWatch Logs ஐ பயன்படுத்தும்போது லாக் வடிவங்களுக்கான இரண்டு சிறந்த நடைமுறைகள்:

	1. [Log4j](https://logging.apache.org/log4j/2.x/), [`python-json-logger`](https://pypi.org/project/python-json-logger/), அல்லது உங்கள் கட்டமைப்பின் நேட்டிவ் JSON emitter போன்ற கட்டமைக்கப்பட்ட லாக் formatter ஐ பயன்படுத்தவும்.
	2. உங்கள் லாக் இலக்குக்கு ஒவ்வொரு நிகழ்வுக்கும் ஒரு வரி லாக்கிங் அனுப்பவும்.

	JSON லாக்கிங்கின் பல வரிகளை அனுப்பும்போது, ஒவ்வொரு வரியும் ஒரு தனி நிகழ்வாக விளக்கப்படும் என்பதை கவனிக்கவும்.
:::
### `stdout` ஐ கையாளுதல்

எங்கள் [லாக் சிக்னல்கள்](../../signals/logs#log-to-stdout) பக்கத்தில் விவாதிக்கப்பட்டபடி, சிறந்த நடைமுறை என்னவென்றால் லாக்கிங் அமைப்புகளை அவற்றை உருவாக்கும் அப்ளிகேஷன்களிலிருந்து பிரிப்பது. இருப்பினும் `stdout` இலிருந்து ஒரு கோப்பிற்கு தரவை அனுப்புவது பல தளங்களுக்கான பொதுவான முறை. Kubernetes அல்லது [Amazon Elastic Container Service](https://aws.amazon.com/ecs/) போன்ற கண்டெய்னர் ஒழுங்கமைப்பு அமைப்புகள் `stdout` ஐ ஒரு லாக் கோப்பிற்கு வழங்குவதை தானாக நிர்வகிக்கின்றன. CloudWatch agent பின்னர் இந்த கோப்பை நிகழ்நேரத்தில் படித்து உங்கள் சார்பாக தரவை log group க்கு அனுப்புகிறது.

:::info
	முடிந்தவரை, `stdout` க்கு எளிமையான அப்ளிகேஷன் லாக்கிங் முறையை, ஒரு agent மூலம் சேகரிப்புடன் பயன்படுத்தவும்.
:::
### லாக்குகளை வடிகட்டுதல்

உங்கள் லாக்குகளை வடிகட்ட பல காரணங்கள் உள்ளன. எந்த சூழ்நிலையிலும், சிறந்த நடைமுறை என்னவென்றால் இந்த வடிகட்டலை தோற்றுவிக்கும் அமைப்புக்கு முடிந்தவரை நெருக்கமாக செய்வது. CloudWatch agent இந்த வடிகட்டலை உங்களுக்காக செய்யலாம்.

:::info
	நீங்கள் விரும்பும் லாக் நிலைகளை `include` செய்யவும், விரும்பத்தகாத என்று அறியப்பட்ட முறைகளை `exclude` செய்யவும் [`filters`](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-Agent-Configuration-File-Details.html#CloudWatch-Agent-Configuration-File-Logssection) அம்சத்தைப் பயன்படுத்தவும்.
:::
:::tip
	குறிப்பிட்ட வகை அறியப்பட்ட விரும்பத்தகாத தரவை கையாளும் பணிச்சுமைகளுக்கு, இந்த பதிவுகளுக்கான வடிப்பான் எதிர்காலத்தில் சாத்தியமான இணக்க சிக்கலைத் தடுக்கலாம். உதாரணமாக:

	```
	"filters": [
      {
        "type": "exclude",
        "expression": "\b(?!000|666|9\d{2})([0-8]\d{2}|7([0-6]\d))([-]?|\s{1})(?!00)\d\d\2(?!0000)\d{4}\b"
      }
    ]
    ```
:::

### பல-வரி லாக்கிங்

அனைத்து லாக்கிங்கிற்கும் சிறந்த நடைமுறை [கட்டமைக்கப்பட்ட லாக்கிங்](../../signals/logs#structured-logging-is-key-to-success) ஐ பயன்படுத்துவது. இருப்பினும், இந்த விருப்பம் இல்லாத பல லெகசி அப்ளிகேஷன்கள் உள்ளன. CloudWatch agent இதை [`multi_line_start_pattern`](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-Agent-Configuration-File-Details.html#CloudWatch-Agent-Configuration-File-Logssection) directive உடன் செய்யலாம்.

:::info
	CloudWatch Logs க்கு பல-வரி லாக்கிங்கை உள்ளீடு செய்வதன் சுமையை குறைக்க `multi_line_start_pattern` directive ஐ பயன்படுத்தவும்.
:::
### லாக்கிங் class ஐ கட்டமைத்தல்

CloudWatch Logs இரண்டு [class-களை](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/CloudWatch_Logs_Log_Classes.html) log group-களுக்கு வழங்குகிறது:

- CloudWatch Logs Standard log class நிகழ்நேர கண்காணிப்பு தேவைப்படும் அல்லது அடிக்கடி அணுகும் லாக்குகளுக்கான முழு-அம்ச விருப்பமாகும்.

- CloudWatch Logs Infrequent Access log class உங்கள் லாக்குகளை செலவு-திறமையாக ஒருங்கிணைக்க பயன்படுத்தக்கூடிய புதிய log class ஆகும்.

:::info
	புதிய log group க்கு எந்த log group class ஐ பயன்படுத்த வேண்டும் என்பதை குறிப்பிட `log_group_class` directive ஐ பயன்படுத்தவும். செல்லுபடியாகும் மதிப்புகள் **STANDARD** மற்றும் **INFREQUENT_ACCESS**.
:::

#### சரியான class நியமிப்புக்காக ஏற்கனவே உள்ள லாக்குகளை தணிக்கை செய்தல்

ஏற்கனவே உள்ள log group-களை தணிக்கை செய்து Infrequent Access log group-களாக மீண்டும் உருவாக்கப்படக்கூடியவை உள்ளனவா என சரிபார்க்க பரிந்துரைக்கப்படுகிறது. [log-ia-checker](https://github.com/aws-observability/log-ia-checker) cli கருவியை இயக்குவது இதற்கு ஒரு நல்ல வழி.

## CloudWatch Logs உடன் தேடல்

### வினவல் நோக்கத்துடன் செலவுகளை நிர்வகித்தல்

CloudWatch Logs க்கு தரவு வழங்கப்பட்ட பிறகு, தேவைக்கேற்ப அதன் வழியாக தேடலாம். CloudWatch Logs ஸ்கேன் செய்யப்பட்ட ஒவ்வொரு ஜிகாபைட் தரவுக்கும் கட்டணம் விதிக்கிறது என்பதை நினைவில் கொள்ளுங்கள்.

:::info
	உங்கள் லாக்குகளை தேடும்போது உங்கள் நேர மற்றும் தேதி வரம்பு பொருத்தமானதாக இருப்பதை உறுதிப்படுத்தவும்.
:::

:::info
	நீங்கள் ஒரே வினவலில் பல log group-களை தேடலாம், ஆனால் அவ்வாறு செய்வது அதிக தரவு ஸ்கேன் செய்யப்படும்.
:::

:::tip
	CloudWatch கன்சோலிலிருந்து நேரடியாக ஒவ்வொரு வினவலும் எவ்வளவு தரவை ஸ்கேன் செய்கிறது என்பதை பார்க்கலாம்.

	![CloudWatch Logs கன்சோலின் முன்னோட்டம்](../../images/cwl1.png)
:::

### வெற்றிகரமான வினவல்களை மற்றவர்களுடன் பகிர்தல்

[CloudWatch Logs வினவல் தொடரியல்](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/CWL_QuerySyntax.html) சிக்கலானதல்ல என்றாலும், சில வினவல்களை புதிதாக எழுதுவது நேரம் எடுக்கும். ஒரே AWS கணக்கில் உள்ள மற்ற பயனர்களுடன் நன்கு எழுதப்பட்ட வினவல்களை பகிர்வது அப்ளிகேஷன் லாக்குகளின் ஆய்வை எளிதாக்கலாம். இதை நேரடியாக [AWS Management Console](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/CWL_Insights-Saving-Queries.html) இலிருந்து அல்லது [CloudFormation](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-logs-querydefinition.html) அல்லது [AWS CDK](https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_logs.CfnQueryDefinition.html) ஐ பயன்படுத்தி நிரல்ரீதியாக அடையலாம்.

:::info
	அடிக்கடி மீண்டும் செய்யப்படும் வினவல்களை CloudWatch Logs இல் சேமிக்கவும்.

	![CloudWatch Logs வினவல் எடிட்டர் பக்கம்](../../images/cwl2.png)
:::

### பேட்டர்ன் பகுப்பாய்வு

CloudWatch Logs Insights நீங்கள் உங்கள் லாக்குகளை வினவும்போது பேட்டர்ன்களை கண்டறிய இயந்திர கற்றல் வழிமுறைகளை பயன்படுத்துகிறது.[^2]

:::info
	உங்கள் லாக் தரவை தானாக பேட்டர்ன்களாக கிளஸ்டர் செய்ய pattern ஐ பயன்படுத்தவும்.

	![CloudWatch Logs வினவல் பேட்டர்ன் உதாரணம்](../../images/pattern_analysis.png)
:::

### முந்தைய நேர வரம்புகளுடன் ஒப்பிடுதல் (diff)

CloudWatch Logs Insights காலப்போக்கில் லாக் நிகழ்வு மாற்றங்களை ஒப்பிட உதவுகிறது, பிழை கண்டறிதல் மற்றும் போக்கு அடையாளம் காணுதலுக்கு உதவுகிறது.[^3]

:::info
	`diff` கட்டளையைப் பயன்படுத்தி காலப்போக்கில் உங்கள் லாக் நிகழ்வுகளில் மாற்றங்களை ஒப்பிடவும்.

	![CloudWatch Logs வினவல் வேறுபாடு உதாரணம்](../../images/diff-query.png)
:::

[^1]: [How to search through your AWS Systems Manager Session Manager console logs – Part 1](https://aws.amazon.com/blogs/mt/how-to-search-through-your-aws-systems-manager-session-manager-console-logs-part-1/) ஐ பார்க்கவும்.

[^2]: [CloudWatch Logs Insights Pattern Analysis](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/CWL_AnalyzeLogData_Patterns.html) ஐ பார்க்கவும்.

[^3]: [CloudWatch Logs Insights Compare(diff) with previous ranges](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/CWL_AnalyzeLogData_Compare.html) ஐ பார்க்கவும்.

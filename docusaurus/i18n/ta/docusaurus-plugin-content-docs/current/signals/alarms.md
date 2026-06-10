# அலாரங்கள்

அலாரம் என்பது ஒரு probe, monitor அல்லது கொடுக்கப்பட்ட வரம்பிற்கு மேல் அல்லது கீழ் ஒரு மதிப்பின் மாற்றத்தின் நிலையைக் குறிக்கிறது. ஒரு எளிய உதாரணம், ஒரு disk நிரம்பிவிட்டால் அல்லது ஒரு web site இயங்கவில்லை என்றால் email அனுப்பும் அலாரம். மிகவும் அதிநவீன அலாரங்கள் முற்றிலும் programmatic ஆகவும், auto-scaling அல்லது முழு server clusters உருவாக்குதல் போன்ற சிக்கலான interactions-ஐ இயக்கப் பயன்படுகின்றன.

பயன்பாட்டு வழக்கைப் பொருட்படுத்தாமல், ஒரு அலாரம் ஒரு metric-ன் தற்போதைய *நிலையை* குறிக்கிறது. இந்த நிலை `OK`, `WARNING`, `ALERT` அல்லது `NO DATA` ஆக இருக்கலாம், கேள்விக்குரிய அமைப்பைப் பொறுத்தது.

அலாரங்கள் ஒரு குறிப்பிட்ட காலத்திற்கு இந்த நிலையை பிரதிபலிக்கின்றன, மேலும் ஒரு timeseries-ன் மேல் கட்டப்பட்டவை. எனவே, அவை ஒரு time series-லிருந்து *பெறப்பட்டவை*. கீழே உள்ள graph இரண்டு அலாரங்களைக் காட்டுகிறது: ஒன்று warning threshold-உடன், மற்றொன்று இந்த timeseries முழுவதும் சராசரி மதிப்புகளைக் குறிக்கிறது. இதில் காட்டப்படும் traffic அளவைப் போல, வரையறுக்கப்பட்ட மதிப்பிற்கு கீழ் இறங்கும்போது warning threshold அலாரங்கள் breach நிலையில் இருக்க வேண்டும்.

![இரண்டு அலாரங்களுடன் Timeseries](../images/cwalarm2.png)

:::info
	ஒரு அலாரத்தின் நோக்கம் ஒரு செயலைத் தூண்டுவது (மனித அல்லது programmatic), அல்லது தகவலளிப்பது (ஒரு threshold மீறப்பட்டுள்ளது). அலாரங்கள் ஒரு metric-ன் செயல்திறன் பற்றிய நுண்ணறிவை வழங்குகின்றன.
:::
## செயல்படக்கூடிய விஷயங்களில் alert செய்யுங்கள்

Alarm fatigue என்பது மக்கள் அதிகமான alerts பெற்று அவற்றை புறக்கணிக்க கற்றுக்கொள்ளும்போது ஏற்படுவது. இது நன்கு கண்காணிக்கப்படும் அமைப்பின் அறிகுறி அல்ல! மாறாக இது ஒரு anti-pattern.

:::info
	செயல்படக்கூடிய விஷயங்களுக்கு அலாரங்களை உருவாக்குங்கள், மேலும் எப்போதும் உங்கள் [இலக்குகளிலிருந்து](../guides/index.md#monitor-what-matters) பின்னோக்கி வேலை செய்ய வேண்டும்.
:::

எடுத்துக்காட்டாக, வேகமான response times தேவைப்படும் ஒரு web site-ஐ இயக்கினால், உங்கள் response times கொடுக்கப்பட்ட threshold-ஐ மீறும்போது alert வழங்க உருவாக்குங்கள். மோசமான performance உயர் CPU utilization-உடன் தொடர்புடையது என்று கண்டறிந்திருந்தால், சிக்கலாக மாறுவதற்கு *முன்பே* இந்த datapoint-ல் *proactively* alert செய்யுங்கள். இருப்பினும், உங்கள் சூழலில் *எல்லா இடங்களிலும்* அனைத்து CPU utilization-லும் alert செய்ய வேண்டிய அவசியம் இல்லை, அது உங்கள் *இலக்குகளை ஆபத்தில்* ஆழ்த்தவில்லை என்றால்.

:::info
	ஒரு அலாரம் உங்களை alert செய்ய அல்லது automated process-ஐ trigger செய்ய வேண்டியதில்லை என்றால், அது உங்களை alert செய்ய வேண்டிய அவசியமில்லை. தேவையற்ற அலாரங்களிலிருந்து notifications-ஐ அகற்ற வேண்டும்.
:::

## "எல்லாம் சரி அலாரம்" குறித்து எச்சரிக்கையாக இருங்கள்

அதேபோல், ஒரு பொதுவான pattern "எல்லாம் சரி" அலாரம் ஆகும், operators தொடர்ச்சியான alerts பெறுவதில் பழகிவிட்டு, திடீரென அமைதியாகும்போது மட்டுமே கவனிக்கிறார்கள்! இது இயக்குவதற்கு மிகவும் ஆபத்தான முறை, operational excellence-க்கு எதிராக வேலை செய்யும் ஒரு pattern.

:::warning
	"எல்லாம் சரி அலாரம்" பொதுவாக ஒரு மனிதன் அதை விளக்க வேண்டும்! இது self-healing applications போன்ற patterns-ஐ சாத்தியமற்றதாக ஆக்குகிறது.[^1]
:::
## Aggregation மூலம் alarm fatigue-ஐ எதிர்த்துப் போராடுங்கள்

Observability ஒரு *மனித* சிக்கல், தொழில்நுட்ப சிக்கல் அல்ல. எனவே, உங்கள் alarm strategy மேலும் உருவாக்குவதை விட அலாரங்களை குறைப்பதில் கவனம் செலுத்த வேண்டும். நீங்கள் telemetry collection-ஐ செயல்படுத்தும்போது, உங்கள் சூழலிலிருந்து அதிக alerts வருவது இயல்பானது. ஆனால் [செயல்படக்கூடிய விஷயங்களில் மட்டும் alert செய்யுங்கள்](#alert-on-things-that-are-actionable). Alert-ஐ ஏற்படுத்திய நிலை செயல்படக்கூடியதாக இல்லை என்றால், அதை report செய்ய வேண்டிய அவசியமில்லை.

இதை ஒரு உதாரணத்தின் மூலம் சிறப்பாகக் காட்டலாம்: ஒரே database-ஐ backend-ஆக பயன்படுத்தும் ஐந்து web servers இருந்தால், database down ஆனால் உங்கள் web servers-க்கு என்ன நடக்கும்? பல பேருக்கு பதில் என்னவென்றால், அவர்கள் *குறைந்தது ஆறு* alerts பெறுவார்கள் - web servers-க்கு *ஐந்து* மற்றும் database-க்கு *ஒன்று*!

![ஆறு அலாரங்கள்](../images/alarm3.png)

ஆனால் வழங்குவதற்கு அர்த்தமுள்ள இரண்டே alerts உள்ளன:

1. Web site down ஆகிவிட்டது, மற்றும்
1. Database தான் காரணம்

![இரண்டு அலாரங்கள்](../images/alarm4.png)

:::info
	உங்கள் alerts-ஐ aggregates-ஆக வடிகட்டுவது மக்கள் புரிந்துகொள்வதை எளிதாக்குகிறது, பின்னர் runbooks மற்றும் automation-ஐ உருவாக்குவதை எளிதாக்குகிறது.
:::
## உங்கள் தற்போதைய ITSM மற்றும் support processes-ஐ பயன்படுத்துங்கள்

உங்கள் monitoring மற்றும் observability platform-ஐ பொருட்படுத்தாமல், அவை உங்கள் தற்போதைய toolchain-உடன் ஒருங்கிணைக்க வேண்டும்.

:::info
	உங்கள் alerts-லிருந்து இந்த கருவிகளுக்கு programmatic integration பயன்படுத்தி trouble tickets மற்றும் issues உருவாக்குங்கள், மனித முயற்சியை அகற்றி, செயல்முறைகளை streamline செய்யுங்கள்.
:::
இது [DORA metrics](https://en.wikipedia.org/wiki/DevOps) போன்ற முக்கியமான operational தரவைப் பெற உங்களை அனுமதிக்கிறது.

## Cron Schedule-ல் Alarm Actions-ஐ இயக்குதல்

அலாரங்கள் AWS resources-க்கான அத்தியாவசிய monitoring திறன்களை வழங்குகின்றன, குழுக்கள் மெட்ரிக்குகளை track செய்யவும் thresholds மீறப்படும்போது notifications பெறவும் உதவுகின்றன. இந்த monitoring operational awareness-ஐ பராமரிக்க முக்கியமானது என்றாலும், scheduled resource shutdowns-ஐ உள்ளடக்கிய cost optimization strategies-ஐ நிறுவனங்கள் செயல்படுத்தும்போது ஒரு பொதுவான சவால் எழுகிறது. இந்த குறிப்பிட்ட சூழ்நிலையில், production resources வணிக நேரத்திற்கு வெளியே (திங்கள் முதல் வெள்ளி வரை மாலை 6 முதல் காலை 6 வரை மற்றும் வார இறுதிகளில்) தானாக shutdown ஆகும்படி உள்ளமைக்கப்படுகின்றன. இருப்பினும், CloudWatch Alarms இந்த திட்டமிட்ட downtime காலங்களில் monitor செய்து notifications trigger செய்வதை தொடர்கின்றன, resources வேண்டுமென்றே offline-ல் இருக்கும்போது தேவையற்ற alerts-ஐ ஏற்படுத்துகின்றன. EventBridge Schedules மற்றும் Lambda functions பயன்படுத்தி resource scheduling-உடன் ஒத்துவரும் tags அடிப்படையில் அலாரங்களை programmatically enable மற்றும் disable செய்ய ஒரு தீர்வை செயல்படுத்தலாம், வணிக நேரங்களில் effective monitoring-ஐ உறுதிசெய்து திட்டமிட்ட downtimes-ல் false alerts-ஐ அகற்றலாம்.

### Architecture
![Alarm Scheduler Architecture](./images/alarm-schedule-arch.png)

### Deployment

Repo-ஐ clone செய்யுங்கள்:
```
git clone https://github.com/aws-observability/observability-best-practices.git
```

CloudFormation template-ஐ கண்டறியுங்கள்:
```
cd observability-best-practices/sandbox/cw-alarm-scheduler
```

CloudFormation template அந்த directory-ல் 'cf.yaml' ஆகும்.

CloudFormation console-க்கு சென்று அந்த template-லிருந்து ஒரு stack உருவாக்குங்கள்:

1. Stack விவரங்களை குறிப்பிடுங்கள்:
    1. Stack name கொடுங்கள்:
        1. Stack name: $STACK-NAME
    2. Parameters:
        1. DisableAlarmsCronSchedule: (அலாரங்களை disable செய்ய எப்போது என்று வரையறுக்க cron expression உள்ளிடுங்கள்)
            1. Default cron(00 18 ? * 1-5 *)
        2. EnableAlarmsCronSchedule: (அலாரங்களை enable செய்ய எப்போது என்று வரையறுக்க cron expression உள்ளிடுங்கள்)
            1. Default cron(00 06 ? * 1-5 *)
        3. LambdaArchitecture: Lambda function architecture-ஐ தேர்வு செய்யுங்கள் (x86_64 அல்லது arm64)
            1. Default arm64
        4. ScheduleTimezone: dropdown list-லிருந்து time zone-ஐ தேர்வு செய்யுங்கள்
            1. Default America/New_York
        5. SuppressTagKey: CloudWatch Alarms-ஐ வடிகட்ட tag-க்கான Key (எ.கா., 'suppress' அல்லது 'snooze')
            1. Default "suppress"
        6. SuppressTagValue: CloudWatch Alarms-ஐ வடிகட்ட tag-க்கான Value (எ.கா., 'true')
            1. Default "true"
    3. Next

நீங்கள் CloudFormation parameters-ல் தேர்வு செய்யும் key value-உடன் tag செய்யப்பட்ட அலாரங்கள் நீங்கள் தேர்வு செய்த Cron Schedule-ஐ பின்பற்றும்.

எடுத்துக்காட்டாக:

SuppressTagKey-க்கு 'suppress' மற்றும் SuppressTagValue-க்கு 'true' தேர்வு செய்தால், 'suppress':'true' என்ற tag கொண்ட அனைத்து அலாரங்களும் நீங்கள் DisableAlarmsCronSchedule மற்றும் EnableAlarmsCronSchedule-ல் அமைத்த schedule-ஐ பின்பற்றும்.

:::info
நடத்தை:
அலாரங்கள் disable செய்யப்படும்போது:
* எந்த alerts அல்லது notifications-ம் உருவாக்கப்படாது
* Metric collection தடையின்றி தொடரும்

அலாரங்கள் மீண்டும் enable செய்யப்படும்போது:
* சாதாரண alerting functionality சிறிது நேரத்தில் மீண்டும் தொடங்கும்
:::

[^1]: இந்த pattern பற்றி மேலும் அறிய https://aws.amazon.com/blogs/apn/building-self-healing-infrastructure-as-code-with-dynatrace-aws-lambda-and-aws-service-catalog/ பார்க்கவும்.

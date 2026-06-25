# Kotlin சேவைகளுக்கான Application Signals

## அறிமுகம்

Kotlin வலை அப்ளிகேஷன்களின் செயல்திறன் மற்றும் ஆரோக்கியத்தை கண்காணிப்பது, வெவ்வேறு கூறுகளுக்கிடையேயான சிக்கலான தொடர்புகள் காரணமாக சவாலாக இருக்கலாம். [Kotlin](https://kotlinlang.org/) வலை சேவைகள் பொதுவாக Java Archive (jar) கோப்புகளாக உருவாக்கப்படுகின்றன, அவை Java இயங்கும் எந்த தளத்திலும் டிப்ளாய் செய்யப்படலாம். இந்த அப்ளிகேஷன்கள் பெரும்பாலும் தரவுத்தளங்கள், வெளிப்புற API-கள் மற்றும் கேச்சிங் அடுக்குகள் போன்ற பல ஒன்றோடொன்று இணைக்கப்பட்ட கூறுகளை உள்ளடக்கிய விநியோகிக்கப்பட்ட சூழல்களில் செயல்படுகின்றன. இந்த சிக்கலான தன்மை உங்கள் சராசரி தீர்வு நேரத்தை (MTTR) கணிசமாக அதிகரிக்கலாம்.

இந்த வழிகாட்டியில், Linux EC2 சர்வரில் இயங்கும் Kotlin வலை சேவைகளை தானியங்கு-கருவியாக்கம் (auto-instrument) செய்வது எப்படி என்று காட்டுவோம். [CloudWatch Application Signals](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-Application-Monitoring-Sections.html) ஐ செயல்படுத்துவது, எந்த குறியீட்டு மாற்றங்களும் செய்யாமல் உங்கள் அப்ளிகேஷன்களிலிருந்து மெட்ரிக்குகள் மற்றும் ட்ரேஸ்களை சேகரிக்க [AWS Distro for OpenTelemetry](https://aws-otel.github.io/docs/introduction) (ADOT) Java Auto-Instrumentation Agent ஐ பயன்படுத்தி டெலிமெட்ரி சேகரிப்பை அனுமதிக்கிறது. அழைப்பு அளவு, கிடைக்கும்தன்மை, தாமதம், தோல்விகள் மற்றும் பிழைகள் போன்ற முக்கிய மெட்ரிக்குகளை பயன்படுத்தி உங்கள் அப்ளிகேஷன் சேவைகளின் தற்போதைய செயல்பாட்டு ஆரோக்கியத்தை விரைவாக பார்க்கவும், அவை நீண்ட கால செயல்திறன் மற்றும் வணிக இலக்குகளை எட்டுகின்றனவா என்பதை சரிபார்க்கவும் முடியும்.

## முன்நிபந்தனைகள்

- CloudWatch Application Signals உடன் தொடர்புகொள்ள சரியான [IAM அனுமதிகளுடன்](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Application_Signals_Permissions.html) ஒரு Linux EC2 நிகழ்வு. இந்த வழிகாட்டி இதற்கு [Amazon Linux](https://aws.amazon.com/linux/amazon-linux-2023/) நிகழ்வை பயன்படுத்துகிறது, எனவே நீங்கள் வேறொன்றை பயன்படுத்தினால் உங்கள் கட்டளைகள் சற்று மாறுபடலாம்.
- நிகழ்வுக்கு [SSH](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/connect-linux-inst-ssh.html) மூலம் இணைக்கும் திறன்.

## தீர்வு மேலோட்டம்

உயர் மட்டத்தில், நாம் செய்யவிருக்கும் படிகள் பின்வருமாறு.

- CloudWatch Application Signals ஐ செயல்படுத்துதல்.
- [ktor வலை சேவையை](https://ktor.io/) fat jar இல் டிப்ளாய் செய்தல்.
- வலை சேவையிலிருந்து Application Signals ஐ பெற கட்டமைக்கப்பட்ட CloudWatch ஏஜெண்ட்டை நிறுவுதல்.
- [ADOT](https://aws-otel.github.io/docs/getting-started/java-sdk/auto-instr#introduction) Auto Instrumentation Agent ஐ பதிவிறக்குதல்.
- சேவையை தானியங்கு-கருவியாக்கம் செய்ய java agent உடன் kotlin சேவை jar ஐ இயக்குதல்.
- டெலிமெட்ரியை உருவாக்க சில சோதனைகளை இயக்குதல்.

### கட்டமைப்பு வரைபடம்

![Architecture](./images/kotlin-arch.png)

### CloudWatch Application Signals ஐ செயல்படுத்துதல்

உங்கள் கணக்கில் படி 1: [Application Signals ஐ செயல்படுத்துதல்](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-Application-Signals-Enable-EC2.html#CloudWatch-Application-Signals-EC2-Grant) இல் உள்ள வழிமுறைகளைப் பின்பற்றவும்.

### Ktor வலை சேவையை டிப்ளாய் செய்தல்
[Ktor](https://ktor.io/) என்பது வலை சேவைகளை உருவாக்குவதற்கான பிரபலமான kotlin கட்டமைப்பாகும். இது ஒத்திசைவற்ற சர்வர்-பக்க அப்ளிகேஷன்களுடன் விரைவாக தொடங்க உதவுகிறது.

வேலை செய்யும் கோப்பகத்தை உருவாக்கவும்
```
mkdir kotlin-signals && cd kotlin-signals
```

Ktor எடுத்துக்காட்டுகள் repo ஐ குளோன் செய்யவும்
```
git clone https://github.com/ktorio/ktor-samples.git && cd ktor-samples/structured-logging
```

அப்ளிகேஷனை உருவாக்கவும்
```
./gradlew build && cd build/libs
```

அப்ளிகேஷன் இயங்குகிறதா என்று சோதிக்கவும்
```
java -jar structured-logging-all.jar
```

சேவை சரியாக உருவாக்கப்பட்டு இயங்கியதாக கருதினால், இப்போது `ctrl + c` உடன் நிறுத்தலாம்

### CloudWatch Agent ஐ கட்டமைத்தல்
Amazon Linux நிகழ்வுகளில் CloudWatch agent இயல்பாகவே நிறுவப்பட்டிருக்கும். உங்கள் நிகழ்வில் இல்லையெனில், அதை [நிறுவ](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/install-CloudWatch-Agent-on-EC2-Instance.html) வேண்டும்.

நிறுவியதும், இப்போது கட்டமைப்பு கோப்பை உருவாக்கலாம்.
```
sudo nano /opt/aws/amazon-cloudwatch-agent/bin/app-signals-config.json
```

பின்வரும் கட்டமைப்பை கோப்பில் நகலெடுத்து ஒட்டவும்
```
{
    "traces": {
        "traces_collected": {
            "app_signals": {}
        }
    },
    "logs": {
        "metrics_collected": {
            "app_signals": {}
        }
    }
}
```

கோப்பை சேமித்து, நாம் இப்போது உருவாக்கிய config உடன் CloudWatch agent ஐ தொடங்கவும்
```
sudo /opt/aws/amazon-cloudwatch-agent/bin/amazon-cloudwatch-agent-ctl -a fetch-config -m ec2 -s -c file:/opt/aws/amazon-cloudwatch-agent/bin/app-signals-config.json
```

### ADOT Auto Instrumentation Agent ஐ பதிவிறக்குதல்

உங்கள் jar கோப்பு இருக்கும் கோப்பகத்திற்கு செல்லவும், இந்த ஆர்ப்பாட்டத்தை எளிதாக்க நாம் agent ஐ இங்கே வைப்போம். உண்மையான சூழ்நிலையில் இது அதன் சொந்த கோப்புறையில் இருக்கும்.

```
cd kotlin-signals/ktor-samples/structured-logging/build/libs
```

Auto Instrumentation Agent ஐ பதிவிறக்கவும்
```
wget https://github.com/aws-observability/aws-otel-java-instrumentation/releases/latest/download/aws-opentelemetry-agent.jar
```

### உங்கள் Ktor சேவையை ADOT agent உடன் இயக்குதல்
```
OTEL_RESOURCE_ATTRIBUTES=service.name=KotlinApp,service.namespace=MyKotlinService,aws.hostedin.environment=EC2 \
OTEL_AWS_APPLICATION_SIGNALS_ENABLED=true \
OTEL_AWS_APPLICATION_SIGNALS_EXPORTER_ENDPOINT=http://localhost:4316/v1/metrics \
OTEL_EXPORTER_OTLP_PROTOCOL=http/protobuf \
OTEL_EXPORTER_OTLP_TRACES_ENDPOINT=http://localhost:4316/v1/traces \
OTEL_METRICS_EXPORTER=none \
OTEL_LOGS_EXPORT=none \
java -javaagent:aws-opentelemetry-agent.jar -jar structured-logging-all.jar
```

### டெலிமெட்ரியை உருவாக்க சேவைக்கு ட்ராஃபிக் உருவாக்குதல்
```
for i in {1..1800}; do curl http://localhost:8080 && sleep 2; done
```

## உங்கள் டெலிமெட்ரியை மதிப்பாய்வு செய்தல்

இப்போது CloudWatch இன் 'Services' பிரிவில் Kotlin சேவை தெரிவதை நீங்கள் பார்க்க முடியும்

![kotlin-service](./images/kotlin-services.png)

எங்கள் சேவையை 'Service Map' இலும் பார்க்கலாம்

![kotlin-service-map](./images/kotlin-service-map.png)

கருவியாக்கம் Latency போன்ற மதிப்புள்ள மெட்ரிக்குகளை வழங்குகிறது:

![kotlin-metrics](./images/kotlin-metrics.png)

### அடுத்த படிகள்

இங்கிருந்து உங்கள் அடுத்த படிகள் [Application Signals அனுபவத்தை](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-Application-Monitoring-Sections.html) மேலும் ஆராய்வதாக இருக்கும், உங்கள் சேவைக்கு [SLO-களை](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-ServiceLevelObjectives.html) உருவாக்குவது உட்பட. மற்றொரு நல்ல அடுத்த படி, மிகவும் சிக்கலான பின்தளத்தை உருவாக்க Ktor இல் மேலும் kotlin மைக்ரோசர்வீஸ்களை உருவாக்குவதாக இருக்கும். விநியோகிக்கப்பட்ட, சிக்கலான சூழல்கள் தான் Application Signals போன்ற கருவியில் நீங்கள் அதிக நன்மையை காண்பீர்கள்.

### சுத்தப்படுத்துதல்

உங்கள் EC2 நிகழ்வை முடித்து `/aws/appsignals/generic` log group ஐ நீக்கவும்.

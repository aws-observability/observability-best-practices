# மெட்ரிக்குகள்

மெட்ரிக்குகள் என்பது அவை உருவாக்கப்பட்ட நேரத்துடன் வரிசையில் வைக்கப்படும் எண் மதிப்புகளின் தொடர் ஆகும். உங்கள் சூழலில் உள்ள servers-ன் எண்ணிக்கை, அவற்றின் disk usage, அவை ஒரு வினாடிக்கு கையாளும் requests எண்ணிக்கை, அல்லது இந்த requests-ஐ முடிப்பதில் latency ஆகிய அனைத்தையும் track செய்ய அவை பயன்படுத்தப்படுகின்றன.

ஆனால் மெட்ரிக்குகள் infrastructure அல்லது application monitoring-க்கு மட்டும் வரையறுக்கப்படவில்லை. மாறாக, அவை sales, call queues மற்றும் customer satisfaction-ஐ track செய்ய எந்த வகையான business அல்லது workload-க்கும் பயன்படுத்தப்படலாம். உண்மையில், operational data மற்றும் business metrics இரண்டையும் இணைக்கும்போது மெட்ரிக்குகள் மிகவும் பயனுள்ளவை, நன்கு வட்டமான பார்வை மற்றும் observable system-ஐ வழங்குகின்றன.

மெட்ரிக்குகள் பற்றிய கூடுதல் சூழலை வழங்கும் [OpenTelemetry ஆவண பக்கத்தை](https://opentelemetry.io/docs/concepts/signals/metrics/) பார்ப்பது பயனுள்ளதாக இருக்கலாம்.

## உங்கள் Key Performance Indicators (KPIs)-ஐ அறிந்து, அவற்றை அளவிடுங்கள்!

மெட்ரிக்குகளில் *மிக* முக்கியமான விஷயம் *சரியான விஷயங்களை அளவிடுவது*. அவை என்ன என்பது ஒவ்வொருவருக்கும் வேறுபட்டதாக இருக்கும். ஒரு e-commerce பயன்பாட்டிற்கு ஒரு மணி நேரத்திற்கு sales ஒரு முக்கியமான KPI ஆக இருக்கலாம், அதேசமயம் ஒரு bakery ஒரு நாளுக்கு தயாரிக்கப்படும் croissants எண்ணிக்கையில் அதிக ஆர்வம் கொண்டிருக்கும்.

:::warning
	உங்கள் business KPIs-க்கு ஒற்றை, முற்றிலும் முழுமையான, விரிவான source இல்லை. உங்கள் *output goals* என்ன என்பதை அறிய உங்கள் project அல்லது application-ஐ நன்கு புரிந்துகொள்ள வேண்டும்.
:::
உங்கள் முதல் படி உங்கள் உயர்-நிலை goals-ஐ பெயரிடுவது, பெரும்பாலும் அந்த goals உங்கள் infrastructure-லிருந்து மட்டும் வரும் ஒற்றை metric-ஆக வெளிப்படுத்தப்படவில்லை. மேலே உள்ள e-commerce உதாரணத்தில், *ஒரு மணி நேரத்திற்கு sales* அளவிடுவது என்ற *meta* goal-ஐ கண்டறிந்தவுடன், வாங்குவதற்கு முன் ஒரு product-ஐ தேட எடுத்த நேரம், checkout process-ஐ முடிக்க எடுத்த நேரம், product search results-ன் latency போன்ற விரிவான metrics-க்கு பின்னோக்கி செல்லலாம். இது system-ஐ observe செய்ய தொடர்புடைய தகவலை சேகரிப்பதில் intentional ஆக இருக்க நம்மை வழிநடத்தும்.

:::info
	உங்கள் KPIs-ஐ கண்டறிந்த பிறகு, உங்கள் workload-ல் எந்த metrics அவற்றை பாதிக்கின்றன என்பதை பார்க்க இப்போது *பின்னோக்கி வேலை* செய்யலாம்.
:::
## Operational metric data-வுடன் correlate செய்யுங்கள்

உங்கள் web server-ல் உயர் CPU utilization மெதுவான response times-ஐ ஏற்படுத்தினால், இது அதிருப்தியான வாடிக்கையாளர்களை உருவாக்கி, இறுதியில் குறைவான revenue-க்கு வழிவகுத்தால், உங்கள் CPU utilization-ஐ அளவிடுவது உங்கள் business outcomes-ல் நேரடி தாக்கத்தை ஏற்படுத்துகிறது, *நிச்சயமாக* அளவிடப்பட வேண்டும்!

அல்லது மாறாக, ephemeral cloud resources-ல் (Amazon EC2 fleet போன்ற, அல்லது பிற cloud provider environments-ல் ஒத்தவை) batch processing செய்யும் ஒரு பயன்பாடு உங்களிடம் இருந்தால், batch-ஐ முடிக்க மிகவும் cost-effective வழியை அடைய CPU-ஐ முடிந்தவரை பயன்படுத்த *விரும்பலாம்*.

இரண்டு சந்தர்ப்பங்களிலும், உங்கள் operational data (எ.கா., CPU utilization) உங்கள் business metrics-உடன் ஒரே system-ல் இருக்க வேண்டும், இரண்டையும் correlate செய்ய முடியும்.

:::info
	உங்கள் business metrics மற்றும் operational metrics-ஐ ஒரே system-ல் சேமியுங்கள், அங்கு நீங்கள் அவற்றை correlate செய்து இரண்டிலும் observed impacts-ன் அடிப்படையில் முடிவுகளை எடுக்கலாம்.
:::
## நல்லது எப்படி இருக்கும் என்பதை அறியுங்கள்!

ஆரோக்கியமான baseline என்னவென்று புரிந்துகொள்வது சவாலாக இருக்கலாம். பலர் ஆரோக்கியமான metrics எப்படி இருக்கும் என்பதை புரிந்துகொள்ள தங்கள் workloads-ஐ stress test செய்ய வேண்டியிருக்கும். இருப்பினும், உங்கள் தேவைகளைப் பொறுத்து, ஆரோக்கியமான thresholds பற்றி பாதுகாப்பான முடிவுகளை எடுக்க தற்போதைய operational metrics-ஐ observe செய்ய முடியலாம்.

ஆரோக்கியமான workload என்பது உங்கள் KPI objectives-ஐ பூர்த்தி செய்வது, resilient, available மற்றும் cost-effective ஆக இருப்பதற்கான சமநிலையைக் கொண்டது.

:::info
	உங்கள் KPIs-க்கு கண்டிப்பாக ஒரு identified ஆரோக்கியமான range இருக்க வேண்டும், performance தேவைக்கு கீழே அல்லது மேலே விழும்போது [அலாரங்களை](./alarms.md) உருவாக்க முடியும்.
:::
## Anomaly detection algorithms-ஐ பயன்படுத்துங்கள்

[நல்லது எப்படி இருக்கும் என்பதை அறிவதில்](#know-what-good-looks-like) உள்ள சவால் என்னவென்றால், உங்கள் system-ல் *ஒவ்வொரு* metric-க்கும் ஆரோக்கியமான thresholds-ஐ அறிவது நடைமுறையற்றதாக இருக்கலாம். ஒரு Relational Database Management System (RDBMS) பல்வேறு performance metrics-ஐ உமிழலாம், microservices architecture-உடன் இணைக்கப்படும்போது உங்கள் KPIs-ஐ பாதிக்கக்கூடிய நூற்றுக்கணக்கான metrics இருக்கலாம்.

இவ்வளவு பெரிய எண்ணிக்கையிலான datapoints-ஐ கவனித்து அவற்றின் upper மற்றும் lower thresholds-ஐ தனித்தனியாக கண்டறிவது மனிதர்களுக்கு எப்போதும் நடைமுறையானதாக இருக்காது. ஆனால் machine learning இந்த வகையான repetitive task-ல் *மிகவும் திறமையானது*. Automation மற்றும் machine learning-ஐ முடிந்தவரை பயன்படுத்துங்கள், இது நீங்கள் இல்லையென்றால் அறியாமல் இருக்கக்கூடிய சிக்கல்களை கண்டறிய உதவும்!

:::info
	உங்கள் workload-ன் performance thresholds-ஐ தானாகவே கணக்கிட machine learning algorithms மற்றும் anomaly detection models-ஐ பயன்படுத்துங்கள்.
:::

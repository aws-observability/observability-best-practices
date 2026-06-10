# தரவு விஞ்ஞானிகள், AI/ML, MLOps பொறியாளர்கள்

தரவு பொறியியல் மற்றும் இயந்திர கற்றல் செயல்பாடுகளில் Observability நம்பகமான, திறனுள்ள மற்றும் நம்பத்தகுந்த தரவு பைப்லைன்கள் மற்றும் ML மாடல்களை பராமரிப்பதற்கு முக்கியமானது. சரியான observability இல்லாமல், ML அமைப்புகள் பராமரிக்க, பிழைத்திருத்த மற்றும் மேம்படுத்த கடினமான கருப்பு பெட்டிகளாக மாறுகின்றன. இது நம்பகமற்ற கணிப்புகள், அதிகரித்த செலவுகள் மற்றும் சாத்தியமான வணிக தாக்கங்களுக்கு வழிவகுக்கும்.

தரவு மற்றும் ML செயல்பாடுகளில் உங்கள் observability உத்தியை வழிநடத்த முக்கிய சிறந்த நடைமுறைகள் இங்கே உள்ளன.

## சிறந்த நடைமுறைகள்
கண்காணிப்புக்கு CloudWatch [லாக்குகள்](https://aws-observability.github.io/observability-best-practices/tools/logs/) மற்றும் [மெட்ரிக்குகள்](https://aws-observability.github.io/observability-best-practices/tools/metrics) மற்றும் [ட்ரேஸ்கள்](https://aws-observability.github.io/observability-best-practices/tools/xray) ஐ பயன்படுத்தவும். அனைத்து ரிசோர்ஸ்களுக்கும் ஒரு tagging உத்தியை செயல்படுத்தவும், முக்கியமான நிகழ்வுகளுக்கு metric filters ஐ உருவாக்கவும், [anomaly detection](https://aws-observability.github.io/observability-best-practices/tools/metrics#anomaly-detection) ஐ அமைக்கவும் மற்றும் [CloudWatch alarms](https://aws-observability.github.io/observability-best-practices/tools/alarms) ஐ பயன்படுத்தி alert thresholds ஐ கட்டமைக்கவும்.

### தரவு தர உறுதி
இது தரவு வாழ்க்கைச் சுழற்சி முழுவதும் தரவு தரம், பைப்லைன் செயல்திறன் மற்றும் உள்கட்டமைப்பு ஆரோக்கியத்தை கண்காணிப்பதை உறுதி செய்கிறது.

முக்கிய கண்காணிப்பு பகுதிகள்:
- ETL பைப்லைன்கள் throughput, செயலாக்க நேரம் மற்றும் பிழை விகிதங்கள்
- தரவு தரத்திற்கான தரவு பேட்டர்ன்களில் anomaly detection, feature drift detection, பயிற்சி/inference தரவுக்கான distribution analysis

### மாடல் செயல்திறன் கண்காணிப்பு
Amazon CloudWatch உடன் ஒருங்கிணைப்பு மூலம், AWS தானாகவே விரிவான பயிற்சி parameters, hyperparameters, pipeline execution மெட்ரிக்குகள், job performance மெட்ரிக்குகள் மற்றும் infrastructure utilization மெட்ரிக்குகளை படம்பிடிக்கிறது, இது பயிற்சி jobs இன் முழுமையான பகுப்பாய்வு மற்றும் பிழைத்திருத்தத்தை செயல்படுத்துகிறது. Model versioning மற்றும் registry திறன்கள் model iterations, metadata மற்றும் approval states ஐ முறையாக கண்காணிப்பதை உறுதி செய்கின்றன, இது model lineage ஐ நிர்வகிப்பதை எளிதாக்குகிறது.

[Amazon SageMaker Model Monitor](https://docs.aws.amazon.com/sagemaker/latest/dg/how-it-works-model-monitor.html) உற்பத்தி சூழல்களில் இயந்திர கற்றல் மாடல்களை தொடர்ச்சியாக கண்காணிக்கிறது. data drift மற்றும் anomalies போன்ற மாடல் தரத்தில் விலகல்கள் இருக்கும் போது தூண்டும் தானியங்கி alert systems ஐ இது வழங்குகிறது. இந்த அமைப்பு கண்காணிப்பு தரவை சேகரிக்க [Amazon CloudWatch Logs](https://aws-observability.github.io/observability-best-practices/tools/logs/#search-with-cloudwatch-logs) உடன் ஒருங்கிணைகிறது, டிப்ளாய் செய்யப்பட்ட மாடல்களின் முன்கூட்டிய கண்டறிதல் மற்றும் செயல்திறன் பராமரிப்பை செயல்படுத்துகிறது.

CloudWatch மெட்ரிக்குகள் அல்லது [ADOT](https://aws-observability.github.io/observability-best-practices/guides/operational/adot-at-scale/operating-adot-collector) மற்றும் [Amazon OpenSearch Service (OpenSearch Service)](https://aws-observability.github.io/observability-best-practices/patterns/opensearch) போன்ற சேவைகளைப் பயன்படுத்தி accuracy மற்றும் latency போன்ற model prediction எண்ட்பாயிண்ட் மெட்ரிக்குகளை ஒருங்கிணைத்து பகுப்பாய்வு செய்வதற்கான ஒரு வழிமுறையை உருவாக்கவும். OpenSearch Service டாஷ்போர்டுகள் மற்றும் காட்சிப்படுத்தலுக்கு Kibana ஐ ஆதரிக்கிறது. traceability தற்போதைய செயல்பாட்டு செயல்திறனை பாதிக்கக்கூடிய மாற்றங்களின் பகுப்பாய்வை அனுமதிக்கிறது.

### உள்கட்டமைப்பு கண்காணிப்பு
AWS resource utilization, storage patterns மற்றும் computational efficiency ஆகியவற்றில் ஆழமான தெரிவுநிலையை வழங்குகிறது. CloudWatch Metrics மற்றும் [OpenTelemetry](https://aws-observability.github.io/observability-best-practices/patterns/otel) CPU usage, memory allocation மற்றும் I/O operations பற்றிய நிகழ்நேர தரவை படம்பிடிக்கின்றன, அதே சமயம் CloudWatch Logs பகுப்பாய்வுக்காக லாக் தரவை ஒருங்கிணைக்கிறது. [AWS X-Ray](https://aws-observability.github.io/observability-best-practices/tools/xray) ML pipeline நிலைகள் முழுவதும் service dependencies ஐ trace செய்வதற்கும் system bottlenecks ஐ அடையாளம் காண்பதற்கும் உதவுகிறது, இது திறமையான resource optimization மற்றும் செலவு நிர்வாகத்தை செயல்படுத்துகிறது.

### இணக்கம் மற்றும் நிர்வாகம்
பல கணக்குகள் முழுவதும் ML resources இன் மையப்படுத்தப்பட்ட நிர்வாகம் மற்றும் model versions, lineage மற்றும் approval workflows tracking முக்கியமானது. AWS CloudTrail ஒழுங்குமுறை இணக்கம் மற்றும் நிர்வாகத்திற்கு அத்தியாவசியமான அனைத்து API activities இன் audit logs ஐ பராமரிக்கிறது.

### வணிக தாக்க பகுப்பாய்வு
CloudWatch இல் [Custom metrics](https://aws-observability.github.io/observability-best-practices/tools/metrics#collecting-metrics) வணிக-குறிப்பிட்ட KPI களை கண்காணிக்க முடியும், QuickSight டாஷ்போர்டுகள் மூலம் ML முயற்சிகளின் ROI ஐ நிகழ்நேர காட்சிப்படுத்தலை செயல்படுத்துகிறது. Amazon QuickSight தொழில்நுட்ப மெட்ரிக்குகளை வணிக insights ஆக மொழிபெயர்க்கும் interactive டாஷ்போர்டுகளை உருவாக்குகிறது, ML செயல்திறனை வணிக KPI களுடன் இணைக்கிறது. Amazon CloudWatch [ServiceLens](https://aws-observability.github.io/observability-best-practices/tools/rum#enable-active-tracing) பயனர் அனுபவ தாக்கங்களை கண்காணிக்க உதவுகிறது.

## குறிப்புகள்
- [AWS Observability Workshop](https://catalog.workshops.aws/observability/en-US)
- [AWS Observability Best Practices](https://aws-observability.github.io/observability-best-practices/)
- [AWS Well-Architected Framework Machine Learning Lens](https://docs.aws.amazon.com/wellarchitected/latest/machine-learning-lens/machine-learning-lens.html)
- [Sagemaker Logging and Monitoring](https://docs.aws.amazon.com/sagemaker/latest/dg/sagemaker-incident-response.html)
- [Amazon CloudWatch உடன் Amazon SageMaker AI ஐ கண்காணிப்பதற்கான மெட்ரிக்குகள்](https://docs.aws.amazon.com/sagemaker/latest/dg/monitoring-cloudwatch.html)

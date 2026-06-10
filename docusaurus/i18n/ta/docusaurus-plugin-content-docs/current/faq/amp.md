# Amazon Managed Service for Prometheus - அடிக்கடி கேட்கப்படும் கேள்விகள்

## தற்போது எந்த AWS பிராந்தியங்கள் ஆதரிக்கப்படுகின்றன, மற்ற பிராந்தியங்களிலிருந்து மெட்ரிக்குகளை சேகரிக்க முடியுமா?

நாங்கள் ஆதரிக்கும் பிராந்தியங்களின் புதுப்பிக்கப்பட்ட பட்டியலுக்கு எங்கள் [ஆவணத்தைப்](https://docs.aws.amazon.com/prometheus/latest/userguide/what-is-Amazon-Managed-Service-Prometheus.html) பாருங்கள். எங்கள் தற்போதைய Product Feature Requests (PFRs)-ஐ சிறப்பாக முன்னுரிமைப்படுத்த நீங்கள் விரும்பும் பிராந்தியங்களை எங்களுக்கு தெரிவியுங்கள். நீங்கள் எந்த பிராந்தியத்திலிருந்தும் தரவைச் சேகரித்து நாங்கள் ஆதரிக்கும் குறிப்பிட்ட பிராந்தியத்திற்கு அனுப்பலாம். மேலும் விவரங்களுக்கு இந்த வலைப்பதிவைப் பாருங்கள்: [Amazon Managed Service for Prometheus-க்கான குறுக்கு-பிராந்திய மெட்ரிக்குகள் சேகரிப்பு](https://aws.amazon.com/blogs/opensource/set-up-cross-region-metrics-collection-for-amazon-managed-service-for-prometheus-workspaces/).

## Cost Explorer அல்லது [CloudWatch-ல் AWS பில்லிங் கட்டணங்களாக](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/gs_monitor_estimated_charges_with_cloudwatch.html) மீட்டரிங் மற்றும்/அல்லது பில்லிங் பார்க்க எவ்வளவு நேரம் ஆகும்?

உட்கொள்ளப்பட்ட மெட்ரிக் மாதிரிகளின் பிளாக்குகளை அவை ஒவ்வொரு 2 மணி நேரத்திற்கும் S3-க்கு பதிவேற்றப்பட்டவுடன் மீட்டர் செய்கிறோம். Amazon Managed Service for Prometheus-க்கான மீட்டரிங் மற்றும் கட்டணங்கள் அறிக்கையிடப்படுவதைப் பார்க்க 3 மணி நேரம் வரை ஆகலாம்.

## Prometheus Service ஒரு கிளஸ்டரிலிருந்து (EKS/ECS) மட்டுமே மெட்ரிக்குகளை ஸ்கிரேப் செய்ய முடியுமா?

பிற கம்ப்யூட் சூழல்களுக்கான ஆவணங்கள் இல்லாததற்கு மன்னிக்கவும். [EC2-யிலிருந்து Prometheus மெட்ரிக்குகளை](https://aws.amazon.com/blogs/opensource/using-amazon-managed-service-for-prometheus-to-monitor-ec2-environments/) ஸ்கிரேப் செய்ய Prometheus server-ஐ பயன்படுத்தலாம், மற்றும் நீங்கள் remote write-ஐ உள்ளமைத்து [AWS SigV4 proxy](https://github.com/awslabs/aws-sigv4-proxy)-ஐ அமைக்கும் வரை இன்று Prometheus server-ஐ நிறுவக்கூடிய வேறு எந்த கம்ப்யூட் சூழல்களிலும் பயன்படுத்தலாம். [EC2 வலைப்பதிவு](https://aws.amazon.com/blogs/opensource/using-amazon-managed-service-for-prometheus-to-monitor-ec2-environments/) இணைப்பில் "Running aws-sigv4-proxy" என்ற பிரிவு அதை எவ்வாறு இயக்குவது என்பதைக் காட்டும். பிற கம்ப்யூட் சூழல்களில் AWS SigV4-ஐ எவ்வாறு இயக்குவது என்பதை எளிமைப்படுத்த எங்கள் வாடிக்கையாளர்களுக்கு உதவ மேலும் ஆவணங்களைச் சேர்க்க வேண்டும்.

## Amazon Managed Service for Prometheus-ஐ Grafana-வுடன் எவ்வாறு இணைப்பது? ஏதேனும் ஆவணம் உள்ளதா?

PromQL பயன்படுத்தி Amazon Managed Service for Prometheus-ஐ வினவ Grafana-வில் கிடைக்கும் இயல்பான [Prometheus டேட்டா சோர்ஸை](https://grafana.com/docs/grafana/latest/datasources/prometheus/) பயன்படுத்துகிறோம். தொடங்க உதவும் சில ஆவணங்கள் மற்றும் வலைப்பதிவு:
1. [சேவை ஆவணங்கள்](https://docs.aws.amazon.com/prometheus/latest/userguide/AMP-onboard-query.html)
1. [EC2-ல் Grafana அமைப்பு](https://aws.amazon.com/blogs/opensource/setting-up-grafana-on-ec2-to-query-metrics-from-amazon-managed-service-for-prometheus/)

## Amazon Managed Service for Prometheus-க்கு அனுப்பப்படும் மாதிரிகளின் எண்ணிக்கையைக் குறைக்க சிறந்த நடைமுறைகள் என்ன?

Amazon Managed Service for Prometheus-க்கு உட்கொள்ளப்படும் மாதிரிகளின் எண்ணிக்கையைக் குறைக்க, வாடிக்கையாளர்கள் தங்கள் ஸ்கிரேப் இடைவெளியை நீட்டிக்கலாம் (எ.கா., 30s-லிருந்து 1min-க்கு மாற்றலாம்) அல்லது அவர்கள் ஸ்கிரேப் செய்யும் சீரீஸ்களின் எண்ணிக்கையைக் குறைக்கலாம். ஸ்கிரேப் இடைவெளியை மாற்றுவது சீரீஸ்களின் எண்ணிக்கையைக் குறைப்பதை விட மாதிரிகளின் எண்ணிக்கையில் மிகவும் பெரிய தாக்கத்தை ஏற்படுத்தும், ஸ்கிரேப் இடைவெளியை இரட்டிப்பாக்குவது உட்கொள்ளப்படும் மாதிரிகளின் அளவை பாதியாகக் குறைக்கும்.

## CloudWatch மெட்ரிக்குகளை Amazon Managed Service for Prometheus-க்கு எவ்வாறு அனுப்புவது?

CloudWatch மெட்ரிக்குகளை Amazon Managed Service for Prometheus-க்கு அனுப்ப [CloudWatch metric streams-ஐ பயன்படுத்துவதை](https://aws-observability.github.io/observability-best-practices/recipes/recipes/lambda-cw-metrics-go-amp/) பரிந்துரைக்கிறோம். இந்த ஒருங்கிணைப்பின் சில குறைபாடுகள்:
1. Amazon Managed Service for Prometheus APIs-ஐ அழைக்க Lambda function தேவை,
1. CloudWatch மெட்ரிக்குகளை Amazon Managed Service for Prometheus-க்கு உட்கொள்வதற்கு முன் மெட்டாடேட்டாவுடன் (எ.கா., AWS tags-உடன்) செறிவூட்ட இயலாமை,
1. மெட்ரிக்குகளை namespace மூலம் மட்டுமே வடிகட்ட முடியும் (போதுமான நுண்ணிய அளவில் இல்லை). மாற்றாக, வாடிக்கையாளர்கள் CloudWatch மெட்ரிக்குகள் தரவை Amazon Managed Service for Prometheus-க்கு அனுப்ப Prometheus Exporters-ஐ பயன்படுத்தலாம்: (1) CloudWatch Exporter: CW ListMetrics மற்றும் GetMetricStatistics (GMS) APIs பயன்படுத்தும் Java அடிப்படையிலான ஸ்கிரேப்பிங்.

[**Yet Another CloudWatch Exporter (YACE)**](https://github.com/nerdswords/yet-another-cloudwatch-exporter) CloudWatch-லிருந்து Amazon Managed Service for Prometheus-க்கு மெட்ரிக்குகளைப் பெற மற்றொரு விருப்பம். இது CW ListMetrics, GetMetricData (GMD), மற்றும் GetMetricStatistics (GMS) APIs பயன்படுத்தும் Go அடிப்படையிலான கருவி. இதைப் பயன்படுத்துவதில் சில குறைகள் என்னவென்றால், நீங்கள் ஏஜெண்டை டிப்ளாய் செய்ய வேண்டும் மற்றும் லைஃப்-சைக்கிளை நீங்களே நிர்வகிக்க வேண்டும், இது சிந்தனையுடன் செய்யப்பட வேண்டும்.

## Amazon Managed Service for Prometheus எந்த Prometheus பதிப்புடன் இணக்கமானது?

Amazon Managed Service for Prometheus [Prometheus 2.x](https://github.com/prometheus/prometheus/blob/main/RELEASE.md)-உடன் இணக்கமானது. Amazon Managed Service for Prometheus திறந்த மூல [CNCF Cortex திட்டத்தை](https://cortexmetrics.io/) அதன் டேட்டா பிளேனாக அடிப்படையாகக் கொண்டது. Cortex Prometheus-உடன் 100% API இணக்கமாக இருக்க முயற்சிக்கிறது (/prometheus/* மற்றும் /api/prom/* கீழ்). Amazon Managed Service for Prometheus Prometheus-இணக்கமான PromQL வினவல்கள் மற்றும் Remote write மெட்ரிக் உட்கொள்ளல் மற்றும் Gauge, Counters, Summary, மற்றும் Histogram உள்ளிட்ட தற்போதைய மெட்ரிக் வகைகளுக்கான Prometheus தரவு மாதிரியை ஆதரிக்கிறது. தற்போது [அனைத்து Cortex APIs](https://cortexmetrics.io/docs/api/)-ஐயும் வெளிப்படுத்தவில்லை. நாங்கள் ஆதரிக்கும் இணக்கமான APIs-ன் பட்டியலை [இங்கே காணலாம்](https://docs.aws.amazon.com/prometheus/latest/userguide/AMP-APIReference.html). Amazon Managed Service for Prometheus-லிருந்து தேவையான ஏதேனும் அம்சங்கள் இல்லையென்றால், வாடிக்கையாளர்கள் புதிய Product Features Requests (PFRs)-ஐ திறக்க அல்லது தற்போதுள்ளவற்றை பாதிக்க தங்கள் கணக்கு குழுவுடன் பணியாற்றலாம்.

## Amazon Managed Service for Prometheus-க்கு மெட்ரிக்குகளை உட்கொள்ள எந்த கலெக்டரை பரிந்துரைக்கிறீர்கள்? Prometheus-ஐ Agent mode-ல் பயன்படுத்த வேண்டுமா?

Agent mode உட்பட Prometheus servers, OpenTelemetry agent, மற்றும் AWS Distro for OpenTelemetry agent ஆகியவற்றை Amazon Managed Service for Prometheus-க்கு மெட்ரிக்குகள் தரவை அனுப்ப வாடிக்கையாளர்கள் பயன்படுத்தக்கூடிய ஏஜெண்ட்களாக ஆதரிக்கிறோம். AWS Distro for OpenTelemetry என்பது AWS ஆல் பேக்கேஜ் செய்யப்பட்டு பாதுகாக்கப்பட்ட OpenTelemetry திட்டத்தின் downstream distribution ஆகும். மூன்றில் எதுவும் சரியாக இருக்கும், உங்கள் தனிப்பட்ட குழுவின் தேவைகள் மற்றும் விருப்பங்களுக்கு மிகவும் பொருத்தமானதை நீங்கள் தேர்வு செய்யலாம்.

## Amazon Managed Service for Prometheus-ன் செயல்திறன் ஒரு வொர்க்ஸ்பேஸின் அளவுடன் எவ்வாறு அளவிடப்படுகிறது?

தற்போது, Amazon Managed Service for Prometheus ஒரு வொர்க்ஸ்பேஸில் 200M செயலில் உள்ள நேர வரிசைகள் வரை ஆதரிக்கிறது. புதிய அதிகபட்ச வரம்பை அறிவிக்கும்போது, உட்கொள்ளல் மற்றும் வினவல் முழுவதும் சேவையின் செயல்திறன் மற்றும் நம்பகத்தன்மை பண்புகள் தொடர்ந்து பராமரிக்கப்படுவதை உறுதிசெய்கிறோம். ஒரே அளவிலான டேட்டாசெட் முழுவதும் வினவல்கள் ஒரு வொர்க்ஸ்பேஸில் உள்ள செயலில் உள்ள சீரீஸ்களின் எண்ணிக்கையைப் பொருட்படுத்தாமல் செயல்திறன் சரிவைக் காணக்கூடாது.

**தயாரிப்பு FAQ:** [https://aws.amazon.com/prometheus/faqs/](https://aws.amazon.com/prometheus/faqs/)

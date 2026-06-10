# AWS Distro for Open Telemetry (ADOT) - அடிக்கடி கேட்கப்படும் கேள்விகள்

## AMP-க்கு மெட்ரிக்குகளை உட்கொள்ள ADOT collector-ஐ பயன்படுத்த முடியுமா?

ஆம், இந்த செயல்பாடு 2022 மே மாதத்தில் மெட்ரிக்குகள் ஆதரவுக்கான GA வெளியீட்டுடன் அறிமுகப்படுத்தப்பட்டது, மேலும் EC2-லிருந்து, எங்கள் EKS add-on வழியாக, எங்கள் ECS side-car ஒருங்கிணைப்பு வழியாக, மற்றும்/அல்லது எங்கள் Lambda layers வழியாக ADOT collector-ஐ பயன்படுத்தலாம்.

## லாக்குகளை சேகரித்து Amazon CloudWatch அல்லது Amazon OpenSearch-க்கு உட்கொள்ள ADOT collector-ஐ பயன்படுத்த முடியுமா?

ஆம். [லாக் ஆதரவு](https://aws.amazon.com/about-aws/whats-new/2023/11/logs-support-aws-distro-opentelemetry/) நவம்பர் 22, 2023 முதல் கிடைக்கிறது. மேலும் விவரங்களுக்கு [Logging Exporter](https://aws-otel.github.io/docs/components/misc-exporters) பக்கத்தைப் பார்க்கலாம்.

## ADOT collector-ன் வள பயன்பாடு மற்றும் செயல்திறன் விவரங்களை எங்கே காணலாம்?

கலெக்டர்களை வெளியிடும்போது புதுப்பிக்கப்படும் [செயல்திறன் அறிக்கை](https://aws-observability.github.io/aws-otel-collector/benchmark/report) ஆன்லைனில் உள்ளது.

## Apache Kafka-வுடன் ADOT-ஐ பயன்படுத்த முடியுமா?

ஆம், Kafka exporter மற்றும் receiver ஆதரவு ADOT collector v0.28.0-ல் சேர்க்கப்பட்டது. மேலும் விவரங்களுக்கு, [ADOT collector ஆவணத்தைப்](https://aws-otel.github.io/docs/components/kafka-receiver-exporter) பார்க்கவும்.

## ADOT collector-ஐ எவ்வாறு உள்ளமைப்பது?

ADOT collector உள்ளூரில் சேமிக்கப்பட்ட YAML உள்ளமைவு கோப்புகளைப் பயன்படுத்தி உள்ளமைக்கப்படுகிறது. அதைத் தவிர, S3 buckets போன்ற பிற இடங்களில் சேமிக்கப்பட்ட உள்ளமைவைப் பயன்படுத்தவும் முடியும். ADOT collector-ஐ உள்ளமைக்க ஆதரிக்கப்படும் அனைத்து வழிமுறைகளும் [ADOT collector ஆவணத்தில்](https://aws-otel.github.io/docs/components/confmap-providers) விரிவாக விவரிக்கப்பட்டுள்ளன.

## ADOT collector-ல் மேம்பட்ட சாம்ப்ளிங் செய்ய முடியுமா?

ஆம். [மேம்பட்ட சாம்ப்ளிங்](https://aws.amazon.com/about-aws/whats-new/2023/05/aws-distro-opentelemetry-advanced-sampling/) மே 15, 2023 அன்று வெளியிடப்பட்டது. மேலும் விவரங்களுக்கு [AWS Distro for OpenTelemetry-உடன் மேம்பட்ட சாம்ப்ளிங் தொடங்குதல்](https://aws-otel.github.io/docs/getting-started/advanced-sampling) பக்கத்தைப் பார்க்கவும்.

## ADOT collector-ஐ அளவிட ஏதேனும் குறிப்புகள் உள்ளனவா?

ஆம்! [Collector-ஐ அளவிடுதல்](https://opentelemetry.io/docs/collector/scaling/) பற்றிய upstream OpenTelemetry ஆவணங்களைப் பார்க்கவும்.

## எனக்கு ADOT collectors-ன் fleet உள்ளது, அவற்றை எவ்வாறு நிர்வகிப்பது?

இது செயலில் உள்ள மேம்பாட்டுப் பகுதி, 2023-ல் இது முதிர்ச்சியடையும் என்று எதிர்பார்க்கிறோம், மேலும் விவரங்களுக்கு [நிர்வாகம்](https://opentelemetry.io/docs/collector/management/) பற்றிய upstream OpenTelemetry ஆவணங்களைப் பார்க்கவும், குறிப்பாக [Open Agent Management Protocol (OpAMP)](https://opentelemetry.io/docs/collector/management/#opamp) பற்றி.

## ADOT collector-ன் ஆரோக்கியம் மற்றும் செயல்திறனை எவ்வாறு கண்காணிப்பது?

1. [Collector-ஐ கண்காணித்தல்](https://github.com/open-telemetry/opentelemetry-collector/blob/main/docs/observability.md) - Prometheus receiver ஆல் ஸ்கிரேப் செய்யக்கூடிய போர்ட் 8080-ல் வெளிப்படுத்தப்படும் இயல்பான மெட்ரிக்குகள்
2. [Node Exporter](https://prometheus.io/docs/guides/node-exporter/) பயன்படுத்தி, node exporter இயக்குவது collector இயங்கும் நோடு, பாட் மற்றும் ஆப்பரேட்டிங் சிஸ்டம் பற்றிய பல செயல்திறன் மற்றும் ஆரோக்கிய மெட்ரிக்குகளை வழங்கும்.
3. [Kube-state-metrics (KSM)](https://github.com/kubernetes/kube-state-metrics), KSM collector பற்றிய சுவாரஸ்யமான நிகழ்வுகளையும் உருவாக்க முடியும்.
4. [Prometheus `up` metric](https://github.com/open-telemetry/opentelemetry-collector/pull/2918)
5. தொடங்க ஒரு எளிய Grafana டாஷ்போர்டு: [https://grafana.com/grafana/dashboards/12553](https://grafana.com/grafana/dashboards/12553)

**தயாரிப்பு FAQ:** [https://aws.amazon.com/otel/faqs/](https://aws.amazon.com/otel/faqs/)

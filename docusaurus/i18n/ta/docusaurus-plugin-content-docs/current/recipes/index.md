# செய்முறைகள்

இங்கே நீங்கள் பல்வேறு பயன்பாட்டு நிகழ்வுகளுக்கு observability (o11y) பயன்படுத்துவதற்கு உதவும் தொகுக்கப்பட்ட வழிகாட்டுதல், எப்படி-செய்வது குறிப்புகள் மற்றும் பிற வளங்களுக்கான இணைப்புகளைக் காணலாம். இதில் [Amazon Managed Service for Prometheus][amp] மற்றும் [Amazon Managed Grafana][amg] போன்ற நிர்வகிக்கப்படும் சேவைகள் மற்றும் [OpenTelemetry][otel] மற்றும் [Fluent Bit][fluentbit] போன்ற ஏஜெண்ட்கள் அடங்கும். இங்குள்ள உள்ளடக்கம் AWS கருவிகளுக்கு மட்டும் கட்டுப்படுத்தப்படவில்லை, பல திறந்த மூல திட்டங்களும் இங்கு குறிப்பிடப்பட்டுள்ளன.

டெவலப்பர்கள் மற்றும் உள்கட்டமைப்பு நிபுணர்கள் இருவரின் தேவைகளையும் சமமாக நிவர்த்தி செய்ய விரும்புகிறோம், எனவே பல செய்முறைகள் "பரந்த வலையை வீசுகின்றன". நீங்கள் ஆராய்ந்து, நீங்கள் சாதிக்க விரும்புவதற்கு மிகவும் பொருத்தமான தீர்வுகளைக் கண்டறிய உங்களை ஊக்குவிக்கிறோம்.

:::info
    இங்குள்ள உள்ளடக்கம் எங்கள் Solutions Architects, Professional Services மற்றும் பிற வாடிக்கையாளர்களின் பின்னூட்டத்தின் மூலம் உண்மையான வாடிக்கையாளர் ஈடுபாட்டிலிருந்து பெறப்பட்டது. இங்கு நீங்கள் காண்பது அனைத்தும் எங்கள் உண்மையான வாடிக்கையாளர்களால் அவர்களது சொந்த சூழல்களில் செயல்படுத்தப்பட்டவை.
:::

நாம் o11y இடத்தைப் பற்றி சிந்திக்கும் வழி பின்வருமாறு: ஒரு குறிப்பிட்ட தீர்வை அடைய நீங்கள் இணைக்கக்கூடிய [ஆறு பரிமாணங்களாக][dimensions] நாம் அதை பிரிக்கிறோம்:

| பரிமாணம் | எடுத்துக்காட்டுகள் |
|---------------|--------------|
| இலக்குகள்  | [Prometheus][amp] &middot; [Grafana][amg] &middot; [OpenSearch][aes] &middot; [CloudWatch][cw] &middot; [Jaeger][jaeger] |
| ஏஜெண்ட்கள்        | [ADOT][adot] &middot; [Fluent Bit][fluentbit] &middot; CW agent &middot; X-Ray agent |
| மொழிகள்     | [Java][java] &middot; Python &middot; .NET &middot; [JavaScript][nodejs] &middot; Go &middot; Rust |
| உள்கட்டமைப்பு & தரவுத்தளங்கள்  |  [RDS][rds] &middot; [DynamoDB][dynamodb] &middot; [MSK][msk] |
| கம்ப்யூட் யூனிட் | [Batch][batch] &middot; [ECS][ecs] &middot; [EKS][eks] &middot; [AEB][beans] &middot; [Lambda][lambda] &middot; [AppRunner][apprunner] |
| கம்ப்யூட் எஞ்சின் | [Fargate][fargate] &middot; [EC2][ec2] &middot; [Lightsail][lightsail] |

:::note
    "எடுத்துக்காட்டு தீர்வு தேவை"
    Fargate-இல் EKS-இல் இயங்கும் Python ஆப்ஸுக்கான ஒரு லாக்கிங் தீர்வு எனக்கு தேவை, மேலும் லாக்குகளை மேலும் பயன்படுத்துவதற்காக S3 bucket-இல் சேமிக்க வேண்டும்
:::

இந்த தேவைக்கு பொருந்தக்கூடிய ஒரு தொகுப்பு பின்வருமாறு:

1. *இலக்கு*: தரவை மேலும் பயன்படுத்துவதற்கான S3 bucket
1. *ஏஜெண்ட்*: EKS-இலிருந்து லாக் தரவை வெளியிட FluentBit
1. *மொழி*: Python
1. *உள்கட்டமைப்பு & DB*: பொருந்தாது
1. *கம்ப்யூட் யூனிட்*: Kubernetes (EKS)
1. *கம்ப்யூட் எஞ்சின்*: EC2

ஒவ்வொரு பரிமாணமும் குறிப்பிடப்பட வேண்டிய அவசியமில்லை, சில நேரங்களில் எங்கு தொடங்குவது என்று முடிவு செய்வது கடினம். வெவ்வேறு பாதைகளை முயற்சித்து சில செய்முறைகளின் நன்மை தீமைகளை ஒப்பிடுங்கள்.

வழிசெலுத்தலை எளிதாக்க, ஆறு பரிமாணங்களை பின்வரும் வகைகளாக தொகுக்கிறோம்:

- **கம்ப்யூட் வாரியாக**: கம்ப்யூட் எஞ்சின்கள் மற்றும் யூனிட்களை உள்ளடக்கியது
- **உள்கட்டமைப்பு & தரவு வாரியாக**: உள்கட்டமைப்பு மற்றும் தரவுத்தளங்களை உள்ளடக்கியது
- **மொழி வாரியாக**: மொழிகளை உள்ளடக்கியது
- **இலக்கு வாரியாக**: டெலிமெட்ரி மற்றும் அனலிட்டிக்ஸை உள்ளடக்கியது
- **பணிகள்**: anomaly detection, எச்சரிக்கை, சரிசெய்தல் மற்றும் பலவற்றை உள்ளடக்கியது

[பரிமாணங்களைப் பற்றி மேலும் அறிக ...](https://aws-observability.github.io/observability-best-practices/recipes/dimensions/)

## பயன்படுத்தும் முறை

மேல் வழிசெலுத்தல் மெனுவை பயன்படுத்தி ஒரு குறிப்பிட்ட அட்டவணை பக்கத்திற்கு செல்லலாம், ஒரு தோராயமான தேர்வுடன் தொடங்கி. எடுத்துக்காட்டாக, `கம்ப்யூட் வாரியாக` -> `EKS` -> `Fargate` -> `லாக்குகள்`.

மாற்றாக, `/` அல்லது `s` விசையை அழுத்தி தளத்தை தேடலாம்:

![o11y இடம்](images/search.png)

:::info
   "உரிமம்"
  இந்த தளத்தில் வெளியிடப்பட்ட அனைத்து செய்முறைகளும் [MIT-0][mit0] உரிமத்தின் கீழ் கிடைக்கின்றன, இது வழக்கமான MIT உரிமத்தின் ஒரு மாற்றம் ஆகும், இது பண்புகூறல் தேவையை நீக்குகிறது.
:::

## எவ்வாறு பங்களிப்பது

நீங்கள் என்ன செய்ய திட்டமிடுகிறீர்கள் என்பதை பற்றி ஒரு [கலந்துரையாடலை][discussion] தொடங்குங்கள், நாங்கள் அங்கிருந்து தொடர்வோம்.

## மேலும் அறிக

இந்த தளத்தில் உள்ள செய்முறைகள் சிறந்த நடைமுறைகள் தொகுப்பாகும். கூடுதலாக, செய்முறைகளில் நாம் பயன்படுத்தும் திறந்த மூல திட்டங்களின் நிலை மற்றும் நிர்வகிக்கப்படும் சேவைகளைப் பற்றி மேலும் அறியக்கூடிய பல இடங்கள் உள்ளன, எனவே பாருங்கள்:

- [observability @ aws][o11yataws], AWS நிபுணர்கள் தங்கள் திட்டங்கள் மற்றும் சேவைகளைப் பற்றி பேசும் ஒரு பிளேலிஸ்ட்.
- [AWS observability workshops](https://aws-observability.github.io/observability-best-practices/recipes/workshops/), சலுகைகளை ஒரு கட்டமைக்கப்பட்ட முறையில் முயற்சிக்க.
- வழக்கு ஆய்வுகள் மற்றும் பங்காளிகளுக்கான சுட்டிகளுடன் [AWS monitoring and observability][o11yhome] முகப்புப்பக்கம்.

[aes]: aes.md "Amazon Elasticsearch Service"
[adot]: https://aws-otel.github.io/ "AWS Distro for OpenTelemetry"
[amg]: amg.md "Amazon Managed Grafana"
[amp]: amp.md "Amazon Managed Service for Prometheus"
[batch]: https://aws.amazon.com/batch/ "AWS Batch"
[beans]: https://aws.amazon.com/elasticbeanstalk/ "AWS Elastic Beanstalk"
[cw]: cw.md "Amazon CloudWatch"
[dimensions]: dimensions.md
[dynamodb]: dynamodb.md "Amazon DynamoDB"
[ec2]: https://aws.amazon.com/ec2/ "Amazon EC2"
[ecs]: ecs.md "Amazon Elastic Container Service"
[eks]: eks.md "Amazon Elastic Kubernetes Service"
[fargate]: https://aws.amazon.com/fargate/ "AWS Fargate"
[fluentbit]: https://fluentbit.io/ "Fluent Bit"
[jaeger]: https://www.jaegertracing.io/ "Jaeger"
[kafka]: https://kafka.apache.org/ "Apache Kafka"
[apprunner]: apprunner.md "AWS App Runner"
[lambda]: lambda.md "AWS Lambda"
[lightsail]: https://aws.amazon.com/lightsail/ "Amazon Lightsail"
[otel]: https://opentelemetry.io/ "OpenTelemetry"
[java]: java.md
[nodejs]: nodejs.md
[rds]: rds.md "Amazon Relational Database Service"
[msk]: msk.md "Amazon Managed Streaming for Apache Kafka"
[mit0]: https://github.com/aws/mit-0 "MIT-0"
[discussion]: https://github.com/aws-observability/observability-best-practices/discussions "Discussions"
[o11yataws]: https://www.youtube.com/playlist?list=PLaiiCkpc1U7Wy7XwkpfgyOhIf_06IK3U_ "Observability @ AWS YouTube playlist"
[o11yhome]: https://aws.amazon.com/products/management-and-governance/use-cases/monitoring-and-observability/ "AWS Observability home"

# பரிமாணங்கள்

இந்த தளத்தின் சூழலில் நாம் o11y இடத்தை ஆறு பரிமாணங்களில் கருதுகிறோம். ஒவ்வொரு பரிமாணத்தையும் சுயாதீனமாக பார்ப்பது ஒருங்கிணைப்புக் கோணத்தில் பயனுள்ளதாக இருக்கும், அதாவது, நீங்கள் ஒரு குறிப்பிட்ட பணிச்சுமைக்கான ஒரு உறுதியான o11y தீர்வை உருவாக்க முயற்சிக்கும்போது, பயன்படுத்தப்படும் நிரலாக்க மொழி போன்ற டெவலப்பர் தொடர்பான அம்சங்கள் மற்றும் கண்டெய்னர்கள் அல்லது Lambda செயல்பாடுகள் போன்ற இயக்க நேர சூழல் போன்ற செயல்பாட்டு தலைப்புகளை உள்ளடக்கியது.

![o11y இடம்](images/o11y-space.png)


:::note
    "சிக்னல் என்றால் என்ன?"
    நாம் இங்கு சிக்னல் என்று சொல்லும்போது, லாக் உள்ளீடுகள், மெட்ரிக்குகள் மற்றும் ட்ரேஸ்கள் உட்பட எந்த வகையான o11y தரவு மற்றும் மெட்டாடேட்டா புள்ளிகளையும் குறிக்கிறோம். நாம் மேலும் குறிப்பிட்டதாக இருக்க விரும்பாத அல்லது தேவையில்லாத வரை, "சிக்னல்" என்று பயன்படுத்துகிறோம் மற்றும் சூழலிலிருந்து என்ன கட்டுப்பாடுகள் பொருந்தும் என்பது தெளிவாக இருக்க வேண்டும்.
:::

இப்போது ஆறு பரிமாணங்களில் ஒவ்வொன்றையும் தனித்தனியாக பார்ப்போம்:

## இலக்குகள்

இந்த பரிமாணத்தில் நீண்ட கால சேமிப்பு மற்றும் சிக்னல்களை நுகர அனுமதிக்கும் வரைகலை இடைமுகங்கள் உட்பட அனைத்து வகையான சிக்னல் இலக்குகளையும் கருதுகிறோம். ஒரு டெவலப்பராக, உங்கள் சேவையை சரிசெய்ய சிக்னல்களைக் கண்டறிய, தேட மற்றும் தொடர்புபடுத்த அனுமதிக்கும் ஒரு UI அல்லது API-க்கான அணுகல் உங்களுக்கு தேவை. உள்கட்டமைப்பு அல்லது தளம் பாத்திரத்தில் உள்கட்டமைப்பின் நிலையைப் புரிந்துகொள்ள சிக்னல்களை நிர்வகிக்க, கண்டறிய, தேட மற்றும் தொடர்புபடுத்த அனுமதிக்கும் ஒரு UI அல்லது API-க்கான அணுகல் உங்களுக்கு தேவை.

![Grafana திரைப்பிடிப்பு](images/grafana.png)

இறுதியில், மனித கோணத்தில் இது மிகவும் சுவாரஸ்யமான பரிமாணம். இருப்பினும், பலன்களை அறுவடை செய்ய முதலில் நாம் சிறிது வேலை முதலீடு செய்ய வேண்டும்: நாம் நமது மென்பொருளையும் வெளிப்புற சார்புகளையும் இன்ஸ்ட்ரூமென்ட் செய்து சிக்னல்களை இலக்குகளில் உள்ளிட வேண்டும்.

எனவே, சிக்னல்கள் இலக்குகளில் எவ்வாறு வருகின்றன? நல்ல கேள்வி, அது...

## ஏஜெண்ட்கள்

சிக்னல்கள் எவ்வாறு சேகரிக்கப்பட்டு அனலிட்டிக்ஸ்-க்கு அனுப்பப்படுகின்றன. சிக்னல்கள் இரண்டு ஆதாரங்களிலிருந்து வரலாம்: உங்கள் பயன்பாட்டு மூல குறியீட்டிலிருந்து (மொழி பிரிவையும் பாருங்கள்) அல்லது உங்கள் பயன்பாடு சார்ந்துள்ள பொருட்களிலிருந்து, தரவுக்கிடங்குகளில் நிர்வகிக்கப்படும் நிலை மற்றும் VPCகள் போன்ற உள்கட்டமைப்பு (உள்கட்டமைப்பு & தரவு பிரிவையும் பாருங்கள்).

ஏஜெண்ட்கள் சிக்னல்களை சேகரித்து உள்ளிட நீங்கள் பயன்படுத்தும் டெலிமெட்ரியின் ஒரு பகுதியாகும். மற்ற பகுதி இன்ஸ்ட்ரூமென்ட் செய்யப்பட்ட பயன்பாடுகள் மற்றும் தரவுத்தளங்கள் போன்ற உள்கட்டமைப்பு துண்டுகள் ஆகும்.

## மொழிகள்

இந்த பரிமாணம் உங்கள் சேவை அல்லது பயன்பாட்டை எழுத நீங்கள் பயன்படுத்தும் நிரலாக்க மொழியை பற்றியது. இங்கு, [X-Ray SDKகள்][xraysdks] அல்லது [இன்ஸ்ட்ரூமென்டேஷன்][otelinst] சூழலில் OpenTelemetry வழங்குவது போன்ற SDKகள் மற்றும் நூலகங்களை கையாளுகிறோம். லாக்குகள் அல்லது மெட்ரிக்குகள் போன்ற ஒரு குறிப்பிட்ட சிக்னல் வகைக்கு உங்கள் விருப்பமான நிரலாக்க மொழியை ஒரு o11y தீர்வு ஆதரிக்கிறது என்பதை உறுதிப்படுத்திக் கொள்ள வேண்டும்.

## உள்கட்டமைப்பு & தரவுத்தளங்கள்

இந்த பரிமாணத்தில் நாம் சேவை இயங்கும் VPC போன்ற உள்கட்டமைப்பு அல்லது RDS அல்லது DynamoDB போன்ற தரவுக்கிடங்கு அல்லது SQS போன்ற க்யூ போன்ற எந்த வகையான பயன்பாட்டு-வெளிப்புற சார்புகளையும் குறிக்கிறோம்.

:::tip
    "பொதுவான அம்சங்கள்"
    இந்த பரிமாணத்தில் உள்ள அனைத்து ஆதாரங்களுக்கும் பொதுவான ஒரு விஷயம் என்னவென்றால், அவை உங்கள் பயன்பாட்டிற்கு வெளியே (உங்கள் ஆப்ஸ் இயங்கும் கம்ப்யூட் சூழலுக்கும் வெளியே) அமைந்துள்ளன, அதனால் அவற்றை ஒரு ஒளிபுகா பெட்டியாக கருத வேண்டும்.
:::

இந்த பரிமாணம் உள்ளடக்கியது ஆனால் இவற்றுக்கு மட்டுப்படுத்தப்படவில்லை:

- AWS உள்கட்டமைப்பு, எடுத்துக்காட்டாக [VPC flow logs][vpcfl].
- [Kubernetes கட்டுப்பாட்டு தளம் லாக்குகள்][kubecpl] போன்ற இரண்டாம் நிலை APIகள்.
- [S3][s3mon], [RDS][rdsmon] அல்லது [SQS][sqstrace] போன்ற தரவுக்கிடங்குகளிலிருந்து வரும் சிக்னல்கள்.


## கம்ப்யூட் யூனிட்

உங்கள் குறியீட்டை பேக்கேஜ் செய்யும், திட்டமிடும் மற்றும் இயக்கும் வழி. எடுத்துக்காட்டாக, Lambda-வில் அது ஒரு செயல்பாடு மற்றும் [ECS][ecs] மற்றும் [EKS][eks]-இல் அந்த யூனிட் முறையே tasks (ECS) அல்லது pods (EKS)-இல் இயங்கும் ஒரு கண்டெய்னர் ஆகும். Kubernetes போன்ற கண்டெய்னர்மயமான சூழல்கள் பெரும்பாலும் டெலிமெட்ரி டிப்ளாய்மென்ட்களுக்கு இரண்டு விருப்பங்களை அனுமதிக்கின்றன: side cars ஆக அல்லது நோடு-க்கு (instance) daemon செயல்முறைகளாக.

## கம்ப்யூட் எஞ்சின்

இந்த பரிமாணம் அடிப்படை இயக்க நேர சூழலைக் குறிக்கிறது, இது உங்கள் பொறுப்பாக இருக்கலாம் (EC2 instance போன்ற சந்தர்ப்பத்தில்) அல்லது இருக்காமல் போகலாம் (Fargate அல்லது Lambda போன்ற சர்வர்லெஸ் சலுகைகள்) வழங்க மற்றும் இணைக்க. நீங்கள் பயன்படுத்தும் கம்ப்யூட் எஞ்சினைப் பொறுத்து, டெலிமெட்ரி பகுதி ஏற்கனவே சலுகையின் ஒரு பகுதியாக இருக்கலாம், எடுத்துக்காட்டாக, [Fargate-இல் EKS][firelensef] Fluent Bit வழியாக லாக் ரூட்டிங் ஒருங்கிணைக்கப்பட்டுள்ளது.


[aes]: https://aws.amazon.com/elasticsearch-service/ "Amazon Elasticsearch Service"
[adot]: https://aws-otel.github.io/ "AWS Distro for OpenTelemetry"
[amg]: https://aws.amazon.com/grafana/ "Amazon Managed Grafana"
[amp]: https://aws.amazon.com/prometheus/ "Amazon Managed Service for Prometheus"
[batch]: https://aws.amazon.com/batch/ "AWS Batch"
[beans]: https://aws.amazon.com/elasticbeanstalk/ "AWS Elastic Beanstalk"
[cw]: https://aws.amazon.com/cloudwatch/ "Amazon CloudWatch"
[dimensions]: ../dimensions
[ec2]: https://aws.amazon.com/ec2/ "Amazon EC2"
[ecs]: https://aws.amazon.com/ecs/ "Amazon Elastic Container Service"
[eks]: https://aws.amazon.com/eks/ "Amazon Elastic Kubernetes Service"
[fargate]: https://aws.amazon.com/fargate/ "AWS Fargate"
[fluentbit]: https://fluentbit.io/ "Fluent Bit"
[firelensef]: https://aws.amazon.com/blogs/containers/fluent-bit-for-amazon-eks-on-aws-fargate-is-here/ "Fluent Bit for Amazon EKS on AWS Fargate is here"
[jaeger]: https://www.jaegertracing.io/ "Jaeger"
[kafka]: https://kafka.apache.org/ "Apache Kafka"
[kubecpl]: https://docs.aws.amazon.com/eks/latest/userguide/control-plane-logs.html "Amazon EKS control plane logging"
[lambda]: https://aws.amazon.com/lambda/ "AWS Lambda"
[lightsail]: https://aws.amazon.com/lightsail/ "Amazon Lightsail"
[otel]: https://opentelemetry.io/ "OpenTelemetry"
[otelinst]: https://opentelemetry.io/docs/concepts/instrumenting/
[promex]: https://prometheus.io/docs/instrumenting/exporters/ "Prometheus exporters and integrations"
[rdsmon]: https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/Overview.LoggingAndMonitoring.html "Logging and monitoring in Amazon RDS"
[s3]: https://aws.amazon.com/s3/ "Amazon S3"
[s3mon]: https://docs.aws.amazon.com/AmazonS3/latest/userguide/s3-incident-response.html "Logging and monitoring in Amazon S3"
[sqstrace]: https://docs.aws.amazon.com/xray/latest/devguide/xray-services-sqs.html "Amazon SQS and AWS X-Ray"
[vpcfl]: https://docs.aws.amazon.com/vpc/latest/userguide/flow-logs.html "VPC Flow Logs"
[xray]: https://aws.amazon.com/xray/ "AWS X-Ray"
[xraysdks]: https://docs.aws.amazon.com/xray/index.html

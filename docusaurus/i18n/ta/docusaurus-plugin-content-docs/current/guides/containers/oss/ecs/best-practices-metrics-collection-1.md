# AWS Distro for OpenTelemetry பயன்படுத்தி ECS கிளஸ்டரில் சிஸ்டம் மெட்ரிக்குகளை சேகரித்தல்
[AWS Distro for OpenTelemetry](https://aws-otel.github.io/docs/introduction) (ADOT) என்பது [OpenTelemetry](https://opentelemetry.io/) திட்டத்தின் பாதுகாப்பான, AWS-ஆதரிக்கும் விநியோகமாகும். ADOT பயன்படுத்தி, நீங்கள் பல மூலங்களிலிருந்து telemetry தரவை சேகரித்து, தொடர்புடைய மெட்ரிக்குகள், ட்ரேஸ்கள் மற்றும் லாக்குகளை பல monitoring தீர்வுகளுக்கு அனுப்பலாம். ADOT-ஐ Amazon ECS கிளஸ்டரில் இரண்டு வெவ்வேறு patterns-ல் டிப்ளாய் செய்யலாம்.

## ADOT Collector-க்கான டிப்ளாய்மென்ட் patterns
1. Sidecar pattern-ல், ADOT collector கிளஸ்டரில் ஒவ்வொரு டாஸ்க்கிலும் இயங்குகிறது மற்றும் அந்த டாஸ்க்கிற்குள் உள்ள அப்ளிகேஷன் கண்டெய்னர்களிலிருந்து மட்டுமே சேகரிக்கப்பட்ட telemetry தரவை செயலாக்குகிறது. Amazon ECS [Task Metadata Endpoint](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/task-metadata-endpoint.html)-லிருந்து task metadata-ஐ படிக்கவும், அவற்றிலிருந்து resource usage மெட்ரிக்குகளை (CPU, memory, network மற்றும் disk போன்றவை) உருவாக்கவும் collector தேவைப்படும்போது மட்டுமே இந்த டிப்ளாய்மென்ட் pattern தேவை.
![ADOT architecture](../../../../images/ADOT-sidecar.png)

2. மையப்படுத்தப்பட்ட collector pattern-ல், ADOT collector-இன் ஒரு instance கிளஸ்டரில் டிப்ளாய் செய்யப்பட்டு, கிளஸ்டரில் இயங்கும் அனைத்து டாஸ்க்குகளிலிருந்தும் telemetry தரவை செயலாக்குகிறது. இது மிகவும் பொதுவாக பயன்படுத்தப்படும் டிப்ளாய்மென்ட் pattern. Collector REPLICA அல்லது DAEMON சர்வீஸ் scheduler strategy பயன்படுத்தி டிப்ளாய் செய்யப்படுகிறது.
![ADOT architecture](../../../../images/ADOT-central.png)

ADOT collector architecture-ல் pipeline என்ற கருத்து உள்ளது. ஒரு collector ஒன்றுக்கு மேற்பட்ட pipelines-ஐ கொண்டிருக்கலாம். ஒவ்வொரு pipeline-ம் மூன்று வகையான telemetry தரவுகளில் ஒன்றை செயலாக்க அர்ப்பணிக்கப்பட்டுள்ளது, அதாவது, மெட்ரிக்குகள், ட்ரேஸ்கள் மற்றும் லாக்குகள். ஒவ்வொரு வகை telemetry தரவுக்கும் பல pipelines-ஐ கட்டமைக்கலாம். இந்த பல்துறை architecture ஒரு collector-ஐ பல observability agents-இன் பாத்திரத்தை செய்ய அனுமதிக்கிறது, இல்லையெனில் அவை கிளஸ்டரில் தனித்தனியாக டிப்ளாய் செய்யப்பட வேண்டும். இது கிளஸ்டரில் observability agents-இன் டிப்ளாய்மென்ட் footprint-ஐ கணிசமாக குறைக்கிறது. Pipeline-ஐ உருவாக்கும் collector-இன் முதன்மை கூறுகள் மூன்று வகைகளாக பிரிக்கப்பட்டுள்ளன, அதாவது, Receiver, Processor மற்றும் Exporter. Extensions எனப்படும் இரண்டாம் நிலை கூறுகள் collector-க்கு சேர்க்கக்கூடிய திறன்களை வழங்குகின்றன, ஆனால் அவை pipelines-இன் பகுதியல்ல.

:::info
    Receivers, Processors, Exporters மற்றும் Extensions பற்றிய விரிவான விளக்கத்திற்கு OpenTelemetry [ஆவணத்தைப்](https://opentelemetry.io/docs/collector/configuration/#basics) பார்க்கவும்.
:::

## ECS டாஸ்க் மெட்ரிக்குகள் சேகரிப்புக்காக ADOT Collector-ஐ டிப்ளாய் செய்தல்

ECS டாஸ்க் மட்டத்தில் resource utilization மெட்ரிக்குகளை சேகரிக்க, கீழே காட்டப்பட்டுள்ள டாஸ்க் டெஃபினிஷன் பயன்படுத்தி ADOT collector-ஐ sidecar pattern-ல் டிப்ளாய் செய்ய வேண்டும். Collector-க்கு பயன்படுத்தப்படும் கண்டெய்னர் இமேஜ் பல pipeline கட்டமைப்புகளுடன் தொகுக்கப்பட்டுள்ளது. உங்கள் தேவைகளின் அடிப்படையில் அவற்றில் ஒன்றைத் தேர்வு செய்து கண்டெய்னர் டெஃபினிஷனின் *command* பிரிவில் கட்டமைப்பு கோப்பு பாதையை குறிப்பிடலாம். இந்த மதிப்பை `--config=/etc/ecs/container-insights/otel-task-metrics-config.yaml` என அமைப்பது, collector-உடன் ஒரே டாஸ்க்கில் இயங்கும் மற்ற கண்டெய்னர்களிலிருந்து resource utilization மெட்ரிக்குகளையும் ட்ரேஸ்களையும் சேகரித்து Amazon CloudWatch மற்றும் AWS X-Ray-க்கு அனுப்பும் [pipeline கட்டமைப்பை](https://github.com/aws-observability/aws-otel-collector/blob/main/config/ecs/container-insights/otel-task-metrics-config.yaml) பயன்படுத்தும். குறிப்பாக, collector ஒரு [AWS ECS Container Metrics Receiver](https://github.com/open-telemetry/opentelemetry-collector-contrib/tree/main/receiver/awsecscontainermetricsreceiver)-ஐ பயன்படுத்துகிறது, இது [Amazon ECS Task Metadata Endpoint](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/task-metadata-endpoint-v4.html)-லிருந்து task metadata மற்றும் docker stats-ஐ படிக்கிறது, மேலும் அவற்றிலிருந்து resource usage மெட்ரிக்குகளை (CPU, memory, network மற்றும் disk போன்றவை) உருவாக்குகிறது.

```javascript
{
    "family":"AdotTask",
    "taskRoleArn":"arn:aws:iam::123456789012:role/ECS-ADOT-Task-Role",
    "executionRoleArn":"arn:aws:iam::123456789012:role/ECS-Task-Execution-Role",
    "networkMode":"awsvpc",
    "containerDefinitions":[
       {
          "name":"application-container",
          "image":"..."
       },
       {
          "name":"aws-otel-collector",
          "image":"public.ecr.aws/aws-observability/aws-otel-collector:latest",
          "cpu":512,
          "memory":1024,
          "command": [
            "--config=/etc/ecs/container-insights/otel-task-metrics-config.yaml"
          ],          
          "portMappings":[
             {
                "containerPort":2000,
                "protocol":"udp"
             }
          ],             
          "essential":true
       }
    ],
    "requiresCompatibilities":[
       "EC2"
    ],
    "cpu":"1024",
    "memory":"2048"
 }
```
:::info
    Amazon ECS கிளஸ்டரில் ADOT collector டிப்ளாய் செய்யும்போது பயன்படுத்தும் IAM task role மற்றும் task execution role அமைப்பது பற்றிய விவரங்களுக்கு [ஆவணத்தைப்](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/deploy-container-insights-ECS-adot.html) பார்க்கவும்.
:::

:::info
    [AWS ECS Container Metrics Receiver](https://github.com/open-telemetry/opentelemetry-collector-contrib/tree/main/receiver/awsecscontainermetricsreceiver) ECS Task Metadata Endpoint V4-க்கு மட்டுமே வேலை செய்யும். Platform version 1.4.0 அல்லது அதற்கு மேல் பயன்படுத்தும் Fargate-ல் இயங்கும் Amazon ECS டாஸ்க்குகள் மற்றும் Amazon ECS container agent version 1.39.0 அல்லது அதற்கு மேல் இயங்கும் Amazon EC2-ல் உள்ள Amazon ECS டாஸ்க்குகள் இந்த receiver-ஐ பயன்படுத்தலாம். மேலும் தகவலுக்கு, [Amazon ECS Container Agent Versions](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/ecs-agent-versions.html) பார்க்கவும்.
:::

இயல்பு [pipeline கட்டமைப்பில்](https://github.com/aws-observability/aws-otel-collector/blob/main/config/ecs/container-insights/otel-task-metrics-config.yaml) காணப்படுவது போல், collector-இன் pipeline முதலில் [Filter Processor](https://github.com/open-telemetry/opentelemetry-collector-contrib/tree/main/processor/filterprocessor)-ஐ பயன்படுத்துகிறது, இது CPU, memory, network மற்றும் disk usage தொடர்பான [மெட்ரிக்குகளின் துணைக்குழுவை](https://github.com/aws-observability/aws-otel-collector/blob/09d59966404c2928aaaf6920f27967a84d898254/config/ecs/container-insights/otel-task-metrics-config.yaml#L25) வடிகட்டுகிறது. பின்னர் இது [Metrics Transform Processor](https://github.com/open-telemetry/opentelemetry-collector-contrib/tree/main/processor/metricstransformprocessor)-ஐ பயன்படுத்துகிறது, இது இந்த மெட்ரிக்குகளின் பெயர்களை மாற்றவும், அவற்றின் attributes-ஐ புதுப்பிக்கவும் [மாற்றங்களின்](https://github.com/aws-observability/aws-otel-collector/blob/09d59966404c2928aaaf6920f27967a84d898254/config/ecs/container-insights/otel-task-metrics-config.yaml#L39) தொகுப்பை செய்கிறது. இறுதியாக, மெட்ரிக்குகள் [Amazon CloudWatch EMF Exporter](https://github.com/open-telemetry/opentelemetry-collector-contrib/tree/main/exporter/awsemfexporter) பயன்படுத்தி performance log events ஆக CloudWatch-க்கு அனுப்பப்படுகின்றன. இந்த இயல்பு கட்டமைப்பைப் பயன்படுத்துவது CloudWatch namespace *ECS/ContainerInsights*-ன் கீழ் பின்வரும் resource usage மெட்ரிக்குகளை சேகரிக்கும்.

- MemoryUtilized
- MemoryReserved
- CpuUtilized
- CpuReserved
- NetworkRxBytes
- NetworkTxBytes
- StorageReadBytes
- StorageWriteBytes

:::info
    இவை [Amazon ECS-க்கான Container Insights-ஆல் சேகரிக்கப்படும் அதே மெட்ரிக்குகள்](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Container-Insights-metrics-ECS.html) என்பதையும், கிளஸ்டர் அல்லது account மட்டத்தில் Container Insights-ஐ இயக்கும்போது CloudWatch-ல் எளிதாகக் கிடைக்கும் என்பதையும் கவனிக்கவும். எனவே, CloudWatch-ல் ECS resource usage மெட்ரிக்குகளை சேகரிக்க Container Insights-ஐ இயக்குவது பரிந்துரைக்கப்படும் அணுகுமுறையாகும்.
:::

AWS ECS Container Metrics Receiver Amazon ECS Task Metadata Endpoint-லிருந்து படிக்கும் 52 தனித்துவமான மெட்ரிக்குகளை வெளியிடுகிறது. Receiver-ஆல் சேகரிக்கப்படும் மெட்ரிக்குகளின் முழுமையான பட்டியல் [இங்கே ஆவணமாக்கப்பட்டுள்ளது](https://github.com/open-telemetry/opentelemetry-collector-contrib/tree/main/receiver/awsecscontainermetricsreceiver#available-metrics). நீங்கள் அவை அனைத்தையும் உங்கள் விருப்பமான இடத்திற்கு அனுப்ப விரும்பாமல் இருக்கலாம். ECS resource usage மெட்ரிக்குகள் மீது மிகவும் வெளிப்படையான கட்டுப்பாடு வேண்டுமெனில், நீங்கள் ஒரு custom pipeline கட்டமைப்பை உருவாக்கலாம், கிடைக்கும் மெட்ரிக்குகளை உங்கள் விருப்பமான processors/transformers-உடன் வடிகட்டி மாற்றி, உங்கள் விருப்பமான exporters அடிப்படையில் ஒரு இடத்திற்கு அனுப்பலாம். ECS டாஸ்க் மட்ட மெட்ரிக்குகளை capture செய்வதற்கான pipeline கட்டமைப்புகளின் [கூடுதல் எடுத்துக்காட்டுகளுக்கு](https://github.com/open-telemetry/opentelemetry-collector-contrib/tree/main/receiver/awsecscontainermetricsreceiver#full-configuration-examples) ஆவணத்தைப் பார்க்கவும்.

நீங்கள் ஒரு custom pipeline கட்டமைப்பை பயன்படுத்த விரும்பினால், கீழே காட்டப்பட்டுள்ள டாஸ்க் டெஃபினிஷன் பயன்படுத்தி collector-ஐ sidecar pattern-ல் டிப்ளாய் செய்யலாம். இங்கே, collector pipeline-இன் கட்டமைப்பு AWS SSM Parameter Store-ல் உள்ள *otel-collector-config* என்ற parameter-லிருந்து ஏற்றப்படுகிறது.

:::note
    SSM Parameter Store parameter பெயர் AOT_CONFIG_CONTENT என்ற environment variable பயன்படுத்தி collector-க்கு வெளிப்படுத்தப்பட வேண்டும்.
:::

```javascript
{
    "family":"AdotTask",
    "taskRoleArn":"arn:aws:iam::123456789012:role/ECS-ADOT-Task-Role",
    "executionRoleArn":"arn:aws:iam::123456789012:role/ECS-Task-Execution-Role",
    "networkMode":"awsvpc",
    "containerDefinitions":[
       {
          "name":"application-container",
          "image":"..."
       },        
       {
          "name":"aws-otel-collector",
          "image":"public.ecr.aws/aws-observability/aws-otel-collector:latest",
          "cpu":512,
          "memory":1024,
          "secrets":[
             {
                "name":"AOT_CONFIG_CONTENT",
                "valueFrom":"arn:aws:ssm:us-east-1:123456789012:parameter/otel-collector-config"
             }
          ],          
          "portMappings":[
             {
                "containerPort":2000,
                "protocol":"udp"
             }
          ],             
          "essential":true
       }
    ],
    "requiresCompatibilities":[
       "EC2"
    ],
    "cpu":"1024",
    "memory":"2048"
 }
```

## ECS கண்டெய்னர் instance மெட்ரிக்குகள் சேகரிப்புக்காக ADOT Collector-ஐ டிப்ளாய் செய்தல்

உங்கள் ECS கிளஸ்டரிலிருந்து EC2 instance-level மெட்ரிக்குகளை சேகரிக்க, கீழே காட்டப்பட்டுள்ள டாஸ்க் டெஃபினிஷன் பயன்படுத்தி ADOT collector-ஐ டிப்ளாய் செய்யலாம். இது daemon சர்வீஸ் scheduler strategy-யுடன் டிப்ளாய் செய்யப்பட வேண்டும். கண்டெய்னர் இமேஜில் தொகுக்கப்பட்ட pipeline கட்டமைப்பை நீங்கள் தேர்வு செய்யலாம். கண்டெய்னர் டெஃபினிஷனின் *command* பிரிவில் கட்டமைப்பு கோப்பு பாதை `--config=/etc/ecs/otel-instance-metrics-config.yaml` என அமைக்கப்பட வேண்டும். Collector EC2 instance-level infrastructure மெட்ரிக்குகளை CPU, memory, disk மற்றும் network போன்ற பல resources-க்கு சேகரிக்க [AWS Container Insights Receiver](https://github.com/open-telemetry/opentelemetry-collector-contrib/tree/main/receiver/awscontainerinsightreceiver#aws-container-insights-receiver)-ஐ பயன்படுத்துகிறது. மெட்ரிக்குகள் [Amazon CloudWatch EMF Exporter](https://github.com/open-telemetry/opentelemetry-collector-contrib/tree/main/exporter/awsemfexporter) பயன்படுத்தி performance log events ஆக CloudWatch-க்கு அனுப்பப்படுகின்றன. இந்த கட்டமைப்புடன் collector-இன் செயல்பாடு, EC2-ல் host செய்யப்பட்ட Amazon ECS கிளஸ்டருக்கு CloudWatch agent-ஐ டிப்ளாய் செய்வதற்கு சமமானது.

:::info
    EC2 instance-level மெட்ரிக்குகள் சேகரிப்புக்கான ADOT Collector டிப்ளாய்மென்ட் AWS Fargate-ல் இயங்கும் ECS கிளஸ்டர்களில் ஆதரிக்கப்படவில்லை
:::

```javascript
{
    "family":"AdotTask",
    "taskRoleArn":"arn:aws:iam::123456789012:role/ECS-ADOT-Task-Role",
    "executionRoleArn":"arn:aws:iam::123456789012:role/ECS-Task-Execution-Role",
    "networkMode":"awsvpc",
    "containerDefinitions":[
       {
          "name":"application-container",
          "image":"..."
       },
       {
          "name":"aws-otel-collector",
          "image":"public.ecr.aws/aws-observability/aws-otel-collector:latest",
          "cpu":512,
          "memory":1024,
          "command": [
            "--config=/etc/ecs/otel-instance-metrics-config.yaml"
          ],          
          "portMappings":[
             {
                "containerPort":2000,
                "protocol":"udp"
             }
          ],             
          "essential":true
       }
    ],
    "requiresCompatibilities":[
       "EC2"
    ],
    "cpu":"1024",
    "memory":"2048"
 }
```

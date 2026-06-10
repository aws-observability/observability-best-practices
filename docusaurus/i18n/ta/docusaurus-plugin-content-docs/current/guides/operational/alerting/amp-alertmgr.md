# Amazon Managed Service for Prometheus Alert Manager

## அறிமுகம்

[Amazon Managed Service for Prometheus](https://aws.amazon.com/prometheus/) (AMP) '**Recording rules**' மற்றும் '**Alerting rules**' என இரண்டு வகையான rules-ஐ ஆதரிக்கிறது, இவை உங்கள் ஏற்கனவே உள்ள Prometheus server-லிருந்து import செய்யப்படலாம், மேலும் வழக்கமான இடைவெளிகளில் மதிப்பீடு செய்யப்படுகின்றன.

[Alerting rules](https://prometheus.io/docs/prometheus/latest/configuration/alerting_rules/) வாடிக்கையாளர்களுக்கு [PromQL](https://prometheus.io/docs/prometheus/latest/querying/basics/) மற்றும் threshold அடிப்படையில் alert conditions-ஐ வரையறுக்க அனுமதிக்கின்றன. alerting rule-ன் மதிப்பு threshold-ஐ மீறும்போது, standalone Prometheus-ல் உள்ள alert manager-க்கு ஒத்த செயல்பாட்டை வழங்கும் Amazon Managed Service for Prometheus-ல் உள்ள Alert manager-க்கு அறிவிப்பு அனுப்பப்படுகிறது.

## Alerting Rules கோப்பு

Amazon Managed Service for Prometheus-ல் ஒரு Alerting rule YAML வடிவத்தில் rules கோப்பால் வரையறுக்கப்படுகிறது, இது standalone Prometheus-ல் உள்ள rules கோப்பின் அதே வடிவத்தைப் பின்பற்றுகிறது.

ஒரு rules கோப்பு பொதுவாக பின்வரும் fields-ஐ கொண்டிருக்கும்:

```
groups:
  - name:
  rules:
  - alert:
  expr:
  for:
  labels:
  annotations:
```

```console
Groups: வழக்கமான இடைவெளியில் வரிசையாக இயக்கப்படும் rules-ன் தொகுப்பு
Name: குழுவின் பெயர்
Rules: ஒரு குழுவில் உள்ள rules
Alert: alert-ன் பெயர்
Expr: alert தூண்டப்படுவதற்கான expression
For: firing நிலைக்கு புதுப்பிக்கப்படுவதற்கு முன் alert-ன் expression threshold-ஐ மீறுவதற்கான குறைந்தபட்ச கால அளவு
Labels: alert-உடன் இணைக்கப்பட்ட கூடுதல் labels
Annotations: விளக்கம் அல்லது link போன்ற சூழல் விவரங்கள்
```

ஒரு மாதிரி rule கோப்பு கீழே காட்டப்பட்டுள்ளது

```
groups:
  - name: test
    rules:
    - record: metric:recording_rule
      expr: avg(rate(container_cpu_usage_seconds_total[5m]))
  - name: alert-test
    rules:
    - alert: metric:alerting_rule
      expr: avg(rate(container_cpu_usage_seconds_total[5m])) > 0
      for: 2m
```

## Alert Manager Configuration கோப்பு

Amazon Managed Service for Prometheus Alert Manager alerts-ஐ அமைக்க (பெறும் சேவைக்கு) YAML வடிவத்தில் configuration கோப்பைப் பயன்படுத்துகிறது. configuration கோப்பு alert manager மற்றும் templating-க்கான இரண்டு முக்கிய பிரிவுகளைக் கொண்டுள்ளது:

1. [template_files](https://prometheus.io/docs/prometheus/latest/configuration/template_reference/), alerts-ல் உள்ள annotations மற்றும் labels-ன் templates-ஐ கொண்டுள்ளது.

2. [alertmanager_config](https://prometheus.io/docs/alerting/latest/configuration/), standalone Prometheus-ல் உள்ள alert manager config கோப்பின் அதே structure-ஐ பயன்படுத்தும் alert manager configuration-ஐ கொண்டுள்ளது.

## Alerting-ன் முக்கிய அம்சங்கள்

Amazon Managed Service for Prometheus [Alert Manager configuration file](https://docs.aws.amazon.com/prometheus/latest/userguide/AMP-alert-manager.html) உருவாக்கும்போது மூன்று முக்கிய அம்சங்களை கவனிக்க வேண்டும்.

- **Grouping**: ஒத்த alerts-ஐ ஒரு அறிவிப்பாக சேகரிக்க உதவுகிறது, தோல்வி அல்லது outage-ன் blast radius பெரிதாக இருக்கும்போது இது பயனுள்ளது.
- **Inhibition**: ஏற்கனவே active மற்றும் fired ஆன ஒத்த alerts-ஐ spam செய்வதைத் தவிர்க்க சில அறிவிப்புகளை அடக்கும் வழி.
- **Silencing**: maintenance window அல்லது திட்டமிடப்பட்ட outage போன்ற குறிப்பிட்ட கால அளவிற்கு alerts-ஐ mute செய்யலாம்.

## Amazon Simple Notification Service (SNS) மூலம் Alerts-ஐ Route செய்தல்

தற்போது [Amazon Managed Service for Prometheus Alert Manager Amazon SNS-ஐ](https://docs.aws.amazon.com/prometheus/latest/userguide/AMP-alertmanager-receiver-AMPpermission.html) ஒரே receiver-ஆக ஆதரிக்கிறது.

## SNS-க்கு அப்பால் பிற destinations-க்கு alerts-ஐ Route செய்தல்

Amazon Managed Service for Prometheus Alert Manager email, webhook (HTTP), Slack, PagerDuty மற்றும் OpsGenie போன்ற [பிற destinations-க்கு இணைக்க Amazon SNS-ஐ](https://docs.aws.amazon.com/prometheus/latest/userguide/AMP-alertmanager-SNS-otherdestinations.html) பயன்படுத்தலாம்.

## Alert நிலை

Alert expression ஒரு குறிப்பிட்ட நேரத்தில் ஒன்று அல்லது அதற்கு மேற்பட்ட vector elements-ஐ விளைவிக்கும் போதெல்லாம், alert active என கணக்கிடப்படுகிறது. alerts active (pending | firing) அல்லது resolved நிலையை எடுக்கின்றன.

- **Pending**: threshold மீறலுக்குப் பிறகு கடந்த நேரம் recording interval-ஐ விட குறைவு
- **Firing**: threshold மீறலுக்குப் பிறகு கடந்த நேரம் recording interval-ஐ விட அதிகம், Alert Manager alerts-ஐ routing செய்கிறது
- **Resolved**: threshold இனி மீறப்படாததால் alert இனி firing ஆகவில்லை

## Amazon Managed Grafana-ல் Amazon Managed Service for Prometheus Alert Manager rules

Amazon Managed Grafana (AMG) alerting அம்சம் வாடிக்கையாளர்களுக்கு தங்கள் Amazon Managed Grafana workspace-லிருந்து Amazon Managed Service for Prometheus Alert Manager alerts-ல் தெரிவுநிலையைப் பெற அனுமதிக்கிறது.

Reference: [Announcing Prometheus Alert manager rules in Amazon Managed Grafana](https://aws.amazon.com/blogs/mt/announcing-prometheus-alertmanager-rules-in-amazon-managed-grafana/)

![List of AMP alerts in Grafana](../../../images/amp-alerting.png)

## அடிப்படை கண்காணிப்புக்கான பரிந்துரைக்கப்பட்ட alerts

Alerting என்பது வலுவான கண்காணிப்பு மற்றும் Observability சிறந்த நடைமுறைகளின் முக்கிய அம்சமாகும். alerting mechanism alert fatigue-க்கும் முக்கியமான alerts-ஐ தவறவிடுவதற்கும் இடையே சமநிலையை ஏற்படுத்த வேண்டும். workloads-ன் ஒட்டுமொத்த நம்பகத்தன்மையை மேம்படுத்த பரிந்துரைக்கப்படும் சில alerts இங்கே உள்ளன:

- Container Node குறிப்பிட்ட (எ.கா. 80%) ஒதுக்கப்பட்ட memory limit-ஐ விட அதிகமாக பயன்படுத்துகிறது
- Container Node குறிப்பிட்ட (எ.கா. 80%) ஒதுக்கப்பட்ட CPU limit-ஐ விட அதிகமாக பயன்படுத்துகிறது
- Container Node குறிப்பிட்ட (எ.கா. 90%) ஒதுக்கப்பட்ட disk space-ஐ விட அதிகமாக பயன்படுத்துகிறது
- Namespace-ல் உள்ள pod-ல் container குறிப்பிட்ட (எ.கா. 80%) CPU limit-ஐ விட அதிகமாக பயன்படுத்துகிறது
- Deployment தற்போது active pods இல்லாமல் இயங்குகிறது
- Horizontal Pod Autoscaler (HPA) namespace-ல் அதிகபட்ச capacity-ல் இயங்குகிறது

## IAM policy-ஐ பயன்படுத்தி rules-க்கான அணுகலைக் கட்டுப்படுத்துதல்

நிறுவனங்களுக்கு பல்வேறு குழுகள் தங்கள் recording மற்றும் alerting தேவைகளுக்கான தங்கள் சொந்த rules-ஐ உருவாக்கவும் நிர்வகிக்கவும் தேவைப்படுகின்றன. Amazon Managed Service for Prometheus-ல் Rules management, ஒவ்வொரு குழுவும் rulegroupnamespaces மூலம் குழுவாக்கப்பட்ட தங்கள் சொந்த rules & alerts-ஐ கட்டுப்படுத்த AWS Identity and Access Management (IAM) policy-ஐ பயன்படுத்தி access controlled ஆக அனுமதிக்கிறது.

![Recording and Alerting rule namespaces in AMP console](../../../images/AMP_rules_namespaces.png)

மேலும் தகவலுக்கு வாடிக்கையாளர்கள் [AWS Documentation](https://docs.aws.amazon.com/prometheus/latest/userguide/AMP-alert-manager.html)-ஐ படிக்கலாம், Amazon Managed Service for Prometheus Alert Manager பற்றிய [AWS Observability Workshop](https://catalog.workshops.aws/observability/en-US/aws-managed-oss/amp/setup-alert-manager)-ஐ பார்க்கலாம்.

கூடுதல் Reference: [Amazon Managed Service for Prometheus Is Now Generally Available with Alert Manager and Ruler](https://aws.amazon.com/blogs/aws/amazon-managed-service-for-prometheus-is-now-generally-available-with-alert-manager-and-ruler/)

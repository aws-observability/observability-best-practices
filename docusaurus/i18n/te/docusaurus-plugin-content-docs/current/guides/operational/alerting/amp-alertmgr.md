# Amazon Managed Service for Prometheus Alert Manager

## పరిచయం

[Amazon Managed Service for Prometheus](https://aws.amazon.com/prometheus/) (AMP) రెండు రకాల నియమాలను సపోర్ట్ చేస్తుంది - '**Recording rules**' మరియు '**Alerting rules**', వీటిని మీ ఇప్పటికే ఉన్న Prometheus server నుండి import చేయవచ్చు మరియు క్రమ వ్యవధుల్లో evaluate చేయబడతాయి.

[Alerting rules](https://prometheus.io/docs/prometheus/latest/configuration/alerting_rules/) కస్టమర్లు [PromQL](https://prometheus.io/docs/prometheus/latest/querying/basics/) మరియు threshold ఆధారంగా alert షరతులను నిర్వచించడానికి అనుమతిస్తాయి. alerting rule యొక్క విలువ threshold ను దాటినప్పుడు, Amazon Managed Service for Prometheus లోని Alert manager కు notification పంపబడుతుంది, ఇది standalone Prometheus లో alert manager కు సమానమైన functionality ని అందిస్తుంది. alert అనేది Prometheus లో alerting rule active గా ఉన్నప్పుడు వచ్చే ఫలితం.

## Alerting Rules ఫైల్

Amazon Managed Service for Prometheus లో Alerting rule అనేది YAML ఫార్మాట్‌లో rules ఫైల్ ద్వారా నిర్వచించబడుతుంది, ఇది standalone Prometheus లోని rules ఫైల్ వలెనే ఉంటుంది. కస్టమర్లు Amazon Managed Service for Prometheus workspace లో బహుళ rules ఫైల్‌లను కలిగి ఉండవచ్చు. workspace అనేది Prometheus metrics నిల్వ మరియు querying కోసం అంకితమైన logical space.

rules ఫైల్ సాధారణంగా కింది ఫీల్డ్‌లను కలిగి ఉంటుంది:

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
Groups: A collection of rules that are run sequentially at a regular interval
Name: Name of the group
Rules: The rules in a group
Alert: Name of the alert
Expr: The expression for the alert to trigger
For: Minimum duration for an alert's expression to be exceeding threshold before updating to a firing status
Labels: Any additional labels attached to the alert
Annotations: Contextual details such as a description or link
```

sample rule ఫైల్ కింది విధంగా ఉంటుంది

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

## Alert Manager Configuration ఫైల్

Amazon Managed Service for Prometheus Alert Manager అనేది alerts ను సెటప్ చేయడానికి (receiving service కోసం) YAML ఫార్మాట్‌లో configuration ఫైల్‌ను ఉపయోగిస్తుంది, ఇది standalone Prometheus లోని alert manager config ఫైల్ వలె అదే నిర్మాణంలో ఉంటుంది. configuration ఫైల్ alert manager మరియు templating కోసం రెండు కీలక విభాగాలను కలిగి ఉంటుంది

1.  [template_files](https://prometheus.io/docs/prometheus/latest/configuration/template_reference/), alerts లో annotations మరియు labels యొక్క templates ను కలిగి ఉంటుంది, ఇవి `$value`, `$labels`, `$externalLabels`, మరియు `$externalURL` variables గా అందుబాటులో ఉంటాయి. `$labels` variable alert instance యొక్క label key/value pairs ను కలిగి ఉంటుంది. configured external labels ను `$externalLabels` variable ద్వారా access చేయవచ్చు. `$value` variable alert instance యొక్క evaluated value ను కలిగి ఉంటుంది. `.Value`, `.Labels`, `.ExternalLabels`, మరియు `.ExternalURL` వరుసగా alert value, alert labels, globally configured external labels, మరియు external URL (`--web.external-url` తో configured) ను కలిగి ఉంటాయి.

2.  [alertmanager_config](https://prometheus.io/docs/alerting/latest/configuration/), standalone Prometheus లోని alert manager config ఫైల్ వలె అదే నిర్మాణాన్ని ఉపయోగించే alert manager configuration ను కలిగి ఉంటుంది.

template_files మరియు alertmanager_config రెండింటినీ కలిగి ఉన్న sample alert manager configuration ఫైల్ కింది విధంగా ఉంటుంది,

```
template_files:
  default_template: |
    {{ define "sns.default.subject" }}[{{ .Status | toUpper }}{{ if eq .Status "firing" }}:{{ .Alerts.Firing | len }}{{ end }}]{{ end }}
    {{ define "__alertmanager" }}AlertManager{{ end }}
    {{ define "__alertmanagerURL" }}{{ .ExternalURL }}/#/alerts?receiver={{ .Receiver | urlquery }}{{ end }}
alertmanager_config: |
  global:
  templates:
    - 'default_template'
  route:
    receiver: default
  receivers:
    - name: 'default'
      sns_configs:
      - topic_arn: arn:aws:sns:us-east-2:accountid:My-Topic
        sigv4:
          region: us-east-2
        attributes:
          key: severity
          value: SEV2
```

## Alerting యొక్క కీలక అంశాలు

Amazon Managed Service for Prometheus [Alert Manager configuration ఫైల్](https://docs.aws.amazon.com/prometheus/latest/userguide/AMP-alert-manager.html) సృష్టించేటప్పుడు తెలుసుకోవలసిన మూడు ముఖ్యమైన అంశాలు ఉన్నాయి.

- **Grouping**: ఇది సమానమైన alerts ను ఒకే notification లోకి సేకరించడంలో సహాయపడుతుంది, ఇది failure లేదా outage యొక్క blast radius పెద్దగా ఉండి అనేక systems ను ప్రభావితం చేస్తున్నప్పుడు మరియు అనేక alerts ఏకకాలంలో fire అయినప్పుడు ఉపయోగకరంగా ఉంటుంది. దీనిని categories గా (ఉదా., node alerts, pod alerts) group చేయడానికి కూడా ఉపయోగించవచ్చు. alert manager configuration ఫైల్‌లో [route](https://prometheus.io/docs/alerting/latest/configuration/#route) block ఈ grouping ను configure చేయడానికి ఉపయోగించవచ్చు.
- **Inhibition**: ఇది ఇప్పటికే active గా ఉన్న మరియు fire అయిన సమానమైన alerts ను spam చేయకుండా నిర్దిష్ట notifications ను suppress చేసే మార్గం. [inhibit_rules](https://prometheus.io/docs/alerting/latest/configuration/#inhibit_rule) block inhibition rules రాయడానికి ఉపయోగించవచ్చు.
- **Silencing**: Alerts ను నిర్దిష్ట వ్యవధిలో mute చేయవచ్చు, ఉదాహరణకు maintenance window లేదా planned outage సమయంలో. Incoming alerts ను silencing చేయడానికి ముందు అన్ని equality లేదా regular expression matching కోసం verify చేయబడతాయి. [PutAlertManagerSilences](https://docs.aws.amazon.com/prometheus/latest/userguide/AMP-APIReference.html#AMP-APIReference-PutAlertManagerSilences) API silencing సృష్టించడానికి ఉపయోగించవచ్చు.

## Amazon Simple Notification Service (SNS) ద్వారా alerts ను route చేయడం

ప్రస్తుతం [Amazon Managed Service for Prometheus Alert Manager Amazon SNS ను సపోర్ట్ చేస్తుంది](https://docs.aws.amazon.com/prometheus/latest/userguide/AMP-alertmanager-receiver-AMPpermission.html) ఏకైక receiver గా. alertmanager_config block లోని receivers కీలక విభాగం, ఇది కస్టమర్లు [Amazon SNS ను alerts receive చేయడానికి](https://docs.aws.amazon.com/prometheus/latest/userguide/AMP-alertmanager-receiver-config.html) configure చేయడానికి అనుమతిస్తుంది. receivers block కోసం కింది విభాగాన్ని template గా ఉపయోగించవచ్చు.

```
- name: name_of_receiver
  sns_configs:
    - sigv4:
        region: <AWS_Region>
    topic_arn: <ARN_of_SNS_topic>
    subject: somesubject
    attributes:
       key: <somekey>
       value: <somevalue>
```

Amazon SNS configuration కింది template ను default గా ఉపయోగిస్తుంది, స్పష్టంగా override చేయకపోతే.

```
{{ define "sns.default.message" }}{{ .CommonAnnotations.SortedPairs.Values | join " " }}
  {{ if gt (len .Alerts.Firing) 0 -}}
  Alerts Firing:
    {{ template "__text_alert_list" .Alerts.Firing }}
  {{- end }}
  {{ if gt (len .Alerts.Resolved) 0 -}}
  Alerts Resolved:
    {{ template "__text_alert_list" .Alerts.Resolved }}
  {{- end }}
{{- end }}
```

అదనపు సూచన: [Notification Template ఉదాహరణలు](https://prometheus.io/docs/alerting/latest/notification_examples/)

## Amazon SNS కు మించి ఇతర గమ్యస్థానాలకు alerts ను routing చేయడం

Amazon Managed Service for Prometheus Alert Manager [Amazon SNS ను ఇతర గమ్యస్థానాలకు](https://docs.aws.amazon.com/prometheus/latest/userguide/AMP-alertmanager-SNS-otherdestinations.html) connect చేయడానికి ఉపయోగించవచ్చు, ఉదాహరణకు email, webhook (HTTP), Slack, PageDuty, మరియు OpsGenie.

- **Email** విజయవంతమైన notification ఫలితంగా Amazon Managed Service for Prometheus Alert Manager నుండి Amazon SNS topic ద్వారా alert details తో email అందుతుంది.
- Amazon Managed Service for Prometheus Alert Manager [alerts ను JSON format లో పంపగలదు](https://docs.aws.amazon.com/prometheus/latest/userguide/AMP-alertmanager-receiver-JSON.html), తద్వారా వాటిని Amazon SNS నుండి downstream గా AWS Lambda లో లేదా webhook-receiving endpoints లో process చేయవచ్చు.
- **Webhook** ఇప్పటికే ఉన్న Amazon SNS topic ను webhook endpoint కు messages output చేయడానికి configure చేయవచ్చు. Webhooks అనేవి event driven triggers ఆధారంగా applications మధ్య HTTP ద్వారా మార్పిడి చేయబడే serialized form-encoded JSON లేదా XML formats లో messages. ఇది alerting, ticketing లేదా incident management systems కోసం ఏదైనా ఉన్న [SIEM లేదా collaboration tools](https://repost.aws/knowledge-center/sns-lambda-webhooks-chime-slack-teams) ను hook చేయడానికి ఉపయోగించవచ్చు.
- **Slack** కస్టమర్లు [Slack యొక్క](https://aws.amazon.com/blogs/mt/how-to-integrate-amazon-managed-service-for-prometheus-with-slack/) email-to-channel integration తో integrate చేయవచ్చు, ఇక్కడ Slack email ను accept చేసి Slack channel కు forward చేయగలదు, లేదా SNS notification ను Slack కు rewrite చేయడానికి Lambda function ను ఉపయోగించవచ్చు.
- **PagerDuty** `alertmanager_config` definition లోని `template_files` block లో ఉపయోగించిన template ను Amazon SNS యొక్క destination గా [PagerDuty](https://aws.amazon.com/blogs/mt/using-amazon-managed-service-for-prometheus-alert-manager-to-receive-alerts-with-pagerduty/) కు payload పంపడానికి customize చేయవచ్చు.

అదనపు సూచన: [Custom Alert manager Templates](https://prometheus.io/blog/2016/03/03/custom-alertmanager-templates/)

## Alert స్థితి

Alerting rules నిర్ణయించిన threshold దాటినప్పుడు ఏదైనా notification service కు alerts పంపడానికి expressions ఆధారంగా alert షరతులను నిర్వచిస్తాయి. ఒక ఉదాహరణ rule మరియు దాని expression కింద చూపబడింది.

```
rules:
- alert: metric:alerting_rule
  expr: avg(rate(container_cpu_usage_seconds_total[5m])) > 0
  for: 2m

```

alert expression ఒక నిర్దిష్ట సమయంలో ఒకటి లేదా అంతకంటే ఎక్కువ vector elements ను result చేసినప్పుడు, alert active గా పరిగణించబడుతుంది. alerts active (pending | firing) లేదా resolved status తీసుకుంటాయి.

- **Pending**: threshold breach నుండి గడిచిన సమయం recording interval కంటే తక్కువగా ఉంటుంది
- **Firing**: threshold breach నుండి గడిచిన సమయం recording interval కంటే ఎక్కువగా ఉంటుంది మరియు Alert Manager alerts ను routing చేస్తుంది.
- **Resolved**: threshold ఇకపై breach కానందున alert ఇకపై firing కాదు.

దీనిని [awscurl](https://docs.aws.amazon.com/prometheus/latest/userguide/AMP-compatible-APIs.html) command ఉపయోగించి [ListAlerts](https://docs.aws.amazon.com/prometheus/latest/userguide/AMP-APIReference.html#AMP-APIReference-ListAlerts) API ద్వారా Amazon Managed Service for Prometheus Alert Manager endpoint ను query చేయడం ద్వారా manually verify చేయవచ్చు. sample request కింద చూపబడింది.

```
awscurl https://aps-workspaces.us-east-1.amazonaws.com/workspaces/$WORKSPACE_ID/alertmanager/api/v2/alerts --service="aps" -H "Content-Type: application/json"
```

## Amazon Managed Grafana లో Amazon Managed Service for Prometheus Alert Manager rules

Amazon Managed Grafana (AMG) alerting feature కస్టమర్లు వారి Amazon Managed Grafana workspace నుండి Amazon Managed Service for Prometheus Alert Manager alerts పై visibility పొందడానికి అనుమతిస్తుంది. Amazon Managed Service for Prometheus workspaces ను Prometheus metrics collect చేయడానికి ఉపయోగించే కస్టమర్లు service లో fully managed Alert Manager మరియు Ruler features ను alerting మరియు recording rules configure చేయడానికి ఉపయోగిస్తారు. ఈ feature తో, వారు తమ Amazon Managed Service for Prometheus workspace లో configure చేయబడిన అన్ని alert మరియు recording rules ను visualize చేయవచ్చు. Prometheus alerts view ను Amazon Managed Grafana (AMG) console లో Workspace configuration options tab లో Grafana alerting checkbox ను check చేయడం ద్వారా చూడవచ్చు. enable చేసిన తర్వాత, ఇది గతంలో Grafana dashboards లో సృష్టించిన native Grafana alerts ను Grafana workspace లో కొత్త Alerting page లోకి migrate కూడా చేస్తుంది.

సూచన: [Amazon Managed Grafana లో Prometheus Alert manager rules ప్రకటన](https://aws.amazon.com/blogs/mt/announcing-prometheus-alertmanager-rules-in-amazon-managed-grafana/)

![Grafana లో AMP alerts జాబితా](../../../images/amp-alerting.png)

## Baseline monitoring కోసం సిఫార్సు చేయబడిన alerts

Alerting అనేది robust monitoring మరియు observability best practices యొక్క కీలక అంశం. alerting mechanism alert fatigue మరియు critical alerts ను miss చేయడం మధ్య సమతుల్యతను సాధించాలి. workloads యొక్క overall reliability ని మెరుగుపరచడానికి సిఫార్సు చేయబడిన కొన్ని alerts ఇక్కడ ఉన్నాయి. సంస్థలో వివిధ teams వారి infrastructure మరియు workloads ను వేర్వేరు దృక్కోణాల నుండి monitor చేయడం చూస్తారు, కాబట్టి ఇది requirement మరియు scenario ఆధారంగా విస్తరించబడవచ్చు లేదా మార్చబడవచ్చు & ఖచ్చితంగా ఇది సమగ్ర జాబితా కాదు.

- Container Node కేటాయించిన memory limit లో నిర్దిష్ట (ఉదా. 80%) కంటే ఎక్కువ ఉపయోగిస్తుంది.
- Container Node కేటాయించిన CPU limit లో నిర్దిష్ట (ఉదా. 80%) కంటే ఎక్కువ ఉపయోగిస్తుంది.
- Container Node కేటాయించిన disk space లో నిర్దిష్ట (ఉదా. 90%) కంటే ఎక్కువ ఉపయోగిస్తుంది.
- Namespace లో pod లోని Container కేటాయించిన CPU limit లో నిర్దిష్ట (ఉదా. 80%) కంటే ఎక్కువ ఉపయోగిస్తుంది.
- Namespace లో pod లోని Container memory limit లో నిర్దిష్ట (ఉదా. 80%) కంటే ఎక్కువ ఉపయోగిస్తుంది.
- Namespace లో pod లోని Container చాలా ఎక్కువ restarts కలిగి ఉంది.
- Namespace లో Persistent Volume నిర్దిష్ట (గరిష్టం 75%) disk space కంటే ఎక్కువ ఉపయోగిస్తుంది.
- Deployment ప్రస్తుతం active pods లేకుండా running అవుతోంది
- Horizontal Pod Autoscaler (HPA) namespace లో గరిష్ట capacity తో running అవుతోంది

పై లేదా ఏదైనా సమానమైన scenario కోసం alerts సెటప్ చేయడంలో ముఖ్యమైన విషయం expression ను అవసరమైన విధంగా మార్చడం. ఉదాహరణకు,

```
expr: |
        ((sum(irate(container_cpu_usage_seconds_total{image!="",container!="POD", namespace!="kube-sys"}[30s])) by (namespace,container,pod) /
sum(container_spec_cpu_quota{image!="",container!="POD", namespace!="kube-sys"} /
container_spec_cpu_period{image!="",container!="POD", namespace!="kube-sys"}) by (namespace,container,pod) ) * 100)  > 80
      for: 5m
```

## Amazon Managed Service for Prometheus కోసం ACK Controller

Amazon Managed Service for Prometheus [AWS Controller for Kubernetes](https://github.com/aws-controllers-k8s/community) (ACK) controller Workspace, Alert Manager మరియు Ruler resources కోసం అందుబాటులో ఉంది, ఇది కస్టమర్లు Kubernetes cluster బయట ఏ resources నిర్వచించకుండా [custom resource definitions](https://kubernetes.io/docs/concepts/extend-kubernetes/api-extension/custom-resources/) (CRDs) మరియు native objects లేదా services ను ఉపయోగించి Prometheus యొక్క ప్రయోజనాన్ని పొందడానికి అనుమతిస్తుంది. [Amazon Managed Service for Prometheus కోసం ACK controller](https://aws.amazon.com/blogs/mt/introducing-the-ack-controller-for-amazon-managed-service-for-prometheus/) మీరు monitor చేస్తున్న Kubernetes cluster నుండి నేరుగా అన్ని resources ను manage చేయడానికి ఉపయోగించవచ్చు, Kubernetes ను మీ workload యొక్క desired state కోసం 'source of truth' గా పని చేయడానికి అనుమతిస్తుంది. [ACK](https://aws-controllers-k8s.github.io/community/docs/community/overview/) అనేది Kubernetes API ని extend చేయడానికి మరియు AWS resources ను manage చేయడానికి కలిసి పని చేసే Kubernetes CRDs మరియు custom controllers సేకరణ.

ACK ఉపయోగించి configure చేయబడిన alerting rules యొక్క snippet కింద చూపబడింది:

```
apiVersion: prometheusservice.services.k8s.aws/v1alpha1
kind: RuleGroupsNamespace
metadata:
  name: default-rule
spec:
  workspaceID: WORKSPACE-ID
  name: default-rule
  configuration: |
    groups:
    - name: example
      rules:
      - alert: HostHighCpuLoad
        expr: 100 - (avg(rate(node_cpu_seconds_total{mode="idle"}[2m])) * 100) > 60
        for: 5m
        labels:
          severity: warning
          event_type: scale_up
        annotations:
          summary: Host high CPU load (instance {{ $labels.instance }})
          description: "CPU load is > 60%\n  VALUE = {{ $value }}\n  LABELS = {{ $labels }}"
      - alert: HostLowCpuLoad
        expr: 100 - (avg(rate(node_cpu_seconds_total{mode="idle"}[2m])) * 100) < 30
        for: 5m
        labels:
          severity: warning
          event_type: scale_down
        annotations:
          summary: Host low CPU load (instance {{ $labels.instance }})
          description: "CPU load is < 30%\n  VALUE = {{ $value }}\n  LABELS = {{ $labels }}"
```

## IAM policy ఉపయోగించి rules కు access పరిమితం చేయడం

సంస్థలకు వివిధ teams తమ recording మరియు alerting requirements కోసం తమ స్వంత rules సృష్టించి & manage చేయడం అవసరం. Amazon Managed Service for Prometheus లో Rules management AWS Identity and Access Management (IAM) policy ఉపయోగించి access control చేయడానికి rules ను అనుమతిస్తుంది, తద్వారా ప్రతి team rulegroupnamespaces ద్వారా group చేయబడిన తమ స్వంత rules & alerts ను control చేయగలదు.

కింది image Amazon Managed Service for Prometheus యొక్క Rules management లో devops మరియు engg అనే రెండు ఉదాహరణ rulegroupnamespaces add చేయబడినట్లు చూపిస్తుంది.

![AMP console లో Recording మరియు Alerting rule namespaces](../../../images/AMP_rules_namespaces.png)

కింది JSON అనేది Resource ARN specified తో devops rulegroupnamespace (పైన చూపబడింది) కు access పరిమితం చేసే sample IAM policy. కింది IAM policy లో గమనించదగ్గ actions [PutRuleGroupsNamespace](https://docs.aws.amazon.com/cli/latest/reference/amp/put-rule-groups-namespace.html) మరియు [DeleteRuleGroupsNamespace](https://docs.aws.amazon.com/cli/latest/reference/amp/delete-rule-groups-namespace.html), ఇవి AMP workspace యొక్క rulegroupsnamespace యొక్క specified Resource ARN కు పరిమితం చేయబడ్డాయి. policy సృష్టించిన తర్వాత, దీనిని desired access control requirement కోసం ఏదైనా required user, group లేదా role కు assign చేయవచ్చు. IAM policy లోని Action ను required & allowable actions కోసం [IAM permissions](https://docs.aws.amazon.com/prometheus/latest/userguide/AMP-APIReference.html) ఆధారంగా అవసరమైన విధంగా modify/restrict చేయవచ్చు.

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "VisualEditor0",
      "Effect": "Allow",
      "Action": [
        "aps:RemoteWrite",
        "aps:DescribeRuleGroupsNamespace",
        "aps:PutRuleGroupsNamespace",
        "aps:DeleteRuleGroupsNamespace"
      ],
      "Resource": [
        "arn:aws:aps:us-west-2:XXXXXXXXXXXX:workspace/ws-8da31ad6-f09d-44ff-93a3-xxxxxxxxxx",
        "arn:aws:aps:us-west-2:XXXXXXXXXXXX:rulegroupsnamespace/ws-8da31ad6-f09d-44ff-93a3-xxxxxxxxxx/devops"
      ]
    }
  ]
}
```

కింది awscli interaction IAM policy లో Resource ARN (అనగా devops rulegroupnamespace) ద్వారా specified rulegroupsnamespace కు restricted access కలిగి ఉన్న IAM user యొక్క ఉదాహరణను మరియు అదే user access లేని ఇతర resources (అనగా engg rulegroupnamespace) కు denied అయినట్లు చూపిస్తుంది.

```
$ aws amp describe-rule-groups-namespace --workspace-id ws-8da31ad6-f09d-44ff-93a3-xxxxxxxxxx --name devops
{
    "ruleGroupsNamespace": {
        "arn": "arn:aws:aps:us-west-2:XXXXXXXXXXXX:rulegroupsnamespace/ws-8da31ad6-f09d-44ff-93a3-xxxxxxxxxx/devops",
        "createdAt": "2023-04-28T01:50:15.408000+00:00",
        "data": "Z3JvdXBzOgogIC0gbmFtZTogZGV2b3BzX3VwZGF0ZWQKICAgIHJ1bGVzOgogICAgLSByZWNvcmQ6IG1ldHJpYzpob3N0X2NwdV91dGlsCiAgICAgIGV4cHI6IGF2ZyhyYXRlKGNvbnRhaW5lcl9jcHVfdXNhZ2Vfc2Vjb25kc190b3RhbFsybV0pKQogICAgLSBhbGVydDogaGlnaF9ob3N0X2NwdV91c2FnZQogICAgICBleHByOiBhdmcocmF0ZShjb250YWluZXJfY3B1X3VzYWdlX3NlY29uZHNfdG90YWxbNW1dKSkKICAgICAgZm9yOiA1bQogICAgICBsYWJlbHM6CiAgICAgICAgICAgIHNldmVyaXR5OiBjcml0aWNhbAogIC0gbmFtZTogZGV2b3BzCiAgICBydWxlczoKICAgIC0gcmVjb3JkOiBjb250YWluZXJfbWVtX3V0aWwKICAgICAgZXhwcjogYXZnKHJhdGUoY29udGFpbmVyX21lbV91c2FnZV9ieXRlc190b3RhbFs1bV0pKQogICAgLSBhbGVydDogY29udGFpbmVyX2hvc3RfbWVtX3VzYWdlCiAgICAgIGV4cHI6IGF2ZyhyYXRlKGNvbnRhaW5lcl9tZW1fdXNhZ2VfYnl0ZXNfdG90YWxbNW1dKSkKICAgICAgZm9yOiA1bQogICAgICBsYWJlbHM6CiAgICAgICAgc2V2ZXJpdHk6IGNyaXRpY2FsCg==",
        "modifiedAt": "2023-05-01T17:47:06.409000+00:00",
        "name": "devops",
        "status": {
            "statusCode": "ACTIVE",
            "statusReason": ""
        },
        "tags": {}
    }
}


$ cat > devops.yaml <<EOF
> groups:
>  - name: devops_new
>    rules:
>   - record: metric:host_cpu_util
>     expr: avg(rate(container_cpu_usage_seconds_total[2m]))
>   - alert: high_host_cpu_usage
>     expr: avg(rate(container_cpu_usage_seconds_total[5m]))
>     for: 5m
>     labels:
>            severity: critical
>  - name: devops
>    rules:
>    - record: container_mem_util
>      expr: avg(rate(container_mem_usage_bytes_total[5m]))
>    - alert: container_host_mem_usage
>      expr: avg(rate(container_mem_usage_bytes_total[5m]))
>      for: 5m
>      labels:
>        severity: critical
> EOF


$ base64 devops.yaml > devops_b64.yaml


$ aws amp put-rule-groups-namespace --workspace-id ws-8da31ad6-f09d-44ff-93a3-xxxxxxxxxx --name devops --data file://devops_b64.yaml
{
    "arn": "arn:aws:aps:us-west-2:XXXXXXXXXXXX:rulegroupsnamespace/ws-8da31ad6-f09d-44ff-93a3-xxxxxxxxxx/devops",
    "name": "devops",
    "status": {
        "statusCode": "UPDATING"
    },
    "tags": {}
}
```

`$ aws amp describe-rule-groups-namespace --workspace-id ws-8da31ad6-f09d-44ff-93a3-xxxxxxxxxx --name engg
An error occurred (AccessDeniedException) when calling the DescribeRuleGroupsNamespace operation: User: arn:aws:iam::XXXXXXXXXXXX:user/amp_ws_user is not authorized to perform: aps:DescribeRuleGroupsNamespace on resource: arn:aws:aps:us-west-2:XXXXXXXXXXXX:rulegroupsnamespace/ws-8da31ad6-f09d-44ff-93a3-xxxxxxxxxx/engg`

`$ aws amp put-rule-groups-namespace --workspace-id ws-8da31ad6-f09d-44ff-93a3-xxxxxxxxxx --name engg --data file://devops_b64.yaml
An error occurred (AccessDeniedException) when calling the PutRuleGroupsNamespace operation: User: arn:aws:iam::XXXXXXXXXXXX:user/amp_ws_user is not authorized to perform: aps:PutRuleGroupsNamespace on resource: arn:aws:aps:us-west-2:XXXXXXXXXXXX:rulegroupsnamespace/ws-8da31ad6-f09d-44ff-93a3-xxxxxxxxxx/engg`

`$ aws amp delete-rule-groups-namespace --workspace-id ws-8da31ad6-f09d-44ff-93a3-xxxxxxxxxx --name engg
An error occurred (AccessDeniedException) when calling the DeleteRuleGroupsNamespace operation: User: arn:aws:iam::XXXXXXXXXXXX:user/amp_ws_user is not authorized to perform: aps:DeleteRuleGroupsNamespace on resource: arn:aws:aps:us-west-2:XXXXXXXXXXXX:rulegroupsnamespace/ws-8da31ad6-f09d-44ff-93a3-xxxxxxxxxx/engg`

rules ఉపయోగించడానికి user permissions ను [IAM policy](https://docs.aws.amazon.com/prometheus/latest/userguide/AMP-alertmanager-IAM-permissions.html) (documentation sample) ఉపయోగించి కూడా restrict చేయవచ్చు.

మరింత సమాచారం కోసం కస్టమర్లు [AWS Documentation](https://docs.aws.amazon.com/prometheus/latest/userguide/AMP-alert-manager.html) చదవగలరు, Amazon Managed Service for Prometheus Alert Manager పై [AWS Observability Workshop](https://catalog.workshops.aws/observability/en-US/aws-managed-oss/amp/setup-alert-manager) ద్వారా వెళ్ళగలరు.

అదనపు సూచన: [Amazon Managed Service for Prometheus ఇప్పుడు Alert Manager మరియు Ruler తో Generally Available](https://aws.amazon.com/blogs/aws/amazon-managed-service-for-prometheus-is-now-generally-available-with-alert-manager-and-ruler/)

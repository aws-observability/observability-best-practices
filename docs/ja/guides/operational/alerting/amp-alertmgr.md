# Amazon Managed Service for Prometheus アラートマネージャー

## はじめに

[Amazon Managed Service for Prometheus](https://aws.amazon.com/prometheus/) (AMP) は、「**Recording rules**」と「**Alerting rules**」という 2 種類のルールをサポートしています。これらのルールは、既存の Prometheus サーバーからインポートでき、定期的な間隔で評価されます。

[Alerting rules](https://prometheus.io/docs/prometheus/latest/configuration/alerting_rules/) を使用すると、[PromQL](https://prometheus.io/docs/prometheus/latest/querying/basics/) としきい値に基づいて、アラート条件を定義できます。アラートルールの値がしきい値を超えると、Amazon Managed Service for Prometheus の Alert manager に通知が送信されます。これは、スタンドアロンの Prometheus の alert manager と同様の機能を提供します。アラートとは、Prometheus でアクティブになったアラートルールの結果です。

## アラートルールファイル

Amazon Managed Service for Prometheus のアラートルールは、スタンドアロンの Prometheus と同じ形式の YAML 形式のルールファイルで定義されます。お客様は、Amazon Managed Service for Prometheus ワークスペース内に複数のルールファイルを持つことができます。ワークスペースとは、Prometheus メトリクスの格納とクエリを行うための論理的なスペースです。

ルールファイルは通常、次のフィールドで構成されます。

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
For: Minimum duration for an alert’s expression to be exceeding threshold before updating to a firing status
Labels: Any additional labels attached to the alert
Annotations: Contextual details such as a description or link
```

サンプルのルールファイルは次のようになります。

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

## アラートマネージャー設定ファイル

Amazon Managed Service for Prometheus のアラートマネージャーは、スタンドアロンの Prometheus のアラートマネージャー設定ファイルと同じ構造の YAML 形式の設定ファイルを使用して、受信サービスのアラートを設定します。設定ファイルはアラートマネージャーとテンプレートの 2 つの主要なセクションで構成されます。

1. [template_files](https://prometheus.io/docs/prometheus/latest/configuration/template_reference/) には、便宜上 `$value`、`$labels`、`$externalLabels`、`$externalURL` 変数として公開されているアラートのアノテーションとラベルのテンプレートが含まれます。`$labels` 変数には、アラート インスタンスのラベルのキー/値のペアが保持されます。設定された外部ラベルには、`$externalLabels` 変数経由でアクセスできます。`$value` 変数には、アラート インスタンスの評価された値が保持されます。`.Value`、`.Labels`、`.ExternalLabels`、`.ExternalURL` には、それぞれアラート値、アラート ラベル、グローバルに設定された外部ラベル、外部 URL (`--web.external-url` で設定) が含まれます。

2. [alertmanager_config](https://prometheus.io/docs/alerting/latest/configuration/) には、スタンドアロンの Prometheus のアラート マネージャー設定ファイルと同じ構造を使用するアラート マネージャー設定が含まれます。

template_files と alertmanager_config の両方を持つサンプルアラートマネージャー設定ファイルは、次のようになります。

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

## アラートの主要な側面

Amazon Managed Service for Prometheus [Alert Manager 設定ファイル](https://docs.aws.amazon.com/ja_jp/prometheus/latest/userguide/AMP-alert-manager.html) を作成する際に認識しておく必要がある 3 つの重要な側面があります。

- **グルーピング**: これにより、障害や停止の影響範囲が大きく、多くのシステムに影響し、複数のアラートが同時に発生した場合に、類似のアラートを 1 つの通知にまとめることができます。これはカテゴリー別 (ノードアラート、Pod アラートなど) にグループ化するためにも使用できます。アラートマネージャーの設定ファイルの [route](https://prometheus.io/docs/alerting/latest/configuration/#route) ブロックを使用して、このグルーピングを設定できます。
- **抑制**: これは、すでにアクティブで発生した類似のアラートをスパムするのを避けるために、特定の通知を抑制する方法です。 [inhibit_rules](https://prometheus.io/docs/alerting/latest/configuration/#inhibit_rule) ブロックを使用して抑制ルールを記述できます。
- **サイレンシング**: アラートは、メンテナンスウィンドウや計画停止などの指定期間中にミュートできます。着信アラートは、アラートをサイレンシングする前に、等価性や正規表現の一致をすべて検証されます。 [PutAlertManagerSilences](https://docs.aws.amazon.com/ja_jp/prometheus/latest/userguide/AMP-APIReference.html#AMP-APIReference-PutAlertManagerSilences) API を使用してサイレンシングを作成できます。

## Amazon Simple Notification Service(SNS)を通じたアラートのルーティング

現在、[Amazon Managed Service for Prometheus の Alert Manager は Amazon SNS](https://docs.aws.amazon.com/ja_jp/prometheus/latest/userguide/AMP-alertmanager-receiver-AMPpermission.html) のみをレシーバとしてサポートしています。alertmanager_config ブロックでキーとなるセクションはレシーバで、これによりお客様は [Amazon SNS へのアラートの受信](https://docs.aws.amazon.com/ja_jp/prometheus/latest/userguide/AMP-alertmanager-receiver-config.html) を設定できます。以下のセクションは、レシーバブロックのテンプレートとして使用できます。

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

Amazon SNS 設定は、明示的に上書きされない限り、次のテンプレートをデフォルトとして使用します。

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

追加リファレンス: [通知テンプレートの例](https://prometheus.io/docs/alerting/latest/notification_examples/)

</sns></aws>

## Amazon SNS を介して E メール、Webhook、Slack、PagerDuty、OpsGenie などの宛先にアラートをルーティング

Amazon Managed Service for Prometheus の Alert Manager は、[Amazon SNS を使用して E メール、Webhook(HTTP)、Slack、PagerDuty、OpsGenie などの他の宛先に接続できます](https://docs.aws.amazon.com/ja_jp/prometheus/latest/userguide/AMP-alertmanager-SNS-otherdestinations.html)。

- **E メール** 通知が成功すると、Amazon SNS トピックを介して Amazon Managed Service for Prometheus Alert Manager からアラートの詳細が含まれた E メールがターゲットの 1 つとして受信されます。
- Amazon Managed Service for Prometheus Alert Manager は、[アラートを JSON 形式で送信できる](https://docs.aws.amazon.com/ja_jp/prometheus/latest/userguide/AMP-alertmanager-receiver-JSON.html)ため、Amazon SNS からダウンストリームの AWS Lambda や Webhook 受信エンドポイントで処理できます。
- **Webhook** 既存の Amazon SNS トピックを設定して、メッセージを Webhook エンドポイントに出力できます。Webhook は、イベント駆動型のトリガーに基づいてアプリケーション間で HTTP 経由で交換される、直列化された形式でエンコードされた JSON または XML 形式のメッセージです。これを使用して、アラート、チケット、インシデント管理システムのための既存の [SIEM やコラボレーションツールにフックできます](https://repost.aws/knowledge-center/sns-lambda-webhooks-chime-slack-teams)。
- **Slack** お客様は、Slack が E メールを受け入れて Slack チャネルに転送できる E メールからチャネルへの統合を使用するか、Lambda 関数を使用して SNS 通知を Slack に書き換えることができます。
- **PagerDuty** `alertmanager_config` 定義の `template_files` ブロックで使用されているテンプレートをカスタマイズして、ペイロードを [PagerDuty](https://aws.amazon.com/blogs/mt/using-amazon-managed-service-for-prometheus-alert-manager-to-receive-alerts-with-pagerduty/) に送信できます。

参考資料: [カスタムアラートマネージャーテンプレート](https://prometheus.io/blog/2016/03/03/custom-alertmanager-templates/)

## アラートのステータス

アラートルールは、設定したしきい値を超えたときにアラートを任意の通知サービスに送信するための、式に基づいてアラート条件を定義します。ルールと式の例を以下に示します。

```
rules:
- alert: metric:alerting_rule
  expr: avg(rate(container_cpu_usage_seconds_total[5m])) > 0
  for: 2m

```

アラート式の結果が、ある時点で1つ以上のベクトル要素を生成した場合、そのアラートはアクティブと見なされます。アラートは active (pending | firing) または resolved のステータスを取ります。

- **Pending**: しきい値の超過から経過した時間が記録間隔よりも短い
- **Firing**: しきい値の超過から経過した時間が記録間隔よりも長く、Alert Manager がアラートをルーティングしている
- **Resolved**: しきい値がもう超過していないため、アラートが発生していない

これは、[ListAlerts](https://docs.aws.amazon.com/prometheus/latest/userguide/AMP-APIReference.html#AMP-APIReference-ListAlerts) API を使用して Amazon Managed Service for Prometheus Alert Manager エンドポイントにクエリを発行し、手動で検証できます。[awscurl](https://docs.aws.amazon.com/prometheus/latest/userguide/AMP-compatible-APIs.html) コマンドを使用します。サンプルリクエストを以下に示します。

```
awscurl https://aps-workspaces.us-east-1.amazonaws.com/workspaces/$WORKSPACE_ID/alertmanager/api/v2/alerts --service="aps" -H "Content-Type: application/json"
```

## Amazon Managed Grafana での Amazon Managed Service for Prometheus アラートマネージャー ルール

Amazon Managed Grafana(AMG) のアラート機能を使用すると、Amazon Managed Service for Prometheus のアラートマネージャーアラートを自分の Amazon Managed Grafana ワークスペースから確認できます。Prometheus メトリクスを収集するために Amazon Managed Service for Prometheus ワークスペースを使用しているユーザーは、サービス内の完全マネージドのアラートマネージャーとルーラー機能を利用して、アラートと記録ルールを設定します。この機能を使用することで、Amazon Managed Service for Prometheus ワークスペースで設定されたすべてのアラートと記録ルールを可視化できます。Prometheus アラートビューは、ワークスペースの構成オプションタブの Grafana アラートチェックボックスをオンにすることで、Amazon Managed Grafana(AMG) コンソールで確認できます。有効にすると、以前 Grafana ダッシュボードで作成されたネイティブの Grafana アラートも、Grafana ワークスペースの新しい [アラート] ページに移行されます。

参考: [Amazon Managed Grafana での Prometheus アラートマネージャー ルールの発表](https://aws.amazon.com/jp/blogs/news/announcing-prometheus-alertmanager-rules-in-amazon-managed-grafana/)

![Grafana の AMP アラートのリスト](../../../images/amp-alerting.png)

## 基本的な監視のために推奨されるアラート

アラートは堅牢な監視とオブザーバビリティのベストプラクティスの重要な側面です。アラートのメカニズムは、アラートの疲労と重要なアラートを見逃すことのバランスをとる必要があります。ここでは、ワークロードの全体的な信頼性を高めるために推奨されるアラートのいくつかを示します。組織のさまざまなチームは、インフラストラクチャとワークロードの監視を異なる視点から行うため、必要に応じてこれを拡張または変更できます。もちろん、これは包括的なリストではありません。

- コンテナノードが割り当てられたメモリ制限の 80% を超えて使用している。  
- コンテナノードが割り当てられた CPU 制限の 80% を超えて使用している。
- コンテナノードが割り当てられたディスク容量の 90% を超えて使用している。  
- 名前空間内の Pod のコンテナが割り当てられた CPU 制限の 80% を超えて使用している。
- 名前空間内の Pod のコンテナがメモリ制限の 80% を超えて使用している。
- 名前空間内の Pod のコンテナで再起動が多すぎる。
- 名前空間内の永続ボリュームがディスク容量の最大 75% を超えて使用している。
- デプロイメントに現在アクティブな Pod が実行されていない
- 名前空間内の Horizontal Pod Autoscaler (HPA) が最大容量で実行されている

上記または類似のシナリオのアラートを設定するために必要なことは、式を必要に応じて変更することです。例えば、

```
expr: |
        ((sum(irate(container_cpu_usage_seconds_total{image!="",container!="POD", namespace!="kube-sys"}[30s])) by (namespace,container,pod) /
sum(container_spec_cpu_quota{image!="",container!="POD", namespace!="kube-sys"} /
container_spec_cpu_period{image!="",container!="POD", namespace!="kube-sys"}) by (namespace,container,pod) ) * 100)  > 80
      for: 5m
```

## Amazon Managed Service for Prometheus 用 ACK コントローラー

Amazon Managed Service for Prometheus [Kubernetes 用 AWS コントローラー](https://github.com/aws-controllers-k8s/community)(ACK) コントローラーは、ワークスペース、アラートマネージャー、ルーラーリソース向けに利用できます。これにより、お客様は [カスタムリソース定義](https://kubernetes.io/docs/concepts/extend-kubernetes/api-extension/custom-resources/)(CRD) とネイティブオブジェクトやサービスを利用して、Kubernetes クラスターの外でリソースを定義することなく、サポート機能を提供しながら Prometheus を利用できます。[Amazon Managed Service for Prometheus 用 ACK コントローラー](https://aws.amazon.com/blogs/mt/introducing-the-ack-controller-for-amazon-managed-service-for-prometheus/) は、監視対象の Kubernetes クラスターから直接すべてのリソースを管理できるため、Kubernetes をワークロードの望ましい状態の「信頼できる情報源」として機能させることができます。[ACK](https://aws-controllers-k8s.github.io/community/docs/community/overview/) は、Kubernetes API を拡張し、AWS リソースを管理するために連携して機能する Kubernetes CRD とカスタムコントローラーのコレクションです。

ACK を使用して構成されたアラートルールのスニペットを以下に示します。

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

## IAM ポリシーを使用したルールへのアクセス制限

組織では、記録とアラートの要件に対して、各チームが独自のルールを作成および管理する必要があります。Amazon Managed Service for Prometheus のルール管理では、AWS Identity and Access Management(IAM)ポリシーを使用してルールへのアクセス制御が可能です。これにより、チームごとに rulegroupnamespaces によってグループ化された独自のルールとアラートのセットを制御できます。

以下の画像は、Amazon Managed Service for Prometheus のルール管理に追加された、devops と engg という 2 つのサンプルの rulegroupnamespaces を示しています。

![Recording and Alerting rule namespaces in AMP console](../../../images/AMP_rules_namespaces.png)

以下の JSON は、上記で示した devops rulegroupnamespace へのアクセスを制限するサンプル IAM ポリシーです。リソース ARN が指定されています。以下の IAM ポリシーで注目すべきアクションは、[PutRuleGroupsNamespace](https://docs.aws.amazon.com/cli/latest/reference/amp/put-rule-groups-namespace.html) と [DeleteRuleGroupsNamespace](https://docs.aws.amazon.com/cli/latest/reference/amp/delete-rule-groups-namespace.html) で、これらは AMP ワークスペースの rulegroupsnamespace の指定されたリソース ARN に制限されます。ポリシーが作成されると、必要なユーザー、グループ、ロールに割り当てることができ、必要なアクセス制御を行うことができます。IAM ポリシーのアクションは、必要なアクションと許可されたアクションに基づいて、[IAM アクセス許可](https://docs.aws.amazon.com/prometheus/latest/userguide/AMP-APIReference.html)に従って変更/制限できます。

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

以下の awscli の対話は、IAM ポリシーのリソース ARN(つまり devops rulegroupnamespace)で指定された rulegroupsnamespace へのアクセスが制限された IAM ユーザーの例を示しています。また、アクセス権のない他のリソース(つまり engg rulegroupnamespace)へのアクセスが拒否される例も示しています。

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

ルールを使用するためのユーザー権限も、[IAM ポリシー](https://docs.aws.amazon.com/prometheus/latest/userguide/AMP-alertmanager-IAM-permissions.html)(ドキュメントのサンプル)を使用して制限できます。

詳細については、お客様は [AWS ドキュメント](https://docs.aws.amazon.com/prometheus/latest/userguide/AMP-alert-manager.html) をお読みいただくか、Amazon Managed Service for Prometheus アラートマネージャーの [AWS Observability ワークショップ](https://catalog.workshops.aws/observability/ja/aws-managed-oss/amp/setup-alert-manager) をご覧ください。

追加リファレンス: [Amazon Managed Service for Prometheus Is Now Generally Available with Alert Manager and Ruler](https://aws.amazon.com/blogs/aws/amazon-managed-service-for-prometheus-is-now-generally-available-with-alert-manager-and-ruler/)

</eof>

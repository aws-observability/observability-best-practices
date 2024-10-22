# Amazon Managed Service for Prometheus Alert Manager

## はじめに

[Amazon Managed Service for Prometheus](https://aws.amazon.com/jp/prometheus/) (AMP) は、'**Recording rules**' と '**Alerting rules**' という 2 種類のルールをサポートしており、既存の Prometheus サーバーからインポートでき、定期的に評価されます。

[Alerting rules](https://prometheus.io/docs/prometheus/latest/configuration/alerting_rules/) を使用すると、お客様は [PromQL](https://prometheus.io/docs/prometheus/latest/querying/basics/) とスレッショルドに基づいてアラート条件を定義できます。アラートルールの値がスレッショルドを超えると、Amazon Managed Service for Prometheus のアラートマネージャーに通知が送信されます。このアラートマネージャーは、スタンドアロンの Prometheus のアラートマネージャーと同様の機能を提供します。アラートは、Prometheus のアラートルールがアクティブになった際の結果です。

## アラートルールファイル

Amazon Managed Service for Prometheus におけるアラートルールは、スタンドアロンの Prometheus のルールファイルと同じ形式の YAML 形式のルールファイルで定義されます。お客様は Amazon Managed Service for Prometheus ワークスペースに複数のルールファイルを持つことができます。ワークスペースとは、Prometheus メトリクスの保存とクエリを行う論理的な空間です。

ルールファイルには通常、以下のフィールドがあります。

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

サンプルのルールファイルは以下のようになります。

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

Amazon Managed Service for Prometheus のアラートマネージャーは、スタンドアロンの Prometheus のアラートマネージャー設定ファイルと同じ構造の YAML 形式の設定ファイルを使用して、受信サービスのアラートを設定します。設定ファイルは、アラートマネージャーとテンプレート作成の 2 つの主要なセクションで構成されています。

1. [template_files](https://prometheus.io/docs/prometheus/latest/configuration/template_reference/) には、`$value`、`$labels`、`$externalLabels`、`$externalURL` 変数として公開されるアラートのアノテーションとラベルのテンプレートが含まれています。`$labels` 変数にはアラートインスタンスのラベルキー/値のペアが格納されます。設定された外部ラベルは `$externalLabels` 変数でアクセスできます。`$value` 変数にはアラートインスタンスの評価値が格納されます。`.Value`、`.Labels`、`.ExternalLabels`、`.ExternalURL` には、それぞれアラート値、アラートラベル、グローバルに設定された外部ラベル、外部 URL (`--web.external-url` で設定) が含まれます。

2. [alertmanager_config](https://prometheus.io/docs/alerting/latest/configuration/) には、スタンドアロンの Prometheus のアラートマネージャー設定ファイルと同じ構造のアラートマネージャー設定が含まれています。

template_files と alertmanager_config の両方を含むサンプルのアラートマネージャー設定ファイルは次のようになります。

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

## アラート作成時の重要な側面

Amazon Managed Service for Prometheus の [Alert Manager 設定ファイル](https://docs.aws.amazon.com/ja_jp/prometheus/latest/userguide/AMP-alert-manager.html) を作成する際に注意すべき 3 つの重要な側面があります。

- **グループ化**: これは、障害や停止の影響範囲が大きく、多くのシステムに影響し、複数のアラートが同時に発生する場合に、類似のアラートを 1 つの通知にまとめるのに役立ちます。また、カテゴリー (ノードアラート、Pod アラートなど) ごとにグループ化することもできます。Alert Manager 設定ファイルの [route](https://prometheus.io/docs/alerting/latest/configuration/#route) ブロックを使用して、このグループ化を設定できます。
- **抑制**: これは、すでにアクティブで発生している類似のアラートの通知を抑制して、スパムを防ぐ方法です。[inhibit_rules](https://prometheus.io/docs/alerting/latest/configuration/#inhibit_rule) ブロックを使用して、抑制ルールを記述できます。
- **サイレンス**: メンテナンス期間や計画的な停止中など、指定された期間アラートをミュートできます。受信したアラートは、サイレンス化する前に、すべての等号または正規表現に一致するかどうかが確認されます。[PutAlertManagerSilences](https://docs.aws.amazon.com/ja_jp/prometheus/latest/userguide/AMP-APIReference.html) API を使用してサイレンスを作成できます。

## Amazon Simple Notification Service (SNS) を通じてアラートをルーティングする

現在、[Amazon Managed Service for Prometheus Alert Manager は Amazon SNS のみをレシーバーとしてサポートしています](https://docs.aws.amazon.com/ja_jp/prometheus/latest/userguide/AMP-alertmanager-receiver-AMPpermission.html)。alertmanager_config ブロックの重要なセクションは receivers で、お客様が [Amazon SNS を設定してアラートを受信できるようにします](https://docs.aws.amazon.com/ja_jp/prometheus/latest/userguide/AMP-alertmanager-receiver-config.html)。以下のセクションは、receivers ブロックのテンプレートとして使用できます。

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

Amazon SNS の設定では、明示的に上書きされない限り、以下のテンプレートがデフォルトで使用されます。

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
</somevalue></somekey></arn_of_sns_topic></aws_region>

## Amazon SNS 以外の他の宛先にアラートをルーティングする

Amazon Managed Service for Prometheus Alert Manager は、[Amazon SNS を使用して電子メール、Webhook (HTTP)、Slack、PagerDuty、OpsGenie などの他の宛先に接続できます](https://docs.aws.amazon.com/ja_jp/prometheus/latest/userguide/AMP-alertmanager-SNS-otherdestinations.html)。

- **電子メール** 通知が成功すると、Amazon SNS トピックを介して Amazon Managed Service for Prometheus Alert Manager から、アラート詳細が含まれた電子メールが宛先に受信されます。
- Amazon Managed Service for Prometheus Alert Manager は、[JSON 形式でアラートを送信できます](https://docs.aws.amazon.com/ja_jp/prometheus/latest/userguide/AMP-alertmanager-receiver-JSON.html)。そのため、Amazon SNS から AWS Lambda や Webhook 受信エンドポイントでダウンストリームで処理できます。
- **Webhook** 既存の Amazon SNS トピックを設定して、メッセージを Webhook エンドポイントに出力できます。Webhook は、アプリケーション間でイベント駆動のトリガーに基づいて HTTP 経由で交換される、シリアル化された JSON または XML 形式のメッセージです。これを使用すると、アラート、チケット発行、インシデント管理システムのための既存の [SIEM やコラボレーションツール](https://repost.aws/knowledge-center/sns-lambda-webhooks-chime-slack-teams) に連携できます。
- **Slack** 顧客は、[Slack の](https://aws.amazon.com/blogs/mt/how-to-integrate-amazon-managed-service-for-prometheus-with-slack/) メールからチャンネルへの統合機能を利用できます。この機能では、Slack が電子メールを受け取り、Slack チャンネルに転送します。または、Lambda 関数を使用して SNS 通知を Slack 用に書き換えることができます。
- **PagerDuty** `alertmanager_config` 定義の `template_files` ブロックで使用されるテンプレートをカスタマイズして、ペイロードを [PagerDuty](https://aws.amazon.com/blogs/mt/using-amazon-managed-service-for-prometheus-alert-manager-to-receive-alerts-with-pagerduty/) に Amazon SNS の宛先として送信できます。

追加リファレンス: [カスタム Alert Manager テンプレート](https://prometheus.io/blog/2016/03/03/custom-alertmanager-templates/)

## アラートのステータス

アラート ルールは、設定された閾値を超えるたびに、任意の通知サービスにアラートを送信するための条件式を定義します。ルールと式の例を以下に示します。

```
rules:
- alert: metric:alerting_rule
  expr: avg(rate(container_cpu_usage_seconds_total[5m])) > 0
  for: 2m

```

アラート式が特定の時点で 1 つ以上のベクトル要素を生成すると、そのアラートはアクティブとしてカウントされます。アラートは、アクティブ (pending | firing) または解決 (resolved) のステータスを取ります。

- **Pending**: 閾値を超えてからの経過時間が記録間隔より短い
- **Firing**: 閾値を超えてからの経過時間が記録間隔より長く、Alert Manager がアラートをルーティングしている
- **Resolved**: 閾値を超えていないため、アラートは発生していない

これは、[awscurl](https://docs.aws.amazon.com/ja_jp/prometheus/latest/userguide/AMP-compatible-APIs.html) コマンドを使用して、[ListAlerts](https://docs.aws.amazon.com/ja_jp/prometheus/latest/userguide/AMP-APIReference.html) API で Amazon Managed Service for Prometheus Alert Manager エンドポイントを照会することで手動で確認できます。サンプルリクエストを以下に示します。

```
awscurl https://aps-workspaces.us-east-1.amazonaws.com/workspaces/$WORKSPACE_ID/alertmanager/api/v2/alerts --service="aps" -H "Content-Type: application/json"
```

## Amazon Managed Grafana における Amazon Managed Service for Prometheus Alert Manager のルール

Amazon Managed Grafana (AMG) のアラート機能により、お客様は Amazon Managed Service for Prometheus Alert Manager のアラートを Amazon Managed Grafana ワークスペースから確認できるようになりました。Amazon Managed Service for Prometheus ワークスペースを使用して Prometheus メトリクスを収集しているお客様は、サービスで完全に管理された Alert Manager と Ruler 機能を利用して、アラートとレコーディングルールを設定できます。この機能により、Amazon Managed Service for Prometheus ワークスペースで設定したすべてのアラートとレコーディングルールを可視化できます。Prometheus アラートビューは、ワークスペース設定オプションタブの Grafana アラートチェックボックスをオンにすることで、Amazon Managed Grafana (AMG) コンソールで確認できます。有効にすると、以前に Grafana ダッシュボードで作成された Grafana ネイティブアラートが、Grafana ワークスペースの新しい Alerting ページに移行されます。

参考: [Announcing Prometheus Alert manager rules in Amazon Managed Grafana](https://aws.amazon.com/blogs/mt/announcing-prometheus-alertmanager-rules-in-amazon-managed-grafana/)

![Grafana での AMP アラートのリスト](../../../images/amp-alerting.png)

## ベースラインモニタリングのための推奨アラート

アラーティングは、堅牢なモニタリングとオブザーバビリティのベストプラクティスにおける重要な側面です。アラート機構は、アラート疲労とクリティカルなアラートを見逃すことのバランスを取る必要があります。以下は、ワークロードの全体的な信頼性を向上させるために推奨されるアラートの一部です。組織内の様々なチームは、インフラストラクチャとワークロードのモニタリングを異なる観点から行うため、要件やシナリオに基づいて拡張または変更される可能性があり、これは包括的なリストではありません。

- コンテナノードが割り当てられたメモリ制限 (例: 80%) を超えて使用している。
- コンテナノードが割り当てられた CPU 制限 (例: 80%) を超えて使用している。
- コンテナノードが割り当てられたディスク領域 (例: 90%) を超えて使用している。
- 名前空間内のポッドのコンテナが、割り当てられた CPU 制限 (例: 80%) を超えて使用している。
- 名前空間内のポッドのコンテナが、メモリ制限 (例: 80%) を超えて使用している。
- 名前空間内のポッドのコンテナが再起動を多く行った。
- 名前空間内の永続ボリュームが、ディスク領域 (最大 75%) を超えて使用している。
- デプロイメントで現在アクティブなポッドが実行されていない。
- 名前空間内の水平ポッドオートスケーラー (HPA) が最大容量で実行されている。

上記または同様のシナリオでアラートを設定する際の重要なことは、必要に応じて式を変更することです。例えば、

```
expr: |
        ((sum(irate(container_cpu_usage_seconds_total{image!="",container!="POD", namespace!="kube-sys"}[30s])) by (namespace,container,pod) /
sum(container_spec_cpu_quota{image!="",container!="POD", namespace!="kube-sys"} /
container_spec_cpu_period{image!="",container!="POD", namespace!="kube-sys"}) by (namespace,container,pod) ) * 100)  > 80
      for: 5m
```

## Amazon Managed Service for Prometheus 用の ACK コントローラー

Amazon Managed Service for Prometheus 用の [AWS Controller for Kubernetes](https://github.com/aws-controllers-k8s/community) (ACK) コントローラーは、Workspace、Alert Manager、Ruler リソースで利用可能です。これにより、お客様は [カスタムリソース定義](https://kubernetes.io/docs/concepts/extend-kubernetes/api-extension/custom-resources/) (CRD) とネイティブオブジェクトやサービスを利用して、Kubernetes クラスター外のリソースを定義することなく、Prometheus の機能を活用できます。[Amazon Managed Service for Prometheus 用の ACK コントローラー](https://aws.amazon.com/blogs/mt/introducing-the-ack-controller-for-amazon-managed-service-for-prometheus/) を使用すると、監視対象の Kubernetes クラスターから直接すべてのリソースを管理できるため、Kubernetes がワークロードの目的の状態の「単一の情報源」として機能します。[ACK](https://aws-controllers-k8s.github.io/community/docs/community/overview/) は、Kubernetes API を拡張し、AWS リソースを管理するために連携する一連の Kubernetes CRD とカスタムコントローラーの集合体です。

ACK を使用して設定されたアラートルールのスニペットを以下に示します。

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

組織では、さまざまなチームが自身の記録とアラート要件のためにルールを作成・管理できる必要があります。Amazon Managed Service for Prometheus のルール管理では、各チームが rulegroupnamespace でグループ化された独自のルールとアラートを制御できるように、AWS Identity and Access Management (IAM) ポリシーを使用してルールへのアクセスを制御できます。

以下の画像は、Amazon Managed Service for Prometheus のルール管理に追加された devops と engg という 2 つの rulegroupnamespace の例を示しています。

![AMP コンソールの記録とアラートのルール名前空間](../../../images/AMP_rules_namespaces.png)

以下の JSON は、指定されたリソース ARN で devops rulegroupnamespace (上記) へのアクセスを制限するサンプル IAM ポリシーです。
下記の IAM ポリシーで注目すべきアクションは、[PutRuleGroupsNamespace](https://docs.aws.amazon.com/ja_jp/cli/latest/reference/amp/put-rule-groups-namespace.html) と [DeleteRuleGroupsNamespace](https://docs.aws.amazon.com/ja_jp/cli/latest/reference/amp/delete-rule-groups-namespace.html) で、AMP ワークスペースの rulegroupsnamespace のリソース ARN に対して制限されています。
ポリシーを作成したら、必要なアクセス制御要件に応じて、任意のユーザー、グループ、ロールに割り当てることができます。
IAM ポリシーのアクションは、[IAM 権限](https://docs.aws.amazon.com/ja_jp/prometheus/latest/userguide/AMP-APIReference.html)に基づいて、必要かつ許可されるアクションに応じて変更/制限できます。

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

以下の awscli の相互作用は、IAM ポリシーでリソース ARN (devops rulegroupnamespace) を通じて rulegroupsnamespace へのアクセスが制限された IAM ユーザーの例を示しており、同じユーザーがアクセス権のない他のリソース (engg rulegroupnamespace) へのアクセスが拒否されています。

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

ユーザーのルール使用権限は、[IAM ポリシー](https://docs.aws.amazon.com/ja_jp/prometheus/latest/userguide/AMP-alertmanager-IAM-permissions.html) (ドキュメントのサンプル) を使用して制限することもできます。

詳細については、お客様は [AWS ドキュメンテーション](https://docs.aws.amazon.com/ja_jp/prometheus/latest/userguide/AMP-alert-manager.html) を読むか、Amazon Managed Service for Prometheus Alert Manager の [AWS Observability ワークショップ](https://catalog.workshops.aws/observability/en-US/aws-managed-oss/amp/setup-alert-manager) を参照できます。

追加リファレンス: [Amazon Managed Service for Prometheus Is Now Generally Available with Alert Manager and Ruler](https://aws.amazon.com/jp/blogs/news/amazon-managed-service-for-prometheus-is-now-generally-available-with-alert-manager-and-ruler/)
</eof>

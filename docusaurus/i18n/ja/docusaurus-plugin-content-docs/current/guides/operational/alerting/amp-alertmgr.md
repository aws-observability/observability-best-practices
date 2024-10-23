# Amazon Managed Service for Prometheus アラートマネージャー




## はじめに

[Amazon Managed Service for Prometheus](https://aws.amazon.com/jp/prometheus/) (AMP) は、「**Recording ルール**」と「**Alerting ルール**」という 2 種類のルールをサポートしています。
これらのルールは既存の Prometheus サーバーからインポートでき、定期的に評価されます。

[Alerting ルール](https://prometheus.io/docs/prometheus/latest/configuration/alerting_rules/) を使用すると、[PromQL](https://prometheus.io/docs/prometheus/latest/querying/basics/) としきい値に基づいてアラート条件を定義できます。
Alerting ルールの値がしきい値を超えると、Amazon Managed Service for Prometheus の Alert Manager に通知が送信されます。
これは、スタンドアロンの Prometheus の Alert Manager と同様の機能を提供します。
アラートは、Prometheus の Alerting ルールがアクティブになったときの結果です。



## アラートルールファイル

Amazon Managed Service for Prometheus のアラートルールは、スタンドアロンの Prometheus と同じ形式の YAML 形式のルールファイルで定義されます。お客様は Amazon Managed Service for Prometheus ワークスペースに複数のルールファイルを持つことができます。ワークスペースは、Prometheus メトリクスの保存とクエリに専用の論理的な空間です。

ルールファイルは通常、以下のフィールドを持ちます：

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
Groups: 定期的に順番に実行されるルールのコレクション
Name: グループの名前
Rules: グループ内のルール
Alert: アラートの名前
Expr: アラートをトリガーする式
For: アラートの式が発火状態に更新される前に閾値を超えている最小期間
Labels: アラートに付加される追加のラベル
Annotations: 説明やリンクなどの文脈的な詳細
```

サンプルのルールファイルは以下のようになります

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

Amazon Managed Service for Prometheus のアラートマネージャーは、YAML 形式の設定ファイルを使用してアラート（受信サービス用）を設定します。これは、スタンドアロンの Prometheus のアラートマネージャー設定ファイルと同じ構造です。設定ファイルは、アラートマネージャーとテンプレート作成のための 2 つの主要なセクションで構成されています。

1. [template_files](https://prometheus.io/docs/prometheus/latest/configuration/template_reference/) には、アラートのアノテーションとラベルのテンプレートが含まれており、便宜上 `$value`、`$labels`、`$externalLabels`、`$externalURL` 変数として公開されています。`$labels` 変数はアラートインスタンスのラベルのキー/値ペアを保持します。設定された外部ラベルは `$externalLabels` 変数を通じてアクセスできます。`$value` 変数はアラートインスタンスの評価された値を保持します。`.Value`、`.Labels`、`.ExternalLabels`、`.ExternalURL` はそれぞれアラート値、アラートラベル、グローバルに設定された外部ラベル、外部 URL（`--web.external-url` で設定）を含んでいます。

2. [alertmanager_config](https://prometheus.io/docs/alerting/latest/configuration/) には、スタンドアロンの Prometheus のアラートマネージャー設定ファイルと同じ構造を使用するアラートマネージャーの設定が含まれています。

template_files と alertmanager_config の両方を含むサンプルのアラートマネージャー設定ファイルは以下のようになります。

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



## アラートの重要な側面

Amazon Managed Service for Prometheus の [Alert Manager 設定ファイル](https://docs.aws.amazon.com/ja_jp/prometheus/latest/userguide/AMP-alert-manager.html) を作成する際に注意すべき 3 つの重要な側面があります。

- **グルーピング**: これは類似したアラートを 1 つの通知にまとめるのに役立ちます。障害や停止の影響範囲が大きく、多くのシステムに影響を与え、複数のアラートが同時に発生する場合に有用です。これはカテゴリー（例：ノードアラート、Pod アラート）にグループ化するためにも使用できます。Alert Manager 設定ファイルの [route](https://prometheus.io/docs/alerting/latest/configuration/#route) ブロックを使用して、このグルーピングを設定できます。

- **抑制**: これは、すでにアクティブで発生している類似のアラートのスパムを避けるために、特定の通知を抑制する方法です。[inhibit_rules](https://prometheus.io/docs/alerting/latest/configuration/#inhibit_rule) ブロックを使用して抑制ルールを記述できます。

- **サイレンシング**: アラートは、メンテナンス期間や計画的な停止時など、指定された期間中ミュートすることができます。受信したアラートは、サイレンシングする前に、すべての等価性または正規表現に一致するかどうか確認されます。[PutAlertManagerSilences](https://docs.aws.amazon.com/ja_jp/prometheus/latest/userguide/AMP-APIReference.html) API を使用してサイレンシングを作成できます。




## Amazon Simple Notification Service (SNS) を通じてアラートをルーティングする

現在、[Amazon Managed Service for Prometheus の Alert Manager は Amazon SNS をサポートしています](https://docs.aws.amazon.com/ja_jp/prometheus/latest/userguide/AMP-alertmanager-receiver-AMPpermission.html)。これが唯一のレシーバーです。alertmanager_config ブロックの重要な部分は receivers で、これにより顧客は [Amazon SNS でアラートを受信する](https://docs.aws.amazon.com/ja_jp/prometheus/latest/userguide/AMP-alertmanager-receiver-config.html)ように設定できます。以下のセクションは、receivers ブロックのテンプレートとして使用できます。

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

Amazon SNS の設定は、明示的に上書きされない限り、以下のテンプレートをデフォルトとして使用します。

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

追加の参考資料：[通知テンプレートの例](https://prometheus.io/docs/alerting/latest/notification_examples/)



## Amazon SNS 以外の宛先へのアラートのルーティング

Amazon Managed Service for Prometheus の Alert Manager は、[Amazon SNS を使用して他の宛先に接続](https://docs.aws.amazon.com/ja_jp/prometheus/latest/userguide/AMP-alertmanager-SNS-otherdestinations.html)することができます。例えば、メール、webhook (HTTP)、Slack、PageDuty、OpsGenie などです。

- **メール** 通知が成功すると、Amazon Managed Service for Prometheus Alert Manager から Amazon SNS トピックを通じてメールが送信され、アラートの詳細がターゲットの 1 つとして含まれます。
- Amazon Managed Service for Prometheus Alert Manager は、[アラートを JSON 形式で送信](https://docs.aws.amazon.com/ja_jp/prometheus/latest/userguide/AMP-alertmanager-receiver-JSON.html)できるため、Amazon SNS からダウンストリームの AWS Lambda や webhook 受信エンドポイントで処理することができます。
- **Webhook** 既存の Amazon SNS トピックを設定して、webhook エンドポイントにメッセージを出力することができます。Webhook は、イベント駆動型のトリガーに基づいてアプリケーション間で HTTP を介して交換される、シリアル化された form エンコード JSON または XML 形式のメッセージです。これを使用して、アラート、チケット発行、インシデント管理システムのために既存の [SIEM やコラボレーションツール](https://repost.aws/knowledge-center/sns-lambda-webhooks-chime-slack-teams)をフックすることができます。
- **Slack** お客様は、[Slack の](https://aws.amazon.com/blogs/mt/how-to-integrate-amazon-managed-service-for-prometheus-with-slack/)メールからチャンネルへの統合機能を利用できます。Slack はメールを受け取り、Slack チャンネルに転送することができます。または、Lambda 関数を使用して SNS 通知を Slack 用に書き換えることもできます。
- **PagerDuty** `alertmanager_config` 定義の `template_files` ブロックで使用されるテンプレートをカスタマイズして、[PagerDuty](https://aws.amazon.com/blogs/mt/using-amazon-managed-service-for-prometheus-alert-manager-to-receive-alerts-with-pagerduty/) に Amazon SNS の宛先としてペイロードを送信することができます。

追加参考資料：[カスタム Alert Manager テンプレート](https://prometheus.io/blog/2016/03/03/custom-alertmanager-templates/)



## アラートのステータス

アラートルールは、設定されたしきい値を超えた場合に任意の通知サービスにアラートを送信するための、式に基づくアラート条件を定義します。以下にルールとその式の例を示します。

```
rules:
- alert: metric:alerting_rule
  expr: avg(rate(container_cpu_usage_seconds_total[5m])) > 0
  for: 2m

```

アラート式が特定の時点で 1 つ以上のベクトル要素を生成する場合、そのアラートはアクティブとみなされます。アラートは、アクティブ（保留中 | 発火中）または解決済みのステータスを取ります。

- **保留中**: しきい値超過からの経過時間が記録間隔より短い場合
- **発火中**: しきい値超過からの経過時間が記録間隔より長く、Alert Manager がアラートをルーティングしている場合
- **解決済み**: しきい値を超えなくなったため、アラートが発火していない状態

これは、[awscurl](https://docs.aws.amazon.com/ja_jp/prometheus/latest/userguide/AMP-compatible-APIs.html) コマンドを使用して [ListAlerts](https://docs.aws.amazon.com/ja_jp/prometheus/latest/userguide/AMP-APIReference.html) API で Amazon Managed Service for Prometheus の Alert Manager エンドポイントにクエリを実行することで手動で確認できます。以下にサンプルリクエストを示します。

```
awscurl https://aps-workspaces.us-east-1.amazonaws.com/workspaces/$WORKSPACE_ID/alertmanager/api/v2/alerts --service="aps" -H "Content-Type: application/json"
```



## Amazon Managed Grafana での Amazon Managed Service for Prometheus Alert Manager ルール

Amazon Managed Grafana (AMG) のアラート機能により、お客様は Amazon Managed Grafana ワークスペースから Amazon Managed Service for Prometheus の Alert Manager アラートの可視性を得ることができます。Amazon Managed Service for Prometheus ワークスペースを使用して Prometheus メトリクスを収集しているお客様は、サービスの完全マネージド型 Alert Manager と Ruler 機能を利用して、アラートとレコーディングルールを設定します。この機能により、Amazon Managed Service for Prometheus ワークスペースで設定されたすべてのアラートとレコーディングルールを可視化できます。Prometheus アラートビューは、ワークスペース設定オプションタブで Grafana アラートのチェックボックスをオンにすることで、Amazon Managed Grafana (AMG) コンソールで表示できます。有効にすると、以前 Grafana ダッシュボードで作成されたネイティブの Grafana アラートも、Grafana ワークスペースの新しいアラートページに移行されます。

参考：[Amazon Managed Grafana での Prometheus Alert Manager ルールの発表](https://aws.amazon.com/blogs/mt/announcing-prometheus-alertmanager-rules-in-amazon-managed-grafana/)

![Grafana での AMP アラートのリスト](../../../images/amp-alerting.png)



## ベースラインモニタリングのための推奨アラート

アラートは、堅牢なモニタリングとオブザーバビリティのベストプラクティスにおける重要な側面です。アラートメカニズムは、アラート疲れと重要なアラートの見逃しの間でバランスを取る必要があります。以下は、ワークロードの全体的な信頼性を向上させるために推奨されるアラートの一部です。組織内の様々なチームが、異なる視点からインフラストラクチャとワークロードのモニタリングを行っているため、要件やシナリオに応じてこれらを拡張または変更することができます。なお、これは包括的なリストではありません。

- コンテナノードが割り当てられたメモリ制限の一定量（例：80%）以上を使用している。
- コンテナノードが割り当てられた CPU 制限の一定量（例：80%）以上を使用している。
- コンテナノードが割り当てられたディスク容量の一定量（例：90%）以上を使用している。
- 名前空間内の Pod 内のコンテナが割り当てられた CPU 制限の一定量（例：80%）以上を使用している。
- 名前空間内の Pod 内のコンテナがメモリ制限の一定量（例：80%）以上を使用している。
- 名前空間内の Pod 内のコンテナの再起動回数が多すぎる。
- 名前空間内の永続ボリュームがディスク容量の一定量（最大 75%）以上を使用している。
- デプロイメントが現在アクティブな Pod を実行していない。
- 名前空間内の Horizontal Pod Autoscaler (HPA) が最大容量で実行されている。

上記またはその他の類似シナリオのアラートを設定する際の重要なポイントは、必要に応じて式を変更することです。例えば、

```
expr: |
        ((sum(irate(container_cpu_usage_seconds_total{image!="",container!="POD", namespace!="kube-sys"}[30s])) by (namespace,container,pod) /
sum(container_spec_cpu_quota{image!="",container!="POD", namespace!="kube-sys"} /
container_spec_cpu_period{image!="",container!="POD", namespace!="kube-sys"}) by (namespace,container,pod) ) * 100)  > 80
      for: 5m
```



## Amazon Managed Service for Prometheus 用 ACK コントローラー

Amazon Managed Service for Prometheus の [AWS Controller for Kubernetes](https://github.com/aws-controllers-k8s/community) (ACK) コントローラーは、ワークスペース、アラートマネージャー、ルーラーリソースで利用可能です。これにより、お客様は Kubernetes クラスター外でリソースを定義することなく、[カスタムリソース定義](https://kubernetes.io/docs/concepts/extend-kubernetes/api-extension/custom-resources/) (CRD) とネイティブオブジェクトまたはサービスを使用して Prometheus を活用できます。[Amazon Managed Service for Prometheus 用 ACK コントローラー](https://aws.amazon.com/blogs/mt/introducing-the-ack-controller-for-amazon-managed-service-for-prometheus/) を使用すると、監視対象の Kubernetes クラスターから直接すべてのリソースを管理でき、Kubernetes をワークロードの望ましい状態の「信頼できる情報源」として機能させることができます。[ACK](https://aws-controllers-k8s.github.io/community/docs/community/overview/) は、Kubernetes API を拡張し AWS リソースを管理するために連携する Kubernetes CRD とカスタムコントローラーのコレクションです。

ACK を使用して設定されたアラートルールのスニペットを以下に示します：

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

組織では、各チームが独自のルールを作成・管理し、記録とアラートの要件に対応する必要があります。Amazon Managed Service for Prometheus のルール管理では、AWS Identity and Access Management (IAM) ポリシーを使用してルールへのアクセスを制御できるため、各チームは rulegroupnamespaces でグループ化された独自のルールとアラートのセットを管理できます。

以下の画像は、Amazon Managed Service for Prometheus のルール管理に追加された devops と engg という 2 つの rulegroupnamespaces の例を示しています。

![AMP コンソールの記録とアラートルールの名前空間](../../../images/AMP_rules_namespaces.png)

以下の JSON は、リソース ARN で指定された devops rulegroupnamespace（上記参照）へのアクセスを制限するサンプル IAM ポリシーです。以下の IAM ポリシーで注目すべきアクションは、[PutRuleGroupsNamespace](https://docs.aws.amazon.com/ja_jp/cli/latest/reference/amp/put-rule-groups-namespace.html) と [DeleteRuleGroupsNamespace](https://docs.aws.amazon.com/ja_jp/cli/latest/reference/amp/delete-rule-groups-namespace.html) で、これらは AMP ワークスペースの rulegroupsnamespace の指定されたリソース ARN に制限されています。ポリシーが作成されると、必要なアクセス制御要件に応じて、任意のユーザー、グループ、またはロールに割り当てることができます。IAM ポリシーのアクションは、必要かつ許可されるアクションに基づいて、[IAM 権限](https://docs.aws.amazon.com/ja_jp/prometheus/latest/userguide/AMP-APIReference.html) に従って必要に応じて変更/制限できます。

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

以下の AWS CLI の対話例は、IAM ポリシーでリソース ARN（つまり devops rulegroupnamespace）を通じて指定された rulegroupsnamespace へのアクセスが制限された IAM ユーザーが、アクセス権のない他のリソース（つまり engg rulegroupnamespace）へのアクセスを拒否される様子を示しています。

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

ルールを使用するユーザーの権限は、[IAM ポリシー](https://docs.aws.amazon.com/ja_jp/prometheus/latest/userguide/AMP-alertmanager-IAM-permissions.html)（ドキュメントのサンプル）を使用して制限することもできます。

詳細については、お客様は [AWS ドキュメント](https://docs.aws.amazon.com/ja_jp/prometheus/latest/userguide/AMP-alert-manager.html) を読むか、Amazon Managed Service for Prometheus Alert Manager に関する [AWS Observability ワークショップ](https://catalog.workshops.aws/observability/en-US/aws-managed-oss/amp/setup-alert-manager) を参照してください。

追加参考資料：[Amazon Managed Service for Prometheus が Alert Manager と Ruler を搭載して一般提供開始](https://aws.amazon.com/jp/blogs/news/amazon-managed-service-for-prometheus-is-now-generally-available-with-alert-manager-and-ruler/)

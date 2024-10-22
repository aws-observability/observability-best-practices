# Amazon Managed Service for Prometheus と Alert Manager を使用した Amazon EC2 の自動スケーリング

お客様は、既存の Prometheus ワークロードをクラウドに移行し、クラウドが提供するすべての機能を活用したいと考えています。AWS には、CPU やメモリ使用率などのメトリクスに基づいて [Amazon Elastic Compute Cloud (Amazon EC2)](https://aws.amazon.com/jp/pm/ec2/) インスタンスを自動的にスケールアウトできる [Amazon EC2 Auto Scaling](https://aws.amazon.com/jp/ec2/autoscaling/) などのサービスがあります。Prometheus メトリクスを使用するアプリケーションは、モニタリングスタックを置き換える必要なく、EC2 Auto Scaling に簡単に統合できます。この記事では、[Amazon Managed Service for Prometheus Alert Manager](https://aws.amazon.com/jp/prometheus/) と連携するように Amazon EC2 Auto Scaling を設定する方法を説明します。このアプローチにより、Prometheus ベースのワークロードをクラウドに移行しながら、自動スケーリングなどのサービスを活用できます。

Amazon Managed Service for Prometheus は、[PromQL](https://prometheus.io/docs/prometheus/latest/querying/basics/) を使用する [アラートルール](https://docs.aws.amazon.com/ja_jp/prometheus/latest/userguide/AMP-Ruler.html) をサポートしています。[Prometheus アラートルールのドキュメント](https://prometheus.io/docs/prometheus/latest/configuration/alerting_rules/) には、有効なアラートルールの構文と例が記載されています。同様に、Prometheus Alert Manager のドキュメントには、有効な Alert Manager 設定の [構文](https://prometheus.io/docs/prometheus/latest/configuration/template_reference/) と [例](https://prometheus.io/docs/prometheus/latest/configuration/template_examples/) が参照されています。

## ソリューションの概要

まず、Amazon EC2 Auto Scaling の [Auto Scaling グループ](https://docs.aws.amazon.com/ja_jp/autoscaling/ec2/userguide/auto-scaling-groups.html) の概念を簡単に確認しましょう。Auto Scaling グループは、Amazon EC2 インスタンスの論理的なコレクションです。Auto Scaling グループは、事前定義された起動テンプレートに基づいて EC2 インスタンスを起動できます。[起動テンプレート](https://docs.aws.amazon.com/ja_jp/AWSEC2/latest/UserGuide/ec2-launch-templates.html) には、AMI ID、インスタンスタイプ、ネットワーク設定、[AWS Identity and Access Management (IAM)](https://aws.amazon.com/jp/iam/) インスタンスプロファイルなど、Amazon EC2 インスタンスの起動に使用される情報が含まれています。

Amazon EC2 Auto Scaling グループには、[最小サイズ、最大サイズ、目的の容量](https://docs.aws.amazon.com/ja_jp/autoscaling/ec2/userguide/what-is-amazon-ec2-auto-scaling.html) の概念があります。Amazon EC2 Auto Scaling が Auto Scaling グループの現在の実行容量が目的の容量を上回るまたは下回ることを検出すると、必要に応じて自動的にスケールアウトまたはスケールインします。このスケーリングアプローチにより、ワークロードの弾力性を活用しながら、容量とコストの両方に制限を設けることができます。

このソリューションを実演するために、2 つの Amazon EC2 インスタンスを含む Amazon EC2 Auto Scaling グループを作成しました。これらのインスタンスは、[インスタンスメトリクスをリモート書き込み](https://docs.aws.amazon.com/ja_jp/prometheus/latest/userguide/AMP-onboard-ingest-metrics-remote-write-EC2.html) して Amazon Managed Service for Prometheus ワークスペースに送信します。Auto Scaling グループの最小サイズを 2 (高可用性を維持するため) に設定し、グループの最大サイズを 10 (コストを抑えるため) に設定しました。ソリューションに対するトラフィックが増えると、Amazon EC2 Auto Scaling グループの最大サイズまで、追加の Amazon EC2 インスタンスが自動的に追加されて負荷に対応します。負荷が減少すると、Amazon EC2 Auto Scaling グループが最小サイズに達するまで、それらの Amazon EC2 インスタンスが終了されます。このアプローチにより、クラウドの弾力性を活用して高性能なアプリケーションを実現できます。

スクレイピングするリソースが増えるにつれ、単一の Prometheus サーバーの能力を簡単に上回る可能性があることに注意してください。ワークロードに合わせて Prometheus サーバーを線形にスケーリングすることで、この状況を回避できます。このアプローチにより、必要な粒度でメトリクスデータを収集できるようになります。

Prometheus ワークロードの自動スケーリングをサポートするために、次のルールを含む Amazon Managed Service for Prometheus ワークスペースを作成しました。

` YAML `
```
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

このルールセットでは、`HostHighCpuLoad` と `HostLowCpuLoad` ルールを作成します。これらのアラートは、CPU 使用率が 5 分間で 60% を超えるか、30% 未満になった場合にトリガーされます。

アラートが発生すると、アラートマネージャーがメッセージを Amazon SNS トピックに転送し、`alert_type` (アラート名) と `event_type` (scale_down または scale_up) を渡します。

` YAML `
```
alertmanager_config: |
  route: 
    receiver: default_receiver
    repeat_interval: 5m
        
  receivers:
    - name: default_receiver
      sns_configs:
        - topic_arn: <ARN OF SNS TOPIC GOES HERE>
          send_resolved: false
          sigv4:
            region: us-east-1
          message: |
            alert_type: {{ .CommonLabels.alertname }}
            event_type: {{ .CommonLabels.event_type }}

```

AWS [Lambda](https://aws.amazon.com/jp/lambda/) 関数が Amazon SNS トピックを購読しています。Lambda 関数にロジックを記述し、Amazon SNS メッセージを検査して `scale_up` または `scale_down` イベントが発生するかどうかを判断します。次に、Lambda 関数が Amazon EC2 Auto Scaling グループの目的の容量を増減させます。Amazon EC2 Auto Scaling グループが容量の変更要求を検出し、Amazon EC2 インスタンスを起動または終了します。

Auto Scaling をサポートする Lambda コードは次のとおりです。

` Python `
```
import json
import boto3
import os

def lambda_handler(event, context):
    print(event)
    msg = event['Records'][0]['Sns']['Message']
    
    scale_type = ''
    if msg.find('scale_up') > -1:
        scale_type = 'scale_up'
    else:
        scale_type = 'scale_down'
    
    get_desired_instance_count(scale_type)
    
def get_desired_instance_count(scale_type):
    
    client = boto3.client('autoscaling')
    asg_name = os.environ['ASG_NAME']
    response = client.describe_auto_scaling_groups(AutoScalingGroupNames=[ asg_name])

    minSize = response['AutoScalingGroups'][0]['MinSize']
    maxSize = response['AutoScalingGroups'][0]['MaxSize']
    desiredCapacity = response['AutoScalingGroups'][0]['DesiredCapacity']
    
    if scale_type == "scale_up":
        desiredCapacity = min(desiredCapacity+1, maxSize)
    if scale_type == "scale_down":
        desiredCapacity = max(desiredCapacity - 1, minSize)
    
    print('Scale type: {}; new capacity: {}'.format(scale_type, desiredCapacity))
    response = client.set_desired_capacity(AutoScalingGroupName=asg_name, DesiredCapacity=desiredCapacity, HonorCooldown=False)

```

完全なアーキテクチャを次の図で確認できます。

![Architecture](../images/ec2-autoscaling-amp-alertmgr/as-ec2-amp-alertmanager3.png)
</arn>

## ソリューションのテスト

AWS CloudFormation テンプレートを起動して、このソリューションを自動的にプロビジョニングできます。

スタックの前提条件:

* [Amazon Virtual Private Cloud (Amazon VPC)](https://aws.amazon.com/jp/vpc/)
* 発信トラフィックを許可する AWS セキュリティグループ

Download Launch Stack Template リンクを選択して、テンプレートをダウンロードし、アカウントでセットアップします。構成プロセスの一環として、Amazon EC2 インスタンスに関連付けるサブネットとセキュリティグループを指定する必要があります。詳細は次の図を参照してください。

[## Download Launch Stack Template ](https://prometheus-autoscale.s3.amazonaws.com/prometheus-autoscale.template)

![Launch Stack](../images/ec2-autoscaling-amp-alertmgr/as-ec2-amp-alertmanager4.png)

これは CloudFormation スタックの詳細画面で、スタック名が prometheus-autoscale に設定されています。スタックパラメータには、Prometheus の Linux インストーラの URL、Prometheus の Linux Node Exporter の URL、ソリューションで使用するサブネットとセキュリティグループ、使用する AMI とインスタンスタイプ、Amazon EC2 Auto Scaling グループの最大容量が含まれます。

スタックのデプロイには約 8 分かかります。完了すると、作成された Amazon EC2 Auto Scaling グループ内に 2 つの Amazon EC2 インスタンスがデプロイされ実行されているのが確認できます。Amazon Managed Service for Prometheus Alert Manager を介してこのソリューションが自動スケーリングされることを検証するには、[AWS Systems Manager Run Command](https://docs.aws.amazon.com/ja_jp/systems-manager/latest/userguide/execute-remote-commands.html) と [AWSFIS-Run-CPU-Stress 自動化ドキュメント](https://docs.aws.amazon.com/ja_jp/fis/latest/userguide/actions-ssm-agent.html) を使用して Amazon EC2 インスタンスに負荷をかけます。

Amazon EC2 Auto Scaling グループの CPU にストレスがかかると、Alert Manager がこれらのアラートを公開し、Lambda 関数がそれに応答して Auto Scaling グループをスケールアップします。CPU 消費が減少すると、Amazon Managed Service for Prometheus ワークスペースで低 CPU アラートが発生し、Alert Manager がアラートを Amazon SNS トピックに公開し、Lambda 関数がそれに応答して Auto Scaling グループをスケールダウンします。これを次の図に示します。

![Dashboard](../images/ec2-autoscaling-amp-alertmgr/as-ec2-amp-alertmanager5.png)

Grafana ダッシュボードには、CPU が 100% にスパイクしたことを示す線があります。CPU が高い一方で、別の線はインスタンス数が 2 から 10 に増えたことを示しています。CPU が減少すると、インスタンス数はゆっくりと 2 に戻ります。

## コスト

Amazon Managed Service for Prometheus は、取り込まれたメトリクス、保存されたメトリクス、クエリされたメトリクスに基づいて課金されます。最新の価格と価格例については、[Amazon Managed Service for Prometheus の価格ページ](https://aws.amazon.com/jp/prometheus/pricing/)を参照してください。

Amazon SNS は、月間の API リクエスト数に基づいて課金されます。Amazon SNS と Lambda 間のメッセージ配信は無料ですが、Amazon SNS と Lambda 間のデータ転送量に対して課金されます。最新の [Amazon SNS の価格詳細](https://aws.amazon.com/jp/sns/pricing/)を参照してください。

Lambda は、関数の実行時間とその関数への要求数に基づいて課金されます。最新の [AWS Lambda の価格詳細](https://aws.amazon.com/jp/lambda/pricing/)を参照してください。

[Amazon EC2 Auto Scaling の使用には追加料金はかかりません](https://aws.amazon.com/jp/ec2/autoscaling/pricing/)。

## 結論

Amazon Managed Service for Prometheus、Alert Manager、Amazon SNS、Lambda を使用することで、Amazon EC2 Auto Scaling グループのスケーリング活動を制御できます。この投稿のソリューションは、既存の Prometheus ワークロードを AWS に移行しながら、Amazon EC2 Auto Scaling も活用する方法を示しています。アプリケーションへの負荷が増加すると、シームレスに需要に合わせてスケーリングします。

この例では、Amazon EC2 Auto Scaling グループは CPU に基づいてスケーリングしましたが、ワークロードからの任意の Prometheus メトリクスに対して同様のアプローチを取ることができます。このアプローチでは、スケーリングアクションを細かく制御できるため、最も事業価値をもたらすメトリクスに基づいてワークロードをスケーリングできます。

以前のブログ投稿では、[Amazon Managed Service for Prometheus Alert Manager を使用して PagerDuty でアラートを受信する方法](https://aws.amazon.com/blogs/mt/using-amazon-managed-service-for-prometheus-alert-manager-to-receive-alerts-with-pagerduty/)と、[Amazon Managed Service for Prometheus を Slack と統合する方法](https://aws.amazon.com/blogs/mt/how-to-integrate-amazon-managed-service-for-prometheus-with-slack/)を示しました。これらのソリューションは、ワークスペースからのアラートを最も有用な方法で受信する方法を示しています。

次のステップとして、Amazon Managed Service for Prometheus 用の[独自のルール設定ファイルの作成](https://docs.aws.amazon.com/ja_jp/prometheus/latest/userguide/AMP-rules-upload.html)と、独自の[アラート受信者の設定](https://docs.aws.amazon.com/ja_jp/prometheus/latest/userguide/AMP-alertmanager-receiver.html)を確認してください。さらに、Alert Manager 内で使用できるアラートルールの良い例については、[Awesome Prometheus alerts](https://awesome-prometheus-alerts.grep.to/alertmanager) をチェックしてください。

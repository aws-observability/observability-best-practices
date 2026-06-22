# Amazon Managed Service for Prometheus と Alert Manager を使用した Amazon EC2 の自動スケーリング

お客様は、既存の Prometheus ワークロードをクラウドに移行し、クラウドが提供するすべてのメリットを活用したいと考えています。AWS には [Amazon EC2 Auto Scaling](https://aws.amazon.com/ec2/autoscaling/) のようなサービスがあり、CPU やメモリ使用率などのメトリクスに基づいて [Amazon Elastic Compute Cloud (Amazon EC2)](https://aws.amazon.com/pm/ec2/) インスタンスをスケールアウトできます。Prometheus メトリクスを使用するアプリケーションは、モニタリングスタックを置き換えることなく、EC2 Auto Scaling に簡単に統合できます。この投稿では、[Amazon Managed Service for Prometheus Alert Manager](https://aws.amazon.com/prometheus/) と連携するように Amazon EC2 Auto Scaling を設定する方法を説明します。このアプローチにより、Prometheus ベースのワークロードをクラウドに移行しながら、オートスケーリングなどのサービスを活用できます。

Amazon Managed Service for Prometheus は、[PromQL](https://prometheus.io/docs/prometheus/latest/querying/basics/) を使用する[アラートルール](https://docs.aws.amazon.com/prometheus/latest/userguide/AMP-Ruler.html)のサポートを提供します。[Prometheus アラートルールのドキュメント](https://prometheus.io/docs/prometheus/latest/configuration/alerting_rules/)では、有効なアラートルールの構文と例が提供されています。同様に、Prometheus アラートマネージャーのドキュメントでは、有効なアラートマネージャー設定の[構文](https://prometheus.io/docs/prometheus/latest/configuration/template_reference/)と[例](https://prometheus.io/docs/prometheus/latest/configuration/template_examples/)の両方が参照されています。

## ソリューションの概要

まず、Amazon EC2 Auto Scaling の [Auto Scaling グループ](https://docs.aws.amazon.com/autoscaling/ec2/userguide/auto-scaling-groups.html)の概念を簡単に確認しましょう。これは Amazon EC2 インスタンスの論理的なコレクションです。Auto Scaling グループは、事前定義された起動テンプレートに基づいて EC2 インスタンスを起動できます。[起動テンプレート](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-launch-templates.html)には、AMI ID、インスタンスタイプ、ネットワーク設定、[AWS Identity and Access Management (IAM)](https://aws.amazon.com/iam/) インスタンスプロファイルなど、Amazon EC2 インスタンスを起動するために使用される情報が含まれています。

Amazon EC2 Auto Scaling グループには、[最小サイズ、最大サイズ、および希望する容量](https://docs.aws.amazon.com/autoscaling/ec2/userguide/what-is-amazon-ec2-auto-scaling.html)の概念があります。Amazon EC2 Auto Scaling は、Auto Scaling グループの現在の実行容量が希望する容量を上回っているか下回っているかを検出すると、必要に応じて自動的にスケールアウトまたはスケールインします。このスケーリングアプローチにより、容量とコストの両方に制限を設けながら、ワークロード内で弾力性を活用できます。

このソリューションを実証するために、2 つの Amazon EC2 インスタンスを含む Amazon EC2 Auto Scaling グループを作成しました。これらのインスタンスは、Amazon Managed Service for Prometheus ワークスペースに[インスタンスメトリクスをリモート書き込み](https://docs.aws.amazon.com/prometheus/latest/userguide/AMP-onboard-ingest-metrics-remote-write-EC2.html)します。Auto Scaling グループの最小サイズを 2 に設定し (高可用性を維持するため)、グループの最大サイズを 10 に設定しました (コスト管理に役立てるため)。ソリューションへのトラフィックが増加すると、Amazon EC2 Auto Scaling グループの最大サイズまで、負荷をサポートするために追加の Amazon EC2 インスタンスが自動的に追加されます。負荷が減少すると、Amazon EC2 Auto Scaling グループがグループの最小サイズに達するまで、それらの Amazon EC2 インスタンスは終了されます。このアプローチにより、クラウドの弾力性を活用してパフォーマンスの高いアプリケーションを実現できます。

より多くのリソースをスクレイピングするにつれて、単一の Prometheus サーバーの処理能力をすぐに超えてしまう可能性があることに注意してください。この状況を回避するには、ワークロードに応じて Prometheus サーバーを線形にスケーリングします。このアプローチにより、必要な粒度でメトリクスデータを収集できるようになります。

Prometheus ワークロードの Auto Scaling をサポートするために、以下のルールを使用して Amazon Managed Service for Prometheus ワークスペースを作成しました。

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

このルールセットは、 ` HostHighCpuLoad ` および a ` HostLowCpuLoad ` ルール。これらのアラートは、5 分間の期間で CPU が 60% を超える、または 30% 未満の使用率になったときにトリガーされます。

アラートを発行した後、アラートマネージャーはメッセージを Amazon SNS トピックに転送し、 ` alert_type ` (アラート名) と ` event_type ` (scale_down または scale_up)。

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

AWS [Lambda](https://aws.amazon.com/lambda/) 関数が Amazon SNS トピックにサブスクライブされています。Lambda 関数内に、Amazon SNS メッセージを検査して判断するロジックを記述しました。 ` scale_up ` または ` scale_down ` イベントが発生する必要があります。その後、Lambda 関数は Amazon EC2 Auto Scaling グループの希望容量を増減します。Amazon EC2 Auto Scaling グループは容量の変更要求を検出し、Amazon EC2 インスタンスを起動または削除します。

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

完全なアーキテクチャは次の図で確認できます。

![Architecture](../images/ec2-autoscaling-amp-alertmgr/as-ec2-amp-alertmanager3.png)

## ソリューションのテスト

AWS CloudFormation テンプレートを起動して、このソリューションを自動的にプロビジョニングできます。

スタックの前提条件

* [Amazon Virtual Private Cloud (Amazon VPC)](https://aws.amazon.com/vpc/)
* アウトバウンドトラフィックを許可する AWS Security Group

Download Launch Stack Template リンクを選択して、テンプレートをダウンロードし、アカウントに設定します。設定プロセスの一環として、Amazon EC2 インスタンスに関連付けるサブネットとセキュリティグループを指定する必要があります。詳細については、次の図を参照してください。

[## Launch Stack テンプレートをダウンロード](https://prometheus-autoscale.s3.amazonaws.com/prometheus-autoscale.template)

![Launch Stack](../images/ec2-autoscaling-amp-alertmgr/as-ec2-amp-alertmanager4.png)

これは CloudFormation スタックの詳細画面で、スタック名は prometheus-autoscale として設定されています。スタックパラメータには、Prometheus の Linux インストーラーの URL、Prometheus の Linux Node Exporter の URL、ソリューションで使用されるサブネットとセキュリティグループ、使用する AMI とインスタンスタイプ、および Amazon EC2 Auto Scaling グループの最大キャパシティが含まれています。

スタックのデプロイには約 8 分かかります。完了すると、デプロイされた 2 つの Amazon EC2 インスタンスが、作成された Amazon EC2 Auto Scaling グループ内で実行されていることが確認できます。このソリューションが Amazon Managed Service for Prometheus Alert Manager を介して自動スケールすることを検証するには、[AWS Systems Manager Run Command](https://docs.aws.amazon.com/systems-manager/latest/userguide/execute-remote-commands.html) と [AWSFIS-Run-CPU-Stress 自動化ドキュメント](https://docs.aws.amazon.com/fis/latest/userguide/actions-ssm-agent.html#awsfis-run-cpu-stress)を使用して Amazon EC2 インスタンスに負荷をかけます。

Amazon EC2 Auto Scaling グループの CPU にストレスが加わると、アラートマネージャーがこれらのアラートを発行し、Lambda 関数がそれに応答して Auto Scaling グループをスケールアップします。CPU 消費量が減少すると、Amazon Managed Service for Prometheus ワークスペースの低 CPU アラートが発火し、アラートマネージャーが Amazon SNS トピックにアラートを発行し、Lambda 関数がそれに応答して Auto Scaling グループをスケールダウンします。これを次の図に示します。

![Dashboard](../images/ec2-autoscaling-amp-alertmgr/as-ec2-amp-alertmanager5.png)

Grafana ダッシュボードには、CPU が 100% まで急上昇したことを示す線があります。CPU は高いですが、別の線はインスタンス数が 2 から 10 に増加したことを示しています。CPU が低下すると、インスタンス数はゆっくりと 2 まで減少します。

## コスト

Amazon Managed Service for Prometheus は、取り込まれたメトリクス、保存されたメトリクス、クエリされたメトリクスに基づいて料金が設定されます。最新の料金と料金例については、[Amazon Managed Service for Prometheus の料金ページ](https://aws.amazon.com/prometheus/pricing/)を参照してください。

Amazon SNS は、月間 API リクエスト数に基づいて料金が設定されています。Amazon SNS と Lambda 間のメッセージ配信は無料ですが、Amazon SNS と Lambda 間で転送されるデータ量に対しては課金されます。[最新の Amazon SNS 料金の詳細](https://aws.amazon.com/sns/pricing/)を参照してください。

Lambda の料金は、関数の実行時間と関数へのリクエスト数に基づいて計算されます。最新の [AWS Lambda 料金の詳細](https://aws.amazon.com/lambda/pricing/)を参照してください。

Amazon EC2 Auto Scaling の[使用に追加料金はかかりません](https://aws.amazon.com/ec2/autoscaling/pricing/)。

## まとめ

Amazon Managed Service for Prometheus、アラートマネージャー、Amazon SNS、および Lambda を使用することで、Amazon EC2 Auto Scaling グループのスケーリングアクティビティを制御できます。この投稿のソリューションは、既存の Prometheus ワークロードを AWS に移行しながら、Amazon EC2 Auto Scaling を活用する方法を示しています。アプリケーションへの負荷が増加すると、需要に応じてシームレスにスケーリングされます。

この例では、Amazon EC2 Auto Scaling グループは CPU に基づいてスケーリングしましたが、ワークロードからの任意の Prometheus メトリクスに対して同様のアプローチを適用できます。このアプローチにより、スケーリングアクションをきめ細かく制御できるため、最もビジネス価値を提供するメトリクスに基づいてワークロードをスケーリングできます。

以前のブログ記事では、[Amazon Managed Service for Prometheus Alert Manager を使用して PagerDuty でアラートを受信する方法](https://aws.amazon.com/blogs/mt/using-amazon-managed-service-for-prometheus-alert-manager-to-receive-alerts-with-pagerduty/)や、[Amazon Managed Service for Prometheus を Slack と統合する方法](https://aws.amazon.com/blogs/mt/how-to-integrate-amazon-managed-service-for-prometheus-with-slack/)についても説明しました。これらのソリューションは、ワークスペースからのアラートを最も有用な方法で受信する方法を示しています。

次のステップとして、Amazon Managed Service for Prometheus 用の[独自のルール設定ファイルを作成する](https://docs.aws.amazon.com/prometheus/latest/userguide/AMP-rules-upload.html)方法と、独自の[アラート受信者](https://docs.aws.amazon.com/prometheus/latest/userguide/AMP-alertmanager-receiver.html)を設定する方法を参照してください。 
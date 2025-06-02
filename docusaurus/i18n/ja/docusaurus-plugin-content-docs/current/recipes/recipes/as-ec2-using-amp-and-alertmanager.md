# Amazon Managed Service for Prometheus と Alert Manager を使用した Amazon EC2 の自動スケーリング

お客様は、既存の Prometheus ワークロードをクラウドに移行し、クラウドが提供するすべての機能を活用したいと考えています。AWS には [EC2 Auto Scaling](https://aws.amazon.com/jp/ec2/autoscaling/) のようなサービスがあり、CPU やメモリ使用率などのメトリクスに基づいて [Amazon Elastic Compute Cloud (Amazon EC2)](https://aws.amazon.com/jp/pm/ec2/) インスタンスをスケールアウトできます。Prometheus メトリクスを使用するアプリケーションは、監視スタックを置き換えることなく、EC2 Auto Scaling に簡単に統合できます。このポストでは、[Amazon Managed Service for Prometheus Alert Manager](https://aws.amazon.com/jp/prometheus/) と連携するように Amazon EC2 Auto Scaling を設定する方法を説明します。このアプローチにより、自動スケーリングなどのサービスを活用しながら、Prometheus ベースのワークロードをクラウドに移行できます。

Amazon Managed Service for Prometheus は、[PromQL](https://prometheus.io/docs/prometheus/latest/querying/basics/) を使用する[アラートルール](https://docs.aws.amazon.com/ja_jp/prometheus/latest/userguide/AMP-Ruler.html)をサポートしています。[Prometheus アラートルールのドキュメント](https://prometheus.io/docs/prometheus/latest/configuration/alerting_rules/)には、有効なアラートルールの構文と例が記載されています。同様に、Prometheus Alert Manager のドキュメントには、有効な Alert Manager 設定の[構文](https://prometheus.io/docs/prometheus/latest/configuration/template_reference/)と[例](https://prometheus.io/docs/prometheus/latest/configuration/template_examples/)が記載されています。



## ソリューション概要

まず、Amazon EC2 Auto Scaling の [Auto Scaling グループ](https://docs.aws.amazon.com/ja_jp/autoscaling/ec2/userguide/auto-scaling-groups.html) の概念について簡単に確認しましょう。Auto Scaling グループは、Amazon EC2 インスタンスの論理的なコレクションです。Auto Scaling グループは、事前に定義された起動テンプレートに基づいて EC2 インスタンスを起動できます。[起動テンプレート](https://docs.aws.amazon.com/ja_jp/AWSEC2/latest/UserGuide/ec2-launch-templates.html) には、AMI ID、インスタンスタイプ、ネットワーク設定、[AWS Identity and Access Management (IAM)](https://aws.amazon.com/jp/iam/) インスタンスプロファイルなど、Amazon EC2 インスタンスの起動に使用される情報が含まれています。

Amazon EC2 Auto Scaling グループには、[最小サイズ、最大サイズ、および希望容量](https://docs.aws.amazon.com/ja_jp/autoscaling/ec2/userguide/what-is-amazon-ec2-auto-scaling.html) の概念があります。Amazon EC2 Auto Scaling は、Auto Scaling グループの現在の実行容量が希望容量を上回るか下回ると検出すると、必要に応じて自動的にスケールアウトまたはスケールインを行います。このスケーリングアプローチにより、容量とコストの両方に制限を設けながら、ワークロード内の弾力性を活用できます。

このソリューションを実証するために、2 つの Amazon EC2 インスタンスを含む Amazon EC2 Auto Scaling グループを作成しました。これらのインスタンスは、[インスタンスメトリクスをリモートで書き込み](https://docs.aws.amazon.com/ja_jp/prometheus/latest/userguide/AMP-onboard-ingest-metrics-remote-write-EC2.html)、Amazon Managed Service for Prometheus ワークスペースに送信します。Auto Scaling グループの最小サイズを 2（高可用性を維持するため）に設定し、グループの最大サイズを 10（コストを抑制するため）に設定しました。トラフィックが増加すると、負荷をサポートするために Amazon EC2 インスタンスが Auto Scaling グループの最大サイズまで自動的に追加されます。負荷が減少すると、Auto Scaling グループがグループの最小サイズに達するまで、それらの Amazon EC2 インスタンスは終了されます。このアプローチにより、クラウドの弾力性を活用してパフォーマンスの高いアプリケーションを実現できます。

リソースのスクレイピングが増えるにつれて、単一の Prometheus サーバーの能力を簡単に超えてしまう可能性があることに注意してください。この状況を回避するには、Prometheus サーバーをワークロードに合わせて線形にスケーリングします。このアプローチにより、必要な粒度でメトリクスデータを収集できます。

Prometheus ワークロードの Auto Scaling をサポートするために、以下のルールを持つ Amazon Managed Service for Prometheus ワークスペースを作成しました：

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

このルールセットは、` HostHighCpuLoad ` と ` HostLowCpuLoad ` のルールを作成します。これらのアラートは、5 分間の CPU 使用率が 60% を超えるか、30% を下回った場合にトリガーされます。

アラートが発生すると、アラートマネージャーは ` alert_type `（アラート名）と ` event_type `（scale_down または scale_up）を含むメッセージを Amazon SNS トピックに転送します。

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

AWS [Lambda](https://aws.amazon.com/jp/lambda/) 関数が Amazon SNS トピックをサブスクライブしています。Lambda 関数には、Amazon SNS メッセージを検査して ` scale_up ` または ` scale_down ` イベントを判断するロジックを実装しています。その後、Lambda 関数は Amazon EC2 Auto Scaling グループの希望容量を増減します。Amazon EC2 Auto Scaling グループは容量の変更要求を検出し、Amazon EC2 インスタンスを起動または終了します。

Auto Scaling をサポートする Lambda コードは以下の通りです：

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

完全なアーキテクチャは以下の図で確認できます。

![Architecture](../images/ec2-autoscaling-amp-alertmgr/as-ec2-amp-alertmanager3.png)




## ソリューションのテスト

AWS CloudFormation テンプレートを起動して、このソリューションを自動的にプロビジョニングできます。

スタックの前提条件：

* [Amazon Virtual Private Cloud (Amazon VPC)](https://aws.amazon.com/jp/vpc/)
* アウトバウンドトラフィックを許可する AWS セキュリティグループ

Download Launch Stack Template リンクを選択して、アカウントでテンプレートをダウンロードしてセットアップします。設定プロセスの一部として、Amazon EC2 インスタンスに関連付けるサブネットとセキュリティグループを指定する必要があります。詳細は次の図を参照してください。

[## Download Launch Stack Template ](https://prometheus-autoscale.s3.amazonaws.com/prometheus-autoscale.template)

![Launch Stack](../images/ec2-autoscaling-amp-alertmgr/as-ec2-amp-alertmanager4.png)

これは CloudFormation スタックの詳細画面で、スタック名は prometheus-autoscale に設定されています。スタックのパラメータには、Prometheus の Linux インストーラーの URL、Prometheus の Linux Node Exporter の URL、ソリューションで使用されるサブネットとセキュリティグループ、使用する AMI とインスタンスタイプ、Amazon EC2 Auto Scaling グループの最大容量が含まれています。

スタックのデプロイには約 8 分かかります。完了すると、作成された Amazon EC2 Auto Scaling グループ内で 2 つの Amazon EC2 インスタンスがデプロイされ、実行されていることがわかります。Amazon Managed Service for Prometheus Alert Manager を介した自動スケーリングのソリューションを検証するために、[AWS Systems Manager Run Command](https://docs.aws.amazon.com/ja_jp/systems-manager/latest/userguide/execute-remote-commands.html) と [AWSFIS-Run-CPU-Stress 自動化ドキュメント](https://docs.aws.amazon.com/ja_jp/fis/latest/userguide/actions-ssm-agent.html) を使用して Amazon EC2 インスタンスに負荷をかけます。

Amazon EC2 Auto Scaling グループの CPU にストレスがかかると、Alert Manager がこれらのアラートを発行し、Lambda 関数が Auto Scaling グループをスケールアップすることで応答します。CPU 使用率が低下すると、Amazon Managed Service for Prometheus ワークスペースで CPU 低下アラートが発生し、Alert Manager がアラートを Amazon SNS トピックに発行し、Lambda 関数が Auto Scaling グループをスケールダウンすることで応答します。これは次の図で示されています。

![Dashboard](../images/ec2-autoscaling-amp-alertmgr/as-ec2-amp-alertmanager5.png)

Grafana ダッシュボードには、CPU が 100% までスパイクしたことを示す線があります。CPU が高くなっていますが、別の線はインスタンス数が 2 から 10 に段階的に増加したことを示しています。CPU が低下すると、インスタンス数は徐々に 2 まで減少します。



## コスト

Amazon Managed Service for Prometheus は、取り込まれたメトリクス、保存されたメトリクス、クエリされたメトリクスに基づいて料金が設定されています。最新の料金と料金例については、[Amazon Managed Service for Prometheus の料金ページ](https://aws.amazon.com/jp/prometheus/pricing/)をご覧ください。

Amazon SNS は、月間の API リクエスト数に基づいて料金が設定されています。Amazon SNS と Lambda 間のメッセージ配信は無料ですが、Amazon SNS と Lambda 間のデータ転送量に対して料金が発生します。[最新の Amazon SNS の料金詳細](https://aws.amazon.com/jp/sns/pricing/)をご覧ください。

Lambda は、関数の実行時間と関数へのリクエスト数に基づいて料金が設定されています。[最新の AWS Lambda の料金詳細](https://aws.amazon.com/jp/lambda/pricing/)をご覧ください。

Amazon EC2 Auto Scaling の使用には[追加料金はかかりません](https://aws.amazon.com/jp/ec2/autoscaling/pricing/)。



## まとめ

Amazon Managed Service for Prometheus、Alert Manager、Amazon SNS、Lambda を使用することで、Amazon EC2 Auto Scaling グループのスケーリングアクティビティを制御できます。このソリューションでは、Amazon EC2 Auto Scaling を活用しながら、既存の Prometheus ワークロードを AWS に移行する方法を示しています。アプリケーションの負荷が増加すると、需要に応じてシームレスにスケールします。

この例では、Amazon EC2 Auto Scaling グループは CPU に基づいてスケールしましたが、ワークロードからの任意の Prometheus メトリクスに対して同様のアプローチを取ることができます。このアプローチにより、スケーリングアクションをきめ細かく制御でき、ビジネス価値が最も高いメトリクスに基づいてワークロードをスケールできます。

以前のブログ記事では、[Amazon Managed Service for Prometheus Alert Manager を使用して PagerDuty でアラートを受信する方法](https://aws.amazon.com/blogs/mt/using-amazon-managed-service-for-prometheus-alert-manager-to-receive-alerts-with-pagerduty/) や、[Amazon Managed Service for Prometheus を Slack と統合する方法](https://aws.amazon.com/blogs/mt/how-to-integrate-amazon-managed-service-for-prometheus-with-slack/) についても説明しました。これらのソリューションは、最も有用な方法でワークスペースからアラートを受信する方法を示しています。

次のステップとして、Amazon Managed Service for Prometheus 用の[独自のルール設定ファイルを作成](https://docs.aws.amazon.com/ja_jp/prometheus/latest/userguide/AMP-rules-upload.html)し、独自の[アラートレシーバー](https://docs.aws.amazon.com/ja_jp/prometheus/latest/userguide/AMP-alertmanager-receiver.html)をセットアップする方法を確認してください。さらに、Alert Manager 内で使用できるアラートルールの優れた例については、Awesome Prometheus alerts をご覧ください。

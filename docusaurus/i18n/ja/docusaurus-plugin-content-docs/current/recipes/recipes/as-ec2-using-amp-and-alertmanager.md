# Amazon Managed Service for Prometheus とアラートマネージャーを使用した Amazon EC2 の自動スケーリング

お客様は、既存の Prometheus ワークロードをクラウドに移行し、クラウドが提供するすべての機能を活用したいと考えています。AWS には、[Amazon EC2 Auto Scaling](https://aws.amazon.com/jp/ec2/autoscaling/) のようなサービスがあり、CPU やメモリ使用率などのメトリクスに基づいて [Amazon Elastic Compute Cloud (Amazon EC2)](https://aws.amazon.com/jp/pm/ec2/) インスタンスをスケールアウトできます。Prometheus メトリクスを使用するアプリケーションは、監視スタックを置き換える必要なく、EC2 Auto Scaling に簡単に統合できます。この記事では、[Amazon Managed Service for Prometheus Alert Manager](https://aws.amazon.com/jp/prometheus/) と連携するように Amazon EC2 Auto Scaling を設定する方法を説明します。このアプローチにより、Prometheus ベースのワークロードをクラウドに移行しながら、自動スケーリングなどのサービスを活用できます。

Amazon Managed Service for Prometheus は、[PromQL](https://prometheus.io/docs/prometheus/latest/querying/basics/) を使用する[アラートルール](https://docs.aws.amazon.com/ja_jp/prometheus/latest/userguide/AMP-Ruler.html)をサポートしています。[Prometheus アラートルールのドキュメント](https://prometheus.io/docs/prometheus/latest/configuration/alerting_rules/)には、有効なアラートルールの構文と例が記載されています。同様に、Prometheus アラートマネージャーのドキュメントには、有効なアラートマネージャー設定の[構文](https://prometheus.io/docs/prometheus/latest/configuration/template_reference/)と[例](https://prometheus.io/docs/prometheus/latest/configuration/template_examples/)が記載されています。



## ソリューション概要

まず、Amazon EC2 Auto Scaling の [Auto Scaling グループ](https://docs.aws.amazon.com/ja_jp/autoscaling/ec2/userguide/auto-scaling-groups.html) の概念について簡単に確認しましょう。これは Amazon EC2 インスタンスの論理的な集合です。Auto Scaling グループは、事前に定義された起動テンプレートに基づいて EC2 インスタンスを起動できます。[起動テンプレート](https://docs.aws.amazon.com/ja_jp/AWSEC2/latest/UserGuide/ec2-launch-templates.html) には、Amazon EC2 インスタンスの起動に使用される情報が含まれており、AMI ID、インスタンスタイプ、ネットワーク設定、[AWS Identity and Access Management (IAM)](https://aws.amazon.com/jp/iam/) インスタンスプロファイルなどが含まれます。

Amazon EC2 Auto Scaling グループには、[最小サイズ、最大サイズ、希望容量](https://docs.aws.amazon.com/ja_jp/autoscaling/ec2/userguide/what-is-amazon-ec2-auto-scaling.html) の概念があります。Amazon EC2 Auto Scaling は、Auto Scaling グループの現在の実行容量が希望容量を上回るか下回ると検出すると、必要に応じて自動的にスケールアウトまたはスケールインします。このスケーリングアプローチにより、容量とコストの両方に制限を設けながら、ワークロード内の弾力性を活用できます。

このソリューションを実証するために、2 つの Amazon EC2 インスタンスを含む Amazon EC2 Auto Scaling グループを作成しました。これらのインスタンスは、[インスタンスメトリクスをリモートで書き込み](https://docs.aws.amazon.com/ja_jp/prometheus/latest/userguide/AMP-onboard-ingest-metrics-remote-write-EC2.html)、Amazon Managed Service for Prometheus ワークスペースに送信します。Auto Scaling グループの最小サイズを 2 に設定し（高可用性を維持するため）、グループの最大サイズを 10 に設定しました（コスト管理のため）。トラフィックが増加すると、負荷をサポートするために追加の Amazon EC2 インスタンスが自動的に追加され、Amazon EC2 Auto Scaling グループの最大サイズまで拡張されます。負荷が減少すると、これらの Amazon EC2 インスタンスは終了し、Amazon EC2 Auto Scaling グループがグループの最小サイズに達するまで縮小します。このアプローチにより、クラウドの弾力性を活用してパフォーマンスの高いアプリケーションを実現できます。

スクレイピングするリソースが増えるにつれて、単一の Prometheus サーバーの能力をすぐに圧倒してしまう可能性があることに注意してください。この状況を回避するには、Prometheus サーバーをワークロードに合わせて線形にスケールさせることができます。このアプローチにより、希望する粒度でメトリクスデータを収集できます。

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

このルールセットは、` HostHighCpuLoad ` と ` HostLowCpuLoad ` のルールを作成します。これらのアラートは、5 分間の CPU 使用率が 60% を超えるか 30% 未満になると発生します。

アラートが発生すると、アラートマネージャーはメッセージを Amazon SNS トピックに転送し、` alert_type `（アラート名）と ` event_type `（scale_down または scale_up）を渡します。

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

AWS [Lambda](https://aws.amazon.com/jp/lambda/) 関数が Amazon SNS トピックにサブスクライブされています。Lambda 関数には、Amazon SNS メッセージを検査して ` scale_up ` または ` scale_down ` イベントを決定するロジックを記述しました。その後、Lambda 関数は Amazon EC2 Auto Scaling グループの希望容量を増減します。Amazon EC2 Auto Scaling グループは容量の変更要求を検出し、Amazon EC2 インスタンスを起動または終了します。

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

![アーキテクチャ](../images/ec2-autoscaling-amp-alertmgr/as-ec2-amp-alertmanager3.png)



## ソリューションのテスト

AWS CloudFormation テンプレートを起動して、このソリューションを自動的にプロビジョニングできます。

スタックの前提条件：

* [Amazon Virtual Private Cloud (Amazon VPC)](https://aws.amazon.com/jp/vpc/)
* アウトバウンドトラフィックを許可する AWS セキュリティグループ

Download Launch Stack Template リンクを選択して、テンプレートをダウンロードし、アカウントでセットアップします。設定プロセスの一部として、Amazon EC2 インスタンスに関連付けるサブネットとセキュリティグループを指定する必要があります。詳細については、次の図を参照してください。

[## Download Launch Stack Template ](https://prometheus-autoscale.s3.amazonaws.com/prometheus-autoscale.template)

![Launch Stack](../images/ec2-autoscaling-amp-alertmgr/as-ec2-amp-alertmanager4.png)

これは CloudFormation スタックの詳細画面で、スタック名が prometheus-autoscale に設定されています。スタックパラメータには、Prometheus の Linux インストーラーの URL、Prometheus の Linux Node Exporter の URL、ソリューションで使用されるサブネットとセキュリティグループ、使用する AMI とインスタンスタイプ、Amazon EC2 Auto Scaling グループの最大容量が含まれています。

スタックのデプロイには約 8 分かかります。完了すると、デプロイされて実行中の 2 つの Amazon EC2 インスタンスが、作成された Amazon EC2 Auto Scaling グループ内にあることがわかります。このソリューションが Amazon Managed Service for Prometheus Alert Manager を介して自動スケーリングすることを検証するために、[AWS Systems Manager Run Command](https://docs.aws.amazon.com/ja_jp/systems-manager/latest/userguide/execute-remote-commands.html) と [AWSFIS-Run-CPU-Stress 自動化ドキュメント](https://docs.aws.amazon.com/ja_jp/fis/latest/userguide/actions-ssm-agent.html) を使用して Amazon EC2 インスタンスに負荷をかけます。

Amazon EC2 Auto Scaling グループの CPU にストレスがかかると、アラートマネージャーがこれらのアラートを発行し、Lambda 関数が Auto Scaling グループをスケールアップすることで応答します。CPU 消費が減少すると、Amazon Managed Service for Prometheus ワークスペースの低 CPU アラートが発生し、アラートマネージャーが Amazon SNS トピックにアラートを発行し、Lambda 関数が Auto Scaling グループをスケールダウンすることで応答します。これを次の図で示します。

![Dashboard](../images/ec2-autoscaling-amp-alertmgr/as-ec2-amp-alertmanager5.png)

Grafana ダッシュボードには、CPU が 100% にスパイクしたことを示す線があります。CPU が高くなっていますが、別の線はインスタンス数が 2 から 10 に段階的に増加したことを示しています。CPU が減少すると、インスタンス数はゆっくりと 2 に戻ります。



## コスト

Amazon Managed Service for Prometheus の価格は、取り込まれたメトリクス、保存されたメトリクス、クエリされたメトリクスに基づいて設定されています。最新の価格設定と価格例については、[Amazon Managed Service for Prometheus の価格ページ](https://aws.amazon.com/jp/prometheus/pricing/)をご覧ください。

Amazon SNS の価格は、月間の API リクエスト数に基づいて設定されています。Amazon SNS と Lambda 間のメッセージ配信は無料ですが、Amazon SNS と Lambda 間のデータ転送量に対して課金されます。[最新の Amazon SNS の価格詳細](https://aws.amazon.com/jp/sns/pricing/)をご覧ください。

Lambda の価格は、関数の実行時間と関数へのリクエスト数に基づいて設定されています。[最新の AWS Lambda の価格詳細](https://aws.amazon.com/jp/lambda/pricing/)をご覧ください。

Amazon EC2 Auto Scaling の使用に対する[追加料金はありません](https://aws.amazon.com/jp/ec2/autoscaling/pricing/)。



## まとめ

Amazon Managed Service for Prometheus、Alert Manager、Amazon SNS、Lambda を使用することで、Amazon EC2 Auto Scaling グループのスケーリングアクティビティを制御できます。このポストで紹介したソリューションは、既存の Prometheus ワークロードを AWS に移行しながら、Amazon EC2 Auto Scaling を活用する方法を示しています。アプリケーションの負荷が増加すると、需要に応じてシームレスにスケールします。

この例では、Amazon EC2 Auto Scaling グループは CPU に基づいてスケールしましたが、ワークロードからの任意の Prometheus メトリクスに対して同様のアプローチを取ることができます。このアプローチにより、スケーリングアクションをきめ細かく制御でき、最も大きなビジネス価値を提供するメトリクスに基づいてワークロードをスケールできます。

以前のブログ投稿では、[Amazon Managed Service for Prometheus の Alert Manager を使用して PagerDuty でアラートを受信する方法](https://aws.amazon.com/blogs/mt/using-amazon-managed-service-for-prometheus-alert-manager-to-receive-alerts-with-pagerduty/)や、[Amazon Managed Service for Prometheus を Slack と統合する方法](https://aws.amazon.com/blogs/mt/how-to-integrate-amazon-managed-service-for-prometheus-with-slack/)についても紹介しました。これらのソリューションは、ワークスペースからのアラートを最も有用な方法で受信する方法を示しています。

次のステップとして、Amazon Managed Service for Prometheus 用の[独自のルール設定ファイルを作成する方法](https://docs.aws.amazon.com/ja_jp/prometheus/latest/userguide/AMP-rules-upload.html)を確認し、独自の[アラートレシーバー](https://docs.aws.amazon.com/ja_jp/prometheus/latest/userguide/AMP-alertmanager-receiver.html)をセットアップしてください。さらに、Alert Manager 内で使用できるアラートルールの優れた例については、[Awesome Prometheus alerts](https://awesome-prometheus-alerts.grep.to/alertmanager) をチェックしてください。

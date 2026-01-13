# Internet Monitor

:::warning
	この記事の執筆時点では、[Internet Monitor](https://aws.amazon.com/blogs/aws/cloudwatch-internet-monitor-end-to-end-visibility-into-internet-performance-for-your-applications/) は CloudWatch コンソールで**プレビュー**として利用可能です。一般提供時の機能範囲は、現在ご利用いただけるものから変更される可能性があります。
:::
[ワークロードのすべての階層からテレメトリを収集する](../guides/#ワークロードのすべての階層からテレメトリを収集する)ことはベストプラクティスであり、課題となる可能性があります。しかし、ワークロードの階層とは何でしょうか？ある人にとっては、Web サーバー、アプリケーションサーバー、データベースサーバーかもしれません。また、ワークロードをフロントエンドとバックエンドとして捉える人もいるでしょう。そして、Web アプリケーションを運用している人は、[Real User Monitoring](../tools/rum)(RUM) を使用して、エンドユーザーが体験するこれらのアプリの健全性を監視できます。

しかし、クライアントとデータセンターまたはクラウドサービスプロバイダー間のトラフィックについてはどうでしょうか。また、Web ページとして提供されないため RUM を使用できないアプリケーションについてはどうでしょうか。

![Network telemetry from Internet-traversing applications](../images/internet_monitor.png)

Internet Monitor はネットワークレベルで動作し、観測されたトラフィックの健全性を評価し、[AWS の既存の知識](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-IM-inside-internet-monitor.html)と相関させて既知のインターネット問題を検出します。簡単に言えば、パフォーマンスや可用性の問題を抱えるインターネットサービスプロバイダー (ISP) が存在し、**かつ**アプリケーションがクライアント/サーバー通信にこの ISP を使用するトラフィックを持つ場合、Internet Monitor はワークロードへの影響を事前に通知できます。さらに、選択したホスティングリージョンと Content Delivery Network としての [CloudFront](https://aws.amazon.com/cloudfront/) の使用に基づいて推奨事項を提供できます[^1]。

:::tip
	Internet Monitor は、ワークロードが通過するネットワークからのトラフィックのみを評価します。たとえば、別の国の ISP が影響を受けているが、ユーザーがそのキャリアを使用していない場合、その問題を可視化することはできません。
:::

## インターネットを経由するアプリケーションのモニターを作成する

Internet Monitor の動作方法は、影響を受けた ISP から CloudFront ディストリビューションまたは VPC に送信されるトラフィックを監視することです。これにより、制御できないネットワーク問題の結果として発生するビジネス上の問題を軽減するために、アプリケーションの動作、ルーティング、またはユーザー通知に関する決定を行うことができます。

![Intersection of your workload and ISP issues](../images/internet_monitor_2.png)

:::info
	インターネットを通過するトラフィックを監視するモニターのみを作成してください。プライベートネットワーク内の 2 つのホスト間のトラフィック ([RFC1918](https://www.arin.net/reference/research/statistics/address_filters/)) などのプライベートトラフィックは、Internet Monitor を使用して監視することはできません。
:::
:::info
	該当する場合は、モバイルアプリケーションからのトラフィックを優先します。プロバイダー間をローミングしている顧客や、遠隔地にいる顧客は、認識しておくべき異なる、または予期しないエクスペリエンスを持つ可能性があります。
:::
## EventBridge と CloudWatch を通じてアクションを有効にする

観測された問題は、[EventBridge](https://aws.amazon.com/eventbridge/) を通じて公開されます。その際、ソースが識別された情報を含む[スキーマ](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-IM-EventBridge-integration.html)が使用されます。 `aws.internetmonitor`EventBridge を使用して、チケット管理システムで自動的に問題を作成したり、サポートチームに通知したり、ワークロードを変更して一部のシナリオを軽減する自動化をトリガーしたりできます。

```json
{
  "source": ["aws.internetmonitor"]
}
```

同様に、観測された都市、国、大都市圏、および地域に関する詳細なトラフィック情報は、[CloudWatch Logs](../tools/logs) で確認できます。これにより、影響を受ける顧客に対して、その地域固有の問題について事前に通知できる、高度にターゲット化されたアクションを作成できます。以下は、単一のプロバイダーに関する国レベルの観測の例です。

```json
{
    "version": 1,
    "timestamp": 1669659900,
    "clientLocation": {
        "latitude": 0,
        "longitude": 0,
        "country": "United States",
        "subdivision": "",
        "metro": "",
        "city": "",
        "countryCode": "US",
        "subdivisionCode": "",
        "asn": 00000,
        "networkName": "MY-AWESOME-ASN"
    },
    "serviceLocation": "us-east-1",
    "percentageOfTotalTraffic": 0.36,
    "bytesIn": 23,
    "bytesOut": 0,
    "clientConnectionCount": 0,
    "internetHealth": {
        "availability": {
            "experienceScore": 100,
            "percentageOfTotalTrafficImpacted": 0,
            "percentageOfClientLocationImpacted": 0
        },
        "performance": {
            "experienceScore": 100,
            "percentageOfTotalTrafficImpacted": 0,
            "percentageOfClientLocationImpacted": 0,
            "roundTripTime": {
                "p50": 71,
                "p90": 72,
                "p95": 73
            }
        }
    },
    "trafficInsights": {
        "timeToFirstByte": {
            "currentExperience": {
                "serviceName": "VPC",
                "serviceLocation": "us-east-1",
                "value": 48
            },
            "ec2": {
                "serviceName": "EC2",
                "serviceLocation": "us-east-1",
                "value": 48
            }
        }
    }
}
```

:::info
	次のような値 `percentageOfTotalTraffic` 顧客がどこからワークロードにアクセスしているかについての強力な洞察を明らかにすることができ、高度な分析に使用できます。
:::

:::warning
	Internet Monitor によって作成されたロググループには、デフォルトの保持期間として*無期限*が設定されることに注意してください。AWS はお客様の同意なしにデータを削除することはありませんので、ニーズに合った保持期間を必ず設定してください。
:::
:::info
	各モニターは、少なくとも 10 個の個別の CloudWatch メトリクスを作成します。これらは、他の運用メトリクスと同様に[アラーム](../tools/alarms)を作成するために使用する必要があります。
:::
## トラフィック最適化の提案を活用する

Internet Monitor には、最適な顧客体験を実現するためにワークロードを配置する最適な場所についてアドバイスするトラフィック最適化の推奨事項機能があります。グローバルなワークロード、またはグローバルな顧客を持つワークロードの場合、この機能は特に価値があります。 

![Internet Monitor console](../images/internet_monitor_3.png)

:::info
	トラフィック最適化の提案ビューで、現在、予測、および最低の time-to-first-byte (TTFB) 値に細心の注意を払ってください。これらの値は、他の方法では観察が困難な、潜在的に劣悪なエンドユーザーエクスペリエンスを示す可能性があります。
:::
[^1]: See [https://aws.amazon.com/blogs/aws/cloudwatch-internet-monitor-end-to-end-visibility-into-internet-performance-for-your-applications/](https://aws.amazon.com/blogs/aws/cloudwatch-internet-monitor-end-to-end-visibility-into-internet-performance-for-your-applications/) for our launch blog about this new feature.

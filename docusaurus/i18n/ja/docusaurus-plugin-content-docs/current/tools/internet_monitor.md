# Internet Monitor

:::warning
執筆時点では、[Internet Monitor](https://aws.amazon.com/jp/blogs/news/cloudwatch-internet-monitor-end-to-end-visibility-into-internet-performance-for-your-applications/) は CloudWatch コンソールで **プレビュー** として利用可能です。一般提供時の機能の範囲は、現在体験できる内容から変更される可能性があります。
:::

[ワークロードのすべての層からテレメトリを収集する](../guides/#collect-telemetry-from-all-tiers-of-your-workload) ことはベストプラクティスですが、これは課題となる場合があります。しかし、ワークロードの層とは何でしょうか？一部の場合は、Web、アプリケーション、データベースサーバーかもしれません。また、フロントエンドとバックエンドとしてワークロードを捉える人もいます。そして、Web アプリケーションを運用する人々は、[Real User Monitoring](../tools/rum)(RUM) を使用して、エンドユーザーが体験するアプリケーションの健全性を観察できます。

しかし、クライアントとデータセンターやクラウドサービスプロバイダー間のトラフィックについてはどうでしょうか？また、Web ページとして提供されず、RUM を使用できないアプリケーションについてはどうでしょうか？

![Network telemetry from Internet-traversing applications](../images/internet_monitor.png)

Internet Monitor はネットワークレベルで動作し、観測されたトラフィックの健全性を評価し、[AWS の既存の知識](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/CloudWatch-IM-inside-internet-monitor.html) と既知のインターネットの問題を相関分析します。簡単に言えば、インターネットサービスプロバイダー (ISP) にパフォーマンスや可用性の問題があり、**かつ** アプリケーションのクライアント/サーバー通信がその ISP を使用している場合、Internet Monitor はこのワークロードへの影響について事前に通知することができます。さらに、選択したホスティングリージョンと Content Delivery Network としての [CloudFront](https://aws.amazon.com/jp/cloudfront/) の使用状況に基づいて推奨事項を提供することができます[^1]。

:::tip
Internet Monitor は、ワークロードが通過するネットワークのトラフィックのみを評価します。例えば、他の国の ISP に影響が出ている場合でも、ユーザーがそのキャリアを使用していなければ、その問題を可視化することはできません。
:::



## インターネットを経由するアプリケーションのモニターを作成する

Internet Monitor は、影響を受けている ISP から CloudFront ディストリビューションまたは VPC に到達するトラフィックを監視することで動作します。これにより、ネットワークの問題によって発生するビジネス上の問題を軽減するために、アプリケーションの動作、ルーティング、またはユーザー通知に関する判断を行うことができます。

![ワークロードと ISP の問題の交差点](../images/internet_monitor_2.png)

:::info
インターネットを経由するトラフィックを監視するモニターのみを作成してください。プライベートネットワーク ([RFC1918](https://www.arin.net/reference/research/statistics/address_filters/)) 内のホスト間などのプライベートトラフィックは、Internet Monitor で監視することはできません。
:::
:::info
該当する場合は、モバイルアプリケーションからのトラフィックを優先してください。プロバイダー間をローミングしているお客様や、遠隔地にいるお客様は、異なる予期しない体験をする可能性があり、それを把握しておく必要があります。
:::



## EventBridge と CloudWatch を通じたアクションの有効化

観測された問題は、ソースが `aws.internetmonitor` として識別される [スキーマ](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/CloudWatch-IM-EventBridge-integration.html) を使用して [EventBridge](https://aws.amazon.com/jp/eventbridge/) を通じて公開されます。EventBridge を使用して、チケット管理システムに自動的に問題を作成したり、サポートチームにページングを送信したり、一部のシナリオを緩和するためにワークロードを変更する自動化をトリガーしたりすることができます。

```json
{
  "source": ["aws.internetmonitor"]
}
```

同様に、観測された都市、国、メトロ、地域のトラフィックの詳細な情報は [CloudWatch Logs](../tools/logs) で確認できます。これにより、影響を受けるお客様に対して、その地域特有の問題について事前に通知できる、非常にターゲットを絞ったアクションを作成できます。以下は、単一のプロバイダーに関する国レベルの観測の例です：

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
`percentageOfTotalTraffic` のような値は、お客様がどこからワークロードにアクセスしているかについての強力な洞察を提供し、高度な分析に使用できます。
:::

:::warning
Internet Monitor によって作成されたロググループは、デフォルトの保持期間が *無期限* に設定されることに注意してください。AWS はお客様の同意なしにデータを削除することはありませんので、必要に応じて適切な保持期間を設定してください。
:::
:::info
各モニターは少なくとも 10 個の個別の CloudWatch メトリクスを作成します。これらは、他の運用メトリクスと同様に [アラーム](../tools/alarms) を作成するために使用する必要があります。
:::



## トラフィック最適化の提案を活用する

Internet Monitor は、最高のカスタマーエクスペリエンスを実現するために、ワークロードを最適に配置する場所についてアドバイスするトラフィック最適化の推奨事項を提供します。グローバルなワークロード、またはグローバルな顧客を持つワークロードにとって、この機能は特に価値があります。

![Internet Monitor console](../images/internet_monitor_3.png)

:::info
トラフィック最適化の提案ビューでは、現在の Time-to-First-Byte (TTFB)、予測値、最低値に注目してください。これらの値は、通常では観察が難しいエンドユーザーエクスペリエンスの潜在的な問題を示す可能性があります。
:::
[^1]: この新機能についての発表ブログは [https://aws.amazon.com/jp/blogs/news/cloudwatch-internet-monitor-end-to-end-visibility-into-internet-performance-for-your-applications/](https://aws.amazon.com/jp/blogs/news/cloudwatch-internet-monitor-end-to-end-visibility-into-internet-performance-for-your-applications/) をご覧ください。

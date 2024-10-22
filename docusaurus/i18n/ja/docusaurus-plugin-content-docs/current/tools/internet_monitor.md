# インターネットモニター

warning
執筆時点では、[Internet Monitor](https://aws.amazon.com/jp/blogs/news/cloudwatch-internet-monitor-end-to-end-visibility-into-internet-performance-for-your-applications/) は CloudWatch コンソールで **プレビュー** 版として利用可能です。一般提供時の機能範囲は、現在のものと変更される可能性があります。


[ワークロードのすべての層からテレメトリを収集する](../guides/#collect-telemetry-from-all-tiers-of-your-workload) ことはベストプラクティスですが、課題もあります。しかし、ワークロードの層とは何でしょうか? 一部の人はウェブ、アプリケーション、データベースサーバーと考えるかもしれません。他の人はフロントエンドとバックエンドと捉えるかもしれません。また、Web アプリケーションを運用する人は、[Real User Monitoring](../tools/rum)(RUM) を使ってエンドユーザーが体感するアプリの健全性を監視できます。

しかし、クライアントとデータセンターやクラウドサービスプロバイダー間のトラフィックはどうでしょうか? また、Web ページとしてサービスされないため RUM を使えないアプリケーションはどうでしょうか?

![Network telemetry from Internet-traversing applications](../images/internet_monitor.png)

Internet Monitor はネットワーキングレベルで動作し、観測されたトラフィックの健全性を評価し、[既知のインターネット問題に関する AWS の知見](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/CloudWatch-IM-inside-internet-monitor.html) と相関付けます。つまり、パフォーマンスや可用性に問題のあるインターネットサービスプロバイダー (ISP) があり、かつあなたのアプリケーションのトラフィックがクライアント/サーバー通信にその ISP を使用している場合、Internet Monitor はプロアクティブにその影響をあなたに通知できます。さらに、選択したホスティングリージョンと [CloudFront](https://aws.amazon.com/jp/cloudfront/) のコンテンツデリバリーネットワークの使用状況に基づいて、推奨事項を提示します[^1]。

tip
Internet Monitor は、ワークロードが通過するネットワークのトラフィックのみを評価します。たとえば、別の国の ISP に影響があっても、ユーザーがその通信事業者を使用していない場合、その問題は可視化されません。


## インターネットを通過するアプリケーションのモニターを作成する

Internet Monitor の動作方法は、影響を受ける ISP から CloudFront ディストリビューションまたは VPC に入ってくるトラフィックを監視することです。これにより、ネットワーク問題が発生した際に、アプリケーションの動作、ルーティング、またはユーザー通知について、コントロール外の問題から生じるビジネス上の問題を軽減するための判断を下すことができます。

![ワークロードと ISP の問題の交差点](../images/internet_monitor_2.png)

info
	インターネットを通過するトラフィックを監視するモニターのみを作成してください。プライベートネットワーク ([RFC1918](https://www.arin.net/reference/research/statistics/address_filters/)) 内の 2 つのホスト間のようなプライベートトラフィックは、Internet Monitor では監視できません。

info
	該当する場合は、モバイルアプリケーションからのトラフィックを優先してください。プロバイダー間をローミングしているユーザーや、遠隔地にいるユーザーは、異なる体験をする可能性があり、それを認識する必要があります。


## EventBridge と CloudWatch を通じてアクションを有効化する

観測された問題は、ソースが `aws.internetmonitor` として識別される [スキーマ](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/CloudWatch-IM-EventBridge-integration.html) を使用して [EventBridge](https://aws.amazon.com/jp/eventbridge/) を通じて公開されます。EventBridge を使用すると、チケット管理システムで自動的に問題を作成したり、サポートチームにページングしたり、ワークロードを変更して特定のシナリオを緩和するための自動化をトリガーしたりできます。

```json
{
  "source": ["aws.internetmonitor"]
}
```

同様に、観測された都市、国、大都市圏、地域の詳細なトラフィックデータが [CloudWatch Logs](../tools/logs) に提供されます。これにより、影響を受けた顧客に対して、地域に特化した問題を積極的に通知するなど、高度にターゲットを絞ったアクションを作成できます。以下は、単一のプロバイダーに関する国レベルの観測の例です。

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

info
	`percentageOfTotalTraffic` のような値は、お客様がワークロードにアクセスする場所に関する強力な洞察を提供し、高度な分析に使用できます。


warning
	Internet Monitor によって作成されたロググループのデフォルトの保持期間は *期限なし* に設定されることに注意してください。AWS はお客様の同意なしにデータを削除することはありません。ニーズに合った保持期間を設定してください。

info
	各モニターは少なくとも 10 個の個別の CloudWatch メトリクスを作成します。これらは、他の運用メトリクスと同様に [アラーム](../tools/alarms) の作成に使用する必要があります。


## トラフィック最適化の提案を活用する

Internet Monitor には、トラフィック最適化の推奨事項があり、ワークロードを最適な場所に配置して最高のエンドユーザー体験を提供するためのアドバイスを得ることができます。グローバルなワークロードやグローバルなエンドユーザーを持つワークロードにとって、この機能は特に価値があります。

![Internet Monitor コンソール](../images/internet_monitor_3.png)

info
トラフィック最適化の提案ビューでは、現在値、予測値、最小の Time-to-First-Byte (TTFB) 値に注目してください。これらの値は、そうでなければ観測が難しい、潜在的に低いエンドユーザー体験を示す可能性があります。

[^1]: この新機能の詳細については、[https://aws.amazon.com/jp/blogs/news/cloudwatch-internet-monitor-end-to-end-visibility-into-internet-performance-for-your-applications/](https://aws.amazon.com/jp/blogs/news/cloudwatch-internet-monitor-end-to-end-visibility-into-internet-performance-for-your-applications/) の発表ブログをご覧ください。

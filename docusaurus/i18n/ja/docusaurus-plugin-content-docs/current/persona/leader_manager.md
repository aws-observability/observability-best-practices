# リーダーと経営幹部

今日のデジタルファースト経済において、ビジネスパフォーマンスと技術運用の境界線は消滅しています。
IT リーダーは、複数の面で増大する圧力に直面しています。
収益に直接影響を与えるデジタルサービス、信頼性に対する前例のない顧客の期待、技術的な回復力に左右される競争優位性、そして、より高い運用の透明性を要求する規制要件などです。
この収束により、IT リーダーは効果的なオブザーバビリティ戦略を通じて、オペレーショナルエクセレンスと具体的なビジネス価値の創造の両方を実証する必要があります。

---

これらの課題を踏まえ、組織はオブザーバビリティを技術的なオーバーヘッドとしてではなく、定量化可能なリターンを伴う戦略的投資として捉える必要があります。
IT リーダーは、オブザーバビリティへの取り組みが、顧客満足度からオペレーションコストまで、ビジネスメトリクスにどのように直接影響を与えるかを実証する必要があります。
ROI 重視のアプローチにより、オブザーバビリティのツールと実践に費やされる全ての投資が、インシデント対応時間、システムの信頼性、チームの生産性の測定可能な改善をもたらし、最終的に収益を保護・向上させることが保証されます。

古くからの経営原則「測定できないものは管理できない」は、ここで特に当てはまります。
そのため、業界のリーダーたちは、オブザーバビリティをファーストクラスの機能要件として重視しています。
リーダーとして、根本原因分析 (RCA) を加速し、平均復旧時間 (MTTR) を削減することが目標である場合、オブザーバビリティ戦略は組織の中核的なビジネス目標と優先事項と密接に結びついている必要があります。
これにより、生成されるインサイトが組織の重要業績評価指標 (KPI) の改善を直接サポートすることが保証されます。
そして、市場で最新かつ最高の AI オブザーバビリティツールに投資することではなく、組織の目標に沿ったシグナルを「測定」できることが重要なのです！



## 効果的なオブザーバビリティ戦略の構築

オブザーバビリティを具体的なビジネス成果にどのように結びつけるのでしょうか？その答えは、以下の重要な領域に焦点を当てることにあります：カスタマーエクスペリエンス、アプリケーションのパフォーマンスと信頼性、そして運用効率とコスト最適化です。オブザーバビリティを具体的なビジネス成果に結びつけるために、最も重要な側面であるカスタマーエクスペリエンスから始めましょう。

![COP305_1](../images/cop305_1.png)



#### カスタマーエクスペリエンスの測定

まず、カスタマーエクスペリエンスを測定するには、従来のシステムメトリクスを超えた取り組みが必要です。
主要な測定フレームワークとして、Service Level Objectives (SLOs) の実装をお勧めします。
SLOs は、単なるシステムメトリクスではなく、重要なエンドユーザージャーニーに基づいてサービスの可用性目標を設定します。
このカスタマー中心のアプローチにより、オブザーバビリティ戦略が最も重要なエンドユーザーエクスペリエンスに直接的に整合することを保証します。これは、すべての技術的な判断の指針となるべきものです。
ここで、お客様への保証を表す用語と、サービスの健全性を示す追跡可能な測定値について理解を深めましょう。

- Service Level Indicator (SLI) は、提供されるサービスレベルの特定の側面を定量的に測定する、慎重に定義された指標です。
- Service Level Objective (SLO) は、一定期間にわたって SLI で測定されるサービスレベルの目標値または値の範囲です。
- Service Level Agreement (SLA) は、提供を約束するサービスレベルを概説したお客様との契約です。SLA には、追加サポートや価格割引など、要件が満たされない場合の対応も詳細に記載されています。

Amazon CloudWatch [Application Signals](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/CloudWatch-Application-Monitoring-Sections.html) の導入により、AWS でネイティブに SLO を作成し監視できるようになりました。
Application Signals は CloudWatch で包括的なアプリケーションパフォーマンス監視ソリューションを提供し、SLO を APM エクスペリエンスに接続することができます。
CloudWatch で利用可能な任意のメトリクスを使用して SLO を開始できます。
これにより、現在 CloudWatch で利用可能なメトリクスを使用して簡単に開始できます。
詳細については、ブログ [Improve application reliability with effective SLOs](https://aws.amazon.com/jp/blogs/news/improve-application-reliability-with-effective-slos/) を参照してください。
顧客満足度は最も重要ですが、それはアプリケーションのパフォーマンスと信頼性に直接結びついています。
これらの重要な側面を監視し改善する方法について探っていきましょう。




#### アプリケーションのパフォーマンスと信頼性の向上
アプリケーションの信頼性は、効果的なオブザーバビリティの次の柱を形成します。これは、アプリケーションの重要な「ゴールデンシグナル」である可用性、レイテンシー、エラー、トラフィックを監視することで実現されます。これらのメトリクスは、アプリケーションの健全性とパフォーマンスを包括的に把握することができます。SLO と組み合わせることで、運用コストを最適化しながら高い信頼性を維持するための強力なフレームワークを構築できます。

![COP305_2](../images/cop305_2.png)

[Amazon Route 53 ヘルスチェック](https://docs.aws.amazon.com/ja_jp/Route53/latest/DeveloperGuide/dns-failover.html) と [CloudWatch Synthetics](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/CloudWatch_Synthetics_Canaries.html) を使用することで、アプリケーションとワークロードのパフォーマンスとランタイムの側面を監視および分析できます。また、AWS CloudWatch Synthetics を使用してオンプレミスアプリケーションの可用性と健全性を監視することもできます。

[Network Flow Monitor](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/CloudWatch-NetworkFlowMonitor.html)、[Internet Monitor](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/CloudWatch-InternetMonitor.html)、[Network Synthetic Monitor](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/what-is-network-monitor.html) が提供する [Amazon CloudWatch ネットワークとインターネット監視](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/CloudWatch-Network-Monitoring-Sections.html) 機能を使用することで、AWS でホストされているアプリケーションのネットワークとインターネットのパフォーマンスと可用性に関するデータの可視化、インサイトの取得、運用の可視性を得ることができます。

[Amazon CloudWatch Container Insights](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/ContainerInsights.html) を使用することで、コンテナ化されたアプリケーションとマイクロサービスのメトリクスとログを収集、集約、要約できます。Container Insights は、Amazon Elastic Container Service (Amazon ECS)、Amazon Elastic Kubernetes Service (Amazon EKS)、Amazon EC2 上の Kubernetes プラットフォームで利用できます。

[Amazon CloudWatch Database Insights](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/Database-Insights.html) を使用することで、Amazon Aurora MySQL、Amazon Aurora PostgreSQL、Amazon RDS for SQL Server、RDS for MySQL、RDS for PostgreSQL、RDS for Oracle、RDS for MariaDB データベースを大規模に監視およびトラブルシューティングできます。

[Amazon CloudWatch クロスアカウントオブザーバビリティ](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/CloudWatch-Unified-Cross-Account.html) を使用することで、リージョン内の複数のアカウントにまたがるアプリケーションを監視およびトラブルシューティングできます。アカウントの境界を意識することなく、リンクされたアカウントのメトリクス、ログ、トレース、Application Signals サービス、サービスレベル目標 (SLO)、Application Insights アプリケーション、インターネットモニターを検索、可視化、分析できます。

[Amazon Managed Grafana](https://docs.aws.amazon.com/ja_jp/grafana/latest/userguide/what-is-Amazon-Managed-Service-Grafana.html) を使用することで、運用データを大規模に可視化および分析できます。AWS データソースとのシームレスな統合を提供し、統合ダッシュボードを通じてチーム間のコラボレーションを可能にすることで、アプリケーションとインフラストラクチャからのメトリクス、ログ、トレースを含む複数のソースからのオブザーバビリティデータを、カスタマイズ可能な可視化に統合し、運用上の問題を迅速に特定して解決することができます。

堅牢な顧客体験とアプリケーションパフォーマンスの監視を実現したところで、次は戦略に関連するコストの最適化に注目していきましょう。




#### コストの最適化
効果的なオブザーバビリティからは、自然とコスト最適化が生まれます。多くの組織は、すべてをモニタリングするという罠に陥ります。これは「取り残される不安」(FOMO) 症候群とも呼ばれ、洞察よりもノイズを生み出す複雑でリソース集約的なシステムにつながります。重要なのは、ビジネスサービスの成功とユーザーエクスペリエンスの向上に直接関連する KPI を特定することです。成功の鍵は、戦略的なデータ収集と、何よりもオブザーバビリティの過程全体でビジネスステークホルダーを巻き込むことにあります。オブザーバビリティ戦略は、根本原因分析 (RCA) の加速、平均復旧時間 (MTTR) の短縮、そして最終的な運用コストの削減を実証可能な形で実現する必要があります。その際、ビジネスに真の影響を与えるこれらの主要メトリクスに焦点を当て続けることが重要です。

[AWS Cost Explorer](https://aws.amazon.com/jp/aws-cost-management/aws-cost-explorer/) は、使いやすいインターフェースを提供し、時間の経過とともに AWS のコストと使用状況を可視化、理解、管理することができます。Cost Explorer は、[AWS Cost and Usage Reports](https://docs.aws.amazon.com/ja_jp/cur/latest/userguide/what-is-cur.html) と詳細な請求レポートの生成に使用されるのと同じデータセットを使用します。[Amazon CloudWatch 請求アラーム](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/monitor_estimated_charges_with_cloudwatch.html)を作成することで、推定 AWS 料金を監視できます。AWS アカウントの推定料金の監視を有効にすると、推定料金が 1 日に数回計算され、メトリクスデータとして CloudWatch に送信されます。アラームは、アカウントの請求額が指定したしきい値を超えると発動します。

効果的なオブザーバビリティ戦略の主要コンポーネントを説明したところで、その実装から期待できる具体的なメリットとビジネスへの影響について見ていきましょう。



### 定量化可能な成果とビジネスへの影響

適切に実装されたオブザーバビリティ戦略は、組織全体に定量的な財務リターンと定性的な利点の両方をもたらします。
期待できる成果をいくつか見ていきましょう：




#### コスト削減
戦略的なオブザーバビリティは、直接的なコスト削減と収益保護という 2 つの経路を通じて財務的なメリットをもたらします。
MTTR の削減と予防措置によって測定される運用の改善は、インシデントコストと解決時間の削減を通じて即座にコスト削減効果を生み出します。
これらの削減効果は、労働時間の削減として定量化されるチーム効率の向上によってさらに増幅されます。
顧客生涯価値の観点から見ると、わずかな顧客維持率の改善でも、大幅な収益保護につながる可能性があります。




#### オペレーショナルの効率性
リソースの最適化により、インフラストラクチャのコストを 40% 以上削減できることがよくあります。
定型作業の自動化により手作業が不要になり、削減された作業時間と人件費を掛け合わせることで、コスト削減効果を算出できます。
これらの効率化は時間とともに積み重なり、持続的なコスト削減効果を生み出します。




#### 文化の変革とオペレーショナルエクセレンス
オブザーバビリティの真の力は、文化と運用の両方を同時に変革できる能力にあります。
自動化されたアラートの相関分析とコンテキストに基づくトラブルシューティングが即座に効率性を向上させる一方で、より深い影響は、チームの働き方とコラボレーションの方法における根本的な変化から生まれます。
セルフサービス機能は独立した問題解決を可能にし、包括的な可視性により、プロアクティブなリスク管理が実現します。
これにより、顧客満足度の向上、開発者体験の改善、セキュリティ体制の強化が相互に強化し合う好循環が生まれます。

定量化可能な成果を理解することで、組織におけるオブザーバビリティの将来への道が開かれます。
この戦略がどのように運用を変革し、長期的な成功を導くかを見ることで、まとめとしましょう。



### 前進への道のり
効果的なオブザーバビリティへの道のりは、単にツールを実装したりデータを収集したりするだけではありません。組織の運営方法、意思決定、価値提供の方法を変革することが重要です。
意味のあるメトリクスに焦点を当て、技術的な能力をビジネス成果と整合させ、自動化とセルフサービス機能によってチームを強化することで、組織はオブザーバビリティを戦略的な優位性に変えることができます。
ますますデジタル化が進む世界において、この分野を習得した組織は、顧客の期待に応え、イノベーションを推進し、持続可能な成長を達成するための準備が整うでしょう。
未来は、単にデータを収集するだけでなく、ビジネスの成功を導くための実用的な洞察に変換できる組織のものとなります。

# Synthetic テスト

Amazon CloudWatch Synthetics を使用すると、実際のユーザーがいない場合でも、顧客の視点からアプリケーションを監視できます。API と Web サイトのエクスペリエンスを継続的にテストすることで、ユーザートラフィックがない場合でも発生する断続的な問題を可視化できます。

Canary は設定可能なスクリプトであり、スケジュールに従って実行することで、API と Web サイトのエクスペリエンスを 24 時間 365 日継続的にテストできます。実際のユーザーと同じコードパスとネットワークルートをたどり、レイテンシー、ページ読み込みエラー、リンク切れ、ユーザーワークフローの中断など、予期しない動作を通知できます。

![CloudWatch Synthetics architecture](../images/synthetics0.png)

:::note
    Synthetics Canary は、所有権または権限を持つエンドポイントと API のみを監視するために使用してください。Canary の頻度設定によっては、これらのエンドポイントのトラフィックが増加する可能性があります。
:::
## はじめに

### 完全なカバレッジ

:::tip
    テスト戦略を策定する際は、Amazon VPC 内のパブリックエンドポイントと[プライベート内部エンドポイント](https://aws.amazon.com/blogs/mt/monitor-your-private-endpoints-using-cloudwatch-synthetics/)の両方を考慮してください。
:::
### 新しい Canary の記録

[CloudWatch Synthetics Recorder](https://chrome.google.com/webstore/detail/cloudwatch-synthetics-rec/bhdnlmmgiplmbcdmkkdfplenecpegfno) Chrome ブラウザプラグインを使用すると、複雑なワークフローを持つ新しい Canary テストスクリプトをゼロから素早く構築できます。記録中に実行された入力とクリックのアクションは、Canary の作成に使用できる Node.js スクリプトに変換されます。CloudWatch Synthetics Recorder の既知の制限事項は、[このページ](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch_Synthetics_Canaries_Recorder.html#CloudWatch_Synthetics_Canaries_Recorder-limitations)に記載されています。

### 集約メトリクスの表示

Canary スクリプトのフリートから収集された集計メトリクスに関する、すぐに使えるレポート機能を活用できます。CloudWatch Automatic Dashboard

![The CloudWatch Dashboard for Synthetics](../images/synthetics1.png)

## Canary の構築

### ブループリント

複数のカナリアタイプのセットアッププロセスを簡素化するには、[カナリアブループリント](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch_Synthetics_Canaries_Blueprints.html)を使用します。

![Multiple ways to create a synthetics canary](../images/synthetics2.png)

:::info
    ブループリントは、Canary の作成を開始するための便利な方法であり、シンプルなユースケースであればコードなしで対応できます。
:::
### 保守性

独自の Canary を作成する場合、それらは*ランタイムバージョン*に関連付けられます。これは、Selenium を使用する Python の特定のバージョン、または Puppeteer を使用する JavaScript の特定のバージョンになります。現在サポートされているランタイムバージョンと非推奨のランタイムバージョンのリストについては、[このページ]を参照してください。 

:::info
    [環境変数を使用](https://aws.amazon.com/blogs/mt/using-environment-variables-with-amazon-cloudwatch-synthetics/)して、Canary の実行中にアクセスできるデータを共有することで、スクリプトの保守性を向上させます。
:::

:::info
    利用可能になったら、Canary を最新のランタイムバージョンにアップグレードしてください。 
:::
### 文字列シークレット

canary をコーディングして、canary またはその環境変数の外部にある安全なシステムからシークレット (ログイン認証情報など) を取得できます。AWS Lambda から到達可能なシステムであれば、実行時に canary にシークレットを提供できる可能性があります。

:::info
    テストを実行し、AWS Secrets Manager を使用してデータベース接続の詳細、API キー、アプリケーション認証情報などのシークレットを保存することで、[機密データを保護](https://aws.amazon.com/blogs/mt/secure-monitoring-of-user-workflow-experience-using-amazon-cloudwatch-synthetics-and-aws-secrets-manager/)します。
:::
## Canary の大規模管理

### リンク切れの確認
:::info
    ウェブサイトに大量の動的コンテンツとリンクが含まれている場合、CloudWatch Synthetics を使用してウェブサイトをクロールし、[リンク切れを検出](https://aws.amazon.com/blogs/mt/cloudwatch-synthetics-to-find-broken-links-on-your-website/)して、障害の原因を特定できます。その後、障害しきい値を使用して、しきい値に違反した場合にオプションで CloudWatch アラームを作成できます。
:::
### 複数の Heartbeat URL

:::info
    単一のハートビート監視 Canary テストで[複数の URL をバッチ処理](https://aws.amazon.com/blogs/mt/simplify-your-canary-by-batching-multiple-urls-in-amazon-cloudwatch-synthetics/)することで、テストを簡素化し、コストを最適化できます。その後、Canary 実行レポートのステップサマリーで、各 URL のステータス、期間、関連するスクリーンショット、および失敗理由を確認できます。
:::
### グループで整理する

:::info
    [グループ](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch_Synthetics_Groups.html)で Canary を整理および追跡して、集約されたメトリクスを表示し、障害をより簡単に分離してドリルインできます。
:::
![Organize and track canaries in groups](../images/synthetics3.png)

:::warning
    クロスリージョングループを作成する場合、グループには Canary の*正確な*名前が必要になることに注意してください。
:::
## ランタイムオプション

### バージョンとサポート

CloudWatch Synthetics は現在、スクリプトに Node.js を使用し [Puppeteer](https://github.com/puppeteer/puppeteer) フレームワークを使用するランタイム、およびスクリプトに Python を使用し [Selenium WebDriver](https://www.selenium.dev/documentation/webdriver/) をフレームワークとして使用するランタイムをサポートしています。

:::info
    Canary には常に最新のランタイムバージョンを使用して、Synthetics ライブラリに加えられた最新の機能と更新を利用できるようにしてください。
:::
CloudWatch Synthetics は、今後 60 日以内に[非推奨となる予定のランタイムを使用している](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch_Synthetics_Canaries_Library.html#CloudWatch_Synthetics_Canaries_runtime_support) Canary がある場合、メールで通知します。

### コードサンプル

[Node.js と Puppeteer](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch_Synthetics_Canaries_Samples.html#CloudWatch_Synthetics_Canaries_Samples_nodejspup) および [Python と Selenium](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch_Synthetics_Canaries_Samples.html#CloudWatch_Synthetics_Canaries_Samples_pythonsel) の両方のコードサンプルを使用して開始します。

### Selenium のインポート

[Python と Selenium](https://aws.amazon.com/blogs/mt/create-canaries-in-python-and-selenium-using-amazon-cloudwatch-synthetics/) で Canary をゼロから作成するか、既存のスクリプトを最小限の変更でインポートして作成します。

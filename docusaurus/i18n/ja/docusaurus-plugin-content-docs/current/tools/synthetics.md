# Synthetic テスト

Amazon CloudWatch Synthetics を使用すると、実際のユーザーがいない場合でも、お客様の視点からアプリケーションを監視できます。API とウェブサイトのエクスペリエンスを継続的にテストすることで、ユーザートラフィックがない場合でも発生する断続的な問題の可視性を得ることができます。

Canary は設定可能なスクリプトで、スケジュールに従って API とウェブサイトのエクスペリエンスを 24 時間 365 日継続的にテストできます。実際のユーザーと同じコードパスとネットワークルートをたどり、レイテンシー、ページ読み込みエラー、リンク切れ、ユーザーワークフローの不具合など、予期しない動作を通知できます。

![CloudWatch Synthetics architecture](../images/synthetics0.png)

:::note
    Synthetics Canary を使用して監視するのは、所有権または許可を持つエンドポイントと API のみにしてください。Canary の頻度設定によっては、これらのエンドポイントでトラフィックが増加する可能性があります。
:::



## はじめに




### 完全なカバレッジ

:::tip
    テスト戦略を策定する際は、Amazon VPC 内のパブリックエンドポイントと[プライベートな内部エンドポイント](https://aws.amazon.com/blogs/mt/monitor-your-private-endpoints-using-cloudwatch-synthetics/)の両方を考慮してください。
:::



### 新しい Canary の記録

[CloudWatch Synthetics Recorder](https://chrome.google.com/webstore/detail/cloudwatch-synthetics-rec/bhdnlmmgiplmbcdmkkdfplenecpegfno) Chrome ブラウザプラグインを使用すると、複雑なワークフローを持つ新しい Canary テストスクリプトを一から素早く作成できます。
記録中のタイプとクリックアクションは、Canary の作成に使用できる Node.js スクリプトに変換されます。
CloudWatch Synthetics Recorder の既知の制限事項は、[このページ](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/CloudWatch_Synthetics_Canaries_Recorder.html)に記載されています。



### 集計メトリクスの表示

Canary スクリプトのフリートから収集された集計メトリクスについて、すぐに使える標準のレポートを活用します。CloudWatch 自動ダッシュボード

![The CloudWatch Dashboard for Synthetics](../images/synthetics1.png)




## Canary の構築




### ブループリント

複数の Canary タイプのセットアップを簡素化するために、[canary ブループリント](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/CloudWatch_Synthetics_Canaries_Blueprints.html) を使用します。

![Multiple ways to create a synthetics canary](../images/synthetics2.png)

:::info
    ブループリントは Canary を作成する便利な方法で、シンプルなユースケースではコードを書かずに対応できます。
:::



### 保守性

独自の Canary を作成する場合、それらは *ランタイムバージョン* に紐付けられます。これは、Selenium を使用する Python、または Puppeteer を使用する JavaScript の特定のバージョンになります。現在サポートされているランタイムバージョンと非推奨のバージョンのリストについては、[このページ] を参照してください。

:::info
    Canary の実行中にアクセスできるデータを共有するために、[環境変数を使用](https://aws.amazon.com/blogs/mt/using-environment-variables-with-amazon-cloudwatch-synthetics/) してスクリプトの保守性を向上させましょう。
:::

:::info
    利用可能な場合は、Canary を最新のランタイムバージョンにアップグレードしてください。
:::



### 文字列シークレット

Canary のコードで、Canary や環境変数の外部にある安全なシステムからシークレット（ログイン認証情報など）を取得することができます。AWS Lambda からアクセス可能なシステムであれば、実行時に Canary にシークレットを提供することができます。

:::info
AWS Secrets Manager を使用してデータベース接続の詳細、API キー、アプリケーションの認証情報などのシークレットを保存することで、テストを実行し、[機密データを保護](https://aws.amazon.com/blogs/mt/secure-monitoring-of-user-workflow-experience-using-amazon-cloudwatch-synthetics-and-aws-secrets-manager/) することができます。
:::



## Canary の大規模な管理




### リンク切れの確認
:::info
    ウェブサイトに大量の動的コンテンツとリンクが含まれている場合、CloudWatch Synthetics を使用してウェブサイトをクロールし、[リンク切れを検出](https://aws.amazon.com/blogs/mt/cloudwatch-synthetics-to-find-broken-links-on-your-website/)して、失敗の理由を見つけることができます。その後、失敗しきい値を使用して、しきい値を超えた場合に CloudWatch アラームを作成することもできます。
:::



### 複数のハートビート URL

:::info
    [複数の URL をバッチ処理](https://aws.amazon.com/blogs/mt/simplify-your-canary-by-batching-multiple-urls-in-amazon-cloudwatch-synthetics/) することで、テストを簡素化し、コストを最適化できます。単一のハートビート監視 Canary テストで、各 URL のステータス、所要時間、関連するスクリーンショット、失敗の理由を Canary 実行レポートのステップサマリーで確認できます。
:::



### グループで整理する

:::info
    [グループ](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/CloudWatch_Synthetics_Groups.html) で Canary を整理して追跡することで、集計されたメトリクスを表示し、障害の分離と詳細な調査をより簡単に行うことができます。
:::
![Organize and track canaries in groups](../images/synthetics3.png)

:::warning
    クロスリージョングループを作成する場合、グループには Canary の *正確な* 名前が必要であることに注意してください。
:::



## ランタイムオプション




### バージョンとサポート

CloudWatch Synthetics は現在、スクリプトに Node.js を使用し [Puppeteer](https://github.com/puppeteer/puppeteer) フレームワークを利用するランタイムと、スクリプトに Python を使用し [Selenium WebDriver](https://www.selenium.dev/documentation/webdriver/) をフレームワークとして利用するランタイムをサポートしています。

:::info
    Synthetics ライブラリの最新機能とアップデートを利用するために、Canary には常に最新のランタイムバージョンを使用してください。
:::
CloudWatch Synthetics は、今後 60 日以内に[廃止予定のランタイム](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/CloudWatch_Synthetics_Canaries_Library.html)を使用している Canary がある場合、メールで通知します。




### コードサンプル

[Node.js と Puppeteer](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/CloudWatch_Synthetics_Canaries_Samples.html) および [Python と Selenium](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/CloudWatch_Synthetics_Canaries_Samples.html) のコードサンプルで始めましょう。



### Selenium のインポート

[Python と Selenium](https://aws.amazon.com/blogs/mt/create-canaries-in-python-and-selenium-using-amazon-cloudwatch-synthetics/) を使用して、最小限の変更で Canary をスクラッチから作成するか、既存のスクリプトをインポートして作成します。

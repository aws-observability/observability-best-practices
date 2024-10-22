# 合成テスト

Amazon CloudWatch Synthetics を使用すると、実際のユーザーがいなくても、お客様の視点からアプリケーションを監視できます。API とウェブサイトの体験を継続的にテストすることで、ユーザートラフィックがない場合でも発生する断続的な問題を可視化できます。

Canary は設定可能なスクリプトで、API とウェブサイトの体験を 24 時間 365 日継続的にテストするために実行できます。実際のユーザーと同じコードパスとネットワークルートに従い、レイテンシ、ページロードエラー、リンク切れ、ユーザーワークフローの破損など、予期しない動作を通知します。

![CloudWatch Synthetics アーキテクチャ](../images/synthetics0.png)

note
    所有権または権限のあるエンドポイントと API のみを監視するために Synthetics Canary を使用してください。Canary の頻度設定によっては、これらのエンドポイントで増加したトラフィックが発生する可能性があります。


## はじめに

### 完全なカバレッジ

tip
テストストラテジーを開発する際は、Amazon VPC 内のパブリックエンドポイントと[プライベート内部エンドポイント](https://aws.amazon.com/blogs/mt/monitor-your-private-endpoints-using-cloudwatch-synthetics/)の両方を検討してください。


### 新しい Canary の記録

[CloudWatch Synthetics Recorder](https://chrome.google.com/webstore/detail/cloudwatch-synthetics-rec/bhdnlmmgiplmbcdmkkdfplenecpegfno) Chrome ブラウザプラグインを使用すると、複雑なワークフローを持つ新しい Canary テストスクリプトを簡単に作成できます。記録中のタイプとクリックのアクションは、Canary を作成するために使用できる Node.js スクリプトに変換されます。CloudWatch Synthetics Recorder の既知の制限事項は、[このページ](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/CloudWatch_Synthetics_Canaries_Recorder.html) に記載されています。

### 集約メトリクスの表示

Canary スクリプトのフリートから収集された集約メトリクスについて、すぐに利用できるレポートを活用できます。CloudWatch 自動ダッシュボード

![Synthetics の CloudWatch ダッシュボード](../images/synthetics1.png)

## Canary の構築

### ブループリント

[Canary ブループリント](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/CloudWatch_Synthetics_Canaries_Blueprints.html)を使用すると、複数の Canary タイプのセットアッププロセスを簡素化できます。

![Synthetics Canary を作成する複数の方法](../images/synthetics2.png)

info
ブループリントは Canary を書き始めるための便利な方法であり、コーディングなしで簡単なユースケースをカバーできます。


### 保守性

独自の Canary を作成すると、それは特定の *ランタイムバージョン* に紐付けられます。これは、Python と Selenium、または JavaScript と Puppeteer のいずれかの特定のバージョンになります。現在サポートされているランタイムバージョンと非推奨のバージョンのリストは[このページ]を参照してください。

info
    Canary の実行中にアクセスできるデータを共有するために[環境変数を使用する](https://aws.amazon.com/blogs/mt/using-environment-variables-with-amazon-cloudwatch-synthetics/)ことで、スクリプトの保守性を向上させることができます。


info
    利用可能になった最新のランタイムバージョンに Canary をアップグレードしてください。


### 文字列シークレット

Canary にログイン資格情報などのシークレットを Canary 自体や環境変数以外の安全なシステムから取得するようコーディングできます。AWS Lambda から到達可能なあらゆるシステムが、実行時に Canary にシークレットを提供する可能性があります。

info
AWS Secrets Manager を使用してデータベース接続詳細、API キー、アプリケーション資格情報などのシークレットを保管し、テストを実行し、[機密データを保護](https://aws.amazon.com/blogs/mt/secure-monitoring-of-user-workflow-experience-using-amazon-cloudwatch-synthetics-and-aws-secrets-manager/)します。


## Canary を大規模に管理する

### 壊れたリンクを確認する
info
ウェブサイトに大量の動的コンテンツとリンクが含まれている場合は、CloudWatch Synthetics を使用してウェブサイトをクロールし、[壊れたリンクを検出](https://aws.amazon.com/blogs/mt/cloudwatch-synthetics-to-find-broken-links-on-your-website/)し、障害の理由を見つけることができます。次に、障害しきい値を使用して、しきい値に違反した場合に CloudWatch アラームを作成するかどうかを選択できます。


### 複数のハートビート URL

info
[単一のハートビートモニタリング Canary テストで複数の URL をバッチ処理](https://aws.amazon.com/blogs/mt/simplify-your-canary-by-batching-multiple-urls-in-amazon-cloudwatch-synthetics/)することで、テストを簡素化し、コストを最適化できます。その後、Canary 実行レポートのステップサマリーで、各 URL のステータス、期間、関連するスクリーンショット、失敗理由を確認できます。


### グループで管理

info
[グループ](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/CloudWatch_Synthetics_Groups.html)で Canary を編成して追跡すると、集約されたメトリクスを表示したり、障害を簡単に分離して詳細を確認したりできます。

![Canary をグループで編成して追跡](/static/synthetics3.png)

warning
リージョン間のグループを作成する場合は、Canary の*正確な*名前が必要になることに注意してください。


## 実行時オプション

### バージョンとサポート

CloudWatch Synthetics は現在、スクリプトに Node.js と [Puppeteer](https://github.com/puppeteer/puppeteer) フレームワークを使用するランタイム、およびスクリプトに Python と [Selenium WebDriver](https://www.selenium.dev/documentation/webdriver/) フレームワークを使用するランタイムをサポートしています。

alert{type="info"}
Synthetics ライブラリに対する最新の機能とアップデートを利用できるよう、Canary で常に最新のランタイムバージョンを使用してください。


CloudWatch Synthetics は、今後 60 日以内に [廃止予定のランタイム](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/CloudWatch_Synthetics_Canaries_Library.html) を使用している Canary がある場合、メールで通知します。

### コードサンプル

[Node.js と Puppeteer](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/CloudWatch_Synthetics_Canaries_Samples.html) と [Python と Selenium](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/CloudWatch_Synthetics_Canaries_Samples.html) のコードサンプルを使って始めましょう。

### Selenium のインポート

[Python と Selenium](https://aws.amazon.com/blogs/mt/create-canaries-in-python-and-selenium-using-amazon-cloudwatch-synthetics/) を使って、Canary をゼロから作成するか、既存のスクリプトを最小限の変更でインポートできます。

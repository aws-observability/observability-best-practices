---
title: CloudWatch による WAF セキュリティ分析
sidebar_label: WAF セキュリティ分析
---

import RelatedEvents from '@site/src/components/RelatedEvents';

# CloudWatch による AWS WAF セキュリティ分析

## 概要

[AWS WAF](https://aws.amazon.com/waf/) は、Web ACL によって評価されたすべての Web リクエストに対して詳細な JSON ログを生成します。これらのログを [Amazon CloudWatch Logs](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/WhatIsCloudWatchLogs.html) に送信すると、3 つの補完的な分析機能が利用可能になります：アドホック調査のための [CloudWatch Logs Insights](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/AnalyzingLogData.html)、ほぼリアルタイムのアラートのための[メトリクスフィルター](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/MonitoringLogData.html)、および継続的なトップ N 脅威特定のための [Contributor Insights](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/ContributorInsights.html) です。これらの機能を組み合わせることで、Web アプリケーションの脅威を検出、調査、対応するための完全なセキュリティ運用ワークフローが構成されます。

このガイドでは、CloudWatch Logs への WAF ログ設定のベストプラクティス、効果的なセキュリティクエリの構築、自動脅威検出のためのメトリクスフィルターとアラームの作成、および Contributor Insights ルールを使用した不正なソース IP、標的となった URI、発動ルールのトップ N の継続的な特定について説明します。

## 使用するタイミング

- AWS WAF Web ACL でアプリケーションを保護しており、ブロックされたトラフィックと許可されたトラフィックのパターンを分析したい場合
- CloudWatch Logs Insights を使用して WAF ログに対するアドホックなセキュリティ調査クエリを構築する必要がある場合
- CloudWatch メトリクスフィルターとアラームを使用して、攻撃タイプ（SQLi、XSS、レート制限）に対するほぼリアルタイムのアラートが必要な場合
- Contributor Insights を使用して、不正なソース IP、標的 URI、発動ルールの継続的なトップ N の特定が必要な場合
- SOC チーム向けに CloudWatch で統合された WAF セキュリティ運用ダッシュボードを構築している場合
- Web アプリケーションの脅威を検出、調査、対応するためのセキュリティ運用ワークフローを確立したい場合

## ガイダンス

---

### CloudWatch 向け WAF ログの設定

:::warning[ロググループの命名要件]
WAF ロググループは `aws-waf-logs-` というプレフィックスが**必須**です。例：`aws-waf-logs-production`。これは AWS によって強制される命名規則であり、プレフィックスがない場合、ログ配信はサイレントに失敗します。詳細については、[CloudWatch Logs ロググループへの Web ACL トラフィックログの送信](https://docs.aws.amazon.com/waf/latest/developerguide/logging-cw-logs.html)を参照してください。
:::

CloudWatch で WAF ログを分析する前に、Web ACL から CloudWatch Logs ロググループにログを送信するように設定する必要があります。推奨されるアプローチは、[CloudWatch テレメトリ有効化ルール](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/telemetry-config-rules.html)（CloudWatch 統合データソースの一部）を使用して、アカウントおよび組織全体で WAF ログを自動的に有効にすることです。

#### CloudWatch テレメトリ有効化ルールによる WAF ログ取り込みの有効化（コンソール）

テレメトリ有効化ルールは、アカウントまたは組織内の WAF Web ACL を自動的に検出し、CloudWatch Logs へのログ配信を有効にします。これは、一貫性のあるスケーラブルな WAF ログ収集の推奨方法です。このルールは、CloudWatch Logs ログ配信がまだ設定されていない既存の Web ACL と、将来作成される新しい Web ACL の両方に対してログを有効にします。

1. [CloudWatch コンソール](https://console.aws.amazon.com/cloudwatch/)を開きます。
2. ナビゲーションペインで、**取り込み**を選択します。
3. **有効化ルール**タブを選択します。
4. **ルールの追加**を選択します。
5. **AWS WAFV2 のテレメトリを設定**を選択します。
6. **スコープの指定**画面で、**ルール名**に説明的な名前を入力します（例：`WAFv2-WebACL-TurnOnLogging-20260708-2119`）。ルール名は作成後に変更できないことに注意してください。
7. **ソースアカウントの選択**で、以下のいずれかを選択します：
   - **組織内のすべてのアカウント**：AWS Organizations 全体にルールを適用
   - **アカウントのフィルタリング**：特定のアカウントにルールを適用
8. （オプション）**データソーススコープの選択**で、タグを追加してルールが影響する Web ACL をフィルタリングします。例えば、`Environment = prod` を追加して、本番環境の Web ACL のみにログを有効にします。CloudWatch は、タグ基準に一致する既存および新しいリソースに対して自動的にテレメトリを有効にします。
9. **対象リージョン**で、このルールを適用するリージョンを選択します。ホームリージョンはデフォルトで含まれます。**すべてのリージョン**をトグルすると、オプトインした新しいリージョンが自動的に含まれます。
10. **次へ**を選択します。
11. **送信先の指定**画面で、**ロググループ名パターン**にロググループ名のパターンを入力します。パターンは `aws-waf-logs-` で始まる必要があります。柔軟性のために `<resourceId>` および `<accountId>` マクロを使用できます（例：`aws-waf-logs-<resourceId>`）。
12. **保持設定**で、新しく作成されるロググループの保持期間を選択します。同じ名前の既存のロググループがある場合、CloudWatch はその保持設定を更新しません。
13. （オプション）**ルールへのタグの割り当て**で、データソースの識別、整理、検索に役立つキーと値のペアを追加します。
14. **次へ**を選択します。
15. **データオプションの選択**画面で、**編集済みフィールド**で、ログから除外するデータフィールド（HTTP メソッド、クエリ文字列、URI パス、または単一ヘッダー）を選択します。
16. （オプション）**ログのフィルタリング**で、ログに記録する Web リクエストを制御するフィルターを追加します。複数のフィルターを追加した場合、AWS WAF は上から順に評価します。
17. **次へ**を選択します。
18. **確認と作成**画面で、スコープ、送信先、およびデータオプションを示す設定の概要を確認します。確認ページには、データソースタイプ（AWS WAFV2）、テレメトリタイプ（ログ）、ルール名、有効化ステータス、ソースアカウント、送信先ロググループ、および編集済みフィールドまたはフィルターが表示されます。
19. **ルールの作成**を選択します。

:::info[WAF に対する有効化ルールの動作]
- 作成されるロググループには常に `aws-waf-logs-` というプレフィックスが付きます（これはルールによって強制されます）
- ルールの更新は、CloudWatch Logs へのログ配信がまだ有効になっていない新しい Web ACL または既存の Web ACL にのみ影響します
- 特定のロググループ名が必要な場合は、有効化ルールを作成する前にロググループを事前に作成してください
- ルールは階層的に評価されます：組織 → OU → アカウント。上位レベルのルールがベースラインを提供し、下位レベルのルールは追加のテレメトリを追加できますが、削減することはできません
:::



---

### WAF ログ構造の理解

各 WAF ログイベントは、リクエストの詳細、ルール評価結果、およびメタデータを含む JSON オブジェクトです。主要なフィールドを理解することで、効果的なクエリの構築とメトリクスフィルターの設計が可能になります。

| フィールド | 説明 | セキュリティ上の用途 |
|---|---|---|
| `action` | ALLOW、BLOCK、CAPTCHA、CHALLENGE | 適用結果でフィルタリング |
| `httpRequest.clientIp` | リクエストのソース IP | 不正なソース IP の特定 |
| `httpRequest.country` | ジオロケーションの国コード | 地理ベースの脅威検出 |
| `httpRequest.uri` | リクエストされた URI パス | 標的にされたエンドポイントの特定 |
| `terminatingRuleId` | 評価を終了したルール | 最も頻繁に発動しているルール |
| `terminatingRuleType` | RATE_BASED、REGULAR、MANAGED_RULE_GROUP | 適用のカテゴリ |
| `ruleGroupList[].terminatingRule` | マネージドグループ内の特定のルール | マネージドルールのトリガーの詳細 |
| `labels[].name` | ルールによって適用されたラベル | イベントの分類と相関付け |
| `httpRequest.headers[]` | リクエストヘッダー（User-Agent など） | ボットとツールのフィンガープリント |
| `timestamp` | イベント時刻（エポック ms） | 時間ベースの相関付け |

完全なフィールドリファレンスについては、[Web ACL トラフィックのログフィールド](https://docs.aws.amazon.com/waf/latest/developerguide/logging-fields.html)を参照してください。

:::note
このガイドで使用されるルール ID（`SQLInjectionRule`、`XSSRule`、`GeoBlockRule`、`BlockAdminPathsRule` など）はプレースホルダーの例です。実際の `terminatingRuleId` の値は、カスタムルールの命名方法と使用しているマネージドルールグループによって異なります。AWS マネージドルールは `AWS-AWSManagedRulesSQLiRuleSet` のような名前を使用します。WAF Web ACL の設定を確認するか、セキュリティ態勢の概要クエリを実行して、環境内でアクティブなルール ID を確認してください。
:::

<details>
<summary>サンプル WAF ログイベントを表示</summary>

```json title="sample-waf-log-event.json"
{
  "timestamp": 1719936000000,
  "formatVersion": 1,
  "webaclId": "arn:aws:wafv2:us-east-1:123456789012:regional/webacl/my-webacl/abc123",
  "terminatingRuleId": "SQLInjectionRule",
  "terminatingRuleType": "REGULAR",
  "action": "BLOCK",
  "httpSourceName": "ALB",
  "httpSourceId": "123456789012-app/my-alb/abc123",
  "ruleGroupList": [],
  "rateBasedRuleList": [],
  "nonTerminatingMatchingRules": [],
  "httpRequest": {
    "clientIp": "203.0.113.42",
    "country": "US",
    "headers": [
      {"name": "host", "value": "app.example.com"},
      {"name": "user-agent", "value": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"}
    ],
    "uri": "/search?q=' OR '1'='1",
    "args": "q=' OR '1'='1",
    "httpVersion": "HTTP/1.1",
    "httpMethod": "GET",
    "requestId": "1-abc-123"
  },
  "labels": [{"name": "awswaf:managed:aws:sql-database:SQLi_Body"}]
}
```

</details>

---

### WAF セキュリティ分析のための CloudWatch Logs Insights クエリ

[CloudWatch Logs Insights](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/AnalyzingLogData.html) は、WAF イベントのアドホック調査とフォレンジック分析を可能にします。これらのクエリを使用するには、CloudWatch コンソールで `aws-waf-logs-*` ロググループを選択し、適切な時間範囲を設定してください。

:::tip
高ボリュームの本番 WAF ロググループでは、クエリコストを制御するために時間範囲を絞ってください。Logs Insights はスキャンされたデータの GB 単位で課金されます。アクティブな調査には通常 1 時間のウィンドウで十分です。
:::

#### セキュリティ態勢の概要

ブロックされたリクエストと許可されたリクエストの数をすばやくスナップショットで確認します。これは WAF 調査を開始する際に最初に実行するクエリであり、WAF が脅威を積極的にブロックしているか、またはトラフィックパターンに変化が生じているかを一目で確認できます。

```sql
fields @timestamp, action, terminatingRuleId
| stats count(*) as requestCount by action
| sort requestCount desc
```

#### ブロックされた IP のトップ：不正ソースの特定

ブロックされたリクエストを最も多く生成しているソース IP を特定します。これらは不正なアクターまたは侵害されたホストの可能性があります。このクエリを使用して IP ブロックリストを構築したり、脅威インテリジェンスフィードとクロスリファレンスして帰属分析を行ったりできます。国フィールドは、攻撃が地理的に集中しているか分散しているかを特定するのに役立ちます。

```sql
fields httpRequest.clientIp, httpRequest.country, terminatingRuleId
| filter action = "BLOCK"
| stats count(*) as blockCount by httpRequest.clientIp, httpRequest.country
| sort blockCount desc
| limit 20
```

#### SQL インジェクション攻撃の分析

SQLi の試行を詳しく調べ、正確なペイロード、ソース IP、標的 URI を確認します。`args` フィールドを調べることで、不正なアクターが使用している実際のインジェクション文字列が明らかになり、自動スキャナーなのか、アプリケーションロジックに対する標的型攻撃なのかを理解するのに役立ちます。

```sql
fields @timestamp, httpRequest.clientIp, httpRequest.uri, httpRequest.args
| filter terminatingRuleId = "SQLInjectionRule" 
    or terminatingRuleId like /(?i)sql/
| sort @timestamp desc
| limit 50
```

#### ルール有効性の分析

どのルールが最も多くのブロックを担っているかを把握し、ルール設定を検証します。単一のルールがブロックの大部分を占めている場合、それは非常に効果的なルールであるか、または誤検知が多く調査が必要な広範すぎるルールである可能性を示しています。

```sql
fields terminatingRuleId, terminatingRuleType
| filter action = "BLOCK"
| stats count(*) as triggers by terminatingRuleId, terminatingRuleType
| sort triggers desc
```

#### マネージドルールグループの詳細分析

AWS マネージドルールグループ内のどの特定のルールがブロックをトリガーしているかを確認します。これはチューニングに不可欠です。AWS マネージドルールには数十の個別ルールが含まれており、どの特定のシグネチャが発動するかを知ることで、例外を設定するかルールアクションオーバーライドを調整するかを判断できます。

```sql
fields @timestamp, httpRequest.clientIp, httpRequest.uri
| parse @message '"terminatingRule":{"ruleId":"*"' as managedRuleId
| filter terminatingRuleType = "MANAGED_RULE_GROUP"
| stats count(*) as hits by managedRuleId, terminatingRuleId
| sort hits desc
```

#### 地理的脅威分析

どの国から最も多くの不要なトラフィックが生成されているかを特定します。このデータは地理ブロックの決定に役立ち、正当なユーザーがいない地域から攻撃が発信されているかどうかを理解するのに役立ちます。そのような場合、IP レピュテーションと地理制限ルールの実装リスクが低くなります。

```sql
fields httpRequest.country, action
| filter action = "BLOCK"
| stats count(*) as blockedRequests by httpRequest.country
| sort blockedRequests desc
| limit 15
```

#### レート制限された IP：DDoS およびブルートフォース検出

レート制限された IP を検索し、潜在的な DDoS またはブルートフォースアクティビティを示します。`firstSeen` と `lastSeen` のタイムスタンプは、レート制限が短いバーストを捕捉しているのか、持続的なキャンペーンを捕捉しているのかを明らかにし、個別のルール防御に頼るのではなく永続的な IP ブロックにエスカレーションすべきかどうかの判断に影響します。

```sql
fields @timestamp, httpRequest.clientIp, httpRequest.uri
| filter terminatingRuleType = "RATE_BASED"
| stats count(*) as rateLimited, earliest(@timestamp) as firstSeen, latest(@timestamp) as lastSeen 
  by httpRequest.clientIp
| sort rateLimited desc
```

#### XSS 攻撃パターン

クロスサイトスクリプティングの試行を分析し、ペイロードパターンと標的エンドポイントを特定します。XSS 攻撃はフォーム、検索フィールド、ユーザー入力エンドポイントを標的にすることが多く、HTTP メソッドとの相関により、GET ベースの反射型 XSS と POST ベースの格納型 XSS の試行を区別するのに役立ちます。

```sql
fields @timestamp, httpRequest.clientIp, httpRequest.uri, httpRequest.httpMethod
| filter terminatingRuleId = "XSSRule"
    or @message like /(?i)xss/
| stats count(*) as attempts by httpRequest.clientIp, httpRequest.httpMethod
| sort attempts desc
```

#### 管理パスプローブの検出

不正なアクターが管理パネル、設定ファイル、機密パスをスキャンする偵察活動を検出します。パスプローブは通常、初期段階の攻撃の指標であり、特定の IP からのプローブを確認することは、不正なアクターが標的型攻撃を開始する前にアプリケーションのマッピングを行っていることを示唆します。

```sql
fields @timestamp, httpRequest.clientIp, httpRequest.uri, action
| filter httpRequest.uri like /admin/
    or httpRequest.uri like /wp-admin/
    or httpRequest.uri like /phpmyadmin/
    or httpRequest.uri like /\.env/
| stats count(*) as probeCount by httpRequest.clientIp, httpRequest.uri, action
| sort probeCount desc
```

#### ブロックレートのタイムライン：異常検出

ブロックレートの時系列を可視化して、攻撃のスパイクとキャンペーンを検出します（折れ線グラフウィジェットとして使用）。突然のステップ関数的な増加は、自動化された攻撃キャンペーンの開始を示すことが多く、一方で緩やかな増加は、新しいレートベースルールが必要なボットトラフィックの増加を示している可能性があります。

```sql
fields @timestamp, action
| filter action = "BLOCK"
| stats count(*) as blockedPerMinute by bin(5m)
| sort @timestamp asc
```

#### User-Agent 分析：ボット検出

User-Agent ヘッダーを調べて、攻撃に使用されるツールやボットをフィンガープリントします。`sqlmap`、`nikto`、`curl` などの自動化された攻撃ツールは、脅威の分類と標的型ボット制御ルールの構築に役立つ特徴的な User-Agent シグネチャを残すことがよくあります。

```sql
fields @timestamp, httpRequest.clientIp, action
| parse @message '"name":"user-agent","value":"*"' as userAgent
| filter action = "BLOCK"
| stats count(*) as requests by userAgent
| sort requests desc
| limit 20
```

#### 複数ベクトルの不正アクター

複数の異なるルールをトリガーする IP を検索し、多様な攻撃手法を実行する洗練された不正アクターを特定します。SQLi、XSS、およびパストラバーサルルールを同時にトリガーする IP は、自動化された脆弱性スキャナーを実行している可能性が高く、個別のルール防御に依存するのではなく、IP レベルでの即時ブロックが必要です。

```sql
fields httpRequest.clientIp, terminatingRuleId
| filter action = "BLOCK"
| stats count_distinct(terminatingRuleId) as rulesTriggered, 
    count(*) as totalBlocks 
  by httpRequest.clientIp
| filter rulesTriggered > 2
| sort rulesTriggered desc, totalBlocks desc
```

#### SSRF および Log4j の試行

サーバーサイドリクエストフォージェリ（SSRF）および Log4Shell の試行を検出します。これらは重大な脆弱性カテゴリです：メタデータサービス（169.254.169.254）を標的とした SSRF の試行は不正な認証情報へのアクセスにつながる可能性があり、Log4j JNDI インジェクションはパッチ未適用のサーバーでリモートコード実行を達成する可能性があります。

```sql
fields @timestamp, httpRequest.clientIp, httpRequest.uri, terminatingRuleId
| filter httpRequest.uri like /169\.254/
    or httpRequest.uri like /jndi:/
    or httpRequest.uri like /\$\{/
    or @message like /Log4JRCE/
| sort @timestamp desc
| limit 30
```

---

### ほぼリアルタイムの脅威検出のためのメトリクスフィルターとアラーム

[メトリクスフィルター](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/MonitoringLogData.html)は、WAF ログが到着するたびに数値を継続的に抽出し、CloudWatch メトリクスとして発行します。これらのメトリクスは、手動でのクエリ実行なしに、ほぼリアルタイムのアラームとダッシュボードウィジェットを実現します。

:::info[メトリクスフィルターの仕組み]
メトリクスフィルターは、各ログイベントが到着するたびに JSON パターンを照合します。パターンが一致すると、CloudWatch はカスタムメトリクスをインクリメントします。その後、[CloudWatch アラーム](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/AlarmThatSendsEmail.html)は、メトリクスがしきい値を超えたときに [Amazon SNS](https://aws.amazon.com/sns/) 通知、Lambda 関数、またはその他の自動応答をトリガーできます。
:::

#### ブロックされたリクエストの合計

全体的なブロックレートを追跡します。急激なスパイクはアクティブな攻撃を示します。これは主要な早期警告メトリクスであり、アラームと組み合わせると、WAF が通常のバックグラウンドスキャンからアクティブな攻撃の軽減に移行した際に即座に通知を提供します。

```bash
aws logs put-metric-filter \
  --log-group-name "aws-waf-logs-production" \
  --filter-name "WAFBlockedRequests" \
  --filter-pattern '{ $.action = "BLOCK" }' \
  --metric-transformations \
    metricName=BlockedRequests,\
    metricNamespace=WAF/Security,\
    metricValue=1,\
    defaultValue=0
```

**アラーム：**

```bash
aws cloudwatch put-metric-alarm \
  --alarm-name "WAF-HighBlockRate" \
  --metric-name BlockedRequests \
  --namespace WAF/Security \
  --statistic Sum \
  --period 300 \
  --threshold 100 \
  --comparison-operator GreaterThanThreshold \
  --evaluation-periods 2 \
  --alarm-actions arn:aws:sns:us-east-1:123456789012:security-alerts \
  --alarm-description "Alert when WAF blocks exceed 100 in 5 minutes"
```

#### SQL インジェクションの試行

SQLi 専用のメトリクスであり、データベース攻撃キャンペーンの検出に重要です。SQL インジェクションは最も重大な Web 攻撃ベクトルの 1 つであり、成功した場合にはデータベースへの完全な不正アクセスにつながる可能性があるため、このメトリクスでは一般的なブロックよりも低い、より高感度なアラームしきい値を設定できます。

```bash
aws logs put-metric-filter \
  --log-group-name "aws-waf-logs-production" \
  --filter-name "WAFSQLiAttempts" \
  --filter-pattern '{ $.terminatingRuleId = "SQLInjectionRule" }' \
  --metric-transformations \
    metricName=SQLiAttempts,\
    metricNamespace=WAF/Security,\
    metricValue=1,\
    defaultValue=0
```

**アラーム：**

```bash
aws cloudwatch put-metric-alarm \
  --alarm-name "WAF-SQLiAttack" \
  --metric-name SQLiAttempts \
  --namespace WAF/Security \
  --statistic Sum \
  --period 300 \
  --threshold 10 \
  --comparison-operator GreaterThanThreshold \
  --evaluation-periods 1 \
  --treat-missing-data notBreaching \
  --alarm-actions arn:aws:sns:us-east-1:123456789012:security-alerts \
  --alarm-description "SQL Injection attack detected - more than 10 attempts in 5 min"
```

#### XSS 攻撃の試行

フォームや入力フィールドへの試行を示す可能性があるクロスサイトスクリプティング攻撃を追跡します。持続的な XSS のスパイクは、不正アクターが格納型 XSS の脆弱性を探っていることと相関しており、悪意のあるコンテンツがレンダリングされた場合に他のユーザーのセッションを侵害する可能性があります。

```bash
aws logs put-metric-filter \
  --log-group-name "aws-waf-logs-production" \
  --filter-name "WAFXSSAttempts" \
  --filter-pattern '{ $.terminatingRuleId = "XSSRule" }' \
  --metric-transformations \
    metricName=XSSAttempts,\
    metricNamespace=WAF/Security,\
    metricValue=1,\
    defaultValue=0
```

#### レート制限されたリクエスト

DDoS の試行やブルートフォース攻撃を示すレート制限のアクティビティを監視します。レート制限されたリクエストの持続的な増加は、レートしきい値がオリジンを正しく保護していることを示しますが、ボリュームが増加し続ける場合は、しきい値を下げるか、問題のある IP をブロックリストに追加する必要がある場合があります。

```bash
aws logs put-metric-filter \
  --log-group-name "aws-waf-logs-production" \
  --filter-name "WAFRateLimited" \
  --filter-pattern '{ $.terminatingRuleType = "RATE_BASED" }' \
  --metric-transformations \
    metricName=RateLimitedRequests,\
    metricNamespace=WAF/Security,\
    metricValue=1,\
    defaultValue=0
```

#### 地理ブロックされたトラフィック

ブロックされた地域からのトラフィックを追跡します。急激なスパイクは組織的なキャンペーンを示す場合があります。アプリケーションが特定の地域のみにサービスを提供している場合、このメトリクスは地理制限ルールが機能していることを検証し、オリジンに到達する前にどれだけの不要なトラフィックが排除されているかを定量化するのに役立ちます。

```bash
aws logs put-metric-filter \
  --log-group-name "aws-waf-logs-production" \
  --filter-name "WAFGeoBlocked" \
  --filter-pattern '{ $.terminatingRuleId = "GeoBlockRule" }' \
  --metric-transformations \
    metricName=GeoBlockedRequests,\
    metricNamespace=WAF/Security,\
    metricValue=1,\
    defaultValue=0
```

#### 管理パスプローブ

管理パネルや機密ファイルを標的とした偵察活動を検出します。管理パスプローブは標的型攻撃の前兆です。不正なアクターはまず露出した管理インターフェースを見つけ、その後、それらに対して認証情報のスタッフィングや既知の攻撃手法を試みます。

```bash
aws logs put-metric-filter \
  --log-group-name "aws-waf-logs-production" \
  --filter-name "WAFAdminProbing" \
  --filter-pattern '{ $.terminatingRuleId = "BlockAdminPathsRule" }' \
  --metric-transformations \
    metricName=AdminProbingAttempts,\
    metricNamespace=WAF/Security,\
    metricValue=1,\
    defaultValue=0
```

#### 許可されたリクエスト（比率ベースの分析用）

ブロックと並行して許可されたリクエストのボリュームを追跡し、比率ベースの異常検出を行います。ブロック対許可の比率を監視することは、絶対的なブロック数だけよりも意味があります。突然の比率の変化（ブロックスパイクがなくても）は、正当なトラフィックが減少しつつ攻撃が続いていること、または新しい攻撃ベクトルがルールをバイパスしていることを示す可能性があります。

```bash
aws logs put-metric-filter \
  --log-group-name "aws-waf-logs-production" \
  --filter-name "WAFAllowedRequests" \
  --filter-pattern '{ $.action = "ALLOW" }' \
  --metric-transformations \
    metricName=AllowedRequests,\
    metricNamespace=WAF/Security,\
    metricValue=1,\
    defaultValue=0
```

:::tip[アラーム戦略]
メトリクスフィルターを[複合アラーム](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Create_Composite_Alarm.html)と組み合わせることで、より精密なアラートが可能になります。例えば、SQLi の試行がしきい値を超え、かつ全体的なブロックレートがスパイクした場合にのみ発動させることで、通常のスキャンアクティビティ中の孤立したイベントによるノイズを削減できます。
:::

---

### 継続的なトップ N 分析のための Contributor Insights ルール

[CloudWatch Contributor Insights](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/ContributorInsights.html) は、ログデータからほぼリアルタイムのトップ N レポートを作成します。Logs Insights クエリ（アドホック）やメトリクスフィルター（集計カウント）とは異なり、Contributor Insights はトップのコントリビューターを継続的にランク付けするため、クエリを記述することなく、トップの不正アクター、最も標的にされた URI、最もアクティブなルールを特定するのに最適です。

:::info[Contributor Insights の違い]
| 機能 | 最適な用途 | レイテンシー | コストモデル |
|---|---|---|---|
| Logs Insights クエリ | アドホック調査、フォレンジック、カスタム分析 | 秒単位（オンデマンド） | クエリ単位（スキャンデータ量） |
| メトリクスフィルター | ほぼリアルタイムのメトリクス、アラーム、ダッシュボード | 約 1 分 | カスタムメトリクス単位 |
| Contributor Insights | トップ N ランキング、ヘビーヒッター、トレンド | ほぼリアルタイム | ルール単位（一致イベント数） |
:::

:::note[重要な制限事項]
Contributor Insights は、ルールが作成された**後に**取り込まれたログイベントのみを分析します。過去のログは処理できません。データの蓄積を開始するために、WAF デプロイメントの早い段階でルールを作成してください。
:::

#### ブロックされたソース IP のトップ

ブロックされたリクエストを最も多く生成している IP のほぼリアルタイムのリーダーボードで、アクティブな不正アクターを特定します。このルールは手動でクエリを実行することなく継続的に更新されるため、アナリストがアプリケーションを現在攻撃している人物を一目で確認する必要がある SOC ダッシュボードに最適です。

```bash
aws cloudwatch put-insight-rule \
  --rule-name "WAF-TopBlockedIPs" \
  --rule-state "ENABLED" \
  --rule-definition '{
    "Schema": {"Name": "CloudWatchLogRule", "Version": 1},
    "LogGroupNames": ["aws-waf-logs-production"],
    "LogFormat": "JSON",
    "Contribution": {
      "Keys": ["$.httpRequest.clientIp"],
      "Filters": [{"Match": "$.action", "In": ["BLOCK"]}]
    },
    "AggregateOn": "Count"
  }'
```

#### 標的にされた URI のトップ

不正なアクターが最も標的にしているエンドポイントを確認し、アプリケーション内の攻撃焦点領域を明らかにします。特定の URI が常にトップに表示される場合、不正なアクターがアプリ内の高価値ターゲット（ログインページ、機密データを含む API、または既知の脆弱性を持つエンドポイント）を特定していることを示しています。

```bash
aws cloudwatch put-insight-rule \
  --rule-name "WAF-TopTargetedURIs" \
  --rule-state "ENABLED" \
  --rule-definition '{
    "Schema": {"Name": "CloudWatchLogRule", "Version": 1},
    "LogGroupNames": ["aws-waf-logs-production"],
    "LogFormat": "JSON",
    "Contribution": {
      "Keys": ["$.httpRequest.uri"],
      "Filters": [{"Match": "$.action", "In": ["BLOCK"]}]
    },
    "AggregateOn": "Count"
  }'
```

#### 終了ルールのトップ

どの WAF ルールが最も多くの作業を行っているかをほぼリアルタイムで表示し、ルールの有効性を検証します。マネージドルールグループがトップリストを占めている場合、AWS マネージドルールへの投資が効果を発揮しています。カスタムルールがリードしている場合、アプリケーション固有の保護が的確に設定されていることが確認できます。

```bash
aws cloudwatch put-insight-rule \
  --rule-name "WAF-TopTerminatingRules" \
  --rule-state "ENABLED" \
  --rule-definition '{
    "Schema": {"Name": "CloudWatchLogRule", "Version": 1},
    "LogGroupNames": ["aws-waf-logs-production"],
    "LogFormat": "JSON",
    "Contribution": {
      "Keys": ["$.terminatingRuleId"],
      "Filters": [{"Match": "$.action", "In": ["BLOCK"]}]
    },
    "AggregateOn": "Count"
  }'
```

#### 攻撃元国のトップ

地域的な脅威キャンペーンの特定に役立つ攻撃の地理的分布です。国のランキングの急激な変化（昨日まではトップ 5 にいなかった新しい国が出現するなど）は、新たに侵害されたボットネットや特定の地域からの組織的なキャンペーンを示す可能性があります。

```bash
aws cloudwatch put-insight-rule \
  --rule-name "WAF-TopAttackCountries" \
  --rule-state "ENABLED" \
  --rule-definition '{
    "Schema": {"Name": "CloudWatchLogRule", "Version": 1},
    "LogGroupNames": ["aws-waf-logs-production"],
    "LogFormat": "JSON",
    "Contribution": {
      "Keys": ["$.httpRequest.country"],
      "Filters": [{"Match": "$.action", "In": ["BLOCK"]}]
    },
    "AggregateOn": "Count"
  }'
```

#### IP + ルールの組み合わせ（攻撃フィンガープリント）

どの IP がどのルールをトリガーしているかを示す複合キーで、複数ベクトルの不正アクターをフィンガープリントします。この二次元ビューは不正アクターの洗練度を明らかにします：複数の異なるルール ID で表示される IP は多様な手法を実行しており、同じルールとペアになっている多数の IP は同一のペイロードを使用する分散キャンペーンを示唆しています。

```bash
aws cloudwatch put-insight-rule \
  --rule-name "WAF-IPRuleCombinations" \
  --rule-state "ENABLED" \
  --rule-definition '{
    "Schema": {"Name": "CloudWatchLogRule", "Version": 1},
    "LogGroupNames": ["aws-waf-logs-production"],
    "LogFormat": "JSON",
    "Contribution": {
      "Keys": ["$.httpRequest.clientIp", "$.terminatingRuleId"],
      "Filters": [{"Match": "$.action", "In": ["BLOCK"]}]
    },
    "AggregateOn": "Count"
  }'
```

#### 許可されたソース IP のトップ（ベースラインモニタリング）

正当なトラフィックソースのトップを追跡し、予期しない IP がトップコントリビューターに表示された場合に異常を検出します。通常のトラフィックソースのベースラインを確立することで、まだブロックルールをトリガーしていない、以前は見られなかったソースからの認証情報スタッフィングを示す可能性のある、新しい不明な IP がトップ N リストに突然現れた場合にすばやく検出できます。

```bash
aws cloudwatch put-insight-rule \
  --rule-name "WAF-TopAllowedIPs" \
  --rule-state "ENABLED" \
  --rule-definition '{
    "Schema": {"Name": "CloudWatchLogRule", "Version": 1},
    "LogGroupNames": ["aws-waf-logs-production"],
    "LogFormat": "JSON",
    "Contribution": {
      "Keys": ["$.httpRequest.clientIp"],
      "Filters": [{"Match": "$.action", "In": ["ALLOW"]}]
    },
    "AggregateOn": "Count"
  }'
```

---

### 統合 WAF セキュリティダッシュボードの構築

3 つすべての機能を単一の [CloudWatch ダッシュボード](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch_Dashboards.html)に統合して、ほぼリアルタイムの WAF セキュリティモニタリングを実現します。以下のダッシュボードには、このガイドからのすべてのクエリ、アラーム、および Contributor Insights ルールが個別のウィジェットとして含まれています。

#### 完全なダッシュボード JSON

以下は、このガイドからのすべてのメトリクスフィルターウィジェット、アラームウィジェット、Contributor Insights ウィジェット、および Logs Insights クエリウィジェットを組み込んだ包括的な WAF セキュリティ運用ダッシュボードを作成します。

```bash
aws cloudwatch put-dashboard \
  --dashboard-name "WAF-Security-Operations" \
  --dashboard-body file://waf-dashboard.json
```

<details>
<summary>完全なダッシュボード JSON を表示（waf-dashboard.json）</summary>

```json title="waf-dashboard.json"
{
  "widgets": [
    {
      "type": "metric",
      "x": 0,
      "y": 0,
      "width": 12,
      "height": 6,
      "properties": {
        "title": "WAF Block vs Allow Rate (5-min intervals)",
        "metrics": [
          ["WAF/Security", "BlockedRequests", {"stat": "Sum", "period": 300, "color": "#d13212"}],
          ["WAF/Security", "AllowedRequests", {"stat": "Sum", "period": 300, "color": "#1b660f"}]
        ],
        "view": "timeSeries",
        "region": "us-east-1",
        "yAxis": {
          "left": {"label": "Request Count"}
        },
        "period": 300
      }
    },
    {
      "type": "metric",
      "x": 12,
      "y": 0,
      "width": 12,
      "height": 6,
      "properties": {
        "title": "Attack Types Over Time",
        "metrics": [
          ["WAF/Security", "SQLiAttempts", {"stat": "Sum", "period": 300, "color": "#d13212"}],
          ["WAF/Security", "XSSAttempts", {"stat": "Sum", "period": 300, "color": "#ff9900"}],
          ["WAF/Security", "RateLimitedRequests", {"stat": "Sum", "period": 300, "color": "#8c4fff"}],
          ["WAF/Security", "GeoBlockedRequests", {"stat": "Sum", "period": 300, "color": "#0073bb"}],
          ["WAF/Security", "AdminProbingAttempts", {"stat": "Sum", "period": 300, "color": "#1b660f"}]
        ],
        "view": "timeSeries",
        "stacked": true,
        "region": "us-east-1",
        "yAxis": {
          "left": {"label": "Attempts"}
        },
        "period": 300
      }
    },
    {
      "type": "metric",
      "x": 0,
      "y": 6,
      "width": 12,
      "height": 3,
      "properties": {
        "title": "Alarm: WAF High Block Rate",
        "annotations": {
          "alarms": ["arn:aws:cloudwatch:us-east-1:ACCOUNT_ID:alarm:WAF-HighBlockRate"]
        },
        "view": "timeSeries",
        "region": "us-east-1",
        "period": 300
      }
    },
    {
      "type": "metric",
      "x": 12,
      "y": 6,
      "width": 12,
      "height": 3,
      "properties": {
        "title": "Alarm: WAF SQL Injection Attack",
        "annotations": {
          "alarms": ["arn:aws:cloudwatch:us-east-1:ACCOUNT_ID:alarm:WAF-SQLiAttack"]
        },
        "view": "timeSeries",
        "region": "us-east-1",
        "period": 300
      }
    },
    {
      "type": "metric",
      "x": 0,
      "y": 9,
      "width": 8,
      "height": 6,
      "properties": {
        "title": "Contributor Insights: Top Blocked IPs",
        "metrics": [
          [{"expression": "INSIGHT_RULE_METRIC('WAF-TopBlockedIPs', 'UniqueContributors')", "label": "Unique Blocked IPs", "period": 300}],
          [{"expression": "INSIGHT_RULE_METRIC('WAF-TopBlockedIPs', 'MaxContributorValue')", "label": "Top IP Block Count", "period": 300}]
        ],
        "view": "timeSeries",
        "region": "us-east-1",
        "period": 300
      }
    },
    {
      "type": "metric",
      "x": 8,
      "y": 9,
      "width": 8,
      "height": 6,
      "properties": {
        "title": "Contributor Insights: Top Terminating Rules",
        "metrics": [
          [{"expression": "INSIGHT_RULE_METRIC('WAF-TopTerminatingRules', 'UniqueContributors')", "label": "Active Rules", "period": 300}],
          [{"expression": "INSIGHT_RULE_METRIC('WAF-TopTerminatingRules', 'MaxContributorValue')", "label": "Top Rule Triggers", "period": 300}]
        ],
        "view": "timeSeries",
        "region": "us-east-1",
        "period": 300
      }
    },
    {
      "type": "metric",
      "x": 16,
      "y": 9,
      "width": 8,
      "height": 6,
      "properties": {
        "title": "Contributor Insights: Top Attack Countries",
        "metrics": [
          [{"expression": "INSIGHT_RULE_METRIC('WAF-TopAttackCountries', 'UniqueContributors')", "label": "Unique Countries", "period": 300}],
          [{"expression": "INSIGHT_RULE_METRIC('WAF-TopAttackCountries', 'MaxContributorValue')", "label": "Top Country Blocks", "period": 300}]
        ],
        "view": "timeSeries",
        "region": "us-east-1",
        "period": 300
      }
    },
    {
      "type": "metric",
      "x": 0,
      "y": 15,
      "width": 8,
      "height": 6,
      "properties": {
        "title": "Contributor Insights: Top Targeted URIs",
        "metrics": [
          [{"expression": "INSIGHT_RULE_METRIC('WAF-TopTargetedURIs', 'UniqueContributors')", "label": "Unique URIs Targeted", "period": 300}],
          [{"expression": "INSIGHT_RULE_METRIC('WAF-TopTargetedURIs', 'MaxContributorValue')", "label": "Top URI Hits", "period": 300}]
        ],
        "view": "timeSeries",
        "region": "us-east-1",
        "period": 300
      }
    },
    {
      "type": "metric",
      "x": 8,
      "y": 15,
      "width": 8,
      "height": 6,
      "properties": {
        "title": "Contributor Insights: IP + Rule Combos",
        "metrics": [
          [{"expression": "INSIGHT_RULE_METRIC('WAF-IPRuleCombinations', 'UniqueContributors')", "label": "Unique IP+Rule Pairs", "period": 300}],
          [{"expression": "INSIGHT_RULE_METRIC('WAF-IPRuleCombinations', 'MaxContributorValue')", "label": "Top Combo Count", "period": 300}]
        ],
        "view": "timeSeries",
        "region": "us-east-1",
        "period": 300
      }
    },
    {
      "type": "metric",
      "x": 16,
      "y": 15,
      "width": 8,
      "height": 6,
      "properties": {
        "title": "Contributor Insights: Top Allowed IPs (Baseline)",
        "metrics": [
          [{"expression": "INSIGHT_RULE_METRIC('WAF-TopAllowedIPs', 'UniqueContributors')", "label": "Unique Allowed IPs", "period": 300}],
          [{"expression": "INSIGHT_RULE_METRIC('WAF-TopAllowedIPs', 'MaxContributorValue')", "label": "Top IP Request Count", "period": 300}]
        ],
        "view": "timeSeries",
        "region": "us-east-1",
        "period": 300
      }
    },
    {
      "type": "log",
      "x": 0,
      "y": 21,
      "width": 12,
      "height": 6,
      "properties": {
        "title": "Security Posture Overview",
        "query": "SOURCE \"aws-waf-logs-production\"\n| fields @timestamp, action, terminatingRuleId\n| stats count(*) as requestCount by action\n| sort requestCount desc",
        "region": "us-east-1",
        "view": "table"
      }
    },
    {
      "type": "log",
      "x": 12,
      "y": 21,
      "width": 12,
      "height": 6,
      "properties": {
        "title": "Top Blocked IPs",
        "query": "SOURCE \"aws-waf-logs-production\"\n| fields httpRequest.clientIp, httpRequest.country, terminatingRuleId\n| filter action = \"BLOCK\"\n| stats count(*) as blockCount by httpRequest.clientIp, httpRequest.country\n| sort blockCount desc\n| limit 20",
        "region": "us-east-1",
        "view": "table"
      }
    },
    {
      "type": "log",
      "x": 0,
      "y": 27,
      "width": 12,
      "height": 6,
      "properties": {
        "title": "Recent SQL Injection Attempts",
        "query": "SOURCE \"aws-waf-logs-production\"\n| fields @timestamp, httpRequest.clientIp, httpRequest.uri, httpRequest.args\n| filter terminatingRuleId = \"SQLInjectionRule\" or terminatingRuleId like /(?i)sql/\n| sort @timestamp desc\n| limit 50",
        "region": "us-east-1",
        "view": "table"
      }
    },
    {
      "type": "log",
      "x": 12,
      "y": 27,
      "width": 12,
      "height": 6,
      "properties": {
        "title": "Top Terminating Rules",
        "query": "SOURCE \"aws-waf-logs-production\"\n| fields terminatingRuleId, terminatingRuleType\n| filter action = \"BLOCK\"\n| stats count(*) as triggers by terminatingRuleId, terminatingRuleType\n| sort triggers desc",
        "region": "us-east-1",
        "view": "table"
      }
    },
    {
      "type": "log",
      "x": 0,
      "y": 33,
      "width": 12,
      "height": 6,
      "properties": {
        "title": "Managed Rule Group Drill-Down",
        "query": "SOURCE \"aws-waf-logs-production\"\n| fields @timestamp, httpRequest.clientIp, httpRequest.uri\n| parse @message '\"terminatingRule\":{\"ruleId\":\"*\"' as managedRuleId\n| filter terminatingRuleType = \"MANAGED_RULE_GROUP\"\n| stats count(*) as hits by managedRuleId, terminatingRuleId\n| sort hits desc",
        "region": "us-east-1",
        "view": "table"
      }
    },
    {
      "type": "log",
      "x": 12,
      "y": 33,
      "width": 12,
      "height": 6,
      "properties": {
        "title": "Geographic Threat Distribution",
        "query": "SOURCE \"aws-waf-logs-production\"\n| fields httpRequest.country, action\n| filter action = \"BLOCK\"\n| stats count(*) as blockedRequests by httpRequest.country\n| sort blockedRequests desc\n| limit 15",
        "region": "us-east-1",
        "view": "table"
      }
    },
    {
      "type": "log",
      "x": 0,
      "y": 39,
      "width": 12,
      "height": 6,
      "properties": {
        "title": "Rate-Limited IPs (DDoS/Brute-Force)",
        "query": "SOURCE \"aws-waf-logs-production\"\n| fields @timestamp, httpRequest.clientIp, httpRequest.uri\n| filter terminatingRuleType = \"RATE_BASED\"\n| stats count(*) as rateLimited, earliest(@timestamp) as firstSeen, latest(@timestamp) as lastSeen by httpRequest.clientIp\n| sort rateLimited desc",
        "region": "us-east-1",
        "view": "table"
      }
    },
    {
      "type": "log",
      "x": 12,
      "y": 39,
      "width": 12,
      "height": 6,
      "properties": {
        "title": "XSS Attack Patterns",
        "query": "SOURCE \"aws-waf-logs-production\"\n| fields @timestamp, httpRequest.clientIp, httpRequest.uri, httpRequest.httpMethod\n| filter terminatingRuleId = \"XSSRule\" or @message like /(?i)xss/\n| stats count(*) as attempts by httpRequest.clientIp, httpRequest.httpMethod\n| sort attempts desc",
        "region": "us-east-1",
        "view": "table"
      }
    },
    {
      "type": "log",
      "x": 0,
      "y": 45,
      "width": 12,
      "height": 6,
      "properties": {
        "title": "Admin Path Probing Detection",
        "query": "SOURCE \"aws-waf-logs-production\"\n| fields @timestamp, httpRequest.clientIp, httpRequest.uri, action\n| filter httpRequest.uri like /admin/ or httpRequest.uri like /wp-admin/ or httpRequest.uri like /phpmyadmin/ or httpRequest.uri like /\\.env/\n| stats count(*) as probeCount by httpRequest.clientIp, httpRequest.uri, action\n| sort probeCount desc",
        "region": "us-east-1",
        "view": "table"
      }
    },
    {
      "type": "log",
      "x": 12,
      "y": 45,
      "width": 12,
      "height": 6,
      "properties": {
        "title": "SSRF and Log4j Attempts",
        "query": "SOURCE \"aws-waf-logs-production\"\n| fields @timestamp, httpRequest.clientIp, httpRequest.uri, terminatingRuleId\n| filter httpRequest.uri like /169\\.254/ or httpRequest.uri like /jndi:/ or httpRequest.uri like /\\$\\{/ or @message like /Log4JRCE/\n| sort @timestamp desc\n| limit 30",
        "region": "us-east-1",
        "view": "table"
      }
    },
    {
      "type": "log",
      "x": 0,
      "y": 51,
      "width": 12,
      "height": 6,
      "properties": {
        "title": "Multi-Vector Unauthorized Actors (IPs triggering 3+ rules)",
        "query": "SOURCE \"aws-waf-logs-production\"\n| fields httpRequest.clientIp, terminatingRuleId\n| filter action = \"BLOCK\"\n| stats count_distinct(terminatingRuleId) as rulesTriggered, count(*) as totalBlocks by httpRequest.clientIp\n| filter rulesTriggered > 2\n| sort rulesTriggered desc, totalBlocks desc",
        "region": "us-east-1",
        "view": "table"
      }
    },
    {
      "type": "log",
      "x": 12,
      "y": 51,
      "width": 12,
      "height": 6,
      "properties": {
        "title": "User-Agent Analysis (Bot Detection)",
        "query": "SOURCE \"aws-waf-logs-production\"\n| fields @timestamp, httpRequest.clientIp, action\n| parse @message '\"name\":\"user-agent\",\"value\":\"*\"' as userAgent\n| filter action = \"BLOCK\"\n| stats count(*) as requests by userAgent\n| sort requests desc\n| limit 20",
        "region": "us-east-1",
        "view": "table"
      }
    },
    {
      "type": "log",
      "x": 0,
      "y": 57,
      "width": 12,
      "height": 6,
      "properties": {
        "title": "Top Targeted URIs",
        "query": "SOURCE \"aws-waf-logs-production\"\n| fields httpRequest.uri, terminatingRuleId\n| filter action = \"BLOCK\"\n| stats count(*) as hits by httpRequest.uri\n| sort hits desc\n| limit 20",
        "region": "us-east-1",
        "view": "table"
      }
    },
    {
      "type": "log",
      "x": 12,
      "y": 57,
      "width": 12,
      "height": 6,
      "properties": {
        "title": "Block Rate Timeline (5-min bins)",
        "query": "SOURCE \"aws-waf-logs-production\"\n| fields @timestamp, action\n| filter action = \"BLOCK\"\n| stats count(*) as blockedPerInterval by bin(5m)\n| sort @timestamp asc",
        "region": "us-east-1",
        "view": "timeSeries"
      }
    }
  ]
}
```

</details>

![WAF セキュリティ運用ダッシュボード](/img/tools/logs/waf-security-analysis/waf-security-dashboard.png "WAF セキュリティダッシュボード")

:::tip
ダッシュボード JSON 全体で `aws-waf-logs-production` を実際の WAF ロググループ名に置き換えてください。アラーム ARN 内の `ACCOUNT_ID` を 12 桁の AWS アカウント ID に置き換えてください。複数の WAF ロググループがある場合は、各クエリに追加の `SOURCE` 値として追加できます（例：`SOURCE "aws-waf-logs-production", "aws-waf-logs-staging"`）。
:::

---

### セキュリティ運用ワークフロー

これらの CloudWatch 機能は、特定のセキュリティ運用ワークフローにマッピングされます：

| セキュリティユースケース | 主要ツール | 補助ツール |
|---|---|---|
| アクティブな攻撃キャンペーンの検出 | メトリクスフィルター + アラーム | Contributor Insights（トップ IP） |
| 不正アクターの特定 | Contributor Insights | Logs Insights（詳細調査） |
| ルール有効性の検証 | Contributor Insights（トップルール） | メトリクスフィルター（トレンド） |
| インシデント調査 | Logs Insights クエリ | Contributor Insights（コンテキスト） |
| コンプライアンスレポーティング | メトリクスフィルター（メトリクス） | Logs Insights（証拠） |
| 異常検出 | メトリクスフィルター + CloudWatch 異常検出 | Contributor Insights（新規アクター） |
| 地理的脅威分析 | Contributor Insights（国別） | Logs Insights（国の詳細） |
| ボット/スキャナーの特定 | Logs Insights（User-Agent） | メトリクスフィルター（不正ボット数） |

#### 一般的なインシデント対応フロー

1. **アラームが発動**（メトリクスフィルターがスパイクを検出）→ WAF セキュリティダッシュボードを確認
2. **トップ IP を特定**（Contributor Insights）→ 最も多くのブロックを生成している IP を確認
3. **詳細調査**（Logs Insights クエリ）→ 正確なペイロード、パス、タイミングを調査
4. **アクションを実行** → WAF ルールを更新して IP をブロック、レート制限を強化、または IP セットを追加

#### 継続的な運用プラクティス

- **週次レビュー**：Contributor Insights のトレンドを確認して、攻撃パターンの緩やかな変化を特定し、それに応じて WAF ルールをチューニングします
- **ルールチューニング**：ルール有効性クエリを使用して、誤検知で頻繁に発動するルール（高い COUNT アクション）を特定します
- **ベースラインモニタリング**：許可された IP のトップルールを追跡して、予期しないソースが突然出現した場合の異常を検出します
- **地理認識**：新しい地域からの組織的なキャンペーンを示す突然の変化がないか、地理的分布を監視します

---

### クリーンアップ

追加コストを防ぐために、このガイドで作成したメトリクスフィルター、Contributor Insights ルール、アラーム、ダッシュボードなどのリソースを削除してください。

```bash
# Delete metric filters
aws logs delete-metric-filter --log-group-name "aws-waf-logs-production" --filter-name "WAFBlockedRequests"
aws logs delete-metric-filter --log-group-name "aws-waf-logs-production" --filter-name "WAFSQLiAttempts"
aws logs delete-metric-filter --log-group-name "aws-waf-logs-production" --filter-name "WAFXSSAttempts"
aws logs delete-metric-filter --log-group-name "aws-waf-logs-production" --filter-name "WAFRateLimited"
aws logs delete-metric-filter --log-group-name "aws-waf-logs-production" --filter-name "WAFGeoBlocked"
aws logs delete-metric-filter --log-group-name "aws-waf-logs-production" --filter-name "WAFAdminProbing"
aws logs delete-metric-filter --log-group-name "aws-waf-logs-production" --filter-name "WAFAllowedRequests"

# Delete alarms
aws cloudwatch delete-alarms --alarm-names "WAF-HighBlockRate" "WAF-SQLiAttack"

# Delete Contributor Insights rules
aws cloudwatch delete-insight-rules --rule-names "WAF-TopBlockedIPs" "WAF-TopTargetedURIs" "WAF-TopTerminatingRules" "WAF-TopAttackCountries" "WAF-IPRuleCombinations" "WAF-TopAllowedIPs"

# Delete dashboard
aws cloudwatch delete-dashboards --dashboard-names "WAF-Security-Operations"
```

:::note
これらの分析リソースを削除しても、WAF ログそのものには影響しません。WAF ログは引き続き CloudWatch Logs ロググループに送信されます。WAF ログの取り込みを完全に停止するには、テレメトリ有効化ルールの削除と WAF Web ACL のログ記録の無効化を別途行う必要があります。分析リソースはデータを失うことなくいつでも再作成できます。
:::

---


## 関連リソース

- [メトリクスフィルターのフィルターパターン構文](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/FilterAndPatternSyntax.html)：JSON メトリクスフィルターパターンリファレンス
- [Contributor Insights ルール構文](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/ContributorInsights-RuleSyntax.html)：ルール定義構文
- [Contributor Insights のセキュリティベストプラクティス](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/iam-cw-condition-keys-contributor.html)：ルールアクセスを制限するための IAM 条件キー
- [Amazon CloudWatch Logs での AWS WAF ログの分析](https://aws.amazon.com/blogs/mt/analyzing-aws-waf-logs-in-amazon-cloudwatch-logs/)：詳細な分析パターンに関する AWS ブログ記事
- [最小限の労力で AWS WAF のダッシュボードをデプロイする](https://aws.amazon.com/blogs/security/deploy-dashboard-for-aws-waf-minimal-effort/)：事前構築済み WAF ダッシュボードガイダンス
- [AWS WAF コンソールに新しいトップインサイトの視覚化機能が追加されました](https://aws.amazon.com/about-aws/whats-new/2025/02/aws-waf-console-top-insights-visualizations-additional-regions)：組み込みの WAF コンソールインサイト（2025 年 2 月）
- [Amazon CloudWatch と Amazon OpenSearch Service の統合分析](https://aws.amazon.com/about-aws/whats-new/2024/12/amazon-cloudwatch-opensearch-service-integrated-analytics/)：WAF ログ用の事前構築済み OpenSearch ダッシュボード（2024 年 12 月）

## 関連イベント

<RelatedEvents />

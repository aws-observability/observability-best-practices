# CloudWatch Logs Transformation による CloudTrail エンリッチメント

## はじめに

[AWS CloudTrail](https://docs.aws.amazon.com/awscloudtrail/latest/userguide/cloudtrail-user-guide.html) は、AWS API アクティビティの包括的な監査カバレッジを提供し、組織にとって完全なセキュリティとコンプライアンスの基盤を構築します。これらのログを [Amazon CloudWatch Logs](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/WhatIsCloudWatchLogs.html) に配信する際、[CloudWatch Logs Transformation](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/CloudWatch-Logs-Transformation.html) を使用することで、カスタム Lambda 関数、外部 ETL パイプライン、または後処理スクリプトを使用せずに、CloudTrail データを強化および最適化することができます。

宣言型の JSON プロセッサ設定を使用することで、CloudTrail イベントが CloudWatch Logs に流れ込む際に、ネストされたフィールドの解析、セキュリティコンテキストの追加、リソースの分類、および下流への配信に向けたデータの最適化を行うことができます。このガイドでは、AWS ネイティブのログ管理のシンプルさと信頼性を維持しながら、セキュリティモニタリング、コンプライアンスレポート、および運用効率のための実践的な変換パターンを紹介します。

## これが重要な理由

[CloudTrail ログを CloudWatch Logs に配信する](https://docs.aws.amazon.com/awscloudtrail/latest/userguide/send-cloudtrail-events-to-cloudwatch-logs.html)組織では、特定の運用ワークフローやツールの要件に合わせてこのデータを強化する必要があることがよくあります。

- **セキュリティチーム**は、脅威検出ワークフローを加速するために、カスタムリスク指標と分類タグを追加したいと考えています
- **コンプライアンスチーム**は、監査対応を効率化するために、規制フレームワーク（PCI-DSS、HIPAA、SOC2）ごとにイベントを事前分類する必要があります
- **マルチアカウント環境を管理するオペレーションチーム**は、CloudTrail の技術的なイベントデータに、環境ラベル、コストセンター、チームオーナーシップなどのビジネスコンテキストを追加したいと考えています
- **すべてのチーム**は、ダウンストリームシステム（SIEM、OpenSearch、S3）にデータを転送する際に、データ構造を最適化したいと考えています。具体的には、ツールの互換性のためにネストされたフィールドをフラット化したり、ダウンストリームの取り込みコストを削減するためにセキュリティ関連フィールドに絞り込んだりすることが含まれます

ネイティブな変換機能がない場合、チームはカスタム Lambda 関数の構築、外部 ETL パイプラインの維持、またはポスト処理の実行に頼ることになり、ログ管理インフラストラクチャに複雑さ、レイテンシー、および運用上のオーバーヘッドが加わります。

## CloudWatch Logs と変換の仕組み

### CloudWatch Logs

[Amazon CloudWatch Logs](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/WhatIsCloudWatchLogs.html) は CloudTrail の監査ログの送信先として機能します。CloudTrail が CloudWatch Logs にログを配信すると、各 API イベントは[ロググループとストリーム](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/Working-with-log-groups-and-streams.html)内に整理されたログイベントになり、組織は以下のことが可能になります。

- [CloudWatch Logs Insights](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/AnalyzingLogData.html) を使用して最近の API アクティビティをクエリする
- [メトリクスフィルターとアラーム](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/MonitoringLogData.html) を使用してセキュリティアラートを作成する
- [サブスクリプションフィルター](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/SubscriptionFilters.html) を使用してダウンストリームシステムにログを転送する

### CloudWatch Logs の変換

[CloudWatch Logs Transformation](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/CloudWatch-Logs-Transformation.html) は、宣言型の[プロセッサ](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/CloudWatch-Logs-Transformation-Processors.html)を使用して、取り込み中にログデータを変更することを可能にします。変換は、以下のような操作を指定する JSON 設定として定義されます。

- [parseJSON](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/CloudWatch-Logs-Transformation-Processors.html#CloudWatch-Logs-Transformation-parseJSON): JSON 構造を解析してネストされたフィールドを抽出する
- [copyValue](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/CloudWatch-Logs-Transformation-Processors.html#CloudWatch-Logs-Transformation-copyValue): エンリッチメントのために値を新しいフィールドにコピーする
- [substituteString](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/CloudWatch-Logs-Transformation-Processors.html#CloudWatch-Logs-Transformation-substituteString): パターンベースの文字列置換を実行する
- [deleteKeys](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/CloudWatch-Logs-Transformation-Processors.html#CloudWatch-Logs-Transformation-deleteKeys): 不要なフィールドを削除する

ロググループに適用すると、変換はストレージ前にすべての受信ログイベントに対して自動的に実行されます。元のバージョンと変換後のバージョンの両方が CloudWatch Logs に保持され、[サブスクリプションフィルター](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/SubscriptionFilters.html)が変換済みデータをダウンストリームシステムに転送し、CloudWatch Logs Insights クエリが分析用に変換済みバージョンを表示します。[GetLogEvents](https://docs.aws.amazon.com/AmazonCloudWatchLogs/latest/APIReference/API_GetLogEvents.html) および [FilterLogEvents](https://docs.aws.amazon.com/AmazonCloudWatchLogs/latest/APIReference/API_FilterLogEvents.html) API は、変換済みバージョンではなく元のログバージョンを返すことに注意してください。

## ソリューション

CloudWatch Logs Transformation は、カスタムインフラストラクチャを排除しながら即時の運用価値を提供するネイティブのリアルタイムエンリッチメント機能を提供することで、これらの課題に対処します。以下のセクションでは、組織が 4 つの主要な領域にわたって変換を活用する方法のサンプルを提供します。

### セキュリティモニタリング

組織は、CloudTrail の包括的なイベントデータにエンリッチされたフィールドを追加することで、脅威検出を効率化できます。

- **即時の脅威検出**: 追加 `is_root_user` 即時フィルタリングのフラグ ([ユースケース #4: ルートユーザーアクティビティ検出](#4-ルートユーザーアクティビティの検出) を参照)
- **リソース感度タグ付け**: 命名パターンに基づいて S3 バケットを自動的に分類します ([ユースケース #1: S3 データ分類](#1-機密リソース識別のための-s3-データ分類) を参照)
- **簡素化されたアラート**: エンリッチされたフィールドに対して複雑な JSON 解析なしに、[メトリクスフィルター](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/MonitoringLogData.html) を使用した [CloudWatch アラーム](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/AlarmThatSendsEmail.html) を作成します
- **SIEM 対応データ**: セキュリティツールとのシームレスな統合のためにネストされたフィールドをフラット化します ([ユースケース #2: ネストされたフィールドのフラット化](#2-siem-統合のためのネストされたフィールドのフラット化) を参照)

### 最適化されたデータ配信

CloudTrail データイベントは包括的な監査カバレッジを提供し、毎日数百万件のログを生成します。組織はこのデータを特定のダウンストリームシステム向けに最適化できます。

- **効率的なダウンストリーム配信**: サブスクリプションフィルターを使用して S3、OpenSearch、またはサードパーティの SIEM に送信する前に冗長なフィールドを削除します（[ユースケース #3: フィールド削減による最適化されたダウンストリーム配信](#3-フィールド削減による最適化されたダウンストリーム配信)を参照）
- **選択的なフィールド保持**: セキュリティ上重要なデータのみを保持し、運用上のノイズを破棄します
- **クエリパフォーマンスの向上**: より小さくフラット化されたログ構造により、CloudWatch Logs Insights クエリが高速化されます
- **ダウンストリームコストの削減**: 関連データのみを外部システムに送信することで、インジェストおよびストレージコストを削減します

:::info
**注意**: 元のログと変換後のログはどちらも CloudWatch Logs に保存されます。主なメリットは、サブスクリプションフィルターを介してダウンストリームシステムに送信されるデータを最適化することであり、[CloudWatch Logs のストレージコスト](https://aws.amazon.com/cloudwatch/pricing/)を削減することではありません。
:::

### 運用効率

数十または数百の AWS アカウントを持つ組織は、環境全体にわたる CloudTrail イベントの相関関係を効率化できます。

- **環境タグ付け**: イベントに自動的にラベルを付けます `production`, `staging`、または `development` アカウント ID に基づく（[ユースケース #5: マルチアカウント環境タギング](#5-マルチアカウント環境のタグ付け)を参照）
- **標準化されたフィールド名**: 次のようなネストされたフィールドをフラット化する `userIdentity.type` および `sourceIPAddress` すべてのアカウントにわたって一貫したクエリを実行するため（[ユースケース #2: ネストされたフィールドのフラット化](#2-siem-統合のためのネストされたフィールドのフラット化)を参照）
- **ビジネスコンテキスト**: 取り込み時にコンプライアンスフレームワークタグを追加する（[ユースケース #6: コンプライアンスフレームワークのタグ付け](#6-コンプライアンスフレームワークのタグ付け)を参照）
- **クロスアカウント分析の簡素化**: CloudWatch Logs Insights で一貫したフィールド名を使用してすべてのアカウントをクエリする

### コンプライアンスと監査への対応

組織は CloudTrail イベントを事前に分類することで、監査対応を迅速化できます。

- **コンプライアンスフレームワークのタグ付け**: PCI-DSS、HIPAA、または SOC2 に関連するイベントを自動的にタグ付けします（[ユースケース #6: コンプライアンスフレームワークのタグ付け](#6-コンプライアンスフレームワークのタグ付け)を参照）
- **ルートユーザーの監視**: コンプライアンス監査のためにルートユーザーのアクティビティにフラグを立てます（[ユースケース #4: ルートユーザーアクティビティの検出](#4-ルートユーザーアクティビティの検出)を参照）
- **保持期間の最適化**: 異なる保持ポリシーに対応するため、重要な監査データと運用ログを分離します
- **迅速な監査対応**: 事前に分類されたログにより、コンプライアンスレビュー中に即座にフィルタリングが可能になります

## よくあるユースケースとソリューション

以下の例では、[CloudTrail ログ](https://docs.aws.amazon.com/awscloudtrail/latest/userguide/cloudtrail-event-reference-record-contents.html)の実践的な変換パターンを示します。各ユースケースには、具体的な課題、それに対処するためのプロセッサ設定、および得られるメリットが含まれています。これらのパターンは、組織固有のセキュリティモニタリングおよび運用要件に合わせて組み合わせたり、適応させたりすることができます。

### 1. 機密リソース識別のための S3 データ分類

**課題**: セキュリティチームは、各 ARN を手動で確認することなく、どの CloudTrail イベントが機密または本番環境の S3 バケットに関係しているかを迅速に特定することに苦労しています。

**解決策**: バケット命名パターンに基づいて S3 リソースを自動的に分類します。

```json
[
  {
    "parseJSON": {
      "source": "@message"
    }
  },
  {
    "copyValue": {
      "entries": [
        {
          "source": "resources.0.ARN",
          "target": "data_classification"
        }
      ]
    }
  },
  {
    "substituteString": {
      "entries": [
        {
          "source": "data_classification",
          "from": ".*-prod-.*",
          "to": "sensitive"
        },
        {
          "source": "data_classification",
          "from": "^arn:aws:s3:::.*",
          "to": "normal"
        }
      ]
    }
  }
]
```

**メリット**: セキュリティアナリストは以下でフィルタリングできます `data_classification` 機密リソースへのアクセスを即座に識別するためのフィールドです。

**クエリの例**:
```sql
fields @timestamp, eventName, userIdentity.arn, data_classification
| filter data_classification = "sensitive"
| sort @timestamp desc
```

### 2. SIEM 統合のためのネストされたフィールドのフラット化

**課題**: SIEM ツールはフラットなフィールド構造を必要とします。CloudTrail の詳細な JSON 構造は、SIEM の要件に合わせてフラット化することができます。

**解決策**: よくクエリされるネストされたフィールドを抽出してフラット化します。

```json
[
  {
    "parseJSON": {
      "source": "@message"
    }
  },
  {
    "copyValue": {
      "entries": [
        {
          "source": "userIdentity.type",
          "target": "user_type",
          "overwriteIfExists": true
        },
        {
          "source": "sourceIPAddress",
          "target": "source_ip",
          "overwriteIfExists": true
        },
        {
          "source": "awsRegion",
          "target": "region",
          "overwriteIfExists": true
        }
      ]
    }
  }
]
```

**メリット**: すべてのアカウントにわたって標準化されたフィールド名により、SIEM の相関ルールが簡素化され、設定の複雑さが軽減されます。

**クエリの例**:
```sql
fields @timestamp, eventName, user_type, source_ip, region
| filter region = "us-east-1"
| sort @timestamp desc
```

### 3. フィールド削減による最適化されたダウンストリーム配信

**課題**: CloudTrail データイベントは大量のデータを生成します。組織はダウンストリームシステムに転送する際に、セキュリティ関連フィールドに絞り込むことができます。

**解決策**: サブスクリプションフィルターを介して転送する前にフィールドを削除します。

```json
[
  {
    "parseJSON": {
      "source": "@message"
    }
  },
  {
    "deleteKeys": {
      "withKeys": [
        "responseElements",
        "requestParameters"
      ]
    }
  }
]
```

**メリット**: ダウンストリームシステム（S3、OpenSearch、SIEM）に送信されるデータ量を削減し、セキュリティ関連データをすべて維持しながら、取り込みおよびストレージコストを削減します。

:::info
**重要**: 元のログと変換後のログの両方が CloudWatch Logs に保存されます。サブスクリプションフィルターは変換後のバージョンを転送するため、ダウンストリームシステムでのコスト削減が可能になります。セキュリティモニタリングに不要なフィールドのみを削除してください。上記の例では冗長なフィールドを削除しています (`responseElements` および `requestParameters`) ですが、次のようなコアの監査データは保持します。 `eventName`, `userIdentity`, `sourceIPAddress`、および `eventTime`なお、 `deleteKeys` イベントに存在するフィールドのみを削除します。フィールドが存在しない場合は、静かにスキップされます。次のように追加のフィールドを追加します。 `additionalEventData`, `resources`、または `serviceEventDetails` 特定の要件に基づいてリストに追加します。
:::

**クエリの例**:
```sql
fields @timestamp, eventName, userIdentity.type, sourceIPAddress
| filter eventName like /Put|Delete|Create/
| sort @timestamp desc
```

### 4. ルートユーザーアクティビティの検出

**課題**: ルートユーザーのアクティビティを特定するには、解析が必要です。 `userIdentity.type` フィールド。組織は明示的なフラグを追加することで、アラートの作成を簡素化できます。

**解決策**: ルートユーザー検出のための明示的なブールフラグを追加します。

```json
[
  {
    "parseJSON": {
      "source": "@message"
    }
  },
  {
    "copyValue": {
      "entries": [
        {
          "source": "userIdentity.type",
          "target": "is_root_user",
          "overwriteIfExists": true
        }
      ]
    }
  },
  {
    "substituteString": {
      "entries": [
        {
          "source": "is_root_user",
          "from": "Root",
          "to": "true"
        },
        {
          "source": "is_root_user",
          "from": "(IAMUser|AssumedRole|FederatedUser|AWSAccount|AWSService)",
          "to": "false"
        }
      ]
    }
  }
]
```

**メリット**: ルートユーザーのアクティビティに対するシンプルなフィルタリングを可能にします。 `filter is_root_user = "true"`

**クエリの例**:
```sql
fields @timestamp, eventName, userIdentity.arn, sourceIPAddress, is_root_user
| filter is_root_user = "true"
| sort @timestamp desc
```

### 5. マルチアカウント環境のタグ付け

**課題**: 複数の AWS アカウントを持つ組織では、各 CloudTrail イベントがどの環境 (prod/staging/dev) で生成されたかを迅速に特定する必要があります。

**解決策**: アカウント ID を環境ラベルにマッピングします。

```json
[
  {
    "parseJSON": {
      "source": "@message"
    }
  },
  {
    "copyValue": {
      "entries": [
        {
          "source": "recipientAccountId",
          "target": "environment",
          "overwriteIfExists": true
        }
      ]
    }
  },
  {
    "substituteString": {
      "entries": [
        {
          "source": "environment",
          "from": "111122223333",
          "to": "production"
        }
      ]
    }
  },
  {
    "substituteString": {
      "entries": [
        {
          "source": "environment",
          "from": "444455556666",
          "to": "staging"
        }
      ]
    }
  },
  {
    "substituteString": {
      "entries": [
        {
          "source": "environment",
          "from": "[0-9]{12}",
          "to": "development"
        }
      ]
    }
  }
]
```

**メリット**: ダウンストリームシステムでアカウント ID マッピングを管理することなく、環境ベースのフィルタリングとアラートを有効にします。

**クエリの例**：
```sql
fields @timestamp, eventName, userIdentity.arn, environment
| filter environment = "production"
| stats count() by eventName
| sort count desc
```

### 6. コンプライアンスフレームワークのタグ付け

**課題**: コンプライアンスチームは、監査中に特定の規制フレームワーク（PCI-DSS、HIPAA、SOC2）に関連する CloudTrail イベントを迅速にフィルタリングする必要があります。

**解決策**: コンプライアンスに関連するパターンに基づいてイベントに自動的にタグを付けます。

:::info
**注意**: 以下は、コンプライアンスフレームワークに関連するタグを追加する方法の例です。以下の例に示す eventName マッピングは、特定のフレームワークとは対応していません。
:::

```json
[
  {
    "parseJSON": {
      "source": "@message"
    }
  },
  {
    "copyValue": {
      "entries": [
        {
          "source": "eventName",
          "target": "compliance_framework",
          "overwriteIfExists": true
        }
      ]
    }
  },
  {
    "substituteString": {
      "entries": [
        {
          "source": "compliance_framework",
          "from": ".*(CreateKey|DeleteKey|DisableKey|ScheduleKeyDeletion|PutKeyPolicy).*",
          "to": "PCI-DSS,HIPAA"
        }
      ]
    }
  },
  {
    "substituteString": {
      "entries": [
        {
          "source": "compliance_framework",
          "from": ".*(CreateAccessKey|DeleteAccessKey|UpdateAccessKey|CreateUser|DeleteUser).*",
          "to": "SOC2,PCI-DSS"
        }
      ]
    }
  },
  {
    "substituteString": {
      "entries": [
        {
          "source": "compliance_framework",
          "from": ".*(PutBucketEncryption|DeleteBucketEncryption|PutBucketPolicy|DeleteBucketPolicy).*",
          "to": "HIPAA,PCI-DSS"
        }
      ]
    }
  }
]
```

**メリット**: 監査中にコンプライアンス関連イベントを即座にフィルタリングできるため、個別のイベントカタログを管理する必要がありません。

**クエリの例**:
```sql
fields @timestamp, eventName, userIdentity.arn, compliance_framework
| filter compliance_framework like /PCI-DSS/
| sort @timestamp desc
```

## ベストプラクティス

CloudWatch Logs Transformation の実装を成功させるには、慎重な計画と継続的なメンテナンスが必要です。これらのベストプラクティスは、信頼性が高く効率的な変換パイプラインを構築するために、設計原則、パフォーマンスの最適化、セキュリティの考慮事項、およびコスト管理をカバーしています。

### 設計原則

1. **シンプルに始める**: 基本的な変換から始め、必要に応じて複雑さを追加します
2. **徹底的にテストする**: 本番環境へのデプロイ前に、CloudTrail イベントのサンプルで変換を検証します
3. **パターンを文書化する**: 正規表現パターンとその意図するマッチの文書を維持します
4. **バージョン管理**: 変更管理のために、変換設定をソース管理で追跡します

### パフォーマンスの最適化

1. **プロセッサー数の最小化**: 小さなプロセッサーを多数使用するのではなく、適切に設計された少数のプロセッサーを使用します
2. **正規表現の複雑さの最小化**: パフォーマンスを向上させるために、可能な限りシンプルなパターンを使用します
3. **フィールド操作の制限**: ダウンストリーム分析に必要なフィールドのみをコピーまたは変換します
4. **スケールでのテスト**: 現実的なログボリュームで変換パフォーマンスを検証します

### セキュリティに関する考慮事項

1. **PII の露出を避ける**: 適切なデータ処理制御なしにカスタムフィールドに PII を追加しないでください
2. **パターンを検証する**: 正規表現パターンが誤って機密データを露出させないことを確認してください
3. **変換を監査する**: セキュリティへの影響について変換ロジックを定期的にレビューしてください
4. **監査の整合性を保持する**: 変換によってコンプライアンスやフォレンジック分析に必要なフィールドが削除されないことを確認してください

### コスト管理

1. **ダウンストリーム配信の最適化**: サブスクリプションフィルターを介して外部システムに転送する前に不要なフィールドを削除し、[ダウンストリームの取り込みコスト](https://aws.amazon.com/cloudwatch/pricing/)を削減します
2. **ストレージとクエリパフォーマンスのバランス**: 追加のエンリッチされたフィールドの保存とクエリの複雑さのトレードオフを検討します
3. **変換メトリクスの監視**: 変換エラーとパフォーマンスについて [CloudWatch Logs メトリクス](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/CloudWatch-Logs-Monitoring-CloudWatch-Metrics.html)を追跡します
4. **定期的な見直し**: 変換が現在の要件と引き続き一致しているかどうかを定期的に評価します

## 元のログと変換後のログのクエリ

ロググループに変換が適用されると、元のバージョンと変換後のバージョンの両方が CloudWatch Logs に保存されます。各バージョンへのアクセス方法を理解することは、検証とトラブルシューティングにおいて重要です。

### CloudWatch Logs Insights の動作

- **デフォルト**: CloudWatch Logs Insights クエリは、ログの**変換後**のバージョンを表示します
- **元のアクセス**: 元のログコンテンツは常に `@message` フィールド
- **API の動作**: [GetLogEvents](https://docs.aws.amazon.com/AmazonCloudWatchLogs/latest/APIReference/API_GetLogEvents.html) および [FilterLogEvents](https://docs.aws.amazon.com/AmazonCloudWatchLogs/latest/APIReference/API_FilterLogEvents.html) API は、ログの**オリジナル**バージョンを返します

### クエリの例

**変換されたログのクエリ (デフォルトの動作)**:
```sql
fields @timestamp, eventName, user_type, source_ip, region
| filter region = "us-east-1"
| sort @timestamp desc
```

**@message を使用して元のログをクエリする**:
```sql
fields @timestamp, @message
| parse @message /"eventName":"(?<original_eventName>[^"]+)"/
| filter original_eventName like /Create/
| sort @timestamp desc
```

**元のデータと変換後のデータを並べて比較します**。
```sql
fields @timestamp, @message as original_log, eventName, user_type, region
| limit 10
```

このデュアルストレージアプローチにより、日常業務では充実した変換済みデータを活用しながら、元の監査証跡に常にアクセスできることが保証されます。

## 実装手順

1. **要件の特定**: どの[CloudTrail フィールド](https://docs.aws.amazon.com/awscloudtrail/latest/userguide/cloudtrail-event-reference-record-contents.html)をエンリッチまたは変更する必要があるかを決定します
2. **変換ロジックの設計**: プロセッサチェーンと期待される結果をマッピングします
3. **テストイベントの作成**: 検証用のサンプル CloudTrail イベントを生成します
4. **変換の設定**: ロググループに[プロセッサ設定を適用](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/CloudWatch-Logs-Transformation.html#CloudWatch-Logs-Transformation-Permissions)します
5. **結果の検証**: [CloudWatch Logs Insights](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/AnalyzingLogData.html) を使用して変換済みログをクエリし、正しく処理されていることを確認します
6. **モニタリングと反復**: 運用フィードバックに基づいて変換を継続的に改善します

## まとめ

CloudWatch Logs Transformation により、組織はセキュリティコンテキストによるインジェスト時のイベントエンリッチメント、複雑な JSON 構造のフラット化、ダウンストリームへの配信最適化を通じて、CloudWatch Logs に配信される CloudTrail データの価値を最大化できます。これらはすべてネイティブな AWS 機能によって実現されます。セキュリティチームおよびオペレーションチームは、カスタム処理インフラストラクチャの運用オーバーヘッドなしに、CloudTrail イベントを実用的なインテリジェンスに変換できます。このガイドでは、これらの機能を活用するために必要なパターン、ベストプラクティス、および実装戦略を提供し、AWS 環境の完全な監査証跡を維持しながら、コンプライアンスレポートの簡素化とダウンストリームコストの削減を実現します。

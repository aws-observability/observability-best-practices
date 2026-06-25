---
sidebar_position: 1
---
# CloudTrail の運用

AWS CloudTrail は、AWS インフラストラクチャ全体のアクションに関連するアカウントアクティビティをログに記録し、継続的に監視し、保持することができます。また、AWS Management Console、AWS SDK、およびコマンドラインツールを通じて行われた API 呼び出しを含む、アカウントの AWS 呼び出し履歴も提供します。その結果、以下を特定できます。

*   CloudTrail をサポートするサービスの AWS API を呼び出したユーザーとアカウント。
*   呼び出し元のソース IP アドレス。
*   呼び出しが発生した日時。

CloudTrail は、AWS アカウントの作成時に有効化され、過去 90 日間のすべての管理イベントアクティビティのイベント履歴を提供します。AWS では、AWS 環境内で 90 日を超えてイベントを保持するために、Lake 用のトレイルまたはイベントデータストアを作成することを推奨しています。以下では、CloudTrail の全体的なベストプラクティスの概要を説明し、続くセクションでは CloudTrail トレイルや CloudTrail Lake などの CloudTrail の特定の領域に関するベストプラクティスを提供します。 

### CloudTrail のセキュリティアカウントまたはログアカウントを委任管理者として登録する
CloudTrail では、組織のトレイルおよび Lake イベントデータストアを管理するために、最大 3 人の委任管理者を設定できます。委任管理者は、組織に代わってリソースを管理する権限を持ちます。委任管理者のサポートにより、管理アカウントが CloudTrail の管理アクションをセキュリティアカウントやログアカウントなどの組織メンバーアカウントに委任できるようになり、お客様にとっての柔軟性が向上します。

この機能により、組織のマネジメントアカウントは、委任された管理者アカウントを通じてこれらの組織証跡または CloudTrail Lake イベントデータストアリソースが作成および管理される場合でも、すべての CloudTrail 組織リソースの所有者であり続けます。これにより、お客様は AWS Organizations で組織に変更が加えられた際の中断を回避しながら、組織全体の CloudTrail 監査ログの継続性を維持することができます。CloudTrail の委任された管理者を活用することで、CloudTrail 関連の管理タスクにマネジメントアカウントを使用するユーザーを最小限に抑えることができ、セキュリティとコンプライアンスの体制の改善に役立ちます。

### CloudTrail Insights を使用して異常な API アクティビティを監視する

AWS CloudTrail Insights は、CloudTrail 管理イベントを継続的に分析することで、API コールに関連する異常なアクティビティを特定し、対応するための支援を AWS ユーザーに提供します。CloudTrail Insights を有効にしており、CloudTrail が異常なアクティビティを検出した場合、Insights イベントはトレイルの宛先 S3 バケット、または CloudTrail Lake のイベントデータストアに配信されます。また、インサイトの種類やインシデントの発生期間を確認することもできます。トレイルでキャプチャされる他の種類のイベントとは異なり、Insights イベントは、CloudTrail がアカウントの API 使用状況においてアカウントの通常の使用パターンと大きく異なる変化を検出した場合にのみログに記録されます。CloudTrail Insights は Event Bridge と統合されており、メール通知の送信や Lambda 関数のトリガーなどの条件に基づいて特定のアクションをトリガーするルールを作成できます。これにより、チームが異常な API アクティビティを常に把握できるようになります。

![CloudTrail Insights](/img/cloudops/guides/cloudtrail/cloudtrail-insights.png "CloudTrail Insights")

### CloudTrail のコストを管理する
CloudTrail を使用する際は、CloudTrail の支出を管理するための考慮事項を念頭に置いてください。以下は、CloudTrail のコストを管理するためのベストプラクティスです。

-   **AWS Budgets**: AWS Budgets は CloudTrail の支出を追跡するのに役立ちます。CloudTrail サービスに基づいて、AWS Budgets でコストベースの予算を設定できます。また、予算アラートを設定して、特定の予算しきい値に達したときに電子メールまたは AWS Chatbot で通知を受け取ることもできます。

![AWS Budgets](/img/cloudops/guides/cloudtrail/cloudtrail-budgets.png "AWS Budgets")

-   **AWS Cost Anomaly Detection**: AWS Cost Anomaly Detection は、組織全体の AWS 支出における予期しない急増を特定して解決するのに役立ちます。AWS CloudTrail サービスのモニターを作成して、支出を追跡できます。このサービスは機械学習を使用して過去のデータを分析し、予想される日次支出を計算して実際の支出と比較します。CloudTrail の実際の支出が特定のしきい値を超えて予想額を上回った場合、これを異常として識別し、根本原因分析を実行します。AWS Cost Anomaly Detection が CloudTrail の支出に関連する異常を検出した場合、迅速に対処できます。

-   **Amazon S3 バケットキーを活用して、CloudTrail S3 バケットの SSE-KMS に関連するコストを削減する**: Amazon S3 のサーバーサイド暗号化に AWS KMS (SSE-KMS) を使用したオブジェクトレベルのキーを使用している場合は、Amazon S3 から AWS KMS へのリクエストトラフィックを削減することで AWS KMS のリクエストコストを最大 99% 削減できる Amazon S3 バケットキーへの切り替えを検討してください。これにより、CloudTrail に記録されるイベントの量も大幅に削減され、CloudTrail の料金削減にも役立ちます。S3 バケットキーを使用することのその他の主なメリットは以下のとおりです。
    *   **管理の簡素化:** バケットレベルのキーは、個々のオブジェクトレベルのキーと比較して管理が容易です。
    *   **パフォーマンスの向上**: KMS への API 呼び出しが削減されることで、暗号化されたオブジェクトに関わる操作のパフォーマンスが向上します。
    *   **簡単な実装:** S3 バケットキーは、クライアントアプリケーションへの変更を必要とせず、AWS Management Console で数回クリックするだけで有効にできます。

-   **複数のトレイル**: アカウントの管理イベントの最初のコピーは AWS Free Tier に含まれています。同じ管理イベントを配信する追加のトレイルを作成した場合、それ以降の配信には追加の CloudTrail コストが発生します。複数のトレイルが必要な場合は、次の推奨事項が CloudTrail の追加トレイルのコスト削減に役立ちます。

    *   **CloudTrail Lake**: CloudTrail Lake を活用して、管理イベントの追加コピーを取り込みます。CloudTrail Lake を使用することで、管理イベントの追加コピーに対する全体的な料金を最大 90% 削減できます。

    *   **AWS Key Management Service (AWS KMS) および Amazon Relational Database Service (Amazon RDS) データ API イベントを除外する**: 管理イベントの追加コピーについては、AWS Key Management Service (AWS KMS) および Amazon Relational Database Service (Amazon RDS) データ API イベントも除外することをお勧めします。これらのイベントのコピーは複数必要ない場合があるためです。これらの大量イベントは高コストを発生させる可能性があり、管理フィルターの下にあるトレイルまたはイベントデータストアページで除外できます。

-   **データイベントの高度なイベントセレクター**: データイベントを使用する場合、高度なイベントセレクターによってデータイベントログの詳細な制御が可能になります。高度なイベントセレクターは、部分文字列のパターンマッチングによる値の包含または除外もサポートしています。これにより、ログに記録して料金を支払う CloudTrail データイベントをより細かく制御できます。たとえば、Amazon S3 の DeleteObject API をログに記録することで、受信する CloudTrail イベントを破壊的なアクションのみに絞り込むことができます。これにより、コストを抑えながらセキュリティの問題を特定するのに役立ちます。

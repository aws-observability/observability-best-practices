# オブザーバビリティとは




## 概要

オブザーバビリティとは、観測対象のシステムからのシグナルに基づいて、実用的な洞察を継続的に生成し発見する能力です。
言い換えると、オブザーバビリティによってユーザーは、システムの外部出力からその状態を理解し、(是正) 措置を講じることができます。




## 解決する課題

コンピュータシステムは、CPU 時間、メモリ、ディスク容量などの低レベルのシグナルと、API レスポンス時間、エラー、1 秒あたりのトランザクション数などの高レベルおよびビジネスシグナルを観察することで測定されます。

システムのオブザーバビリティは、その運用コストと開発コストに大きな影響を与えます。
オブザーバブルなシステムは、オペレーターに意味のある実用的なデータを提供し、インシデント対応の迅速化や開発者の生産性向上などの好ましい結果を達成し、作業の負担とダウンタイムを軽減することができます。



## メリット

より多くの情報が必ずしもより観測可能なシステムにつながるわけではないことを理解することが重要です。
実際、システムが生成する情報量が多すぎると、アプリケーションが生成するノイズの中から価値のあるヘルスシグナルを識別することが難しくなる場合があります。
オブザーバビリティには、適切な意思決定を行うために、適切なタイミングで適切な使用者（人間またはソフトウェア）に適切なデータを提供することが必要です。




## ここで見つかるもの

このサイトには、オブザーバビリティに関するベストプラクティスが含まれています。すべきこと、すべきでないこと、そしてそれらを実現するためのレシピ集です。ここでのコンテンツの大部分はベンダーに依存せず、優れたオブザーバビリティソリューションが提供するものを表しています。

オブザーバビリティは *製品* ではなく *ソリューション* として考えることが重要です。オブザーバビリティは実践から生まれ、強力な開発と DevOps リーダーシップに不可欠なものです。適切に観測されたアプリケーションとは、セキュリティがプロジェクトの組織方法の最前線にあるべきように、オブザーバビリティを運用の原則として位置づけているものです。後からオブザーバビリティを「付け足す」ことは、アンチパターンであり、成功率は低くなります。

このサイトは 4 つのカテゴリーで構成されています：

1. [ダッシュボード、アプリケーションパフォーマンスモニタリング、コンテナなどのソリューション別のベストプラクティス](/observability-best-practices/ja/guides/)
1. [ログやトレースなど、異なるデータタイプの使用に関するベストプラクティス](/observability-best-practices/ja/signals/logs/)
1. [特定の AWS ツールに関するベストプラクティス（ただし、これらは他のベンダー製品にも大部分が適用可能です）](/observability-best-practices/ja/tools/cloudwatch_agent/)
1. [AWS でのオブザーバビリティに関する厳選されたレシピ](/observability-best-practices/ja/recipes/)

:::info
このサイトは、AWS とお客様が解決してきた実際のユースケースに基づいています。

オブザーバビリティは、現代のアプリケーション開発の中心であり、マイクロサービスや多くの外部統合を持つ複雑なアプリケーションなどの分散システムを運用する際の重要な考慮事項です。私たちはこれを健全なワークロードの主要な指標と考えており、ここで私たちの経験を共有できることを嬉しく思います！
:::

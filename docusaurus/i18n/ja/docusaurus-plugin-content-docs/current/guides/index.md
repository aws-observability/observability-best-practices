# ベストプラクティスの概要

オブザーバビリティは幅広いトピックであり、成熟したツールの環境があります。しかし、すべてのツールがすべてのソリューションに適しているわけではありません。オブザーバビリティの要件、構成、最終的なデプロイメントを通じてナビゲートするのを支援するために、オブザーバビリティ戦略に関する意思決定プロセスに役立つ 5 つの主要なベストプラクティスをまとめました。



## 重要なものをモニタリングする

オブザーバビリティで最も重要な考慮事項は、サーバー、ネットワーク、アプリケーション、または顧客ではありません。それは、_あなた_、あなたのビジネス、プロジェクト、またはユーザーにとって重要なものです。

まず、成功基準から始めましょう。例えば、e コマースアプリケーションを運営している場合、成功の指標は過去 1 時間の購入数かもしれません。非営利団体の場合、月間目標に対する寄付金額かもしれません。決済プロセッサーは取引処理時間を監視し、大学は学生の出席率を測定したいかもしれません。

:::tip
成功指標は誰にとっても異なります！ここでは e コマースアプリケーションを例として使用していますが、あなたのプロジェクトは全く異なる測定基準を持つ可能性があります。それでも、アドバイスは同じです：_良い_ 状態がどのようなものかを知り、それを測定してください。
:::

アプリケーションに関係なく、まずは主要な指標を特定することから始めなければなりません。そして、そこから _ワーキングバックワーズ[^1]_ して、アプリケーションやインフラストラクチャの観点からどのような影響があるかを確認します。例えば、Web サーバーの高い CPU 使用率が顧客満足度を危険にさらし、結果的に売上に影響を与えるのであれば、CPU 使用率のモニタリングは重要です！



#### 目標を把握し、測定しましょう！

重要なトップレベルの KPI を特定したら、次はそれらを自動的に追跡・測定する方法を確立することです。成功の重要な要因は、ワークロードの運用を監視するのと同じシステムでこれを行うことです。eコマースワークロードの例では、以下のようなことが考えられます：

* 売上データを[*時系列*](https://en.wikipedia.org/wiki/Time_series)として公開する
* ユーザー登録を同じシステムで追跡する
* 顧客がウェブページに滞在する時間を測定し、（再度）このデータを時系列にプッシュする

ほとんどの顧客は既にこのデータを持っていますが、オブザーバビリティの観点から見ると必ずしも適切な場所にあるとは限りません。売上データやユーザー登録データは、通常、リレーショナルデータベースやビジネスインテリジェンス報告システムで見つけることができます。また、訪問時間のデータはログから抽出するか、[リアルユーザーモニタリング](../tools/rum)から取得できます。

メトリクスデータの元の場所や形式に関わらず、それは[*時系列*](https://en.wikipedia.org/wiki/Time_series)として維持される必要があります。ビジネス、個人、学術、その他どのような目的であれ、あなたにとって最も重要な主要メトリクスはすべて、他のオブザーバビリティデータ（時に*シグナル*や*テレメトリ*と呼ばれる）と相関付けるために、時系列形式である必要があります。

![時系列の例](../images/time_series.png)
*図 1：時系列の例*



## コンテキスト伝播とツール選択

ツールの選択は重要で、問題の運用と修正方法に大きな違いをもたらします。しかし、最適でないツールを選ぶよりも悪いのは、すべての基本的なシグナルタイプに対してツールを選ぶことです。例えば、ワークロードから基本的な[ログ](../signals/logs)を収集しても、トランザクショントレースが欠けていると、ギャップが生じます。その結果、アプリケーション体験全体の一貫性のない見方になってしまいます。オブザーバビリティの現代的なアプローチはすべて、アプリケーショントレースで「点と点を結ぶ」ことに依存しています。

健全性と運用の完全な全体像を得るには、[ログ](../signals/logs)、[メトリクス](../signals/metrics)、[トレース](../signals/traces)を収集し、相関関係、分析、[異常検出](../signals/anomalies)、[ダッシュボード](../tools/dashboards)、[アラーム](../tools/alarms)などを実行するツールが必要です。

:::info
一部のオブザーバビリティソリューションには上記のすべてが含まれていない場合がありますが、既存のシステムを補強、拡張、または付加価値を与えることを目的としています。いずれの場合も、オブザーバビリティプロジェクトを開始する際には、ツールの相互運用性と拡張性が重要な考慮事項となります。
:::



#### すべてのワークロードは異なりますが、共通のツールを使用することで迅速な結果が得られます

すべてのワークロードで共通のツールセットを使用することには、運用上の摩擦やトレーニングを減らすなどの追加的な利点があり、一般的にはツールやベンダーの数を減らすよう努めるべきです。
そうすることで、既存のオブザーバビリティソリューションを新しい環境やワークロードに迅速に展開でき、問題が発生した際にも素早く解決できます。

ツールは、ワークロードのあらゆる層（基本的なインフラストラクチャ、アプリケーション、ウェブサイト、およびその間のすべて）を観察できるほど幅広いものである必要があります。
単一のツールでは対応できない場合、ベストプラクティスは、オープンスタンダードでオープンソースのツールを使用することです。
これにより、最も広範なクロスプラットフォーム統合の可能性が得られます。



#### 既存のツールとプロセスとの統合

車輪の再発明はしないでください！「円形」は既に素晴らしい形状であり、私たちは常に協調的でオープンなシステムを構築すべきであり、データサイロを作るべきではありません。

* 既存の ID プロバイダー（例：Active Directory、SAML ベースの IdP）と統合します。
* 既存の IT トラブル追跡システム（例：JIRA、ServiceNow）がある場合は、それと統合して問題が発生したときに迅速に管理できるようにします。
* 既存のワークロード管理とエスカレーションツール（例：PagerDuty、OpsGenie）がある場合は、それらを使用してください！
* Ansible、SaltStack、CloudFormation、TerraForm、CDK などの Infrastructure as Code ツールはすべて優れたツールです。これらを使用してオブザーバビリティを他のすべてと同様に管理し、現在使用している同じ Infrastructure as Code ツールでオブザーバビリティソリューションを構築してください（[Day One からオブザーバビリティを含める](#include-observability-from-day-one) を参照）。



#### 自動化と機械学習の活用

コンピュータはパターンを見つけることが得意で、データがパターンに従っていない場合も見つけることができます！ 数百、数千、あるいは数百万のデータポイントを監視する必要がある場合、それぞれの正常な閾値を理解することは不可能です。しかし、多くのオブザーバビリティソリューションには、データのベースラインを設定する面倒な作業を管理する異常検出や機械学習の機能があります。

これを「正常な状態を知る」と呼んでいます。ワークロードを徹底的に負荷テストしている場合、これらの健全なパフォーマンスメトリクスをすでに把握している可能性があります。しかし、複雑な分散アプリケーションでは、すべてのメトリクスのベースラインを作成するのは扱いにくい場合があります。ここで、異常検出、自動化、機械学習が非常に価値を発揮します。

アプリケーションの健全性のベースライン設定とアラート通知を代行するツールを活用することで、目標に集中し、[重要なものを監視する](#monitor-what-matters)ことができます。



## ワークロードのすべての層からテレメトリを収集する

アプリケーションは単独で存在するものではありません。ネットワークインフラストラクチャ、クラウドプロバイダー、インターネットサービスプロバイダー、SaaS パートナー、そしてあなたの管理下にあるものもそうでないものも含め、他のコンポーネントとの相互作用がすべて結果に影響を与える可能性があります。ワークロード全体を包括的に把握することが重要です。




#### 統合に焦点を当てる

計装する領域を 1 つ選ぶとすれば、間違いなくコンポーネント間の統合になります。これは、オブザーバビリティの力が最も顕著に現れる部分です。原則として、あるコンポーネントやサービスが別のものを呼び出すたびに、その呼び出しには少なくとも以下のデータポイントが測定されている必要があります：

1. リクエストとレスポンスの所要時間
2. レスポンスのステータス

そして、オブザーバビリティが必要とする一貫性のある全体的なビューを作成するために、リクエストチェーン全体の[単一の一意な識別子](../signals/traces)を収集されたシグナルに含める必要があります。



#### エンドユーザーエクスペリエンスを忘れずに

ワークロードの完全な把握には、すべての層を理解することが含まれます。これにはエンドユーザーの体験も含まれます。
目標が不十分なユーザーエクスペリエンスによってリスクにさらされているかを測定、定量化、理解することは、ディスク空き容量や CPU 使用率の監視と同様に重要です。むしろ、より重要かもしれません。

ワークロードがエンドユーザーと直接やり取りするもの（ウェブサイトやモバイルアプリとして提供されるアプリケーションなど）である場合、[リアルユーザーモニタリング](../tools/rum) は、ユーザーへの「ラストマイル」配信だけでなく、実際にアプリケーションをどのように体験しているかを監視します。
結局のところ、ユーザーがサービスを実際に利用できなければ、オブザーバビリティの取り組みは意味がありません。



## データは力なりですが、細かいことにこだわりすぎないでください

アプリケーションの規模によっては、シグナルを収集すべきコンポーネントの数が非常に多くなる可能性があります。
これは重要で有益なことですが、努力に対する見返りが減少する場合もあります。
そのため、ベストプラクティスは[重要なものをモニタリングする](#monitor-what-matters)ことから始め、これを重要な統合と重要なコンポーネントをマッピングする方法として使用し、適切な詳細に焦点を当てることです。



## Day One からオブザーバビリティを組み込む

セキュリティと同様に、オブザーバビリティは開発や運用の後付けであってはいけません。ベストプラクティスは、セキュリティと同じように、オブザーバビリティを計画の早い段階で取り入れることです。これにより、人々が作業するためのモデルが作成され、アプリケーションの不透明な部分が減少します。主要な開発作業が完了した後にトランザクショントレーシングを追加するには、自動計装を使用しても時間がかかります。その努力は大きな見返りをもたらします！しかし、開発サイクルの後半でこれを行うと、一部の作業をやり直す必要が生じる可能性があります。

後からワークロードにオブザーバビリティを追加するのではなく、それを使用して作業を*加速*させましょう。適切な[ログ](../signals/logs)、[メトリクス](../signals/metrics)、[トレース](../signals/traces)の収集により、アプリケーション開発が迅速化され、優れたプラクティスが促進され、将来的な迅速な問題解決の基盤が築かれます。

[^1]: Amazon では、顧客とその成果に対する執着の方法として *Working Backwards* プロセスを広範囲に使用しており、オブザーバビリティソリューションに取り組む人々が同じ方法で自身の目標から逆算して作業することを強くお勧めします。*Working Backwards* についての詳細は、[Werner Vogels のブログ](https://www.allthingsdistributed.com/2006/11/working_backwards.html)でご覧いただけます。

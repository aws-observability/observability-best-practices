# なぜオブザーバビリティを行うべきなのか？

YouTube の [オブザーバビリティ戦略の開発](https://www.youtube.com/watch?v=Ub3ATriFapQ) をご覧ください




## 本当に重要なことは何か？

仕事で行うすべてのことは、組織のミッションに沿ったものであるべきです。雇用されている私たち全員は、組織のミッションを果たし、そのビジョンに向かって働いています。アマゾンでは、私たちのミッションは次のように述べています：

> アマゾンは、地球上で最も顧客中心的な企業、最高の雇用主、そして最も安全な職場であることを目指しています。

— [About Amazon](https://www.aboutamazon.com/about-us)

IT において、すべてのプロジェクト、デプロイメント、セキュリティ対策、最適化は、ビジネス成果に向けて機能すべきです。当たり前のように思えますが、ビジネスに価値を加えないことは何もすべきではありません。ITIL が述べているように：

> すべての変更はビジネス価値を提供すべきです。

— ITIL サービストランジション、AXELOS、2011年、44ページ。  
— [Change Management in the Cloud AWS ホワイトペーパー](https://docs.aws.amazon.com/whitepapers/latest/change-management-in-the-cloud/change-management-in-the-cloud.html) を参照

ミッションとビジネス価値が重要なのは、それらがあなたの行うすべてのことに情報を与えるべきだからです。オブザーバビリティには多くの利点があります。これらには以下が含まれます：

- 可用性の向上
- 信頼性の向上
- アプリケーションの健全性とパフォーマンスの理解
- より良いコラボレーション
- 問題の事前検出
- 顧客満足度の向上
- 市場投入までの時間短縮
- 運用コストの削減
- 自動化

これらの利点にはすべて共通点があります。それらはすべて、直接的に顧客に、または間接的に組織にビジネス価値を提供します。オブザーバビリティについて考える際は、アプリケーションがビジネス価値を提供しているかどうかを考えることに立ち返るべきです。

つまり、オブザーバビリティはビジネス価値の提供に貢献するものを測定し、ビジネス成果とそれらが危険にさらされているときに焦点を当てるべきです：顧客が望むこと、必要とすることについて考える必要があります。



## どこから始めればよいですか？

重要なことがわかったら、次に何を測定する必要があるかを考える必要があります。Amazon では、顧客から始めて、彼らのニーズから逆算して考えます：

> 私たちは、サービスを改善し、利点や機能を追加するよう内部から駆り立てられています。それも、そうしなければならない前に。私たちは、そうしなければならない前に、顧客のために価格を下げ、価値を高めます。私たちは、そうしなければならない前に発明します。

— ジェフ・ベゾス、[2012年株主レター](https://s2.q4cdn.com/299287126/files/doc_financials/annual/2012-Shareholder-Letter.pdf)

簡単な例として、eコマースサイトを使ってみましょう。まず、オンラインで商品を購入する際に顧客として何を求めるかを考えてみてください。誰もが同じではないかもしれませんが、おそらく以下のようなことを気にするでしょう：

- 配送
- 価格
- セキュリティ
- ページ速度
- 検索（探している商品を見つけられるか？）

顧客が気にすることがわかったら、それらを測定し、ビジネスの成果にどのように影響するかを測定し始めることができます。ページ速度は、コンバージョン率と検索エンジンランキングに直接影響します。2017年の調査では、モバイルユーザーの半数以上（53％）が、ページの読み込みに3秒以上かかると離脱することが示されています。もちろん、ページ速度の重要性を示す多くの研究があり、それは明らかに測定すべき指標ですが、測定して行動を起こす必要があります。なぜなら、それはコンバージョンに測定可能な影響を与え、そのデータを使って改善を行うことができるからです。




## Working Backwards

お客様が気にしていることをすべて知っているとは限りません。これを読んでいる方は、おそらく技術的な役割を担っているでしょう。組織内のステークホルダーと話をする必要がありますが、これは必ずしも簡単ではありません。しかし、重要なことを測定していることを確認するためには不可欠です。

e コマースの例を続けてみましょう。今回は検索について考えてみます。顧客が商品を購入するためには検索機能が必要であることは明白かもしれません。しかし、[Forrester Research のレポート](https://www.forrester.com/report/MustHave+eCommerce+Features/-/E-RES89561)によると、訪問者の 43% が即座に検索ボックスに向かい、検索を使用する人は使用しない人と比べて 2〜3 倍の確率で購入に至ることをご存知でしたか？ 検索は非常に重要で、うまく機能する必要があり、モニタリングが必要です。特定の検索が結果を生み出していないことに気づき、単純なパターンマッチングから自然言語処理に移行する必要があるかもしれません。これは、ビジネス成果をモニタリングし、顧客体験を改善するために行動する例です。

Amazon では：

> 私たちは、顧客を深く理解し、彼らの痛点から逆算して、彼らの生活に意味のあるソリューションを生み出すイノベーションを迅速に開発するよう努めています。

— Daniel Slater - Worldwide Lead, Culture of Innovation, AWS ([Elements of Amazon's Day 1 Culture](https://aws.amazon.com/jp/executive-insights/content/how-amazon-defines-and-operationalizes-a-day-1-culture/) より)

私たちは顧客から始め、彼らのニーズから逆算して考えます。これがビジネスで成功する唯一のアプローチではありませんが、オブザーバビリティにとっては良いアプローチです。ステークホルダーと協力して顧客にとって重要なことを理解し、そこから逆算して考えてください。

さらなる利点として、顧客やステークホルダーにとって重要なメトリクスを収集すれば、ほぼリアルタイムのダッシュボードで可視化でき、「ランディングページの読み込みにどれくらい時間がかかっているか？」や「ウェブサイトの運用コストはいくらか？」といった質問に答えるためのレポート作成を避けることができます。ステークホルダーや経営陣がこの情報をセルフサービスで入手できるようにすべきです。

これらは、アプリケーションにとって**本当に重要な**高レベルのメトリクスであり、また問題があることを示す最良の指標でもあります。例えば、ある期間に通常期待される注文数よりも少ないことを示すアラートは、おそらく顧客に影響を与える問題があることを示しています。一方、サーバーのボリュームがほぼ満杯であることや、特定のサービスで 5xx エラーが多数発生していることを示すアラートは、修正が必要かもしれませんが、顧客への影響を理解し、それに応じて優先順位をつける必要があります。これには時間がかかる場合があります。

これらの高レベルのビジネスメトリクスを測定していれば、顧客に影響を与える問題を簡単に特定できます。これらのメトリクスは**何が**起こっているかを示します。その他のメトリクスやトレーシング、ログなどの他の形式のオブザーバビリティは、**なぜ**これが起こっているかを示し、それを修正または改善するために何ができるかを導き出します。



## 観察すべきこと

顧客にとって重要なことが分かったら、重要業績評価指標（KPI）を特定できます。これらは、ビジネス成果がリスクにさらされているかどうかを示す高レベルの指標です。また、これらの KPI に影響を与える可能性のある多くの異なるソースから情報を収集する必要があります。ここで、KPI に影響を与える可能性のあるメトリクスについて考え始める必要があります。先ほど述べたように、5xx エラーの数は影響を示すものではありませんが、KPI に影響を与える可能性があります。ビジネス成果に影響を与えるものから、ビジネス成果に影響を与える可能性のあるものまで、逆算して考えてください。

収集すべきものが分かったら、KPI を測定するためのメトリクスと、それらの KPI に影響を与える可能性のある関連メトリクスを提供する情報源を特定する必要があります。これが観察の基礎となります。

このデータは、メトリクス、ログ、トレースから得られる可能性が高いです。このデータを入手したら、成果がリスクにさらされたときにアラートを出すために使用できます。

その後、影響を評価し、問題の修正を試みることができます。ほとんどの場合、このデータは、CPU やメモリなどの単独の技術的なメトリクスよりも先に問題を示してくれます。

オブザーバビリティを使用して、ビジネス成果に影響を与える問題を反応的に修正したり、顧客の検索体験を向上させるなど、データを積極的に活用したりすることができます。



## 結論

CPU、RAM、ディスク容量、その他の技術的なメトリクスは、スケーリング、パフォーマンス、容量、コストにとって重要ですが、実際にはアプリケーションがどのように動作しているかを示すものではなく、顧客体験に関する洞察も提供しません。

重要なのはお客様であり、監視すべきはお客様の体験です。

そのため、お客様の要件から逆算し、ステークホルダーと協力して、重要な KPI とメトリクスを確立する必要があります。
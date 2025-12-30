# トレース

トレースは、複雑な分散システムを通じたリクエスト処理を追跡し、ダウンストリームの AWS リソース、マイクロサービス、データベース、API を含む個々のコンポーネントを通じたリクエストフローに関する詳細な情報を提供します。これにより、ボトルネックやレイテンシーの問題を特定することで、パフォーマンスの最適化に役立ちます。

このセクションでは、AWS X-Ray SDK for .NET を使用して .NET アプリケーションをインストルメント化し、X-Ray デーモン経由で AWS X-Ray にトレース情報を作成および送信する方法に関する情報を提供する AWS ドキュメントとオープンソースリポジトリへのリンクを確認できます。

AWS X-Ray のコア概念について学ぶには、AWS X-Ray Developer Guide の [**AWS X-Ray とは**](https://docs.aws.amazon.com/xray/latest/devguide/aws-xray.html) および [**概念**](https://docs.aws.amazon.com/xray/latest/devguide/aws-xray.html) セクションを参照してください。

X-Ray SDK for .NET は、C# .NET Web アプリケーション、.NET Core Web アプリケーション、および AWS Lambda 上の .NET Core 関数をインストルメント化するためのライブラリです。トレースデータを生成して X-Ray デーモンに送信するためのクラスとメソッドを提供します。これには、アプリケーションが処理する受信リクエストに関する情報、およびアプリケーションがダウンストリームの AWS サービス、HTTP Web API、SQL データベースに対して行う呼び出しが含まれます。

## エージェントと SDK のオプション

AWS X-Ray daemon、CloudWatch エージェント、AWS Distro for OpenTelemetry (ADOT) コレクターのいずれかを選択して、Amazon EC2 インスタンスやオンプレミスサーバーからトレースを収集し、AWS X-Ray に送信できます。管理する必要があるエージェントの数を最小限に抑えるために、ユースケースに適したものを選択してください。

X-Ray デーモンを設定してアプリケーションとインフラストラクチャからトレースを収集および送信する方法については、[**AWS X-Ray デーモン**](https://docs.aws.amazon.com/xray/latest/devguide/xray-daemon.html)ガイドをお読みください。代わりに CloudWatch エージェントを使用する場合は、[**Amazon CloudWatch ユーザーガイド**](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Install-CloudWatch-Agent.html)で CloudWatch エージェントのセットアップと設定の手順が提供されています。

アプリケーションをインストルメント化してトレースを生成するには、OpenTelemetry と X-Ray SDK for .NET のいずれかを選択できます。これらのオプションの選択に関するガイダンスは[**こちら**](https://docs.aws.amazon.com/xray/latest/devguide/xray-instrumenting-your-app.html#xray-instrumenting-choosing)で確認できます。 

## AWS X-Ray SDK for .NET
 
X-Ray SDK for .NET はオープンソースプロジェクトです。X-Ray SDK for .NET は、.NET Framework 4.5 以降を対象とするアプリケーションでサポートされています。.NET Core アプリケーションの場合、SDK には .NET Core 2.0 以降が必要です。

開始するためのリンクは次のとおりです。

[**AWS X-Ray SDK for .NET 開発者ガイド**](https://docs.aws.amazon.com/xray/latest/devguide/xray-sdk-dotnet.html) - このドキュメントでは、NuGet 経由でのインストール、設定オプション、および自動 HTTP リクエストトレースや AWS サービス呼び出しモニタリングを含むさまざまな計装機能について説明しています。開発者がカスタムセグメントを作成し、アノテーションを追加し、サンプリングルールを利用してデータ収集を管理する方法について説明しています。このガイドは、ASP.NET アプリケーションに X-Ray トレースを統合するための包括的な情報を提供し、開発者がアプリケーションのパフォーマンスを可視化し、問題を効果的にトラブルシューティングするのに役立ちます。

[**SDK オープンソースプロジェクトリポジトリ - aws-xray-sdk-dotnet**](https://docs.aws.amazon.com/xray/latest/devguide/xray-sdk-dotnet.html) - aws-xray-sdk-dotnet リポジトリは、Amazon の X-Ray SDK for .NET のオープンソースコードを格納しています。開発者は、.NET Core および .NET Framework 環境全体で分散アプリケーション監視をサポートするこのトレーシングツールの実装を確認できます。このリポジトリには、HTTP リクエスト、AWS サービス呼び出しの自動インストルメンテーション、およびカスタムインストルメンテーション機能のソースコードが含まれています。SDK が ASP.NET フレームワークと統合する方法やサンプリングルールを実装する方法を確認できます。この GitHub プロジェクトは、SDK の機能に透明性を提供すると同時に、開発者が問題を報告したり、コードベースの改善に貢献したりできるようにします。

以下は、.NET X-Ray SDK のコンポーネントを包括的に説明する API リファレンスマニュアルです。

[**.NET Framework の API リファレンス**](https://docs.aws.amazon.com/xray-sdk-for-dotnet/latest/reference/html/d0b774be-200e-4897-9ce6-4e43c3f6f5de.htm)

[**.NET (Core) の API リファレンス**](https://docs.aws.amazon.com/xray-sdk-for-dotnetcore/latest/reference/html/bdf06719-4833-4e03-8ce5-31debb71506c.htm)

ASP.NET および ASP.NET Core アプリケーションで X-Ray SDK for .NET を使用する方法を学習するためのサンプルアプリケーションは、以下にリンクされています

[**サンプル ASP.NET および ASP.NET core アプリケーション**](https://github.com/aws-samples/aws-xray-dotnet-webapp)
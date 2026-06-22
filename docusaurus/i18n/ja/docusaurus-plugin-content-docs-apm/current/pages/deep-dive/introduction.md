# はじめに

このガイドでは、Application Signals の技術アーキテクチャ、インストルメンテーション戦略、および実装アプローチについて説明します。特に、従来の X-Ray サンプリングから新しい包括的なオブザーバビリティアプローチへの移行を組織が検討すべき理由に焦点を当てています。

## ガイドセクション

| セクション | 説明 |
|---|---|
| [従来のモニタリングにおける課題](../challenges) | レガシーなモニタリングが最新のクラウドネイティブアプリケーションに不十分な理由 |
| [X-Ray から移行する理由](../why-migrate-from-xray) | 従来の X-Ray に代えて Application Signals + Transaction Search を採用するメリット |
| [セットアップと設定](../setup) | Application Signals、Transaction Search、サンプリングを有効にするためのステップバイステップガイド |
| [インストルメンテーションと Collector のセットアップ](../instrumentation-setups) | インストルメンテーションのアプローチと詳細な Collector アーキテクチャ（ADOT + CW Agent、ADOT + カスタム Collector、アップストリーム OTEL、Collector レス、X-Ray レガシー） |
| [インストルメンテーションのサンプル](../instrumentation-samples) | Java、Python、Node.js、.NET、Go、Rust 向けの言語別コード例とデモアプリケーション |
| [リソース](../resources) | ドキュメントへのリンク、技術リソース、トレーニング資料 |

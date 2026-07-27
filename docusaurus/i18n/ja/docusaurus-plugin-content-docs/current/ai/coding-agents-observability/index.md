---
sidebar_position: 1
---
# コーディングエージェントのオブザーバビリティ

AI コーディングエージェントがソフトウェア開発ワークフローに不可欠な存在となる中、その使用パターン、コスト、およびパフォーマンスを把握することが重要です。これらのガイドでは、ベアラートークン認証を使用して AI コーディングエージェントからネイティブ OpenTelemetry メトリクスを Amazon CloudWatch に直接送信する方法を紹介します。コレクターやサイドカーは必要ありません。

各ガイドでは、CloudWatch メトリクス API キーの作成、エージェントの設定、事前構築済みダッシュボードのデプロイ、PromQL を使用したアラートの設定など、エンドツーエンドのセットアップについて説明しています。

| Guide | Agent | Key Metrics |
| --- | --- | --- |
| [Claude Code](./claude-code) | Claude Code CLI | Tokens, cost, sessions, lines of code, commits, edit acceptance |
| [GitHub Copilot](./copilot) | VS Code extension & CLI | Tokens, sessions, tool calls, edit acceptance, latency |
| [OpenAI Codex](./codex) | Codex CLI | Tokens, API requests, tool calls, conversation turns, latency |

すべてのガイドは同じパターンに従っています。bearer-token 認証 → CloudWatch への直接 OTLP 送信 → PromQL ダッシュボードとアラート。

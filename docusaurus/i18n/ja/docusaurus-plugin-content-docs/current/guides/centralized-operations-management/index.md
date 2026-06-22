---
sidebar_position: 6
---
# 一元化された運用管理

## 集中運用管理とは何ですか？

AWS は、AWS 上、オンプレミス、ハイブリッド環境、およびエッジでアプリケーションを管理・運用するために使用できる[一元化された運用管理](https://aws.amazon.com/cloudops/centralized-operations-management/)ソリューションを提供しています。自動化、統合、組み込みのベストプラクティス、およびハイブリッド機能を活用して、中央の場所からアプリケーションを運用できます。IT サービス管理 (ITSM) ツールを強化して効率性と一貫性を向上させたい場合は、AWS を使用して現在の統合と投資を自動化しながら、運用のためのオールインワンツールを活用できます。

お客様は[AWS Systems Manager](https://aws.amazon.com/systems-manager/)を使用して、オンプレミス、ハイブリッド、および AWS のリソースを大規模に管理・運用しています。Systems Manager は、ノード（例：Amazon EC2 インスタンス、他のクラウド上のノード、オンプレミスのノード）に対して、セキュリティ関連の更新プログラムによるパッチ適用、SSH キーの管理やバスティオンホストのメンテナンスなしにノードへ接続、大規模な運用コマンドの自動化など、運用タスクを容易にします。AWS では、オンプレミス、ハイブリッド、および AWS 上で SSM Agent が完全に機能している状態のノードが「マネージドノード」と見なされます。

Systems Manager のコア機能はユースケースに焦点を当てており、エージェントが AWS Systems Manager の機能を活用するための主要コンポーネントです。ノードが Systems Manager によって管理されると、リモート管理、パッチ管理、セッション管理などの他の機能を利用できるようになり、運用タスクを自動化できます。

![AWS Systems Manager](/img/cloudops/guides/centralized-operations-management/BP-SSM-1.png "AWS Systems Manager")

# Grafana セットアップガイド

## 現在のステータス
- ✅ Grafana Workspace: `<your-amg-workspace-id>` (アクティブ)
- ✅ エンドポイント: `<your-amg-workspace-id>.grafana-workspace.<your-region>.amazonaws.com`
- ⚠️ 認証: AWS SSO が必要です（まだ設定されていません）

## オプション 1: AWS IAM Identity Center を有効にする（推奨）

### ステップ 1: IAM Identity Center を有効にする
```bash
# Open IAM Identity Center console
open "https://console.aws.amazon.com/singlesignon/home?region=<your-region>"

# Or use AWS CLI
aws sso-admin create-instance --region <your-region>
```

**コンソールでの操作：**
1. IAM Identity Center に移動します
2. 「Enable」をクリックします
3. 「Enable with AWS Organizations」（またはスタンドアロン）を選択します
4. アクティベーションが完了するまで待ちます（1〜2 分かかります）

### ステップ 2: ユーザーを作成する
1. IAM Identity Center → Users に移動します
2. 「Add user」をクリックします
3. 以下を入力します。
   - Username: your-username
   - Email: your-email@amazon.com
   - First/Last name
4. 「Next」→「Add user」をクリックします
5. 招待メールを確認します

### ステップ 3: Grafana にユーザーを割り当てる
Identity Center が有効になったら、次を実行します。

```bash
# Get the Identity Store ID
IDENTITY_STORE_ID=$(aws sso-admin list-instances --query 'Instances[0].IdentityStoreId' --output text)

# Get your user ID
USER_ID=$(aws identitystore list-users --identity-store-id $IDENTITY_STORE_ID --query "Users[?UserName=='your-username'].UserId" --output text)

# Assign user to Grafana workspace
aws grafana update-permissions \
  --workspace-id <your-amg-workspace-id> \
  --update-instruction-batch '[
    {
      "action": "ADD",
      "role": "ADMIN",
      "users": [
        {
          "id": "'$USER_ID'",
          "type": "SSO_USER"
        }
      ]
    }
  ]' \
  --region <your-region>
```

### ステップ 4: Grafana へのアクセス
1. 開きます。 `https://<your-amg-workspace-id>.grafana-workspace.<your-region>.amazonaws.com`
2. IAM Identity Center の認証情報でサインインします
3. これで管理者アクセス権が付与されます

---

## オプション 2: CloudWatch Dashboards を使用する（すでに動作中！）

SSO の設定をスキップする場合は、すでに動作する CloudWatch ダッシュボードがあります。

**ダッシュボード URL：**
`https://console.aws.amazon.com/cloudwatch/home?region=<your-region>#dashboards:name=AI-Observability-Demo`

**メリット：**
- ✅ SSO の設定が不要
- ✅ すでに作成済みで動作中
- ✅ すべてのメトリクスを表示
- ✅ CloudWatch Logs と統合済み

**表示するには：**
```bash
# Open in browser
open "https://console.aws.amazon.com/cloudwatch/home?region=<your-region>#dashboards:name=AI-Observability-Demo"

# Generate more data
python3 AI-OBS_DEMO/local-demo.py
```

---

## オプション 3: Grafana を API キー認証に切り替える

SSO の代わりに API キー認証を使用するように Grafana を更新します。

```bash
aws grafana update-workspace-authentication \
  --workspace-id <your-amg-workspace-id> \
  --authentication-providers SAML \
  --region <your-region>
```

次に、企業のアイデンティティプロバイダーで SAML を設定します。

---

## 比較

| 機能 | CloudWatch Dashboard | Grafana |
|---------|---------------------|---------|
| セットアップ時間 | ✅ 即時 | ⚠️ SSO 設定が必要 |
| 認証 | AWS Console | IAM Identity Center |
| カスタマイズ | 良好 | 優れている |
| マルチソース | 限定的 | 優れている |
| コスト | 含まれる | 約 $9/月 |
| 現在のステータス | ✅ 動作中 | ⚠️ SSO が必要 |

---

## 推奨事項

**このデモの場合：** CloudWatch Dashboard（オプション 2）を使用してください。すでに動作しており、すべてのメトリクスが表示されます。

**本番環境の場合：** より優れた可視化とマルチソースサポートのために、IAM Identity Center を使用して Grafana をセットアップします（オプション 1）。

---

## クイックスタート (CloudWatch)

```bash
# View your dashboard
open "https://console.aws.amazon.com/cloudwatch/home?region=<your-region>#dashboards:name=AI-Observability-Demo"

# Run demo to generate data
python3 AI-OBS_DEMO/local-demo.py

# View metrics
open "https://console.aws.amazon.com/cloudwatch/home?region=<your-region>#metricsV2:graph=~();namespace=AIObservability"

# View logs
open "https://console.aws.amazon.com/cloudwatch/home?region=<your-region>#logsV2:log-groups/log-group/$252Fai-observability-demo"
```

# Grafana 설정 가이드

## 현재 상태
- ✅ Grafana 워크스페이스: `<your-amg-workspace-id>` (활성)
- ✅ 엔드포인트: `<your-amg-workspace-id>.grafana-workspace.<your-region>.amazonaws.com`
- ⚠️ 인증: AWS SSO 필요 (아직 구성되지 않음)

## 옵션 1: AWS IAM Identity Center 활성화 (권장)

### 1단계: IAM Identity Center 활성화
```bash
# IAM Identity Center 콘솔 열기
open "https://console.aws.amazon.com/singlesignon/home?region=<your-region>"

# 또는 AWS CLI 사용
aws sso-admin create-instance --region <your-region>
```

**콘솔에서:**
1. IAM Identity Center로 이동
2. "Enable" 클릭
3. "Enable with AWS Organizations" 선택 (또는 독립 실행형)
4. 활성화 대기 (1-2분 소요)

### 2단계: 사용자 생성
1. IAM Identity Center → Users에서
2. "Add user" 클릭
3. 입력:
   - Username: your-username
   - Email: your-email@amazon.com
   - First/Last name
4. "Next" → "Add user" 클릭
5. 초대 이메일 확인

### 3단계: Grafana에 사용자 할당
Identity Center가 활성화되면 실행:

```bash
# Identity Store ID 가져오기
IDENTITY_STORE_ID=$(aws sso-admin list-instances --query 'Instances[0].IdentityStoreId' --output text)

# 사용자 ID 가져오기
USER_ID=$(aws identitystore list-users --identity-store-id $IDENTITY_STORE_ID --query "Users[?UserName=='your-username'].UserId" --output text)

# Grafana 워크스페이스에 사용자 할당
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

### 4단계: Grafana 접속
1. 열기: `https://<your-amg-workspace-id>.grafana-workspace.<your-region>.amazonaws.com`
2. IAM Identity Center 자격 증명으로 로그인
3. 이제 관리자 액세스 권한이 있어야 합니다

---

## 옵션 2: CloudWatch 대시보드 사용 (이미 동작 중!)

SSO 설정을 건너뛰려면 이미 동작하는 CloudWatch 대시보드를 사용할 수 있습니다:

**대시보드 URL:**
`https://console.aws.amazon.com/cloudwatch/home?region=<your-region>#dashboards:name=AI-Observability-Demo`

**장점:**
- ✅ SSO 설정 불필요
- ✅ 이미 생성되어 동작 중
- ✅ 모든 메트릭 표시
- ✅ CloudWatch Logs와 통합

**확인하려면:**
```bash
# 브라우저에서 열기
open "https://console.aws.amazon.com/cloudwatch/home?region=<your-region>#dashboards:name=AI-Observability-Demo"

# 더 많은 데이터 생성
python3 AI-OBS_DEMO/local-demo.py
```

---

## 옵션 3: Grafana를 API 키 인증으로 전환

SSO 대신 API 키 인증을 사용하도록 Grafana를 업데이트:

```bash
aws grafana update-workspace-authentication \
  --workspace-id <your-amg-workspace-id> \
  --authentication-providers SAML \
  --region <your-region>
```

그런 다음 기업 ID 프로바이더로 SAML을 구성하세요.

---

## 비교

| 기능 | CloudWatch 대시보드 | Grafana |
|---------|---------------------|---------| 
| 설정 시간 | ✅ 즉시 | ⚠️ SSO 설정 필요 |
| 인증 | AWS Console | IAM Identity Center |
| 커스터마이징 | 좋음 | 우수 |
| 멀티 소스 | 제한적 | 우수 |
| 비용 | 포함 | ~$9/월 |
| 현재 상태 | ✅ 동작 중 | ⚠️ SSO 필요 |

---

## 권장 사항

**이 데모용:** CloudWatch 대시보드(옵션 2) 사용 - 이미 동작하고 모든 메트릭을 표시합니다.

**프로덕션용:** 더 나은 시각화와 멀티 소스 지원을 위해 IAM Identity Center로 Grafana를 설정하세요(옵션 1).

---

## 빠른 시작 (CloudWatch)

```bash
# 대시보드 보기
open "https://console.aws.amazon.com/cloudwatch/home?region=<your-region>#dashboards:name=AI-Observability-Demo"

# 데이터 생성을 위해 데모 실행
python3 AI-OBS_DEMO/local-demo.py

# 메트릭 보기
open "https://console.aws.amazon.com/cloudwatch/home?region=<your-region>#metricsV2:graph=~();namespace=AIObservability"

# 로그 보기
open "https://console.aws.amazon.com/cloudwatch/home?region=<your-region>#logsV2:log-groups/log-group/$252Fai-observability-demo"
```

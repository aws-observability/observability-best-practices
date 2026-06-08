# 보안, 감사 및 운영을 위한 CloudTrail MCP Server 사용

## 소개

[CloudTrail Model Context Protocol (MCP)](https://awslabs.github.io/mcp/servers/cloudtrail-mcp-server) server를 사용하면 [Kiro](https://kiro.dev/cli/)와 같은 에이전트가 자연어를 통해 [AWS CloudTrail](https://docs.aws.amazon.com/awscloudtrail/latest/userguide/cloudtrail-user-guide.html) 이벤트를 직접 조회하고 분석할 수 있습니다. [CloudWatch Logs](https://docs.aws.amazon.com/awscloudtrail/latest/userguide/send-cloudtrail-events-to-cloudwatch-logs.html) 또는 [CloudTrail Lake](https://docs.aws.amazon.com/awscloudtrail/latest/userguide/cloudtrail-lake.html)에 저장된 CloudTrail 이벤트에 에이전트를 연결하면, 복잡한 SQL 쿼리를 작성하거나 JSON 로그를 수동으로 파싱할 필요 없이 대화형 프롬프트만으로 보안 인시던트 조사, 계정 활동 감사, 운영 문제 해결, 컴플라이언스 보고서 생성 등의 작업을 수행할 수 있습니다.

## 중요한 이유

보안, 컴플라이언스, 운영 팀은 AWS 계정 활동을 파악하기 위해 CloudTrail 로그를 분석하는 데 상당한 시간을 투자합니다.

- **보안 팀**은 의심스러운 활동을 신속하게 조사하고, 비인가 접근 시도를 추적하며, 여러 계정에 걸친 잠재적 보안 인시던트의 범위를 파악해야 합니다
- **컴플라이언스 팀**은 누가 어떤 리소스에 접근했는지, 언제 변경이 이루어졌는지, 활동이 조직 정책에 부합하는지를 보여주는 감사 보고서를 생성해야 합니다
- **운영 팀**은 API 호출을 추적하고, 구성 변경 사항을 식별하며, 문제 발생까지의 이벤트 순서를 파악하여 서비스 장애를 해결합니다
- **모든 팀**이 CloudWatch Logs Insights 쿼리 구문, JSON 파싱, 기간 및 계정 간 이벤트 상관관계 분석에 어려움을 겪고 있습니다

CloudTrail MCP server가 없으면, 팀은 복잡한 쿼리를 작성하거나, JSON 로그를 수동으로 파싱하거나, 커스텀 대시보드를 구축해야 하며, 이는 중요한 보안 및 운영 워크플로에 시간, 복잡성, 그리고 사람의 실수 가능성을 추가합니다.

## 작동 방식

CloudTrail MCP server는 자연어 질문을 CloudTrail 데이터에 대한 쿼리로 변환하여 실행하고, 컨텍스트와 인사이트가 포함된 사람이 읽기 쉬운 결과를 반환합니다.

**지원되는 데이터 소스:**

- **CloudWatch Logs**: [CloudWatch Logs Insights 쿼리 구문](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/CWL_QuerySyntax.html)을 사용합니다 - MCP server가 사용 가능한 로그 그룹을 자동으로 검색합니다
- **CloudTrail Lake**: [SQL 쿼리](https://docs.aws.amazon.com/awscloudtrail/latest/userguide/query-create-edit-query.html)를 사용합니다 - MCP server가 CloudTrail Lake에서 사용 가능한 이벤트 데이터 스토어를 자동으로 검색합니다

**주요 기능:**

- 쿼리 구문 작성 대신 자연어로 질의
- 다중 계정 지원
- 시간 기반 분석 및 이벤트 상관관계 파악
- 보안 조사, 컴플라이언스 보고, 운영 문제 해결

## 설정 요구 사항

CloudTrail MCP server를 사용하려면 다음이 필요합니다:

**CloudWatch Logs를 사용하는 경우:**
- [CloudWatch Logs로 이벤트를 전송하도록 구성된 AWS CloudTrail](https://docs.aws.amazon.com/awscloudtrail/latest/userguide/send-cloudtrail-events-to-cloudwatch-logs.html)
- IAM 권한: `logs:StartQuery`, `logs:GetQueryResults`, `logs:DescribeLogGroups`
- MCP server가 사용 가능한 CloudTrail 로그 그룹을 자동으로 검색합니다

**CloudTrail Lake를 사용하는 경우:**
- [CloudTrail Lake 이벤트 데이터 스토어](https://docs.aws.amazon.com/awscloudtrail/latest/userguide/query-event-data-store.html)가 생성 및 구성되어 있어야 합니다
- IAM 권한: `cloudtrail:StartQuery`, `cloudtrail:GetQueryResults`, `cloudtrail:DescribeEventDataStores`, `cloudtrail:ListEventDataStores` ([CloudTrail Lake 권한](https://docs.aws.amazon.com/awscloudtrail/latest/userguide/lake-permissions.html) 참조)
- MCP server가 사용 가능한 CloudTrail Lake 이벤트 데이터 스토어를 자동으로 검색합니다

**공통 요구 사항:**
- 에이전트에 MCP server가 구성되어 있어야 합니다
- 적절한 권한이 있는 AWS 자격 증명

## 구성

에이전트에서 CloudTrail MCP server를 구성하려면 [AWS MCP Servers 문서](https://awslabs.github.io/mcp/)의 설정 안내를 따르세요. MCP server는 AWS 계정에서 사용 가능한 CloudTrail 데이터 소스(CloudWatch Logs 및 CloudTrail Lake)를 자동으로 검색합니다.

**프롬프트에서** 조회할 데이터 소스를 선택적으로 지정할 수 있습니다:

```
Using CloudWatch Logs, show me all failed login attempts in the last 24 hours.
```

```
Using CloudTrail Lake, show me all IAM policy changes in the last 90 days.
```

## 실제 작업을 위한 샘플 프롬프트

### 보안 조사 프롬프트

#### 1. 실패한 로그인 시도 조사

**프롬프트:**
```
Show me all failed console login attempts in the last 24 hours. 
Include the username, source IP address, and timestamp.
```

**수행 내용:** [CloudTrail 이벤트 레코드](https://docs.aws.amazon.com/awscloudtrail/latest/userguide/cloudtrail-event-reference-record-contents.html)를 분석하여 잠재적인 무차별 대입 공격이나 자격 증명 유출을 식별합니다

**활용 사례:** 보안 팀이 다수의 실패한 로그인에 대한 알림을 받고 위협 수준을 평가해야 하는 경우

---

#### 2. 권한 상승 식별

**프롬프트:**
```
Show me all IAM policy changes in the last 48 hours. 
Focus on policies that grant admin permissions or modify IAM roles.
```

**수행 내용:** 잠재적인 권한 상승 시도를 탐지합니다

**활용 사례:** 보안 팀이 특정 행위자가 상승된 권한을 획득했는지 조사하는 경우

---

### 컴플라이언스 및 감사 프롬프트

#### 3. 사용자 활동 보고서 생성

**프롬프트:**
```
Generate a complete audit report for IAM user demo.user for the month of January 2024. 
Include all API calls, resources accessed, and any permission changes.
```

**수행 내용:** 포괄적인 사용자 활동 감사 추적을 생성합니다

**활용 사례:** 특정 기간에 대한 활동 타임라인을 제공해야 하는 경우

---

#### 4. MFA 사용 추적

**프롬프트:**
```
Show me all console logins in the last month. Which users logged in without MFA? 
How many times did each user login?
```

**수행 내용:** 조직 전체의 MFA 준수 상태를 검증합니다

**활용 사례:** 보안 정책에 따라 모든 사용자에게 MFA가 필요한 상황에서 미준수 계정을 식별하는 경우

---

### 운영 문제 해결 프롬프트

#### 5. 서비스 장애 조사

**프롬프트:**
```
Our application stopped working at 2024-01-15 14:30 UTC. Show me all API calls 
related to our production VPC (vpc-abc123) in the 30 minutes before the outage. 
What changed?
```

**수행 내용:** 서비스 중단을 유발한 구성 변경 사항을 식별합니다

**활용 사례:** 운영 팀이 장애의 근본 원인을 신속하게 파악해야 하는 경우

---

#### 6. IAM 권한 문제 디버깅

**프롬프트:**
```
User reports they can't create EC2 instances. Show me all EC2 RunInstances calls 
from user demo.user in the last 2 hours, including any access denied errors. 
What permissions are missing?
```

**수행 내용:** IAM 권한 문제를 진단합니다

**활용 사례:** 사용자가 필요한 작업을 수행할 수 없어 누락된 권한을 식별해야 하는 경우

---

### 고급 다중 계정 프롬프트

#### 7. 교차 계정 보안 검토

**프롬프트:**
```
Across all our AWS accounts, show me any security group rules that allow inbound 
traffic from 0.0.0.0/0 on ports other than 80 and 443. When were these rules created 
and by whom?
```

**수행 내용:** 전체 AWS 조직에 걸친 보안 위험을 식별합니다

**활용 사례:** 보안 팀이 조직 차원의 보안 태세를 검토하는 경우

**참고:** 다중 계정 쿼리를 위해서는 [조직 이벤트 데이터 스토어](https://docs.aws.amazon.com/awscloudtrail/latest/userguide/cloudtrail-lake-organizations.html)가 구성된 CloudTrail Lake 또는 CloudWatch Logs로 전달되는 조직 트레일이 필요합니다.

---

#### 8. 계정 간 컴플라이언스

**프롬프트:**
```
For production accounts (account IDs: 111111111111, 222222222222, 333333333333), 
show me any CloudTrail configuration changes in the last year. Has logging ever 
been disabled?
```

**수행 내용:** 조직 전체의 감사 로깅 컴플라이언스를 검증합니다

**활용 사례:** 컴플라이언스 감사에서 지속적인 로깅의 증거를 제출해야 하는 경우

---

### CloudTrail과 VPC Flow Logs 결합

CloudTrail과 [VPC Flow Logs](https://docs.aws.amazon.com/vpc/latest/userguide/flow-logs.html)가 모두 CloudWatch Logs로 전송되는 경우, API 작업과 네트워크 트래픽을 상관관계 분석하여 포괄적인 보안 조사를 수행할 수 있습니다.

#### 9. 연결 문제 해결

**프롬프트:**
```
Application team reports connectivity issues to RDS database at 10:15 AM today. 
Check VPC Flow Logs for rejected connections to the database subnet around that time, 
then check CloudTrail for any security group, NACL, or route table changes in the 
30 minutes before the issue started.
```

**수행 내용:** 연결 문제가 구성 변경으로 인한 것인지 네트워크 문제로 인한 것인지 식별합니다

**활용 사례:** 운영 팀이 애플리케이션 장애를 신속하게 해결해야 하는 경우

---

#### 10. 측면 이동 탐지

**프롬프트:**
```
CloudTrail shows user demo.user assumed role "ProductionAdmin" at 2:30 PM. 
Check VPC Flow Logs for all network connections initiated from instances 
accessed by that role in the following hour. Are there any unusual internal 
connections or port scans?
```

**수행 내용:** 권한 상승 이후 잠재적인 측면 이동을 식별합니다

**활용 사례:** 보안 팀이 유출된 자격 증명이 추가 리소스에 접근하는 데 사용되었는지 조사하는 경우

---

## 모범 사례

**효과적인 프롬프트 작성:**
- 시간 범위를 구체적으로 지정하고 컨텍스트(계정 ID, 리소스 이름, 사용자 ID)를 포함하세요
- 결과를 구체화하기 위해 후속 질문을 활용하세요
- "어떻게 해야 하나요?" 또는 "이것이 정상인가요?"와 같이 실행 가능한 인사이트를 요청하세요

**쿼리 최적화:**
- 넓은 범위에서 시작한 후 점차 좁혀가세요
- 더 빠른 결과를 위해 리소스 식별자를 사용하세요
- 관련된 질문을 하나의 프롬프트에 결합하세요

**보안:**
- 쿼리 결과에 포함된 민감한 데이터를 보호하세요
- 여러 데이터 포인트를 통해 발견 사항을 검증하세요
- MCP server 접근을 인가된 사용자로 제한하세요


## 결론

CloudTrail MCP server는 CloudTrail 이벤트 분석을 기술적인 쿼리 작성 작업에서 에이전트와의 자연스러운 대화로 전환합니다. 보안 팀은 인시던트를 더 빠르게 조사하고, 컴플라이언스 팀은 감사 보고서를 손쉽게 생성하며, 운영 팀은 복잡한 쿼리 구문을 학습하지 않고도 문제를 해결할 수 있습니다.

가장 흔히 수행하는 작업(실패한 로그인 조사, IAM 변경 추적, 장애 문제 해결 등)에 대한 기본 프롬프트부터 시작하여 자신의 환경에 맞게 적용해 보세요. MCP server의 대화형 특성 덕분에 질문을 반복적으로 정교화하면서 CloudTrail 데이터를 탐색하고 더 정확한 답변을 얻을 수 있습니다.

자세한 내용은 [AWS MCP Servers 문서](https://awslabs.github.io/mcp/) 및 [MCP for Kiro](https://kiro.dev/docs/mcp/)를 참조하세요.

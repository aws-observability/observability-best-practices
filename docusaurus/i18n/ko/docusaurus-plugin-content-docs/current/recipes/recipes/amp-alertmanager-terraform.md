# Infrastructure as Code로 Terraform을 사용하여 Amazon Managed Service for Prometheus 배포 및 Alert Manager 구성

이 레시피에서는 [Terraform](https://www.terraform.io/)을 사용하여 [Amazon Managed Service for Prometheus](https://aws.amazon.com/prometheus/)를 프로비저닝하고, 특정 조건이 충족될 때 [SNS](https://docs.aws.amazon.com/sns/) 토픽으로 알림을 보내도록 규칙 관리 및 Alert Manager를 구성하는 방법을 보여줍니다.


:::note
    이 가이드를 완료하는 데 약 30분이 소요됩니다.
:::
## 사전 요구 사항

설정을 완료하려면 다음이 필요합니다:

* [Amazon EKS 클러스터](https://docs.aws.amazon.com/eks/latest/userguide/create-cluster.html)
* [AWS CLI version 2](https://docs.aws.amazon.com/cli/latest/userguide/install-cliv2.html)
* [Terraform CLI](https://www.terraform.io/downloads)
* [AWS Distro for OpenTelemetry(ADOT)](https://aws-otel.github.io/)
* [eksctl](https://eksctl.io/)
* [kubectl](https://docs.aws.amazon.com/eks/latest/userguide/install-kubectl.html)
* [jq](https://stedolan.github.io/jq/download/)
* [helm](https://helm.sh/)
* [SNS 토픽](https://docs.aws.amazon.com/sns/latest/dg/sns-create-topic.html)
* [awscurl](https://github.com/okigan/awscurl)

이 레시피에서는 ADOT을 사용한 메트릭 스크레이핑과 Amazon Managed Service for Prometheus 워크스페이스로의 원격 쓰기를 시연하기 위해 샘플 애플리케이션을 사용합니다. [aws-otel-community](https://github.com/aws-observability/aws-otel-community) 저장소에서 샘플 앱을 포크하고 클론합니다.

이 Prometheus 샘플 앱은 4가지 Prometheus 메트릭 유형(counter, gauge, histogram, summary)을 모두 생성하고 /metrics 엔드포인트에서 노출합니다.

헬스 체크 엔드포인트도 /에 존재합니다.

다음은 구성을 위한 선택적 명령줄 플래그 목록입니다:

listen_address: (기본값 = 0.0.0.0:8080) 샘플 앱이 노출되는 주소와 포트를 정의합니다. 이는 주로 테스트 프레임워크 요구 사항에 부합하기 위한 것입니다.

metric_count: (기본값=1) 생성할 각 메트릭 유형의 수량입니다. 메트릭 유형별로 항상 동일한 수의 메트릭이 생성됩니다.

label_count: (기본값=1) 메트릭당 생성할 레이블 수량입니다.


datapoint_count: (기본값=1) 메트릭당 생성할 데이터 포인트 수입니다.

### AWS Distro for OpenTelemetry를 사용한 메트릭 수집 활성화
1. aws-otel-community 저장소에서 샘플 앱을 포크하고 클론합니다.
그런 다음 다음 명령을 실행합니다.

```
cd ./sample-apps/prometheus
docker build . -t prometheus-sample-app:latest
```
2. 이 이미지를 Amazon ECR과 같은 레지스트리에 푸시합니다. 다음 명령을 사용하여 계정에 새 ECR 저장소를 생성할 수 있습니다. "YOUR_REGION"을 설정해야 합니다.

```
aws ecr create-repository \
    --repository-name prometheus-sample-app \
    --image-scanning-configuration scanOnPush=true \
    --region <YOUR_REGION>
```
3. 이 Kubernetes 구성을 복사하고 적용하여 클러스터에 샘플 앱을 배포합니다. prometheus-sample-app.yaml 파일에서 `PUBLIC_SAMPLE_APP_IMAGE`를 방금 푸시한 이미지로 변경합니다.

```
curl https://raw.githubusercontent.com/aws-observability/aws-otel-collector/main/examples/eks/aws-prometheus/prometheus-sample-app.yaml -o prometheus-sample-app.yaml
kubectl apply -f prometheus-sample-app.yaml
```
4. ADOT Collector의 기본 인스턴스를 시작합니다. 이를 위해 먼저 다음 명령을 입력하여 ADOT Collector의 Kubernetes 구성을 가져옵니다.

```
curl https://raw.githubusercontent.com/aws-observability/aws-otel-collector/main/examples/eks/aws-prometheus/prometheus-daemonset.yaml -o prometheus-daemonset.yaml
```
그런 다음 템플릿 파일을 편집하여 Amazon Managed Service for Prometheus 워크스페이스의 remote_write 엔드포인트를 `YOUR_ENDPOINT`에, 리전을 `YOUR_REGION`에 대체합니다.
Amazon Managed Service for Prometheus 콘솔에서 워크스페이스 세부 정보를 볼 때 표시되는 remote_write 엔드포인트를 사용합니다.
또한 Kubernetes 구성의 서비스 계정 섹션에서 `YOUR_ACCOUNT_ID`를 AWS 계정 ID로 변경해야 합니다.

이 레시피에서 ADOT Collector 구성은 어떤 대상 엔드포인트를 스크레이핑할지 알려주기 위해 어노테이션 `(scrape=true)`을 사용합니다. 이를 통해 ADOT Collector가 클러스터의 kube-system 엔드포인트와 샘플 앱 엔드포인트를 구별할 수 있습니다. 다른 샘플 앱을 스크레이핑하려면 re-label 구성에서 이를 제거할 수 있습니다.
5. 다음 명령을 입력하여 ADOT Collector를 배포합니다.
```
kubectl apply -f eks-prometheus-daemonset.yaml
```

### Terraform으로 워크스페이스 구성

이제 Amazon Managed Service for Prometheus 워크스페이스를 프로비저닝하고, Alert Manager가 특정 조건(```expr```에 정의됨)이 지정된 기간(```for```) 동안 참인 경우 알림을 보내도록 하는 알림 규칙을 정의합니다. Terraform 언어의 코드는 .tf 파일 확장자를 가진 일반 텍스트 파일에 저장됩니다. JSON 기반 변형도 있으며 .tf.json 파일 확장자를 사용합니다.

이제 [main.tf](./amp-alertmanager-terraform/main.tf)를 사용하여 Terraform으로 리소스를 배포합니다. Terraform 명령을 실행하기 전에 `region`과 `sns_topic` 변수를 내보냅니다.

```
export TF_VAR_region=<your region>
export TF_VAR_sns_topic=<ARN of the SNS topic used by the SNS receiver>
```

이제 다음 명령을 실행하여 워크스페이스를 프로비저닝합니다:

```
terraform init
terraform plan
terraform apply
```

위 단계가 완료되면 awscurl을 사용하여 엔드포인트를 쿼리하여 엔드투엔드 설정을 검증합니다. `WORKSPACE_ID` 변수를 적절한 Amazon Managed Service for Prometheus 워크스페이스 ID로 교체합니다.

아래 명령을 실행할 때 "metric:recording_rule" 메트릭을 찾으면 recording rule이 성공적으로 생성된 것입니다:

```
awscurl https://aps-workspaces.us-east-1.amazonaws.com/workspaces/$WORKSPACE_ID/api/v1/rules  --service="aps"
```
샘플 출력:
```
"status":"success","data":{"groups":[{"name":"alert-test","file":"rules","rules":[{"state":"firing","name":"metric:alerting_rule","query":"rate(adot_test_counter0[5m]) \u003e 5","duration":0,"labels":{},"annotations":{},"alerts":[{"labels":{"alertname":"metric:alerting_rule"},"annotations":{},"state":"firing","activeAt":"2021-09-16T13:20:35.9664022Z","value":"6.96890019778219e+01"}],"health":"ok","lastError":"","type":"alerting","lastEvaluation":"2021-09-16T18:41:35.967122005Z","evaluationTime":0.018121408}],"interval":60,"lastEvaluation":"2021-09-16T18:41:35.967104769Z","evaluationTime":0.018142997},{"name":"test","file":"rules","rules":[{"name":"metric:recording_rule","query":"rate(adot_test_counter0[5m])","labels":{},"health":"ok","lastError":"","type":"recording","lastEvaluation":"2021-09-16T18:40:44.650001548Z","evaluationTime":0.018381387}],"interval":60,"lastEvaluation":"2021-09-16T18:40:44.649986468Z","evaluationTime":0.018400463}]},"errorType":"","error":""}
```

Alert Manager 엔드포인트를 추가로 쿼리하여 확인할 수 있습니다:
```
awscurl https://aps-workspaces.us-east-1.amazonaws.com/workspaces/$WORKSPACE_ID/alertmanager/api/v2/alerts --service="aps" -H "Content-Type: application/json"
```
샘플 출력:
```
[{"annotations":{},"endsAt":"2021-09-16T18:48:35.966Z","fingerprint":"114212a24ca97549","receivers":[{"name":"default"}],"startsAt":"2021-09-16T13:20:35.966Z","status":{"inhibitedBy":[],"silencedBy":[],"state":"active"},"updatedAt":"2021-09-16T18:44:35.984Z","generatorURL":"/graph?g0.expr=sum%28rate%28envoy_http_downstream_rq_time_bucket%5B1m%5D%29%29+%3E+5\u0026g0.tab=1","labels":{"alertname":"metric:alerting_rule"}}]
```
이것으로 알림이 트리거되어 SNS receiver를 통해 SNS로 전송되었음을 확인합니다.

## 정리

다음 명령을 실행하여 Amazon Managed Service for Prometheus 워크스페이스를 종료합니다. 생성된 EKS 클러스터도 삭제해야 합니다:


```
terraform destroy
```


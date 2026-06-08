# Real User Monitoring

CloudWatch RUM을 사용하면 실제 사용자 세션에서 웹 애플리케이션 성능에 대한 클라이언트 측 데이터를 거의 실시간으로 수집하고 볼 수 있는 실제 사용자 모니터링을 수행할 수 있습니다. 시각화하고 분석할 수 있는 데이터에는 페이지 로드 시간, 클라이언트 측 오류, 사용자 행동 등이 포함됩니다. 이 데이터를 볼 때 전체를 집계하여 볼 수 있을 뿐만 아니라, 고객이 사용하는 브라우저와 디바이스별 분석도 확인할 수 있습니다.

![디바이스 분류를 보여주는 RUM 애플리케이션 모니터 대시보드](../images/rum2.png)

## 웹 클라이언트

CloudWatch RUM 웹 클라이언트는 Node.js 버전 16 이상을 사용하여 개발 및 빌드되었습니다. 코드는 GitHub에서 [공개적으로 이용 가능](https://github.com/aws-observability/aws-rum-web)합니다. [Angular](https://github.com/aws-observability/aws-rum-web/blob/main/docs/cdn_angular.md) 및 [React](https://github.com/aws-observability/aws-rum-web/blob/main/docs/cdn_react.md) 애플리케이션에서 클라이언트를 사용할 수 있습니다.

CloudWatch RUM은 애플리케이션의 로드 시간, 성능 및 언로드 시간에 인지할 수 있는 영향을 미치지 않도록 설계되었습니다.

:::note
    CloudWatch RUM을 위해 수집하는 최종 사용자 데이터는 30일간 보존된 후 자동으로 삭제됩니다. RUM 이벤트를 더 오랜 기간 보관하려면, 앱 모니터가 이벤트의 사본을 계정의 CloudWatch Logs로 전송하도록 설정할 수 있습니다.
:::
:::tip
    웹 애플리케이션에서 광고 차단기에 의한 잠재적 중단을 방지하는 것이 중요한 경우, 자체 콘텐츠 전송 네트워크에서 웹 클라이언트를 호스팅하거나 웹 사이트 내부에 포함시킬 수 있습니다. [GitHub 문서](https://github.com/aws-observability/aws-rum-web/blob/main/docs/cdn_installation.md)에서 자체 오리진 도메인에서 웹 클라이언트를 호스팅하는 방법에 대한 안내를 제공합니다.
:::

## 애플리케이션 인증

CloudWatch RUM을 사용하려면 애플리케이션이 다음 세 가지 옵션 중 하나를 통해 인증되어야 합니다.

1. 이미 설정한 기존 자격 증명 공급자의 인증을 사용합니다.
1. 기존 Amazon Cognito 자격 증명 풀을 사용합니다.
1. CloudWatch RUM이 애플리케이션을 위한 새로운 Amazon Cognito 자격 증명 풀을 생성하도록 합니다.

:::info
    CloudWatch RUM이 애플리케이션을 위한 새로운 Amazon Cognito 자격 증명 풀을 생성하도록 하면 설정에 가장 적은 노력이 듭니다. 이것이 기본 옵션입니다.
:::
:::tip
    CloudWatch RUM은 인증되지 않은 사용자와 인증된 사용자를 분리하도록 구성할 수 있습니다. 자세한 내용은 [이 블로그 게시물](https://aws.amazon.com/blogs/mt/how-to-isolate-signed-in-users-from-guest-users-within-amazon-cloudwatch-rum/)을 참조하세요.
:::
## 데이터 보호 및 프라이버시

CloudWatch RUM 클라이언트는 최종 사용자 데이터 수집을 돕기 위해 쿠키를 사용할 수 있습니다. 이는 사용자 여정 기능에 유용하지만 필수는 아닙니다. 프라이버시 관련 정보에 대한 [상세 문서](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-RUM-privacy.html)를 참조하세요.[^1]

:::tip
    RUM을 사용한 웹 애플리케이션 텔레메트리 수집은 안전하며, 콘솔이나 CloudWatch Logs를 통해 개인 식별 정보(PII)가 노출되지 않습니다. 그러나 웹 클라이언트를 통해 [사용자 정의 속성](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-RUM-custom-metadata.html)을 수집할 수 있다는 점에 유의하세요. 이 메커니즘을 사용하여 민감한 데이터를 노출하지 않도록 주의하세요.
:::

## 클라이언트 코드 스니펫

CloudWatch RUM 웹 클라이언트의 코드 스니펫은 자동으로 생성되지만, 코드 스니펫을 수동으로 수정하여 요구 사항에 맞게 클라이언트를 구성할 수도 있습니다.
:::info
    싱글 페이지 애플리케이션에서 쿠키 생성을 동적으로 활성화하려면 쿠키 동의 메커니즘을 사용하세요. 자세한 내용은 [이 블로그 게시물](https://aws.amazon.com/blogs/mt/how-and-when-to-enable-session-cookies-with-amazon-cloudwatch-rum/)을 참조하세요.
:::
### URL 수집 비활성화

개인 정보가 포함될 수 있는 리소스 URL의 수집을 방지합니다.

:::info
    애플리케이션이 개인 식별 정보(PII)를 포함하는 URL을 사용하는 경우, 코드 스니펫 구성에서 `recordResourceUrl: false`를 설정하여 리소스 URL 수집을 비활성화한 후 애플리케이션에 삽입하는 것을 강력히 권장합니다.
:::

### Active Tracing 활성화

웹 클라이언트에서 `addXRayTraceIdHeader: true`를 설정하여 엔드투엔드 트레이싱을 활성화합니다. 이렇게 하면 CloudWatch RUM 웹 클라이언트가 HTTP 요청에 X-Ray 트레이스 헤더를 추가합니다.

이 선택적 설정을 활성화하면, 앱 모니터에서 샘플링된 사용자 세션 동안 이루어진 XMLHttpRequest 및 fetch 요청이 트레이싱됩니다. 그러면 RUM 대시보드, CloudWatch ServiceLens 콘솔, X-Ray 콘솔에서 이러한 사용자 세션의 트레이스와 세그먼트를 확인할 수 있습니다.

AWS Console에서 애플리케이션 모니터를 설정할 때 체크박스를 클릭하여 active tracing을 활성화하면 코드 스니펫에서 자동으로 설정이 적용됩니다.

![RUM 애플리케이션 모니터의 Active tracing 설정](../images/rum1.png)

### 스니펫 삽입

이전 섹션에서 복사하거나 다운로드한 코드 스니펫을 애플리케이션의 `<head>` 요소 안에 삽입합니다. `<body>` 요소나 다른 `<script>` 태그보다 앞에 삽입하세요.

:::info
    애플리케이션에 여러 페이지가 있는 경우, 모든 페이지에 포함되는 공유 헤더 컴포넌트에 코드 스니펫을 삽입하세요.
:::

:::warning
    웹 클라이언트가 `<head>` 요소에서 가능한 한 초기에 위치하는 것이 매우 중요합니다! 페이지 HTML 하단 근처에서 로드되는 수동적인 웹 트래커와 달리, RUM이 가장 많은 성능 데이터를 캡처하려면 페이지 렌더링 프로세스 초기에 인스턴스화되어야 합니다.
:::
## 사용자 정의 메타데이터 사용

CloudWatch RUM 이벤트의 기본 [이벤트 메타데이터](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-RUM-datacollected.html#CloudWatch-RUM-datacollected-metadata)에 사용자 정의 메타데이터를 추가할 수 있습니다. 세션 속성은 사용자 세션의 모든 이벤트에 추가됩니다. 페이지 속성은 지정된 페이지에만 추가됩니다.

:::info
    사용자 정의 속성의 키 이름으로 [이 페이지](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-RUM-custom-metadata.html#CloudWatch-RUM-custom-metadata-syntax)에 명시된 예약 키워드를 사용하지 마세요.
:::
## 페이지 그룹 사용

:::info
    페이지 그룹을 사용하여 애플리케이션의 여러 페이지를 서로 연결하면, 페이지 그룹에 대한 집계 분석을 확인할 수 있습니다. 예를 들어, 유형과 언어별로 모든 페이지의 집계 페이지 로드 시간을 보고 싶을 수 있습니다.

    ```
    awsRum.recordPageView({ pageId: '/home', pageTags: ['en', 'landing']})
    ```
:::
## 확장 메트릭 사용

CloudWatch RUM이 자동으로 수집하는 [기본 메트릭 세트](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-RUM-metrics.html)가 있으며, 이는 `AWS/RUM`이라는 메트릭 네임스페이스에 게시됩니다. 이들은 RUM이 사용자를 대신하여 생성하는 무료 [제공 메트릭](./metrics.md#vended-metrics)입니다.

:::info
    CloudWatch RUM 메트릭을 추가 차원과 함께 CloudWatch로 전송하여 메트릭에서 더 세밀한 뷰를 제공하도록 하세요.
:::
확장 메트릭에 지원되는 차원은 다음과 같습니다:

- BrowserName
- CountryCode - ISO-3166 형식(2자리 코드)
- DeviceType
- FileType
- OSName
- PageId

그러나 [이 페이지의 안내](https://aws.amazon.com/blogs/mt/create-metrics-and-alarms-for-specific-web-pages-amazon-cloudwatch-rum/)를 사용하여 자체 메트릭과 이에 기반한 알람을 생성할 수도 있습니다. 이 접근 방식을 통해 필요한 모든 데이터 포인트, URI 또는 기타 구성 요소의 성능을 모니터링할 수 있습니다.

[^1]: CloudWatch RUM에서 쿠키를 사용할 때의 고려사항에 대해 논의하는 [블로그 게시물](https://aws.amazon.com/blogs/mt/how-and-when-to-enable-session-cookies-with-amazon-cloudwatch-rum/)을 참조하세요.

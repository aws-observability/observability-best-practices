provider "aws" {
  profile    = "default"
  region     = us-east-1
}
variable "region" {
}
variable "sns_topic" {
}
resource "aws_prometheus_workspace" "amp-terraform-ws" {
  alias = "amp-terraform-ws"
}

resource "aws_prometheus_rule_group_namespace" "amp-terraform-ws" {
  name         = "rules"
  workspace_id = aws_prometheus_workspace.amp-terraform-ws.id
  data         = <<EOF
groups:
  - name: test
    rules:
    - record: metric:recording_rule
      expr: rate(adot_test_counter0[5m])
  - name: alert-test
    rules:
    - alert: metric:alerting_rule
      expr: rate(adot_test_counter0[5m]) > 0.014
      for: 5m    
EOF
}

resource "aws_prometheus_alert_manager_definition" "amp-terraform-ws" {
  workspace_id = aws_prometheus_workspace.amp-terraform-ws.id
  definition   = <<EOF
alertmanager_config: |
  route:
    receiver: 'default'
  receivers:
    - name: 'default'
      sns_configs:
      - topic_arn: ${var.sns_topic}
        sigv4:
          region: ${var.region}
        attributes:
          key: severity
          value: SEV2
EOF
}

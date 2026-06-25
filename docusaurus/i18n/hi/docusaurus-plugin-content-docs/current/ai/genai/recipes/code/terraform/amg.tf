# Amazon Managed Grafana Workspace
resource "aws_grafana_workspace" "ai_obs" {
  name                     = "ai-observability-demo"
  account_access_type      = "CURRENT_ACCOUNT"
  authentication_providers = ["AWS_SSO"]
  permission_type          = "SERVICE_MANAGED"
  data_sources             = ["PROMETHEUS", "CLOUDWATCH", "XRAY"]

  role_arn = aws_iam_role.grafana.arn

  tags = {
    Name        = "ai-observability-demo"
    Environment = "demo"
    ManagedBy   = "terraform"
  }
}

output "amg_workspace_id" {
  description = "Amazon Managed Grafana Workspace ID"
  value       = aws_grafana_workspace.ai_obs.id
}

output "amg_endpoint" {
  description = "Grafana Workspace Endpoint"
  value       = aws_grafana_workspace.ai_obs.endpoint
}

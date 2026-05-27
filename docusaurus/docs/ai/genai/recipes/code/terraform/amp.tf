# Amazon Managed Prometheus Workspace
resource "aws_prometheus_workspace" "ai_obs" {
  alias = "ai-observability-demo"

  tags = {
    Name        = "ai-observability-demo"
    Environment = "demo"
    ManagedBy   = "terraform"
  }
}

output "amp_workspace_id" {
  description = "Amazon Managed Prometheus Workspace ID"
  value       = aws_prometheus_workspace.ai_obs.id
}

output "amp_remote_write_url" {
  description = "AMP Remote Write URL for OTEL Collector"
  value       = "${aws_prometheus_workspace.ai_obs.prometheus_endpoint}api/v1/remote_write"
}

output "amp_endpoint" {
  description = "AMP Query Endpoint"
  value       = aws_prometheus_workspace.ai_obs.prometheus_endpoint
}

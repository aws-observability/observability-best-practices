# AWS Observability Best Practices MCP Server

This repository hosts the AWS Observability Best Practices Model Context Protocol (MCP) server, designed to provide comprehensive observability analysis and monitoring capabilities for AWS environments.

## Features

- **23 Specialized Tools** - Comprehensive set of observability analysis tools for CloudWatch, RUM, SLO management, and more
- **Real-time Analysis** - Uses actual AWS observability data for analysis
- **Best Practices Integration** - Direct integration with AWS Observability Best Practices portal
- **Multi-service Support** - CloudWatch Logs, Metrics, RUM, Database Insights, and SLO monitoring
- **JSON Output** - Structured data for programmatic analysis and integration

## Prerequisites

- **Python 3.11+**: Ensure Python 3.11 or higher is installed
- **Git**: Required for cloning the repository
- **AWS CLI**: Configure your credentials using:
  ```bash
  aws configure --profile [your-profile]
  ```
- **Amazon Q CLI** (optional): For MCP integration - [Installation Guide](https://docs.aws.amazon.com/amazonq/latest/qdeveloper-ug/command-line-installing.html)

## Setup Instructions

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/aws-observability/observability-best-practices.git
   cd observability-best-practices
   ```

2. **Install Dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

3. **Configure AWS Credentials**:
   ```bash
   aws configure
   # Or set environment variables:
   # export AWS_ACCESS_KEY_ID=your_access_key
   # export AWS_SECRET_ACCESS_KEY=your_secret_key
   # export AWS_DEFAULT_REGION=us-east-1
   ```

4. **Apply IAM Permissions**:
   Create an IAM policy with read-only permissions for observability services:
   ```json
   {
     "Version": "2012-10-17",
     "Statement": [
       {
         "Effect": "Allow",
         "Action": [
           "logs:DescribeLogGroups",
           "logs:DescribeLogStreams",
           "logs:GetLogEvents",
           "logs:StartQuery",
           "logs:StopQuery",
           "logs:GetQueryResults",
           "cloudwatch:GetMetricStatistics",
           "cloudwatch:ListMetrics",
           "cloudwatch:DescribeAlarms",
           "rum:GetAppMonitor",
           "rum:GetAppMonitorData",
           "rum:ListAppMonitors",
           "pi:GetResourceMetrics",
           "pi:DescribeDimensionKeys",
           "pi:GetDimensionKeyDetails",
           "rds:DescribeDBInstances",
           "rds:DescribeDBClusters"
         ],
         "Resource": "*"
       }
     ]
   }
   ```

5. **Configure the MCP Client**:
   Update your MCP client settings to run the local server:
   ```json
   {
     "aws-observability-best-practices": {
       "command": "python3",
       "args": [
         "/path/to/aws_observability_best_practices_mcp_server.py"
       ],
       "env": {
         "AWS_DEFAULT_REGION": "us-east-1",
         "AWS_PROFILE": "default",
         "PYTHONPATH": "/path/to/aws-observability-mcp-main"
       },
       "disabled": false
     }
   }
   ```

## Testing

- **Local Development MCP Server**: To test the server locally, you can use the MCP Inspector tool:
  ```bash
  npx @modelcontextprotocol/inspector \
    python3 \
    aws_observability_best_practices_mcp_server.py
  ```

- **Run Test Suite**:
  ```bash
  # Test MCP functionality
  python3 test_mcp_functionality.py
  
  # Test server functionality
  python3 test_observability_server.py
  
  # Test service integrations
  python3 test_services.py
  ```

## Available Tools

### CloudWatch Tools
- **`aws-observability-best-practices___get_metric_data`** - Retrieve CloudWatch metric values with Metrics Insights queries
- **`aws-observability-best-practices___get_metric_statistics`** - Get CloudWatch metric statistics for analysis
- **`aws-observability-best-practices___analyze_metric_anomalies`** - Analyze CloudWatch metrics for anomalies and patterns
- **`aws-observability-best-practices___run_metric_anomaly_detection`** - Run metric anomaly detection analysis
- **`aws-observability-best-practices___describe_alarms`** - Retrieve information about CloudWatch alarms
- **`aws-observability-best-practices___list_dashboards`** - List available CloudWatch dashboards
- **`aws-observability-best-practices___get_dashboard`** - Retrieve dashboard configuration details

### Log Analysis Tools
- **`aws-observability-best-practices___analyze_log_patterns`** - Analyze CloudWatch Logs for patterns, errors, and performance issues
- **`aws-observability-best-practices___analyze_log_retention`** - Analyze and optimize CloudWatch log retention policies

### AWS Service-Specific Analysis
- **`aws-observability-best-practices___run_lambda_metrics_analysis`** - Run Lambda function metrics analysis
- **`aws-observability-best-practices___run_ec2_metrics_analysis`** - Run EC2 instance metrics analysis
- **`aws-observability-best-practices___run_rds_metrics_analysis`** - Run RDS instance metrics analysis
- **`aws-observability-best-practices___get_database_insights_metrics`** - Get Database Insights metrics for RDS instances

### Real User Monitoring (RUM) Tools
- **`aws-observability-best-practices___analyze_rum_performance`** - Analyze AWS RUM performance data for user experience insights
- **`aws-observability-best-practices___run_comprehensive_rum_analysis`** - Run comprehensive RUM analysis report
- **`aws-observability-best-practices___run_web_vitals_analysis`** - Run Core Web Vitals analysis from AWS RUM
- **`aws-observability-best-practices___get_user_experience_metrics`** - Get comprehensive user experience metrics from AWS RUM
- **`aws-observability-best-practices___run_mobile_app_analysis`** - Run mobile app health analysis
- **`aws-observability-best-practices___run_user_journey_analysis`** - Run user journey performance analysis

### SLO Management
- **`aws-observability-best-practices___run_slo_health_assessment`** - Run SLO health assessment
- **`aws-observability-best-practices___analyze_slo_breaches`** - Analyze SLO breaches and their root causes
- **`aws-observability-best-practices___get_slo_status`** - Get Service Level Objective status and health

### Best Practices & Guidance
- **`aws-observability-best-practices___get_recommendations`** - Search AWS Observability Best Practices portal for recommendations

## Example Usage

### Using Amazon Q CLI
```bash
q chat
# Ask questions like:
"Analyze my application logs for errors"
"Show me user experience metrics from RUM"
"Create CloudWatch alarms for my metrics"
"Get recommendations for ADOT implementation"
```

### Direct Tool Usage
```json
{
  "tool": "aws-observability-best-practices___get_recommendations",
  "arguments": {
    "query": "ADOT",
    "service": "adot",
    "recommendation_type": "performance"
  }
}
```

### Log Analysis
```json
{
  "tool": "aws-observability-best-practices___analyze_log_patterns",
  "arguments": {
    "log_group_name": "/aws/lambda/my-function",
    "start_time": "2024-01-01T00:00:00Z",
    "end_time": "2024-01-02T00:00:00Z",
    "query": "ERROR"
  }
}
```

## Project Structure

```
observability-best-practices/
├── services/                                    # AWS Services for observability
│   ├── cloudwatch_logs.py                      # CloudWatch Logs analysis
│   ├── aws_rum.py                              # AWS RUM user experience monitoring
│   ├── database_insights.py                    # RDS Database Insights
│   └── trusted_advisor.py                      # Trusted Advisor checks
├── aws_observability_best_practices_mcp_server.py  # Main MCP server
├── observability_tools.py                      # Tool definitions
├── requirements.txt                            # Python dependencies
├── mcp_observability_config.json               # MCP client configuration
├── test_mcp_functionality.py                   # MCP functionality tests
├── test_observability_server.py                # Unit tests
└── test_services.py                            # Service integration tests
```

## Security and Permissions

The MCP tools require specific AWS permissions to function. Follow these security best practices:

- **Create a read-only IAM role** - Restricts LLM agents from modifying AWS resources
- **Enable CloudTrail** - Tracks API activity across your AWS account
- **Follow least-privilege principles** - Grant only essential read permissions (Describe*, List*, Get*)

## Troubleshooting

### Common Issues

1. **AWS Credentials Not Working**
   ```bash
   aws configure list
   # Or check environment variables
   echo $AWS_ACCESS_KEY_ID
   ```

2. **No Metrics Found**
   - Ensure resources have been running for at least 14 days
   - Verify CloudWatch metrics are enabled
   - Check that you're analyzing the correct region

3. **Permission Errors**
   - Verify IAM permissions are correctly applied
   - Check AWS credentials configuration
   - Ensure the IAM policy includes the required observability permissions

4. **MCP Server Not Starting**
   ```bash
   # Check Python path and dependencies
   python3 -c "import boto3, mcp; print('Dependencies OK')"
   # Test server startup
   python3 aws_observability_best_practices_mcp_server.py
   ```

## Contributing

We welcome contributions to enhance the functionality and coverage of this MCP server. Please follow the standard GitHub workflow:

1. Fork the repository
2. Create a new branch for your feature or bug fix
3. Commit your changes with clear commit messages
4. Push your changes to your fork
5. Submit a pull request to the main repository

Ensure that your code adheres to the project's coding standards and includes appropriate tests.

## License

This project is licensed under the [MIT License](LICENSE).

---

## Key Benefits

- **Real-time Observability** - Uses actual AWS observability data for analysis
- **Comprehensive Monitoring** - Covers logs, metrics, traces, and user experience
- **23 MCP Tools** - Extensive set of observability analysis capabilities
- **JSON Output** - Structured data for programmatic analysis and integration
- **Easy Integration** - Works seamlessly with Amazon Q CLI and MCP clients
- **Best Practices Integration** - Direct access to AWS Observability Best Practices portal

## Expected Results

The AWS Observability Best Practices MCP server can help you:

- **Identify performance issues** in your applications and infrastructure
- **Analyze user experience** through RUM data and web vitals
- **Optimize log retention** and reduce CloudWatch costs
- **Find patterns and anomalies** in your application logs
- **Monitor mobile app performance** and crash rates
- **Get AWS best practices recommendations** for observability implementation
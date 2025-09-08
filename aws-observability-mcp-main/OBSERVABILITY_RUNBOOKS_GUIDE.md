# AWS Observability Runbooks Guide

This guide shows how to use the AWS Observability Runbooks with the MCP server for comprehensive observability analysis.

## What's Included

### Core Observability Services
- **CloudWatch Logs** - Log analysis, error detection, and pattern recognition
- **AWS RUM** - Real User Monitoring for web and mobile applications
- **CloudWatch Metrics** - Infrastructure and application metrics analysis
- **Database Insights** - RDS performance monitoring
- **Trusted Advisor** - AWS best practices and recommendations

### Observability Runbooks
- **Log Analysis** - Error patterns, performance issues, and security events
- **RUM Analysis** - Web vitals, user journey, and mobile app health
- **Metrics Analysis** - EC2, RDS, Lambda performance and anomaly detection
- **Comprehensive Analysis** - Infrastructure health, gap analysis, and SLO assessment

## Quick Start

### 1. Setup
```bash
cd <replace-with-project-folder>/

# Make sure all files are executable
chmod +x aws_observability_best_practices_mcp_server.py
chmod +x runbook_functions.py

# Install dependencies
pip install -r requirements.txt
```

### 2. Configure AWS Credentials
```bash
aws configure
# Or set environment variables:
export AWS_ACCESS_KEY_ID=your_access_key
export AWS_SECRET_ACCESS_KEY=your_secret_key
export AWS_DEFAULT_REGION=us-east-1
```

### 3. Start the MCP Server
```bash
python3 aws_observability_best_practices_mcp_server.py
```

## Available Runbooks

### Log Analysis Runbooks

#### Error Pattern Analysis
```bash
# Analyze error patterns in application logs
"Run log error analysis for my application logs"
```

**Parameters:**
- `log_group_name` (required): CloudWatch Log Group name
- `start_time` (optional): Start time for analysis (ISO format)
- `end_time` (optional): End time for analysis (ISO format)
- `region` (optional): AWS region
- `error_threshold` (optional): Minimum error count to report (default: 10)

#### Performance Issues Analysis
```bash
# Analyze performance issues in logs
"Run log performance analysis for my application logs"
```

**Parameters:**
- `log_group_name` (required): CloudWatch Log Group name
- `start_time` (optional): Start time for analysis (ISO format)
- `end_time` (optional): End time for analysis (ISO format)
- `region` (optional): AWS region
- `response_time_threshold` (optional): Response time threshold in seconds (default: 5.0)

#### Security Events Analysis
```bash
# Analyze security events in logs
"Run log security analysis for my application logs"
```

**Parameters:**
- `log_group_name` (required): CloudWatch Log Group name
- `start_time` (optional): Start time for analysis (ISO format)
- `end_time` (optional): End time for analysis (ISO format)
- `region` (optional): AWS region

#### Comprehensive Log Analysis
```bash
# Run comprehensive log analysis report
"Run comprehensive log analysis for my application logs"
```

**Parameters:**
- `log_group_name` (required): CloudWatch Log Group name
- `start_time` (optional): Start time for analysis (ISO format)
- `end_time` (optional): End time for analysis (ISO format)
- `region` (optional): AWS region

### RUM Analysis Runbooks

#### Web Vitals Analysis
```bash
# Analyze Core Web Vitals from AWS RUM
"Run web vitals analysis for my web application"
```

**Parameters:**
- `app_monitor_name` (required): AWS RUM app monitor name
- `start_time` (optional): Start time for analysis (ISO format)
- `end_time` (optional): End time for analysis (ISO format)
- `region` (optional): AWS region

#### User Journey Analysis
```bash
# Analyze user journey performance
"Run user journey analysis for my web application"
```

**Parameters:**
- `app_monitor_name` (required): AWS RUM app monitor name
- `start_time` (optional): Start time for analysis (ISO format)
- `end_time` (optional): End time for analysis (ISO format)
- `region` (optional): AWS region

#### Mobile App Analysis
```bash
# Analyze mobile app health
"Run mobile app analysis for my mobile application"
```

**Parameters:**
- `app_monitor_name` (required): AWS RUM app monitor name
- `start_time` (optional): Start time for analysis (ISO format)
- `end_time` (optional): End time for analysis (ISO format)
- `region` (optional): AWS region

#### Comprehensive RUM Analysis
```bash
# Run comprehensive RUM analysis report
"Run comprehensive RUM analysis for my application"
```

**Parameters:**
- `app_monitor_name` (required): AWS RUM app monitor name
- `start_time` (optional): Start time for analysis (ISO format)
- `end_time` (optional): End time for analysis (ISO format)
- `region` (optional): AWS region

### Metrics Analysis Runbooks

#### EC2 Metrics Analysis
```bash
# Analyze EC2 instance metrics
"Run EC2 metrics analysis for my instance"
```

**Parameters:**
- `instance_id` (required): EC2 instance ID
- `start_time` (optional): Start time for analysis (ISO format)
- `end_time` (optional): End time for analysis (ISO format)
- `region` (optional): AWS region

#### RDS Metrics Analysis
```bash
# Analyze RDS instance metrics
"Run RDS metrics analysis for my database"
```

**Parameters:**
- `db_instance_identifier` (required): RDS instance identifier
- `start_time` (optional): Start time for analysis (ISO format)
- `end_time` (optional): End time for analysis (ISO format)
- `region` (optional): AWS region

#### Lambda Metrics Analysis
```bash
# Analyze Lambda function metrics
"Run Lambda metrics analysis for my function"
```

**Parameters:**
- `function_name` (required): Lambda function name
- `start_time` (optional): Start time for analysis (ISO format)
- `end_time` (optional): End time for analysis (ISO format)
- `region` (optional): AWS region

#### Metric Anomaly Detection
```bash
# Detect anomalies in CloudWatch metrics
"Run metric anomaly detection for my metrics"
```

**Parameters:**
- `namespace` (required): CloudWatch namespace
- `metric_name` (required): Metric name
- `dimensions` (optional): Metric dimensions
- `start_time` (optional): Start time for analysis (ISO format)
- `end_time` (optional): End time for analysis (ISO format)
- `region` (optional): AWS region
- `threshold_multiplier` (optional): Anomaly detection threshold multiplier (default: 2.0)

### Comprehensive Analysis Runbooks

#### Infrastructure Health Check
```bash
# Run comprehensive infrastructure health check
"Run infrastructure health check for my AWS account"
```

**Parameters:**
- `region` (optional): AWS region

#### Observability Gap Analysis
```bash
# Run observability gap analysis
"Run observability gap analysis for my infrastructure"
```

**Parameters:**
- `region` (optional): AWS region

#### Application Performance Analysis
```bash
# Run comprehensive application performance analysis
"Run application performance analysis for my application"
```

**Parameters:**
- `region` (optional): AWS region

#### User Experience Analysis
```bash
# Run comprehensive user experience analysis
"Run user experience analysis for my application"
```

**Parameters:**
- `region` (optional): AWS region

#### SLO Health Assessment
```bash
# Run SLO health assessment
"Run SLO health assessment for my application"
```

**Parameters:**
- `region` (optional): AWS region

## Example Usage Scenarios

### Scenario 1: Application Error Investigation
```bash
# 1. Run comprehensive log analysis
"Run comprehensive log analysis for /aws/lambda/my-function"

# 2. Check for specific error patterns
"Run log error analysis for /aws/lambda/my-function with error threshold 5"

# 3. Analyze performance issues
"Run log performance analysis for /aws/lambda/my-function with response time threshold 3.0"
```

### Scenario 2: User Experience Optimization
```bash
# 1. Analyze web vitals
"Run web vitals analysis for my-web-app-monitor"

# 2. Analyze user journey
"Run user journey analysis for my-web-app-monitor"

# 3. Run comprehensive RUM analysis
"Run comprehensive RUM analysis for my-web-app-monitor"
```

### Scenario 3: Infrastructure Performance Review
```bash
# 1. Check EC2 performance
"Run EC2 metrics analysis for i-1234567890abcdef0"

# 2. Check RDS performance
"Run RDS metrics analysis for my-database-instance"

# 3. Check Lambda performance
"Run Lambda metrics analysis for my-lambda-function"

# 4. Run infrastructure health check
"Run infrastructure health check"
```

### Scenario 4: Anomaly Detection
```bash
# 1. Detect CPU anomalies
"Run metric anomaly detection for AWS/EC2 CPUUtilization with dimensions [{'Name': 'InstanceId', 'Value': 'i-1234567890abcdef0'}]"

# 2. Detect memory anomalies
"Run metric anomaly detection for AWS/RDS FreeableMemory with dimensions [{'Name': 'DBInstanceIdentifier', 'Value': 'my-database'}]"
```

## Integration with Amazon Q CLI

### Using with Q Chat
```bash
q chat

# Example queries:
"Run comprehensive log analysis for my application logs"
"Analyze web vitals for my web application using RUM"
"Check infrastructure health across all my AWS services"
"Detect anomalies in my CloudWatch metrics"
```

### Using with MCP Clients
The runbooks are available as MCP tools and can be integrated with any MCP-compatible client.

## Best Practices

### 1. Regular Monitoring
- Run infrastructure health checks daily
- Monitor error patterns weekly
- Analyze user experience metrics monthly

### 2. Alerting Setup
- Set up CloudWatch alarms based on runbook findings
- Configure SNS notifications for critical issues
- Implement automated remediation where possible

### 3. Performance Optimization
- Use metrics analysis to identify bottlenecks
- Apply RUM insights to improve user experience
- Optimize based on log analysis recommendations

### 4. Security Monitoring
- Regular security event analysis
- Monitor for unusual patterns
- Implement security best practices

## Troubleshooting

### Common Issues

1. **No Data Available**
   - Ensure resources have been running for at least 24 hours
   - Verify CloudWatch metrics are enabled
   - Check that you're analyzing the correct region

2. **Permission Errors**
   - Verify IAM permissions are correctly applied
   - Check AWS credentials configuration
   - Ensure the IAM policy includes the required observability permissions

3. **RUM Data Not Found**
   - Verify RUM app monitor is configured
   - Check that data collection is enabled
   - Ensure the app monitor name is correct

4. **Import Errors**
   ```bash
   # Check Python path and dependencies
   python3 -c "import boto3, mcp; print('Dependencies OK')"
   ```

### Getting Help

- Run the MCP functionality tests: `python3 test_mcp_functionality.py`
- Run the server tests: `python3 test_observability_server.py`
- Run the service tests: `python3 test_services.py`

## Expected Results

The observability runbooks can help you:

- **Identify performance issues** in your applications and infrastructure
- **Analyze user experience** through RUM data and web vitals
- **Detect anomalies** in your CloudWatch metrics
- **Optimize log retention** and reduce CloudWatch costs
- **Monitor security events** and potential threats
- **Assess infrastructure health** across all AWS services
- **Identify observability gaps** and improvement opportunities

## Contributing

We welcome contributions! Please see our contributing guidelines:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

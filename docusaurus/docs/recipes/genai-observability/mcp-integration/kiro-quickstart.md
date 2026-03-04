# Kiro IDE MCP Server - Quick Start Guide

## What You'll Get

Ask questions in plain English directly in Kiro IDE:
- "Which model is consuming the most tokens?"
- "What's the average latency for Claude Haiku?"
- "Estimate my LLM costs for the last hour"

No need to switch to dashboards or write complex queries!

---

## Step 1: Configure MCP Server in Kiro

### Option A: Use Workspace Configuration (Recommended)

1. **Create the MCP config directory**:
   ```bash
   mkdir -p .kiro/settings
   ```

2. **Copy the MCP configuration**:
   ```bash
   cp AI-OBS_DEMO/kiro-mcp-config.json .kiro/settings/mcp.json
   ```

3. **Update the path in the config** (if needed):
   Open `.kiro/settings/mcp.json` and verify the path to `cloudwatch_mcp_server.py` is correct:
   ```json
   {
     "mcpServers": {
       "ai-observability": {
         "command": "python3",
         "args": [
           "/Users/vggargav/Documents/AI-Obs_demo/AI-OBS_DEMO/mcp-server/cloudwatch_mcp_server.py"
         ],
         "env": {
           "AWS_REGION": "us-east-1"
         },
         "disabled": false,
         "autoApprove": []
       }
     }
   }
   ```

### Option B: Use User-Level Configuration (Global)

1. **Create the user config directory**:
   ```bash
   mkdir -p ~/.kiro/settings
   ```

2. **Copy the configuration**:
   ```bash
   cp AI-OBS_DEMO/kiro-mcp-config.json ~/.kiro/settings/mcp.json
   ```

---

## Step 2: Verify AWS Credentials

The MCP server needs AWS credentials to query CloudWatch:

```bash
# Check your AWS credentials are configured
aws sts get-caller-identity

# Should show:
# {
#     "UserId": "...",
#     "Account": "578787088678",
#     "Arn": "arn:aws:iam::578787088678:user/Vipul-G"
# }
```

If not configured, set up AWS credentials:
```bash
aws configure
# Enter your AWS Access Key ID
# Enter your AWS Secret Access Key
# Default region: us-east-1
# Default output format: json
```

---

## Step 3: Test MCP Server (Optional)

Before using in Kiro, verify the MCP server works:

```bash
python3 AI-OBS_DEMO/test-mcp-server.py
```

You should see output like:
```
Testing CloudWatch MCP Server
==============================

1. Testing get_token_usage...
✅ Success: {
  "token_type": "input",
  "time_range_hours": 1,
  "models": [...]
}

2. Testing get_model_latency...
✅ Success: {...}
```

---

## Step 4: Restart Kiro IDE

For Kiro to load the MCP configuration:

1. **Save all your work**
2. **Quit Kiro completely** (Cmd+Q on Mac, or File → Exit)
3. **Reopen Kiro**
4. **Open your workspace** (the folder containing `.kiro/settings/mcp.json`)

---

## Step 5: Verify MCP Server is Connected

1. **Open the Kiro Feature Panel** (left sidebar)
2. **Look for "MCP Servers" section**
3. **You should see**: `ai-observability` with a green status indicator
4. **If you see a red indicator**: Click on it to see error details

### Troubleshooting Connection Issues

If the server shows as disconnected:

1. **Check the MCP Server view** in Kiro's left panel
2. **Click "Reconnect"** if available
3. **Check logs**: Look for error messages in the MCP server output
4. **Verify the Python path**: Make sure `python3` is in your PATH
5. **Check file permissions**: Ensure `cloudwatch_mcp_server.py` is readable

---

## Step 6: Use Natural Language Queries

### In Kiro Chat

1. **Open Kiro Chat** (Cmd+L or click chat icon)
2. **Type your question** in plain English:

```
Which model is consuming the most tokens?
```

3. **Kiro will automatically**:
   - Recognize this as an observability query
   - Call the MCP server's `get_token_usage` tool
   - Return structured results

### Example Queries to Try

#### 1. Token Usage
```
Which model is consuming the most tokens?
```

**Expected Response**:
```json
{
  "token_type": "input",
  "time_range_hours": 1,
  "models": [
    {
      "model": "anthropic.claude-3-haiku-20240307-v1:0",
      "total_tokens": 475
    },
    {
      "model": "gpt-4o",
      "total_tokens": 312
    }
  ]
}
```

#### 2. Latency Statistics
```
What's the average latency for all models?
```

**Expected Response**:
```json
{
  "time_range_hours": 1,
  "models": [
    {
      "model": "anthropic.claude-3-sonnet-20240229-v1:0",
      "avg_latency_ms": 2567.89
    },
    {
      "model": "gpt-4o",
      "avg_latency_ms": 2234.12
    }
  ]
}
```

#### 3. Cost Estimation
```
Estimate the cost of LLM usage for the last hour
```

**Expected Response**:
```json
{
  "time_range_hours": 1,
  "total_estimated_cost_usd": 0.0142,
  "cost_breakdown": [
    {
      "model": "anthropic.claude-3-haiku-20240307-v1:0",
      "input_tokens": 475,
      "output_tokens": 8084,
      "estimated_cost_usd": 0.0102
    }
  ]
}
```

#### 4. Request Volume
```
How many requests have been made in the last hour?
```

#### 5. Model Comparison
```
Compare all models by latency and token usage
```

---

## Step 7: Advanced Usage

### Custom Time Ranges

You can specify custom time ranges in your queries:

```
Show me token usage for the last 2 hours
```

```
What was the latency for Claude Haiku in the last 3 hours?
```

### Specific Model Queries

Query specific models using their full IDs:

```
What's the latency for anthropic.claude-3-haiku-20240307-v1:0?
```

### Multi-Metric Queries

Ask for comprehensive analysis:

```
Give me a complete overview of Claude Haiku performance
```

---

## Troubleshooting

### "No data" Responses

**Problem**: MCP server returns empty results

**Solutions**:
1. Run the demo to generate metrics:
   ```bash
   python3 AI-OBS_DEMO/multi-cloud-demo.py
   ```
2. Wait 1-2 minutes for CloudWatch to ingest metrics
3. Try increasing time range: "Show me token usage for the last 2 hours"

### MCP Server Not Responding

**Problem**: Queries timeout or fail

**Solutions**:
1. Check MCP server status in Kiro's MCP panel
2. Verify AWS credentials: `aws sts get-caller-identity`
3. Check CloudWatch permissions
4. Restart Kiro to reload MCP configuration

### Permission Errors

**Problem**: "AccessDenied" errors in responses

**Solutions**:
1. Verify IAM permissions include:
   - `cloudwatch:GetMetricStatistics`
   - `cloudwatch:ListMetrics`
2. Check AWS region is set to `us-east-1`

### Python Path Issues

**Problem**: "python3: command not found"

**Solutions**:
1. Find your Python path: `which python3`
2. Update the MCP config with the full path:
   ```json
   "command": "/usr/local/bin/python3"
   ```

---

## Tips for Best Results

### 1. Generate Fresh Data

Before querying, run the demo to ensure you have recent metrics:
```bash
python3 AI-OBS_DEMO/multi-cloud-demo.py
```

### 2. Use Natural Language

The MCP server understands natural questions:
- ✅ "Which model costs the most?"
- ✅ "Show me latency for all models"
- ✅ "How many tokens did Claude use?"

### 3. Be Specific When Needed

For specific models, use their full IDs:
```
What's the latency for anthropic.claude-3-haiku-20240307-v1:0?
```

### 4. Combine with Code Context

You can ask questions while viewing code:
```
Based on this code, estimate the cost if we run it 1000 times
```

---

## Available MCP Tools

The MCP server provides 5 tools:

| Tool | Description | Example Query |
|------|-------------|---------------|
| `get_token_usage` | Token consumption by model | "Which model uses the most tokens?" |
| `get_model_latency` | Latency statistics | "What's the average latency?" |
| `get_request_count` | Request volume | "How many requests were made?" |
| `get_cost_estimate` | Cost estimation | "Estimate my LLM costs" |
| `compare_models` | Multi-metric comparison | "Compare all models" |

---

## Next Steps

### Take Screenshots for Demo

1. Run the demo: `python3 AI-OBS_DEMO/multi-cloud-demo.py`
2. Wait 1-2 minutes
3. Ask: "Estimate the cost of LLM usage for the last hour"
4. Take screenshot showing query + response

### Customize for Your Use Case

Edit `mcp-server/cloudwatch_mcp_server.py` to:
- Add custom metrics
- Change cost calculation formulas
- Add new query tools
- Integrate with other AWS services

### Share with Your Team

1. Commit the `.kiro/settings/mcp.json` to your repo
2. Team members will automatically get MCP access
3. Everyone can query observability data from their IDE

---

## Resources

- **MCP Server Code**: `AI-OBS_DEMO/mcp-server/cloudwatch_mcp_server.py`
- **Test Script**: `AI-OBS_DEMO/test-mcp-server.py`
- **Example Queries**: `AI-OBS_DEMO/MCP-DEMO-QUERIES.md`
- **Architecture**: `AI-OBS_DEMO/ARCHITECTURE.md`

---

## Quick Reference Card

```bash
# Setup
mkdir -p .kiro/settings
cp AI-OBS_DEMO/kiro-mcp-config.json .kiro/settings/mcp.json

# Test
python3 AI-OBS_DEMO/test-mcp-server.py

# Generate Data
python3 AI-OBS_DEMO/multi-cloud-demo.py

# Restart Kiro
# Cmd+Q → Reopen

# Query in Chat
"Which model is consuming the most tokens?"
```

---

**Questions?** Check `MCP-DEMO-QUERIES.md` for more examples or open an issue on GitHub.

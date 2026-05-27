# MCP Server Demo Queries

This guide provides example natural language queries you can use to test the MCP server integration with Kiro IDE.

## Prerequisites

1. Make sure you've set up the MCP server in Kiro (see `SETUP-MCP-KIRO.md`)
2. Run the multi-cloud demo to generate telemetry: `python3 AI-OBS_DEMO/multi-cloud-demo.py`
3. Wait 1-2 minutes for metrics to appear in CloudWatch

## Example Queries for Screenshots

### 1. Token Usage Analysis

**Query**: "Which model is consuming the most tokens?"

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
    },
    {
      "model": "gemini-1.5-pro",
      "total_tokens": 289
    }
  ]
}
```

**Alternative Queries**:
- "Show me input token usage for the last hour"
- "How many output tokens has Claude Haiku used?"
- "Compare token consumption across all models"

---

### 2. Latency Statistics

**Query**: "What is the average latency for Claude Haiku?"

**Expected Response**:
```json
{
  "model": "anthropic.claude-3-haiku-20240307-v1:0",
  "avg_latency_ms": 1234.56,
  "max_latency_ms": 1876.23,
  "min_latency_ms": 892.45,
  "time_range_hours": 1,
  "datapoints": 31
}
```

**Alternative Queries**:
- "Show me latency statistics for all models"
- "Which model has the highest latency?"
- "What's the fastest model in terms of response time?"

---

### 3. Request Volume

**Query**: "How many requests have been made in the last hour?"

**Expected Response**:
```json
{
  "time_range_hours": 1,
  "models": [
    {
      "model": "anthropic.claude-3-sonnet-20240229-v1:0",
      "total_requests": 81
    },
    {
      "model": "anthropic.claude-3-haiku-20240307-v1:0",
      "total_requests": 31
    },
    {
      "model": "gpt-4o",
      "total_requests": 21
    }
  ]
}
```

**Alternative Queries**:
- "Show me request counts by model"
- "Which model is being used the most?"
- "How many times was GPT-4o invoked?"

---

### 4. Cost Estimation

**Query**: "Estimate the cost of LLM usage for the last hour"

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
    },
    {
      "model": "anthropic.claude-3-sonnet-20240229-v1:0",
      "input_tokens": 312,
      "output_tokens": 2456,
      "estimated_cost_usd": 0.0031
    }
  ],
  "note": "Costs are estimates based on Claude 3 Haiku pricing ($0.25/$1.25 per 1M tokens)"
}
```

**Alternative Queries**:
- "What's my estimated LLM cost today?"
- "How much am I spending on Claude models?"
- "Calculate the cost per request"

---

### 5. Model Comparison

**Query**: "Compare all models by latency and token usage"

**Expected Response**:
```json
{
  "time_range_hours": 1,
  "latency": {
    "models": [
      {
        "model": "anthropic.claude-3-sonnet-20240229-v1:0",
        "avg_latency_ms": 2567.89
      },
      {
        "model": "gpt-4o",
        "avg_latency_ms": 2234.12
      },
      {
        "model": "anthropic.claude-3-haiku-20240307-v1:0",
        "avg_latency_ms": 1234.56
      }
    ]
  },
  "input_tokens": {
    "models": [
      {
        "model": "anthropic.claude-3-haiku-20240307-v1:0",
        "total_tokens": 475
      },
      {
        "model": "anthropic.claude-3-sonnet-20240229-v1:0",
        "total_tokens": 312
      }
    ]
  },
  "output_tokens": {
    "models": [
      {
        "model": "anthropic.claude-3-haiku-20240307-v1:0",
        "total_tokens": 8084
      },
      {
        "model": "anthropic.claude-3-sonnet-20240229-v1:0",
        "total_tokens": 2456
      }
    ]
  },
  "requests": {
    "models": [
      {
        "model": "anthropic.claude-3-sonnet-20240229-v1:0",
        "total_requests": 81
      },
      {
        "model": "anthropic.claude-3-haiku-20240307-v1:0",
        "total_requests": 31
      }
    ]
  }
}
```

**Alternative Queries**:
- "Show me a comparison of all active models"
- "Which model offers the best performance?"
- "Compare Claude Haiku vs Claude Sonnet"

---

## Advanced Queries

### Time Range Queries

**Query**: "Show me token usage for the last 2 hours"

The MCP server supports custom time ranges using the `hours` parameter.

### Specific Model Queries

**Query**: "What's the latency for anthropic.claude-3-haiku-20240307-v1:0?"

You can query specific models using their full model IDs.

### Multi-Metric Queries

**Query**: "Give me a complete overview of Claude Haiku performance"

This will trigger the `compare_models` tool to show all metrics for the specified model.

---

## Tips for Taking Screenshots

### Best Queries for Demo Screenshots

1. **Cost Analysis** (Most Impressive):
   ```
   "Estimate the cost of LLM usage for the last hour"
   ```
   Shows real business value with dollar amounts.

2. **Model Comparison** (Most Comprehensive):
   ```
   "Compare all models by latency and token usage"
   ```
   Shows the power of unified observability across providers.

3. **Simple Query** (Most Accessible):
   ```
   "Which model is consuming the most tokens?"
   ```
   Easy to understand, shows natural language capability.

### Screenshot Composition Tips

1. **Show the Query**: Make sure the natural language query is visible
2. **Show the Response**: Include the full JSON response with data
3. **Show Context**: Include IDE context (file explorer, terminal) if possible
4. **Highlight Key Data**: Point out interesting insights in the response

### Example Screenshot Flow

1. Open Kiro IDE
2. Open the chat panel
3. Type: "Estimate the cost of LLM usage for the last hour"
4. Wait for MCP server to respond
5. Take screenshot showing:
   - Your natural language query
   - The structured JSON response
   - Cost breakdown by model
   - Total estimated cost

---

## Troubleshooting

### "No data" Response

**Problem**: MCP server returns empty results

**Solutions**:
1. Run the demo to generate metrics: `python3 AI-OBS_DEMO/multi-cloud-demo.py`
2. Wait 1-2 minutes for CloudWatch to ingest metrics
3. Try increasing time range: "Show me token usage for the last 2 hours"

### MCP Server Not Responding

**Problem**: Queries timeout or fail

**Solutions**:
1. Check MCP server is running: Look for "ai-observability" in Kiro MCP panel
2. Verify AWS credentials: `aws sts get-caller-identity`
3. Check CloudWatch permissions: Ensure read access to CloudWatch metrics
4. Restart Kiro to reload MCP configuration

### Permission Errors

**Problem**: "AccessDenied" errors in responses

**Solutions**:
1. Verify IAM permissions include `cloudwatch:GetMetricStatistics`
2. Verify IAM permissions include `cloudwatch:ListMetrics`
3. Check AWS region is set to `us-east-1` in MCP config

---

## Testing the MCP Server Directly

You can also test the MCP server directly without Kiro:

```bash
python3 AI-OBS_DEMO/test-mcp-server.py
```

This will run all 5 MCP tools and display the results, useful for:
- Verifying the MCP server works
- Debugging issues
- Understanding the response format
- Generating sample data for documentation

---

## Next Steps

After taking screenshots:

1. **Add to Blog Post**: Include screenshots in the "Demo Results" section
2. **Create Tutorial**: Use screenshots to create a step-by-step guide
3. **Share with Team**: Demonstrate the natural language query capability
4. **Gather Feedback**: Ask developers what other queries would be useful

---

## Additional Resources

- **MCP Server Code**: `AI-OBS_DEMO/mcp-server/cloudwatch_mcp_server.py`
- **Setup Guide**: `AI-OBS_DEMO/SETUP-MCP-KIRO.md`
- **Test Script**: `AI-OBS_DEMO/test-mcp-server.py`
- **Kiro Config**: `AI-OBS_DEMO/kiro-mcp-config.json`

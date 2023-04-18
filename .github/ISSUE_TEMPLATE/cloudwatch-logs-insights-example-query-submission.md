---
name: CloudWatch Logs Insights Example Query Submission
about: Issue template for submitting an example query to the Observability Best Practices
  Guide.
title: Logs Insights Example Query
labels: ''
assignees: lewinkedrs

---

## CloudWatch Query Statement
ex:
```
fields @timestamp, @message, @logStream, @log
| sort @timestamp desc
| limit 20
```

## What is the purpose of this query?
ex:
Pull the last twenty lines of the log and sort in descending order.

## How do I use this query?
ex:
Use this query to see the last 20 requests.

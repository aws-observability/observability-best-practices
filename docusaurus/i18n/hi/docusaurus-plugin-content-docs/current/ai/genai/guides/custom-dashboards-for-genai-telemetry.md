# GenAI टेलीमेट्री के लिए कस्टम डैशबोर्ड बनाना

## कस्टम डैशबोर्ड क्यों?

जब आप Bedrock Model Invocation Logging सक्षम करते हैं और ADOT ऑटो-इंस्ट्रुमेंटेशन एजेंट डिप्लॉय करते हैं, तो AWS आपको out-of-the-box डैशबोर्ड के साथ शुरुआत प्रदान करता है। Bedrock स्वचालित रूप से invocation count, latency, token counts, और throttle मेट्रिक्स प्रदान करता है। Application Signals स्वचालित रूप से service maps और SLO views जनरेट करता है। यह एक मजबूत आधार है -- लेकिन यह पूरी तस्वीर नहीं है।

Out-of-the-box डैशबोर्ड "क्या मेरा AI अभी ठीक है?" का जवाब देते हैं। वे उन सवालों का जवाब नहीं देते जो आपकी DevOps, FinOps, और सुरक्षा टीमें वास्तव में पूछती हैं:

- कौन सा caller हमारे Bedrock बजट का 80% खर्च कर रहा है?
- दोपहर 3 बजे की deployment के बाद completion rate क्यों गिरी?
- क्या cross-region inference वास्तव में मदद कर रहा है, या latency बढ़ा रहा है?
- कौन से prompts को caching से सबसे अधिक लाभ होगा?
- PII लौटाने वाला मॉडल कॉल किसने किया, और उन्होंने क्या पूछा?
- क्या मेरा एजेंट tool layer पर विफल हो रहा है या model layer पर?

इन सवालों का जवाब देने के लिए कस्टम queries की आवश्यकता होती है जो log groups को join करती हैं, tokens से cost की गणना करती हैं, IAM role द्वारा segment करती हैं, और span trees में drill down करती हैं। raw टेलीमेट्री पहले से बह रही है -- मूल्य इस बात में है कि आप इसे कैसे काटते हैं।

### एक पाइपलाइन, विभिन्न दर्शक

आपकी GenAI टेलीमेट्री तीन log groups में आती है: `bedrock-model-invocation-logging`, `aws/spans`, और `/aws/bedrock-agentcore/runtimes/<agent>`। डेटा नहीं बदलता, लेकिन आप इसे कैसे प्रस्तुत करते हैं वह बदलता है। एक ही invocation डेटा बन जाता है:

- **DevOps डैशबोर्ड** -- completion rate, component latency, और agent error drill-down दिखाता है -- "क्या सिस्टम काम कर रहा है?" पर केंद्रित
- **FinOps डैशबोर्ड** -- model-wise cost, top spenders, और caching opportunities दिखाता है -- "क्या हम कुशलता से खर्च कर रहे हैं?" पर केंद्रित

यह गाइड आपको दोनों बनाने के लिए queries प्रदान करता है। अपने दर्शकों के अनुसार relevant sections चुनें। प्रत्येक query अपना source log group, view type, query language, और किस प्रश्न का उत्तर देती है यह दर्शाती है।

अंतर्निहित data pipelines के अवलोकन और प्रत्येक को कब सक्षम करना है, इसके लिए [AWS पर GenAI ऑब्ज़र्वेबिलिटी](../genai-observability-on-aws) देखें।

---

## DevOps पर्सोना डैशबोर्ड

DevOps टीमों को यह जवाब देना होता है: *क्या मेरा GenAI वर्कलोड स्वस्थ है, और bottlenecks कहाँ हैं?* ये queries invocation health, agent workflow विश्वसनीयता, और performance bottlenecks पर केंद्रित हैं।

![GenAI DevOps Dashboard](../../../images/GenAI/genai-devops-dashboard.png)

### मॉडल Invocation Health

#### 1. मॉडल-वार Stop Reason वितरण

- **उद्देश्य:** सभी मॉडलों में सभी stop reasons के वितरण को दिखाता है। प्रत्येक Bedrock invocation एक stop reason के साथ समाप्त होती है -- `end_turn` (प्राकृतिक समापन), `tool_use` (tool calling), `max_tokens` (truncated), `stop_sequence` (boundary hit), या error। उदाहरण: आप पा सकते हैं कि आपके summarization model की 15% calls `max_tokens` के साथ समाप्त होती हैं -- जिसका अर्थ है कि उपयोगकर्ताओं को काटे हुए responses मिल रहे हैं -- जबकि आपका classification model 100% `end_turn` है।
- **स्रोत:** `bedrock-model-invocation-logging`
- **व्यू:** Bar chart
- **Query भाषा:** CloudWatch Logs Insights
- **Query:**

```sql
fields @timestamp, modelId, operation, requestId,
       output.outputBodyJson.stopReason as stop_reason
| filter schemaType = "ModelInvocationLog"
| filter ispresent(output.outputBodyJson.stopReason)
        or ispresent(output.outputBodyJson.error)
| stats count() as stop_reason_count by stop_reason, modelId
```

- **अलार्म:** कोई भी non-healthy stop reason (`end_turn`, `tool_use`, या `stop_sequence` नहीं) जो मॉडल की कुल invocations का 10% से अधिक हो।

#### 2. Completion Rate बनाम Truncation (प्रति घंटा)

- **उद्देश्य:** सफल completions (`end_turn` + `tool_use`) बनाम truncated responses (`max_tokens`) का प्रति घंटा अनुपात ट्रैक करता है। यह आपका SLA मेट्रिक है -- 95%+ completion rate लक्ष्य रखें। उदाहरण: यदि दोपहर 3 से 4 बजे के बीच completion rate 97% से 88% तक गिरती है, तो कुछ बदला है -- एक नया prompt template, model update, या configuration change अधिक truncation पैदा कर रहा है।
- **स्रोत:** `bedrock-model-invocation-logging`
- **व्यू:** Time series (stacked)
- **Query भाषा:** CloudWatch Logs Insights
- **Query:**

```sql
fields @timestamp, modelId,
       output.outputBodyJson.stopReason as stop_reason
| filter schemaType = "ModelInvocationLog"
| filter ispresent(output.outputBodyJson.stopReason)
| stats sum(stop_reason = "end_turn" or stop_reason = "tool_use") as ok,
        sum(stop_reason = "max_tokens") as truncated
  by bin(@timestamp, 1h) as hour
| sort hour desc
```

- **अलार्म:** `ok / (ok + truncated)` लगातार 2 घंटे 95% से नीचे।

#### 3. Token दक्षता -- बर्बाद Tokens खोजें

- **उद्देश्य:** उच्च input tokens (2000 से अधिक) भेजने वाले लेकिन कम output (200 से कम) प्राप्त करने वाले callers को खोजता है -- token बर्बादी का संकेत। उदाहरण: एक-शब्द label (3 tokens) पाने के लिए पूरी product catalog (8000 tokens) भेजने वाली classification pipeline। `caller_arn` कॉलम आपको बताता है कि कौन सी service या role जिम्मेदार है, ताकि आप prompts restructure करने की लक्षित बातचीत कर सकें।
- **स्रोत:** `bedrock-model-invocation-logging`
- **व्यू:** Table
- **Query भाषा:** CloudWatch Logs Insights
- **Query:**

```sql
fields @timestamp, modelId, operation,
       input.inputTokenCount as input_tokens,
       output.outputTokenCount as output_tokens,
       identity.arn as caller_arn
| filter schemaType = "ModelInvocationLog"
| filter input_tokens > 2000 and output_tokens < 200
| stats count() as inefficient_requests,
        avg(input_tokens) as avg_input_tokens,
        avg(output_tokens) as avg_output_tokens,
        sum(input_tokens) as total_wasted_tokens
  by modelId, operation, caller_arn
| sort total_wasted_tokens desc
```

- **अलार्म:** 24 घंटे में `total_wasted_tokens` 100K से अधिक वाला कोई भी caller।

#### 4. Cross-Region Inference Latency

- **उद्देश्य:** प्रत्येक मॉडल के लिए inference regions में latency percentiles की तुलना करता है। यदि आपने cross-region inference सक्षम किया है, तो कुछ requests उच्च latency वाले दूरस्थ regions में route होती हैं। उदाहरण: आपके summarization model का P95 us-west-2 में 12s है लेकिन us-east-1 में 4s -- us-east-1 को prefer करने के लिए inference profile configure करने से P95 40% कम हो सकता है।
- **स्रोत:** `bedrock-model-invocation-logging`
- **व्यू:** Table
- **Query भाषा:** CloudWatch Logs Insights
- **Query:**

```sql
fields @timestamp, modelId, region, inferenceRegion,
       output.outputBodyJson.metrics.latencyMs as latency
| filter schemaType = "ModelInvocationLog"
| filter ispresent(inferenceRegion)
| filter latency > 0
| stats count() as invocations,
        avg(latency) as avg_latency,
        pct(latency, 50) as p50_latency,
        pct(latency, 95) as p95_latency,
        pct(latency, 99) as p99_latency,
        stddev(latency) as latency_stddev
  by modelId, region, inferenceRegion
| sort modelId asc, avg_latency asc
```

- **अलार्म:** किसी विशिष्ट region में कोई भी model P95 10 सेकंड से अधिक।

#### 5. Prompt Caching अवसर

- **उद्देश्य:** बार-बार call किए जाने वाले लेकिन शून्य या कम cache hits वाले prompts खोजता है -- सबसे बड़े caching ROI अवसर। उदाहरण: 500 बार उपयोग किया गया system prompt जिसमें zero cache reads हैं, इसका मतलब है कि आप हर बार पूरी कीमत चुका रहे हैं -- caching सक्षम करने से उन input tokens पर 90% बचत हो सकती है।
- **स्रोत:** `bedrock-model-invocation-logging`
- **व्यू:** Table
- **Query भाषा:** CloudWatch Logs Insights
- **Query:**

```sql
fields @timestamp,
       input.inputBodyJson.messages.0.content.0.text as promptText,
       input.inputTokenCount as inputTokens,
       input.cacheReadInputTokenCount as cacheReadTokens,
       input.cacheWriteInputTokenCount as cacheWriteTokens,
       modelId
| filter input.inputTokenCount > 0
| stats sum(input.inputTokenCount) as totalInputTokens,
        count(*) as invocationCount,
        avg(input.inputTokenCount) as avgInputTokens,
        sum(input.cacheReadInputTokenCount) as totalCacheReadTokens,
        sum(input.cacheWriteInputTokenCount) as totalCacheWriteTokens
  by promptText, modelId
| filter invocationCount > 1
| sort totalInputTokens desc
```

- **अलार्म:** कोई नहीं (अनुकूलन समीक्षा, साप्ताहिक चलाएँ)।

### Agent Workflow Health

#### 6. Agent Traces बनाम Errors (प्रति घंटा)

- **उद्देश्य:** कुल agent traces के साथ error spans की प्रति घंटा गणना -- आपका agent-level विश्वसनीयता मेट्रिक। उदाहरण: यदि total_traces 500/hour है लेकिन error_spans दोपहर 3 बजे 5 से 80 तक बढ़ जाता है, तो agent workflow में कुछ टूट गया है। यह उन समस्याओं को पकड़ता है जो model-level मेट्रिक्स miss करते हैं -- model सफल हो सकता है जबकि agent tool timeouts या guardrail rejections के कारण विफल हो सकता है।
- **स्रोत:** `aws/spans`
- **व्यू:** Time series
- **Query भाषा:** CloudWatch Logs Insights
- **Query:**

```sql
fields attributes.session.id as sessionId, traceId,
       status.code as statusCode, durationNano/1000000 as durationMs
| filter ispresent(sessionId)
| stats count_distinct(traceId) as total_traces,
        sum(statusCode = "ERROR") as error_spans
  by bin(@timestamp, 1h) as hour
| sort hour desc
```

- **अलार्म:** `error_spans / total_traces` 15 मिनट के लिए 10% से अधिक।

#### 7. Span Error Drill-Down

- **उद्देश्य:** जब आप जानते हैं कि agent errors हैं, तो यह बताता है कि कौन सा component विफल हो रहा है -- knowledge base retrieval, guardrail check, tool execution, या model invocation। उदाहरण: 70% errors HTTP 503 के साथ KB retrieval span में हैं -- आपका OpenSearch cluster load में throttle हो रहा है, model समस्या नहीं है।
- **स्रोत:** `aws/spans`
- **व्यू:** Table
- **Query भाषा:** CloudWatch Logs Insights
- **Query:**

```sql
fields name as spanName,
       resource.attributes.service.name as serviceName,
       status.code as statusCode,
       status.message as statusMessage,
       attributes.http.response.status_code as httpStatus,
       durationNano/1000000 as durationMs,
       traceId, spanId, parentSpanId
| filter resource.attributes.aws.service.type = "gen_ai_agent"
| filter status.code = "ERROR"
        or attributes.http.response.status_code >= 400
| stats count() as error_count,
        count_distinct(traceId) as affected_traces,
        avg(durationMs) as avg_error_duration_ms,
        earliest(statusMessage) as error_message
  by spanName, serviceName, httpStatus
| sort error_count desc
```

- **अलार्म:** 15 मिनट में 10 से अधिक errors वाला कोई भी component।

#### 8. Component Performance Breakdown (प्रति घंटा)

- **उद्देश्य:** पूर्ण percentile distributions (P50, P95, P99) के साथ agent component-wise प्रति घंटा performance। दिखाता है कि agent का समय कहाँ बीतता है और कौन सा component bottleneck है। उदाहरण: guardrail check औसत 2.8s (P95: 4.1s) है जबकि model call औसत 1.2s (P95: 2.0s) है -- पहले guardrail optimize करें, इसका model optimization से अधिक प्रभाव है।
- **स्रोत:** `aws/spans`
- **व्यू:** Table
- **Query भाषा:** CloudWatch Logs Insights
- **Query:**

```sql
fields name as spanName,
       resource.attributes.service.name as serviceName,
       durationNano/1000000 as durationMs,
       traceId
| filter resource.attributes.aws.service.type = "gen_ai_agent"
| filter ispresent(spanName)
| stats count() as invocations,
        avg(durationMs) as avg_duration_ms,
        pct(durationMs, 50) as p50_duration_ms,
        pct(durationMs, 95) as p95_duration_ms,
        pct(durationMs, 99) as p99_duration_ms,
        sum(durationMs) as total_time_ms
  by bin(1h), spanName, serviceName
| sort total_time_ms desc
```

- **अलार्म:** कोई भी component P95 5000ms से अधिक।

---

## FinOps पर्सोना डैशबोर्ड

FinOps टीमों को यह जवाब देना होता है: *हमारा GenAI खर्च कहाँ जा रहा है, और हम इसे कैसे optimize करें?* ये queries token usage से cost की गणना करती हैं, teams और roles को spend attribute करती हैं, और prompt caching जैसे optimization अवसरों को सामने लाती हैं।

![GenAI FinOps Dashboard](../../../images/GenAI/genai-finops-dashboard.png)

सभी FinOps queries per-token pricing पर आधारित cost calculation pattern का उपयोग करती हैं। `strcontains` multiplication pattern प्रत्येक model को उसके per-token rate से map करता है। Bedrock pricing बदलने पर pricing values अपडेट करें।

### Executive सारांश

#### 9. कुल अनुमानित खर्च

- **उद्देश्य:** चयनित समय सीमा में सभी models के कुल GenAI spend दिखाने वाला single-value widget। यह आपका headline KPI है -- वह संख्या जो CFO को रुचिकर लगती है।
- **स्रोत:** `bedrock-model-invocation-logging`
- **व्यू:** Single value
- **Query भाषा:** CloudWatch Logs Insights
- **Query:**

```sql
fields coalesce(output.outputBodyJson.usage.inputTokens,
    output.outputBodyJson.usage.prompt_tokens,
    output.outputBodyJson.usage.input_tokens,
    input.inputTokenCount) as inputTokens,
  coalesce(output.outputBodyJson.usage.outputTokens,
    output.outputBodyJson.usage.completion_tokens,
    output.outputBodyJson.usage.output_tokens,
    output.outputTokenCount) as outputTokens
| fields (inputTokens *
    ((strcontains(modelId, "nova-micro") * 0.000000035) +
    (strcontains(modelId, "nova-lite") * 0.00000006) +
    (strcontains(modelId, "nova-pro") * 0.0000008) +
    (strcontains(modelId, "claude-sonnet-4-6") * 0.000003) +
    (strcontains(modelId, "claude-sonnet-4-5") * 0.000003) +
    (strcontains(modelId, "claude-haiku") * 0.000001) +
    (strcontains(modelId, "llama4-maverick") * 0.0000002) +
    (strcontains(modelId, "llama4-scout") * 0.00000015) +
    (strcontains(modelId, "command-r-plus") * 0.0000025) +
    (strcontains(modelId, "command-r-v") * 0.00000015) +
    (strcontains(modelId, "gpt-oss-120b") * 0.00000009) +
    (strcontains(modelId, "gpt-oss-20b") * 0.00000004))) +
  (outputTokens *
    ((strcontains(modelId, "nova-micro") * 0.00000014) +
    (strcontains(modelId, "nova-lite") * 0.00000024) +
    (strcontains(modelId, "nova-pro") * 0.0000032) +
    (strcontains(modelId, "claude-sonnet-4-6") * 0.000015) +
    (strcontains(modelId, "claude-sonnet-4-5") * 0.000015) +
    (strcontains(modelId, "claude-haiku") * 0.000005) +
    (strcontains(modelId, "llama4-maverick") * 0.0000002) +
    (strcontains(modelId, "llama4-scout") * 0.00000015) +
    (strcontains(modelId, "command-r-plus") * 0.00001) +
    (strcontains(modelId, "command-r-v") * 0.0000006) +
    (strcontains(modelId, "gpt-oss-120b") * 0.00000045) +
    (strcontains(modelId, "gpt-oss-20b") * 0.0000002))) as totalCostUSD
| stats sum(totalCostUSD) as TotalSpendUSD
```

- **अलार्म:** दैनिक खर्च 7-दिन के औसत का 150% से अधिक।

### Cost एनालिसिस

#### 10. Model-wise Cost वितरण

- **उद्देश्य:** Pie chart दिखाता है कि कौन से models आपके spend का कितना हिस्सा हैं। उदाहरण: आप पाते हैं कि Claude Sonnet 4.6 आपके bill का 70% है जबकि Nova Lite 5% -- यदि कुछ use cases Nova पर migrate हो सकते हैं तो prompt migration अवसर है।
- **स्रोत:** `bedrock-model-invocation-logging`
- **व्यू:** Pie
- **Query भाषा:** CloudWatch Logs Insights
- **Query (Query 9 से cost calculation pattern जोड़ें):**

```sql
| stats sum(totalCostUSD) as costUSD by modelName
| sort costUSD desc
```

- **अलार्म:** कोई नहीं (सूचनात्मक)।

#### 11. Role/User-wise Top 10 Spenders

- **उद्देश्य:** पहचानता है कि कौन से IAM roles या users spend drive कर रहे हैं। Invocation count और cost-per-call के साथ मिलाकर, आप देख सकते हैं कि कोई team volume के कारण अधिक खर्च कर रही है या उनकी calls अधिक महंगी हैं। उदाहरण: `data-science-exploration` role में $0.002 प्रति call पर 100K invocations हैं जबकि `prod-chatbot` में $0.05 प्रति call पर 10K -- बहुत अलग optimization paths।
- **स्रोत:** `bedrock-model-invocation-logging`
- **व्यू:** Table
- **Query भाषा:** CloudWatch Logs Insights
- **Query:**

```sql
fields replace(`identity.arn`, "arn:aws:sts::ACCOUNT_ID:assumed-role/", "") as userRole
| fields coalesce(output.outputBodyJson.usage.inputTokens,
    output.outputBodyJson.usage.prompt_tokens,
    output.outputBodyJson.usage.input_tokens,
    input.inputTokenCount) as inputTokens,
  coalesce(output.outputBodyJson.usage.outputTokens,
    output.outputBodyJson.usage.completion_tokens,
    output.outputBodyJson.usage.output_tokens,
    output.outputTokenCount) as outputTokens
| fields (inputTokens *
    ((strcontains(modelId, "nova-micro") * 0.000000035) +
    (strcontains(modelId, "nova-lite") * 0.00000006) +
    (strcontains(modelId, "nova-pro") * 0.0000008) +
    (strcontains(modelId, "claude-sonnet-4-6") * 0.000003) +
    (strcontains(modelId, "claude-sonnet-4-5") * 0.000003) +
    (strcontains(modelId, "claude-haiku") * 0.000001))) +
  (outputTokens *
    ((strcontains(modelId, "nova-micro") * 0.00000014) +
    (strcontains(modelId, "nova-lite") * 0.00000024) +
    (strcontains(modelId, "nova-pro") * 0.0000032) +
    (strcontains(modelId, "claude-sonnet-4-6") * 0.000015) +
    (strcontains(modelId, "claude-sonnet-4-5") * 0.000015) +
    (strcontains(modelId, "claude-haiku") * 0.000005))) as totalCostUSD
| stats sum(totalCostUSD) as spend,
        count(*) as invocations,
        (sum(totalCostUSD) / count(*)) as costPerCall
  by userRole
| sort spend desc
| limit 10
```

- **अलार्म:** किसी भी role का daily spend उसके 7-दिन के औसत से 2x अधिक।

#### 12. Input बनाम Output Cost Split (प्रति घंटा)

- **उद्देश्य:** दिखाता है कि आप input tokens (prompts) पर अधिक खर्च कर रहे हैं या output tokens (completions) पर। यदि input cost dominates करता है, तो prompts optimize करें और caching सक्षम करें। यदि output cost dominates करता है, तो max_tokens कम करें या सस्ता model चुनें।
- **स्रोत:** `bedrock-model-invocation-logging`
- **व्यू:** Bar (stacked)
- **Query भाषा:** CloudWatch Logs Insights
- **Query (cost calculation pattern में जोड़ें, input/output split करें):**

```sql
| stats sum(inputCostUSD) as InputCost, sum(outputCostUSD) as OutputCost
  by bin(1h) as hour
| sort hour asc
```

- **अलार्म:** कोई नहीं (एनालिसिस widget)।

### Token उपभोग

#### 13. Invocation Count (15-मिनट windows)

- **उद्देश्य:** 15-मिनट windows में traffic volume baseline। यदि invocations सामान्यतः प्रति window 2-4 हैं लेकिन अचानक 10 तक spike होते हैं, तो कुछ बदला -- एक नया feature launch, load test, या runaway retry loop। cost spikes volume spikes या model choice changes से correlate होते हैं यह देखने के लिए hourly cost trend से तुलना करें।
- **स्रोत:** `bedrock-model-invocation-logging`
- **व्यू:** Time series
- **Query भाषा:** CloudWatch Logs Insights
- **Query:**

```sql
stats count(*) as invocations by bin(15m) as period
| sort period asc
```

- **अलार्म:** Invocations लगातार 2 periods में सामान्य 15-मिनट औसत का 3x से अधिक।

#### 14. Input बनाम Output Tokens

- **उद्देश्य:** 5-मिनट windows में input बनाम output token consumption दिखाता है। अनुपात आपकी workload profile प्रकट करता है। उदाहरण: यदि input tokens लगातार output tokens का 10x हैं, तो आप छोटे responses के लिए बड़ा context (RAG, system prompts) भेज रहे हैं -- prompt caching का prime candidate। यदि output tokens अचानक spike करते हैं, तो model update या prompt change लंबे responses generate कर रहा हो सकता है।
- **स्रोत:** `bedrock-model-invocation-logging`
- **व्यू:** Bar (stacked)
- **Query भाषा:** CloudWatch Logs Insights
- **Query:**

```sql
fields
  coalesce(output.outputBodyJson.usage.inputTokens,
    output.outputBodyJson.usage.prompt_tokens,
    output.outputBodyJson.usage.input_tokens,
    input.inputTokenCount) as inputTokens,
  coalesce(output.outputBodyJson.usage.outputTokens,
    output.outputBodyJson.usage.completion_tokens,
    output.outputBodyJson.usage.output_tokens,
    output.outputTokenCount) as outputTokens
| stats sum(inputTokens) as totalInputTokens,
        sum(outputTokens) as totalOutputTokens
  by bin(5m) as period
| sort period asc
```

- **अलार्म:** Input-to-output ratio 1 घंटे तक 20:1 से अधिक बना रहे -- prompt optimization की जाँच करें।

#### 15. कुल Token Count

- **उद्देश्य:** 5-मिनट windows में संयुक्त (input + output) token consumption। आप कितना उपयोग कर रहे हैं इसका सबसे सरल दृश्य। उदाहरण: यदि invocations में corresponding increase के बिना total tokens सप्ताह दर सप्ताह बढ़ रहे हैं, तो individual requests बड़ी हो रही हैं (लंबे prompts या लंबे responses)। "अधिक requests" और "बड़ी requests" में अंतर करने के लिए invocation count से तुलना करें।
- **स्रोत:** `bedrock-model-invocation-logging`
- **व्यू:** Bar
- **Query भाषा:** CloudWatch Logs Insights
- **Query:**

```sql
fields
  coalesce(output.outputBodyJson.usage.inputTokens,
    output.outputBodyJson.usage.prompt_tokens,
    output.outputBodyJson.usage.input_tokens,
    input.inputTokenCount) as inputTokens,
  coalesce(output.outputBodyJson.usage.outputTokens,
    output.outputBodyJson.usage.completion_tokens,
    output.outputBodyJson.usage.output_tokens,
    output.outputTokenCount) as outputTokens
| stats sum(inputTokens) + sum(outputTokens) as totalTokens by bin(5m) as period
| sort period asc
```

- **अलार्म:** किसी भी 5-मिनट window में total tokens 7-दिन के औसत का 200% से अधिक।

### Invocation विवरण

#### 16. Per-Invocation Detail Table

- **उद्देश्य:** पूर्ण विवरण के साथ अंतिम 200 invocations -- model name, temperature, maxTokens config, input/output/total tokens, cache read/write tokens, और अनुमानित cost per call। यह विशिष्ट calls की जाँच के लिए आपकी drill-down table है। उदाहरण: आप 12,000 input tokens, 50 output tokens, zero cache reads, और $0.04 cost वाली invocation देखते हैं -- यह एक classification task है जो पूरा document भेज रही है।
- **स्रोत:** `bedrock-model-invocation-logging`
- **व्यू:** Table
- **Query भाषा:** CloudWatch Logs Insights
- **Query:**

```sql
fields @timestamp, modelId,
  replace(replace(replace(modelId,
    "arn:aws:bedrock:us-east-1:ACCOUNT_ID:inference-profile/us.", ""),
    "arn:aws:bedrock:us-east-1:ACCOUNT_ID:inference-profile/", ""),
    "arn:aws:bedrock:us-east-1:ACCOUNT_ID:", "") as modelName,
  coalesce(input.inputBodyJson.inferenceConfig.temperature,
    input.inputBodyJson.temperature) as temperature,
  coalesce(input.inputBodyJson.inferenceConfig.maxTokens,
    input.inputBodyJson.max_completion_tokens,
    input.inputBodyJson.max_tokens) as maxTokens,
  coalesce(output.outputBodyJson.usage.inputTokens,
    output.outputBodyJson.usage.prompt_tokens,
    output.outputBodyJson.usage.input_tokens,
    input.inputTokenCount) as inputTokens,
  coalesce(output.outputBodyJson.usage.outputTokens,
    output.outputBodyJson.usage.completion_tokens,
    output.outputBodyJson.usage.output_tokens,
    output.outputTokenCount) as outputTokens,
  coalesce(output.outputBodyJson.usage.totalTokens,
    output.outputBodyJson.usage.total_tokens,
    floor(inputTokens + outputTokens)) as totalTokens,
  coalesce(output.outputBodyJson.usage.cache_read_input_tokens,
    output.outputBodyJson.usage.cacheReadInputTokenCount) as cacheReadTokens,
  coalesce(output.outputBodyJson.usage.cache_creation_input_tokens,
    output.outputBodyJson.usage.cacheWriteInputTokenCount) as cacheWriteTokens
| display @timestamp, modelName, temperature, maxTokens,
          inputTokens, outputTokens, totalTokens,
          cacheReadTokens, cacheWriteTokens
| sort @timestamp desc
| limit 200
```

- **अलार्म:** कोई नहीं (drill-down table -- जाँच के लिए उपयोग करें)।

#### 17. Top 10 उच्च Token Count Prompts

- **उद्देश्य:** पूर्ण request/response bodies, model name, token counts, और latency के साथ 10 सबसे अधिक token-heavy invocations। ये आपकी सबसे महंगी individual calls हैं। उदाहरण: top prompt 8 seconds latency के साथ 15,000 tokens उपयोग करता है -- actual prompt text पढ़ने से पता चलता है कि यह retrieval उपयोग करने के बजाय संपूर्ण knowledge base context में ठूँस रहा है। Bedrock model invocation logging settings में "Log request and response body" सक्षम होना आवश्यक है।
- **स्रोत:** `bedrock-model-invocation-logging`
- **व्यू:** Table
- **Query भाषा:** CloudWatch Logs Insights
- **Query:**

```sql
filter !isPresent(errorCode)
| fields jsonParse(@message) as json_message,
    replace(replace(replace(modelId,
      "arn:aws:bedrock:us-east-1:ACCOUNT_ID:inference-profile/us.", ""),
      "arn:aws:bedrock:us-east-1:ACCOUNT_ID:inference-profile/", ""),
      "arn:aws:bedrock:us-east-1:ACCOUNT_ID:", "") as modelName
| unnest json_message.input into inputMessage
| unnest json_message.output into outputMessage
| display requestId, timestamp, modelName, inputMessage, outputMessage,
    coalesce(input.inputTokenCount, 0) as inputTokenCount,
    coalesce(output.outputTokenCount, 0) as outputTokenCount,
    coalesce(input.inputTokenCount, 0) + coalesce(output.outputTokenCount, 0) as totalTokenCount,
    (output.outputBodyJson.metrics.latencyMs / 1000) as latency
| sort totalTokenCount desc
| limit 10
```

- **अलार्म:** 20,000 से अधिक total tokens वाली कोई भी single invocation -- prompt design की समीक्षा करें।

---

## Model Pricing संदर्भ

:::warning
ये कीमतें एक snapshot हैं और **पुरानी हो सकती हैं**। AWS नियमित रूप से Bedrock pricing अपडेट करता है और नए models जोड़ता है। वर्तमान दरों के लिए हमेशा [AWS Bedrock pricing page](https://aws.amazon.com/bedrock/pricing/) पर सत्यापित करें और अपनी queries में `strcontains` multipliers को तदनुसार अपडेट करें।
:::

कीमतें per token हैं (per 1K या 1M tokens नहीं)। अपडेट करने के लिए: [Bedrock pricing page](https://aws.amazon.com/bedrock/pricing/) में अपना model खोजें, per-1M-token price को per-token में बदलें (1,000,000 से भाग दें), और प्रत्येक cost query के `strcontains` block में matching value replace करें।

| Model | Input ($/token) | Output ($/token) |
| --- | --- | --- |
| Nova Micro | 0.000000035 | 0.00000014 |
| Nova Lite | 0.00000006 | 0.00000024 |
| Nova Pro | 0.0000008 | 0.0000032 |
| Claude Sonnet 4.6 | 0.000003 | 0.000015 |
| Claude Sonnet 4.5 | 0.000003 | 0.000015 |
| Claude Sonnet 4 | 0.000003 | 0.000015 |
| Claude Haiku 4.5 | 0.000001 | 0.000005 |
| Llama 4 Maverick | 0.0000002 | 0.0000002 |
| Llama 4 Scout | 0.00000015 | 0.00000015 |
| Cohere Command R+ | 0.0000025 | 0.00001 |
| Cohere Command R | 0.00000015 | 0.0000006 |
| GPT OSS 120B | 0.00000009 | 0.00000045 |
| GPT OSS 20B | 0.00000004 | 0.0000002 |

---

## अलार्म अनुशंसाएँ

### DevOps अलार्म

| अलार्म | स्थिति | गंभीरता |
| --- | --- | --- |
| Completion rate drop | `ok / (ok + truncated)` 2 घंटे तक 95% से नीचे | Warning |
| Token waste | 24 घंटे में Caller 100K wasted tokens से अधिक | Warning |
| Cross-region latency | किसी region में Model P95 10s से अधिक | Warning |
| Agent error rate | `error_spans / total_traces` 15 min तक 10% से अधिक | Critical |
| Component errors | 15 min में Component 10 errors से अधिक | Critical |
| Component latency | Component P95 5000ms से अधिक | Warning |

### FinOps अलार्म

| अलार्म | स्थिति | गंभीरता |
| --- | --- | --- |
| Daily cost spike | Daily cost 7-दिन के औसत का 150% से अधिक | Warning |
| Hourly cost anomaly | Hourly cost hourly average का 3x से अधिक | Warning |
| Cost concentration | Single model total spend का 60% से अधिक | Warning |
| Token volume spike | 1 घंटे में Total tokens baseline का 2x से अधिक | Warning |
| Error rate cost waste | Error rate 5% से अधिक (failed calls के लिए भुगतान) | Warning |
| Per-role budget | किसी role का daily spend उसके 7-दिन के औसत से 2x अधिक | Warning |
| Token ratio imbalance | Input:output ratio 1 घंटे तक 20:1 से अधिक | Warning |
| High-token invocation | कोई भी single call 20,000 tokens से अधिक | Warning |

---

## अतिरिक्त संसाधन

- [AWS पर GenAI ऑब्ज़र्वेबिलिटी](../genai-observability-on-aws) -- साथी गाइड: नीति, pipelines, enablement, dashboards
- [Model Invocations — CloudWatch](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/model-invocations.html)
- [Getting Started with AgentCore ऑब्ज़र्वेबिलिटी](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/AgentCore-GettingStarted.html)
- [CloudWatch Logs Insights Query Syntax](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/CWL_QuerySyntax.html)
- [OpenSearch SQL in CloudWatch Logs Insights](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/CWL_AnalyzeLogData_SQL.html)
- [AWS Bedrock Pricing](https://aws.amazon.com/bedrock/pricing/)

---

**योगदानकर्ता:** AWS ऑब्ज़र्वेबिलिटी Team
**अंतिम अपडेट:** 2026-04-21

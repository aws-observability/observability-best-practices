# MCP Server डेमो क्वेरी

यह गाइड उदाहरण प्राकृतिक भाषा क्वेरी प्रदान करती है जिनका उपयोग आप Kiro IDE के साथ MCP सर्वर इंटीग्रेशन का परीक्षण करने के लिए कर सकते हैं।

## पूर्वापेक्षाएं

1. सुनिश्चित करें कि आपने Kiro में MCP सर्वर सेट अप कर लिया है (`SETUP-MCP-KIRO.md` देखें)
2. टेलीमेट्री जनरेट करने के लिए मल्टी-क्लाउड डेमो चलाएं: `python3 AI-OBS_DEMO/multi-cloud-demo.py`
3. CloudWatch में मेट्रिक्स दिखने के लिए 1-2 मिनट प्रतीक्षा करें

## स्क्रीनशॉट के लिए उदाहरण क्वेरी

### 1. टोकन उपयोग एनालिसिस

**क्वेरी**: "Which model is consuming the most tokens?"

**अपेक्षित प्रतिक्रिया**:
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

**वैकल्पिक क्वेरी**:
- "Show me input token usage for the last hour"
- "How many output tokens has Claude Haiku used?"
- "Compare token consumption across all models"

---

### 2. लेटेंसी सांख्यिकी

**क्वेरी**: "What is the average latency for Claude Haiku?"

**अपेक्षित प्रतिक्रिया**:
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

**वैकल्पिक क्वेरी**:
- "Show me latency statistics for all models"
- "Which model has the highest latency?"
- "What's the fastest model in terms of response time?"

---

### 3. अनुरोध मात्रा

**क्वेरी**: "How many requests have been made in the last hour?"

**अपेक्षित प्रतिक्रिया**:
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

**वैकल्पिक क्वेरी**:
- "Show me request counts by model"
- "Which model is being used the most?"
- "How many times was GPT-4o invoked?"

---

### 4. लागत अनुमान

**क्वेरी**: "Estimate the cost of LLM usage for the last hour"

**अपेक्षित प्रतिक्रिया**:
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

**वैकल्पिक क्वेरी**:
- "What's my estimated LLM cost today?"
- "How much am I spending on Claude models?"
- "Calculate the cost per request"

---

### 5. मॉडल तुलना

**क्वेरी**: "Compare all models by latency and token usage"

**अपेक्षित प्रतिक्रिया**:
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

**वैकल्पिक क्वेरी**:
- "Show me a comparison of all active models"
- "Which model offers the best performance?"
- "Compare Claude Haiku vs Claude Sonnet"

---

## उन्नत क्वेरी

### समय सीमा क्वेरी

**क्वेरी**: "Show me token usage for the last 2 hours"

MCP सर्वर `hours` पैरामीटर का उपयोग करके कस्टम समय सीमा का समर्थन करता है।

### विशिष्ट मॉडल क्वेरी

**क्वेरी**: "What's the latency for anthropic.claude-3-haiku-20240307-v1:0?"

आप उनकी पूरी मॉडल ID का उपयोग करके विशिष्ट मॉडल क्वेरी कर सकते हैं।

### मल्टी-मेट्रिक क्वेरी

**क्वेरी**: "Give me a complete overview of Claude Haiku performance"

यह निर्दिष्ट मॉडल के लिए सभी मेट्रिक्स दिखाने के लिए `compare_models` टूल को ट्रिगर करेगा।

---

## स्क्रीनशॉट लेने के सुझाव

### डेमो स्क्रीनशॉट के लिए सर्वोत्तम क्वेरी

1. **लागत एनालिसिस** (सबसे प्रभावशाली):
   ```
   "Estimate the cost of LLM usage for the last hour"
   ```
   डॉलर राशियों के साथ वास्तविक व्यावसायिक मूल्य दिखाता है।

2. **मॉडल तुलना** (सबसे व्यापक):
   ```
   "Compare all models by latency and token usage"
   ```
   प्रोवाइडर्स में एकीकृत ऑब्ज़र्वेबिलिटी की शक्ति दिखाता है।

3. **सरल क्वेरी** (सबसे सुलभ):
   ```
   "Which model is consuming the most tokens?"
   ```
   समझने में आसान, प्राकृतिक भाषा क्षमता दिखाता है।

### स्क्रीनशॉट कंपोज़ीशन सुझाव

1. **क्वेरी दिखाएं**: सुनिश्चित करें कि प्राकृतिक भाषा क्वेरी दिखाई दे
2. **प्रतिक्रिया दिखाएं**: डेटा के साथ पूर्ण JSON प्रतिक्रिया शामिल करें
3. **कॉन्टेक्स्ट दिखाएं**: यदि संभव हो तो IDE कॉन्टेक्स्ट (file explorer, terminal) शामिल करें
4. **मुख्य डेटा हाइलाइट करें**: प्रतिक्रिया में दिलचस्प अंतर्दृष्टि बताएं

### उदाहरण स्क्रीनशॉट फ़्लो

1. Kiro IDE खोलें
2. Chat पैनल खोलें
3. टाइप करें: "Estimate the cost of LLM usage for the last hour"
4. MCP सर्वर की प्रतिक्रिया की प्रतीक्षा करें
5. दिखाने वाला स्क्रीनशॉट लें:
   - आपकी प्राकृतिक भाषा क्वेरी
   - स्ट्रक्चर्ड JSON प्रतिक्रिया
   - मॉडल के अनुसार लागत ब्रेकडाउन
   - कुल अनुमानित लागत

---

## समस्या निवारण

### "No data" प्रतिक्रिया

**समस्या**: MCP सर्वर खाली परिणाम लौटाता है

**समाधान**:
1. मेट्रिक्स जनरेट करने के लिए डेमो चलाएं: `python3 AI-OBS_DEMO/multi-cloud-demo.py`
2. CloudWatch को मेट्रिक्स इंजेस्ट करने के लिए 1-2 मिनट प्रतीक्षा करें
3. समय सीमा बढ़ाने का प्रयास करें: "Show me token usage for the last 2 hours"

### MCP Server प्रतिक्रिया नहीं दे रहा

**समस्या**: क्वेरी टाइमआउट या विफल हो जाती हैं

**समाधान**:
1. चेक करें कि MCP सर्वर चल रहा है: Kiro MCP पैनल में "ai-ऑब्ज़र्वेबिलिटी" देखें
2. AWS क्रेडेंशियल सत्यापित करें: `aws sts get-caller-identity`
3. CloudWatch अनुमतियां चेक करें: CloudWatch मेट्रिक्स को पढ़ने की एक्सेस सुनिश्चित करें
4. MCP कॉन्फ़िगरेशन पुनः लोड करने के लिए Kiro पुनः शुरू करें

### अनुमति एरर

**समस्या**: प्रतिक्रियाओं में "AccessDenied" एरर

**समाधान**:
1. सत्यापित करें कि IAM अनुमतियों में `cloudwatch:GetMetricStatistics` शामिल है
2. सत्यापित करें कि IAM अनुमतियों में `cloudwatch:ListMetrics` शामिल है
3. चेक करें कि MCP कॉन्फ़िग में AWS region `us-east-1` पर सेट है

---

## MCP Server का सीधे परीक्षण करना

आप Kiro के बिना भी MCP सर्वर का सीधे परीक्षण कर सकते हैं:

```bash
python3 AI-OBS_DEMO/test-mcp-server.py
```

यह सभी 5 MCP टूल चलाएगा और परिणाम प्रदर्शित करेगा, जो इसके लिए उपयोगी है:
- MCP सर्वर के काम करने की पुष्टि
- समस्याओं का डीबग करना
- प्रतिक्रिया प्रारूप को समझना
- डॉक्यूमेंटेशन के लिए सैंपल डेटा जनरेट करना

---

## अगले कदम

स्क्रीनशॉट लेने के बाद:

1. **ब्लॉग पोस्ट में जोड़ें**: "Demo Results" सेक्शन में स्क्रीनशॉट शामिल करें
2. **ट्यूटोरियल बनाएं**: स्टेप-बाय-स्टेप गाइड बनाने के लिए स्क्रीनशॉट का उपयोग करें
3. **टीम के साथ शेयर करें**: प्राकृतिक भाषा क्वेरी क्षमता का प्रदर्शन करें
4. **फ़ीडबैक इकट्ठा करें**: डेवलपर्स से पूछें कि कौन सी अन्य क्वेरी उपयोगी होंगी

---

## अतिरिक्त संसाधन

- **MCP Server कोड**: `AI-OBS_DEMO/mcp-server/cloudwatch_mcp_server.py`
- **सेटअप गाइड**: `AI-OBS_DEMO/SETUP-MCP-KIRO.md`
- **Test Script**: `AI-OBS_DEMO/test-mcp-server.py`
- **Kiro Config**: `AI-OBS_DEMO/kiro-mcp-config.json`

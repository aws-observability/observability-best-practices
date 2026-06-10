# Kiro IDE MCP Server - त्वरित शुरुआत गाइड

## आपको क्या मिलेगा

Kiro IDE में सीधे सरल हिंदी/अंग्रेजी में प्रश्न पूछें:
- "कौन सा मॉडल सबसे अधिक टोकन खपत कर रहा है?"
- "Claude Haiku की औसत लेटेंसी क्या है?"
- "पिछले एक घंटे के लिए मेरी LLM लागत का अनुमान लगाएं"

डैशबोर्ड पर स्विच करने या जटिल क्वेरी लिखने की आवश्यकता नहीं!

---

## चरण 1: Kiro में MCP Server कॉन्फ़िगर करें

### विकल्प A: Workspace कॉन्फ़िगरेशन का उपयोग करें (अनुशंसित)

1. **MCP config डायरेक्टरी बनाएं**:
   ```bash
   mkdir -p .kiro/settings
   ```

2. **MCP कॉन्फ़िगरेशन कॉपी करें**:
   ```bash
   cp AI-OBS_DEMO/kiro-mcp-config.json .kiro/settings/mcp.json
   ```

3. **कॉन्फ़िग में पाथ अपडेट करें** (यदि आवश्यक हो):
   `.kiro/settings/mcp.json` खोलें और `cloudwatch_mcp_server.py` का पाथ सत्यापित करें:
   ```json
   {
     "mcpServers": {
       "ai-observability": {
         "command": "python3",
         "args": [
           "/path/to/mcp-server/cloudwatch_mcp_server.py"
         ],
         "env": {
           "AWS_REGION": "your-aws-region"
         },
         "disabled": false,
         "autoApprove": []
       }
     }
   }
   ```

### विकल्प B: User-Level कॉन्फ़िगरेशन का उपयोग करें (Global)

1. **User config डायरेक्टरी बनाएं**:
   ```bash
   mkdir -p ~/.kiro/settings
   ```

2. **कॉन्फ़िगरेशन कॉपी करें**:
   ```bash
   cp AI-OBS_DEMO/kiro-mcp-config.json ~/.kiro/settings/mcp.json
   ```

---

## चरण 2: AWS क्रेडेंशियल सत्यापित करें

MCP सर्वर को CloudWatch क्वेरी करने के लिए AWS क्रेडेंशियल की आवश्यकता है:

```bash
# Check your AWS credentials are configured
aws sts get-caller-identity

# Should show:
# {
#     "UserId": "...",
#     "Account": "<your-account-id>",
#     "Arn": "arn:aws:iam::<your-account-id>:user/<your-username>"
# }
```

यदि कॉन्फ़िगर नहीं है, तो AWS क्रेडेंशियल सेट करें:
```bash
aws configure
# Enter your AWS Access Key ID
# Enter your AWS Secret Access Key
# Default region: your-aws-region
# Default output format: json
```

---

## चरण 3: MCP Server का परीक्षण करें (वैकल्पिक)

Kiro में उपयोग करने से पहले, सत्यापित करें कि MCP सर्वर काम कर रहा है:

```bash
python3 AI-OBS_DEMO/test-mcp-server.py
```

आपको इस तरह का आउटपुट दिखना चाहिए:
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

## चरण 4: Kiro IDE पुनः शुरू करें

Kiro को MCP कॉन्फ़िगरेशन लोड करने के लिए:

1. **अपना सारा काम सेव करें**
2. **Kiro को पूरी तरह बंद करें** (Mac पर Cmd+Q, या File → Exit)
3. **Kiro फिर से खोलें**
4. **अपना workspace खोलें** (वह फ़ोल्डर जिसमें `.kiro/settings/mcp.json` है)

---

## चरण 5: MCP Server कनेक्शन सत्यापित करें

1. **Kiro Feature Panel खोलें** (बाईं साइडबार)
2. **"MCP Servers" सेक्शन देखें**
3. **आपको दिखना चाहिए**: `ai-observability` हरे स्टेटस इंडिकेटर के साथ
4. **यदि लाल इंडिकेटर दिखता है**: एरर विवरण देखने के लिए उस पर क्लिक करें

### कनेक्शन समस्याओं का निवारण

यदि सर्वर डिस्कनेक्ट दिखता है:

1. **Kiro के बाएं पैनल में MCP Server view चेक करें**
2. **उपलब्ध होने पर "Reconnect" पर क्लिक करें**
3. **लॉग चेक करें**: MCP सर्वर आउटपुट में एरर मैसेज देखें
4. **Python पाथ सत्यापित करें**: सुनिश्चित करें कि `python3` आपके PATH में है
5. **फ़ाइल अनुमतियां चेक करें**: सुनिश्चित करें कि `cloudwatch_mcp_server.py` पढ़ने योग्य है

---

## चरण 6: प्राकृतिक भाषा क्वेरी का उपयोग करें

### Kiro Chat में

1. **Kiro Chat खोलें** (Cmd+L या chat आइकन पर क्लिक करें)
2. **सरल अंग्रेजी में अपना प्रश्न टाइप करें**:

```
Which model is consuming the most tokens?
```

3. **Kiro स्वचालित रूप से**:
   - इसे observability क्वेरी के रूप में पहचानेगा
   - MCP सर्वर के `get_token_usage` टूल को कॉल करेगा
   - स्ट्रक्चर्ड परिणाम लौटाएगा

### आज़माने के लिए उदाहरण क्वेरी

#### 1. टोकन उपयोग
```
Which model is consuming the most tokens?
```

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
    }
  ]
}
```

#### 2. लेटेंसी सांख्यिकी
```
What's the average latency for all models?
```

**अपेक्षित प्रतिक्रिया**:
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

#### 3. लागत अनुमान
```
Estimate the cost of LLM usage for the last hour
```

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
    }
  ]
}
```

#### 4. अनुरोध मात्रा
```
How many requests have been made in the last hour?
```

#### 5. मॉडल तुलना
```
Compare all models by latency and token usage
```

---

## चरण 7: उन्नत उपयोग

### कस्टम समय सीमा

आप अपनी क्वेरी में कस्टम समय सीमा निर्दिष्ट कर सकते हैं:

```
Show me token usage for the last 2 hours
```

```
What was the latency for Claude Haiku in the last 3 hours?
```

### विशिष्ट मॉडल क्वेरी

उनकी पूरी ID का उपयोग करके विशिष्ट मॉडल क्वेरी करें:

```
What's the latency for anthropic.claude-3-haiku-20240307-v1:0?
```

### मल्टी-मेट्रिक क्वेरी

व्यापक विश्लेषण के लिए पूछें:

```
Give me a complete overview of Claude Haiku performance
```

---

## समस्या निवारण

### "No data" प्रतिक्रिया

**समस्या**: MCP सर्वर खाली परिणाम लौटाता है

**समाधान**:
1. मेट्रिक्स जनरेट करने के लिए डेमो चलाएं:
   ```bash
   python3 AI-OBS_DEMO/multi-cloud-demo.py
   ```
2. CloudWatch को मेट्रिक्स इंजेस्ट करने के लिए 1-2 मिनट प्रतीक्षा करें
3. समय सीमा बढ़ाने का प्रयास करें: "Show me token usage for the last 2 hours"

### MCP Server प्रतिक्रिया नहीं दे रहा

**समस्या**: क्वेरी टाइमआउट या विफल हो जाती हैं

**समाधान**:
1. Kiro के MCP पैनल में MCP सर्वर स्टेटस चेक करें
2. AWS क्रेडेंशियल सत्यापित करें: `aws sts get-caller-identity`
3. CloudWatch अनुमतियां चेक करें
4. MCP कॉन्फ़िगरेशन पुनः लोड करने के लिए Kiro पुनः शुरू करें

### अनुमति एरर

**समस्या**: प्रतिक्रियाओं में "AccessDenied" एरर

**समाधान**:
1. सत्यापित करें कि IAM अनुमतियों में शामिल है:
   - `cloudwatch:GetMetricStatistics`
   - `cloudwatch:ListMetrics`
2. चेक करें कि AWS region सही सेट है

### Python पाथ समस्याएं

**समस्या**: "python3: command not found"

**समाधान**:
1. अपना Python पाथ खोजें: `which python3`
2. MCP कॉन्फ़िग को पूरे पाथ के साथ अपडेट करें:
   ```json
   "command": "/usr/local/bin/python3"
   ```

---

## सर्वोत्तम परिणामों के लिए सुझाव

### 1. ताज़ा डेटा जनरेट करें

क्वेरी करने से पहले, सुनिश्चित करें कि आपके पास हाल के मेट्रिक्स हैं:
```bash
python3 AI-OBS_DEMO/multi-cloud-demo.py
```

### 2. प्राकृतिक भाषा का उपयोग करें

MCP सर्वर प्राकृतिक प्रश्नों को समझता है:
- ✅ "Which model costs the most?"
- ✅ "Show me latency for all models"
- ✅ "How many tokens did Claude use?"

### 3. जब आवश्यक हो तब विशिष्ट रहें

विशिष्ट मॉडलों के लिए, उनकी पूरी ID का उपयोग करें:
```
What's the latency for anthropic.claude-3-haiku-20240307-v1:0?
```

### 4. कोड कॉन्टेक्स्ट के साथ मिलाएं

कोड देखते समय आप प्रश्न पूछ सकते हैं:
```
Based on this code, estimate the cost if we run it 1000 times
```

---

## उपलब्ध MCP टूल

MCP सर्वर 5 टूल प्रदान करता है:

| टूल | विवरण | उदाहरण क्वेरी |
|------|-------------|---------------|
| `get_token_usage` | मॉडल के अनुसार टोकन खपत | "Which model uses the most tokens?" |
| `get_model_latency` | लेटेंसी सांख्यिकी | "What's the average latency?" |
| `get_request_count` | अनुरोध मात्रा | "How many requests were made?" |
| `get_cost_estimate` | लागत अनुमान | "Estimate my LLM costs" |
| `compare_models` | मल्टी-मेट्रिक तुलना | "Compare all models" |

---

## अगले कदम

### डेमो के लिए स्क्रीनशॉट लें

1. डेमो चलाएं: `python3 AI-OBS_DEMO/multi-cloud-demo.py`
2. 1-2 मिनट प्रतीक्षा करें
3. पूछें: "Estimate the cost of LLM usage for the last hour"
4. क्वेरी + प्रतिक्रिया दिखाने वाला स्क्रीनशॉट लें

### अपने उपयोग के मामले के लिए कस्टमाइज़ करें

`mcp-server/cloudwatch_mcp_server.py` को एडिट करें:
- कस्टम मेट्रिक्स जोड़ें
- लागत गणना सूत्र बदलें
- नए क्वेरी टूल जोड़ें
- अन्य AWS सेवाओं के साथ इंटीग्रेट करें

### अपनी टीम के साथ शेयर करें

1. `.kiro/settings/mcp.json` को अपनी repo में कमिट करें
2. टीम के सदस्यों को स्वचालित रूप से MCP एक्सेस मिलेगा
3. हर कोई अपने IDE से observability डेटा क्वेरी कर सकता है

---

## संसाधन

- **MCP Server कोड**: `AI-OBS_DEMO/mcp-server/cloudwatch_mcp_server.py`
- **Test Script**: `AI-OBS_DEMO/test-mcp-server.py`
- **उदाहरण क्वेरी**: `AI-OBS_DEMO/MCP-DEMO-QUERIES.md`
- **आर्किटेक्चर**: `AI-OBS_DEMO/ARCHITECTURE.md`

---

## त्वरित संदर्भ कार्ड

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

**प्रश्न?** अधिक उदाहरणों के लिए `MCP-DEMO-QUERIES.md` देखें या GitHub पर एक issue खोलें।

# Amazon CloudWatch Database Insights से डेटाबेस की निगरानी

## परिचय

Amazon CloudWatch Database Insights Amazon RDS और Aurora डेटाबेस के लिए एक unified monitoring समाधान है। यह डेटाबेस मेट्रिक्स, query analytics, लॉग्स, events, और application telemetry को CloudWatch console में एक ही अनुभव में consolidate करता है — आपके database layer में क्या हो रहा है इसे समझने के लिए कई tools के बीच switch करने की आवश्यकता को समाप्त करता है।

यह लेख Database Insights क्या प्रदान करता है, इसके दो operating modes में से कैसे चुनें, अपने डेटाबेस की प्रभावी निगरानी के लिए व्यावहारिक मार्गदर्शन, और इसे अपनाने से पहले आपको किन सीमाओं के बारे में पता होना चाहिए, इसे कवर करता है।

---

## Database Insights क्या है?

Database Insights Amazon RDS Performance Insights के ऊपर बनाता है और इसे fleet-wide monitoring, log correlation, lock analysis, execution plan capture, और application-level integration के साथ विस्तारित करता है। यह standalone Performance Insights console अनुभव का उत्तराधिकारी है (जो जल्द ही end-of-life तक पहुंच रहा है)।

मूल अवधारणा **DB Load** है — आपके डेटाबेस में किसी भी समय active sessions की औसत संख्या। यदि DB Load आपके instance के vCPU count से अधिक हो जाता है, तो आपका डेटाबेस overloaded है। Database Insights इस metric को visualize करता है और आपको performance issues के root cause की तेजी से पहचान करने के लिए इसे कई dimensions (SQL, wait events, users, hosts, applications) द्वारा slice करने देता है।

---

## Standard Mode बनाम Advanced Mode

Database Insights दो tiers में काम करता है। Standard mode डिफ़ॉल्ट रूप से बिना किसी अतिरिक्त लागत के सक्षम होता है। Advanced mode के लिए Performance Insights को 15-month retention period के साथ सक्षम करना आवश्यक है और इसकी pricing vCPU-hours (provisioned) या ACU-hours (serverless/limitless) पर आधारित है।

| Feature | Standard | Advanced |
|---|:---:|:---:|
| Dimension द्वारा शीर्ष DB Load contributors का एनालिसिस | ✔ | ✔ |
| Metrics को query, graph, और alarm करें (7-day retention) | ✔ | ✔ |
| Sensitive dimensions के लिए fine-grained IAM access control | ✔ | ✔ |
| Fleet-wide monitoring views | ✘ | ✔ |
| OS process analysis (Enhanced Monitoring) | ✘ | ✔ |
| SQL lock analysis (15-month retention) | ✘ | ✔ (Aurora PG) |
| SQL execution plan analysis (15-month retention) | ✘ | ✔ (Aurora PG, Oracle, SQL Server) |
| Per-query statistics visualization | ✘ | ✔ |
| Slow SQL query analysis | ✘ | ✔ |
| Application Signals integration (calling services) | ✘ | ✔ |
| Consolidated telemetry dashboard (metrics, logs, events) | ✘ | ✔ |
| Auto-import Performance Insights counter metrics | ✘ | ✔ |
| RDS events in CloudWatch | ✘ | ✔ |
| On-demand performance analysis reports | ✘ | ✔ |
| Cross-account cross-region monitoring | ✘ | ✔ |

**Data retention:**
- Standard: Performance Insights data के लिए 7 दिन।
- Advanced: Database Insights द्वारा एकत्रित सभी metrics के लिए 15 महीने।

---

## मुख्य Features की व्याख्या

### Fleet Health Dashboard

Fleet Health Dashboard एक ही स्क्रीन में आपके सभी RDS और Aurora instances का cross-account और cross-region bird's-eye view प्रदान करता है। एक honeycomb visualization vCPU capacity के सापेक्ष DB Load के आधार पर instances को health state (High, Warning, Ok, Idle) द्वारा categorize करता है। आप tags (environment, service, team) द्वारा filter कर सकते हैं और custom fleet views save कर सकते हैं। Top-10 charts सबसे अधिक loaded instances, उनकी top queries, और top wait events एक नज़र में दिखाते हैं।

जब आप सैकड़ों databases के लिए जिम्मेदार हों और जल्दी से पहचानना हो कि किसे attention की आवश्यकता है तो यहां से शुरू करें।

### DB Load Analysis (Investigation Workbench)

Instance Dashboard का DB Load Analysis tab वह जगह है जहां आप अपना अधिकांश troubleshooting समय बिताते हैं। यह पांच W's का उत्तर देता है:

- **WHAT** — कौन सी queries load उत्पन्न कर रही हैं यह देखने के लिए SQL द्वारा slice करें।
- **WHO** — जिम्मेदार पक्ष की पहचान करने के लिए User या Application द्वारा slice करें।
- **WHERE** — Source machine खोजने के लिए Host द्वारा slice करें।
- **WHEN** — Timeline दिखाती है कि issues कब शुरू और बंद हुए।
- **WHY** — Findings को correlate करें और action लें।

Top SQL table queries को load contribution द्वारा rank करती है और calls/sec, average latency, rows examined, और plan count दिखाती है।

### Lock Analysis

Aurora PostgreSQL और RDS for PostgreSQL के लिए उपलब्ध। Database Insights हर 15 सेकंड में lock snapshots capture करता है और उन्हें lock trees के रूप में visualize करता है — parent nodes blocking sessions हैं, child nodes waiters हैं। आप blocking SQL, duration, और downstream sessions की संख्या देख सकते हैं जो प्रभावित हैं। DB Load chart में "Sliced by: Blocking SQL" विकल्प दिखाता है कि कौन से statements समय के साथ lock contention drive कर रहे हैं।

### Execution Plan Analysis

Aurora PostgreSQL (v14.10+, v15.5+), RDS for Oracle, और RDS for SQL Server के लिए उपलब्ध। Top SQL table में Plans Count column दिखाता है कि प्रत्येक query के लिए कितने distinct execution plans मौजूद हैं। आप यह पहचानने के लिए plans की side-by-side तुलना कर सकते हैं कि plan change ने कब performance regression पैदा किया। उच्च plan count optimizer instability का संकेत देता है।

### Database Telemetry

एक consolidated tab जिसमें शामिल है:
- **Metrics** — CloudWatch, OS, और engine counter metrics का customizable dashboard।
- **Logs** — CloudWatch Logs में export किए गए database logs, inline देखने योग्य।
- **OS Processes** — Enhanced Monitoring से per-process CPU/memory।
- **Slow SQL Queries** — Pattern द्वारा grouped, frequency द्वारा ranked slow queries।
- **Events** — RDS operational events (failovers, maintenance, configuration changes)।

### Calling Services (CloudWatch Application Signals Integration)

यह Application Performance Monitoring integration दिखाता है कि कौन सी upstream microservices आपके database को call कर रही हैं, उनकी availability, latency, error rate, और request volume के साथ। यह "database slow है" और "यह specific service और function इसका कारण बन रही है" के बीच की खाई को पाटता है।

### On-Demand Performance Analysis

कोई भी time window चुनें और Database Load chart से "Analyze Performance" चुनकर एक automated, ML-powered analysis trigger करें। Database Insights machine learning models का लाभ उठाता है ताकि selected period की तुलना आपके database के normal baseline behavior से की जा सके, dimensions (SQL statements, wait events, hosts, users, और अधिक) में anomalies और root causes (उदा., "DB load CPU से I/O wait event shift के कारण 4x बढ़ गया") surface करने के लिए scan करता है। प्रत्येक report में specific remediation guidance के साथ prioritized findings शामिल हैं, जो mean-time-to-diagnosis को घंटों से मिनटों तक कम करती हैं। Reports आपके 15-month metric history के साथ retain की जाती हैं ताकि post-incident reviews के दौरान आसानी से retrieval हो सके।

---

## सीमाएं

Database Insights अपनाने से पहले, निम्नलिखित constraints से अवगत रहें:

### Engine और Feature Availability

- **Lock analysis** केवल Aurora PostgreSQL और RDS for PostgreSQL के लिए उपलब्ध है।
- **Execution plan analysis** केवल Aurora PostgreSQL (v14.10+/v15.5+), RDS for Oracle, और RDS for SQL Server के लिए उपलब्ध है।
- सभी Advanced mode features सभी AWS Regions में उपलब्ध नहीं हैं।
- Aurora PostgreSQL Limitless Database support मौजूद है लेकिन reduced feature set (shard group level पर lock analysis या execution plan analysis नहीं) के साथ।

### Data और Configuration Requirements

- **Slow SQL analysis** के लिए CloudWatch Logs में database log export सक्षम होना और उचित DB parameters configured होना आवश्यक है (उदा., PostgreSQL के लिए `log_min_duration_statement`, MySQL के लिए `slow_query_log`)।
- **OS process data** के लिए Enhanced Monitoring सक्षम होना आवश्यक है (अतिरिक्त लागत)।
- **Execution plans** Aurora PostgreSQL पर `aurora_compute_plan_id` parameter को `on` पर set करने की आवश्यकता है। Actual plans (estimated के बनाम) को अतिरिक्त रूप से `aurora_stat_plans.with_analyze` की आवश्यकता है।
- **Calling Services** के लिए आपके applications को CloudWatch Application Signals के साथ instrumented होना आवश्यक है।
- `pg_stat_statements` Aurora PostgreSQL 10+ पर डिफ़ॉल्ट रूप से loaded है, लेकिन SQL text `track_activity_query_size` (default 1,024 bytes) पर truncated है। Long queries incomplete दिखाई दे सकती हैं।

### Operational Limitations

- Lock analysis snapshots हर 15 सेकंड में लिए जाते हैं — बहुत short-lived locks capture नहीं हो सकते।
- Fleet Health Dashboard को saved fleet views के लिए Advanced mode की आवश्यकता है।
- Cross-account monitoring के लिए monitoring और source दोनों accounts में CloudWatch ऑब्ज़र्वेबिलिटी Access Manager (OAM) setup आवश्यक है।
- Performance analysis reports तब delete हो जाती हैं जब उनका start time retention period के बाहर हो जाता है।
- Database Telemetry tab में Dashboard customizations प्रति engine type प्रति region प्रति account apply होती हैं — प्रति instance नहीं।

### Cost Considerations

- Advanced mode की pricing vCPU-hour (provisioned) या ACU-hour (serverless/limitless) पर है। बड़े fleets के लिए, costs significant हो सकती हैं।
- Enhanced Monitoring की अलग charges हैं।
- Log export सक्षम होने पर CloudWatch Logs ingestion और storage costs लागू होती हैं।
- Cluster के भीतर individual instances के लिए Advanced mode सक्षम करने का कोई तरीका नहीं है — यह पूरे DB cluster पर लागू होता है।

---

## बेस्ट प्रैक्टिसेज़

### Standard से शुरू करें, नीतिक रूप से Upgrade करें

Standard mode मुफ्त है और आपको 7-day retention के साथ DB Load analysis देता है। Production-critical databases पर Advanced mode सक्षम करें जहां आपको 15-month retention, fleet views, lock analysis, या execution plan capture की आवश्यकता है। प्रत्येक dev/test instance को Advanced mode की आवश्यकता नहीं है।

### अपने Instances को consistently Tag करें

Database Insights fleet views tags द्वारा filter करते हैं। एक consistent tagging strategy अपनाएं (उदा., `environment`, `service`, `team`) ताकि आप "payments service के लिए सभी production databases" जैसे meaningful fleet views बना सकें।

### Log Export जल्दी सक्षम करें

Slow SQL analysis और Database Telemetry का Logs section तभी काम करता है जब आपने CloudWatch Logs में log export सक्षम किया हो। इसे instance creation time पर करें बजाय retroactively के — आप export सक्षम होने से पहले की historical slow queries का एनालिसिस नहीं कर सकते।

### DB Load पर Alarms सेट करें

अपने instance के vCPU count के सापेक्ष `DBLoad` metric पर CloudWatch Alarms बनाएं। vCPU count से ऊपर sustained DB Load का मतलब है कि sessions queuing कर रहे हैं। ग्राहकों को notice करने से पहले alert करें।

### Who/What/Where/When Framework का उपयोग करें

Performance issue की जांच करते समय, "Sliced by" dropdown को व्यवस्थित रूप से work through करें:
1. **SQL** — problem query की पहचान करें।
2. **Application** या **User** — पहचानें कि कौन चला रहा है।
3. **Host** — पहचानें कि कहां से आ रही है।
4. **Timeline** — पहचानें कि कब शुरू हुई।

यह structured approach आपको rabbit holes में जाने से रोकता है।

### Aurora PostgreSQL के लिए Execution Plan Capture सक्षम करें

अपने cluster parameter group में `aurora_compute_plan_id = on` सेट करें। Plan regressions sudden performance degradation के सबसे सामान्य कारणों में से एक हैं, और plan capture के बिना आप blind fly कर रहे हैं। Overhead minimal है।

### Post-Incident Reviews के लिए On-Demand Analysis का उपयोग करें

किसी भी performance incident के बाद, प्रभावित time window के लिए एक performance analysis report generate करें। यह एक automated summary प्रदान करती है जिसे आप अपने COE या post-mortem में attach कर सकते हैं, और यह 15 महीने तक retain रहती है।

### Multi-Account Architectures के लिए Cross-Account Monitoring का लाभ उठाएं

यदि आपका organization विभिन्न services या environments के लिए अलग AWS accounts का उपयोग करता है, तो OAM के साथ CloudWatch cross-account ऑब्ज़र्वेबिलिटी सेट अप करें। इससे एक central monitoring account सभी accounts और regions में Fleet Health Dashboard देख सकता है — shared database infrastructure प्रबंधित करने वाली platform teams के लिए आवश्यक।

### SQL Text तक Access Restrict करें

SQL text dimension तक access restrict करने के लिए IAM policies का उपयोग करें। Database queries में sensitive data हो सकता है (WHERE clauses में customer IDs, email addresses)। Full SQL visibility केवल DBAs को grant करें और अन्य roles को aggregated metrics तक सीमित करें।

---

## निर्देशात्मक मार्गदर्शन: आज आपको क्या करना चाहिए

### यदि आप अभी शुरू कर रहे हैं:

1. **Verify करें कि Standard mode active है** — यह डिफ़ॉल्ट रूप से होना चाहिए। CloudWatch → Insights → Database Insights पर जाएं और confirm करें कि आप अपने instances देख सकते हैं।
2. अपने production databases के लिए CloudWatch Logs में **log export सक्षम** करें।
3. `CPUUtilization`, `DatabaseConnections`, और `DBLoad` पर **CloudWatch Alarms सेट अप** करें।
4. अपने instances को environment, service, और team tags के साथ **tag करें**।

### यदि आप production workloads चला रहे हैं:

1. Production clusters पर **Advanced mode सक्षम** करें — 15-month retention और fleet views production के लिए cost के लायक हैं।
2. OS-level visibility के लिए **Enhanced Monitoring सक्षम** करें।
3. Execution plan capture के लिए **`aurora_compute_plan_id = on` सेट** करें (Aurora PostgreSQL)।
4. अपने production tags द्वारा filtered **fleet health views बनाएं**।
5. Calling Services view सक्षम करने के लिए अपने applications को CloudWatch Application Signals के साथ **instrument करें**।

### यदि आप एक बड़ा fleet प्रबंधित कर रहे हैं:

1. OAM के साथ **cross-account cross-region monitoring सेट अप** करें।

   OAM कैसे काम करता है:
   - **Monitoring account** — वह central account जहां आपकी team dashboards देखती है। आप यहां एक "sink" बनाते हैं जो अन्य accounts से data स्वीकार करता है।
   - **Source accounts** — वे accounts जो वास्तव में आपके databases चलाते हैं। आप प्रत्येक source account से monitoring account के sink में "links" बनाते हैं, इसे उनका CloudWatch data पढ़ने की permission देते हुए।

   एक बार linked होने पर, monitoring account सभी source accounts से metrics, logs, और traces देख सकता है जैसे कि वे local हों — जिसमें Database Insights Fleet Health Dashboard शामिल है जो सभी linked accounts और regions के instances को एक ही view में दिखाता है।
2. Team, service, या environment द्वारा segmented **multiple fleet views बनाएं**।
3. एक **triage workflow स्थापित** करें: Fleet Health → hot instance पहचानें → DB Load Analysis → who/what/where/when → action लें।
4. अपने highest-traffic instances पर **periodic on-demand analyses चलाएं** ताकि incidents बनने से पहले slow regressions पकड़ सकें।

---

## निष्कर्ष

CloudWatch Database Insights उसे consolidate करता है जिसके लिए पहले कई tools की आवश्यकता थी — Performance Insights, CloudWatch Metrics, CloudWatch Logs, RDS console — एक single, guided अनुभव में। Standard mode बिना किसी लागत के immediate visibility देता है। Advanced mode गंभीर production monitoring के लिए आवश्यक गहराई जोड़ता है: fleet views, lock trees, execution plans, slow query analysis, और 15-month retention।

मानसिकता में मुख्य बदलाव reactive ("database slow है, मुझे SSH करके pg_stat_activity के विरुद्ध queries चलाने दो") से proactive ("मैं अपने पूरे fleet की health देख सकता हूं, किसी भी instance में drill कर सकता हूं, और एक console से दो मिनट के अंदर who/what/where/when का जवाब दे सकता हूं") की ओर जाना है। Database Insights custom tooling या third-party solutions के बिना उस workflow को संभव बनाता है।

---

## संदर्भ

- [CloudWatch Database Insights Documentation](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Database-Insights.html)
- [Get Started with Database Insights](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Database-Insights-Get-Started.html)
- [Lock Analysis](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Database-Insights-Lock-Analysis.html)
- [Execution Plan Analysis](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Database-Insights-Execution-Plans.html)
- [Amazon CloudWatch Pricing](https://aws.amazon.com/cloudwatch/pricing/)

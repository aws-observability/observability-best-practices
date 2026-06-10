# Developers
Observability developers కోసం చాలా కీలకం ఎందుకంటే ఇది ఉత్పాదకతను మెరుగుపరుస్తుంది, అప్లికేషన్ performance ను మెరుగుపరుస్తుంది, మరియు మెరుగైన నిర్ణయాలు మరియు వేగవంతమైన సమస్య పరిష్కారం ద్వారా business విజయాన్ని నడిపిస్తుంది. ఈ గైడ్ observability ను సమర్థవంతంగా ఉపయోగించడానికి ఉత్తమ పద్ధతులు మరియు సిఫార్సులను అందిస్తుంది.

## Developers కోసం Observability ఎందుకు ముఖ్యం
Developers అనేక కీలక ఉద్దేశ్యాల కోసం observability ను ఉపయోగిస్తారు:
- **వేగవంతమైన సమస్య గుర్తింపు మరియు పరిష్కారం:**
    - Observability developers సమస్యలను త్వరగా గుర్తించి diagnose చేయడానికి అనుమతిస్తుంది, సమస్యలను పరిష్కరించడానికి సమయాన్ని (MTTR) తగ్గిస్తుంది మరియు మొత్తం software delivery performance ను మెరుగుపరుస్తుంది
    - ఇది developers తమ systems production లో ఎలా behave అవుతాయో అర్థం చేసుకోవడానికి సహాయపడుతుంది, సమాచారంతో కూడిన నిర్ణయాలు తీసుకోవడానికి మరియు operations ను మెరుగుపరచడానికి వీలు కల్పిస్తుంది
- **Customer Experience ను మెరుగుపరచండి:**
    - System behavior ను విశ్లేషించడం ద్వారా, developers performance మరియు reliability ను optimize చేయగలరు, మెరుగైన customer experiences మరియు పెరిగిన user satisfaction కు దారితీస్తుంది
    - Observability tools user interactions ను monitor చేయడానికి సహాయపడతాయి, developers UI/UX సమస్యలను prompt గా identify మరియు address చేయడానికి అనుమతిస్తాయి
- **మెరుగైన Team Efficiency మరియు Innovation:**
    - Observability platforms operational data కోసం single source of truth ను అందిస్తాయి, cross-team collaboration ను facilitate చేస్తాయి మరియు troubleshooting time ను తగ్గిస్తాయి
    - Automated insights మరియు alerts కారణంగా Developers innovation పై ఎక్కువ దృష్టి పెట్టగలరు మరియు manual debugging పై తక్కువ
- **Data-Driven నిర్ణయాలు:**
    - Observability system performance గురించి వివరమైన insights ను అందిస్తుంది, code improvements మరియు resource allocation గురించి data-driven నిర్ణయాలు తీసుకోవడానికి developers ను అనుమతిస్తుంది
    - ఇది organizations investments ను optimize చేయడానికి మరియు మెరుగుదల కోసం ప్రాంతాలను identify చేయడం ద్వారా time to market ను accelerate చేయడానికి సహాయపడుతుంది
- **Complexity నిర్వహణ:**
    - Observability system interdependencies యొక్క సమగ్ర view ను అందించడం ద్వారా modern cloud-native మరియు multi-cloud environments యొక్క complexity ను manage చేయడానికి సహాయపడుతుంది
    - ఇది developers complexity ను distill చేయడానికి మరియు relevant data పై focus చేయడానికి అనుమతిస్తుంది, మరింత efficient development processes ను promote చేస్తుంది

## Code quality కోసం ఉత్తమ పద్ధతులు
- **Issue Tracking Metrics ను Monitor చేయండి:**
    - JIRA లేదా Trello లేదా ఇతర issue tracking platforms వంటి tools ను ఉపయోగించి ఈ క్రింది metrics ను track చేయండి:
        - ఒక ticket code review నుండి test review కు మరియు తిరిగి in progress కు ఎన్నిసార్లు move అవుతుందో. ఎక్కువ సంఖ్య skills లేకపోవడం, ఎక్కువ complexity, లేదా తగినంత tooling లేకపోవడం సూచించవచ్చు.
        - ఒక ticket external dependencies వల్ల ఎన్నిసార్లు blocked అవుతుందో. ఎక్కువ సంఖ్య dependencies మధ్య ఎక్కువ coupling మరియు/లేదా ఎక్కువ complexity ని సూచించగలదు.
    - **సిఫార్సులు:**
        - Automated code reviews తో productivity మరియు code quality ను boost చేయడానికి [Amazon Q Developer](https://aws.amazon.com/q/developer) వంటి tool ను ఉపయోగించండి. Amazon Q Developer software development tasks ను 80% వరకు speed up చేయగలదు, rapid development cycles సమయంలో human error యొక్క likelihood ను తగ్గించడం ద్వారా higher-quality code కి contribute చేస్తుంది.
        - Improvements identify చేయడానికి మరియు continuous improvement mindset ను foster చేయడానికి retrospectives లో భాగంగా metrics యొక్క regular reviews ను schedule చేయండి

- **Performance Metrics కోసం Code ను Instrument చేయండి:**
    - Code implementation యొక్క performance efficiency మరియు scalability ను assess చేయడం ద్వారా code quality యొక్క indirect measure ను provide చేసే క్రింది వాటిని measure చేయగలిగేలా మీ code ను instrument చేయండి
        - **RED Method:** Microservices కోసం Requests, Errors, మరియు Duration ను Monitor చేయండి. ఇది service performance మరియు reliability గురించి insights అందిస్తుంది.
        - **USE Method:** System resources కోసం Utilization, Saturation, మరియు Errors ను Track చేయండి. ఇది bottlenecks మరియు resource constraints ను identify చేయడానికి సహాయపడుతుంది.
    - Request processing path లో ఇతర services, database, cache, etc. వంటి అన్ని external dependencies కు calls చుట్టూ instrumentation add చేయండి. ఇది request processing time లో sudden changes ను investigate చేయడానికి అవసరమైన సమాచారాన్ని అందించగలదు మరియు సమస్య యొక్క root cause ను faster identification ను enable చేస్తుంది
    - **సిఫార్సులు:**
        - Request latency మరియు error rate పై SLO (Service Level Objective) సెట్ చేసి మెరుగైన quality మరియు performance కోసం improvements ను drive చేయడానికి ఉపయోగించండి
        - Critical data flow మరియు request processing paths ను exercise చేసే automated tests కు instrumentation validation ను add చేయండి
        - System performance మరియు code quality measure యొక్క baseline సృష్టించడానికి automated load test task build చేయండి
        - Single request యొక్క performance impact ను identify చేయగలిగేలా instrumentation కు context add అయిందని నిర్ధారించండి
        - Instrumentation add చేయడంలో manual work ను తగ్గించడానికి SDKs అందించే auto-instrumentation ను configure చేసి ఉపయోగించండి


## సమర్థవంతమైన logging మరియు monitoring
- Structured log formats ఉపయోగించండి ఉదా. json. ఇప్పటికే ఉన్న అప్లికేషన్‌ల కోసం, ఎక్కువ context inject చేయడానికి, fields add లేదా remove చేయడానికి log transformation features ఉపయోగించడం పరిగణించండి
- Meaningful signals derive చేయగలిగేలా మరియు signals అంతటా cross correlate చేయగలిగేలా తగిన metadata కలిగిన wide event format ఉపయోగించండి.
- Cross signal correlation మరియు Mean Time To Identify (MTTI) తగ్గింపును enable చేసే logs లోకి additional context inject చేసే OpenTelemetry లేదా ADOT SDKs ఉపయోగించండి, అందువల్ల Mean Time To Recover (MTTR) తగ్గుతుంది
- Log levels ను appropriately ఉపయోగించండి - ఇవి logs volume ను మరియు అందువల్ల ingestion cost ను control చేయడానికి మీకు సహాయపడతాయి.
    - ఏదైనా unexpected మరియు expected error conditions కోసం ERROR ఉపయోగించండి. Root cause analysis ను accelerate చేయగలిగేలా వీలైనంత ఎక్కువ additional context add చేయండి.
    - User login వంటి general run time events కోసం INFO ఉపయోగించండి, ఇది context provide చేస్తుంది మరియు important.
    - Application flow మరియు states యొక్క deeper understanding పొందడానికి processing path లో calls logging కోసం DEBUG ఉపయోగించండి.
- PII లేదా PHI వంటి sensitive గా పరిగణించబడే ఏదైనా data ను log చేయకుండా ఉండండి. Requirement ఉన్నచోట, data protection policy ఉపయోగించడం లేదా ingestion పై data redacting చేయడం పరిగణించండి. Raw data ను ఎవరు చూడగలరో control చేయడానికి IAM policies ఉపయోగించండి.
- Observability platform కు API calls సంఖ్యను తగ్గించడానికి, ఖర్చును తగ్గించడానికి logs లో metrics embed చేయడానికి embedded metric format (EMF) ఉపయోగించండి.
    - requestId వంటి high cardinality dimensions ఉన్న metrics కోసం EMF ఉపయోగించడం మానుకోండి
- **Alerts:**
    - Alerts కోసం rigid thresholds set చేయడం నివారించడానికి anomaly detection ఉపయోగించండి. ఇది system usage కాలక్రమేణా మారినప్పుడు thresholds update చేయడం యొక్క overhead ను నివారించగలదు మరియు alert noise ను తగ్గించగలదు.
    - Particular failure కోసం generate అయ్యే individual alerts సంఖ్యను తగ్గించడానికి metric math మరియు combination alerts ఉపయోగించండి.
    - SLO risk లో ఉన్నప్పుడు/fail అవుతున్నప్పుడు మాత్రమే alert చేయండి. ఇది మీ team ని అనవసరంగా నిద్ర లేపడం నివారించగలదు మరియు cognitive మరియు context overload ను తగ్గించగలదు
    - Failure notification పై ఎవరైనా action తీసుకోగలిగినప్పుడు మాత్రమే alert చేయండి
    - సాధ్యమైన చోట alert resolution ను automate చేయండి. ఉదాహరణకు, autoscaling, replica లేదా standby instance కు automatic failover వంటి native platform configuration ను leverage చేయండి.
    - Notify అయిన వ్యక్తి చూడవలసిన dashboards, ఉపయోగించవలసిన playbook మరియు impact అయిన service ను త్వరగా identify చేయగలిగేలా alert notification కు తగిన context add చేయండి
- **Dashboards:**
    - Persona/stakeholder కి ఒకటి లేదా అంతకంటే ఎక్కువ dashboards సృష్టించండి.
        - Application developers సమస్యలను diagnose చేయడానికి, అప్లికేషన్ performance ను అర్థం చేసుకోవడానికి తగిన context అవసరం
        - Platform engineers SLOs పై impact మరియు attention అవసరమైన infrastructure components మరియు వాటిని ఉపయోగిస్తున్న services పై వాటి impact ను identify చేయడానికి context ఉన్న dashboards అవసరం
        - Product managers user journey, product feature usage metrics, adoption rates, abandonment points, etc. చూపించే dashboards అవసరం
        - Business stakeholders product adoption rates, subscriber fall off లేదా business performance మరియు revenue ను impact చేయడానికి relate చేయగల ఏదైనా demonstrate చేసే widgets లో ఆసక్తి కలిగి ఉంటారు
    - అన్ని dashboards అంతటా consistent timezone ఉపయోగించండి ఉదా. UTC
    - Dashboard పై అన్ని widgets అంతటా same time range ఉపయోగించండి
    - Dashboards కు more context add చేయడానికి annotations ఉపయోగించండి
    - Error resolutions లో aid చేయడానికి context add చేసే widgets మాత్రమే dashboard పై ఉండేలా నిర్ధారించండి. చాలా widgets noise మరియు cognitive overload add చేయగలవు, higher MTTR కు దారితీస్తుంది
        - ఇప్పటికే చాలా widgets లేకపోతే ఇతర nice to have widgets ను another dashboard కు లేదా dashboard bottom కు move చేయండి. చాలా widgets load time ను impact చేస్తాయి మరియు higher stress మరియు cognitive overload కి result అవుతాయి.
    - మొత్తం dashboard ఒక single screen లో fit అవ్వాలని మరియు laptop resolution మరియు screen size తో trends visible అయ్యేలా నిర్ధారించండి
    - Dashboard description మరియు dashboard ఎలా ఉపయోగించాలో guidance ఉన్న widget కలిగి ఉండండి
    - Widgets పై thresholds configure చేసి display చేయండి
    - Single widget లో ఎక్కువ metrics stuff చేయకండి ఇది trends మరియు spikes smoothed అవ్వడానికి మరియు purpose defeat చేయడానికి result అవుతుంది. ఇది diagnosis ను కూడా hard చేస్తుంది.
    - Trends మరియు spikes visible అయ్యేలా dynamically adjusted Y-axis ఉపయోగించండి
- **సిఫార్సులు:**
    - **Cost Control:**
        - **Stakeholders ను Identify చేయండి:**
            - Feature performance లో ఆసక్తి కలిగి ఉన్న వివిధ personas ను determine చేయండి, functionality, availability, security, cost, sales, మరియు product usage వంటివి.
            - Stakeholders development teams, end customers, internal business stakeholders, platform operations teams, లేదా application developers ను include చేయవచ్చు.
        - **Key outcomes ను Identify చేయండి:**
            - ప్రతి stakeholder కోసం, quantifiable outcomes (ఉదా., error rates, request processing duration, minute కి logins సంఖ్య, minute కి purchased products సంఖ్య, abandoned carts సంఖ్య, etc.) define చేయండి ఇవి సాధారణంగా Service Level Objectives (SLOs) ఉపయోగించి measure చేయబడతాయి.
            - Required instrumentation identify చేయడానికి persona కి ఈ SLOs ఉపయోగించండి
        - **సరైన signal ఎంచుకోండి:**
            - తగిన context ఉన్న wide log metrics మరియు traces గా convert చేయబడవచ్చు ఇది one source of truth ఇస్తుంది, cost control చేస్తుంది మరియు signal correlation enable చేస్తుంది
            - అప్లికేషన్ లో instrument చేయవలసిన సరైన signals identify చేయడానికి [Observability Strategy Workshop](https://catalog.us-east-1.prod.workshops.aws/workshops/e31f4fcc-1944-4e46-815d-26fc9eafabce/en-US/5-practical-examples/5-1petstore-site-exercise/scenario1) run చేయండి
    - **సరైన signal ఎంచుకోండి:**
        - Logs మరియు traces failure లేదా unexpected behaviour యొక్క root cause ను కనుగొనడానికి సహాయపడతాయి. "ఒక particular request ఎందుకు fail అయింది?" లేదా "request processing time కోసం p50 లేదా p99 లో increase ఉంటే request duration కు related SLO కోసం నాకు ఏమి తెలుసుకోవాలి?" వంటి ప్రశ్నలకు answer చేయడానికి సహాయపడే logs add చేయండి
        - Metrics baseline performance అర్థం చేసుకోవడానికి, trends మరియు anomalies predict చేయడానికి good. ఏదో expected గా work అవ్వడం లేదని proactively indication ఇవ్వగలవు. Custom metrics అయితే expensive.
    - **Alert Fatigue తగ్గించండి:**
        - Configuration ను బట్టి, alerts system లో issue ను proactively లేదా reactively highlight చేయగలవు. చాలా alerts alert fatigue మరియు inefficient teams కు దారితీయగలవు, bad code quality మరియు product delivery కు దారితీస్తాయి.
    - **Periodic Reviews మరియు Continuous Improvement:**
        - Dashboards ను monitor చేయడానికి మరియు identify అయిన ఏదైనా new trends లేదా patterns ను report చేయడానికి team పై ఒక member కోసం periodic roster కలిగి ఉండండి.
        - Retrospectives మరియు roster observations సమయంలో identify అయిన gaps ఆధారంగా signals మెరుగుపరచడానికి, alert thresholds మరియు dashboards tweak చేయడానికి ప్రతి release లో ఒక portion allocate చేయండి
        - Resolve చేయడానికి effort మరియు alert triggers అయిన సార్ల సంఖ్య ఆధారంగా recurring alert యొక్క root cause fix చేయడానికి prioritize చేయండి

## Profiling మరియు performance optimization
- **Real User Monitoring (RUM):**
    - Real user interactions ను monitor చేయడానికి మరియు performance bottlenecks ను identify చేయడానికి [AWS X-Ray](https://aws.amazon.com/xray/) లేదా New Relic వంటి tools ఉపయోగించండి. Key conversion points పై focus చేసి technical performance మరియు business outcomes (conversion rates, abandonment points) రెండింటినీ measure చేయండి.
    - Checkout flows మరియు registration processes వంటి critical user paths monitoring కు prioritize చేయండి.
    - Business outcomes ను impact చేయగల anomalies మరియు trends ను quickly identify చేయగలిగేలా baseline performance మరియు user behavior establish చేయండి
- **Synthetics:**
    - User interactions simulate చేయడానికి మరియు various conditions లో అప్లికేషన్ performance test చేయడానికి [Amazon Cloudwatch Synthetics](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch_Synthetics_Canaries.html) వంటి tools employ చేయండి. Synthetic canaries user impact detect అయ్యే ముందు issues identify చేయడానికి సహాయపడగలవు.
    - Synthetic canaries తో health checks మరియు system uptime validate చేయండి.
- **Profiling tools:**
    - Performance bottlenecks identify చేయడానికి మరియు resource utilization optimize చేయడానికి [AWS X-Ray](https://aws.amazon.com/xray/) వంటి tools profiling కోసం ఉపయోగించండి
    - Traffic patterns ఆధారంగా adjust అయ్యే dynamic sampling rates సెట్ చేయండి మరియు error traces మరియు outliers యొక్క తగిన retention maintain చేయండి. ఇది data volume మరియు costs manage చేస్తూ critical issues లోకి comprehensive visibility ensure చేస్తుంది.
    - Error status, duration thresholds, మరియు custom attributes ఆధారంగా high-value traces ను prioritize చేసే multiple sampling policies తో మీ collector configure చేయడానికి tail sampling ఉపయోగించండి. ఇది sampled traces most value ఉన్న వాటిని include చేస్తాయని ensure చేస్తుంది
- **OpenTelemetry:**
    - Performance metrics మరియు traces collection ను simplify చేయడానికి auto-instrumentation కోసం [OpenTelemetry](https://opentelemetry.io/) ఉపయోగించండి. Manual instrumentation add చేయడానికి ముందు auto instrumentation provide చేసిన telemetry validate చేసి, ఆపై signals మరియు cost control చేయడానికి requirements ఆధారంగా auto instrumentation tune చేయడం చూడండి.

## Error handling మరియు debugging techniques
- **General:**
    - Transient failures కోసం exponential backoff తో retry mechanisms design చేయండి. External dependencies కోసం [circuit breakers](https://docs.aws.amazon.com/prescriptive-guidance/latest/cloud-design-patterns/circuit-breaker.html) implement చేయండి. ఇది distributed systems లో ప్రత్యేకంగా helpful మరియు downstream component/service పై excessive load నివారిస్తుంది. ఇది అన్ని scenarios లో applicable కాకపోవచ్చు కాబట్టి ఈ design adopt చేయడానికి ముందు due diligence perform చేయండి.
    - Critical operations కోసం fallback mechanisms సృష్టించండి మరియు failed transactions కోసం clear rollback procedures maintain చేయండి.
    - అన్ని entry points వద్ద input validation add చేయండి.
    - Retryable operations idempotent అని ensure చేయండి.
- **Logging:**
    - Saved [Cloudwatch Log Insights](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/CWL_Insights-Saving-Queries.html) queries యొక్క repository maintain చేయండి. Queries group చేయడానికి folders ఉపయోగించండి
    - Errors silence చేయకండి. ఎల్లప్పుడూ log చేయండి లేదా appropriately handle చేయండి.
    - ఏదైనా ఇతర relevant context తో పాటు logs కు correlation id లేదా request id వంటి identification form add చేయండి.
- **Playbooks మరియు runbooks:**
    - Playbooks write చేసేటప్పుడు, required permissions, tools మరియు expected outcomes తో clear actionable steps include చేయండి.
    - Playbooks మరియు run books లో verification steps, rollback procedures, మరియు relevant dashboards కు links include చేయండి.
    - Learnings మరియు key insights include చేస్తూ incidents తర్వాత playbooks version మరియు update చేయండి.
- **Sampling rules tune చేయడం:**
    - Service criticality మరియు traffic patterns ఆధారంగా dynamic sampling rules implement చేయండి.
    - Error conditions మరియు business-critical paths కోసం higher sampling rates సెట్ చేయండి.
    - Operational needs మరియు cost considerations ఆధారంగా sampling rules regularly review మరియు adjust చేయండి.

## Code reviews మరియు collaboration strategies
- **Ticket elaboration:**
    - Feature elaboration process లో భాగంగా Observability requirements identify చేయండి. ఇందులో include కావచ్చు
        - Impacted Stakeholders మరియు related SLOs
        - Required telemetry/signals
        - Required alerts
        - సృష్టించవలసిన లేదా update చేయవలసిన dashboards list
- **Blameless retrospectives:**
    - ప్రతి incident తర్వాత, processes మెరుగుపరచడానికి లేదా automation add చేయడానికి opportunities కోసం blameless retrospective conduct చేయండి. ఎల్లప్పుడూ change cost ను factor చేయండి మరియు completion timeline associate అయిన కనీసం ఒక agreed upon actionable item తో ప్రతి post mortem exercise నుండి వెళ్ళేలా ensure చేయండి.
- **Operational Readiness Reviews:**
    - Observability posture లో gaps identify చేయడానికి platform మరియు operations team తో operational readiness reviews లో participate చేయండి - ఇది checklist కావచ్చు మరియు production deployments ముందు mandatory exercise. Multiple teams ఉన్న large organisations కోసం, ఈ process bottleneck అవ్వకుండా ఉండేందుకు, periodically, per new feature మరియు release cadence conduct చేయండి.
- **సిఫార్సులు:**
    - Post-incident analysis ద్వారా మిమ్మల్ని guide చేయడానికి [AWS Systems Manager Incident Manager](https://docs.aws.amazon.com/incident-manager/latest/userguide/analysis.html) వంటి tool ఉపయోగించండి
    - మీ operational readiness review checklist లేదా process లో include చేయవలసిన questions పై inspiration కోసం [Operational Readiness Review](https://docs.aws.amazon.com/wellarchitected/latest/operational-readiness-reviews/wa-operational-readiness-reviews.html) refer చేయండి.
    - Retrospectives, operational readiness reviews నుండి learnings ఎల్లప్పుడూ share చేయండి - ఇది wiki లేదా mail group subscriptions ద్వారా కావచ్చు

## API design మరియు documentation guidelines
- **Versioning:**
    - APIs versioned అయి ఉండేలా మరియు process చేయబడిన ప్రతి request కోసం version context గా add అయ్యేలా ensure చేయండి
    - Custom metrics send చేస్తున్నప్పుడు, applicable అయితే version పై dimension add చేయండి
    - ఒక version నుండి another కు cutover ను clearly distinguish చేయడానికి dashboards పై annotation లేదా identifier add చేయండి
    - ప్రతి version కు requests track చేసి versions usage visualize చేయడానికి widget కలిగి ఉండేలా ensure చేయండి. ఇది requests expected గా route అవుతున్నాయని ascertain చేయడానికి మరియు root cause identify చేయడానికి time తగ్గించడానికి. ఇది older version deprecate మరియు remove చేసేటప్పుడు increased confidence provide చేయగలదు
- **Backwards Compatibility:**
    - Older API version కు related code paths remove చేయడానికి ముందు older versions కు requests లేవని ensure చేయండి
- **Batch APIs:**
    - ప్రతి individual request status కోసం మరియు overall batch request కోసం signals emit చేయండి
    - Batch request id మరియు individual request identify చేసే logs కు context add అయ్యేలా ensure చేయండి

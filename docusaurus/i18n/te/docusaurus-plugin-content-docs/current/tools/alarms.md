# అలారాలు

Amazon CloudWatch alarms CloudWatch Metrics మరియు Logs చుట్టూ thresholds ను నిర్వచించడానికి మరియు CloudWatch లో కాన్ఫిగర్ చేయబడిన నియమాల ఆధారంగా నోటిఫికేషన్‌లను అందుకోవడానికి మిమ్మల్ని అనుమతిస్తుంది.

**CloudWatch metrics పై అలారాలు:**

CloudWatch alarms CloudWatch metrics పై thresholds ను నిర్వచించడానికి మరియు metrics పరిధి బయట పడినప్పుడు నోటిఫికేషన్‌లను అందుకోవడానికి మిమ్మల్ని అనుమతిస్తుంది. ప్రతి metric బహుళ alarms ను ట్రిగ్గర్ చేయవచ్చు, మరియు ప్రతి alarm దానితో అనుబంధించబడిన అనేక actions ను కలిగి ఉండవచ్చు. CloudWatch metrics ఆధారంగా metric alarms సెటప్ చేయడానికి రెండు వేర్వేరు మార్గాలు ఉన్నాయి.

1. **Static threshold**: Static threshold అనేది metric ఉల్లంఘించకూడని హార్డ్ లిమిట్‌ను సూచిస్తుంది. సాధారణ ఆపరేషన్ల సమయంలో ప్రవర్తనను అర్థం చేసుకోవడానికి static threshold కోసం upper limit మరియు lower limit వంటి పరిధిని మీరు నిర్వచించాలి. Metric విలువ static threshold కంటే తక్కువగా లేదా ఎక్కువగా పడితే మీరు CloudWatch ను alarm జనరేట్ చేయడానికి కాన్ఫిగర్ చేయవచ్చు.

2. **Anomaly detection**: Anomaly detection సాధారణంగా డేటా యొక్క ఎక్కువ భాగం నుండి గణనీయంగా విచలనం చెందే మరియు సాధారణ ప్రవర్తన యొక్క బాగా-నిర్వచించబడిన భావనకు అనుగుణంగా లేని అరుదైన అంశాలు, ఈవెంట్‌లు లేదా పరిశీలనలుగా గుర్తించబడుతుంది. CloudWatch anomaly detection గత metric డేటాను విశ్లేషిస్తుంది మరియు అంచనా విలువల మోడల్‌ను సృష్టిస్తుంది. అంచనా విలువలు metric లో సాధారణ గంటల వారీ, రోజువారీ మరియు వారంవారీ నమూనాలను పరిగణనలోకి తీసుకుంటాయి. మీరు అవసరమైన ప్రతి metric కోసం anomaly detection ను వర్తింపజేయవచ్చు మరియు CloudWatch ప్రతి ఎనేబుల్ చేయబడిన metrics కోసం upper limit మరియు lower limit ను నిర్వచించడానికి machine-learning algorithm ను వర్తింపజేస్తుంది మరియు metrics అంచనా విలువల బయట పడినప్పుడు మాత్రమే alarm జనరేట్ చేస్తుంది.

:::tip
	మీ వర్క్‌లోడ్‌లోని గుర్తించబడిన పనితీరు breakpoints లేదా infrastructure components పై సంపూర్ణ పరిమితులు వంటి మీకు దృఢమైన అవగాహన ఉన్న metrics కోసం Static thresholds ఉత్తమంగా ఉపయోగించబడతాయి.
:::
:::info
	ఒక నిర్దిష్ట metric యొక్క పనితీరు గురించి కాలక్రమేణా మీకు దృశ్యమానత లేనప్పుడు, లేదా load-testing లేదా అసాధారణ ట్రాఫిక్ కింద metric విలువ గతంలో పరిశీలించబడనప్పుడు మీ alarms తో anomaly detection model ను ఉపయోగించండి.
:::
![CloudWatch Alarm రకాలు](../images/cwalarm1.png)

CloudWatch లో Static మరియు Anomaly ఆధారిత alarms సెటప్ ఎలా చేయాలో మీరు క్రింది సూచనలను అనుసరించవచ్చు.

[Static threshold alarms](https://catalog.us-east-1.prod.workshops.aws/workshops/31676d37-bbe9-4992-9cd1-ceae13c5116c/en-US/alarms/mericalarm)

[CloudWatch anomaly Detection ఆధారిత alarms](https://catalog.us-east-1.prod.workshops.aws/workshops/31676d37-bbe9-4992-9cd1-ceae13c5116c/en-US/alarms/adalarm)

:::info
	Alarm fatigue ను తగ్గించడానికి లేదా జనరేట్ చేయబడిన alarms సంఖ్య నుండి శబ్దాన్ని తగ్గించడానికి, alarms ను కాన్ఫిగర్ చేయడానికి మీకు రెండు అధునాతన పద్ధతులు ఉన్నాయి:

	1. **Composite alarms**: Composite alarm సృష్టించబడిన ఇతర alarms యొక్క alarm states ను పరిగణనలోకి తీసుకునే rule expression ను కలిగి ఉంటుంది. Composite alarm rule యొక్క అన్ని షరతులు నెరవేరినప్పుడు మాత్రమే `ALARM` state లోకి వెళ్తుంది. Composite alarm యొక్క rule expression లో పేర్కొన్న alarms metric alarms మరియు ఇతర composite alarms ను కలిగి ఉండవచ్చు. Composite alarms [aggregation తో alarm fatigue ను ఎదుర్కోవడానికి](../signals/alarms.md#fight-alarm-fatigue-with-aggregation) సహాయపడతాయి.

	2. **Metric math ఆధారిత alarms**: మరింత అర్థవంతమైన KPI లు మరియు వాటిపై alarms నిర్మించడానికి Metric math expressions ఉపయోగించవచ్చు. మీరు బహుళ metrics ను కలిపి combined utilization metric ను సృష్టించవచ్చు మరియు వాటిపై alarm సెట్ చేయవచ్చు.
:::

Composite alarms మరియు Metric math ఆధారిత alarms సెటప్ ఎలా చేయాలో ఈ క్రింది సూచనలు మిమ్మల్ని మార్గదర్శనం చేస్తాయి.

[Composite Alarms](https://catalog.us-east-1.prod.workshops.aws/workshops/31676d37-bbe9-4992-9cd1-ceae13c5116c/en-US/alarms/compositealarm)

[Metric Math alarms](https://aws.amazon.com/blogs/mt/create-a-metric-math-alarm-using-amazon-cloudwatch/)

**CloudWatch Logs పై అలారాలు**

CloudWatch Logs ఉపయోగించి CloudWatch Metric filter ఉపయోగించి alarms ను సృష్టించవచ్చు. Metric filters లాగ్ డేటాను మీరు గ్రాఫ్ చేయగల లేదా alarm సెట్ చేయగల సంఖ్యాత్మక CloudWatch metrics గా మారుస్తాయి. మీరు metrics ను సెటప్ చేసిన తర్వాత CloudWatch Logs నుండి జనరేట్ చేయబడిన CloudWatch metrics పై static లేదా anomaly ఆధారిత alarms ను ఉపయోగించవచ్చు.

CloudWatch logs పై [metric filter సెటప్ ఎలా చేయాలో](https://aws.amazon.com/blogs/mt/quantify-custom-application-metrics-with-amazon-cloudwatch-logs-and-metric-filters/) మీరు ఒక ఉదాహరణను కనుగొనవచ్చు.

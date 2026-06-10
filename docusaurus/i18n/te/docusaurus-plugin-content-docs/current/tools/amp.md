# Amazon Managed Service for Prometheus

[Prometheus](https://prometheus.io/) అనేది ప్రముఖ ఓపెన్ సోర్స్ మానిటరింగ్ సాధనం, ఇది కంప్యూట్ నోడ్‌లు మరియు అప్లికేషన్ సంబంధిత పనితీరు డేటా వంటి వనరుల గురించి విస్తృత శ్రేణి మెట్రిక్స్ సామర్థ్యాలు మరియు అంతర్దృష్టులను అందిస్తుంది.

Prometheus డేటాను సేకరించడానికి *pull* మోడల్ ఉపయోగిస్తుంది, CloudWatch *push* మోడల్ ఉపయోగిస్తుంది. Prometheus మరియు CloudWatch కొన్ని అతివ్యాప్తి ఉపయోగ సందర్భాలకు ఉపయోగించబడతాయి, అయినప్పటికీ వాటి ఆపరేటింగ్ మోడల్‌లు చాలా భిన్నంగా ఉంటాయి మరియు వేరే విధంగా ధర నిర్ణయించబడతాయి.

[Amazon Managed Service for Prometheus](https://aws.amazon.com/prometheus/) Kubernetes మరియు [Amazon ECS](https://aws.amazon.com/ecs/) లో హోస్ట్ చేయబడిన కంటైనరైజ్డ్ అప్లికేషన్‌లలో విస్తృతంగా ఉపయోగించబడుతుంది.

[CloudWatch ఏజెంట్](./cloudwatch_agent.md) లేదా [AWS Distro for OpenTelemetry](https://aws-otel.github.io/) ఉపయోగించి మీ EC2 ఇన్‌స్టాన్స్ లేదా ECS/EKS క్లస్టర్‌లో Prometheus మెట్రిక్ సామర్థ్యాలను జోడించవచ్చు. Prometheus సపోర్ట్‌తో CloudWatch ఏజెంట్ అప్లికేషన్ పనితీరు క్షీణత మరియు వైఫల్యాలపై మానిటర్ చేయడానికి, ట్రబుల్‌షూట్ చేయడానికి మరియు అలారం ఇవ్వడానికి Prometheus మెట్రిక్స్‌ను కనుగొని సేకరిస్తుంది. ఇది observability మెరుగుపరచడానికి అవసరమైన మానిటరింగ్ సాధనాల సంఖ్యను కూడా తగ్గిస్తుంది.

CloudWatch Container Insights Prometheus కోసం మానిటరింగ్ కంటైనరైజ్డ్ సిస్టమ్‌లు మరియు వర్క్‌లోడ్‌ల నుండి Prometheus మెట్రిక్స్ ఆటోమేటిక్ డిస్కవరీని చేస్తుంది https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/ ContainerInsights-Prometheus.html

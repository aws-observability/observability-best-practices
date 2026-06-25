# AWS X-Ray - FAQ

## AWS Distro for Open Telemetry (ADOT) Event Bridge లేదా SQS వంటి AWS సేవల అంతటా ట్రేస్ ప్రాపగేషన్‌ను మద్దతిస్తుందా?

సాంకేతికంగా, అది ADOT కాదు AWS X-Ray. ట్రేస్‌లను ప్రాపగేట్ చేసే మరియు/లేదా స్పాన్‌లను జనరేట్ చేసే AWS సేవల సంఖ్య మరియు రకాలను విస్తరించడంపై మేము పని చేస్తున్నాము. దీనిపై ఆధారపడిన ఉపయోగ సందర్భం మీకు ఉంటే, దయచేసి మమ్మల్ని సంప్రదించండి.

## ADOT ఉపయోగించి AWS X-Ray లోకి స్పాన్‌లను ఇంజెస్ట్ చేయడానికి W3C ట్రేస్ హెడర్‌ను ఉపయోగించగలనా?

అవును. [W3c ట్రేస్ హెడర్](https://aws.amazon.com/about-aws/whats-new/2023/10/aws-x-ray-w3c-format-trace-ids-distributed-tracing/) అక్టోబర్ 27, 2023 న విడుదల చేయబడింది.

## SQS మధ్యలో ఉన్నప్పుడు Lambda ఫంక్షన్‌ల అంతటా అభ్యర్థనలను ట్రేస్ చేయగలనా?

అవును. SQS మధ్యలో ఉన్నప్పుడు Lambda ఫంక్షన్‌ల అంతటా ట్రేసింగ్‌ను X-Ray ఇప్పుడు మద్దతిస్తుంది. upstream మెసేజ్ ప్రొడ్యూసర్ల నుండి ట్రేస్‌లు downstream Lambda consumer నోడ్‌ల నుండి ట్రేస్‌లకు [ఆటోమేటిక్‌గా లింక్ చేయబడతాయి](https://docs.aws.amazon.com/xray/latest/devguide/xray-services-sqs.html), అప్లికేషన్ యొక్క ఎండ్-టు-ఎండ్ వ్యూను సృష్టిస్తాయి.

## నా అప్లికేషన్‌ను ఇన్‌స్ట్రుమెంట్ చేయడానికి X-Ray SDK లేదా OTel SDK ఉపయోగించాలా?

OTel X-Ray SDK కంటే ఎక్కువ ఫీచర్లను అందిస్తుంది, కానీ మీ ఉపయోగ సందర్భానికి ఏది సరైనదో ఎంచుకోవడానికి [ADOT మరియు X-Ray SDK మధ్య ఎంపిక](https://docs.aws.amazon.com/xray/latest/devguide/xray-instrumenting-your-app.html#xray-instrumenting-choosing) చూడండి

## [స్పాన్ ఈవెంట్‌లు](https://opentelemetry.io/docs/instrumentation/ruby/manual/#add-span-events) AWS X-Ray లో మద్దతిస్తాయా?

స్పాన్ ఈవెంట్‌లు X-Ray మోడల్‌లో సరిపోవు కాబట్టి డ్రాప్ చేయబడతాయి.

## AWS X-Ray నుండి డేటాను ఎలా ఎక్స్‌ట్రాక్ట్ చేయగలను?

మీరు [X-Ray APIs ఉపయోగించి](https://docs.aws.amazon.com/xray/latest/devguide/xray-api-gettingdata.html) Service Graph, Traces మరియు Root cause analytics డేటాను తిరిగి పొందగలరు.

## 100% శాంప్లింగ్ సాధించగలనా? అంటే, శాంప్లింగ్ లేకుండా అన్ని ట్రేస్‌లు రికార్డ్ చేయబడాలని నేను కోరుకుంటున్నాను.

మీరు గణనీయంగా పెరిగిన ట్రేస్ డేటాను క్యాప్చర్ చేయడానికి శాంప్లింగ్ నియమాలను సర్దుబాటు చేయవచ్చు. పంపిన మొత్తం సెగ్మెంట్‌లు [ఇక్కడ పేర్కొన్న సేవా కోటా పరిమితులను](https://docs.aws.amazon.com/general/latest/gr/xray.html#limits_xray) ఉల్లంఘించనంత వరకు, X-Ray కాన్ఫిగర్ చేయబడిన విధంగా డేటాను సేకరించడానికి ప్రయత్నిస్తుంది. ఫలితంగా ఇది 100% ట్రేస్ డేటా క్యాప్చర్‌కు దారితీస్తుందనే హామీ లేదు.

## APIs ద్వారా శాంప్లింగ్ నియమాలను డైనమిక్‌గా పెంచడం లేదా తగ్గించడం సాధ్యమా?

అవును, అవసరమైనప్పుడు డైనమిక్‌గా సర్దుబాట్లు చేయడానికి [X-Ray శాంప్లింగ్ APIs](https://docs.aws.amazon.com/xray/latest/devguide/xray-api-sampling.html) ను ఉపయోగించవచ్చు. [ఉపయోగ సందర్భం ఆధారిత వివరణ కోసం ఈ బ్లాగ్](https://aws.amazon.com/blogs/mt/dynamically-adjusting-x-ray-sampling-rules/) చూడండి.

**ఉత్పత్తి FAQ:** [https://aws.amazon.com/xray/faqs/](https://aws.amazon.com/xray/faqs/)

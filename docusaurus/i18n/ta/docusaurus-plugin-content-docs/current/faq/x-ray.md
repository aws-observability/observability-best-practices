# AWS X-Ray - அடிக்கடி கேட்கப்படும் கேள்விகள்

## AWS Distro for Open Telemetry (ADOT) Event Bridge அல்லது SQS போன்ற AWS சேவைகள் முழுவதும் trace propagation-ஐ ஆதரிக்கிறதா?

தொழில்நுட்ப ரீதியாக, அது ADOT அல்ல, AWS X-Ray ஆகும். spans-ஐ propagate செய்யும் மற்றும்/அல்லது உருவாக்கும் AWS சேவைகளின் எண்ணிக்கையையும் வகைகளையும் விரிவாக்குவதில் நாங்கள் பணிபுரிகிறோம். இதைச் சார்ந்த ஒரு பயன்பாட்டு வழக்கு உங்களிடம் இருந்தால், எங்களை தொடர்புகொள்ளுங்கள்.

## ADOT பயன்படுத்தி AWS X-Ray-க்கு spans-ஐ உட்கொள்ள W3C trace header-ஐ பயன்படுத்த முடியுமா?

ஆம். [W3C trace header](https://aws.amazon.com/about-aws/whats-new/2023/10/aws-x-ray-w3c-format-trace-ids-distributed-tracing/) அக்டோபர் 27, 2023 அன்று வெளியிடப்பட்டது.

## SQS நடுவில் இருக்கும்போது Lambda functions முழுவதும் requests-ஐ trace செய்ய முடியுமா?

ஆம். SQS நடுவில் இருக்கும்போது Lambda functions முழுவதும் tracing-ஐ X-Ray இப்போது ஆதரிக்கிறது. upstream message producers-லிருந்து traces தானாகவே downstream Lambda consumer nodes-லிருந்து traces-உடன் [இணைக்கப்படுகின்றன](https://docs.aws.amazon.com/xray/latest/devguide/xray-services-sqs.html), பயன்பாட்டின் முழுமையான end-to-end பார்வையை உருவாக்குகின்றன.

## எனது பயன்பாட்டை instrument செய்ய X-Ray SDK அல்லது OTel SDK-ஐ பயன்படுத்த வேண்டுமா?

OTel X-Ray SDK-ஐ விட அதிக அம்சங்களை வழங்குகிறது, ஆனால் உங்கள் பயன்பாட்டு வழக்குக்கு எது சரியானது என்பதை தேர்வு செய்ய [ADOT மற்றும் X-Ray SDK இடையே தேர்வு செய்தல்](https://docs.aws.amazon.com/xray/latest/devguide/xray-instrumenting-your-app.html#xray-instrumenting-choosing) பார்க்கவும்.

## AWS X-Ray-ல் [span events](https://opentelemetry.io/docs/instrumentation/ruby/manual/#add-span-events) ஆதரிக்கப்படுகிறதா?

Span events X-Ray மாதிரியில் பொருந்தாது, எனவே அவை நிராகரிக்கப்படுகின்றன.

## AWS X-Ray-லிருந்து தரவை எவ்வாறு பிரித்தெடுப்பது?

[X-Ray APIs பயன்படுத்தி](https://docs.aws.amazon.com/xray/latest/devguide/xray-api-gettingdata.html) Service Graph, Traces மற்றும் Root cause analytics தரவை மீட்டெடுக்கலாம்.

## 100% சாம்ப்ளிங் அடைய முடியுமா? அதாவது, சாம்ப்ளிங் இல்லாமல் அனைத்து traces-ம் பதிவு செய்யப்பட வேண்டும்.

கணிசமாக அதிகரிக்கப்பட்ட அளவிலான trace தரவைப் பிடிக்க சாம்ப்ளிங் விதிகளை சரிசெய்யலாம். அனுப்பப்படும் மொத்த segments [இங்கே குறிப்பிடப்பட்ட சேவை ஒதுக்கீட்டு வரம்புகளை](https://docs.aws.amazon.com/general/latest/gr/xray.html#limits_xray) மீறாத வரை, X-Ray உள்ளமைக்கப்பட்டபடி தரவை சேகரிக்க முயற்சிக்கும். இதன் விளைவாக 100% trace தரவு பிடிப்பு கிடைக்கும் என்ற உத்தரவாதம் இல்லை.

## APIs வழியாக சாம்ப்ளிங் விதிகளை மாறும் வகையில் அதிகரிக்கவோ குறைக்கவோ முடியுமா?

ஆம், தேவைக்கேற்ப மாறும் வகையில் மாற்றங்களைச் செய்ய [X-Ray சாம்ப்ளிங் APIs](https://docs.aws.amazon.com/xray/latest/devguide/xray-api-sampling.html)-ஐ பயன்படுத்தலாம். பயன்பாட்டு வழக்கு அடிப்படையிலான விளக்கத்திற்கு இந்த [வலைப்பதிவைப் பார்க்கவும்](https://aws.amazon.com/blogs/mt/dynamically-adjusting-x-ray-sampling-rules/).

**தயாரிப்பு FAQ:** [https://aws.amazon.com/xray/faqs/](https://aws.amazon.com/xray/faqs/)

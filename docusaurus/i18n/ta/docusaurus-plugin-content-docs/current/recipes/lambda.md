# AWS Lambda

[AWS Lambda][lambda-main] என்பது சர்வர்களை வழங்காமல் அல்லது நிர்வகிக்காமல், பணிச்சுமை-விழிப்புள்ள கிளஸ்டர் அளவிடுதல் தர்க்கத்தை உருவாக்காமல், நிகழ்வு ஒருங்கிணைப்புகளை பராமரிக்காமல், அல்லது இயக்க நேரங்களை நிர்வகிக்காமல் குறியீட்டை இயக்க அனுமதிக்கும் ஒரு சர்வர்லெஸ் கம்ப்யூட் சேவையாகும்.

பின்வரும் செய்முறைகளைப் பாருங்கள்:

## லாக்குகள்

- [சர்வர்லெஸ் பயன்பாட்டை டிப்ளாய் செய்து கண்காணித்தல்][aes-ws]

## மெட்ரிக்குகள்

- [CloudWatch Lambda Insights அறிமுகம்][lambda-cwi]
- [Firehose மற்றும் AWS Lambda வழியாக Cloudwatch Metric Streams-ஐ Amazon Managed Service for Prometheus-க்கு ஏற்றுமதி செய்தல்](recipes/lambda-cw-metrics-go-amp.md)

## ட்ரேஸ்கள்

- [AWS Distro for OpenTelemetry Lambda layer மூலம் Python பயன்பாட்டை தானியங்கி-இன்ஸ்ட்ரூமென்ட் செய்தல்][lambda-layer-python-xray-adot]
- [OpenTelemetry மூலம் AWS X-Ray-இல் AWS Lambda செயல்பாடுகளை ட்ரேசிங்][lambda-xray-adot]

[lambda-main]: https://aws.amazon.com/lambda/
[aes-ws]: https://bookstore.aesworkshops.com/
[lambda-cwi]: https://aws.amazon.com/blogs/mt/introducing-cloudwatch-lambda-insights/
[lambda-xray-adot]: https://aws.amazon.com/blogs/opensource/tracing-aws-lambda-functions-in-aws-x-ray-with-opentelemetry/
[lambda-layer-python-xray-adot]: https://aws.amazon.com/blogs/opensource/auto-instrumenting-a-python-application-with-an-aws-distro-for-opentelemetry-lambda-layer/

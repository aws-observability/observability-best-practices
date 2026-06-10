# AWS App Runner

[AWS App Runner][apprunner-main] என்பது முழுமையாக நிர்வகிக்கப்படும் சேவையாகும், இது டெவலப்பர்கள் கண்டெய்னர்மயமான வலை பயன்பாடுகள் மற்றும் APIகளை அளவில் விரைவாக டிப்ளாய் செய்வதை எளிதாக்குகிறது, முன்னர் உள்கட்டமைப்பு அனுபவம் தேவையில்லை. உங்கள் மூல குறியீடு அல்லது கண்டெய்னர் படத்துடன் தொடங்கவும். App Runner தானாகவே வலை பயன்பாட்டை உருவாக்கி டிப்ளாய் செய்கிறது, மறையாக்கத்துடன் ட்ராஃபிக்கை சுமை சமன்படுத்துகிறது, உங்கள் ட்ராஃபிக் தேவைகளுக்கு ஏற்ப அளவிடுகிறது, மற்றும் உங்கள் சேவைகள் தனிப்பட்ட Amazon VPC-இல் இயங்கும் பிற AWS சேவைகள் மற்றும் பயன்பாடுகளுடன் தொடர்பு கொள்வதை எளிதாக்குகிறது. App Runner மூலம், சர்வர்கள் அல்லது அளவிடுதல் பற்றி சிந்திக்காமல், உங்கள் பயன்பாடுகளில் கவனம் செலுத்த அதிக நேரம் கிடைக்கிறது.




பின்வரும் செய்முறைகளைப் பாருங்கள்:

## பொதுவானவை
- [Container Day - Docker Con | டெவலப்பர்கள் எவ்வாறு எளிதாக அளவில் உற்பத்தி வலை பயன்பாடுகளை பெறலாம்](https://www.youtube.com/watch?v=Iyp9Ugk9oRs)
- [AWS Blog | AWS App Runner சேவைகளுக்கான மையப்படுத்தப்பட்ட observability](https://aws.amazon.com/blogs/containers/centralized-observability-for-aws-app-runner-services/)
- [AWS Blog | AWS App Runner VPC நெட்வொர்க்கிங்கிற்கான Observability](https://aws.amazon.com/blogs/containers/observability-for-aws-app-runner-vpc-networking/)
- [AWS Blog | Amazon EventBridge பயன்படுத்தி AWS App Runner பயன்பாடுகளை கட்டுப்படுத்துதல் மற்றும் கண்காணித்தல்](https://aws.amazon.com/blogs/containers/controlling-and-monitoring-aws-app-runner-applications-with-amazon-eventbridge/)


## லாக்குகள்

- [CloudWatch Logs-க்கு ஸ்ட்ரீம் செய்யப்பட்ட App Runner லாக்குகளைப் பார்த்தல்][apprunner-cwl]

## மெட்ரிக்குகள்

- [CloudWatch-க்கு அறிக்கையிடப்பட்ட App Runner சேவை மெட்ரிக்குகளைப் பார்த்தல்][apprunner-cwm]


## ட்ரேஸ்கள்
- [AWS Distro for OpenTelemetry பயன்படுத்தி App Runner-க்கான AWS X-Ray ட்ரேசிங்-உடன் தொடங்குதல்](https://aws-otel.github.io/docs/getting-started/apprunner)
- [Containers from the Couch | AWS App Runner X-Ray ஒருங்கிணைப்பு](https://youtu.be/cVr8N7enCMM)
- [AWS Blog | OpenTelemetry மூலம் AWS App Runner சேவையை AWS X-Ray பயன்படுத்தி ட்ரேசிங்](https://aws.amazon.com/blogs/containers/tracing-an-aws-app-runner-service-using-aws-x-ray-with-opentelemetry/)
- [AWS Blog | AWS Copilot CLI பயன்படுத்தி AWS App Runner சேவைக்கான AWS X-Ray ட்ரேசிங்-ஐ இயக்குதல்](https://aws.amazon.com/blogs/containers/enabling-aws-x-ray-tracing-for-aws-app-runner-service-using-aws-copilot-cli/)

[apprunner-main]: https://aws.amazon.com/apprunner/
[aes-ws]: https://bookstore.aesworkshops.com/
[apprunner-cwl]: https://docs.aws.amazon.com/apprunner/latest/dg/monitor-cwl.html
[apprunner-cwm]: https://docs.aws.amazon.com/apprunner/latest/dg/monitor-cw.html

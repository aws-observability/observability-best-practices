# CloudWatch செலவைக் குறைத்தல்

## GetMetricData

பொதுவாக `GetMetricData` என்பது 3rd party Observability கருவிகள் மற்றும்/அல்லது cloud நிதி கருவிகள் தங்கள் தளத்தில் CloudWatch Metrics-ஐ பயன்படுத்தும் அழைப்புகளால் ஏற்படுகிறது. 

- 3rd party கருவி கோரிக்கைகளை செய்யும் அதிர்வெண்ணைக் குறைக்கவும். எடுத்துக்காட்டாக, அதிர்வெண்ணை 1 நிமிடத்திலிருந்து 5 நிமிடங்களாகக் குறைப்பது செலவில் 1/5 (20%) விளைவிக்கும்.
- போக்கை அடையாளம் காண, 3rd party கருவிகளிலிருந்து எந்த தரவு சேகரிப்பையும் சிறிது நேரம் நிறுத்துவதைக் கருத்தில் கொள்ளவும்.

## CloudWatch Logs 

- இந்த [knowledge center ஆவணத்தைப்][log-article] பயன்படுத்தி முக்கிய பங்களிப்பாளர்களைக் கண்டறியவும்.
- அவசியம் என்று கருதப்படாவிட்டால், முக்கிய பங்களிப்பாளர்களின் logging நிலையைக் குறைக்கவும்.
- Cloud Watch-க்கு கூடுதலாக logging-க்கு 3rd party கருவிகளைப் பயன்படுத்துகிறீர்களா என்பதைக் கண்டறியவும்.
- ஒவ்வொரு VPC-லும் இயக்கப்பட்டிருந்தால் மற்றும் அதிக ட்ராஃபிக் இருந்தால், VPC Flow Log செலவுகள் விரைவாக அதிகரிக்கும். இன்னும் தேவைப்பட்டால், அதை Amazon S3-க்கு அனுப்புவதைக் கருத்தில் கொள்ளவும்.
- அனைத்து AWS Lambda functions-லும் logging அவசியமா என்பதைப் பாருங்கள். தேவையில்லையென்றால், Lambda role-ல் "logs:PutLogEvents" அனுமதிகளை மறுக்கவும்.
- CloudTrail logs பெரும்பாலும் முக்கிய பங்களிப்பாளராக இருக்கும். அவற்றை Amazon S3-க்கு அனுப்பி, வினவலுக்கு Amazon Athena மற்றும் அலாரங்கள்/அறிவிப்புகளுக்கு Amazon EventBridge பயன்படுத்துவது மலிவானது.

மேலும் விவரங்களுக்கு இந்த [knowledge center கட்டுரையைப்][article] பார்க்கவும்.


[article]: https://aws.amazon.com/premiumsupport/knowledge-center/cloudwatch-understand-and-reduce-charges/
[log-article]: https://aws.amazon.com/premiumsupport/knowledge-center/cloudwatch-logs-bill-increase/

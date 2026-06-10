# செயற்கை சோதனை

Amazon CloudWatch Synthetics, உண்மையான பயனர்கள் இல்லாத நிலையிலும் கூட, உங்கள் வாடிக்கையாளர் பார்வையில் அப்ளிகேஷன்களை கண்காணிக்க உங்களை அனுமதிக்கிறது. உங்கள் API-கள் மற்றும் வலைத்தள அனுபவங்களை தொடர்ந்து சோதிப்பதன் மூலம், பயனர் ட்ராஃபிக் இல்லாத போதும் ஏற்படும் இடைவிடா சிக்கல்களில் தெரிவுநிலையைப் பெறலாம்.

Canary-கள் கட்டமைக்கக்கூடிய ஸ்கிரிப்ட்கள் ஆகும், அவை உங்கள் API-கள் மற்றும் வலைத்தள அனுபவங்களை 24x7 தொடர்ந்து சோதிக்க ஒரு அட்டவணையில் இயக்கலாம். அவை உண்மையான பயனர்கள் போன்ற அதே குறியீடு பாதைகள் மற்றும் நெட்வொர்க் வழிகளைப் பின்பற்றுகின்றன, மேலும் தாமதம், பக்க ஏற்ற பிழைகள், உடைந்த அல்லது இறந்த இணைப்புகள் மற்றும் உடைந்த பயனர் வொர்க்ஃப்ளோக்கள் உட்பட எதிர்பாராத நடத்தை பற்றி உங்களுக்கு அறிவிக்கலாம்.

![CloudWatch Synthetics கட்டமைப்பு](../images/synthetics0.png)

:::note
    நீங்கள் உரிமை அல்லது அனுமதிகள் கொண்ட எண்ட்பாயிண்ட்கள் மற்றும் API-களை மட்டுமே கண்காணிக்க Synthetics canary-களைப் பயன்படுத்துவதை உறுதிசெய்யுங்கள். Canary அதிர்வெண் அமைப்புகளைப் பொறுத்து, இந்த எண்ட்பாயிண்ட்கள் அதிகரித்த ட்ராஃபிக்கை அனுபவிக்கலாம்.
:::
## தொடங்குதல்

### முழு கவரேஜ்

:::tip
    உங்கள் சோதனை உத்தியை உருவாக்கும்போது, உங்கள் Amazon VPC-க்குள் பொது மற்றும் [தனிப்பட்ட உள் எண்ட்பாயிண்ட்கள்](https://aws.amazon.com/blogs/mt/monitor-your-private-endpoints-using-cloudwatch-synthetics/) இரண்டையும் கருத்தில் கொள்ளுங்கள்.
:::
### புதிய Canary-களை பதிவு செய்தல்

[CloudWatch Synthetics Recorder](https://chrome.google.com/webstore/detail/cloudwatch-synthetics-rec/bhdnlmmgiplmbcdmkkdfplenecpegfno) Chrome உலாவி பிளகின், சிக்கலான வொர்க்ஃப்ளோக்களுடன் புதிய canary சோதனை ஸ்கிரிப்ட்களை புதிதாக விரைவாக உருவாக்க அனுமதிக்கிறது. பதிவின் போது எடுக்கப்பட்ட டைப் மற்றும் கிளிக் செயல்கள் Node.js ஸ்கிரிப்டாக மாற்றப்படுகின்றன, இதை canary உருவாக்க பயன்படுத்தலாம். CloudWatch Synthetics Recorder-ன் அறியப்பட்ட வரம்புகள் [இந்தப் பக்கத்தில்](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch_Synthetics_Canaries_Recorder.html#CloudWatch_Synthetics_Canaries_Recorder-limitations) குறிப்பிடப்பட்டுள்ளன.

### ஒருங்கிணைந்த மெட்ரிக்குகளைப் பார்த்தல்

உங்கள் canary ஸ்கிரிப்ட்கள் fleet-லிருந்து சேகரிக்கப்பட்ட ஒருங்கிணைந்த மெட்ரிக்குகளின் உடனடி ரிப்போர்ட்டிங்கைப் பயன்படுத்திக்கொள்ளுங்கள். CloudWatch Automatic Dashboard

![Synthetics-க்கான CloudWatch Dashboard](../images/synthetics1.png)

## Canary-களை உருவாக்குதல்

### Blueprints

பல canary வகைகளுக்கான அமைப்பு செயல்முறையை எளிதாக்க [canary blueprints](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch_Synthetics_Canaries_Blueprints.html) ஐ பயன்படுத்துங்கள்.

![Synthetics canary உருவாக்க பல வழிகள்](../images/synthetics2.png)

:::info
    Blueprints canary-கள் எழுத ஆரம்பிக்க வசதியான வழியாகும், எளிய பயன்பாட்டு நிலைகளை குறியீடு இல்லாமல் கவர் செய்யலாம்.
:::
### பராமரிக்கக்கூடிய தன்மை

நீங்கள் சொந்த canary-களை எழுதும்போது, அவை ஒரு *runtime version*-உடன் இணைக்கப்பட்டிருக்கும். இது Selenium உடன் Python அல்லது Puppeteer உடன் JavaScript-ன் குறிப்பிட்ட version ஆக இருக்கும். தற்போது ஆதரிக்கப்படும் runtime version-களின் பட்டியல் மற்றும் நிறுத்தப்பட்டவை பற்றி [இந்தப் பக்கத்தைப்] பார்க்கவும்.

:::info
    Canary-யின் செயல்பாட்டின் போது அணுகக்கூடிய தரவைப் பகிர [environment variables பயன்படுத்துவதன்](https://aws.amazon.com/blogs/mt/using-environment-variables-with-amazon-cloudwatch-synthetics/) மூலம் உங்கள் ஸ்கிரிப்ட்களின் பராமரிக்கக்கூடிய தன்மையை மேம்படுத்துங்கள்.
:::

:::info
    கிடைக்கும்போது உங்கள் canary-களை சமீபத்திய runtime version-க்கு மேம்படுத்துங்கள்.
:::
### String Secrets

உங்கள் canary அல்லது அதன் environment variables-க்கு வெளியே உள்ள பாதுகாப்பான அமைப்பிலிருந்து secrets-ஐ (உள்நுழைவு credentials போன்றவை) இழுக்க உங்கள் canary-களை குறியீடு செய்யலாம். AWS Lambda ஆல் அணுகக்கூடிய எந்த அமைப்பும் runtime-ல் உங்கள் canary-களுக்கு secrets வழங்கலாம்.

:::info
    AWS Secrets Manager ஐ பயன்படுத்தி database connection details, API keys மற்றும் application credentials போன்ற secrets-ஐ சேமிப்பதன் மூலம் உங்கள் சோதனைகளை இயக்கி [முக்கியமான தரவைப் பாதுகாக்கவும்](https://aws.amazon.com/blogs/mt/secure-monitoring-of-user-workflow-experience-using-amazon-cloudwatch-synthetics-and-aws-secrets-manager/).
:::
## பெரிய அளவில் Canary-களை நிர்வகித்தல்

### உடைந்த இணைப்புகளை சரிபார்க்கவும்
:::info
    உங்கள் வலைத்தளம் அதிக அளவிலான டைனமிக் உள்ளடக்கம் மற்றும் இணைப்புகளைக் கொண்டிருந்தால், உங்கள் வலைத்தளத்தை ஊர்ந்து சென்று [உடைந்த இணைப்புகளைக் கண்டறிந்து](https://aws.amazon.com/blogs/mt/cloudwatch-synthetics-to-find-broken-links-on-your-website/), தோல்வியின் காரணத்தைக் கண்டறிய CloudWatch Synthetics ஐ பயன்படுத்தலாம். பின்னர் தோல்வி வரம்பு மீறப்படும்போது CloudWatch Alarm ஐ உருவாக்க தோல்வி threshold ஐ விருப்பமாக பயன்படுத்தலாம்.
:::
### பல Heartbeat URLs

:::info
    ஒரே heartbeat monitoring canary சோதனையில் [பல URL-களைத் தொகுப்பதன்](https://aws.amazon.com/blogs/mt/simplify-your-canary-by-batching-multiple-urls-in-amazon-cloudwatch-synthetics/) மூலம் உங்கள் சோதனையை எளிதாக்கி செலவுகளை மேம்படுத்துங்கள். பின்னர் canary run report-ன் step summary-ல் ஒவ்வொரு URL-க்கான நிலை, கால அளவு, தொடர்புடைய screenshots மற்றும் தோல்வி காரணத்தைப் பார்க்கலாம்.
:::
### குழுக்களில் ஒழுங்கமைக்கவும்

:::info
    ஒருங்கிணைந்த மெட்ரிக்குகளைப் பார்க்கவும், தோல்விகளை எளிதாக தனிமைப்படுத்தி விவரமாக ஆய்வு செய்யவும் உங்கள் canary-களை [குழுக்களில்](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch_Synthetics_Groups.html) ஒழுங்கமைத்து கண்காணிக்கவும்.
:::
![குழுக்களில் canary-களை ஒழுங்கமைத்து கண்காணிக்கவும்](../images/synthetics3.png)

:::warning
    cross-region குழுவை உருவாக்கினால் குழுக்களுக்கு canary-யின் *சரியான* பெயர் தேவைப்படும் என்பதை கவனிக்கவும்.
:::
## Runtime விருப்பங்கள்

### Versions மற்றும் Support

CloudWatch Synthetics தற்போது ஸ்கிரிப்ட்களுக்கு Node.js மற்றும் [Puppeteer](https://github.com/puppeteer/puppeteer) framework பயன்படுத்தும் runtime-களையும், ஸ்கிரிப்டிங்கிற்கு Python மற்றும் [Selenium WebDriver](https://www.selenium.dev/documentation/webdriver/) framework பயன்படுத்தும் runtime-களையும் ஆதரிக்கிறது.

:::info
    சமீபத்திய அம்சங்கள் மற்றும் Synthetics லைப்ரரிக்கு செய்யப்பட்ட புதுப்பிப்புகளைப் பயன்படுத்த, உங்கள் canary-களுக்கு எப்போதும் மிக சமீபத்திய runtime version ஐ பயன்படுத்துங்கள்.
:::
CloudWatch Synthetics, அடுத்த 60 நாட்களில் [நிறுத்தப்பட திட்டமிடப்பட்ட runtime-களைப்](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch_Synthetics_Canaries_Library.html#CloudWatch_Synthetics_Canaries_runtime_support) பயன்படுத்தும் canary-கள் இருந்தால் மின்னஞ்சல் மூலம் அறிவிக்கும்.

### Code Samples

[Node.js மற்றும் Puppeteer](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch_Synthetics_Canaries_Samples.html#CloudWatch_Synthetics_Canaries_Samples_nodejspup) மற்றும் [Python மற்றும் Selenium](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch_Synthetics_Canaries_Samples.html#CloudWatch_Synthetics_Canaries_Samples_pythonsel) இரண்டிற்கும் code samples-உடன் தொடங்குங்கள்.

### Selenium-க்கான Import

ஏற்கனவே உள்ள ஸ்கிரிப்ட்களை குறைந்தபட்ச மாற்றங்களுடன் import செய்வதன் மூலம் அல்லது புதிதாக [Python மற்றும் Selenium-ல்](https://aws.amazon.com/blogs/mt/create-canaries-in-python-and-selenium-using-amazon-cloudwatch-synthetics/) canary-களை உருவாக்குங்கள்.

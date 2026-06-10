# ட்ரேஸ்கள்

ட்ரேஸ்கள் ஒரு பயன்பாட்டின் வெவ்வேறு கூறுகள் வழியாக requests கடக்கும் முழு பயணத்தை குறிக்கின்றன.

லாக்குகள் அல்லது மெட்ரிக்குகளைப் போலல்லாமல், *ட்ரேஸ்கள்* ஒன்றுக்கு மேற்பட்ட பயன்பாடு அல்லது சேவையிலிருந்து நிகழ்வுகளால் உருவாக்கப்படுகின்றன, மேலும் response latency, service faults, request parameters மற்றும் metadata போன்ற சேவைகளுக்கிடையிலான இணைப்பு பற்றிய சூழலுடன் கூடியவை.

:::tip
    [லாக்குகள்](./logs.md) மற்றும் ட்ரேஸ்களுக்கிடையே கருத்தியல் ஒற்றுமை உள்ளது, இருப்பினும் ஒரு trace cross-service சூழலில் கருதப்பட வேண்டும், அதேசமயம் லாக்குகள் பொதுவாக ஒற்றை சேவை அல்லது பயன்பாட்டின் செயல்பாட்டிற்கு மட்டுமே வரையறுக்கப்பட்டவை.
::::::tip
இன்றைய developers modular மற்றும் distributed பயன்பாடுகளை உருவாக்கும் போக்கில் சாய்கின்றனர். சிலர் இவற்றை [Service Oriented Architecture](https://en.wikipedia.org/wiki/Service-oriented_architecture) என்றும், மற்றவர்கள் [microservices](https://aws.amazon.com/microservices/) என்றும் குறிப்பிடுவார்கள். பெயரைப் பொருட்படுத்தாமல், இந்த loosely coupled பயன்பாடுகளில் ஏதேனும் தவறு நேரும்போது, ஒரு சம்பவத்தின் மூல காரணத்தைக் கண்டறிய லாக்குகள் அல்லது நிகழ்வுகளை மட்டும் பார்ப்பது போதுமானதாக இருக்காது. Request flow-வில் முழு visibility இருப்பது இன்றியமையாதது, இங்குதான் ட்ரேஸ்கள் மதிப்பைச் சேர்க்கின்றன. end-to-end request flow-ஐ சித்தரிக்கும் காரணமாக தொடர்புடைய நிகழ்வுகளின் தொடர் மூலம், ட்ரேஸ்கள் அந்த visibility-ஐ பெற உதவுகின்றன.

ட்ரேஸ்கள் observability-ன் இன்றியமைய தூணாகும், ஏனெனில் அவை request அமைப்பிற்கு வந்து வெளியேறும்போது flow பற்றிய அடிப்படை தகவலை வழங்குகின்றன.

:::tip
    ட்ரேஸ்களின் பொதுவான பயன்பாட்டு வழக்குகளில் performance profiling, production issues debugging மற்றும் failures-ன் root cause analysis ஆகியவை அடங்கும்.
:::
## உங்கள் அனைத்து integration points-ஐயும் instrument செய்யுங்கள்

உங்கள் அனைத்து workload functionality மற்றும் code ஒரே இடத்தில் இருக்கும்போது, ஒரு request வெவ்வேறு functions முழுவதும் எவ்வாறு அனுப்பப்படுகிறது என்பதை source code-ஐ பார்ப்பது எளிது. system level-ல் app எந்த machine-ல் இயங்குகிறது என்பது தெரியும், ஏதேனும் தவறு நேர்ந்தால் மூல காரணத்தை விரைவாகக் கண்டறியலாம். வெவ்வேறு கூறுகள் loosely coupled ஆகவும் distributed environment-ல் இயங்கும் microservices-based architecture-ல் அதைச் செய்வதை கற்பனை செய்யுங்கள். ஒவ்வொரு interconnected request-லிருந்தும் அவற்றின் லாக்களைப் பார்க்க எண்ணற்ற systems-ல் login செய்வது நடைமுறையற்றதாக, சாத்தியமற்றதாகவும் இருக்கும்.

இங்குதான் observability உதவ முடியும். Instrumentation என்பது அந்த observability-ஐ அதிகரிப்பதற்கான முக்கிய படியாகும். பரந்த அர்த்தத்தில் Instrumentation என்பது code பயன்படுத்தி உங்கள் பயன்பாட்டில் நிகழ்வுகளை அளவிடுவது.

ஒரு பொதுவான instrumentation அணுகுமுறை, system-க்கு நுழையும் ஒவ்வொரு request-க்கும் ஒரு தனித்துவமான trace identifier-ஐ ஒதுக்கி, அது வெவ்வேறு கூறுகள் வழியாக செல்லும்போது அந்த trace id-ஐ எடுத்துச் செல்வதும் கூடுதல் metadata சேர்ப்பதும் ஆகும்.

:::info
    ஒரு சேவையிலிருந்து மற்றொன்றுக்கான ஒவ்வொரு connection-ம் ஒரு மைய collector-க்கு traces-ஐ உமிழ instrument செய்யப்பட வேண்டும். இந்த அணுகுமுறை உங்கள் workload-ன் opaque அம்சங்களை பார்க்க உதவுகிறது.
:::
:::info
    உங்கள் பயன்பாட்டை instrument செய்வது auto-instrumentation agent அல்லது library பயன்படுத்தும்போது பெரிய அளவில் automated செயல்முறையாக இருக்கலாம்.
:::

## Transaction நேரம் மற்றும் நிலை முக்கியம், எனவே அதை அளவிடுங்கள்!

நன்கு instrumented பயன்பாடு end to end trace-ஐ உருவாக்க முடியும், இது இது போன்ற waterfall graph ஆக பார்க்கலாம்:

![WaterFall Trace](../images/waterfall-trace.png)

அல்லது ஒரு service map:

![servicemap Trace](../images/service-map-trace.png)

ஒவ்வொரு interaction-க்கும் transaction times மற்றும் response codes-ஐ அளவிடுவது முக்கியம். இது ஒட்டுமொத்த processing times-ஐ கணக்கிடவும், உங்கள் SLAs, SLOs அல்லது business KPIs-உடன் இணக்கத்தை track செய்யவும் உதவும்.

:::info
    உங்கள் interactions-ன் response times மற்றும் status codes-ஐ புரிந்துகொண்டு பதிவு செய்வதன் மூலமே ஒட்டுமொத்த request patterns மற்றும் workload health-க்கு பங்களிக்கும் காரணிகளை பார்க்க முடியும்.
:::
## Metadata, annotations மற்றும் labels உங்கள் சிறந்த நண்பர்கள்

Traces persist செய்யப்பட்டு ஒரு தனித்துவமான ID ஒதுக்கப்படுகிறது, ஒவ்வொரு trace-ம் request-ன் பாதையில் ஒவ்வொரு படியையும் பதிவு செய்யும் *spans* அல்லது *segments* (உங்கள் tooling-ஐ பொறுத்தது) ஆக பிரிக்கப்படுகிறது. ஒரு span trace interact செய்யும் entities-ஐ குறிக்கிறது, மேலும் parent trace போல, ஒவ்வொரு span-க்கும் ஒரு தனித்துவமான ID மற்றும் time stamp ஒதுக்கப்பட்டு கூடுதல் தரவு மற்றும் metadata-வையும் உள்ளடக்கலாம். இந்த தகவல் debugging-க்கு பயனுள்ளது ஏனெனில் சிக்கல் ஏற்பட்ட சரியான நேரத்தையும் இடத்தையும் தருகிறது.

இதை ஒரு நடைமுறை உதாரணத்தின் மூலம் சிறப்பாக விளக்கலாம். ஒரு e-commerce பயன்பாடு பல domains-ஆக பிரிக்கப்படலாம்: authentication, authorization, shipping, inventory, payment processing, fulfillment, product search, recommendations, மற்றும் பல. இந்த interconnected domains அனைத்திலிருந்தும் traces-ஐ தேடுவதற்கு பதிலாக, உங்கள் trace-ஐ customer ID-யுடன் label செய்வது இந்த ஒரு நபருக்கு மட்டும் குறிப்பிட்ட interactions-ஐ தேட உங்களை அனுமதிக்கிறது. இது operational issue-ஐ diagnose செய்யும்போது உங்கள் தேடலை உடனடியாக குறுக்க உதவுகிறது.

:::info
    naming convention vendors இடையே மாறுபடலாம் என்றாலும், ஒவ்வொரு trace-ம் metadata, labels அல்லது annotations-உடன் augment செய்யப்படலாம், இவை உங்கள் முழு workload முழுவதும் searchable ஆகும். அவற்றைச் சேர்ப்பதற்கு உங்கள் தரப்பில் code தேவை, ஆனால் உங்கள் workload-ன் observability-ஐ பெரிதும் அதிகரிக்கிறது.
:::
:::warning
    Traces லாக்குகள் அல்ல, எனவே உங்கள் traces-ல் என்ன metadata சேர்க்கிறீர்கள் என்பதில் சிக்கனமாக இருங்கள். மேலும் trace தரவு forensics மற்றும் auditing-க்கு நோக்கமானது அல்ல, உயர் sample rate-உடன் கூட.
:::

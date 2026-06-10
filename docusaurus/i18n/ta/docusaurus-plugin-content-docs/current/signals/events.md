# நிகழ்வுகள்

## நிகழ்வுகள் என்றால் நாம் என்ன பொருள்கொள்கிறோம்?
இன்று பல architectures event driven ஆக உள்ளன. Event driven architectures-ல், நிகழ்வுகள் என்பது வெவ்வேறு systems-லிருந்து signals ஆகும், அவற்றை நாம் பிடித்து பிற systems-க்கு அனுப்புகிறோம். ஒரு நிகழ்வு பொதுவாக நிலை மாற்றம் அல்லது ஒரு update ஆகும்.

எடுத்துக்காட்டாக, ஒரு eCommerce system-ல் ஒரு item cart-க்கு சேர்க்கப்படும்போது ஒரு நிகழ்வு இருக்கலாம். இந்த நிகழ்வு பிடிக்கப்பட்டு item details-உடன் cart-ல் உள்ள items-ன் எண்ணிக்கை மற்றும் செலவை update செய்ய shopping cart பகுதிக்கு அனுப்பப்படலாம்.

:::info
	சில வாடிக்கையாளர்களுக்கு ஒரு நிகழ்வு ஒரு *milestone* ஆக இருக்கலாம், ஒரு purchase நிறைவு போல. ஒரு workflow முடிவின் aggregate தருணத்தை ஒரு நிகழ்வாக கருதுவதற்கு ஒரு வாதம் உள்ளது, ஆனால் எங்கள் நோக்கங்களுக்காக ஒரு milestone-ஐ அதுவே ஒரு நிகழ்வாக நாங்கள் கருதுவதில்லை.
:::
## நிகழ்வுகள் ஏன் பயனுள்ளவை?
உங்கள் Observability தீர்வில் நிகழ்வுகள் பயனுள்ளதாக இருக்கக்கூடிய இரண்டு முக்கிய வழிகள் உள்ளன. ஒன்று பிற தரவுகளின் சூழலில் நிகழ்வுகளை காட்சிப்படுத்துவது, மற்றொன்று ஒரு நிகழ்வின் அடிப்படையில் நடவடிக்கை எடுக்க உதவுவது.

:::info
	நிகழ்வுகள் உங்கள் workload-ல் உள்ள மாற்றங்கள் மற்றும் செயல்கள் பற்றிய மதிப்புள்ள தகவலை மக்கள் அல்லது machines-க்கு வழங்குவதை நோக்கமாகக் கொண்டவை.
:::

## நிகழ்வுகளை காட்சிப்படுத்துதல்
உங்கள் application-லிருந்து நேரடியாக வராத பல event signals இருக்கின்றன, ஆனால் உங்கள் application performance-ல் தாக்கத்தை ஏற்படுத்தலாம் அல்லது root cause-க்கு கூடுதல் insight வழங்கலாம். உங்கள் நிகழ்வுகளை காட்சிப்படுத்துவதற்கான மிகவும் பொதுவான வழிமுறை Dashboards ஆகும், சில analytics அல்லது business intelligence கருவிகளும் இந்த சூழலில் வேலை செய்யும். email அல்லது instant messaging applications கூட காட்சிப்படுத்தல்களை எளிதாக பெற முடியும்.


உங்கள் web front end-ல் ஒரு order place செய்ய எடுக்கும் நேரம் போன்ற application performance-ன் timechart-ஐ கருத்தில் கொள்ளுங்கள். Time chart சில நாட்களுக்கு முன்பு response time-ல் ஒரு step change இருந்ததை பார்க்க அனுமதிக்கிறது. சமீபத்திய deployments ஏதேனும் இருந்ததா என்பதை அறிவது பயனுள்ளதாக இருக்கலாம். சமீபத்திய deployments-ன் timechart-ஐ அதே chart-ல் superimposed ஆக பார்க்க முடிந்தால் கருத்தில் கொள்ளுங்கள்?

![நிகழ்வுகளை காட்சிப்படுத்துதல்](images/visualizing_events.png)

:::tip
	உங்களுக்கு பரந்த சூழலை புரிந்துகொள்ள எந்த நிகழ்வுகள் பயனுள்ளதாக இருக்கும் என்பதை கருத்தில் கொள்ளுங்கள். உங்களுக்கு முக்கியமான நிகழ்வுகள் code deployments, infrastructure change events, புதிய தரவை சேர்ப்பது (புதிய items விற்பனைக்கு வெளியிடுவது அல்லது புதிய users-ஐ bulk ஆக சேர்ப்பது போல), அல்லது functionality-ஐ மாற்றுவது அல்லது சேர்ப்பது (மக்கள் items-ஐ cart-க்கு சேர்க்கும் வழியை மாற்றுவது போல) ஆக இருக்கலாம்.
:::

:::info
	நிகழ்வுகளை [correlate](./metrics.md#correlate-with-operational-metric-data) செய்ய பிற முக்கியமான metric data-வுடன் நிகழ்வுகளை காட்சிப்படுத்துங்கள்.
:::

## நிகழ்வுகளின் அடிப்படையில் நடவடிக்கை எடுத்தல்
Observability உலகில், trigger செய்யப்பட்ட alarm ஒரு பொதுவான நிகழ்வு. இந்த நிகழ்வு alarm-க்கான identifier, alarm state (`IN ALARM` அல்லது `OK` போன்றவை), மற்றும் இதை trigger செய்தது என்ன என்ற விவரங்களை கொண்டிருக்கும். பல சந்தர்ப்பங்களில் இந்த alarm event கண்டறியப்பட்டு email notification அனுப்பப்படும். இது ஒரு alarm-ன் action-க்கு ஒரு உதாரணம்.

Alarm notification observability-ல் முக்கியமானது. சரியான நபர்களுக்கு சிக்கல் இருப்பதை இவ்வாறு தெரிவிக்கிறோம். இருப்பினும், உங்கள் observability தீர்வில் நிகழ்வுகளின் மீதான action முதிர்ச்சியடையும்போது, மனித தலையீடு இல்லாமல் சிக்கலை தானாகவே சரிசெய்ய முடியும்.


### ஆனால் என்ன நடவடிக்கை எடுக்க வேண்டும்?
கண்டறியப்பட்ட சிக்கலை எந்த action எளிதாக்கும் என்பதை முதலில் புரிந்துகொள்ளாமல் action-ஐ automate செய்ய முடியாது. உங்கள் Observability பயணத்தின் தொடக்கத்தில், இது அடிக்கடி தெளிவாக இருக்காது. இருப்பினும், சிக்கல்களை சரிசெய்வதில் அதிக அனுபவம் பெற்றால், அறியப்பட்ட action உள்ள இடங்களைப் பிடிக்க உங்கள் alarms-ஐ fine tune செய்யலாம். உங்களிடம் உள்ள alarm service-ல் built-in actions இருக்கலாம், அல்லது alarm event-ஐ நீங்களே பிடித்து resolution-ஐ script செய்ய வேண்டியிருக்கலாம்.

:::info
	Auto-scaling systems, [horizontal pod autoscaling](https://kubernetes.io/docs/tasks/run-application/horizontal-pod-autoscale/) போன்றவை இந்த principle-ன் ஒரு implementation மட்டுமே. Kubernetes இந்த automation-ஐ உங்களுக்காக abstract செய்கிறது.
:::
Alarm frequency மற்றும் resolution பற்றிய data-வை அணுகுவது automation-க்கு சாத்தியம் உள்ளதா என்பதை தீர்மானிக்க உதவும். Issue symptoms அடிப்படையிலான பரந்த scope alarms சிக்கல்களைப் பிடிப்பதில் சிறப்பாக இருக்கும் என்றாலும், auto remediation-உடன் இணைக்க மிகவும் specific criteria தேவைப்படலாம்.

இதைச் செய்யும்போது, உங்கள் incident management/ticketing/ITSM tool-உடன் integrate செய்வதை கருத்தில் கொள்ளுங்கள். பல நிறுவனங்கள் incidents மற்றும் அதனுடன் தொடர்புடைய resolutions மற்றும் Mean Time to Resolve (MTTR) போன்ற metrics-ஐ track செய்கின்றன. நீங்கள் இதைச் செய்தால், உங்கள் *automated* resolutions-ஐயும் இதேபோன்ற முறையில் capture செய்வதை கருத்தில் கொள்ளுங்கள். இது automatically remediate செய்யப்படும் issues-ன் வகை மற்றும் விகிதத்தை புரிந்துகொள்ள உதவுகிறது, ஆனால் underlying patterns மற்றும் issues-ஐ தேட அனுமதிக்கிறது.

:::tip
	யாரோ ஒருவர் manually ஒரு issue-ஐ fix செய்ய வேண்டியிருக்கவில்லை என்பதற்காக, underlying cause-ஐ நீங்கள் பார்க்கக்கூடாது என்று அர்த்தமில்லை.
:::
எடுத்துக்காட்டாக, ஒரு server unresponsive ஆகும் ஒவ்வொரு முறையும் restart செய்வதை கருத்தில் கொள்ளுங்கள். Restart system தொடர்ந்து செயல்பட அனுமதிக்கிறது, ஆனால் unresponsiveness-ஐ ஏற்படுத்துவது என்ன. இது எவ்வளவு அடிக்கடி நடக்கிறது, ஒரு pattern உள்ளதா (எடுத்துக்காட்டாக report generation, high users அல்லது system backups-உடன் பொருந்துவது), root cause-ஐ புரிந்துகொண்டு fix செய்ய நீங்கள் போடும் priority மற்றும் resources-ஐ தீர்மானிக்கும்.
:::info
	உங்கள் [key performance indicators](./metrics.md#know-your-key-performance-indicatorskpis-and-measure-them)-உடன் தொடர்புடைய *ஒவ்வொரு* நிகழ்வையும் consumption-க்கு ஒரு message bus-க்கு deliver செய்வதை கருத்தில் கொள்ளுங்கள். சில observability தீர்வுகள் வெளிப்படையான configuration requirements இல்லாமல் இதை transparently செய்கின்றன.
:::
## உங்கள் நிகழ்வுகளை உங்கள் Observability platform-க்கு கொண்டு வருதல்
உங்களுக்கு முக்கியமான நிகழ்வுகளை கண்டறிந்த பிறகு, அவற்றை உங்கள் Observability platform-க்கு எவ்வாறு சிறப்பாக கொண்டு வருவது என்பதை கருத்தில் கொள்ள வேண்டும்.
உங்கள் platform நிகழ்வுகளை capture செய்ய ஒரு குறிப்பிட்ட வழி கொண்டிருக்கலாம், அல்லது நீங்கள் அவற்றை logs அல்லது metric data-ஆக கொண்டு வர வேண்டியிருக்கலாம்.

:::note
	தகவலை உள்ளே கொண்டு வர ஒரு எளிய வழி நிகழ்வுகளை ஒரு log file-ல் எழுதி, உங்கள் பிற log events-ஐ உட்கொள்வது போலவே உட்கொள்வது.
:::

உங்கள் system இவற்றை எவ்வாறு காட்சிப்படுத்த அனுமதிக்கும் என்பதை ஆராயுங்கள். உங்கள் application-உடன் தொடர்புடைய நிகழ்வுகளை கண்டறிய முடியுமா? தரவை ஒற்றை chart-ல் இணைக்க முடியுமா? குறிப்பிட்ட ஒன்று இல்லை என்றாலும், visually correlate செய்ய உங்கள் பிற data-வுடன் ஒரு timechart-ஐ உருவாக்க குறைந்தபட்சம் முடிய வேண்டும். Time axis-ஐ ஒரே மாதிரியாக வைத்து, எளிதான ஒப்பீட்டிற்காக இவற்றை vertically stacking செய்வதை கருத்தில் கொள்ளுங்கள்.

![Stacked charts-ஆக நிகழ்வுகளை காட்சிப்படுத்துதல்](images/visualizing_events_stacked.png)

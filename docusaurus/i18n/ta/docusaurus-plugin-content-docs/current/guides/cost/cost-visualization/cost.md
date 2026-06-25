# AWS Observability சேவைகள் மற்றும் செலவு

உங்கள் Observability ஸ்டாக்கில் முதலீடு செய்யும்போது, உங்கள் observability தயாரிப்புகளின் **செலவை** தொடர்ந்து கண்காணிப்பது முக்கியம். இது உங்களுக்கு தேவையான செலவுகளை மட்டுமே செலுத்துவதையும், தேவையில்லாத வளங்களுக்கு அதிகமாக செலவிடாமல் இருப்பதையும் உறுதிசெய்ய உதவுகிறது.

## செலவு மேம்படுத்தலுக்கான AWS கருவிகள்

பெரும்பாலான நிறுவனங்களின் முக்கிய கவனம் கிளவுடில் தங்கள் IT உள்கட்டமைப்பை விரிவாக்குவதில் உள்ளது, மேலும் அவை பொதுவாக தங்கள் உண்மையான அல்லது வரவிருக்கும் கிளவுட் செலவைப் பற்றி கட்டுப்பாடற்றவை, தயாரிப்பில்லாதவை மற்றும் அறியாதவை. காலப்போக்கில் செலவுகளை கண்காணிக்க, அறிக்கையிட மற்றும் பகுப்பாய்வு செய்ய உதவ, AWS பல செலவு-மேம்படுத்தல் கருவிகளை வழங்குகிறது:

[AWS Cost Explorer][cost-explorer] – காலப்போக்கில் AWS செலவு முறைகளைக் காணலாம், எதிர்கால செலவுகளை கணிக்கலாம், மேலும் விசாரணை தேவைப்படும் பகுதிகளை அடையாளம் காணலாம், Reserved Instance பயன்பாட்டை கவனிக்கலாம், Reserved Instance கவரேஜைக் காணலாம், மற்றும் Reserved Instance பரிந்துரைகளைப் பெறலாம்.

[AWS Cost and Usage Report(CUR)][CUR] – கணக்குகள் முழுவதும் உங்கள் மணி நேர AWS பயன்பாட்டை விவரிக்கும் நுணுக்கமான மூல தரவு கோப்புகள், Do-It-Yourself (DIY) பகுப்பாய்வுக்கு பயன்படுத்தப்படுகின்றன. AWS Cost and Usage Report நீங்கள் பயன்படுத்தும் சேவைகளைப் பொறுத்து நிரப்பப்படும் மாறும் நெடுவரிசைகளைக் கொண்டுள்ளது.

## கட்டமைப்பு மேலோட்டம்: AWS Cost and Usage Report-ஐ காட்சிப்படுத்துதல்

Amazon Managed Grafana அல்லது Amazon QuickSight-ல் AWS செலவு மற்றும் பயன்பாடு டாஷ்போர்டுகளை உருவாக்கலாம். பின்வரும் கட்டமைப்பு வரைபடம் இரண்டு தீர்வுகளையும் விளக்குகிறது.

![கட்டமைப்பு வரைபடம்](../../../images/cur-architecture.png)
*கட்டமைப்பு வரைபடம்*

## Cloud Intelligence டாஷ்போர்டுகள்

[Cloud Intelligence டாஷ்போர்டுகள்][cid] என்பது AWS Cost and Usage report (CUR) மீது கட்டமைக்கப்பட்ட [Amazon QuickSight][quicksight] டாஷ்போர்டுகளின் தொகுப்பாகும். இந்த டாஷ்போர்டுகள் உங்கள் சொந்த செலவு மேலாண்மை மற்றும் மேம்படுத்தல் (FinOps) கருவியாக செயல்படுகின்றன. உங்கள் AWS பயன்பாடு மற்றும் செலவுகளின் விரிவான பார்வையைப் பெற உதவும் ஆழமான, நுணுக்கமான மற்றும் பரிந்துரை-சார்ந்த டாஷ்போர்டுகளைப் பெறுவீர்கள்.

### செயல்படுத்தல்

1.	[Amazon Athena][amazon-athnea] ஒருங்கிணைப்பு இயக்கப்பட்ட [CUR அறிக்கையை][cur-report] உருவாக்கவும்.  
*ஆரம்ப கட்டமைப்பின் போது, AWS உங்கள் Amazon S3 பக்கெட்டுக்கு அறிக்கைகளை வழங்கத் தொடங்க 24 மணி நேரம் வரை ஆகலாம். அறிக்கைகள் நாளுக்கு ஒருமுறை வழங்கப்படும். Athena ஒருங்கிணைப்புடன் உங்கள் Cost and Usage Reports-ஐ ஒருங்கிணைப்பதை எளிதாக்க மற்றும் தானியங்காக்க, AWS நீங்கள் Athena ஒருங்கிணைப்புக்காக அமைக்கும் அறிக்கைகளுடன் பல முக்கிய வளங்களைக் கொண்ட AWS CloudFormation டெம்ப்ளேட்டை வழங்குகிறது.*

2.	[AWS CloudFormation டெம்ப்ளேட்டை][cloudformation] டிப்ளாய் செய்யவும்.  
*இந்த டெம்ப்ளேட் AWS Glue crawler, AWS Glue database மற்றும் AWS Lambda event ஆகியவற்றை உள்ளடக்கியது. இந்த கட்டத்தில், CUR தரவு Amazon Athena-ல் உள்ள அட்டவணைகள் வழியாக கிடைக்கும்.*  

    - உங்கள் CUR தரவு மீது நேரடியாக [Amazon Athena][athena-query] வினவல்களை இயக்கவும்.  
*உங்கள் தரவு மீது Athena வினவல்களை இயக்க, முதலில் AWS உங்கள் தரவைப் புதுப்பிக்கிறதா என்பதை Athena கன்சோலைப் பயன்படுத்தி சரிபார்க்கவும், பின்னர் Athena கன்சோலில் உங்கள் வினவலை இயக்கவும்.*

3.	Cloud Intelligence டாஷ்போர்டுகளை டிப்ளாய் செய்யவும்.
    - கைமுறை டிப்ளாய்மென்ட்டுக்கு, AWS Well-Architected **[Cost Optimization lab][cost-optimization-lab]**-ஐ பார்க்கவும். 
    - தானியங்கு டிப்ளாய்மென்ட்டுக்கு, [GitHub repo][GitHub-repo]-ஐ பார்க்கவும்.

Cloud Intelligence டாஷ்போர்டுகள் நிதி குழுக்கள், நிர்வாகிகள் மற்றும் IT மேலாளர்களுக்கு சிறந்தவை. இருப்பினும், வாடிக்கையாளர்களிடமிருந்து நாங்கள் அடிக்கடி பெறும் ஒரு பொதுவான கேள்வி என்னவென்றால், Amazon CloudWatch, AWS X-Ray, Amazon Managed Service for Prometheus மற்றும் Amazon Managed Grafana போன்ற தனிப்பட்ட AWS Observability தயாரிப்புகளின் நிறுவன அளவிலான செலவை எவ்வாறு அறிந்துகொள்வது என்பதுதான்.  

அடுத்த பிரிவில், அந்தத் தயாரிப்புகள் ஒவ்வொன்றின் செலவு மற்றும் பயன்பாட்டை ஆழமாக ஆராய்வீர்கள். எந்த அளவிலான நிறுவனங்களும் கிளவுட் செலவு மேம்படுத்தல் உத்தியில் இந்த செயலூக்கமான அணுகுமுறையை ஏற்றுக்கொள்ளலாம், மேலும் செயல்திறன் தாக்கம் அல்லது செயல்பாட்டு மேல்சுமை இல்லாமல் கிளவுட் செலவு பகுப்பாய்வு மற்றும் தரவு-சார்ந்த முடிவுகள் மூலம் வணிக செயல்திறனை மேம்படுத்தலாம்.


[cost-explorer]: https://docs.aws.amazon.com/awsaccountbilling/latest/aboutv2/ce-what-is.html
[CUR]: https://docs.aws.amazon.com/cur/latest/userguide/what-is-cur.html
[cid]: https://wellarchitectedlabs.com/cost/200_labs/200_cloud_intelligence/
[quicksight]: https://aws.amazon.com/quicksight/
[cur-report]: https://docs.aws.amazon.com/cur/latest/userguide/cur-create.html
[amazon-athnea]: https://aws.amazon.com/athena/
[cloudformation]: https://docs.aws.amazon.com/cur/latest/userguide/use-athena-cf.html
[athena-query]: https://docs.aws.amazon.com/cur/latest/userguide/cur-ate-run.html
[cost-optimization-lab]: https://www.wellarchitectedlabs.com/cost/200_labs/200_cloud_intelligence/
[GitHub-repo]: https://github.com/aws-samples/aws-cudos-framework-deployment

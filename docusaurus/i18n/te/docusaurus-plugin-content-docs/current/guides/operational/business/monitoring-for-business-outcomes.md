# మీరు observability ఎందుకు చేయాలి?

YouTube లో [Developing an Observability Strategy](https://www.youtube.com/watch?v=Ub3ATriFapQ) చూడండి

## నిజంగా ఏది ముఖ్యం?

మీరు పనిలో చేసే ప్రతిదీ మీ సంస్థ యొక్క mission కి align అవ్వాలి. ఉద్యోగం చేస్తున్న మనమందరం మన సంస్థ యొక్క mission ను నెరవేర్చడానికి మరియు దాని vision వైపు పని చేస్తాం. Amazon లో, మా mission ఇలా చెబుతుంది:

> Amazon strives to be Earth's most customer-centric company, Earth's best employer, and Earth's safest place to work.

— [About Amazon](https://www.aboutamazon.com/about-us)

IT లో, ప్రతి project, deployment, security measure లేదా optimization business outcome వైపు పని చేయాలి. ఇది స్పష్టంగా కనిపిస్తుంది, కానీ business కి value add చేయని ఏదీ మీరు చేయకూడదు. ITIL చెప్పినట్లు:

> Every change should deliver business value.

— ITIL Service Transition, AXELOS, 2011, page 44.  
— [Change Management in the Cloud AWS Whitepaper](https://docs.aws.amazon.com/whitepapers/latest/change-management-in-the-cloud/change-management-in-the-cloud.html) చూడండి

Mission మరియు business value ముఖ్యమైనవి ఎందుకంటే అవి మీరు చేసే ప్రతిదానికి దిశానిర్దేశం చేయాలి. Observability కి అనేక ప్రయోజనాలు ఉన్నాయి, వీటిలో:

- మెరుగైన availability
- అధిక reliability
- Application health మరియు performance అవగాహన
- మెరుగైన collaboration
- సమస్యల proactive detection
- Customer satisfaction పెరుగుదల
- Time to market తగ్గింపు
- Operational costs తగ్గింపు
- Automation

ఈ ప్రయోజనాలన్నింటికీ ఒక ఉమ్మడి విషయం ఉంది, అవన్నీ business value ను deliver చేస్తాయి, నేరుగా customer కు లేదా పరోక్షంగా సంస్థకు. Observability గురించి ఆలోచించేటప్పుడు, మీ application business value deliver చేస్తుందా లేదా అనే దాని గురించి ఆలోచించడానికి ప్రతిదీ తిరిగి రావాలి.

దీని అర్థం observability business value deliver చేయడంలో contribute చేసే వాటిని measure చేయాలి, business outcomes పై focus చేయాలి మరియు అవి risk లో ఉన్నప్పుడు: మీ customers ఏమి కోరుకుంటారో మరియు వారికి ఏమి అవసరమో ఆలోచించాలి.

## నేను ఎక్కడ మొదలు పెట్టాలి?

ఏది ముఖ్యమో ఇప్పుడు మీకు తెలుసు, మీరు ఏమి measure చేయాలో ఆలోచించాలి. Amazon లో, మేము customer నుండి మొదలు పెట్టి వారి needs నుండి backwards పని చేస్తాం:

> We are internally driven to improve our services, adding benefits and features, before we have to. We lower prices and increase value for customers before we have to. We invent before we have to.

— Jeff Bezos, [2012 Shareholder Letter](https://s2.q4cdn.com/299287126/files/doc_financials/annual/2012-Shareholder-Letter.pdf)

ఒక సాధారణ ఉదాహరణ తీసుకుందాం, e-commerce site ఉపయోగించి. మొదట, మీరు online లో products కొనుగోలు చేసేటప్పుడు customer గా ఏమి కోరుకుంటారో ఆలోచించండి, ఇది ప్రతి ఒక్కరికీ ఒకేలా ఉండకపోవచ్చు, కానీ మీరు బహుశా ఈ విషయాల గురించి care చేస్తారు:

- Delivery
- Price
- Security
- Page Speed
- Search (మీరు వెతుకుతున్న product దొరుకుతుందా?)

మీ customers ఏమి care చేస్తారో తెలిసిన తర్వాత, మీరు వాటిని measure చేయడం మొదలు పెట్టవచ్చు మరియు అవి మీ business outcomes ను ఎలా ప్రభావితం చేస్తాయో తెలుసుకోవచ్చు. Page speed నేరుగా మీ conversion rate మరియు search engine ranking ను ప్రభావితం చేస్తుంది. 2017 study ప్రకారం సగానికి పైగా (53%) mobile users page load అవడానికి 3 seconds కంటే ఎక్కువ సమయం పడితే page ను abandon చేస్తారు. Page speed యొక్క ప్రాముఖ్యతను చూపించే అనేక studies ఉన్నాయి, మరియు ఇది measure చేయడానికి obvious metric, కానీ మీరు దానిని measure చేసి action తీసుకోవాలి ఎందుకంటే ఇది conversion పై measurable impact కలిగి ఉంటుంది మరియు మీరు ఆ data ను improvements చేయడానికి ఉపయోగించవచ్చు.

## Backwards పని చేయడం

మీ customers ఏమి care చేస్తారో అన్నీ మీకు తెలియాలని ఆశించలేము. మీరు ఇది చదువుతుంటే, మీరు బహుశా technical role లో ఉన్నారు. మీరు మీ organisation లోని stakeholders తో మాట్లాడాలి, ఇది ఎల్లప్పుడూ సులభం కాదు, కానీ మీరు ఏది ముఖ్యమో measure చేస్తున్నారని నిర్ధారించడానికి ఇది అత్యవసరం.

e-commerce ఉదాహరణతో కొనసాగిద్దాం. ఈసారి, search ను పరిగణించండి: customers product కొనుగోలు చేయడానికి search చేయగలగాలి అనేది obvious గా ఉండవచ్చు, కానీ [Forrester Research report](https://www.forrester.com/report/MustHave+eCommerce+Features/-/E-RES89561) ప్రకారం, 43% visitors వెంటనే search box కు navigate అవుతారు మరియు searches non-searchers తో పోల్చితే 2-3 రెట్లు ఎక్కువగా convert అవుతాయని మీకు తెలుసా. Search నిజంగా ముఖ్యమైనది, ఇది బాగా పని చేయాలి మరియు మీరు దానిని monitor చేయాలి - బహుశా మీరు నిర్దిష్ట searches ఏ results ఇవ్వడం లేదని కనుగొంటారు మరియు naive pattern matching నుండి natural language processing కు మారాలి. ఇది business outcome కోసం monitoring చేసి customer experience ను మెరుగుపరచడానికి action తీసుకోవడానికి ఒక ఉదాహరణ.

Amazon లో:

> We strive to deeply understand customers and work backwards from their pain points to rapidly develop innovations that create meaningful solutions in their lives.

— Daniel Slater - Worldwide Lead, Culture of Innovation, AWS in [Elements of Amazon's Day 1 Culture](https://aws.amazon.com/executive-insights/content/how-amazon-defines-and-operationalizes-a-day-1-culture/)

మేము customer నుండి మొదలు పెట్టి వారి needs నుండి backwards పని చేస్తాం. Business లో success కు ఇది ఏకైక approach కాదు, కానీ observability కి ఇది మంచి approach. మీ customers కి ఏది ముఖ్యమో అర్థం చేసుకోవడానికి stakeholders తో పని చేయండి మరియు అక్కడ నుండి backwards పని చేయండి.

అదనపు ప్రయోజనంగా, మీ customers మరియు stakeholders కు ముఖ్యమైన metrics collect చేస్తే, మీరు వాటిని near real-time dashboards లో visualize చేయవచ్చు మరియు reports సృష్టించడం లేదా "landing page load అవడానికి ఎంత సమయం పడుతోంది?" లేదా "website run చేయడానికి ఎంత ఖర్చవుతోంది?" వంటి ప్రశ్నలకు answer ఇవ్వడం avoid చేయవచ్చు - stakeholders మరియు executives ఈ information ను self serve చేయగలగాలి.

ఇవి మీ application కోసం నిజంగా **ముఖ్యమైన** high level metrics మరియు అవి కూడా దాదాపు ఎల్లప్పుడూ సమస్య ఉందని best indicator. ఉదాహరణకు: ఇచ్చిన time period లో మీరు సాధారణంగా expect చేయడం కంటే తక్కువ orders ఉన్నాయని సూచించే alert మీకు customers ను impact చేస్తున్న సమస్య ఉందని చెబుతుంది; server పై volume దాదాపు full అయిందని లేదా నిర్దిష్ట service కోసం ఎక్కువ సంఖ్యలో 5xx errors ఉన్నాయని సూచించే alert fix చేయాల్సిన విషయం కావచ్చు, కానీ customer impact ను అర్థం చేసుకుని తదనుగుణంగా prioritize చేయాలి - దీనికి సమయం పట్టవచ్చు.

Customers ను impact చేసే సమస్యలను ఈ high level business metrics measure చేస్తున్నప్పుడు గుర్తించడం సులభం. ఈ metrics **ఏమి** జరుగుతుందో చెబుతాయి. ఇతర metrics మరియు tracing మరియు logs వంటి ఇతర observability forms **ఎందుకు** ఇది జరుగుతుందో చెబుతాయి, ఇది fix చేయడానికి లేదా improve చేయడానికి మీరు ఏమి చేయగలరో తెలియజేస్తుంది.

## ఏమి observe చేయాలి

ఇప్పుడు మీ customers కి ఏది ముఖ్యమో తెలుసు, మీరు Key Performance Indicators (KPIs) ను identify చేయవచ్చు. ఇవి business outcomes risk లో ఉన్నాయా అని చెప్పే మీ high level metrics. ఆ KPIs ను impact చేయగల అనేక వేర్వేరు sources నుండి information gather చేయాలి, ఇక్కడ ఆ KPIs ను impact చేయగల metrics గురించి ఆలోచించడం మొదలు పెట్టాలి. ముందుగా చర్చించినట్లు, 5xx errors సంఖ్య impact ను సూచించదు, కానీ ఇది మీ KPIs పై effect కలిగి ఉండవచ్చు. Business outcomes ను impact చేసే వాటి నుండి business outcomes ను impact చేయగల వాటి వరకు backwards పని చేయండి.

మీరు ఏమి collect చేయాలో తెలిసిన తర్వాత, KPIs measure చేయడానికి మరియు ఆ KPIs ను impact చేయగల సంబంధిత metrics అందించే information sources ను identify చేయాలి. మీరు ఏమి observe చేస్తారో దానికి ఇది ఆధారం.

ఈ data Metrics, Logs మరియు Traces నుండి వచ్చే అవకాశం ఉంది. ఈ data ఉన్న తర్వాత, outcomes risk లో ఉన్నప్పుడు alert చేయడానికి దీనిని ఉపయోగించవచ్చు.

అప్పుడు impact ను evaluate చేసి సమస్యను rectify చేయడానికి ప్రయత్నించవచ్చు. దాదాపు ఎల్లప్పుడూ, ఈ data మీకు isolated technical metric (cpu లేదా memory వంటి) కంటే ముందుగా సమస్య ఉందని చెబుతుంది.

మీరు business outcomes ను impact చేస్తున్న సమస్యను fix చేయడానికి observability ను reactively ఉపయోగించవచ్చు లేదా మీ customer యొక్క search experience ను improve చేయడం వంటి దాన్ని proactively చేయడానికి data ను ఉపయోగించవచ్చు.

## ముగింపు

CPU, RAM, Disk Space మరియు ఇతర technical metrics scaling, performance, capacity మరియు cost కోసం ముఖ్యమైనవి అయినప్పటికీ - అవి మీ application ఎలా perform చేస్తుందో నిజంగా చెప్పవు మరియు customer experience లోకి ఎటువంటి insight ఇవ్వవు.

మీ customers ముఖ్యమైనవారు మరియు మీరు monitor చేయవలసింది వారి experience.

అందుకే మీరు మీ customers requirements నుండి backwards పని చేయాలి, మీ stakeholders తో పని చేసి ముఖ్యమైన KPIs మరియు metrics ను establish చేయాలి.

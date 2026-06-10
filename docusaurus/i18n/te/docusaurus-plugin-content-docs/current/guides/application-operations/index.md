---
sidebar_position: 5
---
# అప్లికేషన్ ఆపరేషన్లు

AWS కస్టమర్లు తరచుగా వందల అప్లికేషన్లను ఆపరేట్ చేస్తారు మరియు వారి అప్లికేషన్లు అందుబాటులో, సురక్షితంగా, ఖర్చు-ఆప్టిమైజ్ చేయబడి, మరియు ఆప్టిమల్‌గా perform అవుతున్నాయని నిర్ధారించడానికి వ్యక్తిగత resources ను monitor చేసి manage చేయాల్సి ఉంటుంది. అప్లికేషన్లు కస్టమర్ బిజినెస్‌లకు అవసరం. అవి end user కు అవసరమైన నిర్దిష్ట features లేదా services అందించడానికి కలిసి పనిచేసే resources groups. నేటి వేగంగా అభివృద్ధి చెందుతున్న digital landscape లో, సమర్థవంతమైన Cloud Operations కోసం మీ AWS resources ను బాగా నిర్వచించబడిన applications గా organize చేయడం కీలకమైంది. resource spread, operational inefficiencies మరియు multiple AWS accounts లో resources నిర్వహించడంలో complexity వంటి సాధారణ challenges పరిష్కరించడానికి ఈ application-centric approach అవసరం.

AWS application-centric cloud operations strategy కు మద్దతు ఇవ్వడానికి designed చేయబడిన services యొక్క సమగ్ర suite అందిస్తుంది, resource management streamline చేయడానికి, visibility మెరుగుపరచడానికి, మరియు overall operational efficiency enhance చేయడానికి మిమ్మల్ని అనుమతిస్తుంది.

Application operations అనేది AWS అంతటా capabilities set, ఇది మీ applications యొక్క cost, health, security posture మరియు performance వంటి metrics ను తక్కువ effort తో మరియు scale లో monitor చేయడానికి consistent approach అందిస్తుంది. ఈ capabilities multiple AWS consoles లో application-centric view ను weave చేస్తాయి.

![Application Operations](/img/cloudops/guides/app-ops/BP-App-ops-1.png "Application Operations")

Complex cloud environments లో, అనేక organizations కోసం applications manage చేయడం challenging మరియు time-consuming కావచ్చు. Challenge individual resources manage చేయడంలో మాత్రమే కాకుండా, application lifecycle యొక్క different stages లో application tasks perform చేయడంలో కూడా ఉంది. ఈ fragmented approach specific applications తో ఏ resources associated అయ్యాయో identify చేయడం కష్టం చేస్తుంది, critical events సమయంలో response times పెరగడానికి మరియు relevant operational data access చేయడంలో complications కు దారి తీస్తుంది.

ఈ challenges ను address చేయడానికి, resource management కోసం solid foundation establish చేయడం అవసరం. ఈ foundation resource landscape యొక్క comprehensive understanding develop చేయడం మరియు applications చుట్టూ centered robust tagging strategy implement చేయడంతో మొదలవుతుంది. అలా చేయడం ద్వారా, organizations AWS లో application-centric view వైపు transition చేయగలరు.

ఈ approach కస్టమర్లకు specific applications కు సంబంధించిన resources త్వరగా identify చేయడానికి, వాటి interdependencies అర్థం చేసుకోడానికి, మరియు అవసరమైనప్పుడు appropriate actions తీసుకోడానికి అనుమతిస్తుంది. ఇది ప్రతి application context లో resources ఎలా utilized అవుతున్నాయో clearer picture provide చేయడం ద్వారా monitoring, troubleshooting మరియు cost optimization efforts ను కూడా streamline చేస్తుంది.

![Application Operations](/img/cloudops/guides/app-ops/BP-App-ops-2.png "Application Operations")


### **Foundation Establish చేయడం**

AWS కస్టమర్లు తరచుగా single account లో numerous resources తో deal చేస్తారు, మరియు వారి applications లో unified view లేకపోవడం efficient action మరియు decision-making ను significantly hinder చేయవచ్చు. Business objectives సాధించేటప్పుడు కస్టమర్లకు operations scale చేయడంలో సహాయం చేయడానికి, resource management services AWS resources ను effectively explore, organize మరియు manage చేయడానికి core primitives, concepts మరియు technologies offer చేస్తాయి. ఈ services కస్టమర్లు business goals తో alignment లో scale లో resources handle చేయడానికి leverage చేయగల essential building blocks provide చేస్తాయి. ఈ approach యొక్క foundation ఈ components తో కూడి ఉంటుంది: Tagging, Tagging Policies, Resource Groups మరియు Resources Explorer.

AWS Resource Explorer AWS resources గురించి detailed information ను aggregate చేసి, వాటిపై action తీసుకోడానికి centralized location అందిస్తుంది. మీ resource footprint గురించి details చూడవచ్చు, ఎన్ని untagged resources ఉన్నాయో వంటి governance assess చేయవచ్చు, మరియు resources కోసం detailed resource metadata మరియు relationship graphs explore చేయవచ్చు. మీ account లో resources identify చేయడం మీ resource landscape అర్థం చేసుకోడానికి first step.

Tagging అనేది resources organize చేయడంలో మరియు resource management simplify చేయడంలో crucial step. ఇది కస్టమర్లకు various resources efficiently track చేయడానికి అనుమతిస్తుంది. అనేక organizations ఇప్పటికే departments, environments మరియు cost centers కోసం tags ఉపయోగిస్తున్నప్పటికీ, application tag add చేయడం ప్రత్యేకంగా valuable. ఈ tag ప్రతి resource ఏ application తో associated అయ్యిందో identify చేయడంలో సహాయపడుతుంది, individual resources మరియు అవి support చేసే applications మధ్య clear link provide చేస్తుంది. Application tagging implement చేయడానికి, ప్రతి application లో operate అయ్యే అన్ని resources identify చేయడంతో ప్రారంభించండి. Application name include చేసే consistent tagging strategy develop చేయండి, మరియు ఈ tags ను అన్ని relevant resources కు systematically apply చేయండి.

Consistency maintain చేయడానికి tagging మీ resource provisioning process లో భాగం అయ్యేలా ensure చేయండి. ఉదాహరణకు, AWS లో hundreds of applications నడుపుతున్న ఒక retail customer. అంటే Amazon EC2 instances, Amazon S3 buckets, Amazon Relational Database Service (RDS) databases మరియు AWS Lambda functions వంటి వేలాది AWS resources manage చేయడం. ఈ resources inventory management, point-of-sale systems (POS), customer loyalty programs మరియు e-commerce platforms వంటి various applications లో భాగం కావచ్చు.


```json
Example for tagging schema for POS system and inventory manager can be as:
Application name ("pos-system", "inventory-manager")
Environment (e.g., "production", "development", "testing")
Business unit (e.g., "north-america", "europe", "e-commerce")
Cost center (e.g., "it-ops", "marketing", "sales")
```


ఈ tagging schema apply చేయడం ద్వారా, retail customer గా మీరు Cyberweek sales వంటి critical events సమయంలో, POS-Systems కు సంబంధించిన performance issues కు promptly find చేసి respond చేయగలరు. Application centric view నుండి relevant resources pinpoint చేయగలరు.

Tagging మరియు Resource Groups కస్టమర్లు తమ environments ను conceptualize చేసే విధానంతో కలిసి పనిచేస్తాయి. Resource Groups మీ AWS resources ను applications, projects లేదా workloads reflect చేసే components గా organize చేయడానికి అనుమతిస్తాయి. ఈ approach resources ను collectively manage మరియు monitor చేయడానికి intuitive way provide చేస్తుంది. Resource groups effectively ఉపయోగించడానికి, మీ application tags ఆధారంగా వాటిని create చేయండి. ప్రతి application కోసం దాని corresponding group లో అన్ని relevant resources include చేయండి. ఈ groups monitoring, permissions మరియు cost tracking వంటి collective management tasks కోసం ఉపయోగించవచ్చు.

మన retail customer ఉదాహరణ అనుసరించి tagging schema ఉపయోగించి, "Application: pos-system" మరియు "Environment: production" తో tag చేయబడిన అన్ని resources కలిసి group చేయబడ్డాయి. Production environment కోసం pos-system లో భాగమైన అన్ని AWS resources పై ఒకే single view provide చేస్తుంది.

### **Application Define చేయడం**

Tags మరియు Resource Groups పై building, AWS లో cohesive units గా applications define చేయడం Cloud Operations కోసం truly application-centric approach కు అనుమతిస్తుంది. ఈ step అన్ని related resources మరియు వాటి interdependencies ను encompass చేసే formal application definition create చేయడం involves. Applications establish చేయడానికి, applications define మరియు manage చేయడానికి AWS Service Catalog AppRegistry వంటి AWS services ఉపయోగించండి. Application definition లో అన్ని relevant resource groups మరియు individual resources include చేయండి, మరియు application యొక్క lifecycle stages మరియు associated management processes define చేయండి.

మన retail customer ఉదాహరణలో, web servers, databases మరియు load balancers వంటి అన్ని resource groups మరియు individual resources తో సహా application definition formalize చేయడానికి AWS Service Catalog AppRegistry ఉపయోగిస్తారు. Lifecycle stages (Development, Staging, Production) establish చేసి management processes associate చేయడం.

ఈ approach ఉపయోగించడం ద్వారా, AWS లో application-centric resource management కోసం solid foundation create చేయవచ్చు. ఈ approach efficient operations, application health మరియు performance లో better visibility, మరియు IT resources మరియు business objectives మధ్య improved alignment ఎనేబుల్ చేస్తుంది. ఇది automated scaling, simplified disaster recovery మరియు accurate cost allocation వంటి advanced management capabilities కోసం stage set చేస్తుంది. ఈ steps ద్వారా progress అయినప్పుడు, మీ AWS environment organized, manageable మరియు మీ business needs తో aligned అవుతుందని గమనిస్తారు, ultimately improved operational efficiency మరియు better resource utilization కు దారి తీస్తుంది. Applications పై focus చేసి mental model build చేయడం.

### **Application-centric views**

Application operations consistent application model అవసరం; [AWS Service Catalog AppRegistry](https://docs.aws.amazon.com/servicecatalog/latest/arguide/intro-app-registry.html) application metadata store చేస్తుంది, [AWS Resource Groups](https://docs.aws.amazon.com/ARG/latest/userguide/resource-groups.html) application resources ను logically group చేస్తుంది, మరియు resource tagging application resources ను searchable resource groups గా organize చేస్తుంది.

AppRegistry application create చేయబడినప్పుడు, AppRegistry vended application tag ఉపయోగించి AWS resources ను resource group గా associate చేస్తుంది. Tag key **awsApplication** మరియు value application కోసం unique identifier. Tag key మరియు value రెండూ case sensitive. ఈ key-value pair తో tag చేయబడిన ఏదైనా AWS resources application లో భాగం అవుతాయి. ఈ application tag AWS services తమ consoles మరియు APIs లో ఆ application tag reference చేయడం ద్వారా application operations కు support చేయడానికి అనుమతిస్తుంది.

ఈ approach ఉపయోగించడం ద్వారా, AWS లో application-centric resource management కోసం solid foundation create చేయవచ్చు. ఈ approach efficient operations, application health మరియు performance లో better visibility, మరియు IT resources మరియు business objectives మధ్య improved alignment ఎనేబుల్ చేస్తుంది. ఇది automated scaling, simplified disaster recovery మరియు accurate cost allocation వంటి advanced management capabilities కోసం stage set చేస్తుంది. ఈ steps ద్వారా progress అయినప్పుడు, మీ AWS environment organized, manageable మరియు మీ business needs తో aligned అవుతుందని గమనిస్తారు, ultimately improved operational efficiency మరియు better resource utilization కు దారి తీస్తుంది. Applications పై focus చేసి mental model build చేయడం.

myApplications dashboard మీ chosen application కోసం metrics యొక్క combined view provide చేయడానికి application tag ఉపయోగిస్తుంది, multiple AWS services నుండి cost and usage, security మరియు operations metrics మరియు insights include చేస్తుంది. myApplications existing tags ఉపయోగించి resources automatically add చేయడానికి support చేస్తుంది. Resources నుండి selected tag add చేసి remove చేసేటప్పుడు మీ application ను update చేయడానికి మీ existing tags ఉపయోగించవచ్చు.

myApplications dashboard తో, application performance కోసం [Amazon CloudWatch](https://aws.amazon.com/cloudwatch), cost and usage కోసం [AWS Cost Explorer](https://aws.amazon.com/aws-cost-management/aws-cost-explorer/), మరియు security findings కోసం [AWS Security Hub](https://aws.amazon.com/security-hub/) వంటి relevant services లో specific resources పై act చేయడానికి deeper dive చేయవచ్చు.

#### **Cost & Usage Widget**

కస్టమర్లు తమ application resources ఖర్చులు predict చేయడం మరియు costs optimize చేయడం challenging గా భావిస్తారు. మీ application resource costs అర్థం చేసుకోడానికి, మీ spend ను at a glance monitor చేయవచ్చు మరియు మీ applications యొక్క current మరియు forecasted monthly costs తెలుసుకోవచ్చు. Cost trends లో deep dive చేసి AWS పై మీ applications costs optimize చేయడానికి action తీసుకోవచ్చు.

Cost & Usage widget AWS Cost Explorer నుండి మీ AWS resources costs visualize చేస్తుంది, application యొక్క current మరియు forecasted month-end costs, top five billed services, మరియు monthly application resource cost trend chart include చేస్తుంది. Spend monitor చేయవచ్చు, anomalies చూడవచ్చు, మరియు savings opportunities కనుగొనవచ్చు.

AWS Organizations ఉపయోగించి organization level లో AWS Cost Explorer enable చేసిన కస్టమర్లు member accounts లో explicitly enable చేయాల్సిన అవసరం లేదు. Cost Explorer వారి FinOps strategies ఆధారంగా కస్టమర్లకు ఇప్పటికే enabled అయి ఉండవచ్చు; కొత్త కస్టమర్లకు లేదా multiple standalone accounts operate చేసేవారికి, Cost Explorer enable చేయడం general best practice మరియు Cost Explorer console ద్వారా enable చేయవచ్చు. ఇది individual resources spend చూడడం కంటే application ఎంత cost అవుతుందో అర్థం చేసుకోడానికి way provide చేయడం ద్వారా myApplications experience ను maximize చేయడంలో సహాయపడుతుంది. మరింత సమాచారం కోసం, [Enabling Cost Explorer](https://docs.aws.amazon.com/cost-management/latest/userguide/ce-enable.html) చూడండి.

#### **DevOps widget**
Enterprises క్లౌడ్-ఆధారిత architectures ను తమ critical business applications power చేయడానికి ఎక్కువగా adopt చేస్తుండగా, comprehensive operational insights అవసరం paramount అవుతుంది. ఈ applications తరచుగా complex, distributed set of infrastructure resources మరియు services పై depend అవుతాయి, IT teams కు entire application environment యొక్క overall health మరియు compliance పై visibility మరియు control maintain చేయడం challenging అవుతుంది.

DevOps widget మీ application కోసం key operational insights యొక్క centralized view provide చేయడం ద్వారా ఈ challenge ను address చేస్తుంది. ఈ widget fleet management, compliance మరియు OpsItems management గురించి critical information surface చేస్తుంది - మీ teams కు మీ application యొక్క overall operational posture quickly assess చేయడానికి మరియు compliance మరియు reliability ensure చేయడానికి necessary actions తీసుకోడానికి empower చేస్తుంది.

ఈ widget లో data monitor చేయడం ద్వారా, మీ application infrastructure యొక్క operational health లో valuable insights పొందవచ్చు, ఏదైనా compliance drift identify చేయవచ్చు, మరియు మీ users ను impact చేయడానికి ముందు proactively address చేయవచ్చు. ఇది మీ teams కు మీ critical business applications యొక్క operational lifecycle manage చేయడంలో more responsive, efficient మరియు effective కావడంలో సహాయపడుతుంది.

Systems Manager నుండి provide చేయబడిన information node management మరియు Config deployed అయిన rules కు resource level నుండి compliance status evaluate చేయడం provide చేస్తుంది.

Node management information instances Systems Manager ద్వారా managed అయ్యాయా, [patch policies](https://docs.aws.amazon.com/systems-manager/latest/userguide/patch-manager-create-a-patch-policy.html) నుండి patch compliance state, మరియు severity level తో resources తో associated అయిన OpsItems identify చేస్తుంది. Systems Manager తో instance managed కావడానికి మూడు prerequisites meet కావాలి. మొదట, SSM agent install కావాలి. రెండవది, [SSM agent](https://docs.aws.amazon.com/systems-manager/latest/userguide/ssm-agent.html) కు మీ తరఫున node పై actions perform చేయడానికి necessary permissions అవసరం. దీని కోసం [host management](https://docs.aws.amazon.com/systems-manager/latest/userguide/quick-setup-host-management.html) ద్వారా [Quick Setup](https://docs.aws.amazon.com/systems-manager/latest/userguide/systems-manager-quick-setup.html) ఉపయోగించవచ్చు లేదా [Default Host Management (DHMC)](https://docs.aws.amazon.com/systems-manager/latest/userguide/quick-setup-default-host-management-configuration.html) ఉపయోగించవచ్చు లేదా మీ resources deploy చేసేటప్పుడు IaC ద్వారా necessary IAM role మరియు permissions add చేయవచ్చు. మరియు చివరగా, SSM agent కు internet ద్వారా లేదా [VPC endpoints](https://docs.aws.amazon.com/systems-manager/latest/userguide/setup-create-vpc.html) ఉపయోగించి service endpoints కు network connectivity ఉండాలి.

Systems Manager, [Patch Manager](https://docs.aws.amazon.com/systems-manager/latest/userguide/patch-manager-installing-patches.html) patch baselines ఉపయోగిస్తుంది, ఇవి మీ instances patching కోసం certain criteria define చేయడానికి అనుమతిస్తాయి. మీ AWS Organization మరియు Regions అంతటా patching scale చేయడానికి Patch Policies కూడా ఉపయోగించవచ్చు. [Systems Manager OpsCenter](https://docs.aws.amazon.com/systems-manager/latest/userguide/OpsCenter.html) నుండి operation data కూడా చూస్తారు. OpsCenter investigation మరియు remediation అవసరమయ్యే operational issue లేదా interruption తో associated OpsItems create చేస్తుంది. Amazon CloudWatch తో integrate అయ్యే OpsItems create చేయవచ్చు, ఇక్కడ EC2 instance దాని CPU Utilization reach అవుతుండవచ్చు లేదా Security Hub findings కోసం OpsItem create చేయవచ్చు.

ఇతర component మీ resources యొక్క account లో deployed rules పట్ల compliance status గురించి collect చేయబడుతున్న Config data. మొదట, widget account లో ఎన్ని rules compliant మరియు non-compliant resources లేవో ఆధారంగా rule compliance status యొక్క aggregated percentage present చేస్తుంది. రెండవది, widget మీ application resources కోసం compliance status percentage provide చేస్తుంది, ఇది మీ application resources selected rules తో compliant అయ్యాయా అనేది indicate చేస్తుంది.

#### **Security widget**

AWS resources పై security findings assess చేసే Security teams కు business criticality అర్థం చేసుకోడానికి, next steps prioritize చేయడానికి, మరియు resolution కోసం path identify చేయడానికి application context piece together చేయడానికి time అవసరం. మీ application యొక్క security posture improve చేయడానికి, మీ AWS-based applications యొక్క security posture లో visibility more quickly పొందవచ్చు. Developers, security teams మరియు application teams security risks identify చేయవచ్చు మరియు application criticality ఆధారంగా issues quickly prioritize చేయవచ్చు.

Security widget application ను make up చేసే resources చుట్టూ AWS Security Hub నుండి information display చేస్తుంది. AWS Security Hub అనేది cloud security posture management (CSPM) service, ఇది misconfigurations identify చేయడంలో సహాయం చేయడానికి మీ AWS resources పట్ల automated, continuous, security best practice checks తో security operations streamline చేస్తుంది. Security Hub మీ security alerts (findings) ను standardized format లో aggregate చేస్తుంది మరియు వాటిని prioritize చేస్తుంది, దీని వల్ల మీరు వాటిని more easily enrich, investigate మరియు remediate చేయవచ్చు.

Security Hub మీ AWS accounts, workloads మరియు resources యొక్క security manage చేయడం మరియు improve చేయడంలో complexity మరియు effort తగ్గిస్తుంది. మీ అన్ని accounts మరియు Regions లో Security Hub enable చేయవచ్చు.

**Compute widget**

అనేక enterprises తమ critical business operations support చేయడానికి AWS పై complex, distributed applications యొక్క large portfolio operate చేస్తాయి. ఈ applications required performance మరియు scalability deliver చేయడానికి EC2 instances మరియు Lambda functions తో సహా variety of compute resources పై rely అవుతాయి. అయితే, ఈ అన్ని applications లో compute metrics మరియు utilization యొక్క centralized view లేకుండా, IT teams కు వారి application infrastructure యొక్క health మరియు capacity effectively monitor చేయడం extremely challenging అవుతుంది.

మీ application rightsizing opportunities identify చేయడానికి AWS Compute Optimizer ఉపయోగించమని AWS recommend చేస్తుంది. AWS Compute Optimizer మీ running resources యొక్క vCPUs, memory లేదా storage వంటి specifications మరియు గత 14 days (Default period) నుండి 93 days వరకు CloudWatch metrics analyze చేస్తుంది.

myApplications dashboard లోని Compute widget ప్రతి application power చేస్తున్న compute resources పై consolidated, at-a-glance perspective provide చేయడం ద్వారా ఈ need address చేస్తుంది. ఈ widget మీరు configured చేసిన compute resources గురించి key information మరియు metrics display చేస్తుంది, total alarms count, different compute resource types, మరియు EC2 instance CPU utilization మరియు Lambda invocations వంటి performance trends. ఈ widget లో data monitor చేయడం ద్వారా, మీ application compute infrastructure యొక్క operational health మరియు capacity లో valuable insights పొందవచ్చు. ఇది IT teams కు overall compute capacity quickly assess చేయడానికి, performance bottlenecks identify చేయడానికి, మరియు 24/7 వారి applications available మరియు peak efficiency లో operate అవుతున్నాయని ensure చేయడానికి proactively resources scale చేయడానికి empower చేస్తుంది.

#### **Monitoring and operations widget**

Monitoring and operations widget మీ application తో associated resources కోసం alarms మరియు canary alarms, application service level indicator (SLIs) మరియు metrics, మరియు ఇతర available AWS CloudWatch Application Signals metrics చూపిస్తుంది.

Alarm అనేది probe, monitor యొక్క state లేదా given threshold పై లేదా కింద value లో change ను refer చేస్తుంది. Alarms create చేసేటప్పుడు కొన్ని విషయాలు consider చేయాలి: 1/ మీ objectives నుండి ఎల్లప్పుడూ backwards work చేయండి (actionable things పై alert చేయండి), 2/ ఒక alarm మిమ్మల్ని alert చేయాల్సిన అవసరం లేకపోతే, లేదా automated process trigger చేయాల్సిన అవసరం లేకపోతే, అది మిమ్మల్ని alert చేయాల్సిన అవసరం లేదు.

[Amazon CloudWatch Application Signals](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-Application-Monitoring-Sections.html) AWS పై మీ applications instrument చేస్తుంది, దీని వల్ల మీ application health monitor చేయవచ్చు మరియు మీ business objectives పట్ల performance track చేయవచ్చు, మీ applications, services మరియు dependencies యొక్క view provide చేస్తూ, application health monitor మరియు triage చేయడంలో సహాయపడుతుంది.

CloudWatch Synthetics monitoring ([canaries](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch_Synthetics_Canaries.html)) Application Signals తో integrate అవుతుంది. Canaries powerful feature, ఇవి scheduled synthetic behavior ఉపయోగించి endpoints మరియు APIs monitor చేయడానికి అనుమతిస్తాయి, మీ applications యొక్క end users అదే routes follow చేసి అదే actions perform చేస్తారు. End users చేయడానికి ముందు issues discover చేయడానికి మరియు customer experience continuously assess చేయడానికి ఇవి enable చేస్తాయి.

మీరు observability కు కొత్త అయితే లేదా metrics, alarms set up చేయడంలో లేదా observability strategy develop చేయడంలో guidance అవసరమైతే, [AWS Observability Best Practices](https://aws-observability.github.io/observability-best-practices/) observability యొక్క different components అర్థం చేసుకోడం మరియు monitoring కోసం ఏ metrics, alarms మొదలైనవి beneficial అనేది ఎలా start చేయాలో outline చేస్తుంది.

*Note: Container based applications లో operate చేసే కస్టమర్లకు clusters, task మొదలైనవి tag చేయగలగడానికి ఆ resources ను specifically non-EC2 manually tag చేయాల్సి ఉంటుంది.*

### Strategy to execution

1. Application names, environments, business units మరియు cost centers పై focus చేసి comprehensive tagging strategy develop చేయడంతో start చేయండి. [Building your tagging strategy](https://docs.aws.amazon.com/whitepapers/latest/tagging-best-practices/building-your-tagging-strategy.html)
2. ఈ tags ను అన్ని relevant resources కు systematically apply చేయండి, వాటి provisioning process లో భాగం చేయండి. AWS Resource Groups & Tag Editor ఉపయోగించడం మీ tags ఆధారంగా resources create, manage మరియు search చేయడానికి allow చేస్తుంది. Account level లో multiple AWS services లో tags manage చేయడానికి centralized way provide చేస్తుంది. [Resource Groups and Tagging for AWS](https://aws.amazon.com/blogs/aws/resource-groups-and-tagging/)
3. ఈ tags ఆధారంగా Resource Groups create చేయండి, అన్ని production POS system resources కలిసి group చేయడం వంటివి. AWS Service Catalog AppRegistry ఉపయోగించి, POS మరియు inventory management వంటి systems కోసం అన్ని components మరియు interdependencies తో సహా application definition formally define చేస్తారు. [Key concepts of AWS Service Catalog AppRegistry](https://docs.aws.amazon.com/serviwecatalog/latest/arguide/overview-appreg.html#ar-user-tags)
4. Cyber Week sales వంటి high-stakes events సమయంలో critical metrics monitoring చేస్తూ, retail applications యొక్క unified view పొందడానికి myApplications dashboard utilize చేయండి. Create application wizard ఉపయోగించి applications more easily create చేయవచ్చు, console లో one view నుండి మీ AWS account లో resources connecting. Created application myApplications లో automatically display అవుతుంది, మరియు మీ applications పై action తీసుకోవచ్చు. [myApplications in the AWS Management Console simplifies managing your application resources](https://aws.amazon.com/blogs/aws/new-myapplications-in-the-aws-management-console-simplifies-managing-your-application-resources/)

### **తదుపరి చదవండి:**

* [Defining and publishing a tagging schema](https://docs.aws.amazon.com/whitepapers/latest/tagging-best-practices/defining-and-publishing-a-tagging-schema.html)
* [Best Practices for Tagging AWS Resources](https://docs.aws.amazon.com/whitepapers/latest/tagging-best-practices/tagging-best-practices.html)
* [Implementing automated and centralized tagging control](https://aws.amazon.com/blogs/mt/implementing-automated-and-centralized-tagging-controls-with-aws-config-and-aws-organizations/)


### ముగింపు

కస్టమర్ల businesses cloud లో grow మరియు evolve అవుతూ ఉండగా, resource management కోసం ఈ best practices adopt చేయడం essential. Foundation lay చేయడం ద్వారా, organizations తమ current needs మాత్రమే కాకుండా future growth మరియు innovations కోసం meet చేయగలవు. AWS Application Operations మరియు myApplications ఈ approach ను further step తీసుకెళ్తుంది, application resources మరియు metrics యొక్క consolidated view offer చేస్తుంది. ఇది teams కు informed decisions quickly make చేయడానికి, issues కు proactively respond చేయడానికి, మరియు scale లో resources more effectively manage చేయడానికి empower చేస్తుంది.

---
sidebar_position: 6
---
# Remote మరియు Session Management

Remote మరియు Session Management లో Run Command, Fleet Manager మరియు Session Manager వంటి features ఉన్నాయి.

## Remote Management

AWS Systems Manager లోని ఒక tool అయిన Run Command ఉపయోగించి, మీరు మీ managed nodes యొక్క configuration ను remotely మరియు securely manage చేయవచ్చు. Run Command సాధారణ administrative tasks ను automate చేయడానికి మరియు ఒకేసారి scale లో configuration changes చేయడానికి మిమ్మల్ని అనుమతిస్తుంది. మీరు AWS Management Console, AWS Command Line Interface (AWS CLI), AWS Tools for Windows PowerShell, లేదా AWS SDKs నుండి Run Command ఉపయోగించవచ్చు.

![Remote Management](/img/cloudops/guides/centralized-operations-management/remote-and-session-management/BP-Remote-Session-Mgmt-1.png "Remote Management")

Run command ఉపయోగించడానికి సాధారణ use cases:

* **Nodes ను Bootstrap చేయడం:** మీరు అన్ని లేదా నిర్దిష్ట nodes కు applications install లేదా bootstrap చేయవచ్చు.
* **Configuration management:** Systems Manager [Ansible](https://aws.amazon.com/blogs/mt/running-ansible-playbooks-using-ec2-systems-manager-run-command-and-state-manager/), [Salt States](https://aws.amazon.com/blogs/mt/running-salt-states-using-amazon-ec2-systems-manager/), మరియు [PowerShell DSC](https://aws.amazon.com/blogs/mt/combating-configuration-drift-using-amazon-ec2-systems-manager-and-windows-powershell-dsc/) తో సహా వివిధ Domain Specific Languages (DSLs) కు మద్దతు ఇస్తుంది.
* **Domain కు Join చేయడం:** Nodes ను Windows domain కు join చేయండి
* **ఇతర Amazon agents deploy చేయడం:** Agent config ను Parameter Store లో store చేయండి

### Composite Command Documents

ఈ Systems Manager documents మీరు managed nodes మీద నిర్వహించాలనుకునే actions ను నిర్వచిస్తాయి. Systems Manager అనేక pre-defined public documents అందిస్తుంది మరియు documents ను customize చేయగల సామర్థ్యాన్ని కూడా అందిస్తుంది. మీరు మీ configurations భాగంగా [composite documents execute](https://aws.amazon.com/about-aws/whats-new/2017/10/amazon-ec2-systems-manager-now-integrates-with-github/) చేయవచ్చు. Composite documents ఒకటి లేదా అంతకంటే ఎక్కువ secondary documents ను execute చేసే task నిర్వహిస్తాయి.

Composite command documents ఉపయోగించేటప్పుడు గుర్తుంచుకోవలసిన విషయాలు ఏమిటంటే sequential operations మాత్రమే ఉంటాయి మరియు branching ఉండదు. AWS-RunDocument ద్వారా Systems Manager, private లేదా public GitHub, లేదా Amazon S3 లో store చేయబడిన documents ను execute చేయడానికి మీరు దీన్ని enable చేయవచ్చు. ఇది [aws:downloadContent](http://docs.aws.amazon.com/systems-manager/latest/userguide/ssm-plugins.html#aws-downloadContent) మరియు [aws:runDocument](http://docs.aws.amazon.com/systems-manager/latest/userguide/ssm-plugins.html#aws-rundocument) plugins ఉపయోగించి సాధించబడుతుంది. aws:runDocument plugin Systems Manager లో లేదా local path లో ఉన్న documents ను execute చేస్తుంది. దీనికి ఒక ఉదాహరణ AWS-RunPatchBaselineWithHooks.

### Run Command ను పరిమితం చేయడం

IAM users/ Roles ద్వారా ఒక session లో user run చేయగల commands ను మీరు restrict చేయవచ్చు. Document లో, user session start చేసినప్పుడు run అయ్యే command మరియు user command కు అందించగల parameters ను మీరు నిర్వచిస్తారు. మీరు ఈ ఆధారంగా access restrict చేయవచ్చు: ssm:SendCommand, Document name లేదా prefix, Resource tags, మరియు Resource IDs. మీరు SAML session tags ఉపయోగించి ABAC policies కూడా enforce చేయవచ్చు.

![Restricting Run Command](/img/cloudops/guides/centralized-operations-management/remote-and-session-management/BP-Remote-Session-Mgmt-2.png "Restricting Run Command")

1. ఉదాహరణకు, మీ [AWS Identity and Access Management (IAM)](https://aws.amazon.com/iam/) user చెందిన department ఆధారంగా మీరు నిర్దిష్ట managed nodes కు access ఇవ్వవచ్చు.
1. Alice మరియు Bob తమ external Identity Provider (IdP) ఉపయోగించి [AWS Management Console](http://aws.amazon.com/console) లో federate అవుతారు. ఇద్దరు federated users తమ "department" membership ఆధారంగా, Amber మరియు Blue వరుసగా, Session Manager ఉపయోగించి నిర్దిష్ట EC2 instances ను MUST access చేయాలి.

### Multi-account మరియు multi-Region Run Command

* Run Command అనేది per account/Region
* Accounts/Region అంతటా invoke చేయడానికి Automation ఉపయోగించండి

AWS Systems Manager లోని ఒక tool అయిన Automation, సాధారణ maintenance, deployment, మరియు remediation tasks ను సరళం చేస్తుంది. బహుళ accounts / Regions ను target చేయడానికి మీరు దీన్ని ఉపయోగించవచ్చు. Multi-account/ multi-Region automation కోసం, child accounts ను target చేసేటప్పుడు command document target account/ Region లో ఉండాలి. Command documents deploy చేయడానికి మీరు CloudFormation లేదా Terraform ఉపయోగించవచ్చు. Systems Manager service automation actions execute చేయగలగడానికి అవసరమైన permissions ఉండాలి. మరింత సమాచారం కోసం Automation section చూడండి.

![Multi-account and multi-Region Run Command](/img/cloudops/guides/centralized-operations-management/remote-and-session-management/BP-Remote-Session-Mgmt-3.png "Multi-account and multi-Region Run Command")

### AWS Systems Manager State Manager Associations ద్వారా Run Command Schedule చేయడం

State Manager మీ managed nodes ను AWS, on-premises, లేదా multicloud లో desired state లో ఉంచే ప్రక్రియను automate చేయడంలో సహాయపడుతుంది. State Manager లో, association అనేది ఒక document లో మీ expressed configuration, మరియు targets యొక్క set, నిర్దిష్ట schedule లో, consistent state నిర్ధారించడానికి binding. మీరు runbook తో State Manager association సృష్టించడం ద్వారా automation start చేయవచ్చు. Configurations తో associated Command document ప్రతి target account/ Region లో ఉండాలి.

![Scheduling Run Command](/img/cloudops/guides/centralized-operations-management/remote-and-session-management/BP-Remote-Session-Mgmt-4.png "Scheduling Run Command")

### Error, Exit, మరియు Reboot codes handle చేయడం

Default గా, script లో run అయిన చివరి command యొక్క exit code మొత్తం script కోసం exit code గా report చేయబడుతుంది.

* `Exit 0` results in the status: `Success`
* `Exit 1` or otherwise*, results in the status: `Failed`
* Errors ను మరింత త్వరగా గుర్తించడానికి మీరు specific exit codes చేర్చవచ్చు.
* Reboot codes:
  * Windows: `exit 3010`
  * Linux: `exit 194`

![Scheduling Run Command](/img/cloudops/guides/centralized-operations-management/remote-and-session-management/BP-Remote-Session-Mgmt-5.png "Scheduling Run Command")

### Amazon CloudWatch ఉపయోగించి Run Command Monitor చేయడం

AWS Systems Manager Run Command commands యొక్క status గురించి CloudWatch కు metrics publish చేస్తుంది, ఆ metrics ఆధారంగా alarms set చేయడానికి మిమ్మల్ని అనుమతిస్తుంది. Systems Manager CloudWatch కు push చేసే ```Delivery Time Out```, ఎన్ని ```Failed```, మరియు ఎన్ని ```Successful``` అయ్యాయి అనే specific metrics ఉన్నాయి.

Run command monitor చేయడం గురించి మరింత తెలుసుకోవడానికి, [Monitoring Run Command metrics using Amazon CloudWatch](https://docs.aws.amazon.com/systems-manager/latest/userguide/monitoring-cloudwatch-metrics.html) సందర్శించండి.

## Session Management

AWS Session Manager అనేది పూర్తిగా managed AWS Systems Manager tool. మీరు managed node తో interact చేయడానికి interactive one-click browser-based shell లేదా AWS Command Line Interface (AWS CLI) ఉపయోగించవచ్చు. Session Manager inbound ports open చేయాల్సిన అవసరం లేకుండా, bastion hosts maintain చేయాల్సిన అవసరం లేకుండా, లేదా SSH keys manage చేయాల్సిన అవసరం లేకుండా secure node management అందిస్తుంది. Managed nodes కు controlled access, strict security practices, మరియు node access details తో logs అవసరమయ్యే corporate policies కు అనుగుణంగా ఉండగలుగుతారు, అదే సమయంలో end users కు మీ managed nodes కు simple one-click cross-platform access అందిస్తారు.

### Governance

![Governance](/img/cloudops/guides/centralized-operations-management/remote-and-session-management/BP-Remote-Session-Mgmt-6.png "Governance")

* ***Users ను data నుండి వేరు చేయడం***: Cloud Ops యొక్క ఒక కీలక సిద్ధాంతం ఏమిటంటే సాధ్యమైన చోట users ను data నుండి వేరు చేయడం. Session Manager credentials ఉన్న ఎవరైనా server లో access చేయడానికి మరియు configuration మార్చడానికి అనుమతించే inbound network ports ను మూసివేస్తుంది. Session Manager users ను ఎప్పుడూ interactive session లేకుండా individual commands run చేయడానికి మరియు results view చేయడానికి పరిమితం చేయడం ద్వారా మరింత ముందుకు వెళ్ళగలదు.

* ***Access ను centrally manage చేయడం***: Cloud Operations elastic, constant stream of changes కు దారితీయవచ్చు. ప్రతి server లో ఎవరు ఏ server ను access చేయగలరో maintain చేయడం కంటే, Session Manager Identity Access Management తో integrate అవుతుంది, ఎవరు ఏ nodes ను access చేయగలరో central definition అనుమతిస్తుంది.

* ***Workloads మరియు components కు access control చేయడం***: Organizations workload లేదా role ప్రకారం nodes కు access control చేయడానికి IAM ఉపయోగించవచ్చు. ఉదాహరణకు, Database Administrator "Component: Database" గా tag చేయబడిన ఏ instance నైనా remotely access చేయగలరు, లేదా application developer "Environment: Development" తో tag చేయబడిన ఏ instance నైనా remotely access చేయగలరు. ఈ attribute based access control project teams కు business కు value deliver చేయడంలో వారికి అవసరమైనంత వేగంగా పనిచేయడానికి అనుమతిస్తుంది, అయినప్పటికీ organization వారు నిర్వచించిన guard rails లో operate చేస్తున్నారనే knowledge తో secure గా ఉంటుంది.

* ***Specific roles కు commands restrict చేయడం:*** Users ను data నుండి వేరు చేయడంలో మేము చెప్పినట్లుగా, ఆ role కు అవసరమైన specific set of commands మాత్రమే execute చేయడానికి role ను అనుమతించడం సాధ్యమే. ఉదాహరణకు, Application Developer Production environment కు interactive access అవసరం లేకుండా Production లో తమ application కోసం log file ను "tail" చేయగలరు.

* ***Business reasons కోసం temporary access ఇవ్వడం***: Open source మరియు commercial temporary elevated access solutions అందించే అదనపు features తో server కు remotely access చేయడానికి valid business reason లేకపోతే అన్ని operators కు remote access deny చేయడం కూడా సాధ్యమే. ఉదాహరణకు, production application server ను remotely access చేయడానికి ఎటువంటి మార్గం ఉండదు. అయితే, incident సమయంలో operator incident investigate చేయడానికి server కు temporary access request చేయవచ్చు మరియు ఇవ్వబడవచ్చు. ఈ access recorded reason తో associated ఉంటుంది, second operator ద్వారా approved ఉంటుంది మరియు work చేయడానికి అవసరమైనంత సమయం మాత్రమే timed ఉంటుంది.

### Observability & Compliance

* **VM మరియు Container Session Activities Log చేయడం & Managed node access మరియు activity Monitor చేయడం:** Session Manager ఉపయోగించి AWS Console నుండి Terminal Session start చేసినప్పుడు, session యొక్క అన్ని commands మరియు వాటి results S3 మరియు CloudWatch Log Groups కు record చేయబడగలవు. ఇది interactive session సమయంలో చేయబడిన అన్ని changes యొక్క audit trail అందించగలదు. Nodes కు successful మరియు unsuccessful remote sessions monitor చేయడానికి (మరియు అవసరమైతే alert చేయడానికి) మీరు CloudTrail events కూడా ఉపయోగించవచ్చు. ఉదాహరణకు, నిర్వచించిన change window బయట నిర్వహించిన remote session సంబంధిత వ్యక్తికి మరియు వారి manager కు alert చేయబడవచ్చు.

### Operations సరళం చేయడం

* **Console నుండి Single click access:** Session Manager EC2 console, Session Manager console మరియు Fleet Manager console నుండి "Connect" options అందిస్తూ AWS console తో బాగా integrated ఉంది.
* **SSH manage చేయాల్సిన అవసరం లేదు**: Session Manager తో మీ elastic nodes fleet కు SSH access కోసం PKI infrastructure creation, distribution మరియు refreshing manage చేయాల్సిన అవసరం లేదు. IAM ద్వారా central authorization మీ fleet అంతటా private keys store చేయడం, protect చేయడం మరియు monitor చేయడం అవసరాన్ని replace చేస్తుంది.
* **Security groups open చేయకుండా access అనుమతించడం:** Session Manager యొక్క "Port Forwarding" feature ఉపయోగించి instance యొక్క remote session ports కు network access open చేయాల్సిన లేదా widen చేయాల్సిన అవసరం లేకుండా మీ nodes కు authorized access అనుమతించవచ్చు. ఉదాహరణకు, developer తన home development machine నుండి Session Manager service ద్వారా instance కు fully encrypted మరియు authenticated pipeline ద్వారా port forwarded ఉపయోగించి Test environment యొక్క database instance కు secure access కలిగి ఉండవచ్చు.
* **Centralized access:** Console మరియు IAM తో integration మీ operators కు వారికి ఎక్కడ నుండైనా అవసరమైన (మరియు authorized అయిన) remote access కలిగి ఉండటానికి అనుమతిస్తుంది.
* **తక్కువ "blast radius":** Inbound network ports lock చేయడం మరియు users role అవసరమైన nodes కు మాత్రమే centrally remote access restrict చేయడం ద్వారా ఏదైనా potential breach సృష్టించే "blast radius" ను మేము తగ్గిస్తున్నాము.

### IT Costs Optimize చేయడం

* **Bastion లేదా Jump Hosts అవసరం లేదు:** Session Manager మీ environment నుండి Bastion లేదా Jump Hosts ఉపయోగించాల్సిన అవసరాన్ని తొలగించగలదు - 24x7 instance cost తొలగించడం. ఇది SSH మరియు RDP inbound network ports open ఉన్న hosts ను, మీ environment లోని ఇతర nodes కు SSH మరియు RDP ద్వారా outbound access తో replace చేయడం అంటే. బదులుగా access మీ cloud environment యొక్క మిగిలిన భాగం వలె అదే mechanism ద్వారా - IAM - fine grained authorization మరియు target nodes మీద temporary credentials కు access అందించడం ద్వారా secure చేయబడుతుంది.
* **EC2 instances access చేయడానికి అదనపు charges లేవు**: EC2 కోసం ఇప్పటికే ఉన్న instance charges కంటే మీ EC2 nodes మరియు containers కు remote access అనుమతించడానికి Session Manager ఉపయోగించడానికి మరింత charge అవసరం లేదు.

### Session Manager ఎలా పనిచేస్తుంది?

![Session Manager](/img/cloudops/guides/centralized-operations-management/remote-and-session-management/BP-Remote-Session-Mgmt-7.png "Session Manager")

1. SSM agent node మీద install చేయబడాలి, Systems Manager service కు port 443 outbound మీద connectivity తో.
2. ఈ connection public service endpoint కు (అంటే internet ద్వారా) కావచ్చు లేదా VPC లో private endpoints ద్వారా connect అవ్వవచ్చు.
3. Network ద్వారా service కు connect అవ్వడానికి మరియు persistent connection establish చేయడానికి node కు సరైన privileges ఉన్న profile అవసరం.

**Note:** Default local user: `ssm-user.` Linux కోసం: /etc/sudoers మరియు Windows: Administrators group.

### Session Manager తో connection establish చేయడం

![Session Manager](/img/cloudops/guides/centralized-operations-management/remote-and-session-management/BP-Remote-Session-Mgmt-8.png "Session Manager")

1. User ఆ node కు remotely connect అవ్వాలనుకుంటే user node తో "Start Session" attempt చేయాలి.
2. Session Manager user ఆ particular EC2 instance మీద "Start Session" చేయడానికి allowed అయ్యాడో అని check చేస్తుంది.
3. IAM User/Principal యొక్క privileges check చేస్తుంది.
4. Node కు AWS Systems Manager కు దాని persistent connection ద్వారా authorized connection request గురించి తెలియజేయబడుతుంది.
5. Node AWS Session Manager service ద్వారా request user కు encrypted tunnel back establish చేస్తుంది.

### Session Manager Preferences

Session Manager preferences ఆ account లో Region level వద్ద session manager preferences configure చేయడానికి place అందిస్తుంది. ఏవైనా changes ఆ account/Region లోని అన్ని sessions కు apply అవుతాయి, setting override చేయబడితే తప్ప (ఉదా. command line నుండి specific setting pass చేయడం ద్వారా.)

* **Session duration/timeout**: AWS Session Manager session కోసం minimum duration 1 నిమిషం, మరియు maximum 1,440 నిమిషాలు (24-hours). Maximum duration తో పాటు కనీసం 1 నిమిషం మరియు maximum 60-నిమిషాల inactivity period తర్వాత session ను end చేయడానికి Idle Session Timeout configure చేయవచ్చు.
* **Session encryption settings**: Client machines మరియు managed nodes మధ్య transmit చేయబడిన data కు అదనపు protection అందించడానికి AWS KMS key encryption. కొన్ని System Manager features (ఉదా. reset node user password) AWS KMS encryption ఉండాలని అవసరం.
* **Linux/MacOS కోసం Run As support:** Run As feature AWS Systems Manager Session Manager managed node మీద create చేయగల system-generated ssm-user account credentials బదులు specified operating system user credentials ఉపయోగించి sessions start చేయడం సాధ్యం చేస్తుంది (అయితే RunAs Linux మరియు MacOS nodes కోసం మాత్రమే అందుబాటులో ఉంటుంది).
* **Audit మరియు reporting కోసం Session logging**: Session Manager ను session history logs Amazon Simple Storage Service (Amazon S3) bucket లేదా Amazon CloudWatch Logs log group కు create మరియు send చేయడానికి configure చేయండి. Store చేయబడిన log data తర్వాత మీ managed nodes కు చేయబడిన session connections మరియు sessions సమయంలో వాటి మీద run చేయబడిన commands ను audit లేదా report చేయడానికి ఉపయోగించవచ్చు.
* **Shell profiles/preferences**: Customizable profiles sessions లో shell preferences, environment variables, working directories, మరియు session start అయినప్పుడు multiple commands run చేయడం వంటి preferences నిర్వచించడానికి మిమ్మల్ని అనుమతిస్తాయి.

### Session Encryption

* Sessions default గా TLS 1.2 తో encrypted అవుతాయి
  * KMS keys ఉపయోగించి మీరు additional layer of encryption enable చేయవచ్చు
* కొన్ని Fleet Manager actions, password resets వంటివి, KMS encryption enable చేయడం అవసరం
* KMS తో encrypted Sessions session start అయిన తర్వాత message display చేయబడతాయి

**Note:** KMS తో extra layer of encryption add చేయడానికి, మీరు preference setting కు KMS encryption key add చేయాలి. Session Manager ఉపయోగించడానికి managed node మరియు user ఇద్దరికీ IAM permissions అవసరం. KMS encryption add చేయడం node మరియు user కు assign చేయాల్సిన privileges పెరుగుతాయి.

### Session Logging

Preferences settings లో, మీరు session logging enable చేయవచ్చు. Session logs అనేవి terminal session సమయంలో issue చేయబడిన అన్ని commands మరియు results యొక్క recording. మీరు వాటిని CloudWatch లేదా S3 లేదా రెండింటికీ send చేయవచ్చు.

ఇది encrypted log groups మరియు S3 buckets ఉపయోగించడానికి మిమ్మల్ని అనుమతిస్తుంది. ఈ resources యొక్క actual encryption settings CloudWatch మరియు S3 లో జరుగుతాయి. S3 buckets మరియు CW log groups కు access EC2 Instance Profile కు "s3:GetEncryptionConfiguration" వంటి privileges తో grant చేయబడాలి. CloudWatch logging కోసం, మీరు logs enter చేయబడినప్పుడు stream చేయవచ్చు (ఇది recommended option) లేదా session ముగింపులో logs send చేయవచ్చు.

**Note:** మీ Windows Server managed nodes లో **PowerShell Transcription** policy setting configured ఉంటే, మీరు session data ను CloudWatch లేదా S3 కు stream చేయ ***లేరు***. మరియు మీరు Linux లేదా macOS managed nodes ఉపయోగిస్తుంటే, screen utility installed అయ్యిందని నిర్ధారించుకోండి. అది లేకపోతే, మీ log data truncated అవ్వవచ్చు.

* CloudWatch logging Session Manager ను audit purposes కోసం ప్రతి command issued మరియు user కు display చేయబడిన results ను CloudWatch లో record చేయడానికి అనుమతిస్తుంది. ఈ information (మరియు CloudTrail కు record చేయబడిన Session Manager events) ఉపయోగించి customer IAM identity ను server మీద ssm-user local user ఉపయోగించి run చేయబడిన commands కు link చేయవచ్చు.
  * Streamed logs json format లో store చేయబడతాయి
* AWS Systems Manager Session Manager యొక్క "Session History" tab individual Session Manager session నుండి session యొక్క CloudWatch logs లేదా S3 record కు direct link అందిస్తుంది.
* Session logging record చేయడానికి SSM, CloudWatch మరియు S3 కు required permissions ఉన్న అవసరమైన IAM role ఉందని మీరు నిర్ధారించుకోవాలి.

మరింత సమాచారం కోసం, [Getting started creating an IAM role with permissions for Session Manager and Amazon S3 and CloudWatch Logs](https://docs.aws.amazon.com/systems-manager/latest/userguide/getting-started-create-iam-instance-profile.html#create-iam-instance-profile-ssn-logging) సందర్శించండి.

### Session preferences ఎలా apply అవుతాయి

* SSM-SessionManagerRunShell document అందించిన settings తో create చేయబడి ఆ region లో account కు apply చేయబడుతుంది
* Custom preferences SessionManagerRunShell.json ఉపయోగించి configure చేయవచ్చు మరియు తర్వాత json file pass చేసి SSM-SessionManagerRunShell document create చేయవచ్చు
* SessionManagerRunShell.json file update చేసి SSM-SessionManagerRunShell document update చేయడానికి Update-document API run చేయడం ద్వారా preferences update చేయండి

Session preferences గురించి మరింత సమాచారం కోసం, [Getting started with configuring preference](https://docs.aws.amazon.com/systems-manager/latest/userguide/getting-started-configure-preferences-cli.html) సందర్శించండి.

### Session Manager ఉపయోగించి instance కు connect అవ్వడానికి వివిధ మార్గాలు ఏమిటి?

1. **Standard Session:** EC2 console (Connect to Instance) లేదా Fleet Manager (Start terminal Session) నుండి connect అవ్వండి లేదా రెండు consoles లో Windows కోసం RDP ద్వారా connect అవ్వడం ఎంచుకోవచ్చు.
    1. Standard Session terminal command line session open చేస్తుంది. Linux కోసం, ఇది shell open చేస్తుంది మరియు windows కోసం, ఇది powershell session open చేస్తుంది.
    2. Instance మీద మొదటిసారి session start అయినప్పుడు ssm-user create అవుతుంది. మరియు windows లో Admin group కు మరియు linux లో sudoers కు automatically add అవుతుంది.

**Note:** User delete చేయబడితే, SSM agent దానిని recreate చేయదు మరియు session manager connect అవ్వడం fail అవుతుంది.

1. **SSH:** SSH tunnels local port కు చేయబడిన connections ను secure channel ద్వారా remote machine కు forward చేయడానికి అనుమతిస్తాయి.
    1. AWS CLI ద్వారా మాత్రమే
    1. SSH key అవసరం
        1. SCP ద్వారా files copy చేయడం enable చేస్తుంది
    1. SSH configuration file modify చేయండి
    1. Logging
        1. Session command logging లేదు
        1. పరిమితం: Session History, CloudTrail

పరిమితులు: Session commands log చేయబడవు. ఎందుకంటే SSH అన్ని session data ను encrypt చేస్తుంది, మరియు Session Manager SSH connections కోసం tunnel గా మాత్రమే పనిచేస్తుంది. Sessions చూడటానికి మీరు Session History మరియు CloudTrail ఉపయోగించవచ్చు.

![Session Manager](/img/cloudops/guides/centralized-operations-management/remote-and-session-management/BP-Remote-Session-Mgmt-10.png "Session Manager")

1. **Port forwarding:**
    1. AWS CLI మరియు session manager plugin ద్వారా మాత్రమే
        1. CloudShell తో సహా!
    1. Tunneling use case enable చేస్తుంది
        1. EC2, RDS, Fargate, ElastiCache కు Tunnel
    1. Fleet Manager ద్వారా RDP enable చేస్తుంది
        1. Logging
        1. Session command logging లేదు
        1. పరిమితం: Session History & CloudTrail

**Note:** Port forwarding లేదా SSH ద్వారా connect అయ్యే Session Manager sessions కోసం Logging అందుబాటులో లేదు. ఎందుకంటే SSH అన్ని session data ను encrypt చేస్తుంది, మరియు Session Manager SSH connections కోసం tunnel గా మాత్రమే పనిచేస్తుంది.

portNumber కోసం మీరు specify చేసే value managed node మీద traffic redirect చేయబడాల్సిన remote port ను represent చేస్తుంది, 80 వంటిది. ఈ parameter specify చేయకపోతే, Session Manager 80 ను default remote port గా assume చేస్తుంది.

localPortNumber కోసం మీరు specify చేసే value client మీద traffic redirect చేయబడాల్సిన local port ను represent చేస్తుంది, 56789 వంటిది. Managed node కు connect అవ్వడానికి client ఉపయోగించేటప్పుడు మీరు enter చేసేది ఇది. ఉదాహరణకు, localhost:56789.

![Session Manager](/img/cloudops/guides/centralized-operations-management/remote-and-session-management/BP-Remote-Session-Mgmt-11.png "Session Manager")

### Standard Sessions కోసం Access Restrict చేయడం

IAM అందించే least privilege principal ఉపయోగించి మీ nodes కు access control చేయడానికి రెండు elements ఉన్నాయి.
Session Manager ఉపయోగించే user account instance మీద ఏమి చేయడానికి allowed అనేదాన్ని మీరు restrict చేయవచ్చు లేదా IAM principal of the user ఏ instances తో session start చేయడానికి allowed అనేదాన్ని restrict చేయవచ్చు.

Windows managed nodes తో, users ఏదైనా available windows user ఉపయోగించి RDP sessions ద్వారా connect అవ్వవచ్చు (ఉదా. node domain connected ఉంటే AD user). అయితే, users Terminal Session ఉపయోగించి connect అవుతుంటే అప్పుడు ఏకైక option ssm-user. Windows node మీద ssm-user ఏమి చేయగలదో restrict చేయడానికి, admin/ user ssm-user member ఉన్న groups ను మార్చవచ్చు (default గా ఇది Administrators group member).

Linux managed nodes తో, user terminal session connect అయ్యే user ను మార్చడానికి "Run As" preference configure చేయవచ్చు. Default గా ఇది sudo-er privileges ఉన్న ssm-user. "Run As" ఉపయోగించి user ssm-user ను different default user కు మార్చవచ్చు.

ప్రత్యామ్నాయంగా, IAM user role మీద ఆ tag value ఆధారంగా ఏ user connect అవ్వగలరో determine చేయడానికి ఉపయోగించే tag specify చేయవచ్చు.

**Note:** మీరు IAM Identity Center మరియు permission sets ఉపయోగించి user access control చేస్తుంటే మరియు IAM Identity Centre user tag set చేయలేకపోతే, ఆ users కోసం Run As తక్కువ flexible అవుతుంది.

![Session Manager](/img/cloudops/guides/centralized-operations-management/remote-and-session-management/BP-Remote-Session-Mgmt-9.png "Session Manager")

### EC2 Instance Connect గురించి?

Session Manager outbound authenticated మరియు authorized link ద్వారా AWS Session Manager కు nodes కు remote connections secure మరియు simplify చేయడం గురించి అయితే, "EC2 Instance Connect" EC2 Linux hosts కు inbound SSH connections simplify చేయడం గురించి.

EC2 Instance Connect EC2 meta-data service ద్వారా instance తో share చేయబడిన short-lived SSH keys generate మరియు use చేయడం ద్వారా SSH management ను simplify చేస్తుంది. ఇది remote connection attempt చేసే user కు port 22 మీద inbound network access ఉండాలని అవసరం మరియు చివరగా EC2 Instance Connect Session Manager cross-platform మరియు cross-cloud work చేయడంతో పోలిస్తే EC2 లో run అవుతున్న Linux hosts కు మాత్రమే apply అవుతుంది.

## Fleet Manager

Fleet Manager ఒక account లో ఒక Region లో అన్ని nodes కోసం unifying console అందిస్తుంది (మరియు ఇతర Regions లో similar view కోసం మీరు Regions మార్చవచ్చు). System Manager కు connected అయ్యారా, agent version మొదలైన meta-data మీరు చూడవచ్చు. Unified console లో common administration tasks platforms అంతటా నిర్వహించడానికి operator ను అనుమతించడం system administrator efficiency ను మెరుగుపరుస్తుంది.

![Fleet Manager](/img/cloudops/guides/centralized-operations-management/remote-and-session-management/BP-Remote-Session-Mgmt-12.png "Fleet Manager")

### Fleet Manager కోసం use cases

* మీ managed nodes కు manually connect అవ్వాల్సిన అవసరం లేకుండా అనేక సాధారణ systems administration tasks నిర్వహించండి.
* Servers ను remotely manage చేయడానికి Centralized UI: మీరు వేర్వేరు platform instances ను వాటి state, SSM agent status, platform తో చూడవచ్చు. Management purpose కోసం UI నుండి report download చేయవచ్చు.
  * Single unified console నుండి బహుళ platforms మీద run అవుతున్న nodes ను manage చేయండి.
  * Single unified console నుండి వేర్వేరు operating systems run అవుతున్న nodes ను manage చేయండి.
* మీ systems administration efficiency మెరుగుపరచండి.

### Fleet Manager nodes తో ఎలా interact చేస్తుంది?

Fleet Manager ```AWSFleetManager-*``` తో prefix చేయబడిన documents ను invoke చేస్తుంది. Documents results get చేయడానికి మరియు Fleet Manager console లో display చేయడానికి Run Command లేదా Session Manager ఉపయోగిస్తాయి.

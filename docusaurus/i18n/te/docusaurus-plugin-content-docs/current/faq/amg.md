# Amazon Managed Grafana - FAQ

## నేను Amazon Managed Grafana ను ఎందుకు ఎంచుకోవాలి?

**[అధిక లభ్యత](https://docs.aws.amazon.com/grafana/latest/userguide/disaster-recovery-resiliency.html)**: Amazon Managed Grafana వర్క్‌స్పేస్‌లు multi-az రెప్లికేషన్‌తో అధిక లభ్యతను కలిగి ఉంటాయి. Amazon Managed Grafana వర్క్‌స్పేస్‌ల ఆరోగ్యాన్ని నిరంతరం పర్యవేక్షిస్తుంది మరియు వర్క్‌స్పేస్‌ల ప్రాప్యతను ప్రభావితం చేయకుండా అనారోగ్య నోడ్‌లను భర్తీ చేస్తుంది. Amazon Managed Grafana కంప్యూట్ మరియు డేటాబేస్ నోడ్‌ల లభ్యతను నిర్వహిస్తుంది కాబట్టి కస్టమర్లు నిర్వహణ & మెయింటెనెన్స్ కోసం అవసరమైన ఇన్‌ఫ్రాస్ట్రక్చర్ రిసోర్స్‌లను నిర్వహించాల్సిన అవసరం లేదు.

**[డేటా భద్రత](https://docs.aws.amazon.com/grafana/latest/userguide/security.html)**: Amazon Managed Grafana ఎలాంటి ప్రత్యేక కాన్ఫిగరేషన్, థర్డ్-పార్టీ టూల్స్, లేదా అదనపు ఖర్చు లేకుండా విశ్రాంతిలో ఉన్న డేటాను ఎన్‌క్రిప్ట్ చేస్తుంది. [రవాణాలో ఉన్న డేటా](https://docs.aws.amazon.com/grafana/latest/userguide/infrastructure-security.html) కూడా TLS ద్వారా ఎన్‌క్రిప్ట్ చేయబడుతుంది.

## ఏ AWS రీజియన్‌లు మద్దతిస్తాయి?

ప్రస్తుతం మద్దతు ఉన్న రీజియన్‌ల జాబితా [డాక్యుమెంటేషన్‌లోని Supported Regions విభాగంలో](https://docs.aws.amazon.com/grafana/latest/userguide/what-is-Amazon-Managed-Service-Grafana.html#AMG-supported-Regions) అందుబాటులో ఉంది.

## మా Organization లో బహుళ రీజియన్‌లలో బహుళ AWS ఖాతాలు ఉన్నాయి, Amazon Managed Grafana ఈ దృశ్యాలకు పనిచేస్తుందా?

Amazon Managed Grafana [AWS Organizations](https://docs.aws.amazon.com/organizations/latest/userguide/orgs_introduction.html) తో ఏకీకృతమై Organizational Units (OUs) లో AWS ఖాతాలు మరియు రిసోర్స్‌లను కనుగొంటుంది. AWS Organizations తో కస్టమర్లు బహుళ AWS ఖాతాల కోసం [డేటా సోర్స్ కాన్ఫిగరేషన్ మరియు అనుమతి సెట్టింగ్‌లను కేంద్రీకృతంగా నిర్వహించగలరు](https://docs.aws.amazon.com/grafana/latest/userguide/AMG-and-Organizations.html).

## Amazon Managed Grafana లో ఏ డేటా సోర్స్‌లు మద్దతిస్తాయి?

డేటా సోర్స్‌లు అనేవి Amazon Managed Grafana లో డాష్‌బోర్డ్‌లను నిర్మించడానికి కస్టమర్లు క్వెరీ చేయగల స్టోరేజ్ బ్యాక్‌ఎండ్‌లు. Amazon Managed Grafana Amazon CloudWatch, Amazon OpenSearch Service, AWS IoT SiteWise, AWS IoT TwinMaker, Amazon Managed Service for Prometheus, Amazon Timestream, Amazon Athena, Amazon Redshift, AWS X-Ray మరియు అనేక ఇతర AWS నేటివ్ సేవలతో సహా [30+ బిల్ట్-ఇన్ డేటా సోర్స్‌లను](https://docs.aws.amazon.com/grafana/latest/userguide/AMG-data-sources-builtin.html) మద్దతిస్తుంది. అదనంగా, Grafana Enterprise లో అప్‌గ్రేడ్ చేయబడిన వర్క్‌స్పేస్‌ల కోసం [సుమారు 15+ ఇతర డేటా సోర్స్‌లు](https://docs.aws.amazon.com/grafana/latest/userguide/AMG-data-sources-enterprise.html) కూడా అందుబాటులో ఉన్నాయి.

## నా వర్క్‌లోడ్‌ల డేటా సోర్స్‌లు ప్రైవేట్ VPC లలో ఉన్నాయి. వాటిని Amazon Managed Grafana కు సురక్షితంగా ఎలా కనెక్ట్ చేయాలి?

[VPC లోని](https://docs.aws.amazon.com/grafana/latest/userguide/AMG-configure-vpc.html) ప్రైవేట్ డేటా సోర్స్‌లను ట్రాఫిక్‌ను సురక్షితంగా ఉంచడానికి AWS PrivateLink ద్వారా Amazon Managed Grafana కు కనెక్ట్ చేయవచ్చు. [VPC ఎండ్‌పాయింట్‌ల](https://docs.aws.amazon.com/grafana/latest/userguide/AMG-configure-nac.html) నుండి Amazon Managed Grafana సేవకు మరింత యాక్సెస్ కంట్రోల్‌ను [Amazon VPC ఎండ్‌పాయింట్‌ల](https://docs.aws.amazon.com/whitepapers/latest/aws-privatelink/what-are-vpc-endpoints.html) కోసం [IAM రిసోర్స్ పాలసీ](https://docs.aws.amazon.com/grafana/latest/userguide/VPC-endpoints.html#controlling-vpc) ను అటాచ్ చేయడం ద్వారా పరిమితం చేయవచ్చు.

## Amazon Managed Grafana లో ఏ యూజర్ ఆథెంటికేషన్ మెకానిజం అందుబాటులో ఉంది?

Amazon Managed Grafana వర్క్‌స్పేస్‌లో, Security Assertion Markup Language 2.0 (SAML 2.0) లేదా AWS IAM Identity Center (AWS Single Sign-On కి వారసుడు) కు మద్దతిచ్చే ఏదైనా IDP ని ఉపయోగించి [యూజర్‌లు Grafana కన్సోల్‌కు ఆథెంటికేట్ చేయబడతారు](https://docs.aws.amazon.com/grafana/latest/userguide/authentication-in-AMG.html).

> సంబంధిత బ్లాగ్: [Grafana Teams ఉపయోగించి Amazon Managed Grafana లో ఫైన్-గ్రేన్డ్ యాక్సెస్ కంట్రోల్](https://aws.amazon.com/blogs/mt/fine-grained-access-control-in-amazon-managed-grafana-using-grafana-teams/)

## Amazon Managed Grafana కోసం ఎలాంటి ఆటోమేషన్ సపోర్ట్ అందుబాటులో ఉంది?

Amazon Managed Grafana [AWS CloudFormation తో ఏకీకృతమై](https://docs.aws.amazon.com/grafana/latest/userguide/creating-resources-with-cloudformation.html) ఉంటుంది, ఇది కస్టమర్లకు AWS రిసోర్స్‌లను మోడలింగ్ చేయడంలో మరియు సెట్ చేయడంలో సహాయపడుతుంది. [AWS CloudFormation](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/Welcome.html) తో కస్టమర్లు Amazon Managed Grafana రిసోర్స్‌లను స్థిరంగా మరియు పునరావృతంగా సెట్ చేయడానికి టెంప్లేట్‌లను మళ్ళీ ఉపయోగించుకోవచ్చు. Amazon Managed Grafana కు [API](https://docs.aws.amazon.com/grafana/latest/APIReference/Welcome.html) కూడా అందుబాటులో ఉంది, ఇది [AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-welcome.html) ద్వారా ఆటోమేట్ చేయడంలో లేదా సాఫ్ట్‌వేర్/ఉత్పత్తులతో ఏకీకరించడంలో కస్టమర్లకు సహాయపడుతుంది. Amazon Managed Grafana వర్క్‌స్పేస్‌లకు ఆటోమేషన్ మరియు ఇంటిగ్రేషన్ సపోర్ట్ కోసం [HTTP APIs](https://docs.aws.amazon.com/grafana/latest/userguide/Using-Grafana-APIs.html) ఉన్నాయి.

> సంబంధిత బ్లాగ్: [Amazon Managed Grafana కోసం ప్రైవేట్ VPC డేటా సోర్స్ సపోర్ట్ ప్రకటన](https://aws.amazon.com/blogs/mt/announcing-private-vpc-data-source-support-for-amazon-managed-grafana/)

## మా Organization ఆటోమేషన్ కోసం Terraform ఉపయోగిస్తుంది. Amazon Managed Grafana Terraform ను మద్దతిస్తుందా?
అవును, [Amazon Managed Grafana](https://aws-observability.github.io/observability-best-practices/recipes/recipes/amg-automation-tf/) [ఆటోమేషన్](https://registry.terraform.io/modules/terraform-aws-modules/managed-service-grafana/aws/latest) కోసం Terraform ను మద్దతిస్తుంది

> ఉదాహరణ: [Terraform సపోర్ట్ కోసం రిఫరెన్స్ ఇంప్లిమెంటేషన్](https://github.com/aws-observability/terraform-aws-observability-accelerator/tree/main/examples/managed-grafana-workspace)

## నా ప్రస్తుత Grafana సెటప్‌లో సాధారణంగా ఉపయోగించే డాష్‌బోర్డ్‌లను ఉపయోగిస్తున్నాను. వాటిని మళ్ళీ రీ-క్రియేట్ చేయకుండా Amazon Managed Grafana లో ఉపయోగించే మార్గం ఉందా?

Amazon Managed Grafana [HTTP APIs](https://docs.aws.amazon.com/grafana/latest/userguide/Using-Grafana-APIs.html) ను మద్దతిస్తుంది, ఇవి డాష్‌బోర్డ్‌లు, యూజర్‌లు మరియు మరిన్నింటి డిప్లాయ్‌మెంట్ మరియు నిర్వహణను సులభంగా ఆటోమేట్ చేయడానికి అనుమతిస్తాయి. ఈ రిసోర్స్‌ల నిర్వహణను ఆటోమేట్ చేయడానికి మీ GitOps/CICD ప్రాసెస్‌లలో ఈ API లను ఉపయోగించవచ్చు.

## Amazon Managed Grafana అలర్ట్‌లను మద్దతిస్తుందా?

[Amazon Managed Grafana అలర్టింగ్](https://docs.aws.amazon.com/grafana/latest/userguide/alerts-overview.html) కస్టమర్లకు బలమైన మరియు చర్య తీసుకోగల అలర్ట్‌లను అందిస్తుంది, ఇవి సిస్టమ్‌లలో సమస్యల గురించి దాదాపు నిజ సమయంలో తెలుసుకోవడంలో సహాయపడతాయి, సేవలకు అంతరాయాన్ని తగ్గిస్తాయి. Grafana అప్‌డేట్ చేయబడిన అలర్టింగ్ సిస్టమ్‌కు ప్రాప్యతను కలిగి ఉంటుంది, ఇది ఒకే, శోధించగల వ్యూలో అలర్టింగ్ సమాచారాన్ని కేంద్రీకరిస్తుంది.

## మా Organization లో అన్ని చర్యలు ఆడిట్‌ల కోసం రికార్డ్ చేయబడాలి. Amazon Managed Grafana ఈవెంట్‌లను రికార్డ్ చేయవచ్చా?

Amazon Managed Grafana [AWS CloudTrail](https://docs.aws.amazon.com/awscloudtrail/latest/userguide/cloudtrail-user-guide.html) తో ఏకీకృతమై ఉంటుంది, ఇది Amazon Managed Grafana లో యూజర్, రోల్, లేదా AWS సేవ ద్వారా తీసుకున్న చర్యల రికార్డును అందిస్తుంది. CloudTrail Amazon Managed Grafana కోసం అన్ని [API కాల్‌లను ఈవెంట్‌లుగా](https://docs.aws.amazon.com/grafana/latest/userguide/logging-using-cloudtrail.html) క్యాప్చర్ చేస్తుంది. క్యాప్చర్ చేయబడిన కాల్‌లలో Amazon Managed Grafana కన్సోల్ నుండి కాల్‌లు మరియు Amazon Managed Grafana API ఆపరేషన్‌లకు కోడ్ కాల్‌లు ఉన్నాయి.

## అదనపు సమాచారం ఎక్కడ అందుబాటులో ఉంది?

Amazon Managed Grafana పై అదనపు సమాచారం కోసం కస్టమర్లు AWS [డాక్యుమెంటేషన్](https://docs.aws.amazon.com/grafana/latest/userguide/what-is-Amazon-Managed-Service-Grafana.html) చదవగలరు, [Amazon Managed Grafana](https://catalog.workshops.aws/observability/en-US/aws-managed-oss/amg) పై AWS Observability Workshop ను చూడగలరు మరియు [ఫీచర్లు](https://aws.amazon.com/grafana/features/?nc=sn&loc=2), [ధరలు](https://aws.amazon.com/grafana/pricing/?nc=sn&loc=3), తాజా [బ్లాగ్ పోస్ట్‌లు](https://aws.amazon.com/grafana/resources/?nc=sn&loc=4&msg-blogs.sort-by=item.additionalFields.createdDate&msg-blogs.sort-order=desc#Latest_blog_posts) మరియు [వీడియోలు](https://aws.amazon.com/grafana/resources/?nc=sn&loc=4&msg-blogs.sort-by=item.additionalFields.createdDate&msg-blogs.sort-order=desc#Videos) తెలుసుకోవడానికి [ఉత్పత్తి పేజీ](https://aws.amazon.com/grafana/) ని కూడా చూడగలరు.

**ఉత్పత్తి FAQ:** [https://aws.amazon.com/grafana/faqs/](https://aws.amazon.com/grafana/faqs/)

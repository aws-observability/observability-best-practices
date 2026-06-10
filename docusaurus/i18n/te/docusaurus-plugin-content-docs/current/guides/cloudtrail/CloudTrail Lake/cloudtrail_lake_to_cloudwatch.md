---
sidebar_position: 3
---

# CloudTrail Lake నుండి Amazon CloudWatch కు మైగ్రేట్ చేయడం

## అవలోకనం

ఈ గైడ్ AWS CloudTrail Lake నుండి Amazon CloudWatch కు మీ ప్రాథమిక CloudTrail event analysis destination గా మైగ్రేట్ చేయడానికి దశల వారీ విధానాన్ని అందిస్తుంది. ఇది structured three-phase migration ద్వారా మిమ్మల్ని నడిపిస్తుంది -- historical data export చేయడం, telemetry enablement rules ద్వారా కొత్త CloudTrail ingestion ఎనేబుల్ చేయడం, మరియు cross-account/cross-region centralization సెటప్ చేయడం -- తద్వారా మీరు CloudWatch Unified Data Store లో మీ ఇతర operational మరియు security telemetry తో CloudTrail activity ను ఏకీకృతం చేయవచ్చు. ఈ గైడ్ cost estimation, CloudTrail Lake SQL నుండి CloudWatch Logs Insights కు query translation, centralization pricing optimization, మీ log groups కోసం security best practices, మరియు near real-time security visibility కోసం dashboards నిర్మించడం కూడా కవర్ చేస్తుంది.

### ఎందుకు మైగ్రేట్ చేయాలి?

ఈ రోజు CloudTrail Lake ఉపయోగిస్తున్న సంస్థలు ఒక సాధారణ సవాలును ఎదుర్కొంటున్నాయి: CloudTrail data ఇతర operational మరియు security telemetry నుండి isolated గా ఉంటుంది, incident investigations నెమ్మదిగా మరియు అనేక tools మరియు query languages లో విచ్ఛిన్నం చేస్తుంది. [Amazon CloudWatch Unified Data Store](https://aws.amazon.com/blogs/aws/amazon-cloudwatch-introduces-unified-data-management-and-analytics-for-operations-security-and-compliance/) VPC Flow Logs, AWS WAF logs, application logs, మరియు third-party security data తో పాటు CloudTrail activity ను తీసుకువచ్చే centralized repository అందించడం ద్వారా దీన్ని పరిష్కరిస్తుంది -- [CloudWatch Logs Insights](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/AnalyzingLogData.html) మరియు [Amazon Athena](https://docs.aws.amazon.com/athena/latest/ug/what-is.html) మరియు [Amazon Redshift](https://docs.aws.amazon.com/redshift/latest/mgmt/welcome.html) వంటి Apache Iceberg-compatible tools ద్వారా correlated analysis ఎనేబుల్ చేస్తుంది.

### Migration యొక్క ప్రధాన ప్రయోజనాలు

1. **Unified telemetry**: CloudWatch unified data store ద్వారా ఒకే query interface లో AWS services (CloudTrail, VPC Flow Logs, WAF, Route 53, EKS, NLB, మరియు మరిన్ని), third-party sources (CrowdStrike, SentinelOne, Okta, Palo Alto Networks, మరియు ఇతరులు), మరియు custom application logs అంతటా logs ను correlate చేయండి.
2. **Automatic schema discovery**: CloudWatch స్వయంచాలకంగా dynamic log group discovery కోసం `@data_source_name` వంటి default facets తో CloudTrail fields ను కనుగొని index చేస్తుంది. మరిన్ని సమాచారం కోసం, [Data source discovery and management](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/data-source-discovery-management.html) చూడండి.
3. **Log group name dependency లేదు**: log group naming తో సంబంధం లేకుండా `SOURCE logGroups() | filterIndex @data_source_name in ["aws_cloudtrail"]` ఉపయోగించి అన్ని CloudTrail data query చేయండి.
4. **Native enrichment**: custom Lambda functions లేకుండా ingestion time లో security context, compliance tags, మరియు environment labels జోడించడానికి [CloudWatch Logs Transformation](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/CloudWatch-Logs-Transformation.html) ఉపయోగించండి.
5. **Cross-account/cross-region centralization**: security, compliance, మరియు incident response కోసం అన్ని accounts మరియు regions నుండి CloudTrail data ను ఒకే destination లో consolidate చేయండి. మరిన్ని సమాచారం కోసం, [Cross-account cross-Region log centralization](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/CloudWatchLogs_Centralization.html) చూడండి.
6. **ఒక platform, ఎక్కువ విలువ**: CloudWatch unified data store built-in normalization, మరియు cross-source correlation తో AWS logs, third-party security sources, మరియు custom application data ను ఒకే platform లో ఏకీకృతం చేయడం ద్వారా standalone query services కంటే మించి వెళ్తుంది.

### Three-Phase Migration విధానం

Migration structured three-phase approach ను అనుసరిస్తుంది:

![CloudTrail Lake Three-Phase Migration Approach](/img/cloudops/guides/cloudtrail-lake/cloudtrail_lake_to_cloudwatch/three-phase-migration-approach.png "CloudTrail Lake Three-Phase Migration Approach")

### Migration ఖర్చులు అంచనా వేయడం

మీరు CloudTrail Lake నుండి CloudWatch కు migrate చేసిన తర్వాత, కొత్త CloudTrail events నిరంతర ప్రాతిపదికన నేరుగా CloudWatch Logs లోకి ingest చేయబడతాయి. ఈ migration యొక్క ఖర్చు implications అర్థం చేసుకోవడం budget planning మరియు cost optimization కోసం ముఖ్యమైనది.

మీ projected monthly CloudWatch Logs ఖర్చు అంచనా వేయడానికి, CloudTrail service కోసం filter చేసి usage type ద్వారా group చేయడం ద్వారా **AWS Cost Explorer** లో మీ ప్రస్తుత CloudTrail Lake వినియోగాన్ని సమీక్షించండి. మీ event data store (ingestion bytes వంటివి) కోసం CloudTrail Lake usage types గుర్తించడానికి [Viewing your CloudTrail cost and usage with AWS Cost Explorer](https://docs.aws.amazon.com/awscloudtrail/latest/userguide/cloudtrail-costs.html) చూడండి. Cost Explorer ingestion value ను GB లో చూపిస్తుంది, CloudTrail delivery మరియు CloudWatch Logs ingestion కోసం తాజా [CloudWatch pricing](https://aws.amazon.com/cloudwatch/pricing/) ఉపయోగించి మీ CloudWatch Logs ingestion ఖర్చు అంచనా వేయడానికి దాన్ని ఉపయోగించవచ్చు.

:::info
గమనిక: ఈ అంచనా ingestion మరియు delivery ఖర్చులను మాత్రమే కవర్ చేస్తుంది మరియు storage మరియు queries వంటి CloudWatch Logs తో సంబంధిత ఏదైనా అదనపు ఖర్చును చేర్చదు.
:::

---

## Phase 1 -- CloudTrail Lake నుండి CloudWatch కు Historical Data Export చేయడం

మీ historical CloudTrail Lake data ను CloudWatch కు export చేయడం మీ audit trail యొక్క continuity నిర్ధారిస్తుంది మరియు historical మరియు కొత్త events అంతటా unified querying ఎనేబుల్ చేస్తుంది. ఈ phase మీ ఇప్పటికే ఉన్న Event Data Stores (EDS) నుండి CloudWatch Logs లోకి data move చేయడంపై దృష్టి పెడుతుంది.

### CloudTrail Lake Data ను CloudWatch కు Export చేయడం Export Execute చేయండి

1. [CloudTrail console](https://console.aws.amazon.com/cloudtrailv2/#/lake) కు నావిగేట్ చేయండి.
1. ఎడమ వైపు navigation menu లో, **Lake** ఎంచుకోండి.
1. **Event Data Stores** ఎంచుకోండి.
1. CloudTrail events కోసం మీ **Event Data Store** ఎంచుకోండి.
1. **Actions** dropdown నుండి, **Export to CloudWatch** ఎంచుకోండి.

    ![CloudTrail Lake Event Data Store Actions menu showing the Export to CloudWatch option.](/img/cloudops/guides/cloudtrail-lake/cloudtrail_lake_to_cloudwatch/cloudtrail_lake_to_cloudwatch_01.png "CloudTrail Lake Event Data Store Actions menu showing the Export to CloudWatch option.")

1. Event data store కోసం data export చేయడానికి **time range** ఎంచుకోండి.
1. మీ data ను export కోసం access చేయడానికి CloudTrail ఉపయోగించే కొత్త IAM role సృష్టించడానికి లేదా ఇప్పటికే ఉన్న IAM role అందించడానికి అందించిన instructions ఉపయోగించి **IAM role** configure చేయండి.
1. **Export** ఎంచుకోండి.

    ![Export to CloudWatch configuration screen showing time range selection and IAM role configuration.](/img/cloudops/guides/cloudtrail-lake/cloudtrail_lake_to_cloudwatch/cloudtrail_lake_to_cloudwatch_02.png "Export to CloudWatch configuration screen showing time range selection and IAM role configuration.")

:::info
Exported data Infrequent Access storage class ఉపయోగిస్తుంది, log information query చేయడానికి CloudWatch Logs Insights అవసరం. Infrequent Access storage తో సృష్టించబడిన Log groups console లో Log Streams లో export results నేరుగా చూపించవు. అదనంగా, 2023 కంటే ముందటి data CloudTrail Lake నుండి Amazon CloudWatch కు migrate చేయడం సాధ్యం కాదు. 2023 కంటే పాత events కు access అవసరమైతే, మీరు CloudTrail Lake లో నేరుగా query చేయడం కొనసాగించవచ్చు, లేదా data ను S3 bucket కు export చేయవచ్చు. మరిన్ని సమాచారం కోసం, [Exporting data from CloudTrail Lake Event Data Store to CloudWatch](https://docs.aws.amazon.com/awscloudtrail/latest/userguide/cloudtrail-lake-export-cloudwatch.html) documentation చూడండి మరియు AWS CloudTrail Lake events subset ను Amazon S3 కు export చేయడం కోసం, ఈ [AWS Blog](https://aws.amazon.com/blogs/mt/exporting-a-subset-of-aws-cloudtrail-lake-events-to-amazon-s3/) చూడండి.
:::

---

## Phase 2 -- Telemetry Enablement Rules ద్వారా కొత్త CloudTrail Ingestion ఎనేబుల్ చేయడం

మీ historical CloudTrail Lake data ఇప్పుడు CloudWatch లో అందుబాటులో ఉన్నందున, తదుపరి దశ కొత్త CloudTrail events నేరుగా [CloudWatch Unified Data Store](https://aws.amazon.com/blogs/aws/amazon-cloudwatch-introduces-unified-data-management-and-analytics-for-operations-security-and-compliance/) లోకి ingest చేయడం ప్రారంభించడం. ఈ దశ ఏదైనా ఇప్పటికే ఉన్న CloudTrail Trails లేదా CloudTrail Lake event data store నుండి స్వతంత్రమైనది. ఇది CloudTrail activity CloudWatch లోకి flow అయ్యే కొత్త, dedicated path ను ఏర్పాటు చేస్తుంది. CloudWatch యొక్క [telemetry configuration](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/telemetry-config-rules.html) capabilities ఉపయోగించి, మీరు CloudWatch ద్వారా నేరుగా CloudTrail events యొక్క automated ingestion సెటప్ చేయవచ్చు. ఎనేబుల్ చేసిన తర్వాత, ప్రతి కొత్త CloudTrail event మీ ఇతర operational మరియు security telemetry తో పాటు deliver చేయబడుతుంది, unified querying, alerting, మరియు analysis కోసం సిద్ధంగా ఉంటుంది.

### CloudTrail కోసం Telemetry Enablement Rule సృష్టించడం

1. [CloudWatch console](https://console.aws.amazon.com/cloudwatch/) తెరవండి.
1. ఎడమ navigation pane లో, **Ingestion** క్లిక్ చేయండి.
1. **Enable Resource Discovery** button క్లిక్ చేయండి.
1. CloudWatch అవసరమైన service-linked roles స్వయంచాలకంగా సృష్టిస్తుంది.
1. **Data Sources** tab లో, అందుబాటులో ఉన్న services జాబితాలో **AWS CloudTrail** గుర్తించండి.
1. **AWS CloudTrail** పక్కన **Configure telemetry** ఎంచుకోండి.
1. **Specify Scope** page లో, default **Rule name** వదిలి **Next** ఎంచుకోండి. (**గమనిక:** Organization-level rules కోసం, selection settings లో source account scope configure చేయవచ్చు).

    ![CloudWatch Telemetry config Enablement rules tab showing the Add rule wizard for CloudTrail.](/img/cloudops/guides/cloudtrail-lake/cloudtrail_lake_to_cloudwatch/cloudtrail_lake_to_cloudwatch_03.png "CloudWatch Telemetry config Enablement rules tab showing the Add rule wizard for CloudTrail.")

1. **Specify Destination** page లో, కింది దశలు నిర్వహించండి:
    -   **Send to** కోసం, default CloudWatch Logs గా వదిలండి.
    -   **Log group name pattern** కోసం, default `aws/cloudtrail/[event-type]` వదిలండి.
    -   **Retention period** కోసం, మీ compliance అవసరాల ప్రకారం retention period ఎంచుకోండి. (**గమనిక:** CloudWatch to CloudTrail integration logs నేరుగా member accounts కు deliver చేస్తుంది. మీరు ఇక్కడ configure చేసిన retention period ప్రతి member account లోని log groups కు వర్తిస్తుంది. Retention period source log group మరియు centralized log group నుండి భిన్నంగా ఉండవచ్చు. అదనపు సమాచారం కోసం, [Optimizing log storage costs for CloudWatch Logs centralization](/guides/cloudtrail/CloudTrail%20Lake/cloudtrail_lake_to_cloudwatch#optimizing-log-storage-costs-for-cloudwatch-logs-centralization) విభాగం చూడండి)
1. **Next** ఎంచుకోండి.

    ![CloudWatch Telemetry config Enablement rules tab showing the Specify destination section for CloudTrail.](/img/cloudops/guides/cloudtrail-lake/cloudtrail_lake_to_cloudwatch/cloudtrail_lake_to_cloudwatch_04.png "CloudWatch Telemetry config Enablement rules tab showing the Specify destination section for CloudTrail.")

1. **Select Data Options** page లో, **Event type** కోసం, మీరు ఏ events ingest చేయాలనుకుంటున్నారో ఎంచుకోండి -- **Management events** లేదా **Data events**.

    ![CloudWatch Telemetry config Enablement rules tab showing the Select data options for CloudTrail.](/img/cloudops/guides/cloudtrail-lake/cloudtrail_lake_to_cloudwatch/cloudtrail_lake_to_cloudwatch_05.png "CloudWatch Telemetry config Enablement rules tab showing the Select data options for CloudTrail.")

1. **Next** ఎంచుకోండి.
1. **Review and Create** page లో, configuration settings సమీక్షించి **Configure CloudTrail enablement** ఎంచుకోండి.

CloudTrail events ingestion ప్రారంభించడానికి Telemetry configuration rules సృష్టించబడతాయి. తర్వాత క్రింది naming pattern తో Log groups సృష్టించబడతాయి.

| Event Type        | Log Group Name Pattern              | వివరణ          |
|-------------------|-------------------------------------|----------------------|
| Management Events | `aws/cloudtrail/managementevents`  | అన్ని management events |
| Data Events       | `aws/cloudtrail/dataevents`        | అన్ని data events       |

### CloudTrail Ingestion Validate చేయడం

CloudWatch లోకి direct CloudTrail ingestion ఎనేబుల్ చేసిన తర్వాత, మీ CloudTrail Lake event data store మరియు మీ CloudWatch కోసం CloudTrail ingestion రెండింటినీ parallel లో రన్ చేయడం పరిగణించండి. అన్ని CloudTrail events ఆశించిన విధంగా capture అవుతున్నాయని confirm చేయడానికి కనీసం ఒక రోజు పాటు రన్ చేయడం ద్వారా మీ CloudWatch ingestion validate చేయండి. మీ validation కు ఎక్కువ సమయం అవసరమైతే, రెండు services parallel లో రన్ చేయడం వల్ల ఉండే potential ఖర్చు సమీక్షించండి మరియు ముందుకు వెళ్లడానికి ముందు మీ AWS account team ను సంప్రదించండి. విజయవంతమైన validation తర్వాత, మీరు మీ CloudTrail Lake event data store లో ingestion ఆపవచ్చు.

:::info
మరిన్ని సమాచారం కోసం, [Working with telemetry enablement rules](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/telemetry-config-rules.html) మరియు [Simplified enablement of CloudTrail events in CloudWatch](https://aws.amazon.com/about-aws/whats-new/2025/12/key-enhancements-cloudtrail-events-cloudwatch/) చూడండి.
:::

---

## Phase 3 -- Cross-Account/Cross-Region Centralization సెటప్ చేయడం

మీరు మీ historical CloudTrail Lake data ను CloudWatch లోకి migrate చేసారు, telemetry enablement rules తో CloudTrail ingestion ఎనేబుల్ చేసారు మరియు ఇప్పుడు unified monitoring, analysis, మరియు compliance కోసం centralized account లో అన్నింటినీ కలపడానికి సమయం.

ప్రతి individual account లో CloudWatch Unified Data Store లోకి CloudTrail data flow అవడం ఒక మొదటి దశ, కానీ అన్ని CloudTrail activity ను ఒకే destination account లో centralize చేయడం మీ security teams, compliance teams, మరియు incident responders కు మీ మొత్తం AWS Organization అంతటా అన్ని API activity యొక్క unified view అందిస్తుంది -- security monitoring మరియు incident response కోసం ఒకే pane of glass.

[CloudWatch Logs cross-account cross-region centralization](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/CloudWatchLogs_Centralization.html) centralization rules ఉపయోగించి అనేక member accounts నుండి ఒక central location లోకి log data collect చేయడానికి [AWS Organizations](https://docs.aws.amazon.com/organizations/latest/userguide/orgs_introduction.html) తో integrate అవుతుంది. మీరు అనేక accounts మరియు AWS Regions నుండి మీ centralized account లోకి log data ను స్వయంచాలకంగా replicate చేసే rules define చేస్తారు.

ప్రతి member account local access మరియు troubleshooting కోసం తన సొంత logs copy ను నిలుపుకుంటుంది, మీ central security మరియు compliance teams organization-wide visibility మరియు analysis కోసం తమ సొంత consolidated copy అందుకుంటాయి.

### Centralization Architecture అర్థం చేసుకోవడం

![CloudWatch Centralization Architecture](/img/cloudops/guides/cloudtrail-lake/cloudtrail_lake_to_cloudwatch/LogsCentralization.png "CloudWatch Centralization Architecture")

### Centralization కోసం Prerequisites

- **[AWS Organizations](https://docs.aws.amazon.com/organizations/latest/userguide/orgs_introduction.html)** సెటప్ చేయబడి ఉండాలి మరియు అన్ని source/destination accounts organization కు చెందాలి
- AWS Organizations లో CloudWatch కోసం **[Trusted access](https://docs.aws.amazon.com/organizations/latest/userguide/orgs_integrate_services.html)** ఎనేబుల్ చేయబడాలి

### Centralization Rule సృష్టించడం

1. Organization యొక్క **Management** లేదా **Delegated Administrator** account లో [**CloudWatch console**](https://console.aws.amazon.com/cloudwatch/home) కు నావిగేట్ చేయండి.
2. **Settings** ఎంచుకోండి.
3. **Organization** tab కు నావిగేట్ చేయండి.
4. **Configure rule** ఎంచుకోండి.
5. **Specify Source Details** page లో, source details specify చేసి, తర్వాత **Next** ఎంచుకోండి:
    - **Centralization rule name**: Centralization rule కోసం unique name ఎంటర్ చేయండి (ఉదా., `cloudtrail-centralization`).
    - **Source accounts**: Telemetry data centralize చేయబడే accounts ఎంచుకోవడానికి source selection criteria define చేయండి. Account ID, Organization Unit (OU) ID, లేదా మొత్తం Organization ద్వారా select చేయవచ్చు. **Builder** (click-based) లేదా **Editor** (free-form text) mode ఉపయోగించి selection criteria అందించవచ్చు.
        - Supported Keys: `OrganizationId` | `OrganizationUnitId` | `AccountId` | `*`
        - Supported Operators: `=` | `IN` | `OR`
    - **Source Regions**: Logs centralize చేయాలనుకునే Regions ఎంచుకోండి.

    ![Specifying Source Details for Log Centralization](/img/cloudops/guides/cloudtrail-lake/cloudtrail_lake_to_cloudwatch/cloudtrail_lake_to_cloudwatch_06.png "Specifying Source Details for Log Centralization")

6. **Specify Destination** page లో, destination details specify చేసి, తర్వాత **Next** ఎంచుకోండి:
    - **Destination account**: Organization లో telemetry data కోసం central destination గా పనిచేసే account ఎంచుకోండి.
    - **Destination Region**: Centralized telemetry data యొక్క copy store చేసే primary Region ఎంచుకోండి.
    - **Backup Region** (optional): Primary Region outage అనుభవిస్తే data availability నిర్ధారించడానికి, మీ destination account లో logs యొక్క synchronized copy maintain చేయడానికి backup Region ఎంచుకోండి.

    ![Specifying Destination Details for Log Centralization](/img/cloudops/guides/cloudtrail-lake/cloudtrail_lake_to_cloudwatch/cloudtrail_lake_to_cloudwatch_07.png "Specifying Destination Details for Log Centralization")

7. **Specify Telemetry Data** page లో, కింది fields సెట్ చేయడం ద్వారా telemetry data specify చేసి, తర్వాత **Next** ఎంచుకోండి:
    - **Log groups**: CloudTrail log groups మాత్రమే centralize చేయడానికి **Filter log groups** ఎంచుకోండి. **Builder** (click-based) లేదా **Editor** (free-form text) mode ఉపయోగించి selection criteria అందించవచ్చు.
        - **Data source selection criteria**: CloudWatch Logs మీ logs కు స్వయంచాలకంగా assign చేసే data source name మరియు type ద్వారా filter చేయడానికి దీన్ని ఉపయోగించండి. CloudTrail కోసం, సెట్ చేయండి: `DataSourceName = "aws_cloudtrail"`. Management లేదా data events వంటి specific event types target చేయడానికి `DataSourceType` ద్వారా కూడా filter చేయవచ్చు.
     
    - **KMS Encrypted Log Groups**: KMS-encrypted log groups handle చేయడానికి కింది options లో ఒకటి ఎంచుకోండి:
        - **Centralize source log groups encrypted with customer managed KMS keys using a destination specific customer managed KMS key**: అందించిన destination KMS key ARN ఉపయోగించి source accounts నుండి destination కు encrypted log groups centralize చేస్తుంది. ఈ option ఎంచుకుంటే, destination encryption key ARN మరియు backup destination encryption key ARN (మునుపటి దశలో backup Region ఎంచుకుంటేనే అవసరం) అందించాలి. Specified KMS key CloudWatch Logs encrypt చేయడానికి permissions కలిగి ఉండాలి.
        - **Centralize log groups encrypted with customer managed KMS keys in destination account with AWS owned KMS key**: Source accounts లో KMS-encrypted log groups ను AWS owned KMS key ఉపయోగించి encrypt చేయబడిన destination log groups లోకి centralize చేస్తుంది.
        - **Do not centralize log groups encrypted with customer managed KMS keys**: Customer managed KMS keys తో encrypt చేయబడిన source log groups నుండి log events centralization skip చేస్తుంది.

    ![Specify telemetry data for Log Centralization](/img/cloudops/guides/cloudtrail-lake/cloudtrail_lake_to_cloudwatch/cloudtrail_lake_to_cloudwatch_08.png "Specify telemetry data for Log Centralization")

    :::info
    **Log group selection criteria** ఉపయోగించి log group name ద్వారా అదనపు filtering కూడా అందుబాటులో ఉంది. మరిన్ని సమాచారం కోసం, [Cross-account cross-Region log centralization](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/CloudWatchLogs_Centralization.html) చూడండి.
    :::

8. **Review and Configure** page లో, centralization rule సమీక్షించి, ఐచ్ఛికంగా ఏదైనా చివరి-నిమిషం edits చేసి, **Create Centralization policy** ఎంచుకోండి.

Centralization rule సృష్టించబడి activate చేయబడిన తర్వాత, log events central account లోకి consolidate అవడం ప్రారంభిస్తాయి. Identical names ఉన్న Log groups log management streamline చేయడానికి merge చేయబడతాయి, log streams వాటి originating source account ID మరియు source Region identifiers తో append చేయబడతాయి. అదనంగా, log events కొత్త system fields (@aws.account మరియు @aws.region) తో enrich చేయబడతాయి, log data origin యొక్క clear traceability ఎనేబుల్ చేస్తాయి.

:::info
CloudWatch log centralization feature మీరు centralization rule సృష్టించిన తర్వాత source accounts లో arrive అయ్యే కొత్త log data ను మాత్రమే process చేస్తుంది. Historical log data (rule creation ముందు ఉన్న logs) centralize చేయబడదు.
:::

### Centralization Rules Validate చేయడం

**Rule health చెక్ చేయడం:**

1. **CloudWatch** → **Settings** → **Organization** tab → **Manage rules** కు నావిగేట్ చేయండి
2. Rule status **HEALTHY** అని verify చేయండి

**Centralization metrics monitor చేయడం:**

- **IncomingCopiedBytes**: Destination account లోకి replicate చేయబడిన log data volume uncompressed bytes లో (non-zero మరియు consistent గా ఉండాలి)
- **IncomingCopiedLogEvents**: Destination account లోకి replicate చేయబడిన log events సంఖ్య
- **OutgoingCopiedBytes**: Source accounts నుండి destination account కు పంపబడిన log data volume uncompressed bytes లో
- **OutgoingCopiedLogEvents**: Source accounts నుండి destination account కు పంపబడిన log events సంఖ్య
- **CentralizationError**: Replication సమయంలో ఎదురైన errors సంఖ్య; zero గా ఉండాలి -- ఏదైనా errors కోసం alarms సెటప్ చేయండి
- **CentralizationThrottled**: Centralization processing throttle చేయబడిన సార్ల సంఖ్య; replication ను impact చేయగల throttling కోసం monitor చేయండి

### CloudWatch Logs centralization కోసం log storage ఖర్చులు Optimize చేయడం

CloudWatch Logs centralization అనేక accounts మరియు Regions లో logs నిర్వహించడానికి ఖర్చు-ప్రభావవంతమైన pricing structure అందిస్తుంది. Centralized logs యొక్క మొదటి copy అదనపు ingestion charges లేదా cross-region data transfer ఖర్చులు లేకుండా వస్తుంది, customers standard CloudWatch storage ఖర్చులు మరియు feature pricing చెల్లిస్తారు. మొదటి centralization తర్వాత ఏదైనా subsequent copies కోసం, అదనపు per-GB charge ఉంటుంది (backup Region feature ఉపయోగించడం కూడా అదనపు copy సృష్టిస్తుంది). ప్రస్తుత pricing details కోసం, [CloudWatch pricing page](https://aws.amazon.com/cloudwatch/pricing/) చూడండి. CloudWatch Logs centralization ఉపయోగిస్తూ ఖర్చులు optimize చేయడంలో సహాయపడటానికి, కింది best practices అమలు చేయడం సిఫార్సు చేస్తున్నాము:

1. **Tiered Retention Strategy అమలు చేయండి**

    Dual-tier retention policy అమలు చేయడం ద్వారా storage ఖర్చులను గణనీయంగా తగ్గించవచ్చు.

    - తక్షణ operational అవసరాలు handle చేయడానికి మీ source accounts ను short-term retention periods (**7-30 రోజులు**) తో configure చేయండి.
    - మీ centralized account కోసం, compliance అవసరాలు మరియు historical analysis కు మద్దతు ఇవ్వడానికి ఎక్కువ retention periods (**90+ రోజులు**) సెట్ చేయండి.

2. **Selective Centralization ఉపయోగించండి**

    మీ logs యొక్క అదనపు copies సృష్టించేటప్పుడు, మీ centralization approach తో strategic గా ఉండండి:

    - నిర్దిష్ట applications లేదా services మాత్రమే centralize చేయడానికి **log group filters** leverage చేయండి.
    - మీ business అవసరాలతో align అయ్యే logs మాత్రమే గుర్తించి centralize చేయండి.
    - నిర్దిష్ట use case serve చేయని అనవసరమైన log data centralize చేయడం నివారించండి.

3. **Backup Strategy**

    మీ backup strategy plan చేసేటప్పుడు ఈ factors పరిగణించండి:

    - Backup copies అదనపు copies గా treat చేయబడతాయని మరియు అదనపు per-GB charge incur అవుతుందని గమనించండి. ప్రస్తుత rates కోసం [CloudWatch pricing page](https://aws.amazon.com/cloudwatch/pricing/) చూడండి.
    - Central account లో dedicated backup కోసం నిర్దిష్ట requirement ఉన్నప్పుడు మాత్రమే backup centralization ఎనేబుల్ చేయండి.
    - అదనపు charges eliminate చేయడానికి మీ source accounts ను backup copies గా utilize చేయడం పరిగణించండి.

ఈ optimization strategies అమలు చేయడం ద్వారా, మీ ఖర్చులను నియంత్రిస్తూ ప్రభావవంతమైన log management maintain చేయవచ్చు.


### CloudTrail Lake Ingestion ఆపడం

CloudWatch లోకి CloudTrail event ingestion ఎనేబుల్ చేసి కనీసం 24 గంటలు events సరిగ్గా flow అవుతున్నాయని confirm చేసిన తర్వాత, మీ CloudTrail Lake event data store కు ingestion disable చేయడానికి సమయం. ఇది రెండు services లో duplicate ingestion charges నిరోధిస్తుంది. మీరు కొత్త ingestion ఆపిన తర్వాత కూడా CloudTrail Lake లో మీ historical data querying కోసం పూర్తిగా అందుబాటులో ఉంటుంది.

1. **CloudTrail console** → **Lake** → **Event data stores** కు నావిగేట్ చేయండి
2. **Event Data Store** ఎంచుకోండి
3. **Stop ingestion** ఎంచుకోండి (ఇది querying కోసం ఇప్పటికే ఉన్న data preserve చేస్తుంది)
4. Action confirm చేయండి

:::info
Ingestion ఆపడం ఇప్పటికే ఉన్న data ను DELETE చేయదు. Retention period expire అయ్యే వరకు లేదా మీరు EDS delete చేయడం వరకు CloudTrail Lake లో historical data query చేయడం కొనసాగించవచ్చు.
:::
---

### CloudWatch Unified Data Store ఉపయోగించి Security Visibility Dashboard

CloudWatch లో centralized CloudTrail data తో, మీరు log group names పై ఏ dependency లేకుండా మీ అన్ని log groups అంతటా CloudTrail activity ను dynamically discover మరియు query చేయడానికి `@data_source_name` వంటి CloudWatch Unified Data Store default facets leverage చేసే pre-built CloudWatch Dashboard deploy చేయవచ్చు. Dashboard API activity patterns, security events, మరియు compliance posture లో near real-time visibility అందిస్తుంది, incident investigations సమయంలో cross-service correlation కోసం CloudTrail మరియు VPC Flow Log data ను side by side ఉంచుతుంది.

Dashboard widget descriptions మరియు query explanations తో సహా AWS CloudFormation ఉపయోగించి step-by-step deployment guide కోసం, [Security Visibility Dashboard using CloudWatch Unified Data Store](https://aws-samples.github.io/solutions/AWS%20CloudTrail/security-dashboard-uds) చూడండి.

---

## Query Translation Guide -- CloudTrail Lake SQL నుండి CloudWatch Logs Insights

Migration యొక్క అత్యంత క్రిటికల్ అంశాలలో ఒకటి మీ ఇప్పటికే ఉన్న CloudTrail Lake SQL queries ను CloudWatch Logs Insights equivalents కు translate చేయడం. [CloudWatch Logs Insights](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/AnalyzingLogData.html) మూడు query languages కు మద్దతు ఇస్తుంది: **Logs Insights QL**, **OpenSearch PPL**, మరియు **OpenSearch SQL** -- మీ data ఎలా query చేయాలో flexibility ఇస్తుంది.

:::info
CloudWatch Logs Insights natural language query generation కు మద్దతు ఇస్తుంది. మీరు ఏమి వెతుకుతున్నారో plain English లో వివరించవచ్చు, మరియు AI-assisted capability query generate చేసి line-by-line explanation అందిస్తుంది. Complex CloudTrail Lake SQL queries translate చేసేటప్పుడు ఇది ముఖ్యంగా సహాయకరం.
:::

---

## Migrated Environment కోసం Security Best Practices

CloudWatch లో మీ CloudTrail data ను secure చేయడానికి IAM policies, encryption, deletion protection, resource-based policies, మరియు continuous monitoring combine చేసే సమగ్ర, multi-layered approach అవసరం. సరైన security controls మీ log data audit మరియు compliance కోసం ఒక asset గా ఉండేలా నిర్ధారిస్తాయి, vulnerability కాకుండా, least-privilege access, data classification-driven log group design, మరియు critical audit trails యొక్క accidental లేదా malicious deletion నుండి protection cover చేస్తాయి.

Log group hierarchy design, granular permission management, మరియు encryption best practices తో సహా ఈ controls implement చేయడంపై detailed guidance కోసం, [Security Best Practices for CloudWatch Logs](https://aws-observability.github.io/observability-best-practices/tools/logs/security/cloudwatch-logs-security-best-practices/) చూడండి.

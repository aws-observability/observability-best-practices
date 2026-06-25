# Amazon Managed Prometheus குறுக்கு-கணக்கு ஸ்கிரேப்பிங்

Amazon Managed Service for Prometheus Prometheus-இணக்கமான மெட்ரிக்குகளை தானாகக் கண்டறிந்து இழுக்கும் முழுமையாக நிர்வகிக்கப்படும், ஏஜெண்ட்-இல்லா ஸ்கிரேப்பர் அல்லது கலெக்டரை வழங்குகிறது. ஏஜெண்ட்கள் அல்லது ஸ்கிரேப்பர்களை நிர்வகிக்க, நிறுவ, பேட்ச் செய்ய அல்லது பராமரிக்க வேண்டியதில்லை. Amazon Managed Service for Prometheus கலெக்டர் உங்கள் Amazon EKS கிளஸ்டருக்கு நம்பகமான, நிலையான, அதிக கிடைக்கும்தன்மை கொண்ட, தானாக அளவிடப்படும் மெட்ரிக்குகள் சேகரிப்பை வழங்குகிறது. Amazon Managed Service for Prometheus நிர்வகிக்கப்படும் கலெக்டர்கள் EC2 மற்றும் Fargate உள்ளிட்ட Amazon EKS கிளஸ்டர்களுடன் வேலை செய்கின்றன.

Amazon Managed Service for Prometheus கலெக்டர் ஸ்கிரேப்பர் உருவாக்கும்போது குறிப்பிடப்பட்ட ஒவ்வொரு சப்நெட்டுக்கும் ஒரு Elastic Network Interface (ENI) ஐ உருவாக்குகிறது. கலெக்டர் இந்த ENI-கள் வழியாக மெட்ரிக்குகளை ஸ்கிரேப் செய்து, VPC எண்ட்பாயிண்ட் பயன்படுத்தி remote_write மூலம் உங்கள் Amazon Managed Service for Prometheus பணியிடத்திற்கு தரவை அனுப்புகிறது. ஸ்கிரேப் செய்யப்பட்ட தரவு பொது இணையத்தில் பயணிப்பதில்லை.

நீங்கள் மெட்ரிக்குகளைச் சேகரிக்க விரும்பும் Amazon EKS கிளஸ்டர் ஒரு வேறு கணக்கில் (மூல கணக்கு) இருக்கும்போதும், Amazon Managed Service for Prometheus பணியிடம் மற்றொரு கணக்கில் (இலக்கு கணக்கு) இருக்கும்போதும் குறுக்கு-கணக்கு அமைப்பில் ஸ்கிரேப்பரை உருவாக்க, கீழே உள்ள நடைமுறையைப் பயன்படுத்தவும்.

## உயர் நிலை கட்டமைப்பு

![AMP Managed Collector Cross Account Scraping](./images/ampxa-arch.png)
*படம் 1: AMP Managed Collector குறுக்கு-கணக்கு ஸ்கிரேப்பிங், Collector உள்கட்டமைப்பு முழுவதுமாக AWS ஆல் நிர்வகிக்கப்படுகிறது*

இந்த கட்டமைப்பில் EKS பணிச்சுமை இருக்கும் கணக்கில் ஸ்கிரேப்பர்களை உருவாக்குகிறோம். ஸ்கிரேப்பர்கள் இலக்கு கணக்கில் AMP பணியிடத்திற்கு தரவை அனுப்ப இலக்கு கணக்கில் ஒரு பாத்திரத்தை ஏற்கலாம்.

1. மூல கணக்கில், STS::AssumeRole அனுமதிகளுடன் arn:aws:iam::account_id_source:role/Source என்ற பாத்திரத்தை உருவாக்கி பின்வரும் நம்பிக்கை கொள்கையைச் சேர்க்கவும்.

```
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "",
            "Effect": "Allow",
            "Principal": {
                "Service": "scraper.aps.amazonaws.com"
            },
            "Action": "sts:AssumeRole",
            "Condition": {
                "ArnEquals": {
                    "aws:SourceArn": "$SCRAPER_ARN"
                },
                "StringEquals": {
                    "AWS:SourceAccount": "$ACCOUNT_ID"
                }
            }
        }
    ]
}
```

assume role அனுமதிகள் கொள்கையும் தேவை:

```
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "VisualEditor0",
            "Effect": "Allow",
            "Action": "sts:AssumeRole",
            "Resource": "$TARGET_ACCOUNT_ROLE_ARN"
        }
    ]
}
```

:::warning

ஸ்கிரேப்பரை உருவாக்குவதற்கு முன்பே IAM கட்டமைப்புகளை உருவாக்க வேண்டும். எனவே இந்த நேரத்தில் $SCRAPER_ARN ஒரு ஒதுக்கிட புலமாகும். ஸ்கிரேப்பரை உருவாக்கிய பிறகு திரும்பிச் சென்று புதுப்பிப்போம். படி 2 முடிவடையும் வரை $TARGET_ACCOUNT_ROLE_ARN-ம் இல்லை.

:::

2. மூல (Amazon EKS கிளஸ்டர்) மற்றும் இலக்கு (Amazon Managed Service for Prometheus பணியிடம்) ஒவ்வொரு கலவையிலும், இலக்கு கணக்கில் arn:aws:iam::account_id_target:role/Target என்ற பாத்திரத்தை உருவாக்கி AmazonPrometheusRemoteWriteAccess நிர்வகிக்கப்படும் அனுமதிகள் கொள்கையுடன் பின்வரும் நம்பிக்கை கொள்கையைச் சேர்க்கவும்.

```
{
  "Effect": "Allow",
  "Principal": {
     "AWS": "arn:aws:iam::account_id_source:role/Source"
  },
  "Action": "sts:AssumeRole",
  "Condition": {
     "StringEquals": {
        "sts:ExternalId": "$SCRAPER_ARN"
      }
  }
}
```

:::warning

$SCRAPER_ARN இன்னும் ஒரு ஒதுக்கிடமாகவே உள்ளது. ஸ்கிரேப்பரை உருவாக்கிய பிறகு மதிப்பைப் புதுப்பிப்போம்.

:::

3. மூல கணக்கில் (EKS கிளஸ்டர் இருக்கும் இடம்) --role-configuration விருப்பத்துடன் ஒரு ஸ்கிரேப்பரை உருவாக்கவும்.

```
aws amp create-scraper \
  --source eksConfiguration="{clusterArn='arn:aws:eks:us-west-2:$SOURCE_ACCOUNT_ID:cluster/$CLUSTER_NAME',subnetIds=[$EKS_SUBNET_IDS]}" \
  --scrape-configuration configurationBlob=<base64-encoded-blob> \
  --destination ampConfiguration="{workspaceArn='arn:aws:aps:us-west-2:$TARGET_ACCOUNT_ID:workspace/$TARGET_AMP_WORKSPACE_ID'}"\
  --role-configuration '{"sourceRoleArn":"arn:aws:iam::$SOURCE_ACCOUNT_ID:role/Source", "targetRoleArn":"arn:aws:iam::$TARGET_ACCOUNT_ID:role/Target"}'
```
:::warning

$VARIABLES ஐ உங்களுக்குக் குறிப்பான மதிப்புகளால் நிரப்புவதை உறுதிசெய்யவும்.

:::

4. ஸ்கிரேப்பர் உருவாக்கத்தை சரிபார்க்கவும் (இது ~20 நிமிடங்கள் எடுக்கலாம்) மற்றும் ஸ்கிரேப்பர் ARN ஐ குறித்துக்கொள்ளவும்.

```
aws amp list-scrapers
{
    "scrapers": [
        {
            "scraperId": "scraper-id",
            "arn": "arn:aws:aps:us-west-2:account_id_source:scraper/scraper-id",
            "roleArn": "arn:aws:iam::account_id_source:role/aws-service-role/scraper.aps.amazonaws.com/AWSServiceRoleForAmazonPrometheusScraperInternal_cc319052-41a3-4",
            "status": {
                "statusCode": "ACTIVE"
            },
            "createdAt": "2024-10-29T16:37:58.789000+00:00",
            "lastModifiedAt": "2024-10-29T16:55:17.085000+00:00",
            "tags": {},
            "source": {
                "eksConfiguration": {
                    "clusterArn": "arn:aws:eks:us-west-2:account_id_source:cluster/xarw",
                    "securityGroupIds": [
                        "sg-security-group-id",
                        "sg-security-group-id"
                    ],
                    "subnetIds": [
                        "subnet-subnet_id"
                    ]
                }
            },
            "destination": {
                "ampConfiguration": {
                    "workspaceArn": "arn:aws:aps:us-west-2:account_id_target:workspace/ws-workspace-id"
                }
            }
        }
```

5. படிகள் 1 மற்றும் 2-ல் உருவாக்கப்பட்ட நம்பிக்கை கொள்கைகளை படி 4-ல் உள்ள கட்டளையிலிருந்து பெறப்பட்ட ஸ்கிரேப்பர் ARN மதிப்புடன் திரும்பிச் சென்று புதுப்பிக்கவும்.

# Amazon Managed Prometheus क्रॉस अकाउंट स्क्रैपिंग

Amazon Managed Service for Prometheus एक पूर्ण रूप से प्रबंधित, एजेंट-रहित scraper, या collector प्रदान करता है, जो स्वचालित रूप से Prometheus-संगत मेट्रिक्स की खोज और पुल करता है। आपको एजेंट या scrapers को प्रबंधित, इंस्टॉल, पैच या मेंटेन करने की आवश्यकता नहीं है। Amazon Managed Service for Prometheus collector आपके Amazon EKS क्लस्टर के लिए विश्वसनीय, स्थिर, अत्यधिक उपलब्ध, स्वचालित रूप से स्केल्ड मेट्रिक्स संग्रह प्रदान करता है। Amazon Managed Service for Prometheus managed collectors EC2 और Fargate सहित Amazon EKS क्लस्टर के साथ काम करते हैं।

Amazon Managed Service for Prometheus collector scraper बनाते समय निर्दिष्ट प्रत्येक subnet के लिए एक Elastic Network Interface (ENI) बनाता है। Collector इन ENIs के माध्यम से मेट्रिक्स स्क्रैप करता है, और VPC endpoint का उपयोग करके आपके Amazon Managed Service for Prometheus वर्कस्पेस में डेटा पुश करने के लिए remote_write का उपयोग करता है। स्क्रैप किया गया डेटा कभी भी सार्वजनिक इंटरनेट पर यात्रा नहीं करता।

क्रॉस-अकाउंट सेटअप में scraper बनाने के लिए जब आपका Amazon EKS क्लस्टर जिससे आप मेट्रिक्स एकत्र करना चाहते हैं एक अलग अकाउंट (सोर्स अकाउंट) में है जो Amazon Managed Service for Prometheus वर्कस्पेस (टारगेट अकाउंट) से भिन्न है, नीचे दी गई प्रक्रिया का उपयोग करें।

## उच्च स्तरीय आर्किटेक्चर

![AMP Managed Collector Cross Account Scraping](./images/ampxa-arch.png)
*चित्र 1: AMP Managed Collector क्रॉस अकाउंट स्क्रैपिंग, Collector इंफ्रास्ट्रक्चर पूरी तरह AWS द्वारा प्रबंधित*

इस आर्किटेक्चर में हम उस अकाउंट में scrapers बनाते हैं जहां EKS वर्कलोड मौजूद है। Scrapers टारगेट अकाउंट में AMP वर्कस्पेस में डेटा पुश करने के लिए टारगेट अकाउंट में एक role assume कर सकते हैं।

1. सोर्स अकाउंट में, STS::AssumeRole अनुमतियों के साथ एक role arn:aws:iam::account_id_source:role/Source बनाएं और निम्नलिखित trust policy जोड़ें।

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

आपको एक assume role permissions policy की भी आवश्यकता है:

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

हमें वास्तव में scraper बनाने से पहले IAM constructs बनाने होंगे। इसलिए इस बिंदु पर $SCRAPER_ARN केवल एक प्लेसहोल्डर फ़ील्ड है। Scraper बनाने के बाद हम वापस जाकर इसे अपडेट करेंगे। $TARGET_ACCOUNT_ROLE_ARN भी स्टेप 2 पूरा होने तक मौजूद नहीं है।

:::

2. सोर्स (Amazon EKS क्लस्टर) और टारगेट (Amazon Managed Service for Prometheus वर्कस्पेस) के प्रत्येक संयोजन पर, आपको TARGET अकाउंट में arn:aws:iam::account_id_target:role/Target का एक role बनाना होगा और AmazonPrometheusRemoteWriteAccess के लिए managed permissions policy के साथ निम्नलिखित trust policy जोड़नी होगी।

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

$SCRAPER_ARN अभी भी केवल एक प्लेसहोल्डर है। Scraper बनाने के बाद हम मान अपडेट करेंगे।

:::

3. सोर्स अकाउंट (जहां EKS क्लस्टर मौजूद है) में --role-configuration विकल्प के साथ एक scraper बनाएं।

```
aws amp create-scraper \
  --source eksConfiguration="{clusterArn='arn:aws:eks:us-west-2:$SOURCE_ACCOUNT_ID:cluster/$CLUSTER_NAME',subnetIds=[$EKS_SUBNET_IDS]}" \
  --scrape-configuration configurationBlob=<base64-encoded-blob> \
  --destination ampConfiguration="{workspaceArn='arn:aws:aps:us-west-2:$TARGET_ACCOUNT_ID:workspace/$TARGET_AMP_WORKSPACE_ID'}"\
  --role-configuration '{"sourceRoleArn":"arn:aws:iam::$SOURCE_ACCOUNT_ID:role/Source", "targetRoleArn":"arn:aws:iam::$TARGET_ACCOUNT_ID:role/Target"}'
```
:::warning

सुनिश्चित करें कि आप $VARIABLES को अपने विशिष्ट मानों से भरें।

:::

4. Scraper निर्माण को मान्य करें (इसमें ~20 मिनट लग सकते हैं) और scraper ARN नोट करें।

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

5. वापस जाएं और स्टेप 4 के कमांड से प्राप्त scraper ARN मान के साथ स्टेप 1 और 2 में बनाई गई trust policies को अपडेट करें।

# Amazon Managed Grafana में Athena का उपयोग

इस रेसिपी में हम आपको दिखाते हैं कि [Amazon Athena][athena]--एक सर्वरलेस, इंटरैक्टिव क्वेरी सेवा जो आपको मानक SQL का उपयोग करके Amazon S3 में डेटा का एनालिसिस करने की अनुमति देती है--को [Amazon Managed Grafana][amg] में कैसे उपयोग करें। यह एकीकरण [Athena data source for Grafana][athena-ds] द्वारा सक्षम है, जो एक ओपन सोर्स प्लगइन है जो किसी भी DIY Grafana इंस्टेंस में उपयोग के लिए उपलब्ध है और Amazon Managed Grafana में पूर्व-स्थापित भी है।

:::note
    इस गाइड को पूरा करने में लगभग 20 मिनट लगेंगे।
:::

## पूर्वापेक्षाएँ

* [AWS CLI][aws-cli] आपके एनवायरनमेंट में स्थापित और [कॉन्फ़िगर][aws-cli-conf] होनी चाहिए।
* आपके खाते से Amazon Athena तक पहुँच होनी चाहिए।

## इंफ्रास्ट्रक्चर

आइए पहले आवश्यक इंफ्रास्ट्रक्चर सेट करें।

### Amazon Athena सेटअप

हम Athena को दो अलग-अलग परिदृश्यों में उपयोग करना देखेंगे: एक भौगोलिक डेटा के साथ Geomap प्लगइन के बारे में, और दूसरा VPC फ्लो लॉग्स के आसपास सुरक्षा-संबंधित परिदृश्य।

सबसे पहले, सुनिश्चित करें कि Athena सेट अप है और डेटासेट लोड हैं।

:::warning
    इन क्वेरीज को निष्पादित करने के लिए आपको Amazon Athena कंसोल का उपयोग करना होगा। Grafana के पास आमतौर पर डेटा स्रोतों तक केवल-पढ़ने की पहुँच होती है, इसलिए इसका उपयोग डेटा बनाने या अपडेट करने के लिए नहीं किया जा सकता।
:::

#### भौगोलिक डेटा लोड करें

इस पहले उपयोग के मामले में हम [Registry of Open Data on AWS][awsod] से एक डेटासेट का उपयोग करते हैं। विशेष रूप से, हम भौगोलिक डेटा प्रेरित उपयोग के मामले के लिए Athena प्लगइन के उपयोग को प्रदर्शित करने के लिए [OpenStreetMap][osm] (OSM) का उपयोग करेंगे। इसके लिए, हमें पहले OSM डेटा को Athena में लाना होगा।

तो, सबसे पहले Athena में एक नया डेटाबेस बनाएं। [Athena कंसोल][athena-console] पर जाएं और OSM डेटा को डेटाबेस में आयात करने के लिए निम्नलिखित तीन SQL क्वेरीज का उपयोग करें।

क्वेरी 1:

```sql
CREATE EXTERNAL TABLE planet (
  id BIGINT,
  type STRING,
  tags MAP<STRING,STRING>,
  lat DECIMAL(9,7),
  lon DECIMAL(10,7),
  nds ARRAY<STRUCT<ref: BIGINT>>,
  members ARRAY<STRUCT<type: STRING, ref: BIGINT, role: STRING>>,
  changeset BIGINT,
  timestamp TIMESTAMP,
  uid BIGINT,
  user STRING,
  version BIGINT
)
STORED AS ORCFILE
LOCATION 's3://osm-pds/planet/';
```

क्वेरी 2:

```sql
CREATE EXTERNAL TABLE planet_history (
    id BIGINT,
    type STRING,
    tags MAP<STRING,STRING>,
    lat DECIMAL(9,7),
    lon DECIMAL(10,7),
    nds ARRAY<STRUCT<ref: BIGINT>>,
    members ARRAY<STRUCT<type: STRING, ref: BIGINT, role: STRING>>,
    changeset BIGINT,
    timestamp TIMESTAMP,
    uid BIGINT,
    user STRING,
    version BIGINT,
    visible BOOLEAN
)
STORED AS ORCFILE
LOCATION 's3://osm-pds/planet-history/';
```

क्वेरी 3:

```sql
CREATE EXTERNAL TABLE changesets (
    id BIGINT,
    tags MAP<STRING,STRING>,
    created_at TIMESTAMP,
    open BOOLEAN,
    closed_at TIMESTAMP,
    comments_count BIGINT,
    min_lat DECIMAL(9,7),
    max_lat DECIMAL(9,7),
    min_lon DECIMAL(10,7),
    max_lon DECIMAL(10,7),
    num_changes BIGINT,
    uid BIGINT,
    user STRING
)
STORED AS ORCFILE
LOCATION 's3://osm-pds/changesets/';
```

#### VPC फ्लो लॉग्स डेटा लोड करें

दूसरा उपयोग का मामला सुरक्षा-प्रेरित है: [VPC Flow Logs][vpcflowlogs] का उपयोग करके नेटवर्क ट्रैफ़िक का एनालिसिस।

सबसे पहले, हमें EC2 को हमारे लिए VPC Flow Logs जनरेट करने के लिए कहना होगा। यदि आपने यह पहले से नहीं किया है, तो अभी नेटवर्क इंटरफ़ेस स्तर, सबनेट स्तर, या VPC स्तर पर [VPC flow logs बनाएं][createvpcfl]।

:::note
    क्वेरी प्रदर्शन में सुधार करने और स्टोरेज फ़ुटप्रिंट को कम करने के लिए, हम VPC फ्लो लॉग्स को [Parquet][parquet] में संग्रहीत करते हैं, जो एक कॉलमर स्टोरेज फॉर्मेट है जो नेस्टेड डेटा का समर्थन करता है।
:::

हमारे सेटअप के लिए यह मायने नहीं रखता कि आप कौन सा विकल्प (नेटवर्क इंटरफ़ेस, सबनेट, या VPC) चुनते हैं, जब तक आप उन्हें नीचे दिखाए अनुसार Parquet फॉर्मेट में S3 बकेट में प्रकाशित करते हैं:

![EC2 कंसोल "Create flow log" पैनल का स्क्रीनशॉट](../images/ec2-vpc-flowlogs-creation.png)

अब, फिर से [Athena कंसोल][athena-console] के माध्यम से, उसी डेटाबेस में VPC फ्लो लॉग्स डेटा के लिए टेबल बनाएं जिसमें आपने OSM डेटा आयात किया था, या यदि आप चाहें तो एक नया बनाएं।

निम्नलिखित SQL क्वेरी का उपयोग करें और सुनिश्चित करें कि आप `VPC_FLOW_LOGS_LOCATION_IN_S3` को अपनी बकेट/फ़ोल्डर से बदलें:


```sql
CREATE EXTERNAL TABLE vpclogs (
  `version` int, 
  `account_id` string, 
  `interface_id` string, 
  `srcaddr` string, 
  `dstaddr` string, 
  `srcport` int, 
  `dstport` int, 
  `protocol` bigint, 
  `packets` bigint, 
  `bytes` bigint, 
  `start` bigint, 
  `end` bigint, 
  `action` string, 
  `log_status` string, 
  `vpc_id` string, 
  `subnet_id` string, 
  `instance_id` string, 
  `tcp_flags` int, 
  `type` string, 
  `pkt_srcaddr` string, 
  `pkt_dstaddr` string, 
  `region` string, 
  `az_id` string, 
  `sublocation_type` string, 
  `sublocation_id` string, 
  `pkt_src_aws_service` string, 
  `pkt_dst_aws_service` string, 
  `flow_direction` string, 
  `traffic_path` int
)
STORED AS PARQUET
LOCATION 'VPC_FLOW_LOGS_LOCATION_IN_S3'
```

उदाहरण के लिए, यदि आप `allmyflowlogs` S3 बकेट का उपयोग कर रहे हैं तो `VPC_FLOW_LOGS_LOCATION_IN_S3` कुछ इस तरह दिख सकता है:

```
s3://allmyflowlogs/AWSLogs/12345678901/vpcflowlogs/eu-west-1/2021/
```

अब जब डेटासेट Athena में उपलब्ध हैं, तो आइए Grafana पर आगे बढ़ें।

### Grafana सेटअप

हमें एक Grafana इंस्टेंस की आवश्यकता है, इसलिए [शुरू करें][amg-getting-started] गाइड का उपयोग करके एक नया [Amazon Managed Grafana वर्कस्पेस][amg-workspace] सेट करें, या मौजूदा का उपयोग करें।

:::warning
    AWS डेटा स्रोत कॉन्फ़िगरेशन का उपयोग करने के लिए, पहले Amazon Managed Grafana कंसोल पर जाएं और सर्विस-मैनेज्ड IAM रोल्स को सक्षम करें जो वर्कस्पेस को Athena संसाधनों को पढ़ने के लिए आवश्यक IAM पॉलिसी प्रदान करते हैं।
    इसके अलावा, निम्नलिखित बातों पर ध्यान दें:

	1. जिस Athena वर्कग्रुप का आप उपयोग करने की योजना बना रहे हैं, उसे सर्विस मैनेज्ड अनुमतियों को वर्कग्रुप का उपयोग करने की अनुमति देने के लिए कुंजी `GrafanaDataSource` और मान `true` के साथ टैग किया जाना चाहिए।
	1. सर्विस-मैनेज्ड IAM पॉलिसी केवल `grafana-athena-query-results-` से शुरू होने वाली क्वेरी परिणाम बकेट तक पहुँच प्रदान करती है, इसलिए किसी भी अन्य बकेट के लिए आपको मैन्युअल रूप से अनुमतियाँ जोड़नी होंगी।
	1. क्वेरी किए जा रहे अंतर्निहित डेटा स्रोत के लिए आपको `s3:Get*` और `s3:List*` अनुमतियाँ मैन्युअल रूप से जोड़नी होंगी।
:::



Athena डेटा स्रोत सेट करने के लिए, बाएँ टूलबार का उपयोग करें और निचला AWS आइकन चुनें और फिर "Athena" चुनें। अपना डिफ़ॉल्ट रीजन चुनें जहाँ आप चाहते हैं कि प्लगइन Athena डेटा स्रोत खोजे, और फिर वे खाते चुनें जो आप चाहते हैं, और अंत में "Add data source" चुनें।

वैकल्पिक रूप से, आप इन चरणों का पालन करके Athena डेटा स्रोत को मैन्युअल रूप से जोड़ और कॉन्फ़िगर कर सकते हैं:

1. बाएँ टूलबार पर "Configurations" आइकन पर क्लिक करें और फिर "Add data source" पर क्लिक करें।
1. "Athena" खोजें।
1. [वैकल्पिक] प्रमाणीकरण प्रदाता कॉन्फ़िगर करें (अनुशंसित: workspace IAM role)।
1. अपने लक्षित Athena डेटा स्रोत, डेटाबेस और वर्कग्रुप का चयन करें।
1. यदि आपके वर्कग्रुप में पहले से आउटपुट लोकेशन कॉन्फ़िगर नहीं है, तो क्वेरी परिणामों के लिए उपयोग करने के लिए S3 बकेट और फ़ोल्डर निर्दिष्ट करें। ध्यान दें कि सर्विस-मैनेज्ड पॉलिसी का लाभ उठाने के लिए बकेट को `grafana-athena-query-results-` से शुरू होना चाहिए।
1. "Save & test" पर क्लिक करें।

आपको कुछ इस तरह दिखाई देना चाहिए:

![Athena डेटा स्रोत कॉन्फ़िग का स्क्रीनशॉट](../images/amg-plugin-athena-ds.png)




## उपयोग

अब आइए देखें कि Grafana से हमारे Athena डेटासेट का उपयोग कैसे करें।

### भौगोलिक डेटा का उपयोग

Athena में [OpenStreetMap][osm] (OSM) डेटा कई सवालों का जवाब दे सकता है, जैसे "कुछ सुविधाएं कहाँ हैं"। आइए इसे क्रियान्वित होते देखें।

उदाहरण के लिए, लास वेगास क्षेत्र में भोजन प्रदान करने वाले स्थानों को सूचीबद्ध करने के लिए OSM डेटासेट के खिलाफ एक SQL क्वेरी इस प्रकार है:

```sql
SELECT 
tags['amenity'] AS amenity,
tags['name'] AS name,
tags['website'] AS website,
lat, lon
FROM planet
WHERE type = 'node'
  AND tags['amenity'] IN ('bar', 'pub', 'fast_food', 'restaurant')
  AND lon BETWEEN -115.5 AND -114.5
  AND lat BETWEEN 36.1 AND 36.3
LIMIT 500;
```

:::info
    ऊपर की क्वेरी में लास वेगास क्षेत्र को `36.1` और `36.3` के बीच अक्षांश तथा `-115.5` और `-114.5` के बीच देशांतर के रूप में परिभाषित किया गया है।
	आप इसे प्रत्येक कोने के लिए वेरिएबल्स के एक सेट में बदल सकते हैं और Geomap प्लगइन को अन्य क्षेत्रों के लिए अनुकूलनीय बना सकते हैं।
:::
ऊपर की क्वेरी का उपयोग करके OSM डेटा को विज़ुअलाइज़ करने के लिए, आप एक उदाहरण डैशबोर्ड आयात कर सकते हैं, जो [osm-sample-dashboard.json](./amg-athena-plugin/osm-sample-dashboard.json) के माध्यम से उपलब्ध है और इस प्रकार दिखता है:

![AMG में OSM डैशबोर्ड का स्क्रीनशॉट](../images/amg-osm-dashboard.png)

:::note
    ऊपर के स्क्रीनशॉट में हम डेटा पॉइंट्स को प्लॉट करने के लिए Geomap विज़ुअलाइज़ेशन (बाएँ पैनल में) का उपयोग करते हैं।
:::
### VPC फ्लो लॉग्स डेटा का उपयोग

VPC फ्लो लॉग डेटा का एनालिसिस करने, SSH और RDP ट्रैफ़िक का पता लगाने के लिए, निम्नलिखित SQL क्वेरीज का उपयोग करें।

SSH/RDP ट्रैफ़िक पर सारणीबद्ध अवलोकन प्राप्त करना:

```sql
SELECT
srcaddr, dstaddr, account_id, action, protocol, bytes, log_status
FROM vpclogs
WHERE
srcport in (22, 3389)
OR
dstport IN (22, 3389)
ORDER BY start ASC;
```

स्वीकृत और अस्वीकृत बाइट्स पर टाइम सीरीज़ व्यू प्राप्त करना:

```sql
SELECT
from_unixtime(start), sum(bytes), action
FROM vpclogs
WHERE
srcport in (22,3389)
OR
dstport IN (22, 3389)
GROUP BY start, action
ORDER BY start ASC;
```

:::tip
    यदि आप Athena में क्वेरी किए जाने वाले डेटा की मात्रा को सीमित करना चाहते हैं, तो `$__timeFilter` मैक्रो का उपयोग करने पर विचार करें।
:::

VPC फ्लो लॉग डेटा को विज़ुअलाइज़ करने के लिए, आप एक उदाहरण डैशबोर्ड आयात कर सकते हैं, जो [vpcfl-sample-dashboard.json](./amg-athena-plugin/vpcfl-sample-dashboard.json) के माध्यम से उपलब्ध है और इस प्रकार दिखता है:

![AMG में VPC फ्लो लॉग्स डैशबोर्ड का स्क्रीनशॉट](../images/amg-vpcfl-dashboard.png)

यहाँ से, आप Amazon Managed Grafana में अपना डैशबोर्ड बनाने के लिए निम्नलिखित गाइड का उपयोग कर सकते हैं:

* [उपयोगकर्ता गाइड: डैशबोर्ड](https://docs.aws.amazon.com/grafana/latest/userguide/dashboard-overview.html)
* [डैशबोर्ड बनाने के लिए बेस्ट प्रैक्टिसेज़](https://grafana.com/docs/grafana/latest/best-practices/best-practices-for-creating-dashboards/)

बस इतना ही, बधाई हो आपने Grafana से Athena का उपयोग करना सीख लिया!

## सफाई

आप जिस Athena डेटाबेस का उपयोग कर रहे थे, उससे OSM डेटा हटाएं और फिर कंसोल से Amazon Managed Grafana वर्कस्पेस हटाएं।

[athena]: https://aws.amazon.com/athena/
[amg]: https://aws.amazon.com/grafana/
[athena-ds]: https://grafana.com/grafana/plugins/grafana-athena-datasource/
[aws-cli]: https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-install.html
[aws-cli-conf]: https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-configure.html
[amg-getting-started]: https://aws.amazon.com/blogs/mt/amazon-managed-grafana-getting-started/
[awsod]: https://registry.opendata.aws/
[osm]: https://aws.amazon.com/blogs/big-data/querying-openstreetmap-with-amazon-athena/
[vpcflowlogs]: https://docs.aws.amazon.com/vpc/latest/userguide/flow-logs.html
[createvpcfl]: https://docs.aws.amazon.com/vpc/latest/userguide/flow-logs-s3.html#flow-logs-s3-create-flow-log
[athena-console]: https://console.aws.amazon.com/athena/
[amg-workspace]: https://console.aws.amazon.com/grafana/home#/workspaces
[parquet]: https://github.com/apache/parquet-format

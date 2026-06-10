# Amazon Managed Service for Prometheus

Amazon Managed Service for Prometheus लागत और उपयोग विज़ुअल आपको व्यक्तिगत AWS Accounts, AWS Regions, विशिष्ट Prometheus Workspace instances के साथ-साथ RemoteWrite, Query, और HourlyStorageMetering जैसे Operations की लागत में अंतर्दृष्टि प्राप्त करने की अनुमति देंगे!  

लागत और उपयोग डेटा को विज़ुअलाइज़ और विश्लेषित करने के लिए, आपको एक कस्टम Athena view बनाने की आवश्यकता है।

1.	आगे बढ़ने से पहले, सुनिश्चित करें कि आपने [Implementation overview][cid-implement] में उल्लिखित CUR (step #1) बनाया है और AWS CloudFormation Template (step #2) डिप्लॉय किया है।

2.	अब, निम्नलिखित query का उपयोग करके एक नया Amazon Athena [view][view] बनाएं। यह query आपके Organization में सभी AWS Accounts में Amazon Managed Service for Prometheus की लागत और उपयोग को fetch करती है।

        CREATE OR REPLACE VIEW "prometheus_cost" AS 
        SELECT
        line_item_usage_type
        , line_item_resource_id
        , line_item_operation
        , line_item_usage_account_id
        , month
        , year
        , "sum"(line_item_usage_amount) "Usage"
        , "sum"(line_item_unblended_cost) cost
        FROM
        database.tablename #replace database.tablename with your database and table name
        WHERE ("line_item_product_code" = 'AmazonPrometheus')
        GROUP BY 1, 2, 3, 4, 5, 6

## Amazon Managed Grafana डैशबोर्ड बनाएं  

Amazon Managed Grafana के साथ, आप Grafana workspace console में AWS data source configuration विकल्प का उपयोग करके Athena को data source के रूप में जोड़ सकते हैं। यह feature Athena को data source के रूप में जोड़ना सरल बनाता है क्योंकि यह आपके मौजूदा Athena accounts को discover करता है और Athena तक पहुंचने के लिए आवश्यक authentication credentials के configuration को प्रबंधित करता है। Athena data source के उपयोग से जुड़ी पूर्व-आवश्यकताओं के लिए, [Prerequisites][Prerequisites] देखें।


निम्नलिखित **Grafana डैशबोर्ड** आपके AWS Organizations में सभी AWS Accounts में Amazon Managed Service for Prometheus की लागत और उपयोग दिखाता है, साथ ही व्यक्तिगत Prometheus Workspace instances की लागत और RemoteWrite, Query, और HourlyStorageMetering जैसे Operations भी! 

![prometheus-cost](../../../images/prometheus-cost.png)

Grafana में एक डैशबोर्ड एक JSON object द्वारा दर्शाया जाता है, जो इसके डैशबोर्ड का metadata स्टोर करता है। डैशबोर्ड metadata में डैशबोर्ड properties, panels से metadata, template variables, panel queries आदि शामिल हैं। उपरोक्त डैशबोर्ड की JSON template [यहां](AmazonPrometheus.json) एक्सेस करें।

उपरोक्त डैशबोर्ड के साथ, अब आप अपने Organization में AWS accounts में Amazon Managed Service for Prometheus की लागत और उपयोग की पहचान कर सकते हैं। आप अपनी आवश्यकताओं के अनुरूप विज़ुअल बनाने के लिए अन्य Grafana [dashboard panels][panels] का उपयोग कर सकते हैं।

[Prerequisites]: https://docs.aws.amazon.com/grafana/latest/userguide/Athena-prereq.html
[view]: https://athena-in-action.workshop.aws/30-basics/303-create-view.html
[panels]: https://docs.aws.amazon.com/grafana/latest/userguide/Grafana-panels.html
[cid-implement]: ../../../guides/cost/cost-visualization/cost.md#implementation

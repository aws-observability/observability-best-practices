# Amazon Managed Grafana

Amazon Managed Grafana लागत और उपयोग विज़ुअल आपको व्यक्तिगत AWS Accounts, AWS Regions, विशिष्ट Grafana Workspace instances और Admin, Editor, और Viewer users की licensing लागत में अंतर्दृष्टि प्राप्त करने की अनुमति देंगे!  

लागत और उपयोग डेटा को विज़ुअलाइज़ और विश्लेषित करने के लिए, आपको एक कस्टम Athena view बनाने की आवश्यकता है।

1.	आगे बढ़ने से पहले, सुनिश्चित करें कि आपने [Implementation overview][cid-implement] में उल्लिखित CUR (step #1) बनाया है और AWS CloudFormation Template (step #2) डिप्लॉय किया है।

2.	अब, निम्नलिखित query का उपयोग करके एक नया Amazon Athena [view][view] बनाएं। यह query आपके Organization में सभी AWS Accounts में Amazon Managed Grafana की लागत और उपयोग को fetch करती है।

        CREATE OR REPLACE VIEW "grafana_cost" AS 
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
        WHERE ("line_item_product_code" = 'AmazonGrafana')
        GROUP BY 1, 2, 3, 4, 5, 6

Athena को data source के रूप में उपयोग करके, आप अपनी व्यावसायिक आवश्यकताओं के अनुरूप Amazon Managed Grafana या Amazon QuickSight में डैशबोर्ड बना सकते हैं। साथ ही, आप अपने द्वारा बनाए गए Athena view के विरुद्ध सीधे [SQL queries][sql-query] चला सकते हैं।


[view]: https://athena-in-action.workshop.aws/30-basics/303-create-view.html
[sql-query]: https://docs.aws.amazon.com/athena/latest/ug/querying-athena-tables.html
[cid-implement]: ../../../guides/cost/cost-visualization/cost.md#implementation

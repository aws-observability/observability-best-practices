# Amazon CloudWatch

Amazon CloudWatch लागत और उपयोग विज़ुअल आपको व्यक्तिगत AWS Accounts, AWS Regions, और सभी CloudWatch ऑपरेशन जैसे GetMetricData, PutLogEvents, GetMetricStream, ListMetrics, MetricStorage, HourlyStorageMetering, और ListMetrics आदि की लागत में अंतर्दृष्टि प्राप्त करने की अनुमति देंगे!  
  
CloudWatch लागत और उपयोग डेटा को विज़ुअलाइज़ और विश्लेषित करने के लिए, आपको एक कस्टम Athena view बनाने की आवश्यकता है। Amazon Athena [view][view] एक logical table है और यह डेटा की querying को सरल बनाने के लिए मूल CUR table से columns का एक subset बनाता है।

1.	आगे बढ़ने से पहले, सुनिश्चित करें कि आपने [Implementation overview][cid-implement] में उल्लिखित CUR (step #1) बनाया है और AWS CloudFormation Template (step #2) डिप्लॉय किया है।

2.	अब, निम्नलिखित query का उपयोग करके एक नया Amazon Athena [view][view] बनाएं। यह query आपके Organization में सभी AWS Accounts में Amazon CloudWatch की लागत और उपयोग को fetch करती है।

        CREATE OR REPLACE VIEW "cloudwatch_cost" AS 
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
        WHERE ("line_item_product_code" = 'AmazonCloudWatch')
        GROUP BY 1, 2, 3, 4, 5, 6


### Amazon QuickSight डैशबोर्ड बनाएं

अब, Amazon CloudWatch की लागत और उपयोग को विज़ुअलाइज़ करने के लिए एक QuickSight डैशबोर्ड बनाएं।  

1.	AWS Management Console पर, QuickSight सेवा पर जाएं और फिर ऊपरी दाएं कोने से अपना AWS Region चुनें। ध्यान दें कि QuickSight Dataset उसी AWS Region में होना चाहिए जिसमें Amazon Athena table है।
2.	सुनिश्चित करें कि QuickSight Amazon S3 और AWS Athena को [access][access] कर सकता है।
3.	आपके द्वारा पहले बनाए गए Amazon Athena view को data-source के रूप में चुनकर [QuickSight Dataset बनाएं][create-dataset]। Dataset को दैनिक आधार पर [refresh schedule][schedule-refresh] करने के लिए इस प्रक्रिया का उपयोग करें।
4.	QuickSight [Analysis][analysis] बनाएं।
5.	अपनी आवश्यकताओं को पूरा करने के लिए QuickSight [Visuals][visuals] बनाएं।
6.	अपनी आवश्यकताओं को पूरा करने के लिए Visual को [Format][format] करें।
7.	अब, आप Analysis से अपना डैशबोर्ड [publish][publish] कर सकते हैं।
8.	आप डैशबोर्ड को [report][report] प्रारूप में व्यक्तियों या समूहों को, एक बार या एक शेड्यूल पर भेज सकते हैं।

निम्नलिखित **QuickSight डैशबोर्ड** आपके AWS Organizations में सभी AWS Accounts में Amazon CloudWatch की लागत और उपयोग दिखाता है, साथ ही GetMetricData, PutLogEvents, GetMetricStream, ListMetrics, MetricStorage, HourlyStorageMetering, और ListMetrics जैसे CloudWatch ऑपरेशन भी।

![cloudwatch-cost1](../../../images/cloudwatch-cost-1.PNG)
![cloudwatch-cost2](../../../images/cloudwatch-cost-2.PNG)

उपरोक्त डैशबोर्ड के साथ, अब आप अपने Organization में AWS accounts में Amazon CloudWatch की लागत की पहचान कर सकते हैं। आप अपनी आवश्यकताओं के अनुरूप विभिन्न डैशबोर्ड बनाने के लिए अन्य QuickSight [visual types][types] का उपयोग कर सकते हैं।


[view]: https://athena-in-action.workshop.aws/30-basics/303-create-view.html
[access]: https://docs.aws.amazon.com/quicksight/latest/user/accessing-data-sources.html
[create-dataset]: https://docs.aws.amazon.com/quicksight/latest/user/create-a-data-set-athena.html
[schedule-refresh]: https://docs.aws.amazon.com/quicksight/latest/user/refreshing-imported-data.html
[analysis]: https://docs.aws.amazon.com/quicksight/latest/user/creating-an-analysis.html
[visuals]: https://docs.aws.amazon.com/quicksight/latest/user/creating-a-visual.html
[format]: https://docs.aws.amazon.com/quicksight/latest/user/formatting-a-visual.html
[publish]: https://docs.aws.amazon.com/quicksight/latest/user/creating-a-dashboard.html
[report]: https://docs.aws.amazon.com/quicksight/latest/user/sending-reports.html
[types]: https://docs.aws.amazon.com/quicksight/latest/user/working-with-visual-types.html
[cid-implement]: ../../../guides/cost/cost-visualization/cost.md#implementation

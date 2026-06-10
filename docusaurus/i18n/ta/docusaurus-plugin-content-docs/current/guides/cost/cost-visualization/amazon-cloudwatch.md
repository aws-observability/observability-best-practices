# Amazon CloudWatch

Amazon CloudWatch செலவு மற்றும் பயன்பாட்டு காட்சிகள் தனிப்பட்ட AWS Accounts, AWS Regions மற்றும் GetMetricData, PutLogEvents, GetMetricStream, ListMetrics, MetricStorage, HourlyStorageMetering மற்றும் ListMetrics போன்ற அனைத்து CloudWatch operations பற்றிய நுண்ணறிவுகளைப் பெற உங்களை அனுமதிக்கும்!

CloudWatch செலவு மற்றும் பயன்பாட்டு தரவை காட்சிப்படுத்தவும் பகுப்பாய்வு செய்யவும், தனிப்பயன் Athena view ஐ உருவாக்க வேண்டும். Amazon Athena [view][view] என்பது ஒரு logical table ஆகும், இது தரவை வினவுவதை எளிமைப்படுத்த அசல் CUR table இலிருந்து columns இன் subset ஐ உருவாக்குகிறது.

1.	தொடர்வதற்கு முன், [செயல்படுத்தல் கண்ணோட்டத்தில்][cid-implement] குறிப்பிடப்பட்ட CUR (படி #1) ஐ உருவாக்கி AWS CloudFormation Template (படி #2) ஐ deploy செய்துள்ளீர்கள் என்பதை உறுதிப்படுத்தவும்.

2.	இப்போது, பின்வரும் query ஐப் பயன்படுத்தி புதிய Amazon Athena [view][view] ஐ உருவாக்குங்கள். இந்த query உங்கள் Organization இல் உள்ள அனைத்து AWS Accounts களிலும் Amazon CloudWatch இன் செலவு மற்றும் பயன்பாட்டைப் பெறுகிறது.

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


### Amazon QuickSight டாஷ்போர்டு உருவாக்குதல்

இப்போது, Amazon CloudWatch இன் செலவு மற்றும் பயன்பாட்டை காட்சிப்படுத்த QuickSight டாஷ்போர்டை உருவாக்குவோம்.

1.	AWS Management Console இல், QuickSight சேவைக்கு செல்லுங்கள், பின்னர் மேல் வலது மூலையிலிருந்து உங்கள் AWS Region ஐத் தேர்ந்தெடுக்கவும். QuickSight Dataset Amazon Athena table அதே AWS Region இல் இருக்க வேண்டும் என்பதை கவனிக்கவும்.
2.	QuickSight Amazon S3 மற்றும் AWS Athena ஐ [அணுக][access] முடியும் என்பதை உறுதிப்படுத்தவும்.
3.	நீங்கள் முன்பு உருவாக்கிய Amazon Athena view ஐ data-source ஆகத் தேர்ந்தெடுத்து [QuickSight Dataset ஐ உருவாக்குங்கள்][create-dataset]. Dataset ஐ தினசரி அடிப்படையில் [refresh செய்ய schedule][schedule-refresh] செய்ய இந்த procedure ஐப் பயன்படுத்தவும்.
4.	QuickSight [Analysis][analysis] ஐ உருவாக்குங்கள்.
5.	உங்கள் தேவைகளுக்கு ஏற்ற QuickSight [Visuals][visuals] ஐ உருவாக்குங்கள்.
6.	உங்கள் தேவைகளுக்கு ஏற்ற Visual ஐ [Format][format] செய்யுங்கள்.
7.	இப்போது, Analysis இலிருந்து உங்கள் டாஷ்போர்டை [publish][publish] செய்யலாம்.
8.	டாஷ்போர்டை தனிநபர்கள் அல்லது குழுக்களுக்கு ஒரு முறை அல்லது schedule இல் [report][report] format இல் அனுப்பலாம்.

பின்வரும் **QuickSight டாஷ்போர்டு** உங்கள் AWS Organizations இல் உள்ள அனைத்து AWS Accounts களிலும் Amazon CloudWatch செலவு மற்றும் பயன்பாட்டை GetMetricData, PutLogEvents, GetMetricStream, ListMetrics, MetricStorage, HourlyStorageMetering மற்றும் ListMetrics போன்ற CloudWatch operations உடன் காட்டுகிறது.

![cloudwatch-cost1](../../../images/cloudwatch-cost-1.PNG)
![cloudwatch-cost2](../../../images/cloudwatch-cost-2.PNG)

மேலே உள்ள டாஷ்போர்டு மூலம், உங்கள் Organization முழுவதும் AWS accounts களில் Amazon CloudWatch இன் செலவை இப்போது அடையாளம் காணலாம். உங்கள் தேவைகளுக்கு ஏற்ற வெவ்வேறு dashboards களை உருவாக்க பிற QuickSight [visual types][types] ஐப் பயன்படுத்தலாம்.


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

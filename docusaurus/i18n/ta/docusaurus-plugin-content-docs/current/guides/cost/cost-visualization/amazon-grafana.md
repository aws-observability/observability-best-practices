# Amazon Managed Grafana

Amazon Managed Grafana செலவு மற்றும் பயன்பாட்டு காட்சிகள் தனிப்பட்ட AWS Accounts, AWS Regions, குறிப்பிட்ட Grafana Workspace instances மற்றும் Admin, Editor மற்றும் Viewer பயனர்களின் licensing செலவு பற்றிய நுண்ணறிவுகளைப் பெற உங்களை அனுமதிக்கும்!

செலவு மற்றும் பயன்பாட்டு தரவை காட்சிப்படுத்தவும் பகுப்பாய்வு செய்யவும், தனிப்பயன் Athena view ஐ உருவாக்க வேண்டும்.

1.	தொடர்வதற்கு முன், [செயல்படுத்தல் கண்ணோட்டத்தில்][cid-implement] குறிப்பிடப்பட்ட CUR (படி #1) ஐ உருவாக்கி AWS CloudFormation Template (படி #2) ஐ deploy செய்துள்ளீர்கள் என்பதை உறுதிப்படுத்தவும்.

2.	இப்போது, பின்வரும் query ஐப் பயன்படுத்தி புதிய Amazon Athena [view][view] ஐ உருவாக்குங்கள். இந்த query உங்கள் Organization இல் உள்ள அனைத்து AWS Accounts களிலும் Amazon Managed Grafana இன் செலவு மற்றும் பயன்பாட்டைப் பெறுகிறது.

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

Athena ஐ data source ஆகப் பயன்படுத்தி, உங்கள் வணிகத் தேவைகளுக்கு ஏற்ற dashboards களை Amazon Managed Grafana அல்லது Amazon QuickSight இல் உருவாக்கலாம். அதேபோல், நீங்கள் உருவாக்கிய Athena view க்கு எதிராக நேரடியாக [SQL queries][sql-query] இயக்கலாம்.


[view]: https://athena-in-action.workshop.aws/30-basics/303-create-view.html
[sql-query]: https://docs.aws.amazon.com/athena/latest/ug/querying-athena-tables.html
[cid-implement]: ../../../guides/cost/cost-visualization/cost.md#implementation

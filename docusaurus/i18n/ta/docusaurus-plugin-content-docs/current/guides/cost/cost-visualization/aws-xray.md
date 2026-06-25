# AWS X-Ray

AWS X-Ray செலவு மற்றும் பயன்பாட்டு காட்சிகள், தனிப்பட்ட AWS கணக்குகள், AWS பிராந்தியங்கள் மற்றும் TracesStored ஆகியவற்றின் செலவு பற்றிய நுண்ணறிவுகளைப் பெற உதவும்!  

செலவு மற்றும் பயன்பாட்டுத் தரவை காட்சிப்படுத்த மற்றும் பகுப்பாய்வு செய்ய, நீங்கள் தனிப்பயன் Athena view-ஐ உருவாக்க வேண்டும்.

1.	தொடர்வதற்கு முன், [செயல்படுத்தல் மேலோட்டத்தில்][cid-implement] குறிப்பிடப்பட்ட CUR (படி #1) உருவாக்கப்பட்டதையும் AWS CloudFormation Template (படி #2) டிப்ளாய் செய்யப்பட்டதையும் உறுதிசெய்யவும்.

2.	இப்போது, பின்வரும் வினவலைப் பயன்படுத்தி புதிய Amazon Athena [view][view]-ஐ உருவாக்கவும். இந்த வினவல் உங்கள் நிறுவனத்தில் உள்ள அனைத்து AWS கணக்குகள் முழுவதும் Amazon Managed Grafana-வின் செலவு மற்றும் பயன்பாட்டைப் பெறுகிறது.

        CREATE OR REPLACE VIEW "xray_cost" AS 
        SELECT
        line_item_usage_type
        , line_item_resource_id
        , line_item_usage_account_id
        , month
        , year
        , "sum"(line_item_usage_amount) "Usage"
        , "sum"(line_item_net_unblended_cost) cost
        FROM
        database.tablename #replace database.tablename with your database and table name 
        WHERE ("line_item_product_code" = 'AWSXRay')
        GROUP BY 1, 2, 3, 4, 5

Athena-ஐ தரவு மூலமாகப் பயன்படுத்தி, உங்கள் வணிகத் தேவைகளுக்கு ஏற்ப Amazon Managed Grafana அல்லது Amazon QuickSight-ல் டாஷ்போர்டுகளை உருவாக்கலாம். மேலும், நீங்கள் உருவாக்கிய Athena view-க்கு எதிராக நேரடியாக [SQL வினவல்களை][sql-query] இயக்கலாம்.

[view]: https://athena-in-action.workshop.aws/30-basics/303-create-view.html
[sql-query]: https://docs.aws.amazon.com/athena/latest/ug/querying-athena-tables.html
[cid-implement]: ../../../guides/cost/cost-visualization/cost.md#implementation

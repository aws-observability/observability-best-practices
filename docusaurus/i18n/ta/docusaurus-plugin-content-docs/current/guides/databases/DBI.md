# Amazon CloudWatch Database Insights மூலம் Databases-ஐ கண்காணித்தல்

## அறிமுகம்

Amazon CloudWatch Database Insights என்பது Amazon RDS மற்றும் Aurora databases-க்கான ஒருங்கிணைந்த monitoring தீர்வு ஆகும். இது database மெட்ரிக்குகள், query analytics, லாக்குகள், events மற்றும் application telemetry ஆகியவற்றை CloudWatch console-ல் ஒரே அனுபவத்தில் ஒருங்கிணைக்கிறது -- உங்கள் database layer-ல் என்ன நடக்கிறது என்பதை புரிந்துகொள்ள பல கருவிகளுக்கு இடையே மாறும் தேவையை நீக்குகிறது.

---

## Database Insights என்றால் என்ன?

Database Insights Amazon RDS Performance Insights-இன் மேல் build செய்யப்பட்டு, fleet-wide monitoring, log correlation, lock analysis, execution plan capture மற்றும் application-level integration-ஐ நீட்டிக்கிறது.

முக்கிய concept **DB Load** ஆகும் -- எந்த நேரத்திலும் உங்கள் database-ல் active sessions-இன் சராசரி எண்ணிக்கை. DB Load உங்கள் instance-இன் vCPU count-ஐ மீறினால், உங்கள் database overloaded ஆக உள்ளது.

---

## Standard Mode vs. Advanced Mode

Database Insights இரண்டு tiers-ல் இயங்குகிறது. Standard mode இயல்பாக இயக்கப்பட்டு கூடுதல் செலவு இல்லை. Advanced mode Performance Insights-ஐ 15-month retention period-உடன் இயக்க வேண்டும்.

| அம்சம் | Standard | Advanced |
|---|:---:|:---:|
| Top DB Load contributors-ஐ dimension மூலம் பகுப்பாய்வு | ✔ | ✔ |
| மெட்ரிக்குகளை Query, graph மற்றும் alarm (7-day retention) | ✔ | ✔ |
| Fleet-wide monitoring views | ✘ | ✔ |
| SQL lock analysis (15-month retention) | ✘ | ✔ (Aurora PG) |
| SQL execution plan analysis | ✘ | ✔ |
| Slow SQL query analysis | ✘ | ✔ |
| Application Signals integration | ✘ | ✔ |
| On-demand performance analysis reports | ✘ | ✔ |
| Cross-account cross-region monitoring | ✘ | ✔ |

---

## முக்கிய அம்சங்கள்

### Fleet Health Dashboard

Fleet Health Dashboard உங்கள் அனைத்து RDS மற்றும் Aurora instances-ஐ cross-account மற்றும் cross-region ஒரே திரையில் bird's-eye view வழங்குகிறது.

### DB Load Analysis

Instance Dashboard-இன் DB Load Analysis tab-ல் troubleshooting நேரத்தை அதிகம் செலவிடுவீர்கள். இது ஐந்து W-களுக்கு பதிலளிக்கிறது:

- **WHAT** -- எந்த queries load உருவாக்குகின்றன என்பதை SQL மூலம் slice செய்யவும்.
- **WHO** -- பொறுப்பான party-ஐ அடையாளம் காண User அல்லது Application மூலம் slice செய்யவும்.
- **WHERE** -- source machine-ஐ கண்டறிய Host மூலம் slice செய்யவும்.
- **WHEN** -- issues எப்போது தொடங்கி நின்றன என்பதை timeline காட்டுகிறது.
- **WHY** -- findings-ஐ correlate செய்து நடவடிக்கை எடுக்கவும்.

### Lock Analysis

Aurora PostgreSQL மற்றும் RDS for PostgreSQL-க்கு கிடைக்கிறது. Database Insights lock snapshots-ஐ ஒவ்வொரு 15 வினாடிகளுக்கும் capture செய்து lock trees ஆக visualize செய்கிறது.

### Execution Plan Analysis

Aurora PostgreSQL (v14.10+, v15.5+), RDS for Oracle மற்றும் RDS for SQL Server-க்கு கிடைக்கிறது.

### On-Demand Performance Analysis

எந்த time window-ஐயும் தேர்ந்தெடுத்து automated, ML-powered analysis-ஐ trigger செய்யலாம்.

---

## வரம்புகள்

- **Lock analysis** Aurora PostgreSQL மற்றும் RDS for PostgreSQL-க்கு மட்டுமே கிடைக்கிறது.
- **Execution plan analysis** Aurora PostgreSQL (v14.10+/v15.5+), RDS for Oracle மற்றும் RDS for SQL Server-க்கு மட்டுமே.
- Advanced mode vCPU-hour (provisioned) அல்லது ACU-hour (serverless) அடிப்படையில் விலை நிர்ணயிக்கப்படுகிறது.

---

## சிறந்த நடைமுறைகள்

### Standard-இல் தொடங்கி, உத்தியோடு Upgrade செய்யவும்

Standard mode இலவசம், 7-day retention-உடன் DB Load analysis வழங்குகிறது. Production-critical databases-ல் Advanced mode இயக்கவும்.

### உங்கள் Instances-ஐ நிலையாக Tag செய்யவும்

Database Insights fleet views tags மூலம் filter செய்கிறது. நிலையான tagging strategy (எ.கா., `environment`, `service`, `team`) ஏற்றுக்கொள்ளவும்.

### DB Load-ல் Alarms அமைக்கவும்

உங்கள் instance-இன் vCPU count-உடன் தொடர்புடைய `DBLoad` metric-ல் CloudWatch Alarms உருவாக்கவும்.

---

## முடிவுரை

CloudWatch Database Insights முன்பு பல கருவிகள் தேவைப்பட்டவற்றை -- Performance Insights, CloudWatch Metrics, CloudWatch Logs, RDS console -- ஒரே guided அனுபவத்தில் ஒருங்கிணைக்கிறது.

---

## குறிப்புகள்

- [CloudWatch Database Insights Documentation](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Database-Insights.html)
- [Get Started with Database Insights](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Database-Insights-Get-Started.html)
- [Amazon CloudWatch Pricing](https://aws.amazon.com/cloudwatch/pricing/)

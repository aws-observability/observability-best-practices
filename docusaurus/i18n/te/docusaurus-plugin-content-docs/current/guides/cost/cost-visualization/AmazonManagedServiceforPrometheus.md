# రియల్-టైమ్ ఖర్చు మానిటరింగ్

Amazon Managed Service for Prometheus అనేది container metrics కోసం serverless, Prometheus-compatible monitoring service, ఇది container environments ను scale లో సురక్షితంగా monitor చేయడం సులభం చేస్తుంది. Amazon Managed Service for Prometheus pricing model Metric samples ingested, Query samples processed మరియు Metrics stored ఆధారంగా ఉంటుంది. తాజా pricing details [ఇక్కడ][pricing] చూడవచ్చు.

Managed service గా, Amazon Managed Service for Prometheus workloads scale up మరియు down అయినప్పుడు operational metrics ingestion, storage మరియు querying ను automatically scale చేస్తుంది. మా కొందరు కస్టమర్లు `metric samples ingestion rate` మరియు దాని cost real-time track చేయడం ఎలాగో guidance అడిగారు. దీన్ని ఎలా achieve చేయగలరో explore చేద్దాం.

### సొల్యూషన్
Amazon Managed Service for Prometheus Amazon CloudWatch కు [usage metrics vend చేస్తుంది][vendedmetrics]. ఈ metrics మీ Amazon Managed Service for Prometheus workspace లో better visibility పొందడానికి ఉపయోగించవచ్చు. Vended metrics CloudWatch లో `AWS/Usage` మరియు `AWS/Prometheus` namespaces లో కనుగొనవచ్చు మరియు ఈ [metrics][AMPMetrics] CloudWatch లో additional charge లేకుండా available. ఈ metrics further explore చేసి visualize చేయడానికి CloudWatch dashboard ఎల్లప్పుడూ create చేయవచ్చు.

ఈ రోజు, Amazon CloudWatch ను Amazon Managed Grafana కోసం data-source గా ఉపయోగిస్తూ, ఆ metrics visualize చేయడానికి Grafana లో dashboards build చేస్తారు. Architecture diagram క్రింది illustrate చేస్తుంది.

- Amazon Managed Service for Prometheus Amazon CloudWatch కు vended metrics publish చేస్తోంది

- Amazon CloudWatch Amazon Managed Grafana కోసం data-source గా

- Users Amazon Managed Grafana లో create చేయబడిన dashboards access చేస్తున్నారు

![prometheus-ingestion-rate](../../../images/ampmetricsingestionrate.png)

### Amazon Managed Grafana Dashboards

Amazon Managed Grafana లో create చేయబడిన dashboard మీకు visualize చేయడానికి enable చేస్తుంది;

1. Workspace వారీగా Prometheus Ingestion Rate
![prometheus-ingestion-rate-dash1](../../../images/ampwsingestionrate-1.png)

2. Workspace వారీగా Prometheus Ingestion Rate మరియు Real-time Cost
   Real-time cost tracking కోసం, official [AWS pricing document][pricing] లో mention చేయబడిన `First 2 billion samples` కోసం `Metrics Ingested Tier` pricing ఆధారంగా `math expression` ఉపయోగిస్తారు. Math operations numbers మరియు time series ను input గా తీసుకుని different numbers మరియు time series గా change చేస్తాయి, మీ business requirements కు fit అయ్యేలా further customization కోసం ఈ [document][mathexpression] refer చేయండి.
![prometheus-ingestion-rate-dash2](../../../images/ampwsingestionrate-2.png)

3. Workspace వారీగా Prometheus Active Series
![prometheus-ingestion-rate-dash3](../../../images/ampwsingestionrate-3.png)


Grafana లో dashboard JSON object ద్వారా represent చేయబడుతుంది, ఇది dashboard metadata store చేస్తుంది. Dashboard metadata dashboard properties, panels నుండి metadata, template variables, panel queries మొదలైనవి include చేస్తుంది.

పై dashboard యొక్క **JSON template** ను <mark>[ఇక్కడ](AmazonPrometheusMetrics.json)</mark> access చేయవచ్చు.

Preceding dashboard తో, ఇప్పుడు workspace వారీగా ingestion rate identify చేయవచ్చు మరియు Amazon Managed Service for Prometheus కోసం metrics ingestion rate ఆధారంగా workspace వారీగా real-time cost monitor చేయవచ్చు. మీ requirements కు suit అయ్యేలా visuals build చేయడానికి ఇతర Grafana [dashboard panels][panels] ఉపయోగించవచ్చు.

[pricing]: https://aws.amazon.com/prometheus/pricing/
[AMPMetrics]: https://docs.aws.amazon.com/prometheus/latest/userguide/AMP-CW-usage-metrics.html
[vendedmetrics]: https://aws.amazon.com/blogs/mt/introducing-vended-metrics-for-amazon-managed-service-for-prometheus/
[mathexpression]: https://grafana.com/docs/grafana/latest/panels-visualizations/query-transform-data/expression-queries/#math
[panels]: https://docs.aws.amazon.com/grafana/latest/userguide/Grafana-panels.html

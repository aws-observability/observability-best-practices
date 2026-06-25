# Resource tags ద్వారా filter చేసిన metrics aggregate మరియు visualize చేయడానికి Amazon CloudWatch Metrics explorer ఉపయోగించడం

ఈ recipe లో resource tags మరియు resource properties ద్వారా metrics filter, aggregate మరియు visualize చేయడానికి Metrics explorer ఎలా ఉపయోగించాలో చూపిస్తాము - [Tags మరియు properties ద్వారా resources monitor చేయడానికి metrics explorer ఉపయోగించండి][metrics-explorer].

Metrics explorer తో visualizations create చేయడానికి అనేక మార్గాలు ఉన్నాయి; ఈ walkthrough లో AWS Console ను leverage చేస్తాము.

:::note
    ఈ గైడ్ complete చేయడానికి సుమారు 5 నిమిషాలు పడుతుంది.
:::
## Prerequisites

* AWS account కు access
* AWS Console ద్వారా Amazon CloudWatch Metrics explorer కు access
* Relevant resources కోసం Resource tags set చేయబడి ఉండాలి


## Metrics Explorer tag based queries మరియు visualizations

* CloudWatch console open చేయండి

* <b>Metrics</b> కింద, <b>Explorer</b> menu click చేయండి

![Tag ద్వారా filter చేసిన metrics యొక్క Screen shot](../images/metrics-explorer-filter-by-tags/metrics-explorer-cw-menu.png)

* <b>Generic templates</b> లేదా <b>Service based templates</b> list నుండి choose చేయవచ్చు; ఈ example లో <b>EC2 Instances by type</b> template ఉపయోగిస్తాము

![Tag ద్వారా filter చేసిన metrics యొక్క Screen shot](../images/metrics-explorer-filter-by-tags/metrics-explorer-templates-ec2-by-type.png)

* Explore చేయాలనుకుంటున్న metrics choose చేయండి; obsolete ones remove చేసి, చూడాలనుకుంటున్న ఇతర metrics add చేయండి

![EC2 metrics యొక్క Screen shot](../images/metrics-explorer-filter-by-tags/metrics-explorer-ec2-metrics.png)

* <b>From</b> కింద, మీరు వెతుకుతున్న resource tag లేదా resource property choose చేయండి; క్రింద example లో <b>Name: TeamX</b> Tag ఉన్న different EC2 instances కోసం CPU మరియు Network related metrics సంఖ్య చూపిస్తాము

![Name tag example యొక్క Screen shot](../images/metrics-explorer-filter-by-tags/metrics-explorer-teamx-name-tag.png)

* గమనించండి, <b>Aggregated by</b> కింద aggregation function ఉపయోగించి time series combine చేయవచ్చు; క్రింద example లో <b>TeamX</b> metrics <b>Availability Zone</b> ద్వారా aggregated

![Tag Name ద్వారా filter చేసిన EC2 dashboard యొక్క Screen shot](../images/metrics-explorer-filter-by-tags/metrics-explorer-ec2-by-tag-name-dashboard.png)

Alternatively, <b>Team</b> Tag ద్వారా <b>TeamX</b> మరియు <b>TeamY</b> aggregate చేయవచ్చు, లేదా మీ needs కు suit అయ్యే ఏదైనా ఇతర configuration choose చేయవచ్చు

![Tag Team ద్వారా filter చేసిన EC2 dashboard యొక్క Screen shot](../images/metrics-explorer-filter-by-tags/metrics-explorer-ec2-by-tag-team-dashboard.png)

## Dynamic visualizations
<b>From</b>, <b>Aggregated by</b> మరియు <b>Split by</b> options ఉపయోగించి resulting visualizations easily customize చేయవచ్చు. Metrics explorer visualizations dynamic, కాబట్టి ఏదైనా new tagged resource automatically explorer widget లో appear అవుతుంది.

## Reference

Metrics explorer గురించి మరింత సమాచారం కోసం ఈ article refer చేయండి:
https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-Metrics-Explorer.html

[metrics-explorer]: https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-Metrics-Explorer.html

---
sidebar_position: 2
---
# Resource Configuration Tracking

AWS Config [supported AWS resources](https://docs.aws.amazon.com/config/latest/developerguide/resource-config-reference.html) యొక్క configuration ను record చేస్తుంది మరియు track చేస్తుంది, మీ AWS account లో ఈ resources యొక్క inventory ను వాటి current మరియు historical configurations తో పాటు create చేస్తుంది. ఇది configuration changes యొక్క timeline ను కూడా create చేస్తుంది మరియు మీ AWS infrastructure అంతటా resource attributes, relationships, మరియు dependencies గురించి detailed information ను maintain చేస్తుంది. Users AWS Management Console ద్వారా లేదా AWS CLI ద్వారా programmatically [compliance history మరియు timeline ను view](https://docs.aws.amazon.com/config/latest/developerguide/view-manage-resource-console.html) చేయగలరు, ఏ సమయంలోనైనా specific configuration states ను query చేయగల ability తో.


![AWS Config Cost Visualization](/img/cloudops/guides/config/resourcetimeline.png)

### AWS Config custom resources

AWS Config [custom config resources](https://docs.aws.amazon.com/config/latest/developerguide/customresources.html) ద్వారా supported AWS resources కు మించి దాని configuration tracking capabilities ను extend చేయడానికి మిమ్మల్ని అనుమతిస్తుంది. ఈ feature non-supported AWS resources ను monitor చేయడానికి మరియు on-premises servers, GitHub repositories, మరియు ఇతర third-party resources వంటి external resources ను track చేయడానికి ప్రారంభిస్తుంది. Configure చేసిన తర్వాత, మీరు third-party resource configuration data ను AWS Config కు publish చేయగలరు మరియు AWS Config console మరియు APIs ద్వారా మీ complete resource inventory ను view చేయగలరు మరియు monitor చేయగలరు. అదనంగా, మీరు AWS Config rules, conformance packs, best practices, internal policies, మరియు regulatory requirements ఉపయోగించి configuration compliance ను evaluate చేయగలరు.

AWS Config ఉపయోగించి non-standard features ను monitor చేయడం ఎలాగో తెలుసుకోవడానికి [ఈ blog post ను follow చేయండి](https://aws.amazon.com/blogs/mt/using-aws-config-custom-resources-to-track-any-resource-on-aws/). [ఈ blog post](https://aws.amazon.com/blogs/mt/simplify-compliance-management-of-multicloud-or-hybrid-resources-with-aws-config/) ఇతర cloud providers పై hosted resources ను monitor చేయడం ఎలాగో walk-through ను అందిస్తుంది.

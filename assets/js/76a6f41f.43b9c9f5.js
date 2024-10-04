"use strict";(self.webpackChunkobservability_best_practices=self.webpackChunkobservability_best_practices||[]).push([[7618],{54222:(e,n,a)=>{a.r(n),a.d(n,{assets:()=>l,contentTitle:()=>r,default:()=>h,frontMatter:()=>o,metadata:()=>i,toc:()=>d});var t=a(74848),s=a(28453);const o={},r="Using Athena in Amazon Managed Grafana",i={id:"recipes/recipes/amg-athena-plugin",title:"Using Athena in Amazon Managed Grafana",description:"In this recipe we show you how to use Amazon Athena\u2014a serverless,",source:"@site/docs/recipes/recipes/amg-athena-plugin.md",sourceDirName:"recipes/recipes",slug:"/recipes/recipes/amg-athena-plugin",permalink:"/observability-best-practices/docs/recipes/recipes/amg-athena-plugin",draft:!1,unlisted:!1,editUrl:"https://github.com/aws-observability/observability-best-practices/blob/main/docusaurus/docs/recipes/recipes/amg-athena-plugin.md",tags:[],version:"current",frontMatter:{}},l={},d=[{value:"Prerequisites",id:"prerequisites",level:2},{value:"Infrastructure",id:"infrastructure",level:2},{value:"Set up Amazon Athena",id:"set-up-amazon-athena",level:3},{value:"Load geographical data",id:"load-geographical-data",level:4},{value:"Load VPC flow logs data",id:"load-vpc-flow-logs-data",level:4},{value:"Set up Grafana",id:"set-up-grafana",level:3},{value:"Usage",id:"usage",level:2},{value:"Use geographical data",id:"use-geographical-data",level:3},{value:"Use VPC flow logs data",id:"use-vpc-flow-logs-data",level:3},{value:"Cleanup",id:"cleanup",level:2}];function c(e){const n={a:"a",admonition:"admonition",code:"code",h1:"h1",h2:"h2",h3:"h3",h4:"h4",img:"img",li:"li",ol:"ol",p:"p",pre:"pre",ul:"ul",...(0,s.R)(),...e.components};return(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)(n.h1,{id:"using-athena-in-amazon-managed-grafana",children:"Using Athena in Amazon Managed Grafana"}),"\n",(0,t.jsxs)(n.p,{children:["In this recipe we show you how to use ",(0,t.jsx)(n.a,{href:"https://aws.amazon.com/athena/",children:"Amazon Athena"}),"\u2014a serverless,\ninteractive query service allowing you to analyze data in Amazon S3 using\nstandard SQL\u2014in ",(0,t.jsx)(n.a,{href:"https://aws.amazon.com/grafana/",children:"Amazon Managed Grafana"}),". This integration\nis enabled by the ",(0,t.jsx)(n.a,{href:"https://grafana.com/grafana/plugins/grafana-athena-datasource/",children:"Athena data source for Grafana"}),", an open source\nplugin available for you to use in any DIY Grafana instance as well as\npre-installed in Amazon Managed Grafana."]}),"\n",(0,t.jsx)(n.admonition,{type:"note",children:(0,t.jsx)(n.p,{children:"This guide will take approximately 20 minutes to complete."})}),"\n",(0,t.jsx)(n.h2,{id:"prerequisites",children:"Prerequisites"}),"\n",(0,t.jsxs)(n.ul,{children:["\n",(0,t.jsxs)(n.li,{children:["The ",(0,t.jsx)(n.a,{href:"https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-install.html",children:"AWS CLI"})," is installed and ",(0,t.jsx)(n.a,{href:"https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-configure.html",children:"configured"})," in your environment."]}),"\n",(0,t.jsx)(n.li,{children:"You have access to Amazon Athena from your account."}),"\n"]}),"\n",(0,t.jsx)(n.h2,{id:"infrastructure",children:"Infrastructure"}),"\n",(0,t.jsx)(n.p,{children:"Let's first set up the necessary infrastructure."}),"\n",(0,t.jsx)(n.h3,{id:"set-up-amazon-athena",children:"Set up Amazon Athena"}),"\n",(0,t.jsx)(n.p,{children:"We want to see how to use Athena in two different scenarios: one scenario around\ngeographical data along with the Geomap plugin, and one in a security-relevant\nscenario around VPC flow logs."}),"\n",(0,t.jsx)(n.p,{children:"First, let's make sure Athena is set up and the datasets are loaded."}),"\n",(0,t.jsx)(n.admonition,{type:"warning",children:(0,t.jsx)(n.p,{children:"You have to use the Amazon Athena console to execute these queries. Grafana\nin general has read-only access to the data sources, so can not be used\nto create or update data."})}),"\n",(0,t.jsx)(n.h4,{id:"load-geographical-data",children:"Load geographical data"}),"\n",(0,t.jsxs)(n.p,{children:["In this first use case we use a dataset from the ",(0,t.jsx)(n.a,{href:"https://registry.opendata.aws/",children:"Registry of Open Data on AWS"}),".\nMore specifically, we will use ",(0,t.jsx)(n.a,{href:"https://aws.amazon.com/blogs/big-data/querying-openstreetmap-with-amazon-athena/",children:"OpenStreetMap"})," (OSM) to demonstrate\nthe usage of the Athena plugin for a geographical data motivated use case.\nFor that to work, we need to first get the OSM data into Athena."]}),"\n",(0,t.jsxs)(n.p,{children:["So, first off, create a new database in Athena. Go to the ",(0,t.jsx)(n.a,{href:"https://console.aws.amazon.com/athena/",children:"Athena\nconsole"})," and there use the following three\nSQL queries to import the OSM data into the database."]}),"\n",(0,t.jsx)(n.p,{children:"Query 1:"}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-sql",children:"CREATE EXTERNAL TABLE planet (\n  id BIGINT,\n  type STRING,\n  tags MAP<STRING,STRING>,\n  lat DECIMAL(9,7),\n  lon DECIMAL(10,7),\n  nds ARRAY<STRUCT<ref: BIGINT>>,\n  members ARRAY<STRUCT<type: STRING, ref: BIGINT, role: STRING>>,\n  changeset BIGINT,\n  timestamp TIMESTAMP,\n  uid BIGINT,\n  user STRING,\n  version BIGINT\n)\nSTORED AS ORCFILE\nLOCATION 's3://osm-pds/planet/';\n"})}),"\n",(0,t.jsx)(n.p,{children:"Query 2:"}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-sql",children:"CREATE EXTERNAL TABLE planet_history (\n    id BIGINT,\n    type STRING,\n    tags MAP<STRING,STRING>,\n    lat DECIMAL(9,7),\n    lon DECIMAL(10,7),\n    nds ARRAY<STRUCT<ref: BIGINT>>,\n    members ARRAY<STRUCT<type: STRING, ref: BIGINT, role: STRING>>,\n    changeset BIGINT,\n    timestamp TIMESTAMP,\n    uid BIGINT,\n    user STRING,\n    version BIGINT,\n    visible BOOLEAN\n)\nSTORED AS ORCFILE\nLOCATION 's3://osm-pds/planet-history/';\n"})}),"\n",(0,t.jsx)(n.p,{children:"Query 3:"}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-sql",children:"CREATE EXTERNAL TABLE changesets (\n    id BIGINT,\n    tags MAP<STRING,STRING>,\n    created_at TIMESTAMP,\n    open BOOLEAN,\n    closed_at TIMESTAMP,\n    comments_count BIGINT,\n    min_lat DECIMAL(9,7),\n    max_lat DECIMAL(9,7),\n    min_lon DECIMAL(10,7),\n    max_lon DECIMAL(10,7),\n    num_changes BIGINT,\n    uid BIGINT,\n    user STRING\n)\nSTORED AS ORCFILE\nLOCATION 's3://osm-pds/changesets/';\n"})}),"\n",(0,t.jsx)(n.h4,{id:"load-vpc-flow-logs-data",children:"Load VPC flow logs data"}),"\n",(0,t.jsxs)(n.p,{children:["The second use case is a security-motivated one: analyzing network traffic\nusing ",(0,t.jsx)(n.a,{href:"https://docs.aws.amazon.com/vpc/latest/userguide/flow-logs.html",children:"VPC Flow Logs"}),"."]}),"\n",(0,t.jsxs)(n.p,{children:["First, we need to tell EC2 to generate VPC Flow Logs for us. So, if you have\nnot done this already, you go ahead now and ",(0,t.jsx)(n.a,{href:"https://docs.aws.amazon.com/vpc/latest/userguide/flow-logs-s3.html#flow-logs-s3-create-flow-log",children:"create VPC flow logs"}),"\neither on the network interfaces level, subnet level, or VPC level."]}),"\n",(0,t.jsx)(n.admonition,{type:"note",children:(0,t.jsxs)(n.p,{children:["To improve query performance and minimize the storage footprint, we store\nthe VPC flow logs in ",(0,t.jsx)(n.a,{href:"https://github.com/apache/parquet-format",children:"Parquet"}),", a columnar storage format\nthat supports nested data."]})}),"\n",(0,t.jsx)(n.p,{children:"For our setup it doesn't matter what option you choose (network interfaces,\nsubnet, or VPC), as long as you publish them to an S3 bucket in Parquet format\nas shown below:"}),"\n",(0,t.jsx)(n.p,{children:(0,t.jsx)(n.img,{alt:"Screen shot of the EC2 console &quot;Create flow log&quot; panel",src:a(75014).A+"",width:"2166",height:"326"})}),"\n",(0,t.jsxs)(n.p,{children:["Now, again via the ",(0,t.jsx)(n.a,{href:"https://console.aws.amazon.com/athena/",children:"Athena console"}),", create the table for the\nVPC flow logs data in the same database you imported the OSM data, or create a new one,\nif you prefer to do so."]}),"\n",(0,t.jsxs)(n.p,{children:["Use the following SQL query and make sure that you're replacing\n",(0,t.jsx)(n.code,{children:"VPC_FLOW_LOGS_LOCATION_IN_S3"})," with your own bucket/folder:"]}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-sql",children:"CREATE EXTERNAL TABLE vpclogs (\n  `version` int, \n  `account_id` string, \n  `interface_id` string, \n  `srcaddr` string, \n  `dstaddr` string, \n  `srcport` int, \n  `dstport` int, \n  `protocol` bigint, \n  `packets` bigint, \n  `bytes` bigint, \n  `start` bigint, \n  `end` bigint, \n  `action` string, \n  `log_status` string, \n  `vpc_id` string, \n  `subnet_id` string, \n  `instance_id` string, \n  `tcp_flags` int, \n  `type` string, \n  `pkt_srcaddr` string, \n  `pkt_dstaddr` string, \n  `region` string, \n  `az_id` string, \n  `sublocation_type` string, \n  `sublocation_id` string, \n  `pkt_src_aws_service` string, \n  `pkt_dst_aws_service` string, \n  `flow_direction` string, \n  `traffic_path` int\n)\nSTORED AS PARQUET\nLOCATION 'VPC_FLOW_LOGS_LOCATION_IN_S3'\n"})}),"\n",(0,t.jsxs)(n.p,{children:["For example, ",(0,t.jsx)(n.code,{children:"VPC_FLOW_LOGS_LOCATION_IN_S3"})," could look something like the\nfollowing if you're using the S3 bucket ",(0,t.jsx)(n.code,{children:"allmyflowlogs"}),":"]}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{children:"s3://allmyflowlogs/AWSLogs/12345678901/vpcflowlogs/eu-west-1/2021/\n"})}),"\n",(0,t.jsx)(n.p,{children:"Now that the datasets are available in Athena, let's move on to Grafana."}),"\n",(0,t.jsx)(n.h3,{id:"set-up-grafana",children:"Set up Grafana"}),"\n",(0,t.jsxs)(n.p,{children:["We need a Grafana instance, so go ahead and set up a new ",(0,t.jsx)(n.a,{href:"https://console.aws.amazon.com/grafana/home#/workspaces",children:"Amazon Managed Grafana\nworkspace"}),", for example by using the ",(0,t.jsx)(n.a,{href:"https://aws.amazon.com/blogs/mt/amazon-managed-grafana-getting-started/",children:"Getting Started"})," guide,\nor use an existing one."]}),"\n",(0,t.jsxs)(n.admonition,{type:"warning",children:[(0,t.jsx)(n.p,{children:"To use AWS data source configuration, first go to the Amazon Managed Grafana\nconsole to enable service-mananged IAM roles that grant the workspace the\nIAM policies necessary to read the Athena resources.\nFurther, note the following:"}),(0,t.jsxs)(n.ol,{children:["\n",(0,t.jsxs)(n.li,{children:["The Athena workgroup you plan to use needs to be tagged with the key\n",(0,t.jsx)(n.code,{children:"GrafanaDataSource"})," and value ",(0,t.jsx)(n.code,{children:"true"})," for the service managed permissions\nto be permitted to use the workgroup."]}),"\n",(0,t.jsxs)(n.li,{children:["The service-managed IAM policy only grants access to query result buckets\nthat start with ",(0,t.jsx)(n.code,{children:"grafana-athena-query-results-"}),", so for any other bucket\nyou MUST add permissions manually."]}),"\n",(0,t.jsxs)(n.li,{children:["You have to add the ",(0,t.jsx)(n.code,{children:"s3:Get*"})," and ",(0,t.jsx)(n.code,{children:"s3:List*"})," permissions for the underlying data source\nbeing queried manually."]}),"\n"]})]}),"\n",(0,t.jsx)(n.p,{children:'To set up the Athena data source, use the left-hand toolbar and choose the\nlower AWS icon and then choose "Athena". Select your default region you want\nthe plugin to discover the Athena data source to use, and then select the\naccounts that you want, and finally choose "Add data source".'}),"\n",(0,t.jsx)(n.p,{children:"Alternatively, you can manually add and configure the Athena data source by\nfollowing these steps:"}),"\n",(0,t.jsxs)(n.ol,{children:["\n",(0,t.jsx)(n.li,{children:'Click on the "Configurations" icon on the left-hand toolbar and then on "Add data source".'}),"\n",(0,t.jsx)(n.li,{children:'Search for "Athena".'}),"\n",(0,t.jsx)(n.li,{children:"[OPTIONAL] Configure the authentication provider (recommended: workspace IAM\nrole)."}),"\n",(0,t.jsx)(n.li,{children:"Select your targeted Athena data source, database, and workgroup."}),"\n",(0,t.jsxs)(n.li,{children:["If your workgroup doesn't have an output location configured already,\nspecify the S3 bucket and folder to use for query results. Note that the\nbucket has to start with ",(0,t.jsx)(n.code,{children:"grafana-athena-query-results-"})," if you want to\nbenefit from the service-managed policy."]}),"\n",(0,t.jsx)(n.li,{children:'Click "Save & test".'}),"\n"]}),"\n",(0,t.jsx)(n.p,{children:"You should see something like the following:"}),"\n",(0,t.jsx)(n.p,{children:(0,t.jsx)(n.img,{alt:"Screen shot of the Athena data source config",src:a(26283).A+"",width:"1000",height:"1156"})}),"\n",(0,t.jsx)(n.h2,{id:"usage",children:"Usage"}),"\n",(0,t.jsx)(n.p,{children:"And now let's look at how to use our Athena datasets from Grafana."}),"\n",(0,t.jsx)(n.h3,{id:"use-geographical-data",children:"Use geographical data"}),"\n",(0,t.jsxs)(n.p,{children:["The ",(0,t.jsx)(n.a,{href:"https://aws.amazon.com/blogs/big-data/querying-openstreetmap-with-amazon-athena/",children:"OpenStreetMap"}),' (OSM) data in Athena can answer a number of questions,\nsuch as "where are certain amenities". Let\'s see that in action.']}),"\n",(0,t.jsx)(n.p,{children:"For example, a SQL query against the OSM dataset to list places that offer food\nin the Las Vegas region is as follows:"}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-sql",children:"SELECT \ntags['amenity'] AS amenity,\ntags['name'] AS name,\ntags['website'] AS website,\nlat, lon\nFROM planet\nWHERE type = 'node'\n  AND tags['amenity'] IN ('bar', 'pub', 'fast_food', 'restaurant')\n  AND lon BETWEEN -115.5 AND -114.5\n  AND lat BETWEEN 36.1 AND 36.3\nLIMIT 500;\n"})}),"\n",(0,t.jsx)(n.admonition,{type:"info",children:(0,t.jsxs)(n.p,{children:["The Las Vegas region in above query is defined as everything with a latitude\nbetween ",(0,t.jsx)(n.code,{children:"36.1"})," and ",(0,t.jsx)(n.code,{children:"36.3"})," as well as a longitude between ",(0,t.jsx)(n.code,{children:"-115.5"})," and ",(0,t.jsx)(n.code,{children:"-114.5"}),".\nYou could turn that into a set of variables (one for each corner) and make\nthe Geomap plugin adaptable to other regions."]})}),"\n",(0,t.jsxs)(n.p,{children:["To visualize the OSM data using above query, you can import an example dashboard,\navailable via ",(0,t.jsx)(n.a,{target:"_blank","data-noBrokenLinkCheck":!0,href:a(92454).A+"",children:"osm-sample-dashboard.json"}),"\nthat looks as follows:"]}),"\n",(0,t.jsx)(n.p,{children:(0,t.jsx)(n.img,{alt:"Screen shot of the OSM dashboard in AMG",src:a(15578).A+"",width:"2000",height:"1028"})}),"\n",(0,t.jsx)(n.admonition,{type:"note",children:(0,t.jsx)(n.p,{children:"In above screen shot we use the Geomap visualization (in the left panel) to\nplot the data points."})}),"\n",(0,t.jsx)(n.h3,{id:"use-vpc-flow-logs-data",children:"Use VPC flow logs data"}),"\n",(0,t.jsx)(n.p,{children:"To analyze the VPC flow log data, detecting SSH and RDP traffic, use the\nfollowing SQL queries."}),"\n",(0,t.jsx)(n.p,{children:"Getting a tabular overview on SSH/RDP traffic:"}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-sql",children:"SELECT\nsrcaddr, dstaddr, account_id, action, protocol, bytes, log_status\nFROM vpclogs\nWHERE\nsrcport in (22, 3389)\nOR\ndstport IN (22, 3389)\nORDER BY start ASC;\n"})}),"\n",(0,t.jsx)(n.p,{children:"Getting a time series view on bytes accepted and rejected:"}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-sql",children:"SELECT\nfrom_unixtime(start), sum(bytes), action\nFROM vpclogs\nWHERE\nsrcport in (22,3389)\nOR\ndstport IN (22, 3389)\nGROUP BY start, action\nORDER BY start ASC;\n"})}),"\n",(0,t.jsx)(n.admonition,{type:"tip",children:(0,t.jsxs)(n.p,{children:["If you want to limit the amount of data queried in Athena, consider using\nthe ",(0,t.jsx)(n.code,{children:"$__timeFilter"})," macro."]})}),"\n",(0,t.jsxs)(n.p,{children:["To visualize the VPC flow log data, you can import an example dashboard,\navailable via ",(0,t.jsx)(n.a,{target:"_blank","data-noBrokenLinkCheck":!0,href:a(51986).A+"",children:"vpcfl-sample-dashboard.json"}),"\nthat looks as follows:"]}),"\n",(0,t.jsx)(n.p,{children:(0,t.jsx)(n.img,{alt:"Screen shot of the VPC flow logs dashboard in AMG",src:a(33950).A+"",width:"2000",height:"1258"})}),"\n",(0,t.jsx)(n.p,{children:"From here, you can use the following guides to create your own dashboard in\nAmazon Managed Grafana:"}),"\n",(0,t.jsxs)(n.ul,{children:["\n",(0,t.jsx)(n.li,{children:(0,t.jsx)(n.a,{href:"https://docs.aws.amazon.com/grafana/latest/userguide/dashboard-overview.html",children:"User Guide: Dashboards"})}),"\n",(0,t.jsx)(n.li,{children:(0,t.jsx)(n.a,{href:"https://grafana.com/docs/grafana/latest/best-practices/best-practices-for-creating-dashboards/",children:"Best practices for creating dashboards"})}),"\n"]}),"\n",(0,t.jsx)(n.p,{children:"That's it, congratulations you've learned how to use Athena from Grafana!"}),"\n",(0,t.jsx)(n.h2,{id:"cleanup",children:"Cleanup"}),"\n",(0,t.jsx)(n.p,{children:"Remove the OSM data from the Athena database you've been using and then\nthe Amazon Managed Grafana workspace by removing it from the console."})]})}function h(e={}){const{wrapper:n}={...(0,s.R)(),...e.components};return n?(0,t.jsx)(n,{...e,children:(0,t.jsx)(c,{...e})}):c(e)}},92454:(e,n,a)=>{a.d(n,{A:()=>t});const t=a.p+"assets/files/osm-sample-dashboard-a2eb36d4a5549f553d3923f0074f78ba.json"},51986:(e,n,a)=>{a.d(n,{A:()=>t});const t=a.p+"assets/files/vpcfl-sample-dashboard-a1c359737597441a1ec5c7cab462d750.json"},15578:(e,n,a)=>{a.d(n,{A:()=>t});const t=a.p+"assets/images/amg-osm-dashboard-87c049298f043ec41e8e73d737293738.png"},26283:(e,n,a)=>{a.d(n,{A:()=>t});const t=a.p+"assets/images/amg-plugin-athena-ds-ce625af5d75f2e31593ade07eb989f5f.png"},33950:(e,n,a)=>{a.d(n,{A:()=>t});const t=a.p+"assets/images/amg-vpcfl-dashboard-d603da5a7d72423c3236c4041a8b3896.png"},75014:(e,n,a)=>{a.d(n,{A:()=>t});const t=a.p+"assets/images/ec2-vpc-flowlogs-creation-43014f36da0f4fe6396f53ac3ee0d293.png"},28453:(e,n,a)=>{a.d(n,{R:()=>r,x:()=>i});var t=a(96540);const s={},o=t.createContext(s);function r(e){const n=t.useContext(o);return t.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function i(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(s):e.components||s:r(e.components),t.createElement(o.Provider,{value:n},e.children)}}}]);
"use strict";(self.webpackChunkobservability_best_practices=self.webpackChunkobservability_best_practices||[]).push([[1092],{32011:(e,a,n)=>{n.r(a),n.d(a,{assets:()=>l,contentTitle:()=>s,default:()=>h,frontMatter:()=>o,metadata:()=>i,toc:()=>d});var r=n(74848),t=n(28453);const o={},s="Using Terraform for Amazon Managed Grafana automation",i={id:"recipes/recipes/amg-automation-tf",title:"Using Terraform for Amazon Managed Grafana automation",description:"In this recipe we show you how use Terraform to automate Amazon Managed Grafana,",source:"@site/docs/recipes/recipes/amg-automation-tf.md",sourceDirName:"recipes/recipes",slug:"/recipes/recipes/amg-automation-tf",permalink:"/observability-best-practices/recipes/recipes/amg-automation-tf",draft:!1,unlisted:!1,editUrl:"https://github.com/aws-observability/observability-best-practices/blob/main/docusaurus/docs/recipes/recipes/amg-automation-tf.md",tags:[],version:"current",frontMatter:{}},l={},d=[{value:"Prerequisites",id:"prerequisites",level:2},{value:"Set up Amazon Managed Grafana",id:"set-up-amazon-managed-grafana",level:2},{value:"Automation with Terraform",id:"automation-with-terraform",level:2},{value:"Preparing Terraform",id:"preparing-terraform",level:3},{value:"Using Terraform",id:"using-terraform",level:3},{value:"Cleanup",id:"cleanup",level:2}];function c(e){const a={a:"a",admonition:"admonition",code:"code",h1:"h1",h2:"h2",h3:"h3",img:"img",li:"li",p:"p",pre:"pre",ul:"ul",...(0,t.R)(),...e.components};return(0,r.jsxs)(r.Fragment,{children:[(0,r.jsx)(a.h1,{id:"using-terraform-for-amazon-managed-grafana-automation",children:"Using Terraform for Amazon Managed Grafana automation"}),"\n",(0,r.jsx)(a.p,{children:"In this recipe we show you how use Terraform to automate Amazon Managed Grafana,\nfor example to add datasources or dashboards consistently across a number of workspaces."}),"\n",(0,r.jsx)(a.admonition,{type:"note",children:(0,r.jsx)(a.p,{children:"This guide will take approximately 30 minutes to complete."})}),"\n",(0,r.jsx)(a.h2,{id:"prerequisites",children:"Prerequisites"}),"\n",(0,r.jsxs)(a.ul,{children:["\n",(0,r.jsxs)(a.li,{children:["The ",(0,r.jsx)(a.a,{href:"https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-install.html",children:"AWS command line"})," is installed and ",(0,r.jsx)(a.a,{href:"https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-configure.html",children:"configured"})," in your local environment."]}),"\n",(0,r.jsxs)(a.li,{children:["You have the ",(0,r.jsx)(a.a,{href:"https://www.terraform.io/downloads.html",children:"Terraform"})," command line installed in your local environment."]}),"\n",(0,r.jsx)(a.li,{children:"You have an Amazon Managed Service for Prometheus workspace ready to use."}),"\n",(0,r.jsx)(a.li,{children:"You have an Amazon Managed Grafana workspace ready to use."}),"\n"]}),"\n",(0,r.jsx)(a.h2,{id:"set-up-amazon-managed-grafana",children:"Set up Amazon Managed Grafana"}),"\n",(0,r.jsxs)(a.p,{children:["In order for Terraform to ",(0,r.jsx)(a.a,{href:"https://grafana.com/docs/grafana/latest/http_api/auth/",children:"authenticate"})," against Grafana, we are\nusing an API Key, which acts as a kind of password."]}),"\n",(0,r.jsx)(a.admonition,{type:"info",children:(0,r.jsxs)(a.p,{children:["The API key is an ",(0,r.jsx)(a.a,{href:"https://datatracker.ietf.org/doc/html/rfc6750",children:"RFC 6750"})," HTTP Bearer header\nwith a 51 character long alpha-numeric value authenticating the caller with\nevery request against the Grafana API."]})}),"\n",(0,r.jsx)(a.p,{children:"So, before we can set up the Terraform manifest, we first need to create an\nAPI key. You do this via the Grafana UI as follows."}),"\n",(0,r.jsxs)(a.p,{children:["First, select from the left-hand side menu in the ",(0,r.jsx)(a.code,{children:"Configuration"})," section\nthe ",(0,r.jsx)(a.code,{children:"API keys"})," menu item:"]}),"\n",(0,r.jsx)(a.p,{children:(0,r.jsx)(a.img,{alt:"Configuration, API keys menu item",src:n(66295).A+"",width:"216",height:"307"})}),"\n",(0,r.jsxs)(a.p,{children:["Now create a new API key, give it a name that makes sense for your task at\nhand, assign it ",(0,r.jsx)(a.code,{children:"Admin"})," role and set the duration time to, for example, one day:"]}),"\n",(0,r.jsx)(a.p,{children:(0,r.jsx)(a.img,{alt:"API key creation",src:n(68286).A+"",width:"1000",height:"163"})}),"\n",(0,r.jsx)(a.admonition,{type:"note",children:(0,r.jsx)(a.p,{children:"The API key is valid for a limited time, in AMG you can use values up to 30 days."})}),"\n",(0,r.jsxs)(a.p,{children:["Once you hit the ",(0,r.jsx)(a.code,{children:"Add"})," button you should see a pop-up dialog that contains the\nAPI key:"]}),"\n",(0,r.jsx)(a.p,{children:(0,r.jsx)(a.img,{alt:"API key result",src:n(68470).A+"",width:"500",height:"253"})}),"\n",(0,r.jsx)(a.admonition,{type:"warning",children:(0,r.jsx)(a.p,{children:"This is the only time you will see the API key, so store it from here\nin a safe place, we will need it in the Terraform manifest later."})}),"\n",(0,r.jsx)(a.p,{children:"With this we've set up everything we need in Amazon Managed Grafana in order to\nuse Terraform for automation, so let's move on to this step."}),"\n",(0,r.jsx)(a.h2,{id:"automation-with-terraform",children:"Automation with Terraform"}),"\n",(0,r.jsx)(a.h3,{id:"preparing-terraform",children:"Preparing Terraform"}),"\n",(0,r.jsxs)(a.p,{children:["For Terraform to be able to interact with Grafana, we're using the official\n",(0,r.jsx)(a.a,{href:"https://registry.terraform.io/providers/grafana/grafana/latest/docs",children:"Grafana provider"})," in version 1.13.3 or above."]}),"\n",(0,r.jsxs)(a.p,{children:["In the following, we want to automate the creation of a data source, in our\ncase we want to add a Prometheus ",(0,r.jsx)(a.a,{href:"https://registry.terraform.io/providers/grafana/grafana/latest/docs/resources/data_source",children:"data source"}),", to be exact, an\nAMP workspace."]}),"\n",(0,r.jsxs)(a.p,{children:["First, create a file called ",(0,r.jsx)(a.code,{children:"main.tf"})," with the following content:"]}),"\n",(0,r.jsx)(a.pre,{children:(0,r.jsx)(a.code,{children:'terraform {\n  required_providers {\n    grafana = {\n      source  = "grafana/grafana"\n      version = ">= 1.13.3"\n    }\n  }\n}\n\nprovider "grafana" {\n  url  = "INSERT YOUR GRAFANA WORKSPACE URL HERE"\n  auth = "INSERT YOUR API KEY HERE"\n}\n\nresource "grafana_data_source" "prometheus" {\n  type          = "prometheus"\n  name          = "amp"\n  is_default    = true\n  url           = "INSERT YOUR AMP WORKSPACE URL HERE "\n  json_data {\n\thttp_method     = "POST"\n\tsigv4_auth      = true\n\tsigv4_auth_type = "workspace-iam-role"\n\tsigv4_region    = "eu-west-1"\n  }\n}\n'})}),"\n",(0,r.jsx)(a.p,{children:"In above file you need to insert three values that depend on your environment."}),"\n",(0,r.jsx)(a.p,{children:"In the Grafana provider section:"}),"\n",(0,r.jsxs)(a.ul,{children:["\n",(0,r.jsxs)(a.li,{children:[(0,r.jsx)(a.code,{children:"url"})," \u2026 the Grafana workspace URL which looks something like the following:\n",(0,r.jsx)(a.code,{children:"https://xxxxxxxx.grafana-workspace.eu-west-1.amazonaws.com"}),"."]}),"\n",(0,r.jsxs)(a.li,{children:[(0,r.jsx)(a.code,{children:"auth"})," \u2026 the API key you have created in the previous step."]}),"\n"]}),"\n",(0,r.jsxs)(a.p,{children:["In the Prometheus resource section, insert the ",(0,r.jsx)(a.code,{children:"url"})," which is the AMP\nworkspace URL in the form of\n",(0,r.jsx)(a.code,{children:"https://aps-workspaces.eu-west-1.amazonaws.com/workspaces/ws-xxxxxxxxx"}),"."]}),"\n",(0,r.jsx)(a.admonition,{type:"note",children:(0,r.jsxs)(a.p,{children:["If you're using Amazon Managed Grafana in a different region than the one\nshown in the file, you will have to, in addition to above, also set the\n",(0,r.jsx)(a.code,{children:"sigv4_region"})," to your region."]})}),"\n",(0,r.jsx)(a.p,{children:"To wrap up the preparation phase, let's now initialize Terraform:"}),"\n",(0,r.jsx)(a.pre,{children:(0,r.jsx)(a.code,{children:'$ terraform init\nInitializing the backend...\n\nInitializing provider plugins...\n- Finding grafana/grafana versions matching ">= 1.13.3"...\n- Installing grafana/grafana v1.13.3...\n- Installed grafana/grafana v1.13.3 (signed by a HashiCorp partner, key ID 570AA42029AE241A)\n\nPartner and community providers are signed by their developers.\nIf you\'d like to know more about provider signing, you can read about it here:\nhttps://www.terraform.io/docs/cli/plugins/signing.html\n\nTerraform has created a lock file .terraform.lock.hcl to record the provider\nselections it made above. Include this file in your version control repository\nso that Terraform can guarantee to make the same selections by default when\nyou run "terraform init" in the future.\n\nTerraform has been successfully initialized!\n\nYou may now begin working with Terraform. Try running "terraform plan" to see\nany changes that are required for your infrastructure. All Terraform commands\nshould now work.\n\nIf you ever set or change modules or backend configuration for Terraform,\nrerun this command to reinitialize your working directory. If you forget, other\ncommands will detect it and remind you to do so if necessary.\n'})}),"\n",(0,r.jsx)(a.p,{children:"With that, we're all set and can use Terraform to automate the data source\ncreation as explained in the following."}),"\n",(0,r.jsx)(a.h3,{id:"using-terraform",children:"Using Terraform"}),"\n",(0,r.jsx)(a.p,{children:"Usually, you would first have a look what Terraform's plan is, like so:"}),"\n",(0,r.jsx)(a.pre,{children:(0,r.jsx)(a.code,{children:'$ terraform plan\n\nTerraform used the selected providers to generate the following execution plan. \nResource actions are indicated with the following symbols:\n  + create\n\nTerraform will perform the following actions:\n\n  # grafana_data_source.prometheus will be created\n  + resource "grafana_data_source" "prometheus" {\n      + access_mode        = "proxy"\n      + basic_auth_enabled = false\n      + id                 = (known after apply)\n      + is_default         = true\n      + name               = "amp"\n      + type               = "prometheus"\n      + url                = "https://aps-workspaces.eu-west-1.amazonaws.com/workspaces/ws-xxxxxx/"\n\n      + json_data {\n          + http_method     = "POST"\n          + sigv4_auth      = true\n          + sigv4_auth_type = "workspace-iam-role"\n          + sigv4_region    = "eu-west-1"\n        }\n    }\n\nPlan: 1 to add, 0 to change, 0 to destroy.\n\n\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\n\nNote: You didn\'t use the -out option to save this plan, so Terraform can\'t guarantee to take exactly these actions if you run "terraform apply" now.\n\n'})}),"\n",(0,r.jsx)(a.p,{children:"If you're happy with what you see there, you can apply the plan:"}),"\n",(0,r.jsx)(a.pre,{children:(0,r.jsx)(a.code,{children:'$ terraform apply\n\nTerraform used the selected providers to generate the following execution plan. \nResource actions are indicated with the following symbols:\n  + create\n\nTerraform will perform the following actions:\n\n  # grafana_data_source.prometheus will be created\n  + resource "grafana_data_source" "prometheus" {\n      + access_mode        = "proxy"\n      + basic_auth_enabled = false\n      + id                 = (known after apply)\n      + is_default         = true\n      + name               = "amp"\n      + type               = "prometheus"\n      + url                = "https://aps-workspaces.eu-west-1.amazonaws.com/workspaces/ws-xxxxxxxxx/"\n\n      + json_data {\n          + http_method     = "POST"\n          + sigv4_auth      = true\n          + sigv4_auth_type = "workspace-iam-role"\n          + sigv4_region    = "eu-west-1"\n        }\n    }\n\nPlan: 1 to add, 0 to change, 0 to destroy.\n\nDo you want to perform these actions?\n  Terraform will perform the actions described above.\n  Only \'yes\' will be accepted to approve.\n\n  Enter a value: yes\n\ngrafana_data_source.prometheus: Creating...\ngrafana_data_source.prometheus: Creation complete after 1s [id=10]\n\nApply complete! Resources: 1 added, 0 changed, 0 destroyed.\n\n'})}),"\n",(0,r.jsx)(a.p,{children:"When you now go to the data source list in Grafana you should see something\nlike the following:"}),"\n",(0,r.jsx)(a.p,{children:(0,r.jsx)(a.img,{alt:"AMP as data source in AMG",src:n(65330).A+"",width:"1000",height:"1092"})}),"\n",(0,r.jsxs)(a.p,{children:["To verify if your newly created data source works, you can hit the blue ",(0,r.jsx)(a.code,{children:"Save & test"})," button at the bottom and you should see a ",(0,r.jsx)(a.code,{children:"Data source is working"}),"\nconfirmation message as a result here."]}),"\n",(0,r.jsxs)(a.p,{children:["You can use Terraform also to automate other things, for example, the ",(0,r.jsx)(a.a,{href:"https://registry.terraform.io/providers/grafana/grafana/latest/docs",children:"Grafana\nprovider"})," supports managing folders and dashboards."]}),"\n",(0,r.jsx)(a.p,{children:"Let's say you want to create a folder to organize your dashboards, for example:"}),"\n",(0,r.jsx)(a.pre,{children:(0,r.jsx)(a.code,{children:'resource "grafana_folder" "examplefolder" {\n  title = "devops"\n}\n'})}),"\n",(0,r.jsxs)(a.p,{children:["Further, say you have a dashboard called ",(0,r.jsx)(a.code,{children:"example-dashboard.json"}),", and you want\nto create it in the folder from above, then you would use the following snippet:"]}),"\n",(0,r.jsx)(a.pre,{children:(0,r.jsx)(a.code,{children:'resource "grafana_dashboard" "exampledashboard" {\n  folder = grafana_folder.examplefolder.id\n  config_json = file("example-dashboard.json")\n}\n'})}),"\n",(0,r.jsx)(a.p,{children:"Terraform is a powerful tool for automation and you can use it as shown here\nto manage your Grafana resources."}),"\n",(0,r.jsx)(a.admonition,{type:"note",children:(0,r.jsxs)(a.p,{children:["Keep in mind, though, that the ",(0,r.jsx)(a.a,{href:"https://www.terraform.io/docs/language/state/remote.html",children:"state in Terraform"})," is, by default,\nmanaged locally. This means, if you plan to collaboratively work with Terraform,\nyou need to pick one of the options available that allow you to share the state across a team."]})}),"\n",(0,r.jsx)(a.h2,{id:"cleanup",children:"Cleanup"}),"\n",(0,r.jsx)(a.p,{children:"Remove the Amazon Managed Grafana workspace by removing it from the console."})]})}function h(e={}){const{wrapper:a}={...(0,t.R)(),...e.components};return a?(0,r.jsx)(a,{...e,children:(0,r.jsx)(c,{...e})}):c(e)}},65330:(e,a,n)=>{n.d(a,{A:()=>r});const r=n.p+"assets/images/amg-prom-ds-with-tf-11e803de3965fefae46fc7f19106feee.png"},68286:(e,a,n)=>{n.d(a,{A:()=>r});const r=n.p+"assets/images/api-key-creation-cd66201fac3e7bb40729fcd589ad205a.png"},68470:(e,a,n)=>{n.d(a,{A:()=>r});const r=n.p+"assets/images/api-key-result-ba4f5b8bea1e81595d26ff83a9c304a9.png"},66295:(e,a,n)=>{n.d(a,{A:()=>r});const r=n.p+"assets/images/api-keys-menu-item-2e664323712a3e5aa7d10798acab95b6.png"},28453:(e,a,n)=>{n.d(a,{R:()=>s,x:()=>i});var r=n(96540);const t={},o=r.createContext(t);function s(e){const a=r.useContext(o);return r.useMemo((function(){return"function"==typeof e?e(a):{...a,...e}}),[a,e])}function i(e){let a;return a=e.disableParentContext?"function"==typeof e.components?e.components(t):e.components||t:s(e.components),r.createElement(o.Provider,{value:a},e.children)}}}]);
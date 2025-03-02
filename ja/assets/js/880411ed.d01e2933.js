"use strict";(self.webpackChunkobservability_best_practices=self.webpackChunkobservability_best_practices||[]).push([[3310],{12064:(e,r,n)=>{n.d(r,{A:()=>a});const a=n.p+"assets/images/amg-prom-ds-with-tf-11e803de3965fefae46fc7f19106feee.png"},28453:(e,r,n)=>{n.d(r,{R:()=>t,x:()=>i});var a=n(96540);const s={},o=a.createContext(s);function t(e){const r=a.useContext(o);return a.useMemo((function(){return"function"==typeof e?e(r):{...r,...e}}),[r,e])}function i(e){let r;return r=e.disableParentContext?"function"==typeof e.components?e.components(s):e.components||s:t(e.components),a.createElement(o.Provider,{value:r},e.children)}},40404:(e,r,n)=>{n.d(r,{A:()=>a});const a=n.p+"assets/images/api-key-result-ba4f5b8bea1e81595d26ff83a9c304a9.png"},58340:(e,r,n)=>{n.d(r,{A:()=>a});const a=n.p+"assets/images/api-key-creation-cd66201fac3e7bb40729fcd589ad205a.png"},68221:(e,r,n)=>{n.d(r,{A:()=>a});const a=n.p+"assets/images/api-keys-menu-item-2e664323712a3e5aa7d10798acab95b6.png"},99536:(e,r,n)=>{n.r(r),n.d(r,{assets:()=>d,contentTitle:()=>i,default:()=>h,frontMatter:()=>t,metadata:()=>a,toc:()=>c});const a=JSON.parse('{"id":"recipes/recipes/amg-automation-tf","title":"Amazon Managed Grafana \u306e\u81ea\u52d5\u5316\u306b Terraform \u3092\u4f7f\u7528\u3059\u308b","description":"\u3053\u306e\u30ec\u30b7\u30d4\u3067\u306f\u3001Terraform \u3092\u4f7f\u7528\u3057\u3066 Amazon Managed Grafana \u3092\u81ea\u52d5\u5316\u3059\u308b\u65b9\u6cd5\u3092\u7d39\u4ecb\u3057\u307e\u3059\u3002","source":"@site/i18n/ja/docusaurus-plugin-content-docs/current/recipes/recipes/amg-automation-tf.md","sourceDirName":"recipes/recipes","slug":"/recipes/recipes/amg-automation-tf","permalink":"/observability-best-practices/ja/recipes/recipes/amg-automation-tf","draft":false,"unlisted":false,"editUrl":"https://github.com/aws-observability/observability-best-practices/blob/main/docusaurus/docs/recipes/recipes/amg-automation-tf.md","tags":[],"version":"current","frontMatter":{}}');var s=n(74848),o=n(28453);const t={},i="Amazon Managed Grafana \u306e\u81ea\u52d5\u5316\u306b Terraform \u3092\u4f7f\u7528\u3059\u308b",d={},c=[{value:"\u524d\u63d0\u6761\u4ef6",id:"\u524d\u63d0\u6761\u4ef6",level:2},{value:"Amazon Managed Grafana \u306e\u30bb\u30c3\u30c8\u30a2\u30c3\u30d7",id:"amazon-managed-grafana-\u306e\u30bb\u30c3\u30c8\u30a2\u30c3\u30d7",level:2},{value:"Terraform \u306b\u3088\u308b\u81ea\u52d5\u5316",id:"terraform-\u306b\u3088\u308b\u81ea\u52d5\u5316",level:2},{value:"Terraform \u306e\u6e96\u5099",id:"terraform-\u306e\u6e96\u5099",level:3},{value:"Terraform \u306e\u4f7f\u7528",id:"terraform-\u306e\u4f7f\u7528",level:3},{value:"\u30af\u30ea\u30fc\u30f3\u30a2\u30c3\u30d7",id:"\u30af\u30ea\u30fc\u30f3\u30a2\u30c3\u30d7",level:2}];function l(e){const r={a:"a",admonition:"admonition",code:"code",h1:"h1",h2:"h2",h3:"h3",header:"header",img:"img",li:"li",p:"p",pre:"pre",ul:"ul",...(0,o.R)(),...e.components};return(0,s.jsxs)(s.Fragment,{children:[(0,s.jsx)(r.header,{children:(0,s.jsx)(r.h1,{id:"amazon-managed-grafana-\u306e\u81ea\u52d5\u5316\u306b-terraform-\u3092\u4f7f\u7528\u3059\u308b",children:"Amazon Managed Grafana \u306e\u81ea\u52d5\u5316\u306b Terraform \u3092\u4f7f\u7528\u3059\u308b"})}),"\n",(0,s.jsx)(r.p,{children:"\u3053\u306e\u30ec\u30b7\u30d4\u3067\u306f\u3001Terraform \u3092\u4f7f\u7528\u3057\u3066 Amazon Managed Grafana \u3092\u81ea\u52d5\u5316\u3059\u308b\u65b9\u6cd5\u3092\u7d39\u4ecb\u3057\u307e\u3059\u3002\n\u4f8b\u3048\u3070\u3001\u8907\u6570\u306e\u30ef\u30fc\u30af\u30b9\u30da\u30fc\u30b9\u306b\u308f\u305f\u3063\u3066\u30c7\u30fc\u30bf\u30bd\u30fc\u30b9\u3084\u30c0\u30c3\u30b7\u30e5\u30dc\u30fc\u30c9\u3092\u4e00\u8cab\u3057\u3066\u8ffd\u52a0\u3059\u308b\u65b9\u6cd5\u306a\u3069\u3067\u3059\u3002"}),"\n",(0,s.jsx)(r.admonition,{type:"note",children:(0,s.jsx)(r.p,{children:"\u3053\u306e\u30ac\u30a4\u30c9\u306f\u7d04 30 \u5206\u3067\u5b8c\u4e86\u3057\u307e\u3059\u3002"})}),"\n",(0,s.jsx)(r.h2,{id:"\u524d\u63d0\u6761\u4ef6",children:"\u524d\u63d0\u6761\u4ef6"}),"\n",(0,s.jsxs)(r.ul,{children:["\n",(0,s.jsxs)(r.li,{children:["\u30ed\u30fc\u30ab\u30eb\u74b0\u5883\u306b ",(0,s.jsx)(r.a,{href:"https://docs.aws.amazon.com/ja_jp/cli/latest/userguide/cli-chap-install.html",children:"AWS \u30b3\u30de\u30f3\u30c9\u30e9\u30a4\u30f3"})," \u304c\u30a4\u30f3\u30b9\u30c8\u30fc\u30eb\u3055\u308c\u3001",(0,s.jsx)(r.a,{href:"https://docs.aws.amazon.com/ja_jp/cli/latest/userguide/cli-chap-configure.html",children:"\u8a2d\u5b9a"})," \u3055\u308c\u3066\u3044\u308b\u3053\u3068\u3002"]}),"\n",(0,s.jsxs)(r.li,{children:["\u30ed\u30fc\u30ab\u30eb\u74b0\u5883\u306b ",(0,s.jsx)(r.a,{href:"https://www.terraform.io/downloads.html",children:"Terraform"})," \u30b3\u30de\u30f3\u30c9\u30e9\u30a4\u30f3\u304c\u30a4\u30f3\u30b9\u30c8\u30fc\u30eb\u3055\u308c\u3066\u3044\u308b\u3053\u3068\u3002"]}),"\n",(0,s.jsx)(r.li,{children:"\u4f7f\u7528\u53ef\u80fd\u306a Amazon Managed Service for Prometheus \u30ef\u30fc\u30af\u30b9\u30da\u30fc\u30b9\u304c\u3042\u308b\u3053\u3068\u3002"}),"\n",(0,s.jsx)(r.li,{children:"\u4f7f\u7528\u53ef\u80fd\u306a Amazon Managed Grafana \u30ef\u30fc\u30af\u30b9\u30da\u30fc\u30b9\u304c\u3042\u308b\u3053\u3068\u3002"}),"\n"]}),"\n",(0,s.jsx)(r.h2,{id:"amazon-managed-grafana-\u306e\u30bb\u30c3\u30c8\u30a2\u30c3\u30d7",children:"Amazon Managed Grafana \u306e\u30bb\u30c3\u30c8\u30a2\u30c3\u30d7"}),"\n",(0,s.jsxs)(r.p,{children:["Terraform \u304c Grafana \u306b\u5bfe\u3057\u3066",(0,s.jsx)(r.a,{href:"https://grafana.com/docs/grafana/latest/http_api/auth/",children:"\u8a8d\u8a3c"}),"\u3092\u884c\u3046\u305f\u3081\u306b\u3001\u30d1\u30b9\u30ef\u30fc\u30c9\u306e\u3088\u3046\u306a\u5f79\u5272\u3092\u679c\u305f\u3059 API \u30ad\u30fc\u3092\u4f7f\u7528\u3057\u307e\u3059\u3002"]}),"\n",(0,s.jsx)(r.admonition,{type:"info",children:(0,s.jsxs)(r.p,{children:["API \u30ad\u30fc\u306f\u3001",(0,s.jsx)(r.a,{href:"https://datatracker.ietf.org/doc/html/rfc6750",children:"RFC 6750"})," HTTP Bearer \u30d8\u30c3\u30c0\u30fc\u3067\u300151 \u6587\u5b57\u306e\u82f1\u6570\u5b57\u306e\u5024\u3092\u6301\u3061\u3001Grafana API \u306b\u5bfe\u3059\u308b\u3059\u3079\u3066\u306e\u30ea\u30af\u30a8\u30b9\u30c8\u3067\u547c\u3073\u51fa\u3057\u5143\u3092\u8a8d\u8a3c\u3057\u307e\u3059\u3002"]})}),"\n",(0,s.jsx)(r.p,{children:"\u305d\u306e\u305f\u3081\u3001Terraform \u30de\u30cb\u30d5\u30a7\u30b9\u30c8\u3092\u30bb\u30c3\u30c8\u30a2\u30c3\u30d7\u3059\u308b\u524d\u306b\u3001\u307e\u305a API \u30ad\u30fc\u3092\u4f5c\u6210\u3059\u308b\u5fc5\u8981\u304c\u3042\u308a\u307e\u3059\u3002\u3053\u308c\u306f Grafana UI \u3092\u901a\u3058\u3066\u4ee5\u4e0b\u306e\u3088\u3046\u306b\u884c\u3044\u307e\u3059\u3002"}),"\n",(0,s.jsxs)(r.p,{children:["\u307e\u305a\u3001\u5de6\u5074\u306e\u30e1\u30cb\u30e5\u30fc\u306e ",(0,s.jsx)(r.code,{children:"Configuration"})," \u30bb\u30af\u30b7\u30e7\u30f3\u304b\u3089 ",(0,s.jsx)(r.code,{children:"API keys"})," \u30e1\u30cb\u30e5\u30fc\u9805\u76ee\u3092\u9078\u629e\u3057\u307e\u3059\uff1a"]}),"\n",(0,s.jsx)(r.p,{children:(0,s.jsx)(r.img,{alt:"Configuration, API keys menu item",src:n(68221).A+"",width:"216",height:"307"})}),"\n",(0,s.jsxs)(r.p,{children:["\u6b21\u306b\u3001\u65b0\u3057\u3044 API \u30ad\u30fc\u3092\u4f5c\u6210\u3057\u3001\u30bf\u30b9\u30af\u306b\u9069\u3057\u305f\u540d\u524d\u3092\u4ed8\u3051\u3001",(0,s.jsx)(r.code,{children:"Admin"})," \u30ed\u30fc\u30eb\u3092\u5272\u308a\u5f53\u3066\u3001\u6709\u52b9\u671f\u9593\u3092\u4f8b\u3048\u3070 1 \u65e5\u306b\u8a2d\u5b9a\u3057\u307e\u3059\uff1a"]}),"\n",(0,s.jsx)(r.p,{children:(0,s.jsx)(r.img,{alt:"API key creation",src:n(58340).A+"",width:"1000",height:"163"})}),"\n",(0,s.jsx)(r.admonition,{type:"note",children:(0,s.jsx)(r.p,{children:"API \u30ad\u30fc\u306e\u6709\u52b9\u671f\u9650\u306f\u9650\u3089\u308c\u3066\u304a\u308a\u3001AMG \u3067\u306f\u6700\u5927 30 \u65e5\u307e\u3067\u306e\u5024\u3092\u4f7f\u7528\u3067\u304d\u307e\u3059\u3002"})}),"\n",(0,s.jsxs)(r.p,{children:[(0,s.jsx)(r.code,{children:"Add"})," \u30dc\u30bf\u30f3\u3092\u30af\u30ea\u30c3\u30af\u3059\u308b\u3068\u3001API \u30ad\u30fc\u3092\u542b\u3080\u30dd\u30c3\u30d7\u30a2\u30c3\u30d7\u30c0\u30a4\u30a2\u30ed\u30b0\u304c\u8868\u793a\u3055\u308c\u308b\u306f\u305a\u3067\u3059\uff1a"]}),"\n",(0,s.jsx)(r.p,{children:(0,s.jsx)(r.img,{alt:"API key result",src:n(40404).A+"",width:"500",height:"253"})}),"\n",(0,s.jsx)(r.admonition,{type:"warning",children:(0,s.jsx)(r.p,{children:"\u3053\u308c\u304c API \u30ad\u30fc\u3092\u898b\u3089\u308c\u308b\u552f\u4e00\u306e\u6a5f\u4f1a\u3067\u3059\u3002\u3053\u3053\u304b\u3089\u5b89\u5168\u306a\u5834\u6240\u306b\u4fdd\u5b58\u3057\u3066\u304f\u3060\u3055\u3044\u3002\u5f8c\u3067 Terraform \u30de\u30cb\u30d5\u30a7\u30b9\u30c8\u3067\u5fc5\u8981\u306b\u306a\u308a\u307e\u3059\u3002"})}),"\n",(0,s.jsx)(r.p,{children:"\u3053\u308c\u3067\u3001Terraform \u3092\u4f7f\u7528\u3057\u3066\u81ea\u52d5\u5316\u3059\u308b\u305f\u3081\u306b Amazon Managed Grafana \u3067\u5fc5\u8981\u306a\u3059\u3079\u3066\u306e\u30bb\u30c3\u30c8\u30a2\u30c3\u30d7\u304c\u5b8c\u4e86\u3057\u307e\u3057\u305f\u3002\u6b21\u306e\u30b9\u30c6\u30c3\u30d7\u306b\u9032\u307f\u307e\u3057\u3087\u3046\u3002"}),"\n",(0,s.jsx)(r.h2,{id:"terraform-\u306b\u3088\u308b\u81ea\u52d5\u5316",children:"Terraform \u306b\u3088\u308b\u81ea\u52d5\u5316"}),"\n",(0,s.jsx)(r.h3,{id:"terraform-\u306e\u6e96\u5099",children:"Terraform \u306e\u6e96\u5099"}),"\n",(0,s.jsxs)(r.p,{children:["Terraform \u304c Grafana \u3068\u9023\u643a\u3067\u304d\u308b\u3088\u3046\u306b\u3059\u308b\u305f\u3081\u3001\u30d0\u30fc\u30b8\u30e7\u30f3 1.13.3 \u4ee5\u4e0a\u306e\u516c\u5f0f ",(0,s.jsx)(r.a,{href:"https://registry.terraform.io/providers/grafana/grafana/latest/docs",children:"Grafana \u30d7\u30ed\u30d0\u30a4\u30c0\u30fc"})," \u3092\u4f7f\u7528\u3057\u307e\u3059\u3002"]}),"\n",(0,s.jsxs)(r.p,{children:["\u4ee5\u4e0b\u3067\u306f\u3001\u30c7\u30fc\u30bf\u30bd\u30fc\u30b9\u306e\u4f5c\u6210\u3092\u81ea\u52d5\u5316\u3057\u305f\u3044\u3068\u8003\u3048\u3066\u3044\u307e\u3059\u3002\u5177\u4f53\u7684\u306b\u306f\u3001Prometheus ",(0,s.jsx)(r.a,{href:"https://registry.terraform.io/providers/grafana/grafana/latest/docs/resources/data_source",children:"\u30c7\u30fc\u30bf\u30bd\u30fc\u30b9"}),"\u3001\u6b63\u78ba\u306b\u306f AMP \u30ef\u30fc\u30af\u30b9\u30da\u30fc\u30b9\u3092\u8ffd\u52a0\u3057\u305f\u3044\u3068\u601d\u3044\u307e\u3059\u3002"]}),"\n",(0,s.jsxs)(r.p,{children:["\u307e\u305a\u3001",(0,s.jsx)(r.code,{children:"main.tf"})," \u3068\u3044\u3046\u30d5\u30a1\u30a4\u30eb\u3092\u4f5c\u6210\u3057\u3001\u4ee5\u4e0b\u306e\u5185\u5bb9\u3092\u8a18\u8ff0\u3057\u307e\u3059\uff1a"]}),"\n",(0,s.jsx)(r.pre,{children:(0,s.jsx)(r.code,{children:'terraform {\n  required_providers {\n    grafana = {\n      source  = "grafana/grafana"\n      version = ">= 1.13.3"\n    }\n  }\n}\n\nprovider "grafana" {\n  url  = "\u3053\u3053\u306b GRAFANA \u30ef\u30fc\u30af\u30b9\u30da\u30fc\u30b9 URL \u3092\u633f\u5165\u3057\u3066\u304f\u3060\u3055\u3044"\n  auth = "\u3053\u3053\u306b API \u30ad\u30fc\u3092\u633f\u5165\u3057\u3066\u304f\u3060\u3055\u3044"\n}\n\nresource "grafana_data_source" "prometheus" {\n  type          = "prometheus"\n  name          = "amp"\n  is_default    = true\n  url           = "\u3053\u3053\u306b AMP \u30ef\u30fc\u30af\u30b9\u30da\u30fc\u30b9 URL \u3092\u633f\u5165\u3057\u3066\u304f\u3060\u3055\u3044"\n  json_data {\n\thttp_method     = "POST"\n\tsigv4_auth      = true\n\tsigv4_auth_type = "workspace-iam-role"\n\tsigv4_region    = "eu-west-1"\n  }\n}\n'})}),"\n",(0,s.jsx)(r.p,{children:"\u4e0a\u8a18\u306e\u30d5\u30a1\u30a4\u30eb\u306b\u306f\u3001\u74b0\u5883\u306b\u5fdc\u3058\u3066 3 \u3064\u306e\u5024\u3092\u633f\u5165\u3059\u308b\u5fc5\u8981\u304c\u3042\u308a\u307e\u3059\u3002"}),"\n",(0,s.jsx)(r.p,{children:"Grafana \u30d7\u30ed\u30d0\u30a4\u30c0\u30fc\u30bb\u30af\u30b7\u30e7\u30f3\u3067\u306f\uff1a"}),"\n",(0,s.jsxs)(r.ul,{children:["\n",(0,s.jsxs)(r.li,{children:[(0,s.jsx)(r.code,{children:"url"})," \u2026 Grafana \u30ef\u30fc\u30af\u30b9\u30da\u30fc\u30b9 URL \u3067\u3001\u4ee5\u4e0b\u306e\u3088\u3046\u306a\u5f62\u5f0f\u3067\u3059\uff1a\n",(0,s.jsx)(r.code,{children:"https://xxxxxxxx.grafana-workspace.eu-west-1.amazonaws.com"}),"\u3002"]}),"\n",(0,s.jsxs)(r.li,{children:[(0,s.jsx)(r.code,{children:"auth"})," \u2026 \u524d\u306e\u30b9\u30c6\u30c3\u30d7\u3067\u4f5c\u6210\u3057\u305f API \u30ad\u30fc\u3002"]}),"\n"]}),"\n",(0,s.jsxs)(r.p,{children:["Prometheus \u30ea\u30bd\u30fc\u30b9\u30bb\u30af\u30b7\u30e7\u30f3\u3067\u306f\u3001",(0,s.jsx)(r.code,{children:"url"})," \u306b AMP \u30ef\u30fc\u30af\u30b9\u30da\u30fc\u30b9 URL \u3092\u633f\u5165\u3057\u307e\u3059\u3002\n\u5f62\u5f0f\u306f ",(0,s.jsx)(r.code,{children:"https://aps-workspaces.eu-west-1.amazonaws.com/workspaces/ws-xxxxxxxxx"})," \u3067\u3059\u3002"]}),"\n",(0,s.jsx)(r.admonition,{type:"note",children:(0,s.jsxs)(r.p,{children:["\u30d5\u30a1\u30a4\u30eb\u306b\u793a\u3055\u308c\u3066\u3044\u308b\u3082\u306e\u3068\u306f\u7570\u306a\u308b\u30ea\u30fc\u30b8\u30e7\u30f3\u3067 Amazon Managed Grafana \u3092\u4f7f\u7528\u3057\u3066\u3044\u308b\u5834\u5408\u306f\u3001\u4e0a\u8a18\u306b\u52a0\u3048\u3066 ",(0,s.jsx)(r.code,{children:"sigv4_region"})," \u3092\u304a\u4f7f\u3044\u306e\u30ea\u30fc\u30b8\u30e7\u30f3\u306b\u8a2d\u5b9a\u3059\u308b\u5fc5\u8981\u304c\u3042\u308a\u307e\u3059\u3002"]})}),"\n",(0,s.jsx)(r.p,{children:"\u6e96\u5099\u6bb5\u968e\u3092\u7de0\u3081\u304f\u304f\u308b\u305f\u3081\u306b\u3001Terraform \u3092\u521d\u671f\u5316\u3057\u307e\u3057\u3087\u3046\uff1a"}),"\n",(0,s.jsx)(r.pre,{children:(0,s.jsx)(r.code,{children:'$ terraform init\nInitializing the backend...\n\nInitializing provider plugins...\n- Finding grafana/grafana versions matching ">= 1.13.3"...\n- Installing grafana/grafana v1.13.3...\n- Installed grafana/grafana v1.13.3 (signed by a HashiCorp partner, key ID 570AA42029AE241A)\n\nPartner and community providers are signed by their developers.\nIf you\'d like to know more about provider signing, you can read about it here:\nhttps://www.terraform.io/docs/cli/plugins/signing.html\n\nTerraform has created a lock file .terraform.lock.hcl to record the provider\nselections it made above. Include this file in your version control repository\nso that Terraform can guarantee to make the same selections by default when\nyou run "terraform init" in the future.\n\nTerraform has been successfully initialized!\n\nYou may now begin working with Terraform. Try running "terraform plan" to see\nany changes that are required for your infrastructure. All Terraform commands\nshould now work.\n\nIf you ever set or change modules or backend configuration for Terraform,\nrerun this command to reinitialize your working directory. If you forget, other\ncommands will detect it and remind you to do so if necessary.\n'})}),"\n",(0,s.jsx)(r.p,{children:"\u3053\u308c\u3067\u6e96\u5099\u304c\u6574\u3044\u3001\u4ee5\u4e0b\u3067\u8aac\u660e\u3059\u308b\u3088\u3046\u306b\u30c7\u30fc\u30bf\u30bd\u30fc\u30b9\u306e\u4f5c\u6210\u3092 Terraform \u3067\u81ea\u52d5\u5316\u3067\u304d\u308b\u3088\u3046\u306b\u306a\u308a\u307e\u3057\u305f\u3002"}),"\n",(0,s.jsx)(r.h3,{id:"terraform-\u306e\u4f7f\u7528",children:"Terraform \u306e\u4f7f\u7528"}),"\n",(0,s.jsx)(r.p,{children:"\u901a\u5e38\u3001\u307e\u305a Terraform \u306e\u8a08\u753b\u3092\u6b21\u306e\u3088\u3046\u306b\u78ba\u8a8d\u3057\u307e\u3059\uff1a"}),"\n",(0,s.jsx)(r.pre,{children:(0,s.jsx)(r.code,{children:'$ terraform plan\n\nTerraform used the selected providers to generate the following execution plan. \nResource actions are indicated with the following symbols:\n  + create\n\nTerraform will perform the following actions:\n\n  # grafana_data_source.prometheus will be created\n  + resource "grafana_data_source" "prometheus" {\n      + access_mode        = "proxy"\n      + basic_auth_enabled = false\n      + id                 = (known after apply)\n      + is_default         = true\n      + name               = "amp"\n      + type               = "prometheus"\n      + url                = "https://aps-workspaces.eu-west-1.amazonaws.com/workspaces/ws-xxxxxx/"\n\n      + json_data {\n          + http_method     = "POST"\n          + sigv4_auth      = true\n          + sigv4_auth_type = "workspace-iam-role"\n          + sigv4_region    = "eu-west-1"\n        }\n    }\n\nPlan: 1 to add, 0 to change, 0 to destroy.\n\n\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\n\nNote: You didn\'t use the -out option to save this plan, so Terraform can\'t guarantee to take exactly these actions if you run "terraform apply" now.\n\n'})}),"\n",(0,s.jsx)(r.p,{children:"\u8868\u793a\u3055\u308c\u305f\u5185\u5bb9\u306b\u554f\u984c\u304c\u306a\u3051\u308c\u3070\u3001\u8a08\u753b\u3092\u9069\u7528\u3067\u304d\u307e\u3059\uff1a"}),"\n",(0,s.jsx)(r.pre,{children:(0,s.jsx)(r.code,{children:'$ terraform apply\n\nTerraform used the selected providers to generate the following execution plan. \nResource actions are indicated with the following symbols:\n  + create\n\nTerraform will perform the following actions:\n\n  # grafana_data_source.prometheus will be created\n  + resource "grafana_data_source" "prometheus" {\n      + access_mode        = "proxy"\n      + basic_auth_enabled = false\n      + id                 = (known after apply)\n      + is_default         = true\n      + name               = "amp"\n      + type               = "prometheus"\n      + url                = "https://aps-workspaces.eu-west-1.amazonaws.com/workspaces/ws-xxxxxxxxx/"\n\n      + json_data {\n          + http_method     = "POST"\n          + sigv4_auth      = true\n          + sigv4_auth_type = "workspace-iam-role"\n          + sigv4_region    = "eu-west-1"\n        }\n    }\n\nPlan: 1 to add, 0 to change, 0 to destroy.\n\nDo you want to perform these actions?\n  Terraform will perform the actions described above.\n  Only \'yes\' will be accepted to approve.\n\n  Enter a value: yes\n\ngrafana_data_source.prometheus: Creating...\ngrafana_data_source.prometheus: Creation complete after 1s [id=10]\n\nApply complete! Resources: 1 added, 0 changed, 0 destroyed.\n\n'})}),"\n",(0,s.jsx)(r.p,{children:"\u3053\u308c\u3067 Grafana \u306e\u30c7\u30fc\u30bf\u30bd\u30fc\u30b9\u30ea\u30b9\u30c8\u306b\u79fb\u52d5\u3059\u308b\u3068\u3001\u6b21\u306e\u3088\u3046\u306a\u3082\u306e\u304c\u8868\u793a\u3055\u308c\u308b\u306f\u305a\u3067\u3059\uff1a"}),"\n",(0,s.jsx)(r.p,{children:(0,s.jsx)(r.img,{alt:"AMP as data source in AMG",src:n(12064).A+"",width:"1000",height:"1092"})}),"\n",(0,s.jsxs)(r.p,{children:["\u65b0\u3057\u304f\u4f5c\u6210\u3057\u305f\u30c7\u30fc\u30bf\u30bd\u30fc\u30b9\u304c\u6a5f\u80fd\u3059\u308b\u304b\u3092\u78ba\u8a8d\u3059\u308b\u306b\u306f\u3001\u4e0b\u90e8\u306e\u9752\u3044 ",(0,s.jsx)(r.code,{children:"Save & test"})," \u30dc\u30bf\u30f3\u3092\u30af\u30ea\u30c3\u30af\u3057\u307e\u3059\u3002\u7d50\u679c\u3068\u3057\u3066\u300cData source is working\u300d\u3068\u3044\u3046\u78ba\u8a8d\u30e1\u30c3\u30bb\u30fc\u30b8\u304c\u8868\u793a\u3055\u308c\u308b\u306f\u305a\u3067\u3059\u3002"]}),"\n",(0,s.jsxs)(r.p,{children:["Terraform \u3092\u4f7f\u7528\u3057\u3066\u4ed6\u306e\u4f5c\u696d\u3082\u81ea\u52d5\u5316\u3067\u304d\u307e\u3059\u3002\u4f8b\u3048\u3070\u3001",(0,s.jsx)(r.a,{href:"https://registry.terraform.io/providers/grafana/grafana/latest/docs",children:"Grafana \u30d7\u30ed\u30d0\u30a4\u30c0\u30fc"})," \u306f\u30d5\u30a9\u30eb\u30c0\u30fc\u3084\u30c0\u30c3\u30b7\u30e5\u30dc\u30fc\u30c9\u306e\u7ba1\u7406\u3092\u30b5\u30dd\u30fc\u30c8\u3057\u3066\u3044\u307e\u3059\u3002"]}),"\n",(0,s.jsx)(r.p,{children:"\u4f8b\u3048\u3070\u3001\u30c0\u30c3\u30b7\u30e5\u30dc\u30fc\u30c9\u3092\u6574\u7406\u3059\u308b\u305f\u3081\u306e\u30d5\u30a9\u30eb\u30c0\u30fc\u3092\u4f5c\u6210\u3057\u305f\u3044\u5834\u5408\u306f\u6b21\u306e\u3088\u3046\u306b\u3057\u307e\u3059\uff1a"}),"\n",(0,s.jsx)(r.pre,{children:(0,s.jsx)(r.code,{children:'resource "grafana_folder" "examplefolder" {\n  title = "devops"\n}\n'})}),"\n",(0,s.jsxs)(r.p,{children:["\u3055\u3089\u306b\u3001",(0,s.jsx)(r.code,{children:"example-dashboard.json"})," \u3068\u3044\u3046\u30c0\u30c3\u30b7\u30e5\u30dc\u30fc\u30c9\u304c\u3042\u308a\u3001\u305d\u308c\u3092\u4e0a\u8a18\u306e\u30d5\u30a9\u30eb\u30c0\u30fc\u306b\u4f5c\u6210\u3057\u305f\u3044\u5834\u5408\u306f\u3001\u6b21\u306e\u30b9\u30cb\u30da\u30c3\u30c8\u3092\u4f7f\u7528\u3057\u307e\u3059\uff1a"]}),"\n",(0,s.jsx)(r.pre,{children:(0,s.jsx)(r.code,{children:'resource "grafana_dashboard" "exampledashboard" {\n  folder = grafana_folder.examplefolder.id\n  config_json = file("example-dashboard.json")\n}\n'})}),"\n",(0,s.jsx)(r.p,{children:"Terraform \u306f\u5f37\u529b\u306a\u81ea\u52d5\u5316\u30c4\u30fc\u30eb\u3067\u3042\u308a\u3001\u3053\u3053\u3067\u793a\u3057\u305f\u3088\u3046\u306b Grafana \u30ea\u30bd\u30fc\u30b9\u306e\u7ba1\u7406\u306b\u4f7f\u7528\u3067\u304d\u307e\u3059\u3002"}),"\n",(0,s.jsx)(r.admonition,{type:"note",children:(0,s.jsxs)(r.p,{children:["\u305f\u3060\u3057\u3001",(0,s.jsx)(r.a,{href:"https://www.terraform.io/docs/language/state/remote.html",children:"Terraform \u306e\u72b6\u614b"})," \u306f\u30c7\u30d5\u30a9\u30eb\u30c8\u3067\u30ed\u30fc\u30ab\u30eb\u3067\u7ba1\u7406\u3055\u308c\u308b\u3053\u3068\u306b\u6ce8\u610f\u3057\u3066\u304f\u3060\u3055\u3044\u3002\u3064\u307e\u308a\u3001Terraform \u3092\u5354\u8abf\u3057\u3066\u4f7f\u7528\u3059\u308b\u4e88\u5b9a\u304c\u3042\u308b\u5834\u5408\u306f\u3001\u30c1\u30fc\u30e0\u9593\u3067\u72b6\u614b\u3092\u5171\u6709\u3067\u304d\u308b\u5229\u7528\u53ef\u80fd\u306a\u30aa\u30d7\u30b7\u30e7\u30f3\u306e\u3044\u305a\u308c\u304b\u3092\u9078\u629e\u3059\u308b\u5fc5\u8981\u304c\u3042\u308a\u307e\u3059\u3002"]})}),"\n",(0,s.jsx)(r.h2,{id:"\u30af\u30ea\u30fc\u30f3\u30a2\u30c3\u30d7",children:"\u30af\u30ea\u30fc\u30f3\u30a2\u30c3\u30d7"}),"\n",(0,s.jsx)(r.p,{children:"\u30b3\u30f3\u30bd\u30fc\u30eb\u304b\u3089 Amazon Managed Grafana \u30ef\u30fc\u30af\u30b9\u30da\u30fc\u30b9\u3092\u524a\u9664\u3057\u3066\u3001\u30ea\u30bd\u30fc\u30b9\u3092\u524a\u9664\u3057\u3066\u304f\u3060\u3055\u3044\u3002"})]})}function h(e={}){const{wrapper:r}={...(0,o.R)(),...e.components};return r?(0,s.jsx)(r,{...e,children:(0,s.jsx)(l,{...e})}):l(e)}}}]);
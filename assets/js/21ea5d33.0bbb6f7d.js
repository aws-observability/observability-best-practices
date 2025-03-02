"use strict";(self.webpackChunkobservability_best_practices=self.webpackChunkobservability_best_practices||[]).push([[7695],{27393:(e,n,s)=>{s.d(n,{A:()=>a});const a=s.p+"assets/images/4-97f81696f2c066ddc7f72d23ee4d9b3e.png"},28453:(e,n,s)=>{s.d(n,{R:()=>i,x:()=>r});var a=s(96540);const t={},o=a.createContext(t);function i(e){const n=a.useContext(o);return a.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function r(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(t):e.components||t:i(e.components),a.createElement(o.Provider,{value:n},e.children)}},29171:(e,n,s)=>{s.d(n,{A:()=>a});const a=s.p+"assets/images/6-a121c9c5bedfdc6b37b61ad51ef9af4c.png"},33876:(e,n,s)=>{s.d(n,{A:()=>a});const a=s.p+"assets/images/9-68f1e10ca2338ff9361f079379c22ccb.png"},34295:(e,n,s)=>{s.d(n,{A:()=>a});const a=s.p+"assets/images/2-22136261aee94d69823499acc55e504b.png"},45564:(e,n,s)=>{s.d(n,{A:()=>a});const a=s.p+"assets/images/1-f980b1293dab6b586bf09eec9ab87925.png"},54680:(e,n,s)=>{s.d(n,{A:()=>a});const a=s.p+"assets/images/5-790f6db8245706d375af6c8c243c3f68.png"},55005:(e,n,s)=>{s.d(n,{A:()=>a});const a=s.p+"assets/images/8-3160a57b7375ac768ccd56f4167856b8.png"},58452:(e,n,s)=>{s.d(n,{A:()=>a});const a=s.p+"assets/images/12-0eaca88915eeaa464350145b9587fd7a.png"},60654:(e,n,s)=>{s.d(n,{A:()=>a});const a=s.p+"assets/images/3-5b8c9005451c082aeccc189ff68798c7.png"},78410:(e,n,s)=>{s.d(n,{A:()=>a});const a=s.p+"assets/images/7-42d7f60cbd79b50cc9b818bdfd79acc8.png"},78450:(e,n,s)=>{s.r(n),s.d(n,{assets:()=>c,contentTitle:()=>r,default:()=>g,frontMatter:()=>i,metadata:()=>a,toc:()=>d});const a=JSON.parse('{"id":"recipes/recipes/amg-google-auth-saml","title":"Configure Google Workspaces authentication with Amazon Managed Grafana using SAML","description":"In this guide, we will walk through how you can setup Google Workspaces as an","source":"@site/docs/recipes/recipes/amg-google-auth-saml.md","sourceDirName":"recipes/recipes","slug":"/recipes/recipes/amg-google-auth-saml","permalink":"/observability-best-practices/recipes/recipes/amg-google-auth-saml","draft":false,"unlisted":false,"editUrl":"https://github.com/aws-observability/observability-best-practices/blob/main/docusaurus/docs/recipes/recipes/amg-google-auth-saml.md","tags":[],"version":"current","frontMatter":{}}');var t=s(74848),o=s(28453);const i={},r="Configure Google Workspaces authentication with Amazon Managed Grafana using SAML",c={},d=[{value:"Create Amazon Managed Grafana workspace",id:"create-amazon-managed-grafana-workspace",level:3},{value:"Configure Google Workspaces",id:"configure-google-workspaces",level:3},{value:"Upload SAML metadata into Amazon Managed Grafana",id:"upload-saml-metadata-into-amazon-managed-grafana",level:3}];function l(e){const n={a:"a",em:"em",h1:"h1",h3:"h3",header:"header",img:"img",p:"p",strong:"strong",...(0,o.R)(),...e.components};return(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)(n.header,{children:(0,t.jsx)(n.h1,{id:"configure-google-workspaces-authentication-with-amazon-managed-grafana-using-saml",children:"Configure Google Workspaces authentication with Amazon Managed Grafana using SAML"})}),"\n",(0,t.jsx)(n.p,{children:"In this guide, we will walk through how you can setup Google Workspaces as an\nidentity provider (IdP) for Amazon Managed Grafana using SAML v2.0 protocol."}),"\n",(0,t.jsxs)(n.p,{children:["In order to follow this guide you need to create a paid ",(0,t.jsx)(n.a,{href:"https://workspace.google.com/",children:"Google Workspaces"}),"\naccount in addition to having an ",(0,t.jsx)(n.a,{href:"https://docs.aws.amazon.com/grafana/latest/userguide/getting-started-with-AMG.html#AMG-getting-started-workspace",children:"Amazon Managed Grafana workspace"})," created."]}),"\n",(0,t.jsx)(n.h3,{id:"create-amazon-managed-grafana-workspace",children:"Create Amazon Managed Grafana workspace"}),"\n",(0,t.jsxs)(n.p,{children:["Log into the Amazon Managed Grafana console and click ",(0,t.jsx)(n.strong,{children:"Create workspace."})," In the following screen,\nprovide a workspace name as shown below. Then click ",(0,t.jsx)(n.strong,{children:"Next"}),":"]}),"\n",(0,t.jsx)(n.p,{children:(0,t.jsx)(n.img,{alt:"Create Workspace - Specify workspace details",src:s(45564).A+"",width:"1130",height:"513"})}),"\n",(0,t.jsxs)(n.p,{children:["In the ",(0,t.jsx)(n.strong,{children:"Configure settings"})," page, select ",(0,t.jsx)(n.strong,{children:"Security Assertion Markup Language (SAML)"}),"\noption so you can configure a SAML based Identity Provider for users to log in:"]}),"\n",(0,t.jsx)(n.p,{children:(0,t.jsx)(n.img,{alt:"Create Workspace - Configure settings",src:s(34295).A+"",width:"1106",height:"695"})}),"\n",(0,t.jsxs)(n.p,{children:["Select the data sources you want to choose and click ",(0,t.jsx)(n.strong,{children:"Next"}),":\n",(0,t.jsx)(n.img,{alt:"Create Workspace - Permission settings",src:s(60654).A+"",width:"1115",height:"951"})]}),"\n",(0,t.jsxs)(n.p,{children:["Click on ",(0,t.jsx)(n.strong,{children:"Create workspace"})," button in the ",(0,t.jsx)(n.strong,{children:"Review and create"})," screen:\n",(0,t.jsx)(n.img,{alt:"Create Workspace - Review settings",src:s(27393).A+"",width:"1113",height:"1105"})]}),"\n",(0,t.jsx)(n.p,{children:"This will create a new Amazon Managed Grafana workspace as shown below:"}),"\n",(0,t.jsx)(n.p,{children:(0,t.jsx)(n.img,{alt:"Create Workspace - Create AMG workspace",src:s(54680).A+"",width:"1580",height:"945"})}),"\n",(0,t.jsx)(n.h3,{id:"configure-google-workspaces",children:"Configure Google Workspaces"}),"\n",(0,t.jsxs)(n.p,{children:["Login to Google Workspaces with Super Admin permissions and go\nto ",(0,t.jsx)(n.strong,{children:"Web and mobile apps"})," under ",(0,t.jsx)(n.strong,{children:"Apps"})," section. There, click on ",(0,t.jsx)(n.strong,{children:"Add App"}),"\nand select ",(0,t.jsx)(n.strong,{children:"Add custom SAML app."})," Now give the app a name as shown below.\nClick ",(0,t.jsx)(n.strong,{children:"CONTINUE."}),":"]}),"\n",(0,t.jsx)(n.p,{children:(0,t.jsx)(n.img,{alt:"Google Workspace - Add custom SAML app - App details",src:s(29171).A+"",width:"1353",height:"724"})}),"\n",(0,t.jsxs)(n.p,{children:["On the next screen, click on ",(0,t.jsx)(n.strong,{children:"DOWNLOAD METADATA"})," button to download the SAML metadata file. Click ",(0,t.jsx)(n.strong,{children:"CONTINUE."})]}),"\n",(0,t.jsx)(n.p,{children:(0,t.jsx)(n.img,{alt:"Google Workspace - Add custom SAML app - Download Metadata",src:s(78410).A+"",width:"1350",height:"1059"})}),"\n",(0,t.jsx)(n.p,{children:"On the next screen, you will see the ACS URL, Entity ID and Start URL fields.\nYou can get the values for these fields from the Amazon Managed Grafana console."}),"\n",(0,t.jsxs)(n.p,{children:["Select ",(0,t.jsx)(n.strong,{children:"EMAIL"})," from the drop down in the ",(0,t.jsx)(n.strong,{children:"Name ID format"})," field and select ",(0,t.jsx)(n.strong,{children:"Basic Information > Primary email"})," in the ",(0,t.jsx)(n.strong,{children:"Name ID"})," field."]}),"\n",(0,t.jsxs)(n.p,{children:["Click ",(0,t.jsx)(n.strong,{children:"CONTINUE."}),"\n",(0,t.jsx)(n.img,{alt:"Google Workspace - Add custom SAML app - Service provider details",src:s(55005).A+"",width:"1349",height:"914"})]}),"\n",(0,t.jsx)(n.p,{children:(0,t.jsx)(n.img,{alt:"AMG - SAML Configuration details",src:s(33876).A+"",width:"1531",height:"1183"})}),"\n",(0,t.jsxs)(n.p,{children:["In the ",(0,t.jsx)(n.strong,{children:"Attribute mapping"})," screen, make the mapping between ",(0,t.jsx)(n.strong,{children:"Google Directory attributes"})," and ",(0,t.jsx)(n.strong,{children:"App attributes"})," as shown in the screenshot below"]}),"\n",(0,t.jsx)(n.p,{children:(0,t.jsx)(n.img,{alt:"Google Workspace - Add custom SAML app - Attribute mapping",src:s(98374).A+"",width:"1351",height:"693"})}),"\n",(0,t.jsxs)(n.p,{children:["For users logging in through Google authentication to have ",(0,t.jsx)(n.strong,{children:"Admin"})," privileges\nin ",(0,t.jsx)(n.strong,{children:"Amazon Managed Grafana"}),", set the ",(0,t.jsx)(n.strong,{children:"Department"})," field\u2019s value as ",(0,t.jsxs)(n.strong,{children:[(0,t.jsx)(n.em,{children:"monitoring"}),"."]})," You can choose any field and any value for this. Whatever you choose to use on the Google Workspaces side, make sure you make the mapping on Amazon Managed Grafana SAML settings to reflect that."]}),"\n",(0,t.jsx)(n.h3,{id:"upload-saml-metadata-into-amazon-managed-grafana",children:"Upload SAML metadata into Amazon Managed Grafana"}),"\n",(0,t.jsxs)(n.p,{children:["Now in the Amazon Managed Grafana console, click ",(0,t.jsx)(n.strong,{children:"Upload or copy/paste"})," option\nand select ",(0,t.jsx)(n.strong,{children:"Choose file"})," button to upload the SAML metadata file downloaded\nfrom Google Workspaces, earlier."]}),"\n",(0,t.jsxs)(n.p,{children:["In the ",(0,t.jsx)(n.strong,{children:"Assertion mapping"})," section, type in ",(0,t.jsx)(n.strong,{children:"Department"})," in the\n",(0,t.jsx)(n.strong,{children:"Assertion attribute role"})," field and ",(0,t.jsx)(n.strong,{children:"monitoring"})," in the ",(0,t.jsx)(n.strong,{children:"Admin role values"})," field.\nThis will allow users logging in with ",(0,t.jsx)(n.strong,{children:"Department"})," as ",(0,t.jsx)(n.strong,{children:"monitoring"})," to\nhave ",(0,t.jsx)(n.strong,{children:"Admin"})," privileges in Grafana so they can perform administrator duties\nsuch as creating dashboards and datasources."]}),"\n",(0,t.jsxs)(n.p,{children:["Set values under ",(0,t.jsx)(n.strong,{children:"Additional settings - optional"})," section as shown in the\nscreenshot below. Click on ",(0,t.jsx)(n.strong,{children:"Save SAML configuration"}),":"]}),"\n",(0,t.jsx)(n.p,{children:(0,t.jsx)(n.img,{alt:"AMG SAML - Assertion mapping",src:s(79919).A+"",width:"1526",height:"818"})}),"\n",(0,t.jsx)(n.p,{children:"Now Amazon Managed Grafana is set up to authenticate users using Google Workspaces."}),"\n",(0,t.jsx)(n.p,{children:"When users login, they will be redirected to the Google login page like so:"}),"\n",(0,t.jsx)(n.p,{children:(0,t.jsx)(n.img,{alt:"Google Workspace - Google sign in",src:s(58452).A+"",width:"694",height:"668"})}),"\n",(0,t.jsxs)(n.p,{children:["After entering their credentials, they will be logged into Grafana as shown in the screenshot below.\n",(0,t.jsx)(n.img,{alt:"AMG - Grafana user settings page",src:s(79581).A+"",width:"867",height:"984"})]}),"\n",(0,t.jsx)(n.p,{children:"As you can see, the user was able to successfully login to Grafana using Google Workspaces authentication."})]})}function g(e={}){const{wrapper:n}={...(0,o.R)(),...e.components};return n?(0,t.jsx)(n,{...e,children:(0,t.jsx)(l,{...e})}):l(e)}},79581:(e,n,s)=>{s.d(n,{A:()=>a});const a=s.p+"assets/images/13-07b97c6f9b4ef62b9ef34819ab5429bb.png"},79919:(e,n,s)=>{s.d(n,{A:()=>a});const a=s.p+"assets/images/11-dc9745eff63571ecae641cc00a8ed025.png"},98374:(e,n,s)=>{s.d(n,{A:()=>a});const a=s.p+"assets/images/10-5daccd292f8f8dfeff8642c1770ebcf6.png"}}]);